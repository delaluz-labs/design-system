import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',

      reporter: ['text', 'json', 'html'],

      include: ['scripts/**/*.mjs'],

      exclude: ['scripts/build.mjs'],

      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
