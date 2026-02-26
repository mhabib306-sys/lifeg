import SwiftUI

struct ContentView: View {
    @State private var router = NavigationRouter()
    @State private var columnVisibility: NavigationSplitViewVisibility = .detailOnly

    private var showFAB: Bool {
        guard let p = router.selectedPerspective else { return false }
        switch p {
        case .home, .logbook, .notes: return false
        default: return true
        }
    }

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
        .overlay(alignment: .bottomTrailing) {
            if showFAB {
                FloatingAddButton {
                    router.presentedSheet = .taskEditor(nil)
                }
                .padding(.trailing, 20)
                .padding(.bottom, 28)
                .transition(.scale(scale: 0.85).combined(with: .opacity))
            }
        }
        .animation(HBTheme.springSnappy, value: showFAB)
        .sheet(isPresented: $router.showSearch) {
            GlobalSearchView(isPresented: $router.showSearch)
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationCornerRadius(20)
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

// MARK: - Floating Add Button (Things 3 style)

private struct FloatingAddButton: View {
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: "plus")
                .font(.system(size: 22, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 56, height: 56)
                .background(
                    Circle()
                        .fill(HBTheme.accent)
                        .shadow(color: HBTheme.accent.opacity(0.35), radius: 8, y: 4)
                )
        }
        .buttonStyle(ThingsPressStyle())
    }
}
