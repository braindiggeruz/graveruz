import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, Send, ArrowLeft, Shield, RefreshCw, Award, CheckCircle } from 'lucide-react';

const translations = {
  ru: {
    title: "Гарантии качества",
    subtitle: "Ваша уверенность — наш приоритет",
    meta: "Гарантии Graver.uz: утверждение макета до производства, контроль качества, переделка при несоответствии. Ташкент.",
    back: "На главную",
    cta: "Оставить заявку",
    guarantees: [
      {
        icon: "CheckCircle",
        title: "Макет до производства",
        description: "Вы видите цифровой макет с точным размещением логотипа до начала работ. Никаких сюрпризов — утверждаете каждую деталь."
      },
      {
        icon: "Shield",
        title: "Контроль качества",
        description: "Проверяем каждую единицу продукции. Фотоотчёт готовых изделий перед отправкой. Брак исключён."
      },
      {
        icon: "RefreshCw",
        title: "Переделка при несоответствии",
        description: "Если результат не соответствует утверждённому макету — переделаем за наш счёт. Без вопросов."
      },
      {
        icon: "Award",
        title: "Гарантия на изделия",
        description: "Гравировка устойчива к истиранию и выцветанию. При дефекте материала — замена изделия."
      }
    ],
    terms: {
      title: "Условия гарантии",
      items: [
        "Гарантия распространяется на все работы, выполненные Graver.uz",
        "Срок гарантии — 12 месяцев с момента получения",
        "Гарантия не распространяется на механические повреждения",
        "Для активации гарантии сохраните чек или акт выполненных работ"
      ]
    }
  },
  uz: {
    title: "Sifat kafolatlari",
    subtitle: "Sizning ishonchingiz — bizning ustuvorligimiz",
    meta: "Graver.uz kafolatlari: ishlab chiqarishdan oldin maketni tasdiqlash, sifat nazorati, mos kelmaslik holatida qayta ishlash. Toshkent.",
    back: "Bosh sahifa",
    cta: "Ariza qoldirish",
    guarantees: [
      {
        icon: "CheckCircle",
        title: "Ishlab chiqarishdan oldin maket",
        description: "Ishni boshlashdan oldin logotipning aniq joylashuvi bilan raqamli maketni ko'rasiz. Kutilmagan hodisalar yo'q — har bir tafsilotni tasdiqlaysiz."
      },
      {
        icon: "Shield",
        title: "Sifat nazorati",
        description: "Har bir mahsulotni tekshiramiz. Yuborishdan oldin tayyor mahsulotlarning fotosurati. Nuqsonlar istisno."
      },
      {
        icon: "RefreshCw",
        title: "Mos kelmaslik holatida qayta ishlash",
        description: "Agar natija tasdiqlangan maketga mos kelmasa — biz hisobimizga qayta ishlaymiz. Savolsiz."
      },
      {
        icon: "Award",
        title: "Mahsulotlarga kafolat",
        description: "Gravyura ishqalanish va rangini yo'qotishga chidamli. Material nuqsoni bo'lsa — mahsulotni almashtirish."
      }
    ],
    terms: {
      title: "Kafolat shartlari",
      items: [
        "Kafolat Graver.uz tomonidan bajarilgan barcha ishlarga tarqaladi",
        "Kafolat muddati — qabul qilgan paytdan boshlab 12 oy",
        "Kafolat mexanik shikastlanishlarga tarqalmaydi",
        "Kafolatni faollashtirish uchun chek yoki bajarilgan ishlar dalolatnomasini saqlang"
      ]
    }
  }
};

const iconMap = {
  CheckCircle: CheckCircle,
  Shield: Shield,
  RefreshCw: RefreshCw,
  Award: Award
};

export default function GuaranteesPage() {
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

        {/* Guarantees Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {t.guarantees.map((item, index) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/30 transition">
                    <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="text-teal-500" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">{item.title}</h2>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{t.terms.title}</h2>
            <div className="bg-black border border-gray-800 rounded-2xl p-8">
              <ul className="space-y-4">
                {t.terms.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {locale === 'ru' ? 'Есть вопросы?' : 'Savollaringiz bormi?'}
            </h2>
            <p className="text-gray-400 mb-8">
              {locale === 'ru' 
                ? 'Свяжитесь с нами — ответим на все вопросы о гарантиях и условиях работы' 
                : 'Biz bilan bog\'laning — kafolatlar va ish shartlari haqidagi barcha savollarga javob beramiz'}
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
