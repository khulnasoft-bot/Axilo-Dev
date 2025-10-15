import React, { Component, ReactNode } from 'react';
import { Box, Text } from 'ink';
import { useAppContext } from '../AppContext';
import { COLORS, AXILO_UI, STATUS } from '../constants';

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error boundary component for AXILO CLI
 *
 * Catches React errors and displays a user-friendly error message
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error for debugging (in production, send to error reporting service)
    console.error('CLI Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Error fallback component
 */
interface ErrorFallbackProps {
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const { setError, clearError } = useAppContext();

  // Set error in app context for global error handling
  React.useEffect(() => {
    if (error) {
      setError(`UI Error: ${error.message}`);
    }
  }, [error, setError]);

  return (
    <Box flexDirection="column" padding={2}>
      <Box marginBottom={2}>
        <Text color={COLORS.RED} bold>
          {STATUS.ERROR} UI Error
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={COLORS.BRIGHT_WHITE}>
          Something went wrong with the CLI interface.
        </Text>
      </Box>

      {error && (
        <Box marginBottom={2}>
          <Text color={COLORS.YELLOW} dimColor>
            Error: {error.message}
          </Text>
        </Box>
      )}

      <Box>
        <Text color={COLORS.BRIGHT_BLACK} dimColor>
          The CLI will attempt to recover. If this persists, please restart.
        </Text>
      </Box>
    </Box>
  );
};
