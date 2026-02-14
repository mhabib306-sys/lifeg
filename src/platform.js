// Platform detection — leaf module (no src/ imports)

export function isCapacitor() {
  return !!(window.Capacitor?.isNativePlatform?.());
}

export function isIOS() {
  if (isCapacitor()) return window.Capacitor.getPlatform?.() === 'ios';
  // L1 fix: detect iPadOS 13+ (reports as "Macintosh")
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function getPlatform() {
  if (isCapacitor()) return window.Capacitor.getPlatform?.() || 'web';
  return 'web';
}

export function isNative() { return isCapacitor(); }

export const platformFeatures = {
  get nativeHaptics() { return isCapacitor(); },
  get nativeStatusBar() { return isCapacitor(); },
  get viewTransitions() { return !!document.startViewTransition; },
  get motionPreference() { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
};
