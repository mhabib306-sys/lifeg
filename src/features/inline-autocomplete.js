// ============================================================================
// INLINE AUTOCOMPLETE MODULE
// ============================================================================
// Todoist-style inline autocomplete (# areas, @ tags, & people, ! dates)
// and related chips/metadata management for non-modal inputs.
//
// Extracted from ui/task-modal.js for maintainability. When in modal mode,
// calls back to task-modal functions via window.* bridge to avoid circular imports.

import { state } from '../state.js';
import { escapeHtml, formatSmartDate } from '../utils.js';
import { TASK_CATEGORIES_KEY, TASK_LABELS_KEY, TASK_PEOPLE_KEY } from '../constants.js';

function debouncedSaveToGithub() {
  if (typeof window.debouncedSaveToGithub === 'function') {
    window.debouncedSaveToGithub();
  }
}

// ============================================================================
// DATE QUERY PARSER (for ! trigger in inline autocomplete)
// ============================================================================

/**
 * Parse a natural language date query and return matching date suggestions.
 * Supports: today/tod, tomorrow/tmr, day names, next+day, in N d/w/m, month+day.
 *
 * @param {string} query - The date query text
 * @returns {Array<{name: string, date: string}>} Array of date suggestions
 */
export function parseDateQuery(query) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function fmtDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function getNextWeekday(from, dayIdx) {
    const d = new Date(from);
    const diff = (dayIdx - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
    return d;
  }

  const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const dayShort = ['sun','mon','tue','wed','thu','fri','sat'];
  const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const monthShort = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

  const q = (query || '').trim().toLowerCase();

  // Default suggestions when empty
  if (!q) {
    const nextMon = getNextWeekday(today, 1);
    return [
      { name: 'Today', date: fmtDate(today) },
      { name: 'Tomorrow', date: fmtDate(addDays(today, 1)) },
      { name: 'Next Monday', date: fmtDate(nextMon) },
      { name: 'In 1 Week', date: fmtDate(addDays(today, 7)) }
    ];
  }

  const results = [];

  // today / tod
  if ('today'.startsWith(q) || q === 'tod') {
    results.push({ name: 'Today', date: fmtDate(today) });
  }
  // tomorrow / tmr
  if ('tomorrow'.startsWith(q) || 'tmr'.startsWith(q)) {
    results.push({ name: 'Tomorrow', date: fmtDate(addDays(today, 1)) });
  }

  // "next <day>" pattern
  const nextMatch = q.match(/^next\s+(.+)$/);
  if (nextMatch) {
    const dayQ = nextMatch[1];
    dayNames.forEach((name, idx) => {
      if (name.startsWith(dayQ) || dayShort[idx].startsWith(dayQ)) {
        results.push({ name: 'Next ' + name.charAt(0).toUpperCase() + name.slice(1), date: fmtDate(getNextWeekday(addDays(today, 1), idx)) });
      }
    });
  }

  // Day names (without "next")
  if (!nextMatch) {
    dayNames.forEach((name, idx) => {
      if (name.startsWith(q) || dayShort[idx].startsWith(q)) {
        results.push({ name: name.charAt(0).toUpperCase() + name.slice(1), date: fmtDate(getNextWeekday(today, idx)) });
      }
    });
  }

  // "in N day(s)/week(s)/month(s)"
  const inMatch = q.match(/^in\s+(\d+)\s*(d|day|days|w|week|weeks|m|month|months)?\s*$/);
  if (inMatch) {
    const n = parseInt(inMatch[1]);
    const unit = (inMatch[2] || 'd')[0];
    if (unit === 'd') {
      results.push({ name: `In ${n} day${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n)) });
    } else if (unit === 'w') {
      results.push({ name: `In ${n} week${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n * 7)) });
    } else if (unit === 'm') {
      const d = new Date(today); d.setMonth(d.getMonth() + n);
      results.push({ name: `In ${n} month${n !== 1 ? 's' : ''}`, date: fmtDate(d) });
    }
  }
  // Partial "in" with just number: "in 3" -> suggest days/weeks/months
  const inPartial = q.match(/^in\s+(\d+)\s*$/);
  if (inPartial && !inMatch) {
    const n = parseInt(inPartial[1]);
    results.push({ name: `In ${n} day${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n)) });
    results.push({ name: `In ${n} week${n !== 1 ? 's' : ''}`, date: fmtDate(addDays(today, n * 7)) });
    const dm = new Date(today); dm.setMonth(dm.getMonth() + n);
    results.push({ name: `In ${n} month${n !== 1 ? 's' : ''}`, date: fmtDate(dm) });
  }

  // Month + day: "jan 15", "feb 3"
  const monthDayMatch = q.match(/^([a-z]+)\s+(\d{1,2})$/);
  if (monthDayMatch) {
    const mq = monthDayMatch[1];
    const day = parseInt(monthDayMatch[2]);
    monthNames.forEach((name, idx) => {
      if (name.startsWith(mq) || monthShort[idx] === mq) {
        let d = new Date(today.getFullYear(), idx, day);
        if (d < today) d = new Date(today.getFullYear() + 1, idx, day);
        const label = monthShort[idx].charAt(0).toUpperCase() + monthShort[idx].slice(1) + ' ' + day;
        results.push({ name: label, date: fmtDate(d) });
      }
    });
  }

  return results.slice(0, 5);
}

// ============================================================================
// INLINE AUTOCOMPLETE (Todoist-style #, @, &, !)
// ============================================================================

/**
 * Setup inline autocomplete on an input element.
 * Trigger characters: # (areas), @ (tags), & (people), ! (dates -> defer date)
 *
 * Works in: modal title, quick-add, home quick-add, inline edit.
 * Uses capture phase + stopImmediatePropagation to fire before onkeydown handlers.
 *
 * @param {string} inputId - DOM id of the input element
 * @param {object} [config={}] - Configuration
 * @param {boolean} [config.isModal=false] - If true, updates modal state directly
 * @param {object} [config.initialMeta] - Initial metadata for non-modal inputs
 * @param {Function} [config.onMetadataChange] - Callback when metadata changes
 */
export function setupInlineAutocomplete(inputId, config = {}) {
  const input = document.getElementById(inputId);
  if (!input || input.dataset.inlineAcAttached) return;
  input.dataset.inlineAcAttached = '1';

  const isModal = config.isModal || false;
  if (!isModal && !state.inlineAutocompleteMeta.has(inputId)) {
    state.inlineAutocompleteMeta.set(inputId, {
      categoryId: config.initialMeta?.categoryId || null,
      labels: config.initialMeta?.labels ? [...config.initialMeta.labels] : [],
      people: config.initialMeta?.people ? [...config.initialMeta.people] : [],
      deferDate: config.initialMeta?.deferDate || null
    });
  }

  let popup = null;
  let activeIndex = 0;
  let triggerChar = null;
  let triggerPos = -1;

  function getMeta() {
    if (isModal) return { categoryId: state.modalSelectedArea, labels: state.modalSelectedTags, people: state.modalSelectedPeople, deferDate: document.getElementById('task-defer')?.value || null };
    return state.inlineAutocompleteMeta.get(inputId) || { categoryId: null, labels: [], people: [], deferDate: null };
  }

  function setMeta(key, value) {
    if (isModal) {
      // Use window.* bridge to call task-modal functions (avoids circular imports)
      if (key === 'categoryId') { state.modalSelectedArea = value; window.renderAreaInput(); }
      else if (key === 'labels') { state.modalSelectedTags = value; window.renderTagsInput(); }
      else if (key === 'people') { state.modalSelectedPeople = value; window.renderPeopleInput(); }
      else if (key === 'deferDate') {
        const deferInput = document.getElementById('task-defer');
        if (deferInput) { deferInput.value = value || ''; window.updateDateDisplay('defer'); }
      }
    } else {
      const meta = getMeta();
      meta[key] = value;
      state.inlineAutocompleteMeta.set(inputId, meta);
      if (config.onMetadataChange) config.onMetadataChange(meta);
      renderInlineChips(inputId);
    }
  }

  function getItems(query) {
    const meta = getMeta();
    if (triggerChar === '#') return state.taskCategories;
    if (triggerChar === '@') return state.taskLabels.filter(l => !(meta.labels || []).includes(l.id));
    if (triggerChar === '&') return state.taskPeople.filter(p => !(meta.people || []).includes(p.id));
    if (triggerChar === '!') return parseDateQuery(query || '');
    return [];
  }

  function getCreateFn() {
    if (triggerChar === '#') return (name) => {
      const c = { id: 'cat_' + Date.now(), name, color: '#6366f1', icon: '\uD83D\uDCC1' };
      state.taskCategories.push(c);
      localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(state.taskCategories));
      debouncedSaveToGithub();
      return c;
    };
    if (triggerChar === '@') return (name) => {
      const colors = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
      const l = { id: 'label_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)] };
      state.taskLabels.push(l);
      localStorage.setItem(TASK_LABELS_KEY, JSON.stringify(state.taskLabels));
      debouncedSaveToGithub();
      return l;
    };
    if (triggerChar === '&') return (name) => {
      const colors = ['#4A90A4','#6B8E5A','#E5533D','#C4943D','#7C6B8E'];
      const p = { id: 'person_' + Date.now(), name, color: colors[Math.floor(Math.random() * colors.length)], email: '' };
      state.taskPeople.push(p);
      localStorage.setItem(TASK_PEOPLE_KEY, JSON.stringify(state.taskPeople));
      debouncedSaveToGithub();
      return p;
    };
    return null;
  }

  function selectItem(item) {
    // Remove trigger + query from input value
    const val = input.value;
    const before = val.substring(0, triggerPos);
    const afterCaret = val.substring(input.selectionStart);
    input.value = before.trimEnd() + (before.trimEnd() ? ' ' : '') + afterCaret.trimStart();
    // Re-position caret
    const newPos = (before.trimEnd() + (before.trimEnd() ? ' ' : '')).length;
    input.setSelectionRange(newPos, newPos);

    // Apply metadata
    if (triggerChar === '#') {
      setMeta('categoryId', item.id);
    } else if (triggerChar === '@') {
      const meta = getMeta();
      const labels = [...(meta.labels || [])];
      if (!labels.includes(item.id)) labels.push(item.id);
      setMeta('labels', labels);
    } else if (triggerChar === '&') {
      const meta = getMeta();
      const people = [...(meta.people || [])];
      if (!people.includes(item.id)) people.push(item.id);
      setMeta('people', people);
    } else if (triggerChar === '!') {
      setMeta('deferDate', item.date);
    }
    dismissPopup();
    input.focus();
  }

  function dismissPopup() {
    if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
    popup = null;
    triggerChar = null;
    triggerPos = -1;
    activeIndex = 0;
  }

  function renderPopup(items, query) {
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'inline-autocomplete-popup';
      popup.addEventListener('mousedown', (e) => e.preventDefault()); // Prevent blur
      document.body.appendChild(popup);
    }

    // Position near input
    const rect = input.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    popup.style.left = Math.min(rect.left, window.innerWidth - 310) + 'px';
    popup.style.width = Math.min(rect.width, 300) + 'px';
    if (spaceBelow > 240) {
      popup.style.top = rect.bottom + 4 + 'px';
      popup.style.bottom = 'auto';
    } else {
      popup.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
      popup.style.top = 'auto';
    }

    const isDate = triggerChar === '!';
    const filtered = isDate ? items : items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    const hasExactMatch = isDate ? true : items.some(i => i.name.toLowerCase() === query.toLowerCase());
    const showCreate = !isDate && query.length > 0 && !hasExactMatch;
    const totalItems = filtered.length + (showCreate ? 1 : 0);

    if (totalItems === 0) { dismissPopup(); return; }
    if (activeIndex >= totalItems) activeIndex = totalItems - 1;
    if (activeIndex < 0) activeIndex = 0;

    const typeLabel = triggerChar === '#' ? 'Area' : triggerChar === '@' ? 'Tag' : triggerChar === '!' ? 'Date' : 'Person';
    let html = '';
    filtered.forEach((item, idx) => {
      const isActive = idx === activeIndex ? ' active' : '';
      let icon;
      if (isDate) {
        icon = `<span class="ac-icon" style="background:#8b5cf620;color:#8b5cf6"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>`;
      } else if (triggerChar === '#') {
        icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">${item.icon || '\uD83D\uDCC1'}</span>`;
      } else if (triggerChar === '@') {
        icon = `<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${item.color}"></span>`;
      } else {
        icon = `<span class="ac-icon" style="background:${item.color}20;color:${item.color}">\uD83D\uDC64</span>`;
      }
      const dateLabel = isDate ? `<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${formatSmartDate(item.date)}</span>` : '';
      html += `<div class="inline-ac-option${isActive}" data-idx="${idx}" style="${isDate ? 'justify-content:space-between' : ''}">${icon}<span>${escapeHtml(item.name)}</span>${dateLabel}</div>`;
    });
    if (showCreate) {
      const createIdx = filtered.length;
      const isActive = activeIndex === createIdx ? ' active' : '';
      html += `<div class="inline-ac-create${isActive}" data-idx="${createIdx}">+ Create ${typeLabel} "${escapeHtml(query)}"</div>`;
    }
    popup.innerHTML = html;

    // Click handlers
    popup.querySelectorAll('.inline-ac-option').forEach(el => {
      el.addEventListener('click', () => selectItem(filtered[parseInt(el.dataset.idx)]));
    });
    const createEl = popup.querySelector('.inline-ac-create');
    if (createEl) {
      createEl.addEventListener('click', () => {
        const createFn = getCreateFn();
        if (createFn) {
          const newItem = createFn(query);
          selectItem(newItem);
        }
      });
    }
  }

  function checkTrigger() {
    const val = input.value;
    const caret = input.selectionStart;

    // Scan backwards from caret for trigger char
    for (let i = caret - 1; i >= 0; i--) {
      const ch = val[i];
      if (ch === '\n') { dismissPopup(); return; }
      if (ch === ' ') {
        // For ! trigger, allow spaces (multi-word queries like "!next monday")
        // Continue scanning backwards to find a ! trigger
        for (let j = i - 1; j >= 0; j--) {
          const ch2 = val[j];
          if (ch2 === '\n' || ch2 === '#' || ch2 === '@' || ch2 === '&') break;
          if (ch2 === '!' && (j === 0 || val[j-1] === ' ')) {
            triggerChar = '!';
            triggerPos = j;
            const query = val.substring(j + 1, caret);
            const items = getItems(query);
            activeIndex = 0;
            renderPopup(items, query);
            return;
          }
        }
        dismissPopup(); return;
      }
      if ((ch === '#' || ch === '@' || ch === '&') && (i === 0 || val[i-1] === ' ')) {
        triggerChar = ch;
        triggerPos = i;
        const query = val.substring(i + 1, caret);
        const items = getItems(query);
        activeIndex = 0;
        renderPopup(items, query);
        return;
      }
      if (ch === '!' && (i === 0 || val[i-1] === ' ')) {
        triggerChar = '!';
        triggerPos = i;
        const query = val.substring(i + 1, caret);
        const items = getItems(query);
        activeIndex = 0;
        renderPopup(items, query);
        return;
      }
    }
    dismissPopup();
  }

  input.addEventListener('input', () => checkTrigger());

  // Use capture phase so this fires BEFORE onkeydown attribute handlers
  input.addEventListener('keydown', (e) => {
    if (!popup) return;
    const val = input.value;
    const caret = input.selectionStart;
    const query = val.substring(triggerPos + 1, caret);
    const isDate = triggerChar === '!';
    const items = getItems(query);
    const filtered = isDate ? items : items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));
    const hasExactMatch = isDate ? true : items.some(i => i.name.toLowerCase() === query.toLowerCase());
    const showCreate = !isDate && query.length > 0 && !hasExactMatch;
    const totalItems = filtered.length + (showCreate ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopImmediatePropagation();
      activeIndex = (activeIndex + 1) % totalItems;
      renderPopup(items, query);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopImmediatePropagation();
      activeIndex = (activeIndex - 1 + totalItems) % totalItems;
      renderPopup(items, query);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e._inlineAcHandled = true;
      if (activeIndex < filtered.length) {
        selectItem(filtered[activeIndex]);
      } else if (showCreate) {
        const createFn = getCreateFn();
        if (createFn) {
          const newItem = createFn(query);
          selectItem(newItem);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      e._inlineAcHandled = true;
      dismissPopup();
    }
  }, true);

  let blurTimeout;
  input.addEventListener('blur', () => {
    blurTimeout = setTimeout(() => dismissPopup(), 150);
  });
  input.addEventListener('focus', () => {
    clearTimeout(blurTimeout);
  });

  // Render initial chips for non-modal
  if (!isModal) renderInlineChips(inputId);
}

