// ============================================================================
// Credential Sync — Encrypted credential storage in GitHub data.json
// ============================================================================
// Two-layer envelope encryption:
//   1. Random AES-GCM-256 data key encrypts the credential JSON
//   2. PBKDF2-derived wrapping key (from Firebase UID + project ID) encrypts the data key
// This ensures credentials are protected even if data.json is publicly readable.

import { CRED_SYNC_KEYS } from '../constants.js';

const FIREBASE_PROJECT_ID = 'homebase-880f0';
const PBKDF2_ITERATIONS = 100_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFirebaseUid() {
  try {
    // Access Firebase auth via the bridge (avoids circular import with firebase.js)
    const user = window.getCurrentUser?.();
    return user?.uid || null;
  } catch { return null; }
}

function isSubtleCryptoAvailable() {
  return typeof crypto !== 'undefined' && crypto.subtle;
}

function toBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
// Key derivation
// ---------------------------------------------------------------------------

async function deriveWrappingKey(uid, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(uid + FIREBASE_PROJECT_ID), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey', 'unwrapKey']
  );
}

// ---------------------------------------------------------------------------
// Encrypt credentials bundle
// ---------------------------------------------------------------------------

async function encryptBundle(credentials, uid) {
  // Generate random salt (16 bytes) and data key (256-bit AES-GCM)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const dataKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
  );

  // Derive wrapping key from UID + project ID
  const wrappingKey = await deriveWrappingKey(uid, salt);

  // Wrap (encrypt) the data key with the wrapping key
  const wrapIv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedKey = await crypto.subtle.wrapKey(
    'raw', dataKey, wrappingKey, { name: 'AES-GCM', iv: wrapIv }
  );

  // Encrypt credential JSON with the data key
  const dataIv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(credentials));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: dataIv }, dataKey, plaintext
  );

  return {
    version: 1,
    salt: toBase64(salt),
    wrapIv: toBase64(wrapIv),
    wrappedKey: toBase64(wrappedKey),
    dataIv: toBase64(dataIv),
    data: toBase64(ciphertext),
    updatedAt: new Date().toISOString()
  };
}

// ---------------------------------------------------------------------------
// Decrypt credentials bundle
// ---------------------------------------------------------------------------

async function decryptBundle(bundle, uid) {
  const salt = new Uint8Array(fromBase64(bundle.salt));
  const wrapIv = new Uint8Array(fromBase64(bundle.wrapIv));
  const wrappedKey = fromBase64(bundle.wrappedKey);
  const dataIv = new Uint8Array(fromBase64(bundle.dataIv));
  const ciphertext = fromBase64(bundle.data);

  // Re-derive wrapping key from UID + project ID + stored salt
  const wrappingKey = await deriveWrappingKey(uid, salt);

  // Unwrap the data key
  const dataKey = await crypto.subtle.unwrapKey(
    'raw', wrappedKey, wrappingKey,
    { name: 'AES-GCM', iv: wrapIv },
    { name: 'AES-GCM', length: 256 },
    false, ['decrypt']
  );

  // Decrypt credential JSON
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: dataIv }, dataKey, ciphertext
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build an encrypted credentials bundle for the saveToGithub payload.
 * Returns null if no credentials exist or encryption is unavailable.
 */
export async function buildEncryptedCredentials() {
  if (!isSubtleCryptoAvailable()) return null;
  const uid = getFirebaseUid();
  if (!uid) return null;

  const credentials = {};
  let count = 0;
  for (const { localStorage: key, id } of CRED_SYNC_KEYS) {
    const val = localStorage.getItem(key);
    if (val) {
      credentials[id] = val;
      count++;
    }
  }
  if (count === 0) return null;

  try {
    return await encryptBundle(credentials, uid);
  } catch (e) {
    console.warn('Credential encryption failed:', e.message);
    return null;
  }
}

/**
 * Decrypt a cloud credentials bundle and gap-fill into localStorage.
 * Returns true if any credentials were restored.
 */
export async function restoreEncryptedCredentials(bundle) {
  if (!bundle || bundle.version !== 1) return false;
  if (!isSubtleCryptoAvailable()) return false;
  const uid = getFirebaseUid();
  if (!uid) return false;

  const credentials = await decryptBundle(bundle, uid);
  let restored = 0;

  for (const { localStorage: key, id } of CRED_SYNC_KEYS) {
    // Gap-fill: only write if local is empty
    if (!localStorage.getItem(key) && credentials[id]) {
      localStorage.setItem(key, credentials[id]);
      restored++;
    }
  }

  if (restored > 0) console.log(`Restored ${restored} credential(s) from cloud`);
  return restored > 0;
}

/**
 * Get credential sync status for UI display.
 * Returns { hasCreds, count } where count is number of non-empty credentials.
 */
export function getCredentialSyncStatus() {
  let count = 0;
  for (const { localStorage: key } of CRED_SYNC_KEYS) {
    if (localStorage.getItem(key)) count++;
  }
  return { hasCreds: count > 0, count };
}
