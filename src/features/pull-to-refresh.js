/**
 * Pull-to-refresh interaction for mobile Home tab.
 * Triggers cloud sync when user pulls down at scroll top.
 */

const PTR_THRESHOLD = 60;
const PTR_MAX = 100;

let ptrActive = false;
let ptrStartY = 0;
let ptrDelta = 0;
let ptrIndicator = null;
let ptrInitialized = false;

function createIndicator() {
  if (ptrIndicator) return ptrIndicator;
  ptrIndicator = document.createElement('div');
  ptrIndicator.className = 'ptr-indicator';
  ptrIndicator.innerHTML = `
    <svg class="ptr-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
  `;
  return ptrIndicator;
}

function getScrollContainer() {
  return document.querySelector('.main-content') || document.querySelector('#app');
}

export function initPullToRefresh() {
  const container = getScrollContainer();
  if (!container || ptrInitialized) return;

  // Only on touch devices
  if (!window.isTouchDevice || !window.isTouchDevice()) return;

  ptrInitialized = true;
  container.style.overscrollBehaviorY = 'contain';

  container.addEventListener('touchstart', (e) => {
    // Only active on Home tab
    if (window.state?.activeTab !== 'home') return;
    // Only when scrolled to top
    if (container.scrollTop > 5) return;

    ptrActive = true;
    ptrStartY = e.touches[0].clientY;
    ptrDelta = 0;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!ptrActive) return;

    const currentY = e.touches[0].clientY;
    ptrDelta = Math.max(0, currentY - ptrStartY);

    if (ptrDelta <= 0) return;

    // Apply rubber-band effect past threshold
    const displayDelta = ptrDelta > PTR_THRESHOLD
      ? PTR_THRESHOLD + (ptrDelta - PTR_THRESHOLD) * 0.3
      : ptrDelta;

    const indicator = createIndicator();
    if (!indicator.parentNode) {
      const target = container.querySelector('.home-large-title')?.parentElement || container.firstElementChild;
      if (target) target.parentNode.insertBefore(indicator, target);
    }

    const progress = Math.min(ptrDelta / PTR_THRESHOLD, 1);
    indicator.style.transform = `translateX(-50%) translateY(${displayDelta - 40}px)`;
    indicator.style.opacity = progress;

    // Rotate spinner based on progress
    const spinner = indicator.querySelector('.ptr-spinner');
    if (spinner) {
      spinner.style.transform = `rotate(${progress * 360}deg)`;
    }

    // Haptic at threshold
    if (ptrDelta >= PTR_THRESHOLD && ptrDelta - (currentY - ptrStartY - ptrDelta) < PTR_THRESHOLD + 5) {
      if (typeof window.hapticSync === 'function') window.hapticSync('medium');
      else if (navigator.vibrate) navigator.vibrate(20);
    }
  }, { passive: true });

  container.addEventListener('touchend', async () => {
    if (!ptrActive) return;
    ptrActive = false;

    if (ptrDelta >= PTR_THRESHOLD) {
      // Trigger refresh
      const indicator = ptrIndicator;
      if (indicator) {
        indicator.classList.add('ptr-refreshing');

        try {
          if (typeof window.loadCloudData === 'function') {
            await window.loadCloudData();
          }
          // Brief success state
          if (typeof window.hapticSync === 'function') window.hapticSync('success');
          else if (navigator.vibrate) navigator.vibrate([10, 30]);
        } catch (err) {
          console.error('PTR sync failed:', err);
          if (typeof window.hapticSync === 'function') window.hapticSync('error');
          else if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
        }

        // Animate out
        if (indicator) {
          indicator.style.transition = 'transform 0.3s var(--ease-default), opacity 0.3s var(--ease-default)';
          indicator.style.transform = 'translateX(-50%) translateY(-40px)';
          indicator.style.opacity = '0';
          setTimeout(() => {
            indicator.remove();
            indicator.classList.remove('ptr-refreshing');
            indicator.style.transition = '';
          }, 300);
        }
      }
    } else {
      // Snap back
      if (ptrIndicator) {
        ptrIndicator.style.transition = 'transform 0.2s var(--ease-default), opacity 0.2s var(--ease-default)';
        ptrIndicator.style.transform = 'translateX(-50%) translateY(-40px)';
        ptrIndicator.style.opacity = '0';
        setTimeout(() => {
          if (ptrIndicator) {
            ptrIndicator.remove();
            ptrIndicator.style.transition = '';
          }
        }, 200);
      }
    }

    ptrDelta = 0;
  }, { passive: true });
}

export function destroyPullToRefresh() {
  ptrInitialized = false;
  if (ptrIndicator && ptrIndicator.parentNode) {
    ptrIndicator.remove();
  }
}
