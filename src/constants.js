// ============================================================================
// CONSTANTS MODULE
// ============================================================================
// All immutable constants extracted from index.html for modular architecture.
// These are pure data with no side effects or state dependencies.

// App Version (MAJOR.MINOR.PATCH)
// MAJOR: New major features (Home view, Next perspective, etc.)
// MINOR: Enhancements and improvements
// PATCH: Bug fixes and small tweaks
export const APP_VERSION = '4.51.0 - Homebase';

export const STORAGE_KEY = 'lifeGamificationData_v3';
export const WEIGHTS_KEY = 'lifeGamificationWeights_v1';
export const GITHUB_TOKEN_KEY = 'lifeGamificationGithubToken';
export const THEME_KEY = 'lifeGamificationTheme';
export const COLOR_MODE_KEY = 'lifeGamificationColorMode';
export const ANTHROPIC_KEY = 'lifeGamificationAnthropicKey';
export const DATA_URL = 'data.json';

// Available themes
export const THEMES = {
  simplebits: { name: 'SimpleBits', description: 'Warm cream tones with coral accents' },
  things3: { name: 'Things 3', description: 'Clean white with blue accents' },
  geist: { name: 'Geist', description: 'Vercel-inspired monochrome with sharp edges' }
};

// GitHub repo config
export const GITHUB_OWNER = 'mhabib306-sys';
export const GITHUB_REPO = 'lifeg';
export const GITHUB_FILE_PATH = 'data.json';

export const WEATHER_CACHE_KEY = 'nucleusWeatherCache';
export const WEATHER_LOCATION_KEY = 'nucleusWeatherLocation';

// Weather icons (Things 3 style - minimal, clean)
export const WEATHER_ICONS = {
  0: '\u2600\uFE0F',  // Clear sky
  1: '\uD83C\uDF24\uFE0F',  // Mainly clear
  2: '\u26C5',  // Partly cloudy
  3: '\u2601\uFE0F',  // Overcast
  45: '\uD83C\uDF2B\uFE0F', // Fog
  48: '\uD83C\uDF2B\uFE0F', // Depositing rime fog
  51: '\uD83C\uDF27\uFE0F', // Light drizzle
  53: '\uD83C\uDF27\uFE0F', // Moderate drizzle
  55: '\uD83C\uDF27\uFE0F', // Dense drizzle
  61: '\uD83C\uDF27\uFE0F', // Slight rain
  63: '\uD83C\uDF27\uFE0F', // Moderate rain
  65: '\uD83C\uDF27\uFE0F', // Heavy rain
  71: '\uD83C\uDF28\uFE0F', // Slight snow
  73: '\uD83C\uDF28\uFE0F', // Moderate snow
  75: '\u2744\uFE0F',  // Heavy snow
  77: '\uD83C\uDF28\uFE0F', // Snow grains
  80: '\uD83C\uDF26\uFE0F', // Slight rain showers
  81: '\uD83C\uDF26\uFE0F', // Moderate rain showers
  82: '\u26C8\uFE0F',  // Violent rain showers
  85: '\uD83C\uDF28\uFE0F', // Slight snow showers
  86: '\uD83C\uDF28\uFE0F', // Heavy snow showers
  95: '\u26C8\uFE0F',  // Thunderstorm
  96: '\u26C8\uFE0F',  // Thunderstorm with hail
  99: '\u26C8\uFE0F',  // Thunderstorm with heavy hail
};

export const WEATHER_DESCRIPTIONS = {
  0: 'Clear',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Cloudy',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Light Showers',
  81: 'Showers',
  82: 'Heavy Showers',
  85: 'Light Snow Showers',
  86: 'Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Severe Storm',
};

export const TASKS_KEY = 'lifeGamificationTasks';
export const PERSPECTIVES_KEY = 'lifeGamificationPerspectives';
export const TASK_CATEGORIES_KEY = 'lifeGamificationTaskCategories';
export const TASK_LABELS_KEY = 'lifeGamificationTaskLabels';
export const TASK_PEOPLE_KEY = 'lifeGamificationTaskPeople';
export const CATEGORIES_KEY = 'lifeGamificationCategories';
export const HOME_WIDGETS_KEY = 'lifeGamificationHomeWidgets';
export const VIEW_STATE_KEY = 'lifeGamificationViewState';
export const DELETED_TASK_TOMBSTONES_KEY = 'lifeGamificationDeletedTaskTombstones';
export const DELETED_ENTITY_TOMBSTONES_KEY = 'lifeGamificationDeletedEntityTombstones';

