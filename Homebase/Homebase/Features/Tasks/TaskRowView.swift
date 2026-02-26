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
        HStack(alignment: .top, spacing: 12) {
            ThingsCheckbox(
                isCompleted: task.completed,
                accentColor: HBTheme.checkboxFill
            ) {
                toggleCompletion()
            }
            .padding(.top, 1)

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
                        }
                    }
                    .onDisappear { didSetup = false }
                } else {
                    Text(task.title)
                        .font(HBTheme.titleFont)
                        .foregroundStyle(task.completed ? HBTheme.textTertiary : HBTheme.textPrimary)
                        .strikethrough(task.completed, color: HBTheme.textTertiary)
                        .opacity(task.completed ? 0.4 : 1.0)
                        .contentShape(Rectangle())
                        .onTapGesture { onStartEditing?() }
                }

                // Things 3-style metadata: date, flag, colored dots, area, people
                if !isEditing && !task.completed {
                    let cache = sync.entityCache
                    HStack(spacing: 6) {
                        if let due = task.dueDate {
                            let isOverdue = Calendar.current.compare(due, to: Date(), toGranularity: .day) == .orderedAscending
                            Text(formatCompactDate(due))
                                .font(HBTheme.subtitleFont)
                                .foregroundStyle(isOverdue ? .red : HBTheme.textSecondary)
                        }

                        if task.flagged {
                            Image(systemName: "flag.fill")
                                .font(.system(size: 10))
                                .foregroundStyle(HBTheme.flagged)
                        }

                        ForEach(Array(task.labels.prefix(3)), id: \.self) { labelId in
                            if let label = cache.labels[labelId] {
                                Circle()
                                    .fill(Color(hex: label.color))
                                    .frame(width: 6, height: 6)
                            }
                        }

                        if let areaId = task.areaId, let area = cache.areas[areaId] {
                            Text(area.name)
                                .font(HBTheme.subtitleFont)
                                .foregroundStyle(HBTheme.textTertiary)
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
        .padding(.vertical, isEditing ? 14 : 10)
        .padding(.horizontal, isEditing ? 6 : 0)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(isEditing ? HBTheme.editingBackground : .clear)
        )
        .shadow(
            color: isEditing ? HBTheme.editingShadow : .clear,
            radius: isEditing ? 8 : 0,
            x: 0,
            y: isEditing ? 2 : 0
        )
        .animation(HBTheme.springDefault, value: isEditing)
    }

    private func toggleCompletion() {
        if task.completed {
            task.markIncomplete()
            sync.engine.markDirty()
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
        onEditCancel?()
    }
}
