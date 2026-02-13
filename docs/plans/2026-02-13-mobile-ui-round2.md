# Mobile UI Round 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship 18 mobile UX improvements across input handling, touch gestures, responsive layout, and accessibility polish.

**Architecture:** All changes are additive — no refactors. CSS changes in `main.css`, JS changes in the relevant UI/feature modules. Drag-drop fix is CSS-only (HTML5 drag API, not touch). Three design items (#2 `showPicker`, #4 search auto-focus, #15 `prefers-reduced-motion`) were verified as already implemented and are skipped.

**Tech Stack:** Vanilla JS ES modules, CSS custom properties, Chart.js 4.x, Vite build system.

---

## Task 1: Textarea Auto-Resize in Task Modal (Fix #1)

**Files:**
- Modify: `src/ui/task-modal.js:1203-1205`

**Step 1: Add oninput auto-resize handler to textarea**

In `src/ui/task-modal.js`, find the textarea at line 1203:

```html
<textarea id="task-notes" placeholder="Add details, links, or context..."
  onkeydown="if((event.metaKey||event.ctrlKey)&&event.key==='Enter'){event.preventDefault();saveTaskFromModal();}"
  class="modal-textarea-enhanced">${editingTask?.notes || ''}</textarea>
```

Replace with:

```html
<textarea id="task-notes" placeholder="Add details, links, or context..."
  onkeydown="if((event.metaKey||event.ctrlKey)&&event.key==='Enter'){event.preventDefault();saveTaskFromModal();}"
  oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
  class="modal-textarea-enhanced">${editingTask?.notes || ''}</textarea>
```

**Step 2: Set min-height and remove fixed height in CSS**

In `src/styles/main.css`, find `.modal-textarea-enhanced` and ensure it has:

```css
.modal-textarea-enhanced {
  min-height: 80px;
  max-height: 40vh;
  overflow-y: auto;
  resize: none;
}
```

Key: `resize: none` prevents manual resize handle (auto-resize replaces it). `max-height: 40vh` prevents the textarea from consuming the entire modal.

**Step 3: Auto-size on modal open for pre-filled notes**

In `src/ui/task-modal.js`, inside the `initModalAutocomplete()` setTimeout block (line 1024-1053), after the focus line (line 1049), add:

```javascript
    // Auto-size notes textarea for pre-filled content
    const notesEl = document.getElementById('task-notes');
    if (notesEl && notesEl.value) {
      notesEl.style.height = 'auto';
      notesEl.style.height = notesEl.scrollHeight + 'px';
    }
```

**Step 4: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 5: Commit**

```bash
git add src/ui/task-modal.js src/styles/main.css
git commit -m "feat: auto-resize task notes textarea on mobile"
```

---

## Task 2: inputmode Attributes for Number Inputs (Fix #3)

**Files:**
- Modify: `src/ui/settings.js:122` (createWeightInput helper)
- Modify: `src/ui/settings.js:715-721` (Perfect Day Targets)
- Modify: `src/ui/tracking.js` (all `type="number"` inputs)

**Step 1: Add inputmode to the createWeightInput helper**

In `src/ui/settings.js` line 122, find:

```html
<input type="number" step="1" value="${value}"
```

Replace with:

```html
<input type="number" step="1" inputmode="numeric" value="${value}"
```

**Step 2: Add inputmode to Perfect Day Target inputs**

In `src/ui/settings.js` around line 717, find:

```html
<input type="number" value="${state.MAX_SCORES[key]}"
```

Replace with:

```html
<input type="number" inputmode="numeric" value="${state.MAX_SCORES[key]}"
```

**Step 3: Add inputmode to tracking inputs**

In `src/ui/tracking.js`, for each `type="number"` input:
- Glucose avg (line ~145): add `inputmode="decimal"` (allows decimal point)
- Glucose TIR (line ~154): add `inputmode="decimal"`
- Insulin (line ~161): add `inputmode="decimal"`
- Whoop metrics (lines ~186-207): add `inputmode="decimal"`
- Whoop Age (line ~215): add `inputmode="decimal"`
- Water (line ~256): add `inputmode="decimal"`
- NoP (line ~262): add `inputmode="numeric"` (integer only)

Pattern: Use `inputmode="decimal"` for inputs with `step="any"` or `step="0.1"`, `inputmode="numeric"` for integer-only inputs.

**Step 4: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 5: Commit**

```bash
git add src/ui/settings.js src/ui/tracking.js
git commit -m "feat: add inputmode attributes for better mobile keyboards"
```

---

## Task 3: Keyboard Avoidance — scrollIntoView on Focus (Fix #5)

**Files:**
- Modify: `src/ui/task-modal.js:1024-1053` (initModalAutocomplete setTimeout block)

**Step 1: Add focus listener for keyboard avoidance**

In `src/ui/task-modal.js`, inside `initModalAutocomplete()` setTimeout block, after the autocomplete setup (line 1052), add:

```javascript
    // Keyboard avoidance: scroll focused input into view on mobile
    if (window.innerWidth <= 768) {
      const modalBody = document.querySelector('.modal-body-enhanced');
      if (modalBody) {
        modalBody.querySelectorAll('input, textarea, select').forEach(el => {
          el.addEventListener('focus', () => {
            setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
          });
        });
      }
    }
```

The 300ms delay allows the iOS keyboard to finish animating before scrolling. `block: 'center'` positions the input in the middle of the visible area, not at the edge.

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/ui/task-modal.js
git commit -m "feat: scroll focused input into view when keyboard opens on mobile"
```

---

## Task 4: Calendar Swipe Navigation (Fix #6)

**Files:**
- Modify: `src/ui/calendar-view.js` (after month grid rendering)
- Modify: `src/ui/render.js` (post-render hook)

**Step 1: Add swipe detection to calendar grid**

In `src/ui/calendar-view.js`, add a new exported function after the existing calendar functions:

```javascript
/**
 * Attach touch swipe listeners to the calendar grid for month navigation.
 * Called after render when calendar tab is active.
 */
export function attachCalendarSwipe() {
  const grid = document.querySelector('.calendar-grid');
  if (!grid || grid._swipeAttached) return;
  grid._swipeAttached = true;

  let startX = 0;
  let startY = 0;

  grid.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  grid.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    // Only trigger on predominantly horizontal swipes (>50px, and more horizontal than vertical)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) window.calendarNextMonth();
      else window.calendarPrevMonth();
    }
  }, { passive: true });
}
```

**Step 2: Call attachCalendarSwipe after render**

In `src/ui/render.js`, in the post-render `setTimeout` block, add after calendar-related setup:

```javascript
if (state.activeTab === 'calendar') {
  if (typeof window.attachCalendarSwipe === 'function') window.attachCalendarSwipe();
}
```

**Step 3: Export via bridge**

In `src/bridge.js`, import `attachCalendarSwipe` from `../src/ui/calendar-view.js` and add to the `Object.assign(window, {...})` block.

**Step 4: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 5: Commit**

```bash
git add src/ui/calendar-view.js src/ui/render.js src/bridge.js
git commit -m "feat: add swipe gesture for calendar month navigation"
```

---

## Task 5: Bottom Nav Hide on Scroll (Fix #7)

**Files:**
- Modify: `src/ui/mobile.js` (add scroll listener)
- Modify: `src/styles/main.css` (add transition + hidden class)
- Modify: `src/bridge.js` (export if needed)

**Step 1: Add CSS class for hidden bottom nav**

In `src/styles/main.css`, after the `.mobile-bottom-nav` block (around line 1306), add:

```css
.mobile-bottom-nav {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.mobile-bottom-nav.nav-scroll-hidden {
  transform: translateY(100%);
  opacity: 0;
  pointer-events: none;
}
```

**Step 2: Add scroll direction tracker in mobile.js**

In `src/ui/mobile.js`, add a new exported function:

```javascript
let _lastScrollY = 0;
let _scrollHideAttached = false;

/**
 * Initialize bottom nav auto-hide on scroll down, show on scroll up.
 * Only activates on mobile (<=768px).
 */
export function initBottomNavScrollHide() {
  if (_scrollHideAttached || window.innerWidth > 768) return;
  _scrollHideAttached = true;
  _lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) return;

    const currentY = window.scrollY;
    const delta = currentY - _lastScrollY;

    // Hide on scroll down (>20px delta), show on scroll up or near top
    if (delta > 20 && currentY > 100) {
      nav.classList.add('nav-scroll-hidden');
    } else if (delta < -10 || currentY < 50) {
      nav.classList.remove('nav-scroll-hidden');
    }

    _lastScrollY = currentY;
  }, { passive: true });
}
```

**Step 3: Call from main.js or render post-render**

In `src/main.js`, after the existing mobile initialization (around line 258), add:

```javascript
if (window.innerWidth <= 768) {
  initBottomNavScrollHide();
}
```

Import `initBottomNavScrollHide` from `./ui/mobile.js` in `main.js`.

**Step 4: Ensure nav shows on tab switch**

In `src/ui/render.js`, in the `switchTab()` function, add:

```javascript
const nav = document.querySelector('.mobile-bottom-nav');
if (nav) nav.classList.remove('nav-scroll-hidden');
```

**Step 5: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 6: Commit**

```bash
git add src/ui/mobile.js src/styles/main.css src/main.js src/ui/render.js
git commit -m "feat: auto-hide bottom nav on scroll down, show on scroll up"
```

---

## Task 6: Haptic Feedback (Fix #8)

**Files:**
- Modify: `src/features/tasks.js:214-268` (toggleTaskComplete)
- Modify: `src/features/tasks.js:82-122` (createTask)

**Step 1: Add haptic feedback to toggleTaskComplete**

In `src/features/tasks.js`, inside `toggleTaskComplete()`, right after `task.completed = !task.completed;` (line ~218), add:

```javascript
    // Light haptic feedback on toggle
    if (navigator.vibrate) navigator.vibrate(10);
