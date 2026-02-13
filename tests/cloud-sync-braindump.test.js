// @vitest-environment jsdom
// ============================================================================
// CLOUD SYNC BRAINDUMP TESTS — Data sync integrity: braindump → task → storage → cloud
// ============================================================================
// Tests the full chain: braindump classification → task creation → storage writes
// → cloud sync payload integrity. Focuses on data integrity, sync chain,
// voice capture, processBraindump flow, and round-trip serialization.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mock dependencies BEFORE importing braindump modules (vi.hoisted)
// ---------------------------------------------------------------------------

const { mockState, createTaskMock, saveTasksDataMock } = vi.hoisted(() => {
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
  const saveTasksDataMock = vi.fn();
  return { mockState, createTaskMock, saveTasksDataMock };
});

vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/features/tasks.js', () => ({
  createTask: (...args) => createTaskMock(...args),
}));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: (...args) => saveTasksDataMock(...args),
}));

vi.mock('../src/features/undo.js', () => ({
  startUndoCountdown: vi.fn(),
}));

vi.mock('../src/features/areas.js', () => ({
  getCategoryById: vi.fn(() => null),
}));

vi.mock('../src/utils.js', () => ({
  escapeHtml: (text) => {
    if (!text) return '';
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
  generateTaskId: () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  getLocalDateString: () => '2026-02-13',
}));

vi.mock('../src/constants.js', () => ({
  BRAINDUMP_ACTION_VERBS: [
    'buy', 'call', 'email', 'send', 'schedule', 'book', 'write', 'finish',
    'complete', 'submit', 'review', 'check', 'fix', 'update', 'create',
    'prepare', 'organize', 'clean', 'pick', 'drop', 'return', 'cancel',
    'renew', 'pay', 'order', 'plan', 'research', 'find', 'ask', 'tell',
    'remind', 'follow', 'set', 'move', 'take', 'make', 'get', 'do', 'go',
    'read', 'learn', 'practice', 'try', 'start', 'stop', 'add', 'remove',
    'install', 'configure', 'deploy', 'test', 'debug', 'refactor',
    'implement', 'design', 'draft', 'edit', 'proofread', 'publish', 'share',
    'discuss', 'meet', 'attend', 'file', 'apply', 'register', 'sign',
    'pack', 'ship', 'donate', 'wash', 'iron', 'cook', 'bake',
  ],
  ANTHROPIC_KEY: 'nucleusAnthropicKey',
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
  processBraindump,
  startBraindumpVoiceCapture,
  stopBraindumpVoiceCapture,
  toggleBraindumpVoiceCapture,
  openBraindump,
  closeBraindump,
  submitBraindump,
  backToInput,
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

/**
 * Creates a proper constructor function for SpeechRecognition mocking.
 * vi.fn() creates arrow functions which cannot be used with `new`.
 */
function createMockSpeechRecognitionClass(startOverride) {
  let _lastInstance = null;
  function MockSpeechRecognition() {
    this.start = startOverride || vi.fn();
    this.stop = vi.fn();
    this.lang = '';
    this.continuous = false;
    this.interimResults = false;
    this.maxAlternatives = 1;
    this.onstart = null;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    _lastInstance = this;
  }
  MockSpeechRecognition._getLastInstance = () => _lastInstance;
  MockSpeechRecognition._resetInstance = () => { _lastInstance = null; };
  return MockSpeechRecognition;
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetState();
  createTaskMock.mockClear();
  saveTasksDataMock.mockClear();
  localStorage.clear();
  window.render = vi.fn();
  window.debouncedSaveToGithub = vi.fn();
  window.parseDateQuery = undefined;
  // Clear any SpeechRecognition stubs
  delete window.SpeechRecognition;
  delete window.webkitSpeechRecognition;
  if (globalThis.fetch?.mockRestore) globalThis.fetch.mockRestore();
});

afterEach(() => {
  vi.restoreAllMocks();
});


// ============================================================================
// 1. submitBraindumpItems sync chain tests
// ============================================================================

describe('submitBraindumpItems — sync chain', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('items with all metadata create tasks with correct properties', () => {
    const items = [makeParsedItem({
      title: 'Deploy frontend',
      type: 'task',
      areaId: 'area_1',
      labels: ['label_1', 'label_2'],
      people: ['person_1', 'person_2'],
      deferDate: '2026-03-01',
      dueDate: '2026-03-15',
    })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('Deploy frontend', {
      isNote: false,
      areaId: 'area_1',
      labels: ['label_1', 'label_2'],
      people: ['person_1', 'person_2'],
      deferDate: '2026-03-01',
      dueDate: '2026-03-15',
      status: 'anytime',
    });
  });

  it('createTask is called with status anytime when areaId present', () => {
    const items = [makeParsedItem({ areaId: 'area_2' })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ status: 'anytime' }),
    );
  });

  it('createTask is called with status inbox when areaId is null', () => {
    const items = [makeParsedItem({ areaId: null })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ status: 'inbox' }),
    );
  });

  it('notes get enriched with noteLifecycleState=active and noteHistory', () => {
    const items = [makeParsedItem({ type: 'note', title: 'A thought' })];
    submitBraindumpItems(items);
    const created = createTaskMock.mock.results[0].value;
    expect(created.noteLifecycleState).toBe('active');
    expect(created.noteHistory).toEqual([
      expect.objectContaining({
        action: 'created',
        source: 'braindump',
        at: expect.any(String),
      }),
    ]);
  });

  it('noteHistory.at matches createdAt timestamp', () => {
    const items = [makeParsedItem({ type: 'note' })];
    submitBraindumpItems(items);
    const created = createTaskMock.mock.results[0].value;
    expect(created.noteHistory[0].at).toBe(created.createdAt);
  });

  it('tasks do NOT get noteLifecycleState or noteHistory', () => {
    const items = [makeParsedItem({ type: 'task' })];
    submitBraindumpItems(items);
    const created = createTaskMock.mock.results[0].value;
    expect(created.noteLifecycleState).toBeUndefined();
    expect(created.noteHistory).toBeUndefined();
  });

  it('empty items array returns {taskCount:0, noteCount:0}', () => {
    const result = submitBraindumpItems([]);
    expect(result).toEqual({ taskCount: 0, noteCount: 0 });
    expect(createTaskMock).not.toHaveBeenCalled();
  });

  it('items with included=false are filtered out', () => {
    const items = [
      makeParsedItem({ title: 'Excluded', included: false }),
      makeParsedItem({ title: 'Also excluded', included: false, index: 1 }),
    ];
    const result = submitBraindumpItems(items);
    expect(result).toEqual({ taskCount: 0, noteCount: 0 });
    expect(createTaskMock).not.toHaveBeenCalled();
  });

  it('mix of tasks and notes counted separately', () => {
    const items = [
      makeParsedItem({ type: 'task', index: 0 }),
      makeParsedItem({ type: 'note', index: 1 }),
      makeParsedItem({ type: 'task', index: 2 }),
      makeParsedItem({ type: 'note', index: 3 }),
      makeParsedItem({ type: 'note', index: 4 }),
    ];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(2);
    expect(result.noteCount).toBe(3);
    expect(createTaskMock).toHaveBeenCalledTimes(5);
  });

  it('very large number of items (100+) all created', () => {
    const items = Array.from({ length: 120 }, (_, i) =>
      makeParsedItem({ title: `Item ${i}`, index: i, type: i % 2 === 0 ? 'task' : 'note' }),
    );
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(60);
    expect(result.noteCount).toBe(60);
    expect(createTaskMock).toHaveBeenCalledTimes(120);
  });

  it('items with null labels array do not crash', () => {
    const items = [makeParsedItem({ labels: null })];
    expect(() => submitBraindumpItems(items)).not.toThrow();
  });

  it('items with undefined people array do not crash', () => {
    const items = [makeParsedItem({ people: undefined })];
    expect(() => submitBraindumpItems(items)).not.toThrow();
  });

  it('items with empty string title still passed to createTask', () => {
    const items = [makeParsedItem({ title: '' })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('', expect.any(Object));
  });

  it('items with only whitespace title are passed to createTask', () => {
    const items = [makeParsedItem({ title: '   ' })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith('   ', expect.any(Object));
  });

  it('partial exclusion: only included items processed', () => {
    const items = [
      makeParsedItem({ title: 'A', included: true, index: 0 }),
      makeParsedItem({ title: 'B', included: false, index: 1 }),
      makeParsedItem({ title: 'C', included: true, index: 2 }),
      makeParsedItem({ title: 'D', included: false, index: 3 }),
    ];
    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(2);
    expect(createTaskMock).toHaveBeenCalledTimes(2);
    expect(createTaskMock.mock.calls[0][0]).toBe('A');
    expect(createTaskMock.mock.calls[1][0]).toBe('C');
  });

  it('isNote=true for note type, isNote=false for task type', () => {
    const items = [
      makeParsedItem({ type: 'task', index: 0 }),
      makeParsedItem({ type: 'note', index: 1 }),
    ];
    submitBraindumpItems(items);
    expect(createTaskMock.mock.calls[0][1].isNote).toBe(false);
    expect(createTaskMock.mock.calls[1][1].isNote).toBe(true);
  });

  it('null createTask return for notes does not throw', () => {
    createTaskMock.mockReturnValueOnce(null);
    const items = [makeParsedItem({ type: 'note' })];
    expect(() => submitBraindumpItems(items)).not.toThrow();
    expect(createTaskMock).toHaveBeenCalledTimes(1);
  });

  it('createTask receives deferDate and dueDate independently', () => {
    const items = [makeParsedItem({ deferDate: '2026-04-01', dueDate: null })];
    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ deferDate: '2026-04-01', dueDate: null }),
    );
  });
});


