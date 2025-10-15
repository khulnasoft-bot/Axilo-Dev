import { execSync } from 'child_process';
import { join } from 'path';
import { setupTestEnvironment } from './test-env';

export async function setupE2EEnvironment() {
  await setupTestEnvironment();

  // Start A2A server for E2E tests
  const serverProcess = execSync(
    'npm run build:a2a-server && npm run start --workspace=packages/a2a-server',
    {
      cwd: join(process.cwd(), '..'),
      stdio: 'pipe',
      detached: true,
    }
  );

  // Store server process ID for cleanup
  process.env.AXILO_SERVER_PID = serverProcess.pid?.toString();

  // Wait for server to be ready
  await waitForServer('http://localhost:3001/health');

  console.log('E2E environment ready');
}

export async function teardownE2EEnvironment() {
  // Stop A2A server
  const serverPid = process.env.AXILO_SERVER_PID;
  if (serverPid) {
    try {
      process.kill(parseInt(serverPid), 'SIGTERM');
    } catch (error) {
      console.warn('Failed to stop A2A server:', error);
    }
  }
}

async function waitForServer(url: string, timeout = 30000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // Server not ready yet, continue waiting
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}
