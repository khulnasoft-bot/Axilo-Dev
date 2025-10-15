/**
 * AXILO CLI Key Matchers
 *
 * Handles keyboard input detection, interpretation, and matching for the CLI's
 * interactive user interface. Provides utilities for detecting key combinations,
 * modifier keys, and translating raw keyboard events into meaningful actions.
 */

import { Key } from 'ink';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Key modifier states
 */
export interface KeyModifiers {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean; // Command key on Mac, Windows key on PC
}

/**
 * Enhanced key event with modifier information
 */
export interface EnhancedKey extends Key {
  modifiers: KeyModifiers;
  isModified: boolean;
  normalizedKey: string;
  keyCombo: string;
}

/**
 * Key pattern for matching
 */
export interface KeyPattern {
  key: string;
  modifiers?: Partial<KeyModifiers>;
  exact?: boolean; // Require exact modifier match
}

/**
 * Key binding definition
 */
export interface KeyBinding {
  pattern: KeyPattern | string;
  action: string;
  description?: string;
  category?: string;
  context?: string; // When this binding is active
}

/**
 * Key matcher result
 */
export interface KeyMatchResult {
  matched: boolean;
  binding?: KeyBinding;
  action?: string;
  consumed: boolean; // Whether the key event should be consumed
}

/**
 * Key matcher function signature
 */
export type KeyMatcher = (key: EnhancedKey, context?: string) => KeyMatchResult;

// ============================================================================
// Key Detection and Enhancement
// ============================================================================

/**
 * Enhance a raw Ink Key event with modifier and normalization information
 */
export function enhanceKey(key: Key): EnhancedKey {
  const modifiers: KeyModifiers = {
    ctrl: key.ctrl || false,
    alt: key.meta || false, // Ink uses 'meta' for Alt on some systems
    shift: key.shift || false,
    meta: key.meta || false
  };

  // Normalize key names
  const normalizedKey = normalizeKeyName(key);

  // Create key combination string
  const keyCombo = createKeyComboString(normalizedKey, modifiers);

  return {
    ...key,
    modifiers,
    isModified: Object.values(modifiers).some(Boolean),
    normalizedKey,
    keyCombo
  };
}

/**
 * Normalize key names to consistent format
 */
export function normalizeKeyName(key: Key): string {
  if (key.input) {
    return key.input.toLowerCase();
  }

  // Handle special keys
  switch (key.name) {
    case 'return': return 'enter';
    case 'space': return ' ';
    case 'escape': return 'esc';
    case 'backspace': return 'backspace';
    case 'delete': return 'delete';
    case 'tab': return 'tab';
    case 'up': return 'up';
    case 'down': return 'down';
    case 'left': return 'left';
    case 'right': return 'right';
    case 'home': return 'home';
    case 'end': return 'end';
    case 'pageup': return 'pageup';
    case 'pagedown': return 'pagedown';
    default: return key.name || '';
  }
}

/**
 * Create a standardized key combination string
 */
export function createKeyComboString(key: string, modifiers: KeyModifiers): string {
  const parts: string[] = [];

  if (modifiers.ctrl) parts.push('ctrl');
  if (modifiers.alt) parts.push('alt');
  if (modifiers.shift) parts.push('shift');
  if (modifiers.meta) parts.push('meta');

  parts.push(key);

  return parts.join('+');
}

/**
 * Parse a key combination string into its components
 */
