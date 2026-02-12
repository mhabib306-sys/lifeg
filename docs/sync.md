# Sync & Conflict Resolution

## Source of Truth Contract

### Local-first behavior
- The UI always reads/writes from in-memory state (`state.*`) and localStorage.
- Cloud sync is eventually consistent, not blocking for UI actions.
- Every user mutation must:
1. Update `state`
2. Persist localStorage
3. Queue cloud sync via `window.debouncedSaveToGithub()`

### Cloud ownership boundaries
- `state.allData` (daily metrics): merged with date/category/field-level fill behavior.
- `tasks`, `meetingNotesByEvent`: merged by entity ID/event key with timestamp preference.
- `taskCategories`, `taskLabels`, `taskPeople`, `customPerspectives`, `homeWidgets`: merged by ID, local wins on same-ID conflicts unless explicit timestamp policy exists.

## Payload Contract (`data.json`)
- `_schemaVersion` — Integer, current version: 1. If cloud > local, merge is refused.
- `_sequence` — Monotonically increasing counter, immune to clock skew. Used as tiebreaker in `shouldUseCloud()`.
- `_checksum` — SHA-256 hex digest of the payload (without the `_checksum` field). Verified on load; mismatches reject the payload.
- `lastUpdated`
- `data`
- `weights`
- `maxScores`
- `categoryWeights`
- `tasks`
- `deletedTaskTombstones`
- `deletedEntityTombstones`
- `taskCategories`
- `categories`
- `taskLabels`
- `taskPeople`
- `customPerspectives`
- `homeWidgets`
- `meetingNotesByEvent`
- `triggers`
- `encryptedCredentials` (optional, AES-GCM encrypted)
- `xp`, `streak`, `achievements`

## Conflict Resolution Rules

### Daily data (`state.allData`)
1. If `cloud.lastUpdated` is newer than local `lastUpdated`, cloud may replace local for daily tracking payload.
2. If local is newer/equal, cloud data only fills local gaps (no local overwrite).

### Tasks
- Merge by `task.id`.
- If both local and cloud contain same task:
1. Compare `updatedAt` (fallback `createdAt`).
2. Keep newer task record.
- If one side is missing task ID, keep existing task from the other side.

### Meeting notes
- Merge by `eventKey`.
- Newer `updatedAt` (fallback `createdAt`) wins.
- Meeting workspace bullets/tasks are stored in `tasks[]` via `meetingEventKey` and follow task merge rules.
- Instance -> series promotion migrates linked tasks to the series key to prevent workspace disappearance on scope switch.

### Metadata collections (categories/labels/people/perspectives/widgets)
- Merge by `id`.
- Preserve all unique IDs.
- On same-ID conflict without reliable timestamps: local wins.

## Autosave SLO and Retry Policy
- Target: local persistence within the same event loop tick of a user action.
- Target: cloud write attempt within 2 seconds (debounced).
- On cloud write failure:
1. Keep local data authoritative.
2. Expose sync error state (`updateSyncStatus('error', ...)`).
3. Retry with exponential backoff + jitter (up to 6 retries for 409 conflicts, 4 for other errors).
4. On page close, dirty flag persists to localStorage so next session retries.

## Offline Dirty Flag
- `debouncedSaveToGithub()` sets `nucleusGithubSyncDirty` in localStorage immediately.
- Cleared only after a successful PUT to GitHub.
- On app startup: if dirty + online, triggers sync automatically.
- On `online` event: if dirty, triggers immediate sync (not just debounced).
- On `beforeunload`/`visibilitychange`: sets dirty flag as fallback for failed keepalive.

## Startup Load Retry
- `loadCloudDataWithRetry()` retries up to 3 times with exponential backoff (2s, 4s, 8s).
- Does NOT retry on 401/403 (auth errors) or when offline.
- After load, re-runs `initializeTaskOrders()` and `initializeNoteOrders()` to handle cloud-merged items.

## Periodic Background Sync
- Every 15 minutes, pulls cloud changes (read-only, no push).
- Pauses when tab is hidden, resumes when visible.
- Skips if sync is already in progress or offline.

