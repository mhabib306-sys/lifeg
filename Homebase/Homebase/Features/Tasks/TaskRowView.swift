import SwiftUI
import SwiftData

struct TaskRowView: View {
    let task: HBTask
    @Environment(\.modelContext) private var context

    var body: some View {
        HStack(spacing: 12) {
            // Circular checkbox
            Button {
                if task.completed {
                    task.markIncomplete()
                } else {
                    task.markCompleted()
                }
            } label: {
                Circle()
                    .strokeBorder(task.completed ? HBTheme.checkboxFill : HBTheme.checkboxBorder, lineWidth: 1.5)
                    .background(Circle().fill(task.completed ? HBTheme.checkboxFill : .clear))
                    .frame(width: 22, height: 22)
                    .overlay {
                        if task.completed {
                            Image(systemName: "checkmark")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundStyle(.white)
                        }
                    }
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(HBTheme.titleFont)
                    .foregroundStyle(task.completed ? HBTheme.textTertiary : HBTheme.textPrimary)
                    .strikethrough(task.completed)

                HStack(spacing: 6) {
                    if task.today {
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(HBTheme.today)
                    }
                    if task.flagged {
                        Image(systemName: "flag.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(HBTheme.flagged)
                    }
                    if let due = task.dueDate {
                        Text(due, style: .date)
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(due < Date() ? .red : HBTheme.textSecondary)
                    }
                }

                if let subtitle = EntityResolver.subtitle(for: task, in: context) {
                    Text(subtitle)
                        .font(HBTheme.subtitleFont)
                        .foregroundStyle(HBTheme.textTertiary)
                        .lineLimit(1)
                }
            }

            Spacer()
        }
        .padding(.vertical, 4)
    }
}
