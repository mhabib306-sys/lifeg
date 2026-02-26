import SwiftUI
import SwiftData

@main
struct HomebaseApp: App {
    let container: ModelContainer
    @State private var syncCoordinator: SyncCoordinator
    @State private var isReady = false

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
            ZStack {
                ContentView()
                    .environment(syncCoordinator)
                    .opacity(isReady ? 1 : 0)

                if !isReady {
                    SplashView()
                        .transition(.opacity)
                }
            }
            .animation(HBTheme.springDefault, value: isReady)
            .task {
                // Load entity cache (fast local DB reads), then reveal UI
                syncCoordinator.entityCache.loadIfNeeded(from: container.mainContext)
                isReady = true
                // Network sync runs in background — don't block the UI
                await Task.yield()
                syncCoordinator.initialSync()
            }
        }
        .modelContainer(container)
    }
}

// MARK: - Splash Screen

private struct SplashView: View {
    private var versionString: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "—"
        return "v\(version)"
    }

    var body: some View {
        ZStack {
            Color(red: 0.969, green: 0.965, blue: 0.953) // matches LaunchBackground
                .ignoresSafeArea()

            VStack(spacing: 20) {
                if let icon = UIImage(named: "AppIcon") {
                    Image(uiImage: icon)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 80, height: 80)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        .shadow(color: .black.opacity(0.08), radius: 8, y: 3)
                }

                ProgressView()
                    .tint(HBTheme.textTertiary)
            }

            VStack {
                Spacer()
                Text(versionString)
                    .font(.system(size: 11, weight: .regular, design: .monospaced))
                    .foregroundStyle(HBTheme.textTertiary)
                    .padding(.bottom, 48)
            }
        }
    }
}
