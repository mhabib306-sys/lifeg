# Data Model

## Task Object
```
{
  id: string,
  title: string,
  notes: string,
  status: 'inbox' | 'today' | 'anytime' | 'someday',
  completed: boolean,
  completedAt: string | null,
  categoryId: string | null,
  labels: string[],
  people: string[],
  deferDate: 'YYYY-MM-DD' | null,
  dueDate: 'YYYY-MM-DD' | null,
  repeat: { type, interval, from } | null,
  isNote: boolean,
  parentId: string | null,
  indent: number,
  order: number,
  createdAt: ISO string,
  updatedAt: ISO string
}
```

## Daily Tracking Data
`state.allData` stores entries keyed by date `YYYY-MM-DD`:
```
{
  "2026-02-08": {
    prayers: {...},
    glucose: {...},
    whoop: {...},
    habits: {...},
    ...
  }
}
```

## LocalStorage Keys
- `lifeGamificationData_v3` — Daily tracking data
- `lifeGamificationTasks` — Tasks array
- `lifeGamificationTaskCategories` — Categories
- `lifeGamificationTaskLabels` — Labels
- `lifeGamificationTaskPeople` — People
- `lifeGamificationPerspectives` — Custom perspectives
- `lifeGamificationHomeWidgets` — Home widgets layout
- `lifeGamificationViewState` — Active tab and filters
- `lifeGamificationWeights_v1` — Score weights
- `lifeGamificationMaxScores` — Score max values
- `lifeGamificationGithubToken` — GitHub PAT
- `lifeGamificationTheme` — Theme name
- `lastUpdated` — Last local update timestamp
