// ============================================================================
// TOUCH DRAG MODULE — Press-and-hold drag-and-drop for mobile
// ============================================================================
// Long-press (300ms) initiates drag. Floating clone follows finger.
// Auto-scrolls near edges. Shows insertion indicator.

import { isTouchDevice } from '../utils.js';

const HOLD_DELAY = 300;
const SCROLL_ZONE = 60;
const SCROLL_SPEED = 8;

let holdTimer = null;
let dragState = null;
let scrollFrame = null;

export function initTouchDrag() {
  if (!isTouchDevice()) return;

  const containers = document.querySelectorAll('.task-list');
  containers.forEach(container => {
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });
  });
}

function getTaskItem(target) {
  return target.closest('.task-item');
}

function onTouchStart(e) {
  const item = getTaskItem(e.target);
  if (!item) return;

  // Don't initiate drag from buttons or inputs
  if (e.target.closest('button, input, textarea, a, .swipe-action-btn')) return;

  const touch = e.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;

  holdTimer = setTimeout(() => {
    startDrag(item, startX, startY, e);
  }, HOLD_DELAY);

  // Store start position to detect movement
  item._touchStartX = startX;
  item._touchStartY = startY;
}

function onTouchMove(e) {
  const touch = e.touches[0];

  // Cancel hold if moved before drag started
  if (holdTimer) {
    const item = getTaskItem(e.target);
    if (item && item._touchStartX !== undefined) {
      const dx = Math.abs(touch.clientX - item._touchStartX);
      const dy = Math.abs(touch.clientY - item._touchStartY);
      if (dx > 10 || dy > 10) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    }
  }

  if (!dragState) return;
  e.preventDefault();

  const y = touch.clientY;
  const x = touch.clientX;

  // Move the clone
  dragState.clone.style.top = `${y - dragState.offsetY}px`;
  dragState.clone.style.left = `${x - dragState.offsetX}px`;

  // Auto-scroll
  autoScroll(y);

  // Update insertion indicator
  updateInsertionIndicator(y);
}

function onTouchEnd() {
  clearTimeout(holdTimer);
  holdTimer = null;

  if (!dragState) return;

  cancelAnimationFrame(scrollFrame);
  scrollFrame = null;

  // Find drop target
  const targetItem = getInsertionTarget(dragState.lastY);

  // Clean up
  dragState.clone.remove();
  dragState.item.style.opacity = '';
  removeInsertionIndicator();

  if (targetItem && targetItem !== dragState.item) {
    // Get task IDs and reorder
    const draggedId = dragState.item.closest('[data-task-id]')?.dataset.taskId ||
                      dragState.item.querySelector('[onclick*="editingTaskId"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    const targetId = targetItem.closest('[data-task-id]')?.dataset.taskId ||
                     targetItem.querySelector('[onclick*="editingTaskId"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];

    if (draggedId && targetId && typeof window.reorderTasks === 'function') {
      window.reorderTasks(draggedId, targetId);
    }
  } else {
    // Spring back animation
    dragState.item.style.transition = 'opacity var(--duration-normal) var(--ease-spring)';
    setTimeout(() => { dragState.item.style.transition = ''; }, 300);
  }

  dragState = null;
}

function startDrag(item, startX, startY, e) {
  // Haptic feedback
  if (navigator.vibrate) navigator.vibrate(10);

  const rect = item.getBoundingClientRect();

  // Create floating clone
  const clone = item.cloneNode(true);
  clone.className = 'touch-drag-clone';
  clone.style.cssText = `
    position: fixed; z-index: 1000;
    width: ${rect.width}px;
    top: ${rect.top}px; left: ${rect.left}px;
    background: var(--bg-card);
    border-radius: var(--border-radius);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    transform: scale(1.03);
    opacity: 0.95;
    pointer-events: none;
    transition: transform var(--duration-fast) var(--ease-spring);
  `;
  document.body.appendChild(clone);

  // Dim original
  item.style.opacity = '0.3';

  dragState = {
    item,
    clone,
    offsetX: startX - rect.left,
    offsetY: startY - rect.top,
    container: item.closest('.task-list'),
    lastY: startY,
  };
}

function autoScroll(y) {
  if (!dragState || !dragState.container) return;

  const containerRect = dragState.container.getBoundingClientRect();
  const scrollable = dragState.container.closest('.main-content') || document.documentElement;

  cancelAnimationFrame(scrollFrame);

  const doScroll = () => {
    if (!dragState) return;
    if (y < containerRect.top + SCROLL_ZONE) {
      scrollable.scrollTop -= SCROLL_SPEED;
      scrollFrame = requestAnimationFrame(doScroll);
    } else if (y > containerRect.bottom - SCROLL_ZONE) {
      scrollable.scrollTop += SCROLL_SPEED;
      scrollFrame = requestAnimationFrame(doScroll);
    }
  };

  doScroll();
  dragState.lastY = y;
}

function getInsertionTarget(y) {
  if (!dragState || !dragState.container) return null;
  const items = [...dragState.container.querySelectorAll('.task-item')];
  for (const item of items) {
    if (item === dragState.item) continue;
    const rect = item.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) return item;
  }
  return null;
}

function updateInsertionIndicator(y) {
  removeInsertionIndicator();
  const target = getInsertionTarget(y);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const indicator = document.createElement('div');
  indicator.className = 'touch-drag-indicator';
  indicator.style.cssText = `
    position: fixed; left: ${rect.left + 16}px; right: ${window.innerWidth - rect.right + 16}px;
    height: 2px; background: var(--accent); border-radius: 1px;
    z-index: 999; pointer-events: none;
    top: ${y < midY ? rect.top : rect.bottom}px;
  `;
  document.body.appendChild(indicator);
}

function removeInsertionIndicator() {
  document.querySelectorAll('.touch-drag-indicator').forEach(el => el.remove());
}
