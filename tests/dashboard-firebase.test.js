// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// vi.hoisted -- all mock variables must live here so vi.mock factories can use them
// ---------------------------------------------------------------------------
const mocks = vi.hoisted(() => {
  // ---- State mock ----
  const state = {
    allData: {},
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    homeWidgets: [],
    activeTab: 'home',
    activeSubTab: '',
    activeFilterType: 'inbox',
    activePerspective: 'inbox',
    currentDate: '2025-01-15',
    currentUser: { uid: 'u1', displayName: 'Test', email: 'test@test.com', photoURL: null },
    authLoading: false,
    authError: null,
    xp: { total: 1500, history: [] },
    streak: { current: 7 },
    achievements: { unlocked: {} },
    breakdownChart: null,
    renderPerf: { count: 0, totalMs: 0, peakMs: 0 },
    WEIGHTS: {},
    MAX_SCORES: {},
    syncHealth: { recentEvents: [] },
    _lastRenderWasMobile: false,
  };

  // ---- Scoring mocks ----
  const getLast30DaysData = vi.fn(() => []);
  const getLast30DaysStats = vi.fn(() => ({
    daysLogged: 0, avgDaily: 0, totalFamilyCheckins: 0, totalOnTimePrayers: 0, totalScore: 0,
  }));
  const getPersonalBests = vi.fn(() => null);
  const calculateScores = vi.fn(() => ({ normalized: { overall: 0 } }));
  const getLevelInfo = vi.fn(() => ({
    level: 5, currentLevelXP: 1000, nextLevelXP: 2000, progress: 0.5,
    tierName: 'Ember', tierIcon: '...',
  }));
  const getScoreTier = vi.fn(() => ({
    min: 0, max: 0.39, color: '#EF4444', label: 'Needs Work',
  }));

  // ---- github-sync mocks ----
  const getAccentColor = vi.fn(() => '#4A90A4');

  // ---- Chart.js mock ----
  const ChartInstance = { destroy: vi.fn() };
  // Must be a function that works with `new`
  function Chart() { return ChartInstance; }
  Chart._instance = ChartInstance;

  // ---- Firebase mocks ----
  const firebaseApp = { name: '[DEFAULT]' };
  const initializeApp = vi.fn(() => firebaseApp);
  const mockAuth = { currentUser: null };
  const getAuth = vi.fn(() => mockAuth);
  const signInWithCredential = vi.fn(() => Promise.resolve({ user: { uid: 'u1' } }));
  const googleProviderCredential = vi.fn((idToken) => ({ idToken, providerId: 'google.com' }));
  const signOut = vi.fn(() => Promise.resolve());
  const onAuthStateChanged = vi.fn((auth, cb) => {
    // do not fire automatically so tests can control it
    return vi.fn(); // unsubscribe
  });

  // ---- Utils mocks ----
  const fmt = vi.fn((v) => {
    if (v === null || v === undefined || v === '') return '\u2014';
    const n = typeof v === 'string' ? parseFloat(v) : v;
    if (isNaN(n)) return '\u2014';
    return n.toLocaleString('en-US');
  });
  const getLocalDateString = vi.fn(() => '2025-01-15');

  return {
    state,
    getLast30DaysData,
    getLast30DaysStats,
    getPersonalBests,
    calculateScores,
    getLevelInfo,
    getScoreTier,
    getAccentColor,
    Chart,
    ChartInstance,
    initializeApp,
    firebaseApp,
    mockAuth,
    getAuth,
    signInWithCredential,
    googleProviderCredential,
    signOut,
    onAuthStateChanged,
    fmt,
    getLocalDateString,
  };
});

// ---------------------------------------------------------------------------
// vi.mock — module replacements
// ---------------------------------------------------------------------------
vi.mock('../src/state.js', () => ({ state: mocks.state }));

vi.mock('../src/utils.js', () => ({
  fmt: mocks.fmt,
  getLocalDateString: mocks.getLocalDateString,
}));

vi.mock('../src/features/scoring.js', () => ({
  getLast30DaysData: mocks.getLast30DaysData,
  getLast30DaysStats: mocks.getLast30DaysStats,
  getPersonalBests: mocks.getPersonalBests,
  calculateScores: mocks.calculateScores,
  getLevelInfo: mocks.getLevelInfo,
  getScoreTier: mocks.getScoreTier,
}));

vi.mock('../src/data/github-sync.js', () => ({
  getAccentColor: mocks.getAccentColor,
}));

vi.mock('chart.js/auto', () => ({
  default: mocks.Chart,
}));

