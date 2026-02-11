# SEO Worklog Report (2026-02-11)

## 1) Project verification (факты)

Команды:
- `git rev-parse --show-toplevel`
- `git branch --show-current`
- `git status`
- `git log -5 --oneline`
- `dir`
- `dir frontend`
- `node -v`
- `npm -v`

Вывод:
- repo root: F:/projects/graveruz
- branch: seo-p0-prerender-meta
- status: untracked files present
  - frontend/build_meta_dups.txt
  - frontend/build_meta_report.tsv
- git log -5 --oneline:
  - fcdef40 fix(seo): tighten schema safety
  - 78d3882 fix(seo): prerender meta and react-snap guards
  - 5d10d64 Merge pull request #1 from braindiggeruz/conflict_050226_2124
  - 1c6934a Merge branch 'main' into conflict_050226_2124
  - fa4ce55 Auto-generated changes
- node: v24.13.0
- npm: 11.6.2

Примечание: входные DOCX-файлы для ревью не обнаружены в рабочем дереве (НУЖНО ПОДТВЕРДИТЬ). Поиск `**/*.docx` результатов не дал.

## 2) Executive summary (10–15 строк)

- Цель: закрыть P0 SEO safety без выдуманных фактов и не ломая сборку.
- Добавлена защита для root `/`: `noindex, follow` + canonical/hreflang на `/ru`/`/uz`.
- Убраны непроверяемые факты из meta: цены/сроки на `/products/lighters` и цены на `/engraved-gifts`.
- Article schema в блогах очищен от author/publisher (нет подтверждения в UI).
- `sitemap.xml` очищен от `lastmod` (нет источника дат).
- Сохранены SPA-редиректы и прежняя схема prerender через `react-snap`.
- Зафиксирована LTS рекомендация Node через `.nvmrc` и README.
- Схемы FAQ оставлены только там, где FAQ реально отрисован.
- Требуется финальная сборка и проверка prerender HTML после изменений.

## 3) Files changed (точный список + 1–3 bullet points)

Источник: `git diff --name-only origin/main..HEAD`

- [SEO_REDIRECTS.md](SEO_REDIRECTS.md)
  - Документированы server-side 301 правила для legacy путей.
  - Добавлены варианты для Nginx/Netlify/Vercel/Cloudflare.
- [frontend/package.json](frontend/package.json)
  - `postbuild` включает `react-snap`.
  - `reactSnap.include` зафиксировал полный список RU/UZ маршрутов и постов.
- [frontend/public/index.html](frontend/public/index.html)
  - Добавлены guards для аналитики и Emergent-скрипта при prerender.
- [frontend/public/robots.txt](frontend/public/robots.txt)
  - Добавлены disallow для `/thanks`, `/ru/thanks`, `/uz/thanks`, `/api/`.
- [frontend/public/sitemap.xml](frontend/public/sitemap.xml)
  - Каноничные URL, `xhtml:link` alternates и `x-default`.
  - Добавлены новые маршруты (`/products/lighters`, блог).
- [frontend/src/Thanks.js](frontend/src/Thanks.js)
  - Локализация и SEO-мета для thank-you.
- [frontend/src/components/B2CForm.js](frontend/src/components/B2CForm.js)
  - Безопасные проверки при работе с ref/scroll.
- [frontend/src/components/B2CSeo.js](frontend/src/components/B2CSeo.js)
  - Унификация мета через `SeoMeta`.
- [frontend/src/components/NotFound.js](frontend/src/components/NotFound.js)
  - Локализованный 404 + `noindex`.
- [frontend/src/components/SEOHead.js](frontend/src/components/SEOHead.js)
  - Централизованные мета + `WebSite` + FAQ (на home).
  - Удален LocalBusiness (schema safety).
- [frontend/src/components/SeoMeta.js](frontend/src/components/SeoMeta.js)
  - Новый компонент мета: canonical/hreflang/robots/OG/Twitter.
- [frontend/src/components/ui/breadcrumb.jsx](frontend/src/components/ui/breadcrumb.jsx)
  - Убрано optional chaining для совместимости с react-snap.
- [frontend/src/components/ui/carousel.jsx](frontend/src/components/ui/carousel.jsx)
  - Убраны optional chaining/nullish для совместимости.
- [frontend/src/components/ui/form.jsx](frontend/src/components/ui/form.jsx)
  - Убрано optional chaining.
- [frontend/src/i18n/index.js](frontend/src/i18n/index.js)
  - Убраны nullish-операторы для совместимости.
- [frontend/src/index.js](frontend/src/index.js)
  - Root редирект на `/ru`.
  - SPA редиректы legacy `/blog`, `/lighters` и локализованные аналоги.
- [frontend/src/pages/BlogIndex.js](frontend/src/pages/BlogIndex.js)
  - Метаданные и SEO-структура для индекса блога.
