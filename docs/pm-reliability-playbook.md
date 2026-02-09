# PM Reliability Playbook

## Scope
Use this checklist for any feature that mutates user data, spans multiple views, or syncs across devices.

## 1) Feature Definition Template (mandatory)
- Domain action(s): what user intent changes data?
- Entity ownership: which model owns each field?
- View parity: which views can trigger the same action?
- Success states: immediate UI response, persisted locally, synced remotely.
- Failure states: offline, auth expired, cloud write failed, merge conflict.

## 2) Conflict Strategy Matrix
- Newest wins: entities with reliable `updatedAt` (`tasks`, `meeting notes`)
- Local wins: taxonomies/config without trustworthy timestamps
- Gap-fill merge: sparse daily records (`allData`)
- Manual intervention: only for destructive merges (future enhancement)

## 3) Hidden Workflow Coverage (Calendar + Meeting Notes)
- Event without conferencing link -> still allow notes.
- Event deleted/canceled after notes exist -> keep notes addressable by event key.
- Recurring event instances -> notes tied to specific instance ID unless product says series-level notes.
- Meeting follow-ups -> convert notes action items into tasks (future feature scope).
- External meeting URLs -> support Meet/Zoom/Teams detection fallback to generic link.

## 4) Autosave Product Requirements
- Local write is synchronous with user action.
- Cloud save is debounced and non-blocking.
- Failed cloud save never rolls back local state.
- UI status reflects syncing/error/idle.
- User can force refresh/retry without data loss.

## 5) Acceptance Criteria (must pass before release)
1. Completing a task in any view updates all other views after render.
2. Reload after completion retains task state.
3. Multi-device stale payload cannot overwrite newer local `updatedAt`.
4. Area moves and metadata updates survive sync round-trips.
5. Canceled calendar events stay hidden in all calendar views.
6. Meeting notes create/edit/open behavior is deterministic.

## 6) Observability Requirements
- Console or telemetry event on:
- cloud save attempt/success/failure
- merge conflict decision path (entity + winner)
- token refresh failure
- release smoke test failures

## 7) Release Governance
- Feature flag risky sync logic when possible.
- Require smoke checklist run on every release.
- If sync behavior changes, update:
- `docs/sync.md`
- `docs/data-model.md`
- `docs/development.md`
- `CLAUDE.md` standards section
