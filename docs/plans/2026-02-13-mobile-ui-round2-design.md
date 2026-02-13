# Mobile UI Round 2: 21 Improvements

## Context
Round 1 (v4.43.12) shipped 20 fixes: touch targets, scroll preservation, keyboard detection, layout harmonization, inline validation, hover state fixes. Round 2 addresses the next layer of mobile UX issues discovered through codebase analysis and verification.

## Priority: Input & Keyboard first, then gestures, layout, polish.

## Files to Modify
- `src/ui/task-modal.js` — textarea auto-resize, date picker, keyboard avoidance
- `src/ui/render.js` — search auto-focus, mobile sync indicator
- `src/ui/settings.js` — inputmode attributes
- `src/ui/tracking.js` — inputmode attributes
- `src/ui/calendar-view.js` — swipe navigation, mobile week view
- `src/ui/dashboard.js` — Chart.js responsive config
- `src/ui/mobile.js` — bottom nav scroll hide, drawer edge detection
- `src/features/tasks.js` — haptic feedback
- `src/features/drag-drop.js` — will-change optimization
- `src/features/inline-autocomplete.js` — popup width fix
- `src/styles/main.css` — prefers-reduced-motion, z-index scale, widget gap, settings overflow
- `src/bridge.js` — expose new functions if needed

## The 21 Fixes

### Input & Keyboard UX (5)

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | Textarea doesn't auto-resize | task-modal.js | `oninput` handler: `this.style.height='auto'; this.style.height=this.scrollHeight+'px'` |
| 2 | Date inputs miss showPicker() | task-modal.js | `onclick="if(this.showPicker)this.showPicker()"` on date/time inputs |
| 3 | Number inputs lack inputmode | settings.js, tracking.js | `inputmode="decimal"` for weights, `inputmode="numeric"` for counts |
| 4 | Search doesn't auto-focus on mobile | render.js | `setTimeout(() => getElementById('global-search-input')?.focus(), 100)` |
| 5 | Modal inputs hidden by keyboard | task-modal.js | `focus` listener + `scrollIntoView({ block: 'center' })` with 300ms delay |

### Touch Gestures (4)

| # | Issue | File | Fix |
|---|-------|------|-----|
| 6 | Calendar has no swipe navigation | calendar-view.js | touchstart/touchend on .calendar-grid, >50px horizontal = prev/next month |
| 7 | Bottom nav always visible on scroll | mobile.js + main.css | Track scroll delta, hide on down (>20px), show on up. translateY + 200ms transition |
| 8 | No haptic feedback | tasks.js | `if(navigator.vibrate) navigator.vibrate(10)` on toggleComplete and createTask |
| 9 | Drag-drop missing will-change | drag-drop.js | Set will-change:transform on touchstart, remove on touchend |

### Responsive Layout (5)

| # | Issue | File | Fix |
|---|-------|------|-----|
| 10 | Chart.js fonts hardcoded 10px | dashboard.js | Responsive font callback, aspectRatio 1.5 on mobile |
| 11 | Week timeline forces 840px scroll | calendar-view.js | Show 1-day timeline on mobile (<=768px) |
| 12 | Widget grid 16px gap on tiny screens | main.css | gap: 12px at max-width: 360px |
| 13 | Autocomplete popup width on narrow | inline-autocomplete.js | Math.min(300, innerWidth - 24) |
| 14 | Settings list clips with keyboard | main.css | max-height: 24vh at max-height: 700px |

### Polish & Accessibility (7)

| # | Issue | File | Fix |
|---|-------|------|-----|
| 15 | prefers-reduced-motion: 1 rule, 120 animations | main.css | Wrap decorative animations in @media (prefers-reduced-motion: no-preference) |
| 16 | z-index scattered (0-10000) | main.css | CSS custom properties: --z-dropdown/header/drawer/modal/autocomplete |
| 17 | Mobile header no sync indicator | render.js | Add colored dot matching desktop sync indicator |
| 18 | Braindump no focus trap | render.js or braindump.js | Tab loop on keydown (same pattern as drawer) |
| 19 | Drawer swipe conflicts iOS back gesture | mobile.js | Skip handler when touch starts at clientX < 20 |
| 20 | Autocomplete z-index 10000 | main.css | Use var(--z-autocomplete) from new scale |
| 21 | Drawer swipe also conflicts Android back | mobile.js | Skip when clientX > innerWidth - 20 |

## Implementation Order
1. Fixes #1-5 (input/keyboard) — highest user-facing impact
2. Fix #15 (reduced-motion) — accessibility compliance
3. Fix #16, #20 (z-index scale) — systemic cleanup
4. Fixes #6-9 (touch gestures) — native feel
5. Fixes #10-14 (responsive layout) — visual fixes
6. Fixes #17-19, #21 (remaining polish)

## Verification
1. `npm run build` — must pass
2. `npx vitest run` — all tests pass
3. Manual: textarea resize, date picker, calendar swipe, bottom nav hide/show, reduced-motion toggle, z-index stacking order
