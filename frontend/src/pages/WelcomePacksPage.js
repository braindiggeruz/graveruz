import { openTelegramWithTracking, trackPhoneClick } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Phone, Check, ChevronRight, Package, Users, Star, Gift } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import B2CSeo from '../components/B2CSeo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical } from '../config/seo';

const ruContent = {
  slug: 'welcome-packs',
  uzSlug: 'welcome-paklar',
  title: 'Welcome-паки для новых сотрудников в Ташкенте',
  subtitle: 'Фирменные наборы для онбординга. Гравировка, логотип, упаковка. Производство в Ташкенте.',
  meta: 'Welcome-паки для новых сотрудников с гравировкой и логотипом в Ташкенте. Ручки, ежедневники, кружки, повербанки в фирменной упаковке. От 10 наборов.',
  home: 'Главная',
  heroTitle: 'Welcome-паки для новых сотрудников',
  heroSubtitle: 'Первый день в компании — самый важный. Встретьте нового сотрудника фирменным набором с гравировкой.',
  whyTitle: 'Почему welcome-пак с гравировкой работает',
  why: [
    { icon: '❤️', title: 'Первое впечатление', desc: 'Сотрудник чувствует себя ценным с первого дня. eNPS растёт на 15–20%.' },
    { icon: '🏷️', title: 'Персонализация', desc: 'Имя сотрудника на ручке, кружке или ежедневнике. Не безликий набор — личный подарок.' },
    { icon: '🎁', title: 'Готовый набор', desc: 'Подбираем состав под ваш бюджет. Упаковываем в фирменную коробку с логотипом.' },
    { icon: '⚡', title: 'Быстро и удобно', desc: 'Принимаем список имён — гравируем каждый предмет персонально. Срок 5–7 дней.' },
    { icon: '📊', title: 'Кейс: IT-компания', desc: 'Welcome-пак для 40 новых сотрудников. Часы + ручка + ежедневник. eNPS вырос с 42 до 67.' },
    { icon: '🤝', title: 'Договор и НДС', desc: 'Работаем с юрлицами. Договор, счёт, акт. Полный пакет документов.' },
  ],
  packagesTitle: 'Готовые варианты наборов',
  packages: [
    {
      name: 'Базовый',
      price: 'от 120 000 сум/набор',
      items: ['Ручка с гравировкой имени', 'Ежедневник с логотипом', 'Крафт-пакет'],
      highlight: false,
    },
    {
      name: 'Стандарт',
      price: 'от 280 000 сум/набор',
      items: ['Ручка с гравировкой имени', 'Ежедневник с логотипом', 'Повербанк с логотипом', 'Фирменная коробка'],
      highlight: true,
      tag: 'Популярный',
    },
    {
      name: 'Премиум',
      price: 'от 550 000 сум/набор',
      items: ['Часы с гравировкой имени', 'Ручка с гравировкой', 'Ежедневник с логотипом', 'Повербанк', 'Фирменная коробка + открытка'],
      highlight: false,
    },
  ],
  processTitle: 'Как заказать welcome-паки',
  process: [
    { step: '1', title: 'Заявка', desc: 'Сообщите количество наборов, состав и бюджет. Ответим за 30 минут.' },
    { step: '2', title: 'Список имён', desc: 'Передаёте список имён сотрудников для персональной гравировки.' },
    { step: '3', title: 'Макет', desc: 'Готовим макеты гравировки логотипа и имён. Согласовываем с вами.' },
    { step: '4', title: 'Производство', desc: 'Изготавливаем и упаковываем каждый набор. Срок 5–7 рабочих дней.' },
    { step: '5', title: 'Доставка', desc: 'Доставляем в офис или отправляем по Узбекистану.' },
  ],
  faqTitle: 'Частые вопросы',
  faq: [
    { q: 'Можно ли гравировать имя каждого сотрудника?', a: 'Да, это наша специализация. Вы передаёте список имён — мы гравируем каждый предмет персонально. Дополнительная стоимость за персонализацию — от 5 000 сум за позицию.' },
    { q: 'Какой минимальный заказ?', a: 'Минимальный заказ — 10 наборов. При заказе от 50 наборов действуют скидки. Для тестового заказа (1–5 наборов) возможно, но стоимость будет выше.' },
    { q: 'Что входит в welcome-пак?', a: 'Состав определяете вы. Популярные варианты: ручка + ежедневник + повербанк, или часы + ручка + ежедневник. Мы поможем подобрать оптимальный состав под ваш бюджет.' },
    { q: 'Можно ли добавить брендированную упаковку?', a: 'Да. Предлагаем фирменные коробки, крафт-пакеты, бархатные мешочки. Брендированная упаковка с вашим логотипом доступна от 50 наборов.' },
    { q: 'Как быстро вы делаете welcome-паки?', a: 'Стандартный срок — 5–7 рабочих дней после утверждения макетов. При срочном заказе (наценка 30%) — от 3 дней.' },
  ],
  relatedTitle: 'Смотрите также',
  formTitle: 'Рассчитать стоимость welcome-паков',
  formSubtitle: 'Укажите количество наборов и состав — рассчитаем за 15 минут',
};

