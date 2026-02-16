import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Home, Check, Clock, Award, Package } from 'lucide-react';
import { useI18n } from './i18n';
import { buildCanonical, buildAlternate } from './config/seo';
import SeoMeta from './components/SeoMeta';
import './App.css';

const thanksTranslations = {
  ru: {
    title: 'Заявка принята.',
    titleAccent: 'Мы уже считаем ваш тираж',
    subtitle: 'Ответим в ближайшее рабочее время (10:00-20:00).',
    subtitleUrgent: 'Если срочно — напишите в Telegram прямо сейчас.',
    telegramCta: 'Написать в Telegram',
    homeCta: 'Вернуться на главную',
    nextTitle: 'Что дальше?',
    nextSubtitle: 'Прозрачный процесс от заявки до получения готовой продукции',
    step1Title: 'Макет',
    step1Desc: 'Сначала делаем цифровой превью с точным размещением вашего логотипа. Вы утверждаете каждую деталь до производства.',
    step1Time: 'В течение 2 часов',
    step2Title: 'Производство',
    step2Desc: 'Гравируем партию согласно утверждённому макету. Контроль качества каждой единицы на всех этапах.',
    step2Time: '1-3 рабочих дня',
    step3Title: 'Выдача',
    step3Desc: 'Доставка или самовывоз в оговорённые сроки. Все документы для юрлиц. Прозрачность на каждом шаге.',
    step3Time: 'Гарантия качества',
    quickContact: 'Быстрый контакт',
    quickContactDesc: 'Обычно отвечаем в течение 15-60 минут в рабочее время',
    phones: 'Телефоны:',
    corporate: 'Работаем с корпоративными заказами:',
    corporateDesc: 'мерч, награды, подарочные наборы для сотрудников и клиентов.',
    noSurprises: 'Без сюрпризов:',
    noSurprisesDesc: 'сначала макет с точным превью — потом производство. Полный контроль на каждом этапе.',
    copyright: '© 2025 Graver.uz — Премиальная лазерная гравировка в Ташкенте'
  },
  uz: {
    title: 'Ariza qabul qilindi.',
    titleAccent: 'Biz allaqachon tirajingizni hisoblaymiz',
    subtitle: 'Yaqin ish vaqtida (10:00-20:00) javob beramiz.',
    subtitleUrgent: 'Shoshilinch bo\'lsa — hoziroq Telegramga yozing.',
    telegramCta: 'Telegramga yozish',
    homeCta: 'Bosh sahifaga qaytish',
    nextTitle: 'Keyingi qadamlar?',
    nextSubtitle: 'Arizadan tayyor mahsulotgacha shaffof jarayon',
    step1Title: 'Maket',
    step1Desc: 'Avval logotipingizning aniq joylashuvi bilan raqamli ko\'rib chiqish qilamiz. Ishlab chiqarishdan oldin har bir tafsilotni tasdiqlaysiz.',
    step1Time: '2 soat ichida',
    step2Title: 'Ishlab chiqarish',
    step2Desc: 'Tasdiqlangan maketga muvofiq partiyani gravyura qilamiz. Barcha bosqichlarda har bir birlikning sifat nazorati.',
    step2Time: '1-3 ish kuni',
    step3Title: 'Topshirish',
    step3Desc: 'Kelishilgan muddatlarda yetkazib berish yoki olib ketish. Yuridik shaxslar uchun barcha hujjatlar. Har bir qadamda shaffoflik.',
    step3Time: 'Sifat kafolati',
    quickContact: 'Tezkor aloqa',
    quickContactDesc: 'Odatda ish vaqtida 15-60 daqiqa ichida javob beramiz',
    phones: 'Telefonlar:',
    corporate: 'Korporativ buyurtmalar bilan ishlaymiz:',
    corporateDesc: 'merch, mukofotlar, xodimlar va mijozlar uchun sovg\'a to\'plamlari.',
    noSurprises: 'Kutilmagan hodisalarsiz:',
    noSurprisesDesc: 'avval aniq ko\'rib chiqish bilan maket — keyin ishlab chiqarish. Har bir bosqichda to\'liq nazorat.',
    copyright: '© 2025 Graver.uz — Toshkentda premium lazer gravyurasi'
  }
};

