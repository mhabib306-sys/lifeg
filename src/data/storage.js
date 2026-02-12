// ============================================================================
// Storage Module — localStorage persistence functions
// ============================================================================

import { state } from '../state.js';
import {
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
  VIEW_STATE_KEY,
  LAST_UPDATED_KEY,
  COLLAPSED_NOTES_KEY,
  TRIGGERS_KEY,
  defaultDayData
} from '../constants.js';
import { getLocalDateString } from '../utils.js';

// ---------------------------------------------------------------------------
// Safe localStorage helpers (prevent QuotaExceededError crashes)
// ---------------------------------------------------------------------------

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded for key:', key);
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Core persistence
// ---------------------------------------------------------------------------

/**
 * Save allData (daily tracking data) to localStorage
 */
export function saveData() {
  safeLocalStorageSet(STORAGE_KEY, state.allData);
  localStorage.setItem(LAST_UPDATED_KEY, Date.now().toString());
}

/**
 * Get today's tracking data from allData (or a fresh default copy)
 * @returns {object} Today's data object
 */
export function getTodayData() {
  return state.allData[state.currentDate] || JSON.parse(JSON.stringify(defaultDayData));
}

/**
 * Update a single tracking field, persist, sync, and re-render
 * @param {string} category - Data category (e.g. 'prayer', 'diabetes')
 * @param {string} field    - Field name within the category
 * @param {*}      value    - New value to set
 */
export function updateData(category, field, value) {
  const todayData = getTodayData();
  // Ensure category object exists before setting field
  if (!todayData[category]) {
    todayData[category] = {};
  }
  todayData[category][field] = value;
  todayData._lastModified = new Date().toISOString();
  state.allData[state.currentDate] = todayData;
  invalidateScoresCache(); // Clear memoization cache when data changes
  saveData();
  // Process gamification for today
  if (typeof window.processGamification === 'function') {
    const result = window.processGamification(state.currentDate);
    showGamificationToasts(result);
  }
  window.debouncedSaveToGithub(); // Auto-save to GitHub
  window.render();
  // Brief save feedback
  showSaveIndicator();
}

/** Show a brief "Saved" indicator that fades out automatically. */
function showSaveIndicator() {
  let el = document.getElementById('save-indicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'save-indicator';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:6px 14px;border-radius:var(--border-radius,6px);background:var(--bg-card,#fff);border:1px solid var(--border,#e6e6e6);color:var(--text-secondary,#666);font-size:12px;font-weight:500;z-index:9999;opacity:0;transition:opacity 0.2s;pointer-events:none;font-family:var(--font-family,system-ui);box-shadow:var(--shadow-sm,0 1px 2px rgba(0,0,0,0.04))';
    document.body.appendChild(el);
  }
  el.textContent = '\u2713 Saved';
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 1200);
}

/**
 * Save all task-related data to localStorage and trigger cloud sync
 */
export function saveTasksData() {
  safeLocalStorageSet(TASKS_KEY, state.tasksData);
  safeLocalStorageSet(TASK_CATEGORIES_KEY, state.taskAreas);
  safeLocalStorageSet(TASK_LABELS_KEY, state.taskLabels);
  safeLocalStorageSet(TASK_PEOPLE_KEY, state.taskPeople);
  safeLocalStorageSet(CATEGORIES_KEY, state.taskCategories);
  safeLocalStorageSet(PERSPECTIVES_KEY, state.customPerspectives);
  safeLocalStorageSet(TRIGGERS_KEY, state.triggers);
  // NOTE: Do NOT set LAST_UPDATED_KEY here. That key tracks daily tracking
  // data (allData) freshness for shouldUseCloud() in loadCloudData().
  // Task/entity saves must not bump it — otherwise init-time saves
  // (e.g. initializeTaskOrders) make local appear newer than cloud,
  // preventing wholesale cloud data adoption on app startup.
  window.debouncedSaveToGithub();
}

/**
 * Toggle a boolean daily field (e.g. prayer checkboxes)
 * @param {string} category - Data category
 * @param {string} field    - Field name
 */
