import React from 'react';
import { Box, Text } from 'ink';
import { useAppContext } from '../AppContext';
import { COLORS, LAYOUT, AXILO_UI } from '../constants';

/**
 * Layout section configuration
 */
export interface LayoutSection {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  flexGrow?: number;
  minHeight?: number;
  maxHeight?: number;
  show?: boolean;
}

/**
 * Layout configuration interface
 */
export interface LayoutConfig {
  sections: LayoutSection[];
  spacing?: number;
  padding?: number;
  border?: boolean;
  responsive?: boolean;
}

/**
 * Props for DefaultAppLayout
 */
export interface DefaultAppLayoutProps {
  config?: Partial<LayoutConfig>;
  children?: React.ReactNode;
  showBranding?: boolean;
  showStatus?: boolean;
  showNavigation?: boolean;
}

/**
 * Default layout configuration
 */
const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  sections: [
    {
      id: 'header',
      component: 'Header',
      flexGrow: 0,
      minHeight: 3
    },
    {
      id: 'main',
      component: 'MainContent',
      flexGrow: 1,
      minHeight: 10
    },
    {
      id: 'sidebar',
      component: 'Sidebar',
      flexGrow: 0,
      show: false, // Hidden by default, shown when needed
      minHeight: 5
    },
    {
      id: 'footer',
      component: 'Footer',
      flexGrow: 0,
      minHeight: 3
    }
  ],
  spacing: 0,
  padding: 0,
  border: false,
  responsive: true
};

/**
 * Default App Layout for AXILO CLI
 *
 * Provides the main structural layout for the interactive CLI interface.
 * Organizes content into logical sections and handles responsive design.
 */
export const DefaultAppLayout: React.FC<DefaultAppLayoutProps> = ({
  config = {},
  children,
  showBranding = true,
  showStatus = true,
  showNavigation = false
}) => {
  const { dimensions, currentCommand, isLoading } = useAppContext();

  // Merge configurations
  const layoutConfig: LayoutConfig = {
    ...DEFAULT_LAYOUT_CONFIG,
    ...config,
    sections: config.sections || DEFAULT_LAYOUT_CONFIG.sections
  };

  // Responsive layout adjustments
  const adjustedConfig = React.useMemo(() => {
    if (!layoutConfig.responsive) return layoutConfig;

    const { width, height } = dimensions;
    const isNarrow = width < 60;
    const isShort = height < 20;

    return {
      ...layoutConfig,
      sections: layoutConfig.sections.map(section => {
        if (isNarrow && section.id === 'sidebar') {
          return { ...section, show: false };
        }
        if (isShort && (section.id === 'sidebar' || section.id === 'footer')) {
          return { ...section, show: false };
        }
        return section;
      })
    };
  }, [layoutConfig, dimensions]);

  // Render layout sections
  const renderSections = () => {
    return adjustedConfig.sections
      .filter(section => section.show !== false)
      .map((section, index) => {
        const SectionComponent = getSectionComponent(section.component);

        return (
          <React.Fragment key={section.id}>
            <SectionComponent
              {...section.props}
              minHeight={section.minHeight}
              maxHeight={section.maxHeight}
            />
            {/* Add spacing between sections except for the last one */}
            {index < adjustedConfig.sections.length - 1 && adjustedConfig.spacing !== 0 && (
              <Box height={adjustedConfig.spacing || 0} />
            )}
          </React.Fragment>
        );
      });
  };

  return (
    <Box
      flexDirection="column"
      height={dimensions.height}
      width={dimensions.width}
      padding={adjustedConfig.padding}
    >
      {/* Optional branding overlay */}
      {showBranding && (
        <BrandingOverlay />
      )}

      {/* Main layout structure */}
      <Box flexDirection="column" flexGrow={1}>
        {renderSections()}
      </Box>

      {/* Global status indicator */}
      {showStatus && (
        <StatusIndicator />
      )}

      {/* Children content (for custom layouts) */}
      {children}
    </Box>
  );
};

/**
 * Get section component by name
 */
function getSectionComponent(componentName: string): React.ComponentType<any> {
  switch (componentName) {
    case 'Header':
      return HeaderSection;
    case 'MainContent':
      return MainContentSection;
    case 'Sidebar':
      return SidebarSection;
    case 'Footer':
      return FooterSection;
    default:
      return DefaultSection;
  }
}

/**
 * Header section component
 */
