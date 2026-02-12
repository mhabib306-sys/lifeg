// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks — must be declared before any module imports
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => {
  const state = {
    activeTab: 'tasks',
    activeFilterType: 'perspective',
    activePerspective: 'inbox',
    activeAreaFilter: null,
    activeCategoryFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    currentDate: '2026-01-15',
    tasksData: [],
    taskAreas: [{ id: 'area_1', name: 'Work', icon: '💼', emoji: '💼', color: '#4A90A4', order: 0 }],
    taskCategories: [{ id: 'cat_1', name: 'Development', areaId: 'area_1', icon: '💻', emoji: '💻', color: '#6B8E5A', order: 0 }],
    taskLabels: [{ id: 'label_1', name: 'Urgent', icon: '🔴', color: '#EF4444' }],
    taskPeople: [{ id: 'person_1', name: 'John Doe', icon: '👤', email: '', jobTitle: '', photoUrl: '', photoData: '' }],
    customPerspectives: [],
    homeWidgets: [],
    showTaskModal: false,
    editingTaskId: null,
    modalTitle: '',
    modalNotes: '',
    modalStatus: 'inbox',
    modalIsNote: false,
    modalFlagged: false,
    modalDeferDate: '',
    modalDueDate: '',
    modalRepeat: null,
    modalAreaId: '',
    modalCategoryId: '',
    modalTags: [],
    modalPeople: [],
    modalSelectedArea: null,
    modalSelectedCategory: null,
    modalSelectedStatus: 'inbox',
    modalSelectedToday: false,
    modalSelectedFlagged: false,
    modalSelectedTags: [],
    modalSelectedPeople: [],
    modalRepeatEnabled: false,
    modalStateInitialized: false,
    newTaskContext: { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' },
    inlineEditingTaskId: null,
    inlineEditText: '',
    sidebarCollapsed: {},
    searchQuery: '',
    selectedTaskIds: new Set(),
    inlineAutocompleteMeta: new Map(),
    showInlineTagInput: false,
    showInlinePersonInput: false,
    quickAddIsNote: false,
    workspaceContentMode: 'both',
    workspaceSidebarCollapsed: false,
    collapsedSidebarAreas: new Set(),
    reviewMode: false,
    triggers: [],
    WEIGHTS: { prayer: {}, glucose: {}, whoop: {}, family: {}, habits: {} },
    MAX_SCORES: { prayer: 50, diabetes: 20, whoop: 30, family: 30, habits: 30, total: 160 },
  };

  const THINGS3_ICONS = {
    home: '<svg class="w-5 h-5">home</svg>',
    inbox: '<svg class="w-5 h-5">inbox</svg>',
    today: '<svg class="w-5 h-5">today</svg>',
    flagged: '<svg class="w-5 h-5">flagged</svg>',
    upcoming: '<svg class="w-5 h-5">upcoming</svg>',
    anytime: '<svg class="w-5 h-5">anytime</svg>',
    someday: '<svg class="w-5 h-5">someday</svg>',
    logbook: '<svg class="w-5 h-5">logbook</svg>',
    trash: '<svg class="w-5 h-5">trash</svg>',
    area: '<svg class="w-5 h-5">area</svg>',
    next: '<svg class="w-5 h-5">next</svg>',
    notes: '<svg class="w-5 h-5">notes</svg>',
    calendar: '<svg class="w-5 h-5">calendar</svg>',
    lifeScore: '<svg class="w-5 h-5">lifeScore</svg>',
    workspace: '<svg class="w-5 h-5">workspace</svg>',
    settings: '<svg class="w-5 h-5">settings</svg>',
    trigger: '<svg class="w-5 h-5">trigger</svg>',
    review: '<svg class="w-5 h-5">review</svg>',
  };

  const BUILTIN_PERSPECTIVES = [
    { id: 'inbox', name: 'Inbox', icon: THINGS3_ICONS.inbox, color: '#147EFB', filter: { status: 'inbox' }, builtin: true },
    { id: 'today', name: 'Today', icon: THINGS3_ICONS.today, color: '#FFCC00', filter: { today: true }, builtin: true },
    { id: 'flagged', name: 'Flagged', icon: THINGS3_ICONS.flagged, color: '#FF9500', filter: { flagged: true }, builtin: true },
    { id: 'upcoming', name: 'Upcoming', icon: THINGS3_ICONS.upcoming, color: '#FF3B30', filter: { upcoming: true }, builtin: true },
    { id: 'anytime', name: 'Anytime', icon: THINGS3_ICONS.anytime, color: '#5AC8FA', filter: { status: 'anytime' }, builtin: true },
    { id: 'someday', name: 'Someday', icon: THINGS3_ICONS.someday, color: '#C69C6D', filter: { status: 'someday' }, builtin: true },
    { id: 'logbook', name: 'Logbook', icon: THINGS3_ICONS.logbook, color: '#34C759', filter: { completed: true }, builtin: true },
  ];

  const NOTES_PERSPECTIVE = { id: 'notes', name: 'Notes', icon: THINGS3_ICONS.notes, color: '#5856D6', filter: { notes: true }, builtin: true };

  return {
    state,
    THINGS3_ICONS,
    BUILTIN_PERSPECTIVES,
    NOTES_PERSPECTIVE,
    escapeHtmlMock: vi.fn(s => s || ''),
    formatSmartDateMock: vi.fn(d => d || ''),
    getLocalDateStringMock: vi.fn(() => '2026-01-15'),
    renderPersonAvatarMock: vi.fn((p, size) => `<span>avatar:${p?.name || ''}</span>`),
    generateTaskIdMock: vi.fn(() => 'task_mock_123'),
    getAreaByIdMock: vi.fn(),
    getCategoryByIdMock: vi.fn(),
    getLabelByIdMock: vi.fn(),
    getPersonByIdMock: vi.fn(),
    getCategoriesByAreaMock: vi.fn(() => []),
    getTasksByPersonMock: vi.fn(() => []),
    saveViewStateMock: vi.fn(),
    createTaskMock: vi.fn(),
    updateTaskMock: vi.fn(),
    deleteTaskMock: vi.fn(),
    createLabelMock: vi.fn((name, color) => ({ id: 'label_new', name, color })),
    createPersonMock: vi.fn((name) => ({ id: 'person_new', name })),
    setupInlineAutocompleteMock: vi.fn(),
    cleanupInlineAutocompleteMock: vi.fn(),
    renderInlineChipsMock: vi.fn(() => ''),
    getActiveIconsMock: vi.fn(() => THINGS3_ICONS),
    _cssMock: vi.fn(() => ''),
  };
});

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mocks.state }));

vi.mock('../src/constants.js', () => ({
  THINGS3_ICONS: mocks.THINGS3_ICONS,
  BUILTIN_PERSPECTIVES: mocks.BUILTIN_PERSPECTIVES,
  NOTES_PERSPECTIVE: mocks.NOTES_PERSPECTIVE,
  getActiveIcons: mocks.getActiveIconsMock,
  getBuiltinPerspectives: () => mocks.BUILTIN_PERSPECTIVES,
  getNotesPerspective: () => mocks.NOTES_PERSPECTIVE,
  _css: mocks._cssMock,
  TASK_CATEGORIES_KEY: 'lifeGamificationTaskCategories',
  TASK_LABELS_KEY: 'lifeGamificationTaskLabels',
  TASK_PEOPLE_KEY: 'lifeGamificationTaskPeople',
  TASKS_KEY: 'lifeGamificationTasks',
  PERSPECTIVES_KEY: 'lifeGamificationPerspectives',
}));

vi.mock('../src/utils.js', () => ({
  escapeHtml: mocks.escapeHtmlMock,
  formatSmartDate: mocks.formatSmartDateMock,
  getLocalDateString: mocks.getLocalDateStringMock,
  renderPersonAvatar: mocks.renderPersonAvatarMock,
  generateTaskId: mocks.generateTaskIdMock,
  fmt: vi.fn(n => String(n)),
  safeJsonParse: vi.fn((k, d) => d),
}));

vi.mock('../src/features/areas.js', () => ({
  getAreaById: mocks.getAreaByIdMock,
  getCategoryById: mocks.getCategoryByIdMock,
  getLabelById: mocks.getLabelByIdMock,
  getPersonById: mocks.getPersonByIdMock,
  getCategoriesByArea: mocks.getCategoriesByAreaMock,
  getTasksByPerson: mocks.getTasksByPersonMock,
  createLabel: mocks.createLabelMock,
  createPerson: mocks.createPersonMock,
}));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: vi.fn(),
  saveData: vi.fn(),
  saveViewState: mocks.saveViewStateMock,
  getTodayData: vi.fn(() => ({})),
}));

vi.mock('../src/features/tasks.js', () => ({
  createTask: mocks.createTaskMock,
  updateTask: mocks.updateTaskMock,
  deleteTask: mocks.deleteTaskMock,
}));

vi.mock('../src/features/inline-autocomplete.js', () => ({
  setupInlineAutocomplete: mocks.setupInlineAutocompleteMock,
  cleanupInlineAutocomplete: mocks.cleanupInlineAutocompleteMock,
  renderInlineChips: mocks.renderInlineChipsMock,
}));

// ---------------------------------------------------------------------------
// Imports — after mocks
// ---------------------------------------------------------------------------
import {
  renderTaskItem,
  buildAreaTaskListHtml,
  buildCategoryTaskListHtml,
  buildLabelTaskListHtml,
  buildPersonTaskListHtml,
  buildAllLabelsHtml,
  buildAllPeopleHtml,
  buildCustomPerspectiveTaskListHtml,
  renderTasksTab,
} from '../src/ui/tasks-tab.js';

import {
  startInlineEdit,
  saveInlineEdit,
  cancelInlineEdit,
  handleInlineEditKeydown,
  openNewTaskModal,
  quickAddTask,
  handleQuickAddKeydown,
  toggleInlineTagInput,
  addInlineTag,
  toggleInlinePersonInput,
  addInlinePerson,
  cleanupModalAutocomplete,
  setupAutocomplete,
  initModalState,
  setModalType,
  setModalStatus,
  toggleModalFlagged,
  updateDateDisplay,
  clearDateField,
  setQuickDate,
  openDatePicker,
  selectArea,
  renderAreaInput,
  selectCategory,
  renderCategoryInput,
  addTag,
  removeTag,
  renderTagsInput,
  addPerson,
  removePerson,
  renderPeopleInput,
  toggleRepeat,
  initModalAutocomplete,
  closeTaskModal,
  saveTaskFromModal,
  renderTaskModalHtml,
} from '../src/ui/task-modal.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------
function makeTask(overrides = {}) {
  return {
    id: overrides.id || 'task_1',
    title: overrides.title || 'Test Task',
    notes: '',
    status: 'anytime',
    today: false,
    flagged: false,
    completed: false,
    completedAt: null,
    areaId: null,
    categoryId: null,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    repeat: null,
    isNote: false,
    parentId: null,
    indent: 0,
    meetingEventKey: null,
    lastReviewedAt: null,
    order: 1000,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
    ...overrides,
  };
}

