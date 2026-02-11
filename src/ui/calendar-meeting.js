// ============================================================================
// CALENDAR MEETING NOTES & EVENT ACTIONS
// ============================================================================
// Meeting notes workspace, discussion pool, event actions modal, and all
// related CRUD.  Extracted from calendar-view.js.

import { state } from '../state.js';
import { MEETING_NOTES_KEY } from '../constants.js';
import { escapeHtml, getLocalDateString, normalizeEmail, formatEventTime, formatEventDateLabel } from '../utils.js';

function getEventKeyForScope(event, scope = 'instance') {
  if (!event) return '';
  if (scope === 'series' && event.recurringEventId) {
    return `${event.calendarId}::series::${event.recurringEventId}`;
  }
  return `${event.calendarId}::instance::${event.id}`;
}

function getEventKey(event) {
  return getEventKeyForScope(event, state.calendarMeetingNotesScope || 'instance');
}

function getMeetingScopeKeys(event) {
  if (!event) return [];
  const keys = [`${event.calendarId}::instance::${event.id}`];
  if (event.recurringEventId) {
    keys.push(`${event.calendarId}::series::${event.recurringEventId}`);
  }
  return keys;
}

export function hasMeetingNotes(event) {
  const keys = getMeetingScopeKeys(event);
  if (!keys.length) return false;
  const docs = state.meetingNotesByEvent || {};
  const hasDoc = keys.some(key => !!docs[key]);
  if (hasDoc) return true;
  return state.tasksData.some(task => keys.includes(task.meetingEventKey));
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
  if (typeof eventKey === 'string') {
    return state.tasksData.filter(t => t.meetingEventKey === eventKey);
  }
  const scopeKeys = getMeetingScopeKeys(eventKey);
  return state.tasksData.filter(t => scopeKeys.includes(t.meetingEventKey));
}

function getDiscussionPoolForEvent(event) {
  if (!event) {
    return { attendeePeople: [], matchingItems: [], tasks: [], notes: [] };
  }

  const attendeeEmails = new Set(
    (Array.isArray(event.attendees) ? event.attendees : [])
      .map(att => normalizeEmail(att?.email))
      .filter(Boolean)
  );
  const attendeePeople = state.taskPeople.filter(person => attendeeEmails.has(normalizeEmail(person?.email)));
  const attendeePersonIds = new Set(attendeePeople.map(person => person.id));
  const meetingKeys = getMeetingScopeKeys(event);
  const today = getLocalDateString();

  const scoreItem = (task) => {
    let score = 0;
    if (!task.isNote) score += 20;
    if (task.flagged) score += 14;
    if (task.today) score += 10;
    if (task.dueDate) {
      if (task.dueDate < today) score += 22;
      else if (task.dueDate === today) score += 18;
      else {
        const diffDays = Math.ceil((new Date(`${task.dueDate}T12:00:00`) - new Date(`${today}T12:00:00`)) / 86400000);
        if (diffDays <= 7) score += 7;
      }
    }
    if (meetingKeys.includes(task.meetingEventKey)) score += 12;
    return score;
  };

  const matchingItems = state.tasksData
    .filter(task => !task.completed)
    .filter(task => (task.people || []).some(pid => attendeePersonIds.has(pid)))
    .sort((a, b) => {
      const scoreDiff = scoreItem(b) - scoreItem(a);
      if (scoreDiff !== 0) return scoreDiff;
      return String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''));
    });

  return {
    attendeePeople,
    matchingItems,
    tasks: matchingItems.filter(item => !item.isNote),
    notes: matchingItems.filter(item => item.isNote),
  };
}

function renderMultilineText(text) {
  return escapeHtml(text || '').replace(/\n/g, '<br>');
}

