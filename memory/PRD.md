# Graver.uz - Product Requirements Document

## Original Problem Statement
Comprehensive technical SEO overhaul on bilingual (Russian/Uzbek) corporate gifting website "graver.uz". Key objectives:
- Fix critical production issues
- Launch fully functional and indexable blog
- Establish foundation for content marketing and lead generation

## What's Been Implemented

### Phase 1: Blog System (COMPLETED - Feb 2026)
- Blog index pages (`/ru/blog`, `/uz/blog`)
- Individual article pages (`/:locale/blog/:slug`)
- 20 articles (10 RU, 10 UZ) stored in `/app/frontend/src/data/blogPosts.js`

### Phase 2: SEO Foundation (COMPLETED - Feb 2026)
- Clean `robots.txt` with single sitemap link
- Valid `sitemap.xml` with 38 URLs (core pages + all blog articles)

### Phase 3: SEO Enhancements (COMPLETED - Feb 2026)
- Title Optimization via `blogSeoOverrides.js`
- OG tags + Twitter Card on all pages
- Article JSON-LD with image and logo

### Phase 4: Second Pass SEO Fixes (COMPLETED - Feb 8, 2026)

Based on second SEO audit, implemented critical fixes:

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| P0.1 | Canonical/Hreflang не в HTML | Добавлено в Helmet | ✅ FIXED |
| P0.2 | BreadcrumbList не видна | Инжектируется через useEffect | ✅ FIXED |
| P1.1 | Нет структуры блог-хаба | Popular + Categories + Latest | ✅ FIXED |
| P1.2 | Нет FAQPage Schema | Добавлено для 6 статей | ✅ FIXED |
| P1.3 | Нет footer linking | Быстрые ссылки в footer | ✅ FIXED |

## Architecture

```
/app
├── backend/
│   └── server.py (FastAPI + MongoDB)
└── frontend/
    ├── public/
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   ├── og-blog.png
    │   └── index.html
    └── src/
        ├── data/
        │   ├── blogPosts.js (20 articles)
        │   └── blogSeoOverrides.js (SEO + FAQ data)
        ├── pages/
        │   ├── BlogIndex.js (Hub: Popular, Categories, Latest)
        │   └── BlogPost.js (Quick Answer, FAQ, Related)
        └── App.js (Footer with Quick Links)
```

## SEO Implementation Details

### JSON-LD Schemas (per blog post)
1. **Article** — headline, description, image, dates, author, publisher
2. **BreadcrumbList** — Главная → Блог → Article
3. **FAQPage** — 2-3 FAQ per article (for 6 articles)

### Blog Hub Structure (P1.1)
- **Рекомендуемые статьи** — 6 foundational articles
- **Популярное** — trending articles grid
- **Категории** — Гайды (4), Брендирование (3), Праздники (2), Бизнес (1)
- **Последние статьи** — 3 most recent with dates

### Internal Linking (P1.3)
- Footer: Блог, Услуги, Портфолио, Контакты
- Blog posts: Related Articles (3), Related Services (5)

## Current Status
- **Local Codebase**: ✅ Ready for deployment
- **Production**: ⏳ Awaiting user action to deploy
- **Testing**: ✅ All SEO fixes verified via screenshots

## Prioritized Backlog

### P0 - Critical (Blocked)
- [ ] Production deployment (user must click "Save" in Custom Domains)

### P1 - High Priority (After Deploy)
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for `/ru/blog` and top-5 articles
- [ ] Validate Rich Results: https://search.google.com/test/rich-results

### P2 - Medium Priority
- [ ] SSR pre-rendering for SEO tags (requires Next.js)
- [ ] Core Web Vitals optimization
- [ ] More FAQ data for remaining articles

### P3 - Future Enhancements
- [ ] Blog author pages
- [ ] Markdown file storage for articles
- [ ] Off-page SEO (directory submissions)

## Verify Commands (Post-Deploy)
```powershell
# Schemas
curl.exe -s https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | Select-String "FAQPage"

# Canonical
curl.exe -s https://www.graver-studio.uz/ru/blog | Select-String "canonical"

# Blog hub
curl.exe -s https://www.graver-studio.uz/ru/blog | Select-String "blog-popular-section"
```

## Key URLs
- Preview: https://gift-seo-fix.preview.emergentagent.com
- Production: https://www.graver-studio.uz

---
Last Updated: February 8, 2026