function resetState() {
  mocks.state.activeTab = 'tasks';
  mocks.state.activeFilterType = 'perspective';
  mocks.state.activePerspective = 'inbox';
  mocks.state.activeAreaFilter = null;
  mocks.state.activeCategoryFilter = null;
  mocks.state.activeLabelFilter = null;
  mocks.state.activePersonFilter = null;
  mocks.state.currentDate = '2026-01-15';
  mocks.state.tasksData = [];
  mocks.state.taskAreas = [{ id: 'area_1', name: 'Work', icon: '💼', emoji: '💼', color: '#4A90A4', order: 0 }];
  mocks.state.taskCategories = [{ id: 'cat_1', name: 'Development', areaId: 'area_1', icon: '💻', emoji: '💻', color: '#6B8E5A', order: 0 }];
  mocks.state.taskLabels = [{ id: 'label_1', name: 'Urgent', icon: '🔴', color: '#EF4444' }];
  mocks.state.taskPeople = [{ id: 'person_1', name: 'John Doe', icon: '👤', email: '', jobTitle: '', photoUrl: '', photoData: '' }];
  mocks.state.customPerspectives = [];
  mocks.state.homeWidgets = [];
  mocks.state.showTaskModal = false;
  mocks.state.editingTaskId = null;
  mocks.state.modalSelectedArea = null;
  mocks.state.modalSelectedCategory = null;
  mocks.state.modalSelectedStatus = 'inbox';
  mocks.state.modalSelectedToday = false;
  mocks.state.modalSelectedFlagged = false;
  mocks.state.modalSelectedTags = [];
  mocks.state.modalSelectedPeople = [];
  mocks.state.modalRepeatEnabled = false;
  mocks.state.modalStateInitialized = false;
  mocks.state.modalIsNote = false;
  mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
  mocks.state.inlineEditingTaskId = null;
  mocks.state.inlineEditText = '';
  mocks.state.sidebarCollapsed = {};
  mocks.state.searchQuery = '';
  mocks.state.selectedTaskIds = new Set();
  mocks.state.inlineAutocompleteMeta = new Map();
  mocks.state.showInlineTagInput = false;
  mocks.state.showInlinePersonInput = false;
  mocks.state.quickAddIsNote = false;
  mocks.state.workspaceContentMode = 'both';
  mocks.state.workspaceSidebarCollapsed = false;
  mocks.state.collapsedSidebarAreas = new Set();
  mocks.state.reviewMode = false;
  mocks.state.triggers = [];

  // Reset entity lookup mocks
  mocks.getAreaByIdMock.mockImplementation((id) => mocks.state.taskAreas.find(a => a.id === id) || null);
  mocks.getCategoryByIdMock.mockImplementation((id) => mocks.state.taskCategories.find(c => c.id === id) || null);
  mocks.getLabelByIdMock.mockImplementation((id) => mocks.state.taskLabels.find(l => l.id === id) || null);
  mocks.getPersonByIdMock.mockImplementation((id) => mocks.state.taskPeople.find(p => p.id === id) || null);
  mocks.getCategoriesByAreaMock.mockImplementation((areaId) => mocks.state.taskCategories.filter(c => c.areaId === areaId));
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  resetState();
  vi.clearAllMocks();

  // Setup window mocks for tasks-tab.js module-level functions
  window.getFilteredTasks = vi.fn(() => []);
  window.getCurrentFilteredTasks = vi.fn(() => []);
  window.getCurrentViewInfo = vi.fn(() => ({ title: 'Inbox', icon: '', color: '' }));
  window.groupTasksByDate = vi.fn(() => ({}));
  window.groupTasksByCompletionDate = vi.fn(() => ({}));
  window.getTasksByCategory = vi.fn(() => []);
  window.getTasksByLabel = vi.fn(() => []);
  window.renderNotesOutliner = vi.fn(() => '');
  window.renderNotesBreadcrumb = vi.fn(() => '');
  window.renderTriggersOutliner = vi.fn(() => '');
  window.renderTriggersBreadcrumb = vi.fn(() => '');
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.startInlineEdit = vi.fn();
  window.matchMedia = vi.fn(() => ({ matches: false }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ==========================================================================
// TASKS-TAB.JS TESTS
// ==========================================================================

// --------------------------------------------------------------------------
// renderTaskItem
// --------------------------------------------------------------------------
describe('renderTaskItem', () => {
  it('renders a basic task with title', () => {
    const task = makeTask({ title: 'Buy groceries' });
    const html = renderTaskItem(task);
    expect(html).toContain('Buy groceries');
    expect(html).toContain('task-item');
  });

  it('renders checkbox for non-note task', () => {
    const task = makeTask({ title: 'Task with checkbox' });
    const html = renderTaskItem(task);
    expect(html).toContain('task-checkbox');
    expect(html).toContain('toggleTaskComplete');
  });

  it('renders dot instead of checkbox for note', () => {
    const task = makeTask({ title: 'My Note', isNote: true });
    const html = renderTaskItem(task);
    expect(html).toContain('notes-accent');
    // The note should be marked with is-note class
    expect(html).toContain('is-note');
  });

  it('renders completed task with line-through', () => {
    const task = makeTask({ title: 'Done task', completed: true });
    const html = renderTaskItem(task);
    expect(html).toContain('line-through');
  });

  it('renders flagged task icon', () => {
    const task = makeTask({ title: 'Flagged task', flagged: true });
    const html = renderTaskItem(task);
    expect(html).toContain('flagged-color');
  });

  it('renders due date when showDueDate is true', () => {
    const task = makeTask({ title: 'Task with due', dueDate: '2026-01-20' });
    mocks.formatSmartDateMock.mockReturnValueOnce('Jan 20');
    const html = renderTaskItem(task, true);
    expect(html).toContain('Due');
  });

  it('hides due date when showDueDate is false', () => {
    const task = makeTask({ title: 'Task no due display', dueDate: '2026-01-20' });
    const html = renderTaskItem(task, false);
    // Due metadata should not appear
    expect(html).not.toContain('Due Jan 20');
  });

  it('renders overdue styling for past due date in compact mode', () => {
    const task = makeTask({ title: 'Overdue task', dueDate: '2026-01-10' });
    const html = renderTaskItem(task, true, true);
    expect(html).toContain('overdue-color');
  });

  it('renders overdue task due date in metadata for full mode', () => {
    const task = makeTask({ title: 'Overdue task', dueDate: '2026-01-10' });
    const html = renderTaskItem(task, true, false);
    expect(html).toContain('Due');
  });

  it('renders area name in metadata', () => {
    const task = makeTask({ title: 'Area task', areaId: 'area_1' });
    const html = renderTaskItem(task);
    expect(html).toContain('Work');
  });

  it('renders area and category in metadata with separator', () => {
    const task = makeTask({ title: 'Area+Cat task', areaId: 'area_1', categoryId: 'cat_1' });
    const html = renderTaskItem(task);
    expect(html).toContain('Work');
    expect(html).toContain('Development');
  });

  it('renders label names in metadata', () => {
    const task = makeTask({ title: 'Labeled task', labels: ['label_1'] });
    const html = renderTaskItem(task);
    expect(html).toContain('Urgent');
  });

  it('renders people names in metadata', () => {
    const task = makeTask({ title: 'People task', people: ['person_1'] });
    const html = renderTaskItem(task);
    expect(html).toContain('John');
  });

  it('renders defer date in metadata', () => {
    const task = makeTask({ title: 'Deferred task', deferDate: '2026-02-01' });
    const html = renderTaskItem(task);
    expect(html).toContain('Start');
  });

  it('renders repeat indicator in metadata', () => {
    const task = makeTask({ title: 'Repeating task', repeat: { type: 'daily', interval: 1 } });
    const html = renderTaskItem(task);
    expect(html).toContain('Repeats');
  });

  it('renders notes indicator in metadata', () => {
    const task = makeTask({ title: 'Task with notes', notes: 'Some details here' });
    const html = renderTaskItem(task);
    expect(html).toContain('Notes');
  });

  it('renders compact mode for widgets', () => {
    const task = makeTask({ title: 'Compact task' });
    const html = renderTaskItem(task, true, true);
    expect(html).toContain('compact-task');
    expect(html).toContain('truncate');
  });

  it('renders compact mode with flagged icon', () => {
    const task = makeTask({ title: 'Compact flagged', flagged: true });
    const html = renderTaskItem(task, true, true);
    expect(html).toContain('flagged-color');
  });

  it('renders compact mode with due date', () => {
    const task = makeTask({ title: 'Compact due', dueDate: '2026-01-20' });
    const html = renderTaskItem(task, true, true);
    // Due date is shown in compact mode
    expect(html).toContain('2026-01-20');
  });

  it('renders compact mode with repeat icon', () => {
    const task = makeTask({ title: 'Compact repeat', repeat: { type: 'weekly', interval: 1 } });
    const html = renderTaskItem(task, true, true);
    expect(html).toContain('Repeats');
  });

  it('renders inline edit input when task is being edited', () => {
    const task = makeTask({ title: 'Edit me', id: 'task_edit' });
    mocks.state.inlineEditingTaskId = 'task_edit';
    const html = renderTaskItem(task);
    expect(html).toContain('inline-edit-input');
    expect(html).toContain('handleInlineEditKeydown');
  });

  it('renders indented tasks with padding', () => {
    const task = makeTask({ title: 'Indented note', indent: 2 });
    const html = renderTaskItem(task);
    // 16 + 2*24 = 64
    expect(html).toContain('padding-left: 64px');
  });

  it('renders edit and delete action buttons', () => {
    const task = makeTask({ title: 'Actions task' });
    const html = renderTaskItem(task);
    expect(html).toContain('Edit');
    expect(html).toContain('confirmDeleteTask');
  });

  it('renders note child/indent/outdent buttons for notes', () => {
    const task = makeTask({ title: 'Note actions', isNote: true });
    const html = renderTaskItem(task);
    expect(html).toContain('createChildNote');
    expect(html).toContain('outdentNote');
    expect(html).toContain('indentNote');
  });

  it('does not render note-specific buttons for non-note tasks', () => {
    const task = makeTask({ title: 'Task no note btns' });
    const html = renderTaskItem(task);
    expect(html).not.toContain('createChildNote');
  });

  it('renders completed note as well', () => {
    const task = makeTask({ title: 'Done note', isNote: true, completed: true });
    const html = renderTaskItem(task);
    expect(html).toContain('Done note');
    // Completed notes should not show child note button
    expect(html).not.toContain('createChildNote');
  });

  it('renders draggable=true for non-editing desktop tasks', () => {
    const task = makeTask({ title: 'Draggable task' });
    const html = renderTaskItem(task);
    expect(html).toContain('draggable="true"');
  });

  it('renders draggable=false when inline editing', () => {
    const task = makeTask({ title: 'Editing task', id: 'task_e' });
    mocks.state.inlineEditingTaskId = 'task_e';
    const html = renderTaskItem(task);
    expect(html).toContain('draggable="false"');
  });

  it('renders due today with accent color', () => {
    // Mock today as '2026-01-15', due date same
    const task = makeTask({ title: 'Due today', dueDate: '2026-01-15' });
    const html = renderTaskItem(task, true, true);
    expect(html).toContain('accent');
  });

  it('handles task with no title gracefully', () => {
    const task = makeTask({ title: '' });
    const html = renderTaskItem(task);
    expect(html).toContain('task-item');
  });

  it('renders task meta parts joined with bullet separator', () => {
    const task = makeTask({ title: 'Multi meta', areaId: 'area_1', labels: ['label_1'], deferDate: '2026-02-01' });
    const html = renderTaskItem(task);
    // Meta parts are joined with ' • '
    expect(html).toContain('task-meta-inline');
  });
});

// --------------------------------------------------------------------------
// buildAreaTaskListHtml
// --------------------------------------------------------------------------
describe('buildAreaTaskListHtml', () => {
  it('returns empty string for null area', () => {
    const result = buildAreaTaskListHtml(null, [], '2026-01-15');
    expect(result).toBe('');
  });

  it('renders area hero header with name', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    const html = buildAreaTaskListHtml(area, [], '2026-01-15');
    expect(html).toContain('Work');
    expect(html).toContain('area-hero');
  });

  it('shows completion stats', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    mocks.state.tasksData = [
      makeTask({ areaId: 'area_1', completed: true }),
      makeTask({ id: 'task_2', areaId: 'area_1', completed: false }),
    ];
    const html = buildAreaTaskListHtml(area, [makeTask({ id: 'task_2', areaId: 'area_1' })], '2026-01-15');
    expect(html).toContain('1 active');
    expect(html).toContain('1 completed');
  });

  it('renders empty state when no tasks', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    const html = buildAreaTaskListHtml(area, [], '2026-01-15');
    expect(html).toContain('No items yet');
    expect(html).toContain('Add First Item');
  });

  it('renders quick add input', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    const html = buildAreaTaskListHtml(area, [], '2026-01-15');
    expect(html).toContain('quick-add-input');
  });

  it('renders categories section', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    const html = buildAreaTaskListHtml(area, [], '2026-01-15');
    expect(html).toContain('Categories');
    expect(html).toContain('Development');
  });

  it('renders overdue count badge when tasks are overdue', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    const overdueTask = makeTask({ areaId: 'area_1', dueDate: '2026-01-10' });
    const html = buildAreaTaskListHtml(area, [overdueTask], '2026-01-15');
    expect(html).toContain('1 overdue');
  });

  it('renders notes section when notes exist and mode allows', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    const noteTask = makeTask({ isNote: true, areaId: 'area_1' });
    const html = buildAreaTaskListHtml(area, [noteTask], '2026-01-15');
    expect(html).toContain('Notes');
  });

  it('hides notes section when workspaceContentMode is tasks', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    mocks.state.activeAreaFilter = 'area_1';
    mocks.state.workspaceContentMode = 'tasks';
    const noteTask = makeTask({ isNote: true, areaId: 'area_1' });
    const html = buildAreaTaskListHtml(area, [noteTask], '2026-01-15');
    // Notes section is not rendered in tasks-only mode
    expect(html).not.toContain('renderNotesOutliner');
  });

  it('renders area color in hero header', () => {
    const area = { id: 'area_1', name: 'Work', color: '#ABCDEF' };
    mocks.state.activeAreaFilter = 'area_1';
    const html = buildAreaTaskListHtml(area, [], '2026-01-15');
    expect(html).toContain('#ABCDEF');
  });
});

