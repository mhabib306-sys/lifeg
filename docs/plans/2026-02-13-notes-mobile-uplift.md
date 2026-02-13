# Notes Outliner Mobile UI Uplift

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make note items on mobile match the clean, gesture-based UX of task items — remove visible action buttons, add swipe-to-reveal, improve spacing and touch targets.

**Tech Stack:** Vanilla JS, Tailwind CSS v4, existing `swipe-actions.js` system, Selection API

---

## Context

The note outliner renders items via `renderNoteItem()` in `src/features/notes.js:1900-1978`. Each note row currently shows 4 action buttons (convert, arrow, plus, delete) that are always visible on mobile at 44px each = 176px on a ~375px screen.

Tasks already have swipe-to-reveal via `src/features/swipe-actions.js` using event delegation on `.task-list` containers. The swipe system wraps each task in a `.swipe-row` div with `.swipe-actions-left` and `.swipe-actions-right` behind the content.

The notes outliner output is rendered by `renderNotesOutliner()` at `notes.js:1980-2012`, which returns note items directly. It's called from:
- `buildNotesSection()` in `tasks-tab.js:196` (area/label/person views) — wrapped in `<div class="py-2">`
- `renderTasksTab()` in `tasks-tab.js:1925` (All Notes perspective) — wrapped in `<div class="py-2">`

---

## Task 1: Remove arrow and plus buttons from `renderNoteItem`

**Files:**
- Modify: `src/features/notes.js:1954-1974`

**Why:** The arrow duplicates the bullet click (`zoomIntoNote`). The plus duplicates Enter key and section-level "+ Add note". Removing them declutters both desktop and mobile.

**Step 1:** In `src/features/notes.js`, remove the arrow and plus buttons from the `.note-actions` div at lines 1962-1969.

Replace lines 1954-1974:
```javascript
        <div class="note-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button onclick="event.stopPropagation(); toggleNoteTask('${note.id}')"
            class="note-action-btn" title="${note.isNote ? 'Convert to task (\u2318\u21e7\u21a9)' : 'Convert to note (\u2318\u21e7\u21a9)'}"
            aria-label="${note.isNote ? 'Convert to task' : 'Convert to note'}">
            ${note.isNote
              ? '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>'
              : '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
          </button>
          <button onclick="event.stopPropagation(); zoomIntoNote('${note.id}')"
            class="note-action-btn" title="Open as page (Cmd+Enter)" aria-label="Open note as page">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>
          <button onclick="event.stopPropagation(); createChildNote('${note.id}')"
            class="note-action-btn" title="Add child note (Enter)" aria-label="Add child note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <button onclick="event.stopPropagation(); deleteNoteWithUndo('${note.id}')"
            class="note-action-btn note-action-btn-delete" title="Delete note" aria-label="Delete note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
```

With (arrow and plus removed):
```javascript
        <div class="note-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button onclick="event.stopPropagation(); toggleNoteTask('${note.id}')"
            class="note-action-btn" title="${note.isNote ? 'Convert to task (\u2318\u21e7\u21a9)' : 'Convert to note (\u2318\u21e7\u21a9)'}"
            aria-label="${note.isNote ? 'Convert to task' : 'Convert to note'}">
            ${note.isNote
              ? '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>'
              : '<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
          </button>
          <button onclick="event.stopPropagation(); deleteNoteWithUndo('${note.id}')"
            class="note-action-btn note-action-btn-delete" title="Delete note" aria-label="Delete note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
```

**Step 2: Also remove arrow + plus from the task-item hover actions in `tasks-tab.js`**

