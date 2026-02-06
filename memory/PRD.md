# Graver.uz — PRD & Progress

## Original Problem Statement
B2B corporate gifting website with premium dark theme, focusing on lead conversion to Telegram. Multi-phase project including CRO/SEO optimization and bilingual SEO blog.

## Architecture
```
/app
├── backend/          # FastAPI (Python) - Lead processing, Telegram notifications
├── blog/             # Astro SSG - SEO Blog (RU/UZ)
└── frontend/         # React SPA - Main landing page (RU/UZ)
    └── src/config/seo.js       # Centralized SEO config (BASE_URL, ROUTE_MAP)
    └── src/components/SEOHead.js   # Universal SEO component
    └── src/components/B2CSeo.js    # B2C pages SEO component
    └── src/pages/              # Trust pages + B2C catalog
```

## Completed Work

### Phase 1: Performance Optimization ✅ (Feb 2026)
- Images: PNG → WebP (97% reduction, 7MB → 168KB)
- Third-party scripts: Deferred loading (GA4, FB Pixel)
- Service Worker: Runtime caching for static assets
- Code splitting: React.lazy for all pages
- Fonts: Non-blocking load with preload
- Contrast: WCAG AA compliance

### Phase 2: I18N Main Site ✅ (Feb 2026)
- URL routing: `/ru/`, `/uz/` with auto-redirect from `/`
- i18n JSON files: `ru.json`, `uz.json`
- hreflang tags: `ru`, `uz-Latn`, `x-default`
- Canonical URLs per language
- Language switcher in header
- Sitemap with hreflang links

### Phase 3: SPA Tech SEO ✅ (Feb 2026)
- 404 page with noindex, prerender-status-code
- Invalid locales → 404
- Legacy redirects
- JSON-LD Organization/LocalBusiness schema

### Phase 4: Blog ↔ Main Linking ✅ (Feb 2026)
- Blog link in header/footer navigation
- "Latest Posts" section with 3 articles (RU/UZ)
- Footer blog links

### Phase 5: Trust Pages + FAQ Schema ✅ (Feb 2026)
- `/ru/process`, `/uz/process` - Процесс работы
- `/ru/guarantees`, `/uz/guarantees` - Гарантии качества
- `/ru/contacts`, `/uz/contacts` - Контакты
- FAQ Schema (FAQPage) for rich snippets
- Sitemap updated with all new pages

### Phase 6: BreadcrumbList Schema ✅ (Feb 2026)
- JSON-LD BreadcrumbList on all trust pages
- DOM injection via useEffect for CSR compatibility

### Phase 7: B2C Catalog Pages ✅ (Feb 2026)
**4 new page types × 2 languages = 8 URLs:**
- `/ru/catalog-products` | `/uz/mahsulotlar-katalogi` - Витрина продукции
- `/ru/watches-with-logo` | `/uz/logotipli-soat` - Часы с логотипом
- `/ru/lighters-engraving` | `/uz/gravirovkali-zajigalka` - Зажигалки
- `/ru/engraved-gifts` | `/uz/gravirovkali-sovgalar` - Ручки/повербанки/ежедневники

### Phase 8: Comprehensive SEO & CRO Overhaul ✅ (Feb 4, 2026)
**CRITICAL FIX: Domain migration from graver.uz to www.graver-studio.uz**

**Completed:**
1. **Centralized SEO Config** (`/src/config/seo.js`):
   - Single source of truth: `BASE_URL = 'https://www.graver-studio.uz'`
   - ROUTE_MAP for B2C slug mapping (RU↔UZ)
   - Helper functions: buildCanonical(), buildAlternate(), getDefaultPath()

2. **SEOHead Component** - Universal SEO tags via react-helmet-async + DOM workaround:
   - Canonical URL (no UTM, no hash)
   - hreflang: ru, uz-Latn, x-default
   - Unique title/description per page (via i18n keys)
   - robots meta (index,follow or noindex,nofollow)
   - LocalBusiness schema (verified data only: name, url, telephone, email, areaServed)
   - FAQPage schema (only on pages with visible FAQ)

3. **Trust Pages SEO** - Unique meta for each:
   - `/ru/process` → "Как мы работаем — Graver.uz"
   - `/ru/guarantees` → "Гарантии качества — Graver.uz"
   - `/ru/contacts` → "Контакты — Graver.uz | Ташкент"

4. **Thanks Page** (`/ru/thanks`, `/uz/thanks`):
   - noindex, nofollow ✅
   - UX Fix: Removed backdrop-filter blur, text is now readable ✅
   - Analytics: view_thanks event (GA4) + Lead event (Meta Pixel) ✅

5. **404 Page**: noindex,nofollow, no canonical (correct)

