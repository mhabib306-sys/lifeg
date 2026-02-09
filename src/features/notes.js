import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, escapeHtml } from '../utils.js';

function compareNotes(a, b) {
  const timeA = new Date(a.createdAt || 0).getTime();
  const timeB = new Date(b.createdAt || 0).getTime();
  if (timeA !== timeB) return timeA - timeB;

  const updatedA = new Date(a.updatedAt || 0).getTime();
  const updatedB = new Date(b.updatedAt || 0).getTime();
  if (updatedA !== updatedB) return updatedA - updatedB;

  return String(a.id).localeCompare(String(b.id));
}

function getFilteredNotes(categoryId = null) {
  const all = state.tasksData.filter(t => t.isNote && !t.completed);
  return categoryId ? all.filter(n => n.categoryId === categoryId) : all;
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

function normalizeNotesForCategory(categoryId = null) {
  const notes = getFilteredNotes(categoryId).slice().sort(compareNotes);
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

function getVisibleOrderedNotes(categoryId = null) {
  const ordered = normalizeNotesForCategory(categoryId);
  const byParent = getChildrenByParent(ordered);
  const visible = [];

  const walkVisible = (parentId, ancestorCollapsed) => {
    const children = byParent.get(parentId) || [];
    children.forEach(child => {
      if (!ancestorCollapsed) {
        visible.push(child);
      }
      walkVisible(child.id, ancestorCollapsed || state.collapsedNotes.has(child.id));
    });
  };

  walkVisible('__root__', false);

  return visible;
}

function getNavigationNotes(currentNote) {
  const categoryFilter = state.activeCategoryFilter || null;
  const navCategory = categoryFilter || currentNote.categoryId || null;
  return getVisibleOrderedNotes(navCategory);
}

function persistAndRender(focusId = null) {
  saveTasksData();
  window.render();
  if (focusId) {
    setTimeout(() => focusNote(focusId), 60);
  }
}

/**
 * Persist collapsed note state to localStorage.
 */
export function saveCollapsedNotes() {
  localStorage.setItem('collapsedNotes', JSON.stringify([...state.collapsedNotes]));
}

/**
 * Toggle the collapse state of a note (expand/collapse children).
 */
export function toggleNoteCollapse(noteId) {
  if (state.collapsedNotes.has(noteId)) {
    state.collapsedNotes.delete(noteId);
  } else {
    state.collapsedNotes.add(noteId);
  }
  saveCollapsedNotes();
  window.render();
}

/**
 * Get notes in hierarchical order for display, optionally filtered by category.
 */
export function getNotesHierarchy(categoryId = null) {
  return normalizeNotesForCategory(categoryId);
}

/**
 * Check if a note has children.
 */
export function noteHasChildren(noteId) {
  return state.tasksData.some(t => t.isNote && !t.completed && t.parentId === noteId);
}

/**
 * Get direct children of a note.
 */
export function getNoteChildren(noteId) {
  return state.tasksData
    .filter(t => t.isNote && !t.completed && t.parentId === noteId)
    .sort(compareNotes);
}

/**
 * Create a root-level note in the current or provided category.
 */
export function createRootNote(categoryId = null) {
  const newNote = {
    id: generateTaskId(),
    title: '',
    notes: '',
    status: 'anytime',
    completed: false,
    completedAt: null,
    categoryId,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: true,
    parentId: null,
    indent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

/**
 * Indent a note (Tab key) - nests under previous visible note.
 */
export function indentNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const ordered = getNotesHierarchy(state.activeCategoryFilter || note.categoryId || null);
  const noteIdx = ordered.findIndex(n => n.id === noteId);
  if (noteIdx <= 0) return;

  const prev = ordered[noteIdx - 1];
  const maxIndent = 5;
  const nextIndent = Math.min((prev.indent || 0) + 1, maxIndent);
  if ((note.indent || 0) >= maxIndent || (nextIndent === (note.indent || 0) && note.parentId === prev.id)) return;

  note.parentId = prev.id;
  note.indent = nextIndent;
  note.updatedAt = new Date().toISOString();
  persistAndRender(noteId);
}

/**
 * Outdent a note (Shift+Tab key) - moves note up one level while preserving subtree.
 */
export function outdentNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note || (note.indent || 0) <= 0) return;

  const parent = note.parentId ? state.tasksData.find(t => t.id === note.parentId) : null;
  note.parentId = parent ? parent.parentId || null : null;
  note.indent = Math.max(0, (note.indent || 0) - 1);
  note.updatedAt = new Date().toISOString();
  persistAndRender(noteId);
}

/**
 * Create a new note at the same level as current (right after it).
 */
export function createNoteAfter(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const siblings = state.tasksData
    .filter(t => t.isNote && !t.completed && t.parentId === note.parentId && t.categoryId === note.categoryId)
    .sort(compareNotes);

  const siblingIdx = siblings.findIndex(s => s.id === noteId);
  const nextSibling = siblings[siblingIdx + 1];

  const currentTime = new Date(note.createdAt || Date.now()).getTime();
  const nextTime = nextSibling ? new Date(nextSibling.createdAt || Date.now()).getTime() : (Date.now() + 1000);
  const midpoint = currentTime + Math.max(1, Math.floor((nextTime - currentTime) / 2));

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
    createdAt: new Date(midpoint).toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

/**
 * Create a child note under current (as first child).
 */
export function createChildNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const existingChildren = getNoteChildren(noteId);
  const firstChildTime = existingChildren.length > 0 ? new Date(existingChildren[0].createdAt || Date.now()).getTime() : null;
  const childTime = firstChildTime ? firstChildTime - 1000 : Date.now();

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
    createdAt: new Date(childTime).toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (state.collapsedNotes.has(noteId)) {
    state.collapsedNotes.delete(noteId);
    saveCollapsedNotes();
  }

  state.tasksData.push(newNote);
  persistAndRender(newNote.id);
}

/**
 * Delete note and optionally its children. If not deleting children,
 * promotes descendants one level up while preserving tree structure.
 */
export function deleteNote(noteId, deleteChildren = false) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

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
 * Focus a note's input field and move cursor to end.
 */
export function focusNote(noteId) {
  const input = document.querySelector(`[data-note-id="${noteId}"] .note-input`);
  if (input) {
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;
  }
}

/**
 * Handle note keydown events (Tab, Shift+Tab, Enter, Backspace, arrow keys).
 */
export function handleNoteKeydown(event, noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      outdentNote(noteId);
    } else {
      indentNote(noteId);
    }
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const input = event.target;
    const nextTitle = input.value.trim();
    if (nextTitle !== (note.title || '')) {
      note.title = nextTitle;
      note.updatedAt = new Date().toISOString();
      saveTasksData();
    }
    createNoteAfter(noteId);
    return;
  }

  if (event.key === 'Backspace' && event.target.value === '' && event.target.selectionStart === 0) {
    event.preventDefault();
    const visible = getNavigationNotes(note);
    const idx = visible.findIndex(n => n.id === noteId);
    const prevId = idx > 0 ? visible[idx - 1].id : null;
    deleteNote(noteId);
    if (prevId) {
      setTimeout(() => focusNote(prevId), 60);
    }
    return;
  }

  if (event.key === 'ArrowUp' && event.target.selectionStart === 0) {
    event.preventDefault();
    const visible = getNavigationNotes(note);
    const idx = visible.findIndex(n => n.id === noteId);
    if (idx > 0) {
      focusNote(visible[idx - 1].id);
    }
    return;
  }

  if (event.key === 'ArrowDown' && event.target.selectionStart === event.target.value.length) {
    event.preventDefault();
    const visible = getNavigationNotes(note);
    const idx = visible.findIndex(n => n.id === noteId);
    if (idx >= 0 && idx < visible.length - 1) {
      focusNote(visible[idx + 1].id);
    }
  }
}