// Google Calendar integration
export const GCAL_ACCESS_TOKEN_KEY = 'nucleusGCalAccessToken';
export const GCAL_TOKEN_TIMESTAMP_KEY = 'nucleusGCalTokenTimestamp';
export const GCAL_SELECTED_CALENDARS_KEY = 'nucleusGCalSelectedCalendars';
export const GCAL_TARGET_CALENDAR_KEY = 'nucleusGCalTargetCalendar';
export const GCAL_EVENTS_CACHE_KEY = 'nucleusGCalEventsCache';
export const GCAL_LAST_SYNC_KEY = 'nucleusGCalLastSync';
export const GCAL_CONNECTED_KEY = 'nucleusGCalConnected';
export const GCAL_OFFLINE_QUEUE_KEY = 'nucleusGCalOfflineQueue';
export const GCONTACTS_SYNC_TOKEN_KEY = 'nucleusGoogleContactsSyncToken';
export const GCONTACTS_LAST_SYNC_KEY = 'nucleusGoogleContactsLastSync';
export const MEETING_NOTES_KEY = 'nucleusMeetingNotes';
export const TRIGGERS_KEY = 'lifeGamificationTriggers';
export const COLLAPSED_TRIGGERS_KEY = 'lifeGamificationCollapsedTriggers';

// Credentials to sync across devices (encrypted in data.json)
export const CRED_SYNC_KEYS = [
  { localStorage: 'lifeGamificationAnthropicKey', id: 'anthropicKey' },
  { localStorage: 'nucleusWhoopWorkerUrl', id: 'whoopWorkerUrl' },
  { localStorage: 'nucleusWhoopApiKey', id: 'whoopApiKey' },
  { localStorage: 'nucleusLibreWorkerUrl', id: 'libreWorkerUrl' },
  { localStorage: 'nucleusLibreApiKey', id: 'libreApiKey' },
];

// Google Sheets integration
export const GSHEET_SPREADSHEET_ID = '14TjFIFtzMPcHgxr1NAtdfrYNmgFRz53XpmYwPQpeA_U';
export const GSHEET_TAB_GID = 1119187551;
export const GSHEET_CACHE_KEY = 'nucleusGSheetYesterdayCache';
export const GSHEET_LAST_SYNC_KEY = 'nucleusGSheetLastSync';
export const GSHEET_SAVED_PROMPT_KEY = 'nucleusGSheetSavedPrompt';
export const GSHEET_RESPONSE_CACHE_KEY = 'nucleusGSheetResponseCache';
export const CONFLICT_NOTIFICATIONS_KEY = 'nucleusConflictNotifications';
export const APP_VERSION_SEEN_KEY = 'nucleusAppVersionSeen';
export const NOTE_INTEGRITY_SNAPSHOT_KEY = 'nucleusNoteIntegritySnapshot';
export const NOTE_LOCAL_BACKUP_KEY = 'nucleusNoteLocalBackup';

// Shared keys
export const LAST_UPDATED_KEY = 'lastUpdated';
export const COLLAPSED_NOTES_KEY = 'collapsedNotes';
export const GITHUB_SYNC_DIRTY_KEY = 'nucleusGithubSyncDirty';
export const SYNC_HEALTH_KEY = 'nucleusSyncHealth';
export const SYNC_SEQUENCE_KEY = 'nucleusSyncSequence';
export const CLOUD_SCHEMA_VERSION = 1;

// localStorage key prefix convention:
// - lifeGamification* — app data (tasks, scores, settings, XP, streaks, etc.)
// - nucleus*          — integration/sync keys (GCal, GSheet, weather, contacts, WHOOP, etc.)
// - collapsedNotes, lastUpdated — legacy unprefixed keys (kept for backward compat)

