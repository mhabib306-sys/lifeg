// ============================================================================
// TASK MODAL UI MODULE
// ============================================================================
// Contains all task modal rendering, state management, inline editing,
// quick-add, inline tag/person creation, autocomplete system, date parsing,
// and inline autocomplete (Todoist-style #, @, &, !) functionality.

import { state } from '../state.js';
import { createTask, updateTask } from '../features/tasks.js';
import {
  createCategory,
  updateCategory,
  createLabel,
  updateLabel,
  createPerson,
  updatePerson,
  getCategoryById,
  getLabelById,
  getPersonById
} from '../features/categories.js';
import { createPerspective, deletePerspective } from '../features/perspectives.js';
import { saveTasksData } from '../data/storage.js';
import { escapeHtml, generateTaskId, formatSmartDate } from '../utils.js';
import {
  THINGS3_ICONS,
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY
} from '../constants.js';

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
            categoryId: task.categoryId || null,
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
        if (inlineMeta.categoryId !== undefined) updates.categoryId = inlineMeta.categoryId;
        if (inlineMeta.labels) updates.labels = inlineMeta.labels;
        if (inlineMeta.people) updates.people = inlineMeta.people;
        if (inlineMeta.deferDate) updates.deferDate = inlineMeta.deferDate;
      }
      updateTask(taskId, updates);
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
// OPEN NEW TASK MODAL
// ============================================================================

/**
 * Open the task creation modal, setting context based on the current view
 * (category, label, person, or perspective).
 */
