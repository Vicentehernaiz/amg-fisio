import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amgfisio.es',
  output: 'static',
  compressHTML: true,
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/full-gas'),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
  image: {
    domains: [],
  },
});
