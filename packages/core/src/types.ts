/**
 * Core types and interfaces for AXILO ecosystem
 */

// Base types
export interface AxiloConfig {
  version: string;
  apiKey?: string;
  model?: string;
  environment: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Command types
export interface CommandResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime: number;
}

// Project types
export interface ProjectInfo {
  name: string;
  version: string;
  rootDir: string;
  packageManager: 'npm' | 'pnpm' | 'yarn';
  dependencies: Record<string, string>;
}

// Extension types
export interface ExtensionInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  commands: string[];
  hooks?: string[];
}

// API types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Event types
export interface AxiloEvent<T = any> {
  type: string;
  payload: T;
  timestamp: string;
  source: string;
}
