import React from 'react';
import { Box, Text } from 'ink';
import { useAppContext } from '../AppContext';
import { COLORS, AXILO_UI, PROMPTS } from '../constants';

/**
 * Command router component
 *
 * Routes between different CLI views based on the current command
 */
export const CommandRouter: React.FC<{ currentCommand: string | null }> = ({
  currentCommand
}) => {
  const { dimensions } = useAppContext();

  if (!currentCommand) {
    return <WelcomeView />;
  }

  // Route to appropriate view based on command
  switch (currentCommand) {
    case 'help':
      return <HelpView />;

    case 'chat':
      return <ChatView />;

    case 'generate':
      return <GenerateView />;

    case 'analyze':
      return <AnalyzeView />;

    case 'test':
      return <TestView />;

    case 'config':
      return <ConfigView />;

    default:
      return <UnknownCommandView command={currentCommand} />;
  }
};

/**
 * Welcome view - shown when no command is active
 */
const WelcomeView: React.FC = () => {
  const { dimensions } = useAppContext();

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" height={dimensions.height - 8}>
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          {AXILO_UI.LOGO}
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={AXILO_UI.BRAND_SECONDARY}>
          {AXILO_UI.TAGLINE}
        </Text>
      </Box>

      <Box marginY={2} width={Math.min(dimensions.width - 8, 60)}>
        <Text color={COLORS.BRIGHT_WHITE} dimColor wrap="wrap">
          Welcome to AXILO! Your AI-powered development assistant is ready to help.
          Type 'help' for available commands or start with a specific task.
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.BRIGHT_BLACK} dimColor>
          {PROMPTS.PRIMARY} Ready for your next command...
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Help view - shows available commands and usage
 */
const HelpView: React.FC = () => {
  const commands = [
    { command: 'chat', description: 'Start an AI conversation' },
    { command: 'generate', description: 'Generate code or documentation' },
    { command: 'analyze', description: 'Analyze code or performance' },
    { command: 'test', description: 'Generate or run tests' },
    { command: 'config', description: 'Manage AXILO configuration' },
    { command: 'help', description: 'Show this help message' },
    { command: 'quit', description: 'Exit AXILO CLI' }
  ];

  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          {AXILO_UI.LOGO} - Available Commands
        </Text>
      </Box>

      <Box flexDirection="column">
        {commands.map(({ command, description }) => (
          <Box key={command} marginBottom={1}>
            <Text color={COLORS.CYAN}>
              {command.padEnd(12)}
            </Text>
            <Text color={COLORS.BRIGHT_WHITE}>
              {description}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text color={COLORS.BRIGHT_BLACK} dimColor>
          Use Tab to cycle through commands, Enter to select, Esc to cancel
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Chat view - AI conversation interface
 */
const ChatView: React.FC = () => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          💬 AI Chat
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.BRIGHT_WHITE}>
          AI chat interface coming soon...
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Generate view - Code generation interface
 */
const GenerateView: React.FC = () => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          🚀 Code Generation
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.BRIGHT_WHITE}>
          Code generation interface coming soon...
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Analyze view - Code analysis interface
 */
const AnalyzeView: React.FC = () => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          🔍 Code Analysis
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.BRIGHT_WHITE}>
          Code analysis interface coming soon...
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Test view - Testing interface
 */
const TestView: React.FC = () => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          🧪 Testing
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.BRIGHT_WHITE}>
          Testing interface coming soon...
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Config view - Configuration management
 */
const ConfigView: React.FC = () => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          ⚙️ Configuration
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.BRIGHT_WHITE}>
          Configuration management interface coming soon...
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Unknown command view
 */
const UnknownCommandView: React.FC<{ command: string }> = ({ command }) => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={2}>
        <Text color={COLORS.RED} bold>
          {AXILO_UI.ERROR} Unknown Command
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={COLORS.BRIGHT_WHITE}>
          Command '{command}' was not recognized.
        </Text>
      </Box>

      <Box>
        <Text color={COLORS.YELLOW}>
          Type 'help' to see available commands.
        </Text>
      </Box>
    </Box>
  );
};
