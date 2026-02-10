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
  PERSPECTIVES_KEY
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
    tasks: state.tasksData,
    taskCategories: state.taskAreas,
    categories: state.taskCategories,
    taskLabels: state.taskLabels,
    taskPeople: state.taskPeople,
    customPerspectives: state.customPerspectives,
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
        state.WEIGHTS = imported.weights;
        saveWeights();
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
      alert('Data imported successfully!');
      window.debouncedSaveToGithub();
      window.render();
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  };
  reader.readAsText(file);
}
