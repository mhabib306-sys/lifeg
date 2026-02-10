// ============================================================================
// SETTINGS TAB UI MODULE
// ============================================================================
// Renders the Settings tab: scoring weights, perfect day targets,
// theme selector, cloud sync, data management, and changelog.

import { state } from '../state.js';
import { THEMES } from '../constants.js';
import { getGithubToken, setGithubToken, getTheme, setTheme } from '../data/github-sync.js';
import { updateWeight, resetWeights, updateMaxScore, resetMaxScores } from '../features/scoring.js';
import {
  isWhoopConnected, getWhoopWorkerUrl, getWhoopApiKey, getWhoopLastSync
} from '../data/whoop-sync.js';
import { getAnthropicKey } from '../features/braindump.js';
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
      <h3 class="font-semibold text-charcoal mb-4">WHOOP Integration <span class="text-coral">→</span></h3>
      <p class="text-sm text-charcoal/50 mb-4">Auto-sync sleep performance, recovery, and strain from your WHOOP account.</p>

      <div class="space-y-3 mb-4">
        <div>
          <label class="text-sm text-charcoal/70 block mb-1">Worker URL</label>
          <input type="url" value="${workerUrl}" placeholder="https://whoop-proxy.xxx.workers.dev"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none"
            onchange="window.setWhoopWorkerUrl(this.value)">
        </div>
        <div>
          <label class="text-sm text-charcoal/70 block mb-1">API Key</label>
          <input type="password" value="${apiKey}" placeholder="Shared secret from worker setup"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none"
            onchange="window.setWhoopApiKey(this.value)">
        </div>
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-softborder">
        ${connected ? `
          <button onclick="window.syncWhoopNow()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Sync Now
          </button>
          <button onclick="window.disconnectWhoop(); window.render()" class="px-4 py-2 bg-warmgray text-charcoal rounded-lg text-sm font-medium hover:bg-softborder transition">
            Disconnect
          </button>
          <span class="flex items-center text-xs text-charcoal/50">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected · Last sync: ${lastSyncText}
          </span>
        ` : `
          <button onclick="window.connectWhoop()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>
            Connect WHOOP
          </button>
          <button onclick="window.checkWhoopStatus()" class="px-4 py-2 bg-warmgray text-charcoal rounded-lg text-sm font-medium hover:bg-softborder transition ${hasConfig ? '' : 'opacity-50 cursor-not-allowed'}" ${hasConfig ? '' : 'disabled'}>
            Check Status
          </button>
          <span class="flex items-center text-xs text-charcoal/50">
            <span class="w-2 h-2 rounded-full bg-charcoal/30 mr-2"></span> Not connected
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
        <h3 class="font-semibold text-charcoal mb-4">Google Calendar <span class="text-coral">→</span></h3>
        <p class="text-sm text-charcoal/50 mb-4">See Google Calendar events in the Calendar view and push dated tasks to Google Calendar.</p>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-softborder">
          <button onclick="window.connectGCal()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Connect Google Calendar
          </button>
          <span class="flex items-center text-xs text-charcoal/50">
            <span class="w-2 h-2 rounded-full bg-charcoal/30 mr-2"></span> Not connected
          </span>
        </div>
      </div>
    `;
  }

  if (tokenExpired) {
    return `
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Google Calendar <span class="text-coral">→</span></h3>
        <p class="text-sm text-charcoal/50 mb-4">Your Google Calendar session has expired. Reconnect to resume syncing.</p>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-softborder">
          <button onclick="window.reconnectGCal()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
            Reconnect
          </button>
          <button onclick="window.disconnectGCal()" class="px-4 py-2 bg-warmgray text-charcoal rounded-lg text-sm font-medium hover:bg-softborder transition">
            Disconnect
          </button>
          <span class="flex items-center text-xs text-charcoal/50">
            <span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span> Session expired
          </span>
        </div>
      </div>
    `;
  }

  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-charcoal mb-4">Google Calendar <span class="text-coral">→</span></h3>
      <p class="text-sm text-charcoal/50 mb-4">Select calendars to show events from and choose which calendar to push tasks to.</p>

      ${calendarsLoading ? `
        <p class="text-sm text-charcoal/40 mb-4">Loading calendars...</p>
      ` : gcalError ? `
        <div class="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p class="text-sm text-amber-800">${gcalError}</p>
          ${gcalErrorUrl ? `
            <a href="${gcalErrorUrl}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-flex text-xs font-medium text-amber-900 underline hover:text-amber-700">Open API setup in Google Cloud</a>
          ` : ''}
          <button onclick="window.fetchCalendarList()" class="mt-2 px-3 py-1.5 bg-white border border-amber-300 rounded text-xs font-medium text-amber-800 hover:bg-amber-100 transition">
            Retry loading calendars
          </button>
        </div>
      ` : calendars.length > 0 ? `
        <div class="mb-4">
          <label class="text-sm text-charcoal/70 block mb-2">Show events from:</label>
          <div class="space-y-1.5 max-h-40 overflow-y-auto">
            ${calendars.map(c => `
              <label class="flex items-center gap-2 px-2 py-1 rounded hover:bg-warmgray cursor-pointer">
                <input type="checkbox" ${selected.includes(c.id) ? 'checked' : ''}
                  onchange="window.toggleCalendarSelection('${c.id.replace(/'/g, "\\'")}')"
                  class="rounded text-coral focus:ring-coral">
                <span class="w-3 h-3 rounded-full flex-shrink-0" style="background: ${c.backgroundColor}"></span>
                <span class="text-sm text-charcoal truncate">${c.summary}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm text-charcoal/70 block mb-2">Push tasks to:</label>
          <select onchange="window.setTargetCalendar(this.value); window.render()"
            class="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
            ${writableCalendars.map(c => `
              <option value="${c.id}" ${c.id === targetCal ? 'selected' : ''}>${c.summary}</option>
            `).join('')}
          </select>
        </div>
      ` : '<p class="text-sm text-charcoal/40 mb-4">No calendars found for this account.</p>'}

      <div class="mb-4 p-3 rounded-lg bg-warmgray/25 border border-softborder">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-charcoal">People Sync From Google Contacts</p>
            <p class="text-xs text-charcoal/50 mt-1">Auto sync runs in background. Last sync: ${contactsLastSyncText}</p>
          </div>
          <button onclick="window.syncGoogleContactsNow()" class="px-3 py-1.5 bg-white border border-softborder rounded text-xs font-medium text-charcoal hover:bg-warmgray transition ${state.gcontactsSyncing ? 'opacity-60 cursor-not-allowed' : ''}" ${state.gcontactsSyncing ? 'disabled' : ''}>
            ${state.gcontactsSyncing ? 'Syncing...' : 'Sync Contacts'}
          </button>
        </div>
        ${state.gcontactsError ? `
          <p class="text-xs text-amber-700 mt-2">${state.gcontactsError}</p>
        ` : ''}
      </div>

      <div class="flex flex-wrap gap-3 pt-4 border-t border-softborder">
        <button onclick="window.syncGCalNow()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition">
          Sync Now
        </button>
        <button onclick="window.disconnectGCal()" class="px-4 py-2 bg-warmgray text-charcoal rounded-lg text-sm font-medium hover:bg-softborder transition">
          Disconnect
        </button>
        <span class="flex items-center text-xs text-charcoal/50">
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
      <h3 class="font-semibold text-charcoal mb-4">AI Classification <span class="text-coral">→</span></h3>
      <p class="text-sm text-charcoal/50 mb-4">Use Claude AI to split/classify Braindump text and power voice-mode processing with the same key. Without an API key, the heuristic classifier is used and voice mode may be limited by browser support.</p>

      <div class="mb-4">
        <label class="text-sm text-charcoal/70 block mb-2">Anthropic API Key</label>
        <div class="flex gap-2">
          <input type="password" id="anthropic-key-input" value="${apiKey}"
            placeholder="sk-ant-..."
            class="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
          <button onclick="window.setAnthropicKey(document.getElementById('anthropic-key-input').value); window.render()"
            class="sb-btn px-4 py-2 rounded text-sm font-medium">
            Save Key
          </button>
        </div>
        <p class="text-xs text-charcoal/40 mt-2">
          Create an API key at
          <a href="https://console.anthropic.com/settings/keys" target="_blank" class="sb-link">console.anthropic.com</a>.
          Uses Claude Haiku 4.5 for fast, low-cost classification.
        </p>
      </div>

      <div class="flex items-center gap-2 pt-3 border-t border-softborder">
        <span class="w-2 h-2 rounded-full ${hasKey ? 'bg-green-500' : 'bg-charcoal/30'}"></span>
        <span class="text-xs text-charcoal/50">${hasKey ? 'Configured — AI classification active' : 'Not configured — using heuristic classifier'}</span>
      </div>
    </div>
  `;
}

