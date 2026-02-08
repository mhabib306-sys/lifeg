// ============================================================================
// Bulk Entry Tab UI Module
// ============================================================================
// Renders the spreadsheet-style bulk data entry interface for
// backfilling tracking data across an entire month.

import { state } from '../state.js';
import { getLocalDateString, fmt } from '../utils.js';
import { defaultDayData, THINGS3_ICONS } from '../constants.js';
import { calculateScores, invalidateScoresCache } from '../features/scoring.js';
import { saveData } from '../data/storage.js';
import { getAccentColor } from '../data/github-sync.js';

/**
 * Set the bulk entry month and year, then re-render.
 * @param {number|string} month - 0-indexed month
 * @param {number|string} year  - Full year
 */
export function setBulkMonth(month, year) {
  state.bulkMonth = parseInt(month);
  state.bulkYear = parseInt(year);
  window.render();
}

/**
 * Set the active bulk-entry category and re-render.
 * @param {string} cat - Category key (prayers, glucose, whoop, family, habits)
 */
export function setBulkCategory(cat) {
  state.bulkCategory = cat;
  window.render();
}

/**
 * Update a single cell in the bulk entry grid.
 * Persists to allData, saves to localStorage, syncs to GitHub,
 * and live-updates the score cell + summary stats.
 * @param {string} dateStr  - YYYY-MM-DD date key
 * @param {string} category - Data category
 * @param {string} field    - Field name
 * @param {*}      value    - New value
 */
export function updateBulkData(dateStr, category, field, value) {
  if (!state.allData[dateStr]) {
    state.allData[dateStr] = JSON.parse(JSON.stringify(defaultDayData));
  }
  if (category === 'family') {
    state.allData[dateStr][category][field] = value === '1' || value === true;
  } else {
    state.allData[dateStr][category][field] = value;
  }
  invalidateScoresCache();
  saveData();
  window.debouncedSaveToGithub(); // Auto-save to GitHub
  // Update score cell live
  const scoreCell = document.getElementById('score-' + dateStr);
  if (scoreCell) {
    const newScore = calculateScores(state.allData[dateStr]).total;
    scoreCell.textContent = fmt(newScore);
  }
  // Update summary stats
  updateBulkSummary();
}

/**
 * Recalculate and update the bulk entry summary stats in-place
 * (days logged, total score, avg score, completion rate).
 */
export function updateBulkSummary() {
  const daysInMonth = getDaysInMonth(state.bulkMonth, state.bulkYear);
  let totalScore = 0, daysWithData = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = state.bulkYear + '-' + String(state.bulkMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    if (state.allData[dateStr]) {
      daysWithData++;
      totalScore += calculateScores(state.allData[dateStr]).total;
    }
  }
  const avgScore = daysWithData > 0 ? Math.round(totalScore / daysWithData) : 0;
  const completionRate = Math.round((daysWithData / daysInMonth) * 100);

  const daysEl = document.getElementById('bulk-days-logged');
  const totalEl = document.getElementById('bulk-total-score');
  const avgEl = document.getElementById('bulk-avg-score');
  const compEl = document.getElementById('bulk-completion');
  if (daysEl) daysEl.textContent = fmt(daysWithData);
  if (totalEl) totalEl.textContent = fmt(totalScore);
  if (avgEl) avgEl.textContent = fmt(avgScore);
  if (compEl) compEl.textContent = completionRate + '%';
}

/**
 * Get the number of days in a given month.
 * @param {number} month - 0-indexed month
 * @param {number} year  - Full year
 * @returns {number} Days in the month
 */
export function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Render the full bulk entry tab with month/category selector,
 * data table, and summary card.
 * @returns {string} HTML string for the bulk entry tab
 */
