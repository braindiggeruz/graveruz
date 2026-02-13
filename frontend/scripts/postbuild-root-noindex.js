const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const buildIndexPath = path.join(buildDir, "index.html");

const previewNoindex = String(process.env.PREVIEW_NOINDEX || '').toLowerCase();
const isPreviewEnv = previewNoindex === '1' || previewNoindex === 'true' ||
  String(process.env.CF_PAGES_ENVIRONMENT || '').toLowerCase() === 'preview';

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

if (!fs.existsSync(buildDir)) {
  console.log("[postbuild] build directory not found, skipping.");
  process.exit(0);
}

if (!isPreviewEnv) {
  console.log('[postbuild] Production build: keep robots index/follow (skip noindex rewrite).');
  process.exit(0);
}

const targets = [];
if (fs.existsSync(buildIndexPath)) {
  collectHtmlFiles(buildDir, targets);
} else {
  console.log("[postbuild] build/index.html not found, skipping.");
  process.exit(0);
}

let updatedCount = 0;
targets.forEach((filePath) => {
  const html = fs.readFileSync(filePath, "utf8");
  const updated = html
    .replace(/name="robots"\s+content="index, follow"/g, 'name="robots" content="noindex, follow"')
    .replace(/content="index, follow"\s+name="robots"/g, 'content="noindex, follow" name="robots"');
  if (updated !== html) {
    fs.writeFileSync(filePath, updated, "utf8");
    updatedCount += 1;
  }
});

if (updatedCount === 0) {
  console.log("[postbuild] noindex already set.");
} else {
  console.log('[postbuild] Set noindex on all build HTML (preview).');
}
