/**
 * Core constants for AXILO ecosystem
 */

// Version information
export const AXILO_VERSION = '0.1.0';
export const MIN_NODE_VERSION = '18.0.0';

// API endpoints
export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1',
  ANTHROPIC: 'https://api.anthropic.com/v1',
  AXILO_API: process.env.AXILO_API_URL || 'http://localhost:3001/api'
} as const;

// Default configurations
export const DEFAULT_CONFIG = {
  MODEL: 'gpt-4',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  LOG_LEVEL: 'info'
} as const;

// File patterns
export const FILE_PATTERNS = {
  TYPESCRIPT: '**/*.{ts,tsx}',
  JAVASCRIPT: '**/*.{js,jsx}',
  MARKDOWN: '**/*.md',
  JSON: '**/*.json',
  YAML: '**/*.{yml,yaml}',
  CONFIG: '**/*.{config,conf}.{js,ts,json}',
  TEST: '**/*.{test,spec}.{js,ts}',
  SOURCE: '**/*.{js,ts,jsx,tsx}',
  DIST: '{dist,build,out}/**/*'
} as const;

// Command categories
export const COMMAND_CATEGORIES = {
  CODE_GENERATION: 'code-generation',
  CODE_ANALYSIS: 'code-analysis',
  TESTING: 'testing',
  DOCUMENTATION: 'documentation',
  DEPLOYMENT: 'deployment',
  CONFIGURATION: 'configuration',
  UTILITIES: 'utilities'
} as const;

// Exit codes
export const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  VALIDATION_ERROR: 2,
  NETWORK_ERROR: 3,
  FILE_ERROR: 4,
  CONFIG_ERROR: 5,
  DEPENDENCY_ERROR: 6,
  PERMISSION_ERROR: 7,
  TIMEOUT_ERROR: 8,
  NOT_FOUND: 9,
  ALREADY_EXISTS: 10
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred',
  NETWORK: 'Network request failed',
  FILE_NOT_FOUND: 'File not found',
  PERMISSION_DENIED: 'Permission denied',
  INVALID_CONFIG: 'Invalid configuration',
  DEPENDENCY_MISSING: 'Required dependency missing',
  TIMEOUT: 'Operation timed out',
  VALIDATION_FAILED: 'Validation failed'
} as const;

// Regular expressions
export const REGEX_PATTERNS = {
  SEMVER: /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  CAMEL_CASE: /^[a-z][a-zA-Z0-9]*$/,
  KEBAB_CASE: /^[a-z][a-z0-9-]*$/,
  SNAKE_CASE: /^[a-z][a-z0-9_]*$/
} as const;

// Environment variables
export const ENV_VARS = {
  NODE_ENV: 'NODE_ENV',
  AXILO_API_KEY: 'AXILO_API_KEY',
  AXILO_CONFIG: 'AXILO_CONFIG',
  OPENAI_API_KEY: 'OPENAI_API_KEY',
  ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
  LOG_LEVEL: 'LOG_LEVEL',
  DEBUG: 'DEBUG'
} as const;

// Common file paths
export const PATHS = {
  HOME: process.env.HOME || process.env.USERPROFILE || '~',
  TEMP: process.env.TEMP || process.env.TMPDIR || '/tmp',
  CONFIG_DIR: '.axilo',
  CACHE_DIR: '.cache/axilo',
  LOGS_DIR: 'logs'
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

// Color codes for CLI output
export const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m'
} as const;

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
} as const;

// Extension points
export const EXTENSION_POINTS = {
  COMMAND: 'command',
  HOOK: 'hook',
  PROVIDER: 'provider',
  MIDDLEWARE: 'middleware'
} as const;

// Build targets
export const BUILD_TARGETS = {
  NODE: 'node18',
  BROWSER: 'chrome58',
  ESM: 'esnext',
  COMMONJS: 'commonjs'
} as const;
