# Entity Assignments & Detail Pages — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let users assign tasks/notes to Areas, Categories, Labels, and People via the editor, show entity info in list rows, and view entity detail pages with dashboard stats.

**Architecture:** No model changes needed — HBTask already has `areaId`, `categoryId`, `labels: [String]`, `people: [String]`. All changes are UI: expand TaskDetailView with an Organization section, add entity subtitles to row views, create a new EntityDetailView, and wire up navigation. A shared `EntityResolver` helper resolves entity IDs to display names to keep lookup logic DRY across rows and editors.

**Tech Stack:** SwiftUI, SwiftData (@Query, FetchDescriptor), iOS 17+

---

### Task 1: EntityResolver — shared ID-to-name lookup

**Files:**
- Create: `Homebase/Homebase/Shared/EntityResolver.swift`

**Step 1: Create EntityResolver**

This helper takes a ModelContext and resolves entity IDs to display strings. Used by row views and the editor.

```swift
import Foundation
import SwiftData

enum EntityResolver {
    static func areaName(for id: String?, in context: ModelContext) -> String? {
        guard let id else { return nil }
        let descriptor = FetchDescriptor<HBArea>(predicate: #Predicate { $0.id == id })
        return (try? context.fetch(descriptor))?.first?.name
    }

    static func categoryName(for id: String?, in context: ModelContext) -> String? {
        guard let id else { return nil }
        let descriptor = FetchDescriptor<HBCategory>(predicate: #Predicate { $0.id == id })
        return (try? context.fetch(descriptor))?.first?.name
    }

    static func labelNames(for ids: [String], in context: ModelContext) -> [String] {
        guard !ids.isEmpty else { return [] }
        let descriptor = FetchDescriptor<HBLabel>()
        let all = (try? context.fetch(descriptor)) ?? []
        return all.filter { ids.contains($0.id) }.map(\.name)
    }

    static func personNames(for ids: [String], in context: ModelContext) -> [String] {
        guard !ids.isEmpty else { return [] }
        let descriptor = FetchDescriptor<HBPerson>()
        let all = (try? context.fetch(descriptor)) ?? []
        return all.filter { ids.contains($0.id) }.map(\.name)
    }

    static func subtitle(for task: HBTask, in context: ModelContext) -> String? {
        var parts: [String] = []
        if let name = areaName(for: task.areaId, in: context) { parts.append(name) }
        if let name = categoryName(for: task.categoryId, in: context) { parts.append(name) }
        parts.append(contentsOf: labelNames(for: task.labels, in: context))
        parts.append(contentsOf: personNames(for: task.people, in: context).map { "@\($0)" })
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }
}
```

**Step 2: Commit**

```bash
git add Homebase/Homebase/Shared/EntityResolver.swift
git commit -m "feat(ios): add EntityResolver for ID-to-name lookup"
```

---

### Task 2: TaskDetailView — add Organization section

**Files:**
- Modify: `Homebase/Homebase/Features/Tasks/TaskDetailView.swift`

**Step 1: Add state variables for entity fields**

Add these @State properties alongside the existing ones (after `showDeferPicker`):

```swift
@State private var selectedAreaId: String?
@State private var selectedCategoryId: String?
@State private var selectedLabels: Set<String> = []
@State private var selectedPeople: Set<String> = []
```

Add @Query properties at the top of the struct (before `body`):

```swift
@Query(sort: \HBArea.order) private var allAreas: [HBArea]
@Query(sort: \HBCategory.order) private var allCategories: [HBCategory]
@Query(sort: \HBLabel.order) private var allLabels: [HBLabel]
@Query(sort: \HBPerson.order) private var allPeople: [HBPerson]
```

**Step 2: Add Organization section to the Form body**

Insert this section between the "Status" section and the "Dates" section:

```swift
Section("Organization") {
    // Area picker
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
        // Clear category if area changed and category doesn't belong to new area
        if let catId = selectedCategoryId {
            let catBelongs = allCategories.contains { $0.id == catId && $0.areaId == (newValue ?? "") }
            if !catBelongs { selectedCategoryId = nil }
        }
    }

    // Category picker (filtered by selected area)
    let filteredCategories = allCategories.filter { $0.areaId == (selectedAreaId ?? "") }
    Picker("Category", selection: $selectedCategoryId) {
        Text("None").tag(String?.none)
        ForEach(filteredCategories, id: \.id) { cat in
            Text(cat.name).tag(Optional(cat.id))
        }
    }
    .disabled(selectedAreaId == nil)

    // Labels multi-select
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

    // People multi-select
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
```

