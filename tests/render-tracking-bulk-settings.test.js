// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => {
  const state = {
    activeTab: 'home',
    activeSubTab: 'dashboard',
    currentDate: '2026-01-15',
    allData: {},
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    homeWidgets: [],
    WEIGHTS: {
      prayer: { onTime: 5, late: 2, quran: 5 },
      glucose: { avgMax: 10, tirPerPoint: 0.1, insulinThreshold: 40, insulinBase: 5, insulinPenalty: -5 },
      whoop: { sleepPerfHigh: 10, sleepPerfMid: 5, sleepPerfLow: 2, recoveryHigh: 10, recoveryMid: 5, recoveryLow: 2, strainMatch: 5, strainHigh: 3 },
      family: { mom: 5, dad: 5, jana: 5, tia: 5, ahmed: 5, eman: 5 },
      habits: { exercise: 5, reading: 5, meditation: 5, water: 1, vitamins: 3, brushTeeth: 2, nopYes: 2, nopNo: -2 }
    },
    MAX_SCORES: { prayer: 50, diabetes: 20, whoop: 30, family: 30, habits: 30, total: 160 },
    authLoading: false,
    authError: null,
    currentUser: { displayName: 'Test User', email: 'test@test.com' },
    githubSyncDirty: false,
    showTaskModal: false,
    showPerspectiveModal: false,
    showAreaModal: false,
    showLabelModal: false,
    showPersonModal: false,
    showCategoryModal: false,
    showBraindump: false,
    showGlobalSearch: false,
    calendarEventModalOpen: false,
    mobileDrawerOpen: false,
    inlineAutocompleteMeta: new Map(),
    renderPerf: { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 },
    bulkMonth: 0,
    bulkYear: 2026,
    bulkCategory: 'prayers',
    showCacheRefreshPrompt: false,
    cacheRefreshPromptMessage: '',
    editingHomeWidgets: false,
    weatherData: null,
    conflictNotifications: [],
    settingsIntegrationsOpen: false,
    settingsScoringOpen: false,
    settingsDataDiagOpen: false,
    gcalTokenExpired: false,
    gcalCalendarsLoading: false,
    gcalError: null,
    gcalCalendarList: [],
    gcontactsSyncing: false,
    gcontactsError: null,
    xp: { total: 500 },
    streak: { current: 3 },
    achievements: { unlocked: {} },
    syncHealth: {
      totalSaves: 10, successfulSaves: 9, totalLoads: 5, successfulLoads: 5,
      avgSaveLatencyMs: 100, lastError: null, recentEvents: []
    },
    _lastRenderWasMobile: false,
    quickAddIsNote: false,
    perspectiveEmojiPickerOpen: false,
    areaEmojiPickerOpen: false,
    categoryEmojiPickerOpen: false,
    dailyFocusDismissed: null,
    showAddWidgetPicker: false,
    activePerspective: 'inbox',
    activeFilterType: 'perspective',
  };

  const defaultDayData = {
    prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
    glucose: { avg: '', tir: '', insulin: '' },
    whoop: { sleepPerf: '', recovery: '', strain: '', whoopAge: '' },
    libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
    family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
    habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' }
  };

  const _escapeHtml = (t) => {
    if (!t) return '';
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const _fmt = (n) => {
    if (n === null || n === undefined || n === '') return '\u2014';
    const v = typeof n === 'string' ? parseFloat(n) : n;
    if (isNaN(v)) return '\u2014';
    return String(v);
  };

  return {
    state,
    defaultDayData,
    _escapeHtml,
    _fmt,
    saveViewState: vi.fn(),
    saveData: vi.fn(),
    getTodayData: vi.fn(() => JSON.parse(JSON.stringify(defaultDayData))),
    calculateScores: vi.fn(() => ({
      total: 42, prayer: 10, diabetes: 8, whoop: 12, family: 6, habit: 6,
      prayerOnTime: 3, prayerLate: 1
    })),
    invalidateScoresCache: vi.fn(),
    getAccentColor: vi.fn(() => '#E5533D'),
    isWhoopConnected: vi.fn(() => false),
    getWhoopLastSync: vi.fn(() => null),
    getWhoopWorkerUrl: vi.fn(() => ''),
    getWhoopApiKey: vi.fn(() => ''),
    isLibreConnected: vi.fn(() => false),
    getLibreLastSync: vi.fn(() => null),
    getLibreWorkerUrl: vi.fn(() => ''),
    getLibreApiKey: vi.fn(() => ''),
    isGCalConnected: vi.fn(() => false),
    getSelectedCalendars: vi.fn(() => []),
    getTargetCalendar: vi.fn(() => ''),
    getGithubToken: vi.fn(() => ''),
    setGithubToken: vi.fn(),
    getTheme: vi.fn(() => 'things3'),
    setTheme: vi.fn(),
    getColorMode: vi.fn(() => 'light'),
    toggleColorMode: vi.fn(),
    getSyncHealth: vi.fn(() => ({
      totalSaves: 10, successfulSaves: 9, totalLoads: 5, successfulLoads: 5,
      avgSaveLatencyMs: 100, lastError: null, recentEvents: []
    })),
    updateWeight: vi.fn(),
    resetWeights: vi.fn(),
    updateMaxScore: vi.fn(),
    resetMaxScores: vi.fn(),
    getAnthropicKey: vi.fn(() => ''),
    getCredentialSyncStatus: vi.fn(() => ({ hasCreds: false, count: 0 })),
    escapeHtml: vi.fn((t) => _escapeHtml(t)),
    getLocalDateString: vi.fn(() => '2026-01-15'),
    fmt: vi.fn((n) => _fmt(n)),
    createPrayerInput: vi.fn((prayer, label, value) => `<div class="prayer-input" data-prayer="${prayer}">${label}</div>`),
    createToggle: vi.fn((label, value, cat, field) => `<div class="toggle" data-field="${field}">${label}</div>`),
    createNumberInput: vi.fn((label, value, cat, field) => `<div class="number-input" data-field="${field}">${label}</div>`),
    createCounter: vi.fn((label, value, cat, field, max) => `<div class="counter" data-field="${field}">${label}</div>`),
    createScoreCard: vi.fn((label, score, max, color) => `<div class="score-card" data-label="${label}">${score}/${max}</div>`),
    renderHomeTab: vi.fn(() => '<div class="home-tab">Home Content</div>'),
    APP_VERSION: '4.43.2 - Homebase',
    APP_VERSION_SEEN_KEY: 'nucleusAppVersionSeen',
    GITHUB_TOKEN_KEY: 'lifeGamificationGithubToken',
    GCAL_LAST_SYNC_KEY: 'nucleusGCalLastSync',
    GCONTACTS_LAST_SYNC_KEY: 'nucleusGoogleContactsLastSync',
    THEMES: {
      simplebits: { name: 'SimpleBits', description: 'Warm cream tones with coral accents' },
      things3: { name: 'Things 3', description: 'Clean white with blue accents' },
      geist: { name: 'Geist', description: 'Vercel-inspired monochrome' }
    },
    THINGS3_ICONS: { home: '<svg>home</svg>', workspace: '<svg>ws</svg>', lifeScore: '<svg>ls</svg>', calendar: '<svg>cal</svg>', settings: '<svg>set</svg>' },
    getActiveIcons: vi.fn(() => ({
      home: '<svg>home</svg>', workspace: '<svg>ws</svg>',
      lifeScore: '<svg>ls</svg>', calendar: '<svg>cal</svg>',
      settings: '<svg>set</svg>'
    })),
  };
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mocks.state }));

vi.mock('../src/constants.js', () => ({
  APP_VERSION: mocks.APP_VERSION,
  APP_VERSION_SEEN_KEY: mocks.APP_VERSION_SEEN_KEY,
  GITHUB_TOKEN_KEY: mocks.GITHUB_TOKEN_KEY,
  THEMES: mocks.THEMES,
  THINGS3_ICONS: mocks.THINGS3_ICONS,
  getActiveIcons: mocks.getActiveIcons,
  defaultDayData: mocks.defaultDayData,
  GCAL_LAST_SYNC_KEY: mocks.GCAL_LAST_SYNC_KEY,
  GCONTACTS_LAST_SYNC_KEY: mocks.GCONTACTS_LAST_SYNC_KEY,
}));

vi.mock('../src/utils.js', () => ({
  escapeHtml: mocks.escapeHtml,
  getLocalDateString: mocks.getLocalDateString,
  fmt: mocks.fmt,
}));

vi.mock('../src/data/storage.js', () => ({
  saveViewState: mocks.saveViewState,
  saveData: mocks.saveData,
  getTodayData: mocks.getTodayData,
}));

vi.mock('../src/features/scoring.js', () => ({
  calculateScores: mocks.calculateScores,
  invalidateScoresCache: mocks.invalidateScoresCache,
  updateWeight: mocks.updateWeight,
  resetWeights: mocks.resetWeights,
  updateMaxScore: mocks.updateMaxScore,
  resetMaxScores: mocks.resetMaxScores,
}));

