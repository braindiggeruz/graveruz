import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, AlertTriangle, Check } from 'lucide-react';
import B2CForm from '../components/B2CForm';

const BASE_URL = 'https://graver.uz';

const content = {
  ru: {
    slug: 'lighters-engraving',
    title: 'Зажигалки с гравировкой (аналог Zippo)',
    subtitle: 'Наши зажигалки — серебро или чёрный',
    meta: 'Зажигалки с гравировкой в Ташкенте. Аналог Zippo, 1 или 2 стороны. Цена от 140 000 сум. Топливо отдельно.',
    home: 'Главная',
    catalog: 'Каталог',
    important: 'Важно',
    importantText: 'Используем наши зажигалки (silver/black). На изделиях клиента не работаем.',
    options: 'Варианты',
    optionsList: [
      { name: '1 сторона', price: '140 000 сум' },
      { name: '2 стороны', price: '190 000 сум' },
      { name: 'Топливо', price: '+100 000 сум (отдельно)' }
    ],
    features: [
      'Металл, ветрозащитный механизм',
      'Гравировка логотипа, текста, рисунка',
      'Серебристый или чёрный корпус',
      'Подарочная коробка'
    ],
    faq: [
      { q: 'Можно на своей зажигалке?', a: 'Нет — работаем только на наших, чтобы гарантировать качество.' },
      { q: 'Какой материал?', a: 'Металл, ветрозащитный механизм — аналог Zippo.' },
      { q: 'Что можно нанести?', a: 'Логотип, текст, рисунок, символы — до 2 сторон.' },
      { q: 'Как согласовать?', a: 'Пришлите файл → получите макет → утвердите → производство.' },
      { q: 'Сколько по времени?', a: '2-4 дня после утверждения макета.' },
      { q: 'Топливо идёт в комплекте?', a: 'Нет, заправка +100 000 сум по желанию.' }
    ],
    gallery: 'Примеры'
  },
  uz: {
    slug: 'gravirovkali-zajigalka',
    title: 'Gravirovkali zajigalka (Zippo analogi)',
    subtitle: 'Bizning zajigalkalar — kumush yoki qora',
    meta: 'Toshkentda gravirovkali zajigalka. Zippo analogi, 1 yoki 2 tomon. Narx 140 000 so\'mdan. Yoqilg\'i alohida.',
    home: 'Bosh sahifa',
    catalog: 'Katalog',
    important: 'Muhim',
    importantText: 'O\'z zajigalkalarimizdan foydalanamiz (kumush/qora). Mijoz mahsulotlarida ishlamaymiz.',
    options: 'Variantlar',
    optionsList: [
      { name: '1 tomon', price: '140 000 so\'m' },
      { name: '2 tomon', price: '190 000 so\'m' },
      { name: 'Yoqilg\'i', price: '+100 000 so\'m (alohida)' }
    ],
    features: [
      'Metall, shamoldan himoyalangan mexanizm',
      'Logo, matn, rasm gravirovkasi',
      'Kumush yoki qora korpus',
      'Sovg\'a qutisi'
    ],
    faq: [
      { q: 'O\'z zajigalkamda qilsa bo\'ladimi?', a: 'Yo\'q — sifatni kafolatlash uchun faqat o\'zimiznikida ishlaymiz.' },
      { q: 'Qanday material?', a: 'Metall, shamoldan himoyalangan mexanizm — Zippo analogi.' },
      { q: 'Nima qo\'yish mumkin?', a: 'Logo, matn, rasm, belgilar — 2 tomongacha.' },
      { q: 'Qanday kelishiladi?', a: 'Fayl yuboring → maket oling → tasdiqlang → ishlab chiqarish.' },
      { q: 'Qancha vaqt ketadi?', a: 'Maketni tasdiqlagandan keyin 2-4 kun.' },
      { q: 'Yoqilg\'i komplektga kiradimi?', a: 'Yo\'q, to\'ldirish +100 000 so\'m ixtiyoriy.' }
    ],
    gallery: 'Namunalar'
  }
};

export default function LightersPage() {
  const { locale = 'ru' } = useParams();
  const t = content[locale] || content.ru;
  const catalogSlug = locale === 'uz' ? 'mahsulotlar-katalogi' : 'catalog-products';
  const pageUrl = `${BASE_URL}/${locale}/${t.slug}`;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.home, "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": t.catalog, "item": `${BASE_URL}/${locale}/${catalogSlug}` },
        { "@type": "ListItem", "position": 3, "name": t.title, "item": pageUrl }
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
      "mainEntity": t.faq.map(item => ({
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
  }, [locale, t, pageUrl, catalogSlug]);

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>{t.title} | Graver.uz</title>
        <meta name="description" content={t.meta} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.meta} />
      </Helmet>

      <header className="bg-black/95 border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
          </Link>
          <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center">
            <Send size={16} className="mr-2" />Telegram
          </a>
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
          <p className="text-lg text-gray-400">{t.subtitle}</p>
        </div>
      </section>

      {/* Important */}
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

      {/* Options */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-4">{t.options}</h2>
          <div className="grid grid-cols-3 gap-4">
            {t.optionsList.map((opt, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-white font-medium">{opt.name}</p>
                <p className="text-teal-500 font-bold">{opt.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-3">
            {t.features.map((f, i) => (
              <div key={i} className="flex items-center text-gray-300">
                <Check className="text-teal-500 mr-2 flex-shrink-0" size={16} />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-white mb-4">{t.gallery}</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img src="/portfolio/4.webp" alt="Зажигалка с гравировкой" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <B2CForm locale={locale} defaultCategory="lighters" pageUrl={pageUrl} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">FAQ</h2>
          <div className="space-y-3">
            {t.faq.map((item, i) => (
              <details key={i} className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="px-5 py-3 cursor-pointer list-none flex items-center justify-between text-white text-sm font-medium">
                  <span>{item.q}</span>
                  <span className="text-teal-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-3 text-gray-400 text-sm">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Graver.uz</p>
        </div>
      </footer>
    </div>
  );
}
