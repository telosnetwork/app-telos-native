const { resolve } = require('path');
module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
    // Needed to make the parser take into account 'vue' files
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:vue/vue3-essential',
  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {

    // -- turning off all typescript-eslint rules --
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
    'constructor-super': 'off',
    'getter-return': 'off',
    'no-const-assign': 'off',
    'no-dupe-args': 'off',
    'no-dupe-class-members': 'off',
    'no-dupe-keys': 'off',
    'no-func-assign': 'off',
    'no-import-assign': 'off',
    'no-new-symbol': 'off',
    'no-obj-calls': 'off',
    'no-redeclare': 'off',
    'no-setter-return': 'off',
    'no-this-before-super': 'off',
    'no-undef': 'off',
    'no-unreachable': 'off',
    'no-unsafe-negation': 'off',
    'no-var': 'off',
    'prefer-const': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'valid-typeof': 'off',

    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended-requiring-type-checking.ts
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-for-in-array': 'off',
    'no-implied-eval': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    'require-await': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/unbound-method': 'off',

    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended.ts
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': 'off',
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-loss-of-precision': 'off',
    '@typescript-eslint/no-loss-of-precision': 'off',
    '@typescript-eslint/no-misused-new': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',

    // -- turning off all vue rules --
    // https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/configs/base.js
    'vue/comment-directive': 'off',
    'vue/jsx-uses-vars': 'off',
    // https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/configs/vue3-essential.js
    'vue/multi-word-component-names': 'off',
    'vue/no-arrow-functions-in-watch': 'off',
    'vue/no-async-in-computed-properties': 'off',
    'vue/no-child-content': 'off',
    'vue/no-computed-properties-in-data': 'off',
    'vue/no-deprecated-data-object-declaration': 'off',
    'vue/no-deprecated-destroyed-lifecycle': 'off',
    'vue/no-deprecated-dollar-listeners-api': 'off',
    'vue/no-deprecated-dollar-scopedslots-api': 'off',
    'vue/no-deprecated-events-api': 'off',
    'vue/no-deprecated-filter': 'off',
    'vue/no-deprecated-functional-template': 'off',
    'vue/no-deprecated-html-element-is': 'off',
    'vue/no-deprecated-inline-template': 'off',
    'vue/no-deprecated-props-default-this': 'off',
    'vue/no-deprecated-router-link-tag-prop': 'off',
    'vue/no-deprecated-scope-attribute': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-deprecated-slot-scope-attribute': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
    'vue/no-deprecated-v-is': 'off',
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'vue/no-deprecated-v-on-number-modifiers': 'off',
    'vue/no-deprecated-vue-config-keycodes': 'off',
    'vue/no-dupe-keys': 'off',
    'vue/no-dupe-v-else-if': 'off',
    'vue/no-duplicate-attributes': 'off',
    'vue/no-export-in-script-setup': 'off',
    'vue/no-expose-after-await': 'off',
    'vue/no-lifecycle-after-await': 'off',
    'vue/no-mutating-props': 'off',
    'vue/no-parsing-error': 'off',
    'vue/no-ref-as-operand': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/no-reserved-keys': 'off',
    'vue/no-reserved-props': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/no-shared-component-data': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/no-template-key': 'off',
    'vue/no-textarea-mustache': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-use-computed-property-like-method': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/no-useless-template-attributes': 'off',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-watch-after-await': 'off',
    'vue/prefer-import-from-vue': 'off',
    'vue/require-component-is': 'off',
    'vue/require-prop-type-constructor': 'off',
    'vue/require-render-return': 'off',
    'vue/require-slots-as-functions': 'off',
    'vue/require-toggle-inside-transition': 'off',
    'vue/require-v-for-key': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/return-in-computed-property': 'off',
    'vue/return-in-emits-validator': 'off',
    'vue/use-v-on-exact': 'off',
    'vue/valid-attribute-name': 'off',
    'vue/valid-define-emits': 'off',
    'vue/valid-define-props': 'off',
    'vue/valid-next-tick': 'off',
    'vue/valid-template-root': 'off',
    'vue/valid-v-bind': 'off',
    'vue/valid-v-cloak': 'off',
    'vue/valid-v-else-if': 'off',
    'vue/valid-v-else': 'off',
    'vue/valid-v-for': 'off',
    'vue/valid-v-html': 'off',
    'vue/valid-v-if': 'off',
    'vue/valid-v-is': 'off',
    'vue/valid-v-memo': 'off',
    'vue/valid-v-model': 'off',
    'vue/valid-v-on': 'off',
    'vue/valid-v-once': 'off',
    'vue/valid-v-pre': 'off',
    'vue/valid-v-show': 'off',
    'vue/valid-v-slot': 'off',
    'vue/valid-v-text': 'off'
  }
}
