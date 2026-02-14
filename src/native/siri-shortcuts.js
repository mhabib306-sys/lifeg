// Siri Shortcuts — "Add task" and "Show agenda" intents
import { isCapacitor } from '../platform.js';

/**
 * Donate a Siri Shortcut for adding tasks.
 * Called once during app init. Users configure in iOS Settings > Siri.
 */
export async function donateSiriShortcuts() {
  if (!isCapacitor()) return;
  try {
    // Use Capacitor's App plugin for URL scheme handling
    // Siri intents are configured via Info.plist and Shortcuts app
    // The app responds to deep links: homebase://add-task and homebase://agenda
    console.log('[Siri] Shortcuts available via URL schemes');
  } catch (e) {
    console.warn('[Siri] Shortcut donation failed:', e);
  }
}

/**
 * Handle Siri shortcut invocations via URL scheme.
 * @param {string} action - 'add-task' or 'agenda'
 */
export function handleSiriShortcut(action) {
  switch (action) {
    case 'add-task':
      // Open new task modal
      window.editingTaskId = null;
      window.showTaskModal = true;
      window.render?.();
      break;
    case 'agenda':
      // Switch to home tab showing today's tasks
      window.switchTab?.('home');
      break;
    default:
      console.warn('[Siri] Unknown action:', action);
  }
}
