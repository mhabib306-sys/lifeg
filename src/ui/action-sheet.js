// ============================================================================
// ACTION SHEET — iOS-style bottom action sheet component
// ============================================================================
// Renders a bottom-rising sheet with full-width tappable items.
// Usage: showActionSheet({ title, items, cancelLabel })

import { state } from '../state.js';

let activeSheet = null;

/**
 * Show an action sheet.
 * @param {Object} opts
 * @param {string} [opts.title] - Optional section title
 * @param {Array} opts.items - [{ label, icon?, handler, destructive?, disabled? }]
 * @param {string} [opts.cancelLabel='Cancel'] - Cancel button label
 */
export function showActionSheet({ title, items, cancelLabel = 'Cancel' }) {
  hideActionSheet(); // Close any existing sheet

  const overlay = document.createElement('div');
  overlay.className = 'action-sheet-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) hideActionSheet(); };

  const itemsHtml = items.map((item, i) => `
    <button class="action-sheet-item ${item.destructive ? 'action-sheet-destructive' : ''} ${item.disabled ? 'action-sheet-disabled' : ''}"
      data-index="${i}" ${item.disabled ? 'disabled' : ''}>
      ${item.icon ? `<span class="action-sheet-icon">${item.icon}</span>` : ''}
      <span>${item.label}</span>
    </button>
  `).join('');

  overlay.innerHTML = `
    <div class="action-sheet">
      <div class="action-sheet-group">
        ${title ? `<div class="action-sheet-title">${title}</div>` : ''}
        ${itemsHtml}
      </div>
      <div class="action-sheet-cancel">
        <button class="action-sheet-item action-sheet-cancel-btn">${cancelLabel}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  activeSheet = overlay;

  // Wire up item handlers
  overlay.querySelectorAll('.action-sheet-item[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const item = items[idx];
      if (item && !item.disabled && item.handler) {
        if (navigator.vibrate) navigator.vibrate(5);
        hideActionSheet();
        item.handler();
      }
    });
  });

  // Wire up cancel
  overlay.querySelector('.action-sheet-cancel-btn')?.addEventListener('click', hideActionSheet);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('action-sheet-visible');
  });
}

export function hideActionSheet() {
  if (!activeSheet) return;
  const sheet = activeSheet;
  sheet.classList.remove('action-sheet-visible');
  sheet.classList.add('action-sheet-dismissing');
  setTimeout(() => {
    sheet.remove();
    if (activeSheet === sheet) activeSheet = null;
  }, 350);
}
