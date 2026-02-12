// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ---------------------------------------------------------------------------
const {
  mockState,
  mockEnsureEntityTombstones,
  mockPersistEntityTombstones,
  MOCK_HOME_WIDGETS_KEY,
  MOCK_DEFAULT_HOME_WIDGETS,
  MOCK_BUILTIN_PERSPECTIVES,
  MOCK_NOTES_PERSPECTIVE,
} = vi.hoisted(() => {
  const mockState = {
    homeWidgets: [],
    editingHomeWidgets: false,
    showAddWidgetPicker: false,
    customPerspectives: [],
    deletedEntityTombstones: {},
    draggingWidgetId: null,
  };

  const MOCK_HOME_WIDGETS_KEY = 'lifeGamificationHomeWidgets';
  const MOCK_DEFAULT_HOME_WIDGETS = [
    { id: 'quick-stats', type: 'stats', title: 'Quick Stats', size: 'full', order: 0, visible: true },
    { id: 'quick-add', type: 'quick-add', title: 'Quick Add Task', size: 'full', order: 1, visible: true },
    { id: 'weather', type: 'weather', title: 'Weather', size: 'half', order: 2, visible: true },
    { id: 'todays-score', type: 'score', title: "Today's Score", size: 'half', order: 3, visible: true },
    { id: 'today-tasks', type: 'today-tasks', title: 'Today', size: 'half', order: 4, visible: true },
  ];
  const MOCK_BUILTIN_PERSPECTIVES = [
    { id: 'inbox', name: 'Inbox', builtin: true },
    { id: 'today', name: 'Today', builtin: true },
  ];
  const MOCK_NOTES_PERSPECTIVE = { id: 'notes', name: 'Notes', builtin: true };

  return {
    mockState,
    mockEnsureEntityTombstones: { fn: null },
    mockPersistEntityTombstones: { fn: null },
    MOCK_HOME_WIDGETS_KEY,
    MOCK_DEFAULT_HOME_WIDGETS,
    MOCK_BUILTIN_PERSPECTIVES,
    MOCK_NOTES_PERSPECTIVE,
  };
});

// ---------------------------------------------------------------------------
// Mocks — factories reference only hoisted variables
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => ({
  HOME_WIDGETS_KEY: MOCK_HOME_WIDGETS_KEY,
  DEFAULT_HOME_WIDGETS: MOCK_DEFAULT_HOME_WIDGETS,
  BUILTIN_PERSPECTIVES: MOCK_BUILTIN_PERSPECTIVES,
  NOTES_PERSPECTIVE: MOCK_NOTES_PERSPECTIVE,
  DELETED_ENTITY_TOMBSTONES_KEY: 'lifeGamificationDeletedEntityTombstones',
}));

vi.mock('../src/features/areas.js', () => {
  const ensure = vi.fn(() => mockState.deletedEntityTombstones);
  const persist = vi.fn();
  mockEnsureEntityTombstones.fn = ensure;
  mockPersistEntityTombstones.fn = persist;
  return {
    ensureEntityTombstones: ensure,
    persistEntityTombstones: persist,
  };
});

// ---------------------------------------------------------------------------
// Import the module under test (after mocks are wired)
// ---------------------------------------------------------------------------
import {
  saveHomeWidgets,
  ensureHomeWidgets,
  toggleWidgetVisibility,
  toggleWidgetSize,
  moveWidgetUp,
  moveWidgetDown,
  resetHomeWidgets,
  toggleEditHomeWidgets,
  addPerspectiveWidget,
  removePerspectiveWidget,
} from '../src/features/home-widgets.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function freshWidgets() {
  return JSON.parse(JSON.stringify(MOCK_DEFAULT_HOME_WIDGETS));
}

beforeEach(() => {
  localStorage.clear();
  mockState.homeWidgets = freshWidgets();
  mockState.editingHomeWidgets = false;
  mockState.showAddWidgetPicker = false;
  mockState.customPerspectives = [];
  mockState.deletedEntityTombstones = {};
  mockState.draggingWidgetId = null;

  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();

  mockEnsureEntityTombstones.fn.mockReturnValue(mockState.deletedEntityTombstones);
  mockPersistEntityTombstones.fn.mockClear();
  mockEnsureEntityTombstones.fn.mockClear();
});

