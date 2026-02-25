# Homebase iOS Native App — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a native SwiftUI iOS app for task management and notes with offline-first GitHub sync, matching the Homebase web app's data model.

**Architecture:** SwiftData for local persistence, direct GitHub API sync with existing `data.json`, Things 3-inspired UI. Both web and iOS are peer thick clients with eventual consistency via GitHub.

**Tech Stack:** Swift 6, SwiftUI, SwiftData, iOS 17+, Foundation (URLSession), CryptoKit (SHA-256), Keychain Services

**Design Doc:** `docs/plans/2026-02-25-ios-native-app-design.md`

**Web App Reference Files:**
- Data model: `docs/data-model.md`
- Sync logic: `src/data/github-sync.js`
- Task logic: `src/features/tasks.js`, `src/features/task-filter.js`
- Notes logic: `src/features/notes.js`
- State shape: `src/state.js`
- Constants: `src/constants.js`

---

## Task 1: Xcode Project Scaffolding

**Files:**
- Create: `ios/Homebase/Homebase.xcodeproj`
- Create: `ios/Homebase/Homebase/HomebaseApp.swift`
- Create: `ios/Homebase/Homebase/Info.plist`
- Create: `ios/Homebase/HomebaseTests/HomebaseTests.swift`

**Step 1: Create Xcode project**

Open Xcode → File → New → Project → iOS → App.
- Product Name: `Homebase`
- Organization Identifier: `com.yourname` (match your Apple Developer account)
- Interface: SwiftUI
- Storage: SwiftData
- Include Tests: Yes (Unit Tests checked)
- Save to: `ios/` directory inside the lifeg repo

**Step 2: Configure project settings**

In Xcode project settings:
- Minimum Deployment: iOS 17.0
- Swift Language Version: Swift 6
- Device Orientation: Portrait only (iPhone), All (iPad)
- Supported Destinations: iPhone, iPad

**Step 3: Verify project builds and tests run**

```bash
cd ios/Homebase
xcodebuild build -scheme Homebase -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' | tail -5
xcodebuild test -scheme Homebase -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' | tail -5
```

Expected: BUILD SUCCEEDED, TEST SUCCEEDED

**Step 4: Update HomebaseApp.swift with ModelContainer placeholder**

```swift
import SwiftUI
import SwiftData

@main
struct HomebaseApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [])  // Will add models as we create them
    }
}
```

**Step 5: Commit**

```bash
git add ios/
git commit -m "feat(ios): scaffold Xcode project with SwiftUI + SwiftData"
```

---

## Task 2: Core Data Models — HBTask

**Files:**
- Create: `ios/Homebase/Homebase/Models/HBTask.swift`
- Create: `ios/Homebase/HomebaseTests/Models/HBTaskTests.swift`

**Step 1: Write tests for HBTask**

```swift
import XCTest
import SwiftData
@testable import Homebase

final class HBTaskTests: XCTestCase {
    var container: ModelContainer!
    var context: ModelContext!

    override func setUp() {
        let schema = Schema([HBTask.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        container = try! ModelContainer(for: schema, configurations: [config])
        context = ModelContext(container)
    }

    func testCreateTask() {
        let task = HBTask(title: "Buy groceries")
        context.insert(task)
        try! context.save()

        let descriptor = FetchDescriptor<HBTask>()
        let tasks = try! context.fetch(descriptor)
        XCTAssertEqual(tasks.count, 1)
        XCTAssertEqual(tasks[0].title, "Buy groceries")
        XCTAssertTrue(tasks[0].id.hasPrefix("task_"))
        XCTAssertEqual(tasks[0].status, "inbox")
        XCTAssertFalse(tasks[0].completed)
        XCTAssertFalse(tasks[0].isNote)
    }

    func testCreateNote() {
        let note = HBTask.createNote(title: "Meeting notes")
        context.insert(note)
        try! context.save()

        let descriptor = FetchDescriptor<HBTask>()
        let tasks = try! context.fetch(descriptor)
        XCTAssertTrue(tasks[0].isNote)
        XCTAssertEqual(tasks[0].noteLifecycleState, "active")
    }

    func testIdGeneration() {
        let t1 = HBTask(title: "A")
        let t2 = HBTask(title: "B")
        XCTAssertNotEqual(t1.id, t2.id)
        XCTAssertTrue(t1.id.hasPrefix("task_"))
    }

    func testUpdatedAtRefreshes() {
        let task = HBTask(title: "Test")
        let original = task.updatedAt
        Thread.sleep(forTimeInterval: 0.01)
        task.touch()
        XCTAssertGreaterThan(task.updatedAt, original)
    }

    func testComplete() {
        let task = HBTask(title: "Test")
        XCTAssertNil(task.completedAt)
        task.markCompleted()
        XCTAssertTrue(task.completed)
        XCTAssertNotNil(task.completedAt)
        task.markIncomplete()
        XCTAssertFalse(task.completed)
        XCTAssertNil(task.completedAt)
    }
}
```

**Step 2: Run tests to verify they fail**

```bash
xcodebuild test -scheme Homebase -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' 2>&1 | grep -E 'Test|error|FAIL'
```

Expected: Compilation errors — `HBTask` not found.

**Step 3: Implement HBTask model**

```swift
import Foundation
import SwiftData

@Model
final class HBTask {
    // MARK: - Identity
    @Attribute(.unique) var id: String
    var title: String
    var notes: String

    // MARK: - Task State
    var status: String          // "inbox" | "anytime" | "someday"
    var today: Bool
    var flagged: Bool
    var completed: Bool
    var completedAt: Date?

    // MARK: - Organization
    var areaId: String?
    var categoryId: String?
    var labels: [String]        // Label IDs
    var people: [String]        // Person IDs

    // MARK: - Dates
    var deferDate: Date?
    var dueDate: Date?

    // MARK: - Repeat
    var repeatType: String?     // "day" | "week" | "month" | "year"
    var repeatInterval: Int?
    var repeatFrom: String?

    // MARK: - Note/Outliner
    var isNote: Bool
    var noteLifecycleState: String  // "active" | "deleted"
    var noteHistoryData: Data?      // JSON-encoded [NoteHistoryEntry]
    var parentId: String?
    var indent: Int
    var order: Int

    // MARK: - GTD Extensions
    var isProject: Bool
    var projectId: String?
    var projectType: String?    // "parallel" | "sequential"
    var waitingForData: Data?   // JSON-encoded WaitingFor
    var timeEstimate: Int?      // Minutes

    // MARK: - Integration
    var meetingEventKey: String?

    // MARK: - Timestamps
    var createdAt: Date
    var updatedAt: Date

    init(title: String, status: String = "inbox", isNote: Bool = false) {
        self.id = Self.generateId(prefix: "task")
        self.title = title
        self.notes = ""
        self.status = status
        self.today = false
        self.flagged = false
        self.completed = false
        self.completedAt = nil
        self.areaId = nil
        self.categoryId = nil
        self.labels = []
        self.people = []
        self.deferDate = nil
        self.dueDate = nil
        self.repeatType = nil
        self.repeatInterval = nil
        self.repeatFrom = nil
        self.isNote = isNote
        self.noteLifecycleState = isNote ? "active" : ""
        self.noteHistoryData = nil
        self.parentId = nil
        self.indent = 0
        self.order = 0
        self.isProject = false
        self.projectId = nil
        self.projectType = nil
        self.waitingForData = nil
        self.timeEstimate = nil
        self.meetingEventKey = nil
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    // MARK: - Factory

    static func createNote(title: String) -> HBTask {
        HBTask(title: title, isNote: true)
    }

    // MARK: - Mutations

    func touch() {
        updatedAt = Date()
    }

    func markCompleted() {
        completed = true
        completedAt = Date()
        touch()
    }

    func markIncomplete() {
        completed = false
        completedAt = nil
        touch()
    }

    // MARK: - ID Generation

    static func generateId(prefix: String) -> String {
        let timestamp = Int(Date().timeIntervalSince1970 * 1000)
        let chars = "abcdefghijklmnopqrstuvwxyz0123456789"
        let random = String((0..<8).map { _ in chars.randomElement()! })
        return "\(prefix)_\(timestamp)_\(random)"
    }
}
```

**Step 4: Run tests to verify they pass**

```bash
xcodebuild test -scheme Homebase -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' 2>&1 | grep -E 'Test|PASS|FAIL'
```

Expected: All 5 tests PASS.

**Step 5: Commit**

```bash
git add ios/Homebase/Homebase/Models/HBTask.swift ios/Homebase/HomebaseTests/Models/HBTaskTests.swift
git commit -m "feat(ios): add HBTask SwiftData model with tests"
```

---

## Task 3: Entity Models — HBArea, HBCategory, HBLabel, HBPerson

**Files:**
- Create: `ios/Homebase/Homebase/Models/HBArea.swift`
- Create: `ios/Homebase/Homebase/Models/HBCategory.swift`
- Create: `ios/Homebase/Homebase/Models/HBLabel.swift`
- Create: `ios/Homebase/Homebase/Models/HBPerson.swift`
- Create: `ios/Homebase/HomebaseTests/Models/HBEntityTests.swift`

**Step 1: Write tests**

```swift
import XCTest
import SwiftData
@testable import Homebase

final class HBEntityTests: XCTestCase {
    var container: ModelContainer!
    var context: ModelContext!

    override func setUp() {
        let schema = Schema([HBArea.self, HBCategory.self, HBLabel.self, HBPerson.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        container = try! ModelContainer(for: schema, configurations: [config])
        context = ModelContext(container)
    }

    func testCreateArea() {
        let area = HBArea(name: "Work", color: "#FF0000")
        context.insert(area)
        try! context.save()
        XCTAssertTrue(area.id.hasPrefix("area_"))
        XCTAssertEqual(area.name, "Work")
    }

    func testCreateCategory() {
        let cat = HBCategory(name: "Design", areaId: "area_123")
        context.insert(cat)
        try! context.save()
        XCTAssertTrue(cat.id.hasPrefix("cat_"))
        XCTAssertEqual(cat.areaId, "area_123")
    }

    func testCreateLabel() {
        let label = HBLabel(name: "Urgent", color: "#FF0000")
        context.insert(label)
        try! context.save()
        XCTAssertTrue(label.id.hasPrefix("label_"))
    }

    func testCreatePerson() {
        let person = HBPerson(name: "Alice")
        context.insert(person)
        try! context.save()
        XCTAssertTrue(person.id.hasPrefix("person_"))
        XCTAssertEqual(person.email, "")
    }

    func testEntityTouch() {
        let area = HBArea(name: "Test", color: "#000")
        let original = area.updatedAt
        Thread.sleep(forTimeInterval: 0.01)
        area.touch()
        XCTAssertGreaterThan(area.updatedAt, original)
    }
}
```

