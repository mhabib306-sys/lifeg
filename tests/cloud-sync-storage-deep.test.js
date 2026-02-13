// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ---------------------------------------------------------------------------
const { mockState, MOCK_KEYS, MOCK_DEFAULT_DAY_DATA } = vi.hoisted(() => {
  const mockState = {
    allData: {},
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    homeWidgets: [],
    triggers: [],
    currentDate: '2026-02-13',
    WEIGHTS: {},
    MAX_SCORES: {},
    activeTab: 'home',
    activeSubTab: null,
    activePerspective: 'inbox',
    workspaceContentMode: 'both',
    activeFilterType: null,
    activeAreaFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    activeCategoryFilter: null,
    collapsedNotes: new Set(),
    scoresCache: new Map(),
    scoresCacheVersion: 0,
    undoAction: null,
    undoTimerRemaining: 0,
    undoTimerId: null,
    xp: { total: 0, history: [] },
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
  getLocalDateString: vi.fn(() => '2026-02-13'),
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
function resetState() {
  mockState.allData = {};
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
  mockState.activeSubTab = null;
  mockState.activePerspective = 'inbox';
  mockState.workspaceContentMode = 'both';
  mockState.activeFilterType = null;
  mockState.activeAreaFilter = null;
  mockState.activeLabelFilter = null;
  mockState.activePersonFilter = null;
  mockState.activeCategoryFilter = null;
  mockState.WEIGHTS = { prayer: { onTime: 5 } };
  mockState.MAX_SCORES = { prayer: 35 };
  mockState.scoresCache = new Map([['key1', 'val1']]);
  mockState.scoresCacheVersion = 0;
  mockState.currentDate = '2026-02-13';
  mockState.undoAction = null;
  mockState.undoTimerRemaining = 0;
  mockState.undoTimerId = null;
  mockState.xp = { total: 0, history: [] };
}

beforeEach(() => {
  localStorage.clear();
  resetState();
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.processGamification = vi.fn(() => null);
  window.getLevelInfo = vi.fn();
  window.markAchievementNotified = vi.fn();
});

// ===========================================================================
// saveData — deep tests
// ===========================================================================
describe('saveData', () => {
  it('writes state.allData to STORAGE_KEY as JSON', () => {
    mockState.allData = { '2026-02-13': { prayers: { fajr: '1' } } };
    saveData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored).toEqual({ '2026-02-13': { prayers: { fajr: '1' } } });
  });

  it('sets LAST_UPDATED_KEY to current timestamp as number string', () => {
    const before = Date.now();
    saveData();
    const after = Date.now();
    const ts = Number(localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY));
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });

  it('LAST_UPDATED_KEY is a raw string, not JSON-encoded', () => {
    saveData();
    const raw = localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY);
    // Should NOT start with a quote (not JSON.stringify'd)
    expect(raw.startsWith('"')).toBe(false);
    expect(Number(raw)).toBeGreaterThan(0);
  });

  it('handles empty allData gracefully', () => {
    mockState.allData = {};
    saveData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored).toEqual({});
  });

  it('overwrites previous data completely', () => {
    mockState.allData = { '2026-02-10': { prayers: {} } };
    saveData();
    mockState.allData = { '2026-02-13': { habits: {} } };
    saveData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored).toEqual({ '2026-02-13': { habits: {} } });
    expect(stored['2026-02-10']).toBeUndefined();
  });

  it('handles large allData object', () => {
    const bigData = {};
    for (let i = 0; i < 365; i++) {
      const d = new Date(2026, 0, i + 1);
      const key = d.toISOString().split('T')[0];
      bigData[key] = { prayers: { fajr: '1', dhuhr: '1' }, habits: { exercise: 1 } };
    }
    mockState.allData = bigData;
    saveData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(Object.keys(stored).length).toBe(365);
  });

  it('QuotaExceededError is caught gracefully (does not throw)', () => {
    const origSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      const err = new DOMException('Quota exceeded', 'QuotaExceededError');
      Object.defineProperty(err, 'name', { value: 'QuotaExceededError' });
      throw err;
    });
    expect(() => saveData()).not.toThrow();
    localStorage.setItem = origSetItem;
  });
});