vi.mock('../src/data/github-sync.js', () => ({
  getAccentColor: mocks.getAccentColor,
  getGithubToken: mocks.getGithubToken,
  setGithubToken: mocks.setGithubToken,
  getTheme: mocks.getTheme,
  setTheme: mocks.setTheme,
  getColorMode: mocks.getColorMode,
  toggleColorMode: mocks.toggleColorMode,
  getSyncHealth: mocks.getSyncHealth,
}));

vi.mock('../src/data/whoop-sync.js', () => ({
  isWhoopConnected: mocks.isWhoopConnected,
  getWhoopLastSync: mocks.getWhoopLastSync,
  getWhoopWorkerUrl: mocks.getWhoopWorkerUrl,
  getWhoopApiKey: mocks.getWhoopApiKey,
}));

vi.mock('../src/data/libre-sync.js', () => ({
  isLibreConnected: mocks.isLibreConnected,
  getLibreLastSync: mocks.getLibreLastSync,
  getLibreWorkerUrl: mocks.getLibreWorkerUrl,
  getLibreApiKey: mocks.getLibreApiKey,
}));

vi.mock('../src/data/google-calendar-sync.js', () => ({
  isGCalConnected: mocks.isGCalConnected,
  getSelectedCalendars: mocks.getSelectedCalendars,
  getTargetCalendar: mocks.getTargetCalendar,
}));

vi.mock('../src/features/braindump.js', () => ({
  getAnthropicKey: mocks.getAnthropicKey,
}));

vi.mock('../src/data/credential-sync.js', () => ({
  getCredentialSyncStatus: mocks.getCredentialSyncStatus,
}));

vi.mock('../src/ui/input-builders.js', () => ({
  createPrayerInput: mocks.createPrayerInput,
  createToggle: mocks.createToggle,
  createNumberInput: mocks.createNumberInput,
  createCounter: mocks.createCounter,
  createScoreCard: mocks.createScoreCard,
}));

vi.mock('../src/ui/home.js', () => ({
  renderHomeTab: mocks.renderHomeTab,
}));

// ---------------------------------------------------------------------------
// Imports under test
// ---------------------------------------------------------------------------
import { render, dismissCacheRefreshPrompt, switchTab, switchSubTab, setToday, forceHardRefresh } from '../src/ui/render.js';
import { renderTrackingTab } from '../src/ui/tracking.js';
import { setBulkMonth, setBulkCategory, updateBulkData, updateBulkSummary, getDaysInMonth, renderBulkEntryTab } from '../src/ui/bulk-entry.js';
import { createWeightInput, renderSettingsTab } from '../src/ui/settings.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reset mock implementations that get cleared by vi.clearAllMocks */
function resetMockImplementations() {
  mocks.escapeHtml.mockImplementation(t => mocks._escapeHtml(t));
  mocks.getLocalDateString.mockReturnValue('2026-01-15');
  mocks.fmt.mockImplementation(n => mocks._fmt(n));
  mocks.renderHomeTab.mockReturnValue('<div class="home-tab">Home Content</div>');
  mocks.getTodayData.mockReturnValue(JSON.parse(JSON.stringify(mocks.defaultDayData)));
  mocks.calculateScores.mockReturnValue({
    total: 42, prayer: 10, diabetes: 8, whoop: 12, family: 6, habit: 6,
    prayerOnTime: 3, prayerLate: 1
  });
  mocks.getAccentColor.mockReturnValue('#E5533D');
  mocks.isWhoopConnected.mockReturnValue(false);
  mocks.getWhoopLastSync.mockReturnValue(null);
  mocks.getWhoopWorkerUrl.mockReturnValue('');
  mocks.getWhoopApiKey.mockReturnValue('');
  mocks.isLibreConnected.mockReturnValue(false);
  mocks.getLibreLastSync.mockReturnValue(null);
  mocks.getLibreWorkerUrl.mockReturnValue('');
  mocks.getLibreApiKey.mockReturnValue('');
  mocks.isGCalConnected.mockReturnValue(false);
  mocks.getSelectedCalendars.mockReturnValue([]);
  mocks.getTargetCalendar.mockReturnValue('');
  mocks.getGithubToken.mockReturnValue('');
  mocks.getTheme.mockReturnValue('things3');
  mocks.getColorMode.mockReturnValue('light');
  mocks.getSyncHealth.mockReturnValue({
    totalSaves: 10, successfulSaves: 9, totalLoads: 5, successfulLoads: 5,
    avgSaveLatencyMs: 100, lastError: null, recentEvents: []
  });
  mocks.getAnthropicKey.mockReturnValue('');
  mocks.getCredentialSyncStatus.mockReturnValue({ hasCreds: false, count: 0 });
  mocks.getActiveIcons.mockReturnValue({
    home: '<svg>home</svg>', workspace: '<svg>ws</svg>',
    lifeScore: '<svg>ls</svg>', calendar: '<svg>cal</svg>',
    settings: '<svg>set</svg>'
  });
  mocks.createPrayerInput.mockImplementation((prayer, label) => `<div class="prayer-input" data-prayer="${prayer}">${label}</div>`);
  mocks.createToggle.mockImplementation((label, value, cat, field) => `<div class="toggle" data-field="${field}">${label}</div>`);
  mocks.createNumberInput.mockImplementation((label, value, cat, field) => `<div class="number-input" data-field="${field}">${label}</div>`);
  mocks.createCounter.mockImplementation((label, value, cat, field) => `<div class="counter" data-field="${field}">${label}</div>`);
  mocks.createScoreCard.mockImplementation((label, score, max, color) => `<div class="score-card" data-label="${label}">${score}/${max}</div>`);
}

