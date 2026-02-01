import React from 'react';
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
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <html lang={locale === 'uz' ? 'uz-Latn' : locale} />
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* hreflang tags */}
      {supportedLocales.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={hreflangMap[loc]}
          href={`${BASE_URL}${getLocalizedPath(currentPath, loc)}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${BASE_URL}/ru`}
      />
      
      {/* Open Graph */}
      <meta property="og:title" content={t('meta.ogTitle')} />
      <meta property="og:description" content={t('meta.ogDescription')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={locale === 'ru' ? 'ru_RU' : 'uz_UZ'} />
      {supportedLocales.filter(l => l !== locale).map(loc => (
        <meta key={loc} property="og:locale:alternate" content={loc === 'ru' ? 'ru_RU' : 'uz_UZ'} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('meta.ogTitle')} />
      <meta name="twitter:description" content={t('meta.ogDescription')} />
      
      {/* JSON-LD Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Graver.uz",
          "description": t('meta.description'),
          "url": BASE_URL,
          "telephone": ["+998770802288", "+998974802288"],
          "email": "info@graver.uz",
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
        })}
      </script>
    </Helmet>
  );
}
