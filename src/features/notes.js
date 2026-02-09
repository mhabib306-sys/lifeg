import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, escapeHtml, formatSmartDate } from '../utils.js';
import { TASK_CATEGORIES_KEY, TASK_LABELS_KEY, TASK_PEOPLE_KEY } from '../constants.js';
import { startUndoCountdown } from './undo.js';

// ============================================================================
// Note Inline Autocomplete (contenteditable-compatible)
// ============================================================================
// Module-level state for the autocomplete popup (not in state.js to avoid
// global pollution — only one popup can be active at a time).

let noteAcPopup = null;
let noteAcActiveIndex = 0;
let noteAcTriggerChar = null;
let noteAcTriggerPos = -1;
let noteAcNoteId = null;

function debouncedSaveToGithubSafe() {
  if (typeof window.debouncedSaveToGithub === 'function') {
    window.debouncedSaveToGithub();
  }
}

/** Get caret offset in plain-text terms within a contenteditable element. */
function getCaretOffset(el) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return 0;
  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.startContainer, range.startOffset);
  return preRange.toString().length;
}

/** Set caret to a specific offset in plain-text terms within a contenteditable element. */
function setCaretOffset(el, offset) {
  const range = document.createRange();
  const sel = window.getSelection();
  let pos = 0;
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextPos = pos + node.length;
      if (offset <= nextPos) {
        range.setStart(node, offset - pos);
        range.collapse(true);
        return true;
      }
      pos = nextPos;
    } else {
      for (const child of node.childNodes) {
        if (walk(child)) return true;
      }
    }
    return false;
  };
  if (!walk(el)) {
    range.selectNodeContents(el);
    range.collapse(false);
  }
  sel.removeAllRanges();
  sel.addRange(range);
}

function noteAcGetItems(query) {
  const note = noteAcNoteId ? state.tasksData.find(t => t.id === noteAcNoteId && t.isNote) : null;
  if (noteAcTriggerChar === '#') return state.taskCategories;
  if (noteAcTriggerChar === '@') {
    const existing = note?.labels || [];
    return state.taskLabels.filter(l => !existing.includes(l.id));
  }
  if (noteAcTriggerChar === '&') {
    const existing = note?.people || [];
    return state.taskPeople.filter(p => !existing.includes(p.id));
  }
  if (noteAcTriggerChar === '!') {
    // Use parseDateQuery from window (assigned via bridge)
    return typeof window.parseDateQuery === 'function' ? window.parseDateQuery(query || '') : [];
  }
  return [];
}

