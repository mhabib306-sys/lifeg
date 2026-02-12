// ============================================================================
// TRIGGERS MODULE — GTD Trigger Lists
// ============================================================================
// Persistent prompts organized by area/category in a hierarchical outliner.
// Mirrors the notes.js architecture but simplified (no inline autocomplete,
// no metadata chips). Stored separately from tasksData to keep task queries clean.

import { state } from '../state.js';
import { generateTaskId, escapeHtml } from '../utils.js';
import { TRIGGERS_KEY, COLLAPSED_TRIGGERS_KEY, THINGS3_ICONS, getActiveIcons } from '../constants.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeLocalStorageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { return false; }
}

function debouncedSaveToGithubSafe() {
  if (typeof window.debouncedSaveToGithub === 'function') window.debouncedSaveToGithub();
}

function persistAndRender(focusId) {
  saveTriggers();
  debouncedSaveToGithubSafe();
  if (typeof window.render === 'function') window.render();
  if (focusId) {
    setTimeout(() => {
      const el = document.querySelector(`[data-trigger-id="${focusId}"] .trigger-input`);
      if (el) { el.focus(); }
    }, 60);
  }
}

function saveTriggers() {
  safeLocalStorageSet(TRIGGERS_KEY, state.triggers);
}

export function saveCollapsedTriggers() {
  safeLocalStorageSet(COLLAPSED_TRIGGERS_KEY, [...state.collapsedTriggers]);
}

// ---------------------------------------------------------------------------
// Ordering
// ---------------------------------------------------------------------------

