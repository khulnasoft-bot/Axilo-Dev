import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';
import { FileUtils } from '../../core/src/utils';
import { Errors, ErrorHandler } from '../../core/src/errors';
import { Logger } from '../../core/src/logger';

/**
 * Editor Settings Manager for AXILO CLI
 *
 * Manages configuration and preferences for interactive editor components
 * within the CLI's user interface, including validation, persistence,
 * and real-time settings application.
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Editor types supported by the CLI
 */
export enum EditorType {
  TEXT = 'text',
  CODE = 'code',
  JSON = 'json',
  YAML = 'yaml',
  MARKDOWN = 'markdown',
  CONFIG = 'config',
  MULTILINE = 'multiline'
}

/**
 * Base editor settings interface
 */
export interface BaseEditorSettings {
  type: EditorType;
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
}

/**
 * Text editor specific settings
 */
export interface TextEditorSettings extends BaseEditorSettings {
  type: EditorType.TEXT;
  syntaxHighlighting: boolean;
  autoComplete: boolean;
  spellCheck: boolean;
  lineHeight: number;
}

/**
 * Code editor specific settings
 */
export interface CodeEditorSettings extends BaseEditorSettings {
  type: EditorType.CODE;
  language: string;
  syntaxHighlighting: boolean;
  autoComplete: boolean;
  autoFormat: boolean;
  formatOnSave: boolean;
  formatOnPaste: boolean;
  bracketMatching: boolean;
  autoClosingBrackets: boolean;
  suggestOnTriggerCharacters: boolean;
}

/**
 * JSON editor specific settings
 */
export interface JsonEditorSettings extends BaseEditorSettings {
  type: EditorType.JSON;
  validateOnChange: boolean;
  formatOnSave: boolean;
  compactMode: boolean;
  sortKeys: boolean;
}

/**
 * Union type for all editor settings
 */
export type EditorSettings =
  | TextEditorSettings
  | CodeEditorSettings
  | JsonEditorSettings;

/**
 * Global editor settings configuration
 */
export interface GlobalEditorSettings {
  defaultEditorType: EditorType;
  theme: 'light' | 'dark' | 'auto';
  keybindings: Record<string, string>;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  performance: {
    debounceDelay: number;
    maxFileSize: number;
    enableVirtualization: boolean;
  };
}

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Zod schemas for settings validation
 */
export const EditorSettingsSchemas = {
  base: z.object({
    type: z.nativeEnum(EditorType),
    theme: z.enum(['light', 'dark', 'auto']),
    fontSize: z.number().min(8).max(72).default(14),
    tabSize: z.number().min(2).max(8).default(2),
    insertSpaces: z.boolean().default(true),
    wordWrap: z.boolean().default(true),
    lineNumbers: z.boolean().default(true),
    minimap: z.boolean().default(false),
    autoSave: z.boolean().default(true),
    autoSaveDelay: z.number().min(100).max(5000).default(1000)
  }),

  text: z.object({
    type: z.literal(EditorType.TEXT),
    syntaxHighlighting: z.boolean().default(true),
    autoComplete: z.boolean().default(true),
    spellCheck: z.boolean().default(false),
    lineHeight: z.number().min(1).max(3).default(1.5)
  }).merge(z.lazy(() => EditorSettingsSchemas.base)),

  code: z.object({
    type: z.literal(EditorType.CODE),
    language: z.string().default('typescript'),
    syntaxHighlighting: z.boolean().default(true),
    autoComplete: z.boolean().default(true),
    autoFormat: z.boolean().default(true),
    formatOnSave: z.boolean().default(true),
    formatOnPaste: z.boolean().default(false),
    bracketMatching: z.boolean().default(true),
    autoClosingBrackets: z.boolean().default(true),
    suggestOnTriggerCharacters: z.boolean().default(true)
  }).merge(z.lazy(() => EditorSettingsSchemas.base)),

  json: z.object({
    type: z.literal(EditorType.JSON),
    validateOnChange: z.boolean().default(true),
    formatOnSave: z.boolean().default(true),
    compactMode: z.boolean().default(false),
    sortKeys: z.boolean().default(false)
  }).merge(z.lazy(() => EditorSettingsSchemas.base)),

  global: z.object({
    defaultEditorType: z.nativeEnum(EditorType).default(EditorType.TEXT),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    keybindings: z.record(z.string()).default({}),
    accessibility: z.object({
      highContrast: z.boolean().default(false),
      reducedMotion: z.boolean().default(false),
      screenReader: z.boolean().default(false)
    }).default({}),
    performance: z.object({
      debounceDelay: z.number().min(50).max(2000).default(300),
      maxFileSize: z.number().min(1024).max(10485760).default(1048576), // 1MB default
      enableVirtualization: z.boolean().default(true)
    }).default({})
  })
};

