import { version as apcaVersion } from 'apca-w3/package.json' with { type: 'json' };
import { version as axeVersion } from 'axe-core';

import { version as vdtaVersion } from '../package.json' with { type: 'json' };

import { sendToChild } from './sendToChild.js';

/**
 * Send the library and Axe version numbers to the child.
 *
 * @param {object} win  The DevTools iframe window object
 */
export const sendVersions = function (win) {
  sendToChild(win, { apcaVersion });
  sendToChild(win, { axeVersion });
  sendToChild(win, { vdtaVersion });
};
