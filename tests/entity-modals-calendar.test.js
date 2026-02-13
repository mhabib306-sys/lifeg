// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ============================================================================
const mocks = vi.hoisted(() => {
  const state = {
    activeTab: 'calendar',
    currentDate: '2026-01-15',
    calendarMonth: 0,
    calendarYear: 2026,
    calendarSelectedDate: '2026-01-15',
    calendarViewMode: 'month',
    calendarEventModalOpen: false,
    calendarEventModalCalendarId: null,
    calendarEventModalEventId: null,
    calendarMeetingNotesOpen: false,
    calendarMeetingNotesCalId: null,
    calendarMeetingNotesEventId: null,
    calendarMeetingNotesScope: 'instance',
    calendarMeetingNotesEventKey: null,
    calendarDragEvent: null,
    calendarMobilePanel: null,
    calendarMobileShowToday: false,
    calendarMobileShowEvents: false,
    calendarMobileShowScheduled: false,
    draggedCalendarEvent: null,
    gcalTokenExpired: false,
    gcalSyncing: false,
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    showPerspectiveModal: false,
    editingPerspectiveId: null,
    perspectiveName: '',
    perspectiveIcon: '',
    perspectiveColor: '#6B7280',
    perspectiveFilter: { statuses: [], flaggedOnly: false, areas: [], labels: [] },
    perspectiveEmojiPickerOpen: false,
    perspectiveEmojiSearch: '',
    pendingPerspectiveEmoji: '',
    showAreaModal: false,
    editingAreaId: null,
    areaName: '',
    areaIcon: '',
    areaColor: '#4A90A4',
    areaEmojiPickerOpen: false,
    areaEmojiSearch: '',
    pendingAreaEmoji: '',
    showCategoryModal: false,
    editingCategoryId: null,
    categoryName: '',
    categoryIcon: '',
    categoryColor: '#6B8E5A',
    categoryAreaId: '',
    categoryEmojiPickerOpen: false,
    categoryEmojiSearch: '',
    pendingCategoryEmoji: '',
    modalSelectedArea: '',
    showLabelModal: false,
    editingLabelId: null,
    labelName: '',
    labelIcon: '',
    labelColor: '#EF4444',
    showPersonModal: false,
    editingPersonId: null,
    personName: '',
    personIcon: '',
    personEmail: '',
    personPhone: '',
    activePerspective: null,
    emojiSearchQuery: '',
    inlineAutocompleteMeta: new Map(),
    gcalEventsCache: {},
    gcalEvents: [],
    meetingNotesByEvent: {},
    deletedEntityTombstones: {},
  };

  const createArea = vi.fn((name, emoji) => {
    const area = { id: 'cat_mock_' + Date.now(), name, emoji: emoji || '', color: '#4A90A4' };
    state.taskAreas.push(area);
    return area;
  });
  const updateArea = vi.fn();
  const createCategory = vi.fn((name, areaId, emoji) => {
    const cat = { id: 'subcat_mock_' + Date.now(), name, areaId, emoji: emoji || '', color: '#6366F1' };
    state.taskCategories.push(cat);
    return cat;
  });
  const updateCategory = vi.fn();
  const deleteCategory = vi.fn();
  const createLabel = vi.fn((name, color) => {
    const label = { id: 'label_mock_' + Date.now(), name, color: color || '#6B7280' };
    state.taskLabels.push(label);
    return label;
  });
  const updateLabel = vi.fn();
  const createPerson = vi.fn((name, email) => {
    const person = { id: 'person_mock_' + Date.now(), name, email: email || '' };
    state.taskPeople.push(person);
    return person;
  });
  const updatePerson = vi.fn();
  const createPerspective = vi.fn((name, icon, filter) => {
    const persp = { id: 'custom_mock_' + Date.now(), name, icon: icon || '📌', filter, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    state.customPerspectives.push(persp);
    return persp;
  });
  const deletePerspective = vi.fn();
  const saveTasksData = vi.fn();
  const saveData = vi.fn();
  const getTasksForDate = vi.fn(() => []);

  return {
    state,
    createArea, updateArea,
    createCategory, updateCategory, deleteCategory,
    createLabel, updateLabel,
    createPerson, updatePerson,
    createPerspective, deletePerspective,
    saveTasksData, saveData,
    getTasksForDate,
  };
});

// ============================================================================
// Mocks — factories reference only hoisted variables
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mocks.state }));

vi.mock('../src/constants.js', () => ({
  THINGS3_AREA_COLORS: [
    '#147EFB', '#5AC8FA', '#34AADC', '#007AFF', '#4A90D9', '#5856D6', '#2E6B9E', '#1B3A5C',
    '#34C759', '#30D158', '#A8D86C', '#FFD60A', '#FF9F0A', '#FF6B35', '#FF3B30', '#E5484D',
  ],
  THINGS3_ICONS: { calendar: '<svg>cal</svg>' },
  MEETING_NOTES_KEY: 'nucleusMeetingNotes',
  getActiveIcons: vi.fn(() => ({ calendar: '<svg>cal</svg>' })),
}));

vi.mock('../src/utils.js', () => ({
  escapeHtml: vi.fn(s => s || ''),
  getLocalDateString: vi.fn(() => '2026-01-15'),
  formatSmartDate: vi.fn(d => d || ''),
  generateTaskId: vi.fn(() => 'task_mock_123'),
  renderPersonAvatar: vi.fn((person, size) => `<span class="avatar">${person?.name || ''}</span>`),
  normalizeEmail: vi.fn(email => String(email || '').trim().toLowerCase()),
  formatEventTime: vi.fn(e => {
    if (!e) return '';
    if (e.allDay) return 'All day';
    return '10:00 AM';
  }),
  formatEventDateLabel: vi.fn(e => e?.start?.date || '2026-01-15'),
  fmt: vi.fn(n => String(n)),
}));

vi.mock('../src/features/areas.js', () => ({
  createArea: mocks.createArea,
  updateArea: mocks.updateArea,
  createCategory: mocks.createCategory,
  updateCategory: mocks.updateCategory,
  deleteCategory: mocks.deleteCategory,
  createLabel: mocks.createLabel,
  updateLabel: mocks.updateLabel,
  createPerson: mocks.createPerson,
  updatePerson: mocks.updatePerson,
  ensureEntityTombstones: vi.fn(() => mocks.state.deletedEntityTombstones),
  persistEntityTombstones: vi.fn(),
}));

vi.mock('../src/features/perspectives.js', () => ({
  createPerspective: mocks.createPerspective,
  deletePerspective: mocks.deletePerspective,
}));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: mocks.saveTasksData,
  saveData: mocks.saveData,
  saveViewState: vi.fn(),
  getTodayData: vi.fn(() => ({})),
  savePerspectives: vi.fn(),
}));

vi.mock('../src/features/calendar.js', () => ({
  getTasksForDate: mocks.getTasksForDate,
}));

vi.mock('../src/data/google-calendar-sync.js', () => ({
  getGCalEventsForDate: vi.fn(() => []),
  rescheduleGCalEventIfConnected: vi.fn(),
}));

// ============================================================================
// Import modules under test (after mocks are wired)
// ============================================================================
import {
  saveAreaFromModal,
  saveCategoryFromModal,
  saveLabelFromModal,
  savePersonFromModal,
  savePerspectiveFromModal,
  selectPerspectiveEmoji,
  selectAreaEmoji,
  selectCategoryEmoji,
  toggleEmojiPicker,
  updateEmojiGrid,
  renderPerspectiveModalHtml,
  renderAreaModalHtml,
  renderCategoryModalHtml,
  renderLabelModalHtml,
  renderPersonModalHtml,
} from '../src/ui/entity-modals.js';

import { renderCalendarView } from '../src/ui/calendar-view.js';

import {
  hasMeetingNotes,
  getSelectedModalEvent,
  q,
  openCalendarEventActions,
  closeCalendarEventActions,
  openCalendarMeetingNotes,
  openCalendarMeetingNotesByEventKey,
  openCalendarMeetingWorkspaceByEventKey,
  setCalendarMeetingNotesScope,
  toggleCalendarMobilePanel,
  closeCalendarMeetingNotes,
  convertCalendarEventToTask,
  startCalendarEventDrag,
  clearCalendarEventDrag,
  dropCalendarEventToSlot,
  addMeetingLinkedItem,
  addDiscussionItemToMeeting,
  handleMeetingItemInputKeydown,
  renderMeetingNotesPage,
  renderEventActionsModal,
} from '../src/ui/calendar-meeting.js';

