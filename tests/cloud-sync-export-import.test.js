// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ---------------------------------------------------------------------------
const { mockState, MOCK_KEYS, mockSaveData, mockSaveWeights } = vi.hoisted(() => {
  const mockSaveData = vi.fn();
  const mockSaveWeights = vi.fn();

  const mockState = {
    allData: {},
    WEIGHTS: {},
    MAX_SCORES: {},
    CATEGORY_WEIGHTS: {},
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    homeWidgets: [],
    triggers: [],
    meetingNotesByEvent: {},
    xp: { total: 0, history: [] },
    streak: { current: 0, longest: 0, lastLoggedDate: null },
    achievements: { unlocked: {} },
    deletedTaskTombstones: {},
    deletedEntityTombstones: {},
    currentDate: '2026-02-13',
    collapsedNotes: new Set(),
    scoresCache: new Map(),
    scoresCacheVersion: 0,
  };

  const MOCK_KEYS = {
    TASKS_KEY: 'lifeGamificationTasks',
    TASK_CATEGORIES_KEY: 'lifeGamificationTaskCategories',
    TASK_LABELS_KEY: 'lifeGamificationTaskLabels',
    TASK_PEOPLE_KEY: 'lifeGamificationTaskPeople',
    CATEGORIES_KEY: 'lifeGamificationCategories',
    PERSPECTIVES_KEY: 'lifeGamificationPerspectives',
    MAX_SCORES_KEY: 'lifeGamificationMaxScores',
    CATEGORY_WEIGHTS_KEY: 'lifeGamificationCategoryWeights',
    XP_KEY: 'lifeGamificationXP',
    STREAK_KEY: 'lifeGamificationStreak',
    ACHIEVEMENTS_KEY: 'lifeGamificationAchievements',
    HOME_WIDGETS_KEY: 'lifeGamificationHomeWidgets',
    TRIGGERS_KEY: 'lifeGamificationTriggers',
    MEETING_NOTES_KEY: 'nucleusMeetingNotes',
    DELETED_TASK_TOMBSTONES_KEY: 'lifeGamificationDeletedTaskTombstones',
    DELETED_ENTITY_TOMBSTONES_KEY: 'lifeGamificationDeletedEntityTombstones',
  };

  return { mockState, MOCK_KEYS, mockSaveData, mockSaveWeights };
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => ({
  TASKS_KEY: MOCK_KEYS.TASKS_KEY,
  TASK_CATEGORIES_KEY: MOCK_KEYS.TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY: MOCK_KEYS.TASK_LABELS_KEY,
  TASK_PEOPLE_KEY: MOCK_KEYS.TASK_PEOPLE_KEY,
  CATEGORIES_KEY: MOCK_KEYS.CATEGORIES_KEY,
  PERSPECTIVES_KEY: MOCK_KEYS.PERSPECTIVES_KEY,
  MAX_SCORES_KEY: MOCK_KEYS.MAX_SCORES_KEY,
  CATEGORY_WEIGHTS_KEY: MOCK_KEYS.CATEGORY_WEIGHTS_KEY,
  XP_KEY: MOCK_KEYS.XP_KEY,
  STREAK_KEY: MOCK_KEYS.STREAK_KEY,
  ACHIEVEMENTS_KEY: MOCK_KEYS.ACHIEVEMENTS_KEY,
  HOME_WIDGETS_KEY: MOCK_KEYS.HOME_WIDGETS_KEY,
  TRIGGERS_KEY: MOCK_KEYS.TRIGGERS_KEY,
  MEETING_NOTES_KEY: MOCK_KEYS.MEETING_NOTES_KEY,
  DELETED_TASK_TOMBSTONES_KEY: MOCK_KEYS.DELETED_TASK_TOMBSTONES_KEY,
  DELETED_ENTITY_TOMBSTONES_KEY: MOCK_KEYS.DELETED_ENTITY_TOMBSTONES_KEY,
}));

vi.mock('../src/utils.js', () => ({
  getLocalDateString: () => '2026-02-13',
}));

vi.mock('../src/data/storage.js', () => ({
  saveData: mockSaveData,
  saveWeights: mockSaveWeights,
}));

// ---------------------------------------------------------------------------
// Import module under test
// ---------------------------------------------------------------------------
import { exportData, importData } from '../src/data/export-import.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Capture the JSON string passed to Blob constructor during export.
 * Returns { text, parsed, blob } after calling exportData().
 * This avoids needing to call blob.text() which may not work in jsdom.
 */
let capturedBlobText = null;
const OrigBlob = globalThis.Blob;

function captureExportBlob() {
  capturedBlobText = null;
  const origBlob = globalThis.Blob;
  globalThis.Blob = class extends origBlob {
    constructor(parts, options) {
      super(parts, options);
      if (parts && parts.length > 0 && typeof parts[0] === 'string') {
        capturedBlobText = parts[0];
      }
    }
  };
  return {
    getText: () => capturedBlobText,
    getParsed: () => JSON.parse(capturedBlobText),
    restore: () => { globalThis.Blob = origBlob; },
  };
}

/** Create a mock FileReader that calls onload via setTimeout(0) */
function createImportEvent(data) {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  blob.name = 'test.json';
  const originalFileReader = globalThis.FileReader;
  globalThis.FileReader = class {
    readAsText() {
      setTimeout(() => {
        this.onload({ target: { result: json } });
      }, 0);
    }
  };
  const event = { target: { files: [blob] } };
  return { event, cleanup: () => { globalThis.FileReader = originalFileReader; } };
}

/** Reset mockState to clean defaults */
function resetState() {
  mockState.allData = {};
  mockState.WEIGHTS = {};
  mockState.MAX_SCORES = {};
  mockState.CATEGORY_WEIGHTS = {};
  mockState.tasksData = [];
  mockState.taskAreas = [];
  mockState.taskCategories = [];
  mockState.taskLabels = [];
  mockState.taskPeople = [];
  mockState.customPerspectives = [];
  mockState.homeWidgets = [];
  mockState.triggers = [];
  mockState.meetingNotesByEvent = {};
  mockState.xp = { total: 0, history: [] };
  mockState.streak = { current: 0, longest: 0, lastLoggedDate: null };
  mockState.achievements = { unlocked: {} };
  mockState.deletedTaskTombstones = {};
  mockState.deletedEntityTombstones = {};
  mockState.currentDate = '2026-02-13';
}

/** Build a fully-populated export-like data object */
function buildFullExportData() {
  return {
    data: { '2026-02-13': { prayers: { fajr: '1', dhuhr: '1' } } },
    weights: { prayer: { onTime: 5, late: 2 } },
    maxScores: { prayer: 35, total: 96 },
    categoryWeights: { prayer: 20, diabetes: 20 },
    tasks: [
      { id: 'task1', title: 'Buy milk', status: 'inbox' },
      { id: 'task2', title: 'Call dentist', status: 'anytime' },
    ],
    taskCategories: [{ id: 'area1', name: 'Personal' }],
    categories: [{ id: 'cat1', name: 'Work' }],
    taskLabels: [{ id: 'label1', name: 'Urgent' }],
    taskPeople: [{ id: 'person1', name: 'John', email: 'john@example.com' }],
    customPerspectives: [{ id: 'persp1', name: 'Focus' }],
    homeWidgets: [{ id: 'w1', visible: true }],
    triggers: [{ id: 't1', title: 'Trigger' }],
    meetingNotesByEvent: { 'evt1': { notes: 'Discussion about Q1' } },
    xp: { total: 500, history: [{ date: '2026-02-12', xp: 50 }] },
    streak: { current: 7, longest: 14, lastLoggedDate: '2026-02-12' },
    achievements: { unlocked: { 'first-steps': '2026-01-10' } },
    deletedTaskTombstones: { 'task99': '2026-02-01T00:00:00.000Z' },
    deletedEntityTombstones: { taskLabels: { 'label99': '2026-02-01T00:00:00.000Z' } },
    lastUpdated: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------
beforeEach(() => {
  localStorage.clear();
  resetState();
  mockSaveData.mockClear();
  mockSaveWeights.mockClear();
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.invalidateScoresCache = vi.fn();
  window.confirm = vi.fn(() => true);
  window.alert = vi.fn();
});

// ===========================================================================
// exportData
// ===========================================================================
describe('exportData', () => {
  let clickedHref = null;
  let clickedDownload = null;
  let revokedUrl = null;

  beforeEach(() => {
    clickedHref = null;
    clickedDownload = null;
    revokedUrl = null;

    // Mock URL.createObjectURL / revokeObjectURL
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn((url) => { revokedUrl = url; });

    // Mock document.createElement('a') to capture href/download
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        const el = origCreate('a');
        el.click = vi.fn(() => {
          clickedHref = el.href;
          clickedDownload = el.download;
        });
        return el;
      }
      return origCreate(tag);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a download link and clicks it', () => {
    exportData();
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickedDownload).toContain('life-gamification-backup-');
    expect(clickedDownload).toContain('2026-02-13');
  });

  it('creates a JSON blob with correct MIME type', () => {
    exportData();
    const blobArg = URL.createObjectURL.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('application/json');
  });

  it('revokes the object URL after download', () => {
    exportData();
    expect(revokedUrl).toBe('blob:mock-url');
  });

  it('blob size is greater than zero', () => {
    mockState.allData = { '2026-02-13': { prayers: { fajr: '1' } } };
    exportData();
    const blobArg = URL.createObjectURL.mock.calls[0][0];
    expect(blobArg.size).toBeGreaterThan(0);
  });

  it('includes all required top-level keys in exported JSON', () => {
    mockState.allData = { '2026-02-13': {} };
    mockState.WEIGHTS = { prayer: { onTime: 5 } };
    mockState.MAX_SCORES = { prayer: 35 };
    mockState.CATEGORY_WEIGHTS = { prayer: 20 };
    mockState.tasksData = [{ id: 't1', title: 'Test' }];
    mockState.taskAreas = [{ id: 'a1', name: 'Area' }];
    mockState.taskCategories = [{ id: 'c1', name: 'Cat' }];
    mockState.taskLabels = [{ id: 'l1', name: 'Label' }];
    mockState.taskPeople = [{ id: 'p1', name: 'Person' }];
    mockState.customPerspectives = [{ id: 'pp1', name: 'Custom' }];
    mockState.homeWidgets = [{ id: 'w1' }];
    mockState.triggers = [{ id: 'tr1' }];
    mockState.meetingNotesByEvent = { evt1: { notes: 'test' } };
    mockState.xp = { total: 100, history: [] };
    mockState.streak = { current: 5, longest: 10 };
    mockState.achievements = { unlocked: { a: 1 } };
    mockState.deletedTaskTombstones = { t99: '2026-01-01T00:00:00Z' };
    mockState.deletedEntityTombstones = { taskLabels: { l99: '2026-01-01T00:00:00Z' } };

    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();

    expect(parsed).toHaveProperty('data');
    expect(parsed).toHaveProperty('weights');
    expect(parsed).toHaveProperty('maxScores');
    expect(parsed).toHaveProperty('categoryWeights');
    expect(parsed).toHaveProperty('tasks');
    expect(parsed).toHaveProperty('taskCategories');
    expect(parsed).toHaveProperty('categories');
    expect(parsed).toHaveProperty('taskLabels');
    expect(parsed).toHaveProperty('taskPeople');
    expect(parsed).toHaveProperty('customPerspectives');
    expect(parsed).toHaveProperty('homeWidgets');
    expect(parsed).toHaveProperty('triggers');
    expect(parsed).toHaveProperty('meetingNotesByEvent');
    expect(parsed).toHaveProperty('xp');
    expect(parsed).toHaveProperty('streak');
    expect(parsed).toHaveProperty('achievements');
    expect(parsed).toHaveProperty('deletedTaskTombstones');
    expect(parsed).toHaveProperty('deletedEntityTombstones');
    expect(parsed).toHaveProperty('lastUpdated');
  });

  it('maps state.taskAreas to taskCategories key in export', () => {
    mockState.taskAreas = [{ id: 'a1', name: 'Personal' }];
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.taskCategories).toEqual([{ id: 'a1', name: 'Personal' }]);
  });

  it('maps state.taskCategories to categories key in export', () => {
    mockState.taskCategories = [{ id: 'c1', name: 'Work' }];
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.categories).toEqual([{ id: 'c1', name: 'Work' }]);
  });

  it('includes tombstones in export', () => {
    mockState.deletedTaskTombstones = { task_old: '2026-01-05T00:00:00Z' };
    mockState.deletedEntityTombstones = { taskLabels: { lab_old: '2026-01-05T00:00:00Z' } };
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.deletedTaskTombstones).toEqual({ task_old: '2026-01-05T00:00:00Z' });
    expect(parsed.deletedEntityTombstones.taskLabels.lab_old).toBe('2026-01-05T00:00:00Z');
  });

  it('includes meetingNotesByEvent in export', () => {
    mockState.meetingNotesByEvent = { event123: { notes: 'Discussed roadmap' } };
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.meetingNotesByEvent.event123.notes).toBe('Discussed roadmap');
  });

  it('includes gamification data (xp, streak, achievements)', () => {
    mockState.xp = { total: 1200, history: [{ date: '2026-02-13', xp: 80 }] };
    mockState.streak = { current: 10, longest: 20, lastLoggedDate: '2026-02-12' };
    mockState.achievements = { unlocked: { 'weekly-warrior': '2026-02-10' } };
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.xp.total).toBe(1200);
    expect(parsed.streak.current).toBe(10);
    expect(parsed.achievements.unlocked['weekly-warrior']).toBe('2026-02-10');
  });

  it('lastUpdated is a valid ISO date string', () => {
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    const d = new Date(parsed.lastUpdated);
    expect(d.getTime()).toBeGreaterThan(0);
    expect(parsed.lastUpdated).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('empty state produces valid JSON with empty structures', () => {
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.data).toEqual({});
    expect(parsed.tasks).toEqual([]);
    expect(parsed.taskCategories).toEqual([]);
    expect(parsed.taskLabels).toEqual([]);
    expect(parsed.taskPeople).toEqual([]);
    expect(parsed.customPerspectives).toEqual([]);
    expect(parsed.homeWidgets).toEqual([]);
    expect(parsed.triggers).toEqual([]);
    expect(parsed.deletedTaskTombstones).toEqual({});
    expect(parsed.deletedEntityTombstones).toEqual({});
    expect(parsed.meetingNotesByEvent).toEqual({});
  });

  it('defaults meetingNotesByEvent to empty object when state is undefined', () => {
    mockState.meetingNotesByEvent = undefined;
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.meetingNotesByEvent).toEqual({});
  });

  it('defaults tombstones to empty objects when state is undefined', () => {
    mockState.deletedTaskTombstones = undefined;
    mockState.deletedEntityTombstones = undefined;
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const parsed = cap.getParsed();
    expect(parsed.deletedTaskTombstones).toEqual({});
    expect(parsed.deletedEntityTombstones).toEqual({});
  });

  it('export JSON is pretty-printed with 2-space indentation', () => {
    mockState.allData = { '2026-02-13': { prayers: {} } };
    const cap = captureExportBlob();
    exportData();
    cap.restore();
    const text = cap.getText();
    expect(text).toContain('\n');
    expect(text).toContain('  ');
  });

  it('download filename matches expected pattern', () => {
    exportData();
    expect(clickedDownload).toBe('life-gamification-backup-2026-02-13.json');
  });
});

