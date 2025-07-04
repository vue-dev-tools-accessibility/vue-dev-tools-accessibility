import {
  CHILD_IFRAME_URL,
  ICON,
  PLUGIN_NAME
} from '../constants.js';

/**
 * These are the names of the actions to be sent to the child.
 *
 * @type {Object}
 */
export const ALLOWED_ACTIONS = {
  APCA_VERSION: 'apcaVersion',
  AXE_LOADING: 'axeLoading',
  AXE_VERSION: 'axeVersion',
  // Axe errors
  ERROR: 'error',
  LOAD_SETTINGS: 'loadSettings',
  THEME: 'theme',
  VDTA_VERSION: 'vdtaVersion',
  // Axe violations
  VIOLATIONS: 'violations'
};

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
  let route;
  try {
    route = JSON.parse(localStorage.getItem('__VUE_DEVTOOLS_CLIENT_STATE__'))?.route;
  } catch {
    // ignore
  }
  if (route) {
    return route === '/custom-tab-view/' + PLUGIN_NAME;
  }
  // Fallback to DOM check if localStorage does not work.
  let selectedTabIcon = win.document.querySelector('.router-link-active img');
  if (selectedTabIcon?.src === ICON) {
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
export const sendToChild = function (win, data) {
  const action = Object.keys(data)[0];
  const allowedActions = Object.values(ALLOWED_ACTIONS);
  if (allowedActions.includes(action)) {
    if (isTabSelected(win)) {
      const selector = 'iframe[src="' + CHILD_IFRAME_URL + '"]';
      const innerIframe = win.document?.querySelector(selector);
      const innerIframeWin = innerIframe?.contentWindow;
      if (innerIframeWin) {
        innerIframeWin.postMessage(data, CHILD_IFRAME_URL);
      }
    }
  } else {
    console.log('Action not allowed:', data);
  }
};
