/**
 * AXILO CLI Theme System
 *
 * Defines the data structures, types, and utilities for visual themes
 * used throughout the CLI's interactive user interface.
 */

import { COLORS } from '../constants';

// ============================================================================
// Theme Data Structures
// ============================================================================

/**
 * Color palette definition
 */
export interface ColorPalette {
  // Primary colors
  primary: string;
  secondary: string;
  accent: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Neutral colors
  foreground: string;
  background: string;
  surface: string;
  border: string;

  // Text colors
  text: string;
  textMuted: string;
  textInverse: string;

  // Interactive colors
  hover: string;
  active: string;
  focus: string;
  disabled: string;

  // Special colors
  highlight: string;
  selection: string;
  shadow: string;
}

/**
 * Typography settings
 */
export interface Typography {
  // Font families
  fontFamily: string;
  fontFamilyMono: string;

  // Font sizes
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };

  // Font weights
  fontWeight: {
    normal: number;
    bold: number;
    light: number;
  };

  // Line heights
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };

  // Letter spacing
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
}

/**
 * Spacing and layout settings
 */
export interface Spacing {
  // Base spacing unit
  unit: number;

  // Common spacing values
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };

  // Border radius
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };

  // Border width
  borderWidth: {
    none: number;
    thin: number;
    normal: number;
    thick: number;
  };
}

/**
 * Component-specific styling
 */
export interface ComponentStyles {
  // Button styles
  button: {
    padding: {
      sm: number;
      md: number;
      lg: number;
    };
    borderRadius: number;
    fontSize: number;
    fontWeight: number;
  };

  // Input styles
  input: {
    padding: number;
    borderWidth: number;
    borderRadius: number;
    fontSize: number;
    backgroundColor: string;
    borderColor: string;
    focusColor: string;
  };

  // Panel styles
  panel: {
    padding: number;
    borderWidth: number;
    borderRadius: number;
    backgroundColor: string;
    borderColor: string;
  };

  // List styles
  list: {
    itemPadding: number;
    itemSpacing: number;
    selectedColor: string;
    hoverColor: string;
  };

  // Status indicator styles
  status: {
    size: number;
    activeColor: string;
    inactiveColor: string;
  };
}

/**
 * Complete theme definition
 */
export interface Theme {
  // Theme metadata
  id: string;
  name: string;
  description: string;
  version: string;

  // Base theme type
  type: 'light' | 'dark' | 'high-contrast';

  // Color system
  colors: ColorPalette;

  // Typography system
  typography: Typography;

  // Spacing and layout
  spacing: Spacing;

  // Component styles
  components: ComponentStyles;

  // Animation settings
  animations: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };

  // Accessibility settings
  accessibility: {
    minContrastRatio: number;
    focusRingWidth: number;
    focusRingColor: string;
    highContrast: boolean;
  };
}

// ============================================================================
// Predefined Themes
// ============================================================================

/**
 * Light theme - Default bright theme
 */
