import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, escapeHtml } from '../utils.js';

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
  let notes = state.tasksData.filter(t => t.isNote && !t.completed);
  if (categoryId) {
    notes = notes.filter(n => n.categoryId === categoryId);
  }
  // Sort by creation date, maintaining parent-child relationships
  return notes.sort((a, b) => {
    if (a.indent !== b.indent) return a.indent - b.indent;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

/**
 * Check if a note has children.
 */
export function noteHasChildren(noteId) {
  return state.tasksData.some(t => t.isNote && t.parentId === noteId && !t.completed);
}

/**
 * Get direct children of a note.
 */
export function getNoteChildren(noteId) {
  return state.tasksData.filter(t => t.isNote && t.parentId === noteId && !t.completed);
}

/**
 * Indent a note (Tab key) -- increases nesting level under previous sibling.
 */
export function indentNote(noteId) {
  const notes = state.tasksData.filter(t => t.isNote && !t.completed);
  const noteIdx = notes.findIndex(t => t.id === noteId);
  if (noteIdx <= 0) return;

  const note = notes[noteIdx];
  const maxIndent = 5; // Maximum nesting level
  if ((note.indent || 0) >= maxIndent) return;

  // Find previous note that could be the parent
  for (let i = noteIdx - 1; i >= 0; i--) {
    const prev = notes[i];
    if (prev.categoryId === note.categoryId && (prev.indent || 0) <= (note.indent || 0)) {
      note.parentId = prev.id;
      note.indent = (note.indent || 0) + 1;
      note.updatedAt = new Date().toISOString();
      saveTasksData();
      window.render();
      // Refocus the note after render
      setTimeout(() => focusNote(noteId), 50);
      return;
    }
  }
}

/**
 * Outdent a note (Shift+Tab key) -- decreases nesting level, re-parents children.
 */
export function outdentNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId);
  if (!note || !note.isNote || (note.indent || 0) <= 0) return;

  // Find grandparent (parent's parent) for correct re-parenting
  const parent = note.parentId ? state.tasksData.find(t => t.id === note.parentId) : null;
  const grandparentId = parent ? parent.parentId : null;

  // Move children up with the note
  const children = getNoteChildren(noteId);
  children.forEach(child => {
    child.parentId = note.parentId;
  });

  note.indent = (note.indent || 0) - 1;
  note.parentId = note.indent === 0 ? null : grandparentId;
  note.updatedAt = new Date().toISOString();
  saveTasksData();
  window.render();
  setTimeout(() => focusNote(noteId), 50);
}

/**
 * Create a new note at the same level as current (right after it).
 */
export function createNoteAfter(noteId) {
  const note = state.tasksData.find(t => t.id === noteId);
  if (!note) return;

  // Find the next sibling note at same level (to insert between current and next)
  const siblings = state.tasksData.filter(t =>
    t.isNote && !t.completed &&
    t.parentId === note.parentId &&
    t.categoryId === note.categoryId
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const siblingIdx = siblings.findIndex(s => s.id === noteId);
  const nextSibling = siblings[siblingIdx + 1];

  // Calculate a createdAt timestamp between current note and next sibling
  const currentTime = new Date(note.createdAt).getTime();
  const nextTime = nextSibling ? new Date(nextSibling.createdAt).getTime() : Date.now() + 1000;
  const newTime = currentTime + Math.floor((nextTime - currentTime) / 2);

  // Create the new note with the calculated timestamp
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
    createdAt: new Date(newTime).toISOString(),
    updatedAt: new Date().toISOString()
  };

  const insertIdx = state.tasksData.findIndex(t => t.id === noteId);
  if (insertIdx >= 0) {
    state.tasksData.splice(insertIdx + 1, 0, newNote);
  } else {
    state.tasksData.push(newNote);
  }
  saveTasksData();
  window.render();
  setTimeout(() => focusNote(newNote.id), 50);
}

/**
 * Create a child note under current (as first child).
 */
