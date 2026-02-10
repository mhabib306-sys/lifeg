// ============================================================================
// Google Contacts Sync Module
// ============================================================================
// One-way sync: Google Contacts -> Homebase People.
// Uses People API syncToken for incremental updates.

import { state } from '../state.js';
import { saveTasksData } from './storage.js';
import {
  GCAL_ACCESS_TOKEN_KEY,
  GCONTACTS_SYNC_TOKEN_KEY,
  GCONTACTS_LAST_SYNC_KEY,
} from '../constants.js';
import { isGCalConnected } from './google-calendar-sync.js';

const PEOPLE_API = 'https://people.googleapis.com/v1';
const CONTACTS_SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let contactsSyncIntervalId = null;

function getAccessToken() {
  return localStorage.getItem(GCAL_ACCESS_TOKEN_KEY) || '';
}

function getContactsSyncToken() {
  return localStorage.getItem(GCONTACTS_SYNC_TOKEN_KEY) || '';
}

function setContactsSyncToken(token) {
  if (!token) localStorage.removeItem(GCONTACTS_SYNC_TOKEN_KEY);
  else localStorage.setItem(GCONTACTS_SYNC_TOKEN_KEY, token);
}

function setContactsLastSync(ts) {
  state.gcontactsLastSync = ts;
  localStorage.setItem(GCONTACTS_LAST_SYNC_KEY, String(ts));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeName(name) {
  return String(name || '').trim().toLowerCase();
}

function pickPrimaryName(person) {
  const names = Array.isArray(person?.names) ? person.names : [];
  const primary = names.find(n => n?.metadata?.primary);
  return String(primary?.displayName || names[0]?.displayName || '').trim();
}

function pickPrimaryEmail(person) {
  const emails = Array.isArray(person?.emailAddresses) ? person.emailAddresses : [];
  const primary = emails.find(e => e?.metadata?.primary);
  return String(primary?.value || emails[0]?.value || '').trim();
}

function randomPersonColor() {
  const palette = ['#4A90A4', '#6B8E5A', '#E5533D', '#C4943D', '#7C6B8E', '#6366F1', '#0EA5E9'];
  return palette[Math.floor(Math.random() * palette.length)];
}

function ensurePersonId() {
  return `person_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function mergeGoogleContactsIntoPeople(contacts) {
  if (!Array.isArray(contacts) || contacts.length === 0) return 0;
  let changed = 0;

  for (const contact of contacts) {
    const deleted = !!contact?.metadata?.deleted;
    const resourceName = String(contact?.resourceName || '').trim();
    const name = pickPrimaryName(contact);
    const email = pickPrimaryEmail(contact);
    const emailNorm = normalizeEmail(email);
    const nameNorm = normalizeName(name);

    if (!resourceName) continue;

    const byResource = state.taskPeople.find(p => String(p.googleContactId || '') === resourceName);
    const byEmail = !byResource && emailNorm
      ? state.taskPeople.find(p => normalizeEmail(p.email) === emailNorm)
      : null;
    const byName = !byResource && !byEmail && nameNorm
      ? state.taskPeople.find(p => normalizeName(p.name) === nameNorm)
      : null;
    const existing = byResource || byEmail || byName || null;

    if (deleted) {
      // Soft behavior: do not delete local person entries automatically.
      // Just unlink external ID so future contact recreate can relink by email/name.
      if (existing && existing.googleContactId === resourceName) {
        existing.googleContactId = '';
        existing.updatedAt = new Date().toISOString();
        changed++;
      }
      continue;
    }

    if (existing) {
      const nextName = name || existing.name;
      const nextEmail = email || existing.email || '';
      const needsUpdate = (
        existing.name !== nextName ||
        String(existing.email || '') !== String(nextEmail || '') ||
        String(existing.googleContactId || '') !== resourceName
      );
      if (needsUpdate) {
        existing.name = nextName;
        existing.email = String(nextEmail || '').trim();
        existing.googleContactId = resourceName;
        existing.updatedAt = new Date().toISOString();
        changed++;
      }
      continue;
    }

    // Skip nameless and emailless entries.
    if (!name && !email) continue;

    state.taskPeople.push({
      id: ensurePersonId(),
      name: name || email,
      email: String(email || '').trim(),
      color: randomPersonColor(),
      googleContactId: resourceName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    changed++;
  }

  return changed;
}

async function fetchConnectionsPage({ pageToken = '', syncToken = '', requestSyncToken = false } = {}) {
  const token = getAccessToken();
  if (!token) return null;

  const params = new URLSearchParams({
    personFields: 'names,emailAddresses,metadata',
    pageSize: '500',
  });
  if (pageToken) params.set('pageToken', pageToken);
  if (syncToken) params.set('syncToken', syncToken);
  if (requestSyncToken) params.set('requestSyncToken', 'true');

  const res = await fetch(`${PEOPLE_API}/people/me/connections?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) return { authExpired: true };
  if (res.status === 410) return { syncExpired: true };
  if (!res.ok) {
    let message = `Google Contacts request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
    } catch { /* ignore */ }
    return { error: message };
  }

  return res.json();
}

export async function syncGoogleContactsNow() {
  if (!isGCalConnected()) return false;
  const token = getAccessToken();
  if (!token) return false;

  state.gcontactsSyncing = true;
  state.gcontactsError = null;
  window.render();

  try {
    let syncToken = getContactsSyncToken();
    let pageToken = '';
    let nextSyncToken = '';
    let allConnections = [];
    let fullResyncAttempted = false;

    while (true) {
      const data = await fetchConnectionsPage({
        pageToken,
        syncToken,
        requestSyncToken: !syncToken,
      });

      if (!data) {
        state.gcontactsError = 'Google Contacts sync failed.';
        return false;
      }
      if (data.authExpired) {
        state.gcontactsError = 'Google Contacts authorization expired. Reconnect Google Calendar to refresh permissions.';
        return false;
      }
      if (data.syncExpired) {
        if (fullResyncAttempted) {
          state.gcontactsError = 'Google Contacts sync token expired. Please sync again.';
          return false;
        }
        fullResyncAttempted = true;
        setContactsSyncToken('');
        syncToken = '';
        pageToken = '';
        nextSyncToken = '';
        allConnections = [];
        continue;
      }
      if (data.error) {
        state.gcontactsError = data.error;
        return false;
      }

      allConnections = allConnections.concat(Array.isArray(data.connections) ? data.connections : []);
      pageToken = data.nextPageToken || '';
      if (data.nextSyncToken) nextSyncToken = data.nextSyncToken;
      if (!pageToken) break;
    }

    const changed = mergeGoogleContactsIntoPeople(allConnections);
    if (changed > 0) {
      saveTasksData();
    }
    if (nextSyncToken) setContactsSyncToken(nextSyncToken);
    setContactsLastSync(Date.now());
    state.gcontactsError = null;
    return true;
  } catch (err) {
    state.gcontactsError = err?.message || 'Google Contacts sync failed.';
    return false;
  } finally {
    state.gcontactsSyncing = false;
    window.render();
  }
}

export function initGoogleContactsSync() {
  const last = parseInt(localStorage.getItem(GCONTACTS_LAST_SYNC_KEY) || '0', 10);
  state.gcontactsLastSync = Number.isFinite(last) && last > 0 ? last : null;

  if (!isGCalConnected()) return;
  syncGoogleContactsNow();

  if (contactsSyncIntervalId) clearInterval(contactsSyncIntervalId);
  contactsSyncIntervalId = setInterval(() => {
    if (isGCalConnected()) syncGoogleContactsNow();
  }, CONTACTS_SYNC_INTERVAL_MS);
}
