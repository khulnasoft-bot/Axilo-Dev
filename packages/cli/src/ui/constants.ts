/**
 * AXILO CLI UI Constants
 *
 * Centralized constants for the CLI's user interface components including
 * colors, themes, interactive elements, layout, and visual styling.
 */

// ============================================================================
// Color Schemes and Themes
// ============================================================================

/**
 * ANSI color codes for terminal output
 */
export const COLORS = {
  // Basic colors
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERSCORE: '\x1b[4m',
  BLINK: '\x1b[5m',
  REVERSE: '\x1b[7m',
  HIDDEN: '\x1b[8m',

  // Foreground colors
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',

  // Background colors
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',

  // Bright foreground colors
  BRIGHT_BLACK: '\x1b[90m',
  BRIGHT_RED: '\x1b[91m',
  BRIGHT_GREEN: '\x1b[92m',
  BRIGHT_YELLOW: '\x1b[93m',
  BRIGHT_BLUE: '\x1b[94m',
  BRIGHT_MAGENTA: '\x1b[95m',
  BRIGHT_CYAN: '\x1b[96m',
  BRIGHT_WHITE: '\x1b[97m',

  // Bright background colors
  BG_BRIGHT_BLACK: '\x1b[100m',
  BG_BRIGHT_RED: '\x1b[101m',
  BG_BRIGHT_GREEN: '\x1b[102m',
  BG_BRIGHT_YELLOW: '\x1b[103m',
  BG_BRIGHT_BLUE: '\x1b[104m',
  BG_BRIGHT_MAGENTA: '\x1b[105m',
  BG_BRIGHT_CYAN: '\x1b[106m',
  BG_BRIGHT_WHITE: '\x1b[107m'
} as const;

/**
 * Color themes for different UI contexts
 */
export const THEMES = {
  DEFAULT: {
    primary: COLORS.CYAN,
    secondary: COLORS.BLUE,
    success: COLORS.GREEN,
    warning: COLORS.YELLOW,
    error: COLORS.RED,
    info: COLORS.BRIGHT_WHITE,
    muted: COLORS.BRIGHT_BLACK,
    accent: COLORS.BRIGHT_MAGENTA
  },

  SUCCESS: {
    primary: COLORS.BRIGHT_GREEN,
    secondary: COLORS.GREEN,
    success: COLORS.BRIGHT_GREEN,
    warning: COLORS.YELLOW,
    error: COLORS.RED,
    info: COLORS.BRIGHT_WHITE,
    muted: COLORS.BRIGHT_BLACK,
    accent: COLORS.BRIGHT_CYAN
  },

  ERROR: {
    primary: COLORS.BRIGHT_RED,
    secondary: COLORS.RED,
    success: COLORS.GREEN,
    warning: COLORS.YELLOW,
    error: COLORS.BRIGHT_RED,
    info: COLORS.BRIGHT_WHITE,
    muted: COLORS.BRIGHT_BLACK,
    accent: COLORS.BRIGHT_MAGENTA
  },

  WARNING: {
    primary: COLORS.BRIGHT_YELLOW,
    secondary: COLORS.YELLOW,
    success: COLORS.GREEN,
    warning: COLORS.BRIGHT_YELLOW,
    error: COLORS.RED,
    info: COLORS.BRIGHT_WHITE,
    muted: COLORS.BRIGHT_BLACK,
    accent: COLORS.BRIGHT_CYAN
  }
} as const;

/**
 * Spinner and loading indicators
 */
export const SPINNERS = {
  DOTS: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  LINE: ['-', '\\', '|', '/'],
  ARROW: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
  BOUNCE: ['⠁', '⠂', '⠄', '⠂'],
  PULSE: ['█', '▓', '▒', '░']
} as const;

/**
 * Progress bar characters
 */
export const PROGRESS = {
  COMPLETE: '█',
  INCOMPLETE: '░',
  HEAD: '>',
  SEPARATOR: '│'
} as const;

// ============================================================================
// Layout and Dimensions
// ============================================================================

/**
 * Terminal dimensions and layout constants
 */
