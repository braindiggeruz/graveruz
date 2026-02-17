import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, ChevronRight, Star, TrendingUp, Clock, FolderOpen, Search, ChevronLeft } from 'lucide-react';
import { useI18n } from '../i18n';
import { BASE_URL } from '../config/seo';
import { getPostsByLocale, getPostBySlug, getPostReadTimeMinutes, getCategorySummary, validateBlogData } from '../data/blogPosts';
import { getBlogImageForSlug, getBlogImageMappingCoverage, getResponsiveBlogImageForSlug } from '../data/blogImages';
import SeoMeta from '../components/SeoMeta';

// Featured/foundational article slugs for "Popular" section
const featuredSlugsRu = [
  'kak-vybrat-korporativnyj-podarok',
  'lazernaya-gravirovka-podarkov',
  'podarochnye-nabory-s-logotipom',
  'brendirovanie-suvenirov',
  'chek-list-zakupshchika-podarkov',
  'top-idei-podarkov-na-novyj-god'
];

const featuredSlugsUz = [
  'korporativ-sovgani-qanday-tanlash',
  'lazer-gravirovka-sovgalar',
  'logotipli-sovga-toplami',
  'suvenir-brendlash',
  'xaridor-chek-listi-b2b',
  'yangi-yil-sovga-goyalari'
];

