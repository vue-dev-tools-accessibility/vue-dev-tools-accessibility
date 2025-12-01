import { resolve } from 'node:path';

const __dirname = import.meta.dirname;

export const testingGroundsPath = resolve(
  __dirname,
  '..',
  '..',
  'vite-vue3-pinia-options-api',
  'node_modules',
  'vue-dev-tools-accessibility'
);
