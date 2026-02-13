/**
 * Long-press gesture utility using event delegation.
 * Triggers a callback after holding for `delay` ms without moving.
 */

const MOVE_THRESHOLD = 10;

/**
 * Initialize long-press on items within a container.
 * @param {string} containerSelector - Parent container selector
 * @param {string} itemSelector - Child item selector to detect long-press on
 * @param {Function} callback - Called with (element, event) on long-press
 * @param {number} delay - Hold duration in ms (default 500)
 */
export function initLongPress(containerSelector, itemSelector, callback, delay = 500) {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers.length) return;

  containers.forEach(container => {
    // Skip if already initialized
    if (container._longPressInit) return;
    container._longPressInit = true;

    let timer = null;
    let startX = 0;
    let startY = 0;
    let triggered = false;

    function findTarget(el) {
      while (el && el !== container) {
        if (el.matches(itemSelector)) return el;
        el = el.parentElement;
      }
      return null;
    }

    function cancel() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    container.addEventListener('touchstart', (e) => {
      const target = findTarget(e.target);
      if (!target) return;

      triggered = false;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;

      timer = setTimeout(() => {
        triggered = true;
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);
        callback(target, e);
      }, delay);
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!timer) return;
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        cancel();
      }
    }, { passive: true });

    container.addEventListener('touchend', () => {
      cancel();
    }, { passive: true });

    container.addEventListener('touchcancel', () => {
      cancel();
    }, { passive: true });
  });
}
