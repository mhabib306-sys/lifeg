// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks — must be declared before any module imports
// ---------------------------------------------------------------------------
const { mockState, saveTasksDataMock, startUndoCountdownMock } = vi.hoisted(() => {
  const mockState = {
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    collapsedNotes: new Set(),
    zoomedNoteId: null,
    notesBreadcrumb: [],
    editingNoteId: null,
    activeFilterType: null,
    activeAreaFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    activeCategoryFilter: null,
    showCacheRefreshPrompt: false,
    cacheRefreshPromptMessage: '',
    draggedNoteId: null,
    dragOverNoteId: null,
    noteDragPosition: null,
  };
  return {
    mockState,
    saveTasksDataMock: vi.fn(),
    startUndoCountdownMock: vi.fn(),
  };
});

vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/data/storage.js', () => ({ saveTasksData: saveTasksDataMock }));
vi.mock('../src/features/undo.js', () => ({ startUndoCountdown: startUndoCountdownMock }));

// Import real utils for helper functions
import { generateTaskId, escapeHtml, formatSmartDate, getLocalDateString } from '../src/utils.js';
import {
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY,
  COLLAPSED_NOTES_KEY,
  NOTE_INTEGRITY_SNAPSHOT_KEY,
  NOTE_LOCAL_BACKUP_KEY
} from '../src/constants.js';

import {
  initializeNoteOrders,
  ensureNoteSafetyMetadata,
  getDeletedNotes,
  restoreDeletedNote,
  findNotesByText,
  getRecentNoteChanges,
  createNoteLocalBackup,
  runNoteIntegrityChecks,
  saveCollapsedNotes,
  toggleNoteCollapse,
  getNotesHierarchy,
  noteHasChildren,
  getNoteChildren,
  countAllDescendants,
  isDescendantOf,
  getNoteAncestors,
  createRootNote,
  createNoteAfter,
  createChildNote,
  indentNote,
  outdentNote,
  deleteNote,
  deleteNoteWithUndo,
  zoomIntoNote,
  zoomOutOfNote,
  navigateToBreadcrumb,
  reorderNotes,
  removeNoteInlineMeta,
  handleNoteBlur,
  handleNoteFocus,
  focusNote,
} from '../src/features/notes.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function resetState() {
  mockState.tasksData = [];
  mockState.taskAreas = [];
  mockState.taskCategories = [];
  mockState.taskLabels = [];
  mockState.taskPeople = [];
  mockState.collapsedNotes = new Set();
  mockState.zoomedNoteId = null;
  mockState.notesBreadcrumb = [];
  mockState.editingNoteId = null;
  mockState.activeFilterType = null;
  mockState.activeAreaFilter = null;
  mockState.activeLabelFilter = null;
  mockState.activePersonFilter = null;
  mockState.activeCategoryFilter = null;
  mockState.showCacheRefreshPrompt = false;
  mockState.cacheRefreshPromptMessage = '';
  mockState.draggedNoteId = null;
  mockState.dragOverNoteId = null;
  mockState.noteDragPosition = null;
}

