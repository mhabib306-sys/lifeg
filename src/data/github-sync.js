// ============================================================================
// GitHub Sync Module — cloud backup/restore & theme management
// ============================================================================

import { state } from '../state.js';
import { buildEncryptedCredentials, restoreEncryptedCredentials } from './credential-sync.js';
import {
  GITHUB_TOKEN_KEY,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_FILE_PATH,
  THEME_KEY,
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
  LAST_UPDATED_KEY
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
  document.documentElement.setAttribute('data-theme', theme);
  syncThemeColorMeta();
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
      idle: 'bg-charcoal/30',
      syncing: 'bg-amber-400 animate-pulse',
      success: 'bg-green-500',
      error: 'bg-red-500'
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
  const categories = ['prayers', 'glucose', 'whoop', 'libre', 'family', 'habits'];

  function isEmptyVal(v) {
    return v === '' || v === null || v === undefined;
  }

  Object.keys(cloudAllData).forEach(date => {
    if (!state.allData[date]) {
      // Date only exists in cloud — adopt it wholesale
      state.allData[date] = cloudAllData[date];
      return;
    }

    const local = state.allData[date];
    const cloud = cloudAllData[date];

    categories.forEach(cat => {
      if (!cloud[cat]) return;

      if (!local[cat]) {
        // Category only in cloud — adopt it
        local[cat] = cloud[cat];
        return;
      }

      // Per-field merge: cloud fills gaps in local
      Object.keys(cloud[cat]).forEach(field => {
        if (isEmptyVal(local[cat][field]) && !isEmptyVal(cloud[cat][field])) {
          local[cat][field] = cloud[cat][field];
        }
      });
    });
  });
}

function parseTimestamp(value) {
  const ts = value ? new Date(value).getTime() : 0;
  return Number.isFinite(ts) ? ts : 0;
}

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

function isObjectRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeDeletedTaskTombstones(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const now = Date.now();
  const ttlMs = 180 * 24 * 60 * 60 * 1000; // 180 days
  const normalized = {};
  Object.entries(raw).forEach(([id, ts]) => {
    if (!id) return;
    const parsed = parseTimestamp(ts);
    if (!parsed) return;
    if (now - parsed > ttlMs) return;
    normalized[String(id)] = new Date(parsed).toISOString();
  });
  return normalized;
}

