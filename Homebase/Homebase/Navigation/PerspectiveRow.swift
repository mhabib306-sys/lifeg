import SwiftUI

struct PerspectiveRow: View {
    let perspective: PerspectiveType
    let count: Int

    var body: some View {
        HStack {
            Image(systemName: perspective.icon)
                .foregroundStyle(perspective.color)
                .frame(width: 28)
            Text(perspective.displayName)
                .font(HBTheme.titleFont)
            Spacer()
            if count > 0 {
                Text("\(count)")
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
    }
}
