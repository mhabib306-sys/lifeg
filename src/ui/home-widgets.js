// ============================================================================
// HOME WIDGETS — Individual widget renderers for the Home dashboard
// ============================================================================
// Extracted from home.js. Each function returns the inner content HTML for a
// widget card.  The shell (header, edit controls, wrapper) lives in home.js.

import { state } from '../state.js';
import { getLocalDateString, formatEventTime, escapeHtml } from '../utils.js';
import { THINGS3_ICONS, getActiveIcons, WEATHER_ICONS, WEATHER_DESCRIPTIONS, defaultDayData, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, GSHEET_SAVED_PROMPT_KEY, GSHEET_RESPONSE_CACHE_KEY } from '../constants.js';

// ---------------------------------------------------------------------------
// Window-bridge helpers (avoid circular imports)
// ---------------------------------------------------------------------------

function calculateScores(data) {
  if (typeof window.calculateScores === 'function') return window.calculateScores(data);
  return { total: 0, prayer: 0, diabetes: 0, whoop: 0, family: 0, habit: 0, prayerOnTime: 0, prayerLate: 0 };
}

function renderTaskItem(task, showDueDate, compact) {
  if (typeof window.renderTaskItem === 'function') return window.renderTaskItem(task, showDueDate, compact);
  return `<div class="py-2 px-3 text-sm text-[var(--text-primary)]">${task.title || 'Untitled'}</div>`;
}

function getFilteredTasks(perspectiveId) {
  if (typeof window.getFilteredTasks === 'function') return window.getFilteredTasks(perspectiveId);
  return [];
}

function getTierForScore(score) {
  if (typeof window.getScoreTier === 'function') return window.getScoreTier(score);
  return { label: '', color: 'var(--text-muted)', emoji: '' };
}

const formatHomeEventTime = formatEventTime;