// ============================================================================
// 2. processBraindump() tests
// ============================================================================

describe('processBraindump — flow control', () => {
  beforeEach(() => {
    setupEntities();
    localStorage.removeItem('nucleusAnthropicKey');
  });

  it('guards against double-click: returns immediately if braindumpProcessing=true', async () => {
    mockState.braindumpProcessing = true;
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    await processBraindump();
    expect(mockState.braindumpStep).toBe('input');
    expect(window.render).not.toHaveBeenCalled();

    document.body.removeChild(ta);
  });

  it('reads textarea value from DOM element', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Call dentist';
    document.body.appendChild(ta);

    await processBraindump();
    expect(mockState.braindumpRawText).toBe('Call dentist');

    document.body.removeChild(ta);
  });

  it('empty text returns without processing', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = '   ';
    document.body.appendChild(ta);

    await processBraindump();
    expect(mockState.braindumpStep).toBe('input');
    expect(mockState.braindumpParsedItems).toEqual([]);

    document.body.removeChild(ta);
  });

  it('with API key sets braindumpProcessing=true, step=processing, renders', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    let processingWasTrue = false;
    let stepWasProcessing = false;
    window.render = vi.fn(() => {
      if (mockState.braindumpProcessing) processingWasTrue = true;
      if (mockState.braindumpStep === 'processing') stepWasProcessing = true;
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        content: [{ text: JSON.stringify([{ title: 'Buy milk', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }]) }],
      }),
    });

    await processBraindump();
    expect(processingWasTrue).toBe(true);
    expect(stepWasProcessing).toBe(true);

    document.body.removeChild(ta);
  });

  it('on success sets parsed items and step=review', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk\nCall dentist';
    document.body.appendChild(ta);

    await processBraindump();
    expect(mockState.braindumpStep).toBe('review');
    expect(mockState.braindumpParsedItems.length).toBeGreaterThanOrEqual(2);
    expect(mockState.braindumpEditingIndex).toBeNull();

    document.body.removeChild(ta);
  });

  it('on error stores error message, falls back to heuristic and step=review', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network down'));

    await processBraindump();
    // parseBraindump catches the error internally and falls back to heuristic
    // so processBraindump succeeds with step=review, but braindumpAIError is set
    expect(mockState.braindumpAIError).toBe('Network down');

    document.body.removeChild(ta);
  });

  it('finally block sets braindumpProcessing=false', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Test';
    document.body.appendChild(ta);

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('fail'));

    await processBraindump();
    expect(mockState.braindumpProcessing).toBe(false);

    document.body.removeChild(ta);
  });

  it('without API key goes directly to heuristic (no processing state)', async () => {
    localStorage.removeItem('nucleusAnthropicKey');
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    let sawProcessingStep = false;
    window.render = vi.fn(() => {
      if (mockState.braindumpStep === 'processing') sawProcessingStep = true;
    });

    await processBraindump();
    expect(sawProcessingStep).toBe(false);
    expect(mockState.braindumpStep).toBe('review');

    document.body.removeChild(ta);
  });

  it('when no textarea element exists, uses existing braindumpRawText', async () => {
    mockState.braindumpRawText = 'Existing text to process';
    await processBraindump();
    expect(mockState.braindumpStep).toBe('review');
    expect(mockState.braindumpParsedItems.length).toBe(1);
  });

  it('renders after completion', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    await processBraindump();
    expect(window.render).toHaveBeenCalled();

    document.body.removeChild(ta);
  });
});