// ============================================================================
// Helpers
// ============================================================================
function resetState() {
  Object.assign(mocks.state, {
    activeTab: 'calendar',
    currentDate: '2026-01-15',
    calendarMonth: 0,
    calendarYear: 2026,
    calendarSelectedDate: '2026-01-15',
    calendarViewMode: 'month',
    calendarEventModalOpen: false,
    calendarEventModalCalendarId: null,
    calendarEventModalEventId: null,
    calendarMeetingNotesOpen: false,
    calendarMeetingNotesCalId: null,
    calendarMeetingNotesEventId: null,
    calendarMeetingNotesScope: 'instance',
    calendarMeetingNotesEventKey: null,
    calendarDragEvent: null,
    calendarMobilePanel: null,
    calendarMobileShowToday: false,
    calendarMobileShowEvents: false,
    calendarMobileShowScheduled: false,
    draggedCalendarEvent: null,
    gcalTokenExpired: false,
    gcalSyncing: false,
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    showPerspectiveModal: false,
    editingPerspectiveId: null,
    perspectiveName: '',
    perspectiveIcon: '',
    perspectiveColor: '#6B7280',
    perspectiveFilter: { statuses: [], flaggedOnly: false, areas: [], labels: [] },
    perspectiveEmojiPickerOpen: false,
    perspectiveEmojiSearch: '',
    pendingPerspectiveEmoji: '',
    showAreaModal: false,
    editingAreaId: null,
    areaName: '',
    areaIcon: '',
    areaColor: '#4A90A4',
    areaEmojiPickerOpen: false,
    areaEmojiSearch: '',
    pendingAreaEmoji: '',
    showCategoryModal: false,
    editingCategoryId: null,
    categoryName: '',
    categoryIcon: '',
    categoryColor: '#6B8E5A',
    categoryAreaId: '',
    categoryEmojiPickerOpen: false,
    categoryEmojiSearch: '',
    pendingCategoryEmoji: '',
    modalSelectedArea: '',
    showLabelModal: false,
    editingLabelId: null,
    labelName: '',
    labelIcon: '',
    labelColor: '#EF4444',
    showPersonModal: false,
    editingPersonId: null,
    personName: '',
    personIcon: '',
    personEmail: '',
    personPhone: '',
    activePerspective: null,
    emojiSearchQuery: '',
    gcalEventsCache: {},
    gcalEvents: [],
    meetingNotesByEvent: {},
    deletedEntityTombstones: {},
  });
  // Reset Map
  mocks.state.inlineAutocompleteMeta = new Map();
}

function setUpDomInput(id, value) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('input');
    el.id = id;
    document.body.appendChild(el);
  }
  el.value = value;
  return el;
}

function setUpDomSelect(id, value) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('select');
    el.id = id;
    document.body.appendChild(el);
  }
  // Ensure option exists so .value sticks in jsdom
  if (value !== '' && value != null) {
    let opt = el.querySelector(`option[value="${value}"]`);
    if (!opt) {
      opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      el.appendChild(opt);
    }
  }
  // Always add an empty option so '' works
  if (!el.querySelector('option[value=""]')) {
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '';
    el.appendChild(emptyOpt);
  }
  el.value = value;
  return el;
}

function setUpDomCheckbox(id, checked) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('input');
    el.type = 'checkbox';
    el.id = id;
    document.body.appendChild(el);
  }
  el.checked = checked;
  return el;
}

function makeEvent(overrides = {}) {
  return {
    id: 'evt_1',
    calendarId: 'cal_1',
    summary: 'Team Standup',
    start: { dateTime: '2026-01-15T10:00:00' },
    end: { dateTime: '2026-01-15T11:00:00' },
    allDay: false,
    htmlLink: 'https://calendar.google.com/event/evt_1',
    meetingLink: 'https://meet.google.com/abc-def',
    meetingProvider: 'Google Meet',
    description: 'Daily standup meeting',
    attendees: [],
    recurringEventId: null,
    ...overrides,
  };
}

// ============================================================================
// Setup
// ============================================================================
beforeEach(() => {
  resetState();
  vi.clearAllMocks();
  document.body.innerHTML = '';
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.createTask = vi.fn();
  window.updateTask = vi.fn();
  window.saveTasksData = mocks.saveTasksData;
  window.getGCalEventsForDate = vi.fn(() => []);
  window.rescheduleGCalEventIfConnected = vi.fn();
  window.innerWidth = 1024;
  // localStorage mock
  const store = {};
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => { store[key] = val; });
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
});

afterEach(() => {
  vi.restoreAllMocks();
});


// ############################################################################
// ENTITY MODALS — saveAreaFromModal
// ############################################################################
describe('entity-modals: saveAreaFromModal()', () => {
  it('should show inline error and return if name is empty', () => {
    setUpDomInput('area-name', '');
    saveAreaFromModal();
    const errorEl = document.querySelector('.field-error-msg');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Please enter an area name');
    expect(mocks.createArea).not.toHaveBeenCalled();
  });

  it('should show inline error and return if name is only whitespace', () => {
    setUpDomInput('area-name', '   ');
    saveAreaFromModal();
    expect(document.querySelector('.field-error-msg')).not.toBeNull();
    expect(mocks.createArea).not.toHaveBeenCalled();
  });

  it('should create a new area when not editing', () => {
    setUpDomInput('area-name', 'Work');
    setUpDomInput('area-emoji', '💼');
    setUpDomInput('area-color', '#FF0000');
    mocks.state.editingAreaId = null;

    saveAreaFromModal();

    expect(mocks.createArea).toHaveBeenCalledWith('Work', '💼');
    expect(mocks.state.showAreaModal).toBe(false);
    expect(mocks.state.editingAreaId).toBe(null);
    expect(window.render).toHaveBeenCalled();
  });

  it('should update existing area when editing', () => {
    mocks.state.editingAreaId = 'cat_existing_1';
    setUpDomInput('area-name', 'Personal Updated');
    setUpDomInput('area-emoji', '🏠');
    setUpDomInput('area-color', '#00FF00');

    saveAreaFromModal();

    expect(mocks.updateArea).toHaveBeenCalledWith('cat_existing_1', { name: 'Personal Updated', emoji: '🏠', color: '#00FF00' });
    expect(mocks.state.showAreaModal).toBe(false);
    expect(mocks.state.pendingAreaEmoji).toBe('');
    expect(window.render).toHaveBeenCalled();
  });

  it('should set color on new area when non-default', () => {
    setUpDomInput('area-name', 'Health');
    setUpDomInput('area-emoji', '');
    setUpDomInput('area-color', '#123456');
    mocks.state.editingAreaId = null;

    saveAreaFromModal();

    expect(mocks.createArea).toHaveBeenCalled();
    // updateArea is called to override color if different from default
    expect(mocks.updateArea).toHaveBeenCalled();
  });

  it('should default color to #6366F1 when area-color element is missing', () => {
    setUpDomInput('area-name', 'NoColor');
    setUpDomInput('area-emoji', '');
    // No area-color input in DOM
    mocks.state.editingAreaId = null;

    saveAreaFromModal();
    expect(mocks.createArea).toHaveBeenCalledWith('NoColor', '');
  });
});


// ############################################################################
// ENTITY MODALS — saveCategoryFromModal
// ############################################################################
describe('entity-modals: saveCategoryFromModal()', () => {
  it('should show inline error if name is empty', () => {
    setUpDomInput('category-name', '');
    setUpDomSelect('category-area', 'cat_1');
    saveCategoryFromModal();
    const errorEl = document.querySelector('.field-error-msg');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Please enter a name');
  });

  it('should show inline error if areaId is empty', () => {
    setUpDomInput('category-name', 'Sub Category');
    setUpDomSelect('category-area', '');
    saveCategoryFromModal();
    const errorEl = document.querySelector('.field-error-msg');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Please select an area');
  });

  it('should create new category when not editing', () => {
    setUpDomInput('category-name', 'Frontend');
    setUpDomSelect('category-area', 'cat_1');
    setUpDomInput('category-color', '#AABBCC');
    setUpDomInput('category-emoji', '🖥️');

    saveCategoryFromModal();

    expect(mocks.createCategory).toHaveBeenCalledWith('Frontend', 'cat_1', '🖥️');
    expect(mocks.state.showCategoryModal).toBe(false);
    expect(mocks.state.pendingCategoryEmoji).toBe('');
    expect(window.render).toHaveBeenCalled();
  });

  it('should update existing category when editing', () => {
    mocks.state.editingCategoryId = 'subcat_existing';
    setUpDomInput('category-name', 'Backend');
    setUpDomSelect('category-area', 'cat_2');
    setUpDomInput('category-color', '#DDEEFF');
    setUpDomInput('category-emoji', '⚙️');

    saveCategoryFromModal();

    expect(mocks.updateCategory).toHaveBeenCalledWith('subcat_existing', { name: 'Backend', areaId: 'cat_2', color: '#DDEEFF', emoji: '⚙️' });
    expect(mocks.state.showCategoryModal).toBe(false);
  });
});