export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  description: 'Default light theme with bright colors',
  version: '1.0.0',
  type: 'light',

  colors: {
    primary: COLORS.BRIGHT_CYAN,
    secondary: COLORS.BRIGHT_BLUE,
    accent: COLORS.BRIGHT_MAGENTA,

    success: COLORS.GREEN,
    warning: COLORS.YELLOW,
    error: COLORS.RED,
    info: COLORS.BLUE,

    foreground: COLORS.WHITE,
    background: COLORS.BG_BLACK,
    surface: COLORS.BG_BRIGHT_BLACK,
    border: COLORS.BRIGHT_BLACK,

    text: COLORS.WHITE,
    textMuted: COLORS.BRIGHT_BLACK,
    textInverse: COLORS.BLACK,

    hover: COLORS.BG_WHITE,
    active: COLORS.BG_BRIGHT_WHITE,
    focus: COLORS.BRIGHT_CYAN,
    disabled: COLORS.BRIGHT_BLACK,

    highlight: COLORS.BG_BRIGHT_BLUE,
    selection: COLORS.BG_BRIGHT_CYAN,
    shadow: COLORS.BLACK
  },

  typography: {
    fontFamily: 'monospace',
    fontFamilyMono: 'monospace',

    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24
    },

    fontWeight: {
      normal: 400,
      bold: 700,
      light: 300
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8
    },

    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5
    }
  },

  spacing: {
    unit: 4,

    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64
    },

    borderRadius: {
      none: 0,
      sm: 2,
      md: 4,
      lg: 8,
      xl: 12,
      full: 9999
    },

    borderWidth: {
      none: 0,
      thin: 1,
      normal: 2,
      thick: 3
    }
  },

  components: {
    button: {
      padding: {
        sm: 8,
        md: 12,
        lg: 16
      },
      borderRadius: 4,
      fontSize: 14,
      fontWeight: 500
    },

    input: {
      padding: 12,
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 14,
      backgroundColor: COLORS.BG_BLACK,
      borderColor: COLORS.BRIGHT_BLACK,
      focusColor: COLORS.BRIGHT_CYAN
    },

    panel: {
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: COLORS.BG_BRIGHT_BLACK,
      borderColor: COLORS.BRIGHT_BLACK
    },

    list: {
      itemPadding: 8,
      itemSpacing: 4,
      selectedColor: COLORS.BG_BRIGHT_CYAN,
      hoverColor: COLORS.BG_BRIGHT_BLACK
    },

    status: {
      size: 8,
      activeColor: COLORS.GREEN,
      inactiveColor: COLORS.BRIGHT_BLACK
    }
  },

  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  accessibility: {
    minContrastRatio: 4.5,
    focusRingWidth: 2,
    focusRingColor: COLORS.BRIGHT_CYAN,
    highContrast: false
  }
};

/**
 * Dark theme - Dark color scheme
 */
export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  description: 'Dark theme with reduced eye strain',
  version: '1.0.0',
  type: 'dark',

  colors: {
    primary: COLORS.BRIGHT_CYAN,
    secondary: COLORS.BRIGHT_BLUE,
    accent: COLORS.BRIGHT_MAGENTA,

    success: COLORS.BRIGHT_GREEN,
    warning: COLORS.BRIGHT_YELLOW,
    error: COLORS.BRIGHT_RED,
    info: COLORS.BRIGHT_BLUE,

    foreground: COLORS.BLACK,
    background: COLORS.BG_WHITE,
    surface: COLORS.BG_BRIGHT_WHITE,
    border: COLORS.BRIGHT_WHITE,

    text: COLORS.BLACK,
    textMuted: COLORS.BRIGHT_WHITE,
    textInverse: COLORS.WHITE,

    hover: COLORS.BG_BLACK,
    active: COLORS.BG_BRIGHT_BLACK,
    focus: COLORS.BRIGHT_CYAN,
    disabled: COLORS.BRIGHT_WHITE,

    highlight: COLORS.BG_BRIGHT_BLUE,
    selection: COLORS.BG_BRIGHT_CYAN,
    shadow: COLORS.WHITE
  },

  typography: {
    ...lightTheme.typography
  },

  spacing: {
    ...lightTheme.spacing
  },

  components: {
    button: {
      ...lightTheme.components.button
    },

    input: {
      padding: 12,
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 14,
      backgroundColor: COLORS.BG_WHITE,
      borderColor: COLORS.BRIGHT_WHITE,
      focusColor: COLORS.BRIGHT_CYAN
    },

    panel: {
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: COLORS.BG_BRIGHT_WHITE,
      borderColor: COLORS.BRIGHT_WHITE
    },

    list: {
      itemPadding: 8,
      itemSpacing: 4,
      selectedColor: COLORS.BG_BRIGHT_CYAN,
      hoverColor: COLORS.BG_BRIGHT_WHITE
    },

    status: {
      size: 8,
      activeColor: COLORS.BRIGHT_GREEN,
      inactiveColor: COLORS.BRIGHT_WHITE
    }
  },

  animations: {
    ...lightTheme.animations
  },

  accessibility: {
    ...lightTheme.accessibility
  }
};

