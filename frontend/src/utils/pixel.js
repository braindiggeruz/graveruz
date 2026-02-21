// Centralized Telegram Contact tracking for Meta Pixel
// Single source of truth — no duplicates, dedup by placement (1.5s window)

const TELEGRAM_URL = 'https://t.me/GraverAdm';
const lastSent = {};

/**
 * Fires fbq('track', 'Contact') for Meta Pixel.
 * Deduplicates by placement within 1500ms window.
 */
export function trackTelegramContact(placement) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  const now = Date.now();
  if (lastSent[placement] && now - lastSent[placement] < 1500) return;
  lastSent[placement] = now;

  // eventID for server-side dedup (Conversions API)
  const eventID = `contact_${placement}_${now}`;

  window.fbq('track', 'Contact', {
    source: 'telegram',
    page: window.location.pathname,
    placement,
  }, { eventID });
}

/**
 * Click handler for Telegram CTA buttons.
 * Prevents default navigation, fires fbq Contact first,
 * then opens Telegram after 300ms to guarantee the event is sent.
 * Falls back to immediate open if fbq is unavailable.
 *
 * Usage in JSX:
 *   <a href="https://t.me/GraverAdm" onClick={(e) => openTelegramWithTracking(e, 'placement-name')}>
 */
export function openTelegramWithTracking(e, placement) {
  e.preventDefault();

  const hasFbq = typeof window !== 'undefined' && typeof window.fbq === 'function';

  if (hasFbq) {
    trackTelegramContact(placement);
    // Give fbq 300ms to flush the event before navigating
    setTimeout(() => {
      window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
    }, 300);
  } else {
    // No pixel — open immediately, no delay
    window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
  }
}
