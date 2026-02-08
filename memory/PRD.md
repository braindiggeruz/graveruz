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
- **Article JSON-LD**: Full schema with headline, description, dates, author, publisher, image, logo
- **BreadcrumbList JSON-LD**: 3-level navigation schema on all blog posts
- **Quick Answer Blocks**: AEO-optimized featured snippets on all 20 posts
- **Related Articles**: Contextual internal links (2-3 per post)
- **Homepage Blog Section**: "Из блога" with 4 featured article cards
- **Blog Index Featured Section**: "Рекомендуемые статьи" with 6 foundational articles

### Phase 4: SEO Corrections (COMPLETED - Feb 8, 2026)
Based on detailed audit document, implemented 6 critical corrections:

| # | Correction | Status | Files Changed |
|---|-----------|--------|---------------|
| 1 | Canonical & Hreflang | ✅ Already existed (useEffect) | — |
| 2 | Meta robots & charset | ✅ Added | `index.html` |
| 3 | Schema.org Article (image, logo) | ✅ Enhanced | `BlogPost.js` |
| 3 | Schema.org BreadcrumbList | ✅ Already existed | — |
| 4 | Internal links to services | ✅ Enhanced (5 services with desc) | `BlogPost.js` |
| 5 | OG tags | ✅ Already existed (8 tags) | — |
| 6 | Pre-Deploy Checklist | ✅ All 14 checks passed | — |

## Architecture

```
/app
├── backend/
│   └── server.py (FastAPI + MongoDB)
└── frontend/
    ├── public/
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   ├── og-blog.png (1.2MB)
    │   └── index.html (OG + Twitter + robots meta)
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

## SEO Implementation Details

### Canonical & Hreflang (via useEffect)
```javascript
// BlogPost.js - lines 34-61
canonical → https://www.graver-studio.uz/{locale}/blog/{slug}
hreflang="ru" → ru version URL
hreflang="uz" → uz version URL  
hreflang="x-default" → ru version (fallback)
```

### JSON-LD Schemas (via useEffect)
```javascript
// BlogPost.js - lines 63-106
Article: headline, description, image, datePublished, author, publisher with logo
BreadcrumbList: Главная → Блог → Article Title
```

### Meta Tags (index.html)
```html
<meta name="robots" content="index, follow" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="language" content="Russian" />
<meta property="og:image" content=".../og-blog.png" />
<meta name="twitter:card" content="summary_large_image" />
```

## Current Status
- **Local Codebase**: ✅ Ready for deployment
- **Production**: ⏳ Awaiting user action to deploy
- **Testing**: ✅ All 14 Pre-Deploy checks passed

## Prioritized Backlog

### P0 - Critical (Blocked)
- [ ] Production deployment (user must click "Save" in Custom Domains)

### P1 - High Priority (After Deploy)
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for `/ru/blog` and top-5 articles
- [ ] Validate Rich Results: https://search.google.com/test/rich-results
- [ ] Validate OG: https://developers.facebook.com/tools/debug/

### P2 - Medium Priority
- [ ] FAQPage Schema on homepage
- [ ] Product Schema on B2C pages
- [ ] Refactor App.js into smaller components

### P3 - Future Enhancements
- [ ] Blog author pages
- [ ] Markdown file storage for articles (replace blogPosts.js)
- [ ] Off-page SEO (directory submissions, social signals)
- [ ] Fix react-helmet-async link tag bug (remove useEffect workaround)
- [ ] SSR/Pre-rendering for SEO tags (requires Next.js migration)

## Technical Notes

### Known Issues
1. `react-helmet-async` doesn't properly render `<link>` and `<script>` tags
   - **Workaround**: useEffect DOM manipulation in BlogPost.js

2. `babel-metadata-plugin` causes "Maximum call stack size exceeded" with complex JSX
   - **Workaround**: Simplified BlogPost.js using React.createElement

### Key URLs
- Preview: https://gift-seo-fix.preview.emergentagent.com
- Production: https://www.graver-studio.uz

### Pre-Deploy Checklist (All Passed ✅)
1. og-blog.png exists (1.2MB)
2. Build successful
3. OG tags in index.html (8 tags)
4. Meta robots in index.html
5. Schema.org in BlogPost.js (2 JSON-LD)
6. Canonical in BlogPost.js
7. Hreflang in BlogPost.js (3 links)
8. Related services in BlogPost.js
9. robots.txt accessible (HTTP 200)
10. sitemap.xml accessible (HTTP 200)
11. OG tags on homepage (8 tags)
12. Meta robots on homepage
13. Twitter Card on homepage
14. og:image accessible (HTTP 200)

### Integrations
- Telegram Bot API (lead notifications)
- Google Analytics (GA4)
- Meta Pixel

## Verify Commands (Post-Deploy)
```powershell
curl.exe -I https://www.graver-studio.uz/robots.txt
curl.exe -I https://www.graver-studio.uz/sitemap.xml
curl.exe -s https://www.graver-studio.uz/ | Select-String "og:image"
curl.exe -s https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov | Select-String "canonical"
```

---
Last Updated: February 8, 2026
