import React, { useState } from 'react';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';
import { Phone, Send, Heart, Gift, Users, Star, MessageCircle, Mail, MapPin } from 'lucide-react';
import './NeoGift.css';

export default function NeoGift() {
  const { locale, t } = useI18n();
  const [formData, setFormData] = useState({ name: '', phone: '', recipient: '', occasion: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Подарок часы NEO:\nОт: ${formData.name}\nКому: ${formData.recipient}\nПовод: ${formData.occasion}\nТелефон: ${formData.phone}\nПожелание: ${formData.message}`;
    window.location.href = `https://t.me/GraverAdm?text=${encodeURIComponent(text)}`;
  };

  const isRu = locale === 'ru';

  return (
    <>
      <SEOHead
        title={isRu ? "Часы NEO в подарок с гравировкой | Оригинальный подарок" : "NEO soatlar sovga sifatida | Graver.uz"}
        description={isRu ? "Подарите часы NEO с персональной гравировкой. Идеальный подарок на день рождения, юбилей, выпускной. Быстрое производство, красивая упаковка." : "NEO soatlarni sovga sifatida bering. Tug'ilgan kun, yubilei, bitiruvchi uchun ideal."}
        canonicalUrl={`https://graver-studio.uz/${locale}/products/neo-gift`}
        ruUrl="https://graver-studio.uz/ru/products/neo-gift"
        uzUrl="https://graver-studio.uz/uz/products/neo-gift"
        locale={locale}
        ogImage="/images/neo/og-gift.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": isRu ? "Часы NEO в подарок" : "NEO soatlar sovga",
          "description": isRu ? "Оригинальный подарок - часы NEO с персональной гравировкой" : "Original sovga - NEO soatlar gravyura bilan",
          "brand": { "@type": "Brand", "name": "Graver Studio" },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "UZS",
            "lowPrice": "750000",
            "highPrice": "1100000"
          }
        }}
      />

      <div className="neo-gift-page">
        {/* Hero Section */}
        <section className="neo-gift-hero">
          <div className="hero-content">
            <h1>{isRu ? "Часы NEO — подарок, который запомнится" : "NEO soatlar - unutilmaydigan sovga"}</h1>
            <p className="hero-subtitle">
              {isRu ? "Персональная гравировка, красивая упаковка, быстрая доставка" : "Shaxsiy gravyura, chiroyli qadoqlash, tez yetkazib berish"}
            </p>
            <div className="hero-cta">
              <button onClick={() => document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' })} className="cta-primary">
                {isRu ? "Заказать подарок" : "Sovga buyurtma qiling"}
              </button>
              <a href="tel:+998974802288" className="cta-secondary">
                <Phone size={20} /> +998 97 480 22 88
              </a>
            </div>
          </div>
        </section>

        {/* Why NEO Gift */}
        <section className="neo-gift-why">
          <h2>{isRu ? "Почему часы NEO — идеальный подарок?" : "Nima uchun NEO soatlar ideal sovga?"}</h2>
          <div className="why-grid">
            <div className="why-card">
              <Heart size={32} />
              <h3>{isRu ? "Персональный" : "Shaxsiy"}</h3>
              <p>{isRu ? "Гравировка имени, даты или пожелания прямо на часах" : "Nom, sana yoki istakning gravyurasi"}</p>
            </div>
            <div className="why-card">
              <Star size={32} />
              <h3>{isRu ? "Премиум качество" : "Premium sifat"}</h3>
              <p>{isRu ? "Швейцарские механизмы, надёжные кварцы" : "Shveytsariya mexanizmlari"}</p>
            </div>
            <div className="why-card">
              <Gift size={32} />
              <h3>{isRu ? "Красивая упаковка" : "Chiroyli qadoqlash"}</h3>
              <p>{isRu ? "Подарочная коробка, готово к вручению" : "Sovga qutisi, topshirish uchun tayyor"}</p>
            </div>
            <div className="why-card">
              <Users size={32} />
              <h3>{isRu ? "Для любого случая" : "Har qanday tadbir uchun"}</h3>
              <p>{isRu ? "День рождения, юбилей, выпускной, свадьба" : "Tug'ilgan kun, yubilei, bitiruvchi, to'y"}</p>
            </div>
          </div>
        </section>

        {/* Occasions */}
        <section className="neo-gift-occasions">
          <h2>{isRu ? "Идеи для подарка" : "Sovga g'oyalari"}</h2>
          <div className="occasions-grid">
            <div className="occasion-card">
              <h3>🎂 {isRu ? "День рождения" : "Tug'ilgan kun"}</h3>
              <p>{isRu ? "Гравировка: имя и дата рождения" : "Gravyura: ism va tug'ilgan sana"}</p>
            </div>
            <div className="occasion-card">
              <h3>💍 {isRu ? "Свадьба" : "To'y"}</h3>
              <p>{isRu ? "Гравировка: имена молодоженов и дата" : "Javan turmush qurganlarning nomlari va sana"}</p>
            </div>
            <div className="occasion-card">
              <h3>🎓 {isRu ? "Выпускной" : "Bitiruvchi"}</h3>
              <p>{isRu ? "Гравировка: имя и год выпуска" : "Ism va bitiruvchi yili"}</p>
            </div>
            <div className="occasion-card">
              <h3>🏆 {isRu ? "Юбилей" : "Yubilei"}</h3>
              <p>{isRu ? "Гравировка: поздравление и дата" : "Tabrikni va sanani gravyura qiling"}</p>
            </div>
            <div className="occasion-card">
              <h3>💼 {isRu ? "Карьерный успех" : "Karera muvaffaqiyati"}</h3>
              <p>{isRu ? "Гравировка: имя и пожелание" : "Ism va istakning gravyurasi"}</p>
            </div>
            <div className="occasion-card">
              <h3>❤️ {isRu ? "Для любимого" : "Sevimli uchun"}</h3>
              <p>{isRu ? "Гравировка: признание в любви" : "Sevgi izoharoti gravyurasi"}</p>
            </div>
          </div>
        </section>

        {/* Models & Pricing */}
        <section className="neo-gift-models">
          <h2>{isRu ? "Выберите модель" : "Model tanlang"}</h2>
          <div className="models-grid">
            <div className="model-card">
              <h3>NEO Classic Quartz</h3>
              <p className="price">750 000 сўм</p>
              <ul>
                <li>✓ {isRu ? "Кварцевый механизм" : "Kvarts mexanizmi"}</li>
                <li>✓ {isRu ? "Батарея 2+ года" : "Batareya 2+ yil"}</li>
                <li>✓ {isRu ? "Гравировка имени/даты" : "Ism/sana gravyurasi"}</li>
                <li>✓ {isRu ? "Подарочная коробка" : "Sovga qutisi"}</li>
              </ul>
            </div>
            <div className="model-card featured">
              <span className="badge">{isRu ? "Популярно" : "Mashhur"}</span>
              <h3>NEO Mechanical (Automatic)</h3>
              <p className="price">1 100 000 сўм</p>
              <ul>
                <li>✓ {isRu ? "Автоматический механизм" : "Avtomatik mexanizm"}</li>
                <li>✓ {isRu ? "Безбатарейный" : "Batareyasiz"}</li>
                <li>✓ {isRu ? "Гравировка имени + пожелания" : "Ism + istakning gravyurasi"}</li>
                <li>✓ {isRu ? "Премиум упаковка" : "Premium qadoqlash"}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Engraving Ideas */}
        <section className="neo-gift-engraving">
          <h2>{isRu ? "Идеи для гравировки" : "Gravyura g'oyalari"}</h2>
          <div className="engraving-grid">
            <div className="engraving-idea">
              <p className="idea-title">{isRu ? "Имя и дата" : "Ism va sana"}</p>
              <p className="idea-example">Александр<br/>14.02.2025</p>
            </div>
            <div className="engraving-idea">
              <p className="idea-title">{isRu ? "Инициалы" : "Initsiallar"}</p>
              <p className="idea-example">А.В.С.<br/>2025</p>
            </div>
            <div className="engraving-idea">
              <p className="idea-title">{isRu ? "Цитата" : "Iqtibos"}</p>
              <p className="idea-example">«Время — это<br/>наша жизнь»</p>
            </div>
            <div className="engraving-idea">
              <p className="idea-title">{isRu ? "Признание" : "Izoharoti"}</p>
              <p className="idea-example">«С любовью<br/>от сердца»</p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="form-section" className="neo-gift-form">
          <h2>{isRu ? "Заказать подарок" : "Sovga buyurtma qiling"}</h2>
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
              placeholder={isRu ? "Кому дарить (имя получателя)" : "Kimga berish (qabul qiluvchining ismi)"}
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder={isRu ? "По какому поводу?" : "Qanday tadbir uchun?"}
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder={isRu ? "Телефон" : "Telefon"}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <textarea
              placeholder={isRu ? "Что гравировать? (имя, дата, пожелание)" : "Nima gravyura qilish? (ism, sana, istanh)"}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
              required
            />
            <button type="submit" className="submit-btn">
              <Send size={20} /> {isRu ? "Заказать подарок" : "Sovga buyurtma qiling"}
            </button>
          </form>
        </section>

        {/* Contact Section */}
        <section className="neo-gift-contact">
          <h2>{isRu ? "Вопросы?" : "Savollar?"}</h2>
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
