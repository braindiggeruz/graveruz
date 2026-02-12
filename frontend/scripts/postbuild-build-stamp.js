const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.resolve(__dirname, '..', 'build');
const baseUrl = process.env.REACT_APP_BASE_URL || 'https://www.graver-studio.uz';

function resolveBuildStamp() {
  let gitSha = '';
  try {
    gitSha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch (error) {
    gitSha = '';
  }

  let buildIdBase = process.env.GIT_SHA || process.env.COMMIT_SHA || gitSha || '';
  buildIdBase = buildIdBase.trim();
  const normalized = buildIdBase.toLowerCase();
  if (!buildIdBase || normalized.startsWith('unknown') || normalized.startsWith('undefined')) {
    buildIdBase = 'nogit';
  }
  const epoch = process.env.SOURCE_DATE_EPOCH;
  const buildTime = (epoch && !Number.isNaN(Number(epoch)))
    ? new Date(Number(epoch) * 1000).toISOString()
    : new Date().toISOString();

  const buildStamp = `${buildIdBase}-${buildTime}`;
  return { buildStamp };
}

function collectHtmlFiles(dir, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(entryPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(entryPath);
    }
  });
}

function stampHtmlFile(filePath, buildId) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('name="build-id"')) return;
  if (!html.includes('</head>')) return;

  const metaTag = `  <meta name="build-id" content="${buildId}" />\n`;
  const stamped = html.replace('</head>', `${metaTag}</head>`);
  fs.writeFileSync(filePath, stamped, 'utf8');
}

function ensureHomeSeoTags(filePath, locale) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('</head>')) return;
  if (html.includes('rel="canonical"')) return;

  const canonicalUrl = `${baseUrl}/${locale}`;
  const ruUrl = `${baseUrl}/ru`;
  const uzUrl = `${baseUrl}/uz`;
  const tags = [
    `  <link href="${canonicalUrl}" rel="canonical" />`,
    `  <link href="${ruUrl}" rel="alternate" hreflang="ru" />`,
    `  <link href="${uzUrl}" rel="alternate" hreflang="uz-Latn" />`,
    `  <link href="${ruUrl}" rel="alternate" hreflang="x-default" />`
  ].join('\n') + '\n';

  html = html.replace('</head>', `${tags}</head>`);
  fs.writeFileSync(filePath, html, 'utf8');
}

if (!fs.existsSync(buildDir)) {
  process.exit(0);
}

const { buildStamp } = resolveBuildStamp();
const buildTxtPath = path.join(buildDir, 'build.txt');
fs.writeFileSync(buildTxtPath, `${buildStamp}\n`, 'utf8');
const buildIdPath = path.join(buildDir, '__build_id.txt');
fs.writeFileSync(buildIdPath, `${buildStamp}\n`, 'utf8');

const htmlFiles = [];
collectHtmlFiles(buildDir, htmlFiles);
htmlFiles.forEach((filePath) => stampHtmlFile(filePath, buildStamp));

const ruIndex = path.join(buildDir, 'ru', 'index.html');
const uzIndex = path.join(buildDir, 'uz', 'index.html');
if (fs.existsSync(ruIndex)) {
  ensureHomeSeoTags(ruIndex, 'ru');
}
if (fs.existsSync(uzIndex)) {
  ensureHomeSeoTags(uzIndex, 'uz');
}
