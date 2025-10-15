# AXILO VS Code IDE Companion - Development Guide

## 🚀 Development Overview

This document provides comprehensive guidance for developers working on the AXILO VS Code IDE Companion extension. It covers setup, development workflows, testing, debugging, and contribution guidelines specific to this VS Code extension package.

## 📋 Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
- **npm** or **pnpm** package manager
- **Visual Studio Code** 1.80.0 or higher
- **Git** for version control
- **AXILO CLI** installed globally (`npm install -g @axilo/cli`)

### Development Environment Setup

1. **Clone the monorepo** (if not already done):
   ```bash
   git clone https://github.com/axilo/axilo.git
   cd axilo
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the monorepo**:
   ```bash
   pnpm build
   ```

4. **Link the extension for development**:
   ```bash
   cd packages/vscode-ide-companion
   npm link
   ```

## 🏗️ Project Structure

```
packages/vscode-ide-companion/
├── src/                    # Source TypeScript files
│   ├── commands/          # Command implementations
│   │   ├── chat.ts        # AI chat functionality
│   │   ├── codeGeneration.ts  # Code generation commands
│   │   ├── codeAnalysis.ts    # Code analysis features
│   │   └── index.ts       # Command registration
│   ├── providers/         # Language server providers
│   │   ├── completionProvider.ts
│   │   ├── hoverProvider.ts
│   │   └── diagnosticProvider.ts
│   ├── webview/           # Chat interface components
│   │   ├── chatView.ts    # Main chat interface
│   │   ├── messageRenderer.ts
│   │   └── chatStyles.css
│   ├── utils/             # Utility functions
│   │   ├── apiClient.ts   # AXILO API communication
│   │   ├── configManager.ts
│   │   └── logger.ts
│   └── extension.ts        # Main extension entry point
├── out/                   # Compiled JavaScript output
├── assets/               # Icons, images, and static assets
├── test/                 # Test files and fixtures
├── node_modules/         # Extension dependencies
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
└── README.md            # User-facing documentation
```

## 🔧 Development Workflow

### Daily Development

1. **Start development**:
   ```bash
   cd packages/vscode-ide-companion
   npm run watch
   ```

2. **Open in VS Code Extension Development Host**:
   - Press `F5` or use "Run and Debug" panel
   - Select "Launch Extension" configuration
   - This opens a new VS Code window with your extension loaded

3. **Make changes** and see them reflected immediately due to watch mode

### Code Organization

- **Commands** (`src/commands/`): Handle user interactions and VS Code commands
- **Providers** (`src/providers/`): Language server features like autocomplete, hover, diagnostics
- **Webview** (`src/webview/`): Chat interface and UI components
- **Utils** (`src/utils/`): Shared utilities and API clients

### Key Files

- **`extension.ts`**: Extension activation, command registration, API setup
- **`package.json`**: VS Code extension manifest with commands, configuration, and menus
- **`tsconfig.json`**: TypeScript compilation settings for extension development

## 🧪 Testing

### Running Tests

```bash
cd packages/vscode-ide-companion

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test extension activation and command execution
- **E2E Tests**: Test full user workflows in VS Code environment

### Writing Tests

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';
import { myFunction } from '../../src/utils/myFunction';

