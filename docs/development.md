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
7. Meeting discussion pool:
- Ensure attendee emails match People emails and discussion pool items can be linked into current meeting.
8. Mobile:
- Verify calendar page layout + event actions modal on narrow viewport.

## QA Matrix (Minimum)
- Platforms: Desktop Chrome/Safari, Mobile Safari/Chrome
- Modes: Online, Offline-then-online
- Entry points: Workspace, Calendar page, Home widgets
- Data state: Fresh user, existing synced user, token-expired Google Calendar user

## iOS Performance Budget (Phase 1-2 Baseline)

Targets measured on iPhone 15 Pro Simulator (Xcode 16+, iOS 18 SDK):

| Metric | Target | Notes |
|--------|--------|-------|
| Cold launch to interactive | < 2.5s | Measured from app tap to first meaningful paint |
| Memory at idle | < 80MB | Safari Web Inspector → Memory tab |
| Task completion animation | 60fps | Timeline tab → no dropped frames |
| Tab switch animation | < 200ms | View Transitions or cross-fade fallback |
| Swipe gesture response | < 16ms/frame | No jank during pan |
| JS memory leaks | None | 20 render() cycles, stable heap |
| Haptic latency (native) | < 5ms | Capacitor Haptics plugin |
| Haptic latency (vibrate fallback) | < 20ms | navigator.vibrate on web |

### Build Size Budget

| Artifact | Limit | Current |
|----------|-------|---------|
| dist/ total | < 2MB | ~1.59MB |
| Main JS chunk | < 900KB | ~838KB |
| Dashboard chunk | < 250KB | ~224KB |

### How to Measure

1. **Cold launch**: Xcode Instruments → App Launch template
2. **Animation FPS**: Safari Web Inspector → Timeline → Frames
3. **Memory**: Safari Web Inspector → Memory → Heap Snapshots
4. **Gesture latency**: Timeline → Input Events vs Frame Boundaries
5. **Build size**: `npm run build` postbuild validator output

### Web Performance (GitHub Pages)

Verify with Lighthouse:
- Performance score: > 85
- First Contentful Paint: < 2s
- Total Blocking Time: < 300ms

## Reliability Guardrails for New Features
- Every new user-generated entity must define:
1. Local storage key/persistence behavior
2. Cloud payload inclusion
3. Cloud load merge policy
4. Conflict policy (newest/local/manual)
5. Recovery behavior when offline or cloud save fails
