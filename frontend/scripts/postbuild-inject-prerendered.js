/**
 * postbuild-inject-prerendered.js
 *
 * Injects pre-rendered HTML pages from frontend/prerendered/ into frontend/build/
 * after craco build completes.
 *
 * WHY THIS EXISTS:
 * react-snap requires Chromium/Puppeteer which is NOT available in Cloudflare Pages
 * build environment. Instead of running react-snap on every Cloudflare build, we:
 * 1. Run react-snap locally to generate pre-rendered HTML
 * 2. Store the pre-rendered HTML in frontend/prerendered/ (tracked in git)
 * 3. This script copies them into build/ after craco build runs
 *
 * This ensures search engines (Google, Yandex) always receive full HTML content
 * instead of an empty SPA shell.
 *
 * TO UPDATE PRE-RENDERED PAGES:
 * Run locally: PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run build
 * Then commit the updated prerendered/ folder to git.
 */

const fs = require('fs');
const path = require('path');

const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');
const BUILD_DIR = path.join(__dirname, '..', 'build');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(PRERENDERED_DIR)) {
  console.log('[inject-prerendered] No prerendered/ directory found, skipping injection.');
  process.exit(0);
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error('[inject-prerendered] ERROR: build/ directory not found. Run craco build first.');
  process.exit(1);
}

// Find all pre-rendered HTML files
const prerenderedFiles = [];
function findHtmlFiles(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, baseDir);
    } else if (entry.name === 'index.html') {
      prerenderedFiles.push(path.relative(baseDir, fullPath));
    }
  }
}

findHtmlFiles(PRERENDERED_DIR, PRERENDERED_DIR);

console.log(`[inject-prerendered] Found ${prerenderedFiles.length} pre-rendered pages to inject`);

let injected = 0;
let skipped = 0;

for (const relPath of prerenderedFiles) {
  const srcFile = path.join(PRERENDERED_DIR, relPath);
  const destFile = path.join(BUILD_DIR, relPath);
  const destDir = path.dirname(destFile);

  // Create destination directory if needed
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Check if destination already has a pre-rendered version (larger than SPA shell)
  const SPA_SHELL_MAX_SIZE = 10000; // 10KB - SPA shell is ~4KB, pre-rendered is 15KB+
  if (fs.existsSync(destFile)) {
    const existingSize = fs.statSync(destFile).size;
    if (existingSize > SPA_SHELL_MAX_SIZE) {
      // Already has pre-rendered content (from react-snap running locally)
      skipped++;
      continue;
    }
  }

  // Copy the pre-rendered HTML
  fs.copyFileSync(srcFile, destFile);
  injected++;
  console.log(`[inject-prerendered] Injected: ${relPath} (${fs.statSync(srcFile).size} bytes)`);
}

console.log(`[inject-prerendered] Done: ${injected} injected, ${skipped} already pre-rendered`);
