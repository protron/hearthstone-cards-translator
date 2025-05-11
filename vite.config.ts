import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { CardsLastUpdateIO } from './cards-last-update-io.js';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [
    react()
  ],
  root: path.resolve(__dirname, 'clientside'),
  //base: command === 'build' ? './' : '/',
  publicDir: path.resolve(__dirname, 'clientside/public'),
  build: {
    outDir: './public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'clientside', 'index.html')
      }
    }
  },
  define: {
    BUILD_TIMESTAMP: new Date(),
    CARDS_LAST_UPDATE: CardsLastUpdateIO.read(),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'output'),
      '@src': path.resolve(__dirname, 'clientside'),
    },
  },
  server: {
    open: 'index.html'
  }
}));
