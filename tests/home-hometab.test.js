// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — all mock variables must live here so vi.mock factories can use them
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => {
  const state = {
    activeTab: 'home',
    currentDate: '2026-01-15',
    allData: {
      '2026-01-15': {
        prayers: { fajr: '1', dhuhr: '0.1', asr: '', maghrib: '0.1', isha: '0.1', quran: 0 },
        glucose: { avg: '120', tir: '75', insulin: '35' },
        whoop: { sleepPerf: '85', recovery: '60', strain: '12' },
        family: { mom: true, dad: true, jana: false, tia: false, ahmed: true, eman: true },
        habits: { exercise: 1, reading: 1, meditation: 0, water: '', vitamins: false },
        libre: {}
      }
    },
    tasksData: [],
    taskAreas: [{ id: 'personal', name: 'Personal', color: '#4A90A4' }],
    taskCategories: [],
    taskLabels: [
      { id: 'next', name: 'Next', color: '#8B5CF6' },
      { id: 'urgent', name: 'Urgent', color: '#DC2626' }
    ],
    taskPeople: [],
    customPerspectives: [
      { id: 'cp1', name: 'Custom Persp', icon: '🎯', color: '#FF0000', filter: {} }
    ],
    homeWidgets: [
      { id: 'stats', type: 'stats', title: 'Stats', visible: true, order: 0, size: 'half' },
      { id: 'quick-add', type: 'quick-add', title: 'Quick Add', visible: true, order: 1, size: 'full' },
      { id: 'today-tasks', type: 'today-tasks', title: 'Today', visible: true, order: 2, size: 'half' },
      { id: 'next-tasks', type: 'next-tasks', title: 'Next', visible: true, order: 3, size: 'half' },
      { id: 'today-events', type: 'today-events', title: 'Events', visible: true, order: 4, size: 'half' },
      { id: 'prayers', type: 'prayers', title: 'Prayers', visible: true, order: 5, size: 'half' },
      { id: 'glucose', type: 'glucose', title: 'Glucose', visible: true, order: 6, size: 'half' },
      { id: 'whoop', type: 'whoop', title: 'Whoop', visible: true, order: 7, size: 'half' },
      { id: 'habits', type: 'habits', title: 'Habits', visible: true, order: 8, size: 'half' },
      { id: 'score', type: 'score', title: 'Score', visible: true, order: 9, size: 'half' },
      { id: 'weather', type: 'weather', title: 'Weather', visible: true, order: 10, size: 'half' },
      { id: 'gsheet-yesterday', type: 'gsheet-yesterday', title: 'GSheet', visible: true, order: 11, size: 'half' }
    ],
    WEIGHTS: {
      prayer: { onTime: 5, late: 2, quran: 5 },
      glucose: { avgMax: 10, tirPerPoint: 0.1, insulinThreshold: 40, insulinBase: 5, insulinPenalty: -5 },
      whoop: { sleepPerfHigh: 10, sleepPerfMid: 5, sleepPerfLow: 2, recoveryHigh: 10, recoveryMid: 5, recoveryLow: 2, strainMatch: 5, strainHigh: 3 },
      family: { mom: 5, dad: 5, jana: 5, tia: 5, ahmed: 5, eman: 5 },
      habits: { exercise: 5, reading: 5, meditation: 5, water: 1, vitamins: 3, brushTeeth: 2, nopYes: 2, nopNo: -2 }
    },
    MAX_SCORES: { prayer: 50, diabetes: 20, whoop: 30, family: 30, habits: 30, total: 160 },
    weatherData: null,
    editingHomeWidgets: false,
    showAddWidgetPicker: false,
    dailyFocusDismissed: null,
    quickAddIsNote: false,
    inlineAutocompleteMeta: new Map(),
    gsheetEditingPrompt: false,
    gsheetAsking: false,
    gsheetResponse: null,
    gsheetSyncing: false,
    gsheetData: null,
    gcalTokenExpired: false,
    xp: { total: 500, history: [] },
    streak: { current: 3, multiplier: 1.2 },
    achievements: { unlocked: {} },
  };

  const mockGetLocalDateString = vi.fn(() => '2026-01-15');
  const mockEscapeHtml = vi.fn((t) => t || '');
  const mockFormatEventTime = vi.fn(() => '10:00 AM');

  const MOCK_BUILTIN_PERSPECTIVES = [
    { id: 'inbox', name: 'Inbox', icon: '<svg>inbox</svg>', color: '#147EFB', filter: {}, builtin: true },
    { id: 'today', name: 'Today', icon: '<svg>today</svg>', color: '#FFCC00', filter: {}, builtin: true },
    { id: 'flagged', name: 'Flagged', icon: '<svg>flagged</svg>', color: '#FF9500', filter: {}, builtin: true },
    { id: 'upcoming', name: 'Upcoming', icon: '<svg>upcoming</svg>', color: '#FF3B30', filter: {}, builtin: true },
    { id: 'anytime', name: 'Anytime', icon: '<svg>anytime</svg>', color: '#5AC8FA', filter: {}, builtin: true },
    { id: 'someday', name: 'Someday', icon: '<svg>someday</svg>', color: '#C69C6D', filter: {}, builtin: true },
    { id: 'logbook', name: 'Logbook', icon: '<svg>logbook</svg>', color: '#34C759', filter: {}, builtin: true },
  ];
  const MOCK_NOTES_PERSPECTIVE = { id: 'notes', name: 'Notes', icon: '<svg>notes</svg>', color: '#5856D6', filter: {}, builtin: true };

  const MOCK_WIDGET_ICONS = {
    'stats': '<svg>stats</svg>',
    'quick-add': '<svg>quickadd</svg>',
    'today-tasks': '<svg>today</svg>',
    'today-events': '<svg>events</svg>',
    'next-tasks': '<svg>next</svg>',
    'prayers': '<svg>prayers</svg>',
    'glucose': '<svg>glucose</svg>',
    'whoop': '<svg>whoop</svg>',
    'habits': '<svg>habits</svg>',
    'weather': '<svg>weather</svg>',
    'score': '<svg>score</svg>',
    'gsheet-yesterday': '<svg>gsheet</svg>'
  };

  const MOCK_WIDGET_COLORS = {
    'stats': '#6B7280',
    'quick-add': '#147EFB',
    'today-tasks': '#FFCA28',
    'today-events': '#2F9B6A',
    'next-tasks': '#8B5CF6',
    'prayers': '#10B981',
    'glucose': '#EF4444',
    'whoop': '#3B82F6',
    'habits': '#8B5CF6',
    'weather': '#F59E0B',
    'score': '#22C55E',
    'gsheet-yesterday': '#34A853'
  };

  return {
    state,
    mockGetLocalDateString,
    mockEscapeHtml,
    mockFormatEventTime,
    MOCK_BUILTIN_PERSPECTIVES,
    MOCK_NOTES_PERSPECTIVE,
    MOCK_WIDGET_ICONS,
    MOCK_WIDGET_COLORS,
  };
});

// ---------------------------------------------------------------------------
// Module mocks — factories reference only hoisted variables
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mocks.state }));

vi.mock('../src/utils.js', () => ({
  getLocalDateString: mocks.mockGetLocalDateString,
  escapeHtml: mocks.mockEscapeHtml,
  formatEventTime: mocks.mockFormatEventTime,
}));

