import SwiftUI
import SwiftData

enum HBTheme {
    // Things 3 exact palette — Step 2
    static let background = Color(hex: "#FFFFFF")
    static let secondaryBackground = Color(hex: "#F7F6F3")  // Warm tint
    static let sidebar = Color(hex: "#F2F1ED")               // Warmer

    static let textPrimary = Color(hex: "#1A1A1A")           // Darker
    static let textSecondary = Color(hex: "#8E8E93")         // iOS system gray
    static let textTertiary = Color(hex: "#AEAEB2")          // iOS system gray 3

    static let accent = Color(hex: "#357EDD")                // Things warmer blue
    static let today = Color(hex: "#FFCC00")                 // Pure gold star
    static let flagged = Color(hex: "#FF9F0A")               // Slightly warmer

    static let inbox = Color(hex: "#4A90D9")                 // Things inbox blue
    static let anytime = Color(hex: "#6EC8FA")
    static let someday = Color(hex: "#C3A978")
    static let logbook = Color(hex: "#7DC67B")
    static let upcoming = Color(hex: "#EA4E3D")

    static let separator = Color(hex: "#E5E5EA")
    static let checkboxBorder = Color(hex: "#C7C7CC")
    static let checkboxFill = Color(hex: "#357EDD")          // Match accent

    // Editing state
    static let editingBackground = Color(hex: "#F7F6F3")     // Warm gray, matches secondaryBackground
    static let editingShadow = Color.black.opacity(0.06)

    // Canonical spring animations
    static let springDefault: Animation = .spring(response: 0.35, dampingFraction: 0.8)
    static let springSnappy: Animation = .spring(response: 0.25, dampingFraction: 0.7)
    static let springGentle: Animation = .spring(response: 0.45, dampingFraction: 0.85)

    // Typography — upgraded
    static let titleFont = Font.system(.body, weight: .regular)
    static let subtitleFont = Font.system(.footnote, weight: .regular)
    static let headerFont = Font.system(.title2, weight: .bold)
    static let badgeFont = Font.system(.caption2, weight: .medium)
    static let sidebarFont = Font.system(.body, weight: .medium)
    static let editorTitleFont = Font.system(.title2, weight: .semibold)
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
