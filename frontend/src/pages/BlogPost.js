import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';
import { ArrowLeft, Calendar, Tag, Lightbulb, BookOpen, HelpCircle, Clock } from 'lucide-react';
import { BASE_URL } from '../config/seo';
import { getPostBySlug, getPostReadTimeMinutes, getRelatedPostsWeighted } from '../data/blogPosts';
import enhanceTocAndAnchors from './enhanceTocAndAnchors';
import { getSeoOverride, getFaqData } from '../data/blogSeoOverrides';
import { getBlogImageForSlug, getBlogOgImageForSlug, getResponsiveBlogImageForSlug, defaultBlogCover } from '../data/blogImages';
import { getMappedAlternateSlug } from '../config/blogSlugMap';
import { trackViewContent, trackCatalogDownload } from '../utils/pixel';

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

function buildMoneyLinks(locale, slug, isRu) {
  var isWatchTopic = /(chasy|watch|soat)/i.test(slug);
  var isLighterTopic = /(zazhig|lighter|zajig)/i.test(slug);
  var isGiftTopic = /(podar|gift|sovg|welcome|hr|vip)/i.test(slug);

  if (isRu) {
    var ruLinks = [
      { href: '/' + locale + '/catalog-products', label: 'Каталог корпоративных подарков с логотипом' },
      { href: '/' + locale + '/engraved-gifts', label: 'Подарки с гравировкой на заказ' },
      { href: '/' + locale + '/watches-with-logo', label: 'Часы с логотипом компании' },
      { href: '/' + locale + '/products/lighters', label: 'Зажигалки с гравировкой и логотипом' }
    ];

    var preferred = '/'+ locale +'/catalog-products';
    if (isWatchTopic) preferred = '/' + locale + '/watches-with-logo';
    if (isLighterTopic) preferred = '/' + locale + '/products/lighters';
    if (isGiftTopic) preferred = '/' + locale + '/engraved-gifts';

    var preferredLabelRu = 'Корпоративные подарки с логотипом в Ташкенте';
    if (isWatchTopic) preferredLabelRu = 'Часы с логотипом на заказ в Ташкенте';
    if (isLighterTopic) preferredLabelRu = 'Зажигалки с логотипом и гравировкой на заказ';
    if (isGiftTopic) preferredLabelRu = 'Подарки с гравировкой и логотипом для бизнеса';

    return ruLinks.slice().sort(function(a, b) {
      if (a.href === preferred && b.href !== preferred) return -1;
      if (b.href === preferred && a.href !== preferred) return 1;
      return 0;
    }).map(function(link) {
      if (link.href === preferred) {
        return {
          href: link.href,
          label: preferredLabelRu
        };
      }

      return link;
    });
  }

  var uzLinks = [
    { href: '/' + locale + '/mahsulotlar-katalogi', label: 'Logotipli korporativ sovg\'alar katalogi' },
    { href: '/' + locale + '/gravirovkali-sovgalar', label: 'Buyurtma asosida gravirovkali sovg\'alar' },
    { href: '/' + locale + '/logotipli-soat', label: 'Kompaniya logotipi bilan soatlar' },
    { href: '/' + locale + '/products/lighters', label: 'Logotip va gravirovkali zajigalkalar' }
  ];

  var preferredUz = '/' + locale + '/mahsulotlar-katalogi';
  if (isWatchTopic) preferredUz = '/' + locale + '/logotipli-soat';
  if (isLighterTopic) preferredUz = '/' + locale + '/products/lighters';
  if (isGiftTopic) preferredUz = '/' + locale + '/gravirovkali-sovgalar';

  var preferredLabelUz = 'Toshkentda logotipli korporativ sovg\'alar buyurtmasi';
  if (isWatchTopic) preferredLabelUz = 'Toshkentda logotipli soatlar buyurtmasi';
  if (isLighterTopic) preferredLabelUz = 'Logotip va gravyurali zajigalkalarni buyurtma qilish';
  if (isGiftTopic) preferredLabelUz = 'Biznes uchun gravirovkali va logotipli sovg\'alar';

  return uzLinks.slice().sort(function(a, b) {
    if (a.href === preferredUz && b.href !== preferredUz) return -1;
    if (b.href === preferredUz && a.href !== preferredUz) return 1;
    return 0;
  }).map(function(link) {
    if (link.href === preferredUz) {
      return {
        href: link.href,
        label: preferredLabelUz
      };
    }

    return link;
  });
}

