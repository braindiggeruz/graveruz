import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.graver-studio.uz/blog',
  base: '/blog',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  server: {
    port: 4000,
    host: '0.0.0.0'
  }
});