**Step 2: Run tests to verify they fail**

Expected: Compilation errors — entity types not found.

**Step 3: Implement all four entity models**

Each follows the same pattern. Example for HBArea (others are similar):

```swift
import Foundation
import SwiftData

@Model
final class HBArea {
    @Attribute(.unique) var id: String
    var name: String
    var color: String
    var emoji: String?
    var order: Int
    var createdAt: Date
    var updatedAt: Date

    init(name: String, color: String, emoji: String? = nil, order: Int = 0) {
        self.id = HBTask.generateId(prefix: "area")
        self.name = name
        self.color = color
        self.emoji = emoji
        self.order = order
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    func touch() { updatedAt = Date() }
}
```

HBCategory adds `areaId: String`. HBLabel matches HBArea. HBPerson adds `email: String`, `jobTitle: String?`, `photoUrl: String?`, `photoData: String?`.

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git add ios/Homebase/Homebase/Models/ ios/Homebase/HomebaseTests/Models/
git commit -m "feat(ios): add entity models — Area, Category, Label, Person"
```

---

## Task 4: HBPerspective + HBTombstone Models

**Files:**
- Create: `ios/Homebase/Homebase/Models/HBPerspective.swift`
- Create: `ios/Homebase/Homebase/Models/HBTombstone.swift`
- Create: `ios/Homebase/Homebase/Models/FilterDefinition.swift`
- Create: `ios/Homebase/HomebaseTests/Models/HBPerspectiveTests.swift`

**Step 1: Write tests**

```swift
import XCTest
import SwiftData
@testable import Homebase

final class HBPerspectiveTests: XCTestCase {
    var container: ModelContainer!
    var context: ModelContext!

