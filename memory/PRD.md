# Graver.uz - B2B Corporate Gifting Website

## Original Problem Statement
Build a high-conversion B2B corporate gifting website for "Graver.uz" brand with:
- Premium dark theme (black + teal/cyan accents)
- Lead capture form with Telegram bot integration
- Portfolio showcase
- GA4 and Meta Pixel tracking
- Russian language UI

## Tech Stack
- Frontend: React, Tailwind CSS, Lucide Icons
- Backend: FastAPI (Python)
- Database: MongoDB
- Integrations: Telegram Bot API, GA4, Meta Pixel

## Changelog
- **2026-02-01 (Phase 1 CRO Complete):**
  - Hero Section: New H1 "макет утверждаете вы, не мы", updated subheadline
  - CTA Priority: "Запросить расчёт" is now PRIMARY (green), Telegram is SECONDARY (outline)
  - 2-Step Form with Progress Bar: Step 1 (Company, Order Type, Quantity), Step 2 (Name, Phone, Email, Comment)
  - Portfolio CTA: Changed "Хочу так же" → "Запросить расчёт" (scrolls to form)
  - Mobile Sticky CTA: Two buttons (Запросить расчёт + Telegram icon)
  - Added alt-text to portfolio images for SEO
  - Added GA4 event tracking: form_step_1_complete, form_step_2_complete
- **2026-02-01**: Fixed blurry text on /thanks page
- **2026-02-01**: Fixed portfolio image-to-card mapping

## Completed Features
- ✅ Landing page with hero, benefits, services, portfolio, process, FAQ sections
- ✅ 2-step contact form with validation, progress bar, and spam protection
- ✅ Telegram bot integration for lead notifications
- ✅ /thanks page with crisp text
- ✅ GA4 and Meta Pixel tracking scripts
- ✅ Portfolio section with correct image mapping and SEO alt-text
- ✅ Mobile sticky CTA bar
- ✅ Hero with optimized CTA hierarchy

## Known Issues
- ⚠️ PR_END_OF_FILE_ERROR during Meta Pixel testing (TLS/infrastructure issue)

## Roadmap

### Phase 2: HIGH PRIORITY (Next)
- [ ] Trust Signals Block: "50+ компаний", "1000+ заказов", "Гарантия качества"
- [ ] Services: Add "Для кого" (HR/Marketing/Events) and "Цена от"
- [ ] FAQ: Add 5 key objection-handling questions

### Phase 3: MEDIUM PRIORITY
- [ ] GA4 Events: click_telegram, click_phone, portfolio_click, service_click
- [ ] Microcopy: "Обсудить проект" → "Запросить расчёт" everywhere

### Phase 4: SEO & POLISH
- [ ] Schema.org JSON-LD: Organization, LocalBusiness, FAQ
- [ ] Meta description optimization
- [ ] Image optimization: WebP format, lazy-load

## File Structure
```
/app
├── backend/
│   ├── .env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, MONGO_URL, DB_NAME)
│   ├── requirements.txt
│   └── server.py
└── frontend/
    ├── .env (REACT_APP_BACKEND_URL)
    ├── public/
    │   ├── index.html (tracking scripts)
    │   └── portfolio/ (1.png, 3.png, 4.png, 5.png, 6.png, 10.png)
    └── src/
        ├── App.css (custom select styling added)
        ├── App.js (main landing page - CRO optimized)
        └── Thanks.js (/thanks page)
```
