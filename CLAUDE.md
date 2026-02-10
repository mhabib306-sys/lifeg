# CLAUDE.md

This file provides guidance to AI coding agents (Claude Code, Codex, etc.) when working with code in this repository. Read this file in full before making any changes.

## Project Overview

**Homebase** (v4.15.0 - Homebase) — A modular life gamification & task management web app. Combines Things 3/OmniFocus-style task management with daily habit tracking, health metrics, and gamification scoring. Built with Vite + Tailwind CSS v4 + vanilla JavaScript ES modules.

## Git Workflow

This is a git repo with a GitHub remote. **Every change must be committed and pushed.** After completing any modification, commit with a descriptive message and `git push`. If the remote is ahead, `git pull --rebase` first.

## Versioning

**Always bump the version after making changes.** Update these locations:
1. `APP_VERSION` constant in `src/constants.js`
2. Version in `package.json`
3. Version in this file's Project Overview section
4. Update docs in `docs/` if behavior or structure changed

Use semantic versioning (MAJOR.MINOR.PATCH):
- **PATCH** (e.g. 4.0.0 → 4.0.1): Bug fixes, small tweaks
- **MINOR** (e.g. 4.0.0 → 4.1.0): New features, enhancements, UI overhauls
- **MAJOR** (e.g. 4.0.0 → 5.0.0): Breaking changes, major new systems

Mention the new version number when reporting completed work.

## Architecture

- **Vite build system**: ES module bundler with HMR. Run `npm run dev` for development, `npm run build` for production.
- **Modular structure**: ~30 source files in `src/` organized by domain (data, features, ui, styles)
- **Rendering model**: Full DOM replacement via `render()`. State changes → call `render()` → entire app div re-rendered. No virtual DOM, no diffing.
- **State management**: Single `state` object in `src/state.js` — all mutable globals collected here
- **Window bridge**: `src/bridge.js` imports all functions and assigns to `window.*` for onclick handlers in HTML strings
- **Persistence**: localStorage for local data, GitHub API (`mhabib306-sys/lifeg` repo, `data.json`) for cloud sync
- **PWA**: vite-plugin-pwa with workbox service worker, installable, offline-capable
- **External deps**: Tailwind CSS v4 (PostCSS), Chart.js 4.x (npm), Inter font (Google Fonts CDN), Open-Meteo weather API

## Development Commands

```bash
npm run dev      # Start Vite dev server (HMR, http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run deploy   # Build + force-push dist/ to gh-pages branch (GitHub Pages)
```

**Deployment target (always):**
- Live URL: `https://mhabib306-sys.github.io/lifeg/`
- Deployment branch: `gh-pages`
- Deploy command: `npm run deploy`

**Always run `npm run build` after changes to verify the build succeeds.** After committing and pushing to main, **always run `npm run deploy`** to deploy to GitHub Pages. Every change must go live.

## Module Structure

