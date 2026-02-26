import SwiftUI
import SwiftData

@main
struct HomebaseApp: App {
    let container: ModelContainer
    @State private var syncCoordinator: SyncCoordinator
    @State private var entityCache = EntityCache()

    init() {
        let schema = Schema([
            HBTask.self,
            HBArea.self,
            HBCategory.self,
            HBLabel.self,
            HBPerson.self,
            HBPerspective.self,
            HBTombstone.self
        ])
        let config = ModelConfiguration("Homebase", isStoredInMemoryOnly: false)

        // Step 12: Graceful recovery instead of try!
        let c: ModelContainer
        do {
            c = try ModelContainer(for: schema, configurations: [config])
        } catch {
            // Delete store files and recreate — data recovers from cloud sync
            let url = config.url
            let fm = FileManager.default
            for suffix in ["", "-wal", "-shm"] {
                try? fm.removeItem(at: url.appendingPathExtension(suffix.isEmpty ? "" : String(suffix.dropFirst())))
            }
            // Also try removing the actual store file variants
            let storeDir = url.deletingLastPathComponent()
            if let files = try? fm.contentsOfDirectory(at: storeDir, includingPropertiesForKeys: nil) {
                for file in files where file.lastPathComponent.hasPrefix("Homebase") {
                    try? fm.removeItem(at: file)
                }
            }
            c = try! ModelContainer(for: schema, configurations: [config])
        }
        self.container = c
        self._syncCoordinator = State(initialValue: SyncCoordinator(container: c))
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(syncCoordinator)
                .environment(entityCache)
                .onAppear {
                    entityCache.loadIfNeeded(from: container.mainContext)
                    syncCoordinator.initialSync()
                }
        }
        .modelContainer(container)
    }
}