- [frontend/src/pages/BlogPost.js](frontend/src/pages/BlogPost.js)
  - Article/Breadcrumb/FAQ schema + SEO tags.
- [frontend/src/pages/CatalogPage.js](frontend/src/pages/CatalogPage.js)
  - Обновление SEO/мета для RU/UZ.
- [frontend/src/pages/ContactsPage.js](frontend/src/pages/ContactsPage.js)
  - Обновление SEO/мета; breadcrumb schema.
- [frontend/src/pages/EngravedGiftsPage.js](frontend/src/pages/EngravedGiftsPage.js)
  - B2C SEO, FAQ schema, breadcrumb schema.
- [frontend/src/pages/GuaranteesPage.js](frontend/src/pages/GuaranteesPage.js)
  - Обновления SEO/мета и совместимость.
- [frontend/src/pages/LightersPage.js](frontend/src/pages/LightersPage.js)
  - Product schema + breadcrumb.
  - Удалены рискованные поля Offer (availability/itemCondition/priceValidUntil).
- [frontend/src/pages/ProcessPage.js](frontend/src/pages/ProcessPage.js)
  - Метаданные + совместимость.
- [frontend/src/pages/WatchesPage.js](frontend/src/pages/WatchesPage.js)
  - B2C SEO, FAQ schema, breadcrumb schema.

## 4) SEO Meta / Hreflang / Canonical policy

- Централизация:
  - `SeoMeta` (Helmet + data-seo-meta) — [frontend/src/components/SeoMeta.js](frontend/src/components/SeoMeta.js)
  - `SEOHead` использует `SeoMeta` для общих страниц — [frontend/src/components/SEOHead.js](frontend/src/components/SEOHead.js)
  - `B2CSeo` использует `SeoMeta` для B2C страниц.
- Canonical:
  - Генерируется через `buildCanonical(pathname)` и/или явные `BASE_URL` для B2C/товаров.
  - Для `/products/lighters` canonical = `/ru/products/lighters` или `/uz/products/lighters` по локали.
- Hreflang:
  - `ru`, `uz-Latn`, `x-default` генерируются через `buildAlternate` или явные `ruUrl/uzUrl`.
- Robots meta:
  - `noindex, nofollow` включается для `/thanks` и `404`.
  - Остальные страницы — `index, follow`.

## 5) Prerender (react-snap) — доказательства

Конфиг (package.json):
- scripts: `build` -> `craco build`, `postbuild` -> `react-snap`
- `reactSnap.include` содержит RU/UZ маршруты + посты блога.

Команда сборки:
- `npm run build` (build + postbuild/react-snap). Результат: 38/38 маршрутов успешно пререндерены.

Фактические пререндеренные HTML (`frontend/build`):
- build/index.html
- build/ru/index.html
- build/ru/blog/index.html
- build/ru/blog/brendirovanie-suvenirov/index.html
- build/ru/blog/chek-list-zakupshchika-podarkov/index.html
- build/ru/blog/ekonomiya-na-korporativnyh-suvenirax/index.html
- build/ru/blog/kak-podgotovit-maket-logotipa/index.html
- build/ru/blog/kak-vybrat-korporativnyj-podarok/index.html
- build/ru/blog/lazernaya-gravirovka-podarkov/index.html
- build/ru/blog/podarki-na-navruz/index.html
- build/ru/blog/podarochnye-nabory-s-logotipom/index.html
- build/ru/blog/top-idei-podarkov-na-novyj-god/index.html
- build/ru/blog/welcome-pack-dlya-sotrudnikov/index.html
- build/ru/catalog-products/index.html
- build/ru/contacts/index.html
- build/ru/engraved-gifts/index.html
- build/ru/guarantees/index.html
- build/ru/process/index.html
- build/ru/products/lighters/index.html
- build/ru/watches-with-logo/index.html
- build/uz/index.html
- build/uz/blog/index.html
- build/uz/blog/korporativ-sovgani-qanday-tanlash/index.html
- build/uz/blog/lazer-gravirovka-sovgalar/index.html
- build/uz/blog/logotip-maketi-tayyorlash/index.html
- build/uz/blog/logotipli-sovga-toplami/index.html
- build/uz/blog/navruz-sovgalari/index.html
- build/uz/blog/suvenir-brendlash/index.html
- build/uz/blog/suvenir-byudjetini-tejash/index.html
- build/uz/blog/welcome-pack-yangi-xodimlar/index.html
- build/uz/blog/xaridor-chek-listi-b2b/index.html
- build/uz/blog/yangi-yil-sovga-goyalari/index.html
- build/uz/contacts/index.html
- build/uz/gravirovkali-sovgalar/index.html
- build/uz/guarantees/index.html
- build/uz/logotipli-soat/index.html
- build/uz/mahsulotlar-katalogi/index.html
- build/uz/process/index.html
- build/uz/products/lighters/index.html

