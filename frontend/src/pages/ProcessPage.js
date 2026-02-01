import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, Send, ArrowLeft, FileCheck, Clock, Truck, CheckCircle, Package } from 'lucide-react';

const translations = {
  ru: {
    title: "Процесс работы",
    subtitle: "Прозрачный процесс от заявки до готовой продукции",
    meta: "Как работает Graver.uz: от заявки до получения корпоративных подарков. Прозрачный процесс, контроль качества.",
    back: "На главную",
    cta: "Оставить заявку",
    steps: [
      {
        icon: "FileCheck",
        title: "1. Заявка и консультация",
        time: "15-30 минут",
        description: "Вы описываете задачу: что нужно брендировать, тираж, сроки. Мы консультируем по материалам и технологиям, предлагаем оптимальные решения.",
        details: ["Бесплатная консультация", "Подбор материалов", "Расчёт стоимости"]
      },
      {
        icon: "Package",
        title: "2. Создание макета",
        time: "1-2 часа",
        description: "Дизайнер создаёт цифровой макет с точным размещением вашего логотипа. Вы видите финальный результат до производства.",
        details: ["Цифровое превью", "Точные размеры", "Неограниченные правки"]
      },
      {
        icon: "CheckCircle",
        title: "3. Утверждение",
        time: "По вашему графику",
        description: "Вы согласовываете макет, вносите правки при необходимости. Фиксируем финальную версию, сроки и стоимость.",
        details: ["Согласование каждой детали", "Фиксация сроков", "Предоплата 50%"]
      },
      {
        icon: "Clock",
        title: "4. Производство",
        time: "1-3 рабочих дня",
        description: "Гравируем партию согласно утверждённому макету. Контроль качества каждой единицы на всех этапах.",
        details: ["Fiber/CO2/UV лазеры", "Контроль качества", "Фото готовой продукции"]
      },
      {
        icon: "Truck",
        title: "5. Выдача",
        time: "В оговорённый срок",
        description: "Доставка или самовывоз. Все документы для юрлиц. Оплата остатка при получении.",
        details: ["Доставка по Ташкенту", "Документы для бухгалтерии", "Гарантия качества"]
      }
    ]
  },
  uz: {
    title: "Ish jarayoni",
    subtitle: "Arizadan tayyor mahsulotgacha shaffof jarayon",
    meta: "Graver.uz qanday ishlaydi: arizadan korporativ sovg'alarni olishgacha. Shaffof jarayon, sifat nazorati.",
    back: "Bosh sahifa",
    cta: "Ariza qoldirish",
    steps: [
      {
        icon: "FileCheck",
        title: "1. Ariza va maslahat",
        time: "15-30 daqiqa",
        description: "Siz vazifani tasvirlaysiz: nimani brendlash kerak, tiraj, muddatlar. Biz materiallar va texnologiyalar bo'yicha maslahat beramiz.",
        details: ["Bepul maslahat", "Materiallarni tanlash", "Narxni hisoblash"]
      },
      {
        icon: "Package",
        title: "2. Maket yaratish",
        time: "1-2 soat",
        description: "Dizayner logotipingizning aniq joylashuvi bilan raqamli maket yaratadi. Ishlab chiqarishdan oldin yakuniy natijani ko'rasiz.",
        details: ["Raqamli ko'rib chiqish", "Aniq o'lchamlar", "Cheksiz tuzatishlar"]
      },
      {
        icon: "CheckCircle",
        title: "3. Tasdiqlash",
        time: "Sizning jadvalingiz bo'yicha",
        description: "Siz maketni tasdiqlaysiz, kerak bo'lsa o'zgartirishlar kiritasiz. Yakuniy versiya, muddat va narxni belgilaymiz.",
        details: ["Har bir tafsilotni kelishish", "Muddatlarni belgilash", "50% oldindan to'lov"]
      },
      {
        icon: "Clock",
        title: "4. Ishlab chiqarish",
        time: "1-3 ish kuni",
        description: "Tasdiqlangan maketga muvofiq partiyani gravyura qilamiz. Barcha bosqichlarda har bir birlikning sifat nazorati.",
        details: ["Fiber/CO2/UV lazerlar", "Sifat nazorati", "Tayyor mahsulot fotosi"]
      },
      {
        icon: "Truck",
        title: "5. Topshirish",
        time: "Kelishilgan muddatda",
        description: "Yetkazib berish yoki olib ketish. Yuridik shaxslar uchun barcha hujjatlar. Qolgan to'lovni qabul qilishda.",
        details: ["Toshkent bo'ylab yetkazib berish", "Buxgalteriya uchun hujjatlar", "Sifat kafolati"]
      }
    ]
  }
};

const iconMap = {
  FileCheck: FileCheck,
  Package: Package,
  CheckCircle: CheckCircle,
  Clock: Clock,
  Truck: Truck
};

export default function ProcessPage() {
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

        {/* Process Steps */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-8">
              {t.steps.map((step, index) => {
                const IconComponent = iconMap[step.icon];
                return (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/30 transition">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-teal-500" size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                          <span className="text-teal-500 text-sm font-medium">{step.time}</span>
                        </div>
                        <p className="text-gray-400 mb-4">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.details.map((detail, i) => (
                            <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {locale === 'ru' ? 'Готовы начать?' : 'Boshlashga tayyormisiz?'}
            </h2>
            <p className="text-gray-400 mb-8">
              {locale === 'ru' 
                ? 'Оставьте заявку или напишите в Telegram для бесплатной консультации' 
                : 'Bepul maslahat uchun ariza qoldiring yoki Telegramga yozing'}
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
