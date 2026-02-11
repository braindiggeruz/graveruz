# Graver.uz - Product Requirements Document

## Original Problem Statement
Comprehensive technical SEO overhaul on bilingual (Russian/Uzbek) corporate gifting website "graver.uz" with product catalog integration.

## What's Been Implemented

### Phase 1-3: Blog & SEO Foundation (COMPLETED)
- Blog system with 20 articles (RU/UZ)
- SEO tags, canonical, hreflang
- JSON-LD schemas (Article, BreadcrumbList, FAQPage)

### Phase 4: Second Pass SEO Fixes (COMPLETED)
- Canonical/Hreflang in Helmet
- Blog Hub Structure (Popular, Categories, Latest)
- FAQPage Schema for articles
- Footer Internal Linking

### Phase 5: Lighters Catalog Integration (COMPLETED - Feb 8, 2026)

**New Product Landing Page: `/products/lighters`**

| Feature | Status |
|---------|--------|
| URL: `/ru/products/lighters` | ✅ Works |
| URL: `/uz/products/lighters` | ✅ Works |
| SEO Title | ✅ 60 chars optimized |
| Meta Description | ✅ 160 chars |
| Canonical & Hreflang | ✅ In Helmet |
| Product Schema (4 products) | ✅ JSON-LD |
| BreadcrumbList Schema | ✅ JSON-LD |
| Hero Section | ✅ With CTAs |
| Product Cards (4) | ✅ With prices |
| Engraving Types | ✅ 6 types |
| Specifications | ✅ Tech specs |
| CTA Section | ✅ Telegram + Phone |
| PDF Download | ✅ `/catalogs/graver-lighters-catalog-2026.pdf` |

**Homepage Updates:**
- New "Наша продукция" section with product preview
- "Смотреть все модели" + "Скачать каталог" CTAs
- 4 product cards with prices

**Navigation Updates:**
- "Продукция" menu link → `/products/lighters`
- Mobile menu updated

**Sitemap Updates:**
- Added `/ru/products/lighters` (priority 0.9)
- Added `/uz/products/lighters` (priority 0.8)

## Architecture

```
/app/frontend/
├── public/
│   ├── catalogs/
│   │   └── graver-lighters-catalog-2026.pdf (61.7MB)
│   ├── sitemap.xml (40+ URLs)
│   └── robots.txt
└── src/
    ├── pages/
    │   ├── LightersPage.js (NEW)
    │   ├── BlogPost.js
    │   ├── BlogIndex.js
    │   └── ...
    └── App.js (Products section added)
```

## Product Data (from PDF Catalog)

| Model | SKU | Price (UZS) | Best For |
|-------|-----|-------------|----------|
| Silver Gloss | R-109 | 140,000 | Logos, text, contour |
| Black Matte | R-110 | 150,000 | Photos, detailed |
| Black Texture | R-111 | 170,000 | Graphic, deep |
| Brushed Steel | R-112 | 160,000 | Text, universal |

Specifications: 57x38x13mm, 55-60g

## Current Status
- **Local Codebase**: ✅ Ready for deployment
- **Production**: ⏳ Awaiting deploy
- **Testing**: ✅ All features verified

## Prioritized Backlog

### P0 - Critical (Blocked)
- [ ] Production deployment

### P1 - High Priority (After Deploy)
- [ ] Submit sitemap to GSC
- [ ] Request indexing for `/products/lighters`
- [ ] Validate Product Rich Results

### P2 - Medium Priority
- [ ] Add real product images
- [ ] More product catalogs (watches, gifts)
- [ ] Product image gallery

## Verify Commands (Post-Deploy)
```powershell
# Lighters page
curl.exe -I https://www.graver-studio.uz/ru/products/lighters
# Expected: 200 OK

# PDF catalog
curl.exe -I https://www.graver-studio.uz/catalogs/graver-lighters-catalog-2026.pdf
# Expected: 200 OK, application/pdf

# Product Schema
curl.exe -s https://www.graver-studio.uz/ru/products/lighters | Select-String "Product"
# Expected: 4 Product schemas
```

## Key URLs
- Preview: https://lighting-gallery.preview.emergentagent.com
- Production: https://www.graver-studio.uz
- Lighters: `/ru/products/lighters`, `/uz/products/lighters`
- PDF Catalog: `/catalogs/graver-lighters-catalog-2026.pdf`

---
Last Updated: February 8, 2026
