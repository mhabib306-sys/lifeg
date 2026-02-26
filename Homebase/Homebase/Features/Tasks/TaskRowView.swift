import SwiftUI
import SwiftData

struct TaskRowView: View {
    let task: HBTask
    @Environment(SyncCoordinator.self) private var sync
    @State private var isEditing = false
    @State private var editText = ""
    @FocusState private var isFocused: Bool
    @State private var pendingCompletion = false

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            ThingsCheckbox(
                isCompleted: task.completed,
                accentColor: HBTheme.checkboxFill
            ) {
                toggleCompletion()
            }
            .padding(.top, 2)

            VStack(alignment: .leading, spacing: 2) {
                if isEditing {
                    TextField("Task title", text: $editText)
                        .font(HBTheme.titleFont)
                        .focused($isFocused)
                        .onSubmit {
                            task.title = editText
                            task.touch()
                            sync.engine.markDirty()
                            isEditing = false
                        }
                        .onChange(of: isFocused) { _, focused in
                            if !focused {
                                task.title = editText
                                task.touch()
                                sync.engine.markDirty()
                                isEditing = false
                            }
                        }
                } else {
                    Text(task.title)
                        .font(HBTheme.titleFont)
                        .foregroundStyle(task.completed ? HBTheme.textTertiary : HBTheme.textPrimary)
                        .strikethrough(task.completed, color: HBTheme.textTertiary.opacity(0.5))
                        .opacity(task.completed ? 0.6 : 1.0)
                }

                if !task.completed {
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
                            HStack(spacing: 2) {
                                Image(systemName: "calendar")
                                    .font(.system(size: 9))
                                Text(due, style: .date)
                                    .font(HBTheme.subtitleFont)
                            }
                            .foregroundStyle(due < Date() ? .red : HBTheme.textSecondary)
                        }
                        if let subtitle = sync.entityCache.subtitle(for: task) {
                            if task.today || task.flagged || task.dueDate != nil {
                                Text("·")
                                    .font(HBTheme.subtitleFont)
                                    .foregroundStyle(HBTheme.textTertiary)
                            }
                            Text(subtitle)
                                .font(HBTheme.subtitleFont)
                                .foregroundStyle(HBTheme.textTertiary)
                                .lineLimit(1)
                        }
                    }
                }
            }

            Spacer()
        }
        .padding(.vertical, 8)
    }

    private func toggleCompletion() {
        if task.completed {
            task.markIncomplete()
            sync.engine.markDirty()
        } else {
            pendingCompletion = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                    task.markCompleted()
                    sync.engine.markDirty()
                }
                Haptic.taskCompleted()
                pendingCompletion = false
            }
        }
    }

    func beginEditing() {
        editText = task.title
        isEditing = true
        isFocused = true
    }
}