function Thanks() {
  const { locale = 'ru' } = useParams();
  const { t: i18nT } = useI18n();
  const t = thanksTranslations[locale] || thanksTranslations.ru;

  useEffect(() => {
    document.documentElement.lang = locale === 'uz' ? 'uz-Latn' : 'ru';
    
    // Track view_thanks event for GA4
    if (window.gtag) {
      window.gtag('event', 'view_thanks', {
        page_path: window.location.pathname,
        page_title: 'Thanks Page'
      });
    }
    
    // Track Lead event for Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'Lead');
    }
    
    // Fallback for legacy tracking
    if (window.__trackLeadSuccess) {
      window.__trackLeadSuccess();
    }
    
  }, [locale]);

  const handleBackHome = () => {
    window.location.href = `/${locale}`;
  };

  return (
    <div className="Thanks min-h-screen bg-black">
      <SeoMeta
        title={i18nT('meta.thanks.title')}
        description={i18nT('meta.thanks.description')}
        canonicalUrl={buildCanonical(`/${locale}/thanks`)}
        ruUrl={buildAlternate(`/${locale}/thanks`, locale, 'ru')}
        uzUrl={buildAlternate(`/${locale}/thanks`, locale, 'uz')}
        locale={locale}
        noindex={true}
      />

      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-testid="thanks-hero"
      >
        {/* Background image layer */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/pictures/thanks-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }}
        />
        
        {/* Solid dark overlay - NO BLUR on content */}
        <div 
          className="absolute inset-0 bg-black/85"
          style={{ zIndex: 1 }}
        />
        
        {/* Content - CRISP TEXT LAYER */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" style={{ zIndex: 2 }}>
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/20 border-2 border-teal-500 rounded-full mb-8 animate-pulse">
            <Check className="text-teal-500" size={40} />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t.title}<br />
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              {t.titleAccent}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}<br />
            {t.subtitleUrgent}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://t.me/GraverAdm" data-track="tg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition shadow-lg shadow-teal-500/50 flex items-center justify-center group"
              data-testid="thanks-telegram-cta"
            >
              <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={20} />
              {t.telegramCta}
            </a>
            <button
              onClick={handleBackHome}
              className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition border border-white/20 flex items-center justify-center"
              data-testid="thanks-home-cta"
            >
              <Home className="mr-2" size={20} />
              {t.homeCta}
            </button>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-20 bg-gray-900" data-testid="thanks-next-steps">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.nextTitle}
            </h2>
            <p className="text-gray-400 text-lg">
              {t.nextSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition" data-testid="thanks-step-1">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-xl mb-6">
                <span className="text-3xl font-bold text-teal-500">01</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.step1Title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t.step1Desc}
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <Clock size={18} className="mr-2" />
                <span className="text-sm">{t.step1Time}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition" data-testid="thanks-step-2">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-xl mb-6">
                <span className="text-3xl font-bold text-teal-500">02</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.step2Title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t.step2Desc}
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <Package size={18} className="mr-2" />
                <span className="text-sm">{t.step2Time}</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/50 transition" data-testid="thanks-step-3">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-500/10 rounded-xl mb-6">
                <span className="text-3xl font-bold text-teal-500">03</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t.step3Title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {t.step3Desc}
              </p>
              <div className="mt-4 flex items-center text-teal-500">
                <Award size={18} className="mr-2" />
                <span className="text-sm">{t.step3Time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-16 bg-black border-t border-gray-800" data-testid="thanks-contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-teal-500/30 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t.quickContact}
              </h3>
              <p className="text-gray-400">
                {t.quickContactDesc}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm mb-2">{t.phones}</p>
                <a href="tel:+998770802288" data-track="tel" className="text-white text-lg font-semibold hover:text-teal-500 transition block">
                  +998 77 080 22 88
                </a>
                <a href="tel:+998974802288" data-track="tel" className="text-gray-400 text-sm hover:text-teal-500 transition block mt-1">
                  +998 97 480 22 88
                </a>
              </div>

              {/* Telegram */}
              <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Telegram:</p>
                <a 
                  href="https://t.me/GraverAdm" data-track="tg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white text-lg font-semibold hover:text-teal-500 transition flex items-center"
                >
                  <Send size={18} className="mr-2" />
                  @GraverAdm
                </a>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-teal-500 font-semibold">{t.corporate}</span> {t.corporateDesc}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-teal-500 font-semibold">{t.noSurprises}</span> {t.noSurprisesDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-300 text-sm">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Thanks;
