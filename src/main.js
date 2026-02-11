// ============================================================================
// MAIN ENTRY POINT — Homebase App
// ============================================================================
// This file is the Vite entry point. It:
// 1. Imports styles (triggers Tailwind/PostCSS processing)
// 2. Imports the bridge (wires all modules to window.*)
// 3. Applies stored theme (so login screen is themed)
// 4. Calls initAuth — on auth ready, initializes the full app
// 5. Sets up keyboard shortcuts and online/offline listeners

// -- Styles (processed by Vite + PostCSS + Tailwind) --
import './styles/main.css';

// -- Bridge (imports all modules, assigns to window.*) --
import './bridge.js';

// -- Direct imports for init-only functions --
import { state } from './state.js';
import { initializeTaskOrders } from './features/task-filter.js';
import { initializeNoteOrders, ensureNoteSafetyMetadata, runNoteIntegrityChecks } from './features/notes.js';
import { initWeather } from './features/weather.js';
import { initWhoopSync } from './data/whoop-sync.js';
import { initLibreSync } from './data/libre-sync.js';
import { initGCalSync } from './data/google-calendar-sync.js';
import { initGoogleContactsSync } from './data/google-contacts-sync.js';
import { initGSheetSync } from './data/google-sheets-sync.js';
import { applyStoredTheme, loadCloudData, debouncedSaveToGithub } from './data/github-sync.js';
import { initAuth } from './data/firebase.js';
import { render } from './ui/render.js';
import { migrateTodayFlag } from './features/tasks.js';
import { ensureHomeWidgets } from './features/home-widgets.js';
import { rebuildGamification, processGamification } from './features/scoring.js';
import { APP_VERSION, APP_VERSION_SEEN_KEY } from './constants.js';
import twemoji from 'twemoji';

// ============================================================================
// App Initialization (called only after auth confirms a signed-in user)
// ============================================================================

let appInitialized = false;
let twemojiObserver = null;
let twemojiObserverStarted = false;
let twemojiObserverBusy = false;

function applyTwemoji(root = document.body) {
  if (!root) return;
  twemoji.parse(root, {
    folder: 'svg',
    ext: '.svg',
    className: 'twemoji',
    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
  });
}

function setupTwemojiObserver() {
  if (twemojiObserverStarted || typeof MutationObserver === 'undefined') return;
  twemojiObserverStarted = true;
  twemojiObserver = new MutationObserver((mutations) => {
    if (twemojiObserverBusy) return;
    const roots = new Set();
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            roots.add(node);
          } else if (node.parentElement) {
            roots.add(node.parentElement);
          }
        });
      } else if (mutation.type === 'characterData' && mutation.target?.parentElement) {
        roots.add(mutation.target.parentElement);
      }
    }
    if (roots.size === 0) return;
    twemojiObserverBusy = true;
    twemojiObserver.disconnect();
    try {
      roots.forEach((root) => applyTwemoji(root));
    } finally {
      twemojiObserverBusy = false;
      if (document.body) {
        twemojiObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    }
  });
  if (document.body) {
    twemojiObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
}

