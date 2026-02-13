// ============================================================================
// TOUCH DRAG MODULE — Two-phase press-and-hold drag-and-drop for mobile
// ============================================================================
// Phase 1 — Hold (500ms): Item "lifts" with shadow/scale. No clone yet.
// Phase 2 — Move after hold: Clone follows finger, auto-scroll, insertion indicator.
// If finger lifts during Phase 1 without moving → show action sheet.
// Cleans up on tab switch, context menu, and window blur.

import { isTouchDevice } from '../utils.js';

const HOLD_DELAY = 500;
const MOVE_THRESHOLD = 8;   // px to distinguish tap jitter from intentional move
const SCROLL_ZONE = 60;
const SCROLL_SPEED = 8;

let holdTimer = null;
let dragState = null;        // Full drag (Phase 2) — clone follows finger
let dragReady = null;        // Phase 1 — item lifted, waiting for move
let scrollFrame = null;
let globalListenersAttached = false;
let suppressNextClick = false;

// ---- Public API ----

export function initTouchDrag() {
  if (!isTouchDevice()) return;

  // Clean up any orphaned drag clones from previous renders
  document.querySelectorAll('.touch-drag-clone, .touch-drag-indicator').forEach(el => el.remove());

  const containers = document.querySelectorAll('.task-list');
  containers.forEach(container => {
    if (container._touchDragInit) return;
    container._touchDragInit = true;

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });
  });

  // Global listeners — attach once
  if (!globalListenersAttached) {
    globalListenersAttached = true;
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', cancelTouchDrag);
    document.addEventListener('contextmenu', cancelTouchDrag);

    // Capture-phase click suppression — prevents onclick handlers from
    // firing after a long-press gesture (action sheet or drag)
    document.addEventListener('click', onCaptureClick, true);
  }
}

/** Cancel any in-progress drag or drag-ready state. Safe to call anytime. */
export function cancelTouchDrag() {
  clearTimeout(holdTimer);
  holdTimer = null;

  // Reset drag-ready (Phase 1)
  if (dragReady) {
    resetDragReadyVisual(dragReady.item);
    dragReady = null;
  }

  if (!dragState) return;

  // Reset full drag (Phase 2)
  cancelAnimationFrame(scrollFrame);
  scrollFrame = null;

  if (dragState.clone?.parentNode) {
    dragState.clone.remove();
  }
  if (dragState.item) {
    dragState.item.style.opacity = '';
    dragState.item.style.transition = '';
  }

  removeInsertionIndicator();
  dragState = null;
}

/** Returns true if a touch-drag is currently active (Phase 1 or 2). */
export function isTouchDragging() {
  return dragState !== null || dragReady !== null;
}

/** Cancel the hold timer (used by swipe-actions to prevent drag during swipe). */
export function cancelHoldTimer() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
}

// ---- Event handlers ----

function onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    cancelTouchDrag();
  }
}

/** Suppress the click event that fires after touchend following a long-press. */
function onCaptureClick(e) {
  if (suppressNextClick) {
    suppressNextClick = false;
    e.stopPropagation();
    e.preventDefault();
  }
}

function getTaskItem(target) {
  return target.closest('.task-item');
}

function onTouchStart(e) {
  if (dragState || dragReady) return;

  const item = getTaskItem(e.target);
  if (!item) return;

  // Don't initiate from interactive elements
  if (e.target.closest('button, input, textarea, a, .swipe-action-btn')) return;

  const touch = e.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;

  item._touchStartX = startX;
  item._touchStartY = startY;

  holdTimer = setTimeout(() => {
    holdTimer = null;
    activateDragReady(item, startX, startY);
  }, HOLD_DELAY);
}

function onTouchMove(e) {
  const touch = e.touches[0];

  // Cancel hold timer if finger moved before threshold elapsed
  if (holdTimer) {
    const item = getTaskItem(e.target);
    if (item && item._touchStartX !== undefined) {
      const dx = Math.abs(touch.clientX - item._touchStartX);
      const dy = Math.abs(touch.clientY - item._touchStartY);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
    }
  }

  // Phase 1 → Phase 2 transition: user held long enough and is now moving
  if (dragReady && !dragState) {
    const dx = Math.abs(touch.clientX - dragReady.startX);
    const dy = Math.abs(touch.clientY - dragReady.startY);
    if (dx > 5 || dy > 5) {
      promoteToFullDrag(touch.clientX, touch.clientY);
    } else {
      return; // Still within jitter zone
    }
  }

  if (!dragState) return;
  e.preventDefault();

  const y = touch.clientY;
  const x = touch.clientX;

  // Move the clone
  dragState.clone.style.top = `${y - dragState.offsetY}px`;
  dragState.clone.style.left = `${x - dragState.offsetX}px`;

  dragState.lastY = y;

  autoScroll(y);
  updateInsertionIndicator(y);
}

