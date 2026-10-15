import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.js'],

    exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**'],

    environment: 'node',
  },
});