/**
 * High contrast theme - Enhanced visibility
 */
export const highContrastTheme: Theme = {
  id: 'high-contrast',
  name: 'High Contrast',
  description: 'High contrast theme for enhanced visibility',
  version: '1.0.0',
  type: 'high-contrast',

  colors: {
    primary: COLORS.WHITE,
    secondary: COLORS.BRIGHT_WHITE,
    accent: COLORS.BRIGHT_WHITE,

    success: COLORS.BRIGHT_GREEN,
    warning: COLORS.BRIGHT_YELLOW,
    error: COLORS.BRIGHT_RED,
    info: COLORS.BRIGHT_BLUE,

    foreground: COLORS.BLACK,
    background: COLORS.WHITE,
    surface: COLORS.WHITE,
    border: COLORS.BLACK,

    text: COLORS.BLACK,
    textMuted: COLORS.BRIGHT_BLACK,
    textInverse: COLORS.WHITE,

    hover: COLORS.BG_BRIGHT_BLACK,
    active: COLORS.BG_BLACK,
    focus: COLORS.WHITE,
    disabled: COLORS.BRIGHT_BLACK,

    highlight: COLORS.BG_WHITE,
    selection: COLORS.BG_WHITE,
    shadow: COLORS.BLACK
  },

  typography: {
    ...lightTheme.typography,
    fontWeight: {
      normal: 700, // Make all text bold for better visibility
      bold: 700,
      light: 400
    }
  },

  spacing: {
    ...lightTheme.spacing
  },

  components: {
    button: {
      ...lightTheme.components.button,
      borderWidth: 3 // Thicker borders for visibility
    },

    input: {
      padding: 16, // Larger padding for easier interaction
      borderWidth: 3,
      borderRadius: 8,
      fontSize: 16, // Larger font for readability
      backgroundColor: COLORS.WHITE,
      borderColor: COLORS.BLACK,
      focusColor: COLORS.WHITE
    },

    panel: {
      padding: 20,
      borderWidth: 3,
      borderRadius: 12,
      backgroundColor: COLORS.WHITE,
      borderColor: COLORS.BLACK
    },

    list: {
      itemPadding: 12,
      itemSpacing: 8,
      selectedColor: COLORS.BG_BLACK,
      hoverColor: COLORS.BG_BRIGHT_BLACK
    },

    status: {
      size: 12, // Larger indicators
      activeColor: COLORS.BRIGHT_GREEN,
      inactiveColor: COLORS.BRIGHT_BLACK
    }
  },

  animations: {
    duration: {
      fast: 200, // Slightly slower for better visibility
      normal: 400,
      slow: 600
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  accessibility: {
    minContrastRatio: 7.0, // Higher contrast requirement
    focusRingWidth: 4, // Thicker focus ring
    focusRingColor: COLORS.WHITE,
    highContrast: true
  }
};

/**
 * Monochrome theme - Black and white only
 */
export const monochromeTheme: Theme = {
  id: 'monochrome',
  name: 'Monochrome',
  description: 'Monochrome theme using only black and white',
  version: '1.0.0',
  type: 'high-contrast',

  colors: {
    primary: COLORS.WHITE,
    secondary: COLORS.WHITE,
    accent: COLORS.WHITE,

    success: COLORS.WHITE,
    warning: COLORS.WHITE,
    error: COLORS.WHITE,
    info: COLORS.WHITE,

    foreground: COLORS.BLACK,
    background: COLORS.WHITE,
    surface: COLORS.WHITE,
    border: COLORS.BLACK,

    text: COLORS.BLACK,
    textMuted: COLORS.BRIGHT_BLACK,
    textInverse: COLORS.WHITE,

    hover: COLORS.BG_BLACK,
    active: COLORS.BG_BRIGHT_BLACK,
    focus: COLORS.WHITE,
    disabled: COLORS.BRIGHT_BLACK,

    highlight: COLORS.BG_WHITE,
    selection: COLORS.BG_WHITE,
    shadow: COLORS.BLACK
  },

  typography: {
    ...highContrastTheme.typography
  },

  spacing: {
    ...highContrastTheme.spacing
  },

  components: {
    ...highContrastTheme.components
  },

  animations: {
    ...highContrastTheme.animations
  },

  accessibility: {
    ...highContrastTheme.accessibility,
    minContrastRatio: 21.0 // Maximum contrast ratio
  }
};

// ============================================================================
// Theme Registry
// ============================================================================

/**
 * Registry of all available themes
 */
export const THEMES = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': highContrastTheme,
  monochrome: monochromeTheme
} as const;

/**
 * Theme type definitions
 */
export type ThemeId = keyof typeof THEMES;
export type ThemeType = Theme['type'];

/**
 * Default theme
 */
export const DEFAULT_THEME: ThemeId = 'light';

// ============================================================================
// Theme Utilities
// ============================================================================

/**
 * Get theme by ID
 */
export function getTheme(themeId: ThemeId): Theme {
  return THEMES[themeId] || THEMES[DEFAULT_THEME];
}

/**
 * Get all available theme IDs
 */
export function getThemeIds(): ThemeId[] {
  return Object.keys(THEMES) as ThemeId[];
}

/**
 * Get all available themes
 */
export function getAllThemes(): Record<ThemeId, Theme> {
  return { ...THEMES };
}

/**
 * Check if theme exists
 */
export function hasTheme(themeId: string): themeId is ThemeId {
  return themeId in THEMES;
}

/**
 * Get themes by type
 */
export function getThemesByType(type: ThemeType): Theme[] {
  return Object.values(THEMES).filter(theme => theme.type === type);
}

/**
 * Get theme metadata
 */
export function getThemeMetadata(themeId: ThemeId): Pick<Theme, 'id' | 'name' | 'description' | 'type'> {
  const theme = THEMES[themeId];
  if (!theme) {
    throw new Error(`Theme not found: ${themeId}`);
  }

  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    type: theme.type
  };
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // This is a simplified implementation
  // In a real implementation, you'd use a proper color library
  // to calculate WCAG contrast ratios

  // For now, return a placeholder value
  return 4.5; // Assume minimum contrast
}