function normalizeGSheetResponseHtml(rawHtml) {
  const html = String(rawHtml || '');

  // Fallback for non-browser contexts.
  if (typeof document === 'undefined') {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Parse in an isolated template so malformed/unbalanced tags are repaired
  // before insertion into the widget card.
  const template = document.createElement('template');
  template.innerHTML = html;

  const allowedTags = new Set([
    'DIV', 'SPAN', 'STRONG', 'EM', 'BR', 'UL', 'OL', 'LI',
    'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH'
  ]);
  // Note: 'style' removed to prevent CSS injection attacks (e.g., url() exfiltration, overlay attacks)
  const allowedAttrs = new Set(['colspan', 'rowspan']);

  const allElements = Array.from(template.content.querySelectorAll('*'));
  for (const el of allElements) {
    if (!allowedTags.has(el.tagName)) {
      const text = document.createTextNode(el.textContent || '');
      el.replaceWith(text);
      continue;
    }

    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (!allowedAttrs.has(name) || name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return template.innerHTML;
}

// ---------------------------------------------------------------------------
// Widget content renderers
// ---------------------------------------------------------------------------

export function renderStatsWidget(today) {
  const nextLabel = state.taskLabels.find(l => l.name.trim().toLowerCase() === 'next');
  const todayTasksCount = state.tasksData.filter(t => {
    if (t.completed || t.isNote) return false;
    const isDueToday = t.dueDate === today;
    const isOverdue = t.dueDate && t.dueDate < today;
    const isScheduledForToday = t.deferDate && t.deferDate <= today;
    return t.today || isDueToday || isOverdue || isScheduledForToday;
  }).length;
  const nextTasksCount = nextLabel ? state.tasksData.filter(t => {
    if (t.completed || t.isNote) return false;
    const isNextTagged = (t.labels || []).includes(nextLabel.id);
    if (!isNextTagged) return false;
    const isDatedTask = t.today || t.dueDate === today || (t.dueDate && t.dueDate < today);
    return !isDatedTask;
  }).length : 0;
  const completedToday = state.tasksData.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(today)).length;
  const inboxCount = state.tasksData.filter(t => !t.completed && !t.isNote && t.status === 'inbox' && !t.categoryId).length;

  return `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <button type="button" class="quick-stat-item bg-[var(--bg-secondary)] rounded-lg p-3 text-center active:bg-[var(--bg-tertiary)] transition-all" onclick="showPerspectiveTasks('inbox')">
        <div class="text-xl sm:text-2xl font-bold ${inboxCount > 0 ? 'text-[var(--inbox-color)]' : 'text-[var(--text-primary)]'}">${inboxCount}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">In Inbox</div>
      </button>
      <button type="button" class="quick-stat-item bg-[var(--bg-secondary)] rounded-lg p-3 text-center active:bg-[var(--bg-tertiary)] transition-all" onclick="showPerspectiveTasks('today')">
        <div class="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">${todayTasksCount}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">Due Today</div>
      </button>
      <button type="button" class="quick-stat-item bg-[var(--bg-secondary)] rounded-lg p-3 text-center active:bg-[var(--bg-tertiary)] transition-all" onclick="${nextLabel ? `showLabelTasks('${nextLabel.id}')` : 'void(0)'}">
        <div class="text-xl sm:text-2xl font-bold text-[var(--notes-accent)]">${nextTasksCount}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">Tagged Next</div>
      </button>
      <button type="button" class="quick-stat-item bg-[var(--bg-secondary)] rounded-lg p-3 text-center active:bg-[var(--bg-tertiary)] transition-all" onclick="showPerspectiveTasks('logbook')">
        <div class="text-xl sm:text-2xl font-bold text-[var(--success)]">${completedToday}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">Done Today</div>
      </button>
    </div>
  `;
}

export function renderQuickAddWidget() {
  return `
    <div class="flex items-center gap-3">
      <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
        class="quick-add-type-toggle" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
        ${state.quickAddIsNote
          ? `<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-accent)]"></div>`
          : `<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>`
        }
      </div>
      <input type="text" id="home-quick-add-input"
        placeholder="${state.quickAddIsNote ? 'New Note' : 'New To-Do'}"
        onkeydown="if(event._inlineAcHandled)return;if(event.key==='Enter'){event.preventDefault();homeQuickAddTask(this);}"
        class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 bg-transparent border-0 outline-none focus:ring-0">
      <button onclick="homeQuickAddTask(document.getElementById('home-quick-add-input'))"
        class="text-[var(--text-muted)]/40 hover:text-[var(--accent)] transition p-1" title="${state.quickAddIsNote ? 'Add Note' : 'Add Task'}">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
      </button>
    </div>
  `;
}

export function renderTodayTasksWidget(today) {
  const allTodayTasks = state.tasksData.filter(t => {
    if (t.completed || t.isNote) return false;
    const isDueToday = t.dueDate === today;
    const isOverdue = t.dueDate && t.dueDate < today;
    const isScheduledForToday = t.deferDate && t.deferDate <= today;
    return t.today || isDueToday || isOverdue || isScheduledForToday;
  });
  const dueTasks = allTodayTasks.filter(t => (t.dueDate && t.dueDate <= today)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const startingTasks = allTodayTasks.filter(t => {
    const isDueOrOverdue = t.dueDate && t.dueDate <= today;
    const isScheduled = t.deferDate && t.deferDate <= today;
    return isScheduled && !isDueOrOverdue;
  });
  const otherTodayTasks = allTodayTasks.filter(t => !dueTasks.includes(t) && !startingTasks.includes(t));
  const totalCount = allTodayTasks.length;

  if (totalCount === 0) {
    return `<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks for today</div>`;
  }
  return `
    <div class="max-h-[300px] overflow-y-auto">
      ${dueTasks.length > 0 ? `
        <div class="px-2 pt-1 pb-0.5">
          <div class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-[var(--danger)]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>
            <span class="text-[10px] font-semibold text-[var(--danger)] uppercase tracking-wider">Due</span>
            <span class="text-[10px] text-[var(--danger)]">${dueTasks.length}</span>
          </div>
        </div>
        <div>${dueTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
      ` : ''}
      ${otherTodayTasks.length > 0 ? `
        <div>${otherTodayTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
      ` : ''}
      ${startingTasks.length > 0 ? `
        <div class="px-2 pt-1 pb-0.5 ${dueTasks.length > 0 || otherTodayTasks.length > 0 ? 'mt-0.5 border-t border-[var(--border-light)]' : ''}">
          <div class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span class="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">Starting</span>
            <span class="text-[10px] text-[var(--accent)]">${startingTasks.length}</span>
          </div>
        </div>
        <div>${startingTasks.map(task => renderTaskItem(task, false, true)).join('')}</div>
      ` : ''}
      ${totalCount > 8 ? '<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks(\'today\')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ' + totalCount + ' tasks \u2192</button></div>' : ''}
    </div>
  `;
}

export function renderNextTasksWidget(today) {
  const nextLabel = state.taskLabels.find(l => l.name.trim().toLowerCase() === 'next');
  const nextTasks = nextLabel ? state.tasksData.filter(t => {
    if (t.completed || t.isNote) return false;
    const isNextTagged = (t.labels || []).includes(nextLabel.id);
    if (!isNextTagged) return false;
    // Exclude tasks already surfaced in Today widget (today flag, due today, overdue)
    // but NOT tasks with a past deferDate — that just means "available now"
    const isDatedTask = t.today || t.dueDate === today || (t.dueDate && t.dueDate < today);
    return !isDatedTask;
  }) : [];

  if (nextTasks.length === 0) {
    return `<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks tagged "Next"</div>`;
  }
  return `
    <div class="max-h-[300px] overflow-y-auto">
      ${nextTasks.slice(0, 8).map(task => renderTaskItem(task, false, true)).join('')}
      ${nextTasks.length > 8 ? '<div class="px-2 py-2 text-center"><button onclick="showLabelTasks(\'' + nextLabel.id + '\')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ' + nextTasks.length + ' tasks \u2192</button></div>' : ''}
    </div>
  `;
}

export function renderTodayEventsWidget(today) {
  const connected = typeof window.isGCalConnected === 'function' ? window.isGCalConnected() : false;
  const expired = !!state.gcalTokenExpired;
  const events = typeof window.getGCalEventsForDate === 'function' ? (window.getGCalEventsForDate(today) || []) : [];

  if (!connected) {
    return `
      <div class="py-6 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-2">Google Calendar is not connected</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Connect in Settings &rarr;</button>
      </div>
    `;
  }

  if (expired) {
    return `
      <div class="py-6 text-center">
        <p class="text-sm mb-2" style="color: var(--warning)">Calendar session expired</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Reconnect Calendar &rarr;</button>
      </div>
    `;
  }

  if (events.length === 0) {
    return `<div class="py-6 text-center text-[var(--text-muted)] text-sm">No events today</div>`;
  }
  return `
    <div class="max-h-[300px] overflow-y-auto space-y-1">
      ${events.slice(0, 6).map(event => `
        <button
          onclick="${event.htmlLink ? `window.open(decodeURIComponent('${encodeURIComponent(event.htmlLink)}'),'_blank')` : `switchTab('calendar'); calendarSelectDate('${today}')`}"
          class="w-full text-left rounded-lg px-2.5 py-2 hover:bg-[var(--bg-secondary)] transition border border-transparent hover:border-[var(--border-light)]">
          <div class="flex items-start gap-2.5">
            <span class="mt-1 w-2 h-2 rounded-full flex-shrink-0" style="background: var(--success)"></span>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-medium text-[var(--text-primary)] truncate">${escapeHtml(event.summary || '(No title)')}</p>
              <p class="text-[11px] text-[var(--text-muted)] mt-0.5">${formatHomeEventTime(event)}</p>
            </div>
          </div>
        </button>
      `).join('')}
      ${events.length > 6 ? `
        <div class="px-2 py-2 text-center">
          <button onclick="switchTab('calendar'); calendarSelectDate('${today}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${events.length} events &rarr;</button>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderPrayersWidget(today) {
  const todayData = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
  const prayerData = todayData.prayers || {};
  const prayerFields = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const prayersDone = prayerFields.filter(f => prayerData[f] && parseFloat(prayerData[f]) > 0).length;

  return `
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-[var(--text-muted)] font-medium">${prayersDone}/5</span>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      ${['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p, i) => {
        const shortLabels = ['F', 'D', 'A', 'M', 'I'];
        return '<div class="text-center">' +
          '<label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">' + shortLabels[i] + '</label>' +
          '<input type="number" step="0.1" min="0" max="1" value="' + (prayerData[p] || '') + '" placeholder="0"' +
          ' autocomplete="off"' +
          ' onchange="updateDailyField(\'prayers\', \'' + p + '\', this.value)"' +
          ' class="input-field w-full text-center font-medium">' +
          '</div>';
      }).join('')}
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">\uD83D\uDCD6</label>
        <input type="number" step="0.1" value="${prayerData.quran || ''}" placeholder="0"
          autocomplete="off"
          onchange="updateDailyField('prayers', 'quran', this.value)"
          class="input-field w-full text-center font-medium">
      </div>
    </div>
  `;
}

export function renderGlucoseWidget(today) {
  const todayDataG = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
  const glucoseData = todayDataG.glucose || {};
  const libreData = todayDataG.libre || {};
  const libreConnected = typeof window.isLibreConnected === 'function' && window.isLibreConnected();
  const hasLiveGlucose = libreConnected && libreData.currentGlucose;

  let glucoseColor = 'text-[var(--success)]';
  let glucoseBg = 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)]';
  if (hasLiveGlucose) {
    const val = Number(libreData.currentGlucose);
    if (val > 180 || val < 70) { glucoseColor = 'text-[var(--danger)]'; glucoseBg = 'bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]'; }
    else if (val > 140) { glucoseColor = 'text-[var(--warning)]'; glucoseBg = 'bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]'; }
  }

  // 7-day glucose history for sparkline + stats
  const histDays = 7;
  const histData = [];
  let sum90 = 0, count90 = 0;
  for (let i = 89; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = getLocalDateString(d);
    const dd = state.allData[ds];
    const avg = dd?.glucose?.avg ? Number(dd.glucose.avg) : null;
    if (avg) { sum90 += avg; count90++; }
    if (i < histDays) {
      histData.push({ date: ds, avg, tir: dd?.glucose?.tir ? Number(dd.glucose.tir) : null, day: d.toLocaleDateString('en-US', { weekday: 'narrow' }) });
    }
  }

  const eA1C = count90 >= 7 ? ((sum90 / count90 + 46.7) / 28.7).toFixed(1) : null;

  // SVG sparkline
  const sparkVals = histData.map(d => d.avg);
  const hasSparkData = sparkVals.some(v => v !== null);
  let sparklineSvg = '';
  if (hasSparkData) {
    const W = 200, H = 40, pad = 2;
    const vals = sparkVals.map(v => v || 0);
    const min = Math.min(...vals.filter(v => v > 0), 70);
    const max = Math.max(...vals, 180);
    const range = max - min || 1;
    const points = vals.map((v, i) => {
      const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
      const y = v > 0 ? pad + (1 - (v - min) / range) * (H - pad * 2) : H - pad;
      return `${x},${y}`;
    });
    const y140 = pad + (1 - (140 - min) / range) * (H - pad * 2);
    const y70 = pad + (1 - (70 - min) / range) * (H - pad * 2);
    const y180 = Math.max(pad, pad + (1 - (180 - min) / range) * (H - pad * 2));

    sparklineSvg = `
      <svg viewBox="0 0 ${W} ${H}" class="w-full" style="height: 40px;" preserveAspectRatio="none">
        <rect x="0" y="${y180}" width="${W}" height="${y140 - y180}" fill="var(--warning)" opacity="0.12" rx="1"/>
        <rect x="0" y="${y140}" width="${W}" height="${y70 - y140}" fill="var(--success)" opacity="0.15" rx="1"/>
        <polyline points="${points.join(' ')}" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${vals.map((v, i) => {
          if (v <= 0) return '';
          const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
          const y = pad + (1 - (v - min) / range) * (H - pad * 2);
          const dotColor = v > 180 || v < 70 ? 'var(--danger)' : v > 140 ? 'var(--warning)' : 'var(--success)';
          return `<circle cx="${x}" cy="${y}" r="2.5" fill="${dotColor}"/>`;
        }).join('')}
      </svg>
    `;
  }

  const dayLabels = histData.map((d, i) => {
    const isToday = i === histData.length - 1;
    return `<span class="text-[10px] ${isToday ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}">${d.day}</span>`;
  }).join('');

  return `
    ${hasLiveGlucose ? `
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-baseline gap-1.5">
          <span class="text-3xl font-bold leading-none ${glucoseColor}">${libreData.currentGlucose}</span>
          <span class="text-xl ${glucoseColor}">${libreData.trend || '\u2192'}</span>
          <span class="text-[10px] text-[var(--text-muted)] ml-0.5">mg/dL</span>
        </div>
        <button onclick="window.syncLibreNow()" class="inline-flex items-center gap-1 text-[10px] text-[var(--success)] ${glucoseBg} px-1.5 py-0.5 rounded-full transition" title="Sync now">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Sync
        </button>
      </div>
    ` : libreConnected ? `
      <div class="flex justify-end mb-2">
        <button onclick="window.syncLibreNow()" class="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition" title="Sync now">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Sync
        </button>
      </div>
    ` : ''}
    ${hasSparkData ? `
      <div class="mb-3">
        <div class="text-[10px] text-[var(--text-muted)] font-medium mb-1">7-Day Avg Glucose</div>
        ${sparklineSvg}
        <div class="flex justify-between px-0.5 mt-0.5">${dayLabels}</div>
      </div>
    ` : ''}
    <div class="grid ${eA1C ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-2">
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Avg</label>
        ${libreConnected && glucoseData.avg
          ? `<div class="text-sm font-semibold text-[var(--text-primary)]">${glucoseData.avg}</div>`
          : `<input type="number" value="${glucoseData.avg || ''}" placeholder="--" autocomplete="off"
              onchange="updateDailyField('glucose', 'avg', this.value)"
              class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">TIR</label>
        ${libreConnected && glucoseData.tir
          ? `<div class="text-sm font-semibold ${Number(glucoseData.tir) >= 70 ? 'text-[var(--success)]' : Number(glucoseData.tir) >= 50 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}">${glucoseData.tir}%</div>`
          : `<input type="number" value="${glucoseData.tir || ''}" placeholder="--" autocomplete="off"
              onchange="updateDailyField('glucose', 'tir', this.value)"
              class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Insulin</label>
        <input type="number" value="${glucoseData.insulin || ''}" placeholder="--" autocomplete="off"
          onchange="updateDailyField('glucose', 'insulin', this.value)"
          class="input-field w-full text-center font-medium">
      </div>
      ${eA1C ? `
        <div class="text-center">
          <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">eA1C</label>
          <div class="text-sm font-semibold ${Number(eA1C) <= 5.7 ? 'text-[var(--success)]' : Number(eA1C) <= 6.4 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}">${eA1C}%</div>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderWhoopWidget(today) {
  const todayDataW = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
  const whoopData = todayDataW.whoop || {};
  const whoopConnected = typeof window.isWhoopConnected === 'function' && window.isWhoopConnected();
  const whoopLastSync = typeof window.getWhoopLastSync === 'function' ? window.getWhoopLastSync() : null;
  const whoopSyncStr = whoopLastSync
    ? new Date(whoopLastSync).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '';

  return `
    <div class="grid grid-cols-3 gap-3">
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Sleep %</label>
        ${whoopConnected && whoopData.sleepPerf
          ? `<div class="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">${whoopData.sleepPerf}<span class="text-xs text-[var(--text-muted)] ml-0.5">%</span></div>`
          : `<input type="number" value="${whoopData.sleepPerf || ''}" placeholder="--"
          autocomplete="off"
          onchange="updateDailyField('whoop', 'sleepPerf', this.value)"
          class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Recovery</label>
        ${whoopConnected && whoopData.recovery
          ? `<div class="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">${whoopData.recovery}<span class="text-xs text-[var(--text-muted)] ml-0.5">%</span></div>`
          : `<input type="number" value="${whoopData.recovery || ''}" placeholder="--"
          autocomplete="off"
          onchange="updateDailyField('whoop', 'recovery', this.value)"
          class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Strain</label>
        ${whoopConnected && whoopData.strain
          ? `<div class="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">${whoopData.strain}<span class="text-xs text-[var(--text-muted)] ml-0.5">/21</span></div>`
          : `<input type="number" value="${whoopData.strain || ''}" placeholder="--"
          autocomplete="off"
          onchange="updateDailyField('whoop', 'strain', this.value)"
          class="input-field w-full text-center font-medium">`}
      </div>
    </div>
    ${whoopConnected ? `
    <div class="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border-light)]">
      <span class="text-[10px] text-[var(--text-muted)]">${whoopSyncStr ? `Synced ${whoopSyncStr}` : ''}</span>
      <button onclick="this.querySelector('svg').classList.add('animate-spin');this.classList.add('opacity-50','pointer-events-none');syncWhoopNow().finally(()=>render())" class="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] hover:underline font-medium">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        Sync
      </button>
    </div>` : ''}
  `;
}

export function renderHabitsWidget(today) {
  const todayDataH = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
  const habitsData = todayDataH.habits || {};
  const habitFields = ['exercise', 'reading', 'meditation', 'water', 'vitamins'];
  const habitsDone = habitFields.filter(f => habitsData[f]).length;

  return `
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-[var(--text-muted)] font-medium">${habitsDone}/5</span>
    </div>
    <div class="grid grid-cols-5 gap-2">
      ${[
        { field: 'exercise', icon: '\uD83C\uDFCB\uFE0F', label: 'Exercise' },
        { field: 'reading', icon: '\uD83D\uDCDA', label: 'Read' },
        { field: 'meditation', icon: '\uD83E\uDDD8', label: 'Meditate' },
        { field: 'water', icon: '\uD83D\uDCA7', label: 'Water' },
        { field: 'vitamins', icon: '\uD83D\uDC8A', label: 'Vitamins' }
      ].map(h => {
        const isChecked = habitsData[h.field];
        return '<label class="flex flex-col items-center cursor-pointer">' +
          '<span class="text-lg mb-1">' + h.icon + '</span>' +
          '<input type="checkbox" ' + (isChecked ? 'checked' : '') +
          ' onchange="toggleDailyField(\'habits\', \'' + h.field + '\')"' +
          ' class="habit-check w-5 h-5 rounded border-2 border-[var(--notes-accent)]/40 text-[var(--notes-accent)] focus:ring-[var(--notes-accent)]/40 focus:ring-offset-0 cursor-pointer">' +
          '</label>';
      }).join('')}
    </div>
  `;
}

export function renderScoreWidget(today) {
  const todayData2 = state.allData[today] || JSON.parse(JSON.stringify(defaultDayData));
  const rawScores2 = calculateScores(todayData2);
  const norm = rawScores2?.normalized || { prayer: 0, diabetes: 0, whoop: 0, family: 0, habits: 0, overall: 0 };
  const overallPct = Math.round(norm.overall * 100);

  const levelInfo = typeof window.getLevelInfo === 'function' ? window.getLevelInfo(state.xp?.total || 0) : { level: 1, tierName: 'Spark', tierIcon: '\u2728', progress: 0, nextLevelXP: 100, currentLevelXP: 0 };
  const streakCount = state.streak?.current || 0;
  const streakMultiplier = state.streak?.multiplier || 1.0;
  const todayXpEntry = (state.xp?.history || []).find(h => h.date === today);
  const todayXP = todayXpEntry?.total || 0;
  const overallTier = getTierForScore(norm.overall);

  const miniRing = (pct, color) => {
    const r = 16;
    const circ = 2 * Math.PI * r;
    const dash = circ * Math.max(0, Math.min(1, pct));
    return `<svg class="score-mini-ring" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="${r}" fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="3"/>
      <circle cx="20" cy="20" r="${r}" fill="none" stroke="${color}" stroke-width="3"
        stroke-dasharray="${dash} ${circ}" stroke-linecap="round"
        transform="rotate(-90 20 20)" class="transition-all duration-500"/>
      <text x="20" y="21" text-anchor="middle" dominant-baseline="middle"
        class="text-[10px] font-bold" fill="${color}">${Math.round(pct * 100)}</text>
    </svg>`;
  };

  const categories = [
    { key: 'prayer', label: 'Prayer', pct: norm.prayer },
    { key: 'diabetes', label: 'Glucose', pct: norm.diabetes },
    { key: 'whoop', label: 'Whoop', pct: norm.whoop },
    { key: 'family', label: 'Family', pct: norm.family },
    { key: 'habits', label: 'Habits', pct: norm.habits }
  ];

  return `
    <div class="flex items-center gap-4">
      <div class="score-main-ring-container flex-shrink-0">
        <svg class="score-main-ring" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="5"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="${overallTier.color}" stroke-width="5"
            stroke-dasharray="${2 * Math.PI * 34 * norm.overall} ${2 * Math.PI * 34}" stroke-linecap="round"
            transform="rotate(-90 40 40)" class="transition-all duration-700"/>
          <text x="40" y="37" text-anchor="middle" dominant-baseline="middle"
            class="text-lg font-bold" fill="${overallTier.color}">${overallPct}%</text>
          <text x="40" y="50" text-anchor="middle" dominant-baseline="middle"
            class="text-[8px]" fill="var(--text-muted, #9ca3af)">${overallTier.label}</text>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-bold text-[var(--text-primary)]">Level ${levelInfo.level}</span>
          <span class="text-xs text-[var(--text-muted)]">${levelInfo.tierIcon} ${levelInfo.tierName}</span>
        </div>
        ${streakCount > 0 ? `
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-xs font-semibold text-[var(--warning)]">\uD83D\uDD25 ${streakCount}-day streak</span>
            ${streakMultiplier > 1 ? `<span class="text-[10px] text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-1.5 py-0.5 rounded-full font-medium">${streakMultiplier}x</span>` : ''}
          </div>
        ` : `<div class="text-xs text-[var(--text-muted)] mb-1">No active streak</div>`}
        <div class="text-xs text-[var(--text-muted)]">+${todayXP} XP today \u00B7 ${(state.xp?.total || 0).toLocaleString()} total</div>
        <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full mt-1.5 overflow-hidden">
          <div class="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style="width: ${Math.round(levelInfo.progress * 100)}%"></div>
        </div>
        <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${(state.xp?.total || 0).toLocaleString()} / ${levelInfo.nextLevelXP.toLocaleString()} XP</div>
      </div>
    </div>
    <div class="score-categories-grid grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-[var(--border-light)]">
      ${categories.map(c => {
        const tier = getTierForScore(c.pct);
        return `<div class="text-center">
          ${miniRing(c.pct, tier.color)}
          <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${c.label}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

export function renderWeatherWidget() {
  const w = state.weatherData;
  if (!w) {
    return `<div class="py-6 text-center text-[var(--text-muted)] text-sm">Loading weather...</div>`;
  }
  const desc = WEATHER_DESCRIPTIONS[w.weatherCode] || 'Weather';
  const icon = WEATHER_ICONS[w.weatherCode] || '\uD83C\uDF21\uFE0F';
  const temp = Number.isFinite(Number(w.temp)) ? Math.round(Number(w.temp)) : '--';
  const tempMax = Number.isFinite(Number(w.tempMax)) ? Math.round(Number(w.tempMax)) : '--';
  const tempMin = Number.isFinite(Number(w.tempMin)) ? Math.round(Number(w.tempMin)) : '--';
  const humidity = Number.isFinite(Number(w.humidity)) ? Math.max(0, Math.min(100, Math.round(Number(w.humidity)))) : 0;
  const windSpeed = Number.isFinite(Number(w.windSpeed)) ? Math.max(0, Math.round(Number(w.windSpeed))) : 0;
  const city = w.city || 'Current location';
  const maxHour = w.maxHour || '';
  const minHour = w.minHour || '';
  const humidityBar = humidity;
  const windDesc = windSpeed < 10 ? 'Calm' : windSpeed < 25 ? 'Breezy' : 'Windy';

  // Tomorrow's forecast data
  const tomorrow = w.tomorrow;
  const tomorrowDesc = tomorrow ? (WEATHER_DESCRIPTIONS[tomorrow.weatherCode] || 'Weather') : '';
  const tomorrowIcon = tomorrow ? (WEATHER_ICONS[tomorrow.weatherCode] || '\uD83C\uDF21\uFE0F') : '';

  // Delta explanation helper
  const getDeltaText = (delta) => {
    if (delta > 0) return `${delta}° warmer`;
    if (delta < 0) return `${Math.abs(delta)}° cooler`;
    return 'same';
  };

  const getDeltaColor = (delta) => {
    if (delta > 3) return 'var(--warning)';
    if (delta < -3) return 'var(--accent)';
    return 'var(--text-muted)';
  };

  return `
    <div class="weather-widget-content flex items-center gap-3">
      <span class="text-2xl leading-none">${icon}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-bold text-[var(--text-primary)] leading-none">${temp}\u00B0</span>
          <span class="text-xs text-[var(--text-secondary)]">${desc}</span>
        </div>
        <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${city}</div>
      </div>
      <div class="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
        <span class="flex items-center gap-0.5" title="High at ${maxHour}">
          <svg class="w-2.5 h-2.5 text-[var(--warning)]" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
          <span class="font-semibold text-[var(--text-primary)]">${tempMax}\u00B0</span>
        </span>
        <span class="flex items-center gap-0.5" title="Low at ${minHour}">
          <svg class="w-2.5 h-2.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
          <span class="font-semibold text-[var(--text-primary)]">${tempMin}\u00B0</span>
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3 mt-2 text-[11px] text-[var(--text-muted)]">
      <span class="flex items-center gap-1">
        <svg class="w-3 h-3 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>
        ${humidity}%
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3c0-1.17.67-2.18 1.65-2.67L9.5 2h4l-.65 12.33c.98.49 1.65 1.5 1.65 2.67z"/></svg>
        ${windSpeed} km/h · ${windDesc}
      </span>
    </div>
    ${tomorrow ? `
    <div class="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border-light)] text-[11px]">
      <span class="text-[var(--text-muted)] font-medium">Tmrw</span>
      <span>${tomorrowIcon}</span>
      <span class="text-[var(--text-secondary)]">${tomorrowDesc}</span>
      <span class="ml-auto flex items-center gap-2">
        <span class="font-semibold text-[var(--text-primary)]">${tomorrow.tempMax}°<span class="text-[var(--text-muted)] font-normal">/</span>${tomorrow.tempMin}°</span>
        <span class="font-medium" style="color: ${getDeltaColor(tomorrow.avgDelta)}">${tomorrow.avgDelta === 0 ? 'same' : getDeltaText(tomorrow.avgDelta)}</span>
      </span>
    </div>
    ` : ''}
  `;
}

export function renderPerspectiveWidget(widget, today) {
  const allPerspectives = [...BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, ...(state.customPerspectives || [])];
  const perspective = allPerspectives.find(p => p.id === widget.perspectiveId);

  if (!perspective) {
    return `
      <div class="py-6 text-center">
        <p class="text-[var(--text-muted)] text-sm mb-2">View not found</p>
        <button onclick="removePerspectiveWidget('${widget.id}')" class="text-xs text-[var(--danger)] hover:underline">Remove widget</button>
      </div>
    `;
  }

  if (widget.perspectiveId === 'notes') {
    const noteCount = state.tasksData.filter(t => t.isNote && !t.completed).length;
    return `
      <div class="py-4 text-center">
        <div class="text-2xl font-bold text-[var(--text-primary)] mb-1">${noteCount}</div>
        <div class="text-xs text-[var(--text-muted)] mb-3">note${noteCount !== 1 ? 's' : ''}</div>
        <button onclick="showPerspectiveTasks('notes')" class="text-xs text-[var(--accent)] hover:underline font-medium">Open Notes &rarr;</button>
      </div>
    `;
  }

  const perspTasks = getFilteredTasks(widget.perspectiveId);
  const taskCount = perspTasks.length;

  if (taskCount === 0) {
    return `<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks</div>`;
  }
  return `
    <div class="max-h-[300px] overflow-y-auto">
      ${perspTasks.slice(0, 8).map(task => renderTaskItem(task, false, true)).join('')}
      ${taskCount > 8 ? `<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks('${widget.perspectiveId}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${taskCount} tasks &rarr;</button></div>` : ''}
    </div>
  `;
}

export function renderGSheetWidget(today) {
  const connected = typeof window.isGCalConnected === 'function' ? window.isGCalConnected() : false;
  const hasApiKey = !!(typeof window.getAnthropicKey === 'function' && window.getAnthropicKey());
  const syncing = state.gsheetSyncing;
  const asking = state.gsheetAsking;
  const savedPrompt = localStorage.getItem(GSHEET_SAVED_PROMPT_KEY) || '';
  const editing = state.gsheetEditingPrompt;
  const response = state.gsheetResponse || localStorage.getItem(GSHEET_RESPONSE_CACHE_KEY) || '';

  if (!hasApiKey) {
    return `
      <div class="py-6 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-2">Claude API key not configured</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Add in Settings &rarr;</button>
      </div>
    `;
  }

  if (!connected) {
    return `
      <div class="py-6 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-2">Google Calendar not connected</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Connect in Settings &rarr;</button>
      </div>
    `;
  }

  if (!savedPrompt || editing) {
    return `
      <div class="flex items-center gap-2">
        <input id="gsheet-prompt-input" type="text" placeholder="e.g. Summarize my last 14 days..."
          value="${escapeHtml(savedPrompt)}"
          onkeydown="if(event.key==='Enter'){event.preventDefault();handleGSheetSavePrompt()}${editing ? ";if(event.key==='Escape'){event.preventDefault();handleGSheetCancelEdit()}" : ''}"
          class="input-field flex-1"
        />
        <button onclick="handleGSheetSavePrompt()" class="p-2 rounded-lg text-white bg-[var(--accent)] hover:opacity-90 transition flex-shrink-0" title="Save prompt">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </button>
        ${editing ? `<button onclick="handleGSheetCancelEdit()" class="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition flex-shrink-0" title="Cancel">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>` : ''}
      </div>
      ${!savedPrompt ? `<div class="mt-4 py-4 text-center text-[var(--text-muted)] text-xs">Set a prompt to auto-generate insights from your sheet data</div>` : ''}
    `;
  }

  // Has saved prompt — show response
  const sheetData = state.gsheetData;
  const tabCount = sheetData?.tabs?.length || 0;
  const tabNames = sheetData?.tabs?.map(t => t.name).join(', ') || '';

  let responseHtml = '';
  if (asking) {
    responseHtml = `
      <div class="py-6 text-center">
        <svg class="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0110 10"/></svg>
        <span class="text-sm text-[var(--text-muted)]">Generating...</span>
      </div>`;
  } else if (response) {
    const isError = response.startsWith('Error:');
    const responseContent = isError ? escapeHtml(response) : normalizeGSheetResponseHtml(response);
    responseHtml = `
      <div class="max-h-[300px] overflow-y-auto">
        <div class="gsheet-response text-sm leading-relaxed overflow-x-auto ${isError ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}">${responseContent}</div>
      </div>
    `;
  } else {
    responseHtml = `<div class="py-6 text-center text-[var(--text-muted)] text-xs">No response yet</div>`;
  }

  return `
    ${responseHtml}
    <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-light)]">
      <button onclick="handleGSheetEditPrompt()" class="flex-1 min-w-0 text-left group" title="Click to edit prompt">
        <span class="text-[10px] text-[var(--text-muted)] truncate block group-hover:text-[var(--accent)] transition">${escapeHtml(savedPrompt)}</span>
      </button>
      <div class="flex items-center gap-3 ml-3 flex-shrink-0">
        ${tabCount ? `<span class="text-[10px] text-[var(--text-muted)]" title="${escapeHtml(tabNames)}">${tabCount} tabs</span>` : ''}
        <button onclick="handleGSheetRefresh()" class="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] font-medium hover:opacity-80 transition ${asking || syncing ? 'opacity-50 pointer-events-none' : ''}" ${asking || syncing ? 'disabled' : ''} title="Re-run prompt">
          <svg class="w-3 h-3 ${asking ? 'animate-spin' : ''}" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Refresh
        </button>
      </div>
    </div>
  `;
}

// ============================================================================
// Widget metadata — icons and colors used by the widget chrome in home.js
// ============================================================================

export const WIDGET_ICONS = {
  'stats': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',
  'quick-add': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  'today-tasks': getActiveIcons().today,
  'today-events': getActiveIcons().calendar,
  'next-tasks': getActiveIcons().next,
  'prayers': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
  'glucose': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>',
  'whoop': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',
  'habits': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  'weather': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>',
  'score': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>',
  'gsheet-yesterday': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h5v-5h-5v5zm-6-5h5V7H6v5zm6-5v3h5V7h-5zM6 14h5v3H6v-3z"/></svg>'
};

// Widget accent colors — use CSS variable references so they adapt to the active theme.
// getComputedStyle() is called at render-time by home.js, so these resolve correctly.
export function getWidgetColor(widgetType) {
  const style = getComputedStyle(document.documentElement);
  const v = (name) => style.getPropertyValue(name).trim();
  const map = {
    'stats': v('--text-muted') || '#6B7280',
    'quick-add': v('--accent') || '#147EFB',
    'today-tasks': v('--today-color') || '#FFCA28',
    'today-events': v('--success') || '#2F9B6A',
    'next-tasks': v('--notes-accent') || '#8E8E93',
    'prayers': v('--success') || '#10B981',
    'glucose': v('--danger') || '#EF4444',
    'whoop': v('--accent') || '#3B82F6',
    'habits': v('--notes-accent') || '#8E8E93',
    'weather': v('--warning') || '#F59E0B',
    'score': v('--success') || '#22C55E',
    'gsheet-yesterday': v('--success') || '#34A853'
  };
  return map[widgetType] || v('--text-muted') || '#6B7280';
}

// Legacy static map kept for callers that don't need theme-awareness
export const WIDGET_COLORS = {
  'stats': '#6B7280',
  'quick-add': '#147EFB',
  'today-tasks': '#FFCA28',
  'today-events': '#2F9B6A',
  'next-tasks': '#8E8E93',
  'prayers': '#10B981',
  'glucose': '#EF4444',
  'whoop': '#3B82F6',
  'habits': '#8E8E93',
  'weather': '#F59E0B',
  'score': '#22C55E',
  'gsheet-yesterday': '#34A853'
};
