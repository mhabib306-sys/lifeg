import XCTest
@testable import Homebase

final class GitHubAPITests: XCTestCase {

    func testFetchFileDecodesContent() async throws {
        let mockContent = "{\"_schemaVersion\":1}".data(using: .utf8)!.base64EncodedString()
        let mockResponse = """
        {"sha": "abc123", "content": "\(mockContent)", "encoding": "base64"}
        """.data(using: .utf8)!

        let api = GitHubAPI(
            token: "fake",
            owner: "test",
            repo: "test",
            session: MockURLSession(data: mockResponse, statusCode: 200)
        )
        let file = try await api.fetchFile(path: "data.json")
        XCTAssertEqual(file.sha, "abc123")
        XCTAssertTrue(file.content.contains("schemaVersion".utf8))
    }

    func testPutFileReturnsNewSHA() async throws {
        let mockResponse = """
        {"content": {"sha": "newsha456"}}
        """.data(using: .utf8)!

        let api = GitHubAPI(
            token: "fake",
            owner: "test",
            repo: "test",
            session: MockURLSession(data: mockResponse, statusCode: 200)
        )
        let newSHA = try await api.putFile(
            path: "data.json",
            content: Data("{}".utf8),
            sha: "oldsha",
            message: "sync"
        )
        XCTAssertEqual(newSHA, "newsha456")
    }

    func testRateLimitThrows() async {
        let api = GitHubAPI(
            token: "fake",
            owner: "test",
            repo: "test",
            session: MockURLSession(data: Data(), statusCode: 403)
        )
        do {
            _ = try await api.fetchFile(path: "data.json")
            XCTFail("Should throw")
        } catch let error as GitHubAPIError {
            XCTAssertEqual(error, .rateLimited)
        }
    }
}

// Helper to check if Data contains a UTF-8 substring
private extension Data {
    func contains(_ other: String.UTF8View) -> Bool {
        let otherData = Data(other)
        guard otherData.count <= count else { return false }
        for i in 0...(count - otherData.count) {
            if self[i..<(i + otherData.count)] == otherData {
                return true
            }
        }
        return false
    }
}
