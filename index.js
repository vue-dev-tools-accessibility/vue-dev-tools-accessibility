export default function vueDevToolsAccessibility () {
  return {
    name: 'vue-dev-tools-accessibility',
    /**
     * Result of the transformation, can be a string, an array of HtmlTagDescriptor,
     * an object with html and tags properties, or a Promise resolving to any of those.
     *
     * @param    {string}                        html              The HTML string to transform.
     * @param    {object}                        context           Context object containing information about the current build.
     * @param    {string}                        context.path      The path of the current HTML file.
     * @param    {string}                        context.filename  The filename of the current HTML file.
     * @param    {import('vite').ViteDevServer}  [context.server]  Optional Vite development server instance.
     * @param    {import('rollup').OutputBundle} [context.bundle]  Optional Rollup output bundle.
     * @param    {import('rollup').OutputChunk}  [context.chunk]   Optional Rollup output chunk.
     * @return   {string}                                          String of HTML.
     */
    transformIndexHtml: function (html, context) {
      if (context.server) {
        return html.replace(
          '</body>',
          [
            '<script src="./node_modules/axe-core/axe.js"></script>',
            '<script type="module" src="./node_modules/vue-dev-tools-accessibility/src/runner.js"></script>',
            '</body>'
          ].join('\n')
        );
      }
    }
  }
}
