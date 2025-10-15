import React from 'react';
import { Box, Text, useInput } from 'ink';
import { AppView } from './App';

interface MainMenuProps {
  onNavigate: (view: AppView) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const menuItems = [
    { label: '💬 Chat with AI', view: 'chat' as AppView },
    { label: '🤖 Manage Models', view: 'chat' as AppView },
    { label: '🔧 Extensions', view: 'extensions' as AppView },
    { label: '🛠️  Tools', view: 'tools' as AppView },
    { label: '⚙️  Configuration', view: 'config' as AppView },
  ];

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(menuItems.length - 1, prev + 1));
    } else if (key.return) {
      onNavigate(menuItems[selectedIndex].view);
    }
  });

  return (
    <Box flexDirection="column">
      <Text color="cyan" bold marginBottom={1}>
        Main Menu
      </Text>
      <Text color="gray">
        Use arrow keys to navigate, Enter to select
      </Text>
      <Box marginTop={1} flexDirection="column">
        {menuItems.map((item, index) => (
          <Box key={index} marginBottom={index < menuItems.length - 1 ? 0 : 0}>
            <Text
              color={index === selectedIndex ? 'black' : 'white'}
              backgroundColor={index === selectedIndex ? 'cyan' : undefined}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
