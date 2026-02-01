import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, Shield } from 'lucide-react';

const translations = {
  ru: {
    title: "Гарантии качества",
    subtitle: "Ваша уверенность — наш приоритет",
    meta: "Гарантии Graver.uz: утверждение макета до производства, контроль качества, переделка при несоответствии.",
    back: "На главную",
    cta: "Оставить заявку",
    home: "Главная"
  },
  uz: {
    title: "Sifat kafolatlari",
    subtitle: "Sizning ishonchingiz — bizning ustuvorligimiz",
    meta: "Graver.uz kafolatlari: ishlab chiqarishdan oldin maketni tasdiqlash, sifat nazorati.",
    back: "Bosh sahifa",
    cta: "Ariza qoldirish",
    home: "Bosh sahifa"
  }
};

const guaranteesRu = [
  { title: "Макет до производства", desc: "Вы видите цифровой макет с точным размещением логотипа до начала работ." },
  { title: "Контроль качества", desc: "Проверяем каждую единицу продукции. Фотоотчёт перед отправкой." },
  { title: "Переделка при несоответствии", desc: "Если результат не соответствует макету — переделаем за наш счёт." },
  { title: "Гарантия на изделия", desc: "Гравировка устойчива к истиранию. При дефекте — замена." }
];

const guaranteesUz = [
  { title: "Ishlab chiqarishdan oldin maket", desc: "Ishni boshlashdan oldin logotipning aniq joylashuvi bilan raqamli maketni ko'rasiz." },
  { title: "Sifat nazorati", desc: "Har bir mahsulotni tekshiramiz. Yuborishdan oldin fotosurati." },
  { title: "Mos kelmaslik holatida qayta ishlash", desc: "Agar natija maketga mos kelmasa — hisobimizga qayta ishlaymiz." },
  { title: "Mahsulotlarga kafolat", desc: "Gravyura ishqalanishga chidamli. Nuqson bo'lsa — almashtirish." }
];

const BASE_URL = 'https://graver.uz';

export default function GuaranteesPage() {
  const { locale = 'ru' } = useParams();
  const t = translations[locale] || translations.ru;
  const guarantees = locale === 'uz' ? guaranteesUz : guaranteesRu;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
    
    // Inject JSON-LD via DOM (more reliable for CSR)
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": t.home,
          "item": `${BASE_URL}/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": t.title,
          "item": `${BASE_URL}/${locale}/guarantees`
        }
      ]
    };
    
    // Remove old schema if exists
    const oldSchema = document.getElementById('breadcrumb-schema');
    if (oldSchema) oldSchema.remove();
    
    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
    
    return () => {
      const schema = document.getElementById('breadcrumb-schema');
      if (schema) schema.remove();
    };
  }, [locale, t.home, t.title]);

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>{t.title} | Graver.uz</title>
        <meta name="description" content={t.meta} />
        <link rel="canonical" href={`${BASE_URL}/${locale}/guarantees`} />
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

      {/* Breadcrumb UI */}
      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{t.home}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">{t.title}</li>
          </ol>
        </div>
      </nav>

      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {guarantees.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/30 transition">
                <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-teal-500" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">{item.title}</h2>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${locale}#contact`} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition">
              {t.cta}
            </Link>
            <a href="https://t.me/GraverAdm" className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700 flex items-center justify-center">
              <Send size={18} className="mr-2" />Telegram
            </a>
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