export function renderBulkEntryTab() {
  const daysInMonth = getDaysInMonth(state.bulkMonth, state.bulkYear);
  const monthName = new Date(state.bulkYear, state.bulkMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Category colors matching Daily tab
  const categoryColors = {
    prayers: '#4A90A4',  // teal
    glucose: '#6B8E5A', // green
    whoop: '#7C6B8E',   // purple
    family: '#C4943D',  // amber
    habits: '#6B7280'   // slate
  };

  const categories = {
    prayers: { label: '🕌 Prayers', fields: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'quran'], headers: ['F', 'D', 'A', 'M', 'I', 'Q'] },
    glucose: { label: '💉 Glucose', fields: ['avg', 'tir', 'insulin'], headers: ['Avg', 'TIR', 'Insulin'] },
    whoop: { label: '⏱️ Whoop', fields: ['sleepPerf', 'recovery', 'strain'], headers: ['Sleep%', 'Rec', 'Strain'] },
    family: { label: '👨‍👩‍👧‍👦 Family', fields: ['mom', 'dad', 'jana', 'tia', 'ahmed', 'eman'], headers: ['Mom', 'Dad', 'Jana', 'Tia', 'Ahmed', 'Eman'] },
    habits: { label: '✨ Habits', fields: ['exercise', 'reading', 'meditation', 'water', 'vitamins', 'brushTeeth', 'nop'], headers: ['🏋️', '📚', '🧘', '💧', '💊', '🦷', '💤'] }
  };

  const cat = categories[state.bulkCategory];

  // Generate month options (2026 and 2027)
  let monthOptions = '';
  [2026, 2027].forEach(function(year) {
    for (let m = 0; m < 12; m++) {
      const label = new Date(year, m).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const selected = m === state.bulkMonth && year === state.bulkYear ? 'selected' : '';
      monthOptions += '<option value="' + m + '-' + year + '" ' + selected + '>' + label + '</option>';
    }
  });

  // Build the table rows
  let tableRows = '';
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = state.bulkYear + '-' + String(state.bulkMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    const dayData = state.allData[dateStr] || JSON.parse(JSON.stringify(defaultDayData));
    const dayOfWeek = new Date(state.bulkYear, state.bulkMonth, day).toLocaleDateString('en-US', { weekday: 'short' });
    const isWeekend = [0, 6].includes(new Date(state.bulkYear, state.bulkMonth, day).getDay());
    const isToday = dateStr === getLocalDateString();
    const scores = calculateScores(dayData);

    let cells = '';
    cat.fields.forEach(field => {
      const value = dayData[state.bulkCategory][field];

      if (state.bulkCategory === 'family' || (state.bulkCategory === 'habits' && field === 'vitamins')) {
        const checked = value ? 'checked' : '';
        cells += '<td class="border border-softborder px-1 py-1 text-center">' +
          '<input type="checkbox" ' + checked +
          ' class="w-5 h-5 rounded border-softborder text-coral focus:ring-coral cursor-pointer"' +
          ' onchange="updateBulkData(\'' + dateStr + '\', \'' + state.bulkCategory + '\', \'' + field + '\', this.checked ? \'1\' : \'\')">' +
          '</td>';
      } else if (state.bulkCategory === 'prayers' && field !== 'quran') {
        cells += '<td class="border border-softborder px-1 py-1">' +
          '<input type="text" value="' + (value || '') + '" placeholder="X.Y"' +
          ' class="w-full px-1 py-1 text-center text-sm font-mono border-0 focus:ring-2 focus:ring-coral rounded bg-[var(--bg-input)]"' +
          ' onchange="updateBulkData(\'' + dateStr + '\', \'' + state.bulkCategory + '\', \'' + field + '\', this.value)">' +
          '</td>';
      } else {
        cells += '<td class="border border-softborder px-1 py-1">' +
          '<input type="number" step="any" value="' + (value || '') + '"' +
          ' class="w-full px-1 py-1 text-center text-sm border-0 focus:ring-2 focus:ring-coral rounded bg-[var(--bg-input)]"' +
          ' onchange="updateBulkData(\'' + dateStr + '\', \'' + state.bulkCategory + '\', \'' + field + '\', this.value)">' +
          '</td>';
      }
    });

    const rowClass = (isWeekend ? 'bg-warmgray/50 ' : '') + (isToday ? 'bg-coral/10 ' : '') + 'hover:bg-warmgray';
    const dayCellClass = 'border border-softborder px-2 py-1 font-medium text-center text-charcoal sticky left-0 z-10 ' + (isToday ? 'bg-coral/20' : 'bg-[var(--bg-card)]');
    const weekdayCellClass = 'border border-softborder px-2 py-1 text-xs text-charcoal/50 text-center sticky left-10 z-10 ' + (isToday ? 'bg-coral/20' : 'bg-[var(--bg-card)]');

    tableRows += '<tr class="' + rowClass + '">' +
      '<td class="' + dayCellClass + '">' + day + '</td>' +
      '<td class="' + weekdayCellClass + '">' + dayOfWeek + '</td>' +
      cells +
      '<td id="score-' + dateStr + '" class="border border-softborder px-2 py-1 text-center font-semibold text-coral">' + fmt(scores.total) + '</td>' +
      '</tr>';
  }

  // Category buttons with section colors
  let catButtons = '';
  Object.entries(categories).forEach(function([key, val]) {
    const color = categoryColors[key];
    const btnClass = state.bulkCategory === key
      ? 'text-white'
      : 'bg-warmgray hover:bg-softborder text-charcoal';
    const btnStyle = state.bulkCategory === key ? 'background-color: ' + color : '';
    catButtons += '<button onclick="setBulkCategory(\'' + key + '\')" class="px-3 py-2 rounded-lg text-sm font-medium transition ' + btnClass + '" style="' + btnStyle + '">' + val.label + '</button>';
  });

  // Header cells with category color
  const catColor = categoryColors[state.bulkCategory];
  let headerCells = '';
  cat.headers.forEach(function(h) {
    headerCells += '<th class="border px-3 py-3 font-medium" style="border-color: ' + catColor + '">' + h + '</th>';
  });

  // Calculate summary stats
  let totalScore = 0, daysWithData = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = state.bulkYear + '-' + String(state.bulkMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    if (state.allData[dateStr]) {
      daysWithData++;
      totalScore += calculateScores(state.allData[dateStr]).total;
    }
  }
  const avgScore = daysWithData > 0 ? Math.round(totalScore / daysWithData) : 0;
  const completionRate = Math.round((daysWithData / daysInMonth) * 100);

  const prayerHint = state.bulkCategory === 'prayers' ? '<span class="ml-2 text-charcoal/70">• Use X.Y format: e.g., 1 = on-time, 0.1 = late, 1.2 = 1 on-time + 2 late</span>' : '';
  const familyHint = state.bulkCategory === 'family' ? '<span class="ml-2 text-charcoal/70">• Check box if you connected with that person</span>' : '';

  return '<div class="space-y-4">' +
    // Controls card
    '<div class="sb-card rounded-lg overflow-hidden">' +
      '<div class="px-5 py-3 bg-warmgray" style="border-bottom: 3px solid ' + getAccentColor() + '">' +
        '<h3 class="font-semibold text-charcoal">📅 Bulk Entry</h3>' +
      '</div>' +
      '<div class="p-5 bg-[var(--bg-card)]">' +
        '<div class="flex flex-wrap items-center gap-4">' +
          '<div>' +
            '<label class="text-sm text-charcoal/60 block mb-1">Month</label>' +
            '<select onchange="const [m,y] = this.value.split(\'-\'); setBulkMonth(m, y)" class="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-coral outline-none bg-[var(--bg-input)] text-charcoal">' +
              monthOptions +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label class="text-sm text-charcoal/60 block mb-1">Area</label>' +
            '<div class="flex gap-1 flex-wrap">' + catButtons + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // Info hint
    '<div class="rounded-lg p-3 text-sm" style="background-color: ' + catColor + '15; border-left: 3px solid ' + catColor + '">' +
      '<strong class="text-charcoal">' + monthName + '</strong> <span class="text-charcoal/70">' + cat.label + '</span>' + prayerHint + familyHint +
    '</div>' +
    // Data table
    '<div class="sb-card rounded-lg overflow-hidden">' +
      '<div class="overflow-x-auto">' +
        '<table class="w-full text-sm">' +
          '<thead>' +
            '<tr class="text-white" style="background-color: ' + catColor + '">' +
              '<th class="border px-2 py-3 sticky left-0 z-20" style="border-color: ' + catColor + '; background-color: ' + catColor + '">Day</th>' +
              '<th class="border px-2 py-3 sticky left-10 z-20" style="border-color: ' + catColor + '; background-color: ' + catColor + '"></th>' +
              headerCells +
              '<th class="border px-3 py-3 font-medium" style="border-color: ' + catColor + '">Score</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + tableRows + '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>' +
    // Summary card
    '<div class="sb-card rounded-lg overflow-hidden">' +
      '<div class="px-5 py-3 bg-warmgray" style="border-bottom: 3px solid ' + getAccentColor() + '">' +
        '<h3 class="font-semibold text-charcoal flex items-center gap-2">' + THINGS3_ICONS.lifeScore + ' ' + monthName + ' Summary</h3>' +
      '</div>' +
      '<div class="p-5 bg-[var(--bg-card)]">' +
        '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">' +
          '<div class="bg-warmgray rounded-lg p-3 text-center">' +
            '<div id="bulk-days-logged" class="text-2xl font-bold text-charcoal">' + fmt(daysWithData) + '</div>' +
            '<div class="text-xs text-charcoal/60">Days Logged</div>' +
          '</div>' +
          '<div class="bg-warmgray rounded-lg p-3 text-center">' +
            '<div id="bulk-total-score" class="text-2xl font-bold text-coral">' + fmt(totalScore) + '</div>' +
            '<div class="text-xs text-charcoal/60">Total Score</div>' +
          '</div>' +
          '<div class="bg-warmgray rounded-lg p-3 text-center">' +
            '<div id="bulk-avg-score" class="text-2xl font-bold text-charcoal">' + fmt(avgScore) + '</div>' +
            '<div class="text-xs text-charcoal/60">Avg Daily Score</div>' +
          '</div>' +
          '<div class="bg-warmgray rounded-lg p-3 text-center">' +
            '<div id="bulk-completion" class="text-2xl font-bold text-charcoal">' + completionRate + '%</div>' +
            '<div class="text-xs text-charcoal/60">Completion Rate</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}
