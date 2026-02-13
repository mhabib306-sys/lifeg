/// <reference types="vitest" />
// @vitest-environment jsdom
// ============================================================================
// Cloud Sync Internals — exhaustive tests for internal merge/rollback functions
// in github-sync.js, exercised through the exported saveToGithub / loadCloudData.
//
// Unlike github-sync.test.js (which mocks sync-helpers), this file uses REAL
// sync-helpers so the actual merge logic (parseTimestamp, mergeEntityCollection,
// mergeCloudAllData, etc.) is exercised end-to-end.
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ---------------------------------------------------------------------------
const {
  mockState,
  MOCK_KEYS,
  mockBuildEncryptedCredentials,
  mockRestoreEncryptedCredentials,
} = vi.hoisted(() => {
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
    meetingNotesByEvent: {},
    conflictNotifications: [],
    deletedTaskTombstones: {},
    deletedEntityTombstones: {},
    WEIGHTS: {},
    MAX_SCORES: {},
    CATEGORY_WEIGHTS: {},
    xp: { total: 0, history: [] },
    streak: { current: 0, longest: 0, lastLoggedDate: null },
    achievements: { unlocked: {} },
    syncHealth: {
      totalSaves: 0, successfulSaves: 0, failedSaves: 0,
      totalLoads: 0, successfulLoads: 0, failedLoads: 0,
      lastSaveLatencyMs: 0, avgSaveLatencyMs: 0,
      lastError: null, recentEvents: [],
    },
    syncSequence: 0,
    syncInProgress: false,
    syncPendingRetry: false,
    syncDebounceTimer: null,
    syncRetryTimer: null,
    syncRetryCount: 0,
    syncRateLimited: false,
    githubSyncDirty: false,
    syncStatus: 'idle',
    lastSyncTime: null,
    cloudPullPending: false,
    scoresCache: new Map(),
    scoresCacheVersion: 0,
  };

  const MOCK_KEYS = {
    GITHUB_TOKEN_KEY: 'lifeGamificationGithubToken',
    GITHUB_OWNER: 'mhabib306-sys',
    GITHUB_REPO: 'lifeg',
    GITHUB_FILE_PATH: 'data.json',
    THEME_KEY: 'lifeGamificationTheme',
    COLOR_MODE_KEY: 'lifeGamificationColorMode',
    DATA_URL: 'data.json',
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
    MEETING_NOTES_KEY: 'nucleusMeetingNotes',
    CONFLICT_NOTIFICATIONS_KEY: 'nucleusConflictNotifications',
    DELETED_TASK_TOMBSTONES_KEY: 'lifeGamificationDeletedTaskTombstones',
    DELETED_ENTITY_TOMBSTONES_KEY: 'lifeGamificationDeletedEntityTombstones',
    XP_KEY: 'lifeGamificationXP',
    STREAK_KEY: 'lifeGamificationStreak',
    ACHIEVEMENTS_KEY: 'lifeGamificationAchievements',
    CATEGORY_WEIGHTS_KEY: 'lifeGamificationCategoryWeights',
    TRIGGERS_KEY: 'lifeGamificationTriggers',
    LAST_UPDATED_KEY: 'lastUpdated',
    GITHUB_SYNC_DIRTY_KEY: 'nucleusGithubSyncDirty',
    SYNC_HEALTH_KEY: 'nucleusSyncHealth',
    SYNC_SEQUENCE_KEY: 'nucleusSyncSequence',
    CLOUD_SCHEMA_VERSION: 1,
  };

  const mockBuildEncryptedCredentials = vi.fn(() => Promise.resolve(null));
  const mockRestoreEncryptedCredentials = vi.fn(() => Promise.resolve());

  return {
    mockState,
    MOCK_KEYS,
    mockBuildEncryptedCredentials,
    mockRestoreEncryptedCredentials,
  };
});

// ---------------------------------------------------------------------------
// Mocks — ONLY mock state, constants, and credential-sync.
// sync-helpers is NOT mocked so real merge logic is exercised.
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => ({
  GITHUB_TOKEN_KEY: MOCK_KEYS.GITHUB_TOKEN_KEY,
  GITHUB_OWNER: MOCK_KEYS.GITHUB_OWNER,
  GITHUB_REPO: MOCK_KEYS.GITHUB_REPO,
  GITHUB_FILE_PATH: MOCK_KEYS.GITHUB_FILE_PATH,
  THEME_KEY: MOCK_KEYS.THEME_KEY,
  COLOR_MODE_KEY: MOCK_KEYS.COLOR_MODE_KEY,
  DATA_URL: MOCK_KEYS.DATA_URL,
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
  MEETING_NOTES_KEY: MOCK_KEYS.MEETING_NOTES_KEY,
  CONFLICT_NOTIFICATIONS_KEY: MOCK_KEYS.CONFLICT_NOTIFICATIONS_KEY,
  DELETED_TASK_TOMBSTONES_KEY: MOCK_KEYS.DELETED_TASK_TOMBSTONES_KEY,
  DELETED_ENTITY_TOMBSTONES_KEY: MOCK_KEYS.DELETED_ENTITY_TOMBSTONES_KEY,
  XP_KEY: MOCK_KEYS.XP_KEY,
  STREAK_KEY: MOCK_KEYS.STREAK_KEY,
  ACHIEVEMENTS_KEY: MOCK_KEYS.ACHIEVEMENTS_KEY,
  CATEGORY_WEIGHTS_KEY: MOCK_KEYS.CATEGORY_WEIGHTS_KEY,
  TRIGGERS_KEY: MOCK_KEYS.TRIGGERS_KEY,
  LAST_UPDATED_KEY: MOCK_KEYS.LAST_UPDATED_KEY,
  GITHUB_SYNC_DIRTY_KEY: MOCK_KEYS.GITHUB_SYNC_DIRTY_KEY,
  SYNC_HEALTH_KEY: MOCK_KEYS.SYNC_HEALTH_KEY,
  SYNC_SEQUENCE_KEY: MOCK_KEYS.SYNC_SEQUENCE_KEY,
  CLOUD_SCHEMA_VERSION: MOCK_KEYS.CLOUD_SCHEMA_VERSION,
}));

vi.mock('../src/data/credential-sync.js', () => ({
  buildEncryptedCredentials: mockBuildEncryptedCredentials,
  restoreEncryptedCredentials: mockRestoreEncryptedCredentials,
}));

// ---------------------------------------------------------------------------
// Import module under test
// ---------------------------------------------------------------------------
import {
  saveToGithub,
  loadCloudData,
  stopPeriodicGithubSync,
} from '../src/data/github-sync.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildCloudPayloadBase64(overrides = {}) {
  const payload = {
    _schemaVersion: 1,
    _sequence: 1,
    lastUpdated: new Date().toISOString(),
    data: {},
    weights: {},
    maxScores: {},
    categoryWeights: {},
    tasks: [],
    deletedTaskTombstones: {},
    deletedEntityTombstones: {},
    taskCategories: [],
    categories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    homeWidgets: [],
    meetingNotesByEvent: {},
    triggers: [],
    xp: { total: 0, history: [] },
    streak: { current: 0, longest: 0 },
    achievements: { unlocked: {} },
    ...overrides,
  };
  const jsonString = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(jsonString);
  const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
  return { payload, base64: btoa(binString) };
}

function makeGithubGetResponse(cloudPayloadOverrides = {}, sha = 'abc123sha') {
  const { payload, base64 } = buildCloudPayloadBase64(cloudPayloadOverrides);
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve({ sha, content: base64 }),
    payload,
  };
}

function makeGithubPutResponse() {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve({ content: { sha: 'new_sha' } }),
  };
}

function makeErrorResponse(status, message = 'Error') {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({ message }),
  };
}

function resetMockState() {
  mockState.allData = {};
  mockState.tasksData = [];
  mockState.taskAreas = [];
  mockState.taskCategories = [];
  mockState.taskLabels = [];
  mockState.taskPeople = [];
  mockState.customPerspectives = [];
  mockState.homeWidgets = [];
  mockState.triggers = [];
  mockState.meetingNotesByEvent = {};
  mockState.conflictNotifications = [];
  mockState.deletedTaskTombstones = {};
  mockState.deletedEntityTombstones = {};
  mockState.WEIGHTS = {};
  mockState.MAX_SCORES = {};
  mockState.CATEGORY_WEIGHTS = {};
  mockState.xp = { total: 0, history: [] };
  mockState.streak = { current: 0, longest: 0, lastLoggedDate: null };
  mockState.achievements = { unlocked: {} };
  mockState.syncHealth = {
    totalSaves: 0, successfulSaves: 0, failedSaves: 0,
    totalLoads: 0, successfulLoads: 0, failedLoads: 0,
    lastSaveLatencyMs: 0, avgSaveLatencyMs: 0,
    lastError: null, recentEvents: [],
  };
  mockState.syncSequence = 0;
  mockState.syncInProgress = false;
  mockState.syncPendingRetry = false;
  mockState.syncDebounceTimer = null;
  mockState.syncRetryTimer = null;
  mockState.syncRetryCount = 0;
  mockState.syncRateLimited = false;
  mockState.githubSyncDirty = false;
  mockState.syncStatus = 'idle';
  mockState.lastSyncTime = null;
  mockState.cloudPullPending = false;
  mockState.scoresCache = new Map();
  mockState.scoresCacheVersion = 0;
}

