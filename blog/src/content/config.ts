import { z, defineCollection } from 'astro:content';

const postsSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  coverImage: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
});

const ruPosts = defineCollection({
  type: 'content',
  schema: postsSchema
});

const uzPosts = defineCollection({
  type: 'content',
  schema: postsSchema
});

export const collections = {
  'ru/posts': ruPosts,
  'uz/posts': uzPosts
};
