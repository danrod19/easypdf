/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// Static export puro — compatível com Azure Static Web Apps
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
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
            // Inter self-host em /fonts/inter/*.woff2
            urlPattern: ({ request, url }) =>
              request.destination === 'font' ||
              url.pathname.startsWith('/fonts/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-fonts',
              expiration: {
                maxEntries: 20,
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
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Libs pesadas (tesseract / mammoth / html2pdf) entram só via import()
    // dinâmico em extractText.ts e wordToPdf.ts — sem manualChunks forçado
    // (com Rolldown, manualChunks misturava deps e puxava vendor na rota cedo).
  },
  worker: {
    format: 'es',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // GA / analytics não devem vazar em unit tests
    clearMocks: true,
  },
});
