import { addCustomTab } from '@vue/devtools-api';

import {
  CHILD_IFRAME_URL,
  ICON
} from './constants.js';

/**
 * This adds the plugin to the sidebar of Vue-DevTools
 * and registers it as an iframe plugin.
 */
export const addIframeTab = function () {
  /**
   * A unique name used as an ID by the dev tools.
   * @type {String}
   */
  const name = 'vue-accessibility';

  /**
   * This is the tab title shown in the sidebar.
   * @type {String}
   */
  const title = 'Accessibility';

  const icon = ICON;

  /**
   * After clicking the tab, it renders an embedded iframe.
   */
  const view = {
    // 'iframe', 'vnode', 'sfc' - Each has a different object shape
    type: 'iframe',
    /**
     * URL for the iframe.
     * @type {String}
     */
    src: CHILD_IFRAME_URL,
    /**
     * Persist the iframe instance even if the tab is not active.
     * @type {Boolean}
     * @default true
     */
    persistent: true
  };

  /**
   * Determines which group to place the tab in, in the sidebar.
   * @type {'pinned'|'app'|'modules'|'advanced'}
   */
  const category = 'modules';

  /**
   * Adds a tab in the sidebar of the Vite-Vue-Dev-Tools.
   * At time of writing the documentation for this is extremely bad.
   * https://devtools.vuejs.org/plugins/api
   * Maybe they fixed it in the future.
   */
  addCustomTab({ name, title, icon, view, category });
};
