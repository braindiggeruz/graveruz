# Manual Test URLs — Graver.uz Pre-Release QA

**Environment:** Use the production preview URL or `https://graver-studio.uz` after deploy  
**Browser:** Chrome or Firefox with DevTools open  
**Pixel Helper:** Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) extension for tracking verification

---

## 1. Homepage

**URL:** `https://graver-studio.uz/ru/`

| Check | Expected | Type |
|---|---|---|
| Page loads without JS errors | No console errors | UX |
| `<title>` contains brand name | Title includes "Graver" | SEO |
| Footer "Услуги" link clicked from `/ru/blog/kak-vybrat-korporativnyj-podarok/` | Navigates to `https://graver-studio.uz/ru/#services` | **Routing (CRITICAL)** |
| Footer "Портфолио" link clicked from a blog page | Navigates to homepage portfolio section | Routing |
| Footer "Контакты" link clicked from a blog page | Navigates to homepage contact section | Routing |
| OG image resolves | `<meta property="og:image">` URL loads in browser | SEO |

---

## 2. Product Pages

### Lighters Page
**URL:** `https://graver-studio.uz/ru/products/lighters`

| Check | Expected | Type |
|---|---|---|
| Page loads | No blank screen | UX |
| `ViewCategory` event fires | Meta Pixel Helper shows `ViewCategory` event | Tracking |
| Catalog download button fires tracking | `CatalogDownload` custom event in Pixel Helper | **Tracking (CRITICAL)** |
| Telegram CTA click fires event | `Contact` event with source=telegram | Tracking |

### Watches Page
**URL:** `https://graver-studio.uz/ru/products/watches`

| Check | Expected | Type |
|---|---|---|
| Page loads | No blank screen | UX |
| `ViewCategory` event fires | Pixel Helper shows event | Tracking |

---

## 3. Service / Catalog Pages

### Catalog Overview
**URL:** `https://graver-studio.uz/ru/catalog-products`

| Check | Expected | Type |
|---|---|---|
| Page loads | No blank screen | UX |
| Canonical tag | `<link rel="canonical" href="https://graver-studio.uz/ru/catalog-products/">` | SEO |
| Hreflang alternate | `<link rel="alternate" hreflang="uz" href="https://graver-studio.uz/uz/...">` present | SEO |

---

## 4. RU Blog Articles — New SEO Overrides

### Article 1: Case Study — Welcome Pack
**URL:** `https://graver-studio.uz/ru/blog/case-study-welcome-pack-enps/`

| Check | Expected | Type |
|---|---|---|
| `<title>` in DevTools | `Кейс: Welcome Pack поднял eNPS на 23% в IT-компании — Graver Studio` | **SEO (CRITICAL)** |
| `<meta name="description">` | Contains "eNPS с 15 до 38 за 6 месяцев" | **SEO (CRITICAL)** |
| Canonical tag | `https://graver-studio.uz/ru/blog/case-study-welcome-pack-enps/` | SEO |
| BlogPosting structured data present | DevTools → Application → Service Workers or Rich Results test | Schema |
| `ViewContent` event fires on load | Pixel Helper shows `ViewContent` | Tracking |
| Article body loads | Not blank | UX |

### Article 2: Welcome Pack for Employees — HR Guide
**URL:** `https://graver-studio.uz/ru/blog/welcome-pack-dlya-sotrudnikov-gid/`

| Check | Expected | Type |
|---|---|---|
| `<title>` | `Welcome Pack для новых сотрудников: полный HR-гайд \| Graver Studio` | SEO |
| `<meta name="description">` | Contains "три уровня бюджета" | SEO |
| Page does NOT have a UZ hreflang alternate | No `hreflang="uz"` (no true UZ counterpart) | SEO |

### Article 3: March 8 — Employee Gifts
**URL:** `https://graver-studio.uz/ru/blog/podarki-na-8-marta-sotrudnitsam/`

| Check | Expected | Type |
|---|---|---|
| `<title>` | `Подарки сотрудницам на 8 марта: 20+ идей с гравировкой \| Graver.uz` | SEO |
| `<meta name="description">` | Contains "более 20 вариантов" | SEO |
| Article image loads | No 404 on hero image | Assets |

---

## 5. UZ Blog Articles — New SEO Overrides

### Article 1: Welcome Pack HR Guide (UZ)
**URL:** `https://graver-studio.uz/uz/blog/welcome-pack-hr-uchun-toliq-gid/`

| Check | Expected | Type |
|---|---|---|
| `<html lang="uz-Latn">` | Language attribute is Uzbek Latin | SEO |
| `<title>` | `Welcome Pack tuzish: HR uchun to'liq gid va byudjet formulasi \| Graver Studio` | **SEO (CRITICAL)** |
| `<meta name="description">` | Uzbek text, not Russian | **SEO (CRITICAL — no RU text)** |
| hreflang `ru` alternate | Points to `welcome-pack-dlya-sotrudnikov` (pre-existing pair) | SEO |
| Canonical tag | `https://graver-studio.uz/uz/blog/welcome-pack-hr-uchun-toliq-gid/` | SEO |

