import SwiftUI
import SwiftData

@main
struct HomebaseApp: App {
    let container: ModelContainer
    @State private var syncCoordinator: SyncCoordinator

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

        let container: ModelContainer
        do {
            let config = ModelConfiguration("Homebase", isStoredInMemoryOnly: false)
            container = try ModelContainer(for: schema, configurations: [config])
        } catch {
            // If persistent store fails, fall back to in-memory
            print("[Homebase] ModelContainer failed: \(error). Falling back to in-memory store.")
            container = try! ModelContainer(for: schema, configurations: [
                ModelConfiguration("Homebase", isStoredInMemoryOnly: true)
            ])
        }

        self.container = container
        self._syncCoordinator = State(initialValue: SyncCoordinator(container: container))
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(syncCoordinator)
                .onAppear {
                    syncCoordinator.entityCache.loadIfNeeded(from: container.mainContext)
                    syncCoordinator.initialSync()
                }
        }
        .modelContainer(container)
    }
}
