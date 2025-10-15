/**
 * AXILO Core Package - Test Setup
 *
 * This file configures the testing environment for the core package.
 * It runs before all tests and sets up global test utilities, mocks,
 * and environment configuration.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { Logger, LogLevel } from './src/logger';
import { StringUtils, ObjectUtils, FileUtils, ProcessUtils } from './src/utils';
import { Errors, ErrorHandler, AxiloError } from './src/errors';

// Test environment configuration
const TEST_ENV = {
  NODE_ENV: 'test',
  LOG_LEVEL: 'error', // Reduce noise in tests
  AXILO_VERSION: '0.1.0-test'
};

// Global test utilities
declare global {
  var testUtils: {
    logger: Logger;
    generateTestId: () => string;
    createMockError: (code?: string, message?: string) => Error;
    wait: (ms: number) => Promise<void>;
    cleanup: () => Promise<void>;
  };
}

/**
 * Test utilities object available globally in tests
 */
const testUtils = {
  logger: Logger.getInstance(),

  /**
   * Generate a unique test ID
   */
  generateTestId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Create a mock error for testing
   */
  createMockError(code?: string, message?: string): Error {
    const error = new Error(message || 'Mock error for testing');
    if (code) {
      (error as any).code = code;
    }
    return error;
  },

  /**
   * Wait for specified milliseconds
   */
  wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Cleanup function for tests
   */
  async cleanup(): Promise<void> {
    // Reset logger context
    testUtils.logger.setContext({});

    // Clear any temporary files or state
    // Add cleanup logic here as needed
  }
};

// Make testUtils globally available
(globalThis as any).testUtils = testUtils;

/**
 * Setup function that runs before all tests
 */
beforeAll(async () => {
  // Set test environment variables
  Object.entries(TEST_ENV).forEach(([key, value]) => {
    process.env[key] = value;
  });

  // Configure logger for testing
  testUtils.logger.setContext({
    environment: 'test',
    package: 'core'
  });

  testUtils.logger.info('🧪 Starting AXILO Core package tests');

  // Initialize any global test state
  // Add global setup logic here
});

/**
 * Cleanup function that runs after all tests
 */
afterAll(async () => {
  testUtils.logger.info('✅ AXILO Core package tests completed');

  // Clean up global test state
  await testUtils.cleanup();
});

/**
 * Setup function that runs before each test
 */
beforeEach(() => {
  // Reset logger context for each test
  testUtils.logger.setContext({
    test: 'test-case',
    environment: 'test'
  });

  // Clear any test-specific state
  // Add per-test setup logic here
});

/**
 * Cleanup function that runs after each test
 */
afterEach(async () => {
  // Clean up after each test
  await testUtils.cleanup();

  // Reset any global state that might affect other tests
  // Add per-test cleanup logic here
});

/**
 * Global test helpers and utilities
 */

// Mock implementations for testing
export const mocks = {
  /**
   * Mock file system operations
   */
  fileSystem: {
    readFile: async (path: string): Promise<string> => {
      throw new Error(`Mock: File not found: ${path}`);
    },

    writeFile: async (path: string, content: string): Promise<void> => {
      testUtils.logger.debug(`Mock: Writing to ${path}`);
    },

    exists: async (path: string): Promise<boolean> => {
      return false;
    }
  },

  /**
   * Mock process execution
   */
  process: {
    exec: async (command: string): Promise<{ stdout: string; stderr: string }> => {
      return {
        stdout: `Mock execution of: ${command}`,
        stderr: ''
      };
    }
  },

  /**
   * Mock external dependencies
   */
  dependencies: {
    axios: {
      get: async (url: string) => ({ data: `Mock response for ${url}` }),
      post: async (url: string, data: any) => ({ data: { success: true, ...data } })
    },

    fs: {
      promises: {
        readFile: async (path: string) => `Mock content for ${path}`,
        writeFile: async (path: string, content: string) => {},
        access: async (path: string) => {},
        readdir: async (path: string) => []
      }
    }
  }
};

// Test data factories
export const factories = {
  /**
   * Create test configuration object
   */
  config(overrides?: Partial<any>) {
    return {
      version: '0.1.0',
      apiKey: 'test-api-key',
      model: 'gpt-4',
      environment: 'test',
      logLevel: 'debug',
      ...overrides
    };
  },

  /**
   * Create test extension info
   */
  extension(overrides?: Partial<any>) {
    return {
      name: 'test-extension',
      version: '1.0.0',
      description: 'Test extension for testing',
      author: 'Test Author',
      commands: ['test-command'],
      hooks: ['test-hook'],
      ...overrides
    };
  },

  /**
   * Create test error
   */
  error(code?: string, message?: string, overrides?: any) {
    return new (Errors as any)[code ? `${code.toLowerCase()}Error` : 'generic'](
      message || 'Test error',
      overrides
    );
  }
};

// Test assertions and helpers
export const helpers = {
  /**
   * Assert that a function throws an error with specific code
   */
  async expectError<T>(
    fn: () => Promise<T>,
    errorCode?: string,
    message?: string
  ): Promise<Error> {
    try {
      await fn();
      throw new Error('Expected function to throw an error');
    } catch (error) {
      if (errorCode && (error as any).code !== errorCode) {
        throw new Error(`Expected error code ${errorCode}, got ${(error as any).code}`);
      }
      if (message && !(error as Error).message.includes(message)) {
        throw new Error(`Expected error message to contain "${message}", got "${(error as Error).message}"`);
      }
      return error as Error;
    }
  },

  /**
   * Assert that a value is a valid UUID
   */
  expectValidUUID(value: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error(`Expected valid UUID, got: ${value}`);
    }
  },

  /**
   * Assert that a value is a valid email
   */
  expectValidEmail(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`Expected valid email, got: ${value}`);
    }
  },

  /**
   * Assert that an object has all required properties
   */
  expectHasProperties(obj: any, properties: string[]): void {
    properties.forEach(prop => {
      if (!(prop in obj)) {
        throw new Error(`Expected object to have property '${prop}'`);
      }
    });
  }
};

// Performance testing helpers
export const performance = {
  /**
   * Measure execution time of a function
   */
  async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;

    return { result, duration };
  },

  /**
   * Assert that function executes within time limit
   */
  async expectWithinTime<T>(
    fn: () => Promise<T>,
    maxDuration: number,
    description?: string
  ): Promise<T> {
    const { result, duration } = await this.measureTime(fn);

    if (duration > maxDuration) {
      throw new Error(
        `Expected ${description || 'function'} to complete within ${maxDuration}ms, took ${duration}ms`
      );
    }

    return result;
  }
};
