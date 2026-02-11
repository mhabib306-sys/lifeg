// ============================================================================
// GLOBAL SEARCH — Cmd+K spotlight-style search overlay
// ============================================================================
// Searches across tasks, notes, areas, categories, labels, people,
// perspectives, and triggers. Supports type-filter chips and keyboard nav.

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';

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
  if (debounceTimer) clearTimeout(debounceTimer);
  window.render();
}

export function handleGlobalSearchInput(value) {
  state.globalSearchQuery = value;

  // Detect prefix shortcuts and auto-set type filter
  const prefixMap = { '#': 'area', '@': 'label', '&': 'person' };
  if (value.length >= 1 && prefixMap[value[0]]) {
    const detectedType = prefixMap[value[0]];
    if (state.globalSearchTypeFilter !== detectedType) {
      state.globalSearchTypeFilter = detectedType;
    }
  }

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const results = performGlobalSearch(value, state.globalSearchTypeFilter);
    state.globalSearchResults = results;
    state.globalSearchActiveIndex = results.length > 0 ? 0 : -1;
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
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (total > 0) {
      state.globalSearchActiveIndex = (state.globalSearchActiveIndex - 1 + total) % total;
      updateResultsDOM();
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (state.globalSearchActiveIndex >= 0 && state.globalSearchActiveIndex < total) {
      selectGlobalSearchResult(state.globalSearchActiveIndex);
    }
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeGlobalSearch();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    cycleTypeFilter(event.shiftKey);
  }
}

export function selectGlobalSearchResult(index) {
  const flatItems = getFlatItems();
  if (index < 0 || index >= flatItems.length) return;
  const item = flatItems[index];
  closeGlobalSearch();
  navigateToResult(item);
}

export function setSearchTypeFilter(type) {
  state.globalSearchTypeFilter = state.globalSearchTypeFilter === type ? null : type;
  // Re-run search with new filter
  const results = performGlobalSearch(state.globalSearchQuery, state.globalSearchTypeFilter);
  state.globalSearchResults = results;
  state.globalSearchActiveIndex = results.length > 0 ? 0 : -1;
  updateResultsDOM();
  // Update chip active state
  updateChipsDOM();
  // Re-focus input
  const input = document.getElementById('global-search-input');
  if (input) input.focus();
}

// ---------------------------------------------------------------------------
// Search Engine
// ---------------------------------------------------------------------------

function performGlobalSearch(rawQuery, typeFilter) {
  // Strip prefix characters for the actual search term
  let query = rawQuery.trim();
  if (query.length > 0 && ['#', '@', '&'].includes(query[0])) {
    query = query.slice(1).trim();
  }
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
      const tasks = (state.tasksData || []).filter(t => !t.isNote && !t.completed && t.title);
      for (const task of tasks) {
        const score = scoreMatch(task.title, lower) + (task.notes ? scoreNotesMatch(task.notes, lower) : 0);
        if (score > 0) {
          const area = task.areaId ? (state.taskAreas || []).find(a => a.id === task.areaId) : null;
          results.push({
            id: task.id, type: 'task', title: task.title, score,
            subtitle: [area?.name, task.status === 'today' || task.today ? 'Today' : task.status].filter(Boolean).join(' · '),
            icon: task.flagged ? '🚩' : '☑️',
            color: area?.color || 'var(--accent)',
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
            icon: '📝', color: area?.color || 'var(--text-muted)',
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
            icon: area.emoji || area.icon || '📦', color: area.color || 'var(--accent)',
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
            icon: cat.emoji || '📂', color: cat.color || area?.color || 'var(--accent)',
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
            icon: '🏷️', color: label.color || '#6B7280',
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
      const customs = state.customPerspectives || [];
      for (const p of customs) {
        const score = scoreMatch(p.name, lower);
        if (score > 0) {
          results.push({
            id: p.id, type: 'perspective', title: p.name, score,
            subtitle: 'Custom perspective',
            icon: '🔭', color: 'var(--accent)',
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
            icon: '⚡', color: area?.color || 'var(--text-muted)',
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
      // Switch to tasks tab with area filter if trigger has area
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

function getFlatItems() {
  const items = [];
  for (const group of state.globalSearchResults) {
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
  state.globalSearchActiveIndex = results.length > 0 ? 0 : -1;
  updateResultsDOM();
  updateChipsDOM();
}

function highlightMatch(text, query) {
  if (!text || !query) return escapeHtml(text || '');
  let cleanQuery = query.trim();
  if (cleanQuery.length > 0 && ['#', '@', '&'].includes(cleanQuery[0])) {
    cleanQuery = cleanQuery.slice(1).trim();
  }
  if (!cleanQuery) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const lower = escaped.toLowerCase();
  const qLower = cleanQuery.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return escaped;
  const before = escaped.slice(0, idx);
  const match = escaped.slice(idx, idx + cleanQuery.length);
  const after = escaped.slice(idx + cleanQuery.length);
  return `${before}<mark class="global-search-highlight">${match}</mark>${after}`;
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

  return `
    <div class="global-search-overlay" onclick="if(event.target===this)closeGlobalSearch()">
      <div class="global-search-modal">
        <div class="global-search-input-wrapper">
          <svg class="global-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          />
          <kbd class="global-search-esc" onclick="closeGlobalSearch()">ESC</kbd>
        </div>
        <div id="global-search-type-filters" class="global-search-type-filters">
          ${renderChipsInnerHtml()}
        </div>
        <div id="global-search-results" class="global-search-results">
          ${renderResultsInnerHtml()}
        </div>
        <div class="global-search-footer">
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
  let html = `<button class="global-search-type-chip ${active === null ? 'active' : ''}" onclick="setSearchTypeFilter(null);event.stopPropagation()">All</button>`;
  for (const t of SEARCH_TYPES) {
    html += `<button class="global-search-type-chip ${active === t.key ? 'active' : ''}" onclick="setSearchTypeFilter('${t.key}');event.stopPropagation()">${t.icon} ${t.label}</button>`;
  }
  return html;
}

function renderResultsInnerHtml() {
  const groups = state.globalSearchResults;
  const query = state.globalSearchQuery;

  if (!query || !query.trim()) {
    return `<div class="global-search-empty">
      <div class="global-search-empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
      <p>Type to search across everything</p>
      <p class="global-search-empty-hint">Use <kbd>#</kbd> for areas, <kbd>@</kbd> for labels, <kbd>&amp;</kbd> for people</p>
    </div>`;
  }

  if (!groups || groups.length === 0) {
    return `<div class="global-search-empty">
      <p>No results for "${escapeHtml(query.trim())}"</p>
    </div>`;
  }

  let html = '';
  let flatIdx = 0;

  for (const group of groups) {
    html += `<div class="global-search-group-header">
      <span>${group.icon} ${escapeHtml(group.label)}</span>
      <span class="global-search-group-count">${group.items.length} found</span>
    </div>`;

    for (const item of group.items) {
      const isActive = flatIdx === state.globalSearchActiveIndex;
      html += `<button class="global-search-result ${isActive ? 'active' : ''}"
        onclick="selectGlobalSearchResult(${flatIdx})"
        onmouseenter="state.globalSearchActiveIndex=${flatIdx};document.querySelectorAll('.global-search-result').forEach((el,i)=>{el.classList.toggle('active',i===${flatIdx})})">
        <span class="global-search-result-icon" ${item.color ? `style="color:${item.color}"` : ''}>${item.icon}</span>
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