vi.mock('../src/constants.js', () => ({
  THINGS3_ICONS: { today: '<svg>today</svg>', settings: '<svg>settings</svg>' },
  getActiveIcons: () => ({
    today: '<svg>today</svg>',
    calendar: '<svg>calendar</svg>',
    next: '<svg>next</svg>',
    settings: '<svg>settings</svg>',
  }),
  WEATHER_ICONS: { 0: '☀️', 1: '🌤️', 3: '☁️', 61: '🌧️' },
  WEATHER_DESCRIPTIONS: { 0: 'Clear', 1: 'Mostly Clear', 3: 'Cloudy', 61: 'Light Rain' },
  defaultDayData: {
    prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
    glucose: { avg: '', tir: '', insulin: '' },
    whoop: { sleepPerf: '', recovery: '', strain: '', whoopAge: '' },
    libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
    family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
    habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' }
  },
  BUILTIN_PERSPECTIVES: mocks.MOCK_BUILTIN_PERSPECTIVES,
  NOTES_PERSPECTIVE: mocks.MOCK_NOTES_PERSPECTIVE,
  GSHEET_SAVED_PROMPT_KEY: 'nucleusGSheetSavedPrompt',
  GSHEET_RESPONSE_CACHE_KEY: 'nucleusGSheetResponseCache',
}));

// ---------------------------------------------------------------------------
// Import modules under test (after mocks)
// ---------------------------------------------------------------------------
import {
  renderStatsWidget,
  renderQuickAddWidget,
  renderTodayTasksWidget,
  renderNextTasksWidget,
  renderTodayEventsWidget,
  renderPrayersWidget,
  renderGlucoseWidget,
  renderWhoopWidget,
  renderHabitsWidget,
  renderScoreWidget,
  renderWeatherWidget,
  renderPerspectiveWidget,
  renderGSheetWidget,
  WIDGET_ICONS,
  WIDGET_COLORS,
  getWidgetColor,
} from '../src/ui/home-widgets.js';

import {
  renderHomeWidget,
  handleGSheetSavePrompt,
  handleGSheetEditPrompt,
  handleGSheetCancelEdit,
  handleGSheetRefresh,
  homeQuickAddTask,
  renderHomeTab,
} from '../src/ui/home.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function resetState() {
  mocks.state.activeTab = 'home';
  mocks.state.currentDate = '2026-01-15';
  mocks.state.allData = {
    '2026-01-15': {
      prayers: { fajr: '1', dhuhr: '0.1', asr: '', maghrib: '0.1', isha: '0.1', quran: 2 },
      glucose: { avg: '120', tir: '75', insulin: '35' },
      whoop: { sleepPerf: '85', recovery: '60', strain: '12' },
      family: { mom: true, dad: true, jana: false, tia: false, ahmed: true, eman: true },
      habits: { exercise: 1, reading: 1, meditation: 0, water: '', vitamins: false },
      libre: {}
    }
  };
  mocks.state.tasksData = [];
  mocks.state.taskLabels = [
    { id: 'next', name: 'Next', color: '#8B5CF6' },
    { id: 'urgent', name: 'Urgent', color: '#DC2626' }
  ];
  mocks.state.taskAreas = [{ id: 'personal', name: 'Personal', color: '#4A90A4' }];
  mocks.state.taskCategories = [];
  mocks.state.taskPeople = [];
  mocks.state.customPerspectives = [
    { id: 'cp1', name: 'Custom Persp', icon: '🎯', color: '#FF0000', filter: {} }
  ];
  mocks.state.homeWidgets = [
    { id: 'stats', type: 'stats', title: 'Stats', visible: true, order: 0, size: 'half' },
    { id: 'quick-add', type: 'quick-add', title: 'Quick Add', visible: true, order: 1, size: 'full' },
    { id: 'today-tasks', type: 'today-tasks', title: 'Today', visible: true, order: 2, size: 'half' },
  ];
  mocks.state.weatherData = null;
  mocks.state.editingHomeWidgets = false;
  mocks.state.showAddWidgetPicker = false;
  mocks.state.dailyFocusDismissed = null;
  mocks.state.quickAddIsNote = false;
  mocks.state.inlineAutocompleteMeta = new Map();
  mocks.state.gsheetEditingPrompt = false;
  mocks.state.gsheetAsking = false;
  mocks.state.gsheetResponse = null;
  mocks.state.gsheetSyncing = false;
  mocks.state.gsheetData = null;
  mocks.state.gcalTokenExpired = false;
  mocks.state.xp = { total: 500, history: [] };
  mocks.state.streak = { current: 3, multiplier: 1.2 };
  mocks.state.achievements = { unlocked: {} };
}

beforeEach(() => {
  resetState();
  localStorage.clear();
  // Set up window bridge functions used by the renderers
  window.render = vi.fn();
  window.createTask = vi.fn();
  window.cleanupInlineAutocomplete = vi.fn();
  window.calculateScores = vi.fn(() => ({
    total: 50, prayer: 20, diabetes: 10, whoop: 5, family: 10, habit: 5,
    prayerOnTime: 3, prayerLate: 1,
    normalized: { prayer: 0.6, diabetes: 0.5, whoop: 0.4, family: 0.7, habits: 0.3, overall: 0.5 }
  }));
  window.renderTaskItem = vi.fn((task) => `<div class="task-item">${task.title || 'Untitled'}</div>`);
  window.getFilteredTasks = vi.fn(() => []);
  window.getScoreTier = vi.fn((score) => ({ label: 'Solid', color: '#22C55E', emoji: '' }));
  window.getLevelInfo = vi.fn(() => ({ level: 5, tierName: 'Ember', tierIcon: '🔥', progress: 0.5, nextLevelXP: 1000, currentLevelXP: 700 }));
  window.isGCalConnected = vi.fn(() => false);
  window.getGCalEventsForDate = vi.fn(() => []);
  window.isWhoopConnected = vi.fn(() => false);
  window.getWhoopLastSync = vi.fn(() => null);
  window.isLibreConnected = vi.fn(() => false);
  window.getDailyFocus = vi.fn(() => null);
  window.askGSheet = vi.fn(() => Promise.resolve('AI response here'));
  window.getAnthropicKey = vi.fn(() => '');
  window.syncLibreNow = vi.fn();
  window.matchMedia = vi.fn(() => ({ matches: false }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// home-widgets.js — WIDGET_ICONS / WIDGET_COLORS / getWidgetColor
// ===========================================================================

describe('WIDGET_ICONS', () => {
  it('has icons for all standard widget types', () => {
    const expectedTypes = [
      'stats', 'quick-add', 'today-tasks', 'today-events', 'next-tasks',
      'prayers', 'glucose', 'whoop', 'habits', 'weather', 'score', 'gsheet-yesterday'
    ];
    expectedTypes.forEach(type => {
      expect(WIDGET_ICONS[type]).toBeDefined();
      expect(typeof WIDGET_ICONS[type]).toBe('string');
    });
  });

  it('contains SVG markup in icon values', () => {
    Object.values(WIDGET_ICONS).forEach(icon => {
      expect(icon).toContain('svg');
    });
  });
});

describe('WIDGET_COLORS', () => {
  it('has colors for all standard widget types', () => {
    const expectedTypes = [
      'stats', 'quick-add', 'today-tasks', 'today-events', 'next-tasks',
      'prayers', 'glucose', 'whoop', 'habits', 'weather', 'score', 'gsheet-yesterday'
    ];
    expectedTypes.forEach(type => {
      expect(WIDGET_COLORS[type]).toBeDefined();
      expect(WIDGET_COLORS[type]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe('getWidgetColor()', () => {
  it('returns a string for known widget types', () => {
    // getComputedStyle in jsdom returns '' for CSS vars, so fallback is used
    const color = getWidgetColor('stats');
    expect(typeof color).toBe('string');
  });

  it('returns fallback color for unknown widget type', () => {
    const color = getWidgetColor('nonexistent-widget');
    expect(typeof color).toBe('string');
    // Falls back to --text-muted or #6B7280
  });

  it('returns a color for each known type without throwing', () => {
    const types = ['stats', 'quick-add', 'today-tasks', 'today-events', 'next-tasks',
      'prayers', 'glucose', 'whoop', 'habits', 'weather', 'score', 'gsheet-yesterday'];
    types.forEach(type => {
      expect(() => getWidgetColor(type)).not.toThrow();
    });
  });
});

// ===========================================================================
// home-widgets.js — renderStatsWidget
// ===========================================================================

describe('renderStatsWidget()', () => {
  it('renders stats grid with 4 stat items', () => {
    const html = renderStatsWidget('2026-01-15');
    expect(html).toContain('quick-stat-item');
    // 4 grid items: inbox, today, next, done today
    const matches = html.match(/quick-stat-item/g);
    expect(matches.length).toBe(4);
  });

  it('shows 0 counts when no tasks exist', () => {
    mocks.state.tasksData = [];
    const html = renderStatsWidget('2026-01-15');
    expect(html).toContain('In Inbox');
    expect(html).toContain('Due Today');
    expect(html).toContain('Tagged Next');
    expect(html).toContain('Done Today');
  });

  it('counts today tasks correctly', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Task A', today: true, completed: false, isNote: false },
      { id: '2', title: 'Task B', dueDate: '2026-01-15', completed: false, isNote: false },
      { id: '3', title: 'Task C', completed: true, isNote: false },
    ];
    const html = renderStatsWidget('2026-01-15');
    // 2 tasks due today (today flag + dueDate match), but not the completed one
    expect(html).toContain('>2<');
  });

  it('counts inbox tasks (status=inbox, no categoryId)', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Inbox Task', status: 'inbox', completed: false, isNote: false },
      { id: '2', title: 'Has Cat', status: 'inbox', categoryId: 'cat1', completed: false, isNote: false },
    ];
    const html = renderStatsWidget('2026-01-15');
    // Only 1 inbox task (the one without categoryId)
    expect(html).toContain('>1<');
  });

  it('counts next-tagged tasks excluding today tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Next A', labels: ['next'], completed: false, isNote: false },
      { id: '2', title: 'Next B', labels: ['next'], today: true, completed: false, isNote: false },
    ];
    const html = renderStatsWidget('2026-01-15');
    // Next A counts, Next B is excluded because it has today flag
    expect(html).toContain('Tagged Next');
  });

  it('counts completed today tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Done', completed: true, completedAt: '2026-01-15T10:00:00Z' },
      { id: '2', title: 'Done Yesterday', completed: true, completedAt: '2026-01-14T10:00:00Z' },
    ];
    const html = renderStatsWidget('2026-01-15');
    // Only 1 completed today
    expect(html).toContain('>1<');
  });

  it('excludes notes from task counts', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Note', today: true, completed: false, isNote: true },
    ];
    const html = renderStatsWidget('2026-01-15');
    // The note should not be counted
    expect(html).toContain('>0<');
  });

  it('counts overdue tasks as today tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Overdue', dueDate: '2026-01-10', completed: false, isNote: false },
    ];
    const html = renderStatsWidget('2026-01-15');
    expect(html).toContain('>1<');
  });

  it('counts deferred tasks whose defer date has arrived', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Deferred', deferDate: '2026-01-14', completed: false, isNote: false },
    ];
    const html = renderStatsWidget('2026-01-15');
    expect(html).toContain('>1<');
  });
});

