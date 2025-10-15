import * as vscode from 'vscode';

/**
 * Main extension activation function
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('AXILO VS Code IDE Companion is now active!');

  // Register commands
  const commands = [
    vscode.commands.registerCommand('axilo.openChat', () => openChat()),
    vscode.commands.registerCommand('axilo.generateCode', () => generateCode()),
    vscode.commands.registerCommand('axilo.analyzeCode', () => analyzeCode()),
    vscode.commands.registerCommand('axilo.optimizeCode', () => optimizeCode()),
    vscode.commands.registerCommand('axilo.generateTests', () => generateTests()),
    vscode.commands.registerCommand('axilo.explainCode', () => explainCode())
  ];

  // Add to subscriptions for proper cleanup
  commands.forEach(command => context.subscriptions.push(command));
}

/**
 * Deactivate extension
 */
export function deactivate() {
  console.log('AXILO VS Code IDE Companion is now deactivated');
}

// Command implementations (placeholders)
async function openChat() {
  vscode.window.showInformationMessage('Opening AXILO AI Chat...');
}

async function generateCode() {
  vscode.window.showInformationMessage('Generating code with AXILO...');
}

async function analyzeCode() {
  vscode.window.showInformationMessage('Analyzing code with AXILO...');
}

async function optimizeCode() {
  vscode.window.showInformationMessage('Optimizing code with AXILO...');
}

async function generateTests() {
  vscode.window.showInformationMessage('Generating tests with AXILO...');
}

async function explainCode() {
  vscode.window.showInformationMessage('Explaining code with AXILO...');
}
