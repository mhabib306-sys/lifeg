// ============================================================================
// BRIDGE MODULE — Window globals for onclick handlers
// ============================================================================
// All render functions produce HTML strings with onclick="functionName()".
// Those functions must be accessible globally (window.*). This module imports
// them from their respective modules and assigns them to window.
//
// This is the ONLY file that should do Object.assign(window, ...).
// Import direction: bridge.js ← everything else (no circular deps).

import { state } from './state.js';

// -- Utils --
import { getLocalDateString, escapeHtml, fmt, formatSmartDate, generateTaskId } from './utils.js';

// -- Constants (some referenced directly in onclick handlers) --
import { THINGS3_ICONS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, defaultDayData } from './constants.js';

// -- Data / Storage --
import {
  saveData, getTodayData, updateData, saveTasksData,
  toggleDailyField, updateDailyField, saveViewState,
  saveWeights, saveMaxScores, saveHomeWidgets, saveCollapsedNotes
} from './data/storage.js';

import {
  getGithubToken, setGithubToken, getTheme, setTheme,
  applyStoredTheme, getAccentColor, getThemeColors,
  updateSyncStatus, saveToGithub, debouncedSaveToGithub, loadCloudData,
  dismissConflictNotification, clearConflictNotifications
} from './data/github-sync.js';

import { exportData, importData } from './data/export-import.js';

import { signInWithGoogle, signOutUser, getCurrentUser, initAuth, signInWithGoogleCalendar } from './data/firebase.js';

import {
  getWhoopWorkerUrl, setWhoopWorkerUrl, getWhoopApiKey, setWhoopApiKey,
  getWhoopLastSync, isWhoopConnected, fetchWhoopData, syncWhoopNow,
  checkAndSyncWhoop, connectWhoop, disconnectWhoop, checkWhoopStatus, initWhoopSync
} from './data/whoop-sync.js';

import {
  isGCalConnected, getSelectedCalendars, setSelectedCalendars,
  getTargetCalendar, setTargetCalendar, fetchCalendarList,
  getGCalEventsForDate, pushTaskToGCalIfConnected, deleteGCalEventIfConnected,
  rescheduleGCalEventIfConnected, getGCalOfflineQueue, retryGCalOfflineQueue, clearGCalOfflineQueue, removeGCalOfflineQueueItem,
  syncGCalNow, connectGCal, disconnectGCal, reconnectGCal,
  initGCalSync, toggleCalendarSelection
} from './data/google-calendar-sync.js';

// -- Features --
import { fetchWeather, detectUserLocation, initWeather, loadWeatherLocation, saveWeatherLocation } from './features/weather.js';

import {
  parsePrayer, calcPrayerScore, invalidateScoresCache,
  calculateScores, getLast30DaysData, getLast30DaysStats, getPersonalBests,
  loadWeights as loadWeightsFromScoring, loadMaxScores as loadMaxScoresFromScoring,
  updateWeight, resetWeights, updateMaxScore, resetMaxScores
} from './features/scoring.js';

import {
  createCategory, updateCategory, deleteCategory, getCategoryById,
  createLabel, updateLabel, deleteLabel, getLabelById,
  createPerson, updatePerson, deletePerson, getPersonById, getTasksByPerson
} from './features/categories.js';

import {
  createTask, updateTask, deleteTask, confirmDeleteTask,
  toggleTaskComplete, calculateNextRepeatDate, createNextRepeatOccurrence,
  getRepeatUnitLabel, updateRepeatUI, moveTaskTo
} from './features/tasks.js';

import {
  initializeTaskOrders, getFilteredTasks, groupTasksByDate,
  groupTasksByCompletionDate, getTasksByCategory, getTasksByLabel,
  getCurrentFilteredTasks, getCurrentViewInfo
} from './features/task-filter.js';

