// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---- Mocks (hoisted) ----
const { mockState } = vi.hoisted(() => ({
  mockState: {
    calendarMonth: 1,
    calendarYear: 2026,
    calendarSelectedDate: '2026-02-12',
    calendarViewMode: 'month',
    tasksData: [],
  },
}));

vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/utils.js', () => ({
  getLocalDateString: (d) => {
    const dt = d || new Date();
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  },
}));

import {
  calendarPrevMonth,
  calendarNextMonth,
  calendarGoToday,
  setCalendarViewMode,
  calendarSelectDate,
  getTasksForDate,
} from '../src/features/calendar.js';

// ---- Setup ----
beforeEach(() => {
  mockState.calendarMonth = 1;       // February (0-indexed)
  mockState.calendarYear = 2026;
  mockState.calendarSelectedDate = '2026-02-12';
  mockState.calendarViewMode = 'month';
  mockState.tasksData = [];
  window.render = vi.fn();
  window.isGCalConnected = vi.fn(() => false);
  window.syncGCalNow = vi.fn();
});

// ============================================================================
// calendarPrevMonth
// ============================================================================
describe('calendarPrevMonth', () => {
  describe('month view', () => {
    it('decrements month by 1', () => {
      calendarPrevMonth();
      expect(mockState.calendarMonth).toBe(0);
      expect(mockState.calendarYear).toBe(2026);
    });

    it('wraps from January to December of previous year', () => {
      mockState.calendarMonth = 0; // January
      calendarPrevMonth();
      expect(mockState.calendarMonth).toBe(11);
      expect(mockState.calendarYear).toBe(2025);
    });

    it('calls render()', () => {
      calendarPrevMonth();
      expect(window.render).toHaveBeenCalledOnce();
    });

    it('does not call syncGCalNow when GCal is disconnected', () => {
      calendarPrevMonth();
      expect(window.syncGCalNow).not.toHaveBeenCalled();
    });

    it('calls syncGCalNow when GCal is connected', () => {
      window.isGCalConnected = vi.fn(() => true);
      calendarPrevMonth();
      expect(window.syncGCalNow).toHaveBeenCalledOnce();
    });
  });

  describe('week view', () => {
    beforeEach(() => { mockState.calendarViewMode = 'week'; });

    it('shifts selected date back by 7 days', () => {
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-05');
    });

    it('updates month/year when crossing month boundary', () => {
      mockState.calendarSelectedDate = '2026-02-03';
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-01-27');
      expect(mockState.calendarMonth).toBe(0);
      expect(mockState.calendarYear).toBe(2026);
    });

    it('calls render()', () => {
      calendarPrevMonth();
      expect(window.render).toHaveBeenCalledOnce();
    });
  });

  describe('weekgrid view', () => {
    beforeEach(() => { mockState.calendarViewMode = 'weekgrid'; });

    it('shifts selected date back by 7 days', () => {
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-05');
    });

    it('updates month/year when crossing year boundary', () => {
      mockState.calendarSelectedDate = '2026-01-03';
      mockState.calendarMonth = 0;
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2025-12-27');
      expect(mockState.calendarMonth).toBe(11);
      expect(mockState.calendarYear).toBe(2025);
    });
  });

  describe('daygrid view', () => {
    beforeEach(() => { mockState.calendarViewMode = 'daygrid'; });

    it('shifts selected date back by 1 day', () => {
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-11');
    });

    it('updates month when crossing month boundary', () => {
      mockState.calendarSelectedDate = '2026-02-01';
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-01-31');
      expect(mockState.calendarMonth).toBe(0);
    });
  });

  describe('3days view', () => {
    beforeEach(() => { mockState.calendarViewMode = '3days'; });

    it('shifts selected date back by 3 days', () => {
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-09');
    });

    it('updates month when crossing month boundary', () => {
      mockState.calendarSelectedDate = '2026-02-02';
      calendarPrevMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-01-30');
      expect(mockState.calendarMonth).toBe(0);
    });
  });
});

