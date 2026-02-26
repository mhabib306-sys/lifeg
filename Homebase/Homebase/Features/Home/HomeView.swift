import SwiftUI
import SwiftData

// MARK: - Widget Type

enum WidgetType: String, Codable, CaseIterable, Identifiable {
    case weather, stats, today, next
    var id: String { rawValue }

    var title: String {
        switch self {
        case .weather: "Weather"
        case .stats: "Stats"
        case .today: "Today"
        case .next: "Next"
        }
    }

    var icon: String {
        switch self {
        case .weather: "cloud.sun.fill"
        case .stats: "chart.bar.fill"
        case .today: "star.fill"
        case .next: "square.stack"
        }
    }

    var color: Color {
        switch self {
        case .weather: HBTheme.today
        case .stats: HBTheme.accent
        case .today: HBTheme.today
        case .next: HBTheme.anytime
        }
    }
}

// MARK: - Home View

struct HomeView: View {
    @Query private var allTasks: [HBTask]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var weather: WeatherData?
    @State private var editingTaskId: String?
    @State private var widgetOrder: [WidgetType] = HomeView.loadWidgetOrder()
    @State private var editMode: EditMode = .inactive

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12: return "Good morning"
        case 12..<17: return "Good afternoon"
        case 17..<22: return "Good evening"
        default: return "Good night"
        }
    }

    private var todayTasks: [HBTask] {
        let now = Date()
        let todayEnd = Calendar.current.startOfDay(for: now).addingTimeInterval(86400)
        return allTasks.filter { task in
            !task.isNote && !task.completed &&
            (task.today || (task.dueDate != nil && task.dueDate! <= todayEnd))
        }.sorted { $0.order < $1.order }
    }

    private var nextTasks: [HBTask] {
        let now = Date()
        let todayEnd = Calendar.current.startOfDay(for: now).addingTimeInterval(86400)
        return allTasks.filter { task in
            guard !task.isNote && !task.completed && task.status == "anytime" else { return false }
            if let defer_ = task.deferDate, defer_ > now { return false }
            if let due = task.dueDate, due > todayEnd { return false }
            return !task.today
        }.sorted { $0.order < $1.order }
    }

    private var inboxCount: Int {
        allTasks.filter { !$0.isNote && !$0.completed && $0.status == "inbox" }.count
    }

    private var completedTodayCount: Int {
        let start = Calendar.current.startOfDay(for: Date())
        return allTasks.filter { task in
            task.completed && task.completedAt != nil && task.completedAt! >= start
        }.count
    }

    var body: some View {
        List {
            // Header (not draggable)
            Section {
                VStack(alignment: .leading, spacing: 4) {
                    Text(greeting)
                        .font(.system(.largeTitle, weight: .bold))
                        .foregroundStyle(HBTheme.textPrimary)
                    Text(Date(), format: .dateTime.weekday(.wide).month(.wide).day())
                        .font(HBTheme.subtitleFont)
                        .foregroundStyle(HBTheme.textSecondary)
                }
                .listRowBackground(Color.clear)
                .listRowSeparator(.hidden)
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 4, trailing: 16))
            }

            // Widgets (draggable)
            Section {
                ForEach(widgetOrder) { type in
                    widgetView(for: type)
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                        .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
                }
                .onMove { source, destination in
                    widgetOrder.move(fromOffsets: source, toOffset: destination)
                    saveWidgetOrder()
                }
            }
        }
        .listStyle(.plain)
        .environment(\.editMode, $editMode)
        .background(HBTheme.secondaryBackground)
        .scrollContentBackground(.hidden)
        .navigationTitle("Home")
        .task { await loadWeather() }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    withAnimation {
                        editMode = editMode == .active ? .inactive : .active
                    }
                } label: {
                    Image(systemName: editMode == .active ? "checkmark" : "arrow.up.arrow.down")
                }
            }
        }
        .sheet(item: $editingTaskId) { taskId in
            TaskDetailView(taskId: taskId, context: context)
        }
    }

    @ViewBuilder
    private func widgetView(for type: WidgetType) -> some View {
        switch type {
        case .weather:
            WidgetCard(title: type.title, icon: type.icon, color: type.color) {
                WeatherContent(weather: weather)
            }
        case .stats:
            WidgetCard(title: type.title, icon: type.icon, color: type.color) {
                QuickStatsContent(
                    inboxCount: inboxCount,
                    todayCount: todayTasks.count,
                    completedCount: completedTodayCount
                )
            }
        case .today:
            WidgetCard(title: type.title, icon: type.icon, color: type.color) {
                TodayContent(
                    tasks: todayTasks,
                    onComplete: { task in
                        task.markCompleted()
                        sync.engine.markDirty()
                    },
                    onTap: { task in editingTaskId = task.id }
                )
            }
        case .next:
            WidgetCard(title: type.title, icon: type.icon, color: type.color) {
                NextContent(
                    tasks: Array(nextTasks.prefix(5)),
                    onTap: { task in editingTaskId = task.id }
                )
            }
        }
    }

    // MARK: - Widget Order Persistence

    private static func loadWidgetOrder() -> [WidgetType] {
        guard let data = UserDefaults.standard.data(forKey: "hb_widget_order"),
              let order = try? JSONDecoder().decode([WidgetType].self, from: data),
              Set(order) == Set(WidgetType.allCases) else {
            return WidgetType.allCases
        }
        return order
    }

    private func saveWidgetOrder() {
        if let data = try? JSONEncoder().encode(widgetOrder) {
            UserDefaults.standard.set(data, forKey: "hb_widget_order")
        }
    }

    // MARK: - Weather

    private func loadWeather() async {
        if let cached = UserDefaults.standard.data(forKey: "hb_weather_cache"),
           let entry = try? JSONDecoder().decode(WeatherCache.self, from: cached),
           Date().timeIntervalSince(entry.timestamp) < 1800 {
            weather = entry.data
            return
        }

        let lat = UserDefaults.standard.double(forKey: "hb_weather_lat").nonZero ?? 30.03
        let lon = UserDefaults.standard.double(forKey: "hb_weather_lon").nonZero ?? 31.47

        guard let url = URL(string: "https://api.open-meteo.com/v1/forecast?latitude=\(lat)&longitude=\(lon)&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m&timezone=auto&forecast_days=2") else { return }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]

            guard let current = json?["current"] as? [String: Any],
                  let daily = json?["daily"] as? [String: Any],
                  let dailyMax = daily["temperature_2m_max"] as? [Double],
                  let dailyMin = daily["temperature_2m_min"] as? [Double],
                  let dailyCodes = daily["weather_code"] as? [Int] else { return }

            let temp = current["temperature_2m"] as? Double ?? 0
            let code = current["weather_code"] as? Int ?? 0
            let wind = current["wind_speed_10m"] as? Double ?? 0
            let humidity = current["relative_humidity_2m"] as? Int ?? 0

            var maxHour = ""
            var minHour = ""
            if let hourlyTemps = (json?["hourly"] as? [String: Any])?["temperature_2m"] as? [Double],
               let hourlyTimes = (json?["hourly"] as? [String: Any])?["time"] as? [String] {
                let todayHours = Array(hourlyTemps.prefix(24))
                if let maxIdx = todayHours.indices.max(by: { todayHours[$0] < todayHours[$1] }) {
                    maxHour = formatHour(hourlyTimes[maxIdx])
                }
                if let minIdx = todayHours.indices.min(by: { todayHours[$0] < todayHours[$1] }) {
                    minHour = formatHour(hourlyTimes[minIdx])
                }
            }

            let w = WeatherData(
                temp: temp,
                weatherCode: code,
                windSpeed: wind,
                humidity: humidity,
                tempMax: dailyMax.first ?? 0,
                tempMin: dailyMin.first ?? 0,
                maxHour: maxHour,
                minHour: minHour,
                tomorrowMax: dailyMax.count > 1 ? dailyMax[1] : nil,
                tomorrowMin: dailyMin.count > 1 ? dailyMin[1] : nil,
                tomorrowCode: dailyCodes.count > 1 ? dailyCodes[1] : nil
            )
            weather = w

            let cache = WeatherCache(data: w, timestamp: Date())
            if let encoded = try? JSONEncoder().encode(cache) {
                UserDefaults.standard.set(encoded, forKey: "hb_weather_cache")
            }
        } catch {}
    }

    private func formatHour(_ iso: String) -> String {
        guard iso.count >= 13 else { return "" }
        let hourStr = String(iso.suffix(from: iso.index(iso.startIndex, offsetBy: 11)).prefix(2))
        guard let hour = Int(hourStr) else { return "" }
        if hour == 0 { return "12am" }
        if hour < 12 { return "\(hour)am" }
        if hour == 12 { return "12pm" }
        return "\(hour - 12)pm"
    }
}