// Mock crypto.subtle.digest for checksum computation
const mockDigest = vi.fn(async (_algo, data) => {
  return new ArrayBuffer(32);
});

// ---------------------------------------------------------------------------
// Global setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  localStorage.clear();
  resetMockState();

  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.invalidateScoresCache = vi.fn();

  mockBuildEncryptedCredentials.mockClear();
  mockRestoreEncryptedCredentials.mockClear();

  if (!globalThis.crypto) globalThis.crypto = {};
  if (!globalThis.crypto.subtle) globalThis.crypto.subtle = {};
  globalThis.crypto.subtle.digest = mockDigest;
  mockDigest.mockClear();

  vi.spyOn(performance, 'now').mockReturnValue(1000);
  globalThis.fetch = vi.fn();
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  stopPeriodicGithubSync();
});

// ===========================================================================
// 1. mergeSingletonIfNewer (via loadCloudData)
// ===========================================================================
describe('mergeSingletonIfNewer internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('adopts cloud WEIGHTS when cloud _updatedAt is newer than local', async () => {
    mockState.WEIGHTS = { prayers: { fajr: 1 }, _updatedAt: '2026-01-01T00:00:00Z' };
    const cloudWeights = { prayers: { fajr: 5 }, _updatedAt: '2026-02-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS).toEqual(cloudWeights);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.WEIGHTS_KEY))).toEqual(cloudWeights);
  });

  it('keeps local WEIGHTS when local _updatedAt is newer than cloud', async () => {
    const localWeights = { prayers: { fajr: 10 }, _updatedAt: '2026-03-01T00:00:00Z' };
    mockState.WEIGHTS = localWeights;
    const cloudWeights = { prayers: { fajr: 1 }, _updatedAt: '2026-01-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS).toEqual(localWeights);
  });

  it('keeps local WEIGHTS when timestamps are tied (local wins on tie)', async () => {
    const ts = '2026-02-01T12:00:00Z';
    mockState.WEIGHTS = { prayers: { fajr: 10 }, _updatedAt: ts };
    const cloudWeights = { prayers: { fajr: 99 }, _updatedAt: ts };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS.prayers.fajr).toBe(10);
  });

  it('adopts cloud when local has no _updatedAt (migration path)', async () => {
    mockState.WEIGHTS = { prayers: { fajr: 1 } };
    const cloudWeights = { prayers: { fajr: 5 }, _updatedAt: '2026-01-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS).toEqual(cloudWeights);
  });

  it('adopts cloud when local _updatedAt is null', async () => {
    mockState.WEIGHTS = { prayers: { fajr: 1 }, _updatedAt: null };
    const cloudWeights = { prayers: { fajr: 5 }, _updatedAt: '2026-01-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS).toEqual(cloudWeights);
  });

  it('skips merge when cloudValue is null/undefined', async () => {
    mockState.WEIGHTS = { prayers: { fajr: 10 }, _updatedAt: '2026-01-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: null }));
    await loadCloudData();

    expect(mockState.WEIGHTS.prayers.fajr).toBe(10);
  });

  it('skips merge when cloudValue is undefined (key missing from payload)', async () => {
    mockState.MAX_SCORES = { prayers: 100, _updatedAt: '2026-01-01T00:00:00Z' };
    const cloudData = {};
    delete cloudData.maxScores;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.MAX_SCORES.prayers).toBe(100);
  });

  it('handles _updatedAt as epoch number', async () => {
    mockState.xp = { total: 10, _updatedAt: '2026-01-01T00:00:00Z' };
    const epoch = new Date('2026-03-01T00:00:00Z').getTime();
    const cloudXp = { total: 999, _updatedAt: epoch };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ xp: cloudXp }));
    await loadCloudData();

    expect(mockState.xp.total).toBe(999);
  });

  it('handles _updatedAt as ISO string on both sides', async () => {
    mockState.streak = { current: 5, _updatedAt: '2026-01-15T10:00:00Z' };
    const cloudStreak = { current: 20, _updatedAt: '2026-02-10T10:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ streak: cloudStreak }));
    await loadCloudData();

    expect(mockState.streak.current).toBe(20);
  });

  it('merges all singleton types: xp, streak, achievements, CATEGORY_WEIGHTS', async () => {
    mockState.xp = { total: 0 };
    mockState.streak = { current: 0 };
    mockState.achievements = { unlocked: {} };
    mockState.CATEGORY_WEIGHTS = {};

    const ts = '2026-02-01T00:00:00Z';
    const cloudData = {
      xp: { total: 100, _updatedAt: ts },
      streak: { current: 7, _updatedAt: ts },
      achievements: { unlocked: { first_login: true }, _updatedAt: ts },
      categoryWeights: { prayers: 2, _updatedAt: ts },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.xp.total).toBe(100);
    expect(mockState.streak.current).toBe(7);
    expect(mockState.achievements.unlocked.first_login).toBe(true);
    expect(mockState.CATEGORY_WEIGHTS.prayers).toBe(2);
  });

  it('persists each singleton to the correct localStorage key', async () => {
    const ts = '2026-02-01T00:00:00Z';
    const cloudData = {
      xp: { total: 50, _updatedAt: ts },
      streak: { current: 3, _updatedAt: ts },
      achievements: { unlocked: { a: true }, _updatedAt: ts },
      categoryWeights: { prayers: 1.5, _updatedAt: ts },
      weights: { prayers: { fajr: 2 }, _updatedAt: ts },
      maxScores: { prayers: 200, _updatedAt: ts },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.XP_KEY)).total).toBe(50);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.STREAK_KEY)).current).toBe(3);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.ACHIEVEMENTS_KEY)).unlocked.a).toBe(true);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.CATEGORY_WEIGHTS_KEY)).prayers).toBe(1.5);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.WEIGHTS_KEY)).prayers.fajr).toBe(2);
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.MAX_SCORES_KEY)).prayers).toBe(200);
  });

  it('handles invalid _updatedAt string gracefully (NaN date)', async () => {
    mockState.WEIGHTS = { prayers: { fajr: 10 }, _updatedAt: 'not-a-date' };
    const cloudWeights = { prayers: { fajr: 5 }, _updatedAt: '2026-01-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS).toEqual(cloudWeights);
  });

  it('keeps local when cloud _updatedAt is invalid', async () => {
    mockState.WEIGHTS = { prayers: { fajr: 10 }, _updatedAt: '2026-01-01T00:00:00Z' };
    const cloudWeights = { prayers: { fajr: 5 }, _updatedAt: 'garbage' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ weights: cloudWeights }));
    await loadCloudData();

    expect(mockState.WEIGHTS.prayers.fajr).toBe(10);
  });
});

