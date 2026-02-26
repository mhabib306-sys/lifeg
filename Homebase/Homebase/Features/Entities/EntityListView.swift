import SwiftUI
import SwiftData

// MARK: - Area List

struct AreaListView: View {
    @Query(sort: \HBArea.order) private var areas: [HBArea]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false
    @State private var searchText = ""

    private var filtered: [HBArea] {
        guard !searchText.isEmpty else { return areas }
        let q = searchText.lowercased()
        return areas.filter { $0.name.lowercased().contains(q) }
    }

    var body: some View {
        List {
            ForEach(filtered, id: \.id) { area in
                NavigationLink {
                    EntityDetailView(entityType: .area(area.id))
                } label: {
                    HStack {
                        Circle().fill(Color(hex: area.color)).frame(width: 12, height: 12)
                        Text(area.name)
                        if let emoji = area.emoji {
                            Text(emoji)
                        }
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                let items = filtered
                for i in indexSet { context.delete(items[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("Areas")
        .searchable(text: $searchText, prompt: "Search areas...")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            AreaEditorView()
        }
    }
}

// MARK: - Label List

struct LabelListView: View {
    @Query(sort: \HBLabel.order) private var labels: [HBLabel]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false
    @State private var searchText = ""

    private var filtered: [HBLabel] {
        guard !searchText.isEmpty else { return labels }
        let q = searchText.lowercased()
        return labels.filter { $0.name.lowercased().contains(q) }
    }

    var body: some View {
        List {
            ForEach(filtered, id: \.id) { label in
                NavigationLink {
                    EntityDetailView(entityType: .label(label.id))
                } label: {
                    HStack {
                        Circle().fill(Color(hex: label.color)).frame(width: 12, height: 12)
                        Text(label.name)
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                let items = filtered
                for i in indexSet { context.delete(items[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("Labels")
        .searchable(text: $searchText, prompt: "Search labels...")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            LabelEditorView()
        }
    }
}

// MARK: - Person List

struct PersonListView: View {
    @Query(sort: \HBPerson.order) private var people: [HBPerson]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false
    @State private var searchText = ""

    private var filtered: [HBPerson] {
        guard !searchText.isEmpty else { return people }
        let q = searchText.lowercased()
        return people.filter {
            $0.name.lowercased().contains(q) || $0.email.lowercased().contains(q)
        }
    }

    var body: some View {
        List {
            ForEach(filtered, id: \.id) { person in
                NavigationLink {
                    EntityDetailView(entityType: .person(person.id))
                } label: {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .foregroundStyle(HBTheme.textTertiary)
                        VStack(alignment: .leading) {
                            Text(person.name)
                            if !person.email.isEmpty {
                                Text(person.email)
                                    .font(HBTheme.subtitleFont)
                                    .foregroundStyle(HBTheme.textSecondary)
                            }
                        }
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                let items = filtered
                for i in indexSet { context.delete(items[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("People")
        .searchable(text: $searchText, prompt: "Search people...")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            PersonEditorView()
        }
    }
}

// MARK: - Category List

struct CategoryListView: View {
    @Query(sort: \HBCategory.order) private var categories: [HBCategory]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false
    @State private var searchText = ""

    private var filtered: [HBCategory] {
        guard !searchText.isEmpty else { return categories }
        let q = searchText.lowercased()
        return categories.filter { $0.name.lowercased().contains(q) }
    }

    var body: some View {
        List {
            ForEach(filtered, id: \.id) { category in
                NavigationLink {
                    EntityDetailView(entityType: .category(category.id))
                } label: {
                    HStack {
                        Text(category.name)
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                let items = filtered
                for i in indexSet { context.delete(items[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("Categories")
        .searchable(text: $searchText, prompt: "Search categories...")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            CategoryEditorView()
        }
    }
}

// MARK: - Entity Type

enum EntityType {
    case area(String)
    case category(String)
    case label(String)
    case person(String)
}

// MARK: - Entity Detail View

struct EntityDetailView: View {
    let entityType: EntityType
    @Query private var allTasks: [HBTask]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @Environment(EntityCache.self) private var entityCache
    @State private var editingTaskId: String?
    @State private var searchText = ""

    private var entityName: String {
        entityCache.entityName(for: entityType)
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

    private func matchesSearch(_ task: HBTask) -> Bool {
        guard !searchText.isEmpty else { return true }
        return task.title.lowercased().contains(searchText.lowercased())
    }

    private var incompleteTasks: [HBTask] { relatedTasks.filter { !$0.completed && matchesSearch($0) } }
    private var completedTasks: [HBTask] { relatedTasks.filter { $0.completed && matchesSearch($0) } }
    private var filteredNotes: [HBTask] { relatedNotes.filter { matchesSearch($0) } }

    var body: some View {
        List {
            Section {
                HStack(spacing: 20) {
                    StatBadge(icon: "checklist", label: "Tasks", count: relatedTasks.filter { !$0.completed }.count, color: HBTheme.accent)
                    StatBadge(icon: "doc.text", label: "Notes", count: relatedNotes.count, color: HBTheme.anytime)
                    StatBadge(icon: "checkmark.circle", label: "Done", count: relatedTasks.filter { $0.completed }.count, color: HBTheme.logbook)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
            }

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

            if !filteredNotes.isEmpty {
                Section("Notes") {
                    ForEach(filteredNotes.sorted { $0.order < $1.order }, id: \.id) { note in
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

            if !completedTasks.isEmpty {
                Section("Completed (\(completedTasks.count))") {
                    ForEach(completedTasks.sorted(by: { ($0.completedAt ?? .distantPast) > ($1.completedAt ?? .distantPast) }), id: \.id) { task in
                        TaskRowView(task: task)
                            .contentShape(Rectangle())
                            .onTapGesture { editingTaskId = task.id }
                    }
                }
            }

            if incompleteTasks.isEmpty && filteredNotes.isEmpty && completedTasks.isEmpty {
                Section {
                    Text(searchText.isEmpty ? "No tasks or notes assigned" : "No results")
                        .foregroundStyle(HBTheme.textTertiary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 20)
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(entityName)
        .searchable(text: $searchText, prompt: "Search in \(entityName)...")
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
