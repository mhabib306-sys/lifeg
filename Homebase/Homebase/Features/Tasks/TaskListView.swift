import SwiftUI
import SwiftData

struct TaskListView: View {
    let perspective: PerspectiveType
    @Query private var allTasks: [HBTask]
    @Bindable var router: NavigationRouter
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var editMode: EditMode = .inactive

    private var filteredTasks: [HBTask] {
        TaskFilterEngine.filter(allTasks, for: perspective)
            .sorted { $0.order < $1.order }
    }

    var body: some View {
        List {
            ForEach(filteredTasks, id: \.id) { task in
                TaskRowView(task: task)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        router.presentedSheet = .taskEditor(task.id)
                    }
                    .swipeActions(edge: .leading) {
                        Button {
                            task.markCompleted()
                            sync.engine.markDirty()
                        } label: {
                            Label("Complete", systemImage: "checkmark")
                        }
                        .tint(HBTheme.logbook)
                    }
                    .swipeActions(edge: .trailing) {
                        Button {
                            task.flagged.toggle()
                            task.touch()
                            sync.engine.markDirty()
                        } label: {
                            Label("Flag", systemImage: "flag.fill")
                        }
                        .tint(HBTheme.flagged)
                    }
            }
            .onMove { source, destination in
                moveTask(from: source, to: destination)
            }
        }
        .listStyle(.plain)
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
        .sheet(item: $router.presentedSheet) { sheet in
            if case .taskEditor(let id) = sheet {
                TaskDetailView(taskId: id, context: context)
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