// Default home widgets configuration
export const DEFAULT_HOME_WIDGETS = [
  { id: 'quick-stats', type: 'stats', title: 'Quick Stats', size: 'full', order: 0, visible: true },
  { id: 'quick-add', type: 'quick-add', title: 'Quick Add Task', size: 'full', order: 1, visible: true },
  { id: 'weather', type: 'weather', title: 'Weather', size: 'half', order: 2, visible: true },
  { id: 'todays-score', type: 'score', title: "Today's Score", size: 'half', order: 3, visible: true },
  { id: 'today-tasks', type: 'today-tasks', title: 'Today', size: 'half', order: 4, visible: true },
  { id: 'today-events', type: 'today-events', title: "Today's Events", size: 'half', order: 5, visible: true },
  { id: 'next-tasks', type: 'next-tasks', title: 'Next', size: 'half', order: 6, visible: true },
  { id: 'prayers', type: 'prayers', title: 'Prayers', size: 'half', order: 7, visible: true },
  { id: 'glucose', type: 'glucose', title: 'Glucose', size: 'half', order: 8, visible: true },
  { id: 'whoop', type: 'whoop', title: 'Whoop', size: 'half', order: 9, visible: true },
  { id: 'habits', type: 'habits', title: 'Habits', size: 'half', order: 10, visible: true },
  { id: 'gsheet-yesterday', type: 'gsheet-yesterday', title: 'Yesterday', size: 'half', order: 11, visible: true }
];

// Default areas
export const DEFAULT_TASK_AREAS = [
  { id: 'personal', name: 'Personal', color: '#4A90A4' },
  { id: 'work', name: 'Work', color: '#6B8E5A' },
  { id: 'health', name: 'Health', color: '#E5533D' },
  { id: 'family', name: 'Family', color: '#C4943D' },
  { id: 'learning', name: 'Learning', color: '#7C6B8E' }
];

// Default labels (Tags)
export const DEFAULT_TASK_LABELS = [
  { id: 'next', name: 'Next', color: '#8B5CF6' },
  { id: 'urgent', name: 'Urgent', color: '#DC2626' },
  { id: 'quick', name: 'Quick Win', color: '#16A34A' },
  { id: 'waiting', name: 'Waiting', color: '#CA8A04' },
  { id: 'blocked', name: 'Blocked', color: '#6B7280' }
];

// Default people
export const DEFAULT_TASK_PEOPLE = [
  { id: 'self', name: 'Self', color: '#4A90A4', email: '' }
];

// Things 3 exact SVG icons (filled style matching the app)
export const THINGS3_ICONS = {
  // Home - thin outline to match other nav icons
  home: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6.5 10.5V20h11V10.5"/><path d="M10 20v-5h4v5"/></svg>`,
  // Inbox - Things 3 style: document tray with curved bottom
  inbox: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 10v4h16v-4h-4a4 4 0 01-8 0H4z"/></svg>`,
  // Today - Things 3 style: filled 5-point star
  today: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.94 5.95 6.57.96-4.76 4.63 1.12 6.56L12 17.27l-5.87 3.09 1.12-6.56-4.76-4.63 6.57-.96z"/></svg>`,
  // Flagged - OmniFocus style: simple flag
  flagged: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h2v2h8l-1 3 3 3H8v10H6V2z"/></svg>`,
  // Upcoming - Things 3 style: calendar with date marker
  upcoming: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><rect x="7" y="11" width="3" height="3" rx="0.5"/></svg>`,
  // Anytime - Things 3 style: 3 horizontal bars stacked
  anytime: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></svg>`,
  // Someday - Things 3 style: archive box
  someday: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v4H3V3zm1 5h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm5 3v2h6v-2H9z"/></svg>`,
  // Logbook - Things 3 style: square with checkmark
  logbook: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6.7 11.3l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z"/></svg>`,
  // Trash - gray trash can
  trash: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
  // Area - stacked layers: three diamond tiers (distinct from category folder)
  area: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>`,
  // Next - Things 3/OmniFocus style: play button in circle
  next: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>`,
  // Notes - Things 3 style: filled note/document with fold and text rows
  notes: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v5h5" fill="white" opacity="0.95"/><rect x="8.5" y="11" width="7.5" height="1.7" rx="0.85" fill="white"/><rect x="8.5" y="14.7" width="7.5" height="1.7" rx="0.85" fill="white"/><rect x="8.5" y="18.4" width="5" height="1.6" rx="0.8" fill="white"/></svg>`,
  // Calendar - OmniFocus Forecast style: calendar with grid dots
  calendar: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><circle cx="8" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="16" cy="12" r="1.2"/><circle cx="8" cy="16" r="1.2"/><circle cx="12" cy="16" r="1.2"/><circle cx="16" cy="16" r="1.2"/></svg>`,
  // Tab icons - Things 3 style
  lifeScore: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>`,
  workspace: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v16h12V4H6zm2 3h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>`,
  settings: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.61 3.61 0 0112 15.6z"/></svg>`,
  // Trigger - lightning bolt for GTD trigger lists
  trigger: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  // Review - circular arrows for weekly review
  review: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`
};

// Geist Design System icons — stroke-based, 1.5px weight, round caps/joins
// Used when data-theme="geist" is active.
export const GEIST_ICONS = {
  home: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  inbox: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
  today: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  flagged: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  upcoming: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  anytime: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  someday: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
  logbook: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  trash: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
  area: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  next: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  notes: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7z"/><path d="M14 2v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>`,
  calendar: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/></svg>`,
  lifeScore: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  workspace: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  settings: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.6.77 1.05 1.38 1.14l.13.01H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  trigger: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  review: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`
};