// MARK: - Weather Data

struct WeatherData: Codable {
    let temp: Double
    let weatherCode: Int
    let windSpeed: Double
    let humidity: Int
    let tempMax: Double
    let tempMin: Double
    let maxHour: String
    let minHour: String
    let tomorrowMax: Double?
    let tomorrowMin: Double?
    let tomorrowCode: Int?

    var icon: String {
        switch weatherCode {
        case 0: "sun.max.fill"
        case 1, 2: "cloud.sun.fill"
        case 3: "cloud.fill"
        case 45, 48: "cloud.fog.fill"
        case 51...57: "cloud.drizzle.fill"
        case 61...67: "cloud.rain.fill"
        case 71...77, 85, 86: "cloud.snow.fill"
        case 80...82: "cloud.heavyrain.fill"
        case 95...99: "cloud.bolt.rain.fill"
        default: "cloud.fill"
        }
    }

    var description: String {
        switch weatherCode {
        case 0: "Clear"
        case 1: "Mostly Clear"
        case 2: "Partly Cloudy"
        case 3: "Cloudy"
        case 45, 48: "Foggy"
        case 51...55: "Drizzle"
        case 56, 57: "Freezing Drizzle"
        case 61...65: "Rain"
        case 66, 67: "Freezing Rain"
        case 71...75: "Snow"
        case 77: "Snow Grains"
        case 80...82: "Showers"
        case 85, 86: "Snow Showers"
        case 95: "Thunderstorm"
        case 96, 99: "Hail Storm"
        default: "Unknown"
        }
    }
}

