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
import { THINGS3_ICONS, GEIST_ICONS, getActiveIcons, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, defaultDayData } from './constants.js';

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
  getLibreWorkerUrl, setLibreWorkerUrl, getLibreApiKey, setLibreApiKey,
  getLibreLastSync, isLibreConnected, fetchLibreData, syncLibreNow,
  checkAndSyncLibre, connectLibre, disconnectLibre, checkLibreStatus, initLibreSync
} from './data/libre-sync.js';

import {
  isGCalConnected, getSelectedCalendars, setSelectedCalendars,
  getTargetCalendar, setTargetCalendar, fetchCalendarList,
  getGCalEventsForDate, pushTaskToGCalIfConnected, deleteGCalEventIfConnected,
  rescheduleGCalEventIfConnected, getGCalOfflineQueue, retryGCalOfflineQueue, clearGCalOfflineQueue, removeGCalOfflineQueueItem,
  syncGCalNow, connectGCal, disconnectGCal, reconnectGCal,
  initGCalSync, toggleCalendarSelection
} from './data/google-calendar-sync.js';
import {
  syncGoogleContactsNow, initGoogleContactsSync
} from './data/google-contacts-sync.js';
import {
  syncGSheetNow, initGSheetSync, askGSheet
} from './data/google-sheets-sync.js';

// -- Features --
import { fetchWeather, detectUserLocation, initWeather, loadWeatherLocation, saveWeatherLocation } from './features/weather.js';

import {
  parsePrayer, calcPrayerScore, invalidateScoresCache,
  calculateScores, getLast30DaysData, getLast30DaysStats, getPersonalBests,
  loadWeights as loadWeightsFromScoring, loadMaxScores as loadMaxScoresFromScoring,
  updateWeight, resetWeights, updateMaxScore, resetMaxScores,
  getScoreTier, getLevel, getLevelInfo, getStreakMultiplier,
  calculateDailyXP, updateStreak, awardDailyXP,
  checkAchievements, markAchievementNotified,
  getDailyFocus, processGamification,
  saveXP, saveStreak, saveAchievements, saveCategoryWeights,
  updateCategoryWeight, resetCategoryWeights, rebuildGamification
} from './features/scoring.js';

import {
  createArea, updateArea, deleteArea, getAreaById,
  createCategory, updateCategory, deleteCategory, getCategoryById, getCategoriesByArea,
  createLabel, updateLabel, deleteLabel, getLabelById,
  createPerson, updatePerson, deletePerson, getPersonById, getTasksByPerson
} from './features/areas.js';

import {
  createTask, updateTask, deleteTask, confirmDeleteTask,
  toggleTaskComplete, calculateNextRepeatDate, createNextRepeatOccurrence,
  getRepeatUnitLabel, updateRepeatUI, moveTaskTo
} from './features/tasks.js';

import {
  initializeTaskOrders, getFilteredTasks, groupTasksByDate,
  groupTasksByCompletionDate, getTasksByCategory, getTasksByLabel,
  getTasksBySubcategory, getCurrentFilteredTasks, getCurrentViewInfo
} from './features/task-filter.js';

import {
  saveCollapsedNotes as saveCollapsedNotesFromNotes,
  toggleNoteCollapse, getNotesHierarchy, noteHasChildren, getNoteChildren,
  countAllDescendants, isDescendantOf, getNoteAncestors,
  indentNote, outdentNote, createRootNote, createNoteAfter, createChildNote,
  deleteNote, deleteNoteWithUndo, focusNote, handleNoteKeydown, handleNoteBlur, handleNoteFocus,
  handleNoteInput, removeNoteInlineMeta,
  initializeNoteOrders,
  ensureNoteSafetyMetadata, getDeletedNotes, restoreDeletedNote, findNotesByText,
  getRecentNoteChanges, createNoteLocalBackup, runNoteIntegrityChecks,
  zoomIntoNote, zoomOutOfNote, navigateToBreadcrumb, renderNotesBreadcrumb,
  handleNoteDragStart, handleNoteDragEnd, handleNoteDragOver,
  handleNoteDragLeave, handleNoteDrop, reorderNotes,
  renderNoteItem, renderNotesOutliner
} from './features/notes.js';

