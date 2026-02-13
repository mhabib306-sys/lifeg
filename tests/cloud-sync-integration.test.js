/// <reference types="vitest" />
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

// ============================================================================
// Helper factories
// ============================================================================

function makeTask(overrides = {}) {
  return {
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: 'Test task',
    status: 'inbox',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeEntity(id, overrides = {}) {
  return {
    id,
    name: `Entity ${id}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeTombstone(id, daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return { [id]: date.toISOString() };
}

function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function makeAllDataEntry(overrides = {}) {
  return {
    prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
    glucose: { avg: '', tir: '', insulin: '' },
    whoop: { sleepPerf: '', recovery: '', strain: '' },
    libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
    family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
    habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' },
    ...overrides,
  };
}

// ============================================================================
// Entity relationship integrity through sync
// ============================================================================

describe('Entity relationship integrity through sync', () => {
  it('task with areaId is preserved after mergeEntityCollection', () => {
    const task = makeTask({ id: 't1', areaId: 'area_work', updatedAt: '2026-01-10T00:00:00Z' });
    const merged = mergeEntityCollection([task], [], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].areaId).toBe('area_work');
  });

  it('task with areaId survives merge with cloud (cloud has same task, older)', () => {
    const localTask = makeTask({ id: 't1', areaId: 'area_work', updatedAt: '2026-01-15T00:00:00Z' });
    const cloudTask = makeTask({ id: 't1', areaId: 'area_personal', updatedAt: '2026-01-10T00:00:00Z' });
    const merged = mergeEntityCollection([localTask], [cloudTask], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].areaId).toBe('area_work'); // local wins (newer)
  });

  it('task referencing label IDs survives mergeEntityCollection', () => {
    const label1 = makeEntity('label_1', { updatedAt: '2026-01-10T00:00:00Z' });
    const label2 = makeEntity('label_2', { updatedAt: '2026-01-10T00:00:00Z' });
    const cloudLabel3 = makeEntity('label_3', { updatedAt: '2026-01-10T00:00:00Z' });
    const mergedLabels = mergeEntityCollection([label1, label2], [cloudLabel3], ['updatedAt', 'createdAt']);
    expect(mergedLabels).toHaveLength(3);
    const ids = mergedLabels.map(l => l.id);
    expect(ids).toContain('label_1');
    expect(ids).toContain('label_2');
    expect(ids).toContain('label_3');
  });

  it('orphaned references (task points to non-existent entity) preserved with orphan ref', () => {
    const task = makeTask({ id: 't1', areaId: 'area_DELETED', labelIds: ['label_GONE'], updatedAt: '2026-01-10T00:00:00Z' });
    const merged = mergeEntityCollection([task], [], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].areaId).toBe('area_DELETED');
    expect(merged[0].labelIds).toEqual(['label_GONE']);
  });

  it('task with multiple entity references all preserved after merge', () => {
    const task = makeTask({
      id: 't1',
      areaId: 'area_work',
      categoryId: 'cat_dev',
      labelIds: ['label_1', 'label_2'],
      personIds: ['person_1'],
      updatedAt: '2026-02-01T00:00:00Z',
    });
    const merged = mergeEntityCollection([task], [], ['updatedAt', 'createdAt']);
    expect(merged[0].categoryId).toBe('cat_dev');
    expect(merged[0].labelIds).toEqual(['label_1', 'label_2']);
    expect(merged[0].personIds).toEqual(['person_1']);
  });
});

// ============================================================================
// Tombstone propagation across sync cycles
// ============================================================================

describe('Tombstone propagation across sync cycles', () => {
  it('create tombstone, normalize, tombstone present', () => {
    const raw = { task_123: new Date().toISOString() };
    const normalized = normalizeDeletedTaskTombstones(raw);
    expect(normalized).toHaveProperty('task_123');
  });

  it('tombstone TTL boundary: 179 days kept', () => {
    const raw = { task_A: daysAgoISO(179) };
    const normalized = normalizeDeletedTaskTombstones(raw);
    expect(normalized).toHaveProperty('task_A');
  });

  it('tombstone TTL boundary: 181 days expired', () => {
    const raw = { task_B: daysAgoISO(181) };
    const normalized = normalizeDeletedTaskTombstones(raw);
    expect(normalized).not.toHaveProperty('task_B');
  });

  it('tombstone at exactly 180 days boundary is expired', () => {
    // 180 days = 180 * 24 * 60 * 60 * 1000 ms. At exactly 180 days + 1ms it should expire.
    const d = new Date();
    d.setDate(d.getDate() - 180);
    d.setHours(d.getHours() - 1); // slightly past 180 days
    const raw = { task_X: d.toISOString() };
    const normalized = normalizeDeletedTaskTombstones(raw);
    expect(normalized).not.toHaveProperty('task_X');
  });

  it('tombstones union: local {A} + cloud {B} merged via object spread', () => {
    const localTombstones = normalizeDeletedTaskTombstones({ A: new Date().toISOString() });
    const cloudTombstones = normalizeDeletedTaskTombstones({ B: new Date().toISOString() });
    const merged = { ...localTombstones, ...cloudTombstones };
    expect(merged).toHaveProperty('A');
    expect(merged).toHaveProperty('B');
  });

  it('newer tombstone timestamp replaces older for same ID', () => {
    const olderTs = '2026-01-01T00:00:00Z';
    const newerTs = '2026-02-01T00:00:00Z';
    const local = normalizeDeletedTaskTombstones({ task_1: olderTs });
    const cloud = normalizeDeletedTaskTombstones({ task_1: newerTs });
    // Cloud overwrites local in spread
    const merged = { ...local, ...cloud };
    expect(new Date(merged.task_1).getTime()).toBe(new Date(newerTs).getTime());
  });

  it('delete task: add tombstone, mergeEntityCollection with isDeletedFn removes task', () => {
    const tombstones = { task_1: new Date().toISOString() };
    const isDeletedFn = (id) => !!tombstones[id];
    const localTasks = [makeTask({ id: 'task_1' }), makeTask({ id: 'task_2' })];
    const cloudTasks = [];
    const merged = mergeEntityCollection(localTasks, cloudTasks, ['updatedAt'], isDeletedFn);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('task_2');
  });

  it('isDeletedFn also removes cloud tasks that are tombstoned', () => {
    const tombstones = { task_cloud_1: new Date().toISOString() };
    const isDeletedFn = (id) => !!tombstones[id];
    const localTasks = [makeTask({ id: 'task_local_1' })];
    const cloudTasks = [makeTask({ id: 'task_cloud_1' })];
    const merged = mergeEntityCollection(localTasks, cloudTasks, ['updatedAt'], isDeletedFn);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('task_local_1');
  });

  it('normalizeDeletedEntityTombstones handles nested collections', () => {
    const raw = {
      taskCategories: { cat_1: new Date().toISOString() },
      taskLabels: { label_1: daysAgoISO(200) }, // expired
    };
    const normalized = normalizeDeletedEntityTombstones(raw);
    expect(normalized.taskCategories).toHaveProperty('cat_1');
    expect(normalized.taskLabels).not.toHaveProperty('label_1');
  });

  it('normalizeDeletedEntityTombstones skips invalid nested values', () => {
    const raw = {
      taskCategories: 'not-an-object',
      taskLabels: null,
    };
    const normalized = normalizeDeletedEntityTombstones(raw);
    expect(normalized).toEqual({});
  });
});

// ============================================================================
// Conflict resolution scenarios using real merge functions
// ============================================================================

describe('Conflict resolution scenarios', () => {
  it('same entity, cloud updatedAt newer — cloud wins', () => {
    const local = [makeEntity('e1', { name: 'Local', updatedAt: '2026-01-01T00:00:00Z' })];
    const cloud = [makeEntity('e1', { name: 'Cloud', updatedAt: '2026-02-01T00:00:00Z' })];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Cloud');
  });

  it('same entity, local updatedAt newer — local wins', () => {
    const local = [makeEntity('e1', { name: 'Local', updatedAt: '2026-02-01T00:00:00Z' })];
    const cloud = [makeEntity('e1', { name: 'Cloud', updatedAt: '2026-01-01T00:00:00Z' })];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Local');
  });

  it('same entity, equal updatedAt — local wins', () => {
    const ts = '2026-01-15T12:00:00Z';
    const local = [makeEntity('e1', { name: 'Local', updatedAt: ts })];
    const cloud = [makeEntity('e1', { name: 'Cloud', updatedAt: ts })];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Local');
  });

  it('no timestamp fields — local always wins on conflict', () => {
    const local = [makeEntity('e1', { name: 'Local' })];
    const cloud = [makeEntity('e1', { name: 'Cloud' })];
    const merged = mergeEntityCollection(local, cloud, []);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Local');
  });

  it('tracking data: local prayers filled, cloud glucose filled — both preserved after merge', () => {
    const local = {
      '2026-01-15': makeAllDataEntry({
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 2 },
        glucose: { avg: '', tir: '', insulin: '' },
      }),
    };
    const cloud = {
      '2026-01-15': makeAllDataEntry({
        prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
        glucose: { avg: '105', tir: '80', insulin: '35' },
      }),
    };
    const merged = mergeCloudAllData(local, cloud);
    // Local prayers remain (non-empty)
    expect(merged['2026-01-15'].prayers.fajr).toBe('1');
    // Cloud glucose fills local gaps
    expect(merged['2026-01-15'].glucose.avg).toBe('105');
    expect(merged['2026-01-15'].glucose.tir).toBe('80');
  });

  it('tracking data: local glucose.avg=105, cloud glucose.avg=110 — local kept', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '105', tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '', insulin: '' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('105');
  });

  it('tracking data: local glucose.avg empty, cloud glucose.avg=110 — cloud fills gap', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '', tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '', insulin: '' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('110');
  });

  it('tracking data: local glucose.avg=0, cloud=110 — local kept (0 is non-empty)', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: 0, tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '', insulin: '' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe(0);
  });

  it('tracking data: local glucose.avg=null, cloud=110 — cloud fills gap', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: null, tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '', insulin: '' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('110');
  });

  it('tracking data: local glucose.avg=false, cloud=110 — local kept (false is non-empty)', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: false, tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '', insulin: '' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe(false);
  });

  it('tracking data: local glucose.avg=undefined, cloud=110 — cloud fills gap', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: undefined, tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '', insulin: '' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('110');
  });
});

// ============================================================================
// Data integrity through serialization round-trips
// ============================================================================

describe('Data integrity through serialization round-trips', () => {
  it('JSON.stringify then JSON.parse preserves all entity fields', () => {
    const entity = makeEntity('e1', {
      name: 'Test Entity',
      color: '#FF0000',
      tags: ['a', 'b'],
      nested: { deep: true },
    });
    const roundTripped = JSON.parse(JSON.stringify(entity));
    expect(roundTripped).toEqual(entity);
  });

  it('task with all fields survives serialize-deserialize', () => {
    const task = makeTask({
      id: 'task_full',
      title: 'Complete task',
      notes: 'Some notes here',
      status: 'anytime',
      completed: false,
      today: true,
      flagged: true,
      areaId: 'area_work',
      categoryId: 'cat_dev',
      labelIds: ['label_1', 'label_2'],
      personIds: ['person_1'],
      dueDate: '2026-03-15',
      deferDate: '2026-03-01',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z',
      repeat: { type: 'daily', interval: 1 },
      subtasks: [{ id: 'sub1', title: 'Subtask', completed: false }],
    });
    const roundTripped = JSON.parse(JSON.stringify(task));
    expect(roundTripped).toEqual(task);
  });

  it('unicode in task titles survives: emoji', () => {
    const task = makeTask({ id: 'u1', title: 'Buy groceries \uD83D\uDED2\uD83C\uDF4E\uD83E\uDD66' });
    const rt = JSON.parse(JSON.stringify(task));
    expect(rt.title).toBe('Buy groceries \uD83D\uDED2\uD83C\uDF4E\uD83E\uDD66');
  });

  it('unicode in task titles survives: CJK characters', () => {
    const task = makeTask({ id: 'u2', title: '\u4ECA\u65E5\u306E\u30BF\u30B9\u30AF' });
    const rt = JSON.parse(JSON.stringify(task));
    expect(rt.title).toBe('\u4ECA\u65E5\u306E\u30BF\u30B9\u30AF');
  });

  it('unicode in task titles survives: Arabic', () => {
    const task = makeTask({ id: 'u3', title: '\u0645\u0647\u0645\u0629 \u062C\u062F\u064A\u062F\u0629' });
    const rt = JSON.parse(JSON.stringify(task));
    expect(rt.title).toBe('\u0645\u0647\u0645\u0629 \u062C\u062F\u064A\u062F\u0629');
  });

  it('unicode in task titles survives: accented characters', () => {
    const task = makeTask({ id: 'u4', title: 'R\u00E9sum\u00E9 avec caf\u00E9' });
    const rt = JSON.parse(JSON.stringify(task));
    expect(rt.title).toBe('R\u00E9sum\u00E9 avec caf\u00E9');
  });

  it('dates as ISO strings survive serialization', () => {
    const iso = '2026-02-13T15:30:00.000Z';
    const obj = { date: iso };
    const rt = JSON.parse(JSON.stringify(obj));
    expect(rt.date).toBe(iso);
    expect(new Date(rt.date).toISOString()).toBe(iso);
  });

  it('numeric precision: 0.1 + 0.2 stored as string survives', () => {
    const val = String(0.1 + 0.2); // "0.30000000000000004"
    const obj = { value: val };
    const rt = JSON.parse(JSON.stringify(obj));
    expect(rt.value).toBe(val);
  });
});

// ============================================================================
// Merge ordering
// ============================================================================

describe('Merge ordering', () => {
  it('local [A, B], cloud [B_newer, C] — [A, B_newer, C]', () => {
    const A = makeEntity('A', { name: 'A', updatedAt: '2026-01-01T00:00:00Z' });
    const B = makeEntity('B', { name: 'B', updatedAt: '2026-01-01T00:00:00Z' });
    const B_newer = makeEntity('B', { name: 'B_newer', updatedAt: '2026-02-01T00:00:00Z' });
    const C = makeEntity('C', { name: 'C', updatedAt: '2026-01-01T00:00:00Z' });
    const merged = mergeEntityCollection([A, B], [B_newer, C], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(3);
    const byId = Object.fromEntries(merged.map(e => [e.id, e]));
    expect(byId['A'].name).toBe('A');
    expect(byId['B'].name).toBe('B_newer');
    expect(byId['C'].name).toBe('C');
  });

  it('local [A], cloud [B, A_newer] — [A_newer, B]', () => {
    const A = makeEntity('A', { name: 'A_old', updatedAt: '2026-01-01T00:00:00Z' });
    const A_newer = makeEntity('A', { name: 'A_newer', updatedAt: '2026-02-01T00:00:00Z' });
    const B = makeEntity('B', { name: 'B', updatedAt: '2026-01-01T00:00:00Z' });
    const merged = mergeEntityCollection([A], [B, A_newer], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(2);
    const byId = Object.fromEntries(merged.map(e => [e.id, e]));
    expect(byId['A'].name).toBe('A_newer');
    expect(byId['B'].name).toBe('B');
  });

  it('empty local + cloud [A, B, C] — [A, B, C]', () => {
    const A = makeEntity('A', { updatedAt: '2026-01-01T00:00:00Z' });
    const B = makeEntity('B', { updatedAt: '2026-01-01T00:00:00Z' });
    const C = makeEntity('C', { updatedAt: '2026-01-01T00:00:00Z' });
    const merged = mergeEntityCollection([], [A, B, C], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(3);
  });

  it('local [A, B, C] + empty cloud — [A, B, C]', () => {
    const A = makeEntity('A', { updatedAt: '2026-01-01T00:00:00Z' });
    const B = makeEntity('B', { updatedAt: '2026-01-01T00:00:00Z' });
    const C = makeEntity('C', { updatedAt: '2026-01-01T00:00:00Z' });
    const merged = mergeEntityCollection([A, B, C], [], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(3);
  });

  it('both empty — empty result', () => {
    const merged = mergeEntityCollection([], [], ['updatedAt']);
    expect(merged).toHaveLength(0);
  });

  it('null/undefined inputs treated as empty arrays', () => {
    const A = makeEntity('A', { updatedAt: '2026-01-01T00:00:00Z' });
    const merged1 = mergeEntityCollection(null, [A], ['updatedAt']);
    expect(merged1).toHaveLength(1);
    const merged2 = mergeEntityCollection([A], undefined, ['updatedAt']);
    expect(merged2).toHaveLength(1);
  });
});

// ============================================================================
// Complex multi-step sync scenarios
// ============================================================================

describe('Complex multi-step sync scenarios', () => {
  it('step 1: create locally, step 2: different task on cloud, step 3: merge — both present', () => {
    const localTask = makeTask({ id: 'local_1', title: 'Local task', updatedAt: '2026-01-15T00:00:00Z' });
    const cloudTask = makeTask({ id: 'cloud_1', title: 'Cloud task', updatedAt: '2026-01-15T00:00:00Z' });
    const merged = mergeEntityCollection([localTask], [cloudTask], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(2);
    const ids = merged.map(t => t.id);
    expect(ids).toContain('local_1');
    expect(ids).toContain('cloud_1');
  });

  it('step 1: edit locally, step 2: same task edited on cloud (newer), step 3: merge — cloud wins', () => {
    const localTask = makeTask({ id: 'shared_1', title: 'Local edit', updatedAt: '2026-01-10T00:00:00Z' });
    const cloudTask = makeTask({ id: 'shared_1', title: 'Cloud edit', updatedAt: '2026-01-20T00:00:00Z' });
    const merged = mergeEntityCollection([localTask], [cloudTask], ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].title).toBe('Cloud edit');
  });

  it('step 1: delete locally (tombstone), step 2: task still in cloud, step 3: merge with isDeletedFn removes task', () => {
    const tombstones = { deleted_task: new Date().toISOString() };
    const isDeletedFn = (id) => !!tombstones[id];
    const localTasks = [];
    const cloudTasks = [makeTask({ id: 'deleted_task', title: 'Should be gone' })];
    const merged = mergeEntityCollection(localTasks, cloudTasks, ['updatedAt', 'createdAt'], isDeletedFn);
    expect(merged).toHaveLength(0);
  });

  it('step 1: local allData dates 1-5, step 2: cloud dates 3-7, step 3: merge — dates 1-7 present, overlap gap-filled', () => {
    const local = {};
    for (let d = 1; d <= 5; d++) {
      const date = `2026-01-0${d}`;
      local[date] = makeAllDataEntry({
        prayers: { fajr: '1', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
      });
    }
    const cloud = {};
    for (let d = 3; d <= 7; d++) {
      const date = `2026-01-0${d}`;
      cloud[date] = makeAllDataEntry({
        glucose: { avg: '100', tir: '85', insulin: '' },
      });
    }
    const merged = mergeCloudAllData(local, cloud);
    // All dates 1-7 should be present
    for (let d = 1; d <= 7; d++) {
      expect(merged).toHaveProperty(`2026-01-0${d}`);
    }
    // Overlapping dates (3-5): local prayers preserved, cloud glucose fills gaps
    expect(merged['2026-01-03'].prayers.fajr).toBe('1');
    expect(merged['2026-01-03'].glucose.avg).toBe('100');
    // Cloud-only dates (6-7): adopted entirely
    expect(merged['2026-01-06'].glucose.avg).toBe('100');
    expect(merged['2026-01-07'].glucose.tir).toBe('85');
  });

  it('multi-step: two sync cycles with evolving data', () => {
    // Cycle 1: local has task A, cloud has task B
    const taskA = makeTask({ id: 'A', title: 'Task A v1', updatedAt: '2026-01-01T00:00:00Z' });
    const taskB = makeTask({ id: 'B', title: 'Task B v1', updatedAt: '2026-01-01T00:00:00Z' });
    const afterCycle1 = mergeEntityCollection([taskA], [taskB], ['updatedAt', 'createdAt']);
    expect(afterCycle1).toHaveLength(2);

    // Cycle 2: local updates A, cloud updates B
    const taskA_v2 = makeTask({ id: 'A', title: 'Task A v2', updatedAt: '2026-02-01T00:00:00Z' });
    const taskB_v2 = makeTask({ id: 'B', title: 'Task B v2', updatedAt: '2026-02-01T00:00:00Z' });
    const afterCycle2 = mergeEntityCollection(
      [taskA_v2, afterCycle1.find(t => t.id === 'B')],
      [afterCycle1.find(t => t.id === 'A'), taskB_v2],
      ['updatedAt', 'createdAt']
    );
    expect(afterCycle2).toHaveLength(2);
    const byId = Object.fromEntries(afterCycle2.map(t => [t.id, t]));
    expect(byId['A'].title).toBe('Task A v2');
    expect(byId['B'].title).toBe('Task B v2');
  });
});

// ============================================================================
// Gap-fill merge edge cases for allData
// ============================================================================

describe('Gap-fill merge edge cases for allData', () => {
  it('prayers category gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ prayers: { fajr: '', dhuhr: '1', asr: '', maghrib: '', isha: '', quran: 0 } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ prayers: { fajr: '1', dhuhr: '', asr: '1', maghrib: '', isha: '', quran: 0 } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].prayers.fajr).toBe('1'); // gap-filled
    expect(merged['2026-01-15'].prayers.dhuhr).toBe('1'); // local kept
    expect(merged['2026-01-15'].prayers.asr).toBe('1'); // gap-filled
  });

  it('glucose category gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '', tir: '80', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '105', tir: '90', insulin: '30' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('105'); // gap-filled
    expect(merged['2026-01-15'].glucose.tir).toBe('80'); // local kept (non-empty)
    expect(merged['2026-01-15'].glucose.insulin).toBe('30'); // gap-filled
  });

  it('whoop category gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ whoop: { sleepPerf: '', recovery: '65', strain: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ whoop: { sleepPerf: '80', recovery: '70', strain: '12' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].whoop.sleepPerf).toBe('80'); // gap-filled
    expect(merged['2026-01-15'].whoop.recovery).toBe('65'); // local kept
    expect(merged['2026-01-15'].whoop.strain).toBe('12'); // gap-filled
  });

  it('libre category gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ libre: { currentGlucose: '', trend: 'up', readingsCount: 0, lastReading: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ libre: { currentGlucose: '105', trend: 'stable', readingsCount: 50, lastReading: '2026-01-15T10:00:00Z' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].libre.currentGlucose).toBe('105'); // gap-filled
    expect(merged['2026-01-15'].libre.trend).toBe('up'); // local kept (non-empty)
  });

  it('family category gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ family: { mom: false, dad: null, jana: false, tia: false, ahmed: false, eman: false } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ family: { mom: true, dad: true, jana: false, tia: false, ahmed: false, eman: false } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].family.mom).toBe(false); // local kept (false is non-empty)
    expect(merged['2026-01-15'].family.dad).toBe(true); // gap-filled (null is empty)
  });

  it('habits category gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ habits: { exercise: 0, reading: null, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ habits: { exercise: 3, reading: 2, meditation: 1, water: '2.5', vitamins: true, brushTeeth: 2, nop: 'y' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].habits.exercise).toBe(0); // local kept (0 is non-empty)
    expect(merged['2026-01-15'].habits.reading).toBe(2); // gap-filled (null is empty)
    expect(merged['2026-01-15'].habits.water).toBe('2.5'); // gap-filled ('' is empty)
    expect(merged['2026-01-15'].habits.vitamins).toBe(false); // local kept (false is non-empty)
  });

  it('non-standard category "custom" is NOT gap-filled (not in hardcoded list)', () => {
    const local = {
      '2026-01-15': {
        ...makeAllDataEntry(),
        custom: { field1: '' },
      },
    };
    const cloud = {
      '2026-01-15': {
        ...makeAllDataEntry(),
        custom: { field1: 'cloud-value' },
      },
    };
    const merged = mergeCloudAllData(local, cloud);
    // custom category should NOT be gap-filled since it is not in the hardcoded list
    expect(merged['2026-01-15'].custom.field1).toBe('');
  });

  it('date exists in cloud but not local — entire date adopted (all categories)', () => {
    const local = {};
    const cloud = {
      '2026-01-20': {
        ...makeAllDataEntry({ prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1', quran: 3 } }),
        custom: { specialField: 'hello' },
      },
    };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged).toHaveProperty('2026-01-20');
    expect(merged['2026-01-20'].prayers.fajr).toBe('1');
    // Non-standard categories are also adopted since the entire date is new
    expect(merged['2026-01-20'].custom.specialField).toBe('hello');
  });

  it('date exists in both, category in cloud but not local — category adopted', () => {
    const local = { '2026-01-15': makeAllDataEntry() };
    delete local['2026-01-15'].whoop; // remove whoop locally
    const cloud = { '2026-01-15': makeAllDataEntry({ whoop: { sleepPerf: '85', recovery: '70', strain: '10' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].whoop.sleepPerf).toBe('85');
    expect(merged['2026-01-15'].whoop.recovery).toBe('70');
  });

  it('date exists in both, category in both, field empty local — gap-filled from cloud', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '', tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '88', insulin: '35' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('110');
    expect(merged['2026-01-15'].glucose.tir).toBe('88');
    expect(merged['2026-01-15'].glucose.insulin).toBe('35');
  });

  it('all field value types tested as non-empty: 0, false, "0", " ", [], {}', () => {
    expect(isEmptyVal(0)).toBe(false);
    expect(isEmptyVal(false)).toBe(false);
    expect(isEmptyVal('0')).toBe(false);
    expect(isEmptyVal(' ')).toBe(false);
    expect(isEmptyVal([])).toBe(false);
    expect(isEmptyVal({})).toBe(false);
  });

  it('all empty field types tested: "", null, undefined', () => {
    expect(isEmptyVal('')).toBe(true);
    expect(isEmptyVal(null)).toBe(true);
    expect(isEmptyVal(undefined)).toBe(true);
  });

  it('cloud has extra fields in a known category — extra fields gap-filled', () => {
    const local = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '100', tir: '', insulin: '' } }) };
    const cloud = { '2026-01-15': makeAllDataEntry({ glucose: { avg: '110', tir: '90', insulin: '30', extraField: 'bonus' } }) };
    const merged = mergeCloudAllData(local, cloud);
    expect(merged['2026-01-15'].glucose.avg).toBe('100'); // local kept
    expect(merged['2026-01-15'].glucose.tir).toBe('90'); // gap-filled
    // extraField: local doesn't have it, so local[cat][field] is undefined (empty)
    expect(merged['2026-01-15'].glucose.extraField).toBe('bonus');
  });
});

// ============================================================================
// Validation + merge pipeline
// ============================================================================

describe('Validation + merge pipeline', () => {
  it('valid payload passes validation then merges successfully', () => {
    const payload = {
      data: { '2026-01-15': makeAllDataEntry({ prayers: { fajr: '1', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 } }) },
      tasks: [makeTask({ id: 't1' })],
      taskCategories: [makeEntity('cat_1')],
      taskLabels: [],
      taskPeople: [],
      customPerspectives: [],
      homeWidgets: [],
      triggers: [],
      lastUpdated: new Date().toISOString(),
    };
    const errors = validateCloudPayload(payload);
    expect(errors).toEqual([]);

    // Now merge
    const localAllData = {};
    const merged = mergeCloudAllData(localAllData, payload.data);
    expect(merged).toHaveProperty('2026-01-15');

    const mergedTasks = mergeEntityCollection([], payload.tasks, ['updatedAt', 'createdAt']);
    expect(mergedTasks).toHaveLength(1);
  });

  it('payload with non-array tasks — validation catches it before merge', () => {
    const payload = {
      tasks: 'not-an-array',
      data: {},
    };
    const errors = validateCloudPayload(payload);
    expect(errors).toContain('tasks must be an array');
  });

  it('payload with invalid lastUpdated — validation catches it', () => {
    const payload = {
      lastUpdated: 'not-a-valid-date-at-all',
    };
    const errors = validateCloudPayload(payload);
    expect(errors).toContain('lastUpdated is not a valid date');
  });

  it('payload with task missing id — validation catches it', () => {
    const payload = {
      tasks: [{ title: 'no id here' }],
    };
    const errors = validateCloudPayload(payload);
    expect(errors.some(e => e.includes('missing id'))).toBe(true);
  });

  it('payload with non-array taskCategories — validation catches it', () => {
    const errors = validateCloudPayload({ taskCategories: {} });
    expect(errors).toContain('taskCategories must be an array');
  });

  it('payload with non-array taskLabels — validation catches it', () => {
    const errors = validateCloudPayload({ taskLabels: 'bad' });
    expect(errors).toContain('taskLabels must be an array');
  });

  it('payload with non-object meetingNotesByEvent — validation catches it', () => {
    const errors = validateCloudPayload({ meetingNotesByEvent: 'string' });
    expect(errors).toContain('meetingNotesByEvent must be an object');
  });

  it('empty payload passes validation (all fields optional)', () => {
    const errors = validateCloudPayload({});
    expect(errors).toEqual([]);
  });

  it('valid lastUpdated ISO string passes', () => {
    const errors = validateCloudPayload({ lastUpdated: '2026-02-13T12:00:00.000Z' });
    expect(errors).toEqual([]);
  });

  it('validation checks tasks sample (first 5 only)', () => {
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      tasks.push(i < 5 ? { id: `t${i}`, title: `Task ${i}` } : { title: `No id ${i}` });
    }
    const errors = validateCloudPayload({ tasks });
    // Only first 5 are sampled, so no errors for items 5-9
    expect(errors).toEqual([]);
  });

  it('non-object data field triggers validation error', () => {
    const errors = validateCloudPayload({ data: 'string-data' });
    expect(errors).toContain('data must be an object');
  });
});

// ============================================================================
// Additional edge cases for normalizeDeletedTaskTombstones
// ============================================================================

describe('normalizeDeletedTaskTombstones edge cases', () => {
  it('returns empty object for null input', () => {
    expect(normalizeDeletedTaskTombstones(null)).toEqual({});
  });

  it('returns empty object for undefined input', () => {
    expect(normalizeDeletedTaskTombstones(undefined)).toEqual({});
  });

  it('returns empty object for non-object input', () => {
    expect(normalizeDeletedTaskTombstones('string')).toEqual({});
    expect(normalizeDeletedTaskTombstones(42)).toEqual({});
  });

  it('skips entries with empty id', () => {
    const raw = { '': new Date().toISOString() };
    const result = normalizeDeletedTaskTombstones(raw);
    expect(result).toEqual({});
  });

  it('skips entries with invalid timestamp', () => {
    const raw = { task_1: 'invalid-date' };
    const result = normalizeDeletedTaskTombstones(raw);
    expect(result).toEqual({});
  });

  it('converts numeric timestamps to ISO strings', () => {
    const now = Date.now();
    const raw = { task_1: now };
    const result = normalizeDeletedTaskTombstones(raw);
    expect(result.task_1).toBe(new Date(now).toISOString());
  });

  it('ensures all IDs are strings', () => {
    const raw = { 123: new Date().toISOString() };
    const result = normalizeDeletedTaskTombstones(raw);
    expect(result).toHaveProperty('123');
    expect(typeof Object.keys(result)[0]).toBe('string');
  });
});

// ============================================================================
// mergeEntityCollection additional edge cases
// ============================================================================

describe('mergeEntityCollection additional edge cases', () => {
  it('skips non-object items in local array', () => {
    const cloud = [makeEntity('c1', { updatedAt: '2026-01-01T00:00:00Z' })];
    const merged = mergeEntityCollection([null, 'string', 42], cloud, ['updatedAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('c1');
  });

  it('skips items without id in cloud array', () => {
    const local = [makeEntity('l1', { updatedAt: '2026-01-01T00:00:00Z' })];
    const cloud = [{ name: 'No ID entity' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('l1');
  });

  it('uses fallback timestamp field (createdAt) when updatedAt is missing', () => {
    const local = [{ id: 'e1', name: 'Local', createdAt: '2026-01-01T00:00:00Z' }];
    const cloud = [{ id: 'e1', name: 'Cloud', createdAt: '2026-02-01T00:00:00Z' }];
    const merged = mergeEntityCollection(local, cloud, ['updatedAt', 'createdAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe('Cloud'); // cloud createdAt is newer
  });

  it('items without id in local are silently skipped', () => {
    const local = [{ name: 'No id' }, makeEntity('e1')];
    const merged = mergeEntityCollection(local, [], ['updatedAt']);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('e1');
  });
});
