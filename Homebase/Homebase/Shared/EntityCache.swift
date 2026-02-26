import SwiftUI
import SwiftData

// MARK: - Step 1: EntityCache — Kill Per-Row DB Queries

@MainActor @Observable
final class EntityCache {
    private(set) var areas: [String: HBArea] = [:]
    private(set) var categories: [String: HBCategory] = [:]
    private(set) var labels: [String: HBLabel] = [:]
    private(set) var people: [String: HBPerson] = [:]
    private var loaded = false

    func loadIfNeeded(from context: ModelContext) {
        guard !loaded else { return }
        reload(from: context)
    }

    func reload(from context: ModelContext) {
        let allAreas = (try? context.fetch(FetchDescriptor<HBArea>())) ?? []
        areas = Dictionary(uniqueKeysWithValues: allAreas.map { ($0.id, $0) })

        let allCategories = (try? context.fetch(FetchDescriptor<HBCategory>())) ?? []
        categories = Dictionary(uniqueKeysWithValues: allCategories.map { ($0.id, $0) })

        let allLabels = (try? context.fetch(FetchDescriptor<HBLabel>())) ?? []
        labels = Dictionary(uniqueKeysWithValues: allLabels.map { ($0.id, $0) })

        let allPeople = (try? context.fetch(FetchDescriptor<HBPerson>())) ?? []
        people = Dictionary(uniqueKeysWithValues: allPeople.map { ($0.id, $0) })

        loaded = true
    }

    func invalidate() {
        loaded = false
    }

    func subtitle(for task: HBTask) -> String? {
        var parts: [String] = []
        if let areaId = task.areaId, let area = areas[areaId] {
            parts.append(area.name)
        }
        if let catId = task.categoryId, let cat = categories[catId] {
            parts.append(cat.name)
        }
        for labelId in task.labels {
            if let label = labels[labelId] { parts.append(label.name) }
        }
        for personId in task.people {
            if let person = people[personId] { parts.append("@\(person.name)") }
        }
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }

    func areaName(for id: String?) -> String? {
        guard let id else { return nil }
        return areas[id]?.name
    }

    func categoryName(for id: String?) -> String? {
        guard let id else { return nil }
        return categories[id]?.name
    }

    func labelNames(for ids: [String]) -> [String] {
        ids.compactMap { labels[$0]?.name }
    }

    func personNames(for ids: [String]) -> [String] {
        ids.compactMap { people[$0]?.name }
    }

    func entityName(for entityType: EntityType) -> String {
        switch entityType {
        case .area(let id): return areas[id]?.name ?? "Area"
        case .category(let id): return categories[id]?.name ?? "Category"
        case .label(let id): return labels[id]?.name ?? "Label"
        case .person(let id): return people[id]?.name ?? "Person"
        }
    }
}