export function toggleDailyField(category, field) {
  const today = getLocalDateString();
  if (!state.allData[today]) state.allData[today] = {};
  if (!state.allData[today][category]) state.allData[today][category] = {};
  state.allData[today][category][field] = !state.allData[today][category][field];
  state.allData[today]._lastModified = new Date().toISOString();
  invalidateScoresCache();
  saveData();
  if (typeof window.processGamification === 'function') {
    const result = window.processGamification(today);
    showGamificationToasts(result);
  }
  window.debouncedSaveToGithub();
  window.render();
}

/**
 * Update a numeric/text daily field
 * @param {string} category - Data category
 * @param {string} field    - Field name
 * @param {*}      value    - New value (empty string → null)
 */
export function updateDailyField(category, field, value) {
  const today = getLocalDateString();
  if (!state.allData[today]) state.allData[today] = {};
  if (!state.allData[today][category]) state.allData[today][category] = {};
  state.allData[today][category][field] = value === '' ? null : parseFloat(value) || value;
  state.allData[today]._lastModified = new Date().toISOString();
  invalidateScoresCache();
  saveData();
  if (typeof window.processGamification === 'function') {
    const result = window.processGamification(today);
    showGamificationToasts(result);
  }
  window.debouncedSaveToGithub();
  window.render(); // Update UI to reflect score changes
}

/**
 * Persist current view state (active tab, filters, etc.) to localStorage
 */
export function saveViewState() {
  const safePerspective = state.activePerspective === 'calendar' ? 'inbox' : state.activePerspective;
  localStorage.setItem(VIEW_STATE_KEY, JSON.stringify({
    activeTab: state.activeTab,
    activeSubTab: state.activeSubTab,
    activePerspective: safePerspective,
    workspaceContentMode: state.workspaceContentMode || 'both',
    activeFilterType: state.activeFilterType,
    activeAreaFilter: state.activeAreaFilter,
    activeLabelFilter: state.activeLabelFilter,
    activePersonFilter: state.activePersonFilter,
    activeCategoryFilter: state.activeCategoryFilter
  }));
}

/**
 * Save scoring weights to localStorage
 */
export function saveWeights() {
  localStorage.setItem(WEIGHTS_KEY, JSON.stringify(state.WEIGHTS));
}

/**
 * Save max scores to localStorage
 */
export function saveMaxScores() {
  localStorage.setItem(MAX_SCORES_KEY, JSON.stringify(state.MAX_SCORES));
}

/**
 * Save home widget configuration to localStorage
 */
export function saveHomeWidgets() {
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
}

/**
 * Save collapsed notes set to localStorage
 */
export function saveCollapsedNotes() {
  localStorage.setItem(COLLAPSED_NOTES_KEY, JSON.stringify([...state.collapsedNotes]));
}

// ---------------------------------------------------------------------------
// Gamification toast helper
// ---------------------------------------------------------------------------

function showGamificationToasts(result) {
  if (!result) return;
  // Level-up toast (reuse undo toast pattern for celebration)
  if (result.xpResult?.levelUp) {
    const levelInfo = typeof window.getLevelInfo === 'function' ? window.getLevelInfo(state.xp?.total || 0) : null;
    if (levelInfo) {
      state.undoAction = {
        label: `Level Up! Level ${levelInfo.level} \u2014 ${levelInfo.tierIcon} ${levelInfo.tierName}`,
        snapshot: null,
        restoreFn: null
      };
      state.undoTimerRemaining = 5;
      if (state.undoTimerId) clearInterval(state.undoTimerId);
      state.undoTimerId = setInterval(() => {
        state.undoTimerRemaining--;
        if (state.undoTimerRemaining <= 0) {
          clearInterval(state.undoTimerId);
          state.undoAction = null;
          state.undoTimerId = null;
          if (typeof window.render === 'function') window.render();
        }
      }, 1000);
    }
  }
  // Mark achievements as notified
  if (result.newAchievements?.length > 0) {
    result.newAchievements.forEach(achId => {
      if (typeof window.markAchievementNotified === 'function') {
        window.markAchievementNotified(achId);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Scores cache invalidation (local helper used by toggle/update functions)
// ---------------------------------------------------------------------------

function invalidateScoresCache() {
  state.scoresCache.clear();
  state.scoresCacheVersion++;
}
