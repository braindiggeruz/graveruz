import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import B2CForm from '../components/B2CForm';

const BASE_URL = 'https://graver.uz';

const content = {
  ru: {
    slug: 'watches-with-logo',
    title: 'Часы с логотипом и гравировкой',
    subtitle: 'Наши модели — сначала макет, потом нанесение',
    meta: 'Часы с гравировкой логотипа в Ташкенте. Работаем на наших моделях из каталога. Цена: 450 000 – 2 000 000 сум.',
    home: 'Главная',
    catalog: 'Каталог',
    important: 'Важно',
    importantText: 'Работаем на наших часах из каталога (не на изделиях клиента).',
    price: 'Цена: 450 000 – 2 000 000 сум',
    priceNote: 'Зависит от модели, механизма и футляра',
    features: [
      'Кварцевые и механические модели',
      'Гравировка логотипа, инициалов, даты',
      'Цифровой макет до производства',
      'Подарочная упаковка включена'
    ],
    process: 'Как работаем',
    steps: [
      { title: 'Выбор модели', desc: 'Пришлите бюджет — подберём варианты' },
      { title: 'Макет', desc: 'Покажем расположение гравировки' },
      { title: 'Утверждение', desc: 'Вы одобряете — мы наносим' },
      { title: 'Получение', desc: '3-5 дней, Ташкент' }
    ],
    faq: [
      { q: 'Можно на моих часах?', a: 'Обычно нет — риск повреждения. Работаем на своих моделях с гарантией результата.' },
      { q: 'Какие модели есть?', a: 'Кварцевые (от 450 000), механические (от 800 000). Фото по запросу.' },
      { q: 'Где будет гравировка?', a: 'На задней крышке или циферблате (зависит от модели).' },
      { q: 'Сколько времени?', a: 'Стандарт 3-5 дней, срочно — обсуждается.' },
      { q: 'Можно логотип + текст?', a: 'Да, если размер позволяет. Покажем на макете.' }
    ],
    gallery: 'Примеры работ'
  },
  uz: {
    slug: 'logotipli-soat',
    title: 'Logotip va gravirovkali soat',
    subtitle: 'Bizning modellar — avval maket, keyin qo\'llash',
    meta: 'Toshkentda logotipli gravirovkali soat. Katalogdagi modellarimizda ishlaymiz. Narx: 450 000 – 2 000 000 so\'m.',
    home: 'Bosh sahifa',
    catalog: 'Katalog',
    important: 'Muhim',
    importantText: 'Katalogdagi o\'z soatlarimizda ishlaymiz (mijoz mahsulotlarida emas).',
    price: 'Narx: 450 000 – 2 000 000 so\'m',
    priceNote: 'Model, mexanizm va qutiga bog\'liq',
    features: [
      'Kvarts va mexanik modellar',
      'Logo, initsiallar, sana gravirovkasi',
      'Ishlab chiqarishdan oldin raqamli maket',
      'Sovg\'a qadoqlash kiritilgan'
    ],
    process: 'Qanday ishlaymiz',
    steps: [
      { title: 'Model tanlash', desc: 'Byudjetni yuboring — variantlar tanlaymiz' },
      { title: 'Maket', desc: 'Gravirovka joylashuvini ko\'rsatamiz' },
      { title: 'Tasdiqlash', desc: 'Siz tasdiqlaysiz — biz qo\'llaymiz' },
      { title: 'Olish', desc: '3-5 kun, Toshkent' }
    ],
    faq: [
      { q: 'O\'z soatimda qilsa bo\'ladimi?', a: 'Odatda yo\'q — shikastlanish xavfi. Natija kafolatli o\'z modellarimizda ishlaymiz.' },
      { q: 'Qanday modellar bor?', a: 'Kvarts (450 000 dan), mexanik (800 000 dan). So\'rov bo\'yicha foto.' },
      { q: 'Gravirovka qayerda bo\'ladi?', a: 'Orqa qopqoqda yoki tsiferblatda (modelga bog\'liq).' },
      { q: 'Qancha vaqt ketadi?', a: 'Standart 3-5 kun, shoshilinch — muhokama qilinadi.' },
      { q: 'Logo + matn mumkinmi?', a: 'Ha, agar o\'lcham imkon bersa. Maketda ko\'rsatamiz.' }
    ],
    gallery: 'Ishlar namunalari'
  }
};

export default function WatchesPage() {
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
          <p className="text-lg text-gray-400 mb-4">{t.subtitle}</p>
          <p className="text-2xl text-teal-500 font-bold">{t.price}</p>
          <p className="text-gray-500 text-sm">{t.priceNote}</p>
        </div>
      </section>

      {/* Important notice */}
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

      {/* Features */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {t.features.map((f, i) => (
              <div key={i} className="flex items-center text-gray-300">
                <Check className="text-teal-500 mr-2 flex-shrink-0" size={18} />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-10 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">{t.process}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">{i + 1}</div>
                <h3 className="text-white font-medium mb-1">{step.title}</h3>
                <p className="text-gray-400 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery placeholder */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">{t.gallery}</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-gray-800 rounded-xl flex items-center justify-center">
                <img src="/portfolio/10.webp" alt="Часы с гравировкой" className="w-full h-full object-cover rounded-xl" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <B2CForm locale={locale} defaultCategory="watches" pageUrl={pageUrl} />
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
