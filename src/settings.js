import { ALLOWED_ACTIONS, sendToChild } from './communication/sendToChild.js';

const { LOAD_SETTINGS } = ALLOWED_ACTIONS;

const STORAGE_KEY = 'VDTA_SETTINGS';

export const saveSettings = function (win, data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.log({ error });
  }
};

export const loadSettings = function (win) {
  let data = undefined;
  try {
    data = localStorage.getItem(STORAGE_KEY);
    data = JSON.parse(data);
  } catch (error) {
    console.log({ error });
  }
  if (data) {
    sendToChild(win, { [LOAD_SETTINGS]: data });
  }
};