const uzContent = {
  slug: 'welcome-paklar',
  uzSlug: 'welcome-paklar',
  title: 'Toshkentda yangi xodimlar uchun welcome-paklar',
  subtitle: 'Onboarding uchun firma to\'plamlari. Gravyura, logotip, qadoqlash. Toshkentda ishlab chiqarish.',
  meta: 'Toshkentda gravyura va logotipli yangi xodimlar uchun welcome-paklar. Firma qadoqda ruchkalar, kundaliklar, krujkalar, powerbanklar. 10 to\'plamdan.',
  home: 'Bosh sahifa',
  heroTitle: 'Yangi xodimlar uchun welcome-paklar',
  heroSubtitle: 'Kompaniyadagi birinchi kun — eng muhimi. Yangi xodimni gravyurali firma to\'plami bilan kutib oling.',
  whyTitle: 'Nima uchun gravyurali welcome-pak ishlaydi',
  why: [
    { icon: '❤️', title: 'Birinchi taassurot', desc: 'Xodim birinchi kundan o\'zini qadrli his qiladi. eNPS 15–20% oshadi.' },
    { icon: '🏷️', title: 'Shaxsiylashtirilgan', desc: 'Xodim ismi ruchka, krujka yoki kundalikda. Shaxssiz to\'plam emas — shaxsiy sovga.' },
    { icon: '🎁', title: 'Tayyor to\'plam', desc: 'Byudjetingizga mos tarkibni tanlaymiz. Logotipli firma qutisiga joylashtiramiz.' },
    { icon: '⚡', title: 'Tez va qulay', desc: 'Ismlar ro\'yxatini qabul qilamiz — har bir narsani shaxsan gravyura qilamiz. Muddati 5–7 kun.' },
    { icon: '📊', title: 'Keys: IT kompaniya', desc: '40 yangi xodim uchun welcome-pak. Soat + ruchka + kundalik. eNPS 42 dan 67 ga oshdi.' },
    { icon: '🤝', title: 'Shartnoma va QQS', desc: 'Yuridik shaxslar bilan ishlaymiz. Shartnoma, hisob, dalolatnoma. To\'liq hujjatlar.' },
  ],
  packagesTitle: 'Tayyor to\'plam variantlari',
  packages: [
    {
      name: 'Bazaviy',
      price: '120 000 so\'mdan/to\'plam',
      items: ['Ism gravyurali ruchka', 'Logotipli kundalik', 'Kraft paket'],
      highlight: false,
    },
    {
      name: 'Standart',
      price: '280 000 so\'mdan/to\'plam',
      items: ['Ism gravyurali ruchka', 'Logotipli kundalik', 'Logotipli powerbank', 'Firma qutisi'],
      highlight: true,
      tag: 'Mashhur',
    },
    {
      name: 'Premium',
      price: '550 000 so\'mdan/to\'plam',
      items: ['Ism gravyurali soat', 'Gravyurali ruchka', 'Logotipli kundalik', 'Powerbank', 'Firma qutisi + otkritka'],
      highlight: false,
    },
  ],
  processTitle: 'Welcome-paklarni qanday buyurtma qilish',
  process: [
    { step: '1', title: 'Ariza', desc: 'To\'plamlar soni, tarkibi va byudjetni bildiring. 30 daqiqada javob beramiz.' },
    { step: '2', title: 'Ismlar ro\'yxati', desc: 'Shaxsiy gravyura uchun xodimlar ismlar ro\'yxatini topshirasiz.' },
    { step: '3', title: 'Maket', desc: 'Logotip va ismlar gravyura maketlarini tayyorlaymiz. Siz bilan kelishamiz.' },
    { step: '4', title: 'Ishlab chiqarish', desc: 'Har bir to\'plamni yasab qadoqlaymiz. Muddati 5–7 ish kuni.' },
    { step: '5', title: 'Yetkazib berish', desc: 'Ofisga yetkazib beramiz yoki O\'zbekiston bo\'ylab jo\'natamiz.' },
  ],
  faqTitle: 'Ko\'p beriladigan savollar',
  faq: [
    { q: 'Har bir xodim ismini gravyura qilish mumkinmi?', a: 'Ha, bu bizning ixtisosligimiz. Ismlar ro\'yxatini topshirasiz — har bir narsani shaxsan gravyura qilamiz. Shaxsiylashtirishning qo\'shimcha narxi — pozitsiya uchun 5 000 so\'mdan.' },
    { q: 'Minimal buyurtma qancha?', a: 'Minimal buyurtma — 10 to\'plam. 50 to\'plamdan buyurtmada chegirmalar mavjud. Test buyurtmasi (1–5 to\'plam) mumkin, lekin narxi yuqoriroq bo\'ladi.' },
    { q: 'Welcome-pak tarkibiga nima kiradi?', a: 'Tarkibni siz belgilaysiz. Mashhur variantlar: ruchka + kundalik + powerbank, yoki soat + ruchka + kundalik. Byudjetingizga mos optimal tarkibni tanlashga yordam beramiz.' },
    { q: 'Brendlangan qadoqlash qo\'shish mumkinmi?', a: 'Ha. Firma qutilar, kraft paketlar, baxmal qopchalar taklif qilamiz. 50 to\'plamdan logotipingiz bilan brendlangan qadoqlash mavjud.' },
    { q: 'Welcome-paklarni qancha tez qilasiz?', a: 'Standart muddat — maketlar tasdiqlangandan keyin 5–7 ish kuni. Shoshilinch buyurtmada (30% ustama) — 3 kundan.' },
  ],
  relatedTitle: 'Shuningdek ko\'ring',
  formTitle: 'Welcome-paklar narxini hisoblash',
  formSubtitle: 'To\'plamlar soni va tarkibini ko\'rsating — 15 daqiqada hisoblaymiz',
};