export function parseKeyCombo(combo: string): { key: string; modifiers: KeyModifiers } {
  const parts = combo.toLowerCase().split('+');
  const key = parts.pop() || '';

  const modifiers: KeyModifiers = {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    alt: parts.includes('alt') || parts.includes('option'),
    shift: parts.includes('shift'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command') || parts.includes('win') || parts.includes('windows')
  };

  return { key, modifiers };
}

// ============================================================================
// Key Pattern Matching
// ============================================================================

/**
 * Check if a key matches a pattern
 */
export function matchesKeyPattern(key: EnhancedKey, pattern: KeyPattern): boolean {
  // Check key match
  if (pattern.key !== key.normalizedKey) {
    return false;
  }

  // Check modifier requirements
  if (pattern.modifiers) {
    const requiredModifiers = pattern.modifiers;

    // If exact match is required, modifiers must match exactly
    if (pattern.exact) {
      return Object.entries(requiredModifiers).every(([mod, required]) => {
        return key.modifiers[mod as keyof KeyModifiers] === required;
      });
    }

    // Otherwise, required modifiers must be present
    return Object.entries(requiredModifiers).every(([mod, required]) => {
      return !required || key.modifiers[mod as keyof KeyModifiers] === required;
    });
  }

  return true;
}

/**
 * Create a key matcher function from a pattern
 */
export function createKeyMatcher(pattern: KeyPattern | string): KeyMatcher {
  const keyPattern: KeyPattern = typeof pattern === 'string'
    ? { key: pattern }
    : pattern;

  return (key: EnhancedKey, context?: string): KeyMatchResult => {
    const matches = matchesKeyPattern(key, keyPattern);

    return {
      matched: matches,
      binding: matches ? {
        pattern: keyPattern,
        action: `matched_${keyPattern.key}`,
        description: `Key pattern match for ${key.keyCombo}`
      } : undefined,
      action: matches ? `matched_${keyPattern.key}` : undefined,
      consumed: matches
    };
  };
}

/**
 * Create multiple key matchers from an array of patterns
 */
export function createMultiKeyMatcher(patterns: (KeyPattern | string)[]): KeyMatcher {
  const matchers = patterns.map(createKeyMatcher);

  return (key: EnhancedKey, context?: string): KeyMatchResult => {
    for (const matcher of matchers) {
      const result = matcher(key, context);
      if (result.matched) {
        return result;
      }
    }

    return {
      matched: false,
      consumed: false
    };
  };
}

// ============================================================================
// Common Key Matchers
// ============================================================================

/**
 * Matcher for navigation keys
 */
export const navigationKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'up', modifiers: { ctrl: false, alt: false } },
  { key: 'down', modifiers: { ctrl: false, alt: false } },
  { key: 'left', modifiers: { ctrl: false, alt: false } },
  { key: 'right', modifiers: { ctrl: false, alt: false } },
  { key: 'home', modifiers: { ctrl: false, alt: false } },
  { key: 'end', modifiers: { ctrl: false, alt: false } },
  { key: 'pageup', modifiers: { ctrl: false, alt: false } },
  { key: 'pagedown', modifiers: { ctrl: false, alt: false } }
]);

/**
 * Matcher for confirmation keys
 */
export const confirmationKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'enter' },
  { key: ' ' }, // Space
  { key: 'y', modifiers: { ctrl: false, alt: false } } // Y for yes
]);

/**
 * Matcher for cancellation keys
 */
export const cancellationKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'esc' },
  { key: 'q', modifiers: { ctrl: false, alt: false } },
  { key: 'n', modifiers: { ctrl: false, alt: false } }, // N for no
  { key: 'ctrl+c' } // Ctrl+C
]);

/**
 * Matcher for selection keys
 */
export const selectionKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: ' ' }, // Space
  { key: 'enter' },
  { key: 'x', modifiers: { ctrl: false, alt: false } } // X for select
]);

/**
 * Matcher for help keys
 */
export const helpKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: '?' },
  { key: 'h', modifiers: { ctrl: false, alt: false } },
  { key: 'f1' }
]);

/**
 * Matcher for search keys
 */
export const searchKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: '/' },
  { key: 'ctrl+f' }
]);

/**
 * Matcher for quit/exit keys
 */
export const quitKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'q', modifiers: { ctrl: false, alt: false } },
  { key: 'esc' },
  { key: 'ctrl+c' },
  { key: 'ctrl+d' } // EOF
]);

/**
 * Matcher for copy/paste keys
 */
export const clipboardKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'ctrl+c' }, // Copy
  { key: 'ctrl+v' }, // Paste
  { key: 'ctrl+x' }, // Cut
  { key: 'ctrl+a' }  // Select all
]);

/**
 * Matcher for undo/redo keys
 */
export const undoKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'ctrl+z' }, // Undo
  { key: 'ctrl+y' }, // Redo
  { key: 'ctrl+shift+z' } // Alternative redo
]);