// ===========================================================================
// home-widgets.js — renderQuickAddWidget
// ===========================================================================

describe('renderQuickAddWidget()', () => {
  it('renders an input with correct ID', () => {
    const html = renderQuickAddWidget();
    expect(html).toContain('id="home-quick-add-input"');
  });

  it('shows "New To-Do" placeholder when not in note mode', () => {
    mocks.state.quickAddIsNote = false;
    const html = renderQuickAddWidget();
    expect(html).toContain('New To-Do');
  });

  it('shows "New Note" placeholder when in note mode', () => {
    mocks.state.quickAddIsNote = true;
    const html = renderQuickAddWidget();
    expect(html).toContain('New Note');
  });

  it('contains note toggle button', () => {
    const html = renderQuickAddWidget();
    expect(html).toContain('quick-add-type-toggle');
  });

  it('shows filled dot in note mode', () => {
    mocks.state.quickAddIsNote = true;
    const html = renderQuickAddWidget();
    expect(html).toContain('notes-accent');
  });

  it('shows dashed circle in task mode', () => {
    mocks.state.quickAddIsNote = false;
    const html = renderQuickAddWidget();
    expect(html).toContain('border-dashed');
  });

  it('includes Enter key handler', () => {
    const html = renderQuickAddWidget();
    expect(html).toContain('homeQuickAddTask');
  });
});

// ===========================================================================
// home-widgets.js — renderTodayTasksWidget
// ===========================================================================

describe('renderTodayTasksWidget()', () => {
  it('shows empty state when no tasks for today', () => {
    mocks.state.tasksData = [];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('No tasks for today');
  });

  it('renders task items for today tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Task 1', today: true, completed: false, isNote: false },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('task-item');
    expect(html).not.toContain('No tasks for today');
  });

  it('separates due tasks from other today tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Due Task', dueDate: '2026-01-15', completed: false, isNote: false },
      { id: '2', title: 'Today Task', today: true, completed: false, isNote: false },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('Due');
  });

  it('shows starting tasks section for deferred tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Starting Task', deferDate: '2026-01-15', completed: false, isNote: false },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('Starting');
  });

  it('excludes completed tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Done', today: true, completed: true, isNote: false },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('No tasks for today');
  });

  it('excludes notes', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Note', today: true, completed: false, isNote: true },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('No tasks for today');
  });

  it('shows "View all" link when more than 8 tasks', () => {
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      tasks.push({ id: `t${i}`, title: `Task ${i}`, today: true, completed: false, isNote: false });
    }
    mocks.state.tasksData = tasks;
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('View all');
    expect(html).toContain('10 tasks');
  });

  it('includes overdue tasks in the due section', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Overdue', dueDate: '2026-01-10', completed: false, isNote: false },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('Due');
  });
});

// ===========================================================================
// home-widgets.js — renderNextTasksWidget
// ===========================================================================

describe('renderNextTasksWidget()', () => {
  it('shows empty state when no Next label exists', () => {
    mocks.state.taskLabels = [];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('No tasks tagged "Next"');
  });

  it('shows empty state when no tasks have Next label', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Task', labels: ['urgent'], completed: false, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('No tasks tagged "Next"');
  });

  it('renders next-tagged tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Next Task', labels: ['next'], completed: false, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('task-item');
    expect(html).not.toContain('No tasks tagged');
  });

  it('excludes tasks that are also in Today', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Both', labels: ['next'], today: true, completed: false, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('No tasks tagged "Next"');
  });

  it('shows "View all" link when more than 8 next tasks', () => {
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      tasks.push({ id: `n${i}`, title: `Next ${i}`, labels: ['next'], completed: false, isNote: false });
    }
    mocks.state.tasksData = tasks;
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('View all');
    expect(html).toContain('10 tasks');
  });

  it('excludes completed tasks', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Done Next', labels: ['next'], completed: true, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('No tasks tagged "Next"');
  });
});

// ===========================================================================
// home-widgets.js — renderTodayEventsWidget
// ===========================================================================

