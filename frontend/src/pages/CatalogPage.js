import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, ArrowRight, AlertTriangle, Watch, Flame, PenTool, Battery, BookOpen } from 'lucide-react';
import B2CForm from '../components/B2CForm';

const BASE_URL = 'https://graver.uz';

const iconMap = {
  watches: Watch,
  lighters: Flame,
  pen: PenTool,
  powerbank: Battery,
  diary: BookOpen
};

const content = {
  ru: {
    slug: 'catalog-products',
    title: 'Продукция с гравировкой (в наличии)',
    subtitle: 'Выберите категорию и получите макет',
    meta: 'Часы, ручки, зажигалки, повербанки и ежедневники с лазерной гравировкой. Работаем на нашей продукции из каталога.',
    home: 'Главная',
    disclaimer: 'Мы делаем гравировку на нашей продукции из каталога. На изделиях клиента обычно не работаем, чтобы не рисковать результатом.',
    disclaimerTg: 'Есть своё изделие? Напишите в Telegram — обсудим.',
    cta: 'Оставить заявку',
    details: 'Подробнее',
    categories: [
      { id: 'watches', name: 'Часы с логотипом', price: '450 000 – 2 000 000 сум', desc: 'Наши модели с гравировкой логотипа или инициалов', link: 'watches-with-logo' },
      { id: 'lighters', name: 'Зажигалки (аналог Zippo)', price: '140 000 – 290 000 сум', desc: '1 или 2 стороны + топливо опционально', link: 'lighters-engraving' },
      { id: 'pen', name: 'Ручки с гравировкой', price: '25 000 – 200 000 сум', desc: 'Зависит от модели и тиража', link: 'engraved-gifts' },
      { id: 'powerbank', name: 'Повербанки с гравировкой', price: '90 000 – 600 000 сум', desc: 'Зависит от бренда и сложности', link: 'engraved-gifts' },
      { id: 'diary', name: 'Ежедневники', price: '50 000 – 250 000 сум', desc: 'Гравировка или УФ печать', link: 'engraved-gifts' }
    ],
    faq: [
      { q: 'Можно ли принести своё изделие?', a: 'Обычно нет — работаем на нашей продукции, чтобы гарантировать результат. Исключения обсуждаются в Telegram.' },
      { q: 'Как выбрать модель?', a: 'Напишите категорию и бюджет — подберём варианты и покажем фото.' },
      { q: 'Как происходит согласование?', a: 'Вы присылаете логотип/текст → мы делаем макет → вы утверждаете → производство.' },
      { q: 'Сколько времени занимает?', a: 'Стандарт: 3-5 рабочих дней. Срочно: 1-2 дня (обсуждается).' },
      { q: 'Нужен ли предоплата?', a: 'Да, 50% при заказе, 50% при получении.' },
      { q: 'Есть ли доставка?', a: 'Самовывоз в Ташкенте или доставка курьером по городу.' }
    ]
  },
  uz: {
    slug: 'mahsulotlar-katalogi',
    title: 'Gravirovkali mahsulotlar (mavjud)',
    subtitle: 'Kategoriyani tanlang va maket oling',
    meta: 'Soat, ruchka, zajigalka, powerbank va kundaliklar lazer gravirovkasi bilan. Katalogdagi mahsulotlarimizda ishlaymiz.',
    home: 'Bosh sahifa',
    disclaimer: 'Biz katalogdagi o\'z mahsulotlarimizda gravirovka qilamiz. Mijoz mahsulotlarida odatda ishlamaymiz.',
    disclaimerTg: 'O\'z mahsulotingiz bormi? Telegramga yozing — muhokama qilamiz.',
    cta: 'Ariza qoldirish',
    details: 'Batafsil',
    categories: [
      { id: 'watches', name: 'Logotipli soat', price: '450 000 – 2 000 000 so\'m', desc: 'Logo yoki initsiallar bilan bizning modellar', link: 'logotipli-soat' },
      { id: 'lighters', name: 'Zajigalka (Zippo analogi)', price: '140 000 – 290 000 so\'m', desc: '1 yoki 2 tomon + yoqilg\'i ixtiyoriy', link: 'gravirovkali-zajigalka' },
      { id: 'pen', name: 'Gravirovkali ruchka', price: '25 000 – 200 000 so\'m', desc: 'Model va tirajga bog\'liq', link: 'gravirovkali-sovgalar' },
      { id: 'powerbank', name: 'Gravirovkali powerbank', price: '90 000 – 600 000 so\'m', desc: 'Brend va murakkablikka bog\'liq', link: 'gravirovkali-sovgalar' },
      { id: 'diary', name: 'Kundaliklar', price: '50 000 – 250 000 so\'m', desc: 'Gravirovka yoki UV bosma', link: 'gravirovkali-sovgalar' }
    ],
    faq: [
      { q: 'O\'z mahsulotimni keltirsa bo\'ladimi?', a: 'Odatda yo\'q — natijani kafolatlash uchun o\'z mahsulotlarimizda ishlaymiz. Istisnolar Telegramda muhokama qilinadi.' },
      { q: 'Modelni qanday tanlash mumkin?', a: 'Kategoriya va byudjetni yozing — variantlarni tanlab, foto ko\'rsatamiz.' },
      { q: 'Kelishuv qanday amalga oshiriladi?', a: 'Siz logo/matn yuborasiz → biz maket qilamiz → siz tasdiqlaysiz → ishlab chiqarish.' },
      { q: 'Qancha vaqt ketadi?', a: 'Standart: 3-5 ish kuni. Shoshilinch: 1-2 kun (muhokama qilinadi).' },
      { q: 'Oldindan to\'lov kerakmi?', a: 'Ha, buyurtmada 50%, olishda 50%.' },
      { q: 'Yetkazib berish bormi?', a: 'Toshkentda olib ketish yoki kuryer orqali yetkazib berish.' }
    ]
  }
};

