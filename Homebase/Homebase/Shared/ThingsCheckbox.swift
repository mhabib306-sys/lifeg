import SwiftUI

// MARK: - Step 3: Things 3 Checkbox Component

struct ThingsCheckbox: View {
    let isCompleted: Bool
    var accentColor: Color = HBTheme.checkboxFill
    let onToggle: () -> Void

    @State private var animateCheck = false

    var body: some View {
        Button {
            onToggle()
            if !isCompleted {
                // Trigger spring pop animation
                withAnimation(HBTheme.springSnappy) {
                    animateCheck = true
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    animateCheck = false
                }
            }
            Haptic.checkboxTap()
        } label: {
            Circle()
                .strokeBorder(isCompleted ? accentColor : HBTheme.checkboxBorder, lineWidth: 2)
                .background(Circle().fill(isCompleted ? accentColor : .clear))
                .frame(width: 24, height: 24)
                .overlay {
                    if isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 12, weight: .heavy))
                            .foregroundStyle(.white)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .scaleEffect(animateCheck ? 1.15 : 1.0)
        }
        .buttonStyle(.plain)
    }
}