### Article 2: March 8 Corporate Gifts (UZ)
**URL:** `https://graver-studio.uz/uz/blog/8-mart-uchun-korporativ-sovgalar-goyalari/`

| Check | Expected | Type |
|---|---|---|
| `<title>` | `8 Martga korporativ sovg'alar: 20 ta gravirovkali g'oya \| Graver.uz` | SEO |
| `<meta name="description">` | Uzbek text only | SEO |
| hreflang `ru` alternate | Points to `podarki-na-8-marta-sotrudnicam` | SEO |
| BlogPosting schema present | Script tag with `@type: BlogPosting` | Schema |

### Article 3: VIP Business Gifts (UZ)
**URL:** `https://graver-studio.uz/uz/blog/biznes-hamkorlar-uchun-vip-sovgalar/`

| Check | Expected | Type |
|---|---|---|
| `<title>` | `Biznes hamkorlar uchun VIP sovg'alar: 15+ premium g'oya \| Graver.uz` | SEO |
| `<meta name="description">` | Contains "$50–$500 diapazonidagi" | SEO |
| Article image resolves | Hero image loads (no 404) | Assets |

---

## 6. Contact Page

**URL:** `https://graver-studio.uz/ru/#contact` (from homepage) and `https://graver-studio.uz/ru/blog/kak-vybrat-korporativnyj-podarok/#contact` (from blog, testing footer fix)

| Check | Expected | Type |
|---|---|---|
| Contact form submits | `Lead` event fires in Pixel Helper | **Tracking (CRITICAL)** |
| Phone number click | `Contact` event with source=phone fires in Pixel Helper | **Tracking (CRITICAL)** |
| Telegram button click | `Contact` event with source=telegram fires | Tracking |

---

## 7. Thanks Page

**URL:** `https://graver-studio.uz/ru/thanks`

| Check | Expected | Type |
|---|---|---|
| Page renders | Not blank | UX |
| `<meta name="robots" content="noindex">` | Confirm noindex is set | SEO |
| Telegram link present | Link to `t.me/GraverAdm` or similar | UX |

---

## 8. 404 Page

**URL:** `https://graver-studio.uz/ru/blog/this-page-does-not-exist-xyz123`

| Check | Expected | Type |
|---|---|---|
| 404 page renders | Custom 404 page, not blank | UX |
| HTTP status | Returns 404 (check Network tab) | Routing |
| No `index` robots meta | Should be `noindex` or blank | SEO |

---

## 9. Tracking Matrix (Full)

Run these manually with Pixel Helper installed:

| Action | Expected Event | Where to Test |
|---|---|---|
| Any page load | `PageView` | Any URL |
| Blog post page load | `ViewContent` | Any `/ru/blog/*/` or `/uz/blog/*/` |
| Product page load | `ViewCategory` | `/ru/products/lighters` |
| Click phone number `[data-track="tel"]` | `Contact` (source: phone) | Header nav on any page |
| Click Telegram button | `Contact` (source: telegram) | Footer or CTA on any page |
| Submit quote/contact form | `Lead` | Homepage contact section |
| Click catalog download button | Custom `CatalogDownload` | LightersPage or Homepage |

---

## 10. Generated Image Assets to Spot-Check

Verify these URLs load (HTTP 200, not 404):

```
https://graver-studio.uz/images/blog/case-study-welcome-pack-enps-header-og.jpg
https://graver-studio.uz/images/blog/case-study-welcome-pack-enps-header-480.avif
https://graver-studio.uz/images/blog/case-study-welcome-pack-enps-header-1200.webp
https://graver-studio.uz/images/blog/korporativnye-podarki-b2b-etiket-header-og.jpg
https://graver-studio.uz/images/blog/podarki-na-8-marta-sotrudnitsam-emotions-480.avif
https://graver-studio.uz/images/blog/welcome-pack-dlya-sotrudnikov-gid-header-og.jpg
```

---

## 11. Documented Intentional No-Alternate Pages (Not Errors)

The following 9 RU slugs intentionally have no `hreflang="uz"` alternate because no true UZ counterpart article exists. These are **not bugs**:

1. `case-study-welcome-pack-enps`
2. `keys-welcome-pack-enps-uzbekistan`
3. `korporativnye-podarki-uzbekistan`
4. `korporativnye-podarki-b2b-etiket`
5. `podarki-8-marta-20-idej`
6. `podarki-na-8-marta-sotrudnitsam`
7. `podarki-na-den-rozhdeniya-sotrudnika`
8. `podarki-sotrudnikam-loyalnost`
9. `welcome-pack-dlya-sotrudnikov-gid`

These pages will have `hreflang="x-default"` only. This is correct per Google's guidelines — do not add a fake alternate.
