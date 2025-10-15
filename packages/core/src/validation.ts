import { z } from 'zod';
import { Errors } from './errors';

/**
 * Validation utilities for AXILO ecosystem
 */

// Base validation schemas
export const ValidationSchemas = {
  // String validations
  nonEmptyString: z.string().min(1, 'String cannot be empty'),
  email: z.string().email('Invalid email format'),
  url: z.string().url('Invalid URL format'),
  uuid: z.string().uuid('Invalid UUID format'),

  // Version validation
  semver: z.string().regex(/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?$/, 'Invalid semantic version'),

  // File path validation
  filePath: z.string().min(1, 'File path cannot be empty'),
  absolutePath: z.string().refine(path => path.startsWith('/'), 'Path must be absolute'),

  // Command validation
  commandName: z.string().regex(/^[a-z][a-z0-9-]*$/, 'Command name must be kebab-case'),

  // Configuration validation
  axiloConfig: z.object({
    version: z.string().default('0.1.0'),
    apiKey: z.string().optional(),
    model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet']).default('gpt-4'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().positive().default(2000),
    environment: z.enum(['development', 'production', 'test']).default('development'),
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info')
  }),

  // Extension validation
  extensionInfo: z.object({
    name: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+/),
    description: z.string().min(1),
    author: z.string().min(1),
    commands: z.array(z.string()).default([]),
    hooks: z.array(z.string()).default([])
  }),

  // VS Code extension validation
  vscodeConfig: z.object({
    apiKey: z.string().optional(),
    model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet']).default('gpt-4'),
    autoComplete: z.boolean().default(true),
    codeReview: z.boolean().default(false)
  })
};

/**
 * Validation utility class
 */
export class Validator {
  /**
   * Validate data against a schema
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.input
        }));

        throw Errors.validation(
          `Validation failed${context ? ` for ${context}` : ''}`,
          { errors: details, originalError: error }
        );
      }

      throw Errors.validation(
        `Validation error${context ? ` for ${context}` : ''}: ${error.message}`,
        { originalError: error }
      );
    }
  }

  /**
   * Safely validate data (returns result object)
   */
  static safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true; data: T
  } | {
    success: false; errors: z.ZodError
  } {
    const result = schema.safeParse(data);
    return result;
  }

  /**
   * Validate AXILO configuration
   */
  static validateAxiloConfig(config: unknown): import('./types').AxiloConfig {
    return this.validate(ValidationSchemas.axiloConfig, config, 'AXILO configuration');
  }

  /**
   * Validate extension information
   */
  static validateExtensionInfo(info: unknown): import('./types').ExtensionInfo {
    return this.validate(ValidationSchemas.extensionInfo, info, 'extension information');
  }

  /**
   * Validate VS Code configuration
   */
  static validateVSCodeConfig(config: unknown) {
    return this.validate(ValidationSchemas.vscodeConfig, config, 'VS Code configuration');
  }

  /**
   * Validate file path
   */
  static validateFilePath(filePath: unknown): string {
    return this.validate(ValidationSchemas.filePath, filePath, 'file path');
  }

  /**
   * Validate command name
   */
  static validateCommandName(name: unknown): string {
    return this.validate(ValidationSchemas.commandName, name, 'command name');
  }

  /**
   * Validate email address
   */
  static validateEmail(email: unknown): string {
    return this.validate(ValidationSchemas.email, email, 'email address');
  }

  /**
   * Validate URL
   */
  static validateUrl(url: unknown): string {
    return this.validate(ValidationSchemas.url, url, 'URL');
  }

  /**
   * Validate UUID
   */
  static validateUuid(uuid: unknown): string {
    return this.validate(ValidationSchemas.uuid, uuid, 'UUID');
  }

  /**
   * Validate semantic version
   */
  static validateSemver(version: unknown): string {
    return this.validate(ValidationSchemas.semver, version, 'semantic version');
  }
}

/**
 * Common validation functions
 */
export const validate = {
  /**
   * Validate that a value is not null or undefined
   */
  required<T>(value: T | null | undefined, fieldName: string): T {
    if (value === null || value === undefined) {
      throw Errors.validation(`${fieldName} is required`, { field: fieldName });
    }
    return value;
  },

  /**
   * Validate array length
   */
  arrayLength<T>(array: T[], min?: number, max?: number, fieldName?: string): T[] {
    if (min !== undefined && array.length < min) {
      throw Errors.validation(
        `${fieldName || 'Array'} must have at least ${min} items`,
        { field: fieldName, length: array.length, min }
      );
    }

    if (max !== undefined && array.length > max) {
      throw Errors.validation(
        `${fieldName || 'Array'} must have at most ${max} items`,
        { field: fieldName, length: array.length, max }
      );
    }

    return array;
  },

  /**
   * Validate string length
   */
  stringLength(str: string, min?: number, max?: number, fieldName?: string): string {
    if (min !== undefined && str.length < min) {
      throw Errors.validation(
        `${fieldName || 'String'} must be at least ${min} characters`,
        { field: fieldName, length: str.length, min }
      );
    }

    if (max !== undefined && str.length > max) {
      throw Errors.validation(
        `${fieldName || 'String'} must be at most ${max} characters`,
        { field: fieldName, length: str.length, max }
      );
    }

    return str;
  },

  /**
   * Validate numeric range
   */
  numberRange(num: number, min?: number, max?: number, fieldName?: string): number {
    if (min !== undefined && num < min) {
      throw Errors.validation(
        `${fieldName || 'Number'} must be at least ${min}`,
        { field: fieldName, value: num, min }
      );
    }

    if (max !== undefined && num > max) {
      throw Errors.validation(
        `${fieldName || 'Number'} must be at most ${max}`,
        { field: fieldName, value: num, max }
      );
    }

    return num;
  }
};
