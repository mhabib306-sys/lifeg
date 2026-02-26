import SwiftUI
import SwiftData

struct NoteRowView: View {
    let note: HBTask
    let childCount: Int
    let onZoomIn: () -> Void
    var isEditing: Bool = false
    var onStartEditing: (() -> Void)?
    var onEditDone: (() -> Void)?
    var onEditCancel: (() -> Void)?

    @Environment(SyncCoordinator.self) private var sync
    @State private var editText = ""
    @State private var editMetadata = TaskInlineMetadata()
    @State private var didSetup = false

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
                    InlineAutocompleteField(
                        text: $editText,
                        metadata: $editMetadata,
                        placeholder: "Note",
                        onSubmit: { commitEdit() },
                        onBlur: { commitEdit() },
                        onCancel: { cancelEdit() }
                    )
                    .onAppear {
                        if !didSetup {
                            editText = note.title
                            editMetadata = TaskInlineMetadata(
                                areaId: note.areaId,
                                labels: note.labels,
                                people: note.people,
                                deferDate: note.deferDate,
                                dueDate: note.dueDate
                            )
                            didSetup = true
                        }
                    }
                    .onDisappear { didSetup = false }
                } else {
                    Text(note.title.isEmpty ? "Untitled" : note.title)
                        .font(HBTheme.titleFont)
                        .foregroundStyle(note.title.isEmpty ? HBTheme.textTertiary : HBTheme.textPrimary)
                        .contentShape(Rectangle())
                        .onTapGesture { onStartEditing?() }
                }

                if !isEditing {
                    if let subtitle = sync.entityCache.subtitle(for: note) {
                        Text(subtitle)
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(HBTheme.textTertiary)
                            .lineLimit(1)
                            .transition(.opacity.combined(with: .move(edge: .top)))
                            .contentShape(Rectangle())
                            .onTapGesture { onStartEditing?() }
                    }
                }
            }

            Spacer()

            if childCount > 0 {
                Text("\(childCount)")
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(isEditing ? HBTheme.editingBackground : .clear)
        )
        .shadow(
            color: isEditing ? HBTheme.editingShadow : .clear,
            radius: isEditing ? 4 : 0,
            x: 0,
            y: isEditing ? 1 : 0
        )
        .animation(HBTheme.springDefault, value: isEditing)
        .padding(.leading, CGFloat(note.indent) * 16)
    }

    private func commitEdit() {
        let trimmed = editText.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty {
            note.title = trimmed
        }
        note.areaId = editMetadata.areaId
        note.labels = editMetadata.labels
        note.people = editMetadata.people
        note.deferDate = editMetadata.deferDate
        note.dueDate = editMetadata.dueDate
        note.touch()
        sync.engine.markDirty()
        onEditDone?()
    }

    private func cancelEdit() {
        editText = note.title
        editMetadata = TaskInlineMetadata(
            areaId: note.areaId,
            labels: note.labels,
            people: note.people,
            deferDate: note.deferDate,
            dueDate: note.dueDate
        )
        onEditCancel?()
    }
}
