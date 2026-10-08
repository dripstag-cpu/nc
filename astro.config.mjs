// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Booking flow pages are noindex and stay out of the sitemap.
const EXCLUDED = ['/beschikbaarheid/', '/reserveren/', '/bevestiging/'];

// https://astro.build/config
export default defineConfig({
  site: 'https://naescas.nl',
  output: 'static',
  // The dev toolbar sits over the mobile sticky bar and intercepts clicks during reviews and tests
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS inline in the HTML: no render-blocking stylesheet requests
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.some((path) => new URL(page).pathname === path),
    }),
  ],
});
