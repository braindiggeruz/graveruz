import { openTelegramWithTracking, trackPhoneClick } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Phone, Check, ChevronRight, Star, Award, Shield } from 'lucide-react';
import B2CForm from '../components/B2CForm';
import B2CSeo from '../components/B2CSeo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical } from '../config/seo';

const ruContent = {
  slug: 'vip-podarki',
  uzSlug: 'vip-sovgalar',
  title: 'VIP-подарки с гравировкой для партнёров и клиентов',
  subtitle: 'Премиальные персонализированные подарки для VIP-клиентов и ключевых партнёров. Производство в Ташкенте.',
  meta: 'VIP-подарки с гравировкой для партнёров и клиентов в Ташкенте. Часы, наборы, зажигалки с персональной гравировкой. Премиум-упаковка. От 1 штуки.',
  home: 'Главная',
  heroTitle: 'VIP-подарки с персональной гравировкой',
  heroSubtitle: 'Для ключевых партнёров, топ-клиентов и руководителей. Каждый подарок — уникальный.',
  whyTitle: 'Почему VIP-подарок с гравировкой',
  why: [
    { icon: '💎', title: 'Уникальность', desc: 'Персональная гравировка имени, даты или посвящения делает подарок незабываемым.' },
    { icon: '🏆', title: 'Статус', desc: 'Премиальные изделия: часы, зажигалки, наборы. Подчёркивают ценность отношений.' },
    { icon: '📦', title: 'Премиум-упаковка', desc: 'Бархатная коробка, фирменная лента, открытка с персональным текстом.' },
    { icon: '⚡', title: 'Срочное исполнение', desc: 'VIP-заказ от 1 штуки. Срочное изготовление за 24 часа при наличии товара.' },
    { icon: '🎯', title: 'Точность гравировки', desc: 'Лазерная гравировка с точностью до 0.1 мм. Логотип, подпись, координаты.' },
    { icon: '🤝', title: 'Конфиденциальность', desc: 'Работаем с конфиденциальными заказами. NDA по запросу.' },
  ],
  productsTitle: 'VIP-позиции',
  products: [
    { name: 'Часы с гравировкой', price: 'от 350 000 сум', desc: 'Кварцевые часы с персональной гравировкой на задней крышке. Кожаный или металлический ремешок. В бархатной коробке.', link: '/ru/watches-with-logo', tag: 'Топ' },
    { name: 'Набор Neo Corporate', price: 'от 450 000 сум', desc: 'Часы + ручка + зажигалка в фирменной коробке. Гравировка на каждом предмете. Идеально для партнёров.', link: '/ru/products/neo-corporate', tag: '' },
    { name: 'Набор Neo Gift', price: 'от 380 000 сум', desc: 'Часы + ручка в подарочной коробке. Персональная гравировка. Для особых случаев.', link: '/ru/products/neo-gift', tag: '' },
    { name: 'Зажигалка Zippo-style', price: 'от 120 000 сум', desc: 'Металлическая зажигалка с гравировкой логотипа или персональной надписи. Классика VIP-подарка.', link: '/ru/products/lighters', tag: '' },
    { name: 'Часы Neo Watches', price: 'от 280 000 сум', desc: 'Стильные часы с гравировкой. Несколько вариантов ремешка. Для деловых партнёров.', link: '/ru/products/neo-watches', tag: '' },
    { name: 'Индивидуальный набор', price: 'по запросу', desc: 'Формируем набор под ваш запрос и бюджет. Любые изделия из каталога с персональной гравировкой.', link: null, tag: 'Под заказ' },
  ],
  occasionsTitle: 'Поводы для VIP-подарка',
  occasions: [
    { title: 'Юбилей партнёрства', desc: 'Отметьте годовщину сотрудничества памятным подарком с датой и посвящением.' },
    { title: 'Подписание контракта', desc: 'Зафиксируйте важное событие подарком с гравировкой даты и имён сторон.' },
    { title: 'День рождения VIP-клиента', desc: 'Персональный подарок с именем и пожеланием — лучший способ укрепить отношения.' },
    { title: 'Новый год и праздники', desc: 'Эксклюзивные подарки для топ-клиентов и партнёров с персональной гравировкой.' },
    { title: 'Награждение сотрудников', desc: 'Памятные подарки за достижения с именем, должностью и датой.' },
    { title: 'Открытие офиса / юбилей компании', desc: 'Подарки для ключевых гостей с символикой события.' },
  ],
  faqTitle: 'Частые вопросы',
  faq: [
    { q: 'Можно ли заказать 1 VIP-подарок?', a: 'Да. VIP-подарки принимаем от 1 штуки. Стоимость единичного заказа выше, чем при тираже, но качество и внимание к деталям — максимальные.' },
    { q: 'Что можно гравировать на VIP-подарке?', a: 'Всё, что помещается на изделии: имя, дата, посвящение, логотип, координаты, подпись, QR-код. Максимальный размер текста зависит от изделия — уточним при заказе.' },
    { q: 'Есть ли премиум-упаковка?', a: 'Да. Предлагаем бархатные коробки, деревянные шкатулки, фирменные ленты и открытки с персональным текстом. Стоимость упаковки — от 15 000 сум.' },
    { q: 'Как быстро можно получить VIP-подарок?', a: 'Срочный заказ — от 24 часов при наличии товара (наценка 30%). Стандартный срок — 3–5 рабочих дней. Для особо срочных случаев — звоните, решаем индивидуально.' },
    { q: 'Работаете ли вы с конфиденциальными заказами?', a: 'Да. Подписываем NDA по запросу. Не раскрываем информацию о клиентах и заказах.' },
  ],
  relatedTitle: 'Смотрите также',
  formTitle: 'Заказать VIP-подарок',
  formSubtitle: 'Опишите задачу — подберём лучший вариант и рассчитаем стоимость',
};

