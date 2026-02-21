// Centralized Telegram Contact tracking for Meta Pixel
const lastSent = {};

export function trackTelegramContact(placement) {
  if (typeof window === 'undefined' || !window.fbq) return;
  const now = Date.now();
  if (lastSent[placement] && now - lastSent[placement] < 1200) return;
  lastSent[placement] = now;
  window.fbq('track', 'Contact', {
    source: 'telegram',
    page: window.location.pathname,
    placement
  });
}
