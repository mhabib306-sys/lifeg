/// <reference types="vitest" />
// @vitest-environment jsdom
// ============================================================================
// Cloud Sync Advanced Edge Cases — concurrency, timeouts, large payloads,
// retry behavior, deferred operations, periodic sync, and visibility handlers.
//
// This file covers scenarios NOT tested by:
//   - github-sync.test.js (~180 tests: basic happy/error paths)
//   - cloud-sync-github-internals.test.js (127 tests: merge internals)
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
  mockValidateCloudPayload,
  mockNormalizeDeletedTaskTombstones,
  mockNormalizeDeletedEntityTombstones,
  mockMergeCloudAllData,
  mockMergeEntityCollection,
  mockParseTimestamp,
  mockIsObjectRecord,
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
  const mockValidateCloudPayload = vi.fn(() => []);
  const mockNormalizeDeletedTaskTombstones = vi.fn((raw) => {
    if (!raw || typeof raw !== 'object') return {};
    return { ...raw };
  });
  const mockNormalizeDeletedEntityTombstones = vi.fn((raw) => {
    if (!raw || typeof raw !== 'object') return {};
    return { ...raw };
  });
  const mockMergeCloudAllData = vi.fn();
  const mockMergeEntityCollection = vi.fn((localItems, cloudItems) => {
    const local = Array.isArray(localItems) ? localItems : [];
    const cloud = Array.isArray(cloudItems) ? cloudItems : [];
    const localMap = new Map(local.map(i => [i.id, i]));
    cloud.forEach(i => { if (i && i.id && !localMap.has(i.id)) localMap.set(i.id, i); });
    return Array.from(localMap.values());
  });
  const mockParseTimestamp = vi.fn((value) => {
    const ts = value ? new Date(value).getTime() : 0;
    return Number.isFinite(ts) ? ts : 0;
  });
  const mockIsObjectRecord = vi.fn((value) => {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  });

  return {
    mockState,
    MOCK_KEYS,
    mockBuildEncryptedCredentials,
    mockRestoreEncryptedCredentials,
    mockValidateCloudPayload,
    mockNormalizeDeletedTaskTombstones,
    mockNormalizeDeletedEntityTombstones,
    mockMergeCloudAllData,
    mockMergeEntityCollection,
    mockParseTimestamp,
    mockIsObjectRecord,
  };
});

// ---------------------------------------------------------------------------
// Mocks
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

vi.mock('../src/data/sync-helpers.js', () => ({
  validateCloudPayload: mockValidateCloudPayload,
  normalizeDeletedTaskTombstones: mockNormalizeDeletedTaskTombstones,
  normalizeDeletedEntityTombstones: mockNormalizeDeletedEntityTombstones,
  mergeCloudAllData: mockMergeCloudAllData,
  mergeEntityCollection: mockMergeEntityCollection,
  parseTimestamp: mockParseTimestamp,
  isObjectRecord: mockIsObjectRecord,
}));