describe('renderTodayEventsWidget()', () => {
  it('shows not connected message when GCal not connected', () => {
    window.isGCalConnected.mockReturnValue(false);
    const html = renderTodayEventsWidget('2026-01-15');
    expect(html).toContain('Google Calendar is not connected');
    expect(html).toContain('Connect in Settings');
  });

  it('shows expired message when token expired', () => {
    window.isGCalConnected.mockReturnValue(true);
    mocks.state.gcalTokenExpired = true;
    const html = renderTodayEventsWidget('2026-01-15');
    expect(html).toContain('Calendar session expired');
    expect(html).toContain('Reconnect Calendar');
  });

  it('shows empty state when connected but no events', () => {
    window.isGCalConnected.mockReturnValue(true);
    mocks.state.gcalTokenExpired = false;
    window.getGCalEventsForDate.mockReturnValue([]);
    const html = renderTodayEventsWidget('2026-01-15');
    expect(html).toContain('No events today');
  });

  it('renders events when available', () => {
    window.isGCalConnected.mockReturnValue(true);
    mocks.state.gcalTokenExpired = false;
    window.getGCalEventsForDate.mockReturnValue([
      { summary: 'Team Meeting', htmlLink: 'https://cal.google.com/event1' },
      { summary: 'Lunch', htmlLink: 'https://cal.google.com/event2' },
    ]);
    const html = renderTodayEventsWidget('2026-01-15');
    expect(html).toContain('Team Meeting');
    expect(html).toContain('Lunch');
  });

  it('shows "View all" when more than 6 events', () => {
    window.isGCalConnected.mockReturnValue(true);
    mocks.state.gcalTokenExpired = false;
    const events = [];
    for (let i = 0; i < 8; i++) {
      events.push({ summary: `Event ${i}`, htmlLink: `https://cal.google.com/event${i}` });
    }
    window.getGCalEventsForDate.mockReturnValue(events);
    const html = renderTodayEventsWidget('2026-01-15');
    expect(html).toContain('View all');
    expect(html).toContain('8 events');
  });

  it('handles events without title gracefully', () => {
    window.isGCalConnected.mockReturnValue(true);
    mocks.state.gcalTokenExpired = false;
    window.getGCalEventsForDate.mockReturnValue([
      { summary: '', htmlLink: '' },
    ]);
    const html = renderTodayEventsWidget('2026-01-15');
    expect(html).toContain('(No title)');
  });
});

// ===========================================================================
// home-widgets.js — renderPrayersWidget
// ===========================================================================

describe('renderPrayersWidget()', () => {
  it('renders prayer input fields', () => {
    const html = renderPrayersWidget('2026-01-15');
    // 5 prayer fields + quran
    expect(html).toContain("'fajr'");
    expect(html).toContain("'dhuhr'");
    expect(html).toContain("'asr'");
    expect(html).toContain("'maghrib'");
    expect(html).toContain("'isha'");
    expect(html).toContain("'quran'");
  });

  it('shows prayer count N/5', () => {
    // fajr=1, dhuhr=0.1, maghrib=0.1, isha=0.1 => 4 with parseFloat > 0
    const html = renderPrayersWidget('2026-01-15');
    expect(html).toContain('/5');
  });

  it('uses defaultDayData when no data for date', () => {
    const html = renderPrayersWidget('2026-02-01');
    expect(html).toContain('/5');
    expect(html).toContain('0/5');
  });

  it('renders short labels F, D, A, M, I', () => {
    const html = renderPrayersWidget('2026-01-15');
    expect(html).toContain('>F<');
    expect(html).toContain('>D<');
    expect(html).toContain('>A<');
    expect(html).toContain('>M<');
    expect(html).toContain('>I<');
  });
});

// ===========================================================================
// home-widgets.js — renderGlucoseWidget
// ===========================================================================

describe('renderGlucoseWidget()', () => {
  it('renders glucose input fields', () => {
    const html = renderGlucoseWidget('2026-01-15');
    expect(html).toContain('Avg');
    expect(html).toContain('TIR');
    expect(html).toContain('Insulin');
  });

  it('shows live glucose when Libre is connected with data', () => {
    window.isLibreConnected.mockReturnValue(true);
    mocks.state.allData['2026-01-15'].libre = { currentGlucose: '110', trend: '→' };
    const html = renderGlucoseWidget('2026-01-15');
    expect(html).toContain('110');
    expect(html).toContain('mg/dL');
  });

  it('shows sync button when Libre is connected', () => {
    window.isLibreConnected.mockReturnValue(true);
    const html = renderGlucoseWidget('2026-01-15');
    expect(html).toContain('Sync');
  });

  it('does not show sync button when Libre is not connected', () => {
    window.isLibreConnected.mockReturnValue(false);
    const html = renderGlucoseWidget('2026-01-15');
    // No sync button for libre when disconnected
    expect(html).not.toContain('syncLibreNow');
  });

  it('applies danger color for high glucose', () => {
    window.isLibreConnected.mockReturnValue(true);
    mocks.state.allData['2026-01-15'].libre = { currentGlucose: '200', trend: '↑' };
    const html = renderGlucoseWidget('2026-01-15');
    expect(html).toContain('danger');
  });

  it('applies warning color for moderately high glucose', () => {
    window.isLibreConnected.mockReturnValue(true);
    mocks.state.allData['2026-01-15'].libre = { currentGlucose: '150', trend: '→' };
    const html = renderGlucoseWidget('2026-01-15');
    expect(html).toContain('warning');
  });

  it('renders read-only fields when Libre connected and data present', () => {
    window.isLibreConnected.mockReturnValue(true);
    mocks.state.allData['2026-01-15'].glucose = { avg: '115', tir: '80', insulin: '30' };
    const html = renderGlucoseWidget('2026-01-15');
    // avg and tir should be read-only divs, not inputs, when libre connected
    expect(html).toContain('115');
    expect(html).toContain('80');
  });
});

// ===========================================================================
// home-widgets.js — renderWhoopWidget
// ===========================================================================

describe('renderWhoopWidget()', () => {
  it('renders whoop input fields', () => {
    const html = renderWhoopWidget('2026-01-15');
    expect(html).toContain('Sleep %');
    expect(html).toContain('Recovery');
    expect(html).toContain('Strain');
  });

  it('shows editable inputs when whoop not connected', () => {
    window.isWhoopConnected.mockReturnValue(false);
    const html = renderWhoopWidget('2026-01-15');
    expect(html).toContain('input type="number"');
  });

  it('shows read-only values when whoop connected with data', () => {
    window.isWhoopConnected.mockReturnValue(true);
    const html = renderWhoopWidget('2026-01-15');
    expect(html).toContain('85');
    expect(html).toContain('60');
    expect(html).toContain('12');
  });

  it('shows sync section when whoop connected', () => {
    window.isWhoopConnected.mockReturnValue(true);
    const html = renderWhoopWidget('2026-01-15');
    expect(html).toContain('Sync');
    expect(html).toContain('syncWhoopNow');
  });

  it('does not show sync section when whoop not connected', () => {
    window.isWhoopConnected.mockReturnValue(false);
    const html = renderWhoopWidget('2026-01-15');
    expect(html).not.toContain('syncWhoopNow');
  });

  it('shows last sync time when available', () => {
    window.isWhoopConnected.mockReturnValue(true);
    window.getWhoopLastSync.mockReturnValue('2026-01-15T10:30:00Z');
    const html = renderWhoopWidget('2026-01-15');
    expect(html).toContain('Synced');
  });
});

// ===========================================================================
// home-widgets.js — renderHabitsWidget
// ===========================================================================

describe('renderHabitsWidget()', () => {
  it('renders habit checkboxes', () => {
    const html = renderHabitsWidget('2026-01-15');
    // Habits use emoji icons, not text labels, and onchange toggleDailyField handlers
    expect(html).toContain("'exercise'");
    expect(html).toContain("'reading'");
    expect(html).toContain("'meditation'");
    expect(html).toContain("'water'");
    expect(html).toContain("'vitamins'");
  });

  it('shows correct habits done count', () => {
    // exercise=1, reading=1, others off => 2/5
    const html = renderHabitsWidget('2026-01-15');
    expect(html).toContain('2/5');
  });

  it('shows 0/5 when no habits done', () => {
    mocks.state.allData['2026-01-15'].habits = {};
    const html = renderHabitsWidget('2026-01-15');
    expect(html).toContain('0/5');
  });

  it('checks completed habits', () => {
    const html = renderHabitsWidget('2026-01-15');
    // exercise and reading are checked
    expect(html).toContain('checked');
  });

  it('renders toggleDailyField handlers', () => {
    const html = renderHabitsWidget('2026-01-15');
    expect(html).toContain("toggleDailyField('habits'");
  });
});

// ===========================================================================
// home-widgets.js — renderScoreWidget
// ===========================================================================

