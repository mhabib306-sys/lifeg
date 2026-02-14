# ThingsXGeist v3: Homebase iOS Native App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

> **Goal:** Convert the Homebase PWA (v4.59.1) into a native iOS app using Capacitor 8 with Things 3-level micro-interactions, Geist design system, spring physics animations, and synchronized haptic feedback — targeting App Store approval.

> **After execution:** Copy this plan to `docs/plans/thingsxgeist3.md` and push to the repo.

---

## Context

Homebase is a mature PWA (v4.59.1) with 5 tabs, full DOM replacement rendering, comprehensive theme system (3 themes × 2 color modes), and existing gesture handling (swipe-to-reveal, long-press drag, pull-to-refresh, modal swipe-dismiss). The codebase already has motion tokens, 20+ CSS animations, safe area handling, and a Tauri desktop wrapper.

**What already exists (DO NOT recreate):**
- Dark mode: 3 themes × 2 modes, `getColorMode()`/`setColorMode()` in `github-sync.js`, Light/Dark toggle in Settings
- Swipe-to-reveal: `src/features/swipe-actions.js` (72px threshold, reveal complete/flag/delete)
- Touch drag-to-reorder: `src/features/touch-drag.js` (500ms hold, clone, auto-scroll)
- Pull-to-refresh: `src/features/pull-to-refresh.js` (60px threshold, rubber-band)
- Safe area CSS: 15+ usages of `env(safe-area-inset-*)` across `main.css`
- Motion tokens: `--ease-spring`, `--duration-fast`, `--ease-bounce` in `themes.css`
- 20+ `@keyframes` (checkPop, sheetSlideUp, fadeIn, tagPop, etc.)
- `haptic()` in `src/utils.js:205-210` via `navigator.vibrate`
- Firebase auth with Google OAuth direct navigation in `src/data/firebase.js`
- `data-task-id` on `.swipe-row` and `.task-inline-title` elements
- `index.html` already has `viewport-fit=cover`
- Tauri desktop support (`src-tauri/`)

**What doesn't exist yet:**
- Capacitor (any version)
- Native haptics (only `navigator.vibrate`)
- Local font files (Geist from jsDelivr CDN, Inter from Google Fonts CDN)
- Motion library (`motion.dev`)
- View Transitions API usage
- Animation overlay `<div>`
- iOS-specific native features (biometrics, widgets, Siri, push notifications)

---

## Changes from v2 Plan (Audit Fixes)

| ID | Severity | Issue | v3 Fix |
|----|----------|-------|--------|
| C1 | CRITICAL | Motion import path wrong | Use `import { animate } from 'motion/mini'` (~3.8KB WAAPI) + `import { spring } from 'motion'` |
| C2 | CRITICAL | Capacitor 7 → 8 released | Target Capacitor 8 with SPM (not CocoaPods). Min iOS 15.0 |
| C3 | CRITICAL | Biometric plugin ambiguous | Use `@capgo/capacitor-native-biometric` v8 |
| H1 | HIGH | Firebase OAuth fragile in WKWebView | Use `@capacitor/browser` (SFSafariViewController) + credential-based flow |
| H2 | HIGH | Gesture scroll conflicts | Add `touch-action: pan-y` on containers, increase angle threshold to ~38° |
| H3 | HIGH | No animation overlay cleanup | 3-second max lifetime for clones, sweep on each `render()` |
| H4 | HIGH | Swipe state is module-global booleans | Gesture session objects with unique IDs |
| H5 | HIGH | No drag auto-scroll | Already exists in `touch-drag.js` (60px edge, 8px/frame) — no action needed |
| M1 | MEDIUM | PWA plugin still evaluates in Cap builds | Use `disabled: isCapacitor` property on VitePWA |
| M2 | MEDIUM | CSS spring curves handwritten | Generate via `motion` `spring()`, document generation script |
| M3 | MEDIUM | Batch toolbar unspecified | Removed from v3 — existing swipe-to-reveal covers this |
| M4 | MEDIUM | No View Transition fallback | Add CSS cross-fade fallback for iOS 17 |
| M5 | MEDIUM | `data-task-id` missing on `.task-item` wrapper | Add attribute to outer div |
| M6 | MEDIUM | Performance budget only at end | Add checks at end of each phase |
| M7 | MEDIUM | Phase 3 under-specified | Dark mode already done — Phase 3 is now Geist polish + status bar sync |
| M8 | MEDIUM | `sharp` not in deps for icon gen | Install as devDependency |
| L1 | LOW | `isIOS()` UA sniffing misses iPadOS 13+ | Add `navigator.maxTouchPoints > 1` check |
| L2 | LOW | Keyboard `resize: 'body'` causes jumps | Use `resize: 'none'` + `--keyboard-height` CSS var |
| L3 | LOW | No branching strategy | Work on `feature/capacitor-ios` branch, merge per phase |
| L4 | LOW | `hapticSelection()` may return void | Wrap in `Promise.resolve()` |
| L5 | LOW | No app lifecycle handlers | Add `backButton` and `appStateChange` listeners |
| L6 | LOW | Privacy manifest incomplete | Audit all API categories before submission |

