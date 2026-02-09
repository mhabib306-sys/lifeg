// ============================================================================
// BRAINDUMP UI — Overlay, FAB, review cards, interaction handlers
// ============================================================================
// Two-step flow:
//   Step 1 (input): Textarea for free-form text entry
//   Step 2 (review): Classified items with editable metadata

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';
import { parseBraindump, submitBraindumpItems } from '../features/braindump.js';

// ============================================================================
// Open / Close
// ============================================================================

export function openBraindump() {
  state.showBraindump = true;
  state.braindumpStep = 'input';
  state.braindumpRawText = '';
  state.braindumpParsedItems = [];
  state.braindumpEditingIndex = null;
  window.render();
  // Focus textarea after render
  setTimeout(() => {
    const ta = document.getElementById('braindump-textarea');
    if (ta) ta.focus();
  }, 100);
}

export function closeBraindump() {
  state.showBraindump = false;
  state.braindumpRawText = '';
  state.braindumpParsedItems = [];
  state.braindumpStep = 'input';
  state.braindumpEditingIndex = null;
  window.render();
}

// ============================================================================
// Process (Step 1 → Step 2)
// ============================================================================

export function processBraindump() {
  const ta = document.getElementById('braindump-textarea');
  if (ta) state.braindumpRawText = ta.value;
  if (!state.braindumpRawText.trim()) return;

  state.braindumpParsedItems = parseBraindump(state.braindumpRawText);
  state.braindumpStep = 'review';
  state.braindumpEditingIndex = null;
  window.render();
}

export function backToInput() {
  state.braindumpStep = 'input';
  state.braindumpEditingIndex = null;
  window.render();
  setTimeout(() => {
    const ta = document.getElementById('braindump-textarea');
    if (ta) ta.focus();
  }, 100);
}

// ============================================================================
// Item manipulation (Review step)
// ============================================================================

export function toggleBraindumpItemType(index) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.type = item.type === 'task' ? 'note' : 'task';
  window.render();
}

export function toggleBraindumpItemInclude(index) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.included = !item.included;
  window.render();
}

export function removeBraindumpItem(index) {
  state.braindumpParsedItems.splice(index, 1);
  // Re-index
  state.braindumpParsedItems.forEach((item, i) => item.index = i);
  window.render();
}

export function editBraindumpItem(index) {
  state.braindumpEditingIndex = index;
  window.render();
  setTimeout(() => {
    const input = document.getElementById(`braindump-edit-${index}`);
    if (input) { input.focus(); input.select(); }
  }, 50);
}

export function saveBraindumpItemEdit(index) {
  const input = document.getElementById(`braindump-edit-${index}`);
  if (input) {
    state.braindumpParsedItems[index].title = input.value.trim() || state.braindumpParsedItems[index].title;
  }
  state.braindumpEditingIndex = null;
  window.render();
}

export function cancelBraindumpItemEdit() {
  state.braindumpEditingIndex = null;
  window.render();
}

export function setBraindumpItemArea(index, categoryId) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.categoryId = categoryId || null;
  window.render();
}

export function addBraindumpItemLabel(index, labelId) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  if (!item.labels.includes(labelId)) {
    item.labels.push(labelId);
  }
  window.render();
}

export function removeBraindumpItemLabel(index, labelId) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.labels = item.labels.filter(id => id !== labelId);
  window.render();
}

export function addBraindumpItemPerson(index, personId) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  if (!item.people.includes(personId)) {
    item.people.push(personId);
  }
  window.render();
}

export function removeBraindumpItemPerson(index, personId) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.people = item.people.filter(id => id !== personId);
  window.render();
}

export function setBraindumpItemDate(index, date) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.deferDate = date;
  window.render();
}

export function clearBraindumpItemDate(index) {
  const item = state.braindumpParsedItems[index];
  if (!item) return;
  item.deferDate = null;
  item.dueDate = null;
  window.render();
}

// ============================================================================
// Submit
// ============================================================================

export function submitBraindump() {
  const result = submitBraindumpItems(state.braindumpParsedItems);

  // Show success briefly then close
  state.braindumpStep = 'success';
  state.braindumpSuccessMessage = `Added ${result.taskCount} task${result.taskCount !== 1 ? 's' : ''} and ${result.noteCount} note${result.noteCount !== 1 ? 's' : ''}`;
  window.render();

  setTimeout(() => {
    closeBraindump();
  }, 1500);
}