    override func setUp() {
        let schema = Schema([HBPerspective.self, HBTombstone.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        container = try! ModelContainer(for: schema, configurations: [config])
        context = ModelContext(container)
    }

    func testCreatePerspective() {
        let filter = FilterDefinition(matchMode: .all, availability: .available)
        let persp = HBPerspective(name: "High Priority", icon: "star.fill", color: "#FFD700", filter: filter)
        context.insert(persp)
        try! context.save()
        XCTAssertEqual(persp.name, "High Priority")

        let decoded = persp.filterDefinition
        XCTAssertEqual(decoded?.matchMode, .all)
    }

    func testCreateTombstone() {
        let tomb = HBTombstone(collection: "tasks", entityId: "task_123")
        context.insert(tomb)
        try! context.save()
        XCTAssertEqual(tomb.collection, "tasks")
        XCTAssertEqual(tomb.entityId, "task_123")
    }

    func testTombstoneExpiry() {
        let old = HBTombstone(collection: "tasks", entityId: "task_old")
        old.deletedAt = Calendar.current.date(byAdding: .day, value: -200, to: Date())!
        XCTAssertTrue(old.isExpired(ttlDays: 180))

        let recent = HBTombstone(collection: "tasks", entityId: "task_new")
        XCTAssertFalse(recent.isExpired(ttlDays: 180))
    }
}
```

**Step 2: Run tests — expect compilation failure**

**Step 3: Implement models**

FilterDefinition (Codable struct, not a SwiftData model):

```swift
import Foundation

struct FilterDefinition: Codable, Equatable {
    enum MatchMode: String, Codable { case all, any, none }
    enum Availability: String, Codable { case available, remaining, completed }

    var matchMode: MatchMode
    var availability: Availability
    var areaIds: [String]?
    var statusValues: [String]?
    var labelIds: [String]?
    var peopleIds: [String]?
    var duePresence: String?       // "has-due" | "no-due"
    var deferPresence: String?     // "has-defer" | "no-defer"
    var repeating: Bool?
    var untagged: Bool?
    var inboxOnly: Bool?
    var searchTerms: [String]?
}
```

HBPerspective stores filter as JSON Data, with a computed property to decode:

```swift
@Model
final class HBPerspective {
    @Attribute(.unique) var id: String
    var name: String
    var icon: String
    var color: String
    var filterData: Data   // JSON-encoded FilterDefinition
    var emoji: String?
    var order: Int
    var createdAt: Date
    var updatedAt: Date

    init(name: String, icon: String, color: String, filter: FilterDefinition, order: Int = 0) {
        self.id = HBTask.generateId(prefix: "persp")
        self.name = name
        self.icon = icon
        self.color = color
        self.filterData = try! JSONEncoder().encode(filter)
        self.order = order
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    var filterDefinition: FilterDefinition? {
        try? JSONDecoder().decode(FilterDefinition.self, from: filterData)
    }

    func touch() { updatedAt = Date() }
}
```

HBTombstone:

```swift
@Model
final class HBTombstone {
    @Attribute(.unique) var id: String  // "<collection>::<entityId>"
    var collection: String
    var entityId: String
    var deletedAt: Date

    init(collection: String, entityId: String) {
        self.id = "\(collection)::\(entityId)"
        self.collection = collection
        self.entityId = entityId
        self.deletedAt = Date()
    }

    func isExpired(ttlDays: Int) -> Bool {
        let cutoff = Calendar.current.date(byAdding: .day, value: -ttlDays, to: Date())!
        return deletedAt < cutoff
    }
}
```

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add Perspective, Tombstone, FilterDefinition models"
```

---

## Task 5: Register Models in ModelContainer

**Files:**
- Modify: `ios/Homebase/Homebase/HomebaseApp.swift`

**Step 1: Update HomebaseApp to register all models**

```swift
import SwiftUI
import SwiftData

@main
struct HomebaseApp: App {
    let container: ModelContainer

    init() {
        let schema = Schema([
            HBTask.self,
            HBArea.self,
            HBCategory.self,
            HBLabel.self,
            HBPerson.self,
            HBPerspective.self,
            HBTombstone.self
        ])
        let config = ModelConfiguration("Homebase", isStoredInMemoryOnly: false)
        container = try! ModelContainer(for: schema, configurations: [config])
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
    }
}
```

**Step 2: Build to verify all models register without errors**

```bash
xcodebuild build -scheme Homebase -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest' 2>&1 | tail -3
```

Expected: BUILD SUCCEEDED

**Step 3: Commit**

```bash
git commit -m "feat(ios): register all SwiftData models in app container"
```

---

## Task 6: PayloadCoder — Decode/Encode CloudPayload JSON

This is the most critical sync piece. It must decode the full `data.json` from the web app, preserve unknown fields, and re-encode with iOS changes merged in.

**Files:**
- Create: `ios/Homebase/Homebase/Sync/PayloadCoder.swift`
- Create: `ios/Homebase/HomebaseTests/Sync/PayloadCoderTests.swift`
- Reference: `src/data/github-sync.js` (web app's payload structure)

**Step 1: Write tests**

```swift
import XCTest
@testable import Homebase

final class PayloadCoderTests: XCTestCase {

    let minimalPayload = """
    {
        "_schemaVersion": 1,
        "_sequence": 42,
        "_checksum": "abc123",
        "lastUpdated": "2026-02-25T10:00:00.000Z",
        "tasks": [
            {
                "id": "task_001",
                "title": "Buy milk",
                "notes": "",
                "status": "inbox",
                "today": false,
                "flagged": false,
                "completed": false,
                "completedAt": null,
                "labels": [],
                "people": [],
                "isNote": false,
                "noteLifecycleState": "",
                "indent": 0,
                "order": 0,
                "isProject": false,
                "createdAt": "2026-02-25T09:00:00.000Z",
                "updatedAt": "2026-02-25T09:00:00.000Z"
            }
        ],
        "taskCategories": [],
        "categories": [],
        "taskLabels": [],
        "taskPeople": [],
        "customPerspectives": [],
        "deletedTaskTombstones": {},
        "deletedEntityTombstones": {},
        "data": {},
        "weights": {},
        "xp": {"total": 100, "history": []}
    }
    """.data(using: .utf8)!

    func testDecodePayload() throws {
        let payload = try PayloadCoder.decode(minimalPayload)
        XCTAssertEqual(payload.schemaVersion, 1)
        XCTAssertEqual(payload.sequence, 42)
        XCTAssertEqual(payload.tasks.count, 1)
        XCTAssertEqual(payload.tasks[0].id, "task_001")
        XCTAssertEqual(payload.tasks[0].title, "Buy milk")
    }

    func testPreservesUnknownFields() throws {
        let payload = try PayloadCoder.decode(minimalPayload)
        // "xp", "data", "weights" are unknown to iOS v1
        // They must survive round-trip
        let encoded = try PayloadCoder.encode(payload)
        let reparsed = try JSONSerialization.jsonObject(with: encoded) as! [String: Any]
        XCTAssertNotNil(reparsed["xp"])
        XCTAssertNotNil(reparsed["data"])
        XCTAssertNotNil(reparsed["weights"])
    }

    func testEncodeSetsChecksum() throws {
        var payload = try PayloadCoder.decode(minimalPayload)
        payload.sequence = 43
        let encoded = try PayloadCoder.encode(payload)
        let reparsed = try JSONSerialization.jsonObject(with: encoded) as! [String: Any]
        let checksum = reparsed["_checksum"] as! String
        XCTAssertFalse(checksum.isEmpty)
        XCTAssertNotEqual(checksum, "abc123") // Should be recomputed
    }

    func testDecodeTombstones() throws {
        let json = """
        {
            "_schemaVersion": 1, "_sequence": 1, "_checksum": "", "lastUpdated": "",
            "tasks": [],
            "taskCategories": [], "categories": [], "taskLabels": [], "taskPeople": [],
            "customPerspectives": [],
            "deletedTaskTombstones": {"task_old": "2026-01-01T00:00:00.000Z"},
            "deletedEntityTombstones": {"taskLabels": {"label_x": "2026-01-15T00:00:00.000Z"}}
        }
        """.data(using: .utf8)!
        let payload = try PayloadCoder.decode(json)
        XCTAssertEqual(payload.deletedTaskTombstones["task_old"], "2026-01-01T00:00:00.000Z")
        XCTAssertEqual(payload.deletedEntityTombstones["taskLabels"]?["label_x"], "2026-01-15T00:00:00.000Z")
    }
}
```

**Step 2: Run tests — expect compilation failure**

**Step 3: Implement PayloadCoder**

Key design: Use `JSONSerialization` for the outer envelope (to preserve unknown fields), and `Codable` for the typed collections (tasks, entities). The `CloudPayload` struct holds typed data + a `[String: Any]` passthrough dictionary.

```swift
import Foundation
import CryptoKit

struct TaskDTO: Codable {
    var id: String
    var title: String
    var notes: String?
    var status: String?
    var today: Bool?
    var flagged: Bool?
    var completed: Bool?
    var completedAt: String?
    var areaId: String?
    var categoryId: String?
    var labels: [String]?
    var people: [String]?
    var deferDate: String?
    var dueDate: String?
    var repeatType: String?
    var repeatInterval: Int?
    var repeatFrom: String?
    var isNote: Bool?
    var noteLifecycleState: String?
    var noteHistory: [[String: AnyCodable]]?
    var parentId: String?
    var indent: Int?
    var order: Int?
    var isProject: Bool?
    var projectId: String?
    var projectType: String?
    var waitingFor: [String: AnyCodable]?
    var timeEstimate: Int?
    var meetingEventKey: String?
    var createdAt: String?
    var updatedAt: String?
    // Passthrough for unknown task fields
    var extraFields: [String: AnyCodable]?
}

struct EntityDTO: Codable {
    var id: String
    var name: String
    var color: String?
    var emoji: String?
    var order: Int?
    var areaId: String?
    var email: String?
    var jobTitle: String?
    var photoUrl: String?
    var photoData: String?
    var createdAt: String?
    var updatedAt: String?
    // Perspective-specific
    var icon: String?
    var filter: [String: AnyCodable]?
}

struct CloudPayload {
    var schemaVersion: Int
    var sequence: Int
    var checksum: String
    var lastUpdated: String

    var tasks: [TaskDTO]
    var areas: [EntityDTO]          // "taskCategories" in JSON
    var categories: [EntityDTO]     // "categories" in JSON
    var labels: [EntityDTO]         // "taskLabels" in JSON
    var people: [EntityDTO]         // "taskPeople" in JSON
    var perspectives: [EntityDTO]   // "customPerspectives" in JSON

    var deletedTaskTombstones: [String: String]
    var deletedEntityTombstones: [String: [String: String]]

    // Everything else — preserved on round-trip
    var passthrough: [String: Any]
}

enum PayloadCoder {
    private static let knownKeys: Set<String> = [
        "_schemaVersion", "_sequence", "_checksum", "lastUpdated",
        "tasks", "taskCategories", "categories", "taskLabels", "taskPeople",
        "customPerspectives", "deletedTaskTombstones", "deletedEntityTombstones"
    ]

    static func decode(_ data: Data) throws -> CloudPayload {
        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        let decoder = JSONDecoder()

        func decodeArray<T: Decodable>(_ key: String) -> [T] {
            guard let arr = json[key] else { return [] }
            guard let data = try? JSONSerialization.data(withJSONObject: arr) else { return [] }
            return (try? decoder.decode([T].self, from: data)) ?? []
        }

        let tombstones = json["deletedTaskTombstones"] as? [String: String] ?? [:]
        let entityTombstones = json["deletedEntityTombstones"] as? [String: [String: String]] ?? [:]

        var passthrough: [String: Any] = [:]
        for (key, value) in json where !knownKeys.contains(key) {
            passthrough[key] = value
        }

        return CloudPayload(
            schemaVersion: json["_schemaVersion"] as? Int ?? 1,
            sequence: json["_sequence"] as? Int ?? 0,
            checksum: json["_checksum"] as? String ?? "",
            lastUpdated: json["lastUpdated"] as? String ?? "",
            tasks: decodeArray("tasks"),
            areas: decodeArray("taskCategories"),
            categories: decodeArray("categories"),
            labels: decodeArray("taskLabels"),
            people: decodeArray("taskPeople"),
            perspectives: decodeArray("customPerspectives"),
            deletedTaskTombstones: tombstones,
            deletedEntityTombstones: entityTombstones,
            passthrough: passthrough
        )
    }

    static func encode(_ payload: CloudPayload) throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]

        var json: [String: Any] = payload.passthrough

        json["_schemaVersion"] = payload.schemaVersion
        json["_sequence"] = payload.sequence
        json["lastUpdated"] = payload.lastUpdated

        func encodeArray<T: Encodable>(_ items: [T]) -> Any {
            let data = try! encoder.encode(items)
            return try! JSONSerialization.jsonObject(with: data)
        }

        json["tasks"] = encodeArray(payload.tasks)
        json["taskCategories"] = encodeArray(payload.areas)
        json["categories"] = encodeArray(payload.categories)
        json["taskLabels"] = encodeArray(payload.labels)
        json["taskPeople"] = encodeArray(payload.people)
        json["customPerspectives"] = encodeArray(payload.perspectives)
        json["deletedTaskTombstones"] = payload.deletedTaskTombstones
        json["deletedEntityTombstones"] = payload.deletedEntityTombstones

        // Compute checksum: serialize without _checksum, then SHA-256
        json.removeValue(forKey: "_checksum")
        let checksumData = try JSONSerialization.data(withJSONObject: json, options: [.sortedKeys])
        let hash = SHA256.hash(data: checksumData)
        let checksum = hash.map { String(format: "%02x", $0) }.joined()

        json["_checksum"] = checksum

        return try JSONSerialization.data(withJSONObject: json, options: [.sortedKeys])
    }
}
```

Note: You'll also need an `AnyCodable` helper for encoding arbitrary JSON values. Create `ios/Homebase/Homebase/Shared/AnyCodable.swift` — a standard implementation (search "AnyCodable Swift" for the well-known ~80 line helper).

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add PayloadCoder with passthrough for unknown fields"
```

---

## Task 7: GitHubAPI Client

**Files:**
- Create: `ios/Homebase/Homebase/Sync/GitHubAPI.swift`
- Create: `ios/Homebase/HomebaseTests/Sync/GitHubAPITests.swift`

**Step 1: Write tests (using URLProtocol mock)**

```swift
import XCTest
@testable import Homebase

final class GitHubAPITests: XCTestCase {

    func testFetchFileDecodesContent() async throws {
        let mockContent = "{\"_schemaVersion\":1}".data(using: .utf8)!.base64EncodedString()
        let mockResponse = """
        {"sha": "abc123", "content": "\(mockContent)", "encoding": "base64"}
        """.data(using: .utf8)!

        let api = GitHubAPI(
            token: "fake",
            owner: "test",
            repo: "test",
            session: MockURLSession(data: mockResponse, statusCode: 200)
        )
        let file = try await api.fetchFile(path: "data.json")
        XCTAssertEqual(file.sha, "abc123")
        XCTAssertTrue(file.content.contains("schemaVersion"))
    }

    func testPutFileReturnsNewSHA() async throws {
        let mockResponse = """
        {"content": {"sha": "newsha456"}}
        """.data(using: .utf8)!

        let api = GitHubAPI(
            token: "fake",
            owner: "test",
            repo: "test",
            session: MockURLSession(data: mockResponse, statusCode: 200)
        )
        let newSHA = try await api.putFile(
            path: "data.json",
            content: Data("{}".utf8),
            sha: "oldsha",
            message: "sync"
        )
        XCTAssertEqual(newSHA, "newsha456")
    }

    func testRateLimitThrows() async {
        let api = GitHubAPI(
            token: "fake",
            owner: "test",
            repo: "test",
            session: MockURLSession(data: Data(), statusCode: 403)
        )
        do {
            _ = try await api.fetchFile(path: "data.json")
            XCTFail("Should throw")
        } catch let error as GitHubAPIError {
            XCTAssertEqual(error, .rateLimited)
        }
    }
}
```

You'll need a `MockURLSession` helper — a simple protocol-based abstraction over URLSession so tests don't hit the network.

**Step 2: Run tests — expect compilation failure**

**Step 3: Implement GitHubAPI**

```swift
import Foundation

enum GitHubAPIError: Error, Equatable {
    case rateLimited
    case conflict           // 409 — SHA mismatch
    case unauthorized       // 401
    case networkError(String)
    case decodingError(String)
}

struct GitHubFile {
    let sha: String
    let content: Data   // Decoded from base64
}

protocol URLSessionProtocol {
    func data(for request: URLRequest) async throws -> (Data, URLResponse)
}
extension URLSession: URLSessionProtocol {}

final class GitHubAPI {
    private let token: String
    private let owner: String
    private let repo: String
    private let session: URLSessionProtocol
    private let baseURL = "https://api.github.com"

    init(token: String, owner: String, repo: String, session: URLSessionProtocol = URLSession.shared) {
        self.token = token
        self.owner = owner
        self.repo = repo
        self.session = session
    }

    func fetchFile(path: String) async throws -> GitHubFile {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)/contents/\(path)")!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let (data, response) = try await session.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0

        switch status {
        case 200: break
        case 401: throw GitHubAPIError.unauthorized
        case 403: throw GitHubAPIError.rateLimited
        default: throw GitHubAPIError.networkError("HTTP \(status)")
        }

        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        let sha = json["sha"] as! String
        let base64 = (json["content"] as! String).replacingOccurrences(of: "\n", with: "")
        let content = Data(base64Encoded: base64)!

        return GitHubFile(sha: sha, content: content)
    }

    func putFile(path: String, content: Data, sha: String, message: String) async throws -> String {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)/contents/\(path)")!)
        request.httpMethod = "PUT"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let body: [String: Any] = [
            "message": message,
            "content": content.base64EncodedString(),
            "sha": sha
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await session.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0

        switch status {
        case 200, 201: break
        case 401: throw GitHubAPIError.unauthorized
        case 403: throw GitHubAPIError.rateLimited
        case 409: throw GitHubAPIError.conflict
        default: throw GitHubAPIError.networkError("HTTP \(status)")
        }

        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        let contentObj = json["content"] as! [String: Any]
        return contentObj["sha"] as! String
    }
}
```

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add GitHub API client with mock-friendly URLSession"
```

---

## Task 8: MergeEngine — Newest-Wins + Tombstone Logic

**Files:**
- Create: `ios/Homebase/Homebase/Sync/MergeEngine.swift`
- Create: `ios/Homebase/HomebaseTests/Sync/MergeEngineTests.swift`

**Step 1: Write tests**

```swift
import XCTest
@testable import Homebase

final class MergeEngineTests: XCTestCase {

    func testNewestWins_cloudNewer() {
        let local = TaskDTO(id: "task_1", title: "Local", updatedAt: "2026-02-25T09:00:00.000Z")
        let cloud = TaskDTO(id: "task_1", title: "Cloud", updatedAt: "2026-02-25T10:00:00.000Z")
        let result = MergeEngine.mergeTasks(local: [local], cloud: [cloud], tombstones: [:])
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].title, "Cloud")
    }

    func testNewestWins_localNewer() {
        let local = TaskDTO(id: "task_1", title: "Local", updatedAt: "2026-02-25T10:00:00.000Z")
        let cloud = TaskDTO(id: "task_1", title: "Cloud", updatedAt: "2026-02-25T09:00:00.000Z")
        let result = MergeEngine.mergeTasks(local: [local], cloud: [cloud], tombstones: [:])
        XCTAssertEqual(result[0].title, "Local")
    }

    func testNewFromCloud() {
        let cloud = TaskDTO(id: "task_new", title: "From Cloud", updatedAt: "2026-02-25T10:00:00.000Z")
        let result = MergeEngine.mergeTasks(local: [], cloud: [cloud], tombstones: [:])
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].title, "From Cloud")
    }

    func testLocalOnlyPreserved() {
        let local = TaskDTO(id: "task_local", title: "Local Only", updatedAt: "2026-02-25T10:00:00.000Z")
        let result = MergeEngine.mergeTasks(local: [local], cloud: [], tombstones: [:])
        XCTAssertEqual(result.count, 1)
    }

    func testTombstoneDeletesEntity() {
        let local = TaskDTO(id: "task_dead", title: "Deleted", updatedAt: "2026-02-25T10:00:00.000Z")
        let tombstones = ["task_dead": "2026-02-25T11:00:00.000Z"]
        let result = MergeEngine.mergeTasks(local: [local], cloud: [], tombstones: tombstones)
        XCTAssertEqual(result.count, 0)
    }

    func testMergeEntities() {
        let local = EntityDTO(id: "area_1", name: "Local", updatedAt: "2026-02-25T09:00:00.000Z")
        let cloud = EntityDTO(id: "area_1", name: "Cloud", updatedAt: "2026-02-25T10:00:00.000Z")
        let result = MergeEngine.mergeEntities(local: [local], cloud: [cloud], tombstones: [:])
        XCTAssertEqual(result[0].name, "Cloud")
    }
}
```

**Step 2: Run tests — expect failure**

**Step 3: Implement MergeEngine**

```swift
import Foundation

enum MergeEngine {

    static func mergeTasks(
        local: [TaskDTO],
        cloud: [TaskDTO],
        tombstones: [String: String]
    ) -> [TaskDTO] {
        var byId: [String: TaskDTO] = [:]

        // Start with local
        for task in local {
            byId[task.id] = task
        }

        // Merge cloud (newest-wins)
        for cloudTask in cloud {
            if let localTask = byId[cloudTask.id] {
                if timestamp(cloudTask.updatedAt) > timestamp(localTask.updatedAt) {
                    byId[cloudTask.id] = cloudTask
                }
                // Else keep local (local wins on tie)
            } else {
                byId[cloudTask.id] = cloudTask
            }
        }

        // Apply tombstones
        for (id, _) in tombstones {
            byId.removeValue(forKey: id)
        }

        return Array(byId.values)
    }

    static func mergeEntities(
        local: [EntityDTO],
        cloud: [EntityDTO],
        tombstones: [String: String]
    ) -> [EntityDTO] {
        var byId: [String: EntityDTO] = [:]

        for entity in local { byId[entity.id] = entity }

        for cloudEntity in cloud {
            if let localEntity = byId[cloudEntity.id] {
                if timestamp(cloudEntity.updatedAt) > timestamp(localEntity.updatedAt) {
                    byId[cloudEntity.id] = cloudEntity
                }
            } else {
                byId[cloudEntity.id] = cloudEntity
            }
        }

        for (id, _) in tombstones { byId.removeValue(forKey: id) }

        return Array(byId.values)
    }

    static func mergeTombstones(
        local: [String: String],
        cloud: [String: String],
        ttlDays: Int = 180
    ) -> [String: String] {
        var merged = local
        for (id, ts) in cloud {
            if let existing = merged[id] {
                // Keep newest tombstone
                if timestamp(ts) > timestamp(existing) { merged[id] = ts }
            } else {
                merged[id] = ts
            }
        }
        // Prune expired
        let cutoff = Date().addingTimeInterval(TimeInterval(-ttlDays * 86400))
        return merged.filter { timestamp($0.value) > cutoff }
    }

    // MARK: - Helpers

    private static let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    private static func timestamp(_ iso: String?) -> Date {
        guard let iso, let date = isoFormatter.date(from: iso) else {
            return Date.distantPast
        }
        return date
    }
}
```

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add MergeEngine with newest-wins and tombstone logic"
```

---

## Task 9: SyncEngine — Orchestrator

**Files:**
- Create: `ios/Homebase/Homebase/Sync/SyncEngine.swift`
- Create: `ios/Homebase/HomebaseTests/Sync/SyncEngineTests.swift`

**Step 1: Write tests**

```swift
import XCTest
import SwiftData
@testable import Homebase

final class SyncEngineTests: XCTestCase {
    var container: ModelContainer!
    var context: ModelContext!

    override func setUp() {
        let schema = Schema([HBTask.self, HBArea.self, HBCategory.self, HBLabel.self, HBPerson.self, HBPerspective.self, HBTombstone.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        container = try! ModelContainer(for: schema, configurations: [config])
        context = ModelContext(container)
    }

    func testExportLocalTasks() {
        let task = HBTask(title: "Test export")
        context.insert(task)
        try! context.save()

        let engine = SyncEngine(container: container, api: nil)
        let dtos = engine.exportTasks(from: context)
        XCTAssertEqual(dtos.count, 1)
        XCTAssertEqual(dtos[0].title, "Test export")
    }

    func testImportCloudTasks() {
        let dto = TaskDTO(id: "task_cloud_1", title: "From cloud", updatedAt: "2026-02-25T10:00:00.000Z")
        let engine = SyncEngine(container: container, api: nil)
        engine.importTasks([dto], into: context)

        let descriptor = FetchDescriptor<HBTask>()
        let tasks = try! context.fetch(descriptor)
        XCTAssertEqual(tasks.count, 1)
        XCTAssertEqual(tasks[0].title, "From cloud")
        XCTAssertEqual(tasks[0].id, "task_cloud_1")
    }

    func testDirtyFlag() {
        let engine = SyncEngine(container: container, api: nil)
        XCTAssertFalse(engine.isDirty)
        engine.markDirty()
        XCTAssertTrue(engine.isDirty)
        engine.clearDirty()
        XCTAssertFalse(engine.isDirty)
    }
}
```

**Step 2: Run tests — expect failure**

**Step 3: Implement SyncEngine**

The SyncEngine bridges SwiftData models ↔ DTOs and orchestrates the sync flow. Full implementation includes:
- `exportTasks(from:)` / `importTasks(_:into:)` — convert between HBTask ↔ TaskDTO
- Same for entities
- `push()` — full sync flow (fetch, merge, put)
- `pull()` — fetch cloud data and merge into local
- Dirty flag via UserDefaults
- Debounce timer
- Retry with exponential backoff

```swift
import Foundation
import SwiftData

@Observable
final class SyncEngine {
    let container: ModelContainer
    private let api: GitHubAPI?
    private let dirtyKey = "syncDirty"
    private let sequenceKey = "syncSequence"
    private var debounceTask: Task<Void, Never>?

    var isSyncing = false
    var lastError: String?

    var isDirty: Bool {
        UserDefaults.standard.bool(forKey: dirtyKey)
    }

    init(container: ModelContainer, api: GitHubAPI?) {
        self.container = container
        self.api = api
    }

    func markDirty() {
        UserDefaults.standard.set(true, forKey: dirtyKey)
        scheduleDebouncedSync()
    }

    func clearDirty() {
        UserDefaults.standard.set(false, forKey: dirtyKey)
    }

    private var sequence: Int {
        get { UserDefaults.standard.integer(forKey: sequenceKey) }
        set { UserDefaults.standard.set(newValue, forKey: sequenceKey) }
    }

    // MARK: - Debounced Sync

    func scheduleDebouncedSync() {
        debounceTask?.cancel()
        debounceTask = Task {
            try? await Task.sleep(for: .seconds(2))
            guard !Task.isCancelled else { return }
            await push()
        }
    }

    // MARK: - Push (full sync)

    @MainActor
    func push() async {
        guard let api else { return }
        guard isDirty else { return }
        isSyncing = true
        defer { isSyncing = false }

        do {
            // 1. Fetch cloud
            let file = try await api.fetchFile(path: "data.json")
            let cloudPayload = try PayloadCoder.decode(file.content)

            // 2. Export local state
            let context = ModelContext(container)
            let localTasks = exportTasks(from: context)
            let localAreas = exportEntities(HBArea.self, from: context, prefix: "area")
            let localCategories = exportEntities(HBCategory.self, from: context, prefix: "cat")
            let localLabels = exportEntities(HBLabel.self, from: context, prefix: "label")
            let localPeople = exportEntities(HBPerson.self, from: context, prefix: "person")
            let localTombstones = exportTombstones(from: context)

            // 3. Merge
            let mergedTasks = MergeEngine.mergeTasks(
                local: localTasks,
                cloud: cloudPayload.tasks,
                tombstones: MergeEngine.mergeTombstones(
                    local: localTombstones.tasks,
                    cloud: cloudPayload.deletedTaskTombstones
                )
            )
            let mergedAreas = MergeEngine.mergeEntities(
                local: localAreas, cloud: cloudPayload.areas,
                tombstones: cloudPayload.deletedEntityTombstones["taskCategories"] ?? [:]
            )
            // ... same pattern for categories, labels, people, perspectives

            // 4. Import merged state back to local
            importTasks(mergedTasks, into: context)
            try context.save()

            // 5. Build payload
            sequence += 1
            var payload = cloudPayload  // Start from cloud (preserves passthrough)
            payload.tasks = mergedTasks
            payload.areas = mergedAreas
            payload.sequence = sequence
            payload.lastUpdated = ISO8601DateFormatter().string(from: Date())

            // 6. Encode and push
            let encoded = try PayloadCoder.encode(payload)
            _ = try await api.putFile(path: "data.json", content: encoded, sha: file.sha, message: "iOS sync")

            // 7. Success
            clearDirty()
            lastError = nil
        } catch GitHubAPIError.conflict {
            // Retry on conflict
            lastError = "Conflict — retrying"
            await retryWithBackoff()
        } catch GitHubAPIError.rateLimited {
            lastError = "Rate limited — pausing 60s"
            try? await Task.sleep(for: .seconds(60))
        } catch {
            lastError = error.localizedDescription
        }
    }

    // MARK: - Pull (fetch cloud into local)

    @MainActor
    func pull() async {
        guard let api else { return }
        isSyncing = true
        defer { isSyncing = false }

        do {
            let file = try await api.fetchFile(path: "data.json")
            let cloudPayload = try PayloadCoder.decode(file.content)

            let context = ModelContext(container)
            let localTasks = exportTasks(from: context)

            let mergedTasks = MergeEngine.mergeTasks(
                local: localTasks,
                cloud: cloudPayload.tasks,
                tombstones: cloudPayload.deletedTaskTombstones
            )
            importTasks(mergedTasks, into: context)
            // ... same for entities
            try context.save()
        } catch {
            lastError = error.localizedDescription
        }
    }

    // MARK: - Export/Import helpers

    func exportTasks(from context: ModelContext) -> [TaskDTO] {
        let descriptor = FetchDescriptor<HBTask>()
        let tasks = (try? context.fetch(descriptor)) ?? []
        return tasks.map { $0.toDTO() }
    }

    func importTasks(_ dtos: [TaskDTO], into context: ModelContext) {
        // Delete all existing, re-insert merged set
        // (Simple approach for v1 — revisit if performance matters)
        let descriptor = FetchDescriptor<HBTask>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for task in existing { context.delete(task) }
        for dto in dtos {
            context.insert(HBTask.from(dto: dto))
        }
    }

    private func retryWithBackoff(attempt: Int = 0) async {
        guard attempt < 6 else { return }
        let delay = min(pow(2.0, Double(attempt)), 60.0)
        try? await Task.sleep(for: .seconds(delay))
        await push()
    }

    // Placeholder — fill in for entities
    private func exportEntities<T: PersistentModel>(_ type: T.Type, from context: ModelContext, prefix: String) -> [EntityDTO] { [] }
    private func exportTombstones(from context: ModelContext) -> (tasks: [String: String], entities: [String: [String: String]]) { ([:], [:]) }
}
```

Add DTO conversion extensions on HBTask:

```swift
extension HBTask {
    func toDTO() -> TaskDTO {
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return TaskDTO(
            id: id,
            title: title,
            notes: notes,
            status: status,
            today: today,
            flagged: flagged,
            completed: completed,
            completedAt: completedAt.map { isoFormatter.string(from: $0) },
            areaId: areaId,
            categoryId: categoryId,
            labels: labels,
            people: people,
            deferDate: deferDate.map { isoFormatter.string(from: $0) },
            dueDate: dueDate.map { isoFormatter.string(from: $0) },
            isNote: isNote,
            noteLifecycleState: noteLifecycleState,
            parentId: parentId,
            indent: indent,
            order: order,
            isProject: isProject,
            projectId: projectId,
            projectType: projectType,
            timeEstimate: timeEstimate,
            meetingEventKey: meetingEventKey,
            createdAt: isoFormatter.string(from: createdAt),
            updatedAt: isoFormatter.string(from: updatedAt)
        )
    }

    static func from(dto: TaskDTO) -> HBTask {
        let task = HBTask(title: dto.title, status: dto.status ?? "inbox", isNote: dto.isNote ?? false)
        task.id = dto.id
        // Map all fields from DTO...
        return task
    }
}
```

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add SyncEngine with push/pull, debounce, retry"
```

---

## Task 10: Theme — Things 3 Color Palette

**Files:**
- Create: `ios/Homebase/Homebase/Shared/Theme.swift`

**Step 1: Implement theme constants**

```swift
import SwiftUI

enum HBTheme {
    // Things 3-inspired palette
    static let background = Color(hex: "#FFFFFF")
    static let secondaryBackground = Color(hex: "#F5F5F5")
    static let sidebar = Color(hex: "#F0EFF4")

    static let textPrimary = Color(hex: "#262626")
    static let textSecondary = Color(hex: "#808080")
    static let textTertiary = Color(hex: "#B0B0B0")

    static let accent = Color(hex: "#007AFF")        // Things blue
    static let today = Color(hex: "#FFD426")          // Things yellow star
    static let flagged = Color(hex: "#FF9503")         // Orange flag

    static let inbox = Color(hex: "#307BF6")
    static let anytime = Color(hex: "#6EC8FA")
    static let someday = Color(hex: "#C3A978")
    static let logbook = Color(hex: "#7DC67B")
    static let upcoming = Color(hex: "#EA4E3D")

    static let separator = Color(hex: "#E5E5EA")
    static let checkboxBorder = Color(hex: "#C7C7CC")
    static let checkboxFill = Color(hex: "#007AFF")

    // Typography
    static let titleFont = Font.system(.body, weight: .regular)
    static let subtitleFont = Font.system(.footnote, weight: .regular)
    static let headerFont = Font.system(.title3, weight: .semibold)
    static let badgeFont = Font.system(.caption2, weight: .medium)
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: .init(charactersIn: "#"))
        let scanner = Scanner(string: hex)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255,
            green: Double((rgb >> 8) & 0xFF) / 255,
            blue: Double(rgb & 0xFF) / 255
        )
    }
}
```

**Step 2: Build to verify**

**Step 3: Commit**

```bash
git commit -m "feat(ios): add Things 3-inspired theme constants"
```

---

## Task 11: Navigation — Router + Sidebar

**Files:**
- Create: `ios/Homebase/Homebase/Navigation/NavigationRouter.swift`
- Create: `ios/Homebase/Homebase/Navigation/SidebarView.swift`
- Create: `ios/Homebase/Homebase/Navigation/PerspectiveRow.swift`
- Modify: `ios/Homebase/Homebase/ContentView.swift`

**Step 1: Implement NavigationRouter**

```swift
import SwiftUI

enum PerspectiveType: String, CaseIterable, Identifiable {
    case inbox, today, flagged, anytime, someday, upcoming, logbook, notes

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .inbox: "Inbox"
        case .today: "Today"
        case .flagged: "Flagged"
        case .anytime: "Anytime"
        case .someday: "Someday"
        case .upcoming: "Upcoming"
        case .logbook: "Logbook"
        case .notes: "Notes"
        }
    }

    var icon: String {
        switch self {
        case .inbox: "tray"
        case .today: "star.fill"
        case .flagged: "flag.fill"
        case .anytime: "square.stack"
        case .someday: "archivebox"
        case .upcoming: "calendar"
        case .logbook: "book.closed"
        case .notes: "doc.text"
        }
    }

    var color: Color {
        switch self {
        case .inbox: HBTheme.inbox
        case .today: HBTheme.today
        case .flagged: HBTheme.flagged
        case .anytime: HBTheme.anytime
        case .someday: HBTheme.someday
        case .upcoming: HBTheme.upcoming
        case .logbook: HBTheme.logbook
        case .notes: HBTheme.accent
        }
    }
}

@Observable
class NavigationRouter {
    var selectedPerspective: PerspectiveType? = .inbox
    var selectedTaskID: String?
    var presentedSheet: SheetType?
    var noteBreadcrumb: [String] = []

    enum SheetType: Identifiable {
        case taskEditor(String?)  // task ID or nil for new
        case noteEditor(String?)
        case entityEditor(EntityEditorType)

        var id: String {
            switch self {
            case .taskEditor(let id): "task-\(id ?? "new")"
            case .noteEditor(let id): "note-\(id ?? "new")"
            case .entityEditor(let type): "entity-\(type)"
            }
        }
    }

    enum EntityEditorType: String {
        case area, category, label, person
    }
}
```

**Step 2: Implement SidebarView**

```swift
import SwiftUI
import SwiftData

struct SidebarView: View {
    @Bindable var router: NavigationRouter
    @Query private var tasks: [HBTask]

    var body: some View {
        List(selection: $router.selectedPerspective) {
            Section {
                ForEach(PerspectiveType.allCases) { perspective in
                    PerspectiveRow(
                        perspective: perspective,
                        count: badgeCount(for: perspective)
                    )
                    .tag(perspective)
                }
            }
        }
        .listStyle(.sidebar)
        .navigationTitle("Homebase")
    }

    private func badgeCount(for perspective: PerspectiveType) -> Int {
        // Simplified counts — TaskFilterEngine handles real logic
        switch perspective {
        case .inbox:
            tasks.filter { !$0.isNote && !$0.completed && $0.status == "inbox" }.count
        case .today:
            tasks.filter { !$0.isNote && !$0.completed && $0.today }.count
        case .flagged:
            tasks.filter { !$0.isNote && !$0.completed && $0.flagged }.count
        default: 0
        }
    }
}
```

**Step 3: Implement PerspectiveRow**

```swift
import SwiftUI

struct PerspectiveRow: View {
    let perspective: PerspectiveType
    let count: Int

    var body: some View {
        HStack {
            Image(systemName: perspective.icon)
                .foregroundStyle(perspective.color)
                .frame(width: 28)
            Text(perspective.displayName)
                .font(HBTheme.titleFont)
            Spacer()
            if count > 0 {
                Text("\(count)")
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
    }
}
```

**Step 4: Update ContentView as the root navigation**

```swift
import SwiftUI

struct ContentView: View {
    @State private var router = NavigationRouter()

    var body: some View {
        NavigationSplitView {
            SidebarView(router: router)
        } detail: {
            if let perspective = router.selectedPerspective {
                if perspective == .notes {
                    Text("Notes Outliner — Task 14")
                } else {
                    Text("Task List for \(perspective.displayName) — Task 12")
                }
            } else {
                Text("Select a perspective")
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
    }
}
```

**Step 5: Build and run in simulator to verify sidebar navigation works**

**Step 6: Commit**

```bash
git commit -m "feat(ios): add navigation router, sidebar, perspective rows"
```

---

## Task 12: TaskFilterEngine — Perspective Predicates

**Files:**
- Create: `ios/Homebase/Homebase/Features/Tasks/TaskFilterEngine.swift`
- Create: `ios/Homebase/HomebaseTests/Features/TaskFilterEngineTests.swift`

**Step 1: Write tests**

```swift
import XCTest
@testable import Homebase

final class TaskFilterEngineTests: XCTestCase {

    func testInboxFilter() {
        let inboxTask = makeTask(status: "inbox", categoryId: nil)
        let categorized = makeTask(status: "inbox", categoryId: "cat_1")
        let anytime = makeTask(status: "anytime")

        let result = TaskFilterEngine.filter([inboxTask, categorized, anytime], for: .inbox)
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].id, inboxTask.id)
    }

    func testTodayFilter() {
        let todayTask = makeTask(today: true)
        let overdue = makeTask(dueDate: Calendar.current.date(byAdding: .day, value: -1, to: Date()))
        let future = makeTask(dueDate: Calendar.current.date(byAdding: .day, value: 5, to: Date()))
        let normal = makeTask()

        let result = TaskFilterEngine.filter([todayTask, overdue, future, normal], for: .today)
        XCTAssertEqual(result.count, 2) // todayTask + overdue
    }

    func testLogbookFilter() {
        let completed = makeTask(completed: true)
        let active = makeTask()
        let result = TaskFilterEngine.filter([completed, active], for: .logbook)
        XCTAssertEqual(result.count, 1)
        XCTAssertTrue(result[0].completed)
    }

    func testExcludesNotes() {
        let note = makeTask(isNote: true)
        let task = makeTask(status: "inbox")
        let result = TaskFilterEngine.filter([note, task], for: .inbox)
        XCTAssertEqual(result.count, 1)
        XCTAssertFalse(result[0].isNote)
    }

    // Helper
    private func makeTask(
        status: String = "anytime",
        categoryId: String? = nil,
        today: Bool = false,
        flagged: Bool = false,
        completed: Bool = false,
        dueDate: Date? = nil,
        deferDate: Date? = nil,
        isNote: Bool = false
    ) -> HBTask {
        let t = HBTask(title: "Test", status: status, isNote: isNote)
        t.categoryId = categoryId
        t.today = today
        t.flagged = flagged
        if completed { t.markCompleted() }
        t.dueDate = dueDate
        t.deferDate = deferDate
        return t
    }
}
```

**Step 2: Run tests — expect failure**

**Step 3: Implement TaskFilterEngine**

```swift
import Foundation

enum TaskFilterEngine {
    static func filter(_ tasks: [HBTask], for perspective: PerspectiveType) -> [HBTask] {
        let now = Date()
        let todayEnd = Calendar.current.startOfDay(for: now).addingTimeInterval(86400)

        return tasks.filter { task in
            // Notes never appear in task perspectives
            guard !task.isNote else { return false }

            switch perspective {
            case .inbox:
                return !task.completed && task.status == "inbox" && task.categoryId == nil
            case .today:
                guard !task.completed else { return false }
                if task.today { return true }
                if let due = task.dueDate, due <= todayEnd { return true }
                if isNextTagged(task) { return true }
                return false
            case .flagged:
                return !task.completed && task.flagged
            case .anytime:
                guard !task.completed && task.status == "anytime" else { return false }
                if let defer_ = task.deferDate, defer_ > now { return false }
                if let due = task.dueDate, due > todayEnd { return false }
                return true
            case .someday:
                return !task.completed && task.status == "someday"
            case .upcoming:
                guard !task.completed else { return false }
                if let due = task.dueDate, due > todayEnd { return true }
                if let defer_ = task.deferDate, defer_ > now { return true }
                return false
            case .logbook:
                return task.completed
            case .notes:
                return false // Notes handled separately
            }
        }
    }

    private static func isNextTagged(_ task: HBTask) -> Bool {
        // "next" label is case-insensitive match
        // In practice, we'd look up label names — for now check IDs
        // This will be refined when entity lookups are wired up
        false
    }
}
```

**Step 4: Run tests — all pass**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add TaskFilterEngine with all perspective predicates"
```

---

## Task 13: Task List + Row + Detail Views

**Files:**
- Create: `ios/Homebase/Homebase/Features/Tasks/TaskListView.swift`
- Create: `ios/Homebase/Homebase/Features/Tasks/TaskRowView.swift`
- Create: `ios/Homebase/Homebase/Features/Tasks/TaskDetailView.swift`
- Modify: `ios/Homebase/Homebase/ContentView.swift` (wire up detail)

**Step 1: Implement TaskListView**

```swift
import SwiftUI
import SwiftData

struct TaskListView: View {
    let perspective: PerspectiveType
    @Query private var allTasks: [HBTask]
    @Bindable var router: NavigationRouter
    @Environment(\.modelContext) private var context

    private var filteredTasks: [HBTask] {
        TaskFilterEngine.filter(allTasks, for: perspective)
            .sorted { $0.order < $1.order }
    }

    var body: some View {
        List {
            ForEach(filteredTasks, id: \.id) { task in
                TaskRowView(task: task)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        router.presentedSheet = .taskEditor(task.id)
                    }
                    .swipeActions(edge: .leading) {
                        Button {
                            task.markCompleted()
                            task.touch()
                        } label: {
                            Label("Complete", systemImage: "checkmark")
                        }
                        .tint(HBTheme.logbook)
                    }
                    .swipeActions(edge: .trailing) {
                        Button {
                            task.flagged.toggle()
                            task.touch()
                        } label: {
                            Label("Flag", systemImage: "flag.fill")
                        }
                        .tint(HBTheme.flagged)
                    }
            }
        }
        .listStyle(.plain)
        .navigationTitle(perspective.displayName)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    router.presentedSheet = .taskEditor(nil)
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(item: $router.presentedSheet) { sheet in
            if case .taskEditor(let id) = sheet {
                TaskDetailView(taskId: id, context: context)
            }
        }
    }
}
```

**Step 2: Implement TaskRowView**

```swift
import SwiftUI

struct TaskRowView: View {
    let task: HBTask

    var body: some View {
        HStack(spacing: 12) {
            // Circular checkbox
            Button {
                if task.completed {
                    task.markIncomplete()
                } else {
                    task.markCompleted()
                }
            } label: {
                Circle()
                    .strokeBorder(task.completed ? HBTheme.checkboxFill : HBTheme.checkboxBorder, lineWidth: 1.5)
                    .background(Circle().fill(task.completed ? HBTheme.checkboxFill : .clear))
                    .frame(width: 22, height: 22)
                    .overlay {
                        if task.completed {
                            Image(systemName: "checkmark")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundStyle(.white)
                        }
                    }
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(HBTheme.titleFont)
                    .foregroundStyle(task.completed ? HBTheme.textTertiary : HBTheme.textPrimary)
                    .strikethrough(task.completed)

                HStack(spacing: 6) {
                    if task.today {
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(HBTheme.today)
                    }
                    if task.flagged {
                        Image(systemName: "flag.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(HBTheme.flagged)
                    }
                    if let due = task.dueDate {
                        Text(due, style: .date)
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(due < Date() ? .red : HBTheme.textSecondary)
                    }
                }
            }

            Spacer()
        }
        .padding(.vertical, 4)
    }
}
```

**Step 3: Implement TaskDetailView (modal editor sheet)**

```swift
import SwiftUI
import SwiftData

struct TaskDetailView: View {
    let taskId: String?
    let context: ModelContext
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var notes = ""
    @State private var status = "inbox"
    @State private var today = false
    @State private var flagged = false
    @State private var dueDate: Date?
    @State private var deferDate: Date?
    @State private var showDuePicker = false
    @State private var showDeferPicker = false

    private var existingTask: HBTask? {
        guard let taskId else { return nil }
        let descriptor = FetchDescriptor<HBTask>(predicate: #Predicate { $0.id == taskId })
        return try? context.fetch(descriptor).first
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Title", text: $title)
                        .font(.title3)
                    TextField("Notes", text: $notes, axis: .vertical)
                        .lineLimit(3...10)
                }

                Section("Status") {
                    Picker("Status", selection: $status) {
                        Text("Inbox").tag("inbox")
                        Text("Anytime").tag("anytime")
                        Text("Someday").tag("someday")
                    }
                    Toggle("Today", isOn: $today)
                    Toggle("Flagged", isOn: $flagged)
                }

                Section("Dates") {
                    DatePickerRow(label: "Due", date: $dueDate, isExpanded: $showDuePicker)
                    DatePickerRow(label: "Defer", date: $deferDate, isExpanded: $showDeferPicker)
                }
            }
            .navigationTitle(taskId == nil ? "New Task" : "Edit Task")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save(); dismiss() }
                        .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
            .onAppear { loadExisting() }
        }
    }

    private func loadExisting() {
        guard let task = existingTask else { return }
        title = task.title
        notes = task.notes
        status = task.status
        today = task.today
        flagged = task.flagged
        dueDate = task.dueDate
        deferDate = task.deferDate
    }

    private func save() {
        if let task = existingTask {
            task.title = title
            task.notes = notes
            task.status = status
            task.today = today
            task.flagged = flagged
            task.dueDate = dueDate
            task.deferDate = deferDate
            task.touch()
        } else {
            let task = HBTask(title: title, status: status)
            task.notes = notes
            task.today = today
            task.flagged = flagged
            task.dueDate = dueDate
            task.deferDate = deferDate
            context.insert(task)
        }
        // SyncEngine.markDirty() called via observation
    }
}

struct DatePickerRow: View {
    let label: String
    @Binding var date: Date?
    @Binding var isExpanded: Bool

    var body: some View {
        VStack {
            HStack {
                Text(label)
                Spacer()
                if let date {
                    Text(date, style: .date)
                        .foregroundStyle(HBTheme.accent)
                }
                Button(date == nil ? "Add" : "Remove") {
                    if date == nil { date = Date(); isExpanded = true }
                    else { date = nil; isExpanded = false }
                }
                .font(.caption)
            }
            if isExpanded, date != nil {
                DatePicker("", selection: Binding(get: { date ?? Date() }, set: { date = $0 }), displayedComponents: .date)
                    .datePickerStyle(.graphical)
            }
        }
    }
}
```

**Step 4: Wire up ContentView**

Replace the placeholder text in ContentView's detail column:

```swift
if perspective == .notes {
    Text("Notes — Task 14")
} else {
    TaskListView(perspective: perspective, router: router)
}
```

**Step 5: Build and run in simulator — verify task list, swipe actions, task editor sheet**

**Step 6: Commit**

```bash
git commit -m "feat(ios): add task list, row, and detail editor views"
```

---

## Task 14: Notes Outliner — Engine + View

**Files:**
- Create: `ios/Homebase/Homebase/Features/Notes/OutlinerEngine.swift`
- Create: `ios/Homebase/Homebase/Features/Notes/OutlinerView.swift`
- Create: `ios/Homebase/Homebase/Features/Notes/NoteRowView.swift`
- Create: `ios/Homebase/HomebaseTests/Features/OutlinerEngineTests.swift`

**Step 1: Write tests for OutlinerEngine**

```swift
import XCTest
@testable import Homebase

final class OutlinerEngineTests: XCTestCase {

    func testGetRootNotes() {
        let root = makeNote(parentId: nil, indent: 0, order: 0)
        let child = makeNote(parentId: root.id, indent: 1, order: 0)
        let result = OutlinerEngine.rootNotes(from: [root, child])
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].id, root.id)
    }

