// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ---------------------------------------------------------------------------
const { mockState, MOCK_KEYS, MOCK_DEFAULT_DAY_DATA } = vi.hoisted(() => {
  const mockState = {
    allData: {},
    currentDate: '2026-02-12',
    tasksData: [],
    taskAreas: [],
    taskLabels: [],
    taskPeople: [],
    taskCategories: [],
    customPerspectives: [],
    triggers: [],
    homeWidgets: [],
    collapsedNotes: new Set(),
    activeTab: 'home',
    activeSubTab: 'dashboard',
    activePerspective: 'inbox',
    workspaceContentMode: 'both',
    activeFilterType: 'perspective',
    activeAreaFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    activeCategoryFilter: null,
    WEIGHTS: { prayer: { onTime: 5 } },
    MAX_SCORES: { prayer: 35 },
    scoresCache: new Map(),
    scoresCacheVersion: 0,
  };

  const MOCK_KEYS = {
    STORAGE_KEY: 'lifeGamificationData_v3',
    WEIGHTS_KEY: 'lifeGamificationWeights_v1',
    MAX_SCORES_KEY: 'lifeGamificationMaxScores',
    TASKS_KEY: 'lifeGamificationTasks',
    TASK_CATEGORIES_KEY: 'lifeGamificationTaskCategories',
    TASK_LABELS_KEY: 'lifeGamificationTaskLabels',
    TASK_PEOPLE_KEY: 'lifeGamificationTaskPeople',
    CATEGORIES_KEY: 'lifeGamificationCategories',
    PERSPECTIVES_KEY: 'lifeGamificationPerspectives',
    HOME_WIDGETS_KEY: 'lifeGamificationHomeWidgets',
    VIEW_STATE_KEY: 'lifeGamificationViewState',
    LAST_UPDATED_KEY: 'lastUpdated',
    COLLAPSED_NOTES_KEY: 'collapsedNotes',
    TRIGGERS_KEY: 'lifeGamificationTriggers',
  };

  const MOCK_DEFAULT_DAY_DATA = {
    prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
    glucose: { avg: '', tir: '', insulin: '' },
    whoop: { sleepPerf: '', recovery: '', strain: '', whoopAge: '' },
    libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
    family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
    habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' },
  };

  return { mockState, MOCK_KEYS, MOCK_DEFAULT_DAY_DATA };
});

// ---------------------------------------------------------------------------
// Mocks — factories reference only hoisted variables
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => ({
  STORAGE_KEY: MOCK_KEYS.STORAGE_KEY,
  WEIGHTS_KEY: MOCK_KEYS.WEIGHTS_KEY,
  MAX_SCORES_KEY: MOCK_KEYS.MAX_SCORES_KEY,
  TASKS_KEY: MOCK_KEYS.TASKS_KEY,
  TASK_CATEGORIES_KEY: MOCK_KEYS.TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY: MOCK_KEYS.TASK_LABELS_KEY,
  TASK_PEOPLE_KEY: MOCK_KEYS.TASK_PEOPLE_KEY,
  CATEGORIES_KEY: MOCK_KEYS.CATEGORIES_KEY,
  PERSPECTIVES_KEY: MOCK_KEYS.PERSPECTIVES_KEY,
  HOME_WIDGETS_KEY: MOCK_KEYS.HOME_WIDGETS_KEY,
  VIEW_STATE_KEY: MOCK_KEYS.VIEW_STATE_KEY,
  LAST_UPDATED_KEY: MOCK_KEYS.LAST_UPDATED_KEY,
  COLLAPSED_NOTES_KEY: MOCK_KEYS.COLLAPSED_NOTES_KEY,
  TRIGGERS_KEY: MOCK_KEYS.TRIGGERS_KEY,
  defaultDayData: MOCK_DEFAULT_DAY_DATA,
}));

vi.mock('../src/utils.js', () => ({
  getLocalDateString: vi.fn(() => '2026-02-12'),
}));

