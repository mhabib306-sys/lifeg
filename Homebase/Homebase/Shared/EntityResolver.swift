import Foundation
import SwiftData

enum EntityResolver {
    static func areaName(for id: String?, in context: ModelContext) -> String? {
        guard let id else { return nil }
        let descriptor = FetchDescriptor<HBArea>(predicate: #Predicate { $0.id == id })
        return (try? context.fetch(descriptor))?.first?.name
    }

    static func categoryName(for id: String?, in context: ModelContext) -> String? {
        guard let id else { return nil }
        let descriptor = FetchDescriptor<HBCategory>(predicate: #Predicate { $0.id == id })
        return (try? context.fetch(descriptor))?.first?.name
    }

    static func labelNames(for ids: [String], in context: ModelContext) -> [String] {
        guard !ids.isEmpty else { return [] }
        let descriptor = FetchDescriptor<HBLabel>()
        let all = (try? context.fetch(descriptor)) ?? []
        return all.filter { ids.contains($0.id) }.map(\.name)
    }

    static func personNames(for ids: [String], in context: ModelContext) -> [String] {
        guard !ids.isEmpty else { return [] }
        let descriptor = FetchDescriptor<HBPerson>()
        let all = (try? context.fetch(descriptor)) ?? []
        return all.filter { ids.contains($0.id) }.map(\.name)
    }

    static func subtitle(for task: HBTask, in context: ModelContext) -> String? {
        var parts: [String] = []
        if let name = areaName(for: task.areaId, in: context) { parts.append(name) }
        if let name = categoryName(for: task.categoryId, in: context) { parts.append(name) }
        parts.append(contentsOf: labelNames(for: task.labels, in: context))
        parts.append(contentsOf: personNames(for: task.people, in: context).map { "@\($0)" })
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }
}
