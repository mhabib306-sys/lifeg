// Magic Plus FAB — floating action button for quick task creation on mobile
import { state } from '../state.js';
import { isMobileViewport } from '../utils.js';
import { getActiveIcons } from '../constants.js';

/**
 * Render the Magic Plus FAB HTML.
 * Shows on mobile tasks/home tabs only, hidden during modals.
 */
export function renderMagicFab() {
  if (!isMobileViewport()) return '';
  if (state.activeTab !== 'tasks' && state.activeTab !== 'home') return '';
  if (state.showTaskModal) return '';

  const icons = getActiveIcons();
  return `
    <button class="magic-fab"
      onclick="window.hapticSync?.('medium'); window.editingTaskId=null; window.showTaskModal=true; window.render()"
      aria-label="New task">
      ${icons.add || '+'}
    </button>
  `;
}
