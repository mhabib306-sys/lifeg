// ============================================================================
// CALENDAR VIEW MODULE
// ============================================================================

import { state } from '../state.js';
import { getTasksForDate } from '../features/calendar.js';
import { THINGS3_ICONS, MEETING_NOTES_KEY } from '../constants.js';
import { escapeHtml, getLocalDateString } from '../utils.js';

function getEventKey(event) {
  if (!event) return '';
  const scope = state.calendarMeetingNotesScope || 'instance';
  if (scope === 'series' && event.recurringEventId) {
    return `${event.calendarId}::series::${event.recurringEventId}`;
  }
  return `${event.calendarId}::instance::${event.id}`;
}

function persistMeetingNotes() {
  localStorage.setItem(MEETING_NOTES_KEY, JSON.stringify(state.meetingNotesByEvent || {}));
  if (typeof window.debouncedSaveToGithub === 'function') {
    window.debouncedSaveToGithub();
  }
}

function findCalendarEvent(calendarId, eventId) {
  return (state.gcalEvents || []).find(e => e.calendarId === calendarId && e.id === eventId) || null;
}

function getEventDateStr(event) {
  if (!event) return getLocalDateString();
  if (event.start?.date) return event.start.date;
  const dt = event.start?.dateTime || '';
  return dt.slice(0, 10) || getLocalDateString();
}

