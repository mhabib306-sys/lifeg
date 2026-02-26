import Foundation

enum GitHubAPIError: Error, Equatable, LocalizedError {
    case rateLimited
    case conflict           // 409 — SHA mismatch
    case unauthorized       // 401
    case notFound           // 404 — file/repo doesn't exist or no access
    case networkError(String)
    case decodingError(String)

    var errorDescription: String? {
        switch self {
        case .rateLimited: "GitHub rate limited (403)"
        case .conflict: "SHA conflict (409) — retry"
        case .unauthorized: "Unauthorized (401) — check token"
        case .notFound: "Not found (404) — check owner/repo name and token permissions"
        case .networkError(let msg): "Network: \(msg)"
        case .decodingError(let msg): "Decode: \(msg)"
        }
    }
}

struct GitHubFile {
    let sha: String
    let content: Data   // Decoded from base64
}

protocol URLSessionProtocol: Sendable {
    func data(for request: URLRequest) async throws -> (Data, URLResponse)
}

extension URLSession: URLSessionProtocol {}

final class GitHubAPI: Sendable {
    private let token: String
    private let owner: String
    private let repo: String
    private let session: URLSessionProtocol
    private let baseURL = "https://api.github.com"

    init(token: String, owner: String, repo: String, session: URLSessionProtocol = URLSession.shared) {
        self.token = token
        self.owner = owner
        self.repo = repo
        self.session = session
    }

    func fetchFile(path: String) async throws -> GitHubFile {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)/contents/\(path)")!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let (data, response) = try await session.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0

        switch status {
        case 200: break
        case 401: throw GitHubAPIError.unauthorized
        case 403: throw GitHubAPIError.rateLimited
        case 404: throw GitHubAPIError.notFound
        default: throw GitHubAPIError.networkError("HTTP \(status)")
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let sha = json["sha"] as? String else {
            throw GitHubAPIError.decodingError("Missing sha in contents response")
        }

        let encoding = json["encoding"] as? String ?? ""

        // Files > 1MB: GitHub returns encoding:"none" with no content.
        // Fall back to the Git Blob API which supports up to 100MB.
        if encoding == "none" || encoding.isEmpty {
            return try await fetchBlob(sha: sha)
        }

        guard let base64Raw = json["content"] as? String else {
            throw GitHubAPIError.decodingError("Missing content in contents response")
        }
        let base64 = base64Raw.replacingOccurrences(of: "\n", with: "")
                               .replacingOccurrences(of: "\r", with: "")
        guard let content = Data(base64Encoded: base64) else {
            throw GitHubAPIError.decodingError("Invalid base64 content")
        }

        return GitHubFile(sha: sha, content: content)
    }

    /// Fetch file content via the Git Blob API (supports files up to 100MB).
    private func fetchBlob(sha: String) async throws -> GitHubFile {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)/git/blobs/\(sha)")!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 60

        let (data, response) = try await session.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0

        switch status {
        case 200: break
        case 401: throw GitHubAPIError.unauthorized
        case 403: throw GitHubAPIError.rateLimited
        default: throw GitHubAPIError.networkError("Blob HTTP \(status)")
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let base64Raw = json["content"] as? String else {
            throw GitHubAPIError.decodingError("Missing content in blob response")
        }
        let base64 = base64Raw.replacingOccurrences(of: "\n", with: "")
                               .replacingOccurrences(of: "\r", with: "")
        guard let content = Data(base64Encoded: base64) else {
            throw GitHubAPIError.decodingError("Invalid base64 in blob response")
        }

        return GitHubFile(sha: sha, content: content)
    }

    /// Check if the repo is accessible (distinguishes bad creds from missing file).
    func verifyRepo() async throws {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)")!)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 15

        let (_, response) = try await session.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0

        switch status {
        case 200: return // Repo accessible
        case 401: throw GitHubAPIError.unauthorized
        case 403: throw GitHubAPIError.rateLimited
        case 404: throw GitHubAPIError.notFound
        default: throw GitHubAPIError.networkError("HTTP \(status)")
        }
    }

    func putFile(path: String, content: Data, sha: String?, message: String) async throws -> String {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)/contents/\(path)")!)
        request.httpMethod = "PUT"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        var body: [String: Any] = [
            "message": message,
            "content": content.base64EncodedString()
        ]
        if let sha { body["sha"] = sha }
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await session.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0

        switch status {
        case 200, 201: break
        case 401: throw GitHubAPIError.unauthorized
        case 403: throw GitHubAPIError.rateLimited
        case 409: throw GitHubAPIError.conflict
        default: throw GitHubAPIError.networkError("HTTP \(status)")
        }

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let contentObj = json["content"] as? [String: Any],
              let newSha = contentObj["sha"] as? String else {
            throw GitHubAPIError.decodingError("Missing sha in put response")
        }
        return newSha
    }
}
