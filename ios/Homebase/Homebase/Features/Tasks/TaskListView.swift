import SwiftUI
import SwiftData

struct TaskListView: View {
    let perspective: PerspectiveType
    @Query private var allTasks: [HBTask]
    @Bindable var router: NavigationRouter
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync

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
        }
        .listStyle(.plain)
        .navigationTitle(perspective.displayName)
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
            }
        }
    }
}
