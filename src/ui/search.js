// ============================================================================
// GLOBAL SEARCH — Cmd+K spotlight-style search overlay
// ============================================================================
// Searches across tasks, notes, areas, categories, labels, people,
// perspectives, and triggers. Supports type-filter chips and keyboard nav.

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';
import { BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE } from '../constants.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEARCH_TYPES = [
  { key: 'task',        label: 'Tasks',        icon: '☑️',  prefix: null },
  { key: 'note',        label: 'Notes',        icon: '📝', prefix: null },
  { key: 'area',        label: 'Areas',        icon: '📦', prefix: '#' },
  { key: 'category',    label: 'Categories',   icon: '📂', prefix: null },
  { key: 'label',       label: 'Labels',       icon: '🏷️',  prefix: '@' },
  { key: 'person',      label: 'People',       icon: '👤', prefix: '&' },
  { key: 'perspective', label: 'Perspectives', icon: '🔭', prefix: null },
  { key: 'trigger',     label: 'Triggers',     icon: '⚡', prefix: null },
];

const TYPE_LIMITS_ALL = { task: 8, note: 5, area: 5, category: 5, label: 5, person: 5, perspective: 5, trigger: 5 };
const FILTERED_LIMIT = 30;
const TOTAL_CAP = 50;
const DEBOUNCE_MS = 150;

let debounceTimer = null;

// ---------------------------------------------------------------------------
// Helpers: sanitize user-supplied values for safe HTML insertion
// ---------------------------------------------------------------------------

/** Sanitize a CSS color value — allow only safe color formats */
function safeColor(color) {
  if (!color || typeof color !== 'string') return '';
  // Allow hex colors, rgb/rgba, hsl/hsla, and CSS var() references
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return color;
  if (/^(rgb|hsl)a?\([^)]+\)$/.test(color)) return color;
  if (/^var\(--[\w-]+\)$/.test(color)) return color;
  return '';
}

/** Strip query prefix (#, @, &) to get the actual search term */
function stripPrefix(query) {
  if (!query) return '';
  const trimmed = query.trim();
  if (trimmed.length > 0 && ['#', '@', '&'].includes(trimmed[0])) {
    return trimmed.slice(1).trim();
  }
  return trimmed;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function openGlobalSearch() {
  state.showGlobalSearch = true;
  state.globalSearchQuery = '';
  state.globalSearchResults = [];
  state.globalSearchActiveIndex = -1;
  state.globalSearchTypeFilter = null;
  window.render();
  // Focus input after render
  setTimeout(() => {
    const input = document.getElementById('global-search-input');
    if (input) input.focus();
  }, 50);
}

export function closeGlobalSearch() {
  state.showGlobalSearch = false;
  state.globalSearchQuery = '';
  state.globalSearchResults = [];
  state.globalSearchActiveIndex = -1;
  state.globalSearchTypeFilter = null;
  if (debounceTimer) { clearTimeout(debounceTimer); debounceTimer = null; }
  // NOTE: does NOT call render() — callers handle rendering to avoid double-render
}

export function handleGlobalSearchInput(value) {
  state.globalSearchQuery = value;

  // [Bug 3/4/14 fix] Detect prefix shortcuts and auto-set type filter;
  // reset filter when prefix is removed
  const prefixMap = { '#': 'area', '@': 'label', '&': 'person' };
  const firstChar = value.length > 0 ? value[0] : '';
  if (prefixMap[firstChar]) {
    const detectedType = prefixMap[firstChar];
    if (state.globalSearchTypeFilter !== detectedType) {
      state.globalSearchTypeFilter = detectedType;
      updateChipsDOM(); // [Bug 4 fix] update chips immediately
    }
  } else if (state.globalSearchTypeFilter) {
    // [Bug 3 fix] Only auto-reset if the current filter was set by a prefix
    // (check if it matches one of the prefix types)
    const prefixTypes = Object.values(prefixMap);
    if (prefixTypes.includes(state.globalSearchTypeFilter)) {
      state.globalSearchTypeFilter = null;
      updateChipsDOM();
    }
  }

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const results = performGlobalSearch(value, state.globalSearchTypeFilter);
    state.globalSearchResults = results;
    state.globalSearchActiveIndex = getFlatItems(results).length > 0 ? 0 : -1;
    updateResultsDOM();
  }, DEBOUNCE_MS);
}

