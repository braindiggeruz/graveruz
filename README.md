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
