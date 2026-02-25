import SwiftUI
import SwiftData

// MARK: - Area List

struct AreaListView: View {
    @Query(sort: \HBArea.order) private var areas: [HBArea]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false

    var body: some View {
        List {
            ForEach(areas, id: \.id) { area in
                NavigationLink {
                    EntityDetailView(entityType: .area(area.id))
                } label: {
                    HStack {
                        Circle().fill(Color(hex: area.color)).frame(width: 12, height: 12)
                        Text(area.name)
                        if let emoji = area.emoji {
                            Text(emoji)
                        }
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                for i in indexSet { context.delete(areas[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("Areas")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            AreaEditorView()
        }
    }
}

// MARK: - Label List

struct LabelListView: View {
    @Query(sort: \HBLabel.order) private var labels: [HBLabel]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false

    var body: some View {
        List {
            ForEach(labels, id: \.id) { label in
                NavigationLink {
                    EntityDetailView(entityType: .label(label.id))
                } label: {
                    HStack {
                        Circle().fill(Color(hex: label.color)).frame(width: 12, height: 12)
                        Text(label.name)
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                for i in indexSet { context.delete(labels[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("Labels")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            LabelEditorView()
        }
    }
}

// MARK: - Person List

struct PersonListView: View {
    @Query(sort: \HBPerson.order) private var people: [HBPerson]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false

    var body: some View {
        List {
            ForEach(people, id: \.id) { person in
                NavigationLink {
                    EntityDetailView(entityType: .person(person.id))
                } label: {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .foregroundStyle(HBTheme.textTertiary)
                        VStack(alignment: .leading) {
                            Text(person.name)
                            if !person.email.isEmpty {
                                Text(person.email)
                                    .font(HBTheme.subtitleFont)
                                    .foregroundStyle(HBTheme.textSecondary)
                            }
                        }
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                for i in indexSet { context.delete(people[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("People")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            PersonEditorView()
        }
    }
}

// MARK: - Category List

struct CategoryListView: View {
    @Query(sort: \HBCategory.order) private var categories: [HBCategory]
    @Environment(\.modelContext) private var context
    @Environment(SyncCoordinator.self) private var sync
    @State private var showEditor = false

    var body: some View {
        List {
            ForEach(categories, id: \.id) { category in
                NavigationLink {
                    EntityDetailView(entityType: .category(category.id))
                } label: {
                    HStack {
                        Text(category.name)
                        Spacer()
                    }
                }
            }
            .onDelete { indexSet in
                for i in indexSet { context.delete(categories[i]) }
                sync.engine.markDirty()
            }
        }
        .navigationTitle("Categories")
        .toolbar {
            Button { showEditor = true } label: { Image(systemName: "plus") }
        }
        .sheet(isPresented: $showEditor) {
            CategoryEditorView()
        }
    }
}
