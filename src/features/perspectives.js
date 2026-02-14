import { state } from '../state.js';
import { saveTasksData, saveViewState } from '../data/storage.js';
import { ensureEntityTombstones, persistEntityTombstones } from './areas.js';
import { generateEntityId } from '../utils.js';

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
  const now = new Date().toISOString();
  const perspective = {
    id: generateEntityId('custom'),
    name: name,
    icon: icon || '\uD83D\uDCCC',
    filter: filter,
    builtin: false,
    createdAt: now,
    updatedAt: now
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
  if (state.activePerspective === perspectiveId) {
    state.activePerspective = 'inbox';
    saveViewState();
  }
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
  // Pre-fill the form after render. Guard every DOM access — the modal
  // may not be in the DOM yet if render is async or mocked in tests.
  setTimeout(() => {
    const p = state.customPerspectives.find(cp => cp.id === perspectiveId);
    if (!p) return;
    const el = (id) => document.getElementById(id);
    const setVal = (id, v) => { const e = el(id); if (e) e.value = v; };
    const setChecked = (id) => { const e = el(id); if (e) e.checked = true; };

    setVal('perspective-name', p.name);
    setVal('perspective-icon', p.icon);
    if (p.filter.categoryId) setVal('perspective-category', p.filter.categoryId);
    if (p.filter.status) setVal('perspective-status', p.filter.status);
    if (p.filter.logic) setVal('perspective-logic', p.filter.logic);
    if (p.filter.availability) setVal('perspective-availability', p.filter.availability);
    if (p.filter.statusRule) setVal('perspective-status-rule', p.filter.statusRule);
    if (p.filter.personId) setVal('perspective-person', p.filter.personId);
    if (p.filter.tagMatch) setVal('perspective-tags-mode', p.filter.tagMatch);
    if (p.filter.hasDueDate) setChecked('perspective-due');
    if (p.filter.hasDeferDate) setChecked('perspective-defer');
    if (p.filter.isRepeating) setChecked('perspective-repeat');
    if (p.filter.isUntagged) setChecked('perspective-untagged');
    if (p.filter.inboxOnly) setChecked('perspective-inbox');
    if (p.filter.dateRange) {
      if (p.filter.dateRange.type) setVal('perspective-range-type', p.filter.dateRange.type);
      if (p.filter.dateRange.start) setVal('perspective-range-start', p.filter.dateRange.start);
      if (p.filter.dateRange.end) setVal('perspective-range-end', p.filter.dateRange.end);
    }
    if (p.filter.searchTerms) setVal('perspective-search', p.filter.searchTerms);
    if (p.filter.labelIds) {
      p.filter.labelIds.forEach(lid => {
        const cb = document.querySelector(`.perspective-tag-checkbox[value="${lid}"]`);
        if (cb) cb.checked = true;
      });
    }
  }, 10);
}