/**
 * Get the active icon set based on the current theme.
 * Returns GEIST_ICONS when geist theme is active, THINGS3_ICONS otherwise.
 * Safe to call anywhere — reads directly from localStorage (no circular deps).
 */
export function getActiveIcons() {
  const theme = localStorage.getItem(THEME_KEY) || 'things3';
  return theme === 'geist' ? GEIST_ICONS : THINGS3_ICONS;
}

/**
 * BUILTIN PERSPECTIVES - Things 3 style task views
 *
 * PERSPECTIVE OBJECT STRUCTURE:
 * @typedef {Object} Perspective
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} icon - SVG icon markup
 * @property {string} color - Brand color (hex)
 * @property {Object} filter - Filter rules for getFilteredTasks()
 * @property {boolean} builtin - True = cannot be deleted
 *
 * FILTER LOGIC (implemented in getFilteredTasks):
 * - inbox: status='inbox' AND no categoryId (unprocessed items)
 * - today: today=true OR dueToday OR overdue OR scheduled for today
 * - flagged: flagged=true (OmniFocus-style flag)
 * - upcoming: has future dueDate
 * - anytime: status='anytime' (no deadline, available now)
 * - someday: status='someday' (on hold for later)
 * - logbook: completed=true (all completed items)
 */
// BUILTIN_PERSPECTIVES and NOTES_PERSPECTIVE are now getters so icons resolve
// to the active theme's icon set (THINGS3_ICONS or GEIST_ICONS) at render time.
export function getBuiltinPerspectives() {
  const icons = getActiveIcons();
  return [
    { id: 'inbox', name: 'Inbox', icon: icons.inbox, color: _css('--inbox-color') || '#147EFB', filter: { status: 'inbox' }, builtin: true },
    { id: 'today', name: 'Today', icon: icons.today, color: _css('--today-color') || '#FFCC00', filter: { today: true }, builtin: true },
    { id: 'flagged', name: 'Flagged', icon: icons.flagged, color: _css('--flagged-color') || '#FF9500', filter: { flagged: true }, builtin: true },
    { id: 'upcoming', name: 'Upcoming', icon: icons.upcoming, color: _css('--upcoming-color') || '#FF3B30', filter: { upcoming: true }, builtin: true },
    { id: 'anytime', name: 'Anytime', icon: icons.anytime, color: _css('--anytime-color') || '#5AC8FA', filter: { status: 'anytime' }, builtin: true },
    { id: 'someday', name: 'Someday', icon: icons.someday, color: _css('--someday-color') || '#C69C6D', filter: { status: 'someday' }, builtin: true },
    { id: 'logbook', name: 'Logbook', icon: icons.logbook, color: _css('--logbook-color') || '#34C759', filter: { completed: true }, builtin: true }
  ];
}
// Backwards-compat: modules that read BUILTIN_PERSPECTIVES as a constant get
// a live Proxy that delegates to the function so existing .map/.find/etc. work.
export const BUILTIN_PERSPECTIVES = new Proxy([], {
  get(_, prop) {
    const arr = getBuiltinPerspectives();
    const val = arr[prop];
    return typeof val === 'function' ? val.bind(arr) : val;
  }
});

