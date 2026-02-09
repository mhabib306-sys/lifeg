import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { DELETED_ENTITY_TOMBSTONES_KEY } from '../constants.js';

function ensureEntityTombstones() {
  if (!state.deletedEntityTombstones || typeof state.deletedEntityTombstones !== 'object') {
    state.deletedEntityTombstones = {};
  }
  return state.deletedEntityTombstones;
}

function persistEntityTombstones() {
  localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(state.deletedEntityTombstones || {}));
}

function markPerspectiveDeleted(id) {
  if (!id) return;
  const tombstones = ensureEntityTombstones();
  if (!tombstones.customPerspectives || typeof tombstones.customPerspectives !== 'object') tombstones.customPerspectives = {};
  tombstones.customPerspectives[String(id)] = new Date().toISOString();
  persistEntityTombstones();
}

function clearPerspectiveDeleted(id) {
  if (!id) return;
  const tombstones = ensureEntityTombstones();
  if (tombstones.customPerspectives && tombstones.customPerspectives[String(id)] !== undefined) {
    delete tombstones.customPerspectives[String(id)];
    persistEntityTombstones();
  }
}

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
  clearPerspectiveDeleted(perspective.id);
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
  markPerspectiveDeleted(perspectiveId);
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
      if (p.filter.logic) document.getElementById('perspective-logic').value = p.filter.logic;
      if (p.filter.availability) document.getElementById('perspective-availability').value = p.filter.availability;
      if (p.filter.statusRule) document.getElementById('perspective-status-rule').value = p.filter.statusRule;
      if (p.filter.personId) document.getElementById('perspective-person').value = p.filter.personId;
      if (p.filter.tagMatch) document.getElementById('perspective-tags-mode').value = p.filter.tagMatch;
      if (p.filter.hasDueDate) document.getElementById('perspective-due').checked = true;
      if (p.filter.hasDeferDate) document.getElementById('perspective-defer').checked = true;
      if (p.filter.isRepeating) document.getElementById('perspective-repeat').checked = true;
      if (p.filter.isUntagged) document.getElementById('perspective-untagged').checked = true;
      if (p.filter.inboxOnly) document.getElementById('perspective-inbox').checked = true;
      if (p.filter.dateRange) {
        if (p.filter.dateRange.type) document.getElementById('perspective-range-type').value = p.filter.dateRange.type;
        if (p.filter.dateRange.start) document.getElementById('perspective-range-start').value = p.filter.dateRange.start;
        if (p.filter.dateRange.end) document.getElementById('perspective-range-end').value = p.filter.dateRange.end;
      }
      if (p.filter.searchTerms) document.getElementById('perspective-search').value = p.filter.searchTerms;
      if (p.filter.labelIds) {
        p.filter.labelIds.forEach(lid => {
          const cb = document.querySelector(`.perspective-tag-checkbox[value="${lid}"]`);
          if (cb) cb.checked = true;
        });
      }
    }
  }, 10);
}
