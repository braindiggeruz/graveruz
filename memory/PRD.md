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
- **2026-02-01**: Fixed blurry text on /thanks page (removed backdrop-filter from text container)
- **2026-02-01**: Fixed portfolio image-to-card mapping (Awards→1.png, Watches→10.png, Thermoses→3.png, Gift Set→4.png)

## Completed Features
- ✅ Landing page with hero, benefits, services, portfolio, process, FAQ sections
- ✅ Contact form with validation and spam protection
- ✅ Telegram bot integration for lead notifications
- ✅ /thanks page with crisp text
- ✅ GA4 and Meta Pixel tracking scripts
- ✅ Portfolio section with correct image mapping

## Known Issues
- ⚠️ PR_END_OF_FILE_ERROR during Meta Pixel testing (TLS/infrastructure issue)
- ⚠️ Form submission occasionally fails for users in Preview (needs monitoring)

## Upcoming Tasks (P1)
1. Full CRO/UX/SEO overhaul:
   - Update Hero section copy
   - Add B2B segments block (4 cards)
   - Portfolio filters
   - Process redesign (4 steps)
   - FAQ update (6 questions)
   - Simplified form fields
   - Mobile sticky CTA bar
   - Tech SEO (title, meta, Schema.org JSON-LD)
   - Image optimization (WebP/AVIF)

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
        ├── App.css
        ├── App.js (main landing page)
        └── Thanks.js (/thanks page)
```
