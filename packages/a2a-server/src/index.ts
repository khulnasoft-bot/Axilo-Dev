import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { AgentRouter } from './http/routes/agent';
import { ToolRouter } from './http/routes/tools';
import { ExtensionRouter } from './http/routes/extensions';
import { MemoryRouter } from './http/routes/memory';
import { AgentExecutor } from './agent/AgentExecutor';
import { PersistenceManager } from './persistence/PersistenceManager';
import { config } from './config';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agent', AgentRouter);
app.use('/api/tools', ToolRouter);
app.use('/api/extensions', ExtensionRouter);
app.use('/api/memory', MemoryRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    uptime: process.uptime()
  });
});

// WebSocket connection handling
wss.on('connection', (ws, request) => {
  console.log('WebSocket client connected');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      await AgentExecutor.handleWebSocketMessage(ws, message);
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Initialize persistence manager
PersistenceManager.initialize();

// Start server
const PORT = config.port || 3001;
server.listen(PORT, () => {
  console.log(`🚀 AXILO A2A Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down A2A server...');
  server.close();
  await PersistenceManager.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down A2A server...');
  server.close();
  await PersistenceManager.close();
  process.exit(0);
});