// ===========================================================================
// importData
// ===========================================================================
describe('importData', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when no file is selected', () => {
    const event = { target: { files: [] } };
    importData(event);
    expect(window.alert).not.toHaveBeenCalled();
    expect(window.render).not.toHaveBeenCalled();
  });

  it('does nothing when files[0] is undefined', () => {
    const event = { target: { files: [undefined] } };
    importData(event);
    expect(window.render).not.toHaveBeenCalled();
  });

  it('imports valid data and replaces all state fields', async () => {
    const data = buildFullExportData();
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => {
      expect(window.render).toHaveBeenCalled();
    });
    cleanup();

    expect(mockState.allData).toEqual(data.data);
    expect(mockState.tasksData).toEqual(data.tasks);
    expect(mockState.taskAreas).toEqual(data.taskCategories);
    expect(mockState.taskCategories).toEqual(data.categories);
    expect(mockState.taskLabels).toEqual(data.taskLabels);
    expect(mockState.customPerspectives).toEqual(data.customPerspectives);
    expect(mockState.homeWidgets).toEqual(data.homeWidgets);
    expect(mockState.triggers).toEqual(data.triggers);
    expect(mockState.meetingNotesByEvent).toEqual(data.meetingNotesByEvent);
  });

  it('sets _updatedAt on weights after import', async () => {
    const data = { weights: { prayer: { onTime: 5 } } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockState.WEIGHTS._updatedAt).toBeTruthy();
    expect(new Date(mockState.WEIGHTS._updatedAt).getTime()).toBeGreaterThan(0);
  });

  it('sets _updatedAt on maxScores after import', async () => {
    const data = { maxScores: { prayer: 35 } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockState.MAX_SCORES._updatedAt).toBeTruthy();
  });

  it('sets _updatedAt on categoryWeights after import', async () => {
    const data = { categoryWeights: { prayer: 25 } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockState.CATEGORY_WEIGHTS._updatedAt).toBeTruthy();
  });

  it('sets _updatedAt on xp after import', async () => {
    const data = { xp: { total: 100, history: [] } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockState.xp._updatedAt).toBeTruthy();
  });

  it('sets _updatedAt on streak after import', async () => {
    const data = { streak: { current: 3, longest: 10 } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockState.streak._updatedAt).toBeTruthy();
  });

  it('sets _updatedAt on achievements after import', async () => {
    const data = { achievements: { unlocked: { 'day-one': '2026-01-01' } } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockState.achievements._updatedAt).toBeTruthy();
  });

  it('only updates present fields — missing fields left unchanged', async () => {
    mockState.homeWidgets = [{ id: 'existing', visible: true }];
    mockState.triggers = [{ id: 'existingTrigger' }];
    const data = { tasks: [{ id: 't1', title: 'New task' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.tasksData).toEqual([{ id: 't1', title: 'New task' }]);
    expect(mockState.homeWidgets).toEqual([{ id: 'existing', visible: true }]);
    expect(mockState.triggers).toEqual([{ id: 'existingTrigger' }]);
  });

  it('shows alert on invalid JSON', async () => {
    const invalidJson = 'not valid json {{{';
    const originalFileReader = globalThis.FileReader;
    globalThis.FileReader = class {
      readAsText() {
        setTimeout(() => {
          this.onload({ target: { result: invalidJson } });
        }, 0);
      }
    };
    const event = { target: { files: [new Blob([invalidJson])] } };
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    globalThis.FileReader = originalFileReader;

    const alertMsg = window.alert.mock.calls[0][0];
    expect(alertMsg).toContain('Error importing data');
  });

  it('validation rejects non-object files (array)', async () => {
    // Array is typeof 'object' but has no recognized keys, so validation
    // rejects with "does not contain any recognized Homebase data"
    const { event, cleanup } = createImportEvent([1, 2, 3]);
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('does not contain any recognized');
  });

  it('validation rejects null', async () => {
    const json = 'null';
    const originalFileReader = globalThis.FileReader;
    globalThis.FileReader = class {
      readAsText() {
        setTimeout(() => { this.onload({ target: { result: json } }); }, 0);
      }
    };
    const event = { target: { files: [new Blob([json])] } };
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    globalThis.FileReader = originalFileReader;
    expect(window.alert.mock.calls[0][0]).toContain('not a valid JSON object');
  });

  it('validation rejects files with no recognized keys', async () => {
    const { event, cleanup } = createImportEvent({ foo: 'bar', baz: 123 });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('does not contain any recognized');
  });

  it('validation rejects non-array tasks', async () => {
    const { event, cleanup } = createImportEvent({ tasks: 'not-an-array' });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('tasks must be an array');
  });

  it('validation rejects tasks with missing id (first 5 checked)', async () => {
    const { event, cleanup } = createImportEvent({
      tasks: [{ title: 'No ID' }],
    });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('missing id');
  });

  it('validation rejects non-object data field', async () => {
    const { event, cleanup } = createImportEvent({ data: 'string-not-object' });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('data must be an object');
  });

  it('validation rejects array data field', async () => {
    const { event, cleanup } = createImportEvent({ data: [1, 2, 3] });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('data must be an object');
  });

  it('validation rejects non-array taskCategories', async () => {
    const { event, cleanup } = createImportEvent({ taskCategories: 'wrong' });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('taskCategories must be an array');
  });

  it('validation rejects non-array categories', async () => {
    const { event, cleanup } = createImportEvent({ categories: 42 });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('categories must be an array');
  });

  it('validation rejects non-array taskLabels', async () => {
    const { event, cleanup } = createImportEvent({ taskLabels: {} });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('taskLabels must be an array');
  });

  it('validation rejects non-array taskPeople', async () => {
    const { event, cleanup } = createImportEvent({ taskPeople: 'string' });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('taskPeople must be an array');
  });

  it('validation rejects tasks with non-object entries', async () => {
    const { event, cleanup } = createImportEvent({ tasks: ['not-an-object'] });
    importData(event);
    await vi.waitFor(() => { expect(window.alert).toHaveBeenCalled(); });
    cleanup();
    expect(window.alert.mock.calls[0][0]).toContain('tasks[0] is not an object');
  });

  it('creates pre-import backup in localStorage', async () => {
    mockState.tasksData = [{ id: 'old-task', title: 'Old' }];
    const data = { tasks: [{ id: 'new-task', title: 'New' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    const backup = JSON.parse(localStorage.getItem('lifeGamification_preImportBackup'));
    expect(backup).toBeTruthy();
    expect(backup.tasks).toEqual([{ id: 'old-task', title: 'Old' }]);
  });

  it('pre-import backup includes lastUpdated timestamp', async () => {
    const data = { tasks: [{ id: 't1', title: 'T' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    const backup = JSON.parse(localStorage.getItem('lifeGamification_preImportBackup'));
    expect(backup.lastUpdated).toBeTruthy();
    expect(new Date(backup.lastUpdated).getTime()).toBeGreaterThan(0);
  });

  it('user cancels confirmation — no changes made', async () => {
    window.confirm = vi.fn(() => false);
    mockState.tasksData = [{ id: 'original', title: 'Original' }];
    const data = { tasks: [{ id: 'new', title: 'New' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await new Promise(r => setTimeout(r, 50));
    cleanup();

    expect(mockState.tasksData).toEqual([{ id: 'original', title: 'Original' }]);
    expect(window.render).not.toHaveBeenCalled();
    expect(window.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('import merges task tombstones (spread operator, does not replace)', async () => {
    mockState.deletedTaskTombstones = { existingTask: '2026-01-01T00:00:00Z' };
    const data = {
      deletedTaskTombstones: { newTask: '2026-02-01T00:00:00Z' },
      tasks: [{ id: 't1', title: 'T' }],
    };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.deletedTaskTombstones.existingTask).toBe('2026-01-01T00:00:00Z');
    expect(mockState.deletedTaskTombstones.newTask).toBe('2026-02-01T00:00:00Z');
  });

  it('import merges entity tombstones per-collection (does not replace)', async () => {
    mockState.deletedEntityTombstones = {
      taskLabels: { existingLabel: '2026-01-01T00:00:00Z' },
      taskPeople: { existingPerson: '2026-01-05T00:00:00Z' },
    };
    const data = {
      deletedEntityTombstones: {
        taskLabels: { newLabel: '2026-02-01T00:00:00Z' },
        categories: { newCat: '2026-02-05T00:00:00Z' },
      },
      tasks: [{ id: 't1', title: 'T' }],
    };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.deletedEntityTombstones.taskLabels.existingLabel).toBe('2026-01-01T00:00:00Z');
    expect(mockState.deletedEntityTombstones.taskLabels.newLabel).toBe('2026-02-01T00:00:00Z');
    expect(mockState.deletedEntityTombstones.taskPeople.existingPerson).toBe('2026-01-05T00:00:00Z');
    expect(mockState.deletedEntityTombstones.categories.newCat).toBe('2026-02-05T00:00:00Z');
  });

  it('import triggers debouncedSaveToGithub', async () => {
    const data = buildFullExportData();
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('import triggers render', async () => {
    const data = buildFullExportData();
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(window.render).toHaveBeenCalled();
  });

  it('import triggers invalidateScoresCache', async () => {
    const data = buildFullExportData();
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(window.invalidateScoresCache).toHaveBeenCalled();
  });

  it('person data gets email field normalization (missing email becomes empty string)', async () => {
    const data = {
      taskPeople: [
        { id: 'p1', name: 'Alice' },
        { id: 'p2', name: 'Bob', email: null },
        { id: 'p3', name: 'Carol', email: 123 },
        { id: 'p4', name: 'Dave', email: 'd@e.com' },
      ],
    };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.taskPeople[0].email).toBe('');
    expect(mockState.taskPeople[1].email).toBe('');
    expect(mockState.taskPeople[2].email).toBe('');
    expect(mockState.taskPeople[3].email).toBe('d@e.com');
  });

  it('import calls saveData when data field is present', async () => {
    const data = { data: { '2026-02-13': { prayers: {} } } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockSaveData).toHaveBeenCalled();
  });

  it('import calls saveWeights when weights field is present', async () => {
    const data = { weights: { prayer: { onTime: 5 } } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    expect(mockSaveWeights).toHaveBeenCalled();
  });

  it('import writes maxScores directly to localStorage', async () => {
    const data = { maxScores: { prayer: 40, total: 100 } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.MAX_SCORES_KEY));
    expect(stored.prayer).toBe(40);
    expect(stored._updatedAt).toBeTruthy();
  });

  it('import writes categoryWeights directly to localStorage', async () => {
    const data = { categoryWeights: { prayer: 25, diabetes: 25 } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.CATEGORY_WEIGHTS_KEY));
    expect(stored.prayer).toBe(25);
  });

  it('import writes tasks to localStorage', async () => {
    const data = { tasks: [{ id: 't1', title: 'Test' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(stored).toEqual([{ id: 't1', title: 'Test' }]);
  });

  it('import writes taskAreas (from taskCategories key) to localStorage', async () => {
    const data = { taskCategories: [{ id: 'a1', name: 'Personal' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_CATEGORIES_KEY));
    expect(stored).toEqual([{ id: 'a1', name: 'Personal' }]);
  });

  it('import writes categories to localStorage', async () => {
    const data = { categories: [{ id: 'c1', name: 'Sub-area' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.CATEGORIES_KEY));
    expect(stored).toEqual([{ id: 'c1', name: 'Sub-area' }]);
  });

  it('import writes homeWidgets to localStorage', async () => {
    const data = { homeWidgets: [{ id: 'w1', visible: false }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.HOME_WIDGETS_KEY));
    expect(stored).toEqual([{ id: 'w1', visible: false }]);
  });

  it('import writes triggers to localStorage', async () => {
    const data = { triggers: [{ id: 'tr1', title: 'Weekly review' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TRIGGERS_KEY));
    expect(stored).toEqual([{ id: 'tr1', title: 'Weekly review' }]);
  });

  it('import writes meetingNotesByEvent to localStorage', async () => {
    const data = { meetingNotesByEvent: { ev1: { notes: 'Action items discussed' } } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.MEETING_NOTES_KEY));
    expect(stored.ev1.notes).toBe('Action items discussed');
  });

  it('import writes xp to localStorage', async () => {
    const data = { xp: { total: 999, history: [{ xp: 50 }] } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.XP_KEY));
    expect(stored.total).toBe(999);
  });

  it('import writes streak to localStorage', async () => {
    const data = { streak: { current: 5, longest: 12, lastLoggedDate: '2026-02-12' } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STREAK_KEY));
    expect(stored.current).toBe(5);
  });

  it('import writes achievements to localStorage', async () => {
    const data = { achievements: { unlocked: { 'day-one': '2026-01-01' } } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.ACHIEVEMENTS_KEY));
    expect(stored.unlocked['day-one']).toBe('2026-01-01');
  });

  it('import writes deletedTaskTombstones to localStorage', async () => {
    const data = {
      deletedTaskTombstones: { del1: '2026-01-15T00:00:00Z' },
      tasks: [{ id: 't1', title: 'T' }],
    };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.DELETED_TASK_TOMBSTONES_KEY));
    expect(stored.del1).toBe('2026-01-15T00:00:00Z');
  });

  it('import writes deletedEntityTombstones to localStorage', async () => {
    const data = {
      deletedEntityTombstones: { taskLabels: { lab1: '2026-01-20T00:00:00Z' } },
      tasks: [{ id: 't1', title: 'T' }],
    };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.DELETED_ENTITY_TOMBSTONES_KEY));
    expect(stored.taskLabels.lab1).toBe('2026-01-20T00:00:00Z');
  });

  it('shows success alert after valid import', async () => {
    const data = { tasks: [{ id: 't1', title: 'T' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const alertCalls = window.alert.mock.calls.map(c => c[0]);
    expect(alertCalls.some(msg => msg.includes('imported successfully'))).toBe(true);
  });

  it('confirmation dialog shows task count', async () => {
    const data = { tasks: [{ id: 't1', title: 'A' }, { id: 't2', title: 'B' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const confirmMsg = window.confirm.mock.calls[0][0];
    expect(confirmMsg).toContain('2 tasks');
  });

  it('confirmation dialog shows date count', async () => {
    const data = {
      data: { '2026-02-10': {}, '2026-02-11': {}, '2026-02-12': {} },
      tasks: [{ id: 't1', title: 'T' }],
    };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const confirmMsg = window.confirm.mock.calls[0][0];
    expect(confirmMsg).toContain('3 days');
  });

  it('does not throw when invalidateScoresCache is not a function', async () => {
    window.invalidateScoresCache = undefined;
    const data = { data: { '2026-02-13': {} } };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
  });

  it('writes perspectives to localStorage', async () => {
    const data = { customPerspectives: [{ id: 'cp1', name: 'Focus Mode' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.PERSPECTIVES_KEY));
    expect(stored).toEqual([{ id: 'cp1', name: 'Focus Mode' }]);
  });

  it('writes taskPeople to localStorage with normalized email', async () => {
    const data = { taskPeople: [{ id: 'p1', name: 'Alice' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_PEOPLE_KEY));
    expect(stored[0].email).toBe('');
  });

  it('writes taskLabels to localStorage', async () => {
    const data = { taskLabels: [{ id: 'lb1', name: 'Urgent', color: '#FF0000' }] };
    const { event, cleanup } = createImportEvent(data);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_LABELS_KEY));
    expect(stored).toEqual([{ id: 'lb1', name: 'Urgent', color: '#FF0000' }]);
  });
});

// ===========================================================================
// Round-trip parity
// ===========================================================================
describe('round-trip parity (export then import)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper: set up export mocks, call exportData(), capture the blob text
   * via the Blob constructor intercept, then return the parsed JSON.
   */
  function exportAndCapture() {
    const origCreate = document.createElement.bind(document);
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:test');
    globalThis.URL.revokeObjectURL = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') {
        const el = origCreate('a');
        el.click = vi.fn();
        return el;
      }
      return origCreate(tag);
    });

    const cap = captureExportBlob();
    exportData();
    cap.restore();
    return cap.getParsed();
  }

  it('export then import produces identical core state fields', async () => {
    mockState.allData = { '2026-02-13': { prayers: { fajr: '1', dhuhr: '0.1' }, habits: { exercise: 1 } } };
    mockState.WEIGHTS = { prayer: { onTime: 5, late: 2 } };
    mockState.MAX_SCORES = { prayer: 35, total: 96 };
    mockState.CATEGORY_WEIGHTS = { prayer: 20, diabetes: 20 };
    mockState.tasksData = [
      { id: 'task1', title: 'Buy milk', status: 'inbox', labels: ['l1'], people: ['p1'] },
      { id: 'task2', title: 'Write report', status: 'anytime', flagged: true },
    ];
    mockState.taskAreas = [{ id: 'a1', name: 'Personal', color: '#4A90A4' }];
    mockState.taskCategories = [{ id: 'c1', name: 'Work', parentId: 'a1' }];
    mockState.taskLabels = [{ id: 'l1', name: 'Urgent', color: '#DC2626' }];
    mockState.taskPeople = [{ id: 'p1', name: 'Self', email: 'self@test.com' }];
    mockState.customPerspectives = [{ id: 'persp1', name: 'Focus', filter: {} }];
    mockState.homeWidgets = [{ id: 'quick-stats', visible: true, order: 0 }];
    mockState.triggers = [{ id: 't1', title: 'Weekly trigger', items: [] }];
    mockState.meetingNotesByEvent = { evt1: { notes: 'Q1 review' } };
    mockState.xp = { total: 1500, history: [{ date: '2026-02-12', xp: 80 }] };
    mockState.streak = { current: 14, longest: 30, lastLoggedDate: '2026-02-12' };
    mockState.achievements = { unlocked: { 'weekly-warrior': '2026-02-05', 'first-steps': '2026-01-03' } };
    mockState.deletedTaskTombstones = { oldTask: '2026-01-15T00:00:00.000Z' };
    mockState.deletedEntityTombstones = { taskLabels: { oldLabel: '2026-01-20T00:00:00.000Z' } };

    const origAllData = JSON.parse(JSON.stringify(mockState.allData));
    const origTasks = JSON.parse(JSON.stringify(mockState.tasksData));
    const origTaskAreas = JSON.parse(JSON.stringify(mockState.taskAreas));
    const origTaskCategories = JSON.parse(JSON.stringify(mockState.taskCategories));
    const origTaskLabels = JSON.parse(JSON.stringify(mockState.taskLabels));
    const origCustomPerspectives = JSON.parse(JSON.stringify(mockState.customPerspectives));
    const origHomeWidgets = JSON.parse(JSON.stringify(mockState.homeWidgets));
    const origTriggers = JSON.parse(JSON.stringify(mockState.triggers));
    const origMeetingNotes = JSON.parse(JSON.stringify(mockState.meetingNotesByEvent));

    const exportedData = exportAndCapture();
    vi.restoreAllMocks();
    resetState();

    const { event, cleanup } = createImportEvent(exportedData);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.allData).toEqual(origAllData);
    expect(mockState.tasksData).toEqual(origTasks);
    expect(mockState.taskAreas).toEqual(origTaskAreas);
    expect(mockState.taskCategories).toEqual(origTaskCategories);
    expect(mockState.taskLabels).toEqual(origTaskLabels);
    expect(mockState.customPerspectives).toEqual(origCustomPerspectives);
    expect(mockState.homeWidgets).toEqual(origHomeWidgets);
    expect(mockState.triggers).toEqual(origTriggers);
    expect(mockState.meetingNotesByEvent).toEqual(origMeetingNotes);
  });

  it('all tombstones survive round-trip', async () => {
    mockState.deletedTaskTombstones = {
      'task_del1': '2026-01-10T12:00:00.000Z',
      'task_del2': '2026-01-15T18:30:00.000Z',
    };
    mockState.deletedEntityTombstones = {
      taskLabels: { 'label_del1': '2026-01-10T12:00:00.000Z' },
      taskPeople: { 'person_del1': '2026-01-20T09:00:00.000Z' },
    };

    const origTaskTombstones = JSON.parse(JSON.stringify(mockState.deletedTaskTombstones));
    const origEntityTombstones = JSON.parse(JSON.stringify(mockState.deletedEntityTombstones));

    const exportedData = exportAndCapture();
    vi.restoreAllMocks();
    resetState();

    const { event, cleanup } = createImportEvent(exportedData);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.deletedTaskTombstones).toEqual(origTaskTombstones);
    expect(mockState.deletedEntityTombstones).toEqual(origEntityTombstones);
  });

  it('all task metadata survives round-trip', async () => {
    mockState.tasksData = [
      {
        id: 'task_rt1',
        title: 'Complex task',
        status: 'anytime',
        today: true,
        flagged: true,
        areaId: 'area1',
        categoryId: 'cat1',
        labels: ['label1', 'label2'],
        people: ['person1'],
        notes: 'Detailed notes here',
        dueDate: '2026-03-01',
        deferDate: '2026-02-20',
        completedDate: null,
        parentId: null,
        order: 5,
        isNote: false,
        repeat: { type: 'weekly', interval: 1 },
      },
    ];

    const origTasks = JSON.parse(JSON.stringify(mockState.tasksData));
    const exportedData = exportAndCapture();
    vi.restoreAllMocks();
    resetState();

    const { event, cleanup } = createImportEvent(exportedData);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.tasksData).toEqual(origTasks);
  });

  it('weights get _updatedAt in round-trip but original values preserved', async () => {
    mockState.WEIGHTS = { prayer: { onTime: 5, late: 2 }, glucose: { avgMax: 10 } };

    const exportedData = exportAndCapture();
    vi.restoreAllMocks();
    resetState();

    const { event, cleanup } = createImportEvent(exportedData);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.WEIGHTS.prayer.onTime).toBe(5);
    expect(mockState.WEIGHTS.prayer.late).toBe(2);
    expect(mockState.WEIGHTS.glucose.avgMax).toBe(10);
    expect(mockState.WEIGHTS._updatedAt).toBeTruthy();
  });

  it('gamification data survives round-trip (xp, streak, achievements)', async () => {
    mockState.xp = { total: 2500, history: [{ date: '2026-02-10', xp: 100 }, { date: '2026-02-11', xp: 90 }] };
    mockState.streak = { current: 21, longest: 50, lastLoggedDate: '2026-02-12' };
    mockState.achievements = { unlocked: { 'weekly-warrior': '2026-02-01', 'perfect-prayer': '2026-01-15' } };

    const exportedData = exportAndCapture();
    vi.restoreAllMocks();
    resetState();

    const { event, cleanup } = createImportEvent(exportedData);
    importData(event);
    await vi.waitFor(() => { expect(window.render).toHaveBeenCalled(); });
    cleanup();

    expect(mockState.xp.total).toBe(2500);
    expect(mockState.xp.history.length).toBe(2);
    expect(mockState.streak.current).toBe(21);
    expect(mockState.streak.longest).toBe(50);
    expect(mockState.achievements.unlocked['weekly-warrior']).toBe('2026-02-01');
    expect(mockState.achievements.unlocked['perfect-prayer']).toBe('2026-01-15');
  });
});
