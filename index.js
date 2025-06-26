/**
 * Vite plugin that sets up an accessibility tab in the Vite Vue-DevTools.
 *
 * @return {object} A Vite Plugin object
 */
export default function vueDevToolsAccessibility () {
  /**
   * @typedef {object}                        CONTEXT
   * @param   {string}                        path      The path of the current HTML file.
   * @param   {string}                        filename  The filename of the current HTML file.
   * @param   {import('vite').ViteDevServer}  [server]  Optional Vite development server instance.
   * @param   {import('rollup').OutputBundle} [bundle]  Optional Rollup output bundle.
   * @param   {import('rollup').OutputChunk}  [chunk]   Optional Rollup output chunk.
   */

  return {
    name: 'vue-dev-tools-accessibility',
    /**
     * Result of the transformation, can be a string, an array of HtmlTagDescriptor,
     * an object with html and tags properties, or a Promise resolving to any of those.
     *
     * @param  {string}  html     The HTML string to transform.
     * @param  {CONTEXT} context  Context object containing information about the current build.
     * @return {string}           String of HTML.
     */
    transformIndexHtml: function (html, context) {
      if (context.server) {
        return html.replace(
          '</body>',
          [
            '<script src="./node_modules/vue-dev-tools-accessibility/dist/vue-dev-tools-accessibility.iife.js"></script>',
            '</body>'
          ].join('\n')
        );
      }
    }
  }
}
