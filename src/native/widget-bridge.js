// Widget Data Bridge — Syncs today's tasks/score to WidgetKit via App Group
import { isCapacitor } from '../platform.js';
import { state } from '../state.js';

/**
 * Push current daily score, streak, and today's top tasks to the native widget.
 * Called after every save operation. No-op on web.
 */
export async function updateWidgetData() {
  if (!isCapacitor()) return;
  try {
    const { Capacitor, registerPlugin } = await import('@capacitor/core');
    const WidgetBridge = registerPlugin('WidgetBridge');

    // Get today's score
    const score = typeof window.calculateScores === 'function'
      ? (window.calculateScores()?.total || 0)
      : 0;

    // Get streak
    const streak = state.streak?.current || 0;

    // Get today's uncompleted tasks (top 4)
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = (state.tasksData || [])
      .filter(t => !t.isNote && !t.completed && (t.today || t.dueDate === today))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 4)
      .map(t => ({ id: t.id, title: t.title, completed: t.completed, flagged: t.flagged }));

    await WidgetBridge.updateWidgetData({ score, streak, tasks: todayTasks });
  } catch (e) {
    // Silent fail — widget is optional
  }
}
