import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, getLocalDateString } from '../utils.js';

/**
 * Create a new task with full configuration options
 *
 * TASK OBJECT STRUCTURE:
 * @typedef {Object} Task
 * @property {string} id - Unique ID (task_{timestamp}_{random})
 * @property {string} title - Task name/description
 * @property {string} notes - Additional details/context
 * @property {string} status - 'inbox'|'anytime'|'someday'
 * @property {boolean} today - True if flagged for Today
 * @property {boolean} flagged - True if flagged (OmniFocus-style)
 * @property {boolean} completed - Completion state
 * @property {string|null} completedAt - ISO timestamp when completed
 * @property {string|null} categoryId - Area/category assignment
 * @property {string[]} labels - Array of label IDs (tags)
 * @property {string[]} people - Array of person IDs (delegation)
 * @property {string|null} deferDate - Start date (YYYY-MM-DD)
 * @property {string|null} dueDate - Deadline (YYYY-MM-DD)
 * @property {Object|null} repeat - Repeating config {type, interval, from}
 * @property {boolean} isNote - True = outline note, False = task
 * @property {string|null} parentId - Parent note ID for hierarchy
 * @property {number} indent - Nesting level (0 = root)
 * @property {string} createdAt - ISO creation timestamp
 * @property {string} updatedAt - ISO last modified timestamp
 *
 * THINGS 3 BEHAVIOR:
 * - Inbox tasks have no category
 * - Assigning a category moves Inbox -> Anytime
 * - "Today" is a flag (non-exclusive) and does not replace status
 * - "Flagged" is a separate boolean (OmniFocus-style)
 * - "Someday" hides task from active views
 *
 * @param {string} title - Task title
 * @param {Object} options - Optional properties (see typedef)
 * @returns {Task} Created task object
 */
export function createTask(title, options = {}) {
  let normalizedStatus = options.status === 'today' ? 'anytime' : (options.status || 'inbox');
  const hasCategory = !!options.categoryId;
  // Things 3 logic: assigning an Area to an Inbox task moves it to Anytime
  if (!options.isNote && normalizedStatus === 'inbox' && hasCategory) {
    normalizedStatus = 'anytime';
  }
  const task = {
    id: generateTaskId(),
    title: title,
    notes: options.notes || '',
    status: normalizedStatus, // inbox, anytime, someday
    today: options.today || options.status === 'today' || false,
    flagged: options.flagged || false,
    completed: false,
    completedAt: null,
    categoryId: options.categoryId || null,
    labels: options.labels || [],
    people: options.people || [],       // Array of person IDs
    deferDate: options.deferDate || null, // When task becomes available
    dueDate: options.dueDate || null,     // Deadline
    repeat: options.repeat || null,       // { type: 'daily'|'weekly'|'monthly'|'yearly', interval: 1, from: 'completion'|'due' }
    isNote: options.isNote || false,      // If true, displays as note (bullet) instead of task (checkbox)
    parentId: options.parentId || null,   // For nested notes - parent note ID
    indent: options.indent || 0,          // Nesting level (0 = root, 1 = first child, etc.)
    order: (state.tasksData.filter(t => !t.completed).length + 1) * 1000, // For manual ordering
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.tasksData.push(task);
  saveTasksData();
  return task;
}

export function updateTask(taskId, updates) {
  const idx = state.tasksData.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    const task = state.tasksData[idx];
    if (updates.status === 'today') {
      updates.status = 'anytime';
      updates.today = true;
    }
    // Things 3 logic: Assigning Area to Inbox task moves it to Anytime
    if (task.status === 'inbox' && updates.categoryId && !task.categoryId) {
      updates.status = 'anytime';
    }
    state.tasksData[idx] = { ...task, ...updates, updatedAt: new Date().toISOString() };
    saveTasksData();
  }
}

// Migrate legacy status='today' tasks to today flag
export function migrateTodayFlag() {
  let changed = false;
  state.tasksData.forEach(task => {
    if (task.status === 'today') {
      task.status = 'anytime';
      task.today = true;
      changed = true;
    }
    if (typeof task.today !== 'boolean') {
      task.today = false;
      changed = true;
    }
    if (typeof task.flagged !== 'boolean') {
      task.flagged = false;
      changed = true;
    }
  });
  if (changed) saveTasksData();
}

