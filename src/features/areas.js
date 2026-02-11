import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';
import { getLocalDateString } from '../utils.js';
import { DELETED_ENTITY_TOMBSTONES_KEY, CATEGORIES_KEY } from '../constants.js';

export function ensureEntityTombstones() {
  if (!state.deletedEntityTombstones || typeof state.deletedEntityTombstones !== 'object') {
    state.deletedEntityTombstones = {};
  }
  return state.deletedEntityTombstones;
}

export function persistEntityTombstones() {
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

// ============ AREA CRUD ============

export function createArea(name, emoji = '') {
  const colors = ['#4A90A4', '#6B8E5A', '#E5533D', '#C4943D', '#7C6B8E', '#6366F1', '#0EA5E9'];
  const nextColor = colors[state.taskAreas.length % colors.length];
  const area = {
    id: 'cat_' + Date.now(),
    name: name,
    color: nextColor,
    emoji: emoji || '',
    icon: '\uD83D\uDCC1'
  };
  clearEntityDeleted('taskCategories', area.id);
  state.taskAreas.push(area);
  saveTasksData();
  return area;
}

export function updateArea(areaId, updates) {
  const idx = state.taskAreas.findIndex(c => c.id === areaId);
  if (idx !== -1) {
    state.taskAreas[idx] = { ...state.taskAreas[idx], ...updates };
    saveTasksData();
  }
}

export function deleteArea(areaId) {
  markEntityDeleted('taskCategories', areaId);
  // Find sub-categories that belong to this area
  const orphanedCatIds = state.taskCategories
    .filter(c => c.areaId === areaId)
    .map(c => c.id);
  // Remove orphaned sub-categories
  state.taskCategories = state.taskCategories.filter(c => c.areaId !== areaId);
  state.taskAreas = state.taskAreas.filter(c => c.id !== areaId);
  // Remove area and orphaned categoryId from tasks
  state.tasksData.forEach(task => {
    if (task.areaId === areaId) task.areaId = null;
    if (orphanedCatIds.includes(task.categoryId)) task.categoryId = null;
  });
  saveTasksData();
}

export function getAreaById(areaId) {
  return state.taskAreas.find(c => c.id === areaId);
}

// ============ CATEGORY CRUD (sub-areas) ============

export function createCategory(name, areaId, emoji = '') {
  const area = getAreaById(areaId);
  const category = {
    id: 'subcat_' + Date.now(),
    name: name,
    areaId: areaId,
    color: area ? area.color : '#6366F1',
    emoji: emoji || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  clearEntityDeleted('categories', category.id);
  state.taskCategories.push(category);
  saveTasksData();
  return category;
}

export function updateCategory(categoryId, updates) {
  const idx = state.taskCategories.findIndex(c => c.id === categoryId);
  if (idx !== -1) {
    state.taskCategories[idx] = { ...state.taskCategories[idx], ...updates, updatedAt: new Date().toISOString() };
    saveTasksData();
  }
}

export function deleteCategory(categoryId) {
  markEntityDeleted('categories', categoryId);
  state.taskCategories = state.taskCategories.filter(c => c.id !== categoryId);
  // Clear categoryId from tasks that use it
  state.tasksData.forEach(task => {
    if (task.categoryId === categoryId) task.categoryId = null;
  });
  saveTasksData();
}

export function getCategoryById(categoryId) {
  return state.taskCategories.find(c => c.id === categoryId);
}

export function getCategoriesByArea(areaId) {
  return state.taskCategories.filter(c => c.areaId === areaId);
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

export function createPerson(name, email = '', jobTitle = '') {
  const person = {
    id: 'person_' + Date.now(),
    name: name,
    email: String(email || '').trim(),
    jobTitle: String(jobTitle || '').trim()
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
  return state.tasksData.filter(task => {
    if (!task.people || !task.people.includes(personId)) return false;
    if (task.completed) return false;
    return true;
  });
}
