import SwiftUI
import SwiftData

struct SidebarView: View {
    @Bindable var router: NavigationRouter
    @Query private var tasks: [HBTask]

    var body: some View {
        List(selection: $router.selectedPerspective) {
            Section {
                ForEach(PerspectiveType.allCases) { perspective in
                    PerspectiveRow(
                        perspective: perspective,
                        count: badgeCount(for: perspective)
                    )
                    .tag(perspective)
                }
            }

            Section("Manage") {
                NavigationLink { AreaListView() } label: {
                    Label("Areas", systemImage: "folder")
                }
                NavigationLink { LabelListView() } label: {
                    Label("Labels", systemImage: "tag")
                }
                NavigationLink { PersonListView() } label: {
                    Label("People", systemImage: "person.2")
                }
            }

            Section {
                NavigationLink { SettingsView() } label: {
                    Label("Settings", systemImage: "gear")
                }
            }
        }
        .listStyle(.sidebar)
        .navigationTitle("Homebase")
    }

    private func badgeCount(for perspective: PerspectiveType) -> Int {
        switch perspective {
        case .inbox:
            tasks.filter { !$0.isNote && !$0.completed && $0.status == "inbox" }.count
        case .today:
            tasks.filter { !$0.isNote && !$0.completed && $0.today }.count
        case .flagged:
            tasks.filter { !$0.isNote && !$0.completed && $0.flagged }.count
        default: 0
        }
    }
}
