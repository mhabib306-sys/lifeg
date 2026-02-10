// ============================================================================
// BRAINDUMP UI — Overlay, FAB, review cards, interaction handlers
// ============================================================================
// Two-step flow:
//   Step 1 (input): Textarea for free-form text entry
//   Step 2 (review): Classified items with editable metadata

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';
import { parseBraindump, getAnthropicKey, refineVoiceTranscriptWithAI, submitBraindumpItems } from '../features/braindump.js';

let speechRecognition = null;
let speechFinalText = '';

function getSpeechRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function mergeTranscript(text) {
  const transcript = (text || '').trim();
  if (!transcript) return;
  const existing = (state.braindumpRawText || '').trim();
  state.braindumpRawText = existing ? `${existing}\n${transcript}` : transcript;
}

function stopSpeechRecognitionInternal() {
  if (speechRecognition) {
    try { speechRecognition.stop(); } catch {}
  }
}

// ============================================================================
// Open / Close
// ============================================================================

export function openBraindump() {
  speechFinalText = '';
  speechRecognition = null;
  state.showBraindump = true;
  state.braindumpStep = 'input';
  state.braindumpRawText = '';
  state.braindumpParsedItems = [];
  state.braindumpEditingIndex = null;
  state.braindumpVoiceRecording = false;
  state.braindumpVoiceTranscribing = false;
  state.braindumpVoiceError = null;
  window.render();
  // Focus textarea after render
  setTimeout(() => {
    const ta = document.getElementById('braindump-textarea');
    if (ta) ta.focus();
  }, 100);
}

export function closeBraindump() {
  stopSpeechRecognitionInternal();
  speechRecognition = null;
  speechFinalText = '';
  state.showBraindump = false;
  state.braindumpRawText = '';
  state.braindumpParsedItems = [];
  state.braindumpStep = 'input';
  state.braindumpEditingIndex = null;
  state.braindumpVoiceRecording = false;
  state.braindumpVoiceTranscribing = false;
  state.braindumpVoiceError = null;
  window.render();
}

// ============================================================================
// Process (Step 1 → Step 2)
// ============================================================================

export async function processBraindump() {
  const ta = document.getElementById('braindump-textarea');
  if (ta) state.braindumpRawText = ta.value;
  if (!state.braindumpRawText.trim()) return;

  // Show processing state if AI is configured
  const useAI = !!getAnthropicKey();
  if (useAI) {
    state.braindumpProcessing = true;
    state.braindumpStep = 'processing';
    window.render();
  }

  try {
    state.braindumpParsedItems = await parseBraindump(state.braindumpRawText);
  } finally {
    state.braindumpProcessing = false;
  }

  state.braindumpStep = 'review';
  state.braindumpEditingIndex = null;
  window.render();
}

export function startBraindumpVoiceCapture() {
  if (state.braindumpVoiceRecording || state.braindumpVoiceTranscribing) return;
  state.braindumpVoiceError = null;

  const SpeechCtor = getSpeechRecognitionCtor();
  if (!SpeechCtor) {
    state.braindumpVoiceError = 'Voice input is not supported on this device/browser.';
    window.render();
    return;
  }

  speechFinalText = '';
  const recognition = new SpeechCtor();
  speechRecognition = recognition;
  recognition.lang = navigator.language || 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    state.braindumpVoiceRecording = true;
    state.braindumpVoiceTranscribing = false;
    state.braindumpVoiceError = null;
    window.render();
  };

  recognition.onresult = (event) => {
    let finalChunk = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = (result?.[0]?.transcript || '').trim();
      if (result.isFinal && transcript) {
        finalChunk += `${transcript}\n`;
      }
    }
    if (finalChunk) {
      speechFinalText += finalChunk;
      const ta = document.getElementById('braindump-textarea');
      if (ta) {
        const merged = ((state.braindumpRawText || '').trim()
          ? `${state.braindumpRawText.trim()}\n${speechFinalText.trim()}`
          : speechFinalText.trim());
        ta.value = merged;
      }
    }
  };

  recognition.onerror = (event) => {
    state.braindumpVoiceRecording = false;
    state.braindumpVoiceTranscribing = false;
    if (event?.error !== 'no-speech' && event?.error !== 'aborted') {
      state.braindumpVoiceError = `Voice input error: ${event.error || 'unknown'}`;
    }
    window.render();
  };

  recognition.onend = async () => {
    const rawTranscript = speechFinalText.trim();
    speechFinalText = '';
    speechRecognition = null;
    state.braindumpVoiceRecording = false;
    state.braindumpVoiceTranscribing = !!rawTranscript;
    window.render();
    if (rawTranscript) {
      const cleaned = await refineVoiceTranscriptWithAI(rawTranscript);
      mergeTranscript(cleaned);
    }
    state.braindumpVoiceTranscribing = false;
    window.render();
    setTimeout(() => {
      const ta = document.getElementById('braindump-textarea');
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }, 50);
  };

  state.braindumpVoiceTranscribing = true;
  window.render();
  recognition.start();
}

