import { openTelegramWithTracking, trackPhoneClick } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Phone, Check, Award, Users, Clock, Package, ChevronRight, Star, Briefcase } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import B2CSeo from '../components/B2CSeo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate } from '../config/seo';

const ruContent = {
  slug: 'korporativnye-podarki',
  uzSlug: 'korporativ-sovgalar',
  title: 'Корпоративные подарки с гравировкой в Ташкенте',
  subtitle: 'Премиальные подарки с логотипом для B2B-клиентов. От 10 штук. Производство в Ташкенте.',
  meta: 'Корпоративные подарки с гравировкой и логотипом в Ташкенте. Ручки, часы, зажигалки, повербанки, ежедневники. Оптом от 10 штук. Срок 3–7 дней.',
  home: 'Главная',
  catalog: 'Каталог',
  heroTitle: 'Корпоративные подарки с гравировкой',
  heroSubtitle: 'Ваш логотип на премиальных изделиях. Для партнёров, клиентов и сотрудников.',
  heroCtaTelegram: 'Написать в Telegram',
  heroCtaPhone: 'Позвонить',
  whyTitle: 'Почему выбирают Graver Studio',
  why: [
    { icon: '🏭', title: 'Собственное производство', desc: 'Лазерная гравировка и УФ-печать в Ташкенте. Без посредников — быстрее и дешевле.' },
    { icon: '⚡', title: 'Срок 3–7 дней', desc: 'Стандартный заказ — 3–5 дней. Срочный — от 24 часов при наличии товара.' },
    { icon: '📦', title: 'От 10 штук', desc: 'Минимальный корпоративный тираж — 10 единиц. Скидки от 50 штук.' },
    { icon: '🎨', title: 'Бесплатный макет', desc: 'Готовим макет гравировки до оплаты. Вы видите результат до производства.' },
    { icon: '✅', title: 'Гарантия качества', desc: 'Каждый заказ проходит контроль. Брак заменяем за наш счёт.' },
    { icon: '🤝', title: 'Работаем с юрлицами', desc: 'Договор, счёт, акт. НДС. Полный пакет документов для бухгалтерии.' },
  ],
  productsTitle: 'Популярные корпоративные позиции',
  products: [
    { name: 'Часы с логотипом', price: 'от 350 000 сум', desc: 'Кварцевые часы с гравировкой логотипа. Кожаный или металлический ремешок.', link: '/ru/watches-with-logo', tag: 'Хит' },
    { name: 'Зажигалки с гравировкой', price: 'от 80 000 сум', desc: 'Металлические зажигалки Zippo-style с логотипом. Классика корпоративного подарка.', link: '/ru/products/lighters', tag: '' },
    { name: 'Ручки с гравировкой', price: 'от 25 000 сум', desc: 'Шариковые, роллеры, перьевые. Металлический корпус, гравировка имени или логотипа.', link: '/ru/engraved-gifts', tag: '' },
    { name: 'Повербанки с логотипом', price: 'от 90 000 сум', desc: 'Практичный корпоративный подарок. Гравировка или УФ-печать логотипа.', link: '/ru/engraved-gifts', tag: '' },
    { name: 'Ежедневники', price: 'от 50 000 сум', desc: 'Кожаные и экокожаные ежедневники с тиснением или гравировкой логотипа.', link: '/ru/engraved-gifts', tag: '' },
    { name: 'Наборы Neo Corporate', price: 'от 450 000 сум', desc: 'Готовый корпоративный набор: часы + ручка + зажигалка в фирменной упаковке.', link: '/ru/products/neo-corporate', tag: 'Набор' },
  ],
  processTitle: 'Как работает заказ',
  process: [
    { step: '1', title: 'Заявка', desc: 'Пишете в Telegram или звоните. Уточняем тираж, изделие, сроки.' },
    { step: '2', title: 'Макет', desc: 'Готовим макет гравировки с вашим логотипом. Бесплатно, до оплаты.' },
    { step: '3', title: 'Согласование', desc: 'Вы утверждаете макет. Вносим правки при необходимости.' },
    { step: '4', title: 'Производство', desc: 'Запускаем в производство. Срок 3–7 рабочих дней.' },
    { step: '5', title: 'Доставка', desc: 'Доставляем по Ташкенту или отправляем по Узбекистану.' },
  ],
  clientsTitle: 'Кто нас выбирает',
  clients: [
    { sector: 'IT-компании', desc: 'Welcome-паки для новых сотрудников, подарки на корпоративы.' },
    { sector: 'Банки и финтех', desc: 'Подарки клиентам и партнёрам с фирменной символикой.' },
    { sector: 'HoReCa', desc: 'Брендированные аксессуары для персонала и гостей.' },
    { sector: 'Девелоперы', desc: 'Подарки на сдачу объектов, новоселья, юбилеи компании.' },
    { sector: 'Ритейл', desc: 'Корпоративные подарки для партнёров и ключевых клиентов.' },
    { sector: 'Государственные структуры', desc: 'Официальные подарки с государственной символикой.' },
  ],
  faqTitle: 'Частые вопросы',
  faq: [
    { q: 'Какой минимальный тираж для корпоративного заказа?', a: 'Минимальный тираж — 10 штук. При заказе от 50 штук действуют скидки. Для единичных подарков (VIP-клиентам) работаем от 1 штуки.' },
    { q: 'Можно ли нанести логотип компании?', a: 'Да, это наша основная специализация. Принимаем логотип в формате SVG, AI, PDF или PNG с прозрачным фоном. При необходимости помогаем адаптировать логотип для гравировки.' },
    { q: 'Сколько стоит корпоративный заказ?', a: 'Стоимость зависит от изделия, тиража и сложности гравировки. Ориентировочно: ручки от 25 000 сум, зажигалки от 80 000 сум, часы от 350 000 сум. Точную цену рассчитываем после уточнения деталей.' },
    { q: 'Работаете ли вы с юридическими лицами?', a: 'Да. Заключаем договор, выставляем счёт, предоставляем акт выполненных работ. Работаем с НДС. Полный пакет документов для бухгалтерии.' },
    { q: 'Какой срок изготовления?', a: 'Стандартный заказ — 3–5 рабочих дней после утверждения макета и оплаты. Срочный заказ — от 24 часов (наценка 30%). Уточняйте наличие товара.' },
    { q: 'Делаете ли вы упаковку?', a: 'Да. Предлагаем фирменные коробки, крафт-пакеты, бархатные мешочки. Возможна брендированная упаковка с вашим логотипом (от 50 штук).' },
  ],
  relatedTitle: 'Смотрите также',
  formTitle: 'Получить расчёт стоимости',
  formSubtitle: 'Укажите тираж и изделие — рассчитаем за 15 минут',
};