// --------------------------------------------------------------------------
// buildCategoryTaskListHtml
// --------------------------------------------------------------------------
describe('buildCategoryTaskListHtml', () => {
  it('returns empty string for null category', () => {
    expect(buildCategoryTaskListHtml(null, [], '2026-01-15')).toBe('');
  });

  it('renders category hero header with name', () => {
    const cat = { id: 'cat_1', name: 'Development', areaId: 'area_1', color: '#6B8E5A' };
    const html = buildCategoryTaskListHtml(cat, [], '2026-01-15');
    expect(html).toContain('Development');
    expect(html).toContain('area-hero');
  });

  it('renders parent area breadcrumb', () => {
    const cat = { id: 'cat_1', name: 'Development', areaId: 'area_1', color: '#6B8E5A' };
    const html = buildCategoryTaskListHtml(cat, [], '2026-01-15');
    expect(html).toContain('Work');
    expect(html).toContain('showAreaTasks');
  });

  it('renders task sections for active tasks', () => {
    const cat = { id: 'cat_1', name: 'Dev', areaId: 'area_1', color: '#6B8E5A' };
    const task = makeTask({ categoryId: 'cat_1', areaId: 'area_1', status: 'anytime' });
    const html = buildCategoryTaskListHtml(cat, [task], '2026-01-15');
    expect(html).toContain('Test Task');
  });

  it('renders empty state when no tasks', () => {
    const cat = { id: 'cat_1', name: 'Dev', areaId: 'area_1', color: '#6B8E5A' };
    const html = buildCategoryTaskListHtml(cat, [], '2026-01-15');
    expect(html).toContain('No tasks in Dev');
  });

  it('renders completion progress bar', () => {
    const cat = { id: 'cat_1', name: 'Dev', areaId: 'area_1', color: '#6B8E5A' };
    mocks.state.tasksData = [
      makeTask({ categoryId: 'cat_1', completed: true }),
      makeTask({ id: 'task_2', categoryId: 'cat_1', completed: false }),
    ];
    const html = buildCategoryTaskListHtml(cat, [makeTask({ id: 'task_2', categoryId: 'cat_1' })], '2026-01-15');
    expect(html).toContain('50%');
  });
});

// --------------------------------------------------------------------------
// buildLabelTaskListHtml
// --------------------------------------------------------------------------
describe('buildLabelTaskListHtml', () => {
  it('returns empty string for null label', () => {
    expect(buildLabelTaskListHtml(null, [], '2026-01-15')).toBe('');
  });

  it('renders label hero header with name', () => {
    const label = { id: 'label_1', name: 'Urgent', color: '#EF4444' };
    const html = buildLabelTaskListHtml(label, [], '2026-01-15');
    expect(html).toContain('Urgent');
    expect(html).toContain('area-hero');
  });

  it('renders completion stats', () => {
    const label = { id: 'label_1', name: 'Urgent', color: '#EF4444' };
    mocks.state.tasksData = [
      makeTask({ labels: ['label_1'], completed: true }),
      makeTask({ id: 'task_2', labels: ['label_1'], completed: false }),
    ];
    const html = buildLabelTaskListHtml(label, [makeTask({ id: 'task_2', labels: ['label_1'] })], '2026-01-15');
    expect(html).toContain('1 active');
    expect(html).toContain('1 completed');
  });

  it('renders empty state when no tasks', () => {
    const label = { id: 'label_1', name: 'Urgent', color: '#EF4444' };
    const html = buildLabelTaskListHtml(label, [], '2026-01-15');
    expect(html).toContain('No items yet');
  });

  it('renders label color throughout the page', () => {
    const label = { id: 'label_1', name: 'Urgent', color: '#FF0000' };
    const html = buildLabelTaskListHtml(label, [], '2026-01-15');
    expect(html).toContain('#FF0000');
  });

  it('renders quick add input with label context', () => {
    const label = { id: 'label_1', name: 'Urgent', color: '#EF4444' };
    const html = buildLabelTaskListHtml(label, [], '2026-01-15');
    expect(html).toContain('quick-add-input');
  });
});

// --------------------------------------------------------------------------
// buildPersonTaskListHtml
// --------------------------------------------------------------------------
describe('buildPersonTaskListHtml', () => {
  it('returns empty string for null person', () => {
    expect(buildPersonTaskListHtml(null, [], '2026-01-15')).toBe('');
  });

  it('renders person hero header with name', () => {
    const person = { id: 'person_1', name: 'John Doe', email: '', jobTitle: '', photoData: '' };
    const html = buildPersonTaskListHtml(person, [], '2026-01-15');
    expect(html).toContain('John Doe');
    expect(html).toContain('area-hero');
  });

  it('renders person with photo', () => {
    const person = { id: 'person_1', name: 'Jane', photoData: 'data:image/png;base64,abc' };
    const html = buildPersonTaskListHtml(person, [], '2026-01-15');
    expect(html).toContain('data:image/png;base64,abc');
  });

  it('renders person without photo using SVG fallback', () => {
    const person = { id: 'person_1', name: 'No Photo', photoData: '' };
    const html = buildPersonTaskListHtml(person, [], '2026-01-15');
    expect(html).toContain('svg');
  });

  it('renders job title and email when present', () => {
    const person = { id: 'person_1', name: 'Jane', email: 'jane@co.com', jobTitle: 'Engineer', photoData: '' };
    const html = buildPersonTaskListHtml(person, [], '2026-01-15');
    expect(html).toContain('Engineer');
    expect(html).toContain('jane@co.com');
  });

  it('renders empty state when no tasks', () => {
    const person = { id: 'person_1', name: 'John', photoData: '' };
    const html = buildPersonTaskListHtml(person, [], '2026-01-15');
    expect(html).toContain('No items yet');
    expect(html).toContain('John');
  });

  it('renders completion stats', () => {
    const person = { id: 'person_1', name: 'John', photoData: '' };
    mocks.state.tasksData = [
      makeTask({ people: ['person_1'], completed: true }),
    ];
    const html = buildPersonTaskListHtml(person, [], '2026-01-15');
    expect(html).toContain('0 active');
    expect(html).toContain('1 completed');
  });
});

// --------------------------------------------------------------------------
// buildAllLabelsHtml
// --------------------------------------------------------------------------
describe('buildAllLabelsHtml', () => {
  it('renders All Tags header', () => {
    const html = buildAllLabelsHtml();
    expect(html).toContain('All Tags');
  });

  it('renders label count', () => {
    const html = buildAllLabelsHtml();
    expect(html).toContain('1 tag');
  });

  it('renders each label as a card', () => {
    const html = buildAllLabelsHtml();
    expect(html).toContain('Urgent');
    expect(html).toContain('#EF4444');
  });

  it('renders empty state when no labels', () => {
    mocks.state.taskLabels = [];
    const html = buildAllLabelsHtml();
    expect(html).toContain('No tags yet');
  });

  it('sorts labels by task count descending', () => {
    mocks.state.taskLabels = [
      { id: 'label_a', name: 'A Label', color: '#aaa' },
      { id: 'label_b', name: 'B Label', color: '#bbb' },
    ];
    mocks.state.tasksData = [
      makeTask({ id: 't1', labels: ['label_b'] }),
      makeTask({ id: 't2', labels: ['label_b'] }),
      makeTask({ id: 't3', labels: ['label_a'] }),
    ];
    const html = buildAllLabelsHtml();
    const indexA = html.indexOf('A Label');
    const indexB = html.indexOf('B Label');
    // B has more tasks so should appear first
    expect(indexB).toBeLessThan(indexA);
  });

  it('renders Add Tag button', () => {
    const html = buildAllLabelsHtml();
    expect(html).toContain('showLabelModal');
  });
});

