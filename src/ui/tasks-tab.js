// ============================================================================
// TASKS TAB UI MODULE
// ============================================================================
// Renders the full Tasks workspace view: sidebar, task list, area view,
// notes outliner, and individual task items.

import { state } from '../state.js';
import { THINGS3_ICONS, getActiveIcons, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE } from '../constants.js';
import { escapeHtml, formatSmartDate, getLocalDateString, renderPersonAvatar, isTouchDevice } from '../utils.js';
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
function renderTriggersOutliner(filter) {
  if (typeof window.renderTriggersOutliner === 'function') return window.renderTriggersOutliner(filter);
  return '';
}
function renderTriggersBreadcrumb() {
  if (typeof window.renderTriggersBreadcrumb === 'function') return window.renderTriggersBreadcrumb();
  return '';
}

// ============================================================================
// buildTaskSections — Shared section renderer for landing pages
// ============================================================================
/**
 * Groups tasks into status sections (overdue, today, upcoming, etc.)
 * and renders each as a card with header + task list + add button.
 * @param {Array} taskItems - Non-note tasks to group
 * @param {string} todayDate - YYYY-MM-DD
 * @param {string} entityColor - Hex color for accents
 * @param {string} createPropsExpr - JS expression for createTask options, e.g. "areaId: 'x'"
 * @param {string} filterExpr - JS filter expression for finding created tasks, e.g. "t.areaId === 'x'"
 * @returns {string} HTML string
 */
function buildTaskSections(taskItems, todayDate, entityColor, createPropsExpr, filterExpr) {
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

  const addBtn = (status, label, color, extraProps = '') => `
    <div class="px-4 py-2 border-t border-[var(--border-light)]">
      <button onclick="window.createTask('', { status: '${status}', ${extraProps} ${createPropsExpr} }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && ${filterExpr} && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
        class="flex items-center gap-2 px-3 py-2 w-full text-sm hover:bg-opacity-50 rounded-lg transition text-left" style="color: ${color}">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        ${label}
      </button>
    </div>`;

  const hasAnyTasks = overdueTasks.length + todayTasks.length + upcomingTasks.length + deferredTasks.length + inboxTasks.length + anytimeTasks.length + somedayTasks.length > 0;

  return `
    ${!hasAnyTasks ? `
      <div class="text-center py-12 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-2">No tasks yet</p>
        ${addBtn('anytime', 'Add a task...', entityColor)}
      </div>
    ` : ''}
    ${overdueTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden" style="border: 1px solid color-mix(in srgb, var(--overdue-color) 12%, transparent)">
        <div class="px-4 py-3 flex items-center gap-2" style="background: color-mix(in srgb, var(--overdue-color) 3%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--overdue-color) 12%, transparent)">
          <svg class="w-4 h-4" style="color: var(--overdue-color)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="text-sm font-semibold" style="color: var(--overdue-color)">Overdue</span>
          <span class="text-xs ml-1" style="color: var(--overdue-color); opacity: 0.6">${overdueTasks.length}</span>
        </div>
        <div class="task-list">${overdueTasks.map(task => renderTaskItem(task)).join('')}</div>
      </div>
    ` : ''}

    ${todayTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2" style="background: color-mix(in srgb, var(--today-color) 3%, transparent)">
          <svg class="w-4 h-4" style="color: var(--today-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Today</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${todayTasks.length}</span>
        </div>
        <div class="task-list">${todayTasks.map(task => renderTaskItem(task, false)).join('')}</div>
        ${addBtn('anytime', 'Add to Today...', 'var(--today-color)', 'today: true,')}
      </div>
    ` : ''}

    ${upcomingTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--overdue-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Upcoming</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${upcomingTasks.length}</span>
        </div>
        <div class="task-list">${upcomingTasks.map(task => renderTaskItem(task)).join('')}</div>
      </div>
    ` : ''}

    ${deferredTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="text-sm font-semibold text-[var(--text-muted)]">Deferred</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${deferredTasks.length}</span>
        </div>
        <div class="task-list">${deferredTasks.map(task => renderTaskItem(task)).join('')}</div>
      </div>
    ` : ''}

    ${inboxTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--inbox-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Inbox</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${inboxTasks.length}</span>
        </div>
        <div class="task-list">${inboxTasks.map(task => renderTaskItem(task)).join('')}</div>
        ${addBtn('anytime', 'Add Task...', 'var(--inbox-color)')}
      </div>
    ` : ''}

    ${anytimeTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--anytime-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Anytime</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${anytimeTasks.length}</span>
        </div>
        <div class="task-list">${anytimeTasks.map(task => renderTaskItem(task)).join('')}</div>
        ${addBtn('anytime', 'Add to Anytime...', 'var(--anytime-color)')}
      </div>
    ` : ''}

    ${somedayTasks.length > 0 ? `
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--someday-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Someday</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${somedayTasks.length}</span>
        </div>
        <div class="task-list">${somedayTasks.map(task => renderTaskItem(task)).join('')}</div>
        ${addBtn('someday', 'Add to Someday...', 'var(--someday-color)')}
      </div>
    ` : ''}
  `;
}

// ============================================================================
// buildNotesSection — Shared notes card for landing pages
// ============================================================================
function buildNotesSection(noteItems, filterArg, filterObj) {
  return `
    <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Notes</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${noteItems.length}</span>
        </div>
        <button onclick="window.createRootNote(${filterArg})"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Note
        </button>
      </div>
      ${noteItems.length > 0 ? `
        ${renderNotesBreadcrumb()}
        <div class="py-2">${renderNotesOutliner(filterObj)}</div>
        <div class="px-4 py-2 border-t border-[var(--border-light)]">
          <button onclick="window.createRootNote(${filterArg})"
            class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add another note...
          </button>
        </div>
      ` : `
        <div class="px-4 py-8 text-center">
          <p class="text-sm text-[var(--text-muted)] mb-3">No notes here yet</p>
          <button onclick="window.createRootNote(${filterArg})"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium rounded-lg hover:bg-[var(--accent-light)] transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Create your first note
          </button>
        </div>
      `}
    </div>
  `;
}

