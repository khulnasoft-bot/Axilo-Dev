import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { EditorSettingsManager, EditorType } from '../editors/editorSettingsManager';
import { Logger } from '../../core/src/logger';

/**
 * Global application state interface for AXILO CLI
 */
export interface AppState {
  // Application lifecycle
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // User and session
  currentUser: {
    id: string;
    name: string;
    preferences: Record<string, any>;
  } | null;
  sessionId: string | null;
  lastActivity: number;

  // Navigation and routing
  currentView: string;
  viewHistory: string[];
  breadcrumbs: Array<{ label: string; view: string }>;

  // Command execution
  currentCommand: {
    id: string;
    command: string;
    status: 'idle' | 'running' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
    result?: any;
    error?: string;
  } | null;
  commandQueue: Array<{
    id: string;
    command: string;
    priority: 'low' | 'normal' | 'high';
  }>;

  // UI preferences
  theme: 'light' | 'dark' | 'auto';
  layout: 'default' | 'compact' | 'fullscreen';
  animations: boolean;
  sound: boolean;

  // Editor state
  activeEditor: {
    id: string;
    type: EditorType;
    filePath?: string;
    isDirty: boolean;
    lastSaved?: number;
  } | null;
  openEditors: Array<{
    id: string;
    type: EditorType;
    title: string;
    isActive: boolean;
  }>;

  // Global settings
  settings: {
    autoSave: boolean;
    confirmOnExit: boolean;
    showTips: boolean;
    enableAnalytics: boolean;
  };

  // System status
  systemInfo: {
    nodeVersion: string;
    platform: string;
    arch: string;
    memoryUsage: number;
    uptime: number;
  };

  // Network and connectivity
  connectivity: {
    isOnline: boolean;
    apiStatus: 'connected' | 'disconnected' | 'error';
    lastSync?: number;
  };
}

/**
 * Action types for state management
 */
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: AppState['currentUser'] }
  | { type: 'SET_SESSION'; payload: { sessionId: string; lastActivity: number } }
  | { type: 'NAVIGATE_TO_VIEW'; payload: { view: string; addToHistory?: boolean } }
  | { type: 'GO_BACK'; payload?: { steps?: number } }
  | { type: 'SET_BREADCRUMBS'; payload: AppState['breadcrumbs'] }
  | { type: 'EXECUTE_COMMAND'; payload: { id: string; command: string } }
  | { type: 'UPDATE_COMMAND_STATUS'; payload: { id: string; status: AppState['currentCommand']['status']; result?: any; error?: string } }
  | { type: 'COMPLETE_COMMAND'; payload: { id: string } }
  | { type: 'QUEUE_COMMAND'; payload: { id: string; command: string; priority?: 'low' | 'normal' | 'high' } }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'SET_LAYOUT'; payload: AppState['layout'] }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_ACTIVE_EDITOR'; payload: AppState['activeEditor'] }
  | { type: 'ADD_EDITOR'; payload: { id: string; type: EditorType; title: string } }
  | { type: 'REMOVE_EDITOR'; payload: string }
  | { type: 'UPDATE_EDITOR_DIRTY'; payload: { id: string; isDirty: boolean } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'UPDATE_SYSTEM_INFO'; payload: Partial<AppState['systemInfo']> }
  | { type: 'UPDATE_CONNECTIVITY'; payload: Partial<AppState['connectivity']> };

/**
 * Initial application state
 */
const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  error: null,

  currentUser: null,
  sessionId: null,
  lastActivity: Date.now(),

  currentView: 'welcome',
  viewHistory: [],
  breadcrumbs: [],

  currentCommand: null,
  commandQueue: [],

  theme: 'auto',
  layout: 'default',
  animations: true,
  sound: false,

  activeEditor: null,
  openEditors: [],

  settings: {
    autoSave: true,
    confirmOnExit: true,
    showTips: true,
    enableAnalytics: false
  },

  systemInfo: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memoryUsage: 0,
    uptime: 0
  },

  connectivity: {
    isOnline: navigator?.onLine ?? true,
    apiStatus: 'disconnected'
  }
};

