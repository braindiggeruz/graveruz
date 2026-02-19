import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';

const DEFAULT_OG_IMAGE = `${BASE_URL}/og-blog.png`;
const DEFAULT_DESCRIPTION = 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Сначала макет — потом производство.';

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
  includeHtmlLang = true,
  isBlogPost = false,
  faq = [],
  datePublished
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

  // --- JSON-LD SCHEMA GENERATION ---
  let schemaGraph = [];
  if (isBlogPost) {
    // BlogPosting
    const blogPosting = {
      '@type': 'BlogPosting',
      headline: title,
      description: resolvedDescription,
      url: resolvedCanonicalUrl,
      inLanguage: locale === 'ru' ? 'ru-RU' : 'uz-Latn',
      author: { '@type': 'Organization', name: 'Graver Studio' },
      publisher: {
        '@type': 'Organization',
        name: 'Graver Studio',
        url: 'https://graver-studio.uz/'
      }
    };
    if (ogImage) blogPosting.image = ogImage;
    if (datePublished) {
      blogPosting.datePublished = datePublished;
      blogPosting.dateModified = datePublished;
    }
    schemaGraph.push(blogPosting);

    // BreadcrumbList
    const blogUrl = locale === 'ru'
      ? 'https://graver-studio.uz/ru/blog/'
      : 'https://graver-studio.uz/uz/blog/';
    schemaGraph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://graver-studio.uz/' },
        { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Блог' : 'Blog', item: blogUrl },
        { '@type': 'ListItem', position: 3, name: title, item: resolvedCanonicalUrl }
      ]
    });

    // FAQPage
    if (Array.isArray(faq) && faq.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        mainEntity: faq.map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer }
        }))
      });
    }
  }

  const schemaObj = schemaGraph.length > 0
    ? { '@context': 'https://schema.org', '@graph': schemaGraph }
    : null;

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

      {schemaObj && (
        <script type="application/ld+json">{JSON.stringify(schemaObj)}</script>
      )}
    </Helmet>
  );
}
