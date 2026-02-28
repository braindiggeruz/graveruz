import {
  blogPosts,
  getPostsByLocale,
  validateAllBlogData,
} from '../src/data/blogPosts.js';
import { getBlogImageMappingCoverage } from '../src/data/blogImages.js';

function summarizeImageCoverage() {
  const locales = Object.keys(blogPosts || {});
  const results = locales.map((locale) => {
    const posts = getPostsByLocale(locale);
    const slugs = posts.map((post) => post.slug);
    const coverage = getBlogImageMappingCoverage(slugs);
    return {
      locale,
      total: coverage.total,
      mapped: coverage.mapped,
      missing: coverage.missing,
      coverage: coverage.coverage,
    };
  });

  return {
    results,
    hasMissing: results.some((item) => item.missing.length > 0),
  };
}

function logValidation(validation, imageCoverage) {
  console.log('\n[blog:validate] Blog data validation report');
  validation.results.forEach((result) => {
    console.log(`- locale=${result.locale} total=${result.total} valid=${result.valid} invalid=${result.invalid}`);
    if (result.duplicateSlugs.length > 0) {
      console.log(`  duplicateSlugs: ${result.duplicateSlugs.join(', ')}`);
    }
    if (result.missingRelatedRefs.length > 0) {
      const sample = result.missingRelatedRefs.slice(0, 5);
      sample.forEach((entry) => {
        console.log(`  broken relatedPosts: ${entry.slug} -> ${entry.refs.join(', ')}`);
      });
    }
    if (result.errors && result.errors.length > 0) {
      const sample = result.errors.slice(0, 5);
      sample.forEach((entry) => {
        console.log(`  invalid post: slug=${entry.slug} errors=${entry.errors.join('|')}`);
      });
    }
  });

  imageCoverage.results.forEach((item) => {
    console.log(`- images locale=${item.locale} mapped=${item.mapped}/${item.total} coverage=${Math.round(item.coverage * 100)}%`);
    if (item.missing.length > 0) {
      console.log(`  missing images: ${item.missing.slice(0, 10).join(', ')}`);
    }
  });
}

const validation = validateAllBlogData();
const imageCoverage = summarizeImageCoverage();

logValidation(validation, imageCoverage);

if (!validation.isValid || imageCoverage.hasMissing) {
  console.error('\n[blog:validate] FAILED');
  process.exit(1);
}

console.log('\n[blog:validate] OK');