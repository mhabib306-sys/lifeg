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
  MEETING_NOTES_KEY
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
 * Import data from a JSON backup file (via file input change event)
 * Merges/replaces allData, weights, tasks, categories, labels, people, perspectives
 * @param {Event} event - File input change event
 */
export function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
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
      alert('Data imported successfully!');
      window.debouncedSaveToGithub();
      window.render();
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  };
  reader.readAsText(file);
}
