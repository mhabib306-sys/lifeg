// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks — must be declared before any module imports
// ---------------------------------------------------------------------------
const { mockState, saveTasksDataMock, startUndoCountdownMock } = vi.hoisted(() => {
  return {
    mockState: {
      tasksData: [],
      deletedTaskTombstones: {},
      deletedEntityTombstones: {},
      inlineEditingTaskId: null,
    },
    saveTasksDataMock: vi.fn(),
    startUndoCountdownMock: vi.fn(),
  };
});

vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/data/storage.js', () => ({ saveTasksData: saveTasksDataMock }));
vi.mock('../src/features/undo.js', () => ({ startUndoCountdown: startUndoCountdownMock }));
vi.mock('../src/features/areas.js', () => ({ getCategoryById: vi.fn(() => null) }));

import {
  createTask,
  updateTask,
  deleteTask,
  confirmDeleteTask,
  toggleTaskComplete,
  calculateNextRepeatDate,
  createNextRepeatOccurrence,
  getRepeatUnitLabel,
  migrateTodayFlag,
  moveTaskTo,
  recordTaskDeletionTombstone,
  clearTaskDeletionTombstone,
} from '../src/features/tasks.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function resetState() {
  mockState.tasksData = [];
  mockState.deletedTaskTombstones = {};
  mockState.deletedEntityTombstones = {};
  mockState.inlineEditingTaskId = null;
}

function makeTask(overrides = {}) {
  return {
    id: overrides.id || 'task_test_1',
    title: overrides.title || 'Test task',
    notes: '',
    status: 'anytime',
    today: false,
    flagged: false,
    completed: false,
    completedAt: null,
    areaId: null,
    categoryId: null,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: false,
    parentId: null,
    indent: 0,
    meetingEventKey: null,
    lastReviewedAt: null,
    order: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  resetState();
  vi.clearAllMocks();
  localStorage.clear();
  // Stub window functions used by tasks.js
  window.render = vi.fn();
  window.pushTaskToGCalIfConnected = vi.fn();
  window.deleteGCalEventIfConnected = vi.fn();
});

