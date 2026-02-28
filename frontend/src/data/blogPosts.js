/**
 * Blog posts data - SEO-optimized content for Graver.uz
 * Structure: RU and UZ versions with cross-linking
 */
import { getMappedAlternateSlug } from '../config/blogSlugMap.js';

export const blogPosts = {
  ru: [
    {
      slug: 'podarki-na-8-marta-sotrudnicam',
      title: 'Подарки на 8 марта сотрудницам: 15 идей с гравировкой | Graver Studio',
      description: 'Лучшие подарки на 8 марта для сотрудниц компании. Персонализированные подарки с гравировкой: от зажигалок до ежедневников. Заказ от 1 шт., доставка по Ташкенту.',
      date: '2026-03-01',
      category: 'Идеи',
      keywords: ['подарки на 8 марта сотрудницам', 'корпоративные подарки на 8 марта', 'подарки с гравировкой 8 марта'],
      relatedPosts: ['originalnye-podarki-na-8-marta', 'korporativnye-podarki-na-8-marta-v-tashkente'],
      content: 'Подарки на 8 марта сотрудницам — это способ показать благодарность. Лучшие идеи с гравировкой.'
    },
    {
      slug: 'originalnye-podarki-na-8-marta',
      title: 'Оригинальные подарки на 8 марта: 10 идей, которые точно понравятся',
      description: 'Оригинальные и необычные подарки на 8 марта. Идеи для подарков, которые выделяются и запоминаются.',
      date: '2026-03-02',
      category: 'Идеи',
      keywords: ['оригинальные подарки на 8 марта', 'необычные подарки', 'креативные подарки'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'chto-podarit-mame-na-8-marta'],
      contentHtml: `<h2 id="why-original-gifts">Почему оригинальные подарки?</h2>
<p>Стандартные подарки забываются. Оригинальные подарки остаются в памяти навсегда.</p>

<h2 id="gift-ideas">10 оригинальных идей подарков на 8 марта</h2>
<ul><li>Часы NEO Premium с гравировкой имени</li><li>Зажигалка Zippo с логотипом компании</li><li>Ежедневник с персональной гравировкой</li><li>Powerbank с логотипом</li><li>Ручка с гравировкой</li><li>Украшение с инициалами</li><li>Фото-кубик с памятными моментами</li><li>Кружка с цитатой</li><li>Свеча с персональным дизайном</li><li>Коробка с конфетами и гравировкой</li></ul>

<h2 id="personalization">Персонализация — ключ к успеху</h2>
<p>Добавьте имя, дату или специальное сообщение — это сделает подарок по-настоящему особенным.</p>

<h2 id="budget">На любой бюджет</h2>
<ul><li>До 50 000 сум: ручки, кружки, свечи</li><li>50-150 000 сум: зажигалки, powerbank</li><li>150-500 000 сум: часы, украшения</li></ul>

<p>Заказывайте оригинальные подарки в нашем Telegram-боте!</p>`
    },
    {
      slug: 'korporativnye-podarki-na-8-marta-v-tashkente',
      title: 'Корпоративные подарки на 8 марта в Ташкенте: заказ, доставка, гравировка',
      description: 'Корпоративные подарки на 8 марта в Ташкенте. Заказ от 1 шт., гравировка, доставка.',
      date: '2026-03-03',
      category: 'Гайды',
      keywords: ['корпоративные подарки на 8 марта Ташкент', 'заказ подарков 8 марта'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'chto-podarit-kollege-na-8-marta'],
      contentHtml: `<h2 id="corporate-gifts-importance">Значение корпоративных подарков</h2>
<p>Корпоративные подарки на 8 марта показывают уважение к сотрудницам и укрепляют командный дух.</p>

<h2 id="gift-selection">Как выбрать подарок?</h2>
<ul><li>Учитывайте интересы сотрудницы</li><li>Выбирайте качественные товары</li><li>Добавляйте персонализацию (гравировку)</li><li>Упакуйте красиво</li></ul>

<h2 id="popular-corporate-gifts">Популярные корпоративные подарки</h2>
<ul><li>Часы с логотипом компании</li><li>Ручки премиум-класса</li><li>Powerbank с брендированием</li><li>Ежедневники</li><li>Украшения</li></ul>

<h2 id="tashkent-services">Услуги в Ташкенте</h2>
<p>Мы предлагаем:</p>
<ul><li>Быструю доставку по Ташкенту</li><li>Профессиональную упаковку</li><li>Гравировку логотипа компании</li><li>Консультацию по выбору подарков</li></ul>

<h2 id="order-now">Заказать сейчас</h2>
<p>Свяжитесь с нами в Telegram для обсуждения вариантов подарков для вашей команды.</p>`
    },
    {
      slug: 'chto-podarit-mame-na-8-marta',
      title: 'Что подарить маме на 8 марта: 20 идей подарков с гравировкой',
      description: 'Идеи подарков для мамы на 8 марта. От практичных до романтичных.',
      date: '2026-03-04',
      category: 'Идеи',
      keywords: ['подарок маме на 8 марта', 'что подарить маме', 'идеи подарков для мамы'],
      relatedPosts: ['originalnye-podarki-na-8-marta', 'chto-podarit-devushke-na-8-marta'],
      contentHtml: `<h2 id="gift-for-mom">Подарок для мамы на 8 марта</h2>
<p>Мама заслуживает самого лучшего подарка. Вот идеи, которые точно понравятся.</p>

<h2 id="sentimental-gifts">Сентиментальные подарки</h2>
<ul><li>Фото-кубик с семейными фотографиями</li><li>Браслет с гравировкой "Люблю тебя"</li><li>Ежедневник с записями благодарности</li><li>Кружка с фотографией</li></ul>

<h2 id="practical-gifts">Практичные подарки</h2>
<ul><li>Часы премиум-класса</li><li>Качественная ручка</li><li>Powerbank</li><li>Красивый блокнот</li></ul>

<h2 id="luxury-gifts">Люксовые подарки</h2>
<ul><li>Украшение с драгоценными камнями</li><li>Часы NEO Premium</li><li>Кошелёк из натуральной кожи</li><li>Парфюм премиум-класса</li></ul>

<h2 id="personalization-for-mom">Персонализация</h2>
<p>Добавьте гравировку с именем мамы или специальным сообщением — это сделает подарок бесценным.</p>

<p>Закажите подарок для мамы в нашем Telegram-боте уже сегодня!</p>`
    },
    {
      slug: 'chto-podarit-kollege-na-8-marta',
      title: 'Что подарить коллеге на 8 марта: 15 идей корпоративных подарков',
      description: 'Идеи подарков для коллеги на 8 марта. Корпоративные подарки с гравировкой.',
      date: '2026-03-05',
      category: 'Гайды',
      keywords: ['подарок коллеге на 8 марта', 'что подарить коллеге', 'корпоративные подарки'],
      relatedPosts: ['korporativnye-podarki-na-8-marta-v-tashkente', 'chto-podarit-rukovoditelyu-na-8-marta'],
      contentHtml: `<h2 id="colleague-gift">Подарок для коллеги на 8 марта</h2>
<p>Коллеги — это люди, с которыми мы проводим большую часть времени. Подарок должен быть уважительным и профессиональным.</p>

<h2 id="professional-gifts">Профессиональные подарки</h2>
<ul><li>Ручка премиум-класса с гравировкой</li><li>Ежедневник</li><li>Блокнот с логотипом компании</li><li>Кружка для кофе</li></ul>

<h2 id="personal-gifts">Личные подарки</h2>
<ul><li>Часы</li><li>Украшение</li><li>Powerbank</li><li>Зажигалка Zippo</li></ul>

<h2 id="budget-options">Варианты по бюджету</h2>
<ul><li>До 30 000 сум: ручка, кружка, блокнот</li><li>30-100 000 сум: часы, украшение</li><li>100+ сум: премиум подарки</li></ul>

<h2 id="presentation">Оформление подарка</h2>
<p>Красивая упаковка и гравировка сделают подарок более ценным.</p>

<p>Выберите подарок для коллеги в нашем каталоге!</p>`
    },
    {
      slug: 'chto-podarit-rukovoditelyu-na-8-marta',
      title: 'Что подарить руководителю на 8 марта: 10 идей премиальных подарков',
      description: 'Идеи подарков для руководителя на 8 марта. Премиальные подарки с гравировкой.',
      date: '2026-03-06',
      category: 'Гайды',
      keywords: ['подарок руководителю на 8 марта', 'подарок начальнице', 'премиальные подарки'],
      relatedPosts: ['chto-podarit-kollege-na-8-marta', 'korporativnye-podarki-na-8-marta-v-tashkente'],
      contentHtml: `<h2 id="boss-gift">Подарок для руководителя на 8 марта</h2>
<p>Подарок для начальницы должен быть элегантным, дорогим и уважительным.</p>

<h2 id="luxury-options">Люксовые варианты</h2>
<ul><li>Часы NEO Premium с гравировкой</li><li>Украшение из золота или серебра</li><li>Кошелёк из натуральной кожи</li><li>Ручка премиум-класса</li></ul>

<h2 id="professional-luxury">Профессиональный люкс</h2>
<ul><li>Ежедневник из кожи</li><li>Набор ручек премиум-класса</li><li>Органайзер для рабочего стола</li><li>Картина или предмет искусства</li></ul>

<h2 id="personalization-boss">Персонализация</h2>
<p>Гравировка инициалов или логотипа компании добавит подарку статуса и профессионализма.</p>

<h2 id="presentation-boss">Оформление</h2>
<p>Красивая упаковка и презентация — это половина подарка.</p>

<p>Закажите премиум подарок для руководителя в Telegram!</p>`
    },
    {
      slug: 'chto-podarit-devushke-na-8-marta',
      title: 'Что подарить девушке на 8 марта: 25 романтичных идей подарков',
      description: 'Идеи подарков для девушки на 8 марта. От романтичных до практичных.',
      date: '2026-03-07',
      category: 'Идеи',
      keywords: ['подарок девушке на 8 марта', 'что подарить девушке', 'романтичные подарки'],
      relatedPosts: ['chto-podarit-mame-na-8-marta', 'originalnye-podarki-na-8-marta'],
      contentHtml: `<h2 id="girlfriend-gift">Подарок для девушки на 8 марта</h2>
<p>Подарок для любимой должен быть романтичным, красивым и полным любви.</p>

<h2 id="romantic-gifts">Романтичные подарки</h2>
<ul><li>Украшение с гравировкой "Люблю тебя"</li><li>Часы с персональной гравировкой</li><li>Фото-кубик с совместными фотографиями</li><li>Кружка с признанием в любви</li></ul>

<h2 id="luxury-romantic">Люксовые романтичные подарки</h2>
<ul><li>Кольцо или браслет из золота</li><li>Часы премиум-класса</li><li>Украшение с бриллиантом</li><li>Парфюм люкс-класса</li></ul>

<h2 id="practical-romantic">Практичные, но романтичные</li>
<ul><li>Powerbank с гравировкой</li><li>Ежедневник для совместных планов</li><li>Рюкзак или сумка премиум-класса</li></ul>

<h2 id="presentation-girlfriend">Презентация подарка</h2>
<p>Красивая упаковка, свечи, цветы — создайте атмосферу романтики.</p>

<p>Выберите идеальный подарок для своей девушки!</p>`
    },
    {
      slug: 'chto-podarit-na-8-marta-devushke-mame-kollege',
      title: 'Что подарить на 8 марта: полный гид по выбору подарков для всех',
      description: 'Полный гид по выбору подарков на 8 марта для девушки, мамы, коллеги, руководителя.',
      date: '2026-03-08',
      category: 'Гайды',
      keywords: ['что подарить на 8 марта', 'идеи подарков 8 марта', 'подарки для всех'],
      relatedPosts: ['chto-podarit-devushke-na-8-marta', 'chto-podarit-mame-na-8-marta', 'chto-podarit-kollege-na-8-marta'],
      contentHtml: `<h2 id="universal-guide">Универсальный гид по подаркам на 8 марта</h2>
<p>Не знаете, что подарить? Этот гид поможет выбрать идеальный подарок для любой женщины.</p>

<h2 id="by-relationship">По типу отношений</h2>
<h3>Для мамы:</h3>
<ul><li>Сентиментальные подарки с гравировкой</li><li>Качественные практичные вещи</li><li>Люксовые украшения</li></ul>

<h3>Для коллеги:</h3>
<ul><li>Профессиональные подарки</li><li>Нейтральные по стилю вещи</li><li>Подарки с логотипом компании</li></ul>

<h3>Для девушки:</h3>
<ul><li>Романтичные подарки</li><li>Украшения</li><li>Люксовые вещи</li></ul>

<h2 id="by-budget">По бюджету</h2>
<ul><li>До 50 000 сум: ручки, кружки, блокноты</li><li>50-150 000 сум: часы, украшения, powerbank</li><li>150-500 000 сум: люксовые часы, украшения</li></ul>

<h2 id="personalization-universal">Персонализация — главное</h2>
<p>Гравировка имени, даты или специального сообщения сделает любой подарок особенным.</p>

<p>Закажите идеальный подарок прямо сейчас!</p>`
    },
    {
      slug: 'nedorogie-podarki-na-8-marta',
      title: 'Недорогие подарки на 8 марта: 20 идей от 50 000 сум',
      description: 'Недорогие подарки на 8 марта от 50 000 сум. Практичные и красивые подарки.',
      date: '2026-03-09',
      category: 'Гайды',
      keywords: ['недорогие подарки на 8 марта', 'подарки до 100 000 сум', 'бюджетные подарки'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'originalnye-podarki-na-8-marta'],
      contentHtml: `<h2 id="budget-gifts">Недорогие подарки на 8 марта</h2>
<p>Подарок не должен быть дорогим, чтобы быть ценным. Вот идеи недорогих, но красивых подарков.</p>

<h2 id="budget-options-detailed">Подарки до 50 000 сум</h2>
<ul><li>Ручка премиум-класса с гравировкой: 15-30 тыс</li><li>Кружка с фотографией: 20-40 тыс</li><li>Блокнот красивый: 10-25 тыс</li><li>Свеча ароматическая: 15-35 тыс</li><li>Закладка для книги: 5-15 тыс</li></ul>

<h2 id="budget-50-100">Подарки 50-100 тыс сум</h2>
<ul><li>Powerbank 10000 mAh: 60-90 тыс</li><li>Часы простые: 70-100 тыс</li><li>Украшение простое: 50-100 тыс</li><li>Ежедневник кожаный: 60-100 тыс</li></ul>

<h2 id="where-to-buy">Где купить?</h2>
<p>Мы предлагаем все эти подарки с возможностью гравировки:</p>
<ul><li>Быстрая доставка по Ташкенту</li><li>Красивая упаковка</li><li>Гравировка имени или текста</li></ul>

<p>Выберите недорогой, но красивый подарок в нашем каталоге!</p>`
    },
    {
      slug: 'gravirovka-v-tashkente-na-8-marta',
      title: 'Гравировка в Ташкенте на 8 марта: услуги, цены, сроки | Graver Studio',
      description: 'Услуги гравировки в Ташкенте на 8 марта. Лазерная гравировка на подарках.',
      date: '2026-03-10',
      category: 'Услуги',
      keywords: ['гравировка в Ташкенте', 'лазерная гравировка', 'гравировка подарков', 'гравировка на 8 марта'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'korporativnye-podarki-na-8-marta-v-tashkente'],
      contentHtml: `<h2 id="what-is-engraving">Что такое гравировка?</h2>
<p>Гравировка — это способ нанесения изображения, текста или узора на поверхность предмета с помощью лазера. Это создаёт уникальный, долговечный подарок.</p>

<h2 id="why-engraving-for-march8">Почему гравировка идеальна для 8 марта?</h2>
<ul><li>Персональный подарок — показывает внимание и заботу</li><li>Долговечность — подарок останется на память навсегда</li><li>Уникальность — не найти в магазинах</li><li>Профессионализм — подходит для коллег и начальниц</li></ul>

<h2 id="engraving-services">Наши услуги гравировки</h2>
<p>Мы предлагаем лазерную гравировку на:</p>
<ul><li>Часах и украшениях</li><li>Ручках и карандашах</li><li>Зажигалках Zippo</li><li>Powerbank и гаджетах</li><li>Ежедневниках и блокнотах</li></ul>

<h2 id="prices">Цены на гравировку</h2>
<p>Стоимость зависит от материала и сложности дизайна:</p>
<ul><li>Простая гравировка (текст): от 15 000 сум</li><li>Логотип компании: от 25 000 сум</li><li>Сложный дизайн: от 50 000 сум</li></ul>

<h2 id="how-to-order">Как заказать?</h2>
<ol><li>Выберите предмет для гравировки</li><li>Отправьте дизайн или описание в Telegram</li><li>Получите бесплатный макет для проверки</li><li>Подтвердите заказ</li><li>Получите готовый подарок</li></ol>

<p><strong>Свяжитесь с нами в Telegram для бесплатной консультации!</strong></p>`
    }
  ],
  uz: [
    {
      slug: '8-mart-xodimlarga-sovgalar',
      title: '8-Mart xodimlarga sovgalar: 15 ta g\'oyalar gravirovka bilan | Graver Studio',
      description: 'Xodimlarga 8-Mart uchun eng yaxshi sovgalar. Shaxsiy gravirovka bilan sovgalar.',
      date: '2026-03-01',
      category: 'G\'oyalar',
      keywords: ['8-Mart xodimlarga sovgalar', 'korporativ sovgalar 8-Mart', 'gravirovka bilan sovgalar'],
      relatedPosts: ['noyob-8-mart-sovgalari', 'korporativ-sovgalar-8-mart-toshkent'],
      content: '8-Mart xodimlarga sovgalar — xodimlaringizga minnatdorlikni ko\'rsatish imkoniyati.'
    },
    {
      slug: 'noyob-8-mart-sovgalari',
      title: 'Noyob 8-Mart sovgalari: 10 ta g\'oyalar, ular albatta yoqadi',
      description: 'Noyob va g\'ayrioddiy 8-Mart sovgalari. Seziladi va esda qoladigan sovgalar.',
      date: '2026-03-02',
      category: 'G\'oyalar',
      keywords: ['noyob 8-Mart sovgalari', 'g\'ayrioddiy sovgalar', 'ijodiy sovgalar'],
      relatedPosts: ['8-mart-xodimlarga-sovgalar', 'xotinlarga-nima-berish-kerak-8-mart'],
      content: 'Noyob 8-Mart sovgalari — standart gullardan boshqa narsalar.'
    }
  ]
};

