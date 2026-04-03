import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import postcssPresetEnv from 'postcss-preset-env';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        postcssPresetEnv({
          stage: 2,
          features: {
            'color-functional-notation': true,
            'oklab-query': true,
          },
        }),
      ],
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/client',
  },
});