import {
  saveCollapsedNotes as saveCollapsedNotesFromNotes,
  toggleNoteCollapse, getNotesHierarchy, noteHasChildren, getNoteChildren,
  countAllDescendants, isDescendantOf, getNoteAncestors,
  indentNote, outdentNote, createRootNote, createNoteAfter, createChildNote,
  deleteNote, deleteNoteWithUndo, focusNote, handleNoteKeydown, handleNoteBlur, handleNoteFocus,
  handleNoteInput, removeNoteInlineMeta,
  initializeNoteOrders,
  zoomIntoNote, zoomOutOfNote, navigateToBreadcrumb, renderNotesBreadcrumb,
  handleNoteDragStart, handleNoteDragEnd, handleNoteDragOver,
  handleNoteDragLeave, handleNoteDrop, reorderNotes,
  renderNoteItem, renderNotesOutliner
} from './features/notes.js';

import {
  handleDragStart, handleDragEnd, handleDragOver, handleDragLeave,
  handleDrop, reorderTasks, normalizeTaskOrders, setupSidebarDragDrop
} from './features/drag-drop.js';

import { createPerspective, deletePerspective, editCustomPerspective } from './features/perspectives.js';

import {
  saveHomeWidgets as saveHomeWidgetsFromFeature,
  toggleWidgetVisibility, toggleWidgetSize,
  moveWidgetUp, moveWidgetDown,
  handleWidgetDragStart, handleWidgetDragEnd,
  handleWidgetDragOver, handleWidgetDragLeave, handleWidgetDrop,
  resetHomeWidgets, toggleEditHomeWidgets,
  addPerspectiveWidget, removePerspectiveWidget
} from './features/home-widgets.js';

import {
  calendarPrevMonth, calendarNextMonth, calendarGoToday,
  calendarSelectDate, getTasksForDate, setCalendarViewMode
} from './features/calendar.js';

import {
  startUndoCountdown, executeUndo, dismissUndo, renderUndoToastHtml
} from './features/undo.js';

import {
  parseBraindump, parseBraindumpHeuristic, submitBraindumpItems,
  getAnthropicKey, setAnthropicKey
} from './features/braindump.js';

// -- UI --
import { render, switchTab, switchSubTab, setToday, forceHardRefresh, dismissCacheRefreshPrompt } from './ui/render.js';
import { renderHomeTab, renderHomeWidget, homeQuickAddTask } from './ui/home.js';
import { renderTrackingTab } from './ui/tracking.js';
import { setBulkMonth, setBulkCategory, updateBulkData, updateBulkSummary, getDaysInMonth, renderBulkEntryTab } from './ui/bulk-entry.js';
import { renderTaskItem, buildAreaTaskListHtml, renderTasksTab } from './ui/tasks-tab.js';
import {
  renderCalendarView,
  openCalendarEventActions,
  closeCalendarEventActions,
  openCalendarMeetingNotes,
  closeCalendarMeetingNotes,
  setCalendarMeetingNotesScope,
  convertCalendarEventToTask,
  startCalendarEventDrag,
  clearCalendarEventDrag,
  dropCalendarEventToSlot,
  addMeetingLinkedItem,
  handleMeetingItemInputKeydown
} from './ui/calendar-view.js';
import { createPrayerInput, createToggle, createNumberInput, createCounter, createScoreCard, createCard } from './ui/input-builders.js';
import {
  openMobileDrawer, closeMobileDrawer, renderMobileDrawer, renderBottomNav,
  showCategoryTasks, showLabelTasks, showPerspectiveTasks, showPersonTasks, scrollToContent
} from './ui/mobile.js';

// -- Task Modal (includes inline autocomplete) --
import {
  startInlineEdit, saveInlineEdit, cancelInlineEdit, handleInlineEditKeydown,
  openNewTaskModal, quickAddTask, handleQuickAddKeydown,
  toggleInlineTagInput, addInlineTag, toggleInlinePersonInput, addInlinePerson,
  saveCategoryFromModal, saveLabelFromModal, savePersonFromModal,
  initModalState, setModalType, setModalStatus, toggleModalFlagged,
  updateDateDisplay, clearDateField, setQuickDate, openDatePicker,
  selectArea, renderAreaInput,
  addTag, removeTag, renderTagsInput,
  addPerson as addPersonModal, removePerson as removePersonModal, renderPeopleInput,
  toggleRepeat, initModalAutocomplete,
  closeTaskModal, saveTaskFromModal, savePerspectiveFromModal, selectPerspectiveEmoji,
  renderTaskModalHtml,
  renderPerspectiveModalHtml, renderCategoryModalHtml, renderLabelModalHtml, renderPersonModalHtml,
  parseDateQuery, setupInlineAutocomplete, renderInlineChips,
  removeInlineMeta, cleanupInlineAutocomplete
} from './ui/task-modal.js';

