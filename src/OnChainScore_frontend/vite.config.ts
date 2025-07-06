import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4943',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      declarations: path.resolve(__dirname, '../declarations'),
    },
    dedupe: ['@dfinity/agent'],
  },
  define: {
    global: 'globalThis',
  },
  build: {
    emptyOutDir: true,
  },
});
