/**
 * Is the library being ran in dev mode.
 *
 * @type {Boolean}
 */
let isDev = false;
try {
  isDev = JSON.parse(localStorage.getItem('VDTA_LOCAL'));
} catch {
  console.log('VDTA: Error checking local state.');
}

/**
 * The URL to use for the UI child iframe.
 *
 * @type {String}
 */
let childIframeUrl = 'https://vue-dev-tools-accessibility.github.io/v0';
if (isDev) {
  childIframeUrl = 'http://localhost:5500/v0';
}
export const CHILD_IFRAME_URL = childIframeUrl;

/**
 * The name of a Material Design Icon, Iconify Ic Baseline icon, or a URL to an SVG.
 * https://fonts.google.com/icons
 * https://icones.netlify.app/collection/ic?variant=Baseline
 *
 * @type {String}
 */
export const ICON = 'https://vue-dev-tools-accessibility.github.io/logo.svg';

/**
 * Name of the plugin used internally by Vue-Dev-Tools as an ID.
 *
 * @type {String}
 */
export const PLUGIN_NAME = 'vue-accessibility';
