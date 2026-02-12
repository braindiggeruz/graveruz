const urls = [
  'https://www.graver-studio.uz/ru/?v=' + Date.now(),
  'https://www.graver-studio.uz/uz/?v=' + Date.now()
];

const checks = [
  {
    name: 'build-id meta',
    test: (html) => /<meta\s+name="build-id"\s+content="[^"]+"\s*\/>/i.test(html)
  },
  {
    name: 'no serviceWorker.register',
    test: (html) => !/serviceWorker\.register\s*\(/i.test(html)
  },
  {
    name: 'single canonical',
    test: (html) => (html.match(/rel="canonical"/g) || []).length === 1
  },
  {
    name: 'hreflang ru',
    test: (html) => /hreflang="ru"/i.test(html)
  },
  {
    name: 'hreflang uz-Latn',
    test: (html) => /hreflang="uz-Latn"/i.test(html)
  },
  {
    name: 'hreflang x-default',
    test: (html) => /hreflang="x-default"/i.test(html)
  }
];

let hasFailure = false;

for (const url of urls) {
  try {
    const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
    const html = await response.text();

    console.log(`\nURL: ${url}`);
    for (const check of checks) {
      const ok = check.test(html);
      if (!ok) {
        hasFailure = true;
      }
      console.log(`${ok ? 'PASS' : 'FAIL'} - ${check.name}`);
    }
  } catch (error) {
    hasFailure = true;
    console.log(`\nURL: ${url}`);
    console.log(`FAIL - fetch error: ${error.message}`);
  }
}

if (hasFailure) {
  process.exit(1);
}