private struct WeatherCache: Codable {
    let data: WeatherData
    let timestamp: Date
}

private extension Double {
    var nonZero: Double? { self == 0 ? nil : self }
}

// MARK: - Widget Card Container (full-width)

private struct WidgetCard<Content: View>: View {
    let title: String
    let icon: String
    let color: Color
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 12))
                    .foregroundStyle(color)
                Text(title)
                    .font(.system(.footnote, weight: .semibold))
                    .foregroundStyle(HBTheme.textSecondary)
            }

            content
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(HBTheme.background)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.04), radius: 4, y: 2)
    }
}

// MARK: - Weather Content

private struct WeatherContent: View {
    let weather: WeatherData?

    var body: some View {
        if let w = weather {
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 8) {
                    Image(systemName: w.icon)
                        .font(.system(size: 28))
                        .foregroundStyle(HBTheme.today)
                    Text("\(Int(w.temp))°")
                        .font(.system(size: 32, weight: .semibold))
                        .foregroundStyle(HBTheme.textPrimary)

                    Spacer()

                    VStack(alignment: .trailing, spacing: 2) {
                        Text(w.description)
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(HBTheme.textSecondary)
                        HStack(spacing: 12) {
                            Label("\(Int(w.tempMax))°", systemImage: "arrow.up")
                                .font(HBTheme.badgeFont)
                                .foregroundStyle(.red)
                            Label("\(Int(w.tempMin))°", systemImage: "arrow.down")
                                .font(HBTheme.badgeFont)
                                .foregroundStyle(HBTheme.accent)
                        }
                    }
                }

                if let tmMax = w.tomorrowMax, let tmMin = w.tomorrowMin {
                    let delta = Int(((tmMax + tmMin) / 2) - ((w.tempMax + w.tempMin) / 2))
                    let sign = delta > 0 ? "+" : ""
                    Text("Tomorrow \(sign)\(delta)°")
                        .font(HBTheme.badgeFont)
                        .foregroundStyle(HBTheme.textTertiary)
                }
            }
        } else {
            VStack(spacing: 8) {
                ProgressView()
                Text("Loading...")
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(HBTheme.textTertiary)
            }
            .frame(maxWidth: .infinity)
        }
    }
}

