/**
 * validate-canonical-hreflang.mjs
 *
 * Validates canonical URL format, hreflang alternate logic, and slug-map
 * bidirectional consistency for Graver.uz blog posts.
 *
 * Fixed from the original validate-canonical-hreflang.js which used:
 *   - CJS require() against ESM files
 *   - Wrong module paths (src/data/blogSlugMap instead of src/config/blogSlugMap)
 *   - blogPosts.slice(0,10) assuming a flat array (actual shape: { ru:[], uz:[] })
 *
 * Run: node scripts/validate-canonical-hreflang.mjs
 */

import { BASE_URL, buildCanonical, buildAlternate } from '../src/config/seo.js';
import { BLOG_SLUG_MAP } from '../src/config/blogSlugMap.js';
import { blogPosts } from '../src/data/blogPosts.js';

const errors = [];
const warnings = [];

// ── 1. Canonical URL format check ────────────────────────────────────────────

function assertCanonical(pathname, locale) {
  const canonical = buildCanonical(pathname);
  if (!canonical.startsWith('https://graver-studio.uz/')) {
    errors.push(`[canonical] Invalid URL for ${pathname}: ${canonical}`);
  }
  if (!canonical.endsWith('/')) {
    errors.push(`[canonical] Missing trailing slash for ${pathname}: ${canonical}`);
  }
}

// ── 2. Hreflang alternate logic check ────────────────────────────────────────

function assertHreflang(pathname, fromLocale) {
  const toLocale = fromLocale === 'ru' ? 'uz' : 'ru';
  const alt = buildAlternate(pathname, fromLocale, toLocale);
  const expectedPrefix = `https://graver-studio.uz/${toLocale}/`;
  if (!alt.startsWith(expectedPrefix)) {
    errors.push(`[hreflang] Alternate for ${pathname} (${fromLocale}→${toLocale}) does not have expected prefix: ${alt}`);
  }
}

// ── 3. Slug map bidirectional consistency check ───────────────────────────────

function assertSlugMapBidirectional() {
  const { ru: ruMap, uz: uzMap } = BLOG_SLUG_MAP;

  for (const [ruSlug, uzSlug] of Object.entries(ruMap)) {
    if (!uzSlug) {
      errors.push(`[slugmap] RU slug "${ruSlug}" maps to empty UZ value`);
      continue;
    }
    // Verify reverse mapping exists and points back to this RU slug
    const reverseRuSlug = uzMap[uzSlug];
    if (!reverseRuSlug) {
      warnings.push(`[slugmap] UZ slug "${uzSlug}" (mapped from RU "${ruSlug}") has no reverse mapping`);
    } else if (reverseRuSlug !== ruSlug) {
      warnings.push(`[slugmap] Asymmetric pair: RU "${ruSlug}" → UZ "${uzSlug}" but UZ "${uzSlug}" → RU "${reverseRuSlug}" (not "${ruSlug}")`);
    }
  }

  for (const [uzSlug, ruSlug] of Object.entries(uzMap)) {
    if (!ruSlug) {
      errors.push(`[slugmap] UZ slug "${uzSlug}" maps to empty RU value`);
      continue;
    }
    // Verify RU slug exists in RU map
    const reverseUzSlug = ruMap[ruSlug];
    if (!reverseUzSlug) {
      warnings.push(`[slugmap] RU slug "${ruSlug}" (mapped from UZ "${uzSlug}") has no forward mapping`);
    }
  }
}

// ── 4. Sample canonical + hreflang on real blog post slugs ───────────────────

const allPosts = [
  ...(blogPosts.ru || []).slice(0, 8).map(p => ({ slug: p.slug, locale: 'ru' })),
  ...(blogPosts.uz || []).slice(0, 7).map(p => ({ slug: p.slug, locale: 'uz' })),
];

for (const { slug, locale } of allPosts) {
  const pathname = `/${locale}/blog/${slug}/`;
  assertCanonical(pathname, locale);
  assertHreflang(pathname, locale);
}

// ── 5. Run slug-map validation ────────────────────────────────────────────────

assertSlugMapBidirectional();

// ── 6. Output ─────────────────────────────────────────────────────────────────

if (errors.length) {
  console.error(`[validate-canonical-hreflang] FAIL: ${errors.length} error(s)`);
  errors.forEach(e => console.error(`  ✗ ${e}`));
}
if (warnings.length) {
  console.warn(`[validate-canonical-hreflang] WARN: ${warnings.length} warning(s)`);
  warnings.forEach(w => console.warn(`  ⚠ ${w}`));
}
if (!errors.length && !warnings.length) {
  console.log('[validate-canonical-hreflang] OK — no canonical/hreflang/slugmap errors');
} else if (!errors.length) {
  console.log('[validate-canonical-hreflang] OK — no hard errors (see warnings above)');
  process.exit(0);
} else {
  process.exit(1);
}
