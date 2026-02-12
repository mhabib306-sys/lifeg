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
Today implies availability; setting Today moves Inbox items to Anytime.

## Date Semantics
- **Defer (Start)** controls availability. If `deferDate > today`, the task is not available.
- **Due** is a deadline signal, not availability.

## Perspective Rules

**Implementation:** All perspective filters live in `getFilteredTasks()` inside
`src/features/task-filter.js`. Cross-cutting predicates (like the "next" label
check) use shared helpers at the top of that file so the logic can't drift
between perspectives.

### Today
Includes (any of):
- `today = true`
- due today
- overdue (due date in the past)
- defer date ≤ today
- **carries the "next" label** (case-insensitive match via `isNextTaggedTask()`)

Excludes: tasks deferred to the future (`deferDate > today`).

### Next
Includes (any of):
- **carries the "next" label** (same `isNextTaggedTask()` helper as Today)
- status = `anytime` AND no due date AND not future-deferred

> The "next" label is the **shared concept** between Today and Next. Both
> perspectives use the single `isNextTaggedTask()` predicate so adding or
> renaming this label only requires one code change.

### Flagged
Includes tasks with `flagged = true` (non-exclusive of status).

### Anytime
Includes tasks with:
- status = `anytime` (today flag does not exclude)
- no future due date (`dueDate <= today` or no due date)
- defer date ≤ today (or no defer date)

### Upcoming
Includes tasks with a future due date (strictly after today).

### Someday
Includes tasks where status = `someday`.

### Inbox
Includes tasks where status = `inbox` **and** area is not set.

### Logbook
Includes all tasks where `completed = true`.

## Cross-Perspective Predicates

| Predicate | Helper | Used by |
|---|---|---|
| "next" label | `isNextTaggedTask()` | Today, Next |

When adding a new cross-cutting concept (e.g., a "blocked" label), follow this
pattern: define one predicate function, reference it from every perspective that
needs it, and add a row to this table.

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