function renderSafeEventHtml(rawHtml) {
  const input = String(rawHtml || '');
  if (!input.trim()) return '';

  // If no tags detected, treat as plain text with line breaks.
  if (!/[<>]/.test(input)) {
    return renderMultilineText(input);
  }

  // Fallback for non-browser contexts.
  if (typeof document === 'undefined') {
    return renderMultilineText(input);
  }

  const allowedTags = new Set([
    'a', 'p', 'br', 'ul', 'ol', 'li', 'b', 'strong', 'i', 'em', 'u',
    'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div', 'span'
  ]);
  const allowedAttrs = new Set(['href', 'title', 'target', 'rel']);

  const template = document.createElement('template');
  template.innerHTML = input;

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.remove();
      return;
    }

    const tag = node.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      const text = document.createTextNode(node.textContent || '');
      node.replaceWith(text);
      return;
    }

    // Strip unsafe attributes and inline handlers.
    Array.from(node.attributes).forEach(attr => {
      const name = attr.name.toLowerCase();
      const value = attr.value || '';
      const isEventAttr = name.startsWith('on');
      if (isEventAttr || !allowedAttrs.has(name)) {
        node.removeAttribute(attr.name);
        return;
      }
      if (name === 'href') {
        const trimmed = value.trim().toLowerCase();
        if (!(trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:'))) {
          node.removeAttribute(attr.name);
        }
      }
    });

    if (tag === 'a' && node.getAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }

    Array.from(node.childNodes).forEach(sanitizeNode);
  };

  Array.from(template.content.childNodes).forEach(sanitizeNode);
  return template.innerHTML;
}

export function getSelectedModalEvent() {
  if (!state.calendarEventModalOpen) return null;
  return findCalendarEvent(state.calendarEventModalCalendarId, state.calendarEventModalEventId);
}

// formatEventTimeLabel is now imported as formatEventTime from utils.js
const formatEventTimeLabel = formatEventTime;