**Structural additions from audit:**
- Performance budget checks per phase (not just Task 49)
- Accessibility built incrementally (VoiceOver alternatives for gestures from Phase 2)
- Rollback procedure documented per phase (git tags)
- `feature/capacitor-ios` branch with phase merges to main

---

## Architecture

```
Capacitor 8 wraps existing Vite-built web app in WKWebView.
New modules: src/platform.js (leaf), src/native.js (leaf), src/features/task-animations.js
Existing gesture system ENHANCED (not replaced): swipe-actions.js, touch-drag.js
Animation overlay (#animation-overlay) outside #app for exit animations.
Dual Vite builds: base: '/lifeg/' for GitHub Pages, base: '/' for Capacitor.
Motion library: motion/mini (~3.8KB) for WAAPI spring animations.
```

**Import direction (preserved):**
```
constants.js, platform.js     ← no src/ imports (leaf)
utils.js                      ← constants
native.js                     ← platform.js only (leaf)
data/*                        ← state, constants, utils
features/*                    ← state, utils, data/*, platform.js
features/task-animations.js   ← platform.js (dynamic imports motion/mini)
ui/*                          ← state, features/*, constants, utils
bridge.js                     ← imports ALL, assigns to window
main.js                       ← imports bridge, native.js, platform.js
```

**Z-Index Scale:** animation-overlay=9999, modals=9000-9500, drag-clone=9999, magic-fab=90, batch-toolbar=95, bottom-nav=80

**Git Strategy:** `feature/capacitor-ios` branch. Tag after each phase (v4.60.0-phase1, v4.61.0-phase2, etc.). Merge to main after each phase validation.

---

## Phase 1: Capacitor 8 Foundation (17 tasks)

### Task 1: Install Capacitor 8 Core

**Files:** `package.json`

```bash
npm install @capacitor/core@^8
npm install -D @capacitor/cli@^8
npx cap init "Homebase" "com.homebase.app" --web-dir dist
```

Verify: `ls capacitor.config.ts` exists.

**Commit:** `chore: install Capacitor 8 core + CLI`

---

### Task 2: Configure Capacitor for iOS

**Files:** Create `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.homebase.app',
  appName: 'Homebase',
  webDir: 'dist',
  server: {
    allowNavigation: [
      'accounts.google.com',
      'homebase-880f0.firebaseapp.com',
    ],
  },
  ios: {
    scheme: 'Homebase',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    StatusBar: {
      style: 'DEFAULT',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'none',        // L2 fix: handle offset via --keyboard-height CSS var
      resizeOnFullScreen: true,
    },
  },
};

export default config;
```

**Commit:** `feat: configure Capacitor 8 for iOS`

---

### Task 3: Dual-Target Vite Build

**Files:** Modify `vite.config.js`, `package.json`

In `vite.config.js`:
- Read `CAPACITOR_BUILD` env var
- Set `base: isCapacitor ? '/' : '/lifeg/'`
- Use `disabled: isCapacitor` on `VitePWA()` plugin (M1 fix — prevents evaluation entirely)

Add scripts to `package.json`:
```json
"build:cap": "CAPACITOR_BUILD=true vite build",
"cap:sync": "CAPACITOR_BUILD=true vite build && npx cap sync ios",
"cap:open": "npx cap open ios",
"cap:run": "CAPACITOR_BUILD=true vite build && npx cap sync ios && npx cap run ios",
"cap:dev": "CAPACITOR_BUILD=true vite build && npx cap sync ios && npx cap run ios --livereload --external"
```

Verify: `npm run build` → dist/ with `/lifeg/` paths. `npm run build:cap` → dist/ with `/` paths.

**Commit:** `feat: dual-target Vite build (/ for Capacitor, /lifeg/ for web)`

---

### Task 4: Fix Hardcoded Base Paths in index.html

**Files:** Modify `index.html` lines 12-13

Change absolute `/lifeg/icons/...` to relative `./icons/...`:
```html
<link rel="icon" type="image/svg+xml" href="./icons/icon-192.svg">
<link rel="apple-touch-icon" sizes="180x180" href="./icons/apple-touch-icon.png">
```

Vite rewrites relative paths using the configured `base` during build.

**Commit:** `fix: use relative icon paths for dual-target builds`

---

### Task 5: Add iOS Platform with SPM

**Files:** Create `ios/` (generated), modify `.gitignore`

```bash
npm install @capacitor/ios@^8
CAPACITOR_BUILD=true npm run build
npx cap add ios
npx cap sync ios
```

Capacitor 8 uses **Swift Package Manager** by default (NOT CocoaPods — C2 fix). Verify: no `Podfile` generated.

Add to `.gitignore`:
```
# iOS build artifacts
ios/App/build/
ios/DerivedData/
```

Verify: `npx cap open ios` → Xcode opens, Cmd+B builds with 0 errors.

**Commit:** `feat: add iOS platform via Capacitor 8 with SPM`

---

### Task 6: Platform Detection Module

**Files:** Create `src/platform.js`

Leaf module (no src/ imports). Detects Capacitor, Tauri, iOS, and exposes feature flags.