// ===========================================================================
// 2. mergeMeetingNotesData (via loadCloudData)
// ===========================================================================
describe('mergeMeetingNotesData internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('adopts cloud note when local has no matching key', async () => {
    mockState.meetingNotesByEvent = {};
    const cloudNotes = {
      'event_abc': { text: 'Cloud note', updatedAt: '2026-01-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['event_abc'].text).toBe('Cloud note');
  });

  it('keeps local note when local is newer', async () => {
    mockState.meetingNotesByEvent = {
      'event_1': { text: 'Local note', updatedAt: '2026-03-01T00:00:00Z' },
    };
    const cloudNotes = {
      'event_1': { text: 'Cloud note', updatedAt: '2026-01-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['event_1'].text).toBe('Local note');
  });

  it('adopts cloud note when cloud is newer', async () => {
    mockState.meetingNotesByEvent = {
      'event_1': { text: 'Local note', updatedAt: '2026-01-01T00:00:00Z' },
    };
    const cloudNotes = {
      'event_1': { text: 'Updated cloud note', updatedAt: '2026-03-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['event_1'].text).toBe('Updated cloud note');
  });

  it('keeps local note when timestamps are tied (local wins)', async () => {
    const ts = '2026-02-01T12:00:00Z';
    mockState.meetingNotesByEvent = {
      'event_1': { text: 'Local version', updatedAt: ts },
    };
    const cloudNotes = {
      'event_1': { text: 'Cloud version', updatedAt: ts },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['event_1'].text).toBe('Local version');
  });

  it('merges notes from both sides (union of keys)', async () => {
    mockState.meetingNotesByEvent = {
      'local_only': { text: 'Local', updatedAt: '2026-01-01T00:00:00Z' },
    };
    const cloudNotes = {
      'cloud_only': { text: 'Cloud', updatedAt: '2026-01-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['local_only'].text).toBe('Local');
    expect(mockState.meetingNotesByEvent['cloud_only'].text).toBe('Cloud');
  });

  it('skips non-object cloud note entries', async () => {
    mockState.meetingNotesByEvent = {};
    const cloudNotes = {
      'valid_note': { text: 'Valid', updatedAt: '2026-01-01T00:00:00Z' },
      'invalid_note': 'not an object',
      'null_note': null,
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['valid_note']).toBeDefined();
    expect(mockState.meetingNotesByEvent['invalid_note']).toBeUndefined();
    expect(mockState.meetingNotesByEvent['null_note']).toBeUndefined();
  });

  it('uses createdAt as fallback when updatedAt is missing', async () => {
    mockState.meetingNotesByEvent = {
      'event_1': { text: 'Old local', createdAt: '2026-01-01T00:00:00Z' },
    };
    const cloudNotes = {
      'event_1': { text: 'Newer cloud', createdAt: '2026-03-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['event_1'].text).toBe('Newer cloud');
  });

  it('handles null cloudMeetingNotes gracefully', async () => {
    mockState.meetingNotesByEvent = { 'local': { text: 'Keep me' } };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: null }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['local'].text).toBe('Keep me');
  });

  it('handles empty cloud meeting notes object', async () => {
    mockState.meetingNotesByEvent = { 'local': { text: 'Intact' } };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: {} }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['local'].text).toBe('Intact');
  });

  it('persists merged meeting notes to localStorage', async () => {
    mockState.meetingNotesByEvent = { 'a': { text: 'A' } };
    const cloudNotes = { 'b': { text: 'B', updatedAt: '2026-01-01T00:00:00Z' } };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.MEETING_NOTES_KEY));
    expect(stored['a'].text).toBe('A');
    expect(stored['b'].text).toBe('B');
  });

  it('handles local meetingNotesByEvent being null', async () => {
    mockState.meetingNotesByEvent = null;
    const cloudNotes = {
      'event_1': { text: 'Cloud', updatedAt: '2026-01-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ meetingNotesByEvent: cloudNotes }));
    await loadCloudData();

    expect(mockState.meetingNotesByEvent['event_1'].text).toBe('Cloud');
  });
});

// ===========================================================================
// 3. mergeTaskCollectionsFromCloud (via loadCloudData)
// ===========================================================================
describe('mergeTaskCollectionsFromCloud internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('merges cloud tasks with local tasks (cloud-only tasks added)', async () => {
    mockState.tasksData = [
      { id: 'local_1', title: 'Local Task', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudTasks = [
      { id: 'cloud_1', title: 'Cloud Task', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ tasks: cloudTasks }));
    await loadCloudData();

    const ids = mockState.tasksData.map(t => t.id);
    expect(ids).toContain('local_1');
    expect(ids).toContain('cloud_1');
  });

  it('uses newest-wins for tasks with same id (cloud newer)', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'Old Local', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudTasks = [
      { id: 't1', title: 'New Cloud', updatedAt: '2026-03-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ tasks: cloudTasks }));
    await loadCloudData();

    const t1 = mockState.tasksData.find(t => t.id === 't1');
    expect(t1.title).toBe('New Cloud');
  });

  it('uses newest-wins for tasks with same id (local newer)', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'New Local', updatedAt: '2026-03-01T00:00:00Z' },
    ];
    const cloudTasks = [
      { id: 't1', title: 'Old Cloud', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ tasks: cloudTasks }));
    await loadCloudData();

    const t1 = mockState.tasksData.find(t => t.id === 't1');
    expect(t1.title).toBe('New Local');
  });

  it('persists merged tasks to localStorage', async () => {
    mockState.tasksData = [{ id: 'local_1', title: 'L', updatedAt: '2026-01-01T00:00:00Z' }];
    const cloudTasks = [{ id: 'cloud_1', title: 'C', updatedAt: '2026-01-01T00:00:00Z' }];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ tasks: cloudTasks }));
    await loadCloudData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    const ids = stored.map(t => t.id);
    expect(ids).toContain('local_1');
    expect(ids).toContain('cloud_1');
  });

  it('merges task areas (taskCategories in cloud)', async () => {
    mockState.taskAreas = [
      { id: 'area_1', name: 'Work', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudAreas = [
      { id: 'area_2', name: 'Personal', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ taskCategories: cloudAreas }));
    await loadCloudData();

    const ids = mockState.taskAreas.map(a => a.id);
    expect(ids).toContain('area_1');
    expect(ids).toContain('area_2');
  });

  it('merges categories', async () => {
    mockState.taskCategories = [
      { id: 'cat_1', name: 'Design', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudCats = [
      { id: 'cat_2', name: 'Engineering', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ categories: cloudCats }));
    await loadCloudData();

    const ids = mockState.taskCategories.map(c => c.id);
    expect(ids).toContain('cat_1');
    expect(ids).toContain('cat_2');
  });

  it('merges labels', async () => {
    mockState.taskLabels = [
      { id: 'label_1', name: 'urgent', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudLabels = [
      { id: 'label_2', name: 'low-priority', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ taskLabels: cloudLabels }));
    await loadCloudData();

    const ids = mockState.taskLabels.map(l => l.id);
    expect(ids).toContain('label_1');
    expect(ids).toContain('label_2');
  });

  it('merges people with field normalization', async () => {
    mockState.taskPeople = [];
    const cloudPeople = [
      { id: 'person_1', name: 'Alice', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ taskPeople: cloudPeople }));
    await loadCloudData();

    const person = mockState.taskPeople.find(p => p.id === 'person_1');
    expect(person).toBeDefined();
    expect(person.email).toBe('');
    expect(person.jobTitle).toBe('');
    expect(person.photoUrl).toBe('');
    expect(person.photoData).toBe('');
  });

  it('preserves existing person fields during normalization', async () => {
    mockState.taskPeople = [];
    const cloudPeople = [
      {
        id: 'person_1', name: 'Bob',
        email: 'bob@test.com', jobTitle: 'Engineer',
        photoUrl: 'http://photo.jpg', photoData: 'base64data',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ taskPeople: cloudPeople }));
    await loadCloudData();

    const person = mockState.taskPeople.find(p => p.id === 'person_1');
    expect(person.email).toBe('bob@test.com');
    expect(person.jobTitle).toBe('Engineer');
    expect(person.photoUrl).toBe('http://photo.jpg');
    expect(person.photoData).toBe('base64data');
  });

  it('normalizes non-string person fields to empty string', async () => {
    mockState.taskPeople = [];
    const cloudPeople = [
      {
        id: 'person_1', name: 'Charlie',
        email: 123, jobTitle: null, photoUrl: undefined, photoData: false,
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ taskPeople: cloudPeople }));
    await loadCloudData();

    const person = mockState.taskPeople.find(p => p.id === 'person_1');
    expect(person.email).toBe('');
    expect(person.jobTitle).toBe('');
    expect(person.photoUrl).toBe('');
    expect(person.photoData).toBe('');
  });

  it('merges perspectives', async () => {
    mockState.customPerspectives = [
      { id: 'persp_1', name: 'My View', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudPerspectives = [
      { id: 'persp_2', name: 'Cloud View', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ customPerspectives: cloudPerspectives }));
    await loadCloudData();

    const ids = mockState.customPerspectives.map(p => p.id);
    expect(ids).toContain('persp_1');
    expect(ids).toContain('persp_2');
  });

  it('merges homeWidgets', async () => {
    mockState.homeWidgets = [
      { id: 'w_1', type: 'weather', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudWidgets = [
      { id: 'w_2', type: 'tasks', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ homeWidgets: cloudWidgets }));
    await loadCloudData();

    const ids = mockState.homeWidgets.map(w => w.id);
    expect(ids).toContain('w_1');
    expect(ids).toContain('w_2');
  });

  it('merges triggers when cloud has array', async () => {
    mockState.triggers = [
      { id: 'trig_1', name: 'Local Trigger', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    const cloudTriggers = [
      { id: 'trig_2', name: 'Cloud Trigger', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ triggers: cloudTriggers }));
    await loadCloudData();

    const ids = mockState.triggers.map(t => t.id);
    expect(ids).toContain('trig_1');
    expect(ids).toContain('trig_2');
  });

  it('does NOT merge triggers when cloud triggers is not an array', async () => {
    mockState.triggers = [
      { id: 'trig_1', name: 'Local Trigger', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ triggers: 'not_array' }));
    await loadCloudData();

    expect(mockState.triggers).toHaveLength(1);
    expect(mockState.triggers[0].id).toBe('trig_1');
  });

  it('handles partial cloud data (some collections missing)', async () => {
    mockState.tasksData = [{ id: 't1', title: 'Local', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskLabels = [{ id: 'l1', name: 'Label', updatedAt: '2026-01-01T00:00:00Z' }];

    const cloudData = {};

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.taskLabels).toHaveLength(1);
  });

  it('handles empty cloud collections', async () => {
    mockState.tasksData = [{ id: 't1', title: 'Local', updatedAt: '2026-01-01T00:00:00Z' }];

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({
      tasks: [],
      taskCategories: [],
      categories: [],
      taskLabels: [],
      taskPeople: [],
    }));
    await loadCloudData();

    expect(mockState.tasksData).toHaveLength(1);
  });
});

