import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, ArrowRight, AlertTriangle } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import B2CSeo from '../components/B2CSeo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';

const ruContent = {
  slug: 'catalog-products',
  title: 'Продукция с гравировкой (в наличии)',
  subtitle: 'Выберите категорию и получите макет',
  meta: 'Часы, ручки, зажигалки, повербанки и ежедневники с лазерной гравировкой в Ташкенте. Сначала макет — потом производство.',
  home: 'Главная',
  disclaimer: 'Мы делаем гравировку на нашей продукции из каталога. На изделиях клиента обычно не работаем.',
  disclaimerTg: 'Есть своё изделие? Напишите в Telegram →',
  cta: 'Заявка',
  details: 'Подробнее'
};

const uzContent = {
  slug: 'mahsulotlar-katalogi',
  title: 'Gravirovkali mahsulotlar (mavjud)',
  subtitle: 'Kategoriyani tanlang va maket oling',
  meta: 'Toshkentda soat, ruchka, zajigalka, powerbank va kundaliklar lazer gravirovkasi bilan. Avval maket — keyin ishlab chiqarish.',
  home: 'Bosh sahifa',
  disclaimer: 'Biz katalogdagi mahsulotlarimizda gravirovka qilamiz. Mijoz mahsulotlarida ishlamaymiz.',
  disclaimerTg: 'Mahsulotingiz bormi? Telegramga yozing →',
  cta: 'Ariza',
  details: 'Batafsil'
};

const ruCategories = [
  { id: 'watches', name: 'Часы с логотипом', price: '450 000 – 2 000 000 сум', desc: 'Наши модели', link: 'watches-with-logo', img: '/catalog/watches.png' },
  { id: 'lighters', name: 'Зажигалки (аналог Zippo)', price: '140 000 – 290 000 сум', desc: '1 или 2 стороны', link: 'products/lighters', img: '/catalog/lighters.png' },
  { id: 'pen', name: 'Ручки с гравировкой', price: '25 000 – 200 000 сум', desc: 'Зависит от модели', link: 'engraved-gifts', img: '/catalog/pen.png' },
  { id: 'powerbank', name: 'Повербанки', price: '90 000 – 600 000 сум', desc: 'Зависит от бренда', link: 'engraved-gifts', img: '/catalog/powerbank.png' },
  { id: 'diary', name: 'Ежедневники', price: '50 000 – 250 000 сум', desc: 'Гравировка или УФ', link: 'engraved-gifts', img: '/catalog/diary.png' }
];

const uzCategories = [
  { id: 'watches', name: 'Logotipli soat', price: '450 000 – 2 000 000', desc: 'Bizning modellar', link: 'logotipli-soat', img: '/catalog/watches.png' },
  { id: 'lighters', name: 'Zajigalka (Zippo)', price: '140 000 – 290 000', desc: '1 yoki 2 tomon', link: 'products/lighters', img: '/catalog/lighters.png' },
  { id: 'pen', name: 'Gravirovkali ruchka', price: '25 000 – 200 000', desc: 'Modelga qarab', link: 'gravirovkali-sovgalar', img: '/catalog/pen.png' },
  { id: 'powerbank', name: 'Powerbank', price: '90 000 – 600 000', desc: 'Brendga qarab', link: 'gravirovkali-sovgalar', img: '/catalog/powerbank.png' },
  { id: 'diary', name: 'Kundaliklar', price: '50 000 – 250 000', desc: 'Gravirovka/UV', link: 'gravirovkali-sovgalar', img: '/catalog/diary.png' }
];

const ruFaq = [
  { q: 'Можно принести своё изделие?', a: 'Обычно нет — работаем на нашей продукции.' },
  { q: 'Как выбрать модель?', a: 'Напишите бюджет — подберём варианты.' },
  { q: 'Сколько времени?', a: 'Стандарт: 3-5 дней.' }
];

