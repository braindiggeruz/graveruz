import React, { useState } from 'react';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';
import './NeoWatchesLanding.css';

const NeoWatchesLanding = () => {
  const { locale, t } = useI18n();
  const isRu = locale === 'ru';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedColor, setSelectedColor] = useState('gold-black');

  const slides = [
    {
      title: 'ЗАПЕЧАТЛИ МОМЕНТ',
      subtitle: 'Свадьба, юбилей, выпускной — сохрани важную дату на металле.',
      image: '/images/neo/2.jpg',
      cta: 'СОХРАНИТЬ ДАТУ'
    },
    {
      title: 'ПОДАРОК, КОТОРЫЙ ГОВОРИТ',
      subtitle: 'Гравировка логотипа вашей компании на часах NEO.',
      image: '/images/neo/3.jpg',
      cta: 'КОРПОРАТИВНЫЙ ЗАКАЗ'
    },
    {
      title: 'УВИДЬ ГРАВИРОВКУ ДО ЗАКАЗА',
      subtitle: 'Пришлём бесплатный цифровой макет ваших часов с гравировкой.',
      image: '/images/neo/4.jpg',
      cta: 'ПОЛУЧИТЬ МАКЕТ БЕСПЛАТНО'
    },
    {
      title: 'СЛОВА ОСТАНУТСЯ НАВСЕГДА',
      subtitle: 'Превратите часы в семейную реликвию с памятной гравировкой.',
      image: '/images/neo/5.jpg',
      cta: 'СОЗДАТЬ РЕЛИКВИЮ'
    },
    {
      title: 'ДЛЯ ТЕХ, КТО ЗАСЛУЖИЛ',
      subtitle: 'Именная гравировка на часах — лучший способ сказать «спасибо».',
      image: '/images/neo/6.jpg',
      cta: 'НАГРАДИТЬ ЛУЧШИХ'
    },
    {
      title: 'СЛОВА, КОТОРЫЕ ВСЕГДА РЯДОМ',
      subtitle: 'Гравировка клятвы, цитаты или обещания на часах.',
      image: '/images/neo/7.jpg',
      cta: 'ДАТЬ ОБЕЩАНИЕ'
    },
    {
      title: 'ПОДАРОК, КОТОРЫЙ ГОВОРИТ',
      subtitle: 'Гравировка имени, даты или тёплых слов на часах NEO.',
      image: '/images/neo/1.jpg',
      cta: 'ЗАКАЗАТЬ ГРАВИРОВКУ'
    }
  ];

  const colors = [
    { name: 'Gold Black', value: 'gold-black', hex: '#FFD700' },
    { name: 'Gold White', value: 'gold-white', hex: '#FFD700' },
    { name: 'Silver Black', value: 'silver-black', hex: '#C0C0C0' },
    { name: 'Silver White', value: 'silver-white', hex: '#C0C0C0' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
        ogImage="/images/neo/og-watches.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": isRu ? "Часы NEO" : "NEO soatlar",
          "description": isRu ? "Премиум часы с персональной гравировкой" : "Premium soatlar gravyura bilan",
          "image": "/images/neo/og-watches.jpg",
          "brand": {
            "@type": "Brand",
            "name": "Graver.uz"
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "UZS",
            "offers": [
              {
                "@type": "Offer",
                "name": "NEO Quartz",
                "price": "750000",
                "priceCurrency": "UZS"
              },
              {
                "@type": "Offer",
                "name": "NEO Automatic",
                "price": "1100000",
                "priceCurrency": "UZS"
              }
            ]
          }
        }}
      />

      <div className="neo-landing">
        {/* Hero Section */}
        <section className="neo-hero">
          <div className="neo-hero-content">
            <h1>Часы NEO с персональной гравировкой</h1>
            <p className="neo-hero-subtitle">Запечатли момент. Создай подарок, который останется навсегда.</p>
            <button className="neo-cta-primary" onClick={handleTelegramClick}>
              Создать свой дизайн
            </button>
          </div>
          <div className="neo-hero-image">
            <img src="/images/neo/2.jpg" alt="Часы NEO с гравировкой" />
          </div>
        </section>

        {/* Models Section */}
        <section className="neo-models">
          <h2>Выбери свою модель NEO</h2>
          <div className="neo-models-grid">
            <div className="neo-model-card">
              <div className="neo-model-header">
                <h3>NEO Quartz</h3>
                <span className="neo-model-price">750 000 сўм</span>
              </div>
              <p className="neo-model-description">Компактная кварцевая модель с фасетированными ушками и полированным безелем.</p>
              <div className="neo-colors">
                {colors.slice(0, 2).map((color) => (
                  <div
                    key={color.value}
                    className={`neo-color-swatch ${selectedColor === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="neo-model-details">
                ✓ Артикул: Q-106028<br/>
                ✓ Логотип + текст включены<br/>
                ✓ Любой тираж<br/>
                ✓ Доставка 1-3 дня
              </p>
              <button className="neo-cta-secondary" onClick={handleTelegramClick}>
                Заказать Quartz
              </button>
            </div>

            <div className="neo-model-card">
              <div className="neo-model-header">
                <h3>NEO Automatic</h3>
                <span className="neo-model-price">1 100 000 сўм</span>
              </div>
              <p className="neo-model-description">Механические часы с автоматическим механизмом и элегантным дизайном.</p>
              <div className="neo-colors">
                {colors.slice(2, 4).map((color) => (
                  <div
                    key={color.value}
                    className={`neo-color-swatch ${selectedColor === color.value ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="neo-model-details">
                ✓ Артикул: A-206039<br/>
                ✓ Логотип + текст включены<br/>
                ✓ Любой тираж<br/>
                ✓ Доставка 1-3 дня
              </p>
              <button className="neo-cta-secondary" onClick={handleTelegramClick}>
                Заказать Automatic
              </button>
            </div>
          </div>
        </section>

        {/* Slider Section - Ideas */}
        <section className="neo-slider">
          <h2>Идеи для гравировки</h2>
          <div className="neo-slider-container">
            <button className="neo-slider-btn neo-slider-prev" onClick={prevSlide}>❮</button>
            
            <div className="neo-slider-content">
              <div className="neo-slider-image">
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} />
              </div>
              <div className="neo-slider-text">
                <h3>{slides[currentSlide].title}</h3>
                <p>{slides[currentSlide].subtitle}</p>
                <button className="neo-cta-primary" onClick={handleTelegramClick}>
                  {slides[currentSlide].cta}
                </button>
              </div>
            </div>

            <button className="neo-slider-btn neo-slider-next" onClick={nextSlide}>❯</button>
          </div>

          <div className="neo-slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`neo-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* How to Order Section */}
        <section className="neo-how-to-order">
          <h2>Как заказать часы NEO с гравировкой</h2>
          <div className="neo-steps">
            <div className="neo-step">
              <div className="neo-step-number">1</div>
              <h4>Напишите нам</h4>
              <p>Свяжитесь с нами в Telegram или по телефону. Расскажите о вашей идее.</p>
              <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="neo-step-link">
                Написать в Telegram →
              </a>
            </div>

            <div className="neo-step">
              <div className="neo-step-number">2</div>
              <h4>Получите макет</h4>
              <p>Мы создадим бесплатный цифровой макет ваших часов с гравировкой.</p>
              <p className="neo-step-time">⏱ Ответ за 30 минут</p>
            </div>

            <div className="neo-step">
              <div className="neo-step-number">3</div>
              <h4>Оплатите и получите</h4>
              <p>После согласования макета оплатите заказ. Доставка 1-3 дня.</p>
              <p className="neo-step-time">📦 Доставка по Узбекистану</p>
            </div>
          </div>

          <button className="neo-cta-large" onClick={handleTelegramClick}>
            ПОЛУЧИТЬ МАКЕТ БЕСПЛАТНО
          </button>
        </section>

        {/* Trust Section */}
        <section className="neo-trust">
          <h2>Почему выбирают Graver.uz</h2>
          <div className="neo-trust-grid">
            <div className="neo-trust-item">
              <div className="neo-trust-icon">✓</div>
              <h4>Бесплатный макет</h4>
              <p>Видишь гравировку ДО производства</p>
            </div>
            <div className="neo-trust-item">
              <div className="neo-trust-icon">⚡</div>
              <h4>Быстро</h4>
              <p>Ответ за 30 минут, доставка 1-3 дня</p>
            </div>
            <div className="neo-trust-item">
              <div className="neo-trust-icon">💎</div>
              <h4>Качество</h4>
              <p>Профессиональная гравировка на оборудовании</p>
            </div>
            <div className="neo-trust-item">
              <div className="neo-trust-icon">📦</div>
              <h4>Любой тираж</h4>
              <p>От 1 до 10 000+ единиц</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="neo-contact">
          <h3>Остались вопросы?</h3>
          <p>Напишите нам в Telegram или позвоните</p>
          <div className="neo-contact-buttons">
            <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="neo-contact-btn neo-contact-telegram">
              📱 Telegram
            </a>
            <a href="tel:+998974802288" className="neo-contact-btn neo-contact-phone">
              ☎️ +998 97 480 22 88
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default NeoWatchesLanding;
