/**
 * state.js — Centralized mutable state for the Homebase app.
 *
 * Every global `let` variable from index.html is collected here into a single
 * exported `state` object. This is the single source of truth for all runtime
 * state. Functions and UI code should read/write `state.propertyName` instead
 * of bare top-level variables.
 *
 * Initial data loading (JANUARY_DATA merge, migration, localStorage hydration)
 * is performed at import time so the state object is ready to use immediately.
 */

// ---------------------------------------------------------------------------
// Imports — constants
// ---------------------------------------------------------------------------
import {
  DEFAULT_TASK_AREAS,
  DEFAULT_TASK_LABELS,
  DEFAULT_TASK_PEOPLE,
  DEFAULT_HOME_WIDGETS,
  STORAGE_KEY,
  TASKS_KEY,
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY,
  CATEGORIES_KEY,
  PERSPECTIVES_KEY,
  HOME_WIDGETS_KEY,
  VIEW_STATE_KEY,
  DELETED_TASK_TOMBSTONES_KEY,
  DELETED_ENTITY_TOMBSTONES_KEY,
  JANUARY_DATA,
  DEFAULT_WEIGHTS,
  DEFAULT_MAX_SCORES,
  DEFAULT_CATEGORY_WEIGHTS,
  MAX_SCORES_KEY,
  WEIGHTS_KEY,
  XP_KEY,
  STREAK_KEY,
  ACHIEVEMENTS_KEY,
  CATEGORY_WEIGHTS_KEY,
  MEETING_NOTES_KEY,
  GCAL_OFFLINE_QUEUE_KEY,
  CONFLICT_NOTIFICATIONS_KEY,
  GSHEET_CACHE_KEY,
  COLLAPSED_NOTES_KEY,
  TRIGGERS_KEY,
  COLLAPSED_TRIGGERS_KEY,
  GITHUB_SYNC_DIRTY_KEY,
  SYNC_HEALTH_KEY,
  SYNC_SEQUENCE_KEY,
} from './constants.js';

// ---------------------------------------------------------------------------
// Imports — utilities
// ---------------------------------------------------------------------------
import { safeJsonParse, getLocalDateString } from './utils.js';

// ---------------------------------------------------------------------------
// Helper: loadWeights
// ---------------------------------------------------------------------------
function loadWeights() {
  try {
    const stored = localStorage.getItem(WEIGHTS_KEY);
    if (!stored) return JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
    const saved = JSON.parse(stored);
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
    // Deep merge: ensure all default keys exist
    const merged = JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
    Object.keys(merged).forEach(category => {
      if (saved[category]) {
        Object.keys(merged[category]).forEach(key => {
          if (saved[category][key] !== undefined) merged[category][key] = saved[category][key];
        });
      }
    });
    return merged;
  } catch (e) {
    console.error('Error loading weights:', e);
    return JSON.parse(JSON.stringify(DEFAULT_WEIGHTS));
  }
}

// ---------------------------------------------------------------------------
// Helper: loadMaxScores
// ---------------------------------------------------------------------------
function loadMaxScores() {
  try {
    const stored = localStorage.getItem(MAX_SCORES_KEY);
    if (!stored) return JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
    const saved = JSON.parse(stored);
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
    return { ...DEFAULT_MAX_SCORES, ...saved };
  } catch (e) {
    console.error('Error loading max scores:', e);
    return JSON.parse(JSON.stringify(DEFAULT_MAX_SCORES));
  }
}

// ---------------------------------------------------------------------------
// Initial data loading: merge JANUARY_DATA with localStorage, run migration
// ---------------------------------------------------------------------------
const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
const mergedData = { ...JANUARY_DATA, ...storedData };

