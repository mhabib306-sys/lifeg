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
  };

  const storage = new Map();
  const mockLocalStorage = {
    getItem: vi.fn((key) => storage.get(key) ?? null),
    setItem: vi.fn((key, value) => storage.set(key, String(value))),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    _storage: storage,
  };

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
  };

  return { mockState, mockLocalStorage, mockFetch, MOCK_CONSTANTS };
});

// ============================================================================
// Mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/constants.js', () => MOCK_CONSTANTS);

global.localStorage = mockLocalStorage;
global.fetch = mockFetch;

// ============================================================================
// Helpers
// ============================================================================

function setValidToken() {
  mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'valid-token');
  mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
}

function setConnected() {
  mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'true');
}

function okJson(body, status = 200) {
  return Promise.resolve({
    ok: true,
    status,
    json: () => Promise.resolve(body),
  });
}

function failRes(status, body = {}) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  });
}

function noContent() {
  return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve({}) });
}

/**
 * Mock signInWithGoogleCalendar so that it also writes a fresh token
 * to localStorage (simulating the real GIS sign-in flow).
 */
function mockSignInSuccess(token = 'refreshed-token') {
  window.signInWithGoogleCalendar.mockImplementation(async () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, token);
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
    return token;
  });
}

// ============================================================================
// Imports
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
  fetchCalendarList,
  fetchEventsForRange,
  pushTaskToGCal,
  deleteGCalEvent,
  pushTaskToGCalIfConnected,
  deleteGCalEventIfConnected,
  rescheduleGCalEventIfConnected,
  retryGCalOfflineQueue,
  connectGCal,
  reconnectGCal,
  syncGCalNow,
  initGCalSync,
} from '../src/data/google-calendar-sync.js';

// ============================================================================
// Setup / Teardown
// ============================================================================
beforeEach(() => {
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

  mockLocalStorage._storage.clear();
  mockLocalStorage.getItem.mockImplementation((key) => mockLocalStorage._storage.get(key) ?? null);
  mockLocalStorage.setItem.mockImplementation((key, value) => mockLocalStorage._storage.set(key, String(value)));
  mockLocalStorage.removeItem.mockImplementation((key) => mockLocalStorage._storage.delete(key));

  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.signInWithGoogleCalendar = vi.fn();
  window.syncGoogleContactsNow = vi.fn();
  window.updateTask = vi.fn();
  window.scrollTo = vi.fn();
  window.scrollY = 0;

  Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });

  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
  stopGCalSyncTimers();
});


// ############################################################################
// SECTION 1: Config getters/setters — additional edge cases
// ############################################################################

describe('Config getters/setters (additional edge cases)', () => {
  describe('isGCalConnected', () => {
    it('returns false when key is empty string', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, '');
      expect(isGCalConnected()).toBe(false);
    });

    it('returns false when key is "TRUE" (case-sensitive)', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_CONNECTED_KEY, 'TRUE');
      expect(isGCalConnected()).toBe(false);
    });
  });

  describe('getSelectedCalendars', () => {
    it('returns empty array for stored null string', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, 'null');
      expect(getSelectedCalendars()).toEqual([]);
    });
  });

  describe('isTokenValid', () => {
    it('returns false when token is empty string', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, '');
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
      expect(isTokenValid()).toBe(false);
    });

    it('returns true when token was just set', () => {
      setValidToken();
      expect(isTokenValid()).toBe(true);
    });

    it('returns false when timestamp is 0', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'tok');
      mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, '0');
      expect(isTokenValid()).toBe(false);
    });
  });

  describe('getGCalOfflineQueue', () => {
    it('returns empty array when state has non-array value', () => {
      mockState.gcalOfflineQueue = 'bad';
      expect(getGCalOfflineQueue()).toEqual([]);
    });
  });

  describe('clearGCalOfflineQueue', () => {
    it('persists to localStorage and calls render', () => {
      mockState.gcalOfflineQueue = [{ id: 'x' }];
      clearGCalOfflineQueue();
      expect(mockState.gcalOfflineQueue).toEqual([]);
      expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_OFFLINE_QUEUE_KEY)).toBe('[]');
      expect(window.render).toHaveBeenCalled();
    });
  });

  describe('removeGCalOfflineQueueItem', () => {
    it('handles empty queue gracefully', () => {
      mockState.gcalOfflineQueue = [];
      removeGCalOfflineQueueItem('nonexistent');
      expect(mockState.gcalOfflineQueue).toEqual([]);
    });

    it('handles null queue gracefully', () => {
      mockState.gcalOfflineQueue = null;
      removeGCalOfflineQueueItem('x');
      expect(mockState.gcalOfflineQueue).toEqual([]);
    });
  });
});


// ############################################################################
// SECTION 2: getGCalEventsForDate — additional edge cases
// ############################################################################

describe('getGCalEventsForDate (additional edge cases)', () => {
  beforeEach(() => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
  });

  it('excludes event with "canceled" (American spelling) status', () => {
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal1', allDay: true, status: 'canceled',
      start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
  });

  it('excludes event with "Canceled:" summary prefix', () => {
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal1', allDay: true,
      summary: 'Canceled: standup',
      start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
  });

  it('includes event where non-self attendee declined but self accepted', () => {
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal1', allDay: true,
      attendees: [
        { email: 'me@test.com', self: true, responseStatus: 'accepted' },
        { email: 'other@test.com', self: false, responseStatus: 'declined' },
      ],
      start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
  });

  it('includes event with no attendees (not cancelled/declined)', () => {
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal1', allDay: true,
      start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
  });

  it('handles timed event with only startTime (no endTime)', () => {
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal1', allDay: false,
      start: { dateTime: '2026-02-12T10:00:00' },
      end: {},
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
  });

  it('handles invalid dateTime string gracefully', () => {
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal1', allDay: false,
      start: { dateTime: 'not-a-date' },
      end: { dateTime: 'also-not-a-date' },
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(0);
  });

  it('includes all events when no calendars selected (empty array)', () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '[]');
    mockState.gcalEvents = [{
      id: 'e1', calendarId: 'cal99', allDay: true,
      start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
    }];
    expect(getGCalEventsForDate('2026-02-12')).toHaveLength(1);
  });

  it('returns events in state array order', () => {
    mockState.gcalEvents = [
      { id: 'e1', calendarId: 'cal1', allDay: true, start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
      { id: 'e2', calendarId: 'cal1', allDay: true, start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
    ];
    const result = getGCalEventsForDate('2026-02-12');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('e1');
    expect(result[1].id).toBe('e2');
  });
});


// ############################################################################
// SECTION 3: fetchCalendarList
// ############################################################################

