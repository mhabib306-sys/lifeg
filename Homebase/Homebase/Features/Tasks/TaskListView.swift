import SwiftUI
import SwiftData

struct TaskListView: View {
    let perspective: PerspectiveType
    // Step 12: Base predicate to exclude notes
    @Query(filter: #Predicate<HBTask> { !$0.isNote }) private var allTasks: [HBTask]
    @Bindable var router: NavigationRouter
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var editMode: EditMode = .inactive

    private var filteredTasks: [HBTask] {
        TaskFilterEngine.filter(allTasks, for: perspective)
            .sorted { $0.order < $1.order }
    }

    var body: some View {
        Group {
            // Step 8: Empty state
            if filteredTasks.isEmpty {
                EmptyStateView(
                    icon: perspective.emptyIcon,
                    title: perspective.emptyTitle,
                    subtitle: perspective.emptySubtitle
                )
            } else {
                List {
                    ForEach(filteredTasks, id: \.id) { task in
                        // Step 11: Button with ThingsPressStyle
                        Button {
                            router.presentedSheet = .taskEditor(task.id)
                        } label: {
                            TaskRowView(task: task)
                        }
                        .buttonStyle(ThingsPressStyle())
                        .swipeActions(edge: .leading) {
                            Button {
                                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                    task.markCompleted()
                                    sync.engine.markDirty()
                                }
                                Haptic.taskCompleted()
                            } label: {
                                Label("Complete", systemImage: "checkmark")
                            }
                            .tint(HBTheme.logbook)
                        }
                        .swipeActions(edge: .trailing) {
                            Button {
                                router.presentedSheet = .taskEditor(task.id)
                            } label: {
                                Label("Edit", systemImage: "pencil")
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
                        // Step 12: Separator styling
                        .listRowSeparatorTint(HBTheme.separator)
                        .alignmentGuide(.listRowSeparatorLeading) { d in d[.leading] + 50 }
                    }
                    .onMove { source, destination in
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                            moveTask(from: source, to: destination)
                        }
                    }

                    // Step 10: Inline Quick-Add
                    QuickAddRow(perspective: perspective)
                }
                .listStyle(.plain)
                // Step 7: List-level animation for task completion
                .animation(.spring(response: 0.4, dampingFraction: 0.8), value: filteredTasks.map(\.id))
            }
        }
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
            ToolbarItem(placement: .topBarLeading) {
                EditButton()
            }
        }
        // Step 11: Sheet polish
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

// MARK: - Step 10: Quick-Add Row

private struct QuickAddRow: View {
    let perspective: PerspectiveType
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var isActive = false
    @State private var text = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: 14) {
            if isActive {
                // Active: empty checkbox + focused TextField
                Circle()
                    .strokeBorder(HBTheme.checkboxBorder, lineWidth: 2)
                    .frame(width: 24, height: 24)
                    .padding(.top, 2)

                TextField("New Task", text: $text)
                    .font(HBTheme.titleFont)
                    .focused($isFocused)
                    .onSubmit {
                        submitTask()
                    }
                    .onChange(of: isFocused) { _, focused in
                        if !focused && text.trimmingCharacters(in: .whitespaces).isEmpty {
                            isActive = false
                        }
                    }
            } else {
                // Resting: + icon + "New Task"
                Button {
                    isActive = true
                    isFocused = true
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "plus")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(HBTheme.textTertiary)
                        Text("New Task")
                            .font(HBTheme.titleFont)
                            .foregroundStyle(HBTheme.textTertiary)
                    }
                }
                .buttonStyle(.plain)
            }

            Spacer()
        }
        .padding(.vertical, 8)
        .listRowSeparator(.hidden)
    }

    private func submitTask() {
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else {
            isActive = false
            return
        }

        let task = HBTask(title: trimmed, status: defaultStatus)
        if perspective == .today { task.today = true }
        if perspective == .flagged { task.flagged = true }
        context.insert(task)
        sync.engine.markDirty()
        Haptic.lightTap()

        // Clear and keep focus for rapid entry
        text = ""
    }

    private var defaultStatus: String {
        switch perspective {
        case .inbox: "inbox"
        case .someday: "someday"
        default: "anytime"
        }
    }
}
