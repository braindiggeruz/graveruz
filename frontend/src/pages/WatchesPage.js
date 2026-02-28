import { openTelegramWithTracking, trackViewCategory } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, AlertTriangle, Check, Watch, Flame, Gift, ChevronRight } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import B2CSeo from '../components/B2CSeo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate } from '../config/seo';

const ruContent = {
  slug: 'watches-with-logo',
  title: 'Часы с логотипом и гравировкой',
  subtitle: 'Наши модели — сначала макет, потом нанесение',
  meta: 'Часы с гравировкой логотипа в Ташкенте. 450 000 – 2 000 000 сум. Сначала макет — потом производство.',
  home: 'Главная',
  catalog: 'Каталог',
  important: 'Важно',
  importantText: 'Работаем на наших часах из каталога (не на изделиях клиента).',
  price: 'Цена: 450 000 – 2 000 000 сум',
  priceNote: 'Зависит от модели, механизма и футляра',
  relatedTitle: 'Другие продукты с гравировкой',
  relatedSubtitle: 'Выберите подходящий продукт для персонализации',
  neoLabel: 'Часы NEO',
  neoDesc: 'Премиум часы с гравировкой',
  lightersLabel: 'Зажигалки',
  lightersDesc: 'Металлические с гравировкой',
  giftsLabel: 'Подарки',
  giftsDesc: 'Ручки и сувениры',
  neoTag: 'Новинка',
  fromPrice: 'от',
};

const uzContent = {
  slug: 'logotipli-soat',
  title: 'Logotip va gravirovkali soat',
  subtitle: 'Bizning modellar — avval maket, keyin qo\'llash',
  meta: 'Toshkentda logotipli gravirovkali soat. 450 000 – 2 000 000 so\'m. Avval maket — keyin ishlab chiqarish.',
  home: 'Bosh sahifa',
  catalog: 'Katalog',
  important: 'Muhim',
  importantText: 'Katalogdagi soatlarimizda ishlaymiz (mijoz mahsulotlarida emas).',
  price: 'Narx: 450 000 – 2 000 000 so\'m',
  priceNote: 'Model, mexanizm va qutiga bog\'liq',
  relatedTitle: 'Boshqa gravirovkali mahsulotlar',
  relatedSubtitle: 'Shaxsiylashtirish uchun mos mahsulotni tanlang',
  neoLabel: 'NEO soatlar',
  neoDesc: 'Premium soatlar bilan gravyura',
  lightersLabel: 'Zajigalkalar',
  lightersDesc: 'Metall bilan gravyura',
  giftsLabel: 'Sovg\'alar',
  giftsDesc: 'Ruchkalar va suvenirlар',
  neoTag: 'Yangi',
  fromPrice: 'dan',
};

const ruFeatures = ['Кварцевые и механические модели', 'Гравировка логотипа, инициалов', 'Цифровой макет до производства', 'Подарочная упаковка'];
const uzFeatures = ['Kvarts va mexanik modellar', 'Logo, initsiallar gravirovkasi', 'Ishlab chiqarishdan oldin maket', 'Sovg\'a qadoqlash'];

const ruFaq = [
  { q: 'Можно на моих часах?', a: 'Обычно нет — риск повреждения.' },
  { q: 'Какие модели есть?', a: 'Кварцевые (от 450 000), механические (от 800 000).' },
  { q: 'Где будет гравировка?', a: 'На задней крышке или циферблате.' }
];
const uzFaq = [
  { q: 'O\'z soatimda qilsa bo\'ladimi?', a: 'Odatda yo\'q — shikastlanish xavfi.' },
  { q: 'Qanday modellar bor?', a: 'Kvarts (450 000 dan), mexanik (800 000 dan).' },
  { q: 'Gravirovka qayerda?', a: 'Orqa qopqoqda yoki tsiferblatda.' }
];