## Rate Limit Awareness
- On 403 response, sets `syncRateLimited` flag for 60 seconds.
- While rate-limited, `debouncedSaveToGithub()` does NOT reset the backoff counter.
- Prevents retry storms during GitHub API rate limit windows.

## Session/Integration State Model

### Google Calendar
- `connected && valid token`: sync enabled.
- `connected && expired token`: attempt silent refresh.
- `refresh failed`: show reconnect prompt; keep app usable.

### UI states that must exist
- loading
- syncing
- success
- error
- expired-session
- offline-local-only

## Invariants (must always hold)
- A task with `completed=true` must not appear in active task lists (calendar/workspace/home active widgets).
- Moving a task between areas updates a single task record (no duplicates).
- Any action path (workspace, calendar sidebar, mobile) must hit the same domain mutation function.

## Tombstone TTL & Deletion Propagation

Deleted tasks and entities are tracked via tombstone records with ISO timestamps. Tombstones are pruned during sync when older than **180 days**.

**Known limitation:** If device A deletes an entity and creates a tombstone, but does not sync with device B for more than 180 days, the tombstone expires. When device B (which still has the entity) eventually syncs, the entity will be resurrected because no tombstone exists to suppress it. This is an accepted trade-off — 180 days without syncing is an extreme edge case, and indefinite tombstone retention would cause unbounded growth.

## Credential Sync (Encrypted)

Integration credentials (API keys, worker URLs) are encrypted and included in the `data.json` payload so they travel across devices automatically after signing in with Google.

### What syncs
| Credential | localStorage Key | ID |
|---|---|---|
| Anthropic API Key | `lifeGamificationAnthropicKey` | `anthropicKey` |
| WHOOP Worker URL | `nucleusWhoopWorkerUrl` | `whoopWorkerUrl` |
| WHOOP API Key | `nucleusWhoopApiKey` | `whoopApiKey` |
| Libre Worker URL | `nucleusLibreWorkerUrl` | `libreWorkerUrl` |
| Libre API Key | `nucleusLibreApiKey` | `libreApiKey` |

**Not synced:** GitHub token (bootstrap credential), Google Calendar tokens (short-lived OAuth).

### Encryption scheme
- **Algorithm:** AES-GCM (256-bit key, 96-bit IV) via Web Crypto API
- **Key derivation:** PBKDF2-SHA256, 100k iterations
- **Key input:** `Firebase currentUser.uid` + Firebase project ID (`homebase-880f0`)
- **Architecture:** Two-layer envelope — a random data key encrypts the credentials, a UID-derived wrapping key encrypts the data key

### Conflict policy
- **Local-wins with gap-fill:** On restore, each credential is only written to localStorage if the local value is empty. A device that already has a credential keeps its own value.

### Failure states
- **No Firebase user signed in:** `buildEncryptedCredentials()` returns `null`, field omitted from payload
- **SubtleCrypto unavailable:** Returns `null` / `false`, no crash
- **Decryption fails (wrong user / corrupt data):** AES-GCM throws, caught gracefully, app continues
- **Credential rotation:** The device where you rotated keeps the new value; other devices keep theirs unless they have no value

## Payload Integrity & Validation
- **Checksum:** SHA-256 computed over the full payload (excluding `_checksum` field) using Web Crypto API. Verified on load and during pull-merge. Backwards-compatible — old payloads without checksum are accepted.
- **Schema version:** Integer `_schemaVersion` field. If cloud version > app's `CLOUD_SCHEMA_VERSION`, merge is refused with "Please update" error.
- **Structural validation:** `validateCloudPayload()` checks type invariants (tasks is array, data is object, etc.) before merge. Invalid payloads are rejected.
- **Compact encoding:** Payload uses `JSON.stringify(payload)` (no pretty-printing) to reduce size ~30-40%.

## Sync Health Metrics
- Tracked in `state.syncHealth` and persisted to `nucleusSyncHealth` localStorage key.
- Metrics: total/successful/failed saves and loads, average save latency, last error, recent 20 events.
- Visible in Settings > Sync Health section with Force Push/Pull buttons.

## Idempotency Expectations
- Replaying the same cloud payload should not duplicate entities.
- Re-running merges with unchanged data should produce stable state.