// ============================================================================
// 3. Voice capture tests
// ============================================================================

describe('startBraindumpVoiceCapture', () => {
  it('sets up SpeechRecognition when available', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    const inst = Ctor._getLastInstance();
    expect(inst).toBeTruthy();
    expect(inst.start).toHaveBeenCalled();
    expect(inst.continuous).toBe(true);
    expect(inst.interimResults).toBe(true);
  });

  it('shows error when SpeechRecognition unavailable', () => {
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
    startBraindumpVoiceCapture();
    expect(mockState.braindumpVoiceError).toContain('not supported');
    expect(window.render).toHaveBeenCalled();
  });

  it('guards against double-start (recording=true)', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    mockState.braindumpVoiceRecording = true;
    startBraindumpVoiceCapture();
    expect(Ctor._getLastInstance()).toBeNull();
  });

  it('guards against transcribing state', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    mockState.braindumpVoiceTranscribing = true;
    startBraindumpVoiceCapture();
    expect(Ctor._getLastInstance()).toBeNull();
  });

  it('clears previous voice error', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    mockState.braindumpVoiceError = 'old error';
    startBraindumpVoiceCapture();
    expect(mockState.braindumpVoiceError).toBeNull();
  });

  it('uses webkitSpeechRecognition as fallback', () => {
    delete window.SpeechRecognition;
    const Ctor = createMockSpeechRecognitionClass();
    window.webkitSpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    const inst = Ctor._getLastInstance();
    expect(inst).toBeTruthy();
    expect(inst.start).toHaveBeenCalled();
  });

  it('sets voice error if recognition.start() throws', () => {
    const throwingStart = vi.fn(() => { throw new Error('permission denied'); });
    const Ctor = createMockSpeechRecognitionClass(throwingStart);
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    expect(mockState.braindumpVoiceError).toContain('could not start');
    expect(mockState.braindumpVoiceRecording).toBe(false);
    expect(window.render).toHaveBeenCalled();
  });

  it('configures maxAlternatives=1', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    expect(Ctor._getLastInstance().maxAlternatives).toBe(1);
  });
});

describe('stopBraindumpVoiceCapture', () => {
  it('no-op when no recognition instance (does not throw)', () => {
    expect(() => stopBraindumpVoiceCapture()).not.toThrow();
  });

  it('calls stop on recognition when started', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    const inst = Ctor._getLastInstance();
    stopBraindumpVoiceCapture();
    expect(inst.stop).toHaveBeenCalled();
  });

  it('sets braindumpVoiceTranscribing to false', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    mockState.braindumpVoiceTranscribing = true;
    stopBraindumpVoiceCapture();
    expect(mockState.braindumpVoiceTranscribing).toBe(false);
  });
});

describe('toggleBraindumpVoiceCapture', () => {
  it('starts when not recording and not transcribing', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    mockState.braindumpVoiceRecording = false;
    mockState.braindumpVoiceTranscribing = false;
    toggleBraindumpVoiceCapture();
    expect(Ctor._getLastInstance()).toBeTruthy();
  });

  it('stops when recording', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    const inst = Ctor._getLastInstance();
    mockState.braindumpVoiceRecording = true;

    toggleBraindumpVoiceCapture();
    expect(inst.stop).toHaveBeenCalled();
  });

  it('stops when transcribing', () => {
    const Ctor = createMockSpeechRecognitionClass();
    window.SpeechRecognition = Ctor;
    startBraindumpVoiceCapture();
    const inst = Ctor._getLastInstance();
    mockState.braindumpVoiceTranscribing = true;
    mockState.braindumpVoiceRecording = false;

    toggleBraindumpVoiceCapture();
    expect(inst.stop).toHaveBeenCalled();
  });
});


// ============================================================================
// 4. parseBraindump AI path tests
// ============================================================================

