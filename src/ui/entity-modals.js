// ============================================================================
// ENTITY MODAL RENDERERS
// ============================================================================
// Area, Label, Person, and Perspective modal save functions and HTML renderers.
// Extracted from ui/task-modal.js for maintainability.

import { state } from '../state.js';
import {
  createArea, updateArea,
  createLabel, updateLabel,
  createPerson, updatePerson,
  createCategory, updateCategory, deleteCategory
} from '../features/areas.js';
import { createPerspective, deletePerspective } from '../features/perspectives.js';
import { saveTasksData } from '../data/storage.js';
import { escapeHtml, renderPersonAvatar } from '../utils.js';
import { THINGS3_AREA_COLORS } from '../constants.js';

// ============================================================================
// INLINE VALIDATION HELPER
// ============================================================================

/**
 * Show inline validation error on an input field.
 * Adds red border + error text below. Auto-clears on next input.
 * @param {string} inputId - ID of the input element
 * @param {string} message - Error message to display
 * @returns {boolean} Always returns false (for early-return convenience)
 */
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return false;
  // Add error styling
  input.style.borderColor = 'var(--danger)';
  input.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--danger) 15%, transparent)';
  // Remove existing error text if any
  const existingError = input.parentElement.querySelector('.field-error-msg');
  if (existingError) existingError.remove();
  // Add error message
  const errorEl = document.createElement('p');
  errorEl.className = 'field-error-msg';
  errorEl.style.cssText = 'color: var(--danger); font-size: 12px; margin-top: 4px; font-weight: 500;';
  errorEl.textContent = message;
  input.insertAdjacentElement('afterend', errorEl);
  input.focus();
  // Auto-clear on next input
  const clearError = () => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    const msg = input.parentElement.querySelector('.field-error-msg');
    if (msg) msg.remove();
    input.removeEventListener('input', clearError);
  };
  input.addEventListener('input', clearError);
  return false;
}

// ============================================================================
// ENTITY MODAL SAVE FUNCTIONS (Area, Label, Person)
// ============================================================================

/**
 * Save or update an area from its modal.
 */
export function saveAreaFromModal() {
  const name = document.getElementById('area-name').value.trim();
  const emoji = document.getElementById('area-emoji')?.value?.trim() || '';
  const color = document.getElementById('area-color')?.value || '#6366F1';
  if (!name) {
    return showFieldError('area-name', 'Please enter an area name');
  }

  if (state.editingAreaId) {
    updateArea(state.editingAreaId, { name, emoji, color });
  } else {
    const a = createArea(name, emoji);
    if (color !== a.color) updateArea(a.id, { color });
  }
  state.showAreaModal = false;
  state.editingAreaId = null;
  state.pendingAreaEmoji = '';
  window.render();
}

/**
 * Save or update a category (sub-area) from its modal.
 */
export function saveCategoryFromModal() {
  const name = document.getElementById('category-name')?.value?.trim();
  const areaId = document.getElementById('category-area')?.value;
  const color = document.getElementById('category-color')?.value || '#6366F1';
  const emoji = document.getElementById('category-emoji')?.value?.trim() || '';
  if (!name) { return showFieldError('category-name', 'Please enter a name'); }
  if (!areaId) { return showFieldError('category-area', 'Please select an area'); }

  if (state.editingCategoryId) {
    updateCategory(state.editingCategoryId, { name, areaId, color, emoji });
  } else {
    const cat = createCategory(name, areaId, emoji);
    if (color !== cat.color) updateCategory(cat.id, { color });
  }
  state.showCategoryModal = false;
  state.editingCategoryId = null;
  state.pendingCategoryEmoji = '';
  window.render();
}

/**
 * Save or update a label (tag) from its modal.
 */
export function saveLabelFromModal() {
  const name = document.getElementById('label-name').value.trim();
  if (!name) {
    return showFieldError('label-name', 'Please enter a tag name');
  }
  const color = document.getElementById('label-color').value;

  if (state.editingLabelId) {
    updateLabel(state.editingLabelId, { name, color });
  } else {
    createLabel(name, color);
  }
  state.showLabelModal = false;
  state.editingLabelId = null;
  window.render();
}

/**
 * Save or update a person from its modal.
 */
export function savePersonFromModal() {
  const name = document.getElementById('person-name').value.trim();
  const email = document.getElementById('person-email').value.trim();
  if (!name) {
    return showFieldError('person-name', 'Please enter a name');
  }

  if (state.editingPersonId) {
    updatePerson(state.editingPersonId, { name, email });
  } else {
    createPerson(name, email);
  }
  state.showPersonModal = false;
  state.editingPersonId = null;
  window.render();
}

