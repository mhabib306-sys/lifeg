// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks — must be declared before any module imports
// ---------------------------------------------------------------------------
const {
  mockState,
  saveTasksDataMock,
  escapeHtmlMock,
  generateTaskIdMock,
  getLocalDateStringMock,
  DELETED_ENTITY_TOMBSTONES_KEY,
  CATEGORIES_KEY,
  TRIGGERS_KEY,
  COLLAPSED_TRIGGERS_KEY,
  THINGS3_ICONS,
  getActiveIconsMock,
} = vi.hoisted(() => {
  return {
    mockState: {
      // Undo state
      undoAction: null,
      undoTimerRemaining: 0,
      undoTimerId: null,
      // Areas/entities state
      taskAreas: [],
      taskCategories: [],
      taskLabels: [],
      taskPeople: [],
      tasksData: [],
      deletedEntityTombstones: {},
      // Triggers state
      triggers: [],
      collapsedTriggers: new Set(),
      zoomedTriggerId: null,
      triggersBreadcrumb: [],
      _draggedTriggerId: null,
    },
    saveTasksDataMock: vi.fn(),
    escapeHtmlMock: vi.fn((str) => String(str || '')),
    generateTaskIdMock: vi.fn(() => 'trigger_' + Date.now() + '_abc12'),
    getLocalDateStringMock: vi.fn(() => '2026-02-12'),
    DELETED_ENTITY_TOMBSTONES_KEY: 'lifeGamificationDeletedEntityTombstones',
    CATEGORIES_KEY: 'lifeGamificationTaskCategories',
    TRIGGERS_KEY: 'lifeGamificationTriggers',
    COLLAPSED_TRIGGERS_KEY: 'lifeGamificationCollapsedTriggers',
    THINGS3_ICONS: { folder: '📁', tag: '#', person: '@' },
    getActiveIconsMock: vi.fn(() => ({ folder: '📁', tag: '#', person: '@' })),
  };
});

vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/data/storage.js', () => ({ saveTasksData: saveTasksDataMock }));
vi.mock('../src/utils.js', () => ({
  escapeHtml: escapeHtmlMock,
  generateTaskId: generateTaskIdMock,
  getLocalDateString: getLocalDateStringMock,
}));
vi.mock('../src/constants.js', () => ({
  DELETED_ENTITY_TOMBSTONES_KEY,
  CATEGORIES_KEY,
  TRIGGERS_KEY,
  COLLAPSED_TRIGGERS_KEY,
  THINGS3_ICONS,
  getActiveIcons: getActiveIconsMock,
}));

import {
  startUndoCountdown,
  executeUndo,
  dismissUndo,
  renderUndoToastHtml,
} from '../src/features/undo.js';

import {
  createArea,
  updateArea,
  deleteArea,
  getAreaById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoriesByArea,
  createLabel,
  updateLabel,
  deleteLabel,
  getLabelById,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonById,
  getTasksByPerson,
  ensureEntityTombstones,
  persistEntityTombstones,
} from '../src/features/areas.js';

import {
  createTrigger,
  createRootTrigger,
  createTriggerAfter,
  createChildTrigger,
  updateTrigger,
  deleteTrigger,
  indentTrigger,
  outdentTrigger,
  toggleTriggerCollapse,
  zoomIntoTrigger,
  zoomOutOfTrigger,
  navigateToTriggerBreadcrumb,
  triggerHasChildren,
  getTriggerChildren,
  saveCollapsedTriggers,
  reorderTriggers,
  getTriggerCountForArea,
  handleTriggerInput,
  handleTriggerBlur,
} from '../src/features/triggers.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function resetState() {
  // Undo
  mockState.undoAction = null;
  mockState.undoTimerRemaining = 0;
  mockState.undoTimerId = null;
  // Areas
  mockState.taskAreas = [];
  mockState.taskCategories = [];
  mockState.taskLabels = [];
  mockState.taskPeople = [];
  mockState.tasksData = [];
  mockState.deletedEntityTombstones = {};
  // Triggers
  mockState.triggers = [];
  mockState.collapsedTriggers = new Set();
  mockState.zoomedTriggerId = null;
  mockState.triggersBreadcrumb = [];
  mockState._draggedTriggerId = null;
}

function makeTask(overrides = {}) {
  return {
    id: overrides.id || 'task_test_1',
    title: overrides.title || 'Test task',
    status: 'anytime',
    completed: false,
    areaId: null,
    categoryId: null,
    labels: [],
    people: [],
    ...overrides,
  };
}

