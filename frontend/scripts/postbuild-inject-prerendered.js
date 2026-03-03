/**
 * postbuild-inject-prerendered.js
 *
 * Merges pre-rendered SEO <head> fragments from frontend/prerendered/ into
 * the full HTML pages in frontend/build/ after craco build + react-snap complete.
 *
 * ARCHITECTURE:
 * - prerendered/ru/index.html = SEO <head> fragment (no closing </head>, no <body>)
 *   Starts with: <!DOCTYPE html><html lang="ru"><head>...SEO tags...
 *   Created by: postbuild-inject-seo-meta.js
 *
 * - build/ru/index.html = full HTML from react-snap with <head>...</head><body>...</body>
 *   Created by: react-snap (Chromium, runs locally only)
 *
 * MERGE RESULT: prerendered <head> content + </head> + build <body>...</body></html>
 *
 * WHY NOT JUST COPY prerendered/ OVER build/?
 * prerendered/ files are HEAD-ONLY fragments. Copying them would replace
 * react-snap full HTML (with div#root content) with an empty shell,
 * causing React hydration error #299 and a blank page.
 */
const fs = require('fs');
const path = require('path');

const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');
const BUILD_DIR = path.join(__dirname, '..', 'build');

if (!fs.existsSync(PRERENDERED_DIR)) {
  console.log('[inject-prerendered] No prerendered/ directory found, skipping injection.');
  process.exit(0);
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error('[inject-prerendered] ERROR: build/ directory not found. Run craco build first.');
  process.exit(1);
}

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
console.log('[inject-prerendered] Found ' + prerenderedFiles.length + ' SEO head fragments to merge');

/**
 * Extract content INSIDE <head> from a prerendered fragment.
 * The fragment has no closing </head> tag.
 */
function extractPrerenderedHeadContent(html) {
  const headOpenMatch = html.match(/<head>/i);
  if (!headOpenMatch) return null;
  const headStart = headOpenMatch.index + headOpenMatch[0].length;
  let headContent = html.slice(headStart);
  headContent = headContent.replace(/<\/head>[\s\S]*$/i, '').trimEnd();
  return headContent;
}

/**
 * Extract everything from </head> onwards in the build HTML.
 * Returns: </head><body>...</body></html>
 */
function extractBuildBodySection(html) {
  const headCloseIdx = html.search(/<\/head>/i);
  if (headCloseIdx === -1) return null;
  return html.slice(headCloseIdx);
}

/** Extract the opening <html> tag (with lang attribute). */
function extractHtmlOpenTag(html) {
  const match = html.match(/<html[^>]*>/i);
  return match ? match[0] : '<html>';
}

let merged = 0;
let fallback = 0;

for (const relPath of prerenderedFiles) {
  const prerenderedFile = path.join(PRERENDERED_DIR, relPath);
  const buildFile = path.join(BUILD_DIR, relPath);
  const buildDir = path.dirname(buildFile);

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  const prerenderedHtml = fs.readFileSync(prerenderedFile, 'utf8');

  if (fs.existsSync(buildFile)) {
    const buildHtml = fs.readFileSync(buildFile, 'utf8');
    const hasDivRoot = buildHtml.includes('id="root"');
    const hasBodyContent = /<body[^>]*>[\s\S]{100,}<\/body>/i.test(buildHtml);

    if (hasDivRoot && hasBodyContent) {
      const headContent = extractPrerenderedHeadContent(prerenderedHtml);
      const bodySection = extractBuildBodySection(buildHtml);
      const htmlTag = extractHtmlOpenTag(prerenderedHtml);

      if (headContent !== null && bodySection !== null) {
        const mergedHtml = '<!DOCTYPE html>' + htmlTag + '<head>' + headContent + '</head>' + bodySection;
        fs.writeFileSync(buildFile, mergedHtml, 'utf8');
        merged++;
        console.log('[inject-prerendered] Merged: ' + relPath);
        continue;
      }
    }
    console.warn('[inject-prerendered] No react-snap body in build for: ' + relPath + ' — using prerendered as shell');
  }

  // Fallback: no build file or no react-snap body
  let html = prerenderedHtml.trimEnd();
  if (!/<\/head>/i.test(html)) html += '\n</head>';
  if (!/<body/i.test(html)) html += '\n<body><div id="root"></div></body>';
  if (!/<\/html>/i.test(html)) html += '\n</html>';
  fs.writeFileSync(buildFile, html, 'utf8');
  fallback++;
  console.log('[inject-prerendered] Fallback shell: ' + relPath);
}

console.log('[inject-prerendered] Done: ' + merged + ' merged (full HTML), ' + fallback + ' fallback shells');
