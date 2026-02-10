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
import { initializeNoteOrders } from './features/notes.js';
import { initWeather } from './features/weather.js';
import { initWhoopSync } from './data/whoop-sync.js';
import { initGCalSync } from './data/google-calendar-sync.js';
import { initGoogleContactsSync } from './data/google-contacts-sync.js';
import { applyStoredTheme, loadCloudData, debouncedSaveToGithub } from './data/github-sync.js';
import { initAuth } from './data/firebase.js';
import { render } from './ui/render.js';
import { migrateTodayFlag } from './features/tasks.js';
import { ensureHomeWidgets } from './features/home-widgets.js';
import { APP_VERSION, APP_VERSION_SEEN_KEY } from './constants.js';

// ============================================================================
// App Initialization (called only after auth confirms a signed-in user)
// ============================================================================

let appInitialized = false;

function initApp() {
  if (appInitialized) return;
  appInitialized = true;

  // Initialize task ordering
  migrateTodayFlag();
  initializeTaskOrders();
  initializeNoteOrders();

  // Ensure home widgets are complete
  ensureHomeWidgets();

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
      initGCalSync();
      initGoogleContactsSync();
    })
    .catch(err => {
      console.warn('Cloud data load failed (will use local):', err.message);
      initWhoopSync();
      initGCalSync();
      initGoogleContactsSync();
    });

  // Initialize weather
  initWeather();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + N = new task
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      window.openNewTaskModal();
    }
    // Cmd/Ctrl + Shift + D = open Braindump
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
      e.preventDefault();
      window.openBraindump();
    }
    // Escape = close modal / braindump
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

  console.log('Homebase initialized');
}

// ============================================================================
// Bootstrap — applies theme, shows loading, waits for Firebase auth
// ============================================================================

function bootstrap() {
  // Apply theme immediately so login screen is styled
  applyStoredTheme();

  const lastSeenVersion = localStorage.getItem(APP_VERSION_SEEN_KEY) || '';
  if (lastSeenVersion && lastSeenVersion !== APP_VERSION) {
    state.showCacheRefreshPrompt = true;
    state.cacheRefreshPromptMessage = `Detected update from ${lastSeenVersion} to ${APP_VERSION}. A hard refresh is recommended.`;
  }
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
    } else {
      // No user — render login screen
      appInitialized = false;
      render();
    }
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