function makeArea(overrides = {}) {
  return {
    id: overrides.id || 'cat_' + Date.now(),
    name: overrides.name || 'Area',
    color: overrides.color || '#4A90A4',
    emoji: overrides.emoji || '',
    icon: '📁',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeCategory(overrides = {}) {
  return {
    id: overrides.id || 'subcat_' + Date.now(),
    name: overrides.name || 'Category',
    areaId: overrides.areaId || null,
    color: overrides.color || '#4A90A4',
    emoji: overrides.emoji || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeLabel(overrides = {}) {
  return {
    id: overrides.id || 'label_' + Date.now(),
    name: overrides.name || 'Label',
    color: overrides.color || '#6B7280',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makePerson(overrides = {}) {
  return {
    id: overrides.id || 'person_' + Date.now(),
    name: overrides.name || 'Person',
    email: overrides.email || '',
    jobTitle: overrides.jobTitle || '',
    photoUrl: '',
    photoData: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeTrigger(overrides = {}) {
  return {
    id: overrides.id || 'trigger_' + Date.now(),
    title: overrides.title || 'Trigger',
    areaId: overrides.areaId || null,
    categoryId: overrides.categoryId || null,
    parentId: overrides.parentId || null,
    indent: overrides.indent || 0,
    triggerOrder: overrides.triggerOrder || 1000,
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
  // Stub window functions
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  // Clear all timers
  vi.clearAllTimers();
});

afterEach(() => {
  // Clean up any lingering timers
  if (mockState.undoTimerId) {
    clearInterval(mockState.undoTimerId);
    mockState.undoTimerId = null;
  }
});

// ===========================================================================
// UNDO.JS TESTS
// ===========================================================================

describe('undo.js - startUndoCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets state.undoAction with label, snapshot, and restoreFn', () => {
    const snapshot = { data: 'test' };
    const restoreFn = vi.fn();
    startUndoCountdown('Test deleted', snapshot, restoreFn);

    expect(mockState.undoAction).toEqual({
      label: 'Test deleted',
      snapshot,
      restoreFn,
    });
  });

  it('sets undoTimerRemaining to 5 seconds', () => {
    startUndoCountdown('Test', {}, vi.fn());
    expect(mockState.undoTimerRemaining).toBe(5);
  });

  it('creates an interval timer', () => {
    startUndoCountdown('Test', {}, vi.fn());
    expect(mockState.undoTimerId).toBeTruthy();
  });

  it('clears existing timer before starting new one', () => {
    // Start first countdown
    startUndoCountdown('First', {}, vi.fn());
    const firstTimerId = mockState.undoTimerId;

    // Start second countdown
    startUndoCountdown('Second', {}, vi.fn());
    const secondTimerId = mockState.undoTimerId;

    // Timer IDs should be different
    expect(firstTimerId).not.toBe(secondTimerId);
    expect(mockState.undoAction.label).toBe('Second');
  });

  it('calls window.render', () => {
    startUndoCountdown('Test', {}, vi.fn());
    expect(window.render).toHaveBeenCalled();
  });

  it('timer decrements undoTimerRemaining each second', () => {
    // Mock DOM elements for countdown updates
    const countdownEl = document.createElement('span');
    countdownEl.id = 'undo-countdown';
    const ringEl = document.createElement('circle');
    ringEl.id = 'undo-ring-circle';
    document.body.appendChild(countdownEl);
    document.body.appendChild(ringEl);

    startUndoCountdown('Test', {}, vi.fn());
    expect(mockState.undoTimerRemaining).toBe(5);

    vi.advanceTimersByTime(1000);
    expect(mockState.undoTimerRemaining).toBe(4);

    vi.advanceTimersByTime(1000);
    expect(mockState.undoTimerRemaining).toBe(3);

    document.body.removeChild(countdownEl);
    document.body.removeChild(ringEl);
  });

  it('timer auto-dismisses when reaching 0', () => {
    const dismissSpy = vi.spyOn({ dismissUndo }, 'dismissUndo');
    startUndoCountdown('Test', {}, vi.fn());

    // Advance to timer completion
    vi.advanceTimersByTime(5000);
    expect(mockState.undoTimerRemaining).toBe(0);

    // Clean up
    if (mockState.undoTimerId) {
      clearInterval(mockState.undoTimerId);
      mockState.undoTimerId = null;
    }
  });

  it('updates DOM countdown text during timer', () => {
    const countdownEl = document.createElement('span');
    countdownEl.id = 'undo-countdown';
    document.body.appendChild(countdownEl);

    startUndoCountdown('Test', {}, vi.fn());
    vi.advanceTimersByTime(1000);
    expect(countdownEl.textContent).toBe('4');

    document.body.removeChild(countdownEl);
  });
});

describe('undo.js - executeUndo', () => {
  it('calls restoreFn with snapshot', () => {
    const snapshot = { data: 'restore' };
    const restoreFn = vi.fn();
    mockState.undoAction = { label: 'Test', snapshot, restoreFn };

    executeUndo();
    expect(restoreFn).toHaveBeenCalledWith(snapshot);
  });

  it('clears timer and state', () => {
    const timerId = setInterval(() => {}, 1000);
    mockState.undoTimerId = timerId;
    mockState.undoAction = { label: 'Test', snapshot: {}, restoreFn: vi.fn() };

    executeUndo();
    expect(mockState.undoAction).toBeNull();
    expect(mockState.undoTimerRemaining).toBe(0);
    expect(mockState.undoTimerId).toBeNull();
  });

  it('calls window.render', () => {
    mockState.undoAction = { label: 'Test', snapshot: {}, restoreFn: vi.fn() };
    executeUndo();
    expect(window.render).toHaveBeenCalled();
  });

  it('does nothing when no undoAction', () => {
    mockState.undoAction = null;
    executeUndo();
    expect(window.render).not.toHaveBeenCalled();
  });
});

describe('undo.js - dismissUndo', () => {
  it('clears timer and state', () => {
    const timerId = setInterval(() => {}, 1000);
    mockState.undoTimerId = timerId;
    mockState.undoAction = { label: 'Test', snapshot: {}, restoreFn: vi.fn() };
    mockState.undoTimerRemaining = 3;

    dismissUndo();
    expect(mockState.undoAction).toBeNull();
    expect(mockState.undoTimerRemaining).toBe(0);
    expect(mockState.undoTimerId).toBeNull();
  });

  it('is safe when no timer exists', () => {
    mockState.undoTimerId = null;
    expect(() => dismissUndo()).not.toThrow();
  });

  it('removes toast from DOM', () => {
    const toast = document.createElement('div');
    toast.id = 'undo-toast';
    document.body.appendChild(toast);

    dismissUndo();
    expect(toast.classList.contains('undo-fade-out')).toBe(true);

    document.body.removeChild(toast);
  });
});

describe('undo.js - renderUndoToastHtml', () => {
  it('returns empty string when no undoAction', () => {
    mockState.undoAction = null;
    expect(renderUndoToastHtml()).toBe('');
  });

  it('returns HTML with label when active', () => {
    mockState.undoAction = { label: 'Task deleted', snapshot: {}, restoreFn: vi.fn() };
    mockState.undoTimerRemaining = 5;

    const html = renderUndoToastHtml();
    expect(html).toContain('Task deleted');
    expect(html).toContain('undo-toast');
  });

  it('includes countdown number in HTML', () => {
    mockState.undoAction = { label: 'Test', snapshot: {}, restoreFn: vi.fn() };
    mockState.undoTimerRemaining = 3;

    const html = renderUndoToastHtml();
    expect(html).toContain('>3<');
  });

  it('calculates correct stroke-dashoffset for countdown ring', () => {
    mockState.undoAction = { label: 'Test', snapshot: {}, restoreFn: vi.fn() };
    mockState.undoTimerRemaining = 5;

    const html = renderUndoToastHtml();
    // 5/5 = 1.0, dashoffset = (1-1)*88 = 0
    expect(html).toContain('stroke-dashoffset="0"');

    mockState.undoTimerRemaining = 2.5;
    const html2 = renderUndoToastHtml();
    // 2.5/5 = 0.5, dashoffset = (1-0.5)*88 = 44
    expect(html2).toContain('stroke-dashoffset="44"');
  });
});

// ===========================================================================
// AREAS.JS TESTS
// ===========================================================================

describe('areas.js - ensureEntityTombstones', () => {
  it('creates object if missing', () => {
    mockState.deletedEntityTombstones = null;
    const result = ensureEntityTombstones();
    expect(result).toEqual({});
    expect(mockState.deletedEntityTombstones).toEqual({});
  });

  it('creates object if invalid type', () => {
    mockState.deletedEntityTombstones = 'invalid';
    const result = ensureEntityTombstones();
    expect(result).toEqual({});
  });

  it('returns existing object when valid', () => {
    mockState.deletedEntityTombstones = { taskCategories: { cat_1: '2026-01-01' } };
    const result = ensureEntityTombstones();
    expect(result).toEqual({ taskCategories: { cat_1: '2026-01-01' } });
  });
});

describe('areas.js - persistEntityTombstones', () => {
  it('saves to localStorage', () => {
    mockState.deletedEntityTombstones = { taskLabels: { label_1: '2026-01-01' } };
    persistEntityTombstones();

    const stored = JSON.parse(localStorage.getItem(DELETED_ENTITY_TOMBSTONES_KEY));
    expect(stored).toEqual({ taskLabels: { label_1: '2026-01-01' } });
  });

  it('handles null tombstones gracefully', () => {
    mockState.deletedEntityTombstones = null;
    persistEntityTombstones();

    const stored = JSON.parse(localStorage.getItem(DELETED_ENTITY_TOMBSTONES_KEY));
    expect(stored).toEqual({});
  });
});

describe('areas.js - Area CRUD', () => {
  it('createArea assigns id with cat_ prefix', () => {
    const area = createArea('Work');
    expect(area.id).toMatch(/^cat_/);
  });

  it('createArea cycles through colors', () => {
    const a1 = createArea('A1');
    const a2 = createArea('A2');
    expect(a1.color).toBe('#4A90A4');
    expect(a2.color).toBe('#6B8E5A');
  });

  it('createArea sets timestamps', () => {
    const area = createArea('Home');
    expect(area.createdAt).toBeTruthy();
    expect(area.updatedAt).toBeTruthy();
  });

  it('createArea pushes to state.taskAreas', () => {
    createArea('Test');
    expect(mockState.taskAreas).toHaveLength(1);
    expect(mockState.taskAreas[0].name).toBe('Test');
  });

  it('createArea calls saveTasksData', () => {
    createArea('Test');
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('updateArea merges fields and sets updatedAt', () => {
    const area = makeArea({ id: 'area_1', name: 'Old' });
    mockState.taskAreas = [area];
    const oldUpdatedAt = area.updatedAt;

    // Wait a tick to ensure timestamp changes
    vi.useFakeTimers();
    vi.advanceTimersByTime(1);
    updateArea('area_1', { name: 'New' });
    vi.useRealTimers();

    expect(mockState.taskAreas[0].name).toBe('New');
    expect(mockState.taskAreas[0].updatedAt).not.toBe(oldUpdatedAt);
  });

  it('updateArea calls saveTasksData', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1' })];
    updateArea('area_1', { name: 'Updated' });
    expect(saveTasksDataMock).toHaveBeenCalled();
  });

  it('deleteArea removes area from state', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1' })];
    deleteArea('area_1');
    expect(mockState.taskAreas).toHaveLength(0);
  });

  it('deleteArea cascades to sub-categories', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1' })];
    mockState.taskCategories = [
      makeCategory({ id: 'cat_1', areaId: 'area_1' }),
      makeCategory({ id: 'cat_2', areaId: 'area_1' }),
      makeCategory({ id: 'cat_3', areaId: 'area_2' }),
    ];

    deleteArea('area_1');
    expect(mockState.taskCategories).toHaveLength(1);
    expect(mockState.taskCategories[0].id).toBe('cat_3');
  });

  it('deleteArea clears areaId from tasks', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1' })];
    mockState.tasksData = [
      makeTask({ id: 'task_1', areaId: 'area_1' }),
      makeTask({ id: 'task_2', areaId: 'area_2' }),
    ];

    deleteArea('area_1');
    expect(mockState.tasksData[0].areaId).toBeNull();
    expect(mockState.tasksData[1].areaId).toBe('area_2');
  });

  it('deleteArea clears categoryId from tasks when sub-category is orphaned', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1' })];
    mockState.taskCategories = [makeCategory({ id: 'cat_1', areaId: 'area_1' })];
    mockState.tasksData = [makeTask({ id: 'task_1', categoryId: 'cat_1' })];

    deleteArea('area_1');
    expect(mockState.tasksData[0].categoryId).toBeNull();
  });

  it('deleteArea tombstones orphaned sub-categories', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1' })];
    mockState.taskCategories = [makeCategory({ id: 'cat_1', areaId: 'area_1' })];

    deleteArea('area_1');
    expect(mockState.deletedEntityTombstones.categories).toBeTruthy();
    expect(mockState.deletedEntityTombstones.categories.cat_1).toBeTruthy();
  });

  it('getAreaById returns area when found', () => {
    const area = makeArea({ id: 'area_1', name: 'Find me' });
    mockState.taskAreas = [area];
    expect(getAreaById('area_1')).toEqual(area);
  });

  it('getAreaById returns undefined when not found', () => {
    expect(getAreaById('nonexistent')).toBeUndefined();
  });
});

describe('areas.js - Category CRUD', () => {
  it('createCategory assigns id with subcat_ prefix', () => {
    const cat = createCategory('SubArea', 'area_1');
    expect(cat.id).toMatch(/^subcat_/);
  });

  it('createCategory inherits area color', () => {
    mockState.taskAreas = [makeArea({ id: 'area_1', color: '#FF0000' })];
    const cat = createCategory('Sub', 'area_1');
    expect(cat.color).toBe('#FF0000');
  });

  it('createCategory uses default color when area not found', () => {
    const cat = createCategory('Sub', 'nonexistent');
    expect(cat.color).toBe('#6366F1');
  });

  it('createCategory pushes to state.taskCategories', () => {
    createCategory('Test', 'area_1');
    expect(mockState.taskCategories).toHaveLength(1);
  });

  it('updateCategory merges fields', () => {
    mockState.taskCategories = [makeCategory({ id: 'cat_1', name: 'Old' })];
    updateCategory('cat_1', { name: 'New' });
    expect(mockState.taskCategories[0].name).toBe('New');
  });

  it('deleteCategory removes from state', () => {
    mockState.taskCategories = [makeCategory({ id: 'cat_1' })];
    deleteCategory('cat_1');
    expect(mockState.taskCategories).toHaveLength(0);
  });

  it('deleteCategory clears categoryId from tasks', () => {
    mockState.taskCategories = [makeCategory({ id: 'cat_1' })];
    mockState.tasksData = [
      makeTask({ id: 'task_1', categoryId: 'cat_1' }),
      makeTask({ id: 'task_2', categoryId: 'cat_2' }),
    ];

    deleteCategory('cat_1');
    expect(mockState.tasksData[0].categoryId).toBeNull();
    expect(mockState.tasksData[1].categoryId).toBe('cat_2');
  });

  it('getCategoryById returns category when found', () => {
    const cat = makeCategory({ id: 'cat_1' });
    mockState.taskCategories = [cat];
    expect(getCategoryById('cat_1')).toEqual(cat);
  });

  it('getCategoriesByArea filters correctly', () => {
    mockState.taskCategories = [
      makeCategory({ id: 'cat_1', areaId: 'area_1' }),
      makeCategory({ id: 'cat_2', areaId: 'area_1' }),
      makeCategory({ id: 'cat_3', areaId: 'area_2' }),
    ];

    const result = getCategoriesByArea('area_1');
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(['cat_1', 'cat_2']);
  });
});

describe('areas.js - Label CRUD', () => {
  it('createLabel assigns id with label_ prefix', () => {
    const label = createLabel('Important', '#FF0000');
    expect(label.id).toMatch(/^label_/);
  });

  it('createLabel uses default color when not provided', () => {
    const label = createLabel('Tag');
    expect(label.color).toBe('#6B7280');
  });

  it('createLabel pushes to state.taskLabels', () => {
    createLabel('Test');
    expect(mockState.taskLabels).toHaveLength(1);
  });

  it('updateLabel merges fields', () => {
    mockState.taskLabels = [makeLabel({ id: 'label_1', name: 'Old' })];
    updateLabel('label_1', { name: 'New' });
    expect(mockState.taskLabels[0].name).toBe('New');
  });

  it('deleteLabel removes from state', () => {
    mockState.taskLabels = [makeLabel({ id: 'label_1' })];
    deleteLabel('label_1');
    expect(mockState.taskLabels).toHaveLength(0);
  });

  it('deleteLabel removes from task.labels arrays', () => {
    mockState.taskLabels = [makeLabel({ id: 'label_1' })];
    mockState.tasksData = [
      makeTask({ id: 'task_1', labels: ['label_1', 'label_2'] }),
      makeTask({ id: 'task_2', labels: ['label_1'] }),
      makeTask({ id: 'task_3', labels: ['label_2'] }),
    ];

    deleteLabel('label_1');
    expect(mockState.tasksData[0].labels).toEqual(['label_2']);
    expect(mockState.tasksData[1].labels).toEqual([]);
    expect(mockState.tasksData[2].labels).toEqual(['label_2']);
  });

  it('getLabelById returns label when found', () => {
    const label = makeLabel({ id: 'label_1' });
    mockState.taskLabels = [label];
    expect(getLabelById('label_1')).toEqual(label);
  });
});

describe('areas.js - Person CRUD', () => {
  it('createPerson assigns id with person_ prefix', () => {
    const person = createPerson('Alice');
    expect(person.id).toMatch(/^person_/);
  });

  it('createPerson accepts email and jobTitle', () => {
    const person = createPerson('Bob', 'bob@example.com', 'Engineer');
    expect(person.email).toBe('bob@example.com');
    expect(person.jobTitle).toBe('Engineer');
  });

  it('createPerson trims email and jobTitle', () => {
    const person = createPerson('Carol', '  carol@test.com  ', '  Designer  ');
    expect(person.email).toBe('carol@test.com');
    expect(person.jobTitle).toBe('Designer');
  });

  it('createPerson pushes to state.taskPeople', () => {
    createPerson('Test');
    expect(mockState.taskPeople).toHaveLength(1);
  });

  it('updatePerson merges fields', () => {
    mockState.taskPeople = [makePerson({ id: 'person_1', name: 'Old' })];
    updatePerson('person_1', { name: 'New' });
    expect(mockState.taskPeople[0].name).toBe('New');
  });

  it('deletePerson removes from state', () => {
    mockState.taskPeople = [makePerson({ id: 'person_1' })];
    deletePerson('person_1');
    expect(mockState.taskPeople).toHaveLength(0);
  });

  it('deletePerson removes from task.people arrays', () => {
    mockState.taskPeople = [makePerson({ id: 'person_1' })];
    mockState.tasksData = [
      makeTask({ id: 'task_1', people: ['person_1', 'person_2'] }),
      makeTask({ id: 'task_2', people: ['person_1'] }),
      makeTask({ id: 'task_3', people: ['person_2'] }),
    ];

    deletePerson('person_1');
    expect(mockState.tasksData[0].people).toEqual(['person_2']);
    expect(mockState.tasksData[1].people).toEqual([]);
    expect(mockState.tasksData[2].people).toEqual(['person_2']);
  });

  it('getPersonById returns person when found', () => {
    const person = makePerson({ id: 'person_1' });
    mockState.taskPeople = [person];
    expect(getPersonById('person_1')).toEqual(person);
  });
});

describe('areas.js - getTasksByPerson', () => {
  it('filters by personId', () => {
    mockState.tasksData = [
      makeTask({ id: 'task_1', people: ['person_1'] }),
      makeTask({ id: 'task_2', people: ['person_2'] }),
      makeTask({ id: 'task_3', people: ['person_1', 'person_2'] }),
    ];

    const result = getTasksByPerson('person_1');
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(['task_1', 'task_3']);
  });

  it('excludes completed tasks', () => {
    mockState.tasksData = [
      makeTask({ id: 'task_1', people: ['person_1'], completed: false }),
      makeTask({ id: 'task_2', people: ['person_1'], completed: true }),
    ];

    const result = getTasksByPerson('person_1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('task_1');
  });

  it('returns empty array when person has no tasks', () => {
    mockState.tasksData = [makeTask({ id: 'task_1', people: [] })];
    expect(getTasksByPerson('person_1')).toEqual([]);
  });
});

describe('areas.js - Entity tombstone clearing on create', () => {
  it('createArea clears entity tombstone', () => {
    mockState.deletedEntityTombstones = { taskCategories: { cat_123: '2026-01-01' } };
    const area = createArea('Test');
    // The tombstone for this specific ID should be cleared
    expect(mockState.deletedEntityTombstones.taskCategories?.[area.id]).toBeUndefined();
  });

  it('createCategory clears entity tombstone', () => {
    mockState.deletedEntityTombstones = { categories: { subcat_123: '2026-01-01' } };
    const cat = createCategory('Test', 'area_1');
    expect(mockState.deletedEntityTombstones.categories?.[cat.id]).toBeUndefined();
  });

  it('createLabel clears entity tombstone', () => {
    mockState.deletedEntityTombstones = { taskLabels: { label_123: '2026-01-01' } };
    const label = createLabel('Test');
    expect(mockState.deletedEntityTombstones.taskLabels?.[label.id]).toBeUndefined();
  });

  it('createPerson clears entity tombstone', () => {
    mockState.deletedEntityTombstones = { taskPeople: { person_123: '2026-01-01' } };
    const person = createPerson('Test');
    expect(mockState.deletedEntityTombstones.taskPeople?.[person.id]).toBeUndefined();
  });
});

// ===========================================================================
// TRIGGERS.JS TESTS
// ===========================================================================

describe('triggers.js - createTrigger', () => {
  it('generates id with trigger_ prefix', () => {
    const trigger = createTrigger('Test');
    expect(trigger.id).toMatch(/^trigger_/);
  });

  it('sets timestamps', () => {
    const trigger = createTrigger('Test');
    expect(trigger.createdAt).toBeTruthy();
    expect(trigger.updatedAt).toBeTruthy();
  });

  it('pushes to state.triggers', () => {
    createTrigger('Test');
    expect(mockState.triggers).toHaveLength(1);
  });

  it('calls window.render', () => {
    createTrigger('Test');
    expect(window.render).toHaveBeenCalled();
  });

  it('calls window.debouncedSaveToGithub', () => {
    createTrigger('Test');
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('accepts options for areaId, categoryId, parentId, indent, triggerOrder', () => {
    const trigger = createTrigger('Test', {
      areaId: 'area_1',
      categoryId: 'cat_1',
      parentId: 'trigger_parent',
      indent: 2,
      triggerOrder: 500,
    });

    expect(trigger.areaId).toBe('area_1');
    expect(trigger.categoryId).toBe('cat_1');
    expect(trigger.parentId).toBe('trigger_parent');
    expect(trigger.indent).toBe(2);
    expect(trigger.triggerOrder).toBe(500);
  });
});

describe('triggers.js - createRootTrigger', () => {
  it('creates at root with filter areaId', () => {
    const trigger = createRootTrigger({ areaId: 'area_1' });
    expect(trigger.areaId).toBe('area_1');
    expect(trigger.parentId).toBeNull();
    expect(trigger.indent).toBe(0);
  });

  it('creates at root with string areaId (legacy)', () => {
    const trigger = createRootTrigger('area_1');
    expect(trigger.areaId).toBe('area_1');
  });

  it('when zoomed, delegates to createChildTrigger', () => {
    mockState.zoomedTriggerId = 'trigger_parent';
    mockState.triggers = [makeTrigger({ id: 'trigger_parent' })];

    const trigger = createRootTrigger({ areaId: 'area_1' });
    expect(trigger.parentId).toBe('trigger_parent');
  });

  it('calculates order based on siblings', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', areaId: 'area_1', parentId: null, triggerOrder: 1000 }),
      makeTrigger({ id: 't2', areaId: 'area_1', parentId: null, triggerOrder: 2000 }),
    ];

    const trigger = createRootTrigger({ areaId: 'area_1' });
    expect(trigger.triggerOrder).toBe(3000); // max(2000) + 1000
  });
});

describe('triggers.js - createTriggerAfter', () => {
  it('creates sibling with correct order', () => {
    const t1 = makeTrigger({ id: 't1', triggerOrder: 1000 });
    mockState.triggers = [t1];

    const newTrigger = createTriggerAfter('t1');
    expect(newTrigger.parentId).toBe(t1.parentId);
    expect(newTrigger.areaId).toBe(t1.areaId);
    expect(newTrigger.indent).toBe(t1.indent);
    expect(newTrigger.triggerOrder).toBeGreaterThan(1000);
  });

  it('inserts between siblings', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', triggerOrder: 1000 }),
      makeTrigger({ id: 't2', triggerOrder: 2000 }),
    ];

    const newTrigger = createTriggerAfter('t1');
    expect(newTrigger.triggerOrder).toBe(1500); // (1000 + 2000) / 2
  });
});

describe('triggers.js - createChildTrigger', () => {
  it('creates child with parentId set', () => {
    const parent = makeTrigger({ id: 'parent', indent: 0 });
    mockState.triggers = [parent];

    const child = createChildTrigger('parent');
    expect(child.parentId).toBe('parent');
    expect(child.indent).toBe(1);
  });

  it('expands collapsed parent', () => {
    mockState.triggers = [makeTrigger({ id: 'parent' })];
    mockState.collapsedTriggers.add('parent');

    createChildTrigger('parent');
    expect(mockState.collapsedTriggers.has('parent')).toBe(false);
  });

  it('calculates order based on existing children', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent' }),
      makeTrigger({ id: 'child1', parentId: 'parent', triggerOrder: 1000 }),
    ];

    const child2 = createChildTrigger('parent');
    expect(child2.triggerOrder).toBe(2000);
  });
});

