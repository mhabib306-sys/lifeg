// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ============================================================================
// MOCKS
// ============================================================================

// Hoist mocks before imports
const { mockState } = vi.hoisted(() => {
  const mockState = {
    inlineAutocompleteMeta: new Map(),
    taskAreas: [],
    taskLabels: [],
    taskPeople: [],
    taskCategories: [],
    modalSelectedArea: null,
    modalSelectedCategory: null,
    modalSelectedTags: [],
    modalSelectedPeople: [],
  };
  return { mockState };
});

// Mock state module
vi.mock('../src/state.js', () => ({
  state: mockState,
}));

// Mock utils module - provide real implementations for escapeHtml and formatSmartDate
vi.mock('../src/utils.js', () => ({
  escapeHtml: (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  formatSmartDate: (dateStr) => {
    if (!dateStr) return '';
    // Simple implementation for testing - just return "Today" or the date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (dateStr === todayStr) return 'Today';

    const targetDate = new Date(dateStr + 'T00:00:00');
    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    // Otherwise return formatted date
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },
}));

// Mock constants module
vi.mock('../src/constants.js', () => ({
  TASK_CATEGORIES_KEY: 'lifeGamification_TaskCategories',
  TASK_LABELS_KEY: 'lifeGamification_TaskLabels',
  TASK_PEOPLE_KEY: 'lifeGamification_TaskPeople',
}));

// Import after mocks
import {
  parseDateQuery,
  removeInlineMeta,
  cleanupInlineAutocomplete,
} from '../src/features/inline-autocomplete.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Add days to today and return YYYY-MM-DD string
 */
function addDaysToToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Get next occurrence of a weekday (0=Sunday, 6=Saturday)
 */
function getNextWeekday(dayIdx) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = (dayIdx - today.getDay() + 7) % 7;
  const d = new Date(today);
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Get next occurrence of a weekday from tomorrow (used for "next <day>" pattern)
 */
function getNextWeekdayFromTomorrow(dayIdx) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = (dayIdx - tomorrow.getDay() + 7) % 7;
  const d = new Date(tomorrow);
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// ============================================================================
// TESTS: parseDateQuery
// ============================================================================

describe('parseDateQuery', () => {
  // -------------------------------------------------------------------------
  // 1. Empty query - should return 4 default suggestions
  // -------------------------------------------------------------------------
  describe('empty query', () => {
    it('returns 4 default suggestions when query is empty string', () => {
      const result = parseDateQuery('');
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Today');
      expect(result[1].name).toBe('Tomorrow');
      expect(result[2].name).toBe('Next Monday');
      expect(result[3].name).toBe('In 1 Week');
    });

    it('returns 4 default suggestions when query is null', () => {
      const result = parseDateQuery(null);
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Today');
      expect(result[1].name).toBe('Tomorrow');
    });

    it('returns 4 default suggestions when query is undefined', () => {
      const result = parseDateQuery(undefined);
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Today');
      expect(result[1].name).toBe('Tomorrow');
    });

    it('returns 4 default suggestions when query is whitespace only', () => {
      const result = parseDateQuery('   ');
      expect(result).toHaveLength(4);
      expect(result[0].name).toBe('Today');
    });

    it('default Today has correct date format', () => {
      const result = parseDateQuery('');
      const today = getTodayString();
      expect(result[0].date).toBe(today);
      expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('default Tomorrow has correct date format', () => {
      const result = parseDateQuery('');
      const tomorrow = addDaysToToday(1);
      expect(result[1].date).toBe(tomorrow);
      expect(result[1].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('default Next Monday has correct date format', () => {
      const result = parseDateQuery('');
      const nextMon = getNextWeekday(1);
      expect(result[2].date).toBe(nextMon);
      expect(result[2].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('default In 1 Week has correct date format', () => {
      const result = parseDateQuery('');
      const nextWeek = addDaysToToday(7);
      expect(result[3].date).toBe(nextWeek);
      expect(result[3].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  // -------------------------------------------------------------------------
  // 2. "today" / "tod" queries
  // -------------------------------------------------------------------------
  describe('"today" / "tod" queries', () => {
    it('returns Today for "today"', () => {
      const result = parseDateQuery('today');
      expect(result.length).toBeGreaterThan(0);
      const today = result.find(r => r.name === 'Today');
      expect(today).toBeDefined();
      expect(today.date).toBe(getTodayString());
    });

    it('returns Today for "tod"', () => {
      const result = parseDateQuery('tod');
      expect(result.length).toBeGreaterThan(0);
      const today = result.find(r => r.name === 'Today');
      expect(today).toBeDefined();
    });

    it('returns Today for "t" (prefix match)', () => {
      const result = parseDateQuery('t');
      expect(result.length).toBeGreaterThan(0);
      const today = result.find(r => r.name === 'Today');
      expect(today).toBeDefined();
    });

    it('returns Today for "to"', () => {
      const result = parseDateQuery('to');
      expect(result.length).toBeGreaterThan(0);
      const today = result.find(r => r.name === 'Today');
      expect(today).toBeDefined();
    });

    it('returns Today for "toda"', () => {
      const result = parseDateQuery('toda');
      expect(result.length).toBeGreaterThan(0);
      const today = result.find(r => r.name === 'Today');
      expect(today).toBeDefined();
    });

    it('case insensitive: "TODAY"', () => {
      const result = parseDateQuery('TODAY');
      expect(result.length).toBeGreaterThan(0);
      const today = result.find(r => r.name === 'Today');
      expect(today).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // 3. "tomorrow" / "tmr" queries
  // -------------------------------------------------------------------------
  describe('"tomorrow" / "tmr" queries', () => {
    it('returns Tomorrow for "tomorrow"', () => {
      const result = parseDateQuery('tomorrow');
      expect(result.length).toBeGreaterThan(0);
      const tmr = result.find(r => r.name === 'Tomorrow');
      expect(tmr).toBeDefined();
      expect(tmr.date).toBe(addDaysToToday(1));
    });

    it('returns Tomorrow for "tmr"', () => {
      const result = parseDateQuery('tmr');
      expect(result.length).toBeGreaterThan(0);
      const tmr = result.find(r => r.name === 'Tomorrow');
      expect(tmr).toBeDefined();
    });

    it('returns Tomorrow for "tm"', () => {
      const result = parseDateQuery('tm');
      expect(result.length).toBeGreaterThan(0);
      const tmr = result.find(r => r.name === 'Tomorrow');
      expect(tmr).toBeDefined();
    });

    it('returns Tomorrow for "tom"', () => {
      const result = parseDateQuery('tom');
      expect(result.length).toBeGreaterThan(0);
      const tmr = result.find(r => r.name === 'Tomorrow');
      expect(tmr).toBeDefined();
    });

    it('case insensitive: "TOMORROW"', () => {
      const result = parseDateQuery('TOMORROW');
      expect(result.length).toBeGreaterThan(0);
      const tmr = result.find(r => r.name === 'Tomorrow');
      expect(tmr).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // 4. Day names without "next" (monday, tue, fri, etc.)
  // -------------------------------------------------------------------------
  describe('day names without "next"', () => {
    it('returns next Monday for "monday"', () => {
      const result = parseDateQuery('monday');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Monday');
      expect(mon).toBeDefined();
      expect(mon.date).toBe(getNextWeekday(1));
    });

    it('returns next Tuesday for "tuesday"', () => {
      const result = parseDateQuery('tuesday');
      expect(result.length).toBeGreaterThan(0);
      const tue = result.find(r => r.name === 'Tuesday');
      expect(tue).toBeDefined();
      expect(tue.date).toBe(getNextWeekday(2));
    });

    it('returns next Friday for "friday"', () => {
      const result = parseDateQuery('friday');
      expect(result.length).toBeGreaterThan(0);
      const fri = result.find(r => r.name === 'Friday');
      expect(fri).toBeDefined();
      expect(fri.date).toBe(getNextWeekday(5));
    });

    it('returns next Saturday for "saturday"', () => {
      const result = parseDateQuery('saturday');
      expect(result.length).toBeGreaterThan(0);
      const sat = result.find(r => r.name === 'Saturday');
      expect(sat).toBeDefined();
      expect(sat.date).toBe(getNextWeekday(6));
    });

    it('returns next Sunday for "sunday"', () => {
      const result = parseDateQuery('sunday');
      expect(result.length).toBeGreaterThan(0);
      const sun = result.find(r => r.name === 'Sunday');
      expect(sun).toBeDefined();
      expect(sun.date).toBe(getNextWeekday(0));
    });

    it('returns day for short form "mon"', () => {
      const result = parseDateQuery('mon');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Monday');
      expect(mon).toBeDefined();
    });

    it('returns day for short form "tue"', () => {
      const result = parseDateQuery('tue');
      expect(result.length).toBeGreaterThan(0);
      const tue = result.find(r => r.name === 'Tuesday');
      expect(tue).toBeDefined();
    });

    it('returns day for short form "wed"', () => {
      const result = parseDateQuery('wed');
      expect(result.length).toBeGreaterThan(0);
      const wed = result.find(r => r.name === 'Wednesday');
      expect(wed).toBeDefined();
    });

    it('returns day for short form "thu"', () => {
      const result = parseDateQuery('thu');
      expect(result.length).toBeGreaterThan(0);
      const thu = result.find(r => r.name === 'Thursday');
      expect(thu).toBeDefined();
    });

    it('returns day for short form "fri"', () => {
      const result = parseDateQuery('fri');
      expect(result.length).toBeGreaterThan(0);
      const fri = result.find(r => r.name === 'Friday');
      expect(fri).toBeDefined();
    });

    it('returns day for short form "sat"', () => {
      const result = parseDateQuery('sat');
      expect(result.length).toBeGreaterThan(0);
      const sat = result.find(r => r.name === 'Saturday');
      expect(sat).toBeDefined();
    });

    it('returns day for short form "sun"', () => {
      const result = parseDateQuery('sun');
      expect(result.length).toBeGreaterThan(0);
      const sun = result.find(r => r.name === 'Sunday');
      expect(sun).toBeDefined();
    });

    it('case insensitive: "MONDAY"', () => {
      const result = parseDateQuery('MONDAY');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Monday');
      expect(mon).toBeDefined();
    });

    it('partial match: "m" could match Monday', () => {
      const result = parseDateQuery('m');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Monday');
      expect(mon).toBeDefined();
    });

    it('partial match: "f" could match Friday', () => {
      const result = parseDateQuery('f');
      expect(result.length).toBeGreaterThan(0);
      const fri = result.find(r => r.name === 'Friday');
      expect(fri).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // 5. "next <day>" patterns
  // -------------------------------------------------------------------------
  describe('"next <day>" patterns', () => {
    it('returns Next Monday for "next monday"', () => {
      const result = parseDateQuery('next monday');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Next Monday');
      expect(mon).toBeDefined();
      expect(mon.date).toBe(getNextWeekdayFromTomorrow(1));
    });

    it('returns Next Friday for "next friday"', () => {
      const result = parseDateQuery('next friday');
      expect(result.length).toBeGreaterThan(0);
      const fri = result.find(r => r.name === 'Next Friday');
      expect(fri).toBeDefined();
      expect(fri.date).toBe(getNextWeekdayFromTomorrow(5));
    });

    it('returns Next Saturday for "next saturday"', () => {
      const result = parseDateQuery('next saturday');
      expect(result.length).toBeGreaterThan(0);
      const sat = result.find(r => r.name === 'Next Saturday');
      expect(sat).toBeDefined();
      expect(sat.date).toBe(getNextWeekdayFromTomorrow(6));
    });

    it('returns Next Sunday for "next sunday"', () => {
      const result = parseDateQuery('next sunday');
      expect(result.length).toBeGreaterThan(0);
      const sun = result.find(r => r.name === 'Next Sunday');
      expect(sun).toBeDefined();
      expect(sun.date).toBe(getNextWeekdayFromTomorrow(0));
    });

    it('returns Next day for "next tue"', () => {
      const result = parseDateQuery('next tue');
      expect(result.length).toBeGreaterThan(0);
      const tue = result.find(r => r.name === 'Next Tuesday');
      expect(tue).toBeDefined();
    });

    it('returns Next day for "next wed"', () => {
      const result = parseDateQuery('next wed');
      expect(result.length).toBeGreaterThan(0);
      const wed = result.find(r => r.name === 'Next Wednesday');
      expect(wed).toBeDefined();
    });

    it('returns Next day for "next thu"', () => {
      const result = parseDateQuery('next thu');
      expect(result.length).toBeGreaterThan(0);
      const thu = result.find(r => r.name === 'Next Thursday');
      expect(thu).toBeDefined();
    });

    it('case insensitive: "NEXT MONDAY"', () => {
      const result = parseDateQuery('NEXT MONDAY');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Next Monday');
      expect(mon).toBeDefined();
    });

    it('partial match: "next m" matches Monday', () => {
      const result = parseDateQuery('next m');
      expect(result.length).toBeGreaterThan(0);
      const mon = result.find(r => r.name === 'Next Monday');
      expect(mon).toBeDefined();
    });

    it('partial match: "next f" matches Friday', () => {
      const result = parseDateQuery('next f');
      expect(result.length).toBeGreaterThan(0);
      const fri = result.find(r => r.name === 'Next Friday');
      expect(fri).toBeDefined();
    });

    it('"next" pattern excludes non-next day name results', () => {
      const result = parseDateQuery('next monday');
      // Should only have "Next Monday", not plain "Monday"
      const hasNextMonday = result.some(r => r.name === 'Next Monday');
      const hasMonday = result.some(r => r.name === 'Monday');
      expect(hasNextMonday).toBe(true);
      expect(hasMonday).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 6. "in N d/w/m" patterns with all units
  // -------------------------------------------------------------------------
  describe('"in N d/w/m" patterns', () => {
    it('returns "In 3 days" for "in 3 d"', () => {
      const result = parseDateQuery('in 3 d');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 3 days');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(3));
    });

    it('returns "In 1 day" for "in 1 day" (singular)', () => {
      const result = parseDateQuery('in 1 day');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 1 day');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(1));
    });

    it('returns "In 5 days" for "in 5 days"', () => {
      const result = parseDateQuery('in 5 days');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 5 days');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(5));
    });

    it('returns "In 2 weeks" for "in 2 w"', () => {
      const result = parseDateQuery('in 2 w');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 2 weeks');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(14));
    });

    it('returns "In 1 week" for "in 1 week" (singular)', () => {
      const result = parseDateQuery('in 1 week');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 1 week');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(7));
    });

    it('returns "In 3 weeks" for "in 3 weeks"', () => {
      const result = parseDateQuery('in 3 weeks');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 3 weeks');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(21));
    });

    it('returns "In 1 month" for "in 1 m" (singular)', () => {
      const result = parseDateQuery('in 1 m');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 1 month');
      expect(match).toBeDefined();
      // Verify it's approximately 30 days ahead (month logic varies)
      expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns "In 2 months" for "in 2 month"', () => {
      const result = parseDateQuery('in 2 month');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 2 months');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns "In 6 months" for "in 6 months"', () => {
      const result = parseDateQuery('in 6 months');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 6 months');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('case insensitive: "IN 3 DAYS"', () => {
      const result = parseDateQuery('IN 3 DAYS');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 3 days');
      expect(match).toBeDefined();
    });

    it('handles large numbers: "in 100 days"', () => {
      const result = parseDateQuery('in 100 days');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'In 100 days');
      expect(match).toBeDefined();
      expect(match.date).toBe(addDaysToToday(100));
    });
  });

  // -------------------------------------------------------------------------
  // 7. Partial "in N" defaults to days when no unit specified
  // -------------------------------------------------------------------------
  describe('partial "in N" without unit', () => {
    it('returns days suggestion for "in 3" (defaults to days)', () => {
      const result = parseDateQuery('in 3');
      // Without a unit, defaults to days only
      const days = result.find(r => r.name === 'In 3 days');
      expect(days).toBeDefined();
      expect(days.date).toBe(addDaysToToday(3));
    });

    it('suggests correct date for "in 7" (defaults to days)', () => {
      const result = parseDateQuery('in 7');
      const days = result.find(r => r.name === 'In 7 days');
      expect(days).toBeDefined();
      expect(days.date).toBe(addDaysToToday(7));
    });

    it('handles "in 1" with singular form (defaults to days)', () => {
      const result = parseDateQuery('in 1');
      const days = result.find(r => r.name === 'In 1 day');
      expect(days).toBeDefined();
      expect(days.date).toBe(addDaysToToday(1));
    });

    it('handles "in 2" with plural form (defaults to days)', () => {
      const result = parseDateQuery('in 2');
      const days = result.find(r => r.name === 'In 2 days');
      expect(days).toBeDefined();
      expect(days.date).toBe(addDaysToToday(2));
    });

    it('case insensitive: "IN 5"', () => {
      const result = parseDateQuery('IN 5');
      expect(result.length).toBeGreaterThan(0);
      const days = result.find(r => r.name === 'In 5 days');
      expect(days).toBeDefined();
    });

    it('"in 10 days" returns only days when unit is specified', () => {
      const result = parseDateQuery('in 10 days');
      // Should only have "In 10 days", not weeks/months
      const days = result.find(r => r.name === 'In 10 days');
      const weeks = result.find(r => r.name === 'In 10 weeks');
      const months = result.find(r => r.name === 'In 10 months');
      expect(days).toBeDefined();
      expect(weeks).toBeUndefined();
      expect(months).toBeUndefined();
    });

    it('"in 10 w" returns only weeks when unit is specified', () => {
      const result = parseDateQuery('in 10 w');
      const days = result.find(r => r.name === 'In 10 days');
      const weeks = result.find(r => r.name === 'In 10 weeks');
      const months = result.find(r => r.name === 'In 10 months');
      expect(days).toBeUndefined();
      expect(weeks).toBeDefined();
      expect(months).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // 8. Month+day patterns (jan 15, feb 3)
  // -------------------------------------------------------------------------
  describe('month+day patterns', () => {
    it('returns "Jan 15" for "jan 15"', () => {
      const result = parseDateQuery('jan 15');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Jan 15');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-01-15$/);
    });

    it('returns "Feb 3" for "feb 3"', () => {
      const result = parseDateQuery('feb 3');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Feb 3');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-02-03$/);
    });

    it('returns "Mar 1" for "mar 1"', () => {
      const result = parseDateQuery('mar 1');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Mar 1');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-03-01$/);
    });

    it('returns "Dec 25" for "dec 25"', () => {
      const result = parseDateQuery('dec 25');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Dec 25');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-12-25$/);
    });

    it('supports full month names: "january 10"', () => {
      const result = parseDateQuery('january 10');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Jan 10');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-01-10$/);
    });

    it('supports full month names: "february 28"', () => {
      const result = parseDateQuery('february 28');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Feb 28');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-02-28$/);
    });

    it('handles past dates by adding 1 year', () => {
      // If today is after Jan 1, "jan 1" should give next year's Jan 1
      const today = new Date();
      const todayStr = getTodayString();
      const result = parseDateQuery('jan 1');
      const match = result.find(r => r.name === 'Jan 1');
      expect(match).toBeDefined();

      // Check if the date is in the future or next year
      const matchDate = new Date(match.date + 'T00:00:00');
      const todayDate = new Date(todayStr + 'T00:00:00');
      expect(matchDate >= todayDate).toBe(true);
    });

    it('case insensitive: "JAN 15"', () => {
      const result = parseDateQuery('JAN 15');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Jan 15');
      expect(match).toBeDefined();
    });

    it('handles single-digit days: "apr 5"', () => {
      const result = parseDateQuery('apr 5');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Apr 5');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-04-05$/);
    });

    it('handles two-digit days: "may 31"', () => {
      const result = parseDateQuery('may 31');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'May 31');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-05-31$/);
    });

    it('partial month match: "ju 15" could match June or July', () => {
      const result = parseDateQuery('ju 15');
      // Should match both June and July
      expect(result.length).toBeGreaterThan(0);
      // At least one should match
      const hasJune = result.some(r => r.name === 'Jun 15');
      const hasJuly = result.some(r => r.name === 'Jul 15');
      expect(hasJune || hasJuly).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // 9. Max results capped at 5
  // -------------------------------------------------------------------------
  describe('max results limit', () => {
    it('returns at most 5 results for any query', () => {
      // Query that could match many things
      const result = parseDateQuery('m');
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('returns within limit for "in N" pattern', () => {
      const result = parseDateQuery('in 3');
      // Should have days only (default), capped at 5
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('caps results even if many days match', () => {
      // A query that might match multiple days
      const result = parseDateQuery('s'); // Could match Saturday, Sunday
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('default suggestions are exactly 4 (less than max)', () => {
      const result = parseDateQuery('');
      expect(result).toHaveLength(4);
    });
  });

  // -------------------------------------------------------------------------
  // 10. Non-matching queries return empty
  // -------------------------------------------------------------------------
  describe('non-matching queries', () => {
    it('returns empty array for gibberish', () => {
      const result = parseDateQuery('xyzqwerty');
      expect(result).toEqual([]);
    });

    it('returns empty array for numbers without "in"', () => {
      const result = parseDateQuery('42');
      expect(result).toEqual([]);
    });

    it('returns empty array for invalid date format', () => {
      const result = parseDateQuery('2026-01-15');
      // Raw date strings are not supported
      expect(result).toEqual([]);
    });

    it('returns empty array for partial invalid patterns', () => {
      const result = parseDateQuery('next xyzabc');
      expect(result).toEqual([]);
    });

    it('returns empty array for month without day', () => {
      const result = parseDateQuery('jan');
      // "jan" alone is not a valid month+day pattern
      expect(result).toEqual([]);
    });

    it('returns empty array for "in" without number', () => {
      const result = parseDateQuery('in days');
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // 11. Date format is always YYYY-MM-DD
  // -------------------------------------------------------------------------
  describe('date format validation', () => {
    it('all results have YYYY-MM-DD format', () => {
      const queries = ['today', 'tomorrow', 'next monday', 'in 5 days', 'jan 15', 'fri'];
      queries.forEach(q => {
        const result = parseDateQuery(q);
        result.forEach(r => {
          expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
      });
    });

    it('default suggestions have YYYY-MM-DD format', () => {
      const result = parseDateQuery('');
      result.forEach(r => {
        expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('month calculations produce valid dates', () => {
      const result = parseDateQuery('in 3 months');
      const match = result.find(r => r.name === 'In 3 months');
      expect(match.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Verify it's a parseable date
      const d = new Date(match.date + 'T00:00:00');
      expect(d.toString()).not.toBe('Invalid Date');
    });

    it('month+day produces valid dates', () => {
      // Test with Feb 28 which is always valid
      const result = parseDateQuery('feb 28');
      expect(result.length).toBeGreaterThan(0);
      const match = result.find(r => r.name === 'Feb 28');
      expect(match).toBeDefined();
      expect(match.date).toMatch(/^\d{4}-02-28$/);
      const d = new Date(match.date + 'T00:00:00');
      expect(d.toString()).not.toBe('Invalid Date');
    });
  });
});

// ============================================================================
// TESTS: removeInlineMeta
// ============================================================================

describe('removeInlineMeta', () => {
  beforeEach(() => {
    // Clear the meta Map before each test
    mockState.inlineAutocompleteMeta.clear();
    // Clear DOM
    document.body.innerHTML = '';
  });

  // -------------------------------------------------------------------------
  // Category removal
  // -------------------------------------------------------------------------
  it('removes category (areaId) when type is "category"', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: 'cat_123',
      categoryId: null,
      labels: [],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    removeInlineMeta(inputId, 'category', 'cat_123');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.areaId).toBe(null);
  });

  // -------------------------------------------------------------------------
  // Label removal
  // -------------------------------------------------------------------------
  it('removes label from labels array', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: ['label_1', 'label_2', 'label_3'],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    removeInlineMeta(inputId, 'label', 'label_2');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.labels).toEqual(['label_1', 'label_3']);
  });

  it('removes label and preserves other labels', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: ['label_1'],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    removeInlineMeta(inputId, 'label', 'label_1');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.labels).toEqual([]);
  });

  it('does nothing if label does not exist in array', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: ['label_1'],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    removeInlineMeta(inputId, 'label', 'label_999');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.labels).toEqual(['label_1']);
  });

  // -------------------------------------------------------------------------
  // Person removal
  // -------------------------------------------------------------------------
  it('removes person from people array', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: [],
      people: ['person_1', 'person_2', 'person_3'],
      deferDate: null,
      dueDate: null,
    });

    removeInlineMeta(inputId, 'person', 'person_2');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.people).toEqual(['person_1', 'person_3']);
  });

  it('removes person and preserves other people', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: [],
      people: ['person_1'],
      deferDate: null,
      dueDate: null,
    });

    removeInlineMeta(inputId, 'person', 'person_1');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.people).toEqual([]);
  });

  // -------------------------------------------------------------------------
  // Defer date removal
  // -------------------------------------------------------------------------
  it('removes deferDate when type is "deferDate"', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: [],
      people: [],
      deferDate: '2026-03-15',
      dueDate: null,
    });

    removeInlineMeta(inputId, 'deferDate', '');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.deferDate).toBe(null);
  });

  // -------------------------------------------------------------------------
  // Due date removal
  // -------------------------------------------------------------------------
  it('removes dueDate when type is "dueDate"', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: [],
      people: [],
      deferDate: null,
      dueDate: '2026-04-20',
    });

    removeInlineMeta(inputId, 'dueDate', '');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.dueDate).toBe(null);
  });

  // -------------------------------------------------------------------------
  // Missing inputId handling
  // -------------------------------------------------------------------------
  it('returns gracefully when inputId does not exist in Map', () => {
    // Should not throw
    expect(() => removeInlineMeta('nonexistent', 'label', 'label_1')).not.toThrow();
  });

  it('does nothing when inputId does not exist', () => {
    const sizeBefore = mockState.inlineAutocompleteMeta.size;
    removeInlineMeta('nonexistent', 'label', 'label_1');
    const sizeAfter = mockState.inlineAutocompleteMeta.size;
    expect(sizeAfter).toBe(sizeBefore);
  });

  // -------------------------------------------------------------------------
  // Combined metadata preservation
  // -------------------------------------------------------------------------
  it('preserves other metadata when removing one field', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: 'cat_1',
      categoryId: 'cat_2',
      labels: ['label_1', 'label_2'],
      people: ['person_1'],
      deferDate: '2026-03-01',
      dueDate: '2026-04-01',
    });

    removeInlineMeta(inputId, 'label', 'label_1');

    const meta = mockState.inlineAutocompleteMeta.get(inputId);
    expect(meta.areaId).toBe('cat_1');
    expect(meta.categoryId).toBe('cat_2');
    expect(meta.labels).toEqual(['label_2']);
    expect(meta.people).toEqual(['person_1']);
    expect(meta.deferDate).toBe('2026-03-01');
    expect(meta.dueDate).toBe('2026-04-01');
  });
});

// ============================================================================
// TESTS: cleanupInlineAutocomplete
// ============================================================================

describe('cleanupInlineAutocomplete', () => {
  beforeEach(() => {
    mockState.inlineAutocompleteMeta.clear();
    document.body.innerHTML = '';
  });

  it('removes metadata from Map', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: 'cat_1',
      categoryId: null,
      labels: [],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    expect(mockState.inlineAutocompleteMeta.has(inputId)).toBe(true);
    cleanupInlineAutocomplete(inputId);
    expect(mockState.inlineAutocompleteMeta.has(inputId)).toBe(false);
  });

  it('removes chips DOM element', () => {
    const inputId = 'test-input';
    document.body.innerHTML = `
      <div>
        <input id="${inputId}" />
        <div id="${inputId}-chips">Some chips</div>
      </div>
    `;

    expect(document.getElementById(`${inputId}-chips`)).not.toBe(null);
    cleanupInlineAutocomplete(inputId);
    expect(document.getElementById(`${inputId}-chips`)).toBe(null);
  });

  it('removes popup elements from DOM', () => {
    document.body.innerHTML = `
      <div class="inline-autocomplete-popup">Popup 1</div>
      <div class="inline-autocomplete-popup">Popup 2</div>
    `;

    expect(document.querySelectorAll('.inline-autocomplete-popup').length).toBe(2);
    cleanupInlineAutocomplete('any-input');
    expect(document.querySelectorAll('.inline-autocomplete-popup').length).toBe(0);
  });

  it('handles cleanup when chips element does not exist', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: 'cat_1',
      categoryId: null,
      labels: [],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    // No chips element in DOM
    expect(() => cleanupInlineAutocomplete(inputId)).not.toThrow();
    expect(mockState.inlineAutocompleteMeta.has(inputId)).toBe(false);
  });

  it('handles cleanup when no popups exist', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: null,
      categoryId: null,
      labels: [],
      people: [],
      deferDate: null,
      dueDate: null,
    });

    // No popups in DOM
    expect(() => cleanupInlineAutocomplete(inputId)).not.toThrow();
    expect(mockState.inlineAutocompleteMeta.has(inputId)).toBe(false);
  });

  it('handles cleanup when inputId does not exist in Map', () => {
    // Should not throw
    expect(() => cleanupInlineAutocomplete('nonexistent')).not.toThrow();
  });

  it('cleans up both metadata and DOM elements in single call', () => {
    const inputId = 'test-input';
    mockState.inlineAutocompleteMeta.set(inputId, {
      areaId: 'cat_1',
      categoryId: null,
      labels: ['label_1'],
      people: [],
      deferDate: null,
      dueDate: null,
    });
    document.body.innerHTML = `
      <div>
        <input id="${inputId}" />
        <div id="${inputId}-chips">Chips</div>
      </div>
      <div class="inline-autocomplete-popup">Popup</div>
    `;

    cleanupInlineAutocomplete(inputId);

    expect(mockState.inlineAutocompleteMeta.has(inputId)).toBe(false);
    expect(document.getElementById(`${inputId}-chips`)).toBe(null);
    expect(document.querySelectorAll('.inline-autocomplete-popup').length).toBe(0);
  });

  it('only removes target chips element, not others', () => {
    const inputId = 'test-input';
    document.body.innerHTML = `
      <div>
        <input id="${inputId}" />
        <div id="${inputId}-chips">Target chips</div>
        <div id="other-input-chips">Other chips</div>
      </div>
    `;

    cleanupInlineAutocomplete(inputId);

    expect(document.getElementById(`${inputId}-chips`)).toBe(null);
    expect(document.getElementById('other-input-chips')).not.toBe(null);
  });

  it('removes all popup elements regardless of inputId', () => {
    document.body.innerHTML = `
      <div class="inline-autocomplete-popup">Popup A</div>
      <div class="inline-autocomplete-popup">Popup B</div>
      <div class="inline-autocomplete-popup">Popup C</div>
    `;

    cleanupInlineAutocomplete('any-input');

    expect(document.querySelectorAll('.inline-autocomplete-popup').length).toBe(0);
  });
});
