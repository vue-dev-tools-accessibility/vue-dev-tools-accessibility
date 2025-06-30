import { debounce as _debounce } from 'lodash-es';

import { runAxe } from './runAxe.js';

let domObserver = undefined;

/**
 * Sets up the MutatinObserver so it can be used to run
 * Axe automatically on DOM changes.
 *
 * @param {object} win  The DevTools iframe window object
 */
export const initializeDOMWatching = function (win) {
  const callback = () => {
    runAxe(win);
  };
  const minWait = 500;
  const maxWait = 3000;
  domObserver = new MutationObserver(_debounce(callback, minWait, { maxWait }));
};

/**
 * Toggles running Axe automatically based on the user
 * checking or unchecking the box in the UI.
 *
 * @param {object}  win      The DevTools iframe window object
 * @param {boolean} enabled  The user's choice to watch the DOM or not
 */
export const watchDom = function (win, enabled) {
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
};
