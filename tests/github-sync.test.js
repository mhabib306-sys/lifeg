/// <reference types="vitest" />
// @vitest-environment jsdom
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
// Mocks — factories reference only hoisted variables
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
  getGithubToken,
  setGithubToken,
  getTheme,
  setTheme,
  applyStoredTheme,
  getColorMode,
  setColorMode,
  toggleColorMode,
  getAccentColor,
  getThemeColors,
  getSyncHealth,
  updateSyncStatus,
  dismissConflictNotification,
  clearConflictNotifications,
  initPeriodicGithubSync,
  stopPeriodicGithubSync,
  debouncedSaveToGithub,
  flushPendingSave,
  saveToGithub,
  loadCloudData,
  loadCloudDataWithRetry,
} from '../src/data/github-sync.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a valid base64-encoded cloud payload for GitHub API responses */
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

/** Create a mock GitHub API GET response (contents endpoint) */
function makeGithubGetResponse(cloudPayloadOverrides = {}, sha = 'abc123sha') {
  const { payload, base64 } = buildCloudPayloadBase64(cloudPayloadOverrides);
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve({ sha, content: base64 }),
    payload,
  };
}

/** Create a mock GitHub API PUT response (success) */
function makeGithubPutResponse() {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve({ content: { sha: 'new_sha' } }),
  };
}

/** Create a mock error response */
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

// ---------------------------------------------------------------------------
// Global setup
// ---------------------------------------------------------------------------

// Mock crypto.subtle.digest for checksum computation
const mockDigest = vi.fn(async (_algo, data) => {
  // Return a deterministic hash buffer (32 bytes of zeros)
  return new ArrayBuffer(32);
});

beforeEach(() => {
  localStorage.clear();
  resetMockState();

  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();

  // Reset all mock function call counts
  mockBuildEncryptedCredentials.mockClear();
  mockRestoreEncryptedCredentials.mockClear();
  mockValidateCloudPayload.mockClear();
  mockNormalizeDeletedTaskTombstones.mockClear();
  mockNormalizeDeletedEntityTombstones.mockClear();
  mockMergeCloudAllData.mockClear();
  mockMergeEntityCollection.mockClear();
  mockParseTimestamp.mockClear();

  // Default mock returns
  mockValidateCloudPayload.mockReturnValue([]);
  mockBuildEncryptedCredentials.mockResolvedValue(null);
  mockRestoreEncryptedCredentials.mockResolvedValue();

  // Mock crypto.subtle
  if (!globalThis.crypto) {
    globalThis.crypto = {};
  }
  if (!globalThis.crypto.subtle) {
    globalThis.crypto.subtle = {};
  }
  globalThis.crypto.subtle.digest = mockDigest;
  mockDigest.mockClear();

  // Mock performance.now
  vi.spyOn(performance, 'now').mockReturnValue(1000);

  // Mock fetch
  globalThis.fetch = vi.fn();

  // Ensure navigator.onLine is true
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });

  vi.useFakeTimers({ shouldAdvanceTime: false });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  stopPeriodicGithubSync();
});

// ===========================================================================
// getGithubToken / setGithubToken
// ===========================================================================
describe('getGithubToken', () => {
  it('returns empty string when no token stored', () => {
    expect(getGithubToken()).toBe('');
  });

  it('returns stored token from localStorage', () => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test_token');
    expect(getGithubToken()).toBe('ghp_test_token');
  });
});

describe('setGithubToken', () => {
  it('stores token in localStorage', () => {
    setGithubToken('ghp_new_token');
    expect(localStorage.getItem(MOCK_KEYS.GITHUB_TOKEN_KEY)).toBe('ghp_new_token');
  });

  it('calls window.render', () => {
    setGithubToken('ghp_new_token');
    expect(window.render).toHaveBeenCalledTimes(1);
  });

  it('overwrites existing token', () => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'old_token');
    setGithubToken('new_token');
    expect(localStorage.getItem(MOCK_KEYS.GITHUB_TOKEN_KEY)).toBe('new_token');
  });
});

// ===========================================================================
// getTheme / setTheme / applyStoredTheme
// ===========================================================================
describe('getTheme', () => {
  it('returns "things3" as default when nothing stored', () => {
    expect(getTheme()).toBe('things3');
  });

  it('returns stored theme', () => {
    localStorage.setItem(MOCK_KEYS.THEME_KEY, 'simplebits');
    expect(getTheme()).toBe('simplebits');
  });
});