export const LAYOUT = {
  // Default terminal width (fallback)
  DEFAULT_WIDTH: 80,
  DEFAULT_HEIGHT: 24,

  // UI element dimensions
  MAX_PROMPT_WIDTH: 60,
  MIN_PROMPT_WIDTH: 20,
  INPUT_MAX_LENGTH: 200,

  // Spacing
  MARGIN: 2,
  PADDING: 1,
  INDENT: 2,

  // Border characters
  BORDERS: {
    TOP_LEFT: '┌',
    TOP_RIGHT: '┐',
    BOTTOM_LEFT: '└',
    BOTTOM_RIGHT: '┘',
    HORIZONTAL: '─',
    VERTICAL: '│',
    CROSS: '┼'
  },

  // Box drawing characters
  BOX: {
    SINGLE: {
      TOP_LEFT: '┌',
      TOP_RIGHT: '┐',
      BOTTOM_LEFT: '└',
      BOTTOM_RIGHT: '┘',
      HORIZONTAL: '─',
      VERTICAL: '│'
    },
    DOUBLE: {
      TOP_LEFT: '╔',
      TOP_RIGHT: '╗',
      BOTTOM_LEFT: '╚',
      BOTTOM_RIGHT: '╝',
      HORIZONTAL: '═',
      VERTICAL: '║'
    },
    ROUNDED: {
      TOP_LEFT: '╭',
      TOP_RIGHT: '╮',
      BOTTOM_LEFT: '╰',
      BOTTOM_RIGHT: '╯',
      HORIZONTAL: '─',
      VERTICAL: '│'
    }
  }
} as const;

// ============================================================================
// Interactive Elements
// ============================================================================

/**
 * Key bindings and shortcuts
 */
export const KEY_BINDINGS = {
  // Navigation
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  ENTER: 'enter',
  RETURN: 'return',
  TAB: 'tab',
  SHIFT_TAB: 'shift+tab',

  // Actions
  CONFIRM: 'enter',
  CANCEL: 'escape',
  SELECT: 'space',
  DELETE: 'delete',
  BACKSPACE: 'backspace',

  // CLI specific
  HELP: '?',
  QUIT: 'q',
  EXIT: 'ctrl+c',
  REFRESH: 'r',
  SEARCH: '/',
  FILTER: 'f',

  // Special keys
  ESCAPE: 'escape',
  HOME: 'home',
  END: 'end',
  PAGE_UP: 'pageup',
  PAGE_DOWN: 'pagedown'
} as const;

/**
 * Prompt and input constants
 */
export const PROMPTS = {
  // Default prompt symbols
  PRIMARY: '❯',
  SECONDARY: '›',
  SUCCESS: '✓',
  ERROR: '✗',
  WARNING: '⚠',
  INFO: 'ℹ',
  QUESTION: '?',
  ARROW: '→',

  // Input indicators
  PASSWORD: '•',
  MULTILINE: '↳',
  OPTIONAL: '(optional)',

  // Selection indicators
  SELECTED: '◉',
  UNSELECTED: '○',
  CHECKED: '☑',
  UNCHECKED: '☐',
  RADIO_SELECTED: '●',
  RADIO_UNSELECTED: '○'
} as const;

/**
 * Status indicators
 */
export const STATUS = {
  // Loading states
  LOADING: '⟳',
  SPINNER: '⠋',
  PENDING: '⏳',
  RUNNING: '🏃',
  PROCESSING: '⚙',

  // Success states
  SUCCESS: '✅',
  COMPLETE: '✓',
  DONE: '🎉',
  APPROVED: '👍',

  // Error states
  ERROR: '❌',
  FAILED: '✗',
  REJECTED: '👎',
  CRITICAL: '🚨',

  // Warning states
  WARNING: '⚠️',
  CAUTION: '⚡',
  ATTENTION: '📢',

  // Info states
  INFO: 'ℹ️',
  NOTE: '📝',
  TIP: '💡'
} as const;

// ============================================================================
// Text Formatting
// ============================================================================

/**
 * Text formatting constants
 */
