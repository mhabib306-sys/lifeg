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
