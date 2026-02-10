// ============================================================================
// HOME TAB MODULE
// ============================================================================
// Renders the Home dashboard: widgets grid, quick-add, today/next task lists,
// daily-entry mini form, and the overall score summary.

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import { THINGS3_ICONS, WEATHER_ICONS, WEATHER_DESCRIPTIONS, defaultDayData, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE } from '../constants.js';

// ---------------------------------------------------------------------------
// External function references — these will be replaced with proper module
// imports as we continue modularising.  For now we fall back to window.xxx.
// ---------------------------------------------------------------------------

function calculateScores(data) {
  if (typeof window.calculateScores === 'function') return window.calculateScores(data);
  // Return zeroed structure as safe fallback
  return { total: 0, prayer: 0, diabetes: 0, whoop: 0, family: 0, habit: 0, prayerOnTime: 0, prayerLate: 0 };
}

function renderTaskItem(task, showDueDate, compact) {
  if (typeof window.renderTaskItem === 'function') return window.renderTaskItem(task, showDueDate, compact);
  return `<div class="py-2 px-3 text-sm text-charcoal">${task.title || 'Untitled'}</div>`;
}

function createTask(title, options) {
  if (typeof window.createTask === 'function') return window.createTask(title, options);
}

function cleanupInlineAutocomplete(inputId) {
  if (typeof window.cleanupInlineAutocomplete === 'function') return window.cleanupInlineAutocomplete(inputId);
}

function render() {
  if (typeof window.render === 'function') return window.render();
}

function getFilteredTasks(perspectiveId) {
  if (typeof window.getFilteredTasks === 'function') return window.getFilteredTasks(perspectiveId);
  return [];
}

