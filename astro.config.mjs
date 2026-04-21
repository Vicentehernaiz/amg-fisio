import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amgfisio.es',
  output: 'static',
  compressHTML: true,
  adapter: node({
    mode: 'standalone',
  }),
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