```javascript
export function isCapacitor() {
  return !!(window.Capacitor?.isNativePlatform?.());
}

export function isIOS() {
  if (isCapacitor()) return window.Capacitor.getPlatform?.() === 'ios';
  // L1 fix: detect iPadOS 13+ (reports as "Macintosh")
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function getPlatform() {
  if (isCapacitor()) return window.Capacitor.getPlatform?.() || 'web';
  return 'web';
}

export function isNative() { return isCapacitor(); }

export const platformFeatures = {
  get nativeHaptics() { return isCapacitor(); },
  get nativeStatusBar() { return isCapacitor(); },
  get viewTransitions() { return !!document.startViewTransition; },
  get motionPreference() { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
};
```

**Commit:** `feat: add platform detection module (src/platform.js)`

---

### Task 7: Install Capacitor Plugins

**Files:** `package.json`

```bash
npm install @capacitor/haptics@^8 @capacitor/status-bar@^8 @capacitor/keyboard@^8 \
  @capacitor/splash-screen@^8 @capacitor/browser@^8 @capacitor/app@^8
npx cap sync ios
```

**Commit:** `chore: install Capacitor plugins (haptics, status-bar, keyboard, splash, browser, app)`

---

### Task 8: Native Integration Module

**Files:** Create `src/native.js`

Leaf module importing only from `platform.js`. All Capacitor plugins lazy-loaded via dynamic `import()` with `try/catch` (tree-shaken on web builds). Functions:

- `nativeHaptic(type)` — Native haptic with `navigator.vibrate` fallback. L4 fix: wrap `haptics.selectionChanged()` in `Promise.resolve()`
- `hapticSync(type)` — Fire-and-forget version for gesture handlers
- `setStatusBarStyle(isDark)` — Status bar content color
- `initKeyboard()` — Keyboard show/hide → body class + `--keyboard-height` CSS var
- `hideSplashScreen()` — Fade out after init
- `openInAppBrowser(url)` — SFSafariViewController for OAuth
- `initAppLifecycle()` — L5 fix: `backButton` + `appStateChange` listeners
- `initNative()` — Master init called once at boot

All functions are safe to call on web (no-op graceful degradation).

**Commit:** `feat: native integration module (src/native.js)`

---

### Task 9: Wire Platform + Native into Bridge

**Files:** Modify `src/bridge.js`

Import `platform.js` and `native.js`. Add all exports to `Object.assign(window, {...})`.

**Commit:** `chore: wire platform + native modules into bridge.js`

---

### Task 10: Initialize Native on App Boot

**Files:** Modify `src/main.js`, `src/data/github-sync.js`

In `main.js` bootstrap, after `applyStoredTheme()`:
```javascript
import { initNative } from './native.js';
initNative();
```

In `github-sync.js` `setColorMode()`, after setting `data-mode` attribute:
```javascript
if (typeof window.setStatusBarStyle === 'function') {
  window.setStatusBarStyle(mode === 'dark');
}
```

L5 fix: Add `appStateChange` listener in main.js for resume-from-background sync:
```javascript
if (isCapacitor()) {
  import('@capacitor/app').then(({ App }) => {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) window.debouncedSaveToGithub?.();
    });
  });
}
```

**Commit:** `feat: initialize native plugins on app boot`

---

### Task 11: Bundle Geist + Inter Fonts Locally

**Files:** Create `public/fonts/geist-sans/` (4 woff2), `public/fonts/geist-mono/` (1 woff2), `public/fonts/inter/` (4 woff2), `src/styles/fonts.css`. Modify `src/styles/main.css`.

Download fonts:
```bash
mkdir -p public/fonts/geist-sans public/fonts/geist-mono public/fonts/inter
curl -L -o public/fonts/geist-sans/Geist-Regular.woff2 "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.woff2"
curl -L -o public/fonts/geist-sans/Geist-Medium.woff2 "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Medium.woff2"
curl -L -o public/fonts/geist-sans/Geist-SemiBold.woff2 "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-SemiBold.woff2"
curl -L -o public/fonts/geist-sans/Geist-Bold.woff2 "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Bold.woff2"
curl -L -o public/fonts/geist-mono/GeistMono-Regular.woff2 "https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/GeistMono-Regular.woff2"
# Inter from fontsource or Google Fonts direct
curl -L -o public/fonts/inter/Inter-Regular.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.woff2"
curl -L -o public/fonts/inter/Inter-Medium.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.woff2"
curl -L -o public/fonts/inter/Inter-SemiBold.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjQ.woff2"
curl -L -o public/fonts/inter/Inter-Bold.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.woff2"
```

Create `src/styles/fonts.css` with `@font-face` for Geist (400/500/600/700), Geist Mono (400), Inter (400/500/600/700) using `/fonts/...` Vite public paths.

Import in `main.css` line 2: `@import './fonts.css';`

Keep CDN `<link>` tags in `index.html` for web builds (fast CDN path). Local fonts serve as primary for Capacitor (offline).

**Commit:** `feat: bundle Geist + Inter fonts locally for offline native use`

---

### Task 12: Add Animation Overlay to index.html

**Files:** Modify `index.html`, `src/styles/main.css`

Add after `<div id="app">`:
```html
<div id="animation-overlay" aria-hidden="true"></div>
```

