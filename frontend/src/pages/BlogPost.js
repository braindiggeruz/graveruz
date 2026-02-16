import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';
import { ArrowLeft, Calendar, Tag, Lightbulb, BookOpen, HelpCircle } from 'lucide-react';
import { BASE_URL } from '../config/seo';
import { getPostBySlug, getPostsByLocale } from '../data/blogPosts';
import { getSeoOverride, getFaqData } from '../data/blogSeoOverrides';
import { getBlogImageForSlug } from '../data/blogImages';
import { getMappedAlternateSlug } from '../config/blogSlugMap';

function normalizeBlogHref(href, locale) {
  if (!href || typeof href !== 'string') return href;
  if (href.indexOf('/blog/') === 0) return '/' + locale + href;
  if (href.indexOf('https://graver-studio.uz/blog/') === 0) {
    return href.replace('https://graver-studio.uz/blog/', '/' + locale + '/blog/');
  }
  if (href.indexOf('http://graver-studio.uz/blog/') === 0) {
    return href.replace('http://graver-studio.uz/blog/', '/' + locale + '/blog/');
  }
  return href;
}

function normalizeInlineText(text, locale) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, label, href) {
      return '<a href="' + normalizeBlogHref(href, locale) + '">' + label + '</a>';
    });
}

function normalizeHtmlContent(html, locale) {
  if (!html) return html;

  return normalizeInlineText(
    html
      .replace(/href=(['"])\/blog\/([^'"]+)\1/g, function(_, quote, path) {
        return 'href=' + quote + '/' + locale + '/blog/' + path + quote;
      })
      .replace(/href=(['"])https?:\/\/graver-studio\.uz\/blog\/([^'"]+)\1/g, function(_, quote, path) {
        return 'href=' + quote + '/' + locale + '/blog/' + path + quote;
      }),
    locale,
  );
}

function isValidFaqItem(item) {
  if (!item || typeof item.q !== 'string' || typeof item.a !== 'string') return false;
  var q = item.q.trim();
  var a = item.a.trim();
  if (!q || !a) return false;
  return !/sample\s*q\d*/i.test(q + ' ' + a);
}

function BlogPostPage() {
  const params = useParams();
  const locale = params.locale || 'ru';
  const slug = params.slug || '';
  const post = getPostBySlug(locale, slug);
  const isRu = locale === 'ru';
  
  // Get SEO override for this post
  const seoOverride = getSeoOverride(locale, slug);
  // Get FAQ data for FAQPage Schema
  const faqData = (getFaqData(slug) || []).filter(isValidFaqItem);

  const canonicalUrl = post ? BASE_URL + '/' + locale + '/blog/' + slug : '';
  const altSlug = slug ? getMappedAlternateSlug(locale, slug) : null;
  const altLocale = isRu ? 'uz' : 'ru';
  const altUrl = altSlug ? BASE_URL + '/' + altLocale + '/blog/' + altSlug : null;
  const ruUrl = isRu ? canonicalUrl : altUrl;
  const uzUrl = isRu ? altUrl : canonicalUrl;

  // Determine title: use override if exists, otherwise default
  const pageTitle = (seoOverride && (seoOverride.title || seoOverride.titleTag)) || (post ? post.title + ' — Graver.uz' : 'Graver.uz');
  const pageDescription = (seoOverride && (seoOverride.description || seoOverride.ogDescription)) || (post ? post.description : '');
  const pageOgImage = post ? BASE_URL + getBlogImageForSlug(slug) : BASE_URL + '/og-blog.png';

  useEffect(function addSeoTags() {
    if (!post) return;
    var oldTags = document.querySelectorAll('[data-seo-blog]');
    oldTags.forEach(function(el) { el.remove(); });
    var publishedDate = post.date ? new Date(post.date).toISOString() : undefined;
    var isRuLang = locale === 'ru';

    // Inject BlogPosting JSON-LD
    var articleLd = document.createElement('script');
    articleLd.type = 'application/ld+json';
    articleLd.setAttribute('data-seo-blog', 'true');
    articleLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: (seoOverride && (seoOverride.ogTitle || seoOverride.title || seoOverride.titleTag)) || post.title,
      description: (seoOverride && (seoOverride.ogDescription || seoOverride.description)) || post.description,
      url: canonicalUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      inLanguage: locale === 'ru' ? "ru" : "uz",
      datePublished: publishedDate,
      dateModified: publishedDate,
      articleSection: post.category || (isRuLang ? 'Блог' : 'Blog'),
      image: [pageOgImage],
      keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : undefined,
      author: { "@type": "Organization", name: "Graver.uz", url: BASE_URL },
      publisher: {
        "@type": "Organization",
        name: "Graver.uz",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: BASE_URL + '/og-blog.png'
        }
      }
    });
    document.head.appendChild(articleLd);

    // Inject BreadcrumbList JSON-LD
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

    // Inject FAQPage JSON-LD (P1.2)
    if (faqData.length >= 2) {
      var faqLd = document.createElement('script');
      faqLd.type = 'application/ld+json';
      faqLd.setAttribute('data-seo-blog', 'true');
      faqLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map(function(item) {
          return {
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a
            }
          };
        })
      });
      document.head.appendChild(faqLd);
    }
    
    return function cleanup() {
      document.querySelectorAll('[data-seo-blog]').forEach(function(el) { el.remove(); });
    };
  }, [post, canonicalUrl, locale, seoOverride, faqData, pageOgImage]);

  if (!post) {
    return React.createElement(Navigate, { to: '/' + locale + '/blog', replace: true });
  }

  var services = isRu ? [
    { href: '/' + locale + '/catalog-products', label: 'Каталог продукции', desc: 'Все изделия с лазерной гравировкой' },
    { href: '/' + locale + '/watches-with-logo', label: 'Часы с логотипом', desc: 'Премиальные модели с гравировкой' },
    { href: '/' + locale + '/products/lighters', label: 'Зажигалки с гравировкой', desc: 'Zippo-стиль, 1-2 стороны' },
    { href: '/' + locale + '/engraved-gifts', label: 'Подарки с гравировкой', desc: 'Ручки, powerbank, ежедневники' },
    { href: '/' + locale + '/contacts', label: 'Контакты', desc: 'Связаться с нами' }
  ] : [
    { href: '/' + locale + '/mahsulotlar-katalogi', label: 'Mahsulotlar katalogi', desc: 'Lazer gravyurasi bilan barcha mahsulotlar' },
    { href: '/' + locale + '/logotipli-soat', label: 'Logotipli soat', desc: 'Premium modellar va gravyura' },
    { href: '/' + locale + '/products/lighters', label: 'Zajigalkalar', desc: 'Zippo uslubi, 1-2 tomon' },
    { href: '/' + locale + '/gravirovkali-sovgalar', label: "Gravirovkali sovg'alar", desc: 'Ruchka, powerbank, kundaliklar' },
    { href: '/' + locale + '/contacts', label: 'Kontaktlar', desc: 'Biz bilan bog\'laning' }
  ];

  var dateStr = new Date(post.date).toLocaleDateString(isRu ? 'ru-RU' : 'uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

  // Get related posts from override or fallback to post.relatedPosts
  var relatedSlugs = (seoOverride && seoOverride.relatedSlugs) || post.relatedPosts || [];
  var relatedPosts = relatedSlugs
    .map(function(s) { return getPostBySlug(locale, s); })
    .filter(Boolean);

  var allPosts = getPostsByLocale(locale)
    .filter(function(p) { return p.slug !== slug; });

  var recommendedPosts = relatedPosts.slice(0);
  if (recommendedPosts.length < 3) {
    allPosts.forEach(function(p) {
      if (recommendedPosts.length >= 5) return;
      if (!recommendedPosts.some(function(rp) { return rp.slug === p.slug; })) {
        recommendedPosts.push(p);
      }
    });
  } else {
    recommendedPosts = recommendedPosts.slice(0, 5);
  }

  var moneyLinks = isRu ? [
    { href: '/' + locale + '/catalog-products', label: 'Каталог продукции' },
    { href: '/' + locale + '/engraved-gifts', label: 'Подарки с гравировкой' },
    { href: '/' + locale + '/products/lighters', label: 'Зажигалки с гравировкой' }
  ] : [
    { href: '/' + locale + '/mahsulotlar-katalogi', label: 'Mahsulotlar katalogi' },
    { href: '/' + locale + '/gravirovkali-sovgalar', label: "Gravirovkali sovg'alar" },
    { href: '/' + locale + '/products/lighters', label: 'Zajigalkalar' }
  ];

  var utilityLinks = [
    { href: '/' + locale + '/process', label: isRu ? 'Процесс' : 'Jarayon' },
    { href: '/' + locale + '/guarantees', label: isRu ? 'Гарантии' : 'Kafolatlar' },
    { href: '/' + locale + '/contacts', label: isRu ? 'Контакты' : 'Kontaktlar' }
  ];

  var hubLink = {
    href: '/' + locale + '/blog',
    label: isRu ? 'Все статьи блога' : 'Blogdagi barcha maqolalar'
  };

  var contentBody = null;
  if (post && post.contentHtml) {
    contentBody = React.createElement('div', { dangerouslySetInnerHTML: { __html: normalizeHtmlContent(post.contentHtml, locale) } });
  } else if (post && post.content) {
    var contentParts = [];
    var lines = post.content.split('\n');
    var listItems = [];
    var listGroup = 0;

    var flushList = function() {
      if (!listItems.length) return;
      contentParts.push(
        React.createElement('ul', { key: 'ul-' + listGroup, className: 'list-disc ml-6 my-3 space-y-1' },
          listItems.map(function(item, idx) {
            return React.createElement('li', {
              key: 'li-' + listGroup + '-' + idx,
              className: 'text-gray-300',
              dangerouslySetInnerHTML: { __html: normalizeInlineText(item, locale) }
            });
          })
        )
      );
      listItems = [];
      listGroup += 1;
    };

    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln.indexOf('# ') === 0) {
        flushList();
        contentParts.push(React.createElement('h2', { key: 'h-' + i, className: 'text-2xl font-bold text-white mt-6 mb-3', dangerouslySetInnerHTML: { __html: normalizeInlineText(ln.substring(2), locale) } }));
      } else if (ln.indexOf('## ') === 0) {
        flushList();
        contentParts.push(React.createElement('h3', { key: 'hh-' + i, className: 'text-xl font-bold text-white mt-4 mb-2', dangerouslySetInnerHTML: { __html: normalizeInlineText(ln.substring(3), locale) } }));
      } else if (ln.indexOf('- ') === 0) {
        listItems.push(ln.substring(2));
      } else if (ln.trim()) {
        flushList();
        contentParts.push(React.createElement('p', { key: 'p-' + i, className: 'text-gray-300 leading-relaxed my-3', dangerouslySetInnerHTML: { __html: normalizeInlineText(ln, locale) } }));
      } else {
        flushList();
      }
    }
    flushList();
    contentBody = contentParts;
  }

  return React.createElement('div', { className: 'min-h-screen bg-black text-white' },
    React.createElement(SeoMeta, {
      title: pageTitle,
      description: pageDescription,
      canonicalUrl: canonicalUrl,
      ruUrl: ruUrl,
      uzUrl: uzUrl,
      locale: locale,
      ogImage: pageOgImage,
      ogType: 'article'
    }),
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
        React.createElement('div', { className: 'prose prose-invert max-w-none' }, contentBody),
        // Related Articles Section (if exists)
        recommendedPosts.length > 0 && React.createElement('div', { 
          className: 'mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl',
          'data-testid': 'related-articles-section'
        },
          React.createElement('h3', { className: 'text-lg font-bold text-white mb-4 flex items-center gap-2' },
            React.createElement(BookOpen, { size: 18, className: 'text-teal-500' }),
            isRu ? 'Рекомендуем прочитать' : "Tavsiya etamiz"
          ),
          React.createElement('div', { className: 'space-y-3' },
            recommendedPosts.map(function(rp, idx) {
              return React.createElement(Link, { 
                key: idx, 
                to: '/' + locale + '/blog/' + rp.slug, 
                className: 'block text-teal-400 hover:text-teal-300 transition hover:underline'
              }, '→ ' + rp.title);
            })
          )
        ),
        React.createElement('div', {
          className: 'mt-6 p-6 bg-gray-900 border border-gray-800 rounded-xl',
          'data-testid': 'internal-links-section'
        },
          React.createElement('h3', { className: 'text-lg font-bold text-white mb-4' }, isRu ? 'Полезные ссылки' : 'Foydali havolalar'),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
            React.createElement('div', null,
              React.createElement('p', { className: 'text-xs text-gray-500 mb-2' }, isRu ? 'Каталог и услуги' : 'Katalog va xizmatlar'),
              moneyLinks.map(function(link, idx) {
                return React.createElement(Link, {
                  key: 'money-' + idx,
                  to: link.href,
                  className: 'block text-teal-400 hover:text-teal-300 transition hover:underline text-sm'
                }, '→ ' + link.label);
              })
            ),
            React.createElement('div', null,
              React.createElement('p', { className: 'text-xs text-gray-500 mb-2' }, isRu ? 'Процесс и контакты' : "Jarayon va kontaktlar"),
              utilityLinks.map(function(link, idx) {
                return React.createElement(Link, {
                  key: 'util-' + idx,
                  to: link.href,
                  className: 'block text-teal-400 hover:text-teal-300 transition hover:underline text-sm'
                }, '→ ' + link.label);
              })
            ),
            React.createElement('div', null,
              React.createElement('p', { className: 'text-xs text-gray-500 mb-2' }, isRu ? 'Хаб' : 'Xab'),
              React.createElement(Link, {
                to: hubLink.href,
                className: 'block text-teal-400 hover:text-teal-300 transition hover:underline text-sm'
              }, '→ ' + hubLink.label)
            )
          )
        ),
        // FAQ Section (P1.2 - Visual display for users)
        faqData && faqData.length > 0 && React.createElement('div', { 
          className: 'mt-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl',
          'data-testid': 'faq-section'
        },
          React.createElement('h3', { className: 'text-lg font-bold text-white mb-4 flex items-center gap-2' },
            React.createElement(HelpCircle, { size: 18, className: 'text-teal-500' }),
            isRu ? 'Часто задаваемые вопросы' : "Ko'p so'raladigan savollar"
          ),
          React.createElement('div', { className: 'space-y-4' },
            faqData.map(function(item, idx) {
              return React.createElement('div', { key: idx, className: 'border-b border-gray-700 pb-3 last:border-0' },
                React.createElement('p', { className: 'text-white font-medium mb-1' }, item.q),
                React.createElement('p', { className: 'text-gray-400 text-sm' }, item.a)
              );
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