6. **Schema Cleanup**:
   - LocalBusiness: Removed unverified address/geo/openingHours
   - FAQPage: Only on pages with visible FAQ content
   - BreadcrumbList: On all internal pages (not on homepage)

7. **SPA Tracking Fix**:
   - PostHog removed (unused, saves ~50KB)
   - GA4 + Meta Pixel: Guard/queue system to prevent lost page_view
   - Initial page_view deferred (150ms) to allow analytics load
   - Pending page_view flushed after analytics initialization

8. **Static Files**:
   - robots.txt: Correct domain, Disallow /thanks and /api
   - sitemap.xml: 18 URLs with correct hreflang pairs, no /thanks

**Verification Results:**
- `grep "https://graver.uz"` = 0 matches (old domain removed)
- All 6 key URLs verified: canonical ✅, hreflang ✅, robots ✅, unique title ✅

## Current State
- **Main Site**: Fully bilingual (RU/UZ), SEO-optimized
- **Blog**: 10 RU + 10 UZ SEO-optimized articles (COMPLETE)
- **Sitemap**: 38 URLs with hreflang pairs
- **SEO**: Article schema, LocalBusiness, FAQ
- **API**: Lead submission with Telegram notifications

## Blog Articles (COMPLETE 10/10 RU + 10/10 UZ)
### RU
1. kak-vybrat-korporativnyj-podarok
2. lazernaya-gravirovka-podarkov
3. podarochnye-nabory-s-logotipom
4. welcome-pack-dlya-sotrudnikov
5. brendirovanie-suvenirov
6. top-idei-podarkov-na-novyj-god (NEW)
7. kak-podgotovit-maket-logotipa (NEW)
8. podarki-na-navruz (NEW)
9. ekonomiya-na-korporativnyh-suvenirax (NEW)
10. chek-list-zakupshchika-podarkov (NEW)

### UZ
1. korporativ-sovgani-qanday-tanlash
2. lazer-gravirovka-sovgalar
3. logotipli-sovga-toplami
4. welcome-pack-yangi-xodimlar (NEW)
5. suvenir-brendlash (NEW)
6. yangi-yil-sovga-goyalari (NEW)
7. logotip-maketi-tayyorlash (NEW)
8. navruz-sovgalari (NEW)
9. suvenir-byudjetini-tejash (NEW)
10. xaridor-chek-listi-b2b (NEW)

## Pending Issues
1. **P0**: Deploy to production → GSC setup
2. **P1**: Form submission verification

## Backlog
### P1 - Next
- BreadcrumbList schema
- Internal linking improvements
- Product schema on B2C pages

### P2 - Future
- Blog author pages
- Content clusters
- Off-page SEO (local directories)

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, react-helmet-async v2
- **Blog**: Integrated into React SPA (data in `/src/data/blogPosts.js`)
- **Backend**: FastAPI, MongoDB, httpx
- **Integrations**: Telegram Bot API, GA4, Meta Pixel

## Key URLs
- Main: `/ru`, `/uz`
- Trust: `/ru/process`, `/ru/guarantees`, `/ru/contacts` (+ UZ versions)
- B2C: `/ru/catalog-products`, `/ru/watches-with-logo`, etc.
- Blog: `/ru/blog`, `/uz/blog`, `/ru/blog/:slug`, `/uz/blog/:slug`
- API: `/api/leads`

## Blog Articles (Current)
### RU (5 articles)
1. kak-vybrat-korporativnyj-podarok - Как выбрать корпоративный подарок
2. lazernaya-gravirovka-podarkov - Лазерная гравировка подарков
3. podarochnye-nabory-s-logotipom - Подарочные наборы с логотипом
4. welcome-pack-dlya-sotrudnikov - Welcome Pack для сотрудников
5. brendirovanie-suvenirov - Брендирование сувениров

### UZ (3 articles)
1. korporativ-sovgani-qanday-tanlash
2. lazer-gravirovka-sovgalar
3. logotipli-sovga-toplami

## Files Modified (Phase 9 - Blog + SEO Content)
- `/app/frontend/public/robots.txt` — clean, single sitemap
- `/app/frontend/public/sitemap.xml` — 26 URLs with blog articles
- `/app/frontend/src/index.js` — blog routes + legacy redirects
- `/app/frontend/src/App.js` — fixed blog navigation hrefs
- `/app/frontend/src/pages/BlogIndex.js` (NEW)
- `/app/frontend/src/pages/BlogPost.js` (NEW)
- `/app/frontend/src/data/blogPosts.js` — 5 RU + 3 UZ articles with full content
- `/app/SEO_ROADMAP.md` (NEW) — Detailed 30-day SEO plan