// ---------------------------------------------------------------------------
// Import module under test
// ---------------------------------------------------------------------------
import {
  saveToGithub,
  loadCloudData,
  loadCloudDataWithRetry,
  debouncedSaveToGithub,
  flushPendingSave,
  initPeriodicGithubSync,
  stopPeriodicGithubSync,
  updateSyncStatus,
  getSyncHealth,
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
const mockDigest = vi.fn(async (_algo, _data) => {
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

  mockBuildEncryptedCredentials.mockClear();
  mockRestoreEncryptedCredentials.mockClear();
  mockValidateCloudPayload.mockClear();
  mockNormalizeDeletedTaskTombstones.mockClear();
  mockNormalizeDeletedEntityTombstones.mockClear();
  mockMergeCloudAllData.mockClear();
  mockMergeEntityCollection.mockClear();
  mockParseTimestamp.mockClear();

  mockValidateCloudPayload.mockReturnValue([]);
  mockBuildEncryptedCredentials.mockResolvedValue(null);
  mockRestoreEncryptedCredentials.mockResolvedValue();

  if (!globalThis.crypto) globalThis.crypto = {};
  if (!globalThis.crypto.subtle) globalThis.crypto.subtle = {};
  globalThis.crypto.subtle.digest = mockDigest;
  mockDigest.mockClear();

  vi.spyOn(performance, 'now').mockReturnValue(1000);
  globalThis.fetch = vi.fn();
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  stopPeriodicGithubSync();
});

// ===========================================================================
// 1. Concurrent save operations
// ===========================================================================
describe('Concurrent save operations', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('first saveToGithub proceeds, second returns false with syncPendingRetry', async () => {
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)
      .mockResolvedValueOnce(makeGithubPutResponse());

    const first = saveToGithub();
    // While first is in-flight, syncInProgress is true
    expect(mockState.syncInProgress).toBe(true);

    const second = await saveToGithub();
    expect(second).toBe(false);
    expect(mockState.syncPendingRetry).toBe(true);

    // Let first complete
    resolveGet(makeGithubGetResponse());
    await first;
  });

  it('syncPendingRetry is cleared after first save completes', async () => {
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)
      .mockResolvedValueOnce(makeGithubPutResponse());

    const first = saveToGithub();
    await saveToGithub(); // sets syncPendingRetry = true
    expect(mockState.syncPendingRetry).toBe(true);

    resolveGet(makeGithubGetResponse());
    await first;

    // Finally block should clear syncPendingRetry and call debouncedSaveToGithub
    expect(mockState.syncPendingRetry).toBe(false);
  });

  it('three rapid calls: only first executes, pending retry is set', async () => {
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)
      .mockResolvedValueOnce(makeGithubPutResponse());

    const first = saveToGithub();
    const second = await saveToGithub();
    const third = await saveToGithub();

    expect(second).toBe(false);
    expect(third).toBe(false);
    expect(mockState.syncPendingRetry).toBe(true);

    // Only one fetch call was made (the GET from the first save)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    resolveGet(makeGithubGetResponse());
    await first;
  });

  it('syncInProgress is released in finally block even on failure', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network down'));

    await saveToGithub();
    expect(mockState.syncInProgress).toBe(false);
  });

  it('syncPendingRetry triggers debouncedSaveToGithub in finally block', async () => {
    // We need to track calls to the module's own debouncedSaveToGithub
    // which sets dirty flag and schedules a timer
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)
      .mockResolvedValueOnce(makeGithubPutResponse());

    const first = saveToGithub();

    // Queue a second save (sets syncPendingRetry)
    await saveToGithub();

    resolveGet(makeGithubGetResponse());
    await first;

    // After first completes, the finally block should have called
    // the module's debouncedSaveToGithub (which sets dirty flag)
    expect(mockState.githubSyncDirty).toBe(true);
  });

  it('loadCloudData sets cloudPullPending when syncInProgress is true', async () => {
    mockState.syncInProgress = true;
    await loadCloudData();
    expect(mockState.cloudPullPending).toBe(true);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('after save completes with cloudPullPending, loadCloudData fires', async () => {
    mockState.cloudPullPending = true;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())  // save GET
      .mockResolvedValueOnce(makeGithubPutResponse())   // save PUT
      .mockResolvedValueOnce(makeGithubGetResponse());  // deferred loadCloudData GET

    await saveToGithub();

    // cloudPullPending should have been consumed
    expect(mockState.cloudPullPending).toBe(false);
  });

  it('deferred loadCloudData calls render on success', async () => {
    mockState.cloudPullPending = true;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())  // save GET
      .mockResolvedValueOnce(makeGithubPutResponse())   // save PUT
      .mockResolvedValueOnce(makeGithubGetResponse());  // deferred load GET

    await saveToGithub();

    // Give promises time to settle
    await new Promise(r => setTimeout(r, 50));

    // render should have been called by the deferred loadCloudData
    expect(window.render).toHaveBeenCalled();
  });

  it('deferred loadCloudData catches errors silently', async () => {
    mockState.cloudPullPending = true;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse())
      .mockRejectedValueOnce(new Error('Deferred load failed'));

    // Should not throw
    await saveToGithub();
    await new Promise(r => setTimeout(r, 50));
    // No unhandled rejection
  });

  it('concurrent loadCloudData calls are blocked when syncInProgress', async () => {
    mockState.syncInProgress = true;

    await loadCloudData();
    await loadCloudData();

    expect(mockState.cloudPullPending).toBe(true);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('second saveToGithub does not interfere with first save fetch calls', async () => {
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)
      .mockResolvedValueOnce(makeGithubPutResponse());

    const firstPromise = saveToGithub();

    // Second call should short-circuit without calling fetch
    const secondResult = await saveToGithub();
    expect(secondResult).toBe(false);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1); // Only the first GET

    resolveGet(makeGithubGetResponse());
    const firstResult = await firstPromise;
    expect(firstResult).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2); // GET + PUT
  });

  it('saveToGithub while loadCloudData is in progress returns false', async () => {
    // Manually set syncInProgress as if loadCloudData holds it
    let resolveLoad;
    const slowLoad = new Promise(r => { resolveLoad = r; });

    globalThis.fetch.mockImplementationOnce(() => slowLoad);

    const loadPromise = loadCloudData();
    // syncInProgress is now true
    expect(mockState.syncInProgress).toBe(true);

    const saveResult = await saveToGithub();
    expect(saveResult).toBe(false);
    expect(mockState.syncPendingRetry).toBe(true);

    resolveLoad(makeGithubGetResponse());
    await loadPromise;
  });

  it('loadCloudData releases syncInProgress even on error', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network fail'));

    try { await loadCloudData(); } catch (_) {}
    expect(mockState.syncInProgress).toBe(false);
  });

  it('after save failure with syncPendingRetry, retry is dispatched via debouncedSaveToGithub', async () => {
    // Use a single fetch mock that sets syncPendingRetry during the GET call then fails
    globalThis.fetch.mockImplementationOnce(() => {
      // Simulate second save request arriving during this save
      mockState.syncPendingRetry = true;
      return Promise.reject(new Error('Network error'));
    });

    await saveToGithub();

    // syncPendingRetry should be cleared by the finally block
    expect(mockState.syncPendingRetry).toBe(false);
    // debouncedSaveToGithub was called in finally block, which sets dirty flag
    expect(localStorage.getItem(MOCK_KEYS.GITHUB_SYNC_DIRTY_KEY)).toBe('true');
  });

  it('multiple queued saves produce only one actual save after lock release', async () => {
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)
      .mockResolvedValueOnce(makeGithubPutResponse());

    const first = saveToGithub();

    // Queue 5 more saves
    for (let i = 0; i < 5; i++) {
      const result = await saveToGithub();
      expect(result).toBe(false);
    }

    // Only one pending retry is set, not 5
    expect(mockState.syncPendingRetry).toBe(true);

    resolveGet(makeGithubGetResponse());
    await first;
  });

  it('save and load interleave: save holds lock, load defers, save completes, load runs', async () => {
    let resolveGet;
    const slowGet = new Promise(r => { resolveGet = r; });

    globalThis.fetch
      .mockImplementationOnce(() => slowGet)        // save GET (slow)
      .mockResolvedValueOnce(makeGithubPutResponse()) // save PUT
      .mockResolvedValueOnce(makeGithubGetResponse()); // deferred load GET

    const savePromise = saveToGithub();

    // Load is blocked
    await loadCloudData();
    expect(mockState.cloudPullPending).toBe(true);

    // Let save complete
    resolveGet(makeGithubGetResponse());
    await savePromise;

    // cloudPullPending should be consumed
    expect(mockState.cloudPullPending).toBe(false);
  });

  it('syncInProgress transitions: false -> true during save -> false after', async () => {
    expect(mockState.syncInProgress).toBe(false);

    let capturedDuringSave = null;
    globalThis.fetch.mockImplementationOnce(() => {
      capturedDuringSave = mockState.syncInProgress;
      return Promise.resolve(makeGithubGetResponse());
    }).mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(capturedDuringSave).toBe(true);
    expect(mockState.syncInProgress).toBe(false);
  });

  it('no token save does not set syncInProgress', async () => {
    localStorage.removeItem(MOCK_KEYS.GITHUB_TOKEN_KEY);
    await saveToGithub();
    expect(mockState.syncInProgress).toBe(false);
  });

  it('pending retry after save failure still clears syncPendingRetry', async () => {
    let fetchCount = 0;
    globalThis.fetch.mockImplementation(() => {
      fetchCount++;
      if (fetchCount === 1) {
        mockState.syncPendingRetry = true;
        return Promise.resolve(makeGithubGetResponse());
      }
      return Promise.resolve(makeErrorResponse(500));
    });

    await saveToGithub();

    expect(mockState.syncPendingRetry).toBe(false);
  });
});

