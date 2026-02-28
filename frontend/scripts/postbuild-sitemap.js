const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const rawBaseUrl = process.env.REACT_APP_BASE_URL || 'https://graver-studio.uz';
const baseUrl = rawBaseUrl.replace(/\/+$/, '');
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
  '/ru/products/neo-watches',
  '/ru/products/neo-corporate',
  '/ru/products/neo-gift',
  '/uz',
  '/uz/process',
  '/uz/guarantees',
  '/uz/contacts',
  '/uz/mahsulotlar-katalogi',
  '/uz/logotipli-soat',
  '/uz/products/lighters',
  '/uz/gravirovkali-sovgalar',
  '/uz/neo-soatlar',
  '/uz/neo-korporativ',
  '/uz/neo-sovga',
  '/ru/blog',
  '/uz/blog'
];
const ROUTE_PAIRS = {
  '/ru': '/uz',
  '/ru/process': '/uz/process',
  '/ru/guarantees': '/uz/guarantees',
  '/ru/contacts': '/uz/contacts',
  '/ru/catalog-products': '/uz/mahsulotlar-katalogi',
  '/ru/watches-with-logo': '/uz/logotipli-soat',
  '/ru/products/lighters': '/uz/products/lighters',
  '/ru/engraved-gifts': '/uz/gravirovkali-sovgalar',
  '/ru/products/neo-watches': '/uz/neo-soatlar',
  '/ru/products/neo-corporate': '/uz/neo-korporativ',
  '/ru/products/neo-gift': '/uz/neo-sovga',
  '/ru/blog': '/uz/blog'
};
// Reverse mapping UZ -> RU for correct hreflang on UZ pages
const ROUTE_PAIRS_REVERSE = {
  '/uz': '/ru',
  '/uz/process': '/ru/process',
  '/uz/guarantees': '/ru/guarantees',
  '/uz/contacts': '/ru/contacts',
  '/uz/mahsulotlar-katalogi': '/ru/catalog-products',
  '/uz/logotipli-soat': '/ru/watches-with-logo',
  '/uz/products/lighters': '/ru/products/lighters',
  '/uz/gravirovkali-sovgalar': '/ru/engraved-gifts',
  '/uz/neo-soatlar': '/ru/products/neo-watches',
  '/uz/neo-korporativ': '/ru/products/neo-corporate',
  '/uz/neo-sovga': '/ru/products/neo-gift',
  '/uz/blog': '/ru/blog'
};
function getHreflangLinks(pathname, baseUrl, ensureTrailingSlash) {
  let ruPath, uzPath;
  if (pathname.startsWith('/ru')) {
    ruPath = pathname;
    uzPath = ROUTE_PAIRS[pathname] || pathname.replace('/ru/', '/uz/');
  } else {
    // UZ page: use reverse map to get correct RU path
    uzPath = pathname;
    ruPath = ROUTE_PAIRS_REVERSE[pathname] || pathname.replace('/uz/', '/ru/');
  }
  const ruLoc = baseUrl + ensureTrailingSlash(ruPath);
  const uzLoc = baseUrl + ensureTrailingSlash(uzPath);
  return [
    { hreflang: 'ru', href: ruLoc },
    { hreflang: 'uz-Latn', href: uzLoc },
    { hreflang: 'x-default', href: ruLoc }
  ];
}


function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
}

