/**
 * SEO Overrides Map for Blog Posts
 * Key: slug (RU posts only, UZ uses auto-translation from post.title)
 * 
 * Purpose: Fix truncated titles, add Quick Answer blocks, define related articles
 */

export const blogSeoOverrides = {
  // 1. kak-vybrat-korporativnyj-podarok — title too long
  'kak-vybrat-korporativnyj-podarok': {
    titleTag: 'Выбор корпоративного подарка: практические советы — Graver.uz',
    quickAnswer: 'Быстрый ответ: выбирайте по цели, аудитории и бюджету. Лучше всего работают практичные подарки с аккуратным логотипом и качественной упаковкой.',
    relatedSlugs: ['podarochnye-nabory-s-logotipom', 'brendirovanie-suvenirov', 'chek-list-zakupshchika-podarkov']
  },

  // 2. lazernaya-gravirovka-podarkov — title OK, add quick answer + links
  'lazernaya-gravirovka-podarkov': {
    quickAnswer: 'Быстрый ответ: лазерная гравировка подходит для металла, дерева, кожи и стекла. Её выбирают за стойкость, аккуратность и премиальный вид.',
    relatedSlugs: ['kak-podgotovit-maket-logotipa', 'brendirovanie-suvenirov', 'podarochnye-nabory-s-logotipom']
  },

  // 3. podarochnye-nabory-s-logotipom — title OK
  'podarochnye-nabory-s-logotipom': {
    quickAnswer: 'Быстрый ответ: набор продаёт сильнее одиночного сувенира — единая упаковка и 2–4 полезных предмета с брендингом.',
    relatedSlugs: ['kak-vybrat-korporativnyj-podarok', 'welcome-pack-dlya-sotrudnikov', 'brendirovanie-suvenirov']
  },

  // 4. welcome-pack-dlya-sotrudnikov — title too long
  'welcome-pack-dlya-sotrudnikov': {
    titleTag: 'Welcome Pack для новых сотрудников: состав и идеи — Graver.uz',
    quickAnswer: 'Быстрый ответ: Welcome Pack ускоряет адаптацию — базовые вещи для работы + мерч бренда + один элемент заботы.',
    relatedSlugs: ['podarochnye-nabory-s-logotipom', 'kak-vybrat-korporativnyj-podarok', 'brendirovanie-suvenirov']
  },

  // 5. brendirovanie-suvenirov — title too long
  'brendirovanie-suvenirov': {
    titleTag: 'Брендирование сувениров: методы и материалы — Graver.uz',
    quickAnswer: 'Быстрый ответ: метод брендирования выбирают по материалу и тиражу. Гравировка, печать и УФ-нанесение дают разный эффект и стойкость.',
    relatedSlugs: ['lazernaya-gravirovka-podarkov', 'kak-podgotovit-maket-logotipa', 'podarochnye-nabory-s-logotipom']
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

  // 10. chek-list-zakupshchika-podarkov — title OK
  'chek-list-zakupshchika-podarkov': {
    quickAnswer: 'Быстрый ответ: чек-лист закупки — цели → бюджет → получатели → изделия → макеты → согласование → производство → приёмка.',
    relatedSlugs: ['kak-vybrat-korporativnyj-podarok', 'brendirovanie-suvenirov', 'ekonomiya-na-korporativnyh-suvenirax']
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
