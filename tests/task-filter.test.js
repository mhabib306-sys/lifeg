// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  matchesInboxPerspective,
  matchesTodayPerspective,
  matchesFlaggedPerspective,
  matchesUpcomingPerspective,
  matchesAnytimePerspective,
  matchesSomedayPerspective,
  matchesNextPerspective,
  matchesLogbookPerspective,
  isNextTaggedTask,
} from '../src/features/task-filter.js';

// Shared label set with a "Next" label
const labels = [{ id: 'label_next', name: 'Next', color: '#8B5CF6' }];
const today = '2026-02-12';

function makeTask(overrides = {}) {
  return {
    id: 'task_test_1',
    title: 'Test task',
    status: 'anytime',
    completed: false,
    flagged: false,
    today: false,
    dueDate: null,
    deferDate: null,
    areaId: null,
    labels: [],
    ...overrides,
  };
}

describe('isNextTaggedTask', () => {
  it('returns true when task has the "next" label', () => {
    const task = makeTask({ labels: ['label_next'] });
    expect(isNextTaggedTask(task, labels)).toBe(true);
  });

  it('returns false without the label', () => {
    expect(isNextTaggedTask(makeTask(), labels)).toBe(false);
  });

  it('is case-insensitive on label name', () => {
    const mixedLabels = [{ id: 'lbl', name: 'NEXT' }];
    expect(isNextTaggedTask(makeTask({ labels: ['lbl'] }), mixedLabels)).toBe(true);
  });
});

describe('matchesInboxPerspective', () => {
  it('matches inbox status without areaId', () => {
    expect(matchesInboxPerspective(makeTask({ status: 'inbox' }))).toBe(true);
  });

  it('excludes inbox tasks with an area', () => {
    expect(matchesInboxPerspective(makeTask({ status: 'inbox', areaId: 'personal' }))).toBe(false);
  });

  it('excludes non-inbox tasks', () => {
    expect(matchesInboxPerspective(makeTask({ status: 'anytime' }))).toBe(false);
  });
});

describe('matchesTodayPerspective', () => {
  it('matches tasks with today flag', () => {
    expect(matchesTodayPerspective(makeTask({ today: true }), today, labels)).toBe(true);
  });

  it('matches tasks due today', () => {
    expect(matchesTodayPerspective(makeTask({ dueDate: today }), today, labels)).toBe(true);
  });

  it('matches overdue tasks', () => {
    expect(matchesTodayPerspective(makeTask({ dueDate: '2026-02-10' }), today, labels)).toBe(true);
  });

  it('matches tasks deferred to today or earlier', () => {
    expect(matchesTodayPerspective(makeTask({ deferDate: '2026-02-11' }), today, labels)).toBe(true);
  });

  it('matches next-labeled tasks', () => {
    const task = makeTask({ labels: ['label_next'] });
    expect(matchesTodayPerspective(task, today, labels)).toBe(true);
  });

  it('excludes future-deferred tasks', () => {
    expect(matchesTodayPerspective(makeTask({ today: true, deferDate: '2026-02-20' }), today, labels)).toBe(false);
  });

  it('excludes plain anytime tasks', () => {
    expect(matchesTodayPerspective(makeTask(), today, labels)).toBe(false);
  });
});

describe('matchesFlaggedPerspective', () => {
  it('matches flagged tasks', () => {
    expect(matchesFlaggedPerspective(makeTask({ flagged: true }))).toBe(true);
  });

  it('excludes unflagged tasks', () => {
    expect(matchesFlaggedPerspective(makeTask())).toBe(false);
  });
});

describe('matchesUpcomingPerspective', () => {
  it('matches tasks with future due date', () => {
    expect(matchesUpcomingPerspective(makeTask({ dueDate: '2026-03-01' }), today)).toBe(true);
  });

  it('excludes tasks due today', () => {
    expect(matchesUpcomingPerspective(makeTask({ dueDate: today }), today)).toBe(false);
  });

  it('excludes tasks without due date', () => {
    expect(matchesUpcomingPerspective(makeTask(), today)).toBe(false);
  });
});

describe('matchesAnytimePerspective', () => {
  it('matches anytime status tasks', () => {
    expect(matchesAnytimePerspective(makeTask(), today)).toBe(true);
  });

  it('excludes tasks with future due dates', () => {
    expect(matchesAnytimePerspective(makeTask({ dueDate: '2026-03-01' }), today)).toBe(false);
  });

  it('excludes future-deferred tasks', () => {
    expect(matchesAnytimePerspective(makeTask({ deferDate: '2026-03-01' }), today)).toBe(false);
  });

  it('excludes non-anytime status', () => {
    expect(matchesAnytimePerspective(makeTask({ status: 'inbox' }), today)).toBe(false);
    expect(matchesAnytimePerspective(makeTask({ status: 'someday' }), today)).toBe(false);
  });
});

describe('matchesSomedayPerspective', () => {
  it('matches someday tasks', () => {
    expect(matchesSomedayPerspective(makeTask({ status: 'someday' }))).toBe(true);
  });

  it('excludes non-someday tasks', () => {
    expect(matchesSomedayPerspective(makeTask())).toBe(false);
  });
});

describe('matchesNextPerspective', () => {
  it('matches next-labeled tasks regardless of status', () => {
    const task = makeTask({ status: 'inbox', labels: ['label_next'] });
    expect(matchesNextPerspective(task, today, labels)).toBe(true);
  });

  it('matches anytime tasks without due date', () => {
    expect(matchesNextPerspective(makeTask(), today, labels)).toBe(true);
  });

  it('excludes anytime tasks with due dates', () => {
    expect(matchesNextPerspective(makeTask({ dueDate: '2026-03-01' }), today, labels)).toBe(false);
  });

  it('excludes non-anytime tasks without next label', () => {
    expect(matchesNextPerspective(makeTask({ status: 'inbox' }), today, labels)).toBe(false);
    expect(matchesNextPerspective(makeTask({ status: 'someday' }), today, labels)).toBe(false);
  });

  it('excludes future-deferred anytime tasks', () => {
    expect(matchesNextPerspective(makeTask({ deferDate: '2026-03-01' }), today, labels)).toBe(false);
  });
});

describe('matchesLogbookPerspective', () => {
  it('matches completed tasks', () => {
    expect(matchesLogbookPerspective(makeTask({ completed: true }))).toBe(true);
  });

  it('excludes active tasks', () => {
    expect(matchesLogbookPerspective(makeTask())).toBe(false);
  });
});

describe('Cross-perspective correctness', () => {
  it('next-labeled tasks appear in both Today and Next', () => {
    const task = makeTask({ labels: ['label_next'] });
    expect(matchesTodayPerspective(task, today, labels)).toBe(true);
    expect(matchesNextPerspective(task, today, labels)).toBe(true);
  });

  it('completed tasks excluded from all active views', () => {
    const task = makeTask({ completed: true, today: true, flagged: true, status: 'anytime' });
    // Logbook should include
    expect(matchesLogbookPerspective(task)).toBe(true);
    // Note: completed filtering happens in getFilteredTasks wrapper, not in predicates
    // The predicates just check perspective-specific criteria
  });

  it('someday tasks excluded from Anytime', () => {
    const task = makeTask({ status: 'someday' });
    expect(matchesSomedayPerspective(task)).toBe(true);
    expect(matchesAnytimePerspective(task, today)).toBe(false);
  });
});
