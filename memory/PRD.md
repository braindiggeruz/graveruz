# Graver.uz — PRD & Progress

## Original Problem Statement
B2B corporate gifting website with premium dark theme, focusing on lead conversion to Telegram. Multi-phase project including CRO/SEO optimization and bilingual SEO blog.

## Architecture
```
/app
├── backend/          # FastAPI (Python) - Lead processing, Telegram notifications
├── blog/             # Astro SSG - SEO Blog (RU/UZ)
└── frontend/         # React SPA - Main landing page (RU/UZ)
```

## Completed Work

### Phase 1: Performance Optimization ✅ (Feb 2026)
- Images: PNG → WebP (97% reduction, 7MB → 168KB)
- Third-party scripts: Deferred loading (GA4, FB Pixel, PostHog)
- Service Worker: Runtime caching for static assets
- Code splitting: React.lazy for Thanks page
- Fonts: Non-blocking load with preload
- Contrast: WCAG AA compliance (text-gray-600 → text-gray-400)

### Phase 2: I18N Main Site ✅ (Feb 2026)
- URL routing: `/ru/`, `/uz/` with auto-redirect from `/`
- i18n JSON files: `ru.json`, `uz.json`
- hreflang tags: `ru`, `uz-Latn`, `x-default`
- Canonical URLs per language
- Language switcher in header
- Sitemap with hreflang links
- Thanks page translated

### Phase 3: SPA Tech SEO ✅ (Feb 2026)
- 404 page with noindex, prerender-status-code
- Invalid locales → 404 (`/de`, `/en`)
- Legacy redirects (`/thanks` → `/ru/thanks`)
- JSON-LD Organization/LocalBusiness schema
- Unique title/description per route

### Phase 4: Blog ↔ Main Linking ✅ (Feb 2026)
- Blog link in header navigation (RU/UZ)
- Blog link in mobile menu
- "Latest Posts" section with 3 articles (RU/UZ)
- Blog links in footer
- All links locale-aware

## Current State
- **Main Site**: Fully bilingual (RU/UZ), optimized for performance
- **Blog**: Astro SSG with 5 articles in each language
- **API**: Lead submission working with Telegram notifications

## Pending Issues
1. **P0**: Form submission intermittent failure (user verification pending)
2. **P2**: Meta Pixel test events blocked (infrastructure TLS issue)

## Backlog

### P1 - Next
- Phase 5: Trust pages (/process, /guarantees, /contacts)
- Phase 6: CRO/SEO overhaul per audit document
- Blog Phase 2: Author pages, enhanced schema

### P2 - Future
- Refactor App.js into components (Hero, Portfolio, Form, FAQ)
- Blog content clusters & internal linking
- Blog related posts logic

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, react-helmet-async
- **Blog**: Astro 4.x, Markdown, Tailwind
- **Backend**: FastAPI, MongoDB, httpx
- **Integrations**: Telegram Bot API, GA4, Meta Pixel, PostHog

## Key URLs
- Main site: `/ru`, `/uz`
- Blog: `/blog/ru`, `/blog/uz`
- API: `/api/leads`
