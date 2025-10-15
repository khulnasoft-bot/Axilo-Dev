import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'src/**/*.{test,spec}.{js,ts,tsx}',
      '**/*.{test,spec}.{js,ts,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.d.ts'
    ],
    testTimeout: 10000,
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{js,ts,tsx}'
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{js,ts,tsx}',
        'src/**/*.spec.{js,ts,tsx}',
        'src/**/__tests__/**',
        'src/index.tsx' // Exclude the main entry point
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      all: true
    },
    reporters: process.env.CI ? ['verbose', 'github-actions'] : ['verbose'],
    bail: process.env.CI ? 1 : 0,
    clearMocks: true,
    restoreMocks: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    target: 'node18',
    platform: 'node'
  }
});
