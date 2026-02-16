const { execSync } = require('child_process');
const fs = require('fs');
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
  const commonCandidates = [
    path.join(local, 'node_modules', 'puppeteer', '.local-chromium', 'win64-*/chrome-win/chrome.exe'),
    path.join(local, 'node_modules', 'puppeteer-core', '.local-chromium', 'win64-*/chrome-win/chrome.exe'),
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  const wildcardResolved = [];
  for (const candidate of commonCandidates) {
    if (!candidate.includes('*')) {
      wildcardResolved.push(candidate);
      continue;
    }
    const baseDir = candidate.split('*')[0];
    if (!fs.existsSync(baseDir)) continue;
    const subDirs = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(baseDir, entry.name, 'chrome-win', 'chrome.exe'));
    wildcardResolved.push(...subDirs);
  }

  return firstExisting(wildcardResolved);
}

function ensureChromium() {
  let executable = findChromiumExecutable();
  if (executable) return executable;

  console.log('[postbuild] Chromium not found, installing via puppeteer...');
  execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });
  executable = findChromiumExecutable();
  if (executable) return executable;

  throw new Error('[postbuild] Chromium executable not found after install. Set PUPPETEER_EXECUTABLE_PATH manually.');
}

const shouldSkip = String(process.env.SKIP_REACT_SNAP || '').toLowerCase();
const pagesEnv = String(process.env.CF_PAGES_ENVIRONMENT || '').toLowerCase();
const pagesBranch = String(process.env.CF_PAGES_BRANCH || '').toLowerCase();
const isProduction = pagesEnv === 'production' || pagesBranch === 'main';

if (shouldSkip === '1' || shouldSkip === 'true') {
  if (isProduction) {
    console.error('[postbuild] SKIP_REACT_SNAP is set for production. Refusing to build without prerendered HTML.');
    process.exit(1);
  }
  console.log('[postbuild] SKIP_REACT_SNAP=1, skipping react-snap.');
  process.exit(0);
}

const chromiumPath = ensureChromium();
process.env.PUPPETEER_EXECUTABLE_PATH = chromiumPath;
process.env.CHROME_BIN = chromiumPath;
console.log('[postbuild] Using Chromium:', chromiumPath);

execSync('react-snap', { stdio: 'inherit' });
