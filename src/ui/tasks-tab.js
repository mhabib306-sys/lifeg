// ============================================================================
// TASKS TAB UI MODULE
// ============================================================================
// Renders the full Tasks workspace view: sidebar, task list, area view,
// notes outliner, and individual task items.

import { state } from '../state.js';
import { THINGS3_ICONS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE } from '../constants.js';
import { escapeHtml, formatSmartDate, getLocalDateString } from '../utils.js';
import { getAreaById, getLabelById, getPersonById, getTasksByPerson, getCategoriesByArea, getCategoryById } from '../features/areas.js';
import { saveViewState } from '../data/storage.js';

// ---------------------------------------------------------------------------
// These filter/grouping functions are NOT yet extracted to src modules, so we
// reference them on window.  They live in index.html and are attached globally.
// ---------------------------------------------------------------------------
function getFilteredTasks(perspectiveId) {
  return window.getFilteredTasks(perspectiveId);
}
function getCurrentFilteredTasks() {
  return window.getCurrentFilteredTasks();
}
function getCurrentViewInfo() {
  return window.getCurrentViewInfo();
}
function groupTasksByDate(tasks) {
  return window.groupTasksByDate(tasks);
}
function groupTasksByCompletionDate(tasks) {
  return window.groupTasksByCompletionDate(tasks);
}
function getTasksByCategory(categoryId) {
  return window.getTasksByCategory(categoryId);
}
function getTasksByLabel(labelId) {
  return window.getTasksByLabel(labelId);
}

function renderNotesOutliner(filter) {
  return window.renderNotesOutliner(filter);
}
function renderNotesBreadcrumb() {
  return window.renderNotesBreadcrumb();
}

// ============================================================================
// buildLabelPersonNotesSection — Notes outliner for label/person views
// ============================================================================
function buildLabelPersonNotesSection(filteredTasks, viewInfo) {
  const isLabelView = state.activeFilterType === 'label' && state.activeLabelFilter;
  const isPersonView = state.activeFilterType === 'person' && state.activePersonFilter;
  if (!isLabelView && !isPersonView) return '';

  const noteCount = filteredTasks.filter(t => t.isNote).length;
  const filterObj = isLabelView ? { labelId: state.activeLabelFilter } : { personId: state.activePersonFilter };
  const filterArg = isLabelView ? `{labelId:'${state.activeLabelFilter}'}` : `{personId:'${state.activePersonFilter}'}`;

  return `
    <!-- Notes Section -->
    <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden mt-4">
      <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/><rect x="10" y="5" width="11" height="2" rx="1"/><rect x="10" y="11" width="11" height="2" rx="1"/><rect x="10" y="17" width="11" height="2" rx="1"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Notes</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${noteCount}</span>
        </div>
        <button onclick="window.createRootNote(${filterArg})"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Add Note
        </button>
      </div>
      ${noteCount > 0 ? `
        ${renderNotesBreadcrumb()}
        <div class="py-2">${renderNotesOutliner(filterObj)}</div>
        <div class="px-4 py-2 border-t border-[var(--border-light)]">
          <button onclick="window.createRootNote(${filterArg})"
            class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Add another note...
          </button>
        </div>
      ` : `
        <div class="px-4 py-8 text-center">
          <p class="text-sm text-[var(--text-muted)] mb-3">No notes here yet</p>
          <button onclick="window.createRootNote(${filterArg})"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium rounded-lg hover:bg-[var(--accent-light)] transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create your first note
          </button>
        </div>
      `}
    </div>
  `;
}

// ============================================================================
// renderTaskItem — Renders a single task row (compact or full)
// ============================================================================
/**
 * Render a single task item as HTML
 * @param {Object} task - Task object
 * @param {boolean} showDueDate - Whether to display due date metadata
 * @param {boolean} compact - Compact mode (widget style, single line)
 * @returns {string} HTML string for the task item
 */
