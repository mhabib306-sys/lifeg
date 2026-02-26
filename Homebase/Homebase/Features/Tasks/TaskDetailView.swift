import SwiftUI
import SwiftData

// MARK: - Step 9: Task Editor Redesign

struct TaskDetailView: View {
    let taskId: String?
    let context: ModelContext
    var linkedEntity: EntityType? = nil
    @Environment(\.dismiss) private var dismiss
    @Environment(SyncCoordinator.self) private var sync
    @State private var title = ""
    @State private var notes = ""
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
    @FocusState private var titleFocused: Bool

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
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // 1. Large title TextField
                    TextField("Title", text: $title)
                        .font(HBTheme.editorTitleFont)
                        .focused($titleFocused)
                        .shortcutKeysAccessory { trigger in
                            if !title.isEmpty && !title.hasSuffix(" ") {
                                title += " "
                            }
                            title += trigger
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 16)
                        .padding(.bottom, 4)

                    // 2. Notes TextField
                    TextField("Notes", text: $notes, axis: .vertical)
                        .font(.body)
                        .foregroundStyle(HBTheme.textSecondary)
                        .lineLimit(3...)
                        .padding(.horizontal, 20)
                        .padding(.bottom, 16)

                    Divider().padding(.horizontal, 20)

                    if !isNote {
                        // 3. Metadata rows
                        VStack(spacing: 0) {
                            // Flagged toggle
                            MetadataRow(
                                icon: "flag.fill",
                                label: "Flagged",
                                iconColor: flagged ? HBTheme.flagged : HBTheme.textTertiary
                            ) {
                                Toggle("", isOn: $flagged)
                                    .labelsHidden()
                            }

                            // Due date
                            MetadataRow(
                                icon: "calendar",
                                label: "Due Date",
                                iconColor: dueDate != nil ? HBTheme.accent : HBTheme.textTertiary
                            ) {
                                if let date = dueDate {
                                    Text(date, style: .date)
                                        .font(.subheadline)
                                        .foregroundStyle(HBTheme.accent)
                                }
                                Button(dueDate == nil ? "Add" : "Remove") {
                                    if dueDate == nil {
                                        dueDate = Date()
                                        showDuePicker = true
                                    } else {
                                        dueDate = nil
                                        showDuePicker = false
                                    }
                                }
                                .font(.subheadline)
                                .foregroundStyle(HBTheme.accent)
                            }
                            if showDuePicker, dueDate != nil {
                                DatePicker("", selection: Binding(
                                    get: { dueDate ?? Date() },
                                    set: { dueDate = $0 }
                                ), displayedComponents: .date)
                                .datePickerStyle(.compact)
                                .padding(.horizontal, 20)
                            }

                            // Defer date
                            MetadataRow(
                                icon: "clock",
                                label: "Defer Until",
                                iconColor: deferDate != nil ? HBTheme.accent : HBTheme.textTertiary
                            ) {
                                if let date = deferDate {
                                    Text(date, style: .date)
                                        .font(.subheadline)
                                        .foregroundStyle(HBTheme.accent)
                                }
                                Button(deferDate == nil ? "Add" : "Remove") {
                                    if deferDate == nil {
                                        deferDate = Date()
                                        showDeferPicker = true
                                    } else {
                                        deferDate = nil
                                        showDeferPicker = false
                                    }
                                }
                                .font(.subheadline)
                                .foregroundStyle(HBTheme.accent)
                            }
                            if showDeferPicker, deferDate != nil {
                                DatePicker("", selection: Binding(
                                    get: { deferDate ?? Date() },
                                    set: { deferDate = $0 }
                                ), displayedComponents: .date)
                                .datePickerStyle(.compact)
                                .padding(.horizontal, 20)
                            }
                        }

                        Divider().padding(.horizontal, 20)
                    }

