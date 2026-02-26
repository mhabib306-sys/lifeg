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

                Button("Save & Apply") {
                    let trimmedToken = token.trimmingCharacters(in: .whitespacesAndNewlines)
                    let trimmedOwner = owner.trimmingCharacters(in: .whitespacesAndNewlines)
                    let trimmedRepo = repo.trimmingCharacters(in: .whitespacesAndNewlines)
                    KeychainHelper.save(key: "githubToken", value: trimmedToken)
                    UserDefaults.standard.set(trimmedOwner, forKey: "githubOwner")
                    UserDefaults.standard.set(trimmedRepo, forKey: "githubRepo")
                    token = trimmedToken
                    owner = trimmedOwner
                    repo = trimmedRepo
                    sync.reloadCredentials()
                    saveConfirmed = true
                    // Trigger immediate pull to validate credentials and fetch data
                    Task { await sync.engine.pull() }
                }
                .disabled(token.isEmpty || owner.isEmpty || repo.isEmpty)

                if saveConfirmed {
                    if let error = sync.engine.lastError {
                        Text(error)
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(.red)
                    } else if let info = sync.engine.lastSyncInfo {
                        Text(info)
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(HBTheme.logbook)
                    } else {
                        Text("Saved and connected.")
                            .font(HBTheme.subtitleFont)
                            .foregroundStyle(HBTheme.logbook)
                    }
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
                            .font(.caption2)
                            .textSelection(.enabled)
                            .lineLimit(5)
                    } else {
                        Text("Idle")
                            .foregroundStyle(HBTheme.textSecondary)
                    }
                }

                if let info = sync.engine.lastSyncInfo {
                    HStack {
                        Text("Last Sync")
                        Spacer()
                        Text(info)
                            .foregroundStyle(HBTheme.logbook)
                            .font(.caption2)
                    }
                }

                HStack {
                    Text("Dirty")
                    Spacer()
                    Text(sync.engine.isDirty ? "Yes" : "No")
                        .foregroundStyle(sync.engine.isDirty ? HBTheme.flagged : HBTheme.textSecondary)
                }

                Button("Sync Now") {
                    Task { await sync.engine.syncNow() }
                }

                Button("Pull from Cloud") {
                    Task { await sync.engine.pull() }
                }
            }

            Section("Diagnostics") {
                HStack {
                    Text("API Configured")
                    Spacer()
                    Text(sync.engine.isConfigured ? "Yes" : "No")
                        .foregroundStyle(sync.engine.isConfigured ? HBTheme.logbook : .red)
                }
                HStack {
                    Text("Token in Keychain")
                    Spacer()
                    let stored = KeychainHelper.load(key: "githubToken")
                    Text(stored != nil ? "\(stored!.prefix(4))..." : "None")
                        .foregroundStyle(stored != nil ? HBTheme.textSecondary : .red)
                }
                HStack {
                    Text("Owner")
                    Spacer()
                    Text(UserDefaults.standard.string(forKey: "githubOwner") ?? "—")
                        .foregroundStyle(HBTheme.textSecondary)
                }
                HStack {
                    Text("Repo")
                    Spacer()
                    Text(UserDefaults.standard.string(forKey: "githubRepo") ?? "—")
                        .foregroundStyle(HBTheme.textSecondary)
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
