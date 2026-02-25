import SwiftUI

struct SettingsView: View {
    @State private var token = ""
    @State private var owner = UserDefaults.standard.string(forKey: "githubOwner") ?? ""
    @State private var repo = UserDefaults.standard.string(forKey: "githubRepo") ?? ""
    @State private var showToken = false
    @State private var saveConfirmed = false
    @Environment(SyncCoordinator.self) private var sync

    var body: some View {
        Form {
            Section("GitHub Sync") {
                HStack {
                    if showToken {
                        TextField("Personal Access Token", text: $token)
                            .autocapitalization(.none)
                    } else {
                        SecureField("Personal Access Token", text: $token)
                    }
                    Button(showToken ? "Hide" : "Show") { showToken.toggle() }
                        .font(.caption)
                }
                TextField("Owner", text: $owner)
                    .autocapitalization(.none)
                TextField("Repository", text: $repo)
                    .autocapitalization(.none)

                Button("Save") {
                    KeychainHelper.save(key: "githubToken", value: token)
                    UserDefaults.standard.set(owner, forKey: "githubOwner")
                    UserDefaults.standard.set(repo, forKey: "githubRepo")
                    saveConfirmed = true
                }
                .disabled(token.isEmpty || owner.isEmpty || repo.isEmpty)

                if saveConfirmed {
                    Text("Saved. Restart app to apply.")
                        .font(HBTheme.subtitleFont)
                        .foregroundStyle(HBTheme.logbook)
                }
            }

            Section("Sync Status") {
                HStack {
                    Text("Status")
                    Spacer()
                    if sync.engine.isSyncing {
                        ProgressView()
                            .controlSize(.small)
                        Text("Syncing...")
                            .foregroundStyle(HBTheme.accent)
                    } else if let error = sync.engine.lastError {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(HBTheme.subtitleFont)
                    } else {
                        Text("Idle")
                            .foregroundStyle(HBTheme.textSecondary)
                    }
                }

                HStack {
                    Text("Dirty")
                    Spacer()
                    Text(sync.engine.isDirty ? "Yes" : "No")
                        .foregroundStyle(sync.engine.isDirty ? HBTheme.flagged : HBTheme.textSecondary)
                }

                Button("Sync Now") {
                    Task { await sync.engine.push() }
                }

                Button("Pull from Cloud") {
                    Task { await sync.engine.pull() }
                }
            }

            Section("About") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0").foregroundStyle(HBTheme.textSecondary)
                }
                HStack {
                    Text("Platform")
                    Spacer()
                    Text("iOS (SwiftUI)").foregroundStyle(HBTheme.textSecondary)
                }
            }
        }
        .navigationTitle("Settings")
        .onAppear {
            token = KeychainHelper.load(key: "githubToken") ?? ""
        }
    }
}
