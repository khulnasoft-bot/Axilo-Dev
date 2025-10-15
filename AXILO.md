# AXILO Project Configuration

## Project Context

**Project**: AXILO CLI - AI-powered developer assistant and automation platform
**Version**: 0.1.0
**Purpose**: Developer productivity enhancement through AI-assisted coding, automation, and intelligent project management

## AI Capabilities

### Primary Functions
- **Code Generation**: Generate boilerplate code, components, and utilities
- **Code Analysis**: Review, refactor, and optimize existing code
- **Documentation**: Auto-generate README, API docs, and inline comments
- **Testing**: Generate unit tests and integration test scenarios
- **Debugging**: Analyze errors, suggest fixes, and optimize performance

### Supported Languages & Frameworks
- **Core**: TypeScript, JavaScript, Node.js
- **Frontend**: React, Next.js, Vue.js
- **Backend**: Express.js, Fastify, NestJS
- **Database**: PostgreSQL, MongoDB, Redis
- **DevOps**: Docker, Kubernetes, CI/CD pipelines
- **Cloud**: AWS, Google Cloud, Azure

## Extension System

### Auto-Discovery
Extensions are automatically discovered from:
- `packages/*/src/extensions/`
- `extensions/` (project root)
- `$HOME/.axilo/extensions/`

### Built-in Extensions
- **@axilo/git-helper**: Git workflow automation and branch management
- **@axilo/code-analyzer**: Code quality analysis and suggestions
- **@axilo/docker-manager**: Container and deployment management
- **@axilo/api-tester**: API endpoint testing and validation

### Extension Development
```typescript
interface AxiloExtension {
  name: string;
  version: string;
  description: string;
  commands: Command[];
  hooks?: {
    preBuild?: () => Promise<void>;
    postBuild?: () => Promise<void>;
    onFileChange?: (file: string) => Promise<void>;
  };
}
```

## Development Workflow

### Code Quality
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with 2-space indentation
- **Type Checking**: Strict TypeScript configuration
- **Testing**: Vitest with coverage requirements
- **Commits**: Conventional commits with automated versioning

### Build Process
- **Bundler**: esbuild for fast compilation
- **Target**: Node.js 18+
- **Output**: CommonJS modules with source maps
- **Optimization**: Tree shaking and minification for production

### Project Structure
```
axilo/
├── packages/
│   ├── cli/           # Main CLI application
│   └── a2a-server/    # AI agent backend service
├── integration-tests/ # End-to-end testing
└── docs/             # Documentation and guides
```

## AI Integration Settings

### Model Configuration
```json
{
  "models": {
    "primary": "gpt-4",
    "fallback": "gpt-3.5-turbo",
    "fast": "gpt-3.5-turbo",
    "code": "gpt-4-turbo-preview"
  },
  "temperature": {
    "creative": 0.8,
    "balanced": 0.5,
    "conservative": 0.2
  }
}
```

### API Keys & Endpoints
- **OpenAI**: Configured via `OPENAI_API_KEY` environment variable
- **Anthropic**: Configured via `ANTHROPIC_API_KEY` environment variable
- **Custom Endpoints**: Support for local AI servers

### Privacy & Security
- **Local Processing**: Code analysis runs locally when possible
- **Data Minimization**: Only necessary code context sent to AI services
- **Opt-out Options**: Configuration to disable AI features per project

## CLI Behavior

### Interactive Mode
- **TUI**: Ink-based interactive terminal interface
- **Commands**: Contextual command suggestions based on project state
- **Help**: Dynamic help system with examples

### Command Shortcuts
```bash
# Quick access to common operations
axilo g component MyComponent    # Generate React component
axilo analyze performance        # Performance analysis
axilo test generate             # Generate missing tests
axilo docs api                  # Generate API documentation
```

### Configuration Files
- **Global Config**: `~/.axiloconfig.json`
- **Project Config**: `.axilorc.json` (if present)
- **Environment**: `.env` files for API keys and settings

## Extension Hooks

### Available Hooks
- `pre-commit`: Code quality checks before git commit
- `post-install`: Setup project-specific configurations
- `on-file-create`: Initialize new files with templates
- `on-build-start`: Pre-build optimizations and validations
- `on-build-complete`: Post-build notifications and deployments

### Hook Implementation
```typescript
// In extension's hooks.ts
export const hooks = {
  'pre-commit': async (files: string[]) => {
    // Run linting, tests, type checking
    await runQualityChecks(files);
  },
  'on-file-create': async (filePath: string) => {
    // Add file header, imports, etc.
    await initializeNewFile(filePath);
  }
};
```

## Development Guidelines

### Code Style
- **Imports**: Grouped by external libraries, then internal modules
- **Naming**: camelCase for variables, PascalCase for types/components
- **Comments**: JSDoc for public APIs, inline comments for complex logic
- **Error Handling**: Explicit error types with proper error messages

### Testing Requirements
- **Unit Tests**: >80% coverage for business logic
- **Integration Tests**: Critical user workflows
- **E2E Tests**: Main application flows
- **Performance Tests**: Load testing for API endpoints

## Deployment & Distribution

### Container Strategy
- **Base Image**: node:18-alpine for minimal size
- **Multi-stage**: Separate build and runtime stages
- **Security**: Non-root user, minimal attack surface

### Publishing
- **NPM Packages**: Scoped packages under `@axilo/`
- **Docker Images**: Published to Docker Hub and GitHub Container Registry
- **CLI Binary**: Standalone executables for major platforms

---

*This AXILO.md file defines the operational context and configuration for the AXILO CLI within this project. It serves as both documentation and functional specification for AI-assisted development workflows.*
