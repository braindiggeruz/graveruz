import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useI18n } from '../i18n';
import { BASE_URL, HREFLANG_MAP } from '../config/seo';
import { getPostBySlug, getAlternateSlug } from '../data/blogPosts';

// Simple markdown renderer (no external deps)
function renderMarkdown(content) {
  if (!content) return null;
  
  const lines = content.split('\n');
  const elements = [];
  let listItems = [];
  let inList = false;
  
  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 my-4 text-gray-300">
          {listItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };
  
  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(4)}</h3>);
    }
    // List items
    else if (line.startsWith('- ')) {
      inList = true;
      listItems.push(line.slice(2));
    }
    // Empty line
    else if (line.trim() === '') {
      flushList();
    }
    // Paragraph
    else if (line.trim()) {
      flushList();
      // Simple bold/italic
      let text = line
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
      elements.push(
        <p key={index} className="text-gray-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: text }} />
      );
    }
  });
  
  flushList();
  return elements;
}

export default function BlogPost() {
  const { locale, slug } = useParams();
  const { t } = useI18n();
  const post = getPostBySlug(locale, slug);

  // 404 if post not found
  if (!post) {
    return <Navigate to={`/${locale}/blog`} replace />;
  }

  const isRu = locale === 'ru';
  const canonicalUrl = `${BASE_URL}/${locale}/blog/${slug}`;
  
  // Alternate URL (if counterpart exists)
  const alternateSlug = getAlternateSlug(slug);
  const altLocale = locale === 'ru' ? 'uz' : 'ru';
  const alternateUrl = alternateSlug ? `${BASE_URL}/${altLocale}/blog/${alternateSlug}` : null;
  
  const ruUrl = locale === 'ru' ? canonicalUrl : alternateUrl;
  const uzUrl = locale === 'uz' ? canonicalUrl : alternateUrl;

  // Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Graver.uz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Graver.uz",
      "url": BASE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // SEO tags via useEffect
  React.useEffect(() => {
    document.querySelectorAll('[data-seo-blog]').forEach(el => el.remove());
    
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    canonical.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(canonical);
    
    if (ruUrl) {
      const hreflangRu = document.createElement('link');
      hreflangRu.rel = 'alternate';
      hreflangRu.hreflang = HREFLANG_MAP.ru;
      hreflangRu.href = ruUrl;
      hreflangRu.setAttribute('data-seo-blog', 'true');
      document.head.appendChild(hreflangRu);
    }
    
    if (uzUrl) {
      const hreflangUz = document.createElement('link');
      hreflangUz.rel = 'alternate';
      hreflangUz.hreflang = HREFLANG_MAP.uz;
      hreflangUz.href = uzUrl;
      hreflangUz.setAttribute('data-seo-blog', 'true');
      document.head.appendChild(hreflangUz);
    }
    
    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = ruUrl || canonicalUrl;
    hreflangDefault.setAttribute('data-seo-blog', 'true');
    document.head.appendChild(hreflangDefault);
    
    return () => {
      document.querySelectorAll('[data-seo-blog]').forEach(el => el.remove());
    };
  }, [canonicalUrl, ruUrl, uzUrl]);

  // Related services links
  const relatedServices = isRu ? [
    { href: `/${locale}/catalog-products`, label: 'Каталог продукции' },
    { href: `/${locale}/watches-with-logo`, label: 'Часы с логотипом' },
    { href: `/${locale}/lighters-engraving`, label: 'Зажигалки с гравировкой' },
    { href: `/${locale}/engraved-gifts`, label: 'Подарки с гравировкой' }
  ] : [
    { href: `/${locale}/mahsulotlar-katalogi`, label: 'Mahsulotlar katalogi' },
    { href: `/${locale}/logotipli-soat`, label: 'Logotipli soat' },
    { href: `/${locale}/gravirovkali-zajigalka`, label: "Gravirovkali zajigalka" },
    { href: `/${locale}/gravirovkali-sovgalar`, label: "Gravirovkali sovg'alar" }
  ];

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
              to={`/${locale}/blog`}
              className="text-gray-300 hover:text-teal-500 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              {isRu ? 'Назад к блогу' : 'Blogga qaytish'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="blog-post-content">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar size={14} className="mr-2" />
              {new Date(post.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-xl text-gray-400">{post.description}</p>
            
            {post.keywords && post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.keywords.map((kw, i) => (
                  <span key={i} className="inline-flex items-center text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    <Tag size={10} className="mr-1" />
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(post.content)}
          </div>

          {/* Related Services CTA */}
          <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {isRu ? 'Связанные услуги' : "Bog'liq xizmatlar"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedServices.map((service, i) => (
                <Link 
                  key={i}
                  to={service.href}
                  className="text-teal-500 hover:text-teal-400 text-sm transition"
                >
                  → {service.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link 
              to={`/${locale}/blog`}
              className="inline-flex items-center text-gray-400 hover:text-teal-500 transition"
            >
              <ArrowLeft size={16} className="mr-2" />
              {isRu ? 'Все статьи' : 'Barcha maqolalar'}
            </Link>
          </div>
        </article>
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
