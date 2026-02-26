import SwiftUI

// MARK: - Data Types

struct TaskInlineMetadata: Equatable {
    var areaId: String?
    var labels: [String] = []
    var people: [String] = []
    var deferDate: Date?
    var dueDate: Date?
}

enum TriggerType: String {
    case area = "#"
    case label = "@"
    case person = "&"
    case deferDate = "!"
    case dueDate = "!!"
}

struct Suggestion: Identifiable {
    let id: String
    let name: String
    let color: Color?
    let emoji: String?
    let date: Date?

    init(id: String, name: String, color: Color? = nil, emoji: String? = nil, date: Date? = nil) {
        self.id = id
        self.name = name
        self.color = color
        self.emoji = emoji
        self.date = date
    }
}

// MARK: - Trigger Detection

struct TriggerMatch {
    let type: TriggerType
    let query: String
    let range: Range<String.Index> // range of trigger+query in the text
}

func detectTrigger(in text: String) -> TriggerMatch? {
    guard !text.isEmpty else { return nil }

    // Scan backwards from end to find the active trigger
    // A trigger is valid if it's at the start of the string or preceded by a space
    let chars = Array(text)
    var i = chars.count - 1

    // Find the trigger position by scanning back to a space or start
    while i >= 0 && chars[i] != " " {
        i -= 1
    }

    let tokenStart = i + 1
    guard tokenStart < chars.count else { return nil }
    let token = String(chars[tokenStart...])

    // Check !! first (due date) — must be exactly !! at start of token
    if token.hasPrefix("!!") {
        let query = String(token.dropFirst(2))
        let startIdx = text.index(text.startIndex, offsetBy: tokenStart)
        return TriggerMatch(type: .dueDate, query: query, range: startIdx..<text.endIndex)
    }

    // Then single triggers
    let triggerMap: [(String, TriggerType)] = [
        ("#", .area),
        ("@", .label),
        ("&", .person),
        ("!", .deferDate),
    ]

    for (prefix, type) in triggerMap {
        if token.hasPrefix(prefix) {
            let query = String(token.dropFirst(prefix.count))
            let startIdx = text.index(text.startIndex, offsetBy: tokenStart)
            return TriggerMatch(type: type, query: query, range: startIdx..<text.endIndex)
        }
    }

    return nil
}

// MARK: - Date Suggestion Engine

func dateSuggestions(for query: String) -> [Suggestion] {
    let today = Calendar.current.startOfDay(for: Date())
    let fmt = DateFormatter()
    fmt.dateFormat = "yyyy-MM-dd"

    func addDays(_ n: Int) -> Date {
        Calendar.current.date(byAdding: .day, value: n, to: today)!
    }
    func nextWeekday(_ day: Int) -> Date {
        var d = today
        repeat {
            d = Calendar.current.date(byAdding: .day, value: 1, to: d)!
        } while Calendar.current.component(.weekday, from: d) != day
        return d
    }

    let q = query.lowercased().trimmingCharacters(in: .whitespaces)

    // Default suggestions when empty
    if q.isEmpty {
        return [
            Suggestion(id: "today", name: "Today", date: today),
            Suggestion(id: "tomorrow", name: "Tomorrow", date: addDays(1)),
            Suggestion(id: "next_mon", name: "Next Monday", date: nextWeekday(2)),
            Suggestion(id: "in_1_week", name: "In 1 Week", date: addDays(7)),
        ]
    }

    var results: [Suggestion] = []

    if "today".hasPrefix(q) || q == "tod" {
        results.append(Suggestion(id: "today", name: "Today", date: today))
    }
    if "tomorrow".hasPrefix(q) || "tmr".hasPrefix(q) {
        results.append(Suggestion(id: "tomorrow", name: "Tomorrow", date: addDays(1)))
    }

    // Day names
    let dayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
    let dayShort = ["sun","mon","tue","wed","thu","fri","sat"]
    // Calendar weekday: 1=Sun, 2=Mon, ... 7=Sat
    for (idx, name) in dayNames.enumerated() {
        if name.hasPrefix(q) || dayShort[idx].hasPrefix(q) {
            let wd = idx + 1 // Calendar weekday
            results.append(Suggestion(id: "day_\(idx)", name: name.capitalized, date: nextWeekday(wd)))
        }
    }

    // "in N" pattern
    if q.hasPrefix("in ") || q.hasPrefix("in") {
        let numPart = q.replacingOccurrences(of: "in ", with: "").trimmingCharacters(in: .whitespaces)
        if let n = Int(numPart), n > 0 {
            results.append(Suggestion(id: "in_\(n)d", name: "In \(n) day\(n == 1 ? "" : "s")", date: addDays(n)))
            results.append(Suggestion(id: "in_\(n)w", name: "In \(n) week\(n == 1 ? "" : "s")", date: addDays(n * 7)))
        }
    }

    return Array(results.prefix(5))
}

