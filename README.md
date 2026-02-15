# Here are your Instructions

Use Node 20 LTS; npm install --legacy-peer-deps

## Blog publish auto-submit (Indexing)

One-command flow from project root:

- `npm run publish:blog`
- `npm run publish:blog:dry`

Pipeline:

- Parse markdown posts from `blog/src/content/{ru,uz}/posts`
- Validate generated `frontend/src/data/blogPosts.generated.json`
- Update `frontend/src/data/blogPosts.js`
- Auto-submit to Bing/Google Indexing API (all posts by default)

Dry-run behavior (`publish:blog:dry`):

- Parse + Validate + Update still run
- External submit to Bing/Google is skipped for this execution

After updating blog data via `node scripts/updateBlogPosts.js`, the script now auto-calls:

- `GET /api/indexing/submit-all?limit=<N>`

Default target is `http://localhost:3000` and default limit is `3`.

For `npm run publish:blog`, limit is forced to all posts by default (`AUTO_SUBMIT_INDEXING_LIMIT=10000`).
You can still override manually via env if needed.

Environment variables:

- `AUTO_SUBMIT_INDEXING_ON_PUBLISH=1` (default enabled)
- `AUTO_SUBMIT_INDEXING_LIMIT=3`
- `INDEXING_API_BASE_URL=http://localhost:3000`
- `AUTO_SUBMIT_INDEXING_TIMEOUT_MS=45000`

Disable auto-submit for local content-only work:

- `AUTO_SUBMIT_INDEXING_ON_PUBLISH=0`

Alternative dry-run env flag:

- `PUBLISH_BLOG_DRY_RUN=1 npm run publish:blog`

## Indexing secrets setup (required)

Before calling `GET /api/indexing/submit-all`, create runtime secrets for backend:

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `BING_INDEXNOW_API_KEY` in `backend/.env`.
3. Put real Google service account JSON into `backend/config/google-service-account.json`
	using `backend/config/google-service-account.json.example` as template only.
4. Keep `GOOGLE_SERVICE_ACCOUNT_PATH=./config/google-service-account.json` in `backend/.env`.

Minimal runtime check from project root:

- `curl.exe -sS "http://127.0.0.1:3000/api/indexing/submit-all?limit=10000"`

If backend is deployed on a separate API host, call that API base URL instead.
Do not use the frontend domain unless `/api/*` is explicitly proxied there.

Expected behavior:

- `bing.success` should be `true`
- `google.error` should be empty

## Google quota protection (429)

To avoid exhausting Google daily quota in one run, backend applies per-run limits:

- `GOOGLE_INDEXING_MAX_URLS_PER_RUN=20` (default)
- `GOOGLE_INDEXING_RETRY_429_MAX=3`
- `GOOGLE_INDEXING_RETRY_429_BASE_DELAY_SECONDS=30`

Practical flow:

- Run `submit-all` hourly (10-20 URLs per run)
- If 429 occurs, backend retries with exponential backoff
- Continue remaining URLs in the next runs (see `google.remaining` in response)

## Next batch endpoint (no manual limit)

Backend provides cursor-based batching endpoint:

- `GET /api/indexing/submit-next-batch`
- Optional: `GET /api/indexing/submit-next-batch?batch_size=10`

Behavior:

- Picks the next portion of URLs from sitemap automatically
- Saves progress cursor in backend state (`backend/.indexing_state.json`)
- After the last URL, cursor resets to `0` and `cycles` increments
