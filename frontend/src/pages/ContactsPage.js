import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, Send, ArrowLeft, MapPin, Clock, Mail } from 'lucide-react';

const translations = {
  ru: {
    title: "Контакты",
    subtitle: "Свяжитесь с нами удобным способом",
    meta: "Контакты Graver.uz: телефоны, Telegram, адрес в Ташкенте. Работаем Пн-Вс 10:00-20:00. Корпоративные подарки.",
    back: "На главную",
    cta: "Оставить заявку",
    phones: "Телефоны",
    telegram: "Telegram",
    telegramDesc: "Быстрые ответы на ваши вопросы",
    address: "Адрес",
    addressValue: "Ташкент, улица Мукими",
    addressDesc: "Приём по предварительной записи",
    hours: "Режим работы",
    hoursValue: "Пн-Вс: 10:00 - 20:00",
    hoursDesc: "Заявки принимаем 24/7",
    email: "Email",
    emailDesc: "Для официальных запросов",
    mapTitle: "Как нас найти",
    formTitle: "Напишите нам",
    formDesc: "Оставьте заявку и мы свяжемся с вами в течение 15 минут"
  },
  uz: {
    title: "Kontaktlar",
    subtitle: "Qulay usulda biz bilan bog'laning",
    meta: "Graver.uz kontaktlari: telefonlar, Telegram, Toshkentdagi manzil. Du-Ya 10:00-20:00 ishlaymiz. Korporativ sovg'alar.",
    back: "Bosh sahifa",
    cta: "Ariza qoldirish",
    phones: "Telefonlar",
    telegram: "Telegram",
    telegramDesc: "Savollaringizga tezkor javoblar",
    address: "Manzil",
    addressValue: "Toshkent, Muqimiy ko'chasi",
    addressDesc: "Oldindan yozilish bo'yicha qabul",
    hours: "Ish vaqti",
    hoursValue: "Du-Ya: 10:00 - 20:00",
    hoursDesc: "Arizalar 24/7 qabul qilinadi",
    email: "Email",
    emailDesc: "Rasmiy so'rovlar uchun",
    mapTitle: "Bizni qanday topish mumkin",
    formTitle: "Bizga yozing",
    formDesc: "Ariza qoldiring va biz 15 daqiqa ichida siz bilan bog'lanamiz"
  }
};

export default function ContactsPage() {
  const { locale = 'ru' } = useParams();
  const t = translations[locale] || translations.ru;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
  }, [locale]);

  return (
    <>
      <Helmet>
        <title>{t.title} | Graver.uz</title>
        <meta name="description" content={t.meta} />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="bg-black/95 border-b border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <Link to={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
            </Link>
            <div className="flex items-center gap-4">
              <a href="tel:+998770802288" className="hidden md:flex items-center text-white hover:text-teal-500">
                <Phone size={16} className="mr-2" />
                +998 77 080 22 88
              </a>
              <a href={`https://t.me/GraverAdm`} className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center">
                <Send size={16} className="mr-2" />
                Telegram
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to={`/${locale}`} className="inline-flex items-center text-gray-400 hover:text-teal-500 mb-8">
              <ArrowLeft size={16} className="mr-2" />
              {t.back}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-400">
              {t.subtitle}
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phones */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="text-teal-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{t.phones}</h3>
                <div className="space-y-2">
                  <a href="tel:+998770802288" className="block text-teal-500 hover:text-teal-400 font-semibold">
                    +998 77 080 22 88
                  </a>
                  <a href="tel:+998974802288" className="block text-gray-400 hover:text-teal-500">
                    +998 97 480 22 88
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Send className="text-teal-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{t.telegram}</h3>
                <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-400 font-semibold block mb-2">
                  @GraverAdm
                </a>
                <p className="text-gray-500 text-sm">{t.telegramDesc}</p>
              </div>

              {/* Address */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="text-teal-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{t.address}</h3>
                <p className="text-gray-300 mb-2">{t.addressValue}</p>
                <p className="text-gray-500 text-sm">{t.addressDesc}</p>
              </div>

              {/* Hours */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="text-teal-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{t.hours}</h3>
                <p className="text-gray-300 mb-2">{t.hoursValue}</p>
                <p className="text-teal-500 text-sm font-medium">{t.hoursDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Email Section */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="text-teal-500" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t.email}</h3>
                  <p className="text-gray-400 text-sm">{t.emailDesc}</p>
                </div>
              </div>
              <a href="mailto:info@graver.uz" className="text-2xl font-semibold text-teal-500 hover:text-teal-400">
                info@graver.uz
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.formTitle}
            </h2>
            <p className="text-gray-400 mb-8">
              {t.formDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={`/${locale}#contact`}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
              >
                {t.cta}
              </Link>
              <a 
                href="https://t.me/GraverAdm"
                className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700 flex items-center justify-center"
              >
                <Send size={18} className="mr-2" />
                Telegram
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2025 Graver.uz — {locale === 'ru' ? 'Премиальная лазерная гравировка в Ташкенте' : 'Toshkentda premium lazer gravyurasi'}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