// ===========================================================================
// saveTasksData — deep tests
// ===========================================================================
describe('saveTasksData', () => {
  it('writes ALL collections to localStorage', () => {
    mockState.tasksData = [{ id: 'task1', title: 'Test' }];
    mockState.taskAreas = [{ id: 'a1', name: 'Area' }];
    mockState.taskLabels = [{ id: 'l1', name: 'Label' }];
    mockState.taskPeople = [{ id: 'p1', name: 'Person' }];
    mockState.taskCategories = [{ id: 'c1', name: 'Cat' }];
    mockState.customPerspectives = [{ id: 'cp1', name: 'Custom' }];
    mockState.triggers = [{ id: 't1', title: 'Trig' }];

    saveTasksData();

    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY))).toEqual(mockState.tasksData);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_CATEGORIES_KEY))).toEqual(mockState.taskAreas);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_LABELS_KEY))).toEqual(mockState.taskLabels);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_PEOPLE_KEY))).toEqual(mockState.taskPeople);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.CATEGORIES_KEY))).toEqual(mockState.taskCategories);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.PERSPECTIVES_KEY))).toEqual(mockState.customPerspectives);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TRIGGERS_KEY))).toEqual(mockState.triggers);
  });

  it('does NOT set LAST_UPDATED_KEY', () => {
    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, '99999');
    saveTasksData();
    expect(localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY)).toBe('99999');
  });

  it('does NOT overwrite existing LAST_UPDATED_KEY with new value', () => {
    const before = Date.now().toString();
    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, before);
    saveTasksData();
    expect(localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY)).toBe(before);
  });

  it('calls debouncedSaveToGithub', () => {
    saveTasksData();
    expect(window.debouncedSaveToGithub).toHaveBeenCalledTimes(1);
  });

  it('does NOT call render', () => {
    saveTasksData();
    expect(window.render).not.toHaveBeenCalled();
  });

  it('handles empty arrays gracefully', () => {
    mockState.tasksData = [];
    mockState.taskAreas = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.taskCategories = [];
    mockState.customPerspectives = [];
    mockState.triggers = [];
    saveTasksData();
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY))).toEqual([]);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_CATEGORIES_KEY))).toEqual([]);
  });

  it('persists complex task objects with all metadata', () => {
    mockState.tasksData = [{
      id: 'task_complex',
      title: 'Complex task',
      status: 'anytime',
      today: true,
      flagged: true,
      areaId: 'a1',
      categoryId: 'c1',
      labels: ['l1', 'l2'],
      people: ['p1'],
      notes: 'Very detailed notes',
      dueDate: '2026-03-01',
      deferDate: '2026-02-20',
      repeat: { type: 'weekly', interval: 1 },
      order: 5,
    }];
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(stored[0].id).toBe('task_complex');
    expect(stored[0].labels).toEqual(['l1', 'l2']);
    expect(stored[0].repeat.type).toBe('weekly');
    expect(stored[0].notes).toBe('Very detailed notes');
  });

  it('preserves task ordering across save', () => {
    mockState.tasksData = [
      { id: 't1', title: 'First', order: 0 },
      { id: 't2', title: 'Second', order: 1 },
      { id: 't3', title: 'Third', order: 2 },
    ];
    saveTasksData();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(stored[0].order).toBe(0);
    expect(stored[1].order).toBe(1);
    expect(stored[2].order).toBe(2);
  });
});