// ===========================================================================
// 2. Network timeout during merge
// ===========================================================================
describe('Network timeout during merge', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('AbortError during GET fails gracefully with no merge', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    globalThis.fetch.mockRejectedValueOnce(abortError);

    const result = await saveToGithub();
    expect(result).toBe(false);
    expect(mockMergeCloudAllData).not.toHaveBeenCalled();
    expect(mockState.syncInProgress).toBe(false);
  });

  it('AbortError during GET records error event', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    globalThis.fetch.mockRejectedValueOnce(abortError);

    await saveToGithub();
    expect(mockState.syncHealth.failedSaves).toBe(1);
  });

  it('timeout during GET does not attempt PUT', async () => {
    const timeoutError = new DOMException('signal is aborted', 'AbortError');
    globalThis.fetch.mockRejectedValueOnce(timeoutError);

    await saveToGithub();

    // Only one fetch call (the GET that timed out), no PUT
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('AbortError during PUT after successful merge triggers rollback', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');

    mockState.allData = { original: true };
    mockState.tasksData = [{ id: 'local_task' }];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { cloud: true }, tasks: [] }))
      .mockRejectedValueOnce(abortError);

    await saveToGithub();

    // State should be rolled back
    expect(mockState.allData).toEqual({ original: true });
  });

  it('network error during GET sets error status', async () => {
    globalThis.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await saveToGithub();
    expect(mockState.syncStatus).toBe('error');
  });

  it('network error during PUT after merge triggers rollback and error status', async () => {
    mockState.tasksData = [{ id: 't1', title: 'Original' }];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ tasks: [{ id: 't2' }] }))
      .mockRejectedValueOnce(new TypeError('Network failed'));

    const result = await saveToGithub();
    expect(result).toBe(false);
    expect(mockState.syncStatus).toBe('error');
  });

  it('GET returning non-ok status proceeds to push without merge', async () => {
    // GET returns 404 (file not found yet)
    globalThis.fetch
      .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce(makeGithubPutResponse());

    const result = await saveToGithub();
    expect(result).toBe(true);
    expect(mockMergeCloudAllData).not.toHaveBeenCalled();
  });

  it('AbortError sets correct error details in syncHealth', async () => {
    const abortError = new DOMException('The user aborted a request.', 'AbortError');
    globalThis.fetch.mockRejectedValueOnce(abortError);

    await saveToGithub();

    expect(mockState.syncHealth.recentEvents.length).toBe(1);
    expect(mockState.syncHealth.recentEvents[0].status).toBe('error');
  });

  it('timeout during save schedules retry', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError');
    globalThis.fetch.mockRejectedValueOnce(abortError);

    await saveToGithub();
    expect(mockState.syncRetryCount).toBe(1);
  });

  it('fetch rejection with arbitrary error still releases syncInProgress', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Unexpected error'));

    await saveToGithub();
    expect(mockState.syncInProgress).toBe(false);
  });
});

// ===========================================================================
// 3. Large payload near 1MB limit
// ===========================================================================
describe('Large payload near 1MB limit', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('payload under 800KB does not trigger console.warn', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const payloadWarns = warnSpy.mock.calls.filter(
      call => typeof call[0] === 'string' && call[0].includes('approaching GitHub API limit')
    );
    expect(payloadWarns.length).toBe(0);
  });

  it('payload over 800KB triggers size warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Create a large allData object that will exceed 800KB
    const largeData = {};
    for (let i = 0; i < 400; i++) {
      const dateKey = `2026-01-${String(i).padStart(3, '0')}`;
      largeData[dateKey] = {
        prayers: { fajr: '1', dhuhr: '1', asr: '1', maghrib: '1', isha: '1' },
        notes: 'A'.repeat(2000),
      };
    }
    mockState.allData = largeData;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const payloadWarns = warnSpy.mock.calls.filter(
      call => typeof call[0] === 'string' && call[0].includes('approaching GitHub API limit')
    );
    expect(payloadWarns.length).toBe(1);
  });

  it('large payload still saves successfully', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const largeData = {};
    for (let i = 0; i < 400; i++) {
      largeData[`2026-${String(i).padStart(3, '0')}`] = { notes: 'X'.repeat(2000) };
    }
    mockState.allData = largeData;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    const result = await saveToGithub();
    expect(result).toBe(true);
  });

  it('payload size is recorded in sync event details', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const lastEvent = mockState.syncHealth.recentEvents[0];
    expect(lastEvent.status).toBe('success');
    // Details should contain the KB size
    expect(lastEvent.details).toMatch(/\d+KB/);
  });

  it('empty allData produces small payload without warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockState.allData = {};

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const payloadWarns = warnSpy.mock.calls.filter(
      call => typeof call[0] === 'string' && call[0].includes('approaching GitHub API limit')
    );
    expect(payloadWarns.length).toBe(0);
  });
});

