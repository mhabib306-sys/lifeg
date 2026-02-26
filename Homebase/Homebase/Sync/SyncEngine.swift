import Foundation
import SwiftData
import Observation

@MainActor @Observable
final class SyncEngine {
    let container: ModelContainer
    private(set) var api: GitHubAPI?
    private let dirtyKey = "syncDirty"
    private let sequenceKey = "syncSequence"
    private var debounceTask: Task<Void, Never>?
    var onDataImported: (() -> Void)?

    var isSyncing = false
    var lastError: String?
    var lastSyncInfo: String?

    var isDirty: Bool {
        UserDefaults.standard.bool(forKey: dirtyKey)
    }

    var isConfigured: Bool { api != nil }

    init(container: ModelContainer, api: GitHubAPI?) {
        self.container = container
        self.api = api
    }

    func updateAPI(_ newAPI: GitHubAPI?) {
        self.api = newAPI
    }

    func markDirty() {
        UserDefaults.standard.set(true, forKey: dirtyKey)
        scheduleDebouncedSync()
    }

    func clearDirty() {
        UserDefaults.standard.set(false, forKey: dirtyKey)
    }

    private var sequence: Int {
        get { UserDefaults.standard.integer(forKey: sequenceKey) }
        set { UserDefaults.standard.set(newValue, forKey: sequenceKey) }
    }

    // MARK: - Debounced Sync

    func scheduleDebouncedSync() {
        debounceTask?.cancel()
        debounceTask = Task {
            try? await Task.sleep(for: .seconds(2))
            guard !Task.isCancelled else { return }
            await push()
        }
    }

    // MARK: - Sync Now (push if dirty, otherwise pull)

    func syncNow() async {
        if isDirty {
            await push()
        } else {
            await pull()
        }
    }

    // MARK: - Push (full sync)

