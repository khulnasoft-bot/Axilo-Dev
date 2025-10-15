import { describe, it, expect } from 'vitest';
import { StringUtils, ObjectUtils, FileUtils, ProcessUtils } from '../utils';
import { AXILO_VERSION, LOG_LEVELS, COLORS } from '../constants';
import { AxiloError, Errors, ErrorHandler, ErrorCode } from '../errors';
import { Validator, ValidationSchemas } from '../validation';
import { logger, LogLevel } from '../logger';

describe('Core Package Tests', () => {
  describe('StringUtils', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(StringUtils.kebabToCamel('hello-world')).toBe('helloWorld');
      expect(StringUtils.kebabToCamel('test-string-here')).toBe('testStringHere');
      expect(StringUtils.kebabToCamel('single')).toBe('single');
    });

    it('should convert camelCase to kebab-case', () => {
      expect(StringUtils.camelToKebab('helloWorld')).toBe('hello-world');
      expect(StringUtils.camelToKebab('testStringHere')).toBe('test-string-here');
      expect(StringUtils.camelToKebab('single')).toBe('single');
    });

    it('should truncate strings with ellipsis', () => {
      expect(StringUtils.truncate('hello world', 8)).toBe('hello...');
      expect(StringUtils.truncate('short', 10)).toBe('short');
      expect(StringUtils.truncate('', 5)).toBe('');
    });

    it('should generate valid UUIDs', () => {
      const uuid1 = StringUtils.generateId();
      const uuid2 = StringUtils.generateId();

      expect(uuid1).not.toBe(uuid2);
      expect(uuid1).toMatch(/^[0-9a-f-]{36}$/);
      expect(uuid2).toMatch(/^[0-9a-f-]{36}$/);
    });
  });

  describe('ObjectUtils', () => {
    it('should deep clone objects', () => {
      const original = {
        name: 'test',
        nested: {
          value: 42,
          array: [1, 2, 3]
        },
        date: new Date('2023-01-01')
      };

      const cloned = ObjectUtils.deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.date).not.toBe(original.date);
    });

    it('should pick specific keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = ObjectUtils.pick(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('d');
    });

    it('should omit specific keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = ObjectUtils.omit(obj, ['b', 'd']);

      expect(result).toEqual({ a: 1, c: 3 });
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('d');
    });
  });

  describe('Constants', () => {
    it('should have correct version', () => {
      expect(AXILO_VERSION).toMatch(/^\d+\.\d+\.\d+/);
    });

    it('should have valid log levels', () => {
      expect(LOG_LEVELS).toHaveProperty('DEBUG');
      expect(LOG_LEVELS).toHaveProperty('INFO');
      expect(LOG_LEVELS).toHaveProperty('WARN');
      expect(LOG_LEVELS).toHaveProperty('ERROR');
      expect(LOG_LEVELS).toHaveProperty('FATAL');
    });

    it('should have color codes', () => {
      expect(COLORS.RESET).toBe('\x1b[0m');
      expect(COLORS.RED).toBe('\x1b[31m');
      expect(COLORS.GREEN).toBe('\x1b[32m');
    });
  });

  describe('Error Handling', () => {
    it('should create AxiloError with correct properties', () => {
      const error = new AxiloError(ErrorCode.VALIDATION_ERROR, 'Test error');

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Test error');
      expect(error.timestamp).toBeDefined();
      expect(error.name).toBe('AxiloError');
    });

    it('should create errors using factory functions', () => {
      const error = Errors.validation('Validation failed');

      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Validation failed');
    });

    it('should normalize unknown errors', () => {
      const unknownError = new Error('Unknown error');
      const normalized = ErrorHandler.normalizeError(unknownError);

      expect(normalized).toBeInstanceOf(AxiloError);
      expect(normalized.message).toBe('Unknown error');
    });

    it('should check error types correctly', () => {
      const error = Errors.validation('Test');

      expect(ErrorHandler.isErrorType(error, ErrorCode.VALIDATION_ERROR)).toBe(true);
      expect(ErrorHandler.isErrorType(error, ErrorCode.NETWORK_ERROR)).toBe(false);
    });

    it('should provide user-friendly error messages', () => {
      const networkError = Errors.network('Network failed');
      const userMessage = ErrorHandler.getUserMessage(networkError);

      expect(userMessage).toContain('Network connection failed');
    });
  });

  describe('Validation', () => {
    it('should validate email addresses', () => {
      expect(() => Validator.validateEmail('test@example.com')).not.toThrow();
      expect(() => Validator.validateEmail('invalid-email')).toThrow();
    });

    it('should validate UUIDs', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(() => Validator.validateUuid(validUuid)).not.toThrow();

      expect(() => Validator.validateUuid('invalid-uuid')).toThrow();
    });

    it('should validate AXILO config', () => {
      const validConfig = {
        version: '0.1.0',
        model: 'gpt-4',
        environment: 'development',
        logLevel: 'info'
      };

      expect(() => Validator.validateAxiloConfig(validConfig)).not.toThrow();

      const invalidConfig = {
        version: '0.1.0',
        model: 'invalid-model',
        environment: 'development'
      };

      expect(() => Validator.validateAxiloConfig(invalidConfig)).toThrow();
    });

    it('should safely validate data', () => {
      const validData = { email: 'test@example.com' };
      const result = Validator.safeValidate(ValidationSchemas.email, validData.email);

      expect(result.success).toBe(true);

      const invalidData = { email: 'invalid' };
      const result2 = Validator.safeValidate(ValidationSchemas.email, invalidData.email);

      expect(result2.success).toBe(false);
    });
  });

  describe('Logger', () => {
    it('should create logger instance', () => {
      const testLogger = logger;
      expect(testLogger).toBeDefined();
    });

    it('should set and use context', () => {
      logger.setContext({ test: 'context' });
      // Context is used internally, basic test to ensure it doesn't throw
      expect(() => logger.info('Test message')).not.toThrow();
    });

    it('should log at different levels', () => {
      expect(() => logger.debug('Debug message')).not.toThrow();
      expect(() => logger.info('Info message')).not.toThrow();
      expect(() => logger.warn('Warning message')).not.toThrow();
      expect(() => logger.error('Error message')).not.toThrow();
      expect(() => logger.fatal('Fatal message')).not.toThrow();
    });
  });

  describe('FileUtils', () => {
    it('should have utility methods', () => {
      expect(typeof FileUtils.exists).toBe('function');
      expect(typeof FileUtils.readJson).toBe('function');
      expect(typeof FileUtils.writeJson).toBe('function');
      expect(typeof FileUtils.findFiles).toBe('function');
    });
  });

  describe('ProcessUtils', () => {
    it('should have utility methods', () => {
      expect(typeof ProcessUtils.execCommand).toBe('function');
      expect(typeof ProcessUtils.commandExists).toBe('function');
    });
  });
});