// ############################################################################
// ENTITY MODALS — saveLabelFromModal
// ############################################################################
describe('entity-modals: saveLabelFromModal()', () => {
  it('should show inline error if name is empty', () => {
    setUpDomInput('label-name', '');
    setUpDomInput('label-color', '#6B7280');
    saveLabelFromModal();
    const errorEl = document.querySelector('.field-error-msg');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Please enter a tag name');
  });

  it('should create new label when not editing', () => {
    setUpDomInput('label-name', 'Urgent');
    setUpDomInput('label-color', '#FF0000');

    saveLabelFromModal();

    expect(mocks.createLabel).toHaveBeenCalledWith('Urgent', '#FF0000');
    expect(mocks.state.showLabelModal).toBe(false);
    expect(window.render).toHaveBeenCalled();
  });

  it('should update existing label when editing', () => {
    mocks.state.editingLabelId = 'label_existing';
    setUpDomInput('label-name', 'Important');
    setUpDomInput('label-color', '#0000FF');

    saveLabelFromModal();

    expect(mocks.updateLabel).toHaveBeenCalledWith('label_existing', { name: 'Important', color: '#0000FF' });
    expect(mocks.state.showLabelModal).toBe(false);
    expect(mocks.state.editingLabelId).toBe(null);
  });
});


// ############################################################################
// ENTITY MODALS — savePersonFromModal
// ############################################################################
describe('entity-modals: savePersonFromModal()', () => {
  it('should show inline error if name is empty', () => {
    setUpDomInput('person-name', '');
    setUpDomInput('person-email', '');
    savePersonFromModal();
    const errorEl = document.querySelector('.field-error-msg');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Please enter a name');
  });

  it('should create a new person when not editing', () => {
    setUpDomInput('person-name', 'Jane Doe');
    setUpDomInput('person-email', 'jane@example.com');

    savePersonFromModal();

    expect(mocks.createPerson).toHaveBeenCalledWith('Jane Doe', 'jane@example.com');
    expect(mocks.state.showPersonModal).toBe(false);
    expect(window.render).toHaveBeenCalled();
  });

  it('should create person without email', () => {
    setUpDomInput('person-name', 'John');
    setUpDomInput('person-email', '');

    savePersonFromModal();

    expect(mocks.createPerson).toHaveBeenCalledWith('John', '');
  });

  it('should update existing person when editing', () => {
    mocks.state.editingPersonId = 'person_existing';
    setUpDomInput('person-name', 'Bob Updated');
    setUpDomInput('person-email', 'bob@test.com');

    savePersonFromModal();

    expect(mocks.updatePerson).toHaveBeenCalledWith('person_existing', { name: 'Bob Updated', email: 'bob@test.com' });
    expect(mocks.state.showPersonModal).toBe(false);
    expect(mocks.state.editingPersonId).toBe(null);
  });
});


// ############################################################################
// ENTITY MODALS — savePerspectiveFromModal
// ############################################################################
describe('entity-modals: savePerspectiveFromModal()', () => {
  it('should show inline error if name is empty', () => {
    setUpDomInput('perspective-name', '');
    savePerspectiveFromModal();
    const errorEl = document.querySelector('.field-error-msg');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Please enter a perspective name');
    expect(mocks.createPerspective).not.toHaveBeenCalled();
  });

  it('should create a new perspective with basic fields', () => {
    setUpDomInput('perspective-name', 'Work View');
    setUpDomInput('perspective-icon', '📋');
    setUpDomSelect('perspective-logic', 'all');
    setUpDomSelect('perspective-category', '');
    setUpDomSelect('perspective-status', '');
    setUpDomSelect('perspective-availability', '');
    setUpDomSelect('perspective-status-rule', '');
    setUpDomSelect('perspective-person', '');
    setUpDomSelect('perspective-tags-mode', 'any');
    setUpDomCheckbox('perspective-due', false);
    setUpDomCheckbox('perspective-defer', false);
    setUpDomCheckbox('perspective-repeat', false);
    setUpDomCheckbox('perspective-untagged', false);
    setUpDomCheckbox('perspective-inbox', false);
    setUpDomSelect('perspective-range-type', 'either');
    setUpDomInput('perspective-range-start', '');
    setUpDomInput('perspective-range-end', '');
    setUpDomInput('perspective-search', '');

    savePerspectiveFromModal();

    expect(mocks.createPerspective).toHaveBeenCalledWith('Work View', '📋', expect.objectContaining({ logic: 'all', tagMatch: 'any' }));
    expect(mocks.state.showPerspectiveModal).toBe(false);
    expect(mocks.state.pendingPerspectiveEmoji).toBe('');
    expect(window.render).toHaveBeenCalled();
  });

  it('should collect checked conditions into filter', () => {
    setUpDomInput('perspective-name', 'Due Soon');
    setUpDomInput('perspective-icon', '⏰');
    setUpDomSelect('perspective-logic', 'any');
    setUpDomSelect('perspective-category', '');
    setUpDomSelect('perspective-status', 'today');
    setUpDomSelect('perspective-availability', 'available');
    setUpDomSelect('perspective-status-rule', 'flagged');
    setUpDomSelect('perspective-person', '');
    setUpDomSelect('perspective-tags-mode', 'all');
    setUpDomCheckbox('perspective-due', true);
    setUpDomCheckbox('perspective-defer', false);
    setUpDomCheckbox('perspective-repeat', true);
    setUpDomCheckbox('perspective-untagged', false);
    setUpDomCheckbox('perspective-inbox', false);
    setUpDomSelect('perspective-range-type', 'due');
    setUpDomInput('perspective-range-start', '2026-01-01');
    setUpDomInput('perspective-range-end', '2026-12-31');
    setUpDomInput('perspective-search', 'project');

    savePerspectiveFromModal();

    const filter = mocks.createPerspective.mock.calls[0][2];
    expect(filter.logic).toBe('any');
    expect(filter.status).toBe('today');
    expect(filter.availability).toBe('available');
    expect(filter.statusRule).toBe('flagged');
    expect(filter.hasDueDate).toBe(true);
    expect(filter.isRepeating).toBe(true);
    expect(filter.hasDeferDate).toBeUndefined();
    expect(filter.dateRange).toEqual({ type: 'due', start: '2026-01-01', end: '2026-12-31' });
    expect(filter.searchTerms).toBe('project');
    expect(filter.tagMatch).toBe('all');
  });

  it('should update existing perspective when editing', () => {
    const existingPersp = { id: 'custom_1', name: 'Old', icon: '📌', filter: {}, createdAt: '2026-01-01', updatedAt: '2026-01-01' };
    mocks.state.customPerspectives = [existingPersp];
    mocks.state.editingPerspectiveId = 'custom_1';

    setUpDomInput('perspective-name', 'Updated View');
    setUpDomInput('perspective-icon', '🔥');
    setUpDomSelect('perspective-logic', 'all');
    setUpDomSelect('perspective-category', '');
    setUpDomSelect('perspective-status', '');
    setUpDomSelect('perspective-availability', '');
    setUpDomSelect('perspective-status-rule', '');
    setUpDomSelect('perspective-person', '');
    setUpDomSelect('perspective-tags-mode', 'any');
    setUpDomCheckbox('perspective-due', false);
    setUpDomCheckbox('perspective-defer', false);
    setUpDomCheckbox('perspective-repeat', false);
    setUpDomCheckbox('perspective-untagged', false);
    setUpDomCheckbox('perspective-inbox', false);
    setUpDomSelect('perspective-range-type', 'either');
    setUpDomInput('perspective-range-start', '');
    setUpDomInput('perspective-range-end', '');
    setUpDomInput('perspective-search', '');

    savePerspectiveFromModal();

    expect(mocks.createPerspective).not.toHaveBeenCalled();
    expect(mocks.saveTasksData).toHaveBeenCalled();
    expect(mocks.state.customPerspectives[0].name).toBe('Updated View');
    expect(mocks.state.activePerspective).toBe('custom_1');
    expect(mocks.state.showPerspectiveModal).toBe(false);
  });

  it('should set activePerspective to new perspective id after creation', () => {
    setUpDomInput('perspective-name', 'New View');
    setUpDomInput('perspective-icon', '📌');
    setUpDomSelect('perspective-logic', 'all');
    setUpDomSelect('perspective-category', '');
    setUpDomSelect('perspective-status', '');
    setUpDomSelect('perspective-availability', '');
    setUpDomSelect('perspective-status-rule', '');
    setUpDomSelect('perspective-person', '');
    setUpDomSelect('perspective-tags-mode', 'any');
    setUpDomCheckbox('perspective-due', false);
    setUpDomCheckbox('perspective-defer', false);
    setUpDomCheckbox('perspective-repeat', false);
    setUpDomCheckbox('perspective-untagged', false);
    setUpDomCheckbox('perspective-inbox', false);
    setUpDomSelect('perspective-range-type', 'either');
    setUpDomInput('perspective-range-start', '');
    setUpDomInput('perspective-range-end', '');
    setUpDomInput('perspective-search', '');

    savePerspectiveFromModal();

    // After creation, activePerspective should be the last perspective's ID
    const lastPersp = mocks.state.customPerspectives[mocks.state.customPerspectives.length - 1];
    expect(mocks.state.activePerspective).toBe(lastPersp.id);
  });

  it('should include personId and category in filter when selected', () => {
    setUpDomInput('perspective-name', 'Person View');
    setUpDomInput('perspective-icon', '👤');
    setUpDomSelect('perspective-logic', 'all');
    setUpDomSelect('perspective-category', 'cat_work');
    setUpDomSelect('perspective-status', '');
    setUpDomSelect('perspective-availability', '');
    setUpDomSelect('perspective-status-rule', '');
    setUpDomSelect('perspective-person', 'person_1');
    setUpDomSelect('perspective-tags-mode', 'any');
    setUpDomCheckbox('perspective-due', false);
    setUpDomCheckbox('perspective-defer', false);
    setUpDomCheckbox('perspective-repeat', false);
    setUpDomCheckbox('perspective-untagged', false);
    setUpDomCheckbox('perspective-inbox', false);
    setUpDomSelect('perspective-range-type', 'either');
    setUpDomInput('perspective-range-start', '');
    setUpDomInput('perspective-range-end', '');
    setUpDomInput('perspective-search', '');

    savePerspectiveFromModal();

    const filter = mocks.createPerspective.mock.calls[0][2];
    expect(filter.categoryId).toBe('cat_work');
    expect(filter.personId).toBe('person_1');
  });
});


