import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/lifeg/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      minify: false,
      includeAssets: ['icons/*.svg'],
      manifest: {
        name: 'Homebase - Life Gamification',
        short_name: 'Homebase',
        description: 'Life gamification & task management',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#FFFFFF',
        background_color: '#FFFFFF',
        start_url: '/lifeg/',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icons/icon-192-maskable.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'maskable' },
          { src: 'icons/icon-512-maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 30 }
            }
          }
        ]
      }
    })
  ],
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    target: 'es2020',
    outDir: 'dist'
  }
});
