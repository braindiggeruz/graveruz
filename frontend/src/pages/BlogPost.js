import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';
import { getPostBySlug, getAlternateSlug } from '../data/blogPosts';

function BlogPostPage() {
  const params = useParams();
  const locale = params.locale || 'ru';
  const slug = params.slug || '';
  const post = getPostBySlug(locale, slug);
  const isRu = locale === 'ru';

  const canonicalUrl = post ? BASE_URL + '/' + locale + '/blog/' + slug : '';
  const altSlug = slug ? getAlternateSlug(slug) : null;
  const altLocale = isRu ? 'uz' : 'ru';
  const altUrl = altSlug ? BASE_URL + '/' + altLocale + '/blog/' + altSlug : null;
  const ruUrl = isRu ? canonicalUrl : altUrl;
  const uzUrl = isRu ? altUrl : canonicalUrl;

  useEffect(function addSeoTags() {
    if (!post) return;
    var oldTags = document.querySelectorAll('[data-seo-blog]');
    oldTags.forEach(function(el) { el.remove(); });
    
    var can = document.createElement('link');
    can.rel = 'canonical';
    can.href = canonicalUrl;
    can.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(can);
    
    if (ruUrl) {
      var hru = document.createElement('link');
      hru.rel = 'alternate';
      hru.hreflang = HREFLANG_MAP.ru;
      hru.href = ruUrl;
      hru.setAttribute('data-seo-blog', 'true');
      document.head.appendChild(hru);
    }
    if (uzUrl) {
      var huz = document.createElement('link');
      huz.rel = 'alternate';
      huz.hreflang = HREFLANG_MAP.uz;
      huz.href = uzUrl;
      huz.setAttribute('data-seo-blog', 'true');
      document.head.appendChild(huz);
    }
    var hdef = document.createElement('link');
    hdef.rel = 'alternate';
    hdef.hreflang = 'x-default';
    hdef.href = ruUrl || canonicalUrl;
    hdef.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(hdef);
    
    return function cleanup() {
      document.querySelectorAll('[data-seo-blog]').forEach(function(el) { el.remove(); });
    };
  }, [post, canonicalUrl, ruUrl, uzUrl]);

  if (!post) {
    return React.createElement(Navigate, { to: '/' + locale + '/blog', replace: true });
  }

  var schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Graver.uz" },
    publisher: { "@type": "Organization", name: "Graver.uz", url: BASE_URL }
  };

  var services = isRu ? [
    { href: '/' + locale + '/catalog-products', label: 'Каталог продукции' },
    { href: '/' + locale + '/watches-with-logo', label: 'Часы с логотипом' },
    { href: '/' + locale + '/lighters-engraving', label: 'Зажигалки с гравировкой' },
    { href: '/' + locale + '/engraved-gifts', label: 'Подарки с гравировкой' }
  ] : [
    { href: '/' + locale + '/mahsulotlar-katalogi', label: 'Mahsulotlar katalogi' },
    { href: '/' + locale + '/logotipli-soat', label: 'Logotipli soat' },
    { href: '/' + locale + '/gravirovkali-zajigalka', label: 'Gravirovkali zajigalka' },
    { href: '/' + locale + '/gravirovkali-sovgalar', label: "Gravirovkali sovg'alar" }
  ];

  var dateStr = new Date(post.date).toLocaleDateString(isRu ? 'ru-RU' : 'uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

  var contentParts = [];
  if (post.content) {
    var lines = post.content.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln.indexOf('# ') === 0) {
        contentParts.push(React.createElement('h2', { key: 'h-' + i, className: 'text-2xl font-bold text-white mt-6 mb-3' }, ln.substring(2)));
      } else if (ln.indexOf('## ') === 0) {
        contentParts.push(React.createElement('h3', { key: 'hh-' + i, className: 'text-xl font-bold text-white mt-4 mb-2' }, ln.substring(3)));
      } else if (ln.indexOf('- ') === 0) {
        contentParts.push(React.createElement('li', { key: 'li-' + i, className: 'text-gray-300 ml-4 my-1' }, ln.substring(2)));
      } else if (ln.trim()) {
        contentParts.push(React.createElement('p', { key: 'p-' + i, className: 'text-gray-300 leading-relaxed my-3' }, ln));
      }
    }
  }

  return React.createElement('div', { className: 'min-h-screen bg-black text-white' },
    React.createElement(Helmet, null,
      React.createElement('title', null, post.title + ' — Graver.uz'),
      React.createElement('meta', { name: 'description', content: post.description }),
      React.createElement('meta', { name: 'robots', content: 'index, follow' }),
      React.createElement('meta', { property: 'og:title', content: post.title }),
      React.createElement('meta', { property: 'og:description', content: post.description }),
      React.createElement('script', { type: 'application/ld+json' }, JSON.stringify(schema))
    ),
    React.createElement('header', { className: 'fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex justify-between items-center py-4' },
          React.createElement(Link, { to: '/' + locale, className: 'flex items-center space-x-2' },
            React.createElement('div', { className: 'w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center' },
              React.createElement('span', { className: 'text-white font-bold text-xl' }, 'G')
            ),
            React.createElement('span', { className: 'text-2xl font-bold text-white' }, 'Graver', React.createElement('span', { className: 'text-teal-500' }, '.uz'))
          ),
          React.createElement(Link, { to: '/' + locale + '/blog', className: 'text-gray-300 hover:text-teal-500 transition flex items-center' },
            React.createElement(ArrowLeft, { size: 18, className: 'mr-2' }),
            isRu ? 'Назад к блогу' : 'Blogga qaytish'
          )
        )
      )
    ),
    React.createElement('main', { className: 'pt-24 pb-20' },
      React.createElement('article', { className: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8', 'data-testid': 'blog-post-content' },
        React.createElement('header', { className: 'mb-8' },
          React.createElement('div', { className: 'flex items-center text-sm text-gray-500 mb-4' },
            React.createElement(Calendar, { size: 14, className: 'mr-2' }),
            dateStr
          ),
          React.createElement('h1', { className: 'text-3xl md:text-4xl font-bold text-white mb-4' }, post.title),
          React.createElement('p', { className: 'text-xl text-gray-400' }, post.description),
          post.keywords && post.keywords.length > 0 && React.createElement('div', { className: 'flex flex-wrap gap-2 mt-4' },
            post.keywords.map(function(kw, idx) {
              return React.createElement('span', { key: idx, className: 'inline-flex items-center text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded' },
                React.createElement(Tag, { size: 10, className: 'mr-1' }),
                kw
              );
            })
          )
        ),
        React.createElement('div', { className: 'prose prose-invert max-w-none' }, contentParts),
        React.createElement('div', { className: 'mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl' },
          React.createElement('h3', { className: 'text-lg font-bold text-white mb-4' }, isRu ? 'Связанные услуги' : "Bog'liq xizmatlar"),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            services.map(function(s, idx) {
              return React.createElement(Link, { key: idx, to: s.href, className: 'text-teal-500 hover:text-teal-400 text-sm transition' }, '→ ' + s.label);
            })
          )
        ),
        React.createElement('div', { className: 'mt-8 text-center' },
          React.createElement(Link, { to: '/' + locale + '/blog', className: 'inline-flex items-center text-gray-400 hover:text-teal-500 transition' },
            React.createElement(ArrowLeft, { size: 16, className: 'mr-2' }),
            isRu ? 'Все статьи' : 'Barcha maqolalar'
          )
        )
      )
    ),
    React.createElement('footer', { className: 'bg-black border-t border-gray-800 py-8' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm' },
        React.createElement('p', null, '© 2025 Graver.uz — ' + (isRu ? 'Премиальная лазерная гравировка в Ташкенте' : 'Toshkentda premium lazer gravyurasi'))
      )
    )
  );
}

export default BlogPostPage;