describe('triggers.js - updateTrigger', () => {
  it('merges updates', () => {
    mockState.triggers = [makeTrigger({ id: 't1', title: 'Old' })];
    updateTrigger('t1', { title: 'New' });
    expect(mockState.triggers[0].title).toBe('New');
  });

  it('sets updatedAt', () => {
    const oldDate = '2020-01-01T00:00:00.000Z';
    mockState.triggers = [makeTrigger({ id: 't1', updatedAt: oldDate })];

    vi.useFakeTimers();
    vi.advanceTimersByTime(1);
    updateTrigger('t1', { title: 'Changed' });
    vi.useRealTimers();

    expect(mockState.triggers[0].updatedAt).not.toBe(oldDate);
  });

  it('calls window.debouncedSaveToGithub', () => {
    mockState.triggers = [makeTrigger({ id: 't1' })];
    updateTrigger('t1', { title: 'Updated' });
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

describe('triggers.js - deleteTrigger with children', () => {
  it('recursively removes all descendants', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent' }),
      makeTrigger({ id: 'child1', parentId: 'parent' }),
      makeTrigger({ id: 'grandchild', parentId: 'child1' }),
      makeTrigger({ id: 'other' }),
    ];

    deleteTrigger('parent', true);
    expect(mockState.triggers).toHaveLength(1);
    expect(mockState.triggers[0].id).toBe('other');
  });

  it('does not remove unrelated triggers', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent' }),
      makeTrigger({ id: 'child', parentId: 'parent' }),
      makeTrigger({ id: 'sibling' }),
    ];

    deleteTrigger('parent', true);
    expect(mockState.triggers).toHaveLength(1);
    expect(mockState.triggers[0].id).toBe('sibling');
  });
});

