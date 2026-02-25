import SwiftUI
import SwiftData

struct OutlinerView: View {
    @Query(filter: #Predicate<HBTask> { $0.isNote && $0.noteLifecycleState == "active" })
    private var allNotes: [HBTask]

    @State private var breadcrumb: [String] = [] // Stack of parent IDs
    @State private var editMode: EditMode = .inactive
    @State private var editingNoteId: String?
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync

    private var currentParentId: String? { breadcrumb.last }

    private var visibleNotes: [HBTask] {
        if let parentId = currentParentId {
            return OutlinerEngine.children(of: parentId, in: allNotes)
        }
        return OutlinerEngine.rootNotes(from: allNotes)
    }

    var body: some View {
        List {
            ForEach(visibleNotes, id: \.id) { note in
                NoteRowView(
                    note: note,
                    childCount: OutlinerEngine.children(of: note.id, in: allNotes).count,
                    onZoomIn: { breadcrumb.append(note.id) }
                )
                .swipeActions(edge: .leading) {
                    Button { indentNote(note) } label: { Label("Indent", systemImage: "arrow.right") }
                        .tint(.blue)
                }
                .swipeActions(edge: .trailing) {
                    Button { editingNoteId = note.id } label: { Label("Edit", systemImage: "pencil") }
                        .tint(HBTheme.accent)
                    Button { outdentNote(note) } label: { Label("Outdent", systemImage: "arrow.left") }
                        .tint(.orange)
                    Button(role: .destructive) { deleteNote(note) } label: { Label("Delete", systemImage: "trash") }
                }
            }
            .onMove { source, destination in
                moveNote(from: source, to: destination)
            }
        }
        .listStyle(.plain)
        .navigationTitle(currentTitle)
        .environment(\.editMode, $editMode)
        .sheet(item: $editingNoteId) { noteId in
            TaskDetailView(taskId: noteId, context: context)
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button { addNote() } label: { Image(systemName: "plus") }
            }
            ToolbarItem(placement: .topBarLeading) {
                EditButton()
            }
            if !breadcrumb.isEmpty {
                ToolbarItem(placement: .navigation) {
                    Button { breadcrumb.removeLast() } label: {
                        Image(systemName: "chevron.left")
                    }
                }
            }
        }
    }

    private var currentTitle: String {
        if let parentId = currentParentId,
           let parent = allNotes.first(where: { $0.id == parentId }) {
            return parent.title
        }
        return "Notes"
    }

    private func addNote() {
        let note = HBTask.createNote(title: "")
        note.parentId = currentParentId
        note.indent = breadcrumb.count
        note.order = visibleNotes.count
        context.insert(note)
        sync.engine.markDirty()
    }

    private func moveNote(from source: IndexSet, to destination: Int) {
        var notes = visibleNotes
        notes.move(fromOffsets: source, toOffset: destination)
        for (index, note) in notes.enumerated() {
            note.order = index
            note.touch()
        }
        sync.engine.markDirty()
    }

    private func indentNote(_ note: HBTask) {
        var notes = allNotes
        OutlinerEngine.indent(note: note, allNotes: &notes)
        sync.engine.markDirty()
    }

    private func outdentNote(_ note: HBTask) {
        var notes = allNotes
        OutlinerEngine.outdent(note: note, allNotes: &notes)
        sync.engine.markDirty()
    }

    private func deleteNote(_ note: HBTask) {
        var notes = allNotes
        OutlinerEngine.deleteNote(note, allNotes: &notes)
        sync.engine.markDirty()
    }
}