/**
 * Application state reducer
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.payload.sessionId,
        lastActivity: action.payload.lastActivity
      };

    case 'NAVIGATE_TO_VIEW':
      const newHistory = action.payload.addToHistory !== false
        ? [...state.viewHistory.slice(-9), state.currentView]
        : state.viewHistory;

      return {
        ...state,
        currentView: action.payload.view,
        viewHistory: newHistory
      };

    case 'GO_BACK':
      const steps = action.payload?.steps || 1;
      const history = state.viewHistory;
      const newHistoryLength = Math.max(0, history.length - steps);

      return {
        ...state,
        currentView: history[history.length - steps] || 'welcome',
        viewHistory: history.slice(0, newHistoryLength)
      };

    case 'SET_BREADCRUMBS':
      return { ...state, breadcrumbs: action.payload };

    case 'EXECUTE_COMMAND':
      return {
        ...state,
        currentCommand: {
          id: action.payload.id,
          command: action.payload.command,
          status: 'running',
          startTime: Date.now()
        }
      };

    case 'UPDATE_COMMAND_STATUS':
      if (!state.currentCommand || state.currentCommand.id !== action.payload.id) {
        return state;
      }

      return {
        ...state,
        currentCommand: {
          ...state.currentCommand,
          status: action.payload.status,
          result: action.payload.result,
          error: action.payload.error,
          endTime: action.payload.status !== 'running' ? Date.now() : undefined
        }
      };

    case 'COMPLETE_COMMAND':
      return {
        ...state,
        currentCommand: null
      };

    case 'QUEUE_COMMAND':
      return {
        ...state,
        commandQueue: [...state.commandQueue, {
          id: action.payload.id,
          command: action.payload.command,
          priority: action.payload.priority || 'normal'
        }]
      };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_LAYOUT':
      return { ...state, layout: action.payload };

    case 'TOGGLE_ANIMATIONS':
      return { ...state, animations: !state.animations };

    case 'TOGGLE_SOUND':
      return { ...state, sound: !state.sound };

    case 'SET_ACTIVE_EDITOR':
      return { ...state, activeEditor: action.payload };

    case 'ADD_EDITOR':
      return {
        ...state,
        openEditors: [...state.openEditors, {
          id: action.payload.id,
          type: action.payload.type,
          title: action.payload.title,
          isActive: false
        }]
      };

    case 'REMOVE_EDITOR':
      return {
        ...state,
        openEditors: state.openEditors.filter(editor => editor.id !== action.payload),
        activeEditor: state.activeEditor?.id === action.payload ? null : state.activeEditor
      };

    case 'UPDATE_EDITOR_DIRTY':
      return {
        ...state,
        openEditors: state.openEditors.map(editor =>
          editor.id === action.payload.id
            ? { ...editor, isDirty: action.payload.isDirty }
            : editor
        )
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'UPDATE_SYSTEM_INFO':
      return {
        ...state,
        systemInfo: { ...state.systemInfo, ...action.payload }
      };

    case 'UPDATE_CONNECTIVITY':
      return {
        ...state,
        connectivity: { ...state.connectivity, ...action.payload }
      };

    default:
      return state;
  }
}

/**
 * AppContext interface
 */
export interface AppContextType {
  // State
  state: AppState;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  setCurrentUser: (user: AppState['currentUser']) => void;
  navigateToView: (view: string, addToHistory?: boolean) => void;
  goBack: (steps?: number) => void;
  setBreadcrumbs: (breadcrumbs: AppState['breadcrumbs']) => void;
  executeCommand: (command: string) => Promise<void>;
  queueCommand: (command: string, priority?: 'low' | 'normal' | 'high') => void;
  setTheme: (theme: AppState['theme']) => void;
  setLayout: (layout: AppState['layout']) => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  setActiveEditor: (editor: AppState['activeEditor']) => void;
  addEditor: (id: string, type: EditorType, title: string) => void;
  removeEditor: (id: string) => void;
  updateEditorDirty: (id: string, isDirty: boolean) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;

  // Utilities
  isViewActive: (view: string) => boolean;
  getActiveEditor: () => AppState['activeEditor'];
  getEditorById: (id: string) => AppState['openEditors'][0] | undefined;
  hasUnsavedChanges: () => boolean;
  getSystemHealth: () => { status: 'healthy' | 'warning' | 'error'; issues: string[] };
}

/**
 * Create the application context
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider component props
 */
interface AppProviderProps {
  children: ReactNode;
  initialState?: Partial<AppState>;
}

/**
 * Application context provider
 */