// ============================================================================
// Settings Manager Class
// ============================================================================

/**
 * Editor Settings Manager
 *
 * Handles loading, saving, validating, and applying editor settings
 */
export class EditorSettingsManager extends EventEmitter {
  private logger = Logger.getInstance();
  private settingsPath: string;
  private globalSettings: GlobalEditorSettings;
  private editorSettings: Map<string, EditorSettings> = new Map();
  private settingsCache: Map<string, any> = new Map();
  private isInitialized = false;

  constructor(settingsPath?: string) {
    super();
    this.settingsPath = settingsPath || this.getDefaultSettingsPath();

    // Initialize with default global settings
    this.globalSettings = EditorSettingsSchemas.global.parse({});
  }

  /**
   * Initialize the settings manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadGlobalSettings();
      await this.loadAllEditorSettings();

      this.isInitialized = true;
      this.logger.info('Editor settings manager initialized');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize editor settings manager', error as Error);
      throw error;
    }
  }

  /**
   * Get default settings file path
   */
  private getDefaultSettingsPath(): string {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
    return path.join(homeDir, '.axilo', 'editor-settings.json');
  }

  /**
   * Load global settings from file
   */
  private async loadGlobalSettings(): Promise<void> {
    try {
      if (await FileUtils.exists(this.settingsPath)) {
        const settingsData = await FileUtils.readJson<Partial<GlobalEditorSettings>>(this.settingsPath);
        if (settingsData) {
          this.globalSettings = EditorSettingsSchemas.global.parse(settingsData);
          this.logger.debug('Global settings loaded from file');
        }
      } else {
        // Create default settings file
        await this.saveGlobalSettings();
        this.logger.debug('Default global settings created');
      }
    } catch (error) {
      this.logger.warn('Failed to load global settings, using defaults', error as Error);
    }
  }

  /**
   * Save global settings to file
   */
  private async saveGlobalSettings(): Promise<void> {
    try {
      await FileUtils.writeJson(this.settingsPath, this.globalSettings);
      this.logger.debug('Global settings saved to file');
    } catch (error) {
      this.logger.error('Failed to save global settings', error as Error);
      throw error;
    }
  }

  /**
   * Load settings for all editors
   */
  private async loadAllEditorSettings(): Promise<void> {
    // Implementation would load editor-specific settings
    // For now, we'll initialize with defaults
    this.logger.debug('Editor settings loaded');
  }

  /**
   * Get global editor settings
   */
  getGlobalSettings(): GlobalEditorSettings {
    return { ...this.globalSettings };
  }

  /**
   * Update global editor settings
   */
  async updateGlobalSettings(updates: Partial<GlobalEditorSettings>): Promise<void> {
    try {
      const newSettings = EditorSettingsSchemas.global.parse({
        ...this.globalSettings,
        ...updates
      });

      this.globalSettings = newSettings;
      await this.saveGlobalSettings();

      this.logger.info('Global settings updated');
      this.emit('globalSettingsUpdated', newSettings);
    } catch (error) {
      this.logger.error('Failed to update global settings', error as Error);
      throw error;
    }
  }