// ===========================================================================
// saveHomeWidgets
// ===========================================================================
describe('saveHomeWidgets', () => {
  it('persists homeWidgets to localStorage', () => {
    saveHomeWidgets();
    const stored = JSON.parse(localStorage.getItem(MOCK_HOME_WIDGETS_KEY));
    expect(stored).toEqual(mockState.homeWidgets);
  });

  it('calls debouncedSaveToGithub', () => {
    saveHomeWidgets();
    expect(window.debouncedSaveToGithub).toHaveBeenCalled();
  });

  it('does not throw on QuotaExceededError', () => {
    const origSetItem = localStorage.setItem.bind(localStorage);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      const err = new DOMException('quota exceeded', 'QuotaExceededError');
      throw err;
    });
    expect(() => saveHomeWidgets()).not.toThrow();
    vi.restoreAllMocks();
  });
});

// ===========================================================================
// ensureHomeWidgets
// ===========================================================================
describe('ensureHomeWidgets', () => {
  it('fills missing default widgets into empty array', () => {
    mockState.homeWidgets = [];
    ensureHomeWidgets();
    expect(mockState.homeWidgets.length).toBe(MOCK_DEFAULT_HOME_WIDGETS.length);
    expect(mockState.homeWidgets.map(w => w.id)).toEqual(MOCK_DEFAULT_HOME_WIDGETS.map(w => w.id));
  });

  it('preserves existing visibility overrides', () => {
    mockState.homeWidgets = [
      { id: 'weather', visible: false, order: 0 },
    ];
    ensureHomeWidgets();
    const weather = mockState.homeWidgets.find(w => w.id === 'weather');
    expect(weather.visible).toBe(false);
  });

  it('preserves custom/perspective widgets not in defaults', () => {
    const custom = { id: 'perspective-my-custom', type: 'perspective', title: 'Custom', size: 'half', order: 99, visible: true };
    mockState.homeWidgets = [...freshWidgets(), custom];
    ensureHomeWidgets();
    expect(mockState.homeWidgets.some(w => w.id === 'perspective-my-custom')).toBe(true);
  });

  it('removes legacy daily-entry widget', () => {
    mockState.homeWidgets = [...freshWidgets(), { id: 'daily-entry', type: 'legacy', order: 99, visible: true }];
    ensureHomeWidgets();
    expect(mockState.homeWidgets.some(w => w.id === 'daily-entry')).toBe(false);
  });

  it('normalizes order to be sequential from 0', () => {
    mockState.homeWidgets = freshWidgets().map((w, i) => ({ ...w, order: i * 10 }));
    ensureHomeWidgets();
    mockState.homeWidgets.forEach((w, i) => expect(w.order).toBe(i));
  });

  it('saves after merging', () => {
    mockState.homeWidgets = [];
    ensureHomeWidgets();
    const stored = JSON.parse(localStorage.getItem(MOCK_HOME_WIDGETS_KEY));
    expect(stored).toBeTruthy();
    expect(stored.length).toBe(MOCK_DEFAULT_HOME_WIDGETS.length);
  });
});

