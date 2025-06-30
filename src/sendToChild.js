import {
  CHILD_IFRAME_URL,
  ICON
} from './constants.js';

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
  if (isTabSelected(win)) {
    const innerIframe = win.document.querySelector('iframe[src="' + CHILD_IFRAME_URL + '"]');
    const innerIframeWin = innerIframe.contentWindow;
    innerIframeWin.postMessage(data, CHILD_IFRAME_URL);
  }
};
