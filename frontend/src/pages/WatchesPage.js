import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, AlertTriangle, Check } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';

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
  priceNote: 'Зависит от модели, механизма и футляра'
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
  priceNote: 'Model, mexanizm va qutiga bog\'liq'
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

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.home, "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": t.catalog, "item": `${BASE_URL}/${locale}/${catalogSlug}` },
        { "@type": "ListItem", "position": 3, "name": t.title, "item": canonicalUrl }
      ]
    };
    const oldSchema = document.getElementById('breadcrumb-schema');
    if (oldSchema) oldSchema.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map(item => ({
        "@type": "Question", "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a }
      }))
    };
    const oldFaq = document.getElementById('faq-schema');
    if (oldFaq) oldFaq.remove();
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'faq-schema';
    faqScript.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    return () => {
      document.getElementById('breadcrumb-schema')?.remove();
      document.getElementById('faq-schema')?.remove();
    };
  }, [locale, t, canonicalUrl, catalogSlug, faq]);

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>{t.title} | Graver.uz</title>
        <meta name="description" content={t.meta} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hreflang={HREFLANG_MAP.ru} href={ruUrl} />
        <link rel="alternate" hreflang={HREFLANG_MAP.uz} href={uzUrl} />
        <link rel="alternate" hreflang="x-default" href={ruUrl} />
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
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center">
              <Send size={16} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </header>

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

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i, index) => (
              <div key={i} className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
                <img 
                  src="/portfolio/10.webp" 
                  alt="Часы" 
                  className="w-full h-full object-cover" 
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchpriority={index === 0 ? "high" : undefined}
                />
              </div>
            ))}
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
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">© 2025 Graver.uz</div>
      </footer>
    </div>
  );
}
