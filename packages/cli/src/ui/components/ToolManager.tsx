import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

interface ToolManagerProps {
  onBack: () => void;
}

interface Tool {
  name: string;
  type: 'web-search' | 'file-system' | 'shell' | 'memory' | 'code-compression';
  status: 'active' | 'inactive' | 'error';
  description: string;
}

export const ToolManager: React.FC<ToolManagerProps> = ({ onBack }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // TODO: Load actual tools from configuration
    // For demo purposes, show core tools
    setTools([
      { name: 'web-search', type: 'web-search', status: 'active', description: 'Search the web for information' },
      { name: 'file-explorer', type: 'file-system', status: 'active', description: 'Navigate and manage files' },
      { name: 'shell-executor', type: 'shell', status: 'active', description: 'Execute shell commands' },
      { name: 'memory-manager', type: 'memory', status: 'active', description: 'Manage conversation memory' },
      { name: 'code-compressor', type: 'code-compression', status: 'inactive', description: 'Compress and optimize code' },
    ]);
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      onBack();
    } else if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(tools.length - 1, prev + 1));
    } else if (input === ' ') {
      // Toggle tool status
      setTools(prev => prev.map((tool, index) =>
        index === selectedIndex
          ? { ...tool, status: tool.status === 'active' ? 'inactive' : 'active' }
          : tool
      ));
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'error': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Box flexDirection="column" height={process.stdout.rows - 4}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🛠️  Tool Manager
        </Text>
        <Text color="gray"> (Press Esc to go back, Space to toggle)</Text>
      </Box>

      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1}>
        <Text color="yellow" marginBottom={1}>
          Available Tools:
        </Text>
        {tools.map((tool, index) => (
          <Box key={tool.name} marginBottom={1}>
            <Text
              color={index === selectedIndex ? 'black' : 'white'}
              backgroundColor={index === selectedIndex ? 'cyan' : undefined}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              <Text color={getStatusColor(tool.status)}>
                {tool.status === 'active' ? '●' : '○'}
              </Text>
              {' '}{tool.name}
              <Text color="gray"> ({tool.type})</Text>
            </Text>
            <Box marginLeft={2}>
              <Text color="gray">{tool.description}</Text>
            </Box>
          </Box>
        ))}
        <Text color="gray" marginTop={2}>
          Total: {tools.length} tools ({tools.filter(t => t.status === 'active').length} active)
        </Text>
      </Box>
    </Box>
  );
};
