// ============================================================================
// INPUT BUILDERS MODULE
// ============================================================================
// UI builder functions for form inputs, toggles, counters, score cards, and
// generic card wrappers. These return HTML string fragments used by the
// tracking / dashboard views.

import { state } from '../state.js';
import { fmt } from '../utils.js';

// ---------------------------------------------------------------------------
// Scoring helpers — imported lazily to avoid circular deps.  The scoring
// module is expected to export parsePrayer & calcPrayerScore.
// ---------------------------------------------------------------------------
// NOTE: parsePrayer, calcPrayerScore, and getAccentColor are expected to
// live in their own modules eventually. For now we declare the imports so the
// call-sites are explicit; the actual module paths can be adjusted once
// those files exist.
//
// import { parsePrayer, calcPrayerScore } from '../scoring.js';
// import { getAccentColor } from '../features/github-sync.js';
//
// Until those modules are created we rely on the global window fallbacks:

function parsePrayer(value) {
  if (typeof window.parsePrayer === 'function') return window.parsePrayer(value);
  // Inline fallback matching index.html logic
  const v = parseFloat(value);
  if (!v || isNaN(v)) return { onTime: 0, late: 0 };
  const onTime = Math.floor(v);
  const late = Math.round((v - onTime) * 10);
  return { onTime, late };
}

function calcPrayerScore(value) {
  if (typeof window.calcPrayerScore === 'function') return window.calcPrayerScore(value);
  const { onTime, late } = parsePrayer(value);
  return onTime * (state.WEIGHTS.prayer?.onTime ?? 5) + late * (state.WEIGHTS.prayer?.late ?? 2);
}

function getAccentColor() {
  if (typeof window.getAccentColor === 'function') return window.getAccentColor();
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#E5533D';
}

// ============================================================================
// Exported builder functions
// ============================================================================

/**
 * Create a prayer input field with on-time/late breakdown and score display
 * @param {string} prayer - Prayer key (fajr, dhuhr, asr, maghrib, isha)
 * @param {string} label  - Display label
 * @param {string|number} value - Current value (e.g. "1.0")
 * @returns {string} HTML string
 */
export function createPrayerInput(prayer, label, value) {
  const { onTime, late } = parsePrayer(value);
  const pts = calcPrayerScore(value);
  return `
    <div class="flex-1 text-center">
      <input type="text" value="${value}" placeholder="X.Y"
        class="prayer-input w-full px-3 py-2 border border-[var(--border)] rounded-md text-center font-mono text-lg bg-[var(--bg-input)] mb-1"
        onchange="updateData('prayers', '${prayer}', this.value)">
      <div class="text-xs font-medium text-[var(--text-secondary)]">${label}</div>
      <div class="text-xs text-[var(--text-muted)] mt-0.5">
        <span class="text-[var(--success)]">${onTime}\u2713</span> <span class="text-[var(--warning)]">${late}\u25D0</span>
      </div>
      <div class="text-xs font-semibold text-[var(--accent)] mt-0.5">${pts} pts</div>
    </div>
  `;
}

/**
 * Create a toggle switch for boolean fields
 * @param {string}  label    - Display label text
 * @param {boolean} checked  - Current state
 * @param {string}  category - Data category key
 * @param {string}  field    - Field key within category
 * @returns {string} HTML string
 */
export function createToggle(label, checked, category, field) {
  return `
    <label class="flex items-center justify-between cursor-pointer py-2 px-1 hover:bg-[var(--bg-secondary)] rounded-md transition">
      <span class="text-sm text-[var(--text-primary)]">${label}</span>
      <div class="relative toggle-switch toggle-track" onclick="updateData('${category}', '${field}', !${checked})">
        <div class="w-[52px] h-8 rounded-full transition ${checked ? 'toggle-on' : 'toggle-off'}"></div>
        <div class="absolute left-0.5 top-0.5 w-7 h-7 bg-white rounded-full shadow transition" style="transform: translateX(${checked ? '20px' : '0'})"></div>
      </div>
    </label>
  `;
}

/**
 * Create a number input with optional tooltip
 * @param {string} label       - Display label
 * @param {*}      value       - Current numeric value
 * @param {string} category    - Data category key
 * @param {string} field       - Field key
 * @param {string} placeholder - Placeholder text
 * @param {string} unit        - Unit label shown below input
 * @param {string} [hint='']   - Additional hint text
 * @param {string} [tooltip=''] - Tooltip content (HTML allowed)
 * @param {string} [tooltipPos='center'] - 'left' | 'center' | 'right'
 * @returns {string} HTML string
 */
