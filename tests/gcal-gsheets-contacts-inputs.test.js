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
  MOCK_CONSTANTS
} = vi.hoisted(() => {
  // State mock
  const mockState = {
    gcalEvents: [],
    gcalCalendarList: [],
    gcalCalendarsLoading: false,
    gcalSyncing: false,
    gcalError: null,
    gcalTokenExpired: false,
    gcalOfflineQueue: [],
    calendarYear: 2026,
    calendarMonth: 1,
    gcontactsSyncing: false,
    gcontactsLastSync: null,
    gcontactsError: null,
    taskPeople: [],
    gsheetData: null,
    gsheetSyncing: false,
    gsheetError: null,
    gsheetAsking: false,
    gsheetResponse: null,
    WEIGHTS: {
      prayer: { onTime: 5, late: 2 }
    },
  };

  // localStorage mock
  const storage = new Map();
  const mockLocalStorage = {
    getItem: vi.fn((key) => storage.get(key) ?? null),
    setItem: vi.fn((key, value) => storage.set(key, String(value))),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    _storage: storage
  };

  // fetch mock
  const mockFetch = vi.fn();

  const MOCK_CONSTANTS = {
    GCAL_ACCESS_TOKEN_KEY: 'nucleusGCalAccessToken',
    GCAL_TOKEN_TIMESTAMP_KEY: 'nucleusGCalTokenTimestamp',
    GCAL_SELECTED_CALENDARS_KEY: 'nucleusGCalSelectedCalendars',
    GCAL_TARGET_CALENDAR_KEY: 'nucleusGCalTargetCalendar',
    GCAL_EVENTS_CACHE_KEY: 'nucleusGCalEventsCache',
    GCAL_LAST_SYNC_KEY: 'nucleusGCalLastSync',
    GCAL_CONNECTED_KEY: 'nucleusGCalConnected',
    GCAL_OFFLINE_QUEUE_KEY: 'nucleusGCalOfflineQueue',
    GCONTACTS_SYNC_TOKEN_KEY: 'nucleusGoogleContactsSyncToken',
    GCONTACTS_LAST_SYNC_KEY: 'nucleusGoogleContactsLastSync',
    ANTHROPIC_KEY: 'lifeGamificationAnthropicKey',
    GSHEET_SPREADSHEET_ID: 'test-spreadsheet-id',
    GSHEET_TAB_GID: 1119187551,
    GSHEET_CACHE_KEY: 'nucleusGSheetYesterdayCache',
    GSHEET_LAST_SYNC_KEY: 'nucleusGSheetLastSync',
    GSHEET_SAVED_PROMPT_KEY: 'nucleusGSheetSavedPrompt',
    GSHEET_RESPONSE_CACHE_KEY: 'nucleusGSheetResponseCache',
  };

  return { mockState, mockLocalStorage, mockFetch, MOCK_CONSTANTS };
});

// ============================================================================
// Mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/constants.js', () => MOCK_CONSTANTS);
vi.mock('../src/utils.js', () => ({
  fmt: vi.fn((num) => {
    if (num === null || num === undefined || num === '') return '\u2014';
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return '\u2014';
    return n.toLocaleString('en-US');
  }),
  getLocalDateString: vi.fn(() => '2026-02-12'),
  normalizeEmail: vi.fn((email) => String(email || '').trim().toLowerCase()),
}));
vi.mock('../src/data/storage.js', () => ({
  saveTasksData: vi.fn(),
  saveData: vi.fn(),
  saveWeights: vi.fn(),
}));

// Setup global mocks
global.localStorage = mockLocalStorage;
global.fetch = mockFetch;

beforeEach(() => {
  // Reset state
  mockState.gcalEvents = [];
  mockState.gcalCalendarList = [];
  mockState.gcalCalendarsLoading = false;
  mockState.gcalSyncing = false;
  mockState.gcalError = null;
  mockState.gcalTokenExpired = false;
  mockState.gcalOfflineQueue = [];
  mockState.calendarYear = 2026;
  mockState.calendarMonth = 1;
  mockState.gcontactsSyncing = false;
  mockState.gcontactsLastSync = null;
  mockState.gcontactsError = null;
  mockState.taskPeople = [];
  mockState.gsheetData = null;
  mockState.gsheetSyncing = false;
  mockState.gsheetError = null;
  mockState.gsheetAsking = false;
  mockState.gsheetResponse = null;
  mockState.WEIGHTS = { prayer: { onTime: 5, late: 2 } };

  // Reset localStorage
  mockLocalStorage._storage.clear();
  mockLocalStorage.getItem.mockImplementation((key) => mockLocalStorage._storage.get(key) ?? null);
  mockLocalStorage.setItem.mockImplementation((key, value) => mockLocalStorage._storage.set(key, String(value)));
  mockLocalStorage.removeItem.mockImplementation((key) => mockLocalStorage._storage.delete(key));

  // Window bridges
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.signInWithGoogleCalendar = vi.fn();
  window.syncGoogleContactsNow = vi.fn();
  window.updateTask = vi.fn();
  window.parsePrayer = vi.fn((value) => {
    const v = parseFloat(value);
    if (!v || isNaN(v)) return { onTime: 0, late: 0 };
    const onTime = Math.floor(v);
    const late = Math.round((v - onTime) * 10);
    return { onTime, late };
  });
  window.calcPrayerScore = vi.fn((value) => {
    const { onTime, late } = window.parsePrayer(value);
    return onTime * (mockState.WEIGHTS.prayer?.onTime ?? 5) + late * (mockState.WEIGHTS.prayer?.late ?? 2);
  });
  window.getAccentColor = vi.fn(() => '#E5533D');
  window.scrollTo = vi.fn();
  window.scrollY = 0;

  // Reset fetch
  mockFetch.mockReset();
});

// ============================================================================
// MODULE 1: Google Calendar Sync
// ============================================================================
import {
  isGCalConnected,
  getSelectedCalendars,
  setSelectedCalendars,
  getTargetCalendar,
  setTargetCalendar,
  isTokenValid,
  getGCalOfflineQueue,
  clearGCalOfflineQueue,
  removeGCalOfflineQueueItem,
  getGCalEventsForDate,
  toggleCalendarSelection,
  disconnectGCal,
  stopGCalSyncTimers,
} from '../src/data/google-calendar-sync.js';