export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  initialState = {}
}) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    ...initialState
  });

  // Initialize settings manager
  const settingsManager = EditorSettingsManager.getInstance();

  /**
   * Action dispatchers
   */
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setInitialized = useCallback((initialized: boolean) => {
    dispatch({ type: 'SET_INITIALIZED', payload: initialized });
  }, []);

  const setCurrentUser = useCallback((user: AppState['currentUser']) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  }, []);

  const navigateToView = useCallback((view: string, addToHistory = true) => {
    dispatch({ type: 'NAVIGATE_TO_VIEW', payload: { view, addToHistory } });
  }, []);

  const goBack = useCallback((steps = 1) => {
    dispatch({ type: 'GO_BACK', payload: { steps } });
  }, []);

  const setBreadcrumbs = useCallback((breadcrumbs: AppState['breadcrumbs']) => {
    dispatch({ type: 'SET_BREADCRUMBS', payload: breadcrumbs });
  }, []);

  const executeCommand = useCallback(async (command: string) => {
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    dispatch({
      type: 'EXECUTE_COMMAND',
      payload: { id: commandId, command }
    });

    try {
      // Here you would integrate with the actual command execution system
      Logger.getInstance().info(`Executing command: ${command}`);

      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({
        type: 'UPDATE_COMMAND_STATUS',
        payload: { id: commandId, status: 'completed', result: { success: true } }
      });
    } catch (error) {
      dispatch({
        type: 'UPDATE_COMMAND_STATUS',
        payload: {
          id: commandId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }, []);

  const queueCommand = useCallback((command: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
    const commandId = `queued_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    dispatch({
      type: 'QUEUE_COMMAND',
      payload: { id: commandId, command, priority }
    });
  }, []);

  const setTheme = useCallback((theme: AppState['theme']) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const setLayout = useCallback((layout: AppState['layout']) => {
    dispatch({ type: 'SET_LAYOUT', payload: layout });
  }, []);

  const toggleAnimations = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const setActiveEditor = useCallback((editor: AppState['activeEditor']) => {
    dispatch({ type: 'SET_ACTIVE_EDITOR', payload: editor });
  }, []);

  const addEditor = useCallback((id: string, type: EditorType, title: string) => {
    dispatch({ type: 'ADD_EDITOR', payload: { id, type, title } });
  }, []);

  const removeEditor = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EDITOR', payload: id });
  }, []);

  const updateEditorDirty = useCallback((id: string, isDirty: boolean) => {
    dispatch({ type: 'UPDATE_EDITOR_DIRTY', payload: { id, isDirty } });
  }, []);

  const updateSettings = useCallback((settings: Partial<AppState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  /**
   * Utility functions
   */
  const isViewActive = useCallback((view: string) => {
    return state.currentView === view;
  }, [state.currentView]);

  const getActiveEditor = useCallback(() => {
    return state.activeEditor;
  }, [state.activeEditor]);

  const getEditorById = useCallback((id: string) => {
    return state.openEditors.find(editor => editor.id === id);
  }, [state.openEditors]);

  const hasUnsavedChanges = useCallback(() => {
    return state.openEditors.some(editor => editor.isDirty);
  }, [state.openEditors]);

  const getSystemHealth = useCallback(() => {
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'error' = 'healthy';

    if (state.error) {
      issues.push('Application error');
      status = 'error';
    }

    if (state.connectivity.apiStatus === 'error') {
      issues.push('API connectivity issues');
      status = status === 'healthy' ? 'warning' : 'error';
    }

    if (hasUnsavedChanges() && !state.settings.autoSave) {
      issues.push('Unsaved changes');
      status = status === 'healthy' ? 'warning' : status;
    }

    return { status, issues };
  }, [state.error, state.connectivity.apiStatus, state.settings.autoSave, hasUnsavedChanges]);

  /**
   * Update system info periodically
   */
  useEffect(() => {
    const updateSystemInfo = () => {
      const memUsage = process.memoryUsage?.().heapUsed || 0;
      const uptime = process.uptime?.() || 0;

      dispatch({
        type: 'UPDATE_SYSTEM_INFO',
        payload: {
          memoryUsage: Math.round(memUsage / 1024 / 1024), // MB
          uptime: Math.round(uptime)
        }
      });
    };

    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * Update connectivity status
   */
  useEffect(() => {
    const updateConnectivity = () => {
      // In a real implementation, this would check actual connectivity
      dispatch({
        type: 'UPDATE_CONNECTIVITY',
        payload: {
          isOnline: navigator?.onLine ?? true,
          lastSync: Date.now()
        }
      });
    };

    updateConnectivity();
    const interval = setInterval(updateConnectivity, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  /**
   * Context value
   */
  const contextValue: AppContextType = {
    state,
    setLoading,
    setError,
    setInitialized,
    setCurrentUser,
    navigateToView,
    goBack,
    setBreadcrumbs,
    executeCommand,
    queueCommand,
    setTheme,
    setLayout,
    toggleAnimations,
    toggleSound,
    setActiveEditor,
    addEditor,
    removeEditor,
    updateEditorDirty,
    updateSettings,
    isViewActive,
    getActiveEditor,
    getEditorById,
    hasUnsavedChanges,
    getSystemHealth
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook to use the application context
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};

/**
 * Hook for accessing app state only
 */
export const useAppState = (): AppState => {
  return useApp().state;
};

/**
 * Hook for accessing app actions only
 */
export const useAppActions = () => {
  const { state, ...actions } = useApp();
  return actions;
};

/**
 * Default export
 */
export default AppContext;