function noteAcGetCreateFn() {
  if (noteAcTriggerChar === '#') return (name) => {
    const c = { id: 'cat_' + Date.now(), name, color: '#6366f1', icon: '\uD83D\uDCC1' };
    state.taskCategories.push(c);
    localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));
    debouncedSaveToGithubSafe();
    return c;
  };
  if (noteAcTriggerChar === '@') return (name) => {
    const colors = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
    const l = { id: 'label_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)] };
    state.taskLabels.push(l);
    localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
    debouncedSaveToGithubSafe();
    return l;
  };
  if (noteAcTriggerChar === '&') return (name) => {
    const colors = ['#4A90A4','#6B8E5A','#E5533D','#C4943D','#7C6B8E'];
    const p = { id: 'person_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)] };
    state.taskPeople.push(p);
    localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
    debouncedSaveToGithubSafe();
    return p;
  };
  return null;
}

function noteAcSelectItem(item) {
  const note = state.tasksData.find(t => t.id === noteAcNoteId && t.isNote);
  if (!note) { noteAcDismissPopup(); return; }

  const el = document.querySelector(`[data-note-id="${noteAcNoteId}"] .note-input`);
  if (!el) { noteAcDismissPopup(); return; }

  // Remove trigger + query text from contenteditable
  const text = el.textContent || '';
  const caret = getCaretOffset(el);
  const before = text.substring(0, noteAcTriggerPos);
  const after = text.substring(caret);
  const newText = before.trimEnd() + (before.trimEnd() ? ' ' : '') + after.trimStart();
  el.textContent = newText;

  // Restore caret
  const newPos = (before.trimEnd() + (before.trimEnd() ? ' ' : '')).length;
  setCaretOffset(el, newPos);

  // Apply metadata to note
  if (noteAcTriggerChar === '#') {
    note.categoryId = item.id;
  } else if (noteAcTriggerChar === '@') {
    if (!note.labels) note.labels = [];
    if (!note.labels.includes(item.id)) note.labels.push(item.id);
  } else if (noteAcTriggerChar === '&') {
    if (!note.people) note.people = [];
    if (!note.people.includes(item.id)) note.people.push(item.id);
  } else if (noteAcTriggerChar === '!') {
    note.deferDate = item.date;
  }

  note.updatedAt = new Date().toISOString();
  saveTasksData();
  debouncedSaveToGithubSafe();

  noteAcDismissPopup();
  el.focus();

  // Re-render chips (without full render which would lose focus)
  renderNoteMetaChipsDOM(noteAcNoteId || note.id, note);
}

function noteAcDismissPopup() {
  if (noteAcPopup && noteAcPopup.parentNode) noteAcPopup.parentNode.removeChild(noteAcPopup);
  noteAcPopup = null;
  noteAcTriggerChar = null;
  noteAcTriggerPos = -1;
  noteAcActiveIndex = 0;
}

function noteAcRenderPopup(items, query, el) {
  if (!noteAcPopup) {
    noteAcPopup = document.createElement('div');
    noteAcPopup.className = 'inline-autocomplete-popup';
    noteAcPopup.addEventListener('mousedown', (e) => e.preventDefault());
    document.body.appendChild(noteAcPopup);
  }

  const rect = el.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  noteAcPopup.style.left = Math.min(rect.left, window.innerWidth - 310) + 'px';
  noteAcPopup.style.width = Math.min(rect.width + 40, 300) + 'px';
  if (spaceBelow > 240) {
    noteAcPopup.style.top = rect.bottom + 4 + 'px';
    noteAcPopup.style.bottom = 'auto';
  } else {
    noteAcPopup.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
    noteAcPopup.style.top = 'auto';
  }

  const isDate = noteAcTriggerChar === '!';
  const filtered = isDate ? items : items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
  const hasExactMatch = isDate ? true : items.some(i => i.name.toLowerCase() === query.toLowerCase());
  const showCreate = !isDate && query.length > 0 && !hasExactMatch;
  const totalItems = filtered.length + (showCreate ? 1 : 0);

  if (totalItems === 0) { noteAcDismissPopup(); return; }
  if (noteAcActiveIndex >= totalItems) noteAcActiveIndex = totalItems - 1;
  if (noteAcActiveIndex < 0) noteAcActiveIndex = 0;

  const typeLabel = noteAcTriggerChar === '#' ? 'Area' : noteAcTriggerChar === '@' ? 'Tag' : noteAcTriggerChar === '!' ? 'Date' : 'Person';
  let html = '';
  filtered.forEach((item, idx) => {
    const isActive = idx === noteAcActiveIndex ? ' active' : '';
    let icon;
    if (isDate) {
      icon = `<span class="ac-icon" style="background:#8b5cf620;color:#8b5cf6"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>`;
    } else if (noteAcTriggerChar === '#') {
      icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">${item.icon || '\uD83D\uDCC1'}</span>`;
    } else if (noteAcTriggerChar === '@') {
      icon = `<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${item.color}"></span>`;
    } else {
      icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">\uD83D\uDC64</span>`;
    }
    const dateLabel = isDate ? `<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${formatSmartDate(item.date)}</span>` : '';
    html += `<div class="inline-ac-option${isActive}" data-idx="${idx}" style="${isDate ? 'justify-content:space-between' : ''}">${icon}<span>${escapeHtml(item.name)}</span>${dateLabel}</div>`;
  });
  if (showCreate) {
    const createIdx = filtered.length;
    const isActive = noteAcActiveIndex === createIdx ? ' active' : '';
    html += `<div class="inline-ac-create${isActive}" data-idx="${createIdx}">+ Create ${typeLabel} "${escapeHtml(query)}"</div>`;
  }
  noteAcPopup.innerHTML = html;

  noteAcPopup.querySelectorAll('.inline-ac-option').forEach(el => {
    el.addEventListener('click', () => noteAcSelectItem(filtered[parseInt(el.dataset.idx)]));
  });
  const createEl = noteAcPopup.querySelector('.inline-ac-create');
  if (createEl) {
    createEl.addEventListener('click', () => {
      const createFn = noteAcGetCreateFn();
      if (createFn) {
        const newItem = createFn(query);
        noteAcSelectItem(newItem);
      }
    });
  }
}

function noteAcCheckTrigger(el) {
  const text = el.textContent || '';
  const caret = getCaretOffset(el);

  for (let i = caret - 1; i >= 0; i--) {
    const ch = text[i];
    if (ch === '\n') { noteAcDismissPopup(); return; }
    if (ch === ' ') {
      // For ! trigger, allow spaces for multi-word queries like "!next monday"
      for (let j = i - 1; j >= 0; j--) {
        const ch2 = text[j];
        if (ch2 === '\n' || ch2 === '#' || ch2 === '@' || ch2 === '&') break;
        if (ch2 === '!' && (j === 0 || text[j-1] === ' ')) {
          noteAcTriggerChar = '!';
          noteAcTriggerPos = j;
          const query = text.substring(j + 1, caret);
          const items = noteAcGetItems(query);
          noteAcActiveIndex = 0;
          noteAcRenderPopup(items, query, el);
          return;
        }
      }
      noteAcDismissPopup(); return;
    }
    if ((ch === '#' || ch === '@' || ch === '&') && (i === 0 || text[i-1] === ' ')) {
      noteAcTriggerChar = ch;
      noteAcTriggerPos = i;
      const query = text.substring(i + 1, caret);
      const items = noteAcGetItems(query);
      noteAcActiveIndex = 0;
      noteAcRenderPopup(items, query, el);
      return;
    }
    if (ch === '!' && (i === 0 || text[i-1] === ' ')) {
      noteAcTriggerChar = '!';
      noteAcTriggerPos = i;
      const query = text.substring(i + 1, caret);
      const items = noteAcGetItems(query);
      noteAcActiveIndex = 0;
      noteAcRenderPopup(items, query, el);
      return;
    }
  }
  noteAcDismissPopup();
}

/** Called from oninput on contenteditable note inputs. */
export function handleNoteInput(event, noteId) {
  noteAcNoteId = noteId;
  const el = event.target;
  noteAcCheckTrigger(el);
}

/** Update metadata chips DOM without full re-render (preserves focus). */
function renderNoteMetaChipsDOM(noteId, note) {
  const container = document.querySelector(`[data-note-id="${noteId}"] .note-meta-chips`);
  if (!container) return;
  container.innerHTML = buildNoteMetaChipsHtml(note);
}

/** Build HTML for note metadata chips. */
function buildNoteMetaChipsHtml(note) {
  let html = '';
  if (note.categoryId) {
    const cat = state.taskCategories.find(c => c.id === note.categoryId);
    if (cat) {
      html += `<span class="inline-meta-chip" style="background:${cat.color}20;color:${cat.color}">
        ${cat.icon || '\uD83D\uDCC1'} ${escapeHtml(cat.name)}
        <span class="inline-meta-chip-remove" onclick="event.stopPropagation(); removeNoteInlineMeta('${note.id}','category','${cat.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  }
  (note.labels || []).forEach(lid => {
    const label = state.taskLabels.find(l => l.id === lid);
    if (label) {
      html += `<span class="inline-meta-chip" style="background:${label.color}20;color:${label.color}">
        ${escapeHtml(label.name)}
        <span class="inline-meta-chip-remove" onclick="event.stopPropagation(); removeNoteInlineMeta('${note.id}','label','${label.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  });
  (note.people || []).forEach(pid => {
    const person = state.taskPeople.find(p => p.id === pid);
    if (person) {
      html += `<span class="inline-meta-chip" style="background:${person.color}20;color:${person.color}">
        \uD83D\uDC64 ${escapeHtml(person.name)}
        <span class="inline-meta-chip-remove" onclick="event.stopPropagation(); removeNoteInlineMeta('${note.id}','person','${person.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  });
  if (note.deferDate) {
    html += `<span class="inline-meta-chip" style="background:#8b5cf620;color:#8b5cf6">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      ${formatSmartDate(note.deferDate)}
      <span class="inline-meta-chip-remove" onclick="event.stopPropagation(); removeNoteInlineMeta('${note.id}','deferDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`;
  }
  return html;
}

/** Remove a piece of metadata from a note. */
export function removeNoteInlineMeta(noteId, type, id) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote);
  if (!note) return;
  if (type === 'category') note.categoryId = null;
  else if (type === 'label') note.labels = (note.labels || []).filter(l => l !== id);
  else if (type === 'person') note.people = (note.people || []).filter(p => p !== id);
  else if (type === 'deferDate') note.deferDate = null;
  note.updatedAt = new Date().toISOString();
  saveTasksData();
  debouncedSaveToGithubSafe();
  window.render();
}

// ============================================================================
// Ordering & Comparison
// ============================================================================

function compareNotes(a, b) {
  // Prefer explicit noteOrder when available
  if (a.noteOrder != null && b.noteOrder != null) {
    if (a.noteOrder !== b.noteOrder) return a.noteOrder - b.noteOrder;
  } else if (a.noteOrder != null) {
    return -1;
  } else if (b.noteOrder != null) {
    return 1;
  }
  const timeA = new Date(a.createdAt || 0).getTime();
  const timeB = new Date(b.createdAt || 0).getTime();
  if (timeA !== timeB) return timeA - timeB;

  const updatedA = new Date(a.updatedAt || 0).getTime();
  const updatedB = new Date(b.updatedAt || 0).getTime();
  if (updatedA !== updatedB) return updatedA - updatedB;

  return String(a.id).localeCompare(String(b.id));
}

/**
 * One-time migration: assign noteOrder to existing notes preserving current order.
 * Called from main.js on init.
 */
export function initializeNoteOrders() {
  const notes = state.tasksData.filter(t => t.isNote && !t.completed);
  const needsOrder = notes.some(n => n.noteOrder == null);
  if (!needsOrder) return;

  // Group by parent and assign orders
  const byParent = new Map();
  notes.forEach(note => {
    const key = note.parentId || '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(note);
  });

  for (const siblings of byParent.values()) {
    // Sort by current createdAt order
    siblings.sort((a, b) => {
      const tA = new Date(a.createdAt || 0).getTime();
      const tB = new Date(b.createdAt || 0).getTime();
      return tA - tB;
    });
    siblings.forEach((note, i) => {
      if (note.noteOrder == null) {
        note.noteOrder = (i + 1) * 1000;
      }
    });
  }

  saveTasksData();
}

function getNextOrder(siblings) {
  if (siblings.length === 0) return 1000;
  const max = Math.max(...siblings.map(s => s.noteOrder || 0));
  return max + 1000;
}

function getOrderBetween(before, after) {
  const a = before != null ? before : 0;
  const b = after != null ? after : a + 2000;
  return a + Math.max(1, Math.floor((b - a) / 2));
}

// ============================================================================
// Data Helpers
// ============================================================================

function parseFilter(filter) {
  if (!filter) return {};
  if (typeof filter === 'string') return { categoryId: filter };
  return filter;
}

function getFilteredNotes(filter = null) {
  const { categoryId, labelId, personId } = parseFilter(filter);
  const all = state.tasksData.filter(t => t.isNote && !t.completed);
  if (categoryId) return all.filter(n => n.categoryId === categoryId);
  if (labelId) return all.filter(n => (n.labels || []).includes(labelId));
  if (personId) return all.filter(n => (n.people || []).includes(personId));
  return all;
}

function getChildrenByParent(notes) {
  const map = new Map();
  notes.forEach(note => {
    const key = note.parentId || '__root__';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(note);
  });
  for (const list of map.values()) {
    list.sort(compareNotes);
  }
  return map;
}

function normalizeNotesForCategory(filter = null) {
  const notes = getFilteredNotes(filter).slice().sort(compareNotes);
  const notesById = new Map(notes.map(n => [n.id, n]));
  const normalized = notes.map(note => ({
    ...note,
    parentId: note.parentId && notesById.has(note.parentId) ? note.parentId : null
  }));

  const byParent = getChildrenByParent(normalized);
  const ordered = [];
  const visited = new Set();

  const walk = (parentId, level) => {
    const children = byParent.get(parentId) || [];
    children.forEach(child => {
      if (visited.has(child.id)) return;
      visited.add(child.id);
      ordered.push({ ...child, indent: level });
      walk(child.id, level + 1);
    });
  };

  walk('__root__', 0);

  normalized
    .filter(note => !visited.has(note.id))
    .sort(compareNotes)
    .forEach(note => {
      ordered.push({ ...note, parentId: null, indent: 0 });
    });

  return ordered;
}

function getVisibleOrderedNotes(filter = null) {
  const ordered = normalizeNotesForCategory(filter);
  const byParent = getChildrenByParent(ordered);
  const visible = [];

  // When zoomed, start from zoomed note
  const rootId = state.zoomedNoteId || '__root__';
  const baseIndent = state.zoomedNoteId ? (ordered.find(n => n.id === state.zoomedNoteId)?.indent || 0) + 1 : 0;

  const walkVisible = (parentId, ancestorCollapsed) => {
    const children = byParent.get(parentId) || [];
    children.forEach(child => {
      if (!ancestorCollapsed) {
        // Adjust indent relative to zoom depth
        visible.push({ ...child, indent: child.indent - baseIndent });
      }
      walkVisible(child.id, ancestorCollapsed || state.collapsedNotes.has(child.id));
    });
  };

  walkVisible(rootId, false);

  return visible;
}

function getCurrentNoteFilter(currentNote) {
  if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    return { labelId: state.activeLabelFilter };
  }
  if (state.activeFilterType === 'person' && state.activePersonFilter) {
    return { personId: state.activePersonFilter };
  }
  const categoryFilter = state.activeCategoryFilter || null;
  return categoryFilter || currentNote?.categoryId || null;
}

function getNavigationNotes(currentNote) {
  return getVisibleOrderedNotes(getCurrentNoteFilter(currentNote));
}

function persistAndRender(focusId = null) {
  saveTasksData();
  window.render();
  if (focusId) {
    setTimeout(() => focusNote(focusId), 60);
  }
}

// ============================================================================
// Collapsed Notes
// ============================================================================

export function saveCollapsedNotes() {
  localStorage.setItem('collapsedNotes', JSON.stringify([...state.collapsedNotes]));
}

export function toggleNoteCollapse(noteId) {
  if (state.collapsedNotes.has(noteId)) {
    state.collapsedNotes.delete(noteId);
  } else {
    state.collapsedNotes.add(noteId);
  }
  saveCollapsedNotes();
  window.render();
}

// ============================================================================
// Hierarchy Helpers
// ============================================================================

export function getNotesHierarchy(filter = null) {
  return normalizeNotesForCategory(filter);
}

export function noteHasChildren(noteId) {
  return state.tasksData.some(t => t.isNote && !t.completed && t.parentId === noteId);
}

export function getNoteChildren(noteId) {
  return state.tasksData
    .filter(t => t.isNote && !t.completed && t.parentId === noteId)
    .sort(compareNotes);
}

/**
 * Count all descendants (children, grandchildren, etc.) of a note.
 */
export function countAllDescendants(noteId) {
  let count = 0;
  const collect = (parentId) => {
    const children = state.tasksData.filter(t => t.isNote && !t.completed && t.parentId === parentId);
    count += children.length;
    children.forEach(child => collect(child.id));
  };
  collect(noteId);
  return count;
}

/**
 * Check if targetId is a descendant of ancestorId.
 */
export function isDescendantOf(targetId, ancestorId) {
  let current = targetId;
  const visited = new Set();
  while (current) {
    if (visited.has(current)) return false;
    visited.add(current);
    const note = state.tasksData.find(t => t.id === current && t.isNote);
    if (!note || !note.parentId) return false;
    if (note.parentId === ancestorId) return true;
    current = note.parentId;
  }
  return false;
}

/**
 * Get ancestor chain from root to the given note (not including the note itself).
 */
export function getNoteAncestors(noteId) {
  const ancestors = [];
  let current = noteId;
  const visited = new Set();
  while (current) {
    if (visited.has(current)) break;
    visited.add(current);
    const note = state.tasksData.find(t => t.id === current && t.isNote);
    if (!note || !note.parentId) break;
    const parent = state.tasksData.find(t => t.id === note.parentId && t.isNote);
    if (!parent) break;
    ancestors.unshift({ id: parent.id, title: parent.title || 'Untitled' });
    current = note.parentId;
  }
  return ancestors;
}

// ============================================================================
// CRUD Operations
// ============================================================================

export function createRootNote(filter = null) {
  const { categoryId = null, labelId = null, personId = null } = parseFilter(filter);
  const siblings = state.tasksData
    .filter(t => t.isNote && !t.completed && !t.parentId && (categoryId ? t.categoryId === categoryId : true))
    .sort(compareNotes);

  // If zoomed, create as child of zoomed note instead
  if (state.zoomedNoteId) {
    return createChildNote(state.zoomedNoteId);
  }

  const newNote = {
    id: generateTaskId(),
    title: '',
    notes: '',
    status: 'anytime',
    completed: false,
    completedAt: null,
    categoryId,
    labels: labelId ? [labelId] : [],
    people: personId ? [personId] : [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    parentId: null,
    indent: 0,
    noteOrder: getNextOrder(siblings),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

export function indentNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const ordered = getNotesHierarchy(getCurrentNoteFilter(note));
  const noteIdx = ordered.findIndex(n => n.id === noteId);
  if (noteIdx <= 0) return;

  const prev = ordered[noteIdx - 1];
  const maxIndent = 5;
  const nextIndent = Math.min((prev.indent || 0) + 1, maxIndent);
  if ((note.indent || 0) >= maxIndent || (nextIndent === (note.indent || 0) && note.parentId === prev.id)) return;

  // Get new siblings for ordering
  const newSiblings = state.tasksData
    .filter(t => t.isNote && !t.completed && t.parentId === prev.id)
    .sort(compareNotes);

  note.parentId = prev.id;
  note.indent = nextIndent;
  note.noteOrder = getNextOrder(newSiblings);
  note.updatedAt = new Date().toISOString();

  // Expand parent if collapsed
  if (state.collapsedNotes.has(prev.id)) {
    state.collapsedNotes.delete(prev.id);
    saveCollapsedNotes();
  }

  persistAndRender(noteId);
}

export function outdentNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note || (note.indent || 0) <= 0) return;

  const parent = note.parentId ? state.tasksData.find(t => t.id === note.parentId) : null;
  const newParentId = parent ? parent.parentId || null : null;

  // Get new siblings for ordering
  const newSiblings = state.tasksData
    .filter(t => t.isNote && !t.completed && t.parentId === newParentId && t.categoryId === note.categoryId)
    .sort(compareNotes);

  // Place after the old parent in the new siblings list
  const parentOrder = parent ? (parent.noteOrder || 0) : 0;
  const nextAfterParent = newSiblings.find(s => (s.noteOrder || 0) > parentOrder);
  note.noteOrder = getOrderBetween(parentOrder, nextAfterParent ? nextAfterParent.noteOrder : null);

  note.parentId = newParentId;
  note.indent = Math.max(0, (note.indent || 0) - 1);
  note.updatedAt = new Date().toISOString();
  persistAndRender(noteId);
}

export function createNoteAfter(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const siblings = state.tasksData
    .filter(t => t.isNote && !t.completed && t.parentId === note.parentId && t.categoryId === note.categoryId)
    .sort(compareNotes);

  const siblingIdx = siblings.findIndex(s => s.id === noteId);
  const nextSibling = siblings[siblingIdx + 1];
  const newOrder = getOrderBetween(note.noteOrder, nextSibling ? nextSibling.noteOrder : null);

  const newNote = {
    id: generateTaskId(),
    title: '',
    notes: '',
    status: 'anytime',
    completed: false,
    completedAt: null,
    categoryId: note.categoryId,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    parentId: note.parentId,
    indent: note.indent || 0,
    noteOrder: newOrder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

export function createChildNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const existingChildren = getNoteChildren(noteId);
  const newOrder = existingChildren.length > 0
    ? getNextOrder(existingChildren)
    : 1000;

  const newNote = {
    id: generateTaskId(),
    title: '',
    notes: '',
    status: 'anytime',
    completed: false,
    completedAt: null,
    categoryId: note.categoryId,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    parentId: noteId,
    indent: (note.indent || 0) + 1,
    noteOrder: newOrder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (state.collapsedNotes.has(noteId)) {
    state.collapsedNotes.delete(noteId);
    saveCollapsedNotes();
  }

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

export function deleteNote(noteId, deleteChildren = false) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  // Guard: if zoomed note gets deleted, reset zoom
  if (state.zoomedNoteId === noteId) {
    const ancestors = getNoteAncestors(noteId);
    state.zoomedNoteId = ancestors.length > 0 ? ancestors[ancestors.length - 1].id : null;
    state.notesBreadcrumb = ancestors.length > 0 ? ancestors.slice(0, -1) : [];
  }

  if (deleteChildren) {
    const toDelete = new Set([noteId]);
    const collectChildren = (parentId) => {
      state.tasksData
        .filter(t => t.isNote && !t.completed && t.parentId === parentId)
        .forEach(child => {
          toDelete.add(child.id);
          collectChildren(child.id);
        });
    };
    collectChildren(noteId);
    state.tasksData = state.tasksData.filter(t => !toDelete.has(t.id));
  } else {
    const allDescendants = [];
    const collectDescendants = (parentId) => {
      const children = state.tasksData.filter(t => t.isNote && !t.completed && t.parentId === parentId);
      children.forEach(child => {
        allDescendants.push(child);
        collectDescendants(child.id);
      });
    };
    collectDescendants(noteId);

    allDescendants.forEach(desc => {
      desc.indent = Math.max(0, (desc.indent || 0) - 1);
    });

    allDescendants
      .filter(desc => desc.parentId === noteId)
      .forEach(child => {
        child.parentId = note.parentId;
      });

    state.tasksData = state.tasksData.filter(t => t.id !== noteId);
  }

  state.collapsedNotes.delete(noteId);
  saveCollapsedNotes();
  persistAndRender();
}

/**
 * Delete a note with undo toast support.
 * Used by the trash button and backspace-on-empty (not blur auto-cleanup).
 */
export function deleteNoteWithUndo(noteId, focusAfterDeleteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote);
  if (!note) return;
  const snapshot = JSON.parse(JSON.stringify(note));
  const children = state.tasksData.filter(t => t.parentId === noteId).map(t => JSON.parse(JSON.stringify(t)));
  const wasCollapsed = state.collapsedNotes.has(noteId);
  deleteNote(noteId);
  if (focusAfterDeleteId) {
    setTimeout(() => focusNote(focusAfterDeleteId), 60);
  }
  startUndoCountdown(`"${snapshot.title || 'Untitled'}" deleted`, { note: snapshot, children, wasCollapsed }, (snap) => {
    state.tasksData.push(snap.note);
    snap.children.forEach(c => {
      const existing = state.tasksData.find(t => t.id === c.id);
      if (existing) { existing.parentId = c.parentId; existing.indent = c.indent; }
    });
    if (snap.wasCollapsed) state.collapsedNotes.add(snap.note.id);
    saveTasksData();
  });
}

// ============================================================================
// Focus & Cursor (Selection API for contenteditable)
// ============================================================================

function getCursorAtStart(el) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return true;
  const range = sel.getRangeAt(0);
  return range.collapsed && range.startOffset === 0 && range.startContainer === el.firstChild || range.startContainer === el;
}

function getCursorAtEnd(el) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return true;
  const range = sel.getRangeAt(0);
  const textLen = (el.textContent || '').length;
  if (range.collapsed && range.startOffset === textLen) return true;
  if (range.collapsed && range.startContainer === el && range.startOffset === el.childNodes.length) return true;
  return false;
}

export function focusNote(noteId) {
  const input = document.querySelector(`[data-note-id="${noteId}"] .note-input`);
  if (input) {
    input.focus();
    // Place cursor at end using Selection API (contenteditable)
    const range = document.createRange();
    const sel = window.getSelection();
    if (input.childNodes.length > 0) {
      const lastNode = input.childNodes[input.childNodes.length - 1];
      if (lastNode.nodeType === Node.TEXT_NODE) {
        range.setStart(lastNode, lastNode.length);
      } else {
        range.setStartAfter(lastNode);
      }
    } else {
      range.setStart(input, 0);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

// ============================================================================
// Keyboard & Blur Handlers
// ============================================================================

export function handleNoteKeydown(event, noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  // Autocomplete popup navigation — intercept before normal keydown handling
  if (noteAcPopup) {
    const el = event.target;
    const text = el.textContent || '';
    const caret = getCaretOffset(el);
    const query = text.substring(noteAcTriggerPos + 1, caret);
    const isDate = noteAcTriggerChar === '!';
    const items = noteAcGetItems(query);
    const filtered = isDate ? items : items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    const hasExactMatch = isDate ? true : items.some(i => i.name.toLowerCase() === query.toLowerCase());
    const showCreate = !isDate && query.length > 0 && !hasExactMatch;
    const totalItems = filtered.length + (showCreate ? 1 : 0);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopImmediatePropagation();
      noteAcActiveIndex = (noteAcActiveIndex + 1) % totalItems;
      noteAcRenderPopup(items, query, el);
      return;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopImmediatePropagation();
      noteAcActiveIndex = (noteAcActiveIndex - 1 + totalItems) % totalItems;
      noteAcRenderPopup(items, query, el);
      return;
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      event.stopImmediatePropagation();
      noteAcNoteId = noteId;
      if (noteAcActiveIndex < filtered.length) {
        noteAcSelectItem(filtered[noteAcActiveIndex]);
      } else if (showCreate) {
        const createFn = noteAcGetCreateFn();
        if (createFn) {
          const newItem = createFn(query);
          noteAcSelectItem(newItem);
        }
      }
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      noteAcDismissPopup();
      return;
    }
  }

  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      outdentNote(noteId);
    } else {
      indentNote(noteId);
    }
    return;
  }

  // Cmd/Ctrl+Enter = zoom into note
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (noteHasChildren(noteId)) {
      zoomIntoNote(noteId);
    }
    return;
  }

  // Cmd/Ctrl+Backspace = zoom out
  if (event.key === 'Backspace' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (state.zoomedNoteId) {
      zoomOutOfNote();
    }
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const input = event.target;
    const nextTitle = input.textContent.trim();
    if (nextTitle !== (note.title || '')) {
      note.title = nextTitle;
      note.updatedAt = new Date().toISOString();
      saveTasksData();
    }
    createChildNote(noteId);
    return;
  }

  if (event.key === 'Backspace' && event.target.textContent === '' && getCursorAtStart(event.target)) {
    event.preventDefault();
    const visible = getNavigationNotes(note);
    const idx = visible.findIndex(n => n.id === noteId);
    const prevId = idx > 0 ? visible[idx - 1].id : null;
    deleteNoteWithUndo(noteId, prevId);
    return;
  }

  if (event.key === 'ArrowUp' && getCursorAtStart(event.target)) {
    event.preventDefault();
    const visible = getNavigationNotes(note);
    const idx = visible.findIndex(n => n.id === noteId);
    if (idx > 0) {
      focusNote(visible[idx - 1].id);
    }
    return;
  }

  if (event.key === 'ArrowDown' && getCursorAtEnd(event.target)) {
    event.preventDefault();
    const visible = getNavigationNotes(note);
    const idx = visible.findIndex(n => n.id === noteId);
    if (idx >= 0 && idx < visible.length - 1) {
      focusNote(visible[idx + 1].id);
    }
  }
}