// --------------------------------------------------------------------------
// buildAllPeopleHtml
// --------------------------------------------------------------------------
describe('buildAllPeopleHtml', () => {
  it('renders All People header', () => {
    const html = buildAllPeopleHtml();
    expect(html).toContain('All People');
  });

  it('renders person count', () => {
    const html = buildAllPeopleHtml();
    expect(html).toContain('1 person');
  });

  it('renders each person as a card', () => {
    const html = buildAllPeopleHtml();
    expect(html).toContain('John Doe');
  });

  it('renders empty state when no people', () => {
    mocks.state.taskPeople = [];
    const html = buildAllPeopleHtml();
    expect(html).toContain('No people yet');
  });

  it('renders Add Person button', () => {
    const html = buildAllPeopleHtml();
    expect(html).toContain('showPersonModal');
  });

  it('renders person avatar', () => {
    const html = buildAllPeopleHtml();
    expect(mocks.renderPersonAvatarMock).toHaveBeenCalled();
  });

  it('renders job title when present', () => {
    mocks.state.taskPeople = [{ id: 'person_1', name: 'Jane', jobTitle: 'Designer', photoData: '' }];
    const html = buildAllPeopleHtml();
    expect(html).toContain('Designer');
  });
});

// --------------------------------------------------------------------------
// buildCustomPerspectiveTaskListHtml
// --------------------------------------------------------------------------
describe('buildCustomPerspectiveTaskListHtml', () => {
  it('returns empty string for null perspective', () => {
    expect(buildCustomPerspectiveTaskListHtml(null, [], '2026-01-15')).toBe('');
  });

  it('renders perspective hero header', () => {
    const persp = { id: 'cp_1', name: 'My View', icon: '🎯', color: '#FF00FF' };
    const html = buildCustomPerspectiveTaskListHtml(persp, [], '2026-01-15');
    expect(html).toContain('My View');
    expect(html).toContain('🎯');
  });

  it('renders item count', () => {
    const persp = { id: 'cp_1', name: 'My View', icon: '🎯', color: '#FF00FF' };
    const tasks = [makeTask()];
    const html = buildCustomPerspectiveTaskListHtml(persp, tasks, '2026-01-15');
    expect(html).toContain('1 item');
  });

  it('renders task list when tasks exist', () => {
    const persp = { id: 'cp_1', name: 'My View', icon: '🎯', color: '#FF00FF' };
    const tasks = [makeTask({ title: 'Persp Task' })];
    const html = buildCustomPerspectiveTaskListHtml(persp, tasks, '2026-01-15');
    expect(html).toContain('Persp Task');
  });

  it('renders empty state when no tasks', () => {
    const persp = { id: 'cp_1', name: 'My View', icon: '🎯', color: '#FF00FF' };
    const html = buildCustomPerspectiveTaskListHtml(persp, [], '2026-01-15');
    expect(html).toContain('No tasks');
  });

  it('renders quick add input', () => {
    const persp = { id: 'cp_1', name: 'My View', icon: '🎯', color: '#FF00FF' };
    const html = buildCustomPerspectiveTaskListHtml(persp, [], '2026-01-15');
    expect(html).toContain('quick-add-input');
  });

  it('uses default icon when perspective has none', () => {
    const persp = { id: 'cp_1', name: 'No Icon', color: '#FF00FF' };
    const html = buildCustomPerspectiveTaskListHtml(persp, [], '2026-01-15');
    expect(html).toContain('📌');
  });
});

