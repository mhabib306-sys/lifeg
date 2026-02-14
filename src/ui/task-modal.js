// ============================================================================
// TASK MODAL UI MODULE
// ============================================================================
// Contains task modal rendering, state management, inline editing,
// quick-add, inline tag/person creation, and modal autocomplete system.
//
// Entity modals (category/label/person/perspective) are in ui/entity-modals.js.
// Inline autocomplete engine (#/@/&/!) is in features/inline-autocomplete.js.

import { state } from '../state.js';
import { createTask, updateTask, deleteTask } from '../features/tasks.js';
import { createLabel, createPerson, getCategoriesByArea, getCategoryById } from '../features/areas.js';
import { escapeHtml, formatSmartDate, renderPersonAvatar, isMobileViewport } from '../utils.js';
import {
  getActiveIcons,
  _css,
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY
} from '../constants.js';
import {
  setupInlineAutocomplete,
  cleanupInlineAutocomplete,
  renderInlineChips
} from '../features/inline-autocomplete.js';

function debouncedSaveToGithub() {
  if (typeof window.debouncedSaveToGithub === 'function') {
    window.debouncedSaveToGithub();
  }
}

// ============================================================================
// INLINE EDITING (Task list inline rename)
// ============================================================================

/**
 * Start inline editing a task title in the task list.
 * Sets the inlineEditingTaskId and re-renders, then focuses the input.
 * @param {string} taskId - ID of the task to edit inline
 */
export function startInlineEdit(taskId) {
  state.inlineEditingTaskId = taskId;
  window.render();
  // Focus the input after render - use 100ms for reliable iOS keyboard appearance
  setTimeout(() => {
    const input = document.getElementById('inline-edit-input');
    if (input) {
      input.focus();
      input.select();
      // Setup inline autocomplete with existing task metadata
      const task = state.tasksData.find(t => t.id === taskId);
      if (task) {
        setupInlineAutocomplete('inline-edit-input', {
          initialMeta: {
            areaId: task.areaId || null,
            labels: task.labels ? [...task.labels] : [],
            people: task.people ? [...task.people] : []
          }
        });
      }
    }
  }, 100);
}

/**
 * Save inline edit: reads the input value, merges any inline autocomplete
 * metadata, updates the task, and re-renders.
 * @param {string} taskId - ID of the task being edited
 */
export function saveInlineEdit(taskId) {
  const input = document.getElementById('inline-edit-input');
  if (input) {
    const newTitle = input.value.trim();
    if (newTitle) {
      const updates = { title: newTitle };
      // Merge inline autocomplete metadata
      const inlineMeta = state.inlineAutocompleteMeta.get('inline-edit-input');
      if (inlineMeta) {
        if (inlineMeta.areaId !== undefined) updates.areaId = inlineMeta.areaId;
        if (inlineMeta.categoryId !== undefined) updates.categoryId = inlineMeta.categoryId;
        if (inlineMeta.labels) updates.labels = inlineMeta.labels;
        if (inlineMeta.people) updates.people = inlineMeta.people;
        if (inlineMeta.deferDate) updates.deferDate = inlineMeta.deferDate;
        if (inlineMeta.dueDate) updates.dueDate = inlineMeta.dueDate;
      }
      updateTask(taskId, updates);
    } else {
      // Empty title — delete the task
      deleteTask(taskId);
    }
  }
  cleanupInlineAutocomplete('inline-edit-input');
  state.inlineEditingTaskId = null;
  window.render();
}

/**
 * Cancel inline editing without saving.
 */
export function cancelInlineEdit() {
  // Delete the task if it has no title (was just created via + button)
  if (state.inlineEditingTaskId) {
    const task = state.tasksData.find(t => t.id === state.inlineEditingTaskId);
    if (task && !task.title) {
      deleteTask(task.id);
    }
  }
  cleanupInlineAutocomplete('inline-edit-input');
  state.inlineEditingTaskId = null;
  window.render();
}

/**
 * Handle keydown in inline edit input: Enter saves, Escape cancels.
 * Respects _inlineAcHandled flag from inline autocomplete.
 * @param {KeyboardEvent} event
 * @param {string} taskId
 */
export function handleInlineEditKeydown(event, taskId) {
  if (event._inlineAcHandled) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    saveInlineEdit(taskId);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    cancelInlineEdit();
  }
}

// ============================================================================
// CONTENTEDITABLE INLINE EDITING (seamless, no mode switch)
// ============================================================================

/** Handle focus on contenteditable task title */
export function handleTaskInlineFocus(event, taskId) {
  state.inlineEditingTaskId = taskId;
  const el = event.target;
  el.dataset.originalTitle = el.textContent.trim();
}

/** Handle blur on contenteditable task title — auto-save */
export function handleTaskInlineBlur(event, taskId) {
  if (!state.inlineEditingTaskId) return;
  const el = event.target;
  const newTitle = el.textContent.trim();
  state.inlineEditingTaskId = null;
  if (newTitle && newTitle !== el.dataset.originalTitle) {
    updateTask(taskId, { title: newTitle });
    window.render();
  } else if (!newTitle) {
    const task = state.tasksData.find(t => t.id === taskId);
    if (task && !task.title) {
      // Newly created task via quick-add with no title — clean up
      deleteTask(taskId);
      window.render();
    } else if (task && task.title) {
      // Existing task cleared — revert to original title
      el.textContent = task.title;
    }
  }
}

/** Handle keydown in contenteditable task title */
export function handleTaskInlineKeydown(event, taskId) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    event.target.blur(); // triggers save via blur handler
  } else if (event.key === 'Escape') {
    event.preventDefault();
    const el = event.target;
    const task = state.tasksData.find(t => t.id === taskId);
    state.inlineEditingTaskId = null;
    if (task && !task.title) {
      // Empty quick-add task — delete it (blur handler won't fire cleanup since we cleared inlineEditingTaskId)
      deleteTask(taskId);
      window.render();
      return;
    }
    if (task) el.textContent = task.title;
    el.blur();
  }
}

