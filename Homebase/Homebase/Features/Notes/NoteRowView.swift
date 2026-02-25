import SwiftUI
import SwiftData

struct NoteRowView: View {
    let note: HBTask
    let childCount: Int
    let onZoomIn: () -> Void
    @Environment(\.modelContext) private var context
    @State private var isEditing = false
    @State private var editText = ""

    private var entitySubtitle: String? {
        var parts: [String] = []
        if let areaId = note.areaId {
            let d = FetchDescriptor<HBArea>(predicate: #Predicate { $0.id == areaId })
            if let name = (try? context.fetch(d))?.first?.name { parts.append(name) }
        }
        if let catId = note.categoryId {
            let d = FetchDescriptor<HBCategory>(predicate: #Predicate { $0.id == catId })
            if let name = (try? context.fetch(d))?.first?.name { parts.append(name) }
        }
        if !note.labels.isEmpty {
            let d = FetchDescriptor<HBLabel>()
            let all = (try? context.fetch(d)) ?? []
            parts.append(contentsOf: all.filter { note.labels.contains($0.id) }.map(\.name))
        }
        if !note.people.isEmpty {
            let d = FetchDescriptor<HBPerson>()
            let all = (try? context.fetch(d)) ?? []
            parts.append(contentsOf: all.filter { note.people.contains($0.id) }.map { "@\($0.name)" })
        }
        return parts.isEmpty ? nil : parts.joined(separator: " · ")
    }

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

                if let subtitle = entitySubtitle {
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