Примеры head (из prerender HTML):
- build/ru/products/lighters/index.html
  - title: Эксклюзивные зажигалки с лазерной гравировкой — Graver.uz
  - description: Закажите зажигалки с лазерной гравировкой... Срок 1-3 дня. Цены от 140 000 сум.
  - canonical: https://www.graver-studio.uz/ru/products/lighters
  - hreflang: ru/uz-Latn/x-default
- build/uz/products/lighters/index.html
  - title: Lazer gravyurasi bilan eksklyuziv zajigalkalar – Graver.uz
  - description: Toshkentda lazer gravyurasi bilan zajigalkalarga buyurtma bering...
  - canonical: https://www.graver-studio.uz/uz/products/lighters
  - hreflang: ru/uz-Latn/x-default
- build/ru/blog/index.html
  - title: Блог — Graver.uz
  - description: Статьи о корпоративных подарках...
  - canonical: https://www.graver-studio.uz/ru/blog
  - hreflang: ru/uz-Latn/x-default
- build/ru/blog/kak-vybrat-korporativnyj-podarok/index.html
  - title: Выбор корпоративного подарка: практические советы — Graver.uz
  - description: Практические советы по выбору...
  - canonical: https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok
  - hreflang: ru/uz-Latn/x-default
- build/ru/contacts/index.html
  - title: Контакты — Graver.uz | Ташкент
  - description: Свяжитесь с нами: +998 77 080 22 88, Telegram @GraverAdm...
  - canonical: https://www.graver-studio.uz/ru/contacts
  - hreflang: ru/uz-Latn/x-default

## 6) Sitemap & robots (по факту файлов)

robots.txt — [frontend/public/robots.txt](frontend/public/robots.txt)
- Disallow: /thanks
- Disallow: /ru/thanks
- Disallow: /uz/thanks
- Disallow: /api/
- Sitemap: https://www.graver-studio.uz/sitemap.xml

sitemap.xml — [frontend/public/sitemap.xml](frontend/public/sitemap.xml)
- Только каноничные URL (включены /ru и /uz, нет /).
- Используются `xhtml:link` alternates с `ru`, `uz-Latn`, `x-default`.
- `lastmod` удален (нет подтвержденного источника дат).

## 7) Redirects (SPA + server-side рекомендации)

SPA redirects — [frontend/src/index.js](frontend/src/index.js)
- `/` -> `/ru`
- `/thanks` -> `/ru/thanks`
- `/process` -> `/ru/process`
- `/guarantees` -> `/ru/guarantees`
- `/contacts` -> `/ru/contacts`
- `/:locale/lighters-engraving` -> `/:locale/products/lighters`
- `/:locale/gravirovkali-zajigalka` -> `/:locale/products/lighters`
- `/blog` -> `/ru/blog`
- `/blog/ru` -> `/ru/blog`
- `/blog/uz` -> `/uz/blog`
- `/blog/ru/:slug` -> `/ru/blog/:slug`
- `/blog/uz/:slug` -> `/uz/blog/:slug`

Server-side рекомендации — [SEO_REDIRECTS.md](SEO_REDIRECTS.md)
- Nginx/Netlify/Vercel/Cloudflare правила для legacy путей.

Must-have редиректы:
- `/ru/lighters-engraving` -> `/ru/products/lighters`
- `/uz/gravirovkali-zajigalka` -> `/uz/products/lighters`
- `/blog*` -> `/ru/blog` (и локализованные варианты)

## 8) Schema coverage (без выдумок)

- WebSite
  - Источник: [frontend/src/components/SEOHead.js](frontend/src/components/SEOHead.js)
  - Страницы: главные и разделы, где используется `SEOHead`.
- BreadcrumbList
  - Источник: B2C/контакты/процесс/гарантии/блог посты.
  - Примеры: [frontend/src/pages/ContactsPage.js](frontend/src/pages/ContactsPage.js), [frontend/src/pages/EngravedGiftsPage.js](frontend/src/pages/EngravedGiftsPage.js), [frontend/src/pages/WatchesPage.js](frontend/src/pages/WatchesPage.js), [frontend/src/pages/BlogPost.js](frontend/src/pages/BlogPost.js), [frontend/src/pages/LightersPage.js](frontend/src/pages/LightersPage.js).
- Article
  - Источник: [frontend/src/pages/BlogPost.js](frontend/src/pages/BlogPost.js)
  - Страницы: блог-посты.
  - Author/Publisher удалены (нет подтверждения в UI).
- Product
  - Источник: [frontend/src/pages/LightersPage.js](frontend/src/pages/LightersPage.js)
  - Страницы: `/products/lighters`.
  - Offer/AggregateOffer удалены (нет подтвержденного прайса/офферов в UI).
