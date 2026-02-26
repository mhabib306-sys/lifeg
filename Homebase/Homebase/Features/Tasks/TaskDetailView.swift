import SwiftUI
import SwiftData

struct TaskDetailView: View {
    let taskId: String?
    let context: ModelContext
    @Environment(\.dismiss) private var dismiss
    @Environment(SyncCoordinator.self) private var sync
    @State private var title = ""
    @State private var notes = ""
    @State private var status = "inbox"
    @State private var today = false
    @State private var flagged = false
    @State private var dueDate: Date?
    @State private var deferDate: Date?
    @State private var showDuePicker = false
    @State private var showDeferPicker = false
    @State private var selectedAreaId: String?
    @State private var selectedCategoryId: String?
    @State private var selectedLabels: Set<String> = []
    @State private var selectedPeople: Set<String> = []
    @State private var editingChildId: String?

    @Query(sort: \HBArea.order) private var allAreas: [HBArea]
    @Query(sort: \HBCategory.order) private var allCategories: [HBCategory]
    @Query(sort: \HBLabel.order) private var allLabels: [HBLabel]
    @Query(sort: \HBPerson.order) private var allPeople: [HBPerson]
    @Query(filter: #Predicate<HBTask> { $0.isNote && $0.noteLifecycleState == "active" })
    private var allNotes: [HBTask]

    private var existingTask: HBTask? {
        guard let taskId else { return nil }
        let descriptor = FetchDescriptor<HBTask>(predicate: #Predicate { $0.id == taskId })
        return try? context.fetch(descriptor).first
    }

    private var childNotes: [HBTask] {
        guard let taskId else { return [] }
        return allNotes.filter { $0.parentId == taskId }.sorted { $0.order < $1.order }
    }

    private var isNote: Bool {
        existingTask?.isNote ?? false
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Title", text: $title)
                        .font(.title3)
                    TextField("Notes", text: $notes, axis: .vertical)
                        .lineLimit(3...10)
                }

                if !isNote {
                    Section {
                        Toggle(isOn: $today) {
                            Label("Today", systemImage: "star.fill")
                                .foregroundStyle(today ? HBTheme.today : HBTheme.textPrimary)
                        }
                        Toggle(isOn: $flagged) {
                            Label("Flagged", systemImage: "flag.fill")
                                .foregroundStyle(flagged ? HBTheme.flagged : HBTheme.textPrimary)
                        }
                        Toggle(isOn: Binding(
                            get: { status == "someday" },
                            set: { status = $0 ? "someday" : "anytime" }
                        )) {
                            Label("Someday", systemImage: "archivebox")
                                .foregroundStyle(status == "someday" ? HBTheme.someday : HBTheme.textPrimary)
                        }
                    }
                }

                Section("Organization") {
                    Picker("Area", selection: $selectedAreaId) {
                        Text("None").tag(String?.none)
                        ForEach(allAreas, id: \.id) { area in
                            HStack {
                                Circle().fill(Color(hex: area.color)).frame(width: 8, height: 8)
                                Text(area.name)
                            }
                            .tag(Optional(area.id))
                        }
                    }
                    .onChange(of: selectedAreaId) { _, newValue in
                        if let catId = selectedCategoryId {
                            let catBelongs = allCategories.contains { $0.id == catId && $0.areaId == (newValue ?? "") }
                            if !catBelongs { selectedCategoryId = nil }
                        }
                    }

                    let filteredCategories = allCategories.filter { $0.areaId == (selectedAreaId ?? "") }
                    Picker("Category", selection: $selectedCategoryId) {
                        Text("None").tag(String?.none)
                        ForEach(filteredCategories, id: \.id) { cat in
                            Text(cat.name).tag(Optional(cat.id))
                        }
                    }
                    .disabled(selectedAreaId == nil)

                    DisclosureGroup("Labels (\(selectedLabels.count))") {
                        ForEach(allLabels, id: \.id) { label in
                            Button {
                                if selectedLabels.contains(label.id) {
                                    selectedLabels.remove(label.id)
                                } else {
                                    selectedLabels.insert(label.id)
                                }
                            } label: {
                                HStack {
                                    Circle().fill(Color(hex: label.color)).frame(width: 8, height: 8)
                                    Text(label.name)
                                        .foregroundStyle(HBTheme.textPrimary)
                                    Spacer()
                                    if selectedLabels.contains(label.id) {
                                        Image(systemName: "checkmark")
                                            .foregroundStyle(HBTheme.accent)
                                    }
                                }
                            }
                        }
                    }

                    DisclosureGroup("People (\(selectedPeople.count))") {
                        ForEach(allPeople, id: \.id) { person in
                            Button {
                                if selectedPeople.contains(person.id) {
                                    selectedPeople.remove(person.id)
                                } else {
                                    selectedPeople.insert(person.id)
                                }
                            } label: {
                                HStack {
                                    Image(systemName: "person.circle.fill")
                                        .foregroundStyle(HBTheme.textTertiary)
                                    Text(person.name)
                                        .foregroundStyle(HBTheme.textPrimary)
                                    Spacer()
                                    if selectedPeople.contains(person.id) {
                                        Image(systemName: "checkmark")
                                            .foregroundStyle(HBTheme.accent)
                                    }
                                }
                            }
                        }
                    }
                }

                if !isNote {
                    Section("Dates") {
                        DatePickerRow(label: "Due", date: $dueDate, isExpanded: $showDuePicker)
                        DatePickerRow(label: "Defer", date: $deferDate, isExpanded: $showDeferPicker)
                    }
                }

                // Child notes section — shown when editing an existing note
                if isNote && taskId != nil {
                    Section {
                        ForEach(childNotes, id: \.id) { child in
                            ChildNoteRow(note: child, onEdit: { editingChildId = child.id })
                        }

                        Button {
                            addChildNote()
                        } label: {
                            Label("Add Sub-note", systemImage: "plus")
                                .foregroundStyle(HBTheme.accent)
                        }
                    } header: {
                        HStack {
                            Text("Sub-notes")
                            Spacer()
                            Text("\(childNotes.count)")
                                .font(HBTheme.badgeFont)
                                .foregroundStyle(HBTheme.textTertiary)
                        }
                    }
                }
            }
            .navigationTitle(navigationTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save(); dismiss() }
                        .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
            .onAppear { loadExisting() }
            .sheet(item: $editingChildId) { childId in
                TaskDetailView(taskId: childId, context: context)
            }
        }
    }

    private var navigationTitle: String {
        if taskId == nil { return "New Task" }
        return isNote ? "Edit Note" : "Edit Task"
    }

    private func loadExisting() {
        guard let task = existingTask else { return }
        title = task.title
        notes = task.notes
        status = task.status
        today = task.today
        flagged = task.flagged
        dueDate = task.dueDate
        deferDate = task.deferDate
        selectedAreaId = task.areaId
        selectedCategoryId = task.categoryId
        selectedLabels = Set(task.labels)
        selectedPeople = Set(task.people)
    }

    private func save() {
        if let task = existingTask {
            task.title = title
            task.notes = notes
            task.status = status
            task.today = today
            task.flagged = flagged
            task.dueDate = dueDate
            task.deferDate = deferDate
            task.areaId = selectedAreaId
            task.categoryId = selectedCategoryId
            task.labels = Array(selectedLabels)
            task.people = Array(selectedPeople)
            task.touch()
        } else {
            let task = HBTask(title: title, status: status)
            task.notes = notes
            task.today = today
            task.flagged = flagged
            task.dueDate = dueDate
            task.deferDate = deferDate
            task.areaId = selectedAreaId
            task.categoryId = selectedCategoryId
            task.labels = Array(selectedLabels)
            task.people = Array(selectedPeople)
            context.insert(task)
        }
        sync.engine.markDirty()
    }

    private func addChildNote() {
        guard let taskId else { return }
        let child = HBTask.createNote(title: "")
        child.parentId = taskId
        child.indent = (existingTask?.indent ?? 0) + 1
        child.order = childNotes.count
        context.insert(child)
        sync.engine.markDirty()
        editingChildId = child.id
    }
}