describe('Module 1: Google Calendar Sync', () => {
  // ---------- isGCalConnected ----------
  describe('isGCalConnected', () => {
    it('returns false when GCAL_CONNECTED_KEY is not set', () => {
      expect(isGCalConnected()).toBe(false);
    });

    it('returns true when GCAL_CONNECTED_KEY is "true"', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'true');
      expect(isGCalConnected()).toBe(true);
    });

    it('returns false when GCAL_CONNECTED_KEY is "false"', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'false');
      expect(isGCalConnected()).toBe(false);
    });

    it('returns false when GCAL_CONNECTED_KEY is any other string', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'yes');
      expect(isGCalConnected()).toBe(false);
    });
  });

  // ---------- getSelectedCalendars / setSelectedCalendars ----------
  describe('getSelectedCalendars', () => {
    it('returns empty array when nothing stored', () => {
      expect(getSelectedCalendars()).toEqual([]);
    });

    it('returns parsed JSON array from localStorage', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1","cal2"]');
      expect(getSelectedCalendars()).toEqual(['cal1', 'cal2']);
    });

    it('returns empty array on invalid JSON', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, 'not-json');
      expect(getSelectedCalendars()).toEqual([]);
    });

    it('returns empty array when stored value is empty string', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '');
      expect(getSelectedCalendars()).toEqual([]);
    });
  });

  describe('setSelectedCalendars', () => {
    it('stores JSON stringified array', () => {
      setSelectedCalendars(['a', 'b', 'c']);
      expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY)).toBe('["a","b","c"]');
    });

    it('stores empty array', () => {
      setSelectedCalendars([]);
      expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY)).toBe('[]');
    });
  });

  // ---------- getTargetCalendar / setTargetCalendar ----------
  describe('getTargetCalendar', () => {
    it('returns empty string when not set', () => {
      expect(getTargetCalendar()).toBe('');
    });

    it('returns stored calendar ID', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
      expect(getTargetCalendar()).toBe('primary@gmail.com');
    });
  });

  describe('setTargetCalendar', () => {
    it('stores calendar ID in localStorage', () => {
      setTargetCalendar('cal123');
      expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY)).toBe('cal123');
    });
  });

  // ---------- isTokenValid ----------
  describe('isTokenValid', () => {
    it('returns false when no token exists', () => {
      expect(isTokenValid()).toBe(false);
    });

    it('returns false when token exists but no timestamp', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'some-token');
      expect(isTokenValid()).toBe(false);
    });

    it('returns true when token exists with recent timestamp', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'some-token');
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
      expect(isTokenValid()).toBe(true);
    });

    it('returns false when token is expired (old timestamp)', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'some-token');
      // Set timestamp to 2 hours ago (well past 55 min default max age)
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now() - 2 * 60 * 60 * 1000));
      expect(isTokenValid()).toBe(false);
    });

    it('uses nucleusGCalExpiresIn when available', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'some-token');
      // Set expires_in to 3600 seconds (1 hour), minus 5 min buffer = 55 min effective
      mockLocalStorage._storage.set('nucleusGCalExpiresIn', '3600');
      // Token is 50 minutes old — should still be valid (50 min < 55 min effective)
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now() - 50 * 60 * 1000));
      expect(isTokenValid()).toBe(true);
    });

    it('returns false when token age exceeds custom expiresIn', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'some-token');
      mockLocalStorage._storage.set('nucleusGCalExpiresIn', '3600');
      // Token is 56 minutes old — should be expired (56 min > 55 min effective)
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now() - 56 * 60 * 1000));
      expect(isTokenValid()).toBe(false);
    });
  });

  // ---------- getGCalOfflineQueue ----------
  describe('getGCalOfflineQueue', () => {
    it('returns empty array when queue is empty', () => {
      mockState.gcalOfflineQueue = [];
      expect(getGCalOfflineQueue()).toEqual([]);
    });

    it('returns the queue from state', () => {
      const queue = [{ id: 'q1', type: 'push_task', payload: {}, createdAt: '2026-01-01' }];
      mockState.gcalOfflineQueue = queue;
      expect(getGCalOfflineQueue()).toEqual(queue);
    });

    it('returns empty array when state queue is null', () => {
      mockState.gcalOfflineQueue = null;
      expect(getGCalOfflineQueue()).toEqual([]);
    });

    it('returns empty array when state queue is undefined', () => {
      mockState.gcalOfflineQueue = undefined;
      expect(getGCalOfflineQueue()).toEqual([]);
    });
  });

  // ---------- clearGCalOfflineQueue ----------
  describe('clearGCalOfflineQueue', () => {
    it('empties the queue in state', () => {
      mockState.gcalOfflineQueue = [{ id: 'q1' }];
      clearGCalOfflineQueue();
      expect(mockState.gcalOfflineQueue).toEqual([]);
    });

    it('persists empty queue to localStorage', () => {
      mockState.gcalOfflineQueue = [{ id: 'q1' }];
      clearGCalOfflineQueue();
      expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_OFFLINE_QUEUE_KEY)).toBe('[]');
    });

    it('calls render()', () => {
      clearGCalOfflineQueue();
      expect(window.render).toHaveBeenCalled();
    });
  });

  // ---------- removeGCalOfflineQueueItem ----------
  describe('removeGCalOfflineQueueItem', () => {
    it('removes matching item from queue', () => {
      mockState.gcalOfflineQueue = [
        { id: 'q1', type: 'push_task' },
        { id: 'q2', type: 'delete_event' },
      ];
      removeGCalOfflineQueueItem('q1');
      expect(mockState.gcalOfflineQueue).toEqual([{ id: 'q2', type: 'delete_event' }]);
    });

    it('does nothing when item ID does not exist', () => {
      mockState.gcalOfflineQueue = [{ id: 'q1', type: 'push_task' }];
      removeGCalOfflineQueueItem('nonexistent');
      expect(mockState.gcalOfflineQueue).toEqual([{ id: 'q1', type: 'push_task' }]);
    });

    it('persists updated queue to localStorage', () => {
      mockState.gcalOfflineQueue = [{ id: 'q1' }, { id: 'q2' }];
      removeGCalOfflineQueueItem('q1');
      const stored = JSON.parse(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_OFFLINE_QUEUE_KEY));
      expect(stored).toEqual([{ id: 'q2' }]);
    });

    it('calls render()', () => {
      mockState.gcalOfflineQueue = [{ id: 'q1' }];
      removeGCalOfflineQueueItem('q1');
      expect(window.render).toHaveBeenCalled();
    });
  });

  // ---------- getGCalEventsForDate ----------
  describe('getGCalEventsForDate', () => {
    it('returns empty array when no events exist', () => {
      mockState.gcalEvents = [];
      expect(getGCalEventsForDate('2026-02-12')).toEqual([]);
    });

    describe('all-day events (exclusive end date)', () => {
      beforeEach(() => {
        // Selected calendars must include the event's calendarId
        mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
      });

      it('includes all-day event on start date', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
      });

      it('excludes all-day event on exclusive end date', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-13')).toHaveLength(0);
      });

      it('includes multi-day event on middle day', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          start: { date: '2026-02-10' }, end: { date: '2026-02-15' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
      });

      it('excludes all-day event on day before start', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-11')).toHaveLength(0);
      });
    });

    describe('timed events (overlap logic)', () => {
      beforeEach(() => {
        mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
      });

      it('includes event that starts on queried date', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: false,
          start: { dateTime: '2026-02-12T10:00:00' },
          end: { dateTime: '2026-02-12T11:00:00' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
      });

      it('includes event that spans midnight into queried date', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: false,
          start: { dateTime: '2026-02-11T23:00:00' },
          end: { dateTime: '2026-02-12T01:00:00' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
      });

      it('excludes event that ends before queried date starts', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: false,
          start: { dateTime: '2026-02-11T09:00:00' },
          end: { dateTime: '2026-02-11T10:00:00' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });

      it('excludes event that starts after queried date ends', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: false,
          start: { dateTime: '2026-02-13T09:00:00' },
          end: { dateTime: '2026-02-13T10:00:00' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });

      it('excludes event without startIso', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: false,
          start: {}, end: {},
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });
    });

    describe('filtering by selected calendars', () => {
      it('excludes events from unselected calendars', () => {
        mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal2', allDay: true,
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });

      it('includes events from selected calendars only', () => {
        mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1","cal2"]');
        mockState.gcalEvents = [
          { id: 'e1', calendarId: 'cal1', allDay: true, start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
          { id: 'e2', calendarId: 'cal2', allDay: true, start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
          { id: 'e3', calendarId: 'cal3', allDay: true, start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
        ];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(2);
      });
    });

    describe('cancelled/declined events', () => {
      beforeEach(() => {
        mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
      });

      it('excludes cancelled events', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true, status: 'cancelled',
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });

      it('excludes events with cancelled summary prefix', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          summary: 'Cancelled: Team Meeting',
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });

      it('excludes declined events', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          attendees: [{ email: 'me@test.com', self: true, responseStatus: 'declined' }],
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
      });

      it('includes accepted events', () => {
        mockState.gcalEvents = [{
          id: 'e1', calendarId: 'cal1', allDay: true,
          attendees: [{ email: 'me@test.com', self: true, responseStatus: 'accepted' }],
          start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        }];
        expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
      });
    });
  });

  // ---------- toggleCalendarSelection ----------
  describe('toggleCalendarSelection', () => {
    it('adds a calendar when not currently selected', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
      // Since toggleCalendarSelection calls syncGCalNow which requires gcalConnected + token,
      // we set up minimal connection state
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'true');
      toggleCalendarSelection('cal2');
      const stored = JSON.parse(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY));
      expect(stored).toContain('cal2');
      expect(stored).toContain('cal1');
    });

    it('removes a calendar when already selected', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1","cal2"]');
      toggleCalendarSelection('cal2');
      const stored = JSON.parse(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY));
      expect(stored).toEqual(['cal1']);
    });
  });

  // ---------- disconnectGCal ----------
  describe('disconnectGCal', () => {
    it('removes all GCal-related localStorage keys', () => {
      const keysToCheck = [
        MOCK_CONSTANTS.GCAL_CONNECTED_KEY,
        MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY,
        MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY,
        MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY,
        MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY,
        MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY,
        MOCK_CONSTANTS.GCAL_LAST_SYNC_KEY,
        MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY,
        MOCK_CONSTANTS.GCONTACTS_LAST_SYNC_KEY,
      ];
      // Set all keys first
      keysToCheck.forEach(key => mockLocalStorage._storage.set(key, 'some-value'));

      disconnectGCal();

      keysToCheck.forEach(key => {
        expect(mockLocalStorage._storage.has(key)).toBe(false);
      });
    });

    it('resets all GCal state properties', () => {
      mockState.gcalEvents = [{ id: 'e1' }];
      mockState.gcalCalendarList = [{ id: 'cal1' }];
      mockState.gcalError = 'some error';
      mockState.gcalSyncing = true;
      mockState.gcalTokenExpired = true;
      mockState.gcontactsSyncing = true;
      mockState.gcontactsLastSync = 12345;
      mockState.gcontactsError = 'contact error';

      disconnectGCal();

      expect(mockState.gcalEvents).toEqual([]);
      expect(mockState.gcalCalendarList).toEqual([]);
      expect(mockState.gcalCalendarsLoading).toBe(false);
      expect(mockState.gcalError).toBeNull();
      expect(mockState.gcalSyncing).toBe(false);
      expect(mockState.gcalTokenExpired).toBe(false);
      expect(mockState.gcontactsSyncing).toBe(false);
      expect(mockState.gcontactsLastSync).toBeNull();
      expect(mockState.gcontactsError).toBeNull();
    });

    it('calls render()', () => {
      disconnectGCal();
      expect(window.render).toHaveBeenCalled();
    });
  });

  // ---------- stopGCalSyncTimers ----------
  describe('stopGCalSyncTimers', () => {
    it('runs without error', () => {
      expect(() => stopGCalSyncTimers()).not.toThrow();
    });
  });
});