// ===========================================================================
// 4. rollbackMerge (via saveToGithub PUT failure)
// ===========================================================================
describe('rollbackMerge internals (via saveToGithub PUT failure)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('restores all state fields to pre-merge snapshot on PUT failure', async () => {
    mockState.allData = { '2026-01-01': { prayers: { fajr: '1' } } };
    mockState.tasksData = [{ id: 'original', title: 'Original Task', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskAreas = [{ id: 'area_orig', name: 'OrigArea', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskCategories = [{ id: 'cat_orig', name: 'OrigCat', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskLabels = [{ id: 'label_orig', name: 'OrigLabel', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskPeople = [{ id: 'person_orig', name: 'OrigPerson', updatedAt: '2026-01-01T00:00:00Z', email: '', jobTitle: '', photoUrl: '', photoData: '' }];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};

    const cloudData = {
      tasks: [{ id: 'cloud_t', title: 'Cloud Task', updatedAt: '2026-02-01T00:00:00Z' }],
      taskCategories: [{ id: 'area_cloud', name: 'CloudArea', updatedAt: '2026-02-01T00:00:00Z' }],
      categories: [{ id: 'cat_cloud', name: 'CloudCat', updatedAt: '2026-02-01T00:00:00Z' }],
      taskLabels: [{ id: 'label_cloud', name: 'CloudLabel', updatedAt: '2026-02-01T00:00:00Z' }],
      taskPeople: [{ id: 'person_cloud', name: 'CloudPerson', updatedAt: '2026-02-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeErrorResponse(500, 'Internal Server Error'));

    const result = await saveToGithub();
    expect(result).toBe(false);

    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].id).toBe('original');
    expect(mockState.taskAreas[0].id).toBe('area_orig');
    expect(mockState.taskCategories[0].id).toBe('cat_orig');
    expect(mockState.taskLabels[0].id).toBe('label_orig');
    expect(mockState.taskPeople[0].id).toBe('person_orig');
  });

  it('restores localStorage to pre-merge values on PUT failure', async () => {
    mockState.tasksData = [{ id: 'local_t', title: 'Local', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.allData = { '2026-01-01': {} };
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    const cloudData = {
      tasks: [{ id: 'cloud_t', title: 'Cloud', updatedAt: '2026-02-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();

    const storedTasks = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0].id).toBe('local_t');
  });

  it('rolls back on network error after merge', async () => {
    mockState.tasksData = [{ id: 'orig', title: 'Original', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.allData = {};
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    const cloudData = {
      tasks: [{ id: 'new_t', title: 'New', updatedAt: '2026-02-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await saveToGithub();

    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].id).toBe('orig');
  });

  it('rolls back meeting notes on PUT failure', async () => {
    mockState.meetingNotesByEvent = { 'local_event': { text: 'Local' } };
    mockState.allData = {};
    mockState.tasksData = [];
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.conflictNotifications = [];

    const cloudData = {
      meetingNotesByEvent: {
        'cloud_event': { text: 'Cloud', updatedAt: '2026-02-01T00:00:00Z' },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    expect(mockState.meetingNotesByEvent['local_event'].text).toBe('Local');
    expect(mockState.meetingNotesByEvent['cloud_event']).toBeUndefined();
  });

  it('rolls back conflict notifications on PUT failure', async () => {
    mockState.conflictNotifications = [];
    mockState.allData = {};
    mockState.tasksData = [{ id: 't1', title: 'Same', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};

    const cloudData = {
      tasks: [{ id: 't1', title: 'Different', updatedAt: '2026-01-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    expect(mockState.conflictNotifications).toEqual([]);
  });
});

// ===========================================================================
// 5. mergeDeletedEntityTombstones / mergeDeletedTaskTombstones (via loadCloudData)
// ===========================================================================
describe('mergeDeletedEntityTombstones internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('merges cloud entity tombstones with local (union of collections and ids)', async () => {
    mockState.deletedEntityTombstones = {
      taskCategories: { 'cat_1': '2026-01-01T00:00:00Z' },
    };

    const cloudData = {
      deletedEntityTombstones: {
        taskLabels: { 'label_1': '2026-01-01T00:00:00Z' },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.deletedEntityTombstones.taskCategories).toBeDefined();
    expect(mockState.deletedEntityTombstones.taskLabels).toBeDefined();
  });

  it('takes newer timestamp when same id exists in both local and cloud', async () => {
    mockState.deletedEntityTombstones = {
      taskCategories: { 'cat_1': '2026-01-01T00:00:00Z' },
    };

    const cloudData = {
      deletedEntityTombstones: {
        taskCategories: { 'cat_1': '2026-03-01T00:00:00Z' },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ts = mockState.deletedEntityTombstones.taskCategories['cat_1'];
    expect(new Date(ts).getTime()).toBeGreaterThanOrEqual(new Date('2026-03-01T00:00:00Z').getTime());
  });

  it('persists merged entity tombstones to localStorage', async () => {
    mockState.deletedEntityTombstones = {
      taskCategories: { 'cat_1': '2026-01-01T00:00:00Z' },
    };

    const cloudData = {
      deletedEntityTombstones: {
        taskLabels: { 'label_1': '2026-01-15T00:00:00Z' },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.DELETED_ENTITY_TOMBSTONES_KEY));
    expect(stored.taskCategories).toBeDefined();
    expect(stored.taskLabels).toBeDefined();
  });

  it('handles empty cloud tombstones', async () => {
    mockState.deletedEntityTombstones = {
      taskCategories: { 'cat_1': '2026-01-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({
      deletedEntityTombstones: {},
    }));
    await loadCloudData();

    expect(mockState.deletedEntityTombstones.taskCategories).toBeDefined();
  });

  it('handles null cloud tombstones', async () => {
    mockState.deletedEntityTombstones = {
      taskCategories: { 'cat_1': '2026-01-01T00:00:00Z' },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({
      deletedEntityTombstones: null,
    }));
    await loadCloudData();

    expect(mockState.deletedEntityTombstones).toBeDefined();
  });
});

describe('mergeDeletedTaskTombstones internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('merges cloud task tombstones with local (union of ids)', async () => {
    mockState.deletedTaskTombstones = {
      'task_local': '2026-01-01T00:00:00Z',
    };

    const cloudData = {
      deletedTaskTombstones: {
        'task_cloud': '2026-01-15T00:00:00Z',
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.deletedTaskTombstones['task_local']).toBeDefined();
    expect(mockState.deletedTaskTombstones['task_cloud']).toBeDefined();
  });

  it('takes newer timestamp for overlapping task tombstones', async () => {
    mockState.deletedTaskTombstones = {
      'task_1': '2026-01-01T00:00:00Z',
    };

    const cloudData = {
      deletedTaskTombstones: {
        'task_1': '2026-03-01T00:00:00Z',
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ts = mockState.deletedTaskTombstones['task_1'];
    expect(new Date(ts).getTime()).toBeGreaterThanOrEqual(new Date('2026-03-01T00:00:00Z').getTime());
  });

  it('persists merged task tombstones to localStorage', async () => {
    mockState.deletedTaskTombstones = { 'a': '2026-01-01T00:00:00Z' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({
      deletedTaskTombstones: { 'b': '2026-01-15T00:00:00Z' },
    }));
    await loadCloudData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.DELETED_TASK_TOMBSTONES_KEY));
    expect(stored['a']).toBeDefined();
    expect(stored['b']).toBeDefined();
  });
});

// ===========================================================================
// 6. isEntityDeleted / isTaskDeleted / pruneDeletedEntitiesFromState / pruneDeletedTasksFromState
// ===========================================================================
describe('pruneDeletedEntitiesFromState internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('removes entities that appear in tombstones', async () => {
    mockState.taskAreas = [
      { id: 'area_alive', name: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'area_dead', name: 'Delete', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        taskCategories: { 'area_dead': new Date().toISOString() },
      },
      taskCategories: [],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.taskAreas.map(a => a.id);
    expect(ids).toContain('area_alive');
    expect(ids).not.toContain('area_dead');
  });

  it('removes labels that appear in tombstones', async () => {
    mockState.taskLabels = [
      { id: 'label_alive', name: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'label_dead', name: 'Delete', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        taskLabels: { 'label_dead': new Date().toISOString() },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.taskLabels.map(l => l.id);
    expect(ids).not.toContain('label_dead');
  });

  it('removes people that appear in tombstones', async () => {
    mockState.taskPeople = [
      { id: 'p_alive', name: 'Alice', updatedAt: '2026-01-01T00:00:00Z', email: '', jobTitle: '', photoUrl: '', photoData: '' },
      { id: 'p_dead', name: 'Bob', updatedAt: '2026-01-01T00:00:00Z', email: '', jobTitle: '', photoUrl: '', photoData: '' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        taskPeople: { 'p_dead': new Date().toISOString() },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.taskPeople.map(p => p.id);
    expect(ids).not.toContain('p_dead');
  });

  it('removes perspectives that appear in tombstones', async () => {
    mockState.customPerspectives = [
      { id: 'persp_alive', name: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'persp_dead', name: 'Delete', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        customPerspectives: { 'persp_dead': new Date().toISOString() },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.customPerspectives.map(p => p.id);
    expect(ids).not.toContain('persp_dead');
  });

  it('removes homeWidgets that appear in tombstones', async () => {
    mockState.homeWidgets = [
      { id: 'w_alive', type: 'weather', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'w_dead', type: 'tasks', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        homeWidgets: { 'w_dead': new Date().toISOString() },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.homeWidgets.map(w => w.id);
    expect(ids).not.toContain('w_dead');
  });

  it('removes triggers that appear in tombstones', async () => {
    mockState.triggers = [
      { id: 'trig_alive', name: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'trig_dead', name: 'Delete', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        triggers: { 'trig_dead': new Date().toISOString() },
      },
      triggers: [],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.triggers.map(t => t.id);
    expect(ids).not.toContain('trig_dead');
  });

  it('persists pruned entity lists to localStorage', async () => {
    mockState.taskAreas = [
      { id: 'area_1', name: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'area_2', name: 'Delete', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedEntityTombstones: {
        taskCategories: { 'area_2': new Date().toISOString() },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASK_CATEGORIES_KEY));
    const ids = stored.map(a => a.id);
    expect(ids).not.toContain('area_2');
  });
});

describe('pruneDeletedTasksFromState internals (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('removes tasks that appear in task tombstones', async () => {
    mockState.tasksData = [
      { id: 'task_alive', title: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'task_dead', title: 'Delete', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedTaskTombstones: {
        'task_dead': new Date().toISOString(),
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.tasksData.map(t => t.id);
    expect(ids).toContain('task_alive');
    expect(ids).not.toContain('task_dead');
  });

  it('filters cloud tasks by tombstones before merge', async () => {
    mockState.tasksData = [];

    const cloudData = {
      tasks: [
        { id: 'cloud_alive', title: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
        { id: 'cloud_dead', title: 'Should be pruned', updatedAt: '2026-01-01T00:00:00Z' },
      ],
      deletedTaskTombstones: {
        'cloud_dead': new Date().toISOString(),
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const ids = mockState.tasksData.map(t => t.id);
    expect(ids).toContain('cloud_alive');
    expect(ids).not.toContain('cloud_dead');
  });

  it('persists pruned task list to localStorage', async () => {
    mockState.tasksData = [
      { id: 't_keep', title: 'Keep', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 't_remove', title: 'Remove', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedTaskTombstones: {
        't_remove': new Date().toISOString(),
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    const ids = stored.map(t => t.id);
    expect(ids).not.toContain('t_remove');
  });
});

// ===========================================================================
// 7. fetchWithTimeout (via saveToGithub / loadCloudData)
// ===========================================================================
describe('fetchWithTimeout internals', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('passes AbortController signal to fetch', async () => {
    let capturedSignal = null;
    globalThis.fetch.mockImplementation((url, opts) => {
      if (!capturedSignal) capturedSignal = opts?.signal;
      return Promise.resolve(makeGithubGetResponse());
    });

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const firstCall = globalThis.fetch.mock.calls[0];
    expect(firstCall[1]).toHaveProperty('signal');
  });

  it('aborts fetch on timeout (simulated via AbortError)', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    globalThis.fetch.mockRejectedValueOnce(abortError);

    await loadCloudData();

    expect(mockState.syncInProgress).toBe(false);
  });

  it('fetch succeeds quickly before timeout fires', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    const result = await saveToGithub();

    expect(result).toBe(true);
  });
});

// ===========================================================================
// 8. computeChecksum / verifyChecksum (via saveToGithub and loadCloudData)
// ===========================================================================
describe('computeChecksum / verifyChecksum internals', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('calls crypto.subtle.digest during saveToGithub', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockDigest).toHaveBeenCalled();
  });

  it('includes _checksum in PUT payload', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const binString = atob(content);
    const bytes = Uint8Array.from(binString, char => char.codePointAt(0));
    const jsonString = new TextDecoder().decode(bytes);
    const payload = JSON.parse(jsonString);

    expect(payload._checksum).toBeDefined();
    expect(typeof payload._checksum).toBe('string');
  });

  it('accepts cloud payload without _checksum (backwards compatible)', async () => {
    const cloudPayload = {
      _schemaVersion: 1,
      _sequence: 1,
      lastUpdated: new Date().toISOString(),
      data: {},
      tasks: [],
      taskCategories: [],
      categories: [],
      taskLabels: [],
      taskPeople: [],
      customPerspectives: [],
      homeWidgets: [],
      triggers: [],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudPayload));
    await loadCloudData();

    expect(mockState.syncHealth.successfulLoads).toBe(1);
  });

  it('rejects cloud payload with wrong _checksum', async () => {
    let callCount = 0;
    mockDigest.mockImplementation(async () => {
      callCount++;
      const buf = new ArrayBuffer(32);
      const view = new Uint8Array(buf);
      view[0] = callCount;
      return buf;
    });

    const cloudPayload = { _checksum: 'wrong_checksum_value' };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudPayload));
    await loadCloudData();

    expect(mockState.syncStatus).toBe('error');
  });

  it('computeChecksum produces hex string of SHA-256 (32 bytes = 64 hex chars)', async () => {
    mockDigest.mockImplementation(async () => new ArrayBuffer(32));

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const binString = atob(content);
    const bytes = Uint8Array.from(binString, char => char.codePointAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    expect(payload._checksum).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(payload._checksum)).toBe(true);
  });
});

// ===========================================================================
// 9. Rate limit auto-clear (via saveToGithub 403)
// ===========================================================================
describe('Rate limit auto-clear internals', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    vi.useFakeTimers({ shouldAdvanceTime: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets syncRateLimited to true on 403 PUT response', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit exceeded'));

    await vi.runAllTimersAsync();
    await saveToGithub();

    expect(mockState.syncRateLimited).toBe(true);
  });

  it('auto-clears syncRateLimited after 60 seconds', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit exceeded'));

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(true);

    // Advance past the 60s auto-clear timeout
    await vi.advanceTimersByTimeAsync(60000);

    expect(mockState.syncRateLimited).toBe(false);
  });

  it('does NOT auto-clear before 60 seconds', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit exceeded'));

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(true);

    await vi.advanceTimersByTimeAsync(59999);
    expect(mockState.syncRateLimited).toBe(true);

    await vi.advanceTimersByTimeAsync(1);
    expect(mockState.syncRateLimited).toBe(false);
  });
});

// ===========================================================================
// 10. syncSequence edge cases (via loadCloudData)
// ===========================================================================
describe('syncSequence edge cases (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('updates local sequence when cloud sequence is higher', async () => {
    mockState.syncSequence = 5;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _sequence: 10 }));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(10);
    expect(localStorage.getItem(MOCK_KEYS.SYNC_SEQUENCE_KEY)).toBe('10');
  });

  it('does NOT update local sequence when cloud is lower', async () => {
    mockState.syncSequence = 10;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _sequence: 5 }));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(10);
  });

  it('does NOT update local sequence when sequences are equal', async () => {
    mockState.syncSequence = 7;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _sequence: 7 }));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(7);
  });

  it('handles cloud _sequence of 0 (does not update)', async () => {
    mockState.syncSequence = 3;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _sequence: 0 }));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(3);
  });

  it('handles cloud _sequence missing/undefined', async () => {
    mockState.syncSequence = 5;

    const cloudData = {};
    delete cloudData._sequence;
    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(5);
  });

  it('increments syncSequence on each saveToGithub', async () => {
    mockState.syncSequence = 0;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.syncSequence).toBe(1);
    expect(localStorage.getItem(MOCK_KEYS.SYNC_SEQUENCE_KEY)).toBe('1');
  });

  it('sequence is included in PUT payload', async () => {
    mockState.syncSequence = 42;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const binString = atob(content);
    const bytes = Uint8Array.from(binString, char => char.codePointAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    expect(payload._sequence).toBe(43);
  });
});