/**
 * Check if theme meets accessibility requirements
 */
export function validateThemeAccessibility(theme: Theme): {
  isAccessible: boolean;
  issues: string[];
  contrastRatios: Record<string, number>;
} {
  const issues: string[] = [];
  const contrastRatios: Record<string, number> = {};

  // Check contrast ratio between text and background
  const textContrast = calculateContrastRatio(theme.colors.text, theme.colors.background);
  contrastRatios.textToBackground = textContrast;

  if (textContrast < theme.accessibility.minContrastRatio) {
    issues.push(`Text contrast ratio (${textContrast}) below minimum (${theme.accessibility.minContrastRatio})`);
  }

  // Check focus ring visibility
  const focusContrast = calculateContrastRatio(theme.accessibility.focusRingColor, theme.colors.background);
  contrastRatios.focusToBackground = focusContrast;

  if (focusContrast < 3.0) {
    issues.push('Focus ring contrast too low');
  }

  return {
    isAccessible: issues.length === 0,
    issues,
    contrastRatios
  };
}

/**
 * Create a custom theme by extending an existing theme
 */
export function extendTheme(
  baseThemeId: ThemeId,
  overrides: Partial<Omit<Theme, 'id' | 'name' | 'description' | 'version'>>
): Theme {
  const baseTheme = THEMES[baseThemeId];

  return {
    id: `custom-${baseThemeId}-${Date.now()}`,
    name: `Custom ${baseTheme.name}`,
    description: `Custom theme based on ${baseTheme.name}`,
    version: '1.0.0',
    type: baseTheme.type,
    colors: { ...baseTheme.colors, ...overrides.colors },
    typography: { ...baseTheme.typography, ...overrides.typography },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    components: { ...baseTheme.components, ...overrides.components },
    animations: { ...baseTheme.animations, ...overrides.animations },
    accessibility: { ...baseTheme.accessibility, ...overrides.accessibility }
  };
}

