# Entity Assignments & Detail Pages — Design

**Date:** 2026-02-25
**Status:** Approved

## Summary

Add the ability to assign tasks and notes to all four entity types (Area, Category, Label, Person) via the task/note editor, display assigned entities as a subtitle in list rows, and create entity detail pages with dashboard stats + filtered task/note lists.

## 1. Task/Note Editor — "Organization" Section

A new "Organization" section in `TaskDetailView` between Status and Dates:

- **Area** — Single-select Picker from all HBArea items. Selecting an area auto-filters the Category picker to categories with that `areaId`.
- **Category** — Single-select Picker, filtered by selected area. Disabled if no area is selected.
- **Labels** — Multi-select list (tap to toggle checkmark). Shows selected label names as subtitle text.
- **People** — Multi-select list (tap to toggle checkmark). Shows selected person names as subtitle text.

Notes (HBTask with `isNote: true`) use the same fields, so the outliner gets an "Edit" swipe action that opens the same editor.

## 2. Task/Note Row — Entity Subtitle

In `TaskRowView` and `NoteRowView`, a secondary line below the title showing assigned entities:

```
Buy groceries
Personal · Shopping · @Sarah
```

Uses `HBTheme.subtitleFont` and `HBTheme.textTertiary`. Only rendered when at least one entity is assigned.

## 3. Entity Detail Pages

Tapping an entity row navigates to `EntityDetailView` showing:

**Header stats bar:**
- Task count (incomplete) | Note count | Completed count
- Compact HStack with SF Symbols

**Filtered list:**
- All tasks assigned to that entity (via areaId, categoryId, labels.contains, or people.contains)
- All notes assigned to that entity
- Same TaskRowView/NoteRowView rendering with swipe actions
- Tap task → opens TaskDetailView

Single `EntityDetailView` parameterized by entity type + ID.

## 4. Data Flow

No model changes — HBTask already has `areaId`, `categoryId`, `labels: [String]`, `people: [String]`.

Changes are purely UI:
- `TaskDetailView` — add Organization section with pickers
- `TaskRowView` / `NoteRowView` — add entity subtitle line
- `EntityListView` — make rows tappable → navigate to EntityDetailView
- New `EntityDetailView` — stats + filtered list
- `NavigationRouter` — add route for entity detail

All mutations use existing `sync.engine.markDirty()` path.