function compareTriggers(a, b) {
  const oa = a.triggerOrder || 0;
  const ob = b.triggerOrder || 0;
  if (oa !== ob) return oa - ob;
  if (a.createdAt && b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
  return 0;
}

function getNextOrder(siblings) {
  if (!siblings.length) return 1000;
  return Math.max(...siblings.map(s => s.triggerOrder || 0)) + 1000;
}

function getOrderBetween(a, b) {
  if (b === null || b === undefined) return (a || 0) + 1000;
  return Math.round(((a || 0) + b) / 2);
}

// ---------------------------------------------------------------------------
// Hierarchy helpers
// ---------------------------------------------------------------------------

export function getTriggerChildren(triggerId) {
  return state.triggers
    .filter(t => t.parentId === triggerId)
    .sort(compareTriggers);
}

export function triggerHasChildren(triggerId) {
  return state.triggers.some(t => t.parentId === triggerId);
}

function countAllTriggerDescendants(triggerId) {
  let count = 0;
  const children = state.triggers.filter(t => t.parentId === triggerId);
  children.forEach(c => { count++; count += countAllTriggerDescendants(c.id); });
  return count;
}

function isTriggerDescendantOf(triggerId, potentialAncestorId) {
  let current = state.triggers.find(t => t.id === triggerId);
  while (current && current.parentId) {
    if (current.parentId === potentialAncestorId) return true;
    current = state.triggers.find(t => t.id === current.parentId);
  }
  return false;
}

function parseFilter(filter) {
  if (!filter) return { areaId: null, categoryId: null };
  if (typeof filter === 'string') return { areaId: filter, categoryId: null };
  return { areaId: filter.areaId || null, categoryId: filter.categoryId || null };
}

function getCurrentTriggerFilter(trigger) {
  return { areaId: trigger.areaId, categoryId: trigger.categoryId };
}

// ---------------------------------------------------------------------------
// Visible ordered triggers (respects collapse + zoom)
// ---------------------------------------------------------------------------

function getVisibleOrderedTriggers(filter) {
  const { areaId, categoryId } = parseFilter(filter);

  // Build parent→children map
  const childMap = {};
  state.triggers.forEach(t => {
    const pid = t.parentId || '__root__';
    if (!childMap[pid]) childMap[pid] = [];
    childMap[pid].push(t);
  });
  Object.values(childMap).forEach(arr => arr.sort(compareTriggers));

  const result = [];
  const rootId = state.zoomedTriggerId || '__root__';

  function walk(parentId, depth) {
    const children = childMap[parentId] || [];
    children.forEach(t => {
      // Filter by area/category
      if (areaId && t.areaId !== areaId) return;
      if (categoryId && t.categoryId !== categoryId) return;
      // Only show root-level when not zoomed and parentId doesn't match
      if (parentId === '__root__' && t.parentId) return;

      result.push(t);
      if (!state.collapsedTriggers.has(t.id)) {
        walk(t.id, depth + 1);
      }
    });
  }
  walk(rootId, 0);
  return result;
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export function createTrigger(title, options = {}) {
  const trigger = {
    id: 'trigger_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    title: title || '',
    areaId: options.areaId || null,
    categoryId: options.categoryId || null,
    parentId: options.parentId || null,
    indent: options.indent || 0,
    triggerOrder: options.triggerOrder || 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.triggers.push(trigger);
  persistAndRender(trigger.id);
  return trigger;
}

export function createRootTrigger(filter) {
  const { areaId, categoryId } = parseFilter(filter);

  if (state.zoomedTriggerId) {
    return createChildTrigger(state.zoomedTriggerId);
  }

  const siblings = state.triggers
    .filter(t => !t.parentId && (areaId ? t.areaId === areaId : true) && (categoryId ? t.categoryId === categoryId : true))
    .sort(compareTriggers);

  return createTrigger('', {
    areaId,
    categoryId,
    parentId: null,
    indent: 0,
    triggerOrder: getNextOrder(siblings)
  });
}

export function createTriggerAfter(triggerId) {
  const trigger = state.triggers.find(t => t.id === triggerId);
  if (!trigger) return;

  const siblings = state.triggers
    .filter(t => t.parentId === trigger.parentId && t.areaId === trigger.areaId)
    .sort(compareTriggers);

  const idx = siblings.findIndex(s => s.id === triggerId);
  const nextSibling = siblings[idx + 1];
  const newOrder = getOrderBetween(trigger.triggerOrder, nextSibling ? nextSibling.triggerOrder : null);

  return createTrigger('', {
    areaId: trigger.areaId,
    categoryId: trigger.categoryId,
    parentId: trigger.parentId,
    indent: trigger.indent || 0,
    triggerOrder: newOrder
  });
}

export function createChildTrigger(triggerId) {
  const parent = state.triggers.find(t => t.id === triggerId);
  if (!parent) return;

  const children = getTriggerChildren(triggerId);

  // Expand parent if collapsed
  if (state.collapsedTriggers.has(triggerId)) {
    state.collapsedTriggers.delete(triggerId);
    saveCollapsedTriggers();
  }

  return createTrigger('', {
    areaId: parent.areaId,
    categoryId: parent.categoryId,
    parentId: triggerId,
    indent: (parent.indent || 0) + 1,
    triggerOrder: getNextOrder(children)
  });
}

export function updateTrigger(triggerId, updates) {
  const idx = state.triggers.findIndex(t => t.id === triggerId);
  if (idx === -1) return;
  state.triggers[idx] = { ...state.triggers[idx], ...updates, updatedAt: new Date().toISOString() };
  saveTriggers();
  debouncedSaveToGithubSafe();
}

export function deleteTrigger(triggerId, deleteChildren = true) {
  if (deleteChildren) {
    // Recursively delete all descendants
    const toDelete = new Set([triggerId]);
    let changed = true;
    while (changed) {
      changed = false;
      state.triggers.forEach(t => {
        if (t.parentId && toDelete.has(t.parentId) && !toDelete.has(t.id)) {
          toDelete.add(t.id);
          changed = true;
        }
      });
    }
    state.triggers = state.triggers.filter(t => !toDelete.has(t.id));
  } else {
    // Promote children to parent level
    const trigger = state.triggers.find(t => t.id === triggerId);
    if (trigger) {
      state.triggers.forEach(t => {
        if (t.parentId === triggerId) {
          t.parentId = trigger.parentId;
          t.indent = Math.max(0, (t.indent || 0) - 1);
        }
      });
    }
    state.triggers = state.triggers.filter(t => t.id !== triggerId);
  }
  persistAndRender(null);
}

// ---------------------------------------------------------------------------
// Indent / Outdent
// ---------------------------------------------------------------------------

export function indentTrigger(triggerId) {
  const trigger = state.triggers.find(t => t.id === triggerId);
  if (!trigger) return;

  const filter = getCurrentTriggerFilter(trigger);
  const siblings = state.triggers
    .filter(t => t.parentId === trigger.parentId && t.areaId === trigger.areaId)
    .sort(compareTriggers);

  const idx = siblings.findIndex(s => s.id === triggerId);
  if (idx <= 0) return;

  const prev = siblings[idx - 1];
  const maxIndent = 5;
  if ((trigger.indent || 0) >= maxIndent) return;

  const newSiblings = getTriggerChildren(prev.id);
  trigger.parentId = prev.id;
  trigger.indent = (prev.indent || 0) + 1;
  trigger.triggerOrder = getNextOrder(newSiblings);
  trigger.updatedAt = new Date().toISOString();

  if (state.collapsedTriggers.has(prev.id)) {
    state.collapsedTriggers.delete(prev.id);
    saveCollapsedTriggers();
  }

  persistAndRender(triggerId);
}

export function outdentTrigger(triggerId) {
  const trigger = state.triggers.find(t => t.id === triggerId);
  if (!trigger || (trigger.indent || 0) <= 0) return;

  const parent = trigger.parentId ? state.triggers.find(t => t.id === trigger.parentId) : null;
  const newParentId = parent ? parent.parentId || null : null;

  const newSiblings = state.triggers
    .filter(t => t.parentId === newParentId && t.areaId === trigger.areaId)
    .sort(compareTriggers);

  const parentOrder = parent ? (parent.triggerOrder || 0) : 0;
  const nextAfterParent = newSiblings.find(s => (s.triggerOrder || 0) > parentOrder);
  trigger.triggerOrder = getOrderBetween(parentOrder, nextAfterParent ? nextAfterParent.triggerOrder : null);

  trigger.parentId = newParentId;
  trigger.indent = Math.max(0, (trigger.indent || 0) - 1);
  trigger.updatedAt = new Date().toISOString();
  persistAndRender(triggerId);
}

// ---------------------------------------------------------------------------
// Collapse / Zoom
// ---------------------------------------------------------------------------

export function toggleTriggerCollapse(triggerId) {
  if (state.collapsedTriggers.has(triggerId)) {
    state.collapsedTriggers.delete(triggerId);
  } else {
    state.collapsedTriggers.add(triggerId);
  }
  saveCollapsedTriggers();
  if (typeof window.render === 'function') window.render();
}

export function zoomIntoTrigger(triggerId) {
  const trigger = state.triggers.find(t => t.id === triggerId);
  if (!trigger) return;
  // Build breadcrumb
  const bc = [];
  let current = trigger;
  while (current) {
    bc.unshift({ id: current.id, title: current.title || 'Untitled' });
    current = current.parentId ? state.triggers.find(t => t.id === current.parentId) : null;
  }
  state.zoomedTriggerId = triggerId;
  state.triggersBreadcrumb = bc;
  if (typeof window.render === 'function') window.render();
}

export function zoomOutOfTrigger() {
  state.zoomedTriggerId = null;
  state.triggersBreadcrumb = [];
  if (typeof window.render === 'function') window.render();
}

export function navigateToTriggerBreadcrumb(triggerId) {
  if (!triggerId) {
    zoomOutOfTrigger();
    return;
  }
  zoomIntoTrigger(triggerId);
}

// ---------------------------------------------------------------------------
// Keyboard handler for trigger contenteditable
// ---------------------------------------------------------------------------

export function handleTriggerKeydown(event, triggerId) {
  const trigger = state.triggers.find(t => t.id === triggerId);
  if (!trigger) return;

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    createTriggerAfter(triggerId);
    return;
  }

  if (event.key === 'Backspace') {
    const el = event.target;
    const text = el.textContent || '';
    if (text === '') {
      event.preventDefault();
      // Find previous sibling to focus
      const siblings = state.triggers
        .filter(t => t.parentId === trigger.parentId && t.areaId === trigger.areaId)
        .sort(compareTriggers);
      const idx = siblings.findIndex(s => s.id === triggerId);
      const prevId = idx > 0 ? siblings[idx - 1].id : null;
      deleteTrigger(triggerId);
      if (prevId) {
        setTimeout(() => {
          const prev = document.querySelector(`[data-trigger-id="${prevId}"] .trigger-input`);
          if (prev) prev.focus();
        }, 60);
      }
      return;
    }
  }

  // Cmd/Ctrl+Up = collapse trigger (Tana-style)
  if (event.key === 'ArrowUp' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (triggerHasChildren(triggerId) && !state.collapsedTriggers.has(triggerId)) {
      state.collapsedTriggers.add(triggerId);
      saveCollapsedTriggers();
      if (typeof window.render === 'function') window.render();
      setTimeout(() => {
        const el = document.querySelector(`[data-trigger-id="${triggerId}"] .trigger-input`);
        if (el) el.focus();
      }, 30);
    }
    return;
  }

  // Cmd/Ctrl+Down = expand trigger (Tana-style)
  if (event.key === 'ArrowDown' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (triggerHasChildren(triggerId) && state.collapsedTriggers.has(triggerId)) {
      state.collapsedTriggers.delete(triggerId);
      saveCollapsedTriggers();
      if (typeof window.render === 'function') window.render();
      setTimeout(() => {
        const el = document.querySelector(`[data-trigger-id="${triggerId}"] .trigger-input`);
        if (el) el.focus();
      }, 30);
    }
    return;
  }

  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      outdentTrigger(triggerId);
    } else {
      indentTrigger(triggerId);
    }
    return;
  }
}