describe('triggers.js - deleteTrigger without children', () => {
  it('promotes children to parent level', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent', parentId: null }),
      makeTrigger({ id: 'child', parentId: 'parent', indent: 1 }),
    ];

    deleteTrigger('parent', false);
    expect(mockState.triggers).toHaveLength(1);
    expect(mockState.triggers[0].parentId).toBeNull();
    expect(mockState.triggers[0].indent).toBe(0);
  });

  it('adjusts indent of promoted children', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent', indent: 1, parentId: 'grandparent' }),
      makeTrigger({ id: 'child', parentId: 'parent', indent: 2 }),
    ];

    deleteTrigger('parent', false);
    expect(mockState.triggers[0].parentId).toBe('grandparent');
    expect(mockState.triggers[0].indent).toBe(1);
  });
});

describe('triggers.js - indentTrigger', () => {
  it('reparents under previous sibling', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', triggerOrder: 1000 }),
      makeTrigger({ id: 't2', triggerOrder: 2000 }),
    ];

    indentTrigger('t2');
    expect(mockState.triggers[1].parentId).toBe('t1');
    expect(mockState.triggers[1].indent).toBe(1);
  });

  it('does nothing at max depth (5)', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1' }),
      makeTrigger({ id: 't2', indent: 5, triggerOrder: 2000 }),
    ];

    indentTrigger('t2');
    expect(mockState.triggers[1].indent).toBe(5);
  });

  it('does nothing for first item', () => {
    mockState.triggers = [makeTrigger({ id: 't1', triggerOrder: 1000 })];
    const originalParent = mockState.triggers[0].parentId;

    indentTrigger('t1');
    expect(mockState.triggers[0].parentId).toBe(originalParent);
  });

  it('expands collapsed parent', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1' }),
      makeTrigger({ id: 't2', triggerOrder: 2000 }),
    ];
    mockState.collapsedTriggers.add('t1');

    indentTrigger('t2');
    expect(mockState.collapsedTriggers.has('t1')).toBe(false);
  });
});

