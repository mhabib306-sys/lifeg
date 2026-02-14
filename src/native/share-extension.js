// Share Extension — Accept text/URL from other apps and create inbox tasks
import { isCapacitor } from '../platform.js';
import { state } from '../state.js';

/**
 * Check for shared items from the Share Extension via App Group.
 * Called on app resume to process pending shared items.
 */
export async function processSharedItems() {
  if (!isCapacitor()) return;
  try {
    const { Capacitor, registerPlugin } = await import('@capacitor/core');
    const WidgetBridge = registerPlugin('WidgetBridge');

    // Read shared items from App Group (written by Share Extension)
    // For now, shared items come via URL scheme: homebase://share?text=...
    // Full share extension requires native Swift target (created separately)
  } catch (e) {
    // Silent fail
  }
}

/**
 * Handle shared content via URL scheme.
 * @param {string} text - Shared text content
 * @param {string} [url] - Shared URL
 */
export function handleSharedContent(text, url) {
  const title = text || url || '';
  if (!title) return;

  const notes = url && text ? `Source: ${url}` : '';

  // Create task in inbox
  if (typeof window.createTask === 'function') {
    window.createTask(title, { status: 'inbox', notes });
    window.render?.();
  }
}
