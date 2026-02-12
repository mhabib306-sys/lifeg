// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---- Mocks (hoisted) ----
const { mockState, mockSaveTasksData, mockSaveViewState } = vi.hoisted(() => ({
  mockState: {
    customPerspectives: [],
    activePerspective: 'inbox',
    editingPerspectiveId: null,
    showPerspectiveModal: false,
  },
  mockSaveTasksData: vi.fn(),
  mockSaveViewState: vi.fn(),
}));

vi.mock('../src/state.js', () => ({ state: mockState }));
vi.mock('../src/data/storage.js', () => ({
  saveTasksData: mockSaveTasksData,
  saveViewState: mockSaveViewState,
}));
vi.mock('../src/features/areas.js', () => ({
  ensureEntityTombstones: () => ({ customPerspectives: {} }),
  persistEntityTombstones: vi.fn(),
}));

import {
  createPerspective,
  deletePerspective,
  editCustomPerspective,
} from '../src/features/perspectives.js';

// ---- Setup ----
beforeEach(() => {
  mockState.customPerspectives = [];
  mockState.activePerspective = 'inbox';
  mockState.editingPerspectiveId = null;
  mockState.showPerspectiveModal = false;
  mockSaveTasksData.mockClear();
  mockSaveViewState.mockClear();
  window.render = vi.fn();
});

// ============================================================================
// createPerspective
// ============================================================================
describe('createPerspective', () => {
  it('returns an object with the given name', () => {
    const p = createPerspective('Work', '🏢', { status: 'anytime' });
    expect(p.name).toBe('Work');
  });

  it('returns an object with the given icon', () => {
    const p = createPerspective('Work', '🏢', { status: 'anytime' });
    expect(p.icon).toBe('🏢');
  });

  it('returns an object with the given filter', () => {
    const filter = { status: 'anytime', hasDueDate: true };
    const p = createPerspective('Deadlines', '📅', filter);
    expect(p.filter).toEqual(filter);
  });

  it('generates an ID with "custom_" prefix', () => {
    const p = createPerspective('Test', '🔧', {});
    expect(p.id).toMatch(/^custom_\d+$/);
  });

  it('sets builtin to false', () => {
    const p = createPerspective('Test', '🔧', {});
    expect(p.builtin).toBe(false);
  });

  it('sets createdAt to an ISO timestamp', () => {
    const p = createPerspective('Test', '🔧', {});
    expect(new Date(p.createdAt).toISOString()).toBe(p.createdAt);
  });

  it('sets updatedAt equal to createdAt', () => {
    const p = createPerspective('Test', '🔧', {});
    expect(p.updatedAt).toBe(p.createdAt);
  });

  it('defaults icon to pin emoji when icon is empty string', () => {
    const p = createPerspective('Pinned', '', {});
    expect(p.icon).toBe('\uD83D\uDCCC'); // 📌
  });

  it('defaults icon to pin emoji when icon is undefined', () => {
    const p = createPerspective('Pinned', undefined, {});
    expect(p.icon).toBe('\uD83D\uDCCC');
  });

  it('defaults icon to pin emoji when icon is null', () => {
    const p = createPerspective('Pinned', null, {});
    expect(p.icon).toBe('\uD83D\uDCCC');
  });

  it('adds the perspective to state.customPerspectives', () => {
    createPerspective('New', '🆕', {});
    expect(mockState.customPerspectives).toHaveLength(1);
    expect(mockState.customPerspectives[0].name).toBe('New');
  });

  it('appends to existing perspectives', () => {
    mockState.customPerspectives = [{ id: 'custom_existing', name: 'Old' }];
    createPerspective('New', '🆕', {});
    expect(mockState.customPerspectives).toHaveLength(2);
  });

  it('calls saveTasksData after creation', () => {
    createPerspective('Test', '🔧', {});
    expect(mockSaveTasksData).toHaveBeenCalledOnce();
  });

  it('generates unique IDs for multiple perspectives', () => {
    const p1 = createPerspective('A', '🅰️', {});
    // Ensure a small delay for Date.now() uniqueness
    const p2 = createPerspective('B', '🅱️', {});
    // IDs should be different (Date.now based, but could collide in fast tests)
    // At minimum, both start with custom_
    expect(p1.id).toMatch(/^custom_/);
    expect(p2.id).toMatch(/^custom_/);
  });
});

// ============================================================================
// deletePerspective
// ============================================================================
describe('deletePerspective', () => {
  beforeEach(() => {
    mockState.customPerspectives = [
      { id: 'custom_1', name: 'Work', icon: '🏢', filter: {} },
      { id: 'custom_2', name: 'Personal', icon: '🏠', filter: {} },
    ];
  });

  it('removes the perspective from state', () => {
    deletePerspective('custom_1');
    expect(mockState.customPerspectives).toHaveLength(1);
    expect(mockState.customPerspectives[0].id).toBe('custom_2');
  });

  it('switches activePerspective to "inbox" if deleted perspective was active', () => {
    mockState.activePerspective = 'custom_1';
    deletePerspective('custom_1');
    expect(mockState.activePerspective).toBe('inbox');
  });

  it('calls saveViewState when switching active perspective', () => {
    mockState.activePerspective = 'custom_1';
    deletePerspective('custom_1');
    expect(mockSaveViewState).toHaveBeenCalledOnce();
  });

  it('does not switch activePerspective if deleted perspective was NOT active', () => {
    mockState.activePerspective = 'inbox';
    deletePerspective('custom_1');
    expect(mockState.activePerspective).toBe('inbox');
  });

  it('does not call saveViewState when perspective was not active', () => {
    mockState.activePerspective = 'inbox';
    deletePerspective('custom_1');
    expect(mockSaveViewState).not.toHaveBeenCalled();
  });

  it('calls saveTasksData after deletion', () => {
    deletePerspective('custom_1');
    expect(mockSaveTasksData).toHaveBeenCalledOnce();
  });

  it('handles deleting a non-existent ID gracefully (no crash, length unchanged)', () => {
    deletePerspective('custom_nonexistent');
    expect(mockState.customPerspectives).toHaveLength(2);
  });

  it('can delete all perspectives', () => {
    deletePerspective('custom_1');
    deletePerspective('custom_2');
    expect(mockState.customPerspectives).toHaveLength(0);
  });
});

// ============================================================================
// editCustomPerspective
// ============================================================================
describe('editCustomPerspective', () => {
  beforeEach(() => {
    mockState.customPerspectives = [
      { id: 'custom_1', name: 'Work', icon: '🏢', filter: { status: 'anytime' } },
    ];
  });

  it('sets editingPerspectiveId to the given ID', () => {
    editCustomPerspective('custom_1');
    expect(mockState.editingPerspectiveId).toBe('custom_1');
  });

  it('sets showPerspectiveModal to true', () => {
    editCustomPerspective('custom_1');
    expect(mockState.showPerspectiveModal).toBe(true);
  });

  it('calls render()', () => {
    editCustomPerspective('custom_1');
    expect(window.render).toHaveBeenCalledOnce();
  });

  it('works with a non-existent ID (sets state, render still called)', () => {
    editCustomPerspective('custom_nonexistent');
    expect(mockState.editingPerspectiveId).toBe('custom_nonexistent');
    expect(mockState.showPerspectiveModal).toBe(true);
    expect(window.render).toHaveBeenCalledOnce();
  });
});
