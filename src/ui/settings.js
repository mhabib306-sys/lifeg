// ============================================================================
// SETTINGS TAB UI MODULE
// ============================================================================
// Renders the Settings tab: scoring weights, perfect day targets,
// theme selector, cloud sync, data management, and changelog.

import { state } from '../state.js';
import { escapeHtml } from '../utils.js';
import { THEMES } from '../constants.js';
import { getGithubToken, setGithubToken, getTheme, setTheme, getColorMode, toggleColorMode, getSyncHealth } from '../data/github-sync.js';
import { updateWeight, resetWeights, updateMaxScore, resetMaxScores, addFamilyMember, removeFamilyMember, updateFamilyMember } from '../features/scoring.js';
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
// Helpers
// ============================================================================

function formatSyncTime(ts) {
  if (!ts) return 'Never';
  const d = typeof ts === 'string' ? new Date(ts) : new Date(typeof ts === 'number' ? ts : parseInt(ts, 10));
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function statusDot(on) {
  return `<span class="w-2 h-2 rounded-full flex-shrink-0 ${on ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]/40'}"></span>`;
}

// ============================================================================
// Sync Health Section
// ============================================================================
function renderSyncHealthSection() {
  const health = getSyncHealth();
  const saveSuccessRate = health.totalSaves > 0
    ? ((health.successfulSaves / health.totalSaves) * 100).toFixed(0)
    : '--';
  const loadSuccessRate = health.totalLoads > 0
    ? ((health.successfulLoads / health.totalLoads) * 100).toFixed(0)
    : '--';
  const dirtyFlag = state.githubSyncDirty ? '<span class="text-[var(--warning)]">Unsaved changes</span>' : '<span class="text-[var(--success)]">Clean</span>';
  const lastError = health.lastError
    ? `<span class="text-[var(--danger)] text-[10px]">${escapeHtml(health.lastError.message)} (${formatSyncTime(health.lastError.timestamp)})</span>`
    : '<span class="text-[var(--text-muted)]">None</span>';
  const recentEvents = (health.recentEvents || []).slice(0, 10);

  return `
    <details class="sb-card rounded-lg bg-[var(--bg-card)] group">
      <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-[var(--text-primary)] text-sm">Sync Health</h3>
          <span class="text-xs text-[var(--text-muted)]">${saveSuccessRate}% save success</span>
        </div>
        <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
      </summary>
      <div class="px-5 pb-4 border-t border-[var(--border-light)] space-y-3">
        <div class="grid grid-cols-2 gap-3 text-xs mt-3">
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Saves</div>
            <div class="font-medium">${health.successfulSaves}/${health.totalSaves} (${saveSuccessRate}%)</div>
          </div>
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Loads</div>
            <div class="font-medium">${health.successfulLoads}/${health.totalLoads} (${loadSuccessRate}%)</div>
          </div>
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Avg Latency</div>
            <div class="font-medium">${health.avgSaveLatencyMs || 0}ms</div>
          </div>
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Status</div>
            <div class="font-medium">${dirtyFlag}</div>
          </div>
        </div>
        <div class="text-xs">
          <span class="text-[var(--text-muted)]">Last error:</span> ${lastError}
        </div>
        ${recentEvents.length > 0 ? `
          <div class="text-xs">
            <div class="text-[var(--text-muted)] mb-1.5">Recent sync events:</div>
            <div class="space-y-1 max-h-40 overflow-y-auto">
              ${recentEvents.map(evt => {
                const statusColor = evt.status === 'success' ? 'text-[var(--success)]' : 'text-[var(--danger)]';
                const time = new Date(evt.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
                return `<div class="flex items-center gap-2 py-0.5">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${evt.status === 'success' ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'}"></span>
                  <span class="${statusColor} font-medium">${escapeHtml(evt.type)}</span>
                  <span class="text-[var(--text-muted)] flex-1">${evt.details ? escapeHtml(evt.details) : ''}</span>
                  <span class="text-[var(--text-muted)]">${time}</span>
                  ${evt.latencyMs ? `<span class="text-[var(--text-muted)]">${evt.latencyMs}ms</span>` : ''}
                </div>`;
              }).join('')}
            </div>
          </div>
        ` : ''}
        <div class="flex gap-2 pt-2 border-t border-[var(--border-light)]">
          <button onclick="window.saveToGithub().then(() => window.render())" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-[var(--accent-dark)] transition">Force Push</button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Force Pull</button>
        </div>
      </div>
    </details>
  `;
}

// ============================================================================
// createWeightInput — Single weight/max-score input row
// ============================================================================
export function createWeightInput(label, value, category, field = null) {
  return `
    <div class="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
      <span class="text-sm text-[var(--text-secondary)]">${label}</span>
      <input type="number" step="1" inputmode="numeric" value="${value}"
        class="input-field-sm w-20 text-center"
        onchange="window.updateWeight('${category}', ${field ? `'${field}'` : 'null'}, this.value)">
    </div>
  `;
}

// ============================================================================
// Worker-based integration (WHOOP / Libre) — shared compact renderer
// ============================================================================
function renderWorkerIntegration(name, {
  connected, workerUrl, apiKey, lastSync,
  setUrlFn, setKeyFn, connectFn, disconnectFn, syncFn, checkStatusFn,
  isLast = false
}) {
  const hasConfig = workerUrl && apiKey;
  const lastSyncText = formatSyncTime(lastSync);
  const border = isLast ? '' : 'border-b border-[var(--border-light)]';

  if (connected) {
    return `
      <div class="py-3 ${border}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            ${statusDot(true)}
            <span class="text-sm font-medium text-[var(--text-primary)]">${name}</span>
            <span class="text-xs text-[var(--text-muted)]">${lastSyncText}</span>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button onclick="window.${syncFn}()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Sync</button>
            <button onclick="window.${disconnectFn}(); window.render()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Disconnect</button>
          </div>
        </div>
        <details class="mt-2">
          <summary class="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] select-none">Configure</summary>
          <div class="mt-2 space-y-2 pl-4">
            <div>
              <label class="text-xs text-[var(--text-muted)] block mb-1">Worker URL</label>
              <input type="url" value="${workerUrl}" placeholder="https://..."
                class="input-field-sm w-full"
                onchange="window.${setUrlFn}(this.value)">
            </div>
            <div>
              <label class="text-xs text-[var(--text-muted)] block mb-1">API Key</label>
              <input type="password" value="${apiKey}" placeholder="Shared secret"
                class="input-field-sm w-full"
                onchange="window.${setKeyFn}(this.value)">
            </div>
          </div>
        </details>
      </div>
    `;
  }

  // Not connected
  return `
    <div class="py-3 ${border}">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2.5">
          ${statusDot(false)}
          <span class="text-sm font-medium text-[var(--text-primary)]">${name}</span>
          <span class="text-xs text-[var(--text-muted)]">Not connected</span>
        </div>
      </div>
      <div class="space-y-2 pl-4 mb-3">
        <div>
          <label class="text-xs text-[var(--text-muted)] block mb-1">Worker URL</label>
          <input type="url" value="${workerUrl}" placeholder="https://..."
            class="input-field-sm w-full"
            onchange="window.${setUrlFn}(this.value)">
        </div>
        <div>
          <label class="text-xs text-[var(--text-muted)] block mb-1">API Key</label>
          <input type="password" value="${apiKey}" placeholder="Shared secret"
            class="input-field-sm w-full"
            onchange="window.${setKeyFn}(this.value)">
        </div>
      </div>
      <div class="flex items-center gap-2 pl-4">
        <button onclick="window.${connectFn}()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>Connect</button>
        ${checkStatusFn ? `<button onclick="window.${checkStatusFn}()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>Check Status</button>` : ''}
      </div>
    </div>
  `;
}

// ============================================================================
// Google Calendar integration (flat, no card wrapper)
// ============================================================================
function renderGCalIntegration() {
  const connected = isGCalConnected();
  const tokenExpired = state.gcalTokenExpired;
  const calendarsLoading = state.gcalCalendarsLoading;
  const gcalError = state.gcalError;
  const calendars = state.gcalCalendarList || [];
  const selected = getSelectedCalendars();
  const targetCal = getTargetCalendar();
  const lastSync = localStorage.getItem(GCAL_LAST_SYNC_KEY);
  const lastSyncText = formatSyncTime(lastSync ? parseInt(lastSync, 10) : null);
  const contactsLastSync = localStorage.getItem(GCONTACTS_LAST_SYNC_KEY);
  const contactsLastSyncText = formatSyncTime(contactsLastSync ? parseInt(contactsLastSync, 10) : null);
  const gcalErrorUrlMatch = gcalError ? gcalError.match(/https?:\/\/[^\s]+/) : null;
  const gcalErrorUrl = gcalErrorUrlMatch ? gcalErrorUrlMatch[0] : '';
  const writableCalendars = calendars.filter(c => c.accessRole === 'owner' || c.accessRole === 'writer');

  if (!connected) {
    return `
      <div class="py-3 border-b border-[var(--border-light)]">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            ${statusDot(false)}
            <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
            <span class="text-xs text-[var(--text-muted)]">Not connected</span>
          </div>
          <button onclick="window.connectGCal()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Connect</button>
        </div>
      </div>
    `;
  }

  if (tokenExpired) {
    return `
      <div class="py-3 border-b border-[var(--border-light)]">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full flex-shrink-0 bg-[var(--warning)]"></span>
            <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
            <span class="text-xs text-[var(--warning)]">Session expired</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="window.reconnectGCal()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Reconnect</button>
            <button onclick="window.disconnectGCal()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Disconnect</button>
          </div>
        </div>
      </div>
    `;
  }

  // Connected
  return `
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2.5 min-w-0">
          ${statusDot(true)}
          <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
          <span class="text-xs text-[var(--text-muted)]">${lastSyncText}</span>
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button onclick="window.syncGCalNow()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Sync</button>
          <button onclick="window.disconnectGCal()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Disconnect</button>
        </div>
      </div>

      ${calendarsLoading ? `
        <p class="text-xs text-[var(--text-muted)] pl-4 mb-2">Loading calendars...</p>
      ` : gcalError ? `
        <div class="ml-4 mb-2 p-2.5 rounded-md bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] border border-[color-mix(in_srgb,var(--warning)_25%,transparent)]">
          <p class="text-xs text-[var(--warning)]">${escapeHtml(gcalError)}</p>
          ${gcalErrorUrl ? `<a href="${escapeHtml(gcalErrorUrl)}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-medium text-[var(--warning)] underline">Open API setup</a>` : ''}
          <button onclick="window.fetchCalendarList()" class="ml-2 px-2 py-1 bg-white border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] rounded-md text-[11px] font-medium text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] transition">Retry</button>
        </div>
      ` : calendars.length > 0 ? `
        <div class="pl-4 space-y-3 mb-2">
          <div>
            <label class="text-xs text-[var(--text-muted)] block mb-1.5">Show events from</label>
            <div class="space-y-1 max-h-36 overflow-y-auto">
              ${calendars.map(c => `
                <label class="flex items-center gap-2 px-1.5 py-0.5 rounded-md hover:bg-[var(--bg-secondary)] cursor-pointer">
                  <input type="checkbox" ${selected.includes(c.id) ? 'checked' : ''}
                    onchange="window.toggleCalendarSelection('${c.id.replace(/'/g, "\\'")}')"
                    class="rounded text-[var(--accent)] focus:ring-[var(--accent)]">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background: ${c.backgroundColor}"></span>
                  <span class="text-xs text-[var(--text-primary)] truncate">${escapeHtml(c.summary)}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div>
            <label class="text-xs text-[var(--text-muted)] block mb-1">Push tasks to</label>
            <select onchange="window.setTargetCalendar(this.value)"
              class="input-field-sm w-full">
              ${writableCalendars.map(c => `
                <option value="${escapeHtml(c.id)}" ${c.id === targetCal ? 'selected' : ''}>${escapeHtml(c.summary)}</option>
              `).join('')}
            </select>
          </div>
          <div class="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-light)]">
            <div class="min-w-0">
              <span class="text-xs text-[var(--text-muted)]">Contacts sync · ${contactsLastSyncText}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="window.forceFullContactsResync()" class="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${state.gcontactsSyncing ? 'opacity-60 cursor-not-allowed' : ''}" ${state.gcontactsSyncing ? 'disabled' : ''} title="Clear cache and re-fetch all contacts">
                Full Resync
              </button>
              <button onclick="window.syncGoogleContactsNow()" class="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${state.gcontactsSyncing ? 'opacity-60 cursor-not-allowed' : ''}" ${state.gcontactsSyncing ? 'disabled' : ''}>
                ${state.gcontactsSyncing ? 'Syncing...' : 'Sync Contacts'}
              </button>
            </div>
          </div>
        </div>
        ${state.gcontactsError ? `<p class="text-[11px] text-[var(--warning)] pl-4 mb-1">${escapeHtml(state.gcontactsError)}</p>` : ''}
      ` : '<p class="text-xs text-[var(--text-muted)] pl-4 mb-2">No calendars found.</p>'}
    </div>
  `;
}

// ============================================================================
// AI Classification (flat, compact)
// ============================================================================
function renderAIIntegration() {
  const apiKey = getAnthropicKey();
  const hasKey = !!apiKey;

  return `
    <div class="py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          ${statusDot(hasKey)}
          <span class="text-sm font-medium text-[var(--text-primary)]">AI Classification</span>
          <span class="text-xs text-[var(--text-muted)]">${hasKey ? 'Configured' : 'Not configured'}</span>
        </div>
      </div>
      <details class="mt-2">
        <summary class="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] select-none">${hasKey ? 'Change API key' : 'Configure API key'}</summary>
        <div class="mt-2 pl-4">
          <div class="flex gap-2 mb-1.5">
            <input type="password" id="anthropic-key-input" value="${apiKey}"
              placeholder="sk-ant-..."
              class="input-field-sm flex-1">
            <button onclick="window.setAnthropicKey(document.getElementById('anthropic-key-input').value); window.render()"
              class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Save</button>
          </div>
          <p class="text-[11px] text-[var(--text-muted)]">
            Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank" class="sb-link text-[11px]">console.anthropic.com</a>. Uses Claude Haiku 4.5.
          </p>
        </div>
      </details>
    </div>
  `;
}

// ============================================================================
// Data & Diagnostics sub-sections (flat, no card wrappers)
// ============================================================================

function renderDataManagementSection() {
  return `
    <div class="py-3 border-b border-[var(--border-light)]">
      <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2.5">Data Management</h4>
      <div class="flex flex-col sm:flex-row flex-wrap gap-2">
        <button onclick="window.exportData()" class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium">Export Data</button>
        <label class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium cursor-pointer text-center">
          Import Data
          <input type="file" accept=".json" class="hidden" onchange="window.importData(event)">
        </label>
        <button onclick="window.forceHardRefresh()" class="px-3 py-2 sm:py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Force Refresh</button>
      </div>
    </div>
  `;
}

function renderNoteSafetySection() {
  const notes = state.tasksData.filter(item => item?.isNote);
  const activeCount = notes.filter(item => !item.completed && item.noteLifecycleState !== 'deleted').length;
  const deletedCount = notes.filter(item => item.noteLifecycleState === 'deleted').length;
  const completedCount = notes.filter(item => item.completed && item.noteLifecycleState !== 'deleted').length;

  return `
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Note Safety</h4>
        <span class="text-[11px] text-[var(--text-muted)]">${activeCount} active · ${deletedCount} deleted · ${completedCount} done</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-2">
        <input id="note-safety-search" type="text" placeholder="Search notes..."
          class="input-field-sm flex-1 min-w-[140px]">
        <button onclick="(() => { const q = document.getElementById('note-safety-search')?.value || ''; const rows = window.findNotesByText(q, 20); alert(rows.length ? rows.map(r => (r.title + ' [' + r.state + '] · ' + new Date(r.updatedAt).toLocaleString())).join('\\n') : 'No matching notes found.'); })()"
          class="sb-btn px-2.5 py-1.5 rounded-md text-xs font-medium">Find</button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button onclick="(() => { const rows = window.getRecentNoteChanges(20); alert(rows.length ? rows.map(r => (r.title + ' [' + r.state + '] · ' + r.lastAction + ' · ' + new Date(r.updatedAt).toLocaleString())).join('\\n') : 'No recent note changes found.'); })()"
          class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition">Recent Changes</button>
        <button onclick="(() => { const rows = window.getDeletedNotes(20); alert(rows.length ? rows.map(r => (r.title + ' · deleted ' + new Date(r.deletedAt).toLocaleString() + ' · id=' + r.id)).join('\\n') : 'Trash is empty.'); })()"
          class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition">Deleted</button>
        <button onclick="(() => { const latest = window.getDeletedNotes(1)[0]; if (!latest) { alert('No deleted note to restore.'); return; } const ok = window.restoreDeletedNote(latest.id, true); alert(ok ? ('Restored: ' + latest.title) : 'Could not restore note.'); })()"
          class="px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-[11px] font-medium hover:bg-[var(--accent)]/20 transition">Restore Latest</button>
        <button onclick="(() => { const info = window.createNoteLocalBackup(); alert('Backup saved locally: ' + info.noteCount + ' notes at ' + new Date(info.createdAt).toLocaleString()); })()"
          class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-[11px] font-medium hover:bg-[var(--accent-dark)] transition">Backup</button>
      </div>
    </div>
  `;
}

function renderOfflineQueueSection() {
  const queue = window.getGCalOfflineQueue?.() || [];
  return `
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Offline Queue</h4>
        <span class="text-[11px] text-[var(--text-muted)]">${queue.length} queued</span>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <button onclick="window.retryGCalOfflineQueue()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-[11px] font-medium hover:bg-[var(--accent-dark)] transition ${queue.length ? '' : 'opacity-50 cursor-not-allowed'}" ${queue.length ? '' : 'disabled'}>Retry All</button>
        <button onclick="window.clearGCalOfflineQueue()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${queue.length ? '' : 'opacity-50 cursor-not-allowed'}" ${queue.length ? '' : 'disabled'}>Clear</button>
      </div>
      ${queue.length ? `
        <div class="space-y-1.5 max-h-40 overflow-auto">
          ${queue.map(item => `
            <div class="px-2.5 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between gap-2 text-[11px]">
              <div class="min-w-0">
                <span class="font-medium text-[var(--text-primary)]">${item.type}</span>
                <span class="text-[var(--text-muted)] ml-1">${new Date(item.createdAt).toLocaleString()}</span>
                ${item.lastError ? `<span class="text-[var(--warning)] ml-1">${item.lastError}</span>` : ''}
              </div>
              <button onclick="window.removeGCalOfflineQueueItem('${item.id}')" class="text-[11px] px-1.5 py-0.5 rounded-md bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0">Remove</button>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderConflictCenterSection() {
  const conflicts = state.conflictNotifications || [];
  return `
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Conflict Center</h4>
        <span class="text-[11px] text-[var(--text-muted)]">${conflicts.length} items</span>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <button onclick="window.clearConflictNotifications()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${conflicts.length ? '' : 'opacity-50 cursor-not-allowed'}" ${conflicts.length ? '' : 'disabled'}>Clear All</button>
      </div>
      ${conflicts.length ? `
        <div class="space-y-1.5 max-h-40 overflow-auto">
          ${conflicts.map(item => `
            <div class="px-2.5 py-1.5 rounded-md border border-[color-mix(in_srgb,var(--warning)_25%,transparent)] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] flex items-center justify-between gap-2 text-[11px]">
              <div class="min-w-0">
                <span class="font-medium text-[var(--warning)]">${item.entity || 'entity'} · ${item.mode || 'policy'}</span>
                <span class="text-[var(--warning)] ml-1">${item.reason || ''}</span>
              </div>
              <button onclick="window.dismissConflictNotification('${item.id}')" class="text-[11px] px-1.5 py-0.5 rounded-md bg-white border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] flex-shrink-0">Dismiss</button>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderPerformanceSection() {
  const perf = state.renderPerf || { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
  return `
    <div class="py-3">
      <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2.5">Client Profiling</h4>
      <div class="grid grid-cols-4 gap-2 text-center">
        ${[
          ['Last', perf.lastMs],
          ['Avg', perf.avgMs],
          ['Max', perf.maxMs],
          ['Samples', perf.count]
        ].map(([label, val]) => `
          <div class="py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div class="text-[11px] text-[var(--text-muted)]">${label}</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${val}${label !== 'Samples' ? ' ms' : ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// renderSettingsTab — Full settings page
// ============================================================================
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

      <!-- Appearance -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-[var(--text-primary)] text-sm mb-3">Appearance</h3>

        <!-- Light / Dark toggle — Geist segmented control -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-[var(--text-secondary)]">Color mode</span>
          <div class="inline-flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button onclick="window.setColorMode('light')"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${getColorMode() === 'light' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light
            </button>
            <button onclick="window.setColorMode('dark')"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${getColorMode() === 'dark' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              Dark
            </button>
          </div>
        </div>

        <!-- Theme selector -->
        <span class="text-sm text-[var(--text-secondary)] block mb-2">Theme</span>
        <div class="flex gap-3">
          ${Object.entries(THEMES).map(([key, theme]) => `
            <button onclick="window.setTheme('${key}')"
              class="flex-1 p-3 rounded-lg border-2 text-left transition-all ${getTheme() === key ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--accent)]/50'}">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-sm font-semibold text-[var(--text-primary)]">${theme.name}</span>
                ${getTheme() === key ? '<span class="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded-full">Active</span>' : ''}
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

      <!-- Cloud Sync -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-[var(--text-primary)] text-sm">Cloud Sync</h3>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            ${getGithubToken() ? '<span class="w-2 h-2 rounded-full bg-[var(--success)] mr-1.5"></span> Connected' : '<span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-1.5"></span> Not connected'}
          </span>
        </div>
        <div class="flex gap-2 mb-3">
          <input type="password" id="github-token-input" value="${getGithubToken()}"
            placeholder="ghp_xxxx or github_pat_xxxx"
            class="input-field flex-1">
          <button onclick="window.setGithubToken(document.getElementById('github-token-input').value)"
            class="sb-btn px-3 py-1.5 rounded-md text-xs font-medium">Save</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.saveToGithub()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-[var(--accent-dark)] transition ${getGithubToken() ? '' : 'opacity-50 cursor-not-allowed'}" ${getGithubToken() ? '' : 'disabled'}>Sync Now</button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Pull from Cloud</button>
        </div>
        ${(() => {
          const credStatus = getCredentialSyncStatus();
          return `<div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--border-light)]">
            <span class="w-1.5 h-1.5 rounded-full ${credStatus.hasCreds ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]/40'}"></span>
            <span class="text-[11px] text-[var(--text-muted)]">${credStatus.hasCreds ? credStatus.count + ' credential' + (credStatus.count !== 1 ? 's' : '') + ' synced to cloud' : 'No credentials to sync'}</span>
          </div>`;
        })()}
      </div>

      <!-- Sync Health -->
      ${renderSyncHealthSection()}

      <!-- Integrations -->
      <details ${state.settingsIntegrationsOpen ? 'open' : ''} ontoggle="window.settingsIntegrationsOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Integrations</h3>
            <span class="text-xs text-[var(--text-muted)]">${integrationsCount}/3 connected</span>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-4 border-t border-[var(--border-light)]">
          ${renderWorkerIntegration('WHOOP', {
            connected: whoopConnected,
            workerUrl: getWhoopWorkerUrl(),
            apiKey: getWhoopApiKey(),
            lastSync: getWhoopLastSync(),
            setUrlFn: 'setWhoopWorkerUrl',
            setKeyFn: 'setWhoopApiKey',
            connectFn: 'connectWhoop',
            disconnectFn: 'disconnectWhoop',
            syncFn: 'syncWhoopNow',
            checkStatusFn: 'checkWhoopStatus',
          })}
          ${renderWorkerIntegration('Freestyle Libre', {
            connected: libreConnected,
            workerUrl: getLibreWorkerUrl(),
            apiKey: getLibreApiKey(),
            lastSync: getLibreLastSync(),
            setUrlFn: 'setLibreWorkerUrl',
            setKeyFn: 'setLibreApiKey',
            connectFn: 'connectLibre',
            disconnectFn: 'disconnectLibre',
            syncFn: 'syncLibreNow',
            checkStatusFn: 'checkLibreStatus',
          })}
          ${renderGCalIntegration()}
          ${renderAIIntegration()}
        </div>
      </details>

      <!-- Scoring Configuration -->
      <details ${state.settingsScoringOpen ? 'open' : ''} ontoggle="window.settingsScoringOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Scoring Configuration</h3>
            <span class="text-xs text-[var(--text-muted)]">Weights & targets</span>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-5 border-t border-[var(--border-light)] pt-4 space-y-6">
          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-[var(--text-primary)]">Scoring Weights</h4>
              <button onclick="window.resetWeights()" class="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Reset</button>
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
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Family Check-ins</h4>
                <p class="text-[11px] text-[var(--text-muted)] mb-2">Customize who you track. Each check-in adds points.</p>
                ${(state.familyMembers || []).map(m => `
                  <div class="flex items-center gap-2 mb-2">
                    <input type="number" inputmode="numeric" value="${state.WEIGHTS.family?.[m.id] ?? 1}" min="0" step="0.5"
                      class="input-field-sm w-16 text-center"
                      onchange="window.updateWeight('family', '${escapeHtml(m.id)}', this.value)">
                    <input type="text" value="${escapeHtml(m.name)}" placeholder="Name"
                      class="input-field-sm flex-1"
                      onchange="window.updateFamilyMember('${escapeHtml(m.id)}', this.value)">
                    <button type="button" onclick="window.removeFamilyMember('${escapeHtml(m.id)}')" class="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] rounded transition" title="Remove" aria-label="Remove ${escapeHtml(m.name)}">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                `).join('')}
                <div class="flex gap-2 mt-2">
                  <input type="text" id="new-family-member-name" placeholder="Add person..." class="input-field-sm flex-1"
                    onkeydown="if(event.key==='Enter'){event.preventDefault();window.addFamilyMember(document.getElementById('new-family-member-name').value);document.getElementById('new-family-member-name').value='';}">
                  <button type="button" onclick="const i=document.getElementById('new-family-member-name');window.addFamilyMember(i.value);i.value='';" class="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Add</button>
                </div>
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

          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-[var(--text-primary)]">Perfect Day Targets</h4>
              <button onclick="window.resetMaxScores()" class="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Reset</button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              ${['prayer', 'diabetes', 'whoop', 'family', 'habits', 'total'].map(key => `
                <div class="text-center">
                  <input type="number" inputmode="numeric" value="${state.MAX_SCORES[key]}"
                    class="input-field-sm w-full text-center ${key === 'total' ? 'border-coral' : ''}"
                    onchange="window.updateMaxScore('${key}', this.value)">
                  <div class="text-[11px] font-medium ${key === 'total' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'} mt-1">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </details>

      <!-- Data & Diagnostics -->
      <details ${state.settingsDataDiagOpen ? 'open' : ''} ontoggle="window.settingsDataDiagOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Data & Diagnostics</h3>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-4 border-t border-[var(--border-light)]">
          ${renderDataManagementSection()}
          ${renderNoteSafetySection()}
          ${renderOfflineQueueSection()}
          ${renderConflictCenterSection()}
          ${renderPerformanceSection()}
        </div>
      </details>
    </div>
  `;
}
