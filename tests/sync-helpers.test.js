import { describe, it, expect } from 'vitest';
import {
  validateCloudPayload,
  normalizeDeletedTaskTombstones,
  normalizeDeletedEntityTombstones,
  mergeCloudAllData,
  mergeEntityCollection,
  parseTimestamp,
  isEmptyVal,
  isObjectRecord,
} from '../src/data/sync-helpers.js';

describe('parseTimestamp', () => {
  it('parses ISO strings', () => {
    expect(parseTimestamp('2026-01-15T10:00:00Z')).toBeGreaterThan(0);
  });

  it('returns 0 for null/undefined/empty', () => {
    expect(parseTimestamp(null)).toBe(0);
    expect(parseTimestamp(undefined)).toBe(0);
    expect(parseTimestamp('')).toBe(0);
  });

  it('returns 0 for invalid date', () => {
    expect(parseTimestamp('not-a-date')).toBe(0);
  });
});

describe('isEmptyVal', () => {
  it('identifies empty values', () => {
    expect(isEmptyVal('')).toBe(true);
    expect(isEmptyVal(null)).toBe(true);
    expect(isEmptyVal(undefined)).toBe(true);
  });

  it('does not treat 0 or false as empty', () => {
    expect(isEmptyVal(0)).toBe(false);
    expect(isEmptyVal(false)).toBe(false);
  });
});

describe('isObjectRecord', () => {
  it('identifies plain objects', () => {
    expect(isObjectRecord({})).toBe(true);
    expect(isObjectRecord({ a: 1 })).toBe(true);
  });

  it('rejects arrays, null, primitives', () => {
    expect(isObjectRecord([])).toBe(false);
    expect(isObjectRecord(null)).toBe(false);
    expect(isObjectRecord('str')).toBe(false);
    expect(isObjectRecord(42)).toBe(false);
  });
});

describe('validateCloudPayload', () => {
  it('returns no errors for valid payload', () => {
    const valid = {
      data: {},
      tasks: [{ id: 'task_1', title: 'Test' }],
      taskCategories: [],
      taskLabels: [],
      taskPeople: [],
      customPerspectives: [],
      homeWidgets: [],
      triggers: [],
      lastUpdated: '2026-01-15T10:00:00Z',
      meetingNotesByEvent: {},
    };
    expect(validateCloudPayload(valid)).toEqual([]);
  });

  it('rejects non-array tasks', () => {
    const errors = validateCloudPayload({ tasks: 'not-array' });
    expect(errors).toContain('tasks must be an array');
  });

  it('rejects non-object data', () => {
    const errors = validateCloudPayload({ data: 'string' });
    expect(errors).toContain('data must be an object');
  });

  it('catches tasks with missing id', () => {
    const errors = validateCloudPayload({ tasks: [{ title: 'no-id' }] });
    expect(errors.some(e => e.includes('missing id'))).toBe(true);
  });

  it('catches invalid lastUpdated', () => {
    const errors = validateCloudPayload({ lastUpdated: 'not-a-date' });
    expect(errors.some(e => e.includes('lastUpdated'))).toBe(true);
  });
});

describe('normalizeDeletedTaskTombstones', () => {
  it('normalizes valid tombstones', () => {
    const now = new Date().toISOString();
    const result = normalizeDeletedTaskTombstones({ task_1: now });
    expect(result).toHaveProperty('task_1');
    expect(typeof result.task_1).toBe('string');
  });

  it('prunes entries older than 180 days', () => {
    const old = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString();
    const result = normalizeDeletedTaskTombstones({ task_old: old });
    expect(result).toEqual({});
  });

  it('returns empty object for null/undefined', () => {
    expect(normalizeDeletedTaskTombstones(null)).toEqual({});
    expect(normalizeDeletedTaskTombstones(undefined)).toEqual({});
  });

  it('skips entries with invalid timestamps', () => {
    const result = normalizeDeletedTaskTombstones({ task_bad: 'not-a-date' });
    expect(result).toEqual({});
  });
});

describe('normalizeDeletedEntityTombstones', () => {
  it('normalizes nested collections', () => {
    const now = new Date().toISOString();
    const result = normalizeDeletedEntityTombstones({
      taskLabels: { label_1: now },
    });
    expect(result.taskLabels).toHaveProperty('label_1');
  });

  it('returns empty object for invalid input', () => {
    expect(normalizeDeletedEntityTombstones(null)).toEqual({});
  });
});

describe('mergeCloudAllData', () => {
  it('adopts dates that only exist in cloud', () => {
    const local = {};
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15']).toEqual(cloud['2026-01-15']);
  });

  it('gap-fills empty local fields from cloud', () => {
    const local = { '2026-01-15': { prayers: { fajr: '', dhuhr: '1' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1', dhuhr: '0.1' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1');    // Was empty, filled
    expect(local['2026-01-15'].prayers.dhuhr).toBe('1');    // Kept local value
  });

  it('does not overwrite non-empty local values', () => {
    const local = { '2026-01-15': { habits: { exercise: 1 } } };
    const cloud = { '2026-01-15': { habits: { exercise: 0 } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].habits.exercise).toBe(1);
  });

  it('adopts entire category if missing locally', () => {
    const local = { '2026-01-15': { prayers: { fajr: '1' } } };
    const cloud = { '2026-01-15': { glucose: { avg: '105' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].glucose.avg).toBe('105');
  });
});

describe('mergeEntityCollection', () => {
  it('combines items from both sets by ID', () => {
    const local = [{ id: 'a', name: 'A' }];
    const cloud = [{ id: 'b', name: 'B' }];
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged.map(i => i.id).sort()).toEqual(['a', 'b']);
  });

  it('uses newest-wins when timestamps provided', () => {
    const local = [{ id: 'a', name: 'Old', updatedAt: '2026-01-01T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'New', updatedAt: '2026-01-15T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged[0].name).toBe('New');
  });

  it('keeps local on timestamp tie', () => {
    const ts = '2026-01-15T00:00:00Z';
    const local = [{ id: 'a', name: 'Local', updatedAt: ts }];
    const cloud = [{ id: 'a', name: 'Cloud', updatedAt: ts }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged[0].name).toBe('Local');
  });

  it('keeps local when no timestamp fields and IDs conflict', () => {
    const local = [{ id: 'a', name: 'Local' }];
    const cloud = [{ id: 'a', name: 'Cloud' }];
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged[0].name).toBe('Local');
  });

  it('skips items marked as deleted', () => {
    const local = [{ id: 'a' }, { id: 'b' }];
    const cloud = [{ id: 'c' }];
    const isDeleted = (id) => id === 'b';
    const merged = mergeEntityCollection(local, cloud, [], isDeleted);
    expect(merged.map(i => i.id).sort()).toEqual(['a', 'c']);
  });

  it('handles empty/null inputs gracefully', () => {
    expect(mergeEntityCollection(null, null, [])).toEqual([]);
    expect(mergeEntityCollection([], [], [])).toEqual([]);
  });
});
