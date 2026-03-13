import { openTelegramWithTracking } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Send, MapPin, Clock, Mail, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';

export default function ContactsPage() {
  const { locale = 'ru' } = useParams();
  const { t } = useI18n();
  
  const home = locale === 'uz' ? 'Bosh sahifa' : 'Главная';
  const title = locale === 'uz' ? 'Kontaktlar' : 'Контакты';
  const subtitle = locale === 'uz' ? 'Qulay usulda biz bilan bog\'laning. Arizalar 24/7 qabul qilinadi.' : 'Свяжитесь с нами удобным способом. Заявки принимаем 24/7.';
  const cta = locale === 'uz' ? 'Ariza qoldirish' : 'Оставить заявку';
  const phones = locale === 'uz' ? 'Telefonlar' : 'Телефоны';
  const telegram = 'Telegram';
  const telegramDesc = locale === 'uz' ? 'Tezkor javoblar — odatda 15 daqiqa ichida' : 'Быстрые ответы — обычно в течение 15 минут';
  const address = locale === 'uz' ? 'Manzil' : 'Адрес';
  const addressValue = locale === 'uz' ? 'Toshkent shahri, Muqimiy ko\'chasi, 59' : 'г. Ташкент, ул. Мукими, 59';
  const addressLandmark = locale === 'uz' ? 'Amir Temur metro bekatiga yaqin' : 'Рядом с метро Амира Темура';
  const hours = locale === 'uz' ? 'Ish vaqti' : 'Режим работы';
  const hoursValue = locale === 'uz' ? 'Du-Ya: 10:00 - 20:00' : 'Пн-Вс: 10:00 - 20:00';
  const hoursDesc = locale === 'uz' ? 'Arizalar 24/7' : 'Заявки 24/7';
  const howToReach = locale === 'uz' ? 'Qanday yetib borish mumkin' : 'Как добраться';
  const howToReachDesc = locale === 'uz' ? 'Amir Temur metro bekatidan 5 daqiqalik piyoda yo\'l. Muqimiy ko\'chasi bo\'ylab shimolga yuring.' : 'Пешком 5 минут от метро Амира Темура. Идите по ул. Мукими на север.';
  
  const pathname = `/${locale}/contacts`;
  const canonicalUrl = buildCanonical(pathname);
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        "name": "Graver Studio",
        "alternateName": "Graver.uz",
        "description": locale === 'uz' 
          ? "Toshkentda korporativ sovg'alar uchun lazer gravirovkasi. Soatlar, zajigalkalar, ruchkalar, paverbanklar logotip bilan."
          : "Лазерная гравировка корпоративных подарков в Ташкенте. Часы, зажигалки, ручки, повербанки с логотипом.",
        "url": BASE_URL,
        "telephone": "+998770802288",
        "email": "info@graver-studio.uz",
        "image": `${BASE_URL}/images/og/og-home.jpg`,
        "logo": `${BASE_URL}/logo192.png`,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "ул. Мукими, 59",
          "addressLocality": "Ташкент",
          "addressCountry": "UZ",
          "postalCode": "100000"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.2995,
          "longitude": 69.2401
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "20:00"
        },
        "sameAs": [
          "https://t.me/GraverAdm"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": home, "item": `${BASE_URL}/${locale}` },
          { "@type": "ListItem", "position": 2, "name": title, "item": canonicalUrl }
        ]
      }
    ]
  };

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
  }, [locale]);

  return (
    <div className="min-h-screen bg-black">
      <SEOHead page="contacts" ogImage="https://graver-studio.uz/images/og/og-home.jpg" />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <header className="bg-black/95 border-b border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-white">Graver<span className="text-teal-500">.uz</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a href="https://t.me/GraverAdm" className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition flex items-center"
              onClick={(e) => openTelegramWithTracking(e, 'contacts-header')}
            >
              <Send size={16} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </header>

      <nav className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to={`/${locale}`} className="text-gray-400 hover:text-teal-500">{home}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-teal-500">{title}</li>
          </ol>
        </div>
      </nav>

      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-gray-400">{subtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-teal-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{phones}</h3>
              <a href="tel:+998770802288" className="block text-teal-500 hover:text-teal-400 font-semibold">+998 77 080 22 88</a>
              <a href="tel:+998974802288" className="block text-gray-400 hover:text-teal-500 mt-1">+998 97 480 22 88</a>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                <Send className="text-teal-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{telegram}</h3>
              <a href="https://t.me/GraverAdm" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-400 font-semibold block mb-2"
              onClick={(e) => openTelegramWithTracking(e, 'contacts-link')}
            >@GraverAdm</a>
              <p className="text-gray-500 text-sm">{telegramDesc}</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-teal-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{address}</h3>
              <p className="text-gray-300">{addressValue}</p>
              <p className="text-gray-500 text-sm mt-1">{addressLandmark}</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 transition">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-teal-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{hours}</h3>
              <p className="text-gray-300 mb-1">{hoursValue}</p>
              <p className="text-teal-500 text-sm font-medium">{hoursDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{howToReach}</h2>
          <p className="text-gray-400 text-center mb-8 max-w-xl mx-auto">{howToReachDesc}</p>
          <div className="rounded-2xl overflow-hidden border border-gray-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.5!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sru!2s!4v1"
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title={howToReach}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${locale}#contact`} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition">
              {cta}
            </Link>
            <a href="https://t.me/GraverAdm" className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition border border-gray-700 flex items-center justify-center"
              onClick={(e) => openTelegramWithTracking(e, 'contacts-cta')}
            >
              <Send size={18} className="mr-2" />Telegram
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 Graver.uz</p>
        </div>
      </footer>
    </div>
  );
}
