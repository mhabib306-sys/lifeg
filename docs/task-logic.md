# Task Logic (Things 3 / OmniFocus Hybrid)

This project borrows the **visual model** from Things 3 with a few **filtering rules**
from OmniFocus. The intent is to keep Things 3’s simplicity while preserving the
power of OmniFocus-style availability.

## Status Semantics
- **Inbox**: Unprocessed tasks (no category). Assigning a category moves it to Anytime.
- **Anytime**: General bucket for available tasks.
- **Today**: A flag-like status indicating explicit focus today.
- **Someday**: Hidden from active lists.

## Date Semantics
- **Defer (Start)** controls availability. If `deferDate > today`, the task is not available.
- **Due** is a deadline signal, not availability.

## Perspective Rules
### Today
Includes:
- status = `today`
- due today
- overdue
- defer date <= today
Also includes tasks tagged with label `Next` (OmniFocus influence).

### Anytime
Includes tasks with:
- status = `anytime` **or** `today`
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