import {
  handleDragStart, handleDragEnd, handleDragOver, handleDragLeave,
  handleDrop, reorderTasks, normalizeTaskOrders, setupSidebarDragDrop
} from './features/drag-drop.js';

import {
  createTrigger, createRootTrigger, createTriggerAfter, createChildTrigger,
  updateTrigger, deleteTrigger, indentTrigger, outdentTrigger,
  toggleTriggerCollapse, zoomIntoTrigger, zoomOutOfTrigger, navigateToTriggerBreadcrumb,
  handleTriggerKeydown, handleTriggerInput, handleTriggerBlur,
  handleTriggerDragStart, handleTriggerDragEnd, handleTriggerDragOver,
  handleTriggerDragLeave, handleTriggerDrop, reorderTriggers,
  renderTriggersBreadcrumb, renderTriggerItem, renderTriggersOutliner,
  getTriggerCountForArea
} from './features/triggers.js';

import {
  renderReviewMode, startReview, exitReview, reviewNextArea, reviewPrevArea,
  reviewEngageTask, reviewPassTask, reviewMarkAreaDone,
  getStaleTasksForArea, getTotalStaleTaskCount
} from './ui/review.js';

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
import { renderHomeTab, renderHomeWidget, homeQuickAddTask, handleGSheetSavePrompt, handleGSheetEditPrompt, handleGSheetCancelEdit, handleGSheetRefresh } from './ui/home.js';
import { renderTrackingTab } from './ui/tracking.js';
import { setBulkMonth, setBulkCategory, updateBulkData, updateBulkSummary, getDaysInMonth, renderBulkEntryTab } from './ui/bulk-entry.js';
import { renderTaskItem, buildAreaTaskListHtml, renderTasksTab } from './ui/tasks-tab.js';
import {
  renderCalendarView,
  openCalendarEventActions,
  closeCalendarEventActions,
  openCalendarMeetingNotes,
  openCalendarMeetingNotesByEventKey,
  openCalendarMeetingWorkspaceByEventKey,
  closeCalendarMeetingNotes,
  toggleCalendarMobilePanel,
  setCalendarMeetingNotesScope,
  addDiscussionItemToMeeting,
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
  showAreaTasks, showLabelTasks, showPerspectiveTasks, showPersonTasks, showCategoryTasks, scrollToContent,
  showAllLabelsPage, showAllPeoplePage,
  toggleSidebarAreaCollapse, toggleWorkspaceSidebar
} from './ui/mobile.js';

// -- Task Modal --
import {
  startInlineEdit, saveInlineEdit, cancelInlineEdit, handleInlineEditKeydown,
  openNewTaskModal, quickAddTask, handleQuickAddKeydown,
  toggleInlineTagInput, addInlineTag, toggleInlinePersonInput, addInlinePerson,
  initModalState, setModalType, setModalStatus, toggleModalFlagged,
  updateDateDisplay, clearDateField, setQuickDate, openDatePicker,
  selectArea, renderAreaInput,
  selectCategory, renderCategoryInput,
  addTag, removeTag, renderTagsInput,
  addPerson as addPersonModal, removePerson as removePersonModal, renderPeopleInput,
  toggleRepeat, initModalAutocomplete,
  closeTaskModal, saveTaskFromModal,
  renderTaskModalHtml
} from './ui/task-modal.js';

// -- Entity Modals (category, label, person, perspective) --
import {
  saveAreaFromModal, saveLabelFromModal, savePersonFromModal,
  saveCategoryFromModal,
  savePerspectiveFromModal, selectPerspectiveEmoji, selectAreaEmoji, selectCategoryEmoji,
  updateEmojiGrid,
  renderPerspectiveModalHtml, renderAreaModalHtml, renderCategoryModalHtml, renderLabelModalHtml, renderPersonModalHtml
} from './ui/entity-modals.js';

