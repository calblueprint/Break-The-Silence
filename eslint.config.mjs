import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import tsEslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-shadow': 'error',
    },
  },
  // metro.config.js is loaded directly by Node, unlike the ESM app
  // code above, so it needs require/module/__dirname recognized as globals
  // and the no require imports rule turned off just for this file.
  {
    files: ['metro.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        __dirname: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