```

**Step 2: Add haptic feedback to createTask**

In `src/features/tasks.js`, inside `createTask()`, right before the `return task;` line (~121), add:

```javascript
  if (navigator.vibrate) navigator.vibrate(10);
```

**Step 3: Verify**

Run: `npm run build && npx vitest run tests/tasks.test.js`
Expected: Build passes, all task tests pass. (Note: `navigator.vibrate` is undefined in jsdom, so the `if` guard prevents errors.)

**Step 4: Commit**

```bash
git add src/features/tasks.js
git commit -m "feat: add light haptic feedback on task toggle and creation"
```

---

## Task 7: Drag-Drop will-change (Fix #9)

**Files:**
- Modify: `src/styles/main.css` (`.task-item.dragging` rule)

**Step 1: Add will-change to dragging state**

In `src/styles/main.css`, find the `.task-item.dragging` rule (should be near the task item styles). Add `will-change: transform;` to the existing rule. If no `.task-item.dragging` rule exists, find the `.dragging` class (used by drag-drop.js at line 11: `e.target.classList.add('dragging')`) and add:

```css
.task-item.dragging {
  will-change: transform;
}
```

Also find any existing `transform` on `.dragging` (e.g., `transform: scale(1.02)`) and ensure `will-change` is declared.

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/styles/main.css
git commit -m "feat: add will-change optimization for drag-drop transforms"
```

