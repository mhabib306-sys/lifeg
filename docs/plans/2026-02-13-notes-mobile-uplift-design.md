# Notes Outliner Mobile UI Uplift — Design

**Date:** 2026-02-13
**Scope:** `renderNoteItem` in `src/features/notes.js`, swipe system, mobile CSS

---

## Problem

On mobile, each note row renders 4 action buttons at 44px each (176px total) on a ~375px screen. The title gets squeezed. Tasks already use a clean swipe-to-reveal pattern — notes should match.

## Changes

### Layer 1: Remove arrow + plus buttons (both platforms)

Remove from `renderNoteItem`:
- **Arrow button** ("Open as page") — bullet dot already calls `zoomIntoNote()`
- **Plus button** ("Add child note") — Enter key and section-level "+ Add note" handle this

Keep:
- Convert to task/note toggle
- Delete (with undo)

### Layer 2: Mobile swipe actions for notes

Reuse the existing `swipe-actions.js` system:

- **Swipe right:** Convert to task / Convert to note (toggle, matches the kept action)
- **Swipe left:** Delete with undo

Implementation:
- Wrap note items in `.swipe-row` on touch devices (same pattern as task items in `renderTaskItem`)
- Add a container class (`.notes-list`) to the outliner wrapper
- Extend `initSwipeActions()` to also bind on `.notes-list` containers
- **Hide action buttons entirely on mobile** — swipe replaces them

### Layer 3: Mobile spacing & touch targets

- **Bullet touch target:** Add 44px invisible hit area via `::before` pseudo (same pattern as `.note-checkbox-btn`)
- **Row padding:** Bump vertical padding from 5px → 8px on mobile (`@media max-width: 640px`)
- **Desktop unchanged:** Hover-to-reveal convert + delete buttons

## Result

Note rows on mobile: `bullet | full-width title + meta` — no visible buttons. Swipe for actions. Consistent with tasks.

## Files Changed

| File | Change |
|------|--------|
| `src/features/notes.js` | Remove arrow + plus from `renderNoteItem`, wrap in `.swipe-row` on touch, add `.notes-list` container class |
| `src/features/swipe-actions.js` | Extend `initSwipeActions` to bind on `.notes-list` |
| `src/styles/main.css` | Hide `.note-actions` on mobile, add bullet touch target, adjust spacing |
| `src/bridge.js` | No changes expected (swipe uses event delegation) |
