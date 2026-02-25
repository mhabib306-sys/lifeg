import SwiftUI
import SwiftData

struct GlobalSearchView: View {
    @Binding var isPresented: Bool
    @Query private var allTasks: [HBTask]
    @Query(sort: \HBArea.order) private var areas: [HBArea]
    @Query(sort: \HBCategory.order) private var categories: [HBCategory]
    @Query(sort: \HBLabel.order) private var labels: [HBLabel]
    @Query(sort: \HBPerson.order) private var people: [HBPerson]
    @Environment(\.modelContext) private var context
    @State private var query = ""
    @State private var editingTaskId: String?
    @FocusState private var isFocused: Bool

    private var trimmed: String { query.trimmingCharacters(in: .whitespaces).lowercased() }

    private var matchingTasks: [HBTask] {
        guard !trimmed.isEmpty else { return [] }
        return allTasks.filter { !$0.isNote && $0.title.lowercased().contains(trimmed) }
            .sorted { !$0.completed && $1.completed }
    }

    private var matchingNotes: [HBTask] {
        guard !trimmed.isEmpty else { return [] }
        return allTasks.filter {
            $0.isNote && $0.noteLifecycleState == "active" &&
            $0.title.lowercased().contains(trimmed)
        }
    }

    private var matchingAreas: [HBArea] {
        guard !trimmed.isEmpty else { return [] }
        return areas.filter { $0.name.lowercased().contains(trimmed) }
    }

    private var matchingLabels: [HBLabel] {
        guard !trimmed.isEmpty else { return [] }
        return labels.filter { $0.name.lowercased().contains(trimmed) }
    }

    private var matchingPeople: [HBPerson] {
        guard !trimmed.isEmpty else { return [] }
        return people.filter {
            $0.name.lowercased().contains(trimmed) ||
            $0.email.lowercased().contains(trimmed)
        }
    }

    private var hasResults: Bool {
        !matchingTasks.isEmpty || !matchingNotes.isEmpty ||
        !matchingAreas.isEmpty || !matchingLabels.isEmpty || !matchingPeople.isEmpty
    }

    var body: some View {
        NavigationStack {
            List {
                if trimmed.isEmpty {
                    Section {
                        Text("Search tasks, notes, areas, labels, and people")
                            .foregroundStyle(HBTheme.textTertiary)
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding(.vertical, 20)
                    }
                } else if !hasResults {
                    Section {
                        Text("No results for \"\(query)\"")
                            .foregroundStyle(HBTheme.textTertiary)
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding(.vertical, 20)
                    }
                } else {
                    if !matchingTasks.isEmpty {
                        Section("Tasks (\(matchingTasks.count))") {
                            ForEach(matchingTasks.prefix(10), id: \.id) { task in
                                SearchTaskRow(task: task)
                                    .contentShape(Rectangle())
                                    .onTapGesture { editingTaskId = task.id }
                            }
                            if matchingTasks.count > 10 {
                                Text("+\(matchingTasks.count - 10) more")
                                    .font(HBTheme.badgeFont)
                                    .foregroundStyle(HBTheme.textTertiary)
                            }
                        }
                    }

                    if !matchingNotes.isEmpty {
                        Section("Notes (\(matchingNotes.count))") {
                            ForEach(matchingNotes.prefix(10), id: \.id) { note in
                                HStack(spacing: 8) {
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

                    if !matchingAreas.isEmpty {
                        Section("Areas") {
                            ForEach(matchingAreas, id: \.id) { area in
                                NavigationLink {
                                    EntityDetailView(entityType: .area(area.id))
                                } label: {
                                    HStack(spacing: 8) {
                                        Circle().fill(Color(hex: area.color)).frame(width: 10, height: 10)
                                        Text(area.name)
                                            .font(HBTheme.titleFont)
                                    }
                                }
                            }
                        }
                    }

                    if !matchingLabels.isEmpty {
                        Section("Labels") {
                            ForEach(matchingLabels, id: \.id) { label in
                                NavigationLink {
                                    EntityDetailView(entityType: .label(label.id))
                                } label: {
                                    HStack(spacing: 8) {
                                        Circle().fill(Color(hex: label.color)).frame(width: 10, height: 10)
                                        Text(label.name)
                                            .font(HBTheme.titleFont)
                                    }
                                }
                            }
                        }
                    }

                    if !matchingPeople.isEmpty {
                        Section("People") {
                            ForEach(matchingPeople, id: \.id) { person in
                                NavigationLink {
                                    EntityDetailView(entityType: .person(person.id))
                                } label: {
                                    HStack(spacing: 8) {
                                        Image(systemName: "person.circle.fill")
                                            .foregroundStyle(HBTheme.textTertiary)
                                        VStack(alignment: .leading) {
                                            Text(person.name)
                                                .font(HBTheme.titleFont)
                                            if !person.email.isEmpty {
                                                Text(person.email)
                                                    .font(HBTheme.badgeFont)
                                                    .foregroundStyle(HBTheme.textSecondary)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always), prompt: "Search everything...")
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { isPresented = false }
                }
            }
            .sheet(item: $editingTaskId) { taskId in
                TaskDetailView(taskId: taskId, context: context)
            }
            .onAppear { isFocused = true }
        }
    }
}

// MARK: - Search Task Row

private struct SearchTaskRow: View {
    let task: HBTask

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                .font(.system(size: 16))
                .foregroundStyle(task.completed ? HBTheme.logbook : HBTheme.checkboxBorder)

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(HBTheme.titleFont)
                    .foregroundStyle(task.completed ? HBTheme.textTertiary : HBTheme.textPrimary)
                    .strikethrough(task.completed)

                HStack(spacing: 6) {
                    if task.today {
                        Image(systemName: "star.fill")
                            .font(.system(size: 9))
                            .foregroundStyle(HBTheme.today)
                    }
                    if task.flagged {
                        Image(systemName: "flag.fill")
                            .font(.system(size: 9))
                            .foregroundStyle(HBTheme.flagged)
                    }
                    Text(task.status.capitalized)
                        .font(HBTheme.badgeFont)
                        .foregroundStyle(HBTheme.textTertiary)
                }
            }

            Spacer()
        }
    }
}