/**
 * Update note title on blur. Deletes untouched empty notes.
 */
export function handleNoteBlur(event, noteId) {
  const note = state.tasksData.find(t => t.id === noteId && t.isNote && !t.completed);
  if (!note) return;

  const newTitle = event.target.value.trim();
  const previousTitle = note.title || '';

  if (newTitle === '' && previousTitle === '' && !noteHasChildren(noteId)) {
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

/**
 * Render a single note item in the outliner view.
 */
export function renderNoteItem(note) {
  const hasChildren = noteHasChildren(note.id);
  const isCollapsed = state.collapsedNotes.has(note.id);
  const isEditing = state.editingNoteId === note.id;

  return `
    <div class="note-item ${isCollapsed ? 'note-collapsed' : ''} ${isEditing ? 'editing' : ''}" data-note-id="${note.id}" style="--note-depth:${note.indent || 0};">
      <div class="note-row group">
        <button onclick="event.stopPropagation(); ${hasChildren ? `toggleNoteCollapse('${note.id}')` : `createChildNote('${note.id}')`}"
          class="note-toggle ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'collapsed' : ''}"
          title="${hasChildren ? (isCollapsed ? 'Expand note' : 'Collapse note') : 'Add child note'}"
          aria-label="${hasChildren ? (isCollapsed ? 'Expand note' : 'Collapse note') : 'Add child note'}">
          ${hasChildren ? `
            <svg class="note-toggle-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.23 4.21a.75.75 0 011.06.02l5.25 5.5a.75.75 0 010 1.04l-5.25 5.5a.75.75 0 01-1.08-1.04L11 10.25 6.21 5.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
          ` : '<span class="note-dot"></span>'}
        </button>

        <input type="text"
          class="note-input"
          value="${escapeHtml(note.title || '')}"
          placeholder="Type something..."
          onkeydown="handleNoteKeydown(event, '${note.id}')"
          onblur="handleNoteBlur(event, '${note.id}')"
          onfocus="editingNoteId='${note.id}'">

        <div class="note-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button onclick="event.stopPropagation(); createNoteAfter('${note.id}')"
            class="note-action-btn" title="Add note below (Enter)" aria-label="Add note below">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); editingTaskId='${note.id}'; showTaskModal=true; render()"
            class="note-action-btn" title="Edit note details" aria-label="Edit note details">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); deleteNote('${note.id}')"
            class="note-action-btn" title="Delete note" aria-label="Delete note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render notes in outliner format with hierarchical collapse/expand.
 */
export function renderNotesOutliner(categoryId = null) {
  const visibleNotes = getVisibleOrderedNotes(categoryId);

  if (visibleNotes.length === 0) {
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

  return visibleNotes.map(note => renderNoteItem(note)).join('');
}