CSS:
```css
#animation-overlay {
  position: fixed; inset: 0; z-index: 9999;
  pointer-events: none; overflow: hidden;
}
#animation-overlay:empty { display: none; }
```

H3 fix: Add stale clone sweep in `render.js` `render()` after `runCleanupCallbacks()`:
```javascript
const overlay = document.getElementById('animation-overlay');
if (overlay) {
  const now = Date.now();
  overlay.querySelectorAll('[data-clone-ts]').forEach(clone => {
    if (now - parseInt(clone.dataset.cloneTs, 10) > 3000) clone.remove();
  });
}
```

**Commit:** `feat: add persistent animation overlay for exit animations`

---

### Task 13: Firebase Auth WKWebView Fix

**Files:** Modify `src/data/firebase.js`, `src/main.js`

H1 fix: In `signInWithGoogle()`, detect Capacitor and use `@capacitor/browser` (SFSafariViewController):
```javascript
import { isCapacitor } from '../platform.js';

// In signInWithGoogle(), before window.location.href = url:
if (isCapacitor()) {
  const { Browser } = await import('@capacitor/browser');
  await Browser.open({ url: authUrl, presentationStyle: 'popover' });
  return; // Callback handled via App URL listener
}
window.location.href = authUrl;
```

In `main.js`, add URL listener for OAuth callback in Capacitor:
```javascript
if (isCapacitor()) {
  import('@capacitor/app').then(({ App }) => {
    App.addListener('appUrlOpen', ({ url }) => {
      if (url.includes('id_token=') || url.includes('access_token=')) {
        const hash = url.split('#')[1];
        if (hash) {
          window.location.hash = '#' + hash;
          window.handleOAuthCallback?.();
        }
      }
    });
  });
}
```

Fallback: User can sign in on web (GitHub Pages), tokens persist in localStorage. Capacitor WKWebView reads same localStorage domain if using the web URL.

**Commit:** `fix: Firebase auth for Capacitor WKWebView via SFSafariViewController`

---

### Task 14: iOS Xcode Configuration

**Files:** Modify `ios/App/App/Info.plist`, create `ios/App/App/PrivacyInfo.xcprivacy`

Info.plist entries:
- `CFBundleURLTypes` with scheme `com.homebase.app`
- `ITSAppUsesNonExemptEncryption: false`
- `UISupportedInterfaceOrientations`: portrait only (iPhone), all (iPad)
- `UIViewControllerBasedStatusBarAppearance: true`
- `NSLocationWhenInUseUsageDescription`: weather feature

L6 fix: PrivacyInfo.xcprivacy declaring `NSPrivacyAccessedAPICategoryUserDefaults` (CA92.1 reason) plus `NSPrivacyCollectedDataTypeEmailAddress` for auth.

**Commit:** `chore: iOS Info.plist, PrivacyInfo.xcprivacy, URL scheme`

---

### Task 15: Launch Screen + App Icons

**Files:** Modify `ios/App/App/Assets.xcassets/`, create `scripts/generate-ios-icons.mjs`

M8 fix: Install sharp as devDependency:
```bash
npm install -D sharp
```

Create icon generation script using `sharp` to resize `public/icons/icon-512.png` to all required iOS sizes (20-1024px at various scales). Generate `Contents.json` alongside.

Customize `LaunchScreen.storyboard` — centered logo on system background color.

**Commit:** `feat: iOS app icons and launch screen`

---

### Task 16: Validate Foundation

**Checklist:**
- [ ] `npm run build` succeeds (web target, base `/lifeg/`)
- [ ] `npm run build:cap` succeeds (Capacitor target, base `/`)
- [ ] `npx cap sync ios` succeeds
- [ ] Xcode Cmd+B: 0 errors
- [ ] Xcode Cmd+R on iPhone 15 Pro simulator: app launches
- [ ] `window.Capacitor` defined in Safari Web Inspector
- [ ] No `/lifeg/` 404 errors in console
- [ ] Fonts render (Geist on geist theme, Inter on others)
- [ ] Safe areas respected (status bar, home indicator)
- [ ] Theme switching works (light/dark)
- [ ] `npm run deploy` still works for web

**Performance budget (Phase 1):**
- Cold launch to first paint: < 3s (will improve in later phases)
- Memory at idle: < 80MB

---

### Task 17: Version Bump + Phase 1 Tag

```bash
npm run bump minor   # → 4.60.0
git tag v4.60.0-phase1
git push && git push --tags
npm run deploy
```

**Commit:** `feat: Capacitor 8 iOS foundation (v4.60.0)`

---

## Phase 2: Animation + Gesture Enhancement (12 tasks)

### Task 18: Install Motion Library

```bash
npm install motion
```

**CRITICAL (C1 fix):** Correct imports throughout all files:
```javascript
import { animate } from 'motion/mini';  // ~3.8KB WAAPI-only
import { spring } from 'motion';         // spring easing generator
```

**NEVER** use `import { animate } from 'motion'` — that pulls the 18KB React bundle.

**Commit:** `chore: install motion library for WAAPI spring animations`

---

### Task 19: CSS Spring Curves (Generated)

**Files:** Modify `src/styles/themes.css`, create `scripts/generate-spring-curves.mjs`

