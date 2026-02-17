import asyncio
import concurrent.futures
import json
import logging
import os
import re
import time
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime, timezone

import httpx
from google.oauth2 import service_account
from googleapiclient.discovery import build


ROOT_DIR = Path(__file__).parent
PROJECT_ROOT = ROOT_DIR.parent
SITEMAP_PATH = PROJECT_ROOT / "frontend" / "public" / "sitemap.xml"
STATE_PATH = ROOT_DIR / ".indexing_state.json"

BASE_URL = os.environ.get("BASE_URL", "https://graver-studio.uz").rstrip("/")
INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow"
logger = logging.getLogger(__name__)


def _env_int(name: str, default: int) -> int:
    value = os.environ.get(name)
    if value is None:
        return default
    try:
        parsed = int(value)
        return parsed if parsed >= 0 else default
    except ValueError:
        return default


def _env_float(name: str, default: float) -> float:
    value = os.environ.get(name)
    if value is None:
        return default
    try:
        parsed = float(value)
        return parsed if parsed >= 0 else default
    except ValueError:
        return default


def _is_google_quota_error(error_text: str) -> bool:
    normalized = (error_text or "").lower()
    return (
        " 429 " in f" {normalized} "
        or "rate_limit_exceeded" in normalized
        or "quota exceeded" in normalized
        or "too many requests" in normalized
    )


def _resolve_google_service_account_path() -> Path:
    raw_path = (
        os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON_PATH")
        or os.environ.get("GOOGLE_SERVICE_ACCOUNT_PATH")
        or "./config/google-service-account.json"
    )
    path = Path(raw_path)
    if path.is_absolute():
        return path
    return ROOT_DIR / path


