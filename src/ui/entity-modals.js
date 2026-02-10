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
import { escapeHtml } from '../utils.js';

// ============================================================================
// ENTITY MODAL SAVE FUNCTIONS (Area, Label, Person)
// ============================================================================

/**
 * Save or update an area from its modal.
 */
export function saveAreaFromModal() {
  const name = document.getElementById('area-name').value.trim();
  if (!name) {
    alert('Please enter an area name');
    return;
  }

  if (state.editingAreaId) {
    updateArea(state.editingAreaId, { name });
  } else {
    createArea(name);
  }
  state.showAreaModal = false;
  state.editingAreaId = null;
  window.render();
}

/**
 * Save or update a category (sub-area) from its modal.
 */
export function saveCategoryFromModal() {
  const name = document.getElementById('category-name')?.value?.trim();
  const areaId = document.getElementById('category-area')?.value;
  const color = document.getElementById('category-color')?.value || '#6366F1';
  if (!name) { alert('Please enter a name'); return; }
  if (!areaId) { alert('Please select an area'); return; }

  if (state.editingCategoryId) {
    updateCategory(state.editingCategoryId, { name, areaId, color });
  } else {
    const cat = createCategory(name, areaId);
    if (color !== cat.color) updateCategory(cat.id, { color });
  }
  state.showCategoryModal = false;
  state.editingCategoryId = null;
  window.render();
}

/**
 * Save or update a label (tag) from its modal.
 */
export function saveLabelFromModal() {
  const name = document.getElementById('label-name').value.trim();
  if (!name) {
    alert('Please enter a tag name');
    return;
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
    alert('Please enter a name');
    return;
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
    alert('Please enter a perspective name');
    return;
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
      state.customPerspectives[idx] = { ...state.customPerspectives[idx], name, icon, filter };
      saveTasksData();
    }
    state.activePerspective = state.editingPerspectiveId;
  } else {
    createPerspective(name, icon, filter);
    state.activePerspective = state.customPerspectives[state.customPerspectives.length - 1].id;
  }
  state.showPerspectiveModal = false;
  state.editingPerspectiveId = null;
  window.render();
}

// ============================================================================
// EMOJI PICKER
// ============================================================================

/**
 * Select an emoji for the perspective icon and close the picker.
 */
export function selectPerspectiveEmoji(emoji) {
  const iconInput = document.getElementById('perspective-icon');
  const iconDisplay = document.getElementById('perspective-icon-display');
  if (iconInput) iconInput.value = emoji;
  if (iconDisplay) iconDisplay.textContent = emoji;
  state.perspectiveEmojiPickerOpen = false;
  state.emojiSearchQuery = '';
  window.render();
}

