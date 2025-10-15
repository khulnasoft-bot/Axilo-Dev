import React from 'react';
import { Box, Text } from 'ink';
import { useAppContext } from '../AppContext';
import { COLORS, KEY_BINDINGS, AXILO_UI } from '../constants';

/**
 * Footer component for AXILO CLI
 *
 * Displays help information, key bindings, and status messages
 */
export const Footer: React.FC = () => {
  const { commandHistory, dimensions } = useAppContext();

  const footerWidth = Math.min(dimensions.width - 4, 80);

  return (
    <Box
      borderStyle="single"
      borderColor={COLORS.BRIGHT_BLACK}
      paddingX={2}
      paddingY={1}
      width={footerWidth}
      marginX={2}
      marginTop={1}
    >
      <Box flexDirection="column">
        {/* Help information */}
        <Box marginBottom={1}>
          <Text color={COLORS.BRIGHT_BLACK} dimColor>
            💡 Tips: Use {KEY_BINDINGS.HELP} for help, {KEY_BINDINGS.QUIT} to quit, {KEY_BINDINGS.UP}/{KEY_BINDINGS.DOWN} to navigate
          </Text>
        </Box>

        {/* Recent commands */}
        {commandHistory.length > 0 && (
          <Box>
            <Text color={COLORS.BRIGHT_BLACK} dimColor>
              Recent: {commandHistory.slice(-3).join(' • ')}
            </Text>
          </Box>
        )}

        {/* Status line */}
        <Box justifyContent="center" marginTop={1}>
          <Text color={AXILO_UI.BRAND_PRIMARY} dimColor>
            {AXILO_UI.READY}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