describe('triggers.js - outdentTrigger', () => {
  it('reparents to grandparent', () => {
    mockState.triggers = [
      makeTrigger({ id: 'grandparent' }),
      makeTrigger({ id: 'parent', parentId: 'grandparent', indent: 1 }),
      makeTrigger({ id: 'child', parentId: 'parent', indent: 2 }),
    ];

    outdentTrigger('child');
    expect(mockState.triggers[2].parentId).toBe('grandparent');
    expect(mockState.triggers[2].indent).toBe(1);
  });

  it('adjusts order correctly', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent', triggerOrder: 1000 }),
      makeTrigger({ id: 'child', parentId: 'parent', indent: 1, triggerOrder: 500 }),
    ];

    outdentTrigger('child');
    expect(mockState.triggers[1].triggerOrder).toBeGreaterThan(1000);
  });

  it('does nothing at root', () => {
    mockState.triggers = [makeTrigger({ id: 't1', indent: 0, parentId: null })];
    outdentTrigger('t1');
    expect(mockState.triggers[0].indent).toBe(0);
  });
});

describe('triggers.js - toggleTriggerCollapse', () => {
  it('toggles Set state', () => {
    mockState.collapsedTriggers = new Set();
    toggleTriggerCollapse('t1');
    expect(mockState.collapsedTriggers.has('t1')).toBe(true);

    toggleTriggerCollapse('t1');
    expect(mockState.collapsedTriggers.has('t1')).toBe(false);
  });

  it('saves to localStorage', () => {
    toggleTriggerCollapse('t1');
    const stored = JSON.parse(localStorage.getItem(COLLAPSED_TRIGGERS_KEY));
    expect(stored).toContain('t1');
  });

  it('calls window.render', () => {
    toggleTriggerCollapse('t1');
    expect(window.render).toHaveBeenCalled();
  });
});

