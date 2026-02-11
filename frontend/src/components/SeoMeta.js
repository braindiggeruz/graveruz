import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';

const DEFAULT_OG_IMAGE = `${BASE_URL}/og-blog.png`;

export default function SeoMeta({
  title,
  description,
  canonicalUrl,
  ruUrl,
  uzUrl,
  locale = 'ru',
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  siteName = 'Graver.uz',
  includeHtmlLang = true
}) {
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
  const ogLocale = locale === 'ru' ? 'ru_RU' : 'uz_UZ';
  const defaultUrl = ruUrl || canonicalUrl;

  useEffect(() => {
    document.querySelectorAll('[data-seo-meta]').forEach((el) => el.remove());

    if (canonicalUrl) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      canonical.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(canonical);
    }

    if (ruUrl) {
      const hreflangRu = document.createElement('link');
      hreflangRu.rel = 'alternate';
      hreflangRu.hreflang = HREFLANG_MAP.ru;
      hreflangRu.href = ruUrl;
      hreflangRu.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(hreflangRu);
    }

    if (uzUrl) {
      const hreflangUz = document.createElement('link');
      hreflangUz.rel = 'alternate';
      hreflangUz.hreflang = HREFLANG_MAP.uz;
      hreflangUz.href = uzUrl;
      hreflangUz.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(hreflangUz);
    }

    if (defaultUrl) {
      const hreflangDefault = document.createElement('link');
      hreflangDefault.rel = 'alternate';
      hreflangDefault.hreflang = 'x-default';
      hreflangDefault.href = defaultUrl;
      hreflangDefault.setAttribute('data-seo-meta', 'true');
      document.head.appendChild(hreflangDefault);
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('data-seo-meta', 'true');
    robotsMeta.content = robotsContent;

    return () => {
      document.querySelectorAll('[data-seo-meta]').forEach((el) => el.remove());
    };
  }, [canonicalUrl, ruUrl, uzUrl, defaultUrl, robotsContent]);

  return (
    <Helmet>
      {includeHtmlLang && <html lang={locale === 'uz' ? 'uz-Latn' : 'ru'} />}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {ruUrl && <link rel="alternate" hrefLang={HREFLANG_MAP.ru} href={ruUrl} />}
      {uzUrl && <link rel="alternate" hrefLang={HREFLANG_MAP.uz} href={uzUrl} />}
      {defaultUrl && <link rel="alternate" hrefLang="x-default" href={defaultUrl} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
