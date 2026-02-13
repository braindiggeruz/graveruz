/**
 * SEO Overrides Map for Blog Posts
 * Key: slug (RU posts only, UZ uses auto-translation from post.title)
 * 
 * Purpose: Fix truncated titles, add Quick Answer blocks, define related articles
 */

export const blogSeoOverrides = {
  // 1. kak-vybrat-korporativnyj-podarok — Phase 1
  'kak-vybrat-korporativnyj-podarok': {
    title: 'Как выбрать корпоративный подарок для сотрудников и клиентов — Graver.uz',
    description: 'Практичный алгоритм выбора корпоративных подарков: цель, бюджет, сегменты, брендирование, упаковка и контроль качества.',
    ogTitle: 'Как выбрать корпоративный подарок: чек-лист для бизнеса',
    ogDescription: 'Пошаговый подход к выбору корпоративных подарков для сотрудников, партнёров и клиентов без лишних затрат.',
    titleTag: 'Выбор корпоративного подарка: практические советы — Graver.uz',
    quickAnswer: 'Быстрый ответ: выбирайте по цели, аудитории и бюджету. Лучше всего работают практичные подарки с аккуратным логотипом и качественной упаковкой.',
    relatedSlugs: ['podarochnye-nabory-s-logotipom', 'brendirovanie-suvenirov', 'chek-list-zakupshchika-podarkov'],
    faq: [
      { q: 'С чего начинать выбор корпоративного подарка?', a: 'Начните с цели: мотивация сотрудников, поддержка лояльности клиентов или укрепление партнёрских отношений. От цели зависят формат подарка и бюджет.' },
      { q: 'Как распределить бюджет по сегментам?', a: 'Разделите получателей на 2-3 сегмента и задайте бюджет на человека для каждой группы. Это помогает избежать перерасхода и сохранить уместность подарка.' },
      { q: 'Что важнее: сам сувенир или упаковка?', a: 'Работает связка: полезный предмет, аккуратное брендирование и достойная упаковка. Без упаковки даже хороший подарок воспринимается проще.' }
    ]
  },

  // 2. lazernaya-gravirovka-podarkov — Phase 1
  'lazernaya-gravirovka-podarkov': {
    title: 'Лазерная гравировка подарков для бизнеса: материалы и сроки — Graver.uz',
    description: 'Разбираем, на каких материалах работает лазерная гравировка, как подготовить макет и как рассчитать сроки тиража.',
    ogTitle: 'Лазерная гравировка подарков: что важно до запуска тиража',
    ogDescription: 'Материалы, технические ограничения и практический чек-лист перед заказом гравировки корпоративных подарков.',
    quickAnswer: 'Быстрый ответ: лазерная гравировка подходит для металла, дерева, кожи и стекла. Её выбирают за стойкость, аккуратность и премиальный вид.',
    relatedSlugs: ['kak-podgotovit-maket-logotipa', 'brendirovanie-suvenirov', 'podarochnye-nabory-s-logotipom'],
    faq: [
      { q: 'Какие материалы лучше всего подходят для лазерной гравировки?', a: 'Наиболее предсказуемый результат получается на металле, дереве, коже и стекле. Для каждого материала подбираются отдельные параметры мощности и скорости.' },
      { q: 'Нужен ли векторный макет?', a: 'Да, для стабильного качества лучше использовать векторные форматы. Если есть только растр, сначала выполняют подготовку и упрощение контуров.' },
      { q: 'Можно ли сделать персонализацию в одном тираже?', a: 'Да, можно добавить имена, должности или короткие надписи для каждого изделия в рамках одного проекта.' }
    ]
  },

  // 3. podarochnye-nabory-s-logotipom — Phase 1
  'podarochnye-nabory-s-logotipom': {
    title: 'Подарочные наборы с логотипом: как собрать под бюджет — Graver.uz',
    description: 'Готовая схема сборки корпоративных подарочных наборов: состав, упаковка, уровни бюджета и контроль сроков.',
    ogTitle: 'Подарочные наборы с логотипом для сотрудников и клиентов',
    ogDescription: 'Как собрать набор, который выглядит дороже своей стоимости и усиливает бренд компании.',
    quickAnswer: 'Быстрый ответ: набор продаёт сильнее одиночного сувенира — единая упаковка и 2–4 полезных предмета с брендингом.',
    relatedSlugs: ['kak-vybrat-korporativnyj-podarok', 'welcome-pack-dlya-sotrudnikov', 'brendirovanie-suvenirov'],
    faq: [
      { q: 'Сколько предметов оптимально для корпоративного набора?', a: 'Обычно 3-4 предмета достаточно, чтобы набор выглядел цельно и полезно. Избыточная комплектация часто увеличивает бюджет без заметного эффекта.' },
      { q: 'Как выбрать упаковку под разные сегменты?', a: 'Для массовых тиражей подходит плотный картон, для ключевых клиентов — жёсткая коробка или шкатулка с брендированием.' },
      { q: 'Нужна ли персонализация внутри набора?', a: 'Да, персонализация повышает ценность. Обычно персонализируют один предмет, чтобы не раздувать сроки и стоимость.' }
    ]
  },

  // 4. welcome-pack-dlya-sotrudnikov — title too long
  'welcome-pack-dlya-sotrudnikov': {
    titleTag: 'Welcome Pack для новых сотрудников: состав и идеи — Graver.uz',
    quickAnswer: 'Быстрый ответ: Welcome Pack ускоряет адаптацию — базовые вещи для работы + мерч бренда + один элемент заботы.',
    relatedSlugs: ['podarochnye-nabory-s-logotipom', 'kak-vybrat-korporativnyj-podarok', 'brendirovanie-suvenirov']
  },

  // 5. brendirovanie-suvenirov — Phase 1
  'brendirovanie-suvenirov': {
    title: 'Брендирование сувениров: методы нанесения и выбор материала — Graver.uz',
    description: 'Сравнение методов брендирования сувениров для B2B: гравировка, печать, УФ-нанесение, тиснение и критерии выбора.',
    ogTitle: 'Брендирование сувениров: какой метод выбрать бизнесу',
    ogDescription: 'Объясняем, какой способ нанесения логотипа выбрать по материалу, тиражу и требуемому ресурсу.',
    titleTag: 'Брендирование сувениров: методы и материалы — Graver.uz',
    quickAnswer: 'Быстрый ответ: метод брендирования выбирают по материалу и тиражу. Гравировка, печать и УФ-нанесение дают разный эффект и стойкость.',
    relatedSlugs: ['lazernaya-gravirovka-podarkov', 'kak-podgotovit-maket-logotipa', 'podarochnye-nabory-s-logotipom'],
    faq: [
      { q: 'Как выбрать метод брендирования под материал?', a: 'Для металла и дерева часто выбирают гравировку, для пластика и цветной графики — печатные технологии. Ключевой критерий — сочетание стойкости и визуального эффекта.' },
      { q: 'Что влияет на итоговую стоимость нанесения?', a: 'Стоимость зависит от тиража, размера зоны нанесения, числа цветов и сложности подготовки макета.' },
      { q: 'Можно ли сначала сделать тестовый образец?', a: 'Да, тестовый образец позволяет проверить читаемость, цвет и качество нанесения до запуска партии.' }
    ]
  },

  // 6. top-idei-podarkov-na-novyj-god — title too long
  'top-idei-podarkov-na-novyj-god': {
    titleTag: 'Топ идей новогодних подарков для компании — Graver.uz',
    quickAnswer: 'Быстрый ответ: делайте 3 уровня подарков под разные роли и выбирайте полезные сезонные вещи — так проще попасть в ожидания.',
    relatedSlugs: ['ekonomiya-na-korporativnyh-suvenirax', 'chek-list-zakupshchika-podarkov', 'podarochnye-nabory-s-logotipom']
  },

  // 7. kak-podgotovit-maket-logotipa — title too long
  'kak-podgotovit-maket-logotipa': {
    titleTag: 'Подготовка макета логотипа для гравировки — Graver.uz',
    quickAnswer: 'Быстрый ответ: для гравировки нужен вектор или чистый контур. Проверьте толщины линий, шрифты и размеры перед запуском в работу.',
    relatedSlugs: ['lazernaya-gravirovka-podarkov', 'brendirovanie-suvenirov', 'podarochnye-nabory-s-logotipom']
  },

  // 8. podarki-na-navruz — title too long
  'podarki-na-navruz': {
    titleTag: 'Подарки на Навруз: традиции и современные идеи — Graver.uz',
    quickAnswer: 'Быстрый ответ: на Навруз уместны подарки с уважением к традициям — наборы, ежедневники, термокружки, сувениры с аккуратной гравировкой.',
    relatedSlugs: ['kak-vybrat-korporativnyj-podarok', 'podarochnye-nabory-s-logotipom', 'brendirovanie-suvenirov']
  },

  // 9. ekonomiya-na-korporativnyh-suvenirax — title too long
  'ekonomiya-na-korporativnyh-suvenirax': {
    titleTag: 'Экономия на корпоративных сувенирах без потери качества — Graver.uz',
    quickAnswer: 'Быстрый ответ: экономия — это планирование, правильный тираж и унификация изделий/упаковки без потери качества брендирования.',
    relatedSlugs: ['chek-list-zakupshchika-podarkov', 'kak-vybrat-korporativnyj-podarok', 'podarochnye-nabory-s-logotipom']
  },

  // 10. chek-list-zakupshchika-podarkov — Phase 1
  'chek-list-zakupshchika-podarkov': {
    title: 'Чек-лист закупщика корпоративных подарков: от брифа до приёмки — Graver.uz',
    description: 'Пошаговый чек-лист закупки корпоративных подарков: планирование, тендер, согласование макета, производство и контроль качества.',
    ogTitle: 'Чек-лист закупки корпоративных подарков для HR и Procurement',
    ogDescription: 'Готовый процесс закупки корпоративных подарков без срывов сроков и перерасхода бюджета.',
    quickAnswer: 'Быстрый ответ: чек-лист закупки — цели → бюджет → получатели → изделия → макеты → согласование → производство → приёмка.',
    relatedSlugs: ['kak-vybrat-korporativnyj-podarok', 'brendirovanie-suvenirov', 'ekonomiya-na-korporativnyh-suvenirax'],
    faq: [
      { q: 'Когда запускать закупку корпоративных подарков?', a: 'Оптимально начинать за 6-10 недель до даты вручения, чтобы пройти согласования и избежать срочных наценок.' },
      { q: 'Какие документы важно зафиксировать?', a: 'Ключевые документы: бриф, спецификация, согласованный макет, график этапов и критерии приёмки.' },
      { q: 'Как снизить риск срыва сроков?', a: 'Закладывайте буфер, утверждайте образец до тиража и фиксируйте контрольные точки по производству и логистике.' }
    ]
  }
};

