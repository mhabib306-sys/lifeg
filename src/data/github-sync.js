// ============================================================================
// GitHub Sync Module — cloud backup/restore & theme management
// ============================================================================

import { state } from '../state.js';
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
  PERSPECTIVES_KEY,
  HOME_WIDGETS_KEY,
  MEETING_NOTES_KEY,
  CONFLICT_NOTIFICATIONS_KEY,
  DELETED_TASK_TOMBSTONES_KEY,
  DELETED_ENTITY_TOMBSTONES_KEY,
  XP_KEY,
  STREAK_KEY,
  ACHIEVEMENTS_KEY,
  CATEGORY_WEIGHTS_KEY
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
  window.render();
}

/**
 * Apply the stored theme to the document on load
 */
export function applyStoredTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
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
  state.taskCategories = (state.taskCategories || []).filter(item => !isEntityDeleted('taskCategories', item?.id));
  localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));

  state.taskLabels = (state.taskLabels || []).filter(item => !isEntityDeleted('taskLabels', item?.id));
  localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));

  state.taskPeople = (state.taskPeople || []).filter(item => !isEntityDeleted('taskPeople', item?.id));
  localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));

  state.customPerspectives = (state.customPerspectives || []).filter(item => !isEntityDeleted('customPerspectives', item?.id));
  localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));

  state.homeWidgets = (state.homeWidgets || []).filter(item => !isEntityDeleted('homeWidgets', item?.id));
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
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

  const mergedCategories = mergeEntityCollection(state.taskCategories, cloudData.taskCategories, [], 'taskCategories');
  state.taskCategories = mergedCategories;
  localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));

  const mergedLabels = mergeEntityCollection(state.taskLabels, cloudData.taskLabels, [], 'taskLabels');
  state.taskLabels = mergedLabels;
  localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));

  const mergedPeople = mergeEntityCollection(state.taskPeople, cloudData.taskPeople, [], 'taskPeople');
  state.taskPeople = mergedPeople.map(person => ({
    ...person,
    email: typeof person?.email === 'string' ? person.email : '',
    jobTitle: typeof person?.jobTitle === 'string' ? person.jobTitle : '',
  }));
  localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));

  const mergedPerspectives = mergeEntityCollection(state.customPerspectives, cloudData.customPerspectives, [], 'customPerspectives');
  state.customPerspectives = mergedPerspectives;
  localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));

  const mergedWidgets = mergeEntityCollection(state.homeWidgets, cloudData.homeWidgets, ['updatedAt', 'createdAt'], 'homeWidgets');
  state.homeWidgets = mergedWidgets;
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
}

// ---------------------------------------------------------------------------
// Save to GitHub
// ---------------------------------------------------------------------------

/**
 * Push all app data to the configured GitHub repo
 * @returns {Promise<boolean>} true on success
 */
export async function saveToGithub() {
  const token = getGithubToken();
  if (!token) {
    console.log('No GitHub token configured');
    return false;
  }

  updateSyncStatus('syncing', 'Saving to GitHub...');

  try {
    // Get current file SHA + content (needed for merge + update)
    const getResponse = await fetch(
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
      }
    }

    // Prepare data payload
    const payload = {
      lastUpdated: new Date().toISOString(),
      data: state.allData,
      weights: state.WEIGHTS,
      maxScores: state.MAX_SCORES,
      categoryWeights: state.CATEGORY_WEIGHTS,
      tasks: state.tasksData,
      deletedTaskTombstones: normalizeDeletedTaskTombstones(state.deletedTaskTombstones),
      deletedEntityTombstones: normalizeDeletedEntityTombstones(state.deletedEntityTombstones),
      taskCategories: state.taskCategories,
      taskLabels: state.taskLabels,
      taskPeople: state.taskPeople,
      customPerspectives: state.customPerspectives,
      homeWidgets: state.homeWidgets,
      meetingNotesByEvent: state.meetingNotesByEvent || {},
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
    const updateResponse = await fetch(
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
          sha: sha
        })
      }
    );

    if (updateResponse.ok) {
      updateSyncStatus('success', 'Saved to GitHub');
      console.log('Saved to GitHub');
      return true;
    } else {
      const error = await updateResponse.json();
      throw new Error(error.message || 'Failed to save');
    }
  } catch (e) {
    updateSyncStatus('error', `Sync failed: ${e.message}`);
    console.error('GitHub save failed:', e);
    return false;
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
  state.syncDebounceTimer = setTimeout(() => {
    saveToGithub().catch(err => console.error('Debounced save failed:', err));
  }, 2000);
}

// ---------------------------------------------------------------------------
// Load cloud data on startup
// ---------------------------------------------------------------------------

/**
 * Fetch data from GitHub (or static fallback) and merge with local storage
 */
export async function loadCloudData() {
  const token = getGithubToken();

  function shouldUseCloud(cloudUpdated) {
    const localUpdatedRaw = localStorage.getItem('lastUpdated');
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
      localStorage.setItem('lastUpdated', new Date(cloudData.lastUpdated).getTime().toString());
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
      const response = await fetch(
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
        if (cloudData.weights) {
          state.WEIGHTS = cloudData.weights;
          localStorage.setItem(WEIGHTS_KEY, JSON.stringify(state.WEIGHTS));
        }
        if (cloudData.maxScores) {
          state.MAX_SCORES = cloudData.maxScores;
          localStorage.setItem(MAX_SCORES_KEY, JSON.stringify(state.MAX_SCORES));
        }
        mergeTaskCollectionsFromCloud(cloudData);
        if (cloudData.meetingNotesByEvent) {
          mergeMeetingNotesData(cloudData.meetingNotesByEvent);
        }
        // Restore gamification data
        if (cloudData.categoryWeights) {
          state.CATEGORY_WEIGHTS = cloudData.categoryWeights;
          localStorage.setItem(CATEGORY_WEIGHTS_KEY, JSON.stringify(state.CATEGORY_WEIGHTS));
        }
        if (cloudData.xp) {
          state.xp = cloudData.xp;
          localStorage.setItem(XP_KEY, JSON.stringify(state.xp));
        }
        if (cloudData.streak) {
          state.streak = cloudData.streak;
          localStorage.setItem(STREAK_KEY, JSON.stringify(state.streak));
        }
        if (cloudData.achievements) {
          state.achievements = cloudData.achievements;
          localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state.achievements));
        }
        console.log('Loaded from GitHub');
        updateSyncStatus('success', 'Loaded from GitHub');
        return;
      }
    }

    // Fallback to static file fetch
    const response = await fetch(DATA_URL + '?t=' + Date.now());
    if (response.ok) {
      const cloudData = await response.json();
      mergeLifeData(cloudData);
      if (cloudData.weights) {
        state.WEIGHTS = cloudData.weights;
        localStorage.setItem(WEIGHTS_KEY, JSON.stringify(state.WEIGHTS));
      }
      mergeTaskCollectionsFromCloud(cloudData);
      if (cloudData.meetingNotesByEvent) {
        mergeMeetingNotesData(cloudData.meetingNotesByEvent);
      }
      console.log('Cloud data synced (static file)');
      invalidateScoresCache();
    }
  } catch (e) {
    console.log('Offline mode - using local data');
  }
}

// ---------------------------------------------------------------------------
// Internal helper — scores cache invalidation
// ---------------------------------------------------------------------------

function invalidateScoresCache() {
  state.scoresCache.clear();
  state.scoresCacheVersion++;
}
