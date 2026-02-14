const BOT_ALLOWLIST = [
  'googlebot',
  'bingbot',
  'yandexbot'
] as const;

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_ALLOWLIST.some((token) => ua.includes(token));
}

export { BOT_ALLOWLIST };