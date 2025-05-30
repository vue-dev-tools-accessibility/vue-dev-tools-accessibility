/* eslint-disable-next-line 'import/default', 'import/no-named-as-default', 'import/no-named-as-default-member' */
import { setupDevtools } from './src/devtools.js';

export default {
  install: function () {
    if (process.env.NODE_ENV === 'development' || window.__VUE_PROD_DEVTOOLS__) {
      setupDevtools();
    }
  }
};
