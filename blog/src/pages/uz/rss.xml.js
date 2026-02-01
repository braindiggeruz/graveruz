import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('uz/posts');
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  );
  
  return rss({
    title: "Graver.uz Blogi — Gravirovkali korporativ sovg'alar",
    description: "Toshkentda B2B uchun korporativ sovg'alar, brendlash va lazer gravirovkasi haqida maqolalar",
    site: context.site,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: new Date(post.data.publishedAt),
      link: `/uz/${post.slug}/`,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author
    })),
    customData: `<language>uz-UZ</language>`,
  });
}
