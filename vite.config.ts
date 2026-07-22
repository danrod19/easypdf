import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Static export puro — compatível com Azure Static Web Apps
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Assets grandes (tesseract WASM) — chunking adequado
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdf-lib'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
});
