import Foundation
import SwiftData

@Model
final class HBPerspective {
    @Attribute(.unique) var id: String
    var name: String
    var icon: String
    var color: String
    var filterData: Data   // JSON-encoded FilterDefinition
    var emoji: String?
    var order: Int
    var createdAt: Date
    var updatedAt: Date

    init(name: String, icon: String, color: String, filter: FilterDefinition, order: Int = 0) {
        self.id = HBTask.generateId(prefix: "persp")
        self.name = name
        self.icon = icon
        self.color = color
        self.filterData = try! JSONEncoder().encode(filter)
        self.emoji = nil
        self.order = order
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    var filterDefinition: FilterDefinition? {
        try? JSONDecoder().decode(FilterDefinition.self, from: filterData)
    }

    func touch() { updatedAt = Date() }
}