    func testGetChildren() {
        let parent = makeNote(parentId: nil, indent: 0, order: 0)
        let child1 = makeNote(parentId: parent.id, indent: 1, order: 0)
        let child2 = makeNote(parentId: parent.id, indent: 1, order: 1)
        let grandchild = makeNote(parentId: child1.id, indent: 2, order: 0)

        let children = OutlinerEngine.children(of: parent.id, in: [parent, child1, child2, grandchild])
        XCTAssertEqual(children.count, 2)
    }

    func testIndent() {
        var notes = [
            makeNote(parentId: nil, indent: 0, order: 0),
            makeNote(parentId: nil, indent: 0, order: 1),
        ]
        let target = notes[1]
        let sibling = notes[0]

        OutlinerEngine.indent(note: target, allNotes: &notes)
        XCTAssertEqual(target.parentId, sibling.id)
        XCTAssertEqual(target.indent, 1)
    }

    func testOutdent() {
        let parent = makeNote(parentId: nil, indent: 0, order: 0)
        var child = makeNote(parentId: parent.id, indent: 1, order: 0)
        var notes = [parent, child]

        OutlinerEngine.outdent(note: child, allNotes: &notes)
        XCTAssertNil(child.parentId)
        XCTAssertEqual(child.indent, 0)
    }

