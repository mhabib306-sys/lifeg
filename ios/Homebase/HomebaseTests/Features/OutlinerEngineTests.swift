import XCTest
@testable import Homebase

final class OutlinerEngineTests: XCTestCase {

    func testGetRootNotes() {
        let root = makeNote(parentId: nil, indent: 0, order: 0)
        let child = makeNote(parentId: root.id, indent: 1, order: 0)
        let result = OutlinerEngine.rootNotes(from: [root, child])
        XCTAssertEqual(result.count, 1)
        XCTAssertEqual(result[0].id, root.id)
    }

    func testGetChildren() {
        let parent = makeNote(parentId: nil, indent: 0, order: 0)
        let child1 = makeNote(parentId: parent.id, indent: 1, order: 0)
        let child2 = makeNote(parentId: parent.id, indent: 1, order: 1)
        let grandchild = makeNote(parentId: child1.id, indent: 2, order: 0)

        let children = OutlinerEngine.children(of: parent.id, in: [parent, child1, child2, grandchild])
        XCTAssertEqual(children.count, 2)
    }

    func testIndent() {
        var notes = [
            makeNote(parentId: nil, indent: 0, order: 0),
            makeNote(parentId: nil, indent: 0, order: 1),
        ]
        let target = notes[1]
        let sibling = notes[0]

        OutlinerEngine.indent(note: target, allNotes: &notes)
        XCTAssertEqual(target.parentId, sibling.id)
        XCTAssertEqual(target.indent, 1)
    }

    func testOutdent() {
        let parent = makeNote(parentId: nil, indent: 0, order: 0)
        let child = makeNote(parentId: parent.id, indent: 1, order: 0)
        var notes = [parent, child]

        OutlinerEngine.outdent(note: child, allNotes: &notes)
        XCTAssertNil(child.parentId)
        XCTAssertEqual(child.indent, 0)
    }

    private func makeNote(parentId: String?, indent: Int, order: Int) -> HBTask {
        let note = HBTask.createNote(title: "Note \(order)")
        note.parentId = parentId
        note.indent = indent
        note.order = order
        return note
    }
}
