import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';
import { getPostBySlug, getAlternateSlug } from '../data/blogPosts';

export default function BlogPost() {
  const params = useParams();
  const locale = params.locale;
  const slug = params.slug;
  const post = getPostBySlug(locale, slug);

  const isRu = locale === 'ru';
  
  // Build URLs without template literals
  var canonicalUrl = post ? (BASE_URL + '/' + locale + '/blog/' + slug) : '';
  var alternateSlug = slug ? getAlternateSlug(slug) : null;
  var altLocale = locale === 'ru' ? 'uz' : 'ru';
  var alternateUrl = alternateSlug ? (BASE_URL + '/' + altLocale + '/blog/' + alternateSlug) : null;
  var ruUrl = locale === 'ru' ? canonicalUrl : alternateUrl;
  var uzUrl = locale === 'uz' ? canonicalUrl : alternateUrl;

  // SEO tags via useEffect
  React.useEffect(function() {
    if (!post) return;
    
    // Remove old tags
    var oldTags = document.querySelectorAll('[data-seo-blog]');
    for (var i = 0; i < oldTags.length; i++) {
      oldTags[i].remove();
    }
    
    // Canonical
    var canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    canonical.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(canonical);
    
    // Hreflang RU
    if (ruUrl) {
      var hreflangRu = document.createElement('link');
      hreflangRu.rel = 'alternate';
      hreflangRu.hreflang = HREFLANG_MAP.ru;
      hreflangRu.href = ruUrl;
      hreflangRu.setAttribute('data-seo-blog', 'true');
      document.head.appendChild(hreflangRu);
    }
    
    // Hreflang UZ
    if (uzUrl) {
      var hreflangUz = document.createElement('link');
      hreflangUz.rel = 'alternate';
      hreflangUz.hreflang = HREFLANG_MAP.uz;
      hreflangUz.href = uzUrl;
      hreflangUz.setAttribute('data-seo-blog', 'true');
      document.head.appendChild(hreflangUz);
    }
    
    // Hreflang default
    var hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = ruUrl || canonicalUrl;
    hreflangDefault.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(hreflangDefault);
    
    return function() {
      var tags = document.querySelectorAll('[data-seo-blog]');
      for (var j = 0; j < tags.length; j++) {
        tags[j].remove();
      }
    };
  }, [post, canonicalUrl, ruUrl, uzUrl]);

  // Redirect if no post
  if (!post) {
    var redirectPath = '/' + locale + '/blog';
    return React.createElement(Navigate, { to: redirectPath, replace: true });
  }

  // Article schema
  var articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": { "@type": "Organization", "name": "Graver.uz" },
    "publisher": { "@type": "Organization", "name": "Graver.uz", "url": BASE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
  };

  // Related services
  var relatedServices = [];
  if (isRu) {
    relatedServices = [
      { href: '/' + locale + '/catalog-products', label: 'Каталог продукции' },
      { href: '/' + locale + '/watches-with-logo', label: 'Часы с логотипом' },
      { href: '/' + locale + '/lighters-engraving', label: 'Зажигалки с гравировкой' },
      { href: '/' + locale + '/engraved-gifts', label: 'Подарки с гравировкой' }
    ];
  } else {
    relatedServices = [
      { href: '/' + locale + '/mahsulotlar-katalogi', label: 'Mahsulotlar katalogi' },
      { href: '/' + locale + '/logotipli-soat', label: 'Logotipli soat' },
      { href: '/' + locale + '/gravirovkali-zajigalka', label: 'Gravirovkali zajigalka' },
      { href: '/' + locale + '/gravirovkali-sovgalar', label: "Gravirovkali sovg'alar" }
    ];
  }

  var dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };
  var dateLocale = locale === 'ru' ? 'ru-RU' : 'uz-UZ';
  var formattedDate = new Date(post.date).toLocaleDateString(dateLocale, dateOpts);

  // Render markdown simply
  var contentLines = post.content ? post.content.split('\n') : [];
  var contentElements = [];
  for (var k = 0; k < contentLines.length; k++) {
    var line = contentLines[k];
    if (line.indexOf('# ') === 0) {
      contentElements.push(React.createElement('h1', { key: 'h1-' + k, className: 'text-3xl font-bold text-white mt-8 mb-4' }, line.substring(2)));
    } else if (line.indexOf('## ') === 0) {
      contentElements.push(React.createElement('h2', { key: 'h2-' + k, className: 'text-2xl font-bold text-white mt-6 mb-3' }, line.substring(3)));
    } else if (line.indexOf('### ') === 0) {
      contentElements.push(React.createElement('h3', { key: 'h3-' + k, className: 'text-xl font-bold text-white mt-4 mb-2' }, line.substring(4)));
    } else if (line.indexOf('- ') === 0) {
      contentElements.push(React.createElement('li', { key: 'li-' + k, className: 'text-gray-300 ml-4' }, line.substring(2)));
    } else if (line.trim()) {
      contentElements.push(React.createElement('p', { key: 'p-' + k, className: 'text-gray-300 leading-relaxed my-4' }, line));
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <html lang={locale === 'uz' ? 'uz-Latn' : 'ru'} />
        <title>{post.title} — Graver.uz</title>
        <meta name="description" content={post.description} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="article:published_time" content={post.date} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={'/' + locale} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
            </Link>
            <Link 
              to={'/' + locale + '/blog'}
              className="text-gray-300 hover:text-teal-500 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              {isRu ? 'Назад к блогу' : 'Blogga qaytish'}
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="blog-post-content">
          <header className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar size={14} className="mr-2" />
              {formattedDate}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-xl text-gray-400">{post.description}</p>
            
            {post.keywords && post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.keywords.map(function(kw, idx) {
                  return (
                    <span key={idx} className="inline-flex items-center text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                      <Tag size={10} className="mr-1" />
                      {kw}
                    </span>
                  );
                })}
              </div>
            )}
          </header>

          <div className="prose prose-invert max-w-none">
            {contentElements}
          </div>

          <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {isRu ? 'Связанные услуги' : "Bog'liq xizmatlar"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedServices.map(function(service, idx) {
                return (
                  <Link 
                    key={idx}
                    to={service.href}
                    className="text-teal-500 hover:text-teal-400 text-sm transition"
                  >
                    → {service.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              to={'/' + locale + '/blog'}
              className="inline-flex items-center text-gray-400 hover:text-teal-500 transition"
            >
              <ArrowLeft size={16} className="mr-2" />
              {isRu ? 'Все статьи' : 'Barcha maqolalar'}
            </Link>
          </div>
        </article>
      </main>

      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Graver.uz — {isRu ? 'Премиальная лазерная гравировка в Ташкенте' : 'Toshkentda premium lazer gravyurasi'}</p>
        </div>
      </footer>
    </div>
  );
}
