const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.resolve(__dirname, '..', 'build');

function resolveBuildStamp() {
  let gitSha = '';
  try {
    gitSha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch (error) {
    gitSha = '';
  }

  const buildId = gitSha || process.env.BUILD_ID || process.env.GIT_SHA || 'unknown';
  const epoch = process.env.SOURCE_DATE_EPOCH;
  const buildTime = (epoch && !Number.isNaN(Number(epoch)))
    ? new Date(Number(epoch) * 1000).toISOString()
    : new Date().toISOString();

  const buildStamp = `${buildId}-${buildTime}`;
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

if (!fs.existsSync(buildDir)) {
  process.exit(0);
}

const { buildStamp } = resolveBuildStamp();
const buildTxtPath = path.join(buildDir, 'build.txt');
fs.writeFileSync(buildTxtPath, `${buildStamp}\n`, 'utf8');

const htmlFiles = [];
collectHtmlFiles(buildDir, htmlFiles);
htmlFiles.forEach((filePath) => stampHtmlFile(filePath, buildStamp));
