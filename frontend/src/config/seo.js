/**
 * Central SEO Configuration
 * All SEO-related constants and helpers in one place.
 * NEVER define BASE_URL locally in components.
 */

const RAW_BASE_URL = process.env.REACT_APP_BASE_URL || 'https://graver-studio.uz';
export const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

// Route mapping for B2C pages with different slugs per locale
export const ROUTE_MAP = {
  'catalog-products': 'mahsulotlar-katalogi',
  'watches-with-logo': 'logotipli-soat',
  'lighters-engraving': 'gravirovkali-zajigalka',
  'engraved-gifts': 'gravirovkali-sovgalar'
};

// Reverse map: UZ slug -> RU slug
export const ROUTE_MAP_REVERSE = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([ru, uz]) => [uz, ru])
);

// Hreflang codes
export const HREFLANG_MAP = {
  ru: 'ru-RU',
  uz: 'uz-UZ'
};

function normalizeSeoPath(pathname) {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (cleanPath === '/') {
    return '/';
  }
  return cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
}

/**
 * Build canonical URL from pathname (no query, no hash)
 */
export function buildCanonical(pathname) {
  const cleanPath = normalizeSeoPath(pathname);
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Get the alternate path for a different locale
 * Handles ROUTE_MAP for B2C pages with different slugs
 */
export function getAlternatePath(pathname, fromLocale, toLocale) {
  const segments = pathname.split('/').filter(Boolean);
  
  // First segment should be locale
  if (segments[0] === fromLocale) {
    segments[0] = toLocale;
  }
  
  // Second segment might need mapping (B2C pages)
  if (segments[1]) {
    if (fromLocale === 'ru' && toLocale === 'uz' && ROUTE_MAP[segments[1]]) {
      segments[1] = ROUTE_MAP[segments[1]];
    } else if (fromLocale === 'uz' && toLocale === 'ru' && ROUTE_MAP_REVERSE[segments[1]]) {
      segments[1] = ROUTE_MAP_REVERSE[segments[1]];
    }
  }
  
  return '/' + segments.join('/');
}

/**
 * Build alternate URL for hreflang
 */
export function buildAlternate(pathname, fromLocale, toLocale) {
  const altPath = getAlternatePath(pathname, fromLocale, toLocale);
  return `${BASE_URL}${normalizeSeoPath(altPath)}`;
}

/**
 * Get RU path for x-default (always points to RU version)
 */
export function getDefaultPath(pathname, currentLocale) {
  if (currentLocale === 'ru') {
    return pathname;
  }
  return getAlternatePath(pathname, currentLocale, 'ru');
}
