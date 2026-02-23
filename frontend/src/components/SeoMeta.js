import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';

var DEFAULT_OG_IMAGE = BASE_URL + '/og-blog.png';
var DEFAULT_DESCRIPTION = 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Сначала макет — потом производство.';

// LocalBusiness data — synced with Google Business Profile
var LOCAL_BUSINESS = {
  '@type': 'LocalBusiness',
  '@id': BASE_URL + '/#localbusiness',
  name: 'Graver Studio',
  alternateName: 'Graver.uz',
  description: 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Корпоративные подарки, мерч, сувениры с логотипом на заказ.',
  url: BASE_URL,
  telephone: '+998770802288',
  image: BASE_URL + '/og-blog.png',
  logo: {
    '@type': 'ImageObject',
    url: BASE_URL + '/og-blog.png',
    width: 1200,
    height: 630
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'улица Мукими',
    addressLocality: 'Ташкент',
    addressRegion: 'Tashkent',
    postalCode: '100000',
    addressCountry: 'UZ'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.2995,
    longitude: 69.2401
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '16:00'
    }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+998770802288',
    contactType: 'customer service',
    availableLanguage: ['Russian', 'Uzbek'],
    contactOption: 'TollFree'
  },
  sameAs: [
    'https://t.me/GraverAdm'
  ],
  priceRange: '$$',
  currenciesAccepted: 'UZS',
  paymentAccepted: 'Cash, Bank Transfer',
  areaServed: {
    '@type': 'Country',
    name: 'Uzbekistan'
  }
};

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
  var isContactsPage = props.isContactsPage || false;
  var faq = props.faq || [];
  var datePublished = props.datePublished;
  var dateModified = props.dateModified || props.datePublished;
  var articleSection = props.articleSection;
  var readTime = props.readTime;
  var keywords = props.keywords;
  // RSS feed links for blog hub pages
  var showRssLinks = props.showRssLinks || false;

  var location = useLocation();
  var isRootPath = location && location.pathname === '/';
  var rootCanonical = BASE_URL + '/ru/';
  var resolvedCanonicalUrl = isRootPath ? rootCanonical : canonicalUrl;
  var resolvedRuUrl = isRootPath ? BASE_URL + '/ru/' : ruUrl;
  var resolvedUzUrl = isRootPath ? BASE_URL + '/uz/' : uzUrl;
  var resolvedDescription = description || DEFAULT_DESCRIPTION;

  // Robots: max-image-preview:large for blog posts (Discover optimisation)
  var robotsBase = robots || (noindex ? 'noindex, nofollow' : 'index, follow');
  var robotsContent = isBlogPost
    ? robotsBase + ', max-image-preview:large'
    : robotsBase;

  var ogLocale = locale === 'ru' ? 'ru_RU' : 'uz_UZ';
  var defaultUrl = resolvedRuUrl || resolvedCanonicalUrl;

  // --- JSON-LD SCHEMA GENERATION ---
  var schemaGraph = [];

  if (isBlogPost) {
    // BlogPosting — full E-E-A-T compliant schema
    var blogPosting = {
      '@type': 'BlogPosting',
      '@id': resolvedCanonicalUrl + '#article',
      headline: title,
      description: resolvedDescription,
      url: resolvedCanonicalUrl,
      mainEntityOfPage: { '@type': 'WebPage', '@id': resolvedCanonicalUrl },
      inLanguage: locale === 'ru' ? 'ru' : 'uz',
      author: {
        '@type': 'Organization',
        '@id': BASE_URL + '/#organization',
        name: 'Graver.uz',
        url: BASE_URL
      },
      publisher: {
        '@type': 'Organization',
        '@id': BASE_URL + '/#organization',
        name: 'Graver.uz',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: BASE_URL + '/og-blog.png',
          width: 1200,
          height: 630
        }
      }
    };
    if (ogImage) {
      blogPosting.image = [{
        '@type': 'ImageObject',
        '@id': ogImage + '#primaryimage',
        url: ogImage,
        width: 1200,
        height: 675,
        caption: title
      }];
    }
    if (datePublished) {
      blogPosting.datePublished = new Date(datePublished).toISOString();
    }
    if (dateModified) {
      blogPosting.dateModified = new Date(dateModified).toISOString();
    } else if (datePublished) {
      blogPosting.dateModified = new Date(datePublished).toISOString();
    }
    if (articleSection) { blogPosting.articleSection = articleSection; }
    if (readTime) { blogPosting.timeRequired = 'PT' + readTime + 'M'; }
    if (keywords) { blogPosting.keywords = keywords; }
    schemaGraph.push(blogPosting);

    // BreadcrumbList for blog posts
    var blogUrl = locale === 'ru'
      ? BASE_URL + '/ru/blog/'
      : BASE_URL + '/uz/blog/';
    schemaGraph.push({
      '@type': 'BreadcrumbList',
      '@id': resolvedCanonicalUrl + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: locale === 'ru' ? 'Главная' : 'Bosh sahifa', item: BASE_URL + '/' + locale + '/' },
        { '@type': 'ListItem', position: 2, name: locale === 'ru' ? 'Блог' : 'Blog', item: blogUrl },
        { '@type': 'ListItem', position: 3, name: title, item: resolvedCanonicalUrl }
      ]
    });

    // FAQPage — fixed field names: q/a → question/answer
    if (Array.isArray(faq) && faq.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': resolvedCanonicalUrl + '#faq',
        mainEntity: faq.map(function(item) {
          // Support both {q, a} and {question, answer} formats
          var questionText = item.question || item.q || '';
          var answerText = item.answer || item.a || '';
          return {
            '@type': 'Question',
            name: questionText,
            acceptedAnswer: { '@type': 'Answer', text: answerText }
          };
        }).filter(function(item) {
          return item.name && item.acceptedAnswer.text;
        })
      });
    }
  }

  // WebSite + Organization + LocalBusiness schema for non-blog pages
  if (!isBlogPost) {
    schemaGraph.push({
      '@type': 'WebSite',
      '@id': BASE_URL + '/#website',
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

    // Full Organization schema
    schemaGraph.push({
      '@type': 'Organization',
      '@id': BASE_URL + '/#organization',
      name: 'Graver Studio',
      alternateName: 'Graver.uz',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: BASE_URL + '/og-blog.png',
        width: 1200,
        height: 630
      },
      description: 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Корпоративные подарки, мерч, сувениры с логотипом.',
      telephone: '+998770802288',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'улица Мукими',
        addressLocality: 'Ташкент',
        addressRegion: 'Tashkent',
        postalCode: '100000',
        addressCountry: 'UZ'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+998770802288',
        contactType: 'customer service',
        availableLanguage: ['Russian', 'Uzbek']
      },
      sameAs: [
        'https://t.me/GraverAdm'
      ]
    });

    // LocalBusiness schema — added on contacts page and globally
    if (isContactsPage) {
      schemaGraph.push(LOCAL_BUSINESS);
    }
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

      {/* RSS feeds for blog hub pages */}
      {showRssLinks && (
        <link rel="alternate" type="application/rss+xml" title="Graver.uz Blog (RU)" href={BASE_URL + '/rss-ru.xml'} />
      )}
      {showRssLinks && (
        <link rel="alternate" type="application/rss+xml" title="Graver.uz Blog (UZ)" href={BASE_URL + '/rss-uz.xml'} />
      )}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={ogType} />
      {resolvedCanonicalUrl && <meta property="og:url" content={resolvedCanonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="675" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {keywords && <meta name="keywords" content={keywords} />}

      {schemaObj && (
        <script type="application/ld+json">{JSON.stringify(schemaObj)}</script>
      )}
    </Helmet>
  );
}
