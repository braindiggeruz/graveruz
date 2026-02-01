import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, AlertTriangle, PenTool, Battery, BookOpen } from 'lucide-react';
import B2CForm from '../components/B2CForm';

const BASE_URL = 'https://graver.uz';

const content = {
  ru: {
    slug: 'engraved-gifts',
    title: 'Ручки, повербанки и ежедневники с гравировкой',
    subtitle: 'Персонализированные подарки из нашего каталога',
    meta: 'Ручки, повербанки и ежедневники с гравировкой в Ташкенте. Цены от 25 000 сум. Работаем на нашей продукции.',
    home: 'Главная',
    catalog: 'Каталог',
    important: 'Важно',
    importantText: 'Работаем на нашей продукции из каталога. На изделиях клиента обычно не делаем.',
    products: [
      {
        id: 'pen',
        icon: PenTool,
        name: 'Ручки с гравировкой',
        price: '25 000 – 200 000 сум',
        desc: 'Шариковые, роллеры, перьевые. Цена зависит от модели и тиража.',
        features: ['Гравировка имени/логотипа', 'Подарочная упаковка', 'От 1 штуки']
      },
      {
        id: 'powerbank',
        icon: Battery,
        name: 'Повербанки с гравировкой',
        price: '90 000 – 600 000 сум',
        desc: 'Разные ёмкости и бренды. Цена зависит от модели и сложности.',
        features: ['Логотип/текст на корпусе', 'Разные ёмкости', 'Коробка в комплекте']
      },
      {
        id: 'diary',
        icon: BookOpen,
        name: 'Ежедневники',
        price: '50 000 – 250 000 сум',
        desc: 'Гравировка или УФ печать. Зависит от формата и модели.',
        features: ['Гравировка или УФ печать', 'A5/A4 форматы', 'Разные обложки']
      }
    ],
    faq: [
      { q: 'Чем отличается гравировка от УФ печати?', a: 'Гравировка — углубление в материале (на коже/металле). УФ — цветная печать на поверхности.' },
      { q: 'Какой минимальный тираж?', a: 'От 1 штуки. При заказе от 10+ — скидки.' },
      { q: 'Что нужно для макета?', a: 'Логотип в векторе (AI/SVG/PDF) или качественное фото текста.' },
      { q: 'Сколько времени?', a: '3-5 рабочих дней после утверждения макета.' },
      { q: 'Можно на своём ежедневнике?', a: 'Обычно нет — работаем на своих, чтобы гарантировать результат.' }
    ]
  },
  uz: {
    slug: 'gravirovkali-sovgalar',
    title: 'Gravirovkali ruchka, powerbank va kundaliklar',
    subtitle: 'Katalogdan shaxsiylashtirilgan sovg\'alar',
    meta: 'Toshkentda gravirovkali ruchka, powerbank va kundaliklar. Narx 25 000 so\'mdan. O\'z mahsulotlarimizda ishlaymiz.',
    home: 'Bosh sahifa',
    catalog: 'Katalog',
    important: 'Muhim',
    importantText: 'Katalogdagi o\'z mahsulotlarimizda ishlaymiz. Mijoz mahsulotlarida odatda qilmaymiz.',
    products: [
      {
        id: 'pen',
        icon: PenTool,
        name: 'Gravirovkali ruchka',
        price: '25 000 – 200 000 so\'m',
        desc: 'Sharikli, roller, patli. Narx model va tirajga bog\'liq.',
        features: ['Ism/logo gravirovkasi', 'Sovg\'a qadoqlash', '1 donadan']
      },
      {
        id: 'powerbank',
        icon: Battery,
        name: 'Gravirovkali powerbank',
        price: '90 000 – 600 000 so\'m',
        desc: 'Turli sig\'im va brendlar. Narx model va murakkablikka bog\'liq.',
        features: ['Korpusda logo/matn', 'Turli sig\'imlar', 'Quti komplektda']
      },
      {
        id: 'diary',
        icon: BookOpen,
        name: 'Kundaliklar',
        price: '50 000 – 250 000 so\'m',
        desc: 'Gravirovka yoki UV bosma. Format va modelga bog\'liq.',
        features: ['Gravirovka yoki UV bosma', 'A5/A4 formatlar', 'Turli muqovalar']
      }
    ],
    faq: [
      { q: 'Gravirovka va UV bosmaning farqi?', a: 'Gravirovka — materialda chuqurlik (teri/metallda). UV — sirtda rangli bosma.' },
      { q: 'Minimal tiraj qancha?', a: '1 donadan. 10+ buyurtmada chegirmalar.' },
      { q: 'Maket uchun nima kerak?', a: 'Vektor formatida logo (AI/SVG/PDF) yoki sifatli matn fotosi.' },
      { q: 'Qancha vaqt ketadi?', a: 'Maketni tasdiqlagandan keyin 3-5 ish kuni.' },
      { q: 'O\'z kundaligimda qilsa bo\'ladimi?', a: 'Odatda yo\'q — natijani kafolatlash uchun o\'zimiznikida ishlaymiz.' }
    ]
  }
};

export default function EngravedGiftsPage() {
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

  const scrollToForm = () => {
    document.getElementById('b2c-form')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-5 flex items-start">
            <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <span className="text-yellow-400 font-semibold">{t.important}:</span>
              <span className="text-yellow-200 ml-1">{t.importantText}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {t.products.map((prod) => {
              const Icon = prod.icon;
              return (
                <div key={prod.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-teal-500" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{prod.name}</h3>
                  <p className="text-teal-500 font-bold mb-2">{prod.price}</p>
                  <p className="text-gray-400 text-sm mb-4">{prod.desc}</p>
                  <ul className="space-y-1 mb-4">
                    {prod.features.map((f, i) => (
                      <li key={i} className="text-gray-400 text-xs flex items-center">
                        <span className="text-teal-500 mr-2">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={scrollToForm} className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition">
                    {locale === 'ru' ? 'Заказать' : 'Buyurtma'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <B2CForm locale={locale} pageUrl={pageUrl} />
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
