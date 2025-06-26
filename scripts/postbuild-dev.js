import { readFileSync, writeFileSync } from 'node:fs';
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

const copyFileToTestingGrounds = function (file) {
  try {
    const inputFilePath = resolve(__dirname, '..', file);
    const outputFilePath = resolve(testingGroundsPath, file);
    const contents = String(readFileSync(inputFilePath));
    writeFileSync(outputFilePath, contents);
  } catch (error) {
    console.log('Error copying ' + file + ' to testing grounds.');
    console.log(error);
  }
};

copyFileToTestingGrounds('index.js');
copyFileToTestingGrounds('package.json');
