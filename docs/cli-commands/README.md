# CLI Commands Reference

Complete reference for all AXILO CLI commands and their usage.

## Overview

The AXILO CLI provides a comprehensive set of commands for interacting with the AI assistant, managing extensions, configuring tools, and accessing various features.

## Command Structure

```bash
axilo [command] [subcommand] [options]
```

## Core Commands

### Chat (`chat`)

Start an interactive AI chat session with real-time conversation capabilities.

```bash
# Start basic chat session
axilo chat

# Start chat with specific model
axilo chat --model gpt-4

# Start chat with initial prompt
axilo chat --prompt "Help me with TypeScript"

# List all chat options
axilo chat --help
```

**Options:**
- `-m, --model <model>` - AI model to use (gpt-4, claude-3-opus, etc.)
- `-p, --prompt <prompt>` - Initial message to send
- `-t, --temperature <number>` - Response creativity (0.0-2.0)

### Model Management (`model`)

Manage AI models and their configurations.

```bash
# List available models
axilo model list

# Set default model
axilo model set gpt-4

# Show current default model
axilo model current

# Get model information
axilo model info gpt-4
```

**Subcommands:**
- `list` - Display all available AI models
- `set <model>` - Set the default AI model
- `current` - Show currently configured default model
- `info <model>` - Get detailed information about a specific model

**Available Models:**
- `gpt-4` - OpenAI GPT-4 (default)
- `gpt-3.5-turbo` - OpenAI GPT-3.5 Turbo
- `claude-3-opus` - Anthropic Claude 3 Opus
- `claude-3-sonnet` - Anthropic Claude 3 Sonnet
- `gemini-pro` - Google Gemini Pro

### Extension Management (`extension`)

Install, manage, and configure extensions.

```bash
# List installed extensions
axilo extension list

# Install new extension
axilo extension install git-helper

# Enable/disable extension
axilo extension enable git-helper
axilo extension disable git-helper

# Uninstall extension
axilo extension uninstall git-helper

# Show extension information
axilo extension info git-helper
```

**Subcommands:**
- `list` - Show all installed extensions with status
- `install <name>` - Install extension from registry
- `uninstall <name>` - Remove installed extension
- `enable <name>` - Enable extension functionality
- `disable <name>` - Disable extension functionality
- `info <name>` - Show detailed extension information
- `search <query>` - Search extension registry

**Built-in Extensions:**
- `git-helper` - Enhanced Git operations and automation
- `code-analyzer` - Static code analysis and quality checks
- `docker-manager` - Docker container management

### Tool Management (`tool`)

Manage and execute development tools.

```bash
# List available tools
axilo tool list

# Enable/disable tool
axilo tool enable web-search
axilo tool disable code-compressor

# Execute tool directly
axilo tool execute web-search "typescript best practices"

# Show tool information
axilo tool info file-explorer
```

**Subcommands:**
- `list` - Display all available tools
- `enable <name>` - Enable specific tool
- `disable <name>` - Disable specific tool
- `execute <name> [args...]` - Execute tool with arguments
- `info <name>` - Show tool details and usage

**Available Tools:**
- `web-search` - Search the internet for information
- `file-explorer` - Navigate and manage file system
- `shell-executor` - Execute shell commands safely
- `memory-manager` - Manage conversation memory
- `code-compressor` - Compress and optimize code

### MCP Server Management (`mcp`)

Manage Multi-Client Protocol servers for tool integration.

```bash
# List MCP servers
axilo mcp list

# Start MCP server
axilo mcp start filesystem-server

# Stop MCP server
axilo mcp stop git-server

# Restart MCP server
axilo mcp restart docker-server
```

**Subcommands:**
- `list` - Show status of all MCP servers
- `start <name>` - Start specific MCP server
- `stop <name>` - Stop specific MCP server
- `restart <name>` - Restart MCP server
- `status <name>` - Get detailed server status

### Configuration (`config`)

Manage AXILO configuration and settings.

```bash
# List all configuration values
axilo config list

# Get specific configuration value
axilo config get ai.model

# Set configuration value
axilo config set ui.theme dark

# Reset configuration to defaults
axilo config reset

# Export configuration
axilo config export > backup.json

# Import configuration
axilo config import backup.json
```

**Subcommands:**
- `list` - Display all configuration settings
- `get <key>` - Get value for specific setting
- `set <key> <value>` - Set configuration value
- `reset` - Reset all settings to defaults
- `export` - Export configuration to file
- `import <file>` - Import configuration from file

**Configuration Categories:**
- `ai.*` - AI model and behavior settings
- `ui.*` - User interface preferences
- `tools.*` - Tool-specific configurations
- `extensions.*` - Extension settings
- `memory.*` - Memory and persistence options
- `security.*` - Security and sandbox settings

## Interactive Mode

Launch the full interactive TUI for the best experience:

```bash
# Launch main interface
axilo

# Navigate with arrow keys
# Select with Enter
# Exit with Ctrl+C
```

The interactive mode provides:
- **Visual menu system** for easy navigation
- **Real-time chat interface** with AI models
- **Extension and tool management** with visual feedback
- **Configuration editor** with validation
- **Memory browser** for conversation history

## Global Options

Common options available across all commands:

```bash
# Show help for any command
axilo [command] --help

# Enable verbose logging
axilo [command] --verbose

# Specify configuration file
axilo [command] --config custom-config.json

# Override data directory
axilo [command] --data-dir /custom/path

# Disable color output
axilo [command] --no-color
```

## Environment Variables

Configure AXILO behavior with environment variables:

```bash
# AI Provider Configuration
export OPENAI_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"
export GOOGLE_AI_API_KEY="your-key"

# Server Configuration
export PORT=3001
export NODE_ENV=production

# Storage Configuration
export GCS_PROJECT_ID="your-project"
export GCS_BUCKET_NAME="axilo-storage"

# Feature Flags
export EXTENSIONS_ENABLED=true
export MEMORY_PERSISTENCE=true
export SANDBOX_ENABLED=true
```

## Examples

### Basic Chat Session
```bash
axilo chat --model claude-3-opus
```

### Extension Management
```bash
axilo extension install code-analyzer
axilo extension enable code-analyzer
```

### Tool Execution
```bash
axilo tool execute web-search "react performance optimization"
```

### Configuration Management
```bash
axilo config set ai.model gpt-4
axilo config set memory.max-context-length 8192
```

### Batch Operations
```bash
# Setup development environment
axilo extension install git-helper docker-manager
axilo tool enable web-search file-explorer
axilo config set ui.theme dark
```

## Troubleshooting

### Common Issues

**"Command not found"**
- Ensure AXILO is properly installed and in PATH
- Check if the CLI package was built: `npm run build:cli`

**"AI model unavailable"**
- Verify API keys are configured in environment variables
- Check network connectivity to AI providers
- Use `axilo model list` to see available models

**"Extension failed to load"**
- Check extension permissions and compatibility
- Verify extension files are not corrupted
- Use `axilo extension list` to check status

**"Tool execution failed"**
- Verify tool is enabled: `axilo tool list`
- Check tool-specific configuration
- Review sandbox settings for security restrictions

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
DEBUG=axilo:* axilo [command]
```

Or set log level in configuration:
```bash
axilo config set logging.level debug
```

### Getting Help

- Use `--help` flag with any command for usage information
- Check the [documentation](/) for detailed guides
- Report issues on the [GitHub repository](https://github.com/your-org/axilo)