export default function WatchesPage() {
  const { locale = 'ru' } = useParams();
  const t = locale === 'uz' ? uzContent : ruContent;
  const features = locale === 'uz' ? uzFeatures : ruFeatures;
  const faq = locale === 'uz' ? uzFaq : ruFaq;
  const catalogSlug = locale === 'uz' ? 'mahsulotlar-katalogi' : 'catalog-products';
  
  const pathname = `/${locale}/${t.slug}`;
  const canonicalUrl = buildCanonical(pathname);
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
    trackViewCategory('watches', locale === 'uz' ? 'Soatlar gravyurasi' : 'Часы с гравировкой');
  }, [locale]);

  const watchesGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Graver.uz",
        "url": BASE_URL,
        "logo": `${BASE_URL}/logo192.png`
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "Graver.uz",
        "publisher": { "@id": `${BASE_URL}/#organization` }
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": t.title,
        "description": t.meta,
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "inLanguage": locale === 'uz' ? 'uz' : 'ru'
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": t.home, "item": `${BASE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": t.catalog, "item": `${BASE_URL}/${locale}/${catalogSlug}` },
          { "@type": "ListItem", "position": 3, "name": t.title, "item": canonicalUrl }
        ]
      },
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": t.title,
        "description": t.meta,
        "brand": { "@id": `${BASE_URL}/#organization` },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "UZS",
          "lowPrice": "450000",
          "highPrice": "2000000",
          "offerCount": "2",
          "url": canonicalUrl
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": faq.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black">
      <B2CSeo 
        title={`${t.title} | Graver.uz`}
        description={t.meta}
        canonicalUrl={canonicalUrl}
        ruUrl={ruUrl}
        uzUrl={uzUrl}
        locale={locale}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(watchesGraphSchema)}
        </script>
      </Helmet>

      <header className="bg-black/95 border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center"
              onClick={(e) => openTelegramWithTracking(e, 'watches-header')}
            >
              <Send size={16} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </header>

      {/* ===== КРАСИВАЯ СЕКЦИЯ "ДРУГИЕ ПРОДУКТЫ" СВЕРХУ ===== */}
      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800/60 py-5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-4 font-medium">
            {t.relatedTitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
            {/* NEO Часы — Новинка */}
            <Link
              to={`/${locale}/products/neo-watches`}
              className="group relative flex items-center gap-4 bg-gradient-to-r from-teal-900/40 to-cyan-900/30 border border-teal-500/40 hover:border-teal-400 rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 flex-1 max-w-xs"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Watch size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold text-sm">{t.neoLabel}</span>
                  <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{t.neoTag}</span>
                </div>
                <p className="text-gray-400 text-xs truncate">{t.neoDesc}</p>
                <p className="text-teal-400 text-xs font-semibold mt-1">{t.fromPrice} 750 000 {locale === 'uz' ? "so'm" : 'сум'}</p>
              </div>
              <ChevronRight size={16} className="text-teal-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>

            {/* Зажигалки */}
            <Link
              to={`/${locale}/products/lighters`}
              className="group flex items-center gap-4 bg-gray-900/60 border border-gray-700/60 hover:border-orange-500/50 rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 flex-1 max-w-xs"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Flame size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white font-semibold text-sm block mb-0.5">{t.lightersLabel}</span>
                <p className="text-gray-400 text-xs truncate">{t.lightersDesc}</p>
                <p className="text-orange-400 text-xs font-semibold mt-1">{t.fromPrice} 160 000 {locale === 'uz' ? "so'm" : 'сум'}</p>
              </div>
              <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>

            {/* Подарки */}
            <Link
              to={`/${locale}/${locale === 'uz' ? 'gravirovkali-sovgalar' : 'engraved-gifts'}`}
              className="group flex items-center gap-4 bg-gray-900/60 border border-gray-700/60 hover:border-purple-500/50 rounded-2xl px-5 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 flex-1 max-w-xs"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Gift size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white font-semibold text-sm block mb-0.5">{t.giftsLabel}</span>
                <p className="text-gray-400 text-xs truncate">{t.giftsDesc}</p>
                <p className="text-purple-400 text-xs font-semibold mt-1">{t.fromPrice} 80 000 {locale === 'uz' ? "so'm" : 'сум'}</p>
              </div>
              <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{t.home}</Link></li>
            <li className="text-gray-600">/</li>
            <li><Link to={`/${locale}/${catalogSlug}`} className="text-gray-400 hover:text-teal-500">{t.catalog}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">{t.title}</li>
          </ol>
        </div>
      </nav>

      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{t.title}</h1>
          <p className="text-lg text-gray-400 mb-4">{t.subtitle}</p>
          <p className="text-2xl text-teal-500 font-bold">{t.price}</p>
          <p className="text-gray-500 text-sm">{t.priceNote}</p>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-5 flex items-start">
            <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <span className="text-yellow-400 font-semibold">{t.important}:</span>
              <span className="text-yellow-200 ml-1">{t.importantText}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center text-gray-300">
                <Check className="text-teal-500 mr-2 flex-shrink-0" size={16} />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== КРАСИВАЯ ГАЛЕРЕЯ ЧАСОВ ===== */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Главное большое изображение */}
            <div className="md:col-span-2 relative rounded-2xl overflow-hidden group" style={{ minHeight: '300px' }}>
              <img 
                src="/images/products/neo-watch-hero.jpg" 
                alt={locale === 'uz' ? 'Logotipli soat' : 'Часы с логотипом'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ minHeight: '300px' }}
                loading="eager"
                fetchpriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {locale === 'uz' ? 'Bizning ishlarimiz' : 'Наши работы'}
                </span>
              </div>
            </div>
            {/* Правая колонка: 2 маленьких */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden group flex-1" style={{ minHeight: '140px' }}>
                <img 
                  src="/images/products/neo-watch-automatic.jpg" 
                  alt={locale === 'uz' ? 'Soat gravirovkasi' : 'Гравировка часов'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ minHeight: '140px' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* NEO Промо карточка */}
              <Link
                to={`/${locale}/products/neo-watches`}
                className="group relative flex-1 rounded-2xl overflow-hidden border border-teal-500/40 hover:border-teal-400 transition-all duration-300"
                style={{ minHeight: '140px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 to-black" />
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                  <div>
                    <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {locale === 'uz' ? 'Yangi' : 'Новинка'}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-3">
                      {locale === 'uz' ? 'NEO soatlar' : 'Часы NEO'}
                    </h3>
                    <p className="text-teal-300 text-sm mt-1">
                      {locale === 'uz' ? 'Premium seriya' : 'Премиум серия'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-teal-400 font-bold text-sm">
                      {locale === 'uz' ? '750 000 so\'mdan' : 'от 750 000 сум'}
                    </span>
                    <ChevronRight size={18} className="text-teal-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <B2CForm locale={locale} defaultCategory="watches" pageUrl={canonicalUrl} />
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">FAQ</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="group bg-gray-900 border border-gray-800 rounded-xl">
                <summary className="px-5 py-3 cursor-pointer list-none flex justify-between text-white text-sm font-medium">
                  {item.q}
                  <span className="text-teal-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-3 text-gray-400 text-sm">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">© 2026 Graver.uz</div>
      </footer>
    </div>
  );
}
