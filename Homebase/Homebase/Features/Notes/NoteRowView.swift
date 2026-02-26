import SwiftUI
import SwiftData

struct NoteRowView: View {
    let note: HBTask
    let childCount: Int
    let onZoomIn: () -> Void
    @Environment(EntityCache.self) private var entityCache
    @State private var isEditing = false
    @State private var editText = ""

    var body: some View {
        HStack(spacing: 8) {
            if childCount > 0 {
                Button(action: onZoomIn) {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12))
                        .foregroundStyle(HBTheme.textTertiary)
                }
                .buttonStyle(.plain)
            } else {
                Circle()
                    .fill(HBTheme.textTertiary)
                    .frame(width: 5, height: 5)
                    .padding(.horizontal, 4)
            }

            VStack(alignment: .leading, spacing: 2) {
                if isEditing {
                    TextField("Note", text: $editText, onCommit: {
                        note.title = editText
                        note.touch()
                        isEditing = false
                    })
                    .font(HBTheme.titleFont)
                } else {
                    Text(note.title.isEmpty ? "Untitled" : note.title)
                        .font(HBTheme.titleFont)
                        .foregroundStyle(note.title.isEmpty ? HBTheme.textTertiary : HBTheme.textPrimary)
                        .onTapGesture { editText = note.title; isEditing = true }
                }

                if let subtitle = entityCache.subtitle(for: note) {
                    Text(subtitle)
                        .font(HBTheme.subtitleFont)
                        .foregroundStyle(HBTheme.textTertiary)
                        .lineLimit(1)
                }
            }

            Spacer()

            if childCount > 0 {
                Text("\(childCount)")
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
        .padding(.leading, CGFloat(note.indent) * 16)
    }
}