// ===========================================================================
// updateData — deep tests
// ===========================================================================
describe('updateData', () => {
  it('creates missing date entry when allData is empty', () => {
    mockState.allData = {};
    updateData('prayers', 'fajr', '1');
    expect(mockState.allData['2026-02-13']).toBeTruthy();
    expect(mockState.allData['2026-02-13'].prayers.fajr).toBe('1');
  });

  it('creates missing category object on existing date entry', () => {
    mockState.allData['2026-02-13'] = {};
    updateData('newCategory', 'field1', 42);
    expect(mockState.allData['2026-02-13'].newCategory.field1).toBe(42);
  });

  it('sets _lastModified to valid ISO timestamp', () => {
    updateData('prayers', 'fajr', '1');
    const ts = mockState.allData['2026-02-13']._lastModified;
    expect(ts).toBeTruthy();
    const d = new Date(ts);
    expect(d.getTime()).toBeGreaterThan(0);
    expect(ts).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('calls saveData which writes to localStorage', () => {
    updateData('prayers', 'fajr', '1');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-13'].prayers.fajr).toBe('1');
  });

  it('calls debouncedSaveToGithub exactly once', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.debouncedSaveToGithub).toHaveBeenCalledTimes(1);
  });

  it('calls render exactly once', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.render).toHaveBeenCalledTimes(1);
  });

  it('invalidates scores cache — clears map', () => {
    mockState.scoresCache.set('existing', 'cached');
    updateData('prayers', 'fajr', '1');
    expect(mockState.scoresCache.size).toBe(0);
  });

  it('invalidates scores cache — increments version', () => {
    const vBefore = mockState.scoresCacheVersion;
    updateData('prayers', 'fajr', '1');
    expect(mockState.scoresCacheVersion).toBe(vBefore + 1);
  });

  it('calls processGamification with currentDate', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.processGamification).toHaveBeenCalledWith('2026-02-13');
  });

  it('does not throw when processGamification is not a function', () => {
    window.processGamification = undefined;
    expect(() => updateData('prayers', 'fajr', '1')).not.toThrow();
  });

  it('updates a field without overwriting other fields', () => {
    mockState.allData['2026-02-13'] = { prayers: { fajr: '1', dhuhr: '0.1' }, habits: { exercise: 1 } };
    updateData('prayers', 'dhuhr', '1');
    expect(mockState.allData['2026-02-13'].prayers.fajr).toBe('1');
    expect(mockState.allData['2026-02-13'].prayers.dhuhr).toBe('1');
    expect(mockState.allData['2026-02-13'].habits.exercise).toBe(1);
  });

  it('handles setting value to null', () => {
    updateData('glucose', 'avg', null);
    expect(mockState.allData['2026-02-13'].glucose.avg).toBeNull();
  });

  it('handles setting value to zero', () => {
    updateData('habits', 'exercise', 0);
    expect(mockState.allData['2026-02-13'].habits.exercise).toBe(0);
  });

  it('handles setting boolean values', () => {
    updateData('family', 'mom', true);
    expect(mockState.allData['2026-02-13'].family.mom).toBe(true);
  });

  it('LAST_UPDATED_KEY is set after saveData call', () => {
    updateData('prayers', 'fajr', '1');
    const ts = localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY);
    expect(Number(ts)).toBeGreaterThan(0);
  });
});

// ===========================================================================
// toggleDailyField — deep tests
// ===========================================================================
describe('toggleDailyField', () => {
  it('toggles false to true', () => {
    mockState.allData['2026-02-13'] = { family: { mom: false } };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13'].family.mom).toBe(true);
  });

  it('toggles true to false', () => {
    mockState.allData['2026-02-13'] = { family: { mom: true } };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13'].family.mom).toBe(false);
  });

  it('toggles undefined (falsy) to true', () => {
    mockState.allData['2026-02-13'] = { family: {} };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13'].family.mom).toBe(true);
  });

  it('creates date entry when allData is empty', () => {
    mockState.allData = {};
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13']).toBeTruthy();
    expect(mockState.allData['2026-02-13'].family.mom).toBe(true);
  });

  it('creates category when date entry exists but category does not', () => {
    mockState.allData['2026-02-13'] = {};
    toggleDailyField('family', 'dad');
    expect(mockState.allData['2026-02-13'].family.dad).toBe(true);
  });

  it('sets _lastModified timestamp', () => {
    toggleDailyField('family', 'mom');
    const ts = mockState.allData['2026-02-13']._lastModified;
    expect(ts).toBeTruthy();
    expect(new Date(ts).getTime()).toBeGreaterThan(0);
  });

  it('invalidates scores cache', () => {
    mockState.scoresCache.set('cached', 'value');
    const vBefore = mockState.scoresCacheVersion;
    toggleDailyField('family', 'mom');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(vBefore + 1);
  });

  it('saves to localStorage via saveData', () => {
    toggleDailyField('family', 'mom');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-13'].family.mom).toBe(true);
  });

  it('calls debouncedSaveToGithub', () => {
    toggleDailyField('family', 'mom');
    expect(window.debouncedSaveToGithub).toHaveBeenCalledTimes(1);
  });

  it('calls render', () => {
    toggleDailyField('family', 'mom');
    expect(window.render).toHaveBeenCalledTimes(1);
  });

  it('calls processGamification', () => {
    toggleDailyField('family', 'mom');
    expect(window.processGamification).toHaveBeenCalledWith('2026-02-13');
  });

  it('does not affect other fields when toggling', () => {
    mockState.allData['2026-02-13'] = { family: { mom: true, dad: true, jana: false } };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13'].family.mom).toBe(false);
    expect(mockState.allData['2026-02-13'].family.dad).toBe(true);
    expect(mockState.allData['2026-02-13'].family.jana).toBe(false);
  });

  it('double toggle restores original value', () => {
    mockState.allData['2026-02-13'] = { family: { mom: false } };
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13'].family.mom).toBe(true);
    toggleDailyField('family', 'mom');
    expect(mockState.allData['2026-02-13'].family.mom).toBe(false);
  });
});

