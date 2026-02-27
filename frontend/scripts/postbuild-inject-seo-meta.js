/**
 * postbuild-inject-seo-meta.js
 *
 * Инъектирует SEO мета-теги (title, description, og:* и т.д.) в пререндеренные HTML файлы.
 *
 * ПРОБЛЕМА:
 * react-helmet не записывает теги в пререндеренный HTML при использовании react-snap.
 * Google видит пустые title и description в view-source.
 *
 * РЕШЕНИЕ:
 * После react-snap (или inject-prerendered), этот скрипт:
 * 1. Парсит каждый пререндеренный HTML файл
 * 2. Извлекает SEO данные из пути (locale, page type, slug)
 * 3. Генерирует правильный title и description
 * 4. Инъектирует их в <head> перед </head>
 * 5. Сохраняет обновленный HTML
 */

const fs = require('fs');
const path = require('path');

// SEO конфигурация для каждой страницы
const SEO_CONFIG = {
  // Главная страница
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
    title: 'Зажигалки с логотипом | Graver.uz',
    description: 'Премиальные зажигалки с гравировкой логотипа. Идеальный подарок для курящих клиентов и партнеров.'
  },
  '/uz/products/lighters/': {
    title: 'Logotipli yoqilg\'i | Graver.uz',
    description: 'Premium yoqilg\'i logotip gravyurasi bilan. Chekuvchi mijozlar va hamkorlar uchun ideal sovga.'
  },
  '/ru/products/neo-watches/': {
    title: 'Часы NEO с гравировкой на заказ | Премиум подарок | Graver.uz',
    description: 'Часы NEO Quartz (750K) и Automatic (1.1M) с персональной гравировкой. Бесплатный макет, доставка 1-3 дня. Идеальный подарок для VIP клиентов и партнёров.'
  },
  '/uz/products/neo-watches/': {
    title: 'NEO soatlar gravyura bilan | Graver.uz',
    description: 'NEO soatlar gravyura bilan. Quartz va Automatic modellar. Tez ishlab chiqarish, chiroyli o\'ramga.'
  },
  '/ru/neo-soatlar/': {
    title: 'Часы NEO с гравировкой на заказ | Премиум подарок | Graver.uz',
    description: 'Часы NEO Quartz (750K) и Automatic (1.1M) с персональной гравировкой. Бесплатный макет, доставка 1-3 дня. Идеальный подарок для VIP клиентов и партнёров.'
  },
  '/uz/neo-soatlar/': {
    title: 'NEO soatlar gravyura bilan | Graver.uz',
    description: 'NEO soatlar gravyura bilan. Quartz va Automatic modellar. Tez ishlab chiqarish, chiroyli o\'ramga.'
  },
  '/ru/products/neo-corporate/': {
    title: 'Корпоративные часы NEO с логотипом | Премиум подарок компании | Graver.uz',
    description: 'Часы NEO с логотипом компании для VIP-клиентов и партнеров. Персональная гравировка, бесплатный макет, доставка 1-3 дня. От 1 до 10,000+ единиц.'
  },
  '/uz/neo-korporativ/': {
    title: 'Korporativ NEO soatlar logotip bilan | Premium sovga | Graver.uz',
    description: 'NEO soatlar kompaniya logotipi bilan VIP-mijozlar va hamkorlar uchun. Shaxsiy gravyura, bepul maketi, 1-3 kunlik yetkazib berish. 1 dan 10,000+ donagacha.'
  },
  '/ru/products/neo-gift/': {
    title: 'Часы NEO в подарок с персональной гравировкой | Graver.uz',
    description: 'Часы NEO - идеальный подарок с персональной гравировкой. Запечатли важный момент на металле. Бесплатный макет, быстрая доставка по Узбекистану.'
  },
  '/uz/neo-sovga/': {
    title: 'NEO soatlar sovga sifatida shaxsiy gravyura bilan | Graver.uz',
    description: 'NEO soatlar - muhim momentni metalda fiksirlash uchun ideal sovga. Bepul maketi, Ozbekistanga tez yetkazib berish.'
  }
};

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PRERENDERED_DIR = path.join(__dirname, '..', 'prerendered');

function generateSeoMeta(locale, pathKey) {
  // Точный поиск в конфиге
  if (SEO_CONFIG[pathKey]) {
    return SEO_CONFIG[pathKey];
  }
  
  // Fallback для блога - генерируем на основе slug
  if (pathKey.includes('/blog/')) {
    return {
      title: 'Статья | Graver.uz',
      description: 'Читайте полезные статьи о корпоративных подарках и гравировке на Graver.uz'
    };
  }
  
  // Default
  return {
    title: 'Graver.uz',
    description: 'Премиальная лазерная гравировка для бизнеса в Ташкенте.'
  };
}

function injectSeoMeta(htmlFilePath, pathKey) {
  try {
    let html = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // Определяем locale из пути
    const locale = pathKey.startsWith('/uz') ? 'uz' : 'ru';
    
    // Получаем SEO конфиг
    const seo = generateSeoMeta(locale, pathKey);
    
    // Проверяем, есть ли уже title/description
    const hasTitle = /<title[^>]*>[^<]*<\/title>/.test(html);
    const hasDescription = /<meta\s+name=["']description["']/i.test(html);
    
    // Генерируем новые теги
    const newTitle = `<title>${escapeHtml(seo.title)}</title>`;
    const newDescription = `<meta name="description" content="${escapeHtml(seo.description)}" />`;
    
    // Заменяем или добавляем title
    if (hasTitle) {
      html = html.replace(/<title[^>]*>[^<]*<\/title>/, newTitle);
    } else {
      html = html.replace(/<\/head>/, `${newTitle}\n</head>`);
    }
    
    // Заменяем или добавляем description
    if (hasDescription) {
      html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, newDescription);
    } else {
      html = html.replace(/<\/head>/, `${newDescription}\n</head>`);
    }
    
    // Сохраняем обновленный HTML
    fs.writeFileSync(htmlFilePath, html, 'utf-8');
    console.log(`[inject-seo-meta] ✓ ${pathKey} — title и description инъектированы`);
    
  } catch (err) {
    console.error(`[inject-seo-meta] ✗ Ошибка при обработке ${htmlFilePath}:`, err.message);
  }
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

function processDirectory(dir, baseDir, pathPrefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);
    const urlPath = pathPrefix + '/' + relPath.replace(/\\/g, '/');
    
    if (entry.isDirectory()) {
      // Рекурсивно обрабатываем подпапки
      processDirectory(fullPath, baseDir, pathPrefix);
    } else if (entry.name === 'index.html') {
      // Нормализуем путь для поиска в конфиге
      let pathKey = urlPath.replace(/\/index\.html$/, '/').replace(/^\//, '/');
      if (!pathKey.startsWith('/')) pathKey = '/' + pathKey;
      
      injectSeoMeta(fullPath, pathKey);
    }
  }
}

// Основной процесс
console.log('[inject-seo-meta] Начинаю инъекцию SEO мета-тегов...');

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

console.log('[inject-seo-meta] ✓ Готово!');
