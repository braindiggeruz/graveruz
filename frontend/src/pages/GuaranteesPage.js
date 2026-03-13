import { openTelegramWithTracking } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Shield, CheckCircle, Eye, RefreshCw, Award, FileCheck, Truck, Clock } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';

const guaranteesRu = [
  { icon: 'Eye', title: "Макет до производства", desc: "Вы получаете цифровой макет с точным размещением логотипа и текста до начала работ. Утверждаете — только тогда запускаем. Никаких сюрпризов." },
  { icon: 'CheckCircle', title: "Контроль качества", desc: "Проверяем каждую единицу продукции вручную. Фотоотчёт перед отправкой — вы видите результат до получения." },
  { icon: 'RefreshCw', title: "Переделка при несоответствии", desc: "Если результат не соответствует утверждённому макету — переделаем за наш счёт. Без дополнительных условий и скрытых платежей." },
  { icon: 'Award', title: "Гарантия на гравировку", desc: "Лазерная гравировка устойчива к истиранию, влаге и ультрафиолету. При обнаружении производственного дефекта — бесплатная замена." },
  { icon: 'FileCheck', title: "Прозрачное ценообразование", desc: "Фиксированная цена после утверждения макета. Без скрытых доплат за срочность, цвет или количество правок на этапе согласования." },
  { icon: 'Truck', title: "Доставка и упаковка", desc: "Бережная упаковка каждого изделия. Доставка по Ташкенту — бесплатно при заказе от 10 единиц. Отправка по Узбекистану." }
];

const guaranteesUz = [
  { icon: 'Eye', title: "Ishlab chiqarishdan oldin maket", desc: "Logotip va matnning aniq joylashuvi bilan raqamli maketni olasiz. Tasdiqlaysiz — shundagina ishni boshlaymiz. Hech qanday kutilmagan holatlar." },
  { icon: 'CheckCircle', title: "Sifat nazorati", desc: "Har bir mahsulotni qo'lda tekshiramiz. Yuborishdan oldin fotosuratlar — natijani olishdan oldin ko'rasiz." },
  { icon: 'RefreshCw', title: "Mos kelmaslik holatida qayta ishlash", desc: "Agar natija tasdiqlangan maketga mos kelmasa — hisobimizga qayta ishlaymiz. Qo'shimcha shartlar va yashirin to'lovlarsiz." },
  { icon: 'Award', title: "Gravirovkaga kafolat", desc: "Lazer gravirovkasi ishqalanish, namlik va ultrabinafsha nurga chidamli. Ishlab chiqarish nuqsoni aniqlansa — bepul almashtirish." },
  { icon: 'FileCheck', title: "Shaffof narxlash", desc: "Maket tasdiqlanganidan keyin belgilangan narx. Shoshilinchlik, rang yoki kelishuv bosqichidagi tuzatishlar soni uchun yashirin qo'shimcha to'lovlarsiz." },
  { icon: 'Truck', title: "Yetkazib berish va qadoqlash", desc: "Har bir mahsulotni ehtiyotkorlik bilan qadoqlaymiz. 10 donadan ortiq buyurtmada Toshkent bo'ylab bepul yetkazib berish. O'zbekiston bo'ylab jo'natish." }
];

const processRu = [
  { step: "01", title: "Заявка", desc: "Вы описываете задачу: что нужно, на каком изделии, в каком количестве." },
  { step: "02", title: "Макет", desc: "Дизайнер готовит макет с точным размещением. Вы утверждаете или вносите правки." },
  { step: "03", title: "Производство", desc: "Запускаем лазерную гравировку. Контроль качества на каждом этапе." },
  { step: "04", title: "Фотоотчёт", desc: "Отправляем фото готовой продукции до отправки. Вы проверяете результат." },
  { step: "05", title: "Доставка", desc: "Бережная упаковка и доставка. По Ташкенту — бесплатно от 10 единиц." }
];

const processUz = [
  { step: "01", title: "Ariza", desc: "Vazifani tasvirlaysiz: nima kerak, qaysi mahsulotda, qancha miqdorda." },
  { step: "02", title: "Maket", desc: "Dizayner aniq joylashuv bilan maket tayyorlaydi. Tasdiqlaysiz yoki tuzatishlar kiritasiz." },
  { step: "03", title: "Ishlab chiqarish", desc: "Lazer gravirovkasini boshlaymiz. Har bir bosqichda sifat nazorati." },
  { step: "04", title: "Fotosuratlar", desc: "Jo'natishdan oldin tayyor mahsulot suratlarini yuboramiz. Natijani tekshirasiz." },
  { step: "05", title: "Yetkazib berish", desc: "Ehtiyotkorlik bilan qadoqlash va yetkazib berish. 10 donadan ortiq — Toshkent bo'ylab bepul." }
];

