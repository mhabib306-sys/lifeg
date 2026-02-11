// ============================================================================
// REVIEW MODE — OmniFocus-inspired area-by-area GTD review
// ============================================================================
// Walks through areas showing triggers + stale tasks, letting the user
// engage or pass each item.

import { state } from '../state.js';
import { THINGS3_ICONS } from '../constants.js';
import { escapeHtml, getLocalDateString } from '../utils.js';
import { getAreaById } from '../features/areas.js';
import { renderTriggersOutliner } from '../features/triggers.js';
import { saveTasksData } from '../data/storage.js';

// ---------------------------------------------------------------------------
// Stale task criteria
// ---------------------------------------------------------------------------

const STALE_DAYS = 7;

function isTaskStale(task) {
  if (task.completed || task.isNote) return false;
  if (task.status === 'someday') return false;
  if (!task.areaId) return false;
  if (!task.lastReviewedAt) return true;
  const reviewedAt = new Date(task.lastReviewedAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - STALE_DAYS);
  return reviewedAt < cutoff;
}

export function getStaleTasksForArea(areaId) {
  return state.tasksData.filter(t => t.areaId === areaId && isTaskStale(t));
}

export function getTotalStaleTaskCount() {
  return state.tasksData.filter(t => isTaskStale(t)).length;
}

// ---------------------------------------------------------------------------
// Review lifecycle
// ---------------------------------------------------------------------------

export function startReview() {
  state.reviewMode = true;
  state.reviewAreaIndex = 0;
  state.reviewCompletedAreas = [];
  if (typeof window.render === 'function') window.render();
}

export function exitReview() {
  state.reviewMode = false;
  state.reviewAreaIndex = 0;
  state.reviewCompletedAreas = [];
  if (typeof window.render === 'function') window.render();
}

export function reviewNextArea() {
  const areas = state.taskAreas;
  if (state.reviewAreaIndex < areas.length - 1) {
    state.reviewAreaIndex++;
  }
  if (typeof window.render === 'function') window.render();
}

export function reviewPrevArea() {
  if (state.reviewAreaIndex > 0) {
    state.reviewAreaIndex--;
  }
  if (typeof window.render === 'function') window.render();
}

export function reviewEngageTask(taskId) {
  // Mark as reviewed + open modal
  const task = state.tasksData.find(t => t.id === taskId);
  if (task) {
    task.lastReviewedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    saveTasksData();
  }
  // Open task modal
  state.editingTaskId = taskId;
  state.showTaskModal = true;
  if (typeof window.render === 'function') window.render();
}

export function reviewPassTask(taskId) {
  const task = state.tasksData.find(t => t.id === taskId);
  if (task) {
    task.lastReviewedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    saveTasksData();
  }
  if (typeof window.render === 'function') window.render();
}

