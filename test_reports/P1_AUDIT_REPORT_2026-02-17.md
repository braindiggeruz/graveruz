# P1 SEO Audit Report (2026-02-17)

## Scope
- Canonical/hreflang consistency across localized templates
- Internal linking depth and money-page discoverability
- Structured data consistency and schema integrity

## Evidence reviewed
- `frontend/src/components/SeoMeta.js`
- `frontend/src/components/SEOHead.js`
- `frontend/src/components/B2CSeo.js`
- `frontend/src/index.js`
- `frontend/src/pages/BlogIndex.js`
- `frontend/src/pages/BlogPost.js`
- `frontend/src/pages/CatalogPage.js`
- `frontend/src/pages/WatchesPage.js`
- `frontend/src/pages/LightersPage.js`
- `frontend/src/pages/EngravedGiftsPage.js`
- `frontend/src/pages/ProcessPage.js`
- `frontend/src/pages/GuaranteesPage.js`
- `frontend/src/pages/ContactsPage.js`

---

## 1) Canonical consistency

### Findings
1. **Most templates are consistent**
   - Core helper (`buildCanonical`, `buildAlternate`) normalizes slash-final URLs.
   - `SEOHead` and B2C pages that use helper functions produce stable canonical/hreflang output.

2. **One inconsistent template fixed in this pass**
   - `LightersPage` previously hardcoded canonical/alternate URLs without helper normalization and with a schema breadcrumb URL to non-routed `/products`.
   - This is now fixed to helper-based canonical/alternate generation and breadcrumb item points to existing localized catalog route.

### Status
- Canonical generation: **PASS with fix applied**
- Hreflang generation: **PASS with fix applied**
- Legacy route redirects in `index.js`: **PASS**

---

## 2) Internal linking depth (money pages)

### Findings
1. **Blog hub -> money pages present (strong)**
   - `BlogIndex` has explicit money-link block for both RU/UZ.
2. **Blog post -> money pages present (strong)**
   - `BlogPost` injects contextual money links + utility links + services links.
3. **Home -> blog + catalog present (baseline covered)**
   - Main nav and content links include blog/catalog entry points.
4. **Potential link equity dilution risk remains in blog body content**
   - Internal links inside long-form article HTML are normalized, but editorial anchors are not centrally enforced by a single policy (depends on post content quality).

### Status
- Depth from indexable pages to money pages: **GOOD**
- Recommended next tightening: **editorial anchor policy by template/data validation**

---

## 3) Schema consistency

### Findings
1. **Coverage is broad but implementation style is mixed**
   - Some pages use `<Helmet>` inline JSON-LD.
   - Some pages inject JSON-LD via `document.createElement('script')` in effects.
2. **Blog schema is rich and largely complete**
   - `BlogPost`: BlogPosting + BreadcrumbList + FAQPage (when FAQ >= 2).
   - `BlogIndex`: CollectionPage + ItemList + BreadcrumbList.
3. **Cross-template parity is not fully standardized**
   - `Process/Guarantees/Contacts` use breadcrumb schema only via DOM injection.
   - Product/catalog pages use richer `@graph` objects.

### Status
- Schema presence on key templates: **PASS**
- Schema implementation consistency: **PARTIAL (P1 follow-up)**

---

## Changes implemented during P1 pass

1. **Canonical/hreflang normalization on lighters page**
   - Switched to `buildCanonical` + `buildAlternate`.
2. **Schema breadcrumb route correctness on lighters page**
   - Replaced non-routed `/products` breadcrumb URL with localized catalog route (`/catalog-products/` or `/mahsulotlar-katalogi/`).

3. **Canonical URL normalization baseline expanded**
   - `buildCanonical` and `buildAlternate` now normalize to slash-final paths through shared `normalizeSeoPath` logic.
   - Blog hub/article canonical and alternate URLs were aligned to slash-final format for parity with sitemap output.

4. **Sitemap generation aligned with final 200 routes**
   - `postbuild-sitemap.js` now enforces trailing slash in generated `<loc>` URLs to avoid redirect hops from sitemap submissions.

---

## Validation (post-fix)

Executed after latest P1 changes:

1. `npm run build` (with react-snap postbuild): **PASS**
   - Prerender crawl completed `59/59` routes.

2. `npm run verify:indexability`: **PASS**
   - `OK: checked 52 blog URL(s)`.

3. No new blocking SEO regressions detected in this run.

---

## P1 prioritized fix queue (next)

1. **P1-HIGH: Remove duplicate fallback meta injection paths where Helmet is already authoritative**
   - Primary candidate: `BlogIndex` (manual `document.head` meta/link injection duplicates SeoMeta responsibilities).
2. **P1-MEDIUM: Standardize schema rendering path**
   - Prefer one consistent pattern (`Helmet` JSON-LD) across all templates to reduce hydration/race edge cases.
3. **P1-MEDIUM: Add validation script for internal anchor policy**
   - Enforce minimum count of money-page anchors per blog post and locale.
4. **P1-LOW: Harmonize organization/site-wide schema primitives**
   - Reuse a shared schema builder to keep IDs and fields stable across templates.

---

## Conclusion
P1 audit confirms strong baseline after P0: canonical/hreflang architecture is mostly healthy, internal linking depth to commercial pages is already good, and schema coverage is present on all key templates. One concrete canonical/schema routing issue on `LightersPage` has been fixed in this pass. Remaining P1 work is mostly consistency hardening rather than critical indexing blockers.
