# Getting Started

Complete guide to installing, configuring, and using AXILO for the first time.

## Prerequisites

Before installing AXILO, ensure you have the following:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - For cloning repositories and version control
- **Terminal** - Command line interface (bash, zsh, etc.)

### Optional Dependencies

- **Google Cloud Storage** - For persistent memory (optional)
- **Docker** - For containerized deployment (optional)

## Installation

### Method 1: Clone from Repository

```bash
# Clone the AXILO repository
git clone https://github.com/your-org/axilo.git
cd axilo

# Install all dependencies
npm install

# Build the project
npm run build

# Verify installation
npm run start --workspace=packages/cli -- --help
```

### Method 2: npm Package (Coming Soon)

```bash
# Install globally via npm
npm install -g @axilo/cli

# Verify installation
axilo --help
```

## Initial Configuration

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# AI Provider API Keys (required for AI features)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional: Google Cloud Storage for persistence
GCS_PROJECT_ID=your_gcp_project_id
GCS_BUCKET_NAME=axilo-storage
GCS_KEY_FILENAME=path/to/service-account-key.json

# Optional: Server configuration
PORT=3001
NODE_ENV=development

# Optional: Feature toggles
EXTENSIONS_ENABLED=true
MEMORY_PERSISTENCE=true
SANDBOX_ENABLED=true
```

### 2. First Run

```bash
# Start the development environment
npm run dev

# Or run the CLI directly
npm run build:cli
node packages/cli/dist/index.js
```

### 3. Interactive Setup

On first run, AXILO will guide you through:

1. **AI Model Selection** - Choose your preferred AI model
2. **Extension Installation** - Select useful extensions to install
3. **Tool Configuration** - Configure which tools to enable
4. **UI Preferences** - Set up your preferred theme and layout

## Basic Usage

### Launching the Interface

```bash
# Launch the main interactive interface
axilo

# Or use the chat command directly
axilo chat
```

### Navigation

- **Arrow Keys** - Navigate menus and options
- **Enter** - Select items or confirm actions
- **Tab** - Move between interface elements
- **Ctrl+C** - Exit the application
- **Esc** - Go back to previous screen

## First Steps Tutorial

### Step 1: Start a Chat Session

1. Launch AXILO: `axilo`
2. Select "💬 Chat with AI" from the main menu
3. Choose your preferred AI model
4. Start typing your questions or requests

### Step 2: Install Useful Extensions

1. Go back to main menu (Esc)
2. Select "🔧 Extensions"
3. Browse available extensions
4. Install `git-helper` for enhanced Git operations

### Step 3: Configure Tools

1. From main menu, select "🛠️ Tools"
2. Enable useful tools like `web-search` and `file-explorer`
3. Tools will be available during AI conversations

### Step 4: Customize Settings

1. Select "⚙️ Configuration" from main menu
2. Adjust settings like theme, memory limits, etc.
3. Settings are saved automatically

## Common Workflows

### Code Development Assistance

```bash
# Get help with a coding problem
axilo chat --prompt "How do I implement authentication in React?"

# Search for best practices
axilo tool execute web-search "react authentication patterns"

# Analyze your codebase
axilo tool execute file-explorer list --path ./src
```

### Project Management

```bash
# Get project structure overview
axilo chat --prompt "Analyze this project structure and suggest improvements"

# Set up development environment
axilo extension install docker-manager
axilo tool enable shell-executor
```

### Learning and Research

```bash
# Research new technologies
axilo chat --prompt "Explain quantum computing in simple terms"

# Get coding examples
axilo chat --prompt "Show me examples of async/await in TypeScript"
```

## Configuration Files

AXILO stores configuration in several locations:

### User Configuration
- **Location**: `~/.axilo/config.json`
- **Contents**: User preferences, enabled tools, model settings
- **Auto-created**: On first run

### Project Configuration
- **Location**: `./.axilorc.json` (project root)
- **Contents**: Project-specific settings, extensions, tool overrides
- **Optional**: Created per project as needed

### Environment Variables
- **Location**: `.env` file or system environment
- **Contents**: API keys, service configurations, feature flags

## Troubleshooting First Run

### "Module not found" Errors

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Rebuild the project
npm run build
```

### Permission Issues

```bash
# Fix file permissions
chmod +x packages/cli/dist/index.js

# Or run with Node.js directly
node packages/cli/dist/index.js
```

### Network/API Issues

1. **Check API keys** in your `.env` file
2. **Verify internet connection**
3. **Test API connectivity**:
   ```bash
   curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

### Performance Issues

```bash
# Increase Node.js memory limit if needed
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Or configure memory settings
axilo config set memory.max-context-length 2048
```

## Getting Help

### Documentation
- **CLI Commands**: `axilo --help` or see [CLI Reference](cli-commands/README.md)
- **Architecture**: See [Architecture Guide](architecture/README.md)
- **Extensions**: See [Extension Development](extensions/README.md)

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Join community discussions
- **Discord**: Chat with other users (coming soon)

### Debug Information

To help with troubleshooting, gather this information:

```bash
# System information
node --version
npm --version
echo $NODE_ENV

# AXILO version and status
axilo --version
axilo config list

# Log files (if available)
tail -f ~/.axilo/logs/*.log
```

## Next Steps

After completing the basic setup:

1. **Explore Extensions** - Install extensions that match your workflow
2. **Customize Tools** - Enable and configure tools you use frequently
3. **Set Up IDE Integration** - Connect AXILO with your code editor
4. **Configure Advanced Settings** - Adjust memory, security, and performance settings
5. **Join the Community** - Participate in discussions and contribute back

## Advanced Configuration

For production deployments and advanced usage, see:

- [Security Guide](security/README.md) - Security best practices
- [IDE Integration](ide-integration/README.md) - Editor integrations
- [Extension Development](extensions/README.md) - Creating custom extensions
- [Core Concepts](core-concepts/README.md) - Deep dive into AXILO architecture

---

🎉 **Congratulations!** You've successfully installed and configured AXILO. Start exploring the power of AI-assisted development!