// Migration: move NoP from glucose to habits if it exists
let migrated = false;
Object.keys(mergedData).forEach(date => {
  const day = mergedData[date];
  if (day.glucose && day.glucose.nop !== undefined && day.glucose.nop !== '') {
    if (!day.habits) day.habits = {};
    if (day.habits.nop === undefined || day.habits.nop === '') {
      day.habits.nop = day.glucose.nop;
      migrated = true;
    }
    delete day.glucose.nop;
  }
});
if (migrated) console.log('Migrated NoP data from glucose to habits');

// Persist merged + migrated data
localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));

// ---------------------------------------------------------------------------
// View state hydration
// ---------------------------------------------------------------------------
const savedViewState = JSON.parse(localStorage.getItem(VIEW_STATE_KEY) || '{}');

let initialActiveTab = savedViewState.activeTab || 'home';
let initialActiveSubTab = savedViewState.activeSubTab || 'dashboard';

// Migrate old tab values to new structure
if (initialActiveTab === 'track' || initialActiveTab === 'bulk' || initialActiveTab === 'dashboard') {
  initialActiveSubTab = initialActiveTab === 'track' ? 'daily' : initialActiveTab;
  initialActiveTab = 'life';
}
// Ensure valid tab values
if (!['home', 'life', 'tasks', 'calendar', 'settings'].includes(initialActiveTab)) {
  initialActiveTab = 'home';
}

let initialActivePerspective = savedViewState.activePerspective || 'inbox';
// Migrate old 'home' perspective to 'inbox' since Home is now a separate tab
if (initialActivePerspective === 'home') initialActivePerspective = 'inbox';
// Calendar perspective now belongs exclusively to the Calendar tab.
if (initialActivePerspective === 'calendar') initialActivePerspective = 'inbox';
const initialWorkspaceContentMode = ['tasks', 'notes', 'both'].includes(savedViewState.workspaceContentMode)
  ? savedViewState.workspaceContentMode
  : 'both';

// ---------------------------------------------------------------------------
// Collapsed notes (Set) — loaded from localStorage
// ---------------------------------------------------------------------------
let initialCollapsedNotes;
try {
  const storedCollapsed = localStorage.getItem(COLLAPSED_NOTES_KEY);
  initialCollapsedNotes = new Set(storedCollapsed ? JSON.parse(storedCollapsed) : []);
} catch (e) {
  console.error('Error loading collapsed notes:', e);
  localStorage.removeItem(COLLAPSED_NOTES_KEY);
  initialCollapsedNotes = new Set();
}

function normalizeTombstones(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  Object.entries(raw).forEach(([id, ts]) => {
    const parsed = ts ? new Date(ts).getTime() : 0;
    if (!id || !Number.isFinite(parsed) || parsed <= 0) return;
    out[String(id)] = new Date(parsed).toISOString();
  });
  return out;
}

function normalizeEntityTombstones(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  Object.entries(raw).forEach(([collection, ids]) => {
    out[collection] = normalizeTombstones(ids);
  });
  return out;
}

const initialDeletedTaskTombstones = normalizeTombstones(safeJsonParse(DELETED_TASK_TOMBSTONES_KEY, {}));
const initialDeletedEntityTombstones = normalizeEntityTombstones(safeJsonParse(DELETED_ENTITY_TOMBSTONES_KEY, {}));

const isEntityDeleted = (collection, id) => !!(collection && id && initialDeletedEntityTombstones[collection]?.[String(id)]);
const initialTasksData = (safeJsonParse(TASKS_KEY, []) || []).filter(task => !initialDeletedTaskTombstones[String(task?.id)]);
const initialTaskAreas = (safeJsonParse(TASK_CATEGORIES_KEY, null) || DEFAULT_TASK_AREAS)
  .filter(item => !isEntityDeleted('taskCategories', item?.id));
const initialTaskLabels = (safeJsonParse(TASK_LABELS_KEY, null) || DEFAULT_TASK_LABELS)
  .filter(item => !isEntityDeleted('taskLabels', item?.id));
