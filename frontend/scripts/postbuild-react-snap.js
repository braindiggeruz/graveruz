const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function firstExisting(paths) {
  for (const candidate of paths) {
    if (!candidate) continue;
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function findChromiumExecutable() {
  const envCandidate = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN;
  if (envCandidate && fs.existsSync(envCandidate)) return envCandidate;

  const local = process.cwd();
  const home = os.homedir();
  const wildcardCandidates = [
    { base: path.join(local, 'node_modules', 'puppeteer', '.local-chromium', 'win64-*'), suffix: path.join('chrome-win', 'chrome.exe') },
    { base: path.join(local, 'node_modules', 'puppeteer-core', '.local-chromium', 'win64-*'), suffix: path.join('chrome-win', 'chrome.exe') },
    { base: path.join(local, 'node_modules', 'puppeteer', '.local-chromium', 'linux-*'), suffix: path.join('chrome-linux', 'chrome') },
    { base: path.join(local, 'node_modules', 'puppeteer-core', '.local-chromium', 'linux-*'), suffix: path.join('chrome-linux', 'chrome') },
    { base: path.join(local, 'node_modules', 'puppeteer', '.local-chromium', 'mac-*'), suffix: path.join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium') },
    { base: path.join(local, 'node_modules', 'puppeteer-core', '.local-chromium', 'mac-*'), suffix: path.join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium') },
    { base: path.join(home, '.cache', 'puppeteer', 'chrome', 'linux-*'), suffix: path.join('chrome-linux64', 'chrome') },
    { base: path.join(home, '.cache', 'puppeteer', 'chrome', 'win64-*'), suffix: path.join('chrome-win64', 'chrome.exe') },
    { base: path.join(home, '.cache', 'puppeteer', 'chrome', 'mac-*'), suffix: path.join('chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing') },
    { base: path.join(home, '.cache', 'puppeteer', 'chrome', 'mac-*'), suffix: path.join('chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing') }
  ];

  const directCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];

  const wildcardResolved = [];
  for (const candidate of wildcardCandidates) {
    const baseDir = candidate.base.split('*')[0];
    if (!fs.existsSync(baseDir)) continue;
    const subDirs = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(baseDir, entry.name, candidate.suffix));
    wildcardResolved.push(...subDirs);
  }

  return firstExisting([...directCandidates, ...wildcardResolved]);
}

function ensureChromium() {
  let executable = findChromiumExecutable();
  if (executable) return executable;

  console.log('[postbuild] Chromium not found, installing via @puppeteer/browsers...');
  execSync('npx @puppeteer/browsers install chrome', { stdio: 'inherit' });
  executable = findChromiumExecutable();
  if (executable) return executable;

  throw new Error('[postbuild] Chromium executable not found after install. Set PUPPETEER_EXECUTABLE_PATH manually.');
}

function ensureReactSnapNodeOptions() {
  const minHeapMb = 6144;
  const current = String(process.env.NODE_OPTIONS || '').trim();
  const match = current.match(/--max-old-space-size=(\d+)/i);

  if (match && Number(match[1]) >= minHeapMb) {
    return current;
  }

  const withoutHeap = current
    .replace(/--max-old-space-size=\d+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return `${withoutHeap} --max-old-space-size=${minHeapMb}`.trim();
}

const shouldSkip = String(process.env.SKIP_REACT_SNAP || '').toLowerCase();
const pagesEnv = String(process.env.CF_PAGES_ENVIRONMENT || '').toLowerCase();
const pagesBranch = String(process.env.CF_PAGES_BRANCH || '').toLowerCase();
const isProduction = pagesEnv === 'production' || pagesBranch === 'main';

if (shouldSkip === '1' || shouldSkip === 'true') {
  if (isProduction) {
    console.warn('[postbuild] SKIP_REACT_SNAP is set for production. Ignoring and continuing with react-snap.');
  } else {
    console.log('[postbuild] SKIP_REACT_SNAP=1, skipping react-snap.');
    process.exit(0);
  }
}

const chromiumPath = ensureChromium();
process.env.PUPPETEER_EXECUTABLE_PATH = chromiumPath;
process.env.CHROME_BIN = chromiumPath;
process.env.NODE_OPTIONS = ensureReactSnapNodeOptions();
console.log('[postbuild] Using Chromium:', chromiumPath);
console.log('[postbuild] NODE_OPTIONS for react-snap:', process.env.NODE_OPTIONS);

execSync('react-snap', { stdio: 'inherit' });