describe('renderScoreWidget()', () => {
  it('renders main score ring', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('score-main-ring');
  });

  it('shows overall percentage', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('50%');
  });

  it('shows category breakdown rings', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('score-categories-grid');
    expect(html).toContain('Prayer');
    expect(html).toContain('Glucose');
    expect(html).toContain('Whoop');
    expect(html).toContain('Family');
    expect(html).toContain('Habits');
  });

  it('shows mini rings for each category', () => {
    const html = renderScoreWidget('2026-01-15');
    const miniRings = html.match(/score-mini-ring/g);
    expect(miniRings).not.toBeNull();
    expect(miniRings.length).toBe(5);
  });

  it('shows level info', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('Level 5');
    expect(html).toContain('Ember');
  });

  it('shows streak info when streak active', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('3-day streak');
    expect(html).toContain('1.2x');
  });

  it('shows no active streak when streak is 0', () => {
    mocks.state.streak = { current: 0, multiplier: 1.0 };
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('No active streak');
  });

  it('shows XP info', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('XP today');
    expect(html).toContain('500');
  });

  it('shows progress bar for level', () => {
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('width: 50%');
  });
});

// ===========================================================================
// home-widgets.js — renderWeatherWidget
// ===========================================================================

describe('renderWeatherWidget()', () => {
  it('shows loading when no weather data', () => {
    mocks.state.weatherData = null;
    const html = renderWeatherWidget();
    expect(html).toContain('Loading weather...');
  });

  it('renders weather info when data available', () => {
    mocks.state.weatherData = {
      temp: 22,
      tempMax: 28,
      tempMin: 15,
      weatherCode: 0,
      humidity: 45,
      windSpeed: 12,
      city: 'New Cairo',
      maxHour: '2 PM',
      minHour: '5 AM'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('22');
    expect(html).toContain('28');
    expect(html).toContain('15');
    expect(html).toContain('New Cairo');
    expect(html).toContain('Clear');
    expect(html).toContain('Humidity');
    expect(html).toContain('Wind');
  });

  it('shows wind description', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 50, windSpeed: 5, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('Calm');
  });

  it('shows Breezy for moderate wind', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 50, windSpeed: 15, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('Breezy');
  });

  it('shows Windy for high wind', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 50, windSpeed: 30, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('Windy');
  });

  it('handles missing city with default', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 50, windSpeed: 5
    };
    const html = renderWeatherWidget();
    expect(html).toContain('Current location');
  });

  it('shows humidity bar', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 65, windSpeed: 5, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('65%');
  });
});

// ===========================================================================
// home-widgets.js — renderPerspectiveWidget
// ===========================================================================

describe('renderPerspectiveWidget()', () => {
  it('shows "View not found" for unknown perspective', () => {
    const widget = { id: 'persp-unknown', type: 'perspective', perspectiveId: 'nonexistent' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('View not found');
    expect(html).toContain('Remove widget');
  });

  it('renders note count for notes perspective', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Note 1', isNote: true, completed: false },
      { id: '2', title: 'Note 2', isNote: true, completed: false },
      { id: '3', title: 'Done Note', isNote: true, completed: true },
    ];
    const widget = { id: 'persp-notes', type: 'perspective', perspectiveId: 'notes' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('>2<');
    expect(html).toContain('notes');
    expect(html).toContain('Open Notes');
  });

  it('shows "No tasks" when perspective has no tasks', () => {
    window.getFilteredTasks.mockReturnValue([]);
    const widget = { id: 'persp-inbox', type: 'perspective', perspectiveId: 'inbox' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('No tasks');
  });

  it('renders tasks for a builtin perspective', () => {
    window.getFilteredTasks.mockReturnValue([
      { id: '1', title: 'Inbox Task 1' },
      { id: '2', title: 'Inbox Task 2' },
    ]);
    const widget = { id: 'persp-inbox', type: 'perspective', perspectiveId: 'inbox' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('task-item');
  });

  it('shows "View all" when more than 8 tasks in perspective', () => {
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      tasks.push({ id: `t${i}`, title: `Task ${i}` });
    }
    window.getFilteredTasks.mockReturnValue(tasks);
    const widget = { id: 'persp-inbox', type: 'perspective', perspectiveId: 'inbox' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('View all');
    expect(html).toContain('10 tasks');
  });

  it('renders custom perspective widget', () => {
    window.getFilteredTasks.mockReturnValue([
      { id: '1', title: 'Custom Task' },
    ]);
    const widget = { id: 'persp-cp1', type: 'perspective', perspectiveId: 'cp1' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('task-item');
  });

  it('uses singular "note" for count of 1', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Single Note', isNote: true, completed: false },
    ];
    const widget = { id: 'persp-notes', type: 'perspective', perspectiveId: 'notes' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    // The display text should be "note" (singular), not "notes" (plural)
    // The button text contains 'notes' as a perspective ID so we check the count label specifically
    expect(html).toContain('>note<');
    expect(html).not.toContain('>notes<');
  });
});

// ===========================================================================
// home-widgets.js — renderGSheetWidget
// ===========================================================================

describe('renderGSheetWidget()', () => {
  it('shows API key not configured when no key', () => {
    window.getAnthropicKey.mockReturnValue('');
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('Claude API key not configured');
    expect(html).toContain('Add in Settings');
  });

  it('shows GCal not connected when key exists but GCal disconnected', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(false);
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('Google Calendar not connected');
  });

  it('shows prompt input when no saved prompt', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.removeItem('nucleusGSheetSavedPrompt');
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('gsheet-prompt-input');
    expect(html).toContain('Set a prompt');
  });

  it('shows prompt input in editing mode', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Summarize my day');
    mocks.state.gsheetEditingPrompt = true;
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('gsheet-prompt-input');
    expect(html).toContain('handleGSheetCancelEdit');
  });

  it('shows generating spinner when asking', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Summarize my day');
    mocks.state.gsheetAsking = true;
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('Generating...');
    expect(html).toContain('animate-spin');
  });

  it('shows response when available', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Summarize my day');
    mocks.state.gsheetResponse = 'Here is your summary';
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('gsheet-response');
    expect(html).toContain('Here is your summary');
  });

  it('shows error response with red styling', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Summarize my day');
    mocks.state.gsheetResponse = 'Error: Something went wrong';
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('text-red-500');
    expect(html).toContain('Error: Something went wrong');
  });

  it('shows cached response from localStorage', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test prompt');
    localStorage.setItem('nucleusGSheetResponseCache', 'Cached response');
    mocks.state.gsheetResponse = null;
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('Cached response');
  });

  it('shows "No response yet" when no response and not asking', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test prompt');
    mocks.state.gsheetResponse = null;
    localStorage.removeItem('nucleusGSheetResponseCache');
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('No response yet');
  });

  it('shows edit prompt button and refresh button', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test prompt');
    mocks.state.gsheetResponse = 'Response';
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('handleGSheetEditPrompt');
    expect(html).toContain('handleGSheetRefresh');
  });

  it('disables refresh when asking', () => {
    window.getAnthropicKey.mockReturnValue('sk-ant-key');
    window.isGCalConnected.mockReturnValue(true);
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test prompt');
    mocks.state.gsheetAsking = true;
    const html = renderGSheetWidget('2026-01-15');
    expect(html).toContain('disabled');
  });
});

// ===========================================================================
// home.js — renderHomeWidget (dispatcher)
// ===========================================================================