// Real constants from the actual source — needed for dashboard logic
vi.mock('../src/constants.js', () => {
  const SCORE_TIERS = [
    { min: 0,    max: 0.39, color: '#EF4444', label: 'Needs Work',    bg: 'bg-[var(--danger)]' },
    { min: 0.40, max: 0.59, color: '#F59E0B', label: 'Getting There', bg: 'bg-[var(--warning)]' },
    { min: 0.60, max: 0.79, color: '#F59E0B', label: 'Solid',         bg: 'bg-[var(--warning)]' },
    { min: 0.80, max: 0.89, color: '#22C55E', label: 'Great',         bg: 'bg-[var(--success)]' },
    { min: 0.90, max: 1.0,  color: '#22C55E', label: 'Outstanding',   bg: 'bg-[var(--success)]' },
  ];
  const ACHIEVEMENTS = [
    { id: 'first-steps', name: 'First Steps', desc: '3-day streak', icon: '\uD83C\uDF31', category: 'streak', check: (ctx) => ctx.streak >= 3 },
    { id: 'weekly-warrior', name: 'Weekly Warrior', desc: '7-day streak', icon: '\u2694\uFE0F', category: 'streak', check: (ctx) => ctx.streak >= 7 },
    { id: 'fortnight-focus', name: 'Fortnight Focus', desc: '14-day streak', icon: '\uD83C\uDFAF', category: 'streak', check: (ctx) => ctx.streak >= 14 },
    { id: 'monthly-master', name: 'Monthly Master', desc: '30-day streak', icon: '\uD83D\uDC51', category: 'streak', check: (ctx) => ctx.streak >= 30 },
    { id: 'quarterly-quest', name: 'Quarterly Quest', desc: '90-day streak', icon: '\uD83C\uDFD4\uFE0F', category: 'streak', check: (ctx) => ctx.streak >= 90 },
    { id: 'year-of-discipline', name: 'Year of Discipline', desc: '365-day streak', icon: '\uD83C\uDFC6', category: 'streak', check: (ctx) => ctx.streak >= 365 },
    { id: 'perfect-prayer', name: 'Perfect Prayer', desc: 'All 5 prayers on time', icon: '\uD83D\uDD4C', category: 'mastery', check: (ctx) => ctx.prayerOnTime >= 5 },
    { id: 'prayer-streak-7', name: 'Prayer Streak', desc: '7 consecutive perfect prayer days', icon: '\uD83D\uDCFF', category: 'mastery', check: (ctx) => ctx.perfectPrayerStreak >= 7 },
    { id: 'green-day', name: 'Green Day', desc: 'Overall score >= 90%', icon: '\uD83D\uDC9A', category: 'mastery', check: (ctx) => ctx.overallPercent >= 0.90 },
    { id: 'balanced-day', name: 'Balanced Day', desc: 'All 5 categories >= 60%', icon: '\u2696\uFE0F', category: 'mastery', check: (ctx) => ctx.allCategoriesAbove60 },
    { id: 'family-first', name: 'Family First', desc: '30 cumulative family check-in days', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66', category: 'mastery', check: (ctx) => ctx.totalFamilyDays >= 30 },
    { id: 'day-one', name: 'Day One', desc: 'First day logged', icon: '\uD83D\uDE80', category: 'milestone', check: (ctx) => ctx.totalDaysLogged >= 1 },
    { id: 'century', name: 'Century', desc: '100 days logged', icon: '\uD83D\uDCAF', category: 'milestone', check: (ctx) => ctx.totalDaysLogged >= 100 },
    { id: 'quran-scholar', name: 'Quran Scholar', desc: '50 cumulative Quran pages', icon: '\uD83D\uDCD6', category: 'milestone', check: (ctx) => ctx.totalQuranPages >= 50 },
    { id: 'level-10', name: 'Level 10', desc: 'Reach Level 10', icon: '\uD83D\uDD1F', category: 'milestone', check: (ctx) => ctx.level >= 10 },
    { id: 'level-20', name: 'Level 20', desc: 'Reach Level 20', icon: '2\uFE0F\u20E30\uFE0F\u20E3', category: 'milestone', check: (ctx) => ctx.level >= 20 },
    { id: 'level-30', name: 'Level 30', desc: 'Reach Level 30', icon: '3\uFE0F\u20E30\uFE0F\u20E3', category: 'milestone', check: (ctx) => ctx.level >= 30 },
  ];
  const LEVEL_TIERS = [
    { min: 1, max: 4, name: 'Spark', icon: '\u2728' },
    { min: 5, max: 9, name: 'Ember', icon: '\uD83D\uDD25' },
    { min: 10, max: 14, name: 'Flame', icon: '\uD83D\uDD25' },
    { min: 15, max: 19, name: 'Blaze', icon: '\uD83D\uDD25' },
    { min: 20, max: 24, name: 'Inferno', icon: '\uD83D\uDD25' },
    { min: 25, max: 999, name: 'Phoenix', icon: '\uD83D\uDD25' },
  ];
  const STREAK_MULTIPLIERS = [
    { min: 1, max: 1, multiplier: 1.0 },
    { min: 2, max: 3, multiplier: 1.1 },
    { min: 4, max: 6, multiplier: 1.2 },
    { min: 7, max: 13, multiplier: 1.3 },
    { min: 14, max: 29, multiplier: 1.4 },
    { min: 30, max: Infinity, multiplier: 1.5 },
  ];
  const STREAK_MIN_THRESHOLD = 0.20;
  const DEFAULT_CATEGORY_WEIGHTS = {
    prayer: 20, diabetes: 20, whoop: 20, family: 20, habits: 20,
  };
  const defaultDayData = {
    prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
    glucose: { avg: '', tir: '', insulin: '' },
    whoop: { sleepPerf: '', recovery: '', strain: '', whoopAge: '' },
    libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
    family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
    habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' },
  };
  const GCAL_ACCESS_TOKEN_KEY = 'nucleusGCalAccessToken';
  const GCAL_TOKEN_TIMESTAMP_KEY = 'nucleusGCalTokenTimestamp';
  const GCAL_CONNECTED_KEY = 'nucleusGCalConnected';
  return {
    SCORE_TIERS,
    ACHIEVEMENTS,
    LEVEL_TIERS,
    STREAK_MULTIPLIERS,
    STREAK_MIN_THRESHOLD,
    DEFAULT_CATEGORY_WEIGHTS,
    defaultDayData,
    GCAL_ACCESS_TOKEN_KEY,
    GCAL_TOKEN_TIMESTAMP_KEY,
    GCAL_CONNECTED_KEY,
  };
});

// Firebase SDK mocks
vi.mock('firebase/app', () => ({
  initializeApp: mocks.initializeApp,
}));
vi.mock('firebase/auth', () => ({
  getAuth: mocks.getAuth,
  signInWithCredential: mocks.signInWithCredential,
  GoogleAuthProvider: { credential: mocks.googleProviderCredential },
  signOut: mocks.signOut,
  onAuthStateChanged: mocks.onAuthStateChanged,
}));

// ---------------------------------------------------------------------------
// Imports under test (AFTER mocks are registered)
// ---------------------------------------------------------------------------
import { renderDashboardTab } from '../src/ui/dashboard.js';

// firebase.js has module-level side effects (initializeApp + getAuth), so we
// import it lazily inside tests to control the mock setup.  We will use a
// helper that dynamically imports and resets as needed.

// ============================================================================
// DASHBOARD TESTS
// ============================================================================
describe('Dashboard — renderDashboardTab & helpers', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset state to defaults
    mocks.state.allData = {};
    mocks.state.xp = { total: 1500, history: [] };
    mocks.state.streak = { current: 7 };
    mocks.state.achievements = { unlocked: {} };
    mocks.state.breakdownChart = null;

    // Reset scoring mock defaults
    mocks.getLevelInfo.mockReturnValue({
      level: 5, currentLevelXP: 1000, nextLevelXP: 2000, progress: 0.5,
      tierName: 'Ember', tierIcon: '\uD83D\uDD25',
    });
    mocks.getLast30DaysStats.mockReturnValue({
      daysLogged: 0, avgDaily: 0, totalFamilyCheckins: 0, totalOnTimePrayers: 0, totalScore: 0,
    });
    mocks.getLast30DaysData.mockReturnValue([]);
    mocks.getPersonalBests.mockReturnValue(null);
    mocks.calculateScores.mockReturnValue({ normalized: { overall: 0 } });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --------------------------------------------------------------------------
  // getTierColor (internal, tested via renderHeatmap output)
  // --------------------------------------------------------------------------
  describe('getTierColor (via heatmap)', () => {

    function makeDay(date, overall) {
      return { date, label: date };
    }

    it('returns Needs Work color for score 0', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      // Score 0 => #EF4444 (Needs Work)
      expect(html).toContain('#EF4444');
    });

    it('returns Needs Work color for score 0.20', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.20 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#EF4444');
    });

    it('returns Getting There color for score 0.40', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.40 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#F59E0B');
    });

    it('returns Getting There color for score 0.55', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.55 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#F59E0B');
    });

    it('returns Solid color for score 0.60', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.60 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#F59E0B');
      expect(html).toContain('60%');
    });

    it('returns Great color for score 0.85', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.85 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#22C55E');
    });

    it('returns Outstanding color for score 0.95', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.95 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#22C55E');
      expect(html).toContain('95%');
    });

    it('returns Outstanding color for score 1.0 (perfect)', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 1.0 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#22C55E');
      expect(html).toContain('100%');
    });

    it('returns first tier color for score at boundary 0.39', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.39 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#EF4444');
    });

    it('handles boundary at 0.80 (Great tier)', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.80 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#22C55E');
      expect(html).toContain('80%');
    });

    it('handles boundary at 0.90 (Outstanding tier)', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.90 } });
      mocks.getLast30DaysData.mockReturnValue([{ date: '2025-01-01', label: 'Jan 1' }]);
      const html = renderDashboardTab();
      expect(html).toContain('#22C55E');
      expect(html).toContain('90%');
    });
  });

  // --------------------------------------------------------------------------
  // renderHeatmap (internal, tested via renderDashboardTab output)
  // --------------------------------------------------------------------------
  describe('renderHeatmap', () => {

    it('renders "No data" cells when no allData exists', () => {
      mocks.getLast30DaysData.mockReturnValue([
        { date: '2025-01-01', label: 'Jan 1' },
        { date: '2025-01-02', label: 'Jan 2' },
      ]);
      mocks.state.allData = {};
      const html = renderDashboardTab();
      expect(html).toContain('No data');
      expect(html).toContain('heatmap-grid');
    });

    it('renders colored cells for days with data', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.7 } });
      mocks.getLast30DaysData.mockReturnValue([
        { date: '2025-01-01', label: 'Jan 1' },
      ]);
      const html = renderDashboardTab();
      expect(html).toContain('70%');
      // Should contain the tier color for 0.7 (Solid = #F59E0B)
      expect(html).toContain('#F59E0B');
    });

    it('renders full 30 cells for complete data', () => {
      const days = [];
      const allData = {};
      for (let i = 0; i < 30; i++) {
        const d = `2025-01-${String(i + 1).padStart(2, '0')}`;
        days.push({ date: d, label: `Jan ${i + 1}` });
        allData[d] = { dummy: true };
      }
      mocks.getLast30DaysData.mockReturnValue(days);
      mocks.state.allData = allData;
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.5 } });

      const html = renderDashboardTab();
      const cellCount = (html.match(/heatmap-cell/g) || []).length;
      expect(cellCount).toBe(30);
    });

    it('renders partial data (some days missing)', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0.6 } });
      mocks.getLast30DaysData.mockReturnValue([
        { date: '2025-01-01', label: 'Jan 1' },
        { date: '2025-01-02', label: 'Jan 2' },
        { date: '2025-01-03', label: 'Jan 3' },
      ]);
      const html = renderDashboardTab();
      // 1 data cell + 2 no-data cells = 3 heatmap cells
      const cellCount = (html.match(/heatmap-cell/g) || []).length;
      expect(cellCount).toBe(3);
    });

    it('renders heatmap legend with all tier colors', () => {
      mocks.getLast30DaysData.mockReturnValue([]);
      const html = renderDashboardTab();
      expect(html).toContain('Less');
      expect(html).toContain('More');
      // All 5 tiers in legend
      expect(html).toContain('Needs Work');
      expect(html).toContain('Getting There');
      expect(html).toContain('Solid');
      expect(html).toContain('Great');
      expect(html).toContain('Outstanding');
    });

    it('computes opacity from score (opacity = 0.3 + pct * 0.7)', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 1.0 } });
      mocks.getLast30DaysData.mockReturnValue([
        { date: '2025-01-01', label: 'Jan 1' },
      ]);
      const html = renderDashboardTab();
      // opacity = 0.3 + 1.0 * 0.7 = 1
      expect(html).toContain('opacity: 1');
    });

    it('computes low opacity for zero score', () => {
      mocks.state.allData = { '2025-01-01': { dummy: true } };
      mocks.calculateScores.mockReturnValue({ normalized: { overall: 0 } });
      mocks.getLast30DaysData.mockReturnValue([
        { date: '2025-01-01', label: 'Jan 1' },
      ]);
      const html = renderDashboardTab();
      // opacity = 0.3 + 0 * 0.7 = 0.3
      expect(html).toContain('opacity: 0.3');
    });
  });

  // --------------------------------------------------------------------------
  // renderAchievementsGallery (internal, tested via renderDashboardTab)
  // --------------------------------------------------------------------------
  describe('renderAchievementsGallery', () => {

    it('renders all achievements as locked when none unlocked', () => {
      mocks.state.achievements = { unlocked: {} };
      const html = renderDashboardTab();
      expect(html).toContain('Streaks');
      expect(html).toContain('Category Mastery');
      expect(html).toContain('Milestones');
      expect(html).toContain('opacity-50'); // locked cards
      // 0 unlocked
      expect(html).toContain('0/17');
    });

    it('renders unlocked achievement with glow and date', () => {
      mocks.state.achievements = {
        unlocked: {
          'first-steps': { date: '2025-01-10T00:00:00Z' },
        },
      };
      const html = renderDashboardTab();
      expect(html).toContain('First Steps');
      expect(html).toContain('1/17');
      // The unlocked card has border-[color-mix...] styling
      expect(html).toContain('color-mix');
      // Date formatted
      expect(html).toContain('Jan');
    });

    it('renders some unlocked, rest locked', () => {
      mocks.state.achievements = {
        unlocked: {
          'first-steps': { date: '2025-01-10T00:00:00Z' },
          'weekly-warrior': { date: '2025-01-17T00:00:00Z' },
          'day-one': { date: '2025-01-01T00:00:00Z' },
        },
      };
      const html = renderDashboardTab();
      expect(html).toContain('3/17');
    });

    it('renders all achievements as unlocked', () => {
      const unlocked = {};
      const ids = [
        'first-steps','weekly-warrior','fortnight-focus','monthly-master',
        'quarterly-quest','year-of-discipline','perfect-prayer','prayer-streak-7',
        'green-day','balanced-day','family-first','day-one','century',
        'quran-scholar','level-10','level-20','level-30',
      ];
      ids.forEach(id => { unlocked[id] = { date: '2025-06-01T00:00:00Z' }; });
      mocks.state.achievements = { unlocked };
      const html = renderDashboardTab();
      expect(html).toContain('17/17');
      // No locked cards (opacity-50 should not appear for achievement cards)
      // Actually some other elements may have opacity-50, so just check count
      expect(html).not.toContain('opacity-50');
    });

    it('groups achievements by category: streak, mastery, milestone', () => {
      const html = renderDashboardTab();
      const streakIdx = html.indexOf('Streaks');
      const masteryIdx = html.indexOf('Category Mastery');
      const milestoneIdx = html.indexOf('Milestones');
      expect(streakIdx).toBeGreaterThan(-1);
      expect(masteryIdx).toBeGreaterThan(streakIdx);
      expect(milestoneIdx).toBeGreaterThan(masteryIdx);
    });

    it('shows grayscale class on locked achievement icons', () => {
      mocks.state.achievements = { unlocked: {} };
      const html = renderDashboardTab();
      expect(html).toContain('grayscale');
    });

    it('does not show grayscale on unlocked achievement icons', () => {
      mocks.state.achievements = {
        unlocked: { 'first-steps': { date: '2025-01-10T00:00:00Z' } },
      };
      const html = renderDashboardTab();
      // Find the First Steps card area — it should not have grayscale
      const firstStepsIndex = html.indexOf('First Steps');
      // The span before it should not have grayscale
      const cardHtml = html.substring(Math.max(0, firstStepsIndex - 200), firstStepsIndex);
      expect(cardHtml).not.toContain('grayscale');
    });
  });

  // --------------------------------------------------------------------------
  // renderGuide (internal, tested via renderDashboardTab)
  // --------------------------------------------------------------------------
  describe('renderGuide', () => {

    it('renders the "How It Works" details/summary', () => {
      const html = renderDashboardTab();
      expect(html).toContain('How Life Score Works');
      expect(html).toContain('<details');
      expect(html).toContain('<summary');
    });

    it('renders score tier rows with ranges and labels', () => {
      const html = renderDashboardTab();
      expect(html).toContain('0\u201339%');
      expect(html).toContain('Needs Work');
      expect(html).toContain('40\u201359%');
      expect(html).toContain('Getting There');
      expect(html).toContain('60\u201379%');
      expect(html).toContain('Solid');
      expect(html).toContain('80\u201389%');
      expect(html).toContain('Great');
      expect(html).toContain('90\u2013100%');
      expect(html).toContain('Outstanding');
    });

    it('renders level tier rows', () => {
      const html = renderDashboardTab();
      expect(html).toContain('Spark');
      expect(html).toContain('Ember');
      expect(html).toContain('Flame');
      expect(html).toContain('Blaze');
      expect(html).toContain('Inferno');
      expect(html).toContain('Phoenix');
      expect(html).toContain('Level 1');
      expect(html).toContain('Level 25+');
    });

    it('renders streak multiplier rows', () => {
      const html = renderDashboardTab();
      expect(html).toContain('1x XP');
      expect(html).toContain('1.1x XP');
      expect(html).toContain('1.2x XP');
      expect(html).toContain('1.3x XP');
      expect(html).toContain('1.4x XP');
      expect(html).toContain('1.5x XP');
    });

    it('displays STREAK_MIN_THRESHOLD as percentage', () => {
      const html = renderDashboardTab();
      // STREAK_MIN_THRESHOLD = 0.20 -> 20%
      expect(html).toContain('20%');
    });

    it('mentions total achievement count', () => {
      const html = renderDashboardTab();
      expect(html).toContain('17 badges');
    });

    it('contains all guide section headings', () => {
      const html = renderDashboardTab();
      expect(html).toContain('Scoring');
      expect(html).toContain('XP & Levels');
      expect(html).toContain('Achievements');
      expect(html).toContain('Daily Focus');
      expect(html).toContain('Heatmap & Trends');
    });
  });

  // --------------------------------------------------------------------------
  // renderDashboardTab full output
  // --------------------------------------------------------------------------
  describe('renderDashboardTab full output', () => {

    it('renders level banner with level number', () => {
      mocks.getLevelInfo.mockReturnValue({
        level: 12, currentLevelXP: 5900, nextLevelXP: 7000, progress: 0.3,
        tierName: 'Flame', tierIcon: '\uD83D\uDD25',
      });
      const html = renderDashboardTab();
      expect(html).toContain('Level 12');
      expect(html).toContain('Flame');
    });

    it('renders streak display with fire emoji when streak > 0', () => {
      mocks.state.streak = { current: 14 };
      const html = renderDashboardTab();
      expect(html).toContain('\uD83D\uDD25');
      expect(html).toContain('14');
      expect(html).toContain('Day Streak');
    });

    it('renders streak without fire emoji when streak is 0', () => {
      mocks.state.streak = { current: 0 };
      const html = renderDashboardTab();
      expect(html).toContain('Day Streak');
      expect(html).toContain('text-[var(--text-muted)]');
    });

    it('renders XP progress bar with correct percentage', () => {
      mocks.state.xp = { total: 1500, history: [] };
      mocks.getLevelInfo.mockReturnValue({
        level: 5, currentLevelXP: 1000, nextLevelXP: 2000, progress: 0.5,
        tierName: 'Ember', tierIcon: '\uD83D\uDD25',
      });
      const html = renderDashboardTab();
      expect(html).toContain('1,500');
      expect(html).toContain('2,000');
      expect(html).toContain('width: 50%');
    });

    it('renders XP progress bar at 0%', () => {
      mocks.state.xp = { total: 0, history: [] };
      mocks.getLevelInfo.mockReturnValue({
        level: 1, currentLevelXP: 0, nextLevelXP: 100, progress: 0,
        tierName: 'Spark', tierIcon: '\u2728',
      });
      const html = renderDashboardTab();
      expect(html).toContain('width: 0%');
    });

    it('renders 30-day stats section', () => {
      mocks.getLast30DaysStats.mockReturnValue({
        daysLogged: 15, avgDaily: 42.5, totalFamilyCheckins: 8, totalOnTimePrayers: 60,
      });
      const html = renderDashboardTab();
      expect(html).toContain('Days Logged');
      expect(html).toContain('15/30');
      expect(html).toContain('Avg Daily');
      expect(html).toContain('Family Check-ins');
      expect(html).toContain('On-Time Prayers');
    });

    it('renders category trends canvas', () => {
      const html = renderDashboardTab();
      expect(html).toContain('Category Trends');
      expect(html).toContain('breakdownChart');
      expect(html).toContain('<canvas');
    });

    it('renders personal bests section when data exists', () => {
      mocks.getPersonalBests.mockReturnValue({
        highestDayScore: { value: 85, date: '2025-01-10' },
        highestWeekScore: { value: 500, weekStart: '2025-01-06' },
        longestStreak: { value: 14 },
        perfectPrayerDays: 10,
        totalDaysLogged: 30,
      });
      const html = renderDashboardTab();
      expect(html).toContain('Personal Bests');
      expect(html).toContain('Best Day Score');
      expect(html).toContain('Best Week Score');
      expect(html).toContain('Longest Streak');
      expect(html).toContain('Perfect Prayer Days');
    });

    it('renders "Start Your Journey" when no personal bests', () => {
      mocks.getPersonalBests.mockReturnValue(null);
      const html = renderDashboardTab();
      expect(html).toContain('Start Your Journey');
      expect(html).toContain('Log your first day');
    });

    it('renders personal bests longest streak "days in a row" text', () => {
      mocks.getPersonalBests.mockReturnValue({
        highestDayScore: { value: 50, date: null },
        highestWeekScore: { value: 200, weekStart: null },
        longestStreak: { value: 7 },
        perfectPrayerDays: 0,
        totalDaysLogged: 5,
      });
      const html = renderDashboardTab();
      expect(html).toContain('days in a row');
    });

    it('renders em-dash for longest streak of 0', () => {
      mocks.getPersonalBests.mockReturnValue({
        highestDayScore: { value: 0, date: null },
        highestWeekScore: { value: 0, weekStart: null },
        longestStreak: { value: 0 },
        perfectPrayerDays: 0,
        totalDaysLogged: 1,
      });
      const html = renderDashboardTab();
      expect(html).toContain('\u2014');
    });

    it('renders personal bests prayer rate percentage', () => {
      mocks.getPersonalBests.mockReturnValue({
        highestDayScore: { value: 50, date: '2025-01-10' },
        highestWeekScore: { value: 200, weekStart: '2025-01-06' },
        longestStreak: { value: 5 },
        perfectPrayerDays: 10,
        totalDaysLogged: 20,
      });
      const html = renderDashboardTab();
      // 10/20 * 100 = 50% rate
      expect(html).toContain('50% rate');
    });

    it('renders heatmap section with "Last 30 Days" heading', () => {
      const html = renderDashboardTab();
      expect(html).toContain('Last 30 Days');
      expect(html).toContain('heatmap-grid');
    });

    it('renders achievements section heading with count', () => {
      mocks.state.achievements = { unlocked: { 'day-one': { date: '2025-01-01' } } };
      const html = renderDashboardTab();
      expect(html).toContain('Achievements');
      expect(html).toContain('1/17');
    });

    it('renders guide section at bottom', () => {
      const html = renderDashboardTab();
      expect(html).toContain('How Life Score Works');
    });

    it('calls getLevelInfo with total XP', () => {
      mocks.state.xp = { total: 3000 };
      renderDashboardTab();
      expect(mocks.getLevelInfo).toHaveBeenCalledWith(3000);
    });

    it('uses 0 for xp.total when xp is undefined', () => {
      mocks.state.xp = undefined;
      renderDashboardTab();
      expect(mocks.getLevelInfo).toHaveBeenCalledWith(0);
    });

    it('uses 0 for streak.current when streak is undefined', () => {
      mocks.state.streak = undefined;
      const html = renderDashboardTab();
      expect(html).toContain('text-[var(--text-muted)]');
    });

    it('schedules Chart.js creation via setTimeout', () => {
      mocks.getLast30DaysData.mockReturnValue([
        { date: '2025-01-01', label: 'Jan 1' },
      ]);
      renderDashboardTab();
      // setTimeout was called (for Chart.js creation)
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    });

    it('destroys existing breakdownChart before creating new one', () => {
      const mockDestroy = vi.fn();
      mocks.state.breakdownChart = { destroy: mockDestroy };

      // Create a mock canvas element
      const canvas = document.createElement('canvas');
      canvas.id = 'breakdownChart';
      document.body.appendChild(canvas);

      mocks.getLast30DaysData.mockReturnValue([]);
      renderDashboardTab();

      vi.runAllTimers();
      expect(mockDestroy).toHaveBeenCalled();

      document.body.removeChild(canvas);
    });
  });
});