M2 fix: Create generation script that uses `motion` `spring()` to produce CSS `cubic-bezier` approximations. Document exact parameters:

```css
/* Spring curves — generated via scripts/generate-spring-curves.mjs */
:root {
  --spring-snappy: cubic-bezier(0.22, 1.0, 0.36, 1.0);   /* stiffness:500, damping:30 */
  --spring-smooth: cubic-bezier(0.25, 0.8, 0.25, 1.0);    /* stiffness:300, damping:30 */
  --spring-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1.0);   /* stiffness:400, damping:15 */
  --spring-gentle: cubic-bezier(0.16, 1.0, 0.3, 1.0);     /* stiffness:200, damping:25 */
  --spring-duration-snappy: 200ms;
  --spring-duration-smooth: 350ms;
  --spring-duration-bouncy: 500ms;
}
```

Keep existing `--ease-spring` for backward compat; new code uses named variants.

**Commit:** `feat: generated CSS spring curves with documentation`

---

### Task 20: Animation Engine (task-animations.js)

**Files:** Create `src/features/task-animations.js`. Modify `src/bridge.js`.

Clone-to-overlay pattern for task completion/deletion animations. Uses dynamic `import('motion/mini')` for tree-shaking.

Key functions:
- `animateTaskCompletion(taskId, completing)` — Clone task element to `#animation-overlay`, animate shrink+fade with spring physics, haptic at start
- `animateTaskDeletion(taskId)` — Clone with scale-down+fade
- `sweepStaleClones()` — H3 fix: remove clones older than 3 seconds

Each clone gets `data-clone-ts` attribute for lifetime tracking. `sweepStaleClones()` called at start of every animation and in `render()`.

Wire into bridge.js: `animateTaskCompletion, animateTaskDeletion, sweepStaleClones`

**Commit:** `feat: clone-to-overlay task animation engine with spring physics`

---

### Task 21: Wire Animated Completion into Tasks

**Files:** Modify `src/features/tasks.js`, `src/ui/tasks-tab.js`

In `toggleTaskComplete()`, before state change:
```javascript
if (typeof window.animateTaskCompletion === 'function') {
  window.animateTaskCompletion(taskId, !task.completed);
}
```

M5 fix: Add `data-task-id="${task.id}"` to outer `.task-item` div in `renderTaskItem()` (already on `.swipe-row` and `.task-inline-title`, need it on wrapper too).

**Commit:** `feat: wire animated task completion into UI`

---

### Task 22: Gesture Session IDs (H4 Fix)

**Files:** Modify `src/features/swipe-actions.js`

Replace module-level booleans with gesture session object:
```javascript
let gestureSession = null;
function createSession(startX, startY) {
  return { id: Date.now() + Math.random(), type: null, startX, startY };
}
```

`onTouchStart` creates session. `onTouchMove` sets session type on first significant move. `onTouchEnd` nulls session. All handlers check session exists before proceeding.

**Commit:** `refactor: gesture session IDs replace module-level booleans (H4 fix)`

---

### Task 23: Enhanced Swipe with Spring Physics (H2 Fix)

**Files:** Modify `src/features/swipe-actions.js`

1. Lazy-load `motion/mini` for spring snap animations on touch end
2. H2 fix: Add `touch-action: pan-y` to gesture containers in init
3. H2 fix: Increase angle threshold from implicit ~45° to ~38°:
   ```javascript
   if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 0.8) {
   ```
4. Replace CSS transition snap with `animate()` spring, with CSS fallback

**Commit:** `feat: spring physics for swipe snap + gesture angle fix (H2)`

---

### Task 24: Enhanced Touch-Drag with Overlay

**Files:** Modify `src/features/touch-drag.js`

1. Append drag clone to `#animation-overlay` instead of `document.body`
2. Add `data-clone-ts` for stale sweep compatibility
3. Use `motion/mini` for the "lift" animation (scale + shadow spring)
4. Replace `navigator.vibrate` calls with `window.hapticSync`

**Commit:** `feat: enhanced touch-drag with animation overlay + spring lift`

---

### Task 25: Replace All navigator.vibrate Calls

**Files:** Modify `src/utils.js`, `src/features/swipe-actions.js`, `src/features/touch-drag.js`, `src/features/pull-to-refresh.js`

Update `haptic()` in `utils.js:205-210` to prefer `window.hapticSync`:
```javascript
export function haptic(type = 'light') {
  if (typeof window.hapticSync === 'function') { window.hapticSync(type); return; }
  if (!navigator.vibrate) return;
  const patterns = { light: 5, medium: 10, heavy: 20, error: [10, 50, 10], success: [10, 30] };
  navigator.vibrate(patterns[type] || 5);
}
```

Replace ~8 direct `navigator.vibrate` calls across gesture modules with `window.hapticSync`.

**Commit:** `refactor: replace all navigator.vibrate with native haptic wrapper`

---

### Task 26: View Transitions for Tab Switching (M4 Fix)

**Files:** Modify `src/ui/render.js`, `src/styles/main.css`

