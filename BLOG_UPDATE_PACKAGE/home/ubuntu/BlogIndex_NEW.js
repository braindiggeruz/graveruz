import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, ChevronRight, Star, TrendingUp, Clock, FolderOpen, Search, ChevronLeft } from 'lucide-react';
import { useI18n } from '../i18n';
import { BASE_URL } from '../config/seo';
import { getPostsByLocale, getPostBySlug } from '../data/blogPosts';
import SeoMeta from '../components/SeoMeta';
import BlogCard from '../components/BlogCard';

// Featured/foundational article slugs for "Popular" section
const featuredSlugsRu = [
  'corporate-gift-article',
  'laser-engraving-gifts-draft',
  'article-2',
  'souvenir-branding-ru',
  'article-4',
  'corporate-gifts-hr-guide'
];

const featuredSlugsUz = [
  'korporativ-sovg-ani-qanday-tanlash-kerak',
  'article-27',
  'article-28',
  'suvenirlarni-brendlash',
  'welcome-pack-uz',
  'xodimlarga-sovg-alar-hr-qollanma-uz'
];

// Categories for blog hub structure
const categoriesRu = [
  { name: 'Гайды', slug: 'guides', count: 15 },
  { name: 'Брендирование', slug: 'branding', count: 8 },
  { name: 'Праздники', slug: 'holidays', count: 5 },
  { name: 'Бизнес', slug: 'business', count: 8 }
];

const categoriesUz = [
  { name: "Qo'llanmalar", slug: 'guides', count: 14 },
  { name: 'Brendlash', slug: 'branding', count: 7 },
  { name: 'Bayramlar', slug: 'holidays', count: 4 },
  { name: 'Biznes', slug: 'business', count: 7 }
];

const POSTS_PER_PAGE = 12;

export default function BlogIndex() {
  const { locale } = useParams();
  const { t } = useI18n();
  const posts = getPostsByLocale(locale);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const isRu = locale === 'ru';
  const pageTitle = isRu ? 'Блог — Graver.uz' : 'Blog — Graver.uz';
  const pageDescription = isRu 
    ? 'Статьи о корпоративных подарках, брендировании и лазерной гравировке. Экспертные советы и идеи для вашего бизнеса.'
    : "Korporativ sovg'alar, brendlash va lazer gravyurasi haqida maqolalar. Biznesingiz uchun ekspert maslahatlari va g'oyalar.";

  const featuredSlugs = isRu ? featuredSlugsRu : featuredSlugsUz;
  const categories = isRu ? categoriesRu : categoriesUz;

  // Get featured posts
  const featuredPosts = featuredSlugs
    .map(slug => getPostBySlug(slug, locale))
    .filter(Boolean);

  // Get latest posts (top 5)
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Filter posts by search query
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <SeoMeta
        title={pageTitle}
        description={pageDescription}
        url={`${BASE_URL}/${locale}/blog`}
        type="website"
      />

      <Helmet>
        <link rel="canonical" href={`${BASE_URL}/${locale}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={`${BASE_URL}/${locale}/blog`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
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

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isRu ? 'Блог' : 'Blog'} <span className="text-teal-500">Graver.uz</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              {isRu 
                ? 'Статьи о корпоративных подарках и брендировании'
                : "Korporativ sovg'alar va brendlash haqida maqolalar"}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={isRu ? 'Поиск статей...' : "Maqolalarni qidirish..."}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Featured/Recommended Articles Section */}
          {featuredPosts.length > 0 && (
            <div className="mb-12 p-6 bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-700/30 rounded-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star size={18} className="text-teal-400" />
                {isRu ? 'Рекомендуемые статьи' : 'Tavsiya etilgan maqolalar'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

          {/* Blog Hub Structure - Categories & Latest */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Popular Section */}
            <div className="lg:col-span-2 p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
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
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
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
          <div className="mb-12 p-6 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl">
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

          {/* All Posts Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isRu ? 'Все статьи' : 'Barcha maqolalar'}
            </h2>
            <p className="text-gray-400">
              {isRu 
                ? `Найдено статей: ${filteredPosts.length}` 
                : `Topilgan maqolalar: ${filteredPosts.length}`}
            </p>
          </div>

          {currentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {isRu ? 'Статьи не найдены' : "Maqolalar topilmadi"}
              </p>
            </div>
          ) : (
            <>
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    isRu={isRu}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-teal-500'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              )}
            </>
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
