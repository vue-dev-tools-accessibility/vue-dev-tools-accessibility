/* eslint-disable import/no-extraneous-dependencies */

import path from 'node:path';

import pluginJs from '@eslint/js';
import tjwBase from 'eslint-config-tjw-base';
import tjwImport from 'eslint-config-tjw-import';
import tjwJest from 'eslint-config-tjw-jest';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import globals from 'globals';

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
      globals: {
        ...globals.browser,
        vi: true
      }
    },
    rules: {
      'import/no-anonymous-default-export': 'off',
      'import/no-namespace': 'off',
      'import/no-unresolved': 'off',
      'import/no-unused-modules': 'off',

      // If this is not turned off, linting throws because it can't find 'jest' install
      'jest/no-deprecated-functions': 'off'
    },
    settings: {
      'import/resolver': {
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
