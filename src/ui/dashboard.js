// ============================================================================
// Dashboard Tab UI Module
// ============================================================================
// Renders the analytics dashboard with Chart.js charts,
// 30-day stats, personal bests, category records, and lifetime stats.

import { state } from '../state.js';
import { fmt } from '../utils.js';
import { getLast30DaysData, getLast30DaysStats, getPersonalBests } from '../features/scoring.js';
import { getAccentColor } from '../data/github-sync.js';
import Chart from 'chart.js/auto';

/**
 * Render the dashboard tab with 30-day overview, charts,
 * personal bests, category records, and lifetime stats.
 * Uses Chart.js for bar and line charts (initialized via setTimeout
 * after DOM insertion).
 * @returns {string} HTML string for the dashboard tab
 */
export function renderDashboardTab() {
  const stats = getLast30DaysStats();
  const last30Data = getLast30DaysData();
  const bests = getPersonalBests();

  setTimeout(() => {
    const weekCtx = document.getElementById('weekChart');
    if (weekCtx) {
      if (state.weekChart) state.weekChart.destroy();
      state.weekChart = new Chart(weekCtx, {
        type: 'bar',
        data: {
          labels: last30Data.map(d => d.label),
          datasets: [{ label: 'Total Score', data: last30Data.map(d => d.total), backgroundColor: getAccentColor(), borderRadius: 4 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true },
            x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
          }
        }
      });
    }

    const breakdownCtx = document.getElementById('breakdownChart');
    if (breakdownCtx) {
      if (state.breakdownChart) state.breakdownChart.destroy();
      state.breakdownChart = new Chart(breakdownCtx, {
        type: 'line',
        data: {
          labels: last30Data.map(d => d.label),
          datasets: [
            { label: 'Prayer', data: last30Data.map(d => d.prayer), borderColor: '#4A90A4', tension: 0.3, pointRadius: 2 },
            { label: 'Whoop', data: last30Data.map(d => d.whoop), borderColor: '#7C6B8E', tension: 0.3, pointRadius: 2 },
            { label: 'Family', data: last30Data.map(d => d.family), borderColor: '#C4943D', tension: 0.3, pointRadius: 2 },
            { label: 'Habit', data: last30Data.map(d => d.habit), borderColor: '#6B7280', tension: 0.3, pointRadius: 2 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: {
            y: { beginAtZero: true },
            x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
          }
        }
      });
    }
  }, 100);

  return `
    <div class="space-y-8">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)] border border-[var(--border-light)]">
          <div class="sb-section-title text-[var(--text-muted)]">30-Day Score</div>
          <div class="text-3xl font-bold mt-1 text-[var(--accent)]">${fmt(stats.totalScore)}</div>
        </div>
        <div class="sb-card rounded-lg p-5">
          <div class="sb-section-title text-charcoal/50">Days Logged</div>
          <div class="text-3xl font-bold mt-1 text-charcoal">${stats.daysLogged}/30</div>
        </div>
        <div class="sb-card rounded-lg p-5">
          <div class="sb-section-title text-charcoal/50">Avg RHR</div>
          <div class="text-3xl font-bold mt-1 text-charcoal">${fmt(stats.avgRHR)} <span class="text-base font-normal text-charcoal/50">bpm</span></div>
        </div>
        <div class="sb-card rounded-lg p-5">
          <div class="sb-section-title text-charcoal/50">Avg Sleep</div>
          <div class="text-3xl font-bold mt-1 text-charcoal">${stats.avgSleep} <span class="text-base font-normal text-charcoal/50">hrs</span></div>
        </div>
        <div class="sb-card rounded-lg p-5">
          <div class="sb-section-title text-charcoal/50">Family Check-ins</div>
          <div class="text-3xl font-bold mt-1 text-charcoal">${fmt(stats.totalFamilyCheckins)}</div>
        </div>
      </div>

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Last 30 Days <span class="text-coral">→</span></h3>
        <div class="h-72"><canvas id="weekChart"></canvas></div>
      </div>

      <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-charcoal mb-4">Score Breakdown <span class="text-coral">→</span></h3>
        <div class="h-72"><canvas id="breakdownChart"></canvas></div>
      </div>

      <!-- Personal Bests Section -->
      ${bests ? `
      <div class="sb-card rounded-lg p-6 bg-warmgray border-2 border-coral/20">
        <h3 class="font-semibold text-charcoal mb-4">Personal Bests <span class="text-coral">→</span></h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)]">
            <div class="text-3xl font-bold text-coral">${fmt(bests.highestDayScore.value)}</div>
            <div class="text-sm text-charcoal/70 mt-1">Best Day Score</div>
            <div class="text-xs text-charcoal/40 mt-1">${bests.highestDayScore.date ? new Date(bests.highestDayScore.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</div>
          </div>
          <div class="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)]">
            <div class="text-3xl font-bold text-coral">${fmt(bests.highestWeekScore.value)}</div>
            <div class="text-sm text-charcoal/70 mt-1">Best Week Score</div>
            <div class="text-xs text-charcoal/40 mt-1">${bests.highestWeekScore.weekStart ? 'Week of ' + new Date(bests.highestWeekScore.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</div>
          </div>
          <div class="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)]">
            <div class="text-3xl font-bold text-coral">${fmt(bests.longestStreak.value)}</div>
            <div class="text-sm text-charcoal/70 mt-1">Longest Streak</div>
            <div class="text-xs text-charcoal/40 mt-1">${bests.longestStreak.value > 0 ? 'days in a row' : '\u2014'}</div>
          </div>
          <div class="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)]">
            <div class="text-3xl font-bold text-coral flex items-center gap-2">${fmt(bests.currentStreak)} ${bests.currentStreak > 0 ? '🔥' : ''}</div>
            <div class="text-sm text-charcoal/70 mt-1">Current Streak</div>
            <div class="text-xs text-charcoal/40 mt-1">${bests.currentStreak > 0 ? 'Keep it going!' : 'Log today to start!'}</div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
          <h3 class="font-semibold text-charcoal mb-4">Category Records <span class="text-coral">→</span></h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-warmgray rounded border border-softborder">
              <div>
                <div class="text-sm font-medium text-charcoal">🕌 Best Prayer Day</div>
                <div class="text-xs text-charcoal/50">${bests.bestPrayerDay.date ? new Date(bests.bestPrayerDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '\u2014'}</div>
              </div>
              <div class="text-xl font-bold text-coral">${fmt(bests.bestPrayerDay.value)} pts</div>
            </div>
            <div class="flex items-center justify-between p-3 bg-warmgray rounded border border-softborder">
              <div>
                <div class="text-sm font-medium text-charcoal">⏱️ Best Whoop Day</div>
                <div class="text-xs text-charcoal/50">${bests.bestWhoopDay.date ? new Date(bests.bestWhoopDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '\u2014'}</div>
              </div>
              <div class="text-xl font-bold text-coral">${fmt(bests.bestWhoopDay.value)} pts</div>
            </div>
            <div class="flex items-center justify-between p-3 bg-warmgray rounded border border-softborder">
              <div>
                <div class="text-sm font-medium text-charcoal">📖 Most Quran Pages</div>
                <div class="text-xs text-charcoal/50">${bests.mostQuranPages.date ? new Date(bests.mostQuranPages.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '\u2014'}</div>
              </div>
              <div class="text-xl font-bold text-coral">${fmt(bests.mostQuranPages.value)} pages</div>
            </div>
          </div>
        </div>

        <div class="sb-card rounded-lg p-6 bg-[var(--bg-card)]">
          <h3 class="font-semibold text-charcoal mb-4">Lifetime Stats <span class="text-coral">→</span></h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-warmgray rounded border border-softborder">
              <div class="text-sm font-medium text-charcoal">Total Days Logged</div>
              <div class="text-xl font-bold text-charcoal">${fmt(bests.totalDaysLogged)}</div>
            </div>
            <div class="flex items-center justify-between p-3 bg-warmgray rounded border border-softborder">
              <div class="text-sm font-medium text-charcoal">Perfect Prayer Days</div>
              <div class="text-xl font-bold text-coral flex items-center gap-1">${fmt(bests.perfectPrayerDays)} <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.94 5.95 6.57.96-4.76 4.63 1.12 6.56L12 17.27l-5.87 3.09 1.12-6.56-4.76-4.63 6.57-.96z"/></svg></div>
            </div>
            <div class="flex items-center justify-between p-3 bg-warmgray rounded border border-softborder">
              <div class="text-sm font-medium text-charcoal">Perfect Prayer Rate</div>
              <div class="text-xl font-bold text-coral">${bests.totalDaysLogged > 0 ? Math.round((bests.perfectPrayerDays / bests.totalDaysLogged) * 100) : 0}%</div>
            </div>
          </div>
        </div>
      </div>
      ` : `
      <div class="sb-card rounded-lg p-8 bg-[var(--bg-card)] text-center">
        <div class="mb-4 flex justify-center"><svg class="w-10 h-10 text-[var(--accent)] opacity-40" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg></div>
        <h3 class="font-semibold text-charcoal mb-2">Start Your Journey!</h3>
        <p class="text-charcoal/50 text-sm">Log your first day to start tracking personal bests.</p>
      </div>
      `}
    </div>
  `;
}
