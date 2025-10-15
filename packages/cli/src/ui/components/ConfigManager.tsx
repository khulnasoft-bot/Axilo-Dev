import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

interface ConfigManagerProps {
  onBack: () => void;
}

interface ConfigItem {
  key: string;
  value: string;
  description: string;
  type: 'string' | 'boolean' | 'number';
}

export const ConfigManager: React.FC<ConfigManagerProps> = ({ onBack }) => {
  const [config, setConfig] = useState<ConfigItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // TODO: Load actual configuration from file
    // For demo purposes, show sample config items
    setConfig([
      { key: 'ai.model', value: 'gpt-4', description: 'Default AI model to use', type: 'string' },
      { key: 'ui.theme', value: 'dark', description: 'UI theme preference', type: 'string' },
      { key: 'tools.web-search.enabled', value: 'true', description: 'Enable web search tool', type: 'boolean' },
      { key: 'memory.max-context-length', value: '4096', description: 'Maximum context length', type: 'number' },
      { key: 'extensions.auto-update', value: 'false', description: 'Auto-update extensions', type: 'boolean' },
    ]);
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      onBack();
    } else if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(config.length - 1, prev + 1));
    }
  });

  return (
    <Box flexDirection="column" height={process.stdout.rows - 4}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ⚙️  Configuration Manager
        </Text>
        <Text color="gray"> (Press Esc to go back)</Text>
      </Box>

      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1}>
        <Text color="yellow" marginBottom={1}>
          Configuration Settings:
        </Text>
        {config.map((item, index) => (
          <Box key={item.key} marginBottom={1}>
            <Text
              color={index === selectedIndex ? 'black' : 'white'}
              backgroundColor={index === selectedIndex ? 'cyan' : undefined}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              <Text bold>{item.key}</Text>
              <Text color="gray"> = </Text>
              <Text color="green">"{item.value}"</Text>
              <Text color="gray"> ({item.type})</Text>
            </Text>
            <Box marginLeft={2}>
              <Text color="gray">{item.description}</Text>
            </Box>
          </Box>
        ))}
        <Text color="gray" marginTop={2}>
          Total: {config.length} configuration items
        </Text>
      </Box>
    </Box>
  );
};
