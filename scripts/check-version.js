#!/usr/bin/env node
// Version consistency checker — ensures APP_VERSION, package.json, and index.html stay in sync.
// Run: node scripts/check-version.js

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 1. package.json
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const pkgVersion = pkg.version;

// 2. src/constants.js — APP_VERSION = '4.38.5 - Homebase'
const constantsSrc = readFileSync(resolve(root, 'src/constants.js'), 'utf8');
const constantsMatch = constantsSrc.match(/APP_VERSION\s*=\s*'([^']+)'/);
if (!constantsMatch) {
  console.error('ERROR: Could not find APP_VERSION in src/constants.js');
  process.exit(1);
}
const constantsVersion = constantsMatch[1].split(/\s*-\s*/)[0].trim();

// 3. index.html — var v='4.38.5'
const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf8');
const htmlMatch = indexHtml.match(/var\s+v\s*=\s*'([^']+)'/);
if (!htmlMatch) {
  console.error('ERROR: Could not find var v=\'...\' in index.html');
  process.exit(1);
}
const htmlVersion = htmlMatch[1];

// Compare
const versions = {
  'package.json': pkgVersion,
  'src/constants.js': constantsVersion,
  'index.html': htmlVersion,
};

const allMatch = pkgVersion === constantsVersion && pkgVersion === htmlVersion;

if (allMatch) {
  console.log(`Version check passed: ${pkgVersion}`);
  process.exit(0);
} else {
  console.error('VERSION MISMATCH detected:');
  Object.entries(versions).forEach(([file, ver]) => {
    const marker = ver === pkgVersion ? ' ' : '!';
    console.error(`  ${marker} ${file}: ${ver}`);
  });
  console.error('\nAll three must match. Update the mismatched files before deploying.');
  process.exit(1);
}
