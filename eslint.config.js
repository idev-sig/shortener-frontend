import eslint from '@eslint/js';
import typescriptESLintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptESLintParser from '@typescript-eslint/parser';
import reactESLintPlugin from 'eslint-plugin-react';

export default [
  eslint.configs.recommended,
  {
    // 针对 TypeScript 文件的配置
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptESLintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptESLintPlugin,
    },
    rules: {
      ...typescriptESLintPlugin.configs.recommended.rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-unsafe-optional-chaining': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    // 针对 React 文件的配置
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: reactESLintPlugin,
    },
    rules: {
      ...reactESLintPlugin.configs.recommended.rules,
    },
  },
  {
    // Migrated ignore patterns from .eslintignore
    ignores: [
      'lambda/**', // Replaces /lambda/
      'scripts/**', // Replaces /scripts
      'config/**', // Replaces /config
      '.history/**', // Replaces .history
      'public/**', // Replaces public
      'dist/**', // Replaces dist
      '.umi/**', // Replaces .umi
      'mock/**', // Replaces mock
    ],
  },
];
