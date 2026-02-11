// ============================================================================
// WHOOP Sync Module
// ============================================================================
// Auto-syncs WHOOP metrics (sleepPerf, recovery, strain) via Cloudflare Worker proxy.
// Follows the weather.js pattern: external API + localStorage caching.
// Uses window.saveData(), window.debouncedSaveToGithub(), window.render() via bridge.
//
// Sync schedule:
//   - First morning sync at 11:00 AM (so new WHOOP cycle has started)
//   - Every 6 hours after that while app is open
//   - Final snapshot at 23:59 local time daily

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';
import { defaultDayData } from '../constants.js';

const LS_WORKER_URL = 'nucleusWhoopWorkerUrl';
const LS_API_KEY = 'nucleusWhoopApiKey';
const LS_LAST_SYNC = 'nucleusWhoopLastSync';
const LS_CONNECTED = 'nucleusWhoopConnected';

const STALE_MS = 6 * 60 * 60 * 1000; // 6 hours
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

let syncIntervalId = null;
let endOfDayTimeoutId = null;
let morningTimeoutId = null;

const MORNING_HOUR = 11; // First sync at 11:00 AM (new cycle likely started)

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

/**
 * Write WHOOP data into a specific date's allData entry.
 * Strain is only written if the WHOOP cycle started on the target date,
 * preventing yesterday's final strain from leaking into today's entry
 * during the midnight→wake-up window.
 * @param {string} dateKey - YYYY-MM-DD
 * @param {Object} data - { sleepPerf, recovery, strain, cycleStartDate }
 */
function writeWhoopToDate(dateKey, data) {
  if (!state.allData[dateKey]) {
    state.allData[dateKey] = JSON.parse(JSON.stringify(defaultDayData));
  }
  if (!state.allData[dateKey].whoop) {
    state.allData[dateKey].whoop = {};
  }

  // Sleep perf and recovery are always safe to write — they reflect
  // last night's sleep which is the correct data point for the new day.
  if (data.sleepPerf !== null && data.sleepPerf !== undefined) {
    state.allData[dateKey].whoop.sleepPerf = data.sleepPerf;
  }
  if (data.recovery !== null && data.recovery !== undefined) {
    state.allData[dateKey].whoop.recovery = data.recovery;
  }

  // Strain: write the latest value regardless of cycle start date.
  // The worker returns today's most-recent cycle strain which is always relevant.
  if (data.strain !== null && data.strain !== undefined) {
    state.allData[dateKey].whoop.strain = data.strain;
  }
}

export async function syncWhoopNow() {
  const data = await fetchWhoopData();
  if (!data) return;

  const today = getLocalDateString();
  writeWhoopToDate(today, data);

  localStorage.setItem(LS_LAST_SYNC, String(Date.now()));

  window.invalidateScoresCache();
  window.saveData();
  window.debouncedSaveToGithub();
  window.render();
  console.log(`WHOOP synced: sleep ${data.sleepPerf}%, recovery ${data.recovery}%, strain ${data.strain}`);
}

export async function checkAndSyncWhoop() {
  if (!isWhoopConnected()) return;
  if (!getWhoopWorkerUrl() || !getWhoopApiKey()) return;

  const lastSync = getWhoopLastSync();
  if (lastSync && Date.now() - lastSync < STALE_MS) return;

  await syncWhoopNow();
}

// ---- End-of-day snapshot ----

/**
 * Calculate ms until 23:59:00 local time today.
 * If already past 23:59, returns ms until 23:59 tomorrow.
 */
function msUntilEndOfDay() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(23, 59, 0, 0);

  let ms = target - now;
  if (ms <= 0) {
    // Already past 23:59, schedule for tomorrow
    target.setDate(target.getDate() + 1);
    ms = target - now;
  }
  return ms;
}

async function endOfDaySync() {
  console.log('WHOOP end-of-day sync triggered');
  await syncWhoopNow();
  // Schedule next day's end-of-day sync
  scheduleEndOfDaySync();
}

function scheduleEndOfDaySync() {
  if (endOfDayTimeoutId) clearTimeout(endOfDayTimeoutId);

  if (!isWhoopConnected()) return;

  const ms = msUntilEndOfDay();
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  console.log(`WHOOP end-of-day sync scheduled in ${hours}h ${mins}m`);

  endOfDayTimeoutId = setTimeout(endOfDaySync, ms);
}

// ---- Periodic sync ----

function startSyncInterval() {
  if (syncIntervalId) clearInterval(syncIntervalId);
  syncIntervalId = setInterval(checkAndSyncWhoop, SYNC_INTERVAL_MS);
}

function stopSyncTimers() {
  if (syncIntervalId) { clearInterval(syncIntervalId); syncIntervalId = null; }
  if (endOfDayTimeoutId) { clearTimeout(endOfDayTimeoutId); endOfDayTimeoutId = null; }
  if (morningTimeoutId) { clearTimeout(morningTimeoutId); morningTimeoutId = null; }
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
  stopSyncTimers();
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

  if (!isWhoopConnected()) return;

  // First morning sync at 11 AM so the new WHOOP cycle has started.
  // If already past 11 AM, sync immediately (if stale).
  const now = new Date();
  if (now.getHours() < MORNING_HOUR) {
    const target = new Date(now);
    target.setHours(MORNING_HOUR, 0, 0, 0);
    const ms = target - now;
    const mins = Math.floor(ms / 60000);
    console.log(`WHOOP: first sync deferred to 11:00 AM (${mins}m from now)`);
    morningTimeoutId = setTimeout(() => {
      syncWhoopNow();
      startSyncInterval();
    }, ms);
  } else {
    // Past 11 AM — sync now if stale, then start interval
    checkAndSyncWhoop();
    startSyncInterval();
  }

  // Daily 23:59 final snapshot
  scheduleEndOfDaySync();
}
