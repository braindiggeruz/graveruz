// Centralized Meta Pixel tracking utilities
// All browser-side fbq() calls go through this file.
// Events: Contact, Lead, ViewContent, ViewCategory

// ─── helpers ────────────────────────────────────────────────────────────────

function hasFbq() {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

function makeEventID(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Contact (Telegram CTA clicks) ──────────────────────────────────────────

/**
 * Fires fbq('track', 'Contact') for Meta Pixel.
 * Called synchronously inside onClick so the user gesture is preserved.
 */
export function trackTelegramContact(placement) {
  if (!hasFbq()) {
    console.warn('[pixel] fbq not ready, Contact skipped for', placement);
    return;
  }
  const eventID = makeEventID('contact_' + placement);
  console.log('[pixel] Contact fired:', placement, eventID);
  window.fbq('track', 'Contact', {
    source: 'telegram',
    page: window.location.pathname,
    placement,
  }, { eventID });
}

/**
 * Click handler for all Telegram CTA <a> tags.
 * Usage in JSX:
 *   <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer"
 *      onClick={(e) => openTelegramWithTracking(e, 'placement-name')}>
 */
export function openTelegramWithTracking(e, placement) {
  trackTelegramContact(placement);
  // Do NOT call e.preventDefault() — browser must follow the href.
}

// ─── Lead (PDF catalogue download) ──────────────────────────────────────────

/**
 * Fires fbq('track', 'Lead') when a visitor downloads the PDF catalogue.
 * Attach to the onClick of every download <a> tag.
 *
 * Usage:
 *   <a href="/catalogs/graver-lighters-catalog-2026.pdf" download
 *      onClick={() => trackCatalogDownload('lighters-page')}>
 */
export function trackCatalogDownload(placement) {
  if (!hasFbq()) {
    console.warn('[pixel] fbq not ready, Lead skipped for', placement);
    return;
  }
  const eventID = makeEventID('lead_catalog_' + placement);
  console.log('[pixel] Lead (catalog download) fired:', placement, eventID);
  window.fbq('track', 'Lead', {
    content_name: 'catalog_pdf',
    placement,
    page: window.location.pathname,
  }, { eventID });
}

// ─── ViewCategory (product category pages) ──────────────────────────────────

/**
 * Fires fbq('trackCustom', 'ViewCategory') when a product category page mounts.
 * Call inside useEffect(() => { trackViewCategory(...) }, []) in each category page.
 *
 * Usage:
 *   useEffect(() => { trackViewCategory('lighters', 'Зажигалки с гравировкой') }, []);
 */
export function trackViewCategory(categoryId, categoryName) {
  if (!hasFbq()) return;
  const eventID = makeEventID('viewcat_' + categoryId);
  console.log('[pixel] ViewCategory fired:', categoryId, categoryName);
  window.fbq('trackCustom', 'ViewCategory', {
    category_id: categoryId,
    category_name: categoryName,
    page: window.location.pathname,
  }, { eventID });
}

// ─── ViewContent (blog articles) ────────────────────────────────────────────

/**
 * Fires fbq('track', 'ViewContent') when a blog article page mounts.
 * Call inside useEffect in BlogPost.js.
 *
 * Usage:
 *   useEffect(() => {
 *     if (post) trackViewContent(post.slug, post.title, post.category);
 *   }, [post?.slug]);
 */
export function trackViewContent(contentId, contentName, contentCategory) {
  if (!hasFbq()) return;
  const eventID = makeEventID('viewcontent_' + contentId);
  console.log('[pixel] ViewContent fired:', contentId, contentName);
  window.fbq('track', 'ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_category: contentCategory || 'blog',
    content_type: 'article',
  }, { eventID });
}
