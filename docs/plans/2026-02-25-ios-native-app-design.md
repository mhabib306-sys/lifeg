# Homebase iOS Native App — Design Document

**Date:** 2026-02-25
**Status:** Approved
**Scope:** v1 — Tasks, Notes (full outliner), Entities, GitHub Sync, TestFlight

---

## Goal

Build a native SwiftUI iOS app that provides full task management and notes outliner functionality, syncing with the existing Homebase web app via the shared GitHub `data.json` store. Things 3-inspired UI. Personal use via TestFlight.

## Architecture Overview

- **Platform:** iOS 17+, Swift 6, SwiftUI lifecycle
- **Persistence:** SwiftData (SQLite-backed, offline-first)
- **Sync:** Direct GitHub API peer sync (same `data.json` as web app)
- **Dependencies:** Zero external — SwiftUI, SwiftData, Foundation, CryptoKit, Keychain Services
- **Distribution:** TestFlight (internal testing, paid Apple Developer account)

Both web and iOS are thick clients. SwiftData is the local source of truth (like localStorage on web). GitHub is eventual consistency. No intermediary server.

---

## Project Structure

```
Homebase/
├── HomebaseApp.swift              (App entry, SwiftData container setup)
├── Models/
│   ├── HBTask.swift               (Task + Note unified model)
│   ├── HBArea.swift               (Task areas)
│   ├── HBCategory.swift           (Sub-areas under areas)
│   ├── HBLabel.swift              (Tags)
│   ├── HBPerson.swift             (People)
│   ├── HBPerspective.swift        (Custom perspectives)
│   └── HBTombstone.swift          (Deletion tracking)
├── Sync/
│   ├── SyncEngine.swift           (Orchestrator: fetch, merge, push)
│   ├── GitHubAPI.swift            (GitHub REST client for data.json)
│   ├── MergeEngine.swift          (Gap-fill + newest-wins logic)
│   └── PayloadCoder.swift         (Encode/decode CloudPayload JSON)
├── Features/
│   ├── Tasks/
│   │   ├── TaskListView.swift     (Filtered task list per perspective)
│   │   ├── TaskRowView.swift      (Checkbox, metadata, swipe actions)
│   │   ├── TaskDetailView.swift   (Full task editor sheet)
│   │   └── TaskFilterEngine.swift (Perspective filter logic)
│   ├── Notes/
│   │   ├── OutlinerView.swift     (Hierarchical notes list)
│   │   ├── NoteRowView.swift      (Indented note with disclosure)
│   │   ├── NoteEditorView.swift   (Inline editing + autocomplete)
│   │   └── OutlinerEngine.swift   (Indent/outdent, reparent, reorder)
│   └── Entities/
│       ├── AreaListView.swift     (CRUD for areas)
│       ├── CategoryListView.swift
│       ├── LabelListView.swift
│       └── PersonListView.swift
├── Navigation/
│   ├── SidebarView.swift          (iPad sidebar / iPhone list)
│   ├── PerspectiveRow.swift       (Icon + name + badge count)
│   └── NavigationRouter.swift     (Programmatic navigation state)
├── Shared/
│   ├── Theme.swift                (Things 3 color palette, typography)
│   ├── HBIcon.swift               (SF Symbols mapping)
│   └── Extensions/
└── Resources/
    └── Assets.xcassets
```

---

## Data Models

### Unified Task/Note Model (HBTask)

Maps directly to web's `tasksData` array. Single SwiftData `@Model` for both tasks and notes, distinguished by `isNote` flag.

**Fields:**

| Field | Type | Notes |
|---|---|---|
| id | String | `task_<timestamp>_<random>` (client-generated) |
| title | String | |
| notes | String | Body/description |
| status | String | `inbox` / `anytime` / `someday` |
| today | Bool | Non-exclusive (Today tasks also appear in Anytime) |
| flagged | Bool | OmniFocus-style independent flag |
| completed | Bool | |
| completedAt | Date? | Set when completed, nil otherwise |
| areaId | String? | FK to HBArea |
| categoryId | String? | FK to HBCategory |
| labels | [String] | Array of label IDs |
| people | [String] | Array of person IDs |
| deferDate | Date? | Controls availability (future = not available) |
| dueDate | Date? | Deadline signal |
| repeat | RepeatRule? | Codable struct: type, interval, from |
| isNote | Bool | true = note in outliner |
| noteLifecycleState | String | `active` / `deleted` |
| noteHistory | [NoteHistoryEntry] | Codable array, capped at 60 |
| parentId | String? | Parent note/task ID |
| indent | Int | Nesting level |
| order | Int | Display order |
| createdAt | Date | |
| updatedAt | Date | Refreshed on every mutation |
| isProject | Bool | GTD project flag |
| projectId | String? | Parent project ID |
| projectType | String? | `parallel` / `sequential` |
| waitingFor | WaitingFor? | Codable struct |
| timeEstimate | Int? | Minutes |
| meetingEventKey | String? | Google Calendar link (future) |

### Entity Models

