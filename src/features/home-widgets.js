// ============================================================================
// HOME WIDGETS FEATURE MODULE
// ============================================================================
// Widget management functions: visibility, sizing, ordering, drag-and-drop,
// reset, and edit mode toggling.

import { state } from '../state.js';
import { HOME_WIDGETS_KEY, DEFAULT_HOME_WIDGETS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, DELETED_ENTITY_TOMBSTONES_KEY } from '../constants.js';

function ensureEntityTombstones() {
  if (!state.deletedEntityTombstones || typeof state.deletedEntityTombstones !== 'object') {
    state.deletedEntityTombstones = {};
  }
  return state.deletedEntityTombstones;
}

function persistEntityTombstones() {
  localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(state.deletedEntityTombstones || {}));
}

function markWidgetDeleted(id) {
  if (!id) return;
  const tombstones = ensureEntityTombstones();
  if (!tombstones.homeWidgets || typeof tombstones.homeWidgets !== 'object') tombstones.homeWidgets = {};
  tombstones.homeWidgets[String(id)] = new Date().toISOString();
  persistEntityTombstones();
}

function clearWidgetDeleted(id) {
  if (!id) return;
  const tombstones = ensureEntityTombstones();
  if (tombstones.homeWidgets && tombstones.homeWidgets[String(id)] !== undefined) {
    delete tombstones.homeWidgets[String(id)];
    persistEntityTombstones();
  }
}

// ---- Persistence ----

export function saveHomeWidgets() {
  localStorage.setItem(HOME_WIDGETS_KEY, JSON.stringify(state.homeWidgets));
  if (typeof window.debouncedSaveToGithub === 'function') {
    window.debouncedSaveToGithub();
  }
}

// ---- Integrity / Migration ----

export function ensureHomeWidgets() {
  const defaultsById = new Map(DEFAULT_HOME_WIDGETS.map(w => [w.id, w]));
  const existingById = new Map((state.homeWidgets || []).map(w => [w.id, w]));

  const merged = [];
  DEFAULT_HOME_WIDGETS.forEach((def, idx) => {
    const existing = existingById.get(def.id);
    merged.push({
      ...def,
      ...existing,
      visible: existing?.visible ?? def.visible,
      order: existing?.order ?? idx
    });
  });

  // Preserve any unknown/custom widgets (except legacy daily-entry)
  (state.homeWidgets || []).forEach((w) => {
    if (!defaultsById.has(w.id) && w.id !== 'daily-entry') merged.push(w);
  });

  // Normalize order
  merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  merged.forEach((w, i) => { w.order = i; });

  state.homeWidgets = merged;
  saveHomeWidgets();
}

// ---- Visibility & Sizing ----

export function toggleWidgetVisibility(widgetId) {
  const widget = state.homeWidgets.find(w => w.id === widgetId);
  if (widget) {
    if ((widget.id === 'today-tasks' || widget.id === 'todays-score') && widget.visible) {
      return;
    }
    widget.visible = !widget.visible;
    saveHomeWidgets();
    window.render();
  }
}

export function toggleWidgetSize(widgetId) {
  const widget = state.homeWidgets.find(w => w.id === widgetId);
  if (widget) {
    // Toggle between full and half width
    widget.size = widget.size === 'full' ? 'half' : 'full';
    saveHomeWidgets();
    window.render();
  }
}

// ---- Ordering ----

export function moveWidgetUp(widgetId) {
  const idx = state.homeWidgets.findIndex(w => w.id === widgetId);
  if (idx > 0) {
    [state.homeWidgets[idx], state.homeWidgets[idx - 1]] = [state.homeWidgets[idx - 1], state.homeWidgets[idx]];
    // Update order numbers
    state.homeWidgets.forEach((w, i) => w.order = i);
    saveHomeWidgets();
    window.render();
  }
}

