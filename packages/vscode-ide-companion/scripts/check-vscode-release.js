#!/usr/bin/env node

/**
 * AXILO VS Code IDE Companion - VS Code Release Compatibility Checker
 *
 * This script validates VS Code version compatibility for the AXILO VS Code extension.
 * It checks the installed VS Code version against the minimum required version
 * specified in package.json and reports compatibility status.
 *
 * Usage:
 *   node scripts/check-vscode-release.js
 *   npm run check:vscode
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * VS Code version compatibility checker
 */
class VSCodeReleaseChecker {
  constructor() {
    this.packageJsonPath = path.join(__dirname, '..', 'package.json');
    this.minRequiredVersion = this.getMinRequiredVersion();
  }

  /**
   * Get minimum required VS Code version from package.json
   */
  getMinRequiredVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      const engines = packageJson.engines || {};
      const vscodeVersion = engines.vscode;

      if (!vscodeVersion) {
        console.warn('⚠️  No VS Code version specified in package.json engines');
        return '1.80.0'; // Default fallback
      }

      // Parse version requirement (e.g., "^1.80.0" -> "1.80.0")
      const versionMatch = vscodeVersion.match(/(\d+\.\d+\.\d+)/);
      return versionMatch ? versionMatch[1] : '1.80.0';
    } catch (error) {
      console.error('❌ Error reading package.json:', error.message);
      return '1.80.0';
    }
  }

  /**
   * Get current VS Code version using multiple detection methods
   */
  async getCurrentVSCodeVersion() {
    const detectionMethods = [
      this.detectViaCommandLine.bind(this),
      this.detectViaEnvironment.bind(this),
      this.detectViaProcessInfo.bind(this),
      this.detectViaFileSystem.bind(this)
    ];

    for (const method of detectionMethods) {
      try {
        const version = await method();
        if (version && this.isValidVersion(version)) {
          return version;
        }
      } catch (error) {
        // Continue to next method
        continue;
      }
    }

    return null;
  }

  /**
   * Detect VS Code version via command line tools
   */
  detectViaCommandLine() {
    try {
      // Try multiple command variations
      const commands = [
        'code --version',
        'code-insiders --version',
        'vscode --version',
        '/Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code --version'
      ];

      for (const cmd of commands) {
        try {
          const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
          const lines = output.trim().split('\n');
          return lines[0]; // First line should be version
        } catch (error) {
          // Try next command
          continue;
        }
      }
    } catch (error) {
      // Command line detection failed
    }
    return null;
  }

  /**
   * Detect VS Code version via environment variables
   */
  detectViaEnvironment() {
    // Check for VS Code environment variables
    const envVars = [
      'VSCODE_VERSION',
      'VS_CODE_VERSION',
      'VSCODE_PID' // If VS Code is running, we can infer version
    ];

    for (const envVar of envVars) {
      if (process.env[envVar]) {
        return process.env[envVar];
      }
    }

    return null;
  }

  /**
   * Detect VS Code version via running process information
   */
  detectViaProcessInfo() {
    try {
      // Check if VS Code is currently running and get version from process
      const output = execSync('ps aux | grep -i "visual studio code" | grep -v grep', { encoding: 'utf8' });

      // Extract version from common VS Code process patterns
      const versionMatch = output.match(/Visual Studio Code (\d+\.\d+\.\d+)/);
      if (versionMatch) {
        return versionMatch[1];
      }
    } catch (error) {
      // Process detection failed
    }
    return null;
  }

  /**
   * Detect VS Code version via filesystem inspection
   */
  detectViaFileSystem() {
    const commonPaths = [
      // macOS
      '/Applications/Visual Studio Code.app/Contents/Resources/app/package.json',
      '/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/package.json',
      // Linux
      '/usr/share/code/package.json',
      '/opt/visual-studio-code/package.json',
      // Windows
      'C:\\Program Files\\Microsoft VS Code\\resources\\app\\package.json',
      'C:\\Program Files (x86)\\Microsoft VS Code\\resources\\app\\package.json',
      // Snap
      '/snap/code/current/resources/app/package.json'
    ];

    for (const packagePath of commonPaths) {
      try {
        if (fs.existsSync(packagePath)) {
          const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          return packageJson.version;
        }
      } catch (error) {
        // Try next path
        continue;
      }
    }

    return null;
  }

  /**
   * Validate if a version string is properly formatted
   */
  isValidVersion(version) {
    return /^\d+\.\d+\.\d+/.test(version);
  }

  /**
   * Compare two version strings (semantic versioning)
   */
  compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }

    return 0;
  }

  /**
   * Check compatibility between current and required versions
   */
  checkCompatibility(currentVersion, requiredVersion) {
    const comparison = this.compareVersions(currentVersion, requiredVersion);

    return {
      isCompatible: comparison >= 0,
      currentVersion,
      requiredVersion,
      comparison,
      status: comparison >= 0 ? 'compatible' : 'incompatible'
    };
  }

  /**
   * Generate detailed compatibility report
   */
  generateReport(compatibility) {
    const { isCompatible, currentVersion, requiredVersion, status } = compatibility;

    let report = '';
    report += '\n📋 VS Code Compatibility Report\n';
    report += '=' .repeat(40) + '\n';
    report += `Required Version: ${requiredVersion}\n`;
    report += `Current Version:  ${currentVersion}\n`;
    report += `Status:           ${isCompatible ? '✅ Compatible' : '❌ Incompatible'}\n`;

    if (!isCompatible) {
      report += '\n⚠️  Compatibility Issues:\n';
      report += `• Current version (${currentVersion}) is older than required (${requiredVersion})\n`;
      report += '• Extension may not function correctly\n';
      report += '• Consider updating VS Code or checking version requirements\n';
    } else {
      report += '\n✅ Extension should work correctly with current VS Code version\n';
    }

    return report;
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🔍 Checking VS Code version compatibility for AXILO VS Code IDE Companion...\n');

    try {
      // Get current VS Code version
      const currentVersion = await this.getCurrentVSCodeVersion();

      if (!currentVersion) {
        console.error('❌ Could not detect VS Code version');
        console.log('\nTroubleshooting:');
        console.log('• Ensure VS Code is installed');
        console.log('• Check if VS Code is in PATH');
        console.log('• Run: which code');
        console.log('• Try running VS Code at least once');

        if (process.env.CI) {
          process.exit(1);
        }
        return;
      }

      // Check compatibility
      const compatibility = this.checkCompatibility(currentVersion, this.minRequiredVersion);

      // Generate and display report
      const report = this.generateReport(compatibility);
      console.log(report);

      // Exit with appropriate code for automation
      if (!compatibility.isCompatible) {
        console.error('❌ VS Code version compatibility check failed');
        process.exit(1);
      } else {
        console.log('✅ VS Code version compatibility check passed');
        process.exit(0);
      }

    } catch (error) {
      console.error('❌ Error during VS Code version check:', error.message);

      if (process.env.CI) {
        process.exit(1);
      }
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const checker = new VSCodeReleaseChecker();

  // Handle command line arguments
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AXILO VS Code Release Checker

Usage:
  node scripts/check-vscode-release.js [options]

Options:
  --help, -h      Show this help message
  --version       Show current VS Code version only
  --required      Show minimum required version only
  --json          Output results in JSON format

Examples:
  node scripts/check-vscode-release.js
  node scripts/check-vscode-release.js --json
  node scripts/check-vscode-release.js --version
    `);
    return;
  }

  if (args.includes('--version')) {
    const version = await checker.getCurrentVSCodeVersion();
    console.log(version || 'VS Code version not detected');
    return;
  }

  if (args.includes('--required')) {
    console.log(checker.minRequiredVersion);
    return;
  }

  if (args.includes('--json')) {
    const currentVersion = await checker.getCurrentVSCodeVersion();
    const compatibility = checker.checkCompatibility(currentVersion, checker.minRequiredVersion);

    console.log(JSON.stringify({
      currentVersion,
      requiredVersion: checker.minRequiredVersion,
      isCompatible: compatibility.isCompatible,
      status: compatibility.status
    }, null, 2));
    return;
  }

  // Run full compatibility check
  await checker.run();
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { VSCodeReleaseChecker };