// ---------------------------------------------------------------------------
// Import module under test
// ---------------------------------------------------------------------------
import {
  saveData,
  getTodayData,
  updateData,
  saveTasksData,
  toggleDailyField,
  updateDailyField,
  saveViewState,
  saveWeights,
  saveMaxScores,
  saveHomeWidgets,
  saveCollapsedNotes,
} from '../src/data/storage.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
  mockState.allData = {};
  mockState.currentDate = '2026-02-12';
  mockState.tasksData = [];
  mockState.taskAreas = [{ id: 'a1', name: 'Personal' }];
  mockState.taskLabels = [{ id: 'l1', name: 'Urgent' }];
  mockState.taskPeople = [{ id: 'p1', name: 'Self' }];
  mockState.taskCategories = [{ id: 'c1', name: 'Work' }];
  mockState.customPerspectives = [{ id: 'persp1', name: 'Custom' }];
  mockState.triggers = [{ id: 't1', title: 'Trigger' }];
  mockState.homeWidgets = [{ id: 'w1', visible: true }];
  mockState.collapsedNotes = new Set(['note1', 'note2']);
  mockState.activeTab = 'home';
  mockState.activeSubTab = 'dashboard';
  mockState.activePerspective = 'inbox';
  mockState.workspaceContentMode = 'both';
  mockState.activeFilterType = 'perspective';
  mockState.activeAreaFilter = null;
  mockState.activeLabelFilter = null;
  mockState.activePersonFilter = null;
  mockState.activeCategoryFilter = null;
  mockState.WEIGHTS = { prayer: { onTime: 5 } };
  mockState.MAX_SCORES = { prayer: 35 };
  mockState.scoresCache = new Map([['key1', 'val1']]);
  mockState.scoresCacheVersion = 0;

  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.processGamification = vi.fn(() => null);
});

// ===========================================================================
// saveData
// ===========================================================================
describe('saveData', () => {
  it('writes allData to localStorage under STORAGE_KEY', () => {
    mockState.allData = { '2026-02-12': { prayers: { fajr: '1' } } };
    saveData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored).toEqual(mockState.allData);
  });

  it('writes LAST_UPDATED_KEY timestamp', () => {
    saveData();
    const ts = localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY);
    expect(ts).toBeTruthy();
    expect(Number(ts)).toBeGreaterThan(0);
  });

  it('handles empty allData', () => {
    mockState.allData = {};
    saveData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored).toEqual({});
  });
});

// ===========================================================================
// getTodayData
// ===========================================================================
describe('getTodayData', () => {
  it('returns existing data for current date', () => {
    const todayEntry = { prayers: { fajr: '1' }, _lastModified: '2026-02-12T00:00:00Z' };
    mockState.allData['2026-02-12'] = todayEntry;
    const result = getTodayData();
    expect(result).toBe(todayEntry);
  });

  it('returns a fresh default when no data exists for current date', () => {
    mockState.allData = {};
    const result = getTodayData();
    expect(result).toEqual(MOCK_DEFAULT_DAY_DATA);
  });

  it('returns a deep copy of defaultDayData (not a reference)', () => {
    mockState.allData = {};
    const a = getTodayData();
    const b = getTodayData();
    expect(a).not.toBe(b);
    a.prayers.fajr = 'modified';
    expect(b.prayers.fajr).toBe('');
  });
});

// ===========================================================================
// updateData
// ===========================================================================
describe('updateData', () => {
  it('sets a field on an existing category', () => {
    mockState.allData['2026-02-12'] = { prayers: { fajr: '' } };
    updateData('prayers', 'fajr', '1');
    expect(mockState.allData['2026-02-12'].prayers.fajr).toBe('1');
  });

  it('creates category object if missing', () => {
    mockState.allData['2026-02-12'] = {};
    updateData('newCat', 'field1', 42);
    expect(mockState.allData['2026-02-12'].newCat.field1).toBe(42);
  });

  it('creates entire day entry if no data exists', () => {
    mockState.allData = {};
    updateData('prayers', 'fajr', '1');
    expect(mockState.allData['2026-02-12']).toBeTruthy();
    expect(mockState.allData['2026-02-12'].prayers.fajr).toBe('1');
  });

  it('sets _lastModified timestamp', () => {
    updateData('prayers', 'fajr', '1');
    expect(mockState.allData['2026-02-12']._lastModified).toBeTruthy();
    const d = new Date(mockState.allData['2026-02-12']._lastModified);
    expect(d.getTime()).toBeGreaterThan(0);
  });

  it('saves to localStorage', () => {
    updateData('prayers', 'fajr', '1');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-12'].prayers.fajr).toBe('1');
  });

  it('calls debouncedSaveToGithub', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('calls render', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.render).toHaveBeenCalled();
  });

  it('calls processGamification when available', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.processGamification).toHaveBeenCalledWith('2026-02-12');
  });

  it('invalidates scores cache', () => {
    mockState.scoresCache.set('test', 'value');
    const vBefore = mockState.scoresCacheVersion;
    updateData('prayers', 'fajr', '1');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(vBefore + 1);
  });
});

