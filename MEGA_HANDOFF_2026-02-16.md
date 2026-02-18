# MEGA HANDOFF — Graveruz SEO/CWV/Indexing

**Date:** 2026-02-16  
**Prepared for:** New agent continuation after repeated VS Code freezes  
**Objective:** Give complete technical continuity so work can continue immediately without re-discovery.

---

## 1) Executive Context

This project already passed through multiple major SEO/performance/indexing phases. Most high-impact foundational work is done and shipped on `main`.  
Current continuation point is **post-foundation growth optimization** with two categories:

1. **Operational indexing cadence** (Google submissions + monitoring, Bing authorization blocker)
2. **On-site internal linking + freshness boosts** (money-page link equity strengthening)

The current branch is:
- `main` (tracking `origin/main`)

Current working tree includes **uncommitted SEO edits** that were being finalized when the editor repeatedly froze.

---

## 2) What Has Been Completed (Chronological Technical Summary)

Below is the consolidated history from prior session execution + repository evidence.

### Phase A — Core SEO/CWV diagnosis
- Identified major performance bottleneck: large blog PNG assets (very heavy media footprint).
- Confirmed SEO baseline existed (canonical/hreflang/robots/OG/Twitter), but crawl/index/performance signals needed deep strengthening.

### Phase B — Image optimization pipeline (P0)
- Added generation pipeline for responsive image variants (AVIF/WebP + fallback PNG strategy).
- Added verification and audit scripts for image coverage/storage.
- Integrated responsive `<picture>` delivery in blog listing.
- Improved card loading behavior and mobile rendering behavior.
- Build validations were run and changes were committed/pushed.

### Phase C — Blog post page optimization
- Added responsive hero image delivery for posts.
- Enriched BlogPosting schema image data.
- Build validated and pushed.

### Phase D — Per-post OG pipeline
- Implemented per-post OG image generation (`*-og.jpg`, 1200x630).
- Wired per-post OG resolution into post SEO metadata and JSON-LD.
- Build passed (with memory retry when necessary), then pushed.

### Phase E — Build stability hardening
- Added automatic heap safeguard for prerender workflow.
- Goal: avoid manual `NODE_OPTIONS` intervention.
- Verified successful full build without ad-hoc heap env per run.

### Phase F — Indexing backend diagnostics & operations
- Investigated backend indexing API and runtime blockers.
- Added unified health endpoint for indexing readiness diagnostics.
- Verified Google submission path works.
- Observed Bing consistently returns authorization 403 despite key file availability.

### Phase G — Critical canonical conflict fix
- Root cause for index-quality issues found: hardcoded canonical/hreflang/OG tags in base HTML template conflicting with per-page SEO.
- Removed global hardcoded SEO tags from template.
- Rebuilt, validated prerender output canonical behavior, pushed fix.

### Phase H — “Technical hacks” document triage + practical implementation
- Reviewed external prompt/doc recommendations.
- Implemented high-value subset: image sitemap generation, indexability verification checks, stronger internal linking strategy.
- Improved strict-vs-warning behavior in verifier.
- Committed/pushed.

### Phase I — SEO fallback dedupe cleanup
- Fixed duplicate canonical/hreflang from fallback head injection logic.
- Rebuilt + re-ran indexability checks with clean results.
- Committed/pushed.

### Phase J — Most recent operations before freezes
- Continued batch indexing runs through local backend.
- Confirmed cycle completion behavior and cursor resets.
- Confirmed Google submissions go through, Bing remains unauthorized.
- Then started implementing next growth step: **money-link reinforcement in blog pages** (currently uncommitted).

---

## 3) Commit Landmarks on `main` (Recent)

Recent commits observed in repo log:

- `8cc0015` fix(seo): dedupe blog fallback head tags for clean indexability checks
- `d1c5bea` feat(seo): add image sitemap and indexability CI checks
- `c2491d2` fix(seo): remove hardcoded canonical metadata from html template
- `3912eab` feat(indexing): add unified health diagnostics endpoint
- `af6c58f` chore(build): enforce react-snap heap defaults
- `358fc8b` feat(seo): add per-post 1200x630 og image pipeline
- `05deea4` perf(blog): add responsive hero image for blog posts
- `e06c072` perf(blog): ship responsive avif/webp images and card picture srcset

Interpretation: foundation is not theoretical — it is materially committed.

---

## 4) Current Working Tree (Where We Stopped)

`git status -sb` showed:
- Modified:
  - `frontend/public/sitemap.xml`
  - `frontend/src/pages/BlogIndex.js`
  - `frontend/src/pages/BlogPost.js`
