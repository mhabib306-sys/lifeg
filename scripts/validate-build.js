#!/usr/bin/env node
// Build output validator — ensures dist/ contains a valid, complete build.
// Run: node scripts/validate-build.js

import { existsSync, statSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, '..', 'dist');

const errors = [];
const warnings = [];

// 1. dist/ exists
if (!existsSync(dist)) {
  console.error('ERROR: dist/ directory does not exist. Run `npm run build` first.');
  process.exit(1);
}

// 2. index.html exists and is non-empty
const indexPath = resolve(dist, 'index.html');
if (!existsSync(indexPath)) {
  errors.push('dist/index.html does not exist');
} else {
  const size = statSync(indexPath).size;
  if (size === 0) errors.push('dist/index.html is empty');
  // Check for <script tag
  const content = (await import('fs')).readFileSync(indexPath, 'utf8');
  if (!content.includes('<script')) {
    errors.push('dist/index.html does not contain a <script> tag');
  }
}

// 3. At least one .js and one .css in dist/assets/
const assetsDir = resolve(dist, 'assets');
if (!existsSync(assetsDir)) {
  errors.push('dist/assets/ directory does not exist');
} else {
  const files = readdirSync(assetsDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  if (jsFiles.length === 0) errors.push('No .js files in dist/assets/');
  if (cssFiles.length === 0) errors.push('No .css files in dist/assets/');
}

// 4. Total build size warning
function getDirSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) total += getDirSize(full);
    else total += statSync(full).size;
  }
  return total;
}
const totalSize = getDirSize(dist);
const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
if (totalSize > 5 * 1024 * 1024) {
  warnings.push(`Build size is ${sizeMB}MB (>5MB threshold)`);
}

// Report
if (warnings.length) {
  warnings.forEach(w => console.warn(`WARNING: ${w}`));
}

if (errors.length) {
  console.error('BUILD VALIDATION FAILED:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`Build validation passed (${sizeMB}MB)`);
  process.exit(0);
}
