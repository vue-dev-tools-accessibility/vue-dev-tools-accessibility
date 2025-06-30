import { highlightTarget } from './highlighter.js';
import { runAxe, setColorStandard } from './runAxe.js';
import { sendVersions } from './sendVersions.js';
import { sendTheme } from './theme.js';
import { watchDom } from './watchDOM.js';

/**
 * The website lives in an iframe and can
 * request data from this plugin related to
 * the user's App or the Vue-DevTools state.
 * We then run functions based on the request.
 *
 * @param {object} win  The DevTools iframe window object
 */
export const listenToChild = function (win) {
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
};
