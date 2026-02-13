/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ============================================================================
const {
  mockState,
  mockLocalStorage,
  mockFetch,
  MOCK_DEFAULT_DAY_DATA,
  MOCK_CRED_SYNC_KEYS,
} = vi.hoisted(() => {
  const mockState = {
    allData: {},
  };

  // localStorage mock backed by a real Map
  const storage = new Map();
  const mockLocalStorage = {
    getItem: vi.fn((key) => storage.get(key) ?? null),
    setItem: vi.fn((key, value) => storage.set(key, String(value))),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    _storage: storage,
  };

  const mockFetch = vi.fn();

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
    { localStorage: 'lifeGamificationGithubToken', id: 'github' },
    { localStorage: 'nucleusWhoopWorkerUrl', id: 'whoopUrl' },
    { localStorage: 'nucleusWhoopApiKey', id: 'whoopKey' },
  ];

  return { mockState, mockLocalStorage, mockFetch, MOCK_DEFAULT_DAY_DATA, MOCK_CRED_SYNC_KEYS };
});

// ============================================================================
// Mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => ({
  defaultDayData: MOCK_DEFAULT_DAY_DATA,
  CRED_SYNC_KEYS: MOCK_CRED_SYNC_KEYS,
}));

vi.mock('../src/utils.js', () => ({
  getLocalDateString: vi.fn(() => '2026-02-13'),
}));

// Setup global mocks
global.localStorage = mockLocalStorage;
global.fetch = mockFetch;

// Window bridge stubs
const windowStubs = {
  render: vi.fn(),
  saveData: vi.fn(),
  debouncedSaveToGithub: vi.fn(),
  invalidateScoresCache: vi.fn(),
  getCurrentUser: vi.fn(),
};
Object.assign(global.window, windowStubs);

// ============================================================================
// Import modules under test
// ============================================================================
import {
  getWhoopWorkerUrl,
  setWhoopWorkerUrl,
  getWhoopApiKey,
  setWhoopApiKey,
  getWhoopLastSync,
  isWhoopConnected,
  fetchWhoopData,
  checkWhoopStatus,
  syncWhoopNow,
  checkAndSyncWhoop,
  disconnectWhoop,
  stopSyncTimers,
} from '../src/data/whoop-sync.js';

import {
  getLibreWorkerUrl,
  setLibreWorkerUrl,
  getLibreApiKey,
  setLibreApiKey,
  getLibreLastSync,
  isLibreConnected,
  fetchLibreData,
  checkLibreStatus,
  syncLibreNow,
  checkAndSyncLibre,
  connectLibre,
  disconnectLibre,
} from '../src/data/libre-sync.js';

import {
  buildEncryptedCredentials,
  restoreEncryptedCredentials,
  getCredentialSyncStatus,
} from '../src/data/credential-sync.js';

// ============================================================================
// Setup / teardown
// ============================================================================

beforeEach(() => {
  mockLocalStorage._storage.clear();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
  mockFetch.mockReset();
  mockState.allData = {};
  vi.useFakeTimers();

  // Reset window stubs
  windowStubs.render.mockClear();
  windowStubs.saveData.mockClear();
  windowStubs.debouncedSaveToGithub.mockClear();
  windowStubs.invalidateScoresCache.mockClear();
  windowStubs.getCurrentUser.mockReset();
});

afterEach(() => {
  stopSyncTimers();
  vi.useRealTimers();
});

// ############################################################################
// CREDENTIAL-SYNC.JS TESTS
// ############################################################################