// ===========================================================================
// updateDailyField — deep tests
// ===========================================================================
describe('updateDailyField', () => {
  it('parses integer string to number', () => {
    updateDailyField('glucose', 'avg', '105');
    expect(mockState.allData['2026-02-13'].glucose.avg).toBe(105);
  });

  it('parses float string to number', () => {
    updateDailyField('glucose', 'tir', '85.5');
    expect(mockState.allData['2026-02-13'].glucose.tir).toBe(85.5);
  });

  it('empty string becomes null', () => {
    updateDailyField('glucose', 'avg', '');
    expect(mockState.allData['2026-02-13'].glucose.avg).toBeNull();
  });

  it('non-numeric string stored as string', () => {
    updateDailyField('habits', 'nop', 'yes');
    expect(mockState.allData['2026-02-13'].habits.nop).toBe('yes');
  });

  it('string "NaN" is stored as string (not parsed to NaN)', () => {
    updateDailyField('habits', 'nop', 'NaN');
    expect(mockState.allData['2026-02-13'].habits.nop).toBe('NaN');
  });

  it('zero string "0" is parsed as number 0', () => {
    updateDailyField('habits', 'exercise', '0');
    expect(mockState.allData['2026-02-13'].habits.exercise).toBe(0);
  });

  it('negative number string is parsed correctly', () => {
    updateDailyField('glucose', 'avg', '-5');
    expect(mockState.allData['2026-02-13'].glucose.avg).toBe(-5);
  });

  it('creates date entry when none exists', () => {
    mockState.allData = {};
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.allData['2026-02-13']).toBeTruthy();
    expect(mockState.allData['2026-02-13'].glucose.avg).toBe(100);
  });

  it('creates category when it does not exist', () => {
    mockState.allData['2026-02-13'] = {};
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.allData['2026-02-13'].glucose.avg).toBe(100);
  });

  it('sets _lastModified', () => {
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.allData['2026-02-13']._lastModified).toBeTruthy();
  });

  it('invalidates scores cache', () => {
    mockState.scoresCache.set('key', 'val');
    const vBefore = mockState.scoresCacheVersion;
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(vBefore + 1);
  });

  it('calls debouncedSaveToGithub', () => {
    updateDailyField('glucose', 'avg', '100');
    expect(window.debouncedSaveToGithub).toHaveBeenCalledTimes(1);
  });

  it('calls render', () => {
    updateDailyField('glucose', 'avg', '100');
    expect(window.render).toHaveBeenCalledTimes(1);
  });

  it('calls processGamification with today date', () => {
    updateDailyField('glucose', 'avg', '100');
    expect(window.processGamification).toHaveBeenCalledWith('2026-02-13');
  });

  it('saves to localStorage', () => {
    updateDailyField('glucose', 'avg', '100');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-13'].glucose.avg).toBe(100);
  });

  it('does not overwrite existing fields in same category', () => {
    mockState.allData['2026-02-13'] = { glucose: { avg: 90, tir: 80 } };
    updateDailyField('glucose', 'avg', '105');
    expect(mockState.allData['2026-02-13'].glucose.avg).toBe(105);
    expect(mockState.allData['2026-02-13'].glucose.tir).toBe(80);
  });

  it('handles string with leading/trailing spaces that parse to number', () => {
    // parseFloat(' 42 ') returns 42 in JS
    updateDailyField('glucose', 'avg', ' 42 ');
    // parseFloat(' 42 ') = 42, which is not NaN, so stored as number
    expect(mockState.allData['2026-02-13'].glucose.avg).toBe(42);
  });
});