export const TEXT = {
  // Separators
  SEPARATOR: '│',
  DIVIDER: '─',
  BULLET: '•',
  DASH: '–',
  ELLIPSIS: '…',

  // Quotes
  QUOTE: '"',
  SINGLE_QUOTE: "'",
  BACKTICK: '`',

  // Brackets
  PAREN_OPEN: '(',
  PAREN_CLOSE: ')',
  BRACKET_OPEN: '[',
  BRACKET_CLOSE: ']',
  BRACE_OPEN: '{',
  BRACE_CLOSE: '}',

  // Arrows
  ARROW_RIGHT: '→',
  ARROW_LEFT: '←',
  ARROW_UP: '↑',
  ARROW_DOWN: '↓',
  ARROW_DOUBLE: '⇒',

  // Mathematical
  PLUS: '+',
  MINUS: '−',
  MULTIPLY: '×',
  DIVIDE: '÷',
  EQUALS: '=',
  APPROXIMATELY: '≈',

  // Special characters
  DEGREE: '°',
  COPYRIGHT: '©',
  REGISTERED: '®',
  TRADEMARK: '™',
  HEART: '♥',
  STAR: '★',
  CHECKMARK: '✓',
  BALLOT_X: '✗'
} as const;

/**
 * Message prefixes for different types of output
 */
export const PREFIXES = {
  COMMAND: `${COLORS.CYAN}${PROMPTS.PRIMARY}${COLORS.RESET}`,
  SUCCESS: `${COLORS.GREEN}${STATUS.SUCCESS}${COLORS.RESET}`,
  ERROR: `${COLORS.RED}${STATUS.ERROR}${COLORS.RESET}`,
  WARNING: `${COLORS.YELLOW}${STATUS.WARNING}${COLORS.RESET}`,
  INFO: `${COLORS.BLUE}${STATUS.INFO}${COLORS.RESET}`,
  DEBUG: `${COLORS.BRIGHT_BLACK}🔍${COLORS.RESET}`,
  INPUT: `${COLORS.BRIGHT_WHITE}${PROMPTS.QUESTION}${COLORS.RESET}`,
  OUTPUT: `${COLORS.BRIGHT_WHITE}${PROMPTS.ARROW}${COLORS.RESET}`
} as const;

// ============================================================================
// Animation and Effects
// ============================================================================

/**
 * Animation frame rates and timing
 */
export const ANIMATION = {
  // Frame rates (FPS)
  FAST: 60,
  NORMAL: 30,
  SLOW: 15,

  // Duration in milliseconds
  BLINK: 500,
  FLASH: 200,
  FADE: 300,
  SLIDE: 400,

  // Spinner intervals
  SPINNER_FAST: 80,
  SPINNER_NORMAL: 120,
  SPINNER_SLOW: 200
} as const;

/**
 * Gradient and color transition constants
 */
export const GRADIENTS = {
  RAINBOW: [COLORS.RED, COLORS.YELLOW, COLORS.GREEN, COLORS.CYAN, COLORS.BLUE, COLORS.MAGENTA],
  FIRE: [COLORS.BRIGHT_RED, COLORS.RED, COLORS.BRIGHT_YELLOW],
  OCEAN: [COLORS.BRIGHT_BLUE, COLORS.BLUE, COLORS.CYAN],
  FOREST: [COLORS.BRIGHT_GREEN, COLORS.GREEN],
  SUNSET: [COLORS.BRIGHT_MAGENTA, COLORS.MAGENTA, COLORS.BRIGHT_RED]
} as const;

// ============================================================================
// Accessibility and UX
// ============================================================================

/**
 * Accessibility constants
 */
export const A11Y = {
  // Screen reader prefixes
  SR_ONLY: 'sr-only',
  LIVE_REGION: 'live-region',

  // ARIA labels
  ARIA_LABEL: 'aria-label',
  ARIA_LABELLEDBY: 'aria-labelledby',
  ARIA_DESCRIBEDBY: 'aria-describedby',

  // Focus indicators
  FOCUS_VISIBLE: 'focus-visible',
  FOCUS_WITHIN: 'focus-within',

  // Reduced motion
  PREFERS_REDUCED_MOTION: '@media (prefers-reduced-motion: reduce)'
} as const;

