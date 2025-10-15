#!/usr/bin/env node

import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { App } from './ui/App';
import { ChatCommand } from './commands/ChatCommand';
import { ModelCommand } from './commands/ModelCommand';
import { ExtensionCommand } from './commands/ExtensionCommand';
import { ToolCommand } from './commands/ToolCommand';
import { McpCommand } from './commands/McpCommand';
import { ConfigCommand } from './commands/ConfigCommand';

const program = new Command();

program
  .name('axilo')
  .description('AI-powered developer assistant and automation platform')
  .version('0.1.0');

// Register commands
program.addCommand(ChatCommand);
program.addCommand(ModelCommand);
program.addCommand(ExtensionCommand);
program.addCommand(ToolCommand);
program.addCommand(McpCommand);
program.addCommand(ConfigCommand);

// Default command - launch interactive TUI
program.action(() => {
  render(<App />);
});

program.parse();
