import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';

/**
 * B2CSeo Component
 * Simplified SEO component for B2C pages with custom titles/descriptions
 * Uses DOM injection workaround for canonical/hreflang (react-helmet-async v2 issue)
 */
export default function B2CSeo({ 
  title, 
  description, 
  canonicalUrl, 
  ruUrl, 
  uzUrl,
  noindex = false 
}) {
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
  const defaultUrl = ruUrl; // x-default always points to RU
  
  // Workaround: Inject SEO tags via DOM
  useEffect(() => {
    // Remove old SEO tags
    document.querySelectorAll('[data-b2c-seo]').forEach(el => el.remove());
    
    // Add canonical
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    canonical.setAttribute('data-b2c-seo', 'true');
    document.head.appendChild(canonical);
    
    // Add hreflang ru
    const hreflangRu = document.createElement('link');
    hreflangRu.rel = 'alternate';
    hreflangRu.hreflang = HREFLANG_MAP.ru;
    hreflangRu.href = ruUrl;
    hreflangRu.setAttribute('data-b2c-seo', 'true');
    document.head.appendChild(hreflangRu);
    
    // Add hreflang uz
    const hreflangUz = document.createElement('link');
    hreflangUz.rel = 'alternate';
    hreflangUz.hreflang = HREFLANG_MAP.uz;
    hreflangUz.href = uzUrl;
    hreflangUz.setAttribute('data-b2c-seo', 'true');
    document.head.appendChild(hreflangUz);
    
    // Add hreflang x-default
    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = defaultUrl;
    hreflangDefault.setAttribute('data-b2c-seo', 'true');
    document.head.appendChild(hreflangDefault);
    
    // Add robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.setAttribute('data-b2c-seo', 'true');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = robotsContent;
    
    return () => {
      document.querySelectorAll('[data-b2c-seo]').forEach(el => el.remove());
    };
  }, [canonicalUrl, ruUrl, uzUrl, defaultUrl, robotsContent]);
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Graver.uz" />
    </Helmet>
  );
}