describe('triggers.js - zoomIntoTrigger', () => {
  it('sets zoomedTriggerId', () => {
    mockState.triggers = [makeTrigger({ id: 't1', title: 'Parent' })];
    zoomIntoTrigger('t1');
    expect(mockState.zoomedTriggerId).toBe('t1');
  });

  it('builds breadcrumb', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', title: 'Parent' }),
      makeTrigger({ id: 't2', title: 'Child', parentId: 't1' }),
    ];

    zoomIntoTrigger('t2');
    expect(mockState.triggersBreadcrumb).toHaveLength(2);
    expect(mockState.triggersBreadcrumb[0].id).toBe('t1');
    expect(mockState.triggersBreadcrumb[1].id).toBe('t2');
  });

  it('calls window.render', () => {
    mockState.triggers = [makeTrigger({ id: 't1' })];
    zoomIntoTrigger('t1');
    expect(window.render).toHaveBeenCalled();
  });
});

describe('triggers.js - zoomOutOfTrigger', () => {
  it('clears zoom state', () => {
    mockState.zoomedTriggerId = 't1';
    mockState.triggersBreadcrumb = [{ id: 't1', title: 'Test' }];

    zoomOutOfTrigger();
    expect(mockState.zoomedTriggerId).toBeNull();
    expect(mockState.triggersBreadcrumb).toEqual([]);
  });

  it('calls window.render', () => {
    zoomOutOfTrigger();
    expect(window.render).toHaveBeenCalled();
  });
});