In `switchTab()`, wrap render in View Transitions API with CSS cross-fade fallback:
```javascript
if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.startViewTransition(() => { render(); scrollToContent(); });
} else {
  // M4 fix: CSS cross-fade fallback for iOS 17
  const app = document.getElementById('app');
  if (app) {
    app.style.opacity = '0.6';
    requestAnimationFrame(() => {
      render(); scrollToContent();
      app.style.opacity = '';
      app.style.transition = 'opacity 150ms ease-out';
      setTimeout(() => { app.style.transition = ''; }, 200);
    });
  }
}
```

CSS for View Transitions:
```css
::view-transition-old(root) { animation: 120ms ease-out both vt-fade-out; }
::view-transition-new(root) { animation: 200ms ease-out both vt-fade-in; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

**Commit:** `feat: View Transitions for tab switching with cross-fade fallback`

---

### Task 27: Magic Plus FAB

**Files:** Create `src/ui/magic-fab.js`. Modify `src/bridge.js`, `src/ui/render.js`, `src/styles/main.css`, `src/state.js`.

Floating action button on mobile (tasks/home tabs). Single tap → new task modal with haptic. Uses existing `openNewTaskModal()` from bridge.

Add state: `showMagicFabMenu: false` in `state.js`, proxy in `bridge.js`.

CSS: positioned above bottom nav (`bottom: calc(88px + env(safe-area-inset-bottom) + 8px)`), 56px round, accent background, shadow. Mobile only (`display: none` above 768px).

**Commit:** `feat: Magic Plus floating action button`

---

### Task 28: Accessibility for Gestures

**Files:** Modify `src/ui/tasks-tab.js`

Add VoiceOver alternatives for swipe/drag gestures:
- `aria-label` on swipe-row buttons with action descriptions
- `role="option"` on draggable items with `aria-grabbed` state
- VoiceOver rotor actions for complete/flag/delete (accessible via long-press menu that already exists in action-sheet.js)

**Commit:** `a11y: VoiceOver alternatives for swipe and drag gestures`

---

### Task 29: Validate Phase 2

**Checklist:**
- [ ] Task completion shows clone animation → spring shrink+fade → re-render
- [ ] Swipe snap uses spring physics (visible overshoot settle)
- [ ] Tab switch: View Transition (Safari 18+) or cross-fade (Safari 17)
- [ ] Magic FAB appears on mobile tasks/home tabs
- [ ] Native haptics fire in iOS simulator
- [ ] No stale clones in `#animation-overlay` after 3 seconds
- [ ] Gesture angle threshold allows diagonal scroll without capture
- [ ] `touch-action: pan-y` prevents scroll jank
- [ ] All existing gestures still work (swipe-reveal, drag-reorder, pull-refresh)
- [ ] `npm run build && npm run preview` works for web
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] VoiceOver can access swipe actions via rotor

**Performance budget (Phase 2):**
- Task completion animation: 60fps on iPhone 12+
- Haptic latency: < 5ms (native) or < 20ms (vibrate fallback)
- No listener leaks across render cycles

**Rollback:** `git checkout v4.60.0-phase1` restores Phase 1 state cleanly.

---

### Task 30: Version Bump + Phase 2 Tag

```bash
npm run bump minor   # → 4.61.0
git tag v4.61.0-phase2
git push && git push --tags
npm run deploy
```

**Commit:** `feat: animation + gesture enhancements (v4.61.0)`

---

## Phase 3: Geist Polish + Native Status Bar (6 tasks)

> Dark mode, typography tokens, spacing tokens, and shape tokens already exist. This phase focuses on native status bar sync, auto color mode, and polish.

### Task 31: Status Bar Sync with Theme Changes

**Files:** Modify `src/data/github-sync.js`

In `setColorMode()` and `setTheme()`, call native status bar update:
```javascript
if (typeof window.setStatusBarStyle === 'function') {
  window.setStatusBarStyle(mode === 'dark');
}
```

Also update `<meta name="theme-color">` dynamically:
```javascript
function syncThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    meta.content = bg;
  }
}
```

**Commit:** `feat: sync native status bar + meta theme-color with theme changes`

---

### Task 32: Auto Color Mode (prefers-color-scheme)

**Files:** Modify `src/data/github-sync.js`, `src/ui/settings.js`, `src/constants.js`

Add third color mode option: `'auto'` (follows system). In Settings, change segmented control to Light | Auto | Dark.

```javascript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
  if (getColorMode() === 'auto') {
    applyColorMode(e.matches ? 'dark' : 'light');
  }
});
```

Store `'auto'` in localStorage. `applyColorMode()` resolves effective mode from system preference.

**Commit:** `feat: auto color mode following system preference`

---

### Task 33: Performance Budget Validation (Phases 1-2)

Run on iOS Simulator (iPhone 15 Pro):
- [ ] Cold launch to interactive: < 2.5s
- [ ] Memory at idle: < 80MB
- [ ] Task completion animation: 60fps (check via Safari Web Inspector Timeline)
- [ ] Tab switch animation: < 200ms
- [ ] Swipe gesture response: < 16ms per frame
- [ ] No JS memory leaks across 20 render cycles

Document results in `docs/development.md`.

**Commit:** `docs: Phase 1-2 performance baseline`

---

### Task 34: Accessibility Audit