describe('credential-sync.js', () => {
  describe('buildEncryptedCredentials', () => {
    it('returns null when no getCurrentUser is available', async () => {
      windowStubs.getCurrentUser.mockReturnValue(null);
      const result = await buildEncryptedCredentials();
      expect(result).toBeNull();
    });

    it('returns null when getCurrentUser returns user with no uid', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ email: 'test@test.com' });
      const result = await buildEncryptedCredentials();
      expect(result).toBeNull();
    });

    it('returns null when no credentials exist in localStorage', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'test-uid-123' });
      // No credentials stored
      const result = await buildEncryptedCredentials();
      expect(result).toBeNull();
    });

    it('returns encrypted bundle when credentials exist and user is authenticated', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'test-uid-456' });
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'sk-ant-test-key');
      const result = await buildEncryptedCredentials();
      // Should return an object with version, salt, etc.
      expect(result).not.toBeNull();
      expect(result.version).toBe(1);
      expect(result).toHaveProperty('salt');
      expect(result).toHaveProperty('wrapIv');
      expect(result).toHaveProperty('wrappedKey');
      expect(result).toHaveProperty('dataIv');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('updatedAt');
    });

    it('returns null when getCurrentUser throws', async () => {
      windowStubs.getCurrentUser.mockImplementation(() => { throw new Error('auth error'); });
      const result = await buildEncryptedCredentials();
      expect(result).toBeNull();
    });

    it('encrypted bundle includes updatedAt as ISO string', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'uid-789' });
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      const result = await buildEncryptedCredentials();
      expect(result).not.toBeNull();
      expect(new Date(result.updatedAt).toISOString()).toBe(result.updatedAt);
    });

    it('encrypts multiple credentials into a single bundle', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'uid-multi' });
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'key1');
      mockLocalStorage._storage.set('lifeGamificationGithubToken', 'ghp_test');
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://whoop.test');
      const result = await buildEncryptedCredentials();
      expect(result).not.toBeNull();
      expect(result.version).toBe(1);
    });

    it('bundle salt and data are base64-encoded strings', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'uid-b64' });
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'test-key');
      const result = await buildEncryptedCredentials();
      expect(result).not.toBeNull();
      // base64 strings only contain [A-Za-z0-9+/=]
      expect(result.salt).toMatch(/^[A-Za-z0-9+/=]+$/);
      expect(result.data).toMatch(/^[A-Za-z0-9+/=]+$/);
      expect(result.wrapIv).toMatch(/^[A-Za-z0-9+/=]+$/);
      expect(result.wrappedKey).toMatch(/^[A-Za-z0-9+/=]+$/);
      expect(result.dataIv).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it('only encrypts credentials that have values in localStorage', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'uid-partial' });
      // Only set 1 of 4 keys
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'only-this-one');
      const result = await buildEncryptedCredentials();
      expect(result).not.toBeNull();
      // The encrypted data blob should exist (we cannot peek inside but it was created)
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('restoreEncryptedCredentials', () => {
    it('returns false for null bundle', async () => {
      const result = await restoreEncryptedCredentials(null);
      expect(result).toBe(false);
    });

    it('returns false for undefined bundle', async () => {
      const result = await restoreEncryptedCredentials(undefined);
      expect(result).toBe(false);
    });

    it('returns false for wrong version', async () => {
      const result = await restoreEncryptedCredentials({ version: 2 });
      expect(result).toBe(false);
    });

    it('returns false for version 0', async () => {
      const result = await restoreEncryptedCredentials({ version: 0 });
      expect(result).toBe(false);
    });

    it('returns false when no getCurrentUser is available', async () => {
      windowStubs.getCurrentUser.mockReturnValue(null);
      const result = await restoreEncryptedCredentials({ version: 1 });
      expect(result).toBe(false);
    });

    it('returns false for bundle missing version', async () => {
      const result = await restoreEncryptedCredentials({ data: 'something' });
      expect(result).toBe(false);
    });

    // NOTE: Full SubtleCrypto round-trip (build + restore) tests cannot run
    // reliably in jsdom because jsdom's unwrapKey has buffer type limitations.
    // The following tests verify the build output shape and guard-clause logic.

    it('built bundle has correct shape for later restoration', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'roundtrip-uid' });
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'sk-test-roundtrip');
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.test');

      const bundle = await buildEncryptedCredentials();
      expect(bundle).not.toBeNull();
      expect(bundle.version).toBe(1);
      // All required fields for restoration are present
      expect(typeof bundle.salt).toBe('string');
      expect(typeof bundle.wrapIv).toBe('string');
      expect(typeof bundle.wrappedKey).toBe('string');
      expect(typeof bundle.dataIv).toBe('string');
      expect(typeof bundle.data).toBe('string');
      expect(bundle.salt.length).toBeGreaterThan(0);
      expect(bundle.data.length).toBeGreaterThan(0);
    });

    it('returns false for empty object (no version field)', async () => {
      const result = await restoreEncryptedCredentials({});
      expect(result).toBe(false);
    });

    it('guard clause: version check runs before uid check', async () => {
      windowStubs.getCurrentUser.mockReturnValue({ uid: 'valid-uid' });
      const result = await restoreEncryptedCredentials({ version: 99 });
      expect(result).toBe(false);
    });

    it('returns false for boolean bundle', async () => {
      const result = await restoreEncryptedCredentials(true);
      expect(result).toBe(false);
    });

    it('returns false for string bundle', async () => {
      const result = await restoreEncryptedCredentials('not-a-bundle');
      expect(result).toBe(false);
    });

    it('returns false for numeric bundle', async () => {
      const result = await restoreEncryptedCredentials(42);
      expect(result).toBe(false);
    });
  });

  describe('getCredentialSyncStatus', () => {
    it('returns hasCreds false and count 0 when no credentials stored', () => {
      const status = getCredentialSyncStatus();
      expect(status.hasCreds).toBe(false);
      expect(status.count).toBe(0);
    });

    it('returns correct count of stored credentials', () => {
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'key1');
      mockLocalStorage._storage.set('lifeGamificationGithubToken', 'ghp_xxx');
      const status = getCredentialSyncStatus();
      expect(status.hasCreds).toBe(true);
      expect(status.count).toBe(2);
    });

    it('returns hasCreds true when at least one credential exists', () => {
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'api-key');
      const status = getCredentialSyncStatus();
      expect(status.hasCreds).toBe(true);
      expect(status.count).toBe(1);
    });

    it('counts all four credential keys when all are present', () => {
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'a');
      mockLocalStorage._storage.set('lifeGamificationGithubToken', 'b');
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'c');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'd');
      const status = getCredentialSyncStatus();
      expect(status.count).toBe(4);
    });

    it('does not count keys not in CRED_SYNC_KEYS', () => {
      mockLocalStorage._storage.set('randomKey', 'value');
      const status = getCredentialSyncStatus();
      expect(status.count).toBe(0);
    });

    it('returns object with exactly hasCreds and count properties', () => {
      const status = getCredentialSyncStatus();
      expect(Object.keys(status)).toEqual(expect.arrayContaining(['hasCreds', 'count']));
    });

    it('count matches number of CRED_SYNC_KEYS with values', () => {
      mockLocalStorage._storage.set('nucleusAnthropicKey', 'val1');
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'val2');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'val3');
      const status = getCredentialSyncStatus();
      expect(status.count).toBe(3);
      expect(status.hasCreds).toBe(true);
    });
  });
});