                    // Organization section
                    VStack(spacing: 0) {
                        // Area picker
                        MetadataRow(
                            icon: "folder",
                            label: "Area",
                            iconColor: selectedAreaId != nil ? HBTheme.accent : HBTheme.textTertiary
                        ) {
                            Picker("", selection: $selectedAreaId) {
                                Text("None").tag(String?.none)
                                ForEach(allAreas, id: \.id) { area in
                                    HStack {
                                        Circle().fill(Color(hex: area.color)).frame(width: 8, height: 8)
                                        Text(area.name)
                                    }
                                    .tag(Optional(area.id))
                                }
                            }
                            .labelsHidden()
                            .onChange(of: selectedAreaId) { _, newValue in
                                if let catId = selectedCategoryId {
                                    let catBelongs = allCategories.contains { $0.id == catId && $0.areaId == (newValue ?? "") }
                                    if !catBelongs { selectedCategoryId = nil }
                                }
                            }
                        }

                        // Category picker
                        let filteredCategories = allCategories.filter { $0.areaId == (selectedAreaId ?? "") }
                        MetadataRow(
                            icon: "tray",
                            label: "Category",
                            iconColor: selectedCategoryId != nil ? HBTheme.accent : HBTheme.textTertiary
                        ) {
                            Picker("", selection: $selectedCategoryId) {
                                Text("None").tag(String?.none)
                                ForEach(filteredCategories, id: \.id) { cat in
                                    Text(cat.name).tag(Optional(cat.id))
                                }
                            }
                            .labelsHidden()
                            .disabled(selectedAreaId == nil)
                        }

                        // Labels summary
                        MetadataRow(
                            icon: "tag",
                            label: "Labels",
                            iconColor: !selectedLabels.isEmpty ? HBTheme.accent : HBTheme.textTertiary
                        ) {
                            DisclosureGroup("\(selectedLabels.count) selected") {
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
                                            Text(label.name).foregroundStyle(HBTheme.textPrimary)
                                            Spacer()
                                            if selectedLabels.contains(label.id) {
                                                Image(systemName: "checkmark").foregroundStyle(HBTheme.accent)
                                            }
                                        }
                                    }
                                }
                            }
                            .font(.subheadline)
                        }

                        // People summary
                        MetadataRow(
                            icon: "person.2",
                            label: "People",
                            iconColor: !selectedPeople.isEmpty ? HBTheme.accent : HBTheme.textTertiary
                        ) {
                            DisclosureGroup("\(selectedPeople.count) selected") {
                                ForEach(allPeople, id: \.id) { person in
                                    Button {
                                        if selectedPeople.contains(person.id) {
                                            selectedPeople.remove(person.id)
                                        } else {
                                            selectedPeople.insert(person.id)
                                        }
                                    } label: {
                                        HStack {
                                            Image(systemName: "person.circle.fill").foregroundStyle(HBTheme.textTertiary)
                                            Text(person.name).foregroundStyle(HBTheme.textPrimary)
                                            Spacer()
                                            if selectedPeople.contains(person.id) {
                                                Image(systemName: "checkmark").foregroundStyle(HBTheme.accent)
                                            }
                                        }
                                    }
                                }
                            }
                            .font(.subheadline)
                        }
                    }

                    // Child notes section — shown when editing an existing note
                    if isNote && taskId != nil {
                        Divider().padding(.horizontal, 20)

                        VStack(alignment: .leading, spacing: 0) {
                            HStack {
                                Text("Sub-notes")
                                    .font(.subheadline.weight(.medium))
                                    .foregroundStyle(HBTheme.textSecondary)
                                Spacer()
                                Text("\(childNotes.count)")
                                    .font(HBTheme.badgeFont)
                                    .foregroundStyle(HBTheme.textTertiary)
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 12)

                            ForEach(childNotes, id: \.id) { child in
                                ChildNoteRow(note: child, onEdit: { editingChildId = child.id })
                                    .padding(.horizontal, 20)
                                    .padding(.vertical, 6)
                            }

                            Button {
                                addChildNote()
                            } label: {
                                Label("Add Sub-note", systemImage: "plus")
                                    .foregroundStyle(HBTheme.accent)
                                    .font(.subheadline)
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 12)
                        }
                    }
                }
            }
            .background(HBTheme.background)
            .navigationTitle(navigationTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        save()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                    .disabled(title.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
            .onAppear {
                loadExisting()
                if taskId == nil {
                    applyLinkedEntity()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        titleFocused = true
                    }
                }
            }
            .sheet(item: $editingChildId) { childId in
                TaskDetailView(taskId: childId, context: context)
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
                    .presentationCornerRadius(20)
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
        flagged = task.flagged
        dueDate = task.dueDate
        deferDate = task.deferDate
        selectedAreaId = task.areaId
        selectedCategoryId = task.categoryId
        selectedLabels = Set(task.labels)
        selectedPeople = Set(task.people)
    }

    /// Status is derived: area assigned → "anytime", otherwise → "inbox"
    /// (matches the web app where status is set contextually)
    private var computedStatus: String {
        if let task = existingTask, task.status == "someday" { return "someday" }
        return selectedAreaId != nil ? "anytime" : "inbox"
    }

    private func save() {
        let status = computedStatus
        if let task = existingTask {
            task.title = title
            task.notes = notes
            task.status = status
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

    private func applyLinkedEntity() {
        guard let entity = linkedEntity else { return }
        switch entity {
        case .area(let id):
            selectedAreaId = id
        case .category(let id):
            selectedCategoryId = id
            if let cat = allCategories.first(where: { $0.id == id }) {
                let areaId = cat.areaId
                if !areaId.isEmpty { selectedAreaId = areaId }
            }
        case .label(let id):
            selectedLabels.insert(id)
        case .person(let id):
            selectedPeople.insert(id)
        }
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

// MARK: - Metadata Row

private struct MetadataRow<Trailing: View>: View {
    let icon: String
    let label: String
    var iconColor: Color = HBTheme.textTertiary
    @ViewBuilder let trailing: () -> Trailing

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(iconColor)
                .frame(width: 24)
            Text(label)
                .font(.body)
                .foregroundStyle(HBTheme.textPrimary)
            Spacer()
            trailing()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
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
        let trimmed = editText.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty {
            note.title = trimmed
        }
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
                    .datePickerStyle(.compact)
            }
        }
    }
}