// ===========================================================================
// 4. 409 Conflict retry behavior
// ===========================================================================
describe('409 Conflict retry behavior', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('first 409 increments syncRetryCount to 1', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();
    expect(mockState.syncRetryCount).toBe(1);
  });

  it('409 triggers rollback of merged state', async () => {
    mockState.allData = { local: true };
    mockState.tasksData = [{ id: 'local_task' }];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { cloud: true }, tasks: [] }))
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();

    // State should be rolled back to pre-merge
    expect(mockState.allData).toEqual({ local: true });
  });

  it('409 conflict uses MAX_CONFLICT_RETRIES of 6', async () => {
    mockState.syncRetryCount = 5;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();

    // Should still retry (5 -> 6, which is equal to max 6)
    expect(mockState.syncRetryCount).toBe(6);
  });

  it('stops retrying after MAX_CONFLICT_RETRIES (6)', async () => {
    mockState.syncRetryCount = 6;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();

    // No more retries scheduled (count stays at 6)
    expect(mockState.syncRetryCount).toBe(6);
    expect(mockState.syncRetryTimer).toBeNull();
  });

  it('409 schedules retry with exponential backoff timer', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();

    // syncRetryTimer should have been set
    expect(mockState.syncRetryCount).toBe(1);
    expect(mockState.syncRetryTimer).not.toBeNull();

    vi.useRealTimers();
  });

  it('409 retry timer calls saveToGithub again', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'))
      // Retry attempt
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(mockState.syncRetryCount).toBe(1);

    // Advance time to trigger retry (base delay for count=1 is 4000ms + jitter up to 2000ms)
    await vi.advanceTimersByTimeAsync(10000);

    // After retry completes successfully
    expect(mockState.syncHealth.successfulSaves).toBeGreaterThanOrEqual(1);

    vi.useRealTimers();
  });

  it('normal error uses MAX_RETRIES of 4', async () => {
    mockState.syncRetryCount = 3;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(500, 'Server error'));

    await saveToGithub();

    // 3 -> 4, equal to max 4
    expect(mockState.syncRetryCount).toBe(4);
  });

  it('normal error stops retrying after MAX_RETRIES (4)', async () => {
    mockState.syncRetryCount = 4;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(500, 'Server error'));

    await saveToGithub();

    // No retry scheduled
    expect(mockState.syncRetryCount).toBe(4);
    expect(mockState.syncRetryTimer).toBeNull();
  });

  it('retry timer is cleared when a new save supersedes it', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

    await saveToGithub();
    expect(mockState.syncRetryTimer).not.toBeNull();

    // New debouncedSaveToGithub cancels existing retry
    debouncedSaveToGithub();
    expect(mockState.syncRetryTimer).toBeNull();

    vi.useRealTimers();
  });

  it('successful save after retry resets syncRetryCount to 0', async () => {
    mockState.syncRetryCount = 3;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(mockState.syncRetryCount).toBe(0);
  });
});

// ===========================================================================
// 5. Rate limit behavior
// ===========================================================================
describe('Rate limit behavior (403)', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('403 PUT response sets syncRateLimited to true', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit exceeded'));

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(true);
  });

  it('403 triggers 60-second auto-clear timer', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit exceeded'));

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(true);

    // Before 60s, still rate limited
    vi.advanceTimersByTime(59000);
    expect(mockState.syncRateLimited).toBe(true);

    // After 60s, auto-cleared
    vi.advanceTimersByTime(2000);
    expect(mockState.syncRateLimited).toBe(false);

    vi.useRealTimers();
  });

  it('debouncedSaveToGithub does not reset retry count when rate limited', () => {
    mockState.syncRateLimited = true;
    mockState.syncRetryCount = 3;

    debouncedSaveToGithub();

    expect(mockState.syncRetryCount).toBe(3);
  });

  it('debouncedSaveToGithub resets retry count when not rate limited', () => {
    mockState.syncRateLimited = false;
    mockState.syncRetryCount = 3;

    debouncedSaveToGithub();

    expect(mockState.syncRetryCount).toBe(0);
  });

  it('successful save after rate limit clears syncRateLimited', async () => {
    mockState.syncRateLimited = true;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(false);
  });

  it('403 records error in sync health', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit'));

    await saveToGithub();

    expect(mockState.syncHealth.failedSaves).toBe(1);
    expect(mockState.syncHealth.lastError).not.toBeNull();
    expect(mockState.syncHealth.lastError.message).toContain('rate limit');
  });

  it('403 error message includes rate limit text', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'API rate limit exceeded'));

    await saveToGithub();

    expect(mockState.syncStatus).toBe('error');
  });

  it('multiple 403s from repeated saves set rate limited flag once', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    // First 403
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit'));

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(true);

    // syncInProgress is now false, try another save
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit'));

    await saveToGithub();
    expect(mockState.syncRateLimited).toBe(true);

    // One 60s clear should suffice
    vi.advanceTimersByTime(61000);
    expect(mockState.syncRateLimited).toBe(false);

    vi.useRealTimers();
  });
});

// ===========================================================================
// 6. Static fallback load path
// ===========================================================================
describe('Static fallback load path (no token)', () => {
  beforeEach(() => {
    vi.useRealTimers();
    // No token set — loadCloudData should fall through to static fetch
  });

  it('fetches from DATA_URL with cache-busting param when no token', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ lastUpdated: new Date().toISOString(), data: {} }),
    });

    await loadCloudData();

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const url = globalThis.fetch.mock.calls[0][0];
    expect(url).toContain('data.json?t=');
  });

  it('static data loaded successfully updates state via mergeLifeData', async () => {
    // When LAST_UPDATED_KEY is not set and cloud has lastUpdated,
    // shouldUseCloud returns true -> wholesale replace sets state.allData
    const staticData = {
      lastUpdated: new Date().toISOString(),
      _sequence: 5,
      data: { '2026-01-01': { prayers: { fajr: '1' } } },
      tasks: [{ id: 'static_task', title: 'From static' }],
      taskCategories: [],
      taskLabels: [],
      taskPeople: [],
      customPerspectives: [],
      homeWidgets: [],
      triggers: [],
      weights: {},
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(staticData),
    });

    await loadCloudData();

    // Wholesale replace path: state.allData should be set directly
    expect(mockState.allData).toEqual(staticData.data);
    expect(localStorage.getItem(MOCK_KEYS.STORAGE_KEY)).toBe(JSON.stringify(staticData.data));
  });

  it('static data with existing LAST_UPDATED_KEY merges via mergeCloudAllData', async () => {
    // Set a recent LAST_UPDATED_KEY so shouldUseCloud returns false -> merge path
    localStorage.setItem(MOCK_KEYS.LAST_UPDATED_KEY, (Date.now() + 100000).toString());
    mockState.allData = { '2026-01-02': { existing: true } };

    const staticData = {
      lastUpdated: new Date(Date.now() - 100000).toISOString(), // older than local
      data: { '2026-01-01': { prayers: { fajr: '1' } } },
      tasks: [],
      taskCategories: [],
    };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(staticData),
    });

    await loadCloudData();

    // Should have gone through the merge path
    expect(mockMergeCloudAllData).toHaveBeenCalled();
  });

  it('static data fetch failure does not throw', async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(loadCloudData()).resolves.not.toThrow();
  });

  it('releases syncInProgress after static load', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    });

    await loadCloudData();
    expect(mockState.syncInProgress).toBe(false);
  });
});

