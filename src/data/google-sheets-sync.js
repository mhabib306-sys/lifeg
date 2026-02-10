// ============================================================================
// Google Sheets Sync Module
// ============================================================================
// Fetches ALL tabs from a private Google Sheet using the same OAuth token
// as Google Calendar. Caches results in localStorage. Provides AI Q&A
// powered by Claude Haiku with full spreadsheet context.

import { state } from '../state.js';
import {
  GCAL_ACCESS_TOKEN_KEY,
  ANTHROPIC_KEY,
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
 * Fetch ALL tabs from the spreadsheet. Returns structured data for each tab.
 */
async function fetchSheetData() {
  const token = getAccessToken();
  if (!token) return { error: 'No access token' };

  // Step 1: Get spreadsheet metadata to discover all tab names
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
  if (sheets.length === 0) return { error: 'No tabs found in spreadsheet' };

  // Build range list for batch get — all tabs
  const tabNames = sheets.map(s => s.properties.title);
  const ranges = tabNames.map(name => encodeURIComponent(name));

  // Step 2: Batch fetch all tabs in one API call
  const rangeParams = ranges.map(r => `ranges=${r}`).join('&');
  const batchRes = await fetch(
    `${SHEETS_API}/${GSHEET_SPREADSHEET_ID}/values:batchGet?${rangeParams}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (batchRes.status === 401) return { authExpired: true };
  if (!batchRes.ok) return { error: `Sheets batch fetch failed (${batchRes.status})` };

  const batchData = await batchRes.json();
  const valueRanges = batchData?.valueRanges || [];

  // Step 3: Structure data per tab
  const tabs = [];
  for (let i = 0; i < valueRanges.length; i++) {
    const tabName = tabNames[i] || `Sheet${i + 1}`;
    const rows = valueRanges[i]?.values || [];
    if (rows.length === 0) continue;

    tabs.push({
      name: tabName,
      headers: rows[0] || [],
      rows: rows.slice(1),
    });
  }

  // Also extract legacy "Yesterday" column from the primary tab for backward compat
  const primaryTab = tabs.find((_, idx) => sheets[idx]?.properties?.sheetId === GSHEET_TAB_GID) || tabs[0];
  let legacyRows = [];
  if (primaryTab && primaryTab.headers.length > 0) {
    const headerRow = primaryTab.headers.map(h => String(h || '').trim().toLowerCase());
    const yesterdayIdx = headerRow.findIndex(h => h === 'yesterday');
    if (yesterdayIdx !== -1) {
      for (const row of primaryTab.rows) {
        const label = String(row[0] || '').trim();
        const value = yesterdayIdx < row.length ? String(row[yesterdayIdx] || '').trim() : '';
        if (!label && !value) continue;
        legacyRows.push({ label, value });
      }
    }
  }

  return {
    tabs,
    rows: legacyRows, // backward compat
    tabName: primaryTab?.name || '',
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

  // Check if cache is stale (>1 hour) or missing multi-tab data (old format)
  const lastSync = parseInt(localStorage.getItem(GSHEET_LAST_SYNC_KEY) || '0', 10);
  const needsUpgrade = state.gsheetData && !state.gsheetData.tabs;
  const stale = !lastSync || (Date.now() - lastSync > SYNC_INTERVAL_MS) || needsUpgrade;
  if (stale) {
    syncGSheetNow();
  }

  // Set up periodic sync
  if (sheetSyncIntervalId) clearInterval(sheetSyncIntervalId);
  sheetSyncIntervalId = setInterval(() => {
    if (isGCalConnected()) syncGSheetNow();
  }, SYNC_INTERVAL_MS);
}

/**
 * Format ALL tabs of sheet data as text for AI context.
 * Each tab is separated by a header line showing tab name.
 */
function formatSheetForAI(sheetData) {
  if (!sheetData) return '';

  // New multi-tab format
  if (sheetData.tabs && sheetData.tabs.length > 0) {
    const sections = [];
    for (const tab of sheetData.tabs) {
      const lines = [];
      lines.push(`=== ${tab.name} ===`);
      if (tab.headers && tab.headers.length > 0) {
        lines.push(tab.headers.join('\t'));
      }
      for (const row of (tab.rows || [])) {
        const cells = row.map(c => String(c ?? ''));
        if (cells.every(c => !c.trim())) continue; // skip empty rows
        lines.push(cells.join('\t'));
      }
      sections.push(lines.join('\n'));
    }
    return sections.join('\n\n');
  }

  // Legacy fallback: single-tab label:value format
  if (sheetData.rows && sheetData.rows.length > 0) {
    return sheetData.rows.map(r => `${r.label}: ${r.value || '(empty)'}`).join('\n');
  }

  return '';
}

/**
 * Send sheet data + user prompt to Claude API, return AI response text.
 */
export async function askGSheet(prompt) {
  const apiKey = localStorage.getItem(ANTHROPIC_KEY) || '';
  if (!apiKey) throw new Error('No API key configured');

  // Ensure we have sheet data (use cache or fetch)
  let sheetData = state.gsheetData;
  if (!sheetData || (!sheetData.tabs && !sheetData.rows)) {
    const success = await syncGSheetNow();
    if (!success) throw new Error(state.gsheetError || 'Failed to fetch sheet data');
    sheetData = state.gsheetData;
  }
  if (!sheetData) throw new Error('No sheet data available');

  const sheetText = formatSheetForAI(sheetData);
  if (!sheetText) throw new Error('No sheet data to analyze');

  const tabCount = sheetData.tabs ? sheetData.tabs.length : 1;
  const tabList = sheetData.tabs ? sheetData.tabs.map(t => t.name).join(', ') : (sheetData.tabName || 'Sheet');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `You are a concise personal assistant. The user has a spreadsheet with ${tabCount} tab(s): ${tabList}. Here is ALL the data:\n\n${sheetText}\n\nAnswer the user's question about this data. Be brief and direct. Use plain text, no markdown.`,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text || '';
  if (!text) throw new Error('Empty response from AI');
  return text;
}