const uzContent = {
  slug: 'vip-sovgalar',
  uzSlug: 'vip-sovgalar',
  title: 'Hamkorlar va mijozlar uchun gravyurali VIP sovgalar',
  subtitle: 'VIP mijozlar va asosiy hamkorlar uchun premium shaxsiylashtirilgan sovgalar. Toshkentda ishlab chiqarish.',
  meta: 'Toshkentda hamkorlar va mijozlar uchun gravyurali VIP sovgalar. Shaxsiy gravyurali soatlar, to\'plamlar, zajigalkalar. Premium qadoqlash. 1 donadan.',
  home: 'Bosh sahifa',
  heroTitle: 'Shaxsiy gravyurali VIP sovgalar',
  heroSubtitle: 'Asosiy hamkorlar, top mijozlar va rahbarlar uchun. Har bir sovga — noyob.',
  whyTitle: 'Nima uchun gravyurali VIP sovga',
  why: [
    { icon: '💎', title: 'Noyoblik', desc: 'Ism, sana yoki bag\'ishlash shaxsiy gravyurasi sovgani unutilmas qiladi.' },
    { icon: '🏆', title: 'Maqom', desc: 'Premium mahsulotlar: soatlar, zajigalkalar, to\'plamlar. Munosabatlarning qadrini ta\'kidlaydi.' },
    { icon: '📦', title: 'Premium qadoqlash', desc: 'Baxmal quti, firma lentasi, shaxsiy matnli otkritka.' },
    { icon: '⚡', title: 'Shoshilinch bajarish', desc: 'VIP buyurtma 1 donadan. Tovar mavjud bo\'lsa 24 soatda shoshilinch tayyorlash.' },
    { icon: '🎯', title: 'Gravyura aniqligi', desc: '0.1 mm aniqlikda lazer gravyura. Logotip, imzo, koordinatalar.' },
    { icon: '🤝', title: 'Maxfiylik', desc: 'Maxfiy buyurtmalar bilan ishlaymiz. So\'rov bo\'yicha NDA.' },
  ],
  productsTitle: 'VIP pozitsiyalar',
  products: [
    { name: 'Gravyurali soatlar', price: '350 000 so\'mdan', desc: 'Orqa qopqoqda shaxsiy gravyurali kvarts soatlar. Charm yoki metall qayish. Baxmal qutida.', link: '/uz/logotipli-soat', tag: 'Top' },
    { name: 'Neo Corporate to\'plami', price: '450 000 so\'mdan', desc: 'Firma qutisida soat + ruchka + zajigalka. Har bir narsada gravyura. Hamkorlar uchun ideal.', link: '/uz/neo-korporativ', tag: '' },
    { name: 'Neo Gift to\'plami', price: '380 000 so\'mdan', desc: 'Sovg\'a qutisida soat + ruchka. Shaxsiy gravyura. Maxsus munosabatlar uchun.', link: '/uz/neo-sovga', tag: '' },
    { name: 'Zippo-style zajigalka', price: '120 000 so\'mdan', desc: 'Logotip yoki shaxsiy yozuv gravyurali metall zajigalka. VIP sovganing klassikasi.', link: '/uz/products/lighters', tag: '' },
    { name: 'Neo Watches soatlari', price: '280 000 so\'mdan', desc: 'Gravyurali zamonaviy soatlar. Bir necha qayish varianti. Biznes hamkorlar uchun.', link: '/uz/neo-soatlar', tag: '' },
    { name: 'Individual to\'plam', price: 'so\'rov bo\'yicha', desc: 'So\'rovingiz va byudjetingizga mos to\'plamni shakllantiramiz. Katalogdagi istalgan mahsulot shaxsiy gravyura bilan.', link: null, tag: 'Buyurtmaga' },
  ],
  occasionsTitle: 'VIP sovga uchun munosabatlar',
  occasions: [
    { title: 'Hamkorlik yubileyi', desc: 'Sana va bag\'ishlash bilan esdalik sovgasi bilan hamkorlik yilligini nishonlang.' },
    { title: 'Shartnoma imzolash', desc: 'Sana va tomonlar ismlari gravyurali sovga bilan muhim voqeani mustahkamlang.' },
    { title: 'VIP mijoz tug\'ilgan kuni', desc: 'Ism va tilaklarli shaxsiy sovga — munosabatlarni mustahkamlashning eng yaxshi usuli.' },
    { title: 'Yangi yil va bayramlar', desc: 'Shaxsiy gravyurali top mijozlar va hamkorlar uchun eksklyuziv sovgalar.' },
    { title: 'Xodimlarni mukofotlash', desc: 'Ism, lavozim va sana bilan yutuqlar uchun esdalik sovgalari.' },
    { title: 'Ofis ochilishi / kompaniya yubileyi', desc: 'Asosiy mehmonlar uchun tadbir ramzlari bilan sovgalar.' },
  ],
  faqTitle: 'Ko\'p beriladigan savollar',
  faq: [
    { q: '1 ta VIP sovga buyurtma qilish mumkinmi?', a: 'Ha. VIP sovgalarni 1 donadan qabul qilamiz. Yakka buyurtma narxi tirajga qaraganda yuqoriroq, lekin sifat va tafsilotlarga e\'tibor — maksimal.' },
    { q: 'VIP sovgaga nima gravyura qilish mumkin?', a: 'Mahsulotga sig\'adigan hamma narsa: ism, sana, bag\'ishlash, logotip, koordinatalar, imzo, QR-kod. Matnning maksimal hajmi mahsulotga bog\'liq — buyurtma paytida aniqlaymiz.' },
    { q: 'Premium qadoqlash bormi?', a: 'Ha. Baxmal qutiler, yog\'och qutichalar, firma lentalar va shaxsiy matnli otkritka taklif qilamiz. Qadoqlash narxi — 15 000 so\'mdan.' },
    { q: 'VIP sovgani qancha tez olish mumkin?', a: 'Shoshilinch buyurtma — tovar mavjud bo\'lsa 24 soatdan (30% ustama). Standart muddat — 3–5 ish kuni. Ayniqsa shoshilinch holatlar uchun — qo\'ng\'iroq qiling, individual hal qilamiz.' },
    { q: 'Maxfiy buyurtmalar bilan ishlaysizmi?', a: 'Ha. So\'rov bo\'yicha NDA imzolaymiz. Mijozlar va buyurtmalar haqida ma\'lumot oshkor qilmaymiz.' },
  ],
  relatedTitle: 'Shuningdek ko\'ring',
  formTitle: 'VIP sovga buyurtma qilish',
  formSubtitle: 'Vazifani tasvirlab bering — eng yaxshi variantni tanlaymiz va narxni hisoblaymiz',
};