**HBArea:** id, name, color, emoji?, order, createdAt, updatedAt
**HBCategory:** id, name, areaId, color?, emoji?, order, createdAt, updatedAt
**HBLabel:** id, name, color, emoji?, order, createdAt, updatedAt
**HBPerson:** id, name, email, color?, jobTitle?, photoUrl?, photoData?, order, createdAt, updatedAt
**HBPerspective:** id, name, icon, color, filter (Codable), emoji?, order, createdAt, updatedAt
**HBTombstone:** id, collection, entityId, deletedAt

### ID Generation

Same scheme as web:
```swift
func generateTaskId() -> String {
    let timestamp = Int(Date().timeIntervalSince1970 * 1000)
    let random = String((0..<8).map { _ in "abcdefghijklmnopqrstuvwxyz0123456789".randomElement()! })
    return "task_\(timestamp)_\(random)"
}
// Entities: "area_", "cat_", "label_", "person_" prefixes
```

---

## Sync Architecture

### Flow

```
User mutates data
    → SwiftData write (immediate)
    → dirtyFlag = true (UserDefaults)
    → Debounce 2 seconds
    → SyncEngine.push():
        1. GET data.json (SHA + content)
        2. Decode CloudPayload
        3. Pull-merge: cloud into local
           - Tasks/Notes: newest-wins by updatedAt
           - Entities: newest-wins by updatedAt
           - Tombstones: honor deletions, prune > 180 days
        4. Increment syncSequence
        5. Compute SHA-256 checksum
        6. Build payload from merged local state
        7. PUT data.json with SHA
        8. Success → clear dirtyFlag
        9. 409 → retry with exponential backoff (up to 6x)
        10. 403 → pause 60 seconds
```

### App Lifecycle

- **Launch:** dirty → sync immediately; clean → pull from cloud
- **Foreground:** pull from cloud (catch web edits)
- **Background:** flush pending sync via BGAppRefreshTask
- **Network restored:** if dirty, trigger sync

### Merge Strategy

- **Tasks/Entities:** Newest-wins by `updatedAt`. On tie, local wins.
- **Tombstones:** If entity ID has tombstone, entity is excluded. Tombstones pruned after 180 days.
- **Unknown fields:** Pass through unchanged. iOS reads full payload, writes only its known fields merged into the existing payload. Never clobbers web-only data.

### Token Storage

GitHub PAT stored in iOS Keychain. User enters once in Settings.

---

## Navigation & UI

### iPhone

- Root: perspective list (Inbox, Today, Flagged, Anytime, Someday, Upcoming, Logbook, Notes, custom perspectives)
- Tap perspective → push to filtered task list
- Tap task → sheet slides up (task detail/editor)
- Floating "+" button for quick-add
- Tasks grouped by area within perspectives

### iPad

- Three-column: sidebar | task list | task detail
- Sidebar always visible landscape, collapsible portrait

### Things 3 UI Patterns

| Component | Behavior |
|---|---|
| Task row | Circular checkbox, title + metadata, swipe left = flag/defer, swipe right = complete |
| Task detail | Modal sheet, large editable title, when/tags/area/notes sections |
| Perspective row | SF Symbol + name + badge count, colored accent |
| Note row | Indented with chevron, tap expand/collapse, swipe indent/outdent |
| Quick add | Floating "+", natural language date parsing |

### Outliner (Notes)

- Tap title → inline edit
- Tap chevron → expand/collapse children
- Tap zoom → push into children (breadcrumb)
- Swipe right → indent
- Swipe left → outdent
- Long press → drag to reorder

### Navigation State

```swift
@Observable class NavigationRouter {
    var selectedPerspective: PerspectiveType = .inbox
    var selectedTaskID: String? = nil
    var presentedSheet: SheetType? = nil
    var noteBreadcrumb: [String] = []
}
```

---

## Persistence Details

### SwiftData Container

All entity types in a single ModelContainer. `@Model` objects auto-persist via ModelContext — no manual save calls needed.

### Dirty Tracking

`UserDefaults.standard.bool(forKey: "syncDirty")` — set true on every mutation, cleared after successful GitHub PUT. Survives app kill.

### Perspective Queries

Each built-in perspective maps to a `#Predicate<HBTask>`. Custom perspectives build predicates dynamically from their filter definition.

### Schema Migration

v1 is baseline. Future changes use SwiftData's `VersionedSchema` + `SchemaMigrationPlan`. Cloud payload has `_schemaVersion` for compatibility.

---

## Future Expansion Path

| Version | Adds |
|---|---|
| v1 | Tasks, Notes, Entities, Sync, TestFlight |
| v2 | Daily tracking (prayers, glucose, habits) |
| v3 | Dashboard/charts, gamification (XP, streaks) |
| v4 | Calendar view, Google Calendar integration |
| v5 | Home widgets, meeting notes |

**Architecture enables this via:**
1. PayloadCoder passes through unknown JSON fields (never clobbers web-only data)
2. ModelContainer accepts new @Model types (additive schema changes)
3. Feature folders are self-contained
4. SyncEngine is entity-agnostic (one merge call per new entity type)
5. NavigationRouter gains new enum cases for new tabs

---

## Non-Goals for v1

- Daily tracking / health metrics
- Dashboard / charts / gamification
- Calendar view / Google Calendar sync
- Meeting notes workspace
- Home tab widgets
- WHOOP / Libre integration
- Push notifications
- Real-time sync (sync server)
- App Store distribution
