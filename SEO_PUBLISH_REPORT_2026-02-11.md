# SEO Publish Report - 2026-02-11

## Scope
- Added 10 RU + 10 UZ blog posts from the DOCX pack into the frontend blog data store.
- Added RU/UZ hreflang pairings and sitemap entries for all new posts.
- Updated react-snap include list to prerender the new routes.
- Verified prerender output and canonical/hreflang tags on sample pages.

## New Posts (RU slugs)
- korporativnye-podarki-s-logotipom-polnyy-gayd
- korporativnye-podarki-s-gravirovkoy-metody
- lazernaya-gravirovka-podarkov-tehnologiya
- merch-dlya-kompanii-brendirovanie
- podarki-sotrudnikam-hr-gayd
- podarki-klientam-partneram-vip
- brendirovannye-zazhigalki-i-chasy-s-logotipom
- korporativnye-podarochnye-nabory
- korporativnye-podarki-na-navruz
- welcome-pack-novym-sotrudnikam

## New Posts (UZ slugs)
- korporativ-sovgalar-logotip-bilan-to-liq-qollanma
- korporativ-sovgalar-gravyurasi-usullari
- lazer-gravyurasi-texnologiyasi
- kompaniya-merchi-brendlash
- xodimlar-uchun-sovgalar-hr-qollanma
- mijoz-hamkorlar-uchun-sovgalar-vip
- logotipli-zajigalka-va-soat
- korporativ-sovga-toplamlari
- navruz-uchun-korporativ-sovgalar
- yangi-xodimlar-uchun-welcome-pack

## Updates
- Blog data now includes HTML body content for the new posts.
- Blog rendering supports HTML content when provided.
- react-snap include list extended with 20 new blog routes.
- sitemap.xml now lists 20 RU + 20 UZ blog URLs with hreflang pairs.

## Build + Prerender Verification
- npm install required --legacy-peer-deps due to date-fns/react-day-picker peer conflict.
- Build succeeded and react-snap crawled 59 routes.
- Prerender check confirmed all new RU/UZ blog pages were generated.
- Sample pages verified for canonical + hreflang tags:
  - /ru/blog/korporativnye-podarki-s-logotipom-polnyy-gayd
  - /uz/blog/korporativ-sovgalar-logotip-bilan-to-liq-qollanma

## Notes / Manual Checks Needed
- The DOCX content includes multiple "NUZHNO PODTVERDIT" markers about delivery, client items policy, and address details. Please confirm these claims on the site before final publishing.
- Internal links were preserved from the DOCX pack; validate that all linked URLs resolve on production if needed.