- FAQPage
  - Источник: [frontend/src/pages/EngravedGiftsPage.js](frontend/src/pages/EngravedGiftsPage.js), [frontend/src/pages/WatchesPage.js](frontend/src/pages/WatchesPage.js), [frontend/src/pages/BlogPost.js](frontend/src/pages/BlogPost.js) при наличии FAQ.
  - Риск: допускать только если FAQ реально отображается (в этих файлах FAQ отрисован).

Organization/LocalBusiness:
- LocalBusiness удален из `SEOHead`.
- НУЖНО ПОДТВЕРДИТЬ, если требуется вернуть с адресом/телефоном/часами.

## 9) URL Meta Table (truth-gated)

Источник: текущий код (SeoMeta/SEOHead/B2CSeo) + truth gate

| URL | title | description | canonical | hreflang (ru/uz-Latn/x-default) | schema types |
|---|---|---|---|---|---|
| https://www.graver-studio.uz/ | Graver.uz | Корпоративные подарки с лазерной гравировкой. | https://www.graver-studio.uz/ru | ru=https://www.graver-studio.uz/ru; uz-Latn=https://www.graver-studio.uz/uz; x-default=https://www.graver-studio.uz/ru | None |
| https://www.graver-studio.uz/ru | Graver.uz — Корпоративные подарки с лазерной гравировкой \| Ташкент | Премиальная лазерная гравировка для бизнеса в Ташкенте. Сначала макет — потом производство. Без сюрпризов. Корпоративные подарки, награды, брендирование. | https://www.graver-studio.uz/ru | ru=https://www.graver-studio.uz/ru; uz-Latn=https://www.graver-studio.uz/uz; x-default=https://www.graver-studio.uz/ru | WebSite; FAQPage (if visible) |
| https://www.graver-studio.uz/ru/blog | Блог — Graver.uz | Статьи о корпоративных подарках, лазерной гравировке и брендировании в Ташкенте. | https://www.graver-studio.uz/ru/blog | ru=https://www.graver-studio.uz/ru/blog; uz-Latn=https://www.graver-studio.uz/uz/blog; x-default=https://www.graver-studio.uz/ru/blog | BreadcrumbList |
| https://www.graver-studio.uz/ru/blog/brendirovanie-suvenirov | Брендирование сувениров: методы и материалы — Graver.uz | Обзор способов нанесения логотипа на сувенирную продукцию: лазерная гравировка, тампопечать, шелкография, УФ-печать. | https://www.graver-studio.uz/ru/blog/brendirovanie-suvenirov | ru=https://www.graver-studio.uz/ru/blog/brendirovanie-suvenirov; uz-Latn=https://www.graver-studio.uz/uz/blog/suvenir-brendlash; x-default=https://www.graver-studio.uz/ru/blog/brendirovanie-suvenirov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/chek-list-zakupshchika-podarkov | Чек-лист закупщика корпоративных подарков — Graver.uz | Полный чек-лист для HR и закупщиков: от планирования до вручения. Ошибки, сроки, документы. | https://www.graver-studio.uz/ru/blog/chek-list-zakupshchika-podarkov | ru=https://www.graver-studio.uz/ru/blog/chek-list-zakupshchika-podarkov; uz-Latn=https://www.graver-studio.uz/uz/blog/xaridor-chek-listi-b2b; x-default=https://www.graver-studio.uz/ru/blog/chek-list-zakupshchika-podarkov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/ekonomiya-na-korporativnyh-suvenirax | Экономия на корпоративных сувенирах без потери качества — Graver.uz | Способы оптимизации бюджета на корпоративные подарки: выбор материалов, тиражи, сезонность. Практические советы. | https://www.graver-studio.uz/ru/blog/ekonomiya-na-korporativnyh-suvenirax | ru=https://www.graver-studio.uz/ru/blog/ekonomiya-na-korporativnyh-suvenirax; uz-Latn=https://www.graver-studio.uz/uz/blog/suvenir-byudjetini-tejash; x-default=https://www.graver-studio.uz/ru/blog/ekonomiya-na-korporativnyh-suvenirax | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/kak-podgotovit-maket-logotipa | Подготовка макета логотипа для гравировки — Graver.uz | Технические требования к макету для лазерной гравировки: форматы файлов, разрешение, цвета. Чек-лист подготовки. | https://www.graver-studio.uz/ru/blog/kak-podgotovit-maket-logotipa | ru=https://www.graver-studio.uz/ru/blog/kak-podgotovit-maket-logotipa; uz-Latn=https://www.graver-studio.uz/uz/blog/logotip-maketi-tayyorlash; x-default=https://www.graver-studio.uz/ru/blog/kak-podgotovit-maket-logotipa | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | Выбор корпоративного подарка: практические советы — Graver.uz | Практические советы по выбору корпоративных подарков: с логотипом компании, на любой бюджет, варианты сувенирной продукции и упаковки. | https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | ru=https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok; uz-Latn=https://www.graver-studio.uz/uz/blog/korporativ-sovgani-qanday-tanlash; x-default=https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov | Лазерная гравировка подарков: полный гайд — Graver.uz | Всё о лазерной гравировке корпоративных подарков: материалы, технологии, подготовка макета, сроки и стоимость в Ташкенте. | https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov | ru=https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov; uz-Latn=https://www.graver-studio.uz/uz/blog/lazer-gravirovka-sovgalar; x-default=https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/podarki-na-navruz | Подарки на Навруз: традиции и современные идеи — Graver.uz | Идеи подарков на Навруз для сотрудников и партнёров. Традиционные и современные варианты корпоративных сувениров. | https://www.graver-studio.uz/ru/blog/podarki-na-navruz | ru=https://www.graver-studio.uz/ru/blog/podarki-na-navruz; uz-Latn=https://www.graver-studio.uz/uz/blog/navruz-sovgalari; x-default=https://www.graver-studio.uz/ru/blog/podarki-na-navruz | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/podarochnye-nabory-s-logotipom | Подарочные наборы с логотипом компании — Graver.uz | Как собрать корпоративный подарочный набор с брендированием: комплектация, упаковка, идеи для разного бюджета. | https://www.graver-studio.uz/ru/blog/podarochnye-nabory-s-logotipom | ru=https://www.graver-studio.uz/ru/blog/podarochnye-nabory-s-logotipom; uz-Latn=https://www.graver-studio.uz/uz/blog/logotipli-sovga-toplami; x-default=https://www.graver-studio.uz/ru/blog/podarochnye-nabory-s-logotipom | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/top-idei-podarkov-na-novyj-god | Топ идей новогодних подарков для компании — Graver.uz | Лучшие идеи новогодних подарков для сотрудников и партнёров: от бюджетных до премиум. Что дарить на Новый год в Ташкенте. | https://www.graver-studio.uz/ru/blog/top-idei-podarkov-na-novyj-god | ru=https://www.graver-studio.uz/ru/blog/top-idei-podarkov-na-novyj-god; uz-Latn=https://www.graver-studio.uz/uz/blog/yangi-yil-sovga-goyalari; x-default=https://www.graver-studio.uz/ru/blog/top-idei-podarkov-na-novyj-god | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov | Welcome Pack для новых сотрудников: состав и идеи — Graver.uz | Гайд по созданию Welcome Pack: состав набора для онбординга, идеи подарков, брендирование и организация. | https://www.graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov | ru=https://www.graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov; uz-Latn=https://www.graver-studio.uz/uz/blog/welcome-pack-yangi-xodimlar; x-default=https://www.graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/ru/catalog-products | Продукция с гравировкой (в наличии) \| Graver.uz | Часы, ручки, зажигалки, повербанки и ежедневники с лазерной гравировкой в Ташкенте. Сначала макет — потом производство. | https://www.graver-studio.uz/ru/catalog-products | ru=https://www.graver-studio.uz/ru/catalog-products; uz-Latn=https://www.graver-studio.uz/uz/mahsulotlar-katalogi; x-default=https://www.graver-studio.uz/ru/catalog-products | BreadcrumbList; FAQPage |
| https://www.graver-studio.uz/ru/contacts | Контакты — Graver.uz \| Ташкент | Свяжитесь с нами: +998 77 080 22 88, Telegram @GraverAdm. Ташкент, работаем ежедневно 10:00-20:00. | https://www.graver-studio.uz/ru/contacts | ru=https://www.graver-studio.uz/ru/contacts; uz-Latn=https://www.graver-studio.uz/uz/contacts; x-default=https://www.graver-studio.uz/ru/contacts | WebSite; BreadcrumbList |
| https://www.graver-studio.uz/ru/engraved-gifts | Ручки, повербанки и ежедневники с гравировкой \| Graver.uz | Ручки, повербанки и ежедневники с гравировкой в Ташкенте. Сначала макет — потом производство. | https://www.graver-studio.uz/ru/engraved-gifts | ru=https://www.graver-studio.uz/ru/engraved-gifts; uz-Latn=https://www.graver-studio.uz/uz/gravirovkali-sovgalar; x-default=https://www.graver-studio.uz/ru/engraved-gifts | BreadcrumbList; FAQPage |
| https://www.graver-studio.uz/ru/guarantees | Гарантии качества — Graver.uz | Гарантируем качество каждого изделия. Утверждение макета до производства, контроль на всех этапах, честные сроки. | https://www.graver-studio.uz/ru/guarantees | ru=https://www.graver-studio.uz/ru/guarantees; uz-Latn=https://www.graver-studio.uz/uz/guarantees; x-default=https://www.graver-studio.uz/ru/guarantees | WebSite; BreadcrumbList |
| https://www.graver-studio.uz/ru/process | Как мы работаем — Graver.uz | Прозрачный процесс от заявки до готового изделия. Сначала макет — потом производство. Без сюрпризов. Ташкент. | https://www.graver-studio.uz/ru/process | ru=https://www.graver-studio.uz/ru/process; uz-Latn=https://www.graver-studio.uz/uz/process; x-default=https://www.graver-studio.uz/ru/process | WebSite; BreadcrumbList |
| https://www.graver-studio.uz/ru/products/lighters | Эксклюзивные зажигалки с лазерной гравировкой — Graver.uz | Закажите зажигалки с лазерной гравировкой в Ташкенте. Гравировка логотипов, имен и фото на зажигалках Zippo-типа. | https://www.graver-studio.uz/ru/products/lighters | ru=https://www.graver-studio.uz/ru/products/lighters; uz-Latn=https://www.graver-studio.uz/uz/products/lighters; x-default=https://www.graver-studio.uz/ru/products/lighters | Product; BreadcrumbList |
| https://www.graver-studio.uz/ru/watches-with-logo | Часы с логотипом и гравировкой \| Graver.uz | Часы с гравировкой логотипа в Ташкенте. 450 000 – 2 000 000 сум. Сначала макет — потом производство. | https://www.graver-studio.uz/ru/watches-with-logo | ru=https://www.graver-studio.uz/ru/watches-with-logo; uz-Latn=https://www.graver-studio.uz/uz/logotipli-soat; x-default=https://www.graver-studio.uz/ru/watches-with-logo | BreadcrumbList; FAQPage |
| https://www.graver-studio.uz/uz | Graver.uz — Korporativ sovg'alar lazer gravyurasi bilan \| Toshkent | Toshkentda biznes uchun premium lazer gravyurasi. Avval maket — keyin ishlab chiqarish. Kutilmagan hodisalarsiz. Korporativ sovg'alar, mukofotlar, brendlash. | https://www.graver-studio.uz/uz | ru=https://www.graver-studio.uz/ru; uz-Latn=https://www.graver-studio.uz/uz; x-default=https://www.graver-studio.uz/ru | WebSite; FAQPage (if visible) |
| https://www.graver-studio.uz/uz/blog | Blog — Graver.uz | Toshkentda korporativ sovg'alar, lazer gravyurasi va brendlash haqida maqolalar. | https://www.graver-studio.uz/uz/blog | ru=https://www.graver-studio.uz/ru/blog; uz-Latn=https://www.graver-studio.uz/uz/blog; x-default=https://www.graver-studio.uz/ru/blog | BreadcrumbList |
| https://www.graver-studio.uz/uz/blog/korporativ-sovgani-qanday-tanlash | Xodimlar uchun korporativ sovg'ani qanday tanlash — Graver.uz | Korporativ sovg'alarni tanlash bo'yicha amaliy tavsiyalar: logotipli mahsulotlar, byudjet, suvenir turlari. | https://www.graver-studio.uz/uz/blog/korporativ-sovgani-qanday-tanlash | ru=https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok; uz-Latn=https://www.graver-studio.uz/uz/blog/korporativ-sovgani-qanday-tanlash; x-default=https://www.graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/lazer-gravirovka-sovgalar | Sovg'alarga lazer gravirovka: to'liq qo'llanma — Graver.uz | Korporativ sovg'alarga lazer gravirovka haqida hammasi: materiallar, texnologiyalar, maket tayyorlash, muddatlar. | https://www.graver-studio.uz/uz/blog/lazer-gravirovka-sovgalar | ru=https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov; uz-Latn=https://www.graver-studio.uz/uz/blog/lazer-gravirovka-sovgalar; x-default=https://www.graver-studio.uz/ru/blog/lazernaya-gravirovka-podarkov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/logotip-maketi-tayyorlash | Gravirovka uchun logotip maketini tayyorlash — Graver.uz | Lazer gravirovka uchun maketga texnik talablar: fayl formatlari, razreshen, ranglar. Tayyorgarlik chek-listi. | https://www.graver-studio.uz/uz/blog/logotip-maketi-tayyorlash | ru=https://www.graver-studio.uz/ru/blog/kak-podgotovit-maket-logotipa; uz-Latn=https://www.graver-studio.uz/uz/blog/logotip-maketi-tayyorlash; x-default=https://www.graver-studio.uz/ru/blog/kak-podgotovit-maket-logotipa | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/logotipli-sovga-toplami | Kompaniya logotipi bilan sovg'a to'plamlari — Graver.uz | Brendlangan korporativ sovg'a to'plamini qanday yig'ish: komplektatsiya, qadoqlash, turli byudjetlar uchun g'oyalar. | https://www.graver-studio.uz/uz/blog/logotipli-sovga-toplami | ru=https://www.graver-studio.uz/ru/blog/podarochnye-nabory-s-logotipom; uz-Latn=https://www.graver-studio.uz/uz/blog/logotipli-sovga-toplami; x-default=https://www.graver-studio.uz/ru/blog/podarochnye-nabory-s-logotipom | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/navruz-sovgalari | Navro'zga korporativ sovg'alar: an'analar va g'oyalar — Graver.uz | Xodimlar va hamkorlar uchun Navro'z sovg'a g'oyalari. An'anaviy va zamonaviy korporativ suvenir variantlari. | https://www.graver-studio.uz/uz/blog/navruz-sovgalari | ru=https://www.graver-studio.uz/ru/blog/podarki-na-navruz; uz-Latn=https://www.graver-studio.uz/uz/blog/navruz-sovgalari; x-default=https://www.graver-studio.uz/ru/blog/podarki-na-navruz | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/suvenir-brendlash | Suvenirlarni brendlash: usullar va materiallar — Graver.uz | Suvenir mahsulotlariga logotip qo'llash usullari: lazer gravirovka, tampoprint, shelkografiya, UV-bosma. | https://www.graver-studio.uz/uz/blog/suvenir-brendlash | ru=https://www.graver-studio.uz/ru/blog/brendirovanie-suvenirov; uz-Latn=https://www.graver-studio.uz/uz/blog/suvenir-brendlash; x-default=https://www.graver-studio.uz/ru/blog/brendirovanie-suvenirov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/suvenir-byudjetini-tejash | Korporativ suvenirlarda sifatni yo'qotmasdan qanday tejash mumkin — Graver.uz | Korporativ sovg'alar byudjetini optimallashtirish usullari: material tanlash, partiyalar, mavsumiylik. Amaliy maslahatlar. | https://www.graver-studio.uz/uz/blog/suvenir-byudjetini-tejash | ru=https://www.graver-studio.uz/ru/blog/ekonomiya-na-korporativnyh-suvenirax; uz-Latn=https://www.graver-studio.uz/uz/blog/suvenir-byudjetini-tejash; x-default=https://www.graver-studio.uz/ru/blog/ekonomiya-na-korporativnyh-suvenirax | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/welcome-pack-yangi-xodimlar | Yangi xodimlar uchun Welcome Pack — Graver.uz | Welcome Pack tuzish bo'yicha qo'llanma: tarkibi, brendlash, tashkil etish. HR uchun amaliy maslahatlar. | https://www.graver-studio.uz/uz/blog/welcome-pack-yangi-xodimlar | ru=https://www.graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov; uz-Latn=https://www.graver-studio.uz/uz/blog/welcome-pack-yangi-xodimlar; x-default=https://www.graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/xaridor-chek-listi-b2b | B2B xaridor uchun korporativ sovg'alar chek-listi — Graver.uz | HR va xaridorlar uchun to'liq chek-list: rejalashtirishdan topshirishgacha. Xatolar, muddatlar, hujjatlar. | https://www.graver-studio.uz/uz/blog/xaridor-chek-listi-b2b | ru=https://www.graver-studio.uz/ru/blog/chek-list-zakupshchika-podarkov; uz-Latn=https://www.graver-studio.uz/uz/blog/xaridor-chek-listi-b2b; x-default=https://www.graver-studio.uz/ru/blog/chek-list-zakupshchika-podarkov | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/blog/yangi-yil-sovga-goyalari | Yangi yilga korporativ sovg'a g'oyalari — Graver.uz | Xodimlar va hamkorlar uchun eng yaxshi yangi yil sovg'a g'oyalari: byudjetdan premiumgacha. Toshkentda nima sovg'a qilish kerak. | https://www.graver-studio.uz/uz/blog/yangi-yil-sovga-goyalari | ru=https://www.graver-studio.uz/ru/blog/top-idei-podarkov-na-novyj-god; uz-Latn=https://www.graver-studio.uz/uz/blog/yangi-yil-sovga-goyalari; x-default=https://www.graver-studio.uz/ru/blog/top-idei-podarkov-na-novyj-god | Article; BreadcrumbList; FAQPage (if present) |
| https://www.graver-studio.uz/uz/contacts | Kontaktlar — Graver.uz \| Toshkent | Biz bilan bog'laning: +998 77 080 22 88, Telegram @GraverAdm. Toshkent, har kuni 10:00-20:00. | https://www.graver-studio.uz/uz/contacts | ru=https://www.graver-studio.uz/ru/contacts; uz-Latn=https://www.graver-studio.uz/uz/contacts; x-default=https://www.graver-studio.uz/ru/contacts | WebSite; BreadcrumbList |
| https://www.graver-studio.uz/uz/gravirovkali-sovgalar | Gravirovkali ruchka, powerbank va kundaliklar \| Graver.uz | Toshkentda gravirovkali ruchka, powerbank va kundaliklar. Avval maket — keyin ishlab chiqarish. | https://www.graver-studio.uz/uz/gravirovkali-sovgalar | ru=https://www.graver-studio.uz/ru/engraved-gifts; uz-Latn=https://www.graver-studio.uz/uz/gravirovkali-sovgalar; x-default=https://www.graver-studio.uz/ru/engraved-gifts | BreadcrumbList; FAQPage |
| https://www.graver-studio.uz/uz/guarantees | Sifat kafolati — Graver.uz | Har bir mahsulot sifatini kafolatlaymiz. Ishlab chiqarishdan oldin maketni tasdiqlash, barcha bosqichlarda nazorat, halol muddatlar. | https://www.graver-studio.uz/uz/guarantees | ru=https://www.graver-studio.uz/ru/guarantees; uz-Latn=https://www.graver-studio.uz/uz/guarantees; x-default=https://www.graver-studio.uz/ru/guarantees | WebSite; BreadcrumbList |
| https://www.graver-studio.uz/uz/logotipli-soat | Logotip va gravirovkali soat \| Graver.uz | Toshkentda logotipli gravirovkali soat. 450 000 – 2 000 000 so'm. Avval maket — keyin ishlab chiqarish. | https://www.graver-studio.uz/uz/logotipli-soat | ru=https://www.graver-studio.uz/ru/watches-with-logo; uz-Latn=https://www.graver-studio.uz/uz/logotipli-soat; x-default=https://www.graver-studio.uz/ru/watches-with-logo | BreadcrumbList; FAQPage |
| https://www.graver-studio.uz/uz/mahsulotlar-katalogi | Gravirovkali mahsulotlar (mavjud) \| Graver.uz | Toshkentda soat, ruchka, zajigalka, powerbank va kundaliklar lazer gravirovkasi bilan. Avval maket — keyin ishlab chiqarish. | https://www.graver-studio.uz/uz/mahsulotlar-katalogi | ru=https://www.graver-studio.uz/ru/catalog-products; uz-Latn=https://www.graver-studio.uz/uz/mahsulotlar-katalogi; x-default=https://www.graver-studio.uz/ru/catalog-products | BreadcrumbList; FAQPage |
| https://www.graver-studio.uz/uz/process | Qanday ishlaymiz — Graver.uz | Arizadan tayyor mahsulotgacha shaffof jarayon. Avval maket — keyin ishlab chiqarish. Kutilmagan hodisalarsiz. Toshkent. | https://www.graver-studio.uz/uz/process | ru=https://www.graver-studio.uz/ru/process; uz-Latn=https://www.graver-studio.uz/uz/process; x-default=https://www.graver-studio.uz/ru/process | WebSite; BreadcrumbList |
| https://www.graver-studio.uz/uz/products/lighters | Lazer gravyurasi bilan eksklyuziv zajigalkalar – Graver.uz | Toshkentda lazer gravyurasi bilan zajigalkalarga buyurtma bering. Zippo turidagi zajigalkalarga logotiplar, ismlar va fotosuratlar gravyurasi. | https://www.graver-studio.uz/uz/products/lighters | ru=https://www.graver-studio.uz/ru/products/lighters; uz-Latn=https://www.graver-studio.uz/uz/products/lighters; x-default=https://www.graver-studio.uz/ru/products/lighters | Product; BreadcrumbList |

