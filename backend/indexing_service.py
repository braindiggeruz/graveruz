import asyncio
import logging
import os
import re
from pathlib import Path
from typing import Dict, List, Optional

import httpx
from google.oauth2 import service_account
from googleapiclient.discovery import build


ROOT_DIR = Path(__file__).parent
PROJECT_ROOT = ROOT_DIR.parent
SITEMAP_PATH = PROJECT_ROOT / "frontend" / "public" / "sitemap.xml"

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


def _collect_urls_from_sitemap(limit: Optional[int] = None) -> List[str]:
    if not SITEMAP_PATH.exists():
        raise FileNotFoundError(f"Sitemap not found: {SITEMAP_PATH}")

    content = SITEMAP_PATH.read_text(encoding="utf-8")
    urls = re.findall(r"<loc>(.*?)</loc>", content)
    unique_urls = list(dict.fromkeys([url.strip() for url in urls if url.strip()]))
    if isinstance(limit, int) and limit > 0:
        return unique_urls[:limit]
    return unique_urls


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


def _submit_to_google_sync(urls: List[str]) -> Dict[str, object]:
    service, error = _build_google_indexing_client()
    if error:
        return {"success": 0, "failed": len(urls), "error": error}

    max_urls_per_run = _env_int("GOOGLE_INDEXING_MAX_URLS_PER_RUN", 20)
    retry_max = _env_int("GOOGLE_INDEXING_RETRY_429_MAX", 3)
    retry_base_delay = _env_float("GOOGLE_INDEXING_RETRY_429_BASE_DELAY_SECONDS", 30.0)

    target_urls = urls[:max_urls_per_run] if max_urls_per_run > 0 else []
    remaining_urls = max(0, len(urls) - len(target_urls))

    success = 0
    failed = 0
    last_error = None
    stopped_on_quota = False

    for url in target_urls:
        attempt = 0
        while True:
            try:
                service.urlNotifications().publish(body={"url": url, "type": "URL_UPDATED"}).execute()
                success += 1
                logger.info(f"✅ Отправлено в Google Indexing API: {url}")
                break
            except Exception as error:
                error_text = str(error)
                last_error = error_text
                attempt += 1

                if _is_google_quota_error(error_text):
                    if attempt <= retry_max:
                        backoff = retry_base_delay * (2 ** (attempt - 1))
                        logger.warning(
                            f"⚠️ Google quota/rate limit for {url}. Retry {attempt}/{retry_max} in {backoff:.1f}s"
                        )
                        import time
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
