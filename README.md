# AXILO

🚀 **AI-powered developer assistant and automation platform**

AXILO is a comprehensive development tool that brings AI assistance directly to your terminal, providing intelligent automation, code analysis, and seamless integration with your development workflow.

## ✨ Features

- **🤖 AI Chat Interface** - Interactive conversations with multiple AI models (GPT-4, Claude, Gemini)
- **🔧 Extension System** - Extensible architecture with custom tools and integrations
- **🛠️ Built-in Tools** - Web search, file management, shell execution, memory management
- **💾 Persistent Memory** - Conversation history and context preservation
- **🎨 Terminal UI** - Beautiful interactive interface built with React & Ink
- **🔒 Secure Sandbox** - Safe execution environment for code and commands
- **☁️ Cloud Storage** - Google Cloud Storage integration for data persistence
- **🔗 MCP Protocol** - Multi-Client Protocol support for tool integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Optional: Google Cloud Storage for persistence

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/axilo.git
cd axilo

# Install dependencies
npm install

# Build all packages
npm run build

# Start the development environment
npm run dev
```

### Basic Usage

```bash
# Launch interactive CLI
npm run dev:cli

# Or run directly
node packages/cli/dist/index.js
```

## 📁 Project Structure

```
axilo/
├── packages/
│   ├── cli/                 # Main CLI interface with TUI
│   └── a2a-server/         # Backend AI agent server
├── docs/                   # Comprehensive documentation
├── integration-tests/      # End-to-end tests
└── [config files]         # Root configuration
```

## 🔧 CLI Commands

| Command | Description |
|---------|-------------|
| `axilo chat` | Start AI chat session |
| `axilo model list` | List available AI models |
| `axilo extension list` | Show installed extensions |
| `axilo tool list` | Display available tools |
| `axilo config list` | View configuration settings |

## 🏗️ Architecture

AXILO follows a modular architecture with clear separation of concerns:

- **CLI Package**: Terminal user interface and command orchestration
- **A2A Server**: Backend service handling AI interactions and tool execution
- **Extension System**: Plugin architecture for custom functionality
- **Tool Framework**: Reusable tools for common development tasks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/contributing.md) for details.

## 📄 Documentation

- [Getting Started](docs/getting-started/README.md) - Installation and setup
- [CLI Commands](docs/cli-commands/README.md) - Complete command reference
- [Extension Development](docs/extensions/README.md) - Creating custom extensions
- [Core Concepts](docs/core-concepts/README.md) - Architecture and design principles
- [IDE Integration](docs/ide-integration/README.md) - Editor integrations
- [Security](docs/security/README.md) - Security considerations and best practices

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ using:
- [React](https://reactjs.org/) & [Ink](https://github.com/vadimdemedes/ink) for the TUI
- [Express](https://expressjs.com/) for the backend API
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Vitest](https://vitest.dev/) for testing
- [Google Cloud Storage](https://cloud.google.com/storage) for persistence
