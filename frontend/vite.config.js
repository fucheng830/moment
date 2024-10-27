import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';



export default defineConfig(({ command }) => {
  return {
    plugins: [
      react()
    ],
    build: {
      outDir: 'out'
    },
    css: {
      charset: false
    },
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    }
  }
});