// ============================================================================
// Libre CGM Sync Module
// ============================================================================
// Auto-syncs Freestyle Libre glucose data via Cloudflare Worker proxy.
// Mirrors the whoop-sync.js pattern: external API + localStorage caching.
// Uses window.saveData(), window.debouncedSaveToGithub(), window.render() via bridge.
//
// Sync schedule:
//   - First morning sync at 8:00 AM (glucose data available immediately)
//   - Every 1 hour interval
//   - Final snapshot at 23:59 local time daily

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import { getDefaultDayData } from './storage.js';

const LS_WORKER_URL = 'nucleusLibreWorkerUrl';
const LS_API_KEY = 'nucleusLibreApiKey';
const LS_LAST_SYNC = 'nucleusLibreLastSync';
const LS_CONNECTED = 'nucleusLibreConnected';

const STALE_MS = 1 * 60 * 60 * 1000; // 1 hour
const SYNC_INTERVAL_MS = 1 * 60 * 60 * 1000; // 1 hour

let syncIntervalId = null;
let endOfDayTimeoutId = null;
let morningTimeoutId = null;

const MORNING_HOUR = 8; // First sync at 8:00 AM

// ---- Config getters/setters ----

export function getLibreWorkerUrl() {
  return localStorage.getItem(LS_WORKER_URL) || '';
}

export function setLibreWorkerUrl(url) {
  localStorage.setItem(LS_WORKER_URL, url.replace(/\/+$/, ''));
}

export function getLibreApiKey() {
  return localStorage.getItem(LS_API_KEY) || '';
}

export function setLibreApiKey(key) {
  localStorage.setItem(LS_API_KEY, key);
}

export function getLibreLastSync() {
  const ts = localStorage.getItem(LS_LAST_SYNC);
  return ts ? parseInt(ts, 10) : null;
}

export function isLibreConnected() {
  return localStorage.getItem(LS_CONNECTED) === 'true';
}

// ---- API calls ----

export async function fetchLibreData() {
  const workerUrl = getLibreWorkerUrl();
  const apiKey = getLibreApiKey();
  if (!workerUrl || !apiKey) return null;

  try {
    const res = await fetch(`${workerUrl}/data`, {
      headers: { 'X-API-Key': apiKey },
    });
    if (!res.ok) {
      console.warn('Libre data fetch failed:', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Libre fetch error:', err);
    return null;
  }
}

export async function checkLibreStatus() {
  const workerUrl = getLibreWorkerUrl();
  const apiKey = getLibreApiKey();
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
    console.error('Libre status check error:', err);
    return false;
  }
}

// ---- Sync logic ----

/**
 * Write Libre data into today's allData entry.
 * Auto-fills glucose.avg and glucose.tir from Libre readings.
 * Stores Libre-specific metadata in the libre sub-object.
 * @param {string} dateKey - YYYY-MM-DD
 * @param {Object} data - { currentGlucose, trend, avg24h, tir, readingsCount, lastReading }
 */
function writeLibreToDate(dateKey, data) {
  if (!state.allData[dateKey]) {
    state.allData[dateKey] = getDefaultDayData();
  }

  // Ensure glucose and libre sub-objects exist
  if (!state.allData[dateKey].glucose) {
    state.allData[dateKey].glucose = {};
  }
  if (!state.allData[dateKey].libre) {
    state.allData[dateKey].libre = {};
  }

  const entry = state.allData[dateKey];

  // Auto-fill glucose avg and TIR from Libre
  if (data.avg24h !== null && data.avg24h !== undefined) {
    entry.glucose.avg = String(data.avg24h);
  }
  if (data.tir !== null && data.tir !== undefined) {
    entry.glucose.tir = String(data.tir);
  }

  // Store Libre-specific metadata
  if (data.currentGlucose !== null && data.currentGlucose !== undefined) {
    entry.libre.currentGlucose = data.currentGlucose;
  }
  entry.libre.trend = data.trend || '';
  entry.libre.readingsCount = data.readingsCount || 0;
  entry.libre.lastReading = data.lastReading || '';

  state.allData[dateKey]._lastModified = new Date().toISOString();
}

export async function syncLibreNow() {
  const data = await fetchLibreData();
  if (!data) return;

  const today = getLocalDateString();
  writeLibreToDate(today, data);

  localStorage.setItem(LS_LAST_SYNC, String(Date.now()));

  window.invalidateScoresCache();
  window.saveData();
  window.debouncedSaveToGithub();
  window.render();
  console.log(`Libre synced: glucose ${data.currentGlucose} ${data.trend}, avg ${data.avg24h}, TIR ${data.tir}%`);
}

export async function checkAndSyncLibre() {
  if (!isLibreConnected()) return;
  if (!getLibreWorkerUrl() || !getLibreApiKey()) return;

  const lastSync = getLibreLastSync();
  if (lastSync && Date.now() - lastSync < STALE_MS) return;

  await syncLibreNow();
}

// ---- End-of-day snapshot ----

function msUntilEndOfDay() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(23, 59, 0, 0);

  let ms = target - now;
  if (ms <= 0) {
    target.setDate(target.getDate() + 1);
    ms = target - now;
  }
  return ms;
}