// Emoji picker data and renderer for perspective icon selection
const EMOJI_CATEGORIES = {
  'Smileys': '\uD83D\uDE00\uD83D\uDE03\uD83D\uDE04\uD83D\uDE01\uD83D\uDE06\uD83D\uDE05\uD83E\uDD23\uD83D\uDE02\uD83D\uDE42\uD83D\uDE09\uD83D\uDE0A\uD83D\uDE07\uD83E\uDD70\uD83D\uDE0D\uD83E\uDD29\uD83D\uDE18\uD83D\uDE1A\uD83E\uDD14\uD83E\uDD28\uD83D\uDE10\uD83D\uDE11\uD83D\uDE36\uD83D\uDE44\uD83D\uDE0F\uD83D\uDE12\uD83D\uDE1E\uD83D\uDE22\uD83D\uDE2D\uD83D\uDE24\uD83E\uDD2F\uD83D\uDE31\uD83D\uDE28\uD83E\uDD75\uD83E\uDD76',
  'Objects': '\uD83D\uDCCC\uD83D\uDCCB\uD83D\uDCC5\uD83D\uDCCA\uD83D\uDD0D\uD83D\uDCA1\uD83D\uDD14\u2B50\uD83C\uDF1F\uD83D\uDD25\u2764\uFE0F\uD83D\uDC8E\uD83C\uDFC6\uD83C\uDF96\uFE0F\uD83C\uDFAF\uD83D\uDE80\u2708\uFE0F\uD83D\uDCE6\uD83D\uDCE7\u2709\uFE0F\uD83D\uDCDD\uD83D\uDCD3\uD83D\uDCD6\uD83D\uDCDA\uD83D\uDCBB\uD83D\uDCF1\u2328\uFE0F\uD83D\uDDA5\uFE0F\uD83C\uDFA8\uD83C\uDFB5\uD83C\uDFAC\uD83D\uDCF7\uD83C\uDFAE\u26BD\uD83C\uDFC0',
  'Nature': '\uD83C\uDF33\uD83C\uDF32\uD83C\uDF3F\u2618\uFE0F\uD83C\uDF40\uD83C\uDF3A\uD83C\uDF39\uD83C\uDF3B\uD83C\uDF3C\uD83C\uDF37\uD83C\uDF1E\uD83C\uDF19\u2B50\u26A1\uD83C\uDF08\u2744\uFE0F\uD83D\uDCA7\uD83C\uDF0A\uD83D\uDD25\uD83C\uDF3E\uD83C\uDF43\uD83C\uDF42\uD83C\uDF41\uD83D\uDC1D\uD83E\uDD8B',
  'People': '\uD83D\uDC64\uD83D\uDC65\uD83D\uDC68\u200D\uD83D\uDCBB\uD83D\uDC69\u200D\uD83D\uDCBB\uD83D\uDC68\u200D\uD83D\uDD2C\uD83D\uDC69\u200D\uD83D\uDD2C\uD83D\uDC68\u200D\uD83C\uDFEB\uD83D\uDC69\u200D\uD83C\uDFEB\uD83E\uDDD1\u200D\uD83D\uDCBC\uD83E\uDDD1\u200D\uD83D\uDD27\uD83E\uDDD1\u200D\uD83C\uDFA8\uD83D\uDC77\uD83E\uDDB8\uD83E\uDDB9\uD83E\uDDD9',
  'Symbols': '\u2705\u274C\u2757\u2753\u26A0\uFE0F\u267B\uFE0F\uD83D\uDD04\u2195\uFE0F\u2194\uFE0F\u25B6\uFE0F\u23F8\uFE0F\u23F9\uFE0F\uD83D\uDD00\uD83D\uDD01\uD83D\uDD02\u2795\u2796\u2716\uFE0F\u2797\uD83D\uDFF0\uD83D\uDFF1\uD83D\uDFE2\uD83D\uDFE1\uD83D\uDFE0\uD83D\uDD34\uD83D\uDFE3\uD83D\uDFE4\u26AB\u26AA\uD83D\uDD35\uD83D\uDFE6'
};

