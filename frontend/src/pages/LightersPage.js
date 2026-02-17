import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SeoMeta from '../components/SeoMeta';
import { ArrowLeft, Download, Phone, Send, Flame, Shield, Ruler, Scale, ChevronRight } from 'lucide-react';
import { BASE_URL, buildCanonical, buildAlternate } from '../config/seo';

// Product data from catalog
const products = [
  {
    id: 'silver-gloss',
    sku: 'R-109',
    nameRu: 'Silver Gloss',
    nameUz: 'Silver Gloss',
    price: 140000,
    descRu: 'Минималистичная персонализация: имя, дата, инициалы — чисто и строго.',
    descUz: "Minimal va tartibli: ism, sana, initsial — toza ko'rinadi.",
    bestFor: ['logos', 'text', 'contour'],
    color: 'from-gray-300 to-gray-100',
    image: 'https://customer-assets.emergentagent.com/job_gift-seo-fix/artifacts/4ihfymxb_r109_silver_gloss_clean.jpg',
    altRu: 'Серебристая глянцевая зажигалка R-109 с лазерной гравировкой',
    altUz: 'R-109 kumushrang yaltiroq zajigalka lazer gravyurasi bilan'
  },
  {
    id: 'black-matte',
    sku: 'R-110',
    nameRu: 'Black Matte',
    nameUz: 'Black Matte',
    price: 150000,
    descRu: 'Логотип или символ + короткая подпись: баланс "видно" и "смысл".',
    descUz: "Logotip yoki belgi + qisqa yozuv: ko'rinish va ma'no muvozanati.",
    bestFor: ['photos', 'detailed', 'portraits'],
    color: 'from-gray-800 to-gray-900',
    image: 'https://customer-assets.emergentagent.com/job_gift-seo-fix/artifacts/nngktupr_r110_black_matte_clean.jpg',
    altRu: 'Чёрная матовая зажигалка R-110 для фотогравировки',
    altUz: 'R-110 qora mat zajigalka foto-gravirovka uchun'
  },
  {
    id: 'black-texture',
    sku: 'R-111',
    nameRu: 'Black Texture',
    nameUz: 'Black Texture',
    price: 170000,
    descRu: 'Контрастный стиль для монограммы или короткой фразы — выглядит собрано.',
    descUz: "Kontrastli uslub: monogramma yoki qisqa ibora uchun juda mos.",
    bestFor: ['graphic', 'deep', 'brutal'],
    color: 'from-gray-700 to-black',
    image: 'https://customer-assets.emergentagent.com/job_gift-seo-fix/artifacts/y6oyh6d2_r111_black_texture.jpg',
    altRu: 'Текстурированная чёрная зажигалка R-111 для глубокой гравировки',
    altUz: 'R-111 teksturali qora zajigalka chuqur gravirovka uchun'
  },
  {
    id: 'brushed-steel',
    sku: 'R-112',
    nameRu: 'Brushed Steel',
    nameUz: 'Brushed Steel',
    price: 160000,
    descRu: 'Максимум индивидуальности: знак/логотип и отдельная подпись (если на странице есть гравировка с двух сторон).',
    descUz: "Maksimal individuallik: belgi/logotip va alohida yozuv (agar sahifada ikki tomon opsiyasi bo'lsa).",
    bestFor: ['text', 'universal', 'daily'],
    color: 'from-gray-500 to-gray-400',
    image: 'https://customer-assets.emergentagent.com/job_gift-seo-fix/artifacts/46fmjowk_r112_brushed_steel.jpg',
    altRu: 'Зажигалка R-112 из шлифованной стали — универсальный выбор',
    altUz: "R-112 silliqlangan po'lat zajigalka — universal tanlov"
  }
];

// Specifications
const specs = {
  height: '57 мм',
  width: '38 мм',
  depth: '13 мм',
  weight: '55-60 г'
};