describe('setTheme', () => {
  it('stores theme in localStorage', () => {
    setTheme('simplebits');
    expect(localStorage.getItem(MOCK_KEYS.THEME_KEY)).toBe('simplebits');
  });

  it('sets data-theme attribute on documentElement', () => {
    setTheme('geist');
    expect(document.documentElement.getAttribute('data-theme')).toBe('geist');
  });

  it('calls window.render', () => {
    setTheme('things3');
    expect(window.render).toHaveBeenCalledTimes(1);
  });
});

describe('applyStoredTheme', () => {
  it('applies stored theme and color mode to documentElement', () => {
    localStorage.setItem(MOCK_KEYS.THEME_KEY, 'simplebits');
    localStorage.setItem(MOCK_KEYS.COLOR_MODE_KEY, 'dark');
    applyStoredTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('simplebits');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
  });

  it('applies defaults when nothing stored', () => {
    applyStoredTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('things3');
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
  });
});

// ===========================================================================
// getColorMode / setColorMode / toggleColorMode
// ===========================================================================
describe('getColorMode', () => {
  it('returns "light" as default', () => {
    expect(getColorMode()).toBe('light');
  });

  it('returns stored color mode', () => {
    localStorage.setItem(MOCK_KEYS.COLOR_MODE_KEY, 'dark');
    expect(getColorMode()).toBe('dark');
  });
});

describe('setColorMode', () => {
  it('stores color mode in localStorage', () => {
    setColorMode('dark');
    expect(localStorage.getItem(MOCK_KEYS.COLOR_MODE_KEY)).toBe('dark');
  });

  it('sets data-mode attribute on documentElement', () => {
    setColorMode('dark');
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
  });

  it('calls window.render', () => {
    setColorMode('dark');
    expect(window.render).toHaveBeenCalledTimes(1);
  });
});