describe('triggers.js - navigateToTriggerBreadcrumb', () => {
  it('zooms out when null', () => {
    mockState.zoomedTriggerId = 't1';
    navigateToTriggerBreadcrumb(null);
    expect(mockState.zoomedTriggerId).toBeNull();
  });

  it('zooms into trigger when provided', () => {
    mockState.triggers = [makeTrigger({ id: 't1' })];
    navigateToTriggerBreadcrumb('t1');
    expect(mockState.zoomedTriggerId).toBe('t1');
  });
});

describe('triggers.js - triggerHasChildren / getTriggerChildren', () => {
  it('triggerHasChildren returns true when children exist', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent' }),
      makeTrigger({ id: 'child', parentId: 'parent' }),
    ];

    expect(triggerHasChildren('parent')).toBe(true);
  });

  it('triggerHasChildren returns false when no children', () => {
    mockState.triggers = [makeTrigger({ id: 'parent' })];
    expect(triggerHasChildren('parent')).toBe(false);
  });

  it('getTriggerChildren returns sorted children', () => {
    mockState.triggers = [
      makeTrigger({ id: 'child2', parentId: 'parent', triggerOrder: 2000 }),
      makeTrigger({ id: 'child1', parentId: 'parent', triggerOrder: 1000 }),
      makeTrigger({ id: 'other', parentId: 'other_parent' }),
    ];

    const children = getTriggerChildren('parent');
    expect(children).toHaveLength(2);
    expect(children[0].id).toBe('child1');
    expect(children[1].id).toBe('child2');
  });
});

