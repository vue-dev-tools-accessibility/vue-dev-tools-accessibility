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
    ```diff
     // main.js
     import { createApp } from 'vue';
    +import vueDevToolsAccesibility from '../../vue-dev-tools-accessibility/index.js';

     import App from '@/App.vue';

     const app = createApp(App);
    +app.use(vueDevToolsAccesibility);
     app.mount('#app');
    ```
1. Run that Vue app to test the library there.
