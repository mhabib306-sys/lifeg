import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, escapeHtml, formatSmartDate, isTouchDevice } from '../utils.js';
import {
  TASK_CATEGORIES_KEY, TASK_LABELS_KEY, TASK_PEOPLE_KEY, COLLAPSED_NOTES_KEY,
  NOTE_INTEGRITY_SNAPSHOT_KEY, NOTE_LOCAL_BACKUP_KEY
} from '../constants.js';
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
const NOTE_HISTORY_LIMIT = 60;

function isNoteItem(item) {
  // Notes (isNote=true) OR tasks living in the outliner (noteLifecycleState='active')
  return !!item?.isNote || item?.noteLifecycleState === 'active';
}

function isDeletedNote(item) {
  return item?.noteLifecycleState === 'deleted';
}

function isActiveNote(item) {
  return isNoteItem(item) && !item.completed && !isDeletedNote(item);
}

function getAnyNoteById(noteId) {
  return state.tasksData.find(t => t.id === noteId && isNoteItem(t));
}

function getActiveNoteById(noteId) {
  return state.tasksData.find(t => t.id === noteId && isActiveNote(t));
}

function addNoteHistoryEntry(note, action, details = {}) {
  if (!isNoteItem(note)) return;
  if (!Array.isArray(note.noteHistory)) note.noteHistory = [];
  note.noteHistory.push({
    id: `nh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    action,
    at: new Date().toISOString(),
    details
  });
  if (note.noteHistory.length > NOTE_HISTORY_LIMIT) {
    note.noteHistory = note.noteHistory.slice(-NOTE_HISTORY_LIMIT);
  }
}

function ensureNoteMetadata(note) {
  if (!isNoteItem(note)) return false;
  let changed = false;
  if (note.noteLifecycleState !== 'active' && note.noteLifecycleState !== 'deleted') {
    note.noteLifecycleState = 'active';
    changed = true;
  }
  if (!Array.isArray(note.noteHistory)) {
    note.noteHistory = [];
    changed = true;
  }
  return changed;
}

function recordNoteChange(note, action, details = {}) {
  ensureNoteMetadata(note);
  addNoteHistoryEntry(note, action, details);
  note.updatedAt = new Date().toISOString();
}

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
  const note = noteAcNoteId ? state.tasksData.find(t => t.id === noteAcNoteId && isActiveNote(t)) : null;
  if (noteAcTriggerChar === '#') {
    const areas = state.taskAreas.map(a => ({ ...a, _acType: 'area' }));
    const categories = (state.taskCategories || []).map(c => ({ ...c, _acType: 'category' }));
    return [...areas, ...categories];
  }
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
    const now = new Date().toISOString();
    const c = { id: 'cat_' + Date.now(), name, color: '#6366f1', icon: '\uD83D\uDCC1', createdAt: now, updatedAt: now };
    state.taskAreas.push(c);
    localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));
    debouncedSaveToGithubSafe();
    return { ...c, _acType: 'area' };
  };
  if (noteAcTriggerChar === '@') return (name) => {
    const now = new Date().toISOString();
    const colors = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
    const l = { id: 'label_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)], createdAt: now, updatedAt: now };
    state.taskLabels.push(l);
    localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
    debouncedSaveToGithubSafe();
    return l;
  };
  if (noteAcTriggerChar === '&') return (name) => {
    const now = new Date().toISOString();
    const colors = ['#4A90A4','#6B8E5A','#E5533D','#C4943D','#7C6B8E'];
    const p = { id: 'person_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)], email: '', createdAt: now, updatedAt: now };
    state.taskPeople.push(p);
    localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
    debouncedSaveToGithubSafe();
    return p;
  };
  return null;
}

function noteAcSelectItem(item) {
  const note = state.tasksData.find(t => t.id === noteAcNoteId && isActiveNote(t));
  if (!note) { noteAcDismissPopup(); return; }

  // Find the active contenteditable element (could be .note-input or .note-page-title in page view)
  const el = document.querySelector(`[data-note-id="${noteAcNoteId}"] .note-input`)
    || document.querySelector('.note-page-title');
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
    if (item._acType === 'category') {
      if (item.areaId) note.areaId = item.areaId;
      note.categoryId = item.id;
    } else {
      note.areaId = item.id;
    }
  } else if (noteAcTriggerChar === '@') {
    if (!note.labels) note.labels = [];
    if (!note.labels.includes(item.id)) note.labels.push(item.id);
  } else if (noteAcTriggerChar === '&') {
    if (!note.people) note.people = [];
    if (!note.people.includes(item.id)) note.people.push(item.id);
  } else if (noteAcTriggerChar === '!') {
    note.deferDate = item.date;
  }

  recordNoteChange(note, 'updated', { field: 'metadata' });
  saveTasksData();
  debouncedSaveToGithubSafe();

  noteAcDismissPopup();
  el.focus();

  // Re-render chips (without full render which would lose focus)
  renderNoteMetaChipsDOM(noteAcNoteId || note.id, note);
  // Also update page view meta chips if in page view
  renderPageMetaChipsDOM(noteAcNoteId || note.id, note);
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
      icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">${item.emoji || '<svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</span>`;
    } else if (noteAcTriggerChar === '@') {
      icon = `<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${item.color}"></span>`;
    } else {
      icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">\uD83D\uDC64</span>`;
    }
    const dateLabel = isDate ? `<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${formatSmartDate(item.date)}</span>` : '';
    let nameHtml = escapeHtml(item.name);
    if (noteAcTriggerChar === '#' && item._acType === 'category' && item.areaId) {
      const parentArea = state.taskAreas.find(a => a.id === item.areaId);
      if (parentArea) nameHtml += `<span style="margin-left:6px;font-size:11px;color:var(--text-muted)">${escapeHtml(parentArea.name)}</span>`;
    }
    html += `<div class="inline-ac-option${isActive}" data-idx="${idx}" style="${isDate ? 'justify-content:space-between' : ''}">${icon}<span>${nameHtml}</span>${dateLabel}</div>`;
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
  // Skip autocomplete for description area (freeform text)
  if (event.target.classList.contains('note-page-description')) return;
  noteAcNoteId = noteId;
  const el = event.target;
  noteAcCheckTrigger(el);
}

/** Update metadata chips DOM without full re-render (preserves focus). */
function renderNoteMetaChipsDOM(noteId, note) {
  const container = document.querySelector(`[data-note-id="${noteId}"] .note-meta-chips`);
  if (!container) return;
  // Safe: buildNoteMetaChipsHtml uses escapeHtml on all user content
  container.innerHTML = buildNoteMetaChipsHtml(note);
}

/** Update page view meta chips DOM without full re-render (preserves focus). */
function renderPageMetaChipsDOM(noteId, note) {
  const container = document.querySelector('.note-page-meta');
  if (!container || state.zoomedNoteId !== noteId) return;
  // Safe: buildPageMetaChipsHtml uses escapeHtml on all user content
  container.innerHTML = buildPageMetaChipsHtml(note);
}

/** Build HTML for note metadata (plain text with bullet separators, matching task style). */
function buildNoteMetaChipsHtml(note) {
  const metaParts = [];
  if (note.areaId) {
    const cat = state.taskAreas.find(c => c.id === note.areaId);
    if (cat) metaParts.push(escapeHtml(cat.name));
  }
  if (note.categoryId) {
    const subcat = state.taskCategories.find(c => c.id === note.categoryId);
    if (subcat) metaParts.push(escapeHtml(subcat.name));
  }
  (note.labels || []).forEach(lid => {
    const label = state.taskLabels.find(l => l.id === lid);
    if (label) metaParts.push(escapeHtml(label.name));
  });
  (note.people || []).forEach(pid => {
    const person = state.taskPeople.find(p => p.id === pid);
    if (person) metaParts.push(escapeHtml(person.name.split(' ')[0]));
  });
  if (note.deferDate) {
    metaParts.push(`Start ${formatSmartDate(note.deferDate)}`);
  }
  return metaParts.length ? metaParts.join(' \u2022 ') : '';
}

/** Remove a piece of metadata from a note. */
export function removeNoteInlineMeta(noteId, type, id) {
  const note = state.tasksData.find(t => t.id === noteId && isActiveNote(t));
  if (!note) return;
  if (type === 'category') {
    const isSubcategory = (state.taskCategories || []).some(c => c.id === id);
    if (isSubcategory) {
      note.categoryId = null;
    } else {
      note.areaId = null;
      note.categoryId = null;
    }
  } else if (type === 'label') note.labels = (note.labels || []).filter(l => l !== id);
  else if (type === 'person') note.people = (note.people || []).filter(p => p !== id);
  else if (type === 'deferDate') note.deferDate = null;
  recordNoteChange(note, 'updated', { field: 'metadata' });
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
  ensureNoteSafetyMetadata();
  const notes = state.tasksData.filter(t => isActiveNote(t));
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
  if (typeof filter === 'string') return { areaId: filter };
  return { ...filter };
}

function getFilteredNotes(filter = null) {
  const { areaId, labelId, personId, categoryId } = parseFilter(filter);
  const all = state.tasksData.filter(t => isActiveNote(t));
  if (categoryId) return all.filter(n => n.categoryId === categoryId);
  if (areaId) return all.filter(n => n.areaId === areaId);
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
  if (state.activeFilterType === 'subcategory' && state.activeCategoryFilter) {
    return { categoryId: state.activeCategoryFilter };
  }
  const areaFilter = state.activeAreaFilter || null;
  return areaFilter || currentNote?.areaId || null;
}

function getNavigationNotes(currentNote) {
  return getVisibleOrderedNotes(getCurrentNoteFilter(currentNote));
}

function persistAndRender(focusId = null) {
  saveTasksData();
  debouncedSaveToGithubSafe();
  window.render();
  if (focusId) {
    setTimeout(() => focusNote(focusId), 60);
  }
}

function computeNoteIdSignature(items) {
  const ids = items.map(item => String(item.id)).sort();
  let hash = 0;
  for (const id of ids) {
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    }
  }
  return `${ids.length}:${Math.abs(hash)}`;
}

