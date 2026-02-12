# Data Model

## Ownership Matrix
- Task execution state (`completed`, `completedAt`, `status`, `today`, `categoryId`, `labels`, `people`, dates, `meetingEventKey`): `tasks[]` entity by `id`
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
  meetingEventKey: string | null,
  order: number,
  createdAt: ISO string,
  updatedAt: ISO string
}
```

## Meeting Notes Object
```
{
  eventKey: string,          // "<calendarId>::instance::<eventId>" | "<calendarId>::series::<recurringEventId>"
  calendarId: string,
  eventId: string,
  title: string,
  content: string,
  createdAt: ISO string,
  updatedAt: ISO string
}
```

## Person Object
```
{
  id: string,
  name: string,
  email: string,             // optional; empty string when not set
  color?: string
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
- `nucleusGithubSyncDirty` — Dirty flag for offline sync recovery
- `nucleusSyncHealth` — Sync health metrics (success/failure counts, latency)
- `nucleusSyncSequence` — Monotonic sequence counter for clock-skew immunity

## Encrypted Credentials (`encryptedCredentials`)

Optional field in `data.json` payload. Contains AES-GCM encrypted integration credentials, envelope-wrapped with a PBKDF2-derived key from the Firebase UID.

```
{
  version: 1,
  salt: base64,           // 16-byte PBKDF2 salt
  wrapIv: base64,         // 12-byte IV for key wrapping
  wrappedKey: base64,     // AES-GCM encrypted data key
  dataIv: base64,         // 12-byte IV for data encryption
  data: base64,           // AES-GCM encrypted credential JSON
  updatedAt: ISO string
}
```

Decrypted payload structure:
```
{
  anthropicKey?: string,
  whoopWorkerUrl?: string,
  whoopApiKey?: string,
  libreWorkerUrl?: string,
  libreApiKey?: string
}
```

See `docs/sync.md` § "Credential Sync (Encrypted)" for conflict policy and failure states.

## Payload Envelope Fields (`data.json`)
```
{
  _schemaVersion: number,    // Current: 1. Reject merge if cloud > local.
  _sequence: number,         // Monotonic counter. Tiebreaker for shouldUseCloud().
  _checksum: string,         // SHA-256 hex of payload (excluding this field).
  lastUpdated: ISO string,   // Timestamp of the save.
  ...                        // All data fields (tasks, data, weights, etc.)
}
```

## Data Integrity Requirements
- `tasks[].id` is globally unique (crypto-quality randomness via `crypto.getRandomValues`).
- `tasks[].updatedAt` must be refreshed on every mutation.
- Completed tasks set `completedAt`; incomplete tasks clear `completedAt`.
- Collection IDs (`cat_*`, `label_*`, `person_*`, etc.) are immutable after creation.
- `meetingNotesByEvent[eventKey]` keys are deterministic and stable.
- Cloud payload checksum must verify before merge; mismatches are rejected.