// ============================================================================
// FIREBASE TESTS
// ============================================================================
describe('Firebase — firebase.js', () => {

  let firebase;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Reset state
    mocks.state.currentUser = null;
    mocks.state.authLoading = true;
    mocks.state.authError = null;

    // Reset auth mock
    mocks.mockAuth.currentUser = null;

    // Clear storage
    sessionStorage.clear();
    localStorage.clear();

    // Mock window functions
    window.render = vi.fn();
    window.stopWhoopSyncTimers = vi.fn();
    window.stopGCalSyncTimers = vi.fn();

    // Re-import firebase module fresh for each test
    vi.resetModules();

    // Re-register mocks before importing
    vi.doMock('../src/state.js', () => ({ state: mocks.state }));
    vi.doMock('../src/constants.js', () => ({
      GCAL_ACCESS_TOKEN_KEY: 'nucleusGCalAccessToken',
      GCAL_TOKEN_TIMESTAMP_KEY: 'nucleusGCalTokenTimestamp',
      GCAL_CONNECTED_KEY: 'nucleusGCalConnected',
    }));
    vi.doMock('firebase/app', () => ({
      initializeApp: mocks.initializeApp,
    }));
    vi.doMock('firebase/auth', () => ({
      getAuth: mocks.getAuth,
      signInWithCredential: mocks.signInWithCredential,
      GoogleAuthProvider: { credential: mocks.googleProviderCredential },
      signOut: mocks.signOut,
      onAuthStateChanged: mocks.onAuthStateChanged,
    }));

    // Intercept script creation so GIS script loads fail immediately in jsdom
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag, options) => {
      const el = origCreateElement(tag, options);
      if (tag === 'script') {
        // When src is set to the GIS URL, fire onerror async
        const origSrcSet = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src')?.set;
        let srcVal = '';
        Object.defineProperty(el, 'src', {
          get: () => srcVal,
          set: (v) => {
            srcVal = v;
            if (v && v.includes('accounts.google.com/gsi/client')) {
              setTimeout(() => { if (el.onerror) el.onerror(new Error('mock load fail')); }, 0);
            }
          },
          configurable: true,
        });
      }
      return el;
    });

    firebase = await import('../src/data/firebase.js');
  });

  afterEach(() => {
    delete window.render;
    delete window.stopWhoopSyncTimers;
    delete window.stopGCalSyncTimers;
    delete window.google;
    vi.restoreAllMocks();
    // Clean up any GIS script tags
    document.querySelectorAll('script[data-gis-client]').forEach(s => s.remove());
  });

  // --------------------------------------------------------------------------
  // Module initialization
  // --------------------------------------------------------------------------
  describe('module initialization', () => {
    it('calls initializeApp with firebase config', () => {
      expect(mocks.initializeApp).toHaveBeenCalled();
    });

    it('calls getAuth with the app', () => {
      expect(mocks.getAuth).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // signInWithGoogle
  // --------------------------------------------------------------------------
  describe('signInWithGoogle', () => {

    it('sets oauth_nonce in sessionStorage', () => {
      // Mock crypto.getRandomValues
      const origGetRandomValues = crypto.getRandomValues;
      crypto.getRandomValues = vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) arr[i] = i;
        return arr;
      });

      firebase.signInWithGoogle();
      const nonce = sessionStorage.getItem('oauth_nonce');
      expect(nonce).toBeTruthy();
      expect(nonce.length).toBe(64); // 32 bytes * 2 hex chars

      crypto.getRandomValues = origGetRandomValues;
    });

    it('navigates to Google OAuth URL', () => {
      const originalHref = window.location.href;

      // We cannot directly test window.location.href assignment in jsdom,
      // but we can verify sessionStorage was set
      firebase.signInWithGoogle();
      expect(sessionStorage.getItem('oauth_nonce')).toBeTruthy();
    });

    it('includes correct OAuth parameters', () => {
      // Override location.href setter to capture the URL
      let capturedUrl = '';
      const hrefDesc = Object.getOwnPropertyDescriptor(window.location, 'href') ||
        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window.location), 'href');

      // jsdom allows setting location.href but doesn't navigate
      const origAssign = window.location.assign;
      delete window.location;
      window.location = {
        href: 'http://localhost:3000/lifeg/',
        hash: '',
        pathname: '/lifeg/',
        search: '',
        assign: vi.fn((url) => { capturedUrl = url; }),
      };

      Object.defineProperty(window.location, 'href', {
        get: () => capturedUrl || 'http://localhost:3000/lifeg/',
        set: (v) => { capturedUrl = v; },
        configurable: true,
      });

      firebase.signInWithGoogle();

      expect(capturedUrl).toContain('accounts.google.com');
      expect(capturedUrl).toContain('response_type=id_token+token');
      expect(capturedUrl).toContain('scope=openid+email+profile');
      expect(capturedUrl).toContain('prompt=select_account');

      // Restore
      delete window.location;
      window.location = new URL('http://localhost:3000/lifeg/');
    });
  });

  // --------------------------------------------------------------------------
  // signOutUser
  // --------------------------------------------------------------------------
  describe('signOutUser', () => {

    it('calls signOut on firebase auth', () => {
      firebase.signOutUser();
      expect(mocks.signOut).toHaveBeenCalled();
    });

    it('calls stopWhoopSyncTimers', () => {
      firebase.signOutUser();
      expect(window.stopWhoopSyncTimers).toHaveBeenCalled();
    });

    it('calls stopGCalSyncTimers', () => {
      firebase.signOutUser();
      expect(window.stopGCalSyncTimers).toHaveBeenCalled();
    });

    it('handles missing stopWhoopSyncTimers gracefully', () => {
      delete window.stopWhoopSyncTimers;
      expect(() => firebase.signOutUser()).not.toThrow();
    });

    it('handles missing stopGCalSyncTimers gracefully', () => {
      delete window.stopGCalSyncTimers;
      expect(() => firebase.signOutUser()).not.toThrow();
    });

    it('does not throw if signOut rejects', () => {
      mocks.signOut.mockRejectedValueOnce(new Error('Sign out failed'));
      expect(() => firebase.signOutUser()).not.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // getCurrentUser
  // --------------------------------------------------------------------------
  describe('getCurrentUser', () => {

    it('returns null when no user signed in', () => {
      mocks.mockAuth.currentUser = null;
      expect(firebase.getCurrentUser()).toBeNull();
    });

    it('returns user object when signed in', () => {
      const user = { uid: 'u123', email: 'test@test.com' };
      mocks.mockAuth.currentUser = user;
      expect(firebase.getCurrentUser()).toBe(user);
    });
  });

  // --------------------------------------------------------------------------
  // getLastGisErrorType
  // --------------------------------------------------------------------------
  describe('getLastGisErrorType', () => {

    it('returns empty string initially', () => {
      expect(firebase.getLastGisErrorType()).toBe('');
    });
  });

  // --------------------------------------------------------------------------
  // signInWithGoogleCalendar
  // --------------------------------------------------------------------------
  describe('signInWithGoogleCalendar', () => {

    it('returns null when GIS is not available (silent mode)', async () => {
      // No google.accounts.oauth2 on window
      const result = await firebase.signInWithGoogleCalendar({ mode: 'silent' });
      expect(result).toBeNull();
    });

    it('falls back to OAuth redirect in interactive mode when GIS unavailable', async () => {
      let capturedUrl = '';
      Object.defineProperty(window.location, 'href', {
        get: () => capturedUrl || 'http://localhost:3000/',
        set: (v) => { capturedUrl = v; },
        configurable: true,
      });

      const result = await firebase.signInWithGoogleCalendar({ mode: 'interactive' });
      expect(result).toBeNull();
      // Should set oauth_calendar in sessionStorage
      expect(sessionStorage.getItem('oauth_calendar')).toBe('1');
    });

    it('returns token when GIS provides access_token (interactive)', async () => {
      // Setup GIS mock
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn(() => {
                callback({ access_token: 'gis-token-123', expires_in: 3600 });
              }),
            })),
          },
        },
      };

      const result = await firebase.signInWithGoogleCalendar({ mode: 'interactive' });
      expect(result).toBe('gis-token-123');
      expect(localStorage.getItem('nucleusGCalAccessToken')).toBe('gis-token-123');
      expect(localStorage.getItem('nucleusGCalTokenTimestamp')).toBeTruthy();
    });

    it('stores login_hint when user email is available', async () => {
      mocks.mockAuth.currentUser = { email: 'user@test.com' };
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn(() => {
                callback({ access_token: 'token-abc' });
              }),
            })),
          },
        },
      };

      await firebase.signInWithGoogleCalendar({ mode: 'interactive' });
      expect(localStorage.getItem('nucleusGCalLoginHint')).toBe('user@test.com');
    });

    it('returns null on GIS error in silent mode', async () => {
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ error_callback }) => ({
              requestAccessToken: vi.fn(() => {
                error_callback({ type: 'popup_closed' });
              }),
            })),
          },
        },
      };

      const result = await firebase.signInWithGoogleCalendar({ mode: 'silent' });
      expect(result).toBeNull();
    });

    it('defaults to interactive mode', async () => {
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn((request) => {
                // interactive mode uses prompt: 'consent'
                expect(request.prompt).toBe('consent');
                callback({ access_token: 'interactive-token' });
              }),
            })),
          },
        },
      };

      const result = await firebase.signInWithGoogleCalendar();
      expect(result).toBe('interactive-token');
    });
  });

  // --------------------------------------------------------------------------
  // initAuth
  // --------------------------------------------------------------------------
  describe('initAuth', () => {

    it('registers onAuthStateChanged listener', () => {
      const onReady = vi.fn();
      firebase.initAuth(onReady);
      expect(mocks.onAuthStateChanged).toHaveBeenCalled();
    });

    it('calls onReady with user on first auth state change', () => {
      const onReady = vi.fn();
      // Make onAuthStateChanged call the callback immediately
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb({ uid: 'u1', email: 'test@test.com' });
        return vi.fn();
      });

      firebase.initAuth(onReady);
      expect(onReady).toHaveBeenCalledWith({ uid: 'u1', email: 'test@test.com' });
      expect(mocks.state.authLoading).toBe(false);
      expect(mocks.state.authError).toBeNull();
    });

    it('calls onReady with null when no user', () => {
      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb(null);
        return vi.fn();
      });

      firebase.initAuth(onReady);
      expect(onReady).toHaveBeenCalledWith(null);
      expect(mocks.state.currentUser).toBeNull();
    });

    it('calls window.render on subsequent auth state changes', () => {
      const onReady = vi.fn();
      let authCallback;
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        authCallback = cb;
        return vi.fn();
      });

      firebase.initAuth(onReady);

      // First call
      authCallback({ uid: 'u1' });
      expect(onReady).toHaveBeenCalledTimes(1);

      // Second call should trigger render instead of onReady
      authCallback({ uid: 'u2' });
      expect(onReady).toHaveBeenCalledTimes(1); // still 1
      expect(window.render).toHaveBeenCalled();
    });

    it('handles OAuth callback with id_token in URL hash', async () => {
      // Set up hash with tokens
      Object.defineProperty(window.location, 'hash', {
        value: '#id_token=mock-id-token&access_token=mock-access-token',
        writable: true,
        configurable: true,
      });

      const replaceStateSpy = vi.spyOn(history, 'replaceState').mockImplementation(() => {});
      mocks.signInWithCredential.mockResolvedValueOnce({ user: { uid: 'oauth-user' } });

      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb({ uid: 'oauth-user' });
        return vi.fn();
      });

      firebase.initAuth(onReady);

      expect(mocks.googleProviderCredential).toHaveBeenCalledWith('mock-id-token');
      expect(mocks.signInWithCredential).toHaveBeenCalled();
      expect(replaceStateSpy).toHaveBeenCalled();

      replaceStateSpy.mockRestore();
      Object.defineProperty(window.location, 'hash', { value: '', writable: true, configurable: true });
    });

    it('handles calendar OAuth callback with tokens', async () => {
      sessionStorage.setItem('oauth_calendar', '1');

      Object.defineProperty(window.location, 'hash', {
        value: '#id_token=cal-id-token&access_token=cal-access-token',
        writable: true,
        configurable: true,
      });

      vi.spyOn(history, 'replaceState').mockImplementation(() => {});
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb(null);
        return vi.fn();
      });

      const onReady = vi.fn();
      firebase.initAuth(onReady);

      expect(localStorage.getItem('nucleusGCalAccessToken')).toBe('cal-access-token');
      expect(localStorage.getItem('nucleusGCalConnected')).toBe('true');

      vi.spyOn(history, 'replaceState').mockRestore();
      Object.defineProperty(window.location, 'hash', { value: '', writable: true, configurable: true });
    });

    it('handles no hash in URL (no OAuth callback)', () => {
      Object.defineProperty(window.location, 'hash', {
        value: '',
        writable: true,
        configurable: true,
      });

      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb(null);
        return vi.fn();
      });

      firebase.initAuth(onReady);
      expect(mocks.signInWithCredential).not.toHaveBeenCalled();
    });

    it('handles hash without id_token', () => {
      Object.defineProperty(window.location, 'hash', {
        value: '#some=other&params=here',
        writable: true,
        configurable: true,
      });

      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb(null);
        return vi.fn();
      });

      firebase.initAuth(onReady);
      expect(mocks.signInWithCredential).not.toHaveBeenCalled();
    });

    it('sets authError when signInWithCredential fails', async () => {
      Object.defineProperty(window.location, 'hash', {
        value: '#id_token=bad-token&access_token=bad-access',
        writable: true,
        configurable: true,
      });
      vi.spyOn(history, 'replaceState').mockImplementation(() => {});

      mocks.signInWithCredential.mockRejectedValueOnce(new Error('Invalid credential'));

      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        // Don't fire immediately; let signInWithCredential reject first
        return vi.fn();
      });

      firebase.initAuth(onReady);

      // Wait for the promise rejection
      await vi.waitFor(() => {
        expect(mocks.state.authError).toBe('Invalid credential');
      });

      vi.spyOn(history, 'replaceState').mockRestore();
      Object.defineProperty(window.location, 'hash', { value: '', writable: true, configurable: true });
    });

    it('timeout fires after 5 seconds if auth does not respond', () => {
      vi.useFakeTimers();

      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation(() => vi.fn()); // never calls callback

      firebase.initAuth(onReady);
      expect(onReady).not.toHaveBeenCalled();

      vi.advanceTimersByTime(5000);
      expect(onReady).toHaveBeenCalledWith(null);
      expect(mocks.state.authLoading).toBe(false);
      expect(mocks.state.currentUser).toBeNull();

      vi.useRealTimers();
    });

    it('auth state change clears timeout', () => {
      vi.useFakeTimers();

      const onReady = vi.fn();
      let authCallback;
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        authCallback = cb;
        return vi.fn();
      });

      firebase.initAuth(onReady);

      // Fire auth callback before timeout
      authCallback({ uid: 'u1' });
      expect(onReady).toHaveBeenCalledTimes(1);

      // Advance past timeout — should not call onReady again
      vi.advanceTimersByTime(10000);
      expect(onReady).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('timeout does not fire if auth already responded', () => {
      vi.useFakeTimers();

      const onReady = vi.fn();
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb({ uid: 'fast-user' });
        return vi.fn();
      });

      firebase.initAuth(onReady);
      expect(onReady).toHaveBeenCalledWith({ uid: 'fast-user' });

      vi.advanceTimersByTime(10000);
      expect(onReady).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  // --------------------------------------------------------------------------
  // getOAuthRedirectUri (tested via signInWithGoogle behavior)
  // --------------------------------------------------------------------------
  describe('getOAuthRedirectUri (via signInWithGoogle)', () => {

    it('uses default redirect for GitHub Pages origin', () => {
      // The function is internal; we test by observing signInWithGoogle behavior.
      // When on GitHub Pages, it should use the DEFAULT_REDIRECT_URI
      let capturedUrl = '';
      delete window.location;
      window.location = new URL('https://mhabib306-sys.github.io/lifeg/');
      Object.defineProperty(window.location, 'href', {
        get: () => 'https://mhabib306-sys.github.io/lifeg/',
        set: (v) => { capturedUrl = v; },
        configurable: true,
      });

      firebase.signInWithGoogle();
      expect(capturedUrl).toContain('redirect_uri=https%3A%2F%2Fmhabib306-sys.github.io%2Flifeg%2F');

      delete window.location;
      window.location = new URL('http://localhost:3000/');
    });

    it('normalizes localhost URL (adds trailing slash)', () => {
      let capturedUrl = '';
      delete window.location;
      window.location = new URL('http://localhost:5173/lifeg');
      Object.defineProperty(window.location, 'href', {
        get: () => 'http://localhost:5173/lifeg',
        set: (v) => { capturedUrl = v; },
        configurable: true,
      });

      firebase.signInWithGoogle();
      // Should normalize /lifeg to /lifeg/
      expect(capturedUrl).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flifeg%2F');

      delete window.location;
      window.location = new URL('http://localhost:3000/');
    });

    it('falls back to default for custom scheme URLs (e.g. tauri://)', () => {
      let capturedUrl = '';
      delete window.location;
      // Simulate a custom scheme; URL constructor may not support custom schemes,
      // so we use a mock
      window.location = {
        href: 'tauri://localhost/lifeg/',
        hash: '',
        pathname: '/lifeg/',
        search: '',
        protocol: 'tauri:',
        origin: 'tauri://localhost',
      };
      Object.defineProperty(window.location, 'href', {
        get: () => 'tauri://localhost/lifeg/',
        set: (v) => { capturedUrl = v; },
        configurable: true,
      });

      firebase.signInWithGoogle();
      // Should fall back to default redirect URI
      expect(capturedUrl).toContain('redirect_uri=https%3A%2F%2Fmhabib306-sys.github.io%2Flifeg%2F');

      delete window.location;
      window.location = new URL('http://localhost:3000/');
    });
  });

  // --------------------------------------------------------------------------
  // preloadGoogleIdentityServices
  // --------------------------------------------------------------------------
  describe('preloadGoogleIdentityServices', () => {

    it('does not throw when called', () => {
      expect(() => firebase.preloadGoogleIdentityServices()).not.toThrow();
    });

    it('resolves immediately if google.accounts.oauth2 already loaded', async () => {
      window.google = { accounts: { oauth2: {} } };
      // Should not create a script element
      const scriptsBefore = document.querySelectorAll('script[data-gis-client]').length;
      firebase.preloadGoogleIdentityServices();
      const scriptsAfter = document.querySelectorAll('script[data-gis-client]').length;
      expect(scriptsAfter).toBe(scriptsBefore);
    });
  });

  // --------------------------------------------------------------------------
  // signInWithGoogleCalendar — additional edge cases
  // --------------------------------------------------------------------------
  describe('signInWithGoogleCalendar extra', () => {

    it('stores expires_in from GIS response', async () => {
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn(() => {
                callback({ access_token: 'tok', expires_in: 7200 });
              }),
            })),
          },
        },
      };

      await firebase.signInWithGoogleCalendar({ mode: 'interactive' });
      expect(localStorage.getItem('nucleusGCalExpiresIn')).toBe('7200');
    });

    it('handles null response from GIS callback', async () => {
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn(() => {
                callback(null);
              }),
            })),
          },
        },
      };

      const result = await firebase.signInWithGoogleCalendar({ mode: 'interactive' });
      // null response -> no access_token -> falls to interactive redirect
      // But since GIS returned null, finalize(null) is called, and then
      // for interactive mode it falls back to redirect
      // Actually: the GIS callback fires with null -> finalize(null)
      // Then gisToken is null, and mode is interactive, so it does redirect
      expect(result).toBeNull();
    });

    it('uses login_hint from localStorage in silent mode', async () => {
      localStorage.setItem('nucleusGCalLoginHint', 'stored@test.com');
      let requestArgs;
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn((args) => {
                requestArgs = args;
                callback({ access_token: 'silent-tok' });
              }),
            })),
          },
        },
      };

      await firebase.signInWithGoogleCalendar({ mode: 'silent' });
      expect(requestArgs.login_hint).toBe('stored@test.com');
      expect(requestArgs.prompt).toBe('');
    });

    it('uses auth.currentUser.email as fallback login_hint', async () => {
      mocks.mockAuth.currentUser = { email: 'current@test.com' };
      let requestArgs;
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(({ callback }) => ({
              requestAccessToken: vi.fn((args) => {
                requestArgs = args;
                callback({ access_token: 'silent-tok2' });
              }),
            })),
          },
        },
      };

      await firebase.signInWithGoogleCalendar({ mode: 'silent' });
      expect(requestArgs.login_hint).toBe('current@test.com');
    });

    it('handles exception in tokenClient creation gracefully', async () => {
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn(() => {
              throw new Error('GIS init failed');
            }),
          },
        },
      };

      const result = await firebase.signInWithGoogleCalendar({ mode: 'silent' });
      expect(result).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // initAuth — extra edge cases
  // --------------------------------------------------------------------------
  describe('initAuth extra', () => {

    it('updates state.currentUser on auth state changes', () => {
      let authCallback;
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        authCallback = cb;
        return vi.fn();
      });

      const onReady = vi.fn();
      firebase.initAuth(onReady);

      const user = { uid: 'u99', email: 'new@test.com', displayName: 'New User' };
      authCallback(user);
      expect(mocks.state.currentUser).toBe(user);
    });

    it('clears authError on auth state change', () => {
      mocks.state.authError = 'previous error';
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb({ uid: 'u1' });
        return vi.fn();
      });

      firebase.initAuth(vi.fn());
      expect(mocks.state.authError).toBeNull();
    });

    it('extracts email from JWT in calendar OAuth callback', () => {
      sessionStorage.setItem('oauth_calendar', '1');

      // Create a fake JWT with email
      const payload = { email: 'jwt@test.com', sub: '12345' };
      const fakeJwt = 'header.' + btoa(JSON.stringify(payload)) + '.sig';

      Object.defineProperty(window.location, 'hash', {
        value: `#id_token=${fakeJwt}&access_token=cal-tok`,
        writable: true,
        configurable: true,
      });
      vi.spyOn(history, 'replaceState').mockImplementation(() => {});
      mocks.onAuthStateChanged.mockImplementation((auth, cb) => {
        cb(null);
        return vi.fn();
      });

      firebase.initAuth(vi.fn());
      expect(localStorage.getItem('nucleusGCalLoginHint')).toBe('jwt@test.com');

      vi.spyOn(history, 'replaceState').mockRestore();
      Object.defineProperty(window.location, 'hash', { value: '', writable: true, configurable: true });
    });
  });
});
