// ============================================================================
// WHOOP Sync Module
// ============================================================================
// Auto-syncs WHOOP metrics (sleepPerf, recovery, strain) via Cloudflare Worker proxy.
// Follows the weather.js pattern: external API + localStorage caching.
// Uses window.saveData(), window.debouncedSaveToGithub(), window.render() via bridge.

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import { defaultDayData } from '../constants.js';

const LS_WORKER_URL = 'nucleusWhoopWorkerUrl';
const LS_API_KEY = 'nucleusWhoopApiKey';
const LS_LAST_SYNC = 'nucleusWhoopLastSync';
const LS_CONNECTED = 'nucleusWhoopConnected';

const STALE_MS = 3 * 60 * 60 * 1000; // 3 hours

// ---- Config getters/setters ----

export function getWhoopWorkerUrl() {
  return localStorage.getItem(LS_WORKER_URL) || '';
}

export function setWhoopWorkerUrl(url) {
  localStorage.setItem(LS_WORKER_URL, url.replace(/\/+$/, ''));
}

export function getWhoopApiKey() {
  return localStorage.getItem(LS_API_KEY) || '';
}

export function setWhoopApiKey(key) {
  localStorage.setItem(LS_API_KEY, key);
}

export function getWhoopLastSync() {
  const ts = localStorage.getItem(LS_LAST_SYNC);
  return ts ? parseInt(ts, 10) : null;
}

export function isWhoopConnected() {
  return localStorage.getItem(LS_CONNECTED) === 'true';
}

// ---- API calls ----

export async function fetchWhoopData() {
  const workerUrl = getWhoopWorkerUrl();
  const apiKey = getWhoopApiKey();
  if (!workerUrl || !apiKey) return null;

  try {
    const res = await fetch(`${workerUrl}/data`, {
      headers: { 'X-API-Key': apiKey },
    });
    if (!res.ok) {
      console.warn('WHOOP data fetch failed:', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('WHOOP fetch error:', err);
    return null;
  }
}

export async function checkWhoopStatus() {
  const workerUrl = getWhoopWorkerUrl();
  const apiKey = getWhoopApiKey();
  if (!workerUrl || !apiKey) return false;

  try {
    const res = await fetch(`${workerUrl}/status`, {
      headers: { 'X-API-Key': apiKey },
    });
    if (!res.ok) return false;
    const data = await res.json();
    const connected = !!data.connected;
    localStorage.setItem(LS_CONNECTED, String(connected));
    window.render();
    return connected;
  } catch (err) {
    console.error('WHOOP status check error:', err);
    return false;
  }
}

// ---- Sync logic ----

export async function syncWhoopNow() {
  const data = await fetchWhoopData();
  if (!data) return;

  const today = getLocalDateString();
  if (!state.allData[today]) {
    state.allData[today] = JSON.parse(JSON.stringify(defaultDayData));
  }
  if (!state.allData[today].whoop) {
    state.allData[today].whoop = {};
  }

  // Only overwrite fields that came back non-null
  if (data.sleepPerf !== null && data.sleepPerf !== undefined) {
    state.allData[today].whoop.sleepPerf = data.sleepPerf;
  }
  if (data.recovery !== null && data.recovery !== undefined) {
    state.allData[today].whoop.recovery = data.recovery;
  }
  if (data.strain !== null && data.strain !== undefined) {
    state.allData[today].whoop.strain = data.strain;
  }

  localStorage.setItem(LS_LAST_SYNC, String(Date.now()));

  window.saveData();
  window.debouncedSaveToGithub();
  window.render();
}

export async function checkAndSyncWhoop() {
  if (!isWhoopConnected()) return;
  if (!getWhoopWorkerUrl() || !getWhoopApiKey()) return;

  const lastSync = getWhoopLastSync();
  if (lastSync && Date.now() - lastSync < STALE_MS) return;

  await syncWhoopNow();
}

// ---- Connect / Disconnect ----

export function connectWhoop() {
  const workerUrl = getWhoopWorkerUrl();
  if (!workerUrl) return;
  window.open(`${workerUrl}/auth`, '_blank');
}

export function disconnectWhoop() {
  localStorage.removeItem(LS_CONNECTED);
  localStorage.removeItem(LS_LAST_SYNC);
  window.render();
}

// ---- Init (called from main.js) ----

export function initWhoopSync() {
  // Detect OAuth redirect
  const params = new URLSearchParams(window.location.search);
  if (params.get('whoop') === 'connected') {
    localStorage.setItem(LS_CONNECTED, 'true');
    // Clean URL
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, '', cleanUrl);
  }

  checkAndSyncWhoop();
}