/**
 * Matcher for tab navigation
 */
export const tabNavigationMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'tab' },
  { key: 'shift+tab' }
]);

/**
 * Matcher for function keys
 */
export const functionKeyMatcher: KeyMatcher = createMultiKeyMatcher([
  { key: 'f1' },
  { key: 'f2' },
  { key: 'f3' },
  { key: 'f4' },
  { key: 'f5' },
  { key: 'f6' },
  { key: 'f7' },
  { key: 'f8' },
  { key: 'f9' },
  { key: 'f10' },
  { key: 'f11' },
  { key: 'f12' }
]);

// ============================================================================
// Key Binding System
// ============================================================================

/**
 * Key binding registry
 */
class KeyBindingRegistry {
  private bindings: Map<string, KeyBinding[]> = new Map();
  private categories: Map<string, KeyBinding[]> = new Map();

  /**
   * Register a key binding
   */
  register(binding: KeyBinding): void {
    const keyCombo = typeof binding.pattern === 'string'
      ? binding.pattern
      : createKeyComboString(binding.pattern.key, binding.pattern.modifiers || {});

    if (!this.bindings.has(keyCombo)) {
      this.bindings.set(keyCombo, []);
    }

    this.bindings.get(keyCombo)!.push(binding);

    // Register by category
    if (binding.category) {
      if (!this.categories.has(binding.category)) {
        this.categories.set(binding.category, []);
      }
      this.categories.get(binding.category)!.push(binding);
    }
  }

  /**
   * Unregister a key binding
   */
  unregister(action: string): void {
    for (const [keyCombo, bindings] of this.bindings) {
      const filtered = bindings.filter(b => b.action !== action);
      if (filtered.length === 0) {
        this.bindings.delete(keyCombo);
      } else {
        this.bindings.set(keyCombo, filtered);
      }
    }

    // Remove from categories
    for (const [category, bindings] of this.categories) {
      const filtered = bindings.filter(b => b.action !== action);
      if (filtered.length === 0) {
        this.categories.delete(category);
      } else {
        this.categories.set(category, filtered);
      }
    }
  }

  /**
   * Find binding for a key combination
   */
  findBinding(keyCombo: string, context?: string): KeyBinding | null {
    const bindings = this.bindings.get(keyCombo);
    if (!bindings) return null;

    // Find the most specific binding (with context match)
    let bestMatch: KeyBinding | null = null;

    for (const binding of bindings) {
      if (context && binding.context && binding.context !== context) {
        continue; // Context doesn't match
      }

      if (!bestMatch || (binding.context && !bestMatch.context)) {
        bestMatch = binding; // Prefer context-specific bindings
      }
    }

    return bestMatch || bindings[0]; // Fallback to first binding
  }

  /**
   * Get all bindings for a category
   */
  getBindingsByCategory(category: string): KeyBinding[] {
    return this.categories.get(category) || [];
  }

  /**
   * Get all registered bindings
   */
  getAllBindings(): KeyBinding[] {
    return Array.from(this.bindings.values()).flat();
  }

  /**
   * Clear all bindings
   */
  clear(): void {
    this.bindings.clear();
    this.categories.clear();
  }
}

/**
 * Global key binding registry instance
 */
export const keyBindingRegistry = new KeyBindingRegistry();

// ============================================================================
// Key Event Processing
// ============================================================================

/**
 * Process a key event and return matching actions
 */
export function processKeyEvent(key: Key, context?: string): KeyMatchResult {
  const enhancedKey = enhanceKey(key);

  // Check for quit combinations first (highest priority)
  const quitResult = quitKeyMatcher(enhancedKey, context);
  if (quitResult.matched) {
    return quitResult;
  }

  // Check for registered bindings
  const binding = keyBindingRegistry.findBinding(enhancedKey.keyCombo, context);
  if (binding) {
    return {
      matched: true,
      binding,
      action: binding.action,
      consumed: true
    };
  }

  // Check for common patterns
  const navigationResult = navigationKeyMatcher(enhancedKey, context);
  if (navigationResult.matched) {
    return navigationResult;
  }

  const helpResult = helpKeyMatcher(enhancedKey, context);
  if (helpResult.matched) {
    return helpResult;
  }

  const searchResult = searchKeyMatcher(enhancedKey, context);
  if (searchResult.matched) {
    return searchResult;
  }

  return {
    matched: false,
    consumed: false
  };
}

