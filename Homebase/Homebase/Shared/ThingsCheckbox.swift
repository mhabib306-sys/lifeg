import SwiftUI

// MARK: - Things 3 Checkbox Component

struct ThingsCheckbox: View {
    let isCompleted: Bool
    var accentColor: Color = HBTheme.checkboxFill
    let onToggle: () -> Void

    var body: some View {
        Button {
            onToggle()
        } label: {
            Circle()
                .strokeBorder(isCompleted ? accentColor : HBTheme.checkboxBorder, lineWidth: 1.5)
                .background(Circle().fill(isCompleted ? accentColor : .clear))
                .frame(width: 22, height: 22)
                .overlay {
                    if isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 11, weight: .heavy))
                            .foregroundStyle(.white)
                            .transition(.scale(scale: 0.3).combined(with: .opacity))
                    }
                }
        }
        .buttonStyle(.plain)
        .frame(width: 44, height: 44)
        .contentShape(Rectangle())
    }
}
