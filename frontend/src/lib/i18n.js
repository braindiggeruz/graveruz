import { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  ru: {
    // Navigation
    nav: {
      home: 'Главная',
      products: 'Продукты',
      calculator: 'Калькулятор',
      howItWorks: 'Как получить',
      blog: 'Блог',
      about: 'О нас',
      contacts: 'Контакты',
      calculateCredit: 'Рассчитать кредит',
      applyNow: 'Подать заявку',
    },
    // Hero
    hero: {
      title: 'Кредиты для бизнеса и самозанятых — быстро и прозрачно',
      subtitle: 'Решение за 1 день, минимум документов, понятные условия.',
      cta1: 'Рассчитать кредит',
      cta2: 'Узнать продукты',
      badge1: 'Без скрытых платежей',
      badge2: 'Решение за 1 день',
      badge3: 'Идентификация myID',
    },
    // Products
    products: {
      title: 'Выберите ваш продукт',
      subtitle: 'Подберите оптимальное решение для вашего бизнеса',
      learnMore: 'Подробнее',
      business: {
        name: 'Для бизнесменов',
        desc: 'До 150 млн без залога, до 1 млрд — под обеспечение*',
        details: ['Рост бизнеса', 'Закупка товаров', 'Расширение'],
      },
      tezkor: {
        name: 'Tezkor кредит',
        desc: 'Быстрое финансирование для ИП и самозанятых',
        details: ['До 50 млн без залога', 'Без поручителей', 'Быстрое решение'],
      },
      agro: {
        name: 'Агро кредит',
        desc: 'Льготный период до 9 месяцев*',
        details: ['Гибкий график', 'Аннуитет/дифференц', 'Без скрытых комиссий'],
      },
      auto: {
        name: 'Под залог авто',
        desc: 'Оценка авто быстро, прозрачные условия',
        details: ['Минимум документов', 'Быстрая оценка', 'Выгодные условия'],
      },
      selfEmployed: {
        name: 'Самозанятым',
        desc: 'Простой микрозайм без сложных процедур',
        details: ['Быстро и удобно', 'Без долгого ожидания', 'Простые условия'],
      },
      footnote: '*Условия зависят от скоринга и предоставленных документов',
    },
    // Calculator
    calculator: {
      title: 'Рассчитайте кредит',
      amount: 'Сумма кредита',
      term: 'Срок кредита',
      months: 'месяцев',
      monthlyPayment: 'Ежемесячный платёж (ориентировочно)',
      totalOverpay: 'Переплата',
      disclaimer: 'Расчёт ориентировочный, фактические условия могут отличаться.',
      apply: 'Отправить заявку',
      details: 'Посмотреть детали расчёта',
    },
    // Trust
    trust: {
      title: 'Почему нам доверяют',
      transparency: {
        title: 'Прозрачность',
        desc: 'Без скрытых комиссий и платежей',
      },
      documents: {
        title: 'Документы доступны',
        desc: 'Шаблоны договоров в открытом доступе',
      },
      support: {
        title: 'Поддержка',
        desc: 'Телефон + Telegram круглосуточно',
      },
      offices: {
        title: 'Офисы',
        desc: 'Ташкент и Самарканд',
      },
      publicInfo: {
        title: 'Публичная информация',
        desc: 'Финансовая отчётность и лицензии',
      },
      sustainability: {
        title: 'Устойчивое развитие',
        desc: 'Поддерживаем малый бизнес',
      },
    },
    // How it works
    howItWorks: {
      title: 'Как получить кредит',
      subtitle: '4 простых шага до получения средств',
      step1: {
        title: 'Рассчитайте условия',
        desc: 'Используйте калькулятор для подбора суммы и срока',
      },
      step2: {
        title: 'Отправьте заявку',
        desc: 'Подтвердите номер телефона через SMS',
      },
      step3: {
        title: 'Загрузите документы',
        desc: 'Паспорт и прописка, пройдите идентификацию myID',
      },
      step4: {
        title: 'Получите решение',
        desc: 'Решение за 1 день, деньги на счёт',
      },
    },
    // Testimonials
    testimonials: {
      title: 'Истории наших клиентов',
    },
    // FAQ
    faq: {
      title: 'Частые вопросы',
      items: [
        {
          q: 'Кому доступен кредит?',
          a: 'Кредиты доступны ИП, самозанятым, фермерам и юридическим лицам, зарегистрированным в Узбекистане.',
        },
        {
          q: 'Сколько времени занимает рассмотрение?',
          a: 'Решение по заявке принимается в течение 1 рабочего дня после предоставления всех документов.',
        },
        {
          q: 'Какие документы нужны?',
          a: 'Паспорт, справка о прописке, документы о регистрации бизнеса (для ИП/ЮЛ).',
        },
        {
          q: 'Как работает идентификация myID?',
          a: 'myID — государственная система идентификации. Вы подтверждаете личность через приложение или сайт myID.',
        },
        {
          q: 'Какой график платежей?',
          a: 'Доступны аннуитетные (равные) и дифференцированные платежи. Выбор при оформлении.',
        },
        {
          q: 'Что влияет на решение по заявке?',
          a: 'Кредитная история, финансовое состояние, предоставленные документы и залоговое обеспечение.',
        },
        {
          q: 'Можно ли погасить досрочно?',
          a: 'Да, досрочное погашение возможно без штрафов и комиссий.',
        },
        {
          q: 'Как связаться с поддержкой?',
          a: 'По телефону +998 71 200 00 00 или в Telegram @oasiscredit_support',
        },
      ],
    },
    // Final CTA
    finalCta: {
      title: 'Готовы рассчитать?',
      subtitle: 'Займёт 1 минуту',
      cta1: 'Рассчитать',
      cta2: 'Написать в Telegram',
    },
    // Footer
    footer: {
      phone: 'Телефон',
      email: 'Email',
      schedule: 'График работы',
      scheduleValue: 'Пн-Пт: 9:00-18:00',
      offices: 'Офисы',
      tashkent: 'Ташкент, ул. Амира Темура, 108',
      samarkand: 'Самарканд, ул. Регистан, 15',
      quickLinks: 'Быстрые ссылки',
      publicInfo: 'Публичная информация',
      financialInfo: 'Финансовая информация',
      contracts: 'Шаблоны договоров',
      privacy: 'Политика конфиденциальности',
      disclaimer: 'Условия кредитования зависят от скоринга и предоставленных документов.',
      copyright: '© 2024 Oasis Credit. Все права защищены.',
    },
    // Application form
    application: {
      title: 'Подать заявку',
      step1: {
        title: 'Подтверждение условий',
        desc: 'Ознакомьтесь с условиями кредитования',
        agree: 'Я согласен с условиями кредитования и политикой конфиденциальности',
      },
      step2: {
        title: 'Подтверждение номера',
        desc: 'Введите код из SMS',
        phone: 'Номер телефона',
        sendCode: 'Отправить код',
        code: 'Код из SMS',
      },
      step3: {
        title: 'Контактные данные',
        desc: 'Укажите ваши данные',
        firstName: 'Имя',
        lastName: 'Фамилия',
        phone: 'Телефон',
      },
      step4: {
        title: 'Загрузка документов',
        desc: 'Загрузите фото паспорта и прописки',
        passport: 'Паспорт (разворот)',
        registration: 'Прописка',
        hint: 'JPEG/PNG, до 10 МБ',
      },
      step5: {
        title: 'Идентификация myID',
        desc: 'Подтвердите личность через myID',
        button: 'Перейти в myID',
      },
      step6: {
        title: 'Заявка принята!',
        desc: 'Мы свяжемся с вами в течение 1 рабочего дня',
        back: 'На главную',
      },
      next: 'Далее',
      back: 'Назад',
      submit: 'Отправить заявку',
    },
    // Blog
    blog: {
      title: 'Блог',
      subtitle: 'Полезные статьи о финансах и бизнесе',
      categories: {
        all: 'Все',
        financial: 'Финансовая грамотность',
        business: 'Рост бизнеса',
        selfEmployed: 'Самозанятые и ИП',
        agro: 'Агро',
        stories: 'Истории клиентов',
        news: 'Новости',
      },
      readMore: 'Читать далее',
      updated: 'Обновлено',
      relatedArticles: 'Похожие статьи',
    },
    // About
    about: {
      title: 'О компании Oasis Credit',
      subtitle: 'Мы поддерживаем устойчивое развитие малого бизнеса в Узбекистане',
      mission: 'Наша миссия',
      missionText: 'Предоставлять быстрое и прозрачное финансирование для развития малого и среднего бизнеса.',
      values: 'Наши ценности',
      value1: 'Прозрачность во всём',
      value2: 'Скорость принятия решений',
      value3: 'Поддержка клиентов',
      value4: 'Социальная ответственность',
    },
    // Contacts
    contacts: {
      title: 'Контакты',
      subtitle: 'Свяжитесь с нами любым удобным способом',
      form: {
        title: 'Напишите нам',
        name: 'Ваше имя',
        email: 'Email',
        message: 'Сообщение',
        send: 'Отправить',
      },
    },
    // Common
    common: {
      sum: 'сум',
      million: 'млн',
      billion: 'млрд',
      month: 'мес',
      year: 'год',
      from: 'от',
      to: 'до',
      call: 'Позвонить',
      telegram: 'Telegram',
    },
  },
  uz: {
    nav: {
      home: 'Bosh sahifa',
      products: 'Mahsulotlar',
      calculator: 'Kalkulyator',
      howItWorks: 'Qanday olish',
      blog: 'Blog',
      about: 'Biz haqimizda',
      contacts: 'Kontaktlar',
      calculateCredit: 'Kreditni hisoblash',
      applyNow: 'Ariza berish',
    },
    hero: {
      title: 'Biznes va o\'z-o\'zini band qilganlar uchun kreditlar — tez va shaffof',
      subtitle: '1 kunda qaror, minimal hujjatlar, tushunarli shartlar.',
      cta1: 'Kreditni hisoblash',
      cta2: 'Mahsulotlarni ko\'rish',
      badge1: 'Yashirin to\'lovlarsiz',
      badge2: '1 kunda qaror',
      badge3: 'myID identifikatsiya',
    },
    products: {
      title: 'Mahsulotni tanlang',
      subtitle: 'Biznesingiz uchun optimal yechim',
      learnMore: 'Batafsil',
      business: {
        name: 'Tadbirkorlar uchun',
        desc: 'Garovsiz 150 mln gacha, garov bilan 1 mlrd gacha*',
        details: ['Biznes o\'sishi', 'Tovar xaridi', 'Kengaytirish'],
      },
      tezkor: {
        name: 'Tezkor kredit',
        desc: 'YaTT va o\'z-o\'zini band qilganlar uchun tez moliyalashtirish',
        details: ['Garovsiz 50 mln gacha', 'Kafillarsiz', 'Tez qaror'],
      },
      agro: {
        name: 'Agro kredit',
        desc: '9 oygacha imtiyozli davr*',
        details: ['Moslashuvchan jadval', 'Annuitet/differentsial', 'Yashirin komissiyalarsiz'],
      },
      auto: {
        name: 'Avtomobil garovi',
        desc: 'Tez avtomobil baholash, shaffof shartlar',
        details: ['Minimal hujjatlar', 'Tez baholash', 'Foydali shartlar'],
      },
      selfEmployed: {
        name: 'O\'z-o\'zini band qilganlar',
        desc: 'Murakkab jarayonlarsiz oddiy mikroqarz',
        details: ['Tez va qulay', 'Uzoq kutmasdan', 'Oddiy shartlar'],
      },
      footnote: '*Shartlar skoring va taqdim etilgan hujjatlarga bog\'liq',
    },
    calculator: {
      title: 'Kreditni hisoblang',
      amount: 'Kredit summasi',
      term: 'Kredit muddati',
      months: 'oy',
      monthlyPayment: 'Oylik to\'lov (taxminiy)',
      totalOverpay: 'Ortiqcha to\'lov',
      disclaimer: 'Hisob-kitob taxminiy, haqiqiy shartlar farq qilishi mumkin.',
      apply: 'Ariza yuborish',
      details: 'Hisob tafsilotlarini ko\'rish',
    },
    trust: {
      title: 'Nima uchun bizga ishonishadi',
      transparency: { title: 'Shaffoflik', desc: 'Yashirin komissiya va to\'lovlarsiz' },
      documents: { title: 'Hujjatlar mavjud', desc: 'Shartnoma namunalari ochiq' },
      support: { title: 'Qo\'llab-quvvatlash', desc: 'Telefon + Telegram 24/7' },
      offices: { title: 'Ofislar', desc: 'Toshkent va Samarqand' },
      publicInfo: { title: 'Ommaviy ma\'lumot', desc: 'Moliyaviy hisobot va litsenziyalar' },
      sustainability: { title: 'Barqaror rivojlanish', desc: 'Kichik biznesni qo\'llab-quvvatlaymiz' },
    },
    howItWorks: {
      title: 'Kreditni qanday olish',
      subtitle: 'Mablag\' olishgacha 4 oddiy qadam',
      step1: { title: 'Shartlarni hisoblang', desc: 'Summa va muddatni tanlash uchun kalkulyatordan foydalaning' },
      step2: { title: 'Ariza yuboring', desc: 'Telefon raqamingizni SMS orqali tasdiqlang' },
      step3: { title: 'Hujjatlarni yuklang', desc: 'Pasport va propiska, myID identifikatsiya' },
      step4: { title: 'Qaror oling', desc: '1 kunda qaror, hisobga pul' },
    },
    testimonials: { title: 'Mijozlarimiz tarixi' },
    faq: {
      title: 'Ko\'p so\'raladigan savollar',
      items: [
        { q: 'Kredit kimga mavjud?', a: 'Kreditlar O\'zbekistonda ro\'yxatdan o\'tgan YaTT, o\'z-o\'zini band qilganlar, fermerlar va yuridik shaxslarga mavjud.' },
        { q: 'Ko\'rib chiqish qancha vaqt oladi?', a: 'Barcha hujjatlar taqdim etilgandan so\'ng 1 ish kuni ichida qaror qabul qilinadi.' },
        { q: 'Qanday hujjatlar kerak?', a: 'Pasport, propiska haqida ma\'lumotnoma, biznes ro\'yxatga olish hujjatlari (YaTT/YuSh uchun).' },
        { q: 'myID identifikatsiya qanday ishlaydi?', a: 'myID - davlat identifikatsiya tizimi. Shaxsingizni myID ilovasi yoki sayti orqali tasdiqlaysiz.' },
        { q: 'To\'lov jadvali qanday?', a: 'Annuitet (teng) va differentsial to\'lovlar mavjud. Rasmiylashtirish vaqtida tanlov.' },
        { q: 'Arizaga qarorga nima ta\'sir qiladi?', a: 'Kredit tarixi, moliyaviy holat, taqdim etilgan hujjatlar va garov ta\'minoti.' },
        { q: 'Muddatidan oldin to\'lash mumkinmi?', a: 'Ha, muddatidan oldin to\'lash jarima va komissiyalarsiz mumkin.' },
        { q: 'Qo\'llab-quvvatlash bilan qanday bog\'lanish mumkin?', a: '+998 71 200 00 00 telefon yoki Telegram @oasiscredit_support' },
      ],
    },
    finalCta: { title: 'Hisoblashga tayyormisiz?', subtitle: '1 daqiqa vaqt oladi', cta1: 'Hisoblash', cta2: 'Telegramga yozish' },
    footer: {
      phone: 'Telefon',
      email: 'Email',
      schedule: 'Ish jadvali',
      scheduleValue: 'Du-Ju: 9:00-18:00',
      offices: 'Ofislar',
      tashkent: 'Toshkent, Amir Temur ko\'chasi, 108',
      samarkand: 'Samarqand, Registon ko\'chasi, 15',
      quickLinks: 'Tezkor havolalar',
      publicInfo: 'Ommaviy ma\'lumot',
      financialInfo: 'Moliyaviy ma\'lumot',
      contracts: 'Shartnoma namunalari',
      privacy: 'Maxfiylik siyosati',
      disclaimer: 'Kreditlash shartlari skoring va taqdim etilgan hujjatlarga bog\'liq.',
      copyright: '© 2024 Oasis Credit. Barcha huquqlar himoyalangan.',
    },
    application: {
      title: 'Ariza berish',
      step1: { title: 'Shartlarni tasdiqlash', desc: 'Kredit shartlari bilan tanishing', agree: 'Kredit shartlari va maxfiylik siyosatiga roziman' },
      step2: { title: 'Raqamni tasdiqlash', desc: 'SMS kodini kiriting', phone: 'Telefon raqami', sendCode: 'Kod yuborish', code: 'SMS kodi' },
      step3: { title: 'Aloqa ma\'lumotlari', desc: 'Ma\'lumotlaringizni kiriting', firstName: 'Ism', lastName: 'Familiya', phone: 'Telefon' },
      step4: { title: 'Hujjatlarni yuklash', desc: 'Pasport va propiska rasmini yuklang', passport: 'Pasport (ochiq)', registration: 'Propiska', hint: 'JPEG/PNG, 10 MB gacha' },
      step5: { title: 'myID identifikatsiya', desc: 'myID orqali shaxsingizni tasdiqlang', button: 'myID ga o\'tish' },
      step6: { title: 'Ariza qabul qilindi!', desc: '1 ish kuni ichida siz bilan bog\'lanamiz', back: 'Bosh sahifaga' },
      next: 'Keyingi',
      back: 'Orqaga',
      submit: 'Ariza yuborish',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Moliya va biznes haqida foydali maqolalar',
      categories: { all: 'Hammasi', financial: 'Moliyaviy savodxonlik', business: 'Biznes o\'sishi', selfEmployed: 'O\'z-o\'zini band qilganlar va YaTT', agro: 'Agro', stories: 'Mijozlar tarixi', news: 'Yangiliklar' },
      readMore: 'Davomini o\'qish',
      updated: 'Yangilangan',
      relatedArticles: 'O\'xshash maqolalar',
    },
    about: {
      title: 'Oasis Credit kompaniyasi haqida',
      subtitle: 'Biz O\'zbekistonda kichik biznesning barqaror rivojlanishini qo\'llab-quvvatlaymiz',
      mission: 'Bizning missiyamiz',
      missionText: 'Kichik va o\'rta biznesni rivojlantirish uchun tez va shaffof moliyalashtirish taqdim etish.',
      values: 'Bizning qadriyatlarimiz',
      value1: 'Hamma narsada shaffoflik',
      value2: 'Qaror qabul qilish tezligi',
      value3: 'Mijozlarni qo\'llab-quvvatlash',
      value4: 'Ijtimoiy mas\'uliyat',
    },
    contacts: {
      title: 'Kontaktlar',
      subtitle: 'Biz bilan istalgan qulay usulda bog\'laning',
      form: { title: 'Bizga yozing', name: 'Ismingiz', email: 'Email', message: 'Xabar', send: 'Yuborish' },
    },
    common: { sum: 'so\'m', million: 'mln', billion: 'mlrd', month: 'oy', year: 'yil', from: 'dan', to: 'gacha', call: 'Qo\'ng\'iroq', telegram: 'Telegram' },
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      calculator: 'Calculator',
      howItWorks: 'How to Get',
      blog: 'Blog',
      about: 'About',
      contacts: 'Contacts',
      calculateCredit: 'Calculate Credit',
      applyNow: 'Apply Now',
    },
    hero: {
      title: 'Business and Self-Employed Loans — Fast and Transparent',
      subtitle: 'Decision in 1 day, minimal documents, clear terms.',
      cta1: 'Calculate Credit',
      cta2: 'View Products',
      badge1: 'No Hidden Fees',
      badge2: 'Decision in 1 Day',
      badge3: 'myID Verification',
    },
    products: {
      title: 'Choose Your Product',
      subtitle: 'Find the optimal solution for your business',
      learnMore: 'Learn More',
      business: {
        name: 'For Business',
        desc: 'Up to 150M without collateral, up to 1B with collateral*',
        details: ['Business growth', 'Inventory purchase', 'Expansion'],
      },
      tezkor: {
        name: 'Tezkor Credit',
        desc: 'Fast financing for entrepreneurs and self-employed',
        details: ['Up to 50M without collateral', 'No guarantors', 'Quick decision'],
      },
      agro: {
        name: 'Agro Credit',
        desc: 'Grace period up to 9 months*',
        details: ['Flexible schedule', 'Annuity/differential', 'No hidden fees'],
      },
      auto: {
        name: 'Auto Pledge',
        desc: 'Fast car evaluation, transparent terms',
        details: ['Minimal documents', 'Quick evaluation', 'Favorable terms'],
      },
      selfEmployed: {
        name: 'Self-Employed',
        desc: 'Simple microloan without complex procedures',
        details: ['Fast and convenient', 'No long waiting', 'Simple terms'],
      },
      footnote: '*Terms depend on scoring and submitted documents',
    },
    calculator: {
      title: 'Calculate Your Credit',
      amount: 'Loan Amount',
      term: 'Loan Term',
      months: 'months',
      monthlyPayment: 'Monthly Payment (estimate)',
      totalOverpay: 'Total Overpayment',
      disclaimer: 'Calculation is approximate, actual terms may vary.',
      apply: 'Submit Application',
      details: 'View Calculation Details',
    },
    trust: {
      title: 'Why Trust Us',
      transparency: { title: 'Transparency', desc: 'No hidden fees or charges' },
      documents: { title: 'Documents Available', desc: 'Contract templates publicly accessible' },
      support: { title: 'Support', desc: 'Phone + Telegram 24/7' },
      offices: { title: 'Offices', desc: 'Tashkent and Samarkand' },
      publicInfo: { title: 'Public Information', desc: 'Financial reports and licenses' },
      sustainability: { title: 'Sustainability', desc: 'Supporting small business' },
    },
    howItWorks: {
      title: 'How to Get a Loan',
      subtitle: '4 simple steps to get funds',
      step1: { title: 'Calculate Terms', desc: 'Use the calculator to select amount and term' },
      step2: { title: 'Submit Application', desc: 'Verify your phone number via SMS' },
      step3: { title: 'Upload Documents', desc: 'Passport and registration, myID verification' },
      step4: { title: 'Get Decision', desc: 'Decision in 1 day, funds to account' },
    },
    testimonials: { title: 'Customer Stories' },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'Who can get a loan?', a: 'Loans are available to entrepreneurs, self-employed, farmers, and legal entities registered in Uzbekistan.' },
        { q: 'How long does review take?', a: 'Decision is made within 1 business day after all documents are submitted.' },
        { q: 'What documents are needed?', a: 'Passport, registration certificate, business registration documents (for entrepreneurs/legal entities).' },
        { q: 'How does myID verification work?', a: 'myID is a government identification system. You verify your identity through the myID app or website.' },
        { q: 'What is the payment schedule?', a: 'Annuity (equal) and differential payments are available. Choice at registration.' },
        { q: 'What affects the application decision?', a: 'Credit history, financial status, submitted documents, and collateral.' },
        { q: 'Can I pay off early?', a: 'Yes, early repayment is possible without penalties or fees.' },
        { q: 'How to contact support?', a: 'By phone +998 71 200 00 00 or Telegram @oasiscredit_support' },
      ],
    },
    finalCta: { title: 'Ready to Calculate?', subtitle: 'Takes 1 minute', cta1: 'Calculate', cta2: 'Write on Telegram' },
    footer: {
      phone: 'Phone',
      email: 'Email',
      schedule: 'Working Hours',
      scheduleValue: 'Mon-Fri: 9:00-18:00',
      offices: 'Offices',
      tashkent: 'Tashkent, Amir Temur St, 108',
      samarkand: 'Samarkand, Registan St, 15',
      quickLinks: 'Quick Links',
      publicInfo: 'Public Information',
      financialInfo: 'Financial Information',
      contracts: 'Contract Templates',
      privacy: 'Privacy Policy',
      disclaimer: 'Loan terms depend on scoring and submitted documents.',
      copyright: '© 2024 Oasis Credit. All rights reserved.',
    },
    application: {
      title: 'Submit Application',
      step1: { title: 'Confirm Terms', desc: 'Review loan terms', agree: 'I agree to the loan terms and privacy policy' },
      step2: { title: 'Verify Number', desc: 'Enter SMS code', phone: 'Phone Number', sendCode: 'Send Code', code: 'SMS Code' },
      step3: { title: 'Contact Details', desc: 'Enter your details', firstName: 'First Name', lastName: 'Last Name', phone: 'Phone' },
      step4: { title: 'Upload Documents', desc: 'Upload passport and registration photos', passport: 'Passport (spread)', registration: 'Registration', hint: 'JPEG/PNG, up to 10 MB' },
      step5: { title: 'myID Verification', desc: 'Verify identity via myID', button: 'Go to myID' },
      step6: { title: 'Application Received!', desc: 'We will contact you within 1 business day', back: 'Go to Home' },
      next: 'Next',
      back: 'Back',
      submit: 'Submit Application',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Useful articles about finance and business',
      categories: { all: 'All', financial: 'Financial Literacy', business: 'Business Growth', selfEmployed: 'Self-Employed', agro: 'Agro', stories: 'Customer Stories', news: 'News' },
      readMore: 'Read More',
      updated: 'Updated',
      relatedArticles: 'Related Articles',
    },
    about: {
      title: 'About Oasis Credit',
      subtitle: 'We support sustainable development of small business in Uzbekistan',
      mission: 'Our Mission',
      missionText: 'To provide fast and transparent financing for small and medium business development.',
      values: 'Our Values',
      value1: 'Transparency in everything',
      value2: 'Speed of decision-making',
      value3: 'Customer support',
      value4: 'Social responsibility',
    },
    contacts: {
      title: 'Contacts',
      subtitle: 'Contact us in any convenient way',
      form: { title: 'Write to Us', name: 'Your Name', email: 'Email', message: 'Message', send: 'Send' },
    },
    common: { sum: 'sum', million: 'M', billion: 'B', month: 'mo', year: 'year', from: 'from', to: 'to', call: 'Call', telegram: 'Telegram' },
  },
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('ru');

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [locale]);

  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t, translations: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

export default translations;