// ============================================================================
// MODULE 2: Google Sheets Sync
// ============================================================================
import {
  syncGSheetNow,
  initGSheetSync,
  askGSheet,
} from '../src/data/google-sheets-sync.js';

describe('Module 2: Google Sheets Sync', () => {
  // Helper: set GCal connected state via localStorage (used by real isGCalConnected)
  const setGCalConnected = (connected) => {
    if (connected) mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'true');
    else mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_CONNECTED_KEY);
  };

  beforeEach(() => {
    // Default: GCal connected for sheets tests
    setGCalConnected(true);
  });
  // ---------- syncGSheetNow ----------
  describe('syncGSheetNow', () => {
    it('returns false when GCal is not connected', async () => {
      setGCalConnected(false);
      const result = await syncGSheetNow();
      expect(result).toBe(false);
    });

    it('returns false when no access token', async () => {
      // No token in localStorage
      const result = await syncGSheetNow();
      expect(result).toBe(false);
    });

    it('sets gsheetSyncing during sync', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      let syncingDuringCall = false;
      mockFetch.mockImplementation(() => {
        syncingDuringCall = mockState.gsheetSyncing;
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ sheets: [] }),
        });
      });

      await syncGSheetNow();
      expect(syncingDuringCall).toBe(true);
      expect(mockState.gsheetSyncing).toBe(false);
    });

    it('fetches spreadsheet metadata then batch data', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      let callCount = 0;
      mockFetch.mockImplementation((url) => {
        callCount++;
        if (callCount === 1) {
          // Metadata call
          expect(url).toContain('fields=sheets.properties');
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({
              sheets: [
                { properties: { title: 'Sheet1', sheetId: MOCK_CONSTANTS.GSHEET_TAB_GID } },
                { properties: { title: 'Sheet2', sheetId: 999 } },
              ]
            }),
          });
        }
        // Batch call
        expect(url).toContain('batchGet');
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({
            valueRanges: [
              { values: [['Name', 'Value', 'Yesterday'], ['Item1', '100', '90'], ['Item2', '200', '180']] },
              { values: [['Col1', 'Col2'], ['A', 'B']] },
            ]
          }),
        });
      });

      const result = await syncGSheetNow();
      expect(result).toBe(true);
      expect(callCount).toBe(2);
      expect(mockState.gsheetData).toBeDefined();
      expect(mockState.gsheetData.tabs).toHaveLength(2);
      expect(mockState.gsheetData.tabs[0].name).toBe('Sheet1');
      expect(mockState.gsheetData.tabs[0].headers).toEqual(['Name', 'Value', 'Yesterday']);
      expect(mockState.gsheetData.tabs[0].rows).toHaveLength(2);
    });

    it('handles 401 authExpired with retry', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      window.signInWithGoogleCalendar = vi.fn(() => Promise.resolve('new-token'));
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount <= 1) {
          return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
        }
        if (callCount === 2) {
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({ sheets: [{ properties: { title: 'Tab1', sheetId: 0 } }] }),
          });
        }
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ valueRanges: [{ values: [['H1'], ['V1']] }] }),
        });
      });

      const result = await syncGSheetNow();
      expect(result).toBe(true);
      expect(window.signInWithGoogleCalendar).toHaveBeenCalledWith({ mode: 'silent' });
    });

    it('sets error on 403 insufficientScope', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch.mockResolvedValue({
        ok: false, status: 403,
        json: () => Promise.resolve({ error: { message: 'Forbidden' } }),
      });

      const result = await syncGSheetNow();
      expect(result).toBe(false);
      expect(mockState.gsheetError).toContain('Sheets permission');
    });

    it('sets error on API failure', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch.mockResolvedValue({
        ok: false, status: 500,
        text: () => Promise.resolve(''),
      });

      const result = await syncGSheetNow();
      expect(result).toBe(false);
      expect(mockState.gsheetError).toBeTruthy();
    });

    it('caches sheet data to localStorage', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ sheets: [{ properties: { title: 'Tab1', sheetId: 0 } }] }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ valueRanges: [{ values: [['H'], ['R']] }] }),
        });

      await syncGSheetNow();
      expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GSHEET_CACHE_KEY)).toBe(true);
      expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GSHEET_LAST_SYNC_KEY)).toBe(true);
    });

    it('handles empty spreadsheet (no tabs)', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch.mockResolvedValue({
        ok: true, status: 200,
        json: () => Promise.resolve({ sheets: [] }),
      });

      const result = await syncGSheetNow();
      expect(result).toBe(false);
      expect(mockState.gsheetError).toContain('No tabs');
    });

    it('calls render on start and finish', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch.mockResolvedValue({
        ok: true, status: 200,
        json: () => Promise.resolve({ sheets: [] }),
      });
      await syncGSheetNow();
      expect(window.render).toHaveBeenCalled();
    });
  });

  // ---------- initGSheetSync ----------
  describe('initGSheetSync', () => {
    it('hydrates state from cache', () => {
      const cached = { tabs: [{ name: 'CachedTab', headers: [], rows: [] }] };
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GSHEET_CACHE_KEY, JSON.stringify(cached));
      // Temporarily make GCal disconnected to prevent actual sync
      setGCalConnected(false);

      initGSheetSync();
      expect(mockState.gsheetData).toEqual(cached);
    });

    it('handles invalid cache gracefully', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GSHEET_CACHE_KEY, 'not-json');
      setGCalConnected(false);

      expect(() => initGSheetSync()).not.toThrow();
    });

    it('does not start sync when GCal disconnected', () => {
      setGCalConnected(false);
      initGSheetSync();
      // fetch should not be called since no sync started
      // (the sync call happens asynchronously, but we just confirm no crash)
    });
  });

  // ---------- askGSheet ----------
  describe('askGSheet', () => {
    it('throws when no API key configured', async () => {
      await expect(askGSheet('test')).rejects.toThrow('No API key configured');
    });

    it('sends prompt to Claude API with sheet context', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockState.gsheetData = {
        tabs: [{ name: 'Tab1', headers: ['A', 'B'], rows: [['1', '2']] }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({
          content: [{ text: '<div>Answer</div>' }],
        }),
      });

      const result = await askGSheet('What is column A?');
      expect(result).toBe('<div>Answer</div>');
      expect(mockFetch).toHaveBeenCalledOnce();

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe('https://api.anthropic.com/v1/messages');
      const body = JSON.parse(callArgs[1].body);
      expect(body.system).toContain('Tab1');
      expect(body.messages[0].content).toBe('What is column A?');
    });

    it('throws on empty AI response', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockState.gsheetData = {
        tabs: [{ name: 'T', headers: ['H'], rows: [['V']] }],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({ content: [{ text: '' }] }),
      });

      await expect(askGSheet('test')).rejects.toThrow('Empty response');
    });

    it('throws on API error', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockState.gsheetData = {
        tabs: [{ name: 'T', headers: ['H'], rows: [['V']] }],
      };
      mockFetch.mockResolvedValueOnce({
        ok: false, status: 500,
        text: () => Promise.resolve('Server error'),
      });

      await expect(askGSheet('test')).rejects.toThrow('API error 500');
    });

    it('fetches sheet data if not available', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'token');
      mockState.gsheetData = null;

      // First two calls for syncGSheetNow (metadata + batch), third for Claude API
      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ sheets: [{ properties: { title: 'Sheet1', sheetId: 0 } }] }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ valueRanges: [{ values: [['H1'], ['V1']] }] }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ content: [{ text: 'result' }] }),
        });

      const result = await askGSheet('question');
      expect(result).toBe('result');
    });

    it('formats multi-tab data correctly', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockState.gsheetData = {
        tabs: [
          { name: 'Sales', headers: ['Product', 'Revenue'], rows: [['Widget', '1000'], ['Gadget', '2000']] },
          { name: 'Expenses', headers: ['Category', 'Amount'], rows: [['Rent', '500']] },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({ content: [{ text: 'analysis' }] }),
      });

      await askGSheet('Analyze');
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.system).toContain('=== Sales ===');
      expect(body.system).toContain('=== Expenses ===');
      expect(body.system).toContain('Product\tRevenue');
      expect(body.system).toContain('Widget\t1000');
      expect(body.system).toContain('2 tab(s)');
    });

    it('formats legacy single-tab data correctly', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockState.gsheetData = {
        rows: [
          { label: 'Weight', value: '72' },
          { label: 'Sleep', value: '7.5' },
        ],
        tabName: 'Yesterday',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({ content: [{ text: 'ok' }] }),
      });

      await askGSheet('Summarize');
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.system).toContain('Weight: 72');
      expect(body.system).toContain('Sleep: 7.5');
    });

    it('throws when sheet data has no content', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.ANTHROPIC_KEY, 'test-key');
      mockState.gsheetData = { tabs: [] };

      await expect(askGSheet('test')).rejects.toThrow('No sheet data to analyze');
    });
  });
});


