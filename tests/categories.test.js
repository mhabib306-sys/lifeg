// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — hoisted above all imports so module-level side effects see fakes
// ---------------------------------------------------------------------------
const { mockState, saveTasksDataMock } = vi.hoisted(() => ({
  mockState: {
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    deletedEntityTombstones: {},
  },
  saveTasksDataMock: vi.fn(),
}));
vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/data/storage.js', () => ({ saveTasksData: saveTasksDataMock }));
vi.mock('../src/constants.js', () => ({
  DELETED_ENTITY_TOMBSTONES_KEY: 'test_entity_tombstones',
  CATEGORIES_KEY: 'test_categories',
}));

// getLocalDateString is used by getTasksByPerson — provide a stable mock
vi.mock('../src/utils.js', () => ({
  getLocalDateString: () => '2026-02-12',
  generateEntityId: vi.fn((prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
  sanitizeColor: vi.fn((c, fallback = '') => c || fallback),
  isMobileViewport: vi.fn(() => false),
  safeOpenUrl: vi.fn(),
  haptic: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module under test
// ---------------------------------------------------------------------------
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  createLabel,
  updateLabel,
  deleteLabel,
  getLabelById,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonById,
  getTasksByPerson,
} from '../src/features/areas.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function resetState() {
  mockState.tasksData = [];
  mockState.taskAreas = [];
  mockState.taskCategories = [];
  mockState.taskLabels = [];
  mockState.taskPeople = [];
  mockState.deletedEntityTombstones = {};
  saveTasksDataMock.mockClear();
  localStorage.clear();
}

// ===========================================================================
// CATEGORY CRUD (sub-areas — require an areaId)
// ===========================================================================
describe('Category CRUD', () => {
  beforeEach(resetState);

  // ---- createCategory ----
  describe('createCategory', () => {
    it('returns an object with the correct shape', () => {
      const cat = createCategory('Work', null);
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name', 'Work');
      expect(cat).toHaveProperty('color');
      expect(cat).toHaveProperty('createdAt');
      expect(cat).toHaveProperty('updatedAt');
    });

    it('generates an ID with the subcat_ prefix', () => {
      const cat = createCategory('Health', null);
      expect(cat.id).toMatch(/^subcat_/);
    });

    it('assigns createdAt and updatedAt as ISO strings', () => {
      const before = new Date().toISOString();
      const cat = createCategory('A', null);
      const after = new Date().toISOString();
      expect(cat.createdAt >= before).toBe(true);
      expect(cat.updatedAt <= after).toBe(true);
      expect(cat.createdAt).toBe(cat.updatedAt);
    });

    it('uses area color when areaId matches an area', () => {
      mockState.taskAreas = [{ id: 'area_1', color: '#FF0000' }];
      const cat = createCategory('Sub', 'area_1');
      expect(cat.color).toBe('#FF0000');
    });

    it('uses fallback color #6366F1 when areaId is null', () => {
      const cat = createCategory('NoArea', null);
      expect(cat.color).toBe('#6366F1');
    });

    it('pushes the new category into state.taskCategories', () => {
      expect(mockState.taskCategories).toHaveLength(0);
      const cat = createCategory('Test', null);
      expect(mockState.taskCategories).toHaveLength(1);
      expect(mockState.taskCategories[0]).toBe(cat);
    });

    it('calls saveTasksData after creation', () => {
      createCategory('X', null);
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('clears any existing tombstone for the new ID', () => {
      // Pre-populate a tombstone that could match
      mockState.deletedEntityTombstones = { categories: {} };
      createCategory('Revived', null);
      // tombstone section should exist but the new id should not be in it
      const cat = mockState.taskCategories[0];
      expect(mockState.deletedEntityTombstones.categories?.[cat.id]).toBeUndefined();
    });

    it('handles empty string name without throwing', () => {
      const cat = createCategory('', null);
      expect(cat.name).toBe('');
      expect(mockState.taskCategories).toHaveLength(1);
    });

    it('creates multiple categories with unique IDs', async () => {
      const cat1 = createCategory('A', null);
      // Small delay to ensure different Date.now()
      await new Promise(r => setTimeout(r, 2));
      const cat2 = createCategory('B', null);
      expect(cat1.id).not.toBe(cat2.id);
    });

    it('stores the areaId on the category', () => {
      const cat = createCategory('Sub', 'area_42');
      expect(cat.areaId).toBe('area_42');
    });
  });

  // ---- updateCategory ----
  describe('updateCategory', () => {
    it('applies updates to the matching category', () => {
      const cat = createCategory('Old Name', null);
      saveTasksDataMock.mockClear();
      updateCategory(cat.id, { name: 'New Name', color: '#FF0000' });
      const updated = mockState.taskCategories[0];
      expect(updated.name).toBe('New Name');
      expect(updated.color).toBe('#FF0000');
    });

    it('sets a new updatedAt timestamp', () => {
      const cat = createCategory('X', null);
      const originalUpdated = cat.updatedAt;
      // Ensure at least 1ms passes
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2099-01-01T00:00:00.000Z');
      updateCategory(cat.id, { name: 'Y' });
      expect(mockState.taskCategories[0].updatedAt).not.toBe(originalUpdated);
      vi.restoreAllMocks();
    });

    it('calls saveTasksData on successful update', () => {
      const cat = createCategory('X', null);
      saveTasksDataMock.mockClear();
      updateCategory(cat.id, { name: 'Y' });
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('does nothing for a non-existent ID', () => {
      createCategory('X', null);
      saveTasksDataMock.mockClear();
      updateCategory('subcat_nonexistent', { name: 'Z' });
      expect(saveTasksDataMock).not.toHaveBeenCalled();
      expect(mockState.taskCategories[0].name).toBe('X');
    });

    it('preserves fields not included in updates', () => {
      const cat = createCategory('Keep', null);
      const originalColor = cat.color;
      updateCategory(cat.id, { name: 'Kept' });
      const updated = mockState.taskCategories[0];
      expect(updated.color).toBe(originalColor);
    });
  });

  // ---- deleteCategory ----
  describe('deleteCategory', () => {
    it('removes the category from state.taskCategories', () => {
      const cat = createCategory('Doomed', null);
      expect(mockState.taskCategories).toHaveLength(1);
      deleteCategory(cat.id);
      expect(mockState.taskCategories).toHaveLength(0);
    });

    it('adds a tombstone for the deleted category', () => {
      const cat = createCategory('Gone', null);
      deleteCategory(cat.id);
      // areas.js uses 'categories' (not 'taskCategories') as the tombstone key
      expect(mockState.deletedEntityTombstones.categories[cat.id]).toBeDefined();
      // Tombstone should be an ISO date string
      expect(new Date(mockState.deletedEntityTombstones.categories[cat.id]).toISOString()).toBeTruthy();
    });

    it('nullifies categoryId on tasks that referenced it', () => {
      const cat = createCategory('Work', null);
      mockState.tasksData = [
        { id: 't1', categoryId: cat.id, title: 'Task 1' },
        { id: 't2', categoryId: 'subcat_other', title: 'Task 2' },
        { id: 't3', categoryId: cat.id, title: 'Task 3' },
      ];
      deleteCategory(cat.id);
      expect(mockState.tasksData[0].categoryId).toBeNull();
      expect(mockState.tasksData[1].categoryId).toBe('subcat_other');
      expect(mockState.tasksData[2].categoryId).toBeNull();
    });

    it('calls saveTasksData after deletion', () => {
      const cat = createCategory('X', null);
      saveTasksDataMock.mockClear();
      deleteCategory(cat.id);
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('persists tombstone to localStorage', () => {
      const cat = createCategory('Persisted', null);
      deleteCategory(cat.id);
      const stored = JSON.parse(localStorage.getItem('test_entity_tombstones') || '{}');
      // tombstone is stored under 'categories' key
      expect(stored.categories[cat.id]).toBeDefined();
    });

    it('handles deletion when tasksData is empty', () => {
      const cat = createCategory('Lonely', null);
      mockState.tasksData = [];
      expect(() => deleteCategory(cat.id)).not.toThrow();
      expect(mockState.taskCategories).toHaveLength(0);
    });

    it('does not crash when deleting a non-existent ID', () => {
      expect(() => deleteCategory('subcat_ghost')).not.toThrow();
      expect(saveTasksDataMock).toHaveBeenCalled();
    });
  });

  // ---- getCategoryById ----
  describe('getCategoryById', () => {
    it('returns the matching category', () => {
      const cat = createCategory('Found', null);
      expect(getCategoryById(cat.id)).toBe(mockState.taskCategories[0]);
    });

    it('returns undefined for a missing ID', () => {
      expect(getCategoryById('subcat_missing')).toBeUndefined();
    });

    it('returns undefined when taskCategories is empty', () => {
      expect(getCategoryById('subcat_anything')).toBeUndefined();
    });
  });
});

// ===========================================================================
// LABEL CRUD
// ===========================================================================
describe('Label CRUD', () => {
  beforeEach(resetState);

  // ---- createLabel ----
  describe('createLabel', () => {
    it('returns an object with the correct shape', () => {
      const label = createLabel('Urgent', '#FF0000');
      expect(label).toHaveProperty('id');
      expect(label).toHaveProperty('name', 'Urgent');
      expect(label).toHaveProperty('color', '#FF0000');
      expect(label).toHaveProperty('createdAt');
      expect(label).toHaveProperty('updatedAt');
    });

    it('generates an ID with the label_ prefix', () => {
      const label = createLabel('Tag');
      expect(label.id).toMatch(/^label_/);
    });

    it('defaults color to #6B7280 when not provided', () => {
      const label = createLabel('NoColor');
      expect(label.color).toBe('#6B7280');
    });

    it('uses the provided color when given', () => {
      const label = createLabel('Red', '#DC2626');
      expect(label.color).toBe('#DC2626');
    });

    it('pushes to state.taskLabels', () => {
      expect(mockState.taskLabels).toHaveLength(0);
      createLabel('A');
      expect(mockState.taskLabels).toHaveLength(1);
    });

    it('calls saveTasksData', () => {
      createLabel('B');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('clears tombstone for the new label ID', () => {
      mockState.deletedEntityTombstones = { taskLabels: {} };
      createLabel('Revived');
      const label = mockState.taskLabels[0];
      expect(mockState.deletedEntityTombstones.taskLabels?.[label.id]).toBeUndefined();
    });

    it('handles empty name string', () => {
      const label = createLabel('');
      expect(label.name).toBe('');
    });

    it('handles undefined color parameter (defaults)', () => {
      const label = createLabel('X', undefined);
      expect(label.color).toBe('#6B7280');
    });

    it('handles null color parameter (defaults)', () => {
      const label = createLabel('X', null);
      expect(label.color).toBe('#6B7280');
    });
  });

  // ---- updateLabel ----
  describe('updateLabel', () => {
    it('applies updates to the matching label', () => {
      const label = createLabel('Old', '#000');
      saveTasksDataMock.mockClear();
      updateLabel(label.id, { name: 'New', color: '#FFF' });
      expect(mockState.taskLabels[0].name).toBe('New');
      expect(mockState.taskLabels[0].color).toBe('#FFF');
    });

    it('sets updatedAt', () => {
      const label = createLabel('X');
      const original = label.updatedAt;
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2099-12-31T23:59:59.999Z');
      updateLabel(label.id, { name: 'Y' });
      expect(mockState.taskLabels[0].updatedAt).not.toBe(original);
      vi.restoreAllMocks();
    });

    it('calls saveTasksData', () => {
      const label = createLabel('X');
      saveTasksDataMock.mockClear();
      updateLabel(label.id, { name: 'Y' });
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('ignores non-existent ID', () => {
      createLabel('X');
      saveTasksDataMock.mockClear();
      updateLabel('label_ghost', { name: 'Z' });
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('preserves fields not in updates', () => {
      const label = createLabel('Keep', '#123456');
      updateLabel(label.id, { name: 'Kept' });
      expect(mockState.taskLabels[0].color).toBe('#123456');
    });
  });

  // ---- deleteLabel ----
  describe('deleteLabel', () => {
    it('removes the label from state.taskLabels', () => {
      const label = createLabel('Gone');
      deleteLabel(label.id);
      expect(mockState.taskLabels).toHaveLength(0);
    });

    it('adds a tombstone for the deleted label', () => {
      const label = createLabel('Tomb');
      deleteLabel(label.id);
      expect(mockState.deletedEntityTombstones.taskLabels[label.id]).toBeDefined();
    });

    it('removes the label ID from task.labels arrays', () => {
      const label = createLabel('Removable');
      mockState.tasksData = [
        { id: 't1', labels: [label.id, 'label_other'] },
        { id: 't2', labels: [label.id] },
        { id: 't3', labels: ['label_other'] },
        { id: 't4' }, // no labels property
      ];
      deleteLabel(label.id);
      expect(mockState.tasksData[0].labels).toEqual(['label_other']);
      expect(mockState.tasksData[1].labels).toEqual([]);
      expect(mockState.tasksData[2].labels).toEqual(['label_other']);
    });

    it('calls saveTasksData', () => {
      const label = createLabel('X');
      saveTasksDataMock.mockClear();
      deleteLabel(label.id);
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('persists tombstone to localStorage', () => {
      const label = createLabel('Persisted');
      deleteLabel(label.id);
      const stored = JSON.parse(localStorage.getItem('test_entity_tombstones') || '{}');
      expect(stored.taskLabels[label.id]).toBeDefined();
    });

    it('does not crash when tasks have no labels property', () => {
      const label = createLabel('Safe');
      mockState.tasksData = [{ id: 't1' }, { id: 't2', labels: null }];
      expect(() => deleteLabel(label.id)).not.toThrow();
    });
  });

  // ---- getLabelById ----
  describe('getLabelById', () => {
    it('returns the matching label', () => {
      const label = createLabel('Found');
      expect(getLabelById(label.id)).toBe(mockState.taskLabels[0]);
    });

    it('returns undefined for missing ID', () => {
      expect(getLabelById('label_nope')).toBeUndefined();
    });

    it('returns undefined when taskLabels is empty', () => {
      expect(getLabelById('label_any')).toBeUndefined();
    });
  });
});

// ===========================================================================
// PERSON CRUD
// ===========================================================================
describe('Person CRUD', () => {
  beforeEach(resetState);

  // ---- createPerson ----
  describe('createPerson', () => {
    it('returns an object with the correct shape', () => {
      const person = createPerson('Alice');
      expect(person).toHaveProperty('id');
      expect(person).toHaveProperty('name', 'Alice');
      expect(person).toHaveProperty('createdAt');
      expect(person).toHaveProperty('updatedAt');
    });

    it('generates an ID with the person_ prefix', () => {
      const person = createPerson('Bob');
      expect(person.id).toMatch(/^person_/);
    });

    it('pushes to state.taskPeople', () => {
      createPerson('Charlie');
      expect(mockState.taskPeople).toHaveLength(1);
    });

    it('calls saveTasksData', () => {
      createPerson('Dana');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('clears tombstone for the new person ID', () => {
      mockState.deletedEntityTombstones = { taskPeople: {} };
      createPerson('Revived');
      const person = mockState.taskPeople[0];
      expect(mockState.deletedEntityTombstones.taskPeople?.[person.id]).toBeUndefined();
    });

    it('handles empty name', () => {
      const person = createPerson('');
      expect(person.name).toBe('');
      expect(mockState.taskPeople).toHaveLength(1);
    });

    it('sets createdAt equal to updatedAt', () => {
      const person = createPerson('Eve');
      expect(person.createdAt).toBe(person.updatedAt);
    });
  });

  // ---- updatePerson ----
  describe('updatePerson', () => {
    it('applies updates to the matching person', () => {
      const person = createPerson('Old');
      saveTasksDataMock.mockClear();
      updatePerson(person.id, { name: 'New' });
      expect(mockState.taskPeople[0].name).toBe('New');
    });

    it('sets updatedAt to a new timestamp', () => {
      const person = createPerson('X');
      const original = person.updatedAt;
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2099-06-15T12:00:00.000Z');
      updatePerson(person.id, { name: 'Y' });
      expect(mockState.taskPeople[0].updatedAt).not.toBe(original);
      vi.restoreAllMocks();
    });

    it('calls saveTasksData', () => {
      const person = createPerson('X');
      saveTasksDataMock.mockClear();
      updatePerson(person.id, { name: 'Y' });
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('ignores non-existent ID', () => {
      createPerson('X');
      saveTasksDataMock.mockClear();
      updatePerson('person_ghost', { name: 'Z' });
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('preserves fields not in updates', () => {
      const person = createPerson('Keep');
      const originalCreatedAt = person.createdAt;
      updatePerson(person.id, { name: 'Kept' });
      expect(mockState.taskPeople[0].createdAt).toBe(originalCreatedAt);
    });

    it('can add new fields to the person object', () => {
      const person = createPerson('Extended');
      updatePerson(person.id, { email: 'test@example.com' });
      expect(mockState.taskPeople[0].email).toBe('test@example.com');
    });
  });

  // ---- deletePerson ----
  describe('deletePerson', () => {
    it('removes the person from state.taskPeople', () => {
      const person = createPerson('Gone');
      deletePerson(person.id);
      expect(mockState.taskPeople).toHaveLength(0);
    });

    it('adds a tombstone for the deleted person', () => {
      const person = createPerson('Tombstoned');
      deletePerson(person.id);
      expect(mockState.deletedEntityTombstones.taskPeople[person.id]).toBeDefined();
    });

    it('removes the person ID from task.people arrays', () => {
      const person = createPerson('Removable');
      mockState.tasksData = [
        { id: 't1', people: [person.id, 'person_other'] },
        { id: 't2', people: [person.id] },
        { id: 't3', people: ['person_other'] },
        { id: 't4' }, // no people property
      ];
      deletePerson(person.id);
      expect(mockState.tasksData[0].people).toEqual(['person_other']);
      expect(mockState.tasksData[1].people).toEqual([]);
      expect(mockState.tasksData[2].people).toEqual(['person_other']);
    });

    it('calls saveTasksData', () => {
      const person = createPerson('X');
      saveTasksDataMock.mockClear();
      deletePerson(person.id);
      expect(saveTasksDataMock).toHaveBeenCalledTimes(1);
    });

    it('persists tombstone to localStorage', () => {
      const person = createPerson('Persisted');
      deletePerson(person.id);
      const stored = JSON.parse(localStorage.getItem('test_entity_tombstones') || '{}');
      expect(stored.taskPeople[person.id]).toBeDefined();
    });

    it('does not crash when tasks have no people property', () => {
      const person = createPerson('Safe');
      mockState.tasksData = [{ id: 't1' }, { id: 't2', people: null }];
      expect(() => deletePerson(person.id)).not.toThrow();
    });
  });

  // ---- getPersonById ----
  describe('getPersonById', () => {
    it('returns the matching person', () => {
      const person = createPerson('Found');
      expect(getPersonById(person.id)).toBe(mockState.taskPeople[0]);
    });

    it('returns undefined for missing ID', () => {
      expect(getPersonById('person_nope')).toBeUndefined();
    });

    it('returns undefined when taskPeople is empty', () => {
      expect(getPersonById('person_any')).toBeUndefined();
    });
  });
});

// ===========================================================================
// getTasksByPerson
// ===========================================================================
describe('getTasksByPerson', () => {
  beforeEach(resetState);

  it('returns tasks assigned to the given person', () => {
    mockState.tasksData = [
      { id: 't1', people: ['person_1'], completed: false },
      { id: 't2', people: ['person_2'], completed: false },
      { id: 't3', people: ['person_1', 'person_2'], completed: false },
    ];
    const result = getTasksByPerson('person_1');
    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).toEqual(['t1', 't3']);
  });

  it('excludes completed tasks', () => {
    mockState.tasksData = [
      { id: 't1', people: ['person_1'], completed: true },
      { id: 't2', people: ['person_1'], completed: false },
    ];
    const result = getTasksByPerson('person_1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t2');
  });

  it('returns empty array when person has no tasks', () => {
    mockState.tasksData = [
      { id: 't1', people: ['person_2'], completed: false },
    ];
    expect(getTasksByPerson('person_1')).toEqual([]);
  });

  it('returns empty array when tasksData is empty', () => {
    mockState.tasksData = [];
    expect(getTasksByPerson('person_1')).toEqual([]);
  });

  it('returns empty array when task has no people property', () => {
    mockState.tasksData = [
      { id: 't1', completed: false },
      { id: 't2', people: null, completed: false },
    ];
    expect(getTasksByPerson('person_1')).toEqual([]);
  });

  it('handles tasks with empty people array', () => {
    mockState.tasksData = [
      { id: 't1', people: [], completed: false },
    ];
    expect(getTasksByPerson('person_1')).toEqual([]);
  });

  it('handles multiple people on a single task', () => {
    mockState.tasksData = [
      { id: 't1', people: ['person_1', 'person_2', 'person_3'], completed: false },
    ];
    expect(getTasksByPerson('person_1')).toHaveLength(1);
    expect(getTasksByPerson('person_2')).toHaveLength(1);
    expect(getTasksByPerson('person_3')).toHaveLength(1);
    expect(getTasksByPerson('person_4')).toHaveLength(0);
  });
});

// ===========================================================================
// Tombstone / localStorage integration
// ===========================================================================
describe('Tombstone mechanics', () => {
  beforeEach(resetState);

  it('initializes deletedEntityTombstones when it is null', () => {
    mockState.deletedEntityTombstones = null;
    const cat = createCategory('Init', null);
    deleteCategory(cat.id);
    expect(mockState.deletedEntityTombstones).toBeDefined();
    expect(typeof mockState.deletedEntityTombstones).toBe('object');
  });

  it('initializes deletedEntityTombstones when it is non-object', () => {
    mockState.deletedEntityTombstones = 'garbage';
    const cat = createCategory('Init', null);
    deleteCategory(cat.id);
    expect(typeof mockState.deletedEntityTombstones).toBe('object');
  });

  it('tombstone values are valid ISO date strings', () => {
    const cat = createCategory('ISO', null);
    deleteCategory(cat.id);
    // categories.js uses 'categories' tombstone key for subcategories
    const ts = mockState.deletedEntityTombstones.categories[cat.id];
    expect(() => new Date(ts)).not.toThrow();
    expect(new Date(ts).toISOString()).toBe(ts);
  });

  it('localStorage tombstone matches in-memory tombstone', () => {
    const label = createLabel('Sync');
    deleteLabel(label.id);
    const stored = JSON.parse(localStorage.getItem('test_entity_tombstones'));
    expect(stored.taskLabels[label.id]).toBe(
      mockState.deletedEntityTombstones.taskLabels[label.id]
    );
  });

  it('multiple tombstones coexist across entity types', () => {
    const cat = createCategory('Cat', null);
    const label = createLabel('Label');
    const person = createPerson('Person');
    deleteCategory(cat.id);
    deleteLabel(label.id);
    deletePerson(person.id);
    // categories use 'categories' key, labels use 'taskLabels', people use 'taskPeople'
    expect(mockState.deletedEntityTombstones.categories[cat.id]).toBeDefined();
    expect(mockState.deletedEntityTombstones.taskLabels[label.id]).toBeDefined();
    expect(mockState.deletedEntityTombstones.taskPeople[person.id]).toBeDefined();
  });
});

// ===========================================================================
// Cross-entity cascade
// ===========================================================================
describe('Cross-entity cascade on delete', () => {
  beforeEach(resetState);

  it('deleteCategory does not affect labels or people on tasks', () => {
    const cat = createCategory('CascadeTest', null);
    mockState.tasksData = [
      { id: 't1', categoryId: cat.id, labels: ['label_1'], people: ['person_1'] },
    ];
    deleteCategory(cat.id);
    expect(mockState.tasksData[0].categoryId).toBeNull();
    expect(mockState.tasksData[0].labels).toEqual(['label_1']);
    expect(mockState.tasksData[0].people).toEqual(['person_1']);
  });

  it('deleteLabel does not affect categoryId or people on tasks', () => {
    const label = createLabel('CascadeLabel');
    mockState.tasksData = [
      { id: 't1', categoryId: 'subcat_1', labels: [label.id], people: ['person_1'] },
    ];
    deleteLabel(label.id);
    expect(mockState.tasksData[0].categoryId).toBe('subcat_1');
    expect(mockState.tasksData[0].labels).toEqual([]);
    expect(mockState.tasksData[0].people).toEqual(['person_1']);
  });

  it('deletePerson does not affect categoryId or labels on tasks', () => {
    const person = createPerson('CascadePerson');
    mockState.tasksData = [
      { id: 't1', categoryId: 'subcat_1', labels: ['label_1'], people: [person.id] },
    ];
    deletePerson(person.id);
    expect(mockState.tasksData[0].categoryId).toBe('subcat_1');
    expect(mockState.tasksData[0].labels).toEqual(['label_1']);
    expect(mockState.tasksData[0].people).toEqual([]);
  });
});

// ===========================================================================
// Edge cases
// ===========================================================================
describe('Edge cases', () => {
  beforeEach(resetState);

  it('creating many entities sequentially all have unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 20; i++) {
      const cat = createCategory(`Cat${i}`, null);
      ids.add(cat.id);
    }
    expect(mockState.taskCategories).toHaveLength(20);
  });

  it('update with empty updates object still bumps updatedAt', () => {
    const cat = createCategory('Bumped', null);
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2099-01-01T00:00:00.000Z');
    updateCategory(cat.id, {});
    expect(mockState.taskCategories[0].updatedAt).toBe('2099-01-01T00:00:00.000Z');
    vi.restoreAllMocks();
  });

  it('delete followed by create reuses the slot in the array', () => {
    const cat1 = createCategory('First', null);
    deleteCategory(cat1.id);
    expect(mockState.taskCategories).toHaveLength(0);
    const cat2 = createCategory('Second', null);
    expect(mockState.taskCategories).toHaveLength(1);
    expect(mockState.taskCategories[0].name).toBe('Second');
  });

  it('getTasksByPerson with completed=false explicitly set', () => {
    mockState.tasksData = [
      { id: 't1', people: ['person_1'], completed: false },
    ];
    expect(getTasksByPerson('person_1')).toHaveLength(1);
  });

  it('saveTasksData call count matches expected operations', () => {
    saveTasksDataMock.mockClear();
    createCategory('A', null);  // 1
    createLabel('B');            // 2
    createPerson('C');           // 3
    updateCategory(mockState.taskCategories[0].id, { name: 'A2' }); // 4
    deleteLabel(mockState.taskLabels[0].id);   // 5
    expect(saveTasksDataMock).toHaveBeenCalledTimes(5);
  });
});
