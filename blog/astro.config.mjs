import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gifting-hub-16.preview.emergentagent.com',
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
