import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { BASE_URL, buildCanonical, buildAlternate } from '../config/seo';
import SeoMeta from './SeoMeta';

/**
 * SEOHead Component
 * Manages all SEO meta tags via react-helmet-async
 * 
 * @param {string} page - Page identifier: 'home', 'process', 'guarantees', 'contacts', 'thanks', '404'
 * @param {boolean} noindex - Force noindex,nofollow (for thanks, 404)
 */
export default function SEOHead({
  page = 'home',
  noindex = false,
  title: titleOverride,
  description: descriptionOverride,
  ogType = 'website',
  ogImage
}) {
  const location = useLocation();
  const { locale, t } = useI18n();
  
  // Get only pathname (no query, no hash)
  const pathname = location.pathname;
  const canonicalUrl = buildCanonical(pathname);
  
  // Build alternate URLs for hreflang
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');
  
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
  
  if (titleOverride) {
    title = titleOverride;
  }
  if (descriptionOverride) {
    description = descriptionOverride;
  }
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Graver.uz",
    "url": BASE_URL,
    "inLanguage": locale === 'ru' ? 'ru' : 'uz'
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

  const localBusinessSchema = page === 'home' ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/ru#organization`,
    "name": "Graver.uz",
    "description": locale === 'ru'
      ? 'Премиальная лазерная гравировка и брендирование для бизнеса в Ташкенте'
      : 'Toshkentda biznes uchun premium lazer gravirovka va brendlash',
    "url": BASE_URL,
    "telephone": "+998 77 080 22 88",
    "email": "info@graver-studio.uz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": locale === 'ru' ? 'Ташкент, Узбекистан' : 'Toshkent, O\'zbekiston',
      "addressCountry": "UZ"
    },
    "areaServed": ["UZ"],
    "priceRange": "$$",
    "image": `${BASE_URL}/og-blog.png`,
    "logo": `${BASE_URL}/og-blog.png`,
    "sameAs": [
      "https://www.instagram.com/graver.uz",
      "https://t.me/graveruz"
    ]
  } : null;
  
  return (
    <>
      <SeoMeta
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        ruUrl={ruUrl}
        uzUrl={uzUrl}
        locale={locale}
        noindex={noindex}
        ogType={ogType}
        ogImage={ogImage}
      />
      <Helmet>
        <script type="application/ld+json" data-seo-website="true">
          {JSON.stringify(websiteSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json" data-seo-faq-home="true">
            {JSON.stringify(faqSchema)}
          </script>
        )}
        {localBusinessSchema && (
          <script type="application/ld+json" data-seo-localbusiness="true">
            {JSON.stringify(localBusinessSchema)}
          </script>
        )}
      </Helmet>
    </>
  );
}
