// Biometric authentication (Face ID / Touch ID) for iOS native builds
import { isCapacitor } from '../platform.js';

/**
 * Check if biometric auth is available on this device.
 * @returns {Promise<boolean>}
 */
export async function isBiometricAvailable() {
  if (!isCapacitor()) return false;
  try {
    const { NativeBiometric } = await import('@capgo/capacitor-native-biometric');
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}

/**
 * Prompt the user for biometric verification.
 * Errors propagate to callers for UI handling (NOT silent catch).
 * @returns {Promise<boolean>} true if authenticated
 */
export async function verifyBiometric() {
  if (!isCapacitor()) return true; // No-op on web
  const { NativeBiometric } = await import('@capgo/capacitor-native-biometric');
  await NativeBiometric.verifyIdentity({
    reason: 'Unlock Homebase',
    title: 'Authenticate',
    subtitle: 'Use Face ID or Touch ID to unlock',
    useFallback: true,
    fallbackTitle: 'Use Passcode',
  });
  return true;
}

/**
 * Enable biometric lock. Verifies biometric is available first.
 * @returns {Promise<boolean>} true if enabled successfully
 */
export async function enableBiometric() {
  const available = await isBiometricAvailable();
  if (!available) return false;

  // Test biometric works before enabling
  await verifyBiometric();

  localStorage.setItem('nucleusBiometricEnabled', 'true');
  return true;
}

/**
 * Disable biometric lock.
 */
export function disableBiometric() {
  localStorage.setItem('nucleusBiometricEnabled', 'false');
}

/**
 * Attempt to unlock the app with biometrics.
 * Called on resume from background when biometric is enabled.
 * @returns {Promise<boolean>} true if unlocked
 */
export async function unlockWithBiometric() {
  try {
    await verifyBiometric();
    return true;
  } catch {
    return false;
  }
}