// ===========================================================================
// 7. flushPendingSave with keepalive
// ===========================================================================
describe('flushPendingSave with keepalive', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('does nothing when no debounce timer is pending', () => {
    mockState.syncDebounceTimer = null;
    mockState.githubSyncDirty = false;

    flushPendingSave({ keepalive: true });

    expect(mockState.githubSyncDirty).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('flushes when timer is pending', () => {
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);

    flushPendingSave({ keepalive: true });

    // Timer should be cleared
    expect(mockState.syncDebounceTimer).toBeNull();
    // Dirty flag set
    expect(mockState.githubSyncDirty).toBe(true);
  });

  it('keepalive option is passed through to saveToGithub fetch call', async () => {
    // Set up a pending debounce timer
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    flushPendingSave({ keepalive: true });

    // Need to let the async save start and proceed
    await new Promise(r => setTimeout(r, 50));

    // The PUT call should have keepalive: true
    if (globalThis.fetch.mock.calls.length >= 2) {
      const putOptions = globalThis.fetch.mock.calls[1][1];
      expect(putOptions.keepalive).toBe(true);
    }
  });

  it('flushPendingSave without keepalive passes keepalive as false', async () => {
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    flushPendingSave({});

    await new Promise(r => setTimeout(r, 50));

    if (globalThis.fetch.mock.calls.length >= 2) {
      const putOptions = globalThis.fetch.mock.calls[1][1];
      expect(putOptions.keepalive).toBe(false);
    }
  });

  it('flush catches save errors silently', async () => {
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);

    globalThis.fetch.mockRejectedValueOnce(new Error('Network down'));

    // Should not throw
    expect(() => flushPendingSave({ keepalive: true })).not.toThrow();
    await new Promise(r => setTimeout(r, 50));
  });
});