// ===========================================================================
// getTodayData — deep tests
// ===========================================================================
describe('getTodayData', () => {
  it('returns existing data for current date', () => {
    const todayEntry = { prayers: { fajr: '1' }, _lastModified: '2026-02-13T00:00:00Z' };
    mockState.allData['2026-02-13'] = todayEntry;
    const result = getTodayData();
    expect(result).toBe(todayEntry); // same reference
  });

  it('returns fresh default when no data exists', () => {
    mockState.allData = {};
    const result = getTodayData();
    expect(result).toEqual(MOCK_DEFAULT_DAY_DATA);
  });

  it('returns a deep copy of default — not a reference to the constant', () => {
    mockState.allData = {};
    const a = getTodayData();
    const b = getTodayData();
    expect(a).not.toBe(b);
  });

  it('deep copy verification — modifying one copy does not affect the next', () => {
    mockState.allData = {};
    const a = getTodayData();
    a.prayers.fajr = 'modified';
    const b = getTodayData();
    expect(b.prayers.fajr).toBe('');
  });

  it('deep copy includes all default categories', () => {
    mockState.allData = {};
    const result = getTodayData();
    expect(result).toHaveProperty('prayers');
    expect(result).toHaveProperty('glucose');
    expect(result).toHaveProperty('whoop');
    expect(result).toHaveProperty('libre');
    expect(result).toHaveProperty('family');
    expect(result).toHaveProperty('habits');
  });

  it('returns existing data even if it has extra fields', () => {
    mockState.allData['2026-02-13'] = {
      prayers: { fajr: '1' },
      _lastModified: '2026-02-13T10:00:00Z',
      customField: 'extra',
    };
    const result = getTodayData();
    expect(result.customField).toBe('extra');
  });
});

// ===========================================================================
// saveViewState — deep tests
// ===========================================================================
describe('saveViewState', () => {
  it('persists activeTab and activePerspective', () => {
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

  it('includes workspaceContentMode with fallback to both', () => {
    mockState.workspaceContentMode = undefined;
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.workspaceContentMode).toBe('both');
  });

  it('saves all filter fields correctly', () => {
    mockState.activeFilterType = 'label';
    mockState.activeAreaFilter = 'a1';
    mockState.activeLabelFilter = 'l1';
    mockState.activePersonFilter = 'p1';
    mockState.activeCategoryFilter = 'c1';
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.activeFilterType).toBe('label');
    expect(stored.activeAreaFilter).toBe('a1');
    expect(stored.activeLabelFilter).toBe('l1');
    expect(stored.activePersonFilter).toBe('p1');
    expect(stored.activeCategoryFilter).toBe('c1');
  });

  it('includes activeSubTab', () => {
    mockState.activeSubTab = 'dashboard';
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.activeSubTab).toBe('dashboard');
  });

  it('handles null filter values', () => {
    mockState.activeAreaFilter = null;
    mockState.activeLabelFilter = null;
    saveViewState();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY));
    expect(stored.activeAreaFilter).toBeNull();
    expect(stored.activeLabelFilter).toBeNull();
  });
});

// ===========================================================================
// saveWeights / saveMaxScores — deep tests
// ===========================================================================
describe('saveWeights', () => {
  it('persists WEIGHTS to WEIGHTS_KEY as JSON', () => {
    mockState.WEIGHTS = { prayer: { onTime: 10, late: 3 }, glucose: { avgMax: 15 } };
    saveWeights();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.WEIGHTS_KEY));
    expect(stored.prayer.onTime).toBe(10);
    expect(stored.glucose.avgMax).toBe(15);
  });

  it('handles empty weights', () => {
    mockState.WEIGHTS = {};
    saveWeights();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.WEIGHTS_KEY));
    expect(stored).toEqual({});
  });
});

