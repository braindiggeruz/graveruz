# graveruz prerender worker

Cloudflare Worker for bot-only prerendering of React SPA blog pages.

## Owner 2-3 clicks checklist

1. Deploy worker (`wrangler deploy`).
2. In dashboard attach two routes only (RU/UZ blog on non-www).
3. Run two bot curl checks and verify `x-prerender` headers.

## Scope

- Handles only:
  - `graver-studio.uz/ru/blog*`
  - `graver-studio.uz/uz/blog*`
- Does not change slugs/routes.
- Does not change canonical strategy (non-www remains canonical).
- Does not modify frontend routing.

## Anti-loop guarantee

- Intercepted host is non-www route (`graver-studio.uz/...`).
- Prerender target order is always off-route:
  1. `https://graveruz.pages.dev/<same path>`
  2. `https://www.graver-studio.uz/<same path>`
- The worker explicitly rejects render candidates that match intercepted `host+path`.

## Behavior

- `PRERENDER_ENABLED="0"`: full passthrough mode (routes stay attached, no prerender attempts).
- `HEAD` requests: passthrough to origin (no prerender).
- Non-bot `GET`: passthrough to origin.
- Bot `GET` on blog paths:
  - Requires `Accept` to include `text/html`.
  - Skips prerender when `Cookie` or `Authorization` header is present.
  - Uses `caches.default` with normalized bot-only cache key.
  - Renders via Browser Rendering binding.
  - Anti-loop rendering target order:
    1. `https://graveruz.pages.dev/<path>`
    2. `https://www.graver-studio.uz/<path>`
  - Returns headers:
    - `x-prerender: 1`
    - `x-prerender-cache: HIT|MISS`
  - On errors/fallback only:
    - `x-prerender-error: 1`

## Cache safety

- Cache key strips query/hash and appends bot marker `__bot=1`.
- Prevents bot/non-bot cache mixing.
- Does not cache prerender responses with:
  - status `>= 400`
  - `Set-Cookie` header present

## Cost protections

- Render timeout (`RENDER_TIMEOUT_MS`).
- Blocks heavy resources (`image`, `font`, `media`) during prerender.
- Minimal bot rate limit per IP+UA (`BOT_RATE_LIMIT_PER_MIN`).
- Circuit breaker on Browser Rendering 429: sets cache breaker key for 10 minutes and bypasses prerender attempts while active.

## Error reason → action

| `x-prerender-error-reason` | Meaning | What to do |
|---|---|---|
| `rate_limit` | Browser Rendering quota/rate exceeded | Wait for breaker TTL (~10m), reduce bot traffic, keep `Retry-After` respected |
| `timeout` | Render timed out | Increase `RENDER_TIMEOUT_MS` carefully or reduce page weight |
| `binding` | Browser binding/config issue | Verify `[browser] binding = "BROWSER"` and account Browser Rendering entitlement |
| `nav` | Navigation failure | Check render candidate availability (`pages.dev` / `www`) |
| `content` | Content extraction issue | Validate rendered page can reach canonical selector |
| `unknown` | Unclassified error | Check Worker logs (`wrangler tail`) |

## Deploy via Wrangler

```powershell
Set-Location F:\projects\graveruz\workers\prerender
npm ci
npx wrangler deploy
```

Expected output includes deployed worker name `graveruz-prerender` and version hash.

Confirm current worker metadata:

```powershell
npx wrangler deployments list
```

## Bindings (Browser Rendering)

- Binding name must be exactly `BROWSER`.
- If Browser Rendering is missing in account:
  - Cloudflare Dashboard → Workers & Pages → Browser Rendering → Enable
  - keep `PRERENDER_PROVIDER=cloudflare`.
- If Browser Rendering is unavailable by plan/entitlement:
  - switch to fallback provider only by vars/secrets:
    - `PRERENDER_PROVIDER=prerenderio`
    - secret `PRERENDER_TOKEN`
  - fallback is documented only; do not enable unless needed.

## Routes (few clicks)

Dashboard path:

- Workers & Pages → Workers → `graveruz-prerender` → Triggers → Routes → Add route

Attach ONLY:

- `graver-studio.uz/ru/blog*`
- `graver-studio.uz/uz/blog*`

Do NOT attach:

- whole domain (`graver-studio.uz/*`)
- any `www.graver-studio.uz/*` route

## Rollback (one click)

- Workers & Pages → Workers → `graveruz-prerender` → Triggers → Routes → delete both blog routes.
- Traffic immediately falls back to existing SPA behavior.

## Fast disable without route changes

- Set env var `PRERENDER_ENABLED=0` for this Worker and redeploy.
- Routes remain attached, but Worker will always passthrough to origin.

## Setup (Cloudflare Dashboard)

1. Create Worker and deploy this project.
2. Ensure Browser Rendering is enabled for your account.
3. Add browser binding named `BROWSER`.
4. Attach routes only:
   - `graver-studio.uz/ru/blog*`
   - `graver-studio.uz/uz/blog*`
5. Optional fallback provider (`prerenderio`): set `PRERENDER_PROVIDER=prerenderio` and secret `PRERENDER_TOKEN`.

## QA after deploy

### 1) Bot should get prerendered HTML

```powershell
curl -A "Googlebot" -s https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | findstr /i "rel=\"canonical\" hreflang application/ld+json <h1"
curl -A "Googlebot" -s https://graver-studio.uz/uz/blog/korporativ-sovgani-qanday-tanlash | findstr /i "rel=\"canonical\" hreflang application/ld+json <h1"
```

### 2) Bot headers should show prerender + cache info

```powershell
curl -A "Googlebot" -I https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok
```

Expected:

- `x-prerender: 1`
- `x-prerender-cache: HIT` or `MISS`
- no `X-Robots-Tag: noindex`

### 3) Normal user should not get prerender header

```powershell
curl -I https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok
```

Expected:

- no `x-prerender` header (or explicitly `x-prerender: 0` if you later add it)
- page behavior unchanged

### 4) Confirm no noindex leakage

```powershell
curl -I https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | findstr /i "X-Robots-Tag"
curl -I https://graver-studio.uz/uz/blog/korporativ-sovgani-qanday-tanlash | findstr /i "X-Robots-Tag"
```

Expected: no output, or no `noindex` value.

### Cache-key normalization checks (query ignored)

```powershell
curl -A "Googlebot" -I "https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok?utm_source=test"
curl -A "Googlebot" -I "https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok?x=1"
```

Expected:

- same normalized cache object behavior (no query-based cache explosion).

### Sanity performance note

- Run the same bot curl twice; second request should usually be faster and show `x-prerender-cache: HIT`.

## Rollback

Fast rollback options:

1. Disable/remove the two Worker routes in Cloudflare Dashboard.
2. Or deploy previous Worker version.
3. Emergency bypass: set `PRERENDER_PROVIDER` invalid and keep route (worker falls back with `x-prerender-error: 1`).
