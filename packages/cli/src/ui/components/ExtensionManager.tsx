import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

interface ExtensionManagerProps {
  onBack: () => void;
}

interface Extension {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
}

export const ExtensionManager: React.FC<ExtensionManagerProps> = ({ onBack }) => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // TODO: Load actual extensions from configuration
    // For demo purposes, show some sample extensions
    setExtensions([
      { name: 'git-helper', version: '1.0.0', description: 'Enhanced git operations', enabled: true },
      { name: 'code-analyzer', version: '2.1.0', description: 'Static code analysis', enabled: false },
      { name: 'docker-manager', version: '1.5.0', description: 'Docker container management', enabled: true },
    ]);
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      onBack();
    } else if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(extensions.length - 1, prev + 1));
    } else if (input === ' ') {
      // Toggle extension status
      setExtensions(prev => prev.map((ext, index) =>
        index === selectedIndex ? { ...ext, enabled: !ext.enabled } : ext
      ));
    }
  });

  return (
    <Box flexDirection="column" height={process.stdout.rows - 4}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🔧 Extension Manager
        </Text>
        <Text color="gray"> (Press Esc to go back, Space to toggle)</Text>
      </Box>

      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1}>
        <Text color="yellow" marginBottom={1}>
          Installed Extensions:
        </Text>
        {extensions.map((extension, index) => (
          <Box key={extension.name} marginBottom={1}>
            <Text
              color={index === selectedIndex ? 'black' : 'white'}
              backgroundColor={index === selectedIndex ? 'cyan' : undefined}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              <Text color={extension.enabled ? 'green' : 'red'}>
                {extension.enabled ? '●' : '○'}
              </Text>
              {' '}{extension.name} v{extension.version}
            </Text>
            <Box marginLeft={2}>
              <Text color="gray">{extension.description}</Text>
            </Box>
          </Box>
        ))}
        <Text color="gray" marginTop={2}>
          Total: {extensions.length} extensions ({extensions.filter(e => e.enabled).length} enabled)
        </Text>
      </Box>
    </Box>
  );
};
