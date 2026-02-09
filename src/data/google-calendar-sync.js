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
  GCAL_EVENTS_CACHE_KEY, GCAL_LAST_SYNC_KEY, GCAL_CONNECTED_KEY
} from '../constants.js';

const GCAL_API = 'https://www.googleapis.com/calendar/v3';
const TOKEN_MAX_AGE_MS = 55 * 60 * 1000; // 55 minutes (tokens last ~60 min)
const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let syncIntervalId = null;

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
  window.render();
}

// ---- API helper ----

async function gcalFetch(endpoint, options = {}) {
  const token = getAccessToken();
  if (!token) { handleTokenExpired(); return null; }

  const res = await fetch(`${GCAL_API}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    handleTokenExpired();
    return null;
  }
  if (!res.ok) {
    console.warn(`GCal API error: ${res.status} ${endpoint}`);
    return null;
  }
  if (res.status === 204) return {}; // DELETE returns no body
  return res.json();
}

// ---- Read functions ----

export async function fetchCalendarList() {
  const data = await gcalFetch('/users/me/calendarList?minAccessRole=reader');
  if (!data || !data.items) return;
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
}

export async function fetchEventsForRange(timeMin, timeMax) {
  const selected = getSelectedCalendars();
  if (selected.length === 0) return;

  state.gcalSyncing = true;
  window.render();

  const allEvents = [];
  for (const calId of selected) {
    const params = new URLSearchParams({
      timeMin: new Date(timeMin).toISOString(),
      timeMax: new Date(timeMax).toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '250',
    });
    const data = await gcalFetch(`/calendars/${encodeURIComponent(calId)}/events?${params}`);
    if (data && data.items) {
      data.items.forEach(e => {
        allEvents.push({
          id: e.id,
          calendarId: calId,
          summary: e.summary || '(No title)',
          description: e.description || '',
          start: e.start,
          end: e.end,
          htmlLink: e.htmlLink || '',
          allDay: !!e.start.date,
        });
      });
    }
  }

  state.gcalEvents = allEvents;
  state.gcalSyncing = false;
  localStorage.setItem(GCAL_EVENTS_CACHE_KEY, JSON.stringify(allEvents));
  localStorage.setItem(GCAL_LAST_SYNC_KEY, String(Date.now()));
  window.render();
}

export function getGCalEventsForDate(dateStr) {
  return state.gcalEvents.filter(e => {
    if (e.allDay) {
      // Google uses exclusive end date for all-day events
      const start = e.start.date;
      const end = e.end.date;
      return dateStr >= start && dateStr < end;
    }
    // Timed events: check if the event's start date matches
    const eventDate = (e.start.dateTime || '').slice(0, 10);
    return eventDate === dateStr;
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

export async function pushTaskToGCalIfConnected(task) {
  if (!isGCalConnected() || !isTokenValid()) return;
  if (task.isNote) return;
  if (!task.deferDate && !task.dueDate) return;
  try { await pushTaskToGCal(task); } catch (err) { console.warn('GCal push failed:', err); }
}

export async function deleteGCalEventIfConnected(task) {
  if (!isGCalConnected() || !isTokenValid()) return;
  if (!task.gcalEventId) return;
  try { await deleteGCalEvent(task); } catch (err) { console.warn('GCal delete failed:', err); }
}

// ---- Lifecycle ----

export async function connectGCal() {
  const token = await window.signInWithGoogleCalendar();
  if (!token) return;
  localStorage.setItem(GCAL_CONNECTED_KEY, 'true');
  state.gcalTokenExpired = false;
  await fetchCalendarList();
  await syncGCalNow();
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
  state.gcalEvents = [];
  state.gcalCalendarList = [];
  state.gcalSyncing = false;
  state.gcalTokenExpired = false;
  if (syncIntervalId) { clearInterval(syncIntervalId); syncIntervalId = null; }
  window.render();
}

export async function reconnectGCal() {
  const token = await window.signInWithGoogleCalendar();
  if (!token) return;
  state.gcalTokenExpired = false;
  await fetchCalendarList();
  await syncGCalNow();
  window.render();
}

export async function syncGCalNow() {
  if (!isGCalConnected() || !isTokenValid()) return;
  // Fetch events for current month +/- 1 month
  const year = state.calendarYear;
  const month = state.calendarMonth;
  const timeMin = `${year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-01`;
  const endMonth = month + 2 > 12 ? month + 2 - 12 : month + 2;
  const endYear = month + 2 > 12 ? year + 1 : year;
  const timeMax = `${endYear}-${String(endMonth).padStart(2, '0')}-28`;
  await fetchEventsForRange(timeMin, timeMax);
}

export function toggleCalendarSelection(calendarId) {
  const selected = getSelectedCalendars();
  const idx = selected.indexOf(calendarId);
  if (idx >= 0) {
    selected.splice(idx, 1);
  } else {
    selected.push(calendarId);
  }
  setSelectedCalendars(selected);
  syncGCalNow();
  window.render();
}

export function initGCalSync() {
  // Load cached events
  try {
    const cached = localStorage.getItem(GCAL_EVENTS_CACHE_KEY);
    if (cached) state.gcalEvents = JSON.parse(cached);
  } catch { /* ignore */ }

  if (!isGCalConnected()) return;

  // Check token validity
  if (!isTokenValid()) {
    state.gcalTokenExpired = true;
    return;
  }

  // Load calendar list, then sync
  fetchCalendarList().then(() => syncGCalNow());

  // Periodic sync every 30 minutes
  syncIntervalId = setInterval(() => {
    if (isGCalConnected() && isTokenValid()) syncGCalNow();
  }, SYNC_INTERVAL_MS);
}
