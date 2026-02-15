// ============================================================================
// Dashboard Tab UI Module
// ============================================================================
// Renders the analytics dashboard with Chart.js charts, 30-day heatmap,
// personal bests, achievements gallery, and lifetime stats.

import { state } from '../state.js';
import { fmt, getLocalDateString, isMobileViewport } from '../utils.js';
import { getLastNDaysData, getLastNDaysStats, getPersonalBests, calculateScores, getLevelInfo, getScoreTier } from '../features/scoring.js';
import { getAccentColor } from '../data/github-sync.js';
import { ACHIEVEMENTS, SCORE_TIERS, LEVEL_TIERS, STREAK_MULTIPLIERS, STREAK_MIN_THRESHOLD, DEFAULT_CATEGORY_WEIGHTS, defaultDayData } from '../constants.js';
import Chart from 'chart.js/auto';

/**
 * Get tier color for a normalized score
 */
function getTierColor(score) {
  for (let i = SCORE_TIERS.length - 1; i >= 0; i--) {
    if (score >= SCORE_TIERS[i].min) return SCORE_TIERS[i].color;
  }
  return SCORE_TIERS[0].color;
}

/**
 * Render a 30-day heatmap calendar (GitHub contribution-style)
 */
function renderHeatmap(daysData) {
  const n = daysData.length;
  const cols = n <= 7 ? 7 : isMobileViewport() ? 6 : 10;
  const cells = daysData.map(d => {
    const dayData = state.allData[d.date];
    if (!dayData) {
      return `<div class="heatmap-cell w-full aspect-square rounded-sm bg-[var(--bg-secondary)] border border-[var(--border-light)]" title="${d.label}: No data"></div>`;
    }
    const scores = calculateScores(dayData);
    const pct = scores.normalized?.overall || 0;
    const color = getTierColor(pct);
    return `<div class="heatmap-cell w-full aspect-square rounded-sm border border-[var(--border-light)]" style="background-color: ${color}; opacity: ${0.3 + pct * 0.7}" title="${d.label}: ${Math.round(pct * 100)}%"></div>`;
  });

  return `
    <div class="heatmap-grid grid gap-1" style="grid-template-columns: repeat(${cols}, 1fr);">
      ${cells.join('')}
    </div>
    <div class="flex items-center justify-end gap-2 mt-2">
      <span class="text-[10px] text-[var(--text-muted)]">Less</span>
      ${SCORE_TIERS.map(t => `<div class="w-3 h-3 rounded-sm" style="background-color: ${t.color};" title="${t.label}"></div>`).join('')}
      <span class="text-[10px] text-[var(--text-muted)]">More</span>
    </div>
  `;
}

/**
 * Render the achievements gallery
 */
