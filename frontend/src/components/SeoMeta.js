import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';

const DEFAULT_OG_IMAGE = `${BASE_URL}/og-blog.png`;
const DEFAULT_DESCRIPTION = 'Лазерная гравировка корпоративных подарков в Ташкенте: макет до производства, тираж от 1 шт, быстрый расчёт. Закажите консультацию в Graver.uz.';

export default function SeoMeta({
  title,
  description,
  canonicalUrl,
  ruUrl,
  uzUrl,
  locale = 'ru',
  noindex = false,
  robots,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  siteName = 'Graver.uz',
  includeHtmlLang = true
}) {
  const location = useLocation();
  const isRootPath = location && location.pathname === '/';
  const rootCanonical = `${BASE_URL}/ru`;
  const resolvedCanonicalUrl = isRootPath ? rootCanonical : canonicalUrl;
  const resolvedRuUrl = isRootPath ? `${BASE_URL}/ru` : ruUrl;
  const resolvedUzUrl = isRootPath ? `${BASE_URL}/uz` : uzUrl;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const robotsContent = isRootPath
    ? 'noindex, follow'
    : (robots || (noindex ? 'noindex, nofollow' : 'index, follow'));
  const ogLocale = locale === 'ru' ? 'ru_RU' : 'uz_UZ';
  const defaultUrl = resolvedRuUrl || resolvedCanonicalUrl;

  return (
    <Helmet>
      {includeHtmlLang && <html lang={locale === 'uz' ? 'uz-Latn' : 'ru'} />}
      <title>{title}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots" content={robotsContent} />

      {resolvedCanonicalUrl && <link rel="canonical" href={resolvedCanonicalUrl} />}
      {resolvedRuUrl && <link rel="alternate" hrefLang={HREFLANG_MAP.ru} href={resolvedRuUrl} />}
      {resolvedUzUrl && <link rel="alternate" hrefLang={HREFLANG_MAP.uz} href={resolvedUzUrl} />}
      {defaultUrl && <link rel="alternate" hrefLang="x-default" href={defaultUrl} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={ogType} />
      {resolvedCanonicalUrl && <meta property="og:url" content={resolvedCanonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
