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
- Client-side redirects for legacy `/blog` URLs

### Phase 2: SEO Foundation (COMPLETED - Feb 2026)
- Clean `robots.txt` with single sitemap link
- Valid `sitemap.xml` with 38 URLs (core pages + all blog articles)
- Correct canonicals and hreflang tags via useEffect workaround

### Phase 3: SEO Enhancements (COMPLETED - Feb 2026)
- **Title Optimization**: 7 posts with shortened titles (≤60 chars) via `blogSeoOverrides.js`
- **Article JSON-LD**: Full schema with headline, description, dates, author, publisher
- **BreadcrumbList JSON-LD**: 3-level navigation schema on all blog posts
- **Quick Answer Blocks**: AEO-optimized featured snippets on all 20 posts
- **Related Articles**: Contextual internal links (2-3 per post)
- **Homepage Blog Section**: "Из блога" with 4 featured article cards
- **Blog Index Featured Section**: "Рекомендуемые статьи" with 6 foundational articles

## Architecture

```
/app
├── backend/
│   └── server.py (FastAPI + MongoDB)
└── frontend/
    ├── public/
    │   ├── robots.txt
    │   └── sitemap.xml
    └── src/
        ├── components/
        │   └── SEOHead.js
        ├── config/
        │   └── seo.js
        ├── data/
        │   ├── blogPosts.js (20 articles)
        │   └── blogSeoOverrides.js (SEO data map)
        ├── pages/
        │   ├── BlogIndex.js
        │   └── BlogPost.js
        └── App.js
```

## Current Status
- **Local Codebase**: ✅ Ready for deployment
- **Production**: ⏳ Awaiting user action to deploy
- **Testing**: ✅ All features verified via screenshots and Playwright

## Prioritized Backlog

### P0 - Critical (Blocked)
- [ ] Production deployment (user must click "Save" in Custom Domains)

### P1 - High Priority
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for `/ru/blog` and top 5 articles

### P2 - Medium Priority
- [ ] Add BreadcrumbList schema to non-blog pages
- [ ] Add Product schema to B2C pages
- [ ] Refactor App.js into smaller components

### P3 - Future Enhancements
- [ ] Blog author pages
- [ ] Markdown file storage for articles (replace blogPosts.js)
- [ ] Off-page SEO (directory submissions, social signals)
- [ ] Fix react-helmet-async link tag bug (remove useEffect workaround)

## Technical Notes

### Known Issues
1. `react-helmet-async` doesn't properly render `<link>` and `<script>` tags
   - **Workaround**: useEffect DOM manipulation in BlogPost.js and BlogIndex.js

2. `babel-metadata-plugin` causes "Maximum call stack size exceeded" with complex JSX
   - **Workaround**: Simplified BlogPost.js using React.createElement

### Key URLs
- Preview: https://gift-seo-fix.preview.emergentagent.com
- Production: https://www.graver-studio.uz

### Integrations
- Telegram Bot API (lead notifications)
- Google Analytics (GA4)
- Meta Pixel
