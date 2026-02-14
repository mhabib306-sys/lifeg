// Task animation engine — clone-to-overlay pattern with spring physics
// Uses dynamic import('motion/mini') for tree-shaking on web.

import { platformFeatures } from '../platform.js';

/** Remove animation clones older than 3 seconds */
export function sweepStaleClones() {
  const overlay = document.getElementById('animation-overlay');
  if (!overlay) return;
  const now = Date.now();
  overlay.querySelectorAll('[data-clone-ts]').forEach(clone => {
    if (now - parseInt(clone.dataset.cloneTs, 10) > 3000) clone.remove();
  });
}

/**
 * Clone a task element to #animation-overlay and animate it.
 * The clone lives outside #app so it persists across render() DOM replacement.
 */
function cloneToOverlay(taskId) {
  const overlay = document.getElementById('animation-overlay');
  if (!overlay) return null;

  // Find the task element by data-task-id
  const el = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!el) return null;

  sweepStaleClones();

  const rect = el.getBoundingClientRect();
  const clone = el.cloneNode(true);
  clone.setAttribute('data-clone-ts', String(Date.now()));
  clone.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    margin: 0;
    pointer-events: none;
    transform-origin: center center;
    will-change: transform, opacity;
  `;
  overlay.appendChild(clone);
  return clone;
}

/**
 * Animate task completion — spring shrink + fade.
 * @param {string} taskId
 * @param {boolean} completing - true if marking complete, false if uncompleting
 */
export async function animateTaskCompletion(taskId, completing) {
  if (!platformFeatures.motionPreference) return;

  // Haptic at animation start
  if (typeof window.hapticSync === 'function') {
    window.hapticSync(completing ? 'success' : 'light');
  }

  const clone = cloneToOverlay(taskId);
  if (!clone) return;

  try {
    const { animate } = await import('motion/mini');
    await animate(clone, {
      opacity: [1, 0],
      transform: completing
        ? ['scale(1)', 'scale(0.85)']
        : ['scale(0.95)', 'scale(1)'],
    }, {
      duration: completing ? 0.3 : 0.25,
      easing: [0.22, 1.0, 0.36, 1.0], // spring-snappy approximation
    }).finished;
  } catch {
    // CSS fallback
    clone.style.transition = 'transform 250ms cubic-bezier(0.22,1,0.36,1), opacity 250ms ease-out';
    clone.style.opacity = '0';
    clone.style.transform = completing ? 'scale(0.85)' : 'scale(1)';
    await new Promise(r => setTimeout(r, 300));
  }

  clone.remove();
}

/**
 * Animate task deletion — scale down + fade.
 * @param {string} taskId
 */
export async function animateTaskDeletion(taskId) {
  if (!platformFeatures.motionPreference) return;

  if (typeof window.hapticSync === 'function') {
    window.hapticSync('error');
  }

  const clone = cloneToOverlay(taskId);
  if (!clone) return;

  try {
    const { animate } = await import('motion/mini');
    await animate(clone, {
      opacity: [1, 0],
      transform: ['scale(1) translateX(0)', 'scale(0.8) translateX(-20px)'],
    }, {
      duration: 0.25,
      easing: [0.25, 0.8, 0.25, 1.0], // spring-smooth approximation
    }).finished;
  } catch {
    clone.style.transition = 'transform 250ms ease-out, opacity 200ms ease-out';
    clone.style.opacity = '0';
    clone.style.transform = 'scale(0.8) translateX(-20px)';
    await new Promise(r => setTimeout(r, 300));
  }

  clone.remove();
}
