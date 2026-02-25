import Foundation

enum MergeEngine {

    static func mergeTasks(
        local: [TaskDTO],
        cloud: [TaskDTO],
        tombstones: [String: String]
    ) -> [TaskDTO] {
        var byId: [String: TaskDTO] = [:]

        // Start with local
        for task in local {
            byId[task.id] = task
        }

        // Merge cloud (newest-wins)
        for cloudTask in cloud {
            if let localTask = byId[cloudTask.id] {
                if timestamp(cloudTask.updatedAt) > timestamp(localTask.updatedAt) {
                    byId[cloudTask.id] = cloudTask
                }
                // Else keep local (local wins on tie)
            } else {
                byId[cloudTask.id] = cloudTask
            }
        }

        // Apply tombstones
        for (id, _) in tombstones {
            byId.removeValue(forKey: id)
        }

        return Array(byId.values)
    }

    static func mergeEntities(
        local: [EntityDTO],
        cloud: [EntityDTO],
        tombstones: [String: String]
    ) -> [EntityDTO] {
        var byId: [String: EntityDTO] = [:]

        for entity in local { byId[entity.id] = entity }

        for cloudEntity in cloud {
            if let localEntity = byId[cloudEntity.id] {
                if timestamp(cloudEntity.updatedAt) > timestamp(localEntity.updatedAt) {
                    byId[cloudEntity.id] = cloudEntity
                }
            } else {
                byId[cloudEntity.id] = cloudEntity
            }
        }

        for (id, _) in tombstones { byId.removeValue(forKey: id) }

        return Array(byId.values)
    }

    static func mergeTombstones(
        local: [String: String],
        cloud: [String: String],
        ttlDays: Int = 180
    ) -> [String: String] {
        var merged = local
        for (id, ts) in cloud {
            if let existing = merged[id] {
                // Keep newest tombstone
                if timestamp(ts) > timestamp(existing) { merged[id] = ts }
            } else {
                merged[id] = ts
            }
        }
        // Prune expired
        let cutoff = Date().addingTimeInterval(TimeInterval(-ttlDays * 86400))
        return merged.filter { timestamp($0.value) > cutoff }
    }

    // MARK: - Helpers

    nonisolated(unsafe) private static let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    private static func timestamp(_ iso: String?) -> Date {
        guard let iso, let date = isoFormatter.date(from: iso) else {
            return Date.distantPast
        }
        return date
    }
}
