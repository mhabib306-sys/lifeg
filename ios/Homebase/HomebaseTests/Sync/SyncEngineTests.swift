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
