# Data Model

## Ownership Matrix
- Task execution state (`completed`, `completedAt`, `status`, `today`, `categoryId`, `labels`, `people`, dates): `tasks[]` entity by `id`
- Daily life tracking: `allData[YYYY-MM-DD]`
- Meeting notes for calendar events: `meetingNotesByEvent[eventKey]`
- Taxonomy/config (categories, labels, people, perspectives, home widgets): collection entries by `id`

## Task Object
```
{
  id: string,
  title: string,
  notes: string,
  status: 'inbox' | 'anytime' | 'someday',
  today: boolean,
  flagged: boolean,
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

## Meeting Notes Object
```
{
  eventKey: string,          // "<calendarId>::<eventId>"
  calendarId: string,
  eventId: string,
  title: string,
  content: string,
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
- `nucleusMeetingNotes` — Meeting notes keyed by eventKey

## Data Integrity Requirements
- `tasks[].id` is globally unique.
- `tasks[].updatedAt` must be refreshed on every mutation.
- Completed tasks set `completedAt`; incomplete tasks clear `completedAt`.
- Collection IDs (`cat_*`, `label_*`, `person_*`, etc.) are immutable after creation.
- `meetingNotesByEvent[eventKey]` keys are deterministic and stable.
