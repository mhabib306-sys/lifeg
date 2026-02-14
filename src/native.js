// Native integration — leaf module (imports only platform.js)
// All Capacitor plugins lazy-loaded via dynamic import() for tree-shaking on web builds.

import { isCapacitor } from './platform.js';

/**
 * Native haptic feedback with navigator.vibrate fallback.
 * L4 fix: wraps haptics calls in Promise.resolve() for void returns.
 */
export async function nativeHaptic(type = 'light') {
  if (isCapacitor()) {
    try {
      const { Haptics, ImpactStyle, NotificationStyle } = await import('@capacitor/haptics');
      switch (type) {
        case 'light':
          await Promise.resolve(Haptics.impact({ style: ImpactStyle.Light }));
          break;
        case 'medium':
          await Promise.resolve(Haptics.impact({ style: ImpactStyle.Medium }));
          break;
        case 'heavy':
          await Promise.resolve(Haptics.impact({ style: ImpactStyle.Heavy }));
          break;
        case 'success':
          await Promise.resolve(Haptics.notification({ type: NotificationStyle.Success }));
          break;
        case 'error':
          await Promise.resolve(Haptics.notification({ type: NotificationStyle.Error }));
          break;
        case 'selection':
          await Promise.resolve(Haptics.selectionChanged());
          break;
        default:
          await Promise.resolve(Haptics.impact({ style: ImpactStyle.Light }));
      }
      return;
    } catch { /* fall through to vibrate */ }
  }
  // Web fallback
  if (!navigator.vibrate) return;
  const patterns = { light: 5, medium: 10, heavy: 20, error: [10, 50, 10], success: [10, 30] };
  navigator.vibrate(patterns[type] || 5);
}

/** Fire-and-forget haptic for gesture handlers (no await needed). */
export function hapticSync(type = 'light') {
  nativeHaptic(type);
}

/** Set native status bar text color (light content for dark backgrounds). */
export async function setStatusBarStyle(isDark) {
  if (!isCapacitor()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
  } catch { /* non-critical */ }
}

/** Initialize keyboard listeners — sets body class + --keyboard-height CSS var. */
export async function initKeyboard() {
  if (!isCapacitor()) return;
  try {
    const { Keyboard } = await import('@capacitor/keyboard');
    Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.classList.add('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    });
  } catch { /* non-critical */ }
}

/** Hide splash screen with fade. */
export async function hideSplashScreen() {
  if (!isCapacitor()) return;
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch { /* non-critical */ }
}

/** Open URL in SFSafariViewController (iOS) or system browser. */
export async function openInAppBrowser(url) {
  if (!isCapacitor()) {
    window.open(url, '_blank');
    return;
  }
  try {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url, presentationStyle: 'popover' });
  } catch {
    window.open(url, '_blank');
  }
}

/** L5 fix: App lifecycle listeners (back button + state change). */
export async function initAppLifecycle() {
  if (!isCapacitor()) return;
  try {
    const { App } = await import('@capacitor/app');
    // Resume from background → trigger sync
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive && typeof window.debouncedSaveToGithub === 'function') {
        window.debouncedSaveToGithub();
      }
    });
    // Back button (Android mainly, but good to have)
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      }
    });
  } catch { /* non-critical */ }
}

/** Master init — call once at app boot. */
export async function initNative() {
  if (!isCapacitor()) return;
  await Promise.all([
    initKeyboard(),
    initAppLifecycle(),
    hideSplashScreen(),
  ]);
}
