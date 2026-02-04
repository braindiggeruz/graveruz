import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { BASE_URL, HREFLANG_MAP, buildCanonical, buildAlternate, getDefaultPath } from '../config/seo';

/**
 * SEOHead Component
 * Manages all SEO meta tags via react-helmet-async
 * 
 * @param {string} page - Page identifier: 'home', 'process', 'guarantees', 'contacts', 'thanks', '404'
 * @param {boolean} noindex - Force noindex,nofollow (for thanks, 404)
 */
export default function SEOHead({ page = 'home', noindex = false }) {
  const location = useLocation();
  const { locale, t } = useI18n();
  
  // Get only pathname (no query, no hash)
  const pathname = location.pathname;
  const canonicalUrl = buildCanonical(pathname);
  
  // Build alternate URLs for hreflang
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');
  const defaultUrl = `${BASE_URL}${getDefaultPath(pathname, locale)}`;
  
  // Determine title and description based on page
  let title, description;
  
  if (page === 'home') {
    title = t('meta.title');
    description = t('meta.description');
  } else if (page === 'process') {
    title = t('meta.process.title');
    description = t('meta.process.description');
  } else if (page === 'guarantees') {
    title = t('meta.guarantees.title');
    description = t('meta.guarantees.description');
  } else if (page === 'contacts') {
    title = t('meta.contacts.title');
    description = t('meta.contacts.description');
  } else if (page === 'thanks') {
    title = t('meta.thanks.title');
    description = t('meta.thanks.description');
    noindex = true; // Always noindex thanks page
  } else if (page === '404') {
    title = '404 — Страница не найдена | Graver.uz';
    description = 'Запрашиваемая страница не найдена.';
    noindex = true; // Always noindex 404
  } else {
    // Fallback to home meta
    title = t('meta.title');
    description = t('meta.description');
  }
  
  // Robots directive
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
  
  // OG locale
  const ogLocale = locale === 'ru' ? 'ru_RU' : 'uz_UZ';
  
  // Workaround: Inject SEO tags via DOM (react-helmet-async v2 link bug)
  React.useEffect(() => {
    // Remove old SEO tags
    document.querySelectorAll('[data-seo-head]').forEach(el => el.remove());
    
    // Add canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    canonical.setAttribute('data-seo-head', 'true');
    document.head.appendChild(canonical);
    
    // Add hreflang ru
    const hreflangRu = document.createElement('link');
    hreflangRu.rel = 'alternate';
    hreflangRu.hreflang = HREFLANG_MAP.ru;
    hreflangRu.href = ruUrl;
    hreflangRu.setAttribute('data-seo-head', 'true');
    document.head.appendChild(hreflangRu);
    
    // Add hreflang uz
    const hreflangUz = document.createElement('link');
    hreflangUz.rel = 'alternate';
    hreflangUz.hreflang = HREFLANG_MAP.uz;
    hreflangUz.href = uzUrl;
    hreflangUz.setAttribute('data-seo-head', 'true');
    document.head.appendChild(hreflangUz);
    
    // Add hreflang x-default
    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = defaultUrl;
    hreflangDefault.setAttribute('data-seo-head', 'true');
    document.head.appendChild(hreflangDefault);
    
    // Add robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.setAttribute('data-seo-head', 'true');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = robotsContent;
    
    return () => {
      document.querySelectorAll('[data-seo-head]').forEach(el => el.remove());
    };
  }, [canonicalUrl, ruUrl, uzUrl, defaultUrl, robotsContent]);
  
  // Build LocalBusiness schema (only verified data)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Graver.uz",
    "url": BASE_URL,
    "telephone": ["+998770802288", "+998974802288"],
    "email": "info@graver.uz",
    "areaServed": {
      "@type": "City",
      "name": "Tashkent"
    }
  };
  
  // FAQ Schema - only for home page where FAQ is visible
  const faqItems = page === 'home' ? t('faq.items') : null;
  const faqSchema = faqItems && Array.isArray(faqItems) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  } : null;
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <html lang={locale === 'uz' ? 'uz-Latn' : 'ru'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang */}
      <link rel="alternate" hreflang={HREFLANG_MAP.ru} href={ruUrl} />
      <link rel="alternate" hreflang={HREFLANG_MAP.uz} href={uzUrl} />
      <link rel="alternate" hreflang="x-default" href={defaultUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="Graver.uz" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* JSON-LD: Organization Schema (always) */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* JSON-LD: FAQ Schema (only on home) */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
}
