import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { EditorSettingsManager, GlobalEditorSettings, EditorType } from '../editors/editorSettingsManager';
import { Logger } from '../../core/src/logger';

/**
 * Configuration state interface
 */
export interface ConfigState {
  // Global settings
  global: GlobalEditorSettings;

  // UI preferences
  ui: {
    theme: 'light' | 'dark' | 'auto';
    layout: 'default' | 'compact' | 'fullscreen';
    animations: boolean;
    sound: boolean;
    showTips: boolean;
    confirmOnExit: boolean;
  };

  // Editor defaults
  editorDefaults: {
    defaultType: EditorType;
    fontSize: number;
    tabSize: number;
    insertSpaces: boolean;
    wordWrap: boolean;
    autoSave: boolean;
    autoSaveDelay: number;
  };

  // System settings
  system: {
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    maxLogSize: number;
    autoUpdate: boolean;
  };

  // Network settings
  network: {
    apiTimeout: number;
    retryAttempts: number;
    retryDelay: number;
    enableCompression: boolean;
    customEndpoints: Record<string, string>;
  };

  // Performance settings
  performance: {
    debounceDelay: number;
    maxFileSize: number;
    enableVirtualization: boolean;
    cacheSize: number;
  };

  // Accessibility settings
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
    colorBlindMode: boolean;
  };
}

/**
 * Configuration action types
 */
type ConfigAction =
  | { type: 'LOAD_CONFIG'; payload: Partial<ConfigState> }
  | { type: 'UPDATE_GLOBAL'; payload: Partial<GlobalEditorSettings> }
  | { type: 'UPDATE_UI'; payload: Partial<ConfigState['ui']> }
  | { type: 'UPDATE_EDITOR_DEFAULTS'; payload: Partial<ConfigState['editorDefaults']> }
  | { type: 'UPDATE_SYSTEM'; payload: Partial<ConfigState['system']> }
  | { type: 'UPDATE_NETWORK'; payload: Partial<ConfigState['network']> }
  | { type: 'UPDATE_PERFORMANCE'; payload: Partial<ConfigState['performance']> }
  | { type: 'UPDATE_ACCESSIBILITY'; payload: Partial<ConfigState['accessibility']> }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'IMPORT_CONFIG'; payload: ConfigState }
  | { type: 'SET_CONFIG_VALUE'; payload: { section: keyof ConfigState; key: string; value: any } };

/**
 * Default configuration state
 */
const defaultConfigState: ConfigState = {
  global: {
    defaultEditorType: EditorType.TEXT,
    theme: 'auto',
    keybindings: {},
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    },
    performance: {
      debounceDelay: 300,
      maxFileSize: 1048576, // 1MB
      enableVirtualization: true
    }
  },

  ui: {
    theme: 'auto',
    layout: 'default',
    animations: true,
    sound: false,
    showTips: true,
    confirmOnExit: true
  },

  editorDefaults: {
    defaultType: EditorType.TEXT,
    fontSize: 14,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: true,
    autoSave: true,
    autoSaveDelay: 1000
  },

  system: {
    enableAnalytics: false,
    enableErrorReporting: true,
    logLevel: 'info',
    maxLogSize: 10485760, // 10MB
    autoUpdate: false
  },

  network: {
    apiTimeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    enableCompression: true,
    customEndpoints: {}
  },

  performance: {
    debounceDelay: 300,
    maxFileSize: 1048576, // 1MB
    enableVirtualization: true,
    cacheSize: 10485760 // 10MB
  },

  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    fontSize: 'medium',
    colorBlindMode: false
  }
};

/**
 * Configuration reducer
 */
function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case 'LOAD_CONFIG':
      return { ...state, ...action.payload };

    case 'UPDATE_GLOBAL':
      return {
        ...state,
        global: { ...state.global, ...action.payload }
      };

    case 'UPDATE_UI':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload }
      };

    case 'UPDATE_EDITOR_DEFAULTS':
      return {
        ...state,
        editorDefaults: { ...state.editorDefaults, ...action.payload }
      };

    case 'UPDATE_SYSTEM':
      return {
        ...state,
        system: { ...state.system, ...action.payload }
      };

    case 'UPDATE_NETWORK':
      return {
        ...state,
        network: { ...state.network, ...action.payload }
      };

    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        performance: { ...state.performance, ...action.payload }
      };

    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        accessibility: { ...state.accessibility, ...action.payload }
      };

    case 'RESET_TO_DEFAULTS':
      return defaultConfigState;

    case 'IMPORT_CONFIG':
      return action.payload;

    case 'SET_CONFIG_VALUE':
      const { section, key, value } = action.payload;
      return {
        ...state,
        [section]: {
          ...(state[section] as any),
          [key]: value
        }
      };

    default:
      return state;
  }
}