// ============================================================================
// SAVE PERSPECTIVE FROM MODAL
// ============================================================================

/**
 * Save a custom perspective from the perspective modal form.
 */
export function savePerspectiveFromModal() {
  const name = document.getElementById('perspective-name').value.trim();
  if (!name) {
    return showFieldError('perspective-name', 'Please enter a perspective name');
  }

  const icon = document.getElementById('perspective-icon').value || '\uD83D\uDCCC';
  const filter = {};

  const logic = document.getElementById('perspective-logic')?.value || 'all';
  if (logic) filter.logic = logic;

  const categoryId = document.getElementById('perspective-category').value;
  if (categoryId) filter.categoryId = categoryId;

  const status = document.getElementById('perspective-status').value;
  if (status) filter.status = status;

  const availability = document.getElementById('perspective-availability')?.value;
  if (availability) filter.availability = availability;

  const statusRule = document.getElementById('perspective-status-rule')?.value;
  if (statusRule) filter.statusRule = statusRule;

  const personId = document.getElementById('perspective-person')?.value;
  if (personId) filter.personId = personId;

  const tagMatch = document.getElementById('perspective-tags-mode')?.value || 'any';
  if (tagMatch) filter.tagMatch = tagMatch;

  // Collect selected tags
  const selectedTags = Array.from(document.querySelectorAll('.perspective-tag-checkbox:checked')).map(cb => cb.value);
  if (selectedTags.length > 0) filter.labelIds = selectedTags;

  if (document.getElementById('perspective-due').checked) filter.hasDueDate = true;
  if (document.getElementById('perspective-defer').checked) filter.hasDeferDate = true;
  if (document.getElementById('perspective-repeat').checked) filter.isRepeating = true;
  if (document.getElementById('perspective-untagged').checked) filter.isUntagged = true;
  if (document.getElementById('perspective-inbox').checked) filter.inboxOnly = true;

  const rangeType = document.getElementById('perspective-range-type')?.value || 'either';
  const rangeStart = document.getElementById('perspective-range-start')?.value || '';
  const rangeEnd = document.getElementById('perspective-range-end')?.value || '';
  if (rangeStart || rangeEnd) {
    filter.dateRange = { type: rangeType, start: rangeStart || null, end: rangeEnd || null };
  }

  const searchTerms = document.getElementById('perspective-search')?.value?.trim() || '';
  if (searchTerms) filter.searchTerms = searchTerms;

  if (state.editingPerspectiveId) {
    // Update existing perspective
    const idx = state.customPerspectives.findIndex(p => p.id === state.editingPerspectiveId);
    if (idx !== -1) {
      state.customPerspectives[idx] = { ...state.customPerspectives[idx], name, icon, filter, updatedAt: new Date().toISOString() };
      saveTasksData();
    }
    state.activePerspective = state.editingPerspectiveId;
  } else {
    createPerspective(name, icon, filter);
    state.activePerspective = state.customPerspectives[state.customPerspectives.length - 1].id;
  }
  state.showPerspectiveModal = false;
  state.editingPerspectiveId = null;
  state.pendingPerspectiveEmoji = '';
  window.render();
}

// ============================================================================
// EMOJI PICKER
// ============================================================================

/**
 * Select an emoji for the perspective icon and close the picker.
 */
export function selectPerspectiveEmoji(emoji) {
  state.pendingPerspectiveEmoji = emoji;
  state.perspectiveEmojiPickerOpen = false;
  state.emojiSearchQuery = '';
  // Update DOM directly to avoid flicker, then render to sync state
  const iconInput = document.getElementById('perspective-icon');
  const iconDisplay = document.getElementById('perspective-icon-display');
  if (iconInput) iconInput.value = emoji;
  if (iconDisplay) iconDisplay.textContent = emoji;
  const picker = document.querySelector('.emoji-picker-dropdown');
  if (picker) picker.remove();
}

/**
 * Select an emoji for the area and close the picker.
 */
export function selectAreaEmoji(emoji) {
  state.pendingAreaEmoji = emoji;
  state.areaEmojiPickerOpen = false;
  state.emojiSearchQuery = '';
  // Update DOM directly — no full render needed
  const input = document.getElementById('area-emoji');
  const preview = document.getElementById('area-folder-preview');
  if (input) input.value = emoji;
  if (preview) preview.innerHTML = emoji;
  const picker = document.querySelector('.emoji-picker-dropdown');
  if (picker) picker.remove();
}