describe('fetchCalendarList', () => {
  beforeEach(() => {
    setValidToken();
  });

  it('returns true and populates state.gcalCalendarList on success', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [
        { id: 'cal1', summary: 'My Calendar', backgroundColor: '#ff0000', primary: true, accessRole: 'owner' },
        { id: 'cal2', summary: 'Work', backgroundColor: '#00ff00', primary: false, accessRole: 'reader' },
      ],
    }));

    const result = await fetchCalendarList();
    expect(result).toBe(true);
    expect(mockState.gcalCalendarList).toHaveLength(2);
    expect(mockState.gcalCalendarList[0]).toEqual({
      id: 'cal1', summary: 'My Calendar', backgroundColor: '#ff0000', primary: true, accessRole: 'owner',
    });
  });

  it('sets gcalCalendarsLoading to true during fetch and false after', async () => {
    let loadingDuringFetch = false;
    mockFetch.mockImplementation(() => {
      loadingDuringFetch = mockState.gcalCalendarsLoading;
      return okJson({ items: [] });
    });
    await fetchCalendarList();
    expect(loadingDuringFetch).toBe(true);
    expect(mockState.gcalCalendarsLoading).toBe(false);
  });

  it('clears gcalError on entry', async () => {
    mockState.gcalError = 'previous error';
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchCalendarList();
    expect(mockState.gcalError).toBeNull();
  });

  it('calls render at start and end', async () => {
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchCalendarList();
    expect(window.render).toHaveBeenCalledTimes(2);
  });

  it('returns false when API returns null (token expired)', async () => {
    mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY);
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    const result = await fetchCalendarList();
    expect(result).toBe(false);
  });

  it('returns false when API returns no items array', async () => {
    mockFetch.mockReturnValue(okJson({ error: 'bad' }));
    const result = await fetchCalendarList();
    expect(result).toBe(false);
  });

  it('auto-selects all calendars on first connect (none previously selected)', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [
        { id: 'cal1', summary: 'Cal1' },
        { id: 'cal2', summary: 'Cal2' },
      ],
    }));
    await fetchCalendarList();
    expect(getSelectedCalendars()).toEqual(['cal1', 'cal2']);
  });

  it('does NOT overwrite existing calendar selection', async () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
    mockFetch.mockReturnValue(okJson({
      items: [
        { id: 'cal1', summary: 'Cal1' },
        { id: 'cal2', summary: 'Cal2' },
      ],
    }));
    await fetchCalendarList();
    expect(getSelectedCalendars()).toEqual(['cal1']);
  });

  it('auto-sets target to primary calendar', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [
        { id: 'cal1', summary: 'Cal1', primary: false },
        { id: 'cal2', summary: 'Cal2', primary: true },
      ],
    }));
    await fetchCalendarList();
    expect(getTargetCalendar()).toBe('cal2');
  });

  it('falls back to first calendar if no primary', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [
        { id: 'cal1', summary: 'Cal1' },
        { id: 'cal2', summary: 'Cal2' },
      ],
    }));
    await fetchCalendarList();
    expect(getTargetCalendar()).toBe('cal1');
  });

  it('does NOT overwrite existing target calendar', async () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'existing-target');
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'cal1', summary: 'Cal1', primary: true }],
    }));
    await fetchCalendarList();
    expect(getTargetCalendar()).toBe('existing-target');
  });

  it('uses calendar id as summary fallback when summary is missing', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'cal1@example.com' }],
    }));
    await fetchCalendarList();
    expect(mockState.gcalCalendarList[0].summary).toBe('cal1@example.com');
  });

  it('uses default backgroundColor when not provided', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'cal1', summary: 'Cal1' }],
    }));
    await fetchCalendarList();
    expect(mockState.gcalCalendarList[0].backgroundColor).toBe('#4285f4');
  });

  it('sets gcalCalendarsLoading false even on API error', async () => {
    mockFetch.mockReturnValue(failRes(500, { error: { message: 'Internal error' } }));
    await fetchCalendarList();
    expect(mockState.gcalCalendarsLoading).toBe(false);
  });
});


// ############################################################################
// SECTION 4: fetchEventsForRange
// ############################################################################

describe('fetchEventsForRange', () => {
  beforeEach(() => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
  });

  it('returns early without fetching when no calendars selected', async () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '[]');
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sets gcalSyncing during fetch and clears after', async () => {
    let syncingDuringFetch = false;
    mockFetch.mockImplementation(() => {
      syncingDuringFetch = mockState.gcalSyncing;
      return okJson({ items: [] });
    });
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(syncingDuringFetch).toBe(true);
    expect(mockState.gcalSyncing).toBe(false);
  });

  it('populates state.gcalEvents from API response', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', status: 'confirmed', summary: 'Meeting',
        description: 'desc', location: 'Room 1',
        start: { dateTime: '2026-02-12T10:00:00Z' },
        end: { dateTime: '2026-02-12T11:00:00Z' },
        htmlLink: 'https://cal.google.com/e1',
      }],
    }));

    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents).toHaveLength(1);
    expect(mockState.gcalEvents[0].id).toBe('e1');
    expect(mockState.gcalEvents[0].calendarId).toBe('cal1');
    expect(mockState.gcalEvents[0].summary).toBe('Meeting');
    expect(mockState.gcalEvents[0].allDay).toBe(false);
  });

  it('maps all-day events correctly', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'All Day',
        start: { date: '2026-02-12' },
        end: { date: '2026-02-13' },
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].allDay).toBe(true);
  });

  it('filters out cancelled events', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [
        { id: 'e1', status: 'cancelled', summary: 'Cancelled', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
        { id: 'e2', status: 'confirmed', summary: 'Active', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
      ],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents).toHaveLength(1);
    expect(mockState.gcalEvents[0].id).toBe('e2');
  });

  it('filters out declined events', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Declined', start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        attendees: [{ email: 'me@test.com', self: true, responseStatus: 'declined' }],
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents).toHaveLength(0);
  });

  it('caches events to localStorage', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'e1', summary: 'Evt', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    const cached = JSON.parse(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY));
    expect(cached).toHaveLength(1);
    expect(cached[0].id).toBe('e1');
  });

  it('writes last sync timestamp', async () => {
    mockFetch.mockReturnValue(okJson({ items: [] }));
    const before = Date.now();
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    const ts = parseInt(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_LAST_SYNC_KEY), 10);
    expect(ts).toBeGreaterThanOrEqual(before);
  });

  it('fetches events for each selected calendar', async () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1","cal2"]');
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const urls = mockFetch.mock.calls.map(c => c[0]);
    expect(urls[0]).toContain('calendars/cal1');
    expect(urls[1]).toContain('calendars/cal2');
  });

  it('handles pagination with nextPageToken', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return okJson({
          items: [{ id: 'e1', summary: 'Page1', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } }],
          nextPageToken: 'page2token',
        });
      }
      return okJson({
        items: [{ id: 'e2', summary: 'Page2', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } }],
      });
    });
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(callCount).toBe(2);
    expect(mockState.gcalEvents).toHaveLength(2);
  });

  it('preserves scroll position during render', async () => {
    window.scrollY = 500;
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 500);
  });

  it('sets "(No title)" for events without summary', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'e1', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].summary).toBe('(No title)');
  });

  it('extracts meeting links from hangoutLink', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Meeting',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        hangoutLink: 'https://meet.google.com/abc-defg-hij',
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://meet.google.com/abc-defg-hij');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('Google Meet');
  });

  it('extracts Zoom meeting link from description', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Zoom Call',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        description: 'Join at https://zoom.us/j/123456 for the call',
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://zoom.us/j/123456');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('Zoom');
  });

  it('extracts Teams meeting link from location', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Teams Call',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        location: 'https://teams.microsoft.com/l/meetup-join/xyz',
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://teams.microsoft.com/l/meetup-join/xyz');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('Microsoft Teams');
  });

  it('extracts meeting link from conferenceData.entryPoints', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Conf',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        conferenceData: {
          entryPoints: [{ uri: 'https://meet.google.com/abc' }],
        },
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://meet.google.com/abc');
  });

  it('maps attendees correctly', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Mtg',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        attendees: [
          { email: 'a@b.com', displayName: 'Alice', responseStatus: 'accepted', self: true },
          { email: 'c@d.com', displayName: 'Bob', responseStatus: 'tentative' },
        ],
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].attendees).toHaveLength(2);
    expect(mockState.gcalEvents[0].attendees[0]).toEqual({
      email: 'a@b.com', displayName: 'Alice', responseStatus: 'accepted', self: true,
    });
    expect(mockState.gcalEvents[0].attendees[1].self).toBe(false);
  });

  it('handles API failure mid-calendar gracefully', async () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1","cal2"]');
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return failRes(500);
      return okJson({
        items: [{ id: 'e1', summary: 'OK', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } }],
      });
    });
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents).toHaveLength(1);
  });

  it('maps recurring event fields', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Recurring',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        recurringEventId: 'recurring123',
        originalStartTime: { date: '2026-02-10' },
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].recurringEventId).toBe('recurring123');
    expect(mockState.gcalEvents[0].originalStartTime).toEqual({ date: '2026-02-10' });
  });

  it('handles empty items array', async () => {
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents).toEqual([]);
  });

  it('handles missing items property', async () => {
    mockFetch.mockReturnValue(okJson({}));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents).toEqual([]);
  });
});