// ============================================================================
// buildTriggersSection — Shared triggers card for landing pages
// ============================================================================
function buildTriggersSection(triggerItems, filterArg, filterObj) {
  return `
    <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span style="color: var(--today-color)">${getActiveIcons().trigger.replace('w-5 h-5', 'w-4 h-4')}</span>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Triggers</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${triggerItems.length}</span>
        </div>
        <button onclick="window.createRootTrigger(${filterArg})"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--trigger-color)] hover:bg-[color-mix(in_srgb,var(--trigger-color)_6%,transparent)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Trigger
        </button>
      </div>
      ${triggerItems.length > 0 ? `
        ${renderTriggersBreadcrumb()}
        <div class="py-2">${renderTriggersOutliner(filterObj)}</div>
        <div class="px-4 py-2 border-t border-[var(--border-light)]">
          <button onclick="window.createRootTrigger(${filterArg})"
            class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--trigger-color)] hover:bg-[color-mix(in_srgb,var(--trigger-color)_6%,transparent)] rounded-lg transition text-left">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add another trigger...
          </button>
        </div>
      ` : `
        <div class="px-4 py-8 text-center">
          <p class="text-sm text-[var(--text-muted)] mb-3">No triggers here yet</p>
          <button onclick="window.createRootTrigger(${filterArg})"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[color-mix(in_srgb,var(--trigger-color)_6%,transparent)] text-[var(--trigger-color)] text-sm font-medium rounded-lg hover:bg-[color-mix(in_srgb,var(--trigger-color)_12%,transparent)] transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add your first trigger
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
  const isTouch = isTouchDevice();
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
  if (task.timeEstimate) metaParts.push(`⏱️ ${task.timeEstimate}m`);

  // Compact mode for widgets - clean single line Things 3 style
  if (compact) {
    return `
      <div class="task-item compact-task group relative hover:bg-[var(--bg-secondary)]/50 rounded-lg transition cursor-pointer"
        data-task-id="${task.id}"
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
              ${task.completed ? '<svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </button>
          `}
          <span class="flex-1 ml-2.5 text-[13px] leading-snug truncate ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}">
            ${task.flagged ? `<span class="inline-flex items-center mr-1" style="color: var(--flagged-color)">${getActiveIcons().flagged.replace('w-5 h-5', 'w-3 h-3')}</span>` : ''}
            ${escapeHtml(task.title)}
          </span>
          <div class="flex items-center gap-1.5 ml-2 flex-shrink-0 text-[11px]">
            ${area ? `<span class="text-[var(--text-muted)] truncate max-w-[90px]">${escapeHtml(area.name)}${subcategory ? ' › ' + escapeHtml(subcategory.name) : ''}</span>` : ''}
            ${task.dueDate ? `<span class="${isOverdue ? 'font-medium' : isDueToday ? 'text-[var(--accent)] font-medium' : isDueSoon ? 'font-medium' : 'text-[var(--text-muted)]'}" style="${isOverdue ? 'color: var(--overdue-color)' : isDueSoon ? 'color: var(--flagged-color)' : ''}">${formatSmartDate(task.dueDate)}</span>` : ''}
            ${task.repeat && task.repeat.type !== 'none' ? `<span class="text-[var(--text-muted)]" title="Repeats ${task.repeat.interval > 1 ? 'every ' + task.repeat.interval + ' ' : ''}${task.repeat.type}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg></span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  const taskInnerHtml = `
    <div class="task-item group relative ${hasMetadata && metaParts.length ? 'has-meta' : 'no-meta'}${task.isNote ? ' is-note' : ''}"
      data-task-id="${task.id}"
      draggable="${isInlineEditing || isTouch ? 'false' : 'true'}"
      ${isInlineEditing || isTouch ? '' : `ondragstart="window.handleDragStart(event, '${task.id}')"
      ondragend="window.handleDragEnd(event)"
      ondragover="window.handleDragOver(event, '${task.id}')"
      ondragleave="window.handleDragLeave(event)"
      ondrop="window.handleDrop(event, '${task.id}')"`}
      onclick="if(window.isTouchDevice && window.isTouchDevice() && !event.target.closest('.task-inline-title') && !event.target.closest('.task-checkbox') && !event.target.closest('button') && !event.target.closest('.swipe-action-btn')) { window.editingTaskId='${task.id}'; window.showTaskModal=true; window.render(); }">
      <div class="task-row flex items-start gap-3 px-4 py-2.5" style="${indentLevel > 0 ? `padding-left: ${16 + indentPx}px` : ''}">
        ${task.isNote ? `
          <div class="mt-2 w-1.5 h-1.5 rounded-full ${indentLevel > 0 ? 'bg-[var(--notes-accent)]/50' : 'bg-[var(--notes-accent)]'} flex-shrink-0"></div>
        ` : `
          <button onclick="event.stopPropagation(); window.toggleTaskComplete('${task.id}')"
            aria-label="${task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}: ${escapeHtml(task.title)}"
            class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'completed bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--text-muted)] hover:border-[var(--accent)]'}">
            ${task.completed ? '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </button>
        `}
        <div class="flex-1 min-w-0">
          <div class="flex items-start gap-1">
            ${task.flagged ? `<span class="inline-flex items-center mt-0.5 flex-shrink-0" style="color: var(--flagged-color)">${getActiveIcons().flagged.replace('w-5 h-5', 'w-3 h-3')}</span>` : ''}
            <div contenteditable="${task.completed ? 'false' : 'true'}"
              class="task-inline-title flex-1 text-[15px] ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'} leading-snug outline-none"
              data-task-id="${task.id}"
              data-placeholder="Task title..."
              onfocus="event.stopPropagation(); window.handleTaskInlineFocus(event, '${task.id}')"
              onblur="window.handleTaskInlineBlur(event, '${task.id}')"
              onkeydown="window.handleTaskInlineKeydown(event, '${task.id}')"
              oninput="window.handleTaskInlineInput(event, '${task.id}')"
              onpaste="window.handleTaskInlinePaste(event)"
            >${escapeHtml(task.title)}</div>
          </div>
          ${hasMetadata && metaParts.length ? `
            <div class="task-meta-inline">${metaParts.join(' • ')}</div>
          ` : ''}
        </div>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--modal-bg)]/95 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm" onclick="event.stopPropagation()">
          ${task.isNote && !task.completed ? `
            <button onclick="event.stopPropagation(); window.createChildNote('${task.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-md transition" title="Add child note">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <button onclick="event.stopPropagation(); window.outdentNote('${task.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition ${indentLevel === 0 ? 'opacity-30 cursor-not-allowed' : ''}" title="Outdent (Shift+Tab)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="4" x2="21" y2="4"/><line x1="3" y1="20" x2="21" y2="20"/><line x1="11" y1="8" x2="21" y2="8"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="16" x2="21" y2="16"/><polyline points="7 8 3 12 7 16"/></svg>
            </button>
            <button onclick="event.stopPropagation(); window.indentNote('${task.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Indent (Tab)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="4" x2="21" y2="4"/><line x1="3" y1="20" x2="21" y2="20"/><line x1="11" y1="8" x2="21" y2="8"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="16" x2="21" y2="16"/><polyline points="3 8 7 12 3 16"/></svg>
            </button>
          ` : ''}
          <button onclick="event.stopPropagation(); window.toggleNoteTask('${task.id}')"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition"
            title="${task.isNote ? 'Convert to task' : 'Convert to note'}"
            aria-label="${task.isNote ? 'Convert to task' : 'Convert to note'}">
            ${task.isNote
              ? '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>'
              : '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
          </button>
          <button onclick="event.stopPropagation(); window.inlineEditingTaskId=null; window.editingTaskId='${task.id}'; window.showTaskModal=true; window.render()"
            aria-label="Edit task: ${escapeHtml(task.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Edit">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); window.confirmDeleteTask('${task.id}')"
            aria-label="Delete task: ${escapeHtml(task.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_6%,transparent)] rounded-md transition" title="Delete">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  if (isTouch && !task.isNote) {
    return `
      <div class="swipe-row" data-task-id="${task.id}">
        <div class="swipe-actions-left">
          <button class="swipe-action-btn swipe-action-complete" onclick="event.stopPropagation(); window.toggleTaskComplete('${task.id}')">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${task.completed ? 'Undo' : 'Done'}</span>
          </button>
        </div>
        <div class="swipe-row-content">${taskInnerHtml}</div>
        <div class="swipe-actions-right">
          <button class="swipe-action-btn swipe-action-flag" onclick="event.stopPropagation(); window.toggleFlag('${task.id}')">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="${task.flagged ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            <span>${task.flagged ? 'Unflag' : 'Flag'}</span>
          </button>
          <button class="swipe-action-btn swipe-action-delete" onclick="event.stopPropagation(); window.confirmDeleteTask('${task.id}')">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }

  return taskInnerHtml;
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
  const showTasks = state.workspaceContentMode !== 'notes';
  const showNotes = state.workspaceContentMode !== 'tasks';
  const overdueCt = taskItems.filter(t => t.dueDate && t.dueDate < todayDate).length;
  const todayCt = taskItems.filter(t =>
    !(t.dueDate && t.dueDate < todayDate) && (t.today || t.dueDate === todayDate)).length;

  const createPropsExpr = `areaId: '${currentCategory.id}'`;
  const filterExpr = `t.areaId === '${currentCategory.id}'`;

  const completionRate = activeTasks + completedTasks > 0 ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) : 0;
  const categoryColor = currentCategory.color || 'var(--accent)';

  return `
    <div class="flex-1 space-y-4">
      <!-- Area Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${categoryColor} 12%, transparent); color: ${categoryColor}">
              ${currentCategory.emoji || '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'}
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
          ${overdueCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${overdueCt} overdue
            </div>
          ` : ''}
          ${todayCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${todayCt} today
            </div>
          ` : ''}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote('${currentCategory.id}')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${categoryColor}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? `<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>`
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${categoryColor} 25%, transparent)"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${categoryColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${currentCategory.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${currentCategory.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote('${currentCategory.id}')"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Categories -->
      ${(() => {
        const subcats = getCategoriesByArea(currentCategory.id);
        return `
        <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
          <div class="px-4 py-3 ${subcats.length > 0 ? 'border-b border-[var(--border-light)]' : ''} flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/><path d="M2 8h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" opacity="0.85"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Categories</span>
              ${subcats.length > 0 ? `<span class="text-xs text-[var(--text-muted)] ml-1">${subcats.length}</span>` : ''}
            </div>
            <button onclick="event.stopPropagation(); window.editingAreaId='${currentCategory.id}'; window.showAreaModal=true; window.render()"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
          </div>
          ${subcats.length > 0 ? `
          <div class="divide-y divide-[var(--border-light)]">
            ${subcats.map(sc => {
              const scTaskCount = state.tasksData.filter(t => t.categoryId === sc.id && !t.completed && !t.isNote).length;
              const scColor = sc.color || categoryColor;
              return `
              <button onclick="window.showCategoryTasks('${sc.id}')"
                class="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[var(--bg-secondary)] transition group">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style="background: color-mix(in srgb, ${scColor} 12%, transparent); color: ${scColor}">
                  ${sc.emoji || '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 012-2h4.586a1 1 0 01.707.293L12 5h7a2 2 0 012 2v2"/><rect x="2" y="9" width="20" height="12" rx="2"/></svg>'}
                </span>
                <span class="flex-1 text-[14px] text-[var(--text-primary)] truncate">${escapeHtml(sc.name)}</span>
                <span class="text-xs text-[var(--text-muted)]">${scTaskCount || ''}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>`;
            }).join('')}
          </div>` : ''}
          <div class="px-4 py-2 ${subcats.length > 0 ? 'border-t border-[var(--border-light)]' : ''}">
            <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${currentCategory.id}'; window.render()"
              class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Category
            </button>
          </div>
        </div>`;
      })()}

      <!-- Task Sections -->
      <div class="space-y-4">
        ${showTasks ? buildTaskSections(taskItems, todayDate, categoryColor, createPropsExpr, filterExpr) : ''}
        ${showNotes ? buildNotesSection(noteItems, `'${currentCategory.id}'`, currentCategory.id) : ''}
        ${buildTriggersSection(
          state.triggers.filter(t => t.areaId === currentCategory.id && !t.categoryId),
          `{areaId:'${currentCategory.id}'}`,
          { areaId: currentCategory.id }
        )}

        ${totalTasks === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${categoryColor} 6%, transparent)">
                <svg class="w-10 h-10" style="color: ${categoryColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${escapeHtml(currentCategory.name)}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${categoryColor}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
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
  const showTasks = state.workspaceContentMode !== 'notes';
  const showNotes = state.workspaceContentMode !== 'tasks';
  const overdueCt = taskItems.filter(t => t.dueDate && t.dueDate < todayDate).length;
  const todayCt = taskItems.filter(t =>
    !(t.dueDate && t.dueDate < todayDate) && (t.today || t.dueDate === todayDate)).length;

  const completionRate = activeTasks + completedTasks > 0 ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) : 0;
  const categoryColor = category.color || 'var(--accent)';

  const createPropsExpr = `areaId: '${category.areaId}', categoryId: '${category.id}'`;
  const filterExpr = `t.categoryId === '${category.id}'`;

  return `
    <div class="flex-1 space-y-4">
      <!-- Category Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${categoryColor} 12%, transparent); color: ${categoryColor}">
              ${category.emoji || '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 012-2h4.586a1 1 0 01.707.293L12 5h7a2 2 0 012 2v2"/><rect x="2" y="9" width="20" height="12" rx="2"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${escapeHtml(category.name)}</h1>
              <div class="flex items-center gap-2 mt-1">
                ${parentArea ? `
                  <button onclick="window.showAreaTasks('${parentArea.id}')" class="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                    <span class="w-2 h-2 rounded-full" style="background:${parentArea.color || 'var(--accent)'}"></span>
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
          ${overdueCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${overdueCt} overdue
            </div>
          ` : ''}
          ${todayCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${todayCt} today
            </div>
          ` : ''}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${categoryColor}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? '<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>'
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${categoryColor} 25%, transparent)"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${categoryColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${category.areaId}', categoryId: '${category.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${category.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote({areaId:'${category.areaId}',categoryId:'${category.id}'})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${showTasks ? buildTaskSections(taskItems, todayDate, categoryColor, createPropsExpr, filterExpr) : ''}
        ${showNotes ? buildNotesSection(noteItems, `{areaId:'${category.areaId}',categoryId:'${category.id}'}`, {categoryId: category.id}) : ''}
        ${buildTriggersSection(
          state.triggers.filter(t => t.areaId === category.areaId && t.categoryId === category.id),
          `{areaId:'${category.areaId}',categoryId:'${category.id}'}`,
          { areaId: category.areaId, categoryId: category.id }
        )}

        ${filteredTasks.length === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
            <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <svg class="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
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
// buildLabelTaskListHtml — Dedicated label landing page
// ============================================================================
export function buildLabelTaskListHtml(label, filteredTasks, todayDate) {
  if (!label) return '';

  const completedTasks = state.tasksData.filter(t => (t.labels || []).includes(label.id) && t.completed && !t.isNote).length;
  const taskItems = filteredTasks.filter(t => !t.isNote);
  const noteItems = filteredTasks.filter(t => t.isNote);
  const showTasks = state.workspaceContentMode !== 'notes';
  const showNotes = state.workspaceContentMode !== 'tasks';
  const activeTasks = taskItems.length;
  const labelColor = label.color || 'var(--notes-color)';

  const overdueCt = taskItems.filter(t => t.dueDate && t.dueDate < todayDate).length;
  const todayCt = taskItems.filter(t => t.today || t.dueDate === todayDate).length;
  const completionRate = activeTasks + completedTasks > 0 ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) : 0;

  const createPropsExpr = `labels: ['${label.id}']`;
  const filterExpr = `(t.labels||[]).includes('${label.id}')`;
  const filterArg = `{labelId:'${label.id}'}`;
  const filterObj = { labelId: label.id };

  return `
    <div class="flex-1 space-y-4">
      <!-- Label Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: color-mix(in srgb, ${labelColor} 12%, transparent)">
              <span class="w-5 h-5 rounded-full" style="background: ${labelColor}"></span>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${escapeHtml(label.name)}</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${activeTasks} active &middot; ${completedTasks} completed${noteItems.length > 0 ? ` &middot; ${noteItems.length} note${noteItems.length !== 1 ? 's' : ''}` : ''}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${labelColor}" stroke-width="2.5"
                  stroke-dasharray="${completionRate} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${completionRate}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${completedTasks} of ${activeTasks + completedTasks}</div>
            </div>
          </div>
          ${overdueCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${overdueCt} overdue
            </div>
          ` : ''}
          ${todayCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${todayCt} today
            </div>
          ` : ''}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote(${filterArg})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${labelColor}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? `<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>`
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${labelColor} 25%, transparent)"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${labelColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', labels: ['${label.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${label.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', labels: ['${label.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${label.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', labels: ['${label.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${label.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, labels: ['${label.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${label.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote(${filterArg})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${showTasks ? buildTaskSections(taskItems, todayDate, labelColor, createPropsExpr, filterExpr) : ''}
        ${showNotes ? buildNotesSection(noteItems, filterArg, filterObj) : ''}

        ${filteredTasks.length === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${labelColor} 6%, transparent)">
                <span class="w-10 h-10 rounded-full" style="background: ${labelColor}"></span>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${escapeHtml(label.name)}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${labelColor}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
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
// buildPersonTaskListHtml — Dedicated person landing page
// ============================================================================
export function buildPersonTaskListHtml(person, filteredTasks, todayDate) {
  if (!person) return '';

  const completedTasks = state.tasksData.filter(t => (t.people || []).includes(person.id) && t.completed && !t.isNote).length;
  const taskItems = filteredTasks.filter(t => !t.isNote);
  const noteItems = filteredTasks.filter(t => t.isNote);
  const showTasks = state.workspaceContentMode !== 'notes';
  const showNotes = state.workspaceContentMode !== 'tasks';
  const activeTasks = taskItems.length;
  const personColor = 'var(--accent)';

  const overdueCt = taskItems.filter(t => t.dueDate && t.dueDate < todayDate).length;
  const todayCt = taskItems.filter(t => t.today || t.dueDate === todayDate).length;
  const completionRate = activeTasks + completedTasks > 0 ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) : 0;

  const createPropsExpr = `people: ['${person.id}']`;
  const filterExpr = `(t.people||[]).includes('${person.id}')`;
  const filterArg = `{personId:'${person.id}'}`;
  const filterObj = { personId: person.id };

  return `
    <div class="flex-1 space-y-4">
      <!-- Person Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            ${person.photoData
              ? `<img src="${person.photoData}" alt="" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" referrerpolicy="no-referrer">`
              : `<div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${personColor} 12%, transparent); color: ${personColor}">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>`}
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${escapeHtml(person.name)}</h1>
              ${person.jobTitle || person.email ? `
                <p class="text-[var(--text-muted)] text-[13px] mt-1">${[person.jobTitle, person.email].filter(Boolean).map(v => escapeHtml(v)).join(' &middot; ')}</p>
              ` : ''}
              <p class="text-[var(--text-muted)] text-[13px] ${person.jobTitle || person.email ? '' : 'mt-1'}">${activeTasks} active &middot; ${completedTasks} completed${noteItems.length > 0 ? ` &middot; ${noteItems.length} note${noteItems.length !== 1 ? 's' : ''}` : ''}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${personColor}" stroke-width="2.5"
                  stroke-dasharray="${completionRate} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${completionRate}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${completedTasks} of ${activeTasks + completedTasks}</div>
            </div>
          </div>
          ${overdueCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${overdueCt} overdue
            </div>
          ` : ''}
          ${todayCt > 0 ? `
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${todayCt} today
            </div>
          ` : ''}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote(${filterArg})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${personColor}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? `<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>`
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${personColor} 25%, transparent)"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${personColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', people: ['${person.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${person.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', people: ['${person.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${person.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', people: ['${person.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${person.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, people: ['${person.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${person.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote(${filterArg})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${showTasks ? buildTaskSections(taskItems, todayDate, personColor, createPropsExpr, filterExpr) : ''}
        ${showNotes ? buildNotesSection(noteItems, filterArg, filterObj) : ''}

        ${filteredTasks.length === 0 ? `
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${personColor} 6%, transparent)">
                <svg class="w-10 h-10" style="color: ${personColor}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note for ${escapeHtml(person.name)}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${personColor}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
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
// buildAllLabelsHtml — Overview page listing all tags
// ============================================================================
export function buildAllLabelsHtml() {
  const icons = getActiveIcons();
  const activeTasks = state.tasksData.filter(t => !t.completed && !t.isNote);
  const labels = [...state.taskLabels].sort((a, b) => {
    const ac = activeTasks.filter(t => (t.labels || []).includes(a.id)).length;
    const bc = activeTasks.filter(t => (t.labels || []).includes(b.id)).length;
    return bc - ac || a.name.localeCompare(b.name);
  });

  return `
    <div class="flex-1 space-y-4">
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">All Tags</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${labels.length} tag${labels.length !== 1 ? 's' : ''}</p>
            </div>
            <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()"
              class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="Add Tag">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${labels.length === 0 ? `
          <div class="col-span-full py-12 text-center text-[var(--text-muted)]">
            <p class="text-sm font-medium mb-1">No tags yet</p>
            <p class="text-xs opacity-60">Create your first tag to organize tasks</p>
          </div>
        ` : labels.map(label => {
          const count = activeTasks.filter(t => (t.labels || []).includes(label.id)).length;
          const color = label.color || 'var(--notes-color)';
          return `
            <button onclick="showLabelTasks('${label.id}')"
              class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-4 text-left hover:border-[var(--border)] hover:shadow-sm transition group">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-4 h-4 rounded-full flex-shrink-0" style="background: ${color}"></span>
                <span class="font-medium text-[var(--text-primary)] text-[14px] truncate">${escapeHtml(label.name)}</span>
              </div>
              <p class="text-xs text-[var(--text-muted)]">${count} active task${count !== 1 ? 's' : ''}</p>
            </button>`;
        }).join('')}
      </div>
    </div>`;
}

// ============================================================================
// buildAllPeopleHtml — Overview page listing all people
// ============================================================================
export function buildAllPeopleHtml() {
  const icons = getActiveIcons();
  const activeTasks = state.tasksData.filter(t => !t.completed && !t.isNote);
  const people = [...state.taskPeople].sort((a, b) => {
    const ac = activeTasks.filter(t => (t.people || []).includes(a.id)).length;
    const bc = activeTasks.filter(t => (t.people || []).includes(b.id)).length;
    return bc - ac || a.name.localeCompare(b.name);
  });

  return `
    <div class="flex-1 space-y-4">
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">All People</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${people.length} ${people.length !== 1 ? 'people' : 'person'}</p>
            </div>
            <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()"
              class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="Add Person">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${people.length === 0 ? `
          <div class="col-span-full py-12 text-center text-[var(--text-muted)]">
            <p class="text-sm font-medium mb-1">No people yet</p>
            <p class="text-xs opacity-60">Add people to track delegated tasks</p>
          </div>
        ` : people.map(person => {
          const count = activeTasks.filter(t => (t.people || []).includes(person.id)).length;
          return `
            <button onclick="showPersonTasks('${person.id}')"
              class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-4 text-left hover:border-[var(--border)] hover:shadow-sm transition group">
              <div class="flex items-center gap-3 mb-2">
                ${renderPersonAvatar(person, 32)}
                <div class="min-w-0">
                  <span class="block font-medium text-[var(--text-primary)] text-[14px] truncate">${escapeHtml(person.name)}</span>
                  ${person.jobTitle ? `<span class="block text-[11px] text-[var(--text-muted)] truncate">${escapeHtml(person.jobTitle)}</span>` : ''}
                </div>
              </div>
              <p class="text-xs text-[var(--text-muted)]">${count} active task${count !== 1 ? 's' : ''}</p>
            </button>`;
        }).join('')}
      </div>
    </div>`;
}

// ============================================================================
// buildCustomPerspectiveTaskListHtml — Custom perspective landing page
// ============================================================================
export function buildCustomPerspectiveTaskListHtml(perspective, filteredTasks, todayDate) {
  if (!perspective) return '';

  const activeItems = filteredTasks.length;
  const perspColor = perspective.color || 'var(--accent)';

  return `
    <div class="flex-1 space-y-4">
      <!-- Perspective Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${perspColor} 12%, transparent); color: ${perspColor}">
              ${perspective.icon || '📌'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${escapeHtml(perspective.name)}</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${activeItems} item${activeItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center justify-end gap-2">
          <button onclick="window.openNewTaskModal()"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${perspColor}">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Task
          </button>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
            ${state.quickAddIsNote
              ? `<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>`
              : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${perspColor} 25%, transparent)"></div>`
            }
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${perspColor}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>

      <!-- Task List -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        ${filteredTasks.length > 0 ? `
          <div class="task-list">${filteredTasks.map(task => renderTaskItem(task)).join('')}</div>
        ` : `
          <div class="py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${perspColor} 6%, transparent); color: ${perspColor}">
                <span class="text-4xl">${perspective.icon || '📌'}</span>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No tasks</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">No tasks match this perspective's filters</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${perspColor}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add Task
              </button>
            </div>
          </div>
        `}
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

  // Review stale task count
  const STALE_DAYS = 7;
  const staleCutoff = new Date();
  staleCutoff.setDate(staleCutoff.getDate() - STALE_DAYS);
  const staleTaskCount = state.tasksData.filter(t => {
    if (t.completed || t.isNote || t.status === 'someday' || !t.areaId) return false;
    if (!t.lastReviewedAt) return true;
    return new Date(t.lastReviewedAt) < staleCutoff;
  }).length;

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
  const effectiveWorkspaceMode = state.activeFilterType === 'perspective' && state.activePerspective === 'notes'
    ? 'notes'
    : (state.workspaceContentMode || 'both');
  const isNotesLikeView = state.activePerspective === 'notes' || effectiveWorkspaceMode === 'notes';
  const isDesktopSidebarCollapsed = !!state.workspaceSidebarCollapsed;

  const workspaceModeControlHtml = (() => {
    const options = [
      { id: 'tasks', label: 'Tasks' },
      { id: 'both', label: 'Both' },
      { id: 'notes', label: 'Notes' }
    ];
    return `
      <div class="workspace-mode-control" role="group" aria-label="Workspace content mode">
        ${options.map(opt => {
          const isLocked = state.activeFilterType === 'perspective' && state.activePerspective === 'notes' && opt.id !== 'notes';
          const isActive = effectiveWorkspaceMode === opt.id;
          const click = isLocked ? '' : `window.state.workspaceContentMode='${opt.id}'; window.saveViewState(); window.render();`;
          return `
            <button
              type="button"
              ${isLocked ? 'disabled' : ''}
              onclick="${click}"
              class="workspace-mode-btn ${isActive ? 'active' : ''}"
              title="${isLocked ? 'All Notes view is locked to Notes mode' : `Show ${opt.label.toLowerCase()} only`}">
              ${opt.label}
            </button>
          `;
        }).join('')}
      </div>
    `;
  })();

  const selectedAreaId = state.activeFilterType === 'area'
    ? state.activeAreaFilter
    : (state.activeFilterType === 'subcategory'
      ? getCategoryById(state.activeCategoryFilter)?.areaId
      : null);
  const selectedCategoryId = state.activeFilterType === 'subcategory' ? state.activeCategoryFilter : null;

  const workspaceTopRailHtml = `
    <div class="workspace-shell bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] mb-4">
      <div class="workspace-shell-header px-4 py-3 border-b border-[var(--border-light)] flex flex-wrap items-center gap-3 justify-between">
        <div class="min-w-0">
          <div class="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Workspace</div>
          <div class="text-sm text-[var(--text-secondary)] truncate">Filter and mode controls</div>
        </div>
        ${workspaceModeControlHtml}
      </div>

      <div class="workspace-rail px-3 py-2 border-b border-[var(--border-light)]">
        <div class="workspace-rail-title">Views</div>
        <div class="workspace-chip-row">
          ${BUILTIN_PERSPECTIVES.map(p => `
            <button onclick="window.showPerspectiveTasks('${p.id}')" class="workspace-chip ${isPerspectiveActive(p.id) ? 'active' : ''}">
              <span class="workspace-chip-icon" style="color:${p.color}">${p.icon}</span>
              <span>${p.name}</span>
              <span class="workspace-chip-count">${taskCounts[p.id] || ''}</span>
            </button>
          `).join('')}
          <button onclick="window.showPerspectiveTasks('notes')" class="workspace-chip ${isPerspectiveActive('notes') ? 'active' : ''}">
            <span class="workspace-chip-icon" style="color:${NOTES_PERSPECTIVE.color}">${NOTES_PERSPECTIVE.icon}</span>
            <span>All Notes</span>
            <span class="workspace-chip-count">${taskCounts.notes || ''}</span>
          </button>
          ${state.customPerspectives.map(p => `
            <button onclick="window.showPerspectiveTasks('${p.id}')" class="workspace-chip ${isPerspectiveActive(p.id) ? 'active' : ''}">
              <span class="workspace-chip-icon">${p.icon || '📌'}</span>
              <span>${escapeHtml(p.name)}</span>
              <span class="workspace-chip-count">${taskCounts[p.id] || ''}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="workspace-rail px-3 py-2 border-b border-[var(--border-light)]">
        <div class="workspace-rail-title">Areas</div>
        <div class="workspace-chip-row workspace-chip-row-areas">
          <button onclick="window.showPerspectiveTasks('${state.activePerspective || 'inbox'}')" class="workspace-area-chip ${!selectedAreaId ? 'active' : ''}">
            <span class="workspace-area-name">All Areas</span>
          </button>
          ${state.taskAreas.map(area => `
            <button onclick="window.showAreaTasks('${area.id}')" class="workspace-area-chip ${isAreaActive(area.id) || selectedAreaId === area.id ? 'active' : ''}" style="--area-color:${area.color || 'var(--accent)'}">
              <span class="workspace-area-emoji">${area.emoji || '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'}</span>
              <span class="workspace-area-name">${escapeHtml(area.name)}</span>
              <span class="workspace-area-count">${categoryCounts[area.id] || ''}</span>
            </button>
          `).join('')}
        </div>
      </div>

      ${selectedAreaId ? `
      <div class="workspace-rail px-3 py-2 border-b border-[var(--border-light)]">
        <div class="workspace-rail-title">Categories</div>
        <div class="workspace-chip-row">
          <button onclick="window.showAreaTasks('${selectedAreaId}')" class="workspace-chip ${!selectedCategoryId ? 'active' : ''}">
            All in ${escapeHtml(getAreaById(selectedAreaId)?.name || 'Area')}
          </button>
          ${getCategoriesByArea(selectedAreaId).map(subcat => `
            <button onclick="window.showCategoryTasks('${subcat.id}')" class="workspace-chip ${isSubcatActive(subcat.id) ? 'active' : ''}">
              <span class="workspace-chip-icon">${subcat.emoji || '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</span>
              <span>${escapeHtml(subcat.name)}</span>
            </button>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="workspace-rail px-3 py-2">
        <details class="workspace-overflow">
          <summary class="workspace-overflow-summary">More Filters</summary>
          <div class="workspace-overflow-grid">
            <div>
              <div class="workspace-overflow-title">Tags</div>
              <div class="workspace-overflow-list">
                ${state.taskLabels.map(label => `
                  <button onclick="window.showLabelTasks('${label.id}')" class="workspace-overflow-item ${isLabelActive(label.id) ? 'active' : ''}">
                    <span class="workspace-dot" style="background:${label.color || 'var(--text-muted)'}"></span>
                    <span>${escapeHtml(label.name)}</span>
                    <span class="workspace-chip-count">${labelCounts[label.id] || ''}</span>
                  </button>
                `).join('')}
              </div>
            </div>
            <div>
              <div class="workspace-overflow-title">People</div>
              <div class="workspace-overflow-list">
                ${state.taskPeople.map(person => `
                  <button onclick="window.showPersonTasks('${person.id}')" class="workspace-overflow-item ${isPersonActive(person.id) ? 'active' : ''}">
                    <span>👤</span>
                    <span>${escapeHtml(person.name)}</span>
                    <span class="workspace-chip-count">${peopleCounts[person.id] || ''}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  `;

  // Build sidebar
  const sidebarHtml = `
    <div class="w-full md:w-64 flex-shrink-0 space-y-3">
      <!-- Tasks Section -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tasks</h3>
        </div>
        <div class="py-2 px-2">
          ${BUILTIN_PERSPECTIVES.map(p => `
            <button onclick="window.showPerspectiveTasks('${p.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${isPerspectiveActive(p.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${p.color}">${p.icon}</span>
              <span class="flex-1 text-[14px] ${isPerspectiveActive(p.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${p.name}</span>
              <span class="count-badge min-w-[20px] text-right text-xs ${isPerspectiveActive(p.id) ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}">${taskCounts[p.id] || ''}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Notes Section -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Notes</h3>
        </div>
        <div class="py-2 px-2">
          <button onclick="window.showPerspectiveTasks('notes')"
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${isPerspectiveActive('notes') ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${NOTES_PERSPECTIVE.color}">${NOTES_PERSPECTIVE.icon}</span>
            <span class="flex-1 text-[14px] ${isPerspectiveActive('notes') ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">All Notes</span>
            <span class="count-badge min-w-[20px] text-right text-xs ${isPerspectiveActive('notes') ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}">${taskCounts['notes'] || ''}</span>
          </button>
        </div>
      </div>

      <!-- Review -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="py-2 px-2">
          <button onclick="window.startReview()"
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${state.reviewMode ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: var(--success)">${getActiveIcons().review}</span>
            <span class="flex-1 text-[14px] ${state.reviewMode ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">Review</span>
            ${staleTaskCount > 0 ? `<span class="count-badge min-w-[20px] text-right text-xs text-[var(--text-muted)]">${staleTaskCount}</span>` : ''}
          </button>
        </div>
      </div>

      <!-- Custom Perspectives -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Custom Views</h3>
          <button onclick="window.showPerspectiveModal=true; window.render()" aria-label="Add new custom view" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.customPerspectives.length > 0 ? state.customPerspectives.map(p => `
            <button onclick="window.showPerspectiveTasks('${p.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative transition-all ${isPerspectiveActive(p.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-lg text-[var(--text-muted)]">${p.icon}</span>
              <span class="flex-1 text-[14px] ${isPerspectiveActive(p.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(p.name)}</span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${taskCounts[p.id] || ''}</span>
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
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Areas</h3>
          <button onclick="window.editingAreaId=null; window.showAreaModal=true; window.render()" aria-label="Add new area" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${state.taskAreas.map(cat => {
            const subcats = getCategoriesByArea(cat.id);
            const isCollapsed = state.collapsedSidebarAreas.has(cat.id);
            const hasSubcats = subcats.length > 0;
            const areaEmoji = cat.emoji || '';
            return `
              <div onclick="window.showAreaTasks('${cat.id}')"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showAreaTasks('${cat.id}');}"
                tabindex="0"
                role="button"
                aria-label="View ${escapeHtml(cat.name)} area"
                class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isAreaActive(cat.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}"
                draggable="true"
                data-id="${cat.id}"
                data-type="area">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm relative" style="background: ${cat.color}20; color: ${cat.color}">
                  ${areaEmoji || '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'}
                  ${hasSubcats ? `
                    <span onclick="event.stopPropagation(); window.toggleSidebarAreaCollapse('${cat.id}')"
                      class="absolute inset-0 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <svg class="w-3.5 h-3.5 transition-transform ${isCollapsed ? '' : 'rotate-90'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  ` : ''}
                </span>
                <span class="flex-1 text-[14px] truncate ${isAreaActive(cat.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(cat.name)}</span>
                <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${categoryCounts[cat.id] || ''}</span>
                <span onclick="event.stopPropagation(); window.editingAreaId='${cat.id}'; window.showAreaModal=true; window.render()"
                  class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
              </div>
            ${!isCollapsed ? `
              ${subcats.map(subcat => {
                const subcatEmoji = subcat.emoji || '';
                return `
                <div onclick="window.showCategoryTasks('${subcat.id}')"
                  class="sidebar-item w-full pl-10 pr-3 py-1.5 flex items-center gap-2.5 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isSubcatActive(subcat.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}">
                  <span class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs" style="background: ${subcat.color}20; color: ${subcat.color}">
                    ${subcatEmoji || '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'}
                  </span>
                  <span class="flex-1 text-[13px] truncate ${isSubcatActive(subcat.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(subcat.name)}</span>
                  <span onclick="event.stopPropagation(); window.editingCategoryId='${subcat.id}'; window.showCategoryModal=true; window.render()"
                    class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
                </div>
              `}).join('')}
              ${isAreaActive(cat.id) ? `
              <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${cat.id}'; window.render()"
                class="w-full pl-10 pr-3 py-1 flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add Category
              </button>
              ` : ''}
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
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tags${labelsWithTasks.length > 0 ? ` (${labelsWithTasks.length})` : ''}</h3>
          <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()" aria-label="Add new tag" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${displayLabels.length === 0 ? `<div class="px-3 py-2 text-xs text-[var(--text-muted)]">No tags yet</div>` : displayLabels.map(label => `
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
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${labelCounts[label.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editingLabelId='${label.id}'; window.showLabelModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join('')}
          ${hiddenCount > 0 ? `
          <button onclick="window.showAllLabelsPage()"
            class="w-full px-3 py-2 text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${state.taskLabels.length} tags
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
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">People${peopleWithTasks.length > 0 ? ` (${peopleWithTasks.length})` : ''}</h3>
          <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()" aria-label="Add new person" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${displayPeople.length === 0 ? `<div class="px-3 py-2 text-xs text-[var(--text-muted)]">No people yet</div>` : displayPeople.map(person => `
            <div onclick="window.showPersonTasks('${person.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showPersonTasks('${person.id}');}"
              tabindex="0"
              role="button"
              aria-label="View tasks for ${escapeHtml(person.name)}"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${isPersonActive(person.id) ? 'active bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-secondary)]'}"
              draggable="true"
              data-id="${person.id}"
              data-type="person">
              ${renderPersonAvatar(person, 24)}
              <span class="flex-1 min-w-0">
                <span class="block text-[14px] truncate ${isPersonActive(person.id) ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}">${escapeHtml(person.name)}</span>
                ${person.jobTitle ? `<span class="block text-[11px] truncate text-[var(--text-muted)]">${escapeHtml(person.jobTitle)}</span>` : ''}
              </span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${peopleCounts[person.id] || ''}</span>
              <span onclick="event.stopPropagation(); window.editingPersonId='${person.id}'; window.showPersonModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join('')}
          ${hiddenCount > 0 ? `
          <button onclick="window.showAllPeoplePage()"
            class="w-full px-3 py-2 text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${state.taskPeople.length} people
          </button>` : ''}
        </div>
      </div>`;
      })()}
    </div>
  `;

  // Check if viewing an area or category - render special views
  const isAreaView = state.activeFilterType === 'area' && state.activeAreaFilter;
  const isCategoryView = state.activeFilterType === 'subcategory' && state.activeCategoryFilter;
  const isLabelView = state.activeFilterType === 'label' && state.activeLabelFilter;
  const isPersonView = state.activeFilterType === 'person' && state.activePersonFilter;
  const isAllLabelsView = state.activeFilterType === 'all-labels';
  const isAllPeopleView = state.activeFilterType === 'all-people';
  const isCustomPerspective = state.activeFilterType === 'perspective' && state.customPerspectives.find(p => p.id === state.activePerspective);
  const currentArea = isAreaView ? getAreaById(state.activeAreaFilter) : null;
  const currentSubcategory = isCategoryView ? getCategoryById(state.activeCategoryFilter) : null;

  // Build task list — dedicated landing pages for each entity type
  let taskListHtml;
  if (state.reviewMode) {
    taskListHtml = typeof window.renderReviewMode === 'function' ? window.renderReviewMode() : '<div class="p-8 text-center text-[var(--text-muted)]">Loading review mode...</div>';
  } else if (isAllLabelsView) {
    taskListHtml = buildAllLabelsHtml();
  } else if (isAllPeopleView) {
    taskListHtml = buildAllPeopleHtml();
  } else if (isAreaView) {
    taskListHtml = buildAreaTaskListHtml(currentArea, filteredTasks, todayDate);
  } else if (isCategoryView) {
    taskListHtml = buildCategoryTaskListHtml(currentSubcategory, filteredTasks, todayDate);
  } else if (isLabelView) {
    taskListHtml = buildLabelTaskListHtml(getLabelById(state.activeLabelFilter), filteredTasks, todayDate);
  } else if (isPersonView) {
    taskListHtml = buildPersonTaskListHtml(getPersonById(state.activePersonFilter), filteredTasks, todayDate);
  } else if (isCustomPerspective) {
    taskListHtml = buildCustomPerspectiveTaskListHtml(isCustomPerspective, filteredTasks, todayDate);
  } else {
    taskListHtml = `
    <div class="flex-1">
      <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)]">
        <div class="task-list-header-desktop px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl" ${viewInfo.color ? `style="color: ${viewInfo.color}"` : ''}>${viewInfo.icon}</span>
            <div>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">${viewInfo.name}</h2>
              ${viewInfo.jobTitle || viewInfo.email ? `<p class="text-sm text-[var(--text-muted)]">${[viewInfo.jobTitle, viewInfo.email].filter(Boolean).join(' \u00B7 ')}</p>` : ''}
            </div>
          </div>
          <button onclick="window.openNewTaskModal()"
            class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="${isNotesLikeView ? 'Add Note' : 'Add Task'}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        ${state.activePerspective !== 'upcoming' ? `
        <!-- Quick Add Input -->
        <div class="quick-add-section px-4 py-3 border-b border-[var(--border-light)]">
          <div class="flex items-center gap-3">
            ${isNotesLikeView ? `
              <div class="w-2 h-2 rounded-full border-2 border-dashed border-[var(--notes-color)]/40 flex-shrink-0 ml-1.5"></div>
            ` : `
              <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
                class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
                ${state.quickAddIsNote
                  ? `<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>`
                  : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>`
                }
              </div>
            `}
            <input type="text" id="quick-add-input"
              placeholder="${isNotesLikeView || state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
              onkeydown="window.handleQuickAddKeydown(event, this)"
              class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition p-1" title="${isNotesLikeView || state.quickAddIsNote ? 'Add Note' : 'Add to ' + viewInfo.name}">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
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
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)] z-10">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${group.label}</span>
                  </div>
                  <div>
                    ${group.dueTasks.length > 0 ? `
                      ${group.deferTasks.length > 0 ? '<div class="px-5 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--warning)]">Due</div>' : ''}
                      ${group.dueTasks.map(task => renderTaskItem(task, false)).join('')}
                    ` : ''}
                    ${group.deferTasks.length > 0 ? `
                      <div class="px-5 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Starting</div>
                      ${group.deferTasks.map(task => renderTaskItem(task, false)).join('')}
                    ` : ''}
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
            const nextLabel = state.taskLabels.find(l => l.name.trim().toLowerCase() === 'next');

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
              const isDatedTask = t.today || t.dueDate === today || (t.dueDate && t.dueDate < today);
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
                '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
                'Due', 'var(--overdue-color)')}
              ${todayStatusTasks.length > 0 ? `
                <div class="${dueTasks.length > 0 ? 'mt-2' : ''}">
                  ${todayStatusTasks.map(task => renderTaskItem(task)).join('')}
                </div>
              ` : ''}
              ${renderSection(startingTasks,
                '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
                'Starting', 'var(--accent)', dueTasks.length > 0 || todayStatusTasks.length > 0 ? 'mt-2' : '')}
              ${renderSection(nextTasks, getActiveIcons().next, 'Next', 'var(--notes-color)',
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
                      <span class="w-2 h-2 rounded-full" style="background:${activeNotesCategory.color || 'var(--notes-color)'}"></span>
                      ${escapeHtml(activeNotesCategory.name)}
                    </span>
                  ` : ''}
                  <span class="text-xs text-[var(--text-muted)]">${taskCounts['notes'] || 0} notes</span>
                </div>
                <button onclick="window.createRootNote(${state.activeAreaFilter ? `'${state.activeAreaFilter}'` : 'null'})"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
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
              ${filteredTasks.map(task => renderTaskItem(task)).join('')}
            </div>
          `))))}
        </div>
      </div>
    </div>
  `;
  }

  return `
    <!-- Mobile Sidebar Drawer (hidden on desktop) -->
    <div id="mobile-sidebar-overlay" class="mobile-sidebar-overlay md:hidden ${state.mobileDrawerOpen ? 'show' : ''}" onclick="if(event.target===this) closeMobileDrawer()" role="dialog" aria-modal="true" aria-hidden="${state.mobileDrawerOpen ? 'false' : 'true'}" aria-label="Workspace sidebar">
      <div class="mobile-sidebar-drawer" onclick="event.stopPropagation()">
        <div class="p-4 border-b border-[var(--border-light)]" style="padding-top: max(16px, env(safe-area-inset-top));">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-[var(--text-primary)]">Workspace</h2>
            <button id="mobile-drawer-close" onclick="closeMobileDrawer()" class="w-11 h-11 flex items-center justify-center rounded-full text-[var(--text-muted)] active:bg-[var(--bg-secondary)] transition" aria-label="Close sidebar">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          ${workspaceModeControlHtml}
        </div>
        ${sidebarHtml.replace('w-full md:w-64', 'w-full')}
      </div>
    </div>

    ${state.reviewMode ? `
    <div class="flex-1">
      ${taskListHtml}
    </div>
    ` : `
    <div class="flex flex-col md:flex-row gap-6">
      ${!isDesktopSidebarCollapsed ? `
      <div class="hidden md:block">
        <div class="workspace-sidebar-toolbar mb-3 flex items-center gap-2">
          <div class="workspace-sidebar-mode">${workspaceModeControlHtml}</div>
          <button
            onclick="window.toggleWorkspaceSidebar()"
            class="workspace-sidebar-toggle-btn"
            title="Collapse workspace sidebar"
            aria-label="Collapse workspace sidebar">
            Collapse
          </button>
        </div>
        ${sidebarHtml}
      </div>
      ` : ''}

      <div class="flex-1 space-y-3">
        ${isDesktopSidebarCollapsed ? `
        <div class="hidden md:block">
          <button
            onclick="window.toggleWorkspaceSidebar()"
            class="workspace-sidebar-show-btn"
            title="Show workspace sidebar"
            aria-label="Show workspace sidebar">
            Show Sidebar
          </button>
        </div>
        ` : ''}
        <div class="md:hidden mb-2">${workspaceModeControlHtml}</div>
        ${taskListHtml}
      </div>
    </div>
    `}
  `;
}
