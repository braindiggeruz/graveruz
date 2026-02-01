export const locales = ['ru', 'uz'] as const;
export const defaultLocale = 'ru' as const;

export type Locale = typeof locales[number];

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locales.includes(locale as Locale)) return locale as Locale;
  return defaultLocale;
}

export function getLocalizedUrl(path: string, locale: Locale): string {
  // Remove existing locale prefix if any
  const cleanPath = path.replace(/^\/(ru|uz)/, '');
  return `/${locale}${cleanPath || '/'}`;
}

export function getAlternateUrls(path: string, siteUrl: string): { locale: Locale; url: string }[] {
  const cleanPath = path.replace(/^\/(ru|uz)/, '');
  return locales.map(locale => ({
    locale,
    url: `${siteUrl}/${locale}${cleanPath || '/'}`
  }));
}