/**
 * Register common key bindings
 */
export function registerCommonKeyBindings(): void {
  // Navigation bindings
  keyBindingRegistry.register({
    pattern: { key: 'up' },
    action: 'navigate_up',
    description: 'Navigate up',
    category: 'navigation'
  });

  keyBindingRegistry.register({
    pattern: { key: 'down' },
    action: 'navigate_down',
    description: 'Navigate down',
    category: 'navigation'
  });

  keyBindingRegistry.register({
    pattern: { key: 'left' },
    action: 'navigate_left',
    description: 'Navigate left',
    category: 'navigation'
  });

  keyBindingRegistry.register({
    pattern: { key: 'right' },
    action: 'navigate_right',
    description: 'Navigate right',
    category: 'navigation'
  });

  // Confirmation bindings
  keyBindingRegistry.register({
    pattern: { key: 'enter' },
    action: 'confirm',
    description: 'Confirm action',
    category: 'interaction'
  });

  keyBindingRegistry.register({
    pattern: { key: ' ' },
    action: 'select',
    description: 'Select item',
    category: 'interaction'
  });

  // Cancellation bindings
  keyBindingRegistry.register({
    pattern: { key: 'esc' },
    action: 'cancel',
    description: 'Cancel action',
    category: 'interaction'
  });

  keyBindingRegistry.register({
    pattern: { key: 'ctrl+c' },
    action: 'quit',
    description: 'Quit application',
    category: 'system'
  });

  // Help bindings
  keyBindingRegistry.register({
    pattern: { key: '?' },
    action: 'show_help',
    description: 'Show help',
    category: 'help'
  });

  keyBindingRegistry.register({
    pattern: { key: 'h', modifiers: { ctrl: false, alt: false } },
    action: 'show_help',
    description: 'Show help',
    category: 'help'
  });

  // Search bindings
  keyBindingRegistry.register({
    pattern: { key: '/' },
    action: 'start_search',
    description: 'Start search',
    category: 'search'
  });

  keyBindingRegistry.register({
    pattern: { key: 'ctrl+f' },
    action: 'start_search',
    description: 'Start search',
    category: 'search'
  });
}

/**
 * Key sequence detector for multi-key combinations
 */