    private func makeNote(parentId: String?, indent: Int, order: Int) -> HBTask {
        let note = HBTask.createNote(title: "Note \(order)")
        note.parentId = parentId
        note.indent = indent
        note.order = order
        return note
    }
}
```

**Step 2: Run tests — expect failure**

**Step 3: Implement OutlinerEngine**

```swift
import Foundation

enum OutlinerEngine {
    static func rootNotes(from notes: [HBTask]) -> [HBTask] {
        notes.filter { $0.isNote && $0.noteLifecycleState == "active" && $0.parentId == nil }
            .sorted { $0.order < $1.order }
    }

    static func children(of parentId: String, in notes: [HBTask]) -> [HBTask] {
        notes.filter { $0.isNote && $0.noteLifecycleState == "active" && $0.parentId == parentId }
            .sorted { $0.order < $1.order }
    }

    static func indent(note: HBTask, allNotes: inout [HBTask]) {
        // Find the sibling directly above (same parent, lower order)
        let siblings = allNotes.filter { $0.parentId == note.parentId && $0.id != note.id && $0.order < note.order }
            .sorted { $0.order < $1.order }
        guard let newParent = siblings.last else { return } // Can't indent if no sibling above

        note.parentId = newParent.id
        note.indent += 1
        note.order = children(of: newParent.id, in: allNotes).count
        note.touch()
    }