  /**
   * Get settings for a specific editor
   */
  getEditorSettings(editorId: string): EditorSettings | null {
    return this.editorSettings.get(editorId) || null;
  }

  /**
   * Set settings for a specific editor
   */
  async setEditorSettings(editorId: string, settings: Partial<EditorSettings>): Promise<void> {
    try {
      const existingSettings = this.editorSettings.get(editorId);
      const editorType = settings.type || existingSettings?.type || EditorType.TEXT;

      // Get appropriate schema based on editor type
      const schema = this.getSchemaForEditorType(editorType);
      const validatedSettings = schema.parse({
        ...existingSettings,
        ...settings
      });

      this.editorSettings.set(editorId, validatedSettings);

      // Save to persistent storage
      await this.saveEditorSettings(editorId, validatedSettings);

      this.logger.debug(`Settings updated for editor: ${editorId}`);
      this.emit('editorSettingsUpdated', { editorId, settings: validatedSettings });
    } catch (error) {
      this.logger.error(`Failed to update settings for editor: ${editorId}`, error as Error);
      throw error;
    }
  }

  /**
   * Get validation schema for editor type
   */
  private getSchemaForEditorType(type: EditorType) {
    switch (type) {
      case EditorType.TEXT:
        return EditorSettingsSchemas.text;
      case EditorType.CODE:
        return EditorSettingsSchemas.code;
      case EditorType.JSON:
        return EditorSettingsSchemas.json;
      default:
        return EditorSettingsSchemas.base;
    }
  }

  /**
   * Save editor settings to persistent storage
   */
  private async saveEditorSettings(editorId: string, settings: EditorSettings): Promise<void> {
    // Implementation would save to file or database
    this.settingsCache.set(editorId, settings);
  }

  /**
   * Create default settings for an editor
   */
  createDefaultSettings(type: EditorType, editorId: string): EditorSettings {
    const baseSettings = {
      type,
      theme: this.globalSettings.theme,
      fontSize: 14,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: true,
      lineNumbers: true,
      minimap: false,
      autoSave: true,
      autoSaveDelay: 1000
    };

    switch (type) {
      case EditorType.TEXT:
        return EditorSettingsSchemas.text.parse({
          ...baseSettings,
          syntaxHighlighting: true,
          autoComplete: true,
          spellCheck: false,
          lineHeight: 1.5
        });

      case EditorType.CODE:
        return EditorSettingsSchemas.code.parse({
          ...baseSettings,
          language: 'typescript',
          syntaxHighlighting: true,
          autoComplete: true,
          autoFormat: true,
          formatOnSave: true,
          formatOnPaste: false,
          bracketMatching: true,
          autoClosingBrackets: true,
          suggestOnTriggerCharacters: true
        });

      case EditorType.JSON:
        return EditorSettingsSchemas.json.parse({
          ...baseSettings,
          validateOnChange: true,
          formatOnSave: true,
          compactMode: false,
          sortKeys: false
        });

      default:
        return EditorSettingsSchemas.base.parse(baseSettings);
    }
  }

  /**
   * Validate settings against schema
   */
  validateSettings(settings: Partial<EditorSettings>): EditorSettings {
    const editorType = settings.type || EditorType.TEXT;
    const schema = this.getSchemaForEditorType(editorType);

    return schema.parse(settings);
  }

  /**
   * Get settings for a new editor instance
   */
  getSettingsForEditor(editorId: string, type: EditorType): EditorSettings {
    // Check if we have cached settings for this editor
    const cachedSettings = this.settingsCache.get(editorId);
    if (cachedSettings) {
      return cachedSettings;
    }

    // Check if we have persistent settings for this editor
    const existingSettings = this.editorSettings.get(editorId);
    if (existingSettings) {
      return existingSettings;
    }

    // Create new default settings
    const defaultSettings = this.createDefaultSettings(type, editorId);
    this.editorSettings.set(editorId, defaultSettings);

    return defaultSettings;
  }

