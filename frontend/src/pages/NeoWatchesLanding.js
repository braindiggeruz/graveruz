import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import B2CForm from '../components/B2CForm';
import './NeoWatchesLanding.css';

// Real watch photos
const GALLERY_PHOTOS = [
  {
    src: '/images/neo/neo-watch-black-gold.jpg',
    altRu: 'Часы NEO — чёрный циферблат, золотой корпус',
    altUz: 'NEO soat — qora raqamlar, oltin korpus',
  },
  {
    src: '/images/neo/neo-watch-black-silver.jpg',
    altRu: 'Часы NEO — чёрный циферблат, серебряный корпус',
    altUz: 'NEO soat — qora raqamlar, kumush korpus',
  },
  {
    src: '/images/neo/neo-watch-white-gold.jpg',
    altRu: 'Часы NEO — белый циферблат, золотой корпус',
    altUz: 'NEO soat — oq raqamlar, oltin korpus',
  },
  {
    src: '/images/neo/neo-watch-white-silver.jpg',
    altRu: 'Часы NEO — белый циферблат, серебряный корпус',
    altUz: 'NEO soat — oq raqamlar, kumush korpus',
  },
];

const USE_CASES = [
  {
    icon: '👤',
    titleRu: 'Для себя',
    titleUz: "O'zingiz uchun",
    textRu: 'Уникальный аксессуар с вашими инициалами или символом, который подчёркивает характер.',
    textUz: "Xarakteringizni ta'kidlaydigan initsiallar yoki ramz bilan noyob aksessuar.",
  },
  {
    icon: '🎁',
    titleRu: 'В подарок близкому',
    titleUz: 'Yaqin insonga sovg\'a',
    textRu: 'Персональная гравировка превращает часы в памятный подарок, который хранят годами.',
    textUz: 'Shaxsiy gravyura soatni yillar davomida saqlanadigan esdalik sovg\'asiga aylantiradi.',
  },
  {
    icon: '🏢',
    titleRu: 'Сотрудникам',
    titleUz: 'Xodimlarga',
    textRu: 'Ценный корпоративный подарок за достижения — с логотипом компании или именем сотрудника.',
    textUz: "Kompaniya logotipi yoki xodim ismi bilan yutuqlar uchun qimmatbaho korporativ sovg'a.",
  },
  {
    icon: '🤝',
    titleRu: 'Партнёрам',
    titleUz: 'Hamkorlarga',
    textRu: 'Укрепите деловые отношения премиальным презентом, который запомнится надолго.',
    textUz: "Uzoq vaqt esda qoladigan premium taqdim bilan ishbilarmonlik aloqalarini mustahkamlang.",
  },
];

const FAQ_ITEMS_RU = [
  {
    q: 'Что можно нанести на гравировку?',
    a: 'Текст, инициалы, дату, логотип, символ или любой рисунок. Мы подберём оптимальный вариант под ваш запрос.',
  },
  {
    q: 'Как выглядит гравировка — покажите пример?',
    a: 'Перед нанесением мы бесплатно создаём цифровой макет. Вы видите результат заранее и утверждаете его.',
  },
  {
    q: 'Сколько стоит гравировка?',
    a: 'Стоимость зависит от сложности рисунка и количества. Оставьте заявку — мы рассчитаем и пришлём макет.',
  },
  {
    q: 'Сколько времени занимает изготовление?',
    a: 'После утверждения макета мы наносим гравировку в течение нескольких рабочих дней. Уточняйте при заказе.',
  },
  {
    q: 'Есть ли доставка по Узбекистану?',
    a: 'Да, доставляем по Ташкенту и другим городам. Детали уточняем при оформлении заказа.',
  },
  {
    q: 'Можно ли заказать тираж для корпоративного подарка?',
    a: 'Да, принимаем корпоративные заказы. Напишите нам в Telegram или оставьте заявку — обсудим условия.',
  },
  {
    q: 'Что если мне не понравится макет?',
    a: 'Мы дорабатываем макет до вашего одобрения. Гравировка начинается только после вашего согласования.',
  },
  {
    q: 'Как оформить заказ?',
    a: 'Нажмите «Оставить заявку» или напишите нам в Telegram. Мы свяжемся, уточним детали и пришлём макет.',
  },
];

