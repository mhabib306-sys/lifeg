import SwiftUI

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