function makeNote(overrides = {}) {
  return {
    id: overrides.id || `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: overrides.title || 'Test Note',
    notes: '',
    isNote: true,
    noteLifecycleState: 'active',
    noteHistory: [],
    status: 'anytime',
    completed: false,
    completedAt: null,
    parentId: null,
    indent: 0,
    noteOrder: 1000,
    areaId: null,
    categoryId: null,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
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
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  // Mock parseDateQuery for autocomplete tests
  window.parseDateQuery = vi.fn(() => []);
});

// ===========================================================================
// ensureNoteSafetyMetadata
// ===========================================================================
describe('ensureNoteSafetyMetadata', () => {
  it('fixes notes with missing noteLifecycleState', () => {
    const note = makeNote();
    delete note.noteLifecycleState;
    mockState.tasksData = [note];

    const changed = ensureNoteSafetyMetadata();

    expect(changed).toBe(true);
    expect(note.noteLifecycleState).toBe('active');
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('fixes notes with missing noteHistory', () => {
    const note = makeNote();
    delete note.noteHistory;
    mockState.tasksData = [note];

    const changed = ensureNoteSafetyMetadata();

    expect(changed).toBe(true);
    expect(Array.isArray(note.noteHistory)).toBe(true);
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('returns false if all notes have metadata', () => {
    mockState.tasksData = [makeNote(), makeNote()];

    const changed = ensureNoteSafetyMetadata();

    expect(changed).toBe(false);
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });

  it('ignores non-note items', () => {
    mockState.tasksData = [
      { id: 'task_1', title: 'Regular task', isNote: false },
      makeNote(),
    ];

    const changed = ensureNoteSafetyMetadata();

    expect(changed).toBe(false);
  });
});

// ===========================================================================
// initializeNoteOrders
// ===========================================================================
describe('initializeNoteOrders', () => {
  it('assigns noteOrder to notes without them', () => {
    const note1 = makeNote({ id: 'n1', createdAt: '2024-01-01T10:00:00Z' });
    const note2 = makeNote({ id: 'n2', createdAt: '2024-01-01T11:00:00Z' });
    delete note1.noteOrder;
    delete note2.noteOrder;
    mockState.tasksData = [note1, note2];

    initializeNoteOrders();

    expect(note1.noteOrder).toBe(1000);
    expect(note2.noteOrder).toBe(2000);
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('groups by parent when assigning orders', () => {
    const parent = makeNote({ id: 'parent', createdAt: '2024-01-01T10:00:00Z' });
    const child1 = makeNote({ id: 'c1', parentId: 'parent', createdAt: '2024-01-01T11:00:00Z' });
    const child2 = makeNote({ id: 'c2', parentId: 'parent', createdAt: '2024-01-01T12:00:00Z' });
    delete parent.noteOrder;
    delete child1.noteOrder;
    delete child2.noteOrder;
    mockState.tasksData = [parent, child1, child2];

    initializeNoteOrders();

    expect(parent.noteOrder).toBe(1000);
    expect(child1.noteOrder).toBe(1000);
    expect(child2.noteOrder).toBe(2000);
  });

  it('does not reassign existing noteOrder values', () => {
    const note = makeNote({ noteOrder: 500 });
    mockState.tasksData = [note];

    initializeNoteOrders();

    expect(note.noteOrder).toBe(500);
  });

  it('does nothing if all notes have noteOrder', () => {
    mockState.tasksData = [makeNote({ noteOrder: 1000 }), makeNote({ noteOrder: 2000 })];

    initializeNoteOrders();

    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// getDeletedNotes
// ===========================================================================
describe('getDeletedNotes', () => {
  it('returns deleted notes sorted by deletedAt', () => {
    const note1 = makeNote({ id: 'n1', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T10:00:00Z' });
    const note2 = makeNote({ id: 'n2', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T11:00:00Z' });
    const note3 = makeNote({ id: 'n3', noteLifecycleState: 'active' });
    mockState.tasksData = [note1, note2, note3];

    const deleted = getDeletedNotes();

    expect(deleted).toHaveLength(2);
    expect(deleted[0].id).toBe('n2'); // newest first
    expect(deleted[1].id).toBe('n1');
  });

  it('respects limit parameter', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T10:00:00Z' }),
      makeNote({ id: 'n2', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T11:00:00Z' }),
      makeNote({ id: 'n3', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T12:00:00Z' }),
    ];

    const deleted = getDeletedNotes(2);

    expect(deleted).toHaveLength(2);
    expect(deleted[0].id).toBe('n3');
    expect(deleted[1].id).toBe('n2');
  });

  it('returns empty array if no deleted notes', () => {
    mockState.tasksData = [makeNote()];

    const deleted = getDeletedNotes();

    expect(deleted).toEqual([]);
  });
});

// ===========================================================================
// restoreDeletedNote
// ===========================================================================
describe('restoreDeletedNote', () => {
  it('restores a single deleted note', () => {
    const note = makeNote({ id: 'n1', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T10:00:00Z', completed: true });
    mockState.tasksData = [note];

    const result = restoreDeletedNote('n1', false);

    expect(result).toBe(true);
    expect(note.noteLifecycleState).toBe('active');
    expect(note.deletedAt).toBeNull();
    expect(note.completed).toBe(false);
    expect(note.completedAt).toBeNull();
    expect(note.noteHistory).toHaveLength(1);
    expect(note.noteHistory[0].action).toBe('restored');
  });

  it('restores note and all children when includeChildren=true', () => {
    const parent = makeNote({ id: 'parent', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T10:00:00Z', completed: true });
    const child = makeNote({ id: 'child', parentId: 'parent', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T10:00:00Z', completed: true });
    const grandchild = makeNote({ id: 'gc', parentId: 'child', noteLifecycleState: 'deleted', deletedAt: '2024-01-01T10:00:00Z', completed: true });
    mockState.tasksData = [parent, child, grandchild];

    const result = restoreDeletedNote('parent', true);

    expect(result).toBe(true);
    expect(parent.noteLifecycleState).toBe('active');
    expect(child.noteLifecycleState).toBe('active');
    expect(grandchild.noteLifecycleState).toBe('active');
  });

  it('returns false if note does not exist', () => {
    const result = restoreDeletedNote('nonexistent');

    expect(result).toBe(false);
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });

  it('returns false if note is not deleted', () => {
    const note = makeNote({ id: 'n1', noteLifecycleState: 'active' });
    mockState.tasksData = [note];

    const result = restoreDeletedNote('n1');

    expect(result).toBe(false);
  });
});

// ===========================================================================
// findNotesByText
// ===========================================================================
describe('findNotesByText', () => {
  it('returns all notes when query is empty', () => {
    mockState.tasksData = [
      makeNote({ title: 'First note' }),
      makeNote({ title: 'Second note' }),
    ];

    const results = findNotesByText('');

    expect(results).toHaveLength(2);
  });

  it('searches by title', () => {
    mockState.tasksData = [
      makeNote({ title: 'Buy groceries' }),
      makeNote({ title: 'Call plumber' }),
    ];

    const results = findNotesByText('groceries');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Buy groceries');
  });

  it('searches by notes field', () => {
    mockState.tasksData = [
      makeNote({ title: 'Task', notes: 'urgent details' }),
      makeNote({ title: 'Other', notes: 'normal' }),
    ];

    const results = findNotesByText('urgent');

    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Task');
  });

  it('search is case insensitive', () => {
    mockState.tasksData = [makeNote({ title: 'IMPORTANT' })];

    const results = findNotesByText('important');

    expect(results).toHaveLength(1);
  });

  it('respects limit parameter', () => {
    mockState.tasksData = [
      makeNote({ title: 'Note 1', updatedAt: '2024-01-01T10:00:00Z' }),
      makeNote({ title: 'Note 2', updatedAt: '2024-01-01T11:00:00Z' }),
      makeNote({ title: 'Note 3', updatedAt: '2024-01-01T12:00:00Z' }),
    ];

    const results = findNotesByText('', 2);

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('Note 3'); // newest first
  });

  it('returns note state correctly', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteLifecycleState: 'active' }),
      makeNote({ id: 'n2', noteLifecycleState: 'deleted' }),
      makeNote({ id: 'n3', completed: true }),
    ];

    const results = findNotesByText('');

    expect(results.find(r => r.id === 'n1').state).toBe('active');
    expect(results.find(r => r.id === 'n2').state).toBe('deleted');
    expect(results.find(r => r.id === 'n3').state).toBe('completed');
  });
});

// ===========================================================================
// getRecentNoteChanges
// ===========================================================================
describe('getRecentNoteChanges', () => {
  it('returns notes sorted by updatedAt', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', updatedAt: '2024-01-01T10:00:00Z' }),
      makeNote({ id: 'n2', updatedAt: '2024-01-01T12:00:00Z' }),
      makeNote({ id: 'n3', updatedAt: '2024-01-01T11:00:00Z' }),
    ];

    const changes = getRecentNoteChanges();

    expect(changes).toHaveLength(3);
    expect(changes[0].id).toBe('n2'); // newest first
    expect(changes[1].id).toBe('n3');
    expect(changes[2].id).toBe('n1');
  });

  it('includes lastAction from noteHistory', () => {
    const note = makeNote({
      noteHistory: [
        { action: 'created', at: '2024-01-01T10:00:00Z' },
        { action: 'updated', at: '2024-01-01T11:00:00Z' },
      ],
    });
    mockState.tasksData = [note];

    const changes = getRecentNoteChanges();

    expect(changes[0].lastAction).toBe('updated');
  });

  it('defaults to "updated" if no noteHistory', () => {
    const note = makeNote();
    note.noteHistory = [];
    mockState.tasksData = [note];

    const changes = getRecentNoteChanges();

    expect(changes[0].lastAction).toBe('updated');
  });

  it('respects limit parameter', () => {
    mockState.tasksData = [
      makeNote(),
      makeNote(),
      makeNote(),
    ];

    const changes = getRecentNoteChanges(2);

    expect(changes).toHaveLength(2);
  });
});

// ===========================================================================
// createNoteLocalBackup
// ===========================================================================
describe('createNoteLocalBackup', () => {
  it('creates backup in localStorage', () => {
    mockState.tasksData = [makeNote({ id: 'n1' }), makeNote({ id: 'n2' })];

    const result = createNoteLocalBackup();

    expect(result.noteCount).toBe(2);
    expect(result.createdAt).toBeDefined();
    const backup = JSON.parse(localStorage.getItem(NOTE_LOCAL_BACKUP_KEY));
    expect(backup.notes).toHaveLength(2);
    expect(backup.idsSignature).toBeDefined();
  });

  it('includes deleted notes in backup', () => {
    mockState.tasksData = [
      makeNote({ noteLifecycleState: 'active' }),
      makeNote({ noteLifecycleState: 'deleted' }),
    ];

    const result = createNoteLocalBackup();

    expect(result.noteCount).toBe(2);
  });

  it('excludes non-note items from backup', () => {
    mockState.tasksData = [
      makeNote(),
      { id: 'task_1', title: 'Regular task', isNote: false },
    ];

    const result = createNoteLocalBackup();

    expect(result.noteCount).toBe(1);
  });
});

// ===========================================================================
// runNoteIntegrityChecks
// ===========================================================================
describe('runNoteIntegrityChecks', () => {
  it('writes snapshot to localStorage', () => {
    mockState.tasksData = [makeNote()];

    const snapshot = runNoteIntegrityChecks('4.43.0');

    expect(snapshot.totalCount).toBe(1);
    expect(snapshot.activeCount).toBe(1);
    expect(snapshot.version).toBe('4.43.0');
    const stored = JSON.parse(localStorage.getItem(NOTE_INTEGRITY_SNAPSHOT_KEY));
    expect(stored).toBeDefined();
  });

  it('detects significant active note drops', () => {
    // Set up previous snapshot
    localStorage.setItem(NOTE_INTEGRITY_SNAPSHOT_KEY, JSON.stringify({
      activeCount: 10,
      version: '4.42.0',
    }));
    mockState.tasksData = [makeNote()]; // only 1 active note now

    runNoteIntegrityChecks('4.43.0');

    expect(mockState.showCacheRefreshPrompt).toBe(true);
    expect(mockState.cacheRefreshPromptMessage).toContain('10 to 1');
  });

  it('does not warn for small drops', () => {
    localStorage.setItem(NOTE_INTEGRITY_SNAPSHOT_KEY, JSON.stringify({
      activeCount: 5,
      version: '4.42.0',
    }));
    mockState.tasksData = [makeNote(), makeNote(), makeNote()]; // 3 notes (2 drop, < 3 threshold)

    runNoteIntegrityChecks('4.43.0');

    expect(mockState.showCacheRefreshPrompt).toBe(false);
  });

  it('counts deleted and completed notes separately', () => {
    mockState.tasksData = [
      makeNote({ noteLifecycleState: 'active' }),
      makeNote({ noteLifecycleState: 'deleted' }),
      makeNote({ completed: true }),
    ];

    const snapshot = runNoteIntegrityChecks();

    expect(snapshot.totalCount).toBe(3);
    expect(snapshot.activeCount).toBe(1);
    expect(snapshot.deletedCount).toBe(1);
    expect(snapshot.completedCount).toBe(1);
  });
});

// ===========================================================================
// saveCollapsedNotes / toggleNoteCollapse
// ===========================================================================
describe('collapsed notes', () => {
  it('toggleNoteCollapse adds note to set', () => {
    toggleNoteCollapse('n1');

    expect(mockState.collapsedNotes.has('n1')).toBe(true);
    const stored = JSON.parse(localStorage.getItem(COLLAPSED_NOTES_KEY));
    expect(stored).toContain('n1');
    expect(window.render).toHaveBeenCalled();
  });

  it('toggleNoteCollapse removes note from set', () => {
    mockState.collapsedNotes.add('n1');

    toggleNoteCollapse('n1');

    expect(mockState.collapsedNotes.has('n1')).toBe(false);
  });

  it('saveCollapsedNotes writes to localStorage', () => {
    mockState.collapsedNotes.add('n1');
    mockState.collapsedNotes.add('n2');

    saveCollapsedNotes();

    const stored = JSON.parse(localStorage.getItem(COLLAPSED_NOTES_KEY));
    expect(stored).toHaveLength(2);
    expect(stored).toContain('n1');
    expect(stored).toContain('n2');
  });
});

// ===========================================================================
// getNotesHierarchy
// ===========================================================================
describe('getNotesHierarchy', () => {
  it('returns flat list for notes without parents', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
    ];

    const hierarchy = getNotesHierarchy();

    expect(hierarchy).toHaveLength(2);
    expect(hierarchy[0].id).toBe('n1');
    expect(hierarchy[1].id).toBe('n2');
  });

  it('builds tree with children', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent', noteOrder: 1000 }),
      makeNote({ id: 'child', parentId: 'parent', noteOrder: 1000 }),
    ];

    const hierarchy = getNotesHierarchy();

    expect(hierarchy).toHaveLength(2);
    expect(hierarchy[0].id).toBe('parent');
    expect(hierarchy[0].indent).toBe(0);
    expect(hierarchy[1].id).toBe('child');
    expect(hierarchy[1].indent).toBe(1);
  });

  it('filters by areaId', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', areaId: 'area1' }),
      makeNote({ id: 'n2', areaId: 'area2' }),
    ];

    const hierarchy = getNotesHierarchy('area1');

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].id).toBe('n1');
  });

  it('filters by labelId', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', labels: ['label1'] }),
      makeNote({ id: 'n2', labels: ['label2'] }),
    ];

    const hierarchy = getNotesHierarchy({ labelId: 'label1' });

    expect(hierarchy).toHaveLength(1);
    expect(hierarchy[0].id).toBe('n1');
  });

  it('normalizes invalid parentIds', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', parentId: 'nonexistent' }),
    ];

    const hierarchy = getNotesHierarchy();

    expect(hierarchy[0].parentId).toBeNull();
  });

  it('prevents circular references', () => {
    // Create a cycle: n1 -> n2 -> n1
    const n1 = makeNote({ id: 'n1', parentId: 'n2' });
    const n2 = makeNote({ id: 'n2', parentId: 'n1' });
    mockState.tasksData = [n1, n2];

    const hierarchy = getNotesHierarchy();

    // Both should be normalized to root level
    expect(hierarchy).toHaveLength(2);
    expect(hierarchy.every(n => n.parentId === null)).toBe(true);
  });
});

// ===========================================================================
// noteHasChildren
// ===========================================================================
describe('noteHasChildren', () => {
  it('returns true if note has children', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    expect(noteHasChildren('parent')).toBe(true);
  });

  it('returns false if note has no children', () => {
    mockState.tasksData = [makeNote({ id: 'parent' })];

    expect(noteHasChildren('parent')).toBe(false);
  });

  it('ignores deleted children', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent', noteLifecycleState: 'deleted' }),
    ];

    expect(noteHasChildren('parent')).toBe(false);
  });
});

// ===========================================================================
// getNoteChildren
// ===========================================================================
describe('getNoteChildren', () => {
  it('returns direct children sorted by noteOrder', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'c2', parentId: 'parent', noteOrder: 2000 }),
      makeNote({ id: 'c1', parentId: 'parent', noteOrder: 1000 }),
    ];

    const children = getNoteChildren('parent');

    expect(children).toHaveLength(2);
    expect(children[0].id).toBe('c1');
    expect(children[1].id).toBe('c2');
  });

  it('returns empty array if no children', () => {
    mockState.tasksData = [makeNote({ id: 'parent' })];

    const children = getNoteChildren('parent');

    expect(children).toEqual([]);
  });

  it('does not include grandchildren', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
      makeNote({ id: 'grandchild', parentId: 'child' }),
    ];

    const children = getNoteChildren('parent');

    expect(children).toHaveLength(1);
    expect(children[0].id).toBe('child');
  });
});

// ===========================================================================
// countAllDescendants
// ===========================================================================
describe('countAllDescendants', () => {
  it('counts direct children only', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'c1', parentId: 'parent' }),
      makeNote({ id: 'c2', parentId: 'parent' }),
    ];

    expect(countAllDescendants('parent')).toBe(2);
  });

  it('counts all descendants recursively', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
      makeNote({ id: 'gc1', parentId: 'child' }),
      makeNote({ id: 'gc2', parentId: 'child' }),
    ];

    expect(countAllDescendants('parent')).toBe(3);
  });

  it('returns 0 for notes with no children', () => {
    mockState.tasksData = [makeNote({ id: 'note' })];

    expect(countAllDescendants('note')).toBe(0);
  });
});

// ===========================================================================
// isDescendantOf
// ===========================================================================
describe('isDescendantOf', () => {
  it('returns true for direct child', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    expect(isDescendantOf('child', 'parent')).toBe(true);
  });

  it('returns true for grandchild', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
      makeNote({ id: 'grandchild', parentId: 'child' }),
    ];

    expect(isDescendantOf('grandchild', 'parent')).toBe(true);
  });

  it('returns false for sibling', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'c1', parentId: 'parent' }),
      makeNote({ id: 'c2', parentId: 'parent' }),
    ];

    expect(isDescendantOf('c1', 'c2')).toBe(false);
  });

  it('returns false for parent', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    expect(isDescendantOf('parent', 'child')).toBe(false);
  });

  it('detects circular references', () => {
    const n1 = makeNote({ id: 'n1', parentId: 'n2' });
    const n2 = makeNote({ id: 'n2', parentId: 'n1' });
    mockState.tasksData = [n1, n2];

    // In a circular reference, n1's parent IS n2, so it returns true
    // The cycle detection prevents infinite loops but still returns true if found
    expect(isDescendantOf('n1', 'n2')).toBe(true);
  });

  it('returns false if target has no parent', () => {
    mockState.tasksData = [makeNote({ id: 'note' })];

    expect(isDescendantOf('note', 'other')).toBe(false);
  });
});

// ===========================================================================
// getNoteAncestors
// ===========================================================================
describe('getNoteAncestors', () => {
  it('returns empty array for root note', () => {
    mockState.tasksData = [makeNote({ id: 'note' })];

    const ancestors = getNoteAncestors('note');

    expect(ancestors).toEqual([]);
  });

  it('returns parent for direct child', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent', title: 'Parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    const ancestors = getNoteAncestors('child');

    expect(ancestors).toHaveLength(1);
    expect(ancestors[0].id).toBe('parent');
    expect(ancestors[0].title).toBe('Parent');
  });

  it('returns full ancestor chain', () => {
    mockState.tasksData = [
      makeNote({ id: 'gp', title: 'Grandparent' }),
      makeNote({ id: 'parent', parentId: 'gp', title: 'Parent' }),
      makeNote({ id: 'child', parentId: 'parent', title: 'Child' }),
    ];

    const ancestors = getNoteAncestors('child');

    expect(ancestors).toHaveLength(2);
    expect(ancestors[0].id).toBe('gp');
    expect(ancestors[1].id).toBe('parent');
  });

  it('handles circular references', () => {
    const n1 = makeNote({ id: 'n1', parentId: 'n2' });
    const n2 = makeNote({ id: 'n2', parentId: 'n1' });
    mockState.tasksData = [n1, n2];

    const ancestors = getNoteAncestors('n1');

    // Should break out of cycle
    expect(ancestors.length).toBeLessThan(10);
  });
});

// ===========================================================================
// createRootNote
// ===========================================================================
describe('createRootNote', () => {
  it('creates note with no parent', () => {
    createRootNote();

    expect(mockState.tasksData).toHaveLength(1);
    const note = mockState.tasksData[0];
    expect(note.isNote).toBe(true);
    expect(note.parentId).toBeNull();
    expect(note.indent).toBe(0);
    expect(note.title).toBe('');
    expect(saveTasksDataMock).toHaveBeenCalled();
    expect(window.render).toHaveBeenCalled();
  });

  it('assigns noteOrder after existing notes', () => {
    mockState.tasksData = [makeNote({ noteOrder: 1000 })];

    createRootNote();

    const newNote = mockState.tasksData[1];
    expect(newNote.noteOrder).toBe(2000);
  });

  it('applies filter to new note', () => {
    createRootNote({ areaId: 'area1', labelId: 'label1' });

    const note = mockState.tasksData[0];
    expect(note.areaId).toBe('area1');
    expect(note.labels).toContain('label1');
  });

  it('creates as child if zoomed', () => {
    const parent = makeNote({ id: 'parent' });
    mockState.tasksData = [parent];
    mockState.zoomedNoteId = 'parent';

    createRootNote();

    expect(mockState.tasksData).toHaveLength(2);
    const newNote = mockState.tasksData[1];
    expect(newNote.parentId).toBe('parent');
  });

  it('adds noteHistory entry', () => {
    createRootNote();

    const note = mockState.tasksData[0];
    expect(note.noteHistory).toHaveLength(1);
    expect(note.noteHistory[0].action).toBe('created');
  });
});

// ===========================================================================
// createNoteAfter
// ===========================================================================
describe('createNoteAfter', () => {
  it('creates sibling note after target', () => {
    const note1 = makeNote({ id: 'n1', noteOrder: 1000 });
    mockState.tasksData = [note1];

    createNoteAfter('n1');

    expect(mockState.tasksData).toHaveLength(2);
    const newNote = mockState.tasksData[1];
    expect(newNote.parentId).toBe(note1.parentId);
    expect(newNote.indent).toBe(note1.indent);
    expect(newNote.noteOrder).toBeGreaterThan(note1.noteOrder);
  });

  it('places note between siblings', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
    ];

    createNoteAfter('n1');

    const newNote = mockState.tasksData[2];
    expect(newNote.noteOrder).toBeGreaterThan(1000);
    expect(newNote.noteOrder).toBeLessThan(2000);
  });

  it('inherits areaId and categoryId from target', () => {
    const note = makeNote({ id: 'n1', areaId: 'area1', categoryId: 'cat1' });
    mockState.tasksData = [note];

    createNoteAfter('n1');

    const newNote = mockState.tasksData[1];
    expect(newNote.areaId).toBe('area1');
    expect(newNote.categoryId).toBe('cat1');
  });

  it('does nothing if target note does not exist', () => {
    createNoteAfter('nonexistent');

    expect(mockState.tasksData).toHaveLength(0);
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// createChildNote
// ===========================================================================
describe('createChildNote', () => {
  it('creates child note', () => {
    const parent = makeNote({ id: 'parent', indent: 0 });
    mockState.tasksData = [parent];

    createChildNote('parent');

    expect(mockState.tasksData).toHaveLength(2);
    const child = mockState.tasksData[1];
    expect(child.parentId).toBe('parent');
    expect(child.indent).toBe(1);
  });

  it('expands parent if collapsed', () => {
    mockState.collapsedNotes.add('parent');
    const parent = makeNote({ id: 'parent' });
    mockState.tasksData = [parent];

    createChildNote('parent');

    expect(mockState.collapsedNotes.has('parent')).toBe(false);
  });

  it('assigns noteOrder after existing children', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'c1', parentId: 'parent', noteOrder: 1000 }),
    ];

    createChildNote('parent');

    const newChild = mockState.tasksData[2];
    expect(newChild.noteOrder).toBe(2000);
  });

  it('inherits metadata from parent', () => {
    const parent = makeNote({ id: 'parent', areaId: 'area1', categoryId: 'cat1' });
    mockState.tasksData = [parent];

    createChildNote('parent');

    const child = mockState.tasksData[1];
    expect(child.areaId).toBe('area1');
    expect(child.categoryId).toBe('cat1');
  });
});

// ===========================================================================
// indentNote
// ===========================================================================
describe('indentNote', () => {
  it('indents note under previous sibling', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
    ];

    indentNote('n2');

    const note = mockState.tasksData.find(n => n.id === 'n2');
    expect(note.parentId).toBe('n1');
    expect(note.indent).toBe(1);
  });

  it('does not indent first note', () => {
    const note = makeNote({ id: 'n1', indent: 0 });
    mockState.tasksData = [note];

    indentNote('n1');

    expect(note.parentId).toBeNull();
    expect(note.indent).toBe(0);
  });

  it('respects max depth of 5', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', indent: 4 }),
      makeNote({ id: 'n2', indent: 5, noteOrder: 2000 }),
    ];

    indentNote('n2');

    const note = mockState.tasksData.find(n => n.id === 'n2');
    expect(note.indent).toBe(5); // no change
  });

  it('expands previous sibling if collapsed', () => {
    mockState.collapsedNotes.add('n1');
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
    ];

    indentNote('n2');

    expect(mockState.collapsedNotes.has('n1')).toBe(false);
  });

  it('records history entry', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
    ];

    indentNote('n2');

    const note = mockState.tasksData.find(n => n.id === 'n2');
    expect(note.noteHistory.some(h => h.action === 'updated' && h.details.type === 'indent')).toBe(true);
  });
});

// ===========================================================================
// outdentNote
// ===========================================================================
describe('outdentNote', () => {
  it('outdents child note to parent level', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent', noteOrder: 1000 }),
      makeNote({ id: 'child', parentId: 'parent', indent: 1, noteOrder: 1000 }),
    ];

    outdentNote('child');

    const note = mockState.tasksData.find(n => n.id === 'child');
    expect(note.parentId).toBeNull();
    expect(note.indent).toBe(0);
  });

  it('places note after old parent', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent', noteOrder: 1000 }),
      makeNote({ id: 'child', parentId: 'parent', indent: 1 }),
    ];

    outdentNote('child');

    const note = mockState.tasksData.find(n => n.id === 'child');
    expect(note.noteOrder).toBeGreaterThan(1000);
  });

  it('does nothing if note already at root', () => {
    const note = makeNote({ id: 'n1', indent: 0 });
    mockState.tasksData = [note];

    outdentNote('n1');

    expect(note.indent).toBe(0);
    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });

  it('records history entry', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent', indent: 1 }),
    ];

    outdentNote('child');

    const note = mockState.tasksData.find(n => n.id === 'child');
    expect(note.noteHistory.some(h => h.action === 'updated' && h.details.type === 'outdent')).toBe(true);
  });
});

// ===========================================================================
// deleteNote
// ===========================================================================
describe('deleteNote', () => {
  it('soft deletes a note', () => {
    const note = makeNote({ id: 'n1' });
    mockState.tasksData = [note];

    deleteNote('n1');

    expect(note.noteLifecycleState).toBe('deleted');
    expect(note.deletedAt).toBeDefined();
    expect(note.completed).toBe(true);
  });

  it('reparents children when deleteChildren=false', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent', indent: 1 }),
    ];

    deleteNote('parent', false);

    const child = mockState.tasksData.find(n => n.id === 'child');
    expect(child.parentId).toBeNull();
    expect(child.indent).toBe(0);
  });

  it('deletes children when deleteChildren=true', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    deleteNote('parent', true);

    const child = mockState.tasksData.find(n => n.id === 'child');
    expect(child.noteLifecycleState).toBe('deleted');
  });

  it('resets zoom if deleting zoomed note', () => {
    mockState.tasksData = [
      makeNote({ id: 'gp', title: 'GP' }),
      makeNote({ id: 'parent', parentId: 'gp', title: 'Parent' }),
    ];
    mockState.zoomedNoteId = 'parent';
    mockState.notesBreadcrumb = [{ id: 'gp', title: 'GP' }, { id: 'parent', title: 'Parent' }];

    deleteNote('parent');

    expect(mockState.zoomedNoteId).toBe('gp');
    expect(mockState.notesBreadcrumb).toHaveLength(0);
  });

  it('removes from collapsed set', () => {
    mockState.collapsedNotes.add('n1');
    mockState.tasksData = [makeNote({ id: 'n1' })];

    deleteNote('n1');

    expect(mockState.collapsedNotes.has('n1')).toBe(false);
  });

  it('recursively deletes all descendants', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
      makeNote({ id: 'gc', parentId: 'child' }),
    ];

    deleteNote('parent', true);

    const child = mockState.tasksData.find(n => n.id === 'child');
    const gc = mockState.tasksData.find(n => n.id === 'gc');
    expect(child.noteLifecycleState).toBe('deleted');
    expect(gc.noteLifecycleState).toBe('deleted');
  });
});

// ===========================================================================
// deleteNoteWithUndo
// ===========================================================================
describe('deleteNoteWithUndo', () => {
  it('deletes note and starts undo countdown', () => {
    const note = makeNote({ id: 'n1', title: 'My Note' });
    mockState.tasksData = [note];

    deleteNoteWithUndo('n1');

    expect(note.noteLifecycleState).toBe('deleted');
    expect(startUndoCountdownMock).toHaveBeenCalledWith(
      expect.stringContaining('My Note'),
      expect.objectContaining({ snapshot: expect.any(Array) }),
      expect.any(Function)
    );
  });

  it('includes children in snapshot', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    deleteNoteWithUndo('parent');

    expect(startUndoCountdownMock).toHaveBeenCalled();
    const snapshot = startUndoCountdownMock.mock.calls[0][1].snapshot;
    expect(snapshot).toHaveLength(2);
  });

  it('restores notes on undo', () => {
    const note = makeNote({ id: 'n1', title: 'Original' });
    mockState.tasksData = [note];

    deleteNoteWithUndo('n1');

    // Simulate undo callback
    const undoCallback = startUndoCountdownMock.mock.calls[0][2];
    const snap = startUndoCountdownMock.mock.calls[0][1];
    undoCallback(snap);

    expect(note.title).toBe('Original');
    expect(saveTasksDataMock).toHaveBeenCalled();
  });
});

// ===========================================================================
// zoomIntoNote / zoomOutOfNote / navigateToBreadcrumb
// ===========================================================================
describe('zoom navigation', () => {
  describe('zoomIntoNote', () => {
    it('sets zoomedNoteId and builds breadcrumb', () => {
      mockState.tasksData = [
        makeNote({ id: 'gp', title: 'Grandparent' }),
        makeNote({ id: 'parent', parentId: 'gp', title: 'Parent' }),
        makeNote({ id: 'note', parentId: 'parent', title: 'Note' }),
      ];

      zoomIntoNote('note');

      expect(mockState.zoomedNoteId).toBe('note');
      expect(mockState.notesBreadcrumb).toHaveLength(3);
      expect(mockState.notesBreadcrumb[0].id).toBe('gp');
      expect(mockState.notesBreadcrumb[1].id).toBe('parent');
      expect(mockState.notesBreadcrumb[2].id).toBe('note');
      expect(window.render).toHaveBeenCalled();
    });

    it('does nothing if note does not exist', () => {
      zoomIntoNote('nonexistent');

      expect(mockState.zoomedNoteId).toBeNull();
    });
  });

  describe('zoomOutOfNote', () => {
    it('zooms to parent', () => {
      mockState.tasksData = [
        makeNote({ id: 'parent', title: 'Parent' }),
        makeNote({ id: 'child', parentId: 'parent', title: 'Child' }),
      ];
      mockState.zoomedNoteId = 'child';
      mockState.notesBreadcrumb = [{ id: 'parent', title: 'Parent' }, { id: 'child', title: 'Child' }];

      zoomOutOfNote();

      expect(mockState.zoomedNoteId).toBe('parent');
      expect(mockState.notesBreadcrumb).toHaveLength(1);
    });

    it('exits zoom if at root', () => {
      mockState.tasksData = [makeNote({ id: 'note', title: 'Note' })];
      mockState.zoomedNoteId = 'note';
      mockState.notesBreadcrumb = [{ id: 'note', title: 'Note' }];

      zoomOutOfNote();

      expect(mockState.zoomedNoteId).toBeNull();
      expect(mockState.notesBreadcrumb).toEqual([]);
    });

    it('does nothing if not zoomed', () => {
      zoomOutOfNote();

      expect(mockState.zoomedNoteId).toBeNull();
    });
  });

  describe('navigateToBreadcrumb', () => {
    it('zooms to specified note', () => {
      mockState.tasksData = [
        makeNote({ id: 'gp', title: 'GP' }),
        makeNote({ id: 'parent', parentId: 'gp', title: 'Parent' }),
      ];

      navigateToBreadcrumb('parent');

      expect(mockState.zoomedNoteId).toBe('parent');
    });

    it('exits zoom when null is passed', () => {
      mockState.zoomedNoteId = 'note';

      navigateToBreadcrumb(null);

      expect(mockState.zoomedNoteId).toBeNull();
      expect(mockState.notesBreadcrumb).toEqual([]);
    });
  });
});

// ===========================================================================
// reorderNotes
// ===========================================================================
describe('reorderNotes', () => {
  it('moves note to top of target', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
      makeNote({ id: 'n3', noteOrder: 3000 }),
    ];

    reorderNotes('n3', 'n2', 'top');

    const n3 = mockState.tasksData.find(n => n.id === 'n3');
    expect(n3.noteOrder).toBeLessThan(2000);
    expect(n3.noteOrder).toBeGreaterThan(1000);
  });

  it('moves note to bottom of target', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', noteOrder: 1000 }),
      makeNote({ id: 'n2', noteOrder: 2000 }),
      makeNote({ id: 'n3', noteOrder: 3000 }),
    ];

    reorderNotes('n1', 'n2', 'bottom');

    const n1 = mockState.tasksData.find(n => n.id === 'n1');
    expect(n1.noteOrder).toBeGreaterThan(2000);
    expect(n1.noteOrder).toBeLessThan(3000);
  });

  it('moves note as child of target', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent', indent: 0 }),
      makeNote({ id: 'note', indent: 0 }),
    ];

    reorderNotes('note', 'parent', 'child');

    const note = mockState.tasksData.find(n => n.id === 'note');
    expect(note.parentId).toBe('parent');
    expect(note.indent).toBe(1);
  });

  it('expands target when making child', () => {
    mockState.collapsedNotes.add('parent');
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'note' }),
    ];

    reorderNotes('note', 'parent', 'child');

    expect(mockState.collapsedNotes.has('parent')).toBe(false);
  });

  it('prevents dropping into own descendants', () => {
    mockState.tasksData = [
      makeNote({ id: 'parent' }),
      makeNote({ id: 'child', parentId: 'parent' }),
    ];

    reorderNotes('parent', 'child', 'child');

    const parent = mockState.tasksData.find(n => n.id === 'parent');
    expect(parent.parentId).toBeNull(); // no change
  });

  it('does nothing if dragged or target does not exist', () => {
    reorderNotes('nonexistent', 'n1', 'top');

    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// removeNoteInlineMeta
// ===========================================================================
describe('removeNoteInlineMeta', () => {
  it('removes areaId', () => {
    const note = makeNote({ id: 'n1', areaId: 'area1' });
    mockState.tasksData = [note];

    removeNoteInlineMeta('n1', 'category', 'area1');

    expect(note.areaId).toBeNull();
    expect(window.render).toHaveBeenCalled();
  });

  it('removes label', () => {
    const note = makeNote({ id: 'n1', labels: ['label1', 'label2'] });
    mockState.tasksData = [note];

    removeNoteInlineMeta('n1', 'label', 'label1');

    expect(note.labels).toEqual(['label2']);
  });

  it('removes person', () => {
    const note = makeNote({ id: 'n1', people: ['person1', 'person2'] });
    mockState.tasksData = [note];

    removeNoteInlineMeta('n1', 'person', 'person1');

    expect(note.people).toEqual(['person2']);
  });

  it('removes deferDate', () => {
    const note = makeNote({ id: 'n1', deferDate: '2024-01-01' });
    mockState.tasksData = [note];

    removeNoteInlineMeta('n1', 'deferDate');

    expect(note.deferDate).toBeNull();
  });

  it('does nothing if note does not exist', () => {
    removeNoteInlineMeta('nonexistent', 'category', 'area1');

    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// handleNoteBlur
// ===========================================================================
describe('handleNoteBlur', () => {
  it('saves title changes', () => {
    const note = makeNote({ id: 'n1', title: 'Old Title' });
    mockState.tasksData = [note];
    const event = {
      target: { textContent: '  New Title  ' }
    };

    handleNoteBlur(event, 'n1');

    expect(note.title).toBe('New Title');
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('deletes empty childless notes', () => {
    const note = makeNote({ id: 'n1', title: 'Original' });
    mockState.tasksData = [note];
    const event = {
      target: { textContent: '' }
    };

    handleNoteBlur(event, 'n1');

    expect(note.noteLifecycleState).toBe('deleted');
  });

  it('does not delete empty notes with children', () => {
    mockState.tasksData = [
      makeNote({ id: 'n1', title: 'Parent' }),
      makeNote({ id: 'c1', parentId: 'n1' }),
    ];
    const event = {
      target: { textContent: '' }
    };

    handleNoteBlur(event, 'n1');

    const note = mockState.tasksData.find(n => n.id === 'n1');
    expect(note.noteLifecycleState).toBe('active');
    expect(note.title).toBe('');
  });

  it('clears editingNoteId', () => {
    const note = makeNote({ id: 'n1' });
    mockState.tasksData = [note];
    mockState.editingNoteId = 'n1';
    const event = {
      target: { textContent: 'Title' }
    };

    handleNoteBlur(event, 'n1');

    expect(mockState.editingNoteId).toBeNull();
  });

  it('does not save if title unchanged', () => {
    const note = makeNote({ id: 'n1', title: 'Same' });
    mockState.tasksData = [note];
    const event = {
      target: { textContent: 'Same' }
    };

    handleNoteBlur(event, 'n1');

    expect(saveTasksDataMock).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// handleNoteFocus
// ===========================================================================
describe('handleNoteFocus', () => {
  it('sets editingNoteId', () => {
    const event = {};

    handleNoteFocus(event, 'n1');

    expect(mockState.editingNoteId).toBe('n1');
  });
});

// ===========================================================================
// Edge Cases
// ===========================================================================
describe('edge cases', () => {
  it('handles null/undefined noteId gracefully', () => {
    expect(() => deleteNote(null)).not.toThrow();
    expect(() => createNoteAfter(undefined)).not.toThrow();
    expect(() => indentNote(null)).not.toThrow();
  });

  it('handles empty tasksData', () => {
    mockState.tasksData = [];

    expect(getNotesHierarchy()).toEqual([]);
    expect(getNoteChildren('n1')).toEqual([]);
    expect(countAllDescendants('n1')).toBe(0);
  });

  it('handles mixed notes and tasks', () => {
    mockState.tasksData = [
      makeNote(),
      { id: 'task_1', title: 'Regular task', isNote: false },
      makeNote(),
    ];

    const hierarchy = getNotesHierarchy();

    expect(hierarchy).toHaveLength(2);
    expect(hierarchy.every(n => n.isNote)).toBe(true);
  });

  it('handles deeply nested notes', () => {
    // Create 10 levels of nesting
    let parent = makeNote({ id: 'root' });
    mockState.tasksData = [parent];
    for (let i = 1; i <= 10; i++) {
      const child = makeNote({ id: `l${i}`, parentId: parent.id, indent: i });
      mockState.tasksData.push(child);
      parent = child;
    }

    const descendants = countAllDescendants('root');

    expect(descendants).toBe(10);
  });

  it('handles notes with missing createdAt', () => {
    const note = makeNote();
    delete note.createdAt;
    mockState.tasksData = [note];

    const hierarchy = getNotesHierarchy();

    expect(hierarchy).toHaveLength(1);
  });

  it('handles notes with invalid parentId', () => {
    const note = makeNote({ parentId: 'invalid' });
    mockState.tasksData = [note];

    const hierarchy = getNotesHierarchy();

    expect(hierarchy[0].parentId).toBeNull();
  });
});
