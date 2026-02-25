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