    static func outdent(note: HBTask, allNotes: inout [HBTask]) {
        guard let currentParentId = note.parentId else { return } // Already root
        let parent = allNotes.first { $0.id == currentParentId }

        note.parentId = parent?.parentId
        note.indent = max(0, note.indent - 1)
        note.touch()
    }

    static func reorder(note: HBTask, to newOrder: Int, in allNotes: inout [HBTask]) {
        let siblings = allNotes.filter { $0.parentId == note.parentId && $0.id != note.id }
            .sorted { $0.order < $1.order }
        note.order = newOrder
        // Reindex siblings
        for (i, sibling) in siblings.enumerated() {
            let idx = i >= newOrder ? i + 1 : i
            sibling.order = idx
        }
        note.touch()
    }

    static func deleteNote(_ note: HBTask, allNotes: inout [HBTask]) {
        note.noteLifecycleState = "deleted"
        note.touch()
        // Recursively soft-delete children
        let kids = children(of: note.id, in: allNotes)
        for kid in kids {
            deleteNote(kid, allNotes: &allNotes)
        }
    }
}
```

**Step 4: Implement OutlinerView + NoteRowView**

```swift
import SwiftUI
import SwiftData

struct OutlinerView: View {
    @Query(filter: #Predicate<HBTask> { $0.isNote && $0.noteLifecycleState == "active" })
    private var allNotes: [HBTask]

    @State private var breadcrumb: [String] = [] // Stack of parent IDs
    @Environment(\.modelContext) private var context

    private var currentParentId: String? { breadcrumb.last }

    private var visibleNotes: [HBTask] {
        if let parentId = currentParentId {
            return OutlinerEngine.children(of: parentId, in: allNotes)
        }
        return OutlinerEngine.rootNotes(from: allNotes)
    }

    var body: some View {
        List {
            ForEach(visibleNotes, id: \.id) { note in
                NoteRowView(
                    note: note,
                    childCount: OutlinerEngine.children(of: note.id, in: allNotes).count,
                    onZoomIn: { breadcrumb.append(note.id) }
                )
                .swipeActions(edge: .leading) {
                    Button { indentNote(note) } label: { Label("Indent", systemImage: "arrow.right") }
                        .tint(.blue)
                }
                .swipeActions(edge: .trailing) {
                    Button { outdentNote(note) } label: { Label("Outdent", systemImage: "arrow.left") }
                        .tint(.orange)
                    Button(role: .destructive) { deleteNote(note) } label: { Label("Delete", systemImage: "trash") }
                }
            }
        }
        .listStyle(.plain)
        .navigationTitle(currentTitle)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button { addNote() } label: { Image(systemName: "plus") }
            }
            if !breadcrumb.isEmpty {
                ToolbarItem(placement: .navigation) {
                    Button { breadcrumb.removeLast() } label: {
                        Image(systemName: "chevron.left")
                    }
                }
            }
        }
    }

    private var currentTitle: String {
        if let parentId = currentParentId,
           let parent = allNotes.first(where: { $0.id == parentId }) {
            return parent.title
        }
        return "Notes"
    }

    private func addNote() {
        let note = HBTask.createNote(title: "")
        note.parentId = currentParentId
        note.indent = breadcrumb.count
        note.order = visibleNotes.count
        context.insert(note)
    }

    private func indentNote(_ note: HBTask) {
        var notes = allNotes
        OutlinerEngine.indent(note: note, allNotes: &notes)
    }

    private func outdentNote(_ note: HBTask) {
        var notes = allNotes
        OutlinerEngine.outdent(note: note, allNotes: &notes)
    }

    private func deleteNote(_ note: HBTask) {
        var notes = allNotes
        OutlinerEngine.deleteNote(note, allNotes: &notes)
    }
}