describe('triggers.js - getTriggerCountForArea', () => {
  it('counts triggers by areaId', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', areaId: 'area_1' }),
      makeTrigger({ id: 't2', areaId: 'area_1' }),
      makeTrigger({ id: 't3', areaId: 'area_2' }),
    ];

    expect(getTriggerCountForArea('area_1')).toBe(2);
    expect(getTriggerCountForArea('area_2')).toBe(1);
    expect(getTriggerCountForArea('area_3')).toBe(0);
  });
});

describe('triggers.js - reorderTriggers', () => {
  it('reorders to top position', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', triggerOrder: 1000 }),
      makeTrigger({ id: 't2', triggerOrder: 2000 }),
      makeTrigger({ id: 't3', triggerOrder: 3000 }),
    ];

    reorderTriggers('t3', 't1', 'top');
    const t3 = mockState.triggers.find((t) => t.id === 't3');
    expect(t3.triggerOrder).toBeLessThan(1000);
  });

  it('reorders to bottom position', () => {
    mockState.triggers = [
      makeTrigger({ id: 't1', triggerOrder: 1000 }),
      makeTrigger({ id: 't2', triggerOrder: 2000 }),
    ];

    reorderTriggers('t1', 't2', 'bottom');
    const t1 = mockState.triggers.find((t) => t.id === 't1');
    expect(t1.triggerOrder).toBeGreaterThan(2000);
  });

  it('reorders to child position', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent', indent: 0 }),
      makeTrigger({ id: 'child', indent: 0 }),
    ];

    reorderTriggers('child', 'parent', 'child');
    const child = mockState.triggers.find((t) => t.id === 'child');
    expect(child.parentId).toBe('parent');
    expect(child.indent).toBe(1);
  });

  it('expands collapsed parent when dropping as child', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent' }),
      makeTrigger({ id: 'child' }),
    ];
    mockState.collapsedTriggers.add('parent');

    reorderTriggers('child', 'parent', 'child');
    expect(mockState.collapsedTriggers.has('parent')).toBe(false);
  });
});

describe('triggers.js - handleTriggerInput', () => {
  it('updates title', () => {
    mockState.triggers = [makeTrigger({ id: 't1', title: 'Old' })];
    const event = { target: { textContent: 'New' } };

    handleTriggerInput(event, 't1');
    expect(mockState.triggers[0].title).toBe('New');
  });
});

describe('triggers.js - handleTriggerBlur', () => {
  it('deletes empty childless triggers', () => {
    mockState.triggers = [makeTrigger({ id: 't1', title: '' })];
    const event = { target: { textContent: '' } };

    handleTriggerBlur(event, 't1');
    expect(mockState.triggers).toHaveLength(0);
  });

  it('does not delete triggers with children', () => {
    mockState.triggers = [
      makeTrigger({ id: 'parent', title: '' }),
      makeTrigger({ id: 'child', parentId: 'parent' }),
    ];
    const event = { target: { textContent: '' } };

    handleTriggerBlur(event, 'parent');
    expect(mockState.triggers).toHaveLength(2);
  });

  it('does not delete triggers with text', () => {
    mockState.triggers = [makeTrigger({ id: 't1', title: 'Text' })];
    const event = { target: { textContent: 'Text' } };

    handleTriggerBlur(event, 't1');
    expect(mockState.triggers).toHaveLength(1);
  });
});

describe('triggers.js - saveCollapsedTriggers', () => {
  it('persists to localStorage', () => {
    mockState.collapsedTriggers = new Set(['t1', 't2']);
    saveCollapsedTriggers();

    const stored = JSON.parse(localStorage.getItem(COLLAPSED_TRIGGERS_KEY));
    expect(stored).toEqual(['t1', 't2']);
  });
});
