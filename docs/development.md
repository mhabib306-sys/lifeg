# Development

## Commands
```
npm run dev
npm run build
npm run preview
npm run deploy
```

## Release Checklist
1. Bump `APP_VERSION` in `src/constants.js`
2. Bump `version` in `package.json`
3. Update version in `CLAUDE.md`
4. Update docs if behavior changed
5. Run smoke checks (see below)
6. Commit, push, deploy

## Required Smoke Checks (Release Gate)
1. Task lifecycle:
- Create task, move area, complete/uncomplete, reload, verify state persists.
2. Cross-view consistency:
- Complete a task from calendar sidebar, confirm it disappears from active workspace lists.
3. Multi-device conflict simulation:
- Load cloud, modify same task locally, confirm newer `updatedAt` wins after sync.
4. Meeting notes:
- Create/edit notes from calendar event, reload, verify persistence.
5. Meeting note scope conversion:
- Add bullets/tasks in instance scope, switch to series, verify linked items remain visible and editable, reload and verify no loss.
6. Canceled events:
- Confirm canceled Google events do not render in calendar grids/lists.
7. Mobile:
- Verify calendar page layout + event actions modal on narrow viewport.

## QA Matrix (Minimum)
- Platforms: Desktop Chrome/Safari, Mobile Safari/Chrome
- Modes: Online, Offline-then-online
- Entry points: Workspace, Calendar page, Home widgets
- Data state: Fresh user, existing synced user, token-expired Google Calendar user

## Reliability Guardrails for New Features
- Every new user-generated entity must define:
1. Local storage key/persistence behavior
2. Cloud payload inclusion
3. Cloud load merge policy
4. Conflict policy (newest/local/manual)
5. Recovery behavior when offline or cloud save fails
