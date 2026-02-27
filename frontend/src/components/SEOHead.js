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
  
  // Organization Schema - for homepage
  const organizationSchema = page === 'home' ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Graver.uz",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "description": locale === 'ru' 
      ? "Премиальная лазерная гравировка для бизнеса в Ташкенте. Корпоративные подарки, мерч, сувениры с логотипом на заказ."
      : "Toshkentda biznes uchun premium lazer gravyurasi. Korporativ sovgalar, merch, logotipli suvenirlar buyurtmasi.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": locale === 'ru' ? "ул. Мукими" : "Mukimi ko'chasi",
      "addressLocality": "Tashkent",
      "addressCountry": "UZ"
    },
    "telephone": "+998 77 080 22 88",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+998 77 080 22 88",
      "url": "https://t.me/GraverAdm"
    },
    "sameAs": [
      "https://t.me/GraverAdm",
      "https://instagram.com/graver.uz"
    ]
  } : null;
  
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
        isContactsPage={page === 'contacts'}
        showRssLinks={page === 'home'}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        {organizationSchema && (
          <script type="application/ld+json">
            {JSON.stringify(organizationSchema)}
          </script>
        )}
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>
    </>
  );
}
