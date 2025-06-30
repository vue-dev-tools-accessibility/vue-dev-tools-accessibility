// eslint-disable-next-line import/no-unresolved
import registerAPCACheck from 'apca-check';
import axe from 'axe-core';

import { clearHighlights } from './highlighter.js';
import { sendToChild } from './sendToChild.js';

/** @type {undefined|'bronze'|'silver'|'aaa'}  Color contrast checker */
let colorStandard = undefined;
let axeRunning = false;

/**
 * Updates the value of the colorStandards variable based on the
 * user's settings from the UI.
 *
 * @param {object} win      The DevTools iframe window object
 * @param {string} [value]  Must be undefined, 'bronze', 'silver', or 'aaa'
 */
export const setColorStandard = function (win, value) {
  if (colorStandard !== value) {
    const allowed = ['aaa', 'bronze', 'silver'];
    if (allowed.includes(value)) {
      colorStandard = value;
    } else {
      colorStandard = undefined;
    }
    runAxe(win);
  }
};

/**
 * Runs Axe, the accessibility tool. It scans the full
 * DOM and reports to the site any violations it finds.
 *
 * @param {object} win  The DevTools iframe window object
 */
export const runAxe = function (win) {
  if (axeRunning) {
    return;
  }
  axeRunning = true;
  sendToChild(win, { axeLoading: axeRunning });
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

  // github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
  const options = {
    absolutePaths: true
  };

  axe
    .run(window.document, options)
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
};
