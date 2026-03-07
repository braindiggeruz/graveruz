# Release Candidate QA — Graver.uz

**Branch:** `hardening/pre-release-2026-02`  
**Base:** `origin/main` @ `fbf6739`  
**Date:** 2026-02-12  
**Status:** READY FOR MANUAL REVIEW

---

## What Was Fixed in This Pass

| # | Category | Fix | Validator |
|---|---|---|---|
| 1 | SEO Metadata | 55 missing `blogSeoOverrides` entries added (RU + UZ) | `blog:validate` PASS |
| 2 | Hreflang Pairs | 3 new RU→UZ slug mappings; 13 UZ→RU reverse mappings | `verify:slugmap` PASS |
| 3 | Hreflang Pairs | Fixed 3 asymmetric slug pairs (UZ slugs wrongly claimed by two RU articles) | `verify:canonical` PASS |
| 4 | Images | 217 missing AVIF/WebP/OG variants generated for 8 PNG article sets | `verify:images` PASS |
| 5 | Internal Links | Footer bare hash anchors (`#services`, `#portfolio`, `#contact`) fixed to locale-correct `Link` components | Manual |
| 6 | Tracking | `trackPhoneClick()` added; global event delegation wired for `[data-track="tel"]` | Manual |
| 7 | SEO/Schema | `verify:indexability` hreflang regex fixed (`ru-RU` → `ru`, `uz-UZ` → `uz-Latn`) | `verify:indexability` |
| 8 | SEO/Schema | BlogPosting + BreadcrumbList schema injected into 85 prerendered HEAD fragments | `verify:indexability` |
| 9 | Tooling | `validate-canonical-hreflang.js` completely broken (CJS vs ESM). Rewritten as `validate-canonical-hreflang.mjs` | `verify:canonical` PASS |

---

## Current Validation Status

| Script | Result | Notes |
|---|---|---|
| `npm run build` | ✅ PASS | |
| `npm run blog:validate` | ✅ PASS | 131/131 articles valid |
| `npm run verify:slugmap` | ✅ PASS | All mapped pairs bidirectional |
| `npm run verify:images` | ✅ PASS | 81/81 PNG sources have full variants |
| `npm run verify:canonical` | ✅ PASS | No hard errors; 0 warnings |
| `npm run verify:indexability` | ⚠ 122 issues | All are `h1 count = 0` — known architecture limitation (see below) |
| `npm run verify:hydrated-seo` | ⛔ N/A | Requires Chromium headless — unavailable in CI |

---

## Known Non-Blocking Limitations

### 1. `h1 count = 0` on all 122 prerendered article pages
- **Root cause:** Prerendered files are HEAD-only fragments. The `<h1>` lives in the React-rendered body which crawlers receive after JS execution. This is a structural limitation of the CRA + prerender-fragment architecture.
- **Impact on SEO:** Low. Google and Bing hydrate client-side JS and will see the h1.
- **Action required:** None before deploy. Could be addressed in a future SSR migration (not this pass).

### 2. 9 RU slugs have no UZ alternate
Six of the nine original unmapped RU slugs still have no UZ counterpart:
- `keys-welcome-pack-enps-uzbekistan`
- `korporativnye-podarki-uzbekistan`
- `podarki-8-marta-20-idej`
- `podarki-na-8-marta-sotrudnitsam`
- `podarki-na-den-rozhdeniya-sotrudnika`
- `welcome-pack-dlya-sotrudnikov-gid`
- `case-study-welcome-pack-enps`
- `korporativnye-podarki-b2b-etiket`
- `podarki-sotrudnikam-loyalnost`

These produce no hreflang alternate tag — intentional, no UZ counterpart articles exist.

### 3. `validate-canonical-hreflang.js` (old file) is superseded
The old `.js` file is still present but dead — the new `.mjs` file replaces it. Safe to delete in a future cleanup commit.

### 4. `verify:hydrated-seo` unavailable
Requires Chromium in CI. Must be run manually in Manus/preview (see MANUAL_TEST_URLS.md).

---

## What Must Be Manually Verified Before Merge/Deploy

1. **Phone click tracking** — Click any phone number on the live preview. Confirm `Contact` event fires in Meta Pixel Events Manager (or check the browser console for `fbq` call).
2. **Footer anchor navigation** — From a blog post page, click "Услуги" / "Xizmatlar" in the footer. Confirm it navigates to the homepage services section, not the current page.
3. **Locale switching** — On a blog post that has a UZ counterpart, confirm the locale switcher links to the correct UZ URL and vice versa.
4. **One new metadata article** — Visit any article that received a new SEO override (e.g., `/ru/blog/case-study-welcome-pack-enps/`) in a browser. Confirm the `<title>` and `<meta name="description">` in DevTools show the new custom values, not the auto-generated fallback.
5. **OG image resolution** — Visit one of the newly generated OG images (e.g., `https://graver-studio.uz/images/blog/case-study-welcome-pack-enps-header-og.jpg`) and confirm it loads.

---

## Go / No-Go Criteria

**GO if:**
- All 5 manual checks above pass
- Build succeeds on deploy target
- No new JS console errors on representative pages

**NO-GO if:**
- Phone tracking event does not fire
- Footer anchor links navigate to wrong page
- Any new article title/description shows generic fallback metadata instead of the custom value
- Build fails on deploy target