const uzFaq = [
  { q: 'O\'z mahsulotimni keltirsa bo\'ladimi?', a: 'Odatda yo\'q — o\'z mahsulotlarimizda ishlaymiz.' },
  { q: 'Modelni qanday tanlash?', a: 'Byudjetni yozing — variantlar tanlaymiz.' },
  { q: 'Qancha vaqt?', a: 'Standart: 3-5 kun.' }
];

const relatedBlogPosts = {
  ru: [
    { slug: 'kak-vybrat-korporativnyj-podarok', title: 'Как выбрать корпоративный подарок' },
    { slug: 'korporativnye-podarki-s-logotipom-polnyy-gayd', title: 'Полный гайд: корпоративные подарки' }
  ],
  uz: [
    { slug: 'korporativ-sovgani-qanday-tanlash', title: 'Korporativ sovgani qanday tanlash' },
    { slug: 'korporativ-sovgalar-logotip-bilan-to-liq-qollanma', title: 'To\'liq qollanma: korporativ sovgalar' }
  ]
};

export default function CatalogPage() {
  const { locale = 'ru' } = useParams();
  const t = locale === 'uz' ? uzContent : ruContent;
  const cats = locale === 'uz' ? uzCategories : ruCategories;
  const faq = locale === 'uz' ? uzFaq : ruFaq;
  
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
        { "@type": "ListItem", "position": 2, "name": t.title, "item": canonicalUrl }
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
      var breadcrumbSchemaEl = document.getElementById('breadcrumb-schema');
      if (breadcrumbSchemaEl) {
        breadcrumbSchemaEl.remove();
      }
      var faqSchemaEl = document.getElementById('faq-schema');
      if (faqSchemaEl) {
        faqSchemaEl.remove();
      }
    };
  }, [locale, t, canonicalUrl, faq]);

  useEffect(() => {
    document.querySelectorAll('[data-seo-product]').forEach(el => el.remove());

    cats.forEach((item) => {
      const priceNumbers = (item.price.match(/[\d\s]+/g) || []).map(value => value.replace(/\s/g, ''));
      const lowPrice = priceNumbers[0] || '0';
      const highPrice = priceNumbers[1] || lowPrice;

      const productSchema = document.createElement('script');
      productSchema.type = 'application/ld+json';
      productSchema.setAttribute('data-seo-product', 'true');
      productSchema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: item.name,
        description: item.desc,
        image: `${BASE_URL}${item.img}`,
        brand: {
          '@type': 'Brand',
          name: 'Graver.uz'
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'UZS',
          lowPrice,
          highPrice,
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/${locale}/${item.link}`
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '120'
        }
      });

      document.head.appendChild(productSchema);
    });

    return () => {
      document.querySelectorAll('[data-seo-product]').forEach(el => el.remove());
    };
  }, [locale, cats]);

  const scrollToForm = () => {
    var formEl = document.getElementById('b2c-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
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
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{t.home}</Link></li>
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

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat, index) => (
              <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover" 
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : undefined}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-teal-500 font-semibold mb-1">{cat.price}</p>
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
            ))}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-5 flex items-start">
            <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-yellow-200 font-medium mb-1">{t.disclaimer}</p>
              <a href="https://t.me/GraverAdm" className="text-yellow-400 hover:text-yellow-300 text-sm">{t.disclaimerTg}</a>
            </div>
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

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              {locale === 'ru' ? 'Полезные статьи' : 'Foydali maqolalar'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(relatedBlogPosts[locale] || []).map((post, idx) => (
                <Link
                  key={idx}
                  to={`/${locale}/blog/${post.slug}`}
                  className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition border border-gray-700 hover:border-teal-500"
                >
                  <p className="text-teal-400 font-semibold">{post.title}</p>
                  <p className="text-gray-400 text-sm mt-2">→ {locale === 'ru' ? 'Читать' : "O'qish"}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">© 2025 Graver.uz</div>
      </footer>
    </div>
  );
}