function readIntegritySnapshot() {
  try {
    return JSON.parse(localStorage.getItem(NOTE_INTEGRITY_SNAPSHOT_KEY) || 'null');
  } catch {
    return null;
  }
}

function writeIntegritySnapshot(snapshot) {
  localStorage.setItem(NOTE_INTEGRITY_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function ensureNoteSafetyMetadata() {
  let changed = false;
  state.tasksData.forEach(item => {
    if (!isNoteItem(item)) return;
    if (ensureNoteMetadata(item)) changed = true;
  });
  if (changed) {
    saveTasksData();
  }
  return changed;
}

export function getDeletedNotes(limit = 100) {
  return state.tasksData
    .filter(item => isNoteItem(item) && isDeletedNote(item))
    .sort((a, b) => new Date(b.deletedAt || b.updatedAt || 0).getTime() - new Date(a.deletedAt || a.updatedAt || 0).getTime())
    .slice(0, limit)
    .map(note => ({ id: note.id, title: note.title || 'Untitled', deletedAt: note.deletedAt || note.updatedAt }));
}

export function restoreDeletedNote(noteId, includeChildren = true) {
  const note = getAnyNoteById(noteId);
  if (!note || !isDeletedNote(note)) return false;
  const restoreIds = new Set([noteId]);
  if (includeChildren) {
    const stack = [noteId];
    while (stack.length) {
      const currentId = stack.pop();
      state.tasksData
        .filter(item => isNoteItem(item) && item.parentId === currentId && isDeletedNote(item))
        .forEach(child => {
          restoreIds.add(child.id);
          stack.push(child.id);
        });
    }
  }
  state.tasksData.forEach(item => {
    if (!restoreIds.has(item.id) || !isNoteItem(item)) return;
    ensureNoteMetadata(item);
    item.noteLifecycleState = 'active';
    item.deletedAt = null;
    item.completed = false;
    item.completedAt = null;
    recordNoteChange(item, 'restored', { includeChildren });
  });
  persistAndRender(noteId);
  return true;
}

export function findNotesByText(query = '', limit = 20) {
  const q = String(query || '').trim().toLowerCase();
  const results = state.tasksData
    .filter(item => isNoteItem(item))
    .filter(item => !q || (item.title || '').toLowerCase().includes(q) || (item.notes || '').toLowerCase().includes(q))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, limit)
    .map(item => ({
      id: item.id,
      title: item.title || 'Untitled',
      state: isDeletedNote(item) ? 'deleted' : (item.completed ? 'completed' : 'active'),
      updatedAt: item.updatedAt || item.createdAt || ''
    }));
  return results;
}

export function getRecentNoteChanges(limit = 20) {
  return state.tasksData
    .filter(item => isNoteItem(item))
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, limit)
    .map(item => ({
      id: item.id,
      title: item.title || 'Untitled',
      state: isDeletedNote(item) ? 'deleted' : (item.completed ? 'completed' : 'active'),
      updatedAt: item.updatedAt || item.createdAt || '',
      lastAction: (item.noteHistory || [])[item.noteHistory.length - 1]?.action || 'updated'
    }));
}

