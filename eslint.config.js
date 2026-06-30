import path from 'node:path';

import pluginJs from '@eslint/js';
import tjwBase from 'eslint-config-tjw-base';
import tjwImport from 'eslint-config-tjw-import-x';
import tjwJest from 'eslint-config-tjw-jest';
import pluginImport from 'eslint-plugin-import-x';
import pluginJest from 'eslint-plugin-jest';

const __dirname = import.meta.dirname;

export default [
  pluginJs.configs.recommended,
  tjwBase.configs.recommended,

  pluginImport.flatConfigs.recommended,
  tjwImport,

  pluginJest.configs['flat/recommended'],
  tjwJest.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2026,
      globals: {
        vi: true
      }
    },
    rules: {
      'import-x/no-anonymous-default-export': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unused-modules': 'off',

      // If this is not turned off, linting throws because it can't find 'jest' install
      'jest/no-deprecated-functions': 'off'
    },
    settings: {
      'import-x/resolver': {
        vite: {
          viteConfig: {
            resolve: {
              alias: {
                '@': path.resolve(__dirname, 'src'),
                '@@': path.resolve(__dirname, 'tests')
              }
            }
          }
        }
      }
    }
  }
];
