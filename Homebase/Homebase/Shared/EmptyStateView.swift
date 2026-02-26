import SwiftUI

// MARK: - Empty States (Things 3 style)

struct EmptyStateView: View {
    let icon: String
    let title: String
    let subtitle: String
    var color: Color = HBTheme.textTertiary

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 48, weight: .thin))
                .foregroundStyle(color.opacity(0.6))
            Text(title)
                .font(.system(.title3, weight: .medium))
                .foregroundStyle(HBTheme.textSecondary)
            if !subtitle.isEmpty {
                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(HBTheme.textTertiary)
                    .multilineTextAlignment(.center)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(40)
        .transition(.opacity.combined(with: .scale(scale: 0.95)))
    }
}

extension PerspectiveType {
    var emptyIcon: String {
        switch self {
        case .inbox: "tray.fill"
        case .today: "star.fill"
        case .flagged: "flag.fill"
        case .anytime: "square.stack.fill"
        case .someday: "archivebox.fill"
        case .upcoming: "calendar"
        case .logbook: "book.closed.fill"
        case .notes: "doc.text.fill"
        case .home: "house.fill"
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
        case .inbox: ""
        case .today: ""
        case .flagged: ""
        case .anytime: ""
        case .someday: ""
        case .upcoming: ""
        case .logbook: ""
        case .notes: "Create notes to get started."
        case .home: ""
        }
    }
}
