import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, getLocalDateString } from '../utils.js';
import { startUndoCountdown } from './undo.js';
import { DELETED_TASK_TOMBSTONES_KEY } from '../constants.js';

function taskIdEquals(a, b) {
  return String(a) === String(b);
}

function findTaskIndexById(taskId) {
  return state.tasksData.findIndex(t => taskIdEquals(t.id, taskId));
}

function persistDeletedTaskTombstones() {
  localStorage.setItem(DELETED_TASK_TOMBSTONES_KEY, JSON.stringify(state.deletedTaskTombstones || {}));
}

function markTaskDeleted(taskId) {
  if (!taskId) return;
  if (!state.deletedTaskTombstones || typeof state.deletedTaskTombstones !== 'object') {
    state.deletedTaskTombstones = {};
  }
  state.deletedTaskTombstones[String(taskId)] = new Date().toISOString();
  persistDeletedTaskTombstones();
}

function clearTaskDeletedMarker(taskId) {
  if (!taskId || !state.deletedTaskTombstones || typeof state.deletedTaskTombstones !== 'object') return;
  if (state.deletedTaskTombstones[String(taskId)] !== undefined) {
    delete state.deletedTaskTombstones[String(taskId)];
    persistDeletedTaskTombstones();
  }
}

export function recordTaskDeletionTombstone(taskId) {
  markTaskDeleted(taskId);
}

export function clearTaskDeletionTombstone(taskId) {
  clearTaskDeletedMarker(taskId);
}

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
 * @property {string|null} meetingEventKey - Linked calendar event key (calendarId::eventId)
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
  const isToday = !!options.today;
  // Things 3 logic: assigning an Area to an Inbox task moves it to Anytime
  if (!options.isNote && normalizedStatus === 'inbox' && (hasCategory || isToday)) {
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
    meetingEventKey: options.meetingEventKey || null, // Meeting-linked notes/tasks
    order: (state.tasksData.filter(t => !t.completed).length + 1) * 1000, // For manual ordering
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  clearTaskDeletedMarker(task.id);
  state.tasksData.push(task);
  saveTasksData();
  if (!task.isNote && (task.deferDate || task.dueDate)) {
    window.pushTaskToGCalIfConnected?.(task);
  }
  return task;
}

export function updateTask(taskId, updates) {
  const idx = findTaskIndexById(taskId);
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
    const nextStatus = updates.status ?? task.status;
    const nextToday = updates.today ?? task.today;
    if (!task.isNote && nextStatus === 'inbox' && nextToday) {
      updates.status = 'anytime';
    }
    state.tasksData[idx] = { ...task, ...updates, updatedAt: new Date().toISOString() };
    saveTasksData();
    const updated = state.tasksData[idx];
    if (!updated.isNote) {
      if (updated.deferDate || updated.dueDate) {
        window.pushTaskToGCalIfConnected?.(updated);
      } else if (updated.gcalEventId) {
        window.deleteGCalEventIfConnected?.(updated);
      }
    }
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
  const taskToDelete = state.tasksData.find(t => taskIdEquals(t.id, taskId));
  if (taskToDelete && taskToDelete.gcalEventId) {
    window.deleteGCalEventIfConnected?.(taskToDelete);
  }
  // Promote child notes to root level (clear parentId)
  state.tasksData.forEach(t => {
    if (taskIdEquals(t.parentId, taskId)) {
      t.parentId = null;
      t.indent = 0;
    }
  });
  state.tasksData = state.tasksData.filter(t => !taskIdEquals(t.id, taskId));
  markTaskDeleted(taskId);
  // Clear inline editing state if deleting the task being edited
  if (state.inlineEditingTaskId === taskId) state.inlineEditingTaskId = null;
  saveTasksData();
}

// Delete task with undo toast (replaces confirm() dialog)
export function confirmDeleteTask(taskId) {
  state.inlineEditingTaskId = null;
  const task = state.tasksData.find(t => taskIdEquals(t.id, taskId));
  if (!task) return;
  const snapshot = JSON.parse(JSON.stringify(task));
  // Snapshot children that will be promoted so we can restore their parentId
  const children = state.tasksData.filter(t => taskIdEquals(t.parentId, taskId)).map(t => JSON.parse(JSON.stringify(t)));
  deleteTask(taskId);
  startUndoCountdown(`"${snapshot.title}" deleted`, { task: snapshot, children }, (snap) => {
    clearTaskDeletedMarker(snap.task.id);
    state.tasksData.push(snap.task);
    snap.children.forEach(c => {
      const existing = state.tasksData.find(t => t.id === c.id);
      if (existing) { existing.parentId = c.parentId; existing.indent = c.indent; }
    });
    saveTasksData();
  });
}

export function toggleTaskComplete(taskId) {
  const task = state.tasksData.find(t => taskIdEquals(t.id, taskId));
  if (task) {
    const wasCompleted = task.completed;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();

    // Handle repeating tasks
    if (task.repeat && task.repeat.type !== 'none') {
      if (task.completed) {
        // Create next occurrence when completed
        const newTask = createNextRepeatOccurrence(task);
        // Store the ID of the spawned occurrence so we can clean up on uncomplete
        task._spawnedRepeatId = newTask ? newTask.id : null;
      } else if (wasCompleted && task._spawnedRepeatId) {
        // Uncompleting: remove the spawned repeat occurrence to prevent duplicates
        const spawnedIdx = state.tasksData.findIndex(t => t.id === task._spawnedRepeatId);
        if (spawnedIdx !== -1) {
          state.tasksData.splice(spawnedIdx, 1);
        }
        task._spawnedRepeatId = null;
      }
    }

    saveTasksData();
    window.render();

    // Keep Google Calendar "Homebase Tasks" clean:
    // - completing a task removes its synced event
    // - uncompleting a dated task recreates the synced event
    if (task.completed) {
      if (task.gcalEventId) {
        const eventIdToDelete = task.gcalEventId;
        window.deleteGCalEventIfConnected?.(task)
          .then(() => {
            const current = state.tasksData.find(t => taskIdEquals(t.id, taskId));
            if (!current) return;
            if (current.gcalEventId !== eventIdToDelete) return;
            current.gcalEventId = null;
            current.updatedAt = new Date().toISOString();
            saveTasksData();
            window.render();
          })
          .catch((err) => {
            console.warn('GCal completion cleanup failed:', err);
          });
      }
    } else if (!task.gcalEventId && (task.deferDate || task.dueDate)) {
      window.pushTaskToGCalIfConnected?.(task);
    }
  } else {
    console.warn('toggleTaskComplete: task not found', taskId);
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

  // Create new task with ALL same properties (including people, today, flagged!)
  // Keep the same status (Today tasks stay in Today with new date)
  return createTask(completedTask.title, {
    notes: completedTask.notes,
    status: completedTask.status,
    today: completedTask.today || false,
    flagged: completedTask.flagged || false,
    categoryId: completedTask.categoryId,
    labels: [...(completedTask.labels || [])],
    people: [...(completedTask.people || [])],
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
