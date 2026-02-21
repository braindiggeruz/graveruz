/**
 * postbuild-sync-bundle.js
 *
 * After craco build, the JS/CSS bundle hashes change.
 * This script updates all prerendered/ HTML files to reference
 * the new bundle hashes from build/asset-manifest.json.
 *
 * WHY THIS EXISTS:
 * prerendered/ HTML files are committed to git and reference specific
 * JS/CSS bundle filenames (e.g. main.c2e39565.js). When Cloudflare runs
 * npm run build, new bundles are generated with new hashes. Without this
 * script, prerendered pages would reference non-existent bundles, causing
 * React to fail to hydrate and the pixel to not fire.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');

// Read asset manifest to get current bundle filenames
const manifestPath = path.join(BUILD_DIR, 'asset-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.log('[sync-bundle] No asset-manifest.json found, skipping.');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const newMainJs = manifest.files && manifest.files['main.js'];
const newMainCss = manifest.files && manifest.files['main.css'];

if (!newMainJs) {
  console.log('[sync-bundle] Could not find main.js in asset-manifest.json, skipping.');
  process.exit(0);
}

// Extract just the filename (e.g. "main.c2e39565.js")
const newJsFilename = path.basename(newMainJs);
const newCssFilename = newMainCss ? path.basename(newMainCss) : null;

console.log(`[sync-bundle] New JS bundle: ${newJsFilename}`);
if (newCssFilename) console.log(`[sync-bundle] New CSS bundle: ${newCssFilename}`);

// Regex to match any main.*.js or main.*.css
const jsPattern = /main\.[a-f0-9]+\.js/g;
const cssPattern = /main\.[a-f0-9]+\.css/g;

let updatedCount = 0;

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(jsPattern, newJsFilename);
      if (newCssFilename) {
        content = content.replace(cssPattern, newCssFilename);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        updatedCount++;
        const rel = path.relative(PRERENDERED_DIR, fullPath);
        console.log(`[sync-bundle] Updated: ${rel}`);
      }
    }
  }
}

processDir(PRERENDERED_DIR);
console.log(`[sync-bundle] Done. Updated ${updatedCount} prerendered files.`);