// ############################################################################
// ENTITY MODALS — Emoji selection functions
// ############################################################################
describe('entity-modals: selectPerspectiveEmoji()', () => {
  it('should set state and update DOM', () => {
    const iconInput = setUpDomInput('perspective-icon', '📌');
    const display = document.createElement('span');
    display.id = 'perspective-icon-display';
    document.body.appendChild(display);

    selectPerspectiveEmoji('🎯');

    expect(mocks.state.pendingPerspectiveEmoji).toBe('🎯');
    expect(mocks.state.perspectiveEmojiPickerOpen).toBe(false);
    expect(mocks.state.emojiSearchQuery).toBe('');
    expect(iconInput.value).toBe('🎯');
    expect(display.textContent).toBe('🎯');
  });

  it('should remove emoji picker dropdown from DOM', () => {
    const picker = document.createElement('div');
    picker.className = 'emoji-picker-dropdown';
    document.body.appendChild(picker);

    selectPerspectiveEmoji('🔥');

    expect(document.querySelector('.emoji-picker-dropdown')).toBe(null);
  });
});

describe('entity-modals: selectAreaEmoji()', () => {
  it('should set state and update DOM for area emoji', () => {
    const input = setUpDomInput('area-emoji', '');
    const preview = document.createElement('button');
    preview.id = 'area-folder-preview';
    document.body.appendChild(preview);

    selectAreaEmoji('🏠');

    expect(mocks.state.pendingAreaEmoji).toBe('🏠');
    expect(mocks.state.areaEmojiPickerOpen).toBe(false);
    expect(input.value).toBe('🏠');
    expect(preview.innerHTML).toBe('🏠');
  });
});

describe('entity-modals: selectCategoryEmoji()', () => {
  it('should set state and update DOM for category emoji', () => {
    const input = setUpDomInput('category-emoji', '');
    const preview = document.createElement('button');
    preview.id = 'cat-folder-preview';
    document.body.appendChild(preview);

    selectCategoryEmoji('📂');

    expect(mocks.state.pendingCategoryEmoji).toBe('📂');
    expect(mocks.state.categoryEmojiPickerOpen).toBe(false);
    expect(input.value).toBe('📂');
    expect(preview.innerHTML).toBe('📂');
  });
});


// ############################################################################
// ENTITY MODALS — toggleEmojiPicker
// ############################################################################
describe('entity-modals: toggleEmojiPicker()', () => {
  it('should close picker when it is already open (perspective)', () => {
    mocks.state.perspectiveEmojiPickerOpen = true;
    const picker = document.createElement('div');
    picker.className = 'emoji-picker-dropdown';
    document.body.appendChild(picker);

    toggleEmojiPicker('perspective');

    expect(mocks.state.perspectiveEmojiPickerOpen).toBe(false);
    expect(document.querySelector('.emoji-picker-dropdown')).toBe(null);
  });

  it('should open picker when it is closed (area)', () => {
    mocks.state.areaEmojiPickerOpen = false;
    // Create the button element the picker attaches to
    const container = document.createElement('div');
    container.className = 'relative';
    const btn = document.createElement('button');
    btn.id = 'area-folder-preview';
    container.appendChild(btn);
    document.body.appendChild(container);

    toggleEmojiPicker('area');

    expect(mocks.state.areaEmojiPickerOpen).toBe(true);
    expect(container.querySelector('.emoji-picker-dropdown')).not.toBe(null);
  });

  it('should open picker when it is closed (category)', () => {
    mocks.state.categoryEmojiPickerOpen = false;
    const container = document.createElement('div');
    container.className = 'relative';
    const btn = document.createElement('button');
    btn.id = 'cat-folder-preview';
    container.appendChild(btn);
    document.body.appendChild(container);

    toggleEmojiPicker('category');

    expect(mocks.state.categoryEmojiPickerOpen).toBe(true);
    expect(container.querySelector('.emoji-picker-dropdown')).not.toBe(null);
  });

  it('should close all pickers before opening a new one', () => {
    mocks.state.perspectiveEmojiPickerOpen = true;
    mocks.state.areaEmojiPickerOpen = false;
    const container = document.createElement('div');
    container.className = 'relative';
    const btn = document.createElement('button');
    btn.id = 'area-folder-preview';
    container.appendChild(btn);
    document.body.appendChild(container);

    toggleEmojiPicker('area');

    expect(mocks.state.perspectiveEmojiPickerOpen).toBe(false);
    expect(mocks.state.areaEmojiPickerOpen).toBe(true);
  });
});


// ############################################################################
// ENTITY MODALS — updateEmojiGrid
// ############################################################################
describe('entity-modals: updateEmojiGrid()', () => {
  it('should update state.emojiSearchQuery', () => {
    updateEmojiGrid('star');
    expect(mocks.state.emojiSearchQuery).toBe('star');
  });

  it('should update grid content when container exists', () => {
    mocks.state.perspectiveEmojiPickerOpen = true;
    const gridContainer = document.createElement('div');
    gridContainer.id = 'emoji-grid-content';
    document.body.appendChild(gridContainer);

    updateEmojiGrid('happy');

    expect(gridContainer.innerHTML).not.toBe('');
    expect(gridContainer.innerHTML).toContain('button');
  });

  it('should show no-matches message when search returns nothing', () => {
    mocks.state.perspectiveEmojiPickerOpen = true;
    const gridContainer = document.createElement('div');
    gridContainer.id = 'emoji-grid-content';
    document.body.appendChild(gridContainer);

    updateEmojiGrid('xyznonexistentquery123');

    expect(gridContainer.innerHTML).toContain('No matches');
  });

  it('should handle empty search string', () => {
    mocks.state.perspectiveEmojiPickerOpen = true;
    const gridContainer = document.createElement('div');
    gridContainer.id = 'emoji-grid-content';
    document.body.appendChild(gridContainer);

    updateEmojiGrid('');

    expect(mocks.state.emojiSearchQuery).toBe('');
    // Should show all emojis (no filter)
    expect(gridContainer.innerHTML).toContain('button');
  });
});


