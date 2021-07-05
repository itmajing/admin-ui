module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    eqeqeq: ['error', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': ['warn', { before: false, after: true }],
    'no-inline-comments': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-v-model-argument': 'off',
  },
};
