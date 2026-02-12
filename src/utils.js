// ============================================================================
// UTILITY FUNCTIONS MODULE
// ============================================================================
// Pure utility functions with no state dependencies.
// These can be imported anywhere without side effects.

/**
 * Helper function for timezone-safe local date (YYYY-MM-DD format)
 * Avoids toISOString() which converts to UTC and can shift the date
 * @param {Date} [date=new Date()] - Date object to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Security: HTML escape function to prevent XSS
 * Creates a temporary DOM element to safely escape HTML entities
 * @param {string} text - Raw text to escape
 * @returns {string} HTML-safe escaped string
 */
export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format numbers with commas for 4+ digits
 * Returns em-dash for null/undefined/empty/NaN values
 * @param {number|string|null|undefined} num - Number to format
 * @returns {string} Formatted number string or em-dash
 */
export function fmt(num) {
  if (num === null || num === undefined || num === '') return '\u2014';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '\u2014';
  return n.toLocaleString('en-US');
}

/**
 * Generate unique task ID using timestamp + random string
 * Format: task_{timestamp}_{random9chars}
 * @returns {string} Unique task identifier
 */
export function generateTaskId() {
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);
  const randomStr = Array.from(randomBytes, b => b.toString(36).padStart(2, '0')).join('').slice(0, 12);
  return `task_${timestamp}_${randomStr}`;
}

/**
 * Safely parse JSON from localStorage with fallback
 * Handles corrupted/missing data gracefully
 * @param {string} key - localStorage key to read
 * @param {*} defaultValue - Fallback value if parse fails
 * @returns {*} Parsed value or default
 */
export function safeJsonParse(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse localStorage key "${key}":`, e);
    return defaultValue;
  }
}

/**
 * Safe localStorage wrapper with error handling for writes
 * Catches QuotaExceededError and other storage errors
 * @param {string} key - localStorage key to write
 * @param {*} value - Value to JSON.stringify and store
 * @returns {boolean} True if write succeeded
 */
export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded for key:', key);
    }
    return false;
  }
}

/**
 * Safe localStorage wrapper with error handling for reads
 * @param {string} key - localStorage key to read
 * @param {*} [defaultValue=null] - Fallback value if read fails
 * @returns {*} Parsed value or default
 */
export function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage key:', key, e);
    return defaultValue;
  }
}

/**
 * Normalize an email address for comparison (trim + lowercase)
 * @param {string} email - Raw email address
 * @returns {string} Normalized email
 */
export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/**
 * Render a person avatar — photo if available, else colored initials circle.
 * Uses inline style for dimensions (Tailwind can't generate dynamic arbitrary values at build time).
 * @param {Object} person - Person entity with optional photoData, name, color
 * @param {number} [size=32] - Pixel width/height
 * @param {string} [extraClasses=''] - Additional CSS classes
 * @returns {string} HTML string
 */
export function renderPersonAvatar(person, size = 32, extraClasses = '') {
  if (!person) return '';
  if (person.photoData) {
    return `<img src="${person.photoData}" alt="" style="width:${size}px;height:${size}px" class="rounded-full object-cover flex-shrink-0 ${extraClasses}" referrerpolicy="no-referrer">`;
  }
  // Initials fallback: first letter of first + last word, max 2 chars
  const words = String(person.name || '').trim().split(/\s+/).filter(Boolean);
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : (words[0]?.[0] || '?').toUpperCase();
  const bg = person.color || 'var(--accent)';
  const fontSize = Math.max(Math.round(size * 0.4), 10);
  return `<span style="width:${size}px;height:${size}px;background:${bg};font-size:${fontSize}px" class="rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold leading-none ${extraClasses}">${initials}</span>`;
}

/**
 * Format a Google Calendar event's time range for display
 * @param {Object} event - GCal event object with start/end dateTime
 * @returns {string} Formatted time string (e.g. "9:00 AM - 10:00 AM")
 */
export function formatEventTime(event) {
  if (!event) return '';
  if (event.allDay) return 'All day';
  if (!event.start?.dateTime) return '';
  const start = new Date(event.start.dateTime);
  const startText = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (!event.end?.dateTime) return startText;
  const end = new Date(event.end.dateTime);
  const endText = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${startText} - ${endText}`;
}

/**
 * Format a Google Calendar event's date for display
 * @param {Object} event - GCal event object
 * @returns {string} Formatted date string (e.g. "Mon, Jan 15")
 */
export function formatEventDateLabel(event) {
  if (!event) return '';
  if (event.allDay && event.start?.date) {
    const d = new Date(event.start.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  if (event.start?.dateTime) {
    const d = new Date(event.start.dateTime);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  return '';
}

/**
 * Smart date formatting like Things 3
 * Shows relative labels (Today, Tomorrow, Yesterday) for near dates,
 * weekday names for dates within a week, and abbreviated dates otherwise
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Human-readable date label
 */
export function formatSmartDate(dateStr) {
  if (!dateStr) return '';
  const today = getLocalDateString();
  const todayDate = new Date(today + 'T00:00:00');
  const targetDate = new Date(dateStr + 'T00:00:00');
  const diffDays = Math.round((targetDate - todayDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 6) return targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  if (targetDate.getFullYear() === todayDate.getFullYear()) return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
