import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useAppContext } from '../AppContext';
import { SPINNERS, getSpinnerFrames } from '../constants';

/**
 * Loading spinner component props
 */
interface LoadingSpinnerProps {
  message?: string;
  spinner?: keyof typeof SPINNERS;
  color?: string;
}

/**
 * Loading spinner component for AXILO CLI
 *
 * Displays an animated spinner with optional message
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  spinner = 'DOTS',
  color
}) => {
  const { theme } = useAppContext();
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = getSpinnerFrames(spinner);

  // Animate the spinner
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, 100);

    return () => clearInterval(interval);
  }, [frames.length]);

  const spinnerColor = color || theme.primary;

  return (
    <Box>
      <Text color={spinnerColor}>
        {frames[frameIndex]}
      </Text>
      <Text color={theme.info} marginLeft={1}>
        {message}
      </Text>
    </Box>
  );
};