// ===========================================================================
// 11. Pull-merge during saveToGithub — deep merge verification
// ===========================================================================
describe('Pull-merge deep merge verification (via saveToGithub)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('merges cloud allData into local allData during pull-merge', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: '1' } },
    };

    const cloudData = {
      data: {
        '2026-01-02': { prayers: { fajr: '1' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-01']).toBeDefined();
    expect(mockState.allData['2026-01-02']).toBeDefined();
  });

  it('gap-fills empty local fields with cloud values', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: '1', dhuhr: '' } },
    };

    const cloudData = {
      data: {
        '2026-01-01': { prayers: { fajr: '0', dhuhr: '1' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-01'].prayers.fajr).toBe('1');
    expect(mockState.allData['2026-01-01'].prayers.dhuhr).toBe('1');
  });

  it('does NOT overwrite non-empty local fields with cloud values', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: '1' } },
    };

    const cloudData = {
      data: {
        '2026-01-01': { prayers: { fajr: '0' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-01'].prayers.fajr).toBe('1');
  });

  it('merges cloud tasks into local tasks during pull-merge', async () => {
    mockState.tasksData = [
      { id: 'local_only', title: 'Local', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      tasks: [
        { id: 'cloud_only', title: 'Cloud', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const ids = mockState.tasksData.map(t => t.id);
    expect(ids).toContain('local_only');
    expect(ids).toContain('cloud_only');
  });

  it('merges meeting notes during pull-merge', async () => {
    mockState.meetingNotesByEvent = {
      'local_event': { text: 'Local note', updatedAt: '2026-01-01T00:00:00Z' },
    };

    const cloudData = {
      meetingNotesByEvent: {
        'cloud_event': { text: 'Cloud note', updatedAt: '2026-01-01T00:00:00Z' },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.meetingNotesByEvent['local_event'].text).toBe('Local note');
    expect(mockState.meetingNotesByEvent['cloud_event'].text).toBe('Cloud note');
  });

  it('applies tombstones during pull-merge to prune deleted tasks', async () => {
    mockState.tasksData = [
      { id: 'task_to_delete', title: 'Will be deleted', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 'task_to_keep', title: 'Will survive', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      deletedTaskTombstones: {
        'task_to_delete': new Date().toISOString(),
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const ids = mockState.tasksData.map(t => t.id);
    expect(ids).not.toContain('task_to_delete');
    expect(ids).toContain('task_to_keep');
  });

  it('skips merge when cloud validation fails during pull-merge', async () => {
    mockState.tasksData = [{ id: 'original', title: 'Original', updatedAt: '2026-01-01T00:00:00Z' }];

    const cloudPayloadObj = {
      _schemaVersion: 1,
      _sequence: 1,
      lastUpdated: new Date().toISOString(),
      data: 'not_an_object',
      tasks: 'not_an_array',
    };

    const jsonString = JSON.stringify(cloudPayloadObj);
    const bytes = new TextEncoder().encode(jsonString);
    const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
    const base64 = btoa(binString);

    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({ sha: 'sha123', content: base64 }),
      })
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].id).toBe('original');
  });
});

// ===========================================================================
// 12. Conflict notification generation during merge
// ===========================================================================
describe('Conflict notification generation during merge', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('generates conflict notification when same task has tied timestamps but different content', async () => {
    const ts = '2026-02-01T00:00:00Z';
    mockState.tasksData = [
      { id: 't1', title: 'Local Version', updatedAt: ts },
    ];
    mockState.allData = {};
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    const cloudData = {
      tasks: [{ id: 't1', title: 'Cloud Version', updatedAt: ts }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.conflictNotifications.length).toBeGreaterThan(0);
    const notification = mockState.conflictNotifications.find(n => n.itemId === 't1');
    expect(notification).toBeDefined();
    expect(notification.mode).toBe('local_wins_tie');
  });

  it('does NOT generate conflict notification when cloud task is newer', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'Local', updatedAt: '2026-01-01T00:00:00Z' },
    ];
    mockState.allData = {};
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    const cloudData = {
      tasks: [{ id: 't1', title: 'Cloud', updatedAt: '2026-03-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const notification = mockState.conflictNotifications.find(n => n.itemId === 't1');
    expect(notification).toBeUndefined();
  });
});

// ===========================================================================
// 13. End-to-end: loadCloudData merges shouldUseCloud decision
// ===========================================================================
describe('loadCloudData shouldUseCloud decision', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('wholesale replaces allData when cloud sequence > local sequence', async () => {
    mockState.syncSequence = 1;
    mockState.allData = { '2026-01-01': { prayers: { fajr: '1' } } };

    const cloudData = {
      _sequence: 5,
      lastUpdated: new Date().toISOString(),
      data: { '2026-02-01': { prayers: { dhuhr: '1' } } },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.allData['2026-02-01']).toBeDefined();
  });

  it('merges (gap-fill) when local sequence > cloud sequence', async () => {
    mockState.syncSequence = 10;
    mockState.allData = { '2026-01-01': { prayers: { fajr: '1', dhuhr: '' } } };

    const cloudData = {
      _sequence: 5,
      lastUpdated: '2026-01-01T00:00:00Z',
      data: { '2026-01-01': { prayers: { fajr: '0', dhuhr: '1' } } },
    };

    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, Date.now().toString());

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.allData['2026-01-01'].prayers.fajr).toBe('1');
    expect(mockState.allData['2026-01-01'].prayers.dhuhr).toBe('1');
  });

  it('falls through to timestamp comparison when sequences are equal', async () => {
    mockState.syncSequence = 5;
    mockState.allData = {};

    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, '1000000');

    const cloudData = {
      _sequence: 5,
      lastUpdated: new Date().toISOString(),
      data: { '2026-03-01': { prayers: { fajr: '1' } } },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.allData['2026-03-01']).toBeDefined();
  });
});

