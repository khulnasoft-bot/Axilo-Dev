import React from 'react';
import { THEMES } from './constants';

/**
 * App context interface
 */
export interface AppContextType {
  // State
  currentCommand: string | null;
  commandHistory: string[];
  isLoading: boolean;
  error: string | null;
  theme: typeof THEMES.DEFAULT;
  width: number;
  height: number;

  // Actions
  executeCommand: (command: string) => Promise<void>;
  setCurrentCommand: (command: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utilities
  isRawModeSupported: boolean;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Default context value
 */
const defaultContext: AppContextType = {
  currentCommand: null,
  commandHistory: [],
  isLoading: false,
  error: null,
  theme: THEMES.DEFAULT,
  width: 80,
  height: 24,
  executeCommand: async () => {},
  setCurrentCommand: () => {},
  setError: () => {},
  clearError: () => {},
  isRawModeSupported: false,
  dimensions: { width: 80, height: 24 }
};

/**
 * React context for AXILO CLI app state
 */
export const AppContext = React.createContext<AppContextType>(defaultContext);

/**
 * Hook to use app context
 */
export const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContext.Provider');
  }

  return context;
};
