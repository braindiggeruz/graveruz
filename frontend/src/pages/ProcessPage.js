import { openTelegramWithTracking } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';

const stepsRu = [
  { title: "1. Заявка и консультация", time: "15-30 минут", desc: "Вы описываете задачу: что нужно брендировать, тираж, сроки." },
  { title: "2. Создание макета", time: "1-2 часа", desc: "Дизайнер создаёт цифровой макет с точным размещением вашего логотипа." },
  { title: "3. Утверждение", time: "По вашему графику", desc: "Вы согласовываете макет, вносите правки при необходимости." },
  { title: "4. Производство", time: "1-3 рабочих дня", desc: "Гравируем партию согласно утверждённому макету. Контроль качества." },
  { title: "5. Выдача", time: "В оговорённый срок", desc: "Доставка или самовывоз. Все документы для юрлиц." }
];

const stepsUz = [
  { title: "1. Ariza va maslahat", time: "15-30 daqiqa", desc: "Siz vazifani tasvirlaysiz: nimani brendlash kerak, tiraj, muddatlar." },
  { title: "2. Maket yaratish", time: "1-2 soat", desc: "Dizayner logotipingizning aniq joylashuvi bilan raqamli maket yaratadi." },
  { title: "3. Tasdiqlash", time: "Sizning jadvalingiz bo'yicha", desc: "Siz maketni tasdiqlaysiz, kerak bo'lsa o'zgartirishlar kiritasiz." },
  { title: "4. Ishlab chiqarish", time: "1-3 ish kuni", desc: "Tasdiqlangan maketga muvofiq partiyani gravyura qilamiz." },
  { title: "5. Topshirish", time: "Kelishilgan muddatda", desc: "Yetkazib berish yoki olib ketish. Barcha hujjatlar." }
];

export default function ProcessPage() {
  const { locale = 'ru' } = useParams();
  const { t } = useI18n();
  const steps = locale === 'uz' ? stepsUz : stepsRu;
  
  const home = locale === 'uz' ? 'Bosh sahifa' : 'Главная';
  const title = locale === 'uz' ? 'Ish jarayoni' : 'Процесс работы';
  const subtitle = locale === 'uz' ? 'Arizadan tayyor mahsulotgacha shaffof jarayon' : 'Прозрачный процесс от заявки до готовой продукции';
  const cta = locale === 'uz' ? 'Ariza qoldirish' : 'Оставить заявку';
  
  const pathname = `/${locale}/process`;
  const canonicalUrl = buildCanonical(pathname);
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
    
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": home, "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": title, "item": canonicalUrl }
      ]
    };
    
    const oldSchema = document.getElementById('breadcrumb-schema');
    if (oldSchema) oldSchema.remove();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
    
    return () => {
      var breadcrumbSchemaEl = document.getElementById('breadcrumb-schema');
      if (breadcrumbSchemaEl) {
        breadcrumbSchemaEl.remove();
      }
    };
  }, [locale, home, title, canonicalUrl]);

  return (
    <div className="min-h-screen bg-black">
      <SEOHead page="process" />

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
              onClick={(e) => openTelegramWithTracking(e, 'process-header')}
            >
              <Send size={16} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </header>

      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{home}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">{title}</li>
          </ol>
        </div>
      </nav>

      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-gray-400">{subtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/30 transition">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                <span className="text-teal-500 text-sm font-medium">{step.time}</span>
              </div>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${locale}#contact`} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition">
              {cta}
            </Link>
            <a href="https://t.me/GraverAdm" className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700 flex items-center justify-center"
              onClick={(e) => openTelegramWithTracking(e, 'process-cta')}
            >
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
