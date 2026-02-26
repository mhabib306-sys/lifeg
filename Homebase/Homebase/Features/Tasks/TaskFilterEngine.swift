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
                // Tasks with inbox status (matches web app source-of-truth)
                return !task.completed && task.status == "inbox"
            case .today:
                // Tasks flagged as Today OR due today/overdue
                guard !task.completed else { return false }
                if task.today { return true }
                if let due = task.dueDate, due <= todayEnd { return true }
                return false
            case .flagged:
                return !task.completed && task.flagged
            case .anytime:
                // Available tasks: not completed, not someday, not deferred, not in upcoming
                guard !task.completed && task.status != "someday" else { return false }
                if let defer_ = task.deferDate, defer_ > now { return false }
                if let due = task.dueDate, due > todayEnd { return false }
                return true
            case .someday:
                return !task.completed && task.status == "someday"
            case .upcoming:
                // Tasks with future due dates or deferred
                guard !task.completed else { return false }
                if let due = task.dueDate, due > todayEnd { return true }
                if let defer_ = task.deferDate, defer_ > now { return true }
                return false
            case .logbook:
                return task.completed
            case .notes:
                return false // Notes handled separately
            case .home:
                return false // Home handled separately
            }
        }
    }
}
