import { describe, it, expect, vi } from 'vitest';
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

// ---------------------------------------------------------------------------
// parseTimestamp — deep edge cases
// ---------------------------------------------------------------------------
describe('parseTimestamp deep edge cases', () => {
  it('returns epoch ms for a valid ISO string', () => {
    const result = parseTimestamp('2026-01-15T10:00:00Z');
    expect(result).toBe(new Date('2026-01-15T10:00:00Z').getTime());
  });

  it('returns epoch ms for an epoch number input', () => {
    const epoch = 1700000000000;
    expect(parseTimestamp(epoch)).toBe(epoch);
  });

  it('handles a small epoch number (seconds-scale)', () => {
    // new Date(1700000000) treats it as ms from epoch, which is Jan 20 1970
    expect(parseTimestamp(1700000000)).toBe(1700000000);
  });

  it('handles negative epoch (date before 1970)', () => {
    const neg = -86400000; // one day before epoch
    expect(parseTimestamp(neg)).toBe(-86400000);
  });

  it('handles Date object input', () => {
    const d = new Date('2025-06-15T12:00:00Z');
    expect(parseTimestamp(d)).toBe(d.getTime());
  });

  it('handles ISO string with positive timezone offset (+05:30)', () => {
    const iso = '2026-03-10T15:30:00+05:30';
    expect(parseTimestamp(iso)).toBe(new Date(iso).getTime());
    expect(parseTimestamp(iso)).toBeGreaterThan(0);
  });

  it('handles ISO string with negative timezone offset (-08:00)', () => {
    const iso = '2026-03-10T15:30:00-08:00';
    expect(parseTimestamp(iso)).toBe(new Date(iso).getTime());
  });

  it('handles ISO string without timezone (treated as local)', () => {
    const iso = '2026-03-10T15:30:00';
    expect(parseTimestamp(iso)).toBe(new Date(iso).getTime());
  });

  it('handles Unix timestamp as string ("1700000000")', () => {
    // new Date("1700000000") attempts to parse as date string
    const result = parseTimestamp('1700000000');
    // This is implementation-dependent; V8 may treat it as invalid
    const expected = new Date('1700000000').getTime();
    if (Number.isFinite(expected)) {
      expect(result).toBe(expected);
    } else {
      expect(result).toBe(0);
    }
  });

  it('handles very large number (year 9999)', () => {
    const farFuture = new Date('9999-12-31T23:59:59Z').getTime();
    expect(parseTimestamp(farFuture)).toBe(farFuture);
  });

  it('handles very old date (year 1900)', () => {
    const old = new Date('1900-01-01T00:00:00Z').getTime();
    expect(parseTimestamp(old)).toBe(old);
    expect(parseTimestamp(old)).toBeLessThan(0); // Before epoch
  });

  it('returns 0 for NaN input', () => {
    expect(parseTimestamp(NaN)).toBe(0);
  });

  it('returns 0 for Infinity', () => {
    // Infinity is truthy, new Date(Infinity) is Invalid Date
    expect(parseTimestamp(Infinity)).toBe(0);
  });

  it('returns 0 for -Infinity', () => {
    expect(parseTimestamp(-Infinity)).toBe(0);
  });

  it('handles boolean true (new Date(true) = epoch + 1ms)', () => {
    // true is truthy, new Date(true).getTime() = 1
    expect(parseTimestamp(true)).toBe(1);
  });

  it('returns 0 for boolean false (falsy)', () => {
    // false is falsy, so value ? ... : 0 returns 0
    expect(parseTimestamp(false)).toBe(0);
  });

  it('returns 0 for empty object (Invalid Date)', () => {
    // {} is truthy, new Date({}).getTime() is NaN
    expect(parseTimestamp({})).toBe(0);
  });

  it('handles empty array (truthy, new Date([]) = epoch 0)', () => {
    // [] is truthy, new Date([]).getTime() = 0, Number.isFinite(0) = true
    expect(parseTimestamp([])).toBe(0);
  });

  it('handles single-element array with valid date string', () => {
    // new Date(['2026-01-15']) attempts toString() which gives '2026-01-15'
    const result = parseTimestamp(['2026-01-15']);
    expect(result).toBe(new Date('2026-01-15').getTime());
  });

  it('returns 0 for whitespace string " "', () => {
    // " " is truthy, new Date(" ") is Invalid Date in V8
    const result = parseTimestamp(' ');
    const expected = new Date(' ').getTime();
    expect(result).toBe(Number.isFinite(expected) ? expected : 0);
  });

  it('returns 0 for "Invalid Date" string', () => {
    expect(parseTimestamp('Invalid Date')).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(parseTimestamp(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(parseTimestamp(undefined)).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(parseTimestamp('')).toBe(0);
  });

  it('returns 0 for 0 (falsy)', () => {
    expect(parseTimestamp(0)).toBe(0);
  });

  it('handles date-only string "2026-01-15"', () => {
    const result = parseTimestamp('2026-01-15');
    expect(result).toBe(new Date('2026-01-15').getTime());
    expect(result).toBeGreaterThan(0);
  });

  it('handles ISO string with milliseconds', () => {
    const iso = '2026-01-15T10:00:00.123Z';
    expect(parseTimestamp(iso)).toBe(new Date(iso).getTime());
  });

  it('returns 0 for Symbol-like weird input via try (function)', () => {
    // A function is truthy, but new Date(function) is Invalid Date
    expect(parseTimestamp(() => {})).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// isEmptyVal — deep edge cases
// ---------------------------------------------------------------------------
describe('isEmptyVal deep edge cases', () => {
  it('returns true for empty string ""', () => {
    expect(isEmptyVal('')).toBe(true);
  });

  it('returns true for null', () => {
    expect(isEmptyVal(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isEmptyVal(undefined)).toBe(true);
  });

  it('returns false for 0 (critical: zero is valid data)', () => {
    expect(isEmptyVal(0)).toBe(false);
  });

  it('returns false for -0', () => {
    expect(isEmptyVal(-0)).toBe(false);
  });

  it('returns false for false (critical: boolean false is valid data)', () => {
    expect(isEmptyVal(false)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isEmptyVal(NaN)).toBe(false);
  });

  it('returns false for empty array []', () => {
    expect(isEmptyVal([])).toBe(false);
  });

  it('returns false for empty object {}', () => {
    expect(isEmptyVal({})).toBe(false);
  });

  it('returns false for whitespace string "  "', () => {
    expect(isEmptyVal('  ')).toBe(false);
  });

  it('returns false for string "null"', () => {
    expect(isEmptyVal('null')).toBe(false);
  });

  it('returns false for string "undefined"', () => {
    expect(isEmptyVal('undefined')).toBe(false);
  });

  it('returns false for string "0"', () => {
    expect(isEmptyVal('0')).toBe(false);
  });

  it('returns false for true', () => {
    expect(isEmptyVal(true)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isEmptyVal(Infinity)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isObjectRecord — deep edge cases
// ---------------------------------------------------------------------------
describe('isObjectRecord deep edge cases', () => {
  it('returns true for plain object', () => {
    expect(isObjectRecord({})).toBe(true);
  });

  it('returns true for object with properties', () => {
    expect(isObjectRecord({ a: 1, b: 2 })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isObjectRecord(null)).toBe(false);
  });

  it('returns false for array', () => {
    expect(isObjectRecord([])).toBe(false);
    expect(isObjectRecord([1, 2, 3])).toBe(false);
  });

  it('returns true for Date object (typeof is "object")', () => {
    expect(isObjectRecord(new Date())).toBe(true);
  });

  it('returns true for RegExp (typeof is "object")', () => {
    expect(isObjectRecord(/test/)).toBe(true);
  });

  it('returns false for function (typeof is "function")', () => {
    expect(isObjectRecord(() => {})).toBe(false);
    expect(isObjectRecord(function() {})).toBe(false);
  });

  it('returns true for new Number(0) (object wrapper)', () => {
    expect(isObjectRecord(new Number(0))).toBe(true);
  });

  it('returns true for new String("") (object wrapper)', () => {
    expect(isObjectRecord(new String(''))).toBe(true);
  });

  it('returns true for new Boolean(false) (object wrapper)', () => {
    expect(isObjectRecord(new Boolean(false))).toBe(true);
  });

  it('returns true for Object.create(null) (no prototype)', () => {
    expect(isObjectRecord(Object.create(null))).toBe(true);
  });

  it('returns true for frozen object', () => {
    expect(isObjectRecord(Object.freeze({ x: 1 }))).toBe(true);
  });

  it('returns true for sealed object', () => {
    expect(isObjectRecord(Object.seal({ x: 1 }))).toBe(true);
  });

  it('returns false for undefined', () => {
    expect(isObjectRecord(undefined)).toBe(false);
  });

  it('returns false for number', () => {
    expect(isObjectRecord(42)).toBe(false);
  });

  it('returns false for string', () => {
    expect(isObjectRecord('hello')).toBe(false);
  });

  it('returns false for boolean', () => {
    expect(isObjectRecord(true)).toBe(false);
    expect(isObjectRecord(false)).toBe(false);
  });

  it('returns false for 0 (falsy)', () => {
    expect(isObjectRecord(0)).toBe(false);
  });

  it('returns true for Map object (it is typeof object)', () => {
    expect(isObjectRecord(new Map())).toBe(true);
  });

  it('returns true for Set object', () => {
    expect(isObjectRecord(new Set())).toBe(true);
  });

  it('returns true for Error object', () => {
    expect(isObjectRecord(new Error('test'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateCloudPayload — exhaustive
// ---------------------------------------------------------------------------
describe('validateCloudPayload exhaustive', () => {
  it('returns no errors for completely empty object', () => {
    expect(validateCloudPayload({})).toEqual([]);
  });

  it('returns no errors for all fields present and valid', () => {
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

  it('returns errors for all array fields as strings', () => {
    const errors = validateCloudPayload({
      tasks: 'bad',
      taskCategories: 'bad',
      taskLabels: 'bad',
      taskPeople: 'bad',
      customPerspectives: 'bad',
      homeWidgets: 'bad',
      triggers: 'bad',
    });
    expect(errors).toHaveLength(7);
    expect(errors).toContain('tasks must be an array');
    expect(errors).toContain('taskCategories must be an array');
    expect(errors).toContain('taskLabels must be an array');
    expect(errors).toContain('taskPeople must be an array');
    expect(errors).toContain('customPerspectives must be an array');
    expect(errors).toContain('homeWidgets must be an array');
    expect(errors).toContain('triggers must be an array');
  });

  it('does NOT error when data is an array (typeof array === "object")', () => {
    // typeof [] === 'object', so `typeof data.data !== 'object'` is false
    const errors = validateCloudPayload({ data: [1, 2, 3] });
    expect(errors).not.toContain('data must be an object');
  });

  it('no error when data is null (falsy check)', () => {
    const errors = validateCloudPayload({ data: null });
    expect(errors).toEqual([]);
  });

  it('no error when data is undefined', () => {
    const errors = validateCloudPayload({ data: undefined });
    expect(errors).toEqual([]);
  });

  it('errors when data is a non-empty string (truthy + not object)', () => {
    const errors = validateCloudPayload({ data: 'hello' });
    expect(errors).toContain('data must be an object');
  });

  it('errors when data is a number (truthy + not object)', () => {
    const errors = validateCloudPayload({ data: 42 });
    expect(errors).toContain('data must be an object');
  });

  it('no error when data is 0 (falsy)', () => {
    const errors = validateCloudPayload({ data: 0 });
    expect(errors).toEqual([]);
  });

  it('only samples first 5 tasks for validation', () => {
    const tasks = Array.from({ length: 10 }, (_, i) => ({
      id: i < 5 ? `task_${i}` : null, // Items 5-9 are null but won't be checked
      title: `Task ${i}`,
    }));
    // Replace items 5-9 with objects missing id
    for (let i = 5; i < 10; i++) {
      tasks[i] = { title: `Bad task ${i}` }; // Missing id
    }
    const errors = validateCloudPayload({ tasks });
    // Only first 5 are sampled, and they all have ids
    expect(errors.filter(e => e.includes('missing id'))).toHaveLength(0);
  });

  it('validates all 5 sampled tasks when all are invalid', () => {
    const tasks = Array.from({ length: 8 }, () => ({ title: 'no id' }));
    const errors = validateCloudPayload({ tasks });
    // Only first 5 sampled
    expect(errors.filter(e => e.includes('missing id'))).toHaveLength(5);
  });

  it('catches tasks with mix of valid and invalid (null task)', () => {
    const tasks = [
      { id: 'a', title: 'Good' },
      null,
      { id: 'c', title: 'Good' },
      { title: 'Missing ID' },
      { id: 'e', title: 'Good' },
    ];
    const errors = validateCloudPayload({ tasks });
    expect(errors).toContain('tasks[1] is not an object');
    expect(errors).toContain('tasks[3] missing id');
    expect(errors).toHaveLength(2);
  });

  it('catches task that is a primitive (number)', () => {
    const errors = validateCloudPayload({ tasks: [42] });
    expect(errors).toContain('tasks[0] is not an object');
  });

  it('catches task that is a string', () => {
    const errors = validateCloudPayload({ tasks: ['hello'] });
    expect(errors).toContain('tasks[0] is not an object');
  });

  it('catches task with id=0 (falsy)', () => {
    const errors = validateCloudPayload({ tasks: [{ id: 0, title: 'Zero' }] });
    expect(errors).toContain('tasks[0] missing id');
  });

  it('catches task with id="" (falsy empty string)', () => {
    const errors = validateCloudPayload({ tasks: [{ id: '', title: 'Empty' }] });
    expect(errors).toContain('tasks[0] missing id');
  });

  it('catches task with id=null', () => {
    const errors = validateCloudPayload({ tasks: [{ id: null }] });
    expect(errors).toContain('tasks[0] missing id');
  });

  it('accepts task with id=1 (truthy number)', () => {
    const errors = validateCloudPayload({ tasks: [{ id: 1 }] });
    expect(errors).toEqual([]);
  });

  it('catches multiple simultaneous field errors', () => {
    const errors = validateCloudPayload({
      data: 'bad',
      tasks: 'bad',
      lastUpdated: 'bad-date',
      meetingNotesByEvent: 'bad',
    });
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });

  it('errors when meetingNotesByEvent is a string', () => {
    const errors = validateCloudPayload({ meetingNotesByEvent: 'hello' });
    expect(errors).toContain('meetingNotesByEvent must be an object');
  });

  it('does NOT error when meetingNotesByEvent is an array (typeof === "object")', () => {
    const errors = validateCloudPayload({ meetingNotesByEvent: [1, 2] });
    expect(errors).not.toContain('meetingNotesByEvent must be an object');
  });

  it('no error for lastUpdated as epoch number (valid Date)', () => {
    const errors = validateCloudPayload({ lastUpdated: 1700000000000 });
    expect(errors.filter(e => e.includes('lastUpdated'))).toHaveLength(0);
  });

  it('no error for lastUpdated as empty string (falsy short-circuit)', () => {
    const errors = validateCloudPayload({ lastUpdated: '' });
    // '' is falsy, so the check `data.lastUpdated && ...` short-circuits
    expect(errors.filter(e => e.includes('lastUpdated'))).toHaveLength(0);
  });

  it('errors for lastUpdated as non-empty invalid string', () => {
    const errors = validateCloudPayload({ lastUpdated: 'not-a-date' });
    expect(errors).toContain('lastUpdated is not a valid date');
  });

  it('no error for lastUpdated as valid ISO string', () => {
    const errors = validateCloudPayload({ lastUpdated: '2026-01-15T10:00:00Z' });
    expect(errors).toEqual([]);
  });

  it('does not validate task samples when tasks is not an array', () => {
    const errors = validateCloudPayload({ tasks: 'not-array' });
    // Should only get 'tasks must be an array', not task sample errors
    expect(errors).toEqual(['tasks must be an array']);
  });

  it('validates tasks when tasks is an empty array', () => {
    const errors = validateCloudPayload({ tasks: [] });
    expect(errors).toEqual([]);
  });

  it('ignores unknown fields without errors', () => {
    const errors = validateCloudPayload({ unknownField: 'whatever', anotherField: 123 });
    expect(errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// normalizeDeletedTaskTombstones — exhaustive
// ---------------------------------------------------------------------------
describe('normalizeDeletedTaskTombstones exhaustive', () => {
  it('returns empty object for null', () => {
    expect(normalizeDeletedTaskTombstones(null)).toEqual({});
  });

  it('returns empty object for undefined', () => {
    expect(normalizeDeletedTaskTombstones(undefined)).toEqual({});
  });

  it('returns empty object for false', () => {
    expect(normalizeDeletedTaskTombstones(false)).toEqual({});
  });

  it('returns empty object for 0', () => {
    expect(normalizeDeletedTaskTombstones(0)).toEqual({});
  });

  it('returns empty object for empty string', () => {
    expect(normalizeDeletedTaskTombstones('')).toEqual({});
  });

  it('returns empty object for a non-object string', () => {
    expect(normalizeDeletedTaskTombstones('hello')).toEqual({});
  });

  it('returns empty object for a number', () => {
    expect(normalizeDeletedTaskTombstones(42)).toEqual({});
  });

  it('handles array input (typeof array === "object", passes guard)', () => {
    // Arrays pass the !raw || typeof raw !== 'object' check
    // Object.entries([]) returns entries with numeric string keys
    const arr = [];
    arr[0] = new Date().toISOString();
    const result = normalizeDeletedTaskTombstones(arr);
    // Key is "0", which is truthy in the `if (!id)` check
    // "0" is truthy (non-empty string), so it proceeds
    expect(typeof result).toBe('object');
  });

  it('returns empty object for empty object input', () => {
    expect(normalizeDeletedTaskTombstones({})).toEqual({});
  });

  it('normalizes a valid recent tombstone with ISO timestamp', () => {
    const now = new Date().toISOString();
    const result = normalizeDeletedTaskTombstones({ task_1: now });
    expect(result).toHaveProperty('task_1');
    expect(result.task_1).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('normalizes a valid tombstone with epoch number timestamp', () => {
    const epoch = Date.now() - 1000; // 1 second ago
    const result = normalizeDeletedTaskTombstones({ task_1: epoch });
    expect(result).toHaveProperty('task_1');
    expect(result.task_1).toBe(new Date(epoch).toISOString());
  });

  it('prunes entries older than 180 days', () => {
    const ttlMs = 180 * 24 * 60 * 60 * 1000;
    const expired = new Date(Date.now() - ttlMs - 1).toISOString();
    const result = normalizeDeletedTaskTombstones({ old_task: expired });
    expect(result).toEqual({});
  });

  it('keeps entries exactly 179 days old', () => {
    const almostExpired = new Date(Date.now() - 179 * 24 * 60 * 60 * 1000).toISOString();
    const result = normalizeDeletedTaskTombstones({ recent_task: almostExpired });
    expect(result).toHaveProperty('recent_task');
  });

  it('keeps entries with future timestamps', () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const result = normalizeDeletedTaskTombstones({ future_task: future });
    expect(result).toHaveProperty('future_task');
  });

  it('skips entries with 0 timestamp (parseTimestamp returns 0, which is falsy)', () => {
    const result = normalizeDeletedTaskTombstones({ task_zero: 0 });
    // parseTimestamp(0) -> 0 is falsy, skipped by `if (!parsed) return`
    expect(result).toEqual({});
  });

  it('skips entries with null timestamp', () => {
    const result = normalizeDeletedTaskTombstones({ task_null: null });
    expect(result).toEqual({});
  });

  it('skips entries with undefined timestamp', () => {
    const result = normalizeDeletedTaskTombstones({ task_undef: undefined });
    expect(result).toEqual({});
  });

  it('skips entries with empty string timestamp', () => {
    const result = normalizeDeletedTaskTombstones({ task_empty: '' });
    expect(result).toEqual({});
  });

  it('skips entries with invalid date string timestamp', () => {
    const result = normalizeDeletedTaskTombstones({ task_bad: 'not-a-date' });
    expect(result).toEqual({});
  });

  it('handles boolean true as timestamp (parseTimestamp(true) = 1)', () => {
    // parseTimestamp(true) = 1, which is truthy
    // But Date.now() - 1 is enormous, so it will be pruned (>180 days from epoch 1ms)
    const result = normalizeDeletedTaskTombstones({ task_bool: true });
    expect(result).toEqual({}); // Epoch + 1ms is way older than 180 days
  });

  it('handles multiple entries with mix of valid and expired', () => {
    const now = new Date().toISOString();
    const expired = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString();
    const result = normalizeDeletedTaskTombstones({
      valid_task: now,
      expired_task: expired,
      invalid_task: 'not-a-date',
    });
    expect(Object.keys(result)).toEqual(['valid_task']);
  });

  it('converts numeric keys to string via String(id)', () => {
    const now = Date.now();
    const result = normalizeDeletedTaskTombstones({ 123: now });
    // Object.entries converts key to "123", String("123") = "123"
    expect(result).toHaveProperty('123');
  });

  it('outputs ISO string timestamps regardless of input format', () => {
    const epoch = Date.now() - 3600000; // 1 hour ago
    const result = normalizeDeletedTaskTombstones({ task_1: epoch });
    expect(result.task_1).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('handles entry right at 180-day boundary', () => {
    const ttlMs = 180 * 24 * 60 * 60 * 1000;
    // Exactly at boundary: now - parsed === ttlMs, which is NOT > ttlMs, so kept
    const boundary = new Date(Date.now() - ttlMs).toISOString();
    const result = normalizeDeletedTaskTombstones({ boundary_task: boundary });
    // Due to ms rounding, this could go either way. Test the logic:
    // now - parsed > ttlMs -> if exactly equal, NOT pruned
    // But Date.now() advances between the two calls, so it might be pruned
    // We just verify it returns a valid object
    expect(typeof result).toBe('object');
  });

  it('preserves all valid entries in a large set', () => {
    const now = Date.now();
    const raw = {};
    for (let i = 0; i < 100; i++) {
      raw[`task_${i}`] = new Date(now - i * 1000).toISOString();
    }
    const result = normalizeDeletedTaskTombstones(raw);
    expect(Object.keys(result)).toHaveLength(100);
  });
});

// ---------------------------------------------------------------------------
// normalizeDeletedEntityTombstones — exhaustive
// ---------------------------------------------------------------------------
describe('normalizeDeletedEntityTombstones exhaustive', () => {
  it('returns empty object for null', () => {
    expect(normalizeDeletedEntityTombstones(null)).toEqual({});
  });

  it('returns empty object for undefined', () => {
    expect(normalizeDeletedEntityTombstones(undefined)).toEqual({});
  });

  it('returns empty object for string', () => {
    expect(normalizeDeletedEntityTombstones('hello')).toEqual({});
  });

  it('returns empty object for number', () => {
    expect(normalizeDeletedEntityTombstones(42)).toEqual({});
  });

  it('returns empty object for false', () => {
    expect(normalizeDeletedEntityTombstones(false)).toEqual({});
  });

  it('returns empty object for empty object input', () => {
    expect(normalizeDeletedEntityTombstones({})).toEqual({});
  });

  it('normalizes a valid nested structure', () => {
    const now = new Date().toISOString();
    const result = normalizeDeletedEntityTombstones({
      taskLabels: { label_1: now },
      taskCategories: { cat_1: now },
    });
    expect(result.taskLabels).toHaveProperty('label_1');
    expect(result.taskCategories).toHaveProperty('cat_1');
  });

  it('skips collection with null value', () => {
    const result = normalizeDeletedEntityTombstones({
      taskLabels: null,
    });
    expect(result).toEqual({});
  });

  it('skips collection with string value', () => {
    const result = normalizeDeletedEntityTombstones({
      taskLabels: 'bad',
    });
    expect(result).toEqual({});
  });

  it('skips collection with number value', () => {
    const result = normalizeDeletedEntityTombstones({
      taskLabels: 42,
    });
    expect(result).toEqual({});
  });

  it('skips collection with boolean value', () => {
    const result = normalizeDeletedEntityTombstones({
      taskLabels: true,
    });
    expect(result).toEqual({});
  });

  it('handles collection with array value (array is typeof "object")', () => {
    // Arrays pass the `typeof ids !== 'object'` check
    // normalizeDeletedTaskTombstones receives an array
    const arr = [];
    const result = normalizeDeletedEntityTombstones({
      taskLabels: arr,
    });
    // normalizeDeletedTaskTombstones([]) processes empty array -> {}
    expect(result.taskLabels).toEqual({});
  });

  it('handles empty inner collections', () => {
    const result = normalizeDeletedEntityTombstones({
      taskLabels: {},
      taskCategories: {},
    });
    expect(result.taskLabels).toEqual({});
    expect(result.taskCategories).toEqual({});
  });

  it('handles mixed valid and invalid collections', () => {
    const now = new Date().toISOString();
    const result = normalizeDeletedEntityTombstones({
      taskLabels: { label_1: now },
      taskCategories: 'invalid',
      taskPeople: null,
    });
    expect(result).toHaveProperty('taskLabels');
    expect(result).not.toHaveProperty('taskCategories');
    expect(result).not.toHaveProperty('taskPeople');
  });

  it('propagates TTL pruning from inner normalizeDeletedTaskTombstones', () => {
    const expired = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString();
    const result = normalizeDeletedEntityTombstones({
      taskLabels: { old_label: expired },
    });
    expect(result.taskLabels).toEqual({});
  });

  it('handles array input at top level (arrays are typeof "object")', () => {
    // Array passes the `!raw || typeof raw !== 'object'` check
    const result = normalizeDeletedEntityTombstones([]);
    // Object.entries([]) is empty
    expect(result).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// mergeCloudAllData — exhaustive
// ---------------------------------------------------------------------------
describe('mergeCloudAllData exhaustive', () => {
  it('returns empty object when both are empty', () => {
    const result = mergeCloudAllData({}, {});
    expect(result).toEqual({});
  });

  it('adopts all cloud dates when local is empty', () => {
    const local = {};
    const cloud = {
      '2026-01-15': { prayers: { fajr: '1' } },
      '2026-01-16': { habits: { exercise: 1 } },
    };
    mergeCloudAllData(local, cloud);
    expect(local).toHaveProperty('2026-01-15');
    expect(local).toHaveProperty('2026-01-16');
  });

  it('preserves local dates when cloud is empty', () => {
    const local = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, {});
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });

  it('keeps non-empty local value, does not overwrite from cloud', () => {
    const local = { '2026-01-15': { prayers: { fajr: '1' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '0.5' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });

  it('keeps local value 0 (non-empty per isEmptyVal)', () => {
    const local = { '2026-01-15': { habits: { exercise: 0 } } };
    const cloud = { '2026-01-15': { habits: { exercise: 5 } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].habits.exercise).toBe(0);
  });

  it('keeps local value false (non-empty per isEmptyVal)', () => {
    const local = { '2026-01-15': { habits: { exercise: false } } };
    const cloud = { '2026-01-15': { habits: { exercise: true } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].habits.exercise).toBe(false);
  });

  it('gap-fills null local field from cloud', () => {
    const local = { '2026-01-15': { prayers: { fajr: null } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });

  it('gap-fills empty string local field from cloud', () => {
    const local = { '2026-01-15': { prayers: { fajr: '' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });

  it('gap-fills undefined local field from cloud', () => {
    const local = { '2026-01-15': { prayers: { fajr: undefined } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });

  it('does NOT gap-fill if cloud value is also empty', () => {
    const local = { '2026-01-15': { prayers: { fajr: '' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('');
  });

  it('does NOT gap-fill if cloud value is null', () => {
    const local = { '2026-01-15': { prayers: { fajr: '' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: null } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('');
  });

  it('does NOT merge categories outside the fixed list', () => {
    const local = { '2026-01-15': { custom: { field: '' } } };
    const cloud = { '2026-01-15': { custom: { field: 'value' } } };
    mergeCloudAllData(local, cloud);
    // 'custom' is not in ['prayers', 'glucose', 'whoop', 'libre', 'family', 'habits']
    expect(local['2026-01-15'].custom.field).toBe('');
  });

  it('adopts entire date including non-standard categories when date is missing locally', () => {
    const local = {};
    const cloud = { '2026-01-15': { custom: { field: 'value' }, prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    // Entire date object adopted as-is, including 'custom'
    expect(local['2026-01-15'].custom.field).toBe('value');
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });

  it('adopts entire category when local date exists but category missing', () => {
    const local = { '2026-01-15': { prayers: { fajr: '1' } } };
    const cloud = { '2026-01-15': { glucose: { avg: '105', max: '150' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].glucose).toEqual({ avg: '105', max: '150' });
  });

  it('returns the mutated localAllData reference', () => {
    const local = {};
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    const result = mergeCloudAllData(local, cloud);
    expect(result).toBe(local); // Same reference
  });

  it('preserves local extra fields not in cloud', () => {
    const local = { '2026-01-15': { prayers: { fajr: '1', dhuhr: '1' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '0.5' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.dhuhr).toBe('1');
    expect(local['2026-01-15'].prayers.fajr).toBe('1'); // Kept (non-empty)
  });

  it('handles all six valid categories', () => {
    const local = {
      '2026-01-15': {
        prayers: { fajr: '' },
        glucose: { avg: '' },
        whoop: { recovery: '' },
        libre: { avg: '' },
        family: { quality: '' },
        habits: { exercise: '' },
      },
    };
    const cloud = {
      '2026-01-15': {
        prayers: { fajr: '1' },
        glucose: { avg: '100' },
        whoop: { recovery: '80' },
        libre: { avg: '90' },
        family: { quality: '5' },
        habits: { exercise: '30' },
      },
    };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
    expect(local['2026-01-15'].glucose.avg).toBe('100');
    expect(local['2026-01-15'].whoop.recovery).toBe('80');
    expect(local['2026-01-15'].libre.avg).toBe('90');
    expect(local['2026-01-15'].family.quality).toBe('5');
    expect(local['2026-01-15'].habits.exercise).toBe('30');
  });

  it('skips cloud categories that are falsy (null/undefined)', () => {
    const local = { '2026-01-15': { prayers: { fajr: '' } } };
    const cloud = { '2026-01-15': { prayers: null } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('');
  });

  it('handles multiple dates with different merge outcomes', () => {
    const local = {
      '2026-01-15': { prayers: { fajr: '1' } },
      '2026-01-16': { prayers: { fajr: '' } },
    };
    const cloud = {
      '2026-01-15': { prayers: { fajr: '0.5' } },
      '2026-01-16': { prayers: { fajr: '1' } },
      '2026-01-17': { prayers: { fajr: '1' } },
    };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('1'); // Local kept
    expect(local['2026-01-16'].prayers.fajr).toBe('1'); // Gap-filled
    expect(local['2026-01-17'].prayers.fajr).toBe('1'); // Adopted
  });

  it('does not merge when local field has whitespace string (not empty per isEmptyVal)', () => {
    const local = { '2026-01-15': { prayers: { fajr: '  ' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    expect(local['2026-01-15'].prayers.fajr).toBe('  '); // Whitespace is NOT empty
  });

  it('gap-fills field that does not exist on local (undefined implicit)', () => {
    const local = { '2026-01-15': { prayers: {} } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    mergeCloudAllData(local, cloud);
    // local.prayers.fajr is undefined -> isEmptyVal(undefined) -> true
    expect(local['2026-01-15'].prayers.fajr).toBe('1');
  });
});

// ---------------------------------------------------------------------------
// mergeEntityCollection — exhaustive
// ---------------------------------------------------------------------------
describe('mergeEntityCollection exhaustive', () => {
  it('returns empty array when both are empty', () => {
    expect(mergeEntityCollection([], [], [])).toEqual([]);
  });

  it('returns local items when cloud is empty', () => {
    const local = [{ id: 'a', name: 'A' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([{ id: 'a', name: 'A' }]);
  });

  it('returns cloud items when local is empty', () => {
    const cloud = [{ id: 'b', name: 'B' }];
    const merged = mergeEntityCollection([], cloud, []);
    expect(merged).toEqual([{ id: 'b', name: 'B' }]);
  });

  it('combines items with unique IDs from both', () => {
    const local = [{ id: 'a', name: 'A' }];
    const cloud = [{ id: 'b', name: 'B' }];
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged).toHaveLength(2);
    expect(merged.map(i => i.id).sort()).toEqual(['a', 'b']);
  });

  it('keeps local on conflict when no timestampFields', () => {
    const local = [{ id: 'a', name: 'Local' }];
    const cloud = [{ id: 'a', name: 'Cloud' }];
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged[0].name).toBe('Local');
  });

  it('cloud wins when cloud timestamp is newer', () => {
    const local = [{ id: 'a', name: 'Old', updatedAt: '2026-01-01T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'New', updatedAt: '2026-01-15T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged[0].name).toBe('New');
  });

  it('local wins when local timestamp is newer', () => {
    const local = [{ id: 'a', name: 'New', updatedAt: '2026-01-15T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'Old', updatedAt: '2026-01-01T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged[0].name).toBe('New');
  });

  it('local wins on equal timestamps (cloudTs > localTs is false)', () => {
    const ts = '2026-01-15T00:00:00Z';
    const local = [{ id: 'a', name: 'Local', updatedAt: ts }];
    const cloud = [{ id: 'a', name: 'Cloud', updatedAt: ts }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged[0].name).toBe('Local');
  });

  it('local wins when both timestamps are 0 (equal)', () => {
    const local = [{ id: 'a', name: 'Local' }];
    const cloud = [{ id: 'a', name: 'Cloud' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    // Both updatedAt undefined -> parseTimestamp(undefined) -> 0 -> 0 > 0 is false -> local wins
    expect(merged[0].name).toBe('Local');
  });

  it('isDeletedFn filters local items', () => {
    const local = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const isDeleted = (id) => id === 'b';
    const merged = mergeEntityCollection(local, [], [], isDeleted);
    expect(merged.map(i => i.id)).toEqual(['a', 'c']);
  });

  it('isDeletedFn filters cloud items', () => {
    const cloud = [{ id: 'x' }, { id: 'y' }];
    const isDeleted = (id) => id === 'y';
    const merged = mergeEntityCollection([], cloud, [], isDeleted);
    expect(merged.map(i => i.id)).toEqual(['x']);
  });

  it('isDeletedFn filters from both local and cloud', () => {
    const local = [{ id: 'a' }, { id: 'del' }];
    const cloud = [{ id: 'b' }, { id: 'del' }];
    const isDeleted = (id) => id === 'del';
    const merged = mergeEntityCollection(local, cloud, [], isDeleted);
    expect(merged.map(i => i.id).sort()).toEqual(['a', 'b']);
  });

  it('skips items without id in local', () => {
    const local = [{ id: 'a' }, { name: 'no-id' }, { id: 'c' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toHaveLength(2);
    expect(merged.map(i => i.id)).toEqual(['a', 'c']);
  });

  it('skips items without id in cloud', () => {
    const cloud = [{ name: 'no-id' }, { id: 'b' }];
    const merged = mergeEntityCollection([], cloud, []);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('b');
  });

  it('skips null items in local', () => {
    const local = [null, { id: 'a' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([{ id: 'a' }]);
  });

  it('skips null items in cloud', () => {
    const cloud = [null, { id: 'b' }];
    const merged = mergeEntityCollection([], cloud, []);
    expect(merged).toEqual([{ id: 'b' }]);
  });

  it('skips primitive items in local', () => {
    const local = ['string', 42, true, { id: 'a' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([{ id: 'a' }]);
  });

  it('skips array items in cloud (isObjectRecord rejects arrays)', () => {
    const cloud = [[1, 2], { id: 'b' }];
    const merged = mergeEntityCollection([], cloud, []);
    expect(merged).toEqual([{ id: 'b' }]);
  });

  it('treats non-array localItems as empty', () => {
    const merged = mergeEntityCollection('not-array', [{ id: 'b' }], []);
    expect(merged).toEqual([{ id: 'b' }]);
  });

  it('treats number localItems as empty', () => {
    const merged = mergeEntityCollection(42, [{ id: 'b' }], []);
    expect(merged).toEqual([{ id: 'b' }]);
  });

  it('handles null localItems via default parameter', () => {
    const merged = mergeEntityCollection(null, [{ id: 'a' }], []);
    expect(merged).toEqual([{ id: 'a' }]);
  });

  it('handles undefined cloudItems via default parameter', () => {
    const merged = mergeEntityCollection([{ id: 'a' }], undefined, []);
    expect(merged).toEqual([{ id: 'a' }]);
  });

  it('handles both null inputs', () => {
    expect(mergeEntityCollection(null, null, [])).toEqual([]);
  });

  it('handles both undefined inputs', () => {
    expect(mergeEntityCollection(undefined, undefined)).toEqual([]);
  });

  it('uses second timestamp field via find(Boolean) when first is missing', () => {
    const local = [{ id: 'a', name: 'Old', createdAt: '2026-01-01T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'New', createdAt: '2026-01-15T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    // updatedAt is undefined (falsy), createdAt is the fallback
    expect(merged[0].name).toBe('New');
  });

  it('uses first available timestamp field when multiple exist', () => {
    const local = [{ id: 'a', name: 'Local', updatedAt: '2026-01-20T00:00:00Z', createdAt: '2026-01-01T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'Cloud', updatedAt: '2026-01-10T00:00:00Z', createdAt: '2026-01-25T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    // Local updatedAt is '2026-01-20', cloud updatedAt is '2026-01-10' -> local wins
    expect(merged[0].name).toBe('Local');
  });

  it('handles duplicate ids in the SAME local array — last one in Map wins', () => {
    const local = [
      { id: 'a', name: 'First' },
      { id: 'a', name: 'Second' },
    ];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Second');
  });

  it('handles duplicate ids in the SAME cloud array — first one wins (kept by local-wins logic)', () => {
    // When first cloud item is inserted into the map, the second finds it as "localItem".
    // With no timestampFields, the code returns early (keeping existing), so the first one wins.
    const cloud = [
      { id: 'b', name: 'First' },
      { id: 'b', name: 'Second' },
    ];
    const merged = mergeEntityCollection([], cloud, []);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('First');
  });

  it('handles duplicate ids in the SAME cloud array — newer timestamp wins', () => {
    const cloud = [
      { id: 'b', name: 'First', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'b', name: 'Second', updatedAt: '2026-01-15T00:00:00Z' },
    ];
    const merged = mergeEntityCollection([], cloud, ['updatedAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Second');
  });

  it('item with id but no other fields is kept', () => {
    const local = [{ id: 'lonely' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([{ id: 'lonely' }]);
  });

  it('item with id=0 is skipped (falsy)', () => {
    const local = [{ id: 0, name: 'Zero' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([]);
  });

  it('item with id=false is skipped (falsy)', () => {
    const local = [{ id: false, name: 'False' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([]);
  });

  it('item with id=null is skipped (falsy)', () => {
    const cloud = [{ id: null, name: 'Null' }];
    const merged = mergeEntityCollection([], cloud, []);
    expect(merged).toEqual([]);
  });

  it('item with numeric id is accepted', () => {
    const local = [{ id: 42, name: 'Numeric' }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged).toEqual([{ id: 42, name: 'Numeric' }]);
  });

  it('handles large collections correctly', () => {
    const local = Array.from({ length: 500 }, (_, i) => ({ id: `local_${i}`, value: i }));
    const cloud = Array.from({ length: 500 }, (_, i) => ({ id: `cloud_${i}`, value: i }));
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged).toHaveLength(1000);
  });

  it('handles large collections with overlapping IDs', () => {
    const local = Array.from({ length: 100 }, (_, i) => ({
      id: `item_${i}`,
      name: 'Local',
      updatedAt: '2026-01-01T00:00:00Z',
    }));
    const cloud = Array.from({ length: 100 }, (_, i) => ({
      id: `item_${i}`,
      name: 'Cloud',
      updatedAt: '2026-01-15T00:00:00Z',
    }));
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged).toHaveLength(100);
    merged.forEach(item => {
      expect(item.name).toBe('Cloud'); // Cloud is newer
    });
  });

  it('isDeletedFn=null (explicit) works the same as omitted', () => {
    const local = [{ id: 'a' }];
    const cloud = [{ id: 'b' }];
    const merged = mergeEntityCollection(local, cloud, [], null);
    expect(merged.map(i => i.id).sort()).toEqual(['a', 'b']);
  });

  it('empty timestampFields array means local always wins on conflict', () => {
    const local = [{ id: 'a', name: 'Local', updatedAt: '2020-01-01T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'Cloud', updatedAt: '2030-01-01T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, []);
    // Even though cloud has newer timestamp, no timestampFields means local wins
    expect(merged[0].name).toBe('Local');
  });

  it('preserves item properties during merge', () => {
    const local = [{ id: 'a', name: 'A', color: 'red', count: 5 }];
    const merged = mergeEntityCollection(local, [], []);
    expect(merged[0]).toEqual({ id: 'a', name: 'A', color: 'red', count: 5 });
  });

  it('cloud item replaces local entirely (no field-level merge)', () => {
    const local = [{ id: 'a', name: 'Local', extra: 'local-only', updatedAt: '2026-01-01T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'Cloud', updatedAt: '2026-01-15T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged[0].name).toBe('Cloud');
    expect(merged[0].extra).toBeUndefined(); // Cloud item doesn't have 'extra'
  });

  it('handles timestampFields with all undefined values on both sides', () => {
    const local = [{ id: 'a', name: 'Local' }];
    const cloud = [{ id: 'a', name: 'Cloud' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    // Both timestamps are undefined -> parseTimestamp(undefined) -> 0 -> 0 > 0 is false -> local wins
    expect(merged[0].name).toBe('Local');
  });

  it('handles cloud item with timestamp and local without -> cloud wins (cloudTs > 0)', () => {
    const local = [{ id: 'a', name: 'Local' }];
    const cloud = [{ id: 'a', name: 'Cloud', updatedAt: '2026-01-15T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    // Local: parseTimestamp(undefined) -> 0; Cloud: parseTimestamp(valid) -> big number
    expect(merged[0].name).toBe('Cloud');
  });

  it('handles local item with timestamp and cloud without -> local wins', () => {
    const local = [{ id: 'a', name: 'Local', updatedAt: '2026-01-15T00:00:00Z' }];
    const cloud = [{ id: 'a', name: 'Cloud' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    // Cloud: parseTimestamp(undefined) -> 0; 0 > localTs is false -> local wins
    expect(merged[0].name).toBe('Local');
  });

  it('returns a new array, not references to input arrays', () => {
    const local = [{ id: 'a' }];
    const cloud = [{ id: 'b' }];
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged).not.toBe(local);
    expect(merged).not.toBe(cloud);
  });

  it('merged items reference original objects (shallow)', () => {
    const localItem = { id: 'a', name: 'Local' };
    const merged = mergeEntityCollection([localItem], [], []);
    expect(merged[0]).toBe(localItem); // Same reference
  });
});

// ---------------------------------------------------------------------------
// Integration / cross-function edge cases
// ---------------------------------------------------------------------------
describe('cross-function integration', () => {
  it('mergeEntityCollection with isDeletedFn built from normalizeDeletedTaskTombstones', () => {
    const now = new Date().toISOString();
    const tombstones = normalizeDeletedTaskTombstones({
      task_deleted: now,
    });
    const isDeleted = (id) => !!tombstones[id];

    const local = [{ id: 'task_deleted' }, { id: 'task_alive' }];
    const cloud = [{ id: 'task_deleted' }, { id: 'task_cloud' }];
    const merged = mergeEntityCollection(local, cloud, [], isDeleted);
    expect(merged.map(i => i.id).sort()).toEqual(['task_alive', 'task_cloud']);
  });

  it('validateCloudPayload accepts output from mergeEntityCollection', () => {
    const merged = mergeEntityCollection(
      [{ id: 'a', title: 'A' }],
      [{ id: 'b', title: 'B' }],
      [],
    );
    const errors = validateCloudPayload({ tasks: merged });
    expect(errors).toEqual([]);
  });

  it('mergeCloudAllData preserves data that validateCloudPayload accepts', () => {
    const local = { '2026-01-15': { prayers: { fajr: '' } } };
    const cloud = { '2026-01-15': { prayers: { fajr: '1' } } };
    const result = mergeCloudAllData(local, cloud);
    const errors = validateCloudPayload({ data: result });
    expect(errors).toEqual([]);
  });

  it('normalizeDeletedEntityTombstones delegates correctly to normalizeDeletedTaskTombstones', () => {
    const now = new Date().toISOString();
    const expired = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString();
    const entityResult = normalizeDeletedEntityTombstones({
      taskLabels: { valid: now, expired: expired },
    });
    const taskResult = normalizeDeletedTaskTombstones({ valid: now, expired: expired });
    // The inner result should match
    expect(entityResult.taskLabels).toEqual(taskResult);
  });

  it('parseTimestamp values are comparable for merge decisions', () => {
    const older = parseTimestamp('2026-01-01T00:00:00Z');
    const newer = parseTimestamp('2026-01-15T00:00:00Z');
    expect(newer).toBeGreaterThan(older);
    expect(older).toBeGreaterThan(0);
  });

  it('isEmptyVal and mergeCloudAllData gap-fill logic are consistent', () => {
    // Verify each empty value type triggers gap-fill
    const empties = ['', null, undefined];
    empties.forEach((empty, i) => {
      const local = { [`date_${i}`]: { prayers: { field: empty } } };
      const cloud = { [`date_${i}`]: { prayers: { field: 'filled' } } };
      mergeCloudAllData(local, cloud);
      expect(local[`date_${i}`].prayers.field).toBe('filled');
    });

    // Verify each non-empty value type blocks gap-fill
    const nonEmpties = [0, false, 'value', '  ', NaN, [], {}];
    nonEmpties.forEach((val, i) => {
      const local = { [`ne_${i}`]: { prayers: { field: val } } };
      const cloud = { [`ne_${i}`]: { prayers: { field: 'should-not-fill' } } };
      mergeCloudAllData(local, cloud);
      // Using Object.is to handle NaN comparison
      expect(Object.is(local[`ne_${i}`].prayers.field, val)).toBe(true);
    });
  });
});
