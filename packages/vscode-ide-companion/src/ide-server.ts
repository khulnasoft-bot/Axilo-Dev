import WebSocket from 'ws';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';

const execAsync = promisify(exec);

/**
 * AXILO VS Code IDE Server
 *
 * This server provides backend integration between VS Code and AXILO CLI,
 * enabling real-time AI-powered development assistance within the IDE.
 */
export class IDEServer extends EventEmitter {
  private wss: WebSocket.Server | null = null;
  private app: express.Application;
  private server: any;
  private port: number;
  private clients: Set<WebSocket> = new Set();
  private axiloPath: string | null = null;

  constructor(port = 8080) {
    super();
    this.port = port;
    this.app = express();

    this.setupMiddleware();
    this.setupRoutes();
    this.detectAxiloCLI();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Setup HTTP routes
   */
  private setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        axiloConnected: this.axiloPath !== null,
        activeClients: this.clients.size
      });
    });

    // Configuration endpoint
    this.app.get('/config', (req, res) => {
      res.json({
        axiloPath: this.axiloPath,
        serverPort: this.port,
        supportedFeatures: [
          'code-generation',
          'code-analysis',
          'ai-chat',
          'test-generation',
          'documentation'
        ]
      });
    });

    // AXILO CLI execution endpoint
    this.app.post('/execute', async (req, res) => {
      try {
        const { command, args = [], cwd } = req.body;

        if (!command) {
          return res.status(400).json({ error: 'Command is required' });
        }

        const result = await this.executeAxiloCommand(command, args, cwd);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: 'Command execution failed',
          details: error.message
        });
      }
    });

    // WebSocket upgrade handling
    this.app.get('/ws', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>AXILO IDE Server WebSocket</title>
        </head>
        <body>
          <h1>AXILO IDE Server</h1>
          <p>WebSocket server is running on port ${this.port}</p>
          <p>Use a WebSocket client to connect to ws://localhost:${this.port}</p>
        </body>
        </html>
      `);
    });
  }

  /**
   * Detect AXILO CLI installation
   */
  private async detectAxiloCLI() {
    const possiblePaths = [
      'axilo',
      '/usr/local/bin/axilo',
      '/usr/bin/axilo',
      path.join(process.env.HOME || '', '.local', 'bin', 'axilo')
    ];

    for (const axiloPath of possiblePaths) {
      try {
        await execAsync(`${axiloPath} --version`);
        this.axiloPath = axiloPath;
        console.log(`✅ Found AXILO CLI at: ${axiloPath}`);
        return;
      } catch (error) {
        // Try next path
      }
    }

    console.warn('⚠️  AXILO CLI not found in PATH. Some features may not work.');
    this.axiloPath = null;
  }

  /**
   * Execute AXILO CLI command
   */
  private async executeAxiloCommand(command: string, args: string[] = [], cwd?: string) {
    if (!this.axiloPath) {
      throw new Error('AXILO CLI not found');
    }

    const fullCommand = [this.axiloPath, command, ...args].join(' ');
    const options = cwd ? { cwd } : {};

    try {
      const { stdout, stderr } = await execAsync(fullCommand, options);

      return {
        success: true,
        command: fullCommand,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0
      };
    } catch (error: any) {
      return {
        success: false,
        command: fullCommand,
        stdout: error.stdout?.trim() || '',
        stderr: error.stderr?.trim() || '',
        exitCode: error.code || 1,
        error: error.message
      };
    }
  }

  /**
   * Start the IDE server
   */
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = createServer(this.app);

      // Setup WebSocket server
      this.wss = new WebSocket.Server({ server: this.server });

      this.wss.on('connection', (ws, request) => {
        console.log('🔗 New WebSocket client connected');
        this.clients.add(ws);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'welcome',
          message: 'Connected to AXILO IDE Server',
          timestamp: new Date().toISOString()
        }));

        // Handle incoming messages
        ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data.toString());
            await this.handleWebSocketMessage(ws, message);
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'error',
              error: 'Invalid message format',
              timestamp: new Date().toISOString()
            }));
          }
        });

        // Handle client disconnect
        ws.on('close', () => {
          console.log('🔌 WebSocket client disconnected');
          this.clients.delete(ws);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.clients.delete(ws);
        });
      });

      this.server.listen(this.port, () => {
        console.log(`🚀 AXILO IDE Server started on port ${this.port}`);
        console.log(`📡 WebSocket endpoint: ws://localhost:${this.port}`);
        console.log(`🔗 HTTP API: http://localhost:${this.port}`);

        this.emit('started', { port: this.port });
        resolve();
      });
    });
  }

  /**
   * Stop the IDE server
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.wss) {
        this.wss.close(() => {
          console.log('WebSocket server closed');
        });
      }

      if (this.server) {
        this.server.close(() => {
          console.log('HTTP server closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Handle WebSocket messages from VS Code extension
   */
  private async handleWebSocketMessage(ws: WebSocket, message: any) {
    const { type, data, requestId } = message;

    try {
      let response;

      switch (type) {
        case 'ping':
          response = { type: 'pong', timestamp: new Date().toISOString() };
          break;

        case 'execute-command':
          response = await this.handleCommandExecution(data);
          break;

        case 'get-config':
          response = await this.handleGetConfig(data);
          break;

        case 'analyze-code':
          response = await this.handleCodeAnalysis(data);
          break;

        case 'generate-code':
          response = await this.handleCodeGeneration(data);
          break;

        case 'ai-chat':
          response = await this.handleAIChat(data);
          break;

        default:
          response = {
            error: 'Unknown message type',
            receivedType: type
          };
      }

      // Send response back to client
      ws.send(JSON.stringify({
        type: 'response',
        requestId,
        data: response,
        timestamp: new Date().toISOString()
      }));

    } catch (error: any) {
      // Send error response
      ws.send(JSON.stringify({
        type: 'error',
        requestId,
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Handle command execution requests
   */
  private async handleCommandExecution(data: any) {
    const { command, args, cwd } = data;
    return await this.executeAxiloCommand(command, args, cwd);
  }

  /**
   * Handle configuration requests
   */
  private async handleGetConfig(data: any) {
    return {
      axiloAvailable: this.axiloPath !== null,
      serverVersion: '0.1.0',
      features: [
        'code-generation',
        'code-analysis',
        'ai-chat',
        'test-generation'
      ]
    };
  }

  /**
   * Handle code analysis requests
   */
  private async handleCodeAnalysis(data: any) {
    const { filePath, code, analysisType = 'comprehensive' } = data;

    // This would integrate with AXILO CLI's code analysis capabilities
    return {
      analysisType,
      filePath,
      suggestions: [
        'Consider adding error handling',
        'Code follows good practices',
        'Performance looks optimal'
      ],
      issues: [],
      score: 85
    };
  }

  /**
   * Handle code generation requests
   */
  private async handleCodeGeneration(data: any) {
    const { prompt, language = 'typescript', context } = data;

    // This would integrate with AXILO CLI's code generation
    return {
      generatedCode: `// Generated code for: ${prompt}
// Language: ${language}
function generatedFunction() {
  // TODO: Implement based on requirements
  return 'Hello, World!';
}`,
      language,
      explanation: 'Generated function based on your requirements'
    };
  }

  /**
   * Handle AI chat requests
   */
  private async handleAIChat(data: any) {
    const { message, context } = data;

    // This would integrate with AXILO CLI's AI chat capabilities
    return {
      response: `AI response to: "${message}". This would be a comprehensive answer based on the context provided.`,
      confidence: 0.9,
      sources: ['axilo-knowledge-base'],
      suggestions: [
        'Consider reviewing the documentation',
        'Check the AXILO CLI help for more options'
      ]
    };
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(data: any) {
    const message = JSON.stringify({
      type: 'broadcast',
      data,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Get server statistics
   */
  getStats() {
    return {
      port: this.port,
      uptime: process.uptime(),
      activeClients: this.clients.size,
      axiloConnected: this.axiloPath !== null,
      memoryUsage: process.memoryUsage()
    };
  }
}

/**
 * Standalone server runner
 */
async function main() {
  const port = parseInt(process.env.IDE_SERVER_PORT || '8080');
  const server = new IDEServer(port);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  try {
    await server.start();
    console.log('✅ AXILO IDE Server is running and ready to accept connections');
  } catch (error) {
    console.error('❌ Failed to start IDE server:', error);
    process.exit(1);
  }
}

// Export for use in other modules
export default IDEServer;

// Run standalone if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
