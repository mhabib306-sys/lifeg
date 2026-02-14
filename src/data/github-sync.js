// ============================================================================
// GitHub Sync Module — cloud backup/restore & theme management
// ============================================================================

import { state } from '../state.js';
import { buildEncryptedCredentials, restoreEncryptedCredentials } from './credential-sync.js';
import {
  validateCloudPayload as _validateCloudPayload,
  normalizeDeletedTaskTombstones as _normalizeDeletedTaskTombstones,
  normalizeDeletedEntityTombstones as _normalizeDeletedEntityTombstones,
  mergeCloudAllData as _mergeCloudAllData,
  mergeEntityCollection as _mergeEntityCollection,
  parseTimestamp,
  isObjectRecord,
} from './sync-helpers.js';
import {
  GITHUB_TOKEN_KEY,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_FILE_PATH,
  THEME_KEY,
  COLOR_MODE_KEY,
  DATA_URL,
  STORAGE_KEY,
  WEIGHTS_KEY,
  MAX_SCORES_KEY,
  TASKS_KEY,
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY,
  CATEGORIES_KEY,
  PERSPECTIVES_KEY,
  HOME_WIDGETS_KEY,
  MEETING_NOTES_KEY,
  CONFLICT_NOTIFICATIONS_KEY,
  DELETED_TASK_TOMBSTONES_KEY,
  DELETED_ENTITY_TOMBSTONES_KEY,
  XP_KEY,
  STREAK_KEY,
  ACHIEVEMENTS_KEY,
  CATEGORY_WEIGHTS_KEY,
  TRIGGERS_KEY,
  LAST_UPDATED_KEY,
  GITHUB_SYNC_DIRTY_KEY,
  SYNC_HEALTH_KEY,
  SYNC_SEQUENCE_KEY,
  CLOUD_SCHEMA_VERSION
} from '../constants.js';

// ---------------------------------------------------------------------------
// GitHub Token
// ---------------------------------------------------------------------------

/**
 * Retrieve GitHub PAT from localStorage
 * @returns {string} Token or empty string
 */
export function getGithubToken() {
  return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
}

/**
 * Store GitHub PAT and trigger re-render to update UI
 * @param {string} token - GitHub Personal Access Token
 */
export function setGithubToken(token) {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
  window.render();
}

// ---------------------------------------------------------------------------
// Theme helpers
// ---------------------------------------------------------------------------

/**
 * Get current theme name from localStorage
 * @returns {string} Theme name ('simplebits' or 'things3')
 */
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'things3';
}

/**
 * Set theme, apply to document, and re-render
 * @param {string} themeName - Theme key
 */
export function setTheme(themeName) {
  localStorage.setItem(THEME_KEY, themeName);
  document.documentElement.setAttribute('data-theme', themeName);
  syncThemeColorMeta();
  window.render();
}

/**
 * Apply the stored theme to the document on load
 */
export function applyStoredTheme() {
  const theme = getTheme();
  const mode = getColorMode();
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
  syncThemeColorMeta();
}

// ---------------------------------------------------------------------------
// Color mode (light / dark)
// ---------------------------------------------------------------------------

/**
 * Get the stored color mode
 * @returns {'light'|'dark'} Color mode
 */
export function getColorMode() {
  return localStorage.getItem(COLOR_MODE_KEY) || 'light';
}

/**
 * Set color mode, apply to document, and re-render
 * @param {'light'|'dark'} mode
 */
export function setColorMode(mode) {
  localStorage.setItem(COLOR_MODE_KEY, mode);
  document.documentElement.setAttribute('data-mode', mode);
  syncThemeColorMeta();
  if (typeof window.setStatusBarStyle === 'function') {
    window.setStatusBarStyle(mode === 'dark');
  }
  window.render();
}

/**
 * Toggle between light and dark mode
 */
export function toggleColorMode() {
  setColorMode(getColorMode() === 'light' ? 'dark' : 'light');
}

/**
 * Update the theme-color meta tag to match the active theme's --bg-primary.
 */
function syncThemeColorMeta() {
  requestAnimationFrame(() => {
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && bg) {
      meta.setAttribute('content', bg);
    }
  });
}

/**
 * Get the current computed accent colour value
 * @returns {string} CSS colour string
 */
export function getAccentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
}

/**
 * Get a bundle of commonly-used theme colour values
 * @returns {object} Theme colours
 */
export function getThemeColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    accent: style.getPropertyValue('--accent').trim(),
    accentDark: style.getPropertyValue('--accent-dark').trim(),
    accentLight: style.getPropertyValue('--accent-light').trim(),
    bgPrimary: style.getPropertyValue('--bg-primary').trim(),
    bgSecondary: style.getPropertyValue('--bg-secondary').trim(),
    textPrimary: style.getPropertyValue('--text-primary').trim()
  };
}

// ---------------------------------------------------------------------------
// Fetch with timeout (AbortController)
// ---------------------------------------------------------------------------

/**
 * Wrapper around fetch that aborts after a timeout (default 30s).
 * Prevents sync lock from being held indefinitely on network stalls.
 */
function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// ---------------------------------------------------------------------------
// Deep clone helper (structuredClone with fallback)
// ---------------------------------------------------------------------------

function deepClone(obj) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

// ---------------------------------------------------------------------------
// Sync health tracking
// ---------------------------------------------------------------------------

