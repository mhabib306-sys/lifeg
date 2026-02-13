// ============================================================================
// SWIPE ACTIONS MODULE — iOS-style swipe-to-reveal for task items
// ============================================================================
// Uses event delegation on .task-list parent. Reveals action buttons behind
// the task row when swiped horizontally. Only one row can be open at a time.

import { isTouchDevice } from '../utils.js';

let activeRow = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let isDragging = false;
let isScrolling = false;

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

  const containers = document.querySelectorAll('.task-list');
  containers.forEach(container => {
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
  startX = touch.clientX;
  startY = touch.clientY;
  currentX = 0;
  isDragging = false;
  isScrolling = false;

  const content = row.querySelector('.swipe-row-content');
  if (content) {
    content.style.transition = '';
  }
}

function onTouchMove(e) {
  const row = getSwipeRow(e.target);
  if (!row) return;

  const touch = e.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  // Determine gesture direction on first significant move
  if (!isDragging && !isScrolling) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      isScrolling = true;
      return;
    }
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isDragging = true;
      activeRow = row;
    } else {
      return;
    }
  }

  if (isScrolling) return;
  if (!isDragging) return;

  e.preventDefault();

  // Clamp translation with rubber-band effect past max
  let translateX = dx;
  if (Math.abs(translateX) > MAX_TRANSLATE) {
    const overshoot = Math.abs(translateX) - MAX_TRANSLATE;
    translateX = (translateX > 0 ? 1 : -1) * (MAX_TRANSLATE + overshoot * 0.2);
  }

  currentX = translateX;
  const content = row.querySelector('.swipe-row-content');
  if (content) {
    content.style.transform = `translateX(${translateX}px)`;
  }

  // Haptic at threshold
  if (Math.abs(dx) >= THRESHOLD && Math.abs(dx) < THRESHOLD + 5) {
    if (navigator.vibrate) navigator.vibrate(10);
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
  if (!isDragging || !activeRow) {
    isDragging = false;
    return;
  }

  const content = activeRow.querySelector('.swipe-row-content');
  isDragging = false;

  if (Math.abs(currentX) >= THRESHOLD) {
    // Snap to open position
    const snapX = currentX < 0 ? -MAX_TRANSLATE : MAX_TRANSLATE;
    if (content) {
      content.style.transition = 'transform var(--duration-normal) var(--ease-spring)';
      content.style.transform = `translateX(${snapX}px)`;
      setTimeout(() => { content.style.transition = ''; }, 300);
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
