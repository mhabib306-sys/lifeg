import SwiftUI

// MARK: - Step 8: Empty States

struct EmptyStateView: View {
    let icon: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 48, weight: .thin))
                .foregroundStyle(HBTheme.textTertiary)
            Text(title)
                .font(.system(.title3, weight: .medium))
                .foregroundStyle(HBTheme.textSecondary)
            Text(subtitle)
                .font(.footnote)
                .foregroundStyle(HBTheme.textTertiary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(40)
    }
}

extension PerspectiveType {
    var emptyIcon: String {
        switch self {
        case .inbox: "tray"
        case .today: "star"
        case .flagged: "flag"
        case .anytime: "square.stack"
        case .someday: "archivebox"
        case .upcoming: "calendar"
        case .logbook: "book.closed"
        case .notes: "doc.text"
        case .home: "house"
        }
    }

    var emptyTitle: String {
        switch self {
        case .inbox: "Inbox Zero"
        case .today: "Clear for Today"
        case .flagged: "No Flagged Tasks"
        case .anytime: "All Clear"
        case .someday: "Nothing Someday"
        case .upcoming: "Nothing Upcoming"
        case .logbook: "No Completed Tasks"
        case .notes: "No Notes"
        case .home: "Welcome"
        }
    }

    var emptySubtitle: String {
        switch self {
        case .inbox: "Your inbox is clear."
        case .today: "Nothing scheduled for today."
        case .flagged: "Flag tasks to see them here."
        case .anytime: "All tasks are done or scheduled."
        case .someday: "Add tasks you might do someday."
        case .upcoming: "No tasks with future dates."
        case .logbook: "Completed tasks appear here."
        case .notes: "Create notes to get started."
        case .home: "Your home base."
        }
    }
}