// ############################################################################
// ENTITY MODALS — Render functions
// ############################################################################
describe('entity-modals: renderPerspectiveModalHtml()', () => {
  it('should return empty string when modal is closed', () => {
    mocks.state.showPerspectiveModal = false;
    expect(renderPerspectiveModalHtml()).toBe('');
  });

  it('should return HTML for new perspective modal', () => {
    mocks.state.showPerspectiveModal = true;
    mocks.state.editingPerspectiveId = null;
    const html = renderPerspectiveModalHtml();
    expect(html).toContain('New Custom View');
    expect(html).toContain('perspective-name');
    expect(html).toContain('perspective-icon');
    expect(html).toContain('Create');
  });

  it('should return HTML for edit perspective modal', () => {
    mocks.state.customPerspectives = [{ id: 'custom_1', name: 'Work', icon: '💼', filter: {} }];
    mocks.state.showPerspectiveModal = true;
    mocks.state.editingPerspectiveId = 'custom_1';
    const html = renderPerspectiveModalHtml();
    expect(html).toContain('Edit Custom View');
    expect(html).toContain('Save');
    expect(html).toContain('Delete');
  });

  it('should show areas in area dropdown', () => {
    mocks.state.showPerspectiveModal = true;
    mocks.state.taskAreas = [{ id: 'cat_1', name: 'Work' }];
    const html = renderPerspectiveModalHtml();
    expect(html).toContain('Work');
    expect(html).toContain('cat_1');
  });

  it('should show labels as checkboxes', () => {
    mocks.state.showPerspectiveModal = true;
    mocks.state.taskLabels = [{ id: 'label_1', name: 'Urgent', color: '#FF0000' }];
    const html = renderPerspectiveModalHtml();
    expect(html).toContain('Urgent');
    expect(html).toContain('perspective-tag-checkbox');
  });

  it('should show "No tags created yet" when no labels', () => {
    mocks.state.showPerspectiveModal = true;
    mocks.state.taskLabels = [];
    const html = renderPerspectiveModalHtml();
    expect(html).toContain('No tags created yet');
  });

  it('should show people in dropdown', () => {
    mocks.state.showPerspectiveModal = true;
    mocks.state.taskPeople = [{ id: 'person_1', name: 'Alice' }];
    const html = renderPerspectiveModalHtml();
    expect(html).toContain('Alice');
    expect(html).toContain('person_1');
  });
});

describe('entity-modals: renderAreaModalHtml()', () => {
  it('should return empty string when modal is closed', () => {
    mocks.state.showAreaModal = false;
    expect(renderAreaModalHtml()).toBe('');
  });

  it('should return HTML for new area', () => {
    mocks.state.showAreaModal = true;
    mocks.state.editingAreaId = null;
    const html = renderAreaModalHtml();
    expect(html).toContain('New Area');
    expect(html).toContain('area-name');
    expect(html).toContain('area-color');
    expect(html).toContain('Create');
  });

  it('should return HTML for edit area', () => {
    mocks.state.taskAreas = [{ id: 'cat_1', name: 'Work', color: '#FF0000', emoji: '💼' }];
    mocks.state.showAreaModal = true;
    mocks.state.editingAreaId = 'cat_1';
    const html = renderAreaModalHtml();
    expect(html).toContain('Edit Area');
    expect(html).toContain('Save');
    expect(html).toContain('Delete');
    expect(html).toContain('Work');
  });

  it('should show pending emoji when set', () => {
    mocks.state.showAreaModal = true;
    mocks.state.pendingAreaEmoji = '🎯';
    const html = renderAreaModalHtml();
    expect(html).toContain('🎯');
  });

  it('should contain color swatch grid', () => {
    mocks.state.showAreaModal = true;
    const html = renderAreaModalHtml();
    expect(html).toContain('color-swatch');
    expect(html).toContain('Folder color');
  });
});

describe('entity-modals: renderCategoryModalHtml()', () => {
  it('should return empty string when modal is closed', () => {
    mocks.state.showCategoryModal = false;
    expect(renderCategoryModalHtml()).toBe('');
  });

  it('should return HTML for new category', () => {
    mocks.state.showCategoryModal = true;
    mocks.state.taskAreas = [{ id: 'cat_1', name: 'Work', color: '#FF0000' }];
    const html = renderCategoryModalHtml();
    expect(html).toContain('New');
    expect(html).toContain('Category');
    expect(html).toContain('category-name');
    expect(html).toContain('category-area');
  });

  it('should show area dropdown options', () => {
    mocks.state.showCategoryModal = true;
    mocks.state.taskAreas = [
      { id: 'cat_1', name: 'Work', color: '#FF0000' },
      { id: 'cat_2', name: 'Personal', color: '#00FF00' },
    ];
    const html = renderCategoryModalHtml();
    expect(html).toContain('Work');
    expect(html).toContain('Personal');
  });

  it('should show edit mode when editing a category', () => {
    mocks.state.taskCategories = [{ id: 'subcat_1', name: 'Frontend', areaId: 'cat_1', color: '#AABB', emoji: '🖥️' }];
    mocks.state.taskAreas = [{ id: 'cat_1', name: 'Work', color: '#FF0000' }];
    mocks.state.showCategoryModal = true;
    mocks.state.editingCategoryId = 'subcat_1';
    const html = renderCategoryModalHtml();
    expect(html).toContain('Edit');
    expect(html).toContain('Frontend');
    expect(html).toContain('Delete');
  });
});

describe('entity-modals: renderLabelModalHtml()', () => {
  it('should return empty string when modal is closed', () => {
    mocks.state.showLabelModal = false;
    expect(renderLabelModalHtml()).toBe('');
  });

  it('should return HTML for new label', () => {
    mocks.state.showLabelModal = true;
    const html = renderLabelModalHtml();
    expect(html).toContain('New Tag');
    expect(html).toContain('label-name');
    expect(html).toContain('label-color');
    expect(html).toContain('Create');
  });

  it('should return HTML for edit label', () => {
    mocks.state.taskLabels = [{ id: 'label_1', name: 'Urgent', color: '#FF0000' }];
    mocks.state.showLabelModal = true;
    mocks.state.editingLabelId = 'label_1';
    const html = renderLabelModalHtml();
    expect(html).toContain('Edit Tag');
    expect(html).toContain('Save');
    expect(html).toContain('Delete');
    expect(html).toContain('Urgent');
  });
});

describe('entity-modals: renderPersonModalHtml()', () => {
  it('should return empty string when modal is closed', () => {
    mocks.state.showPersonModal = false;
    expect(renderPersonModalHtml()).toBe('');
  });

  it('should return HTML for new person', () => {
    mocks.state.showPersonModal = true;
    const html = renderPersonModalHtml();
    expect(html).toContain('New Person');
    expect(html).toContain('person-name');
    expect(html).toContain('person-email');
    expect(html).toContain('Create');
  });

  it('should return HTML for edit person', () => {
    mocks.state.taskPeople = [{ id: 'person_1', name: 'Alice', email: 'alice@test.com' }];
    mocks.state.showPersonModal = true;
    mocks.state.editingPersonId = 'person_1';
    const html = renderPersonModalHtml();
    expect(html).toContain('Edit Person');
    expect(html).toContain('Save');
    expect(html).toContain('Delete');
    expect(html).toContain('Alice');
    expect(html).toContain('alice@test.com');
  });

  it('should render avatar when person has photoData', () => {
    mocks.state.taskPeople = [{ id: 'person_2', name: 'Bob', email: '', photoData: 'data:image/png;base64,abc' }];
    mocks.state.showPersonModal = true;
    mocks.state.editingPersonId = 'person_2';
    const html = renderPersonModalHtml();
    expect(html).toContain('avatar');
  });
});


