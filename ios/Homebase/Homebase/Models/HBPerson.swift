import Foundation
import SwiftData

@Model
final class HBPerson {
    @Attribute(.unique) var id: String
    var name: String
    var email: String
    var jobTitle: String?
    var photoUrl: String?
    var photoData: String?
    var order: Int
    var createdAt: Date
    var updatedAt: Date

    init(name: String, email: String = "", jobTitle: String? = nil, order: Int = 0) {
        self.id = HBTask.generateId(prefix: "person")
        self.name = name
        self.email = email
        self.jobTitle = jobTitle
        self.order = order
        let now = Date()
        self.createdAt = now
        self.updatedAt = now
    }

    func touch() { updatedAt = Date() }
}
