import SwiftUI
import SwiftData

enum EntityType {
    case area(String)
    case category(String)
    case label(String)
    case person(String)
}

struct EntityDetailView: View {
    let entityType: EntityType
    @Query private var allTasks: [HBTask]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var editingTaskId: String?

    private var entityName: String {
        switch entityType {
        case .area(let id):
            let d = FetchDescriptor<HBArea>(predicate: #Predicate { $0.id == id })
            return (try? context.fetch(d))?.first?.name ?? "Area"
        case .category(let id):
            let d = FetchDescriptor<HBCategory>(predicate: #Predicate { $0.id == id })
            return (try? context.fetch(d))?.first?.name ?? "Category"
        case .label(let id):
            let d = FetchDescriptor<HBLabel>(predicate: #Predicate { $0.id == id })
            return (try? context.fetch(d))?.first?.name ?? "Label"
        case .person(let id):
            let d = FetchDescriptor<HBPerson>(predicate: #Predicate { $0.id == id })
            return (try? context.fetch(d))?.first?.name ?? "Person"
        }
    }

    private var relatedTasks: [HBTask] {
        allTasks.filter { !$0.isNote && matchesEntity($0) }
    }

    private var relatedNotes: [HBTask] {
        allTasks.filter { $0.isNote && $0.noteLifecycleState == "active" && matchesEntity($0) }
    }

    private func matchesEntity(_ task: HBTask) -> Bool {
        switch entityType {
        case .area(let id): return task.areaId == id
        case .category(let id): return task.categoryId == id
        case .label(let id): return task.labels.contains(id)
        case .person(let id): return task.people.contains(id)
        }
    }

    private var incompleteTasks: [HBTask] { relatedTasks.filter { !$0.completed } }
    private var completedTasks: [HBTask] { relatedTasks.filter { $0.completed } }

    var body: some View {
        List {
            // Stats header
            Section {
                HStack(spacing: 20) {
                    StatBadge(icon: "checklist", label: "Tasks", count: incompleteTasks.count, color: HBTheme.accent)
                    StatBadge(icon: "doc.text", label: "Notes", count: relatedNotes.count, color: HBTheme.anytime)
                    StatBadge(icon: "checkmark.circle", label: "Done", count: completedTasks.count, color: HBTheme.logbook)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
            }

            // Incomplete tasks
            if !incompleteTasks.isEmpty {
                Section("Tasks") {
                    ForEach(incompleteTasks.sorted { $0.order < $1.order }, id: \.id) { task in
                        TaskRowView(task: task)
                            .contentShape(Rectangle())
                            .onTapGesture { editingTaskId = task.id }
                            .swipeActions(edge: .leading) {
                                Button {
                                    task.markCompleted()
                                    sync.engine.markDirty()
                                } label: {
                                    Label("Complete", systemImage: "checkmark")
                                }
                                .tint(HBTheme.logbook)
                            }
                    }
                }
            }

            // Notes
            if !relatedNotes.isEmpty {
                Section("Notes") {
                    ForEach(relatedNotes.sorted { $0.order < $1.order }, id: \.id) { note in
                        HStack {
                            Image(systemName: "doc.text")
                                .font(.system(size: 12))
                                .foregroundStyle(HBTheme.textTertiary)
                            Text(note.title.isEmpty ? "Untitled" : note.title)
                                .font(HBTheme.titleFont)
                        }
                        .contentShape(Rectangle())
                        .onTapGesture { editingTaskId = note.id }
                    }
                }
            }

            // Completed tasks
            if !completedTasks.isEmpty {
                Section("Completed (\(completedTasks.count))") {
                    ForEach(completedTasks.sorted(by: { ($0.completedAt ?? .distantPast) > ($1.completedAt ?? .distantPast) }), id: \.id) { task in
                        TaskRowView(task: task)
                            .contentShape(Rectangle())
                            .onTapGesture { editingTaskId = task.id }
                    }
                }
            }

            // Empty state
            if incompleteTasks.isEmpty && relatedNotes.isEmpty && completedTasks.isEmpty {
                Section {
                    Text("No tasks or notes assigned")
                        .foregroundStyle(HBTheme.textTertiary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 20)
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(entityName)
        .sheet(item: $editingTaskId) { taskId in
            TaskDetailView(taskId: taskId, context: context)
        }
    }
}

private struct StatBadge: View {
    let icon: String
    let label: String
    let count: Int
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(color)
            Text("\(count)")
                .font(.system(.title3, weight: .semibold))
                .foregroundStyle(HBTheme.textPrimary)
            Text(label)
                .font(HBTheme.badgeFont)
                .foregroundStyle(HBTheme.textSecondary)
        }
    }
}