function renderEmojiPicker() {
  const searchQuery = state.emojiSearchQuery || '';
  let emojiGridHtml = '';

  for (const [category, emojiStr] of Object.entries(EMOJI_CATEGORIES)) {
    const emojis = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(emojiStr)].map(s => s.segment).filter(e => e.trim());
    const filtered = searchQuery
      ? emojis.filter(() => category.toLowerCase().includes(searchQuery.toLowerCase()))
      : emojis;
    if (filtered.length === 0) continue;
    emojiGridHtml += `
      <div class="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 pt-2 pb-1">${category}</div>
      <div class="grid grid-cols-8 gap-0.5">
        ${filtered.map(e => `<button type="button" class="w-8 h-8 flex items-center justify-center text-lg rounded-md hover:bg-[var(--accent-light)] transition cursor-pointer" onclick="event.stopPropagation(); selectPerspectiveEmoji('${e.replace(/'/g, "\\'")}')">${e}</button>`).join('')}
      </div>
    `;
  }

  return `
    <div class="absolute top-14 left-0 z-[400] w-72 bg-[var(--modal-bg)] rounded-xl border border-[var(--border-light)] shadow-xl overflow-hidden" onclick="event.stopPropagation()">
      <div class="p-2 border-b border-[var(--border-light)]">
        <input type="text" id="emoji-search-input" placeholder="Search emojis..." value="${escapeHtml(searchQuery)}"
          oninput="emojiSearchQuery=this.value; render()"
          class="w-full px-3 py-1.5 text-[13px] border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)] focus:outline-none focus:border-[var(--accent)]">
      </div>
      <div class="p-2 max-h-52 overflow-y-auto">
        ${emojiGridHtml || '<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>'}
      </div>
    </div>
  `;
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
  const currentIcon = editingPerspective?.icon || '\uD83D\uDCCC';
  return `
    <div class="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()}" role="dialog" aria-modal="true" aria-labelledby="perspective-modal-title">
      <div class="modal-enhanced w-full max-w-lg mx-4" onclick="event.stopPropagation()">
        <!-- Mobile drag handle -->
        <div class="flex justify-center pt-3 pb-1 md:hidden">
          <div class="w-10 h-1 rounded-full bg-[var(--text-muted)]/30"></div>
        </div>
        <!-- Header -->
        <div class="modal-header-enhanced">
          <h3 id="perspective-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editingPerspective ? 'Edit Custom View' : 'New Custom View'}</h3>
          <button onclick="showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()" aria-label="Close dialog" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-enhanced">
          <!-- Name & Icon -->
          <div class="modal-section">
            <div class="flex items-start gap-3">
              <div class="relative">
                <button type="button" onclick="perspectiveEmojiPickerOpen=!perspectiveEmojiPickerOpen; render()"
                  class="w-12 h-12 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-2xl hover:border-[var(--accent)] transition cursor-pointer" title="Pick icon">
                  <span id="perspective-icon-display">${currentIcon}</span>
                </button>
                <input type="hidden" id="perspective-icon" value="${currentIcon}">
                ${state.perspectiveEmojiPickerOpen ? renderEmojiPicker() : ''}
              </div>
              <div class="flex-1">
                <input type="text" id="perspective-name" placeholder="View name, e.g. Work Projects" autofocus maxlength="100"
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
                    <option value="all">All rules</option>
                    <option value="any">Any rule</option>
                    <option value="none">No rules</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Availability</label>
                  <select id="perspective-availability" class="modal-input-enhanced">
                    <option value="available">Available</option>
                    <option value="">Any</option>
                    <option value="remaining">Remaining</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Area</label>
                  <select id="perspective-category" class="modal-input-enhanced">
                    <option value="">Any area</option>
                    ${(state.taskAreas || []).map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Person</label>
                  <select id="perspective-person" class="modal-input-enhanced">
                    <option value="">Any person</option>
                    ${(state.taskPeople || []).map(person => `<option value="${person.id}">${escapeHtml(person.name)}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Status</label>
                  <select id="perspective-status" class="modal-input-enhanced">
                    <option value="">Any status</option>
                    <option value="inbox">Inbox</option>
                    <option value="today">Today</option>
                    <option value="anytime">Anytime</option>
                    <option value="someday">Someday</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Special</label>
                  <select id="perspective-status-rule" class="modal-input-enhanced">
                    <option value="">None</option>
                    <option value="flagged">Flagged</option>
                    <option value="dueSoon">Due Soon (7 days)</option>
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
                <option value="any">Match any</option>
                <option value="all">Match all</option>
              </select>
            </div>
            <div class="border border-[var(--border)] rounded-lg p-2 max-h-28 overflow-y-auto space-y-0.5">
              ${(state.taskLabels || []).length > 0 ? state.taskLabels.map(label => `
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--bg-secondary)] cursor-pointer transition">
                  <input type="checkbox" class="perspective-tag-checkbox rounded border-[var(--border)]" value="${label.id}">
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
                <input type="checkbox" id="perspective-due" class="rounded border-[var(--border)]">
                Has due date
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-defer" class="rounded border-[var(--border)]">
                Has defer date
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-repeat" class="rounded border-[var(--border)]">
                Repeating
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-untagged" class="rounded border-[var(--border)]">
                Untagged
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-inbox" class="rounded border-[var(--border)]">
                Inbox only
              </label>
            </div>
          </div>

          <!-- Date Range -->
          <div class="modal-section">
            <div class="modal-section-label">Date Range</div>
            <div class="grid grid-cols-3 gap-2">
              <select id="perspective-range-type" class="modal-input-enhanced text-[13px]">
                <option value="either">Due or Defer</option>
                <option value="due">Due only</option>
                <option value="defer">Defer only</option>
              </select>
              <input type="date" id="perspective-range-start" class="modal-input-enhanced text-[13px]">
              <input type="date" id="perspective-range-end" class="modal-input-enhanced text-[13px]">
            </div>
          </div>

          <!-- Search Terms -->
          <div class="modal-section">
            <div class="modal-section-label">Search Terms</div>
            <input type="text" id="perspective-search" placeholder="Title or notes contains..."
              class="modal-input-enhanced">
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-enhanced">
          ${editingPerspective ? `
            <button onclick="if(confirm('Delete this custom view?')){deletePerspective('${editingPerspective.id}'); showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render();}"
              class="px-4 py-2 text-[13px] text-red-500 hover:text-red-700 mr-auto">Delete</button>
          ` : ''}
          <button onclick="showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()"
            class="px-4 py-2 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">Cancel</button>
          <button onclick="savePerspectiveFromModal()" class="px-5 py-2 rounded-lg text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition">
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
  return `
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showAreaModal=false; editingAreaId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="area-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="area-modal-title" class="font-semibold text-charcoal">${editingArea ? 'Edit Area' : 'New Area'}</h3>
          <button onclick="showAreaModal=false; editingAreaId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="area-name" value="${editingArea?.name ? escapeHtml(editingArea.name) : ''}"
              placeholder="e.g., Work, Personal, Health" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();saveAreaFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingArea ? `
            <button onclick="if(confirm('Delete this area?')){deleteArea('${editingArea.id}'); showAreaModal=false; editingAreaId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showAreaModal=false; editingAreaId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="saveAreaFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
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

  return `
    <div class="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[300]" onclick="if(event.target===this){showCategoryModal=false;editingCategoryId=null;render()}" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div class="modal-enhanced w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="modal-header-enhanced">
          <h3 id="category-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${editing ? 'Edit' : 'New'} Category</h3>
          <button onclick="showCategoryModal=false;editingCategoryId=null;render()" aria-label="Close dialog" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <div>
            <label class="modal-section-label">Name</label>
            <input type="text" id="category-name" value="${editing ? escapeHtml(editing.name) : ''}" placeholder="Category name"
              class="modal-input-enhanced w-full" autofocus onkeydown="if(event.key==='Enter'){event.preventDefault();saveCategoryFromModal();}">
          </div>
          <div>
            <label class="modal-section-label">Area</label>
            <select id="category-area" class="modal-input-enhanced w-full">
              ${(state.taskAreas || []).map(a => `<option value="${a.id}" ${a.id === defaultAreaId ? 'selected' : ''}>${escapeHtml(a.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="modal-section-label">Color</label>
            <input type="color" id="category-color" value="${defaultColor}" class="w-10 h-10 rounded cursor-pointer border-0">
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${editing ? `<button onclick="window.deleteCategory('${editing.id}'); showCategoryModal=false; editingCategoryId=null; render()" class="px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition">Delete</button>` : '<div></div>'}
          <div class="flex gap-2">
            <button onclick="showCategoryModal=false;editingCategoryId=null;render()" class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
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
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showLabelModal=false; editingLabelId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="label-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="label-modal-title" class="font-semibold text-charcoal">${editingLabel ? 'Edit Tag' : 'New Tag'}</h3>
          <button onclick="showLabelModal=false; editingLabelId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="label-name" value="${editingLabel?.name ? escapeHtml(editingLabel.name) : ''}"
              placeholder="e.g., Important" autofocus maxlength="50"
              onkeydown="if(event.key==='Enter'){event.preventDefault();saveLabelFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Color</label>
            <input type="color" id="label-color" value="${editingLabel?.color || '#6B7280'}"
              class="w-full h-10 rounded border border-softborder cursor-pointer">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingLabel ? `
            <button onclick="if(confirm('Delete this tag?')){deleteLabel('${editingLabel.id}'); showLabelModal=false; editingLabelId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showLabelModal=false; editingLabelId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="saveLabelFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
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
    <div class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[300]" onclick="if(event.target===this){showPersonModal=false; editingPersonId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
      <div class="modal-content bg-[var(--modal-bg)] rounded-xl shadow-xl w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b border-softborder flex items-center justify-between">
          <h3 id="person-modal-title" class="font-semibold text-charcoal">${editingPerson ? 'Edit Person' : 'New Person'}</h3>
          <button onclick="showPersonModal=false; editingPersonId=null; render()" aria-label="Close dialog" class="text-charcoal/50 hover:text-charcoal text-xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Name</label>
            <input type="text" id="person-name" value="${editingPerson?.name ? escapeHtml(editingPerson.name) : ''}"
              placeholder="e.g., John Doe" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
          <div>
            <label class="text-sm text-charcoal/70 block mb-1">Email</label>
            <input type="email" id="person-email" value="${editingPerson?.email ? escapeHtml(editingPerson.email) : ''}"
              placeholder="e.g., mostafa@company.com" maxlength="160"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="w-full px-3 py-2 border border-softborder rounded focus:border-coral focus:outline-none">
          </div>
        </div>
        <div class="px-6 py-4 border-t border-softborder flex justify-between">
          ${editingPerson ? `
            <button onclick="if(confirm('Delete this person?')){deletePerson('${editingPerson.id}'); showPersonModal=false; editingPersonId=null; render();}"
              class="px-4 py-2 text-sm text-red-500 hover:text-red-700">Delete</button>
          ` : '<div></div>'}
          <div class="flex gap-3">
            <button onclick="showPersonModal=false; editingPersonId=null; render()"
              class="px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal">Cancel</button>
            <button onclick="savePersonFromModal()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
              ${editingPerson ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
