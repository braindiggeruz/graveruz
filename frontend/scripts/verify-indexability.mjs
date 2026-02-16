import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = (process.env.REACT_APP_BASE_URL || 'https://graver-studio.uz').replace(/\/+$/, '');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const buildDir = path.join(projectRoot, 'build');
const sitemapPath = path.join(buildDir, 'sitemap.xml');
const packageJsonPath = path.join(projectRoot, 'package.json');

function normalizeRoute(route) {
  if (!route || route === '/') return '/';
  return route.endsWith('/') ? route.slice(0, -1) : route;
}

function routeToHtmlPath(route) {
  if (route === '/') return path.join(buildDir, 'index.html');
  const clean = route.replace(/^\//, '');
  return path.join(buildDir, clean, 'index.html');
}

function extractLocs(xml) {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1].trim());
}

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function canonicalFromHtml(html) {
  const relFirst = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (relFirst) return relFirst[1].trim();
  const hrefFirst = html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return hrefFirst ? hrefFirst[1].trim() : '';
}

function robotsFromHtml(html) {
  const nameFirst = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
  if (nameFirst) return nameFirst[1].trim().toLowerCase();
  const contentFirst = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
  return contentFirst ? contentFirst[1].trim().toLowerCase() : '';
}

async function main() {
  const issues = [];
  const warnings = [];

  let sitemapXml;
  try {
    sitemapXml = await fs.readFile(sitemapPath, 'utf8');
  } catch {
    throw new Error(`Missing build sitemap: ${sitemapPath}. Run npm run build first.`);
  }

  const locs = extractLocs(sitemapXml);
  if (!locs.length) {
    throw new Error('No URLs found in build sitemap.xml');
  }

  const blogLocs = locs.filter((loc) => {
    const route = normalizeRoute(loc.slice(BASE_URL.length) || '/');
    return route === '/ru/blog' || route === '/uz/blog' || route.startsWith('/ru/blog/') || route.startsWith('/uz/blog/');
  });

  if (!blogLocs.length) {
    throw new Error('No blog URLs found in build sitemap.xml for indexability verification');
  }

  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const reactSnapIncludes = new Set(
    Array.isArray(packageJson?.reactSnap?.include)
      ? packageJson.reactSnap.include.map((route) => normalizeRoute(route))
      : []
  );

  const criticalHubRoutes = new Set(['/ru/blog', '/uz/blog']);

  for (const loc of blogLocs) {
    if (!loc.startsWith(BASE_URL)) {
      issues.push(`sitemap loc outside BASE_URL: ${loc}`);
      continue;
    }

    const route = normalizeRoute(loc.slice(BASE_URL.length) || '/');
    const isIncludedRoute = reactSnapIncludes.has(route);
    if (!isIncludedRoute) {
      warnings.push(`${route}: not in reactSnap include list, skipped strict checks`);
      continue;
    }

    const htmlPath = routeToHtmlPath(route);

    let html;
    try {
      html = await fs.readFile(htmlPath, 'utf8');
    } catch {
      issues.push(`missing prerendered HTML for route ${route}: ${htmlPath}`);
      continue;
    }

    const canonical = canonicalFromHtml(html);
    const canonicalCount = countMatches(html, /rel="canonical"/gi);
    const canonicalMismatch = canonical && normalizeRoute(canonical.replace(BASE_URL, '')) !== route;

    const robots = robotsFromHtml(html);

    const hreflangRu = countMatches(html, /hreflang="ru-RU"/gi);
    const hreflangUz = countMatches(html, /hreflang="uz-UZ"/gi);
    const hreflangDefault = countMatches(html, /hreflang="x-default"/gi);

    const h1Count = countMatches(html, /<h1[\s>]/gi);
    const hasBlogPostingSchema = /"@type"\s*:\s*"BlogPosting"/i.test(html);

    if (criticalHubRoutes.has(route)) {
      if (canonicalCount !== 1) {
        issues.push(`${route}: canonical count = ${canonicalCount}`);
      }
      if (canonicalMismatch) {
        issues.push(`${route}: canonical mismatch -> ${canonical}`);
      }
      if (!robots || robots.includes('noindex')) {
        issues.push(`${route}: non-indexable robots meta (${robots || 'missing'})`);
      }
      if (hreflangRu !== 1 || hreflangUz !== 1 || hreflangDefault !== 1) {
        issues.push(`${route}: hreflang counts ru/uz/x-default = ${hreflangRu}/${hreflangUz}/${hreflangDefault}`);
      }
    } else {
      if (h1Count !== 1) {
        issues.push(`${route}: h1 count = ${h1Count}`);
      }
      if (!hasBlogPostingSchema) {
        issues.push(`${route}: BlogPosting schema missing`);
      }
      if (robots && robots.includes('noindex')) {
        issues.push(`${route}: robots contains noindex`);
      }

      if (canonicalCount !== 1 || canonicalMismatch) {
        warnings.push(`${route}: canonical signal weak (count=${canonicalCount}${canonicalMismatch ? ', mismatch' : ''})`);
      }
      if (!robots) {
        warnings.push(`${route}: robots meta missing`);
      }
      if (hreflangRu !== 1 || hreflangUz !== 1 || hreflangDefault !== 1) {
        warnings.push(`${route}: hreflang incomplete (${hreflangRu}/${hreflangUz}/${hreflangDefault})`);
      }
    }
  }

  if (issues.length) {
    console.error(`[verify:indexability] FAIL: ${issues.length} issue(s)`);
    issues.slice(0, 50).forEach((issue) => console.error(`- ${issue}`));
    process.exit(1);
  }

  console.log(`[verify:indexability] OK: checked ${blogLocs.length} blog URL(s)`);
  if (warnings.length) {
    console.log(`[verify:indexability] WARN: ${warnings.length} non-blocking warning(s)`);
    warnings.slice(0, 30).forEach((warning) => console.log(`- ${warning}`));
  }
}

main().catch((error) => {
  console.error('[verify:indexability] Failed:', error.message || error);
  process.exit(1);
});