// ============================================================================
// FAB Renderer
// ============================================================================

export function renderBraindumpFAB() {
  // Don't show FAB if braindump is already open
  if (state.showBraindump) return '';

  return `
    <button onclick="openBraindump()" class="braindump-fab" title="Braindump (Cmd+Shift+D)" aria-label="Open Braindump">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.5 2a5.5 5.5 0 0 1 5 7.7c.4.4.8.9 1 1.5a3.5 3.5 0 0 1-1.5 6.8H9.5a5.5 5.5 0 0 1 0-11z"/>
        <path d="M14 13.5a3 3 0 0 0-5 0"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="8" y1="22" x2="16" y2="22"/>
      </svg>
    </button>
  `;
}

// ============================================================================
// Overlay Renderer
// ============================================================================

export function renderBraindumpOverlay() {
  if (!state.showBraindump) return '';

  if (state.braindumpStep === 'success') {
    return renderSuccessOverlay();
  }

  if (state.braindumpStep === 'review') {
    return renderReviewStep();
  }

  return renderInputStep();
}

// ---- Step 1: Input ----
function renderInputStep() {
  const lineCount = state.braindumpRawText ? state.braindumpRawText.split('\n').filter(l => l.trim()).length : 0;

  return `
    <div class="braindump-overlay" onclick="if(event.target===this)closeBraindump()">
      <div class="braindump-container">
        <div class="braindump-header">
          <div class="flex items-center gap-3">
            <div class="braindump-icon">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.5 2a5.5 5.5 0 0 1 5 7.7c.4.4.8.9 1 1.5a3.5 3.5 0 0 1-1.5 6.8H9.5a5.5 5.5 0 0 1 0-11z"/>
                <path d="M14 13.5a3 3 0 0 0-5 0"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-[var(--text-primary)]">Braindump</h2>
              <p class="text-xs text-[var(--text-muted)]">Pour it all out. We'll sort it.</p>
            </div>
          </div>
          <button onclick="closeBraindump()" class="braindump-close" aria-label="Close">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div class="braindump-body">
          <textarea id="braindump-textarea" class="braindump-textarea"
            placeholder="Type freely... tasks, notes, ideas. One per line, or just let it flow."
            oninput="state.braindumpRawText = this.value"
          >${escapeHtml(state.braindumpRawText)}</textarea>

          <div class="braindump-tips">
            <span class="braindump-tip"># areas</span>
            <span class="braindump-tip">@ tags</span>
            <span class="braindump-tip">& people</span>
            <span class="braindump-tip">! dates</span>
          </div>
        </div>

        <div class="braindump-footer">
          ${lineCount > 0 ? `<span class="text-xs text-[var(--text-muted)]">${lineCount} item${lineCount !== 1 ? 's' : ''}</span>` : '<span></span>'}
          <button onclick="processBraindump()" class="braindump-process-btn" ${!state.braindumpRawText.trim() ? 'disabled' : ''}>
            Process
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ---- Step 2: Review ----
function renderReviewStep() {
  const items = state.braindumpParsedItems;
  const taskCount = items.filter(i => i.included && i.type === 'task').length;
  const noteCount = items.filter(i => i.included && i.type === 'note').length;

  return `
    <div class="braindump-overlay" onclick="if(event.target===this)closeBraindump()">
      <div class="braindump-container braindump-review">
        <div class="braindump-header">
          <div class="flex items-center gap-3">
            <button onclick="backToInput()" class="braindump-back" aria-label="Back">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <div>
              <h2 class="text-lg font-bold text-[var(--text-primary)]">Review</h2>
              <p class="text-xs text-[var(--text-muted)]">${taskCount} task${taskCount !== 1 ? 's' : ''}, ${noteCount} note${noteCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onclick="closeBraindump()" class="braindump-close" aria-label="Close">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div class="braindump-body braindump-items-list">
          ${items.map((item, i) => renderBraindumpItemCard(item, i)).join('')}
        </div>

        <div class="braindump-footer">
          <span class="text-xs text-[var(--text-muted)]">${items.filter(i => i.included).length} of ${items.length} selected</span>
          <button onclick="submitBraindump()" class="braindump-submit-btn" ${items.filter(i => i.included).length === 0 ? 'disabled' : ''}>
            Add All
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ---- Item Card ----
function renderBraindumpItemCard(item, index) {
  const isEditing = state.braindumpEditingIndex === index;
  const lowConfidence = item.confidence < 0.5;
  const cat = item.categoryId ? state.taskCategories.find(c => c.id === item.categoryId) : null;

  // Confidence color
  const confColor = item.confidence >= 0.8 ? 'var(--accent)' :
                    item.confidence >= 0.5 ? '#F59E0B' : '#EF4444';

  return `
    <div class="braindump-item ${!item.included ? 'braindump-item-excluded' : ''} ${lowConfidence ? 'braindump-item-low-conf' : ''}">
      <div class="braindump-item-top">
        <label class="braindump-item-check">
          <input type="checkbox" ${item.included ? 'checked' : ''}
            onchange="toggleBraindumpItemInclude(${index})" />
        </label>

        <div class="braindump-type-toggle" onclick="toggleBraindumpItemType(${index})">
          <span class="braindump-type-label ${item.type === 'task' ? 'active' : ''}">Task</span>
          <span class="braindump-type-label ${item.type === 'note' ? 'active' : ''}">Note</span>
        </div>

        <button onclick="removeBraindumpItem(${index})" class="braindump-item-remove" aria-label="Remove">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>

      <div class="braindump-item-title" onclick="editBraindumpItem(${index})">
        ${isEditing ? `
          <input id="braindump-edit-${index}" type="text" class="braindump-edit-input"
            value="${escapeHtml(item.title)}"
            onkeydown="if(event.key==='Enter'){saveBraindumpItemEdit(${index});event.preventDefault()}else if(event.key==='Escape')cancelBraindumpItemEdit()"
            onblur="saveBraindumpItemEdit(${index})" />
        ` : `
          <span class="braindump-title-text">${escapeHtml(item.title)}</span>
        `}
      </div>

      <div class="braindump-item-meta">
        ${cat ? `
          <span class="braindump-chip braindump-chip-area" style="--chip-color: ${cat.color}">
            ${escapeHtml(cat.name)}
            <button onclick="event.stopPropagation(); setBraindumpItemArea(${index}, null)" class="braindump-chip-remove">&times;</button>
          </span>
        ` : ''}
        ${item.labels.map(lid => {
          const label = state.taskLabels.find(l => l.id === lid);
          return label ? `
            <span class="braindump-chip braindump-chip-tag" style="--chip-color: ${label.color}">
              ${escapeHtml(label.name)}
              <button onclick="event.stopPropagation(); removeBraindumpItemLabel(${index}, '${lid}')" class="braindump-chip-remove">&times;</button>
            </span>
          ` : '';
        }).join('')}
        ${item.people.map(pid => {
          const person = state.taskPeople.find(p => p.id === pid);
          return person ? `
            <span class="braindump-chip braindump-chip-person" style="--chip-color: ${person.color}">
              ${escapeHtml(person.name)}
              <button onclick="event.stopPropagation(); removeBraindumpItemPerson(${index}, '${pid}')" class="braindump-chip-remove">&times;</button>
            </span>
          ` : '';
        }).join('')}
        ${item.deferDate ? `
          <span class="braindump-chip braindump-chip-date">
            ${item.deferDate}
            <button onclick="event.stopPropagation(); clearBraindumpItemDate(${index})" class="braindump-chip-remove">&times;</button>
          </span>
        ` : ''}
        ${item.dueDate ? `
          <span class="braindump-chip braindump-chip-date">
            Due: ${item.dueDate}
            <button onclick="event.stopPropagation(); clearBraindumpItemDate(${index})" class="braindump-chip-remove">&times;</button>
          </span>
        ` : ''}
      </div>

      <div class="braindump-confidence-row">
        <div class="braindump-confidence-bar">
          <div class="braindump-confidence-fill" style="width: ${item.confidence * 100}%; background: ${confColor};"></div>
        </div>
        <span class="braindump-confidence-label" style="color: ${confColor}">${Math.round(item.confidence * 100)}%</span>
      </div>
    </div>
  `;
}

// ---- Success overlay ----
function renderSuccessOverlay() {
  return `
    <div class="braindump-overlay">
      <div class="braindump-success">
        <svg class="w-12 h-12 text-green-500 mb-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p class="text-base font-semibold text-[var(--text-primary)]">${state.braindumpSuccessMessage || 'Done!'}</p>
      </div>
    </div>
  `;
}