// ===========================================================================
// saveTasksData
// ===========================================================================
describe('saveTasksData', () => {
  it('persists tasksData to TASKS_KEY', () => {
    mockState.tasksData = [{ id: 'task1', title: 'Test' }];
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(stored).toEqual([{ id: 'task1', title: 'Test' }]);
  });

  it('persists taskAreas to TASK_CATEGORIES_KEY', () => {
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_CATEGORIES_KEY));
    expect(stored).toEqual(mockState.taskAreas);
  });

  it('persists taskLabels to TASK_LABELS_KEY', () => {
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_LABELS_KEY));
    expect(stored).toEqual(mockState.taskLabels);
  });

  it('persists taskPeople to TASK_PEOPLE_KEY', () => {
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_PEOPLE_KEY));
    expect(stored).toEqual(mockState.taskPeople);
  });

  it('persists taskCategories to CATEGORIES_KEY', () => {
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.CATEGORIES_KEY));
    expect(stored).toEqual(mockState.taskCategories);
  });

  it('persists customPerspectives to PERSPECTIVES_KEY', () => {
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.PERSPECTIVES_KEY));
    expect(stored).toEqual(mockState.customPerspectives);
  });

  it('persists triggers to TRIGGERS_KEY', () => {
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TRIGGERS_KEY));
    expect(stored).toEqual(mockState.triggers);
  });

  it('does NOT update LAST_UPDATED_KEY', () => {
    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, '12345');
    saveTasksData();
    expect(localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY)).toBe('12345');
  });

  it('calls debouncedSaveToGithub', () => {
    saveTasksData();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

// ===========================================================================
// toggleDailyField
// ===========================================================================
describe('toggleDailyField', () => {
  it('toggles a boolean field from false to true', () => {
    mockState.allData['2026-02-12'] = { family: { mom: false } };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-12'].family.mom).toBe(true);
  });

  it('toggles a boolean field from true to false', () => {
    mockState.allData['2026-02-12'] = { family: { mom: true } };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-12'].family.mom).toBe(false);
  });

  it('toggles undefined to true (falsy to truthy)', () => {
    mockState.allData['2026-02-12'] = { family: {} };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-12'].family.mom).toBe(true);
  });

  it('creates date entry and category if missing', () => {
    mockState.allData = {};
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-12'].family.mom).toBe(true);
  });

  it('sets _lastModified', () => {
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-12']._lastModified).toBeTruthy();
  });

  it('saves to localStorage', () => {
    toggleDailyField('family', 'mom');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-12'].family.mom).toBe(true);
  });

  it('invalidates scores cache', () => {
    mockState.scoresCache.set('x', 'y');
    const vBefore = mockState.scoresCacheVersion;
    toggleDailyField('family', 'mom');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(vBefore + 1);
  });

  it('calls render and sync', () => {
    toggleDailyField('family', 'mom');
    expect(window.render).toHaveBeenCalled();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

// ===========================================================================
// updateDailyField
// ===========================================================================
describe('updateDailyField', () => {
  it('parses numeric string to number', () => {
    updateDailyField('glucose', 'avg', '105');
    expect(mockState.allData['2026-02-12'].glucose.avg).toBe(105);
  });

  it('stores float correctly', () => {
    updateDailyField('glucose', 'tir', '85.5');
    expect(mockState.allData['2026-02-12'].glucose.tir).toBe(85.5);
  });

  it('stores empty string as null', () => {
    updateDailyField('glucose', 'avg', '');
    expect(mockState.allData['2026-02-12'].glucose.avg).toBeNull();
  });

  it('stores non-numeric string as string', () => {
    updateDailyField('habits', 'nop', 'yes');
    expect(mockState.allData['2026-02-12'].habits.nop).toBe('yes');
  });

  it('creates date entry and category if missing', () => {
    mockState.allData = {};
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.allData['2026-02-12'].glucose.avg).toBe(100);
  });

  it('sets _lastModified', () => {
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.allData['2026-02-12']._lastModified).toBeTruthy();
  });

  it('invalidates scores cache', () => {
    const vBefore = mockState.scoresCacheVersion;
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.scoresCacheVersion).toBe(vBefore + 1);
  });

  it('calls render and sync', () => {
    updateDailyField('glucose', 'avg', '100');
    expect(window.render).toHaveBeenCalled();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

// ===========================================================================
// saveViewState
// ===========================================================================
describe('saveViewState', () => {
  it('persists current view state to localStorage', () => {
    mockState.activeTab = 'tasks';
    mockState.activePerspective = 'today';
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.activeTab).toBe('tasks');
    expect(stored.activePerspective).toBe('today');
  });

  it('sanitizes calendar perspective to inbox', () => {
    mockState.activePerspective = 'calendar';
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.activePerspective).toBe('inbox');
  });

  it('includes workspaceContentMode with fallback', () => {
    mockState.workspaceContentMode = undefined;
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.workspaceContentMode).toBe('both');
  });

  it('includes all filter fields', () => {
    mockState.activeFilterType = 'area';
    mockState.activeAreaFilter = 'a1';
    mockState.activeLabelFilter = 'l1';
    mockState.activePersonFilter = 'p1';
    mockState.activeCategoryFilter = 'c1';
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.activeFilterType).toBe('area');
    expect(stored.activeAreaFilter).toBe('a1');
    expect(stored.activeLabelFilter).toBe('l1');
    expect(stored.activePersonFilter).toBe('p1');
    expect(stored.activeCategoryFilter).toBe('c1');
  });
});

// ===========================================================================
// saveWeights / saveMaxScores
// ===========================================================================
describe('saveWeights', () => {
  it('persists WEIGHTS to localStorage', () => {
    mockState.WEIGHTS = { prayer: { onTime: 10 } };
    saveWeights();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.WEIGHTS_KEY));
    expect(stored).toEqual({ prayer: { onTime: 10 } });
  });
});

describe('saveMaxScores', () => {
  it('persists MAX_SCORES to localStorage', () => {
    mockState.MAX_SCORES = { prayer: 50, total: 200 };
    saveMaxScores();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.MAX_SCORES_KEY));
    expect(stored).toEqual({ prayer: 50, total: 200 });
  });
});

// ===========================================================================
// saveHomeWidgets
// ===========================================================================
describe('saveHomeWidgets (storage module)', () => {
  it('persists homeWidgets to localStorage', () => {
    mockState.homeWidgets = [{ id: 'w1', visible: true }];
    saveHomeWidgets();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.HOME_WIDGETS_KEY));
    expect(stored).toEqual([{ id: 'w1', visible: true }]);
  });
});

// ===========================================================================
// saveCollapsedNotes
// ===========================================================================
describe('saveCollapsedNotes', () => {
  it('persists collapsedNotes Set as array to localStorage', () => {
    mockState.collapsedNotes = new Set(['note1', 'note2']);
    saveCollapsedNotes();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.COLLAPSED_NOTES_KEY));
    expect(stored).toEqual(expect.arrayContaining(['note1', 'note2']));
    expect(stored.length).toBe(2);
  });

  it('handles empty Set', () => {
    mockState.collapsedNotes = new Set();
    saveCollapsedNotes();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.COLLAPSED_NOTES_KEY));
    expect(stored).toEqual([]);
  });
});
