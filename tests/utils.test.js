// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  escapeHtml,
  generateTaskId,
  fmt,
  getLocalDateString,
  formatSmartDate,
  safeJsonParse,
  safeLocalStorageSet,
  safeLocalStorageGet,
  normalizeEmail,
  renderPersonAvatar,
  formatEventTime,
  formatEventDateLabel,
} from '../src/utils.js';

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------
describe('escapeHtml', () => {
  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
  });

  it('does not alter double quotes (text-node escaping only)', () => {
    // escapeHtml uses textContent/innerHTML which escapes <, >, & but NOT "
    // This is safe for text content but not attribute injection
    const result = escapeHtml('" onmouseover="alert(1)"');
    expect(result).toBe('" onmouseover="alert(1)"');
  });

  it('returns empty string for falsy values', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('preserves safe text', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  // --- additional escapeHtml tests ---

  it('handles unicode characters correctly', () => {
    expect(escapeHtml('Hello \u2603 \u2764 \u00e9\u00e8\u00ea')).toBe('Hello \u2603 \u2764 \u00e9\u00e8\u00ea');
    expect(escapeHtml('\u4f60\u597d\u4e16\u754c')).toBe('\u4f60\u597d\u4e16\u754c'); // Chinese chars
    expect(escapeHtml('\ud83d\ude00\ud83d\ude80\ud83d\udca5')).toBe('\ud83d\ude00\ud83d\ude80\ud83d\udca5'); // emoji
  });

  it('coerces numbers to string via textContent', () => {
    // textContent will coerce to string, so 42 becomes "42"
    expect(escapeHtml(42)).toBe('42');
    expect(escapeHtml(0)).toBe(''); // 0 is falsy => ''
    expect(escapeHtml(3.14)).toBe('3.14');
  });

  it('handles very long strings without truncation', () => {
    const longStr = 'a'.repeat(10000);
    expect(escapeHtml(longStr)).toBe(longStr);
    expect(escapeHtml(longStr).length).toBe(10000);
  });

  it('handles strings with mixed HTML entities and unicode', () => {
    expect(escapeHtml('<div>\u00a9 2026 & \u00ae</div>')).toBe(
      '&lt;div&gt;\u00a9 2026 &amp; \u00ae&lt;/div&gt;'
    );
  });

  it('handles strings with only whitespace', () => {
    expect(escapeHtml('   ')).toBe('   ');
    expect(escapeHtml('\t\n')).toBe('\t\n');
  });
});