The task item hover actions at `tasks-tab.js:370-384` show the same arrow + plus + outdent/indent buttons for notes (when `task.isNote`). These need updating too — remove the arrow (`zoomIntoNote`) button from that block since the bullet already handles it. Keep the indentation controls and the plus for desktop (it's convenient there), but remove the arrow.

Actually — looking at lines 370-384, these are in the `renderTaskItem` function for tasks-tab, which handles notes that appear in the task list. Those note items are rendered differently from the outliner. Leave these unchanged — they're the task-tab hover actions, not the notes outliner. The scope here is only `renderNoteItem` in `notes.js`.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

---

## Task 2: Wrap note items in swipe rows on mobile

**Files:**
- Modify: `src/features/notes.js:1900-1978` (renderNoteItem)
- Modify: `src/features/notes.js:1980-2012` (renderNotesOutliner)

**Why:** On touch devices, note items need the `.swipe-row` wrapper (same as tasks) so the swipe system can reveal action buttons behind the row.

**Step 1:** In `renderNoteItem`, wrap the output in a `.swipe-row` div on touch devices, after the closing `</div>` of `.note-item`.

At the bottom of `renderNoteItem` (currently lines 1910-1977), change the return to:

```javascript
  const noteHtml = `
    <div class="note-item ${hasChildren ? 'has-children' : ''} ${isCollapsed ? 'note-collapsed' : ''} ${isEditing ? 'editing' : ''}"
      data-note-id="${note.id}"
      style="--note-depth:${note.indent || 0};"
      ${!isTouch ? `draggable="true"
      ondragstart="handleNoteDragStart(event, '${note.id}')"
      ondragend="handleNoteDragEnd(event)"
      ondragover="handleNoteDragOver(event, '${note.id}')"
      ondragleave="handleNoteDragLeave(event)"
      ondrop="handleNoteDrop(event)"` : ''}>
      <div class="note-row group">
        ... (existing bullet + content + actions) ...
      </div>
    </div>
  `;

  if (isTouch) {
    return `
      <div class="swipe-row" data-note-id="${note.id}">
        <div class="swipe-actions-left">
          <button class="swipe-action-btn swipe-action-convert" onclick="event.stopPropagation(); window.toggleNoteTask('${note.id}')">
            ${note.isNote
              ? '<svg class="w-[22px] h-[22px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>'
              : '<svg class="w-[22px] h-[22px]" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
            <span>${note.isNote ? 'To Task' : 'To Note'}</span>
          </button>
        </div>
        <div class="swipe-row-content">${noteHtml}</div>
        <div class="swipe-actions-right">
          <button class="swipe-action-btn swipe-action-delete" onclick="event.stopPropagation(); window.deleteNoteWithUndo('${note.id}')">
            <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }

  return noteHtml;
```

Key details:
- Swipe left reveals "Convert to Task/Note" (accent color)
- Swipe right reveals "Delete" (danger color)
- This mirrors the task swipe pattern exactly

**Step 2:** In `renderNotesOutliner`, wrap the output in a `.notes-list` container so the swipe system can bind to it:

Change line 2011:
```javascript
  return visibleNotes.map(note => renderNoteItem(note)).join('');
```
To:
```javascript
  return `<div class="notes-list">${visibleNotes.map(note => renderNoteItem(note)).join('')}</div>`;
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

---

## Task 3: Extend swipe system to notes containers

**Files:**
- Modify: `src/features/swipe-actions.js:41-54`

**Why:** The swipe system uses event delegation on `.task-list` containers. It needs to also bind on `.notes-list` containers.

**Step 1:** In `initSwipeActions()`, change line 44 to query both container types:

From:
```javascript
  const containers = document.querySelectorAll('.task-list');
```
To:
```javascript
  const containers = document.querySelectorAll('.task-list, .notes-list');
```

That's it — one line change. The swipe system is generic (it looks for `.swipe-row` children), so no other changes needed.

**Step 2:** Add a CSS class for the swipe convert action button color. In `src/styles/main.css`, after `.swipe-action-delete`:

```css
.swipe-action-convert { background: var(--accent); }
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

---

## Task 4: CSS — hide actions on mobile, improve spacing & touch targets

**Files:**
- Modify: `src/styles/main.css`

**Why:** On mobile, swipe replaces the action buttons. We need to hide them, add breathing room, and ensure the bullet has a proper touch target.

**Step 1:** In the `@media (max-width: 640px)` block near line 1287, update the note styles:

Replace the existing note mobile overrides (lines 1288-1303):
```css
  .note-row {
    min-height: 40px;
    padding-right: 8px;
    padding-left: calc(8px + (var(--note-depth) * 16px));
    gap: 4px;
  }
  .note-item.has-children:not(.note-collapsed)::after {
    left: calc(18px + (var(--note-depth) * 16px));
  }
  .note-action-btn {
    width: 28px;
    height: 28px;
  }
  .note-zoom-btn {
    opacity: 1 !important;
  }
```

With:
```css
  .note-row {
    min-height: 44px;
    padding: 8px 12px 8px calc(8px + (var(--note-depth) * 16px));
    gap: 6px;
  }
  .note-item.has-children:not(.note-collapsed)::after {
    left: calc(18px + (var(--note-depth) * 16px));
  }
  /* Hide action buttons on mobile — swipe replaces them */
  .note-actions {
    display: none !important;
  }
  /* Bullet: 44px invisible touch target */
  .note-bullet {
    position: relative;
  }
  .note-bullet::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 44px;
    height: 44px;
    transform: translate(-50%, -50%);
  }