let noteBlurTimeout;

export function handleNoteBlur(event, noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  // Dismiss autocomplete popup with a delay (allows clicking popup items)
  noteBlurTimeout = setTimeout(() => noteAcDismissPopup(), 150);

  const newTitle = event.target.textContent.trim();
  const previousTitle = note.title || '';

  if (newTitle === '' && !noteHasChildren(noteId)) {
    deleteNote(noteId);
    return;
  }

  if (newTitle !== previousTitle) {
    note.title = newTitle;
    note.updatedAt = new Date().toISOString();
    saveTasksData();
  }
  if (state.editingNoteId === noteId) {
    state.editingNoteId = null;
  }
}

export function handleNoteFocus(event, noteId) {
  clearTimeout(noteBlurTimeout);
  state.editingNoteId = noteId;
}

// ============================================================================
// Zoom & Navigation
// ============================================================================

export function zoomIntoNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  state.zoomedNoteId = noteId;
  // Build breadcrumb: ancestors + current
  const ancestors = getNoteAncestors(noteId);
  state.notesBreadcrumb = [...ancestors, { id: noteId, title: note.title || 'Untitled' }];
  window.render();
}

export function zoomOutOfNote() {
  if (!state.zoomedNoteId) return;

  const ancestors = getNoteAncestors(state.zoomedNoteId);
  if (ancestors.length > 0) {
    // Navigate to parent
    const parent = ancestors[ancestors.length - 1];
    state.zoomedNoteId = parent.id;
    state.notesBreadcrumb = ancestors;
  } else {
    // Exit zoom entirely
    state.zoomedNoteId = null;
    state.notesBreadcrumb = [];
  }
  window.render();
}