```
lifeg/
├── index.html                  (slim shell: head + <div id="app"> + <script type="module">)
├── src/
│   ├── main.js                 (entry: imports CSS, bridge, init, bootstrap)
│   ├── bridge.js               (window.* exports for onclick handlers + state proxies)
│   ├── state.js                (single exported state object, ~67 properties)
│   ├── constants.js            (APP_VERSION, storage keys, icons, defaults, JANUARY_DATA)
│   ├── utils.js                (escapeHtml, fmt, getLocalDateString, formatSmartDate, generateTaskId)
│   ├── data/
│   │   ├── storage.js          (localStorage helpers, saveTasksData, saveData)
│   │   ├── github-sync.js      (saveToGithub, loadCloudData, theme management)
│   │   ├── whoop-sync.js       (WHOOP API auto-sync via Cloudflare Worker proxy)
│   │   ├── google-calendar-sync.js (Two-way Google Calendar sync via REST API)
│   │   └── export-import.js    (exportData, importData)
│   ├── features/
│   │   ├── weather.js          (Open-Meteo API, caching, geolocation)
│   │   ├── scoring.js          (calculateScores, parsePrayer, cache, weight/maxScore CRUD)
│   │   ├── tasks.js            (createTask, updateTask, deleteTask, toggleComplete, repeat)
│   │   ├── task-filter.js      (getFilteredTasks, groupByDate, ordering)
│   │   ├── categories.js       (category/label/person CRUD + getXById)
│   │   ├── notes.js            (outliner: indent/outdent, create/delete, renderNotesOutliner)
│   │   ├── drag-drop.js        (task + sidebar + widget drag handlers)
│   │   ├── perspectives.js     (custom perspective CRUD)
│   │   ├── home-widgets.js     (widget visibility/ordering)
│   │   └── calendar.js         (month nav, date selection, getTasksForDate)
│   ├── ui/
│   │   ├── render.js           (main render(), switchTab, tab routing)
│   │   ├── home.js             (renderHomeTab, widget rendering, homeQuickAddTask)
│   │   ├── tasks-tab.js        (renderTasksTab, renderTaskItem, sidebar, area view)
│   │   ├── tracking.js         (renderTrackingTab, daily entry form)
│   │   ├── bulk-entry.js       (renderBulkEntryTab)
│   │   ├── dashboard.js        (renderDashboardTab, Chart.js charts)
│   │   ├── calendar-view.js    (renderCalendarView)
│   │   ├── settings.js         (renderSettingsTab)
│   │   ├── task-modal.js       (task modal + entity modals, save/close, inline + modal autocomplete)
│   │   ├── mobile.js           (drawer, bottom nav, navigation helpers)
│   │   └── input-builders.js   (createPrayerInput, createToggle, etc.)
│   └── styles/
│       ├── main.css            (@import 'tailwindcss' + all component styles)
│       └── themes.css          (:root, [data-theme] variable blocks)
├── public/
│   └── icons/                  (PWA icons: SVG, maskable variants)
├── vite.config.js
├── postcss.config.js
├── package.json
└── CLAUDE.md
```

## Documentation
- `docs/architecture.md`
- `docs/data-model.md`
- `docs/task-logic.md`
- `docs/sync.md`
- `docs/ui.md`
- `docs/development.md`
- `docs/pm-reliability-playbook.md`
- `docs/mcp.md`

## Import Direction (one-way, no circular deps)

```
state.js, constants.js          ← no src/ imports
utils.js                        ← constants
data/*                          ← state, constants, utils
features/*                      ← state, utils, data/*
ui/*                            ← state, features/*, constants, utils
bridge.js                       ← imports ALL, assigns to window
main.js                         ← imports bridge, data loaders, render
```

onclick handlers go through `window.functionName()` (via bridge), not direct imports — this breaks potential circular chains.

## Key State Variables

- `state.allData` — Daily tracking entries keyed by `YYYY-MM-DD`
- `state.tasksData` — Array of task objects
- `state.taskCategories` / `state.taskLabels` / `state.taskPeople` — Entity arrays
- `state.activeTab` — Current tab: `'home'` | `'tasks'` | `'life'` | `'calendar'` | `'settings'`
- `state.activeFilterType` / `state.activePerspective` — Task view filtering state
- `state.currentDate` — Selected date for tracking (YYYY-MM-DD)

## Theme System

CSS custom properties in `src/styles/themes.css` — `:root` (simplebits) and `[data-theme="things3"]`. Tailwind v4 `@theme` block in `main.css` maps semantic names (`coral` → `var(--accent)`, `charcoal` → `var(--text-primary)`). Default theme: `things3`.

## localStorage Keys

All prefixed with `lifeGamification`: `Data_v3`, `Weights_v1`, `Tasks`, `TaskCategories`, `TaskLabels`, `TaskPeople`, `Perspectives`, `HomeWidgets`, `Theme`, `GithubToken`, `ViewState`. Also `nucleusWeatherCache`, `nucleusWeatherLocation`, `collapsedNotes`, `nucleusWhoopWorkerUrl`, `nucleusWhoopApiKey`, `nucleusWhoopLastSync`, `nucleusWhoopConnected`, `nucleusGCalAccessToken`, `nucleusGCalTokenTimestamp`, `nucleusGCalSelectedCalendars`, `nucleusGCalTargetCalendar`, `nucleusGCalEventsCache`, `nucleusGCalLastSync`, `nucleusGCalConnected`, `nucleusMeetingNotes`.