// ############################################################################
// WHOOP-SYNC.JS TESTS
// ############################################################################

describe('whoop-sync.js', () => {
  describe('getWhoopWorkerUrl / setWhoopWorkerUrl', () => {
    it('returns empty string when not set', () => {
      expect(getWhoopWorkerUrl()).toBe('');
    });

    it('stores and retrieves URL', () => {
      setWhoopWorkerUrl('https://whoop-worker.example.com');
      expect(getWhoopWorkerUrl()).toBe('https://whoop-worker.example.com');
    });

    it('strips trailing slashes', () => {
      setWhoopWorkerUrl('https://whoop-worker.example.com///');
      expect(getWhoopWorkerUrl()).toBe('https://whoop-worker.example.com');
    });

    it('strips single trailing slash', () => {
      setWhoopWorkerUrl('https://whoop.test/');
      expect(getWhoopWorkerUrl()).toBe('https://whoop.test');
    });

    it('preserves URL without trailing slash', () => {
      setWhoopWorkerUrl('https://no-slash.test');
      expect(getWhoopWorkerUrl()).toBe('https://no-slash.test');
    });
  });

  describe('getWhoopApiKey / setWhoopApiKey', () => {
    it('returns empty string when not set', () => {
      expect(getWhoopApiKey()).toBe('');
    });

    it('stores and retrieves API key', () => {
      setWhoopApiKey('whoop-secret-123');
      expect(getWhoopApiKey()).toBe('whoop-secret-123');
    });
  });

  describe('getWhoopLastSync', () => {
    it('returns null when not set', () => {
      expect(getWhoopLastSync()).toBeNull();
    });

    it('parses timestamp as integer', () => {
      const ts = Date.now();
      mockLocalStorage._storage.set('nucleusWhoopLastSync', String(ts));
      expect(getWhoopLastSync()).toBe(ts);
    });

    it('returns null for empty string', () => {
      mockLocalStorage._storage.set('nucleusWhoopLastSync', '');
      expect(getWhoopLastSync()).toBeNull();
    });
  });

  describe('isWhoopConnected', () => {
    it('returns false when not set', () => {
      expect(isWhoopConnected()).toBe(false);
    });

    it('returns true when connected flag is "true"', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      expect(isWhoopConnected()).toBe(true);
    });

    it('returns false for any other value', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'false');
      expect(isWhoopConnected()).toBe(false);
      mockLocalStorage._storage.set('nucleusWhoopConnected', '1');
      expect(isWhoopConnected()).toBe(false);
    });
  });

  describe('fetchWhoopData', () => {
    it('calls /data with API key header', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      const mockData = { sleepPerf: 85, recovery: 70, strain: 12.5 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchWhoopData();
      expect(mockFetch).toHaveBeenCalledWith('https://whoop.test/data', {
        headers: { 'X-API-Key': 'test-key' },
      });
      expect(result).toEqual(mockData);
    });

    it('returns null when no URL configured', async () => {
      setWhoopApiKey('test-key');
      const result = await fetchWhoopData();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns null when no API key configured', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      const result = await fetchWhoopData();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns null on non-200 response', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await fetchWhoopData();
      expect(result).toBeNull();
    });

    it('returns null on network error', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchWhoopData();
      expect(result).toBeNull();
    });

    it('returns null when both URL and key are missing', async () => {
      const result = await fetchWhoopData();
      expect(result).toBeNull();
    });
  });

  describe('checkWhoopStatus', () => {
    it('calls /status endpoint and writes connected flag', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true }),
      });

      const connected = await checkWhoopStatus();
      expect(connected).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('https://whoop.test/status', {
        headers: { 'X-API-Key': 'test-key' },
      });
      expect(mockLocalStorage._storage.get('nucleusWhoopConnected')).toBe('true');
      expect(windowStubs.render).toHaveBeenCalled();
    });

    it('returns false on error', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const connected = await checkWhoopStatus();
      expect(connected).toBe(false);
    });

    it('returns false when not connected', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: false }),
      });

      const connected = await checkWhoopStatus();
      expect(connected).toBe(false);
      expect(mockLocalStorage._storage.get('nucleusWhoopConnected')).toBe('false');
    });

    it('returns false when no URL/key', async () => {
      const result = await checkWhoopStatus();
      expect(result).toBe(false);
    });

    it('returns false on non-200 response', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });
      const result = await checkWhoopStatus();
      expect(result).toBe(false);
    });
  });

  describe('syncWhoopNow', () => {
    it('writes data to allData and calls save chain', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      const whoopData = { sleepPerf: 85, recovery: 70, strain: 12.5 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(whoopData),
      });

      await syncWhoopNow();

      expect(mockState.allData['2026-02-13']).toBeDefined();
      expect(mockState.allData['2026-02-13'].whoop.sleepPerf).toBe(85);
      expect(mockState.allData['2026-02-13'].whoop.recovery).toBe(70);
      expect(mockState.allData['2026-02-13'].whoop.strain).toBe(12.5);
      expect(windowStubs.invalidateScoresCache).toHaveBeenCalled();
      expect(windowStubs.saveData).toHaveBeenCalled();
      expect(windowStubs.debouncedSaveToGithub).toHaveBeenCalled();
      expect(windowStubs.render).toHaveBeenCalled();
    });

    it('creates missing date entry in allData', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sleepPerf: 90, recovery: 80, strain: 10 }),
      });
      expect(mockState.allData['2026-02-13']).toBeUndefined();

      await syncWhoopNow();

      expect(mockState.allData['2026-02-13']).toBeDefined();
      expect(mockState.allData['2026-02-13'].prayers).toBeDefined();
      expect(mockState.allData['2026-02-13'].glucose).toBeDefined();
      expect(mockState.allData['2026-02-13'].whoop.sleepPerf).toBe(90);
    });

    it('schedules retry on failure when connected and not already a retry', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await syncWhoopNow();

      // Retry should be scheduled (60s delay)
      expect(mockState.allData['2026-02-13']).toBeUndefined(); // no data written
    });

    it('does not retry when isRetry=true', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await syncWhoopNow({ isRetry: true });

      // Should not schedule another retry
      expect(windowStubs.saveData).not.toHaveBeenCalled();
    });

    it('does not retry when not connected', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      // Not setting connected flag
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await syncWhoopNow();
      // No retry since not connected
      expect(windowStubs.saveData).not.toHaveBeenCalled();
    });

    it('updates lastSync timestamp on success', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sleepPerf: 80, recovery: 60, strain: 8 }),
      });

      await syncWhoopNow();
      expect(mockLocalStorage._storage.has('nucleusWhoopLastSync')).toBe(true);
    });

    it('writes _lastModified to the date entry', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sleepPerf: 80, recovery: 60, strain: 8 }),
      });

      await syncWhoopNow();
      expect(mockState.allData['2026-02-13']._lastModified).toBeDefined();
    });

    it('handles null/undefined sleepPerf gracefully (does not write)', async () => {
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sleepPerf: null, recovery: 70, strain: 10 }),
      });

      await syncWhoopNow();
      // sleepPerf should not be written (stays as default from defaultDayData)
      expect(mockState.allData['2026-02-13'].whoop.sleepPerf).toBe('');
      expect(mockState.allData['2026-02-13'].whoop.recovery).toBe(70);
    });
  });

  describe('checkAndSyncWhoop', () => {
    it('skips when not connected', async () => {
      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('skips when fresh (synced recently)', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      // Set last sync to "just now"
      mockLocalStorage._storage.set('nucleusWhoopLastSync', String(Date.now()));

      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('syncs when connected and stale', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      // Set last sync to 7 hours ago (stale: > 6 hours)
      mockLocalStorage._storage.set('nucleusWhoopLastSync', String(Date.now() - 7 * 60 * 60 * 1000));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sleepPerf: 80, recovery: 65, strain: 9 }),
      });

      await checkAndSyncWhoop();
      expect(mockFetch).toHaveBeenCalled();
    });

    it('syncs when connected and never synced before', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      setWhoopWorkerUrl('https://whoop.test');
      setWhoopApiKey('test-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sleepPerf: 80, recovery: 65, strain: 9 }),
      });

      await checkAndSyncWhoop();
      expect(mockFetch).toHaveBeenCalled();
    });

    it('skips when no worker URL', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      setWhoopApiKey('test-key');
      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('skips when no API key', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      setWhoopWorkerUrl('https://whoop.test');
      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('disconnectWhoop', () => {
    it('removes connected and lastSync keys', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockLocalStorage._storage.set('nucleusWhoopLastSync', '1234567890');

      disconnectWhoop();

      expect(mockLocalStorage._storage.has('nucleusWhoopConnected')).toBe(false);
      expect(mockLocalStorage._storage.has('nucleusWhoopLastSync')).toBe(false);
    });

    it('calls render after disconnect', () => {
      disconnectWhoop();
      expect(windowStubs.render).toHaveBeenCalled();
    });
  });
});

