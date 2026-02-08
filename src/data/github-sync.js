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
  HOME_WIDGETS_KEY
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
  const categories = ['prayers', 'glucose', 'whoop', 'family', 'habits'];

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
      tasks: state.tasksData,
      taskCategories: state.taskCategories,
      taskLabels: state.taskLabels,
      taskPeople: state.taskPeople,
      customPerspectives: state.customPerspectives,
      homeWidgets: state.homeWidgets
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
        if (cloudData.tasks) {
          state.tasksData = cloudData.tasks;
          localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));
        }
        if (cloudData.taskCategories) {
          state.taskCategories = cloudData.taskCategories;
          localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));
        }
        if (cloudData.taskLabels) {
          state.taskLabels = cloudData.taskLabels;
          localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
        }
        if (cloudData.taskPeople) {
          state.taskPeople = cloudData.taskPeople;
          localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
        }
        if (cloudData.customPerspectives) {
          state.customPerspectives = cloudData.customPerspectives;
          localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));
        }
        if (cloudData.homeWidgets) {
          state.homeWidgets = cloudData.homeWidgets;
          localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
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
      const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

      mergeLifeData(cloudData);
      if (cloudData.weights) {
        state.WEIGHTS = cloudData.weights;
        localStorage.setItem(WEIGHTS_KEY, JSON.stringify(state.WEIGHTS));
      }
      if (cloudData.tasks) {
        state.tasksData = cloudData.tasks;
        localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));
      }
      if (cloudData.taskCategories) {
        state.taskCategories = cloudData.taskCategories;
        localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));
      }
      if (cloudData.taskLabels) {
        state.taskLabels = cloudData.taskLabels;
        localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
      }
      if (cloudData.taskPeople) {
        state.taskPeople = cloudData.taskPeople;
        localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
      }
      if (cloudData.customPerspectives) {
        state.customPerspectives = cloudData.customPerspectives;
        localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));
      }
      if (cloudData.homeWidgets) {
        state.homeWidgets = cloudData.homeWidgets;
        localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
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