export function deleteTask(taskId) {
  // Promote child notes to root level (clear parentId)
  state.tasksData.forEach(t => {
    if (t.parentId === taskId) {
      t.parentId = null;
      t.indent = 0;
    }
  });
  state.tasksData = state.tasksData.filter(t => t.id !== taskId);
  // Clear inline editing state if deleting the task being edited
  if (state.inlineEditingTaskId === taskId) state.inlineEditingTaskId = null;
  saveTasksData();
}

// Delete task with confirmation
export function confirmDeleteTask(taskId) {
  // Cancel any inline editing first
  state.inlineEditingTaskId = null;
  if (confirm('Delete this task?')) {
    deleteTask(taskId);
    window.render();
  }
}

export function toggleTaskComplete(taskId) {
  const task = state.tasksData.find(t => t.id === taskId);
  if (task) {
    const wasCompleted = task.completed;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();

    // Handle repeating tasks - create next occurrence when completed
    if (task.completed && task.repeat && task.repeat.type !== 'none') {
      createNextRepeatOccurrence(task);
    }

    saveTasksData();
    window.render();
  }
}

// Calculate next date based on repeat settings
export function calculateNextRepeatDate(baseDate, repeat) {
  const date = new Date(baseDate);
  const interval = repeat.interval || 1;

  switch (repeat.type) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + (7 * interval));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + interval);
      break;
  }
  return getLocalDateString(date);
}

/**
 * Create the next occurrence of a repeating task
 * Called when a repeating task is completed
 *
 * BUG FIX: Now properly copies people array (was missing before)
 *
 * @param {Task} completedTask - The task that was just completed
 */
export function createNextRepeatOccurrence(completedTask) {
  const today = getLocalDateString();
  const baseDate = completedTask.repeat.from === 'due' && completedTask.dueDate
    ? completedTask.dueDate
    : today;

  // Calculate new defer and due dates based on repeat.from setting
  // 'due' = calculate from original due date (fixed schedule)
  // 'completion' = calculate from today (flexible schedule)
  let newDeferDate = null;
  let newDueDate = null;

  if (completedTask.deferDate) {
    const deferBase = completedTask.repeat.from === 'due' && completedTask.deferDate
      ? completedTask.deferDate
      : today;
    newDeferDate = calculateNextRepeatDate(deferBase, completedTask.repeat);
  }

  if (completedTask.dueDate) {
    newDueDate = calculateNextRepeatDate(baseDate, completedTask.repeat);
  }

  // Create new task with ALL same properties (including people!)
  // Keep the same status (Today tasks stay in Today with new date)
  createTask(completedTask.title, {
    notes: completedTask.notes,
    status: completedTask.status,
    categoryId: completedTask.categoryId,
    labels: [...(completedTask.labels || [])],
    people: [...(completedTask.people || [])], // BUG FIX: Was missing - people now preserved
    deferDate: newDeferDate,
    dueDate: newDueDate,
    repeat: { ...completedTask.repeat }
  });
}

// Get the unit label for repeat type
export function getRepeatUnitLabel(type) {
  const units = { daily: 'day(s)', weekly: 'week(s)', monthly: 'month(s)', yearly: 'year(s)' };
  return units[type] || 'day(s)';
}

// Update repeat UI when type changes
export function updateRepeatUI(type) {
  const details = document.getElementById('repeat-details');
  const fromContainer = document.getElementById('repeat-from-container');
  const unitLabel = document.getElementById('repeat-unit-label');

  if (type === 'none') {
    details.style.display = 'none';
    fromContainer.style.display = 'none';
  } else {
    details.style.display = 'flex';
    fromContainer.style.display = 'block';
    unitLabel.textContent = getRepeatUnitLabel(type);
  }
}

export function moveTaskTo(taskId, status) {
  updateTask(taskId, { status: status });
  window.render();
}