/**
 * Select an emoji for the category and close the picker.
 */
export function selectCategoryEmoji(emoji) {
  state.pendingCategoryEmoji = emoji;
  state.categoryEmojiPickerOpen = false;
  state.emojiSearchQuery = '';
  // Update DOM directly — no full render needed
  const input = document.getElementById('category-emoji');
  const preview = document.getElementById('cat-folder-preview');
  if (input) input.value = emoji;
  if (preview) preview.innerHTML = emoji;
  const picker = document.querySelector('.emoji-picker-dropdown');
  if (picker) picker.remove();
}

// Emoji picker data — shared across all entity modals
const EMOJI_CATEGORIES = {
  'Smileys': '😀😃😄😁😆😅🤣😂🙂😉😊😇🥰😍🤩😘😚🤔🤨😐😑😶🙄😏😒😞😢😭😤🤯😱😨🥵🥶',
  'Objects': '📌📋📅📊🔍💡🔔⭐🌟🔥❤️💎🏆🎖️🎯🚀✈️📦📧✉️📝📓📖📚💻📱⌨️🖥️🎨🎵🎬📷🎮⚽🏀',
  'Nature': '🌳🌲🌿☘️🍀🌺🌹🌻🌼🌷🌞🌙⭐⚡🌈❄️💧🌊🔥🌾🍃🍂🍁🐝🦋',
  'Food': '🍎🍊🍋🍌🍉🍇🍓🫐🍑🍒🥝🍅🥑🍕🍔🌮🍜🍣🍰☕🍺🥤🍷',
  'People': '👤👥👨‍💻👩‍💻👨‍🔬👩‍🔬👨‍🏫👩‍🏫🧑‍💼🧑‍🔧🧑‍🎨👷🦸🦹🧙',
  'Places': '🏠🏢🏭🏫🏥🏪🏨⛪🕌🕍🏟️🏔️🏖️🌅🌄🌃✈️🚀🚂🚗',
  'Symbols': '✅❌❗❓⚠️♻️🔄↕️↔️▶️⏸️⏹️🔀🔁🔂➕➖✖️➗🟰🟱🟢🟡🟠🔴🟣🟤⚫⚪🔵🟦'
};

// Keyword map for emoji search — maps search terms to emoji characters
const EMOJI_KEYWORDS = {
  'happy': '😀😃😄😁😆😊', 'sad': '😞😢😭', 'angry': '😤', 'love': '🥰😍❤️', 'heart': '❤️🥰😍',
  'star': '⭐🌟', 'fire': '🔥', 'sun': '🌞🌅🌄', 'moon': '🌙', 'rain': '💧🌊', 'snow': '❄️',
  'tree': '🌳🌲', 'flower': '🌺🌹🌻🌼🌷', 'leaf': '🌿🍃🍂🍁☘️🍀',
  'home': '🏠', 'house': '🏠', 'office': '🏢', 'school': '🏫', 'hospital': '🏥', 'church': '⛪', 'mosque': '🕌',
  'car': '🚗', 'plane': '✈️', 'rocket': '🚀', 'train': '🚂',
  'book': '📖📚📓', 'computer': '💻🖥️', 'phone': '📱', 'mail': '📧✉️', 'pen': '📝',
  'music': '🎵', 'art': '🎨', 'film': '🎬', 'camera': '📷', 'game': '🎮',
  'food': '🍕🍔🌮🍜🍣🍰', 'fruit': '🍎🍊🍋🍌🍉🍇🍓🍑🍒', 'drink': '☕🍺🥤🍷', 'coffee': '☕', 'beer': '🍺', 'wine': '🍷',
  'check': '✅', 'cross': '❌', 'warning': '⚠️', 'question': '❓',
  'red': '🔴🟥', 'green': '🟢🟩', 'blue': '🔵🟦', 'yellow': '🟡', 'orange': '🟠', 'purple': '🟣', 'black': '⚫', 'white': '⚪',
  'pin': '📌', 'target': '🎯', 'trophy': '🏆', 'medal': '🎖️', 'gem': '💎', 'diamond': '💎',
  'think': '🤔', 'wink': '😉', 'cool': '🤩', 'kiss': '😘', 'cry': '😢😭',
  'work': '🧑‍💼💼💻', 'person': '👤👥', 'people': '👥👤',
  'search': '🔍', 'light': '💡', 'bell': '🔔', 'calendar': '📅', 'chart': '📊',
  'soccer': '⚽', 'basketball': '🏀', 'sport': '⚽🏀🏆',
  'bug': '🐝🦋', 'butterfly': '🦋', 'bee': '🐝',
  'hero': '🦸', 'wizard': '🧙', 'magic': '🧙',
  'mountain': '🏔️', 'beach': '🏖️', 'city': '🌃',
  'lightning': '⚡', 'rainbow': '🌈', 'wave': '🌊', 'water': '💧🌊',
  'plus': '➕', 'minus': '➖', 'recycle': '♻️', 'refresh': '🔄'
};

