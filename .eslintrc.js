module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort'],

  ignorePatterns: ['dist', 'node_modules']
}