- [ ] Dynamic Type: all font sizes >= 16px on mobile (prevent iOS auto-zoom)
- [ ] VoiceOver: all interactive elements have labels
- [ ] Color contrast: WCAG AA for all themes × modes (6 combos)
- [ ] Reduced motion: all animations respect `prefers-reduced-motion`
- [ ] Keyboard: all actions reachable via keyboard on desktop

Fix any issues found.

**Commit:** `a11y: accessibility audit fixes for Phase 3`

---

### Task 35: Validate Phase 3

**Checklist:**
- [ ] Status bar text adapts to light/dark mode on iOS
- [ ] Meta theme-color updates on theme change
- [ ] Auto color mode follows system setting
- [ ] Light | Auto | Dark segmented control works in Settings
- [ ] All 6 theme×mode combos render correctly
- [ ] Performance budgets met

**Rollback:** `git checkout v4.61.0-phase2`

---

### Task 36: Version Bump + Phase 3 Tag

```bash
npm run bump minor   # → 4.62.0
git tag v4.62.0-phase3
git push && git push --tags
npm run deploy
```

**Commit:** `feat: Geist polish + native status bar (v4.62.0)`

---

## Phase 4: Native Integrations + App Store (13 tasks)

### Task 37: Face ID / Touch ID

**Files:** Create `src/native/biometric.js`. Modify `src/state.js`, `src/ui/render.js`, `src/main.js`, `src/ui/settings.js`.

C3 fix: Use `@capgo/capacitor-native-biometric@^8`:
```bash
npm install @capgo/capacitor-native-biometric@^8
npx cap sync ios
```

Biometric errors propagate to callers (NOT silent catch) for UI handling. Lock screen gate: if `state.biometricLocked`, render lock overlay instead of app.

Settings toggle to enable/disable biometric lock. On resume from background, check biometric if enabled.

**Commit:** `feat: Face ID / Touch ID biometric lock`

---

### Task 38: Push Notifications (APNs)

**Files:** Create `src/native/push-notifications.js`. Modify `ios/App/App/AppDelegate.swift`.

```bash
npm install @capacitor/push-notifications@^8
npx cap sync ios
```

Request permission after login. Register APNs token. Store token in localStorage for future server-side use.

**Commit:** `feat: push notification capability (APNs registration)`

---

### Task 39: Local Notifications for Task Reminders

**Files:** Create `src/native/local-notifications.js`. Modify `src/features/tasks.js`.

```bash
npm install @capacitor/local-notifications@^8
npx cap sync ios
```

Schedule notification at 9:00 AM on task due date. Cancel on complete/delete. Clear on task modal save if date changes.

**Commit:** `feat: local notifications for task due date reminders`

---

### Task 40: Offline Indicator

**Files:** Modify `src/ui/render.js`, `src/state.js`

Show "Offline" chip in header when `!navigator.onLine`. Already handles online/offline events in main.js — just need the visual indicator.

**Commit:** `feat: offline indicator badge in header`

---

### Task 41: Account Deletion (App Store Required)

**Files:** Modify `src/ui/settings.js`, `src/data/firebase.js`

Required by App Store Guideline 5.1.1(v). "Delete Account" button in Settings → confirmation dialog → calls `auth.currentUser.delete()`, clears all localStorage, signs out.

**Commit:** `feat: account deletion (App Store requirement 5.1.1v)`

---

### Task 42: Widget Data Bridge (Custom Capacitor Plugin)

**Files:** Create `ios/App/App/WidgetBridgePlugin.swift`, `src/native/widget-bridge.js`. Modify `src/data/storage.js`.

Custom Capacitor plugin that writes today's tasks, daily score, and streak to App Group `UserDefaults` on every save. WidgetKit reads this shared data.

**Commit:** `feat: widget data bridge via App Group UserDefaults`

---

### Task 43: WidgetKit Extension (Swift)

**Files:** Create `ios/HomebaseWidget/`

Small widget: daily score + streak count.
Medium widget: today's top 4 tasks + score.

**Commit:** `feat: WidgetKit extension (small + medium widgets)`

---

### Task 44: Siri Shortcuts

**Files:** Create `ios/HomebaseSiriIntents/`, `src/native/siri-shortcuts.js`

Two intents: "Add task to Homebase" and "Show today's agenda". Deep link handling routes to appropriate tab/modal.

**Commit:** `feat: Siri Shortcuts (add task, show agenda)`

---

### Task 45: Share Extension

**Files:** Create `ios/HomebaseShareExtension/`, `src/native/share-extension.js`

Accept text/URL from other apps → create inbox task via App Group shared storage.

**Commit:** `feat: Share Extension for creating tasks from other apps`

---

### Task 46: App Store Preparation

**Files:** Create `public/privacy.html`, `public/support.html`. Finalize `ios/App/App/Info.plist`.

