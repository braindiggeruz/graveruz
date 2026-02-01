import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('ru/posts');
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  );
  
  return rss({
    title: 'Блог Graver.uz — Корпоративные подарки с гравировкой',
    description: 'Статьи о корпоративных подарках, брендировании и лазерной гравировке для B2B в Ташкенте',
    site: context.site,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: new Date(post.data.publishedAt),
      link: `/ru/${post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author
    })),
    customData: `<language>ru-RU</language>`,
  });
}
