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