export function navigateToBreadcrumb(noteId) {
  if (!noteId) {
    // Navigate to root
    state.zoomedNoteId = null;
    state.notesBreadcrumb = [];
  } else {
    zoomIntoNote(noteId);
  }
  window.render();
}

export function renderNotesBreadcrumb() {
  if (!state.zoomedNoteId || state.notesBreadcrumb.length === 0) return '';

  // The current (last) breadcrumb entry is the zoomed-in note
  const currentCrumb = state.notesBreadcrumb[state.notesBreadcrumb.length - 1];
  // The parent label for the back button
  const ancestors = state.notesBreadcrumb.slice(0, -1);
  const parentLabel = ancestors.length > 0
    ? ancestors[ancestors.length - 1].title
    : 'All Notes';

  // Build trail for the full path (shown below back button)
  const trail = ['All Notes', ...ancestors.map(a => escapeHtml(a.title))];

  return `
    <div class="notes-breadcrumb-bar">
      <div class="flex items-center gap-2 mb-1">
        <button onclick="zoomOutOfNote()" class="notes-back-btn" title="Go back (Cmd+Backspace)">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          <span>${escapeHtml(parentLabel)}</span>
        </button>
      </div>
      <div class="notes-breadcrumb-title">${escapeHtml(currentCrumb.title || 'Untitled')}</div>
      ${trail.length > 1 ? `
        <div class="notes-breadcrumb-trail">
          ${trail.map((t, i) => {
            if (i < trail.length - 1) {
              const crumbId = i === 0 ? null : ancestors[i - 1].id;
              return `<button onclick="navigateToBreadcrumb(${crumbId ? `'${crumbId}'` : 'null'})" class="notes-trail-link">${t}</button><span class="notes-trail-sep">/</span>`;
            }
            return `<span class="notes-trail-current">${t}</span>`;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// Drag & Drop
// ============================================================================

export function handleNoteDragStart(event, noteId) {
  const isTouch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch) return;

  state.draggedNoteId = noteId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', noteId);

  // Add dragging class after a frame
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-note-id="${noteId}"]`);
    if (el) el.classList.add('note-dragging');
  });
}

export function handleNoteDragEnd(event) {
  const draggedId = state.draggedNoteId;
  const targetId = state.dragOverNoteId;
  const position = state.noteDragPosition;

  // Clean up all drag classes
  document.querySelectorAll('.note-dragging, .note-drag-over, .note-drag-over-bottom, .note-drag-over-child').forEach(el => {
    el.classList.remove('note-dragging', 'note-drag-over', 'note-drag-over-bottom', 'note-drag-over-child');
  });

  // Execute reorder if valid
  if (draggedId && targetId && position && draggedId !== targetId) {
    reorderNotes(draggedId, targetId, position);
  }

  state.draggedNoteId = null;
  state.dragOverNoteId = null;
  state.noteDragPosition = null;
}

export function handleNoteDragOver(event, noteId) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  if (!state.draggedNoteId || state.draggedNoteId === noteId) return;

  // Prevent dropping into own descendants
  if (isDescendantOf(noteId, state.draggedNoteId)) return;

  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const height = rect.height;

  // Remove previous indicators
  el.classList.remove('note-drag-over', 'note-drag-over-bottom', 'note-drag-over-child');

  let position;
  if (y < height * 0.25) {
    position = 'top';
    el.classList.add('note-drag-over');
  } else if (y > height * 0.75) {
    position = 'bottom';
    el.classList.add('note-drag-over-bottom');
  } else {
    position = 'child';
    el.classList.add('note-drag-over-child');
  }

  state.dragOverNoteId = noteId;
  state.noteDragPosition = position;
}

export function handleNoteDragLeave(event) {
  const el = event.currentTarget;
  // Only remove if actually leaving (not entering a child)
  if (!el.contains(event.relatedTarget)) {
    el.classList.remove('note-drag-over', 'note-drag-over-bottom', 'note-drag-over-child');
  }
}

export function handleNoteDrop(event) {
  event.preventDefault();
}

export function reorderNotes(draggedId, targetId, position) {
  const dragged = state.tasksData.find(t => t.id === draggedId && t.isNote);
  const target = state.tasksData.find(t => t.id === targetId && t.isNote);
  if (!dragged || !target) return;

  // Safety: prevent dropping into own descendants
  if (isDescendantOf(targetId, draggedId)) return;

  if (position === 'child') {
    // Re-parent into target
    dragged.parentId = targetId;
    dragged.indent = (target.indent || 0) + 1;
    const newSiblings = state.tasksData
      .filter(t => t.isNote && !t.completed && t.parentId === targetId && t.id !== draggedId)
      .sort(compareNotes);
    dragged.noteOrder = getNextOrder(newSiblings);

    // Expand target if collapsed
    if (state.collapsedNotes.has(targetId)) {
      state.collapsedNotes.delete(targetId);
      saveCollapsedNotes();
    }
  } else {
    // Same level reorder (before or after target)
    dragged.parentId = target.parentId;
    dragged.indent = target.indent || 0;

    const siblings = state.tasksData
      .filter(t => t.isNote && !t.completed && t.parentId === target.parentId && t.categoryId === target.categoryId && t.id !== draggedId)
      .sort(compareNotes);

    const targetIdx = siblings.findIndex(s => s.id === targetId);

    if (position === 'top') {
      const prevSibling = targetIdx > 0 ? siblings[targetIdx - 1] : null;
      dragged.noteOrder = getOrderBetween(
        prevSibling ? prevSibling.noteOrder : null,
        target.noteOrder
      );
    } else {
      // bottom
      const nextSibling = targetIdx < siblings.length - 1 ? siblings[targetIdx + 1] : null;
      dragged.noteOrder = getOrderBetween(
        target.noteOrder,
        nextSibling ? nextSibling.noteOrder : null
      );
    }
  }

  dragged.updatedAt = new Date().toISOString();
  persistAndRender();
}

// ============================================================================
// Rendering
// ============================================================================

export function renderNoteItem(note) {
  const hasChildren = noteHasChildren(note.id);
  const isCollapsed = state.collapsedNotes.has(note.id);
  const isEditing = state.editingNoteId === note.id;
  const descendantCount = hasChildren && isCollapsed ? countAllDescendants(note.id) : 0;

  const hasMetaChips = note.categoryId || (note.labels && note.labels.length > 0) || (note.people && note.people.length > 0) || note.deferDate;

  const isTouch = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  return `
    <div class="note-item ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'note-collapsed' : ''} ${isEditing ? 'editing' : ''}"
      data-note-id="${note.id}"
      style="--note-depth:${note.indent || 0};"
      ${!isTouch ? `draggable="true"
      ondragstart="handleNoteDragStart(event, '${note.id}')"
      ondragend="handleNoteDragEnd(event)"
      ondragover="handleNoteDragOver(event, '${note.id}')"
      ondragleave="handleNoteDragLeave(event)"
      ondrop="handleNoteDrop(event)"` : ''}>
      <div class="note-row group">
        <button onclick="event.stopPropagation(); ${hasChildren ? `toggleNoteCollapse('${note.id}')` : `createChildNote('${note.id}')`}"
          class="note-bullet ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'collapsed' : ''}"
          title="${hasChildren ? (isCollapsed ? 'Expand' : 'Collapse') : 'Add child note'}"
          aria-label="${hasChildren ? (isCollapsed ? 'Expand note' : 'Collapse note') : 'Add child note'}">
          ${hasChildren ? `
            <svg class="note-bullet-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.23 4.21a.75.75 0 011.06.02l5.25 5.5a.75.75 0 010 1.04l-5.25 5.5a.75.75 0 01-1.08-1.04L11 10.25 6.21 5.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
          ` : '<span class="note-bullet-dot"></span>'}
        </button>

        <div class="note-content-col">
          <div contenteditable="true" class="note-input" data-placeholder="Type something..."
            onkeydown="handleNoteKeydown(event, '${note.id}')"
            oninput="handleNoteInput(event, '${note.id}')"
            onblur="handleNoteBlur(event, '${note.id}')"
            onfocus="handleNoteFocus(event, '${note.id}')"
          >${escapeHtml(note.title || '')}</div>
          ${hasMetaChips ? `<div class="note-meta-chips">${buildNoteMetaChipsHtml(note)}</div>` : `<div class="note-meta-chips"></div>`}
        </div>

        ${isCollapsed && descendantCount > 0 ? `
          <span class="note-descendant-badge">${descendantCount}</span>
        ` : ''}

        <div class="note-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          ${hasChildren ? `
            <button onclick="event.stopPropagation(); zoomIntoNote('${note.id}')"
              class="note-action-btn" title="Zoom in (Cmd+Enter)" aria-label="Zoom into note">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          ` : ''}
          <button onclick="event.stopPropagation(); createChildNote('${note.id}')"
            class="note-action-btn" title="Add child note (Enter)" aria-label="Add child note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); deleteNoteWithUndo('${note.id}')"
            class="note-action-btn" title="Delete note" aria-label="Delete note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderNotesOutliner(filter = null) {
  const visibleNotes = getVisibleOrderedNotes(filter);

  if (visibleNotes.length === 0 && !state.zoomedNoteId) {
    return `
      <div class="text-center py-12 text-charcoal/40">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="4" cy="6" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="4" cy="18" r="2"/>
            <rect x="8" y="5" width="14" height="2" rx="1"/><rect x="8" y="11" width="14" height="2" rx="1"/><rect x="8" y="17" width="14" height="2" rx="1"/>
          </svg>
        </div>
        <p class="text-sm font-medium mb-1">No notes yet</p>
        <p class="text-xs text-charcoal/30 mb-3">Capture the first thought and build from there</p>
      </div>
    `;
  }

  if (visibleNotes.length === 0 && state.zoomedNoteId) {
    return `
      <div class="text-center py-8 text-charcoal/40">
        <p class="text-sm font-medium mb-1">No child notes</p>
        <p class="text-xs text-charcoal/30">Press Enter to create one</p>
      </div>
    `;
  }

  return visibleNotes.map(note => renderNoteItem(note)).join('');
}