- Untracked:
  - `BLOG_UPDATE_PACKAGE/`
  - `FINAL_COMPLETE_ANALYSIS_AND_ROADMAP.md (1).docx`
  - `frontend/public/image-sitemap.xml`
  - `🚀_ПРОМТ_ДЛЯ_КОДЕРА_НАЙДИ_ТЕХНИЧЕСКИЕ_ХАКИ_ДЛЯ_ТРАФИКА.docx`

### 4.1 Pending code edits in `BlogPost.js`
A new helper was added:
- `buildMoneyLinks(locale, slug, isRu)`

What it does:
- Detects topic intent from slug (watch/lighter/gift patterns).
- Builds locale-specific commercial link sets.
- Reorders links so the most relevant money page is first.
- Rewrites the top link anchor text into stronger commercial intent text (RU/UZ variants).

Old inline sorting logic was removed and replaced by:
- `var moneyLinks = buildMoneyLinks(locale, slug, isRu);`

### 4.2 Pending code edits in `BlogIndex.js`
Added a new section-level money hub links block:
- `moneyHubLinks` array (RU/UZ localized anchors)
- Visual section inserted before “All Posts”
- Purpose: pass link equity from blog hub to money pages with intent-rich anchors

### 4.3 Pending changes in `frontend/public/sitemap.xml`
Observed effects:
- Many `lastmod` dates updated to `2026-02-16`
- Additional blog URLs present in diff
- CRLF warning observed for this file in local working copy

Interpretation:
- This looks like generated/regenerated sitemap churn + content additions.
- Should be validated before commit to avoid noisy/accidental sitemap mutations.

---

## 5) Indexing Backend Status (Most Recent Known)

Operationally observed during session:
- Health endpoint previously showed:
  - sitemap exists with 68 URLs
  - Google client ready
  - Bing key configured + key file reachable/matching
- Batch runs:
  - Google submissions succeed in batches
  - Cursor/cycle mechanics function
  - Full cycles complete and reset cursor to 0
- Persistent external issue:
  - Bing IndexNow returns `403 UserForbiddedToAccessSite`

Latest local check at handoff moment:
- API on `127.0.0.1:8001` was temporarily unreachable (backend not currently running in that instant).

Conclusion:
- System design is working.
- Runtime service just needs to be started when operating locally.
- Bing remains an ownership/authorization issue outside code quality.

---

## 6) Strategic Position (What Is Done vs What Matters Now)

### Done (high leverage foundations)
- Canonical/hreflang conflict removed at source
- Prerender/heap reliability improved
- Image delivery drastically improved
- Per-post OG pipeline established
- Health diagnostics and indexability checks established
- Batch indexing workflow validated

### Current growth focus (next leverage)
1. Finalize and ship strong internal linking enhancements
2. Keep a controlled indexing cadence to force revisit after freshness/link updates
3. Monitor index progression in GSC and prioritize commercial URLs

---

## 7) Immediate Continuation Plan for New Agent (Step-by-step)

## Step 0 — Preflight snapshot
From repo root:
1. `git status -sb`
2. `git diff -- frontend/src/pages/BlogPost.js`
3. `git diff -- frontend/src/pages/BlogIndex.js`
4. `git diff -- frontend/public/sitemap.xml`

Goal: ensure no drift since this handoff file was created.

## Step 1 — Validate pending linking changes
- Check `BlogPost.js` for helper correctness and no dead paths.
- Check `BlogIndex.js` inserted block for:
  - locale-safe routes
  - no broken JSX
  - no visual/semantic regressions

## Step 2 — Build validation (frontend)
Run build with heap cap if needed:
- `cd frontend`
- `$env:NODE_OPTIONS='--max-old-space-size=4096'`
- `npm run build`

If OOM appears, retry once with 6144.

## Step 3 — Indexability verification
If scripts exist and are wired:
- `npm run verify:indexability` (or equivalent configured check)

Expectations:
- no critical canonical/hreflang dupes
- warnings acceptable only if explicitly non-blocking by policy

## Step 4 — Decide sitemap commit policy
For `frontend/public/sitemap.xml` and `frontend/public/image-sitemap.xml`:
- Commit only if regenerated output is intentional and coherent with content set.
- Avoid committing meaningless `lastmod` churn if policy is to generate in CI/postbuild.

## Step 5 — Commit SEO linking package
If build/checks pass, stage only intended files.
Preferred package:
- `frontend/src/pages/BlogPost.js`
- `frontend/src/pages/BlogIndex.js`
- (optional) sitemap files only if intentionally updated