describe('saveMaxScores', () => {
  it('persists MAX_SCORES to MAX_SCORES_KEY as JSON', () => {
    mockState.MAX_SCORES = { prayer: 50, diabetes: 30, total: 200 };
    saveMaxScores();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.MAX_SCORES_KEY));
    expect(stored).toEqual({ prayer: 50, diabetes: 30, total: 200 });
  });
});

// ===========================================================================
// saveHomeWidgets — deep tests
// ===========================================================================
describe('saveHomeWidgets', () => {
  it('persists homeWidgets array to localStorage', () => {
    mockState.homeWidgets = [
      { id: 'quick-stats', visible: true, order: 0 },
      { id: 'weather', visible: false, order: 1 },
    ];
    saveHomeWidgets();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.HOME_WIDGETS_KEY));
    expect(stored).toEqual(mockState.homeWidgets);
  });

  it('handles empty array', () => {
    mockState.homeWidgets = [];
    saveHomeWidgets();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.HOME_WIDGETS_KEY));
    expect(stored).toEqual([]);
  });
});

// ===========================================================================
// saveCollapsedNotes — deep tests
// ===========================================================================
describe('saveCollapsedNotes', () => {
  it('serializes Set as JSON array', () => {
    mockState.collapsedNotes = new Set(['note1', 'note2', 'note3']);
    saveCollapsedNotes();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.COLLAPSED_NOTES_KEY));
    expect(stored).toHaveLength(3);
    expect(stored).toContain('note1');
    expect(stored).toContain('note2');
    expect(stored).toContain('note3');
  });

  it('handles empty Set', () => {
    mockState.collapsedNotes = new Set();
    saveCollapsedNotes();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.COLLAPSED_NOTES_KEY));
    expect(stored).toEqual([]);
  });
});

// ===========================================================================
// Sync chain verification
// ===========================================================================
describe('sync chain verification', () => {
  it('updateData triggers both saveData (localStorage) and debouncedSaveToGithub', () => {
    updateData('prayers', 'fajr', '1');
    // saveData writes to localStorage
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-13'].prayers.fajr).toBe('1');
    // debouncedSaveToGithub is called for cloud sync
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('toggleDailyField triggers both saveData (localStorage) and debouncedSaveToGithub', () => {
    toggleDailyField('family', 'mom');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-13'].family.mom).toBe(true);
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('updateDailyField triggers both saveData (localStorage) and debouncedSaveToGithub', () => {
    updateDailyField('glucose', 'avg', '110');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored['2026-02-13'].glucose.avg).toBe(110);
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('saveTasksData calls debouncedSaveToGithub but NOT LAST_UPDATED_KEY', () => {
    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, 'original');
    saveTasksData();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
    expect(localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY)).toBe('original');
  });

  it('updateData sets LAST_UPDATED_KEY (via saveData) but saveTasksData does not', () => {
    // updateData path
    updateData('prayers', 'fajr', '1');
    const ts1 = localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY);
    expect(ts1).toBeTruthy();

    // Clear and saveTasksData path
    localStorage.removeItem(MOCK_KEYS.LAST_UPDATED_KEY);
    saveTasksData();
    expect(localStorage.getItem(MOCK_KEYS.LAST_UPDATED_KEY)).toBeNull();
  });

  it('updateData, toggleDailyField, and updateDailyField all invalidate scores cache', () => {
    // updateData
    mockState.scoresCache.set('a', 1);
    mockState.scoresCacheVersion = 0;
    updateData('prayers', 'fajr', '1');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(1);

    // toggleDailyField
    mockState.scoresCache.set('b', 2);
    toggleDailyField('family', 'mom');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(2);

    // updateDailyField
    mockState.scoresCache.set('c', 3);
    updateDailyField('glucose', 'avg', '100');
    expect(mockState.scoresCache.size).toBe(0);
    expect(mockState.scoresCacheVersion).toBe(3);
  });

  it('saveTasksData does NOT invalidate scores cache', () => {
    mockState.scoresCache.clear();
    mockState.scoresCache.set('cached', 'value');
    const vBefore = mockState.scoresCacheVersion;
    saveTasksData();
    expect(mockState.scoresCache.size).toBe(1);
    expect(mockState.scoresCacheVersion).toBe(vBefore);
  });

  it('all data-mutating functions call render (updateData, toggleDailyField, updateDailyField)', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.render).toHaveBeenCalledTimes(1);

    toggleDailyField('family', 'mom');
    expect(window.render).toHaveBeenCalledTimes(2);

    updateDailyField('glucose', 'avg', '100');
    expect(window.render).toHaveBeenCalledTimes(3);
  });

  it('saveTasksData does not call render', () => {
    saveTasksData();
    expect(window.render).not.toHaveBeenCalled();
  });

  it('all data-mutating functions call processGamification', () => {
    updateData('prayers', 'fajr', '1');
    expect(window.processGamification).toHaveBeenCalledTimes(1);

    toggleDailyField('family', 'mom');
    expect(window.processGamification).toHaveBeenCalledTimes(2);

    updateDailyField('glucose', 'avg', '100');
    expect(window.processGamification).toHaveBeenCalledTimes(3);
  });

  it('order of operations: cache invalidation before save', () => {
    const callOrder = [];
    // Track when debouncedSaveToGithub is called vs cache version
    window.debouncedSaveToGithub = vi.fn(() => {
      callOrder.push({ action: 'github', cacheVersion: mockState.scoresCacheVersion, cacheSize: mockState.scoresCache.size });
    });

    mockState.scoresCache.set('test', 'val');
    mockState.scoresCacheVersion = 10;
    updateData('prayers', 'fajr', '1');

    // Cache should already be invalidated when github sync is called
    expect(callOrder[0].cacheVersion).toBe(11);
    expect(callOrder[0].cacheSize).toBe(0);
  });
});