// ############################################################################
// CALENDAR VIEW — renderCalendarView
// ############################################################################
describe('calendar-view: renderCalendarView()', () => {
  it('should render calendar grid in month mode', () => {
    mocks.state.calendarViewMode = 'month';
    const html = renderCalendarView();
    expect(html).toContain('Calendar');
    expect(html).toContain('January');
    expect(html).toContain('2026');
    expect(html).toContain('calendar-grid');
    expect(html).toContain('Sun');
    expect(html).toContain('Mon');
  });

  it('should highlight today in the grid', () => {
    mocks.state.calendarViewMode = 'month';
    const html = renderCalendarView();
    expect(html).toContain('Today');
  });

  it('should show view mode buttons', () => {
    const html = renderCalendarView();
    expect(html).toContain('Month');
    expect(html).toContain('Week');
    expect(html).toContain('3 Days');
    expect(html).toContain('Day Timeline');
    expect(html).toContain('Week Timeline');
  });

  it('should show events sidebar section', () => {
    const html = renderCalendarView();
    expect(html).toContain('Events');
    expect(html).toContain('No events for');
  });

  it('should show today sidebar section', () => {
    const html = renderCalendarView();
    expect(html).toContain('No tasks for today');
  });

  it('should show tasks due on calendar cells', () => {
    mocks.getTasksForDate.mockImplementation(dateStr => {
      if (dateStr === '2026-01-15') {
        return [{ id: 't1', title: 'Important Task', dueDate: '2026-01-15', completed: false }];
      }
      return [];
    });
    mocks.state.calendarViewMode = 'month';
    const html = renderCalendarView();
    expect(html).toContain('Important Task');
  });

  it('should show Google Calendar events from sidebar', () => {
    window.getGCalEventsForDate = vi.fn(dateStr => {
      if (dateStr === '2026-01-15') {
        return [makeEvent()];
      }
      return [];
    });
    const html = renderCalendarView();
    expect(html).toContain('Team Standup');
  });

  it('should show token expired banner when gcalTokenExpired is true', () => {
    mocks.state.gcalTokenExpired = true;
    const html = renderCalendarView();
    expect(html).toContain('Google Calendar session expired');
    expect(html).toContain('Reconnect');
  });

  it('should not show token banner when gcalTokenExpired is false', () => {
    mocks.state.gcalTokenExpired = false;
    const html = renderCalendarView();
    expect(html).not.toContain('Google Calendar session expired');
  });

  it('should show scheduled sidebar when tasks due on selected date', () => {
    mocks.getTasksForDate.mockImplementation(dateStr => {
      if (dateStr === '2026-01-15') {
        return [{ id: 't1', title: 'Due Task', dueDate: '2026-01-15', completed: false }];
      }
      return [];
    });
    const html = renderCalendarView();
    expect(html).toContain('Scheduled');
    expect(html).toContain('Due');
  });

  it('should render meeting notes page when calendarMeetingNotesEventKey is set', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {
      'cal_1::instance::evt_1': { eventKey: 'cal_1::instance::evt_1', content: '' }
    };
    const html = renderCalendarView();
    expect(html).toContain('Meeting Notes');
    expect(html).toContain('Team Standup');
  });

  it('should show syncing indicator', () => {
    mocks.state.gcalSyncing = true;
    const html = renderCalendarView();
    expect(html).toContain('Syncing...');
  });

  it('should mark active view mode button', () => {
    mocks.state.calendarViewMode = 'week';
    const html = renderCalendarView();
    expect(html).toContain("setCalendarViewMode('week')");
  });
});


// ############################################################################
// CALENDAR MEETING — q() escape quotes
// ############################################################################
describe('calendar-meeting: q()', () => {
  it('should escape single quotes', () => {
    expect(q("it's")).toBe("it\\'s");
  });

  it('should escape double quotes as HTML entity', () => {
    expect(q('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('should escape backslashes', () => {
    expect(q('path\\to')).toBe('path\\\\to');
  });

  it('should handle null/undefined', () => {
    expect(q(null)).toBe('');
    expect(q(undefined)).toBe('');
  });

  it('should handle empty string', () => {
    expect(q('')).toBe('');
  });

  it('should handle combined special chars', () => {
    expect(q("it's a \"test\" with \\path")).toBe("it\\'s a &quot;test&quot; with \\\\path");
  });
});


// ############################################################################
// CALENDAR MEETING — hasMeetingNotes()
// ############################################################################
describe('calendar-meeting: hasMeetingNotes()', () => {
  it('should return false for null/undefined event', () => {
    expect(hasMeetingNotes(null)).toBe(false);
    expect(hasMeetingNotes(undefined)).toBe(false);
  });

  it('should return false when no meeting notes exist', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    expect(hasMeetingNotes(evt)).toBe(false);
  });

  it('should return true when meetingNotesByEvent has doc for instance key', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = { 'cal_1::instance::evt_1': { content: 'notes' } };
    expect(hasMeetingNotes(evt)).toBe(true);
  });

  it('should return true when tasks are linked via meetingEventKey', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [{ id: 't1', meetingEventKey: 'cal_1::instance::evt_1' }];
    expect(hasMeetingNotes(evt)).toBe(true);
  });

  it('should check series key for recurring events', () => {
    const evt = makeEvent({ recurringEventId: 'recurring_1' });
    mocks.state.meetingNotesByEvent = { 'cal_1::series::recurring_1': { content: 'series notes' } };
    mocks.state.tasksData = [];
    expect(hasMeetingNotes(evt)).toBe(true);
  });
});


// ############################################################################
// CALENDAR MEETING — getSelectedModalEvent()
// ############################################################################
describe('calendar-meeting: getSelectedModalEvent()', () => {
  it('should return null when modal is not open', () => {
    mocks.state.calendarEventModalOpen = false;
    expect(getSelectedModalEvent()).toBe(null);
  });

  it('should return event when modal is open with matching event', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarEventModalOpen = true;
    mocks.state.calendarEventModalCalendarId = 'cal_1';
    mocks.state.calendarEventModalEventId = 'evt_1';
    expect(getSelectedModalEvent()).toBe(evt);
  });

  it('should return null when event not found', () => {
    mocks.state.gcalEvents = [];
    mocks.state.calendarEventModalOpen = true;
    mocks.state.calendarEventModalCalendarId = 'cal_1';
    mocks.state.calendarEventModalEventId = 'nonexistent';
    expect(getSelectedModalEvent()).toBe(null);
  });
});


// ############################################################################
// CALENDAR MEETING — openCalendarEventActions / closeCalendarEventActions
// ############################################################################
describe('calendar-meeting: openCalendarEventActions()', () => {
  it('should set modal state when event exists and has no notes', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];

    openCalendarEventActions('cal_1', 'evt_1');

    expect(mocks.state.calendarEventModalOpen).toBe(true);
    expect(mocks.state.calendarEventModalCalendarId).toBe('cal_1');
    expect(mocks.state.calendarEventModalEventId).toBe('evt_1');
    expect(window.render).toHaveBeenCalled();
  });

  it('should redirect to meeting notes when event has notes', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.meetingNotesByEvent = { 'cal_1::instance::evt_1': { eventKey: 'cal_1::instance::evt_1', content: 'notes' } };

    openCalendarEventActions('cal_1', 'evt_1');

    // Should open meeting notes instead of actions modal
    expect(mocks.state.calendarMeetingNotesEventKey).toBe('cal_1::instance::evt_1');
    expect(mocks.state.calendarEventModalOpen).toBe(false);
  });

  it('should do nothing when event not found', () => {
    mocks.state.gcalEvents = [];
    openCalendarEventActions('cal_1', 'nonexistent');
    expect(mocks.state.calendarEventModalOpen).toBe(false);
    expect(window.render).not.toHaveBeenCalled();
  });
});

describe('calendar-meeting: closeCalendarEventActions()', () => {
  it('should clear modal state', () => {
    mocks.state.calendarEventModalOpen = true;
    mocks.state.calendarEventModalCalendarId = 'cal_1';
    mocks.state.calendarEventModalEventId = 'evt_1';

    closeCalendarEventActions();

    expect(mocks.state.calendarEventModalOpen).toBe(false);
    expect(mocks.state.calendarEventModalCalendarId).toBe(null);
    expect(mocks.state.calendarEventModalEventId).toBe(null);
    expect(window.render).toHaveBeenCalled();
  });
});


// ############################################################################
// CALENDAR MEETING — openCalendarMeetingNotes
// ############################################################################
describe('calendar-meeting: openCalendarMeetingNotes()', () => {
  it('should create meeting note doc and set event key', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.meetingNotesByEvent = {};

    openCalendarMeetingNotes('cal_1', 'evt_1');

    expect(mocks.state.calendarMeetingNotesEventKey).toBe('cal_1::instance::evt_1');
    expect(mocks.state.calendarEventModalOpen).toBe(false);
    expect(mocks.state.meetingNotesByEvent['cal_1::instance::evt_1']).toBeDefined();
    expect(window.render).toHaveBeenCalled();
  });

  it('should do nothing when event not found', () => {
    mocks.state.gcalEvents = [];
    openCalendarMeetingNotes('cal_1', 'nonexistent');
    expect(mocks.state.calendarMeetingNotesEventKey).toBe(null);
  });
});


// ############################################################################
// CALENDAR MEETING — openCalendarMeetingNotesByEventKey
// ############################################################################
describe('calendar-meeting: openCalendarMeetingNotesByEventKey()', () => {
  it('should set event key and switch to calendar tab', () => {
    openCalendarMeetingNotesByEventKey('cal_1::instance::evt_1');

    expect(mocks.state.calendarMeetingNotesEventKey).toBe('cal_1::instance::evt_1');
    expect(mocks.state.activeTab).toBe('calendar');
    expect(mocks.state.calendarEventModalOpen).toBe(false);
    expect(window.render).toHaveBeenCalled();
  });

  it('should set scope to series when event key has series scope', () => {
    openCalendarMeetingNotesByEventKey('cal_1::series::recurring_1');
    expect(mocks.state.calendarMeetingNotesScope).toBe('series');
  });

  it('should set scope to instance for instance keys', () => {
    openCalendarMeetingNotesByEventKey('cal_1::instance::evt_1');
    expect(mocks.state.calendarMeetingNotesScope).toBe('instance');
  });

  it('should do nothing for empty key', () => {
    openCalendarMeetingNotesByEventKey('');
    expect(window.render).not.toHaveBeenCalled();
  });
});

