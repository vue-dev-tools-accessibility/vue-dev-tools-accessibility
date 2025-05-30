/* eslint-disable import/no-extraneous-dependencies */

import { fileURLToPath, URL } from 'node:url';

/* eslint-disable-next-line */
import { defineConfig } from 'vite';
/* eslint-disable-next-line import/named */
import { configDefaults } from 'vitest/dist/config.js';

export default defineConfig({
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
