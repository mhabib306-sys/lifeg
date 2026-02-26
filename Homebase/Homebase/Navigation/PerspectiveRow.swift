import SwiftUI

// Step 6: Sidebar Redesign — Things 3 style icon badges

struct PerspectiveRow: View {
    let perspective: PerspectiveType
    let count: Int

    var body: some View {
        HStack(spacing: 12) {
            // Icon in colored rounded rectangle
            RoundedRectangle(cornerRadius: 8)
                .fill(perspective.color)
                .frame(width: 32, height: 32)
                .overlay {
                    Image(systemName: perspective.icon)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white)
                }

            Text(perspective.displayName)
                .font(HBTheme.sidebarFont)

            Spacer()

            if count > 0 {
                Text("\(count)")
                    .font(.system(.subheadline, weight: .regular))
                    .monospacedDigit()
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
        .padding(.vertical, 4)
    }
}
