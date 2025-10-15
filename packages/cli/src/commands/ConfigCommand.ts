import { Command } from 'commander';
import chalk from 'chalk';

export const ConfigCommand = new Command('config')
  .description('Manage configuration')
  .addCommand(
    new Command('get <key>')
      .description('Get a configuration value')
      .action((key) => {
        // TODO: Read from config file
        const mockValues: Record<string, string> = {
          'ai.model': 'gpt-4',
          'ui.theme': 'dark',
          'tools.web-search.enabled': 'true',
        };
        const value = mockValues[key] || 'not set';
        console.log(chalk.cyan(`${key}: ${value}`));
      })
  )
  .addCommand(
    new Command('set <key> <value>')
      .description('Set a configuration value')
      .action((key, value) => {
        // TODO: Write to config file
        console.log(chalk.green(`✓ Set ${key} = ${value}`));
      })
  )
  .addCommand(
    new Command('list')
      .description('List all configuration values')
      .action(() => {
        console.log(chalk.cyan('Configuration:'));
        console.log('ai.model: gpt-4');
        console.log('ui.theme: dark');
        console.log('tools.web-search.enabled: true');
        console.log('memory.max-context-length: 4096');
      })
  );