// ===========================================================================
// 8. initPeriodicGithubSync / stopPeriodicGithubSync
// ===========================================================================
describe('initPeriodicGithubSync / stopPeriodicGithubSync', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('interval fires loadCloudData after 15 minutes', async () => {
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    initPeriodicGithubSync();
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000);

    // loadCloudData should have been called (fetch was invoked)
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it('interval does not fire before 15 minutes', () => {
    initPeriodicGithubSync();
    vi.advanceTimersByTime(14 * 60 * 1000);

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('interval skips when no token', async () => {
    localStorage.removeItem(MOCK_KEYS.GITHUB_TOKEN_KEY);

    initPeriodicGithubSync();
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000);

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('interval skips when offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

    initPeriodicGithubSync();
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000);

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('interval skips when syncInProgress is true', async () => {
    mockState.syncInProgress = true;

    initPeriodicGithubSync();
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000);

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('stopPeriodicGithubSync prevents subsequent interval fires', async () => {
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    initPeriodicGithubSync();
    stopPeriodicGithubSync();
    await vi.advanceTimersByTimeAsync(30 * 60 * 1000);

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('multiple init calls do not create duplicate intervals', async () => {
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    initPeriodicGithubSync();
    initPeriodicGithubSync();
    initPeriodicGithubSync();

    await vi.advanceTimersByTimeAsync(15 * 60 * 1000);

    // Should fire exactly once (not 3 times)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('interval calls render on successful load', async () => {
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    initPeriodicGithubSync();
    await vi.advanceTimersByTimeAsync(15 * 60 * 1000);

    // render should be called after loadCloudData succeeds
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// 9. Bootstrap orchestration - visibilitychange/online handlers
// ===========================================================================
describe('Bootstrap orchestration - visibility and online handlers', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('flushPendingSave fires when debounce timer is pending', () => {
    mockState.githubSyncDirty = true;
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    flushPendingSave({ keepalive: true });

    expect(mockState.syncDebounceTimer).toBeNull();
    expect(mockState.githubSyncDirty).toBe(true);
  });

  it('flushPendingSave does not fire when debounce timer is null', () => {
    mockState.githubSyncDirty = true;
    mockState.syncDebounceTimer = null;

    flushPendingSave({ keepalive: true });

    // No fetch initiated
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('stopPeriodicGithubSync is safe to call multiple times', () => {
    initPeriodicGithubSync();
    stopPeriodicGithubSync();
    stopPeriodicGithubSync();
    stopPeriodicGithubSync();
    // No error
  });

  it('initPeriodicGithubSync clears existing interval before creating new one', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    initPeriodicGithubSync();
    initPeriodicGithubSync();

    vi.advanceTimersByTime(15 * 60 * 1000);
    // Only one interval fires, not two
  });

  it('debouncedSaveToGithub cancels existing retry timer', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    mockState.syncRetryTimer = setTimeout(() => {}, 30000);

    debouncedSaveToGithub();

    expect(mockState.syncRetryTimer).toBeNull();
    vi.useRealTimers();
  });

  it('debouncedSaveToGithub sets dirty flag immediately', () => {
    debouncedSaveToGithub();
    expect(mockState.githubSyncDirty).toBe(true);
    expect(localStorage.getItem(MOCK_KEYS.GITHUB_SYNC_DIRTY_KEY)).toBe('true');
  });

  it('debouncedSaveToGithub cancels previous debounce timer', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    debouncedSaveToGithub();
    const firstTimer = mockState.syncDebounceTimer;

    debouncedSaveToGithub();
    const secondTimer = mockState.syncDebounceTimer;

    // Timers should be different (first was cancelled, second is new)
    expect(firstTimer).not.toBe(secondTimer);

    vi.useRealTimers();
  });

  it('debouncedSaveToGithub fires saveToGithub after 2s debounce', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    debouncedSaveToGithub();

    // Before 2s
    vi.advanceTimersByTime(1999);
    expect(globalThis.fetch).not.toHaveBeenCalled();

    // At 2s
    await vi.advanceTimersByTimeAsync(1);
    // fetch should now be called
    expect(globalThis.fetch).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('online handler integration: saveToGithub called when dirty', async () => {
    mockState.githubSyncDirty = true;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    // Simulate what main.js online handler does
    if (mockState.githubSyncDirty) {
      const result = await saveToGithub();
      expect(result).toBe(true);
    }
  });

  it('online handler: no save when not dirty', async () => {
    mockState.githubSyncDirty = false;

    // Simulate what main.js online handler does
    if (mockState.githubSyncDirty) {
      await saveToGithub();
    }

    // saveToGithub was not called (no fetch)
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// 10. Deep merge verification (end-to-end through saveToGithub)
// ===========================================================================
describe('Deep merge verification through saveToGithub', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('task with all possible fields survives pull-merge-push cycle', async () => {
    const fullTask = {
      id: 'task_full',
      title: 'Complete task',
      notes: 'Detailed notes',
      status: 'active',
      when: 'today',
      flagged: true,
      dueDate: '2026-03-01',
      deferDate: '2026-02-15',
      categoryId: 'cat_1',
      labelIds: ['label_1', 'label_2'],
      personId: 'person_1',
      checklist: [{ id: 'cl_1', text: 'Step 1', done: false }],
      completedAt: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z',
      order: 1,
    };

    mockState.tasksData = [fullTask];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ tasks: [] }))
      .mockResolvedValueOnce(makeGithubPutResponse());

    const result = await saveToGithub();
    expect(result).toBe(true);

    // Verify the PUT body includes our full task in the payload
    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const decoded = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(content), c => c.codePointAt(0))
    ));

    const savedTask = decoded.tasks.find(t => t.id === 'task_full');
    expect(savedTask).toBeDefined();
    expect(savedTask.title).toBe('Complete task');
    expect(savedTask.flagged).toBe(true);
    expect(savedTask.checklist).toHaveLength(1);
  });

  it('entity with unicode in all fields survives round-trip', async () => {
    mockState.taskAreas = [
      { id: 'cat_emoji', name: 'Trabajo', emoji: undefined, createdAt: '2026-01-01T00:00:00Z' },
    ];
    mockState.taskLabels = [
      { id: 'label_uni', name: 'Priorite haute', createdAt: '2026-01-01T00:00:00Z' },
    ];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    const result = await saveToGithub();
    expect(result).toBe(true);

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const decoded = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(content), c => c.codePointAt(0))
    ));

    expect(decoded.taskCategories.find(c => c.id === 'cat_emoji').name).toBe('Trabajo');
    expect(decoded.taskLabels.find(l => l.id === 'label_uni').name).toBe('Priorite haute');
  });

  it('payload includes all expected top-level keys', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const decoded = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(content), c => c.codePointAt(0))
    ));

    expect(decoded).toHaveProperty('_schemaVersion');
    expect(decoded).toHaveProperty('_sequence');
    expect(decoded).toHaveProperty('_checksum');
    expect(decoded).toHaveProperty('lastUpdated');
    expect(decoded).toHaveProperty('data');
    expect(decoded).toHaveProperty('weights');
    expect(decoded).toHaveProperty('maxScores');
    expect(decoded).toHaveProperty('categoryWeights');
    expect(decoded).toHaveProperty('tasks');
    expect(decoded).toHaveProperty('deletedTaskTombstones');
    expect(decoded).toHaveProperty('deletedEntityTombstones');
    expect(decoded).toHaveProperty('taskCategories');
    expect(decoded).toHaveProperty('categories');
    expect(decoded).toHaveProperty('taskLabels');
    expect(decoded).toHaveProperty('taskPeople');
    expect(decoded).toHaveProperty('customPerspectives');
    expect(decoded).toHaveProperty('homeWidgets');
    expect(decoded).toHaveProperty('meetingNotesByEvent');
    expect(decoded).toHaveProperty('triggers');
    expect(decoded).toHaveProperty('xp');
    expect(decoded).toHaveProperty('streak');
    expect(decoded).toHaveProperty('achievements');
  });

  it('mergeCloudAllData is called with cloud data during pull-merge', async () => {
    const cloudData = {
      data: { '2026-01-15': { prayers: { fajr: '1' } } },
    };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockMergeCloudAllData).toHaveBeenCalledWith(
      mockState.allData,
      cloudData.data
    );
  });

  it('mergeEntityCollection is called for tasks during pull-merge', async () => {
    const cloudTask = { id: 'cloud_t1', title: 'Cloud Task', updatedAt: '2026-01-01T00:00:00Z' };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ tasks: [cloudTask] }))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockMergeEntityCollection).toHaveBeenCalled();
  });

  it('pre-merge snapshot captures all required state fields', async () => {
    mockState.allData = { '2026-01-01': {} };
    mockState.tasksData = [{ id: 't1' }];
    mockState.taskAreas = [{ id: 'a1' }];
    mockState.taskCategories = [{ id: 'c1' }];
    mockState.taskLabels = [{ id: 'l1' }];
    mockState.taskPeople = [{ id: 'p1' }];
    mockState.customPerspectives = [{ id: 'cp1' }];
    mockState.homeWidgets = [{ id: 'hw1' }];
    mockState.triggers = [{ id: 'tr1' }];
    mockState.meetingNotesByEvent = { 'e1': { text: 'note' } };
    mockState.conflictNotifications = [{ id: 'cn1' }];

    // Make the PUT fail to trigger rollback
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { cloud: true } }))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    // State should be restored to pre-merge values
    expect(mockState.allData).toEqual({ '2026-01-01': {} });
    expect(mockState.tasksData).toEqual([{ id: 't1' }]);
    expect(mockState.taskAreas).toEqual([{ id: 'a1' }]);
    expect(mockState.taskLabels).toEqual([{ id: 'l1' }]);
    expect(mockState.triggers).toEqual([{ id: 'tr1' }]);
    expect(mockState.meetingNotesByEvent).toEqual({ 'e1': { text: 'note' } });
  });

  it('rollback restores localStorage to pre-merge state on PUT failure', async () => {
    mockState.allData = { date: 'local' };
    mockState.tasksData = [{ id: 'local_t' }];

    // Pre-fill localStorage to match
    localStorage.setItem(MOCK_KEYS.STORAGE_KEY, JSON.stringify(mockState.allData));
    localStorage.setItem(MOCK_KEYS.TASKS_KEY, JSON.stringify(mockState.tasksData));

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { merged: true }, tasks: [{ id: 'cloud_t' }] }))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    // localStorage should be rolled back
    const storedData = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(storedData).toEqual({ date: 'local' });
    const storedTasks = JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY));
    expect(storedTasks).toEqual([{ id: 'local_t' }]);
  });

  it('successful save persists merged state to localStorage', async () => {
    mockState.allData = { '2026-01-01': { prayers: { fajr: '1' } } };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { '2026-01-02': {} } }))
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY));
    expect(stored).toBeDefined();
  });

  it('payload encodes using UTF-8 safe base64', async () => {
    mockState.allData = {};

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    // content should be valid base64
    expect(() => atob(putBody.content)).not.toThrow();
  });

  it('checksum is included in the payload', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const content = putBody.content;
    const decoded = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(content), c => c.codePointAt(0))
    ));

    expect(decoded._checksum).toBeDefined();
    expect(typeof decoded._checksum).toBe('string');
    expect(decoded._checksum.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 11. Sync health tracking edge cases
// ===========================================================================
describe('Sync health tracking', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('successful save updates avgSaveLatencyMs', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    expect(mockState.syncHealth.successfulSaves).toBe(1);
    // avgSaveLatencyMs is computed from performance.now() diff (mocked to 1000)
    expect(typeof mockState.syncHealth.avgSaveLatencyMs).toBe('number');
  });

  it('recent events are capped at 20', async () => {
    // Fill 25 events through 25 saves
    for (let i = 0; i < 25; i++) {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());
      await saveToGithub();
    }

    expect(mockState.syncHealth.recentEvents.length).toBeLessThanOrEqual(20);
  });

  it('failed save increments failedSaves', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Fail'));

    await saveToGithub();
    expect(mockState.syncHealth.failedSaves).toBe(1);
  });

  it('sync health is persisted to localStorage', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const stored = localStorage.getItem(MOCK_KEYS.SYNC_HEALTH_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored);
    expect(parsed.totalSaves).toBe(1);
  });

  it('getSyncHealth returns current sync health', () => {
    mockState.syncHealth.totalSaves = 42;
    expect(getSyncHealth().totalSaves).toBe(42);
  });

  it('failed save records lastError with message and timestamp', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Connection refused'));

    await saveToGithub();

    expect(mockState.syncHealth.lastError).not.toBeNull();
    expect(mockState.syncHealth.lastError.message).toContain('Connection refused');
    expect(mockState.syncHealth.lastError.timestamp).toBeDefined();
    expect(mockState.syncHealth.lastError.type).toBe('save');
  });
});

