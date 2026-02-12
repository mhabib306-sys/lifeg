#!/usr/bin/env node
// Version sync — reads version from package.json (single source of truth)
// and auto-updates all other locations that must match.
// Run: node scripts/check-version.js          (auto-fix mode, used by predeploy)
//      node scripts/check-version.js --check  (validate-only, no writes)

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');

// Source of truth
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const version = pkg.version;

let fixed = 0;
let errors = 0;

// --- src/constants.js ---
const constantsPath = resolve(root, 'src/constants.js');
const constantsSrc = readFileSync(constantsPath, 'utf8');
const constantsMatch = constantsSrc.match(/APP_VERSION\s*=\s*'([^']+)'/);
if (!constantsMatch) {
  console.error('ERROR: Could not parse APP_VERSION in src/constants.js');
  errors++;
} else {
  const currentVersion = constantsMatch[1].split(/\s*-\s*/)[0].trim();
  if (currentVersion !== version) {
    if (checkOnly) {
      console.error(`  ! src/constants.js: ${currentVersion} (expected ${version})`);
      errors++;
    } else {
      const updated = constantsSrc.replace(
        /APP_VERSION\s*=\s*'[^']+'/,
        `APP_VERSION = '${version} - Homebase'`
      );
      writeFileSync(constantsPath, updated);
      console.log(`  ✓ src/constants.js: ${currentVersion} → ${version}`);
      fixed++;
    }
  }
}

// --- index.html ---
const indexPath = resolve(root, 'index.html');
const indexSrc = readFileSync(indexPath, 'utf8');
const htmlMatch = indexSrc.match(/var\s+v\s*=\s*'([^']+)'/);
if (!htmlMatch) {
  console.error('ERROR: Could not parse var v=\'...\' in index.html');
  errors++;
} else if (htmlMatch[1] !== version) {
  if (checkOnly) {
    console.error(`  ! index.html: ${htmlMatch[1]} (expected ${version})`);
    errors++;
  } else {
    const updated = indexSrc.replace(
      /var\s+v\s*=\s*'[^']+'/,
      `var v='${version}'`
    );
    writeFileSync(indexPath, updated);
    console.log(`  ✓ index.html: ${htmlMatch[1]} → ${version}`);
    fixed++;
  }
}

// --- CLAUDE.md ---
const claudePath = resolve(root, 'CLAUDE.md');
const claudeSrc = readFileSync(claudePath, 'utf8');
const claudeMatch = claudeSrc.match(/\*\*Homebase\*\*\s*\(v([\d.]+)\s*-\s*Homebase\)/);
if (claudeMatch && claudeMatch[1] !== version) {
  if (checkOnly) {
    console.error(`  ! CLAUDE.md: ${claudeMatch[1]} (expected ${version})`);
    errors++;
  } else {
    const updated = claudeSrc.replace(
      /\*\*Homebase\*\*\s*\(v[\d.]+ - Homebase\)/,
      `**Homebase** (v${version} - Homebase)`
    );
    writeFileSync(claudePath, updated);
    console.log(`  ✓ CLAUDE.md: ${claudeMatch[1]} → ${version}`);
    fixed++;
  }
}

// Result
if (errors > 0 && checkOnly) {
  console.error(`\nVersion mismatch: ${errors} file(s) differ from package.json (${version})`);
  process.exit(1);
}

if (fixed > 0) {
  console.log(`\nVersion synced to ${version} (${fixed} file(s) updated)`);
} else if (errors === 0) {
  console.log(`Version check passed: ${version}`);
}

process.exit(errors > 0 ? 1 : 0);
