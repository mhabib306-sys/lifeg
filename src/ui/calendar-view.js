// ============================================================================
// CALENDAR VIEW MODULE
// ============================================================================
// Renders the OmniFocus Forecast-style calendar view with month grid,
// task dots (due/defer/overdue), and selected day task list.

import { state } from '../state.js';
import { getTasksForDate } from '../features/calendar.js';
import { THINGS3_ICONS } from '../constants.js';
import { escapeHtml, getLocalDateString } from '../utils.js';

/**
 * Render the full calendar view.
 *
 * Builds a month grid with day cells, each showing colored dots for tasks:
 *   - Red dots: due tasks
 *   - Blue dots: defer (start) tasks
 *   - Dark red dots: overdue tasks
 *
 * Below the grid, shows the selected day's tasks split into "Due" and "Starting" sections.
 * Uses state.calendarMonth (0-11), state.calendarYear, state.calendarSelectedDate.
 *
 * @returns {string} HTML string for the calendar perspective view
 */
export function renderCalendarView() {
  const today = getLocalDateString();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build calendar grid
  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1);
  const lastDay = new Date(state.calendarYear, state.calendarMonth + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  // Previous month padding
  const prevMonthLast = new Date(state.calendarYear, state.calendarMonth, 0).getDate();
  const cells = [];

  // Add previous month days
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    const m = state.calendarMonth === 0 ? 12 : state.calendarMonth;
    const y = state.calendarMonth === 0 ? state.calendarYear - 1 : state.calendarYear;
    const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells.push({ day: d, dateStr, outside: true });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cells.push({ day: d, dateStr, outside: false });
  }

  // Next month padding to fill grid
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = state.calendarMonth === 11 ? 1 : state.calendarMonth + 2;
      const y = state.calendarMonth === 11 ? state.calendarYear + 1 : state.calendarYear;
      const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push({ day: d, dateStr, outside: true });
    }
  }

  // Build a map of date -> tasks for the visible range
  const dateTaskMap = {};
  cells.forEach(cell => {
    dateTaskMap[cell.dateStr] = getTasksForDate(cell.dateStr);
  });

  // Selected date tasks
  const selectedTasks = getTasksForDate(state.calendarSelectedDate);
  const dueTasks = selectedTasks.filter(t => t.dueDate === state.calendarSelectedDate);
  const deferTasks = selectedTasks.filter(t => t.deferDate === state.calendarSelectedDate && t.dueDate !== state.calendarSelectedDate);
  const isToday = state.calendarSelectedDate === today;
  const activeTasks = state.tasksData.filter(t => !t.completed && !t.isNote);
  const todayTasks = isToday ? activeTasks.filter(t => t.today || t.dueDate === today || t.deferDate === today) : [];
  const nextLabel = state.taskLabels.find(l => l.name.toLowerCase() === 'next');
  const nextTasks = nextLabel ? activeTasks.filter(t => {
    if (!(t.labels || []).includes(nextLabel.id)) return false;
    const isDated = t.dueDate || t.deferDate || t.today;
    return !isDated;
  }) : [];

  // Format selected date label
  const selDate = new Date(state.calendarSelectedDate + 'T12:00:00');
  const selectedLabel = isToday ? 'Today' :
    selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const selectedCount = isToday ? todayTasks.length : selectedTasks.length;

  const calendarHtml = `
    <div class="calendar-grid">
      ${dayNames.map(d => `<div class="calendar-header-cell">${d}</div>`).join('')}
      ${cells.map(cell => {
        const tasks = dateTaskMap[cell.dateStr] || [];
        const isCellToday = cell.dateStr === today;
        const isSelected = cell.dateStr === state.calendarSelectedDate;
        const cellTasks = tasks.filter(t => t.dueDate === cell.dateStr || t.deferDate === cell.dateStr);
        const classes = ['calendar-day'];
        if (cell.outside) classes.push('outside');
        if (isCellToday) classes.push('today');
        if (isSelected) classes.push('selected');

        return `<div class="${classes.join(' ')}" onclick="calendarSelectDate('${cell.dateStr}')">
          <div class="calendar-day-num">${cell.day}</div>
          ${cellTasks.length > 0 ? `
            <div class="calendar-task-list">
              ${cellTasks.slice(0, 3).map(t => {
                const isDue = t.dueDate === cell.dateStr;
                const isOver = isDue && t.dueDate < today;
                const cls = isOver ? 'overdue' : isDue ? 'due' : 'defer';
                return `<div class="calendar-task-line ${cls}">${escapeHtml(t.title)}</div>`;
              }).join('')}
              ${cellTasks.length > 3 ? cellTasks.slice(3).map(t => {
                const isDue = t.dueDate === cell.dateStr;
                const isOver = isDue && t.dueDate < today;
                const cls = isOver ? 'overdue' : isDue ? 'due' : 'defer';
                return `<div class="calendar-task-line ${cls}">${escapeHtml(t.title)}</div>`;
              }).join('') : ''}
            </div>
          ` : ''}
        </div>`;
      }).join('')}
    </div>
  `;

  // renderTaskItem is called via window since it may not be extracted yet
  const renderTaskItem = window.renderTaskItem || ((task) => `<div class="px-5 py-2 text-sm text-[var(--text-primary)]">${escapeHtml(task.title)}</div>`);

  return `
    <div class="flex-1">
      <div class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)]">
        <!-- Calendar Header -->
        <div class="px-5 py-4 flex items-center justify-between border-b border-[var(--border-light)]">
          <div class="flex items-center gap-3">
            <span class="text-2xl" style="color: #8B5CF6">${THINGS3_ICONS.calendar}</span>
            <h2 class="text-xl font-semibold text-[var(--text-primary)]">Calendar</h2>
          </div>
          <button onclick="openNewTaskModal()"
            class="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center hover:bg-coralDark transition shadow-sm" title="Add Task">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>

        <!-- Month Navigation -->
        <div class="px-5 py-3 flex items-center justify-between border-b border-[var(--border-light)]">
          <button onclick="calendarPrevMonth()" class="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center transition text-[var(--text-secondary)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <div class="flex items-center gap-3">
            <h3 class="text-[16px] font-semibold text-[var(--text-primary)]">${monthNames[state.calendarMonth]} ${state.calendarYear}</h3>
            <button onclick="calendarGoToday()" class="text-xs px-2 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition font-medium">Today</button>
          </div>
          <button onclick="calendarNextMonth()" class="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center transition text-[var(--text-secondary)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="px-2 pt-2 pb-1">
          ${calendarHtml}
        </div>

        <!-- Selected Day Tasks -->
        <div class="border-t border-[var(--border-light)]">
          <div class="px-5 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h4 class="text-[14px] font-semibold text-[var(--text-primary)]">${selectedLabel}</h4>
              ${selectedCount > 0 ? `<span class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] font-medium">${selectedCount}</span>` : ''}
            </div>
            ${!isToday ? `
              <div class="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#EF5350] inline-block"></span>Due</span>
                <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#42A5F5] inline-block"></span>Start</span>
              </div>
            ` : ''}
          </div>
          <div class="min-h-[120px]">
            ${selectedCount === 0 ? `
              <div class="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                <svg class="w-10 h-10 mb-2 opacity-30" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>
                <p class="text-[14px]">No tasks on this date</p>
              </div>
            ` : `
              ${isToday ? `
                <div class="px-5 py-1">
                  <div class="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Today</div>
                </div>
                ${todayTasks.map(task => renderTaskItem(task, false)).join('')}
                ${nextTasks.length > 0 ? `
                  <div class="px-5 py-1 mt-3">
                    <div class="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Next</div>
                  </div>
                  ${nextTasks.map(task => renderTaskItem(task)).join('')}
                ` : ''}
              ` : `
                ${dueTasks.length > 0 ? `
                  <div class="px-5 py-1">
                    <div class="text-[11px] font-semibold text-[#EF5350] uppercase tracking-wider mb-1">Due</div>
                  </div>
                  ${dueTasks.map(task => renderTaskItem(task, false)).join('')}
                ` : ''}
                ${deferTasks.length > 0 ? `
                  <div class="px-5 py-1 ${dueTasks.length > 0 ? 'mt-2' : ''}">
                    <div class="text-[11px] font-semibold text-[#42A5F5] uppercase tracking-wider mb-1">Starting</div>
                  </div>
                  ${deferTasks.map(task => renderTaskItem(task)).join('')}
                ` : ''}
              `}
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}
