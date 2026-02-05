/**
 * Blog posts data (static, can be replaced with CMS later)
 * Each post has RU and UZ versions linked by slug
 */

export const blogPosts = {
  ru: [
    {
      slug: 'test-article',
      title: 'Тестовая статья (черновик)',
      description: 'Техническая тестовая статья для проверки работы блога.',
      date: '2025-01-15',
      keywords: ['тест', 'блог', 'graver'],
      content: `# Тестовая статья

Это техническая тестовая статья для проверки функциональности блога.

## Раздел 1

Пример текстового контента для проверки рендеринга markdown.

## Раздел 2

- Пункт списка 1
- Пункт списка 2
- Пункт списка 3

**Жирный текст** и *курсив* для проверки форматирования.`
    }
  ],
  uz: [
    {
      slug: 'test-maqola',
      title: 'Test maqola (qoralama)',
      description: 'Blog ishini tekshirish uchun texnik test maqolasi.',
      date: '2025-01-15',
      keywords: ['test', 'blog', 'graver'],
      content: `# Test maqola

Bu blog funksionalligini tekshirish uchun texnik test maqolasi.

## Bo'lim 1

Markdown renderlashni tekshirish uchun matn tarkibi namunasi.

## Bo'lim 2

- Ro'yxat elementi 1
- Ro'yxat elementi 2
- Ro'yxat elementi 3

**Qalin matn** va *kursiv* formatlashni tekshirish uchun.`
    }
  ]
};

/**
 * Get all posts for a locale, sorted by date (newest first)
 */
export function getPostsByLocale(locale) {
  const posts = blogPosts[locale] || blogPosts.ru;
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by slug and locale
 */
export function getPostBySlug(locale, slug) {
  const posts = blogPosts[locale] || blogPosts.ru;
  return posts.find(p => p.slug === slug) || null;
}

/**
 * Check if a post has a counterpart in another locale
 * For now, we use a simple mapping (can be extended with frontmatter later)
 */
const slugMapping = {
  'test-article': 'test-maqola',
  'test-maqola': 'test-article'
};

export function getAlternateSlug(slug) {
  return slugMapping[slug] || null;
}

/**
 * Get all slugs for sitemap generation
 */
export function getAllSlugs() {
  const ruSlugs = blogPosts.ru.map(p => ({ locale: 'ru', slug: p.slug }));
  const uzSlugs = blogPosts.uz.map(p => ({ locale: 'uz', slug: p.slug }));
  return [...ruSlugs, ...uzSlugs];
}
