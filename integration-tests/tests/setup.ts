import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setupTestEnvironment, teardownTestEnvironment } from './helpers/test-env';

// Global test environment setup
beforeAll(async () => {
  await setupTestEnvironment();
});

afterAll(async () => {
  await teardownTestEnvironment();
});

// Per-test setup
beforeEach(() => {
  // Reset any global state if needed
});

afterEach(() => {
  // Clean up after each test
});