export function getNotesPerspective() {
  const icons = getActiveIcons();
  return { id: 'notes', name: 'Notes', icon: icons.notes, color: _css('--notes-color') || '#5856D6', filter: { notes: true }, builtin: true };
}
// Backwards-compat: constant reads resolve at access time via Proxy.
export const NOTES_PERSPECTIVE = new Proxy({}, {
  get(_, prop) { return getNotesPerspective()[prop]; }
});

// Things 3 curated area colors — 32 colors in 4 rows of 8
export const THINGS3_AREA_COLORS = [
  // Row 1: Blues & Teals
  '#147EFB', '#5AC8FA', '#34AADC', '#007AFF', '#4A90D9', '#5856D6', '#2E6B9E', '#1B3A5C',
  // Row 2: Greens & Yellows
  '#34C759', '#30B94E', '#4CD964', '#8CC63F', '#FFCC00', '#FF9500', '#FF9F0A', '#FFD60A',
  // Row 3: Reds, Pinks & Purples
  '#FF3B30', '#FF6482', '#FF2D55', '#E85D75', '#AF52DE', '#BF5AF2', '#9B59B6', '#7B68EE',
  // Row 4: Neutrals & Earth tones
  '#C69C6D', '#A2845E', '#8E8E93', '#636366', '#48484A', '#3A3A3C', '#6E6E73', '#86868B',
];

export const defaultDayData = {
  prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
  glucose: { avg: '', tir: '', insulin: '' },
  whoop: {
    sleepPerf: '', recovery: '', strain: '', whoopAge: ''
  },
  libre: { currentGlucose: '', trend: '', readingsCount: 0, lastReading: '' },
  family: { mom: false, dad: false, jana: false, tia: false, ahmed: false, eman: false },
  habits: { exercise: 0, reading: 0, meditation: 0, water: '', vitamins: false, brushTeeth: 0, nop: '' }
};

// Consistent scoring framework - base unit = 5 pts
// Target daily max ~100 pts: Prayer 30, Diabetes 25, Whoop 25, Habits 15, Family 5
export const DEFAULT_WEIGHTS = {
  // PRAYER (max 30): 5 prayers x 5 pts + quran bonus
  prayer: { onTime: 5, late: 2, quran: 5 },

  // DIABETES (max 25): avg 10 + tir 10 + insulin 5
  glucose: { avgMax: 10, tirPerPoint: 0.1, insulinBase: 5, insulinPenalty: -5, insulinThreshold: 40 },

  // FAMILY (max 5): 6 members, ~1 pt each, cap at 5
  family: { mom: 1, dad: 1, jana: 1, tia: 1, ahmed: 1, eman: 1 },

  // HABITS (max 15): distributed across daily habits
  habits: { exercise: 3, reading: 2, meditation: 2, water: 1, vitamins: 2, brushTeeth: 1, nopYes: 2, nopNo: -2 },

  // WHOOP (max 14): Sleep Perf + Recovery + Strain
  whoop: {
    sleepPerfHigh: 7, sleepPerfMid: 4, sleepPerfLow: 2,
    recoveryHigh: 2, recoveryMid: 1, recoveryLow: 0,
    strainMatch: 3, strainHigh: 2
  }
};

// Max scores for progress bars (what a perfect day looks like)
// These are configurable in settings
export const DEFAULT_MAX_SCORES = {
  prayer: 35,    // 5 prayers on-time (25) + 2 quran pages (10)
  diabetes: 25,  // avg 105 (10) + TIR 100% (10) + insulin <=40 (5)
  whoop: 14,     // sleepPerf(7)+recovery(2)+strain(5)
  family: 6,     // all 6 family members checked
  habits: 16,    // exercise(3)+reading(2)+meditation(2)+water 2.5L(2.5)+vitamins(2)+brush 2x(2)+nop(2)
  total: 96      // sum of all maxes
};