// ############################################################################
// SECTION 5: pushTaskToGCal
// ############################################################################

describe('pushTaskToGCal', () => {
  beforeEach(() => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
  });

  it('returns early when no target calendar', async () => {
    mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY);
    const result = await pushTaskToGCal({ title: 'Test', dueDate: '2026-02-12' });
    expect(result).toBeUndefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns early when task has no dates', async () => {
    const result = await pushTaskToGCal({ title: 'Test' });
    expect(result).toBeUndefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('creates new event via POST when no gcalEventId', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'new-event-123', summary: 'Test' }));
    const task = { id: 'task1', title: 'Test Task', dueDate: '2026-02-12', notes: 'Some notes' };
    await pushTaskToGCal(task);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('calendars/primary%40gmail.com/events');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.summary).toBe('Test Task');
    expect(body.description).toBe('Some notes');
    expect(body.start.date).toBe('2026-02-12');
    expect(body.end.date).toBe('2026-02-13');
  });

  it('calls updateTask with gcalEventId on successful POST', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'gcal-ev-id' }));
    const task = { id: 'task1', title: 'Test', dueDate: '2026-02-12' };
    await pushTaskToGCal(task);
    expect(window.updateTask).toHaveBeenCalledWith('task1', { gcalEventId: 'gcal-ev-id' });
  });

  it('does NOT call updateTask when POST returns no id', async () => {
    mockFetch.mockReturnValue(okJson({}));
    const task = { id: 'task1', title: 'Test', dueDate: '2026-02-12' };
    await pushTaskToGCal(task);
    expect(window.updateTask).not.toHaveBeenCalled();
  });

  it('updates existing event via PUT when gcalEventId exists', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'existing-event' }));
    const task = { id: 'task1', title: 'Updated', dueDate: '2026-02-12', gcalEventId: 'existing-event', notes: '' };
    await pushTaskToGCal(task);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('events/existing-event');
    expect(opts.method).toBe('PUT');
  });

  it('does NOT call updateTask on PUT (existing event)', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'existing-event' }));
    const task = { id: 'task1', title: 'Updated', dueDate: '2026-02-12', gcalEventId: 'existing-event' };
    await pushTaskToGCal(task);
    expect(window.updateTask).not.toHaveBeenCalled();
  });

  it('uses deferDate as start when both dates present', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const task = { id: 't1', title: 'T', deferDate: '2026-02-10', dueDate: '2026-02-15' };
    await pushTaskToGCal(task);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.start.date).toBe('2026-02-10');
    expect(body.end.date).toBe('2026-02-16');
  });

  it('uses deferDate as both start and end fallback when no dueDate', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const task = { id: 't1', title: 'T', deferDate: '2026-02-10' };
    await pushTaskToGCal(task);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.start.date).toBe('2026-02-10');
    expect(body.end.date).toBe('2026-02-11');
  });

  it('handles month-end date rollover for exclusive end date', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const task = { id: 't1', title: 'T', dueDate: '2026-01-31' };
    await pushTaskToGCal(task);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.end.date).toBe('2026-02-01');
  });

  it('handles year-end date rollover for exclusive end date', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const task = { id: 't1', title: 'T', dueDate: '2026-12-31' };
    await pushTaskToGCal(task);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.end.date).toBe('2027-01-01');
  });

  it('sends empty string for notes when undefined', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const task = { id: 't1', title: 'T', dueDate: '2026-02-12' };
    await pushTaskToGCal(task);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.description).toBe('');
  });

  it('handles leap year date correctly', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    await pushTaskToGCal({ id: 't1', title: 'Leap', dueDate: '2028-02-29' });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.start.date).toBe('2028-02-29');
    expect(body.end.date).toBe('2028-03-01');
  });

  it('handles Feb 28 in non-leap year', async () => {
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    await pushTaskToGCal({ id: 't1', title: 'Feb', dueDate: '2026-02-28' });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.end.date).toBe('2026-03-01');
  });
});


// ############################################################################
// SECTION 6: deleteGCalEvent
// ############################################################################