// -- Braindump UI --
import {
  openBraindump, closeBraindump, processBraindump, backToInput,
  toggleBraindumpItemType, toggleBraindumpItemInclude, removeBraindumpItem,
  editBraindumpItem, saveBraindumpItemEdit, cancelBraindumpItemEdit,
  setBraindumpItemArea, addBraindumpItemLabel, removeBraindumpItemLabel,
  addBraindumpItemPerson, removeBraindumpItemPerson,
  setBraindumpItemDate, clearBraindumpItemDate,
  submitBraindump, renderBraindumpOverlay, renderBraindumpFAB
} from './ui/braindump.js';

// -- Settings --
import { renderSettingsTab, createWeightInput } from './ui/settings.js';

// ============================================================================
// Assign ALL to window so onclick="functionName()" works from HTML strings
// ============================================================================

Object.assign(window, {
  // State (direct access for simple onclick property sets like editingTaskId=...)
  state,

  // Utils
  getLocalDateString, escapeHtml, fmt, formatSmartDate, generateTaskId,

  // Constants
  THINGS3_ICONS, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, defaultDayData,

  // Data / Storage
  saveData, getTodayData, updateData, saveTasksData,
  toggleDailyField, updateDailyField, saveViewState,
  saveWeights, saveMaxScores, saveHomeWidgets, saveCollapsedNotes,

  // GitHub Sync
  getGithubToken, setGithubToken, getTheme, setTheme,
  applyStoredTheme, getAccentColor, getThemeColors,
  updateSyncStatus, saveToGithub, debouncedSaveToGithub, loadCloudData,
  dismissConflictNotification, clearConflictNotifications,

  // Export/Import
  exportData, importData,

  // Firebase Auth
  signInWithGoogle, signOutUser, getCurrentUser, initAuth, signInWithGoogleCalendar,

  // Weather
  fetchWeather, detectUserLocation, initWeather, loadWeatherLocation, saveWeatherLocation,

  // WHOOP Sync
  getWhoopWorkerUrl, setWhoopWorkerUrl, getWhoopApiKey, setWhoopApiKey,
  getWhoopLastSync, isWhoopConnected, fetchWhoopData, syncWhoopNow,
  checkAndSyncWhoop, connectWhoop, disconnectWhoop, checkWhoopStatus, initWhoopSync,

  // Google Calendar Sync
  isGCalConnected, getSelectedCalendars, setSelectedCalendars,
  getTargetCalendar, setTargetCalendar, fetchCalendarList,
  getGCalEventsForDate, pushTaskToGCalIfConnected, deleteGCalEventIfConnected,
  rescheduleGCalEventIfConnected, getGCalOfflineQueue, retryGCalOfflineQueue, clearGCalOfflineQueue, removeGCalOfflineQueueItem,
  syncGCalNow, connectGCal, disconnectGCal, reconnectGCal,
  initGCalSync, toggleCalendarSelection,
  openCalendarEventActions, closeCalendarEventActions,
  openCalendarMeetingNotes, closeCalendarMeetingNotes, setCalendarMeetingNotesScope,
  convertCalendarEventToTask, startCalendarEventDrag, clearCalendarEventDrag, dropCalendarEventToSlot,
  addMeetingLinkedItem, handleMeetingItemInputKeydown,

  // Scoring
  parsePrayer, calcPrayerScore, invalidateScoresCache,
  calculateScores, getLast30DaysData, getLast30DaysStats, getPersonalBests,
  updateWeight, resetWeights, updateMaxScore, resetMaxScores,

  // Categories / Labels / People
  createCategory, updateCategory, deleteCategory, getCategoryById,
  createLabel, updateLabel, deleteLabel, getLabelById,
  createPerson, updatePerson, deletePerson, getPersonById, getTasksByPerson,

  // Tasks CRUD
  createTask, updateTask, deleteTask, confirmDeleteTask,
  toggleTaskComplete, calculateNextRepeatDate, createNextRepeatOccurrence,
  getRepeatUnitLabel, updateRepeatUI, moveTaskTo,

  // Task Filtering
  initializeTaskOrders, getFilteredTasks, groupTasksByDate,
  groupTasksByCompletionDate, getTasksByCategory, getTasksByLabel,
  getCurrentFilteredTasks, getCurrentViewInfo,

  // Notes
  toggleNoteCollapse, getNotesHierarchy, noteHasChildren, getNoteChildren,
  countAllDescendants, isDescendantOf, getNoteAncestors,
  indentNote, outdentNote, createRootNote, createNoteAfter, createChildNote,
  deleteNote, deleteNoteWithUndo, focusNote, handleNoteKeydown, handleNoteBlur, handleNoteFocus,
  handleNoteInput, removeNoteInlineMeta,
  initializeNoteOrders,
  zoomIntoNote, zoomOutOfNote, navigateToBreadcrumb, renderNotesBreadcrumb,
  handleNoteDragStart, handleNoteDragEnd, handleNoteDragOver,
  handleNoteDragLeave, handleNoteDrop, reorderNotes,
  renderNoteItem, renderNotesOutliner,

  // Drag & Drop
  handleDragStart, handleDragEnd, handleDragOver, handleDragLeave,
  handleDrop, reorderTasks, normalizeTaskOrders, setupSidebarDragDrop,

  // Perspectives
  createPerspective, deletePerspective, editCustomPerspective,

  // Home Widgets
  toggleWidgetVisibility, toggleWidgetSize,
  moveWidgetUp, moveWidgetDown,
  handleWidgetDragStart, handleWidgetDragEnd,
  handleWidgetDragOver, handleWidgetDragLeave, handleWidgetDrop,
  resetHomeWidgets, toggleEditHomeWidgets,
  addPerspectiveWidget, removePerspectiveWidget,

  // Calendar
  calendarPrevMonth, calendarNextMonth, calendarGoToday,
  calendarSelectDate, getTasksForDate, setCalendarViewMode,

  // Undo Toast
  startUndoCountdown, executeUndo, dismissUndo, renderUndoToastHtml,

  // Braindump
  parseBraindump, parseBraindumpHeuristic, submitBraindumpItems,
  getAnthropicKey, setAnthropicKey,
  openBraindump, closeBraindump, processBraindump, backToInput,
  toggleBraindumpItemType, toggleBraindumpItemInclude, removeBraindumpItem,
  editBraindumpItem, saveBraindumpItemEdit, cancelBraindumpItemEdit,
  setBraindumpItemArea, addBraindumpItemLabel, removeBraindumpItemLabel,
  addBraindumpItemPerson, removeBraindumpItemPerson,
  setBraindumpItemDate, clearBraindumpItemDate,
  submitBraindump, renderBraindumpOverlay, renderBraindumpFAB,

  // Main UI
  render, switchTab, switchSubTab, setToday, forceHardRefresh, dismissCacheRefreshPrompt,
  renderHomeTab, renderHomeWidget, homeQuickAddTask,
  renderTrackingTab,
  setBulkMonth, setBulkCategory, updateBulkData, updateBulkSummary, getDaysInMonth, renderBulkEntryTab,
  renderTaskItem, buildAreaTaskListHtml, renderTasksTab,
  renderCalendarView,
  createPrayerInput, createToggle, createNumberInput, createCounter, createScoreCard, createCard,
  renderSettingsTab, createWeightInput,

  // Mobile
  openMobileDrawer, closeMobileDrawer, renderMobileDrawer, renderBottomNav,
  showCategoryTasks, showLabelTasks, showPerspectiveTasks, showPersonTasks, scrollToContent,

  // Task Modal
  startInlineEdit, saveInlineEdit, cancelInlineEdit, handleInlineEditKeydown,
  openNewTaskModal, quickAddTask, handleQuickAddKeydown,
  toggleInlineTagInput, addInlineTag, toggleInlinePersonInput, addInlinePerson,
  saveCategoryFromModal, saveLabelFromModal, savePersonFromModal,
  initModalState, setModalType, setModalStatus, toggleModalFlagged,
  updateDateDisplay, clearDateField, setQuickDate, openDatePicker,
  selectArea, renderAreaInput,
  addTag, removeTag, renderTagsInput,
  addPersonModal, removePersonModal, renderPeopleInput,
  toggleRepeat, initModalAutocomplete,
  closeTaskModal, saveTaskFromModal, savePerspectiveFromModal, selectPerspectiveEmoji,
  renderTaskModalHtml,
  renderPerspectiveModalHtml, renderCategoryModalHtml, renderLabelModalHtml, renderPersonModalHtml,
  parseDateQuery, setupInlineAutocomplete, renderInlineChips,
  removeInlineMeta, cleanupInlineAutocomplete,
});