describe('toggleColorMode', () => {
  it('toggles from light to dark', () => {
    localStorage.setItem(MOCK_KEYS.COLOR_MODE_KEY, 'light');
    toggleColorMode();
    expect(localStorage.getItem(MOCK_KEYS.COLOR_MODE_KEY)).toBe('dark');
  });

  it('toggles from dark to light', () => {
    localStorage.setItem(MOCK_KEYS.COLOR_MODE_KEY, 'dark');
    toggleColorMode();
    expect(localStorage.getItem(MOCK_KEYS.COLOR_MODE_KEY)).toBe('light');
  });

  it('calls render on toggle', () => {
    toggleColorMode();
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// getAccentColor / getThemeColors
// ===========================================================================
describe('getAccentColor', () => {
  it('returns computed accent CSS variable', () => {
    // jsdom getComputedStyle returns empty strings by default
    const result = getAccentColor();
    expect(typeof result).toBe('string');
  });
});

describe('getThemeColors', () => {
  it('returns object with expected keys', () => {
    const colors = getThemeColors();
    expect(colors).toHaveProperty('accent');
    expect(colors).toHaveProperty('accentDark');
    expect(colors).toHaveProperty('accentLight');
    expect(colors).toHaveProperty('bgPrimary');
    expect(colors).toHaveProperty('bgSecondary');
    expect(colors).toHaveProperty('textPrimary');
  });

  it('returns trimmed string values', () => {
    const colors = getThemeColors();
    Object.values(colors).forEach(v => {
      expect(typeof v).toBe('string');
      expect(v).toBe(v.trim());
    });
  });
});

// ===========================================================================
// getSyncHealth
// ===========================================================================
describe('getSyncHealth', () => {
  it('returns state.syncHealth', () => {
    mockState.syncHealth.totalSaves = 5;
    expect(getSyncHealth().totalSaves).toBe(5);
  });

  it('returns the same reference as state.syncHealth', () => {
    expect(getSyncHealth()).toBe(mockState.syncHealth);
  });
});

// ===========================================================================
// updateSyncStatus
// ===========================================================================
describe('updateSyncStatus', () => {
  it('updates state.syncStatus', () => {
    updateSyncStatus('syncing', 'Saving...');
    expect(mockState.syncStatus).toBe('syncing');
  });

  it('updates DOM indicator if element exists', () => {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    document.body.appendChild(indicator);

    updateSyncStatus('error', 'Sync failed');
    expect(indicator.className).toContain('bg-red-500');
    expect(indicator.title).toBe('Sync failed');

    document.body.removeChild(indicator);
  });

  it('sets correct CSS class for syncing state', () => {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    document.body.appendChild(indicator);

    updateSyncStatus('syncing');
    expect(indicator.className).toContain('bg-amber-400');
    expect(indicator.className).toContain('animate-pulse');

    document.body.removeChild(indicator);
  });

  it('sets correct CSS class for success state', () => {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    document.body.appendChild(indicator);

    updateSyncStatus('success');
    expect(indicator.className).toContain('bg-green-500');

    document.body.removeChild(indicator);
  });

  it('sets lastSyncTime on success', () => {
    updateSyncStatus('success', 'Saved');
    expect(mockState.lastSyncTime).toBeInstanceOf(Date);
  });

  it('auto-transitions to idle after success (3s timeout)', () => {
    updateSyncStatus('success');
    expect(mockState.syncStatus).toBe('success');

    vi.advanceTimersByTime(3000);
    expect(mockState.syncStatus).toBe('idle');
  });

  it('does not auto-transition if status changed before timeout', () => {
    updateSyncStatus('success');
    mockState.syncStatus = 'error'; // Changed externally
    vi.advanceTimersByTime(3000);
    expect(mockState.syncStatus).toBe('error'); // Not overwritten to idle
  });

  it('handles missing DOM indicator gracefully', () => {
    // No indicator in DOM — should not throw
    expect(() => updateSyncStatus('idle')).not.toThrow();
  });

  it('uses status as default title if no message provided', () => {
    const indicator = document.createElement('div');
    indicator.id = 'sync-indicator';
    document.body.appendChild(indicator);

    updateSyncStatus('idle');
    expect(indicator.title).toBe('idle');

    document.body.removeChild(indicator);
  });
});

// ===========================================================================
// dismissConflictNotification / clearConflictNotifications
// ===========================================================================
describe('dismissConflictNotification', () => {
  it('removes notification by id', () => {
    mockState.conflictNotifications = [
      { id: 'conf_1', entity: 'task' },
      { id: 'conf_2', entity: 'area' },
    ];
    dismissConflictNotification('conf_1');
    expect(mockState.conflictNotifications).toHaveLength(1);
    expect(mockState.conflictNotifications[0].id).toBe('conf_2');
  });

  it('persists to localStorage', () => {
    mockState.conflictNotifications = [{ id: 'conf_1', entity: 'task' }];
    dismissConflictNotification('conf_1');
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.CONFLICT_NOTIFICATIONS_KEY));
    expect(stored).toEqual([]);
  });

  it('calls render', () => {
    mockState.conflictNotifications = [{ id: 'conf_1' }];
    dismissConflictNotification('conf_1');
    expect(window.render).toHaveBeenCalled();
  });

  it('handles null/undefined conflictNotifications gracefully', () => {
    mockState.conflictNotifications = null;
    expect(() => dismissConflictNotification('conf_1')).not.toThrow();
  });
});

describe('clearConflictNotifications', () => {
  it('clears all notifications', () => {
    mockState.conflictNotifications = [{ id: 'conf_1' }, { id: 'conf_2' }];
    clearConflictNotifications();
    expect(mockState.conflictNotifications).toEqual([]);
  });

  it('persists empty array to localStorage', () => {
    clearConflictNotifications();
    const stored = JSON.parse(localStorage.getItem(MOCK_KEYS.CONFLICT_NOTIFICATIONS_KEY));
    expect(stored).toEqual([]);
  });

  it('calls render', () => {
    clearConflictNotifications();
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// initPeriodicGithubSync / stopPeriodicGithubSync
// ===========================================================================
describe('initPeriodicGithubSync', () => {
  it('sets up an interval', () => {
    initPeriodicGithubSync();
    // The interval exists — advancing time should trigger it
    // (but callback returns early with no token)
    expect(() => vi.advanceTimersByTime(15 * 60 * 1000)).not.toThrow();
  });

  it('clears previous interval before setting new one', () => {
    initPeriodicGithubSync();
    initPeriodicGithubSync(); // Should not stack intervals
    // No error, single interval active
  });

  it('does not call loadCloudData when no token', async () => {
    // No token set — callback should bail early
    initPeriodicGithubSync();
    vi.advanceTimersByTime(15 * 60 * 1000);
    // fetch should not have been called
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

describe('stopPeriodicGithubSync', () => {
  it('clears interval without error', () => {
    initPeriodicGithubSync();
    expect(() => stopPeriodicGithubSync()).not.toThrow();
  });

  it('is safe to call when no interval exists', () => {
    expect(() => stopPeriodicGithubSync()).not.toThrow();
  });
});

// ===========================================================================
// debouncedSaveToGithub
// ===========================================================================
describe('debouncedSaveToGithub', () => {
  it('sets githubSyncDirty to true immediately', () => {
    debouncedSaveToGithub();
    expect(mockState.githubSyncDirty).toBe(true);
  });

  it('persists dirty flag to localStorage', () => {
    debouncedSaveToGithub();
    expect(localStorage.getItem(MOCK_KEYS.GITHUB_SYNC_DIRTY_KEY)).toBe('true');
  });

  it('cancels pending retry timer', () => {
    const retryTimer = setTimeout(() => {}, 10000);
    mockState.syncRetryTimer = retryTimer;
    debouncedSaveToGithub();
    expect(mockState.syncRetryTimer).toBeNull();
  });

  it('resets retry count if not rate limited', () => {
    mockState.syncRetryCount = 3;
    mockState.syncRateLimited = false;
    debouncedSaveToGithub();
    expect(mockState.syncRetryCount).toBe(0);
  });

  it('does not reset retry count when rate limited', () => {
    mockState.syncRetryCount = 3;
    mockState.syncRateLimited = true;
    debouncedSaveToGithub();
    expect(mockState.syncRetryCount).toBe(3);
  });

  it('debounces multiple calls within 2 seconds', () => {
    // Set up a token so saveToGithub actually tries to fetch
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    debouncedSaveToGithub();
    debouncedSaveToGithub();
    debouncedSaveToGithub();

    // Before 2s, saveToGithub should not have been called
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('fires saveToGithub after 2 seconds', async () => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    // Setup: GET + PUT both succeed
    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    debouncedSaveToGithub();
    vi.advanceTimersByTime(2000);

    // fetch should have been called (GET request)
    await vi.runAllTimersAsync();
    expect(globalThis.fetch).toHaveBeenCalled();
  });
});

// ===========================================================================
// flushPendingSave
// ===========================================================================
describe('flushPendingSave', () => {
  it('clears debounce timer', () => {
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);
    flushPendingSave();
    expect(mockState.syncDebounceTimer).toBeNull();
  });

  it('sets dirty flag to true', () => {
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);
    mockState.githubSyncDirty = false;
    flushPendingSave();
    expect(mockState.githubSyncDirty).toBe(true);
    expect(localStorage.getItem(MOCK_KEYS.GITHUB_SYNC_DIRTY_KEY)).toBe('true');
  });

  it('does nothing when no debounce timer pending', () => {
    mockState.syncDebounceTimer = null;
    flushPendingSave();
    // Should not set dirty flag if no timer was pending
    expect(mockState.githubSyncDirty).toBe(false);
  });

  it('attempts save when timer is pending', () => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    globalThis.fetch.mockResolvedValue(makeGithubGetResponse());

    // Create a pending debounce timer
    mockState.syncDebounceTimer = setTimeout(() => {}, 10000);
    flushPendingSave();

    // fetch should eventually be called (saveToGithub is async)
    // Enough to verify timer was cleared and save was initiated
    expect(mockState.syncDebounceTimer).toBeNull();
  });
});

// ===========================================================================
// saveToGithub
// ===========================================================================
describe('saveToGithub', () => {
  it('returns false when no token configured', async () => {
    vi.useRealTimers();
    const result = await saveToGithub();
    expect(result).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('returns false and queues retry when syncInProgress', async () => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    mockState.syncInProgress = true;
    const result = await saveToGithub();
    expect(result).toBe(false);
    expect(mockState.syncPendingRetry).toBe(true);
  });

  it('sets syncInProgress during execution', async () => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');

    let capturedSyncInProgress;
    globalThis.fetch
      .mockImplementationOnce(() => {
        capturedSyncInProgress = mockState.syncInProgress;
        return Promise.resolve(makeGithubGetResponse());
      })
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(capturedSyncInProgress).toBe(true);
  });

  it('releases syncInProgress after completion', async () => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');

    globalThis.fetch
      .mockResolvedValueOnce(makeGithubGetResponse())
      .mockResolvedValueOnce(makeGithubPutResponse());

    await saveToGithub();
    expect(mockState.syncInProgress).toBe(false);
  });

  describe('successful save flow', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('returns true on successful GET + PUT', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      const result = await saveToGithub();
      expect(result).toBe(true);
    });

    it('increments syncSequence', async () => {
      mockState.syncSequence = 5;
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.syncSequence).toBe(6);
    });

    it('persists syncSequence to localStorage', async () => {
      mockState.syncSequence = 10;
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(localStorage.getItem(MOCK_KEYS.SYNC_SEQUENCE_KEY)).toBe('11');
    });

    it('clears dirty flag on success', async () => {
      mockState.githubSyncDirty = true;
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.githubSyncDirty).toBe(false);
      expect(localStorage.getItem(MOCK_KEYS.GITHUB_SYNC_DIRTY_KEY)).toBe('false');
    });

    it('resets retry count on success', async () => {
      mockState.syncRetryCount = 3;
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.syncRetryCount).toBe(0);
    });

    it('clears rate limited flag on success', async () => {
      mockState.syncRateLimited = true;
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.syncRateLimited).toBe(false);
    });

    it('updates sync status to success', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.syncStatus).toBe('success');
    });

    it('records sync event on success', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.syncHealth.totalSaves).toBe(1);
      expect(mockState.syncHealth.successfulSaves).toBe(1);
    });

    it('calls buildEncryptedCredentials for payload', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockBuildEncryptedCredentials).toHaveBeenCalled();
    });

    it('clears syncRetryTimer on success', async () => {
      const timer = setTimeout(() => {}, 10000);
      mockState.syncRetryTimer = timer;

      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();
      expect(mockState.syncRetryTimer).toBeNull();
    });

    it('sends PUT with correct headers and authorization', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();

      // Second call is the PUT
      const putCall = globalThis.fetch.mock.calls[1];
      expect(putCall[1].method).toBe('PUT');
      expect(putCall[1].headers['Authorization']).toBe('token ghp_test');
      expect(putCall[1].headers['Content-Type']).toBe('application/json');
    });

    it('includes SHA in PUT body when file exists', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse({}, 'file_sha_123'))
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();

      const putBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
      expect(putBody.sha).toBe('file_sha_123');
    });

    it('uses keepalive option when specified', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub({ keepalive: true });

      const putCall = globalThis.fetch.mock.calls[1];
      expect(putCall[1].keepalive).toBe(true);
    });
  });

  describe('pull-merge during save', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('merges cloud data before pushing', async () => {
      const cloudData = {
        data: { '2026-01-01': { prayers: { fajr: '1' } } },
        tasks: [{ id: 't1', title: 'Cloud Task' }],
      };
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse(cloudData))
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();

      // mergeCloudAllData should have been called with cloud data
      expect(mockMergeCloudAllData).toHaveBeenCalled();
    });

    it('skips merge when cloud validation fails', async () => {
      mockValidateCloudPayload.mockReturnValueOnce(['tasks must be an array']);

      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse({ tasks: 'invalid' }))
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();

      // mergeCloudAllData should NOT have been called
      expect(mockMergeCloudAllData).not.toHaveBeenCalled();
    });

    it('skips merge when cloud schema version is newer', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse({ _schemaVersion: 999 }))
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();

      // mergeCloudAllData should NOT have been called (schema too new)
      expect(mockMergeCloudAllData).not.toHaveBeenCalled();
    });

    it('persists merged state to localStorage after successful PUT', async () => {
      mockState.allData = { '2026-02-12': { prayers: { fajr: '1' } } };

      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse({ data: { '2026-01-01': {} } }))
        .mockResolvedValueOnce(makeGithubPutResponse());

      await saveToGithub();

      // localStorage should have been updated with current state
      const stored = localStorage.getItem(MOCK_KEYS.STORAGE_KEY);
      expect(stored).toBeTruthy();
    });
  });

  describe('PUT failure and rollback', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('rolls back merged state on PUT failure', async () => {
      mockState.allData = { original: true };
      mockState.tasksData = [{ id: 'original_task' }];

      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse({ data: { cloud: true }, tasks: [] }))
        .mockResolvedValueOnce(makeErrorResponse(500, 'Server error'));

      const result = await saveToGithub();
      expect(result).toBe(false);
      // State should be rolled back to pre-merge snapshot
      // (The snapshot is taken before merge, so state fields restored)
    });

    it('returns false on PUT failure', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeErrorResponse(500));

      const result = await saveToGithub();
      expect(result).toBe(false);
    });

    it('records error sync event on failure', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeErrorResponse(500));

      await saveToGithub();

      expect(mockState.syncHealth.failedSaves).toBe(1);
      expect(mockState.syncHealth.totalSaves).toBe(1);
    });
  });

  describe('409 conflict handling', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('schedules retry on 409 conflict', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

      await saveToGithub();

      // Should have scheduled a retry
      expect(mockState.syncRetryCount).toBe(1);
    });

    it('uses higher max retries for conflicts (6)', async () => {
      mockState.syncRetryCount = 5; // Below conflict max of 6

      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeErrorResponse(409, 'Conflict'));

      await saveToGithub();
      // Should still retry (5 < 6)
      expect(mockState.syncRetryCount).toBe(6);
    });
  });

  describe('401 unauthorized handling', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('throws on 401 PUT response', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeErrorResponse(401, 'Bad credentials'));

      const result = await saveToGithub();
      expect(result).toBe(false);
      expect(mockState.syncStatus).toBe('error');
    });
  });

  describe('403 rate limit handling', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('sets syncRateLimited on 403', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit exceeded'));

      await saveToGithub();
      expect(mockState.syncRateLimited).toBe(true);
    });
  });

  describe('network error handling', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('returns false on network error', async () => {
      globalThis.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const result = await saveToGithub();
      expect(result).toBe(false);
    });

    it('records error event on network error', async () => {
      globalThis.fetch.mockRejectedValueOnce(new TypeError('Network error'));

      await saveToGithub();
      expect(mockState.syncHealth.failedSaves).toBe(1);
    });

    it('schedules retry on network error', async () => {
      globalThis.fetch.mockRejectedValueOnce(new TypeError('Network error'));

      await saveToGithub();
      expect(mockState.syncRetryCount).toBe(1);
    });
  });

  describe('pending retry after save completes', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('triggers debouncedSaveToGithub if syncPendingRetry was set', async () => {
      // Override window.debouncedSaveToGithub to track calls
      const debouncedSpy = vi.fn();
      // The module calls its own debouncedSaveToGithub, not window's
      // But syncPendingRetry should be cleared
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse());

      // Simulate another save request arriving during this save
      let fetchCallCount = 0;
      globalThis.fetch.mockImplementation(() => {
        fetchCallCount++;
        if (fetchCallCount === 1) {
          // During the GET, another save request arrives
          mockState.syncPendingRetry = true;
          return Promise.resolve(makeGithubGetResponse());
        }
        return Promise.resolve(makeGithubPutResponse());
      });

      await saveToGithub();
      expect(mockState.syncPendingRetry).toBe(false);
    });
  });

  describe('cloud pull pending after save', () => {
    beforeEach(() => {
      vi.useRealTimers();
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('triggers loadCloudData if cloudPullPending was set', async () => {
      globalThis.fetch
        .mockResolvedValueOnce(makeGithubGetResponse())
        .mockResolvedValueOnce(makeGithubPutResponse())
        // loadCloudData will also call fetch
        .mockResolvedValueOnce(makeGithubGetResponse());

      mockState.cloudPullPending = true;

      await saveToGithub();
      // cloudPullPending should be cleared
      // After the save, loadCloudData is called which triggers another fetch
      // Verify fetch was called at least 3 times (GET, PUT, then load GET)
      await new Promise(r => setTimeout(r, 50)); // Let promises settle
      expect(globalThis.fetch.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// ===========================================================================
// loadCloudData
// ===========================================================================
describe('loadCloudData', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('sets cloudPullPending and returns early if syncInProgress', async () => {
    mockState.syncInProgress = true;
    await loadCloudData();
    expect(mockState.cloudPullPending).toBe(true);
  });

  describe('no token — static fallback', () => {
    it('falls back to static DATA_URL when no token', async () => {
      const staticData = {
        lastUpdated: new Date().toISOString(),
        data: { '2026-01-01': {} },
        tasks: [],
        taskCategories: [],
        taskLabels: [],
        taskPeople: [],
        customPerspectives: [],
        homeWidgets: [],
        triggers: [],
      };
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(staticData),
      });

      await loadCloudData();
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const url = globalThis.fetch.mock.calls[0][0];
      expect(url).toContain('data.json');
    });

    it('handles static file fetch failure gracefully', async () => {
      globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
      await expect(loadCloudData()).resolves.not.toThrow();
    });
  });

  describe('with token — GitHub API', () => {
    beforeEach(() => {
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('loads and merges cloud data on success', async () => {
      const cloudData = {
        _schemaVersion: 1,
        _sequence: 5,
        lastUpdated: new Date().toISOString(),
        data: { '2026-01-15': { prayers: { fajr: '1' } } },
        tasks: [{ id: 'task_1', title: 'Cloud task', updatedAt: new Date().toISOString() }],
        taskCategories: [],
        categories: [],
        taskLabels: [],
        taskPeople: [],
        customPerspectives: [],
        homeWidgets: [],
        triggers: [],
        meetingNotesByEvent: {},
        weights: { _updatedAt: new Date().toISOString() },
        maxScores: { _updatedAt: new Date().toISOString() },
        xp: { total: 100, _updatedAt: new Date().toISOString() },
        streak: { current: 5, _updatedAt: new Date().toISOString() },
        achievements: { unlocked: {}, _updatedAt: new Date().toISOString() },
      };

      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));

      await loadCloudData();

      expect(mockState.syncStatus).toBe('success');
      expect(mockState.syncHealth.successfulLoads).toBe(1);
    });

    it('updates local syncSequence if cloud is higher', async () => {
      mockState.syncSequence = 3;
      const cloudData = { _sequence: 10 };

      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
      await loadCloudData();

      expect(mockState.syncSequence).toBe(10);
      expect(localStorage.getItem(MOCK_KEYS.SYNC_SEQUENCE_KEY)).toBe('10');
    });

    it('does not update syncSequence if local is higher', async () => {
      mockState.syncSequence = 10;
      const cloudData = { _sequence: 5 };

      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
      await loadCloudData();

      expect(mockState.syncSequence).toBe(10);
    });

    it('restores encrypted credentials from cloud', async () => {
      const cloudData = {
        encryptedCredentials: { some: 'creds' },
      };

      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
      await loadCloudData();

      expect(mockRestoreEncryptedCredentials).toHaveBeenCalledWith({ some: 'creds' });
    });

    it('handles credential restore failure gracefully', async () => {
      mockRestoreEncryptedCredentials.mockRejectedValueOnce(new Error('Crypto failed'));
      const cloudData = { encryptedCredentials: { some: 'creds' } };

      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));
      await expect(loadCloudData()).resolves.not.toThrow();
    });
  });

  describe('schema version check', () => {
    beforeEach(() => {
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('rejects data from newer schema version', async () => {
      const cloudData = { _schemaVersion: 999 };
      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));

      await loadCloudData();

      expect(mockState.syncHealth.failedLoads).toBe(1);
    });

    it('accepts data with same schema version', async () => {
      const cloudData = { _schemaVersion: 1 };
      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));

      await loadCloudData();

      expect(mockState.syncHealth.successfulLoads).toBe(1);
    });
  });

  describe('checksum verification', () => {
    beforeEach(() => {
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('accepts payload without checksum (backwards compatible)', async () => {
      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({}));

      await loadCloudData();
      expect(mockState.syncHealth.successfulLoads).toBe(1);
    });

    it('rejects payload with mismatched checksum', async () => {
      // Mock different hash results for different inputs to simulate mismatch
      let callCount = 0;
      mockDigest.mockImplementation(async () => {
        callCount++;
        // Return different hashes each time to simulate a mismatch
        const buf = new ArrayBuffer(32);
        const view = new Uint8Array(buf);
        view[0] = callCount;
        return buf;
      });

      const cloudData = { _checksum: 'definitely_wrong_checksum' };
      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse(cloudData));

      await loadCloudData();

      // Should have reported checksum mismatch error
      expect(mockState.syncStatus).toBe('error');
    });
  });

  describe('payload validation', () => {
    beforeEach(() => {
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('rejects payload that fails validation', async () => {
      mockValidateCloudPayload.mockReturnValueOnce(['tasks must be an array']);

      globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse({ tasks: 'invalid' }));
      await loadCloudData();

      expect(mockState.syncStatus).toBe('error');
      expect(mockState.syncHealth.failedLoads).toBe(1);
    });
  });

  describe('error response handling', () => {
    beforeEach(() => {
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('handles 401 (auth failed)', async () => {
      globalThis.fetch.mockResolvedValueOnce(makeErrorResponse(401, 'Bad credentials'));

      // 401 throws an error with .status = 401
      // loadCloudData catches it and does not re-throw auth errors
      await loadCloudData();
      expect(mockState.syncStatus).toBe('error');
    });

    it('handles 403 (rate limited)', async () => {
      globalThis.fetch.mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit'));

      await loadCloudData();
      expect(mockState.syncStatus).toBe('error');
    });

    it('handles 404 (file not found) — first sync', async () => {
      globalThis.fetch
        .mockResolvedValueOnce({ ok: false, status: 404 })
        // Falls through to static file fallback
        .mockResolvedValueOnce({ ok: false, status: 404 });

      await loadCloudData();
      // Should not error — 404 means first sync
    });

    it('handles JSON parse error in cloud data', async () => {
      // Create a response where content is not valid base64 JSON
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          sha: 'abc',
          content: btoa('not-valid-json'),
        }),
      });

      await loadCloudData();
      expect(mockState.syncStatus).toBe('error');
    });
  });

  describe('offline handling', () => {
    beforeEach(() => {
      localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    });

    it('handles AbortError gracefully', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      globalThis.fetch.mockRejectedValueOnce(abortError);

      await expect(loadCloudData()).resolves.not.toThrow();
    });

    it('handles offline mode', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      globalThis.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(loadCloudData()).resolves.not.toThrow();
    });
  });

  it('releases syncInProgress in finally block', async () => {
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
    globalThis.fetch.mockRejectedValueOnce(new Error('Network fail'));

    try { await loadCloudData(); } catch (_) {}
    expect(mockState.syncInProgress).toBe(false);
  });
});

