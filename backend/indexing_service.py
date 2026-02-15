import asyncio
import json
import os
import logging
from pathlib import Path
from typing import Dict, List, Optional

import httpx
from google.oauth2 import service_account
from googleapiclient.discovery import build


ROOT_DIR = Path(__file__).parent
PROJECT_ROOT = ROOT_DIR.parent
FRONTEND_DATA_PATH = PROJECT_ROOT / "frontend" / "src" / "data" / "blogPosts.generated.json"

BASE_URL = os.environ.get("BASE_URL", "https://graver-studio.uz").rstrip("/")
INDEXNOW_ENDPOINT = "https://www.bing.com/indexnow"
logger = logging.getLogger(__name__)


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


def _load_posts() -> List[dict]:
    if not FRONTEND_DATA_PATH.exists():
        raise FileNotFoundError(f"Blog posts data not found: {FRONTEND_DATA_PATH}")
    with FRONTEND_DATA_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _normalize_post_url(post: dict) -> Optional[str]:
    canonical = post.get("canonicalUrl")
    if isinstance(canonical, str) and canonical.startswith("http"):
        return canonical.strip()

    slug = post.get("slug")
    if not slug:
        return None
    language = post.get("language") or "ru"
    return f"{BASE_URL}/{language}/blog/{slug}"


def _collect_post_urls(limit: Optional[int] = None) -> List[str]:
    posts = _load_posts()
    unique_urls = []
    seen = set()
    for post in posts:
        url = _normalize_post_url(post)
        if not url or url in seen:
            continue
        seen.add(url)
        unique_urls.append(url)
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


def _submit_to_google_sync(urls: List[str]) -> Dict[str, int]:
    service, error = _build_google_indexing_client()
    if error:
        return {"success": 0, "failed": len(urls), "error": error}

    success = 0
    failed = 0
    for url in urls:
        try:
            service.urlNotifications().publish(body={"url": url, "type": "URL_UPDATED"}).execute()
            success += 1
            logger.info(f"✅ Отправлено в Google Indexing API: {url}")
        except Exception:
            failed += 1
        finally:
            # Avoid aggressive bursts
            import time
            time.sleep(0.3)
    return {"success": success, "failed": failed}


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
        if is_success:
            for url in payload["urlList"]:
                logger.info(f"✅ URL отправлен в Bing IndexNow: {url}")
        return {
            "success": is_success,
            "urlCount": len(payload["urlList"]),
            "statusCode": response.status_code,
        }
    except Exception as error:
        return {
            "success": False,
            "urlCount": len(payload["urlList"]),
            "error": str(error),
        }


async def submit_all_posts_to_search_engines(limit: Optional[int] = None) -> Dict[str, object]:
    urls = _collect_post_urls(limit=limit)

    bing_result = await _submit_to_bing(urls)
    google_result = await asyncio.to_thread(_submit_to_google_sync, urls)

    return {
        "success": True,
        "totalPosts": len(urls),
        "bing": bing_result,
        "google": google_result,
    }


async def check_indexing_status(slug: str, locale: str = "ru") -> Dict[str, object]:
    url = f"{BASE_URL}/{locale}/blog/{slug}"

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
