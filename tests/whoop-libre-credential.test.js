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
  MOCK_CRED_SYNC_KEYS
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
    { localStorage: 'lifeGamificationAnthropicKey', id: 'anthropicKey' },
    { localStorage: 'nucleusWhoopWorkerUrl', id: 'whoopWorkerUrl' },
    { localStorage: 'nucleusWhoopApiKey', id: 'whoopApiKey' },
    { localStorage: 'nucleusLibreWorkerUrl', id: 'libreWorkerUrl' },
    { localStorage: 'nucleusLibreApiKey', id: 'libreApiKey' },
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
  getLocalDateString: vi.fn(() => '2026-02-12'),
}));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: vi.fn(),
  saveData: vi.fn(),
  saveWeights: vi.fn(),
}));

// Setup global mocks
global.localStorage = mockLocalStorage;
global.fetch = mockFetch;

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
  connectWhoop,
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
// Tests: whoop-sync.js
// ============================================================================
describe('whoop-sync.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockLocalStorage._storage.clear();
    mockState.allData = {};

    window.render = vi.fn();
    window.saveData = vi.fn();
    window.debouncedSaveToGithub = vi.fn();
    window.invalidateScoresCache = vi.fn();
    window.open = vi.fn();
  });

  afterEach(() => {
    stopSyncTimers();
    vi.useRealTimers();
  });

  // ---------- Config getters / setters ----------

  describe('getWhoopWorkerUrl', () => {
    it('should return empty string when no value stored', () => {
      expect(getWhoopWorkerUrl()).toBe('');
    });

    it('should return stored URL from localStorage', () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      expect(getWhoopWorkerUrl()).toBe('https://worker.example.com');
    });
  });

  describe('setWhoopWorkerUrl', () => {
    it('should save URL to localStorage', () => {
      setWhoopWorkerUrl('https://worker.example.com');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopWorkerUrl',
        'https://worker.example.com'
      );
    });

    it('should strip trailing slashes', () => {
      setWhoopWorkerUrl('https://worker.example.com///');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopWorkerUrl',
        'https://worker.example.com'
      );
    });

    it('should strip single trailing slash', () => {
      setWhoopWorkerUrl('https://worker.example.com/');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopWorkerUrl',
        'https://worker.example.com'
      );
    });

    it('should handle URL without trailing slash unchanged', () => {
      setWhoopWorkerUrl('https://worker.example.com');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopWorkerUrl',
        'https://worker.example.com'
      );
    });
  });

  describe('getWhoopApiKey', () => {
    it('should return empty string when no value stored', () => {
      expect(getWhoopApiKey()).toBe('');
    });

    it('should return stored API key from localStorage', () => {
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-secret-key');
      expect(getWhoopApiKey()).toBe('my-secret-key');
    });
  });

  describe('setWhoopApiKey', () => {
    it('should save API key to localStorage', () => {
      setWhoopApiKey('new-secret-key');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopApiKey',
        'new-secret-key'
      );
    });
  });

  describe('getWhoopLastSync', () => {
    it('should return null when no value stored', () => {
      expect(getWhoopLastSync()).toBeNull();
    });

    it('should parse and return integer timestamp', () => {
      mockLocalStorage._storage.set('nucleusWhoopLastSync', '1707700000000');
      expect(getWhoopLastSync()).toBe(1707700000000);
    });

    it('should parse string timestamp correctly', () => {
      mockLocalStorage._storage.set('nucleusWhoopLastSync', '12345');
      expect(getWhoopLastSync()).toBe(12345);
    });
  });

  describe('isWhoopConnected', () => {
    it('should return false when no value stored', () => {
      expect(isWhoopConnected()).toBe(false);
    });

    it('should return true when localStorage value is "true"', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      expect(isWhoopConnected()).toBe(true);
    });

    it('should return false for any other value', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'false');
      expect(isWhoopConnected()).toBe(false);
    });

    it('should return false for value "1"', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', '1');
      expect(isWhoopConnected()).toBe(false);
    });
  });

  // ---------- API calls ----------

  describe('fetchWhoopData', () => {
    it('should return null when no worker URL is set', async () => {
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'key');
      const result = await fetchWhoopData();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return null when no API key is set', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      const result = await fetchWhoopData();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return null when both URL and key are missing', async () => {
      const result = await fetchWhoopData();
      expect(result).toBeNull();
    });

    it('should fetch from workerUrl/data with X-API-Key header', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85 }),
      });

      await fetchWhoopData();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://worker.example.com/data',
        { headers: { 'X-API-Key': 'my-key' } }
      );
    });

    it('should return parsed JSON on success', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      const mockData = { sleepPerf: 85, recovery: 72, strain: 14.2 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchWhoopData();
      expect(result).toEqual(mockData);
    });

    it('should return null on non-ok response', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      const result = await fetchWhoopData();
      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith('WHOOP data fetch failed:', 500);
      consoleWarnSpy.mockRestore();
    });

    it('should return null on network error', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network down'));

      const result = await fetchWhoopData();
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('WHOOP fetch error:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('checkWhoopStatus', () => {
    it('should return false when no worker URL is set', async () => {
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'key');
      const result = await checkWhoopStatus();
      expect(result).toBe(false);
    });

    it('should return false when no API key is set', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      const result = await checkWhoopStatus();
      expect(result).toBe(false);
    });

    it('should fetch /status endpoint', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: true }),
      });

      await checkWhoopStatus();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://worker.example.com/status',
        { headers: { 'X-API-Key': 'my-key' } }
      );
    });

    it('should store connected=true in localStorage and call render', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: true }),
      });

      const result = await checkWhoopStatus();

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nucleusWhoopConnected', 'true');
      expect(window.render).toHaveBeenCalled();
    });

    it('should store connected=false in localStorage when not connected', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: false }),
      });

      const result = await checkWhoopStatus();

      expect(result).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nucleusWhoopConnected', 'false');
    });

    it('should return false on non-ok response', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      const result = await checkWhoopStatus();
      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await checkWhoopStatus();
      expect(result).toBe(false);
      consoleErrorSpy.mockRestore();
    });
  });

  // ---------- Sync logic ----------

  describe('syncWhoopNow', () => {
    beforeEach(() => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
    });

    it('should write WHOOP data to state.allData for today', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 90, recovery: 65, strain: 12.5 }),
      });

      await syncWhoopNow();

      expect(mockState.allData['2026-02-12']).toBeDefined();
      expect(mockState.allData['2026-02-12'].whoop.sleepPerf).toBe(90);
      expect(mockState.allData['2026-02-12'].whoop.recovery).toBe(65);
      expect(mockState.allData['2026-02-12'].whoop.strain).toBe(12.5);
      consoleLogSpy.mockRestore();
    });

    it('should call saveData, debouncedSaveToGithub, invalidateScoresCache, render', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85, recovery: 70, strain: 10 }),
      });

      await syncWhoopNow();

      expect(window.saveData).toHaveBeenCalled();
      expect(window.debouncedSaveToGithub).toHaveBeenCalled();
      expect(window.invalidateScoresCache).toHaveBeenCalled();
      expect(window.render).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should set lastSync timestamp in localStorage', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      vi.setSystemTime(new Date('2026-02-12T15:00:00Z'));
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85, recovery: 70, strain: 10 }),
      });

      await syncWhoopNow();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopLastSync',
        expect.any(String)
      );
      consoleLogSpy.mockRestore();
    });

    it('should create date entry if not existing in allData', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockState.allData = {};
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 80, recovery: 60, strain: 8 }),
      });

      await syncWhoopNow();

      expect(mockState.allData['2026-02-12']).toBeDefined();
      expect(mockState.allData['2026-02-12'].prayers).toBeDefined();
      consoleLogSpy.mockRestore();
    });

    it('should not overwrite existing non-whoop data', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockState.allData['2026-02-12'] = {
        prayers: { fajr: 'onTime' },
        whoop: {},
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 75, recovery: 55, strain: 9 }),
      });

      await syncWhoopNow();

      expect(mockState.allData['2026-02-12'].prayers.fajr).toBe('onTime');
      expect(mockState.allData['2026-02-12'].whoop.sleepPerf).toBe(75);
      consoleLogSpy.mockRestore();
    });

    it('should handle null sleepPerf/recovery/strain gracefully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockState.allData['2026-02-12'] = {
        whoop: { sleepPerf: 80, recovery: 60, strain: 10 },
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: null, recovery: null, strain: null }),
      });

      await syncWhoopNow();

      // null values should NOT overwrite existing data
      expect(mockState.allData['2026-02-12'].whoop.sleepPerf).toBe(80);
      expect(mockState.allData['2026-02-12'].whoop.recovery).toBe(60);
      expect(mockState.allData['2026-02-12'].whoop.strain).toBe(10);
      consoleLogSpy.mockRestore();
    });

    it('should set _lastModified on the date entry', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85, recovery: 70, strain: 10 }),
      });

      await syncWhoopNow();

      expect(mockState.allData['2026-02-12']._lastModified).toBeDefined();
      expect(new Date(mockState.allData['2026-02-12']._lastModified)).toBeInstanceOf(Date);
      consoleLogSpy.mockRestore();
    });

    it('should not call saveData/render when fetch returns null', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await syncWhoopNow();

      expect(window.saveData).not.toHaveBeenCalled();
      expect(window.render).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should schedule a retry on failure when connected and not already a retry', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await syncWhoopNow();

      // Now resolve the retry fetch
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85, recovery: 70, strain: 10 }),
      });

      // Advance timers by 60s to trigger retry
      await vi.advanceTimersByTimeAsync(60 * 1000);

      expect(consoleLogSpy).toHaveBeenCalledWith('WHOOP retry sync triggered');
      expect(window.saveData).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    it('should not schedule retry when isRetry=true', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await syncWhoopNow({ isRetry: true });

      // Advance past retry delay - should not schedule anything
      vi.advanceTimersByTime(120 * 1000);

      expect(window.saveData).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should not schedule retry when not connected', async () => {
      // nucleusWhoopConnected is not set, so isWhoopConnected() returns false
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await syncWhoopNow();

      vi.advanceTimersByTime(120 * 1000);

      expect(window.saveData).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('checkAndSyncWhoop', () => {
    beforeEach(() => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
    });

    it('should skip when not connected', async () => {
      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip when no worker URL', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockLocalStorage._storage.delete('nucleusWhoopWorkerUrl');
      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip when no API key', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockLocalStorage._storage.delete('nucleusWhoopApiKey');
      await checkAndSyncWhoop();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip when last sync is fresh (less than 6 hours ago)', async () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockLocalStorage._storage.set('nucleusWhoopLastSync', String(Date.now() - 1000));

      await checkAndSyncWhoop();

      // fetchWhoopData is not called because checkAndSyncWhoop returns early
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should sync when last sync is stale (more than 6 hours ago)', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockLocalStorage._storage.set('nucleusWhoopLastSync', String(Date.now() - 7 * 60 * 60 * 1000));
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85, recovery: 70, strain: 10 }),
      });

      await checkAndSyncWhoop();

      expect(mockFetch).toHaveBeenCalled();
      expect(window.saveData).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should sync when lastSync is null', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ sleepPerf: 85, recovery: 70, strain: 10 }),
      });

      await checkAndSyncWhoop();

      expect(mockFetch).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });
  });

  // ---------- Connect / Disconnect ----------

  describe('connectWhoop', () => {
    it('should open auth URL in new tab', () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');

      connectWhoop();

      expect(window.open).toHaveBeenCalledWith('https://worker.example.com/auth', '_blank');
    });

    it('should not open tab when no worker URL', () => {
      connectWhoop();
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  describe('disconnectWhoop', () => {
    it('should remove connected and lastSync from localStorage', () => {
      mockLocalStorage._storage.set('nucleusWhoopConnected', 'true');
      mockLocalStorage._storage.set('nucleusWhoopLastSync', '12345');

      disconnectWhoop();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nucleusWhoopConnected');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nucleusWhoopLastSync');
    });

    it('should call render', () => {
      disconnectWhoop();
      expect(window.render).toHaveBeenCalled();
    });
  });

  // ---------- Timer management ----------

  describe('stopSyncTimers', () => {
    it('should clear all intervals and timeouts', () => {
      // This primarily tests that calling stopSyncTimers does not throw
      stopSyncTimers();
      // Call twice to ensure idempotent
      stopSyncTimers();
    });
  });
});

