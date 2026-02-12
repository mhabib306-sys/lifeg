import { describe, it, expect } from 'vitest';

// This test verifies that every key in exportData's output has a corresponding
// restore path in importData, by inspecting the source code.
// This catches the common bug where a new field is added to export but forgotten in import.

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const exportImportSrc = readFileSync(resolve(__dirname, '..', 'src', 'data', 'export-import.js'), 'utf8');

describe('export/import parity', () => {
  // Extract keys from the exportObj literal in exportData()
  function getExportKeys() {
    // Use balanced-brace matching: find everything between `const exportObj = {` and `};`
    const start = exportImportSrc.indexOf('const exportObj');
    if (start === -1) throw new Error('Could not find exportObj in export-import.js');
    const braceStart = exportImportSrc.indexOf('{', start);
    let depth = 0;
    let braceEnd = -1;
    for (let i = braceStart; i < exportImportSrc.length; i++) {
      if (exportImportSrc[i] === '{') depth++;
      else if (exportImportSrc[i] === '}') { depth--; if (depth === 0) { braceEnd = i; break; } }
    }
    if (braceEnd === -1) throw new Error('Could not find closing brace for exportObj');
    const body = exportImportSrc.slice(braceStart + 1, braceEnd);
    // Match property names (word characters before colon)
    return [...body.matchAll(/(\w+)\s*:/g)].map(m => m[1]);
  }

  // Extract keys that importData checks for (pattern: `if (imported.KEY)`)
  function getImportKeys() {
    const importSection = exportImportSrc.split('export function importData')[1];
    if (!importSection) throw new Error('Could not find importData in export-import.js');
    return [...importSection.matchAll(/imported\.(\w+)/g)].map(m => m[1]);
  }

  it('every exported key has a corresponding import path', () => {
    const exportKeys = getExportKeys();
    const importKeys = new Set(getImportKeys());

    // lastUpdated is metadata, not a state field to restore
    const exceptions = ['lastUpdated'];

    const missing = exportKeys.filter(key => !importKeys.has(key) && !exceptions.includes(key));

    if (missing.length > 0) {
      throw new Error(
        `Export keys missing from importData: ${missing.join(', ')}.\n` +
        'Add import handling for these keys in importData().'
      );
    }
  });

  it('export includes all expected data categories', () => {
    const exportKeys = getExportKeys();
    const required = [
      'data', 'weights', 'tasks', 'taskCategories', 'taskLabels',
      'taskPeople', 'customPerspectives', 'homeWidgets', 'xp', 'streak', 'achievements',
    ];
    required.forEach(key => {
      expect(exportKeys).toContain(key);
    });
  });
});