export function createNoteLocalBackup() {
  const noteItems = state.tasksData.filter(item => isNoteItem(item));
  const payload = {
    createdAt: new Date().toISOString(),
    noteCount: noteItems.length,
    idsSignature: computeNoteIdSignature(noteItems),
    notes: noteItems
  };
  localStorage.setItem(NOTE_LOCAL_BACKUP_KEY, JSON.stringify(payload));
  return { createdAt: payload.createdAt, noteCount: payload.noteCount };
}

export function runNoteIntegrityChecks(previousVersion = '') {
  const notes = state.tasksData.filter(item => isNoteItem(item));
  const active = notes.filter(item => isActiveNote(item));
  const deleted = notes.filter(item => isDeletedNote(item));
  const completed = notes.filter(item => item.completed && !isDeletedNote(item));

  const currentSnapshot = {
    at: new Date().toISOString(),
    version: previousVersion || '',
    totalCount: notes.length,
    activeCount: active.length,
    deletedCount: deleted.length,
    completedCount: completed.length,
    idsSignature: computeNoteIdSignature(notes)
  };

  const previousSnapshot = readIntegritySnapshot();
  if (previousSnapshot && previousVersion && previousSnapshot.activeCount > 0) {
    const activeDrop = previousSnapshot.activeCount - active.length;
    if (activeDrop >= Math.max(3, Math.ceil(previousSnapshot.activeCount * 0.3))) {
      state.showCacheRefreshPrompt = true;
      state.cacheRefreshPromptMessage = `Warning: active notes dropped from ${previousSnapshot.activeCount} to ${active.length}. Open Settings > Note Safety to search and restore.`;
    }
  }

  writeIntegritySnapshot(currentSnapshot);
  return currentSnapshot;
}

// ============================================================================
// Collapsed Notes
// ============================================================================

export function saveCollapsedNotes() {
  localStorage.setItem(COLLAPSED_NOTES_KEY, JSON.stringify([...state.collapsedNotes]));
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
  return state.tasksData.some(t => isActiveNote(t) && t.parentId === noteId);
}

export function getNoteChildren(noteId) {
  return state.tasksData
    .filter(t => isActiveNote(t) && t.parentId === noteId)
    .sort(compareNotes);
}

/**
 * Count all descendants (children, grandchildren, etc.) of a note.
 */