export function handleTriggerInput(event, triggerId) {
  const text = event.target.textContent || '';
  updateTrigger(triggerId, { title: text });
}

export function handleTriggerBlur(event, triggerId) {
  const trigger = state.triggers.find(t => t.id === triggerId);
  if (!trigger) return;
  const text = event.target.textContent || '';
  if (text === '' && !triggerHasChildren(triggerId)) {
    // Auto-delete empty triggers on blur
    state.triggers = state.triggers.filter(t => t.id !== triggerId);
    saveTriggers();
    debouncedSaveToGithubSafe();
  }
}

// ---------------------------------------------------------------------------
// Drag and Drop
// ---------------------------------------------------------------------------

export function handleTriggerDragStart(event, triggerId) {
  state._draggedTriggerId = triggerId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', triggerId);
  event.target.closest('.trigger-item')?.classList.add('dragging');
}

export function handleTriggerDragEnd(event) {
  state._draggedTriggerId = null;
  document.querySelectorAll('.trigger-item.dragging').forEach(el => el.classList.remove('dragging'));
  document.querySelectorAll('.trigger-item.drag-over-top, .trigger-item.drag-over-bottom, .trigger-item.drag-over-child')
    .forEach(el => { el.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-child'); });
}

export function handleTriggerDragOver(event, triggerId) {
  event.preventDefault();
  if (state._draggedTriggerId === triggerId) return;
  if (isTriggerDescendantOf(triggerId, state._draggedTriggerId)) return;

  const el = event.target.closest('.trigger-item');
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const h = rect.height;

  el.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-child');
  if (y < h * 0.25) el.classList.add('drag-over-top');
  else if (y > h * 0.75) el.classList.add('drag-over-bottom');
  else el.classList.add('drag-over-child');
}

export function handleTriggerDragLeave(event) {
  const el = event.target.closest('.trigger-item');
  if (el) el.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over-child');
}

export function handleTriggerDrop(event) {
  event.preventDefault();
  const targetEl = event.target.closest('.trigger-item');
  if (!targetEl) return;
  const targetId = targetEl.dataset.triggerId;
  const draggedId = state._draggedTriggerId;
  if (!draggedId || draggedId === targetId) return;
  if (isTriggerDescendantOf(targetId, draggedId)) return;

  const rect = targetEl.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const h = rect.height;
  let position = y < h * 0.25 ? 'top' : y > h * 0.75 ? 'bottom' : 'child';

  reorderTriggers(draggedId, targetId, position);
  handleTriggerDragEnd(event);
}

export function reorderTriggers(draggedId, targetId, position) {
  const dragged = state.triggers.find(t => t.id === draggedId);
  const target = state.triggers.find(t => t.id === targetId);
  if (!dragged || !target) return;

  if (position === 'child') {
    const children = getTriggerChildren(targetId);
    dragged.parentId = targetId;
    dragged.indent = (target.indent || 0) + 1;
    dragged.triggerOrder = getNextOrder(children);
    if (state.collapsedTriggers.has(targetId)) {
      state.collapsedTriggers.delete(targetId);
      saveCollapsedTriggers();
    }
  } else {
    dragged.parentId = target.parentId;
    dragged.indent = target.indent || 0;
    dragged.areaId = target.areaId;
    dragged.categoryId = target.categoryId;

    const siblings = state.triggers
      .filter(t => t.parentId === target.parentId && t.id !== draggedId && t.areaId === target.areaId)
      .sort(compareTriggers);
    const tIdx = siblings.findIndex(s => s.id === targetId);

    if (position === 'top') {
      const prev = tIdx > 0 ? siblings[tIdx - 1] : null;
      dragged.triggerOrder = getOrderBetween(prev ? prev.triggerOrder : 0, target.triggerOrder);
    } else {
      const next = tIdx < siblings.length - 1 ? siblings[tIdx + 1] : null;
      dragged.triggerOrder = getOrderBetween(target.triggerOrder, next ? next.triggerOrder : null);
    }
  }

  dragged.updatedAt = new Date().toISOString();
  persistAndRender(null);
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

export function renderTriggersBreadcrumb() {
  if (!state.zoomedTriggerId || state.triggersBreadcrumb.length === 0) return '';
  return `
    <div class="px-4 py-2 flex items-center gap-1.5 text-xs border-b border-[var(--border-light)]">
      <button onclick="navigateToTriggerBreadcrumb(null)" class="text-[var(--accent)] hover:underline">Triggers</button>
      ${state.triggersBreadcrumb.map((bc, i) => `
        <span class="text-[var(--text-muted)]">/</span>
        ${i === state.triggersBreadcrumb.length - 1
          ? `<span class="text-[var(--text-primary)] font-medium">${escapeHtml(bc.title)}</span>`
          : `<button onclick="navigateToTriggerBreadcrumb('${bc.id}')" class="text-[var(--accent)] hover:underline">${escapeHtml(bc.title)}</button>`
        }
      `).join('')}
    </div>
  `;
}

export function renderTriggerItem(trigger) {
  const hasChildren = triggerHasChildren(trigger.id);
  const isCollapsed = state.collapsedTriggers.has(trigger.id);
  const descendantCount = hasChildren && isCollapsed ? countAllTriggerDescendants(trigger.id) : 0;

  const isTouch = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  return `
    <div class="trigger-item ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'trigger-collapsed' : ''}"
      data-trigger-id="${trigger.id}"
      style="--trigger-depth:${trigger.indent || 0};"
      ${!isTouch ? `draggable="true"
      ondragstart="handleTriggerDragStart(event, '${trigger.id}')"
      ondragend="handleTriggerDragEnd(event)"
      ondragover="handleTriggerDragOver(event, '${trigger.id}')"
      ondragleave="handleTriggerDragLeave(event)"
      ondrop="handleTriggerDrop(event)"` : ''}>
      <div class="trigger-row group">
        <button onclick="event.stopPropagation(); ${hasChildren ? `toggleTriggerCollapse('${trigger.id}')` : `createChildTrigger('${trigger.id}')`}"
          class="trigger-bullet ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'collapsed' : ''}"
          title="${hasChildren ? (isCollapsed ? 'Expand' : 'Collapse') : 'Add child'}">
          ${hasChildren ? (isCollapsed
            ? '<span class="trigger-bullet-dot trigger-collapsed-ring"></span>'
            : '<svg class="trigger-bullet-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.23 4.21a.75.75 0 011.06.02l5.25 5.5a.75.75 0 010 1.04l-5.25 5.5a.75.75 0 01-1.08-1.04L11 10.25 6.21 5.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>'
          ) : '<span class="trigger-bullet-dot"></span>'}
        </button>

        <div class="trigger-content-col">
          <div contenteditable="true" class="trigger-input" data-placeholder="What might need attention?"
            onkeydown="handleTriggerKeydown(event, '${trigger.id}')"
            oninput="handleTriggerInput(event, '${trigger.id}')"
            onblur="handleTriggerBlur(event, '${trigger.id}')"
          >${escapeHtml(trigger.title || '')}</div>
        </div>

        ${isCollapsed && descendantCount > 0 ? `
          <span class="trigger-descendant-badge">${descendantCount}</span>
        ` : ''}

        <div class="trigger-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          ${hasChildren ? `
            <button onclick="event.stopPropagation(); zoomIntoTrigger('${trigger.id}')"
              class="trigger-action-btn" title="Zoom in">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          ` : ''}
          <button onclick="event.stopPropagation(); createChildTrigger('${trigger.id}')"
            class="trigger-action-btn" title="Add child">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); deleteTrigger('${trigger.id}')"
            class="trigger-action-btn trigger-action-btn-delete" title="Delete">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderTriggersOutliner(filter = null) {
  const visibleTriggers = getVisibleOrderedTriggers(filter);

  if (visibleTriggers.length === 0 && !state.zoomedTriggerId) {
    return `
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No triggers yet</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Add prompts to spark your GTD review</p>
      </div>
    `;
  }

  if (visibleTriggers.length === 0 && state.zoomedTriggerId) {
    return `
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No sub-triggers</p>
        <p class="text-xs text-[var(--text-muted)]">Press Enter to create one</p>
      </div>
    `;
  }

  return visibleTriggers.map(t => renderTriggerItem(t)).join('');
}

/**
 * Get count of triggers for a given area
 */
export function getTriggerCountForArea(areaId) {
  return state.triggers.filter(t => t.areaId === areaId).length;
}
