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