function recordSyncEvent(type, status, latencyMs = 0, details = '') {
  const event = {
    type,       // 'save' | 'load' | 'merge'
    status,     // 'success' | 'error' | 'skipped'
    timestamp: new Date().toISOString(),
    latencyMs,
    details
  };
  state.syncHealth.recentEvents.unshift(event);
  state.syncHealth.recentEvents = state.syncHealth.recentEvents.slice(0, 20);

  if (type === 'save') {
    state.syncHealth.totalSaves++;
    if (status === 'success') {
      state.syncHealth.successfulSaves++;
      state.syncHealth.lastSaveLatencyMs = latencyMs;
      const n = state.syncHealth.successfulSaves;
      state.syncHealth.avgSaveLatencyMs =
        Math.round(((state.syncHealth.avgSaveLatencyMs * (n - 1)) + latencyMs) / n);
    } else {
      state.syncHealth.failedSaves++;
      state.syncHealth.lastError = { message: details, timestamp: event.timestamp, type };
    }
  } else if (type === 'load') {
    state.syncHealth.totalLoads++;
    if (status === 'success') {
      state.syncHealth.successfulLoads++;
    } else {
      state.syncHealth.failedLoads++;
      state.syncHealth.lastError = { message: details, timestamp: event.timestamp, type };
    }
  }
  try { localStorage.setItem(SYNC_HEALTH_KEY, JSON.stringify(state.syncHealth)); } catch (_) {}
}

export function getSyncHealth() {
  return state.syncHealth;
}

// ---------------------------------------------------------------------------
// Payload integrity — SHA-256 checksum
// ---------------------------------------------------------------------------

