import SwiftUI
import SwiftData

struct TaskRowView: View {
    let task: HBTask
    var isEditing: Bool = false
    var onStartEditing: (() -> Void)?
    var onEditDone: (() -> Void)?
    var onEditCancel: (() -> Void)?

    @Environment(SyncCoordinator.self) private var sync
    @State private var editText = ""
    @State private var editMetadata = TaskInlineMetadata()
    @State private var didSetup = false

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
                    InlineAutocompleteField(
                        text: $editText,
                        metadata: $editMetadata,
                        placeholder: "Task title",
                        onSubmit: { commitEdit() },
                        onBlur: { commitEdit() },
                        onCancel: { cancelEdit() }
                    )
                    .onAppear {
                        if !didSetup {
                            editText = task.title
                            editMetadata = TaskInlineMetadata(
                                areaId: task.areaId,
                                labels: task.labels,
                                people: task.people,
                                deferDate: task.deferDate,
                                dueDate: task.dueDate
                            )
                            didSetup = true
                            Haptic.editStart()
                        }
                    }
                    .onDisappear { didSetup = false }
                } else {
                    // Title text — tappable to enter edit mode
                    Text(task.title)
                        .font(HBTheme.titleFont)
                        .foregroundStyle(task.completed ? HBTheme.textTertiary : HBTheme.textPrimary)
                        .strikethrough(task.completed, color: HBTheme.textTertiary.opacity(0.5))
                        .opacity(task.completed ? 0.6 : 1.0)
                        .contentShape(Rectangle())
                        .onTapGesture { onStartEditing?() }
                }

                if !task.completed {
                    HStack(spacing: 6) {
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
                            if task.flagged || task.dueDate != nil {
                                Text("\u{00B7}")
                                    .font(HBTheme.subtitleFont)
                                    .foregroundStyle(HBTheme.textTertiary)
                            }
                            Text(subtitle)
                                .font(HBTheme.subtitleFont)
                                .foregroundStyle(HBTheme.textTertiary)
                                .lineLimit(1)
                        }
                    }
                    .transition(.opacity.combined(with: .move(edge: .top)))
                    // Subtitle row also tappable when not editing
                    .contentShape(Rectangle())
                    .onTapGesture {
                        if !isEditing { onStartEditing?() }
                    }
                }
            }

            Spacer()
        }
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(isEditing ? HBTheme.editingBackground : .clear)
        )
        .shadow(
            color: isEditing ? HBTheme.editingShadow : .clear,
            radius: isEditing ? 6 : 0,
            x: 0,
            y: isEditing ? 2 : 0
        )
        .animation(HBTheme.springDefault, value: isEditing)
    }

    private func toggleCompletion() {
        if task.completed {
            task.markIncomplete()
            sync.engine.markDirty()
            Haptic.checkboxTap()
        } else {
            Haptic.checkboxTap()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                withAnimation(HBTheme.springGentle) {
                    task.markCompleted()
                    sync.engine.markDirty()
                }
                Haptic.taskCompleted()
            }
        }
    }

    private func commitEdit() {
        let trimmed = editText.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty {
            task.title = trimmed
        }
        task.areaId = editMetadata.areaId
        task.labels = editMetadata.labels
        task.people = editMetadata.people
        task.deferDate = editMetadata.deferDate
        task.dueDate = editMetadata.dueDate
        if task.status != "someday" {
            task.status = task.areaId != nil ? "anytime" : "inbox"
        }
        task.touch()
        sync.engine.markDirty()
        Haptic.lightTap()
        onEditDone?()
    }

    private func cancelEdit() {
        editText = task.title
        editMetadata = TaskInlineMetadata(
            areaId: task.areaId,
            labels: task.labels,
            people: task.people,
            deferDate: task.deferDate,
            dueDate: task.dueDate
        )
        Haptic.editCancel()
        onEditCancel?()
    }
}
