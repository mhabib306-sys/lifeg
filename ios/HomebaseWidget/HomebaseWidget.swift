import WidgetKit
import SwiftUI

// MARK: - Shared Data Model

struct WidgetTask: Identifiable {
    let id: String
    let title: String
    let completed: Bool
    let flagged: Bool
}

struct HomebaseData {
    let score: Int
    let streak: Int
    let tasks: [WidgetTask]
    let lastUpdate: Date

    static let placeholder = HomebaseData(
        score: 72,
        streak: 5,
        tasks: [
            WidgetTask(id: "1", title: "Morning routine", completed: false, flagged: false),
            WidgetTask(id: "2", title: "Review inbox", completed: false, flagged: true),
            WidgetTask(id: "3", title: "Team standup", completed: false, flagged: false),
            WidgetTask(id: "4", title: "Deep work session", completed: false, flagged: false)
        ],
        lastUpdate: Date()
    )

    static func load() -> HomebaseData {
        guard let defaults = UserDefaults(suiteName: "group.com.homebase.app") else {
            return .placeholder
        }

        let score = defaults.integer(forKey: "dailyScore")
        let streak = defaults.integer(forKey: "streakCount")
        let timestamp = defaults.double(forKey: "lastUpdate")
        let lastUpdate = timestamp > 0 ? Date(timeIntervalSince1970: timestamp) : Date()

        var tasks: [WidgetTask] = []
        if let taskDicts = defaults.array(forKey: "todayTasks") as? [[String: Any]] {
            tasks = taskDicts.map { dict in
                WidgetTask(
                    id: dict["id"] as? String ?? "",
                    title: dict["title"] as? String ?? "",
                    completed: dict["completed"] as? Bool ?? false,
                    flagged: dict["flagged"] as? Bool ?? false
                )
            }
        }

        return HomebaseData(score: score, streak: streak, tasks: tasks, lastUpdate: lastUpdate)
    }
}

// MARK: - Timeline Provider

struct HomebaseProvider: TimelineProvider {
    func placeholder(in context: Context) -> HomebaseEntry {
        HomebaseEntry(date: Date(), data: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (HomebaseEntry) -> Void) {
        completion(HomebaseEntry(date: Date(), data: HomebaseData.load()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<HomebaseEntry>) -> Void) {
        let entry = HomebaseEntry(date: Date(), data: HomebaseData.load())
        // Refresh every 30 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct HomebaseEntry: TimelineEntry {
    let date: Date
    let data: HomebaseData
}

// MARK: - Small Widget View

struct SmallWidgetView: View {
    let data: HomebaseData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Homebase")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.secondary)
                Spacer()
            }

            Text("\(data.score)%")
                .font(.system(size: 36, weight: .bold, design: .rounded))
                .foregroundColor(scoreColor)

            HStack(spacing: 4) {
                Image(systemName: "flame.fill")
                    .font(.system(size: 11))
                    .foregroundColor(.orange)
                Text("\(data.streak) day streak")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }

    var scoreColor: Color {
        if data.score >= 80 { return .green }
        if data.score >= 60 { return .orange }
        return .red
    }
}

// MARK: - Medium Widget View

struct MediumWidgetView: View {
    let data: HomebaseData

    var body: some View {
        HStack(spacing: 16) {
            // Score column
            VStack(alignment: .leading, spacing: 4) {
                Text("Score")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.secondary)
                Text("\(data.score)%")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(data.score >= 80 ? .green : data.score >= 60 ? .orange : .red)
                HStack(spacing: 2) {
                    Image(systemName: "flame.fill")
                        .font(.system(size: 10))
                        .foregroundColor(.orange)
                    Text("\(data.streak)")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.secondary)
                }
            }
            .frame(width: 80)

            Divider()

            // Tasks column
            VStack(alignment: .leading, spacing: 6) {
                Text("Today")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(.secondary)

                if data.tasks.isEmpty {
                    Text("No tasks for today")
                        .font(.system(size: 13))
                        .foregroundColor(.secondary)
                } else {
                    ForEach(data.tasks.prefix(4)) { task in
                        HStack(spacing: 6) {
                            Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                                .font(.system(size: 12))
                                .foregroundColor(task.completed ? .green : task.flagged ? .orange : .secondary)
                            Text(task.title)
                                .font(.system(size: 13, weight: .regular))
                                .foregroundColor(task.completed ? .secondary : .primary)
                                .lineLimit(1)
                        }
                    }
                }
            }
        }
        .padding()
    }
}

// MARK: - Widget Configuration

struct HomebaseSmallWidget: Widget {
    let kind: String = "HomebaseSmallWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: HomebaseProvider()) { entry in
            SmallWidgetView(data: entry.data)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Daily Score")
        .description("Today's score and streak")
        .supportedFamilies([.systemSmall])
    }
}

struct HomebaseMediumWidget: Widget {
    let kind: String = "HomebaseMediumWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: HomebaseProvider()) { entry in
            MediumWidgetView(data: entry.data)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Today's Tasks")
        .description("Score and top tasks for today")
        .supportedFamilies([.systemMedium])
    }
}

// MARK: - Widget Bundle

@main
struct HomebaseWidgetBundle: WidgetBundle {
    var body: some Widget {
        HomebaseSmallWidget()
        HomebaseMediumWidget()
    }
}
