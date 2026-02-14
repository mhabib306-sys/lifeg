// ============================================================================
// UNDO MODULE — Undo toast for task/note deletion
// ============================================================================
// Provides a 5-second countdown toast with undo capability. When a task or
// note is deleted, the caller snapshots the data and passes a restore function.
// The user can click "Undo" to restore, or let the timer expire to confirm.

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';

/**
 * Start an undo countdown. Shows a floating toast with a 5s timer.
 * @param {string} label - Display text (e.g. '"Buy milk" deleted')
 * @param {*} snapshot - Data snapshot to pass to restoreFn on undo
 * @param {Function} restoreFn - Called with snapshot to restore deleted data
 */
export function startUndoCountdown(label, snapshot, restoreFn) {
  // Clear any existing undo timer
  if (state.undoTimerId) {
    clearInterval(state.undoTimerId);
    state.undoTimerId = null;
  }

  state.undoAction = { label, snapshot, restoreFn };
  state.undoTimerRemaining = 5;

  // Update the toast countdown every second
  state.undoTimerId = setInterval(() => {
    state.undoTimerRemaining--;
    // Update just the countdown text and ring without full re-render
    const countdownEl = document.getElementById('undo-countdown');
    const ringEl = document.getElementById('undo-ring-circle');
    if (countdownEl) countdownEl.textContent = state.undoTimerRemaining;
    if (ringEl) {
      const pct = state.undoTimerRemaining / 5;
      ringEl.style.strokeDashoffset = (1 - pct) * 88;
    }

    if (state.undoTimerRemaining <= 0) {
      dismissUndo();
    }
  }, 1000);

  // Re-render to show the toast
  window.render();
}

/**
 * Execute undo — restore the snapshot and dismiss the toast
 */
export function executeUndo() {
  if (!state.undoAction) return;

  const { snapshot, restoreFn } = state.undoAction;
  restoreFn(snapshot);

  // Clear timer and state
  if (state.undoTimerId) {
    clearInterval(state.undoTimerId);
  }
  state.undoAction = null;
  state.undoTimerRemaining = 0;
  state.undoTimerId = null;

  window.render();
}

/**
 * Dismiss undo toast without restoring (timer expired or user dismissed)
 */
export function dismissUndo() {
  if (state.undoTimerId) {
    clearInterval(state.undoTimerId);
  }
  state.undoAction = null;
  state.undoTimerRemaining = 0;
  state.undoTimerId = null;

  // Remove toast from DOM without full re-render
  const toast = document.getElementById('undo-toast');
  if (toast) {
    toast.classList.add('undo-fade-out');
    setTimeout(() => toast.remove(), 300);
  }
}

/**
 * Render the floating undo toast HTML
 * @returns {string} HTML string (empty if no active undo)
 */
export function renderUndoToastHtml() {
  if (!state.undoAction) return '';

  const { label } = state.undoAction;
  const remaining = state.undoTimerRemaining;
  const pct = remaining / 5;
  const dashoffset = (1 - pct) * 88;

  return `
    <div id="undo-toast" class="undo-toast" role="alert" aria-live="polite" aria-atomic="true">
      <div class="undo-toast-inner">
        <div class="undo-countdown-ring">
          <svg viewBox="0 0 32 32" class="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
            <circle id="undo-ring-circle" cx="16" cy="16" r="14" fill="none" stroke="white" stroke-width="2"
              stroke-dasharray="88" stroke-dashoffset="${dashoffset}"
              stroke-linecap="round" transform="rotate(-90 16 16)"
              style="transition: stroke-dashoffset 1s linear;"/>
          </svg>
          <span id="undo-countdown" class="undo-countdown-num">${remaining}</span>
        </div>
        <span class="undo-toast-label">${escapeHtml(label)}</span>
        <button onclick="executeUndo()" class="undo-toast-btn">Undo</button>
        <button onclick="dismissUndo()" class="undo-toast-dismiss" aria-label="Dismiss">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </div>
  `;
}
