import XCTest
import SwiftData
@testable import Homebase

final class HBEntityTests: XCTestCase {
    var container: ModelContainer!
    var context: ModelContext!

    override func setUp() {
        let schema = Schema([HBArea.self, HBCategory.self, HBLabel.self, HBPerson.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        container = try! ModelContainer(for: schema, configurations: [config])
        context = ModelContext(container)
    }

    func testCreateArea() {
        let area = HBArea(name: "Work", color: "#FF0000")
        context.insert(area)
        try! context.save()
        XCTAssertTrue(area.id.hasPrefix("area_"))
        XCTAssertEqual(area.name, "Work")
    }

    func testCreateCategory() {
        let cat = HBCategory(name: "Design", areaId: "area_123")
        context.insert(cat)
        try! context.save()
        XCTAssertTrue(cat.id.hasPrefix("cat_"))
        XCTAssertEqual(cat.areaId, "area_123")
    }

    func testCreateLabel() {
        let label = HBLabel(name: "Urgent", color: "#FF0000")
        context.insert(label)
        try! context.save()
        XCTAssertTrue(label.id.hasPrefix("label_"))
    }

    func testCreatePerson() {
        let person = HBPerson(name: "Alice")
        context.insert(person)
        try! context.save()
        XCTAssertTrue(person.id.hasPrefix("person_"))
        XCTAssertEqual(person.email, "")
    }

    func testEntityTouch() {
        let area = HBArea(name: "Test", color: "#000")
        let original = area.updatedAt
        Thread.sleep(forTimeInterval: 0.01)
        area.touch()
        XCTAssertGreaterThan(area.updatedAt, original)
    }
}
