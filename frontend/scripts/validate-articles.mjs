import { blogPosts } from '../src/data/blogPosts.js';
import { ArticleValidator } from '../src/utils/articleValidator.js';

const allArticles = [...(blogPosts.ru || []), ...(blogPosts.uz || [])];

console.log('🔍 validating article data...');
const validation = ArticleValidator.validateAllArticles(allArticles);

console.log(`total=${validation.totalArticles}`);
console.log(`valid=${validation.validArticles}`);
console.log(`invalid=${validation.invalidArticles}`);

if (!validation.isValid) {
  console.log('errors:');
  validation.errors.forEach((entry) => {
    console.log(`- #${entry.index} (${entry.slug || 'no-slug'})`);
    entry.errors.forEach((error) => console.log(`  - ${error}`));
  });
}

const sanitized = ArticleValidator.sanitizeAllArticles(allArticles);
const sanitizedValidation = ArticleValidator.validateAllArticles(sanitized);
console.log(`sanitized_valid=${sanitizedValidation.validArticles}`);

if (!sanitizedValidation.isValid) {
  process.exit(1);
}
