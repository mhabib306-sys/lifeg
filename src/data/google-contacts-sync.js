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
import { normalizeEmail } from '../utils.js';

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

function pickPrimaryJobTitle(person) {
  const orgs = Array.isArray(person?.organizations) ? person.organizations : [];
  const primary = orgs.find(o => o?.metadata?.primary);
  return String(primary?.title || orgs[0]?.title || '').trim();
}

function pickPrimaryPhotoUrl(person) {
  const photos = Array.isArray(person?.photos) ? person.photos : [];
  // Filter out default placeholder images
  const real = photos.filter(p => !p?.default);
  if (real.length === 0) return '';
  const primary = real.find(p => p?.metadata?.primary);
  return String(primary?.url || real[0]?.url || '').trim();
}

async function fetchAndResizePhoto(photoUrl) {
  try {
    if (!photoUrl) return '';
    // Google photo URLs (lh3.googleusercontent.com) are self-authenticating —
    // the token is embedded in the URL path. Sending an Authorization header
    // triggers a CORS preflight that Google's image CDN doesn't handle,
    // causing every fetch to fail silently. Fetch without auth headers.
    let res = await fetch(photoUrl);
    if (!res.ok) {
      // Fallback: try with auth in case the URL requires it
      const token = getAccessToken();
      if (token) {
        res = await fetch(photoUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (!res.ok) return '';
    }
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, size, size);
    bitmap.close();
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch {
    return '';
  }
}

function randomPersonColor() {
  const palette = ['#4A90A4', '#6B8E5A', '#E5533D', '#C4943D', '#7C6B8E', '#6366F1', '#0EA5E9'];
  return palette[Math.floor(Math.random() * palette.length)];
}

function ensurePersonId() {
  return `person_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function mergeGoogleContactsIntoPeople(contacts) {
  if (!Array.isArray(contacts) || contacts.length === 0) return { changed: 0, peopleNeedingPhotos: [] };
  let changed = 0;
  const peopleNeedingPhotos = [];

  for (const contact of contacts) {
    const deleted = !!contact?.metadata?.deleted;
    const resourceName = String(contact?.resourceName || '').trim();
    const name = pickPrimaryName(contact);
    const email = pickPrimaryEmail(contact);
    const jobTitle = pickPrimaryJobTitle(contact);
    const photoUrl = pickPrimaryPhotoUrl(contact);
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
      const nextJobTitle = jobTitle || existing.jobTitle || '';
      const needsUpdate = (
        existing.name !== nextName ||
        String(existing.email || '') !== String(nextEmail || '') ||
        String(existing.jobTitle || '') !== String(nextJobTitle || '') ||
        String(existing.googleContactId || '') !== resourceName
      );
      if (needsUpdate) {
        existing.name = nextName;
        existing.email = String(nextEmail || '').trim();
        existing.jobTitle = String(nextJobTitle || '').trim();
        existing.googleContactId = resourceName;
        existing.updatedAt = new Date().toISOString();
        changed++;
      }
      // Track photo update if source URL changed OR previous fetch failed (photoData empty)
      if (photoUrl) {
        const urlChanged = String(existing.photoUrl || '') !== photoUrl;
        if (urlChanged) existing.photoUrl = photoUrl;
        if (urlChanged || !existing.photoData) {
          peopleNeedingPhotos.push(existing);
        }
      }
      continue;
    }

    // Skip nameless and emailless entries.
    if (!name && !email) continue;

    const newPerson = {
      id: ensurePersonId(),
      name: name || email,
      email: String(email || '').trim(),
      jobTitle: String(jobTitle || '').trim(),
      color: randomPersonColor(),
      googleContactId: resourceName,
      photoUrl: photoUrl,
      photoData: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.taskPeople.push(newPerson);
    if (photoUrl) peopleNeedingPhotos.push(newPerson);
    changed++;
  }

  return { changed, peopleNeedingPhotos };
}

async function fetchConnectionsPage({ pageToken = '', syncToken = '', requestSyncToken = false } = {}) {
  const token = getAccessToken();
  if (!token) return null;

  const params = new URLSearchParams({
    personFields: 'names,emailAddresses,organizations,metadata,photos',
    pageSize: '1000',
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
    let insufficientScope = false;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
      const reasons = Array.isArray(body?.error?.errors) ? body.error.errors.map(e => String(e?.reason || '').toLowerCase()) : [];
      insufficientScope = reasons.includes('insufficientpermissions') || /insufficient authentication scopes/i.test(String(body?.error?.message || ''));
    } catch { /* ignore */ }
    if (res.status === 403 && insufficientScope) {
      return { insufficientScope: true, error: message };
    }
    return { error: message };
  }

  return res.json();
}

async function fetchOtherContactsPage(pageToken = '') {
  const token = getAccessToken();
  if (!token) return null;

  const params = new URLSearchParams({
    readMask: 'names,emailAddresses,photos,metadata',
    pageSize: '1000',
  });
  if (pageToken) params.set('pageToken', pageToken);

  const res = await fetch(`${PEOPLE_API}/otherContacts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) return { authExpired: true };
  // 403 likely means missing contacts.other.readonly scope — not fatal
  if (res.status === 403) return { otherContactsUnavailable: true };
  if (!res.ok) return { error: `Other contacts request failed (${res.status})` };

  return res.json();
}

async function fetchPhotosForPeople(people) {
  let fetched = 0;
  for (const person of people) {
    if (!person.photoUrl) continue;
    const data = await fetchAndResizePhoto(person.photoUrl);
    if (data) {
      person.photoData = data;
      person.updatedAt = new Date().toISOString();
      fetched++;
    }
  }
  if (fetched > 0) {
    saveTasksData();
    window.render();
    window.debouncedSaveToGithub?.();
  }
}

export async function syncGoogleContactsNow({ forceFullResync = false } = {}) {
  if (!isGCalConnected()) return false;
  const token = getAccessToken();
  if (!token) return false;

  state.gcontactsSyncing = true;
  state.gcontactsError = null;
  window.render();

  try {
    if (forceFullResync) {
      setContactsSyncToken('');
    }

    let syncToken = getContactsSyncToken();
    let pageToken = '';
    let nextSyncToken = '';
    let allConnections = [];
    let fullResyncAttempted = forceFullResync;

    let scopeRecoveryAttempted = false;
    let authRefreshAttempted = false;

    // ── Fetch "My Contacts" ──
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
        if (!authRefreshAttempted) {
          authRefreshAttempted = true;
          const refreshed = await window.signInWithGoogleCalendar?.({ mode: 'silent' });
          if (refreshed) {
            pageToken = '';
            continue;
          }
        }
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
        if (data.insufficientScope && !scopeRecoveryAttempted) {
          scopeRecoveryAttempted = true;
          const refreshed = await window.signInWithGoogleCalendar?.({ mode: 'silent' });
          if (refreshed) {
            pageToken = '';
            continue;
          }
          state.gcontactsError = 'Google Contacts permission is missing. Please use Reconnect in Google Calendar settings to grant Contacts access.';
          return false;
        }
        state.gcontactsError = data.error;
        return false;
      }

      allConnections = allConnections.concat(Array.isArray(data.connections) ? data.connections : []);
      pageToken = data.nextPageToken || '';
      if (data.nextSyncToken) nextSyncToken = data.nextSyncToken;
      if (!pageToken) break;
    }

    // ── Fetch "Other Contacts" (people interacted with but not saved) ──
    let otherPageToken = '';
    while (true) {
      const other = await fetchOtherContactsPage(otherPageToken);
      if (!other || other.authExpired || other.otherContactsUnavailable || other.error) break;
      allConnections = allConnections.concat(Array.isArray(other.otherContacts) ? other.otherContacts : []);
      otherPageToken = other.nextPageToken || '';
      if (!otherPageToken) break;
    }

    const { changed, peopleNeedingPhotos } = mergeGoogleContactsIntoPeople(allConnections);

    // Also retry photos for existing people who have a URL but no photo data
    for (const person of state.taskPeople) {
      if (person.photoUrl && !person.photoData && !peopleNeedingPhotos.includes(person)) {
        peopleNeedingPhotos.push(person);
      }
    }

    if (changed > 0) {
      saveTasksData();
    }
    if (nextSyncToken) setContactsSyncToken(nextSyncToken);
    setContactsLastSync(Date.now());
    state.gcontactsError = null;

    // Kick off async photo fetching (non-blocking)
    if (peopleNeedingPhotos.length > 0) {
      fetchPhotosForPeople(peopleNeedingPhotos);
    }

    return true;
  } catch (err) {
    state.gcontactsError = err?.message || 'Google Contacts sync failed.';
    return false;
  } finally {
    state.gcontactsSyncing = false;
    window.render();
  }
}

export function forceFullContactsResync() {
  return syncGoogleContactsNow({ forceFullResync: true });
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