// ===========================================================================
// toggleWidgetVisibility
// ===========================================================================
describe('toggleWidgetVisibility', () => {
  it('toggles visible from true to false', () => {
    const weatherBefore = mockState.homeWidgets.find(w => w.id === 'weather');
    expect(weatherBefore.visible).toBe(true);
    toggleWidgetVisibility('weather');
    expect(weatherBefore.visible).toBe(false);
  });

  it('toggles visible from false to true', () => {
    const weather = mockState.homeWidgets.find(w => w.id === 'weather');
    weather.visible = false;
    toggleWidgetVisibility('weather');
    expect(weather.visible).toBe(true);
  });

  it('protects today-tasks from being hidden (no-op when already visible)', () => {
    const widget = mockState.homeWidgets.find(w => w.id === 'today-tasks');
    expect(widget.visible).toBe(true);
    toggleWidgetVisibility('today-tasks');
    expect(widget.visible).toBe(true);
  });

  it('protects todays-score from being hidden', () => {
    const widget = mockState.homeWidgets.find(w => w.id === 'todays-score');
    expect(widget.visible).toBe(true);
    toggleWidgetVisibility('todays-score');
    expect(widget.visible).toBe(true);
  });

  it('calls render after toggling', () => {
    toggleWidgetVisibility('weather');
    expect(window.render).toHaveBeenCalled();
  });

  it('saves after toggling', () => {
    toggleWidgetVisibility('weather');
    const stored = JSON.parse(localStorage.getItem(MOCK_HOME_WIDGETS_KEY));
    const weather = stored.find(w => w.id === 'weather');
    expect(weather.visible).toBe(false);
  });

  it('does nothing for unknown widget id', () => {
    toggleWidgetVisibility('nonexistent');
    expect(window.render).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// toggleWidgetSize
// ===========================================================================
describe('toggleWidgetSize', () => {
  it('toggles size from half to full', () => {
    const weather = mockState.homeWidgets.find(w => w.id === 'weather');
    expect(weather.size).toBe('half');
    toggleWidgetSize('weather');
    expect(weather.size).toBe('full');
  });

  it('toggles size from full to half', () => {
    const stats = mockState.homeWidgets.find(w => w.id === 'quick-stats');
    expect(stats.size).toBe('full');
    toggleWidgetSize('quick-stats');
    expect(stats.size).toBe('half');
  });

  it('calls render after toggling', () => {
    toggleWidgetSize('weather');
    expect(window.render).toHaveBeenCalled();
  });

  it('does nothing for unknown widget id', () => {
    toggleWidgetSize('nonexistent');
    expect(window.render).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// moveWidgetUp
// ===========================================================================
describe('moveWidgetUp', () => {
  it('swaps widget with the one above', () => {
    const ids = mockState.homeWidgets.map(w => w.id);
    moveWidgetUp('weather');
    expect(mockState.homeWidgets[1].id).toBe('weather');
    expect(mockState.homeWidgets[2].id).toBe(ids[1]); // quick-add moved down
  });

  it('does nothing for first widget (boundary)', () => {
    const first = mockState.homeWidgets[0].id;
    moveWidgetUp(first);
    expect(mockState.homeWidgets[0].id).toBe(first);
    expect(window.render).not.toHaveBeenCalled();
  });

  it('updates order numbers after move', () => {
    moveWidgetUp('weather');
    mockState.homeWidgets.forEach((w, i) => expect(w.order).toBe(i));
  });

  it('calls render after moving', () => {
    moveWidgetUp('weather');
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// moveWidgetDown
// ===========================================================================
describe('moveWidgetDown', () => {
  it('swaps widget with the one below', () => {
    const ids = mockState.homeWidgets.map(w => w.id);
    moveWidgetDown('weather');
    expect(mockState.homeWidgets[3].id).toBe('weather');
    expect(mockState.homeWidgets[2].id).toBe(ids[3]); // todays-score moved up
  });

  it('does nothing for last widget (boundary)', () => {
    const last = mockState.homeWidgets[mockState.homeWidgets.length - 1].id;
    moveWidgetDown(last);
    expect(mockState.homeWidgets[mockState.homeWidgets.length - 1].id).toBe(last);
    expect(window.render).not.toHaveBeenCalled();
  });

  it('updates order numbers after move', () => {
    moveWidgetDown('quick-stats');
    mockState.homeWidgets.forEach((w, i) => expect(w.order).toBe(i));
  });

  it('calls render after moving', () => {
    moveWidgetDown('quick-stats');
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// resetHomeWidgets
// ===========================================================================
describe('resetHomeWidgets', () => {
  it('resets to default widgets', () => {
    mockState.homeWidgets = [{ id: 'only-one', visible: true, order: 0 }];
    resetHomeWidgets();
    expect(mockState.homeWidgets.length).toBe(MOCK_DEFAULT_HOME_WIDGETS.length);
    expect(mockState.homeWidgets.map(w => w.id)).toEqual(MOCK_DEFAULT_HOME_WIDGETS.map(w => w.id));
  });

  it('removes localStorage key then re-saves', () => {
    localStorage.setItem(MOCK_HOME_WIDGETS_KEY, 'old');
    resetHomeWidgets();
    const stored = JSON.parse(localStorage.getItem(MOCK_HOME_WIDGETS_KEY));
    expect(stored.length).toBe(MOCK_DEFAULT_HOME_WIDGETS.length);
  });

  it('calls render', () => {
    resetHomeWidgets();
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// toggleEditHomeWidgets
// ===========================================================================
describe('toggleEditHomeWidgets', () => {
  it('toggles editingHomeWidgets from false to true', () => {
    mockState.editingHomeWidgets = false;
    toggleEditHomeWidgets();
    expect(mockState.editingHomeWidgets).toBe(true);
  });

  it('toggles editingHomeWidgets from true to false', () => {
    mockState.editingHomeWidgets = true;
    toggleEditHomeWidgets();
    expect(mockState.editingHomeWidgets).toBe(false);
  });

  it('closes showAddWidgetPicker when exiting edit mode', () => {
    mockState.editingHomeWidgets = true;
    mockState.showAddWidgetPicker = true;
    toggleEditHomeWidgets();
    expect(mockState.showAddWidgetPicker).toBe(false);
  });

  it('does not close showAddWidgetPicker when entering edit mode', () => {
    mockState.editingHomeWidgets = false;
    mockState.showAddWidgetPicker = true;
    toggleEditHomeWidgets();
    expect(mockState.showAddWidgetPicker).toBe(true);
  });

  it('calls render', () => {
    toggleEditHomeWidgets();
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// addPerspectiveWidget
// ===========================================================================
describe('addPerspectiveWidget', () => {
  it('adds a perspective widget for a builtin perspective', () => {
    const before = mockState.homeWidgets.length;
    addPerspectiveWidget('inbox');
    expect(mockState.homeWidgets.length).toBe(before + 1);
    const added = mockState.homeWidgets.find(w => w.id === 'perspective-inbox');
    expect(added).toBeTruthy();
    expect(added.type).toBe('perspective');
    expect(added.title).toBe('Inbox');
    expect(added.size).toBe('half');
    expect(added.visible).toBe(true);
    expect(added.perspectiveId).toBe('inbox');
  });

  it('adds a widget for the Notes perspective', () => {
    addPerspectiveWidget('notes');
    const added = mockState.homeWidgets.find(w => w.id === 'perspective-notes');
    expect(added).toBeTruthy();
    expect(added.title).toBe('Notes');
  });

  it('adds a widget for a custom perspective', () => {
    mockState.customPerspectives = [{ id: 'cust1', name: 'My Custom' }];
    addPerspectiveWidget('cust1');
    const added = mockState.homeWidgets.find(w => w.id === 'perspective-cust1');
    expect(added).toBeTruthy();
    expect(added.title).toBe('My Custom');
  });

  it('guards against duplicate perspective widgets', () => {
    addPerspectiveWidget('inbox');
    const count1 = mockState.homeWidgets.filter(w => w.id === 'perspective-inbox').length;
    addPerspectiveWidget('inbox');
    const count2 = mockState.homeWidgets.filter(w => w.id === 'perspective-inbox').length;
    expect(count1).toBe(1);
    expect(count2).toBe(1);
  });

  it('does nothing for unknown perspective id', () => {
    const before = mockState.homeWidgets.length;
    addPerspectiveWidget('nonexistent');
    expect(mockState.homeWidgets.length).toBe(before);
  });

  it('sets order to max + 1', () => {
    addPerspectiveWidget('inbox');
    const added = mockState.homeWidgets.find(w => w.id === 'perspective-inbox');
    expect(added.order).toBe(5);
  });

  it('closes showAddWidgetPicker after adding', () => {
    mockState.showAddWidgetPicker = true;
    addPerspectiveWidget('inbox');
    expect(mockState.showAddWidgetPicker).toBe(false);
  });

  it('clears widget tombstone when re-adding', () => {
    mockState.deletedEntityTombstones = { homeWidgets: { 'perspective-inbox': '2026-01-01T00:00:00.000Z' } };
    mockEnsureEntityTombstones.fn.mockReturnValue(mockState.deletedEntityTombstones);
    addPerspectiveWidget('inbox');
    expect(mockState.deletedEntityTombstones.homeWidgets['perspective-inbox']).toBeUndefined();
  });

  it('calls render after adding', () => {
    addPerspectiveWidget('inbox');
    expect(window.render).toHaveBeenCalled();
  });
});

// ===========================================================================
// removePerspectiveWidget
// ===========================================================================
describe('removePerspectiveWidget', () => {
  beforeEach(() => {
    mockState.homeWidgets.push({
      id: 'perspective-inbox',
      type: 'perspective',
      title: 'Inbox',
      perspectiveId: 'inbox',
      size: 'half',
      order: 5,
      visible: true,
    });
  });

  it('removes the widget from homeWidgets', () => {
    removePerspectiveWidget('perspective-inbox');
    expect(mockState.homeWidgets.find(w => w.id === 'perspective-inbox')).toBeUndefined();
  });

  it('re-normalizes order after removal', () => {
    removePerspectiveWidget('perspective-inbox');
    mockState.homeWidgets.forEach((w, i) => expect(w.order).toBe(i));
  });

  it('marks widget as deleted via tombstone', () => {
    removePerspectiveWidget('perspective-inbox');
    expect(mockEnsureEntityTombstones.fn).toHaveBeenCalled();
    expect(mockPersistEntityTombstones.fn).toHaveBeenCalled();
  });

  it('saves to localStorage after removal', () => {
    removePerspectiveWidget('perspective-inbox');
    const stored = JSON.parse(localStorage.getItem(MOCK_HOME_WIDGETS_KEY));
    expect(stored.some(w => w.id === 'perspective-inbox')).toBe(false);
  });

  it('calls render after removal', () => {
    removePerspectiveWidget('perspective-inbox');
    expect(window.render).toHaveBeenCalled();
  });
});
