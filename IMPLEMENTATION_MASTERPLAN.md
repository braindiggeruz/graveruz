# Implementation Masterplan: graver-studio.uz

**Date:** March 13, 2026
**Author:** Manus AI (as Principal Implementation Lead)

---

## 1. Executive Implementation Verdict

The previous audit provides a solid foundation by identifying critical-to-low priority issues. However, the audit report is a diagnostic tool, not an execution plan. It is **not implementation-ready as-is** because it lacks the required safety protocols, sequencing, and operational detail for a high-stakes production environment.

*   **Where the Audit is Too Generic:** Recommendations like "Conduct a full content audit" or "Standardize URL Slugs" are strategically correct but operationally vague. They lack the step-by-step procedures, rollback plans, and QA checks necessary for safe execution. For instance, changing URL slugs is a high-risk, multi-step process involving redirect mapping, internal link updates, and post-launch validation, which the audit only briefly mentions.

*   **What Must Be Clarified Before Execution:**
    1.  **Root Cause of Rendering Bug:** The exact trigger for the intermittent Unicode rendering bug in the Next.js application is unknown. An investigation is required before a fix can be developed.
    2.  **Business & Content Authority:** We need access to the business to obtain the complete physical address, company registration details, and to identify team members for the "About Us" page.
    3.  **Analytics Access:** To safely merge or delete content, we need to analyze traffic and engagement data (e.g., from Google Analytics, Google Search Console) for each URL to avoid removing valuable pages.

*   **What Can Be Executed Immediately (Low Risk):**
    *   Fixing the typo in the blog title ("колеге" to "коллеге").
    *   Adding the complete, verifiable physical address to the `/contacts` page.
    *   Adding the brand name "Graver.uz" to product page titles that are missing it.

*   **What is High-Risk and Needs Extra Caution:**
    *   **URL Slug Changes:** This is the highest-risk activity. If mismanaged, it can lead to catastrophic ranking loss, broken internal links, and a poor user experience. It must be done in a highly controlled, phased manner with a comprehensive redirect plan.
    *   **Content Consolidation (Merging/Deleting):** Removing URLs without proper analysis and redirection can lead to the loss of established rankings and link equity.
    *   **Fixing the Rendering Bug:** Any change to the core rendering logic of the application carries a risk of introducing new, site-wide bugs. It must be tested extensively in a staging environment.

In summary, the audit is an excellent map of the territory, but this document will serve as the safe, surgical, and quality-controlled navigation plan to traverse it.

## 2. Convert Audit Into Workstreams

Here, the audit findings are organized into parallel workstreams, each with a clear goal, owner profile, and risk assessment.

| Workstream | Goal | Specific Tasks | Dependencies | Risk | Owner Profile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rendering / Bugs** | Ensure all site content renders correctly and reliably for all users and crawlers. | 1. Investigate and identify the root cause of the intermittent Unicode rendering bug on blog posts. 2. Develop a fix and test it in a staging environment. 3. Deploy the fix and validate on production. 4. Fix the typo in the blog title ("колеге"). | None | **High** | Senior Frontend Engineer |
| **Trust / E-E-A-T** | Establish Graver.uz as a credible, authoritative, and trustworthy B2B vendor. | 1. Create a new `/about` page with company story and team bios. 2. Obtain and add full, verifiable physical address and company registration details to `/contacts` and the footer. 3. Gather and display client logos and detailed case studies. | Business Stakeholders | Low | Content Strategist / UX Writer |
| **Content Cleanup** | Eliminate duplicate content, improve thin pages, and consolidate low-value articles. | 1. Perform a content inventory of the entire blog. 2. Identify articles for merging (duplicates) and improvement (thin content). 3. Create a redirect map for all merged articles. 4. Rewrite and expand thin content pages (e.g., `/guarantees`). | Analytics Access | **High** | SEO Content Specialist |
| **Info. Architecture** | Create a logical and scalable site structure that supports user journeys and SEO. | 1. Define a clear hierarchy for services, products, and portfolio. 2. Plan new pages: `/services` (landing), individual service pages, `/portfolio` (full). 3. Design the structure for an improved `/catalog` page with filtering. | Trust / E-E-A-T | Medium | UX Strategist / SEO Lead |
| **URL / Redirects** | Standardize all URLs to be language-appropriate and SEO-friendly. | 1. Create a complete map of all URLs needing slug changes (EN/RU slugs on RU/UZ pages). 2. Generate a 301 redirect map (old URL -> new URL). 3. Plan the technical implementation of redirects. | Info. Architecture | **Critical** | Technical SEO Lead |
| **Structured Data** | Implement comprehensive schema markup to enhance search visibility and eligibility for rich results. | 1. Add `Article`/`BlogPosting` schema to the blog template. 2. Add `BreadcrumbList` schema to all applicable pages. 3. Add `FAQPage` schema to the homepage FAQ section. 4. Implement `Service` schema on new service pages. | Info. Architecture | Low | Technical SEO Lead |
| **CRO / UX** | Optimize the user journey to reduce friction and increase qualified leads. | 1. Redesign the `/catalog` page with filters and search. 2. Enhance product pages with clearer specs and comparison features. 3. Add strong CTAs to the new `/portfolio` and `/services` pages. | Info. Architecture | Medium | CRO Lead / UX Designer |
| **Metadata** | Ensure every page has a unique, optimized, and compelling title and meta description. | 1. Rewrite product page titles to include the brand name. 2. Write unique meta descriptions for all key service, product, and content pages. | Info. Architecture | Low | SEO Specialist |
| **Multilingual SEO** | Ensure flawless technical implementation for Russian and Uzbek language versions. | 1. Update `hreflang` tags to point to the new, language-corrected URLs after the URL/redirect work is complete. 2. Verify that internal links correctly point to the same-language version of a page. | URL / Redirects | Medium | Technical SEO Lead |
| **Performance** | Improve Core Web Vitals and overall page load speed. | 1. Run PageSpeed Insights tests to establish a baseline. 2. Analyze JS bundles for optimization opportunities. 3. Optimize all images (compression, next-gen formats, correct sizing). | Rendering / Bugs | Medium | Frontend Engineer |
| **Analytics** | Ensure robust tracking is in place to measure performance and validate changes. | 1. Verify Google Analytics and Google Search Console setup. 2. Set up event tracking for key conversions (e.g., form submissions, phone clicks). 3. Configure dashboards to monitor organic traffic and rankings. | None | Low | Analytics Specialist |