Suggested commit message:
- `feat(seo): strengthen blog-to-money internal linking with intent anchors`

## Step 6 — Local indexing operations after deploy/push
Start backend (project-specific command used in session):
- `Set-Location F:/projects/graveruz/backend`
- `F:/projects/graveruz/.venv/Scripts/python.exe -m uvicorn server:app --host 127.0.0.1 --port 8001`

Then in another terminal:
- Check health: `/api/indexing/health`
- Run cycle: `/api/indexing/submit-next-batch` repeatedly until `cycleCompleted=true`
- Inspect key URLs: `/api/indexing/status?url=...`

## Step 7 — GSC operational follow-through
- Use URL Inspection for top money URLs and top blog hubs.
- Request indexing for highest-priority URLs after each meaningful content/link update.
- Track categories: indexed / crawled-not-indexed / discovered-not-indexed.

---

## 8) Known Risks and Practical Mitigations

### Risk A — Bing 403 persists
- Not code breakage; likely ownership scope mismatch in Bing Webmaster.
- Mitigation:
  - verify exact domain property
  - verify key ownership binding
  - ensure same host/path assumptions as IndexNow payload

### Risk B — Over-committing generated artifacts
- Sitemaps may be environment-generated and noisy.
- Mitigation:
  - commit only deterministic outputs by team policy
  - avoid accidental line-ending-only diffs

### Risk C — Mistaking Google metadata 404 for failure
- `urlNotifications/metadata` 404 can appear even after submit attempts for many page types.
- Mitigation:
  - treat API submit success + GSC inspection as combined signal
  - do not interpret metadata endpoint alone as definitive indexing failure

### Risk D — Editor freeze causing half-finished operations
- Mitigation:
  - short, atomic commits
  - checkpoint files like this handoff
  - run read-only status checks before each new edit burst

---

## 9) Recommended Next 48h Execution Cadence

### Hour 0–2
- Finalize pending `BlogPost.js` + `BlogIndex.js`
- Build + verify indexability
- Commit + push

### Hour 2–6
- Trigger indexing cycle once after push
- Submit top 10 commercial URLs manually in GSC Inspection

### Day 1 end
- Check crawl/index movement in GSC by URL clusters
- If stagnation: refresh 3–5 strongest pages with factual content delta + internal links

### Day 2
- Repeat one indexing cycle after fresh updates
- Evaluate CTR/title tuning opportunities for pages with impressions but weak clicks

---

## 10) Files Most Relevant for Continuation

Core frontend SEO pages/components:
- `frontend/src/pages/BlogPost.js`
- `frontend/src/pages/BlogIndex.js`
- `frontend/src/data/blogImages.js`
- `frontend/src/components/SeoMeta.js`
- `frontend/public/index.html`
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`
- `frontend/public/image-sitemap.xml`

Scripts/pipeline:
- `frontend/scripts/optimize-images-webp.mjs`
- `frontend/scripts/verify-image-variants.mjs`
- `frontend/scripts/audit-images.mjs`
- `frontend/scripts/postbuild-react-snap.js`
- `frontend/scripts/postbuild-sitemap.js`
- `frontend/scripts/verify-indexability.mjs`

Backend indexing:
- `backend/server.py`
- `backend/indexing_service.py`
- `backend/.env.example`
- `backend/run-next-batch.ps1`

Reference docs in repo:
- `SEO_ROADMAP.md`
- `SEO_WORKLOG_REPORT_2026-02-11.md`
- `DEPLOY.md`

---

## 11) Clean “Resume Prompt” for New Agent (copy-paste)

Use this to resume quickly in a new chat:

> Continue from `MEGA_HANDOFF_2026-02-16.md`. First, run preflight (`git status -sb`, diffs for `BlogPost.js`, `BlogIndex.js`, `sitemap.xml`). Finalize uncommitted SEO linking enhancements (contextual money anchors in blog post + money links section on blog hub), run frontend build and indexability verification, then commit only intended files. After push, run indexing batch cycle via backend API and provide a concise report of Google/Bing outcomes plus next highest-ROI action.

---

## 12) Bottom Line

You are **not** starting from scratch.
- Foundation SEO/CWV/indexing engineering is already in place and largely shipped.
- Current stop-point is a narrow, high-impact finishing package around internal linking + operational indexing cadence.
- Main unresolved external blocker is Bing authorization, not core implementation quality.

Proceed with atomic finalization, validation, commit, push, and controlled indexing rerun.
