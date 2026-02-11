import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { getLocalDateString } from '../utils.js';
import { BUILTIN_PERSPECTIVES } from '../constants.js';
import { getTasksByPerson, getAreaById, getLabelById, getPersonById, getCategoryById } from './areas.js';

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
 * - inbox: status='inbox' AND no areaId
 * - today: today=true OR dueDate=today OR overdue OR deferDate<=today
 * - flagged: flagged=true
 * - upcoming: has future dueDate
 * - anytime: status='anytime' (today flag does not exclude) AND no future dueDate
 * - someday: status='someday'
 * - logbook: completed=true
 *
 * @param {string} perspectiveId - Perspective to filter by
 * @returns {Task[]} Filtered and sorted task array
 */
export function getFilteredTasks(perspectiveId) {
  // Workspace no longer owns a calendar perspective.
  if (perspectiveId === 'calendar') perspectiveId = 'inbox';

  // Notes perspective shows tasks marked as notes
  if (perspectiveId === 'notes') {
    return state.tasksData.filter(task => task.isNote && !task.completed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const allPerspectives = [...BUILTIN_PERSPECTIVES, ...state.customPerspectives];
  const perspective = allPerspectives.find(p => p.id === perspectiveId);
  if (!perspective) return [];

  const today = getLocalDateString();
  const isCustom = !perspective.builtin;

  return state.tasksData.filter(task => {
    const availability = perspective.filter.availability || '';
    const wantsCompleted = availability === 'completed';

    // Notes don't appear in regular task perspectives (except completed views)
    if (task.isNote && !wantsCompleted && !perspective.filter.completed) return false;

    // Logbook (completed) shows all completed tasks (including notes)
    if (perspective.filter.completed) {
      return task.completed;
    }
    // Completed filtering for custom perspectives (OmniFocus-style availability)
    if (wantsCompleted) {
      if (!task.completed) return false;
    } else if (task.completed) {
      return false;
    }

    // OmniFocus model for Today:
    // - Tasks flagged for today
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
      const isTodayTask = task.today || isDueToday || isOverdue || isScheduledForToday;

      // Include tasks tagged with "next" label
      const nextLabel = state.taskLabels.find(l => l.name.toLowerCase() === 'next');
      const isNextTask = nextLabel && (task.labels || []).includes(nextLabel.id);

      return isTodayTask || isNextTask;
    }

    // Upcoming: Tasks with future due dates (not today, not overdue)
    // Shows tasks from Anytime or Someday that have scheduled due dates
    if (perspectiveId === 'upcoming') {
      if (!task.dueDate) return false;
      return task.dueDate > today;
    }

    // Anytime: Tasks available to do anytime (no specific schedule)
    // Today flag does not exclude tasks from Anytime
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
      return task.status === 'inbox' && !task.areaId;
    }

    // Flagged: OmniFocus-style flagged items
    if (perspectiveId === 'flagged') {
      return !!task.flagged;
    }

    // Custom perspectives
    if (isCustom) {
      const filter = perspective.filter || {};
      const rules = [];

      if (filter.status) {
        if (filter.status === 'today') rules.push(!!task.today);
        else rules.push(task.status === filter.status);
      }
      if (filter.categoryId) rules.push(task.areaId === filter.categoryId);
      if (filter.personId) rules.push((task.people || []).includes(filter.personId));
      if (filter.inboxOnly) rules.push(task.status === 'inbox' && !task.areaId);
      if (filter.hasLabel) rules.push((task.labels || []).some(l => l === filter.hasLabel));

      if (filter.labelIds && filter.labelIds.length > 0) {
        const tagMatch = filter.tagMatch || 'any';
        const matches = tagMatch === 'all'
          ? filter.labelIds.every(l => (task.labels || []).includes(l))
          : (task.labels || []).some(l => filter.labelIds.includes(l));
        rules.push(matches);
      }

      if (filter.isUntagged) rules.push(!(task.labels || []).length);
      if (filter.hasDueDate) rules.push(!!task.dueDate);
      if (filter.hasDeferDate) rules.push(!!task.deferDate);
      if (filter.isRepeating) rules.push(!!(task.repeat && task.repeat.type !== 'none'));

      const dueSoonRule = filter.statusRule === 'dueSoon' || filter.dueSoon;
      if (dueSoonRule) {
        if (!task.dueDate) rules.push(false);
        else {
          const due = new Date(task.dueDate + 'T00:00:00');
          const now = new Date(today + 'T00:00:00');
          const diffDays = (due - now) / 86400000;
          rules.push(diffDays >= 0 && diffDays <= 7);
        }
      }

      const flaggedRule = filter.statusRule === 'flagged' || filter.flagged;
      if (flaggedRule) rules.push(!!task.flagged);

      if (filter.availability) {
        const available = !task.completed && (!task.deferDate || task.deferDate <= today);
        const remaining = !task.completed;
        const matches = filter.availability === 'available' || filter.availability === 'firstAvailable'
          ? available
          : filter.availability === 'remaining'
            ? remaining
            : filter.availability === 'completed'
              ? task.completed
              : true;
        rules.push(matches);
      }

      if (filter.dateRange && (filter.dateRange.start || filter.dateRange.end)) {
        const rangeStart = filter.dateRange.start || null;
        const rangeEnd = filter.dateRange.end || null;
        const rangeType = filter.dateRange.type || 'either';
        const dates = [];
        if (rangeType === 'due' || rangeType === 'either') dates.push(task.dueDate);
        if (rangeType === 'defer' || rangeType === 'either') dates.push(task.deferDate);
        const matchesRange = dates.some(date => {
          if (!date) return false;
          if (rangeStart && date < rangeStart) return false;
          if (rangeEnd && date > rangeEnd) return false;
          return true;
        });
        rules.push(matchesRange);
      }

      if (filter.searchTerms) {
        const term = filter.searchTerms.toLowerCase();
        const hay = `${task.title || ''} ${task.notes || ''}`.toLowerCase();
        rules.push(hay.includes(term));
      }

      if (rules.length === 0) return true;
      const logic = filter.logic || 'all';
      if (logic === 'any') return rules.some(Boolean);
      if (logic === 'none') return rules.every(r => !r);
      return rules.every(Boolean);
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

// Get tasks by area
export function getTasksByCategory(categoryId) {
  return state.tasksData.filter(task => {
    if (task.areaId !== categoryId) return false;
    if (task.completed) return false;
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
  return state.tasksData.filter(task => {
    if (!(task.labels || []).includes(labelId)) return false;
    if (task.completed) return false;
    return true;
  }).sort((a, b) => {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
}

// Get tasks by subcategory (category entity under an area)
export function getTasksBySubcategory(categoryId) {
  return state.tasksData.filter(task => {
    if (task.categoryId !== categoryId) return false;
    if (task.completed) return false;
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
  if (state.activeFilterType === 'area' && state.activeAreaFilter) {
    return getTasksByCategory(state.activeAreaFilter);
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    return getTasksByLabel(state.activeLabelFilter);
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    return getTasksByPerson(state.activePersonFilter);
  } else if (state.activeFilterType === 'subcategory' && state.activeCategoryFilter) {
    return getTasksBySubcategory(state.activeCategoryFilter);
  } else {
    return getFilteredTasks(state.activePerspective);
  }
}

// Get current view info
export function getCurrentViewInfo() {
  if (state.activeFilterType === 'area' && state.activeAreaFilter) {
    const cat = getAreaById(state.activeAreaFilter);
    return { icon: '\u{1F4C1}', name: cat?.name || 'Area', color: cat?.color };
  } else if (state.activeFilterType === 'label' && state.activeLabelFilter) {
    const label = getLabelById(state.activeLabelFilter);
    return { icon: '\u{1F3F7}\uFE0F', name: label?.name || 'Tag', color: label?.color };
  } else if (state.activeFilterType === 'person' && state.activePersonFilter) {
    const person = getPersonById(state.activePersonFilter);
    return { icon: '\u{1F464}', name: person?.name || 'Person', color: person?.color, email: person?.email || '', jobTitle: person?.jobTitle || '' };
  } else if (state.activeFilterType === 'subcategory' && state.activeCategoryFilter) {
    const cat = getCategoryById(state.activeCategoryFilter);
    const parentArea = cat ? getAreaById(cat.areaId) : null;
    return { icon: '\u{1F4C2}', name: cat?.name || 'Category', color: cat?.color, parentArea: parentArea?.name };
  } else {
    const allPerspectives = [...BUILTIN_PERSPECTIVES, ...state.customPerspectives];
    const p = allPerspectives.find(p => p.id === state.activePerspective) || BUILTIN_PERSPECTIVES[0];
    return { icon: p.icon, name: p.name };
  }
}
