# Cherry-Pick Handoff — Graver.uz Hardening Pass

**Purpose:** The hardening branch `hardening/pre-release-2026-02` cannot be pushed directly to GitHub because it is built on top of an Emergent platform auto-commit (`1ce715e`) that committed a 262 MB Chrome binary (`frontend/chrome/linux_arm-147.0.7722.2/chrome-linux64/chrome`). GitHub rejects files larger than 100 MB.

The 5 clean hardening commits are unrelated to the Chrome binary and can be safely cherry-picked onto `origin/main`.

---

## Clean Commits to Cherry-Pick (in order)

| Order | SHA | Message |
|---|---|---|
| 1 | `2779f26` | `hardening: slug pairs, phone tracking, footer anchor links, SEO overrides` |
| 2 | `eba38fd` | `hardening: fix hreflang regex in indexability validator; add schema injection script` |
| 3 | `50cda05` | `hardening: generate 217 missing AVIF/WebP/OG image variants for all PNG sources` |
| 4 | `80193e7` | `hardening: inject BlogPosting schema into 85 prerendered HEAD fragments; rebuild sitemap/RSS` |
| 5 | `3c42982` | `fix: repair validate-canonical-hreflang validator (ESM, correct paths); fix 3 asymmetric slug pairs` |

**Do NOT include:**
- `1ce715e` — Emergent auto-commit containing 262 MB Chrome binary
- `cf84677` — Emergent auto-commit (PRD.md only — optional to include, safe but not required)
- `264858c` — Emergent auto-commit (PRD.md only — optional, same)

---

## Recommended Cherry-Pick Commands

```bash
# Step 1: Clone or update your local copy of the repo
git clone git@github.com:braindiggeruz/graveruz.git  # if not already cloned
cd graveruz/frontend

# OR if already cloned:
git fetch origin
git checkout main
git pull origin main

# Step 2: Create a review branch from origin/main
git checkout -b review/hardening-2026-02 origin/main

# Step 3: Cherry-pick the 5 clean commits in order
git cherry-pick 2779f26
git cherry-pick eba38fd
git cherry-pick 50cda05
git cherry-pick 80193e7
git cherry-pick 3c42982

# Step 4: Push the review branch to GitHub
git push origin review/hardening-2026-02

# Step 5: Open a Pull Request on GitHub:
#   Base: main
#   Compare: review/hardening-2026-02
#   Title: "Pre-release hardening pass — SEO, tracking, schema, images, slug pairs"
```

---

## If Cherry-Pick Produces Conflicts

Conflicts are unlikely since all 5 commits modify different files, but if they occur:

```bash
# For each conflict:
git status                    # identify conflicting files
# Resolve in editor, then:
git add <conflicting-file>
git cherry-pick --continue    # resume cherry-pick
```

Most likely conflict file: `src/config/blogSlugMap.js` (if `origin/main` had any changes to this file after `fbf6739`).

---

## Rollback Instructions

If issues are found after merge:

```bash
# Option A: Revert the entire merge commit (if squash-merged)
git revert <merge-commit-sha>
git push origin main

# Option B: Revert individual commits (if not squash-merged, in reverse order)
git revert 3c42982
git revert 80193e7
git revert 50cda05
git revert eba38fd
git revert 2779f26
git push origin main

# Option C: Hard reset to pre-hardening baseline (destructive, use with caution)
git reset --hard fbf6739   # origin/main before this pass
git push --force origin main
```

---

## Emergent "Save to GitHub" Path

The Emergent platform's **"Save to GitHub"** button in the chat interface exports ONLY the committed changes as a clean patch, avoiding large binary files from previous auto-commits.

**Recommended path using Emergent:**
1. Use the "Save to GitHub" feature in the Emergent chat UI
2. This will push only the diff of tracked changes — not the Chrome binary
3. Alternatively, in the Emergent interface, create a new session/fork at a checkpoint AFTER commit `80193e7` and use "Save to GitHub" from there

**If using the Emergent platform directly**, the safest path is:
- Do NOT push the full branch from within the pod
- Use "Save to GitHub" from the platform UI which handles large file exclusions correctly

---

## File Summary for Review

| File | Change Type | Risk |
|---|---|---|
| `src/config/blogSlugMap.js` | +16 slug pair entries; 3 asymmetric conflicts fixed | Low |
| `src/data/blogSeoOverrides.js` | +55 SEO override entries (133 total) | Low |
| `src/App.js` | Footer links + global phone tracking delegation | Low |
| `src/utils/pixel.js` | New `trackPhoneClick()` function | Low |
| `scripts/verify-indexability.mjs` | Regex fix for hreflang validation | Low |
| `scripts/inject-missing-schema.mjs` | New utility script (does not run on deploy) | Zero |
| `scripts/validate-canonical-hreflang.mjs` | New validator (does not run on deploy) | Zero |
| `package.json` | Added `verify:canonical` script | Zero |
| `prerendered/*/blog/*/index.html` (85 files) | BlogPosting + BreadcrumbList schema injected | Low |
| `public/images/blog/*.avif/*.webp/*.jpg` (217 files) | Missing responsive image variants generated | Zero |
| `public/rss-ru.xml`, `public/rss-uz.xml`, `public/sitemap.xml` | Rebuilt by post-build scripts | Low |
