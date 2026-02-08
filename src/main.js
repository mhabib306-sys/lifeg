// ============================================================================
// MAIN ENTRY POINT — Nucleus App
// ============================================================================
// This file is the Vite entry point. It:
// 1. Imports styles (triggers Tailwind/PostCSS processing)
// 2. Imports the bridge (wires all modules to window.*)
// 3. Initializes task orders, weather, theme, and cloud data
// 4. Runs the first render
// 5. Sets up keyboard shortcuts and online/offline listeners

// -- Styles (processed by Vite + PostCSS + Tailwind) --
import './styles/main.css';

// -- Bridge (imports all modules, assigns to window.*) --
import './bridge.js';

// -- Direct imports for init-only functions --
import { state } from './state.js';
import { initializeTaskOrders } from './features/task-filter.js';
import { initWeather } from './features/weather.js';
import { applyStoredTheme, loadCloudData, debouncedSaveToGithub } from './data/github-sync.js';
import { render } from './ui/render.js';

// ============================================================================
// App Initialization
// ============================================================================

function initApp() {
  // Apply saved theme
  applyStoredTheme();

  // Initialize task ordering
  initializeTaskOrders();

  // Initial render
  render();

  // Load cloud data (non-blocking)
  loadCloudData().catch(err => {
    console.warn('Cloud data load failed (will use local):', err.message);
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
    // Escape = close modal
    if (e.key === 'Escape') {
      if (state.showTaskModal) {
        window.closeTaskModal();
        render();
      } else if (state.mobileDrawerOpen) {
        window.closeMobileDrawer();
        render();
      }
    }
    // Cmd/Ctrl + 1-4 = switch tabs
    if ((e.metaKey || e.ctrlKey) && ['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      const tabs = ['home', 'tasks', 'life', 'settings'];
      window.switchTab(tabs[parseInt(e.key) - 1]);
    }
  });

  // Online/offline indicator
  window.addEventListener('online', () => {
    console.log('Back online — syncing...');
    debouncedSaveToGithub();
  });

  window.addEventListener('offline', () => {
    console.log('Offline — changes saved locally');
  });

  console.log('Nucleus initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
