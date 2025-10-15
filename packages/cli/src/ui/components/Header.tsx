import React from 'react';
import { Box, Text } from 'ink';
import { useAppContext } from '../AppContext';
import { AXILO_UI, COLORS, LAYOUT, STATUS } from '../constants';

/**
 * Header component for AXILO CLI
 *
 * Displays the application branding, version, and current status
 */
export const Header: React.FC = () => {
  const { currentCommand, isLoading, theme, dimensions } = useAppContext();

  const headerWidth = Math.min(dimensions.width - 4, 80);

  return (
    <Box
      borderStyle="single"
      borderColor={theme.primary}
      paddingX={2}
      paddingY={1}
      width={headerWidth}
      marginX={2}
    >
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        {/* Left side - Logo and branding */}
        <Box flexDirection="row">
          <Text color={AXILO_UI.BRAND_PRIMARY} bold>
            {AXILO_UI.LOGO}
          </Text>
          <Box marginLeft={1}>
            <Text color={theme.info} dimColor>
              {AXILO_UI.TAGLINE}
            </Text>
          </Box>
        </Box>

        {/* Right side - Status and version */}
        <Box flexDirection="row" alignItems="center">
          {isLoading && (
            <Box marginRight={2}>
              <Text color={theme.warning}>
                {STATUS.LOADING}
              </Text>
            </Box>
          )}

          {currentCommand && (
            <Box marginRight={2}>
              <Text color={theme.info} dimColor>
                {currentCommand}
              </Text>
            </Box>
          )}

          <Text color={theme.muted} dimColor>
            v0.1.0
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
