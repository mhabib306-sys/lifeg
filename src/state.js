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
  DEFAULT_TASK_CATEGORIES,
  DEFAULT_TASK_LABELS,
  DEFAULT_TASK_PEOPLE,
  DEFAULT_HOME_WIDGETS,
  STORAGE_KEY,
  TASKS_KEY,
  TASK_CATEGORIES_KEY,
  TASK_LABELS_KEY,
  TASK_PEOPLE_KEY,
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

// ---------------------------------------------------------------------------
// Collapsed notes (Set) — loaded from localStorage
// ---------------------------------------------------------------------------
let initialCollapsedNotes;
try {
  const storedCollapsed = localStorage.getItem('collapsedNotes');
  initialCollapsedNotes = new Set(storedCollapsed ? JSON.parse(storedCollapsed) : []);
} catch (e) {
  console.error('Error loading collapsed notes:', e);
  localStorage.removeItem('collapsedNotes');
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
const initialTaskCategories = (safeJsonParse(TASK_CATEGORIES_KEY, null) || DEFAULT_TASK_CATEGORIES)
  .filter(item => !isEntityDeleted('taskCategories', item?.id));
const initialTaskLabels = (safeJsonParse(TASK_LABELS_KEY, null) || DEFAULT_TASK_LABELS)
  .filter(item => !isEntityDeleted('taskLabels', item?.id));
const initialTaskPeople = (safeJsonParse(TASK_PEOPLE_KEY, null) || DEFAULT_TASK_PEOPLE)
  .filter(item => !isEntityDeleted('taskPeople', item?.id))
  .map(item => ({
    ...item,
    email: typeof item?.email === 'string' ? item.email : '',
    jobTitle: typeof item?.jobTitle === 'string' ? item.jobTitle : '',
  }));
const initialCustomPerspectives = (safeJsonParse(PERSPECTIVES_KEY, []) || [])
  .filter(item => !isEntityDeleted('customPerspectives', item?.id));
const initialHomeWidgets = (safeJsonParse(HOME_WIDGETS_KEY, null) || DEFAULT_HOME_WIDGETS)
  .filter(item => !isEntityDeleted('homeWidgets', item?.id));

// ---------------------------------------------------------------------------
// The single exported state object
// ---------------------------------------------------------------------------
export const state = {
  // ---- Auth ----
  currentUser: null,
  authLoading: true,
  authError: null,

  // ---- Sync / weather ----
  syncStatus: 'idle',                 // 'idle' | 'syncing' | 'success' | 'error'
  lastSyncTime: null,
  syncDebounceTimer: null,
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
  bulkMonth: 0,          // January (0-indexed)
  bulkYear: 2026,
  bulkCategory: 'prayers',

  // ---- Tasks system ----
  tasksData: initialTasksData,
  deletedTaskTombstones: initialDeletedTaskTombstones,
  deletedEntityTombstones: initialDeletedEntityTombstones,
  taskCategories: initialTaskCategories,
  taskLabels: initialTaskLabels,
  taskPeople: initialTaskPeople,
  customPerspectives: initialCustomPerspectives,
  homeWidgets: initialHomeWidgets,
  editingHomeWidgets: false,
  showAddWidgetPicker: false,
  draggingWidgetId: null,

  // ---- Task view / filter state ----
  activePerspective: initialActivePerspective,
  activeFilterType: savedViewState.activeFilterType || 'perspective',
  activeCategoryFilter: savedViewState.activeCategoryFilter || null,
  activeLabelFilter: savedViewState.activeLabelFilter || null,
  activePersonFilter: savedViewState.activePersonFilter || null,

  // ---- Calendar state ----
  calendarMonth: new Date().getMonth(),   // 0-11
  calendarYear: new Date().getFullYear(),
  calendarSelectedDate: getLocalDateString(),
  calendarViewMode: 'month',    // 'month' | 'week' | '3days'
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
  newTaskContext: { categoryId: null, labelId: null, personId: null, status: 'inbox' },
  inlineAutocompleteMeta: new Map(),      // Maps inputId -> { categoryId, labels[], people[] }

  // ---- Mobile drawer ----
  mobileDrawerOpen: false,

  // ---- Modal visibility flags ----
  showTaskModal: false,
  showPerspectiveModal: false,
  showCategoryModal: false,
  showLabelModal: false,
  showPersonModal: false,

  // ---- Entity editing IDs ----
  editingCategoryId: null,
  editingLabelId: null,
  editingPersonId: null,
  editingPerspectiveId: null,
  perspectiveEmojiPickerOpen: false,
  emojiSearchQuery: '',

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
  modalSelectedStatus: 'inbox',
  modalSelectedToday: false,
  modalSelectedFlagged: false,
  modalSelectedTags: [],
  modalSelectedPeople: [],
  modalIsNote: false,
  modalRepeatEnabled: false,
  modalStateInitialized: false,

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

  // ---- Google Sheets ----
  gsheetData: safeJsonParse(GSHEET_CACHE_KEY, null),
  gsheetSyncing: false,
  gsheetError: null,
  gsheetPrompt: '',
  gsheetResponse: null,
  gsheetAsking: false,
};
