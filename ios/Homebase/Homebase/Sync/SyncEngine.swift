import Foundation
import SwiftData
import Observation

@Observable
final class SyncEngine {
    let container: ModelContainer
    private let api: GitHubAPI?
    private let dirtyKey = "syncDirty"
    private let sequenceKey = "syncSequence"
    private var debounceTask: Task<Void, Never>?

    var isSyncing = false
    var lastError: String?

    var isDirty: Bool {
        UserDefaults.standard.bool(forKey: dirtyKey)
    }

    init(container: ModelContainer, api: GitHubAPI?) {
        self.container = container
        self.api = api
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

    // MARK: - Push (full sync)

    @MainActor
    func push() async {
        guard let api else { return }
        guard isDirty else { return }
        isSyncing = true
        defer { isSyncing = false }

        do {
            // 1. Fetch cloud
            let file = try await api.fetchFile(path: "data.json")
            let cloudPayload = try PayloadCoder.decode(file.content)

            // 2. Export local state
            let context = ModelContext(container)
            let localTasks = exportTasks(from: context)
            let localAreas = exportAreas(from: context)
            let localCategories = exportCategories(from: context)
            let localLabels = exportLabels(from: context)
            let localPeople = exportPeople(from: context)
            let localPerspectives = exportPerspectives(from: context)
            let localTombstones = exportTombstones(from: context)

            // 3. Merge tombstones first
            let mergedTaskTombstones = MergeEngine.mergeTombstones(
                local: localTombstones.tasks,
                cloud: cloudPayload.deletedTaskTombstones
            )

            // 4. Merge tasks and entities
            let mergedTasks = MergeEngine.mergeTasks(
                local: localTasks,
                cloud: cloudPayload.tasks,
                tombstones: mergedTaskTombstones
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

            // 5. Import merged state back to local
            importTasks(mergedTasks, into: context)
            importAreas(mergedAreas, into: context)
            importCategories(mergedCategories, into: context)
            importLabels(mergedLabels, into: context)
            importPeople(mergedPeople, into: context)
            importPerspectives(mergedPerspectives, into: context)
            try context.save()

            // 6. Build payload
            sequence += 1
            var payload = cloudPayload  // Start from cloud (preserves passthrough)
            payload.tasks = mergedTasks
            payload.areas = mergedAreas
            payload.categories = mergedCategories
            payload.labels = mergedLabels
            payload.people = mergedPeople
            payload.perspectives = mergedPerspectives
            payload.deletedTaskTombstones = mergedTaskTombstones
            payload.sequence = sequence
            payload.lastUpdated = ISO8601DateFormatter().string(from: Date())

            // 7. Encode and push
            let encoded = try PayloadCoder.encode(payload)
            _ = try await api.putFile(path: "data.json", content: encoded, sha: file.sha, message: "iOS sync")

            // 8. Success
            clearDirty()
            lastError = nil
        } catch GitHubAPIError.conflict {
            lastError = "Conflict — retrying"
            await retryWithBackoff()
        } catch GitHubAPIError.rateLimited {
            lastError = "Rate limited — pausing 60s"
            try? await Task.sleep(for: .seconds(60))
        } catch {
            lastError = error.localizedDescription
        }
    }

    // MARK: - Pull (fetch cloud into local)

    @MainActor
    func pull() async {
        guard let api else { return }
        isSyncing = true
        defer { isSyncing = false }

        do {
            let file = try await api.fetchFile(path: "data.json")
            let cloudPayload = try PayloadCoder.decode(file.content)

            let context = ModelContext(container)
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
            lastError = nil
        } catch {
            lastError = error.localizedDescription
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