export function countAllDescendants(noteId) {
  let count = 0;
  const collect = (parentId) => {
    const children = state.tasksData.filter(t => isActiveNote(t) && t.parentId === parentId);
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
    const note = state.tasksData.find(t => t.id === current && isActiveNote(t));
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
    const note = state.tasksData.find(t => t.id === current && isActiveNote(t));
    if (!note || !note.parentId) break;
    const parent = state.tasksData.find(t => t.id === note.parentId && isActiveNote(t));
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
  const { areaId = null, labelId = null, personId = null, categoryId = null } = parseFilter(filter);
  const siblings = state.tasksData
    .filter(t => isActiveNote(t) && !t.parentId && (areaId ? t.areaId === areaId : true))
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
    areaId,
    categoryId,
    labels: labelId ? [labelId] : [],
    people: personId ? [personId] : [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    noteLifecycleState: 'active',
    noteHistory: [],
    parentId: null,
    indent: 0,
    noteOrder: getNextOrder(siblings),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  addNoteHistoryEntry(newNote, 'created', { source: 'root' });

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

export function indentNote(noteId) {
  const note = getActiveNoteById(noteId);
  if (!note) return;

  const ordered = getNotesHierarchy(getCurrentNoteFilter(note));
  const noteIdx = ordered.findIndex(n => n.id === noteId);
  if (noteIdx <= 0) return;

  const prev = ordered[noteIdx - 1];
  const maxIndent = 5;
  const nextIndent = Math.min((prev.indent || 0) + 1, maxIndent);
  if ((note.indent || 0) >= maxIndent || (nextIndent === (note.indent || 0) && note.parentId === prev.id)) return;

  // Get new siblings for ordering (filter by area for consistency with outdent/createNoteAfter)
  const newSiblings = state.tasksData
    .filter(t => isActiveNote(t) && t.parentId === prev.id && t.areaId === note.areaId)
    .sort(compareNotes);

  note.parentId = prev.id;
  note.indent = nextIndent;
  note.noteOrder = getNextOrder(newSiblings);
  recordNoteChange(note, 'updated', { field: 'hierarchy', type: 'indent' });

  // Expand parent if collapsed
  if (state.collapsedNotes.has(prev.id)) {
    state.collapsedNotes.delete(prev.id);
    saveCollapsedNotes();
  }

  persistAndRender(noteId);
}

export function outdentNote(noteId) {
  const note = getActiveNoteById(noteId);
  if (!note || (note.indent || 0) <= 0) return;

  const parent = note.parentId ? state.tasksData.find(t => t.id === note.parentId && isActiveNote(t)) : null;
  const newParentId = parent ? parent.parentId || null : null;

  // Get new siblings for ordering
  const newSiblings = state.tasksData
    .filter(t => isActiveNote(t) && t.parentId === newParentId && t.areaId === note.areaId)
    .sort(compareNotes);

  // Place after the old parent in the new siblings list
  const parentOrder = parent ? (parent.noteOrder || 0) : 0;
  const nextAfterParent = newSiblings.find(s => (s.noteOrder || 0) > parentOrder);
  note.noteOrder = getOrderBetween(parentOrder, nextAfterParent ? nextAfterParent.noteOrder : null);

  note.parentId = newParentId;
  note.indent = Math.max(0, (note.indent || 0) - 1);
  recordNoteChange(note, 'updated', { field: 'hierarchy', type: 'outdent' });
  persistAndRender(noteId);
}

export function createNoteAfter(noteId) {
  const note = getActiveNoteById(noteId);
  if (!note) return;

  const siblings = state.tasksData
    .filter(t => isActiveNote(t) && t.parentId === note.parentId && t.areaId === note.areaId)
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
    areaId: note.areaId,
    categoryId: note.categoryId || null,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    noteLifecycleState: 'active',
    noteHistory: [],
    parentId: note.parentId,
    indent: note.indent || 0,
    noteOrder: newOrder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  addNoteHistoryEntry(newNote, 'created', { source: 'after', relatedTo: noteId });

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

export function createChildNote(noteId) {
  const note = getActiveNoteById(noteId);
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
    areaId: note.areaId,
    categoryId: note.categoryId || null,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    noteLifecycleState: 'active',
    noteHistory: [],
    parentId: noteId,
    indent: (note.indent || 0) + 1,
    noteOrder: newOrder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  addNoteHistoryEntry(newNote, 'created', { source: 'child', relatedTo: noteId });

  if (state.collapsedNotes.has(noteId)) {
    state.collapsedNotes.delete(noteId);
    saveCollapsedNotes();
  }

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

export function deleteNote(noteId, deleteChildren = false) {
  const note = getActiveNoteById(noteId);
  if (!note) return;

  // Guard: if zoomed note gets deleted, reset zoom
  if (state.zoomedNoteId === noteId) {
    const ancestors = getNoteAncestors(noteId);
    state.zoomedNoteId = ancestors.length > 0 ? ancestors[ancestors.length - 1].id : null;
    state.notesBreadcrumb = ancestors.length > 0 ? ancestors.slice(0, -1) : [];
  }

  const now = new Date().toISOString();
  const markDeleted = (target) => {
    if (!target || !isActiveNote(target)) return;
    ensureNoteMetadata(target);
    target.noteLifecycleState = 'deleted';
    target.deletedAt = now;
    target.completed = true;
    target.completedAt = target.completedAt || now;
    recordNoteChange(target, 'deleted', { reason: 'manual' });
  };

  if (deleteChildren) {
    const stack = [noteId];
    while (stack.length) {
      const currentId = stack.pop();
      const current = getActiveNoteById(currentId);
      if (!current) continue;
      markDeleted(current);
      state.tasksData
        .filter(t => isActiveNote(t) && t.parentId === currentId)
        .forEach(child => stack.push(child.id));
    }
  } else {
    const allDescendants = [];
    const collectDescendants = (parentId) => {
      const children = state.tasksData.filter(t => isActiveNote(t) && t.parentId === parentId);
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
        recordNoteChange(child, 'reparented', { from: noteId, to: note.parentId || null });
      });
    markDeleted(note);
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
  const note = getActiveNoteById(noteId);
  if (!note) return;
  const toSnapshot = new Set([noteId]);
  const collectChildren = (parentId) => {
    state.tasksData
      .filter(t => isActiveNote(t) && t.parentId === parentId)
      .forEach(child => {
        toSnapshot.add(child.id);
        collectChildren(child.id);
      });
  };
  collectChildren(noteId);
  const snapshot = state.tasksData
    .filter(t => toSnapshot.has(t.id))
    .map(t => JSON.parse(JSON.stringify(t)));
  const wasCollapsed = state.collapsedNotes.has(noteId);
  deleteNote(noteId, true);
  if (focusAfterDeleteId) {
    setTimeout(() => focusNote(focusAfterDeleteId), 60);
  }
  startUndoCountdown(`"${note.title || 'Untitled'}" deleted`, { snapshot, wasCollapsed }, (snap) => {
    snap.snapshot.forEach(item => {
      const existing = getAnyNoteById(item.id);
      if (!existing) return;
      Object.assign(existing, item);
    });
    if (snap.wasCollapsed) state.collapsedNotes.add(noteId);
    saveTasksData();
    debouncedSaveToGithubSafe();
  });
}

/** Toggle an item between note (bullet) and task (checkbox) with undo.
 *  Note→Task: item leaves outliner, enters task views.
 *  Task→Note: item leaves task views, enters outliner.
 */
export function toggleNoteTask(id) {
  const item = state.tasksData.find(t => t.id === id && (isNoteItem(t) || !t.isNote));
  if (!item) return;

  // Snapshot for undo
  const snapshot = JSON.parse(JSON.stringify(item));
  const wasNote = item.isNote;

  if (item.isNote) {
    // NOTE → TASK: leaves outliner, enters task perspectives
    item.isNote = false;
    item.status = item.status || 'anytime';
    item.noteLifecycleState = 'converted'; // no longer active in outliner
    if (item.order == null) item.order = item.noteOrder || Date.now();
  } else {
    // TASK → NOTE: leaves task perspectives, enters outliner
    item.isNote = true;
    item.noteLifecycleState = 'active';
    if (!item.noteHistory) item.noteHistory = [];
    if (item.noteOrder == null) item.noteOrder = item.order || Date.now();
    if (item.parentId == null) item.parentId = null;
    if (item.indent == null) item.indent = 0;
    // Clear task-only view flags
    item.today = false;
    item.flagged = false;
  }

  recordNoteChange(item, 'toggled', { from: wasNote ? 'note' : 'task', to: wasNote ? 'task' : 'note' });
  saveTasksData();
  debouncedSaveToGithubSafe();

  const label = wasNote ? `Converted to task` : `Converted to note`;
  startUndoCountdown(label, snapshot, (snap) => {
    // Restore all fields from snapshot
    Object.assign(item, snap);
    saveTasksData();
    debouncedSaveToGithubSafe();
  });
}

// ============================================================================
// Focus & Cursor (Selection API for contenteditable)
// ============================================================================

function getCursorAtStart(el) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return true;
  const range = sel.getRangeAt(0);
  return range.collapsed && range.startOffset === 0 && (range.startContainer === el.firstChild || range.startContainer === el);
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
  const note = getActiveNoteById(noteId);
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

  // Cmd/Ctrl+Shift+Enter = toggle note↔task (Tana-style)
  if (event.key === 'Enter' && event.shiftKey && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    toggleNoteTask(noteId);
    return;
  }

  // Cmd/Ctrl+Enter = zoom into note (open as page)
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    zoomIntoNote(noteId);
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

  // Cmd/Ctrl+Up = collapse note (Tana-style)
  if (event.key === 'ArrowUp' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (noteHasChildren(noteId) && !state.collapsedNotes.has(noteId)) {
      state.collapsedNotes.add(noteId);
      saveCollapsedNotes();
      window.render();
      setTimeout(() => focusNote(noteId), 30);
    }
    return;
  }

  // Cmd/Ctrl+Down = expand note (Tana-style)
  if (event.key === 'ArrowDown' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (noteHasChildren(noteId) && state.collapsedNotes.has(noteId)) {
      state.collapsedNotes.delete(noteId);
      saveCollapsedNotes();
      window.render();
      setTimeout(() => focusNote(noteId), 30);
    }
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const input = event.target;
    const nextTitle = input.textContent.trim();
    if (nextTitle !== (note.title || '')) {
      note.title = nextTitle;
      recordNoteChange(note, 'updated', { field: 'title' });
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
    } else if (idx === 0 && state.zoomedNoteId) {
      // At first child, navigate up to page description
      focusPageDescription(state.zoomedNoteId);
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
  const note = getActiveNoteById(noteId);
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
    recordNoteChange(note, 'updated', { field: 'title' });
    saveTasksData();
    debouncedSaveToGithubSafe();
  }
  if (state.editingNoteId === noteId) {
    state.editingNoteId = null;
  }
}

export function handleNoteFocus(event, noteId) {
  clearTimeout(noteBlurTimeout);
  state.editingNoteId = noteId;
}

/** Strip HTML from pasted content in note contenteditable elements */
export function handleNotePaste(event) {
  event.preventDefault();
  const text = (event.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, text);
}

// ============================================================================
// Zoom & Navigation
// ============================================================================

export function zoomIntoNote(noteId) {
  const note = getActiveNoteById(noteId);
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
    window.render();
  } else {
    zoomIntoNote(noteId); // already calls render()
  }
}

// ============================================================================
// Page View — "Every Note is a Page" (when zoomed)
// ============================================================================

let descriptionSaveTimer = null;

/** Build interactive pill chips for note metadata in page view. */
export function buildPageMetaChipsHtml(note) {
  if (!note) return '';
  let chips = '';

  if (note.areaId) {
    const area = state.taskAreas.find(a => a.id === note.areaId);
    if (area) {
      chips += `<span class="note-page-chip" style="background:${area.color}12;border-color:${area.color}30;color:${area.color}">
        ${escapeHtml(area.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${note.id}','category','${area.id}')" title="Remove">&times;</span>
      </span>`;
    }
  }
  if (note.categoryId) {
    const cat = (state.taskCategories || []).find(c => c.id === note.categoryId);
    if (cat) {
      chips += `<span class="note-page-chip">
        ${escapeHtml(cat.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${note.id}','category','${cat.id}')" title="Remove">&times;</span>
      </span>`;
    }
  }
  (note.labels || []).forEach(lid => {
    const label = state.taskLabels.find(l => l.id === lid);
    if (label) {
      chips += `<span class="note-page-chip" style="background:${label.color}12;border-color:${label.color}30;color:${label.color}">
        ${escapeHtml(label.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${note.id}','label','${lid}')" title="Remove">&times;</span>
      </span>`;
    }
  });
  (note.people || []).forEach(pid => {
    const person = state.taskPeople.find(p => p.id === pid);
    if (person) {
      chips += `<span class="note-page-chip" style="background:${person.color}12;border-color:${person.color}30;color:${person.color}">
        ${escapeHtml(person.name.split(' ')[0])}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${note.id}','person','${pid}')" title="Remove">&times;</span>
      </span>`;
    }
  });
  if (note.deferDate) {
    chips += `<span class="note-page-chip">
      <svg style="width:12px;height:12px;flex-shrink:0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
      ${formatSmartDate(note.deferDate)}
      <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${note.id}','deferDate',null)" title="Remove">&times;</span>
    </span>`;
  }

  chips += `<button class="note-page-add-meta" onclick="focusPageTitleForMeta('${note.id}')" title="Add metadata">+ Add</button>`;
  return chips;
}

/** Focus the page title and optionally append a trigger character for autocomplete. */
export function focusPageTitleForMeta(noteId) {
  const titleEl = document.querySelector('.note-page-title');
  if (!titleEl) return;
  titleEl.focus();
  // Place cursor at end and insert # to trigger autocomplete
  const range = document.createRange();
  const sel = window.getSelection();
  if (titleEl.childNodes.length > 0) {
    const lastNode = titleEl.childNodes[titleEl.childNodes.length - 1];
    if (lastNode.nodeType === Node.TEXT_NODE) {
      range.setStart(lastNode, lastNode.length);
    } else {
      range.setStartAfter(lastNode);
    }
  } else {
    range.setStart(titleEl, 0);
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  // Insert space + # to trigger autocomplete
  const text = titleEl.textContent || '';
  const suffix = text.endsWith(' ') ? '#' : ' #';
  document.execCommand('insertText', false, suffix);
  // Trigger input event for autocomplete
  noteAcNoteId = noteId;
  noteAcCheckTrigger(titleEl);
}

/** Focus page description area. */
export function focusPageDescription(noteId) {
  const descEl = document.querySelector('.note-page-description');
  if (descEl) {
    descEl.focus();
    // Place cursor at end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(descEl);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/** Focus page title area. */
export function focusPageTitle(noteId) {
  const titleEl = document.querySelector('.note-page-title');
  if (titleEl) {
    titleEl.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(titleEl);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/** Handle page title blur — save title (never auto-delete). */
export function handlePageTitleBlur(event, noteId) {
  const note = getActiveNoteById(noteId);
  if (!note) return;
  // Dismiss autocomplete popup with delay
  noteBlurTimeout = setTimeout(() => noteAcDismissPopup(), 150);

  const newTitle = event.target.textContent.trim();
  if (newTitle !== (note.title || '')) {
    note.title = newTitle;
    recordNoteChange(note, 'updated', { field: 'title' });
    saveTasksData();
    debouncedSaveToGithubSafe();
    // Update breadcrumb state
    const crumb = state.notesBreadcrumb.find(b => b.id === noteId);
    if (crumb) crumb.title = newTitle || 'Untitled';
  }
}

/** Handle page title keydown — Enter goes to description, arrows navigate. */
export function handlePageTitleKeydown(event, noteId) {
  // Let autocomplete popup handle keys when open
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

  // Cmd+Backspace → zoom out
  if (event.key === 'Backspace' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (state.zoomedNoteId) zoomOutOfNote();
    return;
  }

  // Enter → focus description (not newline in title)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    focusPageDescription(noteId);
    return;
  }

  // ArrowDown at end → focus description
  if (event.key === 'ArrowDown' && getCursorAtEnd(event.target)) {
    event.preventDefault();
    focusPageDescription(noteId);
    return;
  }
}

/** Handle description blur — save note.notes immediately. */
export function handleDescriptionBlur(event, noteId) {
  if (descriptionSaveTimer) {
    clearTimeout(descriptionSaveTimer);
    descriptionSaveTimer = null;
  }
  const note = getActiveNoteById(noteId);
  if (!note) return;
  const newNotes = event.target.textContent.trim();
  if (newNotes !== (note.notes || '')) {
    note.notes = newNotes;
    recordNoteChange(note, 'updated', { field: 'notes' });
    saveTasksData();
    debouncedSaveToGithubSafe();
  }
}

/** Handle description keydown — arrows navigate to title/children. */
export function handleDescriptionKeydown(event, noteId) {
  // Cmd+Backspace → zoom out
  if (event.key === 'Backspace' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (state.zoomedNoteId) zoomOutOfNote();
    return;
  }

  // ArrowUp at start → focus page title
  if (event.key === 'ArrowUp' && getCursorAtStart(event.target)) {
    event.preventDefault();
    focusPageTitle(noteId);
    return;
  }

  // ArrowDown at end → focus first child note
  if (event.key === 'ArrowDown' && getCursorAtEnd(event.target)) {
    event.preventDefault();
    const firstChild = document.querySelector('.note-item .note-input');
    if (firstChild) firstChild.focus();
    return;
  }

  // Enter = newline (default contenteditable behavior — don't prevent)
}

/** Handle description input — debounced auto-save. */
export function handleDescriptionInput(event, noteId) {
  if (descriptionSaveTimer) clearTimeout(descriptionSaveTimer);
  descriptionSaveTimer = setTimeout(() => {
    const note = getActiveNoteById(noteId);
    if (!note) return;
    const el = event.target;
    const newNotes = el.textContent.trim();
    if (newNotes !== (note.notes || '')) {
      note.notes = newNotes;
      recordNoteChange(note, 'updated', { field: 'notes' });
      saveTasksData();
      debouncedSaveToGithubSafe();
    }
    descriptionSaveTimer = null;
  }, 2000);
}

export function renderNotesBreadcrumb() {
  if (!state.zoomedNoteId || state.notesBreadcrumb.length === 0) return '';

  const currentCrumb = state.notesBreadcrumb[state.notesBreadcrumb.length - 1];
  const note = getActiveNoteById(state.zoomedNoteId);
  const ancestors = state.notesBreadcrumb.slice(0, -1);
  const parentLabel = ancestors.length > 0
    ? ancestors[ancestors.length - 1].title
    : 'All Notes';

  // Build breadcrumb trail
  const trail = ['All Notes', ...ancestors.map(a => escapeHtml(a.title))];

  return `
    <div class="note-page-header">
      <div class="note-page-nav">
        <button onclick="zoomOutOfNote()" class="notes-back-btn" title="Go back (Cmd+Backspace)">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          <span>${escapeHtml(parentLabel)}</span>
        </button>
      </div>
      ${trail.length > 1 ? `
        <div class="notes-breadcrumb-trail" style="margin-bottom:10px;">
          ${trail.map((t, i) => {
            if (i < trail.length - 1) {
              const crumbId = i === 0 ? null : ancestors[i - 1].id;
              return `<button onclick="navigateToBreadcrumb(${crumbId ? `'${crumbId}'` : 'null'})" class="notes-trail-link">${t}</button><span class="notes-trail-sep">/</span>`;
            }
            return `<span class="notes-trail-current">${t}</span>`;
          }).join('')}
        </div>
      ` : ''}
      <div contenteditable="true" class="note-page-title" data-placeholder="Untitled"
        onkeydown="handlePageTitleKeydown(event, '${state.zoomedNoteId}')"
        oninput="handleNoteInput(event, '${state.zoomedNoteId}')"
        onblur="handlePageTitleBlur(event, '${state.zoomedNoteId}')"
        onfocus="handleNoteFocus(event, '${state.zoomedNoteId}')"
        onpaste="handleNotePaste(event)"
      >${escapeHtml(currentCrumb.title || '')}</div>
      <div class="note-page-meta">${note ? buildPageMetaChipsHtml(note) : ''}</div>
      <div contenteditable="true" class="note-page-description" data-placeholder="Add a description..."
        onkeydown="handleDescriptionKeydown(event, '${state.zoomedNoteId}')"
        oninput="handleDescriptionInput(event, '${state.zoomedNoteId}')"
        onblur="handleDescriptionBlur(event, '${state.zoomedNoteId}')"
        onpaste="handleNotePaste(event)"
      >${escapeHtml(note?.notes || '')}</div>
    </div>
    <div class="note-page-separator"></div>
  `;
}

// ============================================================================
// Drag & Drop
// ============================================================================

export function handleNoteDragStart(event, noteId) {
  const isTouch = isTouchDevice();
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
  const dragged = getActiveNoteById(draggedId);
  const target = getActiveNoteById(targetId);
  if (!dragged || !target) return;

  // Safety: prevent dropping into own descendants
  if (isDescendantOf(targetId, draggedId)) return;

  if (position === 'child') {
    // Re-parent into target
    dragged.parentId = targetId;
    dragged.indent = (target.indent || 0) + 1;
    const newSiblings = state.tasksData
      .filter(t => isActiveNote(t) && t.parentId === targetId && t.id !== draggedId)
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
      .filter(t => isActiveNote(t) && t.parentId === target.parentId && t.areaId === target.areaId && t.id !== draggedId)
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

  recordNoteChange(dragged, 'updated', { field: 'hierarchy', type: 'reorder' });
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

  const hasMetaChips = note.areaId || (note.labels && note.labels.length > 0) || (note.people && note.people.length > 0) || note.deferDate;

  const isTouch = isTouchDevice();

  const noteHtml = `
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
        ${note.isNote
          ? `<button onclick="event.stopPropagation(); zoomIntoNote('${note.id}')"
              class="note-bullet ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'collapsed' : ''}"
              title="Open as page"
              aria-label="Open note as page">
              ${hasChildren
                ? '<span class="note-bullet-dot ' + (isCollapsed ? 'note-collapsed-ring' : '') + '"></span>'
                : '<span class="note-bullet-dot"></span>'}
            </button>`
          : `<button onclick="event.stopPropagation(); toggleTaskComplete('${note.id}')"
              class="note-checkbox-btn ${note.completed ? 'completed' : ''}"
              title="${note.completed ? 'Mark incomplete' : 'Mark complete'}"
              aria-label="${note.completed ? 'Mark incomplete' : 'Mark complete'}">
              <span class="note-checkbox-circle ${note.completed ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--text-muted)] hover:border-[var(--accent)]'}">
                ${note.completed ? '<svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </span>
            </button>`
        }

        <div class="note-content-col">
          <div contenteditable="true" class="note-input" data-placeholder="Type something..."
            onkeydown="handleNoteKeydown(event, '${note.id}')"
            oninput="handleNoteInput(event, '${note.id}')"
            onblur="handleNoteBlur(event, '${note.id}')"
            onfocus="handleNoteFocus(event, '${note.id}')"
            onpaste="handleNotePaste(event)"
          >${escapeHtml(note.title || '')}</div>
          ${hasMetaChips ? `<div class="note-meta-chips">${buildNoteMetaChipsHtml(note)}</div>` : ''}
        </div>

        ${isCollapsed && descendantCount > 0 ? `
          <span class="note-descendant-badge">${descendantCount}</span>
        ` : ''}

        <div class="note-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button onclick="event.stopPropagation(); toggleNoteTask('${note.id}')"
            class="note-action-btn" title="${note.isNote ? 'Convert to task (\u2318\u21e7\u21a9)' : 'Convert to note (\u2318\u21e7\u21a9)'}"
            aria-label="${note.isNote ? 'Convert to task' : 'Convert to note'}">
            ${note.isNote
              ? '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>'
              : '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
          </button>
          <button onclick="event.stopPropagation(); deleteNoteWithUndo('${note.id}')"
            class="note-action-btn note-action-btn-delete" title="Delete note" aria-label="Delete note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  if (isTouch) {
    return `
      <div class="swipe-row">
        <div class="swipe-actions-left">
          <button class="swipe-action-btn swipe-action-convert" onclick="event.stopPropagation(); window.toggleNoteTask('${note.id}')">
            ${note.isNote
              ? '<svg class="w-[22px] h-[22px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>'
              : '<svg class="w-[22px] h-[22px]" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
            <span>${note.isNote ? 'To Task' : 'To Note'}</span>
          </button>
        </div>
        <div class="swipe-row-content">${noteHtml}</div>
        <div class="swipe-actions-right">
          <button class="swipe-action-btn swipe-action-delete" onclick="event.stopPropagation(); window.deleteNoteWithUndo('${note.id}')">
            <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }

  return noteHtml;
}

export function renderNotesOutliner(filter = null) {
  const visibleNotes = getVisibleOrderedNotes(filter);

  if (visibleNotes.length === 0 && !state.zoomedNoteId) {
    return `
      <div class="text-center py-12 text-[var(--text-muted)]">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
          <svg class="w-6 h-6 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="4" cy="6" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="4" cy="18" r="2"/>
            <rect x="8" y="5" width="14" height="2" rx="1"/><rect x="8" y="11" width="14" height="2" rx="1"/><rect x="8" y="17" width="14" height="2" rx="1"/>
          </svg>
        </div>
        <p class="text-sm font-medium mb-1">No notes yet</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Capture the first thought and build from there</p>
      </div>
    `;
  }

  if (visibleNotes.length === 0 && state.zoomedNoteId) {
    return `
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No child notes</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Press the button below to add one</p>
        <button onclick="createRootNote()" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add note
        </button>
      </div>
    `;
  }

  return `<div class="notes-list">${visibleNotes.map(note => renderNoteItem(note)).join('')}</div>`;
}