const uzContent = {
  slug: 'korporativ-sovgalar',
  uzSlug: 'korporativ-sovgalar',
  title: 'Toshkentda gravyurali korporativ sovgalar',
  subtitle: 'B2B mijozlar uchun logotipli premium sovgalar. 10 donadan. Toshkentda ishlab chiqarish.',
  meta: 'Toshkentda gravyurali korporativ sovgalar. Ruchkalar, soatlar, zajigalka, powerbank, kundaliklar. Ulgurji 10 donadan. Muddati 3–7 kun.',
  home: 'Bosh sahifa',
  catalog: 'Katalog',
  heroTitle: 'Gravyurali korporativ sovgalar',
  heroSubtitle: 'Premium mahsulotlarda logotipingiz. Hamkorlar, mijozlar va xodimlar uchun.',
  heroCtaTelegram: 'Telegramda yozish',
  heroCtaPhone: 'Qo\'ng\'iroq qilish',
  whyTitle: 'Nima uchun Graver Studio-ni tanlashadi',
  why: [
    { icon: '🏭', title: 'O\'z ishlab chiqarish', desc: 'Toshkentda lazer gravyura va UV bosma. Vositachilarsiz — tezroq va arzonroq.' },
    { icon: '⚡', title: 'Muddati 3–7 kun', desc: 'Standart buyurtma — 3–5 kun. Shoshilinch — 24 soatdan (tovar mavjud bo\'lsa).' },
    { icon: '📦', title: '10 donadan', desc: 'Minimal korporativ tiraj — 10 dona. 50 donadan chegirmalar.' },
    { icon: '🎨', title: 'Bepul maket', desc: 'To\'lovgacha gravyura maketini tayyorlaymiz. Ishlab chiqarishdan oldin natijani ko\'rasiz.' },
    { icon: '✅', title: 'Sifat kafolati', desc: 'Har bir buyurtma nazoratdan o\'tadi. Nuqsonlarni o\'z hisobimizga almashtiramiz.' },
    { icon: '🤝', title: 'Yuridik shaxslar bilan ishlaymiz', desc: 'Shartnoma, hisob, dalolatnoma. QQS. Buxgalteriya uchun to\'liq hujjatlar to\'plami.' },
  ],
  productsTitle: 'Mashhur korporativ pozitsiyalar',
  products: [
    { name: 'Logotipli soatlar', price: '350 000 so\'mdan', desc: 'Logotip gravyurali kvarts soatlar. Charm yoki metall qayish.', link: '/uz/logotipli-soat', tag: 'Hit' },
    { name: 'Gravyurali zajigalkalar', price: '80 000 so\'mdan', desc: 'Logotipli metall zajigalkalar. Korporativ sovganing klassikasi.', link: '/uz/products/lighters', tag: '' },
    { name: 'Gravyurali ruchkalar', price: '25 000 so\'mdan', desc: 'Sharikli, roller, patli. Metall korpus, ism yoki logotip gravyurasi.', link: '/uz/gravirovkali-sovgalar', tag: '' },
    { name: 'Logotipli powerbanklar', price: '90 000 so\'mdan', desc: 'Amaliy korporativ sovga. Logotipning gravyurasi yoki UV bosma.', link: '/uz/gravirovkali-sovgalar', tag: '' },
    { name: 'Kundaliklar', price: '50 000 so\'mdan', desc: 'Logotip bosma yoki gravyurali charm va ekokozha kundaliklar.', link: '/uz/gravirovkali-sovgalar', tag: '' },
    { name: 'Neo Corporate to\'plamlari', price: '450 000 so\'mdan', desc: 'Tayyor korporativ to\'plam: soat + ruchka + zajigalka firma qadoqda.', link: '/uz/neo-korporativ', tag: 'To\'plam' },
  ],
  processTitle: 'Buyurtma qanday ishlaydi',
  process: [
    { step: '1', title: 'Ariza', desc: 'Telegramda yozing yoki qo\'ng\'iroq qiling. Tiraj, mahsulot, muddatlarni aniqlaymiz.' },
    { step: '2', title: 'Maket', desc: 'Logotipingiz bilan gravyura maketini tayyorlaymiz. Bepul, to\'lovgacha.' },
    { step: '3', title: 'Kelishuv', desc: 'Maketni tasdiqlaysiz. Kerak bo\'lsa tuzatishlar kiritamiz.' },
    { step: '4', title: 'Ishlab chiqarish', desc: 'Ishlab chiqarishga yuboramiz. Muddati 3–7 ish kuni.' },
    { step: '5', title: 'Yetkazib berish', desc: 'Toshkent bo\'ylab yetkazib beramiz yoki O\'zbekiston bo\'ylab jo\'natamiz.' },
  ],
  clientsTitle: 'Kimlar tanlaydi',
  clients: [
    { sector: 'IT kompaniyalar', desc: 'Yangi xodimlar uchun welcome-paklar, korporativ bayramlar uchun sovgalar.' },
    { sector: 'Banklar va fintech', desc: 'Firma ramzlari bilan mijozlar va hamkorlar uchun sovgalar.' },
    { sector: 'HoReCa', desc: 'Xodimlar va mehmonlar uchun brendlangan aksessuarlar.' },
    { sector: 'Developerlar', desc: 'Ob\'ekt topshirish, yangi uy, kompaniya yubileylari uchun sovgalar.' },
    { sector: 'Retail', desc: 'Hamkorlar va asosiy mijozlar uchun korporativ sovgalar.' },
    { sector: 'Davlat tuzilmalari', desc: 'Davlat ramzlari bilan rasmiy sovgalar.' },
  ],
  faqTitle: 'Ko\'p beriladigan savollar',
  faq: [
    { q: 'Korporativ buyurtma uchun minimal tiraj qancha?', a: 'Minimal tiraj — 10 dona. 50 donadan buyurtmada chegirmalar mavjud. VIP mijozlar uchun yakka sovgalar 1 donadan qabul qilinadi.' },
    { q: 'Kompaniya logotipini qo\'llash mumkinmi?', a: 'Ha, bu bizning asosiy ixtisosligimiz. SVG, AI, PDF yoki shaffof fonli PNG formatida logotip qabul qilamiz. Kerak bo\'lsa logotipni gravyura uchun moslashtirishga yordam beramiz.' },
    { q: 'Korporativ buyurtma qancha turadi?', a: 'Narx mahsulot, tiraj va gravyura murakkabligiga bog\'liq. Taxminan: ruchkalar 25 000 so\'mdan, zajigalkalar 80 000 so\'mdan, soatlar 350 000 so\'mdan. Tafsilotlarni aniqlagandan so\'ng aniq narxni hisoblaymiz.' },
    { q: 'Yuridik shaxslar bilan ishlaydimi?', a: 'Ha. Shartnoma tuzamiz, hisob-faktura beramiz, bajarilgan ishlar dalolatnomasini taqdim etamiz. QQS bilan ishlaymiz. Buxgalteriya uchun to\'liq hujjatlar to\'plami.' },
    { q: 'Tayyorlash muddati qancha?', a: 'Standart buyurtma — maket tasdiqlangandan va to\'lovdan keyin 3–5 ish kuni. Shoshilinch buyurtma — 24 soatdan (30% ustama). Tovar mavjudligini aniqlang.' },
    { q: 'Qadoqlash qilasizmi?', a: 'Ha. Firma qutilar, kraft paketlar, baxmal qopchalar taklif qilamiz. 50 donadan logotipingiz bilan brendlangan qadoqlash mumkin.' },
  ],
  relatedTitle: 'Shuningdek ko\'ring',
  formTitle: 'Narxni hisoblash',
  formSubtitle: 'Tiraj va mahsulotni ko\'rsating — 15 daqiqada hisoblaymiz',
};

