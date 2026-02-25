import SwiftUI

struct ContentView: View {
    @State private var router = NavigationRouter()

    var body: some View {
        NavigationSplitView {
            SidebarView(router: router)
        } detail: {
            if let perspective = router.selectedPerspective {
                if perspective == .notes {
                    OutlinerView()
                } else {
                    TaskListView(perspective: perspective, router: router)
                }
            } else {
                Text("Select a perspective")
                    .foregroundStyle(HBTheme.textTertiary)
            }
        }
    }
}
