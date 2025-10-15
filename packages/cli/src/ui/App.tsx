import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { MainMenu } from './components/MainMenu';
import { ChatInterface } from './components/ChatInterface';
import { ExtensionManager } from './components/ExtensionManager';
import { ToolManager } from './components/ToolManager';
import { ConfigManager } from './components/ConfigManager';

export type AppView = 'main' | 'chat' | 'extensions' | 'tools' | 'config';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('main');
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      exit();
    }
  });

  const navigateToView = (view: AppView) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'main':
        return <MainMenu onNavigate={navigateToView} />;
      case 'chat':
        return <ChatInterface onBack={() => navigateToView('main')} />;
      case 'extensions':
        return <ExtensionManager onBack={() => navigateToView('main')} />;
      case 'tools':
        return <ToolManager onBack={() => navigateToView('main')} />;
      case 'config':
        return <ConfigManager onBack={() => navigateToView('main')} />;
      default:
        return <MainMenu onNavigate={navigateToView} />;
    }
  };

  return (
    <Box flexDirection="column" height={process.stdout.rows}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🚀 AXILO - AI Developer Assistant
        </Text>
      </Box>
      <Box flexGrow={1}>
        {renderCurrentView()}
      </Box>
      <Box marginTop={1} borderStyle="single" borderTop>
        <Text color="gray" dimColor>
          Press Ctrl+C to exit | Current view: {currentView}
        </Text>
      </Box>
    </Box>
  );
};
