// ============================================================================
// SWIPE ACTIONS MODULE — iOS-style swipe-to-reveal for task items
// ============================================================================
// Uses event delegation on .task-list parent. Reveals action buttons behind
// the task row when swiped horizontally. Only one row can be open at a time.

import { isTouchDevice } from '../utils.js';
import { isTouchDragging, cancelHoldTimer } from './touch-drag.js';

let activeRow = null;
// H4 fix: gesture session objects replace module-level booleans
let gestureSession = null;
function createSession(sx, sy) {
  return { id: Date.now() + Math.random(), type: null, startX: sx, startY: sy, currentX: 0 };
}

const THRESHOLD = 72;
const MAX_TRANSLATE = 152;

function resetRow(rowContent, animate = true) {
  if (!rowContent) return;
  if (animate) {
    rowContent.style.transition = 'transform var(--duration-normal) var(--ease-spring)';
  }
  rowContent.style.transform = 'translateX(0)';
  if (animate) {
    setTimeout(() => { rowContent.style.transition = ''; }, 300);
  }
  const row = rowContent.closest('.swipe-row');
  if (row) row.classList.remove('swipe-open-left', 'swipe-open-right');
}

function closeActiveRow() {
  if (activeRow) {
    const content = activeRow.querySelector('.swipe-row-content');
    resetRow(content);
    activeRow = null;
  }
}

export function initSwipeActions() {
  if (!isTouchDevice()) return;

  const containers = document.querySelectorAll('.task-list, .notes-list');
  containers.forEach(container => {
    // Prevent duplicate listeners on persistent containers
    if (container._swipeInit) return;
    container._swipeInit = true;

    // H2 fix: allow vertical scroll without gesture capture
    container.style.touchAction = 'pan-y';

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
  });
}

function getSwipeRow(target) {
  return target.closest('.swipe-row');
}

function onTouchStart(e) {
  const row = getSwipeRow(e.target);
  if (!row) return;

  // Close any other open row
  if (activeRow && activeRow !== row) {
    closeActiveRow();
  }

  const touch = e.touches[0];
  gestureSession = createSession(touch.clientX, touch.clientY);

  const content = row.querySelector('.swipe-row-content');
  if (content) {
    content.style.transition = '';
  }
}

function onTouchMove(e) {
  if (!gestureSession) return;
  const row = getSwipeRow(e.target);
  if (!row) return;

  const touch = e.touches[0];
  const dx = touch.clientX - gestureSession.startX;
  const dy = touch.clientY - gestureSession.startY;

  // Don't swipe if a touch-drag is active
  if (isTouchDragging()) return;

  // Determine gesture direction on first significant move
  if (!gestureSession.type) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      gestureSession.type = 'scroll';
      return;
    }
    // H2 fix: increase angle threshold to ~38° (0.8 ratio)
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 0.8) {
      gestureSession.type = 'swipe';
      activeRow = row;
      cancelHoldTimer();
    } else {
      return;
    }
  }

  if (gestureSession.type !== 'swipe') return;

  e.preventDefault();

  // Clamp translation with rubber-band effect past max
  let translateX = dx;
  if (Math.abs(translateX) > MAX_TRANSLATE) {
    const overshoot = Math.abs(translateX) - MAX_TRANSLATE;
    translateX = (translateX > 0 ? 1 : -1) * (MAX_TRANSLATE + overshoot * 0.2);
  }

  gestureSession.currentX = translateX;
  const content = row.querySelector('.swipe-row-content');
  if (content) {
    content.style.transform = `translateX(${translateX}px)`;
  }

  // Haptic at threshold
  if (Math.abs(dx) >= THRESHOLD && Math.abs(dx) < THRESHOLD + 5) {
    if (typeof window.hapticSync === 'function') window.hapticSync('medium');
    else if (navigator.vibrate) navigator.vibrate(10);
  }

  // Show open state classes
  if (dx < -THRESHOLD) {
    row.classList.add('swipe-open-right');
    row.classList.remove('swipe-open-left');
  } else if (dx > THRESHOLD) {
    row.classList.add('swipe-open-left');
    row.classList.remove('swipe-open-right');
  } else {
    row.classList.remove('swipe-open-left', 'swipe-open-right');
  }
}

function onTouchEnd(e) {
  if (!gestureSession || gestureSession.type !== 'swipe' || !activeRow) {
    gestureSession = null;
    return;
  }

  const content = activeRow.querySelector('.swipe-row-content');
  const currentX = gestureSession.currentX;
  gestureSession = null;

  if (Math.abs(currentX) >= THRESHOLD) {
    // Snap to open position with spring animation
    const snapX = currentX < 0 ? -MAX_TRANSLATE : MAX_TRANSLATE;
    if (content) {
      // Try motion/mini for spring snap, fall back to CSS
      import('motion/mini').then(({ animate }) => {
        animate(content, { transform: `translateX(${snapX}px)` }, {
          duration: 0.3,
          easing: [0.22, 1.0, 0.36, 1.0], // spring-snappy
        });
      }).catch(() => {
        content.style.transition = 'transform var(--duration-normal) var(--spring-snappy)';
        content.style.transform = `translateX(${snapX}px)`;
        setTimeout(() => { content.style.transition = ''; }, 300);
      });
    }
  } else {
    // Spring back
    resetRow(content);
    activeRow = null;
  }
}

// Close swipe row when tapping elsewhere
document.addEventListener('touchstart', (e) => {
  if (activeRow && !activeRow.contains(e.target)) {
    closeActiveRow();
  }
}, { passive: true });

export { closeActiveRow };
