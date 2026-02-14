// ============================================================================
// CALENDAR VIEW MODULE — Grid rendering & sidebar
// ============================================================================
// Meeting notes, event actions, and discussion pool logic live in
// calendar-meeting.js.  This file renders the calendar grid + sidebar.

import { state } from '../state.js';
import { getTasksForDate } from '../features/calendar.js';
import { THINGS3_ICONS, getActiveIcons } from '../constants.js';
import { escapeHtml, getLocalDateString, formatEventTime, isMobileViewport } from '../utils.js';
import {
  hasMeetingNotes, q, getSelectedModalEvent,
  renderMeetingNotesPage, renderEventActionsModal
} from './calendar-meeting.js';

// Re-export everything from calendar-meeting.js so bridge.js can import
// meeting-related functions from either file for backwards compatibility.
export {
  openCalendarEventActions,
  closeCalendarEventActions,
  openCalendarMeetingNotes,
  openCalendarMeetingNotesByEventKey,
  openCalendarMeetingWorkspaceByEventKey,
  closeCalendarMeetingNotes,
  setCalendarMeetingNotesScope,
  convertCalendarEventToTask,
  startCalendarEventDrag,
  clearCalendarEventDrag,
  dropCalendarEventToSlot,
  addMeetingLinkedItem,
  addDiscussionItemToMeeting,
  handleMeetingItemInputKeydown
} from './calendar-meeting.js';

export { toggleCalendarMobilePanel } from './calendar-meeting.js';

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

const formatEventTimeLabel = formatEventTime;

function renderCalendarSidebarTaskItem(task) {
  const title = escapeHtml(task.title || 'Untitled task');
  const due = task.dueDate ? escapeHtml(task.dueDate) : '';
  const dueBadge = due ? `<span class="text-[10px] text-[var(--text-muted)]">${due}</span>` : '';
  return `
    <div class="px-4 py-2.5 border-b border-[var(--border-light)]/60 last:border-b-0">
      <div class="flex items-start gap-2.5">
        <button
          onclick="event.stopPropagation(); window.toggleTaskComplete('${q(task.id)}')"
          class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] flex-shrink-0 flex items-center justify-center transition-all"
          aria-label="Mark task complete: ${title}">
        </button>
        <button
          onclick="window.inlineEditingTaskId=null; window.editingTaskId='${q(task.id)}'; window.showTaskModal=true; window.render()"
          class="flex-1 min-w-0 text-left">
          <div class="text-[14px] leading-snug text-[var(--text-primary)] break-words">${title}</div>
          ${dueBadge}
        </button>
      </div>
    </div>
  `;
}