const initialTaskPeople = (safeJsonParse(TASK_PEOPLE_KEY, null) || DEFAULT_TASK_PEOPLE)
  .filter(item => !isEntityDeleted('taskPeople', item?.id))
  .map(item => ({
    ...item,
    email: typeof item?.email === 'string' ? item.email : '',
    jobTitle: typeof item?.jobTitle === 'string' ? item.jobTitle : '',
    photoUrl: typeof item?.photoUrl === 'string' ? item.photoUrl : '',
    photoData: typeof item?.photoData === 'string' ? item.photoData : '',
  }));
const initialCustomPerspectives = (safeJsonParse(PERSPECTIVES_KEY, []) || [])
  .filter(item => !isEntityDeleted('customPerspectives', item?.id));
const initialCategories = (safeJsonParse(CATEGORIES_KEY, []) || [])
  .filter(item => !isEntityDeleted('categories', item?.id));
const initialHomeWidgets = (safeJsonParse(HOME_WIDGETS_KEY, null) || DEFAULT_HOME_WIDGETS)
  .filter(item => !isEntityDeleted('homeWidgets', item?.id));

// ---------------------------------------------------------------------------
// The single exported state object
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} HomebaseState
 *
 * --- Auth ---
 * @property {Object|null} currentUser - Firebase user object or null
 * @property {boolean} authLoading - True while auth state is being determined
 * @property {string|null} authError - Auth error message if any
 *
 * --- Sync ---
 * @property {'idle'|'syncing'|'success'|'error'} syncStatus
 * @property {Date|null} lastSyncTime
 * @property {number|null} syncDebounceTimer - setTimeout ID
 * @property {boolean} syncInProgress - Lock to prevent concurrent save/load
 * @property {boolean} syncPendingRetry
 * @property {number} syncRetryCount - Exponential backoff counter
 * @property {number|null} syncRetryTimer - setTimeout ID
 * @property {boolean} cloudPullPending - Deferred cloud pull after save
 * @property {boolean} githubSyncDirty - True if local changes are unsaved
 * @property {boolean} syncRateLimited - True when GitHub returns 403
 * @property {number} syncSequence - Monotonic sync counter
 * @property {Object} syncHealth - Sync health metrics (saves, loads, errors, latency)
 *
 * --- Weather ---
 * @property {Object|null} weatherData
 * @property {{lat: number, lon: number, city: string}} weatherLocation
 *
 * --- Scoring ---
 * @property {Object} WEIGHTS - Category scoring weights
 * @property {Object} MAX_SCORES - Max score values per metric
 * @property {Object} CATEGORY_WEIGHTS - Weights for gamification categories
 * @property {{total: number, history: Array}} xp - Experience points
 * @property {{current: number, longest: number, lastLoggedDate: string|null, shield: Object, multiplier: number}} streak
 * @property {{unlocked: Object}} achievements
 * @property {string|null} dailyFocusDismissed
 *
 * --- Core Data ---
 * @property {Object} storedData - Raw localStorage data
 * @property {Object} allData - Merged data (JANUARY_DATA + stored)
 * @property {string} currentDate - ISO date string (YYYY-MM-DD)
 *
 * --- Navigation ---
 * @property {'home'|'tasks'|'life'|'calendar'|'settings'} activeTab
 * @property {'daily'|'bulk'|'dashboard'} activeSubTab
 *
 * --- Tasks ---
 * @property {Array<Object>} tasksData - All tasks
 * @property {Object} deletedTaskTombstones - {taskId: ISO timestamp}
 * @property {Object} deletedEntityTombstones - {collection: {id: ISO timestamp}}
 * @property {Array<Object>} taskAreas
 * @property {Array<Object>} taskLabels
 * @property {Array<Object>} taskPeople
 * @property {Array<Object>} taskCategories
 * @property {Array<Object>} customPerspectives
 *
 * --- Task View / Filter ---
 * @property {string} activePerspective
 * @property {'tasks'|'notes'|'both'} workspaceContentMode
 * @property {boolean} workspaceSidebarCollapsed
 * @property {'perspective'|'area'|'label'|'person'} activeFilterType
 * @property {string|null} activeAreaFilter
 * @property {string|null} activeLabelFilter
 * @property {string|null} activePersonFilter
 * @property {string|null} activeCategoryFilter
 *
 * --- UI Modals ---
 * @property {boolean} showTaskModal
 * @property {boolean} showPerspectiveModal
 * @property {boolean} showAreaModal
 * @property {boolean} showLabelModal
 * @property {boolean} showPersonModal
 * @property {boolean} showCategoryModal
 * @property {boolean} showBraindump
 * @property {boolean} showGlobalSearch
 *
 * --- Task Modal State ---
 * @property {string|null} modalSelectedArea
 * @property {string|null} modalSelectedCategory
 * @property {string} modalSelectedStatus
 * @property {boolean} modalSelectedToday
 * @property {boolean} modalSelectedFlagged
 * @property {Array<string>} modalSelectedTags
 * @property {Array<string>} modalSelectedPeople
 * @property {boolean} modalIsNote
 * @property {boolean} modalRepeatEnabled
 * @property {boolean} modalStateInitialized
 *
 * --- Entity Editing ---
 * @property {string|null} editingTaskId
 * @property {string|null} editingAreaId
 * @property {string|null} editingLabelId
 * @property {string|null} editingPersonId
 * @property {string|null} editingPerspectiveId
 * @property {string|null} editingCategoryId
 * @property {string|null} editingNoteId
 * @property {string|null} editingTriggerId
 *
 * --- Emoji Pickers ---
 * @property {boolean} perspectiveEmojiPickerOpen
 * @property {boolean} areaEmojiPickerOpen
 * @property {boolean} categoryEmojiPickerOpen
 * @property {string} emojiSearchQuery
 * @property {string} pendingPerspectiveEmoji
 * @property {string} pendingAreaEmoji
 * @property {string} pendingCategoryEmoji
 *
 * --- Calendar ---
 * @property {number} calendarMonth - 0-11
 * @property {number} calendarYear
 * @property {string} calendarSelectedDate
 * @property {'month'|'week'|'3days'} calendarViewMode
 * @property {boolean} calendarEventModalOpen
 * @property {string|null} calendarEventModalCalendarId
 * @property {string|null} calendarEventModalEventId
 *
 * --- Drag & Drop ---
 * @property {string|null} draggedTaskId
 * @property {string|null} dragOverTaskId
 * @property {'top'|'bottom'|null} dragPosition
 * @property {string|null} draggedSidebarItem
 * @property {string|null} draggedSidebarType
 * @property {'top'|'bottom'|null} sidebarDragPosition
 * @property {string|null} draggedNoteId
 * @property {string|null} dragOverNoteId
 * @property {'top'|'bottom'|'child'|null} noteDragPosition
 *
 * --- Notes Outliner ---
 * @property {Set<string>} collapsedNotes
 * @property {string|null} zoomedNoteId
 * @property {Array<{id: string, title: string}>} notesBreadcrumb
 *
 * --- Render Performance ---
 * @property {{lastMs: number, avgMs: number, maxMs: number, count: number}} renderPerf
 * @property {boolean} _lastRenderWasMobile
 */

