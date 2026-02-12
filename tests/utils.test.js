// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { escapeHtml, generateTaskId, fmt, getLocalDateString, formatSmartDate } from '../src/utils.js';

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
});

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
});

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
});

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
});
