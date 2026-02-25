import Foundation
import SwiftData

@Model
final class HBTombstone {
    @Attribute(.unique) var id: String  // "<collection>::<entityId>"
    var collection: String
    var entityId: String
    var deletedAt: Date

    init(collection: String, entityId: String) {
        self.id = "\(collection)::\(entityId)"
        self.collection = collection
        self.entityId = entityId
        self.deletedAt = Date()
    }

    func isExpired(ttlDays: Int) -> Bool {
        let cutoff = Calendar.current.date(byAdding: .day, value: -ttlDays, to: Date())!
        return deletedAt < cutoff
    }
}
