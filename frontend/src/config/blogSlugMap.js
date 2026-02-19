export const BLOG_SLUG_MAP = {
  ru: {
      'polniy-gid-po-korporativnym-podarkam': '',
    'kak-vybrat-korporativnyj-podarok': 'korporativ-sovgani-qanday-tanlash',
    'lazernaya-gravirovka-podarkov': 'lazer-gravirovka-sovgalar',
    'podarochnye-nabory-s-logotipom': 'logotipli-sovga-toplami',
    'brendirovanie-suvenirov': 'suvenir-brendlash',
    'chek-list-zakupshchika-podarkov': 'xaridor-chek-listi-b2b',
    'top-idei-podarkov-na-novyj-god': 'yangi-yil-sovga-goyalari',
    'ekonomiya-na-korporativnyh-suvenirax': 'suvenir-byudjetini-tejash',
    'podarki-na-navruz': 'navruz-sovgalari',
    'korporativnye-podarki-s-logotipom-polnyy-gayd': 'korporativ-sovgalar-logotip-bilan-to-liq-qollanma',
    'korporativnye-podarki-s-gravirovkoy-metody': 'korporativ-sovgalar-gravyurasi-usullari',
    'lazernaya-gravirovka-podarkov-tehnologiya': 'lazer-gravyurasi-texnologiyasi',
    'merch-dlya-kompanii-brendirovanie': 'kompaniya-merchi-brendlash',
    'podarki-sotrudnikam-hr-gayd': 'xodimlar-uchun-sovgalar-hr-qollanma',
    'podarki-klientam-partneram-vip': 'mijoz-hamkorlar-uchun-sovgalar-vip',
    'brendirovannye-zazhigalki-i-chasy-s-logotipom': 'logotipli-zajigalka-va-soat',
    'korporativnye-podarochnye-nabory': 'korporativ-sovga-toplamlari',
    'korporativnye-podarki-na-navruz': 'navruz-uchun-korporativ-sovgalar',
    'welcome-pack-novym-sotrudnikam': 'yangi-xodimlar-uchun-welcome-pack',
    'kak-podgotovit-maket-logotipa': 'logotip-maketi-tayyorlash',
    'welcome-pack-dlya-sotrudnikov': 'welcome-pack-yangi-xodimlar',
    'merch-dlya-it-kompaniy-tashkent': 'merch-dlya-it-kompaniy-tashkent',
    'podarki-dlya-bankov-i-finteha-tashkent': 'podarki-dlya-bankov-i-finteha-tashkent',
    'chasy-s-logotipom-korporativnye-podarki-tashkent': 'chasy-s-logotipom-korporativnye-podarki-tashkent',
    'podarki-na-korporativnye-sobytiya-tashkent': 'podarki-na-korporativnye-sobytiya-tashkent',
    'podarki-dlya-horeca-i-restoranov-tashkent': 'podarki-dlya-horeca-i-restoranov-tashkent'
  },
  uz: {
    'korporativ-sovgani-qanday-tanlash': 'kak-vybrat-korporativnyj-podarok',
    'lazer-gravirovka-sovgalar': 'lazernaya-gravirovka-podarkov',
    'logotipli-sovga-toplami': 'podarochnye-nabory-s-logotipom',
    'suvenir-brendlash': 'brendirovanie-suvenirov',
    'xaridor-chek-listi-b2b': 'chek-list-zakupshchika-podarkov',
    'yangi-yil-sovga-goyalari': 'top-idei-podarkov-na-novyj-god',
    'suvenir-byudjetini-tejash': 'ekonomiya-na-korporativnyh-suvenirax',
    'navruz-sovgalari': 'podarki-na-navruz',
    'korporativ-sovgalar-logotip-bilan-to-liq-qollanma': 'korporativnye-podarki-s-logotipom-polnyy-gayd',
    'korporativ-sovgalar-gravyurasi-usullari': 'korporativnye-podarki-s-gravirovkoy-metody',
    'lazer-gravyurasi-texnologiyasi': 'lazernaya-gravirovka-podarkov-tehnologiya',
    'kompaniya-merchi-brendlash': 'merch-dlya-kompanii-brendirovanie',
    'xodimlar-uchun-sovgalar-hr-qollanma': 'podarki-sotrudnikam-hr-gayd',
    'mijoz-hamkorlar-uchun-sovgalar-vip': 'podarki-klientam-partneram-vip',
    'logotipli-zajigalka-va-soat': 'brendirovannye-zazhigalki-i-chasy-s-logotipom',
    'korporativ-sovga-toplamlari': 'korporativnye-podarochnye-nabory',
    'navruz-uchun-korporativ-sovgalar': 'korporativnye-podarki-na-navruz',
    'yangi-xodimlar-uchun-welcome-pack': 'welcome-pack-novym-sotrudnikam',
    'logotip-maketi-tayyorlash': 'kak-podgotovit-maket-logotipa',
    'welcome-pack-yangi-xodimlar': 'welcome-pack-dlya-sotrudnikov',
    'merch-dlya-it-kompaniy-tashkent': 'merch-dlya-it-kompaniy-tashkent',
    'podarki-dlya-bankov-i-finteha-tashkent': 'podarki-dlya-bankov-i-finteha-tashkent',
    'chasy-s-logotipom-korporativnye-podarki-tashkent': 'chasy-s-logotipom-korporativnye-podarki-tashkent',
    'podarki-na-korporativnye-sobytiya-tashkent': 'podarki-na-korporativnye-sobytiya-tashkent',
    'podarki-dlya-horeca-i-restoranov-tashkent': 'podarki-dlya-horeca-i-restoranov-tashkent'
  }
};

export function getMappedAlternateSlug(locale, slug) {
  if (!locale || !slug) return null;
  const byLocale = BLOG_SLUG_MAP[locale];
  if (!byLocale) return null;
  return byLocale[slug] || null;
}