export function reviewMarkAreaDone() {
  const areas = state.taskAreas;
  const currentArea = areas[state.reviewAreaIndex];
  if (currentArea && !state.reviewCompletedAreas.includes(currentArea.id)) {
    state.reviewCompletedAreas.push(currentArea.id);
  }
  // Mark all remaining stale tasks in this area as reviewed
  const staleTasks = getStaleTasksForArea(currentArea.id);
  staleTasks.forEach(t => {
    t.lastReviewedAt = new Date().toISOString();
    t.updatedAt = new Date().toISOString();
  });
  if (staleTasks.length > 0) saveTasksData();
  // Advance to next unreviewed area
  reviewNextArea();
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

export function renderReviewMode() {
  const areas = state.taskAreas;
  if (areas.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-[var(--bg-secondary)]">
          ${THINGS3_ICONS.review}
        </div>
        <p class="text-lg font-medium mb-1">No areas to review</p>
        <p class="text-sm">Create areas in your workspace first</p>
        <button onclick="exitReview()" class="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
          Exit Review
        </button>
      </div>
    `;
  }

  const currentArea = areas[state.reviewAreaIndex];
  if (!currentArea) {
    state.reviewAreaIndex = 0;
    return renderReviewMode();
  }

  const completedCount = state.reviewCompletedAreas.length;
  const totalAreas = areas.length;
  const progressPercent = totalAreas > 0 ? Math.round((completedCount / totalAreas) * 100) : 0;
  const isCurrentCompleted = state.reviewCompletedAreas.includes(currentArea.id);

  // Get triggers for current area
  const areaTriggers = state.triggers.filter(t => t.areaId === currentArea.id);

  // Get stale tasks for current area
  const staleTasks = getStaleTasksForArea(currentArea.id);

  // Time since last reviewed
  function formatTimeSince(isoStr) {
    if (!isoStr) return 'Never reviewed';
    const diff = Date.now() - new Date(isoStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  const areaColor = currentArea.color || '#147EFB';

  return `
    <div class="review-mode">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 flex items-center justify-center rounded-xl" style="background: ${areaColor}15; color: ${areaColor}">
            ${THINGS3_ICONS.review}
          </span>
          <div>
            <h2 class="text-xl font-bold text-[var(--text-primary)]">Weekly Review</h2>
            <p class="text-sm text-[var(--text-muted)]">${completedCount}/${totalAreas} areas reviewed</p>
          </div>
        </div>
        <button onclick="exitReview()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition">
          Exit Review
        </button>
      </div>

      <!-- Progress bar -->
      <div class="review-progress-bar mb-6">
        <div class="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%; background: ${areaColor}"></div>
        </div>
        <div class="flex justify-between mt-2">
          ${areas.map((a, i) => `
            <button onclick="state.reviewAreaIndex=${i}; render()"
              class="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition
                ${state.reviewCompletedAreas.includes(a.id) ? 'bg-[#34C759] text-white' : i === state.reviewAreaIndex ? 'ring-2 ring-offset-1' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}"
              style="${i === state.reviewAreaIndex ? `ring-color: ${a.color || '#147EFB'}; background: ${a.color || '#147EFB'}20; color: ${a.color || '#147EFB'}` : ''}"
              title="${escapeHtml(a.name)}">
              ${state.reviewCompletedAreas.includes(a.id) ? '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : `${i + 1}`}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Current Area Header -->
      <div class="review-area-header rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-5 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style="background: ${areaColor}15">
              ${currentArea.emoji || THINGS3_ICONS.area.replace('w-5 h-5', 'w-6 h-6')}
            </span>
            <div>
              <h3 class="text-lg font-bold text-[var(--text-primary)]">${escapeHtml(currentArea.name)}</h3>
              <p class="text-sm text-[var(--text-muted)]">${areaTriggers.length} triggers, ${staleTasks.length} tasks to review</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${state.reviewAreaIndex > 0 ? `
              <button onclick="reviewPrevArea()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:bg-[var(--bg-tertiary)] transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              </button>
            ` : ''}
            ${state.reviewAreaIndex < areas.length - 1 ? `
              <button onclick="reviewNextArea()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:bg-[var(--bg-tertiary)] transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Triggers Section -->
      <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden mb-4">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between" style="background: #FFCC0008">
          <div class="flex items-center gap-2">
            <span style="color: #FFCC00">${THINGS3_ICONS.trigger.replace('w-5 h-5', 'w-4 h-4')}</span>
            <span class="text-sm font-semibold text-[var(--text-primary)]">Triggers</span>
            <span class="text-xs text-[var(--text-muted)] ml-1">${areaTriggers.length}</span>
          </div>
          <button onclick="window.createRootTrigger({areaId:'${currentArea.id}'})"
            class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#FFCC00] hover:bg-[#FFCC0010] rounded-lg transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Add Trigger
          </button>
        </div>
        <div class="py-2">
          ${renderTriggersOutliner({ areaId: currentArea.id })}
        </div>
      </div>

      <!-- Stale Tasks Section -->
      <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden mb-4">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Tasks to Review</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${staleTasks.length}</span>
        </div>
        ${staleTasks.length > 0 ? `
          <div class="divide-y divide-[var(--border-light)]">
            ${staleTasks.map(task => `
              <div class="review-task-card px-4 py-3">
                <div class="flex items-start gap-3">
                  <span class="w-5 h-5 mt-0.5 rounded-full border-2 flex-shrink-0" style="border-color: ${areaColor}40"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[var(--text-primary)] truncate">${escapeHtml(task.title || 'Untitled')}</p>
                    <p class="text-xs text-[var(--text-muted)] mt-0.5">${formatTimeSince(task.lastReviewedAt)}</p>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button onclick="reviewEngageTask('${task.id}')"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg transition" style="background: ${areaColor}15; color: ${areaColor}">
                      Engage
                    </button>
                    <button onclick="reviewPassTask('${task.id}')"
                      class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs font-medium rounded-lg hover:bg-[var(--bg-tertiary)] transition">
                      Pass
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="px-4 py-8 text-center">
            <svg class="w-8 h-8 mx-auto mb-2 text-[#34C759] opacity-60" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            <p class="text-sm font-medium text-[var(--text-primary)]">All tasks reviewed</p>
            <p class="text-xs text-[var(--text-muted)] mt-0.5">No stale tasks in this area</p>
          </div>
        `}
      </div>

      <!-- Area Complete Button -->
      <div class="flex items-center justify-center gap-3">
        ${!isCurrentCompleted ? `
          <button onclick="reviewMarkAreaDone()"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition" style="background: ${areaColor}">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Mark Area Reviewed
            </span>
          </button>
        ` : `
          <div class="flex items-center gap-2 text-[#34C759] text-sm font-medium">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Area reviewed
          </div>
        `}
      </div>

      <!-- Review Complete -->
      ${completedCount === totalAreas ? `
        <div class="mt-8 text-center bg-[#34C759]/10 rounded-xl p-6">
          <svg class="w-12 h-12 mx-auto mb-3 text-[#34C759]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <h3 class="text-lg font-bold text-[#34C759] mb-1">Review Complete!</h3>
          <p class="text-sm text-[var(--text-muted)] mb-4">All ${totalAreas} areas have been reviewed</p>
          <button onclick="exitReview()" class="px-5 py-2.5 bg-[#34C759] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">
            Done
          </button>
        </div>
      ` : ''}
    </div>
  `;
}