// ===========================================================================
// createTask
// ===========================================================================
describe('createTask', () => {
  it('creates a task with default values', () => {
    const task = createTask('Buy groceries');
    expect(task.title).toBe('Buy groceries');
    expect(task.status).toBe('inbox');
    expect(task.today).toBe(false);
    expect(task.flagged).toBe(false);
    expect(task.completed).toBe(false);
    expect(task.completedAt).toBeNull();
    expect(task.notes).toBe('');
    expect(task.areaId).toBeNull();
    expect(task.labels).toEqual([]);
    expect(task.people).toEqual([]);
    expect(task.deferDate).toBeNull();
    expect(task.dueDate).toBeNull();
    expect(task.repeat).toBeNull();
    expect(task.isNote).toBe(false);
    expect(task.parentId).toBeNull();
    expect(task.indent).toBe(0);
    expect(task.meetingEventKey).toBeNull();
    expect(task.id).toMatch(/^task_/);
    expect(task.createdAt).toBeTruthy();
    expect(task.updatedAt).toBeTruthy();
  });

  it('pushes the task into state.tasksData', () => {
    createTask('A');
    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].title).toBe('A');
  });

  it('calls saveTasksData after creation', () => {
    createTask('A');
    expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
  });

  it('promotes inbox to anytime when areaId is set', () => {
    const task = createTask('With area', { areaId: 'area_1' });
    expect(task.status).toBe('anytime');
  });

  it('promotes inbox to anytime when today flag is set', () => {
    const task = createTask('Today task', { today: true });
    expect(task.status).toBe('anytime');
    expect(task.today).toBe(true);
  });

  it('normalizes status="today" to anytime with today flag', () => {
    const task = createTask('Today via status', { status: 'today' });
    expect(task.status).toBe('anytime');
    expect(task.today).toBe(true);
  });

  it('does NOT promote notes from inbox even with areaId', () => {
    const task = createTask('Note', { isNote: true, areaId: 'area_1' });
    // Notes skip the promotion logic
    expect(task.status).toBe('inbox');
    expect(task.isNote).toBe(true);
  });

  it('does NOT promote notes from inbox even with today flag', () => {
    const task = createTask('Note today', { isNote: true, today: true });
    expect(task.status).toBe('inbox');
  });

  it('respects explicit anytime status', () => {
    const task = createTask('Anytime', { status: 'anytime' });
    expect(task.status).toBe('anytime');
  });

  it('respects explicit someday status', () => {
    const task = createTask('Someday', { status: 'someday' });
    expect(task.status).toBe('someday');
  });

  it('preserves all optional fields', () => {
    const task = createTask('Full', {
      notes: 'Some notes',
      areaId: 'area_1',
      categoryId: 'cat_1',
      labels: ['label_1', 'label_2'],
      people: ['person_1'],
      deferDate: '2026-03-01',
      dueDate: '2026-03-15',
      repeat: { type: 'daily', interval: 1, from: 'completion' },
      flagged: true,
      parentId: 'task_parent',
      indent: 2,
      meetingEventKey: 'cal::evt',
    });
    expect(task.notes).toBe('Some notes');
    expect(task.areaId).toBe('area_1');
    expect(task.categoryId).toBe('cat_1');
    expect(task.labels).toEqual(['label_1', 'label_2']);
    expect(task.people).toEqual(['person_1']);
    expect(task.deferDate).toBe('2026-03-01');
    expect(task.dueDate).toBe('2026-03-15');
    expect(task.repeat).toEqual({ type: 'daily', interval: 1, from: 'completion' });
    expect(task.flagged).toBe(true);
    expect(task.parentId).toBe('task_parent');
    expect(task.indent).toBe(2);
    expect(task.meetingEventKey).toBe('cal::evt');
  });

  it('calculates order based on incomplete task count', () => {
    // No tasks yet → order = (0 + 1) * 1000 = 1000
    const t1 = createTask('First');
    expect(t1.order).toBe(1000);
    // One incomplete task → order = (1 + 1) * 1000 = 2000
    const t2 = createTask('Second');
    expect(t2.order).toBe(2000);
  });

  it('order calculation excludes completed tasks', () => {
    mockState.tasksData = [makeTask({ completed: true })];
    // 0 incomplete + 1 = 1000
    const task = createTask('New');
    expect(task.order).toBe(1000);
  });

  it('clears any pre-existing deletion tombstone for the new task ID', () => {
    // createTask generates a unique ID, but the clearTaskDeletedMarker logic
    // ensures tombstones don't linger. We verify localStorage is written.
    const task = createTask('Cleared');
    // Should not have a tombstone for this task
    expect(mockState.deletedTaskTombstones[task.id]).toBeUndefined();
  });

  it('calls pushTaskToGCalIfConnected for dated non-note tasks', () => {
    createTask('Dated', { dueDate: '2026-03-01' });
    expect(window.pushTaskToGCalIfConnected).toHaveBeenCalled();
  });

  it('does NOT push to GCal for tasks without dates', () => {
    createTask('No date');
    expect(window.pushTaskToGCalIfConnected).not.toHaveBeenCalled();
  });

  it('does NOT push to GCal for notes even with dates', () => {
    createTask('Note', { isNote: true, dueDate: '2026-03-01' });
    expect(window.pushTaskToGCalIfConnected).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// updateTask
// ===========================================================================
describe('updateTask', () => {
  it('updates a task by ID', () => {
    const task = makeTask({ id: 'task_u1', title: 'Original' });
    mockState.tasksData = [task];

    updateTask('task_u1', { title: 'Updated' });
    expect(mockState.tasksData[0].title).toBe('Updated');
  });

  it('does nothing when task is not found', () => {
    mockState.tasksData = [];
    updateTask('nonexistent', { title: 'X' });
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });

  it('normalizes status="today" to anytime + today flag', () => {
    const task = makeTask({ id: 'task_u2', status: 'anytime', today: false });
    mockState.tasksData = [task];

    updateTask('task_u2', { status: 'today' });
    expect(mockState.tasksData[0].status).toBe('anytime');
    expect(mockState.tasksData[0].today).toBe(true);
  });

  it('promotes inbox to anytime when areaId is first assigned', () => {
    const task = makeTask({ id: 'task_u3', status: 'inbox', areaId: null });
    mockState.tasksData = [task];

    updateTask('task_u3', { areaId: 'area_1' });
    expect(mockState.tasksData[0].status).toBe('anytime');
    expect(mockState.tasksData[0].areaId).toBe('area_1');
  });

  it('does NOT re-promote if task already has an area', () => {
    const task = makeTask({ id: 'task_u4', status: 'inbox', areaId: 'area_old' });
    mockState.tasksData = [task];

    updateTask('task_u4', { areaId: 'area_new' });
    // No promotion because task already had an areaId
    expect(mockState.tasksData[0].status).toBe('inbox');
  });

  it('promotes inbox to anytime when today=true and status stays inbox', () => {
    const task = makeTask({ id: 'task_u5', status: 'inbox', today: false, isNote: false });
    mockState.tasksData = [task];

    updateTask('task_u5', { today: true });
    expect(mockState.tasksData[0].status).toBe('anytime');
    expect(mockState.tasksData[0].today).toBe(true);
  });

  it('does NOT promote notes from inbox even with today flag', () => {
    const task = makeTask({ id: 'task_u6', status: 'inbox', isNote: true, today: false });
    mockState.tasksData = [task];

    updateTask('task_u6', { today: true });
    expect(mockState.tasksData[0].status).toBe('inbox');
  });

  it('sets updatedAt timestamp on update', () => {
    const oldDate = '2020-01-01T00:00:00.000Z';
    const task = makeTask({ id: 'task_u7', updatedAt: oldDate });
    mockState.tasksData = [task];

    updateTask('task_u7', { title: 'Changed' });
    expect(mockState.tasksData[0].updatedAt).not.toBe(oldDate);
  });

  it('calls saveTasksData on successful update', () => {
    const task = makeTask({ id: 'task_u8' });
    mockState.tasksData = [task];

    updateTask('task_u8', { flagged: true });
    expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
  });

  it('handles numeric and string taskId via taskIdEquals coercion', () => {
    const task = makeTask({ id: '123' });
    mockState.tasksData = [task];

    updateTask(123, { title: 'Coerced' });
    expect(mockState.tasksData[0].title).toBe('Coerced');
  });

  it('calls pushTaskToGCalIfConnected when adding dates', () => {
    const task = makeTask({ id: 'task_gcal' });
    mockState.tasksData = [task];

    updateTask('task_gcal', { dueDate: '2026-04-01' });
    expect(window.pushTaskToGCalIfConnected).toHaveBeenCalled();
  });

  it('calls deleteGCalEventIfConnected when removing dates with existing gcalEventId', () => {
    const task = makeTask({ id: 'task_gcaldel', dueDate: '2026-04-01', gcalEventId: 'gcal_123' });
    mockState.tasksData = [task];

    updateTask('task_gcaldel', { dueDate: null, deferDate: null });
    expect(window.deleteGCalEventIfConnected).toHaveBeenCalled();
  });
});

// ===========================================================================
// deleteTask
// ===========================================================================
describe('deleteTask', () => {
  it('removes the task from state.tasksData', () => {
    mockState.tasksData = [makeTask({ id: 'task_d1' })];
    deleteTask('task_d1');
    expect(mockState.tasksData).toHaveLength(0);
  });

  it('promotes child tasks to root level', () => {
    const parent = makeTask({ id: 'task_parent' });
    const child = makeTask({ id: 'task_child', parentId: 'task_parent', indent: 2 });
    mockState.tasksData = [parent, child];

    deleteTask('task_parent');
    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].parentId).toBeNull();
    expect(mockState.tasksData[0].indent).toBe(0);
  });

  it('records a deletion tombstone', () => {
    mockState.tasksData = [makeTask({ id: 'task_d2' })];
    deleteTask('task_d2');
    expect(mockState.deletedTaskTombstones['task_d2']).toBeTruthy();
  });

  it('calls saveTasksData after deletion', () => {
    mockState.tasksData = [makeTask({ id: 'task_d3' })];
    deleteTask('task_d3');
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('clears inlineEditingTaskId if deleting the edited task', () => {
    mockState.tasksData = [makeTask({ id: 'task_d4' })];
    mockState.inlineEditingTaskId = 'task_d4';

    deleteTask('task_d4');
    expect(mockState.inlineEditingTaskId).toBeNull();
  });

  it('does NOT clear inlineEditingTaskId if deleting a different task', () => {
    mockState.tasksData = [makeTask({ id: 'task_d5' }), makeTask({ id: 'task_other' })];
    mockState.inlineEditingTaskId = 'task_other';

    deleteTask('task_d5');
    expect(mockState.inlineEditingTaskId).toBe('task_other');
  });

  it('handles deleting a task that does not exist gracefully', () => {
    mockState.tasksData = [makeTask({ id: 'task_exists' })];
    deleteTask('nonexistent');
    // Should still have the original task
    expect(mockState.tasksData).toHaveLength(1);
    // saveTasksData should still be called (the filter just returns the same array)
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('calls deleteGCalEventIfConnected for tasks with gcalEventId', () => {
    mockState.tasksData = [makeTask({ id: 'task_gcal_d', gcalEventId: 'gcal_456' })];
    deleteTask('task_gcal_d');
    expect(window.deleteGCalEventIfConnected).toHaveBeenCalled();
  });

  it('does not call deleteGCalEventIfConnected for tasks without gcalEventId', () => {
    mockState.tasksData = [makeTask({ id: 'task_nogcal' })];
    deleteTask('task_nogcal');
    expect(window.deleteGCalEventIfConnected).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// confirmDeleteTask
// ===========================================================================
describe('confirmDeleteTask', () => {
  it('deletes the task and triggers undo countdown', () => {
    const task = makeTask({ id: 'task_cd1', title: 'Confirm me' });
    mockState.tasksData = [task];

    confirmDeleteTask('task_cd1');
    expect(mockState.tasksData).toHaveLength(0);
    expect(startUndoCountdownMock).toHaveBeenCalledTimes(1);
  });

  it('passes the snapshot title in the undo label', () => {
    const task = makeTask({ id: 'task_cd2', title: 'My task' });
    mockState.tasksData = [task];

    confirmDeleteTask('task_cd2');
    const label = startUndoCountdownMock.mock.calls[0][0];
    expect(label).toContain('My task');
    expect(label).toContain('deleted');
  });

  it('snapshot includes the task and children', () => {
    const parent = makeTask({ id: 'task_cdp', title: 'Parent' });
    const child = makeTask({ id: 'task_cdc', parentId: 'task_cdp', indent: 1 });
    mockState.tasksData = [parent, child];

    confirmDeleteTask('task_cdp');
    const snapshot = startUndoCountdownMock.mock.calls[0][1];
    expect(snapshot.task.id).toBe('task_cdp');
    expect(snapshot.children).toHaveLength(1);
    expect(snapshot.children[0].id).toBe('task_cdc');
  });

  it('does nothing when task is not found', () => {
    mockState.tasksData = [];
    confirmDeleteTask('nonexistent');
    expect(startUndoCountdownMock).not.toHaveBeenCalled();
  });

  it('clears inlineEditingTaskId regardless of which task is being deleted', () => {
    mockState.inlineEditingTaskId = 'task_something';
    mockState.tasksData = [makeTask({ id: 'task_cd3' })];

    confirmDeleteTask('task_cd3');
    expect(mockState.inlineEditingTaskId).toBeNull();
  });

  it('undo restore function adds the task back', () => {
    const task = makeTask({ id: 'task_cdundo', title: 'Undone' });
    mockState.tasksData = [task];

    confirmDeleteTask('task_cdundo');
    expect(mockState.tasksData).toHaveLength(0);

    // Extract and invoke the restore callback
    const restoreFn = startUndoCountdownMock.mock.calls[0][2];
    const snapshot = startUndoCountdownMock.mock.calls[0][1];
    restoreFn(snapshot);
    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].id).toBe('task_cdundo');
  });
});

// ===========================================================================
// toggleTaskComplete
// ===========================================================================
describe('toggleTaskComplete', () => {
  it('marks an active task as completed', () => {
    mockState.tasksData = [makeTask({ id: 'task_tc1', completed: false })];
    toggleTaskComplete('task_tc1');

    expect(mockState.tasksData[0].completed).toBe(true);
    expect(mockState.tasksData[0].completedAt).toBeTruthy();
  });

  it('marks a completed task as active', () => {
    mockState.tasksData = [makeTask({ id: 'task_tc2', completed: true, completedAt: new Date().toISOString() })];
    toggleTaskComplete('task_tc2');

    expect(mockState.tasksData[0].completed).toBe(false);
    expect(mockState.tasksData[0].completedAt).toBeNull();
  });

  it('updates the updatedAt timestamp', () => {
    const oldDate = '2020-01-01T00:00:00.000Z';
    mockState.tasksData = [makeTask({ id: 'task_tc3', updatedAt: oldDate })];
    toggleTaskComplete('task_tc3');
    expect(mockState.tasksData[0].updatedAt).not.toBe(oldDate);
  });

  it('calls saveTasksData and render', () => {
    mockState.tasksData = [makeTask({ id: 'task_tc4' })];
    toggleTaskComplete('task_tc4');
    expect(saveTasksDataMock).toHaveBeenCalled();
    expect(window.render).toHaveBeenCalled();
  });

  it('creates next repeat occurrence when completing a repeating task', () => {
    mockState.tasksData = [makeTask({
      id: 'task_rep1',
      repeat: { type: 'daily', interval: 1, from: 'completion' },
      dueDate: '2026-02-12',
    })];

    toggleTaskComplete('task_rep1');
    // The original task is completed
    expect(mockState.tasksData[0].completed).toBe(true);
    // A new task should have been spawned by createNextRepeatOccurrence
    expect(mockState.tasksData.length).toBeGreaterThanOrEqual(2);
    const spawned = mockState.tasksData.find(t => t.id !== 'task_rep1');
    expect(spawned).toBeTruthy();
    expect(spawned.completed).toBe(false);
  });

  it('stores _spawnedRepeatId on the original task', () => {
    mockState.tasksData = [makeTask({
      id: 'task_rep2',
      repeat: { type: 'weekly', interval: 1, from: 'due' },
      dueDate: '2026-02-12',
    })];

    toggleTaskComplete('task_rep2');
    expect(mockState.tasksData[0]._spawnedRepeatId).toBeTruthy();
  });

  it('removes spawned repeat occurrence when un-completing', () => {
    // First complete
    mockState.tasksData = [makeTask({
      id: 'task_rep3',
      repeat: { type: 'daily', interval: 1, from: 'completion' },
      dueDate: '2026-02-12',
    })];
    toggleTaskComplete('task_rep3');
    const spawnedId = mockState.tasksData[0]._spawnedRepeatId;
    expect(mockState.tasksData.find(t => t.id === spawnedId)).toBeTruthy();

    // Now un-complete
    toggleTaskComplete('task_rep3');
    expect(mockState.tasksData.find(t => t.id === spawnedId)).toBeFalsy();
    expect(mockState.tasksData[0]._spawnedRepeatId).toBeNull();
  });

  it('does not create repeat occurrence for repeat type "none"', () => {
    mockState.tasksData = [makeTask({
      id: 'task_repnone',
      repeat: { type: 'none', interval: 1, from: 'completion' },
    })];

    toggleTaskComplete('task_repnone');
    expect(mockState.tasksData).toHaveLength(1);
  });

  it('handles task not found with warning', () => {
    mockState.tasksData = [];
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    toggleTaskComplete('nonexistent');
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not create repeat for tasks without repeat config', () => {
    mockState.tasksData = [makeTask({ id: 'task_norep', repeat: null })];
    toggleTaskComplete('task_norep');
    expect(mockState.tasksData).toHaveLength(1);
  });
});

// ===========================================================================
// calculateNextRepeatDate
// ===========================================================================
describe('calculateNextRepeatDate', () => {
  it('calculates daily repeat (1 day)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'daily', interval: 1 });
    expect(result).toBe('2026-02-13');
  });

  it('calculates daily repeat (3 days)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'daily', interval: 3 });
    expect(result).toBe('2026-02-15');
  });

  it('calculates weekly repeat (1 week)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'weekly', interval: 1 });
    expect(result).toBe('2026-02-19');
  });

  it('calculates weekly repeat (2 weeks)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'weekly', interval: 2 });
    expect(result).toBe('2026-02-26');
  });

  it('calculates monthly repeat (1 month)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'monthly', interval: 1 });
    expect(result).toBe('2026-03-12');
  });

  it('calculates monthly repeat (3 months)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'monthly', interval: 3 });
    expect(result).toBe('2026-05-12');
  });

  it('calculates yearly repeat (1 year)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'yearly', interval: 1 });
    expect(result).toBe('2027-02-12');
  });

  it('calculates yearly repeat (2 years)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'yearly', interval: 2 });
    expect(result).toBe('2028-02-12');
  });

  it('defaults interval to 1 when not specified', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'daily' });
    expect(result).toBe('2026-02-13');
  });

  it('handles month boundary (Jan 31 + 1 month)', () => {
    const result = calculateNextRepeatDate('2026-01-31', { type: 'monthly', interval: 1 });
    // JS Date rolls Jan 31 + 1 month to Mar 3 (Feb has 28 days in 2026)
    expect(result).toBe('2026-03-03');
  });

  it('handles year boundary (Dec 31 + 1 day)', () => {
    const result = calculateNextRepeatDate('2026-12-31', { type: 'daily', interval: 1 });
    expect(result).toBe('2027-01-01');
  });

  it('handles year boundary (Dec 31 + 1 month)', () => {
    const result = calculateNextRepeatDate('2026-12-15', { type: 'monthly', interval: 1 });
    expect(result).toBe('2027-01-15');
  });

  it('handles leap year (Feb 28 2028 + 1 day)', () => {
    const result = calculateNextRepeatDate('2028-02-28', { type: 'daily', interval: 1 });
    expect(result).toBe('2028-02-29');
  });

  it('returns a valid YYYY-MM-DD string', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'daily', interval: 1 });
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('handles unknown repeat type (no date shift)', () => {
    const result = calculateNextRepeatDate('2026-02-12', { type: 'unknown', interval: 1 });
    // No case matches, date unchanged
    expect(result).toBe('2026-02-12');
  });
});

