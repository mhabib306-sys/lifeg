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
            let context = container.mainContext

            // 1. Try to fetch cloud file (may not exist yet)
            var cloudFile: GitHubFile?
            var cloudPayload: CloudPayload?
            do {
                let file = try await api.fetchFile(path: "data.json")
                cloudFile = file
                cloudPayload = try PayloadCoder.decode(file.content)
                print("[Sync] Fetched cloud: \(cloudPayload?.tasks.count ?? 0) tasks")
            } catch GitHubAPIError.notFound {
                // Verify the repo itself is accessible
                try await api.verifyRepo()
                print("[Sync] data.json not found — will create on first push")
                cloudFile = nil
                cloudPayload = nil
            }

            // 2. Export local state
            let localTasks = exportTasks(from: context)
            let localAreas = exportAreas(from: context)
            let localCategories = exportCategories(from: context)
            let localLabels = exportLabels(from: context)
            let localPeople = exportPeople(from: context)
            let localPerspectives = exportPerspectives(from: context)
            let localTombstones = exportTombstones(from: context)
            print("[Sync] Local: \(localTasks.count) tasks, \(localAreas.count) areas")

            // 3. Merge with cloud (or use local-only if no cloud data)
            let mergedTasks: [TaskDTO]
            let mergedAreas: [EntityDTO]
            let mergedCategories: [EntityDTO]
            let mergedLabels: [EntityDTO]
            let mergedPeople: [EntityDTO]
            let mergedPerspectives: [EntityDTO]
            let mergedTaskTombstones: [String: String]

            if let cloud = cloudPayload {
                mergedTaskTombstones = MergeEngine.mergeTombstones(
                    local: localTombstones.tasks,
                    cloud: cloud.deletedTaskTombstones
                )
                mergedTasks = MergeEngine.mergeTasks(
                    local: localTasks, cloud: cloud.tasks,
                    tombstones: mergedTaskTombstones
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
                // No cloud data — local is the source of truth
                mergedTasks = localTasks
                mergedAreas = localAreas
                mergedCategories = localCategories
                mergedLabels = localLabels
                mergedPeople = localPeople
                mergedPerspectives = localPerspectives
                mergedTaskTombstones = localTombstones.tasks
            }

            // 4. Import merged state back to local
            importTasks(mergedTasks, into: context)
            importAreas(mergedAreas, into: context)
            importCategories(mergedCategories, into: context)
            importLabels(mergedLabels, into: context)
            importPeople(mergedPeople, into: context)
            importPerspectives(mergedPerspectives, into: context)
            try context.save()
            onDataImported?()
            print("[Sync] Imported \(mergedTasks.count) merged tasks")

            // 5. Build payload
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
            payload.sequence = sequence
            payload.lastUpdated = ISO8601DateFormatter().string(from: Date())

            // 6. Encode and push (sha=nil creates the file for the first time)
            let encoded = try PayloadCoder.encode(payload)
            _ = try await api.putFile(path: "data.json", content: encoded, sha: cloudFile?.sha, message: "iOS sync")

            // 7. Success
            clearDirty()
            lastError = nil
            lastSyncInfo = "Pushed \(mergedTasks.count) tasks"
            print("[Sync] push() success — \(mergedTasks.count) tasks pushed")
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
            let file: GitHubFile
            do {
                file = try await api.fetchFile(path: "data.json")
                print("[Sync] Fetched data.json (\(file.content.count) bytes)")
            } catch GitHubAPIError.notFound {
                // 404 could mean file missing OR repo missing/bad creds.
                // Verify the repo is accessible.
                do {
                    try await api.verifyRepo()
                    // Repo exists, file just doesn't exist yet
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

            let cloudPayload: CloudPayload
            do {
                cloudPayload = try PayloadCoder.decode(file.content)
                print("[Sync] Decoded: \(cloudPayload.tasks.count) tasks, \(cloudPayload.areas.count) areas, \(cloudPayload.labels.count) labels")
            } catch {
                lastError = "Decode: \(error.localizedDescription)"
                print("[Sync] pull() decode error: \(error)")
                return
            }

            let context = container.mainContext
            let localTasks = exportTasks(from: context)
            let localAreas = exportAreas(from: context)
            let localCategories = exportCategories(from: context)
            let localLabels = exportLabels(from: context)
            let localPeople = exportPeople(from: context)
            let localPerspectives = exportPerspectives(from: context)

            let mergedTasks = MergeEngine.mergeTasks(
                local: localTasks,
                cloud: cloudPayload.tasks,
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

            importTasks(mergedTasks, into: context)
            importAreas(mergedAreas, into: context)
            importCategories(mergedCategories, into: context)
            importLabels(mergedLabels, into: context)
            importPeople(mergedPeople, into: context)
            importPerspectives(mergedPerspectives, into: context)
            try context.save()
            onDataImported?()
            lastError = nil
            lastSyncInfo = "Pulled \(mergedTasks.count) tasks, \(mergedAreas.count) areas"
            print("[Sync] pull() success — \(mergedTasks.count) tasks, \(mergedAreas.count) areas imported")
        } catch {
            lastError = "Pull: \(error.localizedDescription)"
            print("[Sync] pull() error: \(error)")
        }
    }

    // MARK: - Export helpers

    func exportTasks(from context: ModelContext) -> [TaskDTO] {
        let descriptor = FetchDescriptor<HBTask>()
        let tasks = (try? context.fetch(descriptor)) ?? []
        return tasks.map { $0.toDTO() }
    }

    private func exportAreas(from context: ModelContext) -> [EntityDTO] {
        let descriptor = FetchDescriptor<HBArea>()
        let items = (try? context.fetch(descriptor)) ?? []
        return items.map { $0.toDTO() }
    }

    private func exportCategories(from context: ModelContext) -> [EntityDTO] {
        let descriptor = FetchDescriptor<HBCategory>()
        let items = (try? context.fetch(descriptor)) ?? []
        return items.map { $0.toDTO() }
    }

    private func exportLabels(from context: ModelContext) -> [EntityDTO] {
        let descriptor = FetchDescriptor<HBLabel>()
        let items = (try? context.fetch(descriptor)) ?? []
        return items.map { $0.toDTO() }
    }

    private func exportPeople(from context: ModelContext) -> [EntityDTO] {
        let descriptor = FetchDescriptor<HBPerson>()
        let items = (try? context.fetch(descriptor)) ?? []
        return items.map { $0.toDTO() }
    }

    private func exportPerspectives(from context: ModelContext) -> [EntityDTO] {
        let descriptor = FetchDescriptor<HBPerspective>()
        let items = (try? context.fetch(descriptor)) ?? []
        return items.map { $0.toDTO() }
    }

    private func exportTombstones(from context: ModelContext) -> (tasks: [String: String], entities: [String: [String: String]]) {
        let descriptor = FetchDescriptor<HBTombstone>()
        let tombstones = (try? context.fetch(descriptor)) ?? []
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

        var taskTombstones: [String: String] = [:]
        var entityTombstones: [String: [String: String]] = [:]

        for tomb in tombstones {
            let dateStr = isoFormatter.string(from: tomb.deletedAt)
            if tomb.collection == "tasks" {
                taskTombstones[tomb.entityId] = dateStr
            } else {
                entityTombstones[tomb.collection, default: [:]][tomb.entityId] = dateStr
            }
        }
        return (taskTombstones, entityTombstones)
    }

    // MARK: - Import helpers

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

    // MARK: - Retry

    private func retryWithBackoff(attempt: Int = 0) async {
        guard attempt < 6 else { return }
        let delay = min(pow(2.0, Double(attempt)), 60.0)
        try? await Task.sleep(for: .seconds(delay))
        await push()
    }
}