// MARK: - Metadata Chips

struct MetadataChipsView: View {
    let metadata: TaskInlineMetadata
    let cache: EntityCache

    var body: some View {
        let chips = buildChips()
        if !chips.isEmpty {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 4) {
                    ForEach(chips, id: \.label) { chip in
                        HStack(spacing: 3) {
                            Image(systemName: chip.icon)
                                .font(.system(size: 9))
                            Text(chip.label)
                                .font(.system(size: 11, weight: .medium))
                        }
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(chip.color.opacity(0.15))
                        .foregroundStyle(chip.color)
                        .clipShape(RoundedRectangle(cornerRadius: 4))
                        .transition(.asymmetric(
                            insertion: .opacity.combined(with: .scale(scale: 0.8)).combined(with: .offset(y: 4)),
                            removal: .opacity.combined(with: .scale(scale: 0.9))
                        ))
                    }
                }
            }
        }
    }

    private struct ChipData: Hashable {
        let icon: String
        let label: String
        let color: Color

        func hash(into hasher: inout Hasher) {
            hasher.combine(label)
        }
    }

    private func buildChips() -> [ChipData] {
        var chips: [ChipData] = []
        if let areaId = metadata.areaId, let name = cache.areaName(for: areaId) {
            chips.append(ChipData(icon: "folder", label: name, color: HBTheme.accent))
        }
        for id in metadata.labels {
            let names = cache.labelNames(for: [id])
            if let name = names.first {
                chips.append(ChipData(icon: "tag", label: name, color: .purple))
            }
        }
        for id in metadata.people {
            let names = cache.personNames(for: [id])
            if let name = names.first {
                chips.append(ChipData(icon: "person", label: name, color: .cyan))
            }
        }
        if let d = metadata.deferDate {
            chips.append(ChipData(icon: "clock", label: formatShortDate(d), color: .orange))
        }
        if let d = metadata.dueDate {
            chips.append(ChipData(icon: "calendar", label: formatShortDate(d), color: .red))
        }
        return chips
    }

    private func formatShortDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "MMM d"
        return fmt.string(from: date)
    }
}

// MARK: - Inline Autocomplete Field

struct InlineAutocompleteField: View {
    @Binding var text: String
    @Binding var metadata: TaskInlineMetadata
    var placeholder: String = "New Task"
    var font: Font = HBTheme.titleFont
    var autoFocus: Bool = true
    var onSubmit: () -> Void
    var onBlur: (() -> Void)?
    var onCancel: (() -> Void)?

