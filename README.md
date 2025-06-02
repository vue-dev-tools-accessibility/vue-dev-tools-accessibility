# vue-dev-tools-accessibility


## Accessibility plugin for Vite Vue-DevTools.

**Go to the website for install/usage steps:**

* https://vue-dev-tools-accessibility.github.io


## Running locally

1. Install [Volta](https://volta.sh)
1. Clone this repo
1. `npm i`
1. This repo is just the logic and the tab in the Vite-Vue-DevTools. You'll also need to clone down the UI too and run it locally.
  * Go to https://github.com/vue-dev-tools-accessibility/v0 and follow the "Running Locally" guide for that repo.
1. In another repo (any Vue 3 app that has the Vite-Vue-DevTools plugin installed), locally import this plugin from this repo:
    ```js
    // vite.config.js
    import vue from '@vitejs/plugin-vue';
    import { defineConfig } from 'vite';
    import vueDevTools from 'vite-plugin-vue-devtools';
    import vueDevToolsAccessibility from '../vue-dev-tools-accessibility/index.js';

    export default defineConfig({
      plugins: [
        vue(),
        vueDevTools(),
        vueDevToolsAccessibility()
      ]
    });
    ```
1. Run that Vue app to test the library there.
