# Graver.uz — PRD & Progress

## Original Problem Statement
B2B corporate gifting website with premium dark theme, focusing on lead conversion to Telegram. Multi-phase project including CRO/SEO optimization and bilingual SEO blog.

## Architecture
```
/app
├── backend/          # FastAPI (Python) - Lead processing, Telegram notifications
├── blog/             # Astro SSG - SEO Blog (RU/UZ)
└── frontend/         # React SPA - Main landing page (RU/UZ)
    └── src/pages/    # Trust pages + B2C catalog
    └── src/components/B2CForm.js  # B2C lead qualification form
```

## Completed Work

### Phase 1: Performance Optimization ✅ (Feb 2026)
- Images: PNG → WebP (97% reduction, 7MB → 168KB)
- Third-party scripts: Deferred loading (GA4, FB Pixel, PostHog)
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

**B2C Form Qualification:**
- Category select (watches/lighters/pen/powerbank/diary)
- Conditional fields (sides/fuel for lighters, color for watches, method for diary)
- Mandatory confirm checkbox: "Выбираю продукцию Graver (не своё)"
- File upload required (logo/text)
- Quantity, city, deadline, phone
- Submit to /api/leads with lead_type: "b2c_catalog"

**SEO on each page:**
- Unique title/meta description
- Canonical URL per locale
- BreadcrumbList JSON-LD (3 levels: Home → Catalog → Product)
- FAQPage JSON-LD
- Important disclaimer: "Работаем на нашей продукции"

**Navigation updates:**
- Header nav: "Продукция" link to catalog
- B2C corridor link after services section

## Current State
- **Main Site**: Fully bilingual (RU/UZ), optimized, with trust pages
- **Blog**: Astro SSG with 5 articles in each language
- **API**: Lead submission working with Telegram notifications
- **SEO**: Full schema markup (Organization, LocalBusiness, FAQPage)

## Pending Issues
1. **P0**: Form submission verification (user testing pending)
2. **P2**: Meta Pixel test events blocked (infrastructure TLS issue)

## Backlog

### P1 - Next
- Phase 6: CRO/SEO overhaul per audit document
- Blog Phase 2: Author pages, enhanced schema

### P2 - Future
- Refactor App.js into components
- Blog content clusters & internal linking

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, react-helmet-async
- **Blog**: Astro 4.x, Markdown, Tailwind
- **Backend**: FastAPI, MongoDB, httpx
- **Integrations**: Telegram Bot API, GA4, Meta Pixel, PostHog

## Key URLs
- Main: `/ru`, `/uz`
- Trust: `/ru/process`, `/ru/guarantees`, `/ru/contacts` (+ UZ versions)
- Blog: `/blog/ru`, `/blog/uz`
- API: `/api/leads`
