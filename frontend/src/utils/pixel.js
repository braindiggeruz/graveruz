// Centralized Telegram Contact tracking for Meta Pixel
// Single source of truth — no duplicates, dedup by placement (1.5s window)
const lastSent = {};

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
