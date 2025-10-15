import { beforeAll, afterAll } from 'vitest';
import { setupE2EEnvironment, teardownE2EEnvironment } from './helpers/e2e-env';

// E2E test environment setup
beforeAll(async () => {
  await setupE2EEnvironment();
}, 60000);

afterAll(async () => {
  await teardownE2EEnvironment();
}, 60000);