function renderAchievementsGallery() {
  const unlocked = state.achievements?.unlocked || {};
  const categories = ['streak', 'mastery', 'milestone'];
  const categoryLabels = { streak: 'Streaks', mastery: 'Category Mastery', milestone: 'Milestones' };

  return categories.map(cat => {
    const achs = ACHIEVEMENTS.filter(a => a.category === cat);
    if (achs.length === 0) return '';
    return `
      <div class="mb-4">
        <h4 class="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">${categoryLabels[cat]}</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          ${achs.map(ach => {
            const isUnlocked = !!unlocked[ach.id];
            const unlockedDate = isUnlocked ? new Date(unlocked[ach.id].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
            return `
              <div class="achievement-card rounded-lg p-3 border transition ${isUnlocked
                ? 'bg-[var(--bg-card)] border-[color-mix(in_srgb,var(--warning)_50%,transparent)] shadow-sm'
                : 'bg-[var(--bg-secondary)] border-[var(--border-light)] opacity-50'}">
                <div class="flex items-start gap-2">
                  <span class="text-xl ${isUnlocked ? '' : 'grayscale'}">${ach.icon}</span>
                  <div class="min-w-0">
                    <div class="text-xs font-semibold text-[var(--text-primary)] truncate">${ach.name}</div>
                    <div class="text-[10px] text-[var(--text-muted)]">${ach.desc}</div>
                              ${isUnlocked ? `<div class="text-[10px] text-[var(--warning)] mt-0.5">${unlockedDate}</div>` : `<div class="text-[10px] text-[var(--text-muted)] mt-0.5" title="Complete: ${ach.desc}">Locked — complete ${ach.desc} to unlock</div>`}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render the "How It Works" collapsible guide
 */
function renderGuide() {
  const tierRows = SCORE_TIERS.map(t =>
    `<tr>
      <td class="py-1.5 pr-3"><span class="inline-block w-3 h-3 rounded-sm mr-1.5" style="background:${t.color}"></span>${Math.round(t.min * 100)}–${Math.round(t.max * 100)}%</td>
      <td class="py-1.5 text-[var(--text-secondary)]">${t.label}</td>
    </tr>`
  ).join('');

  const levelRows = LEVEL_TIERS.map(t =>
    `<tr>
      <td class="py-1 pr-3">${t.icon} ${t.name}</td>
      <td class="py-1 text-[var(--text-secondary)]">Level ${t.min}${t.max < 999 ? '–' + t.max : '+'}</td>
    </tr>`
  ).join('');

  const streakRows = STREAK_MULTIPLIERS.map(s =>
    `<tr>
      <td class="py-1 pr-3">${s.min === s.max ? s.min : s.min + (s.max === Infinity ? '+' : '–' + s.max)} days</td>
      <td class="py-1 text-[var(--text-secondary)]">${s.multiplier}x XP</td>
    </tr>`
  ).join('');

  return `
    <details class="sb-card rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] group">
      <summary class="px-6 py-4 cursor-pointer select-none list-none flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span class="font-semibold text-[var(--text-primary)]">How Life Score Works</span>
        </div>
        <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </summary>
      <div class="px-6 pb-6 space-y-6 text-sm text-[var(--text-secondary)] border-t border-[var(--border-light)] pt-5">

        <div>
          <h4 class="font-semibold text-[var(--text-primary)] mb-2">Scoring</h4>
          <p class="mb-2">Every day you track 5 life categories: <strong>Prayer</strong>, <strong>Glucose</strong>, <strong>Whoop</strong> (sleep & recovery), <strong>Family</strong>, and <strong>Habits</strong>. Each category is scored as a percentage (0–100%) of its maximum possible points.</p>
          <p class="mb-2">Your <strong>Overall Score</strong> is a weighted average of all 5 categories. By default each category is weighted equally at 20%.</p>
          <table class="text-xs mt-3 mb-1">
            <thead><tr><th class="text-left pr-3 pb-1 text-[var(--text-muted)] font-medium">Range</th><th class="text-left pb-1 text-[var(--text-muted)] font-medium">Tier</th></tr></thead>
            <tbody>${tierRows}</tbody>
          </table>
          <p class="text-xs text-[var(--text-muted)]">The ring chart on Home and the heatmap colors on this page use these tiers.</p>
        </div>

        <div>
          <h4 class="font-semibold text-[var(--text-primary)] mb-2">XP & Levels</h4>
          <p class="mb-2">Your daily percentage converts to <strong>XP</strong> that accumulates forever. A 70% day earns 70 base XP. Streaks add bonus XP on top (see below).</p>
          <p class="mb-2">XP drives your <strong>Level</strong>. Early levels come quickly; higher levels take longer (logarithmic curve). There are 50 levels grouped into tiers:</p>
          <table class="text-xs mt-2">
            <thead><tr><th class="text-left pr-3 pb-1 text-[var(--text-muted)] font-medium">Tier</th><th class="text-left pb-1 text-[var(--text-muted)] font-medium">Levels</th></tr></thead>
            <tbody>${levelRows}</tbody>
          </table>
        </div>

        <div>
          <h4 class="font-semibold text-[var(--text-primary)] mb-2">Streaks</h4>
          <p class="mb-2">A <strong>streak</strong> counts consecutive days where your overall score is at least ${Math.round(STREAK_MIN_THRESHOLD * 100)}%. Longer streaks give a higher XP multiplier:</p>
          <table class="text-xs mt-2 mb-2">
            <thead><tr><th class="text-left pr-3 pb-1 text-[var(--text-muted)] font-medium">Streak</th><th class="text-left pb-1 text-[var(--text-muted)] font-medium">Bonus</th></tr></thead>
            <tbody>${streakRows}</tbody>
          </table>
          <p><strong>Streak Shield:</strong> You get one free "miss" per week. If you skip a day but have a shield, your streak survives. The shield regenerates every Monday.</p>
        </div>

        <div>
          <h4 class="font-semibold text-[var(--text-primary)] mb-2">Achievements</h4>
          <p class="mb-2">There are <strong>${ACHIEVEMENTS.length} badges</strong> to unlock across three categories:</p>
          <ul class="list-disc list-inside space-y-1 text-xs">
            <li><strong>Streaks</strong> — Reach 3, 7, 14, 30, 90, or 365 day streaks</li>
            <li><strong>Category Mastery</strong> — Perfect prayer days, 90%+ overall, balanced days, family milestones</li>
            <li><strong>Milestones</strong> — First day logged, 100 days, Quran pages, reaching level 10/20/30</li>
          </ul>
          <p class="mt-2 text-xs text-[var(--text-muted)]">Achievements are checked automatically every time you log data. Unlocked badges glow in the gallery above.</p>
        </div>

        <div>
          <h4 class="font-semibold text-[var(--text-primary)] mb-2">Daily Focus</h4>
          <p>The focus card on the Home tab looks at your last 7 days and highlights your weakest category with an actionable tip. It only appears once you have 3+ days of data.</p>
        </div>

        <div>
          <h4 class="font-semibold text-[var(--text-primary)] mb-2">Heatmap & Trends</h4>
          <p>The <strong>heatmap</strong> on this page shows each day colored by your overall score tier. Use the 7/30/90-day toggle to change the range. The <strong>Category Trends</strong> chart plots each category's percentage over the selected range so you can spot patterns and improvements.</p>
        </div>

      </div>
    </details>
  `;
}

/**
 * Render the dashboard tab with 30-day overview, charts,
 * personal bests, achievements, and lifetime stats.
 * @returns {string} HTML string for the dashboard tab
 */
export function renderDashboardTab() {
  const range = state.dashboardDateRange || 30;
  const stats = getLastNDaysStats(range);
  const last30Data = getLastNDaysData(range);
  const bests = getPersonalBests();
  const levelInfo = getLevelInfo(state.xp?.total || 0);
  const streakCount = state.streak?.current || 0;
  const totalXP = state.xp?.total || 0;
  const unlockedCount = Object.keys(state.achievements?.unlocked || {}).length;
  const totalAchievements = ACHIEVEMENTS.length;

  // Chart.js — update breakdown to show percentages
  setTimeout(() => {
    const breakdownCtx = document.getElementById('breakdownChart');
    if (breakdownCtx) {
      if (state.breakdownChart) state.breakdownChart.destroy();

      // Build percentage datasets from normalized scores
      const normData = last30Data.map(d => {
        const dayData = state.allData[d.date];
        if (!dayData) return { prayer: 0, diabetes: 0, whoop: 0, family: 0, habits: 0 };
        const scores = calculateScores(dayData);
        const n = scores.normalized || {};
        return {
          prayer: Math.round((n.prayer || 0) * 100),
          diabetes: Math.round((n.diabetes || 0) * 100),
          whoop: Math.round((n.whoop || 0) * 100),
          family: Math.round((n.family || 0) * 100),
          habits: Math.round((n.habits || 0) * 100)
        };
      });

      state.breakdownChart = new Chart(breakdownCtx, {
        type: 'line',
        data: {
          labels: last30Data.map(d => d.label),
          datasets: [
            { label: 'Prayer', data: normData.map(d => d.prayer), borderColor: '#4A90A4', tension: 0.3, pointRadius: 2 },
            { label: 'Glucose', data: normData.map(d => d.diabetes), borderColor: '#EF4444', tension: 0.3, pointRadius: 2 },
            { label: 'Whoop', data: normData.map(d => d.whoop), borderColor: '#7C6B8E', tension: 0.3, pointRadius: 2 },
            { label: 'Family', data: normData.map(d => d.family), borderColor: '#C4943D', tension: 0.3, pointRadius: 2 },
            { label: 'Habits', data: normData.map(d => d.habits), borderColor: '#6B7280', tension: 0.3, pointRadius: 2 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: isMobileViewport(),
          aspectRatio: isMobileViewport() ? 1.5 : 2,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: isMobileViewport() ? 10 : 12 } }
            },
            tooltip: {
              titleFont: { size: isMobileViewport() ? 14 : 12 },
              bodyFont: { size: isMobileViewport() ? 14 : 12 },
              events: isMobileViewport() ? ['click'] : ['mousemove', 'click']
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: v => v + '%',
                font: { size: isMobileViewport() ? 9 : 11 }
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: isMobileViewport() ? 60 : 45,
                font: { size: isMobileViewport() ? 8 : 10 }
              }
            }
          }
        }
      });
    }
  }, 100);

  return `
    <div class="space-y-6">
      <!-- Level + XP + Streak banner -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)] border border-[var(--border-light)]">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-14 h-14 rounded-full bg-[var(--warning)] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              ${levelInfo.level}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-lg font-bold text-[var(--text-primary)]">Level ${levelInfo.level}</span>
                <span class="text-sm text-[var(--text-muted)]">${levelInfo.tierIcon} ${levelInfo.tierName}</span>
              </div>
              <div class="text-xs text-[var(--text-muted)] mt-0.5">${totalXP.toLocaleString()} / ${levelInfo.nextLevelXP.toLocaleString()} XP</div>
              <div class="h-2 bg-[var(--bg-secondary)] rounded-full mt-1.5 overflow-hidden w-full max-w-48">
                <div class="h-full bg-[var(--warning)] rounded-full transition-all duration-500" style="width: ${Math.round(levelInfo.progress * 100)}%"></div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold ${streakCount > 0 ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'}">${streakCount > 0 ? '\uD83D\uDD25' : ''} ${streakCount}</div>
              <div class="text-[10px] text-[var(--text-muted)]">Day Streak</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-[var(--accent)]">${unlockedCount}</div>
              <div class="text-[10px] text-[var(--text-muted)]">of ${totalAchievements}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Date range toggle -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-[var(--text-muted)]">View:</span>
        <div class="flex gap-1">
          ${[7, 30, 90].map(n => `
            <button type="button" onclick="state.dashboardDateRange=${n}; window.render()" class="px-3 py-1 text-sm rounded-lg transition ${range === n ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}">${n} days</button>
          `).join('')}
        </div>
      </div>

      <!-- Heatmap -->
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)] border border-[var(--border-light)]">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">Last ${range} Days</h3>
        ${renderHeatmap(last30Data)}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--border-light)]">
          <div>
            <div class="text-xs text-[var(--text-muted)]">Days Logged</div>
            <div class="text-xl font-bold text-[var(--text-primary)]">${stats.daysLogged}/${range}</div>
          </div>
          <div>
            <div class="text-xs text-[var(--text-muted)]">Avg Daily</div>
            <div class="text-xl font-bold text-[var(--accent)]">${fmt(stats.avgDaily)} pts</div>
          </div>
          <div>
            <div class="text-xs text-[var(--text-muted)]">Family Check-ins</div>
            <div class="text-xl font-bold text-[var(--text-primary)]">${fmt(stats.totalFamilyCheckins)}</div>
          </div>
          <div>
            <div class="text-xs text-[var(--text-muted)]">On-Time Prayers</div>
            <div class="text-xl font-bold text-[var(--text-primary)]">${fmt(stats.totalOnTimePrayers)}</div>
          </div>
        </div>
      </div>

      <!-- Category Breakdown (Percentages) -->
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)] border border-[var(--border-light)]">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">Category Trends (%)</h3>
        <div class="${isMobileViewport() ? 'aspect-[3/2]' : 'h-72'}" role="img" aria-label="Category trends chart showing percentage for Prayer, Glucose, Whoop, Family, and Habits over the last ${range} days"><canvas id="breakdownChart"></canvas></div>
      </div>

      <!-- Achievements Gallery -->
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)] border border-[var(--border-light)]">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">Achievements <span class="text-sm font-normal text-[var(--text-muted)]">${unlockedCount}/${totalAchievements}</span></h3>
        ${renderAchievementsGallery()}
      </div>

      <!-- Personal Bests Section -->
      ${bests ? `
      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)] border border-[var(--border-light)]">
        <h3 class="font-semibold text-[var(--text-primary)] mb-4">Personal Bests</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-[var(--bg-secondary)] rounded-lg p-4">
            <div class="text-3xl font-bold text-[var(--accent)]">${fmt(bests.highestDayScore.value)}</div>
            <div class="text-sm text-[var(--text-secondary)] mt-1">Best Day Score</div>
            <div class="text-xs text-[var(--text-muted)] mt-1">${bests.highestDayScore.date ? new Date(bests.highestDayScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</div>
          </div>
          <div class="bg-[var(--bg-secondary)] rounded-lg p-4">
            <div class="text-3xl font-bold text-[var(--accent)]">${fmt(bests.highestWeekScore.value)}</div>
            <div class="text-sm text-[var(--text-secondary)] mt-1">Best Week Score</div>
            <div class="text-xs text-[var(--text-muted)] mt-1">${bests.highestWeekScore.weekStart ? 'Week of ' + new Date(bests.highestWeekScore.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</div>
          </div>
          <div class="bg-[var(--bg-secondary)] rounded-lg p-4">
            <div class="text-3xl font-bold text-[var(--accent)]">${fmt(bests.longestStreak.value)}</div>
            <div class="text-sm text-[var(--text-secondary)] mt-1">Longest Streak</div>
            <div class="text-xs text-[var(--text-muted)] mt-1">${bests.longestStreak.value > 0 ? 'days in a row' : '\u2014'}</div>
          </div>
          <div class="bg-[var(--bg-secondary)] rounded-lg p-4">
            <div class="text-3xl font-bold text-[var(--accent)]">${fmt(bests.perfectPrayerDays)}</div>
            <div class="text-sm text-[var(--text-secondary)] mt-1">Perfect Prayer Days</div>
            <div class="text-xs text-[var(--text-muted)] mt-1">${bests.totalDaysLogged > 0 ? Math.round((bests.perfectPrayerDays / bests.totalDaysLogged) * 100) + '% rate' : '\u2014'}</div>
          </div>
        </div>
      </div>
      ` : `
      <div class="sb-card rounded-lg p-8 bg-[var(--bg-card)] border border-[var(--border-light)] text-center">
        <div class="mb-4 flex justify-center"><svg class="w-10 h-10 text-[var(--accent)] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="14" y1="21" x2="14" y2="6"/><line x1="19" y1="21" x2="19" y2="14"/></svg></div>
        <h3 class="font-semibold text-[var(--text-primary)] mb-2">Start Your Journey!</h3>
        <p class="text-[var(--text-muted)] text-sm">Log your first day to start tracking personal bests.</p>
      </div>
      `}

      <!-- How It Works Guide -->
      ${renderGuide()}
    </div>
  `;
}