// MARK: - Quick Stats Content

private struct QuickStatsContent: View {
    let inboxCount: Int
    let todayCount: Int
    let completedCount: Int

    var body: some View {
        HStack(spacing: 0) {
            StatCell(icon: "tray", label: "Inbox", value: "\(inboxCount)", color: HBTheme.inbox)
            Spacer()
            StatCell(icon: "star.fill", label: "Today", value: "\(todayCount)", color: HBTheme.today)
            Spacer()
            StatCell(icon: "checkmark.circle", label: "Done", value: "\(completedCount)", color: HBTheme.logbook)
        }
    }
}

private struct StatCell: View {
    let icon: String
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundStyle(color)
            Text(value)
                .font(.system(.title3, weight: .semibold))
                .foregroundStyle(HBTheme.textPrimary)
            Text(label)
                .font(HBTheme.badgeFont)
                .foregroundStyle(HBTheme.textSecondary)
        }
    }
}

// MARK: - Today Content

private struct TodayContent: View {
    let tasks: [HBTask]
    let onComplete: (HBTask) -> Void
    let onTap: (HBTask) -> Void

    var body: some View {
        if tasks.isEmpty {
            Text("Nothing scheduled for today")
                .font(HBTheme.subtitleFont)
                .foregroundStyle(HBTheme.textTertiary)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.vertical, 8)
        } else {
            VStack(spacing: 0) {
                ForEach(tasks.prefix(8), id: \.id) { task in
                    WidgetTaskRow(task: task, onComplete: { onComplete(task) })
                        .contentShape(Rectangle())
                        .onTapGesture { onTap(task) }
                    if task.id != tasks.prefix(8).last?.id {
                        Divider().padding(.leading, 30)
                    }
                }
                if tasks.count > 8 {
                    Text("+\(tasks.count - 8) more")
                        .font(HBTheme.badgeFont)
                        .foregroundStyle(HBTheme.textTertiary)
                        .padding(.top, 6)
                }
            }
        }
    }
}

// MARK: - Next Content

private struct NextContent: View {
    let tasks: [HBTask]
    let onTap: (HBTask) -> Void

    var body: some View {
        if tasks.isEmpty {
            Text("No upcoming tasks")
                .font(HBTheme.subtitleFont)
                .foregroundStyle(HBTheme.textTertiary)
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.vertical, 8)
        } else {
            VStack(spacing: 0) {
                ForEach(tasks, id: \.id) { task in
                    WidgetTaskRow(task: task, onComplete: nil)
                        .contentShape(Rectangle())
                        .onTapGesture { onTap(task) }
                    if task.id != tasks.last?.id {
                        Divider().padding(.leading, 30)
                    }
                }
            }
        }
    }
}

// MARK: - Widget Task Row

private struct WidgetTaskRow: View {
    let task: HBTask
    let onComplete: (() -> Void)?

    var body: some View {
        HStack(spacing: 10) {
            if let onComplete {
                Button(action: onComplete) {
                    Circle()
                        .strokeBorder(HBTheme.checkboxBorder, lineWidth: 1.5)
                        .frame(width: 18, height: 18)
                }
                .buttonStyle(.plain)
            } else {
                Circle()
                    .fill(HBTheme.textTertiary.opacity(0.3))
                    .frame(width: 6, height: 6)
                    .padding(.horizontal, 6)
            }

            Text(task.title)
                .font(HBTheme.titleFont)
                .foregroundStyle(HBTheme.textPrimary)
                .lineLimit(1)

            Spacer()

            if task.flagged {
                Image(systemName: "flag.fill")
                    .font(.system(size: 9))
                    .foregroundStyle(HBTheme.flagged)
            }

            if let due = task.dueDate {
                Text(due, format: .dateTime.month(.abbreviated).day())
                    .font(HBTheme.badgeFont)
                    .foregroundStyle(due < Date() ? .red : HBTheme.textTertiary)
            }
        }
        .padding(.vertical, 6)
    }
}
