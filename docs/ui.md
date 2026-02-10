# UI & Mobile Standards

## Design Principles
- Things 3–inspired visual language (lightweight, precise spacing).
- Tap targets >= 44px height where possible.
- Clean hierarchy: title > metadata, minimal visual noise.

## Mobile Layout
- Bottom nav always visible with labels.
- Compact header on mobile with version badge.
- Task rows are tightly spaced for high density.
- Drawer respects safe-area insets and always restores body scroll when closed.

## Task Row Layout
- Title wraps on mobile for full visibility.
- Metadata is a single, truncated line.
- Checkbox aligned to title center when metadata is absent.

## Task Modal
- Title field supports inline shortcuts: `#` area, `@` tag, `&` person, `!` defer date.
- Quick schedule pills set Defer/Due to Today, Tomorrow, or Next Week.
- Cmd/Ctrl+Enter from notes saves the task.

## Braindump
- Voice input mode is available in Braindump (microphone button).
- Dictation uses browser speech recognition, then optional Anthropic cleanup when key is configured.
- Voice transcript appends to the same Braindump text field for normal Process flow.

## Today Flag
- Today is a separate flag (not a status).
- Tasks can be Today and still appear in Anytime.

## Widgets
Home widgets are single-column on phones for readability.

## Calendar
- Calendar grid uses fixed row heights so empty days match filled days.
- Task lines show in minimal text and rely on color for due/start/overdue.
- Visual styling matches Things 3: lighter gridlines, soft header caps, and compact day labels.
- When Today is selected, the calendar day list shows a Today section with a Next section underneath.

## Perspectives
- Custom perspectives support OmniFocus-style availability and rule matching (All/Any/None).
- Special rules include Flagged and Due Soon, plus date range filters.
- New perspectives default to Availability = Available.
