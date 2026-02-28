import React, { useState } from 'react';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';
import './NeoWatchesLanding.css';

const NeoWatchesLanding = () => {
  const { locale, t } = useI18n();
  const isRu = locale === 'ru';

  const handleTelegramClick = () => {
    window.open('https://t.me/GraverAdm', '_blank');
  };

  return (
    <>
      <SEOHead
        title={isRu ? "Часы NEO с гравировкой на заказ | Премиум подарок | Graver.uz" : "NEO soatlar gravyura bilan | Graver.uz"}
        description={isRu ? "Часы NEO Quartz (750K) и Automatic (1.1M) с персональной гравировкой. Бесплатный макет, доставка 1-3 дня. Идеальный подарок для VIP клиентов и партнёров." : "NEO soatlar gravyura bilan. Quartz va Automatic modellar. Tez ishlab chiqarish, chiroyli o'ramga."}
        canonicalUrl={`https://graver-studio.uz/${locale}/products/neo-watches`}
        ruUrl="https://graver-studio.uz/ru/products/neo-watches"
        uzUrl="https://graver-studio.uz/uz/products/neo-watches"
        locale={locale}
        ogImage="/images/og/og-neo-watches.jpg"
      />

      <div className="neo-landing">
        <section className="neo-hero">
          <div className="neo-hero-content">
            <h1>{isRu ? 'Часы NEO с гравировкой' : 'NEO soatlari gravyura bilan'}</h1>
            <p className="neo-hero-subtitle">{isRu ? 'Подарок, который останется в памяти навсегда.' : 'Xotirada abadiy qoladigan sovg\'a.'}</p>
            <button className="neo-cta-primary" onClick={handleTelegramClick}>
              {isRu ? 'Получить бесплатный макет в Telegram' : 'Telegramda bepul maket oling'}
            </button>
          </div>
          <div className="neo-hero-image">
            <img src="/images/og/og-neo-watches.jpg" alt={isRu ? 'Часы NEO с гравировкой' : 'NEO soatlari gravyura bilan'} />
          </div>
        </section>

        <section className="neo-benefits">
          <h2>{isRu ? 'Почему часы NEO — идеальный подарок?' : 'Nima uchun NEO soatlari ideal sovg\'a?'}</h2>
          <div className="neo-benefits-grid">
            <div className="neo-benefit-item">
              <div className="neo-benefit-icon">💎</div>
              <h4>{isRu ? 'Уникальность' : 'Noyoblik'}</h4>
              <p>{isRu ? 'Персональная гравировка делает каждые часы единственными в своём роде.' : 'Shaxsiy gravyura har bir soatni o\'ziga xos qiladi.'}</p>
            </div>
            <div className="neo-benefit-item">
              <div className="neo-benefit-icon">🎁</div>
              <h4>{isRu ? 'Эмоции' : 'Hissiyotlar'}</h4>
              <p>{isRu ? 'Это не просто часы, а памятный подарок, который хранит тёплые воспоминания.' : 'Bu shunchaki soat emas, balki iliq xotiralarni saqlaydigan esdalik sovg\'asidir.'}</p>
            </div>
            <div className="neo-benefit-item">
              <div className="neo-benefit-icon">🏆</div>
              <h4>{isRu ? 'Статус' : 'Maqom'}</h4>
              <p>{isRu ? 'Часы NEO — это премиальный аксессуар, который подчёркивает статус владельца.' : 'NEO soatlari — bu egasining maqomini ta\'kidlaydigan premium aksessuardir.'}</p>
            </div>
          </div>
        </section>

        <section className="neo-how-it-works">
          <h2>{isRu ? 'Как мы создаём ваш уникальный подарок' : 'Biz sizning noyob sovg\'angizni qanday yaratamiz'}</h2>
          <div className="neo-steps">
            <div className="neo-step">
              <div className="neo-step-number">1</div>
              <h4>{isRu ? 'Идея и консультация' : 'G\'oya va maslahat'}</h4>
              <p>{isRu ? 'Вы присылаете нам свою идею (текст, логотип, дата), мы консультируем и предлагаем варианты.' : 'Siz bizga o\'z g\'oyangizni (matn, logotip, sana) yuborasiz, biz maslahat beramiz va variantlarni taklif qilamiz.'}</p>
            </div>
            <div className="neo-step">
              <div className="neo-step-number">2</div>
              <h4>{isRu ? 'Бесплатный макет' : 'Bepul maket'}</h4>
              <p>{isRu ? 'Наш дизайнер создаёт цифровой макет, чтобы вы увидели, как будет выглядеть гравировка.' : 'Bizning dizaynerimiz gravyura qanday ko\'rinishini ko\'rishingiz uchun raqamli maket yaratadi.'}</p>
            </div>
            <div className="neo-step">
              <div className="neo-step-number">3</div>
              <h4>{isRu ? 'Гравировка и доставка' : 'Gravyura va yetkazib berish'}</h4>
              <p>{isRu ? 'После утверждения макета мы наносим гравировку и доставляем вам в премиальной упаковке.' : 'Maket tasdiqlangandan so\'ng, biz gravyura qilamiz va sizga premium o\'ramda yetkazib beramiz.'}</p>
            </div>
          </div>
          <button className="neo-cta-large" onClick={handleTelegramClick}>
            {isRu ? 'Обсудить идею в Telegram' : 'G\'oyani Telegramda muhokama qilish'}
          </button>
        </section>
      </div>
    </>
  );
};

export default NeoWatchesLanding;
