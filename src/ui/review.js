// ============================================================================
// REVIEW MODE — OmniFocus-inspired area-by-area GTD review
// ============================================================================
// Walks through areas showing triggers + stale tasks, letting the user
// engage or pass each item.

import { state } from '../state.js';
import { THINGS3_ICONS, getActiveIcons } from '../constants.js';
import { escapeHtml, getLocalDateString } from '../utils.js';
import { getAreaById } from '../features/areas.js';
import { renderTriggersOutliner } from '../features/triggers.js';
import { saveTasksData } from '../data/storage.js';
import { createTask } from '../features/tasks.js';

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

/**
 * Check if weekly review is overdue (more than 7 days since last review)
 */
export function isWeeklyReviewOverdue() {
  if (!state.lastWeeklyReview) return true; // Never reviewed
  const lastReview = new Date(state.lastWeeklyReview);
  const now = new Date();
  const daysSinceReview = Math.floor((now - lastReview) / (1000 * 60 * 60 * 24));
  return daysSinceReview >= 7;
}

/**
 * Get days since last review (for display)
 */
export function getDaysSinceReview() {
  if (!state.lastWeeklyReview) return null;
  const lastReview = new Date(state.lastWeeklyReview);
  const now = new Date();
  return Math.floor((now - lastReview) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Review lifecycle
// ---------------------------------------------------------------------------

export function startReview() {
  state.reviewMode = true;
  state.reviewAreaIndex = 0;
  state.reviewCompletedAreas = [];
  state.reviewTriggersCollapsed = true;
  state.reviewProjectsCollapsed = true;
  if (typeof window.render === 'function') window.render();
}

export function exitReview() {
  // If all areas were reviewed, mark review as complete
  const allAreasReviewed = state.reviewCompletedAreas.length === state.taskAreas.length;
  if (allAreasReviewed) {
    const now = new Date().toISOString();
    state.lastWeeklyReview = now;
    localStorage.setItem('nucleusLastWeeklyReview', now);
  }

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
// Review-mode task creation (opens modal without leaving review)
// ---------------------------------------------------------------------------

export function reviewAddTask(areaId, status = 'anytime', today = false) {
  state.editingTaskId = null;
  state.newTaskContext = {
    areaId,
    categoryId: null,
    labelId: null,
    labelIds: null,
    personId: null,
    status,
    today,
  };
  state.showTaskModal = true;
  if (typeof window.render === 'function') window.render();
  setTimeout(() => {
    const titleInput = document.getElementById('task-title');
    if (titleInput) titleInput.focus();
  }, 50);
}

/**
 * Quick-add a task or note directly in review mode (no modal).
 * Supports inline autocomplete: #label +person due:date in the input.
 * @param {string} areaId - Current area being reviewed
 * @param {HTMLInputElement} inputElement - The quick-add input
 * @param {boolean} isNote - If true, create a note; otherwise a task
 */
export function reviewQuickAddTask(areaId, inputElement, isNote) {
  const title = inputElement?.value?.trim();
  if (!title) return;

  const options = {
    areaId,
    status: isNote ? 'anytime' : 'inbox',
    isNote: !!isNote,
  };

  const inlineMeta = state.inlineAutocompleteMeta.get('review-quick-add-input');
  if (inlineMeta) {
    if (inlineMeta.labels?.length) options.labels = inlineMeta.labels;
    if (inlineMeta.people?.length) options.people = inlineMeta.people;
    if (inlineMeta.deferDate) options.deferDate = inlineMeta.deferDate;
    if (inlineMeta.dueDate) options.dueDate = inlineMeta.dueDate;
  }

  createTask(title, options);

  inputElement.value = '';
  window.cleanupInlineAutocomplete?.('review-quick-add-input');
  if (typeof window.render === 'function') window.render();

  setTimeout(() => {
    const input = document.getElementById('review-quick-add-input');
    if (input) input.focus();
  }, 50);
}

/**
 * Handle Enter key in review quick-add input.
 * Respects _inlineAcHandled from inline autocomplete.
 */
export function reviewHandleQuickAddKeydown(event, inputElement, areaId) {
  if (event._inlineAcHandled) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    reviewQuickAddTask(areaId, inputElement, state.quickAddIsNote);
  }
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

export function renderReviewMode() {
  // Filter out any falsy/corrupted entries to prevent infinite recursion
  const areas = state.taskAreas.filter(Boolean);
  if (areas.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-[var(--bg-secondary)]">
          ${getActiveIcons().review}
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

  // Get active projects in this area (GTD Phase 2.1)
  const areaProjects = state.tasksData.filter(t =>
    t.areaId === currentArea.id &&
    t.isProject &&
    !t.completed
  );

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
          <span class="w-10 h-10 flex items-center justify-center rounded-lg" style="background: ${areaColor}15; color: ${areaColor}">
            ${getActiveIcons().review}
          </span>
          <div>
            <h2 class="text-xl font-bold text-[var(--text-primary)]">Weekly Review</h2>
            <p class="text-sm text-[var(--text-muted)]">One area at a time — take your time</p>
          </div>
        </div>
        <button onclick="exitReview()" class="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition" title="Leave review (progress is saved)" aria-label="Leave review (progress is saved)">
          Exit Review
        </button>
      </div>

      <!-- Progress bar -->
      <div class="review-progress-bar mb-6">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-medium text-[var(--text-muted)]">${completedCount} of ${totalAreas} areas</span>
          ${progressPercent > 0 ? `<span class="text-xs text-[var(--text-muted)]">${progressPercent}%</span>` : ''}
        </div>
        <div class="h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%; background: ${areaColor}"></div>
        </div>
        <div class="flex justify-between mt-2">
          ${areas.map((a, i) => `
            <button onclick="state.reviewAreaIndex=${i}; render()"
              class="review-progress-dot w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition
                ${state.reviewCompletedAreas.includes(a.id) ? 'bg-[var(--success)] text-white' : i === state.reviewAreaIndex ? 'ring-2 ring-offset-1' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}"
              style="${i === state.reviewAreaIndex ? `ring-color: ${a.color || '#147EFB'}; background: ${a.color || '#147EFB'}20; color: ${a.color || '#147EFB'}` : ''}"
              title="${escapeHtml(a.name)}">
              ${state.reviewCompletedAreas.includes(a.id) ? '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : `${i + 1}`}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Current Area Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style="background: ${areaColor}15">
            ${currentArea.emoji || getActiveIcons().area.replace('w-5 h-5', 'w-6 h-6')}
          </span>
          <div>
            <h3 class="text-lg font-bold text-[var(--text-primary)]">${escapeHtml(currentArea.name)}</h3>
            <p class="text-sm text-[var(--text-muted)]">${areaProjects.length} projects, ${areaTriggers.length} triggers, ${staleTasks.length} tasks to review</p>
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

      <!-- Projects Section (collapsible) -->
      ${areaProjects.length > 0 ? `
        <div class="mb-6 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden">
          <button onclick="state.reviewProjectsCollapsed = !state.reviewProjectsCollapsed; render()"
            class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)]/30 transition">
            <div class="flex items-center gap-2">
              <span>📋</span>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Projects</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${areaProjects.length}</span>
            </div>
            <span class="text-[var(--text-muted)] transition-transform ${state.reviewProjectsCollapsed ? '' : 'rotate-180'}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          ${!state.reviewProjectsCollapsed ? `
          <div class="px-4 py-2 border-t border-[var(--border-light)]">
            <p class="text-xs text-[var(--text-muted)] italic">Check progress and next steps</p>
          </div>
          <div class="divide-y divide-[var(--border-light)]">
            ${areaProjects.map(project => {
              const completion = window.getProjectCompletion?.(project.id) || 0;
              const subTasksCount = window.getProjectSubTasks?.(project.id)?.length || 0;
              const isStalled = window.isProjectStalled?.(project.id) || false;
              return `
                <div class="px-4 py-3 hover:bg-[var(--bg-secondary)]/30 transition cursor-pointer" onclick="reviewEngageTask('${project.id}')">
                  <div class="flex items-start gap-3">
                    <span class="w-5 h-5 mt-0.5 text-lg flex-shrink-0">📋</span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="text-sm font-medium text-[var(--text-primary)] truncate">${escapeHtml(project.title || 'Untitled Project')}</p>
                        ${isStalled ? `<span class="px-1.5 py-0.5 bg-[var(--warning)]/15 text-[var(--warning)] text-[10px] font-medium rounded">Stalled</span>` : ''}
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all" style="width: ${completion}%; background: ${areaColor}"></div>
                        </div>
                        <span class="text-xs text-[var(--text-muted)] tabular-nums">${completion}%</span>
                      </div>
                      <p class="text-xs text-[var(--text-muted)] mt-1">${subTasksCount} ${subTasksCount === 1 ? 'task' : 'tasks'} · ${project.projectType === 'sequential' ? '📝 Sequential' : '📋 Parallel'}</p>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Step guidance -->
      <p class="text-xs text-[var(--text-muted)] mb-4">Review each task, then mark the area done.</p>

      <!-- Two-column layout: Triggers | Tasks -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <!-- Left: Triggers (collapsible) -->
        <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
          <button onclick="state.reviewTriggersCollapsed = !state.reviewTriggersCollapsed; render()"
            class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)]/30 transition" style="background: #FFCC0008">
            <div class="flex items-center gap-2">
              <span class="review-step-badge text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)]">1</span>
              <span style="color: #FFCC00">${getActiveIcons().trigger.replace('w-5 h-5', 'w-4 h-4')}</span>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Triggers</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${areaTriggers.length}</span>
            </div>
            <span class="text-[var(--text-muted)] transition-transform ${state.reviewTriggersCollapsed ? '' : 'rotate-180'}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          ${state.reviewTriggersCollapsed ? `
          <div class="px-4 py-3 border-t border-[var(--border-light)]">
            <p class="text-xs text-[var(--text-muted)]">Click to expand — review triggers for new ideas</p>
          </div>
          ` : `
          <div class="border-t border-[var(--border-light)] flex items-center justify-between px-4 py-2" style="background: #FFCC0005">
            <span class="text-xs text-[var(--text-muted)]">Read each — does anything need a new task?</span>
            <button onclick="event.stopPropagation(); window.createRootTrigger({areaId:'${currentArea.id}'})"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#FFCC00] hover:bg-[#FFCC0010] rounded-lg transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add
            </button>
          </div>
          <div class="py-2 flex-1 overflow-y-auto" style="max-height: 60vh">
            ${renderTriggersOutliner({ areaId: currentArea.id })}
          </div>
          `}
        </div>

        <!-- Right: Tasks + Capture -->
        <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
          <div class="px-4 py-3 border-b border-[var(--border-light)]">
            <div class="flex items-center gap-2">
              <span class="review-step-badge text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)]">2</span>
              <svg class="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Tasks</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${staleTasks.length} to review</span>
            </div>
          </div>
          <!-- Direct quick-add: type and Enter to add task/note without modal -->
          <div class="quick-add-section px-4 py-2.5 border-b border-[var(--border-light)] flex items-center gap-2">
            <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
              class="quick-add-type-toggle flex-shrink-0 cursor-pointer" title="${state.quickAddIsNote ? 'Switch to Task' : 'Switch to Note'}">
              ${state.quickAddIsNote
                ? '<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>'
                : '<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30"></div>'}
            </div>
            <input type="text" id="review-quick-add-input"
              placeholder="Add a quick task or note..."
              onkeydown="window.reviewHandleQuickAddKeydown(event, this, '${currentArea.id}')"
              class="flex-1 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.reviewQuickAddTask('${currentArea.id}', document.getElementById('review-quick-add-input'), state.quickAddIsNote)"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition p-1 flex-shrink-0" title="${state.quickAddIsNote ? 'Add note' : 'Add task'}">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto" style="max-height: 60vh">
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
                          class="review-action-btn px-3 py-2 min-h-[44px] text-xs font-medium rounded-lg transition" style="background: ${areaColor}15; color: ${areaColor}">
                          Open
                        </button>
                        <button onclick="reviewPassTask('${task.id}')"
                          class="review-action-btn px-3 py-2 min-h-[44px] bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs font-medium rounded-lg hover:bg-[var(--bg-tertiary)] transition">
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="px-4 py-8 text-center">
                <svg class="w-8 h-8 mx-auto mb-2 text-[var(--success)] opacity-60" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <p class="text-sm font-medium text-[var(--text-primary)]">All caught up in this area</p>
                <p class="text-xs text-[var(--text-muted)] mt-0.5">Nothing to review here — or add a quick task below</p>
                <button onclick="reviewMarkAreaDone()" class="mt-3 text-xs font-medium text-[var(--accent)] hover:underline">
                  Continue to next area
                </button>
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Area Complete Button (sticky on mobile) -->
      <div class="review-mark-done-bar flex items-center justify-center gap-3 mt-6">
        ${!isCurrentCompleted ? `
          <button onclick="reviewMarkAreaDone()"
            class="review-mark-done-btn px-6 py-3 rounded-lg text-base font-semibold text-white shadow-sm hover:opacity-90 transition" style="background: ${areaColor}">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Mark area done
            </span>
          </button>
        ` : `
          <div class="flex items-center gap-2 text-[var(--success)] text-sm font-medium">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Area done
          </div>
        `}
      </div>

      <!-- Review Complete -->
      ${completedCount === totalAreas ? `
        <div class="mt-10 text-center bg-[var(--success)]/10 rounded-xl p-8 border border-[var(--success)]/20">
          <svg class="w-14 h-14 mx-auto mb-4 text-[var(--success)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <h3 class="text-xl font-bold text-[var(--success)] mb-2">Review complete!</h3>
          <p class="text-sm text-[var(--text-muted)] mb-5">All ${totalAreas} areas done — great work.</p>
          <button onclick="exitReview()" class="px-6 py-3 bg-[var(--success)] text-white rounded-lg text-base font-semibold hover:opacity-90 transition">
            Done
          </button>
        </div>
      ` : ''}
    </div>
  `;
}
