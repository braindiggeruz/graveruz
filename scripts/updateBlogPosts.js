const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INPUT = path.join(ROOT, 'frontend', 'src', 'data', 'blogPosts.generated.json');
const OUTPUT = path.join(ROOT, 'frontend', 'src', 'data', 'blogPosts.js');

const raw = fs.readFileSync(INPUT, 'utf8');
const generated = JSON.parse(raw);

function resolveAutoSubmitEnabled() {
  const value = String(process.env.AUTO_SUBMIT_INDEXING_ON_PUBLISH || '1').trim().toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(value);
}

function resolveAutoSubmitLimit(totalPosts) {
  const rawLimit = Number.parseInt(process.env.AUTO_SUBMIT_INDEXING_LIMIT || '3', 10);
  if (!Number.isFinite(rawLimit) || rawLimit <= 0) return Math.min(3, totalPosts);
  return Math.min(rawLimit, totalPosts);
}

async function autoSubmitIndexing(totalPosts) {
  if (!resolveAutoSubmitEnabled()) {
    console.log('indexing_auto_submit=skipped (AUTO_SUBMIT_INDEXING_ON_PUBLISH disabled)');
    return;
  }

  const limit = resolveAutoSubmitLimit(totalPosts);
  const baseUrl = (process.env.INDEXING_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const endpoint = `${baseUrl}/api/indexing/submit-all?limit=${limit}`;

  try {
    const controller = new AbortController();
    const timeoutMs = Number.parseInt(process.env.AUTO_SUBMIT_INDEXING_TIMEOUT_MS || '45000', 10);
    const timer = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : 45000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      console.warn(`indexing_auto_submit=failed status=${response.status}`);
      return;
    }

    const result = await response.json();
    const bingStatus = result?.bing?.success ? 'ok' : 'failed';
    const googleOk = Number(result?.google?.success || 0);
    const googleFailed = Number(result?.google?.failed || 0);

    console.log(`indexing_auto_submit=ok endpoint=${endpoint}`);
    console.log(`indexing_bing=${bingStatus} indexing_google_success=${googleOk} indexing_google_failed=${googleFailed}`);
  } catch (error) {
    console.warn(`indexing_auto_submit=failed error=${error.message}`);
  }
}

const grouped = generated.reduce(
  (acc, post) => {
    const locale = post.language === 'uz' ? 'uz' : 'ru';
    acc[locale].push({
      slug: post.slug,
      title: post.title,
      description: post.metaDescription,
      date: post.publishedAt,
      keywords: post.seoKeywords || [],
      category: post.category || 'Блог',
      relatedPosts: post.relatedArticles || [],
      contentHtml: post.content,
      content: post.content,
      excerpt: post.excerpt,
      wordCount: post.wordCount,
      readingTime: post.readingTime,
      language: post.language,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      author: post.author,
      tags: post.tags || [],
      seoKeywords: post.seoKeywords || [],
      metaDescription: post.metaDescription,
      ogImage: post.ogImage,
      canonicalUrl: post.canonicalUrl,
      relatedArticles: post.relatedArticles || [],
      hasSchema: Boolean(post.hasSchema),
      schemaType: post.schemaType || ['Article']
    });
    return acc;
  },
  { ru: [], uz: [] }
);

const moduleText = [
  "import { getMappedAlternateSlug } from '../config/blogSlugMap.js';",
  '',
  `export const blogPosts = ${JSON.stringify(grouped, null, 2)};`,
  '',
  'export function getPostsByLocale(locale) {',
  '  const posts = blogPosts[locale] || blogPosts.ru;',
  '  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));',
  '}',
  '',
  'export function getPostBySlug(locale, slug) {',
  '  const posts = blogPosts[locale] || blogPosts.ru;',
  '  return posts.find(p => p.slug === slug) || null;',
  '}',
  '',
  'export function getAlternateSlug(slug) {',
  "  return getMappedAlternateSlug('ru', slug) || getMappedAlternateSlug('uz', slug) || null;",
  '}',
  '',
  'export function getRelatedPosts(locale, currentSlug) {',
  '  const post = getPostBySlug(locale, currentSlug);',
  '  if (!post || !post.relatedPosts) return [];',
  '  return post.relatedPosts.map(s => getPostBySlug(locale, s)).filter(Boolean);',
  '}',
  '',
  'export function getAllSlugs() {',
  "  const ruSlugs = blogPosts.ru.map(p => ({ locale: 'ru', slug: p.slug }));",
  "  const uzSlugs = blogPosts.uz.map(p => ({ locale: 'uz', slug: p.slug }));",
  '  return [...ruSlugs, ...uzSlugs];',
  '}',
  ''
].join('\n');

fs.writeFileSync(OUTPUT, moduleText, 'utf8');
console.log(`updated=${OUTPUT}`);
console.log(`count=${generated.length}`);

autoSubmitIndexing(generated.length)
  .catch((error) => {
    console.warn(`indexing_auto_submit=failed error=${error.message}`);
  });
