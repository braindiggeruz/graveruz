# SEO, UX, and CRO Audit Report: graver-studio.uz

**Date:** March 13, 2026
**Author:** Manus AI

## Table of Contents
1.  [Executive Summary](#executive-summary)
2.  [Critical Issues (Must-Fix)](#critical-issues-must-fix)
3.  [Technical SEO Analysis](#technical-seo-analysis)
4.  [On-Page SEO & Content Strategy](#on-page-seo--content-strategy)
5.  [User Experience (UX) & Conversion (CRO)](#user-experience-ux--conversion-cro)
6.  [International & Multilingual SEO](#international--multilingual-seo)
7.  [Prioritized Recommendations](#prioritized-recommendations)

---

## 1. Executive Summary

This report provides a comprehensive SEO, User Experience (UX), and Conversion Rate Optimization (CRO) audit of `graver-studio.uz`. The site is a well-designed, modern, and premium-feeling B2B service platform built on a robust Next.js framework. It has a strong visual identity and a clear focus on the corporate gift market in Uzbekistan.

However, a number of **critical technical and content issues** are severely undermining its performance, visibility, and trustworthiness. The most significant problem is a **critical bug causing some blog articles to render as unreadable code**, making them useless for both users and search engines. Other major issues include duplicate and thin content in the blog, inconsistent URL structure, and a significant lack of trust signals (E-E-A-T), such as a complete physical address or detailed company information.

While the site has a solid technical foundation with good sitemaps and basic schema, it suffers from missing structured data for key content types like articles and FAQs. The content strategy appears to be based on mass-producing thin, duplicative articles, which harms SEO and user trust. The UX is generally strong, but key pages like "Guarantees" and "Catalog" are underdeveloped and feel like placeholders.

This audit outlines these issues in detail and provides a prioritized list of actionable recommendations. Addressing the critical blog rendering bug, improving content quality, and enhancing trust signals should be the highest priorities to unlock the site's significant potential.

## 2. Critical Issues (Must-Fix)

This section details the most severe issues discovered during the audit. These problems have a significant negative impact on search engine ranking, user trust, and overall site performance. They require immediate attention.

### 2.1. Critical Blog Rendering Bug

A critical bug was identified on at least one blog article page (`/ru/blog/korporativnye-podarki-na-8-marta-v-tashkente`). The main content of the article is not rendered as text but as a string of Unicode escape sequences (e.g., `\\u041a\\u043e\\u0440\\u043f...`).

*   **Impact:** This makes the content completely **unreadable to both users and search engine crawlers**. The page has zero SEO value and provides an extremely poor user experience, effectively appearing broken. While other articles appear to render correctly, this inconsistency suggests a potentially widespread and unpredictable issue within the site's Next.js rendering or data-fetching logic.
*   **Recommendation:** **This is the highest priority issue and must be fixed immediately.** Developers need to investigate the server-side rendering (SSR) or static site generation (SSG) process for the blog. The root cause could be related to how data is fetched, serialized, or hydrated on the client side for specific articles.

### 2.2. Duplicate, Thin, and Low-Quality Content

The blog, which constitutes a large portion of the site's pages (~130+ URLs), suffers from significant content quality issues.

*   **Duplicate & Near-Duplicate Titles:** Several articles have identical or nearly identical titles (e.g., two articles on "Welcome Pack eNPS" and two on "8th of March gifts for colleagues"). This creates keyword cannibalization, where multiple pages compete for the same search terms, confusing search engines and diluting ranking potential.
*   **Thin Content:** Many articles are short, superficial, and lack depth. They appear to have been created quickly to target keywords without providing substantial value to the reader.
*   **Mass-Published Feel:** All articles are dated within a very narrow timeframe (February-March 2026), which signals to search engines that the content may be low-effort or auto-generated rather than being a source of expert information developed over time.
*   **Recommendation:** Conduct a full content audit of the blog. **Merge duplicate articles**, redirecting the less valuable URL to the primary one. **Improve thin content** by adding depth, unique insights, and practical examples. Develop a sustainable content strategy focused on quality over quantity, and update publication dates to reflect when content is substantially revised.

### 2.3. Lack of Trust and E-E-A-T Signals

The website severely lacks signals of Expertise, Authoritativeness, and Trustworthiness (E-A-T), which are critical for both B2B conversions and Google's quality ratings.

*   **Missing Information:** There is no "About Us" page, no information about the team, no company registration details, and no full physical address (the address on the contact page is incomplete). This makes the business appear anonymous and less credible.
*   **Weak Social Proof:** Testimonials are present but lack photos, full names, or company details, making them appear generic. There are no client logos, detailed case studies with named clients, or links to third-party review platforms.
*   **Recommendation:** **Create a comprehensive "About Us" page** that tells the company's story, introduces the team, and provides legal/registration information. **Enhance the "Contacts" page** with a complete, map-pinnable address. **Strengthen social proof** by requesting permission to use client logos and developing detailed case studies. Encourage reviews on Google Business Profile.

## 3. Technical SEO Analysis

The site's technical foundation is generally modern and sound, leveraging Next.js for server-side rendering. However, there are key gaps in implementation that are holding back performance.

### 3.1. Structured Data (Schema Markup)

Structured data implementation is present but incomplete. While the homepage correctly uses `Organization` and `LocalBusiness` schema, there are significant omissions on other key pages.

| Page Type | Schema Implemented | Missing Schema |
| :--- | :--- | :--- |
| Homepage | `Organization`, `LocalBusiness` | `FAQPage` |
| Product Pages | `Product` (assumed, not fully verified) | `BreadcrumbList` |
| Blog Articles | **None** | `Article`, `BlogPosting`, `BreadcrumbList` |
| Service Pages | **None** | `Service`, `BreadcrumbList` |

*   **Impact:** The complete absence of `Article` schema on blog posts is a major missed opportunity. This prevents Google from understanding the content as news or blog articles, excluding them from rich results like "Top Stories" carousels and other SERP features. The lack of `FAQPage` and `BreadcrumbList` schema also reduces the site's eligibility for enhanced search result appearances.
*   **Recommendation:** Implement comprehensive schema markup across all relevant page types. Prioritize adding `Article` or `BlogPosting` schema to all blog posts. Add `BreadcrumbList` to all pages with breadcrumb navigation. Implement `FAQPage` schema on the homepage's FAQ section. Use `Service` schema for service-related pages.

### 3.2. Sitemaps & Crawlability

The site utilizes XML sitemaps correctly, including a dedicated image sitemap. The `robots.txt` file is configured properly to allow crawling of important content while blocking admin and framework directories.

*   **Findings:** The sitemap reveals a total of 154 URLs, with the vast majority being blog pages (~130). This indicates a potential imbalance in the site structure, with a heavy reliance on blog content for organic visibility.
*   **Recommendation:** No major changes are needed for the sitemaps or `robots.txt` file at this time. However, the URL count highlights the need to diversify content and build out more robust service and product pages.

### 3.3. Site Performance

Direct performance testing via Google's PageSpeed Insights API was unsuccessful due to API quota limitations. However, manual inspection and analysis of the page source provide some insights.

*   **Findings:** The homepage HTML payload is approximately 150KB. The site leverages modern Next.js features like server-side rendering and aggressive caching (`s-maxage=31536000`), which is positive. However, the reliance on client-side rendering for certain components, as evidenced by the blog rendering bug, can introduce performance bottlenecks and unpredictability.
*   **Recommendation:** Once the API quota issue is resolved, run full PageSpeed Insights tests to get detailed metrics on Core Web Vitals (LCP, FID, CLS). Investigate the JavaScript bundle size and execution time, as this is a common performance issue with React-based frameworks. Optimize images further, ensuring they are served in next-gen formats like WebP and properly sized.

## 4. On-Page SEO & Content Strategy

On-page SEO and content strategy are deeply intertwined. While the site attempts to target relevant keywords, the execution is flawed, leading to missed opportunities and potential penalties from search engines.

### 4.1. URL Structure & Slugs

The URL structure is inconsistent and not optimized for the target languages.

*   **Mixed Languages:** The Russian version of the site uses English slugs for many key pages (e.g., `/engraved-gifts`, `/catalog-products`, `/products/neo-watches`). Similarly, the Uzbek version contains some Russian slugs. This is confusing for both users and search engines and weakens the topical relevance of the URLs.
*   **Recommendation:** Standardize the URL structure to use the language of the page. For the Russian section, slugs should be in Russian (e.g., `/ru/gravirovannye-podarki`). For the Uzbek section, slugs should be in Uzbek. Implement 301 redirects from the old URLs to the new ones to preserve link equity and prevent broken links.

### 4.2. Meta Tags (Titles & Descriptions)

Meta tag optimization is inconsistent.

*   **Titles:** While the homepage and some product pages have good, descriptive titles, others are generic and lack branding (e.g., "Ручки с гравировкой логотипа | Корпоративные подарки" does not include "Graver.uz").
*   **Descriptions:** Meta descriptions were not consistently found or extracted, suggesting they may be missing on several pages. Where they exist, they should be compelling and include a call-to-action.
*   **Recommendation:** Ensure every page has a unique, descriptive title that includes the primary keyword and the brand name "Graver.uz". Write compelling meta descriptions for all key pages that entice users to click from the search results page.

### 4.3. Content & Keyword Strategy

The current content strategy is the site's biggest weakness. The focus on quantity over quality has resulted in a large number of low-value pages.

*   **Keyword Cannibalization:** As mentioned in the critical issues, multiple articles target the exact same keywords, forcing them to compete against each other.
*   **Thin & Placeholder Content:** Pages like "Guarantees" and "Catalog" are extremely thin, offering little value to the user or to search engines. They feel like unfinished sections of the site.
*   **Recommendation:** Shift the strategy from quantity to quality. **Consolidate and improve existing articles** instead of creating new, thin ones. **Build out the core service and product pages** with detailed information, specifications, use cases, and high-quality images. The "Guarantees" page should be expanded to build trust, and the "Catalog" page should be transformed into a proper, filterable product listing.

## 5. User Experience (UX) & Conversion (CRO)

The website provides a visually appealing and modern user experience that aligns with its premium positioning. However, significant gaps in content and trust-building elements are likely hindering conversion rates.

### 5.1. Design and Navigation

*   **Strengths:** The dark theme, clean typography, and consistent use of the teal accent color create a professional and high-end feel. The main navigation is clear and logical, and the site appears to be mobile-responsive at first glance. The prominent placement of Telegram as a contact method is well-suited for the local market.
*   **Weaknesses:** The user journey is often interrupted by dead ends or underdeveloped pages. For example, a user interested in the company's portfolio has no dedicated page to explore, only a small section on the homepage. The main menu links to "Services" and "Products," but these lead to thin pages that don't fully showcase the company's offerings.
*   **Recommendation:** Build out the missing core pages, including a comprehensive `/portfolio`, a `/services` landing page that details each service, and an "About Us" page. Ensure every user path leads to a clear and valuable next step.

### 5.2. Trust and Credibility (E-E-A-T)

This is the most significant weakness from a UX and CRO perspective. B2B clients make considered purchases and require a high degree of trust before engaging with a vendor. The site currently fails to establish this trust.

*   **Anonymity:** The business feels anonymous. There are no names, faces, or stories to connect with. The physical address is incomplete, which is a major red flag for a business that handles physical products.
*   **Weak Social Proof:** The testimonials on product pages are a good start, but their credibility is low without full names, company details, or photos. The absence of client logos or detailed case studies makes it difficult for a potential customer to validate the company's experience and success.
*   **Thin "Guarantees" Page:** The guarantees page is a critical touchpoint for building trust. The current page, with just five bullet points, is a missed opportunity. It should be a detailed page that explains each guarantee, showcases quality control processes, and reassures the customer.
*   **Recommendation:** Prioritize building a strong foundation of trust. Create an "About Us" page. Add the full, verifiable address. Seek permission from past clients to use their logos and develop 1-2 detailed case studies. Enhance the "Guarantees" page with more detail and supporting visuals.

### 5.3. Conversion Funnels

The primary calls-to-action (CTAs) are "Hisob so'rash" (Request a quote) and contacting via Telegram. While clear, the path to conversion is weakened by the lack of information.

*   **Information Gaps:** A user is asked to request a quote without having sufficient information. The catalog lacks filtering, search, and detailed product comparison features. Service pages are non-existent. A user cannot easily determine if the company's offerings are a good fit before being pushed to make contact.
*   **Recommendation:** Rework the product catalog into a fully functional, filterable interface. Create dedicated pages for each core service (e.g., Lazer o'ymakorlik, Welcome-to'plamlar) that detail the process, materials, and pricing options. The goal should be to empower the user with information so that when they do make contact, they are a highly qualified lead.

## 6. International & Multilingual SEO

The site correctly targets both Russian and Uzbek-speaking audiences in Uzbekistan, which is a significant strength. The implementation, however, has several inconsistencies that should be addressed.

### 6.1. Hreflang Implementation

*   **Strengths:** The site correctly implements `hreflang` tags in the `<head>` of pages and within the XML sitemap. It specifies `ru-UZ` and `uz-UZ` for the respective language versions and uses `x-default` to point to the Russian version, which is an acceptable strategy.
*   **Weaknesses:** The URL structure does not align with the language targeting. As noted previously, Russian pages have English slugs, and Uzbek pages sometimes have Russian slugs. This creates a mixed signal for search engines.
*   **Recommendation:** Align the URL slug language with the `hreflang` declaration. For example, the page `https://graver-studio.uz/ru/engraved-gifts` should be moved to a Russian-language slug like `https://graver-studio.uz/ru/gravirovannye-podarki`, with a 301 redirect in place.

### 6.2. Content Parity and Translation Quality

*   **Strengths:** The site appears to have near-complete content parity between the Russian and Uzbek versions. Key pages, navigation, and forms are all translated, providing a consistent experience for users in both languages.
*   **Weaknesses:** The presence of Russian slugs in the Uzbek blog section (e.g., `/uz/blog/chto-podarit-devushke-na-8-marta-uz`) indicates a potential workflow issue in content management. It suggests that articles may be created in Russian first and then translated, with the URL slug being overlooked during the translation process.
*   **Recommendation:** Establish a clear process for creating and translating content that includes translating the URL slug. Conduct a full review of the Uzbek site to find and correct any remaining Russian-language slugs, implementing 301 redirects to preserve SEO value.

## 7. Prioritized Recommendations

This table provides a prioritized list of actions to address the findings of this audit. The priority is based on the potential impact on SEO, user experience, and conversions.

| Priority | Task | Area | Rationale |
| :--- | :--- | :--- | :--- |
| **1 (Highest)** | **Fix Critical Blog Rendering Bug** | Technical SEO | The bug makes content unreadable, destroying SEO and user trust. This is a site-breaking issue for affected pages. |
| **2 (High)** | **Create "About Us" & Enhance "Contacts" Page** | E-A-T / CRO | Building trust is paramount for B2B. A complete address and company story are foundational to establishing credibility. |
| **3 (High)** | **Conduct Full Blog Content Audit** | Content SEO | Merge duplicate articles, delete thin content, and improve valuable posts. This will resolve keyword cannibalization and improve overall site quality. |
| **4 (High)** | **Implement Comprehensive Schema Markup** | Technical SEO | Add `Article`, `BreadcrumbList`, and `FAQPage` schema to become eligible for rich snippets and improve search visibility. |
| **5 (Medium)** | **Standardize URL Slugs** | Technical SEO | Translate all English/Russian slugs to the appropriate language for each site version (`/ru/` and `/uz/`) and implement 301 redirects. |
| **6 (Medium)** | **Expand Core Pages (Guarantees, Catalog)** | UX / CRO | Develop thin, placeholder-like pages into valuable resources that support the user journey and build confidence. |
| **7 (Medium)** | **Build Out a Full Portfolio Page** | UX / E-A-T | Showcase the company’s best work in a dedicated, filterable portfolio to provide strong visual proof of expertise. |
| **8 (Low)** | **Optimize Meta Titles and Descriptions** | On-Page SEO | Ensure all pages have unique, branded titles and compelling descriptions to improve click-through rates from search results. |
| **9 (Low)** | **Run Full Performance Audit** | Technical SEO | Once API access is restored, conduct a full PageSpeed Insights analysis to identify and fix performance bottlenecks. |

---

**End of Report**
