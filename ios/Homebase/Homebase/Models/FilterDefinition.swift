import Foundation

struct FilterDefinition: Codable, Equatable {
    enum MatchMode: String, Codable { case all, any, none }
    enum Availability: String, Codable { case available, remaining, completed }

    var matchMode: MatchMode
    var availability: Availability
    var areaIds: [String]?
    var statusValues: [String]?
    var labelIds: [String]?
    var peopleIds: [String]?
    var duePresence: String?       // "has-due" | "no-due"
    var deferPresence: String?     // "has-defer" | "no-defer"
    var repeating: Bool?
    var untagged: Bool?
    var inboxOnly: Bool?
    var searchTerms: [String]?
}
