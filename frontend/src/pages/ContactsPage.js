import { openTelegramWithTracking } from '../utils/pixel';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Send, MapPin, Clock } from 'lucide-react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { BASE_URL, buildCanonical, buildAlternate, HREFLANG_MAP } from '../config/seo';
import { useI18n } from '../i18n';
import SEOHead from '../components/SEOHead';

export default function ContactsPage() {
  const { locale = 'ru' } = useParams();
  const { t } = useI18n();
  
  const home = locale === 'uz' ? 'Bosh sahifa' : 'Главная';
  const title = locale === 'uz' ? 'Kontaktlar' : 'Контакты';
  const subtitle = locale === 'uz' ? 'Qulay usulda biz bilan bog\'laning' : 'Свяжитесь с нами удобным способом';
  const cta = locale === 'uz' ? 'Ariza qoldirish' : 'Оставить заявку';
  const phones = locale === 'uz' ? 'Telefonlar' : 'Телефоны';
  const telegram = 'Telegram';
  const telegramDesc = locale === 'uz' ? 'Tezkor javoblar' : 'Быстрые ответы';
  const address = locale === 'uz' ? 'Manzil' : 'Адрес';
  const addressValue = locale === 'uz' ? 'Toshkent, Muqimiy ko\'chasi' : 'Ташкент, улица Мукими';
  const hours = locale === 'uz' ? 'Ish vaqti' : 'Режим работы';
  const hoursValue = locale === 'uz' ? 'Du-Ya: 10:00 - 20:00' : 'Пн-Вс: 10:00 - 20:00';
  const hoursDesc = locale === 'uz' ? 'Arizalar 24/7' : 'Заявки 24/7';
  
  const pathname = `/${locale}/contacts`;
  const canonicalUrl = buildCanonical(pathname);
  const ruUrl = buildAlternate(pathname, locale, 'ru');
  const uzUrl = buildAlternate(pathname, locale, 'uz');

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    window.scrollTo(0, 0);
    
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": home, "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": title, "item": canonicalUrl }
      ]
    };
    
    const oldSchema = document.getElementById('breadcrumb-schema');
    if (oldSchema) oldSchema.remove();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
    
    return () => {
      var breadcrumbSchemaEl = document.getElementById('breadcrumb-schema');
      if (breadcrumbSchemaEl) {
        breadcrumbSchemaEl.remove();
      }
    };
  }, [locale, home, title, canonicalUrl]);

  return (
    <div className="min-h-screen bg-black">
      <SEOHead page="contacts" />

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
            <div className="mb-12">
              <YMaps>
                <Map defaultState={{ center: [41.2995, 69.2401], zoom: 15 }} width="100%" height="400px">
                  <Placemark geometry={[41.2995, 69.2401]} />
                </Map>
              </YMaps>
            </div>
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
          <p>© 2025 Graver.uz</p>
        </div>
      </footer>
    </div>
  );
}