---

## Task 8: Chart.js Responsive Font Sizes (Fix #10)

**Files:**
- Modify: `src/ui/dashboard.js:232-238` (Chart.js options)

**Step 1: Make chart options responsive**

In `src/ui/dashboard.js`, find the chart options at line 232:

```javascript
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } },
    x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
  }
}
```

Replace with:

```javascript
options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { size: window.innerWidth < 768 ? 10 : 12 } }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: v => v + '%',
        font: { size: window.innerWidth < 768 ? 9 : 11 }
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: window.innerWidth < 768 ? 60 : 45,
        font: { size: window.innerWidth < 768 ? 8 : 10 }
      }
    }
  }
}
```

Check if there are other Chart.js instances in the file and apply the same pattern.

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/ui/dashboard.js
git commit -m "feat: responsive chart font sizes for mobile"
```

---

## Task 9: Mobile Week Timeline — 1-Day View (Fix #11)

**Files:**
- Modify: `src/ui/calendar-view.js:265-267`

**Step 1: Detect mobile and limit columns**

In `src/ui/calendar-view.js`, find the week timeline grid at line 265-267:

```javascript
return `
  <div class="overflow-auto border border-[var(--border-light)] rounded-lg">
    <div class="grid ${dayDates.length === 1 ? 'grid-cols-[56px_1fr]' : 'grid-cols-[56px_repeat(7,minmax(160px,1fr))] min-w-[840px]'}">
```

Replace with:

```javascript
const isMobileTimeline = window.innerWidth <= 768;
const timelineDays = isMobileTimeline && dayDates.length > 1 ? [dayDates[dayDates.indexOf(today) >= 0 ? dayDates.indexOf(today) : 0]] : dayDates;
const colClass = timelineDays.length === 1
  ? 'grid-cols-[56px_1fr]'
  : isMobileTimeline
    ? `grid-cols-[56px_repeat(${timelineDays.length},minmax(120px,1fr))] min-w-[${56 + timelineDays.length * 120}px]`
    : 'grid-cols-[56px_repeat(7,minmax(160px,1fr))] min-w-[840px]';
return `
  <div class="overflow-auto border border-[var(--border-light)] rounded-lg">
    <div class="grid ${colClass}">