def _mask_secret(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    if len(value) <= 8:
        return "*" * len(value)
    return f"{value[:4]}...{value[-4:]}"


def _collect_urls_from_sitemap(limit: Optional[int] = None) -> List[str]:
    if not SITEMAP_PATH.exists():
        raise FileNotFoundError(f"Sitemap not found: {SITEMAP_PATH}")

    content = SITEMAP_PATH.read_text(encoding="utf-8")
    urls = re.findall(r"<loc>(.*?)</loc>", content)
    unique_urls = list(dict.fromkeys([url.strip() for url in urls if url.strip()]))
    if isinstance(limit, int) and limit > 0:
        return unique_urls[:limit]
    return unique_urls


def _load_indexing_state() -> Dict[str, int]:
    if not STATE_PATH.exists():
        return {"cursor": 0, "cycles": 0}
    try:
        data = json.loads(STATE_PATH.read_text(encoding="utf-8"))
        cursor = int(data.get("cursor", 0)) if str(data.get("cursor", "0")).isdigit() else 0
        cycles = int(data.get("cycles", 0)) if str(data.get("cycles", "0")).isdigit() else 0
        return {"cursor": max(0, cursor), "cycles": max(0, cycles)}
    except Exception:
        return {"cursor": 0, "cycles": 0}


def _save_indexing_state(cursor: int, cycles: int) -> None:
    STATE_PATH.write_text(
        json.dumps({"cursor": max(0, cursor), "cycles": max(0, cycles)}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def _build_google_indexing_client():
    service_account_path = _resolve_google_service_account_path()
    if not service_account_path.exists():
        return None, f"Google service account file not found: {service_account_path}"

    credentials = service_account.Credentials.from_service_account_file(
        str(service_account_path),
        scopes=["https://www.googleapis.com/auth/indexing"],
    )
    service = build("indexing", "v3", credentials=credentials, cache_discovery=False)
    return service, None


def _submit_to_google_sync(urls: List[str], fast_fail_quota: bool = False) -> Dict[str, object]:
    service, error = _build_google_indexing_client()
    if error:
        return {"success": 0, "failed": len(urls), "error": error}

    max_urls_per_run = _env_int("GOOGLE_INDEXING_MAX_URLS_PER_RUN", 20)
    retry_max = _env_int("GOOGLE_INDEXING_RETRY_429_MAX", 3)
    retry_base_delay = _env_float("GOOGLE_INDEXING_RETRY_429_BASE_DELAY_SECONDS", 30.0)
    publish_timeout_seconds = _env_float("GOOGLE_INDEXING_PUBLISH_TIMEOUT_SECONDS", 20.0)
    run_deadline_seconds = _env_float("GOOGLE_INDEXING_RUN_DEADLINE_SECONDS", 90.0)

    target_urls = urls[:max_urls_per_run] if max_urls_per_run > 0 else []
    remaining_urls = max(0, len(urls) - len(target_urls))

    success = 0
    failed = 0
    last_error = None
    stopped_on_quota = False
    timed_out = False
    run_started_at = time.monotonic()

    def _publish_with_timeout(target_url: str) -> None:
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(
                lambda: service.urlNotifications().publish(
                    body={"url": target_url, "type": "URL_UPDATED"}
                ).execute()
            )
            future.result(timeout=max(1.0, publish_timeout_seconds))

    for url in target_urls:
        if run_deadline_seconds > 0 and (time.monotonic() - run_started_at) >= run_deadline_seconds:
            timed_out = True
            last_error = (
                f"Google submit run deadline exceeded ({run_deadline_seconds:.1f}s). "
                "Stopped current run safely."
            )
            logger.warning("⚠️ %s", last_error)
            break

        attempt = 0
        while True:
            try:
                _publish_with_timeout(url)
                success += 1
                logger.info(f"✅ Отправлено в Google Indexing API: {url}")
                break
            except concurrent.futures.TimeoutError:
                attempt += 1
                last_error = (
                    f"Google publish timeout for {url} after {publish_timeout_seconds:.1f}s"
                )
                if attempt <= retry_max:
                    backoff = retry_base_delay * (2 ** (attempt - 1))
                    logger.warning(
                        "⚠️ %s. Retry %s/%s in %.1fs",
                        last_error,
                        attempt,
                        retry_max,
                        backoff,
                    )
                    time.sleep(backoff)
                    continue

                failed += 1
                logger.error("❌ %s; moving to next URL", last_error)
                break
            except Exception as error:
                error_text = str(error)
                last_error = error_text
                attempt += 1

                if _is_google_quota_error(error_text):
                    if fast_fail_quota:
                        failed += 1
                        logger.warning(
                            "⚠️ Google quota/rate limit for %s (fast-fail mode for batch).",
                            url,
                        )
                        break

                    if attempt <= retry_max:
                        backoff = retry_base_delay * (2 ** (attempt - 1))
                        logger.warning(
                            f"⚠️ Google quota/rate limit for {url}. Retry {attempt}/{retry_max} in {backoff:.1f}s"
                        )
                        time.sleep(backoff)
                        continue
                    stopped_on_quota = True
                    failed += 1
                    logger.error("❌ Google quota still exceeded after retries; stopping current run")
                    break

                failed += 1
                logger.error(f"❌ Ошибка отправки в Google Indexing API: {url} | {error_text}")
                break

        if stopped_on_quota:
            break

    result = {
        "success": success,
        "failed": failed,
        "processed": len(target_urls),
        "remaining": remaining_urls,
        "maxPerRun": max_urls_per_run,
    }
    if last_error:
        result["error"] = last_error
    if remaining_urls > 0:
        result["note"] = (
            f"Google submit is rate-limited by run: processed {len(target_urls)} of {len(urls)} URLs. "
            "Run submit-all again later to continue."
        )
    if stopped_on_quota:
        result["quotaExceeded"] = True
    if timed_out:
        result["timedOut"] = True
    return result


async def _submit_to_bing(urls: List[str]) -> Dict[str, object]:
    api_key = os.environ.get("BING_INDEXNOW_API_KEY")
    if not api_key:
        return {
            "success": False,
            "urlCount": 0,
            "error": "BING_INDEXNOW_API_KEY is not configured",
        }

    payload = {
        "host": BASE_URL.replace("https://", "").replace("http://", ""),
        "key": api_key,
        "keyLocation": f"{BASE_URL}/indexnow-key.txt",
        "urlList": urls[:10000],
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(INDEXNOW_ENDPOINT, json=payload)
        is_success = 200 <= response.status_code < 300
        return {
            "success": is_success,
            "urlCount": len(payload["urlList"]),
            "statusCode": response.status_code,
            "error": None if is_success else response.text,
        }
    except Exception as error:
        return {
            "success": False,
            "urlCount": len(payload["urlList"]),
            "error": str(error),
        }


async def submit_all_posts_to_search_engines(limit: Optional[int] = None) -> Dict[str, object]:
    urls = _collect_urls_from_sitemap(limit=limit)

    bing_result = await _submit_to_bing(urls)
    google_result = await asyncio.to_thread(_submit_to_google_sync, urls)

    return {
        "success": True,
        "totalPosts": len(urls),
        "bing": bing_result,
        "google": google_result,
    }


async def submit_next_batch_to_search_engines(batch_size: Optional[int] = None) -> Dict[str, object]:
    urls = _collect_urls_from_sitemap(limit=None)
    total_urls = len(urls)
    if total_urls == 0:
        return {
            "success": True,
            "totalPosts": 0,
            "batchSize": 0,
            "processedUrls": [],
            "cursorStart": 0,
            "cursorEnd": 0,
            "cycles": 0,
            "bing": {"success": False, "urlCount": 0, "error": "No URLs in sitemap"},
            "google": {"success": 0, "failed": 0},
        }

    default_batch_size = _env_int("GOOGLE_INDEXING_NEXT_BATCH_SIZE", 10)
    effective_batch_size = batch_size if isinstance(batch_size, int) and batch_size > 0 else default_batch_size
    effective_batch_size = max(1, effective_batch_size)

    state = _load_indexing_state()
    cursor_start = state.get("cursor", 0)
    cycles = state.get("cycles", 0)

    if cursor_start >= total_urls:
        cursor_start = 0

    cursor_end = min(cursor_start + effective_batch_size, total_urls)
    batch_urls = urls[cursor_start:cursor_end]

    bing_result = await _submit_to_bing(batch_urls)
    google_result = await asyncio.to_thread(_submit_to_google_sync, batch_urls, True)

    cycle_completed = cursor_end >= total_urls
    next_cursor = 0 if cycle_completed else cursor_end
    next_cycles = cycles + 1 if cycle_completed else cycles
    _save_indexing_state(next_cursor, next_cycles)

    return {
        "success": True,
        "totalPosts": total_urls,
        "batchSize": len(batch_urls),
        "requestedBatchSize": effective_batch_size,
        "processedUrls": batch_urls,
        "cursorStart": cursor_start,
        "cursorEnd": next_cursor,
        "cycleCompleted": cycle_completed,
        "cycles": next_cycles,
        "remainingAfterBatch": total_urls - next_cursor,
        "bing": bing_result,
        "google": google_result,
    }


def reset_batch_state() -> Dict[str, object]:
    _save_indexing_state(0, 0)
    return {
        "cursor": 0,
        "cycles": 0,
        "message": "Batch state reset",
    }


def get_batch_status(batch_size: Optional[int] = None) -> Dict[str, object]:
    urls = _collect_urls_from_sitemap(limit=None)
    total_urls = len(urls)

    default_batch_size = _env_int("GOOGLE_INDEXING_NEXT_BATCH_SIZE", 10)
    effective_batch_size = batch_size if isinstance(batch_size, int) and batch_size > 0 else default_batch_size
    effective_batch_size = max(1, effective_batch_size)

    state = _load_indexing_state()
    cursor = state.get("cursor", 0)
    cycles = state.get("cycles", 0)

    if total_urls == 0:
        return {
            "cursor": 0,
            "cycles": cycles,
            "totalPosts": 0,
            "progress": "0/0 (0%)",
            "nextBatchStart": 0,
            "nextBatchEnd": 0,
            "batchSize": effective_batch_size,
            "remaining": 0,
            "cycleCompleted": False,
        }

    if cursor >= total_urls:
        cursor = 0

    next_batch_end = min(cursor + effective_batch_size, total_urls)
    progress_percent = int((cursor / total_urls) * 100)

    return {
        "cursor": cursor,
        "cycles": cycles,
        "totalPosts": total_urls,
        "progress": f"{cursor}/{total_urls} ({progress_percent}%)",
        "nextBatchStart": cursor,
        "nextBatchEnd": next_batch_end,
        "batchSize": effective_batch_size,
        "remaining": total_urls - cursor,
        "cycleCompleted": cursor == 0 and cycles > 0,
    }


async def check_indexing_status(url: str) -> Dict[str, object]:
    metadata = None
    metadata_error = None
    try:
        service, error = _build_google_indexing_client()
        if error:
            metadata_error = error
        else:
            metadata = await asyncio.to_thread(
                lambda: service.urlNotifications().getMetadata(url=url).execute()
            )
    except Exception as error:
        metadata_error = str(error)

    return {
        "url": url,
        "googleMetadata": metadata,
        "googleMetadataError": metadata_error,
        "googleSearchConsoleUrl": (
            "https://search.google.com/search-console/inspect"
            f"?resource_id={BASE_URL}/&url={url}"
        ),
    }


async def _check_indexnow_key_file(expected_key: Optional[str]) -> Dict[str, object]:
    key_url = f"{BASE_URL}/indexnow-key.txt"
    result = {
        "url": key_url,
        "reachable": False,
        "statusCode": None,
        "matchesApiKey": None,
        "error": None,
    }

    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(key_url)

        result["statusCode"] = response.status_code
        if 200 <= response.status_code < 300:
            result["reachable"] = True
            body = (response.text or "").strip()
            if expected_key:
                result["matchesApiKey"] = body == expected_key.strip()
    except Exception as error:
        result["error"] = str(error)

    return result


async def get_indexing_health() -> Dict[str, object]:
    google_account_path = _resolve_google_service_account_path()
    google_service, google_error = await asyncio.to_thread(_build_google_indexing_client)

    sitemap_exists = SITEMAP_PATH.exists()
    sitemap_urls = 0
    sitemap_error = None
    if sitemap_exists:
        try:
            sitemap_urls = len(_collect_urls_from_sitemap(limit=None))
        except Exception as error:
            sitemap_error = str(error)

    bing_key = os.environ.get("BING_INDEXNOW_API_KEY")
    key_file_check = await _check_indexnow_key_file(bing_key)

    warnings: List[str] = []
    if not sitemap_exists:
        warnings.append("Sitemap file is missing.")
    if sitemap_exists and sitemap_urls == 0:
        warnings.append("Sitemap is present but contains zero URLs.")
    if google_error:
        warnings.append("Google Indexing API client is not ready.")
    if not bing_key:
        warnings.append("BING_INDEXNOW_API_KEY is not configured.")
    if key_file_check.get("statusCode") and key_file_check["statusCode"] != 200:
        warnings.append("IndexNow key file is not publicly reachable with HTTP 200.")
    if key_file_check.get("matchesApiKey") is False:
        warnings.append("IndexNow key file content does not match BING_INDEXNOW_API_KEY.")

    return {
        "ok": len(warnings) == 0,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "baseUrl": BASE_URL,
        "sitemap": {
            "path": str(SITEMAP_PATH),
            "exists": sitemap_exists,
            "urlCount": sitemap_urls,
            "error": sitemap_error,
        },
        "google": {
            "serviceAccountPath": str(google_account_path),
            "serviceAccountExists": google_account_path.exists(),
            "clientReady": google_service is not None and google_error is None,
            "error": google_error,
            "maxUrlsPerRun": _env_int("GOOGLE_INDEXING_MAX_URLS_PER_RUN", 20),
            "nextBatchSize": _env_int("GOOGLE_INDEXING_NEXT_BATCH_SIZE", 10),
        },
        "bing": {
            "apiKeyConfigured": bool(bing_key),
            "apiKeyMasked": _mask_secret(bing_key),
            "indexNowEndpoint": INDEXNOW_ENDPOINT,
            "keyFile": key_file_check,
        },
        "warnings": warnings,
    }
