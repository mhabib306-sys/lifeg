import UIKit

// MARK: - Haptic Feedback Engine (Things 3 minimal style)

@MainActor
enum Haptic {
    static func taskCompleted() {
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(.success)
    }

    static func checkboxTap() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.prepare()
        generator.impactOccurred()
    }

    static func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.prepare()
        generator.selectionChanged()
    }

    static func lightTap() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.prepare()
        generator.impactOccurred(intensity: 0.5)
    }

    // No-ops: Things 3 doesn't haptic on edit start/cancel
    static func editStart() {}
    static func editCancel() {}
}