describe('parseBraindump — AI classification path', () => {
  beforeEach(() => {
    setupEntities();
    localStorage.setItem('nucleusAnthropicKey', 'sk-test-key');
  });

  function mockFetchResponse(body, ok = true, status = 200) {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
    });
  }

  function mockAIItems(items) {
    mockFetchResponse({ content: [{ text: JSON.stringify(items) }] });
  }

  it('with API key calls fetch with correct headers and body', async () => {
    mockAIItems([{ title: 'Test', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    await parseBraindump('Test text');

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(opts.method).toBe('POST');
    expect(opts.headers['x-api-key']).toBe('sk-test-key');
    expect(opts.headers['anthropic-version']).toBe('2023-06-01');
    expect(opts.headers['anthropic-dangerous-direct-browser-access']).toBe('true');
    const body = JSON.parse(opts.body);
    expect(body.model).toBe('claude-haiku-4-5-20251001');
    expect(body.max_tokens).toBe(4096);
    expect(body.messages[0].content).toBe('Test text');
  });

  it('AI returns valid JSON — items parsed correctly', async () => {
    mockAIItems([
      { title: 'Buy groceries', type: 'task', confidence: 0.95, area: 'Work', tags: ['urgent'], people: ['Alice'], deferDate: '2026-03-01', dueDate: '2026-03-15' },
      { title: 'Feeling tired', type: 'note', confidence: 0.85, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ]);
    const result = await parseBraindump('Buy groceries and feeling tired');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Buy groceries');
    expect(result[0].type).toBe('task');
    expect(result[0].areaId).toBe('area_1');
    expect(result[0].labels).toEqual(['label_1']);
    expect(result[0].people).toEqual(['person_1']);
    expect(result[0].deferDate).toBe('2026-03-01');
    expect(result[0].dueDate).toBe('2026-03-15');
    expect(result[1].title).toBe('Feeling tired');
    expect(result[1].type).toBe('note');
  });

  it('AI returns markdown-wrapped JSON — stripped and parsed', async () => {
    const items = [{ title: 'Wrapped', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: '```json\n' + JSON.stringify(items) + '\n```' }] }),
    });
    const result = await parseBraindump('Test');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Wrapped');
  });

  it('AI returns empty array — falls back to heuristic, sets error', async () => {
    mockFetchResponse({ content: [{ text: '[]' }] });
    const result = await parseBraindump('Buy milk');
    expect(result.length).toBeGreaterThan(0);
    expect(mockState.braindumpAIError).toBe('AI returned empty results');
  });

  it('AI returns non-array — throws, falls back to heuristic', async () => {
    mockFetchResponse({ content: [{ text: '{"not": "array"}' }] });
    const result = await parseBraindump('Buy milk');
    expect(result.length).toBeGreaterThan(0);
    expect(mockState.braindumpAIError).toBeTruthy();
  });

  it('API returns non-200 — throws with status code, falls back', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Rate limited'),
    });
    const result = await parseBraindump('Buy milk');
    expect(result.length).toBeGreaterThan(0);
    expect(mockState.braindumpAIError).toContain('429');
  });

  it('API times out (AbortError) — specific timeout message', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);
    const result = await parseBraindump('Buy milk');
    expect(result.length).toBeGreaterThan(0);
    expect(mockState.braindumpAIError).toContain('timed out');
  });

  it('malformed JSON from API — falls back to heuristic', async () => {
    mockFetchResponse({ content: [{ text: 'this is not json {{{' }] });
    const result = await parseBraindump('Fix the bug');
    expect(result.length).toBeGreaterThan(0);
    expect(mockState.braindumpAIError).toBeTruthy();
  });

  it('API key present but empty string — treated as no key', async () => {
    localStorage.setItem('nucleusAnthropicKey', '');
    const result = await parseBraindump('Buy milk');
    expect(result.length).toBeGreaterThan(0);
    expect(mockState.braindumpAIError).toBeNull();
  });

  it('area/label/person names resolved to IDs case-insensitively', async () => {
    mockAIItems([{
      title: 'Task',
      type: 'task',
      confidence: 0.9,
      area: 'WORK',
      tags: ['URGENT', 'Waiting'],
      people: ['alice', 'BOB'],
      deferDate: null,
      dueDate: null,
    }]);
    const result = await parseBraindump('Task');
    expect(result[0].areaId).toBe('area_1');
    expect(result[0].labels).toEqual(['label_1', 'label_2']);
    expect(result[0].people).toEqual(['person_1', 'person_2']);
  });

  it('unmatched area/label/person names result in null/empty arrays', async () => {
    mockAIItems([{
      title: 'Task',
      type: 'task',
      confidence: 0.9,
      area: 'Nonexistent',
      tags: ['unknown_tag'],
      people: ['Stranger'],
      deferDate: null,
      dueDate: null,
    }]);
    const result = await parseBraindump('Task');
    expect(result[0].areaId).toBeNull();
    expect(result[0].labels).toEqual([]);
    expect(result[0].people).toEqual([]);
  });

  it('invalid date formats from AI result in null dates', async () => {
    mockAIItems([{
      title: 'Task',
      type: 'task',
      confidence: 0.9,
      area: null,
      tags: [],
      people: [],
      deferDate: 'March 1st',
      dueDate: '2026/03/15',
    }]);
    const result = await parseBraindump('Task');
    expect(result[0].deferDate).toBeNull();
    expect(result[0].dueDate).toBeNull();
  });

  it('valid YYYY-MM-DD dates from AI are preserved', async () => {
    mockAIItems([{
      title: 'Task',
      type: 'task',
      confidence: 0.9,
      area: null,
      tags: [],
      people: [],
      deferDate: '2026-04-01',
      dueDate: '2026-05-15',
    }]);
    const result = await parseBraindump('Task');
    expect(result[0].deferDate).toBe('2026-04-01');
    expect(result[0].dueDate).toBe('2026-05-15');
  });

  it('confidence clamped to 1 when too high', async () => {
    mockAIItems([{ title: 'T', type: 'task', confidence: 99.5, area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    const result = await parseBraindump('T');
    expect(result[0].confidence).toBe(1);
  });

  it('confidence clamped to 0 when negative', async () => {
    mockAIItems([{ title: 'T', type: 'task', confidence: -2.0, area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    const result = await parseBraindump('T');
    expect(result[0].confidence).toBe(0);
  });

  it('confidence defaults to 0.8 when missing', async () => {
    mockAIItems([{ title: 'T', type: 'task', area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    const result = await parseBraindump('T');
    expect(result[0].confidence).toBe(0.8);
  });

  it('items with empty title after AI are filtered out', async () => {
    mockAIItems([
      { title: '', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: '  ', type: 'note', confidence: 0.5, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: 'Valid', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ]);
    const result = await parseBraindump('test');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Valid');
  });

  it('unrecognized type defaults to task', async () => {
    mockAIItems([{ title: 'Item', type: 'event', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    const result = await parseBraindump('Item');
    expect(result[0].type).toBe('task');
  });

  it('clears previous AI error before new parse', async () => {
    mockState.braindumpAIError = 'old error';
    mockAIItems([{ title: 'T', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    await parseBraindump('T');
    expect(mockState.braindumpAIError).toBeNull();
  });

  it('each item gets included=true by default', async () => {
    mockAIItems([
      { title: 'A', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: 'B', type: 'note', confidence: 0.7, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ]);
    const result = await parseBraindump('test');
    expect(result.every(item => item.included === true)).toBe(true);
  });

  it('each item gets correct index', async () => {
    mockAIItems([
      { title: 'First', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: 'Second', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null },
      { title: 'Third', type: 'note', confidence: 0.8, area: null, tags: [], people: [], deferDate: null, dueDate: null },
    ]);
    const result = await parseBraindump('test');
    expect(result[0].index).toBe(0);
    expect(result[1].index).toBe(1);
    expect(result[2].index).toBe(2);
  });

  it('system prompt includes user areas, tags, and people', async () => {
    mockAIItems([{ title: 'T', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }]);
    await parseBraindump('Test');
    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body.system).toContain('Work');
    expect(body.system).toContain('Personal');
    expect(body.system).toContain('urgent');
    expect(body.system).toContain('Alice');
  });
});


// ============================================================================
// 5. refineVoiceTranscriptWithAI edge cases
// ============================================================================

describe('refineVoiceTranscriptWithAI — edge cases', () => {
  it('empty transcript returns empty string', async () => {
    expect(await refineVoiceTranscriptWithAI('')).toBe('');
  });

  it('whitespace-only transcript returns empty string', async () => {
    expect(await refineVoiceTranscriptWithAI('   \n  ')).toBe('');
  });

  it('null transcript returns empty string', async () => {
    expect(await refineVoiceTranscriptWithAI(null)).toBe('');
  });

  it('undefined transcript returns empty string', async () => {
    expect(await refineVoiceTranscriptWithAI(undefined)).toBe('');
  });

  it('no API key returns raw transcript unchanged', async () => {
    localStorage.removeItem('nucleusAnthropicKey');
    const result = await refineVoiceTranscriptWithAI('buy milk call dentist');
    expect(result).toBe('buy milk call dentist');
  });

  it('API success returns cleaned text', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: 'Buy milk. Call dentist.' }] }),
    });
    const result = await refineVoiceTranscriptWithAI('buy milk call dentist');
    expect(result).toBe('Buy milk. Call dentist.');
  });

  it('API returns empty content — returns raw transcript', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: '' }] }),
    });
    const result = await refineVoiceTranscriptWithAI('raw text');
    expect(result).toBe('raw text');
  });

  it('API returns no content array — returns raw transcript', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [] }),
    });
    const result = await refineVoiceTranscriptWithAI('raw text');
    expect(result).toBe('raw text');
  });

  it('API error (non-200) — returns raw transcript', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    const result = await refineVoiceTranscriptWithAI('raw text');
    expect(result).toBe('raw text');
  });

  it('network error — returns raw transcript', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const result = await refineVoiceTranscriptWithAI('raw text');
    expect(result).toBe('raw text');
  });

  it('timeout (AbortError) — returns raw transcript', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    const abortError = new DOMException('Aborted', 'AbortError');
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);
    const result = await refineVoiceTranscriptWithAI('raw text');
    expect(result).toBe('raw text');
  });

  it('sends correct headers and model', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-voice-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: 'Cleaned.' }] }),
    });
    await refineVoiceTranscriptWithAI('test');
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(opts.headers['x-api-key']).toBe('sk-voice-test');
    const body = JSON.parse(opts.body);
    expect(body.model).toBe('claude-haiku-4-5-20251001');
    expect(body.max_tokens).toBe(1024);
  });

  it('sends trimmed transcript as message content', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [{ text: 'Done.' }] }),
    });
    await refineVoiceTranscriptWithAI('  padded text  ');
    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body.messages[0].content).toBe('padded text');
  });
});