describe('calendar-meeting: openCalendarMeetingWorkspaceByEventKey()', () => {
  it('should be an alias for openCalendarMeetingNotesByEventKey', () => {
    openCalendarMeetingWorkspaceByEventKey('cal_1::instance::evt_1');
    expect(mocks.state.calendarMeetingNotesEventKey).toBe('cal_1::instance::evt_1');
    expect(mocks.state.activeTab).toBe('calendar');
  });
});


// ############################################################################
// CALENDAR MEETING — setCalendarMeetingNotesScope
// ############################################################################
describe('calendar-meeting: setCalendarMeetingNotesScope()', () => {
  it('should ignore invalid scope values', () => {
    setCalendarMeetingNotesScope('invalid');
    expect(window.render).not.toHaveBeenCalled();
  });

  it('should set scope to series', () => {
    mocks.state.calendarMeetingNotesScope = 'instance';
    setCalendarMeetingNotesScope('series');
    expect(mocks.state.calendarMeetingNotesScope).toBe('series');
    expect(window.render).toHaveBeenCalled();
  });

  it('should set scope to instance', () => {
    mocks.state.calendarMeetingNotesScope = 'series';
    setCalendarMeetingNotesScope('instance');
    expect(mocks.state.calendarMeetingNotesScope).toBe('instance');
    expect(window.render).toHaveBeenCalled();
  });

  it('should migrate linked tasks from instance to series when promoting', () => {
    const evt = makeEvent({ recurringEventId: 'recurring_1' });
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.calendarMeetingNotesScope = 'instance';
    mocks.state.meetingNotesByEvent = {
      'cal_1::instance::evt_1': { eventKey: 'cal_1::instance::evt_1', content: 'some notes' }
    };
    mocks.state.tasksData = [
      { id: 't1', meetingEventKey: 'cal_1::instance::evt_1' }
    ];

    setCalendarMeetingNotesScope('series');

    // Task should have been migrated to series key
    expect(mocks.state.tasksData[0].meetingEventKey).toBe('cal_1::series::recurring_1');
    expect(window.saveTasksData).toHaveBeenCalled();
    // Meeting note doc should exist at series key
    expect(mocks.state.meetingNotesByEvent['cal_1::series::recurring_1']).toBeDefined();
    expect(mocks.state.meetingNotesByEvent['cal_1::series::recurring_1'].content).toBe('some notes');
  });
});


// ############################################################################
// CALENDAR MEETING — toggleCalendarMobilePanel
// ############################################################################
describe('calendar-meeting: toggleCalendarMobilePanel()', () => {
  it('should toggle today panel', () => {
    mocks.state.calendarMobileShowToday = false;
    toggleCalendarMobilePanel('today');
    expect(mocks.state.calendarMobileShowToday).toBe(true);
    expect(window.render).toHaveBeenCalled();
  });

  it('should toggle events panel', () => {
    mocks.state.calendarMobileShowEvents = false;
    toggleCalendarMobilePanel('events');
    expect(mocks.state.calendarMobileShowEvents).toBe(true);
  });

  it('should toggle scheduled panel', () => {
    mocks.state.calendarMobileShowScheduled = true;
    toggleCalendarMobilePanel('scheduled');
    expect(mocks.state.calendarMobileShowScheduled).toBe(false);
  });

  it('should toggle today panel back to false', () => {
    mocks.state.calendarMobileShowToday = true;
    toggleCalendarMobilePanel('today');
    expect(mocks.state.calendarMobileShowToday).toBe(false);
  });
});


// ############################################################################
// CALENDAR MEETING — closeCalendarMeetingNotes
// ############################################################################
describe('calendar-meeting: closeCalendarMeetingNotes()', () => {
  it('should clear event key and render', () => {
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    closeCalendarMeetingNotes();
    expect(mocks.state.calendarMeetingNotesEventKey).toBe(null);
    expect(window.render).toHaveBeenCalled();
  });
});


// ############################################################################
// CALENDAR MEETING — convertCalendarEventToTask
// ############################################################################
describe('calendar-meeting: convertCalendarEventToTask()', () => {
  it('should create task from event', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];

    convertCalendarEventToTask('cal_1', 'evt_1');

    expect(window.createTask).toHaveBeenCalled();
    const args = window.createTask.mock.calls[0];
    expect(args[0]).toBe('Team Standup');
    expect(args[1].status).toBe('anytime');
    expect(args[1].dueDate).toBe('2026-01-15');
    expect(mocks.state.calendarEventModalOpen).toBe(false);
    expect(window.render).toHaveBeenCalled();
  });

  it('should create follow-up task with shifted due date', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];

    convertCalendarEventToTask('cal_1', 'evt_1', 3);

    const args = window.createTask.mock.calls[0];
    expect(args[0]).toBe('Follow up: Team Standup');
    expect(args[1].dueDate).toBe('2026-01-18');
  });

  it('should do nothing when event not found', () => {
    mocks.state.gcalEvents = [];
    convertCalendarEventToTask('cal_1', 'nonexistent');
    expect(window.createTask).not.toHaveBeenCalled();
  });

  it('should include description and htmlLink in notes', () => {
    const evt = makeEvent({ description: 'Meeting notes', htmlLink: 'https://link.com' });
    mocks.state.gcalEvents = [evt];

    convertCalendarEventToTask('cal_1', 'evt_1');

    const args = window.createTask.mock.calls[0];
    expect(args[1].notes).toContain('Meeting notes');
    expect(args[1].notes).toContain('https://link.com');
  });

  it('should use meetingEventKey from getEventKey', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];

    convertCalendarEventToTask('cal_1', 'evt_1');

    const args = window.createTask.mock.calls[0];
    expect(args[1].meetingEventKey).toContain('cal_1');
    expect(args[1].meetingEventKey).toContain('evt_1');
  });
});


// ############################################################################
// CALENDAR MEETING — startCalendarEventDrag / clearCalendarEventDrag
// ############################################################################
describe('calendar-meeting: startCalendarEventDrag()', () => {
  it('should set draggedCalendarEvent state', () => {
    startCalendarEventDrag('cal_1', 'evt_1');
    expect(mocks.state.draggedCalendarEvent).toEqual({ calendarId: 'cal_1', eventId: 'evt_1' });
  });
});

describe('calendar-meeting: clearCalendarEventDrag()', () => {
  it('should clear draggedCalendarEvent state', () => {
    mocks.state.draggedCalendarEvent = { calendarId: 'cal_1', eventId: 'evt_1' };
    clearCalendarEventDrag();
    expect(mocks.state.draggedCalendarEvent).toBe(null);
  });
});


// ############################################################################
// CALENDAR MEETING — dropCalendarEventToSlot
// ############################################################################
describe('calendar-meeting: dropCalendarEventToSlot()', () => {
  it('should call rescheduleGCalEventIfConnected with event, date and hour', async () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.draggedCalendarEvent = { calendarId: 'cal_1', eventId: 'evt_1' };

    await dropCalendarEventToSlot('2026-01-20', 14);

    expect(window.rescheduleGCalEventIfConnected).toHaveBeenCalledWith(evt, '2026-01-20', 14);
    expect(mocks.state.draggedCalendarEvent).toBe(null);
  });

  it('should do nothing when no drag event', async () => {
    mocks.state.draggedCalendarEvent = null;
    await dropCalendarEventToSlot('2026-01-20', 14);
    expect(window.rescheduleGCalEventIfConnected).not.toHaveBeenCalled();
  });

  it('should clear drag state even when event not found', async () => {
    mocks.state.gcalEvents = [];
    mocks.state.draggedCalendarEvent = { calendarId: 'cal_1', eventId: 'nonexistent' };
    await dropCalendarEventToSlot('2026-01-20', 14);
    expect(mocks.state.draggedCalendarEvent).toBe(null);
    expect(window.rescheduleGCalEventIfConnected).not.toHaveBeenCalled();
  });
});


