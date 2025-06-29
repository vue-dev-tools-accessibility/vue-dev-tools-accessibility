# vue-dev-tools-accessibility


## Accessibility plugin for Vite Vue-DevTools.

**Go to the website for install/usage steps:**

* https://vue-dev-tools-accessibility.github.io


## Running locally

1. Install [Volta](https://volta.sh)
1. Clone this repo
1. `npm i`
1. This repo is just the logic and the tab in the Vite-Vue-DevTools. You'll also need to clone down the UI too and run it locally.
  * Go to https://github.com/vue-dev-tools-accessibility/v0 and follow the "Running Locally" guide for that repo.
  * Start up that local web server
1. In another repo (any Vue 3 app that has the Vite-Vue-DevTools plugin installed), [set up this plugin in normally](https://vue-dev-tools-accessibility.github.io), and start the webserver for it.
1. Use `npm run build-dev`, though you'll have to update the `testingGroundsPath` variable in `scripts/postbuild-dev.js` to point to your test Vite app. 
1. You'll also need to delete the `node_modules/.vite` and `node_modules/.vite-temp` folders sometimes to get it to load the changes from node_modules. I do this by just making an npm script that does it everytime I restart the dev server:
  * `"start": "rd /s /q ./node_modules/.vite && rd /s /q ./node_modules/.vite-temp && vite",`
  * `"start": "rm -r -f ./node_modules/.vite && rm -r -f ./node_modules/.vite-temp && vite",`
1. Run that Vue app to test the library there.
1. To have access to the `v0` localhost server, run `localStorage.setItem('VDTA_LOCAL', true);` in the console and refresh the page.

*How does this take into acconut update/adding new dependencies?*

It doesn't! For that, you just have to `npm install` them and publish a new release of `vue-dev-tools-accessibility` and repeat step 4.