function dateToStr(dateObj) {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

// ============================================================================
// renderCalendarView — main export
// ============================================================================

/**
 * Render the full calendar view.
 * @returns {string} HTML string for the calendar tab
 */
export function renderCalendarView() {
  if (state.calendarMeetingNotesEventKey) {
    return renderMeetingNotesPage();
  }
  const isMobile = isMobileViewport();

  const today = getLocalDateString();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1);
  const lastDay = new Date(state.calendarYear, state.calendarMonth + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonthLast = new Date(state.calendarYear, state.calendarMonth, 0).getDate();
  const cells = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    const m = state.calendarMonth === 0 ? 12 : state.calendarMonth;
    const y = state.calendarMonth === 0 ? state.calendarYear - 1 : state.calendarYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, outside: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, outside: false });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = state.calendarMonth === 11 ? 1 : state.calendarMonth + 2;
      const y = state.calendarMonth === 11 ? state.calendarYear + 1 : state.calendarYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr, outside: true });
    }
  }

  const dateTaskMap = {};
  cells.forEach(cell => {
    dateTaskMap[cell.dateStr] = getTasksForDate(cell.dateStr);
  });

  const selectedTasks = getTasksForDate(state.calendarSelectedDate);
  const dueTasks = selectedTasks.filter(t => t.dueDate === state.calendarSelectedDate);
  const deferTasks = selectedTasks.filter(t => t.deferDate === state.calendarSelectedDate && t.dueDate !== state.calendarSelectedDate);
  const isToday = state.calendarSelectedDate === today;
  const activeTasks = state.tasksData.filter(t => !t.completed && !t.isNote);
  const todayTasks = isToday ? activeTasks.filter(t => {
    const isDueToday = t.dueDate === today;
    const isOverdue = t.dueDate && t.dueDate < today;
    const isScheduledForToday = t.deferDate && t.deferDate <= today;
    return t.today || isDueToday || isOverdue || isScheduledForToday;
  }) : [];

  const gcalEvents = window.getGCalEventsForDate?.(state.calendarSelectedDate) || [];
  const monthBtnLabel = isMobile ? 'M' : 'Month';
  const weekBtnLabel = isMobile ? 'W' : 'Week';
  const threeDayBtnLabel = isMobile ? '3D' : '3 Days';
  const dayGridBtnLabel = isMobile ? 'Day' : 'Day Timeline';
  const weekGridBtnLabel = isMobile ? 'Week TL' : 'Week Timeline';
  const viewLabelMap = {
    month: `${monthNames[state.calendarMonth]} ${state.calendarYear}`,
    week: 'Week View',
    '3days': '3-Day View',
    daygrid: 'Day Timeline',
    weekgrid: 'Week Timeline',
  };

  const selDate = new Date(state.calendarSelectedDate + 'T12:00:00');
  const selectedLabel = isToday ? 'Today' :
    selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const buildMonthGrid = () => `
    <div class="calendar-grid">
      ${dayNames.map(d => `<div class="calendar-header-cell">${d}</div>`).join('')}
      ${cells.map(cell => {
        const tasks = dateTaskMap[cell.dateStr] || [];
        const cellEvents = window.getGCalEventsForDate?.(cell.dateStr) || [];
        const isCellToday = cell.dateStr === today;
        const isSelected = cell.dateStr === state.calendarSelectedDate;
        const cellTasks = tasks.filter(t => t.dueDate === cell.dateStr || t.deferDate === cell.dateStr);
        const classes = ['calendar-day'];
        if (cell.outside) classes.push('outside');
        if (isCellToday) classes.push('today');
        if (isSelected) classes.push('selected');
        const stackCount = cellTasks.length + cellEvents.length;
        const maxHeight = isMobile ? 190 : 260;
        const dynamicMinHeight = Math.min(maxHeight, Math.max(94, 48 + (stackCount * 17)));

        return `<div class="${classes.join(' ')}" style="min-height:${dynamicMinHeight}px" onclick="calendarSelectDate('${cell.dateStr}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); calendarSelectDate('${cell.dateStr}');}">
          <div class="calendar-day-num">${cell.day}</div>
          ${(cellTasks.length + cellEvents.length) > 0 ? `
            <div class="calendar-task-list">
              ${cellTasks.map(t => {
                const isDue = t.dueDate === cell.dateStr;
                const isOver = isDue && t.dueDate < today;
                const cls = isOver ? 'overdue' : isDue ? 'due' : 'defer';
                return `<div class="calendar-task-line ${cls}">${escapeHtml(t.title)}</div>`;
              }).join('')}
              ${cellEvents.map(e => {
                const withNotes = hasMeetingNotes(e);
                return `<div class="calendar-task-line event ${withNotes ? 'with-notes' : ''}" onclick="event.stopPropagation(); openCalendarEventActions('${q(e.calendarId)}','${q(e.id)}')">${withNotes ? '<span class="calendar-line-note-indicator"></span>' : ''}${escapeHtml(e.summary)}</div>`;
              }).join('')}
            </div>
          ` : ''}
        </div>`;
      }).join('')}
    </div>
  `;

  const selectedDateObj = new Date(state.calendarSelectedDate + 'T12:00:00');
  const rangeDates = [];
  if (state.calendarViewMode === 'week') {
    const start = new Date(selectedDateObj);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      rangeDates.push(d);
    }
  } else if (state.calendarViewMode === '3days') {
    for (let i = -1; i <= 1; i++) {
      const d = new Date(selectedDateObj);
      d.setDate(d.getDate() + i);
      rangeDates.push(d);
    }
  }

  const buildRangeGrid = () => `
    <div class="calendar-range-grid calendar-range-grid-${rangeDates.length}">
      ${rangeDates.map(d => {
        const dateStr = dateToStr(d);
        const tasks = getTasksForDate(dateStr).filter(t => t.dueDate === dateStr || t.deferDate === dateStr);
        const events = window.getGCalEventsForDate?.(dateStr) || [];
        const isSelected = dateStr === state.calendarSelectedDate;
        const isTodayDay = dateStr === today;
        const allItems = [
          ...tasks.map(t => ({ type: 'task', task: t })),
          ...events.map(e => ({ type: 'event', event: e }))
        ];

        return `
          <div class="calendar-range-day ${isSelected ? 'selected' : ''}" onclick="calendarSelectDate('${dateStr}')">
            <div class="calendar-range-day-head ${isTodayDay ? 'today' : ''}">
              <div class="calendar-range-day-name">${d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div class="calendar-range-day-date">${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
            <div class="calendar-range-day-list">
              ${allItems.length === 0
                ? '<div class="calendar-range-empty">No items</div>'
                : allItems.map(item => {
                  if (item.type === 'event') {
                    const withNotes = hasMeetingNotes(item.event);
                    return `<div class="calendar-task-line event ${withNotes ? 'with-notes' : ''}" onclick="event.stopPropagation(); openCalendarEventActions('${q(item.event.calendarId)}','${q(item.event.id)}')">${withNotes ? '<span class="calendar-line-note-indicator"></span>' : ''}${escapeHtml(item.event.summary)}</div>`;
                  }
                  const t = item.task;
                  const isDue = t.dueDate === dateStr;
                  const isOver = isDue && t.dueDate < today;
                  const cls = isOver ? 'overdue' : isDue ? 'due' : 'defer';
                  return `<div class="calendar-task-line ${cls}">${escapeHtml(t.title)}</div>`;
                }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const buildTimeGrid = () => {
    const dayDates = [];
    if (state.calendarViewMode === 'daygrid') {
      dayDates.push(new Date(selectedDateObj));
    } else {
      const start = new Date(selectedDateObj);
      start.setDate(start.getDate() - start.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dayDates.push(d);
      }
    }
    const hours = Array.from({ length: 18 }, (_, i) => i + 6);
    const isMobileTimeline = isMobileViewport();
    const todayIdx = dayDates.findIndex(d => dateToStr(d) === today);
    const selectedIdx = dayDates.findIndex(d => dateToStr(d) === state.calendarSelectedDate);
    const mobileDayIdx = selectedIdx >= 0 ? selectedIdx : (todayIdx >= 0 ? todayIdx : 0);
    const timelineDays = isMobileTimeline && dayDates.length > 1 ? [dayDates[mobileDayIdx]] : dayDates;
    const timeCol = isMobileTimeline ? '44px' : '56px';
    const colClass = timelineDays.length === 1
      ? `grid-cols-[${timeCol}_1fr]`
      : 'grid-cols-[56px_repeat(7,minmax(160px,1fr))] min-w-[840px]';
    const slotHeight = isMobileTimeline ? 'min-h-[60px]' : 'min-h-[52px]';

    const dayChipsHtml = isMobileTimeline && dayDates.length > 1 ? `
      <div class="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-none">
        ${dayDates.map((d, i) => {
          const ds = dateToStr(d);
          const isActive = i === mobileDayIdx;
          return `<button onclick="calendarSelectDate('${ds}')"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${isActive
              ? 'bg-[var(--accent)] text-white'
              : ds === today ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}">${d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</button>`;
        }).join('')}
      </div>
    ` : '';

    return `
      ${dayChipsHtml}
      <div class="overflow-auto border border-[var(--border-light)] rounded-lg">
        <div class="grid ${colClass}">
          <div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)]"></div>
          ${timelineDays.map(d => {
            const ds = dateToStr(d);
            return `<div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)] px-2 py-2 text-xs font-semibold text-[var(--text-primary)] ${ds === today ? 'text-[var(--accent)]' : ''}">
              ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>`;
          }).join('')}
          ${hours.map(hour => `
            <div class="px-2 py-2 text-[11px] text-[var(--text-muted)] border-r border-b border-[var(--border-light)] bg-[var(--bg-card)]">${String(hour).padStart(2, '0')}:00</div>
            ${timelineDays.map(d => {
              const ds = dateToStr(d);
              const dayEvents = (window.getGCalEventsForDate?.(ds) || []).filter(e => !e.allDay);
              const inHour = dayEvents.filter(e => {
                const h = new Date(e.start?.dateTime || '').getHours();
                return Number.isFinite(h) && h === hour;
              });
              return `
                <div class="${slotHeight} border-r border-b border-[var(--border-light)] p-1.5 bg-[var(--bg-primary)]"
                  ondragover="event.preventDefault()"
                  ondrop="dropCalendarEventToSlot('${ds}', ${hour})">
                  ${inHour.map(e => `
                    <div
                      draggable="true"
                      ondragstart="startCalendarEventDrag('${q(e.calendarId)}','${q(e.id)}')"
                      ondragend="clearCalendarEventDrag()"
                      onclick="openCalendarEventActions('${q(e.calendarId)}','${q(e.id)}')"
                      class="text-[11px] rounded-md px-2 py-1 mb-1 calendar-time-event cursor-move truncate">
                      ${escapeHtml(e.summary)}
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          `).join('')}
        </div>
      </div>
    `;
  };

  let calendarHtml = '';
  if (state.calendarViewMode === 'month') calendarHtml = buildMonthGrid();
  else if (state.calendarViewMode === 'week' || state.calendarViewMode === '3days') calendarHtml = buildRangeGrid();
  else calendarHtml = buildTimeGrid();

  const tokenBanner = state.gcalTokenExpired ? `
    <div class="calendar-token-banner mx-5 my-2 px-4 py-2 rounded-lg flex items-center justify-between">
      <span class="text-sm">Google Calendar session expired</span>
      <button onclick="reconnectGCal()" class="text-sm font-medium hover:opacity-80 underline">Reconnect</button>
    </div>
  ` : '';

  const todayListHtml = todayTasks.length > 0
    ? todayTasks.map(task => renderCalendarSidebarTaskItem(task)).join('')
    : `<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No tasks for today.</div>`;

  const selectedDateLabel = selDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const eventsListHtml = gcalEvents.length > 0
    ? gcalEvents.map(e => {
      const summary = String(e?.summary || '(No title)');
      const title = escapeHtml(summary.length > 60 ? summary.slice(0, 57) + '...' : summary);
      const timeStr = formatEventTimeLabel(e) || 'All day';
      const withNotes = hasMeetingNotes(e);
      return `
        <button onclick="openCalendarEventActions('${q(e.calendarId)}','${q(e.id)}')" class="calendar-side-event-row w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition rounded-lg ${withNotes ? 'calendar-side-event-with-notes' : ''}">
          <span class="w-2.5 h-2.5 rounded-full ${withNotes ? 'bg-[var(--flagged-color)]' : 'bg-[var(--success)]'} flex-shrink-0"></span>
          <span class="text-sm text-[var(--text-primary)] flex-1 truncate">${title}</span>
          ${withNotes ? '<span class="calendar-notes-chip">Notes</span>' : ''}
          <span class="text-xs text-[var(--text-muted)] flex-shrink-0">${escapeHtml(timeStr)}</span>
        </button>
      `;
    }).join('')
    : `<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No events for ${selectedDateLabel}.</div>`;

  const modalEvent = getSelectedModalEvent();

  return `
    <div class="flex-1">
      <div class="calendar-page-grid">
        <section class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)]">
          <div class="px-5 py-4 flex items-center justify-between border-b border-[var(--border-light)]">
            <div class="flex items-center gap-3">
              <span class="text-2xl text-[var(--accent)]">${getActiveIcons().calendar}</span>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">Calendar</h2>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="toggleCalendarSidebar()" class="w-8 h-8 rounded-full border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] flex items-center justify-center transition" title="${state.calendarSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  ${state.calendarSidebarCollapsed
                    ? '<path d="M18 8l-6 6-6-6"/><path d="M21 4h-3"/><path d="M3 4h3"/>'
                    : '<path d="M18 15l-6-6-6 6"/><path d="M21 20h-3"/><path d="M3 20h3"/>'}
                </svg>
              </button>
              <button onclick="openNewTaskModal()" class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="Add Task">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>

          <div class="px-5 py-3 calendar-toolbar border-b border-[var(--border-light)]">
            <div class="calendar-period-row">
              <div class="calendar-period-nav">
                <button onclick="calendarPrevMonth()" class="calendar-period-btn" aria-label="Previous period">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <h3 class="calendar-period-title">${viewLabelMap[state.calendarViewMode] || viewLabelMap.month}</h3>
                <button onclick="calendarNextMonth()" class="calendar-period-btn" aria-label="Next period">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <div class="calendar-period-actions">
                <button onclick="calendarGoToday()" class="calendar-today-btn">Today</button>
                ${state.gcalSyncing ? '<span class="text-[10px] text-[var(--text-muted)]">Syncing...</span>' : ''}
              </div>
            </div>
            <div class="calendar-views-row">
              <div class="calendar-view-toggle">
                <button onclick="setCalendarViewMode('month')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'month' ? 'active' : ''}" aria-pressed="${state.calendarViewMode === 'month'}">${monthBtnLabel}</button>
                <button onclick="setCalendarViewMode('week')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'week' ? 'active' : ''}" aria-pressed="${state.calendarViewMode === 'week'}">${weekBtnLabel}</button>
                <button onclick="setCalendarViewMode('3days')" class="calendar-view-toggle-btn ${state.calendarViewMode === '3days' ? 'active' : ''}" aria-pressed="${state.calendarViewMode === '3days'}">${threeDayBtnLabel}</button>
                <button onclick="setCalendarViewMode('daygrid')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'daygrid' ? 'active' : ''}" aria-pressed="${state.calendarViewMode === 'daygrid'}">${dayGridBtnLabel}</button>
                <button onclick="setCalendarViewMode('weekgrid')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'weekgrid' ? 'active' : ''}" aria-pressed="${state.calendarViewMode === 'weekgrid'}">${weekGridBtnLabel}</button>
              </div>
            </div>
          </div>

          ${tokenBanner}

          <div class="px-3 pt-2 pb-2">
            ${calendarHtml}
          </div>
        </section>

        <aside class="space-y-3 ${state.calendarSidebarCollapsed ? 'hidden' : ''}">
          <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
            <button onclick="toggleCalendarMobilePanel('today')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${state.calendarMobileShowToday ? 'true' : 'false'}">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Today</h4>
              <span class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] font-medium">${todayTasks.length}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${state.calendarMobileShowToday ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="calendar-side-list ${isMobile && !state.calendarMobileShowToday ? 'calendar-panel-collapsed' : ''}">${todayListHtml}</div>
          </div>

          <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
            <button onclick="toggleCalendarMobilePanel('events')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${state.calendarMobileShowEvents ? 'true' : 'false'}">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Events</h4>
              <span class="flex items-center gap-2">
                <span class="text-xs text-[var(--text-muted)]">${selectedLabel}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${state.calendarMobileShowEvents ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="calendar-side-list ${isMobile && !state.calendarMobileShowEvents ? 'calendar-panel-collapsed' : ''}">${eventsListHtml}</div>
          </div>

          ${(dueTasks.length > 0 || deferTasks.length > 0) ? `
            <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
              <button onclick="toggleCalendarMobilePanel('scheduled')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${state.calendarMobileShowScheduled ? 'true' : 'false'}">
                <h4 class="text-sm font-semibold text-[var(--text-primary)]">Scheduled</h4>
                <span class="flex items-center gap-2">
                  <span class="text-xs text-[var(--text-muted)]">${selectedDateLabel}</span>
                  <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${state.calendarMobileShowScheduled ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              <div class="calendar-side-list ${isMobile && !state.calendarMobileShowScheduled ? 'calendar-panel-collapsed' : ''}">
                ${dueTasks.length > 0 ? `
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--warning)]">Due</div>
                  ${dueTasks.map(task => renderCalendarSidebarTaskItem(task)).join('')}
                ` : ''}
                ${deferTasks.length > 0 ? `
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Starting</div>
                  ${deferTasks.map(task => renderCalendarSidebarTaskItem(task)).join('')}
                ` : ''}
              </div>
            </div>
          ` : ''}
        </aside>
      </div>

      ${renderEventActionsModal(modalEvent)}
    </div>
  `;
}

/**
 * Attach touch swipe listeners to the calendar grid for month navigation.
 * Called after render when calendar tab is active.
 */
export function attachCalendarSwipe() {
  const grid = document.querySelector('.calendar-grid');
  if (!grid || grid._swipeAttached) return;
  grid._swipeAttached = true;

  let startX = 0;
  let startY = 0;

  grid.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  grid.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) window.calendarNextMonth();
      else window.calendarPrevMonth();
    }
  }, { passive: true });
}
