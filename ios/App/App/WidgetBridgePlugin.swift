import Foundation
import Capacitor

/// Custom Capacitor plugin that writes shared data to App Group UserDefaults
/// so WidgetKit extensions can read today's tasks, score, and streak.
@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "updateWidgetData", returnType: CAPPluginReturnPromise)
    ]

    private let appGroupId = "group.com.homebase.app"

    @objc func updateWidgetData(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: appGroupId) else {
            call.reject("Failed to access App Group UserDefaults")
            return
        }

        // Read data from JS
        let score = call.getInt("score") ?? 0
        let streak = call.getInt("streak") ?? 0
        let tasks = call.getArray("tasks", JSObject.self) ?? []

        // Write to shared UserDefaults
        defaults.set(score, forKey: "dailyScore")
        defaults.set(streak, forKey: "streakCount")

        // Convert tasks to simple dictionaries for widget
        let taskDicts: [[String: Any]] = tasks.prefix(4).map { task in
            return [
                "id": task["id"] as? String ?? "",
                "title": task["title"] as? String ?? "",
                "completed": task["completed"] as? Bool ?? false,
                "flagged": task["flagged"] as? Bool ?? false
            ]
        }
        defaults.set(taskDicts, forKey: "todayTasks")
        defaults.set(Date().timeIntervalSince1970, forKey: "lastUpdate")

        // Tell WidgetKit to refresh
        if #available(iOS 14.0, *) {
            DispatchQueue.main.async {
                // Dynamic import to avoid compilation issues if WidgetKit not linked
                if let widgetCenter = NSClassFromString("WidgetCenter") as? NSObject.Type,
                   let shared = widgetCenter.value(forKey: "shared") as? NSObject {
                    shared.perform(NSSelectorFromString("reloadAllTimelines"))
                }
            }
        }

        call.resolve()
    }
}
