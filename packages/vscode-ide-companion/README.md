# AXILO VS Code IDE Companion

> 🚀 **AI-Powered Development Assistant** - Bring the power of AXILO CLI directly into your Visual Studio Code editor

[![Visual Studio Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

The **AXILO VS Code IDE Companion** is a powerful extension that seamlessly integrates the AXILO CLI's AI-powered development assistance directly into your Visual Studio Code workflow. Experience intelligent code generation, analysis, optimization, and testing suggestions without leaving your editor.

## ✨ Features

### 🤖 AI-Powered Code Assistance
- **Smart Code Generation**: Generate functions, classes, components, and entire modules
- **Code Analysis**: Get instant feedback on code quality, performance, and best practices
- **Intelligent Refactoring**: AI-powered suggestions for code improvements
- **Test Generation**: Automatically generate unit tests for your functions

### 💬 Interactive AI Chat
- **Context-Aware Conversations**: Chat with AI about your current file, selection, or project
- **Code Explanations**: Understand complex code with AI-generated explanations
- **Problem Solving**: Get help with debugging, optimization, and architecture decisions

### ⚡ Productivity Boosters
- **Quick Actions**: Right-click context menus for instant AI assistance
- **Auto-Complete Enhancement**: AI-powered code completion suggestions
- **File Template Generation**: Create new files with intelligent templates
- **Documentation Generation**: Auto-generate README and API documentation

## 🚀 Quick Start

### Installation

1. **Install from VS Code Marketplace**
   ```bash
   # Search for "AXILO" in VS Code Extensions
   # or install via command line:
   code --install-extension axilo.vscode-ide-companion
   ```

2. **Install AXILO CLI** (if not already installed)
   ```bash
   npm install -g @axilo/cli
   # or
   pnpm add -g @axilo/cli
   ```

3. **Configure API Key**
   - Open VS Code Settings (`Ctrl+,` / `Cmd+,`)
   - Search for "AXILO"
   - Set your `axilo.apiKey` with your preferred AI service key

### First Steps

1. **Open a project** with an existing `AXILO.md` file or create one
2. **Right-click** in any code file for context menu options
3. **Use Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for "AXILO"
4. **Start chatting** with the AI using the chat interface

## 🎯 Usage Guide

### Context Menu Integration

Right-click in your code editor to access:

- **🔍 Analyze Code**: Get AI analysis of selected code
- **⚡ Optimize Code**: Receive optimization suggestions
- **🧪 Generate Tests**: Create unit tests for functions
- **📚 Explain Code**: Understand complex logic with AI explanations

### Command Palette Commands

Access all features via VS Code's Command Palette:

```bash
AXILO: Open AI Chat           # Start a conversation with AI
AXILO: Generate Code          # Generate new code snippets
AXILO: Analyze Code           # Analyze existing code
AXILO: Optimize Code          # Get optimization suggestions
AXILO: Generate Tests         # Create unit tests
AXILO: Explain Code           # Get code explanations
```

### Configuration Options

Customize your AXILO experience in VS Code Settings:

```json
{
  "axilo.apiKey": "your-api-key-here",
  "axilo.model": "gpt-4",
  "axilo.autoComplete": true,
  "axilo.codeReview": false
}
```

#### Available Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `axilo.apiKey` | API key for AI services | `""` |
| `axilo.model` | AI model preference | `"gpt-4"` |
| `axilo.autoComplete` | Enable AI autocomplete | `true` |
| `axilo.codeReview` | Auto-review on save | `false` |

## 🏗️ Architecture

### Extension Structure

```
packages/vscode-ide-companion/
├── src/
│   ├── commands/           # VS Code command implementations
│   ├── providers/          # Language server providers
│   ├── webview/           # Chat interface components
│   └── utils/             # Helper utilities
├── out/                   # Compiled extension
├── assets/               # Icons and images
└── test/                # Extension tests
```

### Integration Points

- **Language Server Protocol**: Provides intelligent code assistance
- **WebView API**: Powers the interactive chat interface
- **Configuration API**: Manages user settings and preferences
- **File System API**: Reads project structure and AXILO.md files

## 🔧 Development

### Prerequisites

- **Node.js** 18+
- **VS Code** 1.80+
- **AXILO CLI** installed globally

### Setup

```bash
# Clone and setup the monorepo
git clone https://github.com/axilo/axilo.git
cd axilo

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Link for local development
cd packages/vscode-ide-companion
npm link
```

### Development Workflow

1. **Make changes** to TypeScript source files in `src/`
2. **Compile** with `npm run compile` or `npm run watch`
3. **Test** using VS Code's Extension Development Host
4. **Package** with `npm run vscode:prepublish`

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## 🤝 Contributing

We welcome contributions to the AXILO VS Code extension!

### Getting Started

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Guidelines

- **TypeScript**: All code must be typed
- **ESLint**: Follow the configured linting rules
- **Testing**: Add tests for new features
- **Documentation**: Update README for user-facing changes

### Extension Development Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)

## 📋 Requirements

### VS Code Version
- **Minimum**: 1.80.0
- **Recommended**: Latest stable release

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, Linux
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 100MB free space

### Dependencies
- **AXILO CLI**: Latest version installed globally
- **Internet Connection**: Required for AI services
- **API Keys**: Valid keys for OpenAI, Anthropic, or other AI services

## 🐛 Troubleshooting

### Common Issues

**Extension not activating:**
- Ensure VS Code 1.80+ is installed
- Check that AXILO CLI is installed globally
- Verify API key is configured in settings

**AI features not working:**
- Confirm internet connection
- Validate API key in VS Code settings
- Check AXILO CLI installation and authentication

**Performance issues:**
- Disable auto-complete if experiencing lag
- Reduce code review frequency in settings
- Restart VS Code Extension Host

### Getting Help

1. **Check Logs**: Open "Developer: Toggle Developer Tools" in Command Palette
2. **Search Issues**: Visit our [GitHub Issues](https://github.com/axilo/axilo/issues)
3. **Community**: Join our [Discord community](https://discord.gg/axilo)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VS Code Team** for the excellent extension API
- **AXILO CLI Team** for the core AI functionality
- **Open Source Community** for inspiration and contributions

---

**Made with ❤️ by the AXILO Team**

[🌟 Star us on GitHub](https://github.com/axilo/axilo) | [🐛 Report Issues](https://github.com/axilo/axilo/issues) | [💬 Join Discussion](https://github.com/axilo/axilo/discussions)
