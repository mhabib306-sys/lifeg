import SwiftUI

struct ContentView: View {
    @State private var router = NavigationRouter()
    @Environment(SyncCoordinator.self) private var sync
    @Environment(EntityCache.self) private var entityCache

    var body: some View {
        NavigationSplitView {
            SidebarView(router: router)
        } detail: {
            if let perspective = router.selectedPerspective {
                switch perspective {
                case .home:
                    HomeView()
                case .notes:
                    OutlinerView()
                default:
                    TaskListView(perspective: perspective, router: router)
                }
            } else {
                Text("Select a perspective")
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
        .sheet(isPresented: $router.showSearch) {
            GlobalSearchView(isPresented: $router.showSearch)
        }
        .onAppear {
            // Wire entityCache into SyncCoordinator for post-sync reload
            sync.entityCache = entityCache
        }
    }
}
