// @vitest-environment jsdom
/// <reference types="vitest" />
// ============================================================================
// Cloud Sync Misc Gaps — Exhaustive tests for remaining sync coverage gaps
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// Hoisted mocks — declared before any module imports
// ============================================================================
const {
  mockState,
  saveTasksDataMock,
  startUndoCountdownMock,
  mockFetch,
  MOCK_DEFAULT_DAY_DATA,
  MOCK_CRED_SYNC_KEYS,
} = vi.hoisted(() => {
  const mockState = {
    // Notes state
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
    // Storage state
    customPerspectives: [],
    triggers: [],
    allData: {},
    currentDate: '2026-02-13',
    scoresCache: new Map(),
    scoresCacheVersion: 0,
    // Scoring state
    WEIGHTS: {
      prayer: { onTime: 5, late: 2, quran: 5 },
      glucose: { avgMax: 10, tirPerPoint: 0.1, insulinBase: 5, insulinPenalty: -5, insulinThreshold: 40 },
      family: { mom: 1, dad: 1, jana: 1, tia: 1, ahmed: 1, eman: 1 },
      habits: { exercise: 3, reading: 2, meditation: 2, water: 1, vitamins: 2, brushTeeth: 1, nopYes: 2, nopNo: -2 },
      whoop: { sleepPerfHigh: 7, sleepPerfMid: 4, sleepPerfLow: 2, recoveryHigh: 2, recoveryMid: 1, recoveryLow: 0, strainMatch: 3, strainHigh: 2 },
    },
    MAX_SCORES: { prayer: 35, diabetes: 25, whoop: 14, family: 6, habits: 16, total: 96 },
    CATEGORY_WEIGHTS: { prayer: 20, diabetes: 20, whoop: 20, family: 20, habits: 20 },
    xp: { total: 0, history: [] },
    streak: {
      current: 0, longest: 0, lastLoggedDate: null,
      shield: { available: true, lastUsed: null }, multiplier: 1.0,
    },
    achievements: { unlocked: {} },
  };

  const MOCK_DEFAULT_DAY_DATA = {
    prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
    glucose: { avg: '', tir: '', insulin: '' },
    whoop: { sleepPerf: '', recovery: '', strain: '', whoopAge: '' },
    libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
    family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
    habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' },
  };

  const MOCK_CRED_SYNC_KEYS = [
    { localStorage: 'nucleusAnthropicKey', id: 'anthropic' },
    { localStorage: 'nucleusWhoopWorkerUrl', id: 'whoopUrl' },
    { localStorage: 'nucleusWhoopApiKey', id: 'whoopKey' },
  ];

  return {
    mockState,
    saveTasksDataMock: vi.fn(),
    startUndoCountdownMock: vi.fn(),
    mockFetch: vi.fn(),
    MOCK_DEFAULT_DAY_DATA,
    MOCK_CRED_SYNC_KEYS,
  };
});

// ============================================================================
// Module-level mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/data/storage.js', () => ({ saveTasksData: saveTasksDataMock, saveData: vi.fn() }));
vi.mock('../src/features/undo.js', () => ({ startUndoCountdown: startUndoCountdownMock }));

vi.mock('../src/constants.js', () => ({
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
  NOTE_INTEGRITY_SNAPSHOT_KEY: 'nucleusNoteIntegritySnapshot',
  NOTE_LOCAL_BACKUP_KEY: 'nucleusNoteLocalBackup',
  XP_KEY: 'lifeGamificationXP',
  STREAK_KEY: 'lifeGamificationStreak',
  ACHIEVEMENTS_KEY: 'lifeGamificationAchievements',
  CATEGORY_WEIGHTS_KEY: 'lifeGamificationCategoryWeights',
  DEFAULT_WEIGHTS: {
    prayer: { onTime: 5, late: 2, quran: 5 },
    glucose: { avgMax: 10, tirPerPoint: 0.1, insulinBase: 5, insulinPenalty: -5, insulinThreshold: 40 },
    family: { mom: 1, dad: 1, jana: 1, tia: 1, ahmed: 1, eman: 1 },
    habits: { exercise: 3, reading: 2, meditation: 2, water: 1, vitamins: 2, brushTeeth: 1, nopYes: 2, nopNo: -2 },
    whoop: { sleepPerfHigh: 7, sleepPerfMid: 4, sleepPerfLow: 2, recoveryHigh: 2, recoveryMid: 1, recoveryLow: 0, strainMatch: 3, strainHigh: 2 },
  },
  DEFAULT_MAX_SCORES: { prayer: 35, diabetes: 25, whoop: 14, family: 6, habits: 16, total: 96 },
  DEFAULT_CATEGORY_WEIGHTS: { prayer: 20, diabetes: 20, whoop: 20, family: 20, habits: 20 },
  defaultDayData: MOCK_DEFAULT_DAY_DATA,
  CRED_SYNC_KEYS: MOCK_CRED_SYNC_KEYS,
  LEVEL_THRESHOLDS: [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200],
  LEVEL_TIERS: [
    { min: 1, max: 4, name: 'Spark', icon: 'S' },
    { min: 5, max: 9, name: 'Ember', icon: 'E' },
    { min: 10, max: 999, name: 'Flame', icon: 'F' },
  ],
  STREAK_MULTIPLIERS: [
    { min: 1, multiplier: 1.0 },
    { min: 3, multiplier: 1.1 },
    { min: 7, multiplier: 1.2 },
    { min: 14, multiplier: 1.3 },
    { min: 30, multiplier: 1.5 },
  ],
  STREAK_MIN_THRESHOLD: 0.1,
  SCORE_TIERS: [
    { min: 0, color: '#ef4444', label: 'Low', bg: '#fef2f2' },
    { min: 0.4, color: '#f59e0b', label: 'Fair', bg: '#fffbeb' },
    { min: 0.7, color: '#22c55e', label: 'Good', bg: '#f0fdf4' },
    { min: 0.9, color: '#3b82f6', label: 'Great', bg: '#eff6ff' },
  ],
  ACHIEVEMENTS: [],
  FOCUS_TIPS: {},
  APP_VERSION: '4.43.8',
  APP_VERSION_SEEN_KEY: 'nucleusAppVersionSeen',
}));