export function renderTaskItem(task, showDueDate = true, compact = false) {
  const isTouch = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const area = getAreaById(task.areaId);
  const subcategory = task.categoryId ? getCategoryById(task.categoryId) : null;
  const labels = (task.labels || []).map(lid => getLabelById(lid)).filter(Boolean);
  const people = (task.people || []).map(pid => getPersonById(pid)).filter(Boolean);
  const today = getLocalDateString();
  const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
  const isDueToday = task.dueDate === today;
  const isDueSoon = task.dueDate && !isDueToday && !isOverdue && (() => {
    const diff = (new Date(task.dueDate + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000;
    return diff > 0 && diff <= 2;
  })();
  const hasMetadata = !compact && (area || subcategory || labels.length > 0 || people.length > 0 || (showDueDate && task.dueDate) || task.deferDate || (task.repeat && task.repeat.type !== 'none') || task.notes);
  const isInlineEditing = state.inlineEditingTaskId === task.id;
  const indentLevel = task.indent || 0;
  const indentPx = indentLevel * 24;
  const metaParts = [];
  if (area && subcategory) {
    metaParts.push(`${escapeHtml(area.name)} › ${escapeHtml(subcategory.name)}`);
  } else if (area) {
    metaParts.push(escapeHtml(area.name));
  } else if (subcategory) {
    const parentArea = getAreaById(subcategory.areaId);
    metaParts.push(parentArea ? `${escapeHtml(parentArea.name)} › ${escapeHtml(subcategory.name)}` : escapeHtml(subcategory.name));
  }
  if (labels.length > 0) metaParts.push(labels.map(l => escapeHtml(l.name)).join(', '));
  if (people.length > 0) metaParts.push(people.map(p => escapeHtml(p.name.split(' ')[0])).join(', '));
  if (task.deferDate) metaParts.push(`Start ${formatSmartDate(task.deferDate)}`);
  if (showDueDate && task.dueDate) metaParts.push(`Due ${formatSmartDate(task.dueDate)}`);
  if (task.repeat && task.repeat.type !== 'none') metaParts.push('Repeats');
  if (task.notes) metaParts.push('Notes');

  // Compact mode for widgets - clean single line Things 3 style
  if (compact) {
    return `
      <div class="task-item compact-task group relative hover:bg-[var(--bg-secondary)]/50 rounded-lg transition cursor-pointer"
        onclick="window.inlineEditingTaskId=null; window.editingTaskId='${task.id}'; window.showTaskModal=true; window.render()">
        <div class="flex items-center min-h-[32px] px-2 py-0.5">
          ${task.isNote ? `
            <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-accent)]"></div>
            </div>
          ` : `
            <button onclick="event.stopPropagation(); window.toggleTaskComplete('${task.id}')"
              aria-label="${task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}: ${escapeHtml(task.title)}"
              class="task-checkbox w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'completed bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--text-muted)] hover:border-[var(--accent)]'}">
              ${task.completed ? '<svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' : ''}
            </button>
          `}
          <span class="flex-1 ml-2.5 text-[13px] leading-snug truncate ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}">
            ${task.flagged ? `<span class="inline-flex items-center text-amber-500 mr-1">${THINGS3_ICONS.flagged.replace('w-5 h-5', 'w-3 h-3')}</span>` : ''}
            ${escapeHtml(task.title)}
          </span>
          <div class="flex items-center gap-1.5 ml-2 flex-shrink-0 text-[10px]">
            ${area ? `<span class="text-[var(--text-muted)] truncate max-w-[70px]">${escapeHtml(area.name)}${subcategory ? ' › ' + escapeHtml(subcategory.name) : ''}</span>` : ''}
            ${task.dueDate ? `<span class="${isOverdue ? 'text-red-500 font-medium' : isDueToday ? 'text-[var(--accent)] font-medium' : isDueSoon ? 'text-amber-500 font-medium' : 'text-[var(--text-muted)]'}">${formatSmartDate(task.dueDate)}</span>` : ''}
            ${task.repeat && task.repeat.type !== 'none' ? `<span class="text-[var(--text-muted)]" title="Repeats ${task.repeat.interval > 1 ? 'every ' + task.repeat.interval + ' ' : ''}${task.repeat.type}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg></span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="task-item group relative ${hasMetadata && metaParts.length ? 'has-meta' : 'no-meta'}"
      draggable="${isInlineEditing || isTouch ? 'false' : 'true'}"
      ${isInlineEditing || isTouch ? '' : `ondragstart="window.handleDragStart(event, '${task.id}')"
      ondragend="window.handleDragEnd(event)"
      ondragover="window.handleDragOver(event, '${task.id}')"
      ondragleave="window.handleDragLeave(event)"
      ondrop="window.handleDrop(event, '${task.id}')"`}
      onclick="if(window.matchMedia('(hover: none) and (pointer: coarse)').matches && !event.target.closest('.task-checkbox') && !event.target.closest('button')) { window.editingTaskId='${task.id}'; window.showTaskModal=true; window.render(); }">
      <div class="task-row flex items-start gap-3 px-4 py-2.5" style="${indentLevel > 0 ? `padding-left: ${16 + indentPx}px` : ''}">
        ${task.isNote ? `
          <div class="mt-2 w-1.5 h-1.5 rounded-full ${indentLevel > 0 ? 'bg-[var(--notes-accent)]/50' : 'bg-[var(--notes-accent)]'} flex-shrink-0"></div>
        ` : `
          <button onclick="event.stopPropagation(); window.toggleTaskComplete('${task.id}')"
            aria-label="${task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}: ${escapeHtml(task.title)}"
            class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'completed bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--text-muted)] hover:border-[var(--accent)]'}">
            ${task.completed ? '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' : ''}
          </button>
        `}
        <div class="flex-1 min-w-0">
          ${isInlineEditing ? `
            <input type="text" id="inline-edit-input" value="${task.title.replace(/"/g, '&quot;')}"
              onkeydown="window.handleInlineEditKeydown(event, '${task.id}')"
              onblur="setTimeout(() => { if(window.inlineEditingTaskId) window.saveInlineEdit('${task.id}'); }, 180)"
              class="w-full text-[16px] text-[var(--text-primary)] bg-[var(--bg-input)] border border-[var(--accent)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent-light)]">
          ` : `
            <span ondblclick="event.stopPropagation(); window.startInlineEdit('${task.id}')"
              class="task-title text-[15px] ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'} leading-snug transition cursor-text">
              ${task.flagged ? `<span class="inline-flex items-center text-amber-500 mr-1.5">${THINGS3_ICONS.flagged.replace('w-5 h-5', 'w-3 h-3')}</span>` : ''}
              ${escapeHtml(task.title)}
            </span>
          `}
          ${hasMetadata && metaParts.length ? `
            <div class="task-meta-inline">${metaParts.join(' • ')}</div>
          ` : ''}
        </div>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--modal-bg)]/95 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm" onclick="event.stopPropagation()">
          ${task.isNote && !task.completed ? `
            <button onclick="event.stopPropagation(); window.createChildNote('${task.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-md transition" title="Add child note">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <button onclick="event.stopPropagation(); window.outdentNote('${task.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition ${indentLevel === 0 ? 'opacity-30 cursor-not-allowed' : ''}" title="Outdent (Shift+Tab)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
            </button>
            <button onclick="event.stopPropagation(); window.indentNote('${task.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Indent (Tab)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>
            </button>
          ` : ''}
          <button onclick="event.stopPropagation(); window.inlineEditingTaskId=null; window.editingTaskId='${task.id}'; window.showTaskModal=true; window.render()"
            aria-label="Edit task: ${escapeHtml(task.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Edit">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); window.confirmDeleteTask('${task.id}')"
            aria-label="Delete task: ${escapeHtml(task.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-md transition" title="Delete">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// buildAreaTaskListHtml — Area (category) detail view