    @Environment(SyncCoordinator.self) private var sync
    @FocusState private var isFocused: Bool
    @State private var activeTrigger: TriggerMatch?
    @State private var originalText: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            TextField(placeholder, text: $text, axis: .vertical)
                .font(font)
                .focused($isFocused)
                .onAppear {
                    originalText = text
                    if autoFocus {
                        // Syncs with spring animation ramp-up
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                            isFocused = true
                        }
                    }
                }
                .onChange(of: text) { _, newValue in
                    activeTrigger = detectTrigger(in: newValue)
                }
                .onSubmit {
                    if activeTrigger != nil {
                        activeTrigger = nil
                    } else {
                        onSubmit()
                    }
                }
                .onChange(of: isFocused) { _, focused in
                    if !focused {
                        activeTrigger = nil
                        onBlur?()
                    }
                }
                .onKeyPress(.escape) {
                    text = originalText
                    activeTrigger = nil
                    isFocused = false
                    onCancel?()
                    return .handled
                }
                .toolbar {
                    ToolbarItemGroup(placement: .keyboard) {
                        ShortcutKeyboardBar { trigger in
                            insertTriggerText(trigger)
                        }
                    }
                }

            MetadataChipsView(metadata: metadata, cache: sync.entityCache)
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: metadata.areaId)
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: metadata.labels)
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: metadata.people)

            // Suggestions overlay
            if let trigger = activeTrigger {
                suggestionsView(for: trigger)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: activeTrigger != nil)
    }

    @ViewBuilder
    private func suggestionsView(for trigger: TriggerMatch) -> some View {
        let items = buildSuggestions(for: trigger)
        if !items.isEmpty {
            VStack(alignment: .leading, spacing: 0) {
                ForEach(items) { item in
                    Button {
                        selectSuggestion(item, trigger: trigger)
                    } label: {
                        HStack(spacing: 8) {
                            if let emoji = item.emoji {
                                Text(emoji).font(.system(size: 14))
                            } else if let color = item.color {
                                Circle()
                                    .fill(color)
                                    .frame(width: 10, height: 10)
                            } else {
                                Image(systemName: iconForTrigger(trigger.type))
                                    .font(.system(size: 12))
                                    .foregroundStyle(HBTheme.textTertiary)
                            }
                            Text(item.name)
                                .font(.system(size: 14))
                                .foregroundStyle(HBTheme.textPrimary)

                            if let date = item.date {
                                Spacer()
                                Text(date, style: .date)
                                    .font(.system(size: 11))
                                    .foregroundStyle(HBTheme.textTertiary)
                            }

                            Spacer()
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                    }
                    .buttonStyle(.plain)

                    if item.id != items.last?.id {
                        Divider().padding(.leading, 10)
                    }
                }
            }
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(.systemBackground))
                    .shadow(color: .black.opacity(0.12), radius: 8, y: 2)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(HBTheme.separator, lineWidth: 0.5)
            )
        }
    }

    private func buildSuggestions(for trigger: TriggerMatch) -> [Suggestion] {
        let query = trigger.query.lowercased()
        let cache = sync.entityCache

        switch trigger.type {
        case .area:
            return cache.areas.values
                .filter { query.isEmpty || $0.name.lowercased().contains(query) }
                .sorted { $0.order < $1.order }
                .prefix(6)
                .map { Suggestion(id: $0.id, name: $0.name, color: Color(hex: $0.color), emoji: $0.emoji) }

        case .label:
            return cache.labels.values
                .filter { query.isEmpty || $0.name.lowercased().contains(query) }
                .filter { !metadata.labels.contains($0.id) }
                .sorted { $0.order < $1.order }
                .prefix(6)
                .map { Suggestion(id: $0.id, name: $0.name, color: Color(hex: $0.color)) }

        case .person:
            return cache.people.values
                .filter { query.isEmpty || $0.name.lowercased().contains(query) }
                .filter { !metadata.people.contains($0.id) }
                .sorted { $0.order < $1.order }
                .prefix(6)
                .map { Suggestion(id: $0.id, name: $0.name) }

        case .deferDate, .dueDate:
            return dateSuggestions(for: query)
        }
    }

    private func selectSuggestion(_ suggestion: Suggestion, trigger: TriggerMatch) {
        // Remove the trigger text from the title
        text.removeSubrange(trigger.range)
        text = text.trimmingCharacters(in: .whitespaces)

        // Apply the metadata
        switch trigger.type {
        case .area:
            metadata.areaId = suggestion.id
        case .label:
            if !metadata.labels.contains(suggestion.id) {
                metadata.labels.append(suggestion.id)
            }
        case .person:
            if !metadata.people.contains(suggestion.id) {
                metadata.people.append(suggestion.id)
            }
        case .deferDate:
            metadata.deferDate = suggestion.date
        case .dueDate:
            metadata.dueDate = suggestion.date
        }

        activeTrigger = nil
        Haptic.lightTap()
    }

    private func insertTriggerText(_ trigger: String) {
        if !text.isEmpty && !text.hasSuffix(" ") {
            text += " "
        }
        text += trigger
        // Explicitly detect trigger since onChange may not fire from toolbar
        activeTrigger = detectTrigger(in: text)
    }

    private func iconForTrigger(_ type: TriggerType) -> String {
        switch type {
        case .area: "folder"
        case .label: "tag"
        case .person: "person"
        case .deferDate: "clock"
        case .dueDate: "calendar"
        }
    }
}

// MARK: - Keyboard Shortcut Bar

struct ShortcutKeyboardBar: View {
    var onInsert: (String) -> Void

    private let shortcuts: [(label: String, icon: String, trigger: String)] = [
        ("#", "folder", "#"),
        ("@", "tag", "@"),
        ("&", "person", "&"),
        ("!", "clock", "!"),
        ("!!", "calendar", "!!"),
    ]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(shortcuts, id: \.trigger) { shortcut in
                Button {
                    onInsert(shortcut.trigger)
                    Haptic.selection()
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: shortcut.icon)
                            .font(.system(size: 12))
                        Text(shortcut.label)
                            .font(.system(size: 15, weight: .semibold, design: .monospaced))
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color(.systemGray5))
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                }
                .buttonStyle(.plain)

                if shortcut.trigger != shortcuts.last?.trigger {
                    Spacer()
                }
            }
        }
    }
}