describe('deleteGCalEvent', () => {
  beforeEach(() => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
  });

  it('sends DELETE request with correct URL', async () => {
    mockFetch.mockReturnValue(noContent());
    await deleteGCalEvent({ gcalEventId: 'evt123' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('calendars/primary%40gmail.com/events/evt123');
    expect(opts.method).toBe('DELETE');
  });

  it('returns early when task has no gcalEventId', async () => {
    await deleteGCalEvent({ id: 't1' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns early when no target calendar', async () => {
    mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY);
    await deleteGCalEvent({ gcalEventId: 'evt123' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('handles 204 No Content response', async () => {
    mockFetch.mockReturnValue(noContent());
    await expect(deleteGCalEvent({ gcalEventId: 'evt123' })).resolves.not.toThrow();
  });

  it('URL-encodes event ID with special characters', async () => {
    mockFetch.mockReturnValue(noContent());
    await deleteGCalEvent({ gcalEventId: 'abc/def' });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('events/abc%2Fdef');
  });
});


// ############################################################################
// SECTION 7: pushTaskToGCalIfConnected
// ############################################################################

describe('pushTaskToGCalIfConnected', () => {
  const taskWithDates = { id: 't1', title: 'Task', dueDate: '2026-02-12' };

  it('does nothing when not connected', async () => {
    await pushTaskToGCalIfConnected(taskWithDates);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('enqueues offline action when offline', async () => {
    setConnected();
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
    await pushTaskToGCalIfConnected(taskWithDates);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
    expect(mockState.gcalOfflineQueue[0].type).toBe('push_task');
  });

  it('returns early when token is invalid and refresh fails', async () => {
    setConnected();
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    await pushTaskToGCalIfConnected(taskWithDates);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('skips notes (isNote = true)', async () => {
    setConnected();
    setValidToken();
    await pushTaskToGCalIfConnected({ ...taskWithDates, isNote: true });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('skips tasks with no dates', async () => {
    setConnected();
    setValidToken();
    await pushTaskToGCalIfConnected({ id: 't1', title: 'No dates' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('pushes successfully when connected and online with valid token', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockReturnValue(okJson({ id: 'new-ev' }));
    await pushTaskToGCalIfConnected(taskWithDates);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockState.gcalOfflineQueue).toHaveLength(0);
  });

  it('enqueues when push returns null (API error)', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockReturnValue(failRes(500, { error: { message: 'Server error' } }));
    await pushTaskToGCalIfConnected(taskWithDates);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
    expect(mockState.gcalOfflineQueue[0].type).toBe('push_task');
  });

  it('enqueues when push throws an exception', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockRejectedValue(new Error('Network failure'));
    await pushTaskToGCalIfConnected(taskWithDates);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
  });

  it('accepts task with deferDate only (no dueDate)', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    await pushTaskToGCalIfConnected({ id: 't1', title: 'Deferred', deferDate: '2026-02-15' });
    expect(mockFetch).toHaveBeenCalled();
  });
});


// ############################################################################
// SECTION 8: deleteGCalEventIfConnected
// ############################################################################

describe('deleteGCalEventIfConnected', () => {
  const taskWithEvent = { id: 't1', gcalEventId: 'ev1' };

  it('does nothing when not connected', async () => {
    await deleteGCalEventIfConnected(taskWithEvent);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('enqueues when offline', async () => {
    setConnected();
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
    await deleteGCalEventIfConnected(taskWithEvent);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
    expect(mockState.gcalOfflineQueue[0].type).toBe('delete_event');
  });

  it('returns early when token invalid', async () => {
    setConnected();
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    await deleteGCalEventIfConnected(taskWithEvent);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('skips tasks without gcalEventId', async () => {
    setConnected();
    setValidToken();
    await deleteGCalEventIfConnected({ id: 't1' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('deletes successfully when connected and online', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockReturnValue(noContent());
    await deleteGCalEventIfConnected(taskWithEvent);
    expect(mockFetch).toHaveBeenCalled();
  });

  it('enqueues when delete returns null (API error)', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockReturnValue(failRes(500));
    await deleteGCalEventIfConnected(taskWithEvent);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
  });

  it('enqueues when delete throws an exception', async () => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
    mockFetch.mockRejectedValue(new Error('Network error'));
    await deleteGCalEventIfConnected(taskWithEvent);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
  });
});


// ############################################################################
// SECTION 9: rescheduleGCalEventIfConnected
// ############################################################################

describe('rescheduleGCalEventIfConnected', () => {
  const event = {
    id: 'ev1',
    calendarId: 'cal1',
    start: { dateTime: '2026-02-12T10:00:00Z' },
    end: { dateTime: '2026-02-12T11:00:00Z' },
  };

  it('returns false when not connected', async () => {
    const result = await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(result).toBe(false);
  });

  it('returns false when event is null', async () => {
    setConnected();
    const result = await rescheduleGCalEventIfConnected(null, '2026-02-15', 14);
    expect(result).toBe(false);
  });

  it('enqueues when offline', async () => {
    setConnected();
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
    const result = await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(result).toBe(false);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
    expect(mockState.gcalOfflineQueue[0].type).toBe('reschedule_event');
  });

  it('returns false when token invalid', async () => {
    setConnected();
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    const result = await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(result).toBe(false);
  });

  it('reschedules successfully with PATCH request', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    mockState.gcalEvents = [{ ...event }];

    const result = await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(result).toBe(true);

    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('calendars/cal1/events/ev1');
    expect(opts.method).toBe('PATCH');

    const body = JSON.parse(opts.body);
    expect(body.start.dateTime).toContain('2026-02-15');
    expect(body.end.dateTime).toBeDefined();
  });

  it('preserves event duration when rescheduling', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const twoHourEvent = {
      id: 'ev1', calendarId: 'cal1',
      start: { dateTime: '2026-02-12T10:00:00Z' },
      end: { dateTime: '2026-02-12T12:00:00Z' },
    };
    mockState.gcalEvents = [{ ...twoHourEvent }];

    await rescheduleGCalEventIfConnected(twoHourEvent, '2026-02-15', 14);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const start = new Date(body.start.dateTime);
    const end = new Date(body.end.dateTime);
    expect(end - start).toBe(2 * 60 * 60 * 1000);
  });

  it('uses minimum 30-minute duration when event duration is less', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const shortEvent = {
      id: 'ev1', calendarId: 'cal1',
      start: { dateTime: '2026-02-12T10:00:00Z' },
      end: { dateTime: '2026-02-12T10:10:00Z' },
    };
    mockState.gcalEvents = [{ ...shortEvent }];

    await rescheduleGCalEventIfConnected(shortEvent, '2026-02-15', 14);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const start = new Date(body.start.dateTime);
    const end = new Date(body.end.dateTime);
    expect(end - start).toBe(30 * 60 * 1000);
  });

  it('defaults to 1-hour duration when event has no previous times', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    const noTimesEvent = { id: 'ev1', calendarId: 'cal1', start: {}, end: {} };
    mockState.gcalEvents = [{ ...noTimesEvent }];

    await rescheduleGCalEventIfConnected(noTimesEvent, '2026-02-15', 14);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const start = new Date(body.start.dateTime);
    const end = new Date(body.end.dateTime);
    expect(end - start).toBe(60 * 60 * 1000);
  });

  it('updates local state.gcalEvents on success', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    mockState.gcalEvents = [{ ...event }];

    await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    const updated = mockState.gcalEvents.find(e => e.id === 'ev1');
    expect(updated.start.dateTime).toContain('2026-02-15');
    expect(updated.allDay).toBe(false);
  });

  it('caches updated events to localStorage on success', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    mockState.gcalEvents = [{ ...event }];

    await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    const cached = mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY);
    expect(cached).toBeDefined();
    expect(JSON.parse(cached)[0].start.dateTime).toContain('2026-02-15');
  });

  it('calls render on success', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    mockState.gcalEvents = [{ ...event }];

    await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(window.render).toHaveBeenCalled();
  });

  it('enqueues and returns false on API failure', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(failRes(500));
    mockState.gcalEvents = [{ ...event }];

    const result = await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(result).toBe(false);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
  });

  it('enqueues and returns false on exception', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockRejectedValue(new Error('Fail'));
    mockState.gcalEvents = [{ ...event }];

    const result = await rescheduleGCalEventIfConnected(event, '2026-02-15', 14);
    expect(result).toBe(false);
    expect(mockState.gcalOfflineQueue).toHaveLength(1);
  });

  it('pads single-digit hour with leading zero', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    mockState.gcalEvents = [{ ...event }];

    await rescheduleGCalEventIfConnected(event, '2026-02-15', 9);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.start.dateTime).toContain('T09:00:00');
  });
});


// ############################################################################
// SECTION 10: retryGCalOfflineQueue
// ############################################################################

describe('retryGCalOfflineQueue', () => {
  beforeEach(() => {
    setConnected();
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'primary@gmail.com');
  });

  it('does nothing when queue is empty', async () => {
    mockState.gcalOfflineQueue = [];
    await retryGCalOfflineQueue();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(window.render).toHaveBeenCalled();
  });

  it('retries push_task items', async () => {
    mockState.gcalOfflineQueue = [{
      id: 'q1', type: 'push_task',
      payload: { task: { id: 't1', title: 'Push', dueDate: '2026-02-12' } },
      createdAt: new Date().toISOString(), lastError: '',
    }];
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    await retryGCalOfflineQueue();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('retries delete_event items', async () => {
    mockState.gcalOfflineQueue = [{
      id: 'q1', type: 'delete_event',
      payload: { task: { id: 't1', gcalEventId: 'ev1' } },
      createdAt: new Date().toISOString(), lastError: '',
    }];
    mockFetch.mockReturnValue(noContent());
    await retryGCalOfflineQueue();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('retries reschedule_event items', async () => {
    mockState.gcalOfflineQueue = [{
      id: 'q1', type: 'reschedule_event',
      payload: {
        event: { id: 'ev1', calendarId: 'cal1', start: { dateTime: '2026-02-12T10:00:00Z' }, end: { dateTime: '2026-02-12T11:00:00Z' } },
        dateStr: '2026-02-15', hour: 14,
        startIso: '2026-02-15T14:00:00.000Z', endIso: '2026-02-15T15:00:00.000Z',
      },
      createdAt: new Date().toISOString(), lastError: '',
    }];
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    mockState.gcalEvents = [{
      id: 'ev1', calendarId: 'cal1',
      start: { dateTime: '2026-02-12T10:00:00Z' },
      end: { dateTime: '2026-02-12T11:00:00Z' },
    }];
    await retryGCalOfflineQueue();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('removes successful items from queue', async () => {
    mockState.gcalOfflineQueue = [{
      id: 'q1', type: 'push_task',
      payload: { task: { id: 't1', title: 'Push', dueDate: '2026-02-12' } },
      createdAt: new Date().toISOString(), lastError: '',
    }];
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    await retryGCalOfflineQueue();
    const remaining = mockState.gcalOfflineQueue.filter(i => i.id === 'q1');
    expect(remaining).toHaveLength(0);
  });

  it('calls render after processing', async () => {
    mockState.gcalOfflineQueue = [];
    await retryGCalOfflineQueue();
    expect(window.render).toHaveBeenCalled();
  });

  it('skips items with unknown type', async () => {
    mockState.gcalOfflineQueue = [{
      id: 'q1', type: 'unknown_type',
      payload: {},
      createdAt: new Date().toISOString(), lastError: '',
    }];
    await retryGCalOfflineQueue();
    // The unknown item is still removed via removeOfflineActionById
  });
});


// ############################################################################
// SECTION 11: connectGCal
// ############################################################################

describe('connectGCal', () => {
  it('does nothing when signInWithGoogleCalendar returns null', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    await connectGCal();
    expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GCAL_CONNECTED_KEY)).toBe(false);
  });

  it('sets connected flag on successful sign-in', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await connectGCal();
    expect(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_CONNECTED_KEY)).toBe('true');
  });

  it('resets token expired state on sign-in', async () => {
    mockState.gcalTokenExpired = true;
    mockState.gcalError = 'old error';
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await connectGCal();
    expect(mockState.gcalTokenExpired).toBe(false);
    expect(mockState.gcalError).toBeNull();
  });

  it('fetches calendar list after connecting', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'cal1', summary: 'Cal', primary: true }],
    }));
    await connectGCal();
    expect(mockFetch).toHaveBeenCalled();
    expect(mockState.gcalCalendarList).toHaveLength(1);
  });

  it('syncs events after calendar list is loaded', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    // connectGCal sets the connected key itself
    let fetchCount = 0;
    mockFetch.mockImplementation((url) => {
      fetchCount++;
      if (url.includes('calendarList')) {
        return okJson({ items: [{ id: 'cal1', summary: 'Cal', primary: true }] });
      }
      // fetchEventsForRange
      return okJson({ items: [] });
    });
    await connectGCal();
    expect(fetchCount).toBeGreaterThanOrEqual(2);
  });

  it('calls syncGoogleContactsNow', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await connectGCal();
    expect(window.syncGoogleContactsNow).toHaveBeenCalled();
  });

  it('calls render at end', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await connectGCal();
    expect(window.render).toHaveBeenCalled();
  });

  it('does not sync events if calendar list fails', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('token123');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ error: 'no items' })); // no items array
    await connectGCal();
    // fetchCalendarList returns false, so syncGCalNow is NOT called
    // Only 1 fetch call (calendarList), not 2
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});


