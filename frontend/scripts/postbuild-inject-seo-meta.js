/**
 * postbuild-inject-seo-meta.js
 *
 * Инъектирует ПОЛНЫЕ SEO мета-теги в пререндеренные HTML файлы:
 * - title, description
 * - canonical
 * - hreflang (ru, uz-Latn, x-default)
 * - robots
 * - og:title, og:description, og:url, og:image
 * - twitter:card, twitter:title, twitter:description
 *
 * ПРОБЛЕМА:
 * react-helmet не записывает теги в пререндеренный HTML при использовании react-snap.
 * Google видит пустые title, description, canonical и hreflang в view-source.
 *
 * РЕШЕНИЕ:
 * После react-snap (или inject-prerendered), этот скрипт:
 * 1. Парсит каждый пререндеренный HTML файл
 * 2. Извлекает SEO данные из пути (locale, page type, slug)
 * 3. Генерирует правильный title, description, canonical, hreflang
 * 4. Инъектирует их в <head> перед </head>
 * 5. Сохраняет обновленный HTML
 */

const fs = require('fs');
const path = require('path');

/**
 * Универсальный парсер ES-модульных export const { ... } объектов.
 * Возвращает распарсенный объект или {}.
 */
function parseExportedObject(content, exportName) {
  const marker = `export const ${exportName} = {`;
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) return {};
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let endIdx = startIdx + `export const ${exportName} = `.length;
  for (let i = endIdx; i < content.length; i++) {
    const char = content[i];
    if ((char === '"' || char === "'" || char === '`') && content[i - 1] !== '\\') {
      if (!inString) { inString = true; stringChar = char; }
      else if (char === stringChar) { inString = false; }
    }
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') { braceCount--; if (braceCount === 0) { endIdx = i + 1; break; } }
    }
  }
  const objStr = content.substring(startIdx + `export const ${exportName} = `.length, endIdx);
  try {
    return eval(`(${objStr})`);
  } catch (e) {
    console.warn(`[postbuild-inject-seo-meta] Failed to parse ${exportName}:`, e.message);
    return {};
  }
}

// Импортируем blogSeoOverrides (RU) и blogSeoOverridesUz (UZ)
let blogSeoOverrides = {};
let blogSeoOverridesUz = {};
try {
  const blogSeoPath = path.join(__dirname, '..', 'src', 'data', 'blogSeoOverrides.js');
  const content = fs.readFileSync(blogSeoPath, 'utf8');
  blogSeoOverrides = parseExportedObject(content, 'blogSeoOverrides');
  blogSeoOverridesUz = parseExportedObject(content, 'blogSeoOverridesUz');
  console.log(`[inject-seo-meta] Loaded blogSeoOverrides: ${Object.keys(blogSeoOverrides).length} RU, ${Object.keys(blogSeoOverridesUz).length} UZ slugs`);
} catch (e) {
  console.warn('[postbuild-inject-seo-meta] Failed to load blogSeoOverrides.js:', e.message);
}

// Импортируем маппинг slug -> og:image из blogImages.js
let blogOgImageBySlug = {};
try {
  const blogImagesPath = path.join(__dirname, '..', 'src', 'data', 'blogImages.js');
  const imgContent = fs.readFileSync(blogImagesPath, 'utf8');
  const defaultBlogCover = '/images/blog/default-og.jpg';
  const imgStartIdx = imgContent.indexOf('const blogCardImageBySlug = {');
  if (imgStartIdx !== -1) {
    let braceCount = 0, inString = false, stringChar = '', endIdx = imgStartIdx + 'const blogCardImageBySlug = '.length;
    for (let i = endIdx; i < imgContent.length; i++) {
      const char = imgContent[i];
      if ((char === '"' || char === "'" || char === '`') && imgContent[i - 1] !== '\\') {
        if (!inString) { inString = true; stringChar = char; }
        else if (char === stringChar) { inString = false; }
      }
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') { braceCount--; if (braceCount === 0) { endIdx = i + 1; break; } }
      }
    }
    const objStr = imgContent.substring(imgStartIdx + 'const blogCardImageBySlug = '.length, endIdx);
    const rawMap = eval(`(function(){ const defaultBlogCover='${defaultBlogCover}'; return ${objStr}; })()`);
    // Конвертируем в og-пути (.png -> -og.jpg)
    for (const [slug, imgPath] of Object.entries(rawMap)) {
      let ogPath = imgPath;
      if (ogPath.endsWith('.png')) { ogPath = ogPath.replace(/\.png$/i, '-og.jpg'); }
      else if (!ogPath.endsWith('-og.jpg')) { ogPath = ogPath.replace(/\.[^.]+$/, '-og.jpg'); }
      blogOgImageBySlug[slug] = ogPath;
    }
    console.log(`[inject-seo-meta] Loaded blogOgImageBySlug: ${Object.keys(blogOgImageBySlug).length} slugs`);
  }
} catch (e) {
  console.warn('[postbuild-inject-seo-meta] Failed to load blogImages.js:', e.message);
}