async function computeChecksum(jsonString) {
  const encoded = new TextEncoder().encode(jsonString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ---------------------------------------------------------------------------
// Payload validation
// ---------------------------------------------------------------------------

function validateCloudPayload(data) {
  return _validateCloudPayload(data);
}

async function verifyChecksum(cloudData) {
  if (!cloudData._checksum) return true; // Backwards-compatible: old payloads accepted
  const { _checksum, ...rest } = cloudData;
  const jsonForChecksum = JSON.stringify(rest);
  const expected = await computeChecksum(jsonForChecksum);
  return expected === _checksum;
}

function checkSchemaVersion(cloudData) {
  if (cloudData._schemaVersion && cloudData._schemaVersion > CLOUD_SCHEMA_VERSION) {
    console.warn(`Cloud data is schema v${cloudData._schemaVersion}, this app supports v${CLOUD_SCHEMA_VERSION}`);
    updateSyncStatus('error', 'Cloud data is from a newer app version. Please update.');
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Periodic sync
// ---------------------------------------------------------------------------

const GITHUB_SYNC_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
let periodicSyncIntervalId = null;

export function initPeriodicGithubSync() {
  if (periodicSyncIntervalId) clearInterval(periodicSyncIntervalId);
  periodicSyncIntervalId = setInterval(async () => {
    if (!getGithubToken() || !navigator.onLine) return;
    if (state.syncInProgress) return;
    try {
      await loadCloudData();
      if (typeof window.render === 'function') window.render();
    } catch (err) {
      console.warn('Periodic sync failed:', err.message);
    }
  }, GITHUB_SYNC_INTERVAL_MS);
}

export function stopPeriodicGithubSync() {
  if (periodicSyncIntervalId) {
    clearInterval(periodicSyncIntervalId);
    periodicSyncIntervalId = null;
  }
}

// ---------------------------------------------------------------------------
// Sync status indicator
// ---------------------------------------------------------------------------

/**
 * Update the sync status badge in the DOM
 * @param {string} status  - 'idle' | 'syncing' | 'success' | 'error'
 * @param {string} message - Optional tooltip text
 */
export function updateSyncStatus(status, message = '') {
  state.syncStatus = status;
  const indicator = document.getElementById('sync-indicator');
  if (indicator) {
    const colors = {
      idle: 'bg-[var(--text-muted)]',
      syncing: 'bg-[var(--warning)] animate-pulse',
      success: 'bg-[var(--success)]',
      error: 'bg-[var(--danger)]'
    };
    indicator.className = `w-2 h-2 rounded-full ${colors[status]}`;
    indicator.title = message || status;
  }
  if (status === 'success') {
    state.lastSyncTime = new Date();
    setTimeout(() => {
      if (state.syncStatus === 'success') updateSyncStatus('idle');
    }, 3000);
  }
}

// ---------------------------------------------------------------------------
// Pull-merge helper: merge cloud allData into local state before pushing
// ---------------------------------------------------------------------------

/**
 * Merge cloud daily tracking data into state.allData.
 * For each date+category+field: if local is empty/default but cloud has
 * a value, adopt the cloud value. This preserves edits made on other
 * devices without overwriting local changes.
 */
function mergeCloudAllData(cloudAllData) {
  _mergeCloudAllData(state.allData, cloudAllData);
}

// parseTimestamp imported from sync-helpers.js

/**
 * Merge a singleton value (weights, xp, streak, etc.) using _updatedAt timestamps.
 * Only accepts cloud version if its _updatedAt is strictly newer than local.
 * Falls back to accepting cloud if local has no _updatedAt (migration path).
 */
function mergeSingletonIfNewer(stateKey, cloudValue, localStorageKey) {
  if (!cloudValue) return;
  const local = state[stateKey];
  const cloudTs = parseTimestamp(cloudValue?._updatedAt);
  const localTs = parseTimestamp(local?._updatedAt);
  // Accept cloud if: local has no timestamp (migration), or cloud is strictly newer
  if (!localTs || cloudTs > localTs) {
    state[stateKey] = cloudValue;
    localStorage.setItem(localStorageKey, JSON.stringify(cloudValue));
  }
}

function pushConflictNotification(entry) {
  const list = Array.isArray(state.conflictNotifications) ? state.conflictNotifications : [];
  list.unshift({
    id: `conf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  });
  state.conflictNotifications = list.slice(0, 100);
  localStorage.setItem(CONFLICT_NOTIFICATIONS_KEY, JSON.stringify(state.conflictNotifications));
}

export function dismissConflictNotification(id) {
  state.conflictNotifications = (state.conflictNotifications || []).filter(item => item.id !== id);
  localStorage.setItem(CONFLICT_NOTIFICATIONS_KEY, JSON.stringify(state.conflictNotifications));
  window.render();
}

export function clearConflictNotifications() {
  state.conflictNotifications = [];
  localStorage.setItem(CONFLICT_NOTIFICATIONS_KEY, '[]');
  window.render();
}

function mergeMeetingNotesData(cloudMeetingNotes = {}) {
  if (!cloudMeetingNotes || typeof cloudMeetingNotes !== 'object') return;

  const local = state.meetingNotesByEvent && typeof state.meetingNotesByEvent === 'object'
    ? state.meetingNotesByEvent
    : {};
  const merged = { ...local };

  Object.entries(cloudMeetingNotes).forEach(([eventKey, cloudNote]) => {
    if (!cloudNote || typeof cloudNote !== 'object') return;
    const localNote = merged[eventKey];
    if (!localNote) {
      merged[eventKey] = cloudNote;
      return;
    }
    const localTs = parseTimestamp(localNote.updatedAt || localNote.createdAt);
    const cloudTs = parseTimestamp(cloudNote.updatedAt || cloudNote.createdAt);
    if (cloudTs > localTs) merged[eventKey] = cloudNote;
  });

  state.meetingNotesByEvent = merged;
  localStorage.setItem(MEETING_NOTES_KEY, JSON.stringify(merged));
}

// isObjectRecord imported from sync-helpers.js

function normalizeDeletedTaskTombstones(raw) {
  return _normalizeDeletedTaskTombstones(raw);
}

function normalizeDeletedEntityTombstones(raw) {
  return _normalizeDeletedEntityTombstones(raw);
}

function mergeDeletedEntityTombstones(cloudTombstones) {
  const local = normalizeDeletedEntityTombstones(state.deletedEntityTombstones);
  const cloud = normalizeDeletedEntityTombstones(cloudTombstones);
  const merged = { ...local };
  Object.entries(cloud).forEach(([collection, ids]) => {
    const localIds = merged[collection] || {};
    const nextIds = { ...localIds };
    Object.entries(ids).forEach(([id, cloudTs]) => {
      const localTs = parseTimestamp(localIds[id]);
      const remoteTs = parseTimestamp(cloudTs);
      if (remoteTs > localTs) nextIds[id] = cloudTs;
    });
    merged[collection] = nextIds;
  });
  state.deletedEntityTombstones = merged;
  localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(merged));
}

function isEntityDeleted(collection, id) {
  if (!collection || !id) return false;
  const map = state.deletedEntityTombstones && typeof state.deletedEntityTombstones === 'object'
    ? state.deletedEntityTombstones
    : {};
  return !!(map[collection] && map[collection][String(id)]);
}

function pruneDeletedEntitiesFromState() {
  state.taskAreas = (state.taskAreas || []).filter(item => !isEntityDeleted('taskCategories', item?.id));
  localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));

  state.taskCategories = (state.taskCategories || []).filter(item => !isEntityDeleted('categories', item?.id));
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.taskCategories));

  state.taskLabels = (state.taskLabels || []).filter(item => !isEntityDeleted('taskLabels', item?.id));
  localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));

  state.taskPeople = (state.taskPeople || []).filter(item => !isEntityDeleted('taskPeople', item?.id));
  localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));

  state.customPerspectives = (state.customPerspectives || []).filter(item => !isEntityDeleted('customPerspectives', item?.id));
  localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));

  state.homeWidgets = (state.homeWidgets || []).filter(item => !isEntityDeleted('homeWidgets', item?.id));
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));

  state.triggers = (state.triggers || []).filter(item => !isEntityDeleted('triggers', item?.id));
  localStorage.setItem(TRIGGERS_KEY, JSON.stringify(state.triggers));
}

function mergeDeletedTaskTombstones(cloudTombstones) {
  const local = normalizeDeletedTaskTombstones(state.deletedTaskTombstones);
  const cloud = normalizeDeletedTaskTombstones(cloudTombstones);
  const merged = { ...local };
  Object.entries(cloud).forEach(([id, cloudTs]) => {
    const localTs = parseTimestamp(merged[id]);
    const remoteTs = parseTimestamp(cloudTs);
    if (remoteTs > localTs) merged[id] = cloudTs;
  });
  state.deletedTaskTombstones = merged;
  localStorage.setItem(DELETED_TASK_TOMBSTONES_KEY, JSON.stringify(merged));
}

function isTaskDeleted(taskId) {
  if (!taskId) return false;
  const map = state.deletedTaskTombstones && typeof state.deletedTaskTombstones === 'object'
    ? state.deletedTaskTombstones
    : {};
  return !!map[String(taskId)];
}

function pruneDeletedTasksFromState() {
  const before = Array.isArray(state.tasksData) ? state.tasksData.length : 0;
  state.tasksData = (state.tasksData || []).filter(task => !isTaskDeleted(task?.id));
  if (state.tasksData.length !== before) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));
  }
}

function mergeEntityCollection(localItems = [], cloudItems = [], timestampFields = [], collectionType = '') {
  // Wrap the isDeleted check for the shared helper
  const isDeletedFn = collectionType
    ? (id) => isEntityDeleted(collectionType, id)
    : null;

  // Use shared merge logic (handles newest-wins, gap-fill)
  const merged = _mergeEntityCollection(localItems, cloudItems, timestampFields, isDeletedFn);

  // Conflict notifications (specific to github-sync, not in shared helper)
  const localMap = new Map();
  (Array.isArray(localItems) ? localItems : []).forEach(item => {
    if (isObjectRecord(item) && item.id) localMap.set(item.id, item);
  });
  (Array.isArray(cloudItems) ? cloudItems : []).forEach(cloudItem => {
    if (!isObjectRecord(cloudItem) || !cloudItem.id) return;
    const localItem = localMap.get(cloudItem.id);
    if (!localItem) return;
    if (!timestampFields.length) {
      if (JSON.stringify(localItem) !== JSON.stringify(cloudItem)) {
        pushConflictNotification({
          entity: 'collection',
          mode: 'local_wins',
          itemId: String(cloudItem.id),
          reason: 'No timestamp field for deterministic newest-wins merge',
        });
      }
    } else {
      const localTs = parseTimestamp(timestampFields.map(f => localItem[f]).find(Boolean));
      const cloudTs = parseTimestamp(timestampFields.map(f => cloudItem[f]).find(Boolean));
      if (cloudTs === localTs && JSON.stringify(localItem) !== JSON.stringify(cloudItem)) {
        pushConflictNotification({
          entity: 'timestamped_collection',
          mode: 'local_wins_tie',
          itemId: String(cloudItem.id),
          reason: 'Tied timestamps with different payloads',
        });
      }
    }
  });

  return merged;
}

function mergeTaskCollectionsFromCloud(cloudData = {}) {
  mergeDeletedTaskTombstones(cloudData.deletedTaskTombstones);
  mergeDeletedEntityTombstones(cloudData.deletedEntityTombstones);
  pruneDeletedEntitiesFromState();
  pruneDeletedTasksFromState();

  const cloudTasks = Array.isArray(cloudData.tasks)
    ? cloudData.tasks.filter(task => !isTaskDeleted(task?.id))
    : [];
  const mergedTasks = mergeEntityCollection(state.tasksData, cloudTasks, ['updatedAt', 'createdAt'])
    .filter(task => !isTaskDeleted(task?.id));
  state.tasksData = mergedTasks;
  localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));

  const TS = ['updatedAt', 'createdAt'];

  const mergedAreas = mergeEntityCollection(state.taskAreas, cloudData.taskCategories, TS, 'taskCategories');
  state.taskAreas = mergedAreas;
  localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));

  const mergedCategories = mergeEntityCollection(state.taskCategories, cloudData.categories, TS, 'categories');
  state.taskCategories = mergedCategories;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.taskCategories));

  const mergedLabels = mergeEntityCollection(state.taskLabels, cloudData.taskLabels, TS, 'taskLabels');
  state.taskLabels = mergedLabels;
  localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));

  const mergedPeople = mergeEntityCollection(state.taskPeople, cloudData.taskPeople, TS, 'taskPeople');
  state.taskPeople = mergedPeople.map(person => ({
    ...person,
    email: typeof person?.email === 'string' ? person.email : '',
    jobTitle: typeof person?.jobTitle === 'string' ? person.jobTitle : '',
    photoUrl: typeof person?.photoUrl === 'string' ? person.photoUrl : '',
    photoData: typeof person?.photoData === 'string' ? person.photoData : '',
  }));
  localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));

  const mergedPerspectives = mergeEntityCollection(state.customPerspectives, cloudData.customPerspectives, TS, 'customPerspectives');
  state.customPerspectives = mergedPerspectives;
  localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));

  const mergedWidgets = mergeEntityCollection(state.homeWidgets, cloudData.homeWidgets, ['updatedAt', 'createdAt'], 'homeWidgets');
  state.homeWidgets = mergedWidgets;
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));

  // Merge triggers (newest-wins by updatedAt/createdAt)
  if (Array.isArray(cloudData.triggers)) {
    const mergedTriggers = mergeEntityCollection(state.triggers, cloudData.triggers, ['updatedAt', 'createdAt'], 'triggers');
    state.triggers = mergedTriggers;
    localStorage.setItem(TRIGGERS_KEY, JSON.stringify(state.triggers));
  }
}

// ---------------------------------------------------------------------------
// Pre-merge rollback helper
// ---------------------------------------------------------------------------

/**
 * Restore state + localStorage from a pre-merge snapshot.
 * Called when a PUT fails after pull-merge has already mutated state.
 */
function rollbackMerge(snapshot) {
  state.allData = snapshot.allData;
  state.tasksData = snapshot.tasksData;
  state.deletedTaskTombstones = snapshot.deletedTaskTombstones;
  state.deletedEntityTombstones = snapshot.deletedEntityTombstones;
  state.taskAreas = snapshot.taskAreas;
  state.taskCategories = snapshot.taskCategories;
  state.taskLabels = snapshot.taskLabels;
  state.taskPeople = snapshot.taskPeople;
  state.customPerspectives = snapshot.customPerspectives;
  state.homeWidgets = snapshot.homeWidgets;
  state.triggers = snapshot.triggers;
  state.meetingNotesByEvent = snapshot.meetingNotesByEvent;
  state.conflictNotifications = snapshot.conflictNotifications;

  // Restore localStorage to match rolled-back state
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.allData));
  localStorage.setItem(TASKS_KEY, JSON.stringify(snapshot.tasksData));
  localStorage.setItem(DELETED_TASK_TOMBSTONES_KEY, JSON.stringify(snapshot.deletedTaskTombstones));
  localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(snapshot.deletedEntityTombstones));
  localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(snapshot.taskAreas));
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(snapshot.taskCategories));
  localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(snapshot.taskLabels));
  localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(snapshot.taskPeople));
  localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(snapshot.customPerspectives));
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(snapshot.homeWidgets));
  localStorage.setItem(TRIGGERS_KEY, JSON.stringify(snapshot.triggers));
  localStorage.setItem(MEETING_NOTES_KEY, JSON.stringify(snapshot.meetingNotesByEvent));
  localStorage.setItem(CONFLICT_NOTIFICATIONS_KEY, JSON.stringify(snapshot.conflictNotifications));
  console.log('Rolled back pull-merge after PUT failure');
}

// ---------------------------------------------------------------------------
// Save to GitHub
// ---------------------------------------------------------------------------

/**
 * Push all app data to the configured GitHub repo
 * @param {object} [options] - Options
 * @param {boolean} [options.keepalive] - Use keepalive on fetch (for beforeunload)
 * @returns {Promise<boolean>} true on success
 */
export async function saveToGithub(options = {}) {
  const token = getGithubToken();
  if (!token) {
    console.log('No GitHub token configured');
    return false;
  }

  // Sync lock — prevent concurrent save/load operations
  if (state.syncInProgress) {
    state.syncPendingRetry = true;
    return false;
  }
  state.syncInProgress = true;

  updateSyncStatus('syncing', 'Saving to GitHub...');
  const saveStartTime = performance.now();

  // Snapshot state before pull-merge so we can rollback on PUT failure.
  // This prevents cloud merge from silently corrupting local state when
  // the subsequent PUT fails (409 conflict, network error, rate limit).
  let premergeSnapshot = null;

  try {
    // Get current file SHA + content (needed for merge + update)
    const getResponse = await fetchWithTimeout(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      { headers: { 'Authorization': `token ${token}` } }
    );

    let sha = null;

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;

      // Pull-merge: incorporate changes from other devices before pushing.
      // Without this, a push from this device would overwrite edits made
      // on another device (e.g., mobile life score data lost by laptop push).
      try {
        const binString = atob(fileData.content);
        const bytes = Uint8Array.from(binString, char => char.codePointAt(0));
        const cloudJson = new TextDecoder().decode(bytes);
        const cloudData = JSON.parse(cloudJson);

        // Validate cloud payload before merging
        const validationErrors = validateCloudPayload(cloudData);
        if (validationErrors.length > 0) {
          console.warn('Cloud payload validation failed during pull-merge:', validationErrors);
          // Skip merge but continue with push (local data is authoritative)
        } else if (!checkSchemaVersion(cloudData)) {
          // Cloud is from a newer app version — skip merge to prevent data loss
          console.warn('Skipping pull-merge: cloud schema version is newer');
        } else {
          // Verify checksum if present
          const checksumValid = await verifyChecksum(cloudData);
          if (!checksumValid) {
            console.warn('Cloud data checksum mismatch during pull-merge — skipping merge');
          } else {
            // Snapshot state before merge for rollback (single clone operation)
            premergeSnapshot = deepClone({
              allData: state.allData,
              tasksData: state.tasksData,
              deletedTaskTombstones: state.deletedTaskTombstones,
              deletedEntityTombstones: state.deletedEntityTombstones,
              taskAreas: state.taskAreas,
              taskCategories: state.taskCategories,
              taskLabels: state.taskLabels,
              taskPeople: state.taskPeople,
              customPerspectives: state.customPerspectives,
              homeWidgets: state.homeWidgets,
              triggers: state.triggers || [],
              meetingNotesByEvent: state.meetingNotesByEvent || {},
              conflictNotifications: state.conflictNotifications || [],
            });

            if (cloudData?.data) {
              mergeCloudAllData(cloudData.data);
            }
            if (cloudData) {
              mergeTaskCollectionsFromCloud(cloudData);
            }
            if (cloudData?.meetingNotesByEvent) {
              mergeMeetingNotesData(cloudData.meetingNotesByEvent);
            }
          }
        }
      } catch (mergeErr) {
        console.warn('Cloud merge error:', mergeErr.message);
        // Keep premergeSnapshot if it was set — merge may have partially modified state
        // before throwing, so we need the snapshot for rollback on PUT failure
      }
    }

    // Prepare data payload (from potentially-merged state)
    // Increment sequence counter for monotonic ordering
    state.syncSequence++;
    localStorage.setItem(SYNC_SEQUENCE_KEY, state.syncSequence.toString());

    const payload = {
      _schemaVersion: CLOUD_SCHEMA_VERSION,
      _sequence: state.syncSequence,
      lastUpdated: new Date().toISOString(),
      data: state.allData,
      weights: state.WEIGHTS,
      maxScores: state.MAX_SCORES,
      categoryWeights: state.CATEGORY_WEIGHTS,
      tasks: state.tasksData,
      deletedTaskTombstones: normalizeDeletedTaskTombstones(state.deletedTaskTombstones),
      deletedEntityTombstones: normalizeDeletedEntityTombstones(state.deletedEntityTombstones),
      taskCategories: state.taskAreas,
      categories: state.taskCategories,
      taskLabels: state.taskLabels,
      taskPeople: state.taskPeople,
      customPerspectives: state.customPerspectives,
      homeWidgets: state.homeWidgets,
      meetingNotesByEvent: state.meetingNotesByEvent || {},
      triggers: state.triggers || [],
      encryptedCredentials: await buildEncryptedCredentials(),
      xp: state.xp,
      streak: state.streak,
      achievements: state.achievements
    };

    // Add integrity checksum (computed over payload without the checksum field)
    const jsonForChecksum = JSON.stringify(payload);
    payload._checksum = await computeChecksum(jsonForChecksum);

    // Modern UTF-8 safe base64 encoding (compact — no pretty-printing)
    const jsonString = JSON.stringify(payload);
    const payloadSizeKB = Math.round(new TextEncoder().encode(jsonString).byteLength / 1024);
    if (payloadSizeKB > 800) {
      console.warn(`Sync payload ${payloadSizeKB}KB — approaching GitHub API limit (1MB)`);
    }
    const bytes = new TextEncoder().encode(jsonString);
    const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
    const content = btoa(binString);

    // Update file via GitHub API
    const updateResponse = await fetchWithTimeout(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Auto-save: ${new Date().toLocaleString()}`,
          content: content,
          ...(sha ? { sha } : {})
        }),
        keepalive: !!options.keepalive
      }
    );

    if (updateResponse.ok) {
      const saveLatency = Math.round(performance.now() - saveStartTime);
      // PUT succeeded — merged state is now committed, persist to localStorage
      // All keys must mirror rollbackMerge() to prevent state divergence.
      // Wrap in try-catch: if quota exceeded mid-way, dirty flag stays true
      // and partial writes are acceptable (cloud has full state for recovery).
      if (premergeSnapshot) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.allData));
          localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));
          localStorage.setItem(DELETED_TASK_TOMBSTONES_KEY, JSON.stringify(state.deletedTaskTombstones));
          localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(state.deletedEntityTombstones));
          localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.taskCategories));
          localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
          localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
          localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));
          localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
          localStorage.setItem(TRIGGERS_KEY, JSON.stringify(state.triggers));
          localStorage.setItem(MEETING_NOTES_KEY, JSON.stringify(state.meetingNotesByEvent || {}));
          localStorage.setItem(CONFLICT_NOTIFICATIONS_KEY, JSON.stringify(state.conflictNotifications || []));
        } catch (storageErr) {
          console.warn('localStorage quota exceeded during sync persist — cloud has full state, dirty flag preserved:', storageErr.message);
          if (storageErr.name === 'QuotaExceededError') {
            state.quotaExceededError = true;
          }
        }
      }
      state.syncRetryCount = 0; // Reset retry counter on success
      state.syncRateLimited = false;
      // Clear dirty flag AFTER localStorage writes succeed — if a write above
      // threw QuotaExceededError, dirty stays true so next session retries
      state.githubSyncDirty = false;
      localStorage.setItem(GITHUB_SYNC_DIRTY_KEY, 'false');
      // Clear any pending retry timer — this save already succeeded
      if (state.syncRetryTimer) {
        clearTimeout(state.syncRetryTimer);
        state.syncRetryTimer = null;
      }
      recordSyncEvent('save', 'success', saveLatency, `${payloadSizeKB}KB`);
      updateSyncStatus('success', 'Saved to GitHub');
      console.log(`Saved to GitHub (${payloadSizeKB}KB, ${saveLatency}ms)`);
      return true;
    } else {
      // PUT failed — rollback merged state to pre-merge snapshot
      if (premergeSnapshot) {
        rollbackMerge(premergeSnapshot);
      }
      let errorMsg = `HTTP ${updateResponse.status}`;
      try {
        const error = await updateResponse.json();
        errorMsg = error.message || errorMsg;
      } catch (_) { /* response may not be JSON */ }
      if (updateResponse.status === 409) {
        // SHA conflict — another device saved. Let backoff grow naturally
        // to create temporal separation between devices (no reset).
        throw new Error('Conflict: file changed by another device');
      }
      if (updateResponse.status === 401) {
        throw new Error('GitHub token is invalid or expired');
      }
      if (updateResponse.status === 403) {
        state.syncRateLimited = true;
        setTimeout(() => { state.syncRateLimited = false; }, 60000);
        throw new Error('GitHub rate limit exceeded — try again later');
      }
      throw new Error(errorMsg);
    }
  } catch (e) {
    const saveLatency = Math.round(performance.now() - saveStartTime);
    // Rollback merged state on any failure (network error, abort, etc.)
    if (premergeSnapshot) {
      rollbackMerge(premergeSnapshot);
    }
    updateSyncStatus('error', `Sync failed: ${e.message}`);
    console.error('GitHub save failed:', e);
    recordSyncEvent('save', 'error', saveLatency, e.message);

    // Retry with exponential backoff + jitter
    const MAX_RETRIES = 4;
    const MAX_CONFLICT_RETRIES = 6;
    const isConflict = e.message.includes('Conflict');
    const effectiveMax = isConflict ? MAX_CONFLICT_RETRIES : MAX_RETRIES;
    if (state.syncRetryCount < effectiveMax) {
      state.syncRetryCount++;
      const baseDelay = Math.min(2000 * Math.pow(2, state.syncRetryCount), 30000);
      const jitter = Math.random() * baseDelay * 0.5; // 0-50% jitter
      const delay = Math.round(baseDelay + jitter);
      console.log(`Retrying save in ${delay / 1000}s (attempt ${state.syncRetryCount}/${effectiveMax})`);
      // Store timer ID so it can be cancelled if a new save supersedes it
      if (state.syncRetryTimer) clearTimeout(state.syncRetryTimer);
      state.syncRetryTimer = setTimeout(() => {
        state.syncRetryTimer = null;
        saveToGithub().catch(err => console.error('Retry save failed:', err));
      }, delay);
    }
    return false;
  } finally {
    state.syncInProgress = false;
    if (state.syncPendingRetry) {
      state.syncPendingRetry = false;
      debouncedSaveToGithub();
    }
    // Deferred cloud pull: if loadCloudData was blocked during save, run it now
    if (state.cloudPullPending) {
      state.cloudPullPending = false;
      loadCloudData().then(() => {
        if (typeof window.render === 'function') window.render();
      }).catch(() => {});
    }
  }
}

