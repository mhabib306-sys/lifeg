import Foundation

enum OutlinerEngine {
    static func rootNotes(from notes: [HBTask]) -> [HBTask] {
        notes.filter { $0.isNote && $0.noteLifecycleState == "active" && $0.parentId == nil }
            .sorted { $0.order < $1.order }
    }

    static func children(of parentId: String, in notes: [HBTask]) -> [HBTask] {
        notes.filter { $0.isNote && $0.noteLifecycleState == "active" && $0.parentId == parentId }
            .sorted { $0.order < $1.order }
    }

    static func indent(note: HBTask, allNotes: inout [HBTask]) {
        // Find the sibling directly above (same parent, lower order)
        let siblings = allNotes.filter { $0.parentId == note.parentId && $0.id != note.id && $0.order < note.order }
            .sorted { $0.order < $1.order }
        guard let newParent = siblings.last else { return } // Can't indent if no sibling above

        note.parentId = newParent.id
        note.indent += 1
        note.order = children(of: newParent.id, in: allNotes).count
        note.touch()
    }

    static func outdent(note: HBTask, allNotes: inout [HBTask]) {
        guard let currentParentId = note.parentId else { return } // Already root
        let parent = allNotes.first { $0.id == currentParentId }

        note.parentId = parent?.parentId
        note.indent = max(0, note.indent - 1)
        note.touch()
    }

    static func reorder(note: HBTask, to newOrder: Int, in allNotes: inout [HBTask]) {
        let siblings = allNotes.filter { $0.parentId == note.parentId && $0.id != note.id }
            .sorted { $0.order < $1.order }
        note.order = newOrder
        // Reindex siblings
        for (i, sibling) in siblings.enumerated() {
            let idx = i >= newOrder ? i + 1 : i
            sibling.order = idx
        }
        note.touch()
    }

    static func deleteNote(_ note: HBTask, allNotes: inout [HBTask]) {
        note.noteLifecycleState = "deleted"
        note.touch()
        // Recursively soft-delete children
        let kids = children(of: note.id, in: allNotes)
        for kid in kids {
            deleteNote(kid, allNotes: &allNotes)
        }
    }
}