    func push() async {
        guard let api else {
            lastError = "Not configured — enter credentials in Settings"
            return
        }
        guard isDirty else {
            print("[Sync] push() skipped — not dirty")
            return
        }
        isSyncing = true
        defer { isSyncing = false }
        print("[Sync] push() starting...")

        do {
            // 1. Fetch cloud file (network I/O — already async)
            var cloudFileContent: Data? = nil
            var cloudFileSha: String? = nil
            do {
                let file = try await api.fetchFile(path: "data.json")
                cloudFileContent = file.content
                cloudFileSha = file.sha
                print("[Sync] Fetched cloud file")
            } catch GitHubAPIError.notFound {
                try await api.verifyRepo()
                print("[Sync] data.json not found — will create on first push")
            }

            // 2. Heavy work on background thread (decode, export, merge, import, encode)
            let container = self.container
            let currentSequence = self.sequence
            let (encodedPayload, taskCount, newSequence) = try await Task.detached(priority: .userInitiated) {
                let context = ModelContext(container)

                // Decode cloud (CPU-heavy JSON parsing — off main thread)
                let cloudPayload: CloudPayload? = if let content = cloudFileContent {
                    try PayloadCoder.decode(content)
                } else {
                    nil
                }

                // Export local state (DB reads — off main thread)
                let existingTasks = (try? context.fetch(FetchDescriptor<HBTask>())) ?? []
                let localTasks = existingTasks.map { $0.toDTO() }

                let existingAreas = (try? context.fetch(FetchDescriptor<HBArea>())) ?? []
                let localAreas = existingAreas.map { $0.toDTO() }

                let existingCategories = (try? context.fetch(FetchDescriptor<HBCategory>())) ?? []
                let localCategories = existingCategories.map { $0.toDTO() }

                let existingLabels = (try? context.fetch(FetchDescriptor<HBLabel>())) ?? []
                let localLabels = existingLabels.map { $0.toDTO() }

                let existingPeople = (try? context.fetch(FetchDescriptor<HBPerson>())) ?? []
                let localPeople = existingPeople.map { $0.toDTO() }

                let existingPerspectives = (try? context.fetch(FetchDescriptor<HBPerspective>())) ?? []
                let localPerspectives = existingPerspectives.map { $0.toDTO() }

                let existingTombstones = (try? context.fetch(FetchDescriptor<HBTombstone>())) ?? []
                let isoFmt = ISO8601DateFormatter()
                isoFmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
                var localTaskTombstones: [String: String] = [:]
                var localEntityTombstones: [String: [String: String]] = [:]
                for tomb in existingTombstones {
                    let dateStr = isoFmt.string(from: tomb.deletedAt)
                    if tomb.collection == "tasks" {
                        localTaskTombstones[tomb.entityId] = dateStr
                    } else {
                        localEntityTombstones[tomb.collection, default: [:]][tomb.entityId] = dateStr
                    }
                }

                // Merge (CPU-heavy — off main thread)
                let mergedTasks: [TaskDTO]
                let mergedAreas: [EntityDTO]
                let mergedCategories: [EntityDTO]
                let mergedLabels: [EntityDTO]
                let mergedPeople: [EntityDTO]
                let mergedPerspectives: [EntityDTO]
                let mergedTaskTombstones: [String: String]

                if let cloud = cloudPayload {
                    mergedTaskTombstones = MergeEngine.mergeTombstones(
                        local: localTaskTombstones, cloud: cloud.deletedTaskTombstones
                    )
                    mergedTasks = MergeEngine.mergeTasks(
                        local: localTasks, cloud: cloud.tasks, tombstones: mergedTaskTombstones
                    )
                    mergedAreas = MergeEngine.mergeEntities(
                        local: localAreas, cloud: cloud.areas,
                        tombstones: cloud.deletedEntityTombstones["taskCategories"] ?? [:]
                    )
                    mergedCategories = MergeEngine.mergeEntities(
                        local: localCategories, cloud: cloud.categories,
                        tombstones: cloud.deletedEntityTombstones["categories"] ?? [:]
                    )
                    mergedLabels = MergeEngine.mergeEntities(
                        local: localLabels, cloud: cloud.labels,
                        tombstones: cloud.deletedEntityTombstones["taskLabels"] ?? [:]
                    )
                    mergedPeople = MergeEngine.mergeEntities(
                        local: localPeople, cloud: cloud.people,
                        tombstones: cloud.deletedEntityTombstones["taskPeople"] ?? [:]
                    )
                    mergedPerspectives = MergeEngine.mergeEntities(
                        local: localPerspectives, cloud: cloud.perspectives,
                        tombstones: cloud.deletedEntityTombstones["customPerspectives"] ?? [:]
                    )
                } else {
                    mergedTasks = localTasks
                    mergedAreas = localAreas
                    mergedCategories = localCategories
                    mergedLabels = localLabels
                    mergedPeople = localPeople
                    mergedPerspectives = localPerspectives
                    mergedTaskTombstones = localTaskTombstones
                }

                // Import merged state (DB writes — off main thread)
                for task in existingTasks { context.delete(task) }
                for dto in mergedTasks { context.insert(HBTask.from(dto: dto)) }

                for area in existingAreas { context.delete(area) }
                for dto in mergedAreas { context.insert(HBArea.from(dto: dto)) }

                for cat in existingCategories { context.delete(cat) }
                for dto in mergedCategories { context.insert(HBCategory.from(dto: dto)) }

                for label in existingLabels { context.delete(label) }
                for dto in mergedLabels { context.insert(HBLabel.from(dto: dto)) }

                for person in existingPeople { context.delete(person) }
                for dto in mergedPeople { context.insert(HBPerson.from(dto: dto)) }

                for persp in existingPerspectives { context.delete(persp) }
                for dto in mergedPerspectives { context.insert(HBPerspective.from(dto: dto)) }

                try context.save()

                // Encode payload (CPU-heavy SHA256 + JSON — off main thread)
                let seq = currentSequence + 1
                var payload = cloudPayload ?? CloudPayload(
                    schemaVersion: 1, sequence: 0, checksum: "", lastUpdated: "",
                    tasks: [], areas: [], categories: [], labels: [], people: [],
                    perspectives: [], deletedTaskTombstones: [:],
                    deletedEntityTombstones: [:], passthrough: [:]
                )
                payload.tasks = mergedTasks
                payload.areas = mergedAreas
                payload.categories = mergedCategories
                payload.labels = mergedLabels
                payload.people = mergedPeople
                payload.perspectives = mergedPerspectives
                payload.deletedTaskTombstones = mergedTaskTombstones
                payload.sequence = seq
                payload.lastUpdated = ISO8601DateFormatter().string(from: Date())

                let encoded = try PayloadCoder.encode(payload)
                return (encoded, mergedTasks.count, seq)
            }.value

            // 3. Back on main: reload cache, upload, update state
            onDataImported?()

            _ = try await api.putFile(path: "data.json", content: encodedPayload, sha: cloudFileSha, message: "iOS sync")

            sequence = newSequence
            clearDirty()
            lastError = nil
            lastSyncInfo = "Pushed \(taskCount) tasks"
            print("[Sync] push() success — \(taskCount) tasks pushed")
        } catch GitHubAPIError.conflict {
            lastError = "Conflict — retrying"
            await retryWithBackoff()
        } catch GitHubAPIError.rateLimited {
            lastError = "Rate limited — pausing 60s"
            try? await Task.sleep(for: .seconds(60))
        } catch {
            lastError = error.localizedDescription
            print("[Sync] push() error: \(error)")
        }
    }

