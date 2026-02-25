import Foundation
import SwiftData

@Model
final class HBCategory {
    @Attribute(.unique) var id: String
    var name: String
    var areaId: String
    var color: String?
    var emoji: String?
    var order: Int
    var createdAt: Date
    var updatedAt: Date

    init(name: String, areaId: String, color: String? = nil, emoji: String? = nil, order: Int = 0) {
        self.id = HBTask.generateId(prefix: "cat")
        self.name = name
        self.areaId = areaId
        self.color = color
        self.emoji = emoji
        self.order = order
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    func touch() { updatedAt = Date() }
}