## Important Patterns

- **After any state mutation**, call `saveTasksData()` (or the relevant save function) then `window.render()`
- **Cross-device by default for new features**: any new user-generated entity must be persisted locally and included in GitHub cloud sync (`saveToGithub` payload + `loadCloudData` restore/merge). Do not ship local-only data unless explicitly requested.
- **Scores cache**: Call `invalidateScoresCache()` when changing weights, max scores, or tracking data
- **Window bridge**: All functions called from onclick handlers must be on `window.*` via `bridge.js`. Use `window.render()` and `window.debouncedSaveToGithub()` to avoid circular imports.
- **State proxies**: `bridge.js` creates `Object.defineProperty` proxies on `window` for state properties, so `onclick="editingTaskId='abc'; render()"` works
- **Modal cleanup**: Always use `closeTaskModal()` — never manually set `showTaskModal = false` without cleaning up autocomplete state
- **Task IDs**: Generated via `generateTaskId()` using timestamp + random string
- **Entity IDs**: Categories/labels/people use `cat_`, `label_`, `person_` prefixes + timestamp

## PM Reliability Defaults (Mandatory For New Features)

When shipping any feature that mutates data, crosses views, or syncs to cloud, treat these as required:

1. **Source-of-truth declaration**
- Define exactly which entity owns each field.
- Use shared domain actions across entry points (no duplicate business logic per view).

2. **Persistence contract**
- Local write path (state + localStorage) must be explicit.
- Cloud payload inclusion and cloud load merge behavior must be explicit.

3. **Conflict policy**
- Choose one: newest-wins, local-wins, gap-fill, or manual resolution.
- Document the policy in `docs/sync.md` and `docs/data-model.md`.

4. **Failure/expiry states**
- Define UX for loading, syncing, success, error, offline, and expired sessions.
- Ensure failed cloud writes never revert successful local user actions.

5. **QA + release gates**
- Add/execute smoke checks in `docs/development.md`.
- For sync behavior changes, update `docs/pm-reliability-playbook.md` acceptance criteria mapping.

6. **Observability**
- Add logs/telemetry for save attempt/success/failure and merge decision paths for high-risk entities.

If any item above is skipped, call it out explicitly in PR/hand-off notes with rationale and risk.

## Adding New Functions (Checklist)

When adding a new function that will be called from `onclick` handlers in HTML strings:

1. Define and `export` the function in the appropriate `src/` module
2. Import it in `src/bridge.js` and add it to the `Object.assign(window, {...})` block
3. If the function returns HTML that should appear on every tab (e.g., a modal overlay), also add a wrapper function in `src/ui/render.js` and call it in the `app.innerHTML` template
4. If it needs a state flag (e.g., `showMyModal`), add the property to `src/state.js` and to the `stateProxies` array in `src/bridge.js`

## Files to NOT Modify

- `dist/` — auto-generated by `npm run build`/`npm run deploy`. Never edit or commit directly.
- `node_modules/` — managed by npm. Never edit or commit.
- `index-monolith.html` — archived pre-modularization version. Preserved as historical reference only.

## Task Logic (Things 3 / OmniFocus Hybrid)

- Today is **non-exclusive**: Today tasks also appear in Anytime.
- Flagged is a **separate** boolean (OmniFocus-style).
- Defer date controls availability; due date is a deadline signal.
- Anytime excludes tasks with future due dates or deferred to the future.

## Common Pitfalls

- The `render()` function replaces the entire DOM, so any `addEventListener` calls must be re-attached in post-render `setTimeout` blocks
- `calendarMonth` is 0-indexed (JS Date style) but date strings use 1-indexed months
- `inlineAutocompleteMeta` Map stores per-input metadata — must be cleaned up when inputs are removed
- GitHub sync saves to `data.json` in the repo — the source code is committed/pushed manually via git
- When adding new functions that need to be called from onclick handlers, add them to `bridge.js` (see checklist above)
- Modal renderers (`renderTaskModalHtml`, `renderPerspectiveModalHtml`, etc.) live in `task-modal.js` but are called from `render.js` via window bridge wrappers — both files must be updated when adding new modals