// ---------------------------------------------------------------------------
// generateTaskId
// ---------------------------------------------------------------------------
describe('generateTaskId', () => {
  it('produces string starting with task_', () => {
    const id = generateTaskId();
    expect(id).toMatch(/^task_\d+_[a-z0-9]+$/);
  });

  it('produces unique IDs', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateTaskId()));
    expect(ids.size).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// fmt
// ---------------------------------------------------------------------------
describe('fmt', () => {
  it('formats numbers with commas for large values', () => {
    expect(fmt(1234)).toBe('1,234');
    expect(fmt(1000000)).toBe('1,000,000');
  });

  it('returns em-dash for null/undefined/empty/NaN', () => {
    const emDash = '\u2014';
    expect(fmt(null)).toBe(emDash);
    expect(fmt(undefined)).toBe(emDash);
    expect(fmt('')).toBe(emDash);
    expect(fmt('abc')).toBe(emDash);
  });

  it('handles string numbers', () => {
    expect(fmt('42')).toBe('42');
  });

  // --- additional fmt tests ---

  it('formats negative numbers', () => {
    expect(fmt(-500)).toBe('-500');
    expect(fmt(-1234)).toBe('-1,234');
    expect(fmt(-1000000)).toBe('-1,000,000');
  });

  it('formats decimal numbers', () => {
    expect(fmt(3.14)).toBe('3.14');
    expect(fmt(1234.56)).toBe('1,234.56');
    expect(fmt('99.9')).toBe('99.9');
  });

  it('handles zero', () => {
    expect(fmt(0)).toBe('0');
  });

  it('does not add commas for numbers below 1000', () => {
    expect(fmt(999)).toBe('999');
    expect(fmt(100)).toBe('100');
    expect(fmt(1)).toBe('1');
  });

  it('adds commas starting at 1000 (boundary)', () => {
    expect(fmt(999)).toBe('999');
    expect(fmt(1000)).toBe('1,000');
    expect(fmt(9999)).toBe('9,999');
    expect(fmt(10000)).toBe('10,000');
  });

  it('returns em-dash for non-numeric strings', () => {
    const emDash = '\u2014';
    expect(fmt('hello')).toBe(emDash);
    expect(fmt('NaN')).toBe(emDash);
  });
});

// ---------------------------------------------------------------------------
// getLocalDateString
// ---------------------------------------------------------------------------
describe('getLocalDateString', () => {
  it('returns YYYY-MM-DD format', () => {
    const result = getLocalDateString(new Date(2026, 0, 15)); // Jan 15, 2026
    expect(result).toBe('2026-01-15');
  });

  it('zero-pads single-digit months and days', () => {
    const result = getLocalDateString(new Date(2026, 2, 5)); // Mar 5
    expect(result).toBe('2026-03-05');
  });

  it('defaults to current date', () => {
    const result = getLocalDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  // --- additional getLocalDateString tests ---

  it('handles Dec 31 correctly', () => {
    expect(getLocalDateString(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('handles Jan 1 correctly', () => {
    expect(getLocalDateString(new Date(2027, 0, 1))).toBe('2027-01-01');
  });

  it('handles leap year Feb 29', () => {
    // 2024 is a leap year
    expect(getLocalDateString(new Date(2024, 1, 29))).toBe('2024-02-29');
  });

  it('handles non-leap year Feb 28', () => {
    expect(getLocalDateString(new Date(2025, 1, 28))).toBe('2025-02-28');
  });
});

// ---------------------------------------------------------------------------
// formatSmartDate
// ---------------------------------------------------------------------------
describe('formatSmartDate', () => {
  it('returns empty string for falsy input', () => {
    expect(formatSmartDate('')).toBe('');
    expect(formatSmartDate(null)).toBe('');
    expect(formatSmartDate(undefined)).toBe('');
  });

  it('returns "Today" for today\'s date', () => {
    const today = getLocalDateString();
    expect(formatSmartDate(today)).toBe('Today');
  });

  it('returns "Tomorrow" for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(formatSmartDate(getLocalDateString(tomorrow))).toBe('Tomorrow');
  });

  it('returns "Yesterday" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatSmartDate(getLocalDateString(yesterday))).toBe('Yesterday');
  });

  // --- additional formatSmartDate tests ---

  it('returns weekday name for 2 days from now', () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const result = formatSmartDate(getLocalDateString(d));
    const expectedWeekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    expect(result).toBe(expectedWeekday);
  });

  it('returns weekday name for 5 days ago', () => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    const result = formatSmartDate(getLocalDateString(d));
    const expectedWeekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    expect(result).toBe(expectedWeekday);
  });

  it('returns "Mon, day" format for dates in the same year beyond 6 days', () => {
    // Pick a date 10 days from now (should still be same year for most of the year)
    const d = new Date();
    d.setDate(d.getDate() + 10);
    // If it rolled to next year, adjust to stay same year
    const today = new Date();
    if (d.getFullYear() !== today.getFullYear()) {
      // Use a date 10 days ago instead to guarantee same year
      d.setDate(today.getDate() - 10);
    }
    const result = formatSmartDate(getLocalDateString(d));
    // Should match abbreviated month + day format (e.g. "Feb 22")
    const expected = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    expect(result).toBe(expected);
  });

  it('includes year for dates in a different year', () => {
    const result = formatSmartDate('2020-06-15');
    // Different year => month, day, year
    const d = new Date('2020-06-15T00:00:00');
    const expected = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    expect(result).toBe(expected);
  });

  it('includes year for far future dates in a different year', () => {
    const result = formatSmartDate('2099-12-25');
    const d = new Date('2099-12-25T00:00:00');
    const expected = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    expect(result).toBe(expected);
  });

  it('returns weekday name for 6 days from now (boundary)', () => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    const result = formatSmartDate(getLocalDateString(d));
    const expectedWeekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    expect(result).toBe(expectedWeekday);
  });

  it('does not return weekday name for 7 days from now', () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const result = formatSmartDate(getLocalDateString(d));
    // Should NOT be a weekday name; should be abbreviated date
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // It might still match if same year, but format should be "Mon Day" not weekday
    if (d.getFullYear() === new Date().getFullYear()) {
      const expected = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      expect(result).toBe(expected);
    } else {
      const expected = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      expect(result).toBe(expected);
    }
  });
});

// ---------------------------------------------------------------------------
// safeJsonParse
// ---------------------------------------------------------------------------
describe('safeJsonParse', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns parsed JSON object from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify({ a: 1, b: 'two' }));
    const result = safeJsonParse('testKey', {});
    expect(result).toEqual({ a: 1, b: 'two' });
  });

  it('returns parsed JSON array from localStorage', () => {
    localStorage.setItem('testArr', JSON.stringify([1, 2, 3]));
    const result = safeJsonParse('testArr', []);
    expect(result).toEqual([1, 2, 3]);
  });

  it('returns defaultValue when key does not exist', () => {
    const result = safeJsonParse('nonexistent', 'fallback');
    expect(result).toBe('fallback');
  });

  it('returns defaultValue when key does not exist (default is array)', () => {
    const result = safeJsonParse('nokey', []);
    expect(result).toEqual([]);
  });

  it('returns defaultValue when stored value is corrupted JSON', () => {
    localStorage.setItem('badJson', '{not valid json!!!');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = safeJsonParse('badJson', 'default');
    expect(result).toBe('default');
    spy.mockRestore();
  });

  it('returns parsed primitive values', () => {
    localStorage.setItem('num', '42');
    expect(safeJsonParse('num', 0)).toBe(42);

    localStorage.setItem('bool', 'true');
    expect(safeJsonParse('bool', false)).toBe(true);

    localStorage.setItem('str', '"hello"');
    expect(safeJsonParse('str', '')).toBe('hello');

    localStorage.setItem('nullVal', 'null');
    expect(safeJsonParse('nullVal', 'notNull')).toBe(null);
  });

  it('returns defaultValue when stored value is empty string', () => {
    // localStorage.getItem returns "" which is falsy, so defaultValue is returned
    localStorage.setItem('empty', '');
    const result = safeJsonParse('empty', 'default');
    expect(result).toBe('default');
  });
});