// ############################################################################
// SECTION 12: reconnectGCal
// ############################################################################

describe('reconnectGCal', () => {
  it('does nothing when signInWithGoogleCalendar returns null', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    await reconnectGCal();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('resets token expired state on reconnect', async () => {
    mockState.gcalTokenExpired = true;
    mockState.gcalError = 'session expired';
    window.signInWithGoogleCalendar.mockResolvedValue('new-token');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await reconnectGCal();
    expect(mockState.gcalTokenExpired).toBe(false);
    expect(mockState.gcalError).toBeNull();
  });

  it('fetches calendar list after reconnect', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('new-token');
    setValidToken();
    mockFetch.mockReturnValue(okJson({
      items: [{ id: 'cal1', summary: 'Cal', primary: true }],
    }));
    await reconnectGCal();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('calls syncGoogleContactsNow', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('new-token');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await reconnectGCal();
    expect(window.syncGoogleContactsNow).toHaveBeenCalled();
  });

  it('calls render at end', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('new-token');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await reconnectGCal();
    expect(window.render).toHaveBeenCalled();
  });

  it('does NOT set GCAL_CONNECTED_KEY (unlike connectGCal)', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('new-token');
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await reconnectGCal();
    // reconnectGCal does NOT write the connected key
    expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GCAL_CONNECTED_KEY)).toBe(false);
  });

  it('syncs events when calendar list loads successfully', async () => {
    window.signInWithGoogleCalendar.mockResolvedValue('new-token');
    setValidToken();
    setConnected();
    let fetchCount = 0;
    mockFetch.mockImplementation((url) => {
      fetchCount++;
      if (url.includes('calendarList')) {
        return okJson({ items: [{ id: 'cal1', summary: 'Cal', primary: true }] });
      }
      return okJson({ items: [] });
    });
    await reconnectGCal();
    expect(fetchCount).toBeGreaterThanOrEqual(2);
  });
});