function formatHomeEventTime(event) {
  if (!event) return '';
  if (event.allDay) return 'All day';
  if (!event.start?.dateTime) return '';
  const start = new Date(event.start.dateTime);
  const startText = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (!event.end?.dateTime) return startText;
  const end = new Date(event.end.dateTime);
  const endText = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${startText} - ${endText}`;
}

// ============================================================================
// renderHomeWidget — renders a single home dashboard widget
// ============================================================================

/**
 * Render a single home widget card
 * @param {object}  widget    - Widget config { id, type, title, size, order, visible }
 * @param {boolean} isEditing - True when the user is in widget-customise mode
 * @returns {string} HTML string
 */
export function renderHomeWidget(widget, isEditing) {
  const today = getLocalDateString();
  const nextLabel = state.taskLabels.find(l => l.name.toLowerCase() === 'next');
  const isMobileView = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;

  // Size class mapping
  const sizeClass = isMobileView
    ? 'col-span-2'
    : (widget.size === 'full' ? 'col-span-2' : widget.size === 'half' ? 'col-span-1' : 'col-span-1');

  // Size labels for display
  const sizeLabels = { full: 'Full', half: 'Half', third: 'Third' };

  // Edit controls shown in edit mode
  const isPerspectiveWidget = widget.type === 'perspective';
  const editControls = isEditing ? `
    <div class="flex items-center gap-1 ml-auto">
      <button onclick="event.stopPropagation(); toggleWidgetSize('${widget.id}')"
        class="widget-resize-btn flex items-center gap-1.5 px-2 py-1 text-charcoal/60 hover:text-coral rounded transition border border-charcoal/10 hover:border-coral/30"
        title="Click to resize">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          ${widget.size === 'full'
            ? '<path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"/>'
            : '<path d="M4 3h6a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M14 3h6a1 1 0 011 1v16a1 1 0 01-1 1h-6a1 1 0 01-1-1V4a1 1 0 011-1z" opacity="0.3"/>'}
        </svg>
        <span class="text-[11px] font-medium uppercase">${sizeLabels[widget.size] || 'Half'}</span>
      </button>
      ${isPerspectiveWidget ? `
        <button onclick="event.stopPropagation(); removePerspectiveWidget('${widget.id}')" class="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded transition" title="Remove widget">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      ` : `
        <button onclick="event.stopPropagation(); toggleWidgetVisibility('${widget.id}')" class="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded transition" title="Hide widget">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
        </button>
      `}
    </div>
  ` : '';

  let content = '';

  switch (widget.type) {
    case 'stats': {
      const todayTasksCount = state.tasksData.filter(t => {
        if (t.completed || t.isNote) return false;
        const isDueToday = t.dueDate === today;
        const isOverdue = t.dueDate && t.dueDate < today;
        const isScheduledForToday = t.deferDate && t.deferDate <= today;
        return t.today || isDueToday || isOverdue || isScheduledForToday;
      }).length;
      const nextTasksCount = nextLabel ? state.tasksData.filter(t => {
        if (t.completed || t.isNote) return false;
        const isNextTagged = (t.labels || []).includes(nextLabel.id);
        if (!isNextTagged) return false;
        const isDatedTask = t.today || t.dueDate === today || (t.dueDate && t.dueDate < today) || (t.deferDate && t.deferDate <= today);
        return !isDatedTask;
      }).length : 0;
      const completedToday = state.tasksData.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(today)).length;
      const inboxCount = state.tasksData.filter(t => !t.completed && !t.isNote && t.status === 'inbox' && !t.categoryId).length;

      content = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <button type="button" class="quick-stat-item bg-warmgray/30 rounded-xl p-3 text-center active:bg-warmgray/60 transition-all" onclick="showPerspectiveTasks('inbox')">
            <div class="text-xl sm:text-2xl font-bold ${inboxCount > 0 ? 'text-blue-500' : 'text-charcoal'}">${inboxCount}</div>
            <div class="text-xs text-charcoal/50 mt-1">In Inbox</div>
          </button>
          <button type="button" class="quick-stat-item bg-warmgray/30 rounded-xl p-3 text-center active:bg-warmgray/60 transition-all" onclick="showPerspectiveTasks('today')">
            <div class="text-xl sm:text-2xl font-bold text-charcoal">${todayTasksCount}</div>
            <div class="text-xs text-charcoal/50 mt-1">Due Today</div>
          </button>
          <button type="button" class="quick-stat-item bg-warmgray/30 rounded-xl p-3 text-center active:bg-warmgray/60 transition-all" onclick="${nextLabel ? `showLabelTasks('${nextLabel.id}')` : 'void(0)'}">
            <div class="text-xl sm:text-2xl font-bold text-[#8B5CF6]">${nextTasksCount}</div>
            <div class="text-xs text-charcoal/50 mt-1">Tagged Next</div>
          </button>
          <button type="button" class="quick-stat-item bg-warmgray/30 rounded-xl p-3 text-center active:bg-warmgray/60 transition-all" onclick="showPerspectiveTasks('logbook')">
            <div class="text-xl sm:text-2xl font-bold text-green-600">${completedToday}</div>
            <div class="text-xs text-charcoal/50 mt-1">Done Today</div>
          </button>
        </div>
      `;
      break;
    }

    case 'quick-add':
      content = `
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border-2 border-dashed border-charcoal/20 flex-shrink-0"></div>
          <input type="text" id="home-quick-add-input"
            placeholder="Quick add task... (press Enter)"
            onkeydown="if(event._inlineAcHandled)return;if(event.key==='Enter'){event.preventDefault();homeQuickAddTask(this);}"
            class="flex-1 text-[15px] text-charcoal placeholder-charcoal/30 bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="homeQuickAddTask(document.getElementById('home-quick-add-input'))"
            class="text-charcoal/30 hover:text-coral transition p-1" title="Add task">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </button>
        </div>
      `;
      break;

    case 'today-tasks': {
      const allTodayTasks = state.tasksData.filter(t => {
        if (t.completed || t.isNote) return false;
        const isDueToday = t.dueDate === today;
        const isOverdue = t.dueDate && t.dueDate < today;
        const isScheduledForToday = t.deferDate && t.deferDate <= today;
        return t.today || isDueToday || isOverdue || isScheduledForToday;
      });
      // Due tasks: overdue + due today (shown first)
      const dueTasks = allTodayTasks.filter(t => (t.dueDate && t.dueDate <= today)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      // Starting tasks: deferred to today but NOT due today/overdue
      const startingTasks = allTodayTasks.filter(t => {
        const isDueOrOverdue = t.dueDate && t.dueDate <= today;
        const isScheduled = t.deferDate && t.deferDate <= today;
        return isScheduled && !isDueOrOverdue;
      });
      // Remaining today-status tasks (no due or defer date relevance)
      const otherTodayTasks = allTodayTasks.filter(t => !dueTasks.includes(t) && !startingTasks.includes(t));
      const totalCount = allTodayTasks.length;

      content = totalCount === 0 ? `
        <div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks for today</div>
      ` : `
        <div class="max-h-[300px] overflow-y-auto">
          ${dueTasks.length > 0 ? `
            <div class="px-2 pt-1 pb-0.5">
              <div class="flex items-center gap-1.5">
                <svg class="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>
                <span class="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Due</span>
                <span class="text-[10px] text-red-400">${dueTasks.length}</span>
              </div>
            </div>
            <div>${dueTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
          ` : ''}
          ${otherTodayTasks.length > 0 ? `
            <div>${otherTodayTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
          ` : ''}
          ${startingTasks.length > 0 ? `
            <div class="px-2 pt-1 pb-0.5 ${dueTasks.length > 0 || otherTodayTasks.length > 0 ? 'mt-0.5 border-t border-[var(--border-light)]' : ''}">
              <div class="flex items-center gap-1.5">
                <svg class="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span class="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">Starting</span>
                <span class="text-[10px] text-blue-400">${startingTasks.length}</span>
              </div>
            </div>
            <div>${startingTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
          ` : ''}
          ${totalCount > 8 ? '<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks(\'today\')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ' + totalCount + ' tasks \u2192</button></div>' : ''}
        </div>
      `;
      break;
    }

    case 'next-tasks': {
      const nextTasks = nextLabel ? state.tasksData.filter(t => {
        if (t.completed || t.isNote) return false;
        const isNextTagged = (t.labels || []).includes(nextLabel.id);
        if (!isNextTagged) return false;
        const isDatedTask = t.today || t.dueDate === today || (t.dueDate && t.dueDate < today) || (t.deferDate && t.deferDate <= today);
        return !isDatedTask;
      }) : [];

      content = nextTasks.length === 0 ? `
        <div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks tagged "Next"</div>
      ` : `
        <div class="max-h-[300px] overflow-y-auto">
          ${nextTasks.slice(0, 8).map(task => renderTaskItem(task, false, true)).join('')}
          ${nextTasks.length > 8 ? '<div class="px-2 py-2 text-center"><button onclick="showLabelTasks(\'' + nextLabel.id + '\')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ' + nextTasks.length + ' tasks \u2192</button></div>' : ''}
        </div>
      `;
      break;
    }

    case 'today-events': {
      const connected = typeof window.isGCalConnected === 'function' ? window.isGCalConnected() : false;
      const expired = !!state.gcalTokenExpired;
      const events = typeof window.getGCalEventsForDate === 'function' ? (window.getGCalEventsForDate(today) || []) : [];

      if (!connected) {
        content = `
          <div class="py-6 text-center">
            <p class="text-sm text-[var(--text-muted)] mb-2">Google Calendar is not connected</p>
            <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Connect in Settings &rarr;</button>
          </div>
        `;
        break;
      }

      if (expired) {
        content = `
          <div class="py-6 text-center">
            <p class="text-sm text-amber-700 mb-2">Calendar session expired</p>
            <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Reconnect Calendar &rarr;</button>
          </div>
        `;
        break;
      }

      content = events.length === 0 ? `
        <div class="py-6 text-center text-[var(--text-muted)] text-sm">No events today</div>
      ` : `
        <div class="max-h-[300px] overflow-y-auto space-y-1">
          ${events.slice(0, 6).map(event => `
            <button
              onclick="${event.htmlLink ? `window.open('${String(event.htmlLink).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}','_blank')` : `switchTab('calendar'); calendarSelectDate('${today}')`}"
              class="w-full text-left rounded-lg px-2.5 py-2 hover:bg-[var(--bg-secondary)] transition border border-transparent hover:border-[var(--border-light)]">
              <div class="flex items-start gap-2.5">
                <span class="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] font-medium text-[var(--text-primary)] truncate">${event.summary ? event.summary.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '(No title)'}</p>
                  <p class="text-[11px] text-[var(--text-muted)] mt-0.5">${formatHomeEventTime(event)}</p>
                </div>
              </div>
            </button>
          `).join('')}
          ${events.length > 6 ? `
            <div class="px-2 py-2 text-center">
              <button onclick="switchTab('calendar'); calendarSelectDate('${today}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${events.length} events &rarr;</button>
            </div>
          ` : ''}
        </div>
      `;
      break;
    }

    case 'prayers': {
      const todayData = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
      const prayerData = todayData.prayers || {};
      const prayerFields = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const prayersDone = prayerFields.filter(f => prayerData[f] && parseFloat(prayerData[f]) > 0).length;

      content = `
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-[var(--text-muted)] font-medium">${prayersDone}/5</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          ${['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p, i) => {
            const shortLabels = ['F', 'D', 'A', 'M', 'I'];
            return '<div class="text-center">' +
              '<label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">' + shortLabels[i] + '</label>' +
              '<input type="number" step="0.1" min="0" max="1" value="' + (prayerData[p] || '') + '" placeholder="0"' +
              ' autocomplete="off"' +
              ' onchange="updateDailyField(\'prayers\', \'' + p + '\', this.value)"' +
              ' class="w-full px-2 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">' +
              '</div>';
          }).join('')}
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">\uD83D\uDCD6</label>
            <input type="number" step="0.1" value="${prayerData.quran || ''}" placeholder="0"
              autocomplete="off"
              onchange="updateDailyField('prayers', 'quran', this.value)"
              class="w-full px-2 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
          </div>
        </div>
      `;
      break;
    }

    case 'glucose': {
      const todayDataG = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
      const glucoseData = todayDataG.glucose || {};
      const libreData = todayDataG.libre || {};
      const libreConnected = typeof window.isLibreConnected === 'function' && window.isLibreConnected();
      const hasLiveGlucose = libreConnected && libreData.currentGlucose;

      // Color coding for current glucose: green (70-140), yellow (141-180), red (>180 or <70)
      let glucoseColor = 'text-green-600';
      let glucoseBg = 'bg-green-50';
      if (hasLiveGlucose) {
        const val = Number(libreData.currentGlucose);
        if (val > 180 || val < 70) { glucoseColor = 'text-red-600'; glucoseBg = 'bg-red-50'; }
        else if (val > 140) { glucoseColor = 'text-amber-600'; glucoseBg = 'bg-amber-50'; }
      }

      content = `
        ${hasLiveGlucose ? `
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold ${glucoseColor}">${libreData.currentGlucose}</span>
              <span class="text-lg ${glucoseColor}">${libreData.trend || '→'}</span>
              <span class="text-xs text-[var(--text-muted)]">mg/dL</span>
            </div>
            <button onclick="window.syncLibreNow()" class="inline-flex items-center gap-1 text-[10px] text-green-600 ${glucoseBg} px-1.5 py-0.5 rounded-full hover:bg-green-100 transition" title="Sync now">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              Sync
            </button>
          </div>
        ` : libreConnected ? `
          <div class="flex justify-end mb-2">
            <button onclick="window.syncLibreNow()" class="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition" title="Sync now">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              Sync
            </button>
          </div>
        ` : ''}
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Avg</label>
            <input type="number" value="${glucoseData.avg || ''}" placeholder="--"
              autocomplete="off"
              ${libreConnected && glucoseData.avg ? 'readonly class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] cursor-default"' : `onchange="updateDailyField('glucose', 'avg', this.value)"
              class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]"`}>
          </div>
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">TIR %</label>
            <input type="number" value="${glucoseData.tir || ''}" placeholder="--"
              autocomplete="off"
              ${libreConnected && glucoseData.tir ? 'readonly class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] cursor-default"' : `onchange="updateDailyField('glucose', 'tir', this.value)"
              class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]"`}>
          </div>
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Insulin</label>
            <input type="number" value="${glucoseData.insulin || ''}" placeholder="--"
              autocomplete="off"
              onchange="updateDailyField('glucose', 'insulin', this.value)"
              class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
          </div>
        </div>
      `;
      break;
    }

    case 'whoop': {
      const todayDataW = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
      const whoopData = todayDataW.whoop || {};

      content = `
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Sleep %</label>
            <input type="number" value="${whoopData.sleepPerf || ''}" placeholder="--"
              autocomplete="off"
              onchange="updateDailyField('whoop', 'sleepPerf', this.value)"
              class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
          </div>
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Recovery</label>
            <input type="number" value="${whoopData.recovery || ''}" placeholder="--"
              autocomplete="off"
              onchange="updateDailyField('whoop', 'recovery', this.value)"
              class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
          </div>
          <div class="text-center">
            <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Strain</label>
            <input type="number" value="${whoopData.strain || ''}" placeholder="--"
              autocomplete="off"
              onchange="updateDailyField('whoop', 'strain', this.value)"
              class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
          </div>
        </div>
      `;
      break;
    }

    case 'habits': {
      const todayDataH = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
      const habitsData = todayDataH.habits || {};
      const habitFields = ['exercise', 'reading', 'meditation', 'water', 'vitamins'];
      const habitsDone = habitFields.filter(f => habitsData[f]).length;

      content = `
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-[var(--text-muted)] font-medium">${habitsDone}/5</span>
        </div>
        <div class="grid grid-cols-5 gap-2">
          ${[
            { field: 'exercise', icon: '\uD83C\uDFCB\uFE0F', label: 'Exercise' },
            { field: 'reading', icon: '\uD83D\uDCDA', label: 'Read' },
            { field: 'meditation', icon: '\uD83E\uDDD8', label: 'Meditate' },
            { field: 'water', icon: '\uD83D\uDCA7', label: 'Water' },
            { field: 'vitamins', icon: '\uD83D\uDC8A', label: 'Vitamins' }
          ].map(h => {
            const isChecked = habitsData[h.field];
            return '<label class="flex flex-col items-center cursor-pointer">' +
              '<span class="text-lg mb-1">' + h.icon + '</span>' +
              '<input type="checkbox" ' + (isChecked ? 'checked' : '') +
              ' onchange="toggleDailyField(\'habits\', \'' + h.field + '\')"' +
              ' class="w-5 h-5 rounded border-2 border-purple-300 text-purple-500 focus:ring-purple-300 focus:ring-offset-0 cursor-pointer">' +
              '</label>';
          }).join('')}
        </div>
      `;
      break;
    }

    case 'score': {
      const todayData2 = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
      const rawScores2 = calculateScores(todayData2);
      const s = {
        total: rawScores2?.total ?? 0,
        prayer: rawScores2?.prayer ?? 0,
        diabetes: rawScores2?.diabetes ?? 0,
        whoop: rawScores2?.whoop ?? 0,
        family: rawScores2?.family ?? 0,
        habit: rawScores2?.habit ?? 0
      };
      const totalMax = Math.max(Number(state.MAX_SCORES?.total) || 0, 1);
      const pct = Math.max(0, Math.min(100, Math.round((s.total / totalMax) * 100)));

      content = `
        <div class="flex items-center justify-between">
          <div>
            <p class="text-3xl font-bold text-[var(--accent)]">${s.total.toFixed(0)} <span class="text-base font-normal text-[var(--text-muted)]">/ ${state.MAX_SCORES.total}</span></p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-[var(--text-primary)]">${pct}%</div>
          </div>
        </div>
        <div class="h-2 bg-[var(--bg-secondary)] rounded-full mt-3 overflow-hidden">
          <div class="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
        <div class="score-grid grid grid-cols-5 gap-2 mt-3">
          <div class="text-center">
            <div class="text-[10px] text-[var(--text-muted)]">Prayers</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${s.prayer.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-[var(--text-muted)]">Glucose</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${s.diabetes.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-[var(--text-muted)]">Whoop</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${s.whoop.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-[var(--text-muted)]">Family</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${s.family.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-[var(--text-muted)]">Habits</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${s.habit.toFixed(0)}</div>
          </div>
        </div>
      `;
      break;
    }

    case 'weather': {
      const w = state.weatherData;
      if (!w) {
        content = `<div class="py-6 text-center text-[var(--text-muted)] text-sm">Loading weather...</div>`;
      } else {
        const desc = WEATHER_DESCRIPTIONS[w.weatherCode] || 'Weather';
        const icon = WEATHER_ICONS[w.weatherCode] || '\uD83C\uDF21\uFE0F';
        const temp = Number.isFinite(Number(w.temp)) ? Math.round(Number(w.temp)) : '--';
        const tempMax = Number.isFinite(Number(w.tempMax)) ? Math.round(Number(w.tempMax)) : '--';
        const tempMin = Number.isFinite(Number(w.tempMin)) ? Math.round(Number(w.tempMin)) : '--';
        const humidity = Number.isFinite(Number(w.humidity)) ? Math.max(0, Math.min(100, Math.round(Number(w.humidity)))) : 0;
        const windSpeed = Number.isFinite(Number(w.windSpeed)) ? Math.max(0, Math.round(Number(w.windSpeed))) : 0;
        const city = w.city || 'Current location';
        const maxHour = w.maxHour || '';
        const minHour = w.minHour || '';
        const humidityBar = humidity;
        const windDesc = windSpeed < 10 ? 'Calm' : windSpeed < 25 ? 'Breezy' : 'Windy';

        content = `
          <div class="weather-widget-content flex items-start gap-4">
            <!-- Left: current conditions -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <span class="text-4xl leading-none">${icon}</span>
                <div>
                  <div class="text-3xl font-bold text-[var(--text-primary)] leading-none">${temp}\u00B0</div>
                  <div class="text-sm text-[var(--text-secondary)] mt-0.5">${desc}</div>
                </div>
              </div>
              <div class="text-xs text-[var(--text-muted)] mt-2">${city}</div>
            </div>
            <!-- Right: high/low -->
            <div class="text-right flex-shrink-0">
              <div class="flex items-center justify-end gap-1.5">
                <svg class="w-3 h-3 text-orange-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.09 8.26L21 9.27L16 13.97L17.18 20.02L12 17.77L6.82 20.02L8 13.97L3 9.27L9.91 8.26L12 2Z"/></svg>
                <span class="text-sm font-semibold text-[var(--text-primary)]">${tempMax}\u00B0</span>
                <span class="text-[10px] text-[var(--text-muted)]">${maxHour}</span>
              </div>
              <div class="flex items-center justify-end gap-1.5 mt-1">
                <svg class="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22q-2.075 0-3.537-1.462Q7 19.075 7 17q0-1.3.612-2.4T9 12.55V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v7.55q.775.95 1.388 2.05T17 17q0 2.075-1.463 3.538Q14.075 22 12 22Z"/></svg>
                <span class="text-sm font-semibold text-[var(--text-primary)]">${tempMin}\u00B0</span>
                <span class="text-[10px] text-[var(--text-muted)]">${minHour}</span>
              </div>
            </div>
          </div>
          <!-- Detail pills -->
          <div class="weather-widget-detail-grid grid grid-cols-2 gap-2 mt-4">
            <div class="bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>
                <span class="text-[11px] text-[var(--text-muted)]">Humidity</span>
              </div>
              <div class="flex items-center gap-2 mt-1.5">
                <div class="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div class="h-full bg-blue-400 rounded-full" style="width: ${humidityBar}%"></div>
                </div>
                <span class="text-xs font-semibold text-[var(--text-primary)]">${humidity}%</span>
              </div>
            </div>
            <div class="bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-teal-400" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3c0-1.17.67-2.18 1.65-2.67L9.5 2h4l-.65 12.33c.98.49 1.65 1.5 1.65 2.67z"/></svg>
                <span class="text-[11px] text-[var(--text-muted)]">Wind</span>
              </div>
              <div class="mt-1.5">
                <span class="text-xs font-semibold text-[var(--text-primary)]">${windSpeed} km/h</span>
                <span class="text-[10px] text-[var(--text-muted)] ml-1">${windDesc}</span>
              </div>
            </div>
          </div>
        `;
      }
      break;
    }

    case 'perspective': {
      // Look up perspective from builtins + notes + custom
      const allPerspectives = [...BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, ...(state.customPerspectives || [])];
      const perspective = allPerspectives.find(p => p.id === widget.perspectiveId);

      if (!perspective) {
        // Deleted custom perspective
        content = `
          <div class="py-6 text-center">
            <p class="text-[var(--text-muted)] text-sm mb-2">View not found</p>
            <button onclick="removePerspectiveWidget('${widget.id}')" class="text-xs text-red-500 hover:underline">Remove widget</button>
          </div>
        `;
        break;
      }

      // Notes perspective — show note count + link
      if (widget.perspectiveId === 'notes') {
        const noteCount = state.tasksData.filter(t => t.isNote && !t.completed).length;
        content = `
          <div class="py-4 text-center">
            <div class="text-2xl font-bold text-[var(--text-primary)] mb-1">${noteCount}</div>
            <div class="text-xs text-[var(--text-muted)] mb-3">note${noteCount !== 1 ? 's' : ''}</div>
            <button onclick="showPerspectiveTasks('notes')" class="text-xs text-[var(--accent)] hover:underline font-medium">Open Notes &rarr;</button>
          </div>
        `;
        break;
      }

      const perspTasks = getFilteredTasks(widget.perspectiveId);
      const taskCount = perspTasks.length;

      if (taskCount === 0) {
        content = `<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks</div>`;
      } else {
        content = `
          <div class="max-h-[300px] overflow-y-auto">
            ${perspTasks.slice(0, 8).map(task => renderTaskItem(task, false, true)).join('')}
            ${taskCount > 8 ? `<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks('${widget.perspectiveId}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${taskCount} tasks &rarr;</button></div>` : ''}
          </div>
        `;
      }
      break;
    }

    default:
      content = '<div class="py-4 text-center text-charcoal/30">Unknown widget type</div>';
  }

  // Widget icon based on type
  const widgetIcons = {
    'stats': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',
    'quick-add': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
    'today-tasks': THINGS3_ICONS.today,
    'today-events': THINGS3_ICONS.calendar,
    'next-tasks': THINGS3_ICONS.next,
    'prayers': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    'glucose': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>',
    'whoop': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',
    'habits': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
    'weather': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>',
    'score': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>'
  };

  const widgetColors = {
    'stats': '#6B7280',
    'quick-add': '#147EFB',
    'today-tasks': '#FFCA28',
    'today-events': '#2F9B6A',
    'next-tasks': '#8B5CF6',
    'prayers': '#10B981',
    'glucose': '#EF4444',
    'whoop': '#3B82F6',
    'habits': '#8B5CF6',
    'weather': '#F59E0B',
    'score': '#22C55E'
  };

  // For perspective widgets, resolve icon and color from the perspective definition
  if (widget.type === 'perspective') {
    const allPersp = [...BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, ...(state.customPerspectives || [])];
    const persp = allPersp.find(p => p.id === widget.perspectiveId);
    if (persp) {
      widgetIcons['perspective'] = persp.icon || '';
      widgetColors['perspective'] = persp.color || '#6B7280';
    }
  }

  // Quick-add widget has minimal styling (no border, no background, no header)
  if (widget.type === 'quick-add' && !isEditing) {
    return `
      <div class="widget quick-add-widget ${sizeClass} widget-drop-target">
        <div class="py-2">
          ${content}
        </div>
      </div>
    `;
  }

  return `
    <div class="widget ${sizeClass} bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden widget-drop-target ${isEditing ? 'cursor-grab' : ''}"
      ${isEditing ? `draggable="true" ondragstart="handleWidgetDragStart(event, '${widget.id}')" ondragend="handleWidgetDragEnd(event)" ondragover="handleWidgetDragOver(event, '${widget.id}')" ondragleave="handleWidgetDragLeave(event)" ondrop="handleWidgetDrop(event, '${widget.id}')"` : ''}>
      <div class="widget-header px-4 py-2 border-b border-[var(--border-light)] flex items-center gap-2">
        ${isEditing ? '<div class="text-[var(--text-muted)]/30 cursor-grab"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>' : ''}
        <span style="color: ${widgetColors[widget.type] || '#6B7280'}">${widgetIcons[widget.type] || ''}</span>
        <h3 class="widget-title text-sm font-medium text-[var(--text-primary)]">${widget.title}</h3>
        ${editControls}
      </div>
      <div class="widget-body ${widget.type === 'today-tasks' || widget.type === 'today-events' || widget.type === 'next-tasks' || widget.type === 'perspective' ? 'px-2 py-1' : 'p-4'}">
        ${content}
      </div>
    </div>
  `;
}

// ============================================================================
// homeQuickAddTask — processes quick-add input from home widget
// ============================================================================

/**
 * Process quick-add task input from the home widget
 * @param {HTMLInputElement} inputElement - The quick-add input element
 */
export function homeQuickAddTask(inputElement) {
  if (!inputElement) return;
  const title = inputElement.value.trim();
  if (!title) return;
  const options = { status: 'inbox' };
  // Merge inline autocomplete metadata
  const inlineMeta = state.inlineAutocompleteMeta.get('home-quick-add-input');
  if (inlineMeta) {
    if (inlineMeta.categoryId) options.categoryId = inlineMeta.categoryId;
    if (inlineMeta.labels && inlineMeta.labels.length) options.labels = inlineMeta.labels;
    if (inlineMeta.people && inlineMeta.people.length) options.people = inlineMeta.people;
    if (inlineMeta.deferDate) options.deferDate = inlineMeta.deferDate;
  }
  createTask(title, options);
  inputElement.value = '';
  cleanupInlineAutocomplete('home-quick-add-input');
  render();
  setTimeout(() => {
    const input = document.getElementById('home-quick-add-input');
    if (input) input.focus();
  }, 50);
}

// ============================================================================
// renderHomeTab — the home dashboard layout
// ============================================================================

/**
 * Render the full Home tab content (greeting, widgets, score summary)
 * @returns {string} HTML string for the Home tab
 */
export function renderHomeTab() {
  const today = getLocalDateString();

  const sortedWidgets = [...state.homeWidgets].sort((a, b) => a.order - b.order);
  const isMobileView = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;

  // On mobile, always render all widgets in the configured order so critical cards
  // (like Today) and any hidden cards remain accessible.
  const visibleWidgets = isMobileView ? sortedWidgets : sortedWidgets.filter(w => w.visible);
  const hiddenWidgets = isMobileView ? [] : sortedWidgets.filter(w => !w.visible);

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div class="home-greeting-row flex items-center gap-3">
            <h1 class="text-2xl font-bold text-charcoal">Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</h1>
            ${state.weatherData ? `
              <div class="weather-inline flex items-center gap-2 text-charcoal/70" title="${state.weatherData.city}">
                <span class="text-base">${WEATHER_ICONS[state.weatherData.weatherCode] || '\uD83C\uDF21\uFE0F'}</span>
                <span class="text-sm font-semibold">${state.weatherData.temp}\u00B0</span>
                <span class="text-[11px] text-charcoal/50 font-medium">\u2191${state.weatherData.tempMax}\u00B0 <span class="text-charcoal/30">${state.weatherData.maxHour || ''}</span></span>
                <span class="text-[11px] text-charcoal/50 font-medium">\u2193${state.weatherData.tempMin}\u00B0 <span class="text-charcoal/30">${state.weatherData.minHour || ''}</span></span>
              </div>
            ` : ''}
          </div>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-[var(--text-secondary)] text-sm">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <span class="text-[var(--text-muted)] hidden md:inline">\u2022</span>
            <p class="text-[var(--text-muted)] text-xs hidden md:block">Press <kbd class="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[11px] font-mono">\u2318K</kbd> to quick add</p>
          </div>
        </div>
        <div class="home-header-actions flex items-center gap-3">
          ${state.editingHomeWidgets ? `
            <button onclick="showAddWidgetPicker = !showAddWidgetPicker; render()" class="text-sm text-charcoal/50 hover:text-charcoal px-3 py-1.5 rounded-lg hover:bg-charcoal/5 transition flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Widget
            </button>
            <button onclick="resetHomeWidgets()" class="text-sm text-charcoal/50 hover:text-charcoal px-3 py-1.5 rounded-lg hover:bg-charcoal/5 transition">
              Reset Layout
            </button>
          ` : ''}
          <button onclick="toggleEditHomeWidgets()" class="text-sm px-3 py-1.5 rounded-lg transition ${state.editingHomeWidgets ? 'bg-coral text-white' : 'text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5'}">
            ${state.editingHomeWidgets ? '\u2713 Done' : '<span class="inline-flex items-center gap-1">' + THINGS3_ICONS.settings + ' Customize</span>'}
          </button>
        </div>
      </div>

      ${state.editingHomeWidgets && state.showAddWidgetPicker ? (() => {
        // Gather all perspectives (skip calendar — it's a full view, not a list)
        const pickerPerspectives = [
          ...BUILTIN_PERSPECTIVES.filter(p => p.id !== 'calendar'),
          NOTES_PERSPECTIVE,
          ...(state.customPerspectives || [])
        ];
        const addedIds = new Set(state.homeWidgets.filter(w => w.type === 'perspective').map(w => w.perspectiveId));
        return `
          <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)]">Add Perspective Widget</h3>
              <button onclick="showAddWidgetPicker = false; render()" class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${pickerPerspectives.map(p => {
                const isAdded = addedIds.has(p.id);
                return `
                  <button ${isAdded ? 'disabled' : `onclick="addPerspectiveWidget('${p.id}')"`}
                    class="flex items-center gap-2 px-3 py-2.5 rounded-lg border transition text-left ${isAdded
                      ? 'border-[var(--border-light)] bg-[var(--bg-secondary)] opacity-50 cursor-default'
                      : 'border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 cursor-pointer'}">
                    <span style="color: ${p.color}">${p.icon || ''}</span>
                    <span class="text-sm text-[var(--text-primary)] truncate">${p.name}</span>
                    ${isAdded ? '<svg class="w-3.5 h-3.5 text-green-500 ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      })() : ''}

      ${state.editingHomeWidgets && hiddenWidgets.length > 0 ? `
        <!-- Hidden Widgets -->
        <div class="bg-warmgray/30 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-4 h-4 text-charcoal/40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
            <span class="text-sm font-medium text-charcoal/50">Hidden Widgets</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${hiddenWidgets.map(w => `
              <button onclick="toggleWidgetVisibility('${w.id}')" class="text-sm px-3 py-1.5 rounded-lg border border-dashed border-charcoal/20 text-charcoal/60 hover:border-coral hover:text-coral transition flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                ${w.title}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Widget Grid -->
      <div class="widget-grid grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2'} gap-4">
        ${visibleWidgets.map(widget => renderHomeWidget(widget, state.editingHomeWidgets)).join('')}
      </div>
    </div>
  `;
}
