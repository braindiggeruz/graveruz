import React, { useState } from 'react';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';
import { Phone, Send, Check, Users, Award, Package, Clock, MessageCircle, Mail, MapPin, ChevronRight } from 'lucide-react';
import './NeoCorporate.css';

export default function NeoCorporate() {
  const { locale, t } = useI18n();
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', quantity: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Корпоративный заказ часов NEO:\nИмя: ${formData.name}\nКомпания: ${formData.company}\nКоличество: ${formData.quantity}\nТелефон: ${formData.phone}\nСообщение: ${formData.message}`;
    window.location.href = `https://t.me/GraverAdm?text=${encodeURIComponent(text)}`;
  };

  const isRu = locale === 'ru';

  return (
    <>
      <SEOHead
        title={isRu ? "Корпоративные часы NEO с логотипом компании | Graver.uz" : "Korporativ soatlar NEO | Graver.uz"}
        description={isRu ? "Закажите часы NEO с гравировкой логотипа вашей компании. Оптовые цены, быстрое производство, любой тираж. Идеальный подарок для сотрудников и партнёров." : "NEO soatlarini kompaniya logotipi bilan buyurtma bering. Optimal narxlar, tez ishlab chiqarish."}
        canonicalUrl={`https://graver-studio.uz/${locale}/products/neo-corporate`}
        ruUrl="https://graver-studio.uz/ru/products/neo-corporate"
        uzUrl="https://graver-studio.uz/uz/products/neo-corporate"
        locale={locale}
        ogImage="/images/neo/og-corporate.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": isRu ? "Корпоративные часы NEO" : "Korporativ NEO soatlar",
          "description": isRu ? "Часы NEO с персональной гравировкой логотипа для корпоративных подарков" : "NEO soatlar korporativ sovgalar uchun",
          "brand": { "@type": "Brand", "name": "Graver Studio" },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "UZS",
            "lowPrice": "750000",
            "highPrice": "1100000",
            "offerCount": "1000+"
          }
        }}
      />

      <div className="neo-corporate-page">
        {/* Hero Section */}
        <section className="neo-corporate-hero">
          <div className="hero-content">
            <h1>{isRu ? "Часы NEO для вашей компании" : "NEO soatlar sizning kompaniyangiz uchun"}</h1>
            <p className="hero-subtitle">
              {isRu ? "Персональная гравировка логотипа, быстрое производство, оптовые цены" : "Logotip gravyurasi, tez ishlab chiqarish, optimal narxlar"}
            </p>
            <div className="hero-cta">
              <button onClick={() => document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' })} className="cta-primary">
                {isRu ? "Запросить расчёт" : "Hisob-kitobni so'rash"}
              </button>
              <a href="tel:+998974802288" className="cta-secondary">
                <Phone size={20} /> +998 97 480 22 88
              </a>
            </div>
          </div>
        </section>

        {/* Why Choose NEO */}
        <section className="neo-corporate-why">
          <h2>{isRu ? "Почему часы NEO для корпоративных подарков?" : "Nima uchun NEO soatlar?"}</h2>
          <div className="why-grid">
            <div className="why-card">
              <Award size={32} />
              <h3>{isRu ? "Премиум качество" : "Premium sifat"}</h3>
              <p>{isRu ? "Швейцарские механизмы, надёжные японские кварцы" : "Shveytsariya mexanizmlari"}</p>
            </div>
            <div className="why-card">
              <Users size={32} />
              <h3>{isRu ? "Любой тираж" : "Istalgan miqdor"}</h3>
              <p>{isRu ? "От 1 до 10 000+ единиц для вашей компании" : "1 dan 10000+ gacha"}</p>
            </div>
            <div className="why-card">
              <Clock size={32} />
              <h3>{isRu ? "Быстрое производство" : "Tez ishlab chiqarish"}</h3>
              <p>{isRu ? "Макет за 1 час, готовность за 1-3 дня" : "Maketa 1 soatda, tayyor 1-3 kunida"}</p>
            </div>
            <div className="why-card">
              <Package size={32} />
              <h3>{isRu ? "Красивая упаковка" : "Chiroyli qadoqlash"}</h3>
              <p>{isRu ? "Фирменная коробка с вашим логотипом" : "Firmaviy quti logotip bilan"}</p>
            </div>
          </div>
        </section>

        {/* Models & Pricing */}
        <section className="neo-corporate-models">
          <h2>{isRu ? "Модели и цены" : "Modellar va narxlar"}</h2>
          <div className="models-grid">
            <div className="model-card">
              <h3>NEO Classic Quartz</h3>
              <p className="price">750 000 сўм</p>
              <ul>
                <li>✓ {isRu ? "Кварцевый механизм" : "Kvarts mexanizmi"}</li>
                <li>✓ {isRu ? "Батарея 2+ года" : "Batareya 2+ yil"}</li>
                <li>✓ {isRu ? "Гравировка логотипа" : "Logotip gravyurasi"}</li>
                <li>✓ {isRu ? "Кожаный ремешок" : "Charm ko'ylagi"}</li>
              </ul>
            </div>
            <div className="model-card featured">
              <span className="badge">{isRu ? "Популярно" : "Mashhur"}</span>
              <h3>NEO Mechanical (Automatic)</h3>
              <p className="price">1 100 000 сўм</p>
              <ul>
                <li>✓ {isRu ? "Автоматический механизм" : "Avtomatik mexanizm"}</li>
                <li>✓ {isRu ? "Безбатарейный" : "Batareyasiz"}</li>
                <li>✓ {isRu ? "Гравировка логотипа + текста" : "Logotip va matn gravyurasi"}</li>
                <li>✓ {isRu ? "Премиум кожаный ремешок" : "Premium charm ko'ylagi"}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="neo-corporate-process">
          <h2>{isRu ? "Процесс заказа" : "Buyurtma jarayoni"}</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>{isRu ? "Обсуждение" : "Muhokama"}</h3>
              <p>{isRu ? "Вы рассказываете о вашей компании, бюджете и требованиях" : "Kompaniya haqida gapiring"}</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>{isRu ? "Макет" : "Maketa"}</h3>
              <p>{isRu ? "Мы создаём макет гравировки за 1 час" : "Gravyura maketasi 1 soatda"}</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>{isRu ? "Производство" : "Ishlab chiqarish"}</h3>
              <p>{isRu ? "Готовим часы за 1-3 дня" : "Soatlarni 1-3 kunida tayyorlaymiz"}</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>{isRu ? "Доставка" : "Yetkazib berish"}</h3>
              <p>{isRu ? "Доставляем в красивой упаковке" : "Chiroyli qadoqlashda yetkazamiz"}</p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form-section" className="neo-corporate-form">
          <h2>{isRu ? "Запросить расчёт" : "Hisob-kitobni so'rash"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={isRu ? "Ваше имя" : "Sizning ismingiz"}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder={isRu ? "Компания" : "Kompaniya"}
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder={isRu ? "Телефон" : "Telefon"}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder={isRu ? "Количество часов" : "Soatlar soni"}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
            <textarea
              placeholder={isRu ? "Дополнительная информация" : "Qo'shimcha ma'lumot"}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
            />
            <button type="submit" className="submit-btn">
              <Send size={20} /> {isRu ? "Отправить в Telegram" : "Telegramga yuborish"}
            </button>
          </form>
        </section>

        {/* Contact Section */}
        <section className="neo-corporate-contact">
          <h2>{isRu ? "Свяжитесь с нами" : "Biz bilan bog'laning"}</h2>
          <div className="contact-methods">
            <a href="tel:+998974802288" className="contact-method">
              <Phone size={24} />
              <div>
                <p className="contact-label">{isRu ? "Телефон" : "Telefon"}</p>
                <p className="contact-value">+998 97 480 22 88</p>
              </div>
            </a>
            <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="contact-method">
              <MessageCircle size={24} />
              <div>
                <p className="contact-label">Telegram</p>
                <p className="contact-value">@GraverAdm</p>
              </div>
            </a>
            <a href="mailto:info@graver-studio.uz" className="contact-method">
              <Mail size={24} />
              <div>
                <p className="contact-label">Email</p>
                <p className="contact-value">info@graver-studio.uz</p>
              </div>
            </a>
            <div className="contact-method">
              <MapPin size={24} />
              <div>
                <p className="contact-label">{isRu ? "Адрес" : "Manzil"}</p>
                <p className="contact-value">{isRu ? "Ташкент, ул. Мукими" : "Tashkent, Mukimi ko'chasi"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
