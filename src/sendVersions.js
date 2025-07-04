import { version as apcaVersion } from 'apca-w3/package.json' with { type: 'json' };
import { version as axeVersion } from 'axe-core';

import { version as vdtaVersion } from '../package.json' with { type: 'json' };

import { ALLOWED_ACTIONS, sendToChild } from './communication/sendToChild.js';

const {
  APCA_VERSION,
  AXE_VERSION,
  VDTA_VERSION
} = ALLOWED_ACTIONS;

/**
 * Send the library and Axe version numbers to the child.
 *
 * @param {object} win  The DevTools iframe window object
 */
export const sendVersions = function (win) {
  sendToChild(win, { [APCA_VERSION]: apcaVersion });
  sendToChild(win, { [AXE_VERSION]: axeVersion });
  sendToChild(win, { [VDTA_VERSION]: vdtaVersion });
};