/** @type {HomebaseState} */
export const state = {
  // ---- Auth ----
  currentUser: null,
  authLoading: true,
  authError: null,

  // ---- Sync / weather ----
  syncStatus: 'idle',                 // 'idle' | 'syncing' | 'success' | 'error'
  lastSyncTime: null,
  syncDebounceTimer: null,
  syncInProgress: false,              // Lock to prevent concurrent save/load
  syncPendingRetry: false,            // Queue retry after current sync completes
  syncRetryCount: 0,                  // Exponential backoff counter
  syncRetryTimer: null,               // setTimeout ID for exponential backoff retry
  cloudPullPending: false,            // Deferred cloud pull after save completes
  githubSyncDirty: localStorage.getItem(GITHUB_SYNC_DIRTY_KEY) === 'true',
  syncRateLimited: false,             // True when GitHub API returns 403 (rate limit)
  syncSequence: parseInt(localStorage.getItem(SYNC_SEQUENCE_KEY) || '0', 10),
  syncHealth: (() => {
    try {
      const stored = localStorage.getItem(SYNC_HEALTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.recentEvents = Array.isArray(parsed.recentEvents) ? parsed.recentEvents.slice(0, 20) : [];
        return parsed;
      }
    } catch (_) {}
    return {
      totalSaves: 0, successfulSaves: 0, failedSaves: 0,
      totalLoads: 0, successfulLoads: 0, failedLoads: 0,
      lastSaveLatencyMs: 0, avgSaveLatencyMs: 0,
      lastError: null, recentEvents: [],
    };
  })(),
  weatherData: null,
  weatherLocation: { lat: 30.0291, lon: 31.4975, city: 'New Cairo' },

  // ---- Scoring weights & max scores (mutable via settings / import / reset) ----
  WEIGHTS: loadWeights(),
  MAX_SCORES: loadMaxScores(),

  // ---- Core tracking data ----
  storedData: storedData,
  allData: mergedData,

  // ---- Date & chart instances ----
  currentDate: getLocalDateString(),
  weekChart: null,
  breakdownChart: null,

  // ---- Navigation ----
  activeTab: initialActiveTab,
  activeSubTab: initialActiveSubTab,

  // ---- Bulk entry ----
  bulkMonth: new Date().getMonth(),
  bulkYear: new Date().getFullYear(),
  bulkCategory: 'prayers',

  // ---- Tasks system ----
  tasksData: initialTasksData,
  deletedTaskTombstones: initialDeletedTaskTombstones,
  deletedEntityTombstones: initialDeletedEntityTombstones,
  taskAreas: initialTaskAreas,
  taskLabels: initialTaskLabels,
  taskPeople: initialTaskPeople,
  taskCategories: initialCategories,
  customPerspectives: initialCustomPerspectives,
  homeWidgets: initialHomeWidgets,
  editingHomeWidgets: false,
  showAddWidgetPicker: false,
  draggingWidgetId: null,

  // ---- Task view / filter state ----
  activePerspective: initialActivePerspective,
  workspaceContentMode: initialWorkspaceContentMode,
  workspaceSidebarCollapsed: false,
  activeFilterType: (savedViewState.activeFilterType === 'category' ? 'area' : savedViewState.activeFilterType) || 'perspective',
  activeAreaFilter: savedViewState.activeAreaFilter || null,
  activeLabelFilter: savedViewState.activeLabelFilter || null,
  activePersonFilter: savedViewState.activePersonFilter || null,

  // ---- Calendar state ----
  calendarMonth: new Date().getMonth(),   // 0-11
  calendarYear: new Date().getFullYear(),
  calendarSelectedDate: getLocalDateString(),
  calendarViewMode: 'month',    // 'month' | 'week' | '3days'
  calendarSidebarCollapsed: false, // Collapse sidebar to show full-width calendar
  calendarEventModalOpen: false,
  calendarEventModalCalendarId: null,
  calendarEventModalEventId: null,
  draggedCalendarEvent: null,   // { calendarId, eventId }
  calendarMeetingNotesEventKey: null,
  calendarMeetingNotesScope: 'instance', // 'instance' | 'series'
  meetingNotesByEvent: safeJsonParse(MEETING_NOTES_KEY, {}),

  // ---- Task editing state ----
  editingTaskId: null,
  inlineEditingTaskId: null,
  quickAddIsNote: false,
  showAllSidebarPeople: false,
  showAllSidebarLabels: false,
  newTaskContext: { areaId: null, labelId: null, personId: null, status: 'inbox' },
  inlineAutocompleteMeta: new Map(),      // Maps inputId -> { areaId, labels[], people[] }

  // ---- Mobile drawer ----
  mobileDrawerOpen: false,

  // ---- Modal visibility flags ----
  showTaskModal: false,
  showPerspectiveModal: false,
  showAreaModal: false,
  showLabelModal: false,
  showPersonModal: false,
  showCategoryModal: false,
  editingCategoryId: null,
  activeCategoryFilter: savedViewState.activeCategoryFilter || null,

  // ---- Entity editing IDs ----
  editingAreaId: null,
  editingLabelId: null,
  editingPersonId: null,
  editingPerspectiveId: null,
  perspectiveEmojiPickerOpen: false,
  areaEmojiPickerOpen: false,
  categoryEmojiPickerOpen: false,
  emojiSearchQuery: '',
  pendingPerspectiveEmoji: '',
  pendingAreaEmoji: '',
  pendingCategoryEmoji: '',

  // ---- Sidebar collapse/expand ----
  collapsedSidebarAreas: new Set(),       // Set<areaId> — which areas have categories hidden

  // ---- Sidebar drag & drop ----
  draggedSidebarItem: null,
  draggedSidebarType: null,
  sidebarDragPosition: null,              // 'top' | 'bottom'

  // ---- Inline tag / person creation in modal ----
  showInlineTagInput: false,
  showInlinePersonInput: false,

  // ---- Notes outliner ----
  editingNoteId: null,
  collapsedNotes: initialCollapsedNotes,  // Set<string>
  zoomedNoteId: null,                     // ID of note zoomed into (null = root)
  notesBreadcrumb: [],                    // [{id, title}] for breadcrumb trail

  // ---- Notes drag & drop ----
  draggedNoteId: null,
  dragOverNoteId: null,
  noteDragPosition: null,                 // 'top' | 'bottom' | 'child'

  // ---- Task list drag & drop ----
  draggedTaskId: null,
  dragOverTaskId: null,
  dragPosition: null,                     // 'top' | 'bottom'

  // ---- Scores cache ----
  scoresCache: new Map(),
  scoresCacheVersion: 0,

  // ---- Undo toast ----
  undoAction: null,           // { label, snapshot, restoreFn } or null
  undoTimerRemaining: 0,      // seconds left (5→0)
  undoTimerId: null,           // setInterval ID

  // ---- Braindump ----
  showBraindump: false,
  braindumpRawText: '',
  braindumpParsedItems: [],
  braindumpStep: 'input',       // 'input' | 'processing' | 'review' | 'success'
  braindumpEditingIndex: null,
  braindumpSuccessMessage: '',
  braindumpProcessing: false,    // true while AI is classifying
  braindumpAIError: null,        // string error message if AI failed
  braindumpFullPage: false,      // true = full-width review, false = 640px container
  braindumpVoiceRecording: false,
  braindumpVoiceTranscribing: false,
  braindumpVoiceError: null,

  // ---- Google Calendar ----
  gcalEvents: [],            // Cached Google Calendar events
  gcalCalendarList: [],      // Available calendars from user's account
  gcalCalendarsLoading: false, // True while loading calendar list
  gcalError: null,           // Last Google Calendar error message
  gcalSyncing: false,        // True during active sync
  gcalTokenExpired: false,   // True when token needs refresh
  gcalOfflineQueue: safeJsonParse(GCAL_OFFLINE_QUEUE_KEY, []),
  gcontactsSyncing: false,
  gcontactsLastSync: null,
  gcontactsError: null,
  calendarMobileShowToday: true,
  calendarMobileShowEvents: true,
  calendarMobileShowScheduled: true,

  // ---- Conflict center ----
  conflictNotifications: safeJsonParse(CONFLICT_NOTIFICATIONS_KEY, []),

  // ---- Render perf + cache prompt ----
  renderPerf: { lastMs: 0, avgMs: 0, maxMs: 0, count: 0 },
  showCacheRefreshPrompt: false,
  cacheRefreshPromptMessage: '',

  // ---- Task modal state ----
  modalSelectedArea: null,
  modalSelectedCategory: null,
  modalSelectedStatus: 'inbox',
  modalSelectedToday: false,
  modalSelectedFlagged: false,
  modalSelectedTags: [],
  modalSelectedPeople: [],
  modalIsNote: false,
  modalRepeatEnabled: false,
  modalStateInitialized: false,
  modalWaitingFor: null,  // GTD Waiting-For: {personId, description, followUpDate}
  modalIsProject: false,  // GTD: Mark task as multi-step project
  modalProjectId: null,   // GTD: Link task to parent project
  modalProjectType: 'parallel', // GTD: 'sequential' (ordered) or 'parallel' (any order)
  modalTimeEstimate: null, // GTD: Time estimate in minutes (5, 15, 30, 60)

  // ---- Gamification ----
  CATEGORY_WEIGHTS: safeJsonParse(CATEGORY_WEIGHTS_KEY, null) || JSON.parse(JSON.stringify(DEFAULT_CATEGORY_WEIGHTS)),
  xp: safeJsonParse(XP_KEY, { total: 0, history: [] }),
  streak: safeJsonParse(STREAK_KEY, {
    current: 0,
    longest: 0,
    lastLoggedDate: null,
    shield: { available: true, lastUsed: null },
    multiplier: 1.0
  }),
  achievements: safeJsonParse(ACHIEVEMENTS_KEY, { unlocked: {} }),
  dailyFocusDismissed: null,

  // ---- Triggers (GTD trigger lists) ----
  triggers: safeJsonParse(TRIGGERS_KEY, []),
  editingTriggerId: null,
  collapsedTriggers: (() => { try { const s = localStorage.getItem(COLLAPSED_TRIGGERS_KEY); return new Set(s ? JSON.parse(s) : []); } catch(e) { return new Set(); } })(),
  zoomedTriggerId: null,
  triggersBreadcrumb: [],

  // ---- Review Mode ----
  reviewMode: false,
  reviewAreaIndex: 0,
  reviewCompletedAreas: [],
  reviewTriggersCollapsed: false, // Triggers expanded by default
  reviewProjectsCollapsed: false, // Projects/tasks expanded by default
  reviewNotesCollapsed: false, // Notes expanded by default
  lastWeeklyReview: localStorage.getItem('nucleusLastWeeklyReview') || null,
  lastSomedayReview: localStorage.getItem('nucleusLastSomedayReview') || null,

  // ---- Google Sheets ----
  gsheetData: safeJsonParse(GSHEET_CACHE_KEY, null),
  gsheetSyncing: false,
  gsheetError: null,
  gsheetPrompt: '',
  gsheetResponse: null,
  gsheetAsking: false,
  gsheetEditingPrompt: false,

  // ---- Global Search ----
  showGlobalSearch: false,
  globalSearchQuery: '',
  globalSearchResults: [],
  globalSearchActiveIndex: -1,
  globalSearchTypeFilter: null,   // null=all, or 'task'|'note'|'area'|'category'|'label'|'person'|'perspective'|'trigger'

  // ---- Settings details open state ----
  settingsIntegrationsOpen: false,
  settingsScoringOpen: false,
  settingsDevToolsOpen: false,
  settingsDataDiagOpen: false,

  // ---- Responsive ----
  _lastRenderWasMobile: false,

  // ---- Event listener cleanup registry ----
  // Functions to call before full DOM replacement to prevent memory leaks
  cleanupCallbacks: [],

  // ---- Storage quota status ----
  quotaExceededError: false, // Set true when localStorage quota exceeded, shows UI banner
};
