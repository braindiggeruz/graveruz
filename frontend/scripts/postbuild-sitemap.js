const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const baseUrl = process.env.REACT_APP_BASE_URL || 'https://www.graver-studio.uz';
const buildDir = path.resolve(__dirname, '..', 'build');
const publicDir = path.resolve(__dirname, '..', 'public');

const moneyPaths = [
  '/ru',
  '/ru/process',
  '/ru/guarantees',
  '/ru/contacts',
  '/ru/catalog-products',
  '/ru/watches-with-logo',
  '/ru/products/lighters',
  '/ru/engraved-gifts',
  '/uz',
  '/uz/process',
  '/uz/guarantees',
  '/uz/contacts',
  '/uz/mahsulotlar-katalogi',
  '/uz/logotipli-soat',
  '/uz/products/lighters',
  '/uz/gravirovkali-sovgalar',
  '/ru/blog',
  '/uz/blog'
];

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
}

function buildXml(urls) {
  const items = urls.map(({ loc, lastmod }) => (
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
  ));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items.join('\n'),
    '</urlset>',
    ''
  ].join('\n');
}

async function main() {
  const buildDate = toDate(new Date().toISOString());
  const blogModule = await import(
    pathToFileURL(path.resolve(__dirname, '..', 'src', 'data', 'blogPosts.js')).href
  );

  const blogPosts = blogModule.blogPosts;
  if (!blogPosts || !blogPosts.ru || !blogPosts.uz) {
    throw new Error('blogPosts not found for sitemap generation');
  }

  const urlMap = new Map();

  const addUrl = (pathname, lastmod) => {
    const loc = `${baseUrl}${pathname}`;
    const lm = lastmod || buildDate;
    urlMap.set(loc, lm);
  };

  moneyPaths.forEach((pathname) => addUrl(pathname, buildDate));

  blogPosts.ru.forEach((post) => {
    const lastmod = toDate(post.date) || buildDate;
    addUrl(`/ru/blog/${post.slug}`, lastmod);
  });

  blogPosts.uz.forEach((post) => {
    const lastmod = toDate(post.date) || buildDate;
    addUrl(`/uz/blog/${post.slug}`, lastmod);
  });

  const urls = Array.from(urlMap.entries()).map(([loc, lastmod]) => ({ loc, lastmod }));
  const sitemapXml = buildXml(urls);

  const outputPaths = [path.join(publicDir, 'sitemap.xml')];
  if (fs.existsSync(buildDir)) {
    outputPaths.push(path.join(buildDir, 'sitemap.xml'));
  }

  outputPaths.forEach((outPath) => {
    fs.writeFileSync(outPath, sitemapXml, 'utf8');
  });
}

main().catch((error) => {
  console.error('[postbuild-sitemap] Failed:', error.message || error);
  process.exit(1);
});