// ############################################################################
// CALENDAR MEETING — addMeetingLinkedItem
// ############################################################################
describe('calendar-meeting: addMeetingLinkedItem()', () => {
  it('should create a note item linked to meeting', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const input = document.createElement('input');
    input.id = 'meeting-item-input';
    input.value = 'Action item from meeting';
    document.body.appendChild(input);

    addMeetingLinkedItem('note');

    expect(window.createTask).toHaveBeenCalledWith('Action item from meeting', expect.objectContaining({
      isNote: true,
      status: 'anytime',
      meetingEventKey: 'cal_1::instance::evt_1',
    }));
    expect(input.value).toBe('');
    expect(window.render).toHaveBeenCalled();
  });

  it('should create a task item when type is task', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const input = document.createElement('input');
    input.id = 'meeting-item-input';
    input.value = 'Follow up on decision';
    document.body.appendChild(input);

    addMeetingLinkedItem('task');

    expect(window.createTask).toHaveBeenCalledWith('Follow up on decision', expect.objectContaining({
      isNote: false,
    }));
  });

  it('should do nothing when input is empty', () => {
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    const input = document.createElement('input');
    input.id = 'meeting-item-input';
    input.value = '';
    document.body.appendChild(input);

    addMeetingLinkedItem('note');
    expect(window.createTask).not.toHaveBeenCalled();
  });

  it('should do nothing when no event key set', () => {
    mocks.state.calendarMeetingNotesEventKey = null;
    addMeetingLinkedItem('note');
    expect(window.createTask).not.toHaveBeenCalled();
  });
});


// ############################################################################
// CALENDAR MEETING — addDiscussionItemToMeeting
// ############################################################################
describe('calendar-meeting: addDiscussionItemToMeeting()', () => {
  it('should link existing task to meeting', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = { 'cal_1::instance::evt_1': { eventKey: 'cal_1::instance::evt_1', content: '' } };
    mocks.state.tasksData = [{ id: 't1', title: 'Discuss X', meetingEventKey: null }];

    addDiscussionItemToMeeting('t1');

    expect(window.updateTask).toHaveBeenCalledWith('t1', { meetingEventKey: 'cal_1::instance::evt_1' });
    expect(window.render).toHaveBeenCalled();
  });

  it('should not re-link task already linked to this meeting', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = { 'cal_1::instance::evt_1': { eventKey: 'cal_1::instance::evt_1', content: '' } };
    mocks.state.tasksData = [{ id: 't1', meetingEventKey: 'cal_1::instance::evt_1' }];

    addDiscussionItemToMeeting('t1');

    expect(window.updateTask).not.toHaveBeenCalled();
  });

  it('should do nothing when taskId is empty', () => {
    addDiscussionItemToMeeting('');
    expect(window.updateTask).not.toHaveBeenCalled();
  });

  it('should do nothing when no event key set', () => {
    mocks.state.calendarMeetingNotesEventKey = null;
    addDiscussionItemToMeeting('t1');
    expect(window.updateTask).not.toHaveBeenCalled();
  });

  it('should do nothing when task not found', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = { 'cal_1::instance::evt_1': { eventKey: 'cal_1::instance::evt_1', content: '' } };
    mocks.state.tasksData = [];

    addDiscussionItemToMeeting('nonexistent');
    expect(window.updateTask).not.toHaveBeenCalled();
  });
});


// ############################################################################
// CALENDAR MEETING — handleMeetingItemInputKeydown
// ############################################################################
describe('calendar-meeting: handleMeetingItemInputKeydown()', () => {
  it('should call addMeetingLinkedItem on Enter key', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const input = document.createElement('input');
    input.id = 'meeting-item-input';
    input.value = 'New item';
    document.body.appendChild(input);

    const keyEvent = { key: 'Enter', preventDefault: vi.fn() };
    handleMeetingItemInputKeydown(keyEvent, 'note');

    expect(keyEvent.preventDefault).toHaveBeenCalled();
    expect(window.createTask).toHaveBeenCalled();
  });

  it('should not do anything on non-Enter key', () => {
    const keyEvent = { key: 'Tab', preventDefault: vi.fn() };
    handleMeetingItemInputKeydown(keyEvent, 'note');
    expect(keyEvent.preventDefault).not.toHaveBeenCalled();
    expect(window.createTask).not.toHaveBeenCalled();
  });
});


// ############################################################################
// CALENDAR MEETING — renderMeetingNotesPage
// ############################################################################
describe('calendar-meeting: renderMeetingNotesPage()', () => {
  it('should show "no longer in sync window" when event not found', () => {
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::gone';
    mocks.state.gcalEvents = [];

    const html = renderMeetingNotesPage();
    expect(html).toContain('no longer in the current sync window');
    expect(html).toContain('Back to Calendar');
  });

  it('should render full meeting notes page with event details', () => {
    const evt = makeEvent({ attendees: [{ email: 'alice@test.com', displayName: 'Alice' }] });
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const html = renderMeetingNotesPage();
    expect(html).toContain('Meeting Notes');
    expect(html).toContain('Team Standup');
    expect(html).toContain('meeting-item-input');
    expect(html).toContain('Add Bullet');
    expect(html).toContain('Add Task');
    expect(html).toContain('Discussion Pool');
    expect(html).toContain('Attendees');
    expect(html).toContain('Alice');
  });

  it('should show scope toggle for recurring events', () => {
    const evt = makeEvent({ recurringEventId: 'recurring_1' });
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const html = renderMeetingNotesPage();
    expect(html).toContain('Instance');
    expect(html).toContain('Series');
  });

  it('should not show scope toggle for non-recurring events', () => {
    const evt = makeEvent({ recurringEventId: null });
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const html = renderMeetingNotesPage();
    expect(html).not.toContain('Instance</button>');
  });

  it('should show linked items', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [
      { id: 't1', title: 'Action item', meetingEventKey: 'cal_1::instance::evt_1', completed: false, isNote: true },
    ];

    const html = renderMeetingNotesPage();
    expect(html).toContain('Action item');
    expect(html).toContain('1 linked');
  });

  it('should show completed items in a details block', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [
      { id: 't1', title: 'Done item', meetingEventKey: 'cal_1::instance::evt_1', completed: true, isNote: false },
    ];

    const html = renderMeetingNotesPage();
    expect(html).toContain('1 completed');
    expect(html).toContain('Done item');
  });

  it('should show event description when present', () => {
    const evt = makeEvent({ description: '<p>Agenda: discuss roadmap</p>' });
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const html = renderMeetingNotesPage();
    expect(html).toContain('Original Event Note');
    expect(html).toContain('Agenda');
  });

  it('should show Back and Open Event buttons', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};

    const html = renderMeetingNotesPage();
    expect(html).toContain('Back');
    expect(html).toContain('Open Event');
    expect(html).toContain('Join');
  });

  it('should show "No bullet points yet" when no items linked', () => {
    const evt = makeEvent();
    mocks.state.gcalEvents = [evt];
    mocks.state.calendarMeetingNotesEventKey = 'cal_1::instance::evt_1';
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];

    const html = renderMeetingNotesPage();
    expect(html).toContain('No bullet points yet');
  });
});


// ############################################################################
// CALENDAR MEETING — renderEventActionsModal
// ############################################################################
describe('calendar-meeting: renderEventActionsModal()', () => {
  it('should return empty string when event is null', () => {
    expect(renderEventActionsModal(null)).toBe('');
  });

  it('should return empty string when event has meeting notes', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = { 'cal_1::instance::evt_1': { content: 'notes' } };
    expect(renderEventActionsModal(evt)).toBe('');
  });

  it('should render modal with event summary', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    const html = renderEventActionsModal(evt);
    expect(html).toContain('Team Standup');
    expect(html).toContain('modal-overlay');
  });

  it('should show meeting provider badge when present', () => {
    const evt = makeEvent({ meetingProvider: 'Google Meet' });
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    const html = renderEventActionsModal(evt);
    expect(html).toContain('Google Meet');
  });

  it('should show Google Calendar and meeting link buttons', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    const html = renderEventActionsModal(evt);
    expect(html).toContain('Google Calendar');
    expect(html).toContain('Join Google Meet');
  });

  it('should disable meeting button when no meeting link', () => {
    const evt = makeEvent({ meetingLink: null });
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    const html = renderEventActionsModal(evt);
    expect(html).toContain('No call link found');
    expect(html).toContain('disabled');
  });

  it('should show Create Meeting Notes action', () => {
    const evt = makeEvent();
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    const html = renderEventActionsModal(evt);
    expect(html).toContain('Create Meeting Notes');
    expect(html).toContain('Start linked notes/tasks for this event');
  });

  it('should disable Google Calendar link when htmlLink is missing', () => {
    const evt = makeEvent({ htmlLink: null });
    mocks.state.meetingNotesByEvent = {};
    mocks.state.tasksData = [];
    const html = renderEventActionsModal(evt);
    // Should have disabled state on the calendar button
    expect(html).toContain('cursor-not-allowed');
  });
});