export function createChildNote(noteId) {
  const note = state.tasksData.find(t => t.id === noteId);
  if (!note) return;

  // Get existing children to determine timestamp
  const existingChildren = state.tasksData.filter(t =>
    t.isNote && !t.completed && t.parentId === noteId
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Set timestamp before first child (or current time if no children)
  let newTime;
  if (existingChildren.length > 0) {
    const firstChildTime = new Date(existingChildren[0].createdAt).getTime();
    newTime = firstChildTime - 1000; // 1 second before first child
  } else {
    newTime = Date.now();
  }

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
    createdAt: new Date(newTime).toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.tasksData.push(newNote);
  saveTasksData();
  window.render();
  setTimeout(() => focusNote(newNote.id), 50);
}

/**
 * Delete note and optionally its children. If not deleting children,
 * promotes them to the deleted note's parent level.
 */
export function deleteNote(noteId, deleteChildren = false) {
  const note = state.tasksData.find(t => t.id === noteId);
  if (!note) return;

  if (deleteChildren) {
    // Recursively delete children
    const toDelete = [noteId];
    const findChildren = (parentId) => {
      state.tasksData.filter(t => t.parentId === parentId).forEach(child => {
        toDelete.push(child.id);
        findChildren(child.id);
      });
    };
    findChildren(noteId);
    state.tasksData = state.tasksData.filter(t => !toDelete.includes(t.id));
  } else {
    // Move children up to parent level
    const children = getNoteChildren(noteId);
    children.forEach(child => {
      child.parentId = note.parentId;
      child.indent = note.indent || 0;
    });
    state.tasksData = state.tasksData.filter(t => t.id !== noteId);
  }

  saveTasksData();
  window.render();
}

/**
 * Focus a note's input field and move cursor to end.
 */
export function focusNote(noteId) {
  const input = document.querySelector(`[data-note-id="${noteId}"] .note-input`);
  if (input) {
    input.focus();
    // Move cursor to end
    input.selectionStart = input.selectionEnd = input.value.length;
  }
}

/**
 * Handle note keydown events (Tab, Shift+Tab, Enter, Backspace, arrow keys).
 */
export function handleNoteKeydown(event, noteId) {
  const note = state.tasksData.find(t => t.id === noteId);
  if (!note) return;

  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      outdentNote(noteId);
    } else {
      indentNote(noteId);
    }
  } else if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    // Save current note first
    const input = event.target;
    if (input.value.trim() !== note.title) {
      note.title = input.value.trim();
      note.updatedAt = new Date().toISOString();
      saveTasksData();
    }
    // Create new note
    createNoteAfter(noteId);
  } else if (event.key === 'Backspace' && event.target.value === '' && event.target.selectionStart === 0) {
    event.preventDefault();
    // Delete empty note and focus previous
    const notes = state.tasksData.filter(t => t.isNote && !t.completed && t.categoryId === note.categoryId);
    const noteIdx = notes.findIndex(t => t.id === noteId);
    if (noteIdx > 0) {
      const prevNote = notes[noteIdx - 1];
      deleteNote(noteId);
      setTimeout(() => focusNote(prevNote.id), 50);
    } else if (notes.length === 1) {
      deleteNote(noteId);
    }
  } else if (event.key === 'ArrowUp' && event.target.selectionStart === 0) {
    event.preventDefault();
    const notes = state.tasksData.filter(t => t.isNote && !t.completed && t.categoryId === note.categoryId);
    const noteIdx = notes.findIndex(t => t.id === noteId);
    if (noteIdx > 0) {
      focusNote(notes[noteIdx - 1].id);
    }
  } else if (event.key === 'ArrowDown' && event.target.selectionStart === event.target.value.length) {
    event.preventDefault();
    const notes = state.tasksData.filter(t => t.isNote && !t.completed && t.categoryId === note.categoryId);
    const noteIdx = notes.findIndex(t => t.id === noteId);
    if (noteIdx < notes.length - 1) {
      focusNote(notes[noteIdx + 1].id);
    }
  }
}

/**
 * Update note title on blur. Deletes empty notes that were never given a title.
 */
export function handleNoteBlur(event, noteId) {
  const note = state.tasksData.find(t => t.id === noteId);
  if (!note) return;

  const newTitle = event.target.value.trim();
  if (newTitle !== note.title) {
    if (newTitle === '' && note.title === '') {
      // Delete empty notes
      deleteNote(noteId);
    } else {
      note.title = newTitle;
      note.updatedAt = new Date().toISOString();
      saveTasksData();
    }
  }
}

// ============================================================================
// Note Rendering
// ============================================================================

/**
 * Render a single note item in the outliner view.
 */
export function renderNoteItem(note, allNotes) {
  const hasChildren = noteHasChildren(note.id);
  const isCollapsed = state.collapsedNotes.has(note.id);
  const indentPx = (note.indent || 0) * 24;

  return `
    <div class="note-item ${isCollapsed ? 'note-collapsed' : ''}" data-note-id="${note.id}" style="padding-left: ${indentPx}px;">
      <div class="flex items-start gap-2 py-1.5 px-4 group">
        <button onclick="event.stopPropagation(); ${hasChildren ? `toggleNoteCollapse('${note.id}')` : `createChildNote('${note.id}')`}"
          class="note-bullet mt-1.5 ${hasChildren ? (isCollapsed ? 'collapsed' : 'has-children') : ''}"
          title="${hasChildren ? (isCollapsed ? 'Expand' : 'Collapse') : 'Add child note'}">
        </button>
        <input type="text"
          class="note-input flex-1"
          value="${(note.title || '').replace(/"/g, '&quot;')}"
          placeholder="Type something..."
          onkeydown="handleNoteKeydown(event, '${note.id}')"
          onblur="handleNoteBlur(event, '${note.id}')"
          onfocus="editingNoteId='${note.id}'">
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="event.stopPropagation(); createNoteAfter('${note.id}')"
            class="p-1 text-charcoal/30 hover:text-purple-500 rounded" title="Add note below (Enter)">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); editingTaskId='${note.id}'; showTaskModal=true; render()"
            class="p-1 text-charcoal/30 hover:text-blue-500 rounded" title="Edit note details">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); deleteNote('${note.id}')"
            class="p-1 text-charcoal/30 hover:text-red-500 rounded" title="Delete note">
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
  const notes = state.tasksData.filter(t => t.isNote && !t.completed);
  const filteredNotes = categoryId ? notes.filter(n => n.categoryId === categoryId) : notes;

  // Build hierarchy - only show root notes and non-collapsed children
  const visibleNotes = [];
  const addVisibleNotes = (parentId, parentCollapsed) => {
    filteredNotes
      .filter(n => n.parentId === parentId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .forEach(note => {
        if (!parentCollapsed) {
          visibleNotes.push(note);
        }
        addVisibleNotes(note.id, parentCollapsed || state.collapsedNotes.has(note.id));
      });
  };

  // Start with root notes (no parent or parent is null)
  filteredNotes
    .filter(n => !n.parentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach(note => {
      visibleNotes.push(note);
      addVisibleNotes(note.id, state.collapsedNotes.has(note.id));
    });

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
        <p class="text-xs text-charcoal/30 mb-3">Start typing to capture your thoughts</p>
      </div>
    `;
  }

  return visibleNotes.map(note => renderNoteItem(note, filteredNotes)).join('');
}
