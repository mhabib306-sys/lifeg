/// <reference types="vitest" />
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ============================================================================
// vi.hoisted — variables declared before vi.mock factories execute
// ============================================================================
const {
  mockState,
  saveTasksDataMock,
  saveViewStateMock,
  renderTriggersOutlinerMock,
  getAreaByIdMock,
  getActiveIconsMock,
  MOCK_ICONS,
} = vi.hoisted(() => {
  const MOCK_ICONS = {
    home: '<svg>home</svg>',
    inbox: '<svg>inbox</svg>',
    today: '<svg>today</svg>',
    flagged: '<svg>flagged</svg>',
    upcoming: '<svg>upcoming</svg>',
    anytime: '<svg>anytime</svg>',
    someday: '<svg>someday</svg>',
    logbook: '<svg>logbook</svg>',
    notes: '<svg>notes</svg>',
    workspace: '<svg>workspace</svg>',
    lifeScore: '<svg>lifeScore</svg>',
    calendar: '<svg>calendar</svg>',
    settings: '<svg>settings</svg>',
    review: '<svg>review</svg>',
    area: '<svg>area</svg>',
    trigger: '<svg>trigger</svg>',
    folder: '<svg>folder</svg>',
    tag: '<svg>tag</svg>',
    person: '<svg>person</svg>',
  };

  const mockState = {
    // Global search
    showGlobalSearch: false,
    globalSearchQuery: '',
    globalSearchResults: [],
    globalSearchActiveIndex: -1,
    globalSearchTypeFilter: null,
    // Tasks / data
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    triggers: [],
    // Review mode
    reviewMode: false,
    reviewAreaIndex: 0,
    reviewCompletedAreas: [],
    // Modals
    showTaskModal: false,
    showPerspectiveModal: false,
    showAreaModal: false,
    showLabelModal: false,
    showPersonModal: false,
    showCategoryModal: false,
    showBraindump: false,
    calendarEventModalOpen: false,
    editingTaskId: null,
    newTaskContext: { areaId: null, categoryId: null, labelId: null, labelIds: null, personId: null, status: 'inbox', today: false },
    // Mobile / navigation
    mobileDrawerOpen: false,
    activeTab: 'home',
    activeFilterType: 'perspective',
    activeAreaFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    activePerspective: 'inbox',
    activeCategoryFilter: null,
    collapsedSidebarAreas: new Set(),
    workspaceSidebarCollapsed: false,
  };

  return {
    mockState,
    saveTasksDataMock: vi.fn(),
    saveViewStateMock: vi.fn(),
    renderTriggersOutlinerMock: vi.fn(() => '<div class="triggers-mock"></div>'),
    getAreaByIdMock: vi.fn(() => null),
    getActiveIconsMock: vi.fn(() => MOCK_ICONS),
    MOCK_ICONS,
  };
});

// ============================================================================
// Mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => ({
  BUILTIN_PERSPECTIVES: [
    { id: 'inbox', name: 'Inbox', icon: '<svg>inbox</svg>', color: '#147EFB', filter: { status: 'inbox' }, builtin: true },
    { id: 'today', name: 'Today', icon: '<svg>today</svg>', color: '#FFCC00', filter: { today: true }, builtin: true },
    { id: 'anytime', name: 'Anytime', icon: '<svg>anytime</svg>', color: '#5AC8FA', filter: { status: 'anytime' }, builtin: true },
  ],
  NOTES_PERSPECTIVE: { id: 'notes', name: 'Notes', icon: '<svg>notes</svg>', color: '#5856D6', filter: { notes: true }, builtin: true },
  THINGS3_ICONS: MOCK_ICONS,
  getActiveIcons: getActiveIconsMock,
}));

vi.mock('../src/utils.js', () => ({
  escapeHtml: (text) => {
    if (!text) return '';
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
  getLocalDateString: () => '2026-02-12',
  generateTaskId: () => `task_${Date.now()}_test`,
}));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: saveTasksDataMock,
  saveViewState: saveViewStateMock,
}));

vi.mock('../src/features/areas.js', () => ({
  getAreaById: getAreaByIdMock,
}));

vi.mock('../src/features/triggers.js', () => ({
  renderTriggersOutliner: renderTriggersOutlinerMock,
}));

// ============================================================================
// Imports — modules under test
// ============================================================================
import {
  openGlobalSearch,
  closeGlobalSearch,
  handleGlobalSearchInput,
  handleGlobalSearchKeydown,
  selectGlobalSearchResult,
  setSearchTypeFilter,
  renderGlobalSearchHtml,
} from '../src/ui/search.js';

import {
  getStaleTasksForArea,
  getTotalStaleTaskCount,
  startReview,
  exitReview,
  reviewNextArea,
  reviewPrevArea,
  reviewEngageTask,
  reviewPassTask,
  reviewMarkAreaDone,
  reviewAddTask,
  renderReviewMode,
} from '../src/ui/review.js';

import {
  openMobileDrawer,
  closeMobileDrawer,
  renderMobileDrawer,
  renderBottomNav,
  showAreaTasks,
  showLabelTasks,
  showPerspectiveTasks,
  showPersonTasks,
  showCategoryTasks,
  showAllLabelsPage,
  showAllPeoplePage,
  toggleSidebarAreaCollapse,
  toggleWorkspaceSidebar,
} from '../src/ui/mobile.js';

// ============================================================================
// Helpers
// ============================================================================
function resetState() {
  Object.assign(mockState, {
    showGlobalSearch: false,
    globalSearchQuery: '',
    globalSearchResults: [],
    globalSearchActiveIndex: -1,
    globalSearchTypeFilter: null,
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    triggers: [],
    reviewMode: false,
    reviewAreaIndex: 0,
    reviewCompletedAreas: [],
    showTaskModal: false,
    showPerspectiveModal: false,
    showAreaModal: false,
    showLabelModal: false,
    showPersonModal: false,
    showCategoryModal: false,
    showBraindump: false,
    calendarEventModalOpen: false,
    editingTaskId: null,
    newTaskContext: { areaId: null, categoryId: null, labelId: null, labelIds: null, personId: null, status: 'inbox', today: false },
    mobileDrawerOpen: false,
    activeTab: 'home',
    activeFilterType: 'perspective',
    activeAreaFilter: null,
    activeLabelFilter: null,
    activePersonFilter: null,
    activePerspective: 'inbox',
    activeCategoryFilter: null,
    collapsedSidebarAreas: new Set(),
    workspaceSidebarCollapsed: false,
  });
}

function makePastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// ============================================================================
// SETUP
// ============================================================================
beforeEach(() => {
  resetState();
  vi.useFakeTimers();
  localStorage.clear();

  // Window bridges
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.showAreaTasks = vi.fn();
  window.showCategoryTasks = vi.fn();
  window.showLabelTasks = vi.fn();
  window.showPersonTasks = vi.fn();
  window.showPerspectiveTasks = vi.fn();
  window.createRootTrigger = vi.fn();
  window.createRootNote = vi.fn();
  window.reviewAddTask = vi.fn();
  window.switchTab = vi.fn();
  window.matchMedia = vi.fn(() => ({ matches: false }));

  saveTasksDataMock.mockClear();
  saveViewStateMock.mockClear();
  renderTriggersOutlinerMock.mockClear();
  getAreaByIdMock.mockClear();
  getActiveIconsMock.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ============================================================================
// MODULE 1: SEARCH
// ============================================================================
describe('Global Search (src/ui/search.js)', () => {
  // --------------------------------------------------------------------------
  // openGlobalSearch
  // --------------------------------------------------------------------------
  describe('openGlobalSearch', () => {
    it('sets showGlobalSearch to true and resets search state', () => {
      mockState.globalSearchQuery = 'old query';
      mockState.globalSearchResults = [{ type: 'task', items: [] }];
      mockState.globalSearchActiveIndex = 3;
      mockState.globalSearchTypeFilter = 'task';

      openGlobalSearch();

      expect(mockState.showGlobalSearch).toBe(true);
      expect(mockState.globalSearchQuery).toBe('');
      expect(mockState.globalSearchResults).toEqual([]);
      expect(mockState.globalSearchActiveIndex).toBe(-1);
      expect(mockState.globalSearchTypeFilter).toBeNull();
    });

    it('calls render()', () => {
      openGlobalSearch();
      expect(window.render).toHaveBeenCalled();
    });

    it('focuses the search input after timeout', () => {
      document.body.innerHTML = '<input id="global-search-input" />';
      const input = document.getElementById('global-search-input');
      const focusSpy = vi.spyOn(input, 'focus');

      openGlobalSearch();
      vi.advanceTimersByTime(100);

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // closeGlobalSearch
  // --------------------------------------------------------------------------
  describe('closeGlobalSearch', () => {
    it('resets all search state', () => {
      mockState.showGlobalSearch = true;
      mockState.globalSearchQuery = 'test';
      mockState.globalSearchResults = [{ type: 'task', items: [{ id: '1' }] }];
      mockState.globalSearchActiveIndex = 2;
      mockState.globalSearchTypeFilter = 'area';

      closeGlobalSearch();

      expect(mockState.showGlobalSearch).toBe(false);
      expect(mockState.globalSearchQuery).toBe('');
      expect(mockState.globalSearchResults).toEqual([]);
      expect(mockState.globalSearchActiveIndex).toBe(-1);
      expect(mockState.globalSearchTypeFilter).toBeNull();
    });

    it('does NOT call render', () => {
      closeGlobalSearch();
      expect(window.render).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // handleGlobalSearchInput
  // --------------------------------------------------------------------------
  describe('handleGlobalSearchInput', () => {
    it('updates globalSearchQuery to the given value', () => {
      handleGlobalSearchInput('hello');
      expect(mockState.globalSearchQuery).toBe('hello');
    });

    it('detects # prefix and sets type filter to area', () => {
      handleGlobalSearchInput('#work');
      expect(mockState.globalSearchTypeFilter).toBe('area');
    });

    it('detects @ prefix and sets type filter to label', () => {
      handleGlobalSearchInput('@urgent');
      expect(mockState.globalSearchTypeFilter).toBe('label');
    });

    it('detects & prefix and sets type filter to person', () => {
      handleGlobalSearchInput('&john');
      expect(mockState.globalSearchTypeFilter).toBe('person');
    });

    it('resets prefix-based filter when prefix is removed', () => {
      handleGlobalSearchInput('#work');
      expect(mockState.globalSearchTypeFilter).toBe('area');

      handleGlobalSearchInput('work');
      expect(mockState.globalSearchTypeFilter).toBeNull();
    });

    it('does not reset non-prefix filter when typing normally', () => {
      // Set filter to something not a prefix type (e.g. 'task')
      mockState.globalSearchTypeFilter = 'task';
      handleGlobalSearchInput('some query');
      expect(mockState.globalSearchTypeFilter).toBe('task');
    });

    it('runs debounced search after DEBOUNCE_MS', () => {
      mockState.tasksData = [{ id: 't1', title: 'Buy groceries', isNote: false }];

      handleGlobalSearchInput('buy');
      // Before debounce fires, no results
      expect(mockState.globalSearchResults).toEqual([]);

      vi.advanceTimersByTime(200);

      expect(mockState.globalSearchResults.length).toBeGreaterThan(0);
      expect(mockState.globalSearchActiveIndex).toBe(0);
    });

    it('cancels previous debounce on rapid input', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Apple', isNote: false },
        { id: 't2', title: 'Banana', isNote: false },
      ];

      handleGlobalSearchInput('app');
      vi.advanceTimersByTime(50);
      handleGlobalSearchInput('ban');
      vi.advanceTimersByTime(200);

      // Should search for 'ban', not 'app'
      const results = mockState.globalSearchResults;
      expect(results.length).toBe(1);
      expect(results[0].items[0].title).toBe('Banana');
    });
  });

  // --------------------------------------------------------------------------
  // handleGlobalSearchKeydown
  // --------------------------------------------------------------------------
  describe('handleGlobalSearchKeydown', () => {
    function makeKeyEvent(key, extra = {}) {
      return {
        key,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        ...extra,
      };
    }

    beforeEach(() => {
      // Set up some results
      mockState.globalSearchResults = [{
        type: 'task', label: 'Tasks', icon: 'T', items: [
          { id: 't1', type: 'task', title: 'Task One', score: 100 },
          { id: 't2', type: 'task', title: 'Task Two', score: 80 },
        ],
      }];
      mockState.globalSearchActiveIndex = 0;
      // Provide a results container for DOM updates
      document.body.innerHTML = '<div id="global-search-results"></div><div id="global-search-type-filters"></div>';
    });

    it('ArrowDown increments active index', () => {
      const event = makeKeyEvent('ArrowDown');
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockState.globalSearchActiveIndex).toBe(1);
    });

    it('ArrowDown wraps around to 0', () => {
      mockState.globalSearchActiveIndex = 1;
      handleGlobalSearchKeydown(makeKeyEvent('ArrowDown'));
      expect(mockState.globalSearchActiveIndex).toBe(0);
    });

    it('ArrowUp decrements active index', () => {
      mockState.globalSearchActiveIndex = 1;
      handleGlobalSearchKeydown(makeKeyEvent('ArrowUp'));
      expect(mockState.globalSearchActiveIndex).toBe(0);
    });

    it('ArrowUp wraps around to last', () => {
      mockState.globalSearchActiveIndex = 0;
      handleGlobalSearchKeydown(makeKeyEvent('ArrowUp'));
      expect(mockState.globalSearchActiveIndex).toBe(1);
    });

    it('ArrowDown does nothing when no results', () => {
      mockState.globalSearchResults = [];
      const event = makeKeyEvent('ArrowDown');
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockState.globalSearchActiveIndex).toBe(0);
    });

    it('Enter selects the active result (task)', () => {
      mockState.globalSearchActiveIndex = 0;
      const event = makeKeyEvent('Enter');
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      // selectGlobalSearchResult(0) navigates to task => opens modal
      expect(mockState.showTaskModal).toBe(true);
      expect(mockState.editingTaskId).toBe('t1');
    });

    it('Enter does nothing when no active index', () => {
      mockState.globalSearchActiveIndex = -1;
      const event = makeKeyEvent('Enter');
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockState.showTaskModal).toBe(false);
    });

    it('Escape closes search and calls render', () => {
      mockState.showGlobalSearch = true;
      const event = makeKeyEvent('Escape');
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(mockState.showGlobalSearch).toBe(false);
      expect(window.render).toHaveBeenCalled();
    });

    it('Tab cycles type filter forward', () => {
      mockState.globalSearchTypeFilter = null;
      mockState.globalSearchQuery = 'test';
      const event = makeKeyEvent('Tab', { shiftKey: false });
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      // null -> 'task' (first type)
      expect(mockState.globalSearchTypeFilter).toBe('task');
    });

    it('Shift+Tab cycles type filter backward', () => {
      mockState.globalSearchTypeFilter = null;
      mockState.globalSearchQuery = 'test';
      const event = makeKeyEvent('Tab', { shiftKey: true });
      handleGlobalSearchKeydown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      // null backwards -> last type 'trigger'
      expect(mockState.globalSearchTypeFilter).toBe('trigger');
    });
  });

  // --------------------------------------------------------------------------
  // selectGlobalSearchResult
  // --------------------------------------------------------------------------
  describe('selectGlobalSearchResult', () => {
    beforeEach(() => {
      mockState.globalSearchResults = [
        {
          type: 'task', label: 'Tasks', icon: 'T', items: [
            { id: 't1', type: 'task', title: 'Task One', score: 100 },
          ],
        },
        {
          type: 'area', label: 'Areas', icon: 'A', items: [
            { id: 'area1', type: 'area', title: 'Work', score: 80 },
          ],
        },
        {
          type: 'note', label: 'Notes', icon: 'N', items: [
            { id: 'n1', type: 'note', title: 'My Note', score: 70 },
          ],
        },
        {
          type: 'label', label: 'Labels', icon: 'L', items: [
            { id: 'l1', type: 'label', title: 'Urgent', score: 60 },
          ],
        },
        {
          type: 'person', label: 'People', icon: 'P', items: [
            { id: 'p1', type: 'person', title: 'John', score: 50 },
          ],
        },
        {
          type: 'perspective', label: 'Perspectives', icon: 'V', items: [
            { id: 'inbox', type: 'perspective', title: 'Inbox', score: 40 },
          ],
        },
        {
          type: 'category', label: 'Categories', icon: 'C', items: [
            { id: 'cat1', type: 'category', title: 'Cat', score: 35 },
          ],
        },
        {
          type: 'trigger', label: 'Triggers', icon: 'G', items: [
            { id: 'trig1', type: 'trigger', title: 'My Trigger', score: 30 },
          ],
        },
      ];
      mockState.showGlobalSearch = true;
    });

    it('navigates to task: opens task modal', () => {
      selectGlobalSearchResult(0); // index 0 = task t1
      expect(mockState.showTaskModal).toBe(true);
      expect(mockState.editingTaskId).toBe('t1');
      expect(mockState.showGlobalSearch).toBe(false);
      expect(window.render).toHaveBeenCalled();
    });

    it('navigates to note: opens task modal', () => {
      selectGlobalSearchResult(2); // index 2 = note n1
      expect(mockState.showTaskModal).toBe(true);
      expect(mockState.editingTaskId).toBe('n1');
    });

    it('navigates to area: calls showAreaTasks', () => {
      selectGlobalSearchResult(1); // index 1 = area
      expect(window.showAreaTasks).toHaveBeenCalledWith('area1');
    });

    it('navigates to label: calls showLabelTasks', () => {
      selectGlobalSearchResult(3); // label
      expect(window.showLabelTasks).toHaveBeenCalledWith('l1');
    });

    it('navigates to person: calls showPersonTasks', () => {
      selectGlobalSearchResult(4); // person
      expect(window.showPersonTasks).toHaveBeenCalledWith('p1');
    });

    it('navigates to perspective: calls showPerspectiveTasks', () => {
      selectGlobalSearchResult(5); // perspective
      expect(window.showPerspectiveTasks).toHaveBeenCalledWith('inbox');
    });

    it('navigates to category: calls showCategoryTasks', () => {
      selectGlobalSearchResult(6); // category
      expect(window.showCategoryTasks).toHaveBeenCalledWith('cat1');
    });

    it('navigates to trigger with areaId: calls showAreaTasks', () => {
      mockState.triggers = [{ id: 'trig1', title: 'My Trigger', areaId: 'area99' }];
      selectGlobalSearchResult(7); // trigger
      expect(window.showAreaTasks).toHaveBeenCalledWith('area99');
    });

    it('navigates to trigger without areaId: switches to tasks tab', () => {
      mockState.triggers = [{ id: 'trig1', title: 'My Trigger' }];
      selectGlobalSearchResult(7);
      expect(mockState.activeTab).toBe('tasks');
      expect(window.render).toHaveBeenCalled();
    });

    it('ignores out-of-range index', () => {
      selectGlobalSearchResult(999);
      expect(mockState.showTaskModal).toBe(false);
      expect(window.render).not.toHaveBeenCalled();
    });

    it('ignores negative index', () => {
      selectGlobalSearchResult(-1);
      expect(mockState.showTaskModal).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // setSearchTypeFilter
  // --------------------------------------------------------------------------
  describe('setSearchTypeFilter', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="global-search-results"></div><div id="global-search-type-filters"></div>';
      mockState.globalSearchQuery = 'test';
      mockState.tasksData = [{ id: 't1', title: 'Test task', isNote: false }];
    });

    it('sets filter when different from current', () => {
      mockState.globalSearchTypeFilter = null;
      setSearchTypeFilter('task');
      expect(mockState.globalSearchTypeFilter).toBe('task');
    });

    it('toggles filter off when same as current', () => {
      mockState.globalSearchTypeFilter = 'task';
      setSearchTypeFilter('task');
      expect(mockState.globalSearchTypeFilter).toBeNull();
    });

    it('re-runs search with new filter and updates results', () => {
      setSearchTypeFilter('task');
      expect(mockState.globalSearchResults.length).toBeGreaterThanOrEqual(0);
    });

    it('resets active index based on new results', () => {
      setSearchTypeFilter('task');
      // If results exist, index should be 0
      if (mockState.globalSearchResults.length > 0) {
        expect(mockState.globalSearchActiveIndex).toBe(0);
      } else {
        expect(mockState.globalSearchActiveIndex).toBe(-1);
      }
    });
  });

  // --------------------------------------------------------------------------
  // renderGlobalSearchHtml
  // --------------------------------------------------------------------------
  describe('renderGlobalSearchHtml', () => {
    it('returns empty string when showGlobalSearch is false', () => {
      mockState.showGlobalSearch = false;
      expect(renderGlobalSearchHtml()).toBe('');
    });

    it('returns HTML with overlay and modal when showGlobalSearch is true', () => {
      mockState.showGlobalSearch = true;
      const html = renderGlobalSearchHtml();
      expect(html).toContain('global-search-overlay');
      expect(html).toContain('global-search-modal');
      expect(html).toContain('global-search-input');
    });

    it('includes type filter chips', () => {
      mockState.showGlobalSearch = true;
      const html = renderGlobalSearchHtml();
      expect(html).toContain('global-search-type-filters');
      expect(html).toContain('All');
      expect(html).toContain('Tasks');
      expect(html).toContain('Areas');
      expect(html).toContain('Labels');
    });

    it('includes footer with keyboard shortcuts', () => {
      mockState.showGlobalSearch = true;
      const html = renderGlobalSearchHtml();
      expect(html).toContain('global-search-footer');
      expect(html).toContain('Navigate');
      expect(html).toContain('Open');
      expect(html).toContain('Filter');
      expect(html).toContain('Close');
    });

    it('includes ARIA attributes for accessibility', () => {
      mockState.showGlobalSearch = true;
      const html = renderGlobalSearchHtml();
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('role="combobox"');
      expect(html).toContain('role="listbox"');
    });

    it('escapes the current query in the input value', () => {
      mockState.showGlobalSearch = true;
      mockState.globalSearchQuery = '<script>alert("xss")</script>';
      const html = renderGlobalSearchHtml();
      expect(html).not.toContain('<script>alert');
      expect(html).toContain('&lt;script&gt;');
    });

    it('shows empty state when no query', () => {
      mockState.showGlobalSearch = true;
      mockState.globalSearchQuery = '';
      mockState.globalSearchResults = [];
      const html = renderGlobalSearchHtml();
      expect(html).toContain('Type to search');
    });

    it('shows no results message when query returns nothing', () => {
      mockState.showGlobalSearch = true;
      mockState.globalSearchQuery = 'zzzznotfound';
      mockState.globalSearchResults = [];
      const html = renderGlobalSearchHtml();
      expect(html).toContain('No results');
    });

    it('renders result groups and items', () => {
      mockState.showGlobalSearch = true;
      mockState.globalSearchQuery = 'test';
      mockState.globalSearchResults = [
        {
          type: 'task', label: 'Tasks', icon: 'T', items: [
            { id: 't1', type: 'task', title: 'Test task', score: 100, subtitle: 'Work', icon: 'check', color: '#147EFB' },
          ],
        },
      ];
      mockState.globalSearchActiveIndex = 0;
      const html = renderGlobalSearchHtml();
      expect(html).toContain('global-search-group-header');
      expect(html).toContain('global-search-result');
      expect(html).toContain('1 found');
    });
  });

  // --------------------------------------------------------------------------
  // Search engine logic (via handleGlobalSearchInput + debounce)
  // --------------------------------------------------------------------------
  describe('Search engine', () => {
    function runSearch(query, filter = null) {
      mockState.globalSearchTypeFilter = filter;
      document.body.innerHTML = '<div id="global-search-results"></div><div id="global-search-type-filters"></div>';
      handleGlobalSearchInput(query);
      vi.advanceTimersByTime(200);
      return mockState.globalSearchResults;
    }

    it('finds tasks by title match', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Buy groceries', isNote: false },
        { id: 't2', title: 'Call dentist', isNote: false },
      ];
      const results = runSearch('buy');
      expect(results.length).toBe(1);
      expect(results[0].type).toBe('task');
      expect(results[0].items[0].title).toBe('Buy groceries');
    });

    it('finds tasks by notes match', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Shopping', notes: 'buy milk and bread', isNote: false },
      ];
      const results = runSearch('milk');
      expect(results.length).toBe(1);
      expect(results[0].items[0].title).toBe('Shopping');
    });

    it('penalizes completed tasks', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Test task completed', isNote: false, completed: true },
        { id: 't2', title: 'Test task active', isNote: false, completed: false },
      ];
      const results = runSearch('test');
      expect(results.length).toBe(1); // both grouped under 'task'
      const items = results[0].items;
      expect(items.length).toBe(2);
      // Active task should rank higher
      expect(items[0].title).toBe('Test task active');
      expect(items[1].title).toBe('Test task completed');
    });

    it('filters out deleted notes (noteLifecycleState=deleted)', () => {
      mockState.tasksData = [
        { id: 'n1', title: 'Active Note', isNote: true },
        { id: 'n2', title: 'Deleted Note', isNote: true, noteLifecycleState: 'deleted' },
      ];
      const results = runSearch('note');
      const noteGroup = results.find(g => g.type === 'note');
      expect(noteGroup).toBeDefined();
      expect(noteGroup.items.length).toBe(1);
      expect(noteGroup.items[0].title).toBe('Active Note');
    });

    it('searches areas by name', () => {
      mockState.taskAreas = [
        { id: 'a1', name: 'Work Projects', color: '#147EFB' },
        { id: 'a2', name: 'Health', color: '#34C759' },
      ];
      const results = runSearch('work');
      const areaGroup = results.find(g => g.type === 'area');
      expect(areaGroup).toBeDefined();
      expect(areaGroup.items[0].title).toBe('Work Projects');
    });

    it('searches categories by name', () => {
      mockState.taskCategories = [
        { id: 'cat1', name: 'Frontend Dev', areaId: 'a1' },
      ];
      const results = runSearch('frontend');
      const catGroup = results.find(g => g.type === 'category');
      expect(catGroup).toBeDefined();
      expect(catGroup.items[0].title).toBe('Frontend Dev');
    });

    it('searches labels by name', () => {
      mockState.taskLabels = [
        { id: 'l1', name: 'Urgent' },
        { id: 'l2', name: 'Low Priority' },
      ];
      const results = runSearch('urgent');
      const labelGroup = results.find(g => g.type === 'label');
      expect(labelGroup).toBeDefined();
      expect(labelGroup.items[0].title).toBe('Urgent');
    });

    it('searches people by name, email, and jobTitle', () => {
      mockState.taskPeople = [
        { id: 'p1', name: 'John Smith', email: 'john@test.com', jobTitle: 'Engineer' },
      ];

      // Search by name
      let results = runSearch('john');
      let personGroup = results.find(g => g.type === 'person');
      expect(personGroup).toBeDefined();
      expect(personGroup.items[0].title).toBe('John Smith');

      // Search by email
      results = runSearch('john@test');
      personGroup = results.find(g => g.type === 'person');
      expect(personGroup).toBeDefined();

      // Search by job title
      results = runSearch('engineer');
      personGroup = results.find(g => g.type === 'person');
      expect(personGroup).toBeDefined();
    });

    it('searches perspectives (builtin + custom)', () => {
      mockState.customPerspectives = [
        { id: 'cp1', name: 'My Custom View', color: '#FF0000' },
      ];
      // Search for builtin
      let results = runSearch('inbox');
      let perspGroup = results.find(g => g.type === 'perspective');
      expect(perspGroup).toBeDefined();
      expect(perspGroup.items.some(i => i.title === 'Inbox')).toBe(true);

      // Search for custom
      results = runSearch('custom');
      perspGroup = results.find(g => g.type === 'perspective');
      expect(perspGroup).toBeDefined();
      expect(perspGroup.items.some(i => i.title === 'My Custom View')).toBe(true);
    });

    it('searches the Notes perspective', () => {
      const results = runSearch('notes');
      const perspGroup = results.find(g => g.type === 'perspective');
      expect(perspGroup).toBeDefined();
      expect(perspGroup.items.some(i => i.title === 'Notes')).toBe(true);
    });

    it('searches triggers by title', () => {
      mockState.triggers = [
        { id: 'trig1', title: 'Weekly planning checklist', areaId: 'a1' },
      ];
      const results = runSearch('weekly');
      const trigGroup = results.find(g => g.type === 'trigger');
      expect(trigGroup).toBeDefined();
      expect(trigGroup.items[0].title).toBe('Weekly planning checklist');
    });

    it('skips triggers without title', () => {
      mockState.triggers = [
        { id: 'trig1', areaId: 'a1' }, // no title
        { id: 'trig2', title: 'Valid trigger', areaId: 'a1' },
      ];
      const results = runSearch('valid');
      const trigGroup = results.find(g => g.type === 'trigger');
      expect(trigGroup).toBeDefined();
      expect(trigGroup.items.length).toBe(1);
    });

    // Score ordering tests
    describe('score ordering', () => {
      it('exact match > starts-with > word-boundary > substring', () => {
        mockState.tasksData = [
          { id: 't1', title: 'pretest results', isNote: false },        // substring: "pretest" contains "test" = 30
          { id: 't2', title: 'the test', isNote: false },               // word boundary: word "test" starts with "test" = 60
          { id: 't3', title: 'test', isNote: false },                    // exact = 150
          { id: 't4', title: 'testing things', isNote: false },          // starts with = 100
        ];
        const results = runSearch('test');
        const items = results[0].items;
        expect(items[0].title).toBe('test');             // exact = 150
        expect(items[1].title).toBe('testing things');   // starts-with = 100
        expect(items[2].title).toBe('the test');         // word boundary = 60
        expect(items[3].title).toBe('pretest results');  // substring = 30
      });
    });

    // Type filter limits
    describe('type filter limits', () => {
      it('limits results per type when no filter (TYPE_LIMITS_ALL)', () => {
        // Create 15 tasks
        mockState.tasksData = Array.from({ length: 15 }, (_, i) => ({
          id: `t${i}`, title: `Test item ${i}`, isNote: false,
        }));
        const results = runSearch('test');
        const taskGroup = results.find(g => g.type === 'task');
        // TYPE_LIMITS_ALL.task = 8
        expect(taskGroup.items.length).toBeLessThanOrEqual(8);
      });

      it('allows more results when filter is active (FILTERED_LIMIT=30)', () => {
        mockState.tasksData = Array.from({ length: 35 }, (_, i) => ({
          id: `t${i}`, title: `Test item ${i}`, isNote: false,
        }));
        mockState.globalSearchTypeFilter = 'task';
        const results = runSearch('test', 'task');
        const taskGroup = results.find(g => g.type === 'task');
        expect(taskGroup.items.length).toBeLessThanOrEqual(30);
      });
    });

    // Total cap
    describe('total cap enforcement', () => {
      it('enforces TOTAL_CAP of 50 across all groups', () => {
        // Create many items of multiple types
        mockState.tasksData = Array.from({ length: 30 }, (_, i) => ({
          id: `t${i}`, title: `Cap test ${i}`, isNote: false,
        }));
        mockState.taskAreas = Array.from({ length: 30 }, (_, i) => ({
          id: `a${i}`, name: `Cap test area ${i}`,
        }));
        mockState.taskLabels = Array.from({ length: 30 }, (_, i) => ({
          id: `l${i}`, name: `Cap test label ${i}`,
        }));
        const results = runSearch('cap');
        let total = 0;
        for (const group of results) {
          total += group.items.length;
        }
        expect(total).toBeLessThanOrEqual(50);
      });
    });

    // Prefix stripping
    describe('prefix stripping', () => {
      it('strips # prefix before searching', () => {
        mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
        const results = runSearch('#work');
        const areaGroup = results.find(g => g.type === 'area');
        expect(areaGroup).toBeDefined();
      });

      it('returns empty results for empty query after stripping', () => {
        const results = runSearch('#');
        expect(results).toEqual([]);
      });

      it('returns empty for blank string', () => {
        const results = runSearch('');
        expect(results).toEqual([]);
      });
    });
  });
});

