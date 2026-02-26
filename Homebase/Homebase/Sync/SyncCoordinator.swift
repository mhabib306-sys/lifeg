import SwiftUI
import SwiftData
import Observation

@MainActor @Observable
final class SyncCoordinator {
    let engine: SyncEngine
    let entityCache = EntityCache()
    private var lifecycleObservers: [Any] = []

    init(container: ModelContainer) {
        let api = Self.buildAPI()
        self.engine = SyncEngine(container: container, api: api)
        setupLifecycleObservers()
    }

    /// Re-reads credentials from Keychain/UserDefaults and updates the engine.
    func reloadCredentials() {
        let api = Self.buildAPI()
        engine.updateAPI(api)
    }

    private static func buildAPI() -> GitHubAPI? {
        let token = KeychainHelper.load(key: "githubToken")
        let owner = UserDefaults.standard.string(forKey: "githubOwner") ?? ""
        let repo = UserDefaults.standard.string(forKey: "githubRepo") ?? ""

        return token.flatMap { t in
            guard !owner.isEmpty, !repo.isEmpty else { return nil }
            return GitHubAPI(token: t, owner: owner, repo: repo)
        }
    }

    private func setupLifecycleObservers() {
        // Pull on foreground
        let fg = NotificationCenter.default.addObserver(
            forName: UIApplication.willEnterForegroundNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            Task { await self?.engine.pull() }
        }
        // Push on background
        let bg = NotificationCenter.default.addObserver(
            forName: UIApplication.didEnterBackgroundNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            Task { await self?.engine.push() }
        }
        lifecycleObservers = [fg, bg]
    }

    func initialSync() {
        Task {
            if engine.isDirty {
                await engine.push()
            } else {
                await engine.pull()
            }
            entityCache.reload(from: engine.container.mainContext)
        }
    }
}
