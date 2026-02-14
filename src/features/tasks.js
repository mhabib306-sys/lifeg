import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { generateTaskId, getLocalDateString } from '../utils.js';
import { startUndoCountdown } from './undo.js';
import { DELETED_TASK_TOMBSTONES_KEY } from '../constants.js';
import { getCategoryById } from './areas.js';

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
 * @property {string|null} areaId - Area assignment
 * @property {string[]} labels - Array of label IDs (tags)
 * @property {string[]} people - Array of person IDs (delegation)
 * @property {string|null} deferDate - Start date (YYYY-MM-DD)
 * @property {string|null} dueDate - Deadline (YYYY-MM-DD)
 * @property {Object|null} repeat - Repeating config {type, interval, from}
 * @property {boolean} isNote - True = outline note, False = task
 * @property {string|null} parentId - Parent note ID for hierarchy
 * @property {number} indent - Nesting level (0 = root)
 * @property {string|null} meetingEventKey - Linked calendar event key (calendarId::eventId)
 * @property {Object|null} waitingFor - Waiting-for tracking {personId, description, followUpDate}
 * @property {boolean} isProject - True if this is a multi-step project (not a single task)
 * @property {string|null} projectId - Parent project ID (for sub-tasks linked to a project)
 * @property {string} projectType - 'sequential' (ordered) or 'parallel' (any order)
 * @property {number|null} timeEstimate - Estimated duration in minutes (5, 15, 30, 60)
 * @property {string} createdAt - ISO creation timestamp
 * @property {string} updatedAt - ISO last modified timestamp
 *
 * THINGS 3 BEHAVIOR:
 * - Inbox tasks have no area
 * - Assigning an area moves Inbox -> Anytime
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
  const hasArea = !!options.areaId;
  const isToday = !!options.today;
  // Things 3 logic: assigning an Area to an Inbox task moves it to Anytime
  if (!options.isNote && normalizedStatus === 'inbox' && (hasArea || isToday)) {
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
    areaId: options.areaId || (options.categoryId ? (getCategoryById(options.categoryId)?.areaId || null) : null),
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
    waitingFor: options.waitingFor || null, // { personId, description, followUpDate } for GTD Waiting-For list
    isProject: options.isProject || false, // GTD: Multi-step project (not a single task)
    projectId: options.projectId || null, // Parent project ID for sub-tasks
    projectType: options.projectType || 'parallel', // 'sequential' (ordered steps) or 'parallel' (any order)
    timeEstimate: options.timeEstimate || null, // GTD: Estimated duration in minutes (5, 15, 30, 60)
    lastReviewedAt: null, // ISO string — set when reviewed in Review Mode
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
  if (navigator.vibrate) navigator.vibrate(10);
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
    if (task.status === 'inbox' && updates.areaId && !task.areaId) {
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
    if (navigator.vibrate) navigator.vibrate(10);
    task.completedAt = task.completed ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();

    // Handle repeating tasks
    let spawnedTask = null;
    if (task.repeat && task.repeat.type !== 'none') {
      if (task.completed) {
        // Create next occurrence when completed
        spawnedTask = createNextRepeatOccurrence(task);
        task._spawnedRepeatId = spawnedTask ? spawnedTask.id : null;
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

    if (task.completed) {
      // Animate the row, then render after a short delay
      const el = document.querySelector(`.task-inline-title[data-task-id="${taskId}"]`)
        || document.querySelector(`[data-task-id="${taskId}"]`)
        || document.querySelector(`[data-note-id="${taskId}"]`);
      const row = el?.closest('.task-item, .swipe-row, .note-item') || el;
      if (row) {
        row.classList.add('task-completing');
        setTimeout(() => window.render(), 400);
      } else {
        window.render();
      }

      // Undo toast for completion
      const snapshot = { taskId: task.id, completed: false, completedAt: null, updatedAt: task.updatedAt, _spawnedRepeatId: task._spawnedRepeatId };
      startUndoCountdown(`"${task.title}" completed`, snapshot, (snap) => {
        // Verify task still exists (may have been deleted between completion and undo)
        const currentTask = state.tasksData.find(t => taskIdEquals(t.id, snap.taskId));
        if (!currentTask) return; // Task was deleted, nothing to undo

        currentTask.completed = false;
        currentTask.completedAt = null;
        currentTask.updatedAt = new Date().toISOString();
        // Remove spawned repeat occurrence on undo
        if (snap._spawnedRepeatId) {
          const idx = state.tasksData.findIndex(t => t.id === snap._spawnedRepeatId);
          if (idx !== -1) state.tasksData.splice(idx, 1);
          currentTask._spawnedRepeatId = null;
        }
        saveTasksData();
      });
    } else {
      window.render();
    }

    // Keep Google Calendar "Homebase Tasks" clean:
    // - completing a task removes its synced event
    // - uncompleting a dated task recreates the synced event
    if (task.completed) {
      if (task.gcalEventId) {
        const eventIdToDelete = task.gcalEventId;
        const deletePromise = window.deleteGCalEventIfConnected?.(task);
        if (deletePromise) {
          deletePromise
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
      }
    } else if (!task.gcalEventId && (task.deferDate || task.dueDate)) {
      window.pushTaskToGCalIfConnected?.(task);
    }
  } else {
    console.warn('toggleTaskComplete: task not found', taskId);
  }
}

/** Toggle the flagged state of a task (used by swipe actions) */
export function toggleFlag(taskId) {
  const task = state.tasksData.find(t => taskIdEquals(t.id, taskId));
  if (!task) return;
  task.flagged = !task.flagged;
  task.updatedAt = new Date().toISOString();
  if (navigator.vibrate) navigator.vibrate(10);
  saveTasksData();
  window.render();
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
    areaId: completedTask.areaId,
    categoryId: completedTask.categoryId || null,
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
  if (!details || !fromContainer) return;

  if (type === 'none') {
    details.style.display = 'none';
    fromContainer.style.display = 'none';
  } else {
    details.style.display = 'flex';
    fromContainer.style.display = 'block';
    if (unitLabel) unitLabel.textContent = getRepeatUnitLabel(type);
  }
}

export function moveTaskTo(taskId, status) {
  updateTask(taskId, { status: status });
  window.render();
}

// ============================================================================
// PROJECT SUPPORT (GTD Phase 2.1)
// ============================================================================

/**
 * Get all sub-tasks for a project
 * @param {string} projectId - Project task ID
 * @returns {Task[]} Array of sub-tasks linked to this project
 */
export function getProjectSubTasks(projectId) {
  return state.tasksData.filter(t => t.projectId === projectId);
}

/**
 * Calculate project completion percentage
 * @param {string} projectId - Project task ID
 * @returns {number} Completion percentage (0-100)
 */
export function getProjectCompletion(projectId) {
  const subTasks = getProjectSubTasks(projectId);
  if (subTasks.length === 0) return 0;
  const completed = subTasks.filter(t => t.completed).length;
  return Math.round((completed / subTasks.length) * 100);
}

/**
 * Get the next actionable task for a sequential project
 * @param {string} projectId - Project task ID
 * @returns {Task|null} Next incomplete task, or null if all done
 */
export function getNextSequentialTask(projectId) {
  const project = state.tasksData.find(t => t.id === projectId);
  if (!project || project.projectType !== 'sequential') return null;

  const subTasks = getProjectSubTasks(projectId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return subTasks.find(t => !t.completed) || null;
}

/**
 * Check if a project is stalled (no progress in 30 days)
 * @param {string} projectId - Project task ID
 * @returns {boolean} True if project has sub-tasks but none completed recently
 */
export function isProjectStalled(projectId) {
  const subTasks = getProjectSubTasks(projectId);
  if (subTasks.length === 0) return false;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const hasRecentActivity = subTasks.some(t =>
    t.completedAt && new Date(t.completedAt) > thirtyDaysAgo
  );

  return !hasRecentActivity;
}
