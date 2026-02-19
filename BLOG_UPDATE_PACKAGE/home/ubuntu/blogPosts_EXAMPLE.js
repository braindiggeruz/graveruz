// ПРИМЕР обновленного blogPosts.js с картинками и временем чтения
// Кодер должен добавить эти поля ко ВСЕМ 50 статьям

export const blogPosts = {
  ru: [
    {
      slug: "corporate-gift-article",
      title: "Как выбрать корпоративный подарок: Подробное руководство",
      description: "Узнайте, как выбрать идеальный корпоративный подарок для сотрудников и партнеров. Практические советы и рекомендации от экспертов Graver.uz.",
      date: "2025-01-15",
      category: "Блог",
      image: "/images/blog/corporate-gift-article.png",  // ← ДОБАВИТЬ
      readTime: 8  // ← ДОБАВИТЬ (в минутах)
    },
    {
      slug: "laser-engraving-gifts-draft",
      title: "Лазерная гравировка подарков: Искусство Персонализации и Уникальные Идеи",
      description: "Откройте для себя мир лазерной гравировки: от технологии до креативных идей персонализации подарков.",
      date: "2025-01-14",
      category: "Блог",
      image: "/images/blog/laser-engraving-gifts-draft.png",  // ← ДОБАВИТЬ
      readTime: 10  // ← ДОБАВИТЬ
    },
    {
      slug: "article-2",
      title: "Подарочные наборы с логотипом: Искусство дарить и продвигать бренд",
      description: "Как создать эффективные подарочные наборы с логотипом компании для укрепления бренда.",
      date: "2025-01-13",
      category: "Блог",
      image: "/images/blog/article-2.png",  // ← ДОБАВИТЬ
      readTime: 7  // ← ДОБАВИТЬ
    },
    {
      slug: "souvenir-branding-ru",
      title: "Брендирование Сувениров: Мощный Инструмент Для Развития Вашего Бизнеса",
      description: "Полное руководство по брендированию сувениров: от выбора до реализации.",
      date: "2025-01-12",
      category: "Блог",
      image: "/images/blog/souvenir-branding-ru.png",  // ← ДОБАВИТЬ
      readTime: 9  // ← ДОБАВИТЬ
    },
    {
      slug: "article-4",
      title: "Welcome Pack для новых сотрудников: ключ к успешной адаптации и лояльности",
      description: "Создайте идеальный welcome pack для новых сотрудников и повысьте их лояльность с первого дня.",
      date: "2025-01-11",
      category: "Блог",
      image: "/images/blog/article-4.png",  // ← ДОБАВИТЬ
      readTime: 6  // ← ДОБАВИТЬ
    }
    // ... остальные 21 РУ статья с такими же полями
  ],
  
  uz: [
    {
      slug: "korporativ-sovg-ani-qanday-tanlash-kerak",
      title: "Korporativ Sovg'ani Qanday Tanlash Kerak: Biznes Munosabatlarini Mustahkamlash San'ati",
      description: "Xodimlar va hamkorlar uchun ideal korporativ sovg'ani qanday tanlash kerak. Graver.uz ekspertlaridan amaliy maslahatlar.",
      date: "2025-01-15",
      category: "Blog",
      image: "/images/blog/korporativ-sovg-ani-qanday-tanlash-kerak.png",  // ← ДОБАВИТЬ
      readTime: 8  // ← ДОБАВИТЬ
    },
    {
      slug: "article-27",
      title: "Sovg'alarga lazer o'ymakorligi: Unutilmas Taassurotlar Uchun Noyob Yechim",
      description: "Lazer o'ymakorligi dunyosini kashf eting: texnologiyadan tortib sovg'alarni shaxsiylashtirish g'oyalarigacha.",
      date: "2025-01-14",
      category: "Blog",
      image: "/images/blog/article-27.png",  // ← ДОБАВИТЬ
      readTime: 10  // ← ДОБАВИТЬ
    }
    // ... остальные 22 УЗ статьи с такими же полями
  ]
};

// Функции getPostsByLocale и getPostBySlug остаются без изменений
export function getPostsByLocale(locale) {
  return blogPosts[locale] || [];
}

export function getPostBySlug(slug, locale) {
  const posts = getPostsByLocale(locale);
  return posts.find(post => post.slug === slug);
}