  /**
   * Reset settings for an editor to defaults
   */
  async resetEditorSettings(editorId: string, type: EditorType): Promise<void> {
    const defaultSettings = this.createDefaultSettings(type, editorId);
    await this.setEditorSettings(editorId, defaultSettings);
  }

  /**
   * Reset all settings to defaults
   */
  async resetAllSettings(): Promise<void> {
    this.globalSettings = EditorSettingsSchemas.global.parse({});
    this.editorSettings.clear();
    this.settingsCache.clear();

    await this.saveGlobalSettings();

    this.logger.info('All settings reset to defaults');
    this.emit('allSettingsReset');
  }

  /**
   * Export current settings for backup
   */
  async exportSettings(): Promise<{
    global: GlobalEditorSettings;
    editors: Record<string, EditorSettings>;
    metadata: {
      exportedAt: string;
      version: string;
    };
  }> {
    const editors: Record<string, EditorSettings> = {};
    for (const [id, settings] of this.editorSettings) {
      editors[id] = settings;
    }

    return {
      global: this.globalSettings,
      editors,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  /**
   * Import settings from backup
   */
  async importSettings(data: {
    global?: Partial<GlobalEditorSettings>;
    editors?: Record<string, Partial<EditorSettings>>;
  }): Promise<void> {
    try {
      // Import global settings
      if (data.global) {
        await this.updateGlobalSettings(data.global);
      }

      // Import editor settings
      if (data.editors) {
        for (const [editorId, settings] of Object.entries(data.editors)) {
          await this.setEditorSettings(editorId, settings);
        }
      }

      this.logger.info('Settings imported successfully');
      this.emit('settingsImported', data);
    } catch (error) {
      this.logger.error('Failed to import settings', error as Error);
      throw error;
    }
  }

  /**
   * Get available editor types
   */
  getAvailableEditorTypes(): EditorType[] {
    return Object.values(EditorType);
  }

  /**
   * Check if settings are valid for a given editor type
   */
  isValidForEditorType(settings: Partial<EditorSettings>, type: EditorType): boolean {
    try {
      this.getSchemaForEditorType(type).parse(settings);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get settings summary for debugging
   */
  getSettingsSummary(): {
    global: GlobalEditorSettings;
    editorCount: number;
    editorTypes: EditorType[];
  } {
    const editorTypes = Array.from(new Set(
      Array.from(this.editorSettings.values()).map(s => s.type)
    ));

    return {
      global: this.globalSettings,
      editorCount: this.editorSettings.size,
      editorTypes
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Default settings manager instance
 */
let settingsManager: EditorSettingsManager | null = null;

/**
 * Get the default settings manager instance
 */
export function getSettingsManager(): EditorSettingsManager {
  if (!settingsManager) {
    settingsManager = new EditorSettingsManager();
  }
  return settingsManager;
}

/**
 * Initialize the default settings manager
 */
export async function initializeSettingsManager(settingsPath?: string): Promise<EditorSettingsManager> {
  const manager = settingsPath ? new EditorSettingsManager(settingsPath) : getSettingsManager();
  await manager.initialize();
  return manager;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create settings for a specific editor type with defaults
 */
export function createEditorSettings(
  type: EditorType,
  overrides?: Partial<EditorSettings>
): EditorSettings {
  const manager = getSettingsManager();

  switch (type) {
    case EditorType.TEXT:
      return {
        type: EditorType.TEXT,
        theme: 'auto',
        fontSize: 14,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: true,
        lineNumbers: true,
        minimap: false,
        autoSave: true,
        autoSaveDelay: 1000,
        syntaxHighlighting: true,
        autoComplete: true,
        spellCheck: false,
        lineHeight: 1.5,
        ...overrides
      };

    case EditorType.CODE:
      return {
        type: EditorType.CODE,
        theme: 'auto',
        fontSize: 14,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: true,
        lineNumbers: true,
        minimap: false,
        autoSave: true,
        autoSaveDelay: 1000,
        language: 'typescript',
        syntaxHighlighting: true,
        autoComplete: true,
        autoFormat: true,
        formatOnSave: true,
        formatOnPaste: false,
        bracketMatching: true,
        autoClosingBrackets: true,
        suggestOnTriggerCharacters: true,
        ...overrides
      };

    case EditorType.JSON:
      return {
        type: EditorType.JSON,
        theme: 'auto',
        fontSize: 14,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: true,
        lineNumbers: true,
        minimap: false,
        autoSave: true,
        autoSaveDelay: 1000,
        validateOnChange: true,
        formatOnSave: true,
        compactMode: false,
        sortKeys: false,
        ...overrides
      };

    default:
      return {
        type,
        theme: 'auto',
        fontSize: 14,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: true,
        lineNumbers: true,
        minimap: false,
        autoSave: true,
        autoSaveDelay: 1000,
        ...overrides
      };
  }
}

/**
 * Apply settings to an editor instance
 */
export function applyEditorSettings(
  editor: any,
  settings: EditorSettings
): void {
  try {
    // Apply base settings
    if (editor.setTheme) editor.setTheme(settings.theme);
    if (editor.setFontSize) editor.setFontSize(settings.fontSize);
    if (editor.setTabSize) editor.setTabSize(settings.tabSize);
    if (editor.setInsertSpaces) editor.setInsertSpaces(settings.insertSpaces);
    if (editor.setWordWrap) editor.setWordWrap(settings.wordWrap);
    if (editor.setLineNumbers) editor.setLineNumbers(settings.lineNumbers);
    if (editor.setMinimap) editor.setMinimap(settings.minimap);

    // Apply type-specific settings
    switch (settings.type) {
      case EditorType.TEXT:
        const textSettings = settings as TextEditorSettings;
        if (editor.setSyntaxHighlighting) editor.setSyntaxHighlighting(textSettings.syntaxHighlighting);
        if (editor.setAutoComplete) editor.setAutoComplete(textSettings.autoComplete);
        if (editor.setSpellCheck) editor.setSpellCheck(textSettings.spellCheck);
        if (editor.setLineHeight) editor.setLineHeight(textSettings.lineHeight);
        break;

      case EditorType.CODE:
        const codeSettings = settings as CodeEditorSettings;
        if (editor.setLanguage) editor.setLanguage(codeSettings.language);
        if (editor.setSyntaxHighlighting) editor.setSyntaxHighlighting(codeSettings.syntaxHighlighting);
        if (editor.setAutoComplete) editor.setAutoComplete(codeSettings.autoComplete);
        if (editor.setAutoFormat) editor.setAutoFormat(codeSettings.autoFormat);
        if (editor.setFormatOnSave) editor.setFormatOnSave(codeSettings.formatOnSave);
        if (editor.setBracketMatching) editor.setBracketMatching(codeSettings.bracketMatching);
        if (editor.setAutoClosingBrackets) editor.setAutoClosingBrackets(codeSettings.autoClosingBrackets);
        break;

      case EditorType.JSON:
        const jsonSettings = settings as JsonEditorSettings;
        if (editor.setValidateOnChange) editor.setValidateOnChange(jsonSettings.validateOnChange);
        if (editor.setFormatOnSave) editor.setFormatOnSave(jsonSettings.formatOnSave);
        if (editor.setCompactMode) editor.setCompactMode(jsonSettings.compactMode);
        if (editor.setSortKeys) editor.setSortKeys(jsonSettings.sortKeys);
        break;
    }
  } catch (error) {
    console.error('Failed to apply editor settings:', error);
  }
}
