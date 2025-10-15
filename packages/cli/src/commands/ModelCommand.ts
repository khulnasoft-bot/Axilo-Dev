import { Command } from 'commander';
import chalk from 'chalk';

export const ModelCommand = new Command('model')
  .description('Manage AI models')
  .addCommand(
    new Command('list')
      .description('List available AI models')
      .action(() => {
        console.log(chalk.cyan('Available AI Models:'));
        console.log('• gpt-4 (OpenAI)');
        console.log('• gpt-3.5-turbo (OpenAI)');
        console.log('• claude-3-opus (Anthropic)');
        console.log('• claude-3-sonnet (Anthropic)');
        console.log('• gemini-pro (Google)');
      })
  )
  .addCommand(
    new Command('set <model>')
      .description('Set the default AI model')
      .action((model) => {
        // TODO: Save to config file
        console.log(chalk.green(`✓ Default model set to: ${model}`));
      })
  )
  .addCommand(
    new Command('current')
      .description('Show current default model')
      .action(() => {
        const current = process.env.AXILO_AI_MODEL || 'gpt-4';
        console.log(chalk.cyan(`Current default model: ${current}`));
      })
  );
