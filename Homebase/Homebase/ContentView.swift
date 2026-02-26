import SwiftUI

struct ContentView: View {
    @State private var router = NavigationRouter()
    @State private var columnVisibility: NavigationSplitViewVisibility = .detailOnly

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            SidebarView(router: router)
        } detail: {
            if let perspective = router.selectedPerspective {
                detailView(for: perspective)
            } else {
                Text("Select a perspective")
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
        .navigationSplitViewStyle(.balanced)
        .sheet(isPresented: $router.showSearch) {
            GlobalSearchView(isPresented: $router.showSearch)
        }
    }

    @ViewBuilder
    private func detailView(for perspective: PerspectiveType) -> some View {
        switch perspective {
        case .home:
            HomeView()
        case .notes:
            OutlinerView()
        default:
            TaskListView(perspective: perspective, router: router)
        }
    }
}