    // MARK: - Pull (fetch cloud into local)

    func pull() async {
        guard let api else {
            lastError = "Not configured — enter credentials in Settings"
            return
        }
        isSyncing = true
        defer { isSyncing = false }
        print("[Sync] pull() starting...")

        do {
            // 1. Fetch cloud file (network I/O — already async)
            let fileContent: Data
            do {
                let file = try await api.fetchFile(path: "data.json")
                fileContent = file.content
                print("[Sync] Fetched data.json (\(file.content.count) bytes)")
            } catch GitHubAPIError.notFound {
                do {
                    try await api.verifyRepo()
                    lastError = nil
                    lastSyncInfo = "Cloud empty — no data.json yet"
                    print("[Sync] pull() — data.json not found, repo accessible")
                    return
                } catch {
                    lastError = "Cannot access repo — check owner, repo name, and token: \(error.localizedDescription)"
                    print("[Sync] pull() — repo verify failed: \(error)")
                    return
                }
            } catch {
                lastError = "Fetch: \(error.localizedDescription)"
                print("[Sync] pull() fetch error: \(error)")
                return
            }

            // 2. Heavy work on background thread (decode, export, merge, import)
            let container = self.container
            let (taskCount, areaCount) = try await Task.detached(priority: .userInitiated) {
                let context = ModelContext(container)

                // Decode (CPU-heavy JSON parsing — off main thread)
                let cloudPayload = try PayloadCoder.decode(fileContent)

                // Export local state (DB reads — off main thread via background context)
                let existingTasks = (try? context.fetch(FetchDescriptor<HBTask>())) ?? []
                let localTasks = existingTasks.map { $0.toDTO() }

                let existingAreas = (try? context.fetch(FetchDescriptor<HBArea>())) ?? []
                let localAreas = existingAreas.map { $0.toDTO() }

                let existingCategories = (try? context.fetch(FetchDescriptor<HBCategory>())) ?? []
                let localCategories = existingCategories.map { $0.toDTO() }

                let existingLabels = (try? context.fetch(FetchDescriptor<HBLabel>())) ?? []
                let localLabels = existingLabels.map { $0.toDTO() }

                let existingPeople = (try? context.fetch(FetchDescriptor<HBPerson>())) ?? []
                let localPeople = existingPeople.map { $0.toDTO() }

                let existingPerspectives = (try? context.fetch(FetchDescriptor<HBPerspective>())) ?? []
                let localPerspectives = existingPerspectives.map { $0.toDTO() }

                // Merge (CPU-heavy — off main thread)
                let mergedTasks = MergeEngine.mergeTasks(
                    local: localTasks, cloud: cloudPayload.tasks,
                    tombstones: cloudPayload.deletedTaskTombstones
                )
                let mergedAreas = MergeEngine.mergeEntities(
                    local: localAreas, cloud: cloudPayload.areas,
                    tombstones: cloudPayload.deletedEntityTombstones["taskCategories"] ?? [:]
                )
                let mergedCategories = MergeEngine.mergeEntities(
                    local: localCategories, cloud: cloudPayload.categories,
                    tombstones: cloudPayload.deletedEntityTombstones["categories"] ?? [:]
                )
                let mergedLabels = MergeEngine.mergeEntities(
                    local: localLabels, cloud: cloudPayload.labels,
                    tombstones: cloudPayload.deletedEntityTombstones["taskLabels"] ?? [:]
                )
                let mergedPeople = MergeEngine.mergeEntities(
                    local: localPeople, cloud: cloudPayload.people,
                    tombstones: cloudPayload.deletedEntityTombstones["taskPeople"] ?? [:]
                )
                let mergedPerspectives = MergeEngine.mergeEntities(
                    local: localPerspectives, cloud: cloudPayload.perspectives,
                    tombstones: cloudPayload.deletedEntityTombstones["customPerspectives"] ?? [:]
                )

                // Import merged state (DB writes — off main thread via background context)
                for task in existingTasks { context.delete(task) }
                for dto in mergedTasks { context.insert(HBTask.from(dto: dto)) }

                for area in existingAreas { context.delete(area) }
                for dto in mergedAreas { context.insert(HBArea.from(dto: dto)) }

                for cat in existingCategories { context.delete(cat) }
                for dto in mergedCategories { context.insert(HBCategory.from(dto: dto)) }

                for label in existingLabels { context.delete(label) }
                for dto in mergedLabels { context.insert(HBLabel.from(dto: dto)) }

                for person in existingPeople { context.delete(person) }
                for dto in mergedPeople { context.insert(HBPerson.from(dto: dto)) }

                for persp in existingPerspectives { context.delete(persp) }
                for dto in mergedPerspectives { context.insert(HBPerspective.from(dto: dto)) }

                // Save propagates changes to mainContext via the shared container
                try context.save()
                return (mergedTasks.count, mergedAreas.count)
            }.value

            // 3. Back on main: reload entity cache and update state
            onDataImported?()
            lastError = nil
            lastSyncInfo = "Pulled \(taskCount) tasks, \(areaCount) areas"
            print("[Sync] pull() success — \(taskCount) tasks, \(areaCount) areas imported")
        } catch {
            lastError = "Pull: \(error.localizedDescription)"
            print("[Sync] pull() error: \(error)")
        }
    }