function ensureMeetingNoteDoc(event) {
  const eventKey = getEventKey(event);
  if (!eventKey) return null;

  if (!state.meetingNotesByEvent) state.meetingNotesByEvent = {};
  if (!state.meetingNotesByEvent[eventKey]) {
    state.meetingNotesByEvent[eventKey] = {
      eventKey,
      calendarId: event.calendarId,
      eventId: event.id,
      title: event.summary || 'Untitled Event',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persistMeetingNotes();
  }

  return state.meetingNotesByEvent[eventKey];
}

function getMeetingNotesEvent() {
  const key = state.calendarMeetingNotesEventKey;
  if (!key) return null;
  const parts = key.split('::');
  if (parts.length < 3) return null;
  const [calendarId, scope, scopeId] = parts;
  if (scope === 'series') {
    return (state.gcalEvents || []).find(e => e.calendarId === calendarId && e.recurringEventId === scopeId) || null;
  }
  return findCalendarEvent(calendarId, scopeId) || null;
}

function getMeetingLinkedItems(eventKey) {
  if (!eventKey) return [];
  return state.tasksData.filter(t => t.meetingEventKey === eventKey);
}

function renderMultilineText(text) {
  return escapeHtml(text || '').replace(/\n/g, '<br>');
}

function getSelectedModalEvent() {
  if (!state.calendarEventModalOpen) return null;
  return findCalendarEvent(state.calendarEventModalCalendarId, state.calendarEventModalEventId);
}

function formatEventDateLabel(event) {
  if (!event) return '';
  if (event.allDay && event.start?.date) {
    const d = new Date(event.start.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  if (event.start?.dateTime) {
    const d = new Date(event.start.dateTime);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  return '';
}

function formatEventTimeLabel(event) {
  if (!event) return '';
  if (event.allDay) return 'All day';
  if (!event.start?.dateTime) return '';

  const start = new Date(event.start.dateTime);
  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (!event.end?.dateTime) return startTime;

  const end = new Date(event.end.dateTime);
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${startTime} - ${endTime}`;
}

function q(str) {
  return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function renderCalendarSidebarTaskItem(task) {
  const title = escapeHtml(task.title || 'Untitled task');
  const due = task.dueDate ? escapeHtml(task.dueDate) : '';
  const dueBadge = due ? `<span class="text-[10px] text-[var(--text-muted)]">${due}</span>` : '';
  return `
    <div class="px-4 py-2.5 border-b border-[var(--border-light)]/60 last:border-b-0">
      <div class="flex items-start gap-2.5">
        <button
          onclick="event.stopPropagation(); window.toggleTaskComplete('${q(task.id)}')"
          class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] flex-shrink-0 flex items-center justify-center transition-all"
          aria-label="Mark task complete: ${title}">
        </button>
        <button
          onclick="window.inlineEditingTaskId=null; window.editingTaskId='${q(task.id)}'; window.showTaskModal=true; window.render()"
          class="flex-1 min-w-0 text-left">
          <div class="text-[14px] leading-snug text-[var(--text-primary)] break-words">${title}</div>
          ${dueBadge}
        </button>
      </div>
    </div>
  `;
}

function dateToStr(dateObj) {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

export function openCalendarEventActions(calendarId, eventId) {
  state.calendarEventModalOpen = true;
  state.calendarEventModalCalendarId = calendarId;
  state.calendarEventModalEventId = eventId;
  window.render();
}

export function closeCalendarEventActions() {
  state.calendarEventModalOpen = false;
  state.calendarEventModalCalendarId = null;
  state.calendarEventModalEventId = null;
  window.render();
}

export function openCalendarMeetingNotes(calendarId, eventId) {
  const event = findCalendarEvent(calendarId, eventId);
  if (!event) return;
  const doc = ensureMeetingNoteDoc(event);
  if (!doc) return;

  state.calendarMeetingNotesEventKey = doc.eventKey;
  state.calendarEventModalOpen = false;
  state.calendarEventModalCalendarId = null;
  state.calendarEventModalEventId = null;
  window.render();
}

export function setCalendarMeetingNotesScope(scope) {
  if (!['instance', 'series'].includes(scope)) return;
  state.calendarMeetingNotesScope = scope;
  const event = getMeetingNotesEvent();
  if (!event) return window.render();
  const doc = ensureMeetingNoteDoc(event);
  if (doc) state.calendarMeetingNotesEventKey = doc.eventKey;
  window.render();
}

export function closeCalendarMeetingNotes() {
  state.calendarMeetingNotesEventKey = null;
  window.render();
}

export function convertCalendarEventToTask(calendarId, eventId, followUpDays = 0) {
  const event = findCalendarEvent(calendarId, eventId);
  if (!event) return;
  const dueBase = getEventDateStr(event);
  const due = new Date(`${dueBase}T12:00:00`);
  due.setDate(due.getDate() + (Number(followUpDays) || 0));
  const dueDate = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`;
  const isFollowUp = Number(followUpDays) > 0;
  const title = isFollowUp ? `Follow up: ${event.summary || 'Meeting'}` : (event.summary || 'Meeting');
  const description = [event.description, event.htmlLink].filter(Boolean).join('\n\n');
  window.createTask?.(title, {
    status: 'anytime',
    dueDate,
    notes: description,
    meetingEventKey: getEventKey(event),
  });
  state.calendarEventModalOpen = false;
  state.calendarEventModalCalendarId = null;
  state.calendarEventModalEventId = null;
  window.render();
}

export function startCalendarEventDrag(calendarId, eventId) {
  state.draggedCalendarEvent = { calendarId, eventId };
}

export function clearCalendarEventDrag() {
  state.draggedCalendarEvent = null;
}

export async function dropCalendarEventToSlot(dateStr, hour) {
  const drag = state.draggedCalendarEvent;
  if (!drag) return;
  const event = findCalendarEvent(drag.calendarId, drag.eventId);
  state.draggedCalendarEvent = null;
  if (!event) return;
  await window.rescheduleGCalEventIfConnected?.(event, dateStr, hour);
}

export function addMeetingLinkedItem(itemType = 'note') {
  const key = state.calendarMeetingNotesEventKey;
  if (!key) return;
  const input = document.getElementById('meeting-item-input');
  const title = String(input?.value || '').trim();
  if (!title) return;

  const event = getMeetingNotesEvent();
  if (!event) return;
  ensureMeetingNoteDoc(event);

  window.createTask?.(title, {
    isNote: itemType !== 'task',
    status: 'anytime',
    meetingEventKey: key,
    notes: '',
  });
  if (input) input.value = '';
  window.render();
}

export function handleMeetingItemInputKeydown(event, itemType = 'note') {
  if (event.key === 'Enter') {
    event.preventDefault();
    addMeetingLinkedItem(itemType);
  }
}

function renderMeetingNotesPage() {
  const event = getMeetingNotesEvent();
  if (!event) {
    return `
      <div class="bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] p-8 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-4">This event is no longer in the current sync window.</p>
        <button onclick="closeCalendarMeetingNotes()" class="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium">Back to Calendar</button>
      </div>
    `;
  }

  const key = getEventKey(event);
  const doc = ensureMeetingNoteDoc(event);
  const legacyNotes = doc?.content || '';
  const eventDate = formatEventDateLabel(event);
  const eventTime = formatEventTimeLabel(event);
  const attendees = Array.isArray(event.attendees) ? event.attendees : [];
  const linkedItems = getMeetingLinkedItems(key);
  const openItems = linkedItems.filter(item => !item.completed);
  const completedItems = linkedItems.filter(item => item.completed);
  const itemRows = openItems.length > 0
    ? openItems.map(task => {
      const marker = task.isNote
        ? '<span class="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5"></span>'
        : `<button onclick="event.stopPropagation(); window.toggleTaskComplete('${q(task.id)}')" class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] transition"></button>`;
      return `
        <div class="px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-start gap-2.5">
          ${marker}
          <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${q(task.id)}'; window.showTaskModal=true; window.render()" class="text-left flex-1 text-sm text-[var(--text-primary)] leading-snug">
            ${escapeHtml(task.title || 'Untitled')}
          </button>
        </div>
      `;
    }).join('')
    : '<div class="text-sm text-[var(--text-muted)] px-1 py-2">No bullet points yet.</div>';

  return `
    <div class="calendar-meeting-notes-page bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] overflow-hidden">
      <div class="calendar-meeting-notes-header px-5 py-4 border-b border-[var(--border-light)] flex flex-wrap items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Meeting Workspace</div>
          <h2 class="text-lg font-semibold text-[var(--text-primary)] truncate">${escapeHtml(event.summary || 'Untitled Event')}</h2>
          <p class="text-sm text-[var(--text-muted)]">${escapeHtml(eventDate)}${eventTime ? ` • ${escapeHtml(eventTime)}` : ''} • ${openItems.length} open</p>
          ${event.recurringEventId ? `
            <div class="mt-2 inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-secondary)]">
              <button onclick="setCalendarMeetingNotesScope('instance')" class="px-2 py-1 text-[11px] rounded-md ${state.calendarMeetingNotesScope === 'instance' ? 'bg-[var(--bg-card)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}">Instance</button>
              <button onclick="setCalendarMeetingNotesScope('series')" class="px-2 py-1 text-[11px] rounded-md ${state.calendarMeetingNotesScope === 'series' ? 'bg-[var(--bg-card)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}">Series</button>
            </div>
          ` : ''}
        </div>
        <div class="calendar-meeting-notes-actions flex items-center gap-2">
          <button onclick="closeCalendarMeetingNotes()" class="calendar-meeting-btn px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium hover:opacity-90 transition">Back</button>
          <button onclick="window.open('${q(event.htmlLink)}','_blank')" class="calendar-meeting-btn px-3 py-1.5 rounded-lg bg-coral/10 text-coral text-sm font-medium hover:bg-coral/20 transition ${event.htmlLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.htmlLink ? '' : 'disabled'}>
            Open Event
          </button>
          <button onclick="window.open('${q(event.meetingLink)}','_blank')" class="calendar-meeting-btn px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-medium hover:bg-emerald-200 transition ${event.meetingLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.meetingLink ? '' : 'disabled'}>
            ${event.meetingProvider ? `Join ${escapeHtml(event.meetingProvider)}` : 'Join Meeting'}
          </button>
        </div>
      </div>

      <div class="calendar-meeting-notes-body p-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-5">
        <div class="space-y-3">
          <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold text-[var(--text-primary)]">Meeting Notes & Tasks</h3>
              <span class="text-xs text-[var(--text-muted)]">${linkedItems.length} linked</span>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <input
                id="meeting-item-input"
                type="text"
                placeholder="Add bullet point..."
                onkeydown="handleMeetingItemInputKeydown(event, 'note')"
                class="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-light)] focus:border-[var(--accent)]"
              />
              <button onclick="addMeetingLinkedItem('note')" class="px-3 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-90">Add Bullet</button>
              <button onclick="addMeetingLinkedItem('task')" class="px-3 py-2 rounded-lg text-xs font-semibold bg-coral/10 text-coral hover:bg-coral/20">Add Task</button>
            </div>
            <div class="space-y-2">
              ${itemRows}
              ${completedItems.length > 0 ? `
                <details class="mt-3">
                  <summary class="text-xs font-medium text-[var(--text-muted)] cursor-pointer">${completedItems.length} completed</summary>
                  <div class="mt-2 space-y-1.5">
                    ${completedItems.map(task => `
                      <div class="text-xs text-[var(--text-muted)] line-through px-2 py-1">${escapeHtml(task.title || 'Untitled')}</div>
                    `).join('')}
                  </div>
                </details>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Attendees</h3>
            ${attendees.length > 0 ? `
              <div class="flex flex-wrap gap-1.5">
                ${attendees.map(a => `
                  <span class="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    ${escapeHtml(a.displayName || a.email || 'Guest')}
                  </span>
                `).join('')}
              </div>
            ` : '<p class="text-xs text-[var(--text-muted)]">No attendee metadata available for this event.</p>'}
          </div>

          ${event.description ? `
            <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Original Event Note</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[260px] overflow-auto">${renderMultilineText(event.description)}</div>
            </div>
          ` : ''}

          ${legacyNotes ? `
            <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Legacy Internal Notes</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[220px] overflow-auto">${renderMultilineText(legacyNotes)}</div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderEventActionsModal(event) {
  if (!event) return '';
  const notesKey = getEventKey(event);
  const hasLegacyNotes = !!state.meetingNotesByEvent?.[notesKey]?.content?.trim();
  const hasLinkedItems = getMeetingLinkedItems(notesKey).length > 0;
  const hasNotes = hasLegacyNotes || hasLinkedItems;
  const meetingActionLabel = event.meetingProvider ? `Join ${escapeHtml(event.meetingProvider)}` : 'Open Meeting Link';
  const meetingSubLabel = event.meetingLink
    ? (event.meetingProvider ? `Launch ${escapeHtml(event.meetingProvider)} directly` : 'Open the detected call URL')
    : 'No Meet/Zoom/Teams link found in this event';
  const notesActionLabel = hasNotes ? 'Open Meeting Workspace' : 'Create Meeting Workspace';
  const notesSubLabel = hasNotes ? 'Review linked bullets/tasks and event metadata' : 'Start linked bullets/tasks for this event';

  return `
    <div class="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[320]" onclick="if(event.target===this) closeCalendarEventActions()">
      <div class="modal-enhanced calendar-event-modal w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="modal-header-enhanced">
          <div class="flex items-center gap-3 min-w-0">
            <div class="calendar-event-modal-header-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zM7 12h5v5H7z"/></svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-semibold text-[var(--text-primary)] truncate">${escapeHtml(event.summary || 'Event')}</h3>
              <p class="text-xs text-[var(--text-muted)] mt-1">${escapeHtml(formatEventDateLabel(event))}${formatEventTimeLabel(event) ? ` • ${escapeHtml(formatEventTimeLabel(event))}` : ''}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${event.meetingProvider ? `<span class="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">${escapeHtml(event.meetingProvider)}</span>` : ''}
            <button onclick="closeCalendarEventActions()" class="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]" aria-label="Close">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>

        <div class="modal-body-enhanced space-y-2.5">
          <button onclick="window.open('${q(event.htmlLink)}', '_blank'); closeCalendarEventActions()" class="calendar-event-action ${event.htmlLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.htmlLink ? '' : 'disabled'}>
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zM7 12h5v5H7z"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">Open In Google Calendar</span>
              <span class="calendar-event-action-sub">View full details, guests, and edits</span>
            </span>
          </button>
          <button onclick="window.open('${q(event.meetingLink)}', '_blank'); closeCalendarEventActions()" class="calendar-event-action ${event.meetingLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.meetingLink ? '' : 'disabled'}>
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">${meetingActionLabel}</span>
              <span class="calendar-event-action-sub">${meetingSubLabel}</span>
            </span>
          </button>
          <button onclick="openCalendarMeetingNotes('${q(event.calendarId)}','${q(event.id)}')" class="calendar-event-action">
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">${notesActionLabel}</span>
              <span class="calendar-event-action-sub">${notesSubLabel}</span>
            </span>
          </button>
          <button onclick="convertCalendarEventToTask('${q(event.calendarId)}','${q(event.id)}', 0)" class="calendar-event-action">
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11h6v2H9zm0-4h6v2H9zm0 8h4v2H9z"/><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">Convert To Task</span>
              <span class="calendar-event-action-sub">Create a task from this event</span>
            </span>
          </button>
          <button onclick="convertCalendarEventToTask('${q(event.calendarId)}','${q(event.id)}', 1)" class="calendar-event-action">
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7h2v5h5v2h-7z"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">Create Follow-up Task</span>
              <span class="calendar-event-action-sub">Auto-create a follow-up due tomorrow</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the full calendar view.
 * @returns {string} HTML string for the calendar tab
 */
export function renderCalendarView() {
  if (state.calendarMeetingNotesEventKey) {
    return renderMeetingNotesPage();
  }

  const today = getLocalDateString();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1);
  const lastDay = new Date(state.calendarYear, state.calendarMonth + 1, 0);
  const startDow = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonthLast = new Date(state.calendarYear, state.calendarMonth, 0).getDate();
  const cells = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    const m = state.calendarMonth === 0 ? 12 : state.calendarMonth;
    const y = state.calendarMonth === 0 ? state.calendarYear - 1 : state.calendarYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, outside: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, outside: false });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = state.calendarMonth === 11 ? 1 : state.calendarMonth + 2;
      const y = state.calendarMonth === 11 ? state.calendarYear + 1 : state.calendarYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr, outside: true });
    }
  }

  const dateTaskMap = {};
  cells.forEach(cell => {
    dateTaskMap[cell.dateStr] = getTasksForDate(cell.dateStr);
  });

  const selectedTasks = getTasksForDate(state.calendarSelectedDate);
  const dueTasks = selectedTasks.filter(t => t.dueDate === state.calendarSelectedDate);
  const deferTasks = selectedTasks.filter(t => t.deferDate === state.calendarSelectedDate && t.dueDate !== state.calendarSelectedDate);
  const isToday = state.calendarSelectedDate === today;
  const activeTasks = state.tasksData.filter(t => !t.completed && !t.isNote);
  const todayTasks = isToday ? activeTasks.filter(t => {
    const isDueToday = t.dueDate === today;
    const isOverdue = t.dueDate && t.dueDate < today;
    const isScheduledForToday = t.deferDate && t.deferDate <= today;
    return t.today || isDueToday || isOverdue || isScheduledForToday;
  }) : [];

  const gcalEvents = window.getGCalEventsForDate?.(state.calendarSelectedDate) || [];

  const selDate = new Date(state.calendarSelectedDate + 'T12:00:00');
  const selectedLabel = isToday ? 'Today' :
    selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const buildMonthGrid = () => `
    <div class="calendar-grid">
      ${dayNames.map(d => `<div class="calendar-header-cell">${d}</div>`).join('')}
      ${cells.map(cell => {
        const tasks = dateTaskMap[cell.dateStr] || [];
        const cellEvents = window.getGCalEventsForDate?.(cell.dateStr) || [];
        const isCellToday = cell.dateStr === today;
        const isSelected = cell.dateStr === state.calendarSelectedDate;
        const cellTasks = tasks.filter(t => t.dueDate === cell.dateStr || t.deferDate === cell.dateStr);
        const classes = ['calendar-day'];
        if (cell.outside) classes.push('outside');
        if (isCellToday) classes.push('today');
        if (isSelected) classes.push('selected');

        return `<div class="${classes.join(' ')}" onclick="calendarSelectDate('${cell.dateStr}')">
          <div class="calendar-day-num">${cell.day}</div>
          ${(cellTasks.length + cellEvents.length) > 0 ? `
            <div class="calendar-task-list">
              ${cellTasks.map(t => {
                const isDue = t.dueDate === cell.dateStr;
                const isOver = isDue && t.dueDate < today;
                const cls = isOver ? 'overdue' : isDue ? 'due' : 'defer';
                return `<div class="calendar-task-line ${cls}">${escapeHtml(t.title)}</div>`;
              }).join('')}
              ${cellEvents.map(e =>
                `<div class="calendar-task-line event" onclick="event.stopPropagation(); openCalendarEventActions('${q(e.calendarId)}','${q(e.id)}')">${escapeHtml(e.summary)}</div>`
              ).join('')}
            </div>
          ` : ''}
        </div>`;
      }).join('')}
    </div>
  `;

  const selectedDateObj = new Date(state.calendarSelectedDate + 'T12:00:00');
  const rangeDates = [];
  if (state.calendarViewMode === 'week') {
    const start = new Date(selectedDateObj);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      rangeDates.push(d);
    }
  } else if (state.calendarViewMode === '3days') {
    for (let i = -1; i <= 1; i++) {
      const d = new Date(selectedDateObj);
      d.setDate(d.getDate() + i);
      rangeDates.push(d);
    }
  }

  const buildRangeGrid = () => `
    <div class="calendar-range-grid calendar-range-grid-${rangeDates.length}">
      ${rangeDates.map(d => {
        const dateStr = dateToStr(d);
        const tasks = getTasksForDate(dateStr).filter(t => t.dueDate === dateStr || t.deferDate === dateStr);
        const events = window.getGCalEventsForDate?.(dateStr) || [];
        const isSelected = dateStr === state.calendarSelectedDate;
        const isTodayDay = dateStr === today;
        const allItems = [
          ...tasks.map(t => ({ type: 'task', task: t })),
          ...events.map(e => ({ type: 'event', event: e }))
        ];

        return `
          <div class="calendar-range-day ${isSelected ? 'selected' : ''}" onclick="calendarSelectDate('${dateStr}')">
            <div class="calendar-range-day-head ${isTodayDay ? 'today' : ''}">
              <div class="calendar-range-day-name">${d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div class="calendar-range-day-date">${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
            <div class="calendar-range-day-list">
              ${allItems.length === 0
                ? '<div class="calendar-range-empty">No items</div>'
                : allItems.map(item => {
                  if (item.type === 'event') {
                    return `<div class="calendar-task-line event" onclick="event.stopPropagation(); openCalendarEventActions('${q(item.event.calendarId)}','${q(item.event.id)}')">${escapeHtml(item.event.summary)}</div>`;
                  }
                  const t = item.task;
                  const isDue = t.dueDate === dateStr;
                  const isOver = isDue && t.dueDate < today;
                  const cls = isOver ? 'overdue' : isDue ? 'due' : 'defer';
                  return `<div class="calendar-task-line ${cls}">${escapeHtml(t.title)}</div>`;
                }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const buildTimeGrid = () => {
    const dayDates = [];
    if (state.calendarViewMode === 'daygrid') {
      dayDates.push(new Date(selectedDateObj));
    } else {
      const start = new Date(selectedDateObj);
      start.setDate(start.getDate() - start.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dayDates.push(d);
      }
    }
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return `
      <div class="overflow-auto border border-[var(--border-light)] rounded-xl">
        <div class="grid ${dayDates.length === 1 ? 'grid-cols-[56px_1fr]' : 'grid-cols-[56px_repeat(7,minmax(160px,1fr))]'} min-w-[840px]">
          <div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)]"></div>
          ${dayDates.map(d => {
            const ds = dateToStr(d);
            return `<div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)] px-2 py-2 text-xs font-semibold text-[var(--text-primary)] ${ds === today ? 'text-coral' : ''}">
              ${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>`;
          }).join('')}
          ${hours.map(hour => `
            <div class="px-2 py-2 text-[11px] text-[var(--text-muted)] border-r border-b border-[var(--border-light)] bg-[var(--bg-card)]">${String(hour).padStart(2, '0')}:00</div>
            ${dayDates.map(d => {
              const ds = dateToStr(d);
              const dayEvents = (window.getGCalEventsForDate?.(ds) || []).filter(e => !e.allDay);
              const inHour = dayEvents.filter(e => {
                const h = new Date(e.start?.dateTime || '').getHours();
                return Number.isFinite(h) && h === hour;
              });
              return `
                <div class="min-h-[52px] border-r border-b border-[var(--border-light)] p-1.5 bg-[var(--bg-primary)]"
                  ondragover="event.preventDefault()"
                  ondrop="dropCalendarEventToSlot('${ds}', ${hour})">
                  ${inHour.map(e => `
                    <div
                      draggable="true"
                      ondragstart="startCalendarEventDrag('${q(e.calendarId)}','${q(e.id)}')"
                      ondragend="clearCalendarEventDrag()"
                      onclick="openCalendarEventActions('${q(e.calendarId)}','${q(e.id)}')"
                      class="text-[11px] rounded-md px-2 py-1 mb-1 bg-emerald-100 text-emerald-900 cursor-move truncate">
                      ${escapeHtml(e.summary)}
                    </div>
                  `).join('')}
                </div>
              `;
            }).join('')}
          `).join('')}
        </div>
      </div>
    `;
  };

  let calendarHtml = '';
  if (state.calendarViewMode === 'month') calendarHtml = buildMonthGrid();
  else if (state.calendarViewMode === 'week' || state.calendarViewMode === '3days') calendarHtml = buildRangeGrid();
  else calendarHtml = buildTimeGrid();

  const tokenBanner = state.gcalTokenExpired ? `
    <div class="mx-5 my-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
      <span class="text-sm text-amber-700">Google Calendar session expired</span>
      <button onclick="reconnectGCal()" class="text-sm font-medium text-amber-700 hover:text-amber-900 underline">Reconnect</button>
    </div>
  ` : '';

  const todayListHtml = todayTasks.length > 0
    ? todayTasks.map(task => renderCalendarSidebarTaskItem(task)).join('')
    : `<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No tasks for today.</div>`;

  const selectedDateLabel = selDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const eventsListHtml = gcalEvents.length > 0
    ? gcalEvents.map(e => {
      const title = escapeHtml(e.summary.length > 60 ? e.summary.slice(0, 57) + '...' : e.summary);
      const timeStr = formatEventTimeLabel(e) || 'All day';
      return `
        <button onclick="openCalendarEventActions('${q(e.calendarId)}','${q(e.id)}')" class="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition rounded-lg">
          <span class="w-2.5 h-2.5 rounded-full bg-[#2F9B6A] flex-shrink-0"></span>
          <span class="text-sm text-[var(--text-primary)] flex-1 truncate">${title}</span>
          <span class="text-xs text-[var(--text-muted)] flex-shrink-0">${escapeHtml(timeStr)}</span>
        </button>
      `;
    }).join('')
    : `<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No events for ${selectedDateLabel}.</div>`;

  const modalEvent = getSelectedModalEvent();

  return `
    <div class="flex-1">
      <div class="calendar-page-grid">
        <section class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)]">
          <div class="px-5 py-4 flex items-center justify-between border-b border-[var(--border-light)]">
            <div class="flex items-center gap-3">
              <span class="text-2xl" style="color: #8B5CF6">${THINGS3_ICONS.calendar}</span>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">Calendar</h2>
            </div>
            <button onclick="openNewTaskModal()" class="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center hover:bg-coralDark transition shadow-sm" title="Add Task">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
          </div>

          <div class="px-5 py-3 flex items-center justify-between border-b border-[var(--border-light)]">
            <button onclick="calendarPrevMonth()" class="w-8 h-8 rounded-full hover:bg-[var(--bg-secondary)] flex items-center justify-center transition text-[var(--text-secondary)]">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
          <div class="flex items-center gap-3">
            <h3 class="text-[15px] font-semibold text-[var(--text-primary)]">${monthNames[state.calendarMonth]} ${state.calendarYear}</h3>
            <div class="calendar-view-toggle">
              <button onclick="setCalendarViewMode('month')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'month' ? 'active' : ''}">Month</button>
              <button onclick="setCalendarViewMode('week')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'week' ? 'active' : ''}">Week</button>
              <button onclick="setCalendarViewMode('3days')" class="calendar-view-toggle-btn ${state.calendarViewMode === '3days' ? 'active' : ''}">3 Days</button>
              <button onclick="setCalendarViewMode('daygrid')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'daygrid' ? 'active' : ''}">Day Grid</button>
              <button onclick="setCalendarViewMode('weekgrid')" class="calendar-view-toggle-btn ${state.calendarViewMode === 'weekgrid' ? 'active' : ''}">Week Grid</button>
            </div>
            <button onclick="calendarGoToday()" class="text-[11px] px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition font-medium">Today</button>
            ${state.gcalSyncing ? '<span class="text-[10px] text-[var(--text-muted)]">Syncing...</span>' : ''}
          </div>
            <button onclick="calendarNextMonth()" class="w-8 h-8 rounded-full hover:bg-[var(--bg-secondary)] flex items-center justify-center transition text-[var(--text-secondary)]">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </div>

          ${tokenBanner}

          <div class="px-3 pt-2 pb-2">
            ${calendarHtml}
          </div>
        </section>

        <aside class="space-y-3">
          <div class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Today</h4>
              <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] font-medium">${todayTasks.length}</span>
            </div>
            <div class="calendar-side-list">${todayListHtml}</div>
          </div>

          <div class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Events</h4>
              <span class="text-xs text-[var(--text-muted)]">${selectedLabel}</span>
            </div>
            <div class="calendar-side-list">${eventsListHtml}</div>
          </div>

          ${(dueTasks.length > 0 || deferTasks.length > 0) ? `
            <div class="bg-[var(--bg-card)] rounded-xl md:border md:border-[var(--border-light)] overflow-hidden">
              <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
                <h4 class="text-sm font-semibold text-[var(--text-primary)]">Scheduled</h4>
                <span class="text-xs text-[var(--text-muted)]">${selectedDateLabel}</span>
              </div>
              <div class="calendar-side-list">
                ${dueTasks.length > 0 ? `
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#B55322]">Due</div>
                  ${dueTasks.map(task => renderCalendarSidebarTaskItem(task)).join('')}
                ` : ''}
                ${deferTasks.length > 0 ? `
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#2B6CB0]">Starting</div>
                  ${deferTasks.map(task => renderCalendarSidebarTaskItem(task)).join('')}
                ` : ''}
              </div>
            </div>
          ` : ''}
        </aside>
      </div>

      ${renderEventActionsModal(modalEvent)}
    </div>
  `;
}