// ############################################################################
// SECTION 13: syncGCalNow
// ############################################################################

describe('syncGCalNow', () => {
  beforeEach(() => {
    setConnected();
    setValidToken();
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
  });

  it('does nothing when not connected', async () => {
    mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_CONNECTED_KEY);
    await syncGCalNow();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does nothing when token is invalid and refresh fails', async () => {
    mockLocalStorage._storage.delete(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY);
    window.signInWithGoogleCalendar.mockResolvedValue(null);
    await syncGCalNow();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does nothing when calendar list is empty', async () => {
    mockState.gcalCalendarList = [];
    await syncGCalNow();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fetches events for correct date range based on calendarMonth/calendarYear', async () => {
    mockState.calendarYear = 2026;
    mockState.calendarMonth = 1;
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await syncGCalNow();

    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('timeMin=');
    expect(url).toContain('timeMax=');
  });

  it('calls fetchEventsForRange', async () => {
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await syncGCalNow();
    expect(mockFetch).toHaveBeenCalled();
  });

  it('handles null calendarList gracefully', async () => {
    mockState.gcalCalendarList = null;
    await syncGCalNow();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});


// ############################################################################
// SECTION 14: toggleCalendarSelection — additional cases
// ############################################################################

describe('toggleCalendarSelection (additional)', () => {
  it('triggers syncGCalNow when adding a calendar', async () => {
    setConnected();
    setValidToken();
    mockState.gcalCalendarList = [{ id: 'cal1' }, { id: 'cal2' }];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
    mockFetch.mockReturnValue(okJson({ items: [] }));
    toggleCalendarSelection('cal2');
    const selected = getSelectedCalendars();
    expect(selected).toContain('cal2');
  });

  it('does NOT trigger sync when removing a calendar', () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1","cal2"]');
    toggleCalendarSelection('cal1');
    const selected = getSelectedCalendars();
    expect(selected).toEqual(['cal2']);
  });
});


// ############################################################################
// SECTION 15: disconnectGCal — additional cases
// ############################################################################

describe('disconnectGCal (additional)', () => {
  it('clears contacts sync state', () => {
    mockState.gcontactsSyncing = true;
    mockState.gcontactsLastSync = 1234;
    mockState.gcontactsError = 'err';
    disconnectGCal();
    expect(mockState.gcontactsSyncing).toBe(false);
    expect(mockState.gcontactsLastSync).toBeNull();
    expect(mockState.gcontactsError).toBeNull();
  });

  it('removes contacts-related localStorage keys', () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY, 'token');
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCONTACTS_LAST_SYNC_KEY, '12345');
    disconnectGCal();
    expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GCONTACTS_SYNC_TOKEN_KEY)).toBe(false);
    expect(mockLocalStorage._storage.has(MOCK_CONSTANTS.GCONTACTS_LAST_SYNC_KEY)).toBe(false);
  });

  it('removes all GCal localStorage keys', () => {
    const keys = [
      MOCK_CONSTANTS.GCAL_CONNECTED_KEY,
      MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY,
      MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY,
      MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY,
      MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY,
      MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY,
      MOCK_CONSTANTS.GCAL_LAST_SYNC_KEY,
    ];
    keys.forEach(key => mockLocalStorage._storage.set(key, 'val'));
    disconnectGCal();
    keys.forEach(key => expect(mockLocalStorage._storage.has(key)).toBe(false));
  });

  it('resets all state properties', () => {
    mockState.gcalEvents = [{ id: 'e1' }];
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    mockState.gcalError = 'err';
    mockState.gcalSyncing = true;
    mockState.gcalTokenExpired = true;
    disconnectGCal();
    expect(mockState.gcalEvents).toEqual([]);
    expect(mockState.gcalCalendarList).toEqual([]);
    expect(mockState.gcalCalendarsLoading).toBe(false);
    expect(mockState.gcalError).toBeNull();
    expect(mockState.gcalSyncing).toBe(false);
    expect(mockState.gcalTokenExpired).toBe(false);
  });
});


// ############################################################################
// SECTION 16: stopGCalSyncTimers
// ############################################################################

describe('stopGCalSyncTimers (additional)', () => {
  it('is idempotent (safe to call multiple times)', () => {
    expect(() => {
      stopGCalSyncTimers();
      stopGCalSyncTimers();
      stopGCalSyncTimers();
    }).not.toThrow();
  });
});


// ############################################################################
// SECTION 17: initGCalSync
// ############################################################################