function renderOfflineQueueCard() {
  const queue = window.getGCalOfflineQueue?.() || [];
  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-charcoal mb-4">Offline Queue <span class="text-coral">→</span></h3>
      <p class="text-sm text-charcoal/50 mb-4">Google Calendar write actions queued while offline or failing token/network checks.</p>
      <div class="flex flex-wrap gap-2 mb-3">
        <button onclick="window.retryGCalOfflineQueue()" class="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-semibold hover:bg-coralDark transition ${queue.length ? '' : 'opacity-50 cursor-not-allowed'}" ${queue.length ? '' : 'disabled'}>Retry All</button>
        <button onclick="window.clearGCalOfflineQueue()" class="px-3 py-1.5 bg-warmgray text-charcoal rounded-lg text-xs font-semibold hover:bg-softborder transition ${queue.length ? '' : 'opacity-50 cursor-not-allowed'}" ${queue.length ? '' : 'disabled'}>Clear</button>
        <span class="text-xs text-charcoal/50 flex items-center">${queue.length} queued</span>
      </div>
      <div class="space-y-2 max-h-56 overflow-auto">
        ${queue.length ? queue.map(item => `
          <div class="px-3 py-2 rounded-lg bg-warmgray border border-softborder flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-charcoal">${item.type}</p>
              <p class="text-[11px] text-charcoal/50">${new Date(item.createdAt).toLocaleString()}</p>
              ${item.lastError ? `<p class="text-[11px] text-amber-700 mt-0.5">${item.lastError}</p>` : ''}
            </div>
            <button onclick="window.removeGCalOfflineQueueItem('${item.id}')" class="text-xs px-2 py-1 rounded bg-white border border-softborder text-charcoal/70 hover:text-charcoal">Remove</button>
          </div>
        `).join('') : '<p class="text-sm text-charcoal/40">Queue is empty.</p>'}
      </div>
    </div>
  `;
}

function renderConflictCenterCard() {
  const conflicts = state.conflictNotifications || [];
  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-charcoal mb-4">Conflict Center <span class="text-coral">→</span></h3>
      <p class="text-sm text-charcoal/50 mb-4">Notifications created when cloud/local payloads require conflict policy decisions.</p>
      <div class="flex items-center gap-2 mb-3">
        <button onclick="window.clearConflictNotifications()" class="px-3 py-1.5 bg-warmgray text-charcoal rounded-lg text-xs font-semibold hover:bg-softborder transition ${conflicts.length ? '' : 'opacity-50 cursor-not-allowed'}" ${conflicts.length ? '' : 'disabled'}>Clear All</button>
        <span class="text-xs text-charcoal/50">${conflicts.length} items</span>
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
        `).join('') : '<p class="text-sm text-charcoal/40">No conflicts logged.</p>'}
      </div>
    </div>
  `;
}

function renderPerformanceCard() {
  const perf = state.renderPerf || { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
  return `
    <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
      <h3 class="font-semibold text-charcoal mb-4">Client Profiling <span class="text-coral">→</span></h3>
      <p class="text-sm text-charcoal/50 mb-4">Lightweight render metrics sampled in-browser.</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div class="p-3 rounded-lg bg-warmgray border border-softborder">
          <div class="text-xs text-charcoal/50">Last Render</div>
          <div class="text-lg font-semibold text-charcoal">${perf.lastMs} ms</div>
        </div>
        <div class="p-3 rounded-lg bg-warmgray border border-softborder">
          <div class="text-xs text-charcoal/50">Average</div>
          <div class="text-lg font-semibold text-charcoal">${perf.avgMs} ms</div>
        </div>
        <div class="p-3 rounded-lg bg-warmgray border border-softborder">
          <div class="text-xs text-charcoal/50">Max</div>
          <div class="text-lg font-semibold text-charcoal">${perf.maxMs} ms</div>
        </div>
        <div class="p-3 rounded-lg bg-warmgray border border-softborder">
          <div class="text-xs text-charcoal/50">Samples</div>
          <div class="text-lg font-semibold text-charcoal">${perf.count}</div>
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
  return `
    <div class="space-y-8">
      ${user ? `
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Account <span class="text-coral">→</span></h3>
        <div class="flex items-center gap-4">
          ${user.photoURL
            ? `<img src="${user.photoURL}" alt="" class="w-12 h-12 rounded-full border border-[var(--border)]" referrerpolicy="no-referrer">`
            : `<div class="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-lg font-semibold">${(user.displayName || user.email || '?')[0].toUpperCase()}</div>`
          }
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[var(--text-primary)] truncate">${user.displayName || 'User'}</p>
            <p class="text-sm text-[var(--text-muted)] truncate">${user.email || ''}</p>
          </div>
          <button onclick="signOutUser()" class="px-4 py-2 bg-warmgray text-charcoal rounded-lg text-sm font-medium hover:bg-softborder transition">
            Sign Out
          </button>
        </div>
      </div>
      ` : ''}

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-charcoal">Scoring Weights <span class="text-coral">→</span></h3>
          <button onclick="window.resetWeights()" class="px-4 py-2 bg-coral/10 text-coral rounded-lg text-sm font-medium hover:bg-coral/20 transition">
            Reset to Defaults
          </button>
        </div>
        <p class="text-sm text-charcoal/50 mb-6">Adjust the point values for each activity. Changes apply immediately.</p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 1. Prayer Weights -->
          <div class="bg-warmgray rounded-lg p-4 border border-softborder">
            <h4 class="sb-section-title text-charcoal/70 mb-3">🕌 Prayer</h4>
            ${createWeightInput('On-time prayer', state.WEIGHTS.prayer.onTime, 'prayer', 'onTime')}
            ${createWeightInput('Late prayer', state.WEIGHTS.prayer.late, 'prayer', 'late')}
            ${createWeightInput('Quran (per page)', state.WEIGHTS.prayer.quran, 'prayer', 'quran')}
          </div>

          <!-- 2. Diabetes Weights -->
          <div class="bg-warmgray rounded-lg p-4 border border-softborder">
            <h4 class="sb-section-title text-charcoal/70 mb-3">💉 Glucose (Libre)</h4>
            ${createWeightInput('Avg Glucose max pts (at 105)', state.WEIGHTS.glucose.avgMax, 'glucose', 'avgMax')}
            ${createWeightInput('TIR pts per %', state.WEIGHTS.glucose.tirPerPoint, 'glucose', 'tirPerPoint')}
            ${createWeightInput('Insulin threshold (units)', state.WEIGHTS.glucose.insulinThreshold, 'glucose', 'insulinThreshold')}
            ${createWeightInput('Insulin ≤threshold bonus', state.WEIGHTS.glucose.insulinBase, 'glucose', 'insulinBase')}
            ${createWeightInput('Insulin >threshold penalty', state.WEIGHTS.glucose.insulinPenalty, 'glucose', 'insulinPenalty')}
          </div>

          <!-- 3. Whoop Weights -->
          <div class="bg-warmgray rounded-lg p-4 border border-softborder">
            <h4 class="sb-section-title text-charcoal/70 mb-3">⏱️ Whoop</h4>
            <div class="text-xs text-coral font-medium mb-2">Sleep Performance</div>
            ${createWeightInput('Sleep Perf ≥90%', state.WEIGHTS.whoop.sleepPerfHigh, 'whoop', 'sleepPerfHigh')}
            ${createWeightInput('Sleep Perf 70-90%', state.WEIGHTS.whoop.sleepPerfMid, 'whoop', 'sleepPerfMid')}
            ${createWeightInput('Sleep Perf 50-70%', state.WEIGHTS.whoop.sleepPerfLow, 'whoop', 'sleepPerfLow')}
            <div class="text-xs text-coral font-medium mb-2 mt-3">Recovery & Strain</div>
            ${createWeightInput('Recovery ≥66%', state.WEIGHTS.whoop.recoveryHigh, 'whoop', 'recoveryHigh')}
            ${createWeightInput('Recovery 50-66%', state.WEIGHTS.whoop.recoveryMid, 'whoop', 'recoveryMid')}
            ${createWeightInput('Recovery 33-50%', state.WEIGHTS.whoop.recoveryLow, 'whoop', 'recoveryLow')}
            ${createWeightInput('Strain matches recovery', state.WEIGHTS.whoop.strainMatch, 'whoop', 'strainMatch')}
            ${createWeightInput('High strain on green day', state.WEIGHTS.whoop.strainHigh, 'whoop', 'strainHigh')}
          </div>

          <!-- 4. Family Weights -->
          <div class="bg-warmgray rounded-lg p-4 border border-softborder">
            <h4 class="sb-section-title text-charcoal/70 mb-3">👨‍👩‍👧‍👦 Family</h4>
            ${createWeightInput('Mom', state.WEIGHTS.family.mom, 'family', 'mom')}
            ${createWeightInput('Dad', state.WEIGHTS.family.dad, 'family', 'dad')}
            ${createWeightInput('Jana', state.WEIGHTS.family.jana, 'family', 'jana')}
            ${createWeightInput('Tia', state.WEIGHTS.family.tia, 'family', 'tia')}
            ${createWeightInput('Ahmed', state.WEIGHTS.family.ahmed, 'family', 'ahmed')}
            ${createWeightInput('Eman', state.WEIGHTS.family.eman, 'family', 'eman')}
          </div>

          <!-- 5. Habits Weights -->
          <div class="bg-warmgray rounded-lg p-4 border border-softborder">
            <h4 class="sb-section-title text-charcoal/70 mb-3">✨ Habits</h4>
            ${createWeightInput('Exercise', state.WEIGHTS.habits.exercise, 'habits', 'exercise')}
            ${createWeightInput('Reading', state.WEIGHTS.habits.reading, 'habits', 'reading')}
            ${createWeightInput('Meditation', state.WEIGHTS.habits.meditation, 'habits', 'meditation')}
            ${createWeightInput('Water (per L)', state.WEIGHTS.habits.water, 'habits', 'water')}
            ${createWeightInput('Vitamins', state.WEIGHTS.habits.vitamins, 'habits', 'vitamins')}
            ${createWeightInput('Brush Teeth', state.WEIGHTS.habits.brushTeeth, 'habits', 'brushTeeth')}
            ${createWeightInput('NoP = 1 (bonus)', state.WEIGHTS.habits.nopYes, 'habits', 'nopYes')}
            ${createWeightInput('NoP = 0 (penalty)', state.WEIGHTS.habits.nopNo, 'habits', 'nopNo')}
          </div>
        </div>
      </div>

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-charcoal">Perfect Day Targets <span class="text-coral">→</span></h3>
          <button onclick="window.resetMaxScores()" class="px-4 py-2 bg-coral/10 text-coral rounded-lg text-sm font-medium hover:bg-coral/20 transition">
            Reset to Defaults
          </button>
        </div>
        <p class="text-sm text-charcoal/50 mb-6">Define what a "perfect day" looks like for each category. Progress bars show % of these targets.</p>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="text-center">
            <input type="number" value="${state.MAX_SCORES.prayer}"
              class="w-full px-3 py-2 border border-[var(--border)] rounded text-center text-lg bg-[var(--bg-input)] mb-1"
              onchange="window.updateMaxScore('prayer', this.value)">
            <div class="text-xs font-medium text-charcoal/70">Prayer</div>
            <div class="text-xs text-charcoal/40">5×5 + quran</div>
          </div>
          <div class="text-center">
            <input type="number" value="${state.MAX_SCORES.diabetes}"
              class="w-full px-3 py-2 border border-[var(--border)] rounded text-center text-lg bg-[var(--bg-input)] mb-1"
              onchange="window.updateMaxScore('diabetes', this.value)">
            <div class="text-xs font-medium text-charcoal/70">Diabetes</div>
            <div class="text-xs text-charcoal/40">avg+tir+ins</div>
          </div>
          <div class="text-center">
            <input type="number" value="${state.MAX_SCORES.whoop}"
              class="w-full px-3 py-2 border border-[var(--border)] rounded text-center text-lg bg-[var(--bg-input)] mb-1"
              onchange="window.updateMaxScore('whoop', this.value)">
            <div class="text-xs font-medium text-charcoal/70">Whoop</div>
            <div class="text-xs text-charcoal/40">all optimal</div>
          </div>
          <div class="text-center">
            <input type="number" value="${state.MAX_SCORES.family}"
              class="w-full px-3 py-2 border border-[var(--border)] rounded text-center text-lg bg-[var(--bg-input)] mb-1"
              onchange="window.updateMaxScore('family', this.value)">
            <div class="text-xs font-medium text-charcoal/70">Family</div>
            <div class="text-xs text-charcoal/40">all checked</div>
          </div>
          <div class="text-center">
            <input type="number" value="${state.MAX_SCORES.habits}"
              class="w-full px-3 py-2 border border-[var(--border)] rounded text-center text-lg bg-[var(--bg-input)] mb-1"
              onchange="window.updateMaxScore('habits', this.value)">
            <div class="text-xs font-medium text-charcoal/70">Habits</div>
            <div class="text-xs text-charcoal/40">all done</div>
          </div>
          <div class="text-center">
            <input type="number" value="${state.MAX_SCORES.total}"
              class="w-full px-3 py-2 border border-[var(--border)] rounded text-center text-lg bg-[var(--bg-input)] mb-1 border-coral"
              onchange="window.updateMaxScore('total', this.value)">
            <div class="text-xs font-medium text-coral">Total</div>
            <div class="text-xs text-charcoal/40">sum of all</div>
          </div>
        </div>
      </div>

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Theme <span class="text-coral">→</span></h3>
        <p class="text-sm text-charcoal/50 mb-4">Choose your preferred visual style. Changes apply immediately.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Object.entries(THEMES).map(([key, theme]) => `
            <button onclick="window.setTheme('${key}')"
              class="p-4 rounded-lg border-2 text-left transition-all ${getTheme() === key ? 'border-coral bg-coral/5' : 'border-softborder hover:border-coral/50'}">
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold text-charcoal">${theme.name}</span>
                ${getTheme() === key ? '<span class="text-xs bg-coral text-white px-2 py-0.5 rounded-full">Active</span>' : ''}
              </div>
              <p class="text-sm text-charcoal/50">${theme.description}</p>
              <div class="flex gap-2 mt-3">
                ${key === 'simplebits' ? `
                  <div class="w-6 h-6 rounded-full bg-[#F7F6F4] border border-[var(--border)]" title="Background"></div>
                  <div class="w-6 h-6 rounded-full bg-[#EFEDE8] border border-[var(--border)]" title="Card"></div>
                  <div class="w-6 h-6 rounded-full bg-[#E5533D]" title="Accent"></div>
                  <div class="w-6 h-6 rounded-full bg-[#1a1a1a]" title="Text"></div>
                ` : `
                  <div class="w-6 h-6 rounded-full bg-[#FFFFFF] border border-[var(--border)]" title="Background"></div>
                  <div class="w-6 h-6 rounded-full bg-[#F5F5F7] border border-[var(--border)]" title="Card"></div>
                  <div class="w-6 h-6 rounded-full bg-[#147EFB]" title="Accent"></div>
                  <div class="w-6 h-6 rounded-full bg-[#1D1D1F]" title="Text"></div>
                `}
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Cloud Sync <span class="text-coral">→</span></h3>
        <p class="text-sm text-charcoal/50 mb-4">Enable automatic sync to GitHub. Your data will be saved to the cloud on every change.</p>

        <div class="mb-4">
          <label class="text-sm text-charcoal/70 block mb-2">GitHub Personal Access Token</label>
          <div class="flex gap-2">
            <input type="password" id="github-token-input" value="${getGithubToken()}"
              placeholder="ghp_xxxx or github_pat_xxxx"
              class="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] focus:outline-none">
            <button onclick="window.setGithubToken(document.getElementById('github-token-input').value)"
              class="sb-btn px-4 py-2 rounded text-sm font-medium">
              Save Token
            </button>
          </div>
          <p class="text-xs text-charcoal/40 mt-2">
            Token needs <code class="bg-warmgray px-1 rounded">repo</code> scope. Create at
            <a href="https://github.com/settings/tokens" target="_blank" class="sb-link">github.com/settings/tokens</a>
          </p>
        </div>

        <div class="flex flex-wrap gap-3 pt-4 border-t border-softborder">
          <button onclick="window.saveToGithub()" class="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coralDark transition ${getGithubToken() ? '' : 'opacity-50 cursor-not-allowed'}" ${getGithubToken() ? '' : 'disabled'}>
            Sync Now
          </button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-4 py-2 bg-warmgray text-charcoal rounded-lg text-sm font-medium hover:bg-softborder transition">
            Pull from Cloud
          </button>
          <span class="flex items-center text-xs text-charcoal/50">
            ${getGithubToken() ? '<span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Connected' : '<span class="w-2 h-2 rounded-full bg-charcoal/30 mr-2"></span> Not connected'}
          </span>
        </div>
      </div>

      ${renderWhoopSettingsCard()}

      ${renderGCalSettingsCard()}

      ${renderOfflineQueueCard()}

      ${renderConflictCenterCard()}

      ${renderPerformanceCard()}

      ${renderAIClassificationCard()}

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Data Management <span class="text-coral">→</span></h3>
        <div class="flex flex-wrap gap-3">
          <button onclick="window.exportData()" class="sb-btn px-4 py-2 rounded text-sm font-medium">
            Export All Data
          </button>
          <label class="sb-btn px-4 py-2 rounded text-sm font-medium cursor-pointer">
            Import Data
            <input type="file" accept=".json" class="hidden" onchange="window.importData(event)">
          </label>
          <button onclick="window.forceHardRefresh()" class="px-4 py-2 bg-coral/10 text-coral rounded-lg text-sm font-medium hover:bg-coral/20 transition">
            Force Refresh
          </button>
        </div>
        <p class="text-xs text-charcoal/40 mt-3">
          Export creates a local backup JSON file. Import merges data from a backup file. Force Refresh clears the app cache and reloads — useful when updates aren't showing on mobile.
        </p>
      </div>

      <!-- Changelog -->
      <div class="sb-card rounded-xl p-6 bg-[var(--bg-card)]">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-semibold text-charcoal">Changelog <span class="text-coral">→</span></h3>
            <p class="text-sm text-charcoal/50 mt-1">Version history and updates</p>
          </div>
          <span class="px-3 py-1 bg-coral text-white text-sm font-semibold rounded-full">v3.2.0</span>
        </div>

        <div class="space-y-6">
          <!-- v3.2.0 -->
          <div class="border-l-2 border-coral pl-4">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-semibold text-charcoal">v3.2.0</span>
              <span class="text-xs text-charcoal/40">February 2026</span>
              <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-medium rounded">Latest</span>
            </div>
            <ul class="text-sm text-charcoal/70 space-y-1.5">
              <li class="flex items-start gap-2"><span class="text-coral mt-0.5">•</span> Mobile-responsive design for iPhone Pro Max</li>
              <li class="flex items-start gap-2"><span class="text-coral mt-0.5">•</span> Redesigned sidebar with improved alignment & spacing</li>
              <li class="flex items-start gap-2"><span class="text-coral mt-0.5">•</span> Minimal drag indicator on right side of tasks</li>
              <li class="flex items-start gap-2"><span class="text-coral mt-0.5">•</span> Cleaner task item design with icon-based actions</li>
              <li class="flex items-start gap-2"><span class="text-coral mt-0.5">•</span> Header/nav/body width consistency across all tabs</li>
            </ul>
          </div>

          <!-- v3.1.0 -->
          <div class="border-l-2 border-charcoal/20 pl-4">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-semibold text-charcoal">v3.1.0</span>
              <span class="text-xs text-charcoal/40">January 2026</span>
            </div>
            <ul class="text-sm text-charcoal/70 space-y-1.5">
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Things 3 exact icons and colors</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Inter font (closest to SF Pro)</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> View state persistence (stays on same page after refresh)</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Renamed Categories to Areas (Things 3 terminology)</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Plus icon buttons instead of "Add" text</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Colored sidebar perspective icons</li>
            </ul>
          </div>

          <!-- v3.0.0 -->
          <div class="border-l-2 border-charcoal/20 pl-4">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-semibold text-charcoal">v3.0.0</span>
              <span class="text-xs text-charcoal/40">December 2025</span>
            </div>
            <ul class="text-sm text-charcoal/70 space-y-1.5">
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Complete UI overhaul with Things 3 theme</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Theme switcher (SimpleBits / Things 3)</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Tasks system with perspectives, areas, and labels</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Drag and drop task reordering</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> GitHub cloud sync</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Dashboard with charts and analytics</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Bulk entry tab for quick data input</li>
            </ul>
          </div>

          <!-- v2.0.0 -->
          <div class="border-l-2 border-charcoal/20 pl-4">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-semibold text-charcoal">v2.0.0</span>
              <span class="text-xs text-charcoal/40">November 2025</span>
            </div>
            <ul class="text-sm text-charcoal/70 space-y-1.5">
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Gamification system with points and scoring</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Customizable weight settings</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Prayer, glucose, whoop, family, habits tracking</li>
            </ul>
          </div>

          <!-- v1.0.0 -->
          <div class="border-l-2 border-charcoal/20 pl-4">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-semibold text-charcoal">v1.0.0</span>
              <span class="text-xs text-charcoal/40">October 2025</span>
            </div>
            <ul class="text-sm text-charcoal/70 space-y-1.5">
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Initial release</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Basic daily tracking interface</li>
              <li class="flex items-start gap-2"><span class="text-charcoal/30 mt-0.5">•</span> Local storage persistence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
