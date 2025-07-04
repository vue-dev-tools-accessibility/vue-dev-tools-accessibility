/**
 * @file This is the main logic for the plugin. It communicates to "the site"
 *       (the /src folder, deployed on GitHub Pages). This code executes in
 *       the parent app's scope, so `window` is the user's app. However,
 *       Vue-DevTools lives in an iframe, so some of this logic operates
 *       in the Vue-DevTools iframe space (via a passed around `win` object).
 *       The site, is embedded in an iframe inside the Vue-DevTools iframe,
 *       and is only in the DOM when this plugin's tab is selected in the
 *       sidebar of the Vue-DevTools. The site's iframe can request data
 *       from this plugin.
 */

import { onDevToolsClientConnected } from '@vue/devtools-api';

import { addIframeTab } from './addIframeTab.js';
import { listenToChild } from './communication/listen.js';
import { watchTheme } from './theme.js';
import { initializeDOMWatching } from './watchDOM.js';

/**
 * Initializes the Accessibility plugin, adding it to the Vue-DevTools
 * sidebar, and establishes communication with the site via iframe
 * postMessage.
 */
export function setupDevtools () {
  addIframeTab();

  onDevToolsClientConnected(function () {
    const vueDevToolsFrame = document.getElementById('vue-devtools-iframe');
    const vueDevToolsWin = vueDevToolsFrame.contentWindow;
    listenToChild(vueDevToolsWin);
    watchTheme(vueDevToolsWin);
    initializeDOMWatching(vueDevToolsWin);
  });
}