// ===========================================================================
// createNextRepeatOccurrence
// ===========================================================================
describe('createNextRepeatOccurrence', () => {
  it('creates a new incomplete task from a completed repeating task', () => {
    const completed = makeTask({
      id: 'task_rpt1',
      title: 'Weekly review',
      status: 'anytime',
      completed: true,
      repeat: { type: 'weekly', interval: 1, from: 'completion' },
      dueDate: '2026-02-12',
    });

    const newTask = createNextRepeatOccurrence(completed);
    expect(newTask).toBeTruthy();
    expect(newTask.title).toBe('Weekly review');
    expect(newTask.completed).toBe(false);
    expect(newTask.repeat).toEqual({ type: 'weekly', interval: 1, from: 'completion' });
  });

  it('calculates new due date from completion date when from="completion"', () => {
    const completed = makeTask({
      title: 'Daily',
      repeat: { type: 'daily', interval: 1, from: 'completion' },
      dueDate: '2026-01-01', // old due date
    });

    const newTask = createNextRepeatOccurrence(completed);
    // Should calculate from today, not from the old dueDate
    expect(newTask.dueDate).toBeTruthy();
    expect(newTask.dueDate).not.toBe('2026-01-01');
  });

  it('calculates new due date from original due date when from="due"', () => {
    const completed = makeTask({
      title: 'Monthly due',
      repeat: { type: 'monthly', interval: 1, from: 'due' },
      dueDate: '2026-02-15',
    });

    const newTask = createNextRepeatOccurrence(completed);
    expect(newTask.dueDate).toBe('2026-03-15');
  });

  it('preserves today, flagged, labels, people, and area', () => {
    const completed = makeTask({
      title: 'Full repeat',
      status: 'anytime',
      today: true,
      flagged: true,
      areaId: 'area_1',
      categoryId: 'cat_1',
      labels: ['label_1'],
      people: ['person_1'],
      repeat: { type: 'daily', interval: 1, from: 'completion' },
    });

    const newTask = createNextRepeatOccurrence(completed);
    expect(newTask.today).toBe(true);
    expect(newTask.flagged).toBe(true);
    expect(newTask.areaId).toBe('area_1');
    expect(newTask.categoryId).toBe('cat_1');
    expect(newTask.labels).toEqual(['label_1']);
    expect(newTask.people).toEqual(['person_1']);
  });

  it('carries forward defer date with repeat calculation', () => {
    const completed = makeTask({
      title: 'Deferred repeat',
      repeat: { type: 'weekly', interval: 1, from: 'due' },
      deferDate: '2026-02-10',
      dueDate: '2026-02-12',
    });

    const newTask = createNextRepeatOccurrence(completed);
    expect(newTask.deferDate).toBeTruthy();
    expect(newTask.dueDate).toBe('2026-02-19');
    // Defer date should also be pushed forward
    expect(newTask.deferDate).toBe('2026-02-17');
  });

  it('creates task without deferDate if original had none', () => {
    const completed = makeTask({
      title: 'No defer',
      repeat: { type: 'daily', interval: 1, from: 'completion' },
      deferDate: null,
      dueDate: '2026-02-12',
    });

    const newTask = createNextRepeatOccurrence(completed);
    expect(newTask.deferDate).toBeNull();
  });

  it('creates task without dueDate if original had none', () => {
    const completed = makeTask({
      title: 'No due',
      repeat: { type: 'daily', interval: 1, from: 'completion' },
      dueDate: null,
    });

    const newTask = createNextRepeatOccurrence(completed);
    expect(newTask.dueDate).toBeNull();
  });
});

