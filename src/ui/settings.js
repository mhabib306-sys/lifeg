// ============================================================================
// SETTINGS TAB UI MODULE
// ============================================================================
// Renders the Settings tab: scoring weights, perfect day targets,
// theme selector, cloud sync, data management, and changelog.

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';
import { THEMES } from '../constants.js';
import { getGithubToken, setGithubToken, getTheme, setTheme } from '../data/github-sync.js';
import { updateWeight, resetWeights, updateMaxScore, resetMaxScores } from '../features/scoring.js';
import {
  isWhoopConnected, getWhoopWorkerUrl, getWhoopApiKey, getWhoopLastSync
} from '../data/whoop-sync.js';
import {
  isLibreConnected, getLibreWorkerUrl, getLibreApiKey, getLibreLastSync
} from '../data/libre-sync.js';
import { getAnthropicKey } from '../features/braindump.js';
import { getCredentialSyncStatus } from '../data/credential-sync.js';
import {
  isGCalConnected, getSelectedCalendars, getTargetCalendar
} from '../data/google-calendar-sync.js';
import { GCAL_LAST_SYNC_KEY, GCONTACTS_LAST_SYNC_KEY } from '../constants.js';

// ============================================================================
// createWeightInput — Single weight/max-score input row
// ============================================================================
/**
 * Create a labeled number input for a scoring weight or threshold value.
 * @param {string} label - Human-readable label for the weight
 * @param {number} value - Current numeric value
 * @param {string} category - Weight category key (e.g. 'prayer', 'glucose')
 * @param {string|null} field - Field key within the category, or null for top-level
 * @returns {string} HTML string for the input row
 */
export function createWeightInput(label, value, category, field = null) {
  return `
    <div class="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
      <span class="text-sm text-[var(--text-secondary)]">${label}</span>
      <input type="number" step="1" value="${value}"
        class="w-20 px-2 py-1 border border-[var(--border)] rounded-lg text-center text-sm bg-[var(--bg-input)] focus:ring-1 focus:ring-[var(--accent-light)] focus:border-[var(--accent)] outline-none"
        onchange="window.updateWeight('${category}', ${field ? `'${field}'` : 'null'}, this.value)">
    </div>
  `;
}

// ============================================================================
// renderWhoopSettingsCard — WHOOP Integration settings
// ============================================================================
function renderWhoopSettingsCard() {
  const connected = isWhoopConnected();
  const workerUrl = getWhoopWorkerUrl();
  const apiKey = getWhoopApiKey();
  const lastSync = getWhoopLastSync();
  const hasConfig = workerUrl && apiKey;

  const lastSyncText = lastSync
    ? new Date(lastSync).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Never';

  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">WHOOP Integration <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Auto-sync sleep performance, recovery, and strain from your WHOOP account.</p>

      <div class="space-y-3 mb-4">
        <div>
          <label class="text-sm text-[var(--text-secondary)] block mb-1">Worker URL</label>
          <input type="url" value="${workerUrl}" placeholder="https://whoop-proxy.xxx.workers.dev"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none"
            onchange="window.setWhoopWorkerUrl(this.value)">
        </div>
        <div>
          <label class="text-sm text-[var(--text-secondary)] block mb-1">API Key</label>
          <input type="password" value="${apiKey}" placeholder="Shared secret from worker setup"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none"
            onchange="window.setWhoopApiKey(this.value)">
        </div>
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
        ${connected ? `
          <button onclick="window.syncWhoopNow()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Sync Now
          </button>
          <button onclick="window.disconnectWhoop(); window.render()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition">
            Disconnect
          </button>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected · Last sync: ${lastSyncText}
          </span>
        ` : `
          <button onclick="window.connectWhoop()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>
            Connect WHOOP
          </button>
          <button onclick="window.checkWhoopStatus()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>
            Check Status
          </button>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-2"></span> Not connected
          </span>
        `}
      </div>
    </div>
  `;
}

// ============================================================================
// renderLibreSettingsCard — Freestyle Libre CGM integration
// ============================================================================
function renderLibreSettingsCard() {
  const connected = isLibreConnected();
  const workerUrl = getLibreWorkerUrl();
  const apiKey = getLibreApiKey();
  const lastSync = getLibreLastSync();
  const hasConfig = workerUrl && apiKey;

  const lastSyncText = lastSync
    ? new Date(lastSync).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Never';

  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">Freestyle Libre CGM <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Auto-sync glucose readings from your Freestyle Libre sensor via LibreLinkUp. Auto-fills daily glucose average and TIR.</p>

      <div class="space-y-3 mb-4">
        <div>
          <label class="text-sm text-[var(--text-secondary)] block mb-1">Worker URL</label>
          <input type="url" value="${workerUrl}" placeholder="https://libre-proxy.xxx.workers.dev"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none"
            onchange="window.setLibreWorkerUrl(this.value)">
        </div>
        <div>
          <label class="text-sm text-[var(--text-secondary)] block mb-1">API Key</label>
          <input type="password" value="${apiKey}" placeholder="Shared secret from worker setup"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none"
            onchange="window.setLibreApiKey(this.value)">
        </div>
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
        ${connected ? `
          <button onclick="window.syncLibreNow()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Sync Now
          </button>
          <button onclick="window.disconnectLibre(); window.render()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition">
            Disconnect
          </button>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected · Last sync: ${lastSyncText}
          </span>
        ` : `
          <button onclick="window.connectLibre()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>
            Connect Libre
          </button>
          <button onclick="window.checkLibreStatus()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>
            Check Status
          </button>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-2"></span> Not connected
          </span>
        `}
      </div>
    </div>
  `;
}

