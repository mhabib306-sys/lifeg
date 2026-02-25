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
}
