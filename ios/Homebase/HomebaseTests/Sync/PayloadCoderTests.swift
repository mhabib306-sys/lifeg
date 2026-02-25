import XCTest
@testable import Homebase

final class PayloadCoderTests: XCTestCase {

    let minimalPayload = """
    {
        "_schemaVersion": 1,
        "_sequence": 42,
        "_checksum": "abc123",
        "lastUpdated": "2026-02-25T10:00:00.000Z",
        "tasks": [
            {
                "id": "task_001",
                "title": "Buy milk",
                "notes": "",
                "status": "inbox",
                "today": false,
                "flagged": false,
                "completed": false,
                "completedAt": null,
                "labels": [],
                "people": [],
                "isNote": false,
                "noteLifecycleState": "",
                "indent": 0,
                "order": 0,
                "isProject": false,
                "createdAt": "2026-02-25T09:00:00.000Z",
                "updatedAt": "2026-02-25T09:00:00.000Z"
            }
        ],
        "taskCategories": [],
        "categories": [],
        "taskLabels": [],
        "taskPeople": [],
        "customPerspectives": [],
        "deletedTaskTombstones": {},
        "deletedEntityTombstones": {},
        "data": {},
        "weights": {},
        "xp": {"total": 100, "history": []}
    }
    """.data(using: .utf8)!

    func testDecodePayload() throws {
        let payload = try PayloadCoder.decode(minimalPayload)
        XCTAssertEqual(payload.schemaVersion, 1)
        XCTAssertEqual(payload.sequence, 42)
        XCTAssertEqual(payload.tasks.count, 1)
        XCTAssertEqual(payload.tasks[0].id, "task_001")
        XCTAssertEqual(payload.tasks[0].title, "Buy milk")
    }

    func testPreservesUnknownFields() throws {
        let payload = try PayloadCoder.decode(minimalPayload)
        // "xp", "data", "weights" are unknown to iOS v1
        // They must survive round-trip
        let encoded = try PayloadCoder.encode(payload)
        let reparsed = try JSONSerialization.jsonObject(with: encoded) as! [String: Any]
        XCTAssertNotNil(reparsed["xp"])
        XCTAssertNotNil(reparsed["data"])
        XCTAssertNotNil(reparsed["weights"])
    }

    func testEncodeSetsChecksum() throws {
        var payload = try PayloadCoder.decode(minimalPayload)
        payload.sequence = 43
        let encoded = try PayloadCoder.encode(payload)
        let reparsed = try JSONSerialization.jsonObject(with: encoded) as! [String: Any]
        let checksum = reparsed["_checksum"] as! String
        XCTAssertFalse(checksum.isEmpty)
        XCTAssertNotEqual(checksum, "abc123") // Should be recomputed
    }

    func testDecodeTombstones() throws {
        let json = """
        {
            "_schemaVersion": 1, "_sequence": 1, "_checksum": "", "lastUpdated": "",
            "tasks": [],
            "taskCategories": [], "categories": [], "taskLabels": [], "taskPeople": [],
            "customPerspectives": [],
            "deletedTaskTombstones": {"task_old": "2026-01-01T00:00:00.000Z"},
            "deletedEntityTombstones": {"taskLabels": {"label_x": "2026-01-15T00:00:00.000Z"}}
        }
        """.data(using: .utf8)!
        let payload = try PayloadCoder.decode(json)
        XCTAssertEqual(payload.deletedTaskTombstones["task_old"], "2026-01-01T00:00:00.000Z")
        XCTAssertEqual(payload.deletedEntityTombstones["taskLabels"]?["label_x"], "2026-01-15T00:00:00.000Z")
    }
}