// ============================================================================
// renderGCalSettingsCard — Google Calendar integration
// ============================================================================
function renderGCalSettingsCard() {
  const connected = isGCalConnected();
  const tokenExpired = state.gcalTokenExpired;
  const calendarsLoading = state.gcalCalendarsLoading;
  const gcalError = state.gcalError;
  const calendars = state.gcalCalendarList || [];
  const selected = getSelectedCalendars();
  const targetCal = getTargetCalendar();
  const lastSync = localStorage.getItem(GCAL_LAST_SYNC_KEY);
  const lastSyncText = lastSync
    ? new Date(parseInt(lastSync, 10)).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Never';
  const contactsLastSync = localStorage.getItem(GCONTACTS_LAST_SYNC_KEY);
  const contactsLastSyncText = contactsLastSync
    ? new Date(parseInt(contactsLastSync, 10)).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Never';
  const gcalErrorUrlMatch = gcalError ? gcalError.match(/https?:\/\/[^\s]+/) : null;
  const gcalErrorUrl = gcalErrorUrlMatch ? gcalErrorUrlMatch[0] : '';

  // Writable calendars for the "push to" dropdown
  const writableCalendars = calendars.filter(c => c.accessRole === 'owner' || c.accessRole === 'writer');

  if (!connected) {
    return `
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">Google Calendar <span class="text-[var(--accent)]">→</span></h3>
        <p class="text-sm text-[var(--text-muted)] mb-4">See Google Calendar events in the Calendar view and push dated tasks to Google Calendar.</p>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
          <button onclick="window.connectGCal()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Connect Google Calendar
          </button>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-2"></span> Not connected
          </span>
        </div>
      </div>
    `;
  }

  if (tokenExpired) {
    return `
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">Google Calendar <span class="text-[var(--accent)]">→</span></h3>
        <p class="text-sm text-[var(--text-muted)] mb-4">Your Google Calendar session has expired. Reconnect to resume syncing.</p>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
          <button onclick="window.reconnectGCal()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Reconnect
          </button>
          <button onclick="window.disconnectGCal()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition">
            Disconnect
          </button>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span> Session expired
          </span>
        </div>
      </div>
    `;
  }

  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">Google Calendar <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Select calendars to show events from and choose which calendar to push tasks to.</p>

      ${calendarsLoading ? `
        <p class="text-sm text-[var(--text-muted)] mb-4">Loading calendars...</p>
      ` : gcalError ? `
        <div class="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p class="text-sm text-amber-800">${escapeHtml(gcalError)}</p>
          ${gcalErrorUrl ? `
            <a href="${escapeHtml(gcalErrorUrl)}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex text-xs font-medium text-amber-900 underline hover:text-amber-700">Open API setup in Google Cloud</a>
          ` : ''}
          <button onclick="window.fetchCalendarList()" class="mt-2 px-3 py-1.5 bg-white border border-amber-300 rounded text-xs font-medium text-amber-800 hover:bg-amber-100 transition">
            Retry loading calendars
          </button>
        </div>
      ` : calendars.length > 0 ? `
        <div class="mb-4">
          <label class="text-sm text-[var(--text-secondary)] block mb-2">Show events from:</label>
          <div class="space-y-1.5 max-h-40 overflow-y-auto">
            ${calendars.map(c => `
              <label class="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--bg-secondary)] cursor-pointer">
                <input type="checkbox" ${selected.includes(c.id) ? 'checked' : ''}
                  onchange="window.toggleCalendarSelection('${c.id.replace(/'/g, "\\'")}')"
                  class="rounded text-[var(--accent)] focus:ring-coral">
                <span class="w-3 h-3 rounded-full flex-shrink-0" style="background: ${c.backgroundColor}"></span>
                <span class="text-sm text-[var(--text-primary)] truncate">${escapeHtml(c.summary)}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm text-[var(--text-secondary)] block mb-2">Push tasks to:</label>
          <select onchange="window.setTargetCalendar(this.value); window.render()"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
            ${writableCalendars.map(c => `
              <option value="${escapeHtml(c.id)}" ${c.id === targetCal ? 'selected' : ''}>${escapeHtml(c.summary)}</option>
            `).join('')}
          </select>
        </div>
      ` : '<p class="text-sm text-[var(--text-muted)] mb-4">No calendars found for this account.</p>'}

      <div class="mb-4 p-3 rounded-lg bg-[var(--bg-secondary)]/25 border border-[var(--border)]">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-[var(--text-primary)]">People Sync From Google Contacts</p>
            <p class="text-xs text-[var(--text-muted)] mt-1">Auto sync runs in background. Last sync: ${contactsLastSyncText}</p>
          </div>
          <button onclick="window.syncGoogleContactsNow()" class="px-3 py-1.5 bg-white border border-[var(--border)] rounded text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition ${state.gcontactsSyncing ? 'opacity-60 cursor-not-allowed' : ''}" ${state.gcontactsSyncing ? 'disabled' : ''}>
            ${state.gcontactsSyncing ? 'Syncing...' : 'Sync Contacts'}
          </button>
        </div>
        ${state.gcontactsError ? `
          <p class="text-xs text-amber-700 mt-2">${escapeHtml(state.gcontactsError)}</p>
        ` : ''}
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
        <button onclick="window.syncGCalNow()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
          Sync Now
        </button>
        <button onclick="window.disconnectGCal()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition">
          Disconnect
        </button>
        <span class="flex items-center text-xs text-[var(--text-muted)]">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Connected · Last sync: ${lastSyncText}
        </span>
      </div>
    </div>
  `;
}

