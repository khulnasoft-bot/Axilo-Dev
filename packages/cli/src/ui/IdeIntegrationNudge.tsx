import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useAppContext } from './contexts/AppContext';
import { useConfig } from './contexts/ConfigContext';
import { useTheme } from './themes/theme';
import { COLORS, PROMPTS, STATUS, LAYOUT } from './constants';

/**
 * Props for IdeIntegrationNudge component
 */
export interface IdeIntegrationNudgeProps {
  /** Whether to show the nudge */
  show?: boolean;
  /** Custom message to display */
  message?: string;
  /** Callback when user dismisses the nudge */
  onDismiss?: () => void;
  /** Callback when user wants to install integration */
  onInstall?: () => void;
  /** Whether this is a compact version */
  compact?: boolean;
}

/**
 * IDE Integration Nudge Component
 *
 * Displays helpful prompts and information about AXILO IDE integration,
 * encouraging users to install the VS Code extension for enhanced development experience.
 */
export const IdeIntegrationNudge: React.FC<IdeIntegrationNudgeProps> = ({
  show = true,
  message,
  onDismiss,
  onInstall,
  compact = false
}) => {
  const { dimensions } = useAppContext();
  const { getEffectiveTheme } = useConfig();
  const theme = useTheme();

  // Handle keyboard input
  useInput((input, key) => {
    if (!show) return;

    if (key.escape || input === 'q') {
      onDismiss?.();
    } else if (input === 'i' || (key.ctrl && input === 'i')) {
      onInstall?.();
    } else if (input === 'h' || input === '?') {
      // Show help (could navigate to help view)
    }
  });

  if (!show) {
    return null;
  }

  const currentTheme = getEffectiveTheme();
  const isDark = currentTheme === 'dark';

  if (compact) {
    return <CompactNudge onDismiss={onDismiss} onInstall={onInstall} />;
  }

  return (
    <Box
      borderStyle="single"
      borderColor={theme.colors.accent}
      paddingX={2}
      paddingY={1}
      marginY={1}
      width={Math.min(dimensions.width - 4, 80)}
    >
      <Box flexDirection="column">
        {/* Header */}
        <Box marginBottom={1}>
          <Text color={theme.colors.accent} bold>
            🚀 AXILO IDE Integration
          </Text>
        </Box>

        {/* Main message */}
        <Box marginBottom={1}>
          <Text color={theme.colors.text}>
            {message || (
              <>
                Enhance your development experience with{' '}
                <Text color={theme.colors.primary} bold>AXILO IDE Integration</Text>!
                Get AI-powered assistance directly in your code editor.
              </>
            )}
          </Text>
        </Box>

        {/* Benefits */}
        <Box marginBottom={2}>
          <Text color={theme.colors.info}>
            ✨ Benefits:
          </Text>
          <Box marginLeft={2}>
            <Text color={theme.colors.text}>• Real-time code suggestions</Text>
          </Box>
          <Box marginLeft={2}>
            <Text color={theme.colors.text}>• Interactive AI chat in your editor</Text>
          </Box>
          <Box marginLeft={2}>
            <Text color={theme.colors.text}>• Code analysis and optimization</Text>
          </Box>
          <Box marginLeft={2}>
            <Text color={theme.colors.text}>• Test generation and documentation</Text>
          </Box>
        </Box>

        {/* VS Code Extension highlight */}
        <Box
          borderStyle="single"
          borderColor={theme.colors.primary}
          paddingX={1}
          paddingY={1}
          marginBottom={2}
          backgroundColor={theme.colors.surface}
        >
          <Text color={theme.colors.primary} bold>
            💻 VS Code Extension Available!
          </Text>
          <Box marginTop={1}>
            <Text color={theme.colors.text}>
              Install the{' '}
              <Text color={theme.colors.accent} bold>@axilo/vscode-ide-companion</Text>{' '}
              extension for seamless IDE integration.
            </Text>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box flexDirection="row" justifyContent="space-between">
          <Box>
            <Text color={theme.colors.success}>
              [I] Install Extension
            </Text>
          </Box>
          <Box>
            <Text color={theme.colors.info}>
              [?] Help
            </Text>
          </Box>
          <Box>
            <Text color={theme.colors.warning}>
              [Q/Esc] Dismiss
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Compact version of the nudge for smaller spaces
 */
const CompactNudge: React.FC<{
  onDismiss?: () => void;
  onInstall?: () => void;
}> = ({ onDismiss, onInstall }) => {
  const { getEffectiveTheme } = useConfig();
  const theme = useTheme();

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onDismiss?.();
    } else if (input === 'i' || (key.ctrl && input === 'i')) {
      onInstall?.();
    }
  });

  const currentTheme = getEffectiveTheme();

  return (
    <Box
      borderStyle="single"
      borderColor={theme.colors.accent}
      paddingX={1}
      paddingY={1}
      marginY={1}
    >
      <Box flexDirection="row" alignItems="center">
        <Text color={theme.colors.accent}>
          🚀
        </Text>
        <Box marginLeft={1} marginRight={2}>
          <Text color={theme.colors.text}>
            Try AXILO IDE integration!
          </Text>
        </Box>
        <Text color={theme.colors.success} dimColor>
          [I] Install
        </Text>
        <Box marginLeft={2}>
          <Text color={theme.colors.warning} dimColor>
            [Q] Dismiss
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * IDE Integration Status Component
 *
 * Shows current IDE integration status and provides quick actions
 */
export const IdeIntegrationStatus: React.FC<{
  showActions?: boolean;
  compact?: boolean;
}> = ({ showActions = true, compact = false }) => {
  const { dimensions } = useAppContext();
  const { getEffectiveTheme } = useConfig();
  const theme = useTheme();

  const currentTheme = getEffectiveTheme();

  // Mock integration status - in real implementation, check actual status
  const integrationStatus = {
    vscode: {
      installed: false,
      version: null,
      enabled: false
    },
    otherIdes: []
  };

  if (compact) {
    return (
      <Box flexDirection="row" alignItems="center">
        <Text color={integrationStatus.vscode.installed ? theme.colors.success : theme.colors.warning}>
          {integrationStatus.vscode.installed ? STATUS.SUCCESS : STATUS.WARNING}
        </Text>
        <Box marginLeft={1}>
          <Text color={theme.colors.text} dimColor>
            IDE Integration
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      borderStyle="single"
      borderColor={theme.colors.border}
      paddingX={2}
      paddingY={1}
      marginY={1}
      width={Math.min(dimensions.width - 4, 60)}
    >
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text color={theme.colors.primary} bold>
            IDE Integration Status
          </Text>
        </Box>

        {/* VS Code Status */}
        <Box marginBottom={1}>
          <Box flexDirection="row" alignItems="center" marginBottom={1}>
            <Text color={integrationStatus.vscode.installed ? theme.colors.success : theme.colors.warning}>
              {integrationStatus.vscode.installed ? STATUS.SUCCESS : STATUS.WARNING}
            </Text>
            <Box marginLeft={1}>
              <Text color={theme.colors.text}>
                Visual Studio Code
              </Text>
            </Box>
          </Box>

          {integrationStatus.vscode.installed ? (
            <Box marginLeft={2}>
              <Text color={theme.colors.success} dimColor>
                ✓ Extension installed and active
              </Text>
              {integrationStatus.vscode.version && (
                <Text color={theme.colors.info} dimColor>
                  Version: {integrationStatus.vscode.version}
                </Text>
              )}
            </Box>
          ) : (
            <Box marginLeft={2}>
              <Text color={theme.colors.warning} dimColor>
                Extension not installed
              </Text>
              <Text color={theme.colors.info} dimColor>
                Install for enhanced IDE experience
              </Text>
            </Box>
          )}
        </Box>

        {/* Other IDEs */}
        {integrationStatus.otherIdes.length > 0 && (
          <Box marginBottom={1}>
            <Text color={theme.colors.info} bold>
              Other IDEs:
            </Text>
            {integrationStatus.otherIdes.map((ide, index) => (
              <Box key={index} marginLeft={2}>
                <Text color={theme.colors.text}>
                  {ide.name}: {ide.status}
                </Text>
              </Box>
            ))}
          </Box>
        )}

        {/* Actions */}
        {showActions && (
          <Box marginTop={1}>
            <Text color={theme.colors.info} dimColor>
              💡 Tip: Use IDE integration for the best AXILO experience
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

/**
 * IDE Integration Tips Component
 *
 * Shows helpful tips and tricks for using AXILO with IDEs
 */
export const IdeIntegrationTips: React.FC<{
  showAdvanced?: boolean;
}> = ({ showAdvanced = false }) => {
  const { dimensions } = useAppContext();
  const { getEffectiveTheme } = useConfig();
  const theme = useTheme();

  const currentTheme = getEffectiveTheme();

  const tips = [
    {
      icon: '💬',
      title: 'AI Chat in Editor',
      description: 'Use Ctrl+Shift+P → "AXILO: Open AI Chat" for instant help'
    },
    {
      icon: '🚀',
      title: 'Quick Code Generation',
      description: 'Right-click in editor → "AXILO: Generate Code"'
    },
    {
      icon: '🔍',
      title: 'Code Analysis',
      description: 'Select code → "AXILO: Analyze Code" for insights'
    },
    {
      icon: '🧪',
      title: 'Test Generation',
      description: 'Generate unit tests automatically with AI'
    }
  ];

  const advancedTips = [
    {
      icon: '⚙️',
      title: 'Custom Configuration',
      description: 'Configure API keys and model preferences in VS Code settings'
    },
    {
      icon: '🎨',
      title: 'Theme Integration',
      description: 'AXILO adapts to your VS Code theme automatically'
    },
    {
      icon: '🔧',
      title: 'Extension Development',
      description: 'Build custom extensions using the AXILO Extension API'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Track your coding patterns and productivity metrics'
    }
  ];

  const allTips = showAdvanced ? [...tips, ...advancedTips] : tips;

  return (
    <Box
      borderStyle="single"
      borderColor={theme.colors.primary}
      paddingX={2}
      paddingY={1}
      marginY={1}
      width={Math.min(dimensions.width - 4, 70)}
    >
      <Box flexDirection="column">
        <Box marginBottom={2}>
          <Text color={theme.colors.primary} bold>
            💡 AXILO IDE Integration Tips
          </Text>
        </Box>

        <Box flexDirection="column">
          {allTips.map((tip, index) => (
            <Box key={index} marginBottom={1}>
              <Box flexDirection="row" marginBottom={1}>
                <Text color={theme.colors.accent}>
                  {tip.icon}
                </Text>
                <Box marginLeft={1}>
                  <Text color={theme.colors.text} bold>
                    {tip.title}
                  </Text>
                </Box>
              </Box>
              <Box marginLeft={3}>
                <Text color={theme.colors.info} dimColor>
                  {tip.description}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>

        {showAdvanced && (
          <Box marginTop={2}>
            <Text color={theme.colors.warning} dimColor>
              🔧 Advanced features available with full IDE integration
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

/**
 * IDE Integration Banner Component
 *
 * A prominent banner that appears at the top of the CLI interface
 * to highlight IDE integration availability
 */
export const IdeIntegrationBanner: React.FC<{
  variant?: 'info' | 'success' | 'warning';
  dismissible?: boolean;
  onDismiss?: () => void;
}> = ({
  variant = 'info',
  dismissible = true,
  onDismiss
}) => {
  const { getEffectiveTheme } = useConfig();
  const theme = useTheme();

  const currentTheme = getEffectiveTheme();

  useInput((input, key) => {
    if (dismissible && (key.escape || input === 'q' || input === 'd')) {
      onDismiss?.();
    }
  });

  const variantStyles = {
    info: {
      borderColor: theme.colors.info,
      bgColor: theme.colors.surface,
      icon: 'ℹ️'
    },
    success: {
      borderColor: theme.colors.success,
      bgColor: theme.colors.surface,
      icon: '✅'
    },
    warning: {
      borderColor: theme.colors.warning,
      bgColor: theme.colors.surface,
      icon: '⚠️'
    }
  };

  const style = variantStyles[variant];

  return (
    <Box
      borderStyle="single"
      borderColor={style.borderColor}
      backgroundColor={style.bgColor}
      paddingX={2}
      paddingY={1}
      marginY={1}
    >
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center">
          <Text color={style.borderColor}>
            {style.icon}
          </Text>
          <Box marginLeft={1}>
            <Text color={theme.colors.text}>
              <Text color={theme.colors.primary} bold>AXILO</Text> IDE integration available!{' '}
              <Text color={theme.colors.accent}>Install VS Code extension</Text> for enhanced development experience.
            </Text>
          </Box>
        </Box>

        {dismissible && (
          <Text color={theme.colors.muted} dimColor>
            [Q/Dismiss]
          </Text>
        )}
      </Box>
    </Box>
  );
};

/**
 * Default export
 */
export default IdeIntegrationNudge;
