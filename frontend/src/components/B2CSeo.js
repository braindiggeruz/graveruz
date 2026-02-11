import React from 'react';
import SeoMeta from './SeoMeta';

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
  locale = 'ru',
  noindex = false 
}) {
  return (
    <SeoMeta
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      ruUrl={ruUrl}
      uzUrl={uzUrl}
      locale={locale}
      noindex={noindex}
      ogType="website"
    />
  );
}