// ============================================================================
// renderAIClassificationCard — Anthropic API key for braindump AI
// ============================================================================
function renderAIClassificationCard() {
  const apiKey = getAnthropicKey();
  const hasKey = !!apiKey;

  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">AI Classification <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Use Claude AI to split/classify Braindump text and power voice-mode processing with the same key. Without an API key, the heuristic classifier is used and voice mode may be limited by browser support.</p>

      <div class="mb-4">
        <label class="text-sm text-[var(--text-secondary)] block mb-2">Anthropic API Key</label>
        <div class="flex gap-2">
          <input type="password" id="anthropic-key-input" value="${apiKey}"
            placeholder="sk-ant-..."
            class="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
          <button onclick="window.setAnthropicKey(document.getElementById('anthropic-key-input').value); window.render()"
            class="sb-btn px-4 py-2 rounded text-sm font-medium">
            Save Key
          </button>
        </div>
        <p class="text-xs text-[var(--text-muted)] mt-2">
          Create an API key at
          <a href="https://console.anthropic.com/settings/keys" target="_blank" class="sb-link">console.anthropic.com</a>.
          Uses Claude Haiku 4.5 for fast, low-cost classification.
        </p>
      </div>

      <div class="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
        <span class="w-2 h-2 rounded-full ${hasKey ? 'bg-green-500' : 'bg-[var(--text-muted)]/40'}"></span>
        <span class="text-xs text-[var(--text-muted)]">${hasKey ? 'Configured — AI classification active' : 'Not configured — using heuristic classifier'}</span>
      </div>
    </div>
  `;
}

function renderNoteSafetyCard() {
  const notes = state.tasksData.filter(item => item?.isNote);
  const activeCount = notes.filter(item => !item.completed && item.noteLifecycleState !== 'deleted').length;
  const deletedCount = notes.filter(item => item.noteLifecycleState === 'deleted').length;
  const completedCount = notes.filter(item => item.completed && item.noteLifecycleState !== 'deleted').length;

  return `
    <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-[var(--text-primary)] text-sm">Note Safety</h3>
        <span class="text-xs text-[var(--text-muted)]">${activeCount} active · ${deletedCount} deleted · ${completedCount} completed</span>
      </div>
      <p class="text-xs text-[var(--text-muted)] mb-3">Use this to find missing notes, inspect recent changes, and create a local backup before/after updates.</p>
      <div class="flex flex-wrap gap-2 mb-2">
        <input id="note-safety-search" type="text" placeholder="Search notes (e.g. mom)"
          class="flex-1 min-w-[180px] px-3 py-1.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
        <button onclick="(() => { const q = document.getElementById('note-safety-search')?.value || ''; const rows = window.findNotesByText(q, 20); alert(rows.length ? rows.map(r => (r.title + ' [' + r.state + '] · ' + new Date(r.updatedAt).toLocaleString())).join('\\n') : 'No matching notes found.'); })()"
          class="sb-btn px-3 py-1.5 rounded text-xs font-medium">Find Notes</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button onclick="(() => { const rows = window.getRecentNoteChanges(20); alert(rows.length ? rows.map(r => (r.title + ' [' + r.state + '] · ' + r.lastAction + ' · ' + new Date(r.updatedAt).toLocaleString())).join('\\n') : 'No recent note changes found.'); })()"
          class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Recent Changes</button>
        <button onclick="(() => { const rows = window.getDeletedNotes(20); alert(rows.length ? rows.map(r => (r.title + ' · deleted ' + new Date(r.deletedAt).toLocaleString() + ' · id=' + r.id)).join('\\n') : 'Trash is empty.'); })()"
          class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Show Deleted</button>
        <button onclick="(() => { const latest = window.getDeletedNotes(1)[0]; if (!latest) { alert('No deleted note to restore.'); return; } const ok = window.restoreDeletedNote(latest.id, true); alert(ok ? ('Restored: ' + latest.title) : 'Could not restore note.'); })()"
          class="px-3 py-1.5 bg-coral/10 text-[var(--accent)] rounded-lg text-xs font-medium hover:bg-coral/20 transition">Restore Latest</button>
        <button onclick="(() => { const info = window.createNoteLocalBackup(); alert('Backup saved locally: ' + info.noteCount + ' notes at ' + new Date(info.createdAt).toLocaleString()); })()"
          class="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-medium hover:bg-coralDark transition">Create Local Backup</button>
      </div>
    </div>
  `;
}

function renderOfflineQueueCard() {
  const queue = window.getGCalOfflineQueue?.() || [];
  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">Offline Queue <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Google Calendar write actions queued while offline or failing token/network checks.</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <button onclick="window.retryGCalOfflineQueue()" class="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-semibold hover:bg-coralDark transition ${queue.length ? '' : 'opacity-50 cursor-not-allowed'}" ${queue.length ? '' : 'disabled'}>Retry All</button>
        <button onclick="window.clearGCalOfflineQueue()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-tertiary)] transition ${queue.length ? '' : 'opacity-50 cursor-not-allowed'}" ${queue.length ? '' : 'disabled'}>Clear</button>
        <span class="text-xs text-[var(--text-muted)] flex items-center">${queue.length} queued</span>
      </div>
      <div class="space-y-2 max-h-56 overflow-auto">
        ${queue.length ? queue.map(item => `
          <div class="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-[var(--text-primary)]">${item.type}</p>
              <p class="text-[11px] text-[var(--text-muted)]">${new Date(item.createdAt).toLocaleString()}</p>
              ${item.lastError ? `<p class="text-[11px] text-amber-700 mt-0.5">${item.lastError}</p>` : ''}
            </div>
            <button onclick="window.removeGCalOfflineQueueItem('${item.id}')" class="text-xs px-2 py-1 rounded bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Remove</button>
          </div>
        `).join('') : '<p class="text-sm text-[var(--text-muted)]">Queue is empty.</p>'}
      </div>
    </div>
  `;
}

