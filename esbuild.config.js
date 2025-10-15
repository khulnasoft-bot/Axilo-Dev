import esbuild from 'esbuild';
import { builtinModules } from 'module';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

// Read package.json for version and other metadata
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

/**
 * Shared esbuild configuration for AXILO CLI monorepo
 * Supports both CLI and a2a-server packages
 */

// Base configuration shared across all builds
const baseConfig = {
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  bundle: true,
  treeShaking: true,
  sourcemap: process.env.NODE_ENV !== 'production',
  minify: process.env.NODE_ENV === 'production',
  legalComments: 'none',
  banner: {
    js: `#!/usr/bin/env node
/**
 * AXILO CLI ${packageJson.version}
 * Built: ${new Date().toISOString()}
 */`
  },
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.js': 'js',
    '.jsx': 'jsx',
    '.json': 'json'
  },
  external: [
    // Node.js built-ins
    ...builtinModules,
    // External dependencies that shouldn't be bundled
    '@axilo/a2a-server',
    'express',
    'cors',
    'helmet',
    'morgan',
    'compression',
    '@google-cloud/storage',
    'openai',
    '@anthropic-ai/sdk',
    'commander',
    'ink',
    'react',
    'chalk',
    'ora',
    'inquirer',
    'axios',
    'open',
    'node-fetch',
    'ws',
    'zod',
    'uuid'
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    '__DEV__': process.env.NODE_ENV !== 'production' ? 'true' : 'false'
  },
  logLevel: 'info'
};

// Package-specific configurations
const packageConfigs = {
  core: {
    entryPoints: ['./packages/core/index.ts'],
    outfile: './packages/core/dist/index.js',
    external: [
      ...(baseConfig.external || []),
      // Core package externals (minimal dependencies)
    ]
  },
  cli: {
    entryPoints: ['./packages/cli/src/index.tsx'],
    outfile: './packages/cli/dist/index.js',
    external: [
      ...(baseConfig.external || []),
      // CLI specific externals
    ],
    banner: {
      js: `#!/usr/bin/env node
/**
 * AXILO CLI ${packageJson.version}
 * AI-powered developer assistant CLI with interactive TUI
 * Built: ${new Date().toISOString()}
 */`
    }
  },
  'a2a-server': {
    entryPoints: ['./packages/a2a-server/src/index.ts'],
    outfile: './packages/a2a-server/dist/index.js',
    external: [
      ...(baseConfig.external || []),
      // Server specific externals (if any)
    ]
  }
};

/**
 * Get configuration for a specific package
 */
export function getConfig(packageName) {
  const packageConfig = packageConfigs[packageName];

  return {
    ...baseConfig,
    ...packageConfig
  };
}

/**
 * Build a specific package
 */
export async function buildPackage(packageName) {
  const config = getConfig(packageName);

  if (process.env.WATCH) {
    // Watch mode for development
    const ctx = await esbuild.context(config);
    await ctx.watch();
    console.log(`Watching ${packageName} for changes...`);
  } else {
    // Single build
    const result = await esbuild.build(config);

    if (result.errors.length > 0) {
      console.error('Build failed:');
      result.errors.forEach(error => console.error(error));
      process.exit(1);
    }

    console.log(`✅ ${packageName} built successfully`);
  }
}

/**
 * Build all packages
 */
export async function buildAll() {
  console.log('🚀 Building all packages...');

  for (const packageName of Object.keys(packageConfigs)) {
    await buildPackage(packageName);
  }

  console.log('🎉 All packages built successfully!');
}

// CLI interface for direct usage
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'build':
      const packageName = args[1];
      if (packageName && packageConfigs[packageName]) {
        buildPackage(packageName);
      } else {
        buildAll();
      }
      break;

    case 'watch':
      process.env.WATCH = 'true';
      const watchPackage = args[1];
      if (watchPackage && packageConfigs[watchPackage]) {
        buildPackage(watchPackage);
      } else {
        console.log('Please specify a package to watch: core, cli, a2a-server, or vscode-ide-companion');
        process.exit(1);
      }
      break;

    default:
      console.log(`
Usage: node esbuild.config.js <command> [package]

Commands:
  build [package]    Build all packages or a specific package
  watch <package>    Watch and rebuild a specific package

Packages:
  core                 Build core package
  cli                  Build CLI package
  a2a-server           Build a2a-server package
  vscode-ide-companion Build VS Code extension

Examples:
  node esbuild.config.js build
  node esbuild.config.js build core
  node esbuild.config.js watch cli
      `);
      break;
  }
}
