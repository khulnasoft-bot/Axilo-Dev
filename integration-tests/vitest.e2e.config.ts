import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 60000,
    setupFiles: ['./tests/e2e-setup.ts'],
    include: ['tests/e2e/**/*.e2e.ts'],
    exclude: ['node_modules', 'dist'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