suite('My Function Tests', () => {
  test('should work correctly', () => {
    const result = myFunction('input');
    assert.strictEqual(result, 'expected');
  });
});
```

## 🐛 Debugging

### VS Code Extension Debugging

1. **Set breakpoints** in your TypeScript source files
2. **Press F5** to launch the Extension Development Host
3. **Use VS Code's debugger** in the new window
4. **Check the Debug Console** for extension logs

### Common Debugging Scenarios

**Extension not activating:**
```typescript
// Add logging to extension.ts activate function
export async function activate(context: vscode.ExtensionContext) {
  console.log('AXILO VS Code extension is activating...');

  // Check if AXILO CLI is available
  const axiloAvailable = await checkAxiloCLI();
  console.log('AXILO CLI available:', axiloAvailable);
}
```

**Command not working:**
```typescript
// In command implementation, add error handling
export async function myCommand() {
  try {
    console.log('Executing command...');
    // Command logic here
  } catch (error) {
    console.error('Command failed:', error);
    vscode.window.showErrorMessage(`AXILO command failed: ${error.message}`);
  }
}
```

**API communication issues:**
```typescript
// In utils/apiClient.ts, add detailed logging
export async function callAxiloAPI(data: any) {
  console.log('Calling AXILO API with:', data);
  try {
    const response = await axios.post(API_URL, data);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

## 📦 Building and Packaging

### Compilation

```bash
cd packages/vscode-ide-companion

# Compile TypeScript to JavaScript
npm run compile

# Watch mode for development
npm run watch

# Prepublish compilation (includes optimizations)
npm run vscode:prepublish
```

### Packaging for Distribution

```bash
# Create .vsix package for VS Code Marketplace
npm run package

# Install from local .vsix file
code --install-extension axilo-vscode-ide-companion-0.1.0.vsix
```

## 🚀 Publishing

### VS Code Marketplace

1. **Create publisher** (one-time setup):
   ```bash
   npm install -g @vscode/vsce
   vsce create-publisher axilo
   ```

2. **Package and publish**:
   ```bash
   cd packages/vscode-ide-companion
   vsce package
   vsce publish
   ```

### Version Management

- **Patch versions** (0.1.x): Bug fixes and minor improvements
- **Minor versions** (0.x.0): New features and API additions
- **Major versions** (x.0.0): Breaking changes

Update version in `package.json` and run:
```bash
npm version patch|minor|major
```

## 🔧 Extension Development Best Practices

### VS Code API Usage

**Command Registration:**
```typescript
// Register commands with proper disposal
const disposable = vscode.commands.registerCommand('axilo.analyzeCode', analyzeCodeCommand);
context.subscriptions.push(disposable);
```

**Webview Security:**
```typescript
// Always use secure webview options
const panel = vscode.window.createWebviewPanel(
  'axiloChat',
  'AXILO Chat',
  vscode.ViewColumn.One,
  {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.file(context.extensionPath)]
  }
);
```

**Configuration Management:**
```typescript
// Use VS Code's configuration API
const config = vscode.workspace.getConfiguration('axilo');
const apiKey = config.get<string>('apiKey', '');
```

### Performance Considerations

**Lazy Loading:**
```typescript
// Load heavy dependencies only when needed
let axios: any;
async function getAxios() {
  if (!axios) {
    axios = (await import('axios')).default;
  }
  return axios;
}
```

**Debounced Operations:**
```typescript
// Avoid excessive API calls
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
```

## 🤝 Contributing

### Development Setup for Contributors

1. **Fork and clone** the repository
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make your changes** following the established patterns
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Submit a pull request**

### Code Standards

- **TypeScript**: All code must be strongly typed
- **ESLint**: Follow the configured linting rules
- **Error Handling**: Proper error catching and user feedback
- **Logging**: Use the logger utility for debugging information

### Pull Request Process

1. **Ensure tests pass**: `npm test`
2. **Update README**: Document new features
3. **Check TypeScript**: `npm run compile`
4. **Test manually**: Use Extension Development Host
5. **Request review** from maintainers

## 🔍 Troubleshooting

### Common Development Issues

**Extension won't load:**
- Check VS Code version compatibility in `package.json`
- Verify all dependencies are installed
- Check for TypeScript compilation errors

**Commands not appearing:**
- Ensure commands are properly registered in `package.json`
- Check that activation events are correctly configured
- Verify command implementations are error-free

**Webview not working:**
- Confirm `webview.enableScripts` is set to `true`
- Check that webview HTML/JS files are properly bundled
- Verify CSP (Content Security Policy) settings

**API calls failing:**
- Validate API key configuration
- Check network connectivity and CORS settings
- Verify AXILO CLI is properly installed and authenticated

### Getting Help

- **Check logs**: Use "Developer: Toggle Developer Tools" in VS Code
- **Extension Host logs**: View in Debug Console during development
- **Community**: Join our Discord for development discussions
- **Issues**: Search existing GitHub issues or create new ones

## 📚 Additional Resources

### VS Code Extension Development

- [VS Code Extension API Reference](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [Webview API Guide](https://code.visualstudio.com/api/extension-guides/webview)

### Testing and Quality

- [VS Code Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Extension Quality Checklist](https://code.visualstudio.com/api/references/extension-guidelines#quality)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### AXILO Integration

- [AXILO CLI Documentation](../README.md)
- [AXILO API Reference](../../docs/api/)
- [Extension Development Guide](../../docs/extensions/)

---

**Happy coding! 🎉**

For questions, suggestions, or issues, please reach out through our [GitHub repository](https://github.com/axilo/axilo) or [community channels](https://discord.gg/axilo).