// -- Inline Autocomplete (Todoist-style #, @, &, !) --
import {
  parseDateQuery, setupInlineAutocomplete, renderInlineChips,
  removeInlineMeta, cleanupInlineAutocomplete
} from './features/inline-autocomplete.js';

// -- Braindump UI --
import {
  openBraindump, closeBraindump, processBraindump, backToInput,
  startBraindumpVoiceCapture, stopBraindumpVoiceCapture, toggleBraindumpVoiceCapture,
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
  THINGS3_ICONS, GEIST_ICONS, getActiveIcons, BUILTIN_PERSPECTIVES, NOTES_PERSPECTIVE, defaultDayData,

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

  // Libre CGM Sync
  getLibreWorkerUrl, setLibreWorkerUrl, getLibreApiKey, setLibreApiKey,
  getLibreLastSync, isLibreConnected, fetchLibreData, syncLibreNow,
  checkAndSyncLibre, connectLibre, disconnectLibre, checkLibreStatus, initLibreSync,

  // Google Calendar Sync
  isGCalConnected, getSelectedCalendars, setSelectedCalendars,
  getTargetCalendar, setTargetCalendar, fetchCalendarList,
  getGCalEventsForDate, pushTaskToGCalIfConnected, deleteGCalEventIfConnected,
  rescheduleGCalEventIfConnected, getGCalOfflineQueue, retryGCalOfflineQueue, clearGCalOfflineQueue, removeGCalOfflineQueueItem,
  syncGCalNow, connectGCal, disconnectGCal, reconnectGCal,
  initGCalSync, toggleCalendarSelection,
  syncGoogleContactsNow, initGoogleContactsSync,
  syncGSheetNow, initGSheetSync, askGSheet,
  openCalendarEventActions, closeCalendarEventActions,
  openCalendarMeetingNotes, openCalendarMeetingNotesByEventKey, openCalendarMeetingWorkspaceByEventKey, closeCalendarMeetingNotes, setCalendarMeetingNotesScope,
  addDiscussionItemToMeeting,
  toggleCalendarMobilePanel,
  convertCalendarEventToTask, startCalendarEventDrag, clearCalendarEventDrag, dropCalendarEventToSlot,
  addMeetingLinkedItem, handleMeetingItemInputKeydown,

  // Scoring
  parsePrayer, calcPrayerScore, invalidateScoresCache,
  calculateScores, getLast30DaysData, getLast30DaysStats, getPersonalBests,
  updateWeight, resetWeights, updateMaxScore, resetMaxScores,
  // Gamification
  getScoreTier, getLevel, getLevelInfo, getStreakMultiplier,
  calculateDailyXP, updateStreak, awardDailyXP,
  checkAchievements, markAchievementNotified,
  getDailyFocus, processGamification,
  saveXP, saveStreak, saveAchievements, saveCategoryWeights,
  updateCategoryWeight, resetCategoryWeights, rebuildGamification,

  // Areas / Labels / People
  createArea, updateArea, deleteArea, getAreaById,
  createCategory, updateCategory, deleteCategory, getCategoryById, getCategoriesByArea,
  createLabel, updateLabel, deleteLabel, getLabelById,
  createPerson, updatePerson, deletePerson, getPersonById, getTasksByPerson,

  // Tasks CRUD
  createTask, updateTask, deleteTask, confirmDeleteTask,
  toggleTaskComplete, calculateNextRepeatDate, createNextRepeatOccurrence,
  getRepeatUnitLabel, updateRepeatUI, moveTaskTo,

  // Task Filtering
  initializeTaskOrders, getFilteredTasks, groupTasksByDate,
  groupTasksByCompletionDate, getTasksByCategory, getTasksByLabel,
  getTasksBySubcategory, getCurrentFilteredTasks, getCurrentViewInfo,

  // Notes
  toggleNoteCollapse, getNotesHierarchy, noteHasChildren, getNoteChildren,
  countAllDescendants, isDescendantOf, getNoteAncestors,
  indentNote, outdentNote, createRootNote, createNoteAfter, createChildNote,
  deleteNote, deleteNoteWithUndo, focusNote, handleNoteKeydown, handleNoteBlur, handleNoteFocus,
  handleNoteInput, removeNoteInlineMeta,
  initializeNoteOrders,
  ensureNoteSafetyMetadata, getDeletedNotes, restoreDeletedNote, findNotesByText,
  getRecentNoteChanges, createNoteLocalBackup, runNoteIntegrityChecks,
  zoomIntoNote, zoomOutOfNote, navigateToBreadcrumb, renderNotesBreadcrumb,
  handleNoteDragStart, handleNoteDragEnd, handleNoteDragOver,
  handleNoteDragLeave, handleNoteDrop, reorderNotes,
  renderNoteItem, renderNotesOutliner,

  // Drag & Drop
  handleDragStart, handleDragEnd, handleDragOver, handleDragLeave,
  handleDrop, reorderTasks, normalizeTaskOrders, setupSidebarDragDrop,

  // Triggers
  createTrigger, createRootTrigger, createTriggerAfter, createChildTrigger,
  updateTrigger, deleteTrigger, indentTrigger, outdentTrigger,
  toggleTriggerCollapse, zoomIntoTrigger, zoomOutOfTrigger, navigateToTriggerBreadcrumb,
  handleTriggerKeydown, handleTriggerInput, handleTriggerBlur,
  handleTriggerDragStart, handleTriggerDragEnd, handleTriggerDragOver,
  handleTriggerDragLeave, handleTriggerDrop, reorderTriggers,
  renderTriggersBreadcrumb, renderTriggerItem, renderTriggersOutliner,
  getTriggerCountForArea,

  // Review Mode
  renderReviewMode, startReview, exitReview, reviewNextArea, reviewPrevArea,
  reviewEngageTask, reviewPassTask, reviewMarkAreaDone,
  getStaleTasksForArea, getTotalStaleTaskCount,

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
  startBraindumpVoiceCapture, stopBraindumpVoiceCapture, toggleBraindumpVoiceCapture,
  toggleBraindumpItemType, toggleBraindumpItemInclude, removeBraindumpItem,
  editBraindumpItem, saveBraindumpItemEdit, cancelBraindumpItemEdit,
  setBraindumpItemArea, addBraindumpItemLabel, removeBraindumpItemLabel,
  addBraindumpItemPerson, removeBraindumpItemPerson,
  setBraindumpItemDate, clearBraindumpItemDate,
  submitBraindump, renderBraindumpOverlay, renderBraindumpFAB,

  // Main UI
  render, switchTab, switchSubTab, setToday, forceHardRefresh, dismissCacheRefreshPrompt,
  renderHomeTab, renderHomeWidget, homeQuickAddTask, handleGSheetSavePrompt, handleGSheetEditPrompt, handleGSheetCancelEdit, handleGSheetRefresh,
  renderTrackingTab,
  setBulkMonth, setBulkCategory, updateBulkData, updateBulkSummary, getDaysInMonth, renderBulkEntryTab,
  renderTaskItem, buildAreaTaskListHtml, renderTasksTab,
  renderCalendarView,
  createPrayerInput, createToggle, createNumberInput, createCounter, createScoreCard, createCard,
  renderSettingsTab, createWeightInput,

  // Mobile
  openMobileDrawer, closeMobileDrawer, renderMobileDrawer, renderBottomNav,
  showAreaTasks, showLabelTasks, showPerspectiveTasks, showPersonTasks, showCategoryTasks, scrollToContent,
  showAllLabelsPage, showAllPeoplePage,
  toggleSidebarAreaCollapse, toggleWorkspaceSidebar,

  // Task Modal
  startInlineEdit, saveInlineEdit, cancelInlineEdit, handleInlineEditKeydown,
  openNewTaskModal, quickAddTask, handleQuickAddKeydown,
  toggleInlineTagInput, addInlineTag, toggleInlinePersonInput, addInlinePerson,
  saveAreaFromModal, saveLabelFromModal, savePersonFromModal, saveCategoryFromModal,
  initModalState, setModalType, setModalStatus, toggleModalFlagged,
  updateDateDisplay, clearDateField, setQuickDate, openDatePicker,
  selectArea, renderAreaInput,
  selectCategory, renderCategoryInput,
  addTag, removeTag, renderTagsInput,
  addPersonModal, removePersonModal, renderPeopleInput,
  toggleRepeat, initModalAutocomplete,
  closeTaskModal, saveTaskFromModal, savePerspectiveFromModal, selectPerspectiveEmoji, selectAreaEmoji, selectCategoryEmoji, updateEmojiGrid,
  renderTaskModalHtml,
  renderPerspectiveModalHtml, renderAreaModalHtml, renderCategoryModalHtml, renderLabelModalHtml, renderPersonModalHtml,
  parseDateQuery, setupInlineAutocomplete, renderInlineChips,
  removeInlineMeta, cleanupInlineAutocomplete,
});

