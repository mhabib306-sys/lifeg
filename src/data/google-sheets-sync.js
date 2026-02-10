// ============================================================================
// Google Sheets Sync Module
// ============================================================================
// Fetches a "Yesterday" column from a private Google Sheet using the same
// OAuth token as Google Calendar. Caches results in localStorage.

import { state } from '../state.js';
import {
  GCAL_ACCESS_TOKEN_KEY,
  GSHEET_SPREADSHEET_ID,
  GSHEET_TAB_GID,
  GSHEET_CACHE_KEY,
  GSHEET_LAST_SYNC_KEY,
} from '../constants.js';
import { isGCalConnected } from './google-calendar-sync.js';

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let sheetSyncIntervalId = null;

function getAccessToken() {
  return localStorage.getItem(GCAL_ACCESS_TOKEN_KEY) || '';
}

/**
 * Discover the tab (sheet) name from GID, then fetch all rows,
 * find the "Yesterday" column, and return structured data.
 */
async function fetchSheetData() {
  const token = getAccessToken();
  if (!token) return { error: 'No access token' };

  // Step 1: Get spreadsheet metadata to find tab name from GID
  const metaRes = await fetch(
    `${SHEETS_API}/${GSHEET_SPREADSHEET_ID}?fields=sheets.properties`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (metaRes.status === 401) return { authExpired: true };
  if (metaRes.status === 403) {
    let msg = 'Sheets permission denied';
    try {
      const body = await metaRes.json();
      if (body?.error?.message) msg = body.error.message;
    } catch { /* ignore */ }
    return { error: msg, insufficientScope: true };
  }
  if (!metaRes.ok) return { error: `Sheets API error (${metaRes.status})` };

  const meta = await metaRes.json();
  const sheets = meta?.sheets || [];
  const targetSheet = sheets.find(s => s.properties?.sheetId === GSHEET_TAB_GID);
  if (!targetSheet) {
    return { error: `Tab with GID ${GSHEET_TAB_GID} not found in spreadsheet` };
  }
  const tabName = targetSheet.properties.title;

  // Step 2: Fetch all values from the tab
  const valuesRes = await fetch(
    `${SHEETS_API}/${GSHEET_SPREADSHEET_ID}/values/${encodeURIComponent(tabName)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (valuesRes.status === 401) return { authExpired: true };
  if (!valuesRes.ok) return { error: `Sheets values fetch failed (${valuesRes.status})` };

  const valuesData = await valuesRes.json();
  const rows = valuesData?.values || [];
  if (rows.length < 2) return { error: 'Sheet has no data rows' };

  // Step 3: Find "Yesterday" column in header row
  const headerRow = rows[0].map(h => String(h || '').trim().toLowerCase());
  const yesterdayIdx = headerRow.findIndex(h => h === 'yesterday');
  if (yesterdayIdx === -1) {
    return { error: 'No "Yesterday" column found in header row' };
  }

  // Step 4: Extract label (col A) + value (Yesterday column) pairs
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const label = String(row[0] || '').trim();
    const value = yesterdayIdx < row.length ? String(row[yesterdayIdx] || '').trim() : '';
    if (!label && !value) continue; // skip fully empty rows
    result.push({ label, value });
  }

  return {
    rows: result,
    tabName,
    lastSync: new Date().toISOString(),
  };
}

export async function syncGSheetNow() {
  if (!isGCalConnected()) return false;
  const token = getAccessToken();
  if (!token) return false;

  state.gsheetSyncing = true;
  state.gsheetError = null;
  window.render();

  try {
    const data = await fetchSheetData();

    if (data.authExpired) {
      state.gsheetError = 'Google Sheets authorization expired. Reconnect Google Calendar to refresh.';
      return false;
    }
    if (data.insufficientScope) {
      state.gsheetError = 'Sheets permission missing. Reconnect Google Calendar in Settings to grant Sheets access.';
      return false;
    }
    if (data.error) {
      state.gsheetError = data.error;
      return false;
    }

    // Save to state and localStorage cache
    state.gsheetData = data;
    localStorage.setItem(GSHEET_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(GSHEET_LAST_SYNC_KEY, String(Date.now()));
    state.gsheetError = null;
    return true;
  } catch (err) {
    state.gsheetError = err?.message || 'Google Sheets sync failed.';
    return false;
  } finally {
    state.gsheetSyncing = false;
    window.render();
  }
}

export function initGSheetSync() {
  // Hydrate from cache
  try {
    const cached = localStorage.getItem(GSHEET_CACHE_KEY);
    if (cached) state.gsheetData = JSON.parse(cached);
  } catch { /* ignore */ }

  if (!isGCalConnected()) return;

  // Check if cache is stale (>1 hour)
  const lastSync = parseInt(localStorage.getItem(GSHEET_LAST_SYNC_KEY) || '0', 10);
  const stale = !lastSync || (Date.now() - lastSync > SYNC_INTERVAL_MS);
  if (stale) {
    syncGSheetNow();
  }

  // Set up periodic sync
  if (sheetSyncIntervalId) clearInterval(sheetSyncIntervalId);
  sheetSyncIntervalId = setInterval(() => {
    if (isGCalConnected()) syncGSheetNow();
  }, SYNC_INTERVAL_MS);
}
