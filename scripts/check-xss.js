#!/usr/bin/env node

/**
 * XSS Vulnerability Scanner
 * Scans source files for potentially unsafe innerHTML assignments
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const srcDir = 'src';
const dangerousPatterns = [
  /\.innerHTML\s*=/g,
  /\.outerHTML\s*=/g,
  /insertAdjacentHTML\(/g,
  /document\.write\(/g,
  /document\.writeln\(/g
];

const safeWrappers = [
  'escapeHtml(',
  'sanitizeColor(',
  'twemoji.parse('
];

// Lines with these annotations are reviewed and intentionally exempt
const safeAnnotations = [
  'eslint-disable-next-line no-unsanitized',
  'eslint-disable no-unsanitized',
  '// safe:',
  '/* safe:',
  '// intentional',
  'nosec'
];

function getAllJsFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, idx) => {
    dangerousPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        // Check if it's wrapped in a safe function on the same line
        const isSafe = safeWrappers.some(wrapper => line.includes(wrapper));

        // Check if annotated safe on same line or preceding line
        const prevLine = idx > 0 ? lines[idx - 1] : '';
        const isAnnotated = safeAnnotations.some(ann =>
          line.includes(ann) || prevLine.includes(ann)
        );

        if (!isSafe && !isAnnotated) {
          issues.push({
            file: filePath,
            line: idx + 1,
            code: line.trim(),
            severity: 'high'
          });
        }
      }
    });
  });

  return issues;
}

function main() {
  console.log('Scanning for XSS vulnerabilities...\n');

  const jsFiles = getAllJsFiles(srcDir);
  let totalIssues = 0;

  jsFiles.forEach(file => {
    const issues = scanFile(file);

    if (issues.length > 0) {
      totalIssues += issues.length;
      console.log(`\nWARN  ${file}`);
      issues.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.code}`);
      });
    }
  });

  if (totalIssues === 0) {
    console.log('No XSS vulnerabilities detected!\n');
    process.exit(0);
  } else {
    console.log(`\nFound ${totalIssues} potential XSS vulnerabilities\n`);
    console.log('Fix these by wrapping user content with escapeHtml() or sanitizeColor(),\n');
    console.log('or annotate with: // eslint-disable-next-line no-unsanitized/property\n');
    process.exit(1);
  }
}

main();
