// ============================================================================
// HOME TAB MODULE
// ============================================================================
// Renders the Home dashboard: widgets grid, quick-add, today/next task lists,
// daily-entry mini form, and the overall score summary.

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import { THINGS3_ICONS, WEATHER_ICONS, defaultDayData } from '../constants.js';

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

  // Size class mapping
  const sizeClass = widget.size === 'full' ? 'col-span-2' : widget.size === 'half' ? 'col-span-1' : 'col-span-1';

  // Size labels for display
  const sizeLabels = { full: 'Full', half: 'Half', third: 'Third' };
  const nextSize = { full: 'half', half: 'full' }; // Simplified to just full/half

  // Edit controls shown in edit mode
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
      <button onclick="event.stopPropagation(); toggleWidgetVisibility('${widget.id}')" class="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded transition" title="Hide widget">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
      </button>
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
        return t.status === 'today' || isDueToday || isOverdue || isScheduledForToday;
      }).length;
      const nextTasksCount = nextLabel ? state.tasksData.filter(t => {
        if (t.completed || t.isNote) return false;
        return (t.labels || []).includes(nextLabel.id);
      }).length : 0;
      const completedToday = state.tasksData.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(today)).length;
      const inboxCount = state.tasksData.filter(t => !t.completed && !t.isNote && t.status === 'inbox' && !t.categoryId).length;

      content = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
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
          <button type="button" class="quick-stat-item bg-warmgray/30 rounded-xl p-3 text-center active:bg-warmgray/60 transition-all" onclick="showPerspectiveTasks('inbox')">
            <div class="text-xl sm:text-2xl font-bold ${inboxCount > 0 ? 'text-blue-500' : 'text-charcoal'}">${inboxCount}</div>
            <div class="text-xs text-charcoal/50 mt-1">In Inbox</div>
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
        return t.status === 'today' || isDueToday || isOverdue || isScheduledForToday;
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
        <div class="py-8 text-center text-[var(--text-muted)] text-sm">No tasks for today</div>
      ` : `
        <div class="max-h-[300px] overflow-y-auto px-1">
          ${dueTasks.length > 0 ? `
            <div class="px-3 pt-2 pb-1">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>
                <span class="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Due</span>
                <span class="text-[10px] text-red-400">${dueTasks.length}</span>
              </div>
            </div>
            <div class="space-y-0.5">${dueTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
          ` : ''}
          ${otherTodayTasks.length > 0 ? `
            <div class="space-y-0.5">${otherTodayTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
          ` : ''}
          ${startingTasks.length > 0 ? `
            <div class="px-3 pt-2 pb-1 ${dueTasks.length > 0 || otherTodayTasks.length > 0 ? 'mt-1 border-t border-[var(--border-light)]' : ''}">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span class="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">Starting</span>
                <span class="text-[10px] text-blue-400">${startingTasks.length}</span>
              </div>
            </div>
            <div class="space-y-0.5">${startingTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
          ` : ''}
          ${totalCount > 8 ? '<div class="px-3 py-3 text-center"><button onclick="showPerspectiveTasks(\'today\')" class="text-sm text-[var(--accent)] hover:underline font-medium">View all ' + totalCount + ' tasks \u2192</button></div>' : ''}
        </div>
      `;
      break;
    }

    case 'next-tasks': {
      const nextTasks = nextLabel ? state.tasksData.filter(t => {
        if (t.completed || t.isNote) return false;
        const isNextTagged = (t.labels || []).includes(nextLabel.id);
        if (!isNextTagged) return false;
        const isDatedTask = t.status === 'today' || t.dueDate === today || (t.dueDate && t.dueDate < today);
        return !isDatedTask;
      }) : [];

      content = nextTasks.length === 0 ? `
        <div class="py-8 text-center text-[var(--text-muted)] text-sm">No tasks tagged "Next"</div>
      ` : `
        <div class="space-y-0.5 max-h-[300px] overflow-y-auto px-1">
          ${nextTasks.slice(0, 8).map(task => renderTaskItem(task, false, true)).join('')}
          ${nextTasks.length > 8 ? '<div class="px-3 py-3 text-center"><button onclick="showLabelTasks(\'' + nextLabel.id + '\')" class="text-sm text-[var(--accent)] hover:underline font-medium">View all ' + nextTasks.length + ' tasks \u2192</button></div>' : ''}
        </div>
      `;
      break;
    }

    case 'daily-entry': {
      const todayData = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
      const prayerData = todayData.prayers || {};
      const glucoseData = todayData.glucose || {};
      const whoopData = todayData.whoop || {};
      const habitsData = todayData.habits || {};

      // Calculate completion for progress indicators
      const prayerFields = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const prayersDone = prayerFields.filter(f => prayerData[f] && parseFloat(prayerData[f]) > 0).length;
      const habitFields = ['exercise', 'reading', 'meditation', 'water', 'vitamins'];
      const habitsDone = habitFields.filter(f => habitsData[f]).length;

      content = `
        <div class="space-y-4">
          <!-- Prayers Section -->
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">\uD83D\uDD4C Prayers</span>
              <span class="text-xs text-[var(--text-muted)] font-medium">${prayersDone}/5</span>
            </div>
            <div class="grid grid-cols-6 gap-2">
              ${['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p, i) => {
                const labels = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                const shortLabels = ['F', 'D', 'A', 'M', 'I'];
                return '<div class="text-center">' +
                  '<label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">' + shortLabels[i] + '</label>' +
                  '<input type="number" step="0.1" min="0" max="1" value="' + (prayerData[p] || '') + '" placeholder="0"' +
                  ' onchange="updateDailyField(\'prayers\', \'' + p + '\', this.value)"' +
                  ' class="w-full px-2 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">' +
                  '</div>';
              }).join('')}
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">\uD83D\uDCD6</label>
                <input type="number" step="0.1" value="${prayerData.quran || ''}" placeholder="0"
                  onchange="updateDailyField('prayers', 'quran', this.value)"
                  class="w-full px-2 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
            </div>
          </div>

          <!-- Glucose Section -->
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">\uD83D\uDC89 Glucose</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Avg</label>
                <input type="number" value="${glucoseData.avg || ''}" placeholder="--"
                  onchange="updateDailyField('glucose', 'avg', this.value)"
                  class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">TIR %</label>
                <input type="number" value="${glucoseData.tir || ''}" placeholder="--"
                  onchange="updateDailyField('glucose', 'tir', this.value)"
                  class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Insulin</label>
                <input type="number" value="${glucoseData.insulin || ''}" placeholder="--"
                  onchange="updateDailyField('glucose', 'insulin', this.value)"
                  class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
            </div>
          </div>

          <!-- Whoop Section -->
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">\u23F1\uFE0F Whoop</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Sleep %</label>
                <input type="number" value="${whoopData.sleepPerf || ''}" placeholder="--"
                  onchange="updateDailyField('whoop', 'sleepPerf', this.value)"
                  class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Recovery</label>
                <input type="number" value="${whoopData.recovery || ''}" placeholder="--"
                  onchange="updateDailyField('whoop', 'recovery', this.value)"
                  class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
              <div class="text-center">
                <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Strain</label>
                <input type="number" value="${whoopData.strain || ''}" placeholder="--"
                  onchange="updateDailyField('whoop', 'strain', this.value)"
                  class="w-full px-3 py-2 text-center text-sm font-medium bg-[var(--bg-input)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)]">
              </div>
            </div>
          </div>

          <!-- Habits Section -->
          <div class="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-light)]">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">\u2728 Habits</span>
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
          </div>
        </div>
      `;
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
    'next-tasks': THINGS3_ICONS.next,
    'daily-entry': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>'
  };

  const widgetColors = {
    'stats': '#6B7280',
    'quick-add': '#147EFB',
    'today-tasks': '#FFCA28',
    'next-tasks': '#8B5CF6',
    'daily-entry': '#F97316'
  };

  // Quick-add widget has minimal styling (no border, no background, no header)
  if (widget.type === 'quick-add' && !isEditing) {
    return `
      <div class="widget ${sizeClass} widget-drop-target">
        <div class="py-2">
          ${content}
        </div>
      </div>
    `;
  }

  return `
    <div class="widget ${sizeClass} bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden widget-drop-target ${isEditing ? 'cursor-grab' : ''}"
      ${isEditing ? `draggable="true" ondragstart="handleWidgetDragStart(event, '${widget.id}')" ondragend="handleWidgetDragEnd(event)" ondragover="handleWidgetDragOver(event, '${widget.id}')" ondragleave="handleWidgetDragLeave(event)" ondrop="handleWidgetDrop(event, '${widget.id}')"` : ''}>
      <div class="px-4 py-2 border-b border-[var(--border-light)] flex items-center gap-2">
        ${isEditing ? '<div class="text-[var(--text-muted)]/30 cursor-grab"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>' : ''}
        <span style="color: ${widgetColors[widget.type] || '#6B7280'}">${widgetIcons[widget.type] || ''}</span>
        <h3 class="text-sm font-medium text-[var(--text-primary)]">${widget.title}</h3>
        ${editControls}
      </div>
      <div class="p-4">
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
  const todayData = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
  const rawScores = calculateScores(todayData);
  // Safe defaults for all score properties
  const scores = {
    total: rawScores?.total ?? 0,
    prayer: rawScores?.prayer ?? 0,
    diabetes: rawScores?.diabetes ?? 0,
    whoop: rawScores?.whoop ?? 0,
    family: rawScores?.family ?? 0,
    habit: rawScores?.habit ?? 0,
    prayerOnTime: rawScores?.prayerOnTime ?? 0,
    prayerLate: rawScores?.prayerLate ?? 0
  };

  // Get visible widgets sorted by order
  const visibleWidgets = state.homeWidgets.filter(w => w.visible).sort((a, b) => a.order - b.order);
  const hiddenWidgets = state.homeWidgets.filter(w => !w.visible);

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div class="home-greeting-row flex items-center gap-3">
            <h1 class="text-2xl font-bold text-charcoal">Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Muhammad</h1>
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
        <div class="flex items-center gap-3">
          ${state.editingHomeWidgets ? `
            <button onclick="resetHomeWidgets()" class="text-sm text-charcoal/50 hover:text-charcoal px-3 py-1.5 rounded-lg hover:bg-charcoal/5 transition">
              Reset Layout
            </button>
          ` : ''}
          <button onclick="toggleEditHomeWidgets()" class="text-sm px-3 py-1.5 rounded-lg transition ${state.editingHomeWidgets ? 'bg-coral text-white' : 'text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5'}">
            ${state.editingHomeWidgets ? '\u2713 Done' : '<span class="inline-flex items-center gap-1">' + THINGS3_ICONS.settings + ' Customize</span>'}
          </button>
        </div>
      </div>

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
      <div class="grid grid-cols-2 gap-4">
        ${visibleWidgets.map(widget => renderHomeWidget(widget, state.editingHomeWidgets)).join('')}
      </div>

      <!-- Today's Score Summary -->
      <div class="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-light)]">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-[var(--text-primary)]">Today's Score</h3>
            <p class="text-4xl font-bold mt-1 text-[var(--accent)]">${scores.total.toFixed(0)} <span class="text-lg font-normal text-[var(--text-muted)]">/ ${state.MAX_SCORES.total}</span></p>
          </div>
          <div class="text-right">
            <div class="text-sm text-[var(--text-muted)]">Progress</div>
            <div class="text-2xl font-bold text-[var(--text-primary)]">${Math.round((scores.total / state.MAX_SCORES.total) * 100)}%</div>
          </div>
        </div>
        <div class="h-2 bg-[var(--bg-secondary)] rounded-full mt-4 overflow-hidden">
          <div class="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style="width: ${Math.min((scores.total / state.MAX_SCORES.total) * 100, 100)}%"></div>
        </div>
        <div class="grid grid-cols-5 gap-2 mt-4">
          <div class="text-center">
            <div class="text-xs text-[var(--text-muted)]">Prayers</div>
            <div class="font-semibold text-[var(--text-primary)]">${scores.prayer.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-[var(--text-muted)]">Glucose</div>
            <div class="font-semibold text-[var(--text-primary)]">${scores.diabetes.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-[var(--text-muted)]">Whoop</div>
            <div class="font-semibold text-[var(--text-primary)]">${scores.whoop.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-[var(--text-muted)]">Family</div>
            <div class="font-semibold text-[var(--text-primary)]">${scores.family.toFixed(0)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-[var(--text-muted)]">Habits</div>
            <div class="font-semibold text-[var(--text-primary)]">${scores.habit.toFixed(0)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
