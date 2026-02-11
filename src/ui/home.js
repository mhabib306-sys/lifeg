// ============================================================================
// HOME TAB MODULE
// ============================================================================
// Renders the Home dashboard: tab shell, widget grid, gsheet handlers.
// Individual widget content renderers live in home-widgets.js.

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import { THINGS3_ICONS, getActiveIcons, WEATHER_ICONS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, GSHEET_SAVED_PROMPT_KEY, GSHEET_RESPONSE_CACHE_KEY } from '../constants.js';
import {
  renderStatsWidget, renderQuickAddWidget, renderTodayTasksWidget,
  renderNextTasksWidget, renderTodayEventsWidget, renderPrayersWidget,
  renderGlucoseWidget, renderWhoopWidget, renderHabitsWidget,
  renderScoreWidget, renderWeatherWidget, renderPerspectiveWidget,
  renderGSheetWidget, WIDGET_ICONS, WIDGET_COLORS
} from './home-widgets.js';

// ---------------------------------------------------------------------------
// Window-bridge helpers (avoid circular imports)
// ---------------------------------------------------------------------------

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
// renderHomeWidget — thin dispatcher to widget renderers in home-widgets.js
// ============================================================================

/**
 * Render a single home widget card (chrome + content)
 */
export function renderHomeWidget(widget, isEditing) {
  const today = getLocalDateString();
  const isMobileView = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)').matches;

  const sizeClass = isMobileView
    ? 'col-span-2'
    : (widget.size === 'full' ? 'col-span-2' : widget.size === 'half' ? 'col-span-1' : 'col-span-1');

  const sizeLabels = { full: 'Full', half: 'Half', third: 'Third' };
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

  // Dispatch to the appropriate widget content renderer
  const widgetRenderers = {
    'stats': () => renderStatsWidget(today),
    'quick-add': () => renderQuickAddWidget(),
    'today-tasks': () => renderTodayTasksWidget(today),
    'next-tasks': () => renderNextTasksWidget(today),
    'today-events': () => renderTodayEventsWidget(today),
    'prayers': () => renderPrayersWidget(today),
    'glucose': () => renderGlucoseWidget(today),
    'whoop': () => renderWhoopWidget(today),
    'habits': () => renderHabitsWidget(today),
    'score': () => renderScoreWidget(today),
    'weather': () => renderWeatherWidget(),
    'perspective': () => renderPerspectiveWidget(widget, today),
    'gsheet-yesterday': () => renderGSheetWidget(today)
  };

  const renderer = widgetRenderers[widget.type];
  const content = renderer ? renderer() : '<div class="py-4 text-center text-charcoal/30">Unknown widget type</div>';

  // Resolve icon and color for perspective widgets
  const widgetIcons = { ...WIDGET_ICONS };
  const widgetColors = { ...WIDGET_COLORS };
  if (widget.type === 'perspective') {
    const allPersp = [...BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, ...(state.customPerspectives || [])];
    const persp = allPersp.find(p => p.id === widget.perspectiveId);
    if (persp) {
      widgetIcons['perspective'] = persp.icon || '';
      widgetColors['perspective'] = persp.color || '#6B7280';
    }
  }

  // Quick-add widget has minimal styling
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
// GSheet handlers
// ============================================================================

/**
 * Save the gsheet prompt and auto-run it.
 */
export async function handleGSheetSavePrompt() {
  const input = document.getElementById('gsheet-prompt-input');
  const prompt = (input?.value || '').trim();
  if (!prompt) return;

  localStorage.setItem(GSHEET_SAVED_PROMPT_KEY, prompt);
  state.gsheetEditingPrompt = false;
  state.gsheetAsking = true;
  state.gsheetResponse = null;
  window.render();

  try {
    const response = await window.askGSheet(prompt);
    state.gsheetResponse = response;
    localStorage.setItem(GSHEET_RESPONSE_CACHE_KEY, response);
  } catch (err) {
    state.gsheetResponse = `Error: ${err.message || 'Something went wrong'}`;
  } finally {
    state.gsheetAsking = false;
    window.render();
  }
}

/**
 * Enter prompt editing mode.
 */
export function handleGSheetEditPrompt() {
  state.gsheetEditingPrompt = true;
  window.render();
  setTimeout(() => {
    const input = document.getElementById('gsheet-prompt-input');
    if (input) { input.focus(); input.select(); }
  }, 50);
}

/**
 * Cancel prompt editing.
 */
export function handleGSheetCancelEdit() {
  state.gsheetEditingPrompt = false;
  window.render();
}

/**
 * Re-run the saved prompt (refresh output).
 */
export async function handleGSheetRefresh() {
  const prompt = localStorage.getItem(GSHEET_SAVED_PROMPT_KEY) || '';
  if (!prompt) return;

  state.gsheetAsking = true;
  state.gsheetResponse = null;
  window.render();

  try {
    const response = await window.askGSheet(prompt);
    state.gsheetResponse = response;
    localStorage.setItem(GSHEET_RESPONSE_CACHE_KEY, response);
  } catch (err) {
    state.gsheetResponse = `Error: ${err.message || 'Something went wrong'}`;
  } finally {
    state.gsheetAsking = false;
    window.render();
  }
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
  // If quick-add toggle is set to note mode
  if (state.quickAddIsNote) {
    options.isNote = true;
    options.status = 'anytime';
  }
  // Merge inline autocomplete metadata
  const inlineMeta = state.inlineAutocompleteMeta.get('home-quick-add-input');
  if (inlineMeta) {
    if (inlineMeta.areaId) options.areaId = inlineMeta.areaId;
    if (inlineMeta.categoryId) options.categoryId = inlineMeta.categoryId;
    if (inlineMeta.labels && inlineMeta.labels.length) options.labels = inlineMeta.labels;
    if (inlineMeta.people && inlineMeta.people.length) options.people = inlineMeta.people;
    if (inlineMeta.deferDate) options.deferDate = inlineMeta.deferDate;
    if (inlineMeta.dueDate) options.dueDate = inlineMeta.dueDate;
  }
  createTask(title, options);
  inputElement.value = '';
  state.quickAddIsNote = false;
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
            ${state.editingHomeWidgets ? '\u2713 Done' : '<span class="inline-flex items-center gap-1">' + getActiveIcons().settings + ' Customize</span>'}
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

      <!-- Daily Focus Card -->
      ${(() => {
        if (state.dailyFocusDismissed === today) return '';
        const focus = typeof window.getDailyFocus === 'function' ? window.getDailyFocus() : null;
        if (!focus) return '';
        return `
          <div class="daily-focus-card bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] p-4 flex items-start gap-3">
            <span class="text-xl flex-shrink-0 mt-0.5">\uD83D\uDCCC</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-[var(--text-primary)]">Focus Today: ${focus.displayName}</div>
              <div class="text-xs text-[var(--text-muted)] mt-0.5">Your 7-day avg is ${focus.avgPercent}% \u2014 ${focus.tip}</div>
            </div>
            <button onclick="state.dailyFocusDismissed = '${today}'; render()" class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition flex-shrink-0" title="Dismiss">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        `;
      })()}

      <!-- Widget Grid -->
      <div class="widget-grid grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2'} gap-4">
        ${visibleWidgets.map(widget => renderHomeWidget(widget, state.editingHomeWidgets)).join('')}
      </div>
    </div>
  `;
}
