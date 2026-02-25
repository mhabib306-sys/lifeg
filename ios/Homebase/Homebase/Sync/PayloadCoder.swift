import Foundation
import CryptoKit

struct TaskDTO: Codable {
    var id: String
    var title: String
    var notes: String?
    var status: String?
    var today: Bool?
    var flagged: Bool?
    var completed: Bool?
    var completedAt: String?
    var areaId: String?
    var categoryId: String?
    var labels: [String]?
    var people: [String]?
    var deferDate: String?
    var dueDate: String?
    var repeatType: String?
    var repeatInterval: Int?
    var repeatFrom: String?
    var isNote: Bool?
    var noteLifecycleState: String?
    var noteHistory: [[String: AnyCodable]]?
    var parentId: String?
    var indent: Int?
    var order: Int?
    var isProject: Bool?
    var projectId: String?
    var projectType: String?
    var waitingFor: [String: AnyCodable]?
    var timeEstimate: Int?
    var meetingEventKey: String?
    var createdAt: String?
    var updatedAt: String?
}

struct EntityDTO: Codable {
    var id: String
    var name: String
    var color: String?
    var emoji: String?
    var order: Int?
    var areaId: String?
    var email: String?
    var jobTitle: String?
    var photoUrl: String?
    var photoData: String?
    var createdAt: String?
    var updatedAt: String?
    // Perspective-specific
    var icon: String?
    var filter: [String: AnyCodable]?
}

struct CloudPayload {
    var schemaVersion: Int
    var sequence: Int
    var checksum: String
    var lastUpdated: String

    var tasks: [TaskDTO]
    var areas: [EntityDTO]          // "taskCategories" in JSON
    var categories: [EntityDTO]     // "categories" in JSON
    var labels: [EntityDTO]         // "taskLabels" in JSON
    var people: [EntityDTO]         // "taskPeople" in JSON
    var perspectives: [EntityDTO]   // "customPerspectives" in JSON

    var deletedTaskTombstones: [String: String]
    var deletedEntityTombstones: [String: [String: String]]

    // Everything else — preserved on round-trip
    var passthrough: [String: Any]
}

enum PayloadCoder {
    private static let knownKeys: Set<String> = [
        "_schemaVersion", "_sequence", "_checksum", "lastUpdated",
        "tasks", "taskCategories", "categories", "taskLabels", "taskPeople",
        "customPerspectives", "deletedTaskTombstones", "deletedEntityTombstones"
    ]

    static func decode(_ data: Data) throws -> CloudPayload {
        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        let decoder = JSONDecoder()

        func decodeArray<T: Decodable>(_ key: String) -> [T] {
            guard let arr = json[key] else { return [] }
            guard let data = try? JSONSerialization.data(withJSONObject: arr) else { return [] }
            return (try? decoder.decode([T].self, from: data)) ?? []
        }

        let tombstones = json["deletedTaskTombstones"] as? [String: String] ?? [:]
        let entityTombstones = json["deletedEntityTombstones"] as? [String: [String: String]] ?? [:]

        var passthrough: [String: Any] = [:]
        for (key, value) in json where !knownKeys.contains(key) {
            passthrough[key] = value
        }

        return CloudPayload(
            schemaVersion: json["_schemaVersion"] as? Int ?? 1,
            sequence: json["_sequence"] as? Int ?? 0,
            checksum: json["_checksum"] as? String ?? "",
            lastUpdated: json["lastUpdated"] as? String ?? "",
            tasks: decodeArray("tasks"),
            areas: decodeArray("taskCategories"),
            categories: decodeArray("categories"),
            labels: decodeArray("taskLabels"),
            people: decodeArray("taskPeople"),
            perspectives: decodeArray("customPerspectives"),
            deletedTaskTombstones: tombstones,
            deletedEntityTombstones: entityTombstones,
            passthrough: passthrough
        )
    }

    static func encode(_ payload: CloudPayload) throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]

        var json: [String: Any] = payload.passthrough

        json["_schemaVersion"] = payload.schemaVersion
        json["_sequence"] = payload.sequence
        json["lastUpdated"] = payload.lastUpdated

        func encodeArray<T: Encodable>(_ items: [T]) -> Any {
            let data = try! encoder.encode(items)
            return try! JSONSerialization.jsonObject(with: data)
        }

        json["tasks"] = encodeArray(payload.tasks)
        json["taskCategories"] = encodeArray(payload.areas)
        json["categories"] = encodeArray(payload.categories)
        json["taskLabels"] = encodeArray(payload.labels)
        json["taskPeople"] = encodeArray(payload.people)
        json["customPerspectives"] = encodeArray(payload.perspectives)
        json["deletedTaskTombstones"] = payload.deletedTaskTombstones
        json["deletedEntityTombstones"] = payload.deletedEntityTombstones

        // Compute checksum: serialize without _checksum, then SHA-256
        json.removeValue(forKey: "_checksum")
        let checksumData = try JSONSerialization.data(withJSONObject: json, options: [.sortedKeys])
        let hash = SHA256.hash(data: checksumData)
        let checksum = hash.map { String(format: "%02x", $0) }.joined()

        json["_checksum"] = checksum

        return try JSONSerialization.data(withJSONObject: json, options: [.sortedKeys])
    }
}
