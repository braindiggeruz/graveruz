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

    success = 0
    failed = 0
    last_error = None
    for url in urls:
        try:
            service.urlNotifications().publish(body={"url": url, "type": "URL_UPDATED"}).execute()
            success += 1
            logger.info(f"✅ Отправлено в Google Indexing API: {url}")
        except Exception as error:
            failed += 1
            last_error = str(error)
    result = {"success": success, "failed": failed}
    if last_error:
        result["error"] = last_error
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
