const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores([
    'eslint.config.js',
    'dist/**',
    'svgo.config.js',
    'postcss.config.js',
    'webpack.config.js',
    'webpack/**',
  ]),
  tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
