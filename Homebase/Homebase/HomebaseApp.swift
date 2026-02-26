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
        let c = try! ModelContainer(for: schema, configurations: [config])
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