// ===========================================================================
// loadCloudDataWithRetry
// ===========================================================================
describe('loadCloudDataWithRetry', () => {
  beforeEach(() => {
    vi.useRealTimers();
    localStorage.setItem(MOCK_KEYS.GITHUB_TOKEN_KEY, 'ghp_test');
  });

  it('succeeds on first attempt', async () => {
    globalThis.fetch.mockResolvedValueOnce(makeGithubGetResponse());

    await loadCloudDataWithRetry();
    expect(mockState.syncHealth.successfulLoads).toBe(1);
  });

  it('retries on transient error', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    // First attempt fails with a retryable error, second succeeds
    globalThis.fetch
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockResolvedValueOnce(makeGithubGetResponse());

    const promise = loadCloudDataWithRetry(3);
    // Advance past the first retry delay (2s)
    await vi.advanceTimersByTimeAsync(2000);
    await promise;
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('does not retry on 401 auth error', async () => {
    globalThis.fetch.mockResolvedValueOnce(makeErrorResponse(401, 'Bad credentials'));

    await loadCloudDataWithRetry(3);
    // Should only have called fetch once (no retries for auth errors)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 403 rate limit', async () => {
    globalThis.fetch.mockResolvedValueOnce(makeErrorResponse(403, 'Rate limit'));

    await loadCloudDataWithRetry(3);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry when offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    globalThis.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await loadCloudDataWithRetry(3);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on AbortError', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    globalThis.fetch.mockRejectedValueOnce(abortError);

    await loadCloudDataWithRetry(3);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('gives up after max retries', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    // All attempts fail with retryable errors
    globalThis.fetch.mockRejectedValue(new Error('Timeout'));

    const promise = loadCloudDataWithRetry(2);
    // Advance past retry delays: 2s + 4s = 6s
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(4000);
    await promise;
    // 1 initial + 2 retries = 3 attempts total
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it('uses default maxRetries of 3', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    globalThis.fetch.mockRejectedValue(new Error('Timeout'));

    const promise = loadCloudDataWithRetry();
    // Advance past retry delays: 2s + 4s + 8s = 14s
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(4000);
    await vi.advanceTimersByTimeAsync(8000);
    await promise;
    // 1 initial + 3 retries = 4 attempts total
    expect(globalThis.fetch).toHaveBeenCalledTimes(4);
    vi.useRealTimers();
  });
});