```

Make sure to also use `timelineDays` instead of `dayDates` for the header row and cell rendering below this line. Check the loop that generates the header cells and time-slot cells.

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/ui/calendar-view.js
git commit -m "feat: show single-day timeline on mobile instead of full week"
```

---

## Task 10: CSS Batch — Widget Gap, Settings Overflow, Drag will-change (Fixes #12, #14)

**Files:**
- Modify: `src/styles/main.css`

**Step 1: Add widget grid gap reduction for tiny screens**

After the existing mobile widget grid rule (around line 1722), add:

```css
@media (max-width: 360px) {
  .widget-grid {
    gap: 12px !important;
  }
}
```

**Step 2: Add settings list max-height for short viewports**

Near the end of the mobile media queries, add:

```css
@media (max-height: 700px) {
  .max-h-36 {
    max-height: 24vh !important;
  }
}
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 4: Commit**

```bash
git add src/styles/main.css
git commit -m "fix: widget gap on tiny screens + settings overflow on short viewports"
```

---

## Task 11: Autocomplete Popup Width on Narrow Screens (Fix #13)

**Files:**
- Modify: `src/features/inline-autocomplete.js:309-310`

**Step 1: Use viewport-relative width**

In `src/features/inline-autocomplete.js`, find lines 309-310:

```javascript
popup.style.left = Math.min(rect.left, window.innerWidth - 310) + 'px';
popup.style.width = Math.min(rect.width, 300) + 'px';
```

Replace with:

```javascript
const popupWidth = Math.min(300, window.innerWidth - 24);
popup.style.left = Math.min(rect.left, window.innerWidth - popupWidth - 12) + 'px';
popup.style.width = popupWidth + 'px';
```

This ensures 12px margin on each side on narrow screens. On a 320px phone: `Math.min(300, 296) = 296px`, positioned with 12px margin.

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/features/inline-autocomplete.js
git commit -m "fix: autocomplete popup width adapts to narrow screens"
```

---

## Task 12: z-index Scale with CSS Custom Properties (Fixes #16, #20)

**Files:**
- Modify: `src/styles/main.css`

**Step 1: Define z-index scale in :root**

In `src/styles/main.css`, at the top of the file (after the tailwind imports), or in the `:root` block, add:

```css
:root {
  --z-base: 1;
  --z-raised: 10;
  --z-sticky: 100;
  --z-drawer-overlay: 200;
  --z-drawer: 201;
  --z-dropdown: 300;
  --z-modal: 340;
  --z-search: 350;
  --z-toast: 400;
  --z-autocomplete: 500;
}
```

**Step 2: Replace the worst offenders**

Replace these specific z-index values:
- Line 2401: `.inline-autocomplete-popup` `z-index: 10000` → `z-index: var(--z-autocomplete)`
- Line 674: `.task-item-actions` `z-index: 1000` → `z-index: var(--z-sticky)`
- Line 714: `.sidebar-drag-indicator` `z-index: 1000` → `z-index: var(--z-sticky)`
- Line 1301: `.mobile-bottom-nav` `z-index: 100` → `z-index: var(--z-sticky)`
- Line 1438: drawer overlay `z-index: 80` → `z-index: var(--z-drawer-overlay)`
- Line 1459: drawer `z-index: 200` → `z-index: var(--z-drawer)`
- Line 2333: `.autocomplete-dropdown.show` `z-index: 300` → `z-index: var(--z-dropdown)`
- Line 3805: `.modal-overlay` `z-index: 300` → `z-index: var(--z-modal)`
- Line 3891: `.undo-toast` `z-index: 100` → `z-index: var(--z-toast)`
- Line 3921: `.braindump-overlay` `z-index: 340` → `z-index: var(--z-modal)`
- Line 4447: `.global-search-overlay` `z-index: 350` → `z-index: var(--z-search)`

Leave low-value z-indexes (0, 1, 2, 10) alone — they're fine as-is for local stacking.

**Step 3: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 4: Commit**

```bash
git add src/styles/main.css
git commit -m "refactor: z-index scale via CSS custom properties"
```

---

## Task 13: Mobile Sync Indicator in Header (Fix #17)

**Files:**
- Modify: `src/ui/render.js:252-254` (mobile header center)

**Step 1: Add sync dot to mobile header**

In `src/ui/render.js`, find the mobile header center area (around line 252-254):

```html
<div class="mobile-header-center">
  <h1 class="mobile-header-title ...">...</h1>
  <span class="mobile-version ...">v${APP_VERSION}</span>
</div>
```

Add a sync indicator dot after the version span:

