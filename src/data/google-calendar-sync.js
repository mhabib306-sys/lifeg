// ============================================================================
// Google Calendar Sync Module
// ============================================================================
// Two-way sync: pulls events from Google Calendar into the Calendar view,
// and pushes dated Homebase tasks to a target Google Calendar.
// Follows the whoop-sync.js pattern: REST API + localStorage caching.

import { state } from '../state.js';
import {
  GCAL_ACCESS_TOKEN_KEY, GCAL_TOKEN_TIMESTAMP_KEY,
  GCAL_SELECTED_CALENDARS_KEY, GCAL_TARGET_CALENDAR_KEY,
  GCAL_EVENTS_CACHE_KEY, GCAL_LAST_SYNC_KEY, GCAL_CONNECTED_KEY,
  GCAL_OFFLINE_QUEUE_KEY,
  GCONTACTS_SYNC_TOKEN_KEY, GCONTACTS_LAST_SYNC_KEY
} from '../constants.js';

const GCAL_API = 'https://www.googleapis.com/calendar/v3';
const TOKEN_MAX_AGE_MS = 55 * 60 * 1000; // 55 minutes (tokens last ~60 min)
const TOKEN_REFRESH_MS = 45 * 60 * 1000; // Proactively refresh at 45 min (before expiry)
const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const GCAL_FETCH_TIMEOUT_MS = 15000; // Prevent indefinite loading on hung requests

let syncIntervalId = null;
let tokenRefreshIntervalId = null;
let tokenRefreshPromise = null;

function persistOfflineQueue() {
  localStorage.setItem(GCAL_OFFLINE_QUEUE_KEY, JSON.stringify(state.gcalOfflineQueue || []));
}

