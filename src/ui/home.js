// ============================================================================
// HOME TAB MODULE
// ============================================================================
// Renders the Home dashboard: tab shell, widget grid, gsheet handlers.
// Individual widget content renderers live in home-widgets.js.

import { state } from '../state.js';
import { getLocalDateString, escapeHtml, isMobile, isMobileViewport } from '../utils.js';
import { THINGS3_ICONS, getActiveIcons, WEATHER_ICONS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, GSHEET_SAVED_PROMPT_KEY, GSHEET_RESPONSE_CACHE_KEY } from '../constants.js';
import {
  renderStatsWidget, renderQuickAddWidget, renderTodayTasksWidget,
  renderNextTasksWidget, renderTodayEventsWidget, renderPrayersWidget,
  renderGlucoseWidget, renderWhoopWidget, renderHabitsWidget,
  renderScoreWidget, renderWeatherWidget, renderPerspectiveWidget,
  renderGSheetWidget, WIDGET_ICONS, WIDGET_COLORS, getWidgetColor
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
  const isMobileView = isMobile();

  const sizeClass = isMobileView
    ? 'col-span-2'
    : (widget.size === 'full' ? 'col-span-2' : widget.size === 'half' ? 'col-span-1' : 'col-span-1');

  const sizeLabels = { full: 'Full', half: 'Half', third: 'Third' };
  const isPerspectiveWidget = widget.type === 'perspective';
  const editControls = isEditing ? `
    <div class="flex items-center gap-1 ml-auto">
      <button onclick="event.stopPropagation(); toggleWidgetSize('${widget.id}')"
        class="widget-resize-btn flex items-center gap-1.5 px-2 py-1 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded transition border border-[var(--border-light)] hover:border-[var(--accent)]"
        title="Click to resize">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          ${widget.size === 'full'
            ? '<rect x="3" y="3" width="18" height="18" rx="2"/>'
            : '<rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1" opacity="0.3"/>'}
        </svg>
        <span class="text-[11px] font-medium uppercase">${sizeLabels[widget.size] || 'Half'}</span>
      </button>
      ${isPerspectiveWidget ? `
        <button onclick="event.stopPropagation(); removePerspectiveWidget('${widget.id}')" class="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded transition" title="Remove widget">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      ` : `
        <button onclick="event.stopPropagation(); toggleWidgetVisibility('${widget.id}')" class="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded transition" title="Hide widget">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
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
  const content = renderer ? renderer() : '<div class="py-4 text-center text-[var(--text-muted)]">Unknown widget type</div>';

  // Resolve icon and color for perspective widgets
  const widgetIcons = { ...WIDGET_ICONS };
  const widgetColors = {};
  for (const key of Object.keys(WIDGET_COLORS)) widgetColors[key] = getWidgetColor(key);
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
    <div class="widget ${sizeClass} bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden widget-drop-target ${isEditing ? 'cursor-grab' : ''}"
      ${isEditing ? `draggable="true" ondragstart="handleWidgetDragStart(event, '${widget.id}')" ondragend="handleWidgetDragEnd(event)" ondragover="handleWidgetDragOver(event, '${widget.id}')" ondragleave="handleWidgetDragLeave(event)" ondrop="handleWidgetDrop(event, '${widget.id}')"` : ''}>
      <div class="widget-header px-4 py-2 border-b border-[var(--border-light)] flex items-center gap-2">
        ${isEditing ? '<div class="text-[var(--text-muted)]/30 cursor-grab"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>' : ''}
        <span style="color: ${widgetColors[widget.type] || '#6B7280'}">${widgetIcons[widget.type] || ''}</span>
        <h3 class="widget-title text-sm font-medium text-[var(--text-primary)]">${escapeHtml(widget.title)}</h3>
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
  const isMobileView = isMobile();

  // On mobile, always render all widgets in the configured order so critical cards
  // (like Today) and any hidden cards remain accessible.
  const visibleWidgets = isMobileView ? sortedWidgets : sortedWidgets.filter(w => w.visible);
  const hiddenWidgets = isMobileView ? [] : sortedWidgets.filter(w => !w.visible);

  return `
    <div class="space-y-6">
      <!-- Large title sentinel for IntersectionObserver -->
      <div id="large-title-sentinel" class="md:hidden" style="height:1px;margin:0;padding:0;"></div>
      <!-- Header -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div class="home-greeting-row flex items-center gap-3">
            <h1 class="home-large-title text-2xl font-bold text-[var(--text-primary)]">Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}</h1>
            ${state.weatherData ? `
              <div class="weather-inline flex items-center gap-2 text-[var(--text-secondary)]" title="${state.weatherData.city}">
                <span class="text-base">${WEATHER_ICONS[state.weatherData.weatherCode] || '\uD83C\uDF21\uFE0F'}</span>
                <span class="text-sm font-semibold">${state.weatherData.temp}\u00B0</span>
                <span class="text-[11px] text-[var(--text-muted)] font-medium">\u2191${state.weatherData.tempMax}\u00B0 <span class="text-[var(--text-muted)]">${state.weatherData.maxHour || ''}</span></span>
                <span class="text-[11px] text-[var(--text-muted)] font-medium">\u2193${state.weatherData.tempMin}\u00B0 <span class="text-[var(--text-muted)]">${state.weatherData.minHour || ''}</span></span>
              </div>
            ` : ''}
          </div>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-[var(--text-secondary)] text-sm">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <span class="text-[var(--text-muted)] hidden md:inline">\u2022</span>
            <p class="text-[var(--text-muted)] text-xs hidden md:block">Press <kbd class="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded text-[11px] font-mono">\u2318K</kbd> to quick add</p>
          </div>
          ${isMobileViewport() ? `
          <div class="mobile-search-pill mt-3 md:hidden" onclick="showGlobalSearch = true; render()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Search tasks, events...</span>
          </div>
          ` : ''}
        </div>
        <div class="home-header-actions flex items-center gap-3">
          ${state.editingHomeWidgets ? `
            <button onclick="showAddWidgetPicker = !showAddWidgetPicker; render()" class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Widget
            </button>
            <button onclick="resetHomeWidgets()" class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition">
              Reset Layout
            </button>
          ` : ''}
          <button onclick="toggleEditHomeWidgets()" class="text-sm px-3 py-1.5 rounded-lg transition ${state.editingHomeWidgets ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}">
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
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)]">Add Perspective Widget</h3>
              <button onclick="showAddWidgetPicker = false; render()" class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${pickerPerspectives.map(p => {
                const isAdded = addedIds.has(p.id);
                return `
                  <button ${isAdded ? 'disabled' : `onclick="addPerspectiveWidget('${p.id}')"`}
                    class="flex items-center gap-2 px-3 py-3.5 sm:py-2.5 rounded-lg border transition text-left ${isAdded
                      ? 'border-[var(--border-light)] bg-[var(--bg-secondary)] opacity-50 cursor-default'
                      : 'border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 cursor-pointer'}">
                    <span style="color: ${p.color}">${p.icon || ''}</span>
                    <span class="text-sm text-[var(--text-primary)] truncate">${escapeHtml(p.name)}</span>
                    ${isAdded ? '<svg class="w-3.5 h-3.5 text-green-500 ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      })() : ''}

      ${state.editingHomeWidgets && hiddenWidgets.length > 0 ? `
        <!-- Hidden Widgets -->
        <div class="bg-[var(--bg-secondary)] rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <span class="text-sm font-medium text-[var(--text-muted)]">Hidden Widgets</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${hiddenWidgets.map(w => `
              <button onclick="toggleWidgetVisibility('${w.id}')" class="text-sm px-3 py-1.5 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ${w.title}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Daily Focus Card — hidden permanently -->
      ${''}

      <!-- Widget Grid -->
      <div class="widget-grid grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-2'} gap-4">
        ${visibleWidgets.map(widget => renderHomeWidget(widget, state.editingHomeWidgets)).join('')}
      </div>
    </div>
  `;
}