export const MAX_SCORES_KEY = 'lifeGamificationMaxScores';

// Gamification keys
export const XP_KEY = 'lifeGamificationXP';
export const STREAK_KEY = 'lifeGamificationStreak';
export const ACHIEVEMENTS_KEY = 'lifeGamificationAchievements';
export const CATEGORY_WEIGHTS_KEY = 'lifeGamificationCategoryWeights';

// Category weights for normalized scoring (sum to 100)
export const DEFAULT_CATEGORY_WEIGHTS = {
  prayer: 20,
  diabetes: 20,
  whoop: 20,
  family: 20,
  habits: 20
};

// XP Level thresholds (logarithmic curve)
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,     // 1-10
  4000, 4900, 5900, 7000, 8200, 9500, 10900, 12400, 14000, 15700, // 11-20
  17500, 19400, 21400, 23500, 25700, 28000, 30400, 32900, 35500, 38200, // 21-30
  41000, 44000, 47200, 50600, 54200, 58000, 62000, 66200, 70600, 75200, // 31-40
  80000, 85000, 90200, 95600, 101200, 107000, 113000, 119200, 125600, 132200 // 41-50
];

// Level tier names
export const LEVEL_TIERS = [
  { min: 1, max: 4, name: 'Spark', icon: '✨' },
  { min: 5, max: 9, name: 'Ember', icon: '🔥' },
  { min: 10, max: 14, name: 'Flame', icon: '🔥' },
  { min: 15, max: 19, name: 'Blaze', icon: '🔥' },
  { min: 20, max: 24, name: 'Inferno', icon: '🔥' },
  { min: 25, max: 999, name: 'Phoenix', icon: '🔥' }
];

// Streak multiplier thresholds
export const STREAK_MULTIPLIERS = [
  { min: 1, max: 1, multiplier: 1.0 },
  { min: 2, max: 3, multiplier: 1.1 },
  { min: 4, max: 6, multiplier: 1.2 },
  { min: 7, max: 13, multiplier: 1.3 },
  { min: 14, max: 29, multiplier: 1.4 },
  { min: 30, max: Infinity, multiplier: 1.5 }
];

// Minimum score percentage to count as a "logged day" for streaks
export const STREAK_MIN_THRESHOLD = 0.20;

