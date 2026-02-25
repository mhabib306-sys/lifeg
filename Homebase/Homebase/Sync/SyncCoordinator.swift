import SwiftUI
import SwiftData
import Observation

@MainActor @Observable
final class SyncCoordinator {
    let engine: SyncEngine
    private var lifecycleObservers: [Any] = []

    init(container: ModelContainer) {
        let token = KeychainHelper.load(key: "githubToken")
        let owner = UserDefaults.standard.string(forKey: "githubOwner") ?? ""
        let repo = UserDefaults.standard.string(forKey: "githubRepo") ?? ""

        let api: GitHubAPI? = token.flatMap { t in
            guard !owner.isEmpty, !repo.isEmpty else { return nil }
            return GitHubAPI(token: t, owner: owner, repo: repo)
        }
        self.engine = SyncEngine(container: container, api: api)
        setupLifecycleObservers()
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
        }
    }
}