// ============================================================================
// calendarNextMonth
// ============================================================================
describe('calendarNextMonth', () => {
  describe('month view', () => {
    it('increments month by 1', () => {
      calendarNextMonth();
      expect(mockState.calendarMonth).toBe(2);
      expect(mockState.calendarYear).toBe(2026);
    });

    it('wraps from December to January of next year', () => {
      mockState.calendarMonth = 11; // December
      calendarNextMonth();
      expect(mockState.calendarMonth).toBe(0);
      expect(mockState.calendarYear).toBe(2027);
    });

    it('calls render()', () => {
      calendarNextMonth();
      expect(window.render).toHaveBeenCalledOnce();
    });

    it('calls syncGCalNow when GCal is connected', () => {
      window.isGCalConnected = vi.fn(() => true);
      calendarNextMonth();
      expect(window.syncGCalNow).toHaveBeenCalledOnce();
    });
  });

  describe('week view', () => {
    beforeEach(() => { mockState.calendarViewMode = 'week'; });

    it('shifts selected date forward by 7 days', () => {
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-19');
    });

    it('updates month when crossing into next month', () => {
      mockState.calendarSelectedDate = '2026-02-25';
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-03-04');
      expect(mockState.calendarMonth).toBe(2);
    });
  });

  describe('weekgrid view', () => {
    beforeEach(() => { mockState.calendarViewMode = 'weekgrid'; });

    it('shifts selected date forward by 7 days', () => {
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-19');
    });

    it('updates year when crossing year boundary', () => {
      mockState.calendarSelectedDate = '2026-12-28';
      mockState.calendarMonth = 11;
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2027-01-04');
      expect(mockState.calendarMonth).toBe(0);
      expect(mockState.calendarYear).toBe(2027);
    });
  });

  describe('daygrid view', () => {
    beforeEach(() => { mockState.calendarViewMode = 'daygrid'; });

    it('shifts selected date forward by 1 day', () => {
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-13');
    });

    it('updates month when crossing into next month', () => {
      mockState.calendarSelectedDate = '2026-02-28';
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-03-01');
      expect(mockState.calendarMonth).toBe(2);
    });
  });

  describe('3days view', () => {
    beforeEach(() => { mockState.calendarViewMode = '3days'; });

    it('shifts selected date forward by 3 days', () => {
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-02-15');
    });

    it('updates month when crossing into next month', () => {
      mockState.calendarSelectedDate = '2026-02-27';
      calendarNextMonth();
      expect(mockState.calendarSelectedDate).toBe('2026-03-02');
      expect(mockState.calendarMonth).toBe(2);
    });
  });
});

// ============================================================================
// calendarGoToday
// ============================================================================
describe('calendarGoToday', () => {
  it('resets month and year to current date values', () => {
    mockState.calendarMonth = 5;
    mockState.calendarYear = 2024;
    calendarGoToday();
    const now = new Date();
    expect(mockState.calendarMonth).toBe(now.getMonth());
    expect(mockState.calendarYear).toBe(now.getFullYear());
  });

  it('sets calendarSelectedDate to today', () => {
    mockState.calendarSelectedDate = '2020-01-01';
    calendarGoToday();
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    expect(mockState.calendarSelectedDate).toBe(expected);
  });

  it('calls render()', () => {
    calendarGoToday();
    expect(window.render).toHaveBeenCalledOnce();
  });
});

// ============================================================================
// setCalendarViewMode
// ============================================================================
describe('setCalendarViewMode', () => {
  it('sets mode to "month"', () => {
    mockState.calendarViewMode = 'week';
    setCalendarViewMode('month');
    expect(mockState.calendarViewMode).toBe('month');
  });

  it('sets mode to "week"', () => {
    setCalendarViewMode('week');
    expect(mockState.calendarViewMode).toBe('week');
  });

  it('sets mode to "3days"', () => {
    setCalendarViewMode('3days');
    expect(mockState.calendarViewMode).toBe('3days');
  });

  it('sets mode to "daygrid"', () => {
    setCalendarViewMode('daygrid');
    expect(mockState.calendarViewMode).toBe('daygrid');
  });

  it('sets mode to "weekgrid"', () => {
    setCalendarViewMode('weekgrid');
    expect(mockState.calendarViewMode).toBe('weekgrid');
  });

  it('rejects invalid mode and keeps current', () => {
    mockState.calendarViewMode = 'month';
    setCalendarViewMode('invalid');
    expect(mockState.calendarViewMode).toBe('month');
  });

  it('rejects empty string', () => {
    mockState.calendarViewMode = 'week';
    setCalendarViewMode('');
    expect(mockState.calendarViewMode).toBe('week');
  });

  it('does not call render() for invalid mode', () => {
    setCalendarViewMode('bogus');
    expect(window.render).not.toHaveBeenCalled();
  });

  it('calls render() for valid mode', () => {
    setCalendarViewMode('week');
    expect(window.render).toHaveBeenCalledOnce();
  });

  it('calls syncGCalNow when GCal is connected', () => {
    window.isGCalConnected = vi.fn(() => true);
    setCalendarViewMode('3days');
    expect(window.syncGCalNow).toHaveBeenCalledOnce();
  });
});