// Helper: read a CSS custom property value at render time (theme-aware)
export function _css(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// Score color tiers — reads CSS variables at render time so they follow the active theme
export function getScoreTiers() {
  const danger  = _css('--danger')  || '#EF4444';
  const warning = _css('--warning') || '#F59E0B';
  const success = _css('--success') || '#22C55E';
  return [
    { min: 0,    max: 0.39, color: danger,  label: 'Needs Work',    bg: 'bg-[var(--danger)]' },
    { min: 0.40, max: 0.59, color: warning, label: 'Getting There', bg: 'bg-[var(--warning)]' },
    { min: 0.60, max: 0.79, color: warning, label: 'Solid',         bg: 'bg-[var(--warning)]' },
    { min: 0.80, max: 0.89, color: success, label: 'Great',         bg: 'bg-[var(--success)]' },
    { min: 0.90, max: 1.0,  color: success, label: 'Outstanding',   bg: 'bg-[var(--success)]' }
  ];
}
// Backwards-compat: existing code that reads SCORE_TIERS as a constant gets a live Proxy
export const SCORE_TIERS = new Proxy([], {
  get(_, prop) {
    const arr = getScoreTiers();
    const val = arr[prop];
    return typeof val === 'function' ? val.bind(arr) : val;
  }
});

// Achievement definitions
export const ACHIEVEMENTS = [
  // Streaks
  { id: 'first-steps', name: 'First Steps', desc: '3-day streak', icon: '🌱', category: 'streak', check: (ctx) => ctx.streak >= 3 },
  { id: 'weekly-warrior', name: 'Weekly Warrior', desc: '7-day streak', icon: '⚔️', category: 'streak', check: (ctx) => ctx.streak >= 7 },
  { id: 'fortnight-focus', name: 'Fortnight Focus', desc: '14-day streak', icon: '🎯', category: 'streak', check: (ctx) => ctx.streak >= 14 },
  { id: 'monthly-master', name: 'Monthly Master', desc: '30-day streak', icon: '👑', category: 'streak', check: (ctx) => ctx.streak >= 30 },
  { id: 'quarterly-quest', name: 'Quarterly Quest', desc: '90-day streak', icon: '🏔️', category: 'streak', check: (ctx) => ctx.streak >= 90 },
  { id: 'year-of-discipline', name: 'Year of Discipline', desc: '365-day streak', icon: '🏆', category: 'streak', check: (ctx) => ctx.streak >= 365 },
  // Category mastery
  { id: 'perfect-prayer', name: 'Perfect Prayer', desc: 'All 5 prayers on time', icon: '🕌', category: 'mastery', check: (ctx) => ctx.prayerOnTime >= 5 },
  { id: 'prayer-streak-7', name: 'Prayer Streak', desc: '7 consecutive perfect prayer days', icon: '📿', category: 'mastery', check: (ctx) => ctx.perfectPrayerStreak >= 7 },
  { id: 'green-day', name: 'Green Day', desc: 'Overall score >= 90%', icon: '💚', category: 'mastery', check: (ctx) => ctx.overallPercent >= 0.90 },
  { id: 'balanced-day', name: 'Balanced Day', desc: 'All 5 categories >= 60%', icon: '⚖️', category: 'mastery', check: (ctx) => ctx.allCategoriesAbove60 },
  { id: 'family-first', name: 'Family First', desc: '30 cumulative family check-in days', icon: '👨‍👩‍👧‍👦', category: 'mastery', check: (ctx) => ctx.totalFamilyDays >= 30 },
  // Milestones
  { id: 'day-one', name: 'Day One', desc: 'First day logged', icon: '🚀', category: 'milestone', check: (ctx) => ctx.totalDaysLogged >= 1 },
  { id: 'century', name: 'Century', desc: '100 days logged', icon: '💯', category: 'milestone', check: (ctx) => ctx.totalDaysLogged >= 100 },
  { id: 'quran-scholar', name: 'Quran Scholar', desc: '50 cumulative Quran pages', icon: '📖', category: 'milestone', check: (ctx) => ctx.totalQuranPages >= 50 },
  { id: 'level-10', name: 'Level 10', desc: 'Reach Level 10', icon: '🔟', category: 'milestone', check: (ctx) => ctx.level >= 10 },
  { id: 'level-20', name: 'Level 20', desc: 'Reach Level 20', icon: '2️⃣0️⃣', category: 'milestone', check: (ctx) => ctx.level >= 20 },
  { id: 'level-30', name: 'Level 30', desc: 'Reach Level 30', icon: '3️⃣0️⃣', category: 'milestone', check: (ctx) => ctx.level >= 30 }
];

// Daily focus tips per category
export const FOCUS_TIPS = {
  prayer: 'Try to pray all 5 on time today.',
  diabetes: 'Watch your glucose — stay in range.',
  whoop: 'Prioritize sleep and recovery.',
  family: 'Try calling a family member today.',
  habits: 'Focus on exercise and reading.'
};

// Braindump: action verbs used to classify items as tasks
export const BRAINDUMP_ACTION_VERBS = [
  'buy', 'call', 'send', 'finish', 'review', 'schedule', 'clean', 'fix', 'write',
  'email', 'text', 'message', 'contact', 'ask', 'tell', 'remind', 'check', 'update',
  'submit', 'complete', 'start', 'begin', 'plan', 'prepare', 'organize', 'arrange',
  'book', 'order', 'pick', 'drop', 'return', 'cancel', 'renew', 'pay', 'transfer',
  'deposit', 'withdraw', 'sign', 'register', 'apply', 'file', 'print', 'scan', 'copy',
  'move', 'pack', 'unpack', 'install', 'setup', 'configure', 'test', 'debug', 'deploy',
  'ship', 'deliver', 'mail', 'post', 'share', 'publish', 'upload', 'download', 'backup',
  'restore', 'delete', 'remove', 'add', 'create', 'build', 'design', 'draft', 'edit',
  'proofread', 'approve', 'reject', 'merge', 'close', 'open', 'lock', 'unlock',
  'wash', 'iron', 'cook', 'bake', 'grill', 'make', 'assemble', 'repair', 'replace',
  'charge', 'refill', 'restock', 'measure', 'track', 'log', 'record', 'document',
  'research', 'investigate', 'analyze', 'compare', 'evaluate', 'prioritize', 'delegate',
];

// Pre-populated January 2026 data from habits tracking sheet
export const JANUARY_DATA = {"2026-01-01":{"prayers":{"fajr":"1","dhuhr":"1","asr":"1","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":false,"dad":false,"jana":false,"tia":false,"ahmed":false,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-02":{"prayers":{"fajr":"1","dhuhr":"1","asr":"1","maghrib":"1","isha":"1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":false,"ahmed":false,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-03":{"prayers":{"fajr":"1.1","dhuhr":"1","asr":"1","maghrib":"0.1","isha":"1","quran":0},"family":{"mom":true,"dad":false,"jana":false,"tia":false,"ahmed":false,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-04":{"prayers":{"fajr":"1.2","dhuhr":"0.1","asr":"1","maghrib":"1","isha":"1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":false,"ahmed":false,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-05":{"prayers":{"fajr":"1","dhuhr":"0.1","asr":"0.1","maghrib":"0.1","isha":"1","quran":0},"family":{"mom":false,"dad":false,"jana":false,"tia":false,"ahmed":true,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-06":{"prayers":{"fajr":"1","dhuhr":"0.1","asr":"0.1","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":true,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-07":{"prayers":{"fajr":"1","dhuhr":"0.1","asr":"1","maghrib":"1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":true,"tia":true,"ahmed":true,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-08":{"prayers":{"fajr":"0.1","dhuhr":"1","asr":"1","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":true,"dad":false,"jana":false,"tia":false,"ahmed":true,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-09":{"prayers":{"fajr":"1","dhuhr":"1","asr":"1","maghrib":"1","isha":"1","quran":0},"family":{"mom":true,"dad":false,"jana":false,"tia":false,"ahmed":true,"eman":false},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-10":{"prayers":{"fajr":"0.1","dhuhr":"1","asr":"1","maghrib":"1","isha":"1","quran":0},"family":{"mom":true,"dad":false,"jana":false,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-11":{"prayers":{"fajr":"1","dhuhr":"0.1","asr":"0.1","maghrib":"1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-12":{"prayers":{"fajr":"0.1","dhuhr":"","asr":"0.1","maghrib":"0.1","isha":"1","quran":0},"family":{"mom":false,"dad":true,"jana":false,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-13":{"prayers":{"fajr":"0.1","dhuhr":"","asr":"","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":true,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-14":{"prayers":{"fajr":"1","dhuhr":"0.1","asr":"0.1","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-15":{"prayers":{"fajr":"1","dhuhr":"","asr":"","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-16":{"prayers":{"fajr":"1","dhuhr":"","asr":"","maghrib":"","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-17":{"prayers":{"fajr":"1","dhuhr":"1","asr":"1","maghrib":"0.1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-18":{"prayers":{"fajr":"1","dhuhr":"1","asr":"0.1","maghrib":"1","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-19":{"prayers":{"fajr":"1","dhuhr":"","asr":"","maghrib":"1","isha":"0.1","quran":0},"family":{"mom":true,"dad":false,"jana":false,"tia":false,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-20":{"prayers":{"fajr":"1","dhuhr":"","asr":"","maghrib":"","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-21":{"prayers":{"fajr":"0.1","dhuhr":"","asr":"","maghrib":"","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":false,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}},"2026-01-22":{"prayers":{"fajr":"1","dhuhr":"","asr":"","maghrib":"","isha":"0.1","quran":0},"family":{"mom":true,"dad":true,"jana":true,"tia":true,"ahmed":true,"eman":true},"glucose":{"avg":"","tir":"","insulin":"","nop":""},"whoop":{"sleepHours":"","sleepConsist":"","rhr":"","hrv":"","vo2max":"","steps":"","recovery":"","strain":"","whoopAge":""},"habits":{"exercise":0,"reading":0,"meditation":0,"water":"","vitamins":false,"brushTeeth":0}}};
