import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

import { cloudflare } from "@cloudflare/vite-plugin";

// Static export puro — compatível com Azure Static Web Apps
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'ads.txt'],
    manifest: {
      name: 'Easy PDF Local',
      short_name: 'Easy PDF',
      description:
        'Ferramentas de PDF 100% no navegador — privacidade total, sem upload.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'any',
      lang: 'pt-BR',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Precache de assets gerados (JS/CSS/HTML/ícones) para uso offline
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webp}'],
      // SPA: navegações caem no index.html cacheado
      navigateFallback: 'index.html',
      navigateFallbackDenylist: [/^\/api/, /^\/ads\.txt/, /^\/robots\.txt/],
      // PDF.js / libs pesadas podem exceder o limite default (2 MiB)
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === 'font',
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 12,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: ({ request }) =>
            request.destination === 'style' ||
            request.destination === 'script' ||
            request.destination === 'worker',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
    },
    devOptions: {
      // SW desligado no dev para não mascarar HMR; use build + preview para testar
      enabled: false,
    },
  }), cloudflare()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  worker: {
    format: 'es',
  },
});