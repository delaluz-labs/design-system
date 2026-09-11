import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**'
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Adds browser globals like console, window, etc.
        ...globals.node,    // Optional: Adds Node.js globals like process
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      complexity: ['error', 10], 'no-console': ['warn', {allow: ['log', 'warn', 'error']}]
    }
  }
];