export function getPostsByLocale(locale) {
  const posts = blogPosts[locale] || blogPosts.ru;
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(locale, slug) {
  const posts = blogPosts[locale] || blogPosts.ru;
  return posts.find(p => p.slug === slug);
}

export function getCategorySummary(locale, limit = 4) {
  const posts = getPostsByLocale(locale);
  const categories = {};
  posts.forEach(post => {
    if (!categories[post.category]) categories[post.category] = [];
    categories[post.category].push(post);
  });
  return Object.entries(categories).map(([category, categoryPosts]) => ({
    category,
    posts: categoryPosts.slice(0, limit),
    count: categoryPosts.length,
  }));
}

export function getPostReadTimeMinutes(post) {
  if (!post || !post.content) return 5;
  const wordCount = post.content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getRelatedPostsWeighted(locale, currentSlug, limit = 3, overrideSlugs = []) {
  const posts = getPostsByLocale(locale);
  const currentPost = posts.find(p => p.slug === currentSlug);
  if (!currentPost) return [];
  if (overrideSlugs.length > 0) {
    return overrideSlugs.map(slug => posts.find(p => p.slug === slug)).filter(Boolean).slice(0, limit);
  }
  if (currentPost.relatedPosts && Array.isArray(currentPost.relatedPosts)) {
    return currentPost.relatedPosts.map(slug => posts.find(p => p.slug === slug)).filter(Boolean).slice(0, limit);
  }
  return posts.filter(p => p.slug !== currentSlug && p.category === currentPost.category).slice(0, limit);
}

export function getAllSlugs() {
  const ruSlugs = blogPosts.ru.map(p => ({ locale: 'ru', slug: p.slug }));
  const uzSlugs = blogPosts.uz.map(p => ({ locale: 'uz', slug: p.slug }));
  return [...ruSlugs, ...uzSlugs];
}

export function validateAllBlogData() {
  const results = [];
  Object.entries(blogPosts).forEach(([locale, posts]) => {
    const localeResult = { locale, total: posts.length, valid: 0, invalid: 0, duplicateSlugs: [], missingRelatedRefs: [] };
    const slugs = new Set();
    posts.forEach((post) => {
      const hasRequiredFields = post.slug && post.title && post.description && post.date && post.category;
      if (post.slug && slugs.has(post.slug)) {
        localeResult.duplicateSlugs.push(post.slug);
      }
      if (post.slug) slugs.add(post.slug);
      if (post.relatedPosts && Array.isArray(post.relatedPosts)) {
        const missingRefs = post.relatedPosts.filter((ref) => !posts.some((p) => p.slug === ref));
        if (missingRefs.length > 0) {
          localeResult.missingRelatedRefs.push({ slug: post.slug, refs: missingRefs });
        }
      }
      if (hasRequiredFields) {
        localeResult.valid++;
      } else {
        localeResult.invalid++;
      }
    });
    results.push(localeResult);
  });
  return { results, isValid: results.every(r => r.invalid === 0) };
}

export function validateBlogData() {
  return validateAllBlogData();
}
