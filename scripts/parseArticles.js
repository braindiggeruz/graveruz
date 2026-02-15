const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'blog', 'src', 'content');
const OUTPUT = path.join(ROOT, 'frontend', 'src', 'data', 'blogPosts.generated.json');
const BASE_URL = 'https://graver-studio.uz';

function listMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter((name) => /\.(md|mdx)$/i.test(name))
    .map((name) => path.join(dirPath, name));
}

function parseArrayValue(raw) {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((token) => token.trim().replace(/^['\"]|['\"]$/g, ''))
    .filter(Boolean);
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) {
    return { data: {}, content: markdown.trim() };
  }

  const raw = match[1];
  const content = markdown.slice(match[0].length).trim();
  const data = {};

  for (const line of raw.split(/\r?\n/)) {
    const parsed = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!parsed) continue;
    const key = parsed[1];
    let value = parsed[2].trim();
    if (!value) continue;

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = parseArrayValue(value);
      continue;
    }

    value = value.replace(/^['\"]|['\"]$/g, '');
    data[key] = value;
  }

  return { data, content };
}

function wordsCount(text) {
  const m = String(text || '').match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu);
  return m ? m.length : 0;
}

function makeMetaDescription(text, language) {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  const fallback = language === 'uz'
    ? "Korporativ sovg'alar bo'yicha amaliy qo'llanma."
    : 'Практическое руководство по корпоративным подаркам.';
  const source = cleaned || fallback;
  if (source.length <= 160) return source;
  const sliced = source.slice(0, 160);
  const spaceIndex = sliced.lastIndexOf(' ');
  return (spaceIndex > 120 ? sliced.slice(0, spaceIndex) : sliced).trim();
}

function collectPosts(locale) {
  const postsDir = path.join(CONTENT_DIR, locale, 'posts');
  const files = listMarkdownFiles(postsDir);

  return files.map((fullPath) => {
    const markdown = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = parseFrontmatter(markdown);
    const slug = path.basename(fullPath).replace(/\.(md|mdx)$/i, '');
    const postLanguage = locale === 'uz' ? 'uz' : 'ru';
    const excerpt = data.excerpt || String(content).replace(/\s+/g, ' ').slice(0, 180);
    const wc = wordsCount(content);
    const tags = Array.isArray(data.tags) ? data.tags : [];

    return {
      slug,
      title: data.title || slug,
      content,
      excerpt,
      wordCount: wc,
      readingTime: Math.max(1, Math.ceil(wc / 200)),
      language: postLanguage,
      publishedAt: data.publishedAt || data.updatedAt || new Date().toISOString().slice(0, 10),
      updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString().slice(0, 10),
      author: data.author || 'Graver.uz',
      category: data.category || (postLanguage === 'uz' ? 'Blog' : 'Блог'),
      tags,
      seoKeywords: tags,
      metaDescription: data.excerpt || makeMetaDescription(excerpt, postLanguage),
      ogImage: data.coverImage || `${BASE_URL}/og-blog.png`,
      canonicalUrl: `${BASE_URL}/${postLanguage}/blog/${slug}`,
      relatedArticles: [],
      hasSchema: true,
      schemaType: ['Article', 'BreadcrumbList', 'FAQPage']
    };
  });
}

const posts = [...collectPosts('ru'), ...collectPosts('uz')];

const grouped = {
  ru: posts.filter((post) => post.language === 'ru'),
  uz: posts.filter((post) => post.language === 'uz')
};

for (const locale of ['ru', 'uz']) {
  const localePosts = grouped[locale];
  for (let index = 0; index < localePosts.length; index += 1) {
    const current = localePosts[index];
    const related = [];
    for (let step = 1; step < localePosts.length && related.length < Math.min(6, localePosts.length - 1); step += 1) {
      related.push(localePosts[(index + step) % localePosts.length].slug);
    }
    current.relatedArticles = related;
  }
}

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2), 'utf8');

const duplicates = posts.length - new Set(posts.map((post) => post.slug + ':' + post.language)).size;
const minWordCount = posts.length ? Math.min(...posts.map((post) => post.wordCount || 0)) : 0;

console.log(`source=${CONTENT_DIR}`);
console.log(`generated_posts=${posts.length}`);
console.log(`ru=${grouped.ru.length} uz=${grouped.uz.length}`);
console.log(`duplicates=${duplicates}`);
console.log(`min_word_count=${minWordCount}`);
console.log(`output=${OUTPUT}`);
