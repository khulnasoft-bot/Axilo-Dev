import { LOG_LEVELS, COLORS } from './constants';
import { AxiloError, ErrorHandler } from './errors';

/**
 * Logging utilities for AXILO ecosystem
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: AxiloError;
}

/**
 * Logger class for consistent logging across AXILO
 */
export class Logger {
  private static instance: Logger;
  private currentLevel: LogLevel;
  private context: Record<string, any> = {};

  private constructor() {
    this.currentLevel = this.getLevelFromEnv();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set log level from environment or default
   */
  private getLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    const validLevels = Object.values(LogLevel);

    if (envLevel && validLevels.includes(envLevel)) {
      return envLevel;
    }

    return process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  }

  /**
   * Set global context for all log entries
   */
  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Add context for a specific log entry
   */
  private addContext(entryContext?: Record<string, any>): Record<string, any> {
    return { ...this.context, ...entryContext };
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
  }

  /**
   * Format log entry for output
   */
  private formatEntry(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';

    let formatted = `[${timestamp}] ${level} ${entry.message}${contextStr}`;

    if (entry.error) {
      formatted += `\n  Error: ${entry.error.message}`;
      if (entry.error.code) {
        formatted += ` (${entry.error.code})`;
      }
      if (entry.error.stack && this.currentLevel === LogLevel.DEBUG) {
        formatted += `\n  Stack: ${entry.error.stack}`;
      }
    }

    return formatted;
  }

  /**
   * Write log entry to appropriate output
   */
  private writeEntry(entry: LogEntry): void {
    const formatted = this.formatEntry(entry);
    const color = this.getColorForLevel(entry.level);

    if (color) {
      console.log(`${color}${formatted}${COLORS.RESET}`);
    } else {
      console.log(formatted);
    }

    // In production, you might want to write to a file or external service
    if (process.env.NODE_ENV === 'production' && entry.level === LogLevel.ERROR) {
      this.writeToFile(entry);
    }
  }

  /**
   * Get color for log level
   */
  private getColorForLevel(level: LogLevel): string | null {
    switch (level) {
      case LogLevel.DEBUG: return COLORS.CYAN;
      case LogLevel.INFO: return COLORS.GREEN;
      case LogLevel.WARN: return COLORS.YELLOW;
      case LogLevel.ERROR: return COLORS.RED;
      case LogLevel.FATAL: return `${COLORS.BRIGHT}${COLORS.RED}`;
      default: return null;
    }
  }

  /**
   * Write error logs to file (for production)
   */
  private writeToFile(entry: LogEntry): void {
    // In a real implementation, you'd write to a log file
    // For now, we'll just ensure the method exists
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry: LogEntry = {
        level: LogLevel.DEBUG,
        message,
        timestamp: new Date().toISOString(),
        context: this.addContext(context)
      };
      this.writeEntry(entry);
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry: LogEntry = {
        level: LogLevel.INFO,
        message,
        timestamp: new Date().toISOString(),
        context: this.addContext(context)
      };
      this.writeEntry(entry);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry: LogEntry = {
        level: LogLevel.WARN,
        message,
        timestamp: new Date().toISOString(),
        context: this.addContext(context)
      };
      this.writeEntry(entry);
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: AxiloError | Error, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry: LogEntry = {
        level: LogLevel.ERROR,
        message,
        timestamp: new Date().toISOString(),
        context: this.addContext(context),
        error: error instanceof AxiloError ? error : undefined
      };
      this.writeEntry(entry);
    }
  }

  /**
   * Log fatal error message
   */
  fatal(message: string, error?: AxiloError | Error, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.FATAL)) {
      const entry: LogEntry = {
        level: LogLevel.FATAL,
        message,
        timestamp: new Date().toISOString(),
        context: this.addContext(context),
        error: error instanceof AxiloError ? error : undefined
      };
      this.writeEntry(entry);
    }
  }
}

/**
 * Convenience functions for logging
 */
export const logger = Logger.getInstance();

/**
 * Log utilities for common patterns
 */
export class LogUtils {
  /**
   * Log function execution start
   */
  static startExecution(functionName: string, context?: Record<string, any>): void {
    logger.debug(`Starting execution of ${functionName}`, { function: functionName, ...context });
  }

  /**
   * Log function execution completion
   */
  static endExecution(functionName: string, duration?: number, context?: Record<string, any>): void {
    const message = `Completed execution of ${functionName}`;
    const logContext = { function: functionName, ...context };

    if (duration !== undefined) {
      logger.debug(`${message} in ${duration}ms`, { ...logContext, duration });
    } else {
      logger.debug(message, logContext);
    }
  }

  /**
   * Log API request
   */
  static logApiRequest(method: string, url: string, context?: Record<string, any>): void {
    logger.debug(`API Request: ${method} ${url}`, { method, url, ...context });
  }

  /**
   * Log API response
   */
  static logApiResponse(status: number, url: string, duration?: number, context?: Record<string, any>): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    const message = `API Response: ${status} from ${url}`;

    if (duration !== undefined) {
      logger.log(level, `${message} in ${duration}ms`, { status, url, duration, ...context });
    } else {
      logger.log(level, message, { status, url, ...context });
    }
  }

  /**
   * Log file operation
   */
  static logFileOperation(operation: string, filePath: string, context?: Record<string, any>): void {
    logger.debug(`File ${operation}: ${filePath}`, { operation, filePath, ...context });
  }

  /**
   * Log configuration loading
   */
  static logConfigLoad(configPath: string, success: boolean, context?: Record<string, any>): void {
    const message = `Configuration ${success ? 'loaded' : 'failed to load'} from ${configPath}`;
    const level = success ? LogLevel.INFO : LogLevel.ERROR;

    logger.log(level, message, { configPath, success, ...context });
  }
}
