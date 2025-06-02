import { setupDevtools } from './devtools.js';

if (process.env.NODE_ENV === 'development' || window.__VUE_PROD_DEVTOOLS__) {
  setupDevtools();
}