export function openNewTaskModal() {
  state.editingTaskId = null;
  // Set context based on current view
  if (state.activeFilterType === 'category' && state.activeCategoryFilter) {
    state.newTaskContext = { categoryId: state.activeCategoryFilter, labelId: null, labelIds: null, personId: null, status: 'inbox' };
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    state.newTaskContext = { categoryId: null, labelId: state.activeLabelFilter, labelIds: null, personId: null, status: 'inbox' };
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    state.newTaskContext = { categoryId: null, labelId: null, labelIds: null, personId: state.activePersonFilter, status: 'inbox' };
  } else if (state.activeFilterType === 'perspective') {
    // Check if it's a custom perspective
    const customPerspective = state.customPerspectives.find(p => p.id === state.activePerspective);
    if (customPerspective && customPerspective.filter) {
      // Apply custom perspective filter rules
      const customStatus = customPerspective.filter.status === 'today' ? 'anytime' : (customPerspective.filter.status || 'inbox');
      const customToday = customPerspective.filter.status === 'today';
      state.newTaskContext = {
        categoryId: customPerspective.filter.categoryId || null,
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
        categoryId: null,
        labelId: null,
        labelIds: null,
        personId: null,
        status: statusMap[state.activePerspective] || 'inbox',
        today: state.activePerspective === 'today',
        flagged: state.activePerspective === 'flagged'
      };
    }
  } else {
    state.newTaskContext = { categoryId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
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

  // Apply category/label/person context
  if (state.activeFilterType === 'category' && state.activeCategoryFilter) {
    options.categoryId = state.activeCategoryFilter;
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
      if (customPerspective.filter.categoryId) options.categoryId = customPerspective.filter.categoryId;
      if (customPerspective.filter.labelIds && customPerspective.filter.labelIds.length > 0) {
        options.labels = customPerspective.filter.labelIds;
      }
      if (customPerspective.filter.statusRule === 'flagged') options.flagged = true;
    } else {
      // Built-in perspective - set status based on perspective
      const statusMap = { inbox: 'inbox', today: 'anytime', anytime: 'anytime', someday: 'someday' };
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
    if (inlineMeta.categoryId) options.categoryId = inlineMeta.categoryId;
    if (inlineMeta.labels && inlineMeta.labels.length) options.labels = [...(options.labels || []), ...inlineMeta.labels.filter(l => !(options.labels || []).includes(l))];
    if (inlineMeta.people && inlineMeta.people.length) options.people = [...(options.people || []), ...inlineMeta.people.filter(p => !(options.people || []).includes(p))];
    if (inlineMeta.deferDate) options.deferDate = inlineMeta.deferDate;
  }

  createTask(title, options);
  inputElement.value = '';
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
        <div class="flex items-center gap-2 mt-2 p-2 bg-warmgray/30 rounded-lg">
          <input type="text" id="inline-tag-name" placeholder="Tag name"
            class="flex-1 px-2 py-1.5 text-sm border border-softborder rounded focus:border-coral focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlineTag();}">
          <input type="color" id="inline-tag-color" value="#6B7280" class="w-8 h-8 rounded cursor-pointer border-0">
          <button onclick="addInlineTag()" class="px-3 py-1.5 text-sm bg-coral text-white rounded hover:bg-coralDark">Add</button>
          <button onclick="toggleInlineTagInput()" class="px-2 py-1.5 text-sm text-charcoal/50 hover:text-charcoal">&times;</button>
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
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer transition ${isSelected ? 'bg-warmgray' : 'hover:bg-warmgray/50'}" style="border-color: ${label.color}">
            <input type="checkbox" value="${label.id}" ${isSelected ? 'checked' : ''} class="task-label-checkbox rounded" style="accent-color: ${label.color}">
            <span class="text-sm" style="color: ${label.color}">${escapeHtml(label.name)}</span>
          </label>
        `;
      }).join('') + `
        <button onclick="toggleInlineTagInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-charcoal/50 hover:text-charcoal hover:bg-warmgray/50 rounded border border-dashed border-charcoal/20">
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
        <div class="flex items-center gap-2 mt-2 p-2 bg-warmgray/30 rounded-lg">
          <input type="text" id="inline-person-name" placeholder="Person name"
            class="flex-1 px-2 py-1.5 text-sm border border-softborder rounded focus:border-coral focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlinePerson();}">
          <button onclick="addInlinePerson()" class="px-3 py-1.5 text-sm bg-coral text-white rounded hover:bg-coralDark">Add</button>
          <button onclick="toggleInlinePersonInput()" class="px-2 py-1.5 text-sm text-charcoal/50 hover:text-charcoal">&times;</button>
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
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded border border-charcoal/20 cursor-pointer transition ${isSelected ? 'bg-warmgray border-charcoal/40' : 'hover:bg-warmgray/50'}">
            <input type="checkbox" value="${person.id}" ${isSelected ? 'checked' : ''} class="task-person-checkbox rounded">
            <span class="text-sm text-charcoal/70">${escapeHtml(person.name)}</span>
          </label>
        `;
      }).join('') + `
        <button onclick="toggleInlinePersonInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-charcoal/50 hover:text-charcoal hover:bg-warmgray/50 rounded border border-dashed border-charcoal/20">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `;
    }
    document.getElementById('inline-person-form').innerHTML = '';
  }
}

// ============================================================================
// ENTITY MODAL SAVE FUNCTIONS (Category, Label, Person)
// ============================================================================

/**
 * Save or update a category (area) from its modal.
 */
export function saveCategoryFromModal() {
  const name = document.getElementById('category-name').value.trim();
  if (!name) {
    alert('Please enter an area name');
    return;
  }

  if (state.editingCategoryId) {
    updateCategory(state.editingCategoryId, { name });
  } else {
    createCategory(name);
  }
  state.showCategoryModal = false;
  state.editingCategoryId = null;
  window.render();
}

/**
 * Save or update a label (tag) from its modal.
 */
export function saveLabelFromModal() {
  const name = document.getElementById('label-name').value.trim();
  if (!name) {
    alert('Please enter a tag name');
    return;
  }
  const color = document.getElementById('label-color').value;

  if (state.editingLabelId) {
    updateLabel(state.editingLabelId, { name, color });
  } else {
    createLabel(name, color);
  }
  state.showLabelModal = false;
  state.editingLabelId = null;
  window.render();
}

/**
 * Save or update a person from its modal.
 */
export function savePersonFromModal() {
  const name = document.getElementById('person-name').value.trim();
  if (!name) {
    alert('Please enter a name');
    return;
  }

  if (state.editingPersonId) {
    updatePerson(state.editingPersonId, { name });
  } else {
    createPerson(name);
  }
  state.showPersonModal = false;
  state.editingPersonId = null;
  window.render();
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
export function setupAutocomplete(inputId, dropdownId, items, onSelect, getDisplayFn, getIconFn, allowCreate = false, createFn = null, placeholder = 'Search...') {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  let highlightedIndex = -1;

  function renderOptions(filter = '') {
    const filtered = items.filter(item =>
      getDisplayFn(item).toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0 && !allowCreate) {
      dropdown.innerHTML = '<div class="autocomplete-empty">No matches found</div>';
    } else {
      dropdown.innerHTML = filtered.map((item, idx) => `
        <div class="autocomplete-option ${idx === highlightedIndex ? 'highlighted' : ''}"
             data-id="${item.id}"
             onmouseenter="this.classList.add('highlighted'); document.querySelectorAll('#${dropdownId} .autocomplete-option').forEach((o,i) => { if(o !== this) o.classList.remove('highlighted'); })">
          ${getIconFn ? getIconFn(item) : ''}
          <span>${getDisplayFn(item)}</span>
        </div>
      `).join('');

      if (allowCreate && filter.trim() && !filtered.some(i => getDisplayFn(i).toLowerCase() === filter.toLowerCase())) {
        dropdown.innerHTML += `
          <div class="autocomplete-create" data-create="true">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create "${filter}"
          </div>
        `;
      }
    }

    // Add click handlers
    dropdown.querySelectorAll('.autocomplete-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const item = items.find(i => i.id === opt.dataset.id);
        if (item) {
          onSelect(item);
          dropdown.classList.remove('show');
          input.value = '';
        }
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
  });

  input.addEventListener('input', () => {
    highlightedIndex = -1;
    renderOptions(input.value);
  });

  input.addEventListener('keydown', (e) => {
    const options = dropdown.querySelectorAll('.autocomplete-option');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, options.length - 1);
      options.forEach((o, i) => o.classList.toggle('highlighted', i === highlightedIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      options.forEach((o, i) => o.classList.toggle('highlighted', i === highlightedIndex));
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
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
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
    state.modalSelectedArea = editingTask.categoryId || null;
    state.modalSelectedStatus = editingTask.status || 'inbox';
    state.modalSelectedToday = !!editingTask.today;
    state.modalSelectedFlagged = !!editingTask.flagged;
    state.modalSelectedTags = [...(editingTask.labels || [])];
    state.modalSelectedPeople = [...(editingTask.people || [])];
    state.modalIsNote = editingTask.isNote || false;
    state.modalRepeatEnabled = editingTask.repeat && editingTask.repeat.type !== 'none';
  } else {
    state.modalSelectedArea = state.newTaskContext.categoryId || null;
    state.modalSelectedStatus = state.newTaskContext.status || 'inbox';
    state.modalSelectedToday = !!state.newTaskContext.today;
    state.modalSelectedFlagged = !!state.newTaskContext.flagged;
    state.modalSelectedTags = state.newTaskContext.labelIds ? [...state.newTaskContext.labelIds] : (state.newTaskContext.labelId ? [state.newTaskContext.labelId] : []);
    state.modalSelectedPeople = state.newTaskContext.personId ? [state.newTaskContext.personId] : [];
    state.modalIsNote = state.activePerspective === 'notes';
    state.modalRepeatEnabled = false;
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
  const input = document.getElementById(type === 'defer' ? 'task-defer' : 'task-due');
  if (!input) return;
  if (offsetDays === null) {
    input.value = '';
    updateDateDisplay(type);
    return;
  }
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  input.value = `${y}-${m}-${dd}`;
  updateDateDisplay(type);
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
           ${area.icon || '\uD83D\uDCC1'} ${escapeHtml(area.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`
      : '<span class="text-[var(--text-muted)] text-sm">No area selected</span>';
  }
}

/**
 * Render the area autocomplete input inside the modal.
 * Sets up the search input, display, and autocomplete dropdown.
 */
export function renderAreaInput() {
  const container = document.getElementById('area-autocomplete-container');
  if (!container) return;

  const area = state.taskCategories.find(c => c.id === state.modalSelectedArea);

  container.innerHTML = `
    <div id="area-display" class="mb-2" onclick="document.getElementById('area-search').focus()">
      ${area
        ? `<span class="tag-pill" style="background: ${area.color}20; color: ${area.color}">
             ${area.icon || '\uD83D\uDCC1'} ${escapeHtml(area.name)}
             <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
               <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
             </span>
           </span>`
        : '<span class="text-[var(--text-muted)] text-sm">No area selected</span>'}
    </div>
    <div class="autocomplete-container">
      <input type="text" id="area-search" class="autocomplete-input" placeholder="Search areas...">
      <svg class="autocomplete-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <div id="area-dropdown" class="autocomplete-dropdown"></div>
    </div>
  `;

  setupAutocomplete(
    'area-search',
    'area-dropdown',
    state.taskCategories,
    (item) => { selectArea(item); renderAreaInput(); },
    (item) => item.name,
    (item) => `<div class="autocomplete-option-icon" style="background: ${item.color}20; color: ${item.color}">${item.icon || '\uD83D\uDCC1'}</div>`,
    true,
    (name) => {
      const newCat = { id: 'cat_' + Date.now(), name, color: '#6366f1', icon: '\uD83D\uDCC1' };
      state.taskCategories.push(newCat);
      localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));
      window.debouncedSaveToGithub();
      selectArea(newCat);
      renderAreaInput();
    }
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
      const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
      const newTag = { id: 'label_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)] };
      state.taskLabels.push(newTag);
      localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
      window.debouncedSaveToGithub();
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
    <div class="tag-input-container" onclick="document.getElementById('people-search').focus()">
      ${selectedPeopleObjects.map(person => `
        <span class="tag-pill" style="background: var(--accent-light); color: var(--accent)">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          ${escapeHtml(person.name)}
          <span class="tag-pill-remove" onclick="event.stopPropagation(); removePerson('${person.id}');">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </span>
        </span>
      `).join('')}
      <input type="text" id="people-search" class="tag-input-field" placeholder="${selectedPeopleObjects.length ? '' : 'Add people...'}">
    </div>
    <div id="people-dropdown" class="autocomplete-dropdown"></div>
  `;

  setupAutocomplete(
    'people-search',
    'people-dropdown',
    state.taskPeople.filter(p => !state.modalSelectedPeople.includes(p.id)),
    (item) => addPerson(item),
    (item) => item.name,
    () => `<div class="autocomplete-option-icon bg-[var(--bg-secondary)]"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`,
    true,
    (name) => {
      const newPerson = { id: 'person_' + Date.now(), name };
      state.taskPeople.push(newPerson);
      localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
      window.debouncedSaveToGithub();
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
    renderTagsInput();
    renderPeopleInput();

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
    categoryId: state.modalSelectedArea,
    deferDate: deferDateValue,
    dueDate: document.getElementById('task-due')?.value || null,
    repeat: repeat,
    labels: state.modalSelectedTags,
    people: state.modalSelectedPeople,
    isNote: state.modalIsNote
  };

  // Things 3 logic: Assigning an Area to an Inbox task moves it to Anytime (not for notes)
  if (!state.modalIsNote && taskData.status === 'inbox' && taskData.categoryId) {
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
  state.showTaskModal = false;
  state.editingTaskId = null;
  state.modalStateInitialized = false;
  window.render();
}

// ============================================================================
// SAVE PERSPECTIVE FROM MODAL
// ============================================================================

/**
 * Save a custom perspective from the perspective modal form.
 */
export function savePerspectiveFromModal() {
  const name = document.getElementById('perspective-name').value.trim();
  if (!name) {
    alert('Please enter a perspective name');
    return;
  }

  const icon = document.getElementById('perspective-icon').value || '\uD83D\uDCCC';
  const filter = {};

  const logic = document.getElementById('perspective-logic')?.value || 'all';
  if (logic) filter.logic = logic;

  const categoryId = document.getElementById('perspective-category').value;
  if (categoryId) filter.categoryId = categoryId;

  const status = document.getElementById('perspective-status').value;
  if (status) filter.status = status;

  const availability = document.getElementById('perspective-availability')?.value;
  if (availability) filter.availability = availability;

  const statusRule = document.getElementById('perspective-status-rule')?.value;
  if (statusRule) filter.statusRule = statusRule;

  const personId = document.getElementById('perspective-person')?.value;
  if (personId) filter.personId = personId;

  const tagMatch = document.getElementById('perspective-tags-mode')?.value || 'any';
  if (tagMatch) filter.tagMatch = tagMatch;

  // Collect selected tags
  const selectedTags = Array.from(document.querySelectorAll('.perspective-tag-checkbox:checked')).map(cb => cb.value);
  if (selectedTags.length > 0) filter.labelIds = selectedTags;

  if (document.getElementById('perspective-due').checked) filter.hasDueDate = true;
  if (document.getElementById('perspective-defer').checked) filter.hasDeferDate = true;
  if (document.getElementById('perspective-repeat').checked) filter.isRepeating = true;
  if (document.getElementById('perspective-untagged').checked) filter.isUntagged = true;
  if (document.getElementById('perspective-inbox').checked) filter.inboxOnly = true;

  const rangeType = document.getElementById('perspective-range-type')?.value || 'either';
  const rangeStart = document.getElementById('perspective-range-start')?.value || '';
  const rangeEnd = document.getElementById('perspective-range-end')?.value || '';
  if (rangeStart || rangeEnd) {
    filter.dateRange = { type: rangeType, start: rangeStart || null, end: rangeEnd || null };
  }

  const searchTerms = document.getElementById('perspective-search')?.value?.trim() || '';
  if (searchTerms) filter.searchTerms = searchTerms;

  if (state.editingPerspectiveId) {
    // Update existing perspective
    const idx = state.customPerspectives.findIndex(p => p.id === state.editingPerspectiveId);
    if (idx !== -1) {
      state.customPerspectives[idx] = { ...state.customPerspectives[idx], name, icon, filter };
      saveTasksData();
    }
    state.activePerspective = state.editingPerspectiveId;
  } else {
    createPerspective(name, icon, filter);
    state.activePerspective = state.customPerspectives[state.customPerspectives.length - 1].id;
  }
  state.showPerspectiveModal = false;
  state.editingPerspectiveId = null;
  window.render();
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
  const editingTask = state.editingTaskId ? state.tasksData.find(t => t.id === state.editingTaskId) : null;
  if (state.showTaskModal && !state.modalStateInitialized) {
    initModalState(editingTask);
    state.modalStateInitialized = true;
  }

  if (!state.showTaskModal) return '';

  return `
    <div class="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){closeTaskModal()}" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div class="modal-enhanced w-full max-w-xl mx-4" onclick="event.stopPropagation()">
        <!-- Mobile drag handle -->
        <div class="flex justify-center pt-3 pb-1 md:hidden">
          <div class="w-10 h-1 rounded-full bg-[var(--text-muted)]/30"></div>
        </div>
        <!-- Header -->
        <div class="modal-header-enhanced">
          <div class="flex items-center gap-4">
            <h3 id="task-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingTask ? 'Edit' : 'New'}</h3>
            <div class="type-switcher">
              <div class="type-option ${!state.modalIsNote ? 'active' : ''}" data-type="task" onclick="setModalType(false)">
                <span class="mr-1.5">\u25CB</span>Task
              </div>
              <div class="type-option ${state.modalIsNote ? 'active' : ''}" data-type="note" onclick="setModalType(true)">
                <span class="mr-1.5">\u25C9</span>Note
              </div>
            </div>
          </div>
          <button onclick="closeTaskModal()" aria-label="Close dialog" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-enhanced">
          <!-- Title -->
          <div class="modal-section">
            <input type="text" id="task-title" value="${editingTask?.title || ''}"
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
              class="modal-textarea-enhanced">${editingTask?.notes || ''}</textarea>
          </div>

          <!-- When (Status Pills) - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">When</label>
            <div class="status-pills">
              <div class="status-pill ${state.modalSelectedStatus === 'inbox' ? 'selected' : ''}" data-status="inbox" onclick="setModalStatus('inbox')">
                <span class="status-icon">${THINGS3_ICONS.inbox.replace('w-5 h-5', 'w-4 h-4')}</span>Inbox
              </div>
              <div class="status-pill ${state.modalSelectedToday ? 'selected' : ''}" data-status="today" onclick="setModalStatus('today')">
                <span class="status-icon">${THINGS3_ICONS.today.replace('w-5 h-5', 'w-4 h-4')}</span>Today
              </div>
              <div class="status-pill ${state.modalSelectedFlagged ? 'selected' : ''}" data-status="flagged" onclick="toggleModalFlagged()">
                <span class="status-icon">${THINGS3_ICONS.flagged.replace('w-5 h-5', 'w-4 h-4')}</span>Flag
              </div>
              <div class="status-pill ${state.modalSelectedStatus === 'anytime' ? 'selected' : ''}" data-status="anytime" onclick="setModalStatus('anytime')">
                <span class="status-icon">${THINGS3_ICONS.anytime.replace('w-5 h-5', 'w-4 h-4')}</span>Anytime
              </div>
              <div class="status-pill ${state.modalSelectedStatus === 'someday' ? 'selected' : ''}" data-status="someday" onclick="setModalStatus('someday')">
                <span class="status-icon">${THINGS3_ICONS.someday.replace('w-5 h-5', 'w-4 h-4')}</span>Someday
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Area (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">Area</label>
            <div id="area-autocomplete-container"></div>
          </div>

          <!-- Dates - Tasks only -->
          ${!state.modalIsNote ? `
          <div class="modal-section">
            <label class="modal-section-label">Schedule</label>
            <!-- Defer Until -->
            <div class="date-row mb-2" onclick="openDatePicker('defer')">
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
            <div class="date-quick-row mb-3">
              <button class="date-quick-pill" onclick="setQuickDate('defer', 0)">Today</button>
              <button class="date-quick-pill" onclick="setQuickDate('defer', 1)">Tomorrow</button>
              <button class="date-quick-pill" onclick="setQuickDate('defer', 7)">Next Week</button>
              <button class="date-quick-pill ghost" onclick="setQuickDate('defer', null)">Clear</button>
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
              <button class="date-quick-pill" onclick="setQuickDate('due', 0)">Today</button>
              <button class="date-quick-pill" onclick="setQuickDate('due', 1)">Tomorrow</button>
              <button class="date-quick-pill" onclick="setQuickDate('due', 7)">Next Week</button>
              <button class="date-quick-pill ghost" onclick="setQuickDate('due', null)">Clear</button>
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
                  class="w-16 px-3 py-2 border border-[var(--border)] rounded-lg text-sm text-center bg-[var(--bg-input)]">
                <select id="task-repeat-type" class="px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)]">
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
        </div>

        <!-- Footer -->
        <div class="modal-footer-enhanced">
          <button onclick="closeTaskModal()"
            class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-light)] rounded-lg transition">
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

// ============================================================================
// DATE QUERY PARSER (for ! trigger in inline autocomplete)
// ============================================================================

/**
 * Parse a natural language date query and return matching date suggestions.
 * Supports: today/tod, tomorrow/tmr, day names, next+day, in N d/w/m, month+day.
 *
 * @param {string} query - The date query text
 * @returns {Array<{name: string, date: string}>} Array of date suggestions
 */
export function parseDateQuery(query) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function fmtDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function getNextWeekday(from, dayIdx) {
    const d = new Date(from);
    const diff = (dayIdx - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
    return d;
  }

  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const dayShort = ['sun','mon','tue','wed','thu','fri','sat'];
  const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const monthShort = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

  const q = (query || '').trim().toLowerCase();

  // Default suggestions when empty
  if (!q) {
    const nextMon = getNextWeekday(today, 1);
    return [
      { name: 'Today', date: fmtDate(today) },
      { name: 'Tomorrow', date: fmtDate(addDays(today, 1)) },
      { name: 'Next Monday', date: fmtDate(nextMon) },
      { name: 'In 1 Week', date: fmtDate(addDays(today, 7)) }
    ];
  }

  const results = [];

  // today / tod
  if ('today'.startsWith(q) || q === 'tod') {
    results.push({ name: 'Today', date: fmtDate(today) });
  }
  // tomorrow / tmr
  if ('tomorrow'.startsWith(q) || 'tmr'.startsWith(q)) {
    results.push({ name: 'Tomorrow', date: fmtDate(addDays(today, 1)) });
  }

  // "next <day>" pattern
  const nextMatch = q.match(/^next\s+(.+)$/);
  if (nextMatch) {
    const dayQ = nextMatch[1];
    dayNames.forEach((name, idx) => {
      if (name.startsWith(dayQ) || dayShort[idx].startsWith(dayQ)) {
        results.push({ name: 'Next ' + name.charAt(0).toUpperCase() + name.slice(1), date: fmtDate(getNextWeekday(addDays(today, 1), idx)) });
      }
    });
  }

  // Day names (without "next")
  if (!nextMatch) {
    dayNames.forEach((name, idx) => {
      if (name.startsWith(q) || dayShort[idx].startsWith(q)) {
        results.push({ name: name.charAt(0).toUpperCase() + name.slice(1), date: fmtDate(getNextWeekday(today, idx)) });
      }
    });
  }

  // "in N day(s)/week(s)/month(s)"
  const inMatch = q.match(/^in\s+(\d+)\s*(d|day|days|w|week|weeks|m|month|months)?\s*$/);
  if (inMatch) {
    const n = parseInt(inMatch[1]);
    const unit = (inMatch[2] || 'd')[0];
    if (unit === 'd') {
      results.push({ name: `In ${n} day${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n)) });
    } else if (unit === 'w') {
      results.push({ name: `In ${n} week${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n * 7)) });
    } else if (unit === 'm') {
      const d = new Date(today); d.setMonth(d.getMonth() + n);
      results.push({ name: `In ${n} month${n !== 1 ? 's' : ''}`, date: fmtDate(d) });
    }
  }
  // Partial "in" with just number: "in 3" -> suggest days/weeks/months
  const inPartial = q.match(/^in\s+(\d+)\s*$/);
  if (inPartial && !inMatch) {
    const n = parseInt(inPartial[1]);
    results.push({ name: `In ${n} day${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n)) });
    results.push({ name: `In ${n} week${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n * 7)) });
    const dm = new Date(today); dm.setMonth(dm.getMonth() + n);
    results.push({ name: `In ${n} month${n !== 1 ? 's' : ''}`, date: fmtDate(dm) });
  }

  // Month + day: "jan 15", "feb 3"
  const monthDayMatch = q.match(/^([a-z]+)\s+(\d{1,2})$/);
  if (monthDayMatch) {
    const mq = monthDayMatch[1];
    const day = parseInt(monthDayMatch[2]);
    monthNames.forEach((name, idx) => {
      if (name.startsWith(mq) || monthShort[idx] === mq) {
        let d = new Date(today.getFullYear(), idx, day);
        if (d < today) d = new Date(today.getFullYear() + 1, idx, day);
        const label = monthShort[idx].charAt(0).toUpperCase() + monthShort[idx].slice(1) + ' ' + day;
        results.push({ name: label, date: fmtDate(d) });
      }
    });
  }

  return results.slice(0, 5);
}

// ============================================================================
// INLINE AUTOCOMPLETE (Todoist-style #, @, &, !)
// ============================================================================

/**
 * Setup inline autocomplete on an input element.
 * Trigger characters: # (areas), @ (tags), & (people), ! (dates -> defer date)
 *
 * Works in: modal title, quick-add, home quick-add, inline edit.
 * Uses capture phase + stopImmediatePropagation to fire before onkeydown handlers.
 *
 * @param {string} inputId - DOM id of the input element
 * @param {object} [config={}] - Configuration
 * @param {boolean} [config.isModal=false] - If true, updates modal state directly
 * @param {object} [config.initialMeta] - Initial metadata for non-modal inputs
 * @param {Function} [config.onMetadataChange] - Callback when metadata changes
 */
export function setupInlineAutocomplete(inputId, config = {}) {
  const input = document.getElementById(inputId);
  if (!input || input.dataset.inlineAcAttached) return;
  input.dataset.inlineAcAttached = '1';

  const isModal = config.isModal || false;
  if (!isModal && !state.inlineAutocompleteMeta.has(inputId)) {
    state.inlineAutocompleteMeta.set(inputId, {
      categoryId: config.initialMeta?.categoryId || null,
      labels: config.initialMeta?.labels ? [...config.initialMeta.labels] : [],
      people: config.initialMeta?.people ? [...config.initialMeta.people] : [],
      deferDate: config.initialMeta?.deferDate || null
    });
  }

  let popup = null;
  let activeIndex = 0;
  let triggerChar = null;
  let triggerPos = -1;

  function getMeta() {
    if (isModal) return { categoryId: state.modalSelectedArea, labels: state.modalSelectedTags, people: state.modalSelectedPeople, deferDate: document.getElementById('task-defer')?.value || null };
    return state.inlineAutocompleteMeta.get(inputId) || { categoryId: null, labels: [], people: [], deferDate: null };
  }

  function setMeta(key, value) {
    if (isModal) {
      if (key === 'categoryId') { state.modalSelectedArea = value; renderAreaInput(); }
      else if (key === 'labels') { state.modalSelectedTags = value; renderTagsInput(); }
      else if (key === 'people') { state.modalSelectedPeople = value; renderPeopleInput(); }
      else if (key === 'deferDate') {
        const deferInput = document.getElementById('task-defer');
        if (deferInput) { deferInput.value = value || ''; updateDateDisplay('defer'); }
      }
    } else {
      const meta = getMeta();
      meta[key] = value;
      state.inlineAutocompleteMeta.set(inputId, meta);
      if (config.onMetadataChange) config.onMetadataChange(meta);
      renderInlineChips(inputId);
    }
  }

  function getItems(query) {
    const meta = getMeta();
    if (triggerChar === '#') return state.taskCategories;
    if (triggerChar === '@') return state.taskLabels.filter(l => !(meta.labels || []).includes(l.id));
    if (triggerChar === '&') return state.taskPeople.filter(p => !(meta.people || []).includes(p.id));
    if (triggerChar === '!') return parseDateQuery(query || '');
    return [];
  }

  function getCreateFn() {
    if (triggerChar === '#') return (name) => {
      const c = { id: 'cat_' + Date.now(), name, color: '#6366f1', icon: '\uD83D\uDCC1' };
      state.taskCategories.push(c);
      localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));
      window.debouncedSaveToGithub();
      return c;
    };
    if (triggerChar === '@') return (name) => {
      const colors = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
      const l = { id: 'label_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)] };
      state.taskLabels.push(l);
      localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
      window.debouncedSaveToGithub();
      return l;
    };
    if (triggerChar === '&') return (name) => {
      const colors = ['#4A90A4','#6B8E5A','#E5533D','#C4943D','#7C6B8E'];
      const p = { id: 'person_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)] };
      state.taskPeople.push(p);
      localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
      window.debouncedSaveToGithub();
      return p;
    };
    return null;
  }

  function selectItem(item) {
    // Remove trigger + query from input value
    const val = input.value;
    const before = val.substring(0, triggerPos);
    const afterCaret = val.substring(input.selectionStart);
    input.value = before.trimEnd() + (before.trimEnd() ? ' ' : '') + afterCaret.trimStart();
    // Re-position caret
    const newPos = (before.trimEnd() + (before.trimEnd() ? ' ' : '')).length;
    input.setSelectionRange(newPos, newPos);

    // Apply metadata
    if (triggerChar === '#') {
      setMeta('categoryId', item.id);
    } else if (triggerChar === '@') {
      const meta = getMeta();
      const labels = [...(meta.labels || [])];
      if (!labels.includes(item.id)) labels.push(item.id);
      setMeta('labels', labels);
    } else if (triggerChar === '&') {
      const meta = getMeta();
      const people = [...(meta.people || [])];
      if (!people.includes(item.id)) people.push(item.id);
      setMeta('people', people);
    } else if (triggerChar === '!') {
      setMeta('deferDate', item.date);
    }
    dismissPopup();
    input.focus();
  }

  function dismissPopup() {
    if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
    popup = null;
    triggerChar = null;
    triggerPos = -1;
    activeIndex = 0;
  }

  function renderPopup(items, query) {
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'inline-autocomplete-popup';
      popup.addEventListener('mousedown', (e) => e.preventDefault()); // Prevent blur
      document.body.appendChild(popup);
    }

    // Position near input
    const rect = input.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    popup.style.left = Math.min(rect.left, window.innerWidth - 310) + 'px';
    popup.style.width = Math.min(rect.width, 300) + 'px';
    if (spaceBelow > 240) {
      popup.style.top = rect.bottom + 4 + 'px';
      popup.style.bottom = 'auto';
    } else {
      popup.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
      popup.style.top = 'auto';
    }

    const isDate = triggerChar === '!';
    const filtered = isDate ? items : items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    const hasExactMatch = isDate ? true : items.some(i => i.name.toLowerCase() === query.toLowerCase());
    const showCreate = !isDate && query.length > 0 && !hasExactMatch;
    const totalItems = filtered.length + (showCreate ? 1 : 0);

    if (totalItems === 0) { dismissPopup(); return; }
    if (activeIndex >= totalItems) activeIndex = totalItems - 1;
    if (activeIndex < 0) activeIndex = 0;

    const typeLabel = triggerChar === '#' ? 'Area' : triggerChar === '@' ? 'Tag' : triggerChar === '!' ? 'Date' : 'Person';
    let html = '';
    filtered.forEach((item, idx) => {
      const isActive = idx === activeIndex ? ' active' : '';
      let icon;
      if (isDate) {
        icon = `<span class="ac-icon" style="background:#8b5cf620;color:#8b5cf6"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>`;
      } else if (triggerChar === '#') {
        icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">${item.icon || '\uD83D\uDCC1'}</span>`;
      } else if (triggerChar === '@') {
        icon = `<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${item.color}"></span>`;
      } else {
        icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">\uD83D\uDC64</span>`;
      }
      const dateLabel = isDate ? `<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${formatSmartDate(item.date)}</span>` : '';
      html += `<div class="inline-ac-option${isActive}" data-idx="${idx}" style="${isDate ? 'justify-content:space-between' : ''}">${icon}<span>${escapeHtml(item.name)}</span>${dateLabel}</div>`;
    });
    if (showCreate) {
      const createIdx = filtered.length;
      const isActive = activeIndex === createIdx ? ' active' : '';
      html += `<div class="inline-ac-create${isActive}" data-idx="${createIdx}">+ Create ${typeLabel} "${escapeHtml(query)}"</div>`;
    }
    popup.innerHTML = html;

    // Click handlers
    popup.querySelectorAll('.inline-ac-option').forEach(el => {
      el.addEventListener('click', () => selectItem(filtered[parseInt(el.dataset.idx)]));
    });
    const createEl = popup.querySelector('.inline-ac-create');
    if (createEl) {
      createEl.addEventListener('click', () => {
        const createFn = getCreateFn();
        if (createFn) {
          const newItem = createFn(query);
          selectItem(newItem);
        }
      });
    }
  }

  function checkTrigger() {
    const val = input.value;
    const caret = input.selectionStart;

    // Scan backwards from caret for trigger char
    for (let i = caret - 1; i >= 0; i--) {
      const ch = val[i];
      if (ch === '\n') { dismissPopup(); return; }
      if (ch === ' ') {
        // For ! trigger, allow spaces (multi-word queries like "!next monday")
        // Continue scanning backwards to find a ! trigger
        for (let j = i - 1; j >= 0; j--) {
          const ch2 = val[j];
          if (ch2 === '\n' || ch2 === '#' || ch2 === '@' || ch2 === '&') break;
          if (ch2 === '!' && (j === 0 || val[j-1] === ' ')) {
            triggerChar = '!';
            triggerPos = j;
            const query = val.substring(j + 1, caret);
            const items = getItems(query);
            activeIndex = 0;
            renderPopup(items, query);
            return;
          }
        }
        dismissPopup(); return;
      }
      if ((ch === '#' || ch === '@' || ch === '&') && (i === 0 || val[i-1] === ' ')) {
        triggerChar = ch;
        triggerPos = i;
        const query = val.substring(i + 1, caret);
        const items = getItems(query);
        activeIndex = 0;
        renderPopup(items, query);
        return;
      }
      if (ch === '!' && (i === 0 || val[i-1] === ' ')) {
        triggerChar = '!';
        triggerPos = i;
        const query = val.substring(i + 1, caret);
        const items = getItems(query);
        activeIndex = 0;
        renderPopup(items, query);
        return;
      }
    }
    dismissPopup();
  }

  input.addEventListener('input', () => checkTrigger());

  // Use capture phase so this fires BEFORE onkeydown attribute handlers
  input.addEventListener('keydown', (e) => {
    if (!popup) return;
    const val = input.value;
    const caret = input.selectionStart;
    const query = val.substring(triggerPos + 1, caret);
    const isDate = triggerChar === '!';
    const items = getItems(query);
    const filtered = isDate ? items : items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    const hasExactMatch = isDate ? true : items.some(i => i.name.toLowerCase() === query.toLowerCase());
    const showCreate = !isDate && query.length > 0 && !hasExactMatch;
    const totalItems = filtered.length + (showCreate ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopImmediatePropagation();
      activeIndex = (activeIndex + 1) % totalItems;
      renderPopup(items, query);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopImmediatePropagation();
      activeIndex = (activeIndex - 1 + totalItems) % totalItems;
      renderPopup(items, query);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e._inlineAcHandled = true;
      if (activeIndex < filtered.length) {
        selectItem(filtered[activeIndex]);
      } else if (showCreate) {
        const createFn = getCreateFn();
        if (createFn) {
          const newItem = createFn(query);
          selectItem(newItem);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e._inlineAcHandled = true;
      dismissPopup();
    }
  }, true);

  let blurTimeout;
  input.addEventListener('blur', () => {
    blurTimeout = setTimeout(() => dismissPopup(), 150);
  });
  input.addEventListener('focus', () => {
    clearTimeout(blurTimeout);
  });

  // Render initial chips for non-modal
  if (!isModal) renderInlineChips(inputId);
}

// ============================================================================
// INLINE CHIPS (metadata display below non-modal inputs)
// ============================================================================

/**
 * Render metadata chips (area, tags, people, defer date) below an input.
 * @param {string} inputId - DOM id of the input element
 */
export function renderInlineChips(inputId) {
  const meta = state.inlineAutocompleteMeta.get(inputId);
  if (!meta) return;
  const input = document.getElementById(inputId);
  if (!input) return;

  // Find or create chips container
  let chipsEl = document.getElementById(inputId + '-chips');
  if (!chipsEl) {
    chipsEl = document.createElement('div');
    chipsEl.id = inputId + '-chips';
    chipsEl.className = 'inline-meta-chips';
    input.parentNode.insertBefore(chipsEl, input.nextSibling);
  }

  let html = '';
  // Area chip
  if (meta.categoryId) {
    const cat = state.taskCategories.find(c => c.id === meta.categoryId);
    if (cat) {
      html += `<span class="inline-meta-chip" style="background:${cat.color}20;color:${cat.color}">
        ${cat.icon || '\uD83D\uDCC1'} ${escapeHtml(cat.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','category','${cat.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  }
  // Label chips
  (meta.labels || []).forEach(lid => {
    const label = state.taskLabels.find(l => l.id === lid);
    if (label) {
      html += `<span class="inline-meta-chip" style="background:${label.color}20;color:${label.color}">
        ${escapeHtml(label.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','label','${label.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  });
  // People chips
  (meta.people || []).forEach(pid => {
    const person = state.taskPeople.find(p => p.id === pid);
    if (person) {
      html += `<span class="inline-meta-chip" style="background:${person.color}20;color:${person.color}">
        \uD83D\uDC64 ${escapeHtml(person.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','person','${person.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  });
  // Defer date chip
  if (meta.deferDate) {
    html += `<span class="inline-meta-chip" style="background:#8b5cf620;color:#8b5cf6">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      ${formatSmartDate(meta.deferDate)}
      <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','deferDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`;
  }
  chipsEl.innerHTML = html;
}

/**
 * Remove a piece of inline autocomplete metadata from a non-modal input.
 * @param {string} inputId - DOM id of the input
 * @param {string} type - 'category' | 'label' | 'person' | 'deferDate'
 * @param {string} id - Entity ID to remove (unused for deferDate)
 */
export function removeInlineMeta(inputId, type, id) {
  const meta = state.inlineAutocompleteMeta.get(inputId);
  if (!meta) return;
  if (type === 'category') meta.categoryId = null;
  else if (type === 'label') meta.labels = (meta.labels || []).filter(l => l !== id);
  else if (type === 'person') meta.people = (meta.people || []).filter(p => p !== id);
  else if (type === 'deferDate') meta.deferDate = null;
  state.inlineAutocompleteMeta.set(inputId, meta);
  renderInlineChips(inputId);
}

/**
 * Cleanup inline autocomplete state for an input (remove metadata and chips).
 * @param {string} inputId - DOM id of the input
 */
export function cleanupInlineAutocomplete(inputId) {
  state.inlineAutocompleteMeta.delete(inputId);
  const chipsEl = document.getElementById(inputId + '-chips');
  if (chipsEl) chipsEl.remove();
  // Remove any open popup
  document.querySelectorAll('.inline-autocomplete-popup').forEach(p => p.remove());
}

// ============================================================================
// ENTITY MODAL RENDERERS (Perspective, Category, Label, Person)
// ============================================================================

/**
 * Render the perspective (custom view) create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderPerspectiveModalHtml() {
  if (!state.showPerspectiveModal) return '';
  const editingPerspective = state.editingPerspectiveId
    ? (state.customPerspectives || []).find(p => p.id === state.editingPerspectiveId)
    : null;
  return `
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showPerspectiveModal=false; editingPerspectiveId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="perspective-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="perspective-modal-title" class="font-semibold text-charcoal">${editingPerspective ? 'Edit Custom View' : 'New Custom View'}</h3>
          <button onclick="showPerspectiveModal=false; editingPerspectiveId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="perspective-name" placeholder="e.g., Work Projects" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePerspectiveFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="text-sm text-charcoal/70 block mb-1">Icon (emoji)</label>
              <input type="text" id="perspective-icon" value="📌" maxlength="2"
                class="w-20 px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none text-center text-xl">
            </div>
            <div class="flex-1">
              <label class="text-sm text-charcoal/70 block mb-1">Match</label>
              <select id="perspective-logic" class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
                <option value="all">All rules</option>
                <option value="any">Any rule</option>
                <option value="none">No rules</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Availability (OmniFocus-style)</label>
              <select id="perspective-availability" class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
                <option value="available">Available</option>
                <option value="">Any availability</option>
                <option value="remaining">Remaining</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Filter by Area</label>
            <select id="perspective-category" class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
              <option value="">Any area</option>
              ${(state.taskCategories || []).map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-charcoal/70 block mb-1">Filter by Status</label>
              <select id="perspective-status" class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
                <option value="">Any status</option>
                <option value="inbox">Inbox</option>
                <option value="today">Today</option>
                <option value="anytime">Anytime</option>
                <option value="someday">Someday</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-charcoal/70 block mb-1">Special Status</label>
              <select id="perspective-status-rule" class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
                <option value="">None</option>
                <option value="flagged">Flagged</option>
                <option value="dueSoon">Due Soon (next 7 days)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Filter by Person</label>
            <select id="perspective-person" class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
              <option value="">Any person</option>
              ${(state.taskPeople || []).map(person => `<option value="${person.id}">${escapeHtml(person.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm text-charcoal/70">Filter by Tags</label>
              <select id="perspective-tags-mode" class="px-2 py-1 text-xs border border-softborder rounded">
                <option value="any">Match any</option>
                <option value="all">Match all</option>
              </select>
            </div>
            <div class="border border-softborder rounded p-2 max-h-32 overflow-y-auto space-y-1">
              ${(state.taskLabels || []).length > 0 ? state.taskLabels.map(label => `
                <label class="flex items-center gap-2 px-2 py-1 rounded hover:bg-warmgray cursor-pointer">
                  <input type="checkbox" class="perspective-tag-checkbox rounded border-softborder" value="${label.id}">
                  <span class="w-2 h-2 rounded-full" style="background-color: ${label.color}"></span>
                  <span class="text-sm text-charcoal/80">${escapeHtml(label.name)}</span>
                </label>
              `).join('') : '<p class="text-sm text-charcoal/40 text-center py-2">No tags created yet</p>'}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center gap-2 text-sm text-charcoal/70">
              <input type="checkbox" id="perspective-due" class="rounded border-softborder">
              Has due date
            </label>
            <label class="flex items-center gap-2 text-sm text-charcoal/70">
              <input type="checkbox" id="perspective-defer" class="rounded border-softborder">
              Has defer date
            </label>
            <label class="flex items-center gap-2 text-sm text-charcoal/70">
              <input type="checkbox" id="perspective-repeat" class="rounded border-softborder">
              Repeating
            </label>
            <label class="flex items-center gap-2 text-sm text-charcoal/70">
              <input type="checkbox" id="perspective-untagged" class="rounded border-softborder">
              Untagged
            </label>
            <label class="flex items-center gap-2 text-sm text-charcoal/70">
              <input type="checkbox" id="perspective-inbox" class="rounded border-softborder">
              Inbox only
            </label>
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Date Range</label>
            <div class="grid grid-cols-3 gap-2">
              <select id="perspective-range-type" class="px-2 py-2 border border-softborder rounded focus:border-coral focus:outline-none text-sm">
                <option value="either">Due or Defer</option>
                <option value="due">Due only</option>
                <option value="defer">Defer only</option>
              </select>
              <input type="date" id="perspective-range-start" class="px-2 py-2 border border-softborder rounded focus:border-coral focus:outline-none text-sm">
              <input type="date" id="perspective-range-end" class="px-2 py-2 border border-softborder rounded focus:border-coral focus:outline-none text-sm">
            </div>
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Search Terms</label>
            <input type="text" id="perspective-search" placeholder="Title or notes contains..."
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingPerspective ? `
            <button onclick="if(confirm('Delete this custom view?')){deletePerspective('${editingPerspective.id}'); showPerspectiveModal=false; editingPerspectiveId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showPerspectiveModal=false; editingPerspectiveId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="savePerspectiveFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
              ${editingPerspective ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the category (area) create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderCategoryModalHtml() {
  if (!state.showCategoryModal) return '';
  const editingCategory = state.editingCategoryId
    ? (state.taskCategories || []).find(c => c.id === state.editingCategoryId)
    : null;
  return `
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showCategoryModal=false; editingCategoryId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="category-modal-title" class="font-semibold text-charcoal">${editingCategory ? 'Edit Area' : 'New Area'}</h3>
          <button onclick="showCategoryModal=false; editingCategoryId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="category-name" value="${editingCategory?.name ? escapeHtml(editingCategory.name) : ''}"
              placeholder="e.g., Work, Personal, Health" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();saveCategoryFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingCategory ? `
            <button onclick="if(confirm('Delete this area?')){deleteCategory('${editingCategory.id}'); showCategoryModal=false; editingCategoryId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showCategoryModal=false; editingCategoryId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="saveCategoryFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
              ${editingCategory ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the label (tag) create/edit modal with color picker.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderLabelModalHtml() {
  if (!state.showLabelModal) return '';
  const editingLabel = state.editingLabelId
    ? (state.taskLabels || []).find(l => l.id === state.editingLabelId)
    : null;
  return `
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showLabelModal=false; editingLabelId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="label-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="label-modal-title" class="font-semibold text-charcoal">${editingLabel ? 'Edit Tag' : 'New Tag'}</h3>
          <button onclick="showLabelModal=false; editingLabelId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="label-name" value="${editingLabel?.name ? escapeHtml(editingLabel.name) : ''}"
              placeholder="e.g., Important" autofocus maxlength="50"
              onkeydown="if(event.key==='Enter'){event.preventDefault();saveLabelFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Color</label>
            <input type="color" id="label-color" value="${editingLabel?.color || '#6B7280'}"
              class="w-full h-10 rounded border border-softborder cursor-pointer">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingLabel ? `
            <button onclick="if(confirm('Delete this tag?')){deleteLabel('${editingLabel.id}'); showLabelModal=false; editingLabelId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showLabelModal=false; editingLabelId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="saveLabelFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
              ${editingLabel ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the person create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderPersonModalHtml() {
  if (!state.showPersonModal) return '';
  const editingPerson = state.editingPersonId
    ? (state.taskPeople || []).find(p => p.id === state.editingPersonId)
    : null;
  return `
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showPersonModal=false; editingPersonId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="person-modal-title" class="font-semibold text-charcoal">${editingPerson ? 'Edit Person' : 'New Person'}</h3>
          <button onclick="showPersonModal=false; editingPersonId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="person-name" value="${editingPerson?.name ? escapeHtml(editingPerson.name) : ''}"
              placeholder="e.g., John Doe" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingPerson ? `
            <button onclick="if(confirm('Delete this person?')){deletePerson('${editingPerson.id}'); showPersonModal=false; editingPersonId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showPersonModal=false; editingPersonId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="savePersonFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
              ${editingPerson ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
