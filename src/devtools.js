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

import {
  addCustomTab,
  onDevToolsClientConnected
} from '@vue/devtools-api';
import axe from 'axe-core';

const isDev = import.meta.env.VITE_A11Y === 'local';

let childIframeUrl = 'https://vue-dev-tools-accessibility.github.io/v0';
if (isDev) {
  childIframeUrl = 'http://localhost:5500/v0';
}

/**
 * This is the tab title shown in the sidebar.
 * @type {String}
 */
const title = 'Accessibility';

/**
 * This adds the plugin to the sidebar of Vue-DevTools
 * and registers it as an iframe plugin.
 */
function addIframeTab () {
  /**
   * A unique name used as an ID by the dev tools.
   * @type {String}
   */
  const name = 'vue-accessibility';

  /**
   * The name of a Material Design Icon, Iconify Ic Baseline icon, or a URL to an SVG.
   * https://fonts.google.com/icons
   * https://icones.netlify.app/collection/ic?variant=Baseline
   *
   * @type {String}
   */
  const icon = 'https://vue-dev-tools-accessibility.github.io/logo.svg';

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
    src: childIframeUrl,
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
}

/**
 * Checks if the plugin's tab is selected in the
 * sidebar of Vue-DevTools. If it is not, then
 * access to the child iframe is not possible,
 * so communication with it is not possible.
 *
 * @param  {object}  win  The DevTools iframe window object
 * @return {Boolean}      true = Accessibility tab is selected and iframe is loaded
 */
function isTabSelected (win) {
  let selectedTab = win.document.querySelector('.router-link-active');
  if (selectedTab?.innerText === title) {
    return true;
  }
  return false;
}

/**
 * Sends data to the website (child iframe).
 *
 * @param {object} win   The DevTools iframe window object
 * @param {object} data  An object where the key communicates the type of data being sent
 */
function sendToChild (win, data) {
  if (isTabSelected(win)) {
    const innerIframe = win.document.querySelector('iframe[src="' + childIframeUrl + '"]');
    const innerIframeWin = innerIframe.contentWindow;
    innerIframeWin.postMessage(data, '*');
  }
}


/**
 * Runs Axe, the accessibility tool. It scans the full
 * DOM and reports to the site any violations it finds.
 *
 * @param {object} win  The DevTools iframe window object
 */
function runAxe (win) {
  console.log(window.document.body);
  axe
    .run(window.document)
    .then(({ violations }) => {
      sendToChild(win, { violations });
    })
    .catch((error) => {
      sendToChild(win, { error });
    });
}

/**
 * Checks the value in local storage of the Vue-DevTools
 * light/dark mode theme, and if it changed, sends it to
 * the website, so it stays sync'd.
 *
 * @param {object} win  The DevTools iframe window object
 */
function sendTheme (win, currentTheme) {
  const storageKey = '__vue-devtools-theme__';
  const theme = window.localStorage.getItem(storageKey);
  if (theme !== currentTheme) {
    console.log('theme sent');
    sendToChild(win, { theme });
  }
}
/**
 * The Vue-DevTools theme (light/dark) setting lives in
 * localStorage. This listens for any localStorage changes
 * and fires sendTheme to update the website to match.
 *
 * @param {object} win  The DevTools iframe window object
 */
function watchTheme (win) {
  win.addEventListener('storage', () => {
    sendTheme(win);
  });
}

/**
 * The website lives in an iframe and can
 * request data from this plugin related to
 * the user's App or the Vue-DevTools state.
 * We then run functions based on the request.
 *
 * @param {object} win  The DevTools iframe window object
 */
function listenToChild (win) {
  function displayMessage ($event) {
    const data = $event.message || $event.data;
    if (typeof(data) !== 'string') {
      console.log({ childRequested: data });
    }
    const actionsMap = {
      runAxe,
      sendTheme
    };
    if (actionsMap[data?.action]) {
      actionsMap[data.action](win, data?.data);
    }
  }
  if (win.addEventListener) {
    win.addEventListener('message', displayMessage, false);
  } else {
    win.attachEvent('onmessage', displayMessage);
  }
}

/**
 * Initializes the Accessibility plugin,
 * adding it to the Vue-DevTools sidebar,
 * and establishes communication with the
 * site via iframe postMessage.
 */
export function setupDevtools () {
  addIframeTab();

  onDevToolsClientConnected(function () {
    const vueDevToolsFrame = document.getElementById('vue-devtools-iframe');
    const vueDevToolsWin = vueDevToolsFrame.contentWindow;
    listenToChild(vueDevToolsWin);
    watchTheme(vueDevToolsWin);
  });
}