// Also expose state properties that are commonly set directly in onclick handlers
// (e.g., onclick="editingTaskId='abc'; showTaskModal=true; render()")
// These need to be on window as property accessors that proxy to state
const stateProxies = [
  'currentUser', 'authLoading', 'authError',
  'editingTaskId', 'editingAreaId', 'editingLabelId', 'editingPersonId', 'editingPerspectiveId',
  'showTaskModal', 'showPerspectiveModal', 'showAreaModal', 'showLabelModal', 'showPersonModal',
  'showInlineTagInput', 'showInlinePersonInput',
  'activePerspective', 'activeFilterType', 'activeAreaFilter', 'activeLabelFilter', 'activePersonFilter',
  'editingHomeWidgets', 'showAddWidgetPicker', 'draggingWidgetId',
  'perspectiveEmojiPickerOpen', 'areaEmojiPickerOpen', 'categoryEmojiPickerOpen', 'emojiSearchQuery',
  'editingNoteId', 'inlineEditingTaskId', 'quickAddIsNote', 'showAllSidebarPeople', 'showAllSidebarLabels',
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
  'tasksData', 'taskAreas', 'taskLabels', 'taskPeople', 'taskCategories',
  'showCategoryModal', 'editingCategoryId', 'activeCategoryFilter', 'modalSelectedCategory',
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
  'showBraindump', 'braindumpRawText', 'braindumpParsedItems', 'braindumpStep', 'braindumpEditingIndex', 'braindumpSuccessMessage', 'braindumpProcessing', 'braindumpAIError', 'braindumpFullPage', 'braindumpVoiceRecording', 'braindumpVoiceTranscribing', 'braindumpVoiceError',
  'gcalEvents', 'gcalCalendarList', 'gcalSyncing', 'gcalTokenExpired', 'gcalOfflineQueue',
  'conflictNotifications', 'renderPerf', 'showCacheRefreshPrompt', 'cacheRefreshPromptMessage',
  'CATEGORY_WEIGHTS', 'xp', 'streak', 'achievements', 'dailyFocusDismissed',
  'gsheetData', 'gsheetSyncing', 'gsheetError', 'gsheetPrompt', 'gsheetResponse', 'gsheetAsking', 'gsheetEditingPrompt',
  'triggers', 'editingTriggerId', 'collapsedTriggers', 'zoomedTriggerId', 'triggersBreadcrumb',
  'reviewMode', 'reviewAreaIndex', 'reviewCompletedAreas',
];

stateProxies.forEach(prop => {
  if (window.hasOwnProperty(prop)) return; // Don't override functions already set
  Object.defineProperty(window, prop, {
    get() { return state[prop]; },
    set(v) { state[prop] = v; },
    configurable: true,
  });
});