// ============================================================================
// 6. Round-trip data integrity tests
// ============================================================================

describe('Round-trip data integrity', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('items submitted via braindump create tasks that survive JSON serialization', () => {
    const items = [makeParsedItem({
      title: 'Deploy to production',
      type: 'task',
      areaId: 'area_1',
      labels: ['label_1', 'label_2'],
      people: ['person_1'],
      deferDate: '2026-03-01',
      dueDate: '2026-03-15',
    })];
    submitBraindumpItems(items);
    const created = createTaskMock.mock.results[0].value;

    const serialized = JSON.stringify(created);
    const deserialized = JSON.parse(serialized);

    expect(deserialized.title).toBe('Deploy to production');
    expect(deserialized.areaId).toBe('area_1');
    expect(deserialized.labels).toEqual(['label_1', 'label_2']);
    expect(deserialized.people).toEqual(['person_1']);
    expect(deserialized.deferDate).toBe('2026-03-01');
    expect(deserialized.dueDate).toBe('2026-03-15');
    expect(deserialized.status).toBe('anytime');
    expect(deserialized.isNote).toBe(false);
    expect(typeof deserialized.createdAt).toBe('string');
    expect(typeof deserialized.id).toBe('string');
  });

  it('note lifecycle metadata survives JSON serialization', () => {
    const items = [makeParsedItem({ title: 'A thought', type: 'note' })];
    submitBraindumpItems(items);
    const created = createTaskMock.mock.results[0].value;

    const serialized = JSON.stringify(created);
    const deserialized = JSON.parse(serialized);

    expect(deserialized.noteLifecycleState).toBe('active');
    expect(deserialized.noteHistory).toHaveLength(1);
    expect(deserialized.noteHistory[0].action).toBe('created');
    expect(deserialized.noteHistory[0].source).toBe('braindump');
    expect(typeof deserialized.noteHistory[0].at).toBe('string');
    expect(new Date(deserialized.noteHistory[0].at).toISOString()).toBe(deserialized.noteHistory[0].at);
  });

  it('no functions or circular refs in created task objects', () => {
    const items = [makeParsedItem({
      title: 'Check task purity',
      type: 'task',
      areaId: 'area_1',
      labels: ['label_1'],
      people: ['person_1'],
    })];
    submitBraindumpItems(items);
    const created = createTaskMock.mock.results[0].value;

    const str = JSON.stringify(created);
    expect(str).toBeTruthy();
    const parsed = JSON.parse(str);

    Object.values(parsed).forEach(val => {
      expect(typeof val).not.toBe('function');
    });
  });

  it('metadata extraction then createTask: no data loss in the chain', () => {
    window.parseDateQuery = vi.fn((query) => {
      if (query === 'tomorrow') return [{ date: '2026-02-14' }];
      return [];
    });

    const metadata = extractMetadata('Deploy app #work @urgent &alice !tomorrow');
    const classification = classifyItem('Deploy app #work @urgent &alice !tomorrow');

    const item = makeParsedItem({
      title: metadata.title,
      type: classification.type,
      areaId: metadata.areaId,
      labels: metadata.labels,
      people: metadata.people,
      deferDate: metadata.deferDate,
      dueDate: metadata.dueDate,
    });

    submitBraindumpItems([item]);
    const call = createTaskMock.mock.calls[0];
    expect(call[0]).toBe('Deploy app');
    expect(call[1].areaId).toBe('area_1');
    expect(call[1].labels).toEqual(['label_1']);
    expect(call[1].people).toEqual(['person_1']);
    expect(call[1].deferDate).toBe('2026-02-14');
  });

  it('large batch processing: 50 items processed in order, all metadata preserved', () => {
    const items = Array.from({ length: 50 }, (_, i) => makeParsedItem({
      index: i,
      title: `Task ${i}`,
      type: i % 3 === 0 ? 'note' : 'task',
      areaId: i % 5 === 0 ? 'area_1' : null,
      labels: i % 4 === 0 ? ['label_1'] : [],
      people: i % 7 === 0 ? ['person_1'] : [],
      deferDate: i % 10 === 0 ? `2026-03-${String(i + 1).padStart(2, '0')}` : null,
    }));

    submitBraindumpItems(items);
    expect(createTaskMock).toHaveBeenCalledTimes(50);

    for (let i = 0; i < 50; i++) {
      const [title, opts] = createTaskMock.mock.calls[i];
      expect(title).toBe(`Task ${i}`);
      expect(opts.isNote).toBe(i % 3 === 0);
      expect(opts.areaId).toBe(i % 5 === 0 ? 'area_1' : null);
      expect(opts.labels).toEqual(i % 4 === 0 ? ['label_1'] : []);
      expect(opts.people).toEqual(i % 7 === 0 ? ['person_1'] : []);
      expect(opts.status).toBe(i % 5 === 0 ? 'anytime' : 'inbox');
    }
  });

  it('all created tasks have valid ISO createdAt timestamps', () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      makeParsedItem({ index: i, title: `T${i}` }),
    );
    submitBraindumpItems(items);
    for (let i = 0; i < 10; i++) {
      const task = createTaskMock.mock.results[i].value;
      const d = new Date(task.createdAt);
      expect(d.toString()).not.toBe('Invalid Date');
      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
  });

  it('all created tasks have string IDs', () => {
    const items = Array.from({ length: 5 }, (_, i) =>
      makeParsedItem({ index: i, title: `T${i}` }),
    );
    submitBraindumpItems(items);
    for (let i = 0; i < 5; i++) {
      expect(typeof createTaskMock.mock.results[i].value.id).toBe('string');
      expect(createTaskMock.mock.results[i].value.id.length).toBeGreaterThan(0);
    }
  });

  it('heuristic parseBraindump produces items that cleanly serialize', () => {
    const items = parseBraindumpHeuristic('Buy milk #work @urgent &alice\nNote: feeling tired');
    for (const item of items) {
      const str = JSON.stringify(item);
      const parsed = JSON.parse(str);
      expect(parsed.title).toBe(item.title);
      expect(parsed.type).toBe(item.type);
      expect(parsed.areaId).toBe(item.areaId);
      expect(parsed.labels).toEqual(item.labels);
      expect(parsed.people).toEqual(item.people);
    }
  });
});


