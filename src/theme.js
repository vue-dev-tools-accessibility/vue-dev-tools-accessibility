import { sendToChild } from './sendToChild.js';

/**
 * Checks the value in local storage of the Vue-DevTools
 * light/dark mode theme, and if it changed, sends it to
 * the website, so it stays sync'd.
 *
 * @param {object}         win           The DevTools iframe window object
 * @param {'light'|'dark'} currentTheme  Theme sent by the child iframe
 */
export const sendTheme = function (win, currentTheme) {
  const storageKey = '__vue-devtools-theme__';
  const theme = window.localStorage.getItem(storageKey);
  if (theme !== currentTheme) {
    sendToChild(win, { theme });
  }
};

/**
 * The Vue-DevTools theme (light/dark) setting lives in
 * localStorage. This listens for any localStorage changes
 * and fires sendTheme to update the website to match.
 *
 * @param {object} win  The DevTools iframe window object
 */
export const watchTheme = function (win) {
  win.addEventListener('storage', () => {
    sendTheme(win);
  });
};