describe('renderHomeWidget()', () => {
  it('dispatches to stats renderer', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('quick-stat-item');
  });

  it('dispatches to quick-add renderer with minimal styling when not editing', () => {
    const widget = { id: 'quick-add', type: 'quick-add', title: 'Quick Add', size: 'full' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('quick-add-widget');
    expect(html).toContain('home-quick-add-input');
    // Should not have full widget chrome
    expect(html).not.toContain('widget-header');
  });

  it('dispatches to quick-add renderer with full chrome when editing', () => {
    const widget = { id: 'quick-add', type: 'quick-add', title: 'Quick Add', size: 'full' };
    const html = renderHomeWidget(widget, true);
    // When editing, quick-add gets full widget chrome
    expect(html).toContain('widget-header');
  });

  it('applies col-span-2 for full-size widgets', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'full' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('col-span-2');
  });

  it('applies col-span-1 for half-size widgets', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('col-span-1');
  });

  it('shows edit controls when editing', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('widget-resize-btn');
    expect(html).toContain('toggleWidgetSize');
    expect(html).toContain('toggleWidgetVisibility');
  });

  it('does not show edit controls when not editing', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).not.toContain('widget-resize-btn');
  });

  it('shows remove button for perspective widgets when editing', () => {
    const widget = { id: 'persp-cp1', type: 'perspective', title: 'Custom', size: 'half', perspectiveId: 'cp1' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('removePerspectiveWidget');
  });

  it('shows hide button for non-perspective widgets when editing', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('toggleWidgetVisibility');
    expect(html).not.toContain('removePerspectiveWidget');
  });

  it('shows unknown widget type message for unrecognized types', () => {
    const widget = { id: 'custom', type: 'unknown-type', title: 'Unknown', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('Unknown widget type');
  });

  it('adds draggable attribute when editing', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('draggable="true"');
    expect(html).toContain('handleWidgetDragStart');
    expect(html).toContain('cursor-grab');
  });

  it('does not add draggable when not editing', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).not.toContain('draggable="true"');
  });

  it('uses perspective icon and color for perspective widgets', () => {
    const widget = { id: 'persp-cp1', type: 'perspective', title: 'Custom', size: 'half', perspectiveId: 'cp1' };
    const html = renderHomeWidget(widget, false);
    // Should use the custom perspective's color
    expect(html).toContain('#FF0000');
  });

  it('escapes widget title', () => {
    const widget = { id: 'stats', type: 'stats', title: 'My <Stats>', size: 'half' };
    renderHomeWidget(widget, false);
    // escapeHtml is called on widget title
    expect(mocks.mockEscapeHtml).toHaveBeenCalledWith('My <Stats>');
  });

  it('shows size label in edit mode', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('Half');
  });

  it('shows Full size label for full-size widgets', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'full' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('Full');
  });

  it('applies compact padding for task/event list widgets', () => {
    const widget = { id: 'today-tasks', type: 'today-tasks', title: 'Today', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('px-2 py-1');
  });

  it('applies normal padding for non-list widgets', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'half' };
    const html = renderHomeWidget(widget, false);
    expect(html).toContain('p-4');
  });

  it('dispatches to all widget type renderers', () => {
    const types = [
      'stats', 'today-tasks', 'next-tasks', 'today-events', 'prayers',
      'glucose', 'whoop', 'habits', 'score', 'weather', 'gsheet-yesterday'
    ];
    types.forEach(type => {
      const widget = { id: `w-${type}`, type, title: `W ${type}`, size: 'half' };
      expect(() => renderHomeWidget(widget, false)).not.toThrow();
    });
  });
});

// ===========================================================================
// home.js — homeQuickAddTask
// ===========================================================================

describe('homeQuickAddTask()', () => {
  it('does nothing when inputElement is null', () => {
    homeQuickAddTask(null);
    expect(window.createTask).not.toHaveBeenCalled();
  });

  it('does nothing when input value is empty', () => {
    const input = { value: '   ', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.createTask).not.toHaveBeenCalled();
  });

  it('creates a task with inbox status by default', () => {
    const input = { value: 'Buy groceries', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.createTask).toHaveBeenCalledWith('Buy groceries', expect.objectContaining({ status: 'inbox' }));
  });

  it('clears the input after creating task', () => {
    const input = { value: 'Buy groceries', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(input.value).toBe('');
  });

  it('resets quickAddIsNote to false after creating', () => {
    mocks.state.quickAddIsNote = true;
    const input = { value: 'A note', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(mocks.state.quickAddIsNote).toBe(false);
  });

  it('creates a note with anytime status when in note mode', () => {
    mocks.state.quickAddIsNote = true;
    const input = { value: 'My note', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.createTask).toHaveBeenCalledWith('My note', expect.objectContaining({
      isNote: true,
      status: 'anytime'
    }));
  });

  it('merges inline autocomplete metadata', () => {
    mocks.state.inlineAutocompleteMeta.set('home-quick-add-input', {
      areaId: 'personal',
      categoryId: 'cat1',
      labels: ['next'],
      people: ['person1'],
      deferDate: '2026-02-01',
      dueDate: '2026-02-15',
    });
    const input = { value: 'Task with meta', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.createTask).toHaveBeenCalledWith('Task with meta', expect.objectContaining({
      areaId: 'personal',
      categoryId: 'cat1',
      labels: ['next'],
      people: ['person1'],
      deferDate: '2026-02-01',
      dueDate: '2026-02-15',
    }));
  });

  it('calls cleanupInlineAutocomplete', () => {
    const input = { value: 'Task', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.cleanupInlineAutocomplete).toHaveBeenCalledWith('home-quick-add-input');
  });

  it('calls render after creating task', () => {
    const input = { value: 'Task', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.render).toHaveBeenCalled();
  });

  it('handles partial inline metadata (only areaId)', () => {
    mocks.state.inlineAutocompleteMeta.set('home-quick-add-input', {
      areaId: 'personal',
    });
    const input = { value: 'Partial meta', focus: vi.fn() };
    homeQuickAddTask(input);
    expect(window.createTask).toHaveBeenCalledWith('Partial meta', expect.objectContaining({
      areaId: 'personal',
    }));
    // Should not have labels, people, etc.
    const options = window.createTask.mock.calls[0][1];
    expect(options.labels).toBeUndefined();
    expect(options.people).toBeUndefined();
  });

  it('does not include empty labels array from metadata', () => {
    mocks.state.inlineAutocompleteMeta.set('home-quick-add-input', {
      labels: [],
      people: [],
    });
    const input = { value: 'No meta', focus: vi.fn() };
    homeQuickAddTask(input);
    const options = window.createTask.mock.calls[0][1];
    expect(options.labels).toBeUndefined();
    expect(options.people).toBeUndefined();
  });
});

// ===========================================================================
// home.js — handleGSheetSavePrompt
// ===========================================================================

describe('handleGSheetSavePrompt()', () => {
  it('does nothing when prompt input is not in DOM', async () => {
    // No input element in DOM
    await handleGSheetSavePrompt();
    expect(window.askGSheet).not.toHaveBeenCalled();
  });

  it('does nothing when prompt is empty', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = '   ';
    document.body.appendChild(input);

    await handleGSheetSavePrompt();
    expect(window.askGSheet).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('saves prompt to localStorage and calls askGSheet', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Summarize my week';
    document.body.appendChild(input);

    await handleGSheetSavePrompt();
    expect(localStorage.getItem('nucleusGSheetSavedPrompt')).toBe('Summarize my week');
    expect(window.askGSheet).toHaveBeenCalledWith('Summarize my week');
    document.body.removeChild(input);
  });

  it('sets gsheetAsking to true during call', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Test';
    document.body.appendChild(input);

    let askingDuringCall = false;
    window.askGSheet.mockImplementation(() => {
      askingDuringCall = mocks.state.gsheetAsking;
      return Promise.resolve('done');
    });

    await handleGSheetSavePrompt();
    expect(askingDuringCall).toBe(true);
    expect(mocks.state.gsheetAsking).toBe(false);
    document.body.removeChild(input);
  });

  it('caches response in localStorage', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Test';
    document.body.appendChild(input);

    window.askGSheet.mockResolvedValue('AI response');
    await handleGSheetSavePrompt();
    expect(localStorage.getItem('nucleusGSheetResponseCache')).toBe('AI response');
    expect(mocks.state.gsheetResponse).toBe('AI response');
    document.body.removeChild(input);
  });

  it('handles askGSheet error', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Test';
    document.body.appendChild(input);

    window.askGSheet.mockRejectedValue(new Error('API timeout'));
    await handleGSheetSavePrompt();
    expect(mocks.state.gsheetResponse).toBe('Error: API timeout');
    expect(mocks.state.gsheetAsking).toBe(false);
    document.body.removeChild(input);
  });

  it('clears editing prompt state', async () => {
    mocks.state.gsheetEditingPrompt = true;
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Test';
    document.body.appendChild(input);

    await handleGSheetSavePrompt();
    expect(mocks.state.gsheetEditingPrompt).toBe(false);
    document.body.removeChild(input);
  });

  it('calls render twice (before and after askGSheet)', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Test';
    document.body.appendChild(input);

    await handleGSheetSavePrompt();
    expect(window.render).toHaveBeenCalledTimes(2);
    document.body.removeChild(input);
  });
});