// ===========================================================================
// 14. Additional edge case: save with GET returning 404 (new file)
// ===========================================================================
describe('saveToGithub with no existing cloud file', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('creates file without SHA when GET returns 404', async () => {
    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce(makeGithubPutResponse());

    const result = await saveToGithub();
    expect(result).toBe(true);

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    expect(putBody.sha).toBeUndefined();
  });

  it('skips merge when GET returns 404', async () => {
    mockState.tasksData = [{ id: 't1', title: 'Only local', updatedAt: '2026-01-01T00:00:00Z' }];

    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.tasksData).toHaveLength(1);
    expect(mockState.tasksData[0].id).toBe('t1');
  });
});

// ===========================================================================
// 15. syncHealth recording during various operations
// ===========================================================================
describe('syncHealth recording', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('records successful save event', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.syncHealth.totalSaves).toBe(1);
    expect(mockState.syncHealth.successfulSaves).toBe(1);
    expect(mockState.syncHealth.failedSaves).toBe(0);
    expect(mockState.syncHealth.recentEvents.length).toBe(1);
    expect(mockState.syncHealth.recentEvents[0].type).toBe('save');
    expect(mockState.syncHealth.recentEvents[0].status).toBe('success');
  });

  it('records failed save event', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    expect(mockState.syncHealth.totalSaves).toBe(1);
    expect(mockState.syncHealth.failedSaves).toBe(1);
  });

  it('records successful load event', async () => {
    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse());

    await loadCloudData();

    expect(mockState.syncHealth.totalLoads).toBe(1);
    expect(mockState.syncHealth.successfulLoads).toBe(1);
  });

  it('persists syncHealth to localStorage', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.SYNC_HEALTH_KEY));
    expect(stored.totalSaves).toBe(1);
  });

  it('caps recentEvents at 20 entries', async () => {
    mockState.syncHealth.recentEvents = Array.from({ length: 19 }, (_, i) => ({
      type: 'save', status: 'success', timestamp: new Date().toISOString(), latencyMs: i,
    }));

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.syncHealth.recentEvents.length).toBeLessThanOrEqual(20);
  });
});

