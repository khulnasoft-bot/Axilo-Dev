/**
 * Error handling utilities for AXILO ecosystem
 */

export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',

  // AXILO specific errors
  AXILO_CONFIG_ERROR = 'AXILO_CONFIG_ERROR',
  AXILO_API_ERROR = 'AXILO_API_ERROR',
  AXILO_COMMAND_ERROR = 'AXILO_COMMAND_ERROR',
  AXILO_EXTENSION_ERROR = 'AXILO_EXTENSION_ERROR',

  // VS Code specific errors
  VSCODE_NOT_FOUND = 'VSCODE_NOT_FOUND',
  VSCODE_VERSION_ERROR = 'VSCODE_VERSION_ERROR',
  VSCODE_EXTENSION_ERROR = 'VSCODE_EXTENSION_ERROR',

  // Build errors
  BUILD_ERROR = 'BUILD_ERROR',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR'
}

export interface AxiloError extends Error {
  code: ErrorCode;
  details?: any;
  cause?: Error;
  timestamp: string;
  context?: Record<string, any>;
}

/**
 * Custom error class for AXILO errors
 */
export class AxiloError extends Error implements AxiloError {
  public readonly code: ErrorCode;
  public readonly details?: any;
  public readonly cause?: Error;
  public readonly timestamp: string;
  public readonly context?: Record<string, any>;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      details?: any;
      cause?: Error;
      context?: Record<string, any>;
    }
  ) {
    super(message);
    this.name = 'AxiloError';
    this.code = code;
    this.details = options?.details;
    this.cause = options?.cause;
    this.timestamp = new Date().toISOString();
    this.context = options?.context;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AxiloError);
    }
  }

  /**
   * Convert to JSON for logging/serialization
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      cause: this.cause?.message,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }
}

/**
 * Error factory functions
 */
export const Errors = {
  /**
   * Create a generic error
   */
  generic(message: string, cause?: Error): AxiloError {
    return new AxiloError(ErrorCode.UNKNOWN_ERROR, message, { cause });
  },

  /**
   * Create a validation error
   */
  validation(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.VALIDATION_ERROR, message, { details });
  },

  /**
   * Create a network error
   */
  network(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.NETWORK_ERROR, message, { details });
  },

  /**
   * Create a file error
   */
  file(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.FILE_ERROR, message, { details });
  },

  /**
   * Create a permission error
   */
  permission(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.PERMISSION_ERROR, message, { details });
  },

  /**
   * Create an AXILO config error
   */
  config(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.AXILO_CONFIG_ERROR, message, { details });
  },

  /**
   * Create an AXILO API error
   */
  api(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.AXILO_API_ERROR, message, { details });
  },

  /**
   * Create an AXILO command error
   */
  command(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.AXILO_COMMAND_ERROR, message, { details });
  },

  /**
   * Create an AXILO extension error
   */
  extension(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.AXILO_EXTENSION_ERROR, message, { details });
  },

  /**
   * Create a VS Code not found error
   */
  vscodeNotFound(message: string = 'VS Code not found'): AxiloError {
    return new AxiloError(ErrorCode.VSCODE_NOT_FOUND, message);
  },

  /**
   * Create a VS Code version error
   */
  vscodeVersion(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.VSCODE_VERSION_ERROR, message, { details });
  },

  /**
   * Create a VS Code extension error
   */
  vscodeExtension(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.VSCODE_EXTENSION_ERROR, message, { details });
  },

  /**
   * Create a build error
   */
  build(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.BUILD_ERROR, message, { details });
  },

  /**
   * Create a dependency error
   */
  dependency(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.DEPENDENCY_ERROR, message, { details });
  },

  /**
   * Create a compilation error
   */
  compilation(message: string, details?: any): AxiloError {
    return new AxiloError(ErrorCode.COMPILATION_ERROR, message, { details });
  }
};

/**
 * Error handling utilities
 */
export class ErrorHandler {
  /**
   * Wrap a function call in error handling
   */
  static async withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AxiloError) {
        throw error;
      }

      const contextInfo = context ? { context } : undefined;
      throw Errors.generic(
        `Error in ${context || 'operation'}: ${error.message}`,
        error as Error
      );
    }
  }

  /**
   * Convert unknown error to AxiloError
   */
  static normalizeError(error: unknown, defaultMessage?: string): AxiloError {
    if (error instanceof AxiloError) {
      return error;
    }

    if (error instanceof Error) {
      return Errors.generic(error.message, error);
    }

    return Errors.generic(defaultMessage || 'Unknown error occurred', error as Error);
  }

  /**
   * Check if error is of specific type
   */
  static isErrorType(error: unknown, code: ErrorCode): boolean {
    return error instanceof AxiloError && error.code === code;
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: unknown): string {
    if (error instanceof AxiloError) {
      switch (error.code) {
        case ErrorCode.NETWORK_ERROR:
          return 'Network connection failed. Please check your internet connection.';
        case ErrorCode.PERMISSION_ERROR:
          return 'Permission denied. Please check file permissions.';
        case ErrorCode.FILE_ERROR:
          return 'File operation failed. Please check the file path.';
        case ErrorCode.VSCODE_NOT_FOUND:
          return 'VS Code not found. Please install VS Code or check your PATH.';
        case ErrorCode.VSCODE_VERSION_ERROR:
          return 'VS Code version not compatible. Please update VS Code.';
        case ErrorCode.AXILO_CONFIG_ERROR:
          return 'AXILO configuration error. Please check your AXILO.md file.';
        default:
          return error.message;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }
}
