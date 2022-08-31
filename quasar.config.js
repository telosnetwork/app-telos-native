/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js
// import { env } from "process";
const env = require("./env");
const webpack = require("webpack");
const path = require("path");
const { configure } = require("quasar/wrappers");
const ESLintPlugin = require("eslint-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
    // supportTS: false,

    // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: [
      "layouts",
      "axios",
      "hyperion",
      "i18n",
      { path: "ual", server: false },
      { path: "api", server: false },
      "mixins",
      "ga",
    ],

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      "ionicons-v4",
      "mdi-v5",
      "fontawesome-v6",
      "eva-icons",
      "themify",
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-build
    build: {
      env,
      scopeHoisting: true,
      vueRouterMode: "history", // available values: 'hash', 'history'

      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v2.quasar.dev/quasar-cli-webpack/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain

      chainWebpack(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
      },

      chainWebpack(chain) {
        const nodePolyfillWebpackPlugin = require("node-polyfill-webpack-plugin");
        chain.plugin("node-polyfill").use(nodePolyfillWebpackPlugin);
      },

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack(cfg) {
        cfg.module.rules.push({
          test: /\.pug$/,
          loader: "pug-plain-loader",
        });

        cfg.module.rules.push({
          test: /\.mjs$/,
          type: "javascript/auto",
        });

        cfg.plugins.push(
          new CopyWebpackPlugin(
            {
              patterns: [
                {
                  from: "./src/statics/*.json",
                  to: "./",
                  force: true,
                },
              ],
            },
            { copyUnmodified: true }
          )
        );

        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          "~": path.resolve(__dirname, "src"),
        };

        cfg.plugins.push(
          new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
          })
        );
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-devServer
    devServer: {
      server: {
        type: "http",
      },
      port: 8080,
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js#Property%3A-framework
    framework: {
      config: {},

      iconSet: "fontawesome-v6", // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      all: "auto",

      components: [
        "QAvatar",
        "QBadge",
        "QBtn",
        "QBtnToggle",
        "QCard",
        "QCardActions",
        "QCardSection",
        "QCarousel",
        "QCarouselControl",
        "QCarouselSlide",
        "QChatMessage",
        "QCheckbox",
        "QChip",
        "QDate",
        "QDialog",
        "QDrawer",
        "QEditor",
        "QExpansionItem",
        "QFab",
        "QFabAction",
        "QForm",
        "QHeader",
        "QIcon",
        "QImg",
        "QInfiniteScroll",
        "QInnerLoading",
        "QInput",
        "QItem",
        "QItemLabel",
        "QItemSection",
        "QLayout",
        "QLinearProgress",
        "QList",
        "QMenu",
        "QOptionGroup",
        "QPage",
        "QPageContainer",
        "QPageSticky",
        "QPagination",
        "QPopupProxy",
        "QRadio",
        "QRouteTab",
        "QScrollArea",
        "QSelect",
        "QSeparator",
        "QSpace",
        "QSpinner",
        "QSpinnerComment",
        "QSpinnerDots",
        "QTabs",
        "QTab",
        "QTime",
        "QToggle",
        "QToolbar",
        "QToolbarTitle",
        "QTooltip",
        "QUploader",
      ],
      directives: ["ClosePopup", "Ripple"],

      // Quasar plugins
      plugins: ["Notify", "Loading", "BottomSheet"],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      middlewares: [
        ctx.prod ? "compression" : "",
        "render", // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-webpack/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode

      chainWebpackCustomSW(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      manifest: {
        name: `Telos App`,
        short_name: `Telos App`,
        description: `Native App`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "app-telos-net",
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain

      chainWebpackMain(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      chainWebpackPreload(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },
    },
  };
});