// UZ overrides (Quick Answers only, titles are OK length in Uzbek)
export const blogSeoOverridesUz = {
  'korporativ-sovgani-qanday-tanlash': {
    quickAnswer: "Tezkor javob: maqsad, auditoriya va byudjet bo'yicha tanlang. Eng yaxshisi — logotipli amaliy sovg'alar va sifatli qadoqlash.",
    relatedSlugs: ['logotipli-sovga-toplami', 'suvenir-brendlash', 'xaridor-chek-listi-b2b']
  },
  'lazer-gravirovka-sovgalar': {
    quickAnswer: "Tezkor javob: lazer gravirovka metall, yog'och, charm va shishaga mos. Uzoq muddatlilik, aniqlik va premium ko'rinish uchun tanlanadi.",
    relatedSlugs: ['logotip-maketi-tayyorlash', 'suvenir-brendlash', 'logotipli-sovga-toplami']
  },
  'logotipli-sovga-toplami': {
    quickAnswer: "Tezkor javob: to'plam bitta suvenirdan kuchli sotadi — yagona qadoqlash va 2-4 foydali brendlangan buyum.",
    relatedSlugs: ['korporativ-sovgani-qanday-tanlash', 'welcome-pack-yangi-xodimlar', 'suvenir-brendlash']
  },
  'welcome-pack-yangi-xodimlar': {
    quickAnswer: "Tezkor javob: Welcome Pack adaptatsiyani tezlashtiradi — ish uchun asosiy narsalar + brend merchi + g'amxo'rlik elementi.",
    relatedSlugs: ['logotipli-sovga-toplami', 'korporativ-sovgani-qanday-tanlash', 'suvenir-brendlash']
  },
  'suvenir-brendlash': {
    quickAnswer: "Tezkor javob: brendlash usuli material va partiyaga qarab tanlanadi. Gravirovka, bosma va UV-qo'llash turli effekt va bardoshlilik beradi.",
    relatedSlugs: ['lazer-gravirovka-sovgalar', 'logotip-maketi-tayyorlash', 'logotipli-sovga-toplami']
  },
  'yangi-yil-sovga-goyalari': {
    quickAnswer: "Tezkor javob: turli rollar uchun 3 darajali sovg'alar qiling va foydali mavsumiy narsalarni tanlang — kutishlarga mos kelish osonroq.",
    relatedSlugs: ['suvenir-byudjetini-tejash', 'xaridor-chek-listi-b2b', 'logotipli-sovga-toplami']
  },
  'logotip-maketi-tayyorlash': {
    quickAnswer: "Tezkor javob: gravirovka uchun vektor yoki toza kontur kerak. Ishga kirishishdan oldin chiziq qalinliklari, shriftlar va o'lchamlarni tekshiring.",
    relatedSlugs: ['lazer-gravirovka-sovgalar', 'suvenir-brendlash', 'logotipli-sovga-toplami']
  },
  'navruz-sovgalari': {
    quickAnswer: "Tezkor javob: Navro'zga an'analarga hurmat bilan sovg'alar mos — to'plamlar, kundaliklar, termokrujkalar, ehtiyotkorlik bilan gravirovkalangan suvenirlar.",
    relatedSlugs: ['korporativ-sovgani-qanday-tanlash', 'logotipli-sovga-toplami', 'suvenir-brendlash']
  },
  'suvenir-byudjetini-tejash': {
    quickAnswer: "Tezkor javob: tejash — rejalashtirish, to'g'ri partiya va brendlash sifatini yo'qotmasdan mahsulot/qadoqlashni unifikatsiya qilish.",
    relatedSlugs: ['xaridor-chek-listi-b2b', 'korporativ-sovgani-qanday-tanlash', 'logotipli-sovga-toplami']
  },
  'xaridor-chek-listi-b2b': {
    quickAnswer: "Tezkor javob: xarid chek-listi — maqsadlar → byudjet → qabul qiluvchilar → mahsulotlar → maketlar → kelishish → ishlab chiqarish → qabul qilish.",
    relatedSlugs: ['korporativ-sovgani-qanday-tanlash', 'suvenir-brendlash', 'suvenir-byudjetini-tejash']
  }
};