// --------------------------------------------------------------------------
// renderTasksTab
// --------------------------------------------------------------------------
describe('renderTasksTab', () => {
  it('renders without crashing', () => {
    const html = renderTasksTab();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('renders sidebar with built-in perspectives', () => {
    const html = renderTasksTab();
    expect(html).toContain('Inbox');
    expect(html).toContain('Today');
    expect(html).toContain('Anytime');
    expect(html).toContain('Someday');
    expect(html).toContain('Logbook');
  });

  it('renders All Notes button in sidebar', () => {
    const html = renderTasksTab();
    expect(html).toContain('All Notes');
  });

  it('renders Areas section in sidebar', () => {
    const html = renderTasksTab();
    expect(html).toContain('Areas');
    expect(html).toContain('Work');
  });

  it('renders custom perspectives in sidebar', () => {
    mocks.state.customPerspectives = [{ id: 'cp_1', name: 'Sprint', icon: '🏃', color: '#FF0000' }];
    const html = renderTasksTab();
    expect(html).toContain('Sprint');
  });

  it('renders empty custom views message when none exist', () => {
    mocks.state.customPerspectives = [];
    const html = renderTasksTab();
    expect(html).toContain('No custom views yet');
  });

  it('redirects calendar perspective to inbox', () => {
    mocks.state.activePerspective = 'calendar';
    renderTasksTab();
    expect(mocks.state.activePerspective).toBe('inbox');
    expect(mocks.saveViewStateMock).toHaveBeenCalled();
  });

  it('renders Review button in sidebar', () => {
    const html = renderTasksTab();
    expect(html).toContain('Review');
    expect(html).toContain('startReview');
  });

  it('renders workspace mode controls', () => {
    const html = renderTasksTab();
    expect(html).toContain('workspace-mode-control');
    expect(html).toContain('Tasks');
    expect(html).toContain('Both');
    expect(html).toContain('Notes');
  });

  it('renders Tags and People sections in sidebar', () => {
    const html = renderTasksTab();
    expect(html).toContain('Tags');
    expect(html).toContain('People');
  });

  it('renders labels with tasks in sidebar', () => {
    // Labels only show in sidebar when they have associated tasks
    mocks.state.tasksData = [makeTask({ labels: ['label_1'] })];
    window.getTasksByLabel = vi.fn(() => [makeTask()]);
    const html = renderTasksTab();
    expect(html).toContain('Urgent');
  });
});

// ==========================================================================
// TASK-MODAL.JS TESTS
// ==========================================================================

// --------------------------------------------------------------------------
// initModalState
// --------------------------------------------------------------------------
describe('initModalState', () => {
  it('initializes from editing task data', () => {
    const task = makeTask({
      areaId: 'area_1',
      categoryId: 'cat_1',
      status: 'anytime',
      today: true,
      flagged: true,
      labels: ['label_1'],
      people: ['person_1'],
      isNote: false,
      repeat: { type: 'daily', interval: 1 },
    });
    initModalState(task);
    expect(mocks.state.modalSelectedArea).toBe('area_1');
    expect(mocks.state.modalSelectedCategory).toBe('cat_1');
    expect(mocks.state.modalSelectedStatus).toBe('anytime');
    expect(mocks.state.modalSelectedToday).toBe(true);
    expect(mocks.state.modalSelectedFlagged).toBe(true);
    expect(mocks.state.modalSelectedTags).toEqual(['label_1']);
    expect(mocks.state.modalSelectedPeople).toEqual(['person_1']);
    expect(mocks.state.modalIsNote).toBe(false);
    expect(mocks.state.modalRepeatEnabled).toBe(true);
  });

  it('initializes from newTaskContext for new tasks', () => {
    mocks.state.newTaskContext = {
      areaId: 'area_1',
      categoryId: 'cat_1',
      labelId: 'label_1',
      labelIds: null,
      personId: 'person_1',
      status: 'anytime',
      today: true,
      flagged: true,
    };
    initModalState(null);
    expect(mocks.state.modalSelectedArea).toBe('area_1');
    expect(mocks.state.modalSelectedCategory).toBe('cat_1');
    expect(mocks.state.modalSelectedStatus).toBe('anytime');
    expect(mocks.state.modalSelectedToday).toBe(true);
    expect(mocks.state.modalSelectedFlagged).toBe(true);
    expect(mocks.state.modalSelectedTags).toEqual(['label_1']);
    expect(mocks.state.modalSelectedPeople).toEqual(['person_1']);
    expect(mocks.state.modalRepeatEnabled).toBe(false);
  });

  it('initializes with default values when context is empty', () => {
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    mocks.state.activePerspective = 'inbox';
    initModalState(null);
    expect(mocks.state.modalSelectedArea).toBeNull();
    expect(mocks.state.modalSelectedCategory).toBeNull();
    expect(mocks.state.modalSelectedStatus).toBe('inbox');
    expect(mocks.state.modalSelectedToday).toBe(false);
    expect(mocks.state.modalSelectedFlagged).toBe(false);
    expect(mocks.state.modalSelectedTags).toEqual([]);
    expect(mocks.state.modalSelectedPeople).toEqual([]);
  });

  it('copies labels array from editing task (not reference)', () => {
    const originalLabels = ['label_1', 'label_2'];
    const task = makeTask({ labels: originalLabels });
    initModalState(task);
    mocks.state.modalSelectedTags.push('label_3');
    expect(originalLabels).toEqual(['label_1', 'label_2']);
  });

  it('uses labelIds from newTaskContext when available', () => {
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: ['label_1', 'label_2'], personId: null, status: 'inbox' };
    initModalState(null);
    expect(mocks.state.modalSelectedTags).toEqual(['label_1', 'label_2']);
  });

  it('sets modalIsNote true when in notes perspective', () => {
    mocks.state.activePerspective = 'notes';
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    initModalState(null);
    expect(mocks.state.modalIsNote).toBe(true);
  });

  it('handles editing task with no repeat', () => {
    const task = makeTask({ repeat: null });
    initModalState(task);
    expect(mocks.state.modalRepeatEnabled).toBeFalsy();
  });

  it('handles editing task with repeat type "none"', () => {
    const task = makeTask({ repeat: { type: 'none' } });
    initModalState(task);
    expect(mocks.state.modalRepeatEnabled).toBeFalsy();
  });
});

// --------------------------------------------------------------------------
// setModalType
// --------------------------------------------------------------------------
describe('setModalType', () => {
  it('sets modalIsNote to true for note type', () => {
    setModalType(true);
    expect(mocks.state.modalIsNote).toBe(true);
  });

  it('sets modalIsNote to false for task type', () => {
    mocks.state.modalIsNote = true;
    setModalType(false);
    expect(mocks.state.modalIsNote).toBe(false);
  });

  it('updates title placeholder when element exists', () => {
    document.body.innerHTML = '<input id="task-title" placeholder="">';
    setModalType(true);
    const input = document.getElementById('task-title');
    expect(input.placeholder).toBe('What do you want to capture?');
  });

  it('updates title placeholder for task type', () => {
    document.body.innerHTML = '<input id="task-title" placeholder="">';
    setModalType(false);
    const input = document.getElementById('task-title');
    expect(input.placeholder).toBe('What needs to be done?');
  });
});

// --------------------------------------------------------------------------
// setModalStatus
// --------------------------------------------------------------------------
describe('setModalStatus', () => {
  it('sets status to inbox', () => {
    setModalStatus('inbox');
    expect(mocks.state.modalSelectedStatus).toBe('inbox');
    expect(mocks.state.modalSelectedToday).toBe(false);
  });

  it('sets status to anytime', () => {
    setModalStatus('anytime');
    expect(mocks.state.modalSelectedStatus).toBe('anytime');
  });

  it('sets status to someday and clears today', () => {
    mocks.state.modalSelectedToday = true;
    setModalStatus('someday');
    expect(mocks.state.modalSelectedStatus).toBe('someday');
    expect(mocks.state.modalSelectedToday).toBe(false);
  });

  it('toggles today flag on', () => {
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedStatus = 'anytime';
    setModalStatus('today');
    expect(mocks.state.modalSelectedToday).toBe(true);
  });

  it('toggles today flag off', () => {
    mocks.state.modalSelectedToday = true;
    setModalStatus('today');
    expect(mocks.state.modalSelectedToday).toBe(false);
  });

  it('promotes inbox to anytime when today is toggled on', () => {
    mocks.state.modalSelectedStatus = 'inbox';
    mocks.state.modalSelectedToday = false;
    setModalStatus('today');
    expect(mocks.state.modalSelectedStatus).toBe('anytime');
    expect(mocks.state.modalSelectedToday).toBe(true);
  });

  it('setting inbox clears today flag', () => {
    mocks.state.modalSelectedToday = true;
    setModalStatus('inbox');
    expect(mocks.state.modalSelectedToday).toBe(false);
  });
});

// --------------------------------------------------------------------------
// toggleModalFlagged
// --------------------------------------------------------------------------
describe('toggleModalFlagged', () => {
  it('toggles flagged from false to true', () => {
    mocks.state.modalSelectedFlagged = false;
    toggleModalFlagged();
    expect(mocks.state.modalSelectedFlagged).toBe(true);
  });

  it('toggles flagged from true to false', () => {
    mocks.state.modalSelectedFlagged = true;
    toggleModalFlagged();
    expect(mocks.state.modalSelectedFlagged).toBe(false);
  });
});

// --------------------------------------------------------------------------
// updateDateDisplay
// --------------------------------------------------------------------------
describe('updateDateDisplay', () => {
  it('updates defer display with formatted date', () => {
    document.body.innerHTML = `
      <input id="task-defer" value="2026-02-01">
      <span id="defer-display">None</span>
      <button id="defer-clear-btn" class="hidden"></button>
    `;
    mocks.formatSmartDateMock.mockReturnValueOnce('Feb 1');
    updateDateDisplay('defer');
    expect(document.getElementById('defer-display').textContent).toBe('Feb 1');
    expect(document.getElementById('defer-clear-btn').classList.contains('hidden')).toBe(false);
  });

  it('updates due display with formatted date', () => {
    document.body.innerHTML = `
      <input id="task-due" value="2026-03-15">
      <span id="due-display">None</span>
      <button id="due-clear-btn" class="hidden"></button>
    `;
    mocks.formatSmartDateMock.mockReturnValueOnce('Mar 15');
    updateDateDisplay('due');
    expect(document.getElementById('due-display').textContent).toBe('Mar 15');
  });

  it('shows None when date is empty', () => {
    document.body.innerHTML = `
      <input id="task-defer" value="">
      <span id="defer-display">Something</span>
      <button id="defer-clear-btn"></button>
    `;
    updateDateDisplay('defer');
    expect(document.getElementById('defer-display').textContent).toBe('None');
    expect(document.getElementById('defer-clear-btn').classList.contains('hidden')).toBe(true);
  });

  it('handles missing DOM elements gracefully', () => {
    document.body.innerHTML = '';
    // Should not throw
    expect(() => updateDateDisplay('defer')).not.toThrow();
  });
});

// --------------------------------------------------------------------------
// clearDateField
// --------------------------------------------------------------------------
describe('clearDateField', () => {
  it('clears defer date field', () => {
    document.body.innerHTML = `
      <input id="task-defer" value="2026-02-01">
      <span id="defer-display">Feb 1</span>
      <button id="defer-clear-btn"></button>
    `;
    clearDateField('defer');
    expect(document.getElementById('task-defer').value).toBe('');
    expect(document.getElementById('defer-display').textContent).toBe('None');
    expect(document.getElementById('defer-clear-btn').classList.contains('hidden')).toBe(true);
  });

  it('clears due date field', () => {
    document.body.innerHTML = `
      <input id="task-due" value="2026-03-15">
      <span id="due-display">Mar 15</span>
      <button id="due-clear-btn"></button>
    `;
    clearDateField('due');
    expect(document.getElementById('task-due').value).toBe('');
    expect(document.getElementById('due-display').textContent).toBe('None');
  });
});

// --------------------------------------------------------------------------
// setQuickDate
// --------------------------------------------------------------------------
describe('setQuickDate', () => {
  it('sets defer date to today (offset 0)', () => {
    document.body.innerHTML = `
      <input id="task-defer" value="">
      <span id="defer-display">None</span>
      <button id="defer-clear-btn" class="hidden"></button>
    `;
    setQuickDate('defer', 0);
    const input = document.getElementById('task-defer');
    expect(input.value).toBeTruthy();
    // Should be today's date in YYYY-MM-DD format
    const today = new Date();
    const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(input.value).toBe(expected);
  });

  it('sets due date to tomorrow (offset 1)', () => {
    document.body.innerHTML = `
      <input id="task-due" value="">
      <span id="due-display">None</span>
      <button id="due-clear-btn" class="hidden"></button>
    `;
    setQuickDate('due', 1);
    const input = document.getElementById('task-due');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expected = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    expect(input.value).toBe(expected);
  });

  it('clears date when offset is null', () => {
    document.body.innerHTML = `
      <input id="task-defer" value="2026-02-01">
      <span id="defer-display">Feb 1</span>
      <button id="defer-clear-btn"></button>
    `;
    setQuickDate('defer', null);
    expect(document.getElementById('task-defer').value).toBe('');
    expect(document.getElementById('defer-display').textContent).toBe('None');
  });

  it('shows clear button when date is set', () => {
    document.body.innerHTML = `
      <input id="task-due" value="">
      <span id="due-display">None</span>
      <button id="due-clear-btn" class="hidden"></button>
    `;
    setQuickDate('due', 7);
    expect(document.getElementById('due-clear-btn').classList.contains('hidden')).toBe(false);
  });
});

// --------------------------------------------------------------------------
// openDatePicker
// --------------------------------------------------------------------------
describe('openDatePicker', () => {
  it('calls showPicker on defer input when available', () => {
    const mockShowPicker = vi.fn();
    document.body.innerHTML = '<input id="task-defer">';
    document.getElementById('task-defer').showPicker = mockShowPicker;
    openDatePicker('defer');
    expect(mockShowPicker).toHaveBeenCalled();
  });

  it('calls showPicker on due input', () => {
    const mockShowPicker = vi.fn();
    document.body.innerHTML = '<input id="task-due">';
    document.getElementById('task-due').showPicker = mockShowPicker;
    openDatePicker('due');
    expect(mockShowPicker).toHaveBeenCalled();
  });

  it('does not throw when showPicker is not available', () => {
    document.body.innerHTML = '<input id="task-defer">';
    expect(() => openDatePicker('defer')).not.toThrow();
  });
});

// --------------------------------------------------------------------------
// selectArea / selectCategory
// --------------------------------------------------------------------------
describe('selectArea', () => {
  it('sets modalSelectedArea to area id', () => {
    const area = { id: 'area_1', name: 'Work', color: '#4A90A4' };
    document.body.innerHTML = '<div id="area-display"></div><div id="category-autocomplete-container"></div>';
    selectArea(area);
    expect(mocks.state.modalSelectedArea).toBe('area_1');
  });

  it('clears modalSelectedArea when null', () => {
    mocks.state.modalSelectedArea = 'area_1';
    document.body.innerHTML = '<div id="area-display"></div><div id="category-autocomplete-container"></div>';
    selectArea(null);
    expect(mocks.state.modalSelectedArea).toBeNull();
  });

  it('updates display element with area name', () => {
    document.body.innerHTML = '<div id="area-display"></div><div id="category-autocomplete-container"></div>';
    selectArea({ id: 'area_1', name: 'Work', color: '#4A90A4' });
    expect(document.getElementById('area-display').innerHTML).toContain('Work');
  });

  it('shows "No area selected" when cleared', () => {
    document.body.innerHTML = '<div id="area-display"></div><div id="category-autocomplete-container"></div>';
    selectArea(null);
    expect(document.getElementById('area-display').innerHTML).toContain('No area selected');
  });
});

describe('selectCategory', () => {
  it('sets modalSelectedCategory to category id', () => {
    document.body.innerHTML = '<div id="category-display"></div>';
    selectCategory({ id: 'cat_1', name: 'Development', color: '#6B8E5A' });
    expect(mocks.state.modalSelectedCategory).toBe('cat_1');
  });

  it('clears modalSelectedCategory when null', () => {
    mocks.state.modalSelectedCategory = 'cat_1';
    document.body.innerHTML = '<div id="category-display"></div>';
    selectCategory(null);
    expect(mocks.state.modalSelectedCategory).toBeNull();
  });

  it('updates display element with category name', () => {
    document.body.innerHTML = '<div id="category-display"></div>';
    selectCategory({ id: 'cat_1', name: 'Development', color: '#6B8E5A' });
    expect(document.getElementById('category-display').innerHTML).toContain('Development');
  });
});

// --------------------------------------------------------------------------
// addTag / removeTag
// --------------------------------------------------------------------------
describe('addTag', () => {
  it('adds tag id to modalSelectedTags', () => {
    mocks.state.modalSelectedTags = [];
    document.body.innerHTML = '<div id="tags-input-container"></div>';
    addTag({ id: 'label_1' });
    expect(mocks.state.modalSelectedTags).toContain('label_1');
  });

  it('does not add duplicate tag', () => {
    mocks.state.modalSelectedTags = ['label_1'];
    document.body.innerHTML = '<div id="tags-input-container"></div>';
    addTag({ id: 'label_1' });
    expect(mocks.state.modalSelectedTags).toEqual(['label_1']);
  });
});

describe('removeTag', () => {
  it('removes tag id from modalSelectedTags', () => {
    mocks.state.modalSelectedTags = ['label_1', 'label_2'];
    document.body.innerHTML = '<div id="tags-input-container"></div>';
    removeTag('label_1');
    expect(mocks.state.modalSelectedTags).toEqual(['label_2']);
  });

  it('does nothing if tag not in list', () => {
    mocks.state.modalSelectedTags = ['label_1'];
    document.body.innerHTML = '<div id="tags-input-container"></div>';
    removeTag('label_nonexistent');
    expect(mocks.state.modalSelectedTags).toEqual(['label_1']);
  });
});

// --------------------------------------------------------------------------
// addPerson / removePerson
// --------------------------------------------------------------------------
describe('addPerson', () => {
  it('adds person id to modalSelectedPeople', () => {
    mocks.state.modalSelectedPeople = [];
    document.body.innerHTML = '<div id="people-input-container"></div>';
    addPerson({ id: 'person_1' });
    expect(mocks.state.modalSelectedPeople).toContain('person_1');
  });

  it('does not add duplicate person', () => {
    mocks.state.modalSelectedPeople = ['person_1'];
    document.body.innerHTML = '<div id="people-input-container"></div>';
    addPerson({ id: 'person_1' });
    expect(mocks.state.modalSelectedPeople).toEqual(['person_1']);
  });
});

describe('removePerson', () => {
  it('removes person id from modalSelectedPeople', () => {
    mocks.state.modalSelectedPeople = ['person_1', 'person_2'];
    document.body.innerHTML = '<div id="people-input-container"></div>';
    removePerson('person_1');
    expect(mocks.state.modalSelectedPeople).toEqual(['person_2']);
  });
});

// --------------------------------------------------------------------------
// toggleRepeat
// --------------------------------------------------------------------------
describe('toggleRepeat', () => {
  it('toggles repeat from false to true', () => {
    mocks.state.modalRepeatEnabled = false;
    toggleRepeat();
    expect(mocks.state.modalRepeatEnabled).toBe(true);
  });

  it('toggles repeat from true to false', () => {
    mocks.state.modalRepeatEnabled = true;
    toggleRepeat();
    expect(mocks.state.modalRepeatEnabled).toBe(false);
  });
});

// --------------------------------------------------------------------------
// openNewTaskModal
// --------------------------------------------------------------------------
describe('openNewTaskModal', () => {
  it('sets showTaskModal to true and editingTaskId to null', () => {
    openNewTaskModal();
    expect(mocks.state.showTaskModal).toBe(true);
    expect(mocks.state.editingTaskId).toBeNull();
  });

  it('sets inbox context by default', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'inbox';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.status).toBe('inbox');
  });

  it('sets area context when viewing an area', () => {
    mocks.state.activeFilterType = 'area';
    mocks.state.activeAreaFilter = 'area_1';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.areaId).toBe('area_1');
  });

  it('sets label context when viewing a label', () => {
    mocks.state.activeFilterType = 'label';
    mocks.state.activeLabelFilter = 'label_1';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.labelId).toBe('label_1');
  });

  it('sets person context when viewing a person', () => {
    mocks.state.activeFilterType = 'person';
    mocks.state.activePersonFilter = 'person_1';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.personId).toBe('person_1');
  });

  it('sets subcategory context', () => {
    mocks.state.activeFilterType = 'subcategory';
    mocks.state.activeCategoryFilter = 'cat_1';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.categoryId).toBe('cat_1');
    expect(mocks.state.newTaskContext.areaId).toBe('area_1');
  });

  it('sets today+anytime for today perspective', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'today';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.today).toBe(true);
    expect(mocks.state.newTaskContext.status).toBe('anytime');
  });

  it('sets flagged for flagged perspective', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'flagged';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.flagged).toBe(true);
  });

  it('sets someday status for someday perspective', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'someday';
    openNewTaskModal();
    expect(mocks.state.newTaskContext.status).toBe('someday');
  });

  it('applies custom perspective filter rules', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'cp_custom';
    mocks.state.customPerspectives = [{
      id: 'cp_custom',
      name: 'Custom',
      filter: { status: 'today', categoryId: 'area_1', labelIds: ['label_1'], statusRule: 'flagged' },
    }];
    openNewTaskModal();
    expect(mocks.state.newTaskContext.areaId).toBe('area_1');
    expect(mocks.state.newTaskContext.labelIds).toEqual(['label_1']);
    expect(mocks.state.newTaskContext.today).toBe(true);
    expect(mocks.state.newTaskContext.flagged).toBe(true);
  });

  it('calls window.render', () => {
    openNewTaskModal();
    expect(window.render).toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// quickAddTask
// --------------------------------------------------------------------------
describe('quickAddTask', () => {
  it('creates task with title from input', () => {
    const input = document.createElement('input');
    input.value = 'New quick task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('New quick task', expect.objectContaining({ status: 'inbox' }));
    expect(input.value).toBe('');
  });

  it('does nothing for empty input', () => {
    const input = document.createElement('input');
    input.value = '   ';
    quickAddTask(input);
    expect(mocks.createTaskMock).not.toHaveBeenCalled();
  });

  it('sets area context when viewing area', () => {
    mocks.state.activeFilterType = 'area';
    mocks.state.activeAreaFilter = 'area_1';
    const input = document.createElement('input');
    input.value = 'Area task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Area task', expect.objectContaining({ areaId: 'area_1' }));
  });

  it('sets label context when viewing label', () => {
    mocks.state.activeFilterType = 'label';
    mocks.state.activeLabelFilter = 'label_1';
    const input = document.createElement('input');
    input.value = 'Label task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Label task', expect.objectContaining({ labels: ['label_1'] }));
  });

  it('sets person context when viewing person', () => {
    mocks.state.activeFilterType = 'person';
    mocks.state.activePersonFilter = 'person_1';
    const input = document.createElement('input');
    input.value = 'Person task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Person task', expect.objectContaining({ people: ['person_1'] }));
  });

  it('creates note when quickAddIsNote is true', () => {
    mocks.state.quickAddIsNote = true;
    // Use area filter so perspective status override doesn't apply
    mocks.state.activeFilterType = 'area';
    mocks.state.activeAreaFilter = 'area_1';
    const input = document.createElement('input');
    input.value = 'Quick note';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Quick note', expect.objectContaining({ isNote: true }));
    // The status should be 'anytime' since quickAddIsNote sets it
    const callArgs = mocks.createTaskMock.mock.calls[0][1];
    expect(callArgs.status).toBe('anytime');
  });

  it('creates note in notes perspective', () => {
    mocks.state.activePerspective = 'notes';
    const input = document.createElement('input');
    input.value = 'Notes perspective note';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Notes perspective note', expect.objectContaining({ isNote: true }));
  });

  it('merges inline autocomplete metadata', () => {
    mocks.state.inlineAutocompleteMeta.set('quick-add-input', {
      areaId: 'area_1',
      labels: ['label_1'],
      people: ['person_1'],
      deferDate: '2026-02-01',
      dueDate: '2026-03-01',
    });
    const input = document.createElement('input');
    input.id = 'quick-add-input';
    input.value = 'Meta task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Meta task', expect.objectContaining({
      areaId: 'area_1',
      deferDate: '2026-02-01',
      dueDate: '2026-03-01',
    }));
  });

  it('resets quickAddIsNote after creating task', () => {
    mocks.state.quickAddIsNote = true;
    const input = document.createElement('input');
    input.value = 'Reset note flag';
    quickAddTask(input);
    expect(mocks.state.quickAddIsNote).toBe(false);
  });

  it('cleans up inline autocomplete after creating', () => {
    const input = document.createElement('input');
    input.value = 'Cleanup task';
    quickAddTask(input);
    expect(mocks.cleanupInlineAutocompleteMock).toHaveBeenCalledWith('quick-add-input');
  });

  it('calls window.render after creating task', () => {
    const input = document.createElement('input');
    input.value = 'Render task';
    quickAddTask(input);
    expect(window.render).toHaveBeenCalled();
  });

  it('sets today flag for today perspective', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'today';
    const input = document.createElement('input');
    input.value = 'Today task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Today task', expect.objectContaining({ today: true, status: 'anytime' }));
  });

  it('sets flagged for flagged perspective', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'flagged';
    const input = document.createElement('input');
    input.value = 'Flagged task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Flagged task', expect.objectContaining({ flagged: true }));
  });

  it('applies custom perspective rules', () => {
    mocks.state.activeFilterType = 'perspective';
    mocks.state.activePerspective = 'cp_1';
    mocks.state.customPerspectives = [{
      id: 'cp_1',
      name: 'Sprint',
      filter: { status: 'today', categoryId: 'area_1', statusRule: 'flagged' },
    }];
    const input = document.createElement('input');
    input.value = 'Sprint task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Sprint task', expect.objectContaining({
      today: true,
      status: 'anytime',
      areaId: 'area_1',
      flagged: true,
    }));
  });

  it('sets subcategory context', () => {
    mocks.state.activeFilterType = 'subcategory';
    mocks.state.activeCategoryFilter = 'cat_1';
    const input = document.createElement('input');
    input.value = 'Subcat task';
    quickAddTask(input);
    expect(mocks.createTaskMock).toHaveBeenCalledWith('Subcat task', expect.objectContaining({
      areaId: 'area_1',
      categoryId: 'cat_1',
    }));
  });
});

