import Foundation
import SwiftData

@Model
final class HBLabel {
    @Attribute(.unique) var id: String
    var name: String
    var color: String
    var emoji: String?
    var order: Int
    var createdAt: Date
    var updatedAt: Date

    init(name: String, color: String, emoji: String? = nil, order: Int = 0) {
        self.id = HBTask.generateId(prefix: "label")
        self.name = name
        self.color = color
        self.emoji = emoji
        self.order = order
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    func touch() { updatedAt = Date() }
}