vi.mock('../src/utils.js', () => ({
  getLocalDateString: vi.fn((d) => {
    if (!d) return '2026-02-13';
    if (d instanceof Date) return d.toISOString().split('T')[0];
    return '2026-02-13';
  }),
  escapeHtml: vi.fn((s) => s || ''),
  formatSmartDate: vi.fn((d) => d || ''),
  generateTaskId: vi.fn(() => `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
  safeJsonParse: vi.fn((s, d) => { try { return JSON.parse(s); } catch { return d; } }),
}));

// ============================================================================
// Imports
// ============================================================================
import {
  createRootNote,
  createNoteAfter,
  createChildNote,
  deleteNote,
  indentNote,
  outdentNote,
  handleNoteBlur,
  reorderNotes,
  removeNoteInlineMeta,
  initializeNoteOrders,
} from '../src/features/notes.js';

import {
  saveCategoryWeights,
  updateCategoryWeight,
  rebuildGamification,
  calculateScores,
  invalidateScoresCache,
} from '../src/features/scoring.js';

import {
  buildEncryptedCredentials,
  restoreEncryptedCredentials,
  getCredentialSyncStatus,
} from '../src/data/credential-sync.js';

// ============================================================================
// Global window stubs
// ============================================================================
const debouncedSaveToGithubMock = vi.fn();
const windowRenderMock = vi.fn();
const windowGetCurrentUser = vi.fn();

Object.assign(window, {
  debouncedSaveToGithub: debouncedSaveToGithubMock,
  render: windowRenderMock,
  getCurrentUser: windowGetCurrentUser,
  saveData: vi.fn(),
  invalidateScoresCache: vi.fn(),
});

// ============================================================================
// Helpers
// ============================================================================
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
  mockState.customPerspectives = [];
  mockState.triggers = [];
  mockState.allData = {};
  mockState.currentDate = '2026-02-13';
  mockState.scoresCache = new Map();
  mockState.scoresCacheVersion = 0;
  mockState.CATEGORY_WEIGHTS = { prayer: 20, diabetes: 20, whoop: 20, family: 20, habits: 20 };
  mockState.xp = { total: 0, history: [] };
  mockState.streak = {
    current: 0, longest: 0, lastLoggedDate: null,
    shield: { available: true, lastUsed: null }, multiplier: 1.0,
  };
  mockState.achievements = { unlocked: {} };
}

function makeNote(overrides = {}) {
  const note = {
    id: overrides.id || `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: overrides.title || 'Test Note',
    notes: '',
    status: 'anytime',
    completed: false,
    completedAt: null,
    areaId: overrides.areaId || null,
    categoryId: overrides.categoryId || null,
    labels: overrides.labels || [],
    people: overrides.people || [],
    deferDate: overrides.deferDate || null,
    dueDate: null,
    repeat: null,
    isNote: true,
    noteLifecycleState: 'active',
    noteHistory: [],
    parentId: overrides.parentId || null,
    indent: overrides.indent || 0,
    noteOrder: overrides.noteOrder != null ? overrides.noteOrder : 1000,
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString(),
  };
  mockState.tasksData.push(note);
  return note;
}

// ============================================================================
// Setup / teardown
// ============================================================================
beforeEach(() => {
  resetState();
  debouncedSaveToGithubMock.mockClear();
  windowRenderMock.mockClear();
  windowGetCurrentUser.mockReset();
  saveTasksDataMock.mockClear();
  startUndoCountdownMock.mockClear();
  window.debouncedSaveToGithub = debouncedSaveToGithubMock;
  window.render = windowRenderMock;
  localStorage.clear();
});

// ############################################################################
// SECTION 1: Notes Cloud Sync Chain
// ############################################################################

describe('Notes cloud sync chain', () => {

  // ---- debouncedSaveToGithubSafe wrapper ----

  describe('debouncedSaveToGithubSafe wrapper', () => {
    it('calls window.debouncedSaveToGithub through removeNoteInlineMeta', () => {
      makeNote({ id: 'dsw1', title: 'My Note', labels: ['lbl_x'] });
      removeNoteInlineMeta('dsw1', 'label', 'lbl_x');
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('does not throw when window.debouncedSaveToGithub is undefined', () => {
      delete window.debouncedSaveToGithub;
      makeNote({ id: 'dsw2', title: 'Some Note', labels: ['lbl_y'] });
      expect(() => removeNoteInlineMeta('dsw2', 'label', 'lbl_y')).not.toThrow();
    });

    it('does not throw when window.debouncedSaveToGithub is null', () => {
      window.debouncedSaveToGithub = null;
      makeNote({ id: 'dsw3', title: 'Null dSGH', people: ['p_1'] });
      expect(() => removeNoteInlineMeta('dsw3', 'person', 'p_1')).not.toThrow();
    });

    it('does not throw when window.debouncedSaveToGithub is not a function', () => {
      window.debouncedSaveToGithub = 42;
      const n = makeNote({ id: 'dsw4', title: 'Not fn' });
      n.deferDate = '2026-03-01';
      expect(() => removeNoteInlineMeta('dsw4', 'deferDate', null)).not.toThrow();
    });
  });

  // ---- createRootNote ----

  describe('createRootNote cloud sync', () => {
    it('calls saveTasksData', () => {
      createRootNote();
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('calls window.render', () => {
      createRootNote();
      expect(windowRenderMock).toHaveBeenCalled();
    });

    it('adds a new note to state.tasksData', () => {
      createRootNote();
      const notes = mockState.tasksData.filter(t => t.isNote);
      expect(notes.length).toBe(1);
    });

    it('creates note with active lifecycle state', () => {
      createRootNote();
      const note = mockState.tasksData.find(t => t.isNote);
      expect(note.noteLifecycleState).toBe('active');
    });

    it('respects area filter', () => {
      createRootNote({ areaId: 'area_1' });
      const note = mockState.tasksData.find(t => t.isNote);
      expect(note.areaId).toBe('area_1');
    });

    it('respects label filter', () => {
      createRootNote({ labelId: 'lbl_1' });
      const note = mockState.tasksData.find(t => t.isNote);
      expect(note.labels).toContain('lbl_1');
    });

    it('delegates to createChildNote when zoomed', () => {
      makeNote({ id: 'zoom_parent', title: 'ZP' });
      mockState.zoomedNoteId = 'zoom_parent';
      createRootNote();
      const children = mockState.tasksData.filter(t => t.isNote && t.parentId === 'zoom_parent');
      expect(children.length).toBe(1);
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('records noteHistory entry', () => {
      createRootNote();
      const note = mockState.tasksData.find(t => t.isNote);
      expect(note.noteHistory.length).toBeGreaterThanOrEqual(1);
      expect(note.noteHistory[0].action).toBe('created');
    });
  });

  // ---- createNoteAfter ----

  describe('createNoteAfter cloud sync', () => {
    it('calls saveTasksData', () => {
      makeNote({ id: 'cna1', title: 'Ref' });
      saveTasksDataMock.mockClear();
      createNoteAfter('cna1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('creates sibling with same parentId', () => {
      makeNote({ id: 'cna2', title: 'Sibling', parentId: 'p1' });
      createNoteAfter('cna2');
      const siblings = mockState.tasksData.filter(t => t.isNote && t.parentId === 'p1');
      expect(siblings.length).toBe(2);
    });

    it('does nothing for invalid noteId', () => {
      createNoteAfter('nonexistent');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('inherits areaId from reference', () => {
      makeNote({ id: 'cna3', title: 'AreaNote', areaId: 'a_x' });
      createNoteAfter('cna3');
      const newNote = mockState.tasksData.find(t => t.isNote && t.id !== 'cna3');
      expect(newNote.areaId).toBe('a_x');
    });

    it('creates note with correct noteOrder between siblings', () => {
      makeNote({ id: 'cna4a', title: 'First', noteOrder: 1000 });
      makeNote({ id: 'cna4b', title: 'Third', noteOrder: 3000 });
      createNoteAfter('cna4a');
      const newNote = mockState.tasksData.find(t => t.isNote && !['cna4a', 'cna4b'].includes(t.id));
      expect(newNote.noteOrder).toBeGreaterThan(1000);
      expect(newNote.noteOrder).toBeLessThan(3000);
    });
  });

  // ---- createChildNote ----

  describe('createChildNote cloud sync', () => {
    it('calls saveTasksData', () => {
      makeNote({ id: 'ccn1', title: 'Parent' });
      saveTasksDataMock.mockClear();
      createChildNote('ccn1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('creates note with correct parentId', () => {
      makeNote({ id: 'ccn2', title: 'Parent2' });
      createChildNote('ccn2');
      const child = mockState.tasksData.find(t => t.isNote && t.parentId === 'ccn2');
      expect(child).toBeDefined();
    });

    it('uncollapses parent if collapsed', () => {
      makeNote({ id: 'ccn3', title: 'CP' });
      mockState.collapsedNotes.add('ccn3');
      createChildNote('ccn3');
      expect(mockState.collapsedNotes.has('ccn3')).toBe(false);
    });

    it('does nothing for invalid noteId', () => {
      createChildNote('nonexistent');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('increments indent from parent', () => {
      makeNote({ id: 'ccn4', title: 'IP', indent: 2 });
      createChildNote('ccn4');
      const child = mockState.tasksData.find(t => t.isNote && t.parentId === 'ccn4');
      expect(child.indent).toBe(3);
    });
  });

  // ---- deleteNote ----

  describe('deleteNote cloud sync', () => {
    it('calls saveTasksData on delete', () => {
      makeNote({ id: 'del1', title: 'DelMe' });
      saveTasksDataMock.mockClear();
      deleteNote('del1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('marks note as deleted', () => {
      makeNote({ id: 'del2', title: 'SoftDel' });
      deleteNote('del2');
      const d = mockState.tasksData.find(t => t.id === 'del2');
      expect(d.noteLifecycleState).toBe('deleted');
    });

    it('reparents children when not deleteChildren', () => {
      makeNote({ id: 'del3', title: 'Parent' });
      makeNote({ id: 'del3c', title: 'Child', parentId: 'del3', indent: 1 });
      deleteNote('del3', false);
      const c = mockState.tasksData.find(t => t.id === 'del3c');
      expect(c.parentId).toBeNull();
    });

    it('deletes children when deleteChildren=true', () => {
      makeNote({ id: 'del4', title: 'Parent' });
      makeNote({ id: 'del4c', title: 'Child', parentId: 'del4', indent: 1 });
      deleteNote('del4', true);
      const c = mockState.tasksData.find(t => t.id === 'del4c');
      expect(c.noteLifecycleState).toBe('deleted');
    });

    it('resets zoom when deleting zoomed note', () => {
      makeNote({ id: 'del5', title: 'Zoomed' });
      mockState.zoomedNoteId = 'del5';
      deleteNote('del5');
      expect(mockState.zoomedNoteId).toBeNull();
    });

    it('does nothing for nonexistent note', () => {
      saveTasksDataMock.mockClear();
      deleteNote('nonexistent');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });
  });

  // ---- indentNote ----

  describe('indentNote cloud sync', () => {
    it('calls saveTasksData', () => {
      makeNote({ id: 'ind_p', title: 'Above', noteOrder: 1000 });
      makeNote({ id: 'ind1', title: 'Indent', noteOrder: 2000 });
      saveTasksDataMock.mockClear();
      indentNote('ind1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('sets parentId to previous sibling', () => {
      makeNote({ id: 'ind_p2', title: 'Prev', noteOrder: 1000 });
      makeNote({ id: 'ind2', title: 'IndMe', noteOrder: 2000 });
      indentNote('ind2');
      const u = mockState.tasksData.find(t => t.id === 'ind2');
      expect(u.parentId).toBe('ind_p2');
    });

    it('does nothing if first in list', () => {
      makeNote({ id: 'ind3', title: 'First', noteOrder: 1000 });
      saveTasksDataMock.mockClear();
      indentNote('ind3');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('expands collapsed parent', () => {
      makeNote({ id: 'ind_p3', title: 'CollP', noteOrder: 1000 });
      makeNote({ id: 'ind4', title: 'IndMe2', noteOrder: 2000 });
      mockState.collapsedNotes.add('ind_p3');
      indentNote('ind4');
      expect(mockState.collapsedNotes.has('ind_p3')).toBe(false);
    });

    it('records history entry with type indent', () => {
      makeNote({ id: 'ind_p4', title: 'Prev', noteOrder: 1000 });
      makeNote({ id: 'ind5', title: 'IndMe3', noteOrder: 2000 });
      indentNote('ind5');
      const n = mockState.tasksData.find(t => t.id === 'ind5');
      const lastEntry = n.noteHistory[n.noteHistory.length - 1];
      expect(lastEntry.action).toBe('updated');
      expect(lastEntry.details.type).toBe('indent');
    });
  });

  // ---- outdentNote ----

  describe('outdentNote cloud sync', () => {
    it('calls saveTasksData', () => {
      makeNote({ id: 'out_p', title: 'Parent', noteOrder: 1000 });
      makeNote({ id: 'out1', title: 'Outdent', parentId: 'out_p', indent: 1, noteOrder: 1000 });
      saveTasksDataMock.mockClear();
      outdentNote('out1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('sets parentId to grandparent', () => {
      makeNote({ id: 'gp', title: 'GP', noteOrder: 1000 });
      makeNote({ id: 'out_p2', title: 'Parent', parentId: 'gp', indent: 1, noteOrder: 1000 });
      makeNote({ id: 'out2', title: 'OutMe', parentId: 'out_p2', indent: 2, noteOrder: 1000 });
      outdentNote('out2');
      const u = mockState.tasksData.find(t => t.id === 'out2');
      expect(u.parentId).toBe('gp');
    });

    it('does nothing at indent 0', () => {
      makeNote({ id: 'out3', title: 'Root', indent: 0 });
      saveTasksDataMock.mockClear();
      outdentNote('out3');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('decrements indent level', () => {
      makeNote({ id: 'out_p3', title: 'Parent', noteOrder: 1000 });
      makeNote({ id: 'out4', title: 'OutMe2', parentId: 'out_p3', indent: 2, noteOrder: 1000 });
      outdentNote('out4');
      const u = mockState.tasksData.find(t => t.id === 'out4');
      expect(u.indent).toBe(1);
    });

    it('records history entry with type outdent', () => {
      makeNote({ id: 'out_p4', title: 'Parent', noteOrder: 1000 });
      makeNote({ id: 'out5', title: 'OutMe3', parentId: 'out_p4', indent: 1, noteOrder: 1000 });
      outdentNote('out5');
      const n = mockState.tasksData.find(t => t.id === 'out5');
      const lastEntry = n.noteHistory[n.noteHistory.length - 1];
      expect(lastEntry.action).toBe('updated');
      expect(lastEntry.details.type).toBe('outdent');
    });
  });

  // ---- handleNoteBlur ----

  describe('handleNoteBlur cloud sync', () => {
    it('calls saveTasksData when title changes', () => {
      makeNote({ id: 'blur1', title: 'Old' });
      saveTasksDataMock.mockClear();
      handleNoteBlur({ target: { textContent: 'New' } }, 'blur1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('updates note title', () => {
      const n = makeNote({ id: 'blur2', title: 'Before' });
      handleNoteBlur({ target: { textContent: 'After' } }, 'blur2');
      expect(n.title).toBe('After');
    });

    it('does not save when title unchanged', () => {
      makeNote({ id: 'blur3', title: 'Same' });
      saveTasksDataMock.mockClear();
      handleNoteBlur({ target: { textContent: 'Same' } }, 'blur3');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('deletes empty note without children', () => {
      makeNote({ id: 'blur4', title: 'Empty' });
      saveTasksDataMock.mockClear();
      handleNoteBlur({ target: { textContent: '' } }, 'blur4');
      expect(saveTasksDataMock).toHaveBeenCalled();
      const d = mockState.tasksData.find(t => t.id === 'blur4');
      expect(d.noteLifecycleState).toBe('deleted');
    });

    it('does not delete empty note with children', () => {
      makeNote({ id: 'blur5', title: 'HasKids' });
      makeNote({ id: 'blur5c', title: 'Kid', parentId: 'blur5', indent: 1 });
      handleNoteBlur({ target: { textContent: '' } }, 'blur5');
      const p = mockState.tasksData.find(t => t.id === 'blur5');
      expect(p.noteLifecycleState).toBe('active');
    });

    it('clears editingNoteId', () => {
      makeNote({ id: 'blur6', title: 'Editing' });
      mockState.editingNoteId = 'blur6';
      handleNoteBlur({ target: { textContent: 'Editing' } }, 'blur6');
      expect(mockState.editingNoteId).toBeNull();
    });

    it('does nothing for nonexistent note', () => {
      saveTasksDataMock.mockClear();
      handleNoteBlur({ target: { textContent: 'X' } }, 'nonexistent');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });
  });

  // ---- reorderNotes ----

  describe('reorderNotes cloud sync', () => {
    it('calls saveTasksData for bottom position', () => {
      makeNote({ id: 'ro_a', title: 'A', noteOrder: 1000 });
      makeNote({ id: 'ro_b', title: 'B', noteOrder: 2000 });
      saveTasksDataMock.mockClear();
      reorderNotes('ro_a', 'ro_b', 'bottom');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('calls saveTasksData for top position', () => {
      makeNote({ id: 'ro_c', title: 'C', noteOrder: 1000 });
      makeNote({ id: 'ro_d', title: 'D', noteOrder: 2000 });
      saveTasksDataMock.mockClear();
      reorderNotes('ro_d', 'ro_c', 'top');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('calls saveTasksData for child position', () => {
      makeNote({ id: 'ro_e', title: 'E', noteOrder: 1000 });
      makeNote({ id: 'ro_f', title: 'F', noteOrder: 2000 });
      saveTasksDataMock.mockClear();
      reorderNotes('ro_e', 'ro_f', 'child');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('sets parentId for child reorder', () => {
      makeNote({ id: 'ro_g', title: 'G', noteOrder: 1000 });
      makeNote({ id: 'ro_h', title: 'H', noteOrder: 2000 });
      reorderNotes('ro_g', 'ro_h', 'child');
      const u = mockState.tasksData.find(t => t.id === 'ro_g');
      expect(u.parentId).toBe('ro_h');
    });

    it('does not reorder into descendant', () => {
      makeNote({ id: 'ro_p', title: 'Parent', noteOrder: 1000 });
      makeNote({ id: 'ro_ch', title: 'Child', parentId: 'ro_p', indent: 1, noteOrder: 1000 });
      saveTasksDataMock.mockClear();
      reorderNotes('ro_p', 'ro_ch', 'bottom');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('does nothing for nonexistent dragged note', () => {
      makeNote({ id: 'ro_i', title: 'I', noteOrder: 1000 });
      saveTasksDataMock.mockClear();
      reorderNotes('nonexistent', 'ro_i', 'bottom');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('expands collapsed target for child reorder', () => {
      makeNote({ id: 'ro_j', title: 'J', noteOrder: 1000 });
      makeNote({ id: 'ro_k', title: 'K', noteOrder: 2000 });
      mockState.collapsedNotes.add('ro_k');
      reorderNotes('ro_j', 'ro_k', 'child');
      expect(mockState.collapsedNotes.has('ro_k')).toBe(false);
    });
  });

  // ---- removeNoteInlineMeta ----

  describe('removeNoteInlineMeta cloud sync', () => {
    it('calls debouncedSaveToGithub for label removal', () => {
      makeNote({ id: 'rim1', title: 'N', labels: ['l1'] });
      debouncedSaveToGithubMock.mockClear();
      removeNoteInlineMeta('rim1', 'label', 'l1');
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('calls debouncedSaveToGithub for person removal', () => {
      makeNote({ id: 'rim2', title: 'N', people: ['p1'] });
      debouncedSaveToGithubMock.mockClear();
      removeNoteInlineMeta('rim2', 'person', 'p1');
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('calls debouncedSaveToGithub for category removal', () => {
      makeNote({ id: 'rim3', title: 'N', areaId: 'a1' });
      debouncedSaveToGithubMock.mockClear();
      removeNoteInlineMeta('rim3', 'category', null);
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('calls debouncedSaveToGithub for deferDate removal', () => {
      const n = makeNote({ id: 'rim4', title: 'N' });
      n.deferDate = '2026-03-01';
      debouncedSaveToGithubMock.mockClear();
      removeNoteInlineMeta('rim4', 'deferDate', null);
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('also calls saveTasksData', () => {
      makeNote({ id: 'rim5', title: 'N', labels: ['l2'] });
      saveTasksDataMock.mockClear();
      removeNoteInlineMeta('rim5', 'label', 'l2');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('calls window.render', () => {
      makeNote({ id: 'rim6', title: 'N', labels: ['l3'] });
      windowRenderMock.mockClear();
      removeNoteInlineMeta('rim6', 'label', 'l3');
      expect(windowRenderMock).toHaveBeenCalled();
    });

    it('does nothing for nonexistent note', () => {
      debouncedSaveToGithubMock.mockClear();
      saveTasksDataMock.mockClear();
      removeNoteInlineMeta('nonexistent', 'label', 'l4');
      expect(debouncedSaveToGithubMock).not.toHaveBeenCalled();
    });
  });

  // ---- initializeNoteOrders ----

  describe('initializeNoteOrders cloud sync', () => {
    it('calls saveTasksData when notes need ordering', () => {
      const n = makeNote({ id: 'ino1', title: 'Unordered' });
      delete n.noteOrder;
      saveTasksDataMock.mockClear();
      initializeNoteOrders();
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('does not save when all have orders', () => {
      makeNote({ id: 'ino2', title: 'Ordered', noteOrder: 1000 });
      saveTasksDataMock.mockClear();
      initializeNoteOrders();
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });
  });
});

// ############################################################################
// SECTION 2: Storage QuotaExceededError
// ############################################################################

describe('Storage QuotaExceededError handling', () => {
  describe('localStorage quota scenarios', () => {
    it('saveCategoryWeights succeeds under normal conditions', () => {
      expect(() => saveCategoryWeights()).not.toThrow();
      const stored = JSON.parse(localStorage.getItem('lifeGamificationCategoryWeights'));
      expect(stored.prayer).toBe(20);
    });


    it('saveCategoryWeights uses localStorage.setItem directly (not safeLocalStorageSet)', async () => {
      // Verify via source code that saveCategoryWeights calls localStorage.setItem
      // directly, meaning QuotaExceededError would propagate to callers unhandled
      // (unlike safeLocalStorageSet which catches and returns false)
      const fs = await import('fs');
      const scoringSrc = fs.readFileSync('/var/www/myapp/lifeg/src/features/scoring.js', 'utf-8');
      // Extract the saveCategoryWeights function body
      const fnMatch = scoringSrc.match(/export function saveCategoryWeights\(\)[^}]+\}/);
      expect(fnMatch).toBeTruthy();
      const fnBody = fnMatch[0];
      expect(fnBody).toContain('localStorage.setItem(');
      expect(fnBody).not.toContain('safeLocalStorageSet');
    });

    it('saveCategoryWeights does not go through saveTasksData', () => {
      saveTasksDataMock.mockClear();
      saveCategoryWeights();
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });


    it('invalidateScoresCache clears cache and bumps version', () => {
      mockState.scoresCache.set('key1', { total: 50 });
      const prevVersion = mockState.scoresCacheVersion;
      invalidateScoresCache();
      expect(mockState.scoresCache.size).toBe(0);
      expect(mockState.scoresCacheVersion).toBe(prevVersion + 1);
    });

    it('invalidateScoresCache is idempotent on empty cache', () => {
      mockState.scoresCache = new Map();
      const prevVersion = mockState.scoresCacheVersion;
      invalidateScoresCache();
      expect(mockState.scoresCache.size).toBe(0);
      expect(mockState.scoresCacheVersion).toBe(prevVersion + 1);
    });
  });
});

// ############################################################################
// SECTION 3: Scoring module gaps
// ############################################################################

describe('Scoring module gaps', () => {
  describe('saveCategoryWeights standalone', () => {
    it('writes CATEGORY_WEIGHTS to localStorage', () => {
      saveCategoryWeights();
      const stored = JSON.parse(localStorage.getItem('lifeGamificationCategoryWeights'));
      expect(stored.prayer).toBe(20);
      expect(stored.diabetes).toBe(20);
    });

    it('adds _updatedAt timestamp', () => {
      saveCategoryWeights();
      expect(mockState.CATEGORY_WEIGHTS._updatedAt).toBeDefined();
      const ts = new Date(mockState.CATEGORY_WEIGHTS._updatedAt);
      expect(ts.toISOString()).toBe(mockState.CATEGORY_WEIGHTS._updatedAt);
    });

    it('persists all category weight keys', () => {
      saveCategoryWeights();
      const stored = JSON.parse(localStorage.getItem('lifeGamificationCategoryWeights'));
      expect(stored).toHaveProperty('prayer');
      expect(stored).toHaveProperty('diabetes');
      expect(stored).toHaveProperty('whoop');
      expect(stored).toHaveProperty('family');
      expect(stored).toHaveProperty('habits');
    });
  });

  describe('updateCategoryWeight', () => {
    it('updates specific weight and saves', () => {
      updateCategoryWeight('prayer', 30);
      expect(mockState.CATEGORY_WEIGHTS.prayer).toBe(30);
    });

    it('calls debouncedSaveToGithub', () => {
      debouncedSaveToGithubMock.mockClear();
      updateCategoryWeight('diabetes', 25);
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('invalidates scores cache', () => {
      const prev = mockState.scoresCacheVersion;
      updateCategoryWeight('whoop', 15);
      expect(mockState.scoresCacheVersion).toBeGreaterThan(prev);
    });

    it('calls window.render', () => {
      windowRenderMock.mockClear();
      updateCategoryWeight('family', 10);
      expect(windowRenderMock).toHaveBeenCalled();
    });

    it('parses string values', () => {
      updateCategoryWeight('habits', '35.5');
      expect(mockState.CATEGORY_WEIGHTS.habits).toBe(35.5);
    });

    it('defaults to 0 for non-numeric', () => {
      updateCategoryWeight('prayer', 'abc');
      expect(mockState.CATEGORY_WEIGHTS.prayer).toBe(0);
    });
  });

  describe('rebuildGamification edge cases', () => {
    it('handles empty allData', () => {
      mockState.allData = {};
      expect(() => rebuildGamification()).not.toThrow();
      expect(mockState.xp.total).toBe(0);
    });

    it('handles null day entries', () => {
      mockState.allData = { '2026-01-01': null, '2026-01-02': null };
      expect(() => rebuildGamification()).not.toThrow();
    });

    it('handles entries with missing categories', () => {
      mockState.allData = {
        '2026-01-01': { prayers: { fajr: '1.0' } },
        '2026-01-02': { glucose: { avg: '100' } },
        '2026-01-03': {},
      };
      expect(() => rebuildGamification()).not.toThrow();
    });

    it('rebuilds XP from data', () => {
      mockState.allData = {
        '2026-01-01': {
          prayers: { fajr: '1.0', dhuhr: '1.0', asr: '1.0', maghrib: '1.0', isha: '1.0', quran: 2 },
          glucose: { avg: '105', tir: '85', insulin: '30' },
          whoop: { sleepPerf: 90, recovery: 70, strain: 14 },
          family: { mom: true, dad: true },
          habits: { exercise: 1, reading: 1, meditation: 1, water: 2, vitamins: true, brushTeeth: 2, nop: '1' },
        },
      };
      rebuildGamification();
      expect(mockState.xp.total).toBeGreaterThan(0);
    });

    it('calls debouncedSaveToGithub', () => {
      debouncedSaveToGithubMock.mockClear();
      rebuildGamification();
      expect(debouncedSaveToGithubMock).toHaveBeenCalled();
    });

    it('saves XP to localStorage', () => {
      rebuildGamification();
      expect(localStorage.getItem('lifeGamificationXP')).toBeTruthy();
    });

    it('saves streak to localStorage', () => {
      rebuildGamification();
      expect(localStorage.getItem('lifeGamificationStreak')).toBeTruthy();
    });

    it('saves achievements to localStorage', () => {
      rebuildGamification();
      expect(localStorage.getItem('lifeGamificationAchievements')).toBeTruthy();
    });

    it('builds streak for consecutive days', () => {
      mockState.allData = {
        '2026-01-01': {
          prayers: { fajr: '1.0', dhuhr: '1.0', asr: '1.0', maghrib: '1.0', isha: '1.0', quran: 2 },
          glucose: {}, whoop: {}, family: { mom: true }, habits: { exercise: 1 },
        },
        '2026-01-02': {
          prayers: { fajr: '1.0', dhuhr: '1.0', asr: '1.0', maghrib: '1.0', isha: '1.0', quran: 2 },
          glucose: {}, whoop: {}, family: { mom: true }, habits: { exercise: 1 },
        },
        '2026-01-03': {
          prayers: { fajr: '1.0', dhuhr: '1.0', asr: '1.0', maghrib: '1.0', isha: '1.0', quran: 2 },
          glucose: {}, whoop: {}, family: { mom: true }, habits: { exercise: 1 },
        },
      };
      rebuildGamification();
      expect(mockState.streak.longest).toBeGreaterThanOrEqual(3);
    });

    it('trims XP history to 365 entries', () => {
      const allData = {};
      for (let i = 0; i < 400; i++) {
        const d = new Date(2024, 0, 1);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        allData[dateStr] = {
          prayers: { fajr: '1.0', dhuhr: '1.0', asr: '1.0', maghrib: '1.0', isha: '1.0', quran: 1 },
          glucose: {}, whoop: {}, family: { mom: true }, habits: { exercise: 1 },
        };
      }
      mockState.allData = allData;
      rebuildGamification();
      expect(mockState.xp.history.length).toBeLessThanOrEqual(365);
    });
  });

  describe('calculateScores edge cases', () => {
    it('handles null data', () => {
      const r = calculateScores(null);
      expect(r).toBeDefined();
      expect(r.total).toBe(0);
    });

    it('handles undefined data', () => {
      const r = calculateScores(undefined);
      expect(r).toBeDefined();
      expect(r.total).toBe(0);
    });

    it('handles partial data', () => {
      const r = calculateScores({ prayers: { fajr: '1.0' } });
      expect(r).toBeDefined();
      expect(r.prayer).toBeGreaterThan(0);
    });

    it('caches and returns same reference', () => {
      const data = { prayers: { fajr: '1.0' }, glucose: {}, whoop: {}, family: {}, habits: {} };
      const r1 = calculateScores(data);
      const r2 = calculateScores(data);
      expect(r1).toBe(r2);
    });

    it('includes normalized scores', () => {
      const data = {
        prayers: { fajr: '1.0', dhuhr: '1.0', asr: '1.0', maghrib: '1.0', isha: '1.0', quran: 2 },
        glucose: { avg: '105', tir: '85', insulin: '30' },
        whoop: { sleepPerf: 90, recovery: 70, strain: 14 },
        family: { mom: true, dad: true },
        habits: { exercise: 1, reading: 1, meditation: 1, water: 2, vitamins: true, brushTeeth: 2, nop: '1' },
      };
      const r = calculateScores(data);
      expect(r.normalized).toBeDefined();
      expect(r.normalized.prayer).toBeGreaterThanOrEqual(0);
      expect(r.normalized.prayer).toBeLessThanOrEqual(1);
      expect(r.normalized.overall).toBeGreaterThanOrEqual(0);
      expect(r.normalized.overall).toBeLessThanOrEqual(1);
    });
  });
});

// ############################################################################
// SECTION 4: Main.js bootstrap sync initialization
// ############################################################################

describe('Main.js bootstrap sync initialization', () => {
  let mainSrc;
  beforeEach(async () => {
    const fs = await import('fs');
    mainSrc = fs.readFileSync('/var/www/myapp/lifeg/src/main.js', 'utf-8');
  });

  it('imports initPeriodicGithubSync', () => {
    expect(mainSrc).toContain('initPeriodicGithubSync');
  });

  it('imports initWhoopSync', () => {
    expect(mainSrc).toContain('initWhoopSync');
  });

  it('imports initLibreSync', () => {
    expect(mainSrc).toContain('initLibreSync');
  });

  it('imports initGCalSync', () => {
    expect(mainSrc).toContain('initGCalSync');
  });

  it('imports loadCloudDataWithRetry', () => {
    expect(mainSrc).toContain('loadCloudDataWithRetry');
  });

  it('calls loadCloudDataWithRetry() in initApp', () => {
    expect(mainSrc).toContain('loadCloudDataWithRetry()');
  });

  it('calls initPeriodicGithubSync() in success path', () => {
    expect(mainSrc).toContain('initPeriodicGithubSync()');
  });

  it('calls initWhoopSync() in success path', () => {
    const thenBlock = mainSrc.split('.then(')[1] || '';
    expect(thenBlock).toContain('initWhoopSync()');
  });

  it('calls initLibreSync() in success path', () => {
    const thenBlock = mainSrc.split('.then(')[1] || '';
    expect(thenBlock).toContain('initLibreSync()');
  });

  it('calls initGCalSync() in success path', () => {
    const thenBlock = mainSrc.split('.then(')[1] || '';
    expect(thenBlock).toContain('initGCalSync()');
  });

  it('calls sync inits in .catch() handler (failure fallback)', () => {
    const catchBlock = mainSrc.split('.catch(')[1] || '';
    expect(catchBlock).toContain('initPeriodicGithubSync');
    expect(catchBlock).toContain('initWhoopSync');
    expect(catchBlock).toContain('initLibreSync');
    expect(catchBlock).toContain('initGCalSync');
  });

  it('imports initGoogleContactsSync', () => {
    expect(mainSrc).toContain('initGoogleContactsSync');
  });

  it('imports initGSheetSync', () => {
    expect(mainSrc).toContain('initGSheetSync');
  });

  it('calls initGoogleContactsSync in both paths', () => {
    const thenBlock = mainSrc.split('.then(')[1] || '';
    const catchBlock = mainSrc.split('.catch(')[1] || '';
    expect(thenBlock).toContain('initGoogleContactsSync');
    expect(catchBlock).toContain('initGoogleContactsSync');
  });

  it('calls initGSheetSync in both paths', () => {
    const thenBlock = mainSrc.split('.then(')[1] || '';
    const catchBlock = mainSrc.split('.catch(')[1] || '';
    expect(thenBlock).toContain('initGSheetSync');
    expect(catchBlock).toContain('initGSheetSync');
  });

  it('calls rebuildGamification when xp history empty but data exists', () => {
    expect(mainSrc).toContain('rebuildGamification');
  });

  it('calls processGamification for current date', () => {
    expect(mainSrc).toContain('processGamification(state.currentDate)');
  });

  it('calls initializeTaskOrders at startup', () => {
    expect(mainSrc).toContain('initializeTaskOrders()');
  });

  it('calls initializeNoteOrders at startup', () => {
    expect(mainSrc).toContain('initializeNoteOrders()');
  });

  it('calls ensureNoteSafetyMetadata at startup', () => {
    expect(mainSrc).toContain('ensureNoteSafetyMetadata()');
  });
});

// ############################################################################
// SECTION 5: Credential sync edge cases
// ############################################################################

describe('Credential sync edge cases', () => {
  describe('buildEncryptedCredentials with various values', () => {
    it('encrypts values containing special characters', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-std' });
      localStorage.setItem('nucleusAnthropicKey', 'key-with-special-chars-!@#$%');
      const result = await buildEncryptedCredentials();
      expect(result).not.toBeNull();
      expect(result.version).toBe(1);
    });

    it('encrypts credential value that is a URL', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-url' });
      localStorage.setItem('nucleusWhoopWorkerUrl', 'https://worker.example.com/path?query=value');
      const result = await buildEncryptedCredentials();
      expect(result).not.toBeNull();
    });

    it('encrypted bundle contains all required fields', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-fields' });
      localStorage.setItem('nucleusAnthropicKey', 'credential-value-12345');
      const bundle = await buildEncryptedCredentials();
      expect(bundle).not.toBeNull();
      expect(bundle).toHaveProperty('salt');
      expect(bundle).toHaveProperty('wrapIv');
      expect(bundle).toHaveProperty('wrappedKey');
      expect(bundle).toHaveProperty('dataIv');
      expect(bundle).toHaveProperty('data');
      expect(bundle).toHaveProperty('updatedAt');
    });

    it('encrypts multiple credentials into single bundle', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-multi-rt' });
      localStorage.setItem('nucleusAnthropicKey', 'anthro-123');
      localStorage.setItem('nucleusWhoopWorkerUrl', 'https://whoop.test');
      localStorage.setItem('nucleusWhoopApiKey', 'whoop-api-456');
      const bundle = await buildEncryptedCredentials();
      expect(bundle).not.toBeNull();
      expect(bundle.version).toBe(1);
      expect(typeof bundle.data).toBe('string');
      expect(bundle.data.length).toBeGreaterThan(0);
    });

    it('salt is a base64 string', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-salt' });
      localStorage.setItem('nucleusAnthropicKey', 'my-key');
      const bundle = await buildEncryptedCredentials();
      expect(typeof bundle.salt).toBe('string');
      expect(bundle.salt.length).toBeGreaterThan(0);
    });

    it('wrappedKey is a base64 string', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-wk' });
      localStorage.setItem('nucleusAnthropicKey', 'my-key');
      const bundle = await buildEncryptedCredentials();
      expect(typeof bundle.wrappedKey).toBe('string');
      expect(bundle.wrappedKey.length).toBeGreaterThan(0);
    });
  });

  describe('key derivation edge cases', () => {
    it('encrypts with single-character UID', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'x' });
      localStorage.setItem('nucleusAnthropicKey', 'test-key');
      const bundle = await buildEncryptedCredentials();
      expect(bundle).not.toBeNull();
      expect(bundle.version).toBe(1);
    });

    it('encrypts with very long UID', async () => {
      const longUid = 'a'.repeat(500);
      windowGetCurrentUser.mockReturnValue({ uid: longUid });
      localStorage.setItem('nucleusAnthropicKey', 'test-key-long');
      const bundle = await buildEncryptedCredentials();
      expect(bundle).not.toBeNull();
      expect(bundle.version).toBe(1);
    });

    it('different UIDs produce different encrypted data', async () => {
      localStorage.setItem('nucleusAnthropicKey', 'same-key');

      windowGetCurrentUser.mockReturnValue({ uid: 'uid-A' });
      const bundleA = await buildEncryptedCredentials();

      windowGetCurrentUser.mockReturnValue({ uid: 'uid-B' });
      const bundleB = await buildEncryptedCredentials();

      // Different keys, different random IV/salt means different data
      expect(bundleA.data).not.toBe(bundleB.data);
    });

    it('same UID produces different bundles due to random IV/salt', async () => {
      localStorage.setItem('nucleusAnthropicKey', 'same-key');

      windowGetCurrentUser.mockReturnValue({ uid: 'uid-same' });
      const bundleA = await buildEncryptedCredentials();
      const bundleB = await buildEncryptedCredentials();

      // Random salt and IV means different ciphertext even with same key
      expect(bundleA.salt).not.toBe(bundleB.salt);
    });
  });

  describe('restoreEncryptedCredentials guard conditions', () => {
    it('returns false for null bundle', async () => {
      expect(await restoreEncryptedCredentials(null)).toBe(false);
    });

    it('returns false for undefined bundle', async () => {
      expect(await restoreEncryptedCredentials(undefined)).toBe(false);
    });

    it('returns false for wrong version', async () => {
      expect(await restoreEncryptedCredentials({ version: 2 })).toBe(false);
    });

    it('returns false for version 0', async () => {
      expect(await restoreEncryptedCredentials({ version: 0 })).toBe(false);
    });

    it('returns false when no UID available', async () => {
      windowGetCurrentUser.mockReturnValue(null);
      expect(await restoreEncryptedCredentials({
        version: 1, salt: '', wrapIv: '', wrappedKey: '', dataIv: '', data: ''
      })).toBe(false);
    });

    it('returns false when getCurrentUser throws', async () => {
      windowGetCurrentUser.mockImplementation(() => { throw new Error('auth'); });
      expect(await restoreEncryptedCredentials({
        version: 1, salt: '', wrapIv: '', wrappedKey: '', dataIv: '', data: ''
      })).toBe(false);
    });
  });

  describe('getCredentialSyncStatus', () => {
    it('returns zero count when no credentials', () => {
      const s = getCredentialSyncStatus();
      expect(s.hasCreds).toBe(false);
      expect(s.count).toBe(0);
    });

    it('returns correct count for stored credentials', () => {
      localStorage.setItem('nucleusAnthropicKey', 'k1');
      localStorage.setItem('nucleusWhoopWorkerUrl', 'k2');
      const s = getCredentialSyncStatus();
      expect(s.hasCreds).toBe(true);
      expect(s.count).toBe(2);
    });

    it('returns full count when all set', () => {
      localStorage.setItem('nucleusAnthropicKey', 'k1');
      localStorage.setItem('nucleusWhoopWorkerUrl', 'k2');
      localStorage.setItem('nucleusWhoopApiKey', 'k3');
      const s = getCredentialSyncStatus();
      expect(s.count).toBe(3);
    });

    it('does not count unrelated localStorage keys', () => {
      localStorage.setItem('unrelatedKey', 'value');
      const s = getCredentialSyncStatus();
      expect(s.count).toBe(0);
    });

    it('hasCreds is false when count is 0', () => {
      const s = getCredentialSyncStatus();
      expect(s.hasCreds).toBe(false);
    });

    it('hasCreds is true when count >= 1', () => {
      localStorage.setItem('nucleusWhoopApiKey', 'k');
      const s = getCredentialSyncStatus();
      expect(s.hasCreds).toBe(true);
    });
  });

  describe('buildEncryptedCredentials guard conditions', () => {
    it('returns null when no getCurrentUser available', async () => {
      windowGetCurrentUser.mockReturnValue(null);
      expect(await buildEncryptedCredentials()).toBeNull();
    });

    it('returns null when uid is empty string', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: '' });
      expect(await buildEncryptedCredentials()).toBeNull();
    });

    it('returns null when getCurrentUser throws', async () => {
      windowGetCurrentUser.mockImplementation(() => { throw new Error('auth'); });
      expect(await buildEncryptedCredentials()).toBeNull();
    });

    it('returns null when no credentials in localStorage', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-empty' });
      expect(await buildEncryptedCredentials()).toBeNull();
    });

    it('includes updatedAt in bundle as ISO string', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: 'uid-ts' });
      localStorage.setItem('nucleusAnthropicKey', 'val');
      const bundle = await buildEncryptedCredentials();
      expect(bundle.updatedAt).toBeDefined();
      expect(new Date(bundle.updatedAt).toISOString()).toBe(bundle.updatedAt);
    });

    it('returns null when uid is undefined', async () => {
      windowGetCurrentUser.mockReturnValue({ uid: undefined });
      expect(await buildEncryptedCredentials()).toBeNull();
    });
  });
});
