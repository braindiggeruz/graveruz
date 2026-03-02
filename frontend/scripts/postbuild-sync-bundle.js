/**
 * postbuild-sync-bundle.js
 *
 * After craco build, the JS/CSS bundle hashes change.
 * This script updates all prerendered/ HTML files to reference
 * the new bundle hashes from build/asset-manifest.json.
 *
 * Also injects GA4 gtag.js into any prerendered HTML files that are missing it.
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

// Regex to remove signals/config script tag (React Snap artifact — breaks pixel init order)
const signalsConfigPattern = /<script[^>]*src="https:\/\/connect\.facebook\.net\/signals\/config\/[^"]*"[^>]*><\/script>/g;

// Regex to remove standalone async fbevents.js tag (React Snap artifact — duplicates inline pixel snippet)
const fbeventsDuplicatePattern = /<script\s+src="https:\/\/connect\.facebook\.net\/en_US\/fbevents\.js"\s+async><\/script>/g;

// GA4 detection pattern
const ga4DetectionPattern = /googletagmanager\.com\/gtag\/js\?id=G-Z7V0FSGE4Y/;

// GA4 snippet to inject into prerendered HTML files that are missing it
const GA4_SNIPPET = '<link rel="preconnect" href="https://www.googletagmanager.com"/>'
  + '<!-- Google tag (gtag.js) - GA4 -->'
  + '<script async src="https://www.googletagmanager.com/gtag/js?id=G-Z7V0FSGE4Y"></script>'
  + '<script>function gtag(){dataLayer.push(arguments)}'
  + 'window.dataLayer=window.dataLayer||[],'
  + 'gtag("js",new Date),'
  + 'gtag("config","G-Z7V0FSGE4Y",{send_page_view:!1,cookie_flags:"SameSite=None;Secure"})'
  + '</script>';

// Facebook pixel script anchor (used for GA4 injection in incomplete HTML files)
const FB_PIXEL_ANCHOR = '<script>!function(e,t,n,c,o,a,f)';

let updatedCount = 0;
let ga4InjectedCount = 0;

function injectGa4(content) {
  // Strategy 1: Insert before </head> (complete HTML)
  if (content.includes('</head>')) {
    const idx = content.indexOf('</head>');
    return content.slice(0, idx) + GA4_SNIPPET + content.slice(idx);
  }
  // Strategy 2: Insert before Facebook pixel script (incomplete HTML)
  if (content.includes(FB_PIXEL_ANCHOR)) {
    const idx = content.indexOf(FB_PIXEL_ANCHOR);
    return content.slice(0, idx) + GA4_SNIPPET + content.slice(idx);
  }
  // Strategy 3: Insert after <head> tag
  const headIdx = content.toLowerCase().indexOf('<head>');
  if (headIdx !== -1) {
    const insertAt = headIdx + 6;
    return content.slice(0, insertAt) + GA4_SNIPPET + content.slice(insertAt);
  }
  return null; // Could not find insertion point
}

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

      // 1. Update JS bundle hash
      content = content.replace(jsPattern, newJsFilename);

      // 2. Update CSS bundle hash
      if (newCssFilename) {
        content = content.replace(cssPattern, newCssFilename);
      }

      // 3. Remove signals/config hardcoded script tag
      content = content.replace(signalsConfigPattern, '');

      // 4. Remove duplicate standalone fbevents.js async tag
      content = content.replace(fbeventsDuplicatePattern, '');

      // 5. Inject GA4 if missing
      if (!ga4DetectionPattern.test(content)) {
        const injected = injectGa4(content);
        if (injected) {
          content = injected;
          ga4InjectedCount++;
          const rel = path.relative(PRERENDERED_DIR, fullPath);
          console.log(`[sync-bundle] GA4 injected: ${rel}`);
        } else {
          const rel = path.relative(PRERENDERED_DIR, fullPath);
          console.warn(`[sync-bundle] WARNING: Could not inject GA4 into ${rel}`);
        }
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
console.log(`[sync-bundle] Done. Updated ${updatedCount} prerendered files (GA4 injected in ${ga4InjectedCount}).`);
