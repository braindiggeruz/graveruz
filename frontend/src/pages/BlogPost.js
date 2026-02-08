import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';
import { getPostBySlug, getAlternateSlug, blogPosts } from '../data/blogPosts';
import { getSeoOverride, getFaqData } from '../data/blogSeoOverrides';

function BlogPostPage() {
  const params = useParams();
  const locale = params.locale || 'ru';
  const slug = params.slug || '';
  const post = getPostBySlug(locale, slug);
  const isRu = locale === 'ru';
  
  // Get SEO override for this post
  const seoOverride = getSeoOverride(locale, slug);

  const canonicalUrl = post ? BASE_URL + '/' + locale + '/blog/' + slug : '';
  const altSlug = slug ? getAlternateSlug(slug) : null;
  const altLocale = isRu ? 'uz' : 'ru';
  const altUrl = altSlug ? BASE_URL + '/' + altLocale + '/blog/' + altSlug : null;
  const ruUrl = isRu ? canonicalUrl : altUrl;
  const uzUrl = isRu ? altUrl : canonicalUrl;

  // Determine title: use override if exists, otherwise default
  const pageTitle = seoOverride?.titleTag || (post ? post.title + ' — Graver.uz' : 'Graver.uz');

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

    // Inject Article JSON-LD
    var articleLd = document.createElement('script');
    articleLd.type = 'application/ld+json';
    articleLd.setAttribute('data-seo-blog', 'true');
    articleLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      image: BASE_URL + '/og-blog.png',
      datePublished: post.date,
      dateModified: post.date,
      url: canonicalUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      author: { "@type": "Organization", name: "Graver.uz", url: BASE_URL },
      publisher: { 
        "@type": "Organization", 
        name: "Graver.uz", 
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: BASE_URL + '/og-blog.png'
        }
      },
      inLanguage: locale === 'ru' ? "ru" : "uz"
    });
    document.head.appendChild(articleLd);

    // Inject BreadcrumbList JSON-LD
    var isRuLang = locale === 'ru';
    var breadcrumbLd = document.createElement('script');
    breadcrumbLd.type = 'application/ld+json';
    breadcrumbLd.setAttribute('data-seo-blog', 'true');
    breadcrumbLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isRuLang ? "Главная" : "Bosh sahifa", item: BASE_URL + "/" + locale },
        { "@type": "ListItem", position: 2, name: isRuLang ? "Блог" : "Blog", item: BASE_URL + "/" + locale + "/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl }
      ]
    });
    document.head.appendChild(breadcrumbLd);
    
    return function cleanup() {
      document.querySelectorAll('[data-seo-blog]').forEach(function(el) { el.remove(); });
    };
  }, [post, canonicalUrl, ruUrl, uzUrl, locale]);

  if (!post) {
    return React.createElement(Navigate, { to: '/' + locale + '/blog', replace: true });
  }

  var services = isRu ? [
    { href: '/' + locale + '/catalog-products', label: 'Каталог продукции', desc: 'Все изделия с лазерной гравировкой' },
    { href: '/' + locale + '/corporate-gifts', label: 'Корпоративные подарки', desc: 'Премиальные наборы с логотипом' },
    { href: '/' + locale + '/awards-medals', label: 'Награды и медали', desc: 'Кубки и медали с гравировкой' },
    { href: '/' + locale + '/branding', label: 'Брендирование', desc: 'Нанесение логотипа на изделия' },
    { href: '/' + locale + '/contacts', label: 'Контакты', desc: 'Связаться с нами' }
  ] : [
    { href: '/' + locale + '/mahsulotlar-katalogi', label: 'Mahsulotlar katalogi', desc: 'Lazer gravyurasi bilan barcha mahsulotlar' },
    { href: '/' + locale + '/korporativ-sovgalar', label: "Korporativ sovg'alar", desc: 'Logotipli premium to\'plamlar' },
    { href: '/' + locale + '/mukofotlar-medallar', label: 'Mukofotlar va medallar', desc: 'Gravyura bilan kubklar' },
    { href: '/' + locale + '/brendlash', label: 'Brendlash', desc: 'Mahsulotlarga logotip qo\'yish' },
    { href: '/' + locale + '/aloqa', label: 'Aloqa', desc: 'Biz bilan bog\'laning' }
  ];

  var dateStr = new Date(post.date).toLocaleDateString(isRu ? 'ru-RU' : 'uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

  // Get related posts from override or fallback to post.relatedPosts
  var relatedSlugs = seoOverride?.relatedSlugs || post.relatedPosts || [];
  var relatedPosts = relatedSlugs
    .map(function(s) { return getPostBySlug(locale, s); })
    .filter(Boolean);

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
      React.createElement('title', null, pageTitle),
      React.createElement('meta', { name: 'description', content: post.description }),
      React.createElement('meta', { name: 'robots', content: 'index, follow' }),
      // Canonical & Hreflang (P0 CRITICAL - must be in Helmet for crawlers)
      React.createElement('link', { rel: 'canonical', href: canonicalUrl }),
      ruUrl && React.createElement('link', { rel: 'alternate', hreflang: 'ru', href: ruUrl }),
      uzUrl && React.createElement('link', { rel: 'alternate', hreflang: 'uz', href: uzUrl }),
      React.createElement('link', { rel: 'alternate', hreflang: 'x-default', href: ruUrl || canonicalUrl }),
      // OpenGraph
      React.createElement('meta', { property: 'og:title', content: post.title }),
      React.createElement('meta', { property: 'og:description', content: post.description }),
      React.createElement('meta', { property: 'og:url', content: canonicalUrl }),
      React.createElement('meta', { property: 'og:type', content: 'article' }),
      React.createElement('meta', { property: 'og:image', content: BASE_URL + '/og-blog.png' }),
      React.createElement('meta', { property: 'og:site_name', content: 'Graver.uz' }),
      React.createElement('meta', { property: 'og:locale', content: isRu ? 'ru_RU' : 'uz_UZ' }),
      // Twitter Card
      React.createElement('meta', { name: 'twitter:card', content: 'summary_large_image' }),
      React.createElement('meta', { name: 'twitter:title', content: post.title }),
      React.createElement('meta', { name: 'twitter:description', content: post.description }),
      React.createElement('meta', { name: 'twitter:image', content: BASE_URL + '/og-blog.png' })
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
        // Breadcrumb navigation
        React.createElement('nav', { className: 'text-sm text-gray-500 mb-6', 'aria-label': 'Breadcrumb' },
          React.createElement('ol', { className: 'flex items-center space-x-2' },
            React.createElement('li', null,
              React.createElement(Link, { to: '/' + locale, className: 'hover:text-teal-500 transition' }, isRu ? 'Главная' : 'Bosh sahifa')
            ),
            React.createElement('li', null, ' / '),
            React.createElement('li', null,
              React.createElement(Link, { to: '/' + locale + '/blog', className: 'hover:text-teal-500 transition' }, isRu ? 'Блог' : 'Blog')
            ),
            React.createElement('li', null, ' / '),
            React.createElement('li', { className: 'text-gray-400 truncate max-w-[200px]' }, post.title)
          )
        ),
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
        // Quick Answer Block (if exists in override)
        seoOverride && seoOverride.quickAnswer && React.createElement('div', { 
          className: 'bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border border-teal-700/50 rounded-xl p-5 mb-8',
          'data-testid': 'quick-answer-block'
        },
          React.createElement('div', { className: 'flex items-start gap-3' },
            React.createElement(Lightbulb, { size: 20, className: 'text-teal-400 mt-0.5 flex-shrink-0' }),
            React.createElement('div', null,
              React.createElement('p', { className: 'text-teal-300 font-semibold mb-1' }, isRu ? 'Быстрый ответ' : 'Tezkor javob'),
              React.createElement('p', { className: 'text-gray-300 leading-relaxed' }, seoOverride.quickAnswer)
            )
          )
        ),
        React.createElement('div', { className: 'prose prose-invert max-w-none' }, contentParts),
        // Related Articles Section (if exists)
        relatedPosts.length > 0 && React.createElement('div', { 
          className: 'mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl',
          'data-testid': 'related-articles-section'
        },
          React.createElement('h3', { className: 'text-lg font-bold text-white mb-4 flex items-center gap-2' },
            React.createElement(BookOpen, { size: 18, className: 'text-teal-500' }),
            isRu ? 'Рекомендуем прочитать' : "Tavsiya etamiz"
          ),
          React.createElement('div', { className: 'space-y-3' },
            relatedPosts.map(function(rp, idx) {
              return React.createElement(Link, { 
                key: idx, 
                to: '/' + locale + '/blog/' + rp.slug, 
                className: 'block text-teal-400 hover:text-teal-300 transition hover:underline'
              }, '→ ' + rp.title);
            })
          )
        ),
        // Related Services Section
        React.createElement('div', { 
          className: 'mt-6 p-6 bg-gray-900 border border-gray-800 rounded-xl',
          'data-testid': 'related-services-section'
        },
          React.createElement('h3', { className: 'text-lg font-bold text-white mb-4' }, isRu ? 'Связанные услуги' : "Bog'liq xizmatlar"),
          React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
            services.map(function(s, idx) {
              return React.createElement(Link, { 
                key: idx, 
                to: s.href, 
                className: 'block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group'
              },
                React.createElement('span', { className: 'text-teal-500 group-hover:text-teal-400 font-medium text-sm' }, '→ ' + s.label),
                s.desc && React.createElement('p', { className: 'text-gray-500 text-xs mt-1' }, s.desc)
              );
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