export default function BlogIndex() {
  const { locale } = useParams();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const posts = getPostsByLocale(locale);
  const POSTS_PER_PAGE = 12;

  const isRu = locale === 'ru';
  const pageTitle = isRu ? 'Блог — Graver.uz' : 'Blog — Graver.uz';
  const pageDescription = isRu 
    ? 'Статьи о корпоративных подарках, лазерной гравировке и брендировании в Ташкенте.'
    : "Toshkentda korporativ sovg'alar, lazer gravyurasi va brendlash haqida maqolalar.";

  // Get featured posts for "Popular" section
  const featuredSlugs = isRu ? featuredSlugsRu : featuredSlugsUz;
  const featuredPosts = featuredSlugs
    .map(slug => getPostBySlug(locale, slug))
    .filter(Boolean);

  // Get normalized dynamic categories for hub structure
  const categories = useMemo(() => getCategorySummary(locale, 4), [locale]);
  
  // Get latest 3 posts (sorted by date)
  const latestPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const moneyHubLinks = isRu
    ? [
      { href: `/${locale}/catalog-products`, label: 'Корпоративные подарки с логотипом' },
      { href: `/${locale}/engraved-gifts`, label: 'Подарки с гравировкой на заказ' },
      { href: `/${locale}/watches-with-logo`, label: 'Часы с логотипом компании' },
      { href: `/${locale}/products/lighters`, label: 'Зажигалки с логотипом и гравировкой' }
    ]
    : [
      { href: `/${locale}/mahsulotlar-katalogi`, label: "Logotipli korporativ sovg'alar" },
      { href: `/${locale}/gravirovkali-sovgalar`, label: "Buyurtma asosida gravirovkali sovg'alar" },
      { href: `/${locale}/logotipli-soat`, label: 'Kompaniya logotipi bilan soatlar' },
      { href: `/${locale}/products/lighters`, label: 'Logotip va gravyurali zajigalkalar' }
    ];

  const canonicalUrl = `${BASE_URL}/${locale}/blog/`;
  const ruUrl = `${BASE_URL}/ru/blog/`;
  const uzUrl = `${BASE_URL}/uz/blog/`;
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return sortedPosts;
    }

    return sortedPosts.filter((post) => {
      const title = (post.title || '').toLowerCase();
      const description = (post.description || '').toLowerCase();
      return title.includes(query) || description.includes(query);
    });
  }, [searchQuery, sortedPosts]);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const getBlogCardImage = (post) => getResponsiveBlogImageForSlug(post.slug);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const currentPosts = getPostsByLocale(locale);
    const coverage = getBlogImageMappingCoverage(currentPosts.map((post) => post.slug));
    const validation = validateBlogData(locale);

    if (coverage.missing.length > 0) {
      console.warn('[BlogIndex] Missing mapped images for slugs:', coverage.missing);
    }

    if (!validation.isValid) {
      console.warn('[BlogIndex] Blog data validation issues:', {
        locale: validation.locale,
        duplicateSlugs: validation.duplicateSlugs,
        invalidPosts: validation.invalid,
        missingRelatedRefs: validation.missingRelatedRefs,
        sampleErrors: validation.errors.slice(0, 5),
      });
    }
  }, [locale]);

  useEffect(() => {
    const oldTags = document.querySelectorAll('[data-seo-blog-index-meta]');
    oldTags.forEach((el) => el.remove());

    const hasHelmetRobots = document.head.querySelector('meta[name="robots"][data-rh="true"]');
    const hasHelmetDescription = document.head.querySelector('meta[name="description"][data-rh="true"]');
    const hasHelmetCanonical = document.head.querySelector('link[rel="canonical"][data-rh="true"]');
    const hasHelmetRuAlt = document.head.querySelector('link[rel="alternate"][hreflang="ru-RU"][data-rh="true"]');
    const hasHelmetUzAlt = document.head.querySelector('link[rel="alternate"][hreflang="uz-UZ"][data-rh="true"]');
    const hasHelmetDefaultAlt = document.head.querySelector('link[rel="alternate"][hreflang="x-default"][data-rh="true"]');

    if (hasHelmetRobots && hasHelmetDescription && hasHelmetCanonical && hasHelmetRuAlt && hasHelmetUzAlt && hasHelmetDefaultAlt) {
      return;
    }

    const appendMeta = (attr, key, value) => {
      if (!value) return;
      const existing = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (existing) return;
      const tag = document.createElement('meta');
      tag.setAttribute(attr, key);
      tag.setAttribute('content', value);
      tag.setAttribute('data-seo-blog-index-meta', 'true');
      document.head.appendChild(tag);
    };

    const appendLink = (rel, href, extraAttrs) => {
      if (!href) return;
      let existing = null;
      if (extraAttrs && extraAttrs.hreflang) {
        existing = document.head.querySelector(`link[rel="${rel}"][hreflang="${extraAttrs.hreflang}"]`);
      } else {
        existing = document.head.querySelector(`link[rel="${rel}"]`);
      }
      if (existing) return;
      const tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      tag.setAttribute('href', href);
      tag.setAttribute('data-seo-blog-index-meta', 'true');
      if (extraAttrs) {
        Object.keys(extraAttrs).forEach((key) => {
          if (extraAttrs[key]) {
            tag.setAttribute(key, extraAttrs[key]);
          }
        });
      }
      document.head.appendChild(tag);
    };

    document.title = pageTitle;
    appendMeta('name', 'description', pageDescription);
    appendMeta('name', 'robots', 'index, follow');
    appendLink('canonical', canonicalUrl);
    appendLink('alternate', ruUrl, { hreflang: 'ru-RU' });
    appendLink('alternate', uzUrl, { hreflang: 'uz-UZ' });
    appendLink('alternate', ruUrl || canonicalUrl, { hreflang: 'x-default' });
    appendMeta('property', 'og:title', pageTitle);
    appendMeta('property', 'og:description', pageDescription);
    appendMeta('property', 'og:type', 'website');
    appendMeta('property', 'og:url', canonicalUrl);
    appendMeta('property', 'og:image', `${BASE_URL}/og-blog.png`);
    appendMeta('property', 'og:site_name', 'Graver.uz');
    appendMeta('property', 'og:locale', isRu ? 'ru_RU' : 'uz_UZ');
    appendMeta('name', 'twitter:card', 'summary_large_image');
    appendMeta('name', 'twitter:title', pageTitle);
    appendMeta('name', 'twitter:description', pageDescription);
    appendMeta('name', 'twitter:image', `${BASE_URL}/og-blog.png`);
  }, [isRu, pageTitle, pageDescription, canonicalUrl, ruUrl, uzUrl]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": isRu ? 'Главная' : 'Bosh sahifa', "item": `${BASE_URL}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": isRu ? 'Блог' : 'Blog', "item": canonicalUrl }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isRu ? 'Список статей блога Graver.uz' : 'Graver.uz blog maqolalari ro‘yxati',
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": sortedPosts.length,
    "itemListElement": sortedPosts.map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BASE_URL}/${locale}/blog/${post.slug}`,
      "name": post.title
    }))
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": canonicalUrl,
    "inLanguage": isRu ? 'ru' : 'uz',
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": sortedPosts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${BASE_URL}/${locale}/blog/${post.slug}`,
        "name": post.title
      }))
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SeoMeta
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        ruUrl={ruUrl}
        uzUrl={uzUrl}
        locale={locale}
        ogType="website"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(collectionPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
            </Link>
            <Link 
              to={`/${locale}`}
              className="text-gray-300 hover:text-teal-500 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              {isRu ? 'На главную' : 'Bosh sahifaga'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to={`/${locale}`} className="hover:text-teal-500 transition">
                  {isRu ? 'Главная' : 'Bosh sahifa'}
                </Link>
              </li>
              <li> / </li>
              <li className="text-gray-400">{isRu ? 'Блог' : 'Blog'}</li>
            </ol>
          </nav>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isRu ? 'Блог' : 'Blog'} <span className="text-teal-500">Graver.uz</span>
            </h1>
            <p className="text-xl text-gray-400">
              {isRu 
                ? 'Статьи о корпоративных подарках и брендировании'
                : "Korporativ sovg'alar va brendlash haqida maqolalar"}
            </p>
          </div>

          {/* Featured/Recommended Articles Section */}
          {featuredPosts.length > 0 && (
            <div className="mb-12 p-6 bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-700/30 rounded-xl" data-testid="featured-articles-section">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star size={18} className="text-teal-400" />
                {isRu ? 'Рекомендуемые статьи' : 'Tavsiya etilgan maqolalar'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuredPosts.map((fp, idx) => (
                  <Link
                    key={idx}
                    to={`/${locale}/blog/${fp.slug}`}
                    className="text-teal-400 hover:text-teal-300 transition hover:underline text-sm"
                  >
                    → {fp.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blog Hub Structure (P1.1) - Categories & Latest */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Popular Section */}
            <div className="md:col-span-2 p-6 bg-gray-900/50 border border-gray-800 rounded-xl" data-testid="blog-popular-section">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-500" />
                {isRu ? 'Популярное' : 'Mashhur'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuredPosts.slice(0, 6).map((fp, idx) => (
                  <Link
                    key={idx}
                    to={`/${locale}/blog/${fp.slug}`}
                    className="text-teal-400 hover:text-teal-300 transition hover:underline text-sm"
                  >
                    → {fp.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl" data-testid="blog-categories-section">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FolderOpen size={18} className="text-teal-500" />
                {isRu ? 'Категории' : 'Kategoriyalar'}
              </h2>
              <ul className="space-y-2">
                {categories.map((cat, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{cat.name}</span>
                    <span className="text-gray-500 bg-gray-800 px-2 py-0.5 rounded text-xs">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Latest Posts Section */}
          <div className="mb-12 p-6 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl" data-testid="blog-latest-section">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-teal-500" />
              {isRu ? 'Последние статьи' : "So'nggi maqolalar"}
            </h2>
            <div className="space-y-3">
              {latestPosts.map((post, idx) => (
                <Link
                  key={idx}
                  to={`/${locale}/blog/${post.slug}`}
                  className="flex justify-between items-center group"
                >
                  <span className="text-teal-400 group-hover:text-teal-300 transition text-sm">→ {post.title}</span>
                  <time className="text-gray-500 text-xs">
                    {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', { month: 'short', day: 'numeric' })}
                  </time>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl" data-testid="blog-money-links-section">
            <h2 className="text-lg font-bold text-white mb-4">
              {isRu ? 'Быстрый переход к услугам' : 'Xizmatlarga tezkor o\'tish'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moneyHubLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.href}
                  className="text-teal-400 hover:text-teal-300 transition hover:underline text-sm"
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* All Posts Section */}
          <h2 className="text-2xl font-bold text-white mb-6">{isRu ? 'Все статьи' : 'Barcha maqolalar'}</h2>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder={isRu ? 'Поиск по заголовку или описанию…' : 'Sarlavha yoki tavsif bo‘yicha qidirish…'}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
              aria-label={isRu ? 'Поиск статей' : 'Maqolalarni qidirish'}
            />
          </div>

          {paginatedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {isRu ? 'По вашему запросу ничего не найдено' : "So‘rovingiz bo‘yicha maqolalar topilmadi"}
              </p>
            </div>
          ) : (
            <div className="space-y-6" data-testid="blog-posts-list">
              {paginatedPosts.map((post, index) => {
                const image = getBlogCardImage(post);

                return (
                <Link
                  key={post.slug}
                  to={`/${locale}/blog/${post.slug}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 transition group"
                  data-testid={`blog-post-card-${startIndex + index + 1}`}
                >
                  <div className="relative aspect-[16/9] sm:aspect-[16/6] bg-gray-800 overflow-hidden">
                    <picture>
                      {image.avifSrcSet ? (
                        <source
                          type="image/avif"
                          srcSet={image.avifSrcSet}
                          sizes={image.sizes}
                        />
                      ) : null}
                      {image.webpSrcSet ? (
                        <source
                          type="image/webp"
                          srcSet={image.webpSrcSet}
                          sizes={image.sizes}
                        />
                      ) : null}
                      <img
                        src={image.fallbackSrc || getBlogImageForSlug(post.slug)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading={index < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        onError={(event) => {
                          const target = event.currentTarget;
                          const fallback = getBlogImageForSlug(post.slug);
                          if (target.src.endsWith(fallback)) {
                            return;
                          }
                          target.src = fallback;
                        }}
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={14} className="mr-2" />
                      {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      <span className="mx-2">•</span>
                      <Clock size={14} className="mr-1" />
                      {getPostReadTimeMinutes(post)} {isRu ? 'мин чтения' : 'daq o‘qish'}
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-teal-500 transition mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4">{post.description}</p>
                    <span className="text-teal-500 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                      {isRu ? 'Читать' : "O'qish"}
                      <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </Link>
                );
              })}
            </div>
          )}

          {filteredPosts.length > POSTS_PER_PAGE && (
            <div className="mt-8 flex items-center justify-center gap-2" data-testid="blog-pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-teal-500 hover:text-teal-400 transition"
                aria-label={isRu ? 'Предыдущая страница' : 'Oldingi sahifa'}
              >
                <ChevronLeft size={16} className="mr-1" />
                {isRu ? 'Назад' : 'Orqaga'}
              </button>

              <span className="text-sm text-gray-400 px-2">
                {isRu ? `Страница ${safePage} из ${totalPages}` : `Sahifa ${safePage} / ${totalPages}`}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-teal-500 hover:text-teal-400 transition"
                aria-label={isRu ? 'Следующая страница' : 'Keyingi sahifa'}
              >
                {isRu ? 'Вперёд' : 'Oldinga'}
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Graver.uz — {isRu ? 'Премиальная лазерная гравировка в Ташкенте' : "Toshkentda premium lazer gravyurasi"}</p>
        </div>
      </footer>
    </div>
  );
}