function ensureTrailingSlash(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function buildXml(urls) {
  const items = urls.map(({ loc, lastmod, hreflangLinks }) => {
    const parts = [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`
    ];
    if (Array.isArray(hreflangLinks) && hreflangLinks.length > 0) {
      hreflangLinks.forEach(({ hreflang, href }) => {
        parts.push(`    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`);
      });
    }
    parts.push('  </url>');
    return parts.join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    items.join('\n'),
    '</urlset>',
    ''
  ].join('\n');
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildImageSitemapXml(entries) {
  const items = entries.map(({ loc, imageLoc, title, lastmod }) => (
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n    <image:image>\n      <image:loc>${escapeXml(imageLoc)}</image:loc>${title ? `\n      <image:title>${escapeXml(title)}</image:title>` : ''}\n    </image:image>\n  </url>`
  ));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
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
  const blogImagesModule = await import(
    pathToFileURL(path.resolve(__dirname, '..', 'src', 'data', 'blogImages.js')).href
  );
  const blogSlugMapModule = await import(
    pathToFileURL(path.resolve(__dirname, '..', 'src', 'config', 'blogSlugMap.js')).href
  );

  const blogPosts = blogModule.blogPosts;
  const getBlogOgImageForSlug = blogImagesModule.getBlogOgImageForSlug;
  if (!blogPosts || !blogPosts.ru || !blogPosts.uz) {
    throw new Error('blogPosts not found for sitemap generation');
  }
  if (typeof getBlogOgImageForSlug !== 'function') {
    throw new Error('getBlogOgImageForSlug not found for image sitemap generation');
  }

  const urlMap = new Map();

  const addUrl = (pathname, lastmod, hreflangLinks) => {
    const loc = `${baseUrl}${ensureTrailingSlash(pathname)}`;
    const lm = lastmod || buildDate;
    const links = hreflangLinks || getHreflangLinks(pathname, baseUrl, ensureTrailingSlash);
    urlMap.set(loc, { lastmod: lm, hreflangLinks: links });
  };

  moneyPaths.forEach((pathname) => addUrl(pathname, buildDate));

  const imageEntryMap = new Map();
  const addImageEntry = ({ pathname, slug, title, lastmod }) => {
    const imagePath = getBlogOgImageForSlug(slug);
    if (!imagePath) {
      return;
    }

    const loc = `${baseUrl}${ensureTrailingSlash(pathname)}`;
    imageEntryMap.set(loc, {
      loc,
      imageLoc: `${baseUrl}${imagePath}`,
      title,
      lastmod: lastmod || buildDate,
    });
  };

  // Add portfolio images to image sitemap
  const portfolioImages = [
    { pathname: '/ru', imagePath: '/og-blog.png', title: 'Graver.uz' },
    { pathname: '/uz', imagePath: '/og-blog.png', title: 'Graver.uz' },
    { pathname: '/ru/catalog-products', imagePath: '/og-blog.png', title: 'Корпоративные подарки с логотипом' },
    { pathname: '/uz/mahsulotlar-katalogi', imagePath: '/og-blog.png', title: 'Logotipli korporativ sovgalar' },
    { pathname: '/ru/engraved-gifts', imagePath: '/og-blog.png', title: 'Подарки с гравировкой' },
    { pathname: '/uz/gravirovkali-sovgalar', imagePath: '/og-blog.png', title: 'Gravirovkali sovgalar' },
    { pathname: '/ru/watches-with-logo', imagePath: '/og-blog.png', title: 'Часы с логотипом' },
    { pathname: '/uz/logotipli-soat', imagePath: '/og-blog.png', title: 'Logotipli soatlar' },
    { pathname: '/ru/products/lighters', imagePath: '/og-blog.png', title: 'Зажигалки с логотипом' },
    { pathname: '/uz/products/lighters', imagePath: '/og-blog.png', title: 'Logotipli zajigalkalar' }
  ];

  portfolioImages.forEach(({ pathname, imagePath, title }) => {
    const loc = `${baseUrl}${ensureTrailingSlash(pathname)}`;
    if (!imageEntryMap.has(loc)) {
      imageEntryMap.set(loc, {
        loc,
        imageLoc: `${baseUrl}${imagePath}`,
        title,
        lastmod: buildDate
      });
    }
  });

  // Add money pages to image sitemap
  moneyPaths.forEach((pathname) => {
    const loc = `${baseUrl}${ensureTrailingSlash(pathname)}`;
    if (!imageEntryMap.has(loc)) {
      imageEntryMap.set(loc, {
        loc,
        imageLoc: `${baseUrl}/og-blog.png`,
        title: pathname.split('/').pop() || 'Graver.uz',
        lastmod: buildDate
      });
    }
  });

  blogPosts.ru.forEach((post) => {
    const lastmod = toDate(post.date) || buildDate;
    addUrl(`/ru/blog/${post.slug}`, lastmod, null);
    addImageEntry({ pathname: `/ru/blog/${post.slug}`, slug: post.slug, title: post.title, lastmod });
  });

  blogPosts.uz.forEach((post) => {
    const lastmod = toDate(post.date) || buildDate;
    // Use slug map to get correct RU slug for hreflang (fixes broken cross-references)
    const ruSlug = blogSlugMapModule.getMappedAlternateSlug('uz', post.slug) || post.slug;
    const uzLoc = `${baseUrl}/uz/blog/${post.slug}/`;
    const uzHreflangLinks = [
      { hreflang: 'ru', href: `${baseUrl}/ru/blog/${ruSlug}/` },
      { hreflang: 'uz-Latn', href: uzLoc },
      { hreflang: 'x-default', href: `${baseUrl}/ru/blog/${ruSlug}/` }
    ];
    addUrl(`/uz/blog/${post.slug}`, lastmod, uzHreflangLinks);
    addImageEntry({ pathname: `/uz/blog/${post.slug}`, slug: post.slug, title: post.title, lastmod });
  });

  const urls = Array.from(urlMap.entries()).map(([loc, val]) => ({
    loc,
    lastmod: typeof val === 'object' ? val.lastmod : val,
    hreflangLinks: typeof val === 'object' ? val.hreflangLinks : []
  }));
  const sitemapXml = buildXml(urls);
  const imageSitemapXml = buildImageSitemapXml(Array.from(imageEntryMap.values()));

  const outputPaths = [path.join(publicDir, 'sitemap.xml')];
  const imageOutputPaths = [path.join(publicDir, 'image-sitemap.xml')];
  if (fs.existsSync(buildDir)) {
    outputPaths.push(path.join(buildDir, 'sitemap.xml'));
    imageOutputPaths.push(path.join(buildDir, 'image-sitemap.xml'));
  }

  outputPaths.forEach((outPath) => {
    fs.writeFileSync(outPath, sitemapXml, 'utf8');
  });
  imageOutputPaths.forEach((outPath) => {
    fs.writeFileSync(outPath, imageSitemapXml, 'utf8');
  });

  // ШАГ 9: Generate sitemap-index.xml
  const sitemapIndexXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap>`,
    `    <loc>${baseUrl}/sitemap.xml</loc>`,
    `    <lastmod>${buildDate}</lastmod>`,
    `  </sitemap>`,
    `  <sitemap>`,
    `    <loc>${baseUrl}/image-sitemap.xml</loc>`,
    `    <lastmod>${buildDate}</lastmod>`,
    `  </sitemap>`,
    '</sitemapindex>',
    ''
  ].join('\n');

  const indexOutputPaths = [path.join(publicDir, 'sitemap-index.xml')];
  if (fs.existsSync(buildDir)) {
    indexOutputPaths.push(path.join(buildDir, 'sitemap-index.xml'));
  }
  indexOutputPaths.forEach((outPath) => {
    fs.writeFileSync(outPath, sitemapIndexXml, 'utf8');
  });

  console.log('[postbuild-sitemap] Generated sitemap.xml with ' + urls.length + ' URLs');
  console.log('[postbuild-sitemap] Generated image-sitemap.xml with ' + imageEntryMap.size + ' image entries (expanded from blog + portfolio)');
  console.log('[postbuild-sitemap] Generated sitemap-index.xml');
}

main().catch((error) => {
  console.error('[postbuild-sitemap] Failed:', error.message || error);
  process.exit(1);
});
