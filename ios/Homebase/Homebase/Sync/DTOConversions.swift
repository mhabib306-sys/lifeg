import Foundation

// MARK: - ISO Date Helpers

private let isoFormatter: ISO8601DateFormatter = {
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return f
}()

private func isoString(from date: Date) -> String {
    isoFormatter.string(from: date)
}

private func dateFromISO(_ string: String?) -> Date? {
    guard let string else { return nil }
    return isoFormatter.date(from: string)
}

// MARK: - HBTask ↔ TaskDTO

extension HBTask {
    func toDTO() -> TaskDTO {
        TaskDTO(
            id: id,
            title: title,
            notes: notes,
            status: status,
            today: today,
            flagged: flagged,
            completed: completed,
            completedAt: completedAt.map { isoString(from: $0) },
            areaId: areaId,
            categoryId: categoryId,
            labels: labels,
            people: people,
            deferDate: deferDate.map { isoString(from: $0) },
            dueDate: dueDate.map { isoString(from: $0) },
            repeatType: repeatType,
            repeatInterval: repeatInterval,
            repeatFrom: repeatFrom,
            isNote: isNote,
            noteLifecycleState: noteLifecycleState,
            parentId: parentId,
            indent: indent,
            order: order,
            isProject: isProject,
            projectId: projectId,
            projectType: projectType,
            timeEstimate: timeEstimate,
            meetingEventKey: meetingEventKey,
            createdAt: isoString(from: createdAt),
            updatedAt: isoString(from: updatedAt)
        )
    }

    static func from(dto: TaskDTO) -> HBTask {
        let task = HBTask(title: dto.title, status: dto.status ?? "inbox", isNote: dto.isNote ?? false)
        task.id = dto.id
        task.notes = dto.notes ?? ""
        task.today = dto.today ?? false
        task.flagged = dto.flagged ?? false
        task.completed = dto.completed ?? false
        task.completedAt = dateFromISO(dto.completedAt)
        task.areaId = dto.areaId
        task.categoryId = dto.categoryId
        task.labels = dto.labels ?? []
        task.people = dto.people ?? []
        task.deferDate = dateFromISO(dto.deferDate)
        task.dueDate = dateFromISO(dto.dueDate)
        task.repeatType = dto.repeatType
        task.repeatInterval = dto.repeatInterval
        task.repeatFrom = dto.repeatFrom
        task.noteLifecycleState = dto.noteLifecycleState ?? ""
        task.parentId = dto.parentId
        task.indent = dto.indent ?? 0
        task.order = dto.order ?? 0
        task.isProject = dto.isProject ?? false
        task.projectId = dto.projectId
        task.projectType = dto.projectType
        task.timeEstimate = dto.timeEstimate
        task.meetingEventKey = dto.meetingEventKey
        task.createdAt = dateFromISO(dto.createdAt) ?? Date()
        task.updatedAt = dateFromISO(dto.updatedAt) ?? Date()
        return task
    }
}

// MARK: - HBArea ↔ EntityDTO

extension HBArea {
    func toDTO() -> EntityDTO {
        EntityDTO(
            id: id, name: name, color: color, emoji: emoji,
            order: order, createdAt: isoString(from: createdAt), updatedAt: isoString(from: updatedAt)
        )
    }

    static func from(dto: EntityDTO) -> HBArea {
        let area = HBArea(name: dto.name, color: dto.color ?? "#808080", emoji: dto.emoji, order: dto.order ?? 0)
        area.id = dto.id
        area.createdAt = dateFromISO(dto.createdAt) ?? Date()
        area.updatedAt = dateFromISO(dto.updatedAt) ?? Date()
        return area
    }
}

// MARK: - HBCategory ↔ EntityDTO

extension HBCategory {
    func toDTO() -> EntityDTO {
        EntityDTO(
            id: id, name: name, color: color, emoji: emoji,
            order: order, areaId: areaId, createdAt: isoString(from: createdAt), updatedAt: isoString(from: updatedAt)
        )
    }

    static func from(dto: EntityDTO) -> HBCategory {
        let cat = HBCategory(name: dto.name, areaId: dto.areaId ?? "", color: dto.color, emoji: dto.emoji, order: dto.order ?? 0)
        cat.id = dto.id
        cat.createdAt = dateFromISO(dto.createdAt) ?? Date()
        cat.updatedAt = dateFromISO(dto.updatedAt) ?? Date()
        return cat
    }
}

// MARK: - HBLabel ↔ EntityDTO

extension HBLabel {
    func toDTO() -> EntityDTO {
        EntityDTO(
            id: id, name: name, color: color, emoji: emoji,
            order: order, createdAt: isoString(from: createdAt), updatedAt: isoString(from: updatedAt)
        )
    }

    static func from(dto: EntityDTO) -> HBLabel {
        let label = HBLabel(name: dto.name, color: dto.color ?? "#808080", emoji: dto.emoji, order: dto.order ?? 0)
        label.id = dto.id
        label.createdAt = dateFromISO(dto.createdAt) ?? Date()
        label.updatedAt = dateFromISO(dto.updatedAt) ?? Date()
        return label
    }
}

// MARK: - HBPerson ↔ EntityDTO

extension HBPerson {
    func toDTO() -> EntityDTO {
        EntityDTO(
            id: id, name: name, order: order,
            email: email, jobTitle: jobTitle, photoUrl: photoUrl, photoData: photoData,
            createdAt: isoString(from: createdAt), updatedAt: isoString(from: updatedAt)
        )
    }

    static func from(dto: EntityDTO) -> HBPerson {
        let person = HBPerson(name: dto.name, email: dto.email ?? "", jobTitle: dto.jobTitle, order: dto.order ?? 0)
        person.id = dto.id
        person.photoUrl = dto.photoUrl
        person.photoData = dto.photoData
        person.createdAt = dateFromISO(dto.createdAt) ?? Date()
        person.updatedAt = dateFromISO(dto.updatedAt) ?? Date()
        return person
    }
}

// MARK: - HBPerspective ↔ EntityDTO

extension HBPerspective {
    func toDTO() -> EntityDTO {
        // Encode filter data as [String: AnyCodable] for the DTO
        let filterDict: [String: AnyCodable]?
        if let filterObj = try? JSONSerialization.jsonObject(with: filterData) as? [String: Any] {
            filterDict = filterObj.mapValues { AnyCodable($0) }
        } else {
            filterDict = nil
        }

        return EntityDTO(
            id: id, name: name, color: color, emoji: emoji,
            order: order, createdAt: isoString(from: createdAt), updatedAt: isoString(from: updatedAt),
            icon: icon, filter: filterDict
        )
    }

    static func from(dto: EntityDTO) -> HBPerspective {
        let filter = FilterDefinition(matchMode: .all, availability: .available)
        let persp = HBPerspective(name: dto.name, icon: dto.icon ?? "star", color: dto.color ?? "#007AFF", filter: filter, order: dto.order ?? 0)
        persp.id = dto.id
        persp.emoji = dto.emoji

        // Restore filter data from DTO if available
        if let filterDict = dto.filter {
            let rawDict = filterDict.mapValues(\.value)
            if let data = try? JSONSerialization.data(withJSONObject: rawDict) {
                persp.filterData = data
            }
        }

        persp.createdAt = dateFromISO(dto.createdAt) ?? Date()
        persp.updatedAt = dateFromISO(dto.updatedAt) ?? Date()
        return persp
    }
}