// ============================================================================
/**
 * Build the area-specific task list HTML with hero header, stats, and
 * sections (Overdue, Today, Upcoming, Deferred, Inbox, Anytime, Someday, Notes).
 *
 * @param {Object} currentCategory - The category object being viewed
 * @param {Array} filteredTasks - Pre-filtered tasks for this area
 * @param {string} todayDate - Today's date string (YYYY-MM-DD)
 * @returns {string} HTML string
 */
export function buildAreaTaskListHtml(currentCategory, filteredTasks, todayDate) {
  if (!currentCategory) return '';

  const areaTasks = filteredTasks;
  const totalTasks = areaTasks.length;
  const completedTasks = state.tasksData.filter(t => t.areaId === state.activeAreaFilter && t.completed && !t.isNote).length;
  const activeTasks = areaTasks.filter(t => !t.isNote).length;
  const noteItems = areaTasks.filter(t => t.isNote);
  const taskItems = areaTasks.filter(t => !t.isNote);
  const overdueTasks = taskItems.filter(t => t.dueDate && t.dueDate < todayDate);
  const todayTasks = taskItems.filter(t =>
    !overdueTasks.includes(t) && (t.today || t.dueDate === todayDate));
  const upcomingTasks = taskItems.filter(t =>
    t.dueDate && t.dueDate > todayDate && !todayTasks.includes(t));
  const deferredTasks = taskItems.filter(t =>
    t.deferDate && t.deferDate > todayDate &&
    !overdueTasks.includes(t) && !upcomingTasks.includes(t));
  const anytimeTasks = taskItems.filter(t =>
    t.status === 'anytime' && !overdueTasks.includes(t) &&
    !todayTasks.includes(t) && !upcomingTasks.includes(t) &&
    !deferredTasks.includes(t));
  const somedayTasks = taskItems.filter(t => t.status === 'someday');
  const inboxTasks = taskItems.filter(t => t.status === 'inbox');
  const dueSoonCount = taskItems.filter(t => {
    if (!t.dueDate || t.dueDate <= todayDate) return false;
    const diff = (new Date(t.dueDate + 'T00:00:00') - new Date(todayDate + 'T00:00:00')) / 86400000;
    return diff <= 3;
  }).length;

  const completionRate = activeTasks + completedTasks > 0 ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) : 0;
  const categoryColor = currentCategory.color || '#6366F1';

  return `
    <div class="flex-1 space-y-4">
      <!-- Area Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 text-2xl" style="background: ${categoryColor}20; color: ${categoryColor}">
              ${currentCategory.emoji || '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2H4z"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${escapeHtml(currentCategory.name)}</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${activeTasks} active · ${completedTasks} completed${noteItems.length > 0 ? ` · ${noteItems.length} note${noteItems.length !== 1 ? 's' : ''}` : ''}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${categoryColor}" stroke-width="2.5"
                  stroke-dasharray="${completionRate} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${completionRate}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${completedTasks} of ${activeTasks + completedTasks}</div>
            </div>
          </div>
          ${overdueTasks.length > 0 ? `
            <div class="flex items-center gap-1.5 text-[12px] font-medium text-red-500">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              ${overdueTasks.length} overdue
            </div>
          ` : ''}
          ${todayTasks.length > 0 ? `
            <div class="flex items-center gap-1.5 text-[12px] font-medium text-amber-500">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              ${todayTasks.length} today
            </div>
          ` : ''}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote('${currentCategory.id}')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${categoryColor}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? `<div class="w-[7px] h-[7px] rounded-full bg-[#8B5CF6]"></div>`
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: ${categoryColor}40"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${categoryColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'inbox', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'inbox' && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-inbox">+ Inbox</button>
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'anytime' && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'someday' && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.today && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote('${currentCategory.id}')"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${overdueTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-red-100 overflow-hidden">
            <div class="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <span class="text-sm font-semibold text-red-700">Overdue</span>
              <span class="text-xs text-red-400 ml-1">${overdueTasks.length}</span>
            </div>
            <div class="task-list">${overdueTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${todayTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 bg-amber-50/50 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Today</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${todayTasks.length}</span>
            </div>
            <div class="task-list">${todayTasks.map(task => renderTaskItem(task, false)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.today && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-amber-500 hover:text-amber-600 hover:bg-amber-50/50 rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add to Today...
              </button>
            </div>
          </div>
        ` : ''}

        ${upcomingTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Upcoming</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${upcomingTasks.length}</span>
            </div>
            <div class="task-list">${upcomingTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${deferredTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-muted)]">Deferred</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${deferredTasks.length}</span>
            </div>
            <div class="task-list">${deferredTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${inboxTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h4.18c.26 1.7 1.74 3 3.57 3h2.5c1.83 0 3.31-1.3 3.57-3H21v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6zm0-2l3-7h12l3 7h-4.18c-.26-1.7-1.74-3-3.57-3h-2.5c-1.83 0-3.31 1.3-3.57 3H3z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Inbox</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${inboxTasks.length}</span>
            </div>
            <div class="task-list">${inboxTasks.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'inbox', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'inbox' && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add to Inbox...
              </button>
            </div>
          </div>
        ` : ''}

        ${anytimeTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Anytime</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${anytimeTasks.length}</span>
            </div>
            <div class="task-list">${anytimeTasks.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'anytime', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'anytime' && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-teal-500 hover:text-teal-600 hover:bg-teal-50/50 rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add to Anytime...
              </button>
            </div>
          </div>
        ` : ''}

        ${somedayTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v4H3V3zm1 5h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm5 3v2h6v-2H9z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Someday</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${somedayTasks.length}</span>
            </div>
            <div class="task-list">${somedayTasks.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'someday', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'someday' && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50/50 rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add to Someday...
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Notes Section (always show) -->
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/><rect x="10" y="5" width="11" height="2" rx="1"/><rect x="10" y="11" width="11" height="2" rx="1"/><rect x="10" y="17" width="11" height="2" rx="1"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Notes</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${noteItems.length}</span>
            </div>
            <button onclick="window.createRootNote('${currentCategory.id}')"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Note
            </button>
          </div>
          ${noteItems.length > 0 ? `
            ${renderNotesBreadcrumb()}
            <div class="py-2">${renderNotesOutliner(currentCategory.id)}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createRootNote('${currentCategory.id}')"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add another note...
              </button>
            </div>
          ` : `
            <div class="px-4 py-8 text-center">
              <p class="text-sm text-[var(--text-muted)] mb-3">No notes in this area yet</p>
              <button onclick="window.createRootNote('${currentCategory.id}')"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium rounded-lg hover:bg-[var(--accent-light)] transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Create your first note
              </button>
            </div>
          `}
        </div>

        ${totalTasks === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style="background: ${categoryColor}10">
                <svg class="w-10 h-10" style="color: ${categoryColor}" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2H4z"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${currentCategory.name}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${categoryColor}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add First Item
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ============================================================================
// buildCategoryTaskListHtml — Category (sub-area) detail view
// ============================================================================
/**
 * Build a landing page for a category (subcategory under an area).
 * @param {Object} category - Category object
 * @param {Array} filteredTasks - Pre-filtered tasks for this category
 * @param {string} todayDate - Today's date string (YYYY-MM-DD)
 * @returns {string} HTML string
 */
export function buildCategoryTaskListHtml(category, filteredTasks, todayDate) {
  if (!category) return '';
  const parentArea = getAreaById(category.areaId);

  const catTasks = filteredTasks;
  const completedTasks = state.tasksData.filter(t => t.categoryId === category.id && t.completed && !t.isNote).length;
  const activeTasks = catTasks.filter(t => !t.isNote).length;
  const noteItems = catTasks.filter(t => t.isNote);
  const taskItems = catTasks.filter(t => !t.isNote);
  const overdueTasks = taskItems.filter(t => t.dueDate && t.dueDate < todayDate);
  const todayTasks = taskItems.filter(t =>
    !overdueTasks.includes(t) && (t.today || t.dueDate === todayDate));
  const upcomingTasks = taskItems.filter(t =>
    t.dueDate && t.dueDate > todayDate && !todayTasks.includes(t));
  const deferredTasks = taskItems.filter(t =>
    t.deferDate && t.deferDate > todayDate &&
    !overdueTasks.includes(t) && !upcomingTasks.includes(t));
  const anytimeTasks = taskItems.filter(t =>
    t.status === 'anytime' && !overdueTasks.includes(t) &&
    !todayTasks.includes(t) && !upcomingTasks.includes(t) &&
    !deferredTasks.includes(t));
  const somedayTasks = taskItems.filter(t => t.status === 'someday');
  const inboxTasks = taskItems.filter(t => t.status === 'inbox');

  const completionRate = activeTasks + completedTasks > 0 ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) : 0;
  const categoryColor = category.color || '#6366F1';

  return `
    <div class="flex-1 space-y-4">
      <!-- Category Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 text-2xl" style="background: ${categoryColor}20; color: ${categoryColor}">
              ${category.emoji || '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${escapeHtml(category.name)}</h1>
              <div class="flex items-center gap-2 mt-1">
                ${parentArea ? `
                  <button onclick="window.showAreaTasks('${parentArea.id}')" class="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                    <span class="w-2 h-2 rounded-full" style="background:${parentArea.color || '#6366F1'}"></span>
                    ${escapeHtml(parentArea.name)}
                  </button>
                  <span class="text-[var(--text-muted)]">&middot;</span>
                ` : ''}
                <p class="text-[var(--text-muted)] text-[13px]">${activeTasks} active &middot; ${completedTasks} completed${noteItems.length > 0 ? ` &middot; ${noteItems.length} note${noteItems.length !== 1 ? 's' : ''}` : ''}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${categoryColor}" stroke-width="2.5"
                  stroke-dasharray="${completionRate} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${completionRate}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${completedTasks} of ${activeTasks + completedTasks}</div>
            </div>
          </div>
          ${overdueTasks.length > 0 ? `
            <div class="flex items-center gap-1.5 text-[12px] font-medium text-red-500">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              ${overdueTasks.length} overdue
            </div>
          ` : ''}
          ${todayTasks.length > 0 ? `
            <div class="flex items-center gap-1.5 text-[12px] font-medium text-amber-500">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              ${todayTasks.length} today
            </div>
          ` : ''}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${categoryColor}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? '<div class="w-[7px] h-[7px] rounded-full bg-[#8B5CF6]"></div>'
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: ${categoryColor}40"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${categoryColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'inbox', areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'inbox' && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-inbox">+ Inbox</button>
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'anytime' && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'someday' && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.today && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${overdueTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-red-100 overflow-hidden">
            <div class="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <span class="text-sm font-semibold text-red-700">Overdue</span>
              <span class="text-xs text-red-400 ml-1">${overdueTasks.length}</span>
            </div>
            <div class="task-list">${overdueTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${todayTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 bg-amber-50/50 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Today</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${todayTasks.length}</span>
            </div>
            <div class="task-list">${todayTasks.map(task => renderTaskItem(task, false)).join('')}</div>
          </div>
        ` : ''}

        ${upcomingTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Upcoming</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${upcomingTasks.length}</span>
            </div>
            <div class="task-list">${upcomingTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${deferredTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-muted)]">Deferred</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${deferredTasks.length}</span>
            </div>
            <div class="task-list">${deferredTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${inboxTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h4.18c.26 1.7 1.74 3 3.57 3h2.5c1.83 0 3.31-1.3 3.57-3H21v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6zm0-2l3-7h12l3 7h-4.18c-.26-1.7-1.74-3-3.57-3h-2.5c-1.83 0-3.31 1.3-3.57 3H3z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Inbox</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${inboxTasks.length}</span>
            </div>
            <div class="task-list">${inboxTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${anytimeTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Anytime</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${anytimeTasks.length}</span>
            </div>
            <div class="task-list">${anytimeTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${somedayTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-muted)]">Someday</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${somedayTasks.length}</span>
            </div>
            <div class="task-list">${somedayTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        <!-- Notes Section (always show) -->
        <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
          <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/><rect x="10" y="5" width="11" height="2" rx="1"/><rect x="10" y="11" width="11" height="2" rx="1"/><rect x="10" y="17" width="11" height="2" rx="1"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Notes</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${noteItems.length}</span>
            </div>
            <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Note
            </button>
          </div>
          ${noteItems.length > 0 ? `
            ${renderNotesBreadcrumb()}
            <div class="py-2">${renderNotesOutliner({categoryId: category.id})}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add another note...
              </button>
            </div>
          ` : `
            <div class="px-4 py-8 text-center">
              <p class="text-sm text-[var(--text-muted)] mb-3">No notes in this category yet</p>
              <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium rounded-lg hover:bg-[var(--accent-light)] transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Create your first note
              </button>
            </div>
          `}
        </div>

        ${filteredTasks.length === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <svg class="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2z"/></svg>
              <p class="text-[15px] font-medium">No tasks in ${escapeHtml(category.name)}</p>
              <p class="text-[13px] mt-1">Add a task to get started</p>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ============================================================================
// renderTasksTab — Full tasks workspace view
// ============================================================================
/**
 * Render the entire Tasks tab including sidebar and main content area.
 * Handles all perspective views, area views, and notes outliner.
 * @returns {string} HTML string for the complete tasks tab
 */
export function renderTasksTab() {
  // Legacy fallback: calendar perspective now belongs to Calendar tab only.
  if (state.activePerspective === 'calendar') {
    state.activePerspective = 'inbox';
    saveViewState();
  }

  const allPerspectives = [...BUILTIN_PERSPECTIVES, ...state.customPerspectives];
  const filteredTasks = getCurrentFilteredTasks();
  const viewInfo = getCurrentViewInfo();
  const activeNotesCategory = state.activeAreaFilter ? getAreaById(state.activeAreaFilter) : null;

  // Count tasks per perspective
  const taskCounts = {};
  const todayDate = getLocalDateString();
  BUILTIN_PERSPECTIVES.forEach(p => {
    if (p.id === 'today') {
      // Keep sidebar count aligned with Today sections visible in the list.
      taskCounts[p.id] = getFilteredTasks('today').length;
    } else {
      taskCounts[p.id] = getFilteredTasks(p.id).length;
    }
  });
  // Notes count (separate from task perspectives)
  taskCounts['notes'] = state.tasksData.filter(t => t.isNote && !t.completed).length;

  state.customPerspectives.forEach(p => {
    taskCounts[p.id] = getFilteredTasks(p.id).length;
  });

  // Count tasks per category
  const categoryCounts = {};
  state.taskAreas.forEach(cat => {
    categoryCounts[cat.id] = getTasksByCategory(cat.id).length;
  });

  // Count tasks per label
  const labelCounts = {};
  state.taskLabels.forEach(label => {
    labelCounts[label.id] = getTasksByLabel(label.id).length;
  });

  // Count tasks per person
  const peopleCounts = {};
  state.taskPeople.forEach(person => {
    peopleCounts[person.id] = getTasksByPerson(person.id).length;
  });

  // Check if perspective is active
  const isPerspectiveActive = (pId) => state.activeFilterType === 'perspective' && state.activePerspective === pId;
  const isAreaActive = (cId) => state.activeFilterType === 'area' && state.activeAreaFilter === cId;
  const isSubcatActive = (scId) => state.activeFilterType === 'subcategory' && state.activeCategoryFilter === scId;
  const isLabelActive = (lId) => state.activeFilterType === 'label' && state.activeLabelFilter === lId;
  const isPersonActive = (pId) => state.activeFilterType === 'person' && state.activePersonFilter === pId;

  // Build sidebar
  const sidebarHtml = `
    <div class="w-full md:w-64 flex-shrink-0 space-y-3">
      <!-- Tasks Section -->
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tasks</h3>
        </div>
        <div class="py-2 px-2">
          ${BUILTIN_PERSPECTIVES.map(p => `
            <button onclick="window.showPerspectiveTasks('${p.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${isPerspectiveActive(p.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${p.color}">${p.icon}</span>
              <span class="flex-1 text-[14px] ${isPerspectiveActive(p.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${p.name}</span>
              <span class="count-badge min-w-[20px] text-right text-[12px] ${isPerspectiveActive(p.id) ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}">${taskCounts[p.id] || ''}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Notes Section -->
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Notes</h3>
        </div>
        <div class="py-2 px-2">
          <button onclick="window.showPerspectiveTasks('notes')"
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${isPerspectiveActive('notes') ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${NOTES_PERSPECTIVE.color}">${NOTES_PERSPECTIVE.icon}</span>
            <span class="flex-1 text-[14px] ${isPerspectiveActive('notes') ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">All Notes</span>
            <span class="count-badge min-w-[20px] text-right text-[12px] ${isPerspectiveActive('notes') ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}">${taskCounts['notes'] || ''}</span>
          </button>
        </div>
      </div>

      <!-- Custom Perspectives -->
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Custom Views</h3>
          <button onclick="window.showPerspectiveModal=true; window.render()" aria-label="Add new custom view" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.customPerspectives.length > 0 ? state.customPerspectives.map(p => `
            <button onclick="window.showPerspectiveTasks('${p.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative transition-all ${isPerspectiveActive(p.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-lg text-[var(--text-muted)]">${p.icon}</span>
              <span class="flex-1 text-[14px] ${isPerspectiveActive(p.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(p.name)}</span>
              <span class="min-w-[20px] text-right text-[12px] group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${taskCounts[p.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editCustomPerspective('${p.id}')"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </button>
          `).join('') : `
            <div class="px-3 py-6 text-center text-[var(--text-muted)] text-[13px]">
              No custom views yet
            </div>
          `}
        </div>
      </div>

      <!-- Areas -->
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Areas</h3>
          <button onclick="window.editingAreaId=null; window.showAreaModal=true; window.render()" aria-label="Add new area" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.taskAreas.map(cat => {
            const subcats = getCategoriesByArea(cat.id);
            const isCollapsed = state.collapsedSidebarAreas.has(cat.id);
            const hasSubcats = subcats.length > 0;
            const areaEmoji = cat.emoji || '';
            return `
            <div class="flex items-center gap-0">
              ${hasSubcats ? `
                <button onclick="event.stopPropagation(); window.toggleSidebarAreaCollapse('${cat.id}')"
                  class="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition ml-1">
                  <svg class="w-3 h-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
              ` : '<div class="w-5 ml-1"></div>'}
              <div onclick="window.showAreaTasks('${cat.id}')"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showAreaTasks('${cat.id}');}"
                tabindex="0"
                role="button"
                aria-label="View ${escapeHtml(cat.name)} area"
                class="sidebar-item draggable-item flex-1 px-2 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isAreaActive(cat.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}"
                draggable="true"
                data-id="${cat.id}"
                data-type="area">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style="background: ${cat.color}20; color: ${cat.color}">
                  ${areaEmoji || '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2H4z"/></svg>'}
                </span>
                <span class="flex-1 text-[14px] ${isAreaActive(cat.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(cat.name)}</span>
                <span class="min-w-[20px] text-right text-[12px] group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${categoryCounts[cat.id] || ''}</span>
                <span onclick="event.stopPropagation(); window.editingAreaId='${cat.id}'; window.showAreaModal=true; window.render()"
                  class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
              </div>
            </div>
            ${!isCollapsed ? `
              ${subcats.map(subcat => {
                const subcatEmoji = subcat.emoji || '';
                return `
                <div onclick="window.showCategoryTasks('${subcat.id}')"
                  class="sidebar-item w-full pl-12 pr-3 py-1.5 flex items-center gap-2.5 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isSubcatActive(subcat.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
                  <span class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs" style="background: ${subcat.color}20; color: ${subcat.color}">
                    ${subcatEmoji || '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>'}
                  </span>
                  <span class="flex-1 text-[13px] ${isSubcatActive(subcat.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(subcat.name)}</span>
                  <span onclick="event.stopPropagation(); window.editingCategoryId='${subcat.id}'; window.showCategoryModal=true; window.render()"
                    class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
                </div>
              `}).join('')}
              <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${cat.id}'; window.render()"
                class="w-full pl-12 pr-3 py-1 flex items-center gap-2 text-[12px] text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add Category
              </button>
            ` : ''}
          `;
          }).join('')}
        </div>
      </div>

      <!-- Tags -->
      ${(() => {
        const labelsWithTasks = state.taskLabels
          .filter(l => (labelCounts[l.id] || 0) > 0)
          .sort((a, b) => (labelCounts[b.id] || 0) - (labelCounts[a.id] || 0));
        const labelsWithoutTasks = state.taskLabels
          .filter(l => !(labelCounts[l.id] || 0))
          .sort((a, b) => a.name.localeCompare(b.name));
        const MAX_SIDEBAR_LABELS = 10;
        const showAllLabels = state.showAllSidebarLabels;
        const topLabels = labelsWithTasks.slice(0, MAX_SIDEBAR_LABELS);
        const overflowLabels = labelsWithTasks.slice(MAX_SIDEBAR_LABELS);
        const displayLabels = showAllLabels ? [...labelsWithTasks, ...labelsWithoutTasks] : topLabels;
        const hiddenCount = labelsWithTasks.length + labelsWithoutTasks.length - topLabels.length;
        return `
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tags${labelsWithTasks.length > 0 ? ` (${labelsWithTasks.length})` : ''}</h3>
          <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()" aria-label="Add new tag" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${displayLabels.length === 0 ? `<div class="px-3 py-2 text-[12px] text-[var(--text-muted)]">No tags yet</div>` : displayLabels.map(label => `
            <div onclick="window.showLabelTasks('${label.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showLabelTasks('${label.id}');}"
              tabindex="0"
              role="button"
              aria-label="View ${escapeHtml(label.name)} tag"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isLabelActive(label.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}"
              draggable="true"
              data-id="${label.id}"
              data-type="label">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <span class="w-3 h-3 rounded-full" style="background-color: ${label.color}"></span>
              </span>
              <span class="flex-1 text-[14px] ${isLabelActive(label.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(label.name)}</span>
              <span class="min-w-[20px] text-right text-[12px] group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${labelCounts[label.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editingLabelId='${label.id}'; window.showLabelModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join('')}
          ${!showAllLabels && hiddenCount > 0 ? `
          <button onclick="window.showAllSidebarLabels=true; window.render()"
            class="w-full px-3 py-2 text-[12px] text-[var(--accent)] hover:text-[var(--accent-hover)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${state.taskLabels.length} tags
          </button>` : ''}
          ${showAllLabels && hiddenCount > 0 ? `
          <button onclick="window.showAllSidebarLabels=false; window.render()"
            class="w-full px-3 py-2 text-[12px] text-[var(--accent)] hover:text-[var(--accent-hover)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            Show less
          </button>` : ''}
        </div>
      </div>`;
      })()}

      <!-- People -->
      ${(() => {
        const peopleWithTasks = state.taskPeople
          .filter(p => (peopleCounts[p.id] || 0) > 0)
          .sort((a, b) => (peopleCounts[b.id] || 0) - (peopleCounts[a.id] || 0));
        const peopleWithoutTasks = state.taskPeople
          .filter(p => !(peopleCounts[p.id] || 0))
          .sort((a, b) => a.name.localeCompare(b.name));
        const MAX_SIDEBAR_PEOPLE = 10;
        const showAll = state.showAllSidebarPeople;
        const topPeople = peopleWithTasks.slice(0, MAX_SIDEBAR_PEOPLE);
        const displayPeople = showAll ? [...peopleWithTasks, ...peopleWithoutTasks] : topPeople;
        const hiddenCount = peopleWithTasks.length + peopleWithoutTasks.length - topPeople.length;
        return `
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">People${peopleWithTasks.length > 0 ? ` (${peopleWithTasks.length})` : ''}</h3>
          <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()" aria-label="Add new person" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${displayPeople.length === 0 ? `<div class="px-3 py-2 text-[12px] text-[var(--text-muted)]">No people yet</div>` : displayPeople.map(person => `
            <div onclick="window.showPersonTasks('${person.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showPersonTasks('${person.id}');}"
              tabindex="0"
              role="button"
              aria-label="View tasks for ${escapeHtml(person.name)}"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isPersonActive(person.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}"
              draggable="true"
              data-id="${person.id}"
              data-type="person">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[var(--text-muted)]">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </span>
              <span class="flex-1 min-w-0">
                <span class="block text-[14px] truncate ${isPersonActive(person.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(person.name)}</span>
                ${person.jobTitle ? `<span class="block text-[11px] truncate text-[var(--text-muted)]">${escapeHtml(person.jobTitle)}</span>` : ''}
              </span>
              <span class="min-w-[20px] text-right text-[12px] group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${peopleCounts[person.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editingPersonId='${person.id}'; window.showPersonModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join('')}
          ${!showAll && hiddenCount > 0 ? `
          <button onclick="window.showAllSidebarPeople=true; window.render()"
            class="w-full px-3 py-2 text-[12px] text-[var(--accent)] hover:text-[var(--accent-hover)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${state.taskPeople.length} people
          </button>` : ''}
          ${showAll && hiddenCount > 0 ? `
          <button onclick="window.showAllSidebarPeople=false; window.render()"
            class="w-full px-3 py-2 text-[12px] text-[var(--accent)] hover:text-[var(--accent-hover)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            Show less
          </button>` : ''}
        </div>
      </div>`;
      })()}
    </div>
  `;

  // Check if viewing an area or category - render special views
  const isAreaView = state.activeFilterType === 'area' && state.activeAreaFilter;
  const isCategoryView = state.activeFilterType === 'subcategory' && state.activeCategoryFilter;
  const currentArea = isAreaView ? getAreaById(state.activeAreaFilter) : null;
  const currentSubcategory = isCategoryView ? getCategoryById(state.activeCategoryFilter) : null;

  // Build task list (area view, category view, or default perspective view)
  const taskListHtml = isAreaView ? buildAreaTaskListHtml(currentArea, filteredTasks, todayDate) : (isCategoryView ? buildCategoryTaskListHtml(currentSubcategory, filteredTasks, todayDate) : `
    <div class="flex-1">
      <div class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)]">
        <div class="task-list-header-desktop px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl" ${viewInfo.color ? `style="color: ${viewInfo.color}"` : ''}>${viewInfo.icon}</span>
            <div>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">${viewInfo.name}</h2>
              ${viewInfo.jobTitle || viewInfo.email ? `<p class="text-sm text-[var(--text-muted)]">${[viewInfo.jobTitle, viewInfo.email].filter(Boolean).join(' \u00B7 ')}</p>` : ''}
            </div>
          </div>
          <button onclick="window.openNewTaskModal()"
            class="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center hover:bg-coralDark transition shadow-sm" title="${state.activePerspective === 'notes' ? 'Add Note' : 'Add Task'}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>

        ${state.activePerspective !== 'upcoming' ? `
        <!-- Quick Add Input -->
        <div class="quick-add-section px-4 py-3 border-b border-[var(--border-light)]">
          <div class="flex items-center gap-3">
            ${state.activePerspective === 'notes' ? `
              <div class="w-2 h-2 rounded-full border-2 border-dashed border-[#8B5CF6]/40 flex-shrink-0 ml-1.5"></div>
            ` : `
              <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
                class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
                ${state.quickAddIsNote
                  ? `<div class="w-[7px] h-[7px] rounded-full bg-[#8B5CF6]"></div>`
                  : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>`
                }
              </div>
            `}
            <input type="text" id="quick-add-input"
              placeholder="${state.activePerspective === 'notes' || state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
              onkeydown="window.handleQuickAddKeydown(event, this)"
              class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition p-1" title="${state.activePerspective === 'notes' || state.quickAddIsNote ? 'Add Note' : 'Add to ' + viewInfo.name}">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </button>
          </div>
        </div>
        ` : ''}

        <div class="min-h-[400px] task-list">
          ${filteredTasks.length === 0 ? `
            <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <div class="w-16 h-16 mb-4 flex items-center justify-center opacity-40">${viewInfo.icon}</div>
              <p class="text-[15px] font-medium">No tasks in ${viewInfo.name}</p>
              ${state.activePerspective === 'inbox' ? '<p class="text-[13px] mt-1 text-[var(--text-muted)]">Add a task to get started</p>' : ''}
            </div>
          ` : (state.activePerspective === 'upcoming' ? `
            <!-- Upcoming view grouped by date -->
            <div class="task-list">
              ${groupTasksByDate(filteredTasks).map(group => `
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)]">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${group.label}</span>
                  </div>
                  <div>
                    ${group.tasks.map(task => renderTaskItem(task, false)).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : (state.activePerspective === 'logbook' ? `
            <!-- Logbook view grouped by completion date -->
            <div class="task-list">
              ${groupTasksByCompletionDate(filteredTasks).map(group => `
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)]">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${group.label}</span>
                  </div>
                  <div>
                    ${group.tasks.map(task => renderTaskItem(task, false)).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : (state.activePerspective === 'today' ? (() => {
            // Today view: Split into Due, Today, Starting, and Next sections
            const today = getLocalDateString();
            const nextLabel = state.taskLabels.find(l => l.name.toLowerCase() === 'next');

            // All dated tasks (not Next-only)
            const allDated = filteredTasks.filter(t => {
              const isDueToday = t.dueDate === today;
              const isOverdue = t.dueDate && t.dueDate < today;
            const isScheduledForToday = t.deferDate && t.deferDate <= today;
            return t.today || isDueToday || isOverdue || isScheduledForToday;
            });

            // Split into sections: Due (overdue + due today), Starting (deferred today), Other (status=today)
            const dueTasks = allDated.filter(t => t.dueDate && t.dueDate <= today)
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
            const startingTasks = allDated.filter(t => {
              const isDueOrOverdue = t.dueDate && t.dueDate <= today;
              const isScheduled = t.deferDate && t.deferDate <= today;
              return isScheduled && !isDueOrOverdue;
            });
            const todayStatusTasks = allDated.filter(t => !dueTasks.includes(t) && !startingTasks.includes(t));

            // Next tasks: tasks tagged with "next" label (not already in dated)
            const nextTasks = nextLabel ? filteredTasks.filter(t => {
              const isNextTagged = (t.labels || []).includes(nextLabel.id);
            const isScheduledForToday = t.deferDate && t.deferDate <= today;
            const isDatedTask = t.today || t.dueDate === today || (t.dueDate && t.dueDate < today) || isScheduledForToday;
              return isNextTagged && !isDatedTask;
            }) : [];

            const totalTasks = allDated.length + nextTasks.length;

            // Helper to render a section with header
            const renderSection = (tasks, icon, label, color, extraClass = '') => tasks.length > 0 ? `
              <div class="${extraClass}">
                <div class="px-5 py-2 bg-[var(--bg-card)]">
                  <div class="flex items-center gap-2">
                    <span style="color: ${color}">${icon}</span>
                    <span class="text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">${label}</span>
                    <span class="text-xs text-[var(--text-muted)]">${tasks.length}</span>
                  </div>
                </div>
                ${tasks.map(task => renderTaskItem(task)).join('')}
              </div>
            ` : '';

            return `
            <div class="task-list">
              ${renderSection(dueTasks,
                '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>',
                'Due', '#EF4444')}
              ${todayStatusTasks.length > 0 ? `
                <div class="${dueTasks.length > 0 ? 'mt-2' : ''}">
                  ${todayStatusTasks.map(task => renderTaskItem(task)).join('')}
                </div>
              ` : ''}
              ${renderSection(startingTasks,
                '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
                'Starting', '#3B82F6', dueTasks.length > 0 || todayStatusTasks.length > 0 ? 'mt-2' : '')}
              ${renderSection(nextTasks, THINGS3_ICONS.next, 'Next', '#8B5CF6',
                allDated.length > 0 ? 'mt-4' : '')}
              ${totalTasks === 0 ? `
                <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
                  <div class="w-16 h-16 mb-4 flex items-center justify-center opacity-50">${viewInfo.icon}</div>
                  <p class="text-[15px] font-medium">No tasks in ${viewInfo.name}</p>
                </div>
              ` : ''}
            </div>
          `;
          })() : (state.activePerspective === 'notes' ? `
            <!-- Notes Outliner View -->
            <div class="notes-outliner bg-[var(--bg-card)]">
              <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${activeNotesCategory ? `
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-light)] text-[var(--accent)]">
                      <span class="w-2 h-2 rounded-full" style="background:${activeNotesCategory.color || '#8B5CF6'}"></span>
                      ${escapeHtml(activeNotesCategory.name)}
                    </span>
                  ` : ''}
                  <span class="text-xs text-[var(--text-muted)]">${taskCounts['notes'] || 0} notes</span>
                </div>
                <button onclick="window.createRootNote(${state.activeAreaFilter ? `'${state.activeAreaFilter}'` : 'null'})"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  New note
                </button>
              </div>
              ${renderNotesBreadcrumb()}
              <div class="py-2">
                ${renderNotesOutliner(state.activeAreaFilter)}
              </div>
            </div>
          ` : `
            <!-- Regular task list -->
            <div class="task-list">
              ${filteredTasks.filter(t => !t.isNote || !(state.activeFilterType === 'label' || state.activeFilterType === 'person')).map(task => renderTaskItem(task)).join('')}
            </div>
            ${buildLabelPersonNotesSection(filteredTasks, viewInfo)}
          `))))}
        </div>
      </div>
    </div>
  `);

  return `
    <!-- Mobile Sidebar Drawer (hidden on desktop) -->
    <div id="mobile-sidebar-overlay" class="mobile-sidebar-overlay md:hidden ${state.mobileDrawerOpen ? 'show' : ''}" onclick="if(event.target===this) closeMobileDrawer()" role="dialog" aria-modal="true" aria-hidden="${state.mobileDrawerOpen ? 'false' : 'true'}" aria-label="Workspace sidebar">
      <div class="mobile-sidebar-drawer" onclick="event.stopPropagation()">
        <div class="p-4 border-b border-[var(--border-light)] flex items-center justify-between" style="padding-top: max(16px, env(safe-area-inset-top));">
          <h2 class="text-lg font-bold text-[var(--text-primary)]">Workspace</h2>
          <button id="mobile-drawer-close" onclick="closeMobileDrawer()" class="w-11 h-11 flex items-center justify-center rounded-full text-[var(--text-muted)] active:bg-[var(--bg-secondary)] transition" aria-label="Close sidebar">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        ${sidebarHtml.replace('w-full md:w-64', 'w-full')}
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <div class="hidden md:block">${sidebarHtml}</div>
      ${taskListHtml}
    </div>
  `;
}