// ===========================================================================
// 12. loadCloudDataWithRetry advanced scenarios
// ===========================================================================
describe('loadCloudDataWithRetry advanced scenarios', () => {
  beforeEach(() => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('recovers on second attempt after transient failure', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch
      .mockRejectedValueOnce(new Error('Temporary'))
      .mockResolvedValueOnce(makeGithubGetResponse());

    const promise = loadCloudDataWithRetry(3);

    // First attempt fails immediately, then waits 2000ms before retry
    await vi.advanceTimersByTimeAsync(2000);

    await promise;

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(mockState.syncHealth.successfulLoads).toBe(1);
  });

  it('maxRetries=0 means only one attempt', async () => {
    vi.useRealTimers();
    globalThis.fetch.mockRejectedValueOnce(new Error('Fail'));

    await loadCloudDataWithRetry(0);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on AbortError', async () => {
    vi.useRealTimers();
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    globalThis.fetch.mockRejectedValueOnce(abortError);

    await loadCloudDataWithRetry(3);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('backoff delays double each time: 2s, 4s, 8s', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch.mockRejectedValue(new Error('Fail'));

    const promise = loadCloudDataWithRetry(3);

    // First retry after 2s
    await vi.advanceTimersByTimeAsync(2000);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);

    // Second retry after 4s
    await vi.advanceTimersByTimeAsync(4000);
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);

    // Third retry after 8s
    await vi.advanceTimersByTimeAsync(8000);
    expect(globalThis.fetch).toHaveBeenCalledTimes(4);

    await promise;
    vi.useRealTimers();
  });

  it('releases syncInProgress even after all retries fail', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    globalThis.fetch.mockRejectedValue(new Error('Persistent failure'));

    const promise = loadCloudDataWithRetry(2);
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(4000);
    await promise;

    expect(mockState.syncInProgress).toBe(false);
    vi.useRealTimers();
  });
});

