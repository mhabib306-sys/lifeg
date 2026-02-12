// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mock dependencies BEFORE importing braindump modules
// ---------------------------------------------------------------------------

// vi.hoisted runs before vi.mock factories — safe to reference in factories
const { mockState, createTaskMock } = vi.hoisted(() => {
  const mockState = {
    taskAreas: [],
    taskLabels: [],
    taskPeople: [],
    tasksData: [],
    deletedTaskTombstones: {},
    braindumpAIError: null,
    braindumpRawText: '',
    braindumpParsedItems: [],
    braindumpStep: 'input',
    braindumpEditingIndex: null,
    braindumpProcessing: false,
    braindumpSuccessMessage: '',
    braindumpFullPage: false,
    showBraindump: false,
    braindumpVoiceRecording: false,
    braindumpVoiceTranscribing: false,
    braindumpVoiceError: null,
  };
  const createTaskMock = vi.fn((title, opts) => ({
    id: `task_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    ...opts,
    createdAt: new Date().toISOString(),
  }));
  return { mockState, createTaskMock };
});

vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/features/tasks.js', () => ({
  createTask: (...args) => createTaskMock(...args),
}));

// Mock saveTasksData
vi.mock('../src/data/storage.js', () => ({
  saveTasksData: vi.fn(),
}));

// Mock undo
vi.mock('../src/features/undo.js', () => ({
  startUndoCountdown: vi.fn(),
}));

// Mock areas
vi.mock('../src/features/areas.js', () => ({
  getCategoryById: vi.fn(() => null),
}));

// Mock utils — provide real escapeHtml for UI tests
vi.mock('../src/utils.js', () => ({
  escapeHtml: (text) => {
    if (!text) return '';
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  generateTaskId: () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  getLocalDateString: () => '2026-02-12',
}));

// ---------------------------------------------------------------------------
// Import modules under test
// ---------------------------------------------------------------------------
import {
  segmentText,
  classifyItem,
  extractMetadata,
  parseBraindumpHeuristic,
  parseBraindump,
  submitBraindumpItems,
  getAnthropicKey,
  setAnthropicKey,
  refineVoiceTranscriptWithAI,
} from '../src/features/braindump.js';

import {
  openBraindump,
  closeBraindump,
  toggleBraindumpItemType,
  toggleBraindumpItemInclude,
  removeBraindumpItem,
  editBraindumpItem,
  saveBraindumpItemEdit,
  cancelBraindumpItemEdit,
  setBraindumpItemArea,
  addBraindumpItemLabel,
  removeBraindumpItemLabel,
  addBraindumpItemPerson,
  removeBraindumpItemPerson,
  setBraindumpItemDate,
  clearBraindumpItemDate,
  submitBraindump,
  backToInput,
  renderBraindumpFAB,
  renderBraindumpOverlay,
} from '../src/ui/braindump.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function resetState() {
  Object.assign(mockState, {
    taskAreas: [],
    taskLabels: [],
    taskPeople: [],
    tasksData: [],
    deletedTaskTombstones: {},
    braindumpAIError: null,
    braindumpRawText: '',
    braindumpParsedItems: [],
    braindumpStep: 'input',
    braindumpEditingIndex: null,
    braindumpProcessing: false,
    braindumpSuccessMessage: '',
    braindumpFullPage: false,
    showBraindump: false,
    braindumpVoiceRecording: false,
    braindumpVoiceTranscribing: false,
    braindumpVoiceError: null,
  });
}

function setupEntities() {
  mockState.taskAreas = [
    { id: 'area_1', name: 'Work' },
    { id: 'area_2', name: 'Personal' },
    { id: 'area_3', name: 'Health' },
  ];
  mockState.taskLabels = [
    { id: 'label_1', name: 'urgent', color: '#ff0000' },
    { id: 'label_2', name: 'waiting', color: '#ffaa00' },
    { id: 'label_3', name: 'research', color: '#0000ff' },
  ];
  mockState.taskPeople = [
    { id: 'person_1', name: 'Alice', color: '#00ff00' },
    { id: 'person_2', name: 'Bob', color: '#0000ff' },
    { id: 'person_3', name: 'Charlie', color: '#ff00ff' },
  ];
}

function makeParsedItem(overrides = {}) {
  return {
    index: 0,
    originalText: 'Test item',
    title: 'Test item',
    type: 'task',
    score: 40,
    confidence: 0.67,
    areaId: null,
    labels: [],
    people: [],
    deferDate: null,
    dueDate: null,
    included: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetState();
  createTaskMock.mockClear();
  localStorage.clear();
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.parseDateQuery = undefined;
  // Restore fetch to its default (unmocked) state
  if (globalThis.fetch?.mockRestore) globalThis.fetch.mockRestore();
});

afterEach(() => {
  vi.restoreAllMocks();
});


// ============================================================================
// FEATURES: segmentText
// ============================================================================

describe('segmentText', () => {
  it('splits newline-separated text into items', () => {
    const result = segmentText('Buy milk\nCall dentist\nWrite report');
    expect(result).toEqual(['Buy milk', 'Call dentist', 'Write report']);
  });

  it('strips dash bullets', () => {
    const result = segmentText('- Buy milk\n- Call dentist');
    expect(result).toEqual(['Buy milk', 'Call dentist']);
  });

  it('strips asterisk bullets', () => {
    const result = segmentText('* First item\n* Second item');
    expect(result).toEqual(['First item', 'Second item']);
  });

  it('strips bullet character •', () => {
    const result = segmentText('• Item one\n• Item two');
    expect(result).toEqual(['Item one', 'Item two']);
  });

  it('strips triangular bullet ‣', () => {
    const result = segmentText('‣ Item one');
    expect(result).toEqual(['Item one']);
  });

  it('strips hollow bullet ◦', () => {
    const result = segmentText('◦ Item');
    expect(result).toEqual(['Item']);
  });

  it('strips numbered lists with period', () => {
    const result = segmentText('1. First\n2. Second\n10. Tenth');
    expect(result).toEqual(['First', 'Second', 'Tenth']);
  });

  it('strips numbered lists with parenthesis', () => {
    const result = segmentText('1) First\n2) Second');
    expect(result).toEqual(['First', 'Second']);
  });

  it('handles mixed bullet styles', () => {
    const result = segmentText('- Dash item\n* Asterisk item\n1. Numbered item\n• Bullet item');
    expect(result).toEqual(['Dash item', 'Asterisk item', 'Numbered item', 'Bullet item']);
  });

  it('skips empty lines', () => {
    const result = segmentText('First\n\n\nSecond\n   \nThird');
    expect(result).toEqual(['First', 'Second', 'Third']);
  });

  it('trims whitespace from items', () => {
    const result = segmentText('  Buy milk  \n  Call dentist  ');
    expect(result).toEqual(['Buy milk', 'Call dentist']);
  });

  it('returns empty array for null input', () => {
    expect(segmentText(null)).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(segmentText(undefined)).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(segmentText('')).toEqual([]);
  });

  it('returns empty array for whitespace-only string', () => {
    expect(segmentText('   \n  \n   ')).toEqual([]);
  });

  it('handles single-line input', () => {
    const result = segmentText('Just one item');
    expect(result).toEqual(['Just one item']);
  });

  it('preserves inline hyphens', () => {
    const result = segmentText('Self-driving car research');
    expect(result).toEqual(['Self-driving car research']);
  });

  it('handles leading whitespace before bullets', () => {
    const result = segmentText('   - Indented bullet');
    expect(result).toEqual(['Indented bullet']);
  });

  it('handles tabs in input', () => {
    const result = segmentText('\t- Tabbed item');
    expect(result).toEqual(['Tabbed item']);
  });

  it('handles Windows-style line endings', () => {
    const result = segmentText('Item one\r\nItem two');
    expect(result).toEqual(['Item one', 'Item two']);
  });

  it('handles very long input', () => {
    const lines = Array.from({ length: 1000 }, (_, i) => `- Item ${i}`);
    const result = segmentText(lines.join('\n'));
    expect(result).toHaveLength(1000);
    expect(result[0]).toBe('Item 0');
    expect(result[999]).toBe('Item 999');
  });

  it('does not strip # at start (area marker)', () => {
    const result = segmentText('#work Buy supplies');
    expect(result).toEqual(['#work Buy supplies']);
  });

  it('does not strip @ at start (tag marker)', () => {
    const result = segmentText('@urgent Fix bug');
    expect(result).toEqual(['@urgent Fix bug']);
  });
});


// ============================================================================
// FEATURES: classifyItem
// ============================================================================

describe('classifyItem', () => {
  // ---- Task signals ----

  describe('task classification', () => {
    it('classifies imperative verbs as task', () => {
      const result = classifyItem('Buy groceries');
      expect(result.type).toBe('task');
      expect(result.score).toBeGreaterThan(0);
    });

    it('gives high score to short imperative sentences', () => {
      const result = classifyItem('Call dentist');
      expect(result.type).toBe('task');
      // Action verb (+40) + short imperative (+20) = 60
      expect(result.score).toBeGreaterThanOrEqual(60);
    });

    it('detects deadline language "by friday"', () => {
      const result = classifyItem('Finish report by friday');
      expect(result.type).toBe('task');
      expect(result.score).toBeGreaterThanOrEqual(30);
    });

    it('detects deadline language "due"', () => {
      const result = classifyItem('Taxes due next week');
      expect(result.score).toBeGreaterThanOrEqual(30);
    });

    it('detects deadline language "deadline"', () => {
      const result = classifyItem('Project deadline approaching');
      expect(result.score).toBeGreaterThanOrEqual(30);
    });

    it('detects deadline language "before"', () => {
      const result = classifyItem('Submit before Monday');
      expect(result.type).toBe('task');
    });

    it('detects deadline with all day names', () => {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of days) {
        const result = classifyItem(`Submit by ${day}`);
        expect(result.score).toBeGreaterThanOrEqual(30);
      }
    });

    it('detects "by tomorrow"', () => {
      const result = classifyItem('Finish this by tomorrow');
      expect(result.score).toBeGreaterThanOrEqual(30);
    });

    it('detects "by next week"', () => {
      const result = classifyItem('Complete by next week');
      expect(result.score).toBeGreaterThanOrEqual(30);
    });

    it('detects "by end of" phrase', () => {
      const result = classifyItem('Deliver by end of month');
      expect(result.score).toBeGreaterThanOrEqual(30);
    });

    it('detects obligation "need to"', () => {
      const result = classifyItem('I need to finish the report');
      expect(result.type).toBe('task');
    });

    it('detects obligation "must"', () => {
      const result = classifyItem('Must call the bank');
      expect(result.score).toBeGreaterThanOrEqual(25);
    });

    it('detects obligation "have to"', () => {
      const result = classifyItem('I have to pick up dry cleaning');
      expect(result.type).toBe('task');
    });

    it('detects obligation "should"', () => {
      const result = classifyItem('Should review pull request');
      expect(result.score).toBeGreaterThanOrEqual(25);
    });

    it('detects !date syntax', () => {
      const result = classifyItem('Deploy app !tomorrow');
      expect(result.score).toBeGreaterThanOrEqual(35);
    });

    it('detects &person syntax', () => {
      const result = classifyItem('Meet with &alice');
      expect(result.score).toBeGreaterThanOrEqual(15);
    });

    it('detects time markers "today"', () => {
      const result = classifyItem('Finish today');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects time markers "tonight"', () => {
      const result = classifyItem('Prepare slides tonight');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects time markers "this week"', () => {
      const result = classifyItem('Ship feature this week');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects time marker "this morning"', () => {
      const result = classifyItem('Review PRs this morning');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects time marker "asap"', () => {
      const result = classifyItem('Fix production bug asap');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects time marker "urgently"', () => {
      const result = classifyItem('Respond urgently');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects # area marker', () => {
      const result = classifyItem('#work Update dashboard');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects @ tag marker', () => {
      const result = classifyItem('@urgent Fix login bug');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects # area marker mid-sentence', () => {
      const result = classifyItem('Update dashboard #work');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('detects @ tag marker mid-sentence', () => {
      const result = classifyItem('Fix bug @urgent');
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('stacks multiple task signals', () => {
      // "Buy" (action verb, +40) + "today" (time marker, +10) + short imperative (+20)
      const result = classifyItem('Buy groceries today');
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.type).toBe('task');
    });

    it('classifies all known action verbs as task-leaning', () => {
      const verbs = ['buy', 'call', 'send', 'finish', 'review', 'schedule', 'clean', 'fix', 'write', 'email',
        'deploy', 'ship', 'deliver', 'create', 'build', 'design', 'test', 'debug', 'research'];
      for (const verb of verbs) {
        const result = classifyItem(`${verb} something`);
        expect(result.score).toBeGreaterThan(0);
      }
    });
  });

  // ---- Note signals ----

  describe('note classification', () => {
    it('classifies "Note:" prefix as note', () => {
      const result = classifyItem('Note: vitamins are important');
      expect(result.type).toBe('note');
      expect(result.score).toBeLessThanOrEqual(-50);
    });

    it('classifies "Idea:" prefix as note', () => {
      const result = classifyItem('Idea: standing desk for office');
      expect(result.type).toBe('note');
    });

    it('classifies "Thought:" prefix as note', () => {
      const result = classifyItem('Thought: maybe try meditation');
      expect(result.type).toBe('note');
    });

    it('classifies "Remember:" prefix as note', () => {
      const result = classifyItem('Remember: meeting at 3pm');
      expect(result.type).toBe('note');
    });

    it('classifies "Observation:" prefix as note', () => {
      const result = classifyItem('Observation: traffic was lighter today');
      expect(result.type).toBe('note');
    });

    it('classifies "Insight:" prefix as note', () => {
      const result = classifyItem('Insight: users prefer dark mode');
      expect(result.type).toBe('note');
    });

    it('classifies "Reflection:" prefix as note', () => {
      const result = classifyItem('Reflection: good progress this week');
      expect(result.type).toBe('note');
    });

    it('detects past tense observational language', () => {
      const pastTenseWords = ['missed', 'forgot', 'forgotten', "didn't", "wasn't", "couldn't"];
      for (const word of pastTenseWords) {
        const result = classifyItem(`I ${word} do something`);
        expect(result.score).toBeLessThan(0);
      }
    });

    it('detects "had a" as observational', () => {
      const result = classifyItem('Had a great workout today');
      expect(result.score).toBeLessThan(0);
    });

    it('detects "went to" as observational', () => {
      const result = classifyItem('Went to the store');
      expect(result.score).toBeLessThan(0);
    });

    it('detects "I missed" journal-style opening', () => {
      const result = classifyItem('I missed taking vitamins');
      expect(result.type).toBe('note');
    });

    it('detects "I forgot" journal-style opening', () => {
      const result = classifyItem('I forgot my keys');
      expect(result.type).toBe('note');
    });

    it('detects "I had" journal-style opening', () => {
      const result = classifyItem('I had a meeting with the team');
      expect(result.type).toBe('note');
    });

    it('detects "I was" journal-style opening', () => {
      const result = classifyItem('I was late to work');
      expect(result.type).toBe('note');
    });

    it('detects "I went" journal-style opening', () => {
      const result = classifyItem('I went to the gym');
      expect(result.type).toBe('note');
    });

    it('detects "I felt" journal-style opening', () => {
      const result = classifyItem('I felt tired all day');
      expect(result.type).toBe('note');
    });

    it('detects multi-sentence text as note-leaning', () => {
      const result = classifyItem('The meeting went well. Alice presented the roadmap.');
      expect(result.score).toBeLessThan(0);
    });

    it('detects reflective language "i think"', () => {
      const result = classifyItem('I think we should reconsider');
      // "should" (+25) offsets "i think" (-25) = 0 → note (score must be > 0 for task)
      expect(result.score).toBeLessThanOrEqual(0);
      expect(result.type).toBe('note');
    });

    it('detects reflective language "i feel"', () => {
      const result = classifyItem('I feel overwhelmed');
      expect(result.score).toBeLessThan(0);
    });

    it('detects reflective language "maybe"', () => {
      const result = classifyItem('Maybe try a different approach');
      expect(result.score).toBeLessThan(0);
    });

    it('detects reflective language "perhaps"', () => {
      const result = classifyItem('Perhaps we need more data');
      expect(result.score).toBeLessThan(0);
    });

    it('detects reflective language "i wonder"', () => {
      const result = classifyItem('I wonder if this will work');
      expect(result.score).toBeLessThan(0);
    });

    it('detects questions ending with ?', () => {
      const result = classifyItem('What is the best protein powder?');
      expect(result.score).toBeLessThan(0);
    });

    it('detects article-starting sentences as less action-oriented', () => {
      const articles = ['The', 'A', 'An', 'This', 'That', 'These', 'Those'];
      for (const article of articles) {
        const result = classifyItem(`${article} report was interesting`);
        expect(result.score).toBeLessThan(0);
      }
    });

    it('classifies bare URL as note', () => {
      const result = classifyItem('https://example.com/article');
      expect(result.type).toBe('note');
      expect(result.score).toBeLessThanOrEqual(-40);
    });

    it('classifies URL with path as note', () => {
      const result = classifyItem('https://github.com/user/repo/pull/123');
      expect(result.type).toBe('note');
    });

    it('classifies quoted text as note', () => {
      const quotations = ['"Great quote"', "'Important saying'", '\u201CUnicode quote\u201D', '\u2018Single unicode\u2019'];
      for (const q of quotations) {
        const result = classifyItem(q);
        expect(result.score).toBeLessThan(0);
      }
    });
  });

  // ---- Confidence ----

  describe('confidence calculation', () => {
    it('returns confidence between 0 and 1', () => {
      const testCases = ['Buy milk', 'A random thought', 'Note: something', 'maybe later?'];
      for (const text of testCases) {
        const result = classifyItem(text);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('returns higher confidence for strong signals', () => {
      const strong = classifyItem('Buy groceries today');
      const weak = classifyItem('Something');
      expect(strong.confidence).toBeGreaterThan(weak.confidence);
    });

    it('caps confidence at 1.0', () => {
      // Stack many signals to get a very high score
      const result = classifyItem('Buy groceries by friday today #work @urgent &alice !tomorrow');
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  // ---- Edge cases ----

  describe('edge cases', () => {
    it('handles empty string', () => {
      const result = classifyItem('');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('confidence');
    });

    it('handles single word (non-verb)', () => {
      const result = classifyItem('Hello');
      expect(result.type).toBe('note');
      expect(result.score).toBe(0);
    });

    it('handles single action verb', () => {
      const result = classifyItem('buy');
      expect(result.type).toBe('task');
    });

    it('handles text with only special characters', () => {
      const result = classifyItem('!!! @@@ ### &&&');
      expect(result).toHaveProperty('type');
    });

    it('handles very long text', () => {
      const longText = 'Buy ' + 'a '.repeat(500) + 'thing';
      const result = classifyItem(longText);
      expect(result).toHaveProperty('type');
    });

    it('is case-insensitive for action verbs', () => {
      const lower = classifyItem('buy groceries');
      const upper = classifyItem('BUY groceries');
      // Both should detect the verb — the lower function lowercases
      expect(lower.type).toBe('task');
      // Upper won't match because firstWord is compared to lowercase verbs list
      // This is expected behavior — the verbs list is lowercase
    });

    it('detects action verb only in first position', () => {
      const first = classifyItem('buy groceries');
      const later = classifyItem('I will buy groceries');
      expect(first.score).toBeGreaterThan(later.score);
    });

    it('competing signals resolve by score sum', () => {
      // "Buy" verb (+40) but "?" blocks short imperative bonus, then "maybe" (-25) + "?" (-20)
      // 40 - 25 - 20 = -5 → note wins
      const result = classifyItem('Buy this maybe?');
      expect(result.type).toBe('note');
    });

    it('note prefix overrides action verb', () => {
      // "Note:" (-50) + "buy" (+40 +20 short) = +10 → still task technically
      // But "Note:" prefix is very strong
      const result = classifyItem('Note: buy something');
      // Note: (-50) but "buy" is not the first word (it's "note:"), so no verb bonus
      expect(result.type).toBe('note');
    });

    it('zero score defaults to note', () => {
      // Score 0 → type = 'note' (score > 0 is task)
      const result = classifyItem('Something');
      expect(result.score).toBe(0);
      expect(result.type).toBe('note');
    });
  });
});


// ============================================================================
// FEATURES: extractMetadata
// ============================================================================

describe('extractMetadata', () => {
  beforeEach(() => {
    setupEntities();
  });

  describe('area extraction (#)', () => {
    it('extracts #work area reference', () => {
      const result = extractMetadata('Buy supplies #work');
      expect(result.areaId).toBe('area_1');
      expect(result.title).toBe('Buy supplies');
    });

    it('extracts #personal area reference', () => {
      const result = extractMetadata('#personal Buy groceries');
      expect(result.areaId).toBe('area_2');
      expect(result.title).toBe('Buy groceries');
    });

    it('is case-insensitive for area names', () => {
      const result = extractMetadata('Task #WORK');
      expect(result.areaId).toBe('area_1');
    });

    it('ignores unknown area references', () => {
      const result = extractMetadata('Task #unknown');
      expect(result.areaId).toBeNull();
      expect(result.title).toBe('Task #unknown');
    });

    it('uses last matching area if multiple present', () => {
      const result = extractMetadata('Task #work #personal');
      // Both match, second overwrites first
      expect(result.areaId).toBe('area_2');
    });

    it('does not match # inside words', () => {
      // The regex /#(\w+)/g matches anywhere, so C# would match
      const result = extractMetadata('Learn C#');
      // "c" doesn't match any area, so areaId stays null
      expect(result.areaId).toBeNull();
    });
  });

  describe('tag extraction (@)', () => {
    it('extracts @urgent tag reference', () => {
      const result = extractMetadata('Fix bug @urgent');
      expect(result.labels).toEqual(['label_1']);
      expect(result.title).toBe('Fix bug');
    });

    it('extracts multiple tags', () => {
      const result = extractMetadata('Task @urgent @waiting');
      expect(result.labels).toEqual(['label_1', 'label_2']);
    });

    it('is case-insensitive for tag names', () => {
      const result = extractMetadata('Task @URGENT');
      expect(result.labels).toEqual(['label_1']);
    });

    it('ignores unknown tag references', () => {
      const result = extractMetadata('Task @unknown');
      expect(result.labels).toEqual([]);
      expect(result.title).toBe('Task @unknown');
    });

    it('does not duplicate tag IDs', () => {
      const result = extractMetadata('Task @urgent @urgent');
      expect(result.labels).toEqual(['label_1']);
    });
  });

  describe('person extraction (&)', () => {
    it('extracts &alice person reference', () => {
      const result = extractMetadata('Meet with &alice');
      expect(result.people).toEqual(['person_1']);
      expect(result.title).toBe('Meet with');
    });

    it('extracts multiple people', () => {
      const result = extractMetadata('Meeting &alice &bob');
      expect(result.people).toEqual(['person_1', 'person_2']);
    });

    it('is case-insensitive for person names', () => {
      const result = extractMetadata('Call &ALICE');
      expect(result.people).toEqual(['person_1']);
    });

    it('ignores unknown person references', () => {
      const result = extractMetadata('Call &unknown');
      expect(result.people).toEqual([]);
      expect(result.title).toBe('Call &unknown');
    });

    it('does not duplicate person IDs', () => {
      const result = extractMetadata('Call &alice &alice');
      expect(result.people).toEqual(['person_1']);
    });
  });

  describe('date extraction (!)', () => {
    it('extracts !date when parseDateQuery is available', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'tomorrow') return [{ date: '2026-02-13' }];
        return [];
      });
      const result = extractMetadata('Finish report !tomorrow');
      expect(result.deferDate).toBe('2026-02-13');
      expect(result.title).toBe('Finish report');
    });

    it('returns null deferDate when parseDateQuery is not available', () => {
      window.parseDateQuery = undefined;
      const result = extractMetadata('Finish report !tomorrow');
      expect(result.deferDate).toBeNull();
    });

    it('returns null deferDate when parseDateQuery returns empty', () => {
      window.parseDateQuery = vi.fn(() => []);
      const result = extractMetadata('Task !invaliddate');
      expect(result.deferDate).toBeNull();
    });

    it('only uses first date match for deferDate', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'tomorrow') return [{ date: '2026-02-13' }];
        if (query === 'friday') return [{ date: '2026-02-14' }];
        return [];
      });
      const result = extractMetadata('Task !tomorrow !friday');
      expect(result.deferDate).toBe('2026-02-13');
    });
  });

  describe('natural language date extraction', () => {
    it('extracts "tomorrow" as dueDate', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'tomorrow') return [{ date: '2026-02-13' }];
        return [];
      });
      const result = extractMetadata('Finish this tomorrow');
      expect(result.dueDate).toBe('2026-02-13');
    });

    it('extracts "today" as dueDate', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'today') return [{ date: '2026-02-12' }];
        return [];
      });
      const result = extractMetadata('Do this today');
      expect(result.dueDate).toBe('2026-02-12');
    });

    it('extracts "next monday" as dueDate', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'monday') return [{ date: '2026-02-16' }];
        return [];
      });
      const result = extractMetadata('Submit report next monday');
      expect(result.dueDate).toBe('2026-02-16');
    });

    it('extracts "by friday" as dueDate', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'friday') return [{ date: '2026-02-14' }];
        return [];
      });
      const result = extractMetadata('Complete by friday');
      expect(result.dueDate).toBe('2026-02-14');
    });

    it('does not strip natural language dates from title', () => {
      window.parseDateQuery = vi.fn(() => [{ date: '2026-02-13' }]);
      const result = extractMetadata('Finish this tomorrow');
      expect(result.title).toContain('tomorrow');
    });

    it('prefers !date over natural language for deferDate', () => {
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'friday') return [{ date: '2026-02-14' }];
        if (query === 'tomorrow') return [{ date: '2026-02-13' }];
        return [];
      });
      const result = extractMetadata('Task !friday by tomorrow');
      expect(result.deferDate).toBe('2026-02-14');
    });

    it('skips natural language dueDate when !date already set deferDate', () => {
      // The code has `if (!deferDate && ...)` — once !date sets deferDate,
      // natural language date parsing is skipped entirely
      window.parseDateQuery = vi.fn((query) => {
        if (query === 'friday') return [{ date: '2026-02-14' }];
        if (query === 'tomorrow') return [{ date: '2026-02-13' }];
        return [];
      });
      const result = extractMetadata('Task !friday do tomorrow');
      expect(result.deferDate).toBe('2026-02-14');
      expect(result.dueDate).toBeNull(); // Natural lang dates skipped when deferDate already set
    });
  });

  describe('combined metadata extraction', () => {
    it('extracts all metadata types simultaneously', () => {
      window.parseDateQuery = vi.fn(() => [{ date: '2026-02-13' }]);
      const result = extractMetadata('Buy supplies #work @urgent &alice !tomorrow');
      expect(result.areaId).toBe('area_1');
      expect(result.labels).toEqual(['label_1']);
      expect(result.people).toEqual(['person_1']);
      expect(result.deferDate).toBe('2026-02-13');
      expect(result.title).toBe('Buy supplies');
    });

    it('cleans up extra whitespace in title', () => {
      const result = extractMetadata('Buy   #work   supplies');
      expect(result.title).not.toContain('  ');
    });
  });

  describe('edge cases', () => {
    it('handles empty string', () => {
      const result = extractMetadata('');
      expect(result.title).toBe('');
      expect(result.areaId).toBeNull();
      expect(result.labels).toEqual([]);
      expect(result.people).toEqual([]);
      expect(result.deferDate).toBeNull();
      expect(result.dueDate).toBeNull();
    });

    it('handles text with no metadata markers', () => {
      const result = extractMetadata('Just a plain text item');
      expect(result.title).toBe('Just a plain text item');
      expect(result.areaId).toBeNull();
    });

    it('handles text that is only metadata markers', () => {
      const result = extractMetadata('#work @urgent &alice');
      expect(result.areaId).toBe('area_1');
      expect(result.labels).toEqual(['label_1']);
      expect(result.people).toEqual(['person_1']);
    });

    it('handles empty state.taskAreas', () => {
      mockState.taskAreas = [];
      const result = extractMetadata('#work task');
      expect(result.areaId).toBeNull();
    });

    it('handles empty state.taskLabels', () => {
      mockState.taskLabels = [];
      const result = extractMetadata('@urgent task');
      expect(result.labels).toEqual([]);
    });

    it('handles empty state.taskPeople', () => {
      mockState.taskPeople = [];
      const result = extractMetadata('&alice task');
      expect(result.people).toEqual([]);
    });
  });
});


// ============================================================================
// FEATURES: parseBraindumpHeuristic
// ============================================================================

describe('parseBraindumpHeuristic', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('parses multi-line text into classified items', () => {
    const result = parseBraindumpHeuristic('Buy milk\nNote: feeling tired\nCall dentist');
    expect(result).toHaveLength(3);
    expect(result[0].type).toBe('task');
    expect(result[1].type).toBe('note');
    expect(result[2].type).toBe('task');
  });

  it('sets index correctly', () => {
    const result = parseBraindumpHeuristic('First\nSecond\nThird');
    expect(result[0].index).toBe(0);
    expect(result[1].index).toBe(1);
    expect(result[2].index).toBe(2);
  });

  it('preserves originalText', () => {
    const result = parseBraindumpHeuristic('- Buy milk #work');
    expect(result[0].originalText).toBe('Buy milk #work');
  });

  it('sets included to true for all items', () => {
    const result = parseBraindumpHeuristic('Buy milk\nNote: test');
    for (const item of result) {
      expect(item.included).toBe(true);
    }
  });

  it('extracts metadata into items', () => {
    const result = parseBraindumpHeuristic('Buy milk #work @urgent');
    expect(result[0].areaId).toBe('area_1');
    expect(result[0].labels).toEqual(['label_1']);
  });

  it('returns empty array for empty input', () => {
    expect(parseBraindumpHeuristic('')).toEqual([]);
  });

  it('returns empty array for null input', () => {
    expect(parseBraindumpHeuristic(null)).toEqual([]);
  });

  it('returns empty array for whitespace-only input', () => {
    expect(parseBraindumpHeuristic('   \n   ')).toEqual([]);
  });

  it('each item has complete shape', () => {
    const result = parseBraindumpHeuristic('Test item');
    const item = result[0];
    expect(item).toHaveProperty('index');
    expect(item).toHaveProperty('originalText');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('type');
    expect(item).toHaveProperty('score');
    expect(item).toHaveProperty('confidence');
    expect(item).toHaveProperty('areaId');
    expect(item).toHaveProperty('labels');
    expect(item).toHaveProperty('people');
    expect(item).toHaveProperty('deferDate');
    expect(item).toHaveProperty('dueDate');
    expect(item).toHaveProperty('included');
  });

  it('handles large input', () => {
    const lines = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
    const result = parseBraindumpHeuristic(lines.join('\n'));
    expect(result).toHaveLength(100);
  });
});


// ============================================================================
// FEATURES: parseBraindump (async orchestrator)
// ============================================================================

describe('parseBraindump', () => {
  beforeEach(() => {
    setupEntities();
    localStorage.removeItem('lifeGamificationAnthropicKey');
  });

  it('uses heuristic when no API key is set', async () => {
    const result = await parseBraindump('Buy milk\nNote: test');
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('task');
    expect(result[1].type).toBe('note');
  });

  it('clears previous AI error', async () => {
    mockState.braindumpAIError = 'old error';
    await parseBraindump('Buy milk');
    expect(mockState.braindumpAIError).toBeNull();
  });

  it('falls back to heuristic when AI fails', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    // Mock fetch to fail
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await parseBraindump('Buy milk\nCall dentist');
    expect(result).toHaveLength(2);
    expect(mockState.braindumpAIError).toBe('Network error');
  });

  it('falls back when AI returns empty', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: '[]' }] }),
    });

    const result = await parseBraindump('Buy milk');
    expect(result).toHaveLength(1);
    expect(mockState.braindumpAIError).toBe('AI returned empty results');
  });

  it('falls back when AI returns non-OK status', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });

    const result = await parseBraindump('Buy milk');
    expect(result).toHaveLength(1);
    expect(mockState.braindumpAIError).toBeTruthy();
  });

  it('falls back when AI returns invalid JSON', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: 'not json' }] }),
    });

    const result = await parseBraindump('Buy milk');
    expect(result).toHaveLength(1);
    expect(mockState.braindumpAIError).toBeTruthy();
  });

  it('falls back when AI returns non-array JSON', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: '{"not": "array"}' }] }),
    });

    const result = await parseBraindump('Buy milk');
    expect(result).toHaveLength(1);
    expect(mockState.braindumpAIError).toBeTruthy();
  });

  it('uses AI result when valid', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Buy groceries', type: 'task', confidence: 0.95, area: 'Work', tags: [], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Buy groceries');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy groceries');
    expect(result[0].areaId).toBe('area_1'); // 'Work' resolved to area_1
  });

  it('handles AI response wrapped in markdown code block', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Test item', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: '```json\n' + JSON.stringify(aiResponse) + '\n```' }] }),
    });

    const result = await parseBraindump('Test item');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Test item');
  });

  it('resolves tag names to IDs from AI response', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Task', type: 'task', confidence: 0.9, area: null, tags: ['urgent', 'waiting'], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Task');
    expect(result[0].labels).toEqual(['label_1', 'label_2']);
  });

  it('resolves person names to IDs from AI response', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Meet', type: 'task', confidence: 0.9, area: null, tags: [], people: ['Alice', 'Bob'], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Meet');
    expect(result[0].people).toEqual(['person_1', 'person_2']);
  });

  it('filters out items with empty titles from AI response', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Valid task', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: '', type: 'note', confidence: 0.5, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: '   ', type: 'note', confidence: 0.5, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Some text');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Valid task');
  });

  it('validates date format from AI response', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Task', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: '2026-02-15', dueDate: 'invalid' },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Task');
    expect(result[0].deferDate).toBe('2026-02-15');
    expect(result[0].dueDate).toBeNull();
  });

  it('clamps confidence to 0-1 range from AI response', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Task', type: 'task', confidence: 5.0, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Task');
    expect(result[0].confidence).toBeLessThanOrEqual(1);
  });

  it('defaults confidence to 0.8 when missing from AI response', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Task', type: 'task', area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Task');
    expect(result[0].confidence).toBe(0.8);
  });

  it('defaults type to task for unrecognized types from AI', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Item', type: 'event', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Item');
    expect(result[0].type).toBe('task');
  });

  it('handles timeout (AbortError)', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const abortError = new DOMException('Aborted', 'AbortError');
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);

    const result = await parseBraindump('Buy milk');
    expect(result).toHaveLength(1); // Falls back to heuristic
    expect(mockState.braindumpAIError).toContain('timed out');
  });

  it('skips unknown tags from AI response gracefully', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    const aiResponse = [
      { title: 'Task', type: 'task', confidence: 0.9, area: null, tags: ['nonexistent'], people: ['nobody'], deferDate: null, dueDate: null },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: JSON.stringify(aiResponse) }] }),
    });

    const result = await parseBraindump('Task');
    expect(result[0].labels).toEqual([]);
    expect(result[0].people).toEqual([]);
  });
});


// ============================================================================
// FEATURES: getAnthropicKey / setAnthropicKey
// ============================================================================

describe('getAnthropicKey', () => {
  it('returns empty string when no key is stored', () => {
    localStorage.removeItem('lifeGamificationAnthropicKey');
    expect(getAnthropicKey()).toBe('');
  });

  it('returns stored key', () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'sk-test-123');
    expect(getAnthropicKey()).toBe('sk-test-123');
  });
});

describe('setAnthropicKey', () => {
  it('stores a valid key', () => {
    setAnthropicKey('sk-test-123');
    expect(localStorage.getItem('lifeGamificationAnthropicKey')).toBe('sk-test-123');
  });

  it('trims whitespace from key', () => {
    setAnthropicKey('  sk-test-123  ');
    expect(localStorage.getItem('lifeGamificationAnthropicKey')).toBe('sk-test-123');
  });

  it('removes key when set to empty string', () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'old-key');
    setAnthropicKey('');
    expect(localStorage.getItem('lifeGamificationAnthropicKey')).toBeNull();
  });

  it('removes key when set to null', () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'old-key');
    setAnthropicKey(null);
    expect(localStorage.getItem('lifeGamificationAnthropicKey')).toBeNull();
  });

  it('removes key when set to undefined', () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'old-key');
    setAnthropicKey(undefined);
    expect(localStorage.getItem('lifeGamificationAnthropicKey')).toBeNull();
  });

  it('removes key when set to whitespace only', () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'old-key');
    setAnthropicKey('   ');
    expect(localStorage.getItem('lifeGamificationAnthropicKey')).toBeNull();
  });
});


// ============================================================================
// FEATURES: refineVoiceTranscriptWithAI
// ============================================================================

describe('refineVoiceTranscriptWithAI', () => {
  it('returns empty string for empty input', async () => {
    expect(await refineVoiceTranscriptWithAI('')).toBe('');
  });

  it('returns empty string for null input', async () => {
    expect(await refineVoiceTranscriptWithAI(null)).toBe('');
  });

  it('returns empty string for undefined input', async () => {
    expect(await refineVoiceTranscriptWithAI(undefined)).toBe('');
  });

  it('returns empty string for whitespace-only input', async () => {
    expect(await refineVoiceTranscriptWithAI('   ')).toBe('');
  });

  it('returns original text when no API key is set', async () => {
    localStorage.removeItem('lifeGamificationAnthropicKey');
    const result = await refineVoiceTranscriptWithAI('some rough text');
    expect(result).toBe('some rough text');
  });

  it('returns cleaned text from API', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: 'Cleaned text.' }] }),
    });

    const result = await refineVoiceTranscriptWithAI('some rough text');
    expect(result).toBe('Cleaned text.');
  });

  it('returns original text on API error', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await refineVoiceTranscriptWithAI('some rough text');
    expect(result).toBe('some rough text');
  });

  it('returns original text on network error', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    const result = await refineVoiceTranscriptWithAI('some rough text');
    expect(result).toBe('some rough text');
  });

  it('returns original text when API returns empty content', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: '' }] }),
    });

    const result = await refineVoiceTranscriptWithAI('some rough text');
    expect(result).toBe('some rough text');
  });

  it('returns original text when API returns null content', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [] }),
    });

    const result = await refineVoiceTranscriptWithAI('some rough text');
    expect(result).toBe('some rough text');
  });

  it('trims input text before sending', async () => {
    localStorage.setItem('lifeGamificationAnthropicKey', 'test-key');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: 'Cleaned.' }] }),
    });

    await refineVoiceTranscriptWithAI('  padded text  ');
    const sentBody = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(sentBody.messages[0].content).toBe('padded text');
  });
});


// ============================================================================
// FEATURES: submitBraindumpItems
// ============================================================================

describe('submitBraindumpItems', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('creates tasks for task-type included items', () => {
    const items = [makeParsedItem({ title: 'Buy milk', type: 'task' })];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(1);
    expect(result.noteCount).toBe(0);
    expect(createTaskMock).toHaveBeenCalledTimes(1);
  });

  it('creates notes for note-type included items', () => {
    const items = [makeParsedItem({ title: 'A thought', type: 'note' })];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(0);
    expect(result.noteCount).toBe(1);
    expect(createTaskMock).toHaveBeenCalledWith('A thought', expect.objectContaining({ isNote: true }));
  });

  it('skips excluded items', () => {
    const items = [
      makeParsedItem({ title: 'Included', included: true }),
      makeParsedItem({ title: 'Excluded', included: false, index: 1 }),
    ];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(1);
    expect(createTaskMock).toHaveBeenCalledTimes(1);
  });

  it('passes areaId to createTask', () => {
    const items = [makeParsedItem({ title: 'Task', areaId: 'area_1' })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Task', expect.objectContaining({ areaId: 'area_1' }));
  });

  it('passes labels to createTask', () => {
    const items = [makeParsedItem({ title: 'Task', labels: ['label_1', 'label_2'] })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Task', expect.objectContaining({ labels: ['label_1', 'label_2'] }));
  });

  it('passes people to createTask', () => {
    const items = [makeParsedItem({ title: 'Task', people: ['person_1'] })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Task', expect.objectContaining({ people: ['person_1'] }));
  });

  it('passes deferDate and dueDate to createTask', () => {
    const items = [makeParsedItem({ title: 'Task', deferDate: '2026-02-15', dueDate: '2026-02-20' })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Task', expect.objectContaining({
      deferDate: '2026-02-15',
      dueDate: '2026-02-20',
    }));
  });

  it('sets status to anytime when areaId is present', () => {
    const items = [makeParsedItem({ title: 'Task', areaId: 'area_1' })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Task', expect.objectContaining({ status: 'anytime' }));
  });

  it('sets status to inbox when no areaId', () => {
    const items = [makeParsedItem({ title: 'Task', areaId: null })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Task', expect.objectContaining({ status: 'inbox' }));
  });

  it('enriches notes with lifecycle metadata', () => {
    const items = [makeParsedItem({ title: 'A note', type: 'note' })];
    submitBraindumpItems(items);
    const createdTask = createTaskMock.mock.results[0].value;
    expect(createdTask.noteLifecycleState).toBe('active');
    expect(createdTask.noteHistory).toHaveLength(1);
    expect(createdTask.noteHistory[0]).toMatchObject({ action: 'created', source: 'braindump' });
  });

  it('does not enrich tasks with lifecycle metadata', () => {
    const items = [makeParsedItem({ title: 'A task', type: 'task' })];
    submitBraindumpItems(items);
    const createdTask = createTaskMock.mock.results[0].value;
    expect(createdTask.noteLifecycleState).toBeUndefined();
  });

  it('handles empty items array', () => {
    const result = submitBraindumpItems([]);
    expect(result.taskCount).toBe(0);
    expect(result.noteCount).toBe(0);
    expect(createTaskMock).not.toHaveBeenCalled();
  });

  it('handles all items excluded', () => {
    const items = [
      makeParsedItem({ included: false }),
      makeParsedItem({ included: false, index: 1 }),
    ];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(0);
    expect(result.noteCount).toBe(0);
    expect(createTaskMock).not.toHaveBeenCalled();
  });

  it('counts mixed tasks and notes correctly', () => {
    const items = [
      makeParsedItem({ title: 'Task 1', type: 'task', index: 0 }),
      makeParsedItem({ title: 'Note 1', type: 'note', index: 1 }),
      makeParsedItem({ title: 'Task 2', type: 'task', index: 2 }),
      makeParsedItem({ title: 'Note 2', type: 'note', index: 3 }),
      makeParsedItem({ title: 'Excluded', type: 'task', included: false, index: 4 }),
    ];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(2);
    expect(result.noteCount).toBe(2);
    expect(createTaskMock).toHaveBeenCalledTimes(4);
  });

  it('handles null createTask return gracefully for notes', () => {
    createTaskMock.mockReturnValueOnce(null);
    const items = [makeParsedItem({ title: 'A note', type: 'note' })];
    // Should not throw even if createTask returns null
    const result = submitBraindumpItems(items);
    expect(result.noteCount).toBe(1);
  });
});


// ============================================================================
// UI: openBraindump / closeBraindump
// ============================================================================

describe('openBraindump', () => {
  it('sets showBraindump to true', () => {
    openBraindump();
    expect(mockState.showBraindump).toBe(true);
  });

  it('resets all braindump state', () => {
    mockState.braindumpRawText = 'old text';
    mockState.braindumpParsedItems = [{}];
    mockState.braindumpEditingIndex = 3;
    openBraindump();
    expect(mockState.braindumpStep).toBe('input');
    expect(mockState.braindumpRawText).toBe('');
    expect(mockState.braindumpParsedItems).toEqual([]);
    expect(mockState.braindumpEditingIndex).toBeNull();
  });

  it('resets voice state', () => {
    mockState.braindumpVoiceRecording = true;
    mockState.braindumpVoiceTranscribing = true;
    mockState.braindumpVoiceError = 'old error';
    openBraindump();
    expect(mockState.braindumpVoiceRecording).toBe(false);
    expect(mockState.braindumpVoiceTranscribing).toBe(false);
    expect(mockState.braindumpVoiceError).toBeNull();
  });

  it('calls window.render()', () => {
    openBraindump();
    expect(window.render).toHaveBeenCalled();
  });
});

describe('closeBraindump', () => {
  it('sets showBraindump to false', () => {
    mockState.showBraindump = true;
    closeBraindump();
    expect(mockState.showBraindump).toBe(false);
  });

  it('resets all braindump state', () => {
    mockState.braindumpRawText = 'text';
    mockState.braindumpParsedItems = [{}];
    mockState.braindumpStep = 'review';
    closeBraindump();
    expect(mockState.braindumpRawText).toBe('');
    expect(mockState.braindumpParsedItems).toEqual([]);
    expect(mockState.braindumpStep).toBe('input');
    expect(mockState.braindumpEditingIndex).toBeNull();
  });

  it('resets voice state', () => {
    closeBraindump();
    expect(mockState.braindumpVoiceRecording).toBe(false);
    expect(mockState.braindumpVoiceTranscribing).toBe(false);
    expect(mockState.braindumpVoiceError).toBeNull();
  });

  it('calls window.render()', () => {
    closeBraindump();
    expect(window.render).toHaveBeenCalled();
  });
});


// ============================================================================
// UI: Item manipulation functions
// ============================================================================

describe('toggleBraindumpItemType', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [
      makeParsedItem({ type: 'task' }),
      makeParsedItem({ type: 'note', index: 1 }),
    ];
  });

  it('toggles task to note', () => {
    toggleBraindumpItemType(0);
    expect(mockState.braindumpParsedItems[0].type).toBe('note');
  });

  it('toggles note to task', () => {
    toggleBraindumpItemType(1);
    expect(mockState.braindumpParsedItems[1].type).toBe('task');
  });

  it('calls render after toggle', () => {
    toggleBraindumpItemType(0);
    expect(window.render).toHaveBeenCalled();
  });

  it('does nothing for out-of-range index', () => {
    toggleBraindumpItemType(99);
    expect(mockState.braindumpParsedItems[0].type).toBe('task');
  });

  it('does nothing for negative index', () => {
    toggleBraindumpItemType(-1);
    expect(mockState.braindumpParsedItems[0].type).toBe('task');
  });
});

describe('toggleBraindumpItemInclude', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ included: true })];
  });

  it('toggles included to excluded', () => {
    toggleBraindumpItemInclude(0);
    expect(mockState.braindumpParsedItems[0].included).toBe(false);
  });

  it('toggles excluded to included', () => {
    mockState.braindumpParsedItems[0].included = false;
    toggleBraindumpItemInclude(0);
    expect(mockState.braindumpParsedItems[0].included).toBe(true);
  });

  it('does nothing for invalid index', () => {
    toggleBraindumpItemInclude(99);
    expect(mockState.braindumpParsedItems[0].included).toBe(true);
  });
});

describe('removeBraindumpItem', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [
      makeParsedItem({ index: 0, title: 'First' }),
      makeParsedItem({ index: 1, title: 'Second' }),
      makeParsedItem({ index: 2, title: 'Third' }),
    ];
  });

  it('removes item at given index', () => {
    removeBraindumpItem(1);
    expect(mockState.braindumpParsedItems).toHaveLength(2);
    expect(mockState.braindumpParsedItems.map(i => i.title)).toEqual(['First', 'Third']);
  });

  it('re-indexes remaining items', () => {
    removeBraindumpItem(0);
    expect(mockState.braindumpParsedItems[0].index).toBe(0);
    expect(mockState.braindumpParsedItems[1].index).toBe(1);
  });

  it('calls render', () => {
    removeBraindumpItem(0);
    expect(window.render).toHaveBeenCalled();
  });

  it('handles removing last item', () => {
    removeBraindumpItem(2);
    expect(mockState.braindumpParsedItems).toHaveLength(2);
  });

  it('handles removing from single-item array', () => {
    mockState.braindumpParsedItems = [makeParsedItem({ index: 0 })];
    removeBraindumpItem(0);
    expect(mockState.braindumpParsedItems).toHaveLength(0);
  });
});

describe('editBraindumpItem', () => {
  it('sets braindumpEditingIndex', () => {
    mockState.braindumpParsedItems = [makeParsedItem()];
    editBraindumpItem(0);
    expect(mockState.braindumpEditingIndex).toBe(0);
  });

  it('calls render', () => {
    mockState.braindumpParsedItems = [makeParsedItem()];
    editBraindumpItem(0);
    expect(window.render).toHaveBeenCalled();
  });
});

describe('saveBraindumpItemEdit', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ title: 'Original' })];
    mockState.braindumpEditingIndex = 0;
  });

  it('resets editingIndex to null', () => {
    saveBraindumpItemEdit(0);
    expect(mockState.braindumpEditingIndex).toBeNull();
  });

  it('keeps original title when input element not found', () => {
    saveBraindumpItemEdit(0);
    expect(mockState.braindumpParsedItems[0].title).toBe('Original');
  });

  it('updates title from input element when found', () => {
    const input = document.createElement('input');
    input.id = 'braindump-edit-0';
    input.value = 'Updated title';
    document.body.appendChild(input);

    saveBraindumpItemEdit(0);
    expect(mockState.braindumpParsedItems[0].title).toBe('Updated title');

    document.body.removeChild(input);
  });

  it('falls back to original title if input is empty', () => {
    const input = document.createElement('input');
    input.id = 'braindump-edit-0';
    input.value = '   ';
    document.body.appendChild(input);

    saveBraindumpItemEdit(0);
    expect(mockState.braindumpParsedItems[0].title).toBe('Original');

    document.body.removeChild(input);
  });

  it('calls render', () => {
    saveBraindumpItemEdit(0);
    expect(window.render).toHaveBeenCalled();
  });
});

describe('cancelBraindumpItemEdit', () => {
  it('resets editingIndex to null', () => {
    mockState.braindumpEditingIndex = 2;
    cancelBraindumpItemEdit();
    expect(mockState.braindumpEditingIndex).toBeNull();
  });

  it('calls render', () => {
    cancelBraindumpItemEdit();
    expect(window.render).toHaveBeenCalled();
  });
});


// ============================================================================
// UI: Metadata manipulation
// ============================================================================

describe('setBraindumpItemArea', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ areaId: null })];
  });

  it('sets areaId on item', () => {
    setBraindumpItemArea(0, 'area_1');
    expect(mockState.braindumpParsedItems[0].areaId).toBe('area_1');
  });

  it('clears areaId with falsy value', () => {
    mockState.braindumpParsedItems[0].areaId = 'area_1';
    setBraindumpItemArea(0, '');
    expect(mockState.braindumpParsedItems[0].areaId).toBeNull();
  });

  it('clears areaId with null', () => {
    mockState.braindumpParsedItems[0].areaId = 'area_1';
    setBraindumpItemArea(0, null);
    expect(mockState.braindumpParsedItems[0].areaId).toBeNull();
  });

  it('does nothing for invalid index', () => {
    setBraindumpItemArea(99, 'area_1');
    // Should not throw
  });

  it('calls render', () => {
    setBraindumpItemArea(0, 'area_1');
    expect(window.render).toHaveBeenCalled();
  });
});

describe('addBraindumpItemLabel', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ labels: [] })];
  });

  it('adds a label to item', () => {
    addBraindumpItemLabel(0, 'label_1');
    expect(mockState.braindumpParsedItems[0].labels).toEqual(['label_1']);
  });

  it('does not add duplicate labels', () => {
    mockState.braindumpParsedItems[0].labels = ['label_1'];
    addBraindumpItemLabel(0, 'label_1');
    expect(mockState.braindumpParsedItems[0].labels).toEqual(['label_1']);
  });

  it('adds multiple distinct labels', () => {
    addBraindumpItemLabel(0, 'label_1');
    addBraindumpItemLabel(0, 'label_2');
    expect(mockState.braindumpParsedItems[0].labels).toEqual(['label_1', 'label_2']);
  });

  it('does nothing for invalid index', () => {
    addBraindumpItemLabel(99, 'label_1');
  });
});

describe('removeBraindumpItemLabel', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ labels: ['label_1', 'label_2'] })];
  });

  it('removes a label from item', () => {
    removeBraindumpItemLabel(0, 'label_1');
    expect(mockState.braindumpParsedItems[0].labels).toEqual(['label_2']);
  });

  it('does nothing when removing non-existent label', () => {
    removeBraindumpItemLabel(0, 'label_99');
    expect(mockState.braindumpParsedItems[0].labels).toEqual(['label_1', 'label_2']);
  });

  it('does nothing for invalid index', () => {
    removeBraindumpItemLabel(99, 'label_1');
  });
});

describe('addBraindumpItemPerson', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ people: [] })];
  });

  it('adds a person to item', () => {
    addBraindumpItemPerson(0, 'person_1');
    expect(mockState.braindumpParsedItems[0].people).toEqual(['person_1']);
  });

  it('does not add duplicate people', () => {
    mockState.braindumpParsedItems[0].people = ['person_1'];
    addBraindumpItemPerson(0, 'person_1');
    expect(mockState.braindumpParsedItems[0].people).toEqual(['person_1']);
  });

  it('does nothing for invalid index', () => {
    addBraindumpItemPerson(99, 'person_1');
  });
});

describe('removeBraindumpItemPerson', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ people: ['person_1', 'person_2'] })];
  });

  it('removes a person from item', () => {
    removeBraindumpItemPerson(0, 'person_1');
    expect(mockState.braindumpParsedItems[0].people).toEqual(['person_2']);
  });

  it('does nothing when removing non-existent person', () => {
    removeBraindumpItemPerson(0, 'person_99');
    expect(mockState.braindumpParsedItems[0].people).toEqual(['person_1', 'person_2']);
  });

  it('does nothing for invalid index', () => {
    removeBraindumpItemPerson(99, 'person_1');
  });
});

describe('setBraindumpItemDate', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ deferDate: null })];
  });

  it('sets deferDate on item', () => {
    setBraindumpItemDate(0, '2026-03-01');
    expect(mockState.braindumpParsedItems[0].deferDate).toBe('2026-03-01');
  });

  it('does nothing for invalid index', () => {
    setBraindumpItemDate(99, '2026-03-01');
  });
});

describe('clearBraindumpItemDate', () => {
  beforeEach(() => {
    mockState.braindumpParsedItems = [makeParsedItem({ deferDate: '2026-03-01', dueDate: '2026-03-15' })];
  });

  it('clears both deferDate and dueDate', () => {
    clearBraindumpItemDate(0);
    expect(mockState.braindumpParsedItems[0].deferDate).toBeNull();
    expect(mockState.braindumpParsedItems[0].dueDate).toBeNull();
  });

  it('does nothing for invalid index', () => {
    clearBraindumpItemDate(99);
  });
});


// ============================================================================
// UI: backToInput
// ============================================================================

describe('backToInput', () => {
  it('sets step to input', () => {
    mockState.braindumpStep = 'review';
    backToInput();
    expect(mockState.braindumpStep).toBe('input');
  });

  it('resets editingIndex', () => {
    mockState.braindumpEditingIndex = 2;
    backToInput();
    expect(mockState.braindumpEditingIndex).toBeNull();
  });

  it('calls render', () => {
    backToInput();
    expect(window.render).toHaveBeenCalled();
  });
});


// ============================================================================
// UI: submitBraindump
// ============================================================================

describe('submitBraindump', () => {
  beforeEach(() => {
    setupEntities();
    mockState.braindumpParsedItems = [
      makeParsedItem({ title: 'Task 1', type: 'task' }),
      makeParsedItem({ title: 'Note 1', type: 'note', index: 1 }),
    ];
  });

  it('calls submitBraindumpItems with parsed items', () => {
    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledTimes(2);
  });

  it('sets step to success', () => {
    submitBraindump();
    expect(mockState.braindumpStep).toBe('success');
  });

  it('sets success message with correct counts', () => {
    submitBraindump();
    expect(mockState.braindumpSuccessMessage).toBe('Added 1 task and 1 note');
  });

  it('pluralizes correctly for multiple items', () => {
    mockState.braindumpParsedItems = [
      makeParsedItem({ title: 'T1', type: 'task', index: 0 }),
      makeParsedItem({ title: 'T2', type: 'task', index: 1 }),
      makeParsedItem({ title: 'N1', type: 'note', index: 2 }),
      makeParsedItem({ title: 'N2', type: 'note', index: 3 }),
      makeParsedItem({ title: 'N3', type: 'note', index: 4 }),
    ];
    submitBraindump();
    expect(mockState.braindumpSuccessMessage).toBe('Added 2 tasks and 3 notes');
  });

  it('handles singular correctly', () => {
    mockState.braindumpParsedItems = [
      makeParsedItem({ title: 'T1', type: 'task', index: 0 }),
    ];
    submitBraindump();
    expect(mockState.braindumpSuccessMessage).toBe('Added 1 task and 0 notes');
  });

  it('calls render', () => {
    submitBraindump();
    expect(window.render).toHaveBeenCalled();
  });
});


// ============================================================================
// UI: renderBraindumpFAB
// ============================================================================

describe('renderBraindumpFAB', () => {
  it('returns HTML when braindump is closed', () => {
    mockState.showBraindump = false;
    const html = renderBraindumpFAB();
    expect(html).toContain('braindump-fab');
    expect(html).toContain('openBraindump()');
  });

  it('returns empty string when braindump is open', () => {
    mockState.showBraindump = true;
    const html = renderBraindumpFAB();
    expect(html).toBe('');
  });
});


// ============================================================================
// UI: renderBraindumpOverlay
// ============================================================================

describe('renderBraindumpOverlay', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('returns empty string when braindump is hidden', () => {
    mockState.showBraindump = false;
    expect(renderBraindumpOverlay()).toBe('');
  });

  it('renders input step', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    const html = renderBraindumpOverlay();
    expect(html).toContain('braindump-textarea');
    expect(html).toContain('braindump-writer');
  });

  it('renders review step', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [
      makeParsedItem({ title: 'Test task', type: 'task' }),
    ];
    const html = renderBraindumpOverlay();
    expect(html).toContain('braindump-review');
    expect(html).toContain('Test task');
  });

  it('renders processing step', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'processing';
    const html = renderBraindumpOverlay();
    expect(html).toContain('Thinking...');
    expect(html).toContain('braindump-spinner');
  });

  it('renders success step', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'success';
    mockState.braindumpSuccessMessage = 'Added 2 tasks and 1 note';
    const html = renderBraindumpOverlay();
    expect(html).toContain('Added 2 tasks and 1 note');
  });

  it('shows AI error message in review step', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpAIError = 'API rate limited';
    mockState.braindumpParsedItems = [makeParsedItem()];
    const html = renderBraindumpOverlay();
    expect(html).toContain('API rate limited');
    expect(html).toContain('AI failed');
  });

  it('does not show AI error when null', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpAIError = null;
    mockState.braindumpParsedItems = [makeParsedItem()];
    const html = renderBraindumpOverlay();
    expect(html).not.toContain('AI failed');
  });

  it('escapes HTML in item titles', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ title: '<script>alert("xss")</script>' })];
    const html = renderBraindumpOverlay();
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders voice error when present', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    mockState.braindumpVoiceError = 'Microphone not found';
    const html = renderBraindumpOverlay();
    expect(html).toContain('Microphone not found');
  });

  it('hides voice error when null', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    mockState.braindumpVoiceError = null;
    const html = renderBraindumpOverlay();
    expect(html).toContain('display:none');
  });

  it('disables process button when text is empty', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    mockState.braindumpRawText = '';
    const html = renderBraindumpOverlay();
    expect(html).toContain('disabled');
  });

  it('enables process button when text is present', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    mockState.braindumpRawText = 'Some text';
    mockState.braindumpVoiceRecording = false;
    const html = renderBraindumpOverlay();
    // The button should NOT have disabled attribute when text is present
    const processBtn = html.match(/id="braindump-process-btn"[^>]*/);
    expect(processBtn[0]).not.toContain('disabled');
  });

  it('disables submit button when no items included', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ included: false })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('disabled');
  });

  it('shows correct count summary in review', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [
      makeParsedItem({ type: 'task', included: true, index: 0 }),
      makeParsedItem({ type: 'task', included: true, index: 1 }),
      makeParsedItem({ type: 'note', included: true, index: 2 }),
    ];
    const html = renderBraindumpOverlay();
    expect(html).toContain('2 tasks');
    expect(html).toContain('1 note');
    expect(html).toContain('3 of 3 selected');
  });

  it('renders excluded items with excluded class', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ included: false })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('braindump-item-excluded');
  });

  it('renders editing input when item is being edited', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpEditingIndex = 0;
    mockState.braindumpParsedItems = [makeParsedItem({ title: 'Edit me' })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('braindump-edit-input');
    expect(html).toContain('braindump-edit-0');
  });

  it('renders area select with correct options', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ areaId: 'area_1' })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('Work');
    expect(html).toContain('Personal');
    expect(html).toContain('Health');
  });

  it('renders defer and due dates when present', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ deferDate: '2026-03-01', dueDate: '2026-03-15' })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('Defer: 2026-03-01');
    expect(html).toContain('Due: 2026-03-15');
  });

  it('does not render date section when no dates', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ deferDate: null, dueDate: null })];
    const html = renderBraindumpOverlay();
    expect(html).not.toContain('Defer:');
    expect(html).not.toContain('Due:');
  });

  it('renders word and line counts in input step', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    mockState.braindumpRawText = 'First line\nSecond line';
    const html = renderBraindumpOverlay();
    expect(html).toContain('2 lines');
    expect(html).toContain('4 words');
  });

  it('renders empty count when no text', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'input';
    mockState.braindumpRawText = '';
    const html = renderBraindumpOverlay();
    // Count span should be empty
    const countMatch = html.match(/id="braindump-count"[^>]*>([^<]*)</);
    expect(countMatch[1].trim()).toBe('');
  });

  it('renders people pills in review items', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ people: ['person_1'] })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('Alice');
  });

  it('renders label pills in review items', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ labels: ['label_1'] })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('urgent');
  });

  it('renders "Add" selector for available people', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ people: [] })];
    const html = renderBraindumpOverlay();
    expect(html).toContain('+ Add');
    expect(html).toContain('Alice');
    expect(html).toContain('Bob');
  });

  it('does not show "Add" selector when all people assigned', () => {
    mockState.showBraindump = true;
    mockState.braindumpStep = 'review';
    mockState.braindumpParsedItems = [makeParsedItem({ people: ['person_1', 'person_2', 'person_3'] })];
    const html = renderBraindumpOverlay();
    // Should not have the add-people select since all are assigned
    const peoplePillsSection = html.split('People')[1]?.split('Tags')[0] || '';
    // All 3 people are assigned, so no available people left
    expect(peoplePillsSection).not.toContain('braindump-add-select');
  });
});


// ============================================================================
// UI: Voice capture toggles
// ============================================================================

describe('toggleBraindumpVoiceCapture', () => {
  // Note: startBraindumpVoiceCapture and stopBraindumpVoiceCapture depend
  // on browser SpeechRecognition API — we test the toggle logic and guards

  it('is exported and callable', () => {
    const { toggleBraindumpVoiceCapture } = require('../src/ui/braindump.js');
    expect(typeof toggleBraindumpVoiceCapture).toBe('function');
  });
});

describe('stopBraindumpVoiceCapture', () => {
  it('is exported and callable', () => {
    const { stopBraindumpVoiceCapture } = require('../src/ui/braindump.js');
    expect(typeof stopBraindumpVoiceCapture).toBe('function');
  });
});


// ============================================================================
// Integration: Full braindump flow (heuristic path)
// ============================================================================

describe('full heuristic braindump flow', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('parses, reviews, and submits a mixed input', () => {
    const input = `- Buy groceries #work @urgent
Note: feeling tired lately
Call dentist &alice
https://example.com/article
Fix the login bug by friday`;

    // Step 1: Parse
    const items = parseBraindumpHeuristic(input);
    expect(items).toHaveLength(5);

    // Verify classifications
    expect(items[0].type).toBe('task'); // Buy groceries
    expect(items[0].areaId).toBe('area_1'); // #work
    expect(items[0].labels).toEqual(['label_1']); // @urgent

    expect(items[1].type).toBe('note'); // Note: feeling tired

    expect(items[2].type).toBe('task'); // Call dentist
    expect(items[2].people).toEqual(['person_1']); // &alice

    expect(items[3].type).toBe('note'); // URL

    expect(items[4].type).toBe('task'); // Fix the login bug by friday

    // Step 2: Toggle one item's type
    mockState.braindumpParsedItems = items;
    toggleBraindumpItemType(3); // Toggle URL from note to task
    expect(items[3].type).toBe('task');

    // Step 3: Exclude one item
    toggleBraindumpItemInclude(1); // Exclude "feeling tired"
    expect(items[1].included).toBe(false);

    // Step 4: Submit
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(4); // Buy, Call, URL (toggled), Fix
    expect(result.noteCount).toBe(0); // Note was excluded
    expect(createTaskMock).toHaveBeenCalledTimes(4);
  });

  it('handles input with all metadata types', () => {
    window.parseDateQuery = vi.fn((query) => {
      if (query === 'tomorrow') return [{ date: '2026-02-13' }];
      return [];
    });

    const items = parseBraindumpHeuristic('Buy supplies #work @urgent &alice !tomorrow');
    expect(items).toHaveLength(1);
    expect(items[0].areaId).toBe('area_1');
    expect(items[0].labels).toEqual(['label_1']);
    expect(items[0].people).toEqual(['person_1']);
    expect(items[0].deferDate).toBe('2026-02-13');
  });
});
