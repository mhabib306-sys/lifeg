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
