import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';

/**
 * Create a new custom perspective and persist it.
 * @param {string} name - Display name for the perspective
 * @param {string} icon - Emoji icon (defaults to pin)
 * @param {object} filter - Filter configuration object
 * @returns {object} The newly created perspective
 */
export function createPerspective(name, icon, filter) {
  const perspective = {
    id: 'custom_' + Date.now(),
    name: name,
    icon: icon || '\uD83D\uDCCC',
    filter: filter,
    builtin: false
  };
  state.customPerspectives.push(perspective);
  saveTasksData();
  return perspective;
}

/**
 * Delete a custom perspective by ID. If the deleted perspective is currently
 * active, switches the active perspective to 'inbox'.
 * @param {string} perspectiveId - ID of the perspective to delete
 */
export function deletePerspective(perspectiveId) {
  state.customPerspectives = state.customPerspectives.filter(p => p.id !== perspectiveId);
  if (state.activePerspective === perspectiveId) state.activePerspective = 'inbox';
  saveTasksData();
}

/**
 * Open the perspective editor modal pre-filled with the given perspective's data.
 * @param {string} perspectiveId - ID of the perspective to edit
 */
export function editCustomPerspective(perspectiveId) {
  state.editingPerspectiveId = perspectiveId;
  state.showPerspectiveModal = true;
  window.render();
  // Pre-fill the form after render
  setTimeout(() => {
    const p = state.customPerspectives.find(cp => cp.id === perspectiveId);
    if (p) {
      document.getElementById('perspective-name').value = p.name;
      document.getElementById('perspective-icon').value = p.icon;
      if (p.filter.categoryId) document.getElementById('perspective-category').value = p.filter.categoryId;
      if (p.filter.status) document.getElementById('perspective-status').value = p.filter.status;
      if (p.filter.hasDueDate) document.getElementById('perspective-due').checked = true;
      if (p.filter.labelIds) {
        p.filter.labelIds.forEach(lid => {
          const cb = document.querySelector(`.perspective-tag-checkbox[value="${lid}"]`);
          if (cb) cb.checked = true;
        });
      }
    }
  }, 10);
}