export function moveWidgetDown(widgetId) {
  const idx = state.homeWidgets.findIndex(w => w.id === widgetId);
  if (idx < state.homeWidgets.length - 1) {
    [state.homeWidgets[idx], state.homeWidgets[idx + 1]] = [state.homeWidgets[idx + 1], state.homeWidgets[idx]];
    // Update order numbers
    state.homeWidgets.forEach((w, i) => w.order = i);
    saveHomeWidgets();
    window.render();
  }
}

// ---- Drag and Drop ----

export function handleWidgetDragStart(event, widgetId) {
  state.draggingWidgetId = widgetId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', widgetId);
  event.target.classList.add('dragging');
}

export function handleWidgetDragEnd(event) {
  event.target.classList.remove('dragging');
  document.querySelectorAll('.widget').forEach(el => el.classList.remove('drag-over'));
  state.draggingWidgetId = null;
}

export function handleWidgetDragOver(event, targetWidgetId) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  if (!state.draggingWidgetId || state.draggingWidgetId === targetWidgetId) return;

  // Clear all drag-over states first
  document.querySelectorAll('.widget').forEach(el => el.classList.remove('drag-over'));
  // Add to current target
  event.currentTarget.classList.add('drag-over');
}

export function handleWidgetDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    event.currentTarget.classList.remove('drag-over');
  }
}

export function handleWidgetDrop(event, targetWidgetId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  if (!state.draggingWidgetId || state.draggingWidgetId === targetWidgetId) {
    state.draggingWidgetId = null;
    return;
  }

  const dragIdx = state.homeWidgets.findIndex(w => w.id === state.draggingWidgetId);
  const targetIdx = state.homeWidgets.findIndex(w => w.id === targetWidgetId);

  if (dragIdx !== -1 && targetIdx !== -1) {
    // Swap positions
    const [draggedWidget] = state.homeWidgets.splice(dragIdx, 1);
    state.homeWidgets.splice(targetIdx, 0, draggedWidget);
    state.homeWidgets.forEach((w, i) => w.order = i);
    saveHomeWidgets();
    window.render();
  }

  state.draggingWidgetId = null;
}

// ---- Reset & Edit Mode ----

export function resetHomeWidgets() {
  // Reset to default without confirmation for better UX
  state.homeWidgets = JSON.parse(JSON.stringify(DEFAULT_HOME_WIDGETS));
  localStorage.removeItem(HOME_WIDGETS_KEY);
  saveHomeWidgets();
  window.render();
}

export function toggleEditHomeWidgets() {
  state.editingHomeWidgets = !state.editingHomeWidgets;
  if (!state.editingHomeWidgets) state.showAddWidgetPicker = false;
  window.render();
}

// ---- Perspective Widgets ----

export function addPerspectiveWidget(perspectiveId) {
  // Guard against duplicates
  if (state.homeWidgets.some(w => w.id === 'perspective-' + perspectiveId)) return;

  // Look up perspective
  const allPerspectives = [...BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, ...(state.customPerspectives || [])];
  const perspective = allPerspectives.find(p => p.id === perspectiveId);
  if (!perspective) return;

  const maxOrder = state.homeWidgets.reduce((max, w) => Math.max(max, w.order ?? 0), -1);
  state.homeWidgets.push({
    id: 'perspective-' + perspectiveId,
    type: 'perspective',
    title: perspective.name,
    perspectiveId: perspectiveId,
    size: 'half',
    order: maxOrder + 1,
    visible: true
  });
  clearWidgetDeleted('perspective-' + perspectiveId);

  saveHomeWidgets();
  state.showAddWidgetPicker = false;
  window.render();
}

export function removePerspectiveWidget(widgetId) {
  markWidgetDeleted(widgetId);
  state.homeWidgets = state.homeWidgets.filter(w => w.id !== widgetId);
  // Re-normalize order
  state.homeWidgets.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  state.homeWidgets.forEach((w, i) => { w.order = i; });
  saveHomeWidgets();
  window.render();
}