// MARK: - Child Note Row (inline editable)

private struct ChildNoteRow: View {
    let note: HBTask
    let onEdit: () -> Void
    @Environment(SyncCoordinator.self) private var sync
    @State private var isEditing = false
    @State private var editText = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "doc.text")
                .font(.system(size: 12))
                .foregroundStyle(HBTheme.textTertiary)

            if isEditing {
                TextField("Note title", text: $editText)
                    .font(HBTheme.titleFont)
                    .focused($isFocused)
                    .onSubmit { commitEdit() }
                    .onChange(of: isFocused) { _, focused in
                        if !focused { commitEdit() }
                    }
            } else {
                Text(note.title.isEmpty ? "Untitled" : note.title)
                    .font(HBTheme.titleFont)
                    .foregroundStyle(note.title.isEmpty ? HBTheme.textTertiary : HBTheme.textPrimary)
                    .onTapGesture {
                        editText = note.title
                        isEditing = true
                        isFocused = true
                    }
            }

            Spacer()

            Button { onEdit() } label: {
                Image(systemName: "chevron.right")
                    .font(.system(size: 12))
                    .foregroundStyle(HBTheme.textTertiary)
            }
            .buttonStyle(.plain)
        }
    }

    private func commitEdit() {
        note.title = editText
        note.touch()
        sync.engine.markDirty()
        isEditing = false
    }
}

// MARK: - Date Picker Row

struct DatePickerRow: View {
    let label: String
    @Binding var date: Date?
    @Binding var isExpanded: Bool

    var body: some View {
        VStack {
            HStack {
                Text(label)
                Spacer()
                if let date {
                    Text(date, style: .date)
                        .foregroundStyle(HBTheme.accent)
                }
                Button(date == nil ? "Add" : "Remove") {
                    if date == nil { date = Date(); isExpanded = true }
                    else { date = nil; isExpanded = false }
                }
                .font(.caption)
            }
            if isExpanded, date != nil {
                DatePicker("", selection: Binding(get: { date ?? Date() }, set: { date = $0 }), displayedComponents: .date)
                    .datePickerStyle(.graphical)
            }
        }
    }
}