// ============================================================================
// Tests: libre-sync.js
// ============================================================================
describe('libre-sync.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockLocalStorage._storage.clear();
    mockState.allData = {};

    window.render = vi.fn();
    window.saveData = vi.fn();
    window.debouncedSaveToGithub = vi.fn();
    window.invalidateScoresCache = vi.fn();
    window.open = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ---------- Config getters / setters ----------

  describe('getLibreWorkerUrl', () => {
    it('should return empty string when no value stored', () => {
      expect(getLibreWorkerUrl()).toBe('');
    });

    it('should return stored URL from localStorage', () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      expect(getLibreWorkerUrl()).toBe('https://libre.example.com');
    });
  });

  describe('setLibreWorkerUrl', () => {
    it('should save URL to localStorage', () => {
      setLibreWorkerUrl('https://libre.example.com');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusLibreWorkerUrl',
        'https://libre.example.com'
      );
    });

    it('should strip trailing slashes', () => {
      setLibreWorkerUrl('https://libre.example.com///');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusLibreWorkerUrl',
        'https://libre.example.com'
      );
    });

    it('should strip single trailing slash', () => {
      setLibreWorkerUrl('https://libre.example.com/');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusLibreWorkerUrl',
        'https://libre.example.com'
      );
    });

    it('should handle URL without trailing slash unchanged', () => {
      setLibreWorkerUrl('https://libre.example.com');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusLibreWorkerUrl',
        'https://libre.example.com'
      );
    });
  });

  describe('getLibreApiKey', () => {
    it('should return empty string when no value stored', () => {
      expect(getLibreApiKey()).toBe('');
    });

    it('should return stored API key from localStorage', () => {
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-secret-key');
      expect(getLibreApiKey()).toBe('libre-secret-key');
    });
  });

  describe('setLibreApiKey', () => {
    it('should save API key to localStorage', () => {
      setLibreApiKey('new-libre-key');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusLibreApiKey',
        'new-libre-key'
      );
    });
  });

  describe('getLibreLastSync', () => {
    it('should return null when no value stored', () => {
      expect(getLibreLastSync()).toBeNull();
    });

    it('should parse and return integer timestamp', () => {
      mockLocalStorage._storage.set('nucleusLibreLastSync', '1707700000000');
      expect(getLibreLastSync()).toBe(1707700000000);
    });

    it('should parse string timestamp correctly', () => {
      mockLocalStorage._storage.set('nucleusLibreLastSync', '54321');
      expect(getLibreLastSync()).toBe(54321);
    });
  });

  describe('isLibreConnected', () => {
    it('should return false when no value stored', () => {
      expect(isLibreConnected()).toBe(false);
    });

    it('should return true when localStorage value is "true"', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      expect(isLibreConnected()).toBe(true);
    });

    it('should return false for any other value', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'false');
      expect(isLibreConnected()).toBe(false);
    });

    it('should return false for value "1"', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', '1');
      expect(isLibreConnected()).toBe(false);
    });
  });

  // ---------- API calls ----------

  describe('fetchLibreData', () => {
    it('should return null when no worker URL is set', async () => {
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'key');
      const result = await fetchLibreData();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return null when no API key is set', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      const result = await fetchLibreData();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return null when both URL and key are missing', async () => {
      const result = await fetchLibreData();
      expect(result).toBeNull();
    });

    it('should fetch from workerUrl/data with X-API-Key header', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ currentGlucose: 105 }),
      });

      await fetchLibreData();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://libre.example.com/data',
        { headers: { 'X-API-Key': 'libre-key' } }
      );
    });

    it('should return parsed JSON on success', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      const mockData = { currentGlucose: 105, trend: 'stable', avg24h: 110, tir: 85, readingsCount: 288, lastReading: '2026-02-12T14:00:00Z' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchLibreData();
      expect(result).toEqual(mockData);
    });

    it('should return null on non-ok response', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      const result = await fetchLibreData();
      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Libre data fetch failed:', 500);
      consoleWarnSpy.mockRestore();
    });

    it('should return null on network error', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network down'));

      const result = await fetchLibreData();
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Libre fetch error:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('checkLibreStatus', () => {
    it('should return false when no worker URL is set', async () => {
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'key');
      const result = await checkLibreStatus();
      expect(result).toBe(false);
    });

    it('should return false when no API key is set', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      const result = await checkLibreStatus();
      expect(result).toBe(false);
    });

    it('should fetch /status endpoint', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: true }),
      });

      await checkLibreStatus();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://libre.example.com/status',
        { headers: { 'X-API-Key': 'libre-key' } }
      );
    });

    it('should store connected=true in localStorage and call render', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: true }),
      });

      const result = await checkLibreStatus();

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nucleusLibreConnected', 'true');
      expect(window.render).toHaveBeenCalled();
    });

    it('should store connected=false when not connected', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: false }),
      });

      const result = await checkLibreStatus();

      expect(result).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nucleusLibreConnected', 'false');
    });

    it('should return false on non-ok response', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      const result = await checkLibreStatus();
      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await checkLibreStatus();
      expect(result).toBe(false);
      consoleErrorSpy.mockRestore();
    });
  });

  // ---------- Sync logic ----------

  describe('syncLibreNow', () => {
    beforeEach(() => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
    });

    it('should write glucose data to state.allData for today', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 288,
          lastReading: '2026-02-12T14:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(mockState.allData['2026-02-12']).toBeDefined();
      expect(mockState.allData['2026-02-12'].glucose.avg).toBe('110');
      expect(mockState.allData['2026-02-12'].glucose.tir).toBe('85');
      expect(mockState.allData['2026-02-12'].libre.currentGlucose).toBe(105);
      expect(mockState.allData['2026-02-12'].libre.trend).toBe('stable');
      expect(mockState.allData['2026-02-12'].libre.readingsCount).toBe(288);
      expect(mockState.allData['2026-02-12'].libre.lastReading).toBe('2026-02-12T14:00:00Z');
      consoleLogSpy.mockRestore();
    });

    it('should call saveData, debouncedSaveToGithub, invalidateScoresCache, render', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 288,
          lastReading: '2026-02-12T14:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(window.saveData).toHaveBeenCalled();
      expect(window.debouncedSaveToGithub).toHaveBeenCalled();
      expect(window.invalidateScoresCache).toHaveBeenCalled();
      expect(window.render).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should set lastSync timestamp in localStorage', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 288,
          lastReading: '2026-02-12T14:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusLibreLastSync',
        expect.any(String)
      );
      consoleLogSpy.mockRestore();
    });

    it('should create date entry if not existing in allData', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockState.allData = {};
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 100,
          trend: 'rising',
          avg24h: 108,
          tir: 80,
          readingsCount: 250,
          lastReading: '2026-02-12T13:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(mockState.allData['2026-02-12']).toBeDefined();
      expect(mockState.allData['2026-02-12'].prayers).toBeDefined();
      consoleLogSpy.mockRestore();
    });

    it('should not overwrite existing non-libre data', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockState.allData['2026-02-12'] = {
        prayers: { fajr: 'onTime' },
        glucose: {},
        libre: {},
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 100,
          trend: 'falling',
          avg24h: 115,
          tir: 78,
          readingsCount: 200,
          lastReading: '2026-02-12T12:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(mockState.allData['2026-02-12'].prayers.fajr).toBe('onTime');
      expect(mockState.allData['2026-02-12'].libre.currentGlucose).toBe(100);
      consoleLogSpy.mockRestore();
    });

    it('should store glucose avg and tir as strings', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 100,
          trend: 'stable',
          avg24h: 112,
          tir: 90,
          readingsCount: 200,
          lastReading: '2026-02-12T12:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(typeof mockState.allData['2026-02-12'].glucose.avg).toBe('string');
      expect(typeof mockState.allData['2026-02-12'].glucose.tir).toBe('string');
      consoleLogSpy.mockRestore();
    });

    it('should handle null avg24h/tir gracefully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockState.allData['2026-02-12'] = {
        glucose: { avg: '100', tir: '80' },
        libre: {},
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: null,
          tir: null,
          readingsCount: 100,
          lastReading: '2026-02-12T12:00:00Z',
        }),
      });

      await syncLibreNow();

      // null values should NOT overwrite
      expect(mockState.allData['2026-02-12'].glucose.avg).toBe('100');
      expect(mockState.allData['2026-02-12'].glucose.tir).toBe('80');
      consoleLogSpy.mockRestore();
    });

    it('should set _lastModified on the date entry', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 288,
          lastReading: '2026-02-12T14:00:00Z',
        }),
      });

      await syncLibreNow();

      expect(mockState.allData['2026-02-12']._lastModified).toBeDefined();
      consoleLogSpy.mockRestore();
    });

    it('should not call saveData/render when fetch returns null', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await syncLibreNow();

      expect(window.saveData).not.toHaveBeenCalled();
      expect(window.render).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should handle missing trend/readingsCount/lastReading with defaults', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          avg24h: 110,
          tir: 85,
          // trend, readingsCount, lastReading intentionally omitted
        }),
      });

      await syncLibreNow();

      expect(mockState.allData['2026-02-12'].libre.trend).toBe('');
      expect(mockState.allData['2026-02-12'].libre.readingsCount).toBe(0);
      expect(mockState.allData['2026-02-12'].libre.lastReading).toBe('');
      consoleLogSpy.mockRestore();
    });
  });

  describe('checkAndSyncLibre', () => {
    beforeEach(() => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
    });

    it('should skip when not connected', async () => {
      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip when no worker URL', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockLocalStorage._storage.delete('nucleusLibreWorkerUrl');
      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip when no API key', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockLocalStorage._storage.delete('nucleusLibreApiKey');
      await checkAndSyncLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should skip when last sync is fresh (less than 1 hour ago)', async () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockLocalStorage._storage.set('nucleusLibreLastSync', String(Date.now() - 1000));

      await checkAndSyncLibre();

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should sync when last sync is stale (more than 1 hour ago)', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockLocalStorage._storage.set('nucleusLibreLastSync', String(Date.now() - 2 * 60 * 60 * 1000));
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 288,
          lastReading: '2026-02-12T14:00:00Z',
        }),
      });

      await checkAndSyncLibre();

      expect(mockFetch).toHaveBeenCalled();
      expect(window.saveData).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should sync when lastSync is null', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          currentGlucose: 105,
          trend: 'stable',
          avg24h: 110,
          tir: 85,
          readingsCount: 288,
          lastReading: '2026-02-12T14:00:00Z',
        }),
      });

      await checkAndSyncLibre();

      expect(mockFetch).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });
  });

  // ---------- Connect / Disconnect ----------

  describe('connectLibre', () => {
    it('should check status and sync when connected', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      let callCount = 0;
      mockFetch.mockImplementation(async (url) => {
        callCount++;
        if (url.includes('/status')) {
          return { ok: true, json: async () => ({ connected: true }) };
        }
        // /data
        return {
          ok: true,
          json: async () => ({
            currentGlucose: 105,
            trend: 'stable',
            avg24h: 110,
            tir: 85,
            readingsCount: 288,
            lastReading: '2026-02-12T14:00:00Z',
          }),
        };
      });

      await connectLibre();

      // Should have called /status then /data
      expect(callCount).toBeGreaterThanOrEqual(2);
      expect(window.saveData).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should not sync when status returns not connected', async () => {
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ connected: false }),
      });

      await connectLibre();

      // Only /status called, no /data because not connected
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(window.saveData).not.toHaveBeenCalled();
    });

    it('should do nothing when no URL or key', async () => {
      await connectLibre();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('disconnectLibre', () => {
    it('should remove connected and lastSync from localStorage', () => {
      mockLocalStorage._storage.set('nucleusLibreConnected', 'true');
      mockLocalStorage._storage.set('nucleusLibreLastSync', '12345');

      disconnectLibre();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nucleusLibreConnected');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('nucleusLibreLastSync');
    });

    it('should call render', () => {
      disconnectLibre();
      expect(window.render).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// Tests: credential-sync.js
// ============================================================================
describe('credential-sync.js', () => {
  // Helpers for crypto mocking
  let mockDataKey;
  let mockWrappingKey;
  let mockEncryptedData;
  let mockWrappedKey;
  let mockSubtle;
  let originalCrypto;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage._storage.clear();
    mockState.allData = {};

    window.render = vi.fn();
    window.saveData = vi.fn();
    window.debouncedSaveToGithub = vi.fn();
    window.invalidateScoresCache = vi.fn();
    window.getCurrentUser = vi.fn();

    // Mock crypto.getRandomValues
    mockDataKey = { type: 'secret', algorithm: { name: 'AES-GCM' } };
    mockWrappingKey = { type: 'secret', algorithm: { name: 'AES-GCM' } };
    mockEncryptedData = new ArrayBuffer(32);
    mockWrappedKey = new ArrayBuffer(48);

    mockSubtle = {
      generateKey: vi.fn(async () => mockDataKey),
      importKey: vi.fn(async () => ({ type: 'secret' })),
      deriveKey: vi.fn(async () => mockWrappingKey),
      wrapKey: vi.fn(async () => mockWrappedKey),
      encrypt: vi.fn(async () => mockEncryptedData),
      unwrapKey: vi.fn(async () => mockDataKey),
      decrypt: vi.fn(async () => new TextEncoder().encode(JSON.stringify({ whoopWorkerUrl: 'https://worker.example.com' }))),
    };

    // Save original crypto and replace with a fully writable mock
    originalCrypto = global.crypto;
    const mockCrypto = {
      getRandomValues: vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) arr[i] = i % 256;
        return arr;
      }),
      subtle: mockSubtle,
    };
    Object.defineProperty(global, 'crypto', {
      value: mockCrypto,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original crypto
    Object.defineProperty(global, 'crypto', {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  // ---------- buildEncryptedCredentials ----------

  describe('buildEncryptedCredentials', () => {
    it('should return null when SubtleCrypto is not available', async () => {
      Object.defineProperty(global, 'crypto', {
        value: { getRandomValues: vi.fn(), subtle: undefined },
        writable: true,
        configurable: true,
      });

      const result = await buildEncryptedCredentials();

      expect(result).toBeNull();
    });

    it('should return null when no Firebase UID is available', async () => {
      window.getCurrentUser.mockReturnValue(null);

      const result = await buildEncryptedCredentials();

      expect(result).toBeNull();
    });

    it('should return null when getCurrentUser throws', async () => {
      window.getCurrentUser.mockImplementation(() => { throw new Error('Auth error'); });

      const result = await buildEncryptedCredentials();

      expect(result).toBeNull();
    });

    it('should return null when no credentials exist in localStorage', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });

      const result = await buildEncryptedCredentials();

      expect(result).toBeNull();
    });

    it('should encrypt when credentials exist', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');

      const result = await buildEncryptedCredentials();

      expect(result).not.toBeNull();
      expect(result.version).toBe(1);
      expect(result.salt).toBeDefined();
      expect(result.wrapIv).toBeDefined();
      expect(result.wrappedKey).toBeDefined();
      expect(result.dataIv).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should call crypto.subtle.generateKey for data key', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');

      await buildEncryptedCredentials();

      expect(global.crypto.subtle.generateKey).toHaveBeenCalledWith(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    });

    it('should call crypto.subtle.importKey for PBKDF2 material', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');

      await buildEncryptedCredentials();

      const call = global.crypto.subtle.importKey.mock.calls[0];
      expect(call[0]).toBe('raw');
      // TextEncoder.encode returns Uint8Array containing uid + project ID
      expect(call[1]).toBeTruthy();
      expect(call[1].byteLength || call[1].length).toBeGreaterThan(0);
      expect(call[2]).toBe('PBKDF2');
      expect(call[3]).toBe(false);
      expect(call[4]).toEqual(['deriveKey']);
    });

    it('should call crypto.subtle.deriveKey with PBKDF2 params', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');

      await buildEncryptedCredentials();

      expect(global.crypto.subtle.deriveKey).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'PBKDF2',
          iterations: 100_000,
          hash: 'SHA-256',
        }),
        expect.anything(),
        { name: 'AES-GCM', length: 256 },
        false,
        ['wrapKey', 'unwrapKey']
      );
    });

    it('should call crypto.subtle.wrapKey to wrap the data key', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');

      await buildEncryptedCredentials();

      expect(global.crypto.subtle.wrapKey).toHaveBeenCalledWith(
        'raw',
        mockDataKey,
        mockWrappingKey,
        expect.objectContaining({ name: 'AES-GCM' })
      );
    });

    it('should call crypto.subtle.encrypt for credential JSON', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');

      await buildEncryptedCredentials();

      const encryptCall = global.crypto.subtle.encrypt.mock.calls[0];
      expect(encryptCall[0].name).toBe('AES-GCM');
      expect(encryptCall[0].iv).toBeTruthy();
      expect(encryptCall[0].iv.length).toBe(12);
      expect(encryptCall[1]).toBe(mockDataKey);
      expect(encryptCall[2]).toBeTruthy();
      expect(encryptCall[2].length).toBeGreaterThan(0);
    });

    it('should only include non-empty credentials', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      // Set only some credentials
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      // nucleusWhoopApiKey, nucleusLibreWorkerUrl, nucleusLibreApiKey, lifeGamificationAnthropicKey are not set

      await buildEncryptedCredentials();

      // Check the plaintext that was encrypted
      const encryptCall = global.crypto.subtle.encrypt.mock.calls[0];
      const plaintext = new TextDecoder().decode(encryptCall[2]);
      const creds = JSON.parse(plaintext);
      expect(creds).toEqual({ whoopWorkerUrl: 'https://worker.example.com' });
    });

    it('should include multiple credentials when multiple are set', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'whoop-key');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');

      await buildEncryptedCredentials();

      const encryptCall = global.crypto.subtle.encrypt.mock.calls[0];
      const plaintext = new TextDecoder().decode(encryptCall[2]);
      const creds = JSON.parse(plaintext);
      expect(creds).toEqual({
        whoopWorkerUrl: 'https://worker.example.com',
        whoopApiKey: 'whoop-key',
        libreApiKey: 'libre-key',
      });
    });

    it('should return null when encryption fails', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');
      global.crypto.subtle.encrypt.mockRejectedValue(new Error('Encrypt failed'));
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await buildEncryptedCredentials();

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Credential encryption failed:',
        'Encrypt failed'
      );
      consoleWarnSpy.mockRestore();
    });
  });

  // ---------- restoreEncryptedCredentials ----------

  describe('restoreEncryptedCredentials', () => {
    const validBundle = {
      version: 1,
      salt: btoa(String.fromCharCode(...new Uint8Array(16))),
      wrapIv: btoa(String.fromCharCode(...new Uint8Array(12))),
      wrappedKey: btoa(String.fromCharCode(...new Uint8Array(48))),
      dataIv: btoa(String.fromCharCode(...new Uint8Array(12))),
      data: btoa(String.fromCharCode(...new Uint8Array(32))),
      updatedAt: '2026-02-12T10:00:00Z',
    };

    it('should return false when bundle is null', async () => {
      const result = await restoreEncryptedCredentials(null);
      expect(result).toBe(false);
    });

    it('should return false when bundle is undefined', async () => {
      const result = await restoreEncryptedCredentials(undefined);
      expect(result).toBe(false);
    });

    it('should return false when bundle version is not 1', async () => {
      const result = await restoreEncryptedCredentials({ ...validBundle, version: 2 });
      expect(result).toBe(false);
    });

    it('should return false when SubtleCrypto is not available', async () => {
      Object.defineProperty(global, 'crypto', {
        value: { getRandomValues: vi.fn(), subtle: undefined },
        writable: true,
        configurable: true,
      });

      const result = await restoreEncryptedCredentials(validBundle);

      expect(result).toBe(false);
    });

    it('should return false when no Firebase UID', async () => {
      window.getCurrentUser.mockReturnValue(null);

      const result = await restoreEncryptedCredentials(validBundle);

      expect(result).toBe(false);
    });

    it('should gap-fill credentials into empty localStorage keys', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      global.crypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({
          whoopWorkerUrl: 'https://worker.example.com',
          whoopApiKey: 'restored-key',
        }))
      );

      const result = await restoreEncryptedCredentials(validBundle);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopWorkerUrl',
        'https://worker.example.com'
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'nucleusWhoopApiKey',
        'restored-key'
      );
      consoleLogSpy.mockRestore();
    });

    it('should NOT overwrite existing localStorage values (gap-fill only)', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://existing.example.com');
      global.crypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({
          whoopWorkerUrl: 'https://cloud.example.com',
          whoopApiKey: 'cloud-key',
        }))
      );

      const result = await restoreEncryptedCredentials(validBundle);

      // Should have restored whoopApiKey but not whoopWorkerUrl
      expect(result).toBe(true);
      // The setItem for whoopWorkerUrl should NOT have been called from restoreEncryptedCredentials
      // (only the gap-fill for whoopApiKey should be set)
      const setItemCalls = mockLocalStorage.setItem.mock.calls;
      const whoopUrlCalls = setItemCalls.filter(([k]) => k === 'nucleusWhoopWorkerUrl');
      expect(whoopUrlCalls.length).toBe(0);
      // But whoopApiKey should be set
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nucleusWhoopApiKey', 'cloud-key');
      consoleLogSpy.mockRestore();
    });

    it('should return false when no credentials were restored (all already filled)', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      // Pre-fill all keys that exist in the cloud bundle
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'existing-url');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'existing-key');
      global.crypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({
          whoopWorkerUrl: 'cloud-url',
          whoopApiKey: 'cloud-key',
        }))
      );

      const result = await restoreEncryptedCredentials(validBundle);

      expect(result).toBe(false);
    });

    it('should call crypto.subtle.unwrapKey to recover data key', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      global.crypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({
          whoopApiKey: 'key',
        }))
      );

      await restoreEncryptedCredentials(validBundle);

      expect(global.crypto.subtle.unwrapKey).toHaveBeenCalledWith(
        'raw',
        expect.any(ArrayBuffer),
        mockWrappingKey,
        expect.objectContaining({ name: 'AES-GCM' }),
        expect.objectContaining({ name: 'AES-GCM', length: 256 }),
        false,
        ['decrypt']
      );
      consoleLogSpy.mockRestore();
    });

    it('should call crypto.subtle.decrypt with data key', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      global.crypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({
          whoopApiKey: 'key',
        }))
      );

      await restoreEncryptedCredentials(validBundle);

      expect(global.crypto.subtle.decrypt).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'AES-GCM' }),
        mockDataKey,
        expect.any(ArrayBuffer)
      );
      consoleLogSpy.mockRestore();
    });

    it('should log count of restored credentials', async () => {
      window.getCurrentUser.mockReturnValue({ uid: 'test-uid' });
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      global.crypto.subtle.decrypt.mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({
          whoopWorkerUrl: 'https://w.example.com',
          whoopApiKey: 'key1',
          libreApiKey: 'key2',
        }))
      );

      await restoreEncryptedCredentials(validBundle);

      expect(consoleLogSpy).toHaveBeenCalledWith('Restored 3 credential(s) from cloud');
      consoleLogSpy.mockRestore();
    });
  });

  // ---------- getCredentialSyncStatus ----------

  describe('getCredentialSyncStatus', () => {
    it('should return hasCreds=false and count=0 when no credentials stored', () => {
      const status = getCredentialSyncStatus();
      expect(status).toEqual({ hasCreds: false, count: 0 });
    });

    it('should count stored credentials', () => {
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'my-key');

      const status = getCredentialSyncStatus();
      expect(status).toEqual({ hasCreds: true, count: 2 });
    });

    it('should count all 5 credentials when all are set', () => {
      mockLocalStorage._storage.set('lifeGamificationAnthropicKey', 'anthropic-key');
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', 'https://worker.example.com');
      mockLocalStorage._storage.set('nucleusWhoopApiKey', 'whoop-key');
      mockLocalStorage._storage.set('nucleusLibreWorkerUrl', 'https://libre.example.com');
      mockLocalStorage._storage.set('nucleusLibreApiKey', 'libre-key');

      const status = getCredentialSyncStatus();
      expect(status).toEqual({ hasCreds: true, count: 5 });
    });

    it('should return hasCreds=true with count=1 when single credential set', () => {
      mockLocalStorage._storage.set('lifeGamificationAnthropicKey', 'sk-test');

      const status = getCredentialSyncStatus();
      expect(status).toEqual({ hasCreds: true, count: 1 });
    });

    it('should not count empty string values', () => {
      // localStorage.getItem returns null for missing keys.
      // The mock returns null when key doesn't exist.
      // But if key exists with empty string, getItem returns empty string which is falsy.
      // Let's verify empty strings are not counted.
      mockLocalStorage._storage.set('nucleusWhoopWorkerUrl', '');

      const status = getCredentialSyncStatus();
      // Our mock stores '' and getItem returns ''. '' is falsy, so it shouldn't be counted.
      // However, the actual code checks `if (localStorage.getItem(key))` — empty string is falsy.
      expect(status).toEqual({ hasCreds: false, count: 0 });
    });
  });
});
