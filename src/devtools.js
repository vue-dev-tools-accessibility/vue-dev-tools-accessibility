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
// eslint-disable-next-line import/no-unresolved
import registerAPCACheck from 'apca-check';
// eslint-disable-next-line import/no-extraneous-dependencies
import apcaManifest from 'apca-w3/package.json' with { type: 'json' };
import axe from 'axe-core';
import { debounce as _debounce } from 'lodash-es';

import manifest from '../package.json' with { type: 'json' };

let isDev = false;
try {
  isDev = JSON.parse(localStorage.getItem('VDTA_LOCAL'));
} catch {
  console.log('VDTA: Error checking local state.');
}

let childIframeUrl = 'https://vue-dev-tools-accessibility.github.io/v0';
if (isDev) {
  childIframeUrl = 'http://localhost:5500/v0';
}

const OUTLINE_CLASS = 'vue-dev-tools-accessibility-outline';

/**
 * The name of a Material Design Icon, Iconify Ic Baseline icon, or a URL to an SVG.
 * https://fonts.google.com/icons
 * https://icones.netlify.app/collection/ic?variant=Baseline
 *
 * @type {String}
 */
const icon = 'https://vue-dev-tools-accessibility.github.io/logo.svg';

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
   * This is the tab title shown in the sidebar.
   * @type {String}
   */
  const title = 'Accessibility';

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
  let selectedTabIcon = win.document.querySelector('.router-link-active img');
  if (selectedTabIcon?.src === icon) {
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
    innerIframeWin.postMessage(data, childIframeUrl);
  }
}

/**
 * Adds a style block to the page with an outline class.
 */
function createOutlineClass () {
  const STYLE_ID = 'vue-dev-tools-accessibility-style';
  if (!document.getElementById(STYLE_ID)) {
    const styleElement = document.createElement('style');
    styleElement.id = STYLE_ID;
    styleElement.innerHTML = '.' + OUTLINE_CLASS + '{ outline: 4px solid #F00; }';
    document.body.appendChild(styleElement);
  }
}

/**
 * Remove the highlight class globally.
 */
function clearHighlights () {
  const allOutlinedElements = Array.from(document.querySelectorAll('.' + OUTLINE_CLASS));
  allOutlinedElements.forEach((element) => {
    element.classList.remove(OUTLINE_CLASS);
  });
}

/**
 * Highlights a DOM node on the page and scrolls to it.
 *
 * @param  {object} win     The DevTools iframe window object
 * @param  {string} target  The CSS Selector to highlight
 */
function highlightTarget (win, target) {
  createOutlineClass();
  const targetElement = document.querySelector(target);
  if (targetElement.classList.contains(OUTLINE_CLASS)) {
    targetElement.classList.remove(OUTLINE_CLASS);
  } else {
    clearHighlights();
    targetElement.classList.add(OUTLINE_CLASS);
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }
}

let axeRunning = false;
/** @type {undefined|'bronze'|'silver'}  Color contrast settings for WCAG 2 AA (undef) or APCA (str) */
let colorStandard = undefined;

/**
 * Runs Axe, the accessibility tool. It scans the full
 * DOM and reports to the site any violations it finds.
 *
 * @param {object} win  The DevTools iframe window object
 */
function runAxe (win) {
  if (axeRunning) {
    return;
  }
  sendToChild(win, { axeLoading: true });
  axeRunning = true;
  axe.reset();

  if (colorStandard === 'aaa') {
    axe.configure({
      rules: [
        // Enable AA contrast violations for colors with contrast below 4.5
        {
          id: 'color-contrast',
          enabled: true
        },
        // Enable AAA contrast violations for colors with contrast ration between 4.5 and 7.0
        {
          id: 'color-contrast-enhanced',
          enabled: true
        }
      ]
    });
  } else if (colorStandard) {
    registerAPCACheck(colorStandard);
    axe.configure({
      rules: [
        // Disable WCAG 2 AA color contrast, since we are using APCA instead
        {
          id: 'color-contrast',
          enabled: false
        }
      ]
    });
  }

  axe
    .run(window.document)
    .then(({ violations }) => {
      sendToChild(win, { violations });
    })
    .catch((error) => {
      sendToChild(win, { error });
    })
    .finally(() => {
      clearHighlights();
      axeRunning = false;
    });
}

/**
 * Updates the value of the colorStandards variable based on the
 * user's settings from the UI.
 *
 * @param {object} win      The DevTools iframe window object
 * @param {string} [value]  Must be undefined, 'bronze', 'silver', or 'aaa'
 */
function setColorStandard (win, value) {
  if (colorStandard !== value) {
    const allowed = ['aaa', 'bronze', 'silver'];
    if (allowed.includes(value)) {
      colorStandard = value;
    } else {
      colorStandard = undefined;
    }
    runAxe(win);
  }
}

/**
 * Send the library and Axe version numbers to the child.
 *
 * @param {object} win  The DevTools iframe window object
 */
function sendVersions (win) {
  sendToChild(win, { apcaVersion: apcaManifest.version });
  sendToChild(win, { axeVersion: axe.version });
  sendToChild(win, { vdtaVersion: manifest.version });
}

let domObserver = undefined;
/**
 * Sets up the MutatinObserver so it can be used to run
 * Axe automatically on DOM changes.
 *
 * @param {object} win  The DevTools iframe window object
 */
function initializeDOMWatching (win) {
  const callback = () => {
    runAxe(win);
  };
  const minWait = 500;
  const maxWait = 3000;
  domObserver = new MutationObserver(_debounce(callback, minWait, { maxWait }));
}
/**
 * Toggles running Axe automatically based on the user
 * checking or unchecking the box in the UI.
 *
 * @param {object}  win      The DevTools iframe window object
 * @param {boolean} enabled  The user's choice to watch the DOM or not
 */
function watchDom (win, enabled) {
  if (enabled) {
    const targetNode = document.querySelector('[data-v-app]');
    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };
    domObserver.observe(targetNode, config);
  } else {
    domObserver.disconnect();
  }
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
    const actionsMap = {
      highlightTarget,
      runAxe,
      sendTheme,
      sendVersions,
      setColorStandard,
      watchDom
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
    initializeDOMWatching(vueDevToolsWin);
  });
}