```html
<div class="mobile-header-center">
  <h1 class="mobile-header-title ...">...</h1>
  <div class="flex items-center gap-1.5">
    <span class="mobile-version text-[10px] font-semibold text-[var(--text-muted)]">v${APP_VERSION}</span>
    <div class="w-1.5 h-1.5 rounded-full" style="background: ${getGithubToken() ? 'var(--success)' : 'var(--text-muted)'}"></div>
  </div>
</div>
```

The `getGithubToken()` function is already imported/available in render.js (used at line 298 for the desktop indicator).

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/ui/render.js
git commit -m "feat: add sync status indicator to mobile header"
```

---

## Task 14: Braindump Focus Trap (Fix #18)

**Files:**
- Modify: `src/ui/braindump.js` (add keydown handler)

**Step 1: Add focus trap function**

In `src/ui/braindump.js`, find the `openBraindump` or render function. Add a focus trap that mirrors the drawer pattern from `mobile.js:22-44`:

```javascript
function trapBraindumpFocus(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeBraindump();
    return;
  }
  if (e.key !== 'Tab') return;

  const overlay = document.querySelector('.braindump-overlay');
  if (!overlay) return;
  const focusable = overlay.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
```

**Step 2: Attach/detach on open/close**

In the `openBraindump()` function, add:
```javascript
document.addEventListener('keydown', trapBraindumpFocus);
```

In the `closeBraindump()` function, add:
```javascript
document.removeEventListener('keydown', trapBraindumpFocus);
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 4: Commit**

```bash
git add src/ui/braindump.js
git commit -m "feat: add focus trap to braindump overlay"
```

---

## Task 15: Drawer Edge Swipe Conflict Prevention (Fixes #19, #21)

**Files:**
- Modify: `src/ui/mobile.js:55-60` (`_handleSwipeStart` function)

**Step 1: Add edge zone detection**

In `src/ui/mobile.js`, find `_handleSwipeStart` at line 55:

```javascript
function _handleSwipeStart(e) {
  _swipeTouchStartX = e.touches[0].clientX;
  _swipeTouchCurrentX = _swipeTouchStartX;
  _swipeDragging = true;
}
```

Replace with:

```javascript
function _handleSwipeStart(e) {
  const x = e.touches[0].clientX;
  // Skip if touch starts in OS gesture zones (iOS back gesture, Android edge)
  if (x < 20 || x > window.innerWidth - 20) {
    _swipeDragging = false;
    return;
  }
  _swipeTouchStartX = x;
  _swipeTouchCurrentX = _swipeTouchStartX;
  _swipeDragging = true;
}
```

**Step 2: Verify**

Run: `npm run build`
Expected: Build passes.

**Step 3: Commit**

```bash
git add src/ui/mobile.js
git commit -m "fix: drawer swipe skips OS edge gesture zones (iOS/Android)"
```

---

## Final: Version Bump, Full Test Suite, Deploy

**Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: All 4505+ tests pass.

**Step 2: Build**

```bash
npm run build
```

Expected: Build passes.

**Step 3: Bump version**

```bash
npm run bump minor
```

(Minor bump: this is a feature release with 18 improvements.)

**Step 4: Commit and push**

```bash
git add -A
git commit -m "Mobile UI Round 2: 18 improvements — input UX, gestures, layout, polish (v4.44.0)"
git push
```

**Step 5: Deploy**

```bash
npm run deploy
```

---

## Summary of All Changes

| Task | Fixes | Files Modified |
|------|-------|----------------|
| 1 | Textarea auto-resize | task-modal.js, main.css |
| 2 | inputmode attributes | settings.js, tracking.js |
| 3 | Keyboard avoidance | task-modal.js |
| 4 | Calendar swipe | calendar-view.js, render.js, bridge.js |
| 5 | Bottom nav scroll hide | mobile.js, main.css, main.js, render.js |
| 6 | Haptic feedback | tasks.js |
| 7 | Drag will-change | main.css |
| 8 | Chart.js responsive | dashboard.js |
| 9 | Week timeline mobile | calendar-view.js |
| 10 | Widget gap + settings overflow | main.css |
| 11 | Autocomplete popup width | inline-autocomplete.js |
| 12 | z-index scale | main.css |
| 13 | Mobile sync indicator | render.js |
| 14 | Braindump focus trap | braindump.js |
| 15 | Drawer edge swipe | mobile.js |

### Skipped (already implemented)
- Fix #2: `showPicker()` — already in `openDatePicker()` at task-modal.js:726
- Fix #4: Search auto-focus — already in `openGlobalSearch()` at search.js:69
- Fix #15: `prefers-reduced-motion` — blanket `*` rule at main.css:3268 already disables all animations
