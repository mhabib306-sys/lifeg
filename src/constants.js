// ============================================================================
// CONSTANTS MODULE
// ============================================================================
// All immutable constants extracted from index.html for modular architecture.
// These are pure data with no side effects or state dependencies.

// App Version (MAJOR.MINOR.PATCH)
// MAJOR: New major features (Home view, Next perspective, etc.)
// MINOR: Enhancements and improvements
// PATCH: Bug fixes and small tweaks
export const APP_VERSION = '4.8.0 - Homebase';

export const STORAGE_KEY = 'lifeGamificationData_v3';
export const WEIGHTS_KEY = 'lifeGamificationWeights_v1';
export const GITHUB_TOKEN_KEY = 'lifeGamificationGithubToken';
export const THEME_KEY = 'lifeGamificationTheme';
export const ANTHROPIC_KEY = 'lifeGamificationAnthropicKey';
export const DATA_URL = 'data.json';

// Available themes
export const THEMES = {
  simplebits: { name: 'SimpleBits', description: 'Warm cream tones with coral accents' },
  things3: { name: 'Things 3', description: 'Clean white with blue accents' }
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
export const HOME_WIDGETS_KEY = 'lifeGamificationHomeWidgets';
export const VIEW_STATE_KEY = 'lifeGamificationViewState';

// Default home widgets configuration
export const DEFAULT_HOME_WIDGETS = [
  { id: 'quick-stats', type: 'stats', title: 'Quick Stats', size: 'full', order: 0, visible: true },
  { id: 'quick-add', type: 'quick-add', title: 'Quick Add Task', size: 'full', order: 1, visible: true },
  { id: 'weather', type: 'weather', title: 'Weather', size: 'half', order: 2, visible: true },
  { id: 'todays-score', type: 'score', title: "Today's Score", size: 'half', order: 3, visible: true },
  { id: 'today-tasks', type: 'today-tasks', title: 'Today', size: 'half', order: 4, visible: true },
  { id: 'next-tasks', type: 'next-tasks', title: 'Next', size: 'half', order: 5, visible: true },
  { id: 'prayers', type: 'prayers', title: 'Prayers', size: 'half', order: 6, visible: true },
  { id: 'glucose', type: 'glucose', title: 'Glucose', size: 'half', order: 7, visible: true },
  { id: 'whoop', type: 'whoop', title: 'Whoop', size: 'half', order: 8, visible: true },
  { id: 'habits', type: 'habits', title: 'Habits', size: 'half', order: 9, visible: true }
];

// Default categories (Areas)
export const DEFAULT_TASK_CATEGORIES = [
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
  { id: 'self', name: 'Self', color: '#4A90A4' }
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
  // Area - Things 3 style: filled folder/area icon
  area: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2H4z"/></svg>`,
  // Next - Things 3/OmniFocus style: play button in circle
  next: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>`,
  // Notes - Things 3 style: clean bullet list
  notes: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/><rect x="10" y="5" width="11" height="2" rx="1"/><rect x="10" y="11" width="11" height="2" rx="1"/><rect x="10" y="17" width="11" height="2" rx="1"/></svg>`,
  // Calendar - OmniFocus Forecast style: calendar with grid dots
  calendar: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><circle cx="8" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="16" cy="12" r="1.2"/><circle cx="8" cy="16" r="1.2"/><circle cx="12" cy="16" r="1.2"/><circle cx="16" cy="16" r="1.2"/></svg>`,
  // Tab icons - Things 3 style
  lifeScore: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>`,
  workspace: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v16h12V4H6zm2 3h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>`,
  settings: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.61 3.61 0 0112 15.6z"/></svg>`
};

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
export const BUILTIN_PERSPECTIVES = [
  { id: 'inbox', name: 'Inbox', icon: THINGS3_ICONS.inbox, color: '#5598FE', filter: { status: 'inbox' }, builtin: true },
  { id: 'today', name: 'Today', icon: THINGS3_ICONS.today, color: '#FFCA28', filter: { today: true }, builtin: true },
  { id: 'flagged', name: 'Flagged', icon: THINGS3_ICONS.flagged, color: '#FB8C00', filter: { flagged: true }, builtin: true },
  { id: 'upcoming', name: 'Upcoming', icon: THINGS3_ICONS.upcoming, color: '#EF5350', filter: { upcoming: true }, builtin: true },
  { id: 'calendar', name: 'Calendar', icon: THINGS3_ICONS.calendar, color: '#8B5CF6', filter: { calendar: true }, builtin: true },
  { id: 'anytime', name: 'Anytime', icon: THINGS3_ICONS.anytime, color: '#26A69A', filter: { status: 'anytime' }, builtin: true },
  { id: 'someday', name: 'Someday', icon: THINGS3_ICONS.someday, color: '#D4A24C', filter: { status: 'someday' }, builtin: true },
  { id: 'logbook', name: 'Logbook', icon: THINGS3_ICONS.logbook, color: '#66BB6A', filter: { completed: true }, builtin: true }
];

// Notes perspective (separate from task perspectives - uses outline/bullet style)
export const NOTES_PERSPECTIVE = { id: 'notes', name: 'Notes', icon: THINGS3_ICONS.notes, color: '#8B5CF6', filter: { notes: true }, builtin: true };

export const defaultDayData = {
  prayers: { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', quran: 0 },
  glucose: { avg: '', tir: '', insulin: '' },
  whoop: {
    sleepPerf: '', recovery: '', strain: '', whoopAge: ''
  },
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
