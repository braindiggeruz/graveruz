const BASE_URL = 'https://www.graver-studio.uz';
const urls = [
  `${BASE_URL}/ru/?v=${Date.now()}`,
  `${BASE_URL}/uz/?v=${Date.now()}`,
  `${BASE_URL}/ru/?sw-kill=1&v=${Date.now()}`
];

const marker = 'SW_HARD_BLOCK_V1';
let hasFailure = false;

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  return response.text();
}

async function checkRuntimeMarker(html) {
  const match = html.match(/src="([^"]*\/static\/js\/main\.[^"]+\.js)"/i);
  if (!match) {
    return { ok: false, reason: 'main bundle not found in HTML' };
  }
  const scriptUrl = match[1].startsWith('http') ? match[1] : `${BASE_URL}${match[1]}`;
  const scriptContent = await fetchText(scriptUrl);
  const ok = scriptContent.includes(marker);
  return { ok, reason: ok ? 'runtime block present' : 'runtime block marker missing' };
}

for (const url of urls) {
  try {
    const html = await fetchText(url);
    console.log(`\nURL: ${url}`);

    const buildIdOk = /<meta\s+name="build-id"\s+content="[^"]+"\s*\/>/i.test(html);
    console.log(`${buildIdOk ? 'PASS' : 'FAIL'} - build-id meta`);
    if (!buildIdOk) hasFailure = true;

    const canonicalCount = countMatches(html, /rel="canonical"/g);
    const canonicalOk = canonicalCount === 1;
    console.log(`${canonicalOk ? 'PASS' : 'FAIL'} - single canonical (${canonicalCount})`);
    if (!canonicalOk) hasFailure = true;

    const hreflangRu = countMatches(html, /hreflang="ru"/gi);
    const hreflangUz = countMatches(html, /hreflang="uz-Latn"/gi);
    const hreflangDefault = countMatches(html, /hreflang="x-default"/gi);
    const hreflangOk = hreflangRu === 1 && hreflangUz === 1 && hreflangDefault === 1;
    console.log(`${hreflangOk ? 'PASS' : 'FAIL'} - hreflang (ru/uz/x-default = ${hreflangRu}/${hreflangUz}/${hreflangDefault})`);
    if (!hreflangOk) hasFailure = true;

    const swRegisterPresent = /serviceWorker\.register\s*\(/i.test(html);
    if (!swRegisterPresent) {
      console.log('PASS - no serviceWorker.register');
    } else {
      const runtimeCheck = await checkRuntimeMarker(html);
      const safe = runtimeCheck.ok;
      console.log(`${safe ? 'PASS' : 'FAIL'} - serviceWorker.register present; ${runtimeCheck.reason}`);
      if (!safe) hasFailure = true;
    }
  } catch (error) {
    hasFailure = true;
    console.log(`\nURL: ${url}`);
    console.log(`FAIL - fetch error: ${error.message}`);
  }
}

try {
  const buildTxt = await fetch(`${BASE_URL}/build.txt`, { headers: { 'cache-control': 'no-cache' } });
  if (buildTxt.ok) {
    const value = (await buildTxt.text()).trim();
    console.log(`\nbuild.txt: ${value}`);
  } else {
    console.log(`\nbuild.txt: not found (status ${buildTxt.status})`);
  }
} catch (error) {
  console.log(`\nbuild.txt: fetch error (${error.message})`);
}

if (hasFailure) {
  process.exit(1);
}