// Also expose state properties that are commonly set directly in onclick handlers
// (e.g., onclick="editingTaskId='abc'; showTaskModal=true; render()")
// These need to be on window as property accessors that proxy to state
const stateProxies = [
  'currentUser', 'authLoading', 'authError',
  'editingTaskId', 'editingCategoryId', 'editingLabelId', 'editingPersonId', 'editingPerspectiveId',
  'showTaskModal', 'showPerspectiveModal', 'showCategoryModal', 'showLabelModal', 'showPersonModal',
  'showInlineTagInput', 'showInlinePersonInput',
  'activePerspective', 'activeFilterType', 'activeCategoryFilter', 'activeLabelFilter', 'activePersonFilter',
  'editingHomeWidgets', 'showAddWidgetPicker', 'draggingWidgetId',
  'perspectiveEmojiPickerOpen', 'emojiSearchQuery',
  'editingNoteId', 'inlineEditingTaskId', 'quickAddIsNote',
  'mobileDrawerOpen', 'activeTab', 'activeSubTab',
  'modalSelectedArea', 'modalSelectedStatus', 'modalSelectedToday', 'modalSelectedFlagged', 'modalSelectedTags', 'modalSelectedPeople',
  'modalIsNote', 'modalRepeatEnabled', 'modalStateInitialized',
  'draggedTaskId', 'dragOverTaskId', 'dragPosition',
  'draggedSidebarItem', 'draggedSidebarType', 'sidebarDragPosition',
  'calendarMonth', 'calendarYear', 'calendarSelectedDate', 'calendarViewMode',
  'calendarEventModalOpen', 'calendarEventModalCalendarId', 'calendarEventModalEventId',
  'draggedCalendarEvent',
  'calendarMeetingNotesEventKey', 'calendarMeetingNotesScope', 'meetingNotesByEvent',
  'currentDate', 'bulkMonth', 'bulkYear', 'bulkCategory',
  'tasksData', 'taskCategories', 'taskLabels', 'taskPeople',
  'customPerspectives', 'homeWidgets', 'allData',
  'WEIGHTS', 'MAX_SCORES',
  'weatherData', 'weatherLocation',
  'syncStatus', 'lastSyncTime',
  'weekChart', 'breakdownChart',
  'collapsedNotes', 'newTaskContext',
  'zoomedNoteId', 'notesBreadcrumb',
  'draggedNoteId', 'dragOverNoteId', 'noteDragPosition',
  'inlineAutocompleteMeta',
  'undoAction', 'undoTimerRemaining', 'undoTimerId',
  'showBraindump', 'braindumpRawText', 'braindumpParsedItems', 'braindumpStep', 'braindumpEditingIndex', 'braindumpSuccessMessage', 'braindumpProcessing', 'braindumpAIError', 'braindumpFullPage',
  'gcalEvents', 'gcalCalendarList', 'gcalSyncing', 'gcalTokenExpired', 'gcalOfflineQueue',
  'conflictNotifications', 'renderPerf', 'showCacheRefreshPrompt', 'cacheRefreshPromptMessage',
];

stateProxies.forEach(prop => {
  if (window.hasOwnProperty(prop)) return; // Don't override functions already set
  Object.defineProperty(window, prop, {
    get() { return state[prop]; },
    set(v) { state[prop] = v; },
    configurable: true,
  });
});