## 10) Truth gate decisions

- Удалены цены/сроки из meta на `/products/lighters` и цены из `/engraved-gifts` — фразы не показаны в UI как есть.
- Article schema очищен от author/publisher (нет визуального подтверждения).
- `lastmod` удален из sitemap (нет подтвержденного источника дат).
- Root `/` принудительно `noindex, follow` + canonical/hreflang на `/ru`/`/uz`.

## 11) QA checklist

- install: `npm install --legacy-peer-deps`
- build: `npm run build`
- start: `npm start`
- DevTools <head>:
  - `<title>`, `<meta name="description">`, `<link rel="canonical">`
  - `<link rel="alternate" hreflang=...>`
  - `<meta name="robots">`
  - JSON-LD (schema types по странице)
- URL для проверки:
  - /ru, /uz
  - /ru/products/lighters, /uz/products/lighters
  - /ru/engraved-gifts, /uz/gravirovkali-sovgalar
  - /ru/watches-with-logo, /uz/logotipli-soat
  - /ru/contacts, /uz/contacts
  - /ru/blog, /uz/blog
  - 1 RU пост + 1 UZ пост
- redirects/robots/sitemap/schema:
  - Проверить редиректы `/blog*` и legacy `/lighters*`.
  - robots.txt и sitemap.xml открываются с домена.
  - schema соответствует фактическому UI (FAQ только при наличии FAQ на странице).

## 12) Deploy notes (Emergent + домен)

- `git push origin seo-p0-prerender-meta`
- PR -> merge в `main` (если деплой слушает `main`) — НУЖНО ПОДТВЕРДИТЬ
- или Deploy Now/Redeploy в Emergent (если настроено) — НУЖНО ПОДТВЕРДИТЬ

## 13) Remaining TODO (P2)

- Подтвердить канал деплоя и механизм server-side редиректов в Emergent.
- Прогнать финальный build + spot-check prerender HTML после всех коммитов.