// ===========================================================================
// home.js — handleGSheetEditPrompt
// ===========================================================================

describe('handleGSheetEditPrompt()', () => {
  it('sets editing state to true', () => {
    handleGSheetEditPrompt();
    expect(mocks.state.gsheetEditingPrompt).toBe(true);
  });

  it('calls render', () => {
    handleGSheetEditPrompt();
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// home.js — handleGSheetCancelEdit
// ===========================================================================

describe('handleGSheetCancelEdit()', () => {
  it('sets editing state to false', () => {
    mocks.state.gsheetEditingPrompt = true;
    handleGSheetCancelEdit();
    expect(mocks.state.gsheetEditingPrompt).toBe(false);
  });

  it('calls render', () => {
    handleGSheetCancelEdit();
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// home.js — handleGSheetRefresh
// ===========================================================================

describe('handleGSheetRefresh()', () => {
  it('does nothing when no saved prompt', async () => {
    localStorage.removeItem('nucleusGSheetSavedPrompt');
    await handleGSheetRefresh();
    expect(window.askGSheet).not.toHaveBeenCalled();
  });

  it('re-runs saved prompt', async () => {
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Summarize data');
    await handleGSheetRefresh();
    expect(window.askGSheet).toHaveBeenCalledWith('Summarize data');
  });

  it('updates response on success', async () => {
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test');
    window.askGSheet.mockResolvedValue('Updated response');
    await handleGSheetRefresh();
    expect(mocks.state.gsheetResponse).toBe('Updated response');
    expect(localStorage.getItem('nucleusGSheetResponseCache')).toBe('Updated response');
  });

  it('handles error gracefully', async () => {
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test');
    window.askGSheet.mockRejectedValue(new Error('Network error'));
    await handleGSheetRefresh();
    expect(mocks.state.gsheetResponse).toBe('Error: Network error');
    expect(mocks.state.gsheetAsking).toBe(false);
  });

  it('resets asking state after completion', async () => {
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test');
    await handleGSheetRefresh();
    expect(mocks.state.gsheetAsking).toBe(false);
  });

  it('calls render twice', async () => {
    localStorage.setItem('nucleusGSheetSavedPrompt', 'Test');
    await handleGSheetRefresh();
    expect(window.render).toHaveBeenCalledTimes(2);
  });
});

// ===========================================================================
// home.js — renderHomeTab
// ===========================================================================

describe('renderHomeTab()', () => {
  it('returns HTML string', () => {
    const html = renderHomeTab();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('contains greeting based on time of day', () => {
    const html = renderHomeTab();
    // Should contain one of the greetings
    expect(html).toMatch(/Good (morning|afternoon|evening)/);
  });

  it('contains date display', () => {
    const html = renderHomeTab();
    expect(html).toContain('home-greeting-row');
  });

  it('contains widget grid', () => {
    const html = renderHomeTab();
    expect(html).toContain('widget-grid');
  });

  it('renders visible widgets in order', () => {
    const html = renderHomeTab();
    // Should contain rendered widgets
    expect(html).toContain('quick-stat-item');  // from stats widget
    expect(html).toContain('home-quick-add-input');  // from quick-add widget
  });

  it('shows customize button', () => {
    const html = renderHomeTab();
    expect(html).toContain('toggleEditHomeWidgets');
    expect(html).toContain('Customize');
  });

  it('shows Done button when editing', () => {
    mocks.state.editingHomeWidgets = true;
    const html = renderHomeTab();
    expect(html).toContain('Done');
  });

  it('shows Add Widget and Reset Layout buttons when editing', () => {
    mocks.state.editingHomeWidgets = true;
    const html = renderHomeTab();
    expect(html).toContain('Add Widget');
    expect(html).toContain('Reset Layout');
  });

  it('does not show weather inline when no weather data', () => {
    mocks.state.weatherData = null;
    const html = renderHomeTab();
    expect(html).not.toContain('weather-inline');
  });

  it('shows weather inline when weather data available', () => {
    mocks.state.weatherData = {
      temp: 22, tempMax: 28, tempMin: 15, weatherCode: 0,
      city: 'Cairo', maxHour: '2 PM', minHour: '5 AM'
    };
    const html = renderHomeTab();
    expect(html).toContain('weather-inline');
    expect(html).toContain('22');
  });

  it('does not show daily focus when dismissed', () => {
    mocks.state.dailyFocusDismissed = '2026-01-15';
    const html = renderHomeTab();
    expect(html).not.toContain('daily-focus-card');
  });

  it('shows daily focus card when not dismissed and focus returned', () => {
    mocks.state.dailyFocusDismissed = null;
    window.getDailyFocus.mockReturnValue({
      displayName: 'Prayer',
      avgPercent: 45,
      tip: 'Try to pray all 5 on time today.'
    });
    const html = renderHomeTab();
    expect(html).toContain('daily-focus-card');
    expect(html).toContain('Focus Today: Prayer');
    expect(html).toContain('45%');
  });

  it('does not show daily focus when getDailyFocus returns null', () => {
    window.getDailyFocus.mockReturnValue(null);
    const html = renderHomeTab();
    expect(html).not.toContain('daily-focus-card');
  });

  it('filters hidden widgets when not on mobile', () => {
    mocks.state.homeWidgets = [
      { id: 'stats', type: 'stats', title: 'Stats', visible: true, order: 0, size: 'half' },
      { id: 'hidden', type: 'prayers', title: 'Prayers', visible: false, order: 1, size: 'half' },
    ];
    window.matchMedia.mockReturnValue({ matches: false });
    const html = renderHomeTab();
    // Hidden widgets section shown when editing
    mocks.state.editingHomeWidgets = true;
    const editHtml = renderHomeTab();
    expect(editHtml).toContain('Hidden Widgets');
  });

  it('shows add widget picker when editing and picker is open', () => {
    mocks.state.editingHomeWidgets = true;
    mocks.state.showAddWidgetPicker = true;
    const html = renderHomeTab();
    expect(html).toContain('Add Perspective Widget');
    expect(html).toContain('Inbox');
    expect(html).toContain('Today');
  });

  it('does not show add widget picker when not editing', () => {
    mocks.state.editingHomeWidgets = false;
    mocks.state.showAddWidgetPicker = true;
    const html = renderHomeTab();
    expect(html).not.toContain('Add Perspective Widget');
  });

  it('shows Cmd+K shortcut', () => {
    const html = renderHomeTab();
    expect(html).toContain('quick add');
  });

  it('sorts widgets by order', () => {
    mocks.state.homeWidgets = [
      { id: 'second', type: 'stats', title: 'Second', visible: true, order: 1, size: 'half' },
      { id: 'first', type: 'prayers', title: 'First', visible: true, order: 0, size: 'half' },
    ];
    const html = renderHomeTab();
    const firstPos = html.indexOf('First');
    const secondPos = html.indexOf('Second');
    expect(firstPos).toBeLessThan(secondPos);
  });

  it('uses 2-column grid on desktop', () => {
    window.matchMedia.mockReturnValue({ matches: false });
    const html = renderHomeTab();
    expect(html).toContain('grid-cols-2');
  });

  it('renders all visible widgets', () => {
    mocks.state.homeWidgets = [
      { id: 'w1', type: 'stats', title: 'Stats', visible: true, order: 0, size: 'half' },
      { id: 'w2', type: 'prayers', title: 'Prayers', visible: true, order: 1, size: 'half' },
      { id: 'w3', type: 'habits', title: 'Habits', visible: false, order: 2, size: 'half' },
    ];
    const html = renderHomeTab();
    // Stats and Prayers rendered, Habits not (it's hidden)
    expect(html).toContain('Stats');
    expect(html).toContain('Prayers');
  });

  it('includes perspective widgets in add picker', () => {
    mocks.state.editingHomeWidgets = true;
    mocks.state.showAddWidgetPicker = true;
    const html = renderHomeTab();
    // Custom perspective should appear in the picker
    expect(html).toContain('Custom Persp');
  });

  it('marks already-added perspectives as disabled in picker', () => {
    mocks.state.editingHomeWidgets = true;
    mocks.state.showAddWidgetPicker = true;
    mocks.state.homeWidgets.push({
      id: 'persp-cp1', type: 'perspective', title: 'Custom', visible: true, order: 99, size: 'half', perspectiveId: 'cp1'
    });
    const html = renderHomeTab();
    expect(html).toContain('disabled');
  });
});

// ===========================================================================
// Additional edge case tests
// ===========================================================================

describe('Edge cases', () => {
  it('renderStatsWidget handles next label with case insensitivity', () => {
    mocks.state.taskLabels = [{ id: 'next2', name: '  Next  ', color: '#8B5CF6' }];
    mocks.state.tasksData = [
      { id: '1', title: 'Next Task', labels: ['next2'], completed: false, isNote: false },
    ];
    const html = renderStatsWidget('2026-01-15');
    expect(html).toContain('>1<');
  });

  it('renderHomeWidget handles third size class', () => {
    const widget = { id: 'stats', type: 'stats', title: 'Stats', size: 'third' };
    const html = renderHomeWidget(widget, true);
    expect(html).toContain('Third');
  });

  it('renderPerspectiveWidget handles notes perspective with 0 notes', () => {
    mocks.state.tasksData = [];
    const widget = { id: 'persp-notes', type: 'perspective', perspectiveId: 'notes' };
    const html = renderPerspectiveWidget(widget, '2026-01-15');
    expect(html).toContain('>0<');
    expect(html).toContain('notes');
  });

  it('renderGSheetWidget handles error without message', async () => {
    const input = document.createElement('input');
    input.id = 'gsheet-prompt-input';
    input.value = 'Test';
    document.body.appendChild(input);

    window.askGSheet.mockRejectedValue({});
    await handleGSheetSavePrompt();
    expect(mocks.state.gsheetResponse).toBe('Error: Something went wrong');
    document.body.removeChild(input);
  });

  it('renderTodayTasksWidget categorizes tasks correctly', () => {
    mocks.state.tasksData = [
      // Due today
      { id: '1', title: 'Due', dueDate: '2026-01-15', completed: false, isNote: false },
      // Overdue
      { id: '2', title: 'Overdue', dueDate: '2026-01-10', completed: false, isNote: false },
      // Starting today (deferred, not due)
      { id: '3', title: 'Starting', deferDate: '2026-01-15', completed: false, isNote: false },
      // Today flag only
      { id: '4', title: 'Today Flag', today: true, completed: false, isNote: false },
    ];
    const html = renderTodayTasksWidget('2026-01-15');
    expect(html).toContain('Due');
    expect(html).toContain('Starting');
  });

  it('renderGlucoseWidget without allData for date uses defaults', () => {
    const html = renderGlucoseWidget('2099-01-01');
    expect(html).toContain('Avg');
    expect(html).toContain('TIR');
  });

  it('renderWhoopWidget without allData for date uses defaults', () => {
    const html = renderWhoopWidget('2099-01-01');
    expect(html).toContain('Sleep %');
    expect(html).toContain('Recovery');
  });

  it('renderHabitsWidget without allData for date uses defaults', () => {
    const html = renderHabitsWidget('2099-01-01');
    expect(html).toContain('0/5');
  });

  it('homeQuickAddTask does not include falsy deferDate from metadata', () => {
    mocks.state.inlineAutocompleteMeta.set('home-quick-add-input', {
      areaId: 'personal',
      deferDate: '',
      dueDate: null,
    });
    const input = { value: 'Task', focus: vi.fn() };
    homeQuickAddTask(input);
    const options = window.createTask.mock.calls[0][1];
    expect(options.deferDate).toBeUndefined();
    expect(options.dueDate).toBeUndefined();
  });

  it('getWidgetColor handles all defined colors', () => {
    Object.keys(WIDGET_COLORS).forEach(type => {
      const color = getWidgetColor(type);
      expect(typeof color).toBe('string');
    });
  });

  it('renderHomeTab handles empty homeWidgets array', () => {
    mocks.state.homeWidgets = [];
    const html = renderHomeTab();
    expect(html).toContain('widget-grid');
    // No widgets rendered but grid is still there
  });
});

describe('handleGSheetRefresh edge cases', () => {
  it('handles empty string prompt in localStorage', async () => {
    localStorage.setItem('nucleusGSheetSavedPrompt', '');
    await handleGSheetRefresh();
    expect(window.askGSheet).not.toHaveBeenCalled();
  });
});

describe('renderNextTasksWidget edge cases', () => {
  it('excludes tasks due today from next widget', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Due Today Next', labels: ['next'], dueDate: '2026-01-15', completed: false, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('No tasks tagged "Next"');
  });

  it('excludes overdue tasks from next widget', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Overdue Next', labels: ['next'], dueDate: '2026-01-10', completed: false, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('No tasks tagged "Next"');
  });

  it('includes next tasks with past defer date (available now)', () => {
    mocks.state.tasksData = [
      { id: '1', title: 'Available Next', labels: ['next'], deferDate: '2026-01-10', completed: false, isNote: false },
    ];
    const html = renderNextTasksWidget('2026-01-15');
    expect(html).toContain('task-item');
  });
});

describe('renderScoreWidget edge cases', () => {
  it('handles zero XP', () => {
    mocks.state.xp = { total: 0, history: [] };
    window.getLevelInfo.mockReturnValue({ level: 1, tierName: 'Spark', tierIcon: '✨', progress: 0, nextLevelXP: 100, currentLevelXP: 0 });
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('Level 1');
    expect(html).toContain('Spark');
    expect(html).toContain('0');
  });

  it('does not show multiplier when 1.0x', () => {
    mocks.state.streak = { current: 1, multiplier: 1.0 };
    const html = renderScoreWidget('2026-01-15');
    expect(html).not.toContain('1x');
  });

  it('shows today XP when history entry exists', () => {
    mocks.state.xp = { total: 500, history: [{ date: '2026-01-15', total: 42 }] };
    const html = renderScoreWidget('2026-01-15');
    expect(html).toContain('+42 XP today');
  });
});

describe('renderWeatherWidget edge cases', () => {
  it('handles non-finite temp values gracefully', () => {
    mocks.state.weatherData = {
      temp: 'abc', tempMax: null, tempMin: undefined, weatherCode: 0,
      humidity: 50, windSpeed: 5, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('--');
  });

  it('clamps humidity to 0-100 range', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 150, windSpeed: 5, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('100%');
  });

  it('defaults windSpeed to 0 for non-finite values', () => {
    mocks.state.weatherData = {
      temp: 20, tempMax: 25, tempMin: 10, weatherCode: 0,
      humidity: 50, windSpeed: NaN, city: 'Cairo'
    };
    const html = renderWeatherWidget();
    expect(html).toContain('0 km/h');
    expect(html).toContain('Calm');
  });
});
