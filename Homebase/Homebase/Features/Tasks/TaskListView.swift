import SwiftUI
import SwiftData

struct TaskListView: View {
    let perspective: PerspectiveType
    @Query private var allTasks: [HBTask]
    @Bindable var router: NavigationRouter
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var editMode: EditMode = .inactive
    @State private var editingTaskId: String?

    private var filteredTasks: [HBTask] {
        let filtered = TaskFilterEngine.filter(allTasks, for: perspective)
        if perspective == .logbook {
            return filtered.sorted { ($0.completedAt ?? .distantPast) > ($1.completedAt ?? .distantPast) }
        }
        return filtered.sorted { $0.order < $1.order }
    }

    var body: some View {
        Group {
            if filteredTasks.isEmpty {
                EmptyStateView(
                    icon: perspective.emptyIcon,
                    title: perspective.emptyTitle,
                    subtitle: perspective.emptySubtitle,
                    color: perspective.color
                )
                .transition(.opacity.combined(with: .scale(scale: 0.95)))
            } else {
                List {
                    ForEach(filteredTasks, id: \.id) { task in
                        TaskRowView(
                            task: task,
                            isEditing: editingTaskId == task.id,
                            onStartEditing: {
                                withAnimation(HBTheme.springDefault) {
                                    editingTaskId = task.id
                                }
                            },
                            onEditDone: {
                                withAnimation(HBTheme.springDefault) {
                                    if editingTaskId == task.id {
                                        editingTaskId = nil
                                    }
                                }
                            },
                            onEditCancel: {
                                withAnimation(HBTheme.springDefault) {
                                    if editingTaskId == task.id {
                                        editingTaskId = nil
                                    }
                                }
                            }
                        )
                        .swipeActions(edge: .leading) {
                            Button {
                                Haptic.checkboxTap()
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                                    withAnimation(HBTheme.springGentle) {
                                        task.markCompleted()
                                        sync.engine.markDirty()
                                    }
                                    Haptic.taskCompleted()
                                }
                            } label: {
                                Label("Complete", systemImage: "checkmark")
                            }
                            .tint(HBTheme.logbook)
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                context.insert(HBTombstone(collection: "tasks", entityId: task.id))
                                context.delete(task)
                                sync.engine.markDirty()
                            } label: {
                                Label("Delete", systemImage: "trash")
                            }

                            Button {
                                router.presentedSheet = .taskEditor(task.id)
                            } label: {
                                Label("Details", systemImage: "info.circle")
                            }
                            .tint(HBTheme.accent)

                            Button {
                                task.flagged.toggle()
                                task.touch()
                                sync.engine.markDirty()
                            } label: {
                                Label("Flag", systemImage: "flag.fill")
                            }
                            .tint(HBTheme.flagged)
                        }
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets(top: 0, leading: 16, bottom: 0, trailing: 16))
                    }
                    .onMove { source, destination in
                        withAnimation(HBTheme.springGentle) {
                            moveTask(from: source, to: destination)
                        }
                    }

                    QuickAddRow(perspective: perspective)
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets(top: 0, leading: 16, bottom: 0, trailing: 16))
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
                .scrollDismissesKeyboard(.interactively)
                .transition(.opacity)
                .animation(HBTheme.springGentle, value: filteredTasks.map(\.id))
            }
        }
        .animation(HBTheme.springDefault, value: filteredTasks.isEmpty)
        .navigationTitle(perspective.displayName)
        .environment(\.editMode, $editMode)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    router.presentedSheet = .taskEditor(nil)
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(item: $router.presentedSheet) { sheet in
            if case .taskEditor(let id) = sheet {
                TaskDetailView(taskId: id, context: context)
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
                    .presentationCornerRadius(20)
            }
        }
    }

    private func moveTask(from source: IndexSet, to destination: Int) {
        var tasks = filteredTasks
        tasks.move(fromOffsets: source, toOffset: destination)
        for (index, task) in tasks.enumerated() {
            task.order = index
            task.touch()
        }
        sync.engine.markDirty()
    }
}

// MARK: - Quick-Add Row

private struct QuickAddRow: View {
    let perspective: PerspectiveType
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var isActive = false
    @State private var text = ""
    @State private var metadata = TaskInlineMetadata()
    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            if isActive {
                Circle()
                    .strokeBorder(HBTheme.checkboxBorder, lineWidth: 1.5)
                    .frame(width: 22, height: 22)
                    .padding(.top, 1)

                InlineAutocompleteField(
                    text: $text,
                    metadata: $metadata,
                    placeholder: "New To-Do",
                    onSubmit: { submitTask() },
                    onBlur: {
                        if text.trimmingCharacters(in: .whitespaces).isEmpty && !hasMetadata {
                            withAnimation(HBTheme.springDefault) {
                                isActive = false
                            }
                        }
                    },
                    onCancel: {
                        withAnimation(HBTheme.springDefault) {
                            text = ""
                            metadata = TaskInlineMetadata()
                            isActive = false
                        }
                    }
                )
            } else {
                Button {
                    withAnimation(HBTheme.springDefault) {
                        isActive = true
                    }
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "plus")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(HBTheme.textTertiary)
                        Text("New To-Do")
                            .font(HBTheme.titleFont)
                            .foregroundStyle(HBTheme.textTertiary)
                    }
                }
                .buttonStyle(ThingsPressStyle())
            }

            Spacer()
        }
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(isActive ? HBTheme.editingBackground : .clear)
        )
        .shadow(
            color: isActive ? HBTheme.editingShadow : .clear,
            radius: isActive ? 4 : 0,
            x: 0,
            y: isActive ? 1 : 0
        )
        .animation(HBTheme.springDefault, value: isActive)
    }

    private var hasMetadata: Bool {
        metadata.areaId != nil || !metadata.labels.isEmpty ||
        !metadata.people.isEmpty || metadata.deferDate != nil || metadata.dueDate != nil
    }

    private func submitTask() {
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else {
            if !hasMetadata { isActive = false }
            return
        }

        let status = metadata.areaId != nil ? "anytime" : defaultStatus
        let task = HBTask(title: trimmed, status: status)
        if perspective == .today { task.dueDate = Calendar.current.startOfDay(for: Date()) }
        if perspective == .flagged { task.flagged = true }

        task.areaId = metadata.areaId
        task.labels = metadata.labels
        task.people = metadata.people
        task.deferDate = metadata.deferDate
        task.dueDate = metadata.dueDate

        context.insert(task)
        sync.engine.markDirty()
        Haptic.lightTap()

        text = ""
        metadata = TaskInlineMetadata()
    }

    private var defaultStatus: String {
        switch perspective {
        case .inbox: "inbox"
        case .someday: "someday"
        default: "anytime"
        }
    }
}
