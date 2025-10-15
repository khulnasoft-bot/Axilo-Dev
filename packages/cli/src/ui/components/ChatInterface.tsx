import React, { useState } from 'react';
import { Box, Text, TextInput, useInput } from 'ink';

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useInput((input, key) => {
    if (key.escape) {
      onBack();
    } else if (key.return && !key.shift) {
      handleSendMessage();
    }
  });

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // TODO: Implement actual AI chat integration
      // For now, simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I received your message: "${userMessage}". This is a demo response from AXILO's chat interface.`
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message.'
      }]);
      setIsLoading(false);
    }
  };

  return (
    <Box flexDirection="column" height={process.stdout.rows - 4}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          💬 AI Chat Interface
        </Text>
        <Text color="gray"> (Press Esc to go back)</Text>
      </Box>

      <Box flexDirection="column" flexGrow={1} borderStyle="single">
        <Box flexDirection="column" padding={1} flexGrow={1}>
          {messages.map((message, index) => (
            <Box key={index} marginBottom={1}>
              <Text color={message.role === 'user' ? 'green' : 'blue'}>
                {message.role === 'user' ? 'You: ' : 'Assistant: '}
                {message.content}
              </Text>
            </Box>
          ))}
          {isLoading && (
            <Text color="yellow">Assistant is typing...</Text>
          )}
        </Box>

        <Box borderTop padding={1}>
          <TextInput
            placeholder="Type your message here..."
            value={currentInput}
            onChange={setCurrentInput}
            focus={true}
          />
        </Box>
      </Box>
    </Box>
  );
};