**Step 3: Update loadExisting() to populate entity state**

Add these lines at the end of `loadExisting()`:

```swift
selectedAreaId = task.areaId
selectedCategoryId = task.categoryId
selectedLabels = Set(task.labels)
selectedPeople = Set(task.people)
```

**Step 4: Update save() to write entity fields**

In the `if let task = existingTask` branch, add after `task.deferDate = deferDate`:

```swift
task.areaId = selectedAreaId
task.categoryId = selectedCategoryId
task.labels = Array(selectedLabels)
task.people = Array(selectedPeople)
```

In the `else` (new task) branch, add after `task.deferDate = deferDate`:

```swift
task.areaId = selectedAreaId
task.categoryId = selectedCategoryId
task.labels = Array(selectedLabels)
task.people = Array(selectedPeople)
```

**Step 5: Commit**

```bash
git add Homebase/Homebase/Features/Tasks/TaskDetailView.swift
git commit -m "feat(ios): add Organization section to TaskDetailView"
```

---

### Task 3: TaskRowView — add entity subtitle

**Files:**
- Modify: `Homebase/Homebase/Features/Tasks/TaskRowView.swift`

**Step 1: Add ModelContext environment and subtitle**

Add import and environment:

```swift
import SwiftData
```

Add environment property inside the struct:

```swift
@Environment(\.modelContext) private var context
```

**Step 2: Add subtitle text below the existing HStack with star/flag/due**

Inside the `VStack(alignment: .leading, spacing: 2)`, after the closing `}` of the existing `HStack(spacing: 6)` block (the one with star/flag/due), add:

```swift
if let subtitle = EntityResolver.subtitle(for: task, in: context) {
    Text(subtitle)
        .font(HBTheme.subtitleFont)
        .foregroundStyle(HBTheme.textTertiary)
        .lineLimit(1)
}
```

**Step 3: Commit**

```bash
git add Homebase/Homebase/Features/Tasks/TaskRowView.swift
git commit -m "feat(ios): show entity subtitle in TaskRowView"
```

---

### Task 4: NoteRowView — add entity subtitle

**Files:**
- Modify: `Homebase/Homebase/Features/Notes/NoteRowView.swift`

**Step 1: Add SwiftData import and context**

Add import:

```swift
import SwiftData
```

Add environment property inside the struct:

```swift
@Environment(\.modelContext) private var context
```

**Step 2: Add subtitle below the note title**

Wrap the existing title Text/TextField and add subtitle. Replace the current inline editing block and the text display with a VStack. After `Spacer()` and before the child count section, the layout stays the same. The change is to wrap the title portion in a VStack.

Find the section after the bullet/chevron and before `Spacer()`. Replace:

```swift
if isEditing {
    TextField("Note", text: $editText, onCommit: {
        note.title = editText
        note.touch()
        isEditing = false
    })
    .font(HBTheme.titleFont)
} else {
    Text(note.title.isEmpty ? "Untitled" : note.title)
        .font(HBTheme.titleFont)
        .foregroundStyle(note.title.isEmpty ? HBTheme.textTertiary : HBTheme.textPrimary)
        .onTapGesture { editText = note.title; isEditing = true }
}
```

With:

```swift
VStack(alignment: .leading, spacing: 2) {
    if isEditing {
        TextField("Note", text: $editText, onCommit: {
            note.title = editText
            note.touch()
            isEditing = false
        })
        .font(HBTheme.titleFont)
    } else {
        Text(note.title.isEmpty ? "Untitled" : note.title)
            .font(HBTheme.titleFont)
            .foregroundStyle(note.title.isEmpty ? HBTheme.textTertiary : HBTheme.textPrimary)
            .onTapGesture { editText = note.title; isEditing = true }
    }

    if let subtitle = EntityResolver.subtitle(for: note, in: context) {
        Text(subtitle)
            .font(HBTheme.subtitleFont)
            .foregroundStyle(HBTheme.textTertiary)
            .lineLimit(1)
    }
}
```

