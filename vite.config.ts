import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { CardsLastUpdateIO } from './cards-last-update-io.js';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [
    react()
  ],
  root: path.resolve(__dirname, 'clientside'),
  base: command === 'build' ? './outdir' : '/',
  publicDir: path.resolve(__dirname, 'clientside/public'),
  build: {
    outDir: '/clientside/output',
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
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindcss('../tailwind.config.js'),
        autoprefixer,
      ],
    },
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
