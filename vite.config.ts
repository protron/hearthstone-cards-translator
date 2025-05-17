import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { CardsLastUpdateIO } from './cards-last-update-io.js';

export default defineConfig(async () => {
  process.env.VITE_CARDS_LAST_UPDATE = await CardsLastUpdateIO.read();
  process.env.VITE_BUILD_TIMESTAMP = new Date().toISOString().split('T')[0];
  return {
    plugins: [
      react()
    ],
    base: '/hearthstone-cards-translator/',
    root: path.resolve(__dirname, 'clientside'),
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'output'),
        '@src': path.resolve(__dirname, 'clientside'),
      },
    },
    server: {
      open: 'index.html'
    }
  };
});