export function q(str) {
  return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
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
  const event = findCalendarEvent(calendarId, eventId);
  if (!event) return;
  if (hasMeetingNotes(event)) {
    openCalendarMeetingNotes(calendarId, eventId);
    return;
  }
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

export function openCalendarMeetingNotesByEventKey(eventKey) {
  if (!eventKey) return;
  const parts = String(eventKey).split('::');
  if (parts.length >= 3) {
    state.calendarMeetingNotesScope = parts[1] === 'series' ? 'series' : 'instance';
  }
  state.calendarMeetingNotesEventKey = String(eventKey);
  state.activeTab = 'calendar';
  state.calendarEventModalOpen = false;
  state.calendarEventModalCalendarId = null;
  state.calendarEventModalEventId = null;
  window.render();
}

// Legacy alias kept for compatibility with older onclick handlers/state.
export function openCalendarMeetingWorkspaceByEventKey(eventKey) {
  openCalendarMeetingNotesByEventKey(eventKey);
}

export function setCalendarMeetingNotesScope(scope) {
  if (!['instance', 'series'].includes(scope)) return;
  const previousScope = state.calendarMeetingNotesScope || 'instance';
  const currentEvent = getMeetingNotesEvent();
  if (!currentEvent) {
    state.calendarMeetingNotesScope = scope;
    return window.render();
  }

  // Guard against "disappearing" items when promoting a single event note
  // to series scope by migrating linked entities to the series key.
  if (previousScope === 'instance' && scope === 'series' && currentEvent.recurringEventId) {
    const instanceKey = getEventKeyForScope(currentEvent, 'instance');
    const seriesKey = getEventKeyForScope(currentEvent, 'series');

    if (instanceKey && seriesKey && instanceKey !== seriesKey) {
      if (!state.meetingNotesByEvent) state.meetingNotesByEvent = {};
      const sourceDoc = state.meetingNotesByEvent[instanceKey];
      const targetDoc = state.meetingNotesByEvent[seriesKey];
      const nowIso = new Date().toISOString();

      if (sourceDoc && !targetDoc) {
        state.meetingNotesByEvent[seriesKey] = {
          ...sourceDoc,
          eventKey: seriesKey,
          updatedAt: nowIso,
        };
      } else if (sourceDoc && targetDoc && !String(targetDoc.content || '').trim() && String(sourceDoc.content || '').trim()) {
        targetDoc.content = sourceDoc.content;
        targetDoc.updatedAt = nowIso;
      }

      let movedCount = 0;
      for (const task of state.tasksData) {
        if (task.meetingEventKey === instanceKey) {
          task.meetingEventKey = seriesKey;
          task.updatedAt = nowIso;
          movedCount++;
        }
      }
      if (movedCount > 0) {
        window.saveTasksData?.();
      }
      persistMeetingNotes();
    }
  }

  state.calendarMeetingNotesScope = scope;
  const doc = ensureMeetingNoteDoc(currentEvent);
  if (doc) state.calendarMeetingNotesEventKey = doc.eventKey;
  window.render();
}

export function toggleCalendarMobilePanel(panel) {
  if (panel === 'today') state.calendarMobileShowToday = !state.calendarMobileShowToday;
  if (panel === 'events') state.calendarMobileShowEvents = !state.calendarMobileShowEvents;
  if (panel === 'scheduled') state.calendarMobileShowScheduled = !state.calendarMobileShowScheduled;
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

export function addDiscussionItemToMeeting(taskId) {
  const key = state.calendarMeetingNotesEventKey;
  const event = getMeetingNotesEvent();
  if (!taskId || !key || !event) return;
  const meetingKeys = getMeetingScopeKeys(event);
  const task = state.tasksData.find(t => t.id === taskId);
  if (!task) return;
  if (meetingKeys.includes(task.meetingEventKey)) return;
  window.updateTask?.(taskId, { meetingEventKey: key });
  window.render();
}

export function handleMeetingItemInputKeydown(event, itemType = 'note') {
  if (event.key === 'Enter') {
    event.preventDefault();
    addMeetingLinkedItem(itemType);
  }
}

export function renderMeetingNotesPage() {
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
  const linkedItems = getMeetingLinkedItems(event);
  const meetingKeys = getMeetingScopeKeys(event);
  const discussionPool = getDiscussionPoolForEvent(event);
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
          <div class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Meeting Notes</div>
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
          <button onclick="closeCalendarMeetingNotes()" class="calendar-meeting-btn calendar-meeting-btn-neutral px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">Back</button>
          <button onclick="window.open('${q(event.htmlLink)}','_blank')" class="calendar-meeting-btn calendar-meeting-btn-accent px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition ${event.htmlLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.htmlLink ? '' : 'disabled'}>
            Open Event
          </button>
          <button onclick="window.open('${q(event.meetingLink)}','_blank')" class="calendar-meeting-btn calendar-meeting-btn-success px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition ${event.meetingLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.meetingLink ? '' : 'disabled'}>
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
              <button onclick="addMeetingLinkedItem('note')" class="calendar-meeting-btn calendar-meeting-btn-neutral px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Add Bullet</button>
              <button onclick="addMeetingLinkedItem('task')" class="calendar-meeting-btn calendar-meeting-btn-accent px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Add Task</button>
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
          <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3 discussion-pool-card">
            <div class="flex items-center justify-between gap-3 mb-2">
              <div>
                <h3 class="text-sm font-semibold text-[var(--text-primary)]">Discussion Pool</h3>
                <p class="text-xs text-[var(--text-muted)]">Items tagged to meeting attendees (${discussionPool.attendeePeople.length} matched people)</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">${discussionPool.matchingItems.length}</span>
            </div>

            ${discussionPool.attendeePeople.length > 0 ? `
              <div class="discussion-pool-people mb-3">
                ${discussionPool.attendeePeople.map(person => `
                  <span class="discussion-pool-person-pill">
                    ${escapeHtml(person.name)}
                    ${person.email ? `<span class="discussion-pool-person-email">${escapeHtml(person.email)}</span>` : ''}
                  </span>
                `).join('')}
              </div>
            ` : `
              <p class="text-xs rounded-lg px-2.5 py-2 mb-3" style="color: var(--warning); background: color-mix(in srgb, var(--warning) 8%, transparent); border: 1px solid color-mix(in srgb, var(--warning) 25%, transparent)">No People emails matched this meeting's attendees yet.</p>
            `}

            ${discussionPool.matchingItems.length > 0 ? `
              <div class="discussion-pool-sections">
                <div class="discussion-pool-section">
                  <div class="discussion-pool-section-head">Tasks (${discussionPool.tasks.length})</div>
                  ${discussionPool.tasks.length ? discussionPool.tasks.map(item => {
                    const inThisMeeting = meetingKeys.includes(item.meetingEventKey);
                    return `
                      <div class="discussion-pool-item">
                        <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${q(item.id)}'; window.showTaskModal=true; window.render()" class="discussion-pool-item-main">
                          <span class="discussion-pool-item-title">${escapeHtml(item.title || 'Untitled task')}</span>
                          <span class="discussion-pool-item-meta">
                            ${item.dueDate ? `<span class="discussion-pool-item-badge">${item.dueDate <= getLocalDateString() ? 'Due' : 'Upcoming'} ${escapeHtml(item.dueDate)}</span>` : ''}
                            ${inThisMeeting ? `<span class="discussion-pool-item-badge linked">In This Meeting</span>` : ''}
                          </span>
                        </button>
                        <button onclick="addDiscussionItemToMeeting('${q(item.id)}')" class="discussion-pool-link-btn ${inThisMeeting ? 'is-linked' : ''}" ${inThisMeeting ? 'disabled' : ''}>${inThisMeeting ? 'Linked' : 'Add'}</button>
                      </div>
                    `;
                  }).join('') : '<div class="discussion-pool-empty">No tasks tagged to attendees.</div>'}
                </div>

                <div class="discussion-pool-section">
                  <div class="discussion-pool-section-head">Notes (${discussionPool.notes.length})</div>
                  ${discussionPool.notes.length ? discussionPool.notes.map(item => {
                    const inThisMeeting = meetingKeys.includes(item.meetingEventKey);
                    return `
                      <div class="discussion-pool-item">
                        <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${q(item.id)}'; window.showTaskModal=true; window.render()" class="discussion-pool-item-main">
                          <span class="discussion-pool-item-title">${escapeHtml(item.title || 'Untitled note')}</span>
                          <span class="discussion-pool-item-meta">
                            ${inThisMeeting ? `<span class="discussion-pool-item-badge linked">In This Meeting</span>` : ''}
                          </span>
                        </button>
                        <button onclick="addDiscussionItemToMeeting('${q(item.id)}')" class="discussion-pool-link-btn ${inThisMeeting ? 'is-linked' : ''}" ${inThisMeeting ? 'disabled' : ''}>${inThisMeeting ? 'Linked' : 'Add'}</button>
                      </div>
                    `;
                  }).join('') : '<div class="discussion-pool-empty">No notes tagged to attendees.</div>'}
                </div>
              </div>
            ` : `
              <div class="discussion-pool-empty">No open tasks/notes are currently tagged with matched attendees.</div>
            `}
          </div>

          <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Attendees</h3>
            ${attendees.length > 0 ? `
              <div class="flex flex-wrap gap-1.5">
                ${attendees.map(a => {
                  const normEmail = normalizeEmail(a.email);
                  const matchedPerson = normEmail ? state.taskPeople.find(p => normalizeEmail(p.email) === normEmail) : null;
                  const label = matchedPerson?.name || a.displayName || a.email || 'Guest';
                  return `
                  <span class="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    ${escapeHtml(label)}
                  </span>`;
                }).join('')}
              </div>
            ` : '<p class="text-xs text-[var(--text-muted)]">No attendee metadata available for this event.</p>'}
          </div>

          ${event.description ? `
            <div class="rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Original Event Note</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[260px] overflow-auto">${renderSafeEventHtml(event.description)}</div>
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

export function renderEventActionsModal(event) {
  if (!event) return '';
  const hasNotes = hasMeetingNotes(event);
  if (hasNotes) return '';
  const meetingActionLabel = event.meetingProvider ? `Join ${escapeHtml(event.meetingProvider)}` : 'Open Meeting Link';
  const meetingSubLabel = event.meetingLink ? 'Open call link' : 'No call link found';

  return `
    <div class="modal-overlay calendar-event-modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-center justify-center z-[320]" onclick="if(event.target===this) closeCalendarEventActions()">
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
            ${event.meetingProvider ? `<span class="text-[10px] font-semibold px-2 py-1 rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]">${escapeHtml(event.meetingProvider)}</span>` : ''}
            <button onclick="closeCalendarEventActions()" class="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]" aria-label="Close">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>

        <div class="modal-body-enhanced space-y-3">
          <div class="calendar-event-quick-actions">
            <button onclick="window.open('${q(event.htmlLink)}', '_blank'); closeCalendarEventActions()" class="calendar-icon-action ${event.htmlLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.htmlLink ? '' : 'disabled'}>
              <span class="calendar-icon-action-glyph">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zM7 12h5v5H7z"/></svg>
              </span>
              <span class="calendar-icon-action-label">Google Calendar</span>
            </button>
            <button onclick="window.open('${q(event.meetingLink)}', '_blank'); closeCalendarEventActions()" class="calendar-icon-action ${event.meetingLink ? '' : 'opacity-50 cursor-not-allowed'}" ${event.meetingLink ? '' : 'disabled'}>
              <span class="calendar-icon-action-glyph">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z"/></svg>
              </span>
              <span class="calendar-icon-action-label">${meetingActionLabel}</span>
              <span class="calendar-icon-action-sub">${meetingSubLabel}</span>
            </button>
          </div>

          <button onclick="openCalendarMeetingNotes('${q(event.calendarId)}','${q(event.id)}')" class="calendar-event-action">
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">Create Meeting Notes</span>
              <span class="calendar-event-action-sub">Start linked notes/tasks for this event</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  `;
}
