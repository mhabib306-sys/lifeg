#!/usr/bin/env node
// Bump version in package.json and auto-sync to all other files.
// Usage:
//   node scripts/bump-version.js patch   → 4.42.0 → 4.42.1
//   node scripts/bump-version.js minor   → 4.42.0 → 4.43.0
//   node scripts/bump-version.js major   → 4.42.0 → 5.0.0
//   node scripts/bump-version.js 4.50.0  → sets exact version

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node scripts/bump-version.js <patch|minor|major|X.Y.Z>');
  process.exit(1);
}

// Read current version
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const current = pkg.version;
const [major, minor, patch] = current.split('.').map(Number);

// Calculate new version
let newVersion;
if (arg === 'patch') newVersion = `${major}.${minor}.${patch + 1}`;
else if (arg === 'minor') newVersion = `${major}.${minor + 1}.0`;
else if (arg === 'major') newVersion = `${major + 1}.0.0`;
else if (/^\d+\.\d+\.\d+$/.test(arg)) newVersion = arg;
else {
  console.error(`Invalid version argument: ${arg}`);
  console.error('Expected: patch, minor, major, or X.Y.Z');
  process.exit(1);
}

// Write to package.json
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`package.json: ${current} → ${newVersion}`);

// Auto-sync all other files
execSync('node scripts/check-version.js', { cwd: root, stdio: 'inherit' });

console.log(`\nVersion bumped to ${newVersion}`);