/**
 * Build the emoji grid HTML for a given search query and select function.
 * Shared by both renderEmojiPicker (initial render) and updateEmojiGrid (live filter).
 */
function buildEmojiGridHtml(searchQuery, selectFnName) {
  const q = (searchQuery || '').toLowerCase().trim();
  // Build a Set of emoji characters matching keyword search
  let keywordMatches = null;
  if (q) {
    keywordMatches = new Set();
    for (const [keyword, emojis] of Object.entries(EMOJI_KEYWORDS)) {
      if (keyword.includes(q)) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        for (const seg of segmenter.segment(emojis)) {
          if (seg.segment.trim()) keywordMatches.add(seg.segment);
        }
      }
    }
  }

  let html = '';
  for (const [category, emojiStr] of Object.entries(EMOJI_CATEGORIES)) {
    const emojis = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(emojiStr)].map(s => s.segment).filter(e => e.trim());
    const filtered = q
      ? (category.toLowerCase().includes(q)
          ? emojis  // Category name matches → show all emojis in it
          : emojis.filter(e => keywordMatches && keywordMatches.has(e)))
      : emojis;
    if (filtered.length === 0) continue;
    html += `
      <div class="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 pt-2 pb-1">${category}</div>
      <div class="grid grid-cols-6 sm:grid-cols-8 gap-0.5">
        ${filtered.map(e => `<button type="button" class="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-xl sm:text-lg rounded-md hover:bg-[var(--accent-light)] transition cursor-pointer" onclick="event.stopPropagation(); ${selectFnName}('${e.replace(/'/g, "\\'")}')">${e}</button>`).join('')}
      </div>
    `;
  }
  return html;
}

/**
 * Toggle an emoji picker open/closed via DOM manipulation — avoids full render() flickering.
 * @param {string} type - 'perspective' | 'area' | 'category'
 */
export function toggleEmojiPicker(type) {
  const stateKey = `${type}EmojiPickerOpen`;
  const isOpen = state[stateKey];
  // Close all pickers first
  state.perspectiveEmojiPickerOpen = false;
  state.areaEmojiPickerOpen = false;
  state.categoryEmojiPickerOpen = false;
  state.emojiSearchQuery = '';

  if (isOpen) {
    // Was open → close it by removing the picker DOM
    const existingPicker = document.querySelector('.emoji-picker-dropdown');
    if (existingPicker) existingPicker.remove();
    return;
  }

  // Open it
  state[stateKey] = true;
  const selectFnMap = { perspective: 'selectPerspectiveEmoji', area: 'selectAreaEmoji', category: 'selectCategoryEmoji' };
  const selectFn = selectFnMap[type];
  const pickerHtml = renderEmojiPicker(selectFn);

  // Find the button's parent (relative-positioned container) and inject picker
  const buttonIdMap = { perspective: 'perspective-icon-display', area: 'area-folder-preview', category: 'cat-folder-preview' };
  const button = document.getElementById(buttonIdMap[type]);
  if (button) {
    const container = button.closest('.relative') || button.parentElement;
    // Remove any existing picker first
    const existing = container.querySelector('.emoji-picker-dropdown');
    if (existing) existing.remove();
    container.insertAdjacentHTML('beforeend', pickerHtml);
    // Focus the search input
    setTimeout(() => {
      const searchInput = document.getElementById('emoji-search-input');
      if (searchInput) searchInput.focus();
    }, 50);
  }
}

/**
 * Determine which emoji select function to use based on which picker is open.
 */
function getActiveEmojiSelectFn() {
  if (state.perspectiveEmojiPickerOpen) return 'selectPerspectiveEmoji';
  if (state.areaEmojiPickerOpen) return 'selectAreaEmoji';
  if (state.categoryEmojiPickerOpen) return 'selectCategoryEmoji';
  return 'selectPerspectiveEmoji';
}

/**
 * Live-filter the emoji grid without a full render().
 * Updates only the grid container innerHTML, preserving input focus.
 */
export function updateEmojiGrid(query) {
  state.emojiSearchQuery = query;
  const selectFn = getActiveEmojiSelectFn();
  const gridHtml = buildEmojiGridHtml(query, selectFn);
  const gridContainer = document.getElementById('emoji-grid-content');
  if (gridContainer) {
    gridContainer.innerHTML = gridHtml || '<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>';
  }
}

/**
 * Render the reusable emoji picker grid.
 * @param {string} selectFnName - Window function name to call on selection (e.g., 'selectAreaEmoji')
 * @returns {string} HTML for the emoji picker dropdown
 */
function renderEmojiPicker(selectFnName = 'selectPerspectiveEmoji') {
  const searchQuery = state.emojiSearchQuery || '';
  const emojiGridHtml = buildEmojiGridHtml(searchQuery, selectFnName);

  return `
    <div class="emoji-picker-dropdown absolute top-full left-0 mt-1 z-[400] w-full max-w-72 bg-[var(--modal-bg)] rounded-lg border border-[var(--border-light)] shadow-xl overflow-hidden" onclick="event.stopPropagation()">
      <div class="p-2 border-b border-[var(--border-light)]">
        <input type="text" id="emoji-search-input" placeholder="Search emojis..." value="${escapeHtml(searchQuery)}"
          oninput="updateEmojiGrid(this.value)"
          class="input-field-sm w-full">
      </div>
      <div id="emoji-grid-content" class="p-2 max-h-52 overflow-y-auto">
        ${emojiGridHtml || '<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>'}
      </div>
    </div>
  `;
}

// ============================================================================
// COLOR SWATCH PICKER
// ============================================================================

/**
 * Render a 32-color swatch grid for area/category color picking.
 * @param {string} selectedColor - Currently selected hex color
 * @param {string} inputId - ID for the hidden input that stores the value
 * @param {string} previewId - ID of the folder preview element to update live
 * @returns {string} HTML string
 */
function renderColorSwatches(selectedColor, inputId, previewId) {
  const swatches = THINGS3_AREA_COLORS.map(color => {
    const isSelected = color.toLowerCase() === selectedColor.toLowerCase();
    return `<button type="button" class="color-swatch${isSelected ? ' selected' : ''}" style="background:${color}" title="${color}"
      onclick="document.getElementById('${inputId}').value='${color}';var p=document.getElementById('${previewId}');if(p){p.style.background='${color}20';p.style.color='${color}';}document.querySelectorAll('#${inputId}-grid .color-swatch').forEach(function(s){s.classList.remove('selected')});this.classList.add('selected');"></button>`;
  }).join('');

  return `
    <input type="hidden" id="${inputId}" value="${selectedColor}">
    <div>
      <span class="text-[13px] text-[var(--text-muted)]">Folder color</span>
      <div id="${inputId}-grid" class="color-swatch-grid mt-2">${swatches}</div>
    </div>`;
}

// ============================================================================
// ENTITY MODAL RENDERERS
// ============================================================================

/**
 * Render the perspective (custom view) create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderPerspectiveModalHtml() {
  if (!state.showPerspectiveModal) return '';
  const editingPerspective = state.editingPerspectiveId
    ? (state.customPerspectives || []).find(p => p.id === state.editingPerspectiveId)
    : null;
  const currentIcon = state.pendingPerspectiveEmoji || editingPerspective?.icon || '📌';
  const ef = editingPerspective?.filter || {};
  const sel = (val, target) => val === target ? 'selected' : '';
  return `
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){pendingPerspectiveEmoji=''; showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()}" role="dialog" aria-modal="true" aria-labelledby="perspective-modal-title">
      <div class="modal-enhanced w-full max-w-lg mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="perspective-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingPerspective ? 'Edit Custom View' : 'New Custom View'}</h3>
          <button onclick="pendingPerspectiveEmoji=''; showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-enhanced">
          <!-- Name & Icon -->
          <div class="modal-section">
            <div class="flex items-start gap-3">
              <div class="relative">
                <button type="button" onclick="event.stopPropagation(); toggleEmojiPicker('perspective')"
                  class="w-12 h-12 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-2xl hover:border-[var(--accent)] transition cursor-pointer" title="Pick icon">
                  <span id="perspective-icon-display">${currentIcon}</span>
                </button>
                <input type="hidden" id="perspective-icon" value="${currentIcon}">
              </div>
              <div class="flex-1">
                <input type="text" id="perspective-name" placeholder="View name, e.g. Work Projects" autofocus maxlength="100"
                  value="${escapeHtml(editingPerspective?.name || '')}"
                  onkeydown="if(event.key==='Enter'){event.preventDefault();savePerspectiveFromModal();}"
                  class="modal-input-enhanced title-input">
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="modal-section">
            <div class="modal-section-label">Filters</div>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Match</label>
                  <select id="perspective-logic" class="modal-input-enhanced">
                    <option value="all" ${sel(ef.logic || 'all', 'all')}>All rules</option>
                    <option value="any" ${sel(ef.logic, 'any')}>Any rule</option>
                    <option value="none" ${sel(ef.logic, 'none')}>No rules</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Availability</label>
                  <select id="perspective-availability" class="modal-input-enhanced">
                    <option value="available" ${sel(ef.availability || 'available', 'available')}>Available</option>
                    <option value="" ${sel(ef.availability, '')}>Any</option>
                    <option value="remaining" ${sel(ef.availability, 'remaining')}>Remaining</option>
                    <option value="completed" ${sel(ef.availability, 'completed')}>Completed</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Area</label>
                  <select id="perspective-category" class="modal-input-enhanced">
                    <option value="">Any area</option>
                    ${(state.taskAreas || []).map(cat => `<option value="${cat.id}" ${sel(ef.categoryId, cat.id)}>${escapeHtml(cat.name)}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Person</label>
                  <select id="perspective-person" class="modal-input-enhanced">
                    <option value="">Any person</option>
                    ${(state.taskPeople || []).map(person => `<option value="${person.id}" ${sel(ef.personId, person.id)}>${escapeHtml(person.name)}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Status</label>
                  <select id="perspective-status" class="modal-input-enhanced">
                    <option value="" ${sel(ef.status, undefined)}>Any status</option>
                    <option value="inbox" ${sel(ef.status, 'inbox')}>Inbox</option>
                    <option value="today" ${sel(ef.status, 'today')}>Today</option>
                    <option value="anytime" ${sel(ef.status, 'anytime')}>Anytime</option>
                    <option value="someday" ${sel(ef.status, 'someday')}>Someday</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Special</label>
                  <select id="perspective-status-rule" class="modal-input-enhanced">
                    <option value="" ${sel(ef.statusRule, undefined)}>None</option>
                    <option value="flagged" ${sel(ef.statusRule, 'flagged')}>Flagged</option>
                    <option value="dueSoon" ${sel(ef.statusRule, 'dueSoon')}>Due Soon (7 days)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="modal-section">
            <div class="flex items-center justify-between mb-2">
              <div class="modal-section-label mb-0">Tags</div>
              <select id="perspective-tags-mode" class="px-2 py-1 text-[11px] border border-[var(--border)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                <option value="any" ${sel(ef.tagMatch || 'any', 'any')}>Match any</option>
                <option value="all" ${sel(ef.tagMatch, 'all')}>Match all</option>
              </select>
            </div>
            <div class="border border-[var(--border)] rounded-lg p-2 max-h-28 overflow-y-auto space-y-0.5">
              ${(state.taskLabels || []).length > 0 ? state.taskLabels.map(label => `
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--bg-secondary)] cursor-pointer transition">
                  <input type="checkbox" class="perspective-tag-checkbox rounded border-[var(--border)]" value="${label.id}" ${(ef.labelIds || []).includes(label.id) ? 'checked' : ''}>
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${label.color}"></span>
                  <span class="text-[13px] text-[var(--text-primary)]">${escapeHtml(label.name)}</span>
                </label>
              `).join('') : '<p class="text-[13px] text-[var(--text-muted)] text-center py-3">No tags created yet</p>'}
            </div>
          </div>

          <!-- Conditions -->
          <div class="modal-section">
            <div class="modal-section-label">Conditions</div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2">
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-due" class="rounded border-[var(--border)]" ${ef.hasDueDate ? 'checked' : ''}>
                Has due date
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-defer" class="rounded border-[var(--border)]" ${ef.hasDeferDate ? 'checked' : ''}>
                Has defer date
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-repeat" class="rounded border-[var(--border)]" ${ef.isRepeating ? 'checked' : ''}>
                Repeating
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-untagged" class="rounded border-[var(--border)]" ${ef.isUntagged ? 'checked' : ''}>
                Untagged
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-inbox" class="rounded border-[var(--border)]" ${ef.inboxOnly ? 'checked' : ''}>
                Inbox only
              </label>
            </div>
          </div>

          <!-- Date Range -->
          <div class="modal-section">
            <div class="modal-section-label">Date Range</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select id="perspective-range-type" class="modal-input-enhanced text-[13px]">
                <option value="either" ${sel(ef.dateRange?.type, 'either')}>Due or Defer</option>
                <option value="due" ${sel(ef.dateRange?.type, 'due')}>Due only</option>
                <option value="defer" ${sel(ef.dateRange?.type, 'defer')}>Defer only</option>
              </select>
              <input type="date" id="perspective-range-start" class="modal-input-enhanced text-[13px]" value="${ef.dateRange?.start || ''}">
              <input type="date" id="perspective-range-end" class="modal-input-enhanced text-[13px]" value="${ef.dateRange?.end || ''}">
            </div>
          </div>

          <!-- Search Terms -->
          <div class="modal-section">
            <div class="modal-section-label">Search Terms</div>
            <input type="text" id="perspective-search" placeholder="Title or notes contains..."
              value="${escapeHtml(ef.searchTerms || '')}"
              class="modal-input-enhanced">
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-enhanced">
          ${editingPerspective ? `
            <button onclick="if(confirm('Delete this custom view?')){deletePerspective('${editingPerspective.id}'); showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition mr-auto">Delete</button>
          ` : ''}
          <button onclick="showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()"
            class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
          <button onclick="savePerspectiveFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
            ${editingPerspective ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the area create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderAreaModalHtml() {
  if (!state.showAreaModal) return '';
  const editingArea = state.editingAreaId
    ? (state.taskAreas || []).find(c => c.id === state.editingAreaId)
    : null;
  const areaColor = editingArea?.color || '#6366F1';
  const areaEmoji = state.pendingAreaEmoji || editingArea?.emoji || '';
  return `
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){pendingAreaEmoji=''; showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render()}" role="dialog" aria-modal="true" aria-labelledby="area-modal-title">
      <div class="modal-enhanced w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="area-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingArea ? 'Edit Area' : 'New Area'}</h3>
          <button onclick="pendingAreaEmoji=''; showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <!-- Icon + Name row -->
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <input type="hidden" id="area-emoji" value="${areaEmoji}">
              <button type="button" onclick="event.stopPropagation(); toggleEmojiPicker('area')"
                id="area-folder-preview"
                class="w-16 h-16 rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:ring-2 hover:ring-[var(--accent)]/40 transition" style="background: ${areaColor}20; color: ${areaColor}">
                ${areaEmoji || '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'}
              </button>
            </div>
            <div class="flex-1 space-y-3 pt-1">
              <input type="text" id="area-name" value="${editingArea?.name ? escapeHtml(editingArea.name) : ''}"
                placeholder="Area name" autofocus maxlength="100"
                onkeydown="if(event.key==='Enter'){event.preventDefault();saveAreaFromModal();}"
                class="modal-input-enhanced w-full text-lg font-medium">
              ${renderColorSwatches(areaColor, 'area-color', 'area-folder-preview')}
            </div>
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${editingArea ? `
            <button onclick="if(confirm('Delete this area?')){deleteArea('${editingArea.id}'); showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-2">
            <button onclick="showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render()"
              class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="saveAreaFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
              ${editingArea ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the category (sub-area) create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderCategoryModalHtml() {
  if (!state.showCategoryModal) return '';
  const editing = state.editingCategoryId ? (state.taskCategories || []).find(c => c.id === state.editingCategoryId) : null;
  const defaultAreaId = editing ? editing.areaId : (state.modalSelectedArea || (state.taskAreas[0]?.id || ''));
  const defaultArea = state.taskAreas.find(a => a.id === defaultAreaId);
  const defaultColor = editing ? editing.color : (defaultArea ? defaultArea.color : '#6366F1');
  const catEmoji = state.pendingCategoryEmoji || editing?.emoji || '';

  return `
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){pendingCategoryEmoji=''; showCategoryModal=false;editingCategoryId=null;categoryEmojiPickerOpen=false;render()}" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div class="modal-enhanced w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="category-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editing ? 'Edit' : 'New'} Category</h3>
          <button onclick="pendingCategoryEmoji=''; showCategoryModal=false;editingCategoryId=null;categoryEmojiPickerOpen=false;render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <!-- Icon + Name row -->
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <input type="hidden" id="category-emoji" value="${catEmoji}">
              <button type="button" onclick="event.stopPropagation(); toggleEmojiPicker('category')"
                id="cat-folder-preview"
                class="w-14 h-14 rounded-lg flex items-center justify-center text-xl cursor-pointer hover:ring-2 hover:ring-[var(--accent)]/40 transition" style="background: ${defaultColor}20; color: ${defaultColor}">
                ${catEmoji || '<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}
              </button>
            </div>
            <div class="flex-1 space-y-3 pt-1">
              <input type="text" id="category-name" value="${editing ? escapeHtml(editing.name) : ''}" placeholder="Category name"
                class="modal-input-enhanced w-full text-lg font-medium" autofocus onkeydown="if(event.key==='Enter'){event.preventDefault();saveCategoryFromModal();}">
              <select id="category-area" class="modal-input-enhanced w-full text-sm">
                ${(state.taskAreas || []).map(a => `<option value="${a.id}" ${a.id === defaultAreaId ? 'selected' : ''}>${escapeHtml(a.name)}</option>`).join('')}
              </select>
              ${renderColorSwatches(defaultColor, 'category-color', 'cat-folder-preview')}
            </div>
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${editing ? `<button onclick="window.deleteCategory('${editing.id}'); showCategoryModal=false; editingCategoryId=null; render()" class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>` : '<div></div>'}
          <div class="flex gap-2">
            <button onclick="showCategoryModal=false;editingCategoryId=null;categoryEmojiPickerOpen=false;render()" class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="saveCategoryFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the label (tag) create/edit modal with color picker.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderLabelModalHtml() {
  if (!state.showLabelModal) return '';
  const editingLabel = state.editingLabelId
    ? (state.taskLabels || []).find(l => l.id === state.editingLabelId)
    : null;
  return `
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){showLabelModal=false; editingLabelId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="label-modal-title">
      <div class="modal-enhanced w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="label-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingLabel ? 'Edit Tag' : 'New Tag'}</h3>
          <button onclick="showLabelModal=false; editingLabelId=null; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Name</label>
            <input type="text" id="label-name" value="${editingLabel?.name ? escapeHtml(editingLabel.name) : ''}"
              placeholder="e.g., Important" autofocus maxlength="50"
              onkeydown="if(event.key==='Enter'){event.preventDefault();saveLabelFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Color</label>
            <input type="color" id="label-color" value="${editingLabel?.color || '#6B7280'}"
              class="w-full h-10 rounded-lg border border-[var(--border)] cursor-pointer">
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${editingLabel ? `
            <button onclick="if(confirm('Delete this tag?')){deleteLabel('${editingLabel.id}'); showLabelModal=false; editingLabelId=null; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-2">
            <button onclick="showLabelModal=false; editingLabelId=null; render()"
              class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="saveLabelFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
              ${editingLabel ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the person create/edit modal.
 * @returns {string} HTML string, or '' if modal is closed
 */
export function renderPersonModalHtml() {
  if (!state.showPersonModal) return '';
  const editingPerson = state.editingPersonId
    ? (state.taskPeople || []).find(p => p.id === state.editingPersonId)
    : null;
  return `
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){showPersonModal=false; editingPersonId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
      <div class="modal-enhanced w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="person-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingPerson ? 'Edit Person' : 'New Person'}</h3>
          <button onclick="showPersonModal=false; editingPersonId=null; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          ${editingPerson?.photoData ? `
            <div class="flex justify-center">
              ${renderPersonAvatar(editingPerson, 64)}
            </div>
          ` : ''}
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Name</label>
            <input type="text" id="person-name" value="${editingPerson?.name ? escapeHtml(editingPerson.name) : ''}"
              placeholder="e.g., John Doe" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Email</label>
            <input type="email" id="person-email" value="${editingPerson?.email ? escapeHtml(editingPerson.email) : ''}"
              placeholder="e.g., mostafa@company.com" maxlength="160"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${editingPerson ? `
            <button onclick="if(confirm('Delete this person?')){deletePerson('${editingPerson.id}'); showPersonModal=false; editingPersonId=null; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-2">
            <button onclick="showPersonModal=false; editingPersonId=null; render()"
              class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="savePersonFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
              ${editingPerson ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