struct NoteRowView: View {
    let note: HBTask
    let childCount: Int
    let onZoomIn: () -> Void
    @State private var isEditing = false
    @State private var editText = ""

    var body: some View {
        HStack(spacing: 8) {
            if childCount > 0 {
                Button(action: onZoomIn) {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12))
                        .foregroundStyle(HBTheme.textTertiary)
                }
                .buttonStyle(.plain)
            } else {
                Circle()
                    .fill(HBTheme.textTertiary)
                    .frame(width: 5, height: 5)
                    .padding(.horizontal, 4)
            }

            if isEditing {
                TextField("Note", text: $editText, onCommit: {
                    note.title = editText
                    note.touch()
                    isEditing = false
                })
                .font(HBTheme.titleFont)
            } else {
                Text(note.title.isEmpty ? "Untitled" : note.title)
                    .font(HBTheme.titleFont)
                    .foregroundStyle(note.title.isEmpty ? HBTheme.textTertiary : HBTheme.textPrimary)
                    .onTapGesture { editText = note.title; isEditing = true }
            }

            Spacer()

            if childCount > 0 {
                Text("\(childCount)")
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
        .padding(.leading, CGFloat(note.indent) * 16)
    }
}
```

**Step 5: Wire up in ContentView — replace notes placeholder**

**Step 6: Run tests, build, run in simulator**

**Step 7: Commit**

```bash
git commit -m "feat(ios): add notes outliner engine and views"
```

---

## Task 15: Entity CRUD Views

**Files:**
- Create: `ios/Homebase/Homebase/Features/Entities/EntityListView.swift`
- Create: `ios/Homebase/Homebase/Features/Entities/EntityEditorView.swift`

**Step 1: Implement generic EntityListView (used for areas, labels, people)**

```swift
import SwiftUI
import SwiftData