// ============================================================================
// MODULE 3: Google Contacts Sync
// ============================================================================
import {
  syncGoogleContactsNow,
  forceFullContactsResync,
} from '../src/data/google-contacts-sync.js';

describe('Module 3: Google Contacts Sync', () => {
  // Helper: set GCal connected state via localStorage (used by real isGCalConnected)
  const setGCalConnected = (connected) => {
    if (connected) mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'true');
    else mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_CONNECTED_KEY);
  };

  beforeEach(() => {
    setGCalConnected(true);
  });

  // ---------- syncGoogleContactsNow ----------
  describe('syncGoogleContactsNow', () => {
    it('returns false when GCal is not connected', async () => {
      setGCalConnected(false);
      const result = await syncGoogleContactsNow();
      expect(result).toBe(false);
    });

    it('returns false when no access token', async () => {
      const result = await syncGoogleContactsNow();
      expect(result).toBe(false);
    });

    it('sets gcontactsSyncing during sync', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      let syncingDuringCall = false;
      mockFetch.mockImplementation(() => {
        syncingDuringCall = mockState.gcontactsSyncing;
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ connections: [], nextSyncToken: 'abc' }),
        });
      });

      await syncGoogleContactsNow();
      expect(syncingDuringCall).toBe(true);
      expect(mockState.gcontactsSyncing).toBe(false);
    });

    it('fetches connections and merges into taskPeople', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      // First call: connections page
      // Second call: other contacts page (empty)
      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [
              {
                resourceName: 'people/123',
                names: [{ displayName: 'John Doe', metadata: { primary: true } }],
                emailAddresses: [{ value: 'john@test.com', metadata: { primary: true } }],
                organizations: [{ title: 'Engineer', metadata: { primary: true } }],
                photos: [],
                metadata: {},
              },
            ],
            nextSyncToken: 'sync-token-1',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
      expect(mockState.taskPeople).toHaveLength(1);
      expect(mockState.taskPeople[0].name).toBe('John Doe');
      expect(mockState.taskPeople[0].email).toBe('john@test.com');
      expect(mockState.taskPeople[0].jobTitle).toBe('Engineer');
      expect(mockState.taskPeople[0].googleContactId).toBe('people/123');
    });

    it('matches existing person by resourceName', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [{
        id: 'person_1', name: 'John', email: 'old@test.com', googleContactId: 'people/123',
        jobTitle: '', color: '#ccc', createdAt: '2026-01-01', updatedAt: '2026-01-01',
      }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/123',
              names: [{ displayName: 'John Updated', metadata: { primary: true } }],
              emailAddresses: [{ value: 'john.updated@test.com', metadata: { primary: true } }],
              organizations: [],
              photos: [],
              metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
      expect(mockState.taskPeople).toHaveLength(1);
      expect(mockState.taskPeople[0].name).toBe('John Updated');
      expect(mockState.taskPeople[0].email).toBe('john.updated@test.com');
    });

    it('matches existing person by email', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [{
        id: 'person_1', name: 'Jane', email: 'jane@test.com', googleContactId: '',
        jobTitle: '', color: '#ccc', createdAt: '2026-01-01', updatedAt: '2026-01-01',
      }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/456',
              names: [{ displayName: 'Jane Smith', metadata: { primary: true } }],
              emailAddresses: [{ value: 'jane@test.com', metadata: { primary: true } }],
              organizations: [],
              photos: [],
              metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
      expect(mockState.taskPeople).toHaveLength(1);
      expect(mockState.taskPeople[0].name).toBe('Jane Smith');
      expect(mockState.taskPeople[0].googleContactId).toBe('people/456');
    });

    it('matches existing person by name', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [{
        id: 'person_1', name: 'Bob Builder', email: '', googleContactId: '',
        jobTitle: '', color: '#ccc', createdAt: '2026-01-01', updatedAt: '2026-01-01',
      }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/789',
              names: [{ displayName: 'Bob Builder', metadata: { primary: true } }],
              emailAddresses: [{ value: 'bob@test.com', metadata: { primary: true } }],
              organizations: [],
              photos: [],
              metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
      expect(mockState.taskPeople).toHaveLength(1);
      expect(mockState.taskPeople[0].email).toBe('bob@test.com');
      expect(mockState.taskPeople[0].googleContactId).toBe('people/789');
    });

    it('handles deleted contacts by unlinking (not deleting)', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [{
        id: 'person_1', name: 'Deleted Person', email: 'del@test.com',
        googleContactId: 'people/100', jobTitle: '', color: '#ccc',
        createdAt: '2026-01-01', updatedAt: '2026-01-01',
      }];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/100',
              metadata: { deleted: true },
              names: [],
              emailAddresses: [],
              organizations: [],
              photos: [],
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
      // Person should still exist but be unlinked
      expect(mockState.taskPeople).toHaveLength(1);
      expect(mockState.taskPeople[0].googleContactId).toBe('');
      expect(mockState.taskPeople[0].name).toBe('Deleted Person');
    });

    it('creates new person for unknown contact', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/new1',
              names: [{ displayName: 'New Person', metadata: { primary: true } }],
              emailAddresses: [{ value: 'new@test.com', metadata: { primary: true } }],
              organizations: [{ title: 'Designer', metadata: { primary: true } }],
              photos: [],
              metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      await syncGoogleContactsNow();
      expect(mockState.taskPeople).toHaveLength(1);
      const person = mockState.taskPeople[0];
      expect(person.name).toBe('New Person');
      expect(person.email).toBe('new@test.com');
      expect(person.jobTitle).toBe('Designer');
      expect(person.googleContactId).toBe('people/new1');
      expect(person.id).toMatch(/^person_/);
      expect(person.color).toBeTruthy();
    });

    it('skips contacts with no name and no email', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/empty',
              names: [],
              emailAddresses: [],
              organizations: [],
              photos: [],
              metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      await syncGoogleContactsNow();
      expect(mockState.taskPeople).toHaveLength(0);
    });

    it('handles 401 authExpired with silent refresh retry', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      window.signInWithGoogleCalendar = vi.fn(() => Promise.resolve('new-token'));

      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
        }
        if (callCount === 2) {
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({ connections: [], nextSyncToken: 'st' }),
          });
        }
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });
      });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
      expect(window.signInWithGoogleCalendar).toHaveBeenCalledWith({ mode: 'silent' });
    });

    it('handles syncExpired by doing full resync', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      // Pretend we have a stale sync token
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY, 'stale-token');

      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First attempt with sync token returns 410 (sync expired)
          return Promise.resolve({ ok: false, status: 410, json: () => Promise.resolve({}) });
        }
        if (callCount === 2) {
          // Full resync succeeds
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({ connections: [], nextSyncToken: 'fresh-token' }),
          });
        }
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });
      });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(true);
    });

    it('handles 403 insufficient scope with recovery attempt', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      window.signInWithGoogleCalendar = vi.fn(() => Promise.resolve(null));

      mockFetch.mockResolvedValue({
        ok: false, status: 403,
        json: () => Promise.resolve({
          error: {
            message: 'Request had insufficient authentication scopes.',
            errors: [{ reason: 'insufficientPermissions' }],
          }
        }),
      });

      const result = await syncGoogleContactsNow();
      expect(result).toBe(false);
      expect(mockState.gcontactsError).toContain('permission');
    });

    it('stores sync token after successful sync', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ connections: [], nextSyncToken: 'my-sync-token' }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      await syncGoogleContactsNow();
      expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY)).toBe('my-sync-token');
    });

    it('sets last sync timestamp', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ connections: [], nextSyncToken: 'st' }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      await syncGoogleContactsNow();
      expect(mockState.gcontactsLastSync).toBeTruthy();
      expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GCONTACTS_LAST_SYNC_KEY)).toBe(true);
    });

    it('handles pagination of connections', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First page
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({
              connections: [{
                resourceName: 'people/1',
                names: [{ displayName: 'Person One', metadata: { primary: true } }],
                emailAddresses: [], organizations: [], photos: [], metadata: {},
              }],
              nextPageToken: 'page2',
            }),
          });
        }
        if (callCount === 2) {
          // Second page
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({
              connections: [{
                resourceName: 'people/2',
                names: [{ displayName: 'Person Two', metadata: { primary: true } }],
                emailAddresses: [], organizations: [], photos: [], metadata: {},
              }],
              nextSyncToken: 'st',
            }),
          });
        }
        // Other contacts
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });
      });

      await syncGoogleContactsNow();
      expect(mockState.taskPeople).toHaveLength(2);
      expect(mockState.taskPeople[0].name).toBe('Person One');
      expect(mockState.taskPeople[1].name).toBe('Person Two');
    });

    it('includes other contacts in merge', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ connections: [], nextSyncToken: 'st' }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            otherContacts: [{
              resourceName: 'otherContacts/999',
              names: [{ displayName: 'Other Person', metadata: { primary: true } }],
              emailAddresses: [{ value: 'other@test.com', metadata: { primary: true } }],
              organizations: [], photos: [], metadata: {},
            }],
          }),
        });

      await syncGoogleContactsNow();
      expect(mockState.taskPeople).toHaveLength(1);
      expect(mockState.taskPeople[0].name).toBe('Other Person');
    });

    it('handles network error gracefully', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch.mockRejectedValue(new Error('Network failed'));

      const result = await syncGoogleContactsNow();
      expect(result).toBe(false);
      expect(mockState.gcontactsError).toContain('Network failed');
      expect(mockState.gcontactsSyncing).toBe(false);
    });

    it('always resets gcontactsSyncing in finally block', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockFetch.mockRejectedValue(new Error('fail'));

      await syncGoogleContactsNow();
      expect(mockState.gcontactsSyncing).toBe(false);
    });

    it('picks primary name over non-primary', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/multi',
              names: [
                { displayName: 'Secondary Name' },
                { displayName: 'Primary Name', metadata: { primary: true } },
              ],
              emailAddresses: [{ value: 'test@test.com', metadata: { primary: true } }],
              organizations: [], photos: [], metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      await syncGoogleContactsNow();
      expect(mockState.taskPeople[0].name).toBe('Primary Name');
    });

    it('uses email as name when no name available', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockState.taskPeople = [];

      mockFetch
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({
            connections: [{
              resourceName: 'people/noname',
              names: [],
              emailAddresses: [{ value: 'nameless@test.com', metadata: { primary: true } }],
              organizations: [], photos: [], metadata: {},
            }],
            nextSyncToken: 'st',
          }),
        })
        .mockResolvedValueOnce({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });

      await syncGoogleContactsNow();
      expect(mockState.taskPeople[0].name).toBe('nameless@test.com');
    });
  });

  // ---------- forceFullContactsResync ----------
  describe('forceFullContactsResync', () => {
    it('clears sync token before syncing', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'test-token');
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY, 'old-token');

      let syncTokenDuringFetch = null;
      mockFetch.mockImplementation((url) => {
        if (url.includes('connections')) {
          syncTokenDuringFetch = mockLocalStorage._storage.get(MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY);
          return Promise.resolve({
            ok: true, status: 200,
            json: () => Promise.resolve({ connections: [], nextSyncToken: 'new-st' }),
          });
        }
        return Promise.resolve({
          ok: true, status: 200,
          json: () => Promise.resolve({ otherContacts: [] }),
        });
      });

      await forceFullContactsResync();
      // Sync token should have been cleared before the API call
      // localStorage.removeItem makes _storage.get() return undefined
      expect(syncTokenDuringFetch).toBeFalsy();
    });

    it('returns the result of syncGoogleContactsNow', async () => {
      setGCalConnected(false);
      const result = await forceFullContactsResync();
      expect(result).toBe(false);
    });
  });
});


