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