export function handleGlobalSearchKeydown(event) {
  const flatItems = getFlatItems();
  const total = flatItems.length;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (total > 0) {
      state.globalSearchActiveIndex = (state.globalSearchActiveIndex + 1) % total;
      updateResultsDOM();
      scrollActiveIntoView(); // [Bug 2 fix]
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (total > 0) {
      state.globalSearchActiveIndex = (state.globalSearchActiveIndex - 1 + total) % total;
      updateResultsDOM();
      scrollActiveIntoView(); // [Bug 2 fix]
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (state.globalSearchActiveIndex >= 0 && state.globalSearchActiveIndex < total) {
      selectGlobalSearchResult(state.globalSearchActiveIndex);
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation(); // [Bug 1 fix] prevent main.js handler from also firing
    closeGlobalSearch();
    window.render();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    cycleTypeFilter(event.shiftKey);
  }
}

export function selectGlobalSearchResult(index) {
  const flatItems = getFlatItems();
  if (index < 0 || index >= flatItems.length) return;
  const item = flatItems[index];
  // [Bug 1 fix] Close search state WITHOUT rendering, then navigate (which renders once)
  closeGlobalSearch();
  navigateToResult(item);
}

export function setSearchTypeFilter(type) {
  // [Bug 14 fix] When user explicitly clicks a chip, also clear any prefix from query
  const prevFilter = state.globalSearchTypeFilter;
  state.globalSearchTypeFilter = prevFilter === type ? null : type;

  // Re-run search with new filter
  const results = performGlobalSearch(state.globalSearchQuery, state.globalSearchTypeFilter);
  state.globalSearchResults = results;
  state.globalSearchActiveIndex = getFlatItems(results).length > 0 ? 0 : -1;
  updateResultsDOM();
  updateChipsDOM();
  // Re-focus input
  const input = document.getElementById('global-search-input');
  if (input) input.focus();
}

// ---------------------------------------------------------------------------
// Search Engine
// ---------------------------------------------------------------------------

function performGlobalSearch(rawQuery, typeFilter) {
  const query = stripPrefix(rawQuery);
  if (!query) return [];

  const lower = query.toLowerCase();
  const groups = [];

  const typesToSearch = typeFilter
    ? SEARCH_TYPES.filter(t => t.key === typeFilter)
    : SEARCH_TYPES;

  for (const searchType of typesToSearch) {
    const items = searchEntities(searchType.key, lower, query);
    if (items.length > 0) {
      const limit = typeFilter ? FILTERED_LIMIT : (TYPE_LIMITS_ALL[searchType.key] || 5);
      groups.push({
        type: searchType.key,
        label: searchType.label,
        icon: searchType.icon,
        items: items.slice(0, limit),
      });
    }
  }

  // Enforce total cap when showing all types
  if (!typeFilter) {
    let total = 0;
    for (const group of groups) {
      const remaining = TOTAL_CAP - total;
      if (remaining <= 0) { group.items = []; continue; }
      if (group.items.length > remaining) group.items = group.items.slice(0, remaining);
      total += group.items.length;
    }
  }

  return groups.filter(g => g.items.length > 0);
}

function searchEntities(type, lower, original) {
  const results = [];

  switch (type) {
    case 'task': {
      // [Bug 18 fix] Include completed tasks but with a score penalty
      const tasks = (state.tasksData || []).filter(t => !t.isNote && t.title);
      for (const task of tasks) {
        let score = scoreMatch(task.title, lower) + (task.notes ? scoreNotesMatch(task.notes, lower) : 0);
        if (score > 0) {
          // Penalize completed tasks so they rank lower
          if (task.completed) score = Math.max(1, Math.floor(score * 0.4));
          const area = task.areaId ? (state.taskAreas || []).find(a => a.id === task.areaId) : null;
          const statusLabel = task.completed ? 'Completed'
            : (task.status === 'today' || task.today) ? 'Today'
            : task.status || 'inbox';
          results.push({
            id: task.id, type: 'task', title: task.title, score,
            subtitle: [area?.name, statusLabel].filter(Boolean).join(' · '),
            icon: task.completed ? '✅' : task.flagged ? '🚩' : '☑️',
            color: safeColor(area?.color) || 'var(--accent)',
          });
        }
      }
      break;
    }
    case 'note': {
      const notes = (state.tasksData || []).filter(t => t.isNote && t.noteLifecycleState !== 'deleted' && t.title);
      for (const note of notes) {
        const score = scoreMatch(note.title, lower);
        if (score > 0) {
          const area = note.areaId ? (state.taskAreas || []).find(a => a.id === note.areaId) : null;
          results.push({
            id: note.id, type: 'note', title: note.title, score,
            subtitle: area?.name || 'No area',
            icon: '📝', color: safeColor(area?.color) || 'var(--text-muted)',
          });
        }
      }
      break;
    }
    case 'area': {
      const areas = state.taskAreas || [];
      for (const area of areas) {
        const score = scoreMatch(area.name, lower);
        if (score > 0) {
          const taskCount = (state.tasksData || []).filter(t => t.areaId === area.id && !t.completed && !t.isNote).length;
          results.push({
            id: area.id, type: 'area', title: area.name, score,
            subtitle: `${taskCount} task${taskCount !== 1 ? 's' : ''}`,
            icon: area.emoji || area.icon || '📦', color: safeColor(area.color) || 'var(--accent)',
          });
        }
      }
      break;
    }
    case 'category': {
      const categories = state.taskCategories || [];
      for (const cat of categories) {
        const score = scoreMatch(cat.name, lower);
        if (score > 0) {
          const area = cat.areaId ? (state.taskAreas || []).find(a => a.id === cat.areaId) : null;
          results.push({
            id: cat.id, type: 'category', title: cat.name, score,
            subtitle: area?.name || '',
            icon: cat.emoji || '📂', color: safeColor(cat.color || area?.color) || 'var(--accent)',
          });
        }
      }
      break;
    }
    case 'label': {
      const labels = state.taskLabels || [];
      for (const label of labels) {
        const score = scoreMatch(label.name, lower);
        if (score > 0) {
          const taskCount = (state.tasksData || []).filter(t => !t.completed && !t.isNote && (t.labels || []).includes(label.id)).length;
          results.push({
            id: label.id, type: 'label', title: label.name, score,
            subtitle: `${taskCount} task${taskCount !== 1 ? 's' : ''}`,
            icon: '🏷️', color: safeColor(label.color) || '#6B7280',
          });
        }
      }
      break;
    }
    case 'person': {
      const people = state.taskPeople || [];
      for (const person of people) {
        const nameScore = scoreMatch(person.name, lower);
        const emailScore = person.email ? scoreMatch(person.email, lower) * 0.8 : 0;
        const titleScore = person.jobTitle ? scoreMatch(person.jobTitle, lower) * 0.6 : 0;
        const score = Math.max(nameScore, emailScore, titleScore);
        if (score > 0) {
          results.push({
            id: person.id, type: 'person', title: person.name, score,
            subtitle: [person.jobTitle, person.email].filter(Boolean).join(' · '),
            icon: '👤', color: '#6B7280',
          });
        }
      }
      break;
    }
    case 'perspective': {
      // [Bug 17 fix] Search both builtin AND custom perspectives
      const builtins = Array.from(BUILTIN_PERSPECTIVES).map(p => ({ ...p, _builtin: true }));
      const notesPerspective = { ...NOTES_PERSPECTIVE, _builtin: true };
      const customs = (state.customPerspectives || []).map(p => ({ ...p, _builtin: false }));
      const allPerspectives = [...builtins, notesPerspective, ...customs];
      for (const p of allPerspectives) {
        const score = scoreMatch(p.name, lower);
        if (score > 0) {
          results.push({
            id: p.id, type: 'perspective', title: p.name, score,
            subtitle: p._builtin ? 'Built-in perspective' : 'Custom perspective',
            icon: '🔭', color: safeColor(p.color) || 'var(--accent)',
          });
        }
      }
      break;
    }
    case 'trigger': {
      const triggers = state.triggers || [];
      for (const trig of triggers) {
        if (!trig.title) continue;
        const score = scoreMatch(trig.title, lower);
        if (score > 0) {
          const area = trig.areaId ? (state.taskAreas || []).find(a => a.id === trig.areaId) : null;
          results.push({
            id: trig.id, type: 'trigger', title: trig.title, score,
            subtitle: area?.name || '',
            icon: '⚡', color: safeColor(area?.color) || 'var(--text-muted)',
          });
        }
      }
      break;
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function scoreMatch(text, lower) {
  if (!text) return 0;
  const textLower = text.toLowerCase();
  if (textLower === lower) return 150; // exact match
  if (textLower.startsWith(lower)) return 100; // starts with
  // Word boundary match
  const words = textLower.split(/[\s\-_/]+/);
  if (words.some(w => w.startsWith(lower))) return 60;
  // Substring match
  if (textLower.includes(lower)) return 30;
  return 0;
}

function scoreNotesMatch(notes, lower) {
  if (!notes) return 0;
  if (notes.toLowerCase().includes(lower)) return 10;
  return 0;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function navigateToResult(item) {
  switch (item.type) {
    case 'task':
    case 'note':
      state.editingTaskId = item.id;
      state.showTaskModal = true;
      window.render();
      break;
    case 'area':
      window.showAreaTasks(item.id);
      break;
    case 'category':
      window.showCategoryTasks(item.id);
      break;
    case 'label':
      window.showLabelTasks(item.id);
      break;
    case 'person':
      window.showPersonTasks(item.id);
      break;
    case 'perspective':
      window.showPerspectiveTasks(item.id);
      break;
    case 'trigger': {
      const trig = (state.triggers || []).find(t => t.id === item.id);
      if (trig?.areaId) {
        window.showAreaTasks(trig.areaId);
      } else {
        state.activeTab = 'tasks';
        window.render();
      }
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFlatItems(groups) {
  const source = groups || state.globalSearchResults;
  const items = [];
  for (const group of source) {
    for (const item of group.items) {
      items.push(item);
    }
  }
  return items;
}

function cycleTypeFilter(reverse) {
  const keys = [null, ...SEARCH_TYPES.map(t => t.key)];
  const current = keys.indexOf(state.globalSearchTypeFilter);
  const next = reverse
    ? (current - 1 + keys.length) % keys.length
    : (current + 1) % keys.length;
  state.globalSearchTypeFilter = keys[next];
  const results = performGlobalSearch(state.globalSearchQuery, state.globalSearchTypeFilter);
  state.globalSearchResults = results;
  state.globalSearchActiveIndex = getFlatItems(results).length > 0 ? 0 : -1;
  updateResultsDOM();
  updateChipsDOM();
}

// [Bug 8 fix] Highlight on the raw text FIRST, then escape the non-matched parts
function highlightMatch(text, query) {
  if (!text || !query) return escapeHtml(text || '');
  const cleanQuery = stripPrefix(query);
  if (!cleanQuery) return escapeHtml(text);
  const lower = text.toLowerCase();
  const qLower = cleanQuery.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return escapeHtml(text);
  // Split raw text, escape each part, wrap match in <mark>
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + cleanQuery.length);
  const after = text.slice(idx + cleanQuery.length);
  return `${escapeHtml(before)}<mark class="global-search-highlight">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
}

// [Bug 2 fix] Scroll active result into view within the results container
function scrollActiveIntoView() {
  requestAnimationFrame(() => {
    const container = document.getElementById('global-search-results');
    const active = container?.querySelector('.global-search-result.active');
    if (active && container) {
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

// ---------------------------------------------------------------------------
// Targeted DOM updates (avoid full render for keyboard nav)
// ---------------------------------------------------------------------------

function updateResultsDOM() {
  const container = document.getElementById('global-search-results');
  if (!container) return;
  container.innerHTML = renderResultsInnerHtml();
}

function updateChipsDOM() {
  const container = document.getElementById('global-search-type-filters');
  if (!container) return;
  container.innerHTML = renderChipsInnerHtml();
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

export function renderGlobalSearchHtml() {
  if (!state.showGlobalSearch) return '';

  // [Bug 15 fix] ARIA attributes for accessibility
  return `
    <div class="global-search-overlay" onclick="if(event.target===this){closeGlobalSearch();render()}" role="dialog" aria-modal="true" aria-label="Search">
      <div class="global-search-modal">
        <div class="global-search-input-wrapper">
          <svg class="global-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search tasks, areas, labels, people..."
            value="${escapeHtml(state.globalSearchQuery)}"
            oninput="handleGlobalSearchInput(this.value)"
            onkeydown="handleGlobalSearchKeydown(event)"
            autocomplete="off"
            spellcheck="false"
            role="combobox"
            aria-expanded="true"
            aria-controls="global-search-results"
            aria-autocomplete="list"
          />
          <kbd class="global-search-esc" onclick="closeGlobalSearch();render()" aria-label="Close search">ESC</kbd>
        </div>
        <div id="global-search-type-filters" class="global-search-type-filters" role="toolbar" aria-label="Filter by type">
          ${renderChipsInnerHtml()}
        </div>
        <div id="global-search-results" class="global-search-results" role="listbox" aria-label="Search results">
          ${renderResultsInnerHtml()}
        </div>
        <div class="global-search-footer" aria-hidden="true">
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
          <span><kbd>&crarr;</kbd> Open</span>
          <span><kbd>Tab</kbd> Filter</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>`;
}

function renderChipsInnerHtml() {
  const active = state.globalSearchTypeFilter;
  // [Bug 13 fix] type="button" on all chips
  let html = `<button type="button" class="global-search-type-chip ${active === null ? 'active' : ''}" onclick="setSearchTypeFilter(null);event.stopPropagation()" aria-pressed="${active === null}">All</button>`;
  for (const t of SEARCH_TYPES) {
    const isActive = active === t.key;
    html += `<button type="button" class="global-search-type-chip ${isActive ? 'active' : ''}" onclick="setSearchTypeFilter('${t.key}');event.stopPropagation()" aria-pressed="${isActive}">${escapeHtml(t.icon)} ${escapeHtml(t.label)}</button>`;
  }
  return html;
}

function renderResultsInnerHtml() {
  const groups = state.globalSearchResults;
  const query = state.globalSearchQuery;

  // [Bug 5 fix] Check stripped query, not raw query, for empty state
  const strippedQuery = stripPrefix(query);

  if (!strippedQuery) {
    return `<div class="global-search-empty">
      <div class="global-search-empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
      <p>Type to search across everything</p>
      <p class="global-search-empty-hint">Use <kbd>#</kbd> for areas, <kbd>@</kbd> for labels, <kbd>&amp;</kbd> for people</p>
    </div>`;
  }

  if (!groups || groups.length === 0) {
    return `<div class="global-search-empty">
      <p>No results for "${escapeHtml(strippedQuery)}"</p>
    </div>`;
  }

  let html = '';
  let flatIdx = 0;

  for (const group of groups) {
    html += `<div class="global-search-group-header" aria-hidden="true">
      <span>${escapeHtml(group.icon)} ${escapeHtml(group.label)}</span>
      <span class="global-search-group-count">${group.items.length} found</span>
    </div>`;

    for (const item of group.items) {
      const isActive = flatIdx === state.globalSearchActiveIndex;
      const colorStyle = safeColor(item.color) ? `style="color:${safeColor(item.color)}"` : '';
      // [Bug 6 fix] safeColor() sanitizes the style value
      // [Bug 7 fix] escapeHtml() on icon to prevent XSS from user emoji data
      // [Bug 13 fix] type="button" on result buttons
      // [Bug 15 fix] role="option" for accessibility
      // [Bug 20 fix] Use data-idx attribute and a single delegated handler instead of hardcoded index
      html += `<button type="button" class="global-search-result ${isActive ? 'active' : ''}"
        role="option" aria-selected="${isActive}"
        data-result-idx="${flatIdx}"
        onclick="selectGlobalSearchResult(${flatIdx})"
        onmouseenter="this.parentElement.querySelector('.global-search-result.active')?.classList.remove('active');this.classList.add('active');state.globalSearchActiveIndex=${flatIdx}">
        <span class="global-search-result-icon" ${colorStyle}>${escapeHtml(item.icon)}</span>
        <div class="global-search-result-text">
          <span class="global-search-result-title">${highlightMatch(item.title, query)}</span>
          ${item.subtitle ? `<span class="global-search-result-subtitle">${escapeHtml(item.subtitle)}</span>` : ''}
        </div>
        <span class="global-search-result-badge">${escapeHtml(item.type)}</span>
      </button>`;
      flatIdx++;
    }
  }

  return html;
}
