import SwiftUI
import SwiftData

struct TaskRowView: View {
    let task: HBTask
    @Environment(EntityCache.self) private var entityCache
    @Environment(SyncCoordinator.self) private var sync
    @State private var isEditing = false
    @State private var editText = ""
    @FocusState private var isFocused: Bool
    @State private var pendingCompletion = false

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            // Step 3: ThingsCheckbox with 2pt top offset for baseline alignment
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

                // Step 4: Metadata hidden on completed tasks
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
                        // Entity subtitle inline with metadata
                        if let subtitle = entityCache.subtitle(for: task) {
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

    // Step 7: Completion animation with delay
    private func toggleCompletion() {
        if task.completed {
            // Uncomplete: immediate
            task.markIncomplete()
            sync.engine.markDirty()
        } else {
            // Complete: checkbox spring plays → 0.6s delay → animate out
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
