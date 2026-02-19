// scripts/validate-canonical-hreflang.js
// Node.js script to validate canonical/hreflang pairs and slugmap consistency for blog posts

const fs = require('fs');
const path = require('path');

const slugMap = require('../src/data/blogSlugMap');
const { buildCanonical, buildAlternate, HREFLANG_MAP } = require('../src/config/seo');

function validateSlugPairs() {
  let errors = [];
  for (const [ru, uz] of Object.entries(slugMap)) {
    if (!ru || !uz) {
      errors.push(`Missing RU or UZ slug: ru=${ru}, uz=${uz}`);
    }
    if (!slugMap[ru] || !slugMap[uz]) {
      errors.push(`Slug not mapped both ways: ru=${ru}, uz=${uz}`);
    }
  }
  return errors;
}

function validateCanonicalHreflang(urls) {
  let errors = [];
  for (const { pathname, locale } of urls) {
    const canonical = buildCanonical(pathname);
    const altRu = buildAlternate(pathname, locale, 'ru');
    const altUz = buildAlternate(pathname, locale, 'uz');
    if (locale !== 'ru' && !altRu.includes('/ru/')) {
      errors.push(`No RU alternate for ${pathname}`);
    }
    if (locale !== 'uz' && !altUz.includes('/uz/')) {
      errors.push(`No UZ alternate for ${pathname}`);
    }
    if (!canonical.startsWith('https://graver-studio.uz/')) {
      errors.push(`Canonical not valid for ${pathname}: ${canonical}`);
    }
  }
  return errors;
}

// Example usage: validate 10 random blog posts
const blogPosts = require('../src/data/blogPosts');
const sample = blogPosts.slice(0, 10).map(post => ({
  pathname: post.slug.startsWith('/') ? post.slug : `/ru/blog/${post.slug}/`,
  locale: post.locale || 'ru',
}));

const slugErrors = validateSlugPairs();
const hreflangErrors = validateCanonicalHreflang(sample);

if (slugErrors.length || hreflangErrors.length) {
  console.error('Validation errors:');
  slugErrors.forEach(e => console.error(e));
  hreflangErrors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log('Canonical/hreflang/slugmap validation PASS');
}