export default function VipPodarkiPage() {
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
      "serviceType": locale === 'uz' ? "VIP sovgalar" : "VIP-подарки",
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
            <a href="tel:+998770802288" className="hidden md:flex items-center text-gray-300 hover:text-teal-500 transition text-sm" onClick={() => trackPhoneClick('header-vip')}>
              <Phone size={15} className="mr-1" />+998 77 080-22-88
            </a>
            <LanguageSwitcher />
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center text-sm" onClick={(e) => openTelegramWithTracking(e, 'vip-header')}>
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
          <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-6">
            <Star size={14} className="text-yellow-400 mr-2" />
            <span className="text-yellow-400 text-sm font-medium">VIP · Premium · {locale === 'ru' ? 'От 1 штуки' : '1 donadan'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{t.heroTitle}</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{t.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition flex items-center justify-center" onClick={(e) => openTelegramWithTracking(e, 'vip-hero')}>
              <Send size={18} className="mr-2" />{locale === 'ru' ? 'Обсудить в Telegram' : 'Telegramda muhokama'}
            </a>
            <button onClick={scrollToForm} className="border border-gray-600 text-gray-300 px-6 py-3 rounded-xl font-semibold hover:border-teal-500 hover:text-teal-400 transition">
              {locale === 'ru' ? 'Оставить заявку' : 'Ariza qoldirish'}
            </button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'От 1 штуки' : '1 donadan'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Срочно за 24 часа' : 'Shoshilinch 24 soatda'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'Премиум-упаковка' : 'Premium qadoqlash'}</span>
            <span className="flex items-center"><Check size={14} className="text-teal-500 mr-1.5" />{locale === 'ru' ? 'NDA по запросу' : 'So\'rov bo\'yicha NDA'}</span>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.whyTitle}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {t.why.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/20 transition">
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
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/20 transition flex flex-col">
                {prod.tag && (
                  <span className="inline-block bg-yellow-500/10 text-yellow-400 text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit">{prod.tag}</span>
                )}
                <h3 className="text-white font-bold mb-1">{prod.name}</h3>
                <p className="text-teal-400 font-semibold text-sm mb-2">{prod.price}</p>
                <p className="text-gray-400 text-sm mb-4 flex-1">{prod.desc}</p>
                {prod.link ? (
                  <Link to={prod.link} className="flex items-center text-teal-400 text-sm font-medium hover:text-teal-300 transition mt-auto">
                    {locale === 'ru' ? 'Подробнее' : 'Batafsil'} <ChevronRight size={14} className="ml-1" />
                  </Link>
                ) : (
                  <button onClick={scrollToForm} className="flex items-center text-teal-400 text-sm font-medium hover:text-teal-300 transition mt-auto">
                    {locale === 'ru' ? 'Обсудить' : 'Muhokama'} <ChevronRight size={14} className="ml-1" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">{t.occasionsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {t.occasions.map((occ, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-yellow-400 font-semibold mb-2">{occ.title}</h3>
                <p className="text-gray-400 text-sm">{occ.desc}</p>
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
            <Link to={`/${locale}/welcome-packs`} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-teal-500/50 hover:text-teal-400 transition flex items-center">
              <ChevronRight size={14} className="mr-1" />{locale === 'ru' ? 'Welcome-паки' : 'Welcome-paklar'}
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
          <div className="text-gray-500 text-sm">© 2026 Graver.uz — {locale === 'ru' ? 'VIP-подарки с гравировкой, Ташкент' : 'Toshkentda gravyurali VIP sovgalar'}</div>
          <div className="flex gap-4">
            <a href="https://t.me/GraverAdm" className="text-gray-400 hover:text-teal-400 text-sm transition" onClick={(e) => openTelegramWithTracking(e, 'vip-footer')}>Telegram</a>
            <a href="tel:+998770802288" className="text-gray-400 hover:text-teal-400 text-sm transition">+998 77 080-22-88</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
