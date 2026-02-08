import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { getLocalDateString } from '../utils.js';
import { getTasksByPerson, getCategoryById, getLabelById, getPersonById } from './categories.js';

/**
 * Initialize task order properties
 * Assigns order values to tasks missing them.
 * Uses 1000-increment spacing to allow fractional insertions
 * (e.g., inserting between 1000 and 2000 = 1500)
 */
export function initializeTaskOrders() {
  let needsSave = false;
  state.tasksData.forEach((task, index) => {
    if (task.order === undefined) {
      task.order = (index + 1) * 1000;
      needsSave = true;
    }
  });
  if (needsSave) saveTasksData();
}

/**
 * Get tasks filtered by perspective rules
 * CRITICAL: This is the main filtering function for all task views
 *
 * PERSPECTIVE RULES:
 * - inbox: status='inbox' AND no categoryId
 * - today: status='today' OR dueDate=today OR overdue OR deferDate<=today
 * - upcoming: has future dueDate
 * - anytime: status='anytime' AND no future dueDate
 * - someday: status='someday'
 * - logbook: completed=true
 *
 * @param {string} perspectiveId - Perspective to filter by
 * @returns {Task[]} Filtered and sorted task array
 */
export function getFilteredTasks(perspectiveId) {
  // Notes perspective shows tasks marked as notes
  if (perspectiveId === 'notes') {
    return state.tasksData.filter(task => task.isNote && !task.completed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const allPerspectives = [...state.BUILTIN_PERSPECTIVES, ...state.customPerspectives];
  const perspective = allPerspectives.find(p => p.id === perspectiveId);
  if (!perspective) return [];

  const today = getLocalDateString();

  return state.tasksData.filter(task => {
    // Notes don't appear in regular task perspectives (except logbook which shows all completed)
    if (task.isNote && !perspective.filter.completed) return false;

    // Logbook (completed) shows all completed tasks (including notes)
    if (perspective.filter.completed) {
      return task.completed;
    }
    // Other perspectives show only non-completed tasks
    if (task.completed) return false;

    // OmniFocus model for Today:
    // - Tasks explicitly marked as 'today'
    // - Tasks with today's due date
    // - Overdue tasks (due date in the past)
    // - "Next" tasks: tasks tagged with a "next" label
    // Note: Defer date controls availability, NOT perspective membership
    if (perspectiveId === 'today') {
      // Deferred tasks are not yet available
      if (task.deferDate && task.deferDate > today) return false;
      const isDueToday = task.dueDate === today;
      const isOverdue = task.dueDate && task.dueDate < today;
      const isScheduledForToday = task.deferDate && task.deferDate <= today;
      const isTodayTask = task.status === 'today' || isDueToday || isOverdue || isScheduledForToday;

      // Include tasks tagged with "next" label
      const nextLabel = state.taskLabels.find(l => l.name.toLowerCase() === 'next');
      const isNextTask = nextLabel && (task.labels || []).includes(nextLabel.id);

      return isTodayTask || isNextTask;
    }

    // Calendar: Tasks with any date (dueDate or deferDate)
    if (perspectiveId === 'calendar') {
      return !!(task.dueDate || task.deferDate);
    }

    // Upcoming: Tasks with future due dates (not today, not overdue)
    // Shows tasks from Anytime or Someday that have scheduled due dates
    if (perspectiveId === 'upcoming') {
      if (!task.dueDate) return false;
      return task.dueDate > today;
    }

    // Anytime: Tasks available to do anytime (no specific schedule)
    // Excludes tasks that are in Today or have a future due date
    if (perspectiveId === 'anytime') {
      if (task.status !== 'anytime') return false;
      // If it has a due date in the future, it shows in Upcoming instead
      if (task.dueDate && task.dueDate > today) return false;
      // Deferred tasks are not yet available
      if (task.deferDate && task.deferDate > today) return false;
      return true;
    }

    // Someday: Tasks for later consideration
    if (perspectiveId === 'someday') {
      return task.status === 'someday';
    }

    // Next: Available tasks without deadlines (OmniFocus-style)
    // Shows tasks you can work on right now with no time pressure
    if (perspectiveId === 'next') {
      // Must be in anytime status (not inbox, someday, or today)
      if (task.status !== 'anytime') return false;
      // Must NOT have a due date (no deadline pressure)
      if (task.dueDate) return false;
      // Must be available now (not deferred to future)
      if (task.deferDate && task.deferDate > today) return false;
      return true;
    }

    // Inbox: Unprocessed tasks (no area assigned)
    // Things 3 logic: Inbox and Areas are mutually exclusive
    if (perspectiveId === 'inbox') {
      return task.status === 'inbox' && !task.categoryId;
    }

    // Custom perspectives
    if (perspective.filter.status && task.status !== perspective.filter.status) return false;
    if (perspective.filter.categoryId && task.categoryId !== perspective.filter.categoryId) return false;
    if (perspective.filter.hasLabel && !(task.labels || []).some(l => l === perspective.filter.hasLabel)) return false;
    if (perspective.filter.labelIds && perspective.filter.labelIds.length > 0) {
      // Task must have at least one of the selected tags
      if (!(task.labels || []).some(l => perspective.filter.labelIds.includes(l))) return false;
    }
    if (perspective.filter.hasDueDate && !task.dueDate) return false;
    if (perspective.filter.dueSoon) {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      const now = new Date();
      const diffDays = (due - now) / (1000 * 60 * 60 * 24);
      if (diffDays > 7 || diffDays < 0) return false;
    }
    return true;
  }).sort((a, b) => {
    // Sort by manual order first if available
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // Then by due date
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    // Inbox shows newest first
    if (perspectiveId === 'inbox') return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

// Group tasks by due date (for Upcoming view)
export function groupTasksByDate(tasks) {
  const groups = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach(task => {
    if (!task.dueDate) return;
    const date = task.dueDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
  });

  // Sort dates and return as array of { date, label, tasks }
  return Object.keys(groups).sort().map(date => {
    const d = new Date(date + 'T00:00:00');
    const diffDays = Math.floor((d - today) / (1000 * 60 * 60 * 24));
    let label;
    if (diffDays === 0) label = 'Today';
    else if (diffDays === 1) label = 'Tomorrow';
    else if (diffDays < 7) label = d.toLocaleDateString('en-US', { weekday: 'long' });
    else label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return { date, label, tasks: groups[date] };
  });
}

// Group tasks by completion date (for Logbook view)
export function groupTasksByCompletionDate(tasks) {
  const groups = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach(task => {
    if (!task.completedAt) return;
    const date = task.completedAt.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
  });

  // Sort dates descending (most recent first) and return as array of { date, label, tasks }
  return Object.keys(groups).sort().reverse().map(date => {
    const d = new Date(date + 'T00:00:00');
    const diffDays = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    let label;
    if (diffDays === 0) label = 'Today';
    else if (diffDays === 1) label = 'Yesterday';
    else if (diffDays < 7) label = d.toLocaleDateString('en-US', { weekday: 'long' });
    else label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return { date, label, tasks: groups[date] };
  });
}

// Get tasks by category
export function getTasksByCategory(categoryId) {
  const today = getLocalDateString();
  return state.tasksData.filter(task => {
    if (task.categoryId !== categoryId) return false;
    if (task.completed) return false;
    // Hide deferred tasks (deferDate in the future)
    if (task.deferDate && task.deferDate > today) return false;
    return true;
  }).sort((a, b) => {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
}

// Get tasks by label
export function getTasksByLabel(labelId) {
  const today = getLocalDateString();
  return state.tasksData.filter(task => {
    if (!(task.labels || []).includes(labelId)) return false;
    if (task.completed) return false;
    // Hide deferred tasks (deferDate in the future)
    if (task.deferDate && task.deferDate > today) return false;
    return true;
  }).sort((a, b) => {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
}

// Get current filtered tasks based on active filter type
export function getCurrentFilteredTasks() {
  if (state.activeFilterType === 'category' && state.activeCategoryFilter) {
    return getTasksByCategory(state.activeCategoryFilter);
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    return getTasksByLabel(state.activeLabelFilter);
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    return getTasksByPerson(state.activePersonFilter);
  } else {
    return getFilteredTasks(state.activePerspective);
  }
}

// Get current view info
export function getCurrentViewInfo() {
  if (state.activeFilterType === 'category' && state.activeCategoryFilter) {
    const cat = getCategoryById(state.activeCategoryFilter);
    return { icon: '\u{1F4C1}', name: cat?.name || 'Category', color: cat?.color };
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    const label = getLabelById(state.activeLabelFilter);
    return { icon: '\u{1F3F7}\uFE0F', name: label?.name || 'Tag', color: label?.color };
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    const person = getPersonById(state.activePersonFilter);
    return { icon: '\u{1F464}', name: person?.name || 'Person', color: person?.color };
  } else {
    const allPerspectives = [...state.BUILTIN_PERSPECTIVES, ...state.customPerspectives];
    const p = allPerspectives.find(p => p.id === state.activePerspective) || state.BUILTIN_PERSPECTIVES[0];
    return { icon: p.icon, name: p.name };
  }
}