// ---------------------------------------------------------------------------
// Debounced save (waits 2 seconds after last change)
// ---------------------------------------------------------------------------

/**
 * Debounced wrapper around saveToGithub — collapses rapid saves into one
 */
export function debouncedSaveToGithub() {
  // Mark dirty immediately so data survives page close even if save hasn't fired
  state.githubSyncDirty = true;
  localStorage.setItem(GITHUB_SYNC_DIRTY_KEY, 'true');

  if (state.syncDebounceTimer) clearTimeout(state.syncDebounceTimer);
  // Cancel pending retry — this new user-initiated save supersedes it
  if (state.syncRetryTimer) {
    clearTimeout(state.syncRetryTimer);
    state.syncRetryTimer = null;
  }
  // Reset backoff counter on new user action, unless rate-limited
  if (!state.syncRateLimited) {
    state.syncRetryCount = 0;
  }
  state.syncDebounceTimer = setTimeout(() => {
    state.syncDebounceTimer = null;
    saveToGithub().catch(err => console.error('Debounced save failed:', err));
  }, 2000);
}

/**
 * Immediately flush any pending debounced save (for beforeunload/visibilitychange).
 * If the payload is too large for keepalive (>60KB), marks data as dirty
 * for the next session instead of attempting a doomed fetch.
 * @param {object} [options] - Options passed to saveToGithub
 */