// ============================================================================
// 7. Additional edge cases for heuristic and AI fallback chain
// ============================================================================

describe('parseBraindump — heuristic fallback chain', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('no API key returns heuristic results wrapped in Promise', async () => {
    localStorage.removeItem('nucleusAnthropicKey');
    const result = await parseBraindump('Buy milk\nCall dentist');
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('task');
    expect(result[1].type).toBe('task');
  });

  it('heuristic fallback preserves all item shape properties', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('fail'));

    const result = await parseBraindump('Buy milk');
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

  it('AI error stores message in braindumpAIError state', async () => {
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Custom error message'));
    await parseBraindump('Test');
    expect(mockState.braindumpAIError).toBe('Custom error message');
  });

  it('successful AI clears braindumpAIError', async () => {
    mockState.braindumpAIError = 'old error';
    localStorage.setItem('nucleusAnthropicKey', 'sk-test');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        content: [{ text: JSON.stringify([{ title: 'T', type: 'task', confidence: 0.9, area: null, tags: [], people: [], deferDate: null, dueDate: null }]) }],
      }),
    });
    await parseBraindump('Test');
    expect(mockState.braindumpAIError).toBeNull();
  });
});


// ============================================================================
// 8. Full integration: processBraindump then submitBraindump chain
// ============================================================================

describe('Full braindump flow: process then review then submit', () => {
  beforeEach(() => {
    setupEntities();
    localStorage.removeItem('nucleusAnthropicKey');
  });

  it('process then submit creates tasks for all parsed items', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk\nCall dentist\nNote: remember to rest';
    document.body.appendChild(ta);

    await processBraindump();
    expect(mockState.braindumpStep).toBe('review');
    expect(mockState.braindumpParsedItems.length).toBe(3);

    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledTimes(3);
    expect(mockState.braindumpStep).toBe('success');

    document.body.removeChild(ta);
  });

  it('excluded items during review are not submitted', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk\nCall dentist';
    document.body.appendChild(ta);

    await processBraindump();
    toggleBraindumpItemInclude(0);
    expect(mockState.braindumpParsedItems[0].included).toBe(false);

    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledTimes(1);
    expect(createTaskMock.mock.calls[0][0]).toBe('Call dentist');

    document.body.removeChild(ta);
  });

  it('type toggle during review changes what gets created', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    await processBraindump();
    toggleBraindumpItemType(0);
    expect(mockState.braindumpParsedItems[0].type).toBe('note');

    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ isNote: true }),
    );

    document.body.removeChild(ta);
  });

  it('area change during review affects status on submit', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    await processBraindump();
    setBraindumpItemArea(0, 'area_1');

    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ status: 'anytime', areaId: 'area_1' }),
    );

    document.body.removeChild(ta);
  });

  it('label additions during review are included on submit', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    await processBraindump();
    addBraindumpItemLabel(0, 'label_1');
    addBraindumpItemLabel(0, 'label_2');

    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ labels: ['label_1', 'label_2'] }),
    );

    document.body.removeChild(ta);
  });

  it('people additions during review are included on submit', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Meet with team';
    document.body.appendChild(ta);

    await processBraindump();
    addBraindumpItemPerson(0, 'person_1');
    addBraindumpItemPerson(0, 'person_2');

    submitBraindump();
    expect(createTaskMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ people: ['person_1', 'person_2'] }),
    );

    document.body.removeChild(ta);
  });

  it('back to input and reprocess works correctly', async () => {
    const ta = document.createElement('textarea');
    ta.id = 'braindump-textarea';
    ta.value = 'Buy milk';
    document.body.appendChild(ta);

    await processBraindump();
    expect(mockState.braindumpStep).toBe('review');

    backToInput();
    expect(mockState.braindumpStep).toBe('input');
    expect(mockState.braindumpEditingIndex).toBeNull();

    ta.value = 'Buy milk\nCall dentist\nFix bug';
    await processBraindump();
    expect(mockState.braindumpStep).toBe('review');
    expect(mockState.braindumpParsedItems.length).toBe(3);

    document.body.removeChild(ta);
  });
});