/**
 * UX patterns and conventions
 */
export const UX = {
  // Debounce delays (milliseconds)
  DEBOUNCE_FAST: 150,
  DEBOUNCE_NORMAL: 300,
  DEBOUNCE_SLOW: 500,

  // Animation durations
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 300,
  TRANSITION_SLOW: 500,

  // Hover delays
  HOVER_DELAY: 300,
  TOOLTIP_DELAY: 500,

  // Focus management
  FOCUS_TRAP: true,
  ESCAPE_CLOSES: true,
  CLICK_OUTSIDE_CLOSES: true
} as const;

// ============================================================================
// Default Values and Configuration
// ============================================================================

/**
 * Default UI configuration values
 */
export const DEFAULTS = {
  // Theme
  THEME: 'default' as keyof typeof THEMES,

  // Colors
  PRIMARY_COLOR: 'cyan',
  ACCENT_COLOR: 'magenta',

  // Layout
  TERMINAL_WIDTH: 80,
  MAX_LIST_ITEMS: 10,
  SCROLL_THRESHOLD: 5,

  // Animation
  ANIMATION_SPEED: 'normal',
  SPINNER_TYPE: 'dots',

  // Interaction
  CONFIRM_ON_DELETE: true,
  SHOW_HELP_ON_ERROR: true,
  AUTO_COMPLETE: true,

  // Timing
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  SPINNER_INTERVAL: 100
} as const;

/**
 * UI state constants
 */
export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled',
  ENABLED: 'enabled'
} as const;

// ============================================================================
// CLI-Specific Constants
// ============================================================================

/**
 * AXILO CLI specific UI constants
 */
export const AXILO_UI = {
  // Brand colors
  BRAND_PRIMARY: COLORS.BRIGHT_CYAN,
  BRAND_SECONDARY: COLORS.BRIGHT_MAGENTA,
  BRAND_ACCENT: COLORS.BRIGHT_YELLOW,

  // Logo and branding
  LOGO: '🚀 AXILO',
  TAGLINE: 'AI-Powered Developer Assistant',

  // Command prefixes
  COMMAND_PREFIX: 'axilo',
  COMMAND_SEPARATOR: ':',

  // Status messages
  READY: 'Ready to assist',
  THINKING: 'Thinking...',
  EXECUTING: 'Executing...',
  COMPLETE: 'Task completed',

  // Interactive prompts
  SELECT_EXTENSION: 'Choose an extension',
  SELECT_COMMAND: 'Choose a command',
  ENTER_VALUE: 'Enter value',
  CONFIRM_ACTION: 'Confirm action',

  // Error messages
  COMMAND_NOT_FOUND: 'Command not found',
  EXTENSION_NOT_FOUND: 'Extension not found',
  INVALID_INPUT: 'Invalid input',
  NETWORK_ERROR: 'Network error',
  PERMISSION_DENIED: 'Permission denied'
} as const;

// ============================================================================
// Export utility functions for working with constants
// ============================================================================

/**
 * Get color by name from COLORS object
 */
export function getColor(colorName: keyof typeof COLORS): string {
  return COLORS[colorName] || COLORS.RESET;
}

/**
 * Get theme colors by theme name
 */
export function getTheme(themeName: keyof typeof THEMES = 'DEFAULT'): typeof THEMES.DEFAULT {
  return THEMES[themeName] || THEMES.DEFAULT;
}

/**
 * Create a styled text with color
 */
export function styleText(text: string, color: keyof typeof COLORS): string {
  return `${COLORS[color]}${text}${COLORS.RESET}`;
}

/**
 * Create a themed message
 */
export function createMessage(text: string, theme: keyof typeof THEMES = 'DEFAULT'): string {
  const colors = getTheme(theme);
  return `${colors.primary}${text}${COLORS.RESET}`;
}

/**
 * Get spinner frames by type
 */
export function getSpinnerFrames(type: keyof typeof SPINNERS = 'DOTS'): string[] {
  return SPINNERS[type] || SPINNERS.DOTS;
}