// ---------------------------------------------------------------------------
// safeLocalStorageSet
// ---------------------------------------------------------------------------
describe('safeLocalStorageSet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a JSON object and returns true', () => {
    const result = safeLocalStorageSet('obj', { x: 1 });
    expect(result).toBe(true);
    expect(localStorage.getItem('obj')).toBe('{"x":1}');
  });

  it('stores an array and returns true', () => {
    const result = safeLocalStorageSet('arr', [1, 2, 3]);
    expect(result).toBe(true);
    expect(localStorage.getItem('arr')).toBe('[1,2,3]');
  });

  it('stores primitive values and returns true', () => {
    expect(safeLocalStorageSet('num', 42)).toBe(true);
    expect(localStorage.getItem('num')).toBe('42');

    expect(safeLocalStorageSet('str', 'hello')).toBe(true);
    expect(localStorage.getItem('str')).toBe('"hello"');

    expect(safeLocalStorageSet('bool', false)).toBe(true);
    expect(localStorage.getItem('bool')).toBe('false');

    expect(safeLocalStorageSet('nil', null)).toBe(true);
    expect(localStorage.getItem('nil')).toBe('null');
  });

  it('returns false when localStorage.setItem throws', () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      const err = new DOMException('quota exceeded', 'QuotaExceededError');
      err.name = 'QuotaExceededError';
      throw err;
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = safeLocalStorageSet('key', 'value');
    expect(result).toBe(false);
    spy.mockRestore();
    Storage.prototype.setItem = originalSetItem;
  });

  it('overwrites existing key', () => {
    safeLocalStorageSet('key', 'first');
    safeLocalStorageSet('key', 'second');
    expect(localStorage.getItem('key')).toBe('"second"');
  });
});

