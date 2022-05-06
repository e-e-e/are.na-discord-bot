module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist/**'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    'prettier/prettier': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-restricted-properties': [
      'error',
      {
        object: 'it',
        property: 'skip',
        message: "Don't commit skipped tests",
      },
      {
        object: 'it',
        property: 'only',
        message: "Don't commit focused tests",
      },
      {
        object: 'describe',
        property: 'skip',
        message: "Don't commit skipped tests",
      },
      {
        object: 'describe',
        property: 'only',
        message: "Don't commit focused tests",
      },
    ],
  },
};