/**
 * Merge multiple themes (later themes override earlier ones)
 */
export function mergeThemes(...themes: Theme[]): Theme {
  if (themes.length === 0) {
    throw new Error('At least one theme must be provided');
  }

  const baseTheme = themes[0];

  return {
    id: `merged-${Date.now()}`,
    name: 'Merged Theme',
    description: 'Theme created by merging multiple themes',
    version: '1.0.0',
    type: baseTheme.type,
    colors: Object.assign({}, ...themes.map(t => t.colors)),
    typography: Object.assign({}, ...themes.map(t => t.typography)),
    spacing: Object.assign({}, ...themes.map(t => t.spacing)),
    components: Object.assign({}, ...themes.map(t => t.components)),
    animations: Object.assign({}, ...themes.map(t => t.animations)),
    accessibility: Object.assign({}, ...themes.map(t => t.accessibility))
  };
}

/**
 * Validate theme structure
 */
export function validateTheme(theme: any): theme is Theme {
  try {
    // Basic structure validation
    if (!theme || typeof theme !== 'object') {
      return false;
    }

    const requiredFields = ['id', 'name', 'description', 'version', 'type', 'colors', 'typography', 'spacing', 'components', 'animations', 'accessibility'];
    for (const field of requiredFields) {
      if (!(field in theme)) {
        return false;
      }
    }

    // Type validation
    if (!['light', 'dark', 'high-contrast'].includes(theme.type)) {
      return false;
    }

    // Colors validation
    if (!theme.colors || typeof theme.colors !== 'object') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Export theme as JSON
 */
export function exportTheme(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import theme from JSON
 */
export function importTheme(jsonString: string): Theme {
  try {
    const theme = JSON.parse(jsonString);

    if (!validateTheme(theme)) {
      throw new Error('Invalid theme structure');
    }

    return theme;
  } catch (error) {
    throw new Error(`Failed to import theme: ${error.message}`);
  }
}

// ============================================================================
// Theme Application Utilities
// ============================================================================

/**
 * Apply theme to a component's style props
 */
export function applyTheme<T extends Record<string, any>>(
  props: T,
  theme: Theme,
  componentName?: string
): T {
  const styledProps = { ...props };

  // Apply theme colors if color props exist
  if (styledProps.color && theme.colors[styledProps.color]) {
    styledProps.color = theme.colors[styledProps.color];
  }

  if (styledProps.backgroundColor && theme.colors[styledProps.backgroundColor]) {
    styledProps.backgroundColor = theme.colors[styledProps.backgroundColor];
  }

  if (styledProps.borderColor && theme.colors[styledProps.borderColor]) {
    styledProps.borderColor = theme.colors[styledProps.borderColor];
  }

  // Apply theme spacing if spacing props exist
  if (styledProps.padding !== undefined && theme.spacing.spacing[styledProps.padding]) {
    styledProps.padding = theme.spacing.spacing[styledProps.padding];
  }

  if (styledProps.margin !== undefined && theme.spacing.spacing[styledProps.margin]) {
    styledProps.margin = theme.spacing.spacing[styledProps.margin];
  }

  return styledProps;
}

/**
 * Get component-specific styles from theme
 */
export function getComponentStyles(theme: Theme, componentName: keyof Theme['components']): Theme['components'][typeof componentName] {
  return theme.components[componentName];
}

/**
 * Create CSS variables from theme
 */
export function createThemeVariables(theme: Theme): Record<string, string> {
  const variables: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });

  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = `${value}px`;
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables[`--font-weight-${key}`] = value.toString();
  });

  // Spacing
  Object.entries(theme.spacing.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = `${value}px`;
  });

  return variables;
}

// ============================================================================
// Default Exports
// ============================================================================

/**
 * Default theme export
 */
export default lightTheme;
