// ============================================================================
// CALENDAR FEATURE MODULE
// ============================================================================
// Calendar navigation, date selection, and date-based task queries
// for the OmniFocus Forecast-style calendar view.

import { state } from '../state.js';
import { getLocalDateString } from '../utils.js';

// ---- Navigation ----

export function calendarPrevMonth() {
  state.calendarMonth--;
  if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
  window.render();
}

export function calendarNextMonth() {
  state.calendarMonth++;
  if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
  window.render();
}

export function calendarGoToday() {
  const now = new Date();
  state.calendarMonth = now.getMonth();
  state.calendarYear = now.getFullYear();
  state.calendarSelectedDate = getLocalDateString();
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