const BASE_URL = 'https://graver-studio.uz';
const OG_IMAGE = `${BASE_URL}/og-blog.png`;

// Маппинг RU -> UZ и UZ -> RU слагов для hreflang
// Обновлено 2026-03-02: добавлен полный маппинг блог-постов из blogSlugMap.js
const ROUTE_MAP_RU_TO_UZ = {
  // Страницы сайта
  'catalog-products': 'mahsulotlar-katalogi',
  'watches-with-logo': 'logotipli-soat',
  'lighters-engraving': 'gravirovkali-zajigalka',
  'engraved-gifts': 'gravirovkali-sovgalar',
  'products/neo-watches': 'neo-soatlar',
  'products/neo-corporate': 'neo-korporativ',
  'products/neo-gift': 'neo-sovga',
  // Блог-посты (только те, у которых есть реальный UZ эквивалент в prerendered/)
  'blog/brendirovanie-suvenirov': 'blog/suvenir-brendlash',
  'blog/brendirovannye-zazhigalki-i-chasy-s-logotipom': 'blog/logotipli-zajigalka-va-soat',
  'blog/chasy-s-logotipom-korporativnye-podarki-tashkent': 'blog/logotipli-soat-korporativ-sovgalar-toshkent',
  'blog/chek-list-zakupshchika-podarkov': 'blog/xaridor-chek-listi-b2b',
  'blog/ekonomiya-na-korporativnyh-suvenirax': 'blog/suvenir-byudjetini-tejash',
  'blog/kak-podgotovit-maket-logotipa': 'blog/logotip-maketi-tayyorlash',
  'blog/kak-vybrat-korporativnyj-podarok': 'blog/korporativ-sovgani-qanday-tanlash',
  'blog/korporativnye-podarki-na-navruz': 'blog/navruz-uchun-korporativ-sovgalar',
  'blog/korporativnye-podarki-s-gravirovkoy-metody': 'blog/korporativ-sovgalar-gravyurasi-usullari',
  'blog/korporativnye-podarki-s-logotipom-polnyy-gayd': 'blog/korporativ-sovgalar-logotip-bilan-to-liq-qollanma',
  'blog/korporativnye-podarochnye-nabory': 'blog/korporativ-sovga-toplamlari',
  'blog/lazernaya-gravirovka-podarkov': 'blog/lazer-gravirovka-sovgalar',
  'blog/lazernaya-gravirovka-podarkov-tehnologiya': 'blog/lazer-gravyurasi-texnologiyasi',
  'blog/merch-dlya-it-kompaniy-tashkent': 'blog/it-kompaniyalar-uchun-merch-toshkent',
  'blog/merch-dlya-kompanii-brendirovanie': 'blog/kompaniya-merchi-brendlash',
  'blog/podarki-dlya-bankov-i-finteha-tashkent': 'blog/banklar-va-fintex-uchun-sovgalar-toshkent',
  'blog/podarki-dlya-horeca-i-restoranov-tashkent': 'blog/horeca-va-restoranlar-uchun-sovgalar-toshkent',
  'blog/podarki-klientam-partneram-vip': 'blog/mijoz-hamkorlar-uchun-sovgalar-vip',
  'blog/podarki-na-korporativnye-sobytiya-tashkent': 'blog/korporativ-tadbirlar-uchun-sovgalar-toshkent',
  'blog/podarki-na-navruz': 'blog/navruz-sovgalari',
  'blog/podarki-sotrudnikam-hr-gayd': 'blog/xodimlar-uchun-sovgalar-hr-qollanma',
  'blog/podarochnye-nabory-s-logotipom': 'blog/logotipli-sovga-toplami',
  'blog/polniy-gid-po-korporativnym-podarkam': 'blog/korporativ-sovgalar-boyicha-toliq-qollanma',
  'blog/top-idei-podarkov-na-novyj-god': 'blog/yangi-yil-sovga-goyalari',
  'blog/welcome-pack-dlya-sotrudnikov': 'blog/welcome-pack-yangi-xodimlar',
  'blog/welcome-pack-novym-sotrudnikam': 'blog/yangi-xodimlar-uchun-welcome-pack',
};
const ROUTE_MAP_UZ_TO_RU = Object.fromEntries(
  Object.entries(ROUTE_MAP_RU_TO_UZ).map(([ru, uz]) => [uz, ru])
);

