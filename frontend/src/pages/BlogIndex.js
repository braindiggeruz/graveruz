import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, ChevronRight, Star } from 'lucide-react';
import { useI18n } from '../i18n';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';
import { getPostsByLocale, getPostBySlug } from '../data/blogPosts';

// Featured/foundational article slugs for "Recommended" section
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
  const posts = getPostsByLocale(locale);

  const isRu = locale === 'ru';
  const pageTitle = isRu ? 'Блог — Graver.uz' : 'Blog — Graver.uz';
  const pageDescription = isRu 
    ? 'Статьи о корпоративных подарках, лазерной гравировке и брендировании в Ташкенте.'
    : "Toshkentda korporativ sovg'alar, lazer gravyurasi va brendlash haqida maqolalar.";

  // Get featured posts for "Recommended" section
  const featuredSlugs = isRu ? featuredSlugsRu : featuredSlugsUz;
  const featuredPosts = featuredSlugs
    .map(slug => getPostBySlug(locale, slug))
    .filter(Boolean);

  const canonicalUrl = `${BASE_URL}/${locale}/blog`;
  const ruUrl = `${BASE_URL}/ru/blog`;
  const uzUrl = `${BASE_URL}/uz/blog`;

  // SEO tags via useEffect (react-helmet-async link bug workaround)
  React.useEffect(() => {
    document.querySelectorAll('[data-seo-blog]').forEach(el => el.remove());
    
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    canonical.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(canonical);
    
    const hreflangRu = document.createElement('link');
    hreflangRu.rel = 'alternate';
    hreflangRu.hreflang = HREFLANG_MAP.ru;
    hreflangRu.href = ruUrl;
    hreflangRu.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(hreflangRu);
    
    const hreflangUz = document.createElement('link');
    hreflangUz.rel = 'alternate';
    hreflangUz.hreflang = HREFLANG_MAP.uz;
    hreflangUz.href = uzUrl;
    hreflangUz.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(hreflangUz);
    
    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = ruUrl;
    hreflangDefault.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(hreflangDefault);
    
    return () => {
      document.querySelectorAll('[data-seo-blog]').forEach(el => el.remove());
    };
  }, [canonicalUrl, ruUrl, uzUrl]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <html lang={locale === 'uz' ? 'uz-Latn' : 'ru'} />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        {/* Canonical & Hreflang (P0.1 FIX) */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hreflang="ru" href={ruUrl} />
        <link rel="alternate" hreflang="uz" href={uzUrl} />
        <link rel="alternate" hreflang="x-default" href={ruUrl} />
        {/* OpenGraph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.graver-studio.uz/og-blog.png" />
        <meta property="og:site_name" content="Graver.uz" />
        <meta property="og:locale" content={isRu ? 'ru_RU' : 'uz_UZ'} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.graver-studio.uz/og-blog.png" />
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

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {isRu ? 'Статьи скоро появятся' : "Maqolalar tez orada paydo bo'ladi"}
              </p>
            </div>
          ) : (
            <div className="space-y-6" data-testid="blog-posts-list">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/${locale}/blog/${post.slug}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition group"
                  data-testid={`blog-post-card-${index + 1}`}
                >
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="mr-2" />
                    {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-teal-500 transition mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4">{post.description}</p>
                  <span className="text-teal-500 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                    {isRu ? 'Читать' : "O'qish"}
                    <ChevronRight size={16} className="ml-1" />
                  </span>
                </Link>
              ))}
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
