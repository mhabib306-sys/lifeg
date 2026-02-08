# Sync & Conflict Resolution

## Local Persistence
Daily data (`state.allData`) is saved to localStorage under `lifeGamificationData_v3`.
`lastUpdated` stores the most recent local write timestamp.

## GitHub Sync
When a GitHub token is set, the app syncs to `data.json` in the repository.
The payload includes:
- `data`, `weights`, `maxScores`, `tasks`, `taskCategories`, `taskLabels`,
  `taskPeople`, `customPerspectives`, `homeWidgets`, `lastUpdated`

## Conflict Resolution (Life Data)
On load:
1. If `cloud.lastUpdated` is newer than local `lastUpdated`, **cloud wins**
   and replaces local `data`.
2. Otherwise, local is retained and missing dates from cloud are merged in.

This prevents stale mobile data from overwriting recent desktop entries.