export function createNumberInput(label, value, category, field, placeholder, unit, hint = '', tooltip = '', tooltipPos = 'center') {
  // tooltipPos: 'left', 'center', 'right' to control horizontal alignment
  const posClass = tooltipPos === 'left' ? 'left-0' : tooltipPos === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  return `
    <div class="flex-1 text-center group relative">
      <input type="number" step="any" value="${value}" placeholder="${placeholder}"
        class="input-field w-full text-center mb-1"
        onchange="updateData('${category}', '${field}', this.value)">
      <div class="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-center gap-1">
        ${label}
        ${tooltip ? `<span class="cursor-help text-[var(--text-muted)] hover:text-[var(--accent)]">\u24D8</span>` : ''}
      </div>
      <div class="text-xs text-[var(--text-muted)]">${unit}${hint ? ` \u00B7 ${hint}` : ''}</div>
      ${tooltip ? `<div class="absolute ${posClass} top-full mt-1 z-50 hidden group-hover:block bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs rounded-md p-3 w-48 shadow-lg text-left">${tooltip}</div>` : ''}
    </div>
  `;
}

/**
 * Create a counter (decrement / value / increment) for integer fields
 * @param {string} label    - Display label
 * @param {number} value    - Current value
 * @param {string} category - Data category key
 * @param {string} field    - Field key
 * @param {number} [max=10] - Maximum allowed value
 * @returns {string} HTML string
 */
export function createCounter(label, value, category, field, max = 10) {
  return `
    <div class="flex items-center justify-between py-2">
      <span class="text-sm text-[var(--text-primary)]">${label}</span>
      <div class="flex items-center gap-2">
        <button onclick="updateData('${category}', '${field}', Math.max(0, ${value} - 1))"
          class="w-11 h-11 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center justify-center font-bold text-[var(--text-muted)] transition active:scale-95">\u2212</button>
        <span class="w-8 text-center font-semibold text-lg text-[var(--text-primary)]">${value}</span>
        <button onclick="updateData('${category}', '${field}', Math.min(${max}, ${value} + 1))"
          class="w-11 h-11 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white flex items-center justify-center font-bold transition active:scale-95">+</button>
      </div>
    </div>
  `;
}

/**
 * Create a score card with label, numeric score, progress bar
 * @param {string} label      - Category label
 * @param {number} score      - Achieved score
 * @param {number} max        - Maximum possible score
 * @param {string} colorClass - CSS background class for accent mapping
 * @returns {string} HTML string
 */
export function createScoreCard(label, score, max, colorClass) {
  const pct = max ? Math.min((score / max) * 100, 100) : 0;
  // Extract CSS variable name from bg-[var(--name)] format, or fall back to accent
  const varMatch = colorClass?.match(/var\(([^)]+)\)/);
  const accent = varMatch ? `var(${varMatch[1]})` : (colorClass || 'var(--accent)');
  const pctDisplay = Math.round(pct);
  return `
    <div class="sb-card rounded-lg p-4">
      <div class="flex justify-between items-center mb-1">
        <span class="sb-section-title text-[var(--text-muted)]">${label}</span>
        <span class="text-xs text-[var(--text-muted)]">${pctDisplay}%</span>
      </div>
      <div class="font-bold text-2xl text-[var(--text-primary)] mb-2">${fmt(score)}</div>
      <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${accent}"></div>
      </div>
    </div>
  `;
}

/**
 * Create a generic card wrapper with icon, title, accent border, and content
 * @param {string} title        - Card title
 * @param {string} icon         - Emoji or SVG icon
 * @param {string} accentColor  - Hex colour for top border accent
 * @param {string} content      - Inner HTML content
 * @param {string} [extraHeader=''] - Optional extra header text (right-aligned)
 * @returns {string} HTML string
 */
export function createCard(title, icon, accentColor, content, extraHeader = '') {
  const accent = accentColor || '#6B7280';
  return `
    <div class="sb-card rounded-lg overflow-hidden border border-[var(--border-light)]">
      <div class="px-5 py-3 flex items-center justify-between bg-[var(--bg-secondary)]" style="border-bottom: 2px solid ${accent}">
        <div class="flex items-center gap-2">
          <span class="text-lg">${icon}</span>
          <h3 class="font-semibold text-[var(--text-primary)]">${title}</h3>
        </div>
        ${extraHeader ? `<span class="text-[var(--text-muted)] text-xs">${extraHeader}</span>` : ''}
      </div>
      <div class="p-5 bg-[var(--bg-card)]">${content}</div>
    </div>
  `;
}
