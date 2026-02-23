/**
 * postbuild-indexnow.js
 * Submits new/updated URLs to IndexNow (Bing, Yandex, Seznam) for instant indexing.
 * Run after build: node scripts/postbuild-indexnow.js
 * 
 * Requirements:
 *   - INDEXNOW_KEY env var must be set (or use the key from public/indexnow-key.txt)
 *   - Only submits URLs that changed since last run (tracked in .indexnow-state.json)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { pathToFileURL } = require('url');

const rawBaseUrl = process.env.REACT_APP_BASE_URL || 'https://graver-studio.uz';
const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const publicDir = path.resolve(__dirname, '..', 'public');
const stateFile = path.resolve(__dirname, '..', '.indexnow-state.json');

// Read IndexNow key from env or from key file
function getIndexNowKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const keyFilePath = path.join(publicDir, 'indexnow-key.txt');
  if (fs.existsSync(keyFilePath)) {
    return fs.readFileSync(keyFilePath, 'utf8').trim();
  }
  return null;
}

function loadState() {
  if (fs.existsSync(stateFile)) {
    try {
      return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveState(state) {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

function ensureTrailingSlash(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function submitToIndexNow(key, urls) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      host: 'graver-studio.uz',
      key: key,
      keyLocation: `${baseUrl}/${key}.txt`,
      urlList: urls
    });

    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const key = getIndexNowKey();
  if (!key) {
    console.log('[postbuild-indexnow] No IndexNow key found. Skipping submission.');
    console.log('[postbuild-indexnow] Set INDEXNOW_KEY env var or create public/indexnow-key.txt');
    return;
  }

  // Load blog posts
  const blogModule = await import(
    pathToFileURL(path.resolve(__dirname, '..', 'src', 'data', 'blogPosts.js')).href
  );
  const blogPosts = blogModule.blogPosts;

  if (!blogPosts || !blogPosts.ru || !blogPosts.uz) {
    throw new Error('blogPosts not found');
  }

  // Load previous state
  const state = loadState();
  const now = new Date().toISOString();
  const newState = { ...state, lastRun: now };

  // Collect all URLs with their lastmod
  const urlsToSubmit = [];

  // Static pages — always submit if not submitted in last 7 days
  const staticPages = [
    '/ru/', '/uz/',
    '/ru/blog/', '/uz/blog/',
    '/ru/catalog-products/', '/uz/mahsulotlar-katalogi/',
    '/ru/watches-with-logo/', '/uz/logotipli-soat/',
    '/ru/products/lighters/', '/uz/products/lighters/',
    '/ru/engraved-gifts/', '/uz/gravirovkali-sovgalar/',
    '/ru/contacts/', '/uz/contacts/'
  ];

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  staticPages.forEach((p) => {
    const fullUrl = baseUrl + p;
    const lastSubmitted = state[fullUrl];
    if (!lastSubmitted || lastSubmitted < sevenDaysAgo) {
      urlsToSubmit.push(fullUrl);
      newState[fullUrl] = now;
    }
  });

  // Blog posts — submit only new/updated ones
  const allPosts = [
    ...blogPosts.ru.map(p => ({ ...p, locale: 'ru' })),
    ...blogPosts.uz.map(p => ({ ...p, locale: 'uz' }))
  ];

  allPosts.forEach((post) => {
    const pathname = `/${post.locale}/blog/${post.slug}/`;
    const fullUrl = baseUrl + pathname;
    const postDate = post.date ? new Date(post.date).toISOString() : null;
    const lastSubmitted = state[fullUrl];

    // Submit if: never submitted, or post date is newer than last submission
    if (!lastSubmitted || (postDate && postDate > lastSubmitted)) {
      urlsToSubmit.push(fullUrl);
      newState[fullUrl] = now;
    }
  });

  if (urlsToSubmit.length === 0) {
    console.log('[postbuild-indexnow] No new/updated URLs to submit.');
    saveState(newState);
    return;
  }

  console.log(`[postbuild-indexnow] Submitting ${urlsToSubmit.length} URLs to IndexNow...`);

  // IndexNow supports up to 10,000 URLs per request, but we batch in 100s for safety
  const BATCH_SIZE = 100;
  for (let i = 0; i < urlsToSubmit.length; i += BATCH_SIZE) {
    const batch = urlsToSubmit.slice(i, i + BATCH_SIZE);
    try {
      const result = await submitToIndexNow(key, batch);
      console.log(`[postbuild-indexnow] Batch ${Math.floor(i / BATCH_SIZE) + 1}: HTTP ${result.statusCode}`);
      if (result.statusCode !== 200 && result.statusCode !== 202) {
        console.warn(`[postbuild-indexnow] Warning: unexpected status ${result.statusCode}: ${result.body}`);
      }
    } catch (err) {
      console.error(`[postbuild-indexnow] Error submitting batch: ${err.message}`);
    }
  }

  saveState(newState);
  console.log(`[postbuild-indexnow] Done. State saved to ${stateFile}`);
}

main().catch((err) => {
  console.error('[postbuild-indexnow] Failed:', err.message || err);
  // Don't exit with error — IndexNow failure shouldn't break the build
  process.exit(0);
});