// ---------------------------------------------------------------------------
// safeLocalStorageGet
// ---------------------------------------------------------------------------
describe('safeLocalStorageGet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns parsed value from localStorage', () => {
    localStorage.setItem('data', JSON.stringify({ foo: 'bar' }));
    expect(safeLocalStorageGet('data')).toEqual({ foo: 'bar' });
  });

  it('returns default null when key does not exist', () => {
    expect(safeLocalStorageGet('missing')).toBe(null);
  });

  it('returns provided defaultValue when key does not exist', () => {
    expect(safeLocalStorageGet('missing', [])).toEqual([]);
    expect(safeLocalStorageGet('missing', 'fallback')).toBe('fallback');
    expect(safeLocalStorageGet('missing', 0)).toBe(0);
  });

  it('returns defaultValue when stored value is corrupted', () => {
    localStorage.setItem('bad', 'not-json{{{');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(safeLocalStorageGet('bad', 'safe')).toBe('safe');
    spy.mockRestore();
  });

  it('returns parsed primitives', () => {
    localStorage.setItem('n', '99');
    expect(safeLocalStorageGet('n')).toBe(99);

    localStorage.setItem('b', 'true');
    expect(safeLocalStorageGet('b')).toBe(true);

    localStorage.setItem('s', '"text"');
    expect(safeLocalStorageGet('s')).toBe('text');
  });

  it('returns defaultValue when stored value is empty string', () => {
    localStorage.setItem('empty', '');
    expect(safeLocalStorageGet('empty', 'def')).toBe('def');
  });

  it('roundtrips correctly with safeLocalStorageSet', () => {
    const data = { tasks: [1, 2], name: 'test', nested: { a: true } };
    safeLocalStorageSet('rt', data);
    expect(safeLocalStorageGet('rt')).toEqual(data);
  });
});

// ---------------------------------------------------------------------------
// normalizeEmail
// ---------------------------------------------------------------------------
describe('normalizeEmail', () => {
  it('lowercases and trims a normal email', () => {
    expect(normalizeEmail('User@Example.COM')).toBe('user@example.com');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeEmail('  hello@world.com  ')).toBe('hello@world.com');
    expect(normalizeEmail('\thello@world.com\n')).toBe('hello@world.com');
  });

  it('handles already normalized email', () => {
    expect(normalizeEmail('test@test.com')).toBe('test@test.com');
  });

  it('returns empty string for null/undefined/empty', () => {
    expect(normalizeEmail(null)).toBe('');
    expect(normalizeEmail(undefined)).toBe('');
    expect(normalizeEmail('')).toBe('');
  });

  it('handles non-string input by coercing to string', () => {
    expect(normalizeEmail(123)).toBe('123');
    // false is falsy, so (false || '') yields '' => String('') => ''
    expect(normalizeEmail(false)).toBe('');
  });

  it('handles email with mixed case domain and local part', () => {
    expect(normalizeEmail('John.Doe@Gmail.COM')).toBe('john.doe@gmail.com');
  });

  it('preserves special characters in email', () => {
    expect(normalizeEmail('user+tag@example.com')).toBe('user+tag@example.com');
    expect(normalizeEmail('user.name@sub.domain.com')).toBe('user.name@sub.domain.com');
  });
});

