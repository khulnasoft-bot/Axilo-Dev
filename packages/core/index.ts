/**
 * AXILO Core Package - Main Entry Point
 *
 * This is the main entry point for the @axilo/core package.
 * It provides a clean, consistent public API for all core functionality
 * that other AXILO packages and applications can import and use.
 *
 * @package @axilo/core
 * @version 0.1.0
 * @description Core utilities, types, and shared functionality for AXILO CLI ecosystem
 */

// ============================================================================
// Package Metadata
// ============================================================================

export const PACKAGE_INFO = {
  name: '@axilo/core',
  version: '0.1.0',
  description: 'Core utilities, types, and shared functionality for AXILO CLI ecosystem',
  author: 'AXILO Team',
  license: 'MIT',
  repository: 'https://github.com/axilo/axilo',
  homepage: 'https://github.com/axilo/axilo#readme'
} as const;

// ============================================================================
// Core Exports - Public API
// ============================================================================

// Re-export all types and interfaces
export * from './src/types';

// Re-export all utility functions
export * from './src/utils';

// Re-export all constants
export * from './src/constants';

// Re-export error handling
export * from './src/errors';

// Re-export validation utilities
export * from './src/validation';

// Re-export logging utilities
export * from './src/logger';

// ============================================================================
// Convenience Re-exports
// ============================================================================

// Commonly used types
export type {
  AxiloConfig,
  CommandResult,
  ProjectInfo,
  ExtensionInfo,
  APIResponse,
  AxiloEvent
} from './src/types';

// Commonly used utilities
export {
  StringUtils,
  ObjectUtils,
  FileUtils,
  ProcessUtils
} from './src/utils';

// Commonly used constants
export {
  AXILO_VERSION,
  MIN_NODE_VERSION,
  API_ENDPOINTS,
  DEFAULT_CONFIG,
  FILE_PATTERNS,
  COMMAND_CATEGORIES,
  EXIT_CODES,
  ERROR_MESSAGES,
  REGEX_PATTERNS,
  ENV_VARS,
  PATHS,
  HTTP_STATUS,
  COLORS,
  LOG_LEVELS,
  EXTENSION_POINTS,
  BUILD_TARGETS
} from './src/constants';

// Commonly used error classes
export {
  AxiloError,
  Errors,
  ErrorHandler
} from './src/errors';

// Commonly used validation utilities
export {
  Validator,
  ValidationSchemas,
  validate
} from './src/validation';

// Commonly used logging utilities
export {
  Logger,
  LogLevel,
  logger,
  LogUtils
} from './src/logger';

// ============================================================================
// Default Export
// ============================================================================

/**
 * Default export providing access to the entire core package API
 */
const AxiloCore = {
  // Package info
  ...PACKAGE_INFO,

  // All core functionality
  ...require('./src')
};

export default AxiloCore;

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * AXILO Core package configuration interface
 */
export interface CoreConfig {
  version?: string;
  environment?: 'development' | 'production' | 'test';
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  apiKey?: string;
  model?: string;
}

/**
 * Initialize AXILO Core with configuration
 */
export function initializeCore(config?: CoreConfig): void {

  if (config?.logLevel) {
    process.env.LOG_LEVEL = config.logLevel;
  }

  if (config?.apiKey) {
    process.env.AXILO_API_KEY = config.apiKey;
  }

  if (config?.model) {
    process.env.AXILO_MODEL = config.model;
  }
}

// ============================================================================
// Version and Health Check
// ============================================================================

/**
 * Get current package version
 */
export function getVersion(): string {
  return PACKAGE_INFO.version;
}

/**
 * Check if core package is healthy and ready
 */
export function isHealthy(): boolean {
  try {
    // Basic health checks
    const version = getVersion();
    return Boolean(version);
  } catch {
    return false;
  }
}

/**
 * Get core package health status
 */
export function getHealthStatus() {
  return {
    package: PACKAGE_INFO.name,
    version: PACKAGE_INFO.version,
    healthy: isHealthy(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    nodeVersion: process.version
  };
}