    // MARK: - Export helpers (kept for external callers)

    func exportTasks(from context: ModelContext) -> [TaskDTO] {
        let descriptor = FetchDescriptor<HBTask>()
        let tasks = (try? context.fetch(descriptor)) ?? []
        return tasks.map { $0.toDTO() }
    }

    private func exportAreas(from context: ModelContext) -> [EntityDTO] {
        let existing = (try? context.fetch(FetchDescriptor<HBArea>())) ?? []
        return existing.map { $0.toDTO() }
    }

    private func exportCategories(from context: ModelContext) -> [EntityDTO] {
        let existing = (try? context.fetch(FetchDescriptor<HBCategory>())) ?? []
        return existing.map { $0.toDTO() }
    }

    private func exportLabels(from context: ModelContext) -> [EntityDTO] {
        let existing = (try? context.fetch(FetchDescriptor<HBLabel>())) ?? []
        return existing.map { $0.toDTO() }
    }

    private func exportPeople(from context: ModelContext) -> [EntityDTO] {
        let existing = (try? context.fetch(FetchDescriptor<HBPerson>())) ?? []
        return existing.map { $0.toDTO() }
    }

    private func exportPerspectives(from context: ModelContext) -> [EntityDTO] {
        let existing = (try? context.fetch(FetchDescriptor<HBPerspective>())) ?? []
        return existing.map { $0.toDTO() }
    }