function initApp() {
  if (appInitialized) return;
  appInitialized = true;

  // Initialize task ordering
  migrateTodayFlag();
  initializeTaskOrders();
  initializeNoteOrders();
  ensureNoteSafetyMetadata();

  // Ensure home widgets are complete
  ensureHomeWidgets();

  // Initialize gamification: if XP history is empty but we have data, rebuild from scratch
  if ((!state.xp?.history?.length) && Object.keys(state.allData).length > 0) {
    rebuildGamification();
  } else {
    // Process today to keep streak and XP current
    processGamification(state.currentDate);
  }

  // Initial render
  render();

  // Load cloud data, then initialize WHOOP sync
  // WHOOP sync must wait for cloud data to avoid race condition:
  // without this, WHOOP sync bumps lastUpdated before cloud loads,
  // causing shouldUseCloud() to skip cloud data from other devices.
  loadCloudData()
    .then(() => {
      ensureHomeWidgets();
      render();
      initWhoopSync();
      initLibreSync();
      initGCalSync();
      initGoogleContactsSync();
      initGSheetSync();
    })
    .catch(err => {
      console.warn('Cloud data load failed (will use local):', err.message);
      initWhoopSync();
      initLibreSync();
      initGCalSync();
      initGoogleContactsSync();
      initGSheetSync();
    });

  // Initialize weather
  initWeather();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K = global search (toggle)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (state.showGlobalSearch) {
        window.closeGlobalSearch();
        render();
      } else {
        window.openGlobalSearch();
      }
      return; // [Bug 9/10/11 fix] Don't process further shortcuts
    }
    // [Bug 9/10/11 fix] Block all other keyboard shortcuts while search is open
    if (state.showGlobalSearch) return;
    // Cmd/Ctrl + N = new task
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      window.openNewTaskModal();
    }
    // Cmd/Ctrl + Shift + D = open Braindump
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      window.openBraindump();
    }
    // Escape = close overlays
    if (e.key === 'Escape') {
      if (state.showBraindump) {
        window.closeBraindump();
      } else if (state.showTaskModal) {
        window.closeTaskModal();
        render();
      } else if (state.mobileDrawerOpen) {
        window.closeMobileDrawer();
        render();
      }
    }
    // Cmd/Ctrl + 1-5 = switch top tabs
    if ((e.metaKey || e.ctrlKey) && ['1', '2', '3', '4', '5'].includes(e.key)) {
      e.preventDefault();
      const tabs = ['home', 'tasks', 'life', 'calendar', 'settings'];
      window.switchTab(tabs[parseInt(e.key) - 1]);
    }
  });

  // Online/offline indicator
  window.addEventListener('online', () => {
    console.log('Back online — syncing...');
    debouncedSaveToGithub();
    window.retryGCalOfflineQueue?.();
  });

  window.addEventListener('offline', () => {
    console.log('Offline — changes saved locally');
  });

  // Improve mobile keyboard UX: hide fixed bottom nav while keyboard is open
  if (window.visualViewport) {
    const updateKeyboardClass = () => {
      const keyboardLikelyOpen = window.innerHeight - window.visualViewport.height > 140;
      document.body.classList.toggle('mobile-keyboard-open', keyboardLikelyOpen);
    };
    window.visualViewport.addEventListener('resize', updateKeyboardClass);
    window.visualViewport.addEventListener('scroll', updateKeyboardClass);
    updateKeyboardClass();
  }

  // Re-render on orientation change for responsive layout updates
  let resizeRenderTimeout = null;
  const handleOrientationChange = () => {
    clearTimeout(resizeRenderTimeout);
    resizeRenderTimeout = setTimeout(() => render(), 150);
  };
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== state._lastRenderWasMobile) {
      handleOrientationChange();
    }
  });
  state._lastRenderWasMobile = window.innerWidth <= 768;

  console.log('Homebase initialized');
}

// ============================================================================
// Bootstrap — applies theme, shows loading, waits for Firebase auth
// ============================================================================

function bootstrap() {
  // Apply theme immediately so login screen is styled
  applyStoredTheme();
  setupTwemojiObserver();

  const lastSeenVersion = localStorage.getItem(APP_VERSION_SEEN_KEY) || '';
  if (lastSeenVersion && lastSeenVersion !== APP_VERSION) {
    state.showCacheRefreshPrompt = true;
    state.cacheRefreshPromptMessage = `Detected update from ${lastSeenVersion} to ${APP_VERSION}. A hard refresh is recommended.`;
  }
  runNoteIntegrityChecks(lastSeenVersion);
  localStorage.setItem(APP_VERSION_SEEN_KEY, APP_VERSION);

  // Show loading spinner
  render();

  // Mobile app-like behavior: prevent Safari double-tap zoom.
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    const delta = now - lastTouchEnd;
    lastTouchEnd = now;
    if (delta > 0 && delta < 320) {
      const target = e.target;
      const editable = target instanceof HTMLElement
        && (target.closest('input, textarea, select, [contenteditable="true"]') !== null);
      if (!editable) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // Wait for Firebase auth state
  initAuth((user) => {
    if (user) {
      initApp();
      applyTwemoji(document.body);
    } else {
      // No user — render login screen
      appInitialized = false;
      render();
      applyTwemoji(document.body);
    }
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
