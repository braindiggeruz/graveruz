import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, AlertTriangle } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';

const ruContent = {
  slug: 'engraved-gifts',
  title: 'Ручки, повербанки и ежедневники с гравировкой',
  subtitle: 'Персонализированные подарки из нашего каталога',
  meta: 'Ручки, повербанки и ежедневники с гравировкой в Ташкенте. Цены от 25 000 сум. Сначала макет — потом производство.',
  home: 'Главная',
  catalog: 'Каталог',
  important: 'Важно',
  importantText: 'Работаем на нашей продукции из каталога. На изделиях клиента обычно не делаем.'
};

const uzContent = {
  slug: 'gravirovkali-sovgalar',
  title: 'Gravirovkali ruchka, powerbank va kundaliklar',
  subtitle: 'Katalogdan shaxsiylashtirilgan sovg\'alar',
  meta: 'Toshkentda gravirovkali ruchka, powerbank va kundaliklar. Narx 25 000 so\'mdan. Avval maket — keyin ishlab chiqarish.',
  home: 'Bosh sahifa',
  catalog: 'Katalog',
  important: 'Muhim',
  importantText: 'Katalogdagi mahsulotlarimizda ishlaymiz. Mijoz mahsulotlarida odatda qilmaymiz.'
};

const ruProducts = [
  { id: 'pen', name: 'Ручки с гравировкой', price: '25 000 – 200 000 сум', desc: 'Шариковые, роллеры, перьевые' },
  { id: 'powerbank', name: 'Повербанки с гравировкой', price: '90 000 – 600 000 сум', desc: 'Разные ёмкости и бренды' },
  { id: 'diary', name: 'Ежедневники', price: '50 000 – 250 000 сум', desc: 'Гравировка или УФ печать' }
];
const uzProducts = [
  { id: 'pen', name: 'Gravirovkali ruchka', price: '25 000 – 200 000 so\'m', desc: 'Sharikli, roller, patli' },
  { id: 'powerbank', name: 'Gravirovkali powerbank', price: '90 000 – 600 000 so\'m', desc: 'Turli sig\'im va brendlar' },
  { id: 'diary', name: 'Kundaliklar', price: '50 000 – 250 000 so\'m', desc: 'Gravirovka yoki UV bosma' }
];

const ruFaq = [
  { q: 'Чем отличается гравировка от УФ?', a: 'Гравировка — углубление, УФ — цветная печать.' },
  { q: 'Минимальный тираж?', a: 'От 1 штуки. 10+ — скидки.' },
  { q: 'Сколько времени?', a: '3-5 рабочих дней.' }
];
const uzFaq = [
  { q: 'Gravirovka va UV farqi?', a: 'Gravirovka — chuqurlik, UV — rangli bosma.' },
  { q: 'Minimal tiraj?', a: '1 donadan. 10+ — chegirmalar.' },
  { q: 'Qancha vaqt?', a: '3-5 ish kuni.' }
];

export default function EngravedGiftsPage() {
  const { locale = 'ru' } = useParams();
  const t = locale === 'uz' ? uzContent : ruContent;
  const products = locale === 'uz' ? uzProducts : ruProducts;
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

  const scrollToForm = () => {
    document.getElementById('b2c-form')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <p className="text-lg text-gray-400">{t.subtitle}</p>
        </div>
      </section>

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

      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="w-10 h-10 bg-teal-500/10 rounded-lg mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">{prod.name}</h3>
                <p className="text-teal-500 font-bold mb-2">{prod.price}</p>
                <p className="text-gray-400 text-sm mb-4">{prod.desc}</p>
                <button onClick={scrollToForm} className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition">
                  {locale === 'ru' ? 'Заказать' : 'Buyurtma'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <B2CForm locale={locale} pageUrl={canonicalUrl} />
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