// ===========================================================================
// localStorage persistence integrity
// ===========================================================================
describe('localStorage persistence integrity', () => {
  it('saveData writes valid JSON that can be re-parsed', () => {
    mockState.allData = {
      '2026-02-13': {
        prayers: { fajr: '1', dhuhr: '0.1' },
        family: { mom: true, dad: false },
        _lastModified: '2026-02-13T10:00:00Z',
      },
    };
    saveData();
    const stored = localStorage.getItem(MOCK_KEYS.STORAGE_KEY);
    const parsed = JSON.parse(stored);
    expect(parsed['2026-02-13'].prayers.fajr).toBe('1');
    expect(parsed['2026-02-13'].family.mom).toBe(true);
  });

  it('saveTasksData writes valid JSON for all collections', () => {
    mockState.tasksData = [{ id: 't1', title: 'Task' }];
    mockState.taskAreas = [{ id: 'a1', name: 'Area' }];
    saveTasksData();

    // All keys should have valid JSON
    const keys = [
      MOCK_KEYS.TASKS_KEY,
      MOCK_KEYS.TASK_CATEGORIES_KEY,
      MOCK_KEYS.TASK_LABELS_KEY,
      MOCK_KEYS.TASK_PEOPLE_KEY,
      MOCK_KEYS.CATEGORIES_KEY,
      MOCK_KEYS.PERSPECTIVES_KEY,
      MOCK_KEYS.TRIGGERS_KEY,
    ];
    keys.forEach(key => {
      const raw = localStorage.getItem(key);
      expect(raw).toBeTruthy();
      expect(() => JSON.parse(raw)).not.toThrow();
    });
  });

  it('multiple sequential saves overwrite correctly without data leaks', () => {
    mockState.allData = { '2026-02-10': { prayers: {} } };
    saveData();

    mockState.allData = { '2026-02-11': { habits: {} } };
    saveData();

    mockState.allData = { '2026-02-13': { family: { mom: true } } };
    saveData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(Object.keys(stored)).toEqual(['2026-02-13']);
    expect(stored['2026-02-10']).toBeUndefined();
    expect(stored['2026-02-11']).toBeUndefined();
  });

  it('saveViewState data survives JSON round-trip', () => {
    mockState.activeTab = 'life';
    mockState.activeSubTab = 'daily';
    mockState.activePerspective = 'flagged';
    saveViewState();

    const raw = localStorage.getItem(MOCK_KEYS.VIEW_STATE_KEY);
    const parsed = JSON.parse(raw);
    const reparsed = JSON.parse(JSON.stringify(parsed));
    expect(reparsed.activeTab).toBe('life');
    expect(reparsed.activeSubTab).toBe('daily');
    expect(reparsed.activePerspective).toBe('flagged');
  });
});
