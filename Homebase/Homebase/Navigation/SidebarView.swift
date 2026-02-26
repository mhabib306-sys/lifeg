import SwiftUI
import SwiftData

struct SidebarView: View {
    @Bindable var router: NavigationRouter
    // Step 12: Filter query for badge counting — exclude notes and completed
    @Query(filter: #Predicate<HBTask> { !$0.isNote && !$0.completed }) private var activeTasks: [HBTask]
    @Query private var tasks: [HBTask]

    var body: some View {
        List(selection: $router.selectedPerspective) {
            // Step 6: Split into main and library sections
            Section {
                ForEach(PerspectiveType.mainCases, id: \.self) { perspective in
                    PerspectiveRow(
                        perspective: perspective,
                        count: badgeCount(for: perspective)
                    )
                    .tag(perspective)
                }
            }

            Section("Library") {
                ForEach(PerspectiveType.libraryCases, id: \.self) { perspective in
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
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    Haptic.selection()
                    router.showSearch = true
                } label: {
                    Image(systemName: "magnifyingglass")
                }
            }
        }
        .onChange(of: router.selectedPerspective) { _, _ in
            Haptic.selection()
        }
    }

    private func badgeCount(for perspective: PerspectiveType) -> Int {
        switch perspective {
        case .inbox:
            activeTasks.filter { $0.areaId == nil }.count
        case .today:
            activeTasks.filter { $0.today }.count
        case .flagged:
            activeTasks.filter { $0.flagged }.count
        default: 0
        }
    }
}