const faqRu = [
  { q: "Что делать, если результат не понравился?", a: "Если гравировка не соответствует утверждённому макету — переделаем бесплатно. Если хотите изменить дизайн после утверждения — обсудим условия индивидуально." },
  { q: "Сколько правок макета включено в стоимость?", a: "Количество правок на этапе согласования не ограничено. Мы работаем до полного утверждения макета без доплат." },
  { q: "Как долго держится лазерная гравировка?", a: "Лазерная гравировка — это физическое изменение поверхности материала. Она не стирается, не выцветает и не смывается. Срок службы — весь срок эксплуатации изделия." },
  { q: "Можно ли заказать тестовый образец?", a: "Да, вы можете заказать 1 тестовый образец перед основным тиражом. Стоимость — как за единичное изделие." }
];

const faqUz = [
  { q: "Natija yoqmasa nima qilish kerak?", a: "Agar gravirovka tasdiqlangan maketga mos kelmasa — bepul qayta ishlaymiz. Tasdiqlashdan keyin dizaynni o'zgartirmoqchi bo'lsangiz — shartlarni individual muhokama qilamiz." },
  { q: "Maketga nechta tuzatish kiritish mumkin?", a: "Kelishuv bosqichidagi tuzatishlar soni cheklanmagan. Maket to'liq tasdiqlanguncha qo'shimcha to'lovsiz ishlaymiz." },
  { q: "Lazer gravirovkasi qancha vaqt saqlanadi?", a: "Lazer gravirovkasi — material yuzasining fizik o'zgarishi. U ishqalanmaydi, rangini yo'qotmaydi va yuvilmaydi. Xizmat muddati — mahsulotning butun foydalanish muddati." },
  { q: "Sinov namunasini buyurtma qilish mumkinmi?", a: "Ha, asosiy tirajdan oldin 1 ta sinov namunasini buyurtma qilishingiz mumkin. Narxi — bitta mahsulot uchun bo'lgani kabi." }
];

const iconMap = {
  Eye: Eye,
  CheckCircle: CheckCircle,
  RefreshCw: RefreshCw,
  Award: Award,
  FileCheck: FileCheck,
  Truck: Truck,
};

export default function GuaranteesPage() {
  const { locale = 'ru' } = useParams();
  const { t } = useI18n();
  const guarantees = locale === 'uz' ? guaranteesUz : guaranteesRu;
  const process = locale === 'uz' ? processUz : processRu;
  const faq = locale === 'uz' ? faqUz : faqRu;
  
  const home = locale === 'uz' ? 'Bosh sahifa' : 'Главная';
  const title = locale === 'uz' ? 'Sifat kafolatlari' : 'Гарантии качества';
  const subtitle = locale === 'uz' ? 'Sizning ishonchingiz — bizning ustuvorligimiz. Har bir buyurtma shaffof jarayon va aniq kafolatlar bilan himoyalangan.' : 'Ваша уверенность — наш приоритет. Каждый заказ защищён прозрачным процессом и конкретными гарантиями.';
  const cta = locale === 'uz' ? 'Ariza qoldirish' : 'Оставить заявку';
  const processTitle = locale === 'uz' ? 'Jarayon qanday ishlaydi' : 'Как работает процесс';
  const faqTitle = locale === 'uz' ? 'Ko\'p beriladigan savollar' : 'Частые вопросы';
  
  const pathname = `/${locale}/guarantees`;
  const canonicalUrl = buildCanonical(pathname);
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
    
    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": home, "item": `${BASE_URL}/${locale}` },
            { "@type": "ListItem", "position": 2, "name": title, "item": canonicalUrl }
          ]
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
    
    const oldSchema = document.getElementById('breadcrumb-schema');
    if (oldSchema) oldSchema.remove();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(schemaGraph);
    document.head.appendChild(script);
    
    return () => {
      var breadcrumbSchemaEl = document.getElementById('breadcrumb-schema');
      if (breadcrumbSchemaEl) {
        breadcrumbSchemaEl.remove();
      }
    };
  }, [locale, home, title, canonicalUrl, faq]);

  return (
    <div className="min-h-screen bg-black">
      <SEOHead page="guarantees" />

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
              onClick={(e) => openTelegramWithTracking(e, 'guarantees-header')}
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
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </section>

      {/* Guarantees Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guarantees.map((item, i) => {
              const IconComponent = iconMap[item.icon] || Shield;
              return (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/30 transition">
                  <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="text-teal-500" size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3">{item.title}</h2>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">{processTitle}</h2>
          <div className="space-y-6">
            {process.map((item, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-teal-500 font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">{faqTitle}</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="group bg-gray-900 border border-gray-800 rounded-xl">
                <summary className="px-6 py-4 cursor-pointer list-none flex justify-between text-white font-medium">
                  {item.q}
                  <span className="text-teal-500 group-open:rotate-180 transition-transform ml-4 flex-shrink-0">▼</span>
                </summary>
                <div className="px-6 pb-4 text-gray-400 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${locale}#contact`} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition">
              {cta}
            </Link>
            <a href="https://t.me/GraverAdm" className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700 flex items-center justify-center"
              onClick={(e) => openTelegramWithTracking(e, 'guarantees-cta')}
            >
              <Send size={18} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 Graver.uz</p>
        </div>
      </footer>
    </div>
  );
}