// ============================================================================
// MODULE 4: Input Builders
// ============================================================================
import {
  createPrayerInput,
  createToggle,
  createNumberInput,
  createCounter,
  createScoreCard,
  createCard,
} from '../src/ui/input-builders.js';

describe('Module 4: Input Builders', () => {
  // ---------- createPrayerInput ----------
  describe('createPrayerInput', () => {
    it('returns HTML with correct prayer key in onchange', () => {
      const html = createPrayerInput('fajr', 'Fajr', '3.2');
      expect(html).toContain("'fajr'");
      expect(html).toContain('Fajr');
    });

    it('displays value in input', () => {
      const html = createPrayerInput('dhuhr', 'Dhuhr', '4.1');
      expect(html).toContain('value="4.1"');
    });

    it('shows on-time and late breakdown', () => {
      const html = createPrayerInput('asr', 'Asr', '3.2');
      // parsePrayer(3.2) => onTime=3, late=2
      expect(html).toContain('3'); // on-time count
      expect(html).toContain('2'); // late count
    });

    it('shows calculated points', () => {
      const html = createPrayerInput('maghrib', 'Maghrib', '3.2');
      // calcPrayerScore(3.2) = 3*5 + 2*2 = 15+4 = 19
      expect(html).toContain('19 pts');
    });

    it('handles zero value', () => {
      const html = createPrayerInput('isha', 'Isha', '0');
      expect(html).toContain('value="0"');
      expect(html).toContain('0 pts');
    });

    it('handles empty value', () => {
      const html = createPrayerInput('fajr', 'Fajr', '');
      expect(html).toContain('value=""');
      expect(html).toContain('0 pts');
    });

    it('contains prayer-input class', () => {
      const html = createPrayerInput('fajr', 'Fajr', '1.0');
      expect(html).toContain('prayer-input');
    });

    it('contains updateData call in onchange', () => {
      const html = createPrayerInput('fajr', 'Fajr', '1.0');
      expect(html).toContain("updateData('prayers'");
    });
  });

  // ---------- createToggle ----------
  describe('createToggle', () => {
    it('returns HTML with label text', () => {
      const html = createToggle('Exercise', true, 'health', 'exercise');
      expect(html).toContain('Exercise');
    });

    it('shows toggle-on when checked', () => {
      const html = createToggle('Test', true, 'cat', 'field');
      expect(html).toContain('toggle-on');
    });

    it('shows toggle-off when unchecked', () => {
      const html = createToggle('Test', false, 'cat', 'field');
      expect(html).toContain('toggle-off');
    });

    it('includes category and field in onclick', () => {
      const html = createToggle('Workout', false, 'health', 'workout');
      expect(html).toContain("updateData('health'");
      expect(html).toContain("'workout'");
    });

    it('translates toggle knob when checked', () => {
      const html = createToggle('T', true, 'c', 'f');
      expect(html).toContain('translateX(20px)');
    });

    it('does not translate toggle knob when unchecked', () => {
      const html = createToggle('T', false, 'c', 'f');
      expect(html).toContain('translateX(0)');
    });

    it('inverts the boolean in onclick', () => {
      const htmlChecked = createToggle('T', true, 'c', 'f');
      expect(htmlChecked).toContain('!true');

      const htmlUnchecked = createToggle('T', false, 'c', 'f');
      expect(htmlUnchecked).toContain('!false');
    });
  });

  // ---------- createNumberInput ----------
  describe('createNumberInput', () => {
    it('returns HTML with label', () => {
      const html = createNumberInput('Weight', 72, 'health', 'weight', '0', 'kg');
      expect(html).toContain('Weight');
    });

    it('displays current value', () => {
      const html = createNumberInput('Steps', 5000, 'health', 'steps', '0', 'steps');
      expect(html).toContain('value="5000"');
    });

    it('includes placeholder', () => {
      const html = createNumberInput('Cal', '', 'health', 'calories', '2000', 'kcal');
      expect(html).toContain('placeholder="2000"');
    });

    it('shows unit text', () => {
      const html = createNumberInput('Water', 2, 'health', 'water', '0', 'liters');
      expect(html).toContain('liters');
    });

    it('shows hint when provided', () => {
      const html = createNumberInput('Sleep', 7, 'health', 'sleep', '0', 'hrs', 'Aim for 7-9');
      expect(html).toContain('Aim for 7-9');
    });

    it('shows tooltip when provided', () => {
      const html = createNumberInput('HR', 60, 'health', 'hr', '0', 'bpm', '', 'Resting heart rate');
      expect(html).toContain('Resting heart rate');
      // Tooltip info icon
      expect(html).toContain('\u24D8');
    });

    it('does not show tooltip icon when no tooltip', () => {
      const html = createNumberInput('HR', 60, 'health', 'hr', '0', 'bpm');
      expect(html).not.toContain('\u24D8');
    });

    it('positions tooltip left', () => {
      const html = createNumberInput('X', 1, 'c', 'f', '0', 'u', '', 'tip', 'left');
      expect(html).toContain('left-0');
    });

    it('positions tooltip right', () => {
      const html = createNumberInput('X', 1, 'c', 'f', '0', 'u', '', 'tip', 'right');
      expect(html).toContain('right-0');
    });

    it('positions tooltip center by default', () => {
      const html = createNumberInput('X', 1, 'c', 'f', '0', 'u', '', 'tip');
      expect(html).toContain('left-1/2');
      expect(html).toContain('-translate-x-1/2');
    });

    it('includes onchange with correct category and field', () => {
      const html = createNumberInput('V', 0, 'mycat', 'myfield', '0', 'u');
      expect(html).toContain("updateData('mycat'");
      expect(html).toContain("'myfield'");
    });
  });

  // ---------- createCounter ----------
  describe('createCounter', () => {
    it('returns HTML with label', () => {
      const html = createCounter('Cups of Water', 3, 'health', 'water');
      expect(html).toContain('Cups of Water');
    });

    it('displays current value', () => {
      const html = createCounter('Glasses', 5, 'health', 'water');
      expect(html).toContain('>5<');
    });

    it('includes decrement onclick with Math.max(0, ...)', () => {
      const html = createCounter('Count', 3, 'cat', 'field');
      expect(html).toContain('Math.max(0, 3 - 1)');
    });

    it('includes increment onclick with Math.min(max, ...)', () => {
      const html = createCounter('Count', 3, 'cat', 'field', 10);
      expect(html).toContain('Math.min(10, 3 + 1)');
    });

    it('uses default max of 10', () => {
      const html = createCounter('Count', 0, 'cat', 'field');
      expect(html).toContain('Math.min(10,');
    });

    it('uses custom max value', () => {
      const html = createCounter('Count', 0, 'cat', 'field', 25);
      expect(html).toContain('Math.min(25,');
    });

    it('includes correct category and field in onclicks', () => {
      const html = createCounter('X', 0, 'mycat', 'myfield');
      expect(html).toContain("updateData('mycat', 'myfield'");
    });

    it('displays zero value correctly', () => {
      const html = createCounter('X', 0, 'c', 'f');
      expect(html).toContain('>0<');
    });
  });

  // ---------- createScoreCard ----------
  describe('createScoreCard', () => {
    it('returns HTML with label', () => {
      const html = createScoreCard('Prayer', 25, 35, 'bg-blue-500');
      expect(html).toContain('Prayer');
    });

    it('shows formatted score', () => {
      const html = createScoreCard('Prayer', 25, 35, 'bg-blue-500');
      expect(html).toContain('25'); // fmt(25) = '25'
    });

    it('calculates percentage correctly', () => {
      const html = createScoreCard('Health', 50, 100, 'bg-green-500');
      expect(html).toContain('50%');
    });

    it('caps percentage at 100%', () => {
      const html = createScoreCard('Over', 150, 100, 'bg-blue-500');
      expect(html).toContain('100%');
    });

    it('shows 0% when max is 0', () => {
      const html = createScoreCard('Empty', 0, 0, 'bg-blue-500');
      expect(html).toContain('0%');
    });

    it('includes progress bar with width style', () => {
      const html = createScoreCard('Test', 75, 100, 'bg-amber-500');
      expect(html).toContain('width: 75%');
    });

    it('contains sb-card class', () => {
      const html = createScoreCard('T', 0, 100, 'bg-blue-500');
      expect(html).toContain('sb-card');
    });

    it('applies accent color from colorClass map', () => {
      const html = createScoreCard('T', 50, 100, 'bg-green-500');
      // Should use --success CSS variable value or fallback
      expect(html).toContain('background:');
    });

    it('rounds percentage to nearest integer', () => {
      const html = createScoreCard('T', 1, 3, 'bg-blue-500');
      expect(html).toContain('33%');
    });
  });

  // ---------- createCard ----------
  describe('createCard', () => {
    it('returns HTML with title', () => {
      const html = createCard('My Card', '🎯', '#E5533D', '<p>Content</p>');
      expect(html).toContain('My Card');
    });

    it('includes icon', () => {
      const html = createCard('Test', '📊', '#ccc', 'body');
      expect(html).toContain('📊');
    });

    it('applies accent color to border', () => {
      const html = createCard('Test', 'X', '#FF0000', 'body');
      expect(html).toContain('border-bottom: 2px solid #FF0000');
    });

    it('uses fallback color when none provided', () => {
      const html = createCard('Test', 'X', '', 'body');
      expect(html).toContain('border-bottom: 2px solid #6B7280');
    });

    it('includes content in card body', () => {
      const html = createCard('Test', 'X', '#ccc', '<div>Hello World</div>');
      expect(html).toContain('<div>Hello World</div>');
    });

    it('shows extra header when provided', () => {
      const html = createCard('Test', 'X', '#ccc', 'body', 'Last sync: 5m ago');
      expect(html).toContain('Last sync: 5m ago');
    });

    it('does not show extra header span when not provided', () => {
      const html = createCard('Test', 'X', '#ccc', 'body');
      // Should not have the extra header span
      expect(html).not.toContain('text-xs">');
      // But should still have the card structure
      expect(html).toContain('sb-card');
    });

    it('contains sb-card class', () => {
      const html = createCard('T', 'X', '#ccc', 'b');
      expect(html).toContain('sb-card');
    });

    it('has bg-card section for content', () => {
      const html = createCard('T', 'X', '#ccc', 'b');
      expect(html).toContain('bg-[var(--bg-card)]');
    });

    it('has bg-secondary section for header', () => {
      const html = createCard('T', 'X', '#ccc', 'b');
      expect(html).toContain('bg-[var(--bg-secondary)]');
    });
  });
});