function renderConflictCenterCard() {
  const conflicts = state.conflictNotifications || [];
  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">Conflict Center <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Notifications created when cloud/local payloads require conflict policy decisions.</p>
      <div class="flex items-center gap-2 mb-3">
        <button onclick="window.clearConflictNotifications()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-tertiary)] transition ${conflicts.length ? '' : 'opacity-50 cursor-not-allowed'}" ${conflicts.length ? '' : 'disabled'}>Clear All</button>
        <span class="text-xs text-[var(--text-muted)]">${conflicts.length} items</span>
      </div>
      <div class="space-y-2 max-h-56 overflow-auto">
        ${conflicts.length ? conflicts.map(item => `
          <div class="px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-amber-900">${item.entity || 'entity'} • ${item.mode || 'policy'}</p>
              <p class="text-[11px] text-amber-800">${item.reason || ''}</p>
              <p class="text-[11px] text-amber-700">${new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <button onclick="window.dismissConflictNotification('${item.id}')" class="text-xs px-2 py-1 rounded bg-white border border-amber-300 text-amber-900 hover:bg-amber-100">Dismiss</button>
          </div>
        `).join('') : '<p class="text-sm text-[var(--text-muted)]">No conflicts logged.</p>'}
      </div>
    </div>
  `;
}

function renderPerformanceCard() {
  const perf = state.renderPerf || { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-[var(--text-primary)] mb-4">Client Profiling <span class="text-[var(--accent)]">→</span></h3>
      <p class="text-sm text-[var(--text-muted)] mb-4">Lightweight render metrics sampled in-browser.</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div class="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div class="text-xs text-[var(--text-muted)]">Last Render</div>
          <div class="text-lg font-semibold text-[var(--text-primary)]">${perf.lastMs} ms</div>
        </div>
        <div class="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div class="text-xs text-[var(--text-muted)]">Average</div>
          <div class="text-lg font-semibold text-[var(--text-primary)]">${perf.avgMs} ms</div>
        </div>
        <div class="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div class="text-xs text-[var(--text-muted)]">Max</div>
          <div class="text-lg font-semibold text-[var(--text-primary)]">${perf.maxMs} ms</div>
        </div>
        <div class="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div class="text-xs text-[var(--text-muted)]">Samples</div>
          <div class="text-lg font-semibold text-[var(--text-primary)]">${perf.count}</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// renderSettingsTab — Full settings page
// ============================================================================
/**
 * Render the complete Settings tab with all configuration sections.
 * @returns {string} HTML string for the settings tab
 */
export function renderSettingsTab() {
  const user = state.currentUser;
  const whoopConnected = isWhoopConnected();
  const libreConnected = isLibreConnected();
  const gcalConnected = isGCalConnected();
  const integrationsCount = [whoopConnected, libreConnected, gcalConnected].filter(Boolean).length;

  return `
    <div class="space-y-4">
      ${user ? `
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <div class="flex items-center gap-4">
          ${user.photoURL
            ? `<img src="${escapeHtml(user.photoURL)}" alt="" class="w-10 h-10 rounded-full border border-[var(--border)]" referrerpolicy="no-referrer">`
            : `<div class="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-base font-semibold">${(user.displayName || user.email || '?')[0].toUpperCase()}</div>`
          }
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[var(--text-primary)] truncate">${escapeHtml(user.displayName || 'User')}</p>
            <p class="text-xs text-[var(--text-muted)] truncate">${escapeHtml(user.email || '')}</p>
          </div>
          <button onclick="signOutUser()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">
            Sign Out
          </button>
        </div>
      </div>
      ` : ''}

      <!-- Theme (compact inline) -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-[var(--text-primary)] text-sm mb-3">Theme</h3>
        <div class="flex gap-3">
          ${Object.entries(THEMES).map(([key, theme]) => `
            <button onclick="window.setTheme('${key}')"
              class="flex-1 p-3 rounded-lg border-2 text-left transition-all ${getTheme() === key ? 'border-coral bg-coral/5' : 'border-[var(--border)] hover:border-coral/50'}">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-sm font-semibold text-[var(--text-primary)]">${theme.name}</span>
                ${getTheme() === key ? '<span class="text-[10px] bg-coral text-white px-1.5 py-0.5 rounded-full">Active</span>' : ''}
              </div>
              <div class="flex gap-1.5">
                ${key === 'simplebits' ? `
                  <div class="w-5 h-5 rounded-full bg-[#F7F6F4] border border-[var(--border)]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#E5533D]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#1a1a1a]"></div>
                ` : key === 'geist' ? `
                  <div class="w-5 h-5 rounded-full bg-[#FAFAFA] border border-[#E6E6E6]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#0070F3]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#000000]"></div>
                ` : `
                  <div class="w-5 h-5 rounded-full bg-[#FFFFFF] border border-[var(--border)]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#147EFB]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#1D1D1F]"></div>
                `}
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Cloud Sync (compact) -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-[var(--text-primary)] text-sm">Cloud Sync</h3>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            ${getGithubToken() ? '<span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> Connected' : '<span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-1.5"></span> Not connected'}
          </span>
        </div>
        <div class="flex gap-2 mb-3">
          <input type="password" id="github-token-input" value="${getGithubToken()}"
            placeholder="ghp_xxxx or github_pat_xxxx"
            class="flex-1 px-3 py-1.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
          <button onclick="window.setGithubToken(document.getElementById('github-token-input').value)"
            class="sb-btn px-3 py-1.5 rounded text-xs font-medium">Save</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.saveToGithub()" class="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-medium hover:bg-coralDark transition ${getGithubToken() ? '' : 'opacity-50 cursor-not-allowed'}" ${getGithubToken() ? '' : 'disabled'}>Sync Now</button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Pull from Cloud</button>
        </div>
        ${(() => {
          const credStatus = getCredentialSyncStatus();
          return `<div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--border-light)]">
            <span class="w-1.5 h-1.5 rounded-full ${credStatus.hasCreds ? 'bg-green-500' : 'bg-[var(--text-muted)]/40'}"></span>
            <span class="text-[11px] text-[var(--text-muted)]">${credStatus.hasCreds ? credStatus.count + ' credential' + (credStatus.count !== 1 ? 's' : '') + ' synced to cloud' : 'No credentials to sync'}</span>
          </div>`;
        })()}
      </div>

      <!-- Integrations (collapsible group) -->
      <details ${state.settingsIntegrationsOpen ? 'open' : ''} ontoggle="window.settingsIntegrationsOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Integrations</h3>
            <span class="text-xs text-[var(--text-muted)]">${integrationsCount}/3 connected</span>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-5 space-y-4 border-t border-[var(--border-light)] pt-4">
          ${renderWhoopSettingsCard()}
          ${renderLibreSettingsCard()}
          ${renderGCalSettingsCard()}
          ${renderAIClassificationCard()}
        </div>
      </details>

      <!-- Scoring Configuration (collapsible) -->
      <details ${state.settingsScoringOpen ? 'open' : ''} ontoggle="window.settingsScoringOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Scoring Configuration</h3>
            <span class="text-xs text-[var(--text-muted)]">Weights & targets</span>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-5 border-t border-[var(--border-light)] pt-4 space-y-6">
          <!-- Scoring Weights -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-[var(--text-primary)]">Scoring Weights</h4>
              <button onclick="window.resetWeights()" class="px-3 py-1 bg-coral/10 text-[var(--accent)] rounded text-xs font-medium hover:bg-coral/20 transition">Reset</button>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Prayer</h4>
                ${createWeightInput('On-time prayer', state.WEIGHTS.prayer.onTime, 'prayer', 'onTime')}
                ${createWeightInput('Late prayer', state.WEIGHTS.prayer.late, 'prayer', 'late')}
                ${createWeightInput('Quran (per page)', state.WEIGHTS.prayer.quran, 'prayer', 'quran')}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Glucose</h4>
                ${createWeightInput('Avg Glucose max pts', state.WEIGHTS.glucose.avgMax, 'glucose', 'avgMax')}
                ${createWeightInput('TIR pts per %', state.WEIGHTS.glucose.tirPerPoint, 'glucose', 'tirPerPoint')}
                ${createWeightInput('Insulin threshold', state.WEIGHTS.glucose.insulinThreshold, 'glucose', 'insulinThreshold')}
                ${createWeightInput('Insulin bonus', state.WEIGHTS.glucose.insulinBase, 'glucose', 'insulinBase')}
                ${createWeightInput('Insulin penalty', state.WEIGHTS.glucose.insulinPenalty, 'glucose', 'insulinPenalty')}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Whoop</h4>
                ${createWeightInput('Sleep >=90%', state.WEIGHTS.whoop.sleepPerfHigh, 'whoop', 'sleepPerfHigh')}
                ${createWeightInput('Sleep 70-90%', state.WEIGHTS.whoop.sleepPerfMid, 'whoop', 'sleepPerfMid')}
                ${createWeightInput('Sleep 50-70%', state.WEIGHTS.whoop.sleepPerfLow, 'whoop', 'sleepPerfLow')}
                ${createWeightInput('Recovery >=66%', state.WEIGHTS.whoop.recoveryHigh, 'whoop', 'recoveryHigh')}
                ${createWeightInput('Recovery 50-66%', state.WEIGHTS.whoop.recoveryMid, 'whoop', 'recoveryMid')}
                ${createWeightInput('Recovery 33-50%', state.WEIGHTS.whoop.recoveryLow, 'whoop', 'recoveryLow')}
                ${createWeightInput('Strain match', state.WEIGHTS.whoop.strainMatch, 'whoop', 'strainMatch')}
                ${createWeightInput('High strain green', state.WEIGHTS.whoop.strainHigh, 'whoop', 'strainHigh')}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Family</h4>
                ${createWeightInput('Mom', state.WEIGHTS.family.mom, 'family', 'mom')}
                ${createWeightInput('Dad', state.WEIGHTS.family.dad, 'family', 'dad')}
                ${createWeightInput('Jana', state.WEIGHTS.family.jana, 'family', 'jana')}
                ${createWeightInput('Tia', state.WEIGHTS.family.tia, 'family', 'tia')}
                ${createWeightInput('Ahmed', state.WEIGHTS.family.ahmed, 'family', 'ahmed')}
                ${createWeightInput('Eman', state.WEIGHTS.family.eman, 'family', 'eman')}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Habits</h4>
                ${createWeightInput('Exercise', state.WEIGHTS.habits.exercise, 'habits', 'exercise')}
                ${createWeightInput('Reading', state.WEIGHTS.habits.reading, 'habits', 'reading')}
                ${createWeightInput('Meditation', state.WEIGHTS.habits.meditation, 'habits', 'meditation')}
                ${createWeightInput('Water (per L)', state.WEIGHTS.habits.water, 'habits', 'water')}
                ${createWeightInput('Vitamins', state.WEIGHTS.habits.vitamins, 'habits', 'vitamins')}
                ${createWeightInput('Brush Teeth', state.WEIGHTS.habits.brushTeeth, 'habits', 'brushTeeth')}
                ${createWeightInput('NoP bonus', state.WEIGHTS.habits.nopYes, 'habits', 'nopYes')}
                ${createWeightInput('NoP penalty', state.WEIGHTS.habits.nopNo, 'habits', 'nopNo')}
              </div>
            </div>
          </div>

          <!-- Perfect Day Targets -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-[var(--text-primary)]">Perfect Day Targets</h4>
              <button onclick="window.resetMaxScores()" class="px-3 py-1 bg-coral/10 text-[var(--accent)] rounded text-xs font-medium hover:bg-coral/20 transition">Reset</button>
            </div>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
              ${['prayer', 'diabetes', 'whoop', 'family', 'habits', 'total'].map(key => `
                <div class="text-center">
                  <input type="number" value="${state.MAX_SCORES[key]}"
                    class="w-full px-2 py-1.5 border border-[var(--border)] rounded text-center text-sm bg-[var(--bg-input)] ${key === 'total' ? 'border-coral' : ''}"
                    onchange="window.updateMaxScore('${key}', this.value)">
                  <div class="text-[11px] font-medium ${key === 'total' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'} mt-1">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </details>

      <!-- Data Management (compact) -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-[var(--text-primary)] text-sm mb-3">Data Management</h3>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.exportData()" class="sb-btn px-3 py-1.5 rounded text-xs font-medium">Export</button>
          <label class="sb-btn px-3 py-1.5 rounded text-xs font-medium cursor-pointer">
            Import
            <input type="file" accept=".json" class="hidden" onchange="window.importData(event)">
          </label>
          <button onclick="window.forceHardRefresh()" class="px-3 py-1.5 bg-coral/10 text-[var(--accent)] rounded-lg text-xs font-medium hover:bg-coral/20 transition">Force Refresh</button>
        </div>
      </div>

      ${renderNoteSafetyCard()}

      <!-- Developer Tools (collapsible) -->
      <details ${state.settingsDevToolsOpen ? 'open' : ''} ontoggle="window.settingsDevToolsOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Developer Tools</h3>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-5 space-y-4 border-t border-[var(--border-light)] pt-4">
          ${renderOfflineQueueCard()}
          ${renderConflictCenterCard()}
          ${renderPerformanceCard()}
        </div>
      </details>
    </div>
  `;
}