// FAQ data for FAQPage Schema (P1.2)
export const blogFaqData = {
  // RU FAQs
  'kak-vybrat-korporativnyj-podarok': [
    { q: 'Как выбрать корпоративный подарок?', a: 'Выбирайте по цели, аудитории и бюджету. Практичные подарки с аккуратным логотипом работают лучше всего.' },
    { q: 'Какой бюджет на корпоративные подарки?', a: 'Зависит от аудитории: для сотрудников 500-2000 сум, для VIP-клиентов от 5000 сум.' },
    { q: 'Можно ли нанести логотип на любой подарок?', a: 'Да, мы наносим логотип лазерной гравировкой на металл, дерево, кожу и стекло.' }
  ],
  'lazernaya-gravirovka-podarkov': [
    { q: 'На каких материалах делается лазерная гравировка?', a: 'Металл, дерево, кожа, стекло, пластик. Лучше всего смотрится на металле и дереве.' },
    { q: 'Сколько времени занимает гравировка?', a: 'От 1 до 3 дней в зависимости от тиража и сложности макета.' },
    { q: 'Можно ли принести свои изделия для гравировки?', a: 'Да, принесите образец — мы оценим и протестируем.' }
  ],
  'brendirovanie-suvenirov': [
    { q: 'Какие методы брендирования существуют?', a: 'Лазерная гравировка, тампопечать, УФ-печать, шелкография. Выбор зависит от материала и тиража.' },
    { q: 'Какой минимальный тираж для брендирования?', a: 'От 10 штук для гравировки, от 50 для печати.' }
  ],
  'welcome-pack-dlya-sotrudnikov': [
    { q: 'Что входит в Welcome Pack?', a: 'Базовый набор: ежедневник, ручка, кружка, футболка с логотипом. Можно добавить power bank, наушники.' },
    { q: 'За сколько дней готовится Welcome Pack?', a: 'Стандартный набор — 3-5 дней, кастомный — от 7 дней.' }
  ],
  // UZ FAQs
  'korporativ-sovgani-qanday-tanlash': [
    { q: "Korporativ sovg'ani qanday tanlash kerak?", a: "Maqsad, auditoriya va byudjetga qarab tanlang. Logotipli amaliy sovg'alar eng yaxshi ishlaydi." },
    { q: "Har qanday sovg'aga logotip qo'ysa bo'ladimi?", a: "Ha, biz metall, yog'och, charm va shishaga lazer gravyurasi bilan logotip qo'yamiz." }
  ],
  'lazer-gravirovka-sovgalar': [
    { q: "Lazer gravyurasi qaysi materiallarda qilinadi?", a: "Metall, yog'och, charm, shisha, plastik. Metall va yog'ochda eng yaxshi ko'rinadi." },
    { q: "Gravyura qancha vaqt oladi?", a: "Tiraj va maket murakkabligiga qarab 1-3 kun." }
  ]
};

/**
 * Get FAQ data for a post
 * @param {string} slug - post slug
 * @returns {array|null} FAQ items or null
 */
export function getFaqData(slug) {
  if (blogSeoOverrides[slug] && Array.isArray(blogSeoOverrides[slug].faq)) {
    return blogSeoOverrides[slug].faq;
  }
  return blogFaqData[slug] || null;
}

/**
 * Get SEO override for a post
 * @param {string} locale - 'ru' or 'uz'
 * @param {string} slug - post slug
 * @returns {object|null} override data or null
 */
export function getSeoOverride(locale, slug) {
  if (locale === 'uz') {
    return blogSeoOverridesUz[slug] || null;
  }
  return blogSeoOverrides[slug] || null;
}
