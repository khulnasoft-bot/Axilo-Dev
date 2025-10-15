import { execSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

let testDir: string;

export async function setupTestEnvironment() {
  // Create temporary directory for tests
  testDir = mkdtempSync(join(tmpdir(), 'axilo-test-'));

  // Set up test environment variables
  process.env.NODE_ENV = 'test';
  process.env.AXILO_TEST_DIR = testDir;

  // Build test dependencies if needed
  try {
    execSync('npm run build --workspace=packages/cli', {
      cwd: join(process.cwd(), '..'),
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn('Failed to build CLI package, tests may fail');
  }
}

export async function teardownTestEnvironment() {
  // Clean up temporary directory
  if (testDir) {
    try {
      rmSync(testDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up test directory:', error);
    }
  }
}

export function getTestDir(): string {
  if (!testDir) {
    throw new Error('Test environment not set up');
  }
  return testDir;
}

export function createTestProject(name: string): string {
  const projectDir = join(testDir, name);
  execSync(`mkdir -p ${projectDir}`);
  return projectDir;
}
