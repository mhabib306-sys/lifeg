// ============================================================================
// CALENDAR FEATURE MODULE
// ============================================================================
// Calendar navigation, date selection, and date-based task queries
// for the OmniFocus Forecast-style calendar view.

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';

function shiftSelectedDate(days) {
  const base = new Date(state.calendarSelectedDate + 'T12:00:00');
  base.setDate(base.getDate() + days);
  const dateStr = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`;
  state.calendarSelectedDate = dateStr;
  state.calendarMonth = base.getMonth();
  state.calendarYear = base.getFullYear();
}

// ---- Navigation ----

export function calendarPrevMonth() {
  if (state.calendarViewMode === 'week') {
    shiftSelectedDate(-7);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  if (state.calendarViewMode === 'weekgrid') {
    shiftSelectedDate(-7);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  if (state.calendarViewMode === 'daygrid') {
    shiftSelectedDate(-1);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  if (state.calendarViewMode === '3days') {
    shiftSelectedDate(-3);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  state.calendarMonth--;
  if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
  if (window.isGCalConnected?.()) window.syncGCalNow?.();
  window.render();
}

export function calendarNextMonth() {
  if (state.calendarViewMode === 'week') {
    shiftSelectedDate(7);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  if (state.calendarViewMode === 'weekgrid') {
    shiftSelectedDate(7);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  if (state.calendarViewMode === 'daygrid') {
    shiftSelectedDate(1);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  if (state.calendarViewMode === '3days') {
    shiftSelectedDate(3);
    if (window.isGCalConnected?.()) window.syncGCalNow?.();
    window.render();
    return;
  }
  state.calendarMonth++;
  if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
  if (window.isGCalConnected?.()) window.syncGCalNow?.();
  window.render();
}

export function calendarGoToday() {
  const now = new Date();
  state.calendarMonth = now.getMonth();
  state.calendarYear = now.getFullYear();
  state.calendarSelectedDate = getLocalDateString();
  window.render();
}

export function setCalendarViewMode(mode) {
  if (!['month', 'week', '3days', 'daygrid', 'weekgrid'].includes(mode)) return;
  state.calendarViewMode = mode;
  if (window.isGCalConnected?.()) window.syncGCalNow?.();
  window.render();
}

// ---- Date Selection ----

export function calendarSelectDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
  state.calendarSelectedDate = dateStr;
  // Navigate to the month of the selected date (handles clicking outside days)
  const parts = dateStr.split('-');
  const selectedYear = parseInt(parts[0]);
  const selectedMonth = parseInt(parts[1]) - 1; // Convert to 0-based
  if (selectedYear !== state.calendarYear || selectedMonth !== state.calendarMonth) {
    state.calendarYear = selectedYear;
    state.calendarMonth = selectedMonth;
  }
  window.render();
}

// ---- Task Queries ----

export function getTasksForDate(dateStr) {
  return state.tasksData.filter(t => {
    if (t.completed || t.isNote) return false;
    return t.dueDate === dateStr || t.deferDate === dateStr;
  });
}
