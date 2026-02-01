import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../i18n';

const BASE_URL = 'https://graver.uz';

export default function SEOHead({ page = 'home' }) {
  const { locale, t, supportedLocales, getLocalizedPath } = useI18n();
  
  const currentPath = window.location.pathname;
  const canonicalUrl = `${BASE_URL}${currentPath}`;
  
  // hreflang mapping
  const hreflangMap = {
    ru: 'ru',
    uz: 'uz-Latn'
  };
  
  // FAQ items for schema
  const faqItems = t('faq.items');
  
  // Add canonical and hreflang tags via DOM manipulation (more reliable for SPA)
  useEffect(() => {
    // Remove existing alternate/canonical links
    document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(el => el.remove());
    
    // Add canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
    
    // Add hreflang tags
    supportedLocales.forEach(loc => {
      const hreflang = document.createElement('link');
      hreflang.rel = 'alternate';
      hreflang.hreflang = hreflangMap[loc];
      hreflang.href = `${BASE_URL}${getLocalizedPath(currentPath, loc)}`;
      document.head.appendChild(hreflang);
    });
    
    // Add x-default
    const xdefault = document.createElement('link');
    xdefault.rel = 'alternate';
    xdefault.hreflang = 'x-default';
    xdefault.href = `${BASE_URL}/ru`;
    document.head.appendChild(xdefault);
    
    return () => {
      document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(el => el.remove());
    };
  }, [locale, currentPath, canonicalUrl, supportedLocales, getLocalizedPath]);
  
  // Build FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Array.isArray(faqItems) ? faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    })) : []
  };
  
  // Build Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Graver.uz",
    "description": t('meta.description'),
    "url": BASE_URL,
    "telephone": ["+998770802288", "+998974802288"],
    "email": "info@graver.uz",
    "image": `${BASE_URL}/portfolio/1.webp`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": locale === 'ru' ? "улица Мукими" : "Muqimiy ko'chasi",
      "addressLocality": locale === 'ru' ? "Ташкент" : "Toshkent",
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.2995",
      "longitude": "69.2401"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Uzbekistan"
    },
    "openingHours": "Mo-Su 10:00-20:00",
    "priceRange": "$$",
    "sameAs": [
      "https://t.me/GraverAdm"
    ],
    "serviceType": [
      locale === 'ru' ? "Лазерная гравировка" : "Lazer gravyurasi",
      locale === 'ru' ? "Корпоративные подарки" : "Korporativ sovg'alar",
      locale === 'ru' ? "Брендирование" : "Brendlash"
    ]
  };
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={t('meta.ogTitle')} />
      <meta property="og:description" content={t('meta.ogDescription')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={locale === 'ru' ? 'ru_RU' : 'uz_UZ'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('meta.ogTitle')} />
      <meta name="twitter:description" content={t('meta.ogDescription')} />
      
      {/* JSON-LD Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* JSON-LD FAQ Schema for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
}