export function flushPendingSave(options = {}) {
  if (state.syncDebounceTimer) {
    clearTimeout(state.syncDebounceTimer);
    state.syncDebounceTimer = null;

    // Ensure dirty flag is set so next session knows to sync
    state.githubSyncDirty = true;
    try { localStorage.setItem(GITHUB_SYNC_DIRTY_KEY, 'true'); } catch (_) {}

    // Attempt the save — it may or may not complete before unload
    saveToGithub(options).catch(err => console.error('Flush save failed:', err));
  }
}

// ---------------------------------------------------------------------------
// Load cloud data on startup
// ---------------------------------------------------------------------------

/**
 * Fetch data from GitHub (or static fallback) and merge with local storage
 */
export async function loadCloudData() {
  // Sync lock — prevent concurrent save/load operations
  if (state.syncInProgress) {
    state.cloudPullPending = true; // Will be picked up after current save completes
    return;
  }
  state.syncInProgress = true;

  const token = getGithubToken();

  function shouldUseCloud(cloudUpdated, cloudSequence) {
    const localUpdatedRaw = localStorage.getItem(LAST_UPDATED_KEY);
    if (!cloudUpdated) return false;

    // Prefer sequence counter comparison (immune to clock skew)
    const localSeq = state.syncSequence;
    if (typeof cloudSequence === 'number' && cloudSequence > 0) {
      if (cloudSequence > localSeq) return true;
      if (cloudSequence < localSeq) return false;
      // Equal sequences: fall through to timestamp comparison
    }

    const localUpdated = localUpdatedRaw ? new Date(parseInt(localUpdatedRaw, 10)) : null;
    const cloudDate = new Date(cloudUpdated);
    if (!localUpdated || isNaN(localUpdated.getTime())) return true;
    return cloudDate > localUpdated;
  }

  function mergeLifeData(cloudData) {
    if (!cloudData?.data) return;
    if (shouldUseCloud(cloudData.lastUpdated, cloudData._sequence)) {
      // Cloud is strictly newer — wholesale replace
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData.data));
      state.allData = cloudData.data;
      localStorage.setItem(LAST_UPDATED_KEY, new Date(cloudData.lastUpdated).getTime().toString());
      return;
    }
    // Local is newer or equal — still merge cloud data into local
    // so edits from other devices aren't lost
    mergeCloudAllData(cloudData.data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.allData));
    // Update timestamp so subsequent shouldUseCloud() checks are based on
    // the merged result, not a stale pre-merge timestamp
    localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
  }

  try {
    // Try GitHub API first if token exists
    if (token) {
      const response = await fetchWithTimeout(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        { headers: { 'Authorization': `token ${token}` } }
      );

      if (response.ok) {
        const fileData = await response.json();
        // Modern UTF-8 safe base64 decoding (replaces deprecated escape)
        const binString = atob(fileData.content);
        const bytes = Uint8Array.from(binString, char => char.codePointAt(0));
        const jsonString = new TextDecoder().decode(bytes);
        let cloudData;
        try {
          cloudData = JSON.parse(jsonString);
        } catch (parseError) {
          console.error('Failed to parse cloud data:', parseError);
          updateSyncStatus('error', 'Corrupted cloud data');
          recordSyncEvent('load', 'error', 0, 'JSON parse failed');
          return;
        }

        // Verify integrity checksum
        const checksumValid = await verifyChecksum(cloudData);
        if (!checksumValid) {
          console.error('Cloud data checksum mismatch — possible corruption');
          updateSyncStatus('error', 'Cloud data integrity check failed');
          recordSyncEvent('load', 'error', 0, 'Checksum mismatch');
          return;
        }

        // Check schema version
        if (!checkSchemaVersion(cloudData)) {
          recordSyncEvent('load', 'error', 0, `Schema v${cloudData._schemaVersion} > v${CLOUD_SCHEMA_VERSION}`);
          return;
        }

        // Validate payload structure
        const validationErrors = validateCloudPayload(cloudData);
        if (validationErrors.length > 0) {
          console.error('Cloud payload validation failed:', validationErrors);
          updateSyncStatus('error', 'Cloud data failed validation');
          recordSyncEvent('load', 'error', 0, `Validation: ${validationErrors.join('; ')}`);
          return;
        }

        // Update local sequence if cloud is ahead
        if (typeof cloudData._sequence === 'number' && cloudData._sequence > state.syncSequence) {
          state.syncSequence = cloudData._sequence;
          localStorage.setItem(SYNC_SEQUENCE_KEY, state.syncSequence.toString());
        }

        mergeLifeData(cloudData);
        mergeSingletonIfNewer('WEIGHTS', cloudData.weights, WEIGHTS_KEY);
        mergeSingletonIfNewer('MAX_SCORES', cloudData.maxScores, MAX_SCORES_KEY);
        mergeTaskCollectionsFromCloud(cloudData);
        if (cloudData.meetingNotesByEvent) {
          mergeMeetingNotesData(cloudData.meetingNotesByEvent);
        }
        mergeSingletonIfNewer('CATEGORY_WEIGHTS', cloudData.categoryWeights, CATEGORY_WEIGHTS_KEY);
        mergeSingletonIfNewer('xp', cloudData.xp, XP_KEY);
        mergeSingletonIfNewer('streak', cloudData.streak, STREAK_KEY);
        mergeSingletonIfNewer('achievements', cloudData.achievements, ACHIEVEMENTS_KEY);

        // Restore encrypted credentials (gap-fill: only writes where local is empty)
        if (cloudData.encryptedCredentials) {
          try {
            await restoreEncryptedCredentials(cloudData.encryptedCredentials);
          } catch (e) {
            console.warn('Credential restore skipped:', e.message);
          }
        }

        console.log('Loaded from GitHub');
        recordSyncEvent('load', 'success');
        updateSyncStatus('success', 'Loaded from GitHub');
        return;
      } else if (response.status === 401) {
        updateSyncStatus('error', 'GitHub token invalid or expired');
        console.error('GitHub auth failed (401) — token may be expired');
        recordSyncEvent('load', 'error', 0, 'Auth failed (401)');
        throw Object.assign(new Error('Auth failed'), { status: 401 });
      } else if (response.status === 403) {
        updateSyncStatus('error', 'GitHub rate limit exceeded');
        console.error('GitHub rate limited (403)');
        recordSyncEvent('load', 'error', 0, 'Rate limited (403)');
        throw Object.assign(new Error('Rate limited'), { status: 403 });
      } else if (response.status === 404) {
        console.log('Cloud data file not found — first sync will create it');
      } else {
        throw new Error(`GitHub API returned ${response.status}`);
      }
    }

    // Fallback to static file fetch
    const response = await fetchWithTimeout(DATA_URL + '?t=' + Date.now());
    if (response.ok) {
      const cloudData = await response.json();
      mergeLifeData(cloudData);
      mergeSingletonIfNewer('WEIGHTS', cloudData.weights, WEIGHTS_KEY);
      mergeTaskCollectionsFromCloud(cloudData);
      if (cloudData.meetingNotesByEvent) {
        mergeMeetingNotesData(cloudData.meetingNotesByEvent);
      }
      console.log('Cloud data synced (static file)');
      invalidateScoresCache();
    }
  } catch (e) {
    if (e.name === 'AbortError' || !navigator.onLine) {
      console.log('Offline mode — using local data');
    } else {
      console.error('Cloud load failed:', e.message);
      updateSyncStatus('error', `Load failed: ${e.message}`);
      // Rethrow retryable errors (not auth/rate-limit) so retry wrapper can catch
      if (e.status !== 401 && e.status !== 403) {
        throw e;
      }
    }
  } finally {
    state.syncInProgress = false;
  }
}

/**
 * Load cloud data with retry logic (for startup).
 * Retries up to 3 times with exponential backoff: 2s, 4s, 8s.
 * Does NOT retry on auth errors (401/403) or offline.
 */
export async function loadCloudDataWithRetry(maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await loadCloudData();
      return; // Success or non-throwing exit (offline, 404, etc.)
    } catch (err) {
      // Don't retry auth/rate-limit errors or offline
      if (err?.status === 401 || err?.status === 403) return;
      if (!navigator.onLine || err?.name === 'AbortError') return;

      if (attempt < maxRetries) {
        const delay = 2000 * Math.pow(2, attempt); // 2s, 4s, 8s
        console.log(`Cloud load retry ${attempt + 1}/${maxRetries} in ${delay / 1000}s`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Cloud load failed after', maxRetries, 'retries');
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Internal helper — scores cache invalidation
// ---------------------------------------------------------------------------

function invalidateScoresCache() {
  state.scoresCache.clear();
  state.scoresCacheVersion++;
}
