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
  let theme;
  // Prefer the localStorage value if available
  try {
    const storageKey = '__vue-devtools-theme__';
    theme = window.localStorage.getItem(storageKey);
  } catch {
    // ignore
  }

  // but if not, check the class in the DOM, because it's their first
  // time using Vue-Dev-Tools probably.
  if (!theme || theme === 'auto') {
    // Checks <html class="dark"> on the VDT parent iframe
    if (win?.document?.documentElement?.classList?.contains('dark')) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
  }

  // avoid unnecessary communication with child iframe
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