    private func exportTombstones(from context: ModelContext) -> (tasks: [String: String], entities: [String: [String: String]]) {
        let existing = (try? context.fetch(FetchDescriptor<HBTombstone>())) ?? []
        let isoFmt = ISO8601DateFormatter()
        isoFmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        var tasks: [String: String] = [:]
        var entities: [String: [String: String]] = [:]
        for tomb in existing {
            let dateStr = isoFmt.string(from: tomb.deletedAt)
            if tomb.collection == "tasks" {
                tasks[tomb.entityId] = dateStr
            } else {
                entities[tomb.collection, default: [:]][tomb.entityId] = dateStr
            }
        }
        return (tasks, entities)
    }

    // MARK: - Import helpers (kept for external callers)

    func importTasks(_ dtos: [TaskDTO], into context: ModelContext) {
        let descriptor = FetchDescriptor<HBTask>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for task in existing { context.delete(task) }
        for dto in dtos {
            context.insert(HBTask.from(dto: dto))
        }
    }

    private func importAreas(_ dtos: [EntityDTO], into context: ModelContext) {
        let descriptor = FetchDescriptor<HBArea>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for item in existing { context.delete(item) }
        for dto in dtos { context.insert(HBArea.from(dto: dto)) }
    }

    private func importCategories(_ dtos: [EntityDTO], into context: ModelContext) {
        let descriptor = FetchDescriptor<HBCategory>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for item in existing { context.delete(item) }
        for dto in dtos { context.insert(HBCategory.from(dto: dto)) }
    }

    private func importLabels(_ dtos: [EntityDTO], into context: ModelContext) {
        let descriptor = FetchDescriptor<HBLabel>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for item in existing { context.delete(item) }
        for dto in dtos { context.insert(HBLabel.from(dto: dto)) }
    }

    private func importPeople(_ dtos: [EntityDTO], into context: ModelContext) {
        let descriptor = FetchDescriptor<HBPerson>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for item in existing { context.delete(item) }
        for dto in dtos { context.insert(HBPerson.from(dto: dto)) }
    }

    private func importPerspectives(_ dtos: [EntityDTO], into context: ModelContext) {
        let descriptor = FetchDescriptor<HBPerspective>()
        let existing = (try? context.fetch(descriptor)) ?? []
        for item in existing { context.delete(item) }
        for dto in dtos { context.insert(HBPerspective.from(dto: dto)) }
    }

    // MARK: - Entity Tombstone Merge

    private func mergeEntityTombstones(local: [String: [String: String]], cloud: [String: [String: String]]) -> [String: [String: String]] {
        var merged = local
        for (collection, cloudTombs) in cloud {
            var bucket = merged[collection] ?? [:]
            for (id, ts) in cloudTombs {
                if let existing = bucket[id] {
                    if MergeEngine.compareTimestamps(ts, existing) > 0 { bucket[id] = ts }
                } else {
                    bucket[id] = ts
                }
            }
            merged[collection] = bucket
        }
        // Prune expired (180 days)
        let cutoff = Date().addingTimeInterval(-180 * 86400)
        let isoFmt = ISO8601DateFormatter()
        isoFmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        for (collection, tombs) in merged {
            merged[collection] = tombs.filter { _, ts in
                guard let d = isoFmt.date(from: ts) else { return false }
                return d > cutoff
            }
        }
        return merged
    }

    // MARK: - Retry