function normalizeDeletedEntityTombstones(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  Object.entries(raw).forEach(([collection, ids]) => {
    if (!ids || typeof ids !== 'object') return;
    out[collection] = normalizeDeletedTaskTombstones(ids);
  });
  return out;
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
  const localList = Array.isArray(localItems) ? localItems : [];
  const cloudList = Array.isArray(cloudItems) ? cloudItems.filter(item => !isEntityDeleted(collectionType, item?.id)) : [];
  const byId = new Map();

  localList.forEach(item => {
    if (isObjectRecord(item) && item.id && !isEntityDeleted(collectionType, item.id)) byId.set(item.id, item);
  });

  cloudList.forEach(cloudItem => {
    if (!isObjectRecord(cloudItem) || !cloudItem.id) return;
    const localItem = byId.get(cloudItem.id);
    if (!localItem) {
      byId.set(cloudItem.id, cloudItem);
      return;
    }
    if (!timestampFields.length) {
      if (JSON.stringify(localItem) !== JSON.stringify(cloudItem)) {
        pushConflictNotification({
          entity: 'collection',
          mode: 'local_wins',
          itemId: String(cloudItem.id),
          reason: 'No timestamp field for deterministic newest-wins merge',
        });
      }
      return; // Keep local on conflict when no timestamp exists.
    }
    const localTs = parseTimestamp(timestampFields.map(field => localItem[field]).find(Boolean));
    const cloudTs = parseTimestamp(timestampFields.map(field => cloudItem[field]).find(Boolean));
    if (cloudTs > localTs) byId.set(cloudItem.id, cloudItem);
    else if (cloudTs === localTs && JSON.stringify(localItem) !== JSON.stringify(cloudItem)) {
      pushConflictNotification({
        entity: 'timestamped_collection',
        mode: 'local_wins_tie',
        itemId: String(cloudItem.id),
        reason: 'Tied timestamps with different payloads',
      });
    }
  });

  localList.forEach(item => {
    if (!isObjectRecord(item) || !item.id || byId.has(item.id)) return;
    byId.set(item.id, item);
  });

  return Array.from(byId.values());
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

        // Deep-clone state properties that merge will mutate
        premergeSnapshot = {
          allData: JSON.parse(JSON.stringify(state.allData)),
          tasksData: JSON.parse(JSON.stringify(state.tasksData)),
          deletedTaskTombstones: JSON.parse(JSON.stringify(state.deletedTaskTombstones)),
          deletedEntityTombstones: JSON.parse(JSON.stringify(state.deletedEntityTombstones)),
          taskAreas: JSON.parse(JSON.stringify(state.taskAreas)),
          taskCategories: JSON.parse(JSON.stringify(state.taskCategories)),
          taskLabels: JSON.parse(JSON.stringify(state.taskLabels)),
          taskPeople: JSON.parse(JSON.stringify(state.taskPeople)),
          customPerspectives: JSON.parse(JSON.stringify(state.customPerspectives)),
          homeWidgets: JSON.parse(JSON.stringify(state.homeWidgets)),
          triggers: JSON.parse(JSON.stringify(state.triggers || [])),
          meetingNotesByEvent: JSON.parse(JSON.stringify(state.meetingNotesByEvent || {})),
          conflictNotifications: JSON.parse(JSON.stringify(state.conflictNotifications || [])),
        };

        if (cloudData?.data) {
          mergeCloudAllData(cloudData.data);
        }
        if (cloudData) {
          mergeTaskCollectionsFromCloud(cloudData);
        }
        if (cloudData?.meetingNotesByEvent) {
          mergeMeetingNotesData(cloudData.meetingNotesByEvent);
        }
      } catch (mergeErr) {
        console.warn('Cloud merge skipped:', mergeErr.message);
        premergeSnapshot = null; // No merge happened, nothing to rollback
      }
    }

    // Prepare data payload (from potentially-merged state)
    const payload = {
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

    // Modern UTF-8 safe base64 encoding (replaces deprecated unescape)
    const jsonString = JSON.stringify(payload, null, 2);
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
      // PUT succeeded — merged state is now committed, persist to localStorage
      if (premergeSnapshot) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.allData));
        localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));
        localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.taskCategories));
        localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
        localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
        localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));
        localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
        localStorage.setItem(TRIGGERS_KEY, JSON.stringify(state.triggers));
        localStorage.setItem(MEETING_NOTES_KEY, JSON.stringify(state.meetingNotesByEvent || {}));
      }
      state.syncRetryCount = 0; // Reset retry counter on success
      // Clear any pending retry timer — this save already succeeded
      if (state.syncRetryTimer) {
        clearTimeout(state.syncRetryTimer);
        state.syncRetryTimer = null;
      }
      updateSyncStatus('success', 'Saved to GitHub');
      console.log('Saved to GitHub');
      return true;
    } else {
      // PUT failed — rollback merged state to pre-merge snapshot
      if (premergeSnapshot) {
        rollbackMerge(premergeSnapshot);
      }
      const error = await updateResponse.json();
      throw new Error(error.message || 'Failed to save');
    }
  } catch (e) {
    // Rollback merged state on any failure (network error, abort, etc.)
    if (premergeSnapshot) {
      rollbackMerge(premergeSnapshot);
    }
    updateSyncStatus('error', `Sync failed: ${e.message}`);
    console.error('GitHub save failed:', e);

    // Retry with exponential backoff (max 4 retries: 4s, 8s, 16s, 30s)
    const MAX_RETRIES = 4;
    if (state.syncRetryCount < MAX_RETRIES) {
      state.syncRetryCount++;
      const delay = Math.min(2000 * Math.pow(2, state.syncRetryCount), 30000);
      console.log(`Retrying save in ${delay / 1000}s (attempt ${state.syncRetryCount}/${MAX_RETRIES})`);
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
  if (state.syncDebounceTimer) clearTimeout(state.syncDebounceTimer);
  // Cancel pending retry — this new user-initiated save supersedes it
  if (state.syncRetryTimer) {
    clearTimeout(state.syncRetryTimer);
    state.syncRetryTimer = null;
  }
  state.syncDebounceTimer = setTimeout(() => {
    state.syncDebounceTimer = null;
    saveToGithub().catch(err => console.error('Debounced save failed:', err));
  }, 2000);
}

/**
 * Immediately flush any pending debounced save (for beforeunload/visibilitychange).
 * @param {object} [options] - Options passed to saveToGithub
 */
export function flushPendingSave(options = {}) {
  if (state.syncDebounceTimer) {
    clearTimeout(state.syncDebounceTimer);
    state.syncDebounceTimer = null;
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

  function shouldUseCloud(cloudUpdated) {
    const localUpdatedRaw = localStorage.getItem(LAST_UPDATED_KEY);
    if (!cloudUpdated) return false;
    const localUpdated = localUpdatedRaw ? new Date(parseInt(localUpdatedRaw, 10)) : null;
    const cloudDate = new Date(cloudUpdated);
    if (!localUpdated || isNaN(localUpdated.getTime())) return true;
    return cloudDate > localUpdated;
  }

  function mergeLifeData(cloudData) {
    if (!cloudData?.data) return;
    if (shouldUseCloud(cloudData.lastUpdated)) {
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
          return;
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
        // Triggers are now properly merged inside mergeTaskCollectionsFromCloud() above

        // Restore encrypted credentials (gap-fill: only writes where local is empty)
        if (cloudData.encryptedCredentials) {
          try {
            await restoreEncryptedCredentials(cloudData.encryptedCredentials);
          } catch (e) {
            console.warn('Credential restore skipped:', e.message);
          }
        }

        console.log('Loaded from GitHub');
        updateSyncStatus('success', 'Loaded from GitHub');
        return;
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
    console.log('Offline mode - using local data');
  } finally {
    state.syncInProgress = false;
  }
}

// ---------------------------------------------------------------------------
// Internal helper — scores cache invalidation
// ---------------------------------------------------------------------------

function invalidateScoresCache() {
  state.scoresCache.clear();
  state.scoresCacheVersion++;
}