const FAQ_ITEMS_UZ = [
  {
    q: 'Gravyuraga nima qo\'yish mumkin?',
    a: 'Matn, initsiallar, sana, logotip, ramz yoki istalgan rasm. Biz so\'rovingizga mos optimal variantni tanlaymiz.',
  },
  {
    q: 'Gravyura qanday ko\'rinadi — misol ko\'rsata olasizmi?',
    a: 'Naqsh qo\'yishdan oldin biz bepul raqamli maket yaratamiz. Siz natijani oldindan ko\'rasiz va tasdiqlaysiz.',
  },
  {
    q: 'Gravyura qancha turadi?',
    a: 'Narx rasm murakkabligi va miqdoriga bog\'liq. Ariza qoldiring — biz hisoblаb, maket yuboramiz.',
  },
  {
    q: 'Ishlab chiqarish qancha vaqt oladi?',
    a: 'Maket tasdiqlanganidan so\'ng biz bir necha ish kuni ichida gravyura qilamiz. Buyurtma berishda aniqlashtiring.',
  },
  {
    q: 'O\'zbekiston bo\'ylab yetkazib berish bormi?',
    a: 'Ha, Toshkent va boshqa shaharlarga yetkazib beramiz. Tafsilotlarni buyurtma rasmiylashtirish paytida aniqlashtiring.',
  },
  {
    q: 'Korporativ sovg\'a uchun tiraj buyurtma qilish mumkinmi?',
    a: 'Ha, korporativ buyurtmalarni qabul qilamiz. Telegramda yozing yoki ariza qoldiring — shartlarni muhokama qilamiz.',
  },
  {
    q: 'Agar maket menga yoqmasa nima bo\'ladi?',
    a: 'Biz maketni siz tasdiqlaguningizcha takomillashtirамiz. Gravyura faqat sizning roziligingizdan so\'ng boshlanadi.',
  },
  {
    q: 'Buyurtmani qanday rasmiylashtirish mumkin?',
    a: '«Ariza qoldirish» tugmasini bosing yoki Telegramda yozing. Biz bog\'lanamiz, tafsilotlarni aniqlaymiz va maket yuboramiz.',
  },
];