- Privacy policy page (required by App Store)
- Support page with contact info
- App Review Notes enumerating all native features (justify it's not a "wrapper app")
- Demo credentials for reviewer
- L6 fix: Final audit of PrivacyInfo.xcprivacy for all API categories

**Commit:** `docs: App Store preparation (privacy policy, support, review notes)`

---

### Task 47: Deep Linking Beyond OAuth

**Files:** Modify `src/main.js`

Handle deep links from: widget taps, notification taps, Siri shortcut results, share extension completions. Route `homebase://task/{id}` to task modal, `homebase://tab/{name}` to tab.

**Commit:** `feat: comprehensive deep link routing`

---

### Task 48: Final Validation + Submission (v5.0.0)

**Performance targets:**
- 60fps task completion animation on iPhone 12+
- < 5ms native haptic latency
- < 1.5s cold launch to interactive
- < 150MB peak memory

**Accessibility:**
- VoiceOver labels on all interactive elements
- Dynamic Type (>= 16px fonts)
- `prefers-reduced-motion` compliance
- WCAG AA color contrast

**App Store Checklist:**
- [ ] Xcode 16+ targeting iOS 18 SDK, minimum deployment iOS 15.0
- [ ] PrivacyInfo.xcprivacy complete (all API categories declared)
- [ ] Account deletion works end-to-end
- [ ] All native features documented in review notes
- [ ] Demo credentials ready
- [ ] Screenshots: 6.7" (iPhone 15 Pro Max), 6.1" (iPhone 15), 12.9" iPad
- [ ] Privacy Policy URL live at `/privacy.html`
- [ ] Support URL live at `/support.html`

```bash
npm run bump major   # → 5.0.0
git tag v5.0.0
git push && git push --tags
```

Archive in Xcode → Submit to App Store Connect.

**Commit:** `feat: Homebase iOS native app v5.0.0`

---

### Task 49: Push Plan to Repo

```bash
cp /root/.claude/plans/staged-noodling-tarjan.md docs/plans/thingsxgeist3.md
git add docs/plans/thingsxgeist3.md
git commit -m "docs: add ThingsXGeist v3 implementation plan"
git push
```

---

## Haptic Feedback Map

| Interaction | Call | iOS Generator | Timing |
|---|---|---|---|
| Task completion | `hapticSync('success')` | UINotification(.success) | Animation start |
| Task deletion | `hapticSync('error')` | UINotification(.error) | Animation start |
| Swipe threshold (72pt) | `hapticSync('medium')` | UIImpact(.medium) | At threshold |
| Drag pickup (500ms hold) | `hapticSync('medium')` | UIImpact(.medium) | At hold recognition |
| Drag boundary crossing | `hapticSync('selection')` | UISelection | Each slot cross |
| Drag drop | `hapticSync('light')` | UIImpact(.light) | On release |
| Magic FAB tap | `hapticSync('medium')` | UIImpact(.medium) | On tap |
| Tab switch | `hapticSync('light')` | UIImpact(.light) | On tap |
| Pull-to-refresh threshold | `hapticSync('medium')` | UIImpact(.medium) | At 60px |
| Pull-to-refresh success | `hapticSync('success')` | UINotification(.success) | On sync complete |
| Pull-to-refresh error | `hapticSync('error')` | UINotification(.error) | On sync fail |

---

## Existing Utilities to Reuse

| Utility | Location | Usage |
|---|---|---|
| `haptic(type)` | `src/utils.js:205` | Upgrade in-place to prefer `hapticSync` |
| Motion tokens | `src/styles/themes.css:231-240` | `--ease-spring`, `--duration-fast`, etc. |
| `registerCleanup(fn)` | `src/bridge.js:283` | Event listener cleanup across renders |
| `saveViewState()` | `src/ui/render.js` | Tab state persistence |
| `isTouchDevice()` | `src/utils.js:196` | Feature detection |
| `isMobileViewport()` | `src/utils.js:192` | Responsive checks |
| `syncThemeColorMeta()` | `src/data/github-sync.js:138` | Extend for status bar |
| `getColorMode()` / `setColorMode()` | `src/data/github-sync.js:113-133` | Color mode management |
| `initSwipeActions()` | `src/features/swipe-actions.js` | Enhance, don't replace |
| `initTouchDrag()` | `src/features/touch-drag.js` | Enhance, don't replace |
| `initPullToRefresh()` | `src/features/pull-to-refresh.js` | Enhance haptics only |
| `openNewTaskModal()` | `src/bridge.js` | Used by Magic FAB |

---

## Verification After Each Phase

1. `npm run build` — web build succeeds
2. `npm run preview` — app works at `/lifeg/`
3. `npm run cap:sync` — Capacitor sync succeeds
4. Xcode Cmd+B — 0 errors
5. Xcode Cmd+R — app loads in simulator
6. `npm run deploy` — GitHub Pages works
7. Manual interaction testing on simulator
8. Performance metrics within budget

---

## Rollback Procedures

| Phase | Tag | Rollback Command |
|---|---|---|
| Phase 1 | `v4.60.0-phase1` | `git checkout v4.60.0-phase1` |
| Phase 2 | `v4.61.0-phase2` | `git checkout v4.61.0-phase2` |
| Phase 3 | `v4.62.0-phase3` | `git checkout v4.62.0-phase3` |
| Phase 4 | `v5.0.0` | `git checkout v4.62.0-phase3` (pre-Phase 4) |

For Xcode project rollback: the entire `ios/` directory is committed. `git checkout` restores it fully. SPM resolves dependencies on next Xcode build.
