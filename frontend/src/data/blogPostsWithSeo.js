import {
  blogPosts,
  getPostsByLocale,
  getPostBySlug,
  getAlternateSlug,
  getRelatedPosts,
  getAllSlugs,
} from './blogPosts';
import { blogSeoOverrides, getSeoOverride, getFaqData } from './blogSeoOverrides';

function stripBrandSuffix(value) {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/\s+—\s*Graver\.uz\s*$/i, '').trim();
}

export function getPostBySlugWithSeo(locale, slug) {
  const post = getPostBySlug(locale, slug);
  const seo = getSeoOverride(locale, slug);

  if (!post && !seo) return null;

  if (!post && seo) {
    return {
      slug,
      title: stripBrandSuffix(seo.title || seo.titleTag || seo.ogTitle || slug),
      description: seo.description || seo.ogDescription || '',
      date: new Date().toISOString(),
      keywords: [],
      relatedPosts: seo.relatedSlugs || [],
      contentHtml: '',
      content: '',
      seoOverride: seo,
    };
  }

  if (!seo) return post;

  return {
    ...post,
    title: stripBrandSuffix(seo.title || seo.titleTag || seo.ogTitle || post.title),
    description: seo.description || seo.ogDescription || post.description,
    relatedPosts: seo.relatedSlugs || post.relatedPosts || [],
    seoOverride: seo,
  };
}

export {
  blogPosts,
  blogSeoOverrides,
  getPostsByLocale,
  getPostBySlug,
  getAlternateSlug,
  getRelatedPosts,
  getAllSlugs,
  getSeoOverride,
  getFaqData,
};