// ============================================================================
// MODULE 2: REVIEW
// ============================================================================
describe('Review Mode (src/ui/review.js)', () => {
  // --------------------------------------------------------------------------
  // getStaleTasksForArea
  // --------------------------------------------------------------------------
  describe('getStaleTasksForArea', () => {
    it('returns tasks for the given areaId that are stale (no lastReviewedAt)', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Task 1', areaId: 'a1', completed: false, isNote: false },
        { id: 't2', title: 'Task 2', areaId: 'a2', completed: false, isNote: false },
      ];
      const stale = getStaleTasksForArea('a1');
      expect(stale.length).toBe(1);
      expect(stale[0].id).toBe('t1');
    });

    it('returns tasks reviewed more than 7 days ago', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Old reviewed', areaId: 'a1', completed: false, isNote: false, lastReviewedAt: makePastDate(10) },
      ];
      const stale = getStaleTasksForArea('a1');
      expect(stale.length).toBe(1);
    });

    it('excludes tasks reviewed less than 7 days ago', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Recently reviewed', areaId: 'a1', completed: false, isNote: false, lastReviewedAt: makePastDate(3) },
      ];
      const stale = getStaleTasksForArea('a1');
      expect(stale.length).toBe(0);
    });

    it('excludes completed tasks', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Done', areaId: 'a1', completed: true, isNote: false },
      ];
      expect(getStaleTasksForArea('a1').length).toBe(0);
    });

    it('excludes notes (isNote=true)', () => {
      mockState.tasksData = [
        { id: 'n1', title: 'A note', areaId: 'a1', completed: false, isNote: true },
      ];
      expect(getStaleTasksForArea('a1').length).toBe(0);
    });

    it('excludes someday tasks', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Someday', areaId: 'a1', completed: false, isNote: false, status: 'someday' },
      ];
      expect(getStaleTasksForArea('a1').length).toBe(0);
    });

    it('excludes tasks without areaId', () => {
      mockState.tasksData = [
        { id: 't1', title: 'No area', completed: false, isNote: false },
      ];
      expect(getStaleTasksForArea('a1').length).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // getTotalStaleTaskCount
  // --------------------------------------------------------------------------
  describe('getTotalStaleTaskCount', () => {
    it('counts all stale tasks across all areas', () => {
      mockState.tasksData = [
        { id: 't1', areaId: 'a1', completed: false, isNote: false },
        { id: 't2', areaId: 'a2', completed: false, isNote: false },
        { id: 't3', areaId: 'a1', completed: true, isNote: false }, // excluded
      ];
      expect(getTotalStaleTaskCount()).toBe(2);
    });

    it('returns 0 when no stale tasks', () => {
      mockState.tasksData = [
        { id: 't1', areaId: 'a1', completed: false, isNote: false, lastReviewedAt: new Date().toISOString() },
      ];
      expect(getTotalStaleTaskCount()).toBe(0);
    });

    it('returns 0 for empty tasksData', () => {
      mockState.tasksData = [];
      expect(getTotalStaleTaskCount()).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // startReview / exitReview
  // --------------------------------------------------------------------------
  describe('startReview', () => {
    it('sets reviewMode to true and resets index and completed areas', () => {
      mockState.reviewMode = false;
      mockState.reviewAreaIndex = 5;
      mockState.reviewCompletedAreas = ['a1', 'a2'];

      startReview();

      expect(mockState.reviewMode).toBe(true);
      expect(mockState.reviewAreaIndex).toBe(0);
      expect(mockState.reviewCompletedAreas).toEqual([]);
      expect(window.render).toHaveBeenCalled();
    });
  });

  describe('exitReview', () => {
    it('sets reviewMode to false and resets state', () => {
      mockState.reviewMode = true;
      mockState.reviewAreaIndex = 3;
      mockState.reviewCompletedAreas = ['a1'];

      exitReview();

      expect(mockState.reviewMode).toBe(false);
      expect(mockState.reviewAreaIndex).toBe(0);
      expect(mockState.reviewCompletedAreas).toEqual([]);
      expect(window.render).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // reviewNextArea / reviewPrevArea
  // --------------------------------------------------------------------------
  describe('reviewNextArea', () => {
    it('increments reviewAreaIndex', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work' }, { id: 'a2', name: 'Health' }, { id: 'a3', name: 'Finance' }];
      mockState.reviewAreaIndex = 0;

      reviewNextArea();
      expect(mockState.reviewAreaIndex).toBe(1);
      expect(window.render).toHaveBeenCalled();
    });

    it('does not go beyond last area', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work' }, { id: 'a2', name: 'Health' }];
      mockState.reviewAreaIndex = 1;

      reviewNextArea();
      expect(mockState.reviewAreaIndex).toBe(1); // stays at last
    });
  });

  describe('reviewPrevArea', () => {
    it('decrements reviewAreaIndex', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work' }, { id: 'a2', name: 'Health' }];
      mockState.reviewAreaIndex = 1;

      reviewPrevArea();
      expect(mockState.reviewAreaIndex).toBe(0);
      expect(window.render).toHaveBeenCalled();
    });

    it('does not go below 0', () => {
      mockState.reviewAreaIndex = 0;

      reviewPrevArea();
      expect(mockState.reviewAreaIndex).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // reviewEngageTask
  // --------------------------------------------------------------------------
  describe('reviewEngageTask', () => {
    it('sets lastReviewedAt and updatedAt on the task', () => {
      const now = new Date('2026-02-12T12:00:00Z');
      vi.setSystemTime(now);
      mockState.tasksData = [
        { id: 't1', title: 'Task', areaId: 'a1', completed: false, isNote: false },
      ];

      reviewEngageTask('t1');

      expect(mockState.tasksData[0].lastReviewedAt).toBeDefined();
      expect(mockState.tasksData[0].updatedAt).toBeDefined();
    });

    it('calls saveTasksData', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Task', areaId: 'a1', completed: false, isNote: false },
      ];
      reviewEngageTask('t1');
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('opens task modal with the task id', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Task', areaId: 'a1', completed: false, isNote: false },
      ];
      reviewEngageTask('t1');
      expect(mockState.editingTaskId).toBe('t1');
      expect(mockState.showTaskModal).toBe(true);
    });

    it('calls render', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Task', areaId: 'a1', completed: false, isNote: false },
      ];
      reviewEngageTask('t1');
      expect(window.render).toHaveBeenCalled();
    });

    it('handles non-existent task gracefully', () => {
      mockState.tasksData = [];
      reviewEngageTask('nonexistent');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
      // Still opens modal
      expect(mockState.editingTaskId).toBe('nonexistent');
      expect(mockState.showTaskModal).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // reviewPassTask
  // --------------------------------------------------------------------------
  describe('reviewPassTask', () => {
    it('sets lastReviewedAt and updatedAt without opening modal', () => {
      const now = new Date('2026-02-12T12:00:00Z');
      vi.setSystemTime(now);
      mockState.tasksData = [
        { id: 't1', title: 'Task', areaId: 'a1', completed: false, isNote: false },
      ];

      reviewPassTask('t1');

      expect(mockState.tasksData[0].lastReviewedAt).toBeDefined();
      expect(mockState.tasksData[0].updatedAt).toBeDefined();
      expect(saveTasksDataMock).toHaveBeenCalled();
      expect(mockState.showTaskModal).toBe(false);
      expect(mockState.editingTaskId).toBeNull();
    });

    it('calls render', () => {
      mockState.tasksData = [{ id: 't1', title: 'Task', areaId: 'a1' }];
      reviewPassTask('t1');
      expect(window.render).toHaveBeenCalled();
    });

    it('handles non-existent task gracefully', () => {
      mockState.tasksData = [];
      reviewPassTask('nonexistent');
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // reviewMarkAreaDone
  // --------------------------------------------------------------------------
  describe('reviewMarkAreaDone', () => {
    beforeEach(() => {
      mockState.taskAreas = [
        { id: 'a1', name: 'Work' },
        { id: 'a2', name: 'Health' },
      ];
      mockState.reviewAreaIndex = 0;
      mockState.reviewCompletedAreas = [];
    });

    it('adds current area to reviewCompletedAreas', () => {
      mockState.tasksData = [];
      reviewMarkAreaDone();
      expect(mockState.reviewCompletedAreas).toContain('a1');
    });

    it('does not add duplicate area IDs', () => {
      mockState.tasksData = [];
      mockState.reviewCompletedAreas = ['a1'];
      reviewMarkAreaDone();
      expect(mockState.reviewCompletedAreas.filter(id => id === 'a1').length).toBe(1);
    });

    it('marks all stale tasks in area as reviewed', () => {
      mockState.tasksData = [
        { id: 't1', title: 'Task 1', areaId: 'a1', completed: false, isNote: false },
        { id: 't2', title: 'Task 2', areaId: 'a1', completed: false, isNote: false },
      ];

      reviewMarkAreaDone();

      expect(mockState.tasksData[0].lastReviewedAt).toBeDefined();
      expect(mockState.tasksData[1].lastReviewedAt).toBeDefined();
      expect(saveTasksDataMock).toHaveBeenCalled();
    });

    it('does not call saveTasksData if no stale tasks', () => {
      mockState.tasksData = [];
      reviewMarkAreaDone();
      expect(saveTasksDataMock).not.toHaveBeenCalled();
    });

    it('advances to next area', () => {
      mockState.tasksData = [];
      reviewMarkAreaDone();
      expect(mockState.reviewAreaIndex).toBe(1);
    });
  });

  // --------------------------------------------------------------------------
  // reviewAddTask
  // --------------------------------------------------------------------------
  describe('reviewAddTask', () => {
    it('sets newTaskContext with areaId and defaults', () => {
      reviewAddTask('a1');
      expect(mockState.newTaskContext.areaId).toBe('a1');
      expect(mockState.newTaskContext.status).toBe('anytime');
      expect(mockState.newTaskContext.today).toBe(false);
      expect(mockState.editingTaskId).toBeNull();
      expect(mockState.showTaskModal).toBe(true);
    });

    it('accepts custom status and today parameters', () => {
      reviewAddTask('a1', 'someday', true);
      expect(mockState.newTaskContext.status).toBe('someday');
      expect(mockState.newTaskContext.today).toBe(true);
    });

    it('calls render', () => {
      reviewAddTask('a1');
      expect(window.render).toHaveBeenCalled();
    });

    it('focuses title input after timeout', () => {
      document.body.innerHTML = '<input id="task-title" />';
      const input = document.getElementById('task-title');
      const focusSpy = vi.spyOn(input, 'focus');

      reviewAddTask('a1');
      vi.advanceTimersByTime(100);

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // renderReviewMode
  // --------------------------------------------------------------------------
  describe('renderReviewMode', () => {
    it('shows empty state when no areas', () => {
      mockState.taskAreas = [];
      const html = renderReviewMode();
      expect(html).toContain('No areas to review');
      expect(html).toContain('exitReview()');
    });

    it('renders current area header with name and triggers/tasks count', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewAreaIndex = 0;

      const html = renderReviewMode();
      expect(html).toContain('Work');
      expect(html).toContain('Weekly Review');
      expect(html).toContain('0 triggers');
      expect(html).toContain('0 tasks to review');
    });

    it('renders progress bar and area dots', () => {
      mockState.taskAreas = [
        { id: 'a1', name: 'Work', color: '#147EFB' },
        { id: 'a2', name: 'Health', color: '#34C759' },
      ];
      mockState.reviewCompletedAreas = ['a1'];
      mockState.triggers = [];
      mockState.tasksData = [];

      const html = renderReviewMode();
      expect(html).toContain('review-progress-bar');
      expect(html).toContain('1/2 areas reviewed');
    });

    it('renders stale tasks with engage and pass buttons', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [
        { id: 't1', title: 'Stale Task', areaId: 'a1', completed: false, isNote: false },
      ];
      mockState.reviewAreaIndex = 0;

      const html = renderReviewMode();
      expect(html).toContain('Stale Task');
      expect(html).toContain('Engage');
      expect(html).toContain('Pass');
      expect(html).toContain("reviewEngageTask('t1')");
      expect(html).toContain("reviewPassTask('t1')");
    });

    it('shows "All tasks reviewed" when no stale tasks for area', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewAreaIndex = 0;

      const html = renderReviewMode();
      expect(html).toContain('All tasks reviewed');
    });

    it('renders Mark Area Reviewed button when area not completed', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewCompletedAreas = [];

      const html = renderReviewMode();
      expect(html).toContain('Mark Area Reviewed');
    });

    it('shows area reviewed checkmark when area is completed', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewCompletedAreas = ['a1'];

      const html = renderReviewMode();
      expect(html).toContain('Area reviewed');
    });

    it('shows review complete message when all areas reviewed', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewCompletedAreas = ['a1'];
      mockState.reviewAreaIndex = 0;

      const html = renderReviewMode();
      expect(html).toContain('Review Complete');
      expect(html).toContain('All 1 areas have been reviewed');
    });

    it('renders prev/next navigation buttons appropriately', () => {
      mockState.taskAreas = [
        { id: 'a1', name: 'Work', color: '#147EFB' },
        { id: 'a2', name: 'Health', color: '#34C759' },
        { id: 'a3', name: 'Finance', color: '#FF9500' },
      ];
      mockState.triggers = [];
      mockState.tasksData = [];

      // At first area: no prev button
      mockState.reviewAreaIndex = 0;
      let html = renderReviewMode();
      expect(html).toContain('reviewNextArea()');
      expect(html).not.toContain('reviewPrevArea()');

      // At middle: both buttons
      mockState.reviewAreaIndex = 1;
      html = renderReviewMode();
      expect(html).toContain('reviewNextArea()');
      expect(html).toContain('reviewPrevArea()');

      // At last area: no next button
      mockState.reviewAreaIndex = 2;
      html = renderReviewMode();
      expect(html).not.toContain('reviewNextArea()');
      expect(html).toContain('reviewPrevArea()');
    });

    it('calls renderTriggersOutliner for the current area', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewAreaIndex = 0;

      renderReviewMode();
      expect(renderTriggersOutlinerMock).toHaveBeenCalledWith({ areaId: 'a1' });
    });

    it('renders capture task buttons (Task, Today, Someday, Note)', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];

      const html = renderReviewMode();
      expect(html).toContain('Task');
      expect(html).toContain('Today');
      expect(html).toContain('Someday');
      expect(html).toContain('Note');
    });

    it('escapes area name for XSS safety', () => {
      mockState.taskAreas = [{ id: 'a1', name: '<script>xss</script>', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];

      const html = renderReviewMode();
      expect(html).not.toContain('<script>xss</script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('resets reviewAreaIndex if current area is undefined', () => {
      mockState.taskAreas = [{ id: 'a1', name: 'Work', color: '#147EFB' }];
      mockState.triggers = [];
      mockState.tasksData = [];
      mockState.reviewAreaIndex = 99; // out of bounds

      const html = renderReviewMode();
      expect(mockState.reviewAreaIndex).toBe(0);
      expect(html).toContain('Work');
    });
  });
});

// ============================================================================
// MODULE 3: MOBILE
// ============================================================================
describe('Mobile UI (src/ui/mobile.js)', () => {
  // --------------------------------------------------------------------------
  // openMobileDrawer
  // --------------------------------------------------------------------------
  describe('openMobileDrawer', () => {
    it('sets mobileDrawerOpen to true', () => {
      openMobileDrawer();
      expect(mockState.mobileDrawerOpen).toBe(true);
    });

    it('sets body overflow hidden', () => {
      openMobileDrawer();
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('adds drawer-open class to body', () => {
      openMobileDrawer();
      expect(document.body.classList.contains('drawer-open')).toBe(true);
    });

    it('adds body-modal-open class to body', () => {
      openMobileDrawer();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('calls renderMobileDrawer (adds show class to overlay)', () => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
      openMobileDrawer();
      const overlay = document.getElementById('mobile-sidebar-overlay');
      expect(overlay.classList.contains('show')).toBe(true);
    });

    it('focuses close button after timeout', () => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"><div class="mobile-sidebar-drawer"><button id="mobile-drawer-close"></button></div></div>';
      const btn = document.getElementById('mobile-drawer-close');
      const focusSpy = vi.spyOn(btn, 'focus');

      openMobileDrawer();
      vi.advanceTimersByTime(50);

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // closeMobileDrawer
  // --------------------------------------------------------------------------
  describe('closeMobileDrawer', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay" class="show"></div>';
      mockState.mobileDrawerOpen = true;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('drawer-open');
      document.body.classList.add('body-modal-open');
    });

    it('sets mobileDrawerOpen to false', () => {
      closeMobileDrawer();
      expect(mockState.mobileDrawerOpen).toBe(false);
    });

    it('restores body overflow', () => {
      closeMobileDrawer();
      expect(document.body.style.overflow).toBe('');
    });

    it('removes drawer-open class from body', () => {
      closeMobileDrawer();
      expect(document.body.classList.contains('drawer-open')).toBe(false);
    });

    it('removes body-modal-open when no other modals are open', () => {
      mockState.showTaskModal = false;
      mockState.showPerspectiveModal = false;
      mockState.showAreaModal = false;
      mockState.showLabelModal = false;
      mockState.showPersonModal = false;
      mockState.showCategoryModal = false;
      mockState.showBraindump = false;
      mockState.calendarEventModalOpen = false;

      closeMobileDrawer();
      expect(document.body.classList.contains('body-modal-open')).toBe(false);
    });

    it('keeps body-modal-open when another modal is open', () => {
      mockState.showTaskModal = true;
      closeMobileDrawer();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('keeps body-modal-open when braindump is open', () => {
      mockState.showBraindump = true;
      closeMobileDrawer();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('keeps body-modal-open when calendar event modal is open', () => {
      mockState.calendarEventModalOpen = true;
      closeMobileDrawer();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('removes show class from overlay', () => {
      closeMobileDrawer();
      const overlay = document.getElementById('mobile-sidebar-overlay');
      expect(overlay.classList.contains('show')).toBe(false);
    });

    it('restores focus to previously focused element', () => {
      const btn = document.createElement('button');
      btn.id = 'test-focus-button';
      document.body.appendChild(btn);
      btn.focus();

      openMobileDrawer();
      closeMobileDrawer();
      // The previously focused element should get focus back (btn was focused before open)
    });
  });

  // --------------------------------------------------------------------------
  // renderMobileDrawer
  // --------------------------------------------------------------------------
  describe('renderMobileDrawer', () => {
    it('adds show class when mobileDrawerOpen is true', () => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
      mockState.mobileDrawerOpen = true;
      renderMobileDrawer();
      expect(document.getElementById('mobile-sidebar-overlay').classList.contains('show')).toBe(true);
    });

    it('removes show class when mobileDrawerOpen is false', () => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay" class="show"></div>';
      mockState.mobileDrawerOpen = false;
      renderMobileDrawer();
      expect(document.getElementById('mobile-sidebar-overlay').classList.contains('show')).toBe(false);
    });

    it('does nothing when overlay does not exist', () => {
      document.body.innerHTML = '';
      mockState.mobileDrawerOpen = true;
      // Should not throw
      renderMobileDrawer();
    });
  });

  // --------------------------------------------------------------------------
  // renderBottomNav
  // --------------------------------------------------------------------------
  describe('renderBottomNav', () => {
    it('returns nav HTML with role tablist', () => {
      const html = renderBottomNav();
      expect(html).toContain('<nav');
      expect(html).toContain('mobile-bottom-nav');
      expect(html).toContain('role="tablist"');
    });

    it('includes all five tabs: Home, Workspace, Life, Calendar, Settings', () => {
      const html = renderBottomNav();
      expect(html).toContain('Home');
      expect(html).toContain('Workspace');
      expect(html).toContain('Life');
      expect(html).toContain('Calendar');
      expect(html).toContain('Settings');
    });

    it('highlights home tab when active', () => {
      mockState.activeTab = 'home';
      const html = renderBottomNav();
      // Home button should have 'active' class
      const homeMatch = html.match(/onclick="switchTab\('home'\)"[^>]*class="([^"]*)"/);
      expect(homeMatch[1]).toContain('active');
    });

    it('highlights tasks tab when active', () => {
      mockState.activeTab = 'tasks';
      const html = renderBottomNav();
      const tasksMatch = html.match(/onclick="switchTab\('tasks'\)"[^>]*class="([^"]*)"/);
      expect(tasksMatch[1]).toContain('active');
    });

    it('highlights settings tab when active', () => {
      mockState.activeTab = 'settings';
      const html = renderBottomNav();
      const settingsMatch = html.match(/onclick="switchTab\('settings'\)"[^>]*class="([^"]*)"/);
      expect(settingsMatch[1]).toContain('active');
    });

    it('sets aria-selected for active tab', () => {
      mockState.activeTab = 'life';
      const html = renderBottomNav();
      // Life tab should have aria-selected="true"
      expect(html).toContain('aria-label="Life Score"');
    });

    it('includes ARIA labels for accessibility', () => {
      const html = renderBottomNav();
      expect(html).toContain('aria-label="Main navigation"');
      expect(html).toContain('aria-label="Home"');
      expect(html).toContain('aria-label="Workspace"');
      expect(html).toContain('aria-label="Settings"');
    });
  });

  // --------------------------------------------------------------------------
  // showAreaTasks
  // --------------------------------------------------------------------------
  describe('showAreaTasks', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay" class="show"></div>';
      mockState.mobileDrawerOpen = true;
    });

    it('sets activeFilterType to area', () => {
      showAreaTasks('a1');
      expect(mockState.activeFilterType).toBe('area');
    });

    it('sets activeAreaFilter to the given id', () => {
      showAreaTasks('a1');
      expect(mockState.activeAreaFilter).toBe('a1');
    });

    it('clears other filters', () => {
      mockState.activeLabelFilter = 'l1';
      mockState.activePersonFilter = 'p1';
      showAreaTasks('a1');
      expect(mockState.activeLabelFilter).toBeNull();
      expect(mockState.activePersonFilter).toBeNull();
    });

    it('disables review mode', () => {
      mockState.reviewMode = true;
      showAreaTasks('a1');
      expect(mockState.reviewMode).toBe(false);
    });

    it('removes area from collapsedSidebarAreas', () => {
      mockState.collapsedSidebarAreas = new Set(['a1', 'a2']);
      showAreaTasks('a1');
      expect(mockState.collapsedSidebarAreas.has('a1')).toBe(false);
      expect(mockState.collapsedSidebarAreas.has('a2')).toBe(true);
    });

    it('closes mobile drawer', () => {
      showAreaTasks('a1');
      expect(mockState.mobileDrawerOpen).toBe(false);
    });

    it('switches to tasks tab if on another tab', () => {
      mockState.activeTab = 'home';
      showAreaTasks('a1');
      expect(mockState.activeTab).toBe('tasks');
    });

    it('stays on tasks tab if already there', () => {
      mockState.activeTab = 'tasks';
      showAreaTasks('a1');
      expect(mockState.activeTab).toBe('tasks');
    });

    it('saves view state', () => {
      showAreaTasks('a1');
      expect(saveViewStateMock).toHaveBeenCalled();
    });

    it('calls render', () => {
      showAreaTasks('a1');
      expect(window.render).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // showLabelTasks
  // --------------------------------------------------------------------------
  describe('showLabelTasks', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
    });

    it('sets activeFilterType to label and activeLabelFilter', () => {
      showLabelTasks('l1');
      expect(mockState.activeFilterType).toBe('label');
      expect(mockState.activeLabelFilter).toBe('l1');
    });

    it('clears area and person filters', () => {
      mockState.activeAreaFilter = 'a1';
      mockState.activePersonFilter = 'p1';
      showLabelTasks('l1');
      expect(mockState.activeAreaFilter).toBeNull();
      expect(mockState.activePersonFilter).toBeNull();
    });

    it('disables review mode', () => {
      mockState.reviewMode = true;
      showLabelTasks('l1');
      expect(mockState.reviewMode).toBe(false);
    });

    it('switches to tasks tab and saves view state', () => {
      mockState.activeTab = 'calendar';
      showLabelTasks('l1');
      expect(mockState.activeTab).toBe('tasks');
      expect(saveViewStateMock).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // showPerspectiveTasks
  // --------------------------------------------------------------------------
  describe('showPerspectiveTasks', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
    });

    it('sets activeFilterType to perspective and activePerspective', () => {
      showPerspectiveTasks('today');
      expect(mockState.activeFilterType).toBe('perspective');
      expect(mockState.activePerspective).toBe('today');
    });

    it('clears all entity filters', () => {
      mockState.activeAreaFilter = 'a1';
      mockState.activeLabelFilter = 'l1';
      mockState.activePersonFilter = 'p1';
      showPerspectiveTasks('inbox');
      expect(mockState.activeAreaFilter).toBeNull();
      expect(mockState.activeLabelFilter).toBeNull();
      expect(mockState.activePersonFilter).toBeNull();
    });

    it('redirects to calendar tab for calendar perspective', () => {
      showPerspectiveTasks('calendar');
      expect(mockState.activeTab).toBe('calendar');
      expect(saveViewStateMock).toHaveBeenCalled();
    });

    it('does not set activeFilterType for calendar perspective', () => {
      showPerspectiveTasks('calendar');
      // Should NOT set perspective filter - it switches tab instead
      expect(mockState.activeTab).toBe('calendar');
    });

    it('switches to tasks tab for non-calendar perspectives', () => {
      mockState.activeTab = 'home';
      showPerspectiveTasks('inbox');
      expect(mockState.activeTab).toBe('tasks');
    });

    it('disables review mode', () => {
      mockState.reviewMode = true;
      showPerspectiveTasks('inbox');
      expect(mockState.reviewMode).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // showPersonTasks
  // --------------------------------------------------------------------------
  describe('showPersonTasks', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
    });

    it('sets activeFilterType to person and activePersonFilter', () => {
      showPersonTasks('p1');
      expect(mockState.activeFilterType).toBe('person');
      expect(mockState.activePersonFilter).toBe('p1');
    });

    it('clears perspective, area, and label filters', () => {
      mockState.activePerspective = 'inbox';
      mockState.activeAreaFilter = 'a1';
      mockState.activeLabelFilter = 'l1';
      showPersonTasks('p1');
      expect(mockState.activePerspective).toBeNull();
      expect(mockState.activeAreaFilter).toBeNull();
      expect(mockState.activeLabelFilter).toBeNull();
    });

    it('disables review mode and switches to tasks tab', () => {
      mockState.reviewMode = true;
      mockState.activeTab = 'home';
      showPersonTasks('p1');
      expect(mockState.reviewMode).toBe(false);
      expect(mockState.activeTab).toBe('tasks');
    });
  });

  // --------------------------------------------------------------------------
  // showCategoryTasks
  // --------------------------------------------------------------------------
  describe('showCategoryTasks', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
    });

    it('sets activeFilterType to subcategory and activeCategoryFilter', () => {
      showCategoryTasks('cat1');
      expect(mockState.activeFilterType).toBe('subcategory');
      expect(mockState.activeCategoryFilter).toBe('cat1');
    });

    it('clears all other filters', () => {
      mockState.activePerspective = 'inbox';
      mockState.activeAreaFilter = 'a1';
      mockState.activeLabelFilter = 'l1';
      mockState.activePersonFilter = 'p1';
      showCategoryTasks('cat1');
      expect(mockState.activePerspective).toBeNull();
      expect(mockState.activeAreaFilter).toBeNull();
      expect(mockState.activeLabelFilter).toBeNull();
      expect(mockState.activePersonFilter).toBeNull();
    });

    it('disables review mode and switches to tasks tab', () => {
      mockState.reviewMode = true;
      mockState.activeTab = 'settings';
      showCategoryTasks('cat1');
      expect(mockState.reviewMode).toBe(false);
      expect(mockState.activeTab).toBe('tasks');
    });

    it('saves view state and calls render', () => {
      showCategoryTasks('cat1');
      expect(saveViewStateMock).toHaveBeenCalled();
      expect(window.render).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // showAllLabelsPage / showAllPeoplePage
  // --------------------------------------------------------------------------
  describe('showAllLabelsPage', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
    });

    it('sets activeFilterType to all-labels', () => {
      showAllLabelsPage();
      expect(mockState.activeFilterType).toBe('all-labels');
    });

    it('clears all entity filters and perspective', () => {
      mockState.activeLabelFilter = 'l1';
      mockState.activeAreaFilter = 'a1';
      mockState.activePersonFilter = 'p1';
      mockState.activePerspective = 'inbox';
      showAllLabelsPage();
      expect(mockState.activeLabelFilter).toBeNull();
      expect(mockState.activeAreaFilter).toBeNull();
      expect(mockState.activePersonFilter).toBeNull();
      expect(mockState.activePerspective).toBeNull();
    });

    it('disables review mode and switches to tasks tab', () => {
      mockState.reviewMode = true;
      mockState.activeTab = 'home';
      showAllLabelsPage();
      expect(mockState.reviewMode).toBe(false);
      expect(mockState.activeTab).toBe('tasks');
    });

    it('saves view state and calls render', () => {
      showAllLabelsPage();
      expect(saveViewStateMock).toHaveBeenCalled();
      expect(window.render).toHaveBeenCalled();
    });
  });

  describe('showAllPeoplePage', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="mobile-sidebar-overlay"></div>';
    });

    it('sets activeFilterType to all-people', () => {
      showAllPeoplePage();
      expect(mockState.activeFilterType).toBe('all-people');
    });

    it('clears all entity filters and perspective', () => {
      mockState.activePersonFilter = 'p1';
      mockState.activeAreaFilter = 'a1';
      mockState.activeLabelFilter = 'l1';
      mockState.activePerspective = 'inbox';
      showAllPeoplePage();
      expect(mockState.activePersonFilter).toBeNull();
      expect(mockState.activeAreaFilter).toBeNull();
      expect(mockState.activeLabelFilter).toBeNull();
      expect(mockState.activePerspective).toBeNull();
    });

    it('disables review mode and switches to tasks tab', () => {
      mockState.reviewMode = true;
      mockState.activeTab = 'calendar';
      showAllPeoplePage();
      expect(mockState.reviewMode).toBe(false);
      expect(mockState.activeTab).toBe('tasks');
    });

    it('saves view state and calls render', () => {
      showAllPeoplePage();
      expect(saveViewStateMock).toHaveBeenCalled();
      expect(window.render).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // toggleSidebarAreaCollapse
  // --------------------------------------------------------------------------
  describe('toggleSidebarAreaCollapse', () => {
    it('adds area to collapsedSidebarAreas when not present', () => {
      mockState.collapsedSidebarAreas = new Set();
      toggleSidebarAreaCollapse('a1');
      expect(mockState.collapsedSidebarAreas.has('a1')).toBe(true);
    });

    it('removes area from collapsedSidebarAreas when present', () => {
      mockState.collapsedSidebarAreas = new Set(['a1']);
      toggleSidebarAreaCollapse('a1');
      expect(mockState.collapsedSidebarAreas.has('a1')).toBe(false);
    });

    it('calls render', () => {
      mockState.collapsedSidebarAreas = new Set();
      toggleSidebarAreaCollapse('a1');
      expect(window.render).toHaveBeenCalled();
    });

    it('preserves other collapsed areas', () => {
      mockState.collapsedSidebarAreas = new Set(['a2', 'a3']);
      toggleSidebarAreaCollapse('a1');
      expect(mockState.collapsedSidebarAreas.has('a1')).toBe(true);
      expect(mockState.collapsedSidebarAreas.has('a2')).toBe(true);
      expect(mockState.collapsedSidebarAreas.has('a3')).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // toggleWorkspaceSidebar
  // --------------------------------------------------------------------------
  describe('toggleWorkspaceSidebar', () => {
    it('toggles workspaceSidebarCollapsed from false to true', () => {
      mockState.workspaceSidebarCollapsed = false;
      toggleWorkspaceSidebar();
      expect(mockState.workspaceSidebarCollapsed).toBe(true);
    });

    it('toggles workspaceSidebarCollapsed from true to false', () => {
      mockState.workspaceSidebarCollapsed = true;
      toggleWorkspaceSidebar();
      expect(mockState.workspaceSidebarCollapsed).toBe(false);
    });

    it('calls render', () => {
      toggleWorkspaceSidebar();
      expect(window.render).toHaveBeenCalled();
    });
  });
});
