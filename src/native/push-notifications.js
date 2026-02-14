// Push Notifications — APNs registration for iOS native builds
import { isCapacitor } from '../platform.js';

/**
 * Request push notification permission and register for APNs.
 * Stores the device token in localStorage for future server-side use.
 * Safe to call on web (no-op).
 */
export async function initPushNotifications() {
  if (!isCapacitor()) return;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    // Check current permission status
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'denied') return;

    // Request if not yet granted
    if (permStatus.receive !== 'granted') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') return;
    }

    // Register with APNs
    await PushNotifications.register();

    // Store token when received
    PushNotifications.addListener('registration', (token) => {
      localStorage.setItem('nucleusPushToken', token.value);
      console.log('[Push] APNs token registered');
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.warn('[Push] Registration failed:', err.error);
    });

    // Handle notification taps (deep link routing)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      const data = notification.notification?.data;
      if (data?.taskId) {
        // Open task modal for the referenced task
        window.editingTaskId = data.taskId;
        window.showTaskModal = true;
        window.render?.();
      } else if (data?.tab) {
        window.switchTab?.(data.tab);
      }
    });
  } catch (e) {
    console.warn('[Push] Init failed:', e);
  }
}
