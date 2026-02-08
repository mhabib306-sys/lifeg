# Architecture

Homebase is a modular Vite app with a single render loop. The UI is rendered
via full DOM replacement from `render()`, and all side-effectful behavior is
performed via state updates followed by `render()`.

## High-Level Flow
1. Load state from localStorage.
2. Migrate legacy task data (today flag).
2. Apply theme and initialize task ordering.
3. Render the UI.
4. Load cloud data asynchronously and re-render on completion.

## Key Modules
- `src/main.js` — Entry point; initializes theme, order, render, and sync.
- `src/state.js` — Single source of truth for runtime state.
- `src/constants.js` — Constants, defaults, and icons.
- `src/bridge.js` — Exposes functions to `window.*` for inline handlers.
- `src/ui/*` — Pure rendering functions (string templates).
- `src/features/*` — Task logic, notes, drag-drop, widgets, etc.
- `src/data/*` — Persistence and GitHub sync.

## Render Model
`render()` regenerates the full UI string and replaces `#app`.
All event handlers used in HTML strings must be attached via `window.*`
and kept side-effect-safe.

## Module Boundaries
Import direction is one-way to prevent cycles:
```
state.js, constants.js          ← no src/ imports
utils.js                        ← constants
data/*                          ← state, constants, utils
features/*                      ← state, utils, data/*
ui/*                            ← state, features/*, constants, utils
bridge.js                       ← imports ALL, assigns to window
main.js                         ← imports bridge, data loaders, render
```