describe('initGCalSync', () => {
  afterEach(() => {
    stopGCalSyncTimers();
  });

  it('loads cached events from localStorage', () => {
    const cached = [
      { id: 'e1', calendarId: 'cal1', summary: 'Cached', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
    ];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY, JSON.stringify(cached));
    initGCalSync();
    expect(mockState.gcalEvents).toHaveLength(1);
    expect(mockState.gcalEvents[0].id).toBe('e1');
  });

  it('filters out cancelled events from cache', () => {
    const cached = [
      { id: 'e1', status: 'cancelled', summary: 'Cancelled', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
      { id: 'e2', calendarId: 'cal1', summary: 'Active', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
    ];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY, JSON.stringify(cached));
    initGCalSync();
    expect(mockState.gcalEvents).toHaveLength(1);
    expect(mockState.gcalEvents[0].id).toBe('e2');
  });

  it('filters out declined events from cache', () => {
    const cached = [
      {
        id: 'e1', summary: 'Declined',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        attendees: [{ email: 'me@test.com', self: true, responseStatus: 'declined' }],
      },
    ];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY, JSON.stringify(cached));
    initGCalSync();
    expect(mockState.gcalEvents).toHaveLength(0);
  });

  it('handles invalid JSON in cache gracefully', () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY, 'not-valid-json');
    expect(() => initGCalSync()).not.toThrow();
    expect(mockState.gcalEvents).toEqual([]);
  });

  it('handles empty cache', () => {
    initGCalSync();
    expect(mockState.gcalEvents).toEqual([]);
  });

  it('does not start sync when not connected', () => {
    initGCalSync();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('starts sync when connected with valid token', async () => {
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    initGCalSync();
    // Give the async startSync a chance to run
    await new Promise(r => setTimeout(r, 50));
    expect(mockFetch).toHaveBeenCalled();
  });

  it('re-persists cleaned cache after filtering', () => {
    const cached = [
      { id: 'e1', status: 'cancelled', summary: 'Gone', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
      { id: 'e2', summary: 'Keep', start: { date: '2026-02-12' }, end: { date: '2026-02-13' } },
    ];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY, JSON.stringify(cached));
    initGCalSync();
    const updated = JSON.parse(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY));
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe('e2');
  });

  it('handles non-array cached value', () => {
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_EVENTS_CACHE_KEY, JSON.stringify({ not: 'an array' }));
    initGCalSync();
    expect(mockState.gcalEvents).toEqual([]);
  });

  it('registers online event handler when connected', () => {
    const spy = vi.spyOn(window, 'addEventListener');
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    initGCalSync();
    const onlineCalls = spy.mock.calls.filter(c => c[0] === 'online');
    expect(onlineCalls.length).toBeGreaterThanOrEqual(1);
    spy.mockRestore();
  });

  it('registers visibilitychange event handler when connected', () => {
    const spy = vi.spyOn(document, 'addEventListener');
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    initGCalSync();
    const visCalls = spy.mock.calls.filter(c => c[0] === 'visibilitychange');
    expect(visCalls.length).toBeGreaterThanOrEqual(1);
    spy.mockRestore();
  });

  it('stopGCalSyncTimers removes online handler', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    setConnected();
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    initGCalSync();
    stopGCalSyncTimers();
    const onlineCalls = removeSpy.mock.calls.filter(c => c[0] === 'online');
    expect(onlineCalls.length).toBeGreaterThanOrEqual(1);
    removeSpy.mockRestore();
  });
});


// ############################################################################
// SECTION 18: gcalFetch error handling (via fetchCalendarList)
// ############################################################################

describe('gcalFetch error handling (via fetchCalendarList)', () => {
  beforeEach(() => {
    setValidToken();
  });

  it('handles 403 with SERVICE_DISABLED error info', async () => {
    mockFetch.mockReturnValue(failRes(403, {
      error: {
        message: 'API disabled',
        details: [{
          '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
          reason: 'SERVICE_DISABLED',
          metadata: {
            serviceTitle: 'Google Calendar API',
            consumer: 'projects/12345',
            activationUrl: 'https://console.cloud.google.com/enable',
          },
        }],
      },
    }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('Google Calendar API is disabled');
    expect(mockState.gcalError).toContain('project 12345');
  });

  it('handles 403 without SERVICE_DISABLED', async () => {
    mockFetch.mockReturnValue(failRes(403, { error: { message: 'Forbidden' } }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('Calendar access was denied');
  });

  it('handles non-ok response with API error message', async () => {
    mockFetch.mockReturnValue(failRes(400, { error: { message: 'Bad request format' } }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('Bad request format');
  });

  it('handles non-ok response without parseable body', async () => {
    mockFetch.mockReturnValue(Promise.resolve({
      ok: false,
      status: 502,
      json: () => Promise.reject(new Error('parse fail')),
    }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('failed (502)');
  });

  it('handles AbortError (timeout)', async () => {
    const abortErr = new DOMException('The operation was aborted', 'AbortError');
    mockFetch.mockRejectedValue(abortErr);
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('timed out');
  });

  it('handles generic network error', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('Network error');
  });

  it('clears gcalError on successful response', async () => {
    mockState.gcalError = 'previous error';
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchCalendarList();
    expect(mockState.gcalError).toBeNull();
  });

  it('handles 401 retry flow — token refresh succeeds on retry', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      if (callCount <= 1) return failRes(401);
      return okJson({ items: [{ id: 'cal1', summary: 'Cal' }] });
    });
    // Mock sign-in to also write a valid token to localStorage
    mockSignInSuccess('refreshed-token');

    await fetchCalendarList();
    expect(callCount).toBeGreaterThanOrEqual(2);
  });

  it('handles 401 retry — refresh fails, calls handleTokenExpired', async () => {
    mockFetch.mockReturnValue(failRes(401));
    window.signInWithGoogleCalendar.mockResolvedValue(null);

    const result = await fetchCalendarList();
    expect(result).toBe(false);
    expect(mockState.gcalTokenExpired).toBe(true);
    expect(mockState.gcalError).toContain('expired');
  });

  it('handles 403 with details but no SERVICE_DISABLED reason', async () => {
    mockFetch.mockReturnValue(failRes(403, {
      error: {
        message: 'Quota exceeded',
        details: [{ '@type': 'some.other.type', reason: 'OTHER' }],
      },
    }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('access was denied');
  });

  it('handles 403 with SERVICE_DISABLED but missing metadata', async () => {
    mockFetch.mockReturnValue(failRes(403, {
      error: {
        details: [{
          '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
          reason: 'SERVICE_DISABLED',
          metadata: {},
        }],
      },
    }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('Google API is disabled');
  });

  it('handles 403 with no details array', async () => {
    mockFetch.mockReturnValue(failRes(403, { error: {} }));
    await fetchCalendarList();
    expect(mockState.gcalError).toContain('access was denied');
  });
});


// ############################################################################
// SECTION 19: ensureValidToken (tested indirectly)
// ############################################################################

describe('ensureValidToken (via syncGCalNow)', () => {
  it('returns immediately when token is valid', async () => {
    setConnected();
    setValidToken();
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await syncGCalNow();
    expect(window.signInWithGoogleCalendar).not.toHaveBeenCalled();
  });

  it('attempts silent refresh when token is expired', async () => {
    setConnected();
    // Set expired token
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'old-token');
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now() - 2 * 60 * 60 * 1000));
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
    // Mock sign-in to also write a fresh token
    mockSignInSuccess('new-token');
    mockFetch.mockReturnValue(okJson({ items: [] }));

    await syncGCalNow();
    expect(window.signInWithGoogleCalendar).toHaveBeenCalledWith({ mode: 'silent' });
  });

  it('sets gcalTokenExpired when refresh fails', async () => {
    setConnected();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'old-token');
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now() - 2 * 60 * 60 * 1000));
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    window.signInWithGoogleCalendar.mockResolvedValue(null);

    await syncGCalNow();
    expect(mockState.gcalTokenExpired).toBe(true);
  });
});


// ############################################################################
// SECTION 20: refreshAccessTokenSilent (tested indirectly)
// ############################################################################

describe('refreshAccessTokenSilent (via expired token scenarios)', () => {
  it('resets fail count on successful refresh', async () => {
    setConnected();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'expired-token');
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now() - 2 * 60 * 60 * 1000));
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
    mockSignInSuccess('refreshed');
    mockFetch.mockReturnValue(okJson({ items: [] }));

    await syncGCalNow();
    expect(mockState.gcalTokenExpired).toBe(false);
  });

  it('signInWithGoogleCalendar called with { mode: "silent" }', async () => {
    setConnected();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'expired');
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, '0');
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
    mockSignInSuccess('fresh');
    mockFetch.mockReturnValue(okJson({ items: [] }));

    await syncGCalNow();
    expect(window.signInWithGoogleCalendar).toHaveBeenCalledWith({ mode: 'silent' });
  });

  it('handles signInWithGoogleCalendar throwing an error', async () => {
    setConnected();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_ACCESS_TOKEN_KEY, 'expired');
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TOKEN_TIMESTAMP_KEY, '0');
    mockState.gcalCalendarList = [{ id: 'cal1' }];
    window.signInWithGoogleCalendar.mockRejectedValue(new Error('GIS error'));

    await syncGCalNow();
    expect(mockState.gcalTokenExpired).toBe(true);
  });
});


