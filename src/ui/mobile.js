// ============================================================================
// MOBILE UI MODULE
// ============================================================================
// Mobile drawer, bottom navigation, and navigation helper functions.
// Handles mobile sidebar overlay toggle, bottom nav bar rendering,
// and category/label/perspective/person navigation with filter state management.

import { state } from '../state.js';
import { saveViewState } from '../data/storage.js';
import { THINGS3_ICONS } from '../constants.js';

// ---------------------------------------------------------------------------
// Mobile Drawer
// ---------------------------------------------------------------------------

/**
 * Open the mobile sidebar drawer.
 * Sets mobileDrawerOpen = true, prevents body scroll, and toggles the overlay.
 */
export function openMobileDrawer() {
  state.mobileDrawerOpen = true;
  document.body.style.overflow = 'hidden';
  document.body.classList.add('drawer-open');
  renderMobileDrawer();
}

/**
 * Close the mobile sidebar drawer.
 * Sets mobileDrawerOpen = false, restores body scroll, and toggles the overlay.
 */
export function closeMobileDrawer() {
  state.mobileDrawerOpen = false;
  document.body.style.overflow = '';
  document.body.classList.remove('drawer-open');
  renderMobileDrawer();
}

/**
 * Toggle the mobile sidebar overlay's visibility class.
 * Called after open/close to sync the DOM with state.mobileDrawerOpen.
 */
export function renderMobileDrawer() {
  const overlay = document.getElementById('mobile-sidebar-overlay');
  if (!overlay) return;
  if (state.mobileDrawerOpen) {
    overlay.classList.add('show');
  } else {
    overlay.classList.remove('show');
  }
}

// ---------------------------------------------------------------------------
// Bottom Navigation
// ---------------------------------------------------------------------------

/**
 * Render the mobile bottom navigation bar HTML.
 * Returns the fixed-bottom nav with Home, Tasks, Life, Settings tabs.
 * Uses state.activeTab to highlight the current tab.
 * @returns {string} HTML string for the bottom nav bar
 */
export function renderBottomNav() {
  return `
    <nav class="mobile-bottom-nav" aria-label="Main navigation">
      <div class="mobile-bottom-nav-inner" role="tablist">
        <button onclick="switchTab('home')" class="mobile-nav-item ${state.activeTab === 'home' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'home'}" aria-label="Home">
          ${THINGS3_ICONS.home}
          <span class="mobile-nav-label">Home</span>
        </button>
        <button onclick="switchTab('tasks')" class="mobile-nav-item ${state.activeTab === 'tasks' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'tasks'}" aria-label="Workspace">
          ${THINGS3_ICONS.workspace}
          <span class="mobile-nav-label">Tasks</span>
        </button>
        <button onclick="switchTab('life')" class="mobile-nav-item ${state.activeTab === 'life' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'life'}" aria-label="Life Score">
          ${THINGS3_ICONS.lifeScore}
          <span class="mobile-nav-label">Life</span>
        </button>
        <button onclick="switchTab('calendar')" class="mobile-nav-item ${state.activeTab === 'calendar' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'calendar'}" aria-label="Calendar">
          ${THINGS3_ICONS.calendar}
          <span class="mobile-nav-label">Calendar</span>
        </button>
        <button onclick="switchTab('settings')" class="mobile-nav-item ${state.activeTab === 'settings' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'settings'}" aria-label="Settings">
          ${THINGS3_ICONS.settings}
          <span class="mobile-nav-label">Settings</span>
        </button>
      </div>
    </nav>
  `;
}

// ---------------------------------------------------------------------------
// Navigation Functions
// ---------------------------------------------------------------------------

/**
 * Switch to category (area) view.
 * Clears other filters, closes mobile drawer, switches to tasks tab if needed,
 * saves view state, re-renders, and scrolls to content.
 * @param {string} categoryId - The category/area ID to filter by
 */
export function showCategoryTasks(categoryId) {
  state.activeFilterType = 'category';
  state.activeCategoryFilter = categoryId;
  state.activeLabelFilter = null;
  state.activePersonFilter = null;
  closeMobileDrawer();
  // Switch to tasks tab when navigating from Quick Stats or other widgets
  if (state.activeTab !== 'tasks') {
    state.activeTab = 'tasks';
  }
  saveViewState();
  window.render();
  scrollToContent();
}

/**
 * Switch to label (tag) view.
 * Clears other filters, closes mobile drawer, switches to tasks tab if needed,
 * saves view state, re-renders, and scrolls to content.
 * @param {string} labelId - The label/tag ID to filter by
 */
export function showLabelTasks(labelId) {
  state.activeFilterType = 'label';
  state.activeLabelFilter = labelId;
  state.activeCategoryFilter = null;
  state.activePersonFilter = null;
  closeMobileDrawer();
  // Switch to tasks tab when navigating from Quick Stats or other widgets
  if (state.activeTab !== 'tasks') {
    state.activeTab = 'tasks';
  }
  saveViewState();
  window.render();
  scrollToContent();
}

/**
 * Switch to perspective view (inbox, today, upcoming, calendar, anytime, someday, logbook, or custom).
 * Clears all entity filters, closes mobile drawer, switches to tasks tab if needed,
 * saves view state, re-renders, and scrolls to content.
 * @param {string} perspectiveId - The perspective ID to activate
 */
export function showPerspectiveTasks(perspectiveId) {
  if (perspectiveId === 'calendar') {
    closeMobileDrawer();
    state.activeTab = 'calendar';
    saveViewState();
    window.render();
    scrollToContent();
    return;
  }

  state.activeFilterType = 'perspective';
  state.activePerspective = perspectiveId;
  state.activeCategoryFilter = null;
  state.activeLabelFilter = null;
  state.activePersonFilter = null;
  closeMobileDrawer();
  // Switch to tasks tab when navigating from Quick Stats or other widgets
  if (state.activeTab !== 'tasks') {
    state.activeTab = 'tasks';
  }
  saveViewState();
  window.render();
  scrollToContent();
}

/**
 * Switch to person view.
 * Clears other filters and perspective, closes mobile drawer, switches to tasks tab if needed,
 * saves view state, re-renders, and scrolls to content.
 * @param {string} personId - The person ID to filter by
 */
export function showPersonTasks(personId) {
  state.activeFilterType = 'person';
  state.activePersonFilter = personId;
  state.activePerspective = null;
  state.activeCategoryFilter = null;
  state.activeLabelFilter = null;
  closeMobileDrawer();
  // Switch to tasks tab when navigating from Quick Stats or other widgets
  if (state.activeTab !== 'tasks') {
    state.activeTab = 'tasks';
  }
  saveViewState();
  window.render();
  scrollToContent();
}

/**
 * Auto-scroll to content on mobile after navigation.
 * Only triggers on touch devices or viewports <= 768px.
 * Scrolls to .main-content or <main>, or falls back to top of page.
 */
export function scrollToContent() {
  if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
    setTimeout(() => {
      const mainContent = document.querySelector('.main-content') || document.querySelector('main');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  }
}
