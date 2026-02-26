import SwiftUI

// Things 3 style icon badges

struct PerspectiveRow: View {
    let perspective: PerspectiveType
    let count: Int

    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 6)
                .fill(perspective.color)
                .frame(width: 28, height: 28)
                .overlay {
                    Image(systemName: perspective.icon)
                        .font(.system(size: 13, weight: .semibold))
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
        .padding(.vertical, 2)
    }
}
