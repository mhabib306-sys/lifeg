// ============================================================================
// SETTINGS TAB UI MODULE
// ============================================================================
// Renders the Settings tab: scoring weights, perfect day targets,
// theme selector, cloud sync, data management, and changelog.

import { state } from '../state.js';
import { THEMES } from '../constants.js';
import { getGithubToken, setGithubToken, getTheme, setTheme } from '../data/github-sync.js';
import { updateWeight, resetWeights, updateMaxScore, resetMaxScores } from '../features/scoring.js';

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
// renderSettingsTab — Full settings page
// ============================================================================
/**
 * Render the complete Settings tab with all configuration sections.
 * @returns {string} HTML string for the settings tab
 */
export function renderSettingsTab() {
  return `
    <div class="space-y-8">
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
        </div>
        <p class="text-xs text-charcoal/40 mt-3">
          Export creates a local backup JSON file. Import merges data from a backup file.
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
