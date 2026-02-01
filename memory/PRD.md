# Graver.uz - B2B Corporate Gifting Website

## Original Problem Statement
Build a high-conversion B2B corporate gifting website for "Graver.uz" brand with:
- Premium dark theme (black + teal/cyan accents)
- Lead capture form with Telegram bot integration
- Portfolio showcase
- GA4 and Meta Pixel tracking
- Russian language UI
- **SEO Blog on SSG** for content marketing

## Tech Stack
- **Main Site (Frontend):** React, Tailwind CSS, Lucide Icons
- **Main Site (Backend):** FastAPI (Python)
- **Database:** MongoDB
- **Blog:** Astro SSG (Static Site Generator)
- **Integrations:** Telegram Bot API, GA4, Meta Pixel

## Changelog

### 2026-02-01: SEO Blog Created (SSG)
- Created full SSG blog on Astro with 5 SEO-optimized articles
- Implemented: sitemap.xml, robots.txt, rss.xml (auto-generated)
- JSON-LD schemas: Organization, WebSite, Article, BreadcrumbList, FAQPage
- Category/Tag/Author pages with proper SEO
- TOC, Related Posts, FAQ sections on each article
- Blog runs on port 4000

### 2026-02-01 (Phase 1 CRO Complete):
- Hero Section: New H1 "макет утверждаете вы, не мы"
- 2-Step Form with Progress Bar
- Portfolio CTA: "Запросить расчёт"
- Mobile Sticky CTA
- GA4 event tracking

### 2026-02-01: Bug fixes
- Fixed blurry text on /thanks page
- Fixed portfolio image-to-card mapping

## Blog Articles (5 published)

1. `/corporate-gifts-logo-tashkent` - Корпоративные подарки с логотипом в Ташкенте
2. `/logo-engraving-bulk-guide` - Гравировка логотипа на подарках оптом
3. `/supplier-corporate-gifts-tashkent` - Поставщик корпоративных подарков: чек-лист
4. `/plaques-awards-order-tashkent` - Плакетки и награды на заказ
5. `/corporate-gift-sets-what-inside` - Корпоративные подарочные наборы

## SEO Features Implemented
- ✅ Static HTML (100% SSG, no JS required for content)
- ✅ Canonical URLs on every page
- ✅ OG/Twitter meta tags
- ✅ JSON-LD schemas (Organization, Article, BreadcrumbList, FAQPage)
- ✅ Auto-generated sitemap.xml
- ✅ robots.txt with sitemap reference
- ✅ RSS feed
- ✅ Breadcrumbs
- ✅ TOC (Table of Contents)
- ✅ Related posts
- ✅ Internal linking between articles
- ✅ FAQ sections with schema markup

## File Structure
```
/app
├── backend/
│   └── server.py
├── frontend/
│   └── src/
│       ├── App.js (main landing page)
│       └── Thanks.js (/thanks page)
└── blog/                    # NEW: Astro SSG Blog
    ├── astro.config.mjs
    ├── src/
    │   ├── layouts/
    │   │   └── BaseLayout.astro
    │   ├── pages/
    │   │   ├── index.astro
    │   │   ├── [slug].astro
    │   │   ├── 404.astro
    │   │   ├── rss.xml.js
    │   │   ├── category/[category].astro
    │   │   ├── tag/[tag].astro
    │   │   └── author/[author].astro
    │   └── content/
    │       └── posts/
    │           ├── corporate-gifts-logo-tashkent.md
    │           ├── logo-engraving-bulk-guide.md
    │           ├── supplier-corporate-gifts-tashkent.md
    │           ├── plaques-awards-order-tashkent.md
    │           └── corporate-gift-sets-what-inside.md
    └── public/
        └── robots.txt
```

## Services
- Main site (React): port 3000
- Backend (FastAPI): port 8001
- Blog (Astro SSG): port 4000

## Roadmap

### Done ✅
- Main landing page with CRO optimizations
- Lead form with Telegram integration
- SEO Blog with 5 articles

### Next Steps
- Deploy blog to subdomain (blog.graver.uz)
- Submit sitemap to Google Search Console
- Add more articles (content plan)
- Trust signals block on main site
- FAQ expansion on main site