/** Reset all mock state to defaults before each test */
function resetState() {
  mocks.state.activeTab = 'home';
  mocks.state.activeSubTab = 'dashboard';
  mocks.state.currentDate = '2026-01-15';
  mocks.state.allData = {};
  mocks.state.authLoading = false;
  mocks.state.authError = null;
  mocks.state.currentUser = { displayName: 'Test User', email: 'test@test.com' };
  mocks.state.showCacheRefreshPrompt = false;
  mocks.state.cacheRefreshPromptMessage = '';
  mocks.state.showTaskModal = false;
  mocks.state.showPerspectiveModal = false;
  mocks.state.showAreaModal = false;
  mocks.state.showLabelModal = false;
  mocks.state.showPersonModal = false;
  mocks.state.showCategoryModal = false;
  mocks.state.showBraindump = false;
  mocks.state.showGlobalSearch = false;
  mocks.state.calendarEventModalOpen = false;
  mocks.state.mobileDrawerOpen = false;
  mocks.state.inlineAutocompleteMeta = new Map();
  mocks.state.renderPerf = { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
  mocks.state.bulkMonth = 0;
  mocks.state.bulkYear = 2026;
  mocks.state.bulkCategory = 'prayers';
  mocks.state.perspectiveEmojiPickerOpen = false;
  mocks.state.areaEmojiPickerOpen = false;
  mocks.state.categoryEmojiPickerOpen = false;
  mocks.state._lastRenderWasMobile = false;
  mocks.state.githubSyncDirty = false;
  mocks.state.tasksData = [];
  mocks.state.conflictNotifications = [];
  mocks.state.settingsIntegrationsOpen = false;
  mocks.state.settingsScoringOpen = false;
  mocks.state.settingsDataDiagOpen = false;
  mocks.state.gcalTokenExpired = false;
  mocks.state.gcalCalendarsLoading = false;
  mocks.state.gcalError = null;
  mocks.state.gcalCalendarList = [];
  mocks.state.gcontactsSyncing = false;
  mocks.state.gcontactsError = null;
  mocks.state.WEIGHTS = {
    prayer: { onTime: 5, late: 2, quran: 5 },
    glucose: { avgMax: 10, tirPerPoint: 0.1, insulinThreshold: 40, insulinBase: 5, insulinPenalty: -5 },
    whoop: { sleepPerfHigh: 10, sleepPerfMid: 5, sleepPerfLow: 2, recoveryHigh: 10, recoveryMid: 5, recoveryLow: 2, strainMatch: 5, strainHigh: 3 },
    family: { mom: 5, dad: 5, jana: 5, tia: 5, ahmed: 5, eman: 5 },
    habits: { exercise: 5, reading: 5, meditation: 5, water: 1, vitamins: 3, brushTeeth: 2, nopYes: 2, nopNo: -2 }
  };
  mocks.state.MAX_SCORES = { prayer: 50, diabetes: 20, whoop: 30, family: 30, habits: 30, total: 160 };
}

let storageStore = {};

beforeEach(() => {
  resetState();
  vi.clearAllMocks();
  resetMockImplementations();

  // Ensure app element exists for render()
  document.body.innerHTML = '<div id="app"></div>';

  // Provide minimal window globals that render.js delegates to
  window.renderTrackingTab = undefined;
  window.renderBulkEntryTab = undefined;
  window.renderDashboardTab = undefined;
  window.renderTasksTab = undefined;
  window.renderSettingsTab = undefined;
  window.renderMobileDrawer = undefined;
  window.renderTaskModalHtml = undefined;
  window.renderPerspectiveModalHtml = undefined;
  window.renderAreaModalHtml = undefined;
  window.renderLabelModalHtml = undefined;
  window.renderPersonModalHtml = undefined;
  window.renderCategoryModalHtml = undefined;
  window.renderBraindumpOverlay = undefined;
  window.renderBraindumpFAB = undefined;
  window.renderBottomNav = undefined;
  window.renderGlobalSearchHtml = undefined;
  window.renderUndoToastHtml = undefined;
  window.getCurrentViewInfo = undefined;
  window.setupSidebarDragDrop = undefined;
  window.initModalAutocomplete = undefined;
  window.setupInlineAutocomplete = undefined;
  window.scrollToContent = undefined;
  window.renderCalendarView = undefined;
  window.render = render;
  window.debouncedSaveToGithub = vi.fn();
  window.innerWidth = 1024;

  // Mock localStorage
  storageStore = {};
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => storageStore[key] ?? null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { storageStore[key] = String(value); });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => { delete storageStore[key]; });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// RENDER.JS TESTS
// ===========================================================================
describe('render.js', () => {
  describe('render()', () => {
    it('shows loading spinner when authLoading is true', () => {
      mocks.state.authLoading = true;
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Loading...');
      expect(app.innerHTML).toContain('animate-pulse');
    });

    it('shows login screen when currentUser is null', () => {
      mocks.state.authLoading = false;
      mocks.state.currentUser = null;
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Homebase');
      expect(app.innerHTML).toContain('Your life, all in one place');
      expect(app.innerHTML).toContain('Continue with Google');
      expect(app.innerHTML).toContain('signInWithGoogle()');
    });

    it('shows auth error message on login screen', () => {
      mocks.state.authLoading = false;
      mocks.state.currentUser = null;
      mocks.state.authError = 'Token expired';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Token expired');
    });

    it('shows version on login screen', () => {
      mocks.state.authLoading = false;
      mocks.state.currentUser = null;
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('4.43.2');
    });

    it('renders full app when authenticated', () => {
      mocks.state.activeTab = 'home';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Home Content');
      expect(app.innerHTML).toContain('Homebase');
    });

    it('renders home tab content when activeTab is home', () => {
      mocks.state.activeTab = 'home';
      render();
      expect(mocks.renderHomeTab).toHaveBeenCalled();
    });

    it('renders settings tab fallback when no window.renderSettingsTab', () => {
      mocks.state.activeTab = 'settings';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Loading settings tab...');
    });

    it('renders tasks tab fallback when no window.renderTasksTab', () => {
      mocks.state.activeTab = 'tasks';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Loading tasks tab...');
    });

    it('renders calendar fallback when no window.renderCalendarView', () => {
      mocks.state.activeTab = 'calendar';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Loading calendar...');
    });

    it('renders life tab daily sub-tab via window.renderTrackingTab', () => {
      mocks.state.activeTab = 'life';
      mocks.state.activeSubTab = 'daily';
      window.renderTrackingTab = vi.fn(() => '<div class="tracking-content">Daily</div>');
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('tracking-content');
    });

    it('renders life tab bulk sub-tab via window.renderBulkEntryTab', () => {
      mocks.state.activeTab = 'life';
      mocks.state.activeSubTab = 'bulk';
      window.renderBulkEntryTab = vi.fn(() => '<div class="bulk-content">Bulk</div>');
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('bulk-content');
    });

    it('renders life tab dashboard sub-tab fallback', () => {
      mocks.state.activeTab = 'life';
      mocks.state.activeSubTab = 'dashboard';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Loading dashboard tab...');
    });

    it('shows sub-navigation bar when life tab is active', () => {
      mocks.state.activeTab = 'life';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Dashboard');
      expect(app.innerHTML).toContain('Daily Entry');
      expect(app.innerHTML).toContain('Bulk Entry');
    });

    it('does not show sub-navigation for non-life tabs', () => {
      mocks.state.activeTab = 'home';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).not.toContain('Daily Entry');
      expect(app.innerHTML).not.toContain('Bulk Entry');
    });

    it('shows cache refresh prompt when showCacheRefreshPrompt is true', () => {
      mocks.state.showCacheRefreshPrompt = true;
      mocks.state.cacheRefreshPromptMessage = 'New version!';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('New app update available');
      expect(app.innerHTML).toContain('Refresh Now');
      expect(app.innerHTML).toContain('Later');
    });

    it('does not show cache refresh prompt when flag is false', () => {
      mocks.state.showCacheRefreshPrompt = false;
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).not.toContain('New app update available');
    });

    it('sets body-modal-open class when task modal is open', () => {
      mocks.state.showTaskModal = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('removes body-modal-open class when no modals are open', () => {
      mocks.state.showTaskModal = false;
      document.body.classList.add('body-modal-open');
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(false);
      expect(document.body.style.overflow).toBe('');
    });

    it('detects modal open for braindump', () => {
      mocks.state.showBraindump = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for global search', () => {
      mocks.state.showGlobalSearch = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for calendar event modal', () => {
      mocks.state.calendarEventModalOpen = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for perspective modal', () => {
      mocks.state.showPerspectiveModal = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for area modal', () => {
      mocks.state.showAreaModal = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for label modal', () => {
      mocks.state.showLabelModal = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for person modal', () => {
      mocks.state.showPersonModal = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('detects modal open for category modal', () => {
      mocks.state.showCategoryModal = true;
      render();
      expect(document.body.classList.contains('body-modal-open')).toBe(true);
    });

    it('updates renderPerf metrics after render', () => {
      mocks.state.renderPerf = { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
      render();
      expect(mocks.state.renderPerf.count).toBe(1);
      expect(mocks.state.renderPerf.lastMs).toBeGreaterThanOrEqual(0);
    });

    it('increments renderPerf count on successive renders', () => {
      render();
      render();
      render();
      expect(mocks.state.renderPerf.count).toBe(3);
    });

    it('tracks _lastRenderWasMobile based on window.innerWidth', () => {
      window.innerWidth = 400;
      render();
      expect(mocks.state._lastRenderWasMobile).toBe(true);

      window.innerWidth = 1024;
      render();
      expect(mocks.state._lastRenderWasMobile).toBe(false);
    });

    it('renders footer with sync status text', () => {
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Data saved locally');
    });

    it('renders footer with GitHub sync status when token present', () => {
      storageStore['lifeGamificationGithubToken'] = 'ghp_testtoken';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Data synced to GitHub');
    });

    it('shows navigation with all tab buttons', () => {
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Home');
      expect(app.innerHTML).toContain('Workspace');
      expect(app.innerHTML).toContain('Life Score');
      expect(app.innerHTML).toContain('Calendar');
      expect(app.innerHTML).toContain('Settings');
    });

    it('renders error fallback when an exception occurs', () => {
      mocks.renderHomeTab.mockImplementation(() => { throw new Error('Test render error'); });
      mocks.state.activeTab = 'home';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Something went wrong');
      expect(app.innerHTML).toContain('Test render error');
      expect(app.innerHTML).toContain('Reload App');
      expect(app.innerHTML).toContain('Export Data');
    });

    it('calls initModalAutocomplete when task modal is open', () => {
      const mockInit = vi.fn();
      window.initModalAutocomplete = mockInit;
      mocks.state.showTaskModal = true;
      render();
      expect(mockInit).toHaveBeenCalled();
    });

    it('calls setupSidebarDragDrop on tasks tab when pending items exist', () => {
      const mockSetup = vi.fn();
      window.setupSidebarDragDrop = mockSetup;
      mocks.state.activeTab = 'tasks';
      window.renderTasksTab = vi.fn(() => '<div class="draggable-item">Item</div>');
      render();
      expect(mockSetup).toHaveBeenCalled();
    });

    it('does not call setupSidebarDragDrop on non-tasks tab', () => {
      const mockSetup = vi.fn();
      window.setupSidebarDragDrop = mockSetup;
      mocks.state.activeTab = 'home';
      render();
      expect(mockSetup).not.toHaveBeenCalled();
    });

    it('renders category modal wrapper only when showCategoryModal is true', () => {
      const mockCatModal = vi.fn(() => '<div class="cat-modal">Category Modal</div>');
      window.renderCategoryModalHtml = mockCatModal;
      mocks.state.showCategoryModal = false;
      render();
      expect(mockCatModal).not.toHaveBeenCalled();

      mocks.state.showCategoryModal = true;
      render();
      expect(mockCatModal).toHaveBeenCalled();
    });

    it('delegates to window.renderCalendarView when available', () => {
      mocks.state.activeTab = 'calendar';
      window.renderCalendarView = vi.fn(() => '<div class="calendar-view">Cal</div>');
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('calendar-view');
    });

    it('renders date input with current date value', () => {
      mocks.state.currentDate = '2026-03-20';
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('value="2026-03-20"');
    });

    it('renders Force Hard Refresh button in footer', () => {
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Force Hard Refresh');
    });

    it('renders Today button in desktop header', () => {
      render();
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Today');
    });

    it('highlights active tab in navigation', () => {
      mocks.state.activeTab = 'tasks';
      render();
      const app = document.getElementById('app');
      // The active tasks tab button has aria-current="page"
      expect(app.innerHTML).toContain('aria-current="page"');
    });
  });

  describe('dismissCacheRefreshPrompt()', () => {
    it('clears showCacheRefreshPrompt and message', () => {
      mocks.state.showCacheRefreshPrompt = true;
      mocks.state.cacheRefreshPromptMessage = 'Update!';
      dismissCacheRefreshPrompt();
      expect(mocks.state.showCacheRefreshPrompt).toBe(false);
      expect(mocks.state.cacheRefreshPromptMessage).toBe('');
    });

    it('saves version to localStorage', () => {
      dismissCacheRefreshPrompt();
      expect(storageStore['nucleusAppVersionSeen']).toBe(mocks.APP_VERSION);
    });

    it('triggers a re-render by calling render()', () => {
      // render() is called internally, so renderPerf.count should increment
      mocks.state.renderPerf = { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
      dismissCacheRefreshPrompt();
      expect(mocks.state.renderPerf.count).toBeGreaterThan(0);
    });
  });

  describe('switchTab()', () => {
    it('changes activeTab to a valid tab', () => {
      switchTab('tasks');
      expect(mocks.state.activeTab).toBe('tasks');
    });

    it('rejects invalid tab names', () => {
      mocks.state.activeTab = 'home';
      switchTab('invalid');
      expect(mocks.state.activeTab).toBe('home');
    });

    it('rejects empty string', () => {
      mocks.state.activeTab = 'home';
      switchTab('');
      expect(mocks.state.activeTab).toBe('home');
    });

    it('rejects null/undefined', () => {
      mocks.state.activeTab = 'home';
      switchTab(null);
      expect(mocks.state.activeTab).toBe('home');
      switchTab(undefined);
      expect(mocks.state.activeTab).toBe('home');
    });

    it('accepts all valid tab values', () => {
      ['home', 'tasks', 'life', 'calendar', 'settings'].forEach(tab => {
        switchTab(tab);
        expect(mocks.state.activeTab).toBe(tab);
      });
    });

    it('calls saveViewState after switching', () => {
      switchTab('settings');
      expect(mocks.saveViewState).toHaveBeenCalled();
    });

    it('clears inlineAutocompleteMeta on tab switch', () => {
      mocks.state.inlineAutocompleteMeta.set('test', { areaId: '123' });
      switchTab('tasks');
      expect(mocks.state.inlineAutocompleteMeta.size).toBe(0);
    });

    it('closes mobile drawer on tab switch', () => {
      mocks.state.mobileDrawerOpen = true;
      document.body.classList.add('drawer-open');
      switchTab('home');
      expect(mocks.state.mobileDrawerOpen).toBe(false);
      expect(document.body.classList.contains('drawer-open')).toBe(false);
    });

    it('removes inline autocomplete popups from DOM', () => {
      const popup = document.createElement('div');
      popup.className = 'inline-autocomplete-popup';
      document.body.appendChild(popup);
      switchTab('home');
      expect(document.querySelectorAll('.inline-autocomplete-popup').length).toBe(0);
    });

    it('does not close drawer if already closed', () => {
      mocks.state.mobileDrawerOpen = false;
      switchTab('life');
      expect(mocks.state.mobileDrawerOpen).toBe(false);
    });

    it('triggers render after tab switch', () => {
      mocks.state.renderPerf = { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
      switchTab('settings');
      expect(mocks.state.renderPerf.count).toBeGreaterThan(0);
    });
  });

  describe('switchSubTab()', () => {
    it('sets activeSubTab', () => {
      switchSubTab('daily');
      expect(mocks.state.activeSubTab).toBe('daily');
    });

    it('calls saveViewState', () => {
      switchSubTab('bulk');
      expect(mocks.saveViewState).toHaveBeenCalled();
    });

    it('triggers re-render', () => {
      mocks.state.renderPerf = { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
      switchSubTab('dashboard');
      expect(mocks.state.renderPerf.count).toBeGreaterThan(0);
    });

    it('sets any string value as sub-tab', () => {
      switchSubTab('custom');
      expect(mocks.state.activeSubTab).toBe('custom');
    });
  });

  describe('setToday()', () => {
    it('sets currentDate to today', () => {
      mocks.state.currentDate = '2020-01-01';
      setToday();
      expect(mocks.state.currentDate).toBe('2026-01-15');
    });

    it('triggers re-render', () => {
      mocks.state.renderPerf = { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 };
      setToday();
      expect(mocks.state.renderPerf.count).toBeGreaterThan(0);
    });

    it('uses getLocalDateString for the date', () => {
      mocks.getLocalDateString.mockReturnValue('2026-12-25');
      setToday();
      expect(mocks.state.currentDate).toBe('2026-12-25');
    });
  });

  describe('forceHardRefresh()', () => {
    it('calls window.location.reload', async () => {
      const reloadMock = vi.fn();
      const origLocation = window.location;
      delete window.location;
      window.location = { reload: reloadMock };
      await forceHardRefresh();
      expect(reloadMock).toHaveBeenCalledWith(true);
      window.location = origLocation;
    });
  });
});

// ===========================================================================
// TRACKING.JS TESTS
// ===========================================================================
describe('tracking.js', () => {
  describe('renderTrackingTab()', () => {
    it('returns a string', () => {
      const result = renderTrackingTab();
      expect(typeof result).toBe('string');
    });

    it('contains score cards section', () => {
      const html = renderTrackingTab();
      expect(mocks.createScoreCard).toHaveBeenCalled();
      expect(html).toContain('score-card');
    });

    it('renders all 5 score cards plus total', () => {
      renderTrackingTab();
      expect(mocks.createScoreCard).toHaveBeenCalledTimes(5);
      expect(mocks.createScoreCard).toHaveBeenCalledWith('Prayer', 10, 50, 'bg-blue-500');
      expect(mocks.createScoreCard).toHaveBeenCalledWith('Diabetes', 8, 20, 'bg-green-500');
      expect(mocks.createScoreCard).toHaveBeenCalledWith('Whoop', 12, 30, 'bg-purple-500');
      expect(mocks.createScoreCard).toHaveBeenCalledWith('Family', 6, 30, 'bg-amber-500');
      expect(mocks.createScoreCard).toHaveBeenCalledWith('Habits', 6, 30, 'bg-slate-500');
    });

    it('shows total score with percentage', () => {
      const html = renderTrackingTab();
      // 42/160 = 26.25% -> Math.round(26.25) = 26
      expect(html).toContain('Total');
      expect(html).toContain('26%');
    });

    it('contains prayers section', () => {
      const html = renderTrackingTab();
      expect(html).toContain('Prayers');
      expect(html).toContain('prayer-input');
    });

    it('renders all 5 prayer inputs', () => {
      renderTrackingTab();
      expect(mocks.createPrayerInput).toHaveBeenCalledTimes(5);
      expect(mocks.createPrayerInput).toHaveBeenCalledWith('fajr', 'Fajr', '');
      expect(mocks.createPrayerInput).toHaveBeenCalledWith('dhuhr', 'Dhuhr', '');
      expect(mocks.createPrayerInput).toHaveBeenCalledWith('asr', 'Asr', '');
      expect(mocks.createPrayerInput).toHaveBeenCalledWith('maghrib', 'Maghrib', '');
      expect(mocks.createPrayerInput).toHaveBeenCalledWith('isha', 'Isha', '');
    });

    it('contains Quran counter', () => {
      const html = renderTrackingTab();
      expect(html).toContain('Quran');
      expect(html).toContain('pages');
    });

    it('contains glucose section', () => {
      const html = renderTrackingTab();
      expect(html).toContain('Glucose');
      expect(html).toContain('Avg Glucose');
      expect(html).toContain('TIR');
      expect(html).toContain('Insulin');
    });

    it('contains whoop section', () => {
      const html = renderTrackingTab();
      expect(html).toContain('Whoop');
      expect(html).toContain('Sleep Perf');
      expect(html).toContain('Recovery');
      expect(html).toContain('Strain');
      expect(html).toContain('Whoop Age');
    });

    it('contains family section with all 6 members', () => {
      const html = renderTrackingTab();
      expect(html).toContain('Family Check-ins');
      expect(mocks.createToggle).toHaveBeenCalledWith('Mom', false, 'family', 'mom');
      expect(mocks.createToggle).toHaveBeenCalledWith('Dad', false, 'family', 'dad');
      expect(mocks.createToggle).toHaveBeenCalledWith('Jana', false, 'family', 'jana');
      expect(mocks.createToggle).toHaveBeenCalledWith('Tia', false, 'family', 'tia');
      expect(mocks.createToggle).toHaveBeenCalledWith('Ahmed', false, 'family', 'ahmed');
      expect(mocks.createToggle).toHaveBeenCalledWith('Eman', false, 'family', 'eman');
    });

    it('shows family check-in count', () => {
      const html = renderTrackingTab();
      expect(html).toContain('0/6');
    });

    it('shows family check-in count with data', () => {
      mocks.getTodayData.mockReturnValue({
        prayers: {}, glucose: {}, whoop: {},
        family: { mom: true, dad: true, jana: false, tia: false, ahmed: false, eman: false },
        habits: {}, libre: {}
      });
      const html = renderTrackingTab();
      expect(html).toContain('2/6');
    });

    it('contains habits section', () => {
      const html = renderTrackingTab();
      expect(html).toContain('Habits');
      expect(html).toContain('Water');
      expect(html).toContain('NoP');
    });

    it('renders exercise, reading, meditation, brushTeeth counters', () => {
      renderTrackingTab();
      expect(mocks.createCounter).toHaveBeenCalledWith(expect.stringContaining('Exercise'), 0, 'habits', 'exercise', 5);
      expect(mocks.createCounter).toHaveBeenCalledWith(expect.stringContaining('Reading'), 0, 'habits', 'reading', 5);
      expect(mocks.createCounter).toHaveBeenCalledWith(expect.stringContaining('Meditation'), 0, 'habits', 'meditation', 5);
      expect(mocks.createCounter).toHaveBeenCalledWith(expect.stringContaining('Brush Teeth'), 0, 'habits', 'brushTeeth', 3);
    });

    it('renders vitamins toggle', () => {
      renderTrackingTab();
      expect(mocks.createToggle).toHaveBeenCalledWith(expect.stringContaining('Vitamins'), false, 'habits', 'vitamins');
    });

    it('shows whoop auto-synced badge when connected', () => {
      mocks.isWhoopConnected.mockReturnValue(true);
      mocks.getWhoopLastSync.mockReturnValue(Date.now());
      const html = renderTrackingTab();
      expect(html).toContain('Auto-synced');
    });

    it('shows libre connected badge when connected', () => {
      mocks.isLibreConnected.mockReturnValue(true);
      mocks.getLibreLastSync.mockReturnValue(Date.now());
      const html = renderTrackingTab();
      expect(html).toContain('Libre Connected');
    });

    it('shows read-only whoop fields when whoop is connected and has data', () => {
      mocks.isWhoopConnected.mockReturnValue(true);
      mocks.getWhoopLastSync.mockReturnValue(Date.now());
      mocks.getTodayData.mockReturnValue({
        prayers: {}, glucose: {}, libre: {},
        whoop: { sleepPerf: 85, recovery: 72, strain: 14, whoopAge: '' },
        family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
        habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' }
      });
      const html = renderTrackingTab();
      expect(html).toContain('Auto-synced');
    });

    it('shows read-only glucose fields when libre is connected and has data', () => {
      mocks.isLibreConnected.mockReturnValue(true);
      mocks.getLibreLastSync.mockReturnValue(Date.now());
      mocks.getTodayData.mockReturnValue({
        prayers: {}, whoop: {}, libre: { currentGlucose: 110, trend: '→' },
        glucose: { avg: 105, tir: 80, insulin: '' },
        family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
        habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' }
      });
      const html = renderTrackingTab();
      expect(html).toContain('Auto-synced');
      expect(html).toContain('110');
    });

    it('calls getTodayData for current data', () => {
      renderTrackingTab();
      expect(mocks.getTodayData).toHaveBeenCalled();
    });

    it('calls calculateScores with today data', () => {
      renderTrackingTab();
      expect(mocks.calculateScores).toHaveBeenCalled();
    });

    it('handles null scores gracefully', () => {
      mocks.calculateScores.mockReturnValue(null);
      const html = renderTrackingTab();
      expect(html).toContain('Total');
    });

    it('uses insulin threshold from WEIGHTS', () => {
      const html = renderTrackingTab();
      expect(html).toContain('40');
    });

    it('shows live glucose color coding for high values', () => {
      mocks.isLibreConnected.mockReturnValue(true);
      mocks.getLibreLastSync.mockReturnValue(Date.now());
      mocks.getTodayData.mockReturnValue({
        prayers: {}, whoop: {}, glucose: {},
        libre: { currentGlucose: 200, trend: '↑' },
        family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
        habits: {}
      });
      const html = renderTrackingTab();
      expect(html).toContain('danger');
    });

    it('shows live glucose color coding for warning values', () => {
      mocks.isLibreConnected.mockReturnValue(true);
      mocks.getLibreLastSync.mockReturnValue(Date.now());
      mocks.getTodayData.mockReturnValue({
        prayers: {}, whoop: {}, glucose: {},
        libre: { currentGlucose: 150, trend: '→' },
        family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
        habits: {}
      });
      const html = renderTrackingTab();
      expect(html).toContain('warning');
    });

    it('shows live glucose color coding for normal values', () => {
      mocks.isLibreConnected.mockReturnValue(true);
      mocks.getLibreLastSync.mockReturnValue(Date.now());
      mocks.getTodayData.mockReturnValue({
        prayers: {}, whoop: {}, glucose: {},
        libre: { currentGlucose: 100, trend: '→' },
        family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
        habits: {}
      });
      const html = renderTrackingTab();
      expect(html).toContain('success');
    });
  });
});

// ===========================================================================
// BULK-ENTRY.JS TESTS
// ===========================================================================
describe('bulk-entry.js', () => {
  describe('getDaysInMonth()', () => {
    it('returns 31 for January', () => {
      expect(getDaysInMonth(0, 2026)).toBe(31);
    });

    it('returns 28 for February in non-leap year', () => {
      expect(getDaysInMonth(1, 2026)).toBe(28);
    });

    it('returns 29 for February in leap year', () => {
      expect(getDaysInMonth(1, 2024)).toBe(29);
    });

    it('returns 30 for April', () => {
      expect(getDaysInMonth(3, 2026)).toBe(30);
    });

    it('returns 30 for June', () => {
      expect(getDaysInMonth(5, 2026)).toBe(30);
    });

    it('returns 31 for March', () => {
      expect(getDaysInMonth(2, 2026)).toBe(31);
    });

    it('returns 31 for July', () => {
      expect(getDaysInMonth(6, 2026)).toBe(31);
    });

    it('returns 31 for August', () => {
      expect(getDaysInMonth(7, 2026)).toBe(31);
    });

    it('returns 30 for September', () => {
      expect(getDaysInMonth(8, 2026)).toBe(30);
    });

    it('returns 31 for October', () => {
      expect(getDaysInMonth(9, 2026)).toBe(31);
    });

    it('returns 30 for November', () => {
      expect(getDaysInMonth(10, 2026)).toBe(30);
    });

    it('returns 31 for December', () => {
      expect(getDaysInMonth(11, 2026)).toBe(31);
    });

    it('handles year 2000 (leap year)', () => {
      expect(getDaysInMonth(1, 2000)).toBe(29);
    });

    it('handles year 1900 (not a leap year)', () => {
      expect(getDaysInMonth(1, 1900)).toBe(28);
    });
  });

  describe('setBulkMonth()', () => {
    it('sets bulkMonth and bulkYear on state', () => {
      const renderSpy = vi.fn();
      window.render = renderSpy;
      setBulkMonth(5, 2027);
      expect(mocks.state.bulkMonth).toBe(5);
      expect(mocks.state.bulkYear).toBe(2027);
      window.render = render;
    });

    it('parses string inputs to integers', () => {
      const renderSpy = vi.fn();
      window.render = renderSpy;
      setBulkMonth('3', '2028');
      expect(mocks.state.bulkMonth).toBe(3);
      expect(mocks.state.bulkYear).toBe(2028);
      window.render = render;
    });

    it('calls window.render()', () => {
      const renderSpy = vi.fn();
      window.render = renderSpy;
      setBulkMonth(0, 2026);
      expect(renderSpy).toHaveBeenCalled();
      window.render = render;
    });
  });

  describe('setBulkCategory()', () => {
    it('sets bulkCategory on state', () => {
      const renderSpy = vi.fn();
      window.render = renderSpy;
      setBulkCategory('glucose');
      expect(mocks.state.bulkCategory).toBe('glucose');
      window.render = render;
    });

    it('calls window.render()', () => {
      const renderSpy = vi.fn();
      window.render = renderSpy;
      setBulkCategory('family');
      expect(renderSpy).toHaveBeenCalled();
      window.render = render;
    });
  });

  describe('updateBulkData()', () => {
    beforeEach(() => {
      mocks.state.allData = {};
      // updateBulkData calls updateBulkSummary which calls calculateScores for all days in month
      // Make sure calculateScores always returns a valid object
      mocks.calculateScores.mockReturnValue({ total: 42 });
    });

    it('creates day data if not exists', () => {
      updateBulkData('2026-01-01', 'prayers', 'fajr', '1.0');
      expect(mocks.state.allData['2026-01-01']).toBeDefined();
      expect(mocks.state.allData['2026-01-01'].prayers.fajr).toBe(1);
    });

    it('stores family values as booleans', () => {
      updateBulkData('2026-01-01', 'family', 'mom', '1');
      expect(mocks.state.allData['2026-01-01'].family.mom).toBe(true);
    });

    it('stores family false for empty value', () => {
      updateBulkData('2026-01-01', 'family', 'dad', '');
      expect(mocks.state.allData['2026-01-01'].family.dad).toBe(false);
    });

    it('stores family true for boolean true', () => {
      updateBulkData('2026-01-01', 'family', 'jana', true);
      expect(mocks.state.allData['2026-01-01'].family.jana).toBe(true);
    });

    it('stores numeric values as numbers', () => {
      updateBulkData('2026-01-01', 'glucose', 'avg', '105');
      expect(mocks.state.allData['2026-01-01'].glucose.avg).toBe(105);
    });

    it('stores empty value as null', () => {
      updateBulkData('2026-01-01', 'glucose', 'avg', '');
      expect(mocks.state.allData['2026-01-01'].glucose.avg).toBeNull();
    });

    it('stores non-numeric strings as-is', () => {
      updateBulkData('2026-01-01', 'prayers', 'fajr', 'abc');
      expect(mocks.state.allData['2026-01-01'].prayers.fajr).toBe('abc');
    });

    it('sets _lastModified timestamp', () => {
      updateBulkData('2026-01-01', 'prayers', 'fajr', '1.0');
      expect(mocks.state.allData['2026-01-01']._lastModified).toBeDefined();
      // Should be a valid ISO date string
      expect(new Date(mocks.state.allData['2026-01-01']._lastModified).getTime()).toBeGreaterThan(0);
    });

    it('calls invalidateScoresCache', () => {
      updateBulkData('2026-01-01', 'prayers', 'fajr', '1.0');
      expect(mocks.invalidateScoresCache).toHaveBeenCalled();
    });

    it('calls saveData', () => {
      updateBulkData('2026-01-01', 'prayers', 'fajr', '1.0');
      expect(mocks.saveData).toHaveBeenCalled();
    });

    it('calls debouncedSaveToGithub', () => {
      updateBulkData('2026-01-01', 'prayers', 'fajr', '1.0');
      expect(window.debouncedSaveToGithub).toHaveBeenCalled();
    });

    it('preserves existing day data when updating a single field', () => {
      mocks.state.allData['2026-01-01'] = JSON.parse(JSON.stringify(mocks.defaultDayData));
      mocks.state.allData['2026-01-01'].prayers.fajr = '1.0';
      updateBulkData('2026-01-01', 'prayers', 'dhuhr', '1.0');
      expect(mocks.state.allData['2026-01-01'].prayers.fajr).toBe('1.0');
      expect(mocks.state.allData['2026-01-01'].prayers.dhuhr).toBe(1);
    });

    it('handles float values for glucose', () => {
      updateBulkData('2026-01-01', 'glucose', 'tir', '78.5');
      expect(mocks.state.allData['2026-01-01'].glucose.tir).toBe(78.5);
    });

    it('handles zero as a numeric value', () => {
      updateBulkData('2026-01-01', 'habits', 'exercise', '0');
      expect(mocks.state.allData['2026-01-01'].habits.exercise).toBe(0);
    });

    it('handles negative values', () => {
      updateBulkData('2026-01-01', 'habits', 'nop', '-1');
      expect(mocks.state.allData['2026-01-01'].habits.nop).toBe(-1);
    });
  });

  describe('updateBulkSummary()', () => {
    beforeEach(() => {
      mocks.calculateScores.mockReturnValue({ total: 50 });
    });

    it('runs without error when DOM elements do not exist', () => {
      expect(() => updateBulkSummary()).not.toThrow();
    });

    it('updates DOM elements when they exist', () => {
      document.body.innerHTML = `
        <div id="app">
          <div id="bulk-days-logged">0</div>
          <div id="bulk-total-score">0</div>
          <div id="bulk-avg-score">0</div>
          <div id="bulk-completion">0%</div>
        </div>
      `;
      mocks.state.bulkMonth = 0;
      mocks.state.bulkYear = 2026;
      mocks.state.allData = {
        '2026-01-01': { prayers: {} },
        '2026-01-02': { prayers: {} },
      };
      updateBulkSummary();
      expect(document.getElementById('bulk-days-logged').textContent).toBe('2');
      expect(document.getElementById('bulk-total-score').textContent).toBe('100');
    });

    it('handles month with no data', () => {
      document.body.innerHTML = `
        <div id="app">
          <div id="bulk-days-logged">0</div>
          <div id="bulk-total-score">0</div>
          <div id="bulk-avg-score">0</div>
          <div id="bulk-completion">0%</div>
        </div>
      `;
      mocks.state.allData = {};
      updateBulkSummary();
      expect(document.getElementById('bulk-days-logged').textContent).toBe('0');
      expect(document.getElementById('bulk-avg-score').textContent).toBe('0');
      expect(document.getElementById('bulk-completion').textContent).toBe('0%');
    });

    it('calculates correct average', () => {
      document.body.innerHTML = `
        <div id="app">
          <div id="bulk-days-logged">0</div>
          <div id="bulk-total-score">0</div>
          <div id="bulk-avg-score">0</div>
          <div id="bulk-completion">0%</div>
        </div>
      `;
      mocks.state.bulkMonth = 0;
      mocks.state.bulkYear = 2026;
      mocks.state.allData = {
        '2026-01-01': { prayers: {} },
        '2026-01-02': { prayers: {} },
        '2026-01-03': { prayers: {} },
      };
      mocks.calculateScores.mockReturnValue({ total: 60 });
      updateBulkSummary();
      // 3 days * 60 = 180 total, 180/3 = 60 avg
      expect(document.getElementById('bulk-avg-score').textContent).toBe('60');
      // 3/31 = 9.67% -> Math.round = 10%
      expect(document.getElementById('bulk-completion').textContent).toBe('10%');
    });
  });

  describe('renderBulkEntryTab()', () => {
    it('returns a string', () => {
      const result = renderBulkEntryTab();
      expect(typeof result).toBe('string');
    });

    it('contains month selector', () => {
      const html = renderBulkEntryTab();
      expect(html).toContain('Month');
      expect(html).toContain('select');
      expect(html).toContain('setBulkMonth');
    });

    it('contains category buttons', () => {
      const html = renderBulkEntryTab();
      expect(html).toContain('Prayers');
      expect(html).toContain('Glucose');
      expect(html).toContain('Whoop');
      expect(html).toContain('Family');
      expect(html).toContain('Habits');
    });

    it('renders correct number of rows for January', () => {
      mocks.state.bulkMonth = 0;
      mocks.state.bulkYear = 2026;
      const html = renderBulkEntryTab();
      // January has 31 days; prayers has 6 fields -> 31 * 6 = 186 updateBulkData calls
      const dayMatches = html.match(/updateBulkData\(/g);
      expect(dayMatches.length).toBe(31 * 6);
    });

    it('renders correct row count for February non-leap', () => {
      mocks.state.bulkMonth = 1;
      mocks.state.bulkYear = 2026;
      const html = renderBulkEntryTab();
      const dayMatches = html.match(/updateBulkData\(/g);
      expect(dayMatches.length).toBe(28 * 6);
    });

    it('shows prayer hint when prayers category is selected', () => {
      mocks.state.bulkCategory = 'prayers';
      const html = renderBulkEntryTab();
      expect(html).toContain('X.Y format');
    });

    it('shows family hint when family category is selected', () => {
      mocks.state.bulkCategory = 'family';
      const html = renderBulkEntryTab();
      expect(html).toContain('Check box if you connected');
    });

    it('renders checkboxes for family category', () => {
      mocks.state.bulkCategory = 'family';
      const html = renderBulkEntryTab();
      expect(html).toContain('type="checkbox"');
    });

    it('renders text inputs for prayer fields', () => {
      mocks.state.bulkCategory = 'prayers';
      const html = renderBulkEntryTab();
      expect(html).toContain('type="text"');
      expect(html).toContain('placeholder="X.Y"');
    });

    it('renders number inputs for glucose fields', () => {
      mocks.state.bulkCategory = 'glucose';
      const html = renderBulkEntryTab();
      expect(html).toContain('type="number"');
    });

    it('contains summary section', () => {
      const html = renderBulkEntryTab();
      expect(html).toContain('Days Logged');
      expect(html).toContain('Total Score');
      expect(html).toContain('Avg Daily Score');
      expect(html).toContain('Completion Rate');
    });

    it('renders score column in table', () => {
      const html = renderBulkEntryTab();
      expect(html).toContain('Score');
    });

    it('shows all whoop auto-synced message when whoop is connected', () => {
      mocks.state.bulkCategory = 'whoop';
      mocks.isWhoopConnected.mockReturnValue(true);
      const html = renderBulkEntryTab();
      expect(html).toContain('All Whoop metrics are auto-synced');
    });

    it('shows libre auto-synced note when libre is connected for glucose', () => {
      mocks.state.bulkCategory = 'glucose';
      mocks.isLibreConnected.mockReturnValue(true);
      const html = renderBulkEntryTab();
      // The message contains HTML-encoded ampersand
      expect(html).toContain('TIR are auto-synced');
    });

    it('renders habits category with all fields', () => {
      mocks.state.bulkCategory = 'habits';
      const html = renderBulkEntryTab();
      // habits has 7 fields, 31 days in January
      const dayMatches = html.match(/updateBulkData\(/g);
      expect(dayMatches.length).toBe(31 * 7);
    });

    it('correctly includes today date in output', () => {
      mocks.getLocalDateString.mockReturnValue('2026-01-15');
      mocks.state.bulkMonth = 0;
      mocks.state.bulkYear = 2026;
      const html = renderBulkEntryTab();
      expect(html).toContain('2026-01-15');
    });

    it('uses correct month name in header', () => {
      mocks.state.bulkMonth = 0;
      mocks.state.bulkYear = 2026;
      const html = renderBulkEntryTab();
      expect(html).toContain('January 2026');
    });

    it('uses category color for active button', () => {
      mocks.state.bulkCategory = 'prayers';
      const html = renderBulkEntryTab();
      expect(html).toContain('background-color: #4A90A4');
    });

    it('renders with existing data in allData', () => {
      mocks.state.allData['2026-01-01'] = {
        ...JSON.parse(JSON.stringify(mocks.defaultDayData)),
        prayers: { fajr: '1.0', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 }
      };
      mocks.state.bulkCategory = 'prayers';
      const html = renderBulkEntryTab();
      expect(html).toContain('1.0');
    });

    it('renders December correctly', () => {
      mocks.state.bulkMonth = 11;
      mocks.state.bulkYear = 2026;
      const html = renderBulkEntryTab();
      expect(html).toContain('December 2026');
    });

    it('renders February leap year correctly', () => {
      mocks.state.bulkMonth = 1;
      mocks.state.bulkYear = 2024;
      const html = renderBulkEntryTab();
      // 29 days * 6 fields = 174
      const dayMatches = html.match(/updateBulkData\(/g);
      expect(dayMatches.length).toBe(29 * 6);
    });

    it('renders whoop category with 3 fields when not connected', () => {
      mocks.state.bulkCategory = 'whoop';
      mocks.isWhoopConnected.mockReturnValue(false);
      const html = renderBulkEntryTab();
      // whoop has 3 fields, 31 days = 93
      const dayMatches = html.match(/updateBulkData\(/g);
      expect(dayMatches.length).toBe(31 * 3);
    });

    it('renders glucose with only insulin when libre connected', () => {
      mocks.state.bulkCategory = 'glucose';
      mocks.isLibreConnected.mockReturnValue(true);
      const html = renderBulkEntryTab();
      // Only insulin field remains, 31 days * 1 field = 31
      const dayMatches = html.match(/updateBulkData\(/g);
      expect(dayMatches.length).toBe(31 * 1);
    });
  });
});

// ===========================================================================
// SETTINGS.JS TESTS
// ===========================================================================
describe('settings.js', () => {
  describe('createWeightInput()', () => {
    it('returns an HTML string', () => {
      const result = createWeightInput('Test Label', 5, 'prayer', 'onTime');
      expect(typeof result).toBe('string');
    });

    it('contains the label text', () => {
      const html = createWeightInput('On-time prayer', 5, 'prayer', 'onTime');
      expect(html).toContain('On-time prayer');
    });

    it('contains the value in the input', () => {
      const html = createWeightInput('Test', 10, 'glucose', 'avgMax');
      expect(html).toContain('value="10"');
    });

    it('contains the category in the onchange handler', () => {
      const html = createWeightInput('Test', 5, 'prayer', 'onTime');
      expect(html).toContain("'prayer'");
      expect(html).toContain("'onTime'");
    });

    it('handles null field parameter', () => {
      const html = createWeightInput('Test', 5, 'prayer', null);
      expect(html).toContain('null');
    });

    it('handles field as undefined (not passed)', () => {
      const html = createWeightInput('Test', 5, 'prayer');
      expect(html).toContain('null');
    });

    it('renders correct input type as number', () => {
      const html = createWeightInput('Weight', 5, 'prayer', 'onTime');
      expect(html).toContain('type="number"');
      expect(html).toContain('step="1"');
    });

    it('renders with zero value', () => {
      const html = createWeightInput('Zero Test', 0, 'habits', 'water');
      expect(html).toContain('value="0"');
    });

    it('renders with negative value', () => {
      const html = createWeightInput('Penalty', -2, 'habits', 'nopNo');
      expect(html).toContain('value="-2"');
    });

    it('renders with decimal value', () => {
      const html = createWeightInput('TIR', 0.1, 'glucose', 'tirPerPoint');
      expect(html).toContain('value="0.1"');
    });
  });

  describe('renderSettingsTab()', () => {
    it('returns a string', () => {
      const html = renderSettingsTab();
      expect(typeof html).toBe('string');
    });

    it('shows user profile when currentUser exists', () => {
      mocks.state.currentUser = { displayName: 'Test User', email: 'test@test.com' };
      const html = renderSettingsTab();
      expect(html).toContain('Test User');
      expect(html).toContain('test@test.com');
    });

    it('shows user avatar initial when no photoURL', () => {
      mocks.state.currentUser = { displayName: 'Test User', email: 'test@test.com' };
      const html = renderSettingsTab();
      // The first character of displayName, uppercased
      expect(html).toContain('>T<');
    });

    it('shows photo when photoURL exists', () => {
      mocks.state.currentUser = { displayName: 'Test', email: 'a@b.c', photoURL: 'https://photo.test/img.jpg' };
      const html = renderSettingsTab();
      expect(html).toContain('https://photo.test/img.jpg');
    });

    it('shows sign out button', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Sign Out');
      expect(html).toContain('signOutUser()');
    });

    it('contains Appearance section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Appearance');
      expect(html).toContain('Color mode');
      expect(html).toContain('Theme');
    });

    it('contains theme options', () => {
      const html = renderSettingsTab();
      expect(html).toContain('SimpleBits');
      expect(html).toContain('Things 3');
      expect(html).toContain('Geist');
    });

    it('contains Cloud Sync section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Cloud Sync');
      expect(html).toContain('github-token-input');
    });

    it('shows connected status when github token exists', () => {
      mocks.getGithubToken.mockReturnValue('ghp_test');
      const html = renderSettingsTab();
      expect(html).toContain('Connected');
    });

    it('shows not connected when no github token', () => {
      mocks.getGithubToken.mockReturnValue('');
      const html = renderSettingsTab();
      expect(html).toContain('Not connected');
    });

    it('contains Sync Health section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Sync Health');
      // 9/10 = 90%
      expect(html).toContain('90%');
    });

    it('contains Integrations section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Integrations');
      expect(html).toContain('WHOOP');
      expect(html).toContain('Freestyle Libre');
      expect(html).toContain('Google Calendar');
      expect(html).toContain('AI Classification');
    });

    it('shows integrations count', () => {
      mocks.isWhoopConnected.mockReturnValue(false);
      mocks.isLibreConnected.mockReturnValue(false);
      mocks.isGCalConnected.mockReturnValue(false);
      const html = renderSettingsTab();
      expect(html).toContain('0/3 connected');
    });

    it('shows correct integrations count when some connected', () => {
      mocks.isWhoopConnected.mockReturnValue(true);
      mocks.isLibreConnected.mockReturnValue(false);
      mocks.isGCalConnected.mockReturnValue(true);
      const html = renderSettingsTab();
      expect(html).toContain('2/3 connected');
    });

    it('contains Scoring Configuration section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Scoring Configuration');
      expect(html).toContain('Weights');
      expect(html).toContain('targets');
      expect(html).toContain('Scoring Weights');
      expect(html).toContain('Perfect Day Targets');
    });

    it('renders prayer weight inputs', () => {
      const html = renderSettingsTab();
      expect(html).toContain('On-time prayer');
      expect(html).toContain('Late prayer');
      expect(html).toContain('Quran (per page)');
    });

    it('renders glucose weight inputs', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Avg Glucose max pts');
      expect(html).toContain('TIR pts per %');
      expect(html).toContain('Insulin threshold');
    });

    it('renders whoop weight inputs', () => {
      const html = renderSettingsTab();
      // escapeHtml encodes >= as &gt;= but our mock just escapes the string
      expect(html).toContain('Sleep');
      expect(html).toContain('90%');
      expect(html).toContain('Recovery');
      expect(html).toContain('66%');
      expect(html).toContain('Strain match');
    });

    it('renders family weight inputs', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Mom');
      expect(html).toContain('Dad');
      expect(html).toContain('Jana');
      expect(html).toContain('Tia');
      expect(html).toContain('Ahmed');
      expect(html).toContain('Eman');
    });

    it('renders habit weight inputs', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Exercise');
      expect(html).toContain('Reading');
      expect(html).toContain('Meditation');
      expect(html).toContain('Water (per L)');
      expect(html).toContain('Vitamins');
      expect(html).toContain('Brush Teeth');
      expect(html).toContain('NoP bonus');
      expect(html).toContain('NoP penalty');
    });

    it('renders max score inputs for all categories', () => {
      const html = renderSettingsTab();
      expect(html).toContain("updateMaxScore('prayer'");
      expect(html).toContain("updateMaxScore('diabetes'");
      expect(html).toContain("updateMaxScore('whoop'");
      expect(html).toContain("updateMaxScore('family'");
      expect(html).toContain("updateMaxScore('habits'");
      expect(html).toContain("updateMaxScore('total'");
    });

    it('renders reset buttons for weights and max scores', () => {
      const html = renderSettingsTab();
      expect(html).toContain('resetWeights()');
      expect(html).toContain('resetMaxScores()');
    });

    it('contains Data and Diagnostics section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Data');
      expect(html).toContain('Diagnostics');
    });

    it('contains data management buttons', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Export');
      expect(html).toContain('Import');
      expect(html).toContain('Force Refresh');
    });

    it('contains note safety section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Note Safety');
    });

    it('contains offline queue section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Offline Queue');
    });

    it('contains conflict center section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Conflict Center');
    });

    it('contains client profiling section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Client Profiling');
    });

    it('shows dirty sync status when githubSyncDirty is true', () => {
      mocks.state.githubSyncDirty = true;
      const html = renderSettingsTab();
      expect(html).toContain('Unsaved changes');
    });

    it('shows clean sync status when githubSyncDirty is false', () => {
      mocks.state.githubSyncDirty = false;
      const html = renderSettingsTab();
      expect(html).toContain('Clean');
    });

    it('renders sync health with last error when present', () => {
      mocks.getSyncHealth.mockReturnValue({
        totalSaves: 10, successfulSaves: 8, totalLoads: 5, successfulLoads: 5,
        avgSaveLatencyMs: 200,
        lastError: { message: 'Rate limited', timestamp: new Date().toISOString() },
        recentEvents: []
      });
      const html = renderSettingsTab();
      expect(html).toContain('Rate limited');
    });

    it('renders sync health recent events', () => {
      mocks.getSyncHealth.mockReturnValue({
        totalSaves: 10, successfulSaves: 9, totalLoads: 5, successfulLoads: 5,
        avgSaveLatencyMs: 100, lastError: null,
        recentEvents: [
          { type: 'save', status: 'success', timestamp: new Date().toISOString(), details: 'ok' },
          { type: 'load', status: 'error', timestamp: new Date().toISOString(), details: 'fail' }
        ]
      });
      const html = renderSettingsTab();
      expect(html).toContain('Recent sync events');
    });

    it('shows no credentials message when none exist', () => {
      mocks.getCredentialSyncStatus.mockReturnValue({ hasCreds: false, count: 0 });
      const html = renderSettingsTab();
      expect(html).toContain('No credentials to sync');
    });

    it('shows credential count when credentials exist', () => {
      mocks.getCredentialSyncStatus.mockReturnValue({ hasCreds: true, count: 3 });
      const html = renderSettingsTab();
      expect(html).toContain('3 credentials synced');
    });

    it('does not render user section when currentUser is null', () => {
      mocks.state.currentUser = null;
      const html = renderSettingsTab();
      expect(html).not.toContain('Sign Out');
    });

    it('renders WHOOP connected state with disconnect button', () => {
      mocks.isWhoopConnected.mockReturnValue(true);
      mocks.getWhoopWorkerUrl.mockReturnValue('https://worker.test');
      mocks.getWhoopApiKey.mockReturnValue('secret');
      const html = renderSettingsTab();
      expect(html).toContain('Disconnect');
      expect(html).toContain('syncWhoopNow');
    });

    it('renders WHOOP disconnected state with connect button', () => {
      mocks.isWhoopConnected.mockReturnValue(false);
      const html = renderSettingsTab();
      expect(html).toContain('connectWhoop');
    });

    it('renders Libre connected state', () => {
      mocks.isLibreConnected.mockReturnValue(true);
      mocks.getLibreWorkerUrl.mockReturnValue('https://libre.test');
      mocks.getLibreApiKey.mockReturnValue('secret');
      const html = renderSettingsTab();
      expect(html).toContain('Freestyle Libre');
      expect(html).toContain('syncLibreNow');
    });

    it('renders Google Calendar not connected state', () => {
      mocks.isGCalConnected.mockReturnValue(false);
      const html = renderSettingsTab();
      expect(html).toContain('Google Calendar');
      expect(html).toContain('Not connected');
      expect(html).toContain('connectGCal');
    });

    it('renders Google Calendar connected state', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      const html = renderSettingsTab();
      expect(html).toContain('Google Calendar');
      expect(html).toContain('syncGCalNow');
      expect(html).toContain('disconnectGCal');
    });

    it('renders Google Calendar token expired state', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      mocks.state.gcalTokenExpired = true;
      const html = renderSettingsTab();
      expect(html).toContain('Session expired');
      expect(html).toContain('reconnectGCal');
    });

    it('renders Google Calendar loading state', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      mocks.state.gcalCalendarsLoading = true;
      const html = renderSettingsTab();
      expect(html).toContain('Loading calendars...');
    });

    it('renders Google Calendar error state', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      mocks.state.gcalError = 'API error occurred';
      const html = renderSettingsTab();
      expect(html).toContain('API error occurred');
    });

    it('renders calendar list when available', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      mocks.state.gcalCalendarList = [
        { id: 'cal1', summary: 'Work Calendar', backgroundColor: '#3F51B5', accessRole: 'owner' },
        { id: 'cal2', summary: 'Personal', backgroundColor: '#FF5722', accessRole: 'owner' }
      ];
      mocks.getSelectedCalendars.mockReturnValue(['cal1']);
      mocks.getTargetCalendar.mockReturnValue('cal1');
      const html = renderSettingsTab();
      expect(html).toContain('Work Calendar');
      expect(html).toContain('Personal');
      expect(html).toContain('Show events from');
      expect(html).toContain('Push tasks to');
    });

    it('renders AI classification section', () => {
      const html = renderSettingsTab();
      expect(html).toContain('AI Classification');
    });

    it('shows AI configured when key exists', () => {
      mocks.getAnthropicKey.mockReturnValue('sk-ant-test');
      const html = renderSettingsTab();
      expect(html).toContain('Configured');
    });

    it('shows AI not configured when no key', () => {
      mocks.getAnthropicKey.mockReturnValue('');
      const html = renderSettingsTab();
      expect(html).toContain('Not configured');
    });

    it('renders note safety counts correctly', () => {
      mocks.state.tasksData = [
        { id: '1', isNote: true, completed: false, noteLifecycleState: 'active' },
        { id: '2', isNote: true, completed: false, noteLifecycleState: 'deleted' },
        { id: '3', isNote: true, completed: true, noteLifecycleState: 'active' },
        { id: '4', isNote: false, completed: false },
      ];
      const html = renderSettingsTab();
      expect(html).toContain('1 active');
      expect(html).toContain('1 deleted');
      expect(html).toContain('1 done');
    });

    it('renders conflict notifications count', () => {
      mocks.state.conflictNotifications = [
        { id: 'c1', entity: 'task', mode: 'newest-wins', reason: 'test' }
      ];
      const html = renderSettingsTab();
      expect(html).toContain('1 items');
    });

    it('renders performance section with current perf stats', () => {
      mocks.state.renderPerf = { lastMs: 12.5, avgMs: 10.2, maxMs: 25.0, count: 50 };
      const html = renderSettingsTab();
      expect(html).toContain('12.5');
      expect(html).toContain('10.2');
      expect(html).toContain('25');
      expect(html).toContain('50');
    });

    it('renders color mode buttons', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Light');
      expect(html).toContain('Dark');
      expect(html).toContain("setColorMode('light')");
      expect(html).toContain("setColorMode('dark')");
    });

    it('renders contacts sync section when calendar is connected with calendars', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      mocks.state.gcalCalendarList = [
        { id: 'cal1', summary: 'Cal', backgroundColor: '#fff', accessRole: 'owner' }
      ];
      mocks.getSelectedCalendars.mockReturnValue([]);
      const html = renderSettingsTab();
      expect(html).toContain('Contacts sync');
      expect(html).toContain('Sync Contacts');
    });

    it('renders contacts syncing state', () => {
      mocks.isGCalConnected.mockReturnValue(true);
      mocks.state.gcontactsSyncing = true;
      mocks.state.gcalCalendarList = [
        { id: 'cal1', summary: 'Cal', backgroundColor: '#fff', accessRole: 'owner' }
      ];
      mocks.getSelectedCalendars.mockReturnValue([]);
      const html = renderSettingsTab();
      expect(html).toContain('Syncing...');
    });

    it('renders single credential correctly', () => {
      mocks.getCredentialSyncStatus.mockReturnValue({ hasCreds: true, count: 1 });
      const html = renderSettingsTab();
      expect(html).toContain('1 credential synced');
      // singular, no 's'
      expect(html).not.toContain('1 credentials synced');
    });

    it('renders Force Push and Force Pull buttons in sync health', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Force Push');
      expect(html).toContain('Force Pull');
    });

    it('renders Sync Now button when github token exists', () => {
      mocks.getGithubToken.mockReturnValue('ghp_test');
      const html = renderSettingsTab();
      expect(html).toContain('Sync Now');
    });

    it('disables Sync Now when no github token', () => {
      mocks.getGithubToken.mockReturnValue('');
      const html = renderSettingsTab();
      expect(html).toContain('disabled');
    });

    it('renders Pull from Cloud button', () => {
      const html = renderSettingsTab();
      expect(html).toContain('Pull from Cloud');
    });
  });
});
