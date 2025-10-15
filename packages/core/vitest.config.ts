import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest configuration for AXILO Core package
 *
 * This configuration is specifically tailored for testing the core utilities,
 * types, validation, and shared functionality that other AXILO packages depend on.
 */

export default defineConfig({
  // Test environment - Node.js for library testing
  test: {
    environment: 'node',
    globals: true,

    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      '**/*.{test,spec}.{js,ts}'
    ],

    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/*.d.ts'
    ],

    // Test timeout
    testTimeout: 10000,

    // Setup files
    setupFiles: ['./test-setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.{js,ts}'
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{js,ts}',
        'src/**/*.spec.{js,ts}',
        'src/**/__tests__/**',
        'src/index.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      // Exclude external dependencies and test files from coverage
      all: true
    },

    // Reporter configuration
    reporters: process.env.CI ? ['verbose', 'github-actions'] : ['verbose'],

    // Bail out after first test failure in CI
    bail: process.env.CI ? 1 : 0,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks after each test
    restoreMocks: true
  },

  // Resolve configuration for aliases and module resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@axilo/core': path.resolve(__dirname, './src')
    }
  },

  // ESBuild configuration for faster compilation
  esbuild: {
    target: 'node18',
    platform: 'node'
  }
});
