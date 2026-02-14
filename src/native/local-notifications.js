// Local Notifications — Due date reminders for tasks
import { isCapacitor } from '../platform.js';

/**
 * Schedule a local notification for a task's due date.
 * Fires at 9:00 AM on the due date.
 * @param {string} taskId
 * @param {string} title - Task title
 * @param {string} dueDate - YYYY-MM-DD format
 */
export async function scheduleTaskReminder(taskId, title, dueDate) {
  if (!isCapacitor() || !dueDate) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    // Parse date and set to 9:00 AM local
    const [y, m, d] = dueDate.split('-').map(Number);
    const at = new Date(y, m - 1, d, 9, 0, 0);

    // Don't schedule if already past
    if (at <= new Date()) return;

    // Use taskId hash as numeric notification ID
    const id = hashTaskId(taskId);

    // Cancel existing notification for this task first
    await cancelTaskReminder(taskId);

    await LocalNotifications.schedule({
      notifications: [{
        id,
        title: 'Task Due Today',
        body: title,
        schedule: { at },
        extra: { taskId },
        smallIcon: 'ic_notification',
        iconColor: '#F59E0B',
      }],
    });
  } catch (e) {
    console.warn('[LocalNotif] Schedule failed:', e);
  }
}

/**
 * Cancel a scheduled reminder for a task.
 * @param {string} taskId
 */
export async function cancelTaskReminder(taskId) {
  if (!isCapacitor()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const id = hashTaskId(taskId);
    await LocalNotifications.cancel({ notifications: [{ id }] });
  } catch (e) {
    // Silently ignore — notification may not exist
  }
}

/**
 * Request local notification permissions.
 * Called once during app init.
 */
export async function initLocalNotifications() {
  if (!isCapacitor()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }

    // Handle notification taps
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      const taskId = notification.notification?.extra?.taskId;
      if (taskId) {
        window.editingTaskId = taskId;
        window.showTaskModal = true;
        window.render?.();
      }
    });
  } catch (e) {
    console.warn('[LocalNotif] Init failed:', e);
  }
}

/**
 * Generate a stable numeric ID from a task ID string.
 */
function hashTaskId(taskId) {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = ((hash << 5) - hash + taskId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