// Страницы с noindex
const NOINDEX_PATHS = ['/ru/thanks/', '/uz/thanks/'];

// SEO конфигурация для каждой страницы
const SEO_CONFIG = {
  '/ru/': {
    title: 'Graver.uz — Корпоративные подарки с лазерной гравировкой | Ташкент',
    description: 'Премиальная лазерная гравировка для бизнеса в Ташкенте. Корпоративные подарки, мерч, сувениры с логотипом на заказ. От 1 до 10,000+ единиц. Гарантия качества.'
  },
  '/uz/': {
    title: 'Graver.uz — Korporativ sovgalar lazer gravyurasi bilan | Toshkent',
    description: 'Biznes uchun premium lazer gravyura Toshkentda. Korporativ sovgalar, merch, logotipli suvenirlar buyurtmasi. 1 dan 10,000+ donagacha. Sifat kafolati.'
  },
  '/ru/blog/': {
    title: 'Блог о корпоративных подарках и гравировке | Graver.uz',
    description: 'Полезные статьи о выборе корпоративных подарков, лазерной гравировке, брендировании и мерче для бизнеса в Узбекистане.'
  },
  '/uz/blog/': {
    title: 'Korporativ sovgalar va gravyura haqida blog | Graver.uz',
    description: 'Korporativ sovgalar tanlash, lazer gravyura, brending va merch haqida foydali maqolalar Ozbekistonda.'
  },
  '/ru/engraved-gifts/': {
    title: 'Ручки, повербанки и ежедневники с гравировкой | Graver.uz',
    description: 'Премиальные подарки с лазерной гравировкой: ручки, ежедневники, повербанки, фляги. Персонализация для каждого сотрудника.'
  },
  '/uz/gravirovkali-sovgalar/': {
    title: 'Qalam, powerbank va kundaliklar gravyura bilan | Graver.uz',
    description: 'Premium sovgalar lazer gravyura bilan: qalamlar, kundaliklar, powerbank, kolbalar. Har bir xodim uchun shaxsiylashtirish.'
  },
  '/ru/watches-with-logo/': {
    title: 'Часы с логотипом и гравировкой | Graver.uz',
    description: 'Премиальные часы с логотипом компании. Идеальный подарок для VIP-клиентов и партнеров. Гарантия качества.'
  },
  '/uz/logotipli-soat/': {
    title: 'Logotipli soatlar va gravyura bilan | Graver.uz',
    description: 'Premium soatlar kompaniya logotipi bilan. VIP-mijozlar va hamkorlar uchun ideal sovga. Sifat kafolati.'
  },
  '/ru/process/': {
    title: 'Как мы работаем | Graver.uz',
    description: 'Прозрачный процесс от заявки до получения: макет, утверждение, производство, контроль качества.'
  },
  '/uz/process/': {
    title: 'Biz qanday ishlayamiz | Graver.uz',
    description: 'Ariza berish dan olib, mahsulotni qabul qilishgacha shaffof jarayon: maketi, tasdiqlash, ishlab chiqarish, sifat nazorati.'
  },
  '/ru/contacts/': {
    title: 'Контакты | Graver.uz',
    description: 'Свяжитесь с нами для консультации. Адрес: Ташкент, улица Мукими. Телефон: +998 77 080 22 88. Telegram: @GraverAdm'
  },
  '/uz/contacts/': {
    title: 'Aloqa | Graver.uz',
    description: 'Konsultatsiya uchun biz bilan bog\'laning. Manzil: Toshkent, Mukimi ko\'chasi. Telefon: +998 77 080 22 88. Telegram: @GraverAdm'
  },
  '/ru/catalog-products/': {
    title: 'Продукция с гравировкой (в наличии) | Graver.uz',
    description: 'Готовые товары с гравировкой в наличии: ручки, ежедневники, фляги, часы, ножи и другое. Быстрая доставка.'
  },
  '/uz/mahsulotlar-katalogi/': {
    title: 'Gravyura bilan mahsulotlar (zaxirada) | Graver.uz',
    description: 'Gravyura bilan tayyor tovarlar zaxirada: qalamlar, kundaliklar, kolbalar, soatlar, pichoqlar va boshqalar. Tez yetkazib berish.'
  },
  '/ru/guarantees/': {
    title: 'Гарантия качества | Graver.uz',
    description: 'Мы гарантируем высокое качество всех работ. Контроль на каждом этапе производства. Возврат денег, если не доволены.'
  },
  '/uz/guarantees/': {
    title: 'Sifat kafolati | Graver.uz',
    description: 'Biz barcha ishlarning yuqori sifatini kafolatlayamiz. Ishlab chiqarish har bir bosqichida nazorat. Agar qoniqmagan bo\'lsa, pul qaytarish.'
  },
  '/ru/products/lighters/': {
    title: 'Зажигалки с логотипом и гравировкой | Graver.uz',
    description: 'Металлические зажигалки с лазерной гравировкой логотипа. Персональный подарок для клиентов и партнеров. Quartz и Zippo модели. Цена от 160 000 сум.'
  },
  '/uz/products/lighters/': {
    title: 'Logotipli yoqilg\'ich gravyura bilan | Graver.uz',
    description: 'Metall yoqilg\'ichlar lazer gravyura logotipi bilan. Mijozlar va hamkorlar uchun shaxsiy sovga. Quartz va Zippo modellari. Narxi 160 000 so\'mdan.'
  },
  '/ru/products/neo-watches/': {
    title: 'Часы NEO с гравировкой на заказ | Премиум подарок | Graver.uz',
    description: 'Часы NEO Quartz (750K) и Automatic (1.1M) с персональной гравировкой. Бесплатный макет, доставка 1-3 дня. Идеальный подарок для VIP клиентов и партнёров.'
  },
  '/uz/neo-soatlar/': {
    title: 'NEO soatlar gravyura bilan buyurtma | Premium sovga | Graver.uz',
    description: 'NEO soatlar Quartz (750K) va Automatic (1.1M) shaxsiy gravyura bilan. Bepul maketi, 1-3 kunlik yetkazib berish. VIP mijozlar va hamkorlar uchun ideal sovga.'
  },
  '/ru/products/neo-corporate/': {
    title: 'Корпоративные часы NEO с логотипом | Премиум подарок | Graver.uz',
    description: 'Часы NEO с логотипом компании для VIP-клиентов и партнеров. Персональная гравировка, бесплатный макет, доставка 1-3 дня. От 1 до 10,000+ единиц.'
  },
  '/uz/neo-korporativ/': {
    title: 'Korporativ NEO soatlar logotip bilan | Premium sovga | Graver.uz',
    description: 'NEO soatlar kompaniya logotipi bilan VIP-mijozlar va hamkorlar uchun. Shaxsiy gravyura, bepul maketi, 1-3 kunlik yetkazib berish. 1 dan 10,000+ donagacha.'
  },
  '/ru/products/neo-gift/': {
    title: 'Часы NEO в подарок с персональной гравировкой | Graver.uz',
    description: 'Часы NEO — идеальный подарок с персональной гравировкой. Запечатли важный момент на металле. Бесплатный макет, быстрая доставка по Узбекистану.'
  },
  '/uz/neo-sovga/': {
    title: 'NEO soatlar sovga sifatida shaxsiy gravyura bilan | Graver.uz',
    description: 'NEO soatlar — muhim momentni metalda fiksirlash uchun ideal sovga. Bepul maketi, Ozbekistonga tez yetkazib berish.'
  },
  '/ru/thanks/': {
    title: 'Спасибо за заявку | Graver.uz',
    description: 'Ваша заявка принята. Мы свяжемся с вами в ближайшее время.',
    noindex: true
  },
  '/uz/thanks/': {
    title: 'Arizangiz uchun rahmat | Graver.uz',
    description: 'Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.',
    noindex: true
  }
};

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');