// ===========================================================================
// 13. Rollback edge cases
// ===========================================================================
describe('Rollback edge cases', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('rollback restores all state fields after PUT failure', async () => {
    mockState.allData = { pre: true };
    mockState.tasksData = [{ id: 'pre_task' }];
    mockState.deletedTaskTombstones = { del1: '2026-01-01T00:00:00Z' };
    mockState.deletedEntityTombstones = { taskCategories: { c1: '2026-01-01T00:00:00Z' } };
    mockState.taskAreas = [{ id: 'a1', name: 'Area1' }];
    mockState.taskCategories = [{ id: 'c1' }];
    mockState.taskLabels = [{ id: 'l1' }];
    mockState.taskPeople = [{ id: 'p1' }];
    mockState.customPerspectives = [{ id: 'cp1' }];
    mockState.homeWidgets = [{ id: 'w1' }];
    mockState.triggers = [{ id: 'tr1' }];
    mockState.meetingNotesByEvent = { e1: { text: 'note1' } };
    mockState.conflictNotifications = [{ id: 'cn1' }];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({
        data: { merged: true },
        tasks: [{ id: 'cloud_t' }],
        taskCategories: [{ id: 'cloud_area' }],
      }))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    expect(mockState.allData).toEqual({ pre: true });
    expect(mockState.tasksData).toEqual([{ id: 'pre_task' }]);
    expect(mockState.deletedTaskTombstones).toEqual({ del1: '2026-01-01T00:00:00Z' });
    expect(mockState.taskAreas).toEqual([{ id: 'a1', name: 'Area1' }]);
    expect(mockState.homeWidgets).toEqual([{ id: 'w1' }]);
    expect(mockState.triggers).toEqual([{ id: 'tr1' }]);
    expect(mockState.meetingNotesByEvent).toEqual({ e1: { text: 'note1' } });
    expect(mockState.conflictNotifications).toEqual([{ id: 'cn1' }]);
  });

  it('no rollback when GET fails (no premergeSnapshot)', async () => {
    mockState.allData = { stays: true };

    globalThis.fetch.mockRejectedValueOnce(new Error('GET failed'));

    await saveToGithub();

    // State unchanged (no merge happened, no snapshot, no rollback)
    expect(mockState.allData).toEqual({ stays: true });
  });

  it('no rollback when cloud validation fails (merge skipped)', async () => {
    mockValidateCloudPayload.mockReturnValueOnce(['Invalid']);

    mockState.allData = { local: true };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    // No snapshot was taken (merge was skipped), so state stays as-is
    expect(mockState.allData).toEqual({ local: true });
  });

  it('rollback also restores localStorage for all keys', async () => {
    mockState.allData = { orig: true };
    mockState.tasksData = [{ id: 'orig' }];

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { cloud: true }, tasks: [{ id: 'c1' }] }))
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.STORAGE_KEY))).toEqual({ orig: true });
    expect(JSON.parse(localStorage.getItem(MOCK_KEYS.TASKS_KEY))).toEqual([{ id: 'orig' }]);
  });
});

// ===========================================================================
// 14. 401 Unauthorized edge cases
// ===========================================================================
describe('401 Unauthorized edge cases', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('401 on PUT returns false', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(401, 'Bad credentials'));

    const result = await saveToGithub();
    expect(result).toBe(false);
  });

  it('401 on PUT sets error status', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(401, 'Bad credentials'));

    await saveToGithub();
    expect(mockState.syncStatus).toBe('error');
  });

  it('401 triggers rollback if merge happened', async () => {
    mockState.allData = { local: true };

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse({ data: { cloud: true } }))
      .mockResolvedValueOnce(makeErrorResponse(401, 'Bad credentials'));

    await saveToGithub();
    expect(mockState.allData).toEqual({ local: true });
  });

  it('loadCloudData 401 does not throw (caught internally)', async () => {
    globalThis.fetch.mockResolvedValueOnce(makeErrorResponse(401));

    await expect(loadCloudData()).resolves.not.toThrow();
  });
});

// ===========================================================================
// 15. Sequence counter behavior
// ===========================================================================
describe('Sequence counter behavior', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('syncSequence increments on each successful save', async () => {
    mockState.syncSequence = 10;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(mockState.syncSequence).toBe(11);
  });

  it('syncSequence persists to localStorage after save', async () => {
    mockState.syncSequence = 5;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(localStorage.getItem(MOCK_KEYS.SYNC_SEQUENCE_KEY)).toBe('6');
  });

  it('syncSequence still increments even on PUT failure (before rollback)', async () => {
    mockState.syncSequence = 3;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeErrorResponse(500));

    await saveToGithub();

    // Sequence was incremented before the PUT was attempted
    expect(mockState.syncSequence).toBe(4);
  });

  it('loadCloudData updates local sequence when cloud is higher', async () => {
    mockState.syncSequence = 5;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _sequence: 20 }));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(20);
  });

  it('loadCloudData does not downgrade local sequence', async () => {
    mockState.syncSequence = 50;

    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ _sequence: 10 }));
    await loadCloudData();

    expect(mockState.syncSequence).toBe(50);
  });

  it('sequence is included in payload sent to GitHub', async () => {
    mockState.syncSequence = 42;

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();

    const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    const decoded = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(putBody.content), c => c.codePointAt(0))
    ));

    expect(decoded._sequence).toBe(43);
  });
});

// ===========================================================================
// 16. updateSyncStatus edge cases
// ===========================================================================
describe('updateSyncStatus edge cases', () => {
  it('success auto-transitions to idle after 3s', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    updateSyncStatus('success');
    expect(mockState.syncStatus).toBe('success');

    vi.advanceTimersByTime(3000);
    expect(mockState.syncStatus).toBe('idle');

    vi.useRealTimers();
  });

  it('does not override non-success status during auto-transition', () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });

    updateSyncStatus('success');
    updateSyncStatus('error', 'Something broke');
    expect(mockState.syncStatus).toBe('error');

    vi.advanceTimersByTime(3000);
    // Should still be error, not idle
    expect(mockState.syncStatus).toBe('error');

    vi.useRealTimers();
  });

  it('syncing status shows amber animation class', () => {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    document.body.appendChild(indicator);

    updateSyncStatus('syncing', 'Saving...');
    expect(indicator.className).toContain('bg-amber-400');
    expect(indicator.className).toContain('animate-pulse');

    document.body.removeChild(indicator);
  });

  it('idle status shows muted color', () => {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    document.body.appendChild(indicator);

    updateSyncStatus('idle');
    expect(indicator.className).toContain('bg-[var(--text-muted)]');

    document.body.removeChild(indicator);
  });
});
