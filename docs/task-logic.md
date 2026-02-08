# Task Logic (Things 3 / OmniFocus Hybrid)

This project borrows the **visual model** from Things 3 with a few **filtering rules**
from OmniFocus. The intent is to keep Things 3’s simplicity while preserving the
power of OmniFocus-style availability.

## Status Semantics
- **Inbox**: Unprocessed tasks (no category). Assigning a category moves it to Anytime.
- **Anytime**: General bucket for available tasks.
- **Today**: A flag indicating explicit focus today (non-exclusive).
- **Flagged**: A separate importance flag (OmniFocus-style).
- **Someday**: Hidden from active lists.

## Date Semantics
- **Defer (Start)** controls availability. If `deferDate > today`, the task is not available.
- **Due** is a deadline signal, not availability.

## Perspective Rules
### Today
Includes:
- today = `true`
- due today
- overdue
- defer date <= today
Also includes tasks tagged with label `Next` (OmniFocus influence).

### Flagged
Includes tasks with `flagged = true` (non-exclusive of status).

### Anytime
Includes tasks with:
- status = `anytime` (today flag does not exclude)
- no future due date
- defer date <= today

### Upcoming
Includes tasks with a future due date (strictly after today).

### Someday
Includes tasks where status = `someday`.

### Inbox
Includes tasks where status = `inbox` **and** category is not set.

### Next (OmniFocus-style)
Includes tasks with:
- status = `anytime`
- no due date
- defer date <= today

## Notes vs Tasks
Notes are stored in the same array but use `isNote = true` and do not appear
in task perspectives (except Logbook).

## Custom Perspectives (OmniFocus-inspired)
Custom perspectives support OmniFocus-style availability rules and filters:
- **Match mode**: All rules, Any rule, or None of the rules.
- **Availability**: Available (not deferred), Remaining (not completed), Completed.
- **Special status**: Flagged or Due Soon (next 7 days).
- **Optional filters**: Area, Status, Tags (any/all), Person, Due/Defer presence,
  Repeating, Untagged, Inbox-only, Date range, and Search terms.