const HeaderSection: React.FC<{ minHeight?: number; maxHeight?: number }> = ({
  minHeight = 3,
  maxHeight
}) => {
  const { currentCommand, isLoading, theme } = useAppContext();

  return (
    <Box
      borderStyle="single"
      borderColor={theme.primary}
      paddingX={2}
      paddingY={1}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        {/* Left side - Logo and branding */}
        <Box flexDirection="row">
          <Text color={AXILO_UI.BRAND_PRIMARY} bold>
            {AXILO_UI.LOGO}
          </Text>
          <Box marginLeft={1}>
            <Text color={theme.info} dimColor>
              Interactive Mode
            </Text>
          </Box>
        </Box>

        {/* Right side - Status */}
        <Box flexDirection="row" alignItems="center">
          {isLoading && (
            <Box marginRight={2}>
              <Text color={theme.warning}>●</Text>
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

/**
 * Main content section component
 */
const MainContentSection: React.FC<{ minHeight?: number; maxHeight?: number }> = ({
  minHeight = 10,
  maxHeight
}) => {
  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      minHeight={minHeight}
      maxHeight={maxHeight}
      paddingX={1}
    >
      {/* This will be filled by CommandRouter or other content */}
      <Box flexGrow={1} justifyContent="center" alignItems="center">
        <Text color={COLORS.BRIGHT_BLACK} dimColor>
          Main content area - ready for commands
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Sidebar section component
 */
const SidebarSection: React.FC<{ minHeight?: number; maxHeight?: number }> = ({
  minHeight = 5,
  maxHeight
}) => {
  const { dimensions } = useAppContext();

  // Only show sidebar if terminal is wide enough
  if (dimensions.width < 100) {
    return null;
  }

  return (
    <Box
      width={25}
      borderStyle="single"
      borderColor={COLORS.BRIGHT_BLACK}
      paddingX={1}
      paddingY={1}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <Box flexDirection="column">
        <Text color={COLORS.BRIGHT_WHITE} bold marginBottom={1}>
          Navigation
        </Text>

        <Box marginBottom={1}>
          <Text color={COLORS.BRIGHT_BLACK}>• chat</Text>
        </Box>
        <Box marginBottom={1}>
          <Text color={COLORS.BRIGHT_BLACK}>• generate</Text>
        </Box>
        <Box marginBottom={1}>
          <Text color={COLORS.BRIGHT_BLACK}>• analyze</Text>
        </Box>
        <Box marginBottom={1}>
          <Text color={COLORS.BRIGHT_BLACK}>• test</Text>
        </Box>
        <Box>
          <Text color={COLORS.BRIGHT_BLACK}>• config</Text>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Footer section component
 */
const FooterSection: React.FC<{ minHeight?: number; maxHeight?: number }> = ({
  minHeight = 3,
  maxHeight
}) => {
  return (
    <Box
      borderStyle="single"
      borderColor={COLORS.BRIGHT_BLACK}
      paddingX={2}
      paddingY={1}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Text color={COLORS.BRIGHT_BLACK} dimColor>
          💡 Tips: Use ? for help, Ctrl+C to exit
        </Text>

        <Text color={AXILO_UI.BRAND_PRIMARY} dimColor>
          {AXILO_UI.READY}
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Default section component for unknown sections
 */
const DefaultSection: React.FC<{ minHeight?: number; maxHeight?: number }> = ({
  minHeight = 3,
  maxHeight
}) => {
  return (
    <Box
      borderStyle="single"
      borderColor={COLORS.BRIGHT_BLACK}
      padding={1}
      minHeight={minHeight}
      maxHeight={maxHeight}
    >
      <Text color={COLORS.BRIGHT_BLACK} dimColor>
        Section placeholder
      </Text>
    </Box>
  );
};

/**
 * Branding overlay component
 */
const BrandingOverlay: React.FC = () => {
  const { dimensions } = useAppContext();

  // Only show branding overlay on very wide terminals
  if (dimensions.width < 120) {
    return null;
  }

  return (
    <Box position="absolute" top={1} right={1}>
      <Text color={AXILO_UI.BRAND_PRIMARY} dimColor>
        🚀
      </Text>
    </Box>
  );
};

/**
 * Status indicator component
 */
const StatusIndicator: React.FC = () => {
  const { currentCommand, isLoading } = useAppContext();

  return (
    <Box position="absolute" bottom={1} right={1}>
      {isLoading ? (
        <Text color={COLORS.YELLOW}>●</Text>
      ) : currentCommand ? (
        <Text color={COLORS.GREEN}>●</Text>
      ) : (
        <Text color={COLORS.BRIGHT_BLACK}>●</Text>
      )}
    </Box>
  );
};

/**
 * Alternative compact layout for small terminals
 */
export const CompactLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { dimensions } = useAppContext();

  if (dimensions.width >= 80) {
    return <DefaultAppLayout>{children}</DefaultAppLayout>;
  }

  return (
    <Box flexDirection="column" height={dimensions.height}>
      {/* Minimal header */}
      <Box paddingX={1} paddingY={1}>
        <Text color={AXILO_UI.BRAND_PRIMARY} bold>
          {AXILO_UI.LOGO}
        </Text>
      </Box>

      {/* Main content */}
      <Box flexGrow={1} paddingX={1}>
        {children}
      </Box>

      {/* Minimal footer */}
      <Box paddingX={1} paddingY={1}>
        <Text color={COLORS.BRIGHT_BLACK} dimColor>
          ? help | Ctrl+C exit
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Alternative fullscreen layout for presentations/demos
 */
export const FullscreenLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Box flexDirection="column" height={process.stdout.rows || 24}>
      {/* Fullscreen content area */}
      <Box flexGrow={1}>
        {children}
      </Box>

      {/* Subtle branding in corner */}
      <Box position="absolute" bottom={1} left={1}>
        <Text color={AXILO_UI.BRAND_PRIMARY} dimColor>
          {AXILO_UI.LOGO}
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Layout factory function for creating custom layouts
 */
export function createLayout(config: LayoutConfig): React.FC<{ children?: React.ReactNode }> {
  return ({ children }) => (
    <Box flexDirection="column" height={process.stdout.rows || 24}>
      {config.sections
        .filter(section => section.show !== false)
        .map((section, index) => {
          const SectionComponent = getSectionComponent(section.component);

          return (
            <React.Fragment key={section.id}>
              <SectionComponent {...section.props} />
              {index < config.sections.length - 1 && config.spacing !== 0 && (
                <Box height={config.spacing || 0} />
              )}
            </React.Fragment>
          );
        })}
      {children}
    </Box>
  );
}

/**
 * Default export
 */
export default DefaultAppLayout;