const NeoWatchesLanding = () => {
  const { locale = 'ru' } = useParams();
  const isRu = locale === 'ru';

  const [activePhoto, setActivePhoto] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const faqItems = isRu ? FAQ_ITEMS_RU : FAQ_ITEMS_UZ;

  const handleTelegramClick = () => {
    window.open('https://t.me/GraverAdm', '_blank');
  };

  const handleFormOpen = () => setShowForm(true);
  const handleFormClose = () => setShowForm(false);

  return (
    <>
      <SEOHead
        page="home"
        title={isRu
          ? "Часы NEO с гравировкой на заказ | Премиум подарок | Graver.uz"
          : "NEO soatlar gravyura bilan | Graver.uz"}
        description={isRu
          ? "Часы NEO с персональной гравировкой — кварцевые и механические. Бесплатный макет перед нанесением. Идеальный подарок для себя, близких и партнёров."
          : "NEO soatlar shaxsiy gravyura bilan — kvars va mexanik. Naqsh qo'yishdan oldin bepul maket. O'zingiz, yaqinlaringiz va hamkorlaringiz uchun ideal sovg'a."}
        ogImage="/images/og/og-neo-watches.jpg"
      />

      <div className="neo-landing">

        {/* ── HERO ── */}
        <section className="neo-hero">
          <div className="neo-hero-content">
            <h1>{isRu ? 'Часы NEO с вашей гравировкой' : 'NEO soatlari — sizning gravyurangiz'}</h1>
            <p className="neo-hero-subtitle">
              {isRu
                ? 'Кварцевые и механические. От идеи до готового подарка — с бесплатным макетом перед нанесением.'
                : "Kvars va mexanik. G'oyadan tayyor sovg'agacha — naqsh qo'yishdan oldin bepul maket bilan."}
            </p>
            <div className="neo-hero-bullets">
              <span>✓ {isRu ? 'Персональная гравировка' : 'Shaxsiy gravyura'}</span>
              <span>✓ {isRu ? 'Макет перед нанесением' : 'Naqshdan oldin maket'}</span>
              <span>✓ {isRu ? 'Для себя и корпоративно' : "O'zingiz va korporativ"}</span>
            </div>
            <div className="neo-hero-ctas">
              <button className="neo-cta-primary" onClick={handleFormOpen}>
                {isRu ? 'Оставить заявку' : 'Ariza qoldirish'}
              </button>
              <button className="neo-cta-secondary" onClick={handleTelegramClick}>
                {isRu ? 'Написать в Telegram' : 'Telegramda yozish'}
              </button>
            </div>
          </div>
          <div className="neo-hero-gallery">
            <div className="neo-hero-main-photo">
              <img
                src={GALLERY_PHOTOS[activePhoto].src}
                alt={isRu ? GALLERY_PHOTOS[activePhoto].altRu : GALLERY_PHOTOS[activePhoto].altUz}
                loading="eager"
              />
            </div>
            <div className="neo-hero-thumbs">
              {GALLERY_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  className={`neo-thumb${activePhoto === i ? ' active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                  aria-label={isRu ? photo.altRu : photo.altUz}
                >
                  <img
                    src={photo.src}
                    alt={isRu ? photo.altRu : photo.altUz}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHOTO GALLERY ── */}
        <section className="neo-gallery">
          <h2>{isRu ? 'Варианты исполнения' : 'Bajarilish variantlari'}</h2>
          <p className="neo-gallery-subtitle">
            {isRu
              ? 'Четыре цветовых решения — выберите то, что подходит именно вам.'
              : "To'rtta rang yechimi — o'zingizga mos kelganini tanlang."}
          </p>
          <div className="neo-gallery-grid">
            {GALLERY_PHOTOS.map((photo, i) => (
              <div key={i} className="neo-gallery-item">
                <img
                  src={photo.src}
                  alt={isRu ? photo.altRu : photo.altUz}
                  loading="lazy"
                />
                <p className="neo-gallery-caption">
                  {isRu ? photo.altRu : photo.altUz}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section className="neo-use-cases">
          <h2>{isRu ? 'Кому подходят часы NEO?' : 'NEO soatlari kimga mos keladi?'}</h2>
          <div className="neo-use-cases-grid">
            {USE_CASES.map((item, i) => (
              <div key={i} className="neo-use-case-card">
                <div className="neo-use-case-icon">{item.icon}</div>
                <h4>{isRu ? item.titleRu : item.titleUz}</h4>
                <p>{isRu ? item.textRu : item.textUz}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="neo-how-it-works">
          <h2>{isRu ? '3 шага до вашего подарка' : "Sovg'angizgacha 3 qadam"}</h2>
          <div className="neo-steps">
            <div className="neo-step">
              <div className="neo-step-number">1</div>
              <h4>{isRu ? 'Обсуждаем идею' : "G'oyani muhokama qilamiz"}</h4>
              <p>{isRu
                ? 'Оставьте заявку или напишите в Telegram. Мы уточним детали: текст, символ, количество.'
                : "Ariza qoldiring yoki Telegramda yozing. Biz tafsilotlarni aniqlaymiz: matn, ramz, miqdor."}</p>
            </div>
            <div className="neo-step">
              <div className="neo-step-number">2</div>
              <h4>{isRu ? 'Согласуем макет' : 'Maketni kelishib olamiz'}</h4>
              <p>{isRu
                ? 'Наш дизайнер создаёт цифровой макет бесплатно. Вы видите результат до нанесения.'
                : "Dizaynerimiz bepul raqamli maket yaratadi. Siz naqsh qo'yishdan oldin natijani ko'rasiz."}</p>
            </div>
            <div className="neo-step">
              <div className="neo-step-number">3</div>
              <h4>{isRu ? 'Гравируем и доставляем' : 'Gravyura qilamiz va yetkazamiz'}</h4>
              <p>{isRu
                ? 'После вашего одобрения наносим гравировку и доставляем в премиальной упаковке.'
                : "Sizning roziligingizdan so'ng gravyura qilamiz va premium o'ramda yetkazib beramiz."}</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="neo-faq">
          <h2>{isRu ? 'Частые вопросы' : 'Ko\'p so\'raladigan savollar'}</h2>
          <div className="neo-faq-list">
            {faqItems.map((item, i) => (
              <div key={i} className={`neo-faq-item${openFaq === i ? ' open' : ''}`}>
                <button
                  className="neo-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="neo-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="neo-faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="neo-final-cta">
          <h2>{isRu ? 'Готовы создать ваш уникальный подарок?' : "Noyob sovg'angizni yaratishga tayyormisiz?"}</h2>
          <p>{isRu
            ? 'Оставьте заявку — мы свяжемся, обсудим идею и пришлём бесплатный макет.'
            : "Ariza qoldiring — biz bog'lanamiz, g'oyani muhokama qilamiz va bepul maket yuboramiz."}</p>
          <div className="neo-final-cta-buttons">
            <button className="neo-cta-primary" onClick={handleFormOpen}>
              {isRu ? 'Оставить заявку' : 'Ariza qoldirish'}
            </button>
            <button className="neo-cta-secondary" onClick={handleTelegramClick}>
              {isRu ? 'Написать в Telegram' : 'Telegramda yozish'}
            </button>
          </div>
        </section>

      </div>

      {/* ── MODAL FORM ── */}
      {showForm && (
        <div className="neo-modal-overlay" onClick={handleFormClose}>
          <div className="neo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="neo-modal-close" onClick={handleFormClose} aria-label="Закрыть">×</button>
            <B2CForm
              locale={locale}
              defaultCategory="watches"
              pageUrl={`https://graver-studio.uz/${locale}/products/neo-watches`}
            />
          </div>
        </div>
      )}

      {/* ── STICKY MOBILE CTA ── */}
      <div className="neo-sticky-cta">
        <button className="neo-cta-primary neo-sticky-btn" onClick={handleFormOpen}>
          {isRu ? 'Оставить заявку' : 'Ariza qoldirish'}
        </button>
        <button className="neo-cta-secondary neo-sticky-btn" onClick={handleTelegramClick}>
          {isRu ? 'Telegram' : 'Telegram'}
        </button>
      </div>
    </>
  );
};

export default NeoWatchesLanding;