/**
 * Строит canonical URL для данного пути
 */
function buildCanonical(pathKey) {
  // Убедимся что путь заканчивается на /
  const normalized = pathKey.endsWith('/') ? pathKey : pathKey + '/';
  return `${BASE_URL}${normalized}`;
}

/**
 * Строит alternate URL для hreflang
 * Обрабатывает маппинг RU<->UZ слагов
 */
function buildAlternate(pathKey, toLocale) {
  const segments = pathKey.replace(/^\//, '').replace(/\/$/, '').split('/');
  const fromLocale = segments[0]; // 'ru' или 'uz'
  
  if (fromLocale === toLocale) {
    return buildCanonical(pathKey);
  }
  
  // Меняем locale
  segments[0] = toLocale;
  
  // Маппинг слагов
  if (segments.length >= 2) {
    const slug = segments.slice(1).join('/');
    if (fromLocale === 'ru' && toLocale === 'uz' && ROUTE_MAP_RU_TO_UZ[slug]) {
      segments.splice(1, segments.length - 1, ROUTE_MAP_RU_TO_UZ[slug]);
    } else if (fromLocale === 'uz' && toLocale === 'ru' && ROUTE_MAP_UZ_TO_RU[slug]) {
      segments.splice(1, segments.length - 1, ROUTE_MAP_UZ_TO_RU[slug]);
    }
  }
  
  return buildCanonical('/' + segments.join('/'));
}

function generateSeoMeta(locale, pathKey) {
  // Точный поиск в конфиге
  if (SEO_CONFIG[pathKey]) {
    return SEO_CONFIG[pathKey];
  }
  
  // Для блог статей - получаем SEO данные из blogSeoOverrides.js
  if (pathKey.includes('/blog/')) {
    // Если это главная блог страница (/ru/blog/ или /uz/blog/), используем generic title
    if (pathKey === '/ru/blog/' || pathKey === '/uz/blog/') {
      if (locale === 'uz') {
        return {
          title: 'Korporativ sovgalar va gravyura haqida blog | Graver.uz',
          description: 'Korporativ sovgalar tanlash, lazer gravyura, brending va merch haqida foydali maqolalar Ozbekistonda.'
        };
      }
      return {
        title: 'Блог о корпоративных подарках и гравировке | Graver.uz',
        description: 'Полезные статьи о выборе корпоративных подарков, лазерной гравировке, брендировании и мерче для бизнеса в Узбекистане.'
      };
    }
    
    // Для отдельных статей - получаем SEO данные из blogSeoOverrides
    // Извлекаем slug из пути (/ru/blog/slug/ или /uz/blog/slug/)
    const slugMatch = pathKey.match(/\/blog\/([^/]+)/);
    if (slugMatch && slugMatch[1]) {
      const slug = slugMatch[1];
      // Выбираем нужный словарь в зависимости от locale
      const overrideMap = locale === 'uz' ? blogSeoOverridesUz : blogSeoOverrides;
      const override = overrideMap[slug];
      if (override) {
        return {
          title: override.title,
          description: override.description,
          ogTitle: override.ogTitle || override.title,
          ogDescription: override.ogDescription || override.description
        };
      }
      // Если override не найден, возвращаем null (будет использован title из prerendered HTML)
      return null;
    }
    
    // Если нет SEO данных в blogSeoOverrides, пропускаем
    return null;
  }
  
  // Default
  if (locale === 'uz') {
    return {
      title: 'Graver.uz — Lazer gravyura Toshkentda',
      description: 'Biznes uchun premium lazer gravyura Toshkentda.'
    };
  }
  return {
    title: 'Graver.uz — Лазерная гравировка в Ташкенте',
    description: 'Премиальная лазерная гравировка для бизнеса в Ташкенте.'
  };
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function injectSeoMeta(htmlFilePath, pathKey) {
  try {
    let html = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // Определяем locale из пути
    const locale = pathKey.startsWith('/uz') ? 'uz' : 'ru';
    
    // Получаем SEO конфиг
    const seo = generateSeoMeta(locale, pathKey);
    
    // Если generateSeoMeta вернул null (для отдельных блог статей), пропускаем
    if (seo === null) {
      console.log(`[inject-seo-meta] ⊘ ${pathKey} — пропускаю (используются существующие title/description из prerendered HTML)`);
      return;
    }
    
    const isNoindex = seo.noindex || NOINDEX_PATHS.includes(pathKey);
    
    // Строим canonical и hreflang URLs
    const canonicalUrl = buildCanonical(pathKey);
    const ruUrl = buildAlternate(pathKey, 'ru');
    const uzUrl = buildAlternate(pathKey, 'uz');
    const robotsContent = isNoindex ? 'noindex, nofollow' : 'index, follow';
    
    // Генерируем новые теги
    const newTitle = `<title>${escapeHtml(seo.title)}</title>`;
    const newDescription = `<meta name="description" content="${escapeHtml(seo.description)}" />`;
    const newRobots = `<meta name="robots" content="${robotsContent}" />`;
    const newCanonical = `<link rel="canonical" href="${canonicalUrl}" />`;
    const newHreflangRu = `<link rel="alternate" hreflang="ru" href="${ruUrl}" />`;
    const newHreflangUz = `<link rel="alternate" hreflang="uz-Latn" href="${uzUrl}" />`;
    const newHreflangDefault = `<link rel="alternate" hreflang="x-default" href="${ruUrl}" />`;
    const newOgTitle = `<meta property="og:title" content="${escapeHtml(seo.title)}" />`;
    const newOgDesc = `<meta property="og:description" content="${escapeHtml(seo.description)}" />`;
    const newOgUrl = `<meta property="og:url" content="${canonicalUrl}" />`;
    // Per-post og:image: используем уникальное изображение из blogImages.js, если есть
    const slugForOg = (pathKey.match(/\/blog\/([^/]+)/) || [])[1];
    const perPostOgPath = slugForOg && blogOgImageBySlug[slugForOg] ? blogOgImageBySlug[slugForOg] : null;
    const ogImageUrl = perPostOgPath ? `${BASE_URL}${perPostOgPath}` : OG_IMAGE;
    const newOgImage = `<meta property="og:image" content="${ogImageUrl}" />`;
    const newOgType = `<meta property="og:type" content="${pathKey.includes('/blog/') && slugForOg ? 'article' : 'website'}" />`;
    const newOgSiteName = `<meta property="og:site_name" content="Graver.uz" />`;
    const newOgLocale = `<meta property="og:locale" content="${locale === 'uz' ? 'uz_UZ' : 'ru_RU'}" />`;
    const newTwitterCard = `<meta name="twitter:card" content="summary_large_image" />`;
    const newTwitterTitle = `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`;
    const newTwitterDesc = `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`;
    const newTwitterImage = `<meta name="twitter:image" content="${ogImageUrl}" />`;
    
    // Заменяем или добавляем title
    if (/<title[^>]*>[^<]*<\/title>/.test(html)) {
      html = html.replace(/<title[^>]*>[^<]*<\/title>/, newTitle);
    } else {
      html = html.replace(/<\/head>/, `${newTitle}\n</head>`);
    }
    
    // Заменяем или добавляем description
    if (/<meta\s+name=["']description["']/i.test(html)) {
      html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, newDescription);
    } else {
      html = html.replace(/<\/head>/, `${newDescription}\n</head>`);
    }
    
    // Удаляем все старые robots теги (включая data-rh от react-helmet)
    html = html.replace(/<meta[^>]*name=["']robots["'][^>]*>/gi, '');
    html = html.replace(/<meta[^>]*robots[^>]*data-rh[^>]*>/gi, '');
    // Добавляем новый robots
    html = html.replace(/<\/head>/, `${newRobots}\n</head>`);
    
    // Удаляем старые canonical/hreflang/og теги (включая data-rh от react-helmet с любым порядком атрибутов) и добавляем новые
    // Удаляем любой <link> тег содержащий rel="canonical" (в любом месте)
    html = html.replace(/<link[^>]*rel=["']canonical["'][^>]*\/?>/gi, '');
    html = html.replace(/<link[^>]*canonical[^>]*data-rh[^>]*>/gi, '');
    html = html.replace(/<link\s+rel=["']alternate["'][^>]*hreflang[^>]*>/gi, '');
    html = html.replace(/<link[^>]*hreflang[^>]*>/gi, '');
    html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
    html = html.replace(/<meta[^>]*property=["']og:[^"']*["'][^>]*>/gi, '');
    html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name=["']twitter:[^"']*["'][^>]*>/gi, '');
    
    // Инъектируем все новые теги перед </head>
    const seoTags = [
      newCanonical,
      newHreflangRu,
      newHreflangUz,
      newHreflangDefault,
      newOgTitle,
      newOgDesc,
      newOgUrl,
      newOgImage,
      newOgType,
      newOgSiteName,
      newOgLocale,
      newTwitterCard,
      newTwitterTitle,
      newTwitterDesc,
      newTwitterImage
    ].join('\n');
    
    // Вставляем SEO-теги в правильное место
    if (/<\/head>/.test(html)) {
      // Нормальный случай: вставляем перед </head>
      html = html.replace(/<\/head>/, `${seoTags}\n</head>`);
    } else if (/<\/body>/.test(html)) {
      // Файл есть, но </head> отсутствует — закрываем head и добавляем теги перед </body>
      html = html.replace(/<\/body>/, `${seoTags}\n</head>\n</body>`);
      console.warn(`[inject-seo-meta] ⚠️  ${pathKey} — </head> не найден, теги вставлены перед </body>`);
    } else {
      // Файл оборван: добавляем закрывающие теги в конец файла
      html += `\n${seoTags}\n</head>\n</body>\n</html>`;
      console.warn(`[inject-seo-meta] ⚠️  ${pathKey} — ни </head>, ни </body> не найдены, теги добавлены в конец файла`);
    }
    
    // Сохраняем обновленный HTML
    fs.writeFileSync(htmlFilePath, html, 'utf-8');
    console.log(`[inject-seo-meta] ✓ ${pathKey} — canonical, hreflang, og, title инъектированы`);
    
  } catch (err) {
    console.error(`[inject-seo-meta] ✗ Ошибка при обработке ${htmlFilePath}:`, err.message);
  }
}

function processDirectory(dir, baseDir, pathPrefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);
    const urlPath = pathPrefix + '/' + relPath.replace(/\\/g, '/');
    
    if (entry.isDirectory()) {
      processDirectory(fullPath, baseDir, pathPrefix);
    } else if (entry.name === 'index.html') {
      let pathKey = urlPath.replace(/\/index\.html$/, '/').replace(/^\//, '/');
      if (!pathKey.startsWith('/')) pathKey = '/' + pathKey;
      
      injectSeoMeta(fullPath, pathKey);
    }
  }
}

// Основной процесс
console.log('[inject-seo-meta] Начинаю инъекцию ПОЛНЫХ SEO мета-тегов (canonical, hreflang, og, robots)...');

// Проверяем, какую папку обрабатывать (build или prerendered)
let targetDir = BUILD_DIR;
if (!fs.existsSync(BUILD_DIR)) {
  if (fs.existsSync(PRERENDERED_DIR)) {
    targetDir = PRERENDERED_DIR;
    console.log('[inject-seo-meta] build/ не найден, обрабатываю prerendered/');
  } else {
    console.error('[inject-seo-meta] ERROR: Ни build/, ни prerendered/ не найдены.');
    process.exit(1);
  }
}

// Обрабатываем корневой index.html
const rootHtml = path.join(targetDir, 'index.html');
if (fs.existsSync(rootHtml)) {
  injectSeoMeta(rootHtml, '/ru/');
}

// Обрабатываем локализованные папки (ru/, uz/)
processDirectory(targetDir, targetDir);

console.log('[inject-seo-meta] ✓ Готово! Все canonical, hreflang и og теги инъектированы.');