export class KeySequenceDetector {
  private sequence: string[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private sequenceTimeout = 1000; // 1 second

  /**
   * Add a key to the current sequence
   */
  addKey(keyCombo: string): string[] {
    // Clear existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Add key to sequence
    this.sequence.push(keyCombo);

    // Set timeout to clear sequence
    this.timeout = setTimeout(() => {
      this.sequence = [];
    }, this.sequenceTimeout);

    return [...this.sequence];
  }

  /**
   * Check if current sequence matches a pattern
   */
  matchesPattern(pattern: string[]): boolean {
    if (this.sequence.length !== pattern.length) {
      return false;
    }

    return this.sequence.every((key, index) => key === pattern[index]);
  }

  /**
   * Get current sequence
   */
  getCurrentSequence(): string[] {
    return [...this.sequence];
  }

  /**
   * Clear the current sequence
   */
  clear(): void {
    this.sequence = [];
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  /**
   * Set sequence timeout
   */
  setTimeout(ms: number): void {
    this.sequenceTimeout = ms;
  }
}

/**
 * Global key sequence detector instance
 */
export const keySequenceDetector = new KeySequenceDetector();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a key combination is a modifier-only combination
 */
export function isModifierOnly(key: EnhancedKey): boolean {
  return !key.input && !key.name && Object.values(key.modifiers).some(Boolean);
}

/**
 * Get human-readable description of a key combination
 */
export function describeKeyCombo(keyCombo: string): string {
  const { key, modifiers } = parseKeyCombo(keyCombo);
  const parts: string[] = [];

  if (modifiers.ctrl) parts.push('Ctrl');
  if (modifiers.alt) parts.push('Alt');
  if (modifiers.shift) parts.push('Shift');
  if (modifiers.meta) parts.push('Cmd');

  // Format key name
  let keyName = key.toUpperCase();
  if (keyName === ' ') keyName = 'Space';
  if (keyName === 'ESC') keyName = 'Escape';
  if (keyName.length === 1) keyName = keyName.toUpperCase();

  parts.push(keyName);

  return parts.join('+');
}

/**
 * Validate a key combination string
 */
export function isValidKeyCombo(combo: string): boolean {
  try {
    const { key, modifiers } = parseKeyCombo(combo);

    // Key must be present
    if (!key) return false;

    // Check for conflicting modifiers
    if (modifiers.ctrl && modifiers.meta) {
      // Ctrl+Meta combinations are usually not valid
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize key combination for comparison
 */
export function normalizeKeyCombo(combo: string): string {
  const { key, modifiers } = parseKeyCombo(combo);

  // Create normalized combination
  const parts: string[] = [];

  // Add modifiers in consistent order
  if (modifiers.ctrl) parts.push('ctrl');
  if (modifiers.alt) parts.push('alt');
  if (modifiers.shift) parts.push('shift');
  if (modifiers.meta) parts.push('meta');

  parts.push(key);

  return parts.join('+');
}

/**
 * Check if two key combinations are equivalent
 */
export function areKeyCombosEquivalent(combo1: string, combo2: string): boolean {
  return normalizeKeyCombo(combo1) === normalizeKeyCombo(combo2);
}

/**
 * Get all possible key combinations for a key (with different modifiers)
 */
export function getKeyComboVariations(key: string): string[] {
  const baseKey = key.toLowerCase();
  const variations: string[] = [baseKey];

  // Add modifier combinations
  const modifiers = ['ctrl', 'alt', 'shift', 'meta'];

  // Generate combinations (excluding some invalid ones)
  for (let i = 1; i < Math.pow(2, modifiers.length); i++) {
    const comboParts: string[] = [];
    let isValid = true;

    for (let j = 0; j < modifiers.length; j++) {
      if (i & (1 << j)) {
        const mod = modifiers[j];

        // Skip invalid combinations
        if ((mod === 'ctrl' && comboParts.includes('meta')) ||
            (mod === 'meta' && comboParts.includes('ctrl'))) {
          isValid = false;
          break;
        }

        comboParts.push(mod);
      }
    }

    if (isValid && comboParts.length > 0) {
      variations.push([...comboParts, baseKey].join('+'));
    }
  }

  return variations;
}

// ============================================================================
// Integration Helpers
// ============================================================================

/**
 * Create a key event handler for Ink components
 */
export function createKeyHandler(
  onKeyMatch: (result: KeyMatchResult) => void,
  context?: string
) {
  return (input: string, key: Key) => {
    const result = processKeyEvent(key, context);
    if (result.matched) {
      onKeyMatch(result);
    }
  };
}

/**
 * Register key bindings from a configuration object
 */
export function registerKeyBindingsFromConfig(bindings: KeyBinding[]): void {
  bindings.forEach(binding => {
    keyBindingRegistry.register(binding);
  });
}

/**
 * Get key binding help text
 */
export function getKeyBindingHelp(category?: string): Array<{
  combo: string;
  description: string;
  category: string;
}> {
  const bindings = category
    ? keyBindingRegistry.getBindingsByCategory(category)
    : keyBindingRegistry.getAllBindings();

  return bindings.map(binding => ({
    combo: typeof binding.pattern === 'string'
      ? binding.pattern
      : createKeyComboString(binding.pattern.key, binding.pattern.modifiers || {}),
    description: binding.description || binding.action,
    category: binding.category || 'general'
  }));
}

// ============================================================================
// Default Exports
// ============================================================================

/**
 * Initialize key matchers with common bindings
 */
export function initializeKeyMatchers(): void {
  registerCommonKeyBindings();
}

/**
 * Default export with key utilities
 */
export default {
  enhanceKey,
  createKeyMatcher,
  processKeyEvent,
  keyBindingRegistry,
  keySequenceDetector,
  registerCommonKeyBindings,
  getKeyBindingHelp
};