function BlogPostPage() {
  // toc is now computed via useMemo (computedToc) instead of useState to avoid setState during render
  const params = useParams();
  const locale = params.locale || 'ru';
  const slug = params.slug || '';
  const post = getPostBySlug(locale, slug);
  const isRu = locale === 'ru';
  
  // P0 FIX: Prevent repeated tracking with useRef
  // trackViewContent should only fire once per slug, not on every render
  const trackedSlugs = React.useRef(new Set());
  
  // Extract primitives from post for tracking (avoids object dep → no infinite re-render)
  const postSlug = post?.slug || '';
  const postTitle = post?.title || '';
  const postCategory = post?.category || 'blog';
  
  // Track article view on mount (only once per slug)
  useEffect(() => {
    if (postSlug && slug && !trackedSlugs.current.has(slug)) {
      try {
        trackViewContent(postSlug, postTitle, postCategory);
        trackedSlugs.current.add(slug);
      } catch (err) {
        // Tracking errors should NOT affect UI or cause re-renders
        console.warn('[tracking] ViewContent failed:', err);
      }
    }
  }, [slug, postSlug, postTitle, postCategory]);

  // P0 FIX: Memoize seoOverride and faqData to prevent infinite re-renders
  // These were creating new object/array references on every render, causing useEffect deps to change
  // This triggered infinite effect re-runs → Error #301 (Too many re-renders)
  const seoOverride = useMemo(() => getSeoOverride(locale, slug), [locale, slug]);
  const faqData = useMemo(() => (getFaqData(slug) || []).filter(isValidFaqItem), [slug]);

  // --- DOM fallback for TOC: if ul.toc is empty, fill from headings ---
    const tocEffectSlug = post?.slug || "";
    // Fix for ESLint: extract dependency to variable
  useEffect(() => {
    if (typeof window === "undefined") return;
      if (!tocEffectSlug) return;
    const root =
      document.querySelector(".blog-post-content") ||
      document.querySelector(".blog-post-content-inner") ||
      document;
    const toc = root.querySelector("ul.toc") || document.querySelector("ul.toc");
    if (!toc) return;
    if (toc.querySelector("li")) return;
    const headings = Array.from(root.querySelectorAll("h2[id], h3[id]"));
    if (!headings.length) return;
    toc.innerHTML = "";
    headings.slice(0, 20).forEach((h) => {
      const text = (h.textContent || "").trim();
      if (!text) return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.textContent = text;
      li.appendChild(a);
      toc.appendChild(li);
    });
    }, [tocEffectSlug]);

  const canonicalUrl = post ? BASE_URL + '/' + locale + '/blog/' + slug + '/' : '';
  const altSlug = slug ? getMappedAlternateSlug(locale, slug) : null;
  const altLocale = isRu ? 'uz' : 'ru';
  const altUrl = altSlug ? BASE_URL + '/' + altLocale + '/blog/' + altSlug + '/' : null;
  const ruUrl = isRu ? canonicalUrl : altUrl;
  // Если нет altSlug, не рендерим hreflang для UZ (uzUrl=null)
  const uzUrl = isRu ? (altUrl || null) : canonicalUrl;

  // Determine title: use override if exists, otherwise default
  const pageTitle = (seoOverride && (seoOverride.title || seoOverride.titleTag)) || (post ? post.title + ' — Graver.uz' : 'Graver.uz');
  const pageDescription = (seoOverride && (seoOverride.description || seoOverride.ogDescription)) || (post ? post.description : '');
  const pageOgImage = post ? BASE_URL + getBlogOgImageForSlug(slug) : BASE_URL + '/og-blog.png';
  let heroImage = getResponsiveBlogImageForSlug(slug);
  // Fallback to default cover if missing
  if (!heroImage.fallbackSrc || heroImage.fallbackSrc === slug || heroImage.fallbackSrc === '') {
    heroImage = getResponsiveBlogImageForSlug(defaultBlogCover);
  }

  useEffect(function addSeoTags() {
    if (!post) return;
    var isRuLang = locale === 'ru';
    var oldMetaTags = document.querySelectorAll('[data-seo-blog-post-meta]');
    oldMetaTags.forEach(function(el) { el.remove(); });

    var timeoutId = null;
    var headObserver = null;
    var hasCompleteHelmetSeo = function() {
      var hasHelmetRobots = document.head.querySelector('meta[name="robots"][data-rh="true"]');
      var hasHelmetDescription = document.head.querySelector('meta[name="description"][data-rh="true"]');
      var hasHelmetCanonical = document.head.querySelector('link[rel="canonical"][data-rh="true"]');
      var hasHelmetRuAlt = document.head.querySelector('link[rel="alternate"][hreflang="ru"][data-rh="true"]');
      var hasHelmetUzAlt = document.head.querySelector('link[rel="alternate"][hreflang="uz-Latn"][data-rh="true"]');
      var hasHelmetDefaultAlt = document.head.querySelector('link[rel="alternate"][hreflang="x-default"][data-rh="true"]');
      return !!(hasHelmetRobots && hasHelmetDescription && hasHelmetCanonical && hasHelmetRuAlt && hasHelmetUzAlt && hasHelmetDefaultAlt);
    };
    var removeFallbackSeo = function() {
      document.querySelectorAll('[data-seo-blog-post-meta]').forEach(function(el) { el.remove(); });
    };

    var tryAppendFallback = function() {
      if (hasCompleteHelmetSeo()) {
        removeFallbackSeo();
        return;
      }

      var appendMeta = function(attr, key, value) {
        if (!value) return;
        var existing = document.head.querySelector('meta[' + attr + '="' + key + '"]');
        if (existing) return;
        var tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        tag.setAttribute('content', value);
        tag.setAttribute('data-seo-blog-post-meta', 'true');
        document.head.appendChild(tag);
      };

      var appendLink = function(rel, href, hreflang) {
        if (!href) return;
        var existing = hreflang
          ? document.head.querySelector('link[rel="' + rel + '"][hreflang="' + hreflang + '"]')
          : document.head.querySelector('link[rel="' + rel + '"]');
        if (existing) return;
        var tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        tag.setAttribute('href', href);
        tag.setAttribute('data-seo-blog-post-meta', 'true');
        if (hreflang) {
          tag.setAttribute('hreflang', hreflang);
        }
        document.head.appendChild(tag);
      };

      document.title = pageTitle;
      appendMeta('name', 'description', pageDescription);
      appendMeta('name', 'robots', 'index, follow');
      appendLink('canonical', canonicalUrl);
      appendLink('alternate', ruUrl, 'ru');
      appendLink('alternate', uzUrl, 'uz-Latn');
      appendLink('alternate', ruUrl || canonicalUrl, 'x-default');
      appendMeta('property', 'og:title', pageTitle);
      appendMeta('property', 'og:description', pageDescription);
      appendMeta('property', 'og:type', 'article');
      appendMeta('property', 'og:url', canonicalUrl);
      appendMeta('property', 'og:image', pageOgImage);
      appendMeta('property', 'og:site_name', 'Graver.uz');
      appendMeta('property', 'og:locale', isRuLang ? 'ru_RU' : 'uz_UZ');
      appendMeta('name', 'twitter:card', 'summary_large_image');
      appendMeta('name', 'twitter:title', pageTitle);
      appendMeta('name', 'twitter:description', pageDescription);
      appendMeta('name', 'twitter:image', pageOgImage);

      if (headObserver) {
        headObserver.disconnect();
      }
      headObserver = new MutationObserver(function() {
        if (hasCompleteHelmetSeo()) {
          removeFallbackSeo();
          if (headObserver) {
            headObserver.disconnect();
            headObserver = null;
          }
        }
      });
      headObserver.observe(document.head, { childList: true, subtree: true, attributes: true });
    };

    timeoutId = window.setTimeout(tryAppendFallback, 0);

    // JSON-LD is now handled exclusively by SeoMeta.js (no duplicates)
    // Only cleanup old tags if any remain from previous renders
    var oldTags = document.querySelectorAll('[data-seo-blog]');
    oldTags.forEach(function(el) { el.remove(); });
    
    return function cleanup() {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (headObserver) {
        headObserver.disconnect();
      }
      document.querySelectorAll('[data-seo-blog-post-meta]').forEach(function(el) { el.remove(); });
      document.querySelectorAll('[data-seo-blog]').forEach(function(el) { el.remove(); });
    };
  }, [post, canonicalUrl, ruUrl, uzUrl, locale, seoOverride, faqData, pageOgImage, pageTitle, pageDescription]);

  // P0 FIX: compute contentBody and headings via useMemo instead of setState during render
  // Calling setToc(headings) in the render body caused infinite re-renders (Error #301)
  // MUST be before early return to satisfy Rules of Hooks (no conditional hooks)
  const { computedToc, contentBody } = useMemo(() => {
    if (post && post.contentHtml) {
      const enhancedHtml = enhanceTocAndAnchors(normalizeHtmlContent(post.contentHtml, locale));
      const headings = [];
      const matches = enhancedHtml.matchAll(/<h([2-3]) id="([^"]+)">([^<]+)<\/h[2-3]>/g);
      for (const match of matches) {
        headings.push({
          level: parseInt(match[1], 10),
          id: match[2],
          text: match[3],
        });
      }
      return {
        computedToc: headings,
        contentBody: React.createElement('div', { dangerouslySetInnerHTML: { __html: enhancedHtml } }),
      };
    }
    if (post && post.content) {
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
      return { computedToc: [], contentBody: contentParts };
    }
    return { computedToc: [], contentBody: null };
  }, [post, locale]);

  // P1 FIX: Guard against missing posts - render 404 page instead of crashing
  if (!post) {
    return (
      <>
        <SeoMeta 
          title={isRu ? 'Статья не найдена | Graver.uz' : 'Maqola topilmadi | Graver.uz'}
          description={isRu ? 'Запрошенная статья не существует или была удалена.' : 'Soʻralgan maqola mavjud emas yoki oʻchirilgan.'}
          noindex={true}
          canonical={BASE_URL + '/' + locale + '/blog/'}
        />
        <div className="blog-post-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="blog-post-not-found" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
              {isRu ? '404 — Статья не найдена' : '404 — Maqola topilmadi'}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
              {isRu 
                ? 'К сожалению, запрошенная статья не существует или была удалена.' 
                : 'Kechirasiz, soʻralgan maqola mavjud emas yoki oʻchirilgan.'}
            </p>
            <Link 
              to={'/' + locale + '/blog'} 
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#14b8a6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              {isRu ? '← Вернуться в блог' : '← Blogga qaytish'}
            </Link>
          </div>
        </div>
      </>
    );
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
  var readTime = getPostReadTimeMinutes(post);

  // P1 FIX: Guard relatedPosts array
  var overrideRelatedSlugs = Array.isArray(seoOverride && seoOverride.relatedSlugs)
    ? seoOverride.relatedSlugs
    : [];
  var recommendedPosts = (Array.isArray(getRelatedPostsWeighted(locale, slug, 5, overrideRelatedSlugs)) ? getRelatedPostsWeighted(locale, slug, 5, overrideRelatedSlugs) : []).filter(function(p) { return p && p.slug; });

  var moneyLinks = buildMoneyLinks(locale, slug, isRu);

  var utilityLinks = [
    { href: '/' + locale + '/process', label: isRu ? 'Процесс' : 'Jarayon' },
    { href: '/' + locale + '/guarantees', label: isRu ? 'Гарантии' : 'Kafolatlar' },
    { href: '/' + locale + '/contacts', label: isRu ? 'Контакты' : 'Kontaktlar' }
  ];

  var hubLink = {
    href: '/' + locale + '/blog',
    label: isRu ? 'Все статьи блога' : 'Blogdagi barcha maqolalar'
  };

  // BlogPosting Schema.org for SEO
  var blogPostingSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': canonicalUrl + '#article',
    headline: pageTitle,
    description: pageDescription,
    image: pageOgImage,
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    author: {
      '@type': 'Organization',
      name: 'Graver.uz',
      url: BASE_URL
    },
    publisher: {
      '@type': 'Organization',
      name: 'Graver.uz',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: BASE_URL + '/og-blog.png',
        width: 1200,
        height: 630
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    inLanguage: locale === 'ru' ? 'ru' : 'uz',
    articleSection: post.category || (locale === 'ru' ? 'Blog' : 'Blog'),
    keywords: post.keywords ? post.keywords.join(', ') : undefined
  } : null;

  return React.createElement('div', { className: 'min-h-screen bg-black text-white' },
    blogPostingSchema && React.createElement('script', {
      type: 'application/ld+json',
      dangerouslySetInnerHTML: { __html: JSON.stringify(blogPostingSchema) }
    }),
    React.createElement(SeoMeta, {
      title: pageTitle,
      description: pageDescription,
      canonicalUrl: canonicalUrl,
      ruUrl: ruUrl,
      uzUrl: uzUrl,
      locale: locale,
      ogImage: pageOgImage,
      ogType: 'article',
      isBlogPost: true,
      faq: post && Array.isArray(post.faq) ? post.faq : [],
      datePublished: post && post.date ? post.date : undefined,
      articleSection: post && post.category ? post.category : (locale === 'ru' ? 'Блог' : 'Blog'),
      readTime: post ? getPostReadTimeMinutes(post) : undefined,
      keywords: post && Array.isArray(post.keywords) ? post.keywords.join(', ') : undefined,
      showRssLinks: true
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
            dateStr,
            React.createElement('span', { className: 'mx-2' }, '•'),
            React.createElement(Clock, { size: 14, className: 'mr-1' }),
            readTime + ' ' + (isRu ? 'мин чтения' : 'daq o\'qish')
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
        React.createElement('div', { className: 'mb-8 overflow-hidden rounded-xl border border-gray-800 bg-gray-900' },
          React.createElement('picture', null,
            heroImage.avifSrcSet ? React.createElement('source', {
              type: 'image/avif',
              srcSet: heroImage.avifSrcSet,
              sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px'
            }) : null,
            heroImage.webpSrcSet ? React.createElement('source', {
              type: 'image/webp',
              srcSet: heroImage.webpSrcSet,
              sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px'
            }) : null,
            React.createElement('img', {
              src: heroImage.fallbackSrc,
              alt: post.title,
              className: 'w-full aspect-[16/9] object-cover',
              loading: 'eager',
              decoding: 'async',
              fetchPriority: 'high',
              onError: function(event) {
                const target = event.currentTarget;
                const fallback = getBlogImageForSlug(slug);
                if (target.src.endsWith(fallback)) return;
                target.src = fallback;
              }
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
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-4 gap-8' },
          React.createElement('div', { className: 'lg:col-span-3' },
            React.createElement('div', { className: 'prose prose-invert max-w-none' }, contentBody)
          ),
          React.createElement('aside', { className: 'lg:col-span-1 lg:sticky top-24 self-start' },
            React.createElement('div', { className: 'p-6 bg-gray-900 rounded-2xl border border-gray-800' },
              React.createElement('h3', { className: 'text-lg font-bold text-white mb-4' }, isRu ? 'Содержание' : 'Mundarija'),
              React.createElement('ul', { className: 'space-y-2' },
                computedToc.map((item) => (
                  React.createElement('li', { key: item.id, className: `ml-${(item.level - 2) * 4}` },
                    React.createElement('a', { href: `#${item.id}`, className: 'text-gray-400 hover:text-teal-500 transition' }, item.text)
                  )
                ))
              )
            )
          )
        ),
        // Author Block — E-E-A-T signal for Google (shows expertise and trustworthiness)
        React.createElement('div', {
          className: 'mt-10 p-5 bg-gray-900/60 border border-gray-800 rounded-xl flex items-start gap-4',
          'data-testid': 'author-block',
          itemScope: true,
          itemType: 'https://schema.org/Organization'
        },
          React.createElement('div', { className: 'w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0' },
            React.createElement('span', { className: 'text-white font-bold text-xl' }, 'G')
          ),
          React.createElement('div', null,
            React.createElement('p', { className: 'text-xs text-gray-500 mb-0.5' }, isRu ? 'Автор материала' : 'Maqola muallifi'),
            React.createElement('p', { className: 'text-white font-semibold', itemProp: 'name' }, 'Graver.uz'),
            React.createElement('p', { className: 'text-gray-400 text-sm mt-1' },
              isRu
                ? 'Команда Graver.uz — эксперты по лазерной гравировке и корпоративным подаркам в Ташкенте с опытом более 5 лет.'
                : "Graver.uz jamoasi — Toshkentda 5 yildan ortiq tajribaga ega lazer gravirovka va korporativ sovgalar bo'yicha mutaxassislar."
            )
          )
        ),
        // Checklist Download Block (only for checklist article)
        (slug === 'chek-list-zakupshchika-podarkov' || slug === 'xaridor-chek-listi-b2b') && React.createElement('div', {
          className: 'my-8 p-6 bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-600/60 rounded-xl',
          'data-testid': 'checklist-download-block'
        },
          React.createElement('div', { className: 'flex flex-col sm:flex-row items-start sm:items-center gap-4' },
            React.createElement('div', { className: 'flex-1' },
              React.createElement('h3', { className: 'text-lg font-bold text-white mb-1' },
                isRu ? '📋 Скачайте чек-лист в PDF' : '📋 Chek-listni PDF formatida yuklab oling'
              ),
              React.createElement('p', { className: 'text-gray-300 text-sm' },
                isRu
                  ? 'Полный чек-лист закупщика корпоративных подарков — от планирования до вручения. Распечатайте и используйте при каждом заказе.'
                  : 'Korporativ sovgalar xaridor uchun to\'liq chek-list — rejalashtirish va topshirishgacha.'
              )
            ),
            React.createElement('a', {
              href: '/downloads/checklist-zakupshchika.pdf',
              download: true,
              className: 'inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-5 py-3 rounded-lg transition whitespace-nowrap',
              onClick: function() { trackCatalogDownload('blog-checklist-article'); }
            },
              '⬇ ' + (isRu ? 'Скачать PDF' : 'PDF yuklab olish')
            )
          )
        ),
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
        // CTA Block - Call to Action for conversions
        React.createElement('div', { 
          className: 'mt-8 p-8 bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-600/60 rounded-xl',
          'data-testid': 'cta-block'
        },
          React.createElement('div', { className: 'text-center' },
            React.createElement('h3', { className: 'text-2xl font-bold text-white mb-3' },
              isRu ? 'Готовы заказать?' : 'Buyurtma qilishga tayyormisiz?'
            ),
            React.createElement('p', { className: 'text-gray-300 mb-6 max-w-2xl mx-auto' },
              isRu 
                ? 'Свяжитесь с нами в Telegram для консультации и получите скидку на первый заказ.'
                : 'Birinchi buyurtmada chegirma olish uchun Telegramda biz bilan boglanin.'
            ),
            React.createElement('div', { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
              React.createElement('a', { 
                href: 'https://t.me/GraverAdm',
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition'
              },
                '✉️ ' + (isRu ? 'Написать в Telegram' : 'Telegramga yozing')
              ),
              React.createElement(Link, { 
                to: '/' + locale + '\/contacts',
                className: 'inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition'
              },
                '📞 ' + (isRu ? 'Контакты' : 'Kontaktlar')
              )
            )
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
        React.createElement('p', null, '© 2026 Graver.uz — ' + (isRu ? 'Премиальная лазерная гравировка в Ташкенте' : 'Toshkentda premium lazer gravyurasi'))
      )
    )
  );
}

export default BlogPostPage;