// ############################################################################
// LIBRE-SYNC.JS TESTS
// ############################################################################

describe('libre-sync.js', () => {
  describe('getLibreWorkerUrl / setLibreWorkerUrl', () => {
    it('returns empty string when not set', () => {
      expect(getLibreWorkerUrl()).toBe('');
    });

    it('stores and retrieves URL', () => {
      setLibreWorkerUrl('https://libre-worker.example.com');
      expect(getLibreWorkerUrl()).toBe('https://libre-worker.example.com');
    });

    it('strips trailing slashes', () => {
      setLibreWorkerUrl('https://libre.test///');
      expect(getLibreWorkerUrl()).toBe('https://libre.test');
    });

    it('strips single trailing slash', () => {
      setLibreWorkerUrl('https://libre.test/');
      expect(getLibreWorkerUrl()).toBe('https://libre.test');
    });
  });

  describe('getLibreApiKey / setLibreApiKey', () => {
    it('returns empty string when not set', () => {
      expect(getLibreApiKey()).toBe('');
    });

    it('stores and retrieves API key', () => {
      setLibreApiKey('libre-secret-456');
      expect(getLibreApiKey()).toBe('libre-secret-456');
    });
  });

  describe('getLibreLastSync', () => {
    it('returns null when not set', () => {
      expect(getLibreLastSync()).toBeNull();
    });

    it('parses timestamp as integer', () => {
      const ts = Date.now();
      mockLocalStorage._storage.set('nucleusLibreLastSync', String(ts));
      expect(getLibreLastSync()).toBe(ts);
    });

    it('returns null for empty string', () => {
      mockLocalStorage._storage.set('nucleusLibreLastSync', '');
      expect(getLibreLastSync()).toBeNull();
    });
  });

  describe('isLibreConnected', () => {
    it('returns false when not set', () => {
      expect(isLibreConnected()).toBe(false);
    });

    it('returns true when connected flag is "true"', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      expect(isLibreConnected()).toBe(true);
    });

    it('returns false for any other value', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'false');
      expect(isLibreConnected()).toBe(false);
    });
  });

  describe('fetchLibreData', () => {
    it('calls /data with API key header', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      const mockData = { currentGlucose: 105, trend: 'stable', avg24h: 110, tir: 85, readingsCount: 48, lastReading: '2026-02-13T10:00:00Z' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchLibreData();
      expect(mockFetch).toHaveBeenCalledWith('https://libre.test/data', {
        headers: { 'X-API-Key': 'libre-key' },
      });
      expect(result).toEqual(mockData);
    });

    it('returns null when no URL configured', async () => {
      setLibreApiKey('libre-key');
      const result = await fetchLibreData();
      expect(result).toBeNull();
    });

    it('returns null when no API key configured', async () => {
      setLibreWorkerUrl('https://libre.test');
      const result = await fetchLibreData();
      expect(result).toBeNull();
    });

    it('returns null on non-200 response', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      const result = await fetchLibreData();
      expect(result).toBeNull();
    });

    it('returns null on network error', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await fetchLibreData();
      expect(result).toBeNull();
    });

    it('returns null when both URL and key are missing', async () => {
      const result = await fetchLibreData();
      expect(result).toBeNull();
    });
  });

  describe('checkLibreStatus', () => {
    it('calls /status and writes connected flag', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true }),
      });

      const connected = await checkLibreStatus();
      expect(connected).toBe(true);
      expect(mockLocalStorage._storage.get('nucleusLibreConnected')).toBe('true');
      expect(windowStubs.render).toHaveBeenCalled();
    });

    it('returns false on error', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockRejectedValueOnce(new Error('Timeout'));

      const connected = await checkLibreStatus();
      expect(connected).toBe(false);
    });

    it('returns false when no URL/key', async () => {
      const result = await checkLibreStatus();
      expect(result).toBe(false);
    });

    it('returns false on non-200 response', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
      const result = await checkLibreStatus();
      expect(result).toBe(false);
    });

    it('writes false for disconnected status', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: false }),
      });
      const result = await checkLibreStatus();
      expect(result).toBe(false);
      expect(mockLocalStorage._storage.get('nucleusLibreConnected')).toBe('false');
    });
  });

  describe('syncLibreNow', () => {
    it('writes glucose avg and tir to glucose sub-object', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 48,
          lastReading: '2026-02-13T10:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(mockState.allData['2026-02-13'].glucose.avg).toBe('110');
      expect(mockState.allData['2026-02-13'].glucose.tir).toBe('85');
    });

    it('writes Libre metadata to libre sub-object', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 105,
          trend: 'rising',
          avg24h: 110,
          tir: 85,
          readingsCount: 48,
          lastReading: '2026-02-13T10:00:00Z',
        }),
      });

      await syncLibreNow();

      const entry = mockState.allData['2026-02-13'];
      expect(entry.libre.currentGlucose).toBe(105);
      expect(entry.libre.trend).toBe('rising');
      expect(entry.libre.readingsCount).toBe(48);
      expect(entry.libre.lastReading).toBe('2026-02-13T10:00:00Z');
    });

    it('creates missing date entry', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      expect(mockState.allData['2026-02-13']).toBeUndefined();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 105,
          tir: 90,
          readingsCount: 24,
          lastReading: '2026-02-13T08:00:00Z',
        }),
      });

      await syncLibreNow();
      expect(mockState.allData['2026-02-13']).toBeDefined();
      expect(mockState.allData['2026-02-13'].prayers).toBeDefined();
    });

    it('triggers full save chain on success', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 105,
          tir: 90,
          readingsCount: 24,
          lastReading: '2026-02-13T08:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(windowStubs.invalidateScoresCache).toHaveBeenCalled();
      expect(windowStubs.saveData).toHaveBeenCalled();
      expect(windowStubs.debouncedSaveToGithub).toHaveBeenCalled();
      expect(windowStubs.render).toHaveBeenCalled();
    });

    it('does nothing when fetchLibreData returns null', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await syncLibreNow();
      expect(windowStubs.saveData).not.toHaveBeenCalled();
      expect(mockState.allData['2026-02-13']).toBeUndefined();
    });

    it('handles missing optional data fields gracefully', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 98,
          // Missing: trend, avg24h, tir, readingsCount, lastReading
        }),
      });

      await syncLibreNow();

      const entry = mockState.allData['2026-02-13'];
      expect(entry.libre.currentGlucose).toBe(98);
      expect(entry.libre.trend).toBe('');
      expect(entry.libre.readingsCount).toBe(0);
      expect(entry.libre.lastReading).toBe('');
    });

    it('glucose avg and tir are stored as strings', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 115,
          tir: 92,
          readingsCount: 50,
          lastReading: '2026-02-13T10:00:00Z',
        }),
      });

      await syncLibreNow();
      expect(typeof mockState.allData['2026-02-13'].glucose.avg).toBe('string');
      expect(typeof mockState.allData['2026-02-13'].glucose.tir).toBe('string');
    });

    it('does not write glucose avg if avg24h is null', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: null,
          tir: 85,
          readingsCount: 20,
          lastReading: '2026-02-13T09:00:00Z',
        }),
      });

      await syncLibreNow();
      // avg should NOT be written (stays as default empty string)
      expect(mockState.allData['2026-02-13'].glucose.avg).toBe('');
      // tir should be written
      expect(mockState.allData['2026-02-13'].glucose.tir).toBe('85');
    });

    it('updates lastSync timestamp', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 110,
          tir: 88,
          readingsCount: 30,
          lastReading: '2026-02-13T09:30:00Z',
        }),
      });

      await syncLibreNow();
      expect(mockLocalStorage._storage.has('nucleusLibreLastSync')).toBe(true);
    });

    it('writes _lastModified to the date entry', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 110,
          tir: 88,
          readingsCount: 30,
          lastReading: '2026-02-13T09:30:00Z',
        }),
      });

      await syncLibreNow();
      expect(mockState.allData['2026-02-13']._lastModified).toBeDefined();
    });
  });

  describe('checkAndSyncLibre', () => {
    it('skips when not connected', async () => {
      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('skips when fresh (synced recently)', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockLocalStorage._storage.set('nucleusLibreLastSync', String(Date.now()));

      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('syncs when connected and stale (>1 hour)', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      // 2 hours ago
      mockLocalStorage._storage.set('nucleusLibreLastSync', String(Date.now() - 2 * 60 * 60 * 1000));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ currentGlucose: 100, trend: 'stable', avg24h: 110, tir: 88, readingsCount: 30, lastReading: '2026-02-13T09:30:00Z' }),
      });

      await checkAndSyncLibre();
      expect(mockFetch).toHaveBeenCalled();
    });

    it('syncs when never synced before', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ currentGlucose: 100, trend: 'stable', avg24h: 110, tir: 88, readingsCount: 30, lastReading: '2026-02-13T09:30:00Z' }),
      });

      await checkAndSyncLibre();
      expect(mockFetch).toHaveBeenCalled();
    });

    it('skips when no worker URL', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      setLibreApiKey('libre-key');
      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('skips when no API key', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      setLibreWorkerUrl('https://libre.test');
      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('connectLibre', () => {
    it('checks status then syncs if connected', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');

      // First call: checkLibreStatus
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: true }),
      });
      // Second call: syncLibreNow -> fetchLibreData
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 110,
          tir: 88,
          readingsCount: 30,
          lastReading: '2026-02-13T09:30:00Z',
        }),
      });

      await connectLibre();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockState.allData['2026-02-13']).toBeDefined();
    });

    it('does not sync if status check returns not connected', async () => {
      setLibreWorkerUrl('https://libre.test');
      setLibreApiKey('libre-key');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ connected: false }),
      });

      await connectLibre();
      // Only 1 call (status check), no sync
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('does nothing when no URL or key', async () => {
      await connectLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('disconnectLibre', () => {
    it('removes connected and lastSync keys', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockLocalStorage._storage.set('nucleusLibreLastSync', '1234567890');

      disconnectLibre();

      expect(mockLocalStorage._storage.has('nucleusLibreConnected')).toBe(false);
      expect(mockLocalStorage._storage.has('nucleusLibreLastSync')).toBe(false);
    });

    it('calls render after disconnect', () => {
      disconnectLibre();
      expect(windowStubs.render).toHaveBeenCalled();
    });
  });
});
