import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { getFaqData } from '../src/data/blogSeoOverrides.js';
import { getMappedAlternateSlug } from '../src/config/blogSlugMap.js';

const BUILD_DIR = path.resolve('build');
const HOST = '127.0.0.1';
const PORT = 4173;
const BASE = process.env.REACT_APP_BASE_URL || 'https://graver-studio.uz';

const URL_CASES = [
  { lang: 'ru', slug: 'kak-vybrat-korporativnyj-podarok' },
  { lang: 'ru', slug: 'lazernaya-gravirovka-podarkov' },
  { lang: 'uz', slug: 'korporativ-sovgani-qanday-tanlash' },
  { lang: 'uz', slug: 'lazer-gravirovka-sovgalar' }
];

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

function normalizeBase(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function normalizeUrl(url) {
  return String(url || '').replace(/([^:]\/)\/+/g, '$1').replace(/\/+$/, '');
}

function parseJsonLdTypes(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const graph = parsed?.['@graph'];
    if (Array.isArray(graph)) {
      return graph.map((item) => item?.['@type']).flat().filter(Boolean);
    }
    const type = parsed?.['@type'];
    if (Array.isArray(type)) return type.filter(Boolean);
    return type ? [type] : [];
  } catch {
    return ['INVALID_JSON'];
  }
}

function isValidFaqItem(item) {
  if (!item || typeof item.q !== 'string' || typeof item.a !== 'string') return false;
  const q = item.q.trim();
  const a = item.a.trim();
  if (!q || !a) return false;
  return !/sample\s*q\d*/i.test(`${q} ${a}`);
}

function buildExpectedAlternates(base, locale, slug) {
  const altLocale = locale === 'ru' ? 'uz' : 'ru';
  const altSlug = getMappedAlternateSlug(locale, slug);
  const ruSlug = locale === 'ru' ? slug : altSlug;
  const uzSlug = locale === 'uz' ? slug : altSlug;
  return {
    'ru-RU': ruSlug ? normalizeUrl(`${base}/ru/blog/${ruSlug}`) : '',
    'uz-UZ': uzSlug ? normalizeUrl(`${base}/uz/blog/${uzSlug}`) : '',
    'x-default': ruSlug ? normalizeUrl(`${base}/ru/blog/${ruSlug}`) : ''
  };
}

function resolveChromePath() {
  const fromEnv = process.env.CHROME_PATH && process.env.CHROME_PATH.trim();
  if (fromEnv) {
    const normalized = fromEnv.replace(/\\/g, '/');
    if (fs.existsSync(normalized)) return normalized;
    throw new Error(`CHROME_PATH is set but file not found: ${fromEnv}`);
  }

  for (const candidate of CHROME_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Chrome not found; set CHROME_PATH');
}

function createServer() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(BUILD_DIR, urlPath);

    if (urlPath.endsWith('/')) {
      filePath = path.join(BUILD_DIR, urlPath, 'index.html');
    }
    if (!path.extname(filePath)) {
      filePath = path.join(BUILD_DIR, urlPath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BUILD_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
      res.end(data);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('server-error');
    }
  });
}

async function run() {
  if (!fs.existsSync(BUILD_DIR)) {
    throw new Error('build directory not found. Run npm run build first.');
  }

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer-core')).default;
  } catch {
    throw new Error('puppeteer-core is unavailable. Install it as devDependency.');
  }

  const base = normalizeBase(BASE);
  const chromePath = resolveChromePath();
  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, HOST, resolve));

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let hasFailure = false;
  try {
    const page = await browser.newPage();

    for (const testCase of URL_CASES) {
      const pagePath = `/${testCase.lang}/blog/${testCase.slug}`;
      const expectedCanonical = normalizeUrl(`${base}${pagePath}`);
      const expectedAlt = buildExpectedAlternates(base, testCase.lang, testCase.slug);
      const faqItems = (getFaqData(testCase.slug) || []).filter(isValidFaqItem);
      const expectedFaqPresence = faqItems.length >= 2;
      const localUrl = `http://${HOST}:${PORT}${pagePath}`;

      await page.goto(localUrl, { waitUntil: 'networkidle0', timeout: 120000 });
      await new Promise((resolve) => setTimeout(resolve, 400));

      const data = await page.evaluate(function () {
        var canonicalNode = document.querySelector('link[rel="canonical"]');
        var alternateNodes = Array.prototype.slice.call(document.querySelectorAll('link[rel="alternate"]'));
        var descriptionNode = document.querySelector('meta[name="description"]');
        var ogUrlNode = document.querySelector('meta[property="og:url"]');
        var jsonLdNodes = Array.prototype.slice.call(document.querySelectorAll('script[type="application/ld+json"]'));

        return {
          canonical: canonicalNode ? canonicalNode.href : '',
          alternates: alternateNodes.map(function (node) {
            return { hreflang: node.hreflang, href: node.href };
          }),
          description: descriptionNode ? descriptionNode.content : '',
          ogUrl: ogUrlNode ? ogUrlNode.content : '',
          jsonLdTypes: jsonLdNodes.map(function (node) {
            return node.textContent || '';
          }).filter(Boolean)
        };
      });

      const altMap = Object.fromEntries(data.alternates.map((item) => [item.hreflang, normalizeUrl(item.href)]));
      const allJsonTypes = data.jsonLdTypes.flatMap(parseJsonLdTypes);

      const checks = [
        ['canonical', normalizeUrl(data.canonical) === expectedCanonical, `${normalizeUrl(data.canonical)} == ${expectedCanonical}`],
        ['meta description', Boolean(data.description && data.description.trim()), data.description.slice(0, 100)],
        ['og:url', normalizeUrl(data.ogUrl) === expectedCanonical, `${normalizeUrl(data.ogUrl)} == ${expectedCanonical}`],
        ['hreflang ru-RU', altMap['ru-RU'] === expectedAlt['ru-RU'], `${altMap['ru-RU']} == ${expectedAlt['ru-RU']}`],
        ['hreflang uz-UZ', altMap['uz-UZ'] === expectedAlt['uz-UZ'], `${altMap['uz-UZ']} == ${expectedAlt['uz-UZ']}`],
        ['hreflang x-default', altMap['x-default'] === expectedAlt['x-default'], `${altMap['x-default']} == ${expectedAlt['x-default']}`],
        ['JSON-LD Article', allJsonTypes.includes('Article'), allJsonTypes.join(', ')],
        ['JSON-LD BreadcrumbList', allJsonTypes.includes('BreadcrumbList'), allJsonTypes.join(', ')],
        ['JSON-LD FAQPage', allJsonTypes.includes('FAQPage') === expectedFaqPresence, `${allJsonTypes.includes('FAQPage')} == ${expectedFaqPresence}`]
      ];

      console.log(`\nURL: ${pagePath}`);
      for (const [label, ok, detail] of checks) {
        console.log(`${ok ? 'PASS' : 'FAIL'} - ${label}: ${detail}`);
        if (!ok) hasFailure = true;
      }

      const faqState = allJsonTypes.includes('FAQPage') ? 'present' : 'absent';
      console.log(`INFO - JSON-LD FAQPage: ${faqState} (expected ${expectedFaqPresence ? 'present' : 'absent'})`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  if (hasFailure) {
    process.exit(1);
  }
}

await run();