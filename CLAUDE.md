# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nucleus** (v3.3.0) — A single-file life gamification & task management web app. Combines Things 3/OmniFocus-style task management with daily habit tracking, health metrics, and gamification scoring.

## Git Workflow

This is a git repo with a GitHub remote. **Every change must be committed and pushed.** After completing any modification, commit with a descriptive message and `git push`. If the remote is ahead, `git pull --rebase` first.

## Versioning

**Always bump the version after making changes.** Update all 3 locations:
1. `@version` in the JSDoc comment (~line 1933)
2. `APP_VERSION` constant (~line 1945)
3. Version in this file's Project Overview section

Use semantic versioning (MAJOR.MINOR.PATCH):
- **PATCH** (e.g. 3.3.0 → 3.3.1): Bug fixes, small tweaks
- **MINOR** (e.g. 3.3.0 → 3.4.0): New features, enhancements, UI overhauls
- **MAJOR** (e.g. 3.3.0 → 4.0.0): Breaking changes, major new systems

Mention the new version number when reporting completed work.

## Architecture

- **Single file**: Everything lives in `index.html` (~8900 lines) — CSS, HTML, and vanilla JavaScript
- **No build process**: Open `index.html` directly in a browser. No npm, no bundler, no framework.
- **Rendering model**: Full DOM replacement via `render()`. State changes → call `render()` → entire app div re-rendered. No virtual DOM, no diffing.
- **Persistence**: localStorage for local data, GitHub API (`mhabib306-sys/lifeg` repo, `data.json`) for cloud sync
- **External deps** (CDN): Tailwind CSS v3, Chart.js 3.9.1, Open-Meteo weather API

## File Sections (approximate line ranges)

| Section | Lines | Description |
|---------|-------|-------------|
| CSS & Themes | 1–1600 | Theme variables (`:root`, `[data-theme]`), component styles, inline autocomplete & calendar CSS |
| Config & Constants | 1887–1979 | `THINGS3_ICONS`, `BUILTIN_PERSPECTIVES`, localStorage keys |
| Weather System | 1980–2119 | Open-Meteo API integration with caching |
| GitHub Sync | 2126–2291 | `saveToGithub()`, `loadCloudData()`, debounced auto-save |
| Scoring Weights | 2408–2606 | `WEIGHTS`, `MAX_SCORES`, weight/maxScore CRUD |
| Task Data Init | 2620–2751 | `tasksData`, `taskCategories`, `taskLabels`, `taskPeople`, `customPerspectives` |
| Mobile UI | 2779–3020 | Mobile drawer, bottom nav, navigation helpers |
| Home Widgets | 3034–3450 | Dashboard quick stats, quick-add, today/next widgets |
| Task CRUD | 3537–4600 | `createTask`, `updateTask`, `deleteTask`, notes outliner, repeating tasks |
| Task Filtering | 4663–4910 | `getFilteredTasks`, perspective filters, calendar view functions |
| Scoring Engine | 5000–5400 | Score calculation with caching, personal bests |
| renderHomeTab | 5657–5776 | Home page layout |
| renderTrackingTab | 5776–6240 | Daily/bulk entry forms, dashboard charts |
| render() | 6243–6411 | Main render function, tab routing, bottom nav |
| renderSettingsTab | 6674–6974 | Theme, GitHub, weights, export/import |
| renderTasksTab | 6974–7600 | Task list, sidebar, perspective views |
| Task Modal | 7600–8700 | Modal for task create/edit, inline autocomplete setup |
| Export/Import | 8793–8860 | JSON data backup/restore |
| Init & Events | 8865–8915 | Keyboard shortcuts, app bootstrap |

## Key State Variables

- `allData` — Daily tracking entries keyed by `YYYY-MM-DD`
- `tasksData` — Array of task objects (id, title, status, categoryId, labelIds, dueDate, deferDate, notes, subtasks, completed, order, etc.)
- `taskCategories` / `taskLabels` / `taskPeople` — Entity arrays for areas, tags, people
- `activeTab` — Current tab: `'home'` | `'tasks'` | `'life'` | `'settings'`
- `activeFilterType` / `activePerspective` — Task view filtering state
- `currentDate` — Selected date for tracking (YYYY-MM-DD)

## Theme System

CSS custom properties in `:root` / `[data-theme="things3"]` / `[data-theme="simplebits"]`. Tailwind config maps semantic names (`coral` → `var(--accent)`, `charcoal` → `var(--text-primary)`). Default theme: `things3`.

## localStorage Keys

All prefixed with `lifeGamification`: `Data_v3`, `Weights_v1`, `Tasks`, `TaskCategories`, `TaskLabels`, `TaskPeople`, `Perspectives`, `HomeWidgets`, `Theme`, `GithubToken`, `ViewState`. Also `nucleusWeatherCache`, `nucleusWeatherLocation`.

## Important Patterns

- **After any state mutation**, call `saveTasksData()` (or the relevant save function) then `render()`
- **Scores cache**: Call `invalidateScoresCache()` when changing weights, max scores, or tracking data
- **Inline autocomplete**: `setupInlineAutocomplete(inputId, config)` attaches to inputs. Uses `capture: true` event listeners with `stopImmediatePropagation()` to fire before `onkeydown` attribute handlers.
- **Modal cleanup**: Always use `closeTaskModal()` — never manually set `showTaskModal = false` without cleaning up autocomplete state
- **Task IDs**: Generated via `generateTaskId()` using timestamp + random string
- **Entity IDs**: Categories/labels/people use `cat_`, `label_`, `person_` prefixes + timestamp

## Common Pitfalls

- The `render()` function replaces the entire DOM, so any `addEventListener` calls must be re-attached in post-render `setTimeout` blocks
- `calendarMonth` is 0-indexed (JS Date style) but date strings use 1-indexed months
- `inlineAutocompleteMeta` Map stores per-input metadata — must be cleaned up when inputs are removed
- GitHub sync saves to `data.json` in the repo — the `index.html` itself is committed/pushed manually via git
