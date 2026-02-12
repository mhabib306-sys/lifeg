// ============================================================================
// Tracking Tab UI Module
// ============================================================================
// Renders the daily tracking form with prayer inputs, family toggles,
// glucose, whoop, habits sections and score cards.
// Revamped in v4.18.5: single-column flow, auto-synced fields as read-only.

import { state } from '../state.js';
import { getLocalDateString, fmt } from '../utils.js';
import { defaultDayData, THINGS3_ICONS, getActiveIcons } from '../constants.js';
import { calculateScores } from '../features/scoring.js';
import { getTodayData } from '../data/storage.js';
import { getAccentColor } from '../data/github-sync.js';
import { isWhoopConnected, getWhoopLastSync } from '../data/whoop-sync.js';
import { isLibreConnected, getLibreLastSync } from '../data/libre-sync.js';
import {
  createPrayerInput,
  createToggle,
  createNumberInput,
  createCounter,
  createScoreCard,
} from './input-builders.js';

/**
 * Render the daily tracking tab — single-column flow with auto-synced read-only fields.
 * @returns {string} HTML string for the tracking tab
 */
export function renderTrackingTab() {
  const data = getTodayData();
  data.prayers = data.prayers || {};
  data.glucose = data.glucose || {};
  data.whoop = data.whoop || {};
  data.family = data.family || {};
  data.habits = data.habits || {};
  const rawScores = calculateScores(data);
  const scores = {
    total: rawScores?.total ?? 0,
    prayer: rawScores?.prayer ?? 0,
    diabetes: rawScores?.diabetes ?? 0,
    whoop: rawScores?.whoop ?? 0,
    family: rawScores?.family ?? 0,
    habit: rawScores?.habit ?? 0,
    prayerOnTime: rawScores?.prayerOnTime ?? 0,
    prayerLate: rawScores?.prayerLate ?? 0
  };

  const insulinThreshold = (state.WEIGHTS.glucose && state.WEIGHTS.glucose.insulinThreshold) || 40;
  const libreSynced = isLibreConnected() && getLibreLastSync();
  const libreData = data.libre || {};
  const hasLiveGlucose = libreSynced && libreData.currentGlucose;
  const whoopSynced = isWhoopConnected() && getWhoopLastSync();

  // Color coding for live glucose
  let liveGlucoseColor = 'text-[var(--success)]';
  if (hasLiveGlucose) {
    const val = Number(libreData.currentGlucose);
    if (val > 180 || val < 70) liveGlucoseColor = 'text-[var(--danger)]';
    else if (val > 140) liveGlucoseColor = 'text-[var(--warning)]';
  }

  // Helper: read-only display value
  const readOnlyValue = (value, unit) => `
    <div class="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">
      ${value} <span class="text-xs text-[var(--text-muted)]">${unit}</span>
    </div>
    <div class="text-[10px] text-[var(--success)] mt-1 text-center">Auto-synced</div>
  `;

  return `
    <!-- Score Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      ${createScoreCard('Prayer', scores.prayer, state.MAX_SCORES.prayer, 'bg-blue-500')}
      ${createScoreCard('Diabetes', scores.diabetes, state.MAX_SCORES.diabetes, 'bg-green-500')}
      ${createScoreCard('Whoop', scores.whoop, state.MAX_SCORES.whoop, 'bg-purple-500')}
      ${createScoreCard('Family', scores.family, state.MAX_SCORES.family, 'bg-amber-500')}
      ${createScoreCard('Habits', scores.habit, state.MAX_SCORES.habits, 'bg-slate-500')}
      <div class="sb-card rounded-lg p-4 bg-[var(--bg-card)] border border-[var(--border-light)]">
        <div class="sb-section-title text-[var(--text-muted)] flex justify-between">
          <span>Total</span>
          <span>${Math.round((scores.total / state.MAX_SCORES.total) * 100)}%</span>
        </div>
        <div class="text-3xl font-bold mt-1 text-[var(--accent)]">${fmt(scores.total)}</div>
        <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full mt-2 overflow-hidden">
          <div class="h-full bg-[var(--accent)] rounded-full" style="width: ${Math.min((scores.total / state.MAX_SCORES.total) * 100, 100)}%"></div>
        </div>
      </div>
    </div>

    <!-- Single Column Flow -->
    <div class="max-w-2xl mx-auto space-y-8">

      <!-- Prayers Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">🕌</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Prayers</h3>
          <span class="text-xs text-[var(--text-muted)]">${scores.prayer} pts</span>
        </div>
        <div class="flex gap-2 mb-4">
          ${['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p =>
            createPrayerInput(p, p.charAt(0).toUpperCase() + p.slice(1), data.prayers[p])
          ).join('')}
        </div>
        <div class="border-t border-[var(--border-light)] pt-4">
          <div class="flex items-center justify-center gap-3">
            <span class="text-sm text-[var(--text-secondary)]">📖 Quran</span>
            <button onclick="updateData('prayers', 'quran', Math.max(0, ${parseInt(data.prayers.quran) || 0} - 1))"
              class="w-7 h-7 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border)] flex items-center justify-center font-bold text-[var(--text-muted)]">−</button>
            <span class="w-8 text-center font-semibold text-lg text-[var(--text-primary)]">${parseInt(data.prayers.quran) || 0}</span>
            <button onclick="updateData('prayers', 'quran', ${parseInt(data.prayers.quran) || 0} + 1)"
              class="w-7 h-7 rounded-full bg-[var(--accent)] hover:opacity-80 text-white flex items-center justify-center font-bold">+</button>
            <span class="text-xs text-[var(--text-muted)]">pages · ${(parseInt(data.prayers.quran) || 0) * 5} pts</span>
          </div>
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Glucose Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">💉</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Glucose</h3>
          ${libreSynced ? `
            <span class="inline-flex items-center gap-1 text-xs text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-2 py-0.5 rounded-full ml-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>Libre Connected
            </span>
          ` : ''}
        </div>
        ${hasLiveGlucose ? `
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-light)]">
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold ${liveGlucoseColor}">${libreData.currentGlucose}</span>
              <span class="text-base ${liveGlucoseColor}">${libreData.trend || '→'}</span>
              <span class="text-xs text-[var(--text-muted)]">mg/dL now</span>
            </div>
          </div>
        ` : ''}
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Avg Glucose</label>
            ${libreSynced && data.glucose.avg
              ? readOnlyValue(data.glucose.avg, 'mg/dL')
              : `<input type="number" step="any" value="${data.glucose.avg}" placeholder="105"
                  class="input-field w-full text-center"
                  onchange="updateData('glucose', 'avg', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">mg/dL · 105=10pts</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">TIR</label>
            ${libreSynced && data.glucose.tir
              ? readOnlyValue(data.glucose.tir, '%')
              : `<input type="number" step="any" value="${data.glucose.tir}" placeholder="70+"
                  class="input-field w-full text-center"
                  onchange="updateData('glucose', 'tir', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">% · 0.1pts/%</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Insulin</label>
            <input type="number" step="any" value="${data.glucose.insulin}" placeholder="≤${insulinThreshold}"
              class="input-field w-full text-center"
              onchange="updateData('glucose', 'insulin', this.value)">
            <div class="text-xs text-[var(--text-muted)] mt-1 text-center">units · ≤${insulinThreshold}=+5</div>
          </div>
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Whoop Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">⏱️</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Whoop</h3>
          ${whoopSynced ? `
            <span class="inline-flex items-center gap-1 text-xs text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-2 py-0.5 rounded-full ml-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>Auto-synced
            </span>
          ` : ''}
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Sleep Perf</label>
            ${whoopSynced && data.whoop.sleepPerf
              ? readOnlyValue(data.whoop.sleepPerf, '%')
              : `<input type="number" step="any" value="${data.whoop.sleepPerf}" placeholder="≥90"
                  class="input-field w-full text-center"
                  onchange="updateData('whoop', 'sleepPerf', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">% · ≥90%</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Recovery</label>
            ${whoopSynced && data.whoop.recovery
              ? readOnlyValue(data.whoop.recovery, '%')
              : `<input type="number" step="any" value="${data.whoop.recovery}" placeholder="≥66"
                  class="input-field w-full text-center"
                  onchange="updateData('whoop', 'recovery', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">% · ≥66%</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Strain</label>
            ${whoopSynced && data.whoop.strain
              ? readOnlyValue(data.whoop.strain, '/21')
              : `<input type="number" step="any" value="${data.whoop.strain}" placeholder="10-14"
                  class="input-field w-full text-center"
                  onchange="updateData('whoop', 'strain', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">/21 · match recovery</div>`}
          </div>
        </div>
        <!-- Whoop Age (always manual) -->
        <div class="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
          <span class="text-sm font-medium text-[var(--text-primary)]">Whoop Age</span>
          <div class="flex items-center gap-2">
            <input type="number" step="0.1" value="${data.whoop.whoopAge || ''}" placeholder="—"
              class="input-field w-16 text-center font-bold text-[var(--accent)]"
              onchange="updateData('whoop', 'whoopAge', this.value)">
            <span class="text-xs text-[var(--text-muted)]">yrs</span>
          </div>
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Family Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">👨‍👩‍👧‍👦</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Family Check-ins</h3>
          <span class="text-xs text-[var(--text-muted)]">${Object.values(data.family).filter(Boolean).length}/6</span>
        </div>
        <div class="space-y-0.5">
          ${['mom', 'dad', 'jana', 'tia', 'ahmed', 'eman'].map(p =>
            createToggle(p.charAt(0).toUpperCase() + p.slice(1), data.family[p], 'family', p)
          ).join('')}
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Habits Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">✨</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Habits</h3>
        </div>
        <div class="space-y-1">
          ${createCounter('🏋️ Exercise', data.habits.exercise || 0, 'habits', 'exercise', 5)}
          ${createCounter('📚 Reading', data.habits.reading || 0, 'habits', 'reading', 5)}
          ${createCounter('🧘 Meditation', data.habits.meditation || 0, 'habits', 'meditation', 5)}
          ${createCounter('🦷 Brush Teeth', data.habits.brushTeeth || 0, 'habits', 'brushTeeth', 3)}
          ${createToggle('💊 Vitamins taken', data.habits.vitamins, 'habits', 'vitamins')}
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border-light)]">
          <div class="text-center">
            <input type="number" step="any" value="${data.habits.water}" placeholder="2.5"
              class="input-field w-full text-center mb-1"
              onchange="updateData('habits', 'water', this.value)">
            <div class="text-xs font-medium text-[var(--text-secondary)]">💧 Water</div>
            <div class="text-xs text-[var(--text-muted)]">L · 1pt/L</div>
          </div>
          <div class="text-center">
            <input type="number" step="1" value="${data.habits.nop}" placeholder="0-1"
              class="input-field w-full text-center mb-1"
              onchange="updateData('habits', 'nop', this.value)">
            <div class="text-xs font-medium text-[var(--text-secondary)]">💤 NoP</div>
            <div class="text-xs text-[var(--text-muted)]">1=+2, 0=-2</div>
          </div>
        </div>
      </section>

    </div>
  `;
}
