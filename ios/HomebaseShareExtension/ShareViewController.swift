import UIKit
import Social

/// Share Extension: accepts text/URL from other apps and writes to App Group
/// for the main app to pick up and create inbox tasks.
class ShareViewController: SLComposeServiceViewController {

    private let appGroupId = "group.com.homebase.app"

    override func isContentValid() -> Bool {
        return true
    }

    override func didSelectPost() {
        guard let defaults = UserDefaults(suiteName: appGroupId) else {
            extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
            return
        }

        let text = contentText ?? ""

        // Get URL from attachments if available
        if let item = extensionContext?.inputItems.first as? NSExtensionItem,
           let attachment = item.attachments?.first {
            if attachment.hasItemConformingToTypeIdentifier("public.url") {
                attachment.loadItem(forTypeIdentifier: "public.url", options: nil) { [weak self] (data, error) in
                    let url = (data as? URL)?.absoluteString ?? ""
                    self?.saveSharedItem(text: text, url: url, defaults: defaults)
                }
            } else {
                saveSharedItem(text: text, url: "", defaults: defaults)
            }
        } else {
            saveSharedItem(text: text, url: "", defaults: defaults)
        }
    }

    private func saveSharedItem(text: String, url: String, defaults: UserDefaults) {
        // Append to pending shared items array
        var pending = defaults.array(forKey: "pendingSharedItems") as? [[String: String]] ?? []
        pending.append([
            "text": text,
            "url": url,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ])
        defaults.set(pending, forKey: "pendingSharedItems")

        // Open main app via URL scheme
        if let appUrl = URL(string: "homebase://share") {
            // Note: Share extensions can't directly open URLs.
            // The main app checks pendingSharedItems on launch/resume.
            _ = appUrl
        }

        extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }

    override func configurationItems() -> [Any]! {
        return []
    }
}
