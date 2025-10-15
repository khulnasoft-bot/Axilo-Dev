import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useApp, useInput, useStdin } from 'ink';
import { AppContext } from './AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CommandRouter } from './components/CommandRouter';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AXILO_UI, COLORS, THEMES } from './constants';

/**
 * Main application state interface
 */
interface AppState {
  currentCommand: string | null;
  commandHistory: string[];
  isLoading: boolean;
  error: string | null;
  theme: keyof typeof THEMES;
  width: number;
  height: number;
}

/**
 * AXILO CLI App Container
 *
 * This is the main container component that manages the entire CLI UI.
 * It handles global state, routing, layout, and provides context to child components.
 */
export const AppContainer: React.FC = () => {
  // App state management
  const [state, setState] = useState<AppState>({
    currentCommand: null,
    commandHistory: [],
    isLoading: false,
    error: null,
    theme: 'DEFAULT',
    width: 80,
    height: 24
  });

  // Ink app and stdin hooks
  const { exit } = useApp();
  const { isRawModeSupported } = useStdin();

  /**
   * Update terminal dimensions
   */
  const updateDimensions = useCallback(() => {
    const width = process.stdout.columns || 80;
    const height = process.stdout.rows || 24;

    setState(prev => ({
      ...prev,
      width,
      height
    }));
  }, []);

  /**
   * Handle terminal resize
   */
  useEffect(() => {
    updateDimensions();

    const handleResize = () => updateDimensions();
    process.stdout.on('resize', handleResize);

    return () => {
      process.stdout.off('resize', handleResize);
    };
  }, [updateDimensions]);

  /**
   * Global keyboard shortcuts
   */
  useInput((input, key) => {
    // Global shortcuts
    if (key.ctrl && input === 'c') {
      // Graceful exit
      exit();
      return;
    }

    if (key.ctrl && input === 'l') {
      // Clear screen (simulated)
      console.clear();
      return;
    }

    if (input === '?') {
      // Show help
      setState(prev => ({
        ...prev,
        currentCommand: 'help'
      }));
      return;
    }
  });

  /**
   * Execute a command
   */
  const executeCommand = useCallback(async (command: string) => {
    setState(prev => ({
      ...prev,
      currentCommand: command,
      isLoading: true,
      error: null,
      commandHistory: [...prev.commandHistory.slice(-9), command] // Keep last 10 commands
    }));

    try {
      // Simulate command execution (in real implementation, this would call the CLI logic)
      await new Promise(resolve => setTimeout(resolve, 100));

      setState(prev => ({
        ...prev,
        isLoading: false,
        currentCommand: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }, []);

  /**
   * Set current command/view
   */
  const setCurrentCommand = useCallback((command: string | null) => {
    setState(prev => ({
      ...prev,
      currentCommand: command
    }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error
    }));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Get current theme colors
   */
  const theme = THEMES[state.theme];

  /**
   * App context value
   */
  const contextValue = {
    // State
    ...state,

    // Actions
    executeCommand,
    setCurrentCommand,
    setError,
    clearError,

    // Utilities
    theme,
    isRawModeSupported,

    // Layout info
    dimensions: {
      width: state.width,
      height: state.height
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <ErrorBoundary>
        <Box flexDirection="column" height={state.height}>
          {/* Header */}
          <Header />

          {/* Main content area */}
          <Box flexDirection="column" flexGrow={1} paddingX={2}>
            {state.isLoading ? (
              <LoadingSpinner message="Processing..." />
            ) : state.error ? (
              <ErrorDisplay error={state.error} onDismiss={clearError} />
            ) : (
              <CommandRouter currentCommand={state.currentCommand} />
            )}
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </ErrorBoundary>
    </AppContext.Provider>
  );
};

/**
 * Error display component
 */
interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  useInput((input, key) => {
    if (key.escape || input === 'q' || (key.ctrl && input === 'c')) {
      onDismiss();
    }
  });

  return (
    <Box flexDirection="column" padding={2} borderStyle="single" borderColor="red">
      <Box marginBottom={1}>
        <Text color="red" bold>
          {AXILO_UI.ERROR} Error
        </Text>
      </Box>

      <Text color="red" wrap="wrap">
        {error}
      </Text>

      <Box marginTop={1}>
        <Text color="yellow" dimColor>
          Press ESC or 'q' to continue, Ctrl+C to exit
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Default export for the app container
 */
export default AppContainer;