struct AreaListView: View {
    @Query(sort: \HBArea.order) private var areas: [HBArea]
    @Environment(\.modelContext) private var context
    @State private var showEditor = false

    var body: some View {
        List {
            ForEach(areas, id: \.id) { area in
                HStack {
                    Circle().fill(Color(hex: area.color)).frame(width: 12, height: 12)
                    Text(area.name)
                    Spacer()
                }
            }
            .onDelete { indexSet in
                for i in indexSet { context.delete(areas[i]) }
            }
        }
        .navigationTitle("Areas")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            AreaEditorView()
        }
    }
}
```

Follow the same pattern for LabelListView, PersonListView, CategoryListView. Each has:
- `@Query` to fetch entities sorted by `order`
- Swipe-to-delete
- "+" button to add
- Sheet editor for create/edit

**Step 2: Add entities section to SidebarView (below perspectives)**

```swift
Section("Manage") {
    NavigationLink { AreaListView() } label: {
        Label("Areas", systemImage: "folder")
    }
    NavigationLink { LabelListView() } label: {
        Label("Labels", systemImage: "tag")
    }
    NavigationLink { PersonListView() } label: {
        Label("People", systemImage: "person.2")
    }
}
```

**Step 3: Build and run in simulator**

**Step 4: Commit**

```bash
git commit -m "feat(ios): add entity CRUD views for areas, labels, people"
```

---

## Task 16: Settings — GitHub Token + Sync Status

**Files:**
- Create: `ios/Homebase/Homebase/Features/Settings/SettingsView.swift`
- Create: `ios/Homebase/Homebase/Shared/KeychainHelper.swift`

**Step 1: Implement KeychainHelper**

```swift
import Foundation
import Security

enum KeychainHelper {
    static func save(key: String, value: String) {
        let data = value.data(using: .utf8)!
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    static func load(key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: AnyObject?
        SecItemCopyMatching(query as CFDictionary, &result)
        guard let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    static func delete(key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        SecItemDelete(query as CFDictionary)
    }
}
```

**Step 2: Implement SettingsView**

```swift
import SwiftUI

struct SettingsView: View {
    @State private var token = ""
    @State private var owner = UserDefaults.standard.string(forKey: "githubOwner") ?? ""
    @State private var repo = UserDefaults.standard.string(forKey: "githubRepo") ?? ""
    @State private var showToken = false

    var body: some View {
        Form {
            Section("GitHub Sync") {
                HStack {
                    if showToken {
                        TextField("Personal Access Token", text: $token)
                    } else {
                        SecureField("Personal Access Token", text: $token)
                    }
                    Button(showToken ? "Hide" : "Show") { showToken.toggle() }
                        .font(.caption)
                }
                TextField("Owner", text: $owner)
                    .autocapitalization(.none)
                TextField("Repository", text: $repo)
                    .autocapitalization(.none)

                Button("Save") {
                    KeychainHelper.save(key: "githubToken", value: token)
                    UserDefaults.standard.set(owner, forKey: "githubOwner")
                    UserDefaults.standard.set(repo, forKey: "githubRepo")
                }
                .disabled(token.isEmpty || owner.isEmpty || repo.isEmpty)
            }

            Section("Sync Status") {
                // Wire to SyncEngine.isSyncing, lastError, etc.
                Text("Status: idle")
                    .foregroundStyle(HBTheme.textSecondary)
            }

            Section("About") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0").foregroundStyle(HBTheme.textSecondary)
                }
            }
        }
        .navigationTitle("Settings")
        .onAppear {
            token = KeychainHelper.load(key: "githubToken") ?? ""
        }
    }
}
```

**Step 3: Add Settings to sidebar**

```swift
Section {
    NavigationLink { SettingsView() } label: {
        Label("Settings", systemImage: "gear")
    }
}
```

**Step 4: Build and run**

**Step 5: Commit**

```bash
git commit -m "feat(ios): add settings view with GitHub token keychain storage"
```

---

## Task 17: Wire SyncEngine into App Lifecycle

**Files:**
- Modify: `ios/Homebase/Homebase/HomebaseApp.swift`
- Create: `ios/Homebase/Homebase/Sync/SyncCoordinator.swift`

**Step 1: Implement SyncCoordinator (bridges app lifecycle to SyncEngine)**

```swift
import SwiftUI
import SwiftData

@Observable
final class SyncCoordinator {
    let engine: SyncEngine
    private var lifecycleObservers: [Any] = []

    init(container: ModelContainer) {
        let token = KeychainHelper.load(key: "githubToken")
        let owner = UserDefaults.standard.string(forKey: "githubOwner") ?? ""
        let repo = UserDefaults.standard.string(forKey: "githubRepo") ?? ""

        let api: GitHubAPI? = token.flatMap { t in
            guard !owner.isEmpty, !repo.isEmpty else { return nil }
            return GitHubAPI(token: t, owner: owner, repo: repo)
        }
        self.engine = SyncEngine(container: container, api: api)
        setupLifecycleObservers()
    }

    private func setupLifecycleObservers() {
        // Pull on foreground
        let fg = NotificationCenter.default.addObserver(
            forName: UIApplication.willEnterForegroundNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            Task { await self?.engine.pull() }
        }
        // Push on background
        let bg = NotificationCenter.default.addObserver(
            forName: UIApplication.didEnterBackgroundNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            Task { await self?.engine.push() }
        }
        lifecycleObservers = [fg, bg]
    }

    func initialSync() {
        Task {
            if engine.isDirty {
                await engine.push()
            } else {
                await engine.pull()
            }
        }
    }
}
```

**Step 2: Inject into HomebaseApp**

```swift
@main
struct HomebaseApp: App {
    let container: ModelContainer
    @State private var syncCoordinator: SyncCoordinator

    init() {
        let schema = Schema([HBTask.self, HBArea.self, HBCategory.self, HBLabel.self, HBPerson.self, HBPerspective.self, HBTombstone.self])
        let config = ModelConfiguration("Homebase", isStoredInMemoryOnly: false)
        let c = try! ModelContainer(for: schema, configurations: [config])
        self.container = c
        self._syncCoordinator = State(initialValue: SyncCoordinator(container: c))
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(syncCoordinator)
                .onAppear { syncCoordinator.initialSync() }
        }
        .modelContainer(container)
    }
}
```

**Step 3: Add markDirty() calls after mutations in TaskDetailView and OutlinerView**

After every save/mutation, call:
```swift
@Environment(SyncCoordinator.self) private var sync
// After mutation:
sync.engine.markDirty()
```

**Step 4: Build, run, verify sync triggers on app lifecycle events**

**Step 5: Commit**

```bash
git commit -m "feat(ios): wire SyncEngine into app lifecycle with SyncCoordinator"
```

---

## Task 18: TestFlight Build + Distribution

**Step 1: Configure App Store Connect**

- Log in to App Store Connect
- My Apps → "+" → New App
- Platform: iOS
- Name: Homebase
- Primary Language: English
- Bundle ID: select the one from Xcode
- SKU: `homebase-ios-v1`

**Step 2: Configure Xcode for archiving**

- Select "Any iOS Device (arm64)" as build target
- Product → Archive
- When archive completes, click "Distribute App"
- Select "App Store Connect" → "Upload"
- Follow prompts (automatic signing recommended)

**Step 3: Set up TestFlight**

- In App Store Connect → TestFlight → Internal Testing
- Create a group "Me"
- Add yourself as a tester
- The uploaded build should appear within ~15 minutes
- Accept the invite email on your iPhone
- Install via TestFlight app

**Step 4: Verify on device**

- Open app
- Go to Settings, enter GitHub token/owner/repo
- Verify sync pulls existing tasks from web app
- Create a task, verify it syncs to data.json
- Check the web app reflects the new task

**Step 5: Commit any final tweaks**

```bash
git commit -m "feat(ios): v1.0.0 ready for TestFlight"
```

---

## Summary: Task Dependencies

```
Task 1 (scaffold) → Task 2 (HBTask) → Task 3 (entities) → Task 4 (perspective/tombstone)
                                                                    ↓
Task 5 (register models) ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
    ↓
Task 6 (PayloadCoder) → Task 7 (GitHubAPI) → Task 8 (MergeEngine) → Task 9 (SyncEngine)
    ↓                                                                        ↓
Task 10 (Theme) → Task 11 (Navigation) → Task 12 (FilterEngine)     Task 17 (Lifecycle)
                                              ↓
                  Task 13 (Task views) → Task 14 (Outliner) → Task 15 (Entities) → Task 16 (Settings)
                                                                                        ↓
                                                                                  Task 18 (TestFlight)
```

Tasks 6-9 (sync) and Tasks 10-12 (UI foundation) can run in parallel.
