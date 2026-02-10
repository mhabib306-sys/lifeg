import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { getLocalDateString } from '../utils.js';
import { DELETED_ENTITY_TOMBSTONES_KEY } from '../constants.js';

function ensureEntityTombstones() {
  if (!state.deletedEntityTombstones || typeof state.deletedEntityTombstones !== 'object') {
    state.deletedEntityTombstones = {};
  }
  return state.deletedEntityTombstones;
}

function persistEntityTombstones() {
  localStorage.setItem(DELETED_ENTITY_TOMBSTONES_KEY, JSON.stringify(state.deletedEntityTombstones || {}));
}

function markEntityDeleted(type, id) {
  if (!id) return;
  const tombstones = ensureEntityTombstones();
  if (!tombstones[type] || typeof tombstones[type] !== 'object') tombstones[type] = {};
  tombstones[type][String(id)] = new Date().toISOString();
  persistEntityTombstones();
}

function clearEntityDeleted(type, id) {
  if (!id) return;
  const tombstones = ensureEntityTombstones();
  if (tombstones[type] && tombstones[type][String(id)] !== undefined) {
    delete tombstones[type][String(id)];
    persistEntityTombstones();
  }
}

// ============ CATEGORY CRUD ============

export function createCategory(name) {
  const colors = ['#4A90A4', '#6B8E5A', '#E5533D', '#C4943D', '#7C6B8E', '#6366F1', '#0EA5E9'];
  const nextColor = colors[state.taskCategories.length % colors.length];
  const category = {
    id: 'cat_' + Date.now(),
    name: name,
    color: nextColor,
    icon: '\uD83D\uDCC1'
  };
  clearEntityDeleted('taskCategories', category.id);
  state.taskCategories.push(category);
  saveTasksData();
  return category;
}

export function updateCategory(categoryId, updates) {
  const idx = state.taskCategories.findIndex(c => c.id === categoryId);
  if (idx !== -1) {
    state.taskCategories[idx] = { ...state.taskCategories[idx], ...updates };
    saveTasksData();
  }
}

export function deleteCategory(categoryId) {
  markEntityDeleted('taskCategories', categoryId);
  state.taskCategories = state.taskCategories.filter(c => c.id !== categoryId);
  // Remove category from tasks that use it
  state.tasksData.forEach(task => {
    if (task.categoryId === categoryId) task.categoryId = null;
  });
  saveTasksData();
}

export function getCategoryById(categoryId) {
  return state.taskCategories.find(c => c.id === categoryId);
}

// ============ LABEL CRUD ============

export function createLabel(name, color) {
  const label = {
    id: 'label_' + Date.now(),
    name: name,
    color: color || '#6B7280'
  };
  clearEntityDeleted('taskLabels', label.id);
  state.taskLabels.push(label);
  saveTasksData();
  return label;
}

export function updateLabel(labelId, updates) {
  const idx = state.taskLabels.findIndex(l => l.id === labelId);
  if (idx !== -1) {
    state.taskLabels[idx] = { ...state.taskLabels[idx], ...updates };
    saveTasksData();
  }
}

export function deleteLabel(labelId) {
  markEntityDeleted('taskLabels', labelId);
  state.taskLabels = state.taskLabels.filter(l => l.id !== labelId);
  // Remove label from tasks that use it
  state.tasksData.forEach(task => {
    if (task.labels) {
      task.labels = task.labels.filter(l => l !== labelId);
    }
  });
  saveTasksData();
}

export function getLabelById(labelId) {
  return state.taskLabels.find(l => l.id === labelId);
}

// ============ PEOPLE CRUD ============

export function createPerson(name, email = '') {
  const person = {
    id: 'person_' + Date.now(),
    name: name,
    email: String(email || '').trim()
  };
  clearEntityDeleted('taskPeople', person.id);
  state.taskPeople.push(person);
  saveTasksData();
  return person;
}

export function updatePerson(personId, updates) {
  const idx = state.taskPeople.findIndex(p => p.id === personId);
  if (idx !== -1) {
    state.taskPeople[idx] = { ...state.taskPeople[idx], ...updates };
    saveTasksData();
  }
}

export function deletePerson(personId) {
  markEntityDeleted('taskPeople', personId);
  state.taskPeople = state.taskPeople.filter(p => p.id !== personId);
  // Remove person from tasks that use it
  state.tasksData.forEach(task => {
    if (task.people) {
      task.people = task.people.filter(p => p !== personId);
    }
  });
  saveTasksData();
}

export function getPersonById(personId) {
  return state.taskPeople.find(p => p.id === personId);
}

// ============ PERSON FILTER ============

export function getTasksByPerson(personId) {
  const today = getLocalDateString();
  return state.tasksData.filter(task => {
    if (!task.people || !task.people.includes(personId)) return false;
    if (task.completed) return false;
    // Hide deferred tasks (deferDate in the future)
    if (task.deferDate && task.deferDate > today) return false;
    return true;
  });
}