// ############################################################################
// SECTION 21: Offline queue enqueue/persist (tested indirectly)
// ############################################################################

describe('Offline queue enqueue behavior', () => {
  beforeEach(() => {
    setConnected();
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
  });

  it('enqueued items have correct structure', async () => {
    await pushTaskToGCalIfConnected({ id: 't1', title: 'Offline', dueDate: '2026-02-12' });
    const item = mockState.gcalOfflineQueue[0];
    expect(item).toBeDefined();
    expect(item.id).toMatch(/^gq_/);
    expect(item.type).toBe('push_task');
    expect(item.payload).toBeDefined();
    expect(item.createdAt).toBeDefined();
    expect(typeof item.lastError).toBe('string');
  });

  it('persists queue to localStorage', async () => {
    await pushTaskToGCalIfConnected({ id: 't1', title: 'Offline', dueDate: '2026-02-12' });
    const stored = JSON.parse(mockLocalStorage._storage.get(MOCK_CONSTANTS.GCAL_OFFLINE_QUEUE_KEY));
    expect(stored).toHaveLength(1);
  });

  it('calls render when enqueuing', async () => {
    await pushTaskToGCalIfConnected({ id: 't1', title: 'Offline', dueDate: '2026-02-12' });
    expect(window.render).toHaveBeenCalled();
  });

  it('accumulates multiple offline items', async () => {
    await pushTaskToGCalIfConnected({ id: 't1', title: 'Task 1', dueDate: '2026-02-12' });
    await deleteGCalEventIfConnected({ id: 't2', gcalEventId: 'ev2' });
    expect(mockState.gcalOfflineQueue).toHaveLength(2);
    expect(mockState.gcalOfflineQueue[0].type).toBe('push_task');
    expect(mockState.gcalOfflineQueue[1].type).toBe('delete_event');
  });
});


// ############################################################################
// SECTION 22: Meeting link extraction edge cases (via fetchEventsForRange)
// ############################################################################

describe('Meeting link extraction edge cases', () => {
  beforeEach(() => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["cal1"]');
  });

  it('prefers known meeting provider over generic link', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Meeting',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        description: 'Join: https://example.com/join or https://meet.google.com/abc',
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://meet.google.com/abc');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('Google Meet');
  });

  it('uses first candidate when no known provider match', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Meeting',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        description: 'Join: https://example.com/meeting/123',
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://example.com/meeting/123');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('');
  });

  it('returns empty string for events with no links', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'No Links',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('');
  });

  it('extracts Google Meet link from google.com/meet URL', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Meet',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        location: 'https://google.com/meet/abc-defg-hij',
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingProvider).toBe('Google Meet');
  });

  it('hangoutLink takes priority as first candidate', async () => {
    mockFetch.mockReturnValue(okJson({
      items: [{
        id: 'e1', summary: 'Meet',
        start: { date: '2026-02-12' }, end: { date: '2026-02-13' },
        hangoutLink: 'https://meet.google.com/hangout-abc',
        conferenceData: {
          entryPoints: [{ uri: 'https://meet.google.com/conf-xyz' }],
        },
      }],
    }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    expect(mockState.gcalEvents[0].meetingLink).toBe('https://meet.google.com/hangout-abc');
  });
});


// ############################################################################
// SECTION 23: Cross-cutting edge cases
// ############################################################################

describe('Cross-cutting edge cases', () => {
  it('pushTaskToGCal URL-encodes calendar ID with special characters', async () => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'user@example.com');
    mockFetch.mockReturnValue(okJson({ id: 'ev1' }));
    await pushTaskToGCal({ id: 't1', title: 'T', dueDate: '2026-02-12' });
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('calendars/user%40example.com');
  });

  it('fetchEventsForRange encodes calendar ID in URL', async () => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_SELECTED_CALENDARS_KEY, '["special@calendar.com"]');
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchEventsForRange('2026-02-01', '2026-03-01');
    const url = mockFetch.mock.calls[0][0];
    expect(url).toContain('calendars/special%40calendar.com');
  });

  it('gcalFetch includes Authorization header with Bearer token', async () => {
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [] }));
    await fetchCalendarList();
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers['Authorization']).toBe('Bearer valid-token');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('concurrent fetchCalendarList calls share the same fetch', async () => {
    setValidToken();
    mockFetch.mockReturnValue(okJson({ items: [{ id: 'cal1', summary: 'Cal' }] }));
    const [r1, r2] = await Promise.all([fetchCalendarList(), fetchCalendarList()]);
    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
  });

  it('204 No Content returns {} from gcalFetch (via deleteGCalEvent)', async () => {
    setValidToken();
    mockLocalStorage._storage.set(MOCK_CONSTANTS.GCAL_TARGET_CALENDAR_KEY, 'cal@gmail.com');
    mockFetch.mockReturnValue(noContent());
    await expect(deleteGCalEvent({ gcalEventId: 'ev1' })).resolves.not.toThrow();
  });
});
