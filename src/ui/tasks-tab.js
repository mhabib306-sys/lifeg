// ============================================================================
// TASKS TAB UI MODULE
// ============================================================================
// Renders the full Tasks workspace view: sidebar, task list, area view,
// calendar view, notes outliner, and individual task items.

import { state } from '../state.js';
import { THINGS3_ICONS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE } from '../constants.js';
import { escapeHtml, formatSmartDate, getLocalDateString } from '../utils.js';
import { getCategoryById, getLabelById, getPersonById, getTasksByPerson } from '../features/categories.js';

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

// renderCalendarView and renderNotesOutliner are still in index.html
function renderCalendarView() {
  return window.renderCalendarView();
}
function renderNotesOutliner(categoryId) {
  return window.renderNotesOutliner(categoryId);
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
  const category = getCategoryById(task.categoryId);
  const labels = (task.labels || []).map(lid => getLabelById(lid)).filter(Boolean);
  const people = (task.people || []).map(pid => getPersonById(pid)).filter(Boolean);
  const today = getLocalDateString();
  const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
  const isDueToday = task.dueDate === today;
  const isDueSoon = task.dueDate && !isDueToday && !isOverdue && (() => {
    const diff = (new Date(task.dueDate + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000;
    return diff > 0 && diff <= 2;
  })();
  const hasMetadata = !compact && (category || labels.length > 0 || people.length > 0 || (showDueDate && task.dueDate) || task.deferDate || (task.repeat && task.repeat.type !== 'none') || task.notes);
  const isInlineEditing = state.inlineEditingTaskId === task.id;
  const indentLevel = task.indent || 0;
  const indentPx = indentLevel * 24;

  // Compact mode for widgets - clean single line Things 3 style
  if (compact) {
    return `
      <div class="task-item group relative hover:bg-[var(--bg-secondary)]/50 rounded-lg transition cursor-pointer"
        onclick="window.showPerspectiveTasks('${task.status || 'anytime'}')">
        <div class="flex items-center min-h-[40px] px-3 py-1.5">
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
          <span class="flex-1 ml-3 text-[14px] leading-snug truncate ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}">${escapeHtml(task.title)}</span>
          <div class="flex items-center gap-2 ml-2 flex-shrink-0 text-[11px]">
            ${category ? `<span class="text-[var(--text-muted)] truncate max-w-[80px]">${escapeHtml(category.name)}</span>` : ''}
            ${task.dueDate ? `<span class="${isOverdue ? 'text-red-500 font-medium' : isDueToday ? 'text-[var(--accent)] font-medium' : isDueSoon ? 'text-amber-500 font-medium' : 'text-[var(--text-muted)]'}">${formatSmartDate(task.dueDate)}</span>` : ''}
            ${task.repeat && task.repeat.type !== 'none' ? `<span class="text-[var(--text-muted)]" title="Repeats ${task.repeat.interval > 1 ? 'every ' + task.repeat.interval + ' ' : ''}${task.repeat.type}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg></span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="task-item group relative"
      draggable="${isInlineEditing ? 'false' : 'true'}"
      ondragstart="window.handleDragStart(event, '${task.id}')"
      ondragend="window.handleDragEnd(event)"
      ondragover="window.handleDragOver(event, '${task.id}')"
      ondragleave="window.handleDragLeave(event)"
      ondrop="window.handleDrop(event, '${task.id}')" onclick="if(window.matchMedia('(hover: none)').matches && !event.target.closest('.task-checkbox')) { window.editingTaskId='${task.id}'; window.showTaskModal=true; window.render(); }">
      <div class="flex items-start gap-3 px-4 py-2.5" style="${indentLevel > 0 ? `padding-left: ${16 + indentPx}px` : ''}">
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
              class="text-[15px] ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'} leading-snug transition cursor-text">${escapeHtml(task.title)}</span>
          `}
          ${hasMetadata ? `
            <div class="flex items-center gap-2 mt-1 flex-wrap text-[11px]">
              ${category ? `<span onclick="event.stopPropagation(); window.showCategoryTasks('${category.id}')" class="flex items-center gap-1 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"><span class="w-[6px] h-[6px] rounded-full flex-shrink-0" style="background:${category.color || 'var(--text-muted)'}"></span>${escapeHtml(category.name)}</span>` : ''}
              ${labels.map(l => `<span onclick="event.stopPropagation(); window.showLabelTasks('${l.id}')" class="px-1.5 rounded cursor-pointer bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">${escapeHtml(l.name)}</span>`).join('')}
              ${people.length > 0 ? `<span onclick="event.stopPropagation(); window.showPersonTasks('${people[0].id}')" class="flex items-center gap-1 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>${people.map(p => escapeHtml(p.name.split(' ')[0])).join(', ')}</span>` : ''}
              ${task.deferDate ? `<span class="flex items-center gap-1 text-[var(--text-secondary)]"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12z"/></svg>${formatSmartDate(task.deferDate)}</span>` : ''}
              ${showDueDate && task.dueDate ? `<span class="flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : isDueToday ? 'text-[var(--accent)] font-medium' : isDueSoon ? 'text-amber-500 font-medium' : 'text-[var(--text-muted)]'}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>${formatSmartDate(task.dueDate)}</span>` : ''}
              ${task.repeat && task.repeat.type !== 'none' ? `<span class="text-[var(--text-muted)]" title="Repeats ${task.repeat.interval > 1 ? 'every ' + task.repeat.interval + ' ' : ''}${task.repeat.type}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg></span>` : ''}
              ${task.notes ? `<span class="text-[var(--text-muted)]" title="${escapeHtml(task.notes.substring(0, 200))}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/></svg></span>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--modal-bg)]/95 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm" onclick="event.stopPropagation()">
          ${task.isNote && !task.completed ? `
            <button onclick="event.stopPropagation(); window.createChildNote('${task.id}')"
              class="p-1 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition" title="Add child note">
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
  const completedTasks = state.tasksData.filter(t => t.categoryId === state.activeCategoryFilter && t.completed && !t.isNote).length;
  const activeTasks = areaTasks.filter(t => !t.isNote).length;
  const noteItems = areaTasks.filter(t => t.isNote);
  const taskItems = areaTasks.filter(t => !t.isNote);
  const overdueTasks = taskItems.filter(t => t.dueDate && t.dueDate < todayDate);
  const todayTasks = taskItems.filter(t =>
    !overdueTasks.includes(t) && (t.status === 'today' || t.dueDate === todayDate));
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
  const categoryColor = currentCategory.color || '#6366F1';

  return `
    <div class="flex-1 space-y-6">
      <!-- Area Hero Header -->
      <div class="bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-light)]">
        <div class="relative h-32 flex items-end p-6" style="background: var(--bg-secondary);">
          <div class="absolute top-4 right-4 opacity-10" style="color: ${categoryColor}">
            <svg class="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>
          </div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" style="background: ${categoryColor}">
              <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2H4z"/></svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-charcoal">${currentCategory.name}</h1>
              <p class="text-charcoal/50 text-sm mt-0.5">${totalTasks} item${totalTasks !== 1 ? 's' : ''} · ${completedTasks} completed</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-4 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/30">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <div class="relative w-12 h-12">
                <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" stroke-width="3"/>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="${categoryColor}" stroke-width="3"
                    stroke-dasharray="${completionRate} 100" stroke-linecap="round"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-charcoal">${completionRate}%</span>
              </div>
              <div>
                <div class="text-sm font-medium text-charcoal">Progress</div>
                <div class="text-xs text-charcoal/50">${completedTasks} of ${activeTasks + completedTasks} tasks</div>
              </div>
            </div>
            ${overdueTasks.length > 0 ? `
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100">
                <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <span class="text-sm font-medium text-red-600">${overdueTasks.length} overdue</span>
              </div>
            ` : ''}
            ${todayTasks.length > 0 ? `
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
                <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/></svg>
                <span class="text-sm font-medium text-amber-600">${todayTasks.length} today</span>
              </div>
            ` : ''}
            <div class="flex-1"></div>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${categoryColor}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 border-dashed flex-shrink-0" style="border-color: ${categoryColor}40"></div>
          <input type="text" id="quick-add-input"
            placeholder="Quick add to ${currentCategory.name}... (press Enter)"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-charcoal placeholder-charcoal/30 bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-charcoal/30 hover:opacity-70 transition p-1" style="color: ${categoryColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </button>
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
              <span class="text-sm font-semibold text-charcoal">Today</span>
              <span class="text-xs text-charcoal/40 ml-1">${todayTasks.length}</span>
            </div>
            <div class="task-list">${todayTasks.map(task => renderTaskItem(task, false)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'today', categoryId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'today' && t.categoryId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
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
              <span class="text-sm font-semibold text-charcoal">Upcoming</span>
              <span class="text-xs text-charcoal/40 ml-1">${upcomingTasks.length}</span>
            </div>
            <div class="task-list">${upcomingTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${deferredTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden opacity-75">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-muted)]">Deferred</span>
              <span class="text-xs text-charcoal/40 ml-1">${deferredTasks.length}</span>
            </div>
            <div class="task-list">${deferredTasks.map(task => renderTaskItem(task)).join('')}</div>
          </div>
        ` : ''}

        ${inboxTasks.length > 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h4.18c.26 1.7 1.74 3 3.57 3h2.5c1.83 0 3.31-1.3 3.57-3H21v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6zm0-2l3-7h12l3 7h-4.18c-.26-1.7-1.74-3-3.57-3h-2.5c-1.83 0-3.31 1.3-3.57 3H3z"/></svg>
              <span class="text-sm font-semibold text-charcoal">Inbox</span>
              <span class="text-xs text-charcoal/40 ml-1">${inboxTasks.length}</span>
            </div>
            <div class="task-list">${inboxTasks.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'inbox', categoryId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'inbox' && t.categoryId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
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
              <span class="text-sm font-semibold text-charcoal">Anytime</span>
              <span class="text-xs text-charcoal/40 ml-1">${anytimeTasks.length}</span>
            </div>
            <div class="task-list">${anytimeTasks.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'anytime', categoryId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'anytime' && t.categoryId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
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
              <span class="text-sm font-semibold text-charcoal">Someday</span>
              <span class="text-xs text-charcoal/40 ml-1">${somedayTasks.length}</span>
            </div>
            <div class="task-list">${somedayTasks.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { status: 'someday', categoryId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && t.status === 'someday' && t.categoryId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.startInlineEdit(tasks[tasks.length-1].id); }, 100);"
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
              <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/><rect x="10" y="5" width="11" height="2" rx="1"/><rect x="10" y="11" width="11" height="2" rx="1"/><rect x="10" y="17" width="11" height="2" rx="1"/></svg>
              <span class="text-sm font-semibold text-charcoal">Notes</span>
              <span class="text-xs text-charcoal/40 ml-1">${noteItems.length}</span>
            </div>
            <button onclick="window.createTask('', { isNote: true, categoryId: '${currentCategory.id}', status: 'anytime' }); setTimeout(() => { const notes = window.tasksData.filter(t => t.isNote && t.categoryId === '${currentCategory.id}' && !t.completed); if (notes.length) { window.startInlineEdit(notes[notes.length-1].id); } }, 100);"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Note
            </button>
          </div>
          ${noteItems.length > 0 ? `
            <div class="task-list">${noteItems.map(task => renderTaskItem(task)).join('')}</div>
            <div class="px-4 py-2 border-t border-[var(--border-light)]">
              <button onclick="window.createTask('', { isNote: true, categoryId: '${currentCategory.id}', status: 'anytime' }); setTimeout(() => { const notes = window.tasksData.filter(t => t.isNote && t.categoryId === '${currentCategory.id}' && !t.completed); if (notes.length) { window.startInlineEdit(notes[notes.length-1].id); } }, 100);"
                class="flex items-center gap-2 px-3 py-2 w-full text-sm text-purple-400 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg transition text-left">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add another note...
              </button>
            </div>
          ` : `
            <div class="px-4 py-8 text-center">
              <p class="text-sm text-charcoal/40 mb-3">No notes in this area yet</p>
              <button onclick="window.createTask('', { isNote: true, categoryId: '${currentCategory.id}', status: 'anytime' }); setTimeout(() => { const notes = window.tasksData.filter(t => t.isNote && t.categoryId === '${currentCategory.id}' && !t.completed); if (notes.length) { window.startInlineEdit(notes[notes.length-1].id); } }, 100);"
                class="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Create your first note
              </button>
            </div>
          `}
        </div>

        ${totalTasks === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-charcoal/30">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style="background: ${categoryColor}10">
                <svg class="w-10 h-10" style="color: ${categoryColor}" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2H4z"/></svg>
              </div>
              <p class="text-lg font-medium text-charcoal/50 mb-1">No items yet</p>
              <p class="text-sm text-charcoal/30 mb-4">Add your first task or note to ${currentCategory.name}</p>
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
// renderTasksTab — Full tasks workspace view
// ============================================================================
/**
 * Render the entire Tasks tab including sidebar and main content area.
 * Handles all perspective views, area views, calendar view, and notes outliner.
 * @returns {string} HTML string for the complete tasks tab
 */
export function renderTasksTab() {
  const allPerspectives = [...BUILTIN_PERSPECTIVES, ...state.customPerspectives];
  const filteredTasks = getCurrentFilteredTasks();
  const viewInfo = getCurrentViewInfo();

  // Count tasks per perspective
  const taskCounts = {};
  const todayDate = getLocalDateString();
  BUILTIN_PERSPECTIVES.forEach(p => {
    if (p.id === 'today') {
      // Today count shows only dated tasks (not Next-tagged tasks)
      taskCounts[p.id] = state.tasksData.filter(t => {
        if (t.completed) return false;
        const isDueToday = t.dueDate === todayDate;
        const isOverdue = t.dueDate && t.dueDate < todayDate;
        const isScheduledForToday = t.deferDate && t.deferDate <= todayDate;
        return t.status === 'today' || isDueToday || isOverdue || isScheduledForToday;
      }).length;
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
  state.taskCategories.forEach(cat => {
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
  const isCategoryActive = (cId) => state.activeFilterType === 'category' && state.activeCategoryFilter === cId;
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
          <button onclick="window.editingCategoryId=null; window.showCategoryModal=true; window.render()" aria-label="Add new area" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.taskCategories.map(cat => `
            <div onclick="window.showCategoryTasks('${cat.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showCategoryTasks('${cat.id}');}"
              tabindex="0"
              role="button"
              aria-label="View ${escapeHtml(cat.name)} area"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isCategoryActive(cat.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}"
              draggable="true"
              data-id="${cat.id}"
              data-type="category">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[var(--text-muted)]">${THINGS3_ICONS.area}</span>
              <span class="flex-1 text-[14px] ${isCategoryActive(cat.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(cat.name)}</span>
              <span class="min-w-[20px] text-right text-[12px] group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${categoryCounts[cat.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editingCategoryId='${cat.id}'; window.showCategoryModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Tags -->
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tags</h3>
          <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()" aria-label="Add new tag" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.taskLabels.map(label => `
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
        </div>
      </div>

      <!-- People -->
      <div class="bg-[var(--modal-bg)] rounded-xl border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">People</h3>
          <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()" aria-label="Add new person" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.taskPeople.map(person => `
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
              <span class="flex-1 text-[14px] ${isPersonActive(person.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(person.name)}</span>
              <span class="min-w-[20px] text-right text-[12px] group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${peopleCounts[person.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editingPersonId='${person.id}'; window.showPersonModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Check if viewing an area (category) - render special area view
  const isAreaView = state.activeFilterType === 'category' && state.activeCategoryFilter;
  const currentCategory = isAreaView ? getCategoryById(state.activeCategoryFilter) : null;

  // Build task list (default view for non-area views)
  const isCalendarView = state.activeFilterType === 'perspective' && state.activePerspective === 'calendar';
  const taskListHtml = isCalendarView ? renderCalendarView() : isAreaView ? buildAreaTaskListHtml(currentCategory, filteredTasks, todayDate) : `
    <div class="flex-1">
      <div class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)]">
        <div class="task-list-header-desktop px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl" ${viewInfo.color ? `style="color: ${viewInfo.color}"` : ''}>${viewInfo.icon}</span>
            <h2 class="text-xl font-semibold text-[var(--text-primary)]">${viewInfo.name}</h2>
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
              <div class="w-5 h-5 rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>
            `}
            <input type="text" id="quick-add-input"
              placeholder="${state.activePerspective === 'notes' ? 'New Note' : 'New To-Do'}"
              onkeydown="window.handleQuickAddKeydown(event, this)"
              class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition p-1" title="${state.activePerspective === 'notes' ? 'Add Note' : 'Add to ' + viewInfo.name}">
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
              ${state.activePerspective === 'inbox' ? '<p class="text-[13px] mt-1 text-[var(--text-muted)]/60">Add a task to get started</p>' : ''}
            </div>
          ` : (state.activePerspective === 'upcoming' ? `
            <!-- Upcoming view grouped by date -->
            <div class="task-list">
              ${groupTasksByDate(filteredTasks).map(group => `
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)]">
                    <span class="text-[13px] font-semibold text-charcoal/50">${group.label}</span>
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
                    <span class="text-[13px] font-semibold text-charcoal/50">${group.label}</span>
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
              return t.status === 'today' || isDueToday || isOverdue || isScheduledForToday;
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
              const isDatedTask = t.status === 'today' || t.dueDate === today || (t.dueDate && t.dueDate < today) || isScheduledForToday;
              return isNextTagged && !isDatedTask;
            }) : [];

            const totalTasks = allDated.length + nextTasks.length;

            // Helper to render a section with header
            const renderSection = (tasks, icon, label, color, extraClass = '') => tasks.length > 0 ? `
              <div class="${extraClass}">
                <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)]">
                  <div class="flex items-center gap-2">
                    <span class="text-${color}">${icon}</span>
                    <span class="text-[13px] font-semibold text-charcoal/50 uppercase tracking-wider">${label}</span>
                    <span class="text-xs text-charcoal/30">${tasks.length}</span>
                  </div>
                </div>
                ${tasks.map(task => renderTaskItem(task)).join('')}
              </div>
            ` : '';

            return `
            <div class="task-list">
              ${renderSection(dueTasks,
                '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>',
                'Due', 'red-500')}
              ${todayStatusTasks.length > 0 ? `
                <div class="${dueTasks.length > 0 ? 'mt-2' : ''}">
                  ${todayStatusTasks.map(task => renderTaskItem(task)).join('')}
                </div>
              ` : ''}
              ${renderSection(startingTasks,
                '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
                'Starting', 'blue-500', dueTasks.length > 0 || todayStatusTasks.length > 0 ? 'mt-2' : '')}
              ${renderSection(nextTasks, THINGS3_ICONS.next, 'Next', '[#8B5CF6]',
                allDated.length > 0 ? 'mt-4' : '')}
              ${totalTasks === 0 ? `
                <div class="empty-state flex flex-col items-center justify-center py-20 text-charcoal/30">
                  <div class="w-16 h-16 mb-4 flex items-center justify-center opacity-50">${viewInfo.icon}</div>
                  <p class="text-[15px] font-medium">No tasks in ${viewInfo.name}</p>
                </div>
              ` : ''}
            </div>
          `;
          })() : (state.activePerspective === 'notes' ? `
            <!-- Notes Outliner View -->
            <div class="notes-outliner bg-[var(--bg-card)]">
              <div class="px-4 py-3 border-b border-charcoal/5">
                <div class="flex items-center gap-2 text-xs text-charcoal/40">
                  <span>Tab to indent</span>
                  <span>•</span>
                  <span>Shift+Tab to outdent</span>
                  <span>•</span>
                  <span>Enter for new note</span>
                  <span>•</span>
                  <span>Click bullet to collapse</span>
                </div>
              </div>
              <div class="py-2">
                ${renderNotesOutliner(state.activeCategoryFilter)}
                <div class="px-4 py-2">
                  <button onclick="window.createTask('', { isNote: true, categoryId: window.activeCategoryFilter, status: 'anytime' }); setTimeout(() => { const notes = window.tasksData.filter(t => t.isNote && !t.completed); if (notes.length) window.focusNote(notes[notes.length-1].id); }, 100);"
                    class="flex items-center gap-2 py-2 w-full text-left text-sm text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    Add new note
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <!-- Regular task list -->
            <div class="task-list">
              ${filteredTasks.map(task => renderTaskItem(task)).join('')}
            </div>
          `))))}
        </div>
      </div>
    </div>
  `;

  return `
    <!-- Mobile Sidebar Drawer (hidden on desktop) -->
    <div id="mobile-sidebar-overlay" class="mobile-sidebar-overlay md:hidden ${state.mobileDrawerOpen ? 'show' : ''}" onclick="if(event.target===this) closeMobileDrawer()">
      <div class="mobile-sidebar-drawer">
        <div class="p-4 border-b border-[var(--border-light)] flex items-center justify-between" style="padding-top: max(16px, env(safe-area-inset-top));">
          <h2 class="text-lg font-bold text-[var(--text-primary)]">Workspace</h2>
          <button onclick="closeMobileDrawer()" class="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] active:bg-[var(--bg-secondary)] transition" aria-label="Close sidebar">
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