// ============================================================================
// calendarSelectDate
// ============================================================================
describe('calendarSelectDate', () => {
  it('sets calendarSelectedDate for valid date', () => {
    calendarSelectDate('2026-03-15');
    expect(mockState.calendarSelectedDate).toBe('2026-03-15');
  });

  it('updates month and year when selecting a date in a different month', () => {
    calendarSelectDate('2025-11-20');
    expect(mockState.calendarMonth).toBe(10); // November = 10
    expect(mockState.calendarYear).toBe(2025);
  });

  it('does not change month/year if selected date is in the same month', () => {
    calendarSelectDate('2026-02-20');
    expect(mockState.calendarMonth).toBe(1);
    expect(mockState.calendarYear).toBe(2026);
  });

  it('calls render() for valid date', () => {
    calendarSelectDate('2026-04-01');
    expect(window.render).toHaveBeenCalledOnce();
  });

  it('rejects date with wrong format (no leading zeros)', () => {
    calendarSelectDate('2026-2-5');
    expect(mockState.calendarSelectedDate).toBe('2026-02-12'); // unchanged
    expect(window.render).not.toHaveBeenCalled();
  });

  it('rejects non-date string', () => {
    calendarSelectDate('not-a-date');
    expect(mockState.calendarSelectedDate).toBe('2026-02-12');
    expect(window.render).not.toHaveBeenCalled();
  });

  it('rejects empty string', () => {
    calendarSelectDate('');
    expect(mockState.calendarSelectedDate).toBe('2026-02-12');
    expect(window.render).not.toHaveBeenCalled();
  });

  it('handles date at year boundary (switching to next year)', () => {
    calendarSelectDate('2027-01-05');
    expect(mockState.calendarMonth).toBe(0);
    expect(mockState.calendarYear).toBe(2027);
  });

  it('handles date at year boundary (switching to previous year)', () => {
    calendarSelectDate('2025-12-25');
    expect(mockState.calendarMonth).toBe(11);
    expect(mockState.calendarYear).toBe(2025);
  });
});

// ============================================================================
// getTasksForDate
// ============================================================================
describe('getTasksForDate', () => {
  function makeTask(overrides = {}) {
    return {
      id: 'task_' + Math.random().toString(36).slice(2, 8),
      title: 'Test task',
      completed: false,
      isNote: false,
      dueDate: null,
      deferDate: null,
      ...overrides,
    };
  }

  it('returns tasks matching by dueDate', () => {
    mockState.tasksData = [makeTask({ dueDate: '2026-02-12' })];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(1);
  });

  it('returns tasks matching by deferDate', () => {
    mockState.tasksData = [makeTask({ deferDate: '2026-02-12' })];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(1);
  });

  it('returns tasks matching by either dueDate or deferDate', () => {
    mockState.tasksData = [
      makeTask({ dueDate: '2026-02-12' }),
      makeTask({ deferDate: '2026-02-12' }),
    ];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(2);
  });

  it('excludes completed tasks', () => {
    mockState.tasksData = [makeTask({ dueDate: '2026-02-12', completed: true })];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(0);
  });

  it('excludes note-type tasks', () => {
    mockState.tasksData = [makeTask({ dueDate: '2026-02-12', isNote: true })];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(0);
  });

  it('excludes tasks with non-matching dates', () => {
    mockState.tasksData = [makeTask({ dueDate: '2026-02-13' })];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(0);
  });

  it('returns empty array when no tasks exist', () => {
    mockState.tasksData = [];
    const result = getTasksForDate('2026-02-12');
    expect(result).toEqual([]);
  });

  it('handles task with both dueDate and deferDate on the query date (returns once)', () => {
    const task = makeTask({ dueDate: '2026-02-12', deferDate: '2026-02-12' });
    mockState.tasksData = [task];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(1);
  });

  it('handles a mix of matching and non-matching tasks', () => {
    mockState.tasksData = [
      makeTask({ dueDate: '2026-02-12' }),
      makeTask({ dueDate: '2026-02-13' }),
      makeTask({ deferDate: '2026-02-12' }),
      makeTask({ dueDate: '2026-02-12', completed: true }),
      makeTask({ dueDate: '2026-02-12', isNote: true }),
    ];
    const result = getTasksForDate('2026-02-12');
    expect(result).toHaveLength(2);
  });

  it('returns tasks with null dueDate but matching deferDate', () => {
    mockState.tasksData = [makeTask({ dueDate: null, deferDate: '2026-03-01' })];
    const result = getTasksForDate('2026-03-01');
    expect(result).toHaveLength(1);
  });
});