```

Key changes:
- `min-height: 40px` → `44px` — more breathing room
- `padding: 5px` → `8px` vertical — spacious rows
- `.note-actions` hidden on mobile — swipe handles it
- `.note-bullet` gets 44px invisible touch target (same pseudo-element pattern as `.note-checkbox-btn`)
- Removed `.note-action-btn` sizing (hidden anyway) and `.note-zoom-btn` override (arrow button removed)

**Step 2:** In the touch-specific overrides block (near line 2647), remove the `.note-action-btn` 44px override since they're now hidden on mobile:

Remove:
```css
  /* Fix #6: Note action buttons — 44px touch target */
  .note-action-btn {
    width: 44px;
    height: 44px;
    border-radius: 8px;
  }
```

And remove:
```css
  .note-action-btn:hover {
    background: transparent;
    color: var(--text-muted);
  }
```

These are no longer needed since `.note-actions` is `display: none` on mobile.

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

---

## Task 5: Final build, version bump, deploy

**Step 1:** `npm run build` — verify clean build
**Step 2:** `npm run bump patch` — bump version
**Step 3:** Commit all changes, push, deploy

---

## Files Changed Summary

| File | Change |
|------|--------|
| `src/features/notes.js` | Remove arrow + plus buttons from `renderNoteItem`, wrap in `.swipe-row` on touch, add `.notes-list` wrapper in `renderNotesOutliner` |
| `src/features/swipe-actions.js` | Add `.notes-list` to container selector (1-line change) |
| `src/styles/main.css` | Hide `.note-actions` on mobile, improve note row spacing, add bullet touch target, add `.swipe-action-convert` color, remove obsolete touch overrides |

## Key Functions Reused

- `toggleNoteTask(noteId)` — existing convert function (`src/features/notes.js`)
- `deleteNoteWithUndo(noteId)` — existing delete function (`src/features/notes.js`)
- `initSwipeActions()` — existing swipe system (`src/features/swipe-actions.js`)
- Task swipe-row pattern from `renderTaskItem` in `src/ui/tasks-tab.js:405-427`

## Verification

1. Open app on mobile (or responsive mode ≤640px)
2. Notes outliner — rows should show only bullet + title + meta (no action buttons)
3. Swipe a note row left → "Convert" button appears (accent color)
4. Swipe a note row right → "Delete" button appears (red)
5. Tap Convert → note becomes task (or vice versa)
6. Tap Delete → note deleted with undo toast
7. Tap bullet → opens note as page (zoom in)
8. On desktop → hover note row → convert + delete buttons appear (no arrow, no plus)
9. Verify vertical spacing is more generous on mobile
