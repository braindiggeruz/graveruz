# Graver.uz — Product Requirements Document

## Original Problem Statement
Repository-wide discovery and phased SEO/content implementation for the Graver.uz project — a Create-React-App site for a Tashkent-based corporate gifting & laser engraving company. Goal: achieve 100% SEO visibility and metadata coverage across all 131 blog articles and 156 configured routes.

## Architecture
- **Frontend:** Create React App (CRA) + CRACO, deployed on Cloudflare Pages
- **Backend:** Minimal FastAPI (lead capture API only)
- **Workers:** Cloudflare Worker — server-side prerendering for bots on /ru/blog/* routes
- **Rendering:** Hybrid SPA + pre-committed static HEAD fragments for all routes
- **i18n:** Path-based routing (/ru/, /uz/), blogSlugMap.js for hreflang pairs
- **SEO pipeline:** Post-build Node.js scripts → sitemaps, RSS, HEAD fragment injection
- **Source of truth:** `main` branch only

## What's Been Implemented

### Phase 0: Repository Analysis & Baseline (2026-03-05)
- Full repo analysis, identified main as source of truth
- Tagged baseline commit as `v-baseline-2026-03-05`
- Debunked "Next.js version" myth

### Phase 1: Stabilization
- Removed 10 stale duplicate keys from `frontend/src/config/blogSlugMap.js`
- Fixed 1 broken RU→UZ mapping
- Created synthetic prerender generator `frontend/scripts/generate-missing-prerendered.mjs`
- Generated 55 missing prerendered HEAD fragments → **100% coverage for all 156 routes**

### Phase 2: SEO Overrides Completion (2026-02-current)
- Added 55 missing `blogSeoOverrides` entries to `frontend/src/data/blogSeoOverrides.js`
  - **14 RU slugs** (in `blogSeoOverrides` export)
  - **41 UZ slugs** (in `blogSeoOverridesUz` export)
- Total overrides: 78 → **133 entries** — 100% coverage for all 131 blog articles
- All metadata is unique, topic-specific, premium B2B tone
- Language-correct: RU entries in Russian, UZ entries in Uzbek Latin
- Validation: `npm run blog:validate` PASS, `npm run verify:slugmap` PASS

## Key Files
- `frontend/src/data/blogSeoOverrides.js` — SEO metadata overrides (133 entries)
- `frontend/src/data/blogPosts.js` — Article content (65 RU + 66 UZ)
- `frontend/src/config/blogSlugMap.js` — RU↔UZ hreflang slug pairs
- `frontend/prerendered/` — 156 static HEAD fragments
- `frontend/scripts/` — Post-build validation and generation scripts

## Prioritized Backlog

### P0 — Next Up
- **RU↔UZ Slug Pair Completion:** 9 RU slugs in blogSlugMap.js still lack a UZ counterpart
  - Completing this finalizes hreflang alternate link setup for all bilingual content

### P1
- **Image Variant Generation:** 217 missing AVIF/WebP responsive image variants for two article image sets
  - Fix performance gap reported by `npm run verify:images`

### P2
- **Content Quality Pass:** Rewrite ~17 RU articles that use generic boilerplate text in `contentHtml`

## Validation Commands
```bash
npm run blog:validate        # Validate article data integrity
npm run verify:slugmap       # Verify RU↔UZ slug mappings
npm run verify:indexability  # Check prerendered HEAD fragments
npm run verify:images        # Check image variant coverage
SKIP_REACT_SNAP=1 npm run build  # Production build (skip Chromium prerender)
```

## Known Pre-existing Issues (Not Regressions)
- `verify:indexability`: h1 count=0 and BlogPosting schema missing on ~30+ articles — pre-existing content structure issues, unrelated to SEO overrides
- `verify:images`: 217 missing AVIF/WebP variants — tracked as P1 backlog item