function onTouchEnd() {
  clearTimeout(holdTimer);
  holdTimer = null;

  // Phase 1 release (held but didn't move) → show action sheet
  if (dragReady && !dragState) {
    const item = dragReady.item;
    resetDragReadyVisual(item);
    dragReady = null;

    // Suppress the click that follows touchend
    suppressNextClick = true;
    setTimeout(() => { suppressNextClick = false; }, 400);

    // Show action sheet for this task
    if (item) {
      const taskId = getTaskId(item);
      if (taskId) {
        showTaskActionSheet(taskId);
      }
    }
    return;
  }

  if (!dragState) return;

  // Phase 2 release → complete drag
  cancelAnimationFrame(scrollFrame);
  scrollFrame = null;

  const lastY = dragState.lastY;

  const targetItem = getInsertionTarget(lastY);
  let dropPosition = 'bottom';
  if (targetItem) {
    const rect = targetItem.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    dropPosition = lastY < midY ? 'top' : 'bottom';
  }

  const draggedId = getTaskId(dragState.item);
  const targetId = targetItem ? getTaskId(targetItem) : null;

  // Clean up visual state
  if (dragState.clone?.parentNode) {
    dragState.clone.remove();
  }
  dragState.item.style.opacity = '';
  removeInsertionIndicator();

  // Suppress click after drag
  suppressNextClick = true;
  setTimeout(() => { suppressNextClick = false; }, 400);

  if (targetItem && targetItem !== dragState.item && draggedId && targetId) {
    if (typeof window.reorderTasks === 'function') {
      window.reorderTasks(draggedId, targetId, dropPosition);
    }
  }

  dragState = null;
}

// ---- Phase 1: Drag Ready ----

function activateDragReady(item, startX, startY) {
  if (navigator.vibrate) navigator.vibrate(10);

  dragReady = { item, startX, startY };

  // Visual "lift" — scale up + shadow on the original item
  item.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
  item.style.transform = 'scale(1.02)';
  item.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
  item.style.zIndex = '10';
  item.style.position = 'relative';
}

function resetDragReadyVisual(item) {
  if (!item) return;
  item.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
  item.style.transform = '';
  item.style.boxShadow = '';
  item.style.zIndex = '';
  // Clean up position + transition after animation
  setTimeout(() => {
    item.style.position = '';
    item.style.transition = '';
  }, 150);
}

// ---- Phase 2: Full Drag ----

function promoteToFullDrag(currentX, currentY) {
  if (!dragReady) return;

  const item = dragReady.item;
  const startX = dragReady.startX;
  const startY = dragReady.startY;

  // Reset the Phase 1 visual lift immediately
  item.style.transition = '';
  item.style.transform = '';
  item.style.boxShadow = '';
  item.style.zIndex = '';
  item.style.position = '';

  dragReady = null;

  // Create floating clone (Phase 2 visual)
  const rect = item.getBoundingClientRect();
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
    scrollable: item.closest('.main-content') || document.documentElement,
    lastY: currentY,
  };
}

// ---- Action sheet integration ----

function showTaskActionSheet(taskId) {
  const task = (window.state?.tasksData || []).find(t => t.id === taskId);
  if (!task || typeof window.showActionSheet !== 'function') return;

  window.showActionSheet({
    title: task.title || 'Task',
    items: [
      { label: 'Edit', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', handler: () => { window.editingTaskId = taskId; window.showTaskModal = true; window.render(); } },
      { label: task.completed ? 'Uncomplete' : 'Complete', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>', handler: () => { window.toggleTaskComplete(taskId); } },
      { label: task.flagged ? 'Unflag' : 'Flag', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>', handler: () => { window.updateTask(taskId, { flagged: !task.flagged }); } },
      { label: 'Move to Today', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', handler: () => { window.moveTaskTo(taskId, 'today'); } },
      { label: 'Delete', icon: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>', destructive: true, handler: () => { window.confirmDeleteTask(taskId); } }
    ]
  });
}

// ---- Shared helpers ----

function getTaskId(el) {
  return el?.closest('[data-task-id]')?.dataset.taskId ||
         el?.querySelector('[onclick*="editingTaskId"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
}

function autoScroll(y) {
  if (!dragState || !dragState.container) return;

  const scrollable = dragState.scrollable;
  cancelAnimationFrame(scrollFrame);

  const doScroll = () => {
    if (!dragState) return;
    const containerRect = dragState.container.getBoundingClientRect();
    if (y < containerRect.top + SCROLL_ZONE) {
      scrollable.scrollTop -= SCROLL_SPEED;
      scrollFrame = requestAnimationFrame(doScroll);
    } else if (y > containerRect.bottom - SCROLL_ZONE) {
      scrollable.scrollTop += SCROLL_SPEED;
      scrollFrame = requestAnimationFrame(doScroll);
    }
  };

  doScroll();
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