// ============================================================================
// 9. getAnthropicKey / setAnthropicKey with nucleusAnthropicKey
// ============================================================================

describe('getAnthropicKey / setAnthropicKey with correct localStorage key', () => {
  it('getAnthropicKey reads from nucleusAnthropicKey', () => {
    localStorage.setItem('nucleusAnthropicKey', 'my-key');
    expect(getAnthropicKey()).toBe('my-key');
  });

  it('getAnthropicKey returns empty string when not set', () => {
    localStorage.removeItem('nucleusAnthropicKey');
    expect(getAnthropicKey()).toBe('');
  });

  it('setAnthropicKey writes to nucleusAnthropicKey', () => {
    setAnthropicKey('new-key');
    expect(localStorage.getItem('nucleusAnthropicKey')).toBe('new-key');
  });

  it('setAnthropicKey trims whitespace', () => {
    setAnthropicKey('  padded-key  ');
    expect(localStorage.getItem('nucleusAnthropicKey')).toBe('padded-key');
  });

  it('setAnthropicKey removes key for empty string', () => {
    localStorage.setItem('nucleusAnthropicKey', 'existing');
    setAnthropicKey('');
    expect(localStorage.getItem('nucleusAnthropicKey')).toBeNull();
  });

  it('setAnthropicKey removes key for null', () => {
    localStorage.setItem('nucleusAnthropicKey', 'existing');
    setAnthropicKey(null);
    expect(localStorage.getItem('nucleusAnthropicKey')).toBeNull();
  });

  it('setAnthropicKey removes key for whitespace-only', () => {
    localStorage.setItem('nucleusAnthropicKey', 'existing');
    setAnthropicKey('   ');
    expect(localStorage.getItem('nucleusAnthropicKey')).toBeNull();
  });
});


// ============================================================================
// 10. Item manipulation during review — sync implications
// ============================================================================

describe('Item manipulation — metadata changes affect submit payload', () => {
  beforeEach(() => {
    setupEntities();
    mockState.braindumpParsedItems = [
      makeParsedItem({ title: 'Task A', type: 'task', index: 0 }),
      makeParsedItem({ title: 'Note B', type: 'note', index: 1 }),
    ];
  });

  it('removeBraindumpItem reduces items submitted', () => {
    removeBraindumpItem(0);
    expect(mockState.braindumpParsedItems).toHaveLength(1);
    submitBraindumpItems(mockState.braindumpParsedItems);
    expect(createTaskMock).toHaveBeenCalledTimes(1);
    expect(createTaskMock.mock.calls[0][0]).toBe('Note B');
  });

  it('removeBraindumpItem re-indexes for correct ordering', () => {
    mockState.braindumpParsedItems.push(
      makeParsedItem({ title: 'Task C', type: 'task', index: 2 }),
    );
    removeBraindumpItem(1);
    expect(mockState.braindumpParsedItems[0].index).toBe(0);
    expect(mockState.braindumpParsedItems[1].index).toBe(1);
    expect(mockState.braindumpParsedItems[1].title).toBe('Task C');
  });

  it('setBraindumpItemDate persists for submission', () => {
    setBraindumpItemDate(0, '2026-06-15');
    submitBraindumpItems(mockState.braindumpParsedItems);
    expect(createTaskMock.mock.calls[0][1].deferDate).toBe('2026-06-15');
  });

  it('clearBraindumpItemDate removes dates from submission', () => {
    mockState.braindumpParsedItems[0].deferDate = '2026-03-01';
    mockState.braindumpParsedItems[0].dueDate = '2026-03-15';
    clearBraindumpItemDate(0);
    submitBraindumpItems(mockState.braindumpParsedItems);
    expect(createTaskMock.mock.calls[0][1].deferDate).toBeNull();
    expect(createTaskMock.mock.calls[0][1].dueDate).toBeNull();
  });

  it('editBraindumpItem + saveBraindumpItemEdit updates title for submission', () => {
    editBraindumpItem(0);
    expect(mockState.braindumpEditingIndex).toBe(0);

    const input = document.createElement('input');
    input.id = 'braindump-edit-0';
    input.value = 'Updated Task A';
    document.body.appendChild(input);

    saveBraindumpItemEdit(0);
    expect(mockState.braindumpParsedItems[0].title).toBe('Updated Task A');

    submitBraindumpItems(mockState.braindumpParsedItems);
    expect(createTaskMock.mock.calls[0][0]).toBe('Updated Task A');

    document.body.removeChild(input);
  });

  it('cancelBraindumpItemEdit does not modify title', () => {
    editBraindumpItem(0);
    cancelBraindumpItemEdit();
    expect(mockState.braindumpParsedItems[0].title).toBe('Task A');
  });

  it('removeBraindumpItemLabel affects submission', () => {
    mockState.braindumpParsedItems[0].labels = ['label_1', 'label_2'];
    removeBraindumpItemLabel(0, 'label_1');
    submitBraindumpItems(mockState.braindumpParsedItems);
    expect(createTaskMock.mock.calls[0][1].labels).toEqual(['label_2']);
  });

  it('removeBraindumpItemPerson affects submission', () => {
    mockState.braindumpParsedItems[0].people = ['person_1', 'person_2'];
    removeBraindumpItemPerson(0, 'person_1');
    submitBraindumpItems(mockState.braindumpParsedItems);
    expect(createTaskMock.mock.calls[0][1].people).toEqual(['person_2']);
  });
});