export default function KorporativnyePodarkiPage() {
  const { locale = 'ru' } = useParams();
  const t = locale === 'uz' ? uzContent : ruContent;

  const canonicalPath = `/${locale}/${t.slug}`;
  const canonicalUrl = buildCanonical(canonicalPath);
  const ruUrl = `${BASE_URL}/ru/${ruContent.slug}/`;
  const uzUrl = `${BASE_URL}/uz/${uzContent.uzSlug}/`;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);

    // Service schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": t.title,
      "description": t.meta,
      "provider": {
        "@type": "LocalBusiness",
        "name": "Graver Studio",
        "url": "https://graver-studio.uz",
        "telephone": "+998770802288",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Tashkent",
          "addressCountry": "UZ"
        }
      },
      "areaServed": { "@type": "City", "name": "Tashkent" },
      "serviceType": locale === 'uz' ? "Korporativ sovgalar" : "Корпоративные подарки",
      "url": canonicalUrl
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.home, "item": `${BASE_URL}/${locale}/` },
        { "@type": "ListItem", "position": 2, "name": t.title, "item": canonicalUrl }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": t.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a }
      }))
    };

    ['service-schema', 'breadcrumb-schema', 'faq-schema'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    [
      { id: 'service-schema', data: serviceSchema },
      { id: 'breadcrumb-schema', data: breadcrumbSchema },
      { id: 'faq-schema', data: faqSchema },
    ].forEach(({ id, data }) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      ['service-schema', 'breadcrumb-schema', 'faq-schema'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [locale, t, canonicalUrl]);

  const scrollToForm = () => {
    const formEl = document.getElementById('b2c-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
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

      {/* Header */}
      <header className="bg-black/95 border-b border-gray-800 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="tel:+998770802288"
              className="hidden md:flex items-center text-gray-300 hover:text-teal-500 transition text-sm"
              data-track="tel"
              data-testid="header-corp"
              onClick={() => trackPhoneClick('header-corp')}
            >
              <Phone size={15} className="mr-1" />+998 77 080-22-88
            </a>
            <LanguageSwitcher />
            <a
              href="https://t.me/GraverAdm"
              className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center text-sm"
              onClick={(e) => openTelegramWithTracking(e, 'corp-header')}
            >
              <Send size={15} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{t.home}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">{t.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-6">
            <Briefcase size={14} className="text-teal-400 mr-2" />
            <span className="text-teal-400 text-sm font-medium">B2B · Ташкент · Узбекистан</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{t.heroTitle}</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{t.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/GraverAdm"
              className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition flex items-center justify-center"
              onClick={(e) => openTelegramWithTracking(e, 'corp-hero')}
            >
              <Send size={18} className="mr-2" />{t.heroCtaTelegram}
            </a>
            <button
              onClick={scrollToForm}
              className="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-teal-500 hover:text-teal-400 transition"
            >
              {locale === 'ru' ? 'Получить расчёт' : 'Narx olish'}
            </button>
          </div>
          {/* Trust bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'От 10 штук' : '10 donadan'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Срок 3–7 дней' : 'Muddati 3–7 kun'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Бесплатный макет' : 'Bepul maket'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Договор и НДС' : 'Shartnoma va QQS'}</span>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.whyTitle}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {t.why.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-14 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.productsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {t.products.map((prod, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition flex flex-col">
                {prod.tag && (
                  <span className="inline-block bg-teal-500/10 text-teal-400 text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit">
                    {prod.tag}
                  </span>
                )}
                <h3 className="text-white font-bold mb-1">{prod.name}</h3>
                <p className="text-teal-400 font-semibold text-sm mb-2">{prod.price}</p>
                <p className="text-gray-400 text-sm mb-4 flex-1">{prod.desc}</p>
                <Link
                  to={prod.link}
                  className="flex items-center text-teal-400 text-sm font-medium hover:text-teal-300 transition mt-auto"
                >
                  {locale === 'ru' ? 'Подробнее' : 'Batafsil'} <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={scrollToForm}
              className="bg-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-600 transition"
            >
              {locale === 'ru' ? 'Получить расчёт для вашего заказа' : 'Buyurtmangiz uchun narx olish'}
            </button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.processTitle}</h2>
          <div className="space-y-4">
            {t.process.map((step, i) => (
              <div key={i} className="flex items-start bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mr-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-14 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.clientsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {t.clients.map((client, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-teal-400 font-semibold mb-2">{client.sector}</h3>
                <p className="text-gray-400 text-sm">{client.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14" id="form">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{t.formTitle}</h2>
            <p className="text-gray-400">{t.formSubtitle}</p>
          </div>
          <B2CForm locale={locale} pageUrl={canonicalUrl} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-8">{t.faqTitle}</h2>
          <div className="space-y-3">
            {t.faq.map((item, i) => (
              <details key={i} className="group bg-gray-900 border border-gray-800 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer list-none flex justify-between items-center text-white text-sm font-medium">
                  {item.q}
                  <span className="text-teal-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-3">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-white mb-5">{t.relatedTitle}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={`/${locale}/welcome-packs`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'Welcome-паки для сотрудников' : 'Xodimlar uchun welcome-paklar'}
            </Link>
            <Link to={`/${locale}/vip-podarki`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'VIP-подарки для клиентов' : 'Mijozlar uchun VIP sovgalar'}
            </Link>
            <Link to={`/${locale}/products/neo-corporate`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'Набор Neo Corporate' : 'Neo Corporate to\'plami'}
            </Link>
            <Link to={`/${locale}/watches-with-logo`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'Часы с логотипом' : 'Logotipli soatlar'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">© 2026 Graver.uz — {locale === 'ru' ? 'Корпоративные подарки с гравировкой, Ташкент' : 'Toshkentda gravyurali korporativ sovgalar'}</div>
          <div className="flex gap-4">
            <a href="https://t.me/GraverAdm" className="text-gray-400 hover:text-teal-400 text-sm transition" onClick={(e) => openTelegramWithTracking(e, 'corp-footer')}>Telegram</a>
            <a href="tel:+998770802288" className="text-gray-400 hover:text-teal-400 text-sm transition" data-track="tel" data-testid="footer-corp">+998 77 080-22-88</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
