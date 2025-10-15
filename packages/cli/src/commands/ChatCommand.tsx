import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { ChatInterface } from '../ui/components/ChatInterface';

export const ChatCommand = new Command('chat')
  .description('Start an interactive AI chat session')
  .option('-m, --model <model>', 'AI model to use', 'gpt-4')
  .option('-p, --prompt <prompt>', 'Initial prompt to send')
  .action((options) => {
    // Set the model in environment or config
    if (options.model) {
      process.env.AXILO_AI_MODEL = options.model;
    }

    render(<ChatInterface onBack={() => process.exit(0)} />);
  });