/**
 * ConfigContext interface
 */
export interface ConfigContextType {
  // State
  config: ConfigState;

  // Global settings actions
  updateGlobalSettings: (settings: Partial<GlobalEditorSettings>) => Promise<void>;
  getGlobalSettings: () => GlobalEditorSettings;

  // UI settings actions
  updateUISettings: (settings: Partial<ConfigState['ui']>) => void;
  getUISettings: () => ConfigState['ui'];

  // Editor settings actions
  updateEditorDefaults: (settings: Partial<ConfigState['editorDefaults']>) => void;
  getEditorDefaults: () => ConfigState['editorDefaults'];

  // System settings actions
  updateSystemSettings: (settings: Partial<ConfigState['system']>) => void;
  getSystemSettings: () => ConfigState['system'];

  // Network settings actions
  updateNetworkSettings: (settings: Partial<ConfigState['network']>) => void;
  getNetworkSettings: () => ConfigState['network'];

  // Performance settings actions
  updatePerformanceSettings: (settings: Partial<ConfigState['performance']>) => void;
  getPerformanceSettings: () => ConfigState['performance'];

  // Accessibility settings actions
  updateAccessibilitySettings: (settings: Partial<ConfigState['accessibility']>) => void;
  getAccessibilitySettings: () => ConfigState['accessibility'];

  // Utility actions
  setConfigValue: (section: keyof ConfigState, key: string, value: any) => void;
  resetToDefaults: () => void;
  importConfig: (config: ConfigState) => void;
  exportConfig: () => ConfigState;

  // Computed values
  getTheme: () => 'light' | 'dark';
  getEffectiveTheme: () => 'light' | 'dark';
  isAccessibilityEnabled: (feature: keyof ConfigState['accessibility']) => boolean;
  getPerformanceMetric: (metric: keyof ConfigState['performance']) => number;
}

/**
 * Create the configuration context
 */
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * ConfigProvider component props
 */
interface ConfigProviderProps {
  children: ReactNode;
  initialConfig?: Partial<ConfigState>;
  settingsManager?: EditorSettingsManager;
}

/**
 * Configuration context provider
 */
