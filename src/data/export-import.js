// ============================================================================
// Export / Import Module — JSON data backup & restore
// ============================================================================

import { state } from '../state.js';
import {
  TASKS_KEY,
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY,
  CATEGORIES_KEY,
  PERSPECTIVES_KEY,
  MAX_SCORES_KEY,
  CATEGORY_WEIGHTS_KEY,
  XP_KEY,
  STREAK_KEY,
  ACHIEVEMENTS_KEY,
  HOME_WIDGETS_KEY,
  TRIGGERS_KEY,
  MEETING_NOTES_KEY,
  DELETED_TASK_TOMBSTONES_KEY,
  DELETED_ENTITY_TOMBSTONES_KEY
} from '../constants.js';
import { getLocalDateString } from '../utils.js';
import { saveData, saveWeights } from './storage.js';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/**
 * Export all app data as a downloadable JSON file
 * File name: life-gamification-backup-YYYY-MM-DD.json
 */
export function exportData() {
  const exportObj = {
    data: state.allData,
    weights: state.WEIGHTS,
    maxScores: state.MAX_SCORES,
    categoryWeights: state.CATEGORY_WEIGHTS,
    tasks: state.tasksData,
    taskCategories: state.taskAreas,
    categories: state.taskCategories,
    taskLabels: state.taskLabels,
    taskPeople: state.taskPeople,
    customPerspectives: state.customPerspectives,
    homeWidgets: state.homeWidgets,
    triggers: state.triggers,
    meetingNotesByEvent: state.meetingNotesByEvent || {},
    xp: state.xp,
    streak: state.streak,
    achievements: state.achievements,
    deletedTaskTombstones: state.deletedTaskTombstones || {},
    deletedEntityTombstones: state.deletedEntityTombstones || {},
    lastUpdated: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'life-gamification-backup-' + getLocalDateString() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

/**
 * Validate the structure of imported data to prevent state corruption.
 * Returns an array of error messages (empty = valid).
 */
function validateImportData(imported) {
  const errors = [];
  if (!imported || typeof imported !== 'object') {
    errors.push('File is not a valid JSON object');
    return errors;
  }
  // At least one recognized data key must exist
  const knownKeys = ['data', 'weights', 'tasks', 'taskCategories', 'categories',
    'taskLabels', 'taskPeople', 'customPerspectives', 'homeWidgets', 'triggers',
    'meetingNotesByEvent', 'xp', 'streak', 'achievements', 'maxScores',
    'categoryWeights', 'deletedTaskTombstones', 'deletedEntityTombstones'];
  const hasAnyKey = knownKeys.some(k => imported[k] !== undefined);
  if (!hasAnyKey) {
    errors.push('File does not contain any recognized Homebase data');
    return errors;
  }
  // Type checks for critical fields
  if (imported.data !== undefined && (typeof imported.data !== 'object' || Array.isArray(imported.data))) {
    errors.push('data must be an object (daily tracking entries)');
  }
  if (imported.tasks !== undefined && !Array.isArray(imported.tasks)) {
    errors.push('tasks must be an array');
  }
  if (imported.tasks && Array.isArray(imported.tasks)) {
    const sample = imported.tasks.slice(0, 5);
    sample.forEach((task, i) => {
      if (!task || typeof task !== 'object') errors.push(`tasks[${i}] is not an object`);
      else if (!task.id) errors.push(`tasks[${i}] missing id`);
    });
  }
  if (imported.taskCategories !== undefined && !Array.isArray(imported.taskCategories)) {
    errors.push('taskCategories must be an array');
  }
  if (imported.categories !== undefined && !Array.isArray(imported.categories)) {
    errors.push('categories must be an array');
  }
  if (imported.taskLabels !== undefined && !Array.isArray(imported.taskLabels)) {
    errors.push('taskLabels must be an array');
  }
  if (imported.taskPeople !== undefined && !Array.isArray(imported.taskPeople)) {
    errors.push('taskPeople must be an array');
  }
  return errors;
}

/**
 * Silently create an auto-backup before destructive import.
 * Saves to localStorage so it survives even if import corrupts state.
 */
function createPreImportBackup() {
  const backup = {
    data: state.allData,
    weights: state.WEIGHTS,
    maxScores: state.MAX_SCORES,
    categoryWeights: state.CATEGORY_WEIGHTS,
    tasks: state.tasksData,
    taskCategories: state.taskAreas,
    categories: state.taskCategories,
    taskLabels: state.taskLabels,
    taskPeople: state.taskPeople,
    customPerspectives: state.customPerspectives,
    homeWidgets: state.homeWidgets,
    triggers: state.triggers,
    meetingNotesByEvent: state.meetingNotesByEvent || {},
    xp: state.xp,
    streak: state.streak,
    achievements: state.achievements,
    deletedTaskTombstones: state.deletedTaskTombstones || {},
    deletedEntityTombstones: state.deletedEntityTombstones || {},
    lastUpdated: new Date().toISOString()
  };
  try {
    localStorage.setItem('lifeGamification_preImportBackup', JSON.stringify(backup));
    return true;
  } catch (e) {
    console.warn('Could not create pre-import backup:', e.message);
    return false;
  }
}

/**
 * Import data from a JSON backup file (via file input change event)
 * Shows confirmation dialog, validates data, creates auto-backup before replacing.
 * @param {Event} event - File input change event
 */
export function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);

      // Validate before proceeding
      const validationErrors = validateImportData(imported);
      if (validationErrors.length > 0) {
        alert('Import failed — invalid data:\n\n' + validationErrors.join('\n'));
        return;
      }

      // Build summary for confirmation
      const taskCount = Array.isArray(imported.tasks) ? imported.tasks.length : 0;
      const dateCount = imported.data ? Object.keys(imported.data).length : 0;
      const fileDate = imported.lastUpdated
        ? new Date(imported.lastUpdated).toLocaleDateString()
        : 'unknown';

      const confirmed = confirm(
        `Import backup from ${fileDate}?\n\n` +
        `This will REPLACE your current data:\n` +
        `• ${taskCount} tasks\n` +
        `• ${dateCount} days of tracking data\n\n` +
        `A backup of your current data will be saved automatically.\n` +
        `Continue?`
      );
      if (!confirmed) return;

      // Auto-backup current state before overwriting
      const backupOk = createPreImportBackup();
      if (!backupOk) {
        const proceed = confirm('Warning: Could not create a safety backup (storage may be full).\nContinue import anyway? Data cannot be recovered if something goes wrong.');
        if (!proceed) return;
      }

      if (imported.data) {
        state.allData = imported.data;
        saveData();
      }
      if (imported.weights) {
        state.WEIGHTS = { ...imported.weights, _updatedAt: new Date().toISOString() };
        saveWeights();
      }
      if (imported.maxScores) {
        state.MAX_SCORES = { ...imported.maxScores, _updatedAt: new Date().toISOString() };
        localStorage.setItem(MAX_SCORES_KEY, JSON.stringify(state.MAX_SCORES));
      }
      if (imported.categoryWeights) {
        state.CATEGORY_WEIGHTS = { ...imported.categoryWeights, _updatedAt: new Date().toISOString() };
        localStorage.setItem(CATEGORY_WEIGHTS_KEY, JSON.stringify(state.CATEGORY_WEIGHTS));
      }
      if (imported.xp) {
        state.xp = { ...imported.xp, _updatedAt: new Date().toISOString() };
        localStorage.setItem(XP_KEY, JSON.stringify(state.xp));
      }
      if (imported.streak) {
        state.streak = { ...imported.streak, _updatedAt: new Date().toISOString() };
        localStorage.setItem(STREAK_KEY, JSON.stringify(state.streak));
      }
      if (imported.achievements) {
        state.achievements = { ...imported.achievements, _updatedAt: new Date().toISOString() };
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state.achievements));
      }
      if (imported.tasks) {
        state.tasksData = imported.tasks;
        localStorage.setItem(TASKS_KEY, JSON.stringify(state.tasksData));
      }
      if (imported.taskCategories) {
        state.taskAreas = imported.taskCategories;
        localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));
      }
      if (imported.categories) {
        state.taskCategories = imported.categories;
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(state.taskCategories));
      }
      if (imported.taskLabels) {
        state.taskLabels = imported.taskLabels;
        localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
      }
      if (imported.taskPeople) {
        state.taskPeople = imported.taskPeople.map(person => ({
          ...person,
          email: typeof person?.email === 'string' ? person.email : '',
        }));
        localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
      }
      if (imported.customPerspectives) {
        state.customPerspectives = imported.customPerspectives;
        localStorage.setItem(PERSPECTIVES_KEY, JSON.stringify(state.customPerspectives));
      }
      if (imported.homeWidgets) {
        state.homeWidgets = imported.homeWidgets;
        localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
      }
      if (imported.triggers) {
        state.triggers = imported.triggers;
        localStorage.setItem(TRIGGERS_KEY, JSON.stringify(state.triggers));
      }
      if (imported.meetingNotesByEvent) {
        state.meetingNotesByEvent = imported.meetingNotesByEvent;
        localStorage.setItem(MEETING_NOTES_KEY, JSON.stringify(state.meetingNotesByEvent));
      }
      // Merge tombstones (keep existing + add imported) to prevent deleted items resurrecting
      if (imported.deletedTaskTombstones) {
        state.deletedTaskTombstones = { ...state.deletedTaskTombstones, ...imported.deletedTaskTombstones };
        localStorage.setItem(DELETED_TASK_TOMBSTONES_KEY, JSON.stringify(state.deletedTaskTombstones));
      }
      if (imported.deletedEntityTombstones) {
        const merged = { ...state.deletedEntityTombstones };
        for (const [type, entries] of Object.entries(imported.deletedEntityTombstones)) {
          merged[type] = { ...(merged[type] || {}), ...entries };
        }
        state.deletedEntityTombstones = merged;
        localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(state.deletedEntityTombstones));
      }
      // Invalidate scores cache since tracking data may have changed
      if (typeof window.invalidateScoresCache === 'function') window.invalidateScoresCache();
      alert('Data imported successfully!');
      window.debouncedSaveToGithub();
      window.render();
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  };
  reader.readAsText(file);
}
