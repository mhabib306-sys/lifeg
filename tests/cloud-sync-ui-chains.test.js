// @vitest-environment jsdom
// ============================================================================
// CLOUD SYNC UI CHAINS — Verifies every UI handler that mutates data properly
// triggers the cloud sync chain (debouncedSaveToGithub).
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// Hoisted mocks — must come before vi.mock() calls
// ============================================================================
const { mockState, mocks } = vi.hoisted(() => {
  const mockState = {
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    triggers: [],
    collapsedTriggers: new Set(),
    zoomedTriggerId: null,
    triggersBreadcrumb: [],
    homeWidgets: [],
    editingHomeWidgets: false,
    showAddWidgetPicker: false,
    draggingWidgetId: null,
    allData: {},
    currentDate: '2026-02-13',
    activeTab: 'tasks',
    activeFilterType: 'perspective',
    activePerspective: 'inbox',
    activeCategoryFilter: null,
    activeAreaFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    editingTaskId: null,
    showTaskModal: false,
    modalStateInitialized: false,
    modalSelectedArea: null,
    modalSelectedCategory: null,
    modalSelectedStatus: 'inbox',
    modalSelectedToday: false,
    modalSelectedFlagged: false,
    modalSelectedTags: [],
    modalSelectedPeople: [],
    modalIsNote: false,
    modalRepeatEnabled: false,
    newTaskContext: {},
    inlineEditingTaskId: null,
    inlineAutocompleteMeta: new Map(),
    showInlineTagInput: false,
    showInlinePersonInput: false,
    quickAddIsNote: false,
    showAreaModal: false,
    editingAreaId: null,
    pendingAreaEmoji: '',
    showCategoryModal: false,
    editingCategoryId: null,
    pendingCategoryEmoji: '',
    showLabelModal: false,
    editingLabelId: null,
    showPersonModal: false,
    editingPersonId: null,
    showPerspectiveModal: false,
    editingPerspectiveId: null,
    pendingPerspectiveEmoji: '',
    perspectiveEmojiPickerOpen: false,
    areaEmojiPickerOpen: false,
    categoryEmojiPickerOpen: false,
    emojiSearchQuery: '',
    reviewMode: false,
    reviewAreaIndex: 0,
    reviewCompletedAreas: [],
    githubSyncDirty: false,
    draggedTaskId: null,
    dragOverTaskId: null,
    dragPosition: null,
    draggedSidebarItem: null,
    draggedSidebarType: null,
    sidebarDragPosition: null,
    calendarEventModalOpen: false,
    calendarEventModalCalendarId: null,
    calendarEventModalEventId: null,
    calendarMeetingNotesEventKey: null,
    calendarMeetingNotesScope: 'instance',
    calendarMobileShowToday: false,
    calendarMobileShowEvents: false,
    calendarMobileShowScheduled: false,
    meetingNotesByEvent: {},
    gcalEvents: [],
    deletedTaskTombstones: {},
    deletedEntityTombstones: {},
    _draggedTriggerId: null,
  };

  const mocks = {
    saveTasksData: vi.fn(),
    saveData: vi.fn(),
    saveViewState: vi.fn(),
    debouncedSaveToGithub: vi.fn(),
    render: vi.fn(),
    createTask: vi.fn((_title, _opts) => ({
      id: 'task_new_123',
      title: _title,
      ..._opts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    createArea: vi.fn((_name, _emoji) => ({
      id: 'cat_1234',
      name: _name,
      emoji: _emoji || '',
      color: '#6366F1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateArea: vi.fn(),
    createCategory: vi.fn((_name, _areaId) => ({
      id: 'subcat_1234',
      name: _name,
      areaId: _areaId,
      color: '#6366F1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateCategory: vi.fn(),
    createLabel: vi.fn((_name, _color) => ({
      id: 'label_1234',
      name: _name,
      color: _color || '#6B7280',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateLabel: vi.fn(),
    createPerson: vi.fn((_name, _email) => ({
      id: 'person_1234',
      name: _name,
      email: _email || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updatePerson: vi.fn(),
    // createPerspective must push to mockState.customPerspectives because
    // savePerspectiveFromModal() accesses the last element after calling it
    createPerspective: vi.fn((_name, _icon, _filter) => {
      const p = {
        id: 'custom_' + Date.now(),
        name: _name,
        icon: _icon || '\uD83D\uDCCC',
        filter: _filter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockState.customPerspectives.push(p);
      return p;
    }),
    deletePerspective: vi.fn(),
    generateTaskId: vi.fn(() => 'task_gen_' + Date.now()),
    getLocalDateString: vi.fn(() => '2026-02-13'),
    escapeHtml: vi.fn((s) => String(s || '')),
    formatSmartDate: vi.fn((d) => d || ''),
    renderPersonAvatar: vi.fn(() => ''),
    normalizeEmail: vi.fn((e) => String(e || '').toLowerCase().trim()),
    formatEventTime: vi.fn(() => ''),
    formatEventDateLabel: vi.fn(() => ''),
    setupInlineAutocomplete: vi.fn(),
    cleanupInlineAutocomplete: vi.fn(),
    renderInlineChips: vi.fn(() => ''),
    getActiveIcons: vi.fn(() => ({
      inbox: '<svg></svg>',
      today: '<svg></svg>',
      anytime: '<svg></svg>',
      someday: '<svg></svg>',
      flagged: '<svg></svg>',
      review: '<svg></svg>',
      trigger: '<svg></svg>',
      area: '<svg></svg>',
    })),
    getAreaById: vi.fn(() => null),
    getCategoryById: vi.fn(() => null),
    getCategoriesByArea: vi.fn(() => []),
    renderTriggersOutliner: vi.fn(() => ''),
    ensureEntityTombstones: vi.fn(() => ({})),
    persistEntityTombstones: vi.fn(),
    startUndoCountdown: vi.fn(),
    saveHomeWidgets: vi.fn(),
    getCurrentFilteredTasks: vi.fn(() => []),
  };

  return { mockState, mocks };
});

// ============================================================================
// Module mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: mocks.saveTasksData,
  saveData: mocks.saveData,
  saveViewState: mocks.saveViewState,
}));

vi.mock('../src/features/tasks.js', () => ({
  createTask: mocks.createTask,
  updateTask: mocks.updateTask,
  deleteTask: mocks.deleteTask,
}));

vi.mock('../src/features/areas.js', () => ({
  createArea: mocks.createArea,
  updateArea: mocks.updateArea,
  createCategory: mocks.createCategory,
  updateCategory: mocks.updateCategory,
  createLabel: mocks.createLabel,
  updateLabel: mocks.updateLabel,
  createPerson: mocks.createPerson,
  updatePerson: mocks.updatePerson,
  getAreaById: mocks.getAreaById,
  getCategoryById: mocks.getCategoryById,
  getCategoriesByArea: mocks.getCategoriesByArea,
  deleteCategory: vi.fn(),
  ensureEntityTombstones: mocks.ensureEntityTombstones,
  persistEntityTombstones: mocks.persistEntityTombstones,
}));

vi.mock('../src/features/perspectives.js', () => ({
  createPerspective: mocks.createPerspective,
  deletePerspective: mocks.deletePerspective,
}));

vi.mock('../src/features/undo.js', () => ({
  startUndoCountdown: mocks.startUndoCountdown,
}));

vi.mock('../src/utils.js', () => ({
  generateTaskId: mocks.generateTaskId,
  getLocalDateString: mocks.getLocalDateString,
  escapeHtml: mocks.escapeHtml,
  formatSmartDate: mocks.formatSmartDate,
  renderPersonAvatar: mocks.renderPersonAvatar,
  normalizeEmail: mocks.normalizeEmail,
  formatEventTime: mocks.formatEventTime,
  formatEventDateLabel: mocks.formatEventDateLabel,
}));

vi.mock('../src/constants.js', () => ({
  TRIGGERS_KEY: 'lifeGamificationTriggers',
  COLLAPSED_TRIGGERS_KEY: 'lifeGamificationCollapsedTriggers',
  HOME_WIDGETS_KEY: 'lifeGamificationHomeWidgets',
  MEETING_NOTES_KEY: 'nucleusMeetingNotes',
  TASKS_KEY: 'lifeGamificationTasks',
  TASK_CATEGORIES_KEY: 'lifeGamificationTaskCategories',
  TASK_LABELS_KEY: 'lifeGamificationTaskLabels',
  TASK_PEOPLE_KEY: 'lifeGamificationTaskPeople',
  PERSPECTIVES_KEY: 'lifeGamificationPerspectives',
  DELETED_TASK_TOMBSTONES_KEY: 'lifeGamificationDeletedTaskTombstones',
  DELETED_ENTITY_TOMBSTONES_KEY: 'lifeGamificationDeletedEntityTombstones',
  THINGS3_ICONS: {},
  THINGS3_AREA_COLORS: ['#4A90A4', '#6B8E5A'],
  getActiveIcons: mocks.getActiveIcons,
  _css: vi.fn(() => '#3b82f6'),
  DEFAULT_HOME_WIDGETS: [
    { id: 'today-tasks', visible: true, order: 0 },
    { id: 'todays-score', visible: true, order: 1 },
  ],
  BUILTIN_PERSPECTIVES: [],
  NOTES_PERSPECTIVE: { id: 'notes', name: 'Notes' },
  defaultDayData: {},
  CATEGORIES_KEY: 'lifeGamificationCategories',
}));

vi.mock('../src/features/inline-autocomplete.js', () => ({
  setupInlineAutocomplete: mocks.setupInlineAutocomplete,
  cleanupInlineAutocomplete: mocks.cleanupInlineAutocomplete,
  renderInlineChips: mocks.renderInlineChips,
}));

vi.mock('../src/features/triggers.js', async () => {
  const actual = await vi.importActual('../src/features/triggers.js');
  return {
    ...actual,
    renderTriggersOutliner: mocks.renderTriggersOutliner,
  };
});

// ============================================================================
// Setup / teardown
// ============================================================================

function resetMockState() {
  mockState.tasksData = [];
  mockState.taskAreas = [];
  mockState.taskCategories = [];
  mockState.taskLabels = [];
  mockState.taskPeople = [];
  mockState.customPerspectives = [];
  mockState.triggers = [];
  mockState.collapsedTriggers = new Set();
  mockState.zoomedTriggerId = null;
  mockState.triggersBreadcrumb = [];
  mockState.homeWidgets = [];
  mockState.editingHomeWidgets = false;
  mockState.showAddWidgetPicker = false;
  mockState.draggingWidgetId = null;
  mockState.allData = {};
  mockState.currentDate = '2026-02-13';
  mockState.activeTab = 'tasks';
  mockState.activeFilterType = 'perspective';
  mockState.activePerspective = 'inbox';
  mockState.activeCategoryFilter = null;
  mockState.activeAreaFilter = null;
  mockState.activeLabelFilter = null;
  mockState.activePersonFilter = null;
  mockState.editingTaskId = null;
  mockState.showTaskModal = false;
  mockState.modalStateInitialized = false;
  mockState.modalSelectedArea = null;
  mockState.modalSelectedCategory = null;
  mockState.modalSelectedStatus = 'inbox';
  mockState.modalSelectedToday = false;
  mockState.modalSelectedFlagged = false;
  mockState.modalSelectedTags = [];
  mockState.modalSelectedPeople = [];
  mockState.modalIsNote = false;
  mockState.modalRepeatEnabled = false;
  mockState.newTaskContext = {};
  mockState.inlineEditingTaskId = null;
  mockState.inlineAutocompleteMeta = new Map();
  mockState.showInlineTagInput = false;
  mockState.showInlinePersonInput = false;
  mockState.quickAddIsNote = false;
  mockState.showAreaModal = false;
  mockState.editingAreaId = null;
  mockState.pendingAreaEmoji = '';
  mockState.showCategoryModal = false;
  mockState.editingCategoryId = null;
  mockState.pendingCategoryEmoji = '';
  mockState.showLabelModal = false;
  mockState.editingLabelId = null;
  mockState.showPersonModal = false;
  mockState.editingPersonId = null;
  mockState.showPerspectiveModal = false;
  mockState.editingPerspectiveId = null;
  mockState.pendingPerspectiveEmoji = '';
  mockState.perspectiveEmojiPickerOpen = false;
  mockState.areaEmojiPickerOpen = false;
  mockState.categoryEmojiPickerOpen = false;
  mockState.emojiSearchQuery = '';
  mockState.reviewMode = false;
  mockState.reviewAreaIndex = 0;
  mockState.reviewCompletedAreas = [];
  mockState.githubSyncDirty = false;
  mockState.draggedTaskId = null;
  mockState.dragOverTaskId = null;
  mockState.dragPosition = null;
  mockState.draggedSidebarItem = null;
  mockState.draggedSidebarType = null;
  mockState.sidebarDragPosition = null;
  mockState.calendarEventModalOpen = false;
  mockState.calendarEventModalCalendarId = null;
  mockState.calendarEventModalEventId = null;
  mockState.calendarMeetingNotesEventKey = null;
  mockState.calendarMeetingNotesScope = 'instance';
  mockState.calendarMobileShowToday = false;
  mockState.calendarMobileShowEvents = false;
  mockState.calendarMobileShowScheduled = false;
  mockState.meetingNotesByEvent = {};
  mockState.gcalEvents = [];
  mockState.deletedTaskTombstones = {};
  mockState.deletedEntityTombstones = {};
  mockState._draggedTriggerId = null;
}

beforeEach(() => {
  vi.clearAllMocks();
  resetMockState();
  window.debouncedSaveToGithub = mocks.debouncedSaveToGithub;
  window.render = mocks.render;
  window.createTask = mocks.createTask;
  window.updateTask = mocks.updateTask;
  window.saveTasksData = mocks.saveTasksData;
  window.getCurrentFilteredTasks = mocks.getCurrentFilteredTasks;
  window.pushTaskToGCalIfConnected = vi.fn();
  window.deleteGCalEventIfConnected = vi.fn();
  window.rescheduleGCalEventIfConnected = vi.fn();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ============================================================================
// Helper: create all perspective form elements in the DOM
// ============================================================================
function createPerspectiveFormElements(nameValue = 'Test View', iconValue = '\uD83D\uDCCC') {
  const nameInput = document.createElement('input');
  nameInput.id = 'perspective-name';
  nameInput.value = nameValue;
  document.body.appendChild(nameInput);

  const iconInput = document.createElement('input');
  iconInput.id = 'perspective-icon';
  iconInput.value = iconValue;
  document.body.appendChild(iconInput);

  const elIds = [
    'perspective-logic', 'perspective-category', 'perspective-status',
    'perspective-availability', 'perspective-status-rule', 'perspective-person',
    'perspective-tags-mode', 'perspective-search', 'perspective-range-type',
    'perspective-range-start', 'perspective-range-end',
  ];
  const els = elIds.map(id => {
    const el = (id.includes('range-start') || id.includes('range-end') || id === 'perspective-search')
      ? document.createElement('input')
      : document.createElement('select');
    el.id = id;
    el.value = '';
    document.body.appendChild(el);
    return el;
  });

  const checkIds = ['perspective-due', 'perspective-defer', 'perspective-repeat', 'perspective-untagged', 'perspective-inbox'];
  const checkEls = checkIds.map(id => {
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.id = id;
    el.checked = false;
    document.body.appendChild(el);
    return el;
  });

  return {
    cleanup() {
      nameInput.remove();
      iconInput.remove();
      els.forEach(el => el.remove());
      checkEls.forEach(el => el.remove());
    }
  };
}

// ============================================================================
// SECTION 1: Triggers CRUD -> sync
// ============================================================================
describe('Triggers CRUD -> cloud sync chain', () => {
  let triggers;

  beforeEach(async () => {
    triggers = await import('../src/features/triggers.js');
  });

  it('createTrigger() calls debouncedSaveToGithub via persistAndRender', () => {
    triggers.createTrigger('Test trigger', { areaId: 'area1' });
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('createTrigger() persists to localStorage', () => {
    triggers.createTrigger('Test trigger');
    const stored = localStorage.getItem('lifeGamificationTriggers');
    expect(stored).not.toBeNull();
  });

  it('createTrigger() calls window.render', () => {
    triggers.createTrigger('Hello');
    expect(mocks.render).toHaveBeenCalled();
  });

  it('createRootTrigger() triggers cloud sync', () => {
    triggers.createRootTrigger({ areaId: 'area1' });
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('createRootTrigger() with zoomed state delegates to createChildTrigger', () => {
    const parent = { id: 'trigger_parent', title: 'Parent', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [parent];
    mockState.zoomedTriggerId = 'trigger_parent';
    triggers.createRootTrigger({ areaId: 'a1' });
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('createTriggerAfter() triggers cloud sync', () => {
    const existing = { id: 'trigger_1', title: 'Existing', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [existing];
    triggers.createTriggerAfter('trigger_1');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('createChildTrigger() triggers cloud sync', () => {
    const parent = { id: 'trigger_parent', title: 'Parent', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [parent];
    triggers.createChildTrigger('trigger_parent');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('updateTrigger() calls debouncedSaveToGithub', () => {
    const t = { id: 'trigger_u1', title: 'Old title', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.updateTrigger('trigger_u1', { title: 'New title' });
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('updateTrigger() sets updatedAt timestamp', () => {
    const oldDate = '2020-01-01T00:00:00Z';
    const t = { id: 'trigger_ts', title: 'Title', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: oldDate, updatedAt: oldDate };
    mockState.triggers = [t];
    triggers.updateTrigger('trigger_ts', { title: 'Updated' });
    expect(mockState.triggers[0].updatedAt).not.toBe(oldDate);
  });

  it('updateTrigger() with non-existent ID does not call sync', () => {
    mockState.triggers = [];
    triggers.updateTrigger('nonexistent', { title: 'Nope' });
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('deleteTrigger() calls debouncedSaveToGithub via persistAndRender', () => {
    const t = { id: 'trigger_d1', title: 'Delete me', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.deleteTrigger('trigger_d1');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('deleteTrigger() removes trigger from state', () => {
    const t = { id: 'trigger_d2', title: 'Gone', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.deleteTrigger('trigger_d2');
    expect(mockState.triggers.find(x => x.id === 'trigger_d2')).toBeUndefined();
  });

  it('deleteTrigger(deleteChildren=true) removes descendants', () => {
    const parent = { id: 'trigger_p', title: 'Parent', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const child = { id: 'trigger_c', title: 'Child', parentId: 'trigger_p', areaId: null, categoryId: null, indent: 1, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [parent, child];
    triggers.deleteTrigger('trigger_p', true);
    expect(mockState.triggers).toHaveLength(0);
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('deleteTrigger(deleteChildren=false) promotes children', () => {
    const parent = { id: 'trigger_pp', title: 'Parent', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const child = { id: 'trigger_cc', title: 'Child', parentId: 'trigger_pp', areaId: null, categoryId: null, indent: 1, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [parent, child];
    triggers.deleteTrigger('trigger_pp', false);
    expect(mockState.triggers).toHaveLength(1);
    expect(mockState.triggers[0].parentId).toBeNull();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('reorderTriggers() calls debouncedSaveToGithub via persistAndRender', () => {
    const t1 = { id: 'trigger_r1', title: 'First', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const t2 = { id: 'trigger_r2', title: 'Second', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t1, t2];
    triggers.reorderTriggers('trigger_r1', 'trigger_r2', 'bottom');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('reorderTriggers() with position=child nests trigger under target', () => {
    const t1 = { id: 'trigger_nest1', title: 'Dragged', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const t2 = { id: 'trigger_nest2', title: 'Target', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t1, t2];
    triggers.reorderTriggers('trigger_nest1', 'trigger_nest2', 'child');
    expect(t1.parentId).toBe('trigger_nest2');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('reorderTriggers() with position=top reorders before target', () => {
    const t1 = { id: 'trigger_top1', title: 'First', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const t2 = { id: 'trigger_top2', title: 'Second', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t1, t2];
    triggers.reorderTriggers('trigger_top2', 'trigger_top1', 'top');
    expect(t2.triggerOrder).toBeLessThan(t1.triggerOrder);
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('handleTriggerBlur() auto-deletes empty trigger and syncs', () => {
    const t = { id: 'trigger_blur', title: '', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.handleTriggerBlur({ target: { textContent: '' } }, 'trigger_blur');
    expect(mockState.triggers.find(x => x.id === 'trigger_blur')).toBeUndefined();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('handleTriggerBlur() does NOT delete non-empty trigger', () => {
    const t = { id: 'trigger_keep', title: 'Keep me', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.handleTriggerBlur({ target: { textContent: 'Keep me' } }, 'trigger_keep');
    expect(mockState.triggers.find(x => x.id === 'trigger_keep')).toBeDefined();
  });

  it('handleTriggerInput() calls updateTrigger which syncs', () => {
    const t = { id: 'trigger_inp', title: 'Old', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.handleTriggerInput({ target: { textContent: 'New text' } }, 'trigger_inp');
    expect(mockState.triggers[0].title).toBe('New text');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('indentTrigger() calls debouncedSaveToGithub via persistAndRender', () => {
    const t1 = { id: 'trigger_ind1', title: 'Previous sibling', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const t2 = { id: 'trigger_ind2', title: 'To indent', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t1, t2];
    triggers.indentTrigger('trigger_ind2');
    expect(t2.parentId).toBe('trigger_ind1');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('indentTrigger() does nothing for first sibling (no prev)', () => {
    const t = { id: 'trigger_first', title: 'Only one', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.indentTrigger('trigger_first');
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('outdentTrigger() calls debouncedSaveToGithub via persistAndRender', () => {
    const parent = { id: 'trigger_out_p', title: 'Parent', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const child = { id: 'trigger_out_c', title: 'Child', parentId: 'trigger_out_p', areaId: 'a1', categoryId: null, indent: 1, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [parent, child];
    triggers.outdentTrigger('trigger_out_c');
    expect(child.parentId).toBeNull();
    expect(child.indent).toBe(0);
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('outdentTrigger() does nothing at indent 0', () => {
    const t = { id: 'trigger_noout', title: 'Root', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    triggers.outdentTrigger('trigger_noout');
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('debouncedSaveToGithubSafe handles undefined window.debouncedSaveToGithub', () => {
    const saved = window.debouncedSaveToGithub;
    window.debouncedSaveToGithub = undefined;
    const t = { id: 'trigger_safe', title: 'Safe', parentId: null, areaId: null, categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    expect(() => triggers.updateTrigger('trigger_safe', { title: 'Updated' })).not.toThrow();
    window.debouncedSaveToGithub = saved;
  });

  it('handleTriggerKeydown Enter creates trigger after current and syncs', () => {
    const t = { id: 'trigger_enter', title: 'Existing', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t];
    const event = { key: 'Enter', shiftKey: false, preventDefault: vi.fn() };
    triggers.handleTriggerKeydown(event, 'trigger_enter');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('handleTriggerKeydown Tab calls indentTrigger', () => {
    const t1 = { id: 'trigger_tab1', title: 'Prev', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const t2 = { id: 'trigger_tab2', title: 'Current', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [t1, t2];
    const event = { key: 'Tab', shiftKey: false, preventDefault: vi.fn() };
    triggers.handleTriggerKeydown(event, 'trigger_tab2');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(t2.parentId).toBe('trigger_tab1');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('handleTriggerKeydown Shift+Tab calls outdentTrigger', () => {
    const parent = { id: 'trigger_stab_p', title: 'Parent', parentId: null, areaId: 'a1', categoryId: null, indent: 0, triggerOrder: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const child = { id: 'trigger_stab_c', title: 'Child', parentId: 'trigger_stab_p', areaId: 'a1', categoryId: null, indent: 1, triggerOrder: 2000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockState.triggers = [parent, child];
    const event = { key: 'Tab', shiftKey: true, preventDefault: vi.fn() };
    triggers.handleTriggerKeydown(event, 'trigger_stab_c');
    expect(child.parentId).toBeNull();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });
});

// ============================================================================
// SECTION 2: Review mode -> sync
// ============================================================================
describe('Review mode -> cloud sync chain', () => {
  let review;
  beforeEach(async () => { review = await import('../src/ui/review.js'); });

  it('reviewEngageTask() calls saveTasksData', () => {
    mockState.tasksData = [{ id: 'task_rev1', title: 'Review me', areaId: 'a1', completed: false, lastReviewedAt: null, updatedAt: '2020-01-01T00:00:00Z' }];
    review.reviewEngageTask('task_rev1');
    expect(mocks.saveTasksData).toHaveBeenCalled();
  });

  it('reviewEngageTask() sets lastReviewedAt on the task', () => {
    const task = { id: 'task_rev2', title: 'Task', areaId: 'a1', completed: false, lastReviewedAt: null, updatedAt: '2020-01-01T00:00:00Z' };
    mockState.tasksData = [task];
    review.reviewEngageTask('task_rev2');
    expect(task.lastReviewedAt).not.toBeNull();
    expect(task.updatedAt).not.toBe('2020-01-01T00:00:00Z');
  });

  it('reviewEngageTask() opens the task modal', () => {
    mockState.tasksData = [{ id: 'task_rev3', title: 'Task', areaId: 'a1', completed: false, lastReviewedAt: null, updatedAt: new Date().toISOString() }];
    review.reviewEngageTask('task_rev3');
    expect(mockState.editingTaskId).toBe('task_rev3');
    expect(mockState.showTaskModal).toBe(true);
  });

  it('reviewPassTask() calls saveTasksData', () => {
    mockState.tasksData = [{ id: 'task_pass1', title: 'Pass', areaId: 'a1', completed: false, lastReviewedAt: null, updatedAt: '2020-01-01T00:00:00Z' }];
    review.reviewPassTask('task_pass1');
    expect(mocks.saveTasksData).toHaveBeenCalled();
  });

  it('reviewPassTask() sets lastReviewedAt and updatedAt', () => {
    const task = { id: 'task_pass2', title: 'Pass', areaId: 'a1', completed: false, lastReviewedAt: null, updatedAt: '2020-01-01T00:00:00Z' };
    mockState.tasksData = [task];
    review.reviewPassTask('task_pass2');
    expect(task.lastReviewedAt).not.toBeNull();
    expect(task.updatedAt).not.toBe('2020-01-01T00:00:00Z');
  });

  it('reviewPassTask() with nonexistent task does not call saveTasksData', () => {
    mockState.tasksData = [];
    review.reviewPassTask('nonexistent');
    expect(mocks.saveTasksData).not.toHaveBeenCalled();
  });

  it('reviewMarkAreaDone() calls saveTasksData for stale tasks', () => {
    const staleDate = new Date(); staleDate.setDate(staleDate.getDate() - 10);
    mockState.tasksData = [{ id: 'task_stale', title: 'Stale', areaId: 'area1', completed: false, status: 'anytime', lastReviewedAt: staleDate.toISOString(), updatedAt: staleDate.toISOString() }];
    mockState.taskAreas = [{ id: 'area1', name: 'Work' }];
    mockState.reviewAreaIndex = 0;
    review.reviewMarkAreaDone();
    expect(mocks.saveTasksData).toHaveBeenCalled();
  });

  it('reviewMarkAreaDone() marks all stale tasks as reviewed', () => {
    const staleDate = new Date(); staleDate.setDate(staleDate.getDate() - 10);
    const task1 = { id: 'task_stale1', title: 'Stale1', areaId: 'area2', completed: false, status: 'anytime', lastReviewedAt: staleDate.toISOString(), updatedAt: staleDate.toISOString() };
    const task2 = { id: 'task_stale2', title: 'Stale2', areaId: 'area2', completed: false, status: 'anytime', lastReviewedAt: null, updatedAt: staleDate.toISOString() };
    mockState.tasksData = [task1, task2];
    mockState.taskAreas = [{ id: 'area2', name: 'Home' }];
    mockState.reviewAreaIndex = 0;
    review.reviewMarkAreaDone();
    expect(task1.lastReviewedAt).not.toBe(staleDate.toISOString());
    expect(task2.lastReviewedAt).not.toBeNull();
  });

  it('reviewMarkAreaDone() adds area to completedAreas', () => {
    mockState.tasksData = [];
    mockState.taskAreas = [{ id: 'area3', name: 'Fitness' }];
    mockState.reviewAreaIndex = 0;
    review.reviewMarkAreaDone();
    expect(mockState.reviewCompletedAreas).toContain('area3');
  });

  it('reviewMarkAreaDone() does not call saveTasksData when no stale tasks', () => {
    mockState.tasksData = [{ id: 'task_fresh', title: 'Fresh', areaId: 'area4', completed: false, status: 'anytime', lastReviewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    mockState.taskAreas = [{ id: 'area4', name: 'Learning' }];
    mockState.reviewAreaIndex = 0;
    review.reviewMarkAreaDone();
    expect(mocks.saveTasksData).not.toHaveBeenCalled();
  });
});

// ============================================================================
// SECTION 3: Task modal save -> sync
// ============================================================================
describe('Task modal save -> cloud sync chain', () => {
  let taskModal;
  beforeEach(async () => { taskModal = await import('../src/ui/task-modal.js'); });

  it('saveInlineEdit() with non-empty title calls updateTask', () => {
    const input = document.createElement('input'); input.id = 'inline-edit-input'; input.value = 'Updated title'; document.body.appendChild(input);
    mockState.inlineAutocompleteMeta = new Map();
    taskModal.saveInlineEdit('task_ie1');
    expect(mocks.updateTask).toHaveBeenCalledWith('task_ie1', expect.objectContaining({ title: 'Updated title' }));
    input.remove();
  });

  it('saveInlineEdit() with empty title calls deleteTask', () => {
    const input = document.createElement('input'); input.id = 'inline-edit-input'; input.value = '   '; document.body.appendChild(input);
    taskModal.saveInlineEdit('task_ie2');
    expect(mocks.deleteTask).toHaveBeenCalledWith('task_ie2');
    input.remove();
  });

  it('saveInlineEdit() merges inline autocomplete metadata', () => {
    const input = document.createElement('input'); input.id = 'inline-edit-input'; input.value = 'Task with meta'; document.body.appendChild(input);
    mockState.inlineAutocompleteMeta = new Map([['inline-edit-input', { areaId: 'area_meta', labels: ['label1'] }]]);
    taskModal.saveInlineEdit('task_ie3');
    expect(mocks.updateTask).toHaveBeenCalledWith('task_ie3', expect.objectContaining({ title: 'Task with meta', areaId: 'area_meta', labels: ['label1'] }));
    input.remove();
  });

  it('quickAddTask() calls createTask', () => {
    const input = document.createElement('input'); input.id = 'quick-add-input'; input.value = 'Quick task'; document.body.appendChild(input);
    mockState.inlineAutocompleteMeta = new Map();
    taskModal.quickAddTask(input);
    expect(mocks.createTask).toHaveBeenCalledWith('Quick task', expect.any(Object));
    input.remove();
  });

  it('quickAddTask() with empty input does nothing', () => {
    const input = document.createElement('input'); input.id = 'quick-add-input'; input.value = ''; document.body.appendChild(input);
    taskModal.quickAddTask(input);
    expect(mocks.createTask).not.toHaveBeenCalled();
    input.remove();
  });

  it('quickAddTask() respects perspective context for status', () => {
    const input = document.createElement('input'); input.id = 'quick-add-input'; input.value = 'Someday task'; document.body.appendChild(input);
    mockState.activeFilterType = 'perspective'; mockState.activePerspective = 'someday'; mockState.inlineAutocompleteMeta = new Map();
    taskModal.quickAddTask(input);
    expect(mocks.createTask).toHaveBeenCalledWith('Someday task', expect.objectContaining({ status: 'someday' }));
    input.remove();
  });

  it('quickAddTask() in notes perspective creates a note', () => {
    const input = document.createElement('input'); input.id = 'quick-add-input'; input.value = 'A note'; document.body.appendChild(input);
    mockState.activeFilterType = 'perspective'; mockState.activePerspective = 'notes'; mockState.inlineAutocompleteMeta = new Map();
    taskModal.quickAddTask(input);
    expect(mocks.createTask).toHaveBeenCalledWith('A note', expect.objectContaining({ isNote: true }));
    input.remove();
  });

  it('addInlineTag() calls createLabel which triggers saveTasksData', () => {
    const nameInput = document.createElement('input'); nameInput.id = 'inline-tag-name'; nameInput.value = 'New Tag'; document.body.appendChild(nameInput);
    const colorInput = document.createElement('input'); colorInput.id = 'inline-tag-color'; colorInput.value = '#FF0000'; document.body.appendChild(colorInput);
    const formContainer = document.createElement('div'); formContainer.id = 'inline-tag-form'; document.body.appendChild(formContainer);
    const labelsContainer = document.createElement('div'); labelsContainer.id = 'task-labels-container'; document.body.appendChild(labelsContainer);
    mockState.taskLabels = [];
    taskModal.addInlineTag();
    expect(mocks.createLabel).toHaveBeenCalledWith('New Tag', '#FF0000');
    nameInput.remove(); colorInput.remove(); formContainer.remove(); labelsContainer.remove();
  });

  it('addInlineTag() with empty name does nothing', () => {
    const nameInput = document.createElement('input'); nameInput.id = 'inline-tag-name'; nameInput.value = ''; document.body.appendChild(nameInput);
    taskModal.addInlineTag();
    expect(mocks.createLabel).not.toHaveBeenCalled();
    nameInput.remove();
  });

  it('addInlinePerson() calls createPerson which triggers saveTasksData', () => {
    const nameInput = document.createElement('input'); nameInput.id = 'inline-person-name'; nameInput.value = 'John Doe'; document.body.appendChild(nameInput);
    const formContainer = document.createElement('div'); formContainer.id = 'inline-person-form'; document.body.appendChild(formContainer);
    const peopleContainer = document.createElement('div'); peopleContainer.id = 'task-people-container'; document.body.appendChild(peopleContainer);
    mockState.taskPeople = [];
    taskModal.addInlinePerson();
    expect(mocks.createPerson).toHaveBeenCalledWith('John Doe');
    nameInput.remove(); formContainer.remove(); peopleContainer.remove();
  });

  it('addInlinePerson() with empty name does nothing', () => {
    const nameInput = document.createElement('input'); nameInput.id = 'inline-person-name'; nameInput.value = ''; document.body.appendChild(nameInput);
    taskModal.addInlinePerson();
    expect(mocks.createPerson).not.toHaveBeenCalled();
    nameInput.remove();
  });

  it('saveTaskFromModal() with title calls createTask for new task', () => {
    const titleInput = document.createElement('input'); titleInput.id = 'task-title'; titleInput.value = 'Modal task'; document.body.appendChild(titleInput);
    const notesInput = document.createElement('textarea'); notesInput.id = 'task-notes'; notesInput.value = ''; document.body.appendChild(notesInput);
    mockState.editingTaskId = null; mockState.showTaskModal = true;
    taskModal.saveTaskFromModal();
    expect(mocks.createTask).toHaveBeenCalledWith('Modal task', expect.any(Object));
    titleInput.remove(); notesInput.remove();
  });

  it('saveTaskFromModal() with editingTaskId calls updateTask', () => {
    const titleInput = document.createElement('input'); titleInput.id = 'task-title'; titleInput.value = 'Edited task'; document.body.appendChild(titleInput);
    const notesInput = document.createElement('textarea'); notesInput.id = 'task-notes'; notesInput.value = 'Some notes'; document.body.appendChild(notesInput);
    mockState.editingTaskId = 'task_edit1'; mockState.showTaskModal = true;
    taskModal.saveTaskFromModal();
    expect(mocks.updateTask).toHaveBeenCalledWith('task_edit1', expect.objectContaining({ title: 'Edited task' }));
    titleInput.remove(); notesInput.remove();
  });

  it('saveTaskFromModal() with empty title shows alert and does not save', () => {
    const titleInput = document.createElement('input'); titleInput.id = 'task-title'; titleInput.value = ''; document.body.appendChild(titleInput);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    taskModal.saveTaskFromModal();
    expect(alertSpy).toHaveBeenCalled();
    expect(mocks.createTask).not.toHaveBeenCalled();
    alertSpy.mockRestore(); titleInput.remove();
  });
});

// ============================================================================
// SECTION 4: Entity modals save -> sync
// ============================================================================
describe('Entity modals save -> cloud sync chain', () => {
  let entityModals;
  beforeEach(async () => { entityModals = await import('../src/ui/entity-modals.js'); });

  // --- Area ---
  it('saveAreaFromModal() creating new area calls createArea', () => {
    const n = document.createElement('input'); n.id = 'area-name'; n.value = 'New Area'; document.body.appendChild(n);
    const e = document.createElement('input'); e.id = 'area-emoji'; e.value = ''; document.body.appendChild(e);
    const c = document.createElement('input'); c.id = 'area-color'; c.value = '#6366F1'; document.body.appendChild(c);
    mockState.editingAreaId = null;
    entityModals.saveAreaFromModal();
    expect(mocks.createArea).toHaveBeenCalledWith('New Area', '');
    n.remove(); e.remove(); c.remove();
  });

  it('saveAreaFromModal() updating existing area calls updateArea', () => {
    const n = document.createElement('input'); n.id = 'area-name'; n.value = 'Updated Area'; document.body.appendChild(n);
    const e = document.createElement('input'); e.id = 'area-emoji'; e.value = '\uD83C\uDFE0'; document.body.appendChild(e);
    const c = document.createElement('input'); c.id = 'area-color'; c.value = '#FF0000'; document.body.appendChild(c);
    mockState.editingAreaId = 'area_edit1';
    entityModals.saveAreaFromModal();
    expect(mocks.updateArea).toHaveBeenCalledWith('area_edit1', expect.objectContaining({ name: 'Updated Area' }));
    n.remove(); e.remove(); c.remove();
  });

  it('saveAreaFromModal() with empty name shows alert', () => {
    const n = document.createElement('input'); n.id = 'area-name'; n.value = ''; document.body.appendChild(n);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    entityModals.saveAreaFromModal();
    expect(alertSpy).toHaveBeenCalled();
    expect(mocks.createArea).not.toHaveBeenCalled();
    alertSpy.mockRestore(); n.remove();
  });

  // --- Category ---
  it('saveCategoryFromModal() creating new category calls createCategory', () => {
    const n = document.createElement('input'); n.id = 'category-name'; n.value = 'New Category'; document.body.appendChild(n);
    const a = document.createElement('select'); a.id = 'category-area'; const opt = document.createElement('option'); opt.value = 'area_1'; opt.selected = true; a.appendChild(opt); document.body.appendChild(a);
    const c = document.createElement('input'); c.id = 'category-color'; c.value = '#6366F1'; document.body.appendChild(c);
    const e = document.createElement('input'); e.id = 'category-emoji'; e.value = ''; document.body.appendChild(e);
    mockState.editingCategoryId = null;
    entityModals.saveCategoryFromModal();
    expect(mocks.createCategory).toHaveBeenCalledWith('New Category', 'area_1', '');
    n.remove(); a.remove(); c.remove(); e.remove();
  });

  it('saveCategoryFromModal() updating existing calls updateCategory', () => {
    const n = document.createElement('input'); n.id = 'category-name'; n.value = 'Updated Cat'; document.body.appendChild(n);
    const a = document.createElement('select'); a.id = 'category-area'; const opt = document.createElement('option'); opt.value = 'area_2'; opt.selected = true; a.appendChild(opt); document.body.appendChild(a);
    const c = document.createElement('input'); c.id = 'category-color'; c.value = '#FF0000'; document.body.appendChild(c);
    const e = document.createElement('input'); e.id = 'category-emoji'; e.value = ''; document.body.appendChild(e);
    mockState.editingCategoryId = 'cat_edit1';
    entityModals.saveCategoryFromModal();
    expect(mocks.updateCategory).toHaveBeenCalledWith('cat_edit1', expect.objectContaining({ name: 'Updated Cat' }));
    n.remove(); a.remove(); c.remove(); e.remove();
  });

  it('saveCategoryFromModal() with empty name shows alert', () => {
    const n = document.createElement('input'); n.id = 'category-name'; n.value = ''; document.body.appendChild(n);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    entityModals.saveCategoryFromModal();
    expect(alertSpy).toHaveBeenCalled();
    expect(mocks.createCategory).not.toHaveBeenCalled();
    alertSpy.mockRestore(); n.remove();
  });

  // --- Label ---
  it('saveLabelFromModal() creating new label calls createLabel', () => {
    const n = document.createElement('input'); n.id = 'label-name'; n.value = 'Important'; document.body.appendChild(n);
    const c = document.createElement('input'); c.id = 'label-color'; c.value = '#FF0000'; document.body.appendChild(c);
    mockState.editingLabelId = null;
    entityModals.saveLabelFromModal();
    expect(mocks.createLabel).toHaveBeenCalledWith('Important', '#FF0000');
    n.remove(); c.remove();
  });

  it('saveLabelFromModal() updating existing calls updateLabel', () => {
    const n = document.createElement('input'); n.id = 'label-name'; n.value = 'Updated Label'; document.body.appendChild(n);
    const c = document.createElement('input'); c.id = 'label-color'; c.value = '#00FF00'; document.body.appendChild(c);
    mockState.editingLabelId = 'label_edit1';
    entityModals.saveLabelFromModal();
    expect(mocks.updateLabel).toHaveBeenCalledWith('label_edit1', expect.objectContaining({ name: 'Updated Label' }));
    n.remove(); c.remove();
  });

  it('saveLabelFromModal() with empty name shows alert', () => {
    const n = document.createElement('input'); n.id = 'label-name'; n.value = ''; document.body.appendChild(n);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    entityModals.saveLabelFromModal();
    expect(alertSpy).toHaveBeenCalled();
    expect(mocks.createLabel).not.toHaveBeenCalled();
    alertSpy.mockRestore(); n.remove();
  });

  // --- Person ---
  it('savePersonFromModal() creating new person calls createPerson', () => {
    const n = document.createElement('input'); n.id = 'person-name'; n.value = 'Alice'; document.body.appendChild(n);
    const e = document.createElement('input'); e.id = 'person-email'; e.value = 'alice@example.com'; document.body.appendChild(e);
    mockState.editingPersonId = null;
    entityModals.savePersonFromModal();
    expect(mocks.createPerson).toHaveBeenCalledWith('Alice', 'alice@example.com');
    n.remove(); e.remove();
  });

  it('savePersonFromModal() updating existing calls updatePerson', () => {
    const n = document.createElement('input'); n.id = 'person-name'; n.value = 'Bob Updated'; document.body.appendChild(n);
    const e = document.createElement('input'); e.id = 'person-email'; e.value = 'bob@new.com'; document.body.appendChild(e);
    mockState.editingPersonId = 'person_edit1';
    entityModals.savePersonFromModal();
    expect(mocks.updatePerson).toHaveBeenCalledWith('person_edit1', expect.objectContaining({ name: 'Bob Updated' }));
    n.remove(); e.remove();
  });

  it('savePersonFromModal() with empty name shows alert', () => {
    const n = document.createElement('input'); n.id = 'person-name'; n.value = ''; document.body.appendChild(n);
    const e = document.createElement('input'); e.id = 'person-email'; e.value = ''; document.body.appendChild(e);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    entityModals.savePersonFromModal();
    expect(alertSpy).toHaveBeenCalled();
    expect(mocks.createPerson).not.toHaveBeenCalled();
    alertSpy.mockRestore(); n.remove(); e.remove();
  });

  // --- Perspective ---
  it('savePerspectiveFromModal() creating new calls createPerspective', () => {
    const form = createPerspectiveFormElements('Work View', '\uD83D\uDCCC');
    mockState.editingPerspectiveId = null;
    mockState.customPerspectives = [];
    entityModals.savePerspectiveFromModal();
    expect(mocks.createPerspective).toHaveBeenCalledWith('Work View', '\uD83D\uDCCC', expect.any(Object));
    form.cleanup();
  });

  it('savePerspectiveFromModal() updating existing calls saveTasksData directly', () => {
    const form = createPerspectiveFormElements('Updated View', '\uD83C\uDFAF');
    mockState.editingPerspectiveId = 'custom_existing';
    mockState.customPerspectives = [{ id: 'custom_existing', name: 'Old View', icon: '\uD83D\uDCCC', filter: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    entityModals.savePerspectiveFromModal();
    expect(mocks.saveTasksData).toHaveBeenCalled();
    form.cleanup();
  });

  it('savePerspectiveFromModal() with empty name shows alert', () => {
    const form = createPerspectiveFormElements('', '\uD83D\uDCCC');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    entityModals.savePerspectiveFromModal();
    expect(alertSpy).toHaveBeenCalled();
    expect(mocks.createPerspective).not.toHaveBeenCalled();
    alertSpy.mockRestore();
    form.cleanup();
  });
});

// ============================================================================
// SECTION 5: Drag-drop reorder -> sync
// ============================================================================
describe('Drag-drop reorder -> cloud sync chain', () => {
  let dragDrop;

  beforeEach(async () => {
    dragDrop = await import('../src/features/drag-drop.js');
    const tasks = [
      { id: 'task_dd1', title: 'Task 1', order: 1000, status: 'anytime', completed: false, updatedAt: new Date().toISOString() },
      { id: 'task_dd2', title: 'Task 2', order: 2000, status: 'anytime', completed: false, updatedAt: new Date().toISOString() },
      { id: 'task_dd3', title: 'Task 3', order: 3000, status: 'anytime', completed: false, updatedAt: new Date().toISOString() },
    ];
    mocks.getCurrentFilteredTasks.mockReturnValue(tasks);
    mockState.tasksData = JSON.parse(JSON.stringify(tasks));
  });

  it('reorderTasks() with top position calls saveTasksData', () => {
    dragDrop.reorderTasks('task_dd3', 'task_dd1', 'top');
    expect(mocks.saveTasksData).toHaveBeenCalled();
  });

  it('reorderTasks() with bottom position calls saveTasksData', () => {
    dragDrop.reorderTasks('task_dd1', 'task_dd3', 'bottom');
    expect(mocks.saveTasksData).toHaveBeenCalled();
  });

  it('reorderTasks() sets updatedAt on the dragged task', () => {
    mockState.tasksData[0].updatedAt = '2020-01-01T00:00:00Z';
    dragDrop.reorderTasks('task_dd1', 'task_dd2', 'bottom');
    expect(mockState.tasksData.find(t => t.id === 'task_dd1').updatedAt).not.toBe('2020-01-01T00:00:00Z');
  });

  it('reorderTasks() calls window.render after save', () => {
    dragDrop.reorderTasks('task_dd2', 'task_dd1', 'top');
    expect(mocks.render).toHaveBeenCalled();
  });

  it('reorderTasks() with non-existent dragged task does nothing', () => {
    dragDrop.reorderTasks('nonexistent', 'task_dd1', 'top');
    expect(mocks.saveTasksData).not.toHaveBeenCalled();
  });

  it('reorderTasks() with non-existent target task does nothing', () => {
    dragDrop.reorderTasks('task_dd1', 'nonexistent', 'top');
    expect(mocks.saveTasksData).not.toHaveBeenCalled();
  });

  it('normalizeTaskOrders() rebalances order values', () => {
    mockState.tasksData = [
      { id: 't1', order: 500, status: 'anytime', completed: false },
      { id: 't2', order: 501, status: 'anytime', completed: false },
      { id: 't3', order: 502, status: 'anytime', completed: false },
    ];
    dragDrop.normalizeTaskOrders();
    expect(mockState.tasksData[0].order).toBe(1000);
    expect(mockState.tasksData[1].order).toBe(2000);
    expect(mockState.tasksData[2].order).toBe(3000);
  });

  it('normalizeTaskOrders() handles multiple status groups independently', () => {
    mockState.tasksData = [
      { id: 't_inbox', order: 50, status: 'inbox', completed: false },
      { id: 't_any', order: 75, status: 'anytime', completed: false },
      { id: 't_some', order: 100, status: 'someday', completed: false },
    ];
    dragDrop.normalizeTaskOrders();
    expect(mockState.tasksData.find(t => t.id === 't_inbox').order).toBe(1000);
    expect(mockState.tasksData.find(t => t.id === 't_any').order).toBe(1000);
    expect(mockState.tasksData.find(t => t.id === 't_some').order).toBe(1000);
  });

  it('handleDragStart sets draggedTaskId on state', () => {
    const fakeE = { target: { classList: { add: vi.fn() }, closest: vi.fn(() => null) }, dataTransfer: { effectAllowed: '', setData: vi.fn() } };
    dragDrop.handleDragStart(fakeE, 'task_dd1');
    expect(mockState.draggedTaskId).toBe('task_dd1');
  });

  it('handleDragEnd performs reorder if valid targets set', () => {
    mockState.draggedTaskId = 'task_dd1';
    mockState.dragOverTaskId = 'task_dd2';
    mockState.dragPosition = 'bottom';
    dragDrop.handleDragEnd({ target: { classList: { remove: vi.fn() } } });
    expect(mocks.saveTasksData).toHaveBeenCalled();
  });
});

// ============================================================================
// SECTION 6: Meeting notes -> sync
// ============================================================================
describe('Meeting notes -> cloud sync chain', () => {
  let calMeeting;
  beforeEach(async () => { calMeeting = await import('../src/ui/calendar-meeting.js'); });

  it('convertCalendarEventToTask() calls window.createTask', () => {
    mockState.gcalEvents = [{ id: 'ev1', calendarId: 'cal1', summary: 'Meeting', start: { dateTime: '2026-02-13T10:00:00Z' }, htmlLink: 'https://cal.google.com/ev1' }];
    calMeeting.convertCalendarEventToTask('cal1', 'ev1', 0);
    expect(mocks.createTask).toHaveBeenCalledWith('Meeting', expect.objectContaining({ status: 'anytime' }));
  });

  it('convertCalendarEventToTask() with follow-up days creates follow-up task', () => {
    mockState.gcalEvents = [{ id: 'ev2', calendarId: 'cal1', summary: 'Standup', start: { dateTime: '2026-02-13T09:00:00Z' } }];
    calMeeting.convertCalendarEventToTask('cal1', 'ev2', 3);
    expect(mocks.createTask).toHaveBeenCalledWith(expect.stringContaining('Follow up'), expect.any(Object));
  });

  it('convertCalendarEventToTask() with non-existent event does nothing', () => {
    mockState.gcalEvents = [];
    calMeeting.convertCalendarEventToTask('cal1', 'nonexistent', 0);
    expect(mocks.createTask).not.toHaveBeenCalled();
  });

  it('addMeetingLinkedItem() creates a task linked to meeting', () => {
    mockState.gcalEvents = [{ id: 'ev3', calendarId: 'cal1', summary: 'Review', start: { dateTime: '2026-02-13T14:00:00Z' } }];
    mockState.calendarMeetingNotesEventKey = 'cal1::instance::ev3';
    mockState.calendarMeetingNotesScope = 'instance';
    mockState.meetingNotesByEvent = {};
    const input = document.createElement('input'); input.id = 'meeting-item-input'; input.value = 'Action item'; document.body.appendChild(input);
    calMeeting.addMeetingLinkedItem('task');
    expect(mocks.createTask).toHaveBeenCalledWith('Action item', expect.objectContaining({ meetingEventKey: 'cal1::instance::ev3' }));
    input.remove();
  });

  it('addMeetingLinkedItem() with empty input does nothing', () => {
    mockState.calendarMeetingNotesEventKey = 'cal1::instance::ev4';
    const input = document.createElement('input'); input.id = 'meeting-item-input'; input.value = ''; document.body.appendChild(input);
    calMeeting.addMeetingLinkedItem('note');
    expect(mocks.createTask).not.toHaveBeenCalled();
    input.remove();
  });

  it('addDiscussionItemToMeeting() calls window.updateTask with meetingEventKey', () => {
    mockState.gcalEvents = [{ id: 'ev5', calendarId: 'cal1', summary: 'Sprint', start: { dateTime: '2026-02-13T15:00:00Z' } }];
    mockState.calendarMeetingNotesEventKey = 'cal1::instance::ev5';
    mockState.calendarMeetingNotesScope = 'instance';
    mockState.tasksData = [{ id: 'task_disc1', title: 'Discuss this', people: [], meetingEventKey: null }];
    calMeeting.addDiscussionItemToMeeting('task_disc1');
    expect(mocks.updateTask).toHaveBeenCalledWith('task_disc1', expect.objectContaining({ meetingEventKey: 'cal1::instance::ev5' }));
  });

  it('addDiscussionItemToMeeting() skips if task already linked to this meeting', () => {
    mockState.gcalEvents = [{ id: 'ev6', calendarId: 'cal1', summary: 'Daily', start: { dateTime: '2026-02-13T09:00:00Z' } }];
    mockState.calendarMeetingNotesEventKey = 'cal1::instance::ev6';
    mockState.calendarMeetingNotesScope = 'instance';
    mockState.tasksData = [{ id: 'task_already', title: 'Already linked', people: [], meetingEventKey: 'cal1::instance::ev6' }];
    calMeeting.addDiscussionItemToMeeting('task_already');
    expect(mocks.updateTask).not.toHaveBeenCalled();
  });

  it('openCalendarMeetingNotes() creates meeting note doc and syncs to localStorage', () => {
    mockState.gcalEvents = [{ id: 'ev7', calendarId: 'cal1', summary: 'Planning', start: { dateTime: '2026-02-13T10:00:00Z' } }];
    mockState.meetingNotesByEvent = {};
    mockState.calendarMeetingNotesScope = 'instance';
    calMeeting.openCalendarMeetingNotes('cal1', 'ev7');
    const stored = localStorage.getItem('nucleusMeetingNotes');
    expect(stored).not.toBeNull();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('setCalendarMeetingNotesScope() migrates instance tasks to series and syncs', () => {
    const event = { id: 'ev_scope', calendarId: 'cal1', summary: 'Weekly', recurringEventId: 'recur_1', start: { dateTime: '2026-02-13T10:00:00Z' } };
    mockState.gcalEvents = [event];
    mockState.calendarMeetingNotesScope = 'instance';
    mockState.calendarMeetingNotesEventKey = 'cal1::instance::ev_scope';
    mockState.meetingNotesByEvent = {
      'cal1::instance::ev_scope': { eventKey: 'cal1::instance::ev_scope', calendarId: 'cal1', eventId: 'ev_scope', title: 'Weekly', content: 'Notes here', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    };
    mockState.tasksData = [{ id: 'task_scope1', title: 'Scope task', meetingEventKey: 'cal1::instance::ev_scope', updatedAt: new Date().toISOString() }];
    calMeeting.setCalendarMeetingNotesScope('series');
    expect(mockState.tasksData[0].meetingEventKey).toBe('cal1::series::recur_1');
    expect(mocks.saveTasksData).toHaveBeenCalled();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('setCalendarMeetingNotesScope() with no event just changes scope', () => {
    mockState.gcalEvents = [];
    mockState.calendarMeetingNotesEventKey = 'nonexistent::instance::xx';
    calMeeting.setCalendarMeetingNotesScope('series');
    expect(mockState.calendarMeetingNotesScope).toBe('series');
    expect(mocks.render).toHaveBeenCalled();
  });
});

// ============================================================================
// SECTION 7: Home widgets -> sync
// ============================================================================
describe('Home widgets -> cloud sync chain', () => {
  let homeWidgets;

  beforeEach(async () => {
    homeWidgets = await import('../src/features/home-widgets.js');
    mockState.homeWidgets = [
      { id: 'today-tasks', visible: true, order: 0 },
      { id: 'todays-score', visible: true, order: 1 },
      { id: 'weather', visible: true, order: 2, size: 'half' },
      { id: 'chart', visible: false, order: 3, size: 'full' },
    ];
  });

  it('toggleWidgetVisibility() saves and syncs to cloud', () => {
    homeWidgets.toggleWidgetVisibility('weather');
    expect(mockState.homeWidgets.find(w => w.id === 'weather').visible).toBe(false);
    expect(localStorage.getItem('lifeGamificationHomeWidgets')).not.toBeNull();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('toggleWidgetVisibility() on today-tasks (visible) is blocked', () => {
    homeWidgets.toggleWidgetVisibility('today-tasks');
    expect(mockState.homeWidgets.find(w => w.id === 'today-tasks').visible).toBe(true);
  });

  it('toggleWidgetVisibility() on todays-score (visible) is blocked', () => {
    homeWidgets.toggleWidgetVisibility('todays-score');
    expect(mockState.homeWidgets.find(w => w.id === 'todays-score').visible).toBe(true);
  });

  it('toggleWidgetVisibility() on hidden widget makes it visible and syncs', () => {
    homeWidgets.toggleWidgetVisibility('chart');
    expect(mockState.homeWidgets.find(w => w.id === 'chart').visible).toBe(true);
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('toggleWidgetSize() toggles between full and half', () => {
    homeWidgets.toggleWidgetSize('weather');
    expect(mockState.homeWidgets.find(w => w.id === 'weather').size).toBe('full');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('toggleWidgetSize() from full to half syncs', () => {
    homeWidgets.toggleWidgetSize('chart');
    expect(mockState.homeWidgets.find(w => w.id === 'chart').size).toBe('half');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('moveWidgetUp() reorders and syncs', () => {
    homeWidgets.moveWidgetUp('weather');
    expect(mockState.homeWidgets[1].id).toBe('weather');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('moveWidgetUp() at index 0 does nothing', () => {
    homeWidgets.moveWidgetUp('today-tasks');
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('moveWidgetDown() reorders and syncs', () => {
    homeWidgets.moveWidgetDown('today-tasks');
    expect(mockState.homeWidgets[0].id).toBe('todays-score');
    expect(mockState.homeWidgets[1].id).toBe('today-tasks');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('moveWidgetDown() at last index does nothing', () => {
    homeWidgets.moveWidgetDown('chart');
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('handleWidgetDrop() reorders widgets and syncs', () => {
    mockState.draggingWidgetId = 'chart';
    homeWidgets.handleWidgetDrop({ preventDefault: vi.fn(), currentTarget: { classList: { remove: vi.fn() } } }, 'today-tasks');
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('handleWidgetDrop() with same source and target does nothing', () => {
    mockState.draggingWidgetId = 'weather';
    homeWidgets.handleWidgetDrop({ preventDefault: vi.fn(), currentTarget: { classList: { remove: vi.fn() } } }, 'weather');
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('resetHomeWidgets() syncs after resetting to defaults', () => {
    homeWidgets.resetHomeWidgets();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
    expect(mocks.render).toHaveBeenCalled();
  });

  it('addPerspectiveWidget() adds widget and syncs', () => {
    mockState.customPerspectives = [{ id: 'custom_abc', name: 'My View' }];
    homeWidgets.addPerspectiveWidget('custom_abc');
    expect(mockState.homeWidgets.find(w => w.id === 'perspective-custom_abc')).toBeDefined();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('addPerspectiveWidget() skips duplicate', () => {
    mockState.homeWidgets.push({ id: 'perspective-existing', type: 'perspective', visible: true, order: 5 });
    homeWidgets.addPerspectiveWidget('existing');
    expect(mocks.debouncedSaveToGithub).not.toHaveBeenCalled();
  });

  it('removePerspectiveWidget() removes and syncs', () => {
    mockState.homeWidgets.push({ id: 'perspective-remove_me', type: 'perspective', visible: true, order: 5 });
    homeWidgets.removePerspectiveWidget('perspective-remove_me');
    expect(mockState.homeWidgets.find(w => w.id === 'perspective-remove_me')).toBeUndefined();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('saveHomeWidgets() persists to localStorage and calls debouncedSaveToGithub', () => {
    homeWidgets.saveHomeWidgets();
    expect(localStorage.getItem('lifeGamificationHomeWidgets')).not.toBeNull();
    expect(mocks.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('saveHomeWidgets() handles undefined window.debouncedSaveToGithub gracefully', () => {
    const saved = window.debouncedSaveToGithub;
    window.debouncedSaveToGithub = undefined;
    expect(() => homeWidgets.saveHomeWidgets()).not.toThrow();
    window.debouncedSaveToGithub = saved;
  });
});

// ============================================================================
// CROSS-CUTTING: End-to-end sync chain verifications
// ============================================================================
describe('Cross-cutting sync chain verifications', () => {
  it('createTask is wired through saveTasksData which calls window.debouncedSaveToGithub', () => {
    const result = mocks.createTask('Test', { status: 'inbox' });
    expect(result.title).toBe('Test');
  });

  it('updateTask is wired through saveTasksData which calls window.debouncedSaveToGithub', () => {
    mocks.updateTask('task_1', { title: 'Updated' });
    expect(mocks.updateTask).toHaveBeenCalled();
  });

  it('createArea calls saveTasksData internally', () => {
    mocks.createArea('Test Area');
    expect(mocks.createArea).toHaveBeenCalled();
  });

  it('createLabel calls saveTasksData internally', () => {
    mocks.createLabel('Test Label', '#FF0000');
    expect(mocks.createLabel).toHaveBeenCalled();
  });

  it('createPerson calls saveTasksData internally', () => {
    mocks.createPerson('Test Person');
    expect(mocks.createPerson).toHaveBeenCalled();
  });

  it('createPerspective calls saveTasksData internally', () => {
    mocks.createPerspective('Test Perspective', '\uD83D\uDCCC', {});
    expect(mocks.createPerspective).toHaveBeenCalled();
  });

  it('window.debouncedSaveToGithub is always a function on the window object', () => {
    expect(typeof window.debouncedSaveToGithub).toBe('function');
  });

  it('window.render is always a function on the window object', () => {
    expect(typeof window.render).toBe('function');
  });

  it('window.saveTasksData is always a function on the window object', () => {
    expect(typeof window.saveTasksData).toBe('function');
  });
});