// Engraving types (Benefits)
const engravingTypes = [
  { nameRu: 'Чёткая лазерная гравировка по металлу: линии читаются, края ровные', nameUz: "Metallga aniq lazer gravyura: chiziqlar o'qiladi, konturlar silliq", icon: '✓' },
  { nameRu: 'Макет до нанесения: вы видите, как будет выглядеть готовый вариант', nameUz: "Gravyuradan oldin maket: tayyor ko'rinishini avval ko'rasiz", icon: '✓' },
  { nameRu: 'Подходит для подарка и брендинга: инициалы, символы, логотипы', nameUz: "Sovg'a va brendlash uchun: initsial, belgi, logotip, qisqa ibora", icon: '✓' },
  { nameRu: 'Премиальный "вес" вещи: минимализм, который запоминается', nameUz: "Minimalizm + \"vazn\": ko'rinishi jiddiy, esda qoladi", icon: '✓' },
  { nameRu: 'Гравируем на нашей продукции — стабильный результат', nameUz: "Gravyurani o'z mahsulotimizga qilamiz — sirt toza, natija barqaror", icon: '✓' },
  { nameRu: 'Можно сделать лаконично или "с историей" — на одной или двух сторонах', nameUz: "Bir tomonga yoki ikki tomonga: qisqa yoki \"ma'noli\" variant", icon: '✓' }
];

