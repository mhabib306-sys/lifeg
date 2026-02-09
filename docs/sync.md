# Sync & Conflict Resolution

## Source of Truth Contract

### Local-first behavior
- The UI always reads/writes from in-memory state (`state.*`) and localStorage.
- Cloud sync is eventually consistent, not blocking for UI actions.
- Every user mutation must:
1. Update `state`
2. Persist localStorage
3. Queue cloud sync via `window.debouncedSaveToGithub()`

### Cloud ownership boundaries
- `state.allData` (daily metrics): merged with date/category/field-level fill behavior.
- `tasks`, `meetingNotesByEvent`: merged by entity ID/event key with timestamp preference.
- `taskCategories`, `taskLabels`, `taskPeople`, `customPerspectives`, `homeWidgets`: merged by ID, local wins on same-ID conflicts unless explicit timestamp policy exists.

## Payload Contract (`data.json`)
- `lastUpdated`
- `data`
- `weights`
- `maxScores`
- `tasks`
- `taskCategories`
- `taskLabels`
- `taskPeople`
- `customPerspectives`
- `homeWidgets`
- `meetingNotesByEvent`

## Conflict Resolution Rules

### Daily data (`state.allData`)
1. If `cloud.lastUpdated` is newer than local `lastUpdated`, cloud may replace local for daily tracking payload.
2. If local is newer/equal, cloud data only fills local gaps (no local overwrite).

### Tasks
- Merge by `task.id`.
- If both local and cloud contain same task:
1. Compare `updatedAt` (fallback `createdAt`).
2. Keep newer task record.
- If one side is missing task ID, keep existing task from the other side.

### Meeting notes
- Merge by `eventKey`.
- Newer `updatedAt` (fallback `createdAt`) wins.
- Meeting workspace bullets/tasks are stored in `tasks[]` via `meetingEventKey` and follow task merge rules.

### Metadata collections (categories/labels/people/perspectives/widgets)
- Merge by `id`.
- Preserve all unique IDs.
- On same-ID conflict without reliable timestamps: local wins.

## Autosave SLO and Retry Policy
- Target: local persistence within the same event loop tick of a user action.
- Target: cloud write attempt within 2 seconds (debounced).
- On cloud write failure:
1. Keep local data authoritative.
2. Expose sync error state (`updateSyncStatus('error', ...)`).
3. Retry on next mutation or when network returns (`online` event).

## Session/Integration State Model

### Google Calendar
- `connected && valid token`: sync enabled.
- `connected && expired token`: attempt silent refresh.
- `refresh failed`: show reconnect prompt; keep app usable.

### UI states that must exist
- loading
- syncing
- success
- error
- expired-session
- offline-local-only

## Invariants (must always hold)
- A task with `completed=true` must not appear in active task lists (calendar/workspace/home active widgets).
- Moving a task between areas updates a single task record (no duplicates).
- Any action path (workspace, calendar sidebar, mobile) must hit the same domain mutation function.

## Idempotency Expectations
- Replaying the same cloud payload should not duplicate entities.
- Re-running merges with unchanged data should produce stable state.
