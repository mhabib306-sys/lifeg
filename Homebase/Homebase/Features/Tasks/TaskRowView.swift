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

                // Things 3-style metadata: colored dots for labels, compact dates
                if !isEditing && !task.completed {
                    let cache = sync.entityCache
                    HStack(spacing: 5) {
                        if let areaId = task.areaId, let area = cache.areas[areaId] {
                            Text(area.name)
                                .font(HBTheme.subtitleFont)
                                .foregroundStyle(HBTheme.textTertiary)
                        }

                        ForEach(Array(task.labels.prefix(3)), id: \.self) { labelId in
                            if let label = cache.labels[labelId] {
                                Circle()
                                    .fill(Color(hex: label.color))
                                    .frame(width: 8, height: 8)
                            }
                        }

                        if task.flagged {
                            Image(systemName: "flag.fill")
                                .font(.system(size: 10))
                                .foregroundStyle(HBTheme.flagged)
                        }

                        if let due = task.dueDate {
                            Text(formatCompactDate(due))
                                .font(HBTheme.subtitleFont)
                                .foregroundStyle(due < Date() ? .red : HBTheme.textSecondary)
                        }

                        ForEach(Array(task.people.prefix(2)), id: \.self) { personId in
                            if let person = cache.people[personId] {
                                Text("@\(person.name)")
                                    .font(HBTheme.subtitleFont)
                                    .foregroundStyle(HBTheme.textTertiary)
                                    .lineLimit(1)
                            }
                        }
                    }
                    .transition(.opacity.combined(with: .move(edge: .top)))
                    .contentShape(Rectangle())
                    .onTapGesture { onStartEditing?() }
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

    private func formatCompactDate(_ date: Date) -> String {
        let cal = Calendar.current
        if cal.isDateInToday(date) { return "Today" }
        if cal.isDateInTomorrow(date) { return "Tomorrow" }
        if cal.isDateInYesterday(date) { return "Yesterday" }
        let fmt = DateFormatter()
        fmt.dateFormat = "MMM d"
        return fmt.string(from: date)
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