**Step 3: Commit**

```bash
git add Homebase/Homebase/Features/Notes/NoteRowView.swift
git commit -m "feat(ios): show entity subtitle in NoteRowView"
```

---

### Task 5: OutlinerView — add Edit swipe action for notes

**Files:**
- Modify: `Homebase/Homebase/Features/Notes/OutlinerView.swift`

**Step 1: Add state for edit sheet**

Add a @State property in OutlinerView:

```swift
@State private var editingNoteId: String?
```

**Step 2: Add Edit swipe action**

In the `.swipeActions(edge: .trailing)` block, add a new Edit button before the Outdent button:

```swift
.swipeActions(edge: .trailing) {
    Button { editingNoteId = note.id } label: { Label("Edit", systemImage: "pencil") }
        .tint(HBTheme.accent)
    Button { outdentNote(note) } label: { Label("Outdent", systemImage: "arrow.left") }
        .tint(.orange)
    Button(role: .destructive) { deleteNote(note) } label: { Label("Delete", systemImage: "trash") }
}
```

**Step 3: Add sheet presentation**

Add `.sheet` modifier on the List, after `.environment(\.editMode, $editMode)`:

```swift
.sheet(item: $editingNoteId) { noteId in
    TaskDetailView(taskId: noteId, context: context)
}
```

This requires `editingNoteId` to work with `.sheet(item:)`. Since `String` doesn't conform to `Identifiable`, we need a small wrapper. Instead, use `.sheet(isPresented:)` with an `onChange`:

Actually simpler: make `editingNoteId` a `String?` and use the existing pattern. Add this extension at the bottom of OutlinerView.swift file:

```swift
extension String: @retroactive Identifiable {
    public var id: String { self }
}
```

Then the `.sheet(item: $editingNoteId)` pattern works directly.

**Step 4: Commit**

```bash
git add Homebase/Homebase/Features/Notes/OutlinerView.swift
git commit -m "feat(ios): add Edit swipe action to notes outliner"
```

---

### Task 6: EntityDetailView — stats + filtered list

**Files:**
- Create: `Homebase/Homebase/Features/Entities/EntityDetailView.swift`

**Step 1: Create the EntityDetailView**

```swift
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
        allTasks.filter { task in
            !task.isNote && matchesEntity(task)
        }
    }

    private var relatedNotes: [HBTask] {
        allTasks.filter { task in
            task.isNote && task.noteLifecycleState == "active" && matchesEntity(task)
        }
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

    @State private var editingTaskId: String?

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
```

**Step 2: Commit**

```bash
git add Homebase/Homebase/Features/Entities/EntityDetailView.swift
git commit -m "feat(ios): add EntityDetailView with stats dashboard"
```

---

### Task 7: EntityListView — make rows tappable → navigate to detail

**Files:**
- Modify: `Homebase/Homebase/Features/Entities/EntityListView.swift`

**Step 1: Update AreaListView**

Replace the `ForEach` content — wrap each area row in a `NavigationLink`:

```swift
ForEach(areas, id: \.id) { area in
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
```

**Step 2: Update LabelListView**

Replace the `ForEach` content:

```swift
ForEach(labels, id: \.id) { label in
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
```

**Step 3: Update PersonListView**

Replace the `ForEach` content:

```swift
ForEach(people, id: \.id) { person in
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
```

**Step 4: Update CategoryListView**

Replace the `ForEach` content:

```swift
ForEach(categories, id: \.id) { category in
    NavigationLink {
        EntityDetailView(entityType: .category(category.id))
    } label: {
        HStack {
            Text(category.name)
            Spacer()
        }
    }
}
```

**Step 5: Commit**

```bash
git add Homebase/Homebase/Features/Entities/EntityListView.swift
git commit -m "feat(ios): make entity list rows navigate to detail view"
```

---

### Task 8: Final commit — bump and push

**Step 1: Add all files and commit**

```bash
git add -A
git commit -m "feat(ios): entity assignments & detail pages complete"
```

**Step 2: Push**

```bash
git pull --rebase && git push
```