// --------------------------------------------------------------------------
// handleQuickAddKeydown
// --------------------------------------------------------------------------
describe('handleQuickAddKeydown', () => {
  it('calls quickAddTask on Enter', () => {
    const input = document.createElement('input');
    input.value = 'Enter task';
    const event = { key: 'Enter', preventDefault: vi.fn(), _inlineAcHandled: false };
    handleQuickAddKeydown(event, input);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mocks.createTaskMock).toHaveBeenCalled();
  });

  it('does nothing if _inlineAcHandled is true', () => {
    const input = document.createElement('input');
    input.value = 'Handled';
    const event = { key: 'Enter', preventDefault: vi.fn(), _inlineAcHandled: true };
    handleQuickAddKeydown(event, input);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(mocks.createTaskMock).not.toHaveBeenCalled();
  });

  it('does nothing on non-Enter key', () => {
    const input = document.createElement('input');
    input.value = 'Tab key';
    const event = { key: 'Tab', preventDefault: vi.fn(), _inlineAcHandled: false };
    handleQuickAddKeydown(event, input);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// closeTaskModal
// --------------------------------------------------------------------------
describe('closeTaskModal', () => {
  it('sets showTaskModal to false', () => {
    mocks.state.showTaskModal = true;
    closeTaskModal();
    expect(mocks.state.showTaskModal).toBe(false);
  });

  it('clears editingTaskId', () => {
    mocks.state.editingTaskId = 'task_1';
    closeTaskModal();
    expect(mocks.state.editingTaskId).toBeNull();
  });

  it('resets modalStateInitialized', () => {
    mocks.state.modalStateInitialized = true;
    closeTaskModal();
    expect(mocks.state.modalStateInitialized).toBe(false);
  });

  it('cleans up inline autocomplete for title', () => {
    closeTaskModal();
    expect(mocks.cleanupInlineAutocompleteMock).toHaveBeenCalledWith('task-title');
  });

  it('calls window.render', () => {
    closeTaskModal();
    expect(window.render).toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// saveTaskFromModal
// --------------------------------------------------------------------------
describe('saveTaskFromModal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="task-title" value="My Task">
      <textarea id="task-notes">Some notes</textarea>
      <input id="task-defer" value="2026-02-01">
      <input id="task-due" value="2026-03-01">
    `;
  });

  it('creates new task when editingTaskId is null', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalSelectedStatus = 'anytime';
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;
    mocks.state.modalSelectedArea = 'area_1';
    mocks.state.modalSelectedCategory = 'cat_1';
    mocks.state.modalSelectedTags = ['label_1'];
    mocks.state.modalSelectedPeople = ['person_1'];
    mocks.state.modalIsNote = false;
    mocks.state.modalRepeatEnabled = false;

    saveTaskFromModal();

    expect(mocks.createTaskMock).toHaveBeenCalledWith('My Task', expect.objectContaining({
      title: 'My Task',
      notes: 'Some notes',
      status: 'anytime',
      areaId: 'area_1',
      categoryId: 'cat_1',
      labels: ['label_1'],
      people: ['person_1'],
    }));
  });

  it('updates existing task when editingTaskId is set', () => {
    mocks.state.editingTaskId = 'task_1';
    mocks.state.tasksData = [makeTask()];
    mocks.state.modalSelectedStatus = 'anytime';
    mocks.state.modalSelectedArea = null;
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalIsNote = false;
    mocks.state.modalRepeatEnabled = false;
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;

    saveTaskFromModal();

    expect(mocks.updateTaskMock).toHaveBeenCalledWith('task_1', expect.objectContaining({
      title: 'My Task',
    }));
  });

  it('alerts when title is empty', () => {
    document.getElementById('task-title').value = '';
    window.alert = vi.fn();
    saveTaskFromModal();
    expect(window.alert).toHaveBeenCalledWith('Please enter a title');
    expect(mocks.createTaskMock).not.toHaveBeenCalled();
  });

  it('saves repeat settings when enabled', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalRepeatEnabled = true;
    mocks.state.modalSelectedStatus = 'anytime';
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;
    mocks.state.modalSelectedArea = null;
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalIsNote = false;

    document.body.innerHTML += `
      <select id="task-repeat-type"><option value="weekly" selected>weeks</option></select>
      <input id="task-repeat-interval" value="2">
      <input type="radio" name="repeat-from" value="due" checked>
    `;

    saveTaskFromModal();
    expect(mocks.createTaskMock).toHaveBeenCalledWith('My Task', expect.objectContaining({
      repeat: { type: 'weekly', interval: 2, from: 'due' },
    }));
  });

  it('promotes inbox to anytime when area is assigned (non-note)', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalSelectedStatus = 'inbox';
    mocks.state.modalSelectedArea = 'area_1';
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalIsNote = false;
    mocks.state.modalRepeatEnabled = false;
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;

    saveTaskFromModal();
    expect(mocks.createTaskMock).toHaveBeenCalledWith('My Task', expect.objectContaining({
      status: 'anytime',
    }));
  });

  it('promotes inbox to anytime when today is set (non-note)', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalSelectedStatus = 'inbox';
    mocks.state.modalSelectedToday = true;
    mocks.state.modalSelectedArea = null;
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalIsNote = false;
    mocks.state.modalRepeatEnabled = false;
    mocks.state.modalSelectedFlagged = false;

    saveTaskFromModal();
    expect(mocks.createTaskMock).toHaveBeenCalledWith('My Task', expect.objectContaining({
      status: 'anytime',
      today: true,
    }));
  });

  it('does not promote inbox for notes', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalSelectedStatus = 'inbox';
    mocks.state.modalSelectedArea = 'area_1';
    mocks.state.modalIsNote = true;
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalRepeatEnabled = false;
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;

    saveTaskFromModal();
    expect(mocks.createTaskMock).toHaveBeenCalledWith('My Task', expect.objectContaining({
      status: 'inbox',
      isNote: true,
    }));
  });

  it('cleans up and closes modal after save', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalSelectedStatus = 'inbox';
    mocks.state.modalSelectedArea = null;
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalIsNote = false;
    mocks.state.modalRepeatEnabled = false;
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;

    saveTaskFromModal();
    expect(mocks.state.showTaskModal).toBe(false);
    expect(mocks.state.editingTaskId).toBeNull();
    expect(mocks.state.modalStateInitialized).toBe(false);
    expect(mocks.cleanupInlineAutocompleteMock).toHaveBeenCalledWith('task-title');
    expect(window.render).toHaveBeenCalled();
  });

  it('saves isNote flag correctly', () => {
    mocks.state.editingTaskId = null;
    mocks.state.modalIsNote = true;
    mocks.state.modalSelectedStatus = 'anytime';
    mocks.state.modalSelectedToday = false;
    mocks.state.modalSelectedFlagged = false;
    mocks.state.modalSelectedArea = null;
    mocks.state.modalSelectedCategory = null;
    mocks.state.modalSelectedTags = [];
    mocks.state.modalSelectedPeople = [];
    mocks.state.modalRepeatEnabled = false;

    saveTaskFromModal();
    expect(mocks.createTaskMock).toHaveBeenCalledWith('My Task', expect.objectContaining({
      isNote: true,
    }));
  });
});

// --------------------------------------------------------------------------
// renderTaskModalHtml
// --------------------------------------------------------------------------
describe('renderTaskModalHtml', () => {
  it('returns empty string when modal is not shown', () => {
    mocks.state.showTaskModal = false;
    const html = renderTaskModalHtml();
    expect(html).toBe('');
  });

  it('renders modal HTML when showTaskModal is true (new task)', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('modal-overlay');
    expect(html).toContain('New');
    expect(html).toContain('Create');
  });

  it('renders Edit title when editing existing task', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = 'task_1';
    mocks.state.modalStateInitialized = false;
    mocks.state.tasksData = [makeTask({ id: 'task_1', title: 'Existing Task' })];
    const html = renderTaskModalHtml();
    expect(html).toContain('Edit');
    expect(html).toContain('Save Changes');
  });

  it('pre-fills title and notes for editing task', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = 'task_1';
    mocks.state.modalStateInitialized = false;
    mocks.state.tasksData = [makeTask({ id: 'task_1', title: 'Edit Title', notes: 'Edit Notes' })];
    const html = renderTaskModalHtml();
    expect(html).toContain('Edit Title');
    expect(html).toContain('Edit Notes');
  });

  it('renders type switcher (Task/Note)', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('Task');
    expect(html).toContain('Note');
    expect(html).toContain('type-option');
  });

  it('renders status pills for task mode', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.modalIsNote = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('status-pill');
    expect(html).toContain('Inbox');
    expect(html).toContain('Today');
    expect(html).toContain('Anytime');
    expect(html).toContain('Someday');
    expect(html).toContain('Flag');
  });

  it('hides status pills for note mode', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = true; // Already initialized so modalIsNote stays
    mocks.state.modalIsNote = true;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).not.toContain('status-pill');
  });

  it('renders area and category autocomplete containers', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('area-autocomplete-container');
    expect(html).toContain('category-autocomplete-container');
  });

  it('renders tags and people containers', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('tags-input-container');
    expect(html).toContain('people-input-container');
  });

  it('renders date fields for task mode', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.modalIsNote = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('task-defer');
    expect(html).toContain('task-due');
    expect(html).toContain('Defer Until');
    expect(html).toContain('Due');
  });

  it('hides date fields for note mode', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = true; // Already initialized so modalIsNote stays
    mocks.state.modalIsNote = true;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).not.toContain('task-defer');
    expect(html).not.toContain('task-due');
  });

  it('renders repeat section for task mode', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.modalIsNote = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('repeat-toggle');
    expect(html).toContain('Does not repeat');
  });

  it('hides repeat section for note mode', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = true; // Already initialized so modalIsNote stays
    mocks.state.modalIsNote = true;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).not.toContain('repeat-toggle');
  });

  it('renders Cancel and Create buttons', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('Cancel');
    expect(html).toContain('Create');
  });

  it('initializes modal state on first render', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: 'area_1', labelId: null, labelIds: null, personId: null, status: 'inbox' };
    renderTaskModalHtml();
    expect(mocks.state.modalStateInitialized).toBe(true);
    expect(mocks.state.modalSelectedArea).toBe('area_1');
  });

  it('does not re-initialize modal state if already initialized', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = true;
    mocks.state.modalSelectedArea = 'area_1';
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    renderTaskModalHtml();
    // Should keep the existing value, not reset to null
    expect(mocks.state.modalSelectedArea).toBe('area_1');
  });

  it('renders quick date pills', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.modalIsNote = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('Tomorrow');
    expect(html).toContain('Next Week');
    expect(html).toContain('Clear');
  });

  it('renders meeting notes link for task with meetingEventKey', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = 'task_meeting';
    mocks.state.modalStateInitialized = false;
    mocks.state.tasksData = [makeTask({ id: 'task_meeting', title: 'Meeting task', meetingEventKey: 'evt_123' })];
    const html = renderTaskModalHtml();
    expect(html).toContain('Back To Meeting Notes');
    expect(html).toContain('evt_123');
  });

  it('renders inline autocomplete hint chips', () => {
    mocks.state.showTaskModal = true;
    mocks.state.editingTaskId = null;
    mocks.state.modalStateInitialized = false;
    mocks.state.newTaskContext = { areaId: null, labelId: null, labelIds: null, personId: null, status: 'inbox' };
    const html = renderTaskModalHtml();
    expect(html).toContain('# Area');
    expect(html).toContain('@ Tag');
    expect(html).toContain('&amp; Person');
    expect(html).toContain('! Defer');
  });
});

// --------------------------------------------------------------------------
// startInlineEdit
// --------------------------------------------------------------------------
describe('startInlineEdit', () => {
  it('sets inlineEditingTaskId', () => {
    startInlineEdit('task_1');
    expect(mocks.state.inlineEditingTaskId).toBe('task_1');
  });

  it('calls window.render', () => {
    startInlineEdit('task_1');
    expect(window.render).toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// saveInlineEdit
// --------------------------------------------------------------------------
describe('saveInlineEdit', () => {
  it('updates task title from input', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="Updated Title">';
    saveInlineEdit('task_1');
    expect(mocks.updateTaskMock).toHaveBeenCalledWith('task_1', expect.objectContaining({ title: 'Updated Title' }));
  });

  it('deletes task when title is empty', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="">';
    saveInlineEdit('task_1');
    expect(mocks.deleteTaskMock).toHaveBeenCalledWith('task_1');
  });

  it('merges inline autocomplete metadata', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="Updated">';
    mocks.state.inlineAutocompleteMeta.set('inline-edit-input', {
      areaId: 'area_1',
      labels: ['label_1'],
      people: ['person_1'],
    });
    saveInlineEdit('task_1');
    expect(mocks.updateTaskMock).toHaveBeenCalledWith('task_1', expect.objectContaining({
      title: 'Updated',
      areaId: 'area_1',
      labels: ['label_1'],
      people: ['person_1'],
    }));
  });

  it('cleans up inline autocomplete', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="Done">';
    saveInlineEdit('task_1');
    expect(mocks.cleanupInlineAutocompleteMock).toHaveBeenCalledWith('inline-edit-input');
  });

  it('clears inlineEditingTaskId', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="Done">';
    mocks.state.inlineEditingTaskId = 'task_1';
    saveInlineEdit('task_1');
    expect(mocks.state.inlineEditingTaskId).toBeNull();
  });

  it('calls window.render', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="Done">';
    saveInlineEdit('task_1');
    expect(window.render).toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// cancelInlineEdit
// --------------------------------------------------------------------------
describe('cancelInlineEdit', () => {
  it('clears inlineEditingTaskId', () => {
    mocks.state.inlineEditingTaskId = 'task_1';
    cancelInlineEdit();
    expect(mocks.state.inlineEditingTaskId).toBeNull();
  });

  it('deletes task if it has no title', () => {
    mocks.state.inlineEditingTaskId = 'task_1';
    mocks.state.tasksData = [makeTask({ id: 'task_1', title: '' })];
    cancelInlineEdit();
    expect(mocks.deleteTaskMock).toHaveBeenCalledWith('task_1');
  });

  it('does not delete task if it has a title', () => {
    mocks.state.inlineEditingTaskId = 'task_1';
    mocks.state.tasksData = [makeTask({ id: 'task_1', title: 'Existing' })];
    cancelInlineEdit();
    expect(mocks.deleteTaskMock).not.toHaveBeenCalled();
  });

  it('cleans up inline autocomplete', () => {
    mocks.state.inlineEditingTaskId = 'task_1';
    mocks.state.tasksData = [makeTask({ id: 'task_1', title: 'T' })];
    cancelInlineEdit();
    expect(mocks.cleanupInlineAutocompleteMock).toHaveBeenCalledWith('inline-edit-input');
  });

  it('calls window.render', () => {
    cancelInlineEdit();
    expect(window.render).toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// handleInlineEditKeydown
// --------------------------------------------------------------------------
describe('handleInlineEditKeydown', () => {
  it('saves on Enter', () => {
    document.body.innerHTML = '<input id="inline-edit-input" value="Save me">';
    const event = { key: 'Enter', preventDefault: vi.fn(), _inlineAcHandled: false };
    handleInlineEditKeydown(event, 'task_1');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mocks.updateTaskMock).toHaveBeenCalled();
  });

  it('cancels on Escape', () => {
    mocks.state.inlineEditingTaskId = 'task_1';
    mocks.state.tasksData = [makeTask({ id: 'task_1', title: 'T' })];
    const event = { key: 'Escape', preventDefault: vi.fn(), _inlineAcHandled: false };
    handleInlineEditKeydown(event, 'task_1');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mocks.state.inlineEditingTaskId).toBeNull();
  });

  it('does nothing when _inlineAcHandled is true', () => {
    const event = { key: 'Enter', preventDefault: vi.fn(), _inlineAcHandled: true };
    handleInlineEditKeydown(event, 'task_1');
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('does nothing on other keys', () => {
    const event = { key: 'a', preventDefault: vi.fn(), _inlineAcHandled: false };
    handleInlineEditKeydown(event, 'task_1');
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

// --------------------------------------------------------------------------
// toggleInlineTagInput
// --------------------------------------------------------------------------
describe('toggleInlineTagInput', () => {
  it('toggles showInlineTagInput from false to true', () => {
    mocks.state.showInlineTagInput = false;
    document.body.innerHTML = '<div id="inline-tag-form"></div>';
    toggleInlineTagInput();
    expect(mocks.state.showInlineTagInput).toBe(true);
  });

  it('toggles showInlineTagInput from true to false', () => {
    mocks.state.showInlineTagInput = true;
    document.body.innerHTML = '<div id="inline-tag-form"></div>';
    toggleInlineTagInput();
    expect(mocks.state.showInlineTagInput).toBe(false);
  });

  it('renders inline form when opening', () => {
    mocks.state.showInlineTagInput = false;
    document.body.innerHTML = '<div id="inline-tag-form"></div>';
    toggleInlineTagInput();
    const form = document.getElementById('inline-tag-form');
    expect(form.innerHTML).toContain('inline-tag-name');
    expect(form.innerHTML).toContain('inline-tag-color');
  });

  it('clears inline form when closing', () => {
    mocks.state.showInlineTagInput = true;
    document.body.innerHTML = '<div id="inline-tag-form"><p>existing</p></div>';
    toggleInlineTagInput();
    const form = document.getElementById('inline-tag-form');
    expect(form.innerHTML).toBe('');
  });
});

// --------------------------------------------------------------------------
// toggleInlinePersonInput
// --------------------------------------------------------------------------
describe('toggleInlinePersonInput', () => {
  it('toggles showInlinePersonInput from false to true', () => {
    mocks.state.showInlinePersonInput = false;
    document.body.innerHTML = '<div id="inline-person-form"></div>';
    toggleInlinePersonInput();
    expect(mocks.state.showInlinePersonInput).toBe(true);
  });

  it('renders inline person form when opening', () => {
    mocks.state.showInlinePersonInput = false;
    document.body.innerHTML = '<div id="inline-person-form"></div>';
    toggleInlinePersonInput();
    const form = document.getElementById('inline-person-form');
    expect(form.innerHTML).toContain('inline-person-name');
  });
});

// --------------------------------------------------------------------------
// cleanupModalAutocomplete
// --------------------------------------------------------------------------
describe('cleanupModalAutocomplete', () => {
  it('does not throw when no controllers registered', () => {
    expect(() => cleanupModalAutocomplete()).not.toThrow();
  });
});

// --------------------------------------------------------------------------
// renderAreaInput / renderCategoryInput / renderTagsInput / renderPeopleInput
// --------------------------------------------------------------------------
describe('renderAreaInput', () => {
  it('does nothing when container is missing', () => {
    document.body.innerHTML = '';
    expect(() => renderAreaInput()).not.toThrow();
  });

  it('renders area autocomplete when container exists', () => {
    document.body.innerHTML = '<div id="area-autocomplete-container"></div>';
    mocks.state.modalSelectedArea = null;
    renderAreaInput();
    const container = document.getElementById('area-autocomplete-container');
    expect(container.innerHTML).toContain('area-search');
    expect(container.innerHTML).toContain('No area selected');
  });

  it('shows selected area when one is set', () => {
    document.body.innerHTML = '<div id="area-autocomplete-container"></div>';
    mocks.state.modalSelectedArea = 'area_1';
    renderAreaInput();
    const container = document.getElementById('area-autocomplete-container');
    expect(container.innerHTML).toContain('Work');
  });
});

describe('renderCategoryInput', () => {
  it('does nothing when container is missing', () => {
    document.body.innerHTML = '';
    expect(() => renderCategoryInput()).not.toThrow();
  });

  it('clears selection if category does not belong to selected area', () => {
    document.body.innerHTML = '<div id="category-autocomplete-container"></div>';
    mocks.state.modalSelectedArea = 'area_2';
    mocks.state.modalSelectedCategory = 'cat_1';
    // cat_1 belongs to area_1, not area_2
    renderCategoryInput();
    expect(mocks.state.modalSelectedCategory).toBeNull();
  });
});

describe('renderTagsInput', () => {
  it('does nothing when container is missing', () => {
    document.body.innerHTML = '';
    expect(() => renderTagsInput()).not.toThrow();
  });

  it('renders selected tags as pills', () => {
    document.body.innerHTML = '<div id="tags-input-container"></div>';
    mocks.state.modalSelectedTags = ['label_1'];
    renderTagsInput();
    const container = document.getElementById('tags-input-container');
    expect(container.innerHTML).toContain('Urgent');
    expect(container.innerHTML).toContain('tag-pill');
  });

  it('renders search input', () => {
    document.body.innerHTML = '<div id="tags-input-container"></div>';
    mocks.state.modalSelectedTags = [];
    renderTagsInput();
    const container = document.getElementById('tags-input-container');
    expect(container.innerHTML).toContain('tags-search');
    expect(container.innerHTML).toContain('Add tags...');
  });
});

describe('renderPeopleInput', () => {
  it('does nothing when container is missing', () => {
    document.body.innerHTML = '';
    expect(() => renderPeopleInput()).not.toThrow();
  });

  it('renders selected people as pills', () => {
    document.body.innerHTML = '<div id="people-input-container"></div>';
    mocks.state.modalSelectedPeople = ['person_1'];
    renderPeopleInput();
    const container = document.getElementById('people-input-container');
    expect(container.innerHTML).toContain('John Doe');
    expect(container.innerHTML).toContain('tag-pill');
  });

  it('renders search input', () => {
    document.body.innerHTML = '<div id="people-input-container"></div>';
    mocks.state.modalSelectedPeople = [];
    renderPeopleInput();
    const container = document.getElementById('people-input-container');
    expect(container.innerHTML).toContain('people-search');
    expect(container.innerHTML).toContain('Add people...');
  });
});

// --------------------------------------------------------------------------
// setupAutocomplete
// --------------------------------------------------------------------------
describe('setupAutocomplete', () => {
  it('does nothing when input element is missing', () => {
    document.body.innerHTML = '<div id="dropdown"></div>';
    expect(() => setupAutocomplete('nonexistent', 'dropdown', [], vi.fn(), vi.fn(), vi.fn())).not.toThrow();
  });

  it('does nothing when dropdown element is missing', () => {
    document.body.innerHTML = '<input id="input">';
    expect(() => setupAutocomplete('input', 'nonexistent', [], vi.fn(), vi.fn(), vi.fn())).not.toThrow();
  });

  it('renders options on focus', () => {
    document.body.innerHTML = '<input id="ac-input"><div id="ac-dropdown"></div>';
    const items = [{ id: 'a', name: 'Alpha' }];
    setupAutocomplete('ac-input', 'ac-dropdown', items, vi.fn(), i => i.name, () => '');
    const input = document.getElementById('ac-input');
    input.dispatchEvent(new Event('focus'));
    const dropdown = document.getElementById('ac-dropdown');
    expect(dropdown.innerHTML).toContain('Alpha');
    expect(dropdown.classList.contains('show')).toBe(true);
  });

  it('filters options on input', () => {
    document.body.innerHTML = '<input id="ac-input"><div id="ac-dropdown"></div>';
    const items = [{ id: 'a', name: 'Alpha' }, { id: 'b', name: 'Beta' }];
    setupAutocomplete('ac-input', 'ac-dropdown', items, vi.fn(), i => i.name, () => '');
    const input = document.getElementById('ac-input');
    input.value = 'Bet';
    input.dispatchEvent(new Event('input'));
    const dropdown = document.getElementById('ac-dropdown');
    expect(dropdown.innerHTML).toContain('Beta');
    expect(dropdown.innerHTML).not.toContain('Alpha');
  });

  it('shows "No matches found" when no items match', () => {
    document.body.innerHTML = '<input id="ac-input"><div id="ac-dropdown"></div>';
    const items = [{ id: 'a', name: 'Alpha' }];
    setupAutocomplete('ac-input', 'ac-dropdown', items, vi.fn(), i => i.name, () => '');
    const input = document.getElementById('ac-input');
    input.value = 'ZZZ';
    input.dispatchEvent(new Event('input'));
    const dropdown = document.getElementById('ac-dropdown');
    expect(dropdown.innerHTML).toContain('No matches found');
  });

  it('shows Create option when allowCreate is true and no exact match', () => {
    document.body.innerHTML = '<input id="ac-input"><div id="ac-dropdown"></div>';
    const items = [{ id: 'a', name: 'Alpha' }];
    setupAutocomplete('ac-input', 'ac-dropdown', items, vi.fn(), i => i.name, () => '', true, vi.fn());
    const input = document.getElementById('ac-input');
    input.value = 'New Item';
    input.dispatchEvent(new Event('input'));
    const dropdown = document.getElementById('ac-dropdown');
    expect(dropdown.innerHTML).toContain('Create');
    expect(dropdown.innerHTML).toContain('New Item');
  });

  it('hides dropdown on Escape', () => {
    document.body.innerHTML = '<input id="ac-input"><div id="ac-dropdown" class="show"></div>';
    const items = [{ id: 'a', name: 'Alpha' }];
    setupAutocomplete('ac-input', 'ac-dropdown', items, vi.fn(), i => i.name, () => '');
    const input = document.getElementById('ac-input');
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    input.dispatchEvent(event);
    const dropdown = document.getElementById('ac-dropdown');
    expect(dropdown.classList.contains('show')).toBe(false);
  });
});