## 3. Dependency-Aware Order of Execution

Executing changes in the wrong order can cause rework, data loss, or ranking drops. This sequence is designed to be the safest and most logical path forward, ensuring foundational fixes are in place before building upon them.

**Phase 1: Foundational Fixes & Information Gathering (Weeks 1-2)**
*   **1.1. Investigate Rendering Bug:** *Must be done first.* All other content and template changes are blocked until we understand and can fix the core rendering issue. The risk of deploying other changes on a potentially unstable platform is too high.
*   **1.2. Gather Trust Assets:** *Parallel task.* Obtain the full address, company details, and team information from the business. This doesn't depend on technical work and is required for the E-E-A-T workstream.
*   **1.3. Gain Analytics Access:** *Must be done first.* We cannot safely make decisions about content consolidation or URL changes without access to traffic and ranking data.

**Phase 2: Critical Bug Fix & Low-Risk Wins (Week 3)**
*   **2.1. Deploy Rendering Bug Fix (Staging):** Once the fix is developed, deploy it to a staging environment for rigorous testing.
*   **2.2. Implement Low-Risk Text Changes:** While the bug fix is in staging, a content editor can safely fix the "колеге" typo and update the address on the contact page. These are text-only changes with near-zero technical risk.
*   **2.3. Deploy Rendering Bug Fix (Production):** After successful staging validation, deploy the fix to production. Monitor closely.

**Phase 3: Content & Information Architecture (Weeks 4-6)**
*   **3.1. Content Inventory & Audit:** *Depends on Analytics Access (1.3).* Analyze all blog content to create a definitive list of articles to merge, improve, or delete.
*   **3.2. Define New Information Architecture:** *Depends on Content Audit (3.1).* Plan the new sitemap, including the structure for the `/about`, `/portfolio`, and `/services` pages. This architecture plan is the blueprint for all subsequent content and URL work.
*   **3.3. Create Redirect Map for Content Consolidation:** Based on the audit, create the 301 redirect map for all articles being merged.

**Phase 4: Staged Implementation of Structural Changes (Weeks 7-9)**
*   **4.1. Build New Pages (About, Portfolio, Services):** Develop the new pages based on the architecture defined in Phase 3. Do not link to them from the main navigation yet.
*   **4.2. Implement Content Merges & Redirects:** Execute the content consolidation plan. This is a high-risk step that requires careful validation.
*   **4.3. Implement Schema Markup:** With the new page templates and content in place, roll out the `Article`, `BreadcrumbList`, and other missing schema types.

**Phase 5: High-Risk URL Standardization (Weeks 10-11)**
*   **5.1. Create Full URL/Slug Redirect Map:** *Depends on new IA (3.2).* Create the master redirect map for changing all English/Russian slugs to their correct language versions.
*   **5.2. Implement URL & Hreflang Updates:** This is the most technically sensitive phase. Deploy the slug changes, the 301 redirects, and the updated `hreflang` tags simultaneously. This must be done in a single, coordinated release.

