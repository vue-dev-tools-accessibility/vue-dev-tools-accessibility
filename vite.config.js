/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/dist/config.js';

const __dirname = import.meta.dirname;

export default defineConfig({
  build: {
    lib: {
      cssCodeSplit: false,
      entry: resolve(__dirname, 'src/runner.js'),
      name: 'vdta',
      formats: [
        'cjs',
        'es',
        'iife',
        'umd'
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./tests', import.meta.url))
    }
  },
  test: {
    coverage: {
      exclude: [
        ...(configDefaults?.coverage?.exclude || []),
        '.eslintrc.cjs',
        './src/main.js',
        '**/scripts/'
      ],
      reportsDirectory: './tests/unit/coverage'
    },
    environment: 'happy-dom',
    globals: true,
    root: '.',
    setupFiles: [
      './tests/unit/setup.js'
    ]
  }
});