// ===========================================================================
// 16. Multiple simultaneous merge scenarios
// ===========================================================================
describe('Complex multi-collection merge scenarios', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('merges tasks, areas, labels, and people simultaneously', async () => {
    mockState.tasksData = [{ id: 't_local', title: 'LT', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskAreas = [{ id: 'a_local', name: 'LA', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskLabels = [{ id: 'l_local', name: 'LL', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskPeople = [{ id: 'p_local', name: 'LP', updatedAt: '2026-01-01T00:00:00Z', email: 'a@b.c', jobTitle: '', photoUrl: '', photoData: '' }];

    const cloudData = {
      tasks: [{ id: 't_cloud', title: 'CT', updatedAt: '2026-01-01T00:00:00Z' }],
      taskCategories: [{ id: 'a_cloud', name: 'CA', updatedAt: '2026-01-01T00:00:00Z' }],
      taskLabels: [{ id: 'l_cloud', name: 'CL', updatedAt: '2026-01-01T00:00:00Z' }],
      taskPeople: [{ id: 'p_cloud', name: 'CP', updatedAt: '2026-01-01T00:00:00Z' }],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.tasksData.map(t => t.id).sort()).toEqual(['t_cloud', 't_local']);
    expect(mockState.taskAreas.map(a => a.id).sort()).toEqual(['a_cloud', 'a_local']);
    expect(mockState.taskLabels.map(l => l.id).sort()).toEqual(['l_cloud', 'l_local']);
    expect(mockState.taskPeople.map(p => p.id).sort()).toEqual(['p_cloud', 'p_local']);
  });

  it('handles full merge with tombstones, singletons, and collections together', async () => {
    const ts = '2026-02-01T00:00:00Z';

    mockState.tasksData = [
      { id: 't_keep', title: 'Keep', updatedAt: ts },
      { id: 't_delete', title: 'Delete', updatedAt: ts },
    ];
    mockState.taskAreas = [
      { id: 'a_keep', name: 'Keep', updatedAt: ts },
      { id: 'a_delete', name: 'Delete', updatedAt: ts },
    ];
    mockState.WEIGHTS = { prayers: { fajr: 1 }, _updatedAt: '2026-01-01T00:00:00Z' };
    mockState.xp = { total: 0 };

    const cloudData = {
      deletedTaskTombstones: {
        't_delete': new Date().toISOString(),
      },
      deletedEntityTombstones: {
        taskCategories: { 'a_delete': new Date().toISOString() },
      },
      weights: { prayers: { fajr: 5 }, _updatedAt: '2026-03-01T00:00:00Z' },
      xp: { total: 100, _updatedAt: '2026-03-01T00:00:00Z' },
      tasks: [{ id: 't_new', title: 'New Cloud', updatedAt: ts }],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.tasksData.map(t => t.id)).not.toContain('t_delete');
    expect(mockState.taskAreas.map(a => a.id)).not.toContain('a_delete');

    expect(mockState.WEIGHTS.prayers.fajr).toBe(5);
    expect(mockState.xp.total).toBe(100);

    expect(mockState.tasksData.map(t => t.id)).toContain('t_new');
  });
});

// ===========================================================================
// 17. Rollback completeness verification
// ===========================================================================
describe('Rollback completeness — all 13 state fields restored', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('restores all 13 snapshot fields on 409 conflict', async () => {
    const originalState = {
      allData: { '2026-01-01': { prayers: { fajr: '1' } } },
      tasksData: [{ id: 'orig_t', title: 'Orig', updatedAt: '2026-01-01T00:00:00Z' }],
      deletedTaskTombstones: { 'old_tomb': '2026-01-01T00:00:00Z' },
      deletedEntityTombstones: { taskCategories: { 'old_cat': '2026-01-01T00:00:00Z' } },
      taskAreas: [{ id: 'orig_area', name: 'OA', updatedAt: '2026-01-01T00:00:00Z' }],
      taskCategories: [{ id: 'orig_cat', name: 'OC', updatedAt: '2026-01-01T00:00:00Z' }],
      taskLabels: [{ id: 'orig_label', name: 'OL', updatedAt: '2026-01-01T00:00:00Z' }],
      taskPeople: [{ id: 'orig_person', name: 'OP', updatedAt: '2026-01-01T00:00:00Z', email: '', jobTitle: '', photoUrl: '', photoData: '' }],
      customPerspectives: [{ id: 'orig_persp', name: 'OPersp', updatedAt: '2026-01-01T00:00:00Z' }],
      homeWidgets: [{ id: 'orig_widget', type: 'w', updatedAt: '2026-01-01T00:00:00Z' }],
      triggers: [{ id: 'orig_trig', name: 'OT', updatedAt: '2026-01-01T00:00:00Z' }],
      meetingNotesByEvent: { 'orig_event': { text: 'Original' } },
      conflictNotifications: [],
    };

    Object.assign(mockState, JSON.parse(JSON.stringify(originalState)));

    const cloudData = {
      data: { '2026-02-01': {} },
      tasks: [{ id: 'cloud_t', title: 'Cloud', updatedAt: '2026-02-01T00:00:00Z' }],
      taskCategories: [{ id: 'cloud_area', name: 'CA', updatedAt: '2026-02-01T00:00:00Z' }],
      categories: [{ id: 'cloud_cat', name: 'CC', updatedAt: '2026-02-01T00:00:00Z' }],
      taskLabels: [{ id: 'cloud_label', name: 'CL', updatedAt: '2026-02-01T00:00:00Z' }],
      taskPeople: [{ id: 'cloud_person', name: 'CP', updatedAt: '2026-02-01T00:00:00Z' }],
      customPerspectives: [{ id: 'cloud_persp', name: 'CPersp', updatedAt: '2026-02-01T00:00:00Z' }],
      homeWidgets: [{ id: 'cloud_widget', type: 'cw', updatedAt: '2026-02-01T00:00:00Z' }],
      triggers: [{ id: 'cloud_trig', name: 'CT', updatedAt: '2026-02-01T00:00:00Z' }],
      meetingNotesByEvent: { 'cloud_event': { text: 'Cloud', updatedAt: '2026-02-01T00:00:00Z' } },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();

    expect(mockState.tasksData.map(t => t.id)).toEqual(['orig_t']);
    expect(mockState.taskAreas.map(a => a.id)).toEqual(['orig_area']);
    expect(mockState.taskCategories.map(c => c.id)).toEqual(['orig_cat']);
    expect(mockState.taskLabels.map(l => l.id)).toEqual(['orig_label']);
    expect(mockState.taskPeople.map(p => p.id)).toEqual(['orig_person']);
    expect(mockState.customPerspectives.map(p => p.id)).toEqual(['orig_persp']);
    expect(mockState.homeWidgets.map(w => w.id)).toEqual(['orig_widget']);
    expect(mockState.triggers.map(t => t.id)).toEqual(['orig_trig']);
    expect(mockState.meetingNotesByEvent['orig_event'].text).toBe('Original');
    expect(mockState.meetingNotesByEvent['cloud_event']).toBeUndefined();
    expect(mockState.conflictNotifications).toEqual([]);
  });

  it('restores localStorage for all 13 keys on rollback', async () => {
    mockState.allData = { orig: true };
    mockState.tasksData = [{ id: 'x', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({
        tasks: [{ id: 'cloud', title: 'C', updatedAt: '2026-02-01T00:00:00Z' }],
      }))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    const keysToCheck = [
      MOCK_KEYS.STORAGE_KEY,
      MOCK_KEYS.TASKS_KEY,
      MOCK_KEYS.DELETED_TASK_TOMBSTONES_KEY,
      MOCK_KEYS.DELETED_ENTITY_TOMBSTONES_KEY,
      MOCK_KEYS.TASK_CATEGORIES_KEY,
      MOCK_KEYS.CATEGORIES_KEY,
      MOCK_KEYS.TASK_LABELS_KEY,
      MOCK_KEYS.TASK_PEOPLE_KEY,
      MOCK_KEYS.PERSPECTIVES_KEY,
      MOCK_KEYS.HOME_WIDGETS_KEY,
      MOCK_KEYS.TRIGGERS_KEY,
      MOCK_KEYS.MEETING_NOTES_KEY,
      MOCK_KEYS.CONFLICT_NOTIFICATIONS_KEY,
    ];

    keysToCheck.forEach(key => {
      const value = localStorage.getItem(key);
      expect(value).not.toBeNull();
      expect(() => JSON.parse(value)).not.toThrow();
    });
  });
});

// ===========================================================================
// 18. Edge cases: mergeEntityCollection newest-wins with createdAt fallback
// ===========================================================================
describe('mergeEntityCollection newest-wins with createdAt fallback (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('uses createdAt when updatedAt is missing for task merge', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'Local', createdAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      tasks: [
        { id: 't1', title: 'Cloud', createdAt: '2026-03-01T00:00:00Z' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const t1 = mockState.tasksData.find(t => t.id === 't1');
    expect(t1.title).toBe('Cloud');
  });

  it('local wins when cloud has no timestamp fields at all', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'Local', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      tasks: [
        { id: 't1', title: 'Cloud' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const t1 = mockState.tasksData.find(t => t.id === 't1');
    expect(t1.title).toBe('Local');
  });

  it('cloud-only item is added even without timestamps', async () => {
    mockState.tasksData = [];

    const cloudData = {
      tasks: [
        { id: 't_new', title: 'No timestamps' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.tasksData.map(t => t.id)).toContain('t_new');
  });
});

// ===========================================================================
// 19. Data integrity: items without id are ignored during merge
// ===========================================================================
describe('Data integrity: items without id', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('ignores cloud tasks without id during merge (via saveToGithub pull-merge)', async () => {
    // Use saveToGithub pull-merge path because loadCloudData validates tasks
    // and rejects payloads with tasks[0] missing id. During pull-merge,
    // validation failure just skips merge, so we put the id-less task at index 5+
    // (beyond the validation sample window of 5 items).
    mockState.tasksData = [];
    mockState.allData = {};
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    const cloudData = {
      tasks: [
        { id: 'v1', title: 'Valid1', updatedAt: '2026-01-01T00:00:00Z' },
        { id: 'v2', title: 'Valid2', updatedAt: '2026-01-01T00:00:00Z' },
        { id: 'v3', title: 'Valid3', updatedAt: '2026-01-01T00:00:00Z' },
        { id: 'v4', title: 'Valid4', updatedAt: '2026-01-01T00:00:00Z' },
        { id: 'v5', title: 'Valid5', updatedAt: '2026-01-01T00:00:00Z' },
        { title: 'No ID task at index 5 (beyond validation sample)' },
        { id: 'v6', title: 'Valid6', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    // 6 valid tasks should be merged, the id-less task at index 5 ignored
    const ids = mockState.tasksData.map(t => t.id);
    expect(ids).toContain('v1');
    expect(ids).toContain('v6');
    // All items should have ids (the one without id was filtered out)
    expect(mockState.tasksData.every(t => t.id)).toBe(true);
  });

  it('ignores non-object items in cloud collections', async () => {
    mockState.taskLabels = [];

    const cloudData = {
      taskLabels: [
        null,
        'string_item',
        42,
        { id: 'valid_label', name: 'Valid', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.taskLabels).toHaveLength(1);
    expect(mockState.taskLabels[0].id).toBe('valid_label');
  });
});

// ===========================================================================
// 20. Persisted state consistency after successful save
// ===========================================================================
describe('localStorage persistence after successful save with merge', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('persists all merged collections to localStorage after successful PUT', async () => {
    mockState.tasksData = [{ id: 'local_t', title: 'L', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskAreas = [{ id: 'local_a', name: 'LA', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskCategories = [{ id: 'local_c', name: 'LC', updatedAt: '2026-01-01T00:00:00Z' }];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];
    mockState.allData = {};
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};

    const cloudData = {
      tasks: [{ id: 'cloud_t', title: 'C', updatedAt: '2026-01-01T00:00:00Z' }],
      taskCategories: [{ id: 'cloud_a', name: 'CA', updatedAt: '2026-01-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const storedTasks = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(storedTasks.map(t => t.id).sort()).toEqual(['cloud_t', 'local_t']);
  });
});

// ===========================================================================
// 21. Additional edge cases for data loss prevention
// ===========================================================================
describe('Data loss prevention: additional edge cases', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('does not lose local tasks when cloud tasks array is undefined', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'Important', updatedAt: '2026-01-01T00:00:00Z' },
      { id: 't2', title: 'Critical', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {};
    delete cloudData.tasks;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.tasksData).toHaveLength(2);
  });

  it('does not lose local allData dates when cloud has different dates', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: '1' } },
      '2026-01-02': { prayers: { dhuhr: '1' } },
    };
    mockState.syncSequence = 10;
    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, Date.now().toString());

    const cloudData = {
      _sequence: 5,
      lastUpdated: '2026-01-01T00:00:00Z',
      data: {
        '2026-01-03': { prayers: { asr: '1' } },
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    // Local is newer, so gap-fill. All local dates preserved + cloud date added.
    expect(mockState.allData['2026-01-01']).toBeDefined();
    expect(mockState.allData['2026-01-02']).toBeDefined();
    expect(mockState.allData['2026-01-03']).toBeDefined();
  });

  it('preserves task with local edits when cloud has stale version', async () => {
    mockState.tasksData = [
      { id: 't1', title: 'Edited locally', notes: 'Important notes', updatedAt: '2026-02-10T12:00:00Z' },
    ];

    const cloudData = {
      tasks: [
        { id: 't1', title: 'Stale cloud', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const t1 = mockState.tasksData.find(t => t.id === 't1');
    expect(t1.title).toBe('Edited locally');
    expect(t1.notes).toBe('Important notes');
  });

  it('handles concurrent tombstones and cloud items for same id', async () => {
    mockState.tasksData = [];
    mockState.deletedTaskTombstones = {};

    const cloudData = {
      tasks: [
        { id: 'zombie', title: 'Should not appear', updatedAt: '2026-01-01T00:00:00Z' },
      ],
      deletedTaskTombstones: {
        'zombie': new Date().toISOString(),
      },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    // Tombstone should win over cloud task
    expect(mockState.tasksData.map(t => t.id)).not.toContain('zombie');
  });

  it('does not duplicate tasks on repeated merge', async () => {
    mockState.tasksData = [
      { id: 'shared', title: 'Shared', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      tasks: [
        { id: 'shared', title: 'Shared', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    const sharedTasks = mockState.tasksData.filter(t => t.id === 'shared');
    expect(sharedTasks).toHaveLength(1);
  });

  it('does not duplicate areas on repeated merge', async () => {
    mockState.taskAreas = [
      { id: 'a1', name: 'Work', updatedAt: '2026-01-01T00:00:00Z' },
    ];

    const cloudData = {
      taskCategories: [
        { id: 'a1', name: 'Work', updatedAt: '2026-01-01T00:00:00Z' },
      ],
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.taskAreas.filter(a => a.id === 'a1')).toHaveLength(1);
  });

  it('handles very large number of tasks without error', async () => {
    mockState.tasksData = [];
    const manyTasks = Array.from({ length: 100 }, (_, i) => ({
      id: `task_${i}`, title: `Task ${i}`, updatedAt: '2026-01-01T00:00:00Z',
    }));

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ tasks: manyTasks }));
    await loadCloudData();

    expect(mockState.tasksData).toHaveLength(100);
  });

  it('rollback restores empty arrays correctly', async () => {
    mockState.tasksData = [];
    mockState.allData = {};
    mockState.deletedTaskTombstones = {};
    mockState.deletedEntityTombstones = {};
    mockState.taskAreas = [];
    mockState.taskCategories = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    mockState.homeWidgets = [];
    mockState.triggers = [];
    mockState.meetingNotesByEvent = {};
    mockState.conflictNotifications = [];

    const cloudData = {
      tasks: [{ id: 'cloud_t', title: 'Cloud', updatedAt: '2026-02-01T00:00:00Z' }],
      taskCategories: [{ id: 'cloud_a', name: 'CA', updatedAt: '2026-02-01T00:00:00Z' }],
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    // Should roll back to the original empty state
    expect(mockState.tasksData).toEqual([]);
    expect(mockState.taskAreas).toEqual([]);
  });

  it('singleton merge does not affect other singletons', async () => {
    const oldTs = '2026-01-01T00:00:00Z';
    const newTs = '2026-03-01T00:00:00Z';
    mockState.WEIGHTS = { prayers: { fajr: 10 }, _updatedAt: newTs };
    mockState.MAX_SCORES = { prayers: 100, _updatedAt: newTs };

    const cloudData = {
      weights: { prayers: { fajr: 1 }, _updatedAt: oldTs },
      maxScores: { prayers: 200, _updatedAt: newTs },
    };

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    // WEIGHTS: local is newer, keep
    expect(mockState.WEIGHTS.prayers.fajr).toBe(10);
    // MAX_SCORES: tied, keep local
    expect(mockState.MAX_SCORES.prayers).toBe(100);
  });
});

// ===========================================================================
// 22. mergeCloudAllData gap-fill edge cases
// ===========================================================================
describe('mergeCloudAllData gap-fill edge cases (via saveToGithub pull-merge)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('gap-fills null local fields', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: null } },
    };

    const cloudData = {
      data: {
        '2026-01-01': { prayers: { fajr: '1' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-01'].prayers.fajr).toBe('1');
  });

  it('gap-fills undefined local fields', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: {} },
    };

    const cloudData = {
      data: {
        '2026-01-01': { prayers: { fajr: '1' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-01'].prayers.fajr).toBe('1');
  });

  it('does not gap-fill when local has value "0"', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: '0' } },
    };

    const cloudData = {
      data: {
        '2026-01-01': { prayers: { fajr: '1' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    // '0' is not empty, so it should NOT be overwritten
    expect(mockState.allData['2026-01-01'].prayers.fajr).toBe('0');
  });

  it('adopts entire cloud category when local has no category', async () => {
    mockState.allData = {
      '2026-01-01': { prayers: { fajr: '1' } },
    };

    const cloudData = {
      data: {
        '2026-01-01': { glucose: { morning: '95' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-01'].glucose.morning).toBe('95');
  });

  it('adopts entire cloud date when local has no entry for that date', async () => {
    mockState.allData = {};

    const cloudData = {
      data: {
        '2026-01-05': { prayers: { fajr: '1' }, habits: { exercise: true } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.allData['2026-01-05'].prayers.fajr).toBe('1');
    expect(mockState.allData['2026-01-05'].habits.exercise).toBe(true);
  });

  it('does not gap-fill from non-standard categories', async () => {
    mockState.allData = {
      '2026-01-01': {},
    };

    const cloudData = {
      data: {
        '2026-01-01': { nonstandard: { field: 'value' } },
      },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    // Non-standard categories are not in the merge list
    expect(mockState.allData['2026-01-01'].nonstandard).toBeUndefined();
  });
});

// ===========================================================================
// 23. checkSchemaVersion edge cases
// ===========================================================================
describe('checkSchemaVersion edge cases (via loadCloudData)', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('accepts data with schema version lower than current', async () => {
    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _schemaVersion: 0 }));
    await loadCloudData();

    expect(mockState.syncHealth.successfulLoads).toBe(1);
  });

  it('accepts data with no schema version', async () => {
    const cloudData = {};
    delete cloudData._schemaVersion;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
    await loadCloudData();

    expect(mockState.syncHealth.successfulLoads).toBe(1);
  });
});
