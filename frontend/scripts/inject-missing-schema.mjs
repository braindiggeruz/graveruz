/**
 * inject-missing-schema.mjs
 *
 * Injects BlogPosting + BreadcrumbList structured data into prerendered
 * article HEAD fragments that were synthetically generated (without
 * react-snap body rendering) and are missing schema.org markup.
 *
 * Run: node scripts/inject-missing-schema.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const BASE_URL = 'https://graver-studio.uz';
const PRERENDERED_DIR = path.resolve('prerendered');

// ── Parse blogPosts.js without importing (avoids ESM circular dep) ────────────

const rawBlogPosts = readFileSync('src/data/blogPosts.js', 'utf8');

/**
 * Extract slug → { title, description, date, category, keywords, imagePrefix }
 * from blogPosts.js using regex (no eval, no import).
 */
function parseBlogPostsData() {
  const uz_boundary_line = 3845;
  const lines = rawBlogPosts.split('\n');
  const posts = {};
  let currentSlug = null;
  let currentLocale = 'ru';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i + 1 >= uz_boundary_line) currentLocale = 'uz';

    const slugMatch = line.match(/slug:\s*["']([^"']+)["']/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      posts[currentSlug] = { locale: currentLocale };
    }

    if (!currentSlug) continue;

    const post = posts[currentSlug];

    const titleMatch = line.match(/title:\s*["'](.+?)["']\s*,?\s*$/);
    if (titleMatch && !post.title) post.title = titleMatch[1];

    const descMatch = line.match(/description:\s*["'](.+?)["']\s*,?\s*$/);
    if (descMatch && !post.description) post.description = descMatch[1];

    const dateMatch = line.match(/date:\s*["']([0-9-]+)["']/);
    if (dateMatch && !post.date) post.date = dateMatch[1];

    const catMatch = line.match(/category:\s*["'](.+?)["']/);
    if (catMatch && !post.category) post.category = catMatch[1];

    // First image in contentHtml
    if (!post.image) {
      const imgMatch = line.match(/src="(\/images\/blog\/[^"]+)"/);
      if (imgMatch) post.image = imgMatch[1];
    }

    // Keywords array (single-line items)
    if (!post.keywords) post.keywords = [];
    const kwMatch = line.match(/^\s*["']([^"']+)["'],?\s*$/);
    if (kwMatch && post.keywords !== undefined && post.title && !post.date && 
        lines[i-1] && !lines[i-1].includes('slug:') &&
        lines[i+1] && !lines[i+1].includes('relatedPosts')) {
      // Check context - rough heuristic
    }
  }

  return posts;
}

const postsData = parseBlogPostsData();

// Fill missing titles from prerendered file title tags if available
async function getArticleData(slug, locale, prerenderedPath) {
  const post = postsData[slug] || {};

  // Try to get title from prerendered file itself
  let fileTitle = null;
  let fileDesc = null;
  try {
    const html = await fs.readFile(prerenderedPath, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) fileTitle = titleMatch[1];
    const descMatch = html.match(/name="description"\s+content="([^"]+)"/i) ||
                       html.match(/content="([^"]+)"\s+name="description"/i);
    if (descMatch) fileDesc = descMatch[1];
  } catch {}

  return {
    slug,
    locale,
    title: post.title || fileTitle || slug,
    description: post.description || fileDesc || '',
    date: post.date || '2026-01-01',
    category: post.category || 'Blog',
    image: post.image
      ? `${BASE_URL}${post.image.replace('.png', '-og.jpg')}`
      : `${BASE_URL}/og-blog.png`,
  };
}

function buildSchema(article, locale) {
  const { slug, title, description, date, category, image } = article;
  const lang = locale === 'uz' ? 'uz-Latn' : 'ru';
  const url = `${BASE_URL}/${locale}/blog/${slug}/`;

  const breadcrumbHome = locale === 'uz' ? 'Bosh sahifa' : 'Главная';
  const breadcrumbBlog = locale === 'uz' ? 'Blog' : 'Блог';

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        inLanguage: lang,
        author: {
          '@type': 'Organization',
          name: 'Graver.uz',
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Graver.uz',
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/og-blog.png`,
          },
        },
        image: [{ '@type': 'ImageObject', url: image, width: 1200, height: 630 }],
        datePublished: `${date}T00:00:00.000Z`,
        dateModified: `${date}T00:00:00.000Z`,
        articleSection: category,
        keywords: `корпоративные подарки, гравировка, ${slug.replace(/-/g, ' ')}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: breadcrumbHome, item: `${BASE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: breadcrumbBlog, item: `${BASE_URL}/${locale}/blog/` },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      },
    ],
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

const locales = ['ru', 'uz'];
let injected = 0;
let skipped = 0;
let errors = 0;

for (const locale of locales) {
  const blogDir = path.join(PRERENDERED_DIR, locale, 'blog');
  const entries = await fs.readdir(blogDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const htmlPath = path.join(blogDir, slug, 'index.html');

    if (!existsSync(htmlPath)) continue;

    let html = await fs.readFile(htmlPath, 'utf8');

    // Skip if already has BlogPosting schema
    if (html.includes('"BlogPosting"') || html.includes("'BlogPosting'")) {
      skipped++;
      continue;
    }

    // Build schema
    const article = await getArticleData(slug, locale, htmlPath);
    const schemaJson = buildSchema(article, locale);
    const schemaTag = `<script type="application/ld+json">${schemaJson}</script>`;

    // Inject before </head>
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${schemaTag}</head>`);
    } else {
      // Append to end of file
      html += schemaTag;
    }

    try {
      await fs.writeFile(htmlPath, html, 'utf8');
      injected++;
      console.log('✓', `/${locale}/blog/${slug}`);
    } catch (e) {
      console.error('✗ ERROR', slug, e.message);
      errors++;
    }
  }
}

console.log(`\nInjected: ${injected} | Already had schema: ${skipped} | Errors: ${errors}`);