**Phase 6: CRO, UX, and Final Polish (Weeks 12+)**
*   **6.1. Update Internal Linking:** After all URL changes are complete and stable, perform a full-site crawl to update any remaining internal links pointing to old URLs.
*   **6.2. Launch New Pages in Navigation:** Add the new `/about`, `/portfolio`, and `/services` pages to the main navigation.
*   **6.3. Optimize Metadata & Performance:** With the site structure now stable, perform the final pass on optimizing all titles, meta descriptions, and image performance.

## 4. Risk Matrix

This matrix outlines potential negative outcomes for major change categories, their severity, and the protocols for prevention and recovery.

| Change Category | Potential Failure | Severity | Likelihood | Prevention | Rollback Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **URL Slug Changes** | Ranking loss due to broken redirects; redirect chains/loops; loss of link equity; broken internal links. | **Critical** | Medium | 1. Create a 1:1 redirect map. 2. Test redirects in staging. 3. Update sitemap and hreflang in the same release. 4. Perform a post-launch crawl to find 404s and redirect chains. | Revert the code that changed the slugs. Remove the new redirects. Re-deploy the old sitemap. (Requires git-based release management). |
| **Blog Content Merges** | Redirecting a high-traffic page to an irrelevant target; loss of rankings for valuable long-tail keywords. | High | Medium | 1. Use analytics to identify pages with significant traffic/impressions before merging. 2. Ensure the redirect target is the most relevant canonical version. 3. Manually check the top 5 merged pages post-launch. | Remove the 301 redirect from the server configuration. The old URL will become active again (assuming it wasn't physically deleted from the CMS). |
| **Rendering Fixes** | The fix introduces a new, site-wide bug (e.g., breaks all images, disables all forms). | **Critical** | Low | 1. Isolate the fix to the specific component/template responsible. 2. Rigorous testing in a staging environment that mirrors production. 3. Test across multiple browsers and devices. | Immediate rollback of the deployment via version control (e.g., `git revert` or re-deploying the previous stable release). |
| **Schema Rollout** | Invalid schema syntax causes parsing errors in Google Search Console; incorrect schema types are applied. | Medium | Low | 1. Validate all new schema markup using Google's Rich Results Test *before* deployment. 2. Deploy schema for one template first (e.g., one blog article) and verify in GSC before rolling out to all. | Revert the commit that added the schema markup. This is a low-risk change and rollback is simple. |
| **Multilingual Corrections** | Incorrect hreflang tags create indexing conflicts; users are redirected to the wrong language version. | High | Medium | 1. Ensure hreflang tags point to the final, canonical URLs (post-slug changes). 2. Manually test the language switcher and geo-targeting behavior from different locations (using a VPN). | Revert the code changes related to hreflang generation. This is typically a straightforward code change. |
| **Catalog Restructuring** | New structure creates a worse user experience; filtering logic is buggy; key product pages are removed. | High | Medium | 1. Wireframe and user-test the new catalog design before building. 2. Ensure all existing product URLs are preserved or correctly redirected if the structure changes. | If the new catalog is a separate component, switch back to the old component. If it's an in-place edit, revert the deployment. |

## 5. Safe Rollout Plan

This phased rollout is designed to de-risk the implementation, with verification gates at the end of each phase before proceeding to the next.

### Phase A: Zero-Risk Quick Wins
*   **Tasks:**
    1.  **Fix Typo:** Correct "колеге" to "коллеге" in the blog title.
    2.  **Update Contact Address:** Add the complete, verified street number to the address on the `/contacts` page.
    3.  **Brand Meta Titles:** Add "| Graver.uz" to the titles of product pages that are missing it.
*   **Why Now:** These are text-only changes that require no code deployment and have virtually zero risk. They provide immediate, albeit small, quality improvements.
*   **Verification Gate:** Manually inspect the live pages to confirm the text changes are visible. Check the page source to confirm the title tags have been updated.

### Phase B: Foundational Technical Fixes
*   **Tasks:**
    1.  **Investigate & Fix Rendering Bug:** A developer must diagnose the root cause of the Unicode rendering bug, develop a fix, and test it.
    2.  **Deploy Fix to Staging:** The fix must be deployed to a staging environment.
    3.  **QA the Fix:** Test the affected URL, plus a sample of 5-10 other blog articles, to ensure the fix works and has not introduced any regressions.
    4.  **Deploy Fix to Production:** Once verified, deploy to the live site.
*   **Why Now:** The rendering bug is the most critical technical issue. No other template or content work should proceed until the platform is stable.
*   **Verification Gate:** The previously broken blog article must render correctly in production. A spot-check of 10+ other articles must show no new rendering issues. Google Search Console's "URL Inspection" tool should show the rendered HTML as correct.

### Phase C: Content Architecture & Consolidation
*   **Tasks:**
    1.  **Create New Pages (Unlinked):** Build the new `/about`, `/portfolio`, and `/services` pages. They should be live but not yet linked in the main navigation.
    2.  **Expand Thin Pages:** Rewrite the content for the `/guarantees` and `/catalog` pages to be more substantial.
    3.  **Implement Blog Merges:** Based on the content audit, merge duplicate articles and implement the 301 redirects.
*   **Why Now:** This phase builds out the necessary page structure and improves content quality without touching the highest-risk elements like URL slugs or site-wide navigation.
*   **Verification Gate:** The new pages must be accessible via their direct URLs. The redirects for merged articles must be tested and return a 301 status code. The expanded content on the guarantees/catalog pages must be live.

### Phase D: High-Risk URL & Schema Implementation
*   **Tasks:**
    1.  **Deploy URL Slug Changes & Redirects:** In a single, coordinated release, deploy the code to change all non-standard URL slugs and implement the corresponding 301 redirects.
    2.  **Deploy Schema Markup:** In the same release, deploy the new `Article`, `BreadcrumbList`, and `FAQPage` schema.
    3.  **Update Sitemap & Hreflang:** The sitemap and all `hreflang` tags must be updated to reflect the new URLs in this release.
*   **Why Now:** This is the most technically complex phase and is done after content structure is stable. Grouping these changes reduces the number of high-risk deployments.
*   **Verification Gate:** Crawl the entire site to check for 404s and redirect chains. Use the Rich Results Test to validate the new schema on a sample of pages. Manually check that `hreflang` tags point to the new, correct URLs.

### Phase E: Final UX/CRO Polish & Launch
*   **Tasks:**
    1.  **Update Main Navigation:** Add the new `/about`, `/portfolio`, and `/services` pages to the main navigation menu.
    2.  **Full Internal Link Audit:** Crawl the site again to find and update any internal links that still point to old, redirected URLs.
    3.  **Performance Optimization:** With the site now functionally complete, perform image optimization and investigate JS bundle sizes.
*   **Why Now:** This is the final phase that makes the new architecture fully visible to users. It's done last because all underlying structures and URLs are now stable.
*   **Verification Gate:** The new navigation links must be present and functional. The crawl report should show no internal links pointing to redirected URLs. PageSpeed scores should show improvement.

## 6. QA / Validation Framework

Every change must be validated against this framework. "Done" means "Verified."

| Change Type | Manual Checks | Technical Checks | Source Code Checks | Post-Deployment Monitoring |
| :--- | :--- | :--- | :--- | :--- |
| **Content Change** (e.g., typo fix, new paragraph) | - Read the change on the live page. <br>- Check for formatting issues. <br>- Verify on mobile. | - N/A | - Inspect the HTML to ensure the text is present and not broken by code. | - N/A |
| **URL/Slug Change** | - Manually type the old URL and verify it 301 redirects to the new URL. <br>- Navigate to the new URL directly and ensure it loads with a 200 status. | - Crawl a list of changed URLs to verify 301 status codes. <br>- Crawl the site to find any internal links still pointing to the old URL. | - Check the `<link rel="canonical">` tag points to the new, final URL. <br>- Check that the `<link rel="alternate" hreflang="...">` tags point to the new URLs. | - Monitor Google Search Console for a spike in "Not Found (404)" errors. <br>- Check GSC "Page Indexing" report to ensure new URLs are being indexed. |
| **Schema Change** | - N/A | - Paste the URL into Google's Rich Results Test and ensure it is valid and eligible for rich results. | - View page source and find the `<script type="application/ld+json">` block. <br>- Verify the correct schema type and properties are present. | - Monitor GSC "Enhancements" tab (e.g., FAQ, Articles) to see if Google is successfully parsing the new schema. |
| **Rendering Bug Fix** | - Visit the previously broken page and confirm it renders correctly. <br>- Spot-check 10+ other pages (especially different templates like product, category, homepage) to ensure no new bugs were introduced. <br>- Test on Chrome, Firefox, and Safari, and on a mobile device. | - Use Google Search Console's "URL Inspection" -> "Live Test" to see how Googlebot renders the page. The rendered HTML should be clean. | - View the page source. The initial HTML from the server should contain readable text, not Unicode escapes. | - Monitor for any new JavaScript errors in the browser console. <br>- Monitor GSC for any increase in crawl anomalies. |
| **New Page Launch** (e.g., /about) | - Navigate to the page from the main menu. <br>- Check all links on the page. <br>- Review all content for typos and formatting. <br>- Verify on mobile. | - Ensure the page returns a 200 status code. <br>- Check that it is included in the XML sitemap. | - Verify it has a unique `<title>` and meta description. <br>- Verify it has a self-referencing canonical tag. | - Use GSC to request indexing for the new page. <br>- Monitor its appearance in search results. |

## 7. Rollback / Recovery Rules

This policy defines when and how to revert changes to prevent or minimize damage to production.

*   **When to Revert Immediately:** A rollback is mandatory and immediate if a deployment causes any of the following:
    *   **Critical User Journey Failure:** Key actions like form submissions, product page loading, or the main navigation are broken.
    *   **Site-wide Rendering Failure:** A significant portion of the site (e.g., all product pages, the entire blog) shows visible rendering errors.
    *   **Spike in 5xx Server Errors:** The deployment causes server instability.

*   **Signals That Require a Rollback Decision:**
    *   A post-deployment crawl reveals a significant number of new 404 errors that are not covered by intended redirects.
    *   Google Search Console reports a sharp increase in crawl errors or a drop in indexed pages within 48 hours of a major change (like URL standardization).
    *   Key conversion metrics (e.g., leads from the contact form) drop by more than 20% in the 24-48 hours following a release, and no other cause can be identified.

*   **How to Isolate a Bad Release:**
    *   **No Chained Risky Changes:** Never deploy two high-risk changes in the same release. For example, do not deploy the URL slug changes *at the same time* as a major redesign of the catalog. Each high-risk change should be a separate, isolated release.
    *   **Feature Flags:** For complex UX changes (like a new catalog), use feature flags to enable the feature for a small subset of users (or only internal IPs) before a full rollout. This allows for testing in production with zero risk to the general user base.

*   **Monitoring Period:**
    *   **Low-Risk Changes (Text, Metadata):** Require a 24-hour monitoring period.
    *   **Medium-Risk Changes (Schema, New Pages):** Require a 3-day monitoring period, paying close attention to Google Search Console data.
    *   **High-Risk Changes (URL Slugs, Rendering Fixes):** Require a full **7-day monitoring period** before the next phase can begin. During this week, the GSC crawl error reports, indexing status, and organic traffic metrics must be checked daily.

## 8. Implementation Backlog

This backlog translates the audit findings into a structured list of engineering and content tasks.

| ID | Task | Category | Priority | Effort | Risk | Dependency | Acceptance Criteria | Rollback Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | Investigate and fix intermittent Unicode rendering bug in blog. | Rendering | **1 (Highest)** | M | **Critical** | - | Article content renders as readable HTML. No regressions introduced. | Revert deployment. |
| **EAT-01** | Create new `/about` page with company story and team bios. | E-A-T | **2 (High)** | M | Low | Business Info | Page is live, linked from footer, and contains approved content. | Delete the page and remove link. |
| **EAT-02** | Add full physical address and company details to `/contacts`. | E-A-T | **2 (High)** | S | Low | Business Info | Address is complete and visible on the contact page. | Revert text change. |
| **CON-01** | Audit all blog content; create merge/improve/delete list. | Content | **3 (High)** | L | Low | Analytics | A spreadsheet is produced with a decision for every blog URL. | N/A (planning task). |
| **CON-02** | Merge duplicate blog articles and implement 301 redirects. | Content | **3 (High)** | M | High | CON-01 | Old URLs 301 redirect to canonical versions. | Remove redirects. |
| **SEO-01** | Implement `Article`, `BreadcrumbList`, `FAQPage` schema. | Schema | **4 (High)** | M | Low | IA-01 | Schema validates in Rich Results Test for all relevant templates. | Revert schema code. |
| **URL-01** | Create full redirect map for language-specific slug changes. | URL / Redirects | **5 (Medium)** | M | Low | IA-01 | A spreadsheet mapping all old URLs to new URLs is created. | N/A (planning task). |
| **URL-02** | Implement slug changes and 301 redirects from old URLs. | URL / Redirects | **5 (Medium)** | L | **Critical** | URL-01 | All old URLs 301 redirect correctly. Sitemap and hreflang are updated. | Revert deployment. |
| **IA-01** | Design new Information Architecture (sitemap for new pages). | Info. Arch. | **6 (Medium)** | M | Low | CON-01 | A visual sitemap or document outlining the new site structure is approved. | N/A (planning task). |
| **UX-01** | Expand content on `/guarantees` and `/catalog` pages. | UX / CRO | **6 (Medium)** | M | Low | IA-01 | Pages have new, approved content and are no longer thin. | Revert content changes. |
| **EAT-03** | Build a dedicated, filterable `/portfolio` page. | E-A-T | **7 (Medium)** | L | Medium | IA-01 | Page is live and showcases company work with high-quality images. | Delete the page and remove links. |
| **SEO-02** | Optimize all key page titles and write meta descriptions. | Metadata | **8 (Low)** | L | Low | IA-01 | All key pages have unique, branded titles and compelling descriptions. | Revert text changes. |

*Effort: S=Small, M=Medium, L=Large*

## 9. Acceptance Criteria

This section defines the specific, non-vague conditions for marking a major task as "Done."

*   **Task BUG-01: Fix Rendering Bug**
    *   **Done When:** The URL `/ru/blog/korporativnye-podarki-na-8-marta-v-tashkente` renders human-readable Cyrillic text in a standard browser.
    *   **AND:** Viewing the page source for the above URL shows rendered HTML text, not Unicode escape sequences (e.g., `\\u041a`).
    *   **AND:** A random sample of 10 other blog articles in both Russian and Uzbek continue to render correctly.

*   **Task URL-02: Implement Slug Changes**
    *   **Done When:** Every URL listed in the `URL-01` redirect map correctly 301 redirects to its new target URL.
    *   **AND:** The new XML sitemap, submitted to Google Search Console, contains only the new, final URLs.
    *   **AND:** A post-deployment crawl of the site reports zero 404 errors for internal links.
    *   **AND:** The `hreflang` tags on a sample of 5 pages with changed URLs point to the new, correct alternate language URLs.

*   **Task IA-01 / EAT-01: Launch New Core Pages**
    *   **Done When:** The `/about`, `/portfolio`, and `/services` pages are live and return a 200 status code.
    *   **AND:** Each new page has a unique H1, title tag, and meta description.
    *   **AND:** Each new page is populated with approved, final content (not placeholder text).

*   **Task UX-01: Expand Guarantees Page**
    *   **Done When:** The `/guarantees` page contains at least 300 words of explanatory text.
    *   **AND:** The page includes content that explains the *process* behind the guarantees, not just listing them.
    *   **AND:** The page includes at least one trust-enhancing element, such as a testimonial or a link to a relevant case study.

*   **Task CON-02: Merge Blog Content**
    *   **Done When:** All URLs identified for deletion in the content audit (`CON-01`) return a 301 status code.
    *   **AND:** The redirect target for each deleted URL is the designated canonical URL as specified in the audit.
    *   **AND:** The canonical pages have been updated or merged with the content from the deleted pages.

## 10. Execution Prompts for Each Phase

These are standalone, copy-pasteable prompts designed for a qualified agent to execute each phase of the rollout plan with a heavy emphasis on safety and verification.

---

### **Execution Prompt: Phase A - Zero-Risk Quick Wins**

**Goal:** Implement low-risk, high-confidence text-based changes to improve site quality without touching code.

**Safety Rules:**
- You are only permitted to edit on-page text content and metadata for this phase.
- You must not deploy any code or change any file that affects the site's rendering logic.
- You must verify every change manually on the live site.

**Tasks:**
1.  **Access the Site CMS:** Gain access to the content management system for `graver-studio.uz`.
2.  **Fix Typo:** Navigate to the blog article containing the title with the word "колеге" and correct it to "коллеге".
3.  **Update Contact Address:** Navigate to the `/contacts` page editor. Append the correct street number to the address line, based on information provided by the business.
4.  **Brand Meta Titles:** For the following product pages, access their metadata editor and append " | Graver.uz" to the end of their `<title>` tag: `/ru/products/pens`, `/ru/products/powerbanks`, `/ru/products/notebooks`.

**Deliverables:**
1.  **Change Log:** Produce a Markdown file listing each specific change made. Example:
    *   *Page:* `/ru/blog/some-article-url` -> *Change:* Corrected typo in H1 from "колеге" to "коллеге".
    *   *Page:* `/ru/contacts` -> *Change:* Updated address to include street number 'XX'.
2.  **Verification Report:** For each change, provide the URL and a screenshot confirming the update is live on the production site.

---

### **Execution Prompt: Phase B - Foundational Technical Fixes**

**Goal:** Diagnose and resolve the critical Unicode rendering bug in the blog, ensuring the fix is deployed safely without introducing regressions.

**Safety Rules:**
- All code changes MUST be developed and tested in a local or staging environment that mirrors production.
- Do not deploy the fix to production until it has been rigorously verified in staging.
- The fix should be as targeted as possible to the component responsible for rendering blog content.

**Tasks:**
1.  **Isolate the Bug:** Clone the site's repository. Set up a local development environment. Replicate the rendering bug on your local machine for the page `/ru/blog/korporativnye-podarki-na-8-marta-v-tashkente`. Investigate the data fetching, serialization, and component rendering pipeline for this specific page to identify the root cause.
2.  **Develop a Fix:** Implement a code change to resolve the bug.
3.  **Test in Staging:** Deploy your fix to a staging environment. 
    *   Verify that the target page now renders correctly.
    *   Verify that a sample of at least 10 other blog articles (5 RU, 5 UZ) and 5 non-blog pages (homepage, product, contacts) continue to render correctly and have not been negatively impacted (regression testing).
4.  **Deploy to Production:** Once staging verification is complete and approved, deploy the fix to the live site.

**Deliverables:**
1.  **Root Cause Analysis Report:** A brief document explaining what caused the bug.
2.  **Change Log:** A link to the specific commit(s) or pull request(s) containing the fix.
3.  **Verification Report:**
    *   Screenshots from the staging environment showing the broken page before the fix and the corrected page after the fix.
    *   A list of the 15+ URLs you checked for regressions.
    *   A screenshot of the live production page after deployment, confirming the fix is active.

---

### **Execution Prompt: Phase C - Content Architecture & Consolidation**

**Goal:** Build out the new information architecture and consolidate/improve existing content. This phase prepares the site structure for the high-risk URL changes to come.

**Safety Rules:**
- New pages (`/about`, `/portfolio`, `/services`) should be created but **NOT** linked from the main navigation menu in this phase.
- When merging blog articles, you MUST implement a 301 redirect from the old URL to the new one.
- Do not delete any pages without a redirect in place, unless they have zero traffic and are less than 3 months old.

**Tasks:**
1.  **Create New Pages:** Using the site's CMS, create the new `/about`, `/portfolio`, and `/services` pages. Populate them with the final, approved content.
2.  **Expand Thin Content:** Edit the `/guarantees` and `/catalog` pages to replace the placeholder content with the new, substantial versions.
3.  **Execute Blog Consolidation:** Using the content audit spreadsheet (`CON-01`) as your guide, perform the following for each article marked for a merge:
    *   Copy any valuable content from the old article to the canonical article.
    *   Set up a 301 redirect from the old article's URL to the canonical article's URL.

**Deliverables:**
1.  **Change Log:**
    *   A list of the new pages created, with their URLs.
    *   A list of the pages whose content was expanded.
    *   The final redirect map for all merged blog articles (Old URL -> New URL).
2.  **Verification Report:**
    *   Screenshots of the new `/about`, `/portfolio`, and `/services` pages.
    *   A report from a tool (like Screaming Frog or an online redirect checker) confirming that all old blog URLs correctly 301 redirect to their new targets.

---

### **Execution Prompt: Phase D - High-Risk URL & Schema Implementation**

**Goal:** Standardize all URL slugs to be language-appropriate and roll out missing schema markup in a single, controlled deployment.

**Safety Rules:**
- This is a high-risk operation. All changes (slugs, redirects, schema, sitemap, hreflang) MUST be bundled into a single release. Do not deploy them separately.
- You MUST have a complete and tested redirect map (`URL-01`) before starting.
- You MUST validate the new schema code before deployment.

**Tasks:**
1.  **Implement URL Changes:** In the codebase, change the URL slugs for all pages identified in the `URL-01` redirect map.
2.  **Implement Redirects:** In your server configuration (e.g., `next.config.js` or Cloudflare rules), implement all 301 redirects from the old URLs to the new URLs.
3.  **Implement Schema:** In the relevant page templates, add the `Article`, `BreadcrumbList`, and `FAQPage` schema markup.
4.  **Update Sitemap & Hreflang:** Ensure the sitemap generation logic now uses the new, final URLs. Ensure the `hreflang` generation logic also uses the new URLs.
5.  **Deploy:** Deploy all changes to production simultaneously.

**Deliverables:**
1.  **Change Log:** Link to the pull request containing all the code for this release.
2.  **Verification Report:**
    *   A redirect check report for a sample of 20 changed URLs.
    *   A validation report from Google's Rich Results Test for one of each template type (blog, homepage FAQ, product page with breadcrumbs).
    *   A link to the new `sitemap.xml` file.
    *   A screenshot of the source code of the homepage showing the updated `hreflang` tags pointing to the new URLs.

---

### **Execution Prompt: Phase E - Final UX/CRO Polish & Launch**

**Goal:** Integrate the new pages into the user journey, clean up all internal linking, and perform final optimizations.

**Safety Rules:**
- Do not proceed with this phase until Phase D has been live for at least 7 days and monitored for issues.
- The internal link audit must be comprehensive.

**Tasks:**
1.  **Update Navigation:** Edit the main navigation component to add links to the new `/about`, `/portfolio`, and `/services` pages.
2.  **Full Internal Link Audit:** Perform a full crawl of the production site. Identify every internal link (`<a>` tag) that points to a redirected URL. Access the source for each of these links and update them to point directly to the final, new URL.
3.  **Performance Optimization:** Analyze the site's performance using PageSpeed Insights. Identify the largest images and JavaScript bundles. Optimize images and investigate code-splitting opportunities to improve load times.

**Deliverables:**
1.  **Change Log:**
    *   A screenshot of the new main navigation.
    *   A list of files that were edited to update internal links.
    *   A summary of performance optimizations implemented.
2.  **Verification Report:**
    *   A post-change crawl report showing zero internal links pointing to 301-redirecting URLs.
    *   Before-and-after PageSpeed Insights scores for the homepage and a key product page.

## 11. “Do Not Break The Site” Rules

This is a non-negotiable ruleset for any developer or content editor working on the site. It is designed to enforce discipline and prevent reckless changes.

1.  **Production is Read-Only by Default:** You must never edit production code or content directly. All changes must go through a version-controlled (git) workflow and, where applicable, a staging environment.

2.  **URL Slugs Are Immutable:** Once the URL standardization in Phase D is complete, URL slugs must be considered permanent. They must not be changed casually. Any future URL change requires a new, formal redirect plan and sign-off from the SEO lead.

3.  **Never Mass-Delete Content:** Do not delete pages or articles in bulk. Every URL removal must be justified by data (low traffic, thin content) and must be accompanied by a 301 redirect to a relevant, live page.

4.  **Deployments Must Be Isolated:** Do not bundle unrelated high-risk changes. A change to the URL structure must NOT be deployed in the same release as a major change to the site's visual design. Isolate releases to specific workstreams (e.g., a "schema release," a "URL release").

5.  **All Code Changes Require a Staging Check:** No code (HTML, CSS, JS, backend logic) may be deployed to production without first being deployed to and verified on a staging server. The only exception is for pre-approved, emergency hotfixes for critical production bugs.

6.  **Validate Before, During, and After:**
    *   **Before:** Validate new schema in the Rich Results Test. Validate redirect maps with a crawler.
    *   **During:** Monitor the deployment process for errors.
    *   **After:** Immediately after deployment, manually check the top 5-10 affected pages. Then, begin the full QA and monitoring process as defined in the framework.

7.  **Content Does Not Dictate Design:** Do not force long, unformatted text into a design that is not built for it. If new content requires a new design component, that component must be designed and built as part of the information architecture, not hacked into an existing template by a content editor.

## 12. Final Recommended First Move

Based on the comprehensive analysis of risk, dependencies, and potential ROI, the first sequence of moves is clear and non-negotiable.

**1. The First Move:**
*   **Task:** **Investigate, identify, and fix the root cause of the intermittent Unicode rendering bug (BUG-01).**
*   This is purely a technical investigation and development task. It involves no content changes, no URL changes, and no design changes.

**2. Why This is the Safest and Highest ROI Move:**
*   **Safest:** This move is the safest because it is the most isolated. The investigation happens offline in a local development environment. The fix is tested in a staging environment, completely separate from the live site. The risk is contained, and the rollback plan is simple (re-deploy the previous version). It addresses the single most critical point of failure on the platform before any other work begins.
*   **Highest ROI:** The ROI is exceptionally high because the bug currently renders entire pages worthless. A page of unreadable code has a 100% bounce rate, zero conversion rate, and zero SEO value. Fixing this bug instantly restores the full value of any affected page. No other single action can reclaim this much lost value so efficiently. It turns a completely broken asset into a functional one.

**3. What Must Be Frozen Until This is Fixed:**
*   **ALL Content Work:** Do not create, edit, or merge any blog articles. It is pointless to work on content when the template that renders it is unstable.
*   **ALL Template/Schema Changes:** Do not edit any page templates or attempt to roll out new schema markup. The rendering logic must be proven stable before it is modified further.
*   **ALL High-Risk Deployments:** Do not attempt any URL changes or other high-risk deployments until the platform's stability is guaranteed.

In short, the entire implementation plan is gated by the successful resolution of this single, critical bug. It is the lynchpin that unlocks all subsequent improvements.

---

**End of Masterplan**