// ============================================================================
// INLINE CHIPS (metadata display below non-modal inputs)
// ============================================================================

/**
 * Render metadata chips (area, tags, people, defer date) below an input.
 * @param {string} inputId - DOM id of the input element
 */
export function renderInlineChips(inputId) {
  const meta = state.inlineAutocompleteMeta.get(inputId);
  if (!meta) return;
  const input = document.getElementById(inputId);
  if (!input) return;

  // Find or create chips container
  let chipsEl = document.getElementById(inputId + '-chips');
  if (!chipsEl) {
    chipsEl = document.createElement('div');
    chipsEl.id = inputId + '-chips';
    chipsEl.className = 'inline-meta-chips';
    input.parentNode.insertBefore(chipsEl, input.nextSibling);
  }

  let html = '';
  // Area chip
  if (meta.categoryId) {
    const cat = state.taskCategories.find(c => c.id === meta.categoryId);
    if (cat) {
      html += `<span class="inline-meta-chip" style="background:${cat.color}20;color:${cat.color}">
        ${cat.icon || '\uD83D\uDCC1'} ${escapeHtml(cat.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','category','${cat.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  }
  // Label chips
  (meta.labels || []).forEach(lid => {
    const label = state.taskLabels.find(l => l.id === lid);
    if (label) {
      html += `<span class="inline-meta-chip" style="background:${label.color}20;color:${label.color}">
        ${escapeHtml(label.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','label','${label.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  });
  // People chips
  (meta.people || []).forEach(pid => {
    const person = state.taskPeople.find(p => p.id === pid);
    if (person) {
      html += `<span class="inline-meta-chip" style="background:${person.color}20;color:${person.color}">
        \uD83D\uDC64 ${escapeHtml(person.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','person','${person.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`;
    }
  });
  // Defer date chip
  if (meta.deferDate) {
    html += `<span class="inline-meta-chip" style="background:#8b5cf620;color:#8b5cf6">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      ${formatSmartDate(meta.deferDate)}
      <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${inputId}','deferDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`;
  }
  chipsEl.innerHTML = html;
}

/**
 * Remove a piece of inline autocomplete metadata from a non-modal input.
 * @param {string} inputId - DOM id of the input
 * @param {string} type - 'category' | 'label' | 'person' | 'deferDate'
 * @param {string} id - Entity ID to remove (unused for deferDate)
 */
export function removeInlineMeta(inputId, type, id) {
  const meta = state.inlineAutocompleteMeta.get(inputId);
  if (!meta) return;
  if (type === 'category') meta.categoryId = null;
  else if (type === 'label') meta.labels = (meta.labels || []).filter(l => l !== id);
  else if (type === 'person') meta.people = (meta.people || []).filter(p => p !== id);
  else if (type === 'deferDate') meta.deferDate = null;
  state.inlineAutocompleteMeta.set(inputId, meta);
  renderInlineChips(inputId);
}

/**
 * Cleanup inline autocomplete state for an input (remove metadata and chips).
 * @param {string} inputId - DOM id of the input
 */
export function cleanupInlineAutocomplete(inputId) {
  state.inlineAutocompleteMeta.delete(inputId);
  const chipsEl = document.getElementById(inputId + '-chips');
  if (chipsEl) chipsEl.remove();
  // Remove any open popup
  document.querySelectorAll('.inline-autocomplete-popup').forEach(p => p.remove());
}
