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
];
