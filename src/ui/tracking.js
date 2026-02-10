// ============================================================================
// Tracking Tab UI Module
// ============================================================================
// Renders the daily tracking form with prayer inputs, family toggles,
// glucose, whoop, habits sections and score cards.

import { state } from '../state.js';
import { getLocalDateString, fmt } from '../utils.js';
import { defaultDayData, THINGS3_ICONS } from '../constants.js';
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
  createCard
} from './input-builders.js';

/**
 * Render the daily tracking tab with prayer inputs, glucose, whoop,
 * family check-ins, habits, and today's summary.
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

  const prayerHelp = `<span class="text-xs text-charcoal/50">X.Y = X on-time + Y late</span>`;
  const prayersContent = `
    <div class="flex gap-2 mb-4">
      ${['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p =>
        createPrayerInput(p, p.charAt(0).toUpperCase() + p.slice(1), data.prayers[p])
      ).join('')}
    </div>
    <div class="border-t border-softborder pt-4">
      <div class="flex items-center justify-center gap-3">
        <span class="text-sm text-charcoal/70">📖 Quran</span>
        <button onclick="updateData('prayers', 'quran', Math.max(0, ${parseInt(data.prayers.quran) || 0} - 1))"
          class="w-7 h-7 rounded-full bg-warmgray hover:bg-softborder flex items-center justify-center font-bold text-charcoal/60">−</button>
        <span class="w-8 text-center font-semibold text-lg">${parseInt(data.prayers.quran) || 0}</span>
        <button onclick="updateData('prayers', 'quran', ${parseInt(data.prayers.quran) || 0} + 1)"
          class="w-7 h-7 rounded-full bg-coral hover:bg-coralDark text-white flex items-center justify-center font-bold">+</button>
        <span class="text-xs text-charcoal/50">pages · ${(parseInt(data.prayers.quran) || 0) * 5} pts</span>
      </div>
    </div>
  `;

  const insulinThreshold = (state.WEIGHTS.glucose && state.WEIGHTS.glucose.insulinThreshold) || 40;
  const libreSynced = isLibreConnected() && getLibreLastSync();
  const libreData = data.libre || {};
  const hasLiveGlucose = libreSynced && libreData.currentGlucose;

  // Color coding for live glucose
  let liveGlucoseColor = 'text-green-600';
  if (hasLiveGlucose) {
    const val = Number(libreData.currentGlucose);
    if (val > 180 || val < 70) liveGlucoseColor = 'text-red-600';
    else if (val > 140) liveGlucoseColor = 'text-amber-600';
  }

  const glucoseContent = `
    ${hasLiveGlucose ? `
      <div class="flex items-center justify-between mb-3 pb-3 border-b border-softborder">
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold ${liveGlucoseColor}">${libreData.currentGlucose}</span>
          <span class="text-base ${liveGlucoseColor}">${libreData.trend || '→'}</span>
          <span class="text-xs text-charcoal/50">mg/dL now</span>
        </div>
        <span class="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Libre
        </span>
      </div>
    ` : ''}
    <div class="flex gap-3">
      ${libreSynced && data.glucose.avg
        ? `<div class="flex-1 text-center">
            <label class="block text-xs font-medium text-charcoal/60 mb-1">Avg Glucose</label>
            <div class="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)]">${data.glucose.avg} <span class="text-xs text-charcoal/40">mg/dL</span></div>
            <div class="text-[10px] text-green-600 mt-1">Auto-synced</div>
          </div>`
        : createNumberInput('Avg Glucose', data.glucose.avg, 'glucose', 'avg', '105', 'mg/dL', '105=10pts')}
      ${libreSynced && data.glucose.tir
        ? `<div class="flex-1 text-center">
            <label class="block text-xs font-medium text-charcoal/60 mb-1">TIR</label>
            <div class="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)]">${data.glucose.tir} <span class="text-xs text-charcoal/40">%</span></div>
            <div class="text-[10px] text-green-600 mt-1">Auto-synced</div>
          </div>`
        : createNumberInput('TIR', data.glucose.tir, 'glucose', 'tir', '70+', '%', '0.1pts/%')}
      ${createNumberInput('Insulin', data.glucose.insulin, 'glucose', 'insulin', '≤' + insulinThreshold, 'units', '≤' + insulinThreshold + '=+5')}
    </div>
  `;

  const whoopSynced = isWhoopConnected() && getWhoopLastSync();
  const whoopHelp = whoopSynced
    ? `<span class="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Auto-synced</span>`
    : `<span class="text-xs text-charcoal/50">Hover ⓘ for tips</span>`;
  const whoopContent = `
    <div class="grid grid-cols-3 gap-3">
      ${createNumberInput('Sleep Perf', data.whoop.sleepPerf, 'whoop', 'sleepPerf', '≥90', '%', '≥90%', '<b>How to improve:</b><br>• Consistent bedtime/wake time<br>• Cool room (65-68°F)<br>• No screens 1h before bed', 'left')}
      ${createNumberInput('Recovery', data.whoop.recovery, 'whoop', 'recovery', '≥66', '%', '≥66%', '<b>How to improve recovery:</b><br>• Prioritize sleep quality<br>• Hydrate well<br>• Eat nutritious foods', 'center')}
      ${createNumberInput('Strain', data.whoop.strain, 'whoop', 'strain', '10-14', '/21', 'match', '<b>Recovery-matched:</b><br>• Green (≥66%) → 14+ strain<br>• Yellow (33-65%) → 10-14 strain<br>• Red (<33%) → rest', 'right')}
    </div>
  `;

  const familyContent = ['mom', 'dad', 'jana', 'tia', 'ahmed', 'eman'].map(p =>
    createToggle(p.charAt(0).toUpperCase() + p.slice(1), data.family[p], 'family', p)
  ).join('');

  const habitsContent = `
    <div class="space-y-2">
      ${createCounter('🏋️ Exercise', data.habits.exercise || 0, 'habits', 'exercise', 5)}
      ${createCounter('📚 Reading', data.habits.reading || 0, 'habits', 'reading', 5)}
      ${createCounter('🧘 Meditation', data.habits.meditation || 0, 'habits', 'meditation', 5)}
      ${createCounter('🦷 Brush Teeth', data.habits.brushTeeth || 0, 'habits', 'brushTeeth', 3)}
      ${createToggle('💊 Vitamins taken', data.habits.vitamins, 'habits', 'vitamins')}
    </div>
    <div class="flex gap-3 mt-3 pt-3 border-t border-softborder">
      <div class="flex-1 text-center">
        <input type="number" step="any" value="${data.habits.water}" placeholder="2.5"
          class="w-full px-2 py-2 border border-[var(--border)] rounded-lg text-center text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] outline-none mb-1"
          onchange="updateData('habits', 'water', this.value)">
        <div class="text-xs font-medium text-charcoal/70">💧 Water</div>
        <div class="text-xs text-charcoal/40">L · 1pt/L</div>
      </div>
      <div class="flex-1 text-center">
        <input type="number" step="1" value="${data.habits.nop}" placeholder="0-1"
          class="w-full px-2 py-2 border border-[var(--border)] rounded-lg text-center text-sm bg-[var(--bg-input)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] outline-none mb-1"
          onchange="updateData('habits', 'nop', this.value)">
        <div class="text-xs font-medium text-charcoal/70">💤 NoP</div>
        <div class="text-xs text-charcoal/40">1=+2, 0=-2</div>
      </div>
    </div>
  `;

  const summaryContent = `
    <div class="space-y-3">
      <div class="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
        <div class="flex justify-between items-center">
          <span class="font-medium text-[var(--text-primary)]">Whoop Age</span>
          <div class="flex items-center gap-2">
            <input type="number" step="0.1" value="${data.whoop.whoopAge || ''}" placeholder="—"
              class="w-16 px-2 py-1 border border-[var(--border)] rounded-lg text-center text-sm bg-[var(--bg-input)] font-bold text-[var(--accent)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-light)] outline-none"
              onchange="updateData('whoop', 'whoopAge', this.value)">
            <span class="text-xs text-[var(--text-muted)]">yrs</span>
          </div>
        </div>
      </div>
      <div class="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
        <div class="flex justify-between items-center">
          <span class="font-medium text-[var(--text-primary)]">Prayers</span>
          <span class="font-bold text-[var(--accent)]">${scores.prayer} pts</span>
        </div>
        <div class="text-xs mt-1">
          <span class="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded mr-1">${scores.prayerOnTime} on-time</span>
          <span class="inline-block bg-amber-100 text-amber-700 px-2 py-0.5 rounded">${scores.prayerLate} late</span>
        </div>
      </div>
      <div class="flex justify-between items-center p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
        <span class="font-medium text-[var(--text-primary)]">Family</span>
        <span class="font-bold text-[var(--accent)]">${Object.values(data.family).filter(Boolean).length}/6</span>
      </div>
    </div>
  `;

  return `
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
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
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${createCard('Prayers', '🕌', '#4A90A4', prayersContent, prayerHelp)}
      ${createCard('Glucose (Libre)', '💉', '#6B8E5A', glucoseContent, libreSynced
        ? `<span class="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>Auto-synced</span>`
        : '')}
      ${createCard('Whoop Age Metrics', '⏱️', '#7C6B8E', whoopContent, whoopHelp)}
      ${createCard('Family Check-ins', '👨‍👩‍👧‍👦', '#C4943D', familyContent)}
      ${createCard('Habits', '✨', '#6B7280', habitsContent)}
      ${createCard("Today's Summary", '📈', getAccentColor(), summaryContent)}
    </div>
  `;
}
