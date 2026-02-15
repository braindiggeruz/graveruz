const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INPUT = path.join(ROOT, 'frontend', 'src', 'data', 'blogPosts.generated.json');

if (!fs.existsSync(INPUT)) {
  console.error('blogPosts.generated.json not found. Run parseArticles.js first.');
  process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const count = posts.length;
const duplicates = count - new Set(posts.map(p => `${p.language || 'ru'}:${p.slug}`)).size;
const minWordCount = count ? Math.min(...posts.map(p => p.wordCount || 0)) : 0;
const below300 = posts.filter(p => (p.wordCount || 0) < 300);
const missingRequired = posts.filter(
  p => !p.slug || !p.title || !p.content || !p.language || !p.metaDescription || !p.canonicalUrl
);

console.log(`count=${count}`);
console.log(`duplicates=${duplicates}`);
console.log(`min_word_count=${minWordCount}`);
console.log(`below_300=${below300.length}`);
console.log(`missing_required=${missingRequired.length}`);

if (duplicates > 0 || below300.length > 0 || missingRequired.length > 0) {
  process.exit(2);
}
