/**
 * postbuild-rss.js
 * Generates RSS 2.0 feeds for RU and UZ blog posts.
 * Run after build: node scripts/postbuild-rss.js
 * Output: public/rss-ru.xml, public/rss-uz.xml
 */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const rawBaseUrl = process.env.REACT_APP_BASE_URL || 'https://graver-studio.uz';
const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const publicDir = path.resolve(__dirname, '..', 'public');
const buildDir = path.resolve(__dirname, '..', 'build');

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateStr) {
  if (!dateStr) return new Date().toUTCString();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

function buildRssXml({ locale, posts, getBlogOgImageForSlug }) {
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Graver.uz — Блог о корпоративных подарках и гравировке'
    : 'Graver.uz — Korporativ sovgalar va gravirovka haqida blog';
  const description = isRu
    ? 'Полезные статьи о корпоративных подарках, лазерной гравировке и брендировании для бизнеса в Ташкенте.'
    : 'Toshkentdagi biznes uchun korporativ sovgalar, lazer gravirovka va brendlash haqida foydali maqolalar.';
  const link = `${baseUrl}/${locale}/blog/`;
  const language = isRu ? 'ru' : 'uz';
  const buildDate = new Date().toUTCString();

  const items = posts.map((post) => {
    const postUrl = `${baseUrl}/${locale}/blog/${post.slug}/`;
    const ogImage = getBlogOgImageForSlug(post.slug);
    const imageUrl = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/og-blog.png`;
    const descText = post.description
      ? escapeXml(post.description)
      : escapeXml(stripHtml(post.content || ''));

    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(postUrl)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
      `      <description>${descText}</description>`,
      `      <pubDate>${toRfc822(post.date)}</pubDate>`,
      post.category ? `      <category>${escapeXml(post.category)}</category>` : '',
      `      <enclosure url="${escapeXml(imageUrl)}" type="image/png" length="0" />`,
      '    </item>'
    ].filter(Boolean).join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(link)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${language}</language>`,
    `    <lastBuildDate>${buildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(baseUrl + '/rss-' + locale + '.xml')}" rel="self" type="application/rss+xml" />`,
    `    <image>`,
    `      <url>${escapeXml(baseUrl + '/og-blog.png')}</url>`,
    `      <title>${escapeXml(title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `    </image>`,
    items.join('\n'),
    '  </channel>',
    '</rss>',
    ''
  ].join('\n');
}

async function main() {
  const blogModule = await import(
    pathToFileURL(path.resolve(__dirname, '..', 'src', 'data', 'blogPosts.js')).href
  );
  const blogImagesModule = await import(
    pathToFileURL(path.resolve(__dirname, '..', 'src', 'data', 'blogImages.js')).href
  );

  const blogPosts = blogModule.blogPosts;
  const getBlogOgImageForSlug = blogImagesModule.getBlogOgImageForSlug;

  if (!blogPosts || !blogPosts.ru || !blogPosts.uz) {
    throw new Error('blogPosts not found for RSS generation');
  }

  const locales = ['ru', 'uz'];
  for (const locale of locales) {
    const posts = blogPosts[locale] || [];
    // Sort by date descending
    const sorted = [...posts].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    const xml = buildRssXml({ locale, posts: sorted, getBlogOgImageForSlug });
    const filename = `rss-${locale}.xml`;

    const outputPaths = [path.join(publicDir, filename)];
    if (fs.existsSync(buildDir)) {
      outputPaths.push(path.join(buildDir, filename));
    }

    outputPaths.forEach((outPath) => {
      fs.writeFileSync(outPath, xml, 'utf8');
      console.log(`[postbuild-rss] Written ${outPath} (${sorted.length} items)`);
    });
  }
}

main().catch((err) => {
  console.error('[postbuild-rss] Failed:', err.message || err);
  process.exit(1);
});
