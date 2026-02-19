import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';

var DEFAULT_OG_IMAGE = BASE_URL + '/og-blog.png';
var DEFAULT_DESCRIPTION = 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Сначала макет — потом производство.';

export default function SeoMeta(props) {
  var title = props.title;
  var description = props.description;
  var canonicalUrl = props.canonicalUrl;
  var ruUrl = props.ruUrl;
  var uzUrl = props.uzUrl;
  var locale = props.locale || 'ru';
  var noindex = props.noindex || false;
  var robots = props.robots;
  var ogImage = props.ogImage || DEFAULT_OG_IMAGE;
  var ogType = props.ogType || 'website';
  var siteName = props.siteName || 'Graver.uz';
  var includeHtmlLang = props.includeHtmlLang !== undefined ? props.includeHtmlLang : true;
  var isBlogPost = props.isBlogPost || false;
  var faq = props.faq || [];
  var datePublished = props.datePublished;
  var articleSection = props.articleSection;
  var readTime = props.readTime;
  var keywords = props.keywords;

  var location = useLocation();
  var isRootPath = location && location.pathname === '/';
  var rootCanonical = BASE_URL + '/ru';
  var resolvedCanonicalUrl = isRootPath ? rootCanonical : canonicalUrl;
  var resolvedRuUrl = isRootPath ? BASE_URL + '/ru' : ruUrl;
  var resolvedUzUrl = isRootPath ? BASE_URL + '/uz' : uzUrl;
  var resolvedDescription = description || DEFAULT_DESCRIPTION;

  // ШАГ 2 FIX: Убран noindex для корневого пути — главная теперь индексируется
  var robotsContent = robots || (noindex ? 'noindex, nofollow' : 'index, follow');

  var ogLocale = locale === 'ru' ? 'ru_RU' : 'uz_UZ';
  var defaultUrl = resolvedRuUrl || resolvedCanonicalUrl;

  // --- JSON-LD SCHEMA GENERATION ---
  var schemaGraph = [];

  if (isBlogPost) {
    // BlogPosting — улучшенная версия с mainEntityOfPage, logo, timeRequired, keywords
    var blogPosting = {
      '@type': 'BlogPosting',
      headline: title,
      description: resolvedDescription,
      url: resolvedCanonicalUrl,
      mainEntityOfPage: { '@type': 'WebPage', '@id': resolvedCanonicalUrl },
      inLanguage: locale === 'ru' ? 'ru' : 'uz',
      author: { '@type': 'Organization', name: 'Graver.uz', url: BASE_URL },
      publisher: {
        '@type': 'Organization',
        name: 'Graver.uz',
        url: BASE_URL,
        logo: { '@type': 'ImageObject', url: BASE_URL + '/og-blog.png' }
      }
    };
    if (ogImage) {
      blogPosting.image = [{ '@type': 'ImageObject', url: ogImage, width: 1200, height: 675 }];
    }
    if (datePublished) {
      blogPosting.datePublished = new Date(datePublished).toISOString();
      blogPosting.dateModified = new Date(datePublished).toISOString();
    }
    if (articleSection) { blogPosting.articleSection = articleSection; }
    if (readTime) { blogPosting.timeRequired = 'PT' + readTime + 'M'; }
    if (keywords) { blogPosting.keywords = keywords; }
    schemaGraph.push(blogPosting);

    // BreadcrumbList
    var blogUrl = locale === 'ru'
      ? BASE_URL + '/ru/blog/'
      : BASE_URL + '/uz/blog/';
    schemaGraph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Bosh sahifa', item: BASE_URL + '/' + locale },
        { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Блог' : 'Blog', item: blogUrl },
        { '@type': 'ListItem', position: 3, name: title, item: resolvedCanonicalUrl }
      ]
    });

    // FAQPage
    if (Array.isArray(faq) && faq.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        mainEntity: faq.map(function(q) {
          return {
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer }
          };
        })
      });
    }
  }

  // ШАГ 7: WebSite + Organization schema для НЕ-блог страниц
  if (!isBlogPost) {
    schemaGraph.push({
      '@type': 'WebSite',
      name: 'Graver.uz',
      url: BASE_URL,
      inLanguage: ['ru', 'uz'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: BASE_URL + '/ru/blog/?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    });
    schemaGraph.push({
      '@type': 'Organization',
      name: 'Graver Studio',
      alternateName: 'Graver.uz',
      url: BASE_URL,
      logo: BASE_URL + '/og-blog.png',
      description: 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Корпоративные подарки, мерч, сувениры с логотипом.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ташкент',
        addressRegion: 'Tashkent',
        addressCountry: 'UZ'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Russian', 'Uzbek']
      },
      sameAs: [
        'https://t.me/GraverAdm'
      ]
    });
  }

  var schemaObj = schemaGraph.length > 0
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