    private func retryWithBackoff(attempt: Int = 0) async {
        guard attempt < 6 else {
            lastError = "Conflict persisted after 6 retries"
            return
        }
        let delay = min(pow(2.0, Double(attempt)), 60.0)
        try? await Task.sleep(for: .seconds(delay))
        // Re-run push logic inline to pass incremented attempt on next conflict
        guard let api else { return }
        guard isDirty else { return }
        isSyncing = true
        defer { isSyncing = false }

        do {
            let context = container.mainContext
            var cloudFile: GitHubFile?
            var cloudPayload: CloudPayload?
            do {
                let file = try await api.fetchFile(path: "data.json")
                cloudFile = file
                cloudPayload = try PayloadCoder.decode(file.content)
            } catch GitHubAPIError.notFound {
                try await api.verifyRepo()
            }

            let localTasks = exportTasks(from: context)
            let localAreas = exportAreas(from: context)
            let localCategories = exportCategories(from: context)
            let localLabels = exportLabels(from: context)
            let localPeople = exportPeople(from: context)
            let localPerspectives = exportPerspectives(from: context)
            let localTombstones = exportTombstones(from: context)

            let mergedTasks: [TaskDTO]
            let mergedAreas: [EntityDTO]
            let mergedCategories: [EntityDTO]
            let mergedLabels: [EntityDTO]
            let mergedPeople: [EntityDTO]
            let mergedPerspectives: [EntityDTO]
            let mergedTaskTombstones: [String: String]
            let mergedEntityTombstones: [String: [String: String]]

            if let cloud = cloudPayload {
                mergedTaskTombstones = MergeEngine.mergeTombstones(local: localTombstones.tasks, cloud: cloud.deletedTaskTombstones)
                mergedEntityTombstones = mergeEntityTombstones(local: localTombstones.entities, cloud: cloud.deletedEntityTombstones)
                mergedTasks = MergeEngine.mergeTasks(local: localTasks, cloud: cloud.tasks, tombstones: mergedTaskTombstones)
                mergedAreas = MergeEngine.mergeEntities(local: localAreas, cloud: cloud.areas, tombstones: mergedEntityTombstones["taskCategories"] ?? [:])
                mergedCategories = MergeEngine.mergeEntities(local: localCategories, cloud: cloud.categories, tombstones: mergedEntityTombstones["categories"] ?? [:])
                mergedLabels = MergeEngine.mergeEntities(local: localLabels, cloud: cloud.labels, tombstones: mergedEntityTombstones["taskLabels"] ?? [:])
                mergedPeople = MergeEngine.mergeEntities(local: localPeople, cloud: cloud.people, tombstones: mergedEntityTombstones["taskPeople"] ?? [:])
                mergedPerspectives = MergeEngine.mergeEntities(local: localPerspectives, cloud: cloud.perspectives, tombstones: mergedEntityTombstones["customPerspectives"] ?? [:])
            } else {
                mergedTasks = localTasks
                mergedAreas = localAreas
                mergedCategories = localCategories
                mergedLabels = localLabels
                mergedPeople = localPeople
                mergedPerspectives = localPerspectives
                mergedTaskTombstones = localTombstones.tasks
                mergedEntityTombstones = localTombstones.entities
            }

            importTasks(mergedTasks, into: context)
            importAreas(mergedAreas, into: context)
            importCategories(mergedCategories, into: context)
            importLabels(mergedLabels, into: context)
            importPeople(mergedPeople, into: context)
            importPerspectives(mergedPerspectives, into: context)
            try context.save()
            onDataImported?()

            sequence += 1
            var payload = cloudPayload ?? CloudPayload(
                schemaVersion: 1, sequence: 0, checksum: "", lastUpdated: "",
                tasks: [], areas: [], categories: [], labels: [], people: [],
                perspectives: [], deletedTaskTombstones: [:],
                deletedEntityTombstones: [:], passthrough: [:]
            )
            payload.tasks = mergedTasks
            payload.areas = mergedAreas
            payload.categories = mergedCategories
            payload.labels = mergedLabels
            payload.people = mergedPeople
            payload.perspectives = mergedPerspectives
            payload.deletedTaskTombstones = mergedTaskTombstones
            payload.deletedEntityTombstones = mergedEntityTombstones
            payload.sequence = sequence
            payload.lastUpdated = ISO8601DateFormatter().string(from: Date())

            let encoded = try PayloadCoder.encode(payload)
            _ = try await api.putFile(path: "data.json", content: encoded, sha: cloudFile?.sha, message: "iOS sync")

            clearDirty()
            lastError = nil
            lastSyncInfo = "Pushed \(mergedTasks.count) tasks (retry #\(attempt + 1))"
        } catch GitHubAPIError.conflict {
            await retryWithBackoff(attempt: attempt + 1)
        } catch {
            lastError = error.localizedDescription
        }
    }
}
