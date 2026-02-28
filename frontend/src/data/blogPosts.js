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
      content: 'Оригинальные подарки на 8 марта — это не стандартные букеты. Вот 10 идей.'
    },
    {
      slug: 'korporativnye-podarki-na-8-marta-v-tashkente',
      title: 'Корпоративные подарки на 8 марта в Ташкенте: заказ, доставка, гравировка',
      description: 'Корпоративные подарки на 8 марта в Ташкенте. Заказ от 1 шт., гравировка, доставка.',
      date: '2026-03-03',
      category: 'Гайды',
      keywords: ['корпоративные подарки на 8 марта Ташкент', 'заказ подарков 8 марта'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'chto-podarit-kollege-na-8-marta'],
      content: 'Корпоративные подарки на 8 марта в Ташкенте — полный спектр услуг.'
    },
    {
      slug: 'chto-podarit-mame-na-8-marta',
      title: 'Что подарить маме на 8 марта: 20 идей подарков с гравировкой',
      description: 'Идеи подарков для мамы на 8 марта. От практичных до романтичных.',
      date: '2026-03-04',
      category: 'Идеи',
      keywords: ['подарок маме на 8 марта', 'что подарить маме', 'идеи подарков для мамы'],
      relatedPosts: ['originalnye-podarki-na-8-marta', 'chto-podarit-devushke-na-8-marta'],
      content: 'Что подарить маме на 8 марта — самый важный вопрос.'
    },
    {
      slug: 'chto-podarit-kollege-na-8-marta',
      title: 'Что подарить коллеге на 8 марта: 15 идей корпоративных подарков',
      description: 'Идеи подарков для коллеги на 8 марта. Корпоративные подарки с гравировкой.',
      date: '2026-03-05',
      category: 'Гайды',
      keywords: ['подарок коллеге на 8 марта', 'что подарить коллеге', 'корпоративные подарки'],
      relatedPosts: ['korporativnye-podarki-na-8-marta-v-tashkente', 'chto-podarit-rukovoditelyu-na-8-marta'],
      content: 'Что подарить коллеге на 8 марта — вопрос корпоративного этикета.'
    },
    {
      slug: 'chto-podarit-rukovoditelyu-na-8-marta',
      title: 'Что подарить руководителю на 8 марта: 10 идей премиальных подарков',
      description: 'Идеи подарков для руководителя на 8 марта. Премиальные подарки с гравировкой.',
      date: '2026-03-06',
      category: 'Гайды',
      keywords: ['подарок руководителю на 8 марта', 'подарок начальнице', 'премиальные подарки'],
      relatedPosts: ['chto-podarit-kollege-na-8-marta', 'korporativnye-podarki-na-8-marta-v-tashkente'],
      content: 'Что подарить руководителю на 8 марта — премиальный и уместный подарок.'
    },
    {
      slug: 'chto-podarit-devushke-na-8-marta',
      title: 'Что подарить девушке на 8 марта: 25 романтичных идей подарков',
      description: 'Идеи подарков для девушки на 8 марта. От романтичных до практичных.',
      date: '2026-03-07',
      category: 'Идеи',
      keywords: ['подарок девушке на 8 марта', 'что подарить девушке', 'романтичные подарки'],
      relatedPosts: ['chto-podarit-mame-na-8-marta', 'originalnye-podarki-na-8-marta'],
      content: 'Что подарить девушке на 8 марта — романтичный и запоминающийся подарок.'
    },
    {
      slug: 'chto-podarit-na-8-marta-devushke-mame-kollege',
      title: 'Что подарить на 8 марта: полный гид по выбору подарков для всех',
      description: 'Полный гид по выбору подарков на 8 марта для девушки, мамы, коллеги, руководителя.',
      date: '2026-03-08',
      category: 'Гайды',
      keywords: ['что подарить на 8 марта', 'идеи подарков 8 марта', 'подарки для всех'],
      relatedPosts: ['chto-podarit-devushke-na-8-marta', 'chto-podarit-mame-na-8-marta', 'chto-podarit-kollege-na-8-marta'],
      content: 'Что подарить на 8 марта — полный гид для всех случаев.'
    },
    {
      slug: 'nedorogie-podarki-na-8-marta',
      title: 'Недорогие подарки на 8 марта: 20 идей от 50 000 сум',
      description: 'Недорогие подарки на 8 марта от 50 000 сум. Практичные и красивые подарки.',
      date: '2026-03-09',
      category: 'Гайды',
      keywords: ['недорогие подарки на 8 марта', 'подарки до 100 000 сум', 'бюджетные подарки'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'originalnye-podarki-na-8-marta'],
      content: 'Недорогие подарки на 8 марта — не нужно тратить много денег.'
    },
    {
      slug: 'gravirovka-v-tashkente-na-8-marta',
      title: 'Гравировка в Ташкенте на 8 марта: услуги, цены, сроки | Graver Studio',
      description: 'Услуги гравировки в Ташкенте на 8 марта. Лазерная гравировка на подарках.',
      date: '2026-03-10',
      category: 'Услуги',
      keywords: ['гравировка в Ташкенте', 'лазерная гравировка', 'гравировка подарков', 'гравировка на 8 марта'],
      relatedPosts: ['podarki-na-8-marta-sotrudnicam', 'korporativnye-podarki-na-8-marta-v-tashkente'],
      content: 'Гравировка в Ташкенте на 8 марта — профессиональные услуги лазерной гравировки.'
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
    const localeResult = { locale, total: posts.length, valid: 0, invalid: 0 };
    posts.forEach((post) => {
      const hasRequiredFields = post.slug && post.title && post.description && post.date && post.category;
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