function enqueueOfflineAction(type, payload, lastError = '') {
  const queue = Array.isArray(state.gcalOfflineQueue) ? state.gcalOfflineQueue : [];
  queue.push({
    id: `gq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
    lastError: lastError || '',
  });
  state.gcalOfflineQueue = queue;
  persistOfflineQueue();
  window.render();
}

function removeOfflineActionById(id) {
  state.gcalOfflineQueue = (state.gcalOfflineQueue || []).filter(item => item.id !== id);
  persistOfflineQueue();
}

function detectMeetingProvider(url = '') {
  const u = String(url).toLowerCase();
  if (u.includes('meet.google.com') || u.includes('google.com/meet')) return 'Google Meet';
  if (u.includes('zoom.us')) return 'Zoom';
  if (u.includes('teams.microsoft.com')) return 'Microsoft Teams';
  return '';
}

function extractMeetingLink(event) {
  const candidates = [];
  if (event?.hangoutLink) candidates.push(event.hangoutLink);

  const entryPoints = event?.conferenceData?.entryPoints || [];
  entryPoints.forEach(ep => {
    if (ep?.uri) candidates.push(ep.uri);
  });

  const urlRegex = /(https?:\/\/[^\s<>"')]+)/gi;
  const descriptionLinks = String(event?.description || '').match(urlRegex) || [];
  const locationLinks = String(event?.location || '').match(urlRegex) || [];
  candidates.push(...descriptionLinks, ...locationLinks);

  const preferred = candidates.find(link => detectMeetingProvider(link));
  const meetingLink = preferred || candidates[0] || '';
  return {
    meetingLink,
    meetingProvider: detectMeetingProvider(meetingLink),
  };
}

function isCancelledEvent(event) {
  if (!event) return false;
  const normalizedStatus = String(event.status || '').toLowerCase();
  if (normalizedStatus === 'cancelled' || normalizedStatus === 'canceled') return true;
  const summary = String(event.summary || '').trim();
  if (/^cance(?:l|ll)ed\b[:\s-]*/i.test(summary)) return true;
  return false;
}

function extractGCalServiceDisabledMessage(errBody) {
  const details = errBody?.error?.details;
  if (!Array.isArray(details)) return '';
  const errorInfo = details.find(d => d?.['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo');
  if (!errorInfo || errorInfo.reason !== 'SERVICE_DISABLED') return '';
  const serviceTitle = errorInfo.metadata?.serviceTitle || 'Google API';
  const projectId = (errorInfo.metadata?.consumer || '').replace('projects/', '') || errorInfo.metadata?.containerInfo || '';
  const activationUrl = errorInfo.metadata?.activationUrl || '';
  const projectText = projectId ? ` (project ${projectId})` : '';
  const linkText = activationUrl ? ` Enable it: ${activationUrl}` : '';
  return `${serviceTitle} is disabled${projectText}.${linkText}`.trim();
}

// ---- Config getters/setters (localStorage-backed) ----

export function isGCalConnected() {
  return localStorage.getItem(GCAL_CONNECTED_KEY) === 'true';
}

export function getSelectedCalendars() {
  try {
    return JSON.parse(localStorage.getItem(GCAL_SELECTED_CALENDARS_KEY) || '[]');
  } catch { return []; }
}

export function setSelectedCalendars(ids) {
  localStorage.setItem(GCAL_SELECTED_CALENDARS_KEY, JSON.stringify(ids));
}

export function getTargetCalendar() {
  return localStorage.getItem(GCAL_TARGET_CALENDAR_KEY) || '';
}

export function setTargetCalendar(calendarId) {
  localStorage.setItem(GCAL_TARGET_CALENDAR_KEY, calendarId);
}

export function getGCalOfflineQueue() {
  return Array.isArray(state.gcalOfflineQueue) ? state.gcalOfflineQueue : [];
}

export function clearGCalOfflineQueue() {
  state.gcalOfflineQueue = [];
  persistOfflineQueue();
  window.render();
}

export function removeGCalOfflineQueueItem(itemId) {
  removeOfflineActionById(itemId);
  window.render();
}

function getGCalLastSync() {
  const ts = localStorage.getItem(GCAL_LAST_SYNC_KEY);
  return ts ? parseInt(ts, 10) : null;
}

// ---- Token management ----

function getAccessToken() {
  return localStorage.getItem(GCAL_ACCESS_TOKEN_KEY) || '';
}

export function isTokenValid() {
  const token = getAccessToken();
  if (!token) return false;
  const ts = parseInt(localStorage.getItem(GCAL_TOKEN_TIMESTAMP_KEY) || '0', 10);
  return Date.now() - ts < TOKEN_MAX_AGE_MS;
}

function handleTokenExpired() {
  state.gcalTokenExpired = true;
  state.gcalError = 'Google Calendar session expired. Reconnect to continue.';
  window.render();
}

async function refreshAccessTokenSilent() {
  if (tokenRefreshPromise) return tokenRefreshPromise;

  tokenRefreshPromise = (async () => {
    try {
      const token = await window.signInWithGoogleCalendar?.({ mode: 'silent' });
      if (token) {
        state.gcalTokenExpired = false;
        state.gcalError = null;
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Silent token refresh error:', err);
      return false;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}

async function ensureValidToken() {
  if (isTokenValid()) return true;
  const refreshed = await refreshAccessTokenSilent();
  if (!refreshed) {
    handleTokenExpired();
    return false;
  }
  return true;
}

// ---- API helper ----

async function gcalFetch(endpoint, options = {}) {
  const tokenOk = await ensureValidToken();
  if (!tokenOk) return null;
  const token = getAccessToken();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GCAL_FETCH_TIMEOUT_MS);
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const { signal: _ignoredSignal, _retry401, ...restOptions } = options;

  try {
    const res = await fetch(`${GCAL_API}${endpoint}`, {
      ...restOptions,
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      const refreshed = options._retry401 ? false : await refreshAccessTokenSilent();
      if (refreshed) {
        return gcalFetch(endpoint, { ...options, _retry401: true });
      }
      handleTokenExpired();
      return null;
    }

    if (!res.ok) {
      let apiMessage = '';
      let parsedError = null;
      try {
        parsedError = await res.json();
        apiMessage = parsedError?.error?.message || '';
      } catch { /* ignore parse errors */ }

      if (res.status === 403) {
        const serviceDisabled = extractGCalServiceDisabledMessage(parsedError);
        state.gcalError = serviceDisabled || 'Calendar access was denied. Reconnect and grant Calendar permissions.';
      } else if (apiMessage) {
        state.gcalError = `Google Calendar error: ${apiMessage}`;
      } else {
        state.gcalError = `Google Calendar request failed (${res.status}).`;
      }

      console.warn(`GCal API error: ${res.status} ${endpoint}${apiMessage ? ` — ${apiMessage}` : ''}`);
      return null;
    }

    state.gcalError = null;
    if (res.status === 204) return {}; // DELETE returns no body
    return res.json();
  } catch (err) {
    if (err?.name === 'AbortError') {
      state.gcalError = 'Google Calendar request timed out. Check connection and try again.';
    } else {
      state.gcalError = 'Network error while contacting Google Calendar.';
    }
    console.warn('GCal network error:', err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---- Read functions ----

export async function fetchCalendarList() {
  state.gcalCalendarsLoading = true;
  state.gcalError = null;
  window.render();

  try {
    const data = await gcalFetch('/users/me/calendarList?minAccessRole=reader');
    if (!data || !Array.isArray(data.items)) return false;

    state.gcalCalendarList = data.items.map(c => ({
      id: c.id,
      summary: c.summary || c.id,
      backgroundColor: c.backgroundColor || '#4285f4',
      primary: !!c.primary,
      accessRole: c.accessRole,
    }));

    // Auto-select all calendars on first connect if none selected
    if (getSelectedCalendars().length === 0) {
      setSelectedCalendars(state.gcalCalendarList.map(c => c.id));
    }

    // Auto-set target to primary calendar if not set
    if (!getTargetCalendar()) {
      const primary = state.gcalCalendarList.find(c => c.primary);
      if (primary) setTargetCalendar(primary.id);
    }

    // Fallback target if no primary was found
    if (!getTargetCalendar() && state.gcalCalendarList.length > 0) {
      setTargetCalendar(state.gcalCalendarList[0].id);
    }

    return true;
  } finally {
    state.gcalCalendarsLoading = false;
    window.render();
  }
}

export async function fetchEventsForRange(timeMin, timeMax) {
  const selected = getSelectedCalendars();
  if (selected.length === 0) return;

  state.gcalSyncing = true;
  const _sy1 = window.scrollY;
  window.render();
  window.scrollTo(0, _sy1);

  try {
    const allEvents = [];
    for (const calId of selected) {
      let nextPageToken = '';
      do {
        const params = new URLSearchParams({
          timeMin: new Date(timeMin).toISOString(),
          timeMax: new Date(timeMax).toISOString(),
          singleEvents: 'true',
          orderBy: 'startTime',
          maxResults: '250',
        });
        if (nextPageToken) params.set('pageToken', nextPageToken);
        const data = await gcalFetch(`/calendars/${encodeURIComponent(calId)}/events?${params}`);
        if (!data) break;
        const items = Array.isArray(data.items) ? data.items : [];
        items.forEach(e => {
          if (isCancelledEvent(e)) return;
          const { meetingLink, meetingProvider } = extractMeetingLink(e);
          allEvents.push({
            id: e.id,
            calendarId: calId,
            status: e.status || '',
            summary: e.summary || '(No title)',
            description: e.description || '',
            attendees: Array.isArray(e.attendees)
              ? e.attendees.map(a => ({
                email: a.email || '',
                displayName: a.displayName || '',
                responseStatus: a.responseStatus || '',
              }))
              : [],
            recurringEventId: e.recurringEventId || '',
            originalStartTime: e.originalStartTime || null,
            start: e.start,
            end: e.end,
            location: e.location || '',
            htmlLink: e.htmlLink || '',
            meetingLink,
            meetingProvider,
            allDay: !!e.start.date,
          });
        });
        nextPageToken = data.nextPageToken || '';
      } while (nextPageToken);
    }

    state.gcalEvents = allEvents;
    localStorage.setItem(GCAL_EVENTS_CACHE_KEY, JSON.stringify(allEvents));
    localStorage.setItem(GCAL_LAST_SYNC_KEY, String(Date.now()));
  } finally {
    state.gcalSyncing = false;
    const _sy2 = window.scrollY;
    window.render();
    window.scrollTo(0, _sy2);
  }
}

export function getGCalEventsForDate(dateStr) {
  const selected = getSelectedCalendars();
  return state.gcalEvents.filter(e => {
    if (isCancelledEvent(e)) return false;
    if (selected.length > 0 && !selected.includes(e.calendarId)) return false;
    if (e.allDay) {
      // Google uses exclusive end date for all-day events
      const start = e.start.date;
      const end = e.end.date;
      return dateStr >= start && dateStr < end;
    }
    // Timed events: include any day interval this event overlaps
    const startIso = e.start?.dateTime || '';
    const endIso = e.end?.dateTime || '';
    if (!startIso) return false;
    const eventStart = new Date(startIso);
    const eventEnd = endIso ? new Date(endIso) : new Date(startIso);
    if (!Number.isFinite(eventStart.getTime()) || !Number.isFinite(eventEnd.getTime())) return false;
    const dayStart = new Date(`${dateStr}T00:00:00`);
    const dayEnd = new Date(`${dateStr}T23:59:59.999`);
    return eventStart <= dayEnd && eventEnd > dayStart;
  });
}

// ---- Write functions ----

export async function pushTaskToGCal(task) {
  const targetCal = getTargetCalendar();
  if (!targetCal) return;

  const startDate = task.deferDate || task.dueDate;
  if (!startDate) return;

  // All-day event: Google requires exclusive end date (end = start + 1 day)
  const endDate = task.dueDate || task.deferDate;
  const endParts = endDate.split('-').map(Number);
  const endDateObj = new Date(endParts[0], endParts[1] - 1, endParts[2] + 1);
  const exclusiveEnd = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;

  const body = {
    summary: task.title,
    description: task.notes || '',
    start: { date: startDate },
    end: { date: exclusiveEnd },
  };

  if (task.gcalEventId) {
    // Update existing event
    const data = await gcalFetch(
      `/calendars/${encodeURIComponent(targetCal)}/events/${encodeURIComponent(task.gcalEventId)}`,
      { method: 'PUT', body: JSON.stringify(body) }
    );
    return data;
  } else {
    // Create new event
    const data = await gcalFetch(
      `/calendars/${encodeURIComponent(targetCal)}/events`,
      { method: 'POST', body: JSON.stringify(body) }
    );
    if (data && data.id) {
      // Store the gcal event ID on the task
      window.updateTask(task.id, { gcalEventId: data.id });
    }
    return data;
  }
}

export async function deleteGCalEvent(task) {
  if (!task.gcalEventId) return;
  const targetCal = getTargetCalendar();
  if (!targetCal) return;
  await gcalFetch(
    `/calendars/${encodeURIComponent(targetCal)}/events/${encodeURIComponent(task.gcalEventId)}`,
    { method: 'DELETE' }
  );
}

async function rescheduleGCalEvent(event, startIso, endIso) {
  if (!event?.calendarId || !event?.id) return null;
  const body = {
    start: { dateTime: startIso },
    end: { dateTime: endIso },
  };
  return gcalFetch(
    `/calendars/${encodeURIComponent(event.calendarId)}/events/${encodeURIComponent(event.id)}`,
    { method: 'PATCH', body: JSON.stringify(body) }
  );
}

export async function pushTaskToGCalIfConnected(task) {
  if (!isGCalConnected()) return;
  if (!navigator.onLine) {
    enqueueOfflineAction('push_task', { task });
    return;
  }
  if (!(await ensureValidToken())) return;
  if (task.isNote) return;
  if (!task.deferDate && !task.dueDate) return;
  try {
    const result = await pushTaskToGCal(task);
    if (!result) enqueueOfflineAction('push_task', { task }, state.gcalError || 'Push failed');
  } catch (err) {
    enqueueOfflineAction('push_task', { task }, err?.message || 'Push failed');
    console.warn('GCal push failed:', err);
  }
}

export async function deleteGCalEventIfConnected(task) {
  if (!isGCalConnected()) return;
  if (!navigator.onLine) {
    enqueueOfflineAction('delete_event', { task });
    return;
  }
  if (!(await ensureValidToken())) return;
  if (!task.gcalEventId) return;
  try {
    const result = await deleteGCalEvent(task);
    if (result === null) enqueueOfflineAction('delete_event', { task }, state.gcalError || 'Delete failed');
  } catch (err) {
    enqueueOfflineAction('delete_event', { task }, err?.message || 'Delete failed');
    console.warn('GCal delete failed:', err);
  }
}

export async function rescheduleGCalEventIfConnected(event, dateStr, hour) {
  if (!isGCalConnected() || !event) return false;

  const nextStart = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00:00`);
  const prevStart = event?.start?.dateTime ? new Date(event.start.dateTime) : null;
  const prevEnd = event?.end?.dateTime ? new Date(event.end.dateTime) : null;
  const durationMs = prevStart && prevEnd ? Math.max(30 * 60 * 1000, prevEnd - prevStart) : 60 * 60 * 1000;
  const nextEnd = new Date(nextStart.getTime() + durationMs);
  const startIso = nextStart.toISOString();
  const endIso = nextEnd.toISOString();

  if (!navigator.onLine) {
    enqueueOfflineAction('reschedule_event', { event, dateStr, hour, startIso, endIso }, 'Offline');
    return false;
  }

  if (!(await ensureValidToken())) return false;
  try {
    const result = await rescheduleGCalEvent(event, startIso, endIso);
    if (!result) {
      enqueueOfflineAction('reschedule_event', { event, dateStr, hour, startIso, endIso }, state.gcalError || 'Reschedule failed');
      return false;
    }
    const target = state.gcalEvents.find(e => e.calendarId === event.calendarId && e.id === event.id);
    if (target) {
      target.start = { dateTime: startIso };
      target.end = { dateTime: endIso };
      target.allDay = false;
      localStorage.setItem(GCAL_EVENTS_CACHE_KEY, JSON.stringify(state.gcalEvents));
    }
    window.render();
    return true;
  } catch (err) {
    enqueueOfflineAction('reschedule_event', { event, dateStr, hour, startIso, endIso }, err?.message || 'Reschedule failed');
    console.warn('GCal reschedule failed:', err);
    return false;
  }
}

export async function retryGCalOfflineQueue() {
  const queue = [...getGCalOfflineQueue()];
  if (!queue.length) return;
  for (const item of queue) {
    try {
      if (item.type === 'push_task' && item.payload?.task) {
        await pushTaskToGCalIfConnected(item.payload.task);
      } else if (item.type === 'delete_event' && item.payload?.task) {
        await deleteGCalEventIfConnected(item.payload.task);
      } else if (item.type === 'reschedule_event' && item.payload?.event) {
        await rescheduleGCalEventIfConnected(item.payload.event, item.payload.dateStr, item.payload.hour);
      }
      removeOfflineActionById(item.id);
    } catch (err) {
      const target = state.gcalOfflineQueue.find(q => q.id === item.id);
      if (target) target.lastError = err?.message || 'Retry failed';
      persistOfflineQueue();
    }
  }
  window.render();
}

// ---- Lifecycle ----

export async function connectGCal() {
  const token = await window.signInWithGoogleCalendar();
  if (!token) return;
  localStorage.setItem(GCAL_CONNECTED_KEY, 'true');
  state.gcalTokenExpired = false;
  state.gcalError = null;
  const loaded = await fetchCalendarList();
  if (loaded) await syncGCalNow();
  await window.syncGoogleContactsNow?.();
  window.render();
}

export function disconnectGCal() {
  localStorage.removeItem(GCAL_CONNECTED_KEY);
  localStorage.removeItem(GCAL_ACCESS_TOKEN_KEY);
  localStorage.removeItem(GCAL_TOKEN_TIMESTAMP_KEY);
  localStorage.removeItem(GCAL_SELECTED_CALENDARS_KEY);
  localStorage.removeItem(GCAL_TARGET_CALENDAR_KEY);
  localStorage.removeItem(GCAL_EVENTS_CACHE_KEY);
  localStorage.removeItem(GCAL_LAST_SYNC_KEY);
  localStorage.removeItem(GCONTACTS_SYNC_TOKEN_KEY);
  localStorage.removeItem(GCONTACTS_LAST_SYNC_KEY);
  state.gcalEvents = [];
  state.gcalCalendarList = [];
  state.gcalCalendarsLoading = false;
  state.gcalError = null;
  state.gcalSyncing = false;
  state.gcalTokenExpired = false;
  state.gcontactsSyncing = false;
  state.gcontactsLastSync = null;
  state.gcontactsError = null;
  if (syncIntervalId) { clearInterval(syncIntervalId); syncIntervalId = null; }
  if (tokenRefreshIntervalId) { clearInterval(tokenRefreshIntervalId); tokenRefreshIntervalId = null; }
  window.render();
}

export async function reconnectGCal() {
  const token = await window.signInWithGoogleCalendar();
  if (!token) return;
  state.gcalTokenExpired = false;
  state.gcalError = null;
  const loaded = await fetchCalendarList();
  if (loaded) await syncGCalNow();
  await window.syncGoogleContactsNow?.();
  window.render();
}

export async function syncGCalNow() {
  if (!isGCalConnected()) return;
  if (!(await ensureValidToken())) return;
  if ((state.gcalCalendarList || []).length === 0) return;
  // Fetch events for previous month start through next month end (no truncation)
  const start = new Date(state.calendarYear, state.calendarMonth - 1, 1, 0, 0, 0, 0);
  const end = new Date(state.calendarYear, state.calendarMonth + 2, 0, 23, 59, 59, 999);
  const timeMin = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  const timeMax = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  await fetchEventsForRange(timeMin, timeMax);
}

export function toggleCalendarSelection(calendarId) {
  const selected = getSelectedCalendars();
  const idx = selected.indexOf(calendarId);
  const adding = idx < 0;
  if (adding) {
    selected.push(calendarId);
  } else {
    selected.splice(idx, 1);
  }
  setSelectedCalendars(selected);
  // Preserve scroll — render() replaces entire DOM
  const scrollY = window.scrollY;
  window.render();
  window.scrollTo(0, scrollY);
  // Only re-fetch when adding a calendar (its events may not be cached yet)
  if (adding) syncGCalNow();
}

export function initGCalSync() {
  // Load cached events
  try {
    const cached = localStorage.getItem(GCAL_EVENTS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      state.gcalEvents = Array.isArray(parsed) ? parsed.filter(e => !isCancelledEvent(e)) : [];
      localStorage.setItem(GCAL_EVENTS_CACHE_KEY, JSON.stringify(state.gcalEvents));
    }
  } catch { /* ignore */ }

  if (!isGCalConnected()) return;

  const startSync = async () => {
    if (!(await ensureValidToken())) return;
    const loaded = await fetchCalendarList();
    if (loaded) syncGCalNow();
  };
  startSync();

  // Periodic sync every 30 minutes — refresh token if needed before syncing
  if (syncIntervalId) clearInterval(syncIntervalId);
  syncIntervalId = setInterval(async () => {
    if (!isGCalConnected()) return;
    if (await ensureValidToken()) syncGCalNow();
  }, SYNC_INTERVAL_MS);

  // Proactive token refresh — refresh before expiry so session never lapses
  if (tokenRefreshIntervalId) clearInterval(tokenRefreshIntervalId);
  tokenRefreshIntervalId = setInterval(async () => {
    if (!isGCalConnected()) return;
    const ts = parseInt(localStorage.getItem(GCAL_TOKEN_TIMESTAMP_KEY) || '0', 10);
    const tokenAge = Date.now() - ts;
    if (tokenAge >= TOKEN_REFRESH_MS) {
      const refreshed = await refreshAccessTokenSilent();
      if (refreshed) {
        console.log('[GCal] Token proactively refreshed');
      }
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  // When user returns to the tab, check token immediately
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible') return;
    if (!isGCalConnected()) return;
    if (!isTokenValid()) {
      const refreshed = await refreshAccessTokenSilent();
      if (refreshed) {
        console.log('[GCal] Token refreshed on tab focus');
        window.render();
      }
    }
  });
}