/** Handle input on contenteditable task title — enforce maxlength */
export function handleTaskInlineInput(event, taskId) {
  const el = event.target;
  const text = el.textContent || '';
  if (text.length > 500) {
    el.textContent = text.slice(0, 500);
    // Place cursor at end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/** Strip HTML from pasted content in contenteditable task title */
export function handleTaskInlinePaste(event) {
  event.preventDefault();
  const text = (event.clipboardData || window.clipboardData).getData('text/plain');
  const clean = text.replace(/[\r\n]+/g, ' ').trim();
  const sel = window.getSelection();
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(clean));
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * Focus a contenteditable task title after render.
 * Used by quick-add flows to focus the newly created task.
 */
export function focusTaskInlineTitle(taskId) {
  setTimeout(() => {
    const el = document.querySelector(`.task-inline-title[data-task-id="${taskId}"]`);
    if (el) {
      el.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      if (el.childNodes.length > 0) {
        const lastNode = el.childNodes[el.childNodes.length - 1];
        range.setStartAfter(lastNode);
      } else {
        range.setStart(el, 0);
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, 100);
}

// ============================================================================
// OPEN NEW TASK MODAL
// ============================================================================

/**
 * Open the task creation modal, setting context based on the current view
 * (category, label, person, or perspective).
 */
export function openNewTaskModal() {
  state.editingTaskId = null;
  // Set context based on current view
  if (state.activeFilterType === 'subcategory' && state.activeCategoryFilter) {
    const subcat = getCategoryById(state.activeCategoryFilter);
    state.newTaskContext = { areaId: subcat?.areaId || null, categoryId: state.activeCategoryFilter, labelId: null, labelIds: null, personId: null, status: 'inbox' };
  } else if (state.activeFilterType === 'area' && state.activeAreaFilter) {
    state.newTaskContext = { areaId: state.activeAreaFilter, categoryId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    state.newTaskContext = { areaId: null, labelId: state.activeLabelFilter, labelIds: null, personId: null, status: 'inbox' };
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: state.activePersonFilter, status: 'inbox' };
  } else if (state.activeFilterType === 'perspective') {
    // Check if it's a custom perspective
    const customPerspective = state.customPerspectives.find(p => p.id === state.activePerspective);
    if (customPerspective && customPerspective.filter) {
      // Apply custom perspective filter rules
      const customStatus = customPerspective.filter.status === 'today' ? 'anytime' : (customPerspective.filter.status || 'inbox');
      const customToday = customPerspective.filter.status === 'today';
      state.newTaskContext = {
        areaId: customPerspective.filter.categoryId || null,
        labelId: null,
        labelIds: customPerspective.filter.labelIds || null,
        personId: null,
        status: customStatus,
        today: customToday,
        flagged: customPerspective.filter.statusRule === 'flagged'
      };
    } else {
      // Built-in perspective - set status based on perspective
      const statusMap = { inbox: 'inbox', today: 'anytime', anytime: 'anytime', someday: 'someday' };
      state.newTaskContext = {
        areaId: null,
        labelId: null,
        labelIds: null,
        personId: null,
        status: statusMap[state.activePerspective] || 'inbox',
        today: state.activePerspective === 'today',
        flagged: state.activePerspective === 'flagged'
      };
    }
  } else {
    state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
  }
  state.showTaskModal = true;
  window.render();
  // Auto-focus title input after render
  setTimeout(() => {
    const titleInput = document.getElementById('task-title');
    if (titleInput) titleInput.focus();
  }, 50);
}

// ============================================================================
// QUICK ADD TASK
// ============================================================================

/**
 * Quick add a task from an input element, using current context
 * (category, label, person, or perspective status).
 * @param {HTMLInputElement} inputElement - The quick-add input
 */
export function quickAddTask(inputElement) {
  const title = inputElement.value.trim();
  if (!title) return;

  // Build options based on current context
  const options = { status: 'inbox' };

  // If in Notes perspective, always create a note (even when filtering by category/label/person)
  if (state.activePerspective === 'notes') {
    options.isNote = true;
    options.status = 'anytime'; // Notes go to anytime by default
  }

  // If quick-add toggle is set to note mode
  if (state.quickAddIsNote) {
    options.isNote = true;
    options.status = 'anytime';
  }

  // Apply category/label/person context
  if (state.activeFilterType === 'subcategory' && state.activeCategoryFilter) {
    const subcat = getCategoryById(state.activeCategoryFilter);
    options.areaId = subcat?.areaId || null;
    options.categoryId = state.activeCategoryFilter;
  } else if (state.activeFilterType === 'area' && state.activeAreaFilter) {
    options.areaId = state.activeAreaFilter;
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    options.labels = [state.activeLabelFilter];
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    options.people = [state.activePersonFilter];
  } else if (state.activeFilterType === 'perspective' && state.activePerspective && state.activePerspective !== 'notes') {
    // Handle custom and built-in perspectives (notes already handled above)
    const customPerspective = state.customPerspectives.find(p => p.id === state.activePerspective);
    if (customPerspective && customPerspective.filter) {
      // Apply custom perspective filter rules
      if (customPerspective.filter.status) {
        if (customPerspective.filter.status === 'today') {
          options.status = 'anytime';
          options.today = true;
        } else {
          options.status = customPerspective.filter.status;
        }
      }
      if (customPerspective.filter.categoryId) options.areaId = customPerspective.filter.categoryId;
      if (customPerspective.filter.labelIds && customPerspective.filter.labelIds.length > 0) {
        options.labels = customPerspective.filter.labelIds;
      }
      if (customPerspective.filter.statusRule === 'flagged') options.flagged = true;
    } else {
      // Built-in perspective - set status based on perspective
      const statusMap = { inbox: 'inbox', today: 'anytime', anytime: 'anytime', someday: 'someday', flagged: 'anytime' };
      if (statusMap[state.activePerspective]) {
        options.status = statusMap[state.activePerspective];
        if (state.activePerspective === 'today') options.today = true;
        if (state.activePerspective === 'flagged') options.flagged = true;
      }
    }
  }

  // Merge inline autocomplete metadata
  const inlineMeta = state.inlineAutocompleteMeta.get('quick-add-input');
  if (inlineMeta) {
    if (inlineMeta.areaId) options.areaId = inlineMeta.areaId;
    if (inlineMeta.categoryId) options.categoryId = inlineMeta.categoryId;
    if (inlineMeta.labels && inlineMeta.labels.length) options.labels = [...(options.labels || []), ...inlineMeta.labels.filter(l => !(options.labels || []).includes(l))];
    if (inlineMeta.people && inlineMeta.people.length) options.people = [...(options.people || []), ...inlineMeta.people.filter(p => !(options.people || []).includes(p))];
    if (inlineMeta.deferDate) options.deferDate = inlineMeta.deferDate;
    if (inlineMeta.dueDate) options.dueDate = inlineMeta.dueDate;
  }

  createTask(title, options);
  inputElement.value = '';
  state.quickAddIsNote = false;
  cleanupInlineAutocomplete('quick-add-input');
  window.render();

  // Re-focus the quick-add input after render
  setTimeout(() => {
    const quickInput = document.getElementById('quick-add-input');
    if (quickInput) quickInput.focus();
  }, 50);
}

/**
 * Handle Enter key in quick-add input.
 * Respects _inlineAcHandled flag from inline autocomplete.
 * @param {KeyboardEvent} event
 * @param {HTMLInputElement} inputElement
 */
export function handleQuickAddKeydown(event, inputElement) {
  if (event._inlineAcHandled) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    quickAddTask(inputElement);
  }
}

// ============================================================================
// INLINE TAG / PERSON CREATION IN MODAL
// ============================================================================

/**
 * Toggle the inline tag creation form inside the task modal.
 */
export function toggleInlineTagInput() {
  state.showInlineTagInput = !state.showInlineTagInput;
  const container = document.getElementById('inline-tag-form');
  if (container) {
    if (state.showInlineTagInput) {
      container.innerHTML = `
        <div class="modal-inline-form flex items-center gap-2 mt-2 p-2 bg-[var(--bg-secondary)]/30 rounded-lg">
          <input type="text" id="inline-tag-name" placeholder="Tag name"
            class="modal-inline-input flex-1 px-2 py-1.5 text-sm border border-[var(--border-light)] rounded-md focus:border-[var(--accent)] focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlineTag();}">
          <input type="color" id="inline-tag-color" value="#6B7280" class="w-8 h-8 rounded-md cursor-pointer border-0">
          <button type="button" onclick="addInlineTag()" class="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)]">Add</button>
          <button type="button" onclick="toggleInlineTagInput()" class="px-2 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
      `;
      setTimeout(() => document.getElementById('inline-tag-name')?.focus(), 50);
    } else {
      container.innerHTML = '';
    }
  }
}

/**
 * Add a new tag from the inline creation form in the modal,
 * then re-render the tags section with the new tag pre-selected.
 */
export function addInlineTag() {
  const name = document.getElementById('inline-tag-name')?.value?.trim();
  const color = document.getElementById('inline-tag-color')?.value || '#6B7280';
  if (name) {
    const newTag = createLabel(name, color);
    state.showInlineTagInput = false;
    // Re-render the tags section and pre-select the new tag
    const labelsContainer = document.getElementById('task-labels-container');
    if (labelsContainer) {
      // Get currently selected tags
      const selectedTags = Array.from(document.querySelectorAll('.task-label-checkbox:checked')).map(cb => cb.value);
      selectedTags.push(newTag.id); // Add the new tag as selected

      // Re-render tags
      labelsContainer.innerHTML = state.taskLabels.map(label => {
        const isSelected = selectedTags.includes(label.id);
        return `
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded-md border cursor-pointer transition ${isSelected ? 'bg-[var(--bg-secondary)]' : 'hover:bg-[var(--bg-secondary)]/50'}" style="border-color: ${label.color}">
            <input type="checkbox" value="${label.id}" ${isSelected ? 'checked' : ''} class="task-label-checkbox rounded-sm" style="accent-color: ${label.color}">
            <span class="text-sm" style="color: ${label.color}">${escapeHtml(label.name)}</span>
          </label>
        `;
      }).join('') + `
        <button onclick="toggleInlineTagInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md border border-dashed border-[var(--border-light)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `;
    }
    document.getElementById('inline-tag-form').innerHTML = '';
  }
}

/**
 * Toggle the inline person creation form inside the task modal.
 */
export function toggleInlinePersonInput() {
  state.showInlinePersonInput = !state.showInlinePersonInput;
  const container = document.getElementById('inline-person-form');
  if (container) {
    if (state.showInlinePersonInput) {
      container.innerHTML = `
        <div class="modal-inline-form flex items-center gap-2 mt-2 p-2 bg-[var(--bg-secondary)]/30 rounded-lg">
          <input type="text" id="inline-person-name" placeholder="Person name"
            class="modal-inline-input flex-1 px-2 py-1.5 text-sm border border-[var(--border-light)] rounded-md focus:border-[var(--accent)] focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlinePerson();}">
          <button type="button" onclick="addInlinePerson()" class="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)]">Add</button>
          <button type="button" onclick="toggleInlinePersonInput()" class="px-2 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
      `;
      setTimeout(() => document.getElementById('inline-person-name')?.focus(), 50);
    } else {
      container.innerHTML = '';
    }
  }
}

/**
 * Add a new person from the inline creation form in the modal,
 * then re-render the people section with the new person pre-selected.
 */
export function addInlinePerson() {
  const name = document.getElementById('inline-person-name')?.value?.trim();
  if (name) {
    const newPerson = createPerson(name);
    state.showInlinePersonInput = false;
    // Re-render the people section and pre-select the new person
    const peopleContainer = document.getElementById('task-people-container');
    if (peopleContainer) {
      // Get currently selected people
      const selectedPeople = Array.from(document.querySelectorAll('.task-person-checkbox:checked')).map(cb => cb.value);
      selectedPeople.push(newPerson.id); // Add the new person as selected

      // Re-render people
      peopleContainer.innerHTML = state.taskPeople.map(person => {
        const isSelected = selectedPeople.includes(person.id);
        return `
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-light)] cursor-pointer transition ${isSelected ? 'bg-[var(--bg-secondary)] border-[var(--border)]' : 'hover:bg-[var(--bg-secondary)]/50'}">
            <input type="checkbox" value="${person.id}" ${isSelected ? 'checked' : ''} class="task-person-checkbox rounded-sm">
            <span class="text-sm text-[var(--text-secondary)]">${escapeHtml(person.name)}</span>
          </label>
        `;
      }).join('') + `
        <button onclick="toggleInlinePersonInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md border border-dashed border-[var(--border-light)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `;
    }
    document.getElementById('inline-person-form').innerHTML = '';
  }
}

// ============================================================================
// AUTOCOMPLETE SYSTEM (Dropdown for modal fields: area, tags, people)
// ============================================================================

/**
 * Setup a generic autocomplete dropdown on an input element.
 * Used for area, tags, and people fields in the task modal.
 *
 * @param {string} inputId - DOM id of the search input
 * @param {string} dropdownId - DOM id of the dropdown container
 * @param {Array} items - Array of objects with at least { id, name }
 * @param {Function} onSelect - Called with the selected item
 * @param {Function} getDisplayFn - Returns display text for an item
 * @param {Function} getIconFn - Returns icon HTML for an item
 * @param {boolean} [allowCreate=false] - Show "Create" option if no match
 * @param {Function} [createFn=null] - Called with text to create new item
 * @param {string} [placeholder='Search...'] - Input placeholder
 */
// Track active AbortControllers for modal autocomplete cleanup
const _autocompleteControllers = new Map();

export function cleanupModalAutocomplete() {
  for (const [id, controller] of _autocompleteControllers) {
    controller.abort();
  }
  _autocompleteControllers.clear();
}

export function setupAutocomplete(inputId, dropdownId, items, onSelect, getDisplayFn, getIconFn, allowCreate = false, createFn = null, placeholder = 'Search...') {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  // Abort any previous controller for this input to prevent listener accumulation
  if (_autocompleteControllers.has(inputId)) {
    _autocompleteControllers.get(inputId).abort();
  }
  const ac = new AbortController();
  _autocompleteControllers.set(inputId, ac);
  const signal = ac.signal;

  let highlightedIndex = -1;

  function highlightOption(idx) {
    highlightedIndex = idx;
    const options = dropdown.querySelectorAll('.autocomplete-option');
    options.forEach((o, i) => o.classList.toggle('highlighted', i === highlightedIndex));
    if (highlightedIndex >= 0 && options[highlightedIndex]) {
      options[highlightedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function renderOptions(filter = '') {
    const filtered = items.filter(item =>
      getDisplayFn(item).toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0 && !allowCreate) {
      dropdown.innerHTML = '<div class="autocomplete-empty">No matches found</div>';
    } else {
      dropdown.innerHTML = filtered.map((item, idx) => `
        <div class="autocomplete-option ${idx === highlightedIndex ? 'highlighted' : ''}"
             data-id="${item.id}" data-idx="${idx}">
          ${getIconFn ? getIconFn(item) : ''}
          <span>${escapeHtml(getDisplayFn(item))}</span>
        </div>
      `).join('');

      if (allowCreate && filter.trim() && !filtered.some(i => getDisplayFn(i).toLowerCase() === filter.toLowerCase())) {
        dropdown.innerHTML += `
          <div class="autocomplete-create" data-create="true">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create "${escapeHtml(filter)}"
          </div>
        `;
      }
    }

    // Add click + mouseenter handlers (synced with highlightedIndex)
    dropdown.querySelectorAll('.autocomplete-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const item = items.find(i => i.id === opt.dataset.id);
        if (item) {
          onSelect(item);
          dropdown.classList.remove('show');
          input.value = '';
        }
      });
      opt.addEventListener('mouseenter', () => {
        highlightOption(parseInt(opt.dataset.idx, 10));
      });
    });

    const createBtn = dropdown.querySelector('.autocomplete-create');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        if (createFn) {
          createFn(filter.trim());
          dropdown.classList.remove('show');
          input.value = '';
        }
      });
    }
  }

  input.addEventListener('focus', () => {
    renderOptions(input.value);
    dropdown.classList.add('show');
  }, { signal });

  input.addEventListener('input', () => {
    highlightedIndex = -1;
    renderOptions(input.value);
  }, { signal });

  input.addEventListener('keydown', (e) => {
    const options = dropdown.querySelectorAll('.autocomplete-option');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightOption(Math.min(highlightedIndex + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightOption(Math.max(highlightedIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && options[highlightedIndex]) {
        options[highlightedIndex].click();
      } else if (allowCreate && input.value.trim() && createFn) {
        createFn(input.value.trim());
        dropdown.classList.remove('show');
        input.value = '';
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.remove('show');
    }
  }, { signal });

  document.addEventListener('click', (e) => {
    if (!document.contains(input)) {
      ac.abort();
      _autocompleteControllers.delete(inputId);
      return;
    }
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  }, { signal });
}

// ============================================================================
// MODAL STATE MANAGEMENT
// ============================================================================

/**
 * Initialize modal state from the editing task or the newTaskContext.
 * Called once per modal open (guarded by modalStateInitialized flag).
 * @param {object|null} editingTask - Task being edited, or null for new task
 */
export function initModalState(editingTask) {
  if (editingTask) {
    state.modalSelectedArea = editingTask.areaId || null;
    state.modalSelectedCategory = editingTask.categoryId || null;
    state.modalSelectedStatus = editingTask.status || 'inbox';
    state.modalSelectedToday = !!editingTask.today;
    state.modalSelectedFlagged = !!editingTask.flagged;
    state.modalSelectedTags = [...(editingTask.labels || [])];
    state.modalSelectedPeople = [...(editingTask.people || [])];
    state.modalIsNote = editingTask.isNote || false;
    state.modalRepeatEnabled = editingTask.repeat && editingTask.repeat.type !== 'none';
    state.modalWaitingFor = editingTask.waitingFor ? { ...editingTask.waitingFor } : null;
    state.modalIsProject = editingTask.isProject || false;
    state.modalProjectId = editingTask.projectId || null;
    state.modalProjectType = editingTask.projectType || 'parallel';
    state.modalTimeEstimate = editingTask.timeEstimate || null;
  } else {
    state.modalSelectedArea = state.newTaskContext.areaId || null;
    state.modalSelectedCategory = state.newTaskContext.categoryId || null;
    state.modalSelectedStatus = state.newTaskContext.status || 'inbox';
    state.modalSelectedToday = !!state.newTaskContext.today;
    state.modalSelectedFlagged = !!state.newTaskContext.flagged;
    state.modalSelectedTags = state.newTaskContext.labelIds ? [...state.newTaskContext.labelIds] : (state.newTaskContext.labelId ? [state.newTaskContext.labelId] : []);
    state.modalSelectedPeople = state.newTaskContext.personId ? [state.newTaskContext.personId] : [];
    state.modalIsNote = state.activePerspective === 'notes';
    state.modalRepeatEnabled = false;
    state.modalWaitingFor = null;
    state.modalIsProject = false;
    state.modalProjectId = null;
    state.modalProjectType = 'parallel';
    state.modalTimeEstimate = null;
  }
}

/**
 * Set the modal type (task vs note) and update the UI.
 * @param {boolean} isNote - true for note, false for task
 */
export function setModalType(isNote) {
  state.modalIsNote = isNote;
  document.querySelectorAll('.type-option').forEach(opt => {
    opt.classList.toggle('active', (opt.dataset.type === 'note') === isNote);
  });
  // Update title placeholder
  const titleInput = document.getElementById('task-title');
  if (titleInput) {
    titleInput.placeholder = isNote ? 'What do you want to capture?' : 'What needs to be done?';
  }
}

/**
 * Set the modal status (inbox/anytime/someday) or toggle Today flag.
 * @param {string} status
 */
export function setModalStatus(status) {
  if (status === 'today') {
    state.modalSelectedToday = !state.modalSelectedToday;
    if (state.modalSelectedToday && state.modalSelectedStatus === 'inbox') {
      state.modalSelectedStatus = 'anytime';
    }
  } else {
    state.modalSelectedStatus = status;
    if (status === 'inbox' || status === 'someday') {
      state.modalSelectedToday = false;
    }
  }
  document.querySelectorAll('.status-pill').forEach(pill => {
    if (pill.dataset.status === 'today') {
      pill.classList.toggle('selected', state.modalSelectedToday);
    } else {
      pill.classList.toggle('selected', pill.dataset.status === state.modalSelectedStatus);
    }
  });
}

/**
 * Toggle the modal flagged state.
 */
export function toggleModalFlagged() {
  state.modalSelectedFlagged = !state.modalSelectedFlagged;
  const flagPill = document.querySelector('.status-pill[data-status="flagged"]');
  if (flagPill) flagPill.classList.toggle('selected', state.modalSelectedFlagged);
}

/**
 * Update the date display text and clear button visibility for defer/due fields.
 * @param {string} type - 'defer' or 'due'
 */
export function updateDateDisplay(type) {
  const input = document.getElementById(type === 'defer' ? 'task-defer' : 'task-due');
  const display = document.getElementById(type + '-display');
  const clearBtn = document.getElementById(type + '-clear-btn');
  if (!input || !display) return;
  if (input.value) {
    display.textContent = formatSmartDate(input.value);
    if (clearBtn) clearBtn.classList.remove('hidden');
  } else {
    display.textContent = 'None';
    if (clearBtn) clearBtn.classList.add('hidden');
  }
}

/**
 * Clear a date field (defer or due) and update its display.
 * @param {string} type - 'defer' or 'due'
 */
export function clearDateField(type) {
  const input = document.getElementById(type === 'defer' ? 'task-defer' : 'task-due');
  const display = document.getElementById(type + '-display');
  const clearBtn = document.getElementById(type + '-clear-btn');
  if (input) input.value = '';
  if (display) display.textContent = 'None';
  if (clearBtn) clearBtn.classList.add('hidden');
}

/**
 * Set a quick date value on a date field.
 * @param {string} type - 'defer' or 'due'
 * @param {number|null} offsetDays - days from today, or null to clear
 */
export function setQuickDate(type, offsetDays) {
  const inputId = type === 'defer' ? 'task-defer' : 'task-due';
  const input = document.getElementById(inputId);
  const display = document.getElementById(type + '-display');
  const clearBtn = document.getElementById(type + '-clear-btn');

  if (offsetDays === null) {
    if (input) input.value = '';
    if (display) display.textContent = 'None';
    if (clearBtn) clearBtn.classList.add('hidden');
    return;
  }

  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${dd}`;

  if (input) input.value = dateStr;
  if (display) display.textContent = formatSmartDate(dateStr);
  if (clearBtn) clearBtn.classList.remove('hidden');
}

/**
 * Open the native date picker for a field.
 * @param {string} type - 'defer' or 'due'
 */
export function openDatePicker(type) {
  const input = document.getElementById(type === 'defer' ? 'task-defer' : 'task-due');
  if (input?.showPicker) input.showPicker();
}

/**
 * Select an area in the modal and update its display.
 * @param {object|null} area - Area object or null to clear
 */
export function selectArea(area) {
  state.modalSelectedArea = area ? area.id : null;
  const display = document.getElementById('area-display');
  if (display) {
    display.innerHTML = area
      ? `<span class="tag-pill" style="background: ${area.color}20; color: ${area.color}">
           ${area.emoji || '<svg style="display:inline-block;vertical-align:middle;width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'} ${escapeHtml(area.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`
      : '<span class="text-[var(--text-muted)] text-sm">No area selected</span>';
  }
  // Re-render category input when area changes (categories filter by area)
  renderCategoryInput();
}

/**
 * Render the area autocomplete input inside the modal.
 * Sets up the search input, display, and autocomplete dropdown.
 */
export function renderAreaInput() {
  const container = document.getElementById('area-autocomplete-container');
  if (!container) return;

  const area = state.taskAreas.find(c => c.id === state.modalSelectedArea);

  container.innerHTML = `
    <div id="area-display" class="modal-token-shell area-display-shell" onclick="document.getElementById('area-search').focus()">
      ${area
        ? `<span class="tag-pill" style="background: ${area.color}20; color: ${area.color}">
             ${area.emoji || '<svg style="display:inline-block;vertical-align:middle;width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'} ${escapeHtml(area.name)}
             <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
               <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
             </span>
           </span>`
        : '<span class="text-[var(--text-muted)] text-sm">No area selected</span>'}
    </div>
    <div class="autocomplete-container">
      <input type="text" id="area-search" class="autocomplete-input modal-input-enhanced" placeholder="Search areas...">
      <svg class="autocomplete-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <div id="area-dropdown" class="autocomplete-dropdown"></div>
    </div>
  `;

  setupAutocomplete(
    'area-search',
    'area-dropdown',
    state.taskAreas,
    (item) => { selectArea(item); renderAreaInput(); },
    (item) => item.name,
    (item) => `<div class="autocomplete-option-icon" style="background: ${item.color}20; color: ${item.color}">${item.emoji || '<svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</div>`,
    true,
    (name) => {
      const now = new Date().toISOString();
      const newCat = { id: 'cat_' + Date.now(), name, color: '#6366f1', icon: '\uD83D\uDCC1', createdAt: now, updatedAt: now };
      state.taskAreas.push(newCat);
      localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskAreas));
      debouncedSaveToGithub();
      selectArea(newCat);
      renderAreaInput();
    }
  );
}

/**
 * Select a category (sub-area) in the modal and update its display.
 * @param {object|null} category - Category object or null to clear
 */
export function selectCategory(category) {
  state.modalSelectedCategory = category ? category.id : null;
  const display = document.getElementById('category-display');
  if (display) {
    display.innerHTML = category
      ? `<span class="tag-pill" style="background: ${category.color}20; color: ${category.color}">
           📂 ${escapeHtml(category.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectCategory(null); renderCategoryInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`
      : '<span class="text-[var(--text-muted)] text-sm">No category selected</span>';
  }
}

/**
 * Render the category autocomplete input inside the modal.
 * Filters categories by the currently selected area.
 */
export function renderCategoryInput() {
  const container = document.getElementById('category-autocomplete-container');
  if (!container) return;

  const availableCategories = state.modalSelectedArea
    ? getCategoriesByArea(state.modalSelectedArea)
    : state.taskCategories;

  // Clear selection if category doesn't belong to the selected area
  if (state.modalSelectedCategory && state.modalSelectedArea) {
    const cat = getCategoryById(state.modalSelectedCategory);
    if (cat && cat.areaId !== state.modalSelectedArea) {
      state.modalSelectedCategory = null;
    }
  }

  const category = state.modalSelectedCategory ? getCategoryById(state.modalSelectedCategory) : null;

  if (availableCategories.length === 0 && !category) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div id="category-display" class="modal-token-shell area-display-shell" onclick="document.getElementById('category-search')?.focus()">
      ${category
        ? `<span class="tag-pill" style="background: ${category.color}20; color: ${category.color}">
             📂 ${escapeHtml(category.name)}
             <span class="tag-pill-remove" onclick="event.stopPropagation(); selectCategory(null); renderCategoryInput();">
               <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
             </span>
           </span>`
        : '<span class="text-[var(--text-muted)] text-sm">No category selected</span>'}
    </div>
    <div class="autocomplete-container">
      <input type="text" id="category-search" class="autocomplete-input modal-input-enhanced" placeholder="Search categories...">
      <svg class="autocomplete-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <div id="category-dropdown" class="autocomplete-dropdown"></div>
    </div>
  `;

  setupAutocomplete(
    'category-search',
    'category-dropdown',
    availableCategories,
    (item) => { selectCategory(item); renderCategoryInput(); },
    (item) => item.name,
    (item) => `<div class="autocomplete-option-icon" style="background: ${item.color}20; color: ${item.color}">📂</div>`,
    false
  );
}

/**
 * Add a tag to the modal selection and re-render the tags input.
 * @param {object} tag - Tag object with at least { id }
 */
export function addTag(tag) {
  if (!state.modalSelectedTags.includes(tag.id)) {
    state.modalSelectedTags.push(tag.id);
    renderTagsInput();
  }
}

/**
 * Remove a tag from the modal selection and re-render.
 * @param {string} tagId
 */
export function removeTag(tagId) {
  state.modalSelectedTags = state.modalSelectedTags.filter(id => id !== tagId);
  renderTagsInput();
}

/**
 * Render the tags input (pill container + autocomplete) in the modal.
 */
export function renderTagsInput() {
  const container = document.getElementById('tags-input-container');
  if (!container) return;

  const selectedTagObjects = state.modalSelectedTags.map(id => state.taskLabels.find(l => l.id === id)).filter(Boolean);

  container.innerHTML = `
    <div class="modal-token-shell">
      <div class="tag-input-container" onclick="document.getElementById('tags-search').focus()">
        ${selectedTagObjects.map(tag => `
          <span class="tag-pill" style="background: ${tag.color}20; color: ${tag.color}">
            ${escapeHtml(tag.name)}
            <span class="tag-pill-remove" onclick="event.stopPropagation(); removeTag('${tag.id}');">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
          </span>
        `).join('')}
        <input type="text" id="tags-search" class="tag-input-field" placeholder="${selectedTagObjects.length ? '' : 'Add tags...'}">
      </div>
    </div>
    <div id="tags-dropdown" class="autocomplete-dropdown"></div>
  `;

  setupAutocomplete(
    'tags-search',
    'tags-dropdown',
    state.taskLabels.filter(l => !state.modalSelectedTags.includes(l.id)),
    (item) => addTag(item),
    (item) => item.name,
    (item) => `<div class="w-3 h-3 rounded-full" style="background: ${item.color}"></div>`,
    true,
    (name) => {
      const colors = [_css('--danger') || '#ef4444', _css('--warning') || '#f59e0b', _css('--success') || '#22c55e', _css('--accent') || '#3b82f6', _css('--notes-accent') || '#8b5cf6', '#ec4899'];
      const now = new Date().toISOString();
      const newTag = { id: 'label_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)], createdAt: now, updatedAt: now };
      state.taskLabels.push(newTag);
      localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
      debouncedSaveToGithub();
      addTag(newTag);
    }
  );
}

/**
 * Add a person to the modal selection and re-render.
 * @param {object} person - Person object with at least { id }
 */
export function addPerson(person) {
  if (!state.modalSelectedPeople.includes(person.id)) {
    state.modalSelectedPeople.push(person.id);
    renderPeopleInput();
  }
}

/**
 * Remove a person from the modal selection and re-render.
 * @param {string} personId
 */
export function removePerson(personId) {
  state.modalSelectedPeople = state.modalSelectedPeople.filter(id => id !== personId);
  renderPeopleInput();
}

/**
 * Render the people input (pill container + autocomplete) in the modal.
 */
export function renderPeopleInput() {
  const container = document.getElementById('people-input-container');
  if (!container) return;

  const selectedPeopleObjects = state.modalSelectedPeople.map(id => state.taskPeople.find(p => p.id === id)).filter(Boolean);

  container.innerHTML = `
    <div class="modal-token-shell">
      <div class="tag-input-container" onclick="document.getElementById('people-search').focus()">
        ${selectedPeopleObjects.map(person => `
          <span class="tag-pill" style="background: var(--accent-light); color: var(--accent)">
            ${person.photoData
              ? `<img src="${person.photoData}" alt="" style="width:16px;height:16px" class="rounded-full object-cover" referrerpolicy="no-referrer">`
              : `<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}
            ${escapeHtml(person.name)}
            <span class="tag-pill-remove" onclick="event.stopPropagation(); removePersonModal('${person.id}');">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
          </span>
        `).join('')}
        <input type="text" id="people-search" class="tag-input-field" placeholder="${selectedPeopleObjects.length ? '' : 'Add people...'}">
      </div>
    </div>
    <div id="people-dropdown" class="autocomplete-dropdown"></div>
  `;

  setupAutocomplete(
    'people-search',
    'people-dropdown',
    state.taskPeople.filter(p => !state.modalSelectedPeople.includes(p.id)),
    (item) => addPerson(item),
    (item) => item.name,
    (item) => item?.photoData
      ? `<div class="autocomplete-option-icon"><img src="${item.photoData}" alt="" style="width:20px;height:20px" class="rounded-full object-cover" referrerpolicy="no-referrer"></div>`
      : `<div class="autocomplete-option-icon bg-[var(--bg-secondary)]"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`,
    true,
    (name) => {
      const now = new Date().toISOString();
      const newPerson = { id: 'person_' + Date.now(), name, email: '', createdAt: now, updatedAt: now };
      state.taskPeople.push(newPerson);
      localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
      debouncedSaveToGithub();
      addPerson(newPerson);
    }
  );
}

/**
 * Toggle the repeat section in the modal.
 */
export function toggleRepeat() {
  state.modalRepeatEnabled = !state.modalRepeatEnabled;
  const toggle = document.querySelector('.repeat-toggle');
  const config = document.querySelector('.repeat-config');
  if (toggle) toggle.classList.toggle('active', state.modalRepeatEnabled);
  if (config) config.classList.toggle('show', state.modalRepeatEnabled);
}

/**
 * Initialize all autocomplete fields in the modal after render.
 * Called via setTimeout to allow DOM to settle.
 */
export function initModalAutocomplete() {
  setTimeout(() => {
    renderAreaInput();
    renderCategoryInput();
    renderTagsInput();
    renderPeopleInput();
    renderWaitingForUI();
    renderProjectUI();
    renderTimeEstimateUI();

    // Set initial status
    document.querySelectorAll('.status-pill').forEach(pill => {
      if (pill.dataset.status === 'today') {
        pill.classList.toggle('selected', state.modalSelectedToday);
      } else if (pill.dataset.status === 'flagged') {
        pill.classList.toggle('selected', state.modalSelectedFlagged);
      } else {
        pill.classList.toggle('selected', pill.dataset.status === state.modalSelectedStatus);
      }
    });

    // Set initial type
    document.querySelectorAll('.type-option').forEach(opt => {
      opt.classList.toggle('active', (opt.dataset.type === 'note') === state.modalIsNote);
    });

    // Focus title
    const titleInput = document.getElementById('task-title');
    if (titleInput) titleInput.focus();

    // Setup inline autocomplete for modal title (# @ &)
    setupInlineAutocomplete('task-title', { isModal: true });

    // Auto-size notes textarea for pre-filled content
    const notesEl = document.getElementById('task-notes');
    if (notesEl && notesEl.value) {
      notesEl.style.height = 'auto';
      notesEl.style.height = notesEl.scrollHeight + 'px';
    }

    // Keyboard avoidance: scroll focused input into view on mobile
    if (isMobileViewport()) {
      const modalBody = document.querySelector('.modal-body-enhanced');
      if (modalBody) {
        modalBody.querySelectorAll('input, textarea, select').forEach(el => {
          el.addEventListener('focus', () => {
            setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
          });
        });
      }
    }
  }, 50);
}

// ============================================================================
// CLOSE TASK MODAL
// ============================================================================

/**
 * Close the task modal, cleaning up inline autocomplete state.
 */
export function closeTaskModal() {
  cleanupInlineAutocomplete('task-title');
  cleanupModalAutocomplete();

  // Clean up orphaned empty tasks (created via quick-add but never titled)
  if (state.editingTaskId) {
    const task = state.tasksData.find(t => t.id === state.editingTaskId);
    if (task && !task.title) {
      deleteTask(state.editingTaskId);
    }
  }

  // Sheet dismiss animation on mobile
  if (isMobileViewport()) {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.add('sheet-dismissing');
      setTimeout(() => {
        state.showTaskModal = false;
        state.editingTaskId = null;
        state.modalStateInitialized = false;
        window.render();
      }, 350);
      return;
    }
  }

  state.showTaskModal = false;
  state.editingTaskId = null;
  state.modalStateInitialized = false;
  window.render();
}

// ============================================================================
// SAVE TASK FROM MODAL
// ============================================================================

/**
 * Save the task from the modal form. Creates a new task or updates an existing one.
 */
export function saveTaskFromModal() {
  const title = document.getElementById('task-title').value.trim();
  if (!title) {
    alert('Please enter a title');
    return;
  }

  // Get repeat settings
  let repeat = null;
  if (state.modalRepeatEnabled) {
    const repeatType = document.getElementById('task-repeat-type')?.value || 'daily';
    const repeatFrom = document.querySelector('input[name="repeat-from"]:checked')?.value || 'completion';
    repeat = {
      type: repeatType,
      interval: parseInt(document.getElementById('task-repeat-interval')?.value) || 1,
      from: repeatFrom
    };
  }

  let deferDateValue = document.getElementById('task-defer')?.value || null;

  const taskData = {
    title: title,
    notes: document.getElementById('task-notes')?.value.trim() || '',
    status: state.modalSelectedStatus,
    today: state.modalSelectedToday,
    flagged: state.modalSelectedFlagged,
    areaId: state.modalSelectedArea,
    categoryId: state.modalSelectedCategory || null,
    deferDate: deferDateValue,
    dueDate: document.getElementById('task-due')?.value || null,
    repeat: repeat,
    labels: state.modalSelectedTags,
    people: state.modalSelectedPeople,
    isNote: state.modalIsNote,
    waitingFor: state.modalWaitingFor,
    isProject: state.modalIsProject,
    projectId: state.modalProjectId,
    projectType: state.modalProjectType,
    timeEstimate: state.modalTimeEstimate
  };

  // Things 3 logic: Assigning an Area to an Inbox task moves it to Anytime (not for notes)
  if (!state.modalIsNote && taskData.status === 'inbox' && taskData.areaId) {
    taskData.status = 'anytime';
  }
  // Today flag implies availability (not Inbox/Someday)
  if (!state.modalIsNote && taskData.status === 'inbox' && taskData.today) {
    taskData.status = 'anytime';
  }

  if (state.editingTaskId) {
    updateTask(state.editingTaskId, taskData);
  } else {
    createTask(title, taskData);
  }

  cleanupInlineAutocomplete('task-title');
  cleanupModalAutocomplete();

  // Sheet dismiss animation on mobile (consistent with closeTaskModal)
  if (isMobileViewport()) {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
      overlay.classList.add('sheet-dismissing');
      setTimeout(() => {
        state.showTaskModal = false;
        state.editingTaskId = null;
        state.modalStateInitialized = false;
        window.render();
      }, 350);
      return;
    }
  }

  state.showTaskModal = false;
  state.editingTaskId = null;
  state.modalStateInitialized = false;
  window.render();
}

// ============================================================================
// WAITING FOR (GTD)
// ============================================================================

/**
 * Mark a task as "waiting for" someone with an optional follow-up date.
 */
export function setWaitingFor(personId, description = '', followUpDays = 7) {
  if (!personId) {
    state.modalWaitingFor = null;
    renderWaitingForUI();
    return;
  }

  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + followUpDays);
  const yyyy = followUpDate.getFullYear();
  const mm = String(followUpDate.getMonth() + 1).padStart(2, '0');
  const dd = String(followUpDate.getDate()).padStart(2, '0');

  state.modalWaitingFor = {
    personId,
    description,
    followUpDate: `${yyyy}-${mm}-${dd}`
  };

  renderWaitingForUI();
}

/**
 * Render the waiting-for UI section in the modal.
 */
export function renderWaitingForUI() {
  const container = document.getElementById('waiting-for-container');
  if (!container) return;

  const editingTask = state.editingTaskId ? state.tasksData.find(t => t.id === state.editingTaskId) : null;
  const waitingFor = state.modalWaitingFor || editingTask?.waitingFor || null;

  if (!waitingFor) {
    container.innerHTML = `
      <div class="flex items-center gap-2">
        <button type="button" onclick="toggleWaitingForForm()" class="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Mark as Waiting For
        </button>
      </div>
      <div id="waiting-for-form" class="hidden"></div>
    `;
  } else {
    const person = state.taskPeople.find(p => p.id === waitingFor.personId);
    const personName = person ? person.name : 'Unknown';
    const followUpDate = waitingFor.followUpDate ? formatSmartDate(waitingFor.followUpDate) : 'No follow-up set';

    container.innerHTML = `
      <div class="flex items-start gap-3 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg">
        <svg class="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-[var(--text-primary)]">Waiting for ${escapeHtml(personName)}</div>
          ${waitingFor.description ? `<div class="text-sm text-[var(--text-secondary)] mt-0.5">${escapeHtml(waitingFor.description)}</div>` : ''}
          <div class="text-xs text-[var(--text-muted)] mt-1">Follow up: ${followUpDate}</div>
        </div>
        <button type="button" onclick="setWaitingFor(null)" class="flex-shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    `;
  }
}

/**
 * Toggle the waiting-for form.
 */
export function toggleWaitingForForm() {
  const formContainer = document.getElementById('waiting-for-form');
  if (!formContainer) return;

  if (formContainer.classList.contains('hidden')) {
    formContainer.classList.remove('hidden');
    formContainer.innerHTML = `
      <div class="mt-3 p-3 bg-[var(--bg-secondary)]/30 rounded-lg space-y-3">
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Person</label>
          <select id="waiting-person-select" class="input-field mt-1">
            <option value="">Select person...</option>
            ${state.taskPeople.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">What are you waiting for? (Optional)</label>
          <input type="text" id="waiting-description-input" placeholder="e.g., Budget approval, Design review..." class="modal-input-enhanced mt-1">
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Follow up in</label>
          <div class="flex gap-2 mt-1">
            <button type="button" onclick="applyWaitingFor(3)" class="date-quick-pill">3 days</button>
            <button type="button" onclick="applyWaitingFor(7)" class="date-quick-pill">7 days</button>
            <button type="button" onclick="applyWaitingFor(14)" class="date-quick-pill">14 days</button>
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <button type="button" onclick="applyWaitingFor(7)" class="flex-1 px-3 py-2 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)] transition">Set Waiting</button>
          <button type="button" onclick="toggleWaitingForForm()" class="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">Cancel</button>
        </div>
      </div>
    `;
    setTimeout(() => document.getElementById('waiting-person-select')?.focus(), 50);
  } else {
    formContainer.classList.add('hidden');
    formContainer.innerHTML = '';
  }
}

/**
 * Apply waiting-for with selected person and follow-up days.
 */
export function applyWaitingFor(followUpDays = 7) {
  const personId = document.getElementById('waiting-person-select')?.value;
  const description = document.getElementById('waiting-description-input')?.value?.trim() || '';

  if (!personId) {
    alert('Please select a person to wait for');
    return;
  }

  setWaitingFor(personId, description, followUpDays);

  const formContainer = document.getElementById('waiting-for-form');
  if (formContainer) {
    formContainer.classList.add('hidden');
    formContainer.innerHTML = '';
  }
}

// ============================================================================
// PROJECT SUPPORT (GTD Phase 2.1)
// ============================================================================

/**
 * Toggle the "Mark as Project" checkbox
 */
export function toggleProjectMode() {
  state.modalIsProject = !state.modalIsProject;
  renderProjectUI();
}

/**
 * Set the project type (sequential vs parallel)
 * @param {string} type - 'sequential' or 'parallel'
 */
export function setProjectType(type) {
  if (type !== 'sequential' && type !== 'parallel') return;
  state.modalProjectType = type;
  renderProjectUI();
}

/**
 * Link this task to a parent project
 * @param {string|null} projectId - Parent project task ID
 */
export function linkToProject(projectId) {
  state.modalProjectId = projectId;
  renderProjectUI();
}

/**
 * Render the project UI section in the modal
 */
export function renderProjectUI() {
  const container = document.getElementById('project-container');
  if (!container) return;

  const editingTask = state.editingTaskId ? state.tasksData.find(t => t.id === state.editingTaskId) : null;
  const isProject = state.modalIsProject || editingTask?.isProject || false;
  const projectId = state.modalProjectId || editingTask?.projectId || null;
  const projectType = state.modalProjectType || editingTask?.projectType || 'parallel';

  // Get all projects for dropdown (excluding the current task being edited)
  const projects = state.tasksData.filter(t =>
    t.isProject &&
    !t.completed &&
    (!editingTask || t.id !== editingTask.id)
  );

  const hasProjects = projects.length > 0;
  const linkedProject = projectId ? state.tasksData.find(t => t.id === projectId) : null;

  let html = `
    <div class="space-y-3">
      <!-- Mark as Project checkbox -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" ${isProject ? 'checked' : ''}
          onchange="toggleProjectMode()"
          class="rounded border-[var(--border)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
        <span class="text-sm font-medium text-[var(--text-primary)]">Mark as multi-step project</span>
      </label>

      ${isProject ? `
        <!-- Project Type -->
        <div class="ml-6 p-3 bg-[var(--bg-secondary)]/30 rounded-lg space-y-2">
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Project Type</label>
          <div class="flex gap-2">
            <button onclick="setProjectType('parallel')"
              class="flex-1 px-3 py-2 text-sm rounded-lg transition ${projectType === 'parallel' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}">
              📋 Parallel
            </button>
            <button onclick="setProjectType('sequential')"
              class="flex-1 px-3 py-2 text-sm rounded-lg transition ${projectType === 'sequential' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}">
              📝 Sequential
            </button>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-1">
            ${projectType === 'sequential' ? 'Tasks must be done in order' : 'Tasks can be done in any order'}
          </p>
        </div>
      ` : ''}

      ${hasProjects && !isProject ? `
        <!-- Link to Project -->
        <div class="space-y-2">
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Link to Project</label>
          <select onchange="linkToProject(this.value || null)" class="input-field">
            <option value="">No project (standalone task)</option>
            ${projects.map(p => `
              <option value="${p.id}" ${projectId === p.id ? 'selected' : ''}>
                ${escapeHtml(p.title)}
              </option>
            `).join('')}
          </select>
          ${linkedProject ? `
            <p class="text-xs text-[var(--text-muted)]">
              This task belongs to project: <strong>${escapeHtml(linkedProject.title)}</strong>
            </p>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Set time estimate for the task
 * @param {number|null} minutes - Estimate in minutes (5, 15, 30, 60) or null to clear
 */
export function setTimeEstimate(minutes) {
  state.modalTimeEstimate = minutes;
  renderTimeEstimateUI();
}

/**
 * Render the time estimate UI section in the modal
 */
export function renderTimeEstimateUI() {
  const container = document.getElementById('time-estimate-container');
  if (!container) return;

  const estimate = state.modalTimeEstimate;
  const options = [5, 15, 30, 60];

  let html = `
    <div class="space-y-2">
      <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Time Estimate</label>
      <div class="flex gap-2">
        <button onclick="setTimeEstimate(null)"
          class="flex-1 px-3 py-2 text-xs rounded-lg transition ${estimate === null ? 'bg-[var(--bg-secondary)] border-2 border-[var(--accent)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]'}">
          None
        </button>
        ${options.map(min => `
          <button onclick="setTimeEstimate(${min})"
            class="flex-1 px-3 py-2 text-xs rounded-lg transition ${estimate === min ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]'}">
            ${min}m
          </button>
        `).join('')}
      </div>
      ${estimate ? `
        <p class="text-xs text-[var(--text-muted)]">
          ⏱️ Estimated duration: ${estimate} minute${estimate > 1 ? 's' : ''}
        </p>
      ` : `
        <p class="text-xs text-[var(--text-muted)]">
          Set time estimate for time-blocking and filtering
        </p>
      `}
    </div>
  `;

  container.innerHTML = html;
}

// ============================================================================
// RENDER TASK MODAL HTML
// ============================================================================

/**
 * Generate the complete task modal HTML string.
 * This is called from the renderTasksTab function.
 * @returns {string} HTML string for the task modal (empty string if modal is closed)
 */
export function renderTaskModalHtml() {
  const icons = getActiveIcons();
  const editingTask = state.editingTaskId ? state.tasksData.find(t => t.id === state.editingTaskId) : null;
  if (state.showTaskModal && !state.modalStateInitialized) {
    initModalState(editingTask);
    state.modalStateInitialized = true;
  }

  if (!state.showTaskModal) return '';

  return `
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){closeTaskModal()}" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div class="modal-enhanced w-full max-w-xl mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <!-- Header -->
        <div class="modal-header-enhanced">
          <div class="flex items-center gap-4">
            <h3 id="task-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingTask ? 'Edit' : 'New'}</h3>
            <div class="type-switcher">
              <div class="type-option ${!state.modalIsNote ? 'active' : ''}" data-type="task" onclick="setModalType(false)">
                <svg class="inline-block mr-1.5 w-4 h-4 -mt-px" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/></svg>Task
              </div>
              <div class="type-option ${state.modalIsNote ? 'active' : ''}" data-type="note" onclick="setModalType(true)">
                <svg class="inline-block mr-1.5 w-4 h-4 -mt-px" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="5"/></svg>Note
              </div>
            </div>
          </div>
          <button onclick="closeTaskModal()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-enhanced">
          <!-- Title -->
          <div class="modal-section">
            <input type="text" id="task-title" value="${escapeHtml(editingTask?.title || '')}"
              placeholder="${state.modalIsNote ? 'What do you want to capture?' : 'What needs to be done?'}"
              maxlength="500"
              onkeydown="if(event._inlineAcHandled)return;if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();saveTaskFromModal();}"
              class="modal-input-enhanced title-input">
            <div class="modal-hint-row">
              <span class="modal-hint-chip"># Area</span>
              <span class="modal-hint-chip">@ Tag</span>
              <span class="modal-hint-chip">&amp; Person</span>
              <span class="modal-hint-chip">! Defer</span>
              <span class="modal-hint-text">Enter to save • Cmd/Ctrl+Enter from notes</span>
            </div>
          </div>

          <!-- Notes/Details -->
          <div class="modal-section">
            <label class="modal-section-label">Notes</label>
            <textarea id="task-notes" placeholder="Add details, links, or context..."
              onkeydown="if((event.metaKey||event.ctrlKey)&&event.key==='Enter'){event.preventDefault();saveTaskFromModal();}"
              oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
              class="modal-textarea-enhanced">${escapeHtml(editingTask?.notes || '')}</textarea>
          </div>

          <hr class="modal-divider">

          <!-- When (Status Pills) - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">When</label>
            <div class="status-pills">
              <div class="status-pill ${state.modalSelectedStatus === 'inbox' ? 'selected' : ''}" data-status="inbox" onclick="setModalStatus('inbox')">
                <span class="status-icon">${icons.inbox.replace('w-5 h-5', 'w-4 h-4')}</span>Inbox
              </div>
              <div class="status-pill ${state.modalSelectedToday ? 'selected' : ''}" data-status="today" onclick="setModalStatus('today')">
                <span class="status-icon">${icons.today.replace('w-5 h-5', 'w-4 h-4')}</span>Today
              </div>
              <div class="status-pill ${state.modalSelectedFlagged ? 'selected' : ''}" data-status="flagged" onclick="toggleModalFlagged()">
                <span class="status-icon">${icons.flagged.replace('w-5 h-5', 'w-4 h-4')}</span>Flag
              </div>
              <div class="status-pill ${state.modalSelectedStatus === 'anytime' ? 'selected' : ''}" data-status="anytime" onclick="setModalStatus('anytime')">
                <span class="status-icon">${icons.anytime.replace('w-5 h-5', 'w-4 h-4')}</span>Anytime
              </div>
              <div class="status-pill ${state.modalSelectedStatus === 'someday' ? 'selected' : ''}" data-status="someday" onclick="setModalStatus('someday')">
                <span class="status-icon">${icons.someday.replace('w-5 h-5', 'w-4 h-4')}</span>Someday
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Area (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">Area</label>
            <div id="area-autocomplete-container"></div>
          </div>

          <!-- Category (Sub-area, Autocomplete) -->
          <div class="modal-section" id="category-section">
            <label class="modal-section-label">Category</label>
            <div id="category-autocomplete-container"></div>
          </div>

          <!-- Dates - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">Schedule</label>
            <!-- Defer Until -->
            <div class="date-row" onclick="openDatePicker('defer')">
              <svg class="date-row-icon w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12z"/></svg>
              <div class="flex-1 min-w-0">
                <div class="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Defer Until</div>
                <div class="text-sm text-[var(--text-primary)]" id="defer-display">${editingTask?.deferDate ? formatSmartDate(editingTask.deferDate) : 'None'}</div>
              </div>
              <input type="date" id="task-defer" value="${editingTask?.deferDate || ''}"
                class="sr-only" onchange="updateDateDisplay('defer')">
              <button type="button" class="date-row-clear ${editingTask?.deferDate ? '' : 'hidden'}" id="defer-clear-btn"
                onclick="event.stopPropagation(); clearDateField('defer')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="date-quick-row">
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('defer', 0)">Today</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('defer', 1)">Tomorrow</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('defer', 7)">Next Week</button>
              <button type="button" class="date-quick-pill ghost" onclick="event.stopPropagation(); setQuickDate('defer', null)">Clear</button>
            </div>
            <!-- Due -->
            <div class="date-row" onclick="openDatePicker('due')">
              <svg class="date-row-icon w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>
              <div class="flex-1 min-w-0">
                <div class="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Due</div>
                <div class="text-sm text-[var(--text-primary)]" id="due-display">${editingTask?.dueDate ? formatSmartDate(editingTask.dueDate) : 'None'}</div>
              </div>
              <input type="date" id="task-due" value="${editingTask?.dueDate || ''}"
                class="sr-only" onchange="updateDateDisplay('due')">
              <button type="button" class="date-row-clear ${editingTask?.dueDate ? '' : 'hidden'}" id="due-clear-btn"
                onclick="event.stopPropagation(); clearDateField('due')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="date-quick-row">
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('due', 0)">Today</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('due', 1)">Tomorrow</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('due', 7)">Next Week</button>
              <button type="button" class="date-quick-pill ghost" onclick="event.stopPropagation(); setQuickDate('due', null)">Clear</button>
            </div>
          </div>

          <!-- Repeat - Tasks only -->
          <div class="modal-section">
            <label class="modal-section-label">Repeat</label>
            <div class="repeat-toggle ${state.modalRepeatEnabled ? 'active' : ''}" onclick="toggleRepeat()">
              <svg class="w-5 h-5 ${state.modalRepeatEnabled ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
              <span class="text-sm font-medium ${state.modalRepeatEnabled ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}">${state.modalRepeatEnabled ? 'Repeating' : 'Does not repeat'}</span>
            </div>
            <div class="repeat-config ${state.modalRepeatEnabled ? 'show' : ''}">
              <div class="flex items-center gap-3">
                <span class="text-sm text-[var(--text-secondary)]">Every</span>
                <input type="number" id="task-repeat-interval" min="1" value="${editingTask?.repeat?.interval || 1}"
                  class="input-field w-16 text-center">
                <select id="task-repeat-type" class="input-field">
                  <option value="daily" ${editingTask?.repeat?.type === 'daily' ? 'selected' : ''}>days</option>
                  <option value="weekly" ${editingTask?.repeat?.type === 'weekly' ? 'selected' : ''}>weeks</option>
                  <option value="monthly" ${editingTask?.repeat?.type === 'monthly' ? 'selected' : ''}>months</option>
                  <option value="yearly" ${editingTask?.repeat?.type === 'yearly' ? 'selected' : ''}>years</option>
                </select>
              </div>
              <div class="flex gap-4 mt-3">
                <label class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="repeat-from" value="completion" ${!editingTask?.repeat?.from || editingTask?.repeat?.from === 'completion' ? 'checked' : ''} class="accent-[var(--accent)]">
                  <span class="text-[var(--text-secondary)]">After completion</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="repeat-from" value="due" ${editingTask?.repeat?.from === 'due' ? 'checked' : ''} class="accent-[var(--accent)]">
                  <span class="text-[var(--text-secondary)]">From due date</span>
                </label>
              </div>
            </div>
          </div>
          ` : ''}

          <hr class="modal-divider">

          <!-- Tags (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">Tags</label>
            <div id="tags-input-container"></div>
          </div>

          <!-- People (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">People</label>
            <div id="people-input-container"></div>
          </div>

          <!-- Waiting For (GTD) - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">Waiting For</label>
            <div id="waiting-for-container"></div>
          </div>
          ` : ''}

          <!-- Project Support (GTD) - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">Project</label>
            <div id="project-container"></div>
          </div>
          ` : ''}

          <!-- Time Estimate (GTD) - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">Time Estimate</label>
            <div id="time-estimate-container"></div>
          </div>
          ` : ''}
        </div>

        ${editingTask?.meetingEventKey ? `
          <div class="px-5 py-3 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/35">
            <button
              onclick="closeTaskModal(); openCalendarMeetingNotesByEventKey('${String(editingTask.meetingEventKey).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}')"
              class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition">
              <svg class="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zM7 12h5v5H7z"/></svg>
              Back To Meeting Notes
            </button>
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="modal-footer-enhanced">
          <button onclick="closeTaskModal()"
            class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
            Cancel
          </button>
          <button onclick="saveTaskFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
            ${editingTask ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  `;
}
