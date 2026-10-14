import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/*.test.js', 'tests/unit/**/*.test.js'],

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/e2e/**',
      'tests/integration/**',
      'tests/integration/generated/**',
    ],

    environment: 'node',

    coverage: {
      provider: 'v8',

      include: ['scripts/**/*.mjs'],

      exclude: ['scripts/integration/**', 'scripts/build.mjs'],

      reporter: ['text', 'html', 'lcov'],

      reportsDirectory: './coverage',
    },
  },
});
