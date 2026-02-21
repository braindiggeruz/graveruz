// Centralized Telegram Contact tracking for Meta Pixel
// Fires fbq('track', 'Contact') synchronously — no setTimeout, no preventDefault
// Browser follows the href naturally (target="_blank" on the <a> tag)

/**
 * Fires fbq('track', 'Contact') for Meta Pixel.
 */
export function trackTelegramContact(placement) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  const eventID = `contact_${placement}_${Date.now()}`;
  window.fbq('track', 'Contact', {
    source: 'telegram',
    page: window.location.pathname,
    placement,
  }, { eventID });
}

/**
 * Click handler for Telegram CTA buttons.
 * Fires fbq Contact synchronously, then lets the browser follow the href.
 * IMPORTANT: Do NOT call e.preventDefault() — it breaks the link.
 * All Telegram <a> tags must have target="_blank" rel="noopener noreferrer".
 *
 * Usage in JSX:
 *   <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer"
 *      onClick={(e) => openTelegramWithTracking(e, 'placement-name')}>
 */
export function openTelegramWithTracking(e, placement) {
  // Fire pixel event synchronously — keeps user gesture context for popup
  trackTelegramContact(placement);
  // Let the browser follow the href naturally (no preventDefault)
}
