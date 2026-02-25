import SwiftUI
import SwiftData

enum HBTheme {
    // Things 3-inspired palette
    static let background = Color(hex: "#FFFFFF")
    static let secondaryBackground = Color(hex: "#F5F5F5")
    static let sidebar = Color(hex: "#F0EFF4")

    static let textPrimary = Color(hex: "#262626")
    static let textSecondary = Color(hex: "#808080")
    static let textTertiary = Color(hex: "#B0B0B0")

    static let accent = Color(hex: "#007AFF")        // Things blue
    static let today = Color(hex: "#FFD426")          // Things yellow star
    static let flagged = Color(hex: "#FF9503")         // Orange flag

    static let inbox = Color(hex: "#307BF6")
    static let anytime = Color(hex: "#6EC8FA")
    static let someday = Color(hex: "#C3A978")
    static let logbook = Color(hex: "#7DC67B")
    static let upcoming = Color(hex: "#EA4E3D")

    static let separator = Color(hex: "#E5E5EA")
    static let checkboxBorder = Color(hex: "#C7C7CC")
    static let checkboxFill = Color(hex: "#007AFF")

    // Typography
    static let titleFont = Font.system(.body, weight: .regular)
    static let subtitleFont = Font.system(.footnote, weight: .regular)
    static let headerFont = Font.system(.title3, weight: .semibold)
    static let badgeFont = Font.system(.caption2, weight: .medium)
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: .init(charactersIn: "#"))
        let scanner = Scanner(string: hex)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255,
            green: Double((rgb >> 8) & 0xFF) / 255,
            blue: Double(rgb & 0xFF) / 255
        )
    }
}

// MARK: - String + Identifiable (for sheet(item:) with String?)

extension String: @retroactive Identifiable {
    public var id: String { self }
}

// MARK: - EntityResolver

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