async function endOfDaySync() {
  console.log('Libre end-of-day sync triggered');
  await syncLibreNow();
  scheduleEndOfDaySync();
}

function scheduleEndOfDaySync() {
  if (endOfDayTimeoutId) clearTimeout(endOfDayTimeoutId);

  if (!isLibreConnected()) return;

  const ms = msUntilEndOfDay();
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  console.log(`Libre end-of-day sync scheduled in ${hours}h ${mins}m`);

  endOfDayTimeoutId = setTimeout(endOfDaySync, ms);
}

// ---- Periodic sync ----

function startSyncInterval() {
  if (syncIntervalId) clearInterval(syncIntervalId);
  syncIntervalId = setInterval(checkAndSyncLibre, SYNC_INTERVAL_MS);
}

function stopSyncTimers() {
  if (syncIntervalId) { clearInterval(syncIntervalId); syncIntervalId = null; }
  if (endOfDayTimeoutId) { clearTimeout(endOfDayTimeoutId); endOfDayTimeoutId = null; }
  if (morningTimeoutId) { clearTimeout(morningTimeoutId); morningTimeoutId = null; }
}

// ---- Connect / Disconnect ----

export async function connectLibre() {
  const workerUrl = getLibreWorkerUrl();
  const apiKey = getLibreApiKey();
  if (!workerUrl || !apiKey) return;

  const connected = await checkLibreStatus();
  if (connected) {
    // Start syncing immediately
    await syncLibreNow();
    startSyncInterval();
    scheduleEndOfDaySync();
  }
}

export function disconnectLibre() {
  localStorage.removeItem(LS_CONNECTED);
  localStorage.removeItem(LS_LAST_SYNC);
  stopSyncTimers();
  window.render();
}

// ---- Init (called from main.js) ----

export function initLibreSync() {
  if (!isLibreConnected()) return;

  // First morning sync at 8 AM so glucose data is fresh.
  // If already past 8 AM, sync immediately (if stale).
  const now = new Date();
  if (now.getHours() < MORNING_HOUR) {
    const target = new Date(now);
    target.setHours(MORNING_HOUR, 0, 0, 0);
    const ms = target - now;
    const mins = Math.floor(ms / 60000);
    console.log(`Libre: first sync deferred to 8:00 AM (${mins}m from now)`);
    morningTimeoutId = setTimeout(() => {
      syncLibreNow();
      startSyncInterval();
    }, ms);
  } else {
    // Past 8 AM — sync now if stale, then start interval
    checkAndSyncLibre();
    startSyncInterval();
  }

  // Daily 23:59 final snapshot
  scheduleEndOfDaySync();
}