export function stopBraindumpVoiceCapture() {
  if (!speechRecognition) return;
  state.braindumpVoiceTranscribing = false;
  stopSpeechRecognitionInternal();
}

export function toggleBraindumpVoiceCapture() {
  if (state.braindumpVoiceRecording || state.braindumpVoiceTranscribing) {
    stopBraindumpVoiceCapture();
  } else {
    startBraindumpVoiceCapture();
  }
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
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="14 3 14 9 20 9"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
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

  if (state.braindumpStep === 'processing') {
    return renderProcessingStep();
  }

  if (state.braindumpStep === 'review') {
    return renderReviewStep();
  }

  return renderInputStep();
}

// ---- Step 1: Input ----
function renderInputStep() {
  const lineCount = state.braindumpRawText ? state.braindumpRawText.split('\n').filter(l => l.trim()).length : 0;
  const voiceActive = state.braindumpVoiceRecording || state.braindumpVoiceTranscribing;
  const voiceLabel = state.braindumpVoiceTranscribing ? 'Processing Voice...' : voiceActive ? 'Stop Voice' : 'Voice Input';

  return `
    <div class="braindump-overlay" onclick="if(event.target===this)closeBraindump()">
      <div class="braindump-container">
        <div class="braindump-header">
          <div class="flex items-center gap-3">
            <div class="braindump-icon">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="14 3 14 9 20 9"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="13" y2="17"/>
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
            oninput="state.braindumpRawText = this.value; document.getElementById('braindump-process-btn').disabled = !this.value.trim() || state.braindumpVoiceRecording || state.braindumpVoiceTranscribing; var c = this.value.split('\\n').filter(l=>l.trim()).length; document.getElementById('braindump-count').textContent = c > 0 ? c + ' item' + (c!==1?'s':'') : '';"
          >${escapeHtml(state.braindumpRawText)}</textarea>

          <div class="braindump-tips">
            <span class="braindump-tip"># areas</span>
            <span class="braindump-tip">@ tags</span>
            <span class="braindump-tip">& people</span>
            <span class="braindump-tip">! dates</span>
            <span class="braindump-tip">voice dictation</span>
          </div>

          ${state.braindumpVoiceError ? `
            <div class="braindump-voice-error">${escapeHtml(state.braindumpVoiceError)}</div>
          ` : ''}
        </div>

        <div class="braindump-footer">
          <div class="braindump-footer-left">
            <span id="braindump-count" class="text-xs text-[var(--text-muted)]">${lineCount > 0 ? `${lineCount} item${lineCount !== 1 ? 's' : ''}` : ''}</span>
            <button onclick="toggleBraindumpVoiceCapture()" class="braindump-voice-btn ${voiceActive ? 'is-recording' : ''}" ${state.braindumpVoiceTranscribing ? 'disabled' : ''}>
              ${voiceActive ? `
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
              ` : `
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-3.08A7 7 0 0 1 5 11a1 1 0 1 1 2 0 5 5 0 0 0 10 0z"/></svg>
              `}
              <span>${voiceLabel}</span>
            </button>
          </div>
          <button id="braindump-process-btn" onclick="processBraindump()" class="braindump-process-btn" ${(!state.braindumpRawText.trim() || voiceActive) ? 'disabled' : ''}>
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
  const isFullPage = state.braindumpFullPage || window.innerWidth < 768;

  return `
    <div class="braindump-overlay" onclick="if(event.target===this)closeBraindump()">
      <div class="braindump-container braindump-review ${isFullPage ? 'braindump-fullpage' : ''}">
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
          <div class="flex items-center gap-2">
            <button onclick="state.braindumpFullPage = !state.braindumpFullPage; render()" class="braindump-expand-btn hide-mobile" aria-label="${isFullPage ? 'Collapse' : 'Expand'}" title="${isFullPage ? 'Collapse' : 'Expand'}">
              ${isFullPage ? `
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              ` : `
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              `}
            </button>
            <button onclick="closeBraindump()" class="braindump-close" aria-label="Close">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>

        ${state.braindumpAIError ? `
          <div class="braindump-ai-error">
            <span class="text-xs font-semibold">AI failed:</span>
            <span class="text-xs">${escapeHtml(state.braindumpAIError)}</span>
          </div>
        ` : ''}

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
  const cat = item.categoryId ? state.taskCategories.find(c => c.id === item.categoryId) : null;

  // Build area select options
  const areaOptions = state.taskCategories.map(c =>
    `<option value="${c.id}" ${item.categoryId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`
  ).join('');

  // Available people (not already assigned)
  const availablePeople = state.taskPeople.filter(p => !item.people.includes(p.id));
  // Available labels (not already assigned)
  const availableLabels = state.taskLabels.filter(l => !item.labels.includes(l.id));

  return `
    <div class="braindump-item ${!item.included ? 'braindump-item-excluded' : ''}">
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

      <div class="braindump-meta-row">
        <div class="braindump-meta-field">
          <span class="braindump-meta-label">Area</span>
          <select class="braindump-meta-select" onchange="setBraindumpItemArea(${index}, this.value || null)">
            <option value="" ${!item.categoryId ? 'selected' : ''}>No Area</option>
            ${areaOptions}
          </select>
        </div>

        <div class="braindump-meta-field">
          <span class="braindump-meta-label">People</span>
          <div class="braindump-pills-row">
            ${item.people.map(pid => {
              const person = state.taskPeople.find(p => p.id === pid);
              return person ? `
                <span class="braindump-pill" style="--pill-color: ${person.color}">
                  ${escapeHtml(person.name)}
                  <button onclick="event.stopPropagation(); removeBraindumpItemPerson(${index}, '${pid}')" class="braindump-pill-remove">&times;</button>
                </span>
              ` : '';
            }).join('')}
            ${availablePeople.length > 0 ? `
              <select class="braindump-add-select" onchange="if(this.value){addBraindumpItemPerson(${index}, this.value); this.value=''}">
                <option value="">+ Add</option>
                ${availablePeople.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}
              </select>
            ` : ''}
          </div>
        </div>

        <div class="braindump-meta-field">
          <span class="braindump-meta-label">Tags</span>
          <div class="braindump-pills-row">
            ${item.labels.map(lid => {
              const label = state.taskLabels.find(l => l.id === lid);
              return label ? `
                <span class="braindump-pill" style="--pill-color: ${label.color}">
                  ${escapeHtml(label.name)}
                  <button onclick="event.stopPropagation(); removeBraindumpItemLabel(${index}, '${lid}')" class="braindump-pill-remove">&times;</button>
                </span>
              ` : '';
            }).join('')}
            ${availableLabels.length > 0 ? `
              <select class="braindump-add-select" onchange="if(this.value){addBraindumpItemLabel(${index}, this.value); this.value=''}">
                <option value="">+ Add</option>
                ${availableLabels.map(l => `<option value="${l.id}">${escapeHtml(l.name)}</option>`).join('')}
              </select>
            ` : ''}
          </div>
        </div>

        ${item.deferDate || item.dueDate ? `
          <div class="braindump-meta-field">
            <span class="braindump-meta-label">Dates</span>
            <div class="braindump-pills-row">
              ${item.deferDate ? `
                <span class="braindump-pill braindump-pill-date">
                  Defer: ${item.deferDate}
                  <button onclick="event.stopPropagation(); clearBraindumpItemDate(${index})" class="braindump-pill-remove">&times;</button>
                </span>
              ` : ''}
              ${item.dueDate ? `
                <span class="braindump-pill braindump-pill-date">
                  Due: ${item.dueDate}
                  <button onclick="event.stopPropagation(); clearBraindumpItemDate(${index})" class="braindump-pill-remove">&times;</button>
                </span>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ---- Processing step (AI thinking) ----
function renderProcessingStep() {
  return `
    <div class="braindump-overlay">
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
              <p class="text-xs text-[var(--text-muted)]">AI is analyzing your text...</p>
            </div>
          </div>
          <button onclick="closeBraindump()" class="braindump-close" aria-label="Close">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div class="braindump-processing-body">
          <div class="braindump-spinner"></div>
          <p class="text-base font-semibold text-[var(--text-primary)] mt-4">Thinking...</p>
          <p class="text-sm text-[var(--text-muted)] mt-1">Splitting, classifying, and extracting metadata</p>
        </div>
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