function LightersPage() {
  const { locale } = useParams();
  const isRu = locale === 'ru';

  const pathname = `/${locale}/products/lighters`;
  const canonicalUrl = buildCanonical(pathname);
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');
  const catalogPath = locale === 'ru' ? `/${locale}/catalog-products/` : `/${locale}/mahsulotlar-katalogi/`;
  
  // PATCH 1: SEO-optimized Title & Description from audit
  const pageTitle = isRu 
    ? 'Эксклюзивные зажигалки с лазерной гравировкой — Graver.uz'
    : 'Lazer gravyurasi bilan eksklyuziv zajigalkalar – Graver.uz';
  
  const pageDescription = isRu
    ? 'Закажите зажигалки с лазерной гравировкой в Ташкенте. Гравировка логотипов, имен и фото на зажигалках Zippo-типа.'
    : "Toshkentda lazer gravyurasi bilan zajigalkalarga buyurtma bering. Zippo turidagi zajigalkalarga logotiplar, ismlar va fotosuratlar gravyurasi.";

  const lightersGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Graver.uz",
        "url": BASE_URL,
        "logo": `${BASE_URL}/logo192.png`
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "Graver.uz",
        "publisher": { "@id": `${BASE_URL}/#organization` }
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": pageTitle,
        "description": pageDescription,
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "inLanguage": isRu ? "ru" : "uz"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": isRu ? "Главная" : "Bosh sahifa", "item": `${BASE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": isRu ? "Продукция" : "Mahsulotlar", "item": `${BASE_URL}${catalogPath}` },
          { "@type": "ListItem", "position": 3, "name": isRu ? "Зажигалки" : "Zajigalkalar", "item": canonicalUrl }
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#itemlist`,
        "name": isRu ? "Модели зажигалок" : "Zajigalka modellari",
        "itemListElement": products.map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": isRu ? product.nameRu : product.nameUz,
          "url": `${canonicalUrl}#${product.id}`
        }))
      },
      ...products.map((product) => ({
        "@type": "Product",
        "@id": `${canonicalUrl}#${product.id}`,
        "name": isRu ? `Зажигалка ${product.nameRu} с гравировкой` : `${product.nameUz} gravyurali zajigalka`,
        "description": isRu ? product.descRu : product.descUz,
        "image": product.image,
        "sku": product.sku,
        "brand": { "@id": `${BASE_URL}/#organization` },
        "offers": {
          "@type": "Offer",
          "price": String(product.price),
          "priceCurrency": "UZS",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        }
      }))
    ]
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat(isRu ? 'ru-RU' : 'uz-UZ').format(price);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SeoMeta
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        ruUrl={ruUrl}
        uzUrl={uzUrl}
        locale={locale}
        ogType="website"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(lightersGraphSchema)}
        </script>
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
            </Link>
            <div className="flex items-center gap-4">
              <a 
                href="/catalogs/graver-lighters-catalog-2026.pdf" 
                download
                className="hidden sm:flex items-center gap-2 text-teal-500 hover:text-teal-400 transition text-sm"
              >
                <Download size={16} />
                {isRu ? 'Скачать каталог' : 'Katalogni yuklab olish'}
              </a>
              <Link to={`/${locale}`} className="text-gray-300 hover:text-teal-500 transition flex items-center">
                <ArrowLeft size={18} className="mr-2" />
                {isRu ? 'На главную' : 'Bosh sahifaga'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden" data-testid="lighters-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4" data-testid="language-switcher">
            <div className="inline-flex bg-gray-800 rounded-lg p-1 border border-gray-700">
              <Link
                to="/ru/products/lighters"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isRu ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                data-testid="lang-ru"
              >
                RU
              </Link>
              <Link
                to="/uz/products/lighters"
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  !isRu ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                data-testid="lang-uz"
              >
                UZ
              </Link>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link to={`/${locale}`} className="hover:text-teal-500 transition">{isRu ? 'Главная' : 'Bosh sahifa'}</Link></li>
              <li>/</li>
              <li><span className="text-gray-400">{isRu ? 'Продукция' : 'Mahsulotlar'}</span></li>
              <li>/</li>
              <li className="text-teal-500">{isRu ? 'Зажигалки' : 'Zajigalkalar'}</li>
            </ol>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm mb-6">
              <Flame size={16} />
              {isRu ? 'Премиум коллекция' : 'Premium kolleksiya'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {isRu ? 'Металлические зажигалки с лазерной гравировкой' : 'Metall zajigalkalarda lazer gravyura'}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500"> {isRu ? '— персональный подарок без лишних слов' : "— ortiqcha gaplarsiz esda qoladigan sovg'a"}</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {isRu 
                ? 'Имя, дата, фраза или логотип — аккуратно наносим на металл. Сначала согласуем макет, затем делаем гравировку, чтобы результат выглядел достойно.'
                : "Ism, sana, ibora yoki logotipni metallga tartibli tushiramiz. Avval maketni kelishamiz, keyin gravyura qilamiz — natija chiroyli va \"premium\" ko'rinadi."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://t.me/GraverAdm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition"
                data-testid="lighters-cta-models"
              >
                {isRu ? 'Получить макет' : 'Maketni olish'}
                <ChevronRight size={20} className="ml-2" />
              </a>
              <a 
                href="https://t.me/GraverAdm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition border border-gray-700"
                data-testid="lighters-cta-download"
              >
                <Send size={20} className="mr-2" />
                {isRu ? 'Написать в Telegram' : 'Telegramga yozish'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-900/50" data-testid="lighters-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isRu ? 'Модели зажигалок' : 'Zajigalka modellari'}
            </h2>
            <p className="text-gray-400 text-lg">
              {isRu ? '4 варианта покрытия под разные типы гравировок' : '4 xil qoplama turi har xil gravirovkalar uchun'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <div 
                key={product.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition group"
                data-testid={`product-card-${idx + 1}`}
              >
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-800">
                  <img
                    src={product.image}
                    alt={isRu ? product.altRu : product.altUz}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {product.sku}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                    {product.nameRu}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {isRu ? product.descRu : product.descUz}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-400">
                      {formatPrice(product.price)} <span className="text-sm text-gray-500">{isRu ? 'сум' : "so'm"}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engraving Types Section (Benefits) */}
      <section className="py-20 bg-black" data-testid="lighters-engraving">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isRu ? 'Преимущества' : 'Afzalliklar'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engravingTypes.map((type, idx) => (
              <div 
                key={idx}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-start gap-3 hover:border-orange-500/50 transition"
              >
                <span className="text-teal-500 text-xl flex-shrink-0">{type.icon}</span>
                <span className="text-gray-300 text-sm">{isRu ? type.nameRu : type.nameUz}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-20 bg-gray-900/50" data-testid="lighters-specs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {isRu ? 'Технические характеристики' : 'Texnik xususiyatlari'}
              </h2>
              <p className="text-gray-400 mb-8">
                {isRu 
                  ? 'Классическая бензиновая зажигалка с откидной крышкой в металлическом корпусе. Надежная конструкция, простая заправка и характерный щелчок крышки.'
                  : "Metall korpusli qopqog'i ochiladigan klassik benzinli zajigalka. Ishonchli konstruksiya, oson yoqilg'i quyish va qopqoqning o'ziga xos \"chert\" tovushi."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <Ruler className="text-orange-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-xs">{isRu ? 'Высота' : 'Balandligi'}</p>
                    <p className="text-white font-bold">{specs.height}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <Ruler className="text-orange-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-xs">{isRu ? 'Ширина' : 'Kengligi'}</p>
                    <p className="text-white font-bold">{specs.width}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <Ruler className="text-orange-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-xs">{isRu ? 'Толщина' : 'Qalinligi'}</p>
                    <p className="text-white font-bold">{specs.depth}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <Scale className="text-orange-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-xs">{isRu ? 'Вес' : "Og'irligi"}</p>
                    <p className="text-white font-bold">{specs.weight}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-6 flex items-start gap-4">
                <Shield className="text-teal-500 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-white font-bold mb-1">{isRu ? 'Металлический корпус' : 'Metall korpus'}</h4>
                  <p className="text-gray-400 text-sm">{isRu ? 'Прочный и долговечный' : "Mustahkam va uzoq muddatli"}</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 flex items-start gap-4">
                <Flame className="text-orange-500 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-white font-bold mb-1">{isRu ? 'Кремневый механизм' : "Kremniyli mexanizm"}</h4>
                  <p className="text-gray-400 text-sm">{isRu ? 'Надёжный поджиг в любую погоду' : "Har qanday obhavoda ishonchli yoqish"}</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 flex items-start gap-4">
                <Shield className="text-cyan-500 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-white font-bold mb-1">{isRu ? 'Ветрозащитный кожух' : "Shamoldan himoya"}</h4>
                  <p className="text-gray-400 text-sm">{isRu ? 'Работает при ветре' : "Shamolda ham ishlaydi"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-orange-900/30 to-black" data-testid="lighters-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {isRu ? 'Готовы заказать?' : 'Buyurtma berishga tayyormisiz?'}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {isRu 
              ? 'Отправьте текст/идею и (если есть) логотип — подготовим вариант для согласования.'
              : "Matn/g'oyani va (bo'lsa) logotipni yuboring — kelishish uchun variant tayyorlaymiz."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition"
              data-testid="lighters-cta-telegram"
            >
              <Send size={20} className="mr-2" />
              {isRu ? 'Получить макет' : 'Maketni olish'}
            </a>
            <a 
              href="https://t.me/GraverAdm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition border border-gray-700"
              data-testid="lighters-cta-phone"
            >
              <Send size={20} className="mr-2" />
              {isRu ? 'Написать в Telegram' : 'Telegramga yozish'}
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            {isRu 
              ? 'Удобно, если нужно быстро выбрать вариант и формат гравировки.'
              : "Variant va gravyura formatini tez tanlash uchun qulay."}
          </p>
          <div className="mt-8">
            <a 
              href="/catalogs/graver-lighters-catalog-2026.pdf"
              download
              className="inline-flex items-center text-orange-400 hover:text-orange-300 transition"
            >
              <Download size={18} className="mr-2" />
              {isRu ? 'Скачать полный каталог (PDF, 62 MB)' : 'To\'liq katalogni yuklab olish (PDF, 62 MB)'}
            </a>
          </div>
        </div>
      </section>

      {/* PATCH 4: Internal Linking - Related Blog Articles */}
      <section className="py-16 bg-gray-900/50" data-testid="lighters-related-articles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {isRu ? 'Полезные статьи' : 'Foydali maqolalar'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              to={`/${locale}/blog/${isRu ? 'lazernaya-gravirovka-podarkov' : 'lazer-gravirovka-sovgalar'}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition group"
            >
              <h3 className="text-white font-semibold mb-2 group-hover:text-teal-400">
                {isRu ? 'Лазерная гравировка подарков: полный гайд' : "Sovg'alarga lazer gravyurasi: to'liq qo'llanma"}
              </h3>
              <p className="text-gray-500 text-sm">
                {isRu ? 'Всё о технологии и материалах' : "Texnologiya va materiallar haqida"}
              </p>
            </Link>
            <Link 
              to={`/${locale}/blog/${isRu ? 'kak-vybrat-korporativnyj-podarok' : 'korporativ-sovgani-qanday-tanlash'}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition group"
            >
              <h3 className="text-white font-semibold mb-2 group-hover:text-teal-400">
                {isRu ? 'Как выбрать корпоративный подарок' : "Korporativ sovg'ani qanday tanlash"}
              </h3>
              <p className="text-gray-500 text-sm">
                {isRu ? 'Практические советы по выбору' : "Tanlash bo'yicha amaliy maslahatlar"}
              </p>
            </Link>
            <Link 
              to={`/${locale}/blog/${isRu ? 'brendirovanie-suvenirov' : 'suvenir-brendlash'}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition group"
            >
              <h3 className="text-white font-semibold mb-2 group-hover:text-teal-400">
                {isRu ? 'Брендирование сувениров' : "Suvenir brendlash"}
              </h3>
              <p className="text-gray-500 text-sm">
                {isRu ? 'Методы и материалы' : "Usullar va materiallar"}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* PATCH 7: Related Products Links */}
      <section className="py-12 bg-black" data-testid="lighters-related-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {isRu ? 'Другие продукты с гравировкой' : "Boshqa gravyurali mahsulotlar"}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={`/${locale}/${isRu ? 'watches-with-logo' : 'logotipli-soat'}`}
              className="bg-gray-900 border border-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              {isRu ? '⌚ Часы с логотипом' : "⌚ Logotipli soat"}
            </Link>
            <Link 
              to={`/${locale}/${isRu ? 'engraved-gifts' : 'gravirovkali-sovgalar'}`}
              className="bg-gray-900 border border-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              {isRu ? '🎁 Подарки с гравировкой' : "🎁 Gravyurali sovg'alar"}
            </Link>
            <Link 
              to={`/${locale}/${isRu ? 'catalog-products' : 'mahsulotlar-katalogi'}`}
              className="bg-gray-900 border border-gray-800 rounded-lg px-6 py-3 text-gray-300 hover:text-teal-400 hover:border-teal-500/50 transition"
            >
              {isRu ? '📦 Весь каталог' : "📦 Barcha katalog"}
            </Link>
          </div>
        </div>
      </section>

      {/* PATCH 6: Enhanced Footer */}
      <footer className="bg-black border-t border-gray-800 py-12" data-testid="lighters-footer">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">{isRu ? 'Навигация' : 'Navigatsiya'}</h4>
              <div className="space-y-2">
                <Link to={`/${locale}`} className="block text-gray-400 hover:text-teal-500 transition text-sm">{isRu ? 'Главная' : 'Bosh sahifa'}</Link>
                <Link to={`/${locale}/blog`} className="block text-gray-400 hover:text-teal-500 transition text-sm">{isRu ? 'Блог' : 'Blog'}</Link>
                <a href={`/${locale}#services`} className="block text-gray-400 hover:text-teal-500 transition text-sm">{isRu ? 'Услуги' : 'Xizmatlar'}</a>
                <a href={`/${locale}#contact`} className="block text-gray-400 hover:text-teal-500 transition text-sm">{isRu ? 'Контакты' : 'Aloqa'}</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{isRu ? 'Продукция' : 'Mahsulotlar'}</h4>
              <div className="space-y-2">
                <Link to={`/${locale}/products/lighters`} className="block text-teal-500 text-sm">{isRu ? 'Зажигалки' : 'Zajigalkalar'}</Link>
                <Link to={`/${locale}/${isRu ? 'watches-with-logo' : 'logotipli-soat'}`} className="block text-gray-400 hover:text-teal-500 transition text-sm">{isRu ? 'Часы' : "Soatlar"}</Link>
                <Link to={`/${locale}/${isRu ? 'catalog-products' : 'mahsulotlar-katalogi'}`} className="block text-gray-400 hover:text-teal-500 transition text-sm">{isRu ? 'Каталог' : 'Katalog'}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{isRu ? 'Контакты' : 'Aloqa'}</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <a href="tel:+998770802288" className="block hover:text-teal-500 transition">+998 77 080 22 88</a>
                <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="block hover:text-teal-500 transition">Telegram</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{isRu ? 'Каталог' : 'Katalog'}</h4>
              <a 
                href="/catalogs/graver-lighters-catalog-2026.pdf"
                download
                className="inline-flex items-center text-orange-400 hover:text-orange-300 transition text-sm"
              >
                <Download size={14} className="mr-2" />
                {isRu ? 'Скачать PDF' : 'PDF yuklab olish'}
              </a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
            <p>© 2026 Graver.uz — {isRu ? 'Премиальная лазерная гравировка в Ташкенте' : 'Toshkentda premium lazer gravyurasi'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LightersPage;
