import Foundation

enum GitHubAPIError: Error, Equatable {
    case rateLimited
    case conflict           // 409 — SHA mismatch
    case unauthorized       // 401
    case networkError(String)
    case decodingError(String)
}

struct GitHubFile {
    let sha: String
    let content: Data   // Decoded from base64
}

protocol URLSessionProtocol {
    func data(for request: URLRequest) async throws -> (Data, URLResponse)
}

extension URLSession: URLSessionProtocol {}

final class GitHubAPI {
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
        default: throw GitHubAPIError.networkError("HTTP \(status)")
        }

        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        let sha = json["sha"] as! String
        let base64 = (json["content"] as! String).replacingOccurrences(of: "\n", with: "")
        let content = Data(base64Encoded: base64)!

        return GitHubFile(sha: sha, content: content)
    }

    func putFile(path: String, content: Data, sha: String, message: String) async throws -> String {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)/contents/\(path)")!)
        request.httpMethod = "PUT"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/vnd.github.v3+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let body: [String: Any] = [
            "message": message,
            "content": content.base64EncodedString(),
            "sha": sha
        ]
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

        let json = try JSONSerialization.jsonObject(with: data) as! [String: Any]
        let contentObj = json["content"] as! [String: Any]
        return contentObj["sha"] as! String
    }
}