export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  initialConfig = {},
  settingsManager
}) => {
  const [config, dispatch] = useReducer(configReducer, {
    ...defaultConfigState,
    ...initialConfig
  });

  // Use provided settings manager or get default instance
  const settingsManagerInstance = settingsManager || EditorSettingsManager.getInstance();

  /**
   * Initialize configuration from settings manager
   */
  useEffect(() => {
    const initializeConfig = async () => {
      try {
        await settingsManagerInstance.initialize();

        // Load global settings from settings manager
        const globalSettings = settingsManagerInstance.getGlobalSettings();

        dispatch({
          type: 'UPDATE_GLOBAL',
          payload: globalSettings
        });

        Logger.getInstance().debug('Configuration initialized from settings manager');
      } catch (error) {
        Logger.getInstance().warn('Failed to initialize configuration from settings manager', error as Error);
      }
    };

    initializeConfig();
  }, [settingsManagerInstance]);

  /**
   * Action dispatchers
   */
  const updateGlobalSettings = useCallback(async (settings: Partial<GlobalEditorSettings>) => {
    try {
      await settingsManagerInstance.updateGlobalSettings(settings);

      dispatch({
        type: 'UPDATE_GLOBAL',
        payload: settings
      });

      Logger.getInstance().debug('Global settings updated');
    } catch (error) {
      Logger.getInstance().error('Failed to update global settings', error as Error);
      throw error;
    }
  }, [settingsManagerInstance]);

  const updateUISettings = useCallback((settings: Partial<ConfigState['ui']>) => {
    dispatch({
      type: 'UPDATE_UI',
      payload: settings
    });
  }, []);

  const updateEditorDefaults = useCallback((settings: Partial<ConfigState['editorDefaults']>) => {
    dispatch({
      type: 'UPDATE_EDITOR_DEFAULTS',
      payload: settings
    });
  }, []);

  const updateSystemSettings = useCallback((settings: Partial<ConfigState['system']>) => {
    dispatch({
      type: 'UPDATE_SYSTEM',
      payload: settings
    });
  }, []);

  const updateNetworkSettings = useCallback((settings: Partial<ConfigState['network']>) => {
    dispatch({
      type: 'UPDATE_NETWORK',
      payload: settings
    });
  }, []);

  const updatePerformanceSettings = useCallback((settings: Partial<ConfigState['performance']>) => {
    dispatch({
      type: 'UPDATE_PERFORMANCE',
      payload: settings
    });
  }, []);

  const updateAccessibilitySettings = useCallback((settings: Partial<ConfigState['accessibility']>) => {
    dispatch({
      type: 'UPDATE_ACCESSIBILITY',
      payload: settings
    });
  }, []);

  const setConfigValue = useCallback((section: keyof ConfigState, key: string, value: any) => {
    dispatch({
      type: 'SET_CONFIG_VALUE',
      payload: { section, key, value }
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  }, []);

  const importConfig = useCallback((newConfig: ConfigState) => {
    dispatch({
      type: 'IMPORT_CONFIG',
      payload: newConfig
    });
  }, []);

  const exportConfig = useCallback(() => {
    return { ...config };
  }, [config]);

  /**
   * Computed values
   */
  const getTheme = useCallback((): 'light' | 'dark' => {
    return config.ui.theme;
  }, [config.ui.theme]);

  const getEffectiveTheme = useCallback((): 'light' | 'dark' => {
    const theme = getTheme();
    if (theme === 'auto') {
      // In a real implementation, detect system theme
      return 'dark'; // Default fallback
    }
    return theme;
  }, [getTheme]);

  const isAccessibilityEnabled = useCallback((feature: keyof ConfigState['accessibility']) => {
    return config.accessibility[feature];
  }, [config.accessibility]);

  const getPerformanceMetric = useCallback((metric: keyof ConfigState['performance']) => {
    return config.performance[metric];
  }, [config.performance]);

  /**
   * Context value
   */
  const contextValue: ConfigContextType = {
    config,
    updateGlobalSettings,
    getGlobalSettings: () => config.global,
    updateUISettings,
    getUISettings: () => config.ui,
    updateEditorDefaults,
    getEditorDefaults: () => config.editorDefaults,
    updateSystemSettings,
    getSystemSettings: () => config.system,
    updateNetworkSettings,
    getNetworkSettings: () => config.network,
    updatePerformanceSettings,
    getPerformanceSettings: () => config.performance,
    updateAccessibilitySettings,
    getAccessibilitySettings: () => config.accessibility,
    setConfigValue,
    resetToDefaults,
    importConfig,
    exportConfig,
    getTheme,
    getEffectiveTheme,
    isAccessibilityEnabled,
    getPerformanceMetric
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook to use the configuration context
 */
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return context;
};

/**
 * Hook for accessing configuration state only
 */
export const useConfigState = (): ConfigState => {
  return useConfig().config;
};

/**
 * Hook for accessing configuration actions only
 */
export const useConfigActions = () => {
  const { config, ...actions } = useConfig();
  return actions;
};

/**
 * Hook for getting theme information
 */
export const useTheme = () => {
  const { getTheme, getEffectiveTheme } = useConfig();
  return {
    currentTheme: getTheme(),
    effectiveTheme: getEffectiveTheme(),
    isDark: getEffectiveTheme() === 'dark',
    isLight: getEffectiveTheme() === 'light',
    isAuto: getTheme() === 'auto'
  };
};

/**
 * Hook for getting accessibility settings
 */
export const useAccessibility = () => {
  const { config, isAccessibilityEnabled } = useConfig();

  return {
    settings: config.accessibility,
    isHighContrast: isAccessibilityEnabled('highContrast'),
    isReducedMotion: isAccessibilityEnabled('reducedMotion'),
    isScreenReader: isAccessibilityEnabled('screenReader'),
    fontSize: config.accessibility.fontSize,
    isColorBlindMode: isAccessibilityEnabled('colorBlindMode')
  };
};

/**
 * Hook for getting performance settings
 */
export const usePerformance = () => {
  const { getPerformanceMetric } = useConfig();

  return {
    debounceDelay: getPerformanceMetric('debounceDelay'),
    maxFileSize: getPerformanceMetric('maxFileSize'),
    enableVirtualization: getPerformanceMetric('enableVirtualization'),
    cacheSize: getPerformanceMetric('cacheSize')
  };
};

/**
 * Hook for getting editor settings
 */
export const useEditorSettings = () => {
  const { config } = useConfig();

  return {
    defaults: config.editorDefaults,
    global: config.global
  };
};

/**
 * Default export
 */
export default ConfigContext;