// ---------------------------------------------------------------------------
// renderPersonAvatar
// ---------------------------------------------------------------------------
describe('renderPersonAvatar', () => {
  it('returns empty string for null/undefined person', () => {
    expect(renderPersonAvatar(null)).toBe('');
    expect(renderPersonAvatar(undefined)).toBe('');
  });

  it('renders an img tag when person has photoData', () => {
    const person = { name: 'Jane Doe', photoData: 'https://example.com/photo.jpg' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('<img');
    expect(html).toContain('src="https://example.com/photo.jpg"');
    expect(html).toContain('width:32px');
    expect(html).toContain('height:32px');
    expect(html).toContain('rounded-full');
  });

  it('renders an img tag with custom size', () => {
    const person = { name: 'Jane', photoData: 'data:image/png;base64,abc' };
    const html = renderPersonAvatar(person, 48);
    expect(html).toContain('width:48px');
    expect(html).toContain('height:48px');
  });

  it('renders an img tag with extra classes', () => {
    const person = { name: 'Jane', photoData: 'photo.jpg' };
    const html = renderPersonAvatar(person, 32, 'border-2 shadow');
    expect(html).toContain('border-2 shadow');
  });

  it('renders initials fallback when no photoData (two-word name)', () => {
    const person = { name: 'John Smith' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('<span');
    expect(html).toContain('JS'); // initials
    expect(html).toContain('width:32px');
    expect(html).toContain('height:32px');
    expect(html).toContain('rounded-full');
  });

  it('renders single initial for one-word name', () => {
    const person = { name: 'Alice' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('>A</span>');
  });

  it('renders "?" for person with empty name', () => {
    const person = { name: '' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('>?</span>');
  });

  it('renders "?" for person with no name property', () => {
    const person = {};
    const html = renderPersonAvatar(person);
    expect(html).toContain('>?</span>');
  });

  it('uses person.color as background when provided', () => {
    const person = { name: 'Bob', color: '#ff0000' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('background:#ff0000');
  });

  it('uses var(--accent) as default background color', () => {
    const person = { name: 'Bob' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('background:var(--accent)');
  });

  it('calculates font-size from size (40% of size, min 10)', () => {
    // size=32 => fontSize=Math.max(Math.round(32*0.4), 10) = Math.max(13,10) = 13
    const person = { name: 'X' };
    const html = renderPersonAvatar(person, 32);
    expect(html).toContain('font-size:13px');
  });

  it('enforces minimum font-size of 10px', () => {
    // size=20 => fontSize=Math.max(Math.round(20*0.4), 10) = Math.max(8,10) = 10
    const person = { name: 'X' };
    const html = renderPersonAvatar(person, 20);
    expect(html).toContain('font-size:10px');
  });

  it('uses first and last word initials for multi-word names', () => {
    const person = { name: 'Mary Jane Watson' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('MW'); // first + last word
  });

  it('handles names with extra whitespace', () => {
    const person = { name: '  Bob   Jones  ' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('BJ');
  });

  it('uppercases initials', () => {
    const person = { name: 'alice bob' };
    const html = renderPersonAvatar(person);
    expect(html).toContain('AB');
  });
});

// ---------------------------------------------------------------------------
// formatEventTime
// ---------------------------------------------------------------------------
describe('formatEventTime', () => {
  it('returns empty string for null/undefined event', () => {
    expect(formatEventTime(null)).toBe('');
    expect(formatEventTime(undefined)).toBe('');
  });

  it('returns "All day" for all-day events', () => {
    expect(formatEventTime({ allDay: true })).toBe('All day');
  });

  it('returns empty string when no start dateTime', () => {
    expect(formatEventTime({})).toBe('');
    expect(formatEventTime({ start: {} })).toBe('');
    expect(formatEventTime({ start: { date: '2026-02-12' } })).toBe('');
  });

  it('formats a time range with start and end', () => {
    const event = {
      start: { dateTime: '2026-02-12T09:00:00' },
      end: { dateTime: '2026-02-12T10:30:00' },
    };
    const result = formatEventTime(event);
    // Should contain start time, dash, and end time
    expect(result).toContain(' - ');
    // Verify the start and end are parseable times
    const [startPart, endPart] = result.split(' - ');
    expect(startPart).toBeTruthy();
    expect(endPart).toBeTruthy();
  });

  it('formats start-only event (no end time)', () => {
    const event = {
      start: { dateTime: '2026-02-12T14:00:00' },
    };
    const result = formatEventTime(event);
    expect(result).toBeTruthy();
    expect(result).not.toContain(' - ');
  });

  it('formats start-only when end is empty object', () => {
    const event = {
      start: { dateTime: '2026-02-12T14:00:00' },
      end: {},
    };
    const result = formatEventTime(event);
    expect(result).toBeTruthy();
    expect(result).not.toContain(' - ');
  });

  it('produces AM/PM formatted times', () => {
    const event = {
      start: { dateTime: '2026-02-12T09:00:00' },
      end: { dateTime: '2026-02-12T17:00:00' },
    };
    const result = formatEventTime(event);
    expect(result).toMatch(/AM|PM/);
  });

  it('allDay flag takes priority over dateTime', () => {
    const event = {
      allDay: true,
      start: { dateTime: '2026-02-12T09:00:00' },
      end: { dateTime: '2026-02-12T10:00:00' },
    };
    expect(formatEventTime(event)).toBe('All day');
  });
});

// ---------------------------------------------------------------------------
// formatEventDateLabel
// ---------------------------------------------------------------------------
describe('formatEventDateLabel', () => {
  it('returns empty string for null/undefined event', () => {
    expect(formatEventDateLabel(null)).toBe('');
    expect(formatEventDateLabel(undefined)).toBe('');
  });

  it('returns empty string for event with no start info', () => {
    expect(formatEventDateLabel({})).toBe('');
    expect(formatEventDateLabel({ start: {} })).toBe('');
  });

  it('formats all-day event with start.date', () => {
    const event = {
      allDay: true,
      start: { date: '2026-02-12' },
    };
    const result = formatEventDateLabel(event);
    // Should produce something like "Thu, Feb 12"
    expect(result).toBeTruthy();
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}/);
  });

  it('formats timed event with start.dateTime', () => {
    const event = {
      start: { dateTime: '2026-06-15T09:00:00' },
    };
    const result = formatEventDateLabel(event);
    // Should produce something like "Mon, Jun 15"
    expect(result).toBeTruthy();
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}/);
  });

  it('returns empty string for non-allDay event with only start.date', () => {
    // allDay is not set, and there is no dateTime
    const event = {
      start: { date: '2026-02-12' },
    };
    const result = formatEventDateLabel(event);
    // allDay is falsy, start.dateTime is missing => ''
    expect(result).toBe('');
  });

  it('allDay with start.date takes priority over dateTime path', () => {
    const event = {
      allDay: true,
      start: { date: '2026-03-01', dateTime: '2026-03-01T10:00:00' },
    };
    const result = formatEventDateLabel(event);
    // Should use the date path since allDay is true and start.date exists
    expect(result).toBeTruthy();
    expect(result).toMatch(/\w{3}, \w{3} \d{1,2}/);
  });

  it('formats different dates correctly', () => {
    const event1 = { start: { dateTime: '2026-01-01T12:00:00' } };
    const result1 = formatEventDateLabel(event1);
    expect(result1).toContain('Jan');

    const event2 = { start: { dateTime: '2026-12-25T12:00:00' } };
    const result2 = formatEventDateLabel(event2);
    expect(result2).toContain('Dec');
    expect(result2).toContain('25');
  });
});