// ===========================================================================
// getRepeatUnitLabel
// ===========================================================================
describe('getRepeatUnitLabel', () => {
  it('returns "day(s)" for daily', () => {
    expect(getRepeatUnitLabel('daily')).toBe('day(s)');
  });

  it('returns "week(s)" for weekly', () => {
    expect(getRepeatUnitLabel('weekly')).toBe('week(s)');
  });

  it('returns "month(s)" for monthly', () => {
    expect(getRepeatUnitLabel('monthly')).toBe('month(s)');
  });

  it('returns "year(s)" for yearly', () => {
    expect(getRepeatUnitLabel('yearly')).toBe('year(s)');
  });

  it('returns "day(s)" for unknown type', () => {
    expect(getRepeatUnitLabel('biweekly')).toBe('day(s)');
  });

  it('returns "day(s)" for undefined', () => {
    expect(getRepeatUnitLabel(undefined)).toBe('day(s)');
  });

  it('returns "day(s)" for null', () => {
    expect(getRepeatUnitLabel(null)).toBe('day(s)');
  });
});

// ===========================================================================
// migrateTodayFlag
// ===========================================================================
describe('migrateTodayFlag', () => {
  it('migrates status="today" to anytime + today=true', () => {
    mockState.tasksData = [makeTask({ id: 'task_m1', status: 'today', today: false })];
    migrateTodayFlag();
    expect(mockState.tasksData[0].status).toBe('anytime');
    expect(mockState.tasksData[0].today).toBe(true);
  });

  it('fixes missing today boolean (undefined → false)', () => {
    const task = makeTask({ id: 'task_m2', status: 'anytime' });
    delete task.today;
    mockState.tasksData = [task];

    migrateTodayFlag();
    expect(mockState.tasksData[0].today).toBe(false);
  });

  it('fixes missing flagged boolean (undefined → false)', () => {
    const task = makeTask({ id: 'task_m3', status: 'anytime' });
    delete task.flagged;
    mockState.tasksData = [task];

    migrateTodayFlag();
    expect(mockState.tasksData[0].flagged).toBe(false);
  });

  it('calls saveTasksData when changes are made', () => {
    mockState.tasksData = [makeTask({ id: 'task_m4', status: 'today' })];
    migrateTodayFlag();
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('does NOT call saveTasksData when no changes are needed', () => {
    mockState.tasksData = [makeTask({ id: 'task_m5', status: 'anytime', today: false, flagged: false })];
    migrateTodayFlag();
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });

  it('handles empty tasksData', () => {
    mockState.tasksData = [];
    migrateTodayFlag();
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });

  it('migrates multiple tasks in a single pass', () => {
    mockState.tasksData = [
      makeTask({ id: 'task_m6a', status: 'today' }),
      makeTask({ id: 'task_m6b', status: 'today' }),
      makeTask({ id: 'task_m6c', status: 'anytime', today: true, flagged: true }),
    ];
    migrateTodayFlag();
    expect(mockState.tasksData[0].status).toBe('anytime');
    expect(mockState.tasksData[0].today).toBe(true);
    expect(mockState.tasksData[1].status).toBe('anytime');
    expect(mockState.tasksData[1].today).toBe(true);
    // Third task was already correct
    expect(mockState.tasksData[2].status).toBe('anytime');
    expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
  });
});

// ===========================================================================
// moveTaskTo
// ===========================================================================
describe('moveTaskTo', () => {
  it('updates the task status via updateTask', () => {
    mockState.tasksData = [makeTask({ id: 'task_mt1', status: 'inbox' })];
    moveTaskTo('task_mt1', 'someday');
    expect(mockState.tasksData[0].status).toBe('someday');
  });

  it('calls render after moving', () => {
    mockState.tasksData = [makeTask({ id: 'task_mt2' })];
    moveTaskTo('task_mt2', 'anytime');
    expect(window.render).toHaveBeenCalled();
  });

  it('handles status="today" normalization through updateTask', () => {
    mockState.tasksData = [makeTask({ id: 'task_mt3', status: 'anytime' })];
    moveTaskTo('task_mt3', 'today');
    expect(mockState.tasksData[0].status).toBe('anytime');
    expect(mockState.tasksData[0].today).toBe(true);
  });
});

// ===========================================================================
// recordTaskDeletionTombstone / clearTaskDeletionTombstone
// ===========================================================================
describe('recordTaskDeletionTombstone', () => {
  it('records a tombstone for the given taskId', () => {
    recordTaskDeletionTombstone('task_tomb1');
    expect(mockState.deletedTaskTombstones['task_tomb1']).toBeTruthy();
  });

  it('stores an ISO date string as the tombstone value', () => {
    recordTaskDeletionTombstone('task_tomb2');
    const ts = mockState.deletedTaskTombstones['task_tomb2'];
    expect(() => new Date(ts)).not.toThrow();
    expect(new Date(ts).toISOString()).toBe(ts);
  });

  it('persists to localStorage', () => {
    recordTaskDeletionTombstone('task_tomb3');
    const stored = JSON.parse(localStorage.getItem('lifeGamificationDeletedTaskTombstones'));
    expect(stored['task_tomb3']).toBeTruthy();
  });

  it('does nothing for null taskId', () => {
    recordTaskDeletionTombstone(null);
    expect(Object.keys(mockState.deletedTaskTombstones)).toHaveLength(0);
  });

  it('does nothing for undefined taskId', () => {
    recordTaskDeletionTombstone(undefined);
    expect(Object.keys(mockState.deletedTaskTombstones)).toHaveLength(0);
  });

  it('initializes tombstones object if corrupted', () => {
    mockState.deletedTaskTombstones = null;
    recordTaskDeletionTombstone('task_tomb_init');
    expect(mockState.deletedTaskTombstones['task_tomb_init']).toBeTruthy();
  });
});

describe('clearTaskDeletionTombstone', () => {
  it('removes a previously recorded tombstone', () => {
    mockState.deletedTaskTombstones = { task_clear1: new Date().toISOString() };
    clearTaskDeletionTombstone('task_clear1');
    expect(mockState.deletedTaskTombstones['task_clear1']).toBeUndefined();
  });

  it('persists the removal to localStorage', () => {
    mockState.deletedTaskTombstones = { task_clear2: new Date().toISOString() };
    localStorage.setItem('lifeGamificationDeletedTaskTombstones', JSON.stringify(mockState.deletedTaskTombstones));

    clearTaskDeletionTombstone('task_clear2');
    const stored = JSON.parse(localStorage.getItem('lifeGamificationDeletedTaskTombstones'));
    expect(stored['task_clear2']).toBeUndefined();
  });

  it('does nothing for null taskId', () => {
    mockState.deletedTaskTombstones = { task_keep: new Date().toISOString() };
    clearTaskDeletionTombstone(null);
    expect(mockState.deletedTaskTombstones['task_keep']).toBeTruthy();
  });

  it('does nothing for a taskId that has no tombstone', () => {
    mockState.deletedTaskTombstones = { other: new Date().toISOString() };
    clearTaskDeletionTombstone('nonexistent');
    expect(mockState.deletedTaskTombstones['other']).toBeTruthy();
  });

  it('handles corrupted tombstones state gracefully', () => {
    mockState.deletedTaskTombstones = null;
    // Should not throw
    expect(() => clearTaskDeletionTombstone('any')).not.toThrow();
  });
});

// ===========================================================================
// Edge cases
// ===========================================================================
describe('Edge cases', () => {
  it('createTask with empty title', () => {
    const task = createTask('');
    expect(task.title).toBe('');
    expect(mockState.tasksData).toHaveLength(1);
  });

  it('deleteTask with null taskId', () => {
    mockState.tasksData = [makeTask({ id: 'task_e1' })];
    // null won't match any taskId string
    deleteTask(null);
    // The original task should remain (since null !== 'task_e1' when stringified)
    expect(mockState.tasksData).toHaveLength(1);
  });

  it('updateTask with empty updates object', () => {
    mockState.tasksData = [makeTask({ id: 'task_e2', title: 'Same' })];
    updateTask('task_e2', {});
    expect(mockState.tasksData[0].title).toBe('Same');
    // updatedAt should still be refreshed
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('toggleTaskComplete on already-completed task with no repeat', () => {
    mockState.tasksData = [makeTask({ id: 'task_e3', completed: true, completedAt: '2026-01-01T00:00:00Z' })];
    toggleTaskComplete('task_e3');
    expect(mockState.tasksData[0].completed).toBe(false);
    expect(mockState.tasksData[0].completedAt).toBeNull();
  });

  it('createTask generates unique IDs for sequential calls', () => {
    const t1 = createTask('A');
    const t2 = createTask('B');
    expect(t1.id).not.toBe(t2.id);
  });

  it('deleteTask on empty tasksData array', () => {
    mockState.tasksData = [];
    expect(() => deleteTask('anything')).not.toThrow();
  });

  it('multiple rapid toggles maintain correct state', () => {
    mockState.tasksData = [makeTask({ id: 'task_rapid' })];
    toggleTaskComplete('task_rapid');
    expect(mockState.tasksData[0].completed).toBe(true);
    toggleTaskComplete('task_rapid');
    expect(mockState.tasksData[0].completed).toBe(false);
    toggleTaskComplete('task_rapid');
    expect(mockState.tasksData[0].completed).toBe(true);
  });
});