export default function CatalogPage() {
  const { locale = 'ru' } = useParams();
  const t = content[locale] || content.ru;
  const pageUrl = `${BASE_URL}/${locale}/${t.slug}`;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);

    // Breadcrumb JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.home, "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": t.title, "item": pageUrl }
      ]
    };
    const oldSchema = document.getElementById('breadcrumb-schema');
    if (oldSchema) oldSchema.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // FAQ JSON-LD
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": t.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
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
  }, [locale, t, pageUrl]);

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
        <meta property="og:url" content={pageUrl} />
      </Helmet>

      {/* Header */}
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

      {/* Breadcrumb */}
      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{t.home}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">{t.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{t.title}</h1>
          <p className="text-lg text-gray-400">{t.subtitle}</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.categories.map((cat) => {
              const Icon = iconMap[cat.id];
              return (
                <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                  <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                    {Icon && <Icon className="text-teal-500" size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                  <p className="text-teal-500 font-semibold mb-2">{cat.price}</p>
                  <p className="text-gray-400 text-sm mb-4">{cat.desc}</p>
                  <div className="flex gap-2">
                    <button onClick={scrollToForm} className="flex-1 bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition">
                      {t.cta}
                    </button>
                    <Link to={`/${locale}/${cat.link}`} className="flex items-center text-gray-400 hover:text-teal-500 text-sm">
                      {t.details} <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-yellow-200 font-medium mb-2">{t.disclaimer}</p>
                <a href="https://t.me/GraverAdm" className="text-yellow-400 hover:text-yellow-300 text-sm inline-flex items-center">
                  {t.disclaimerTg} <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-white mb-8 text-center">FAQ</h2>
          <div className="space-y-3">
            {t.faq.map((item, i) => (
              <details key={i} className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between text-white font-medium">
                  <span>{item.q}</span>
                  <span className="text-teal-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-4 text-gray-400">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Graver.uz</p>
        </div>
      </footer>
    </div>
  );
}