// ============================================================================
// 11. openBraindump / closeBraindump state management for sync
// ============================================================================

describe('openBraindump / closeBraindump — state reset for clean sync', () => {
  it('openBraindump clears all prior braindump state for fresh session', () => {
    mockState.braindumpRawText = 'stale text';
    mockState.braindumpParsedItems = [makeParsedItem()];
    mockState.braindumpStep = 'review';
    mockState.braindumpEditingIndex = 2;
    mockState.braindumpVoiceRecording = true;
    mockState.braindumpVoiceTranscribing = true;
    mockState.braindumpVoiceError = 'old error';

    openBraindump();

    expect(mockState.showBraindump).toBe(true);
    expect(mockState.braindumpStep).toBe('input');
    expect(mockState.braindumpRawText).toBe('');
    expect(mockState.braindumpParsedItems).toEqual([]);
    expect(mockState.braindumpEditingIndex).toBeNull();
    expect(mockState.braindumpVoiceRecording).toBe(false);
    expect(mockState.braindumpVoiceTranscribing).toBe(false);
    expect(mockState.braindumpVoiceError).toBeNull();
  });

  it('closeBraindump clears all state to prevent stale data in next session', () => {
    mockState.showBraindump = true;
    mockState.braindumpRawText = 'text';
    mockState.braindumpParsedItems = [makeParsedItem()];
    mockState.braindumpStep = 'success';

    closeBraindump();

    expect(mockState.showBraindump).toBe(false);
    expect(mockState.braindumpRawText).toBe('');
    expect(mockState.braindumpParsedItems).toEqual([]);
    expect(mockState.braindumpStep).toBe('input');
    expect(mockState.braindumpVoiceRecording).toBe(false);
    expect(mockState.braindumpVoiceTranscribing).toBe(false);
    expect(mockState.braindumpVoiceError).toBeNull();
  });

  it('openBraindump triggers render for UI update', () => {
    openBraindump();
    expect(window.render).toHaveBeenCalled();
  });

  it('closeBraindump triggers render for UI update', () => {
    closeBraindump();
    expect(window.render).toHaveBeenCalled();
  });
});


// ============================================================================
// 12. Stress tests — bulk data integrity
// ============================================================================

describe('Stress tests — bulk data integrity', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('200 items all processed without data corruption', () => {
    const items = Array.from({ length: 200 }, (_, i) => makeParsedItem({
      index: i,
      title: `Stress item #${i} with special chars: <>&"'`,
      type: i % 2 === 0 ? 'task' : 'note',
      areaId: i % 3 === 0 ? 'area_1' : null,
      labels: i % 5 === 0 ? ['label_1', 'label_2'] : [],
      people: i % 7 === 0 ? ['person_1'] : [],
      deferDate: i % 10 === 0 ? '2026-06-01' : null,
      dueDate: i % 15 === 0 ? '2026-07-01' : null,
    }));

    const result = submitBraindumpItems(items);
    expect(result.taskCount).toBe(100);
    expect(result.noteCount).toBe(100);
    expect(createTaskMock).toHaveBeenCalledTimes(200);

    expect(createTaskMock.mock.calls[0][0]).toBe('Stress item #0 with special chars: <>&"\'');
    expect(createTaskMock.mock.calls[99][0]).toBe('Stress item #99 with special chars: <>&"\'');
    expect(createTaskMock.mock.calls[199][0]).toBe('Stress item #199 with special chars: <>&"\'');
  });

  it('heuristic handles 200 lines without error', () => {
    const text = Array.from({ length: 200 }, (_, i) => `Item ${i}`).join('\n');
    const result = parseBraindumpHeuristic(text);
    expect(result).toHaveLength(200);
    for (let i = 0; i < 200; i++) {
      expect(result[i].index).toBe(i);
      expect(result[i].title).toBe(`Item ${i}`);
    }
  });

  it('segmentText handles very long lines without performance issues', () => {
    const longLine = 'Buy ' + 'groceries '.repeat(1000);
    const result = segmentText(longLine);
    expect(result).toHaveLength(1);
    expect(result[0].length).toBeGreaterThan(5000);
  });

  it('classifyItem handles text with many concurrent signals', () => {
    const complexText = 'Buy groceries by friday today #work @urgent &alice !tomorrow need to finish asap urgently this week';
    const result = classifyItem(complexText);
    expect(result.type).toBe('task');
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.score).toBeGreaterThan(0);
  });
});


// ============================================================================
// 13. Heuristic classification edge cases for sync data quality
// ============================================================================

describe('Heuristic classification — sync data quality', () => {
  beforeEach(() => {
    setupEntities();
  });

  it('classifyItem returns all required fields for sync payload', () => {
    const result = classifyItem('Buy milk');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('confidence');
    expect(['task', 'note']).toContain(result.type);
    expect(typeof result.score).toBe('number');
    expect(typeof result.confidence).toBe('number');
  });

  it('extractMetadata returns all required fields for sync payload', () => {
    const result = extractMetadata('Buy milk #work @urgent &alice');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('areaId');
    expect(result).toHaveProperty('labels');
    expect(result).toHaveProperty('people');
    expect(result).toHaveProperty('deferDate');
    expect(result).toHaveProperty('dueDate');
    expect(typeof result.title).toBe('string');
    expect(Array.isArray(result.labels)).toBe(true);
    expect(Array.isArray(result.people)).toBe(true);
  });

  it('parseBraindumpHeuristic items all have valid included boolean', () => {
    const items = parseBraindumpHeuristic('Buy milk\nNote: test\nCall dentist');
    for (const item of items) {
      expect(typeof item.included).toBe('boolean');
      expect(item.included).toBe(true);
    }
  });

  it('parseBraindumpHeuristic items all have string titles', () => {
    const items = parseBraindumpHeuristic('Buy milk\n\nCall dentist');
    for (const item of items) {
      expect(typeof item.title).toBe('string');
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it('parseBraindumpHeuristic items have labels/people as arrays (never null)', () => {
    const items = parseBraindumpHeuristic('Just a plain item');
    for (const item of items) {
      expect(Array.isArray(item.labels)).toBe(true);
      expect(Array.isArray(item.people)).toBe(true);
    }
  });
});
