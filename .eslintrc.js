module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:prettier/recommended', 'plugin:vue/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceMap: 'module',
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'vue/one-component-per-file': 'off',
    'vue/require-default-prop': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': 'off',
    'vue/component-definition-name-casing': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        bracketSpacing: true,
        singleQuote: true,
        arrowParens: 'always',
        printWidth: 120,
      },
    ],
  },
}