export default function WelcomePacksPage() {
  const { locale = 'ru' } = useParams();
  const t = locale === 'uz' ? uzContent : ruContent;

  const canonicalPath = `/${locale}/${t.slug}`;
  const canonicalUrl = buildCanonical(canonicalPath);
  const ruUrl = `${BASE_URL}/ru/${ruContent.slug}/`;
  const uzUrl = `${BASE_URL}/uz/${uzContent.uzSlug}/`;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);

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
        "address": { "@type": "PostalAddress", "addressLocality": "Tashkent", "addressCountry": "UZ" }
      },
      "areaServed": { "@type": "City", "name": "Tashkent" },
      "serviceType": locale === 'uz' ? "Welcome-paklar" : "Welcome-паки",
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
            <a href="tel:+998770802288" className="hidden md:flex items-center text-gray-300 hover:text-teal-500 transition text-sm" onClick={() => trackPhoneClick('header-wp')}>
              <Phone size={15} className="mr-1" />+998 77 080-22-88
            </a>
            <LanguageSwitcher />
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center text-sm" onClick={(e) => openTelegramWithTracking(e, 'wp-header')}>
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
            <Users size={14} className="text-teal-400 mr-2" />
            <span className="text-teal-400 text-sm font-medium">HR · Onboarding · Ташкент</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{t.heroTitle}</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{t.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition flex items-center justify-center" onClick={(e) => openTelegramWithTracking(e, 'wp-hero')}>
              <Send size={18} className="mr-2" />{locale === 'ru' ? 'Написать в Telegram' : 'Telegramda yozish'}
            </a>
            <button onClick={scrollToForm} className="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-teal-500 hover:text-teal-400 transition">
              {locale === 'ru' ? 'Рассчитать стоимость' : 'Narxni hisoblash'}
            </button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'От 10 наборов' : '10 to\'plamdan'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Персональная гравировка' : 'Shaxsiy gravyura'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Срок 5–7 дней' : 'Muddati 5–7 kun'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Фирменная упаковка' : 'Firma qadoqlash'}</span>
          </div>
        </div>
      </section>

      {/* Why */}
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

      {/* Packages */}
      <section className="py-14 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.packagesTitle}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {t.packages.map((pkg, i) => (
              <div key={i} className={`rounded-2xl p-6 flex flex-col border transition ${pkg.highlight ? 'bg-teal-500/10 border-teal-500/50' : 'bg-gray-900 border-gray-800 hover:border-teal-500/30'}`}>
                {pkg.tag && (
                  <span className="inline-block bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3 w-fit">{pkg.tag}</span>
                )}
                <h3 className="text-white font-bold text-lg mb-1">{pkg.name}</h3>
                <p className="text-teal-400 font-semibold mb-4">{pkg.price}</p>
                <ul className="space-y-2 flex-1">
                  {pkg.items.map((item, j) => (
                    <li key={j} className="flex items-start text-sm text-gray-300">
                      <Check size={14} className="text-teal-500 mr-2 mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
                <button onClick={scrollToForm} className={`mt-5 w-full py-2.5 rounded-lg font-medium text-sm transition ${pkg.highlight ? 'bg-teal-500 text-white hover:bg-teal-600' : 'border border-gray-600 text-gray-300 hover:border-teal-500 hover:text-teal-400'}`}>
                  {locale === 'ru' ? 'Заказать' : 'Buyurtma'}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">{locale === 'ru' ? '* Состав наборов можно изменить под ваши задачи и бюджет' : '* To\'plam tarkibini vazifalaringiz va byudjetingizga moslash mumkin'}</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.processTitle}</h2>
          <div className="space-y-4">
            {t.process.map((step, i) => (
              <div key={i} className="flex items-start bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mr-4">{step.step}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14 bg-gray-900/50" id="form">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{t.formTitle}</h2>
            <p className="text-gray-400">{t.formSubtitle}</p>
          </div>
          <B2CForm locale={locale} pageUrl={canonicalUrl} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
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

      {/* Related */}
      <section className="py-10 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-white mb-5">{t.relatedTitle}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to={`/${locale}/korporativnye-podarki`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'Корпоративные подарки' : 'Korporativ sovgalar'}
            </Link>
            <Link to={`/${locale}/vip-podarki`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'VIP-подарки' : 'VIP sovgalar'}
            </Link>
            <Link to={`/${locale}/blog/welcome-pack-dlya-sotrudnikov-gid`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'Гид по welcome-пакам' : 'Welcome-pak bo\'yicha qo\'llanma'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">© 2026 Graver.uz — {locale === 'ru' ? 'Welcome-паки для сотрудников, Ташкент' : 'Toshkentda xodimlar uchun welcome-paklar'}</div>
          <div className="flex gap-4">
            <a href="https://t.me/GraverAdm" className="text-gray-400 hover:text-teal-400 text-sm transition" onClick={(e) => openTelegramWithTracking(e, 'wp-footer')}>Telegram</a>
            <a href="tel:+998770802288" className="text-gray-400 hover:text-teal-400 text-sm transition">+998 77 080-22-88</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
