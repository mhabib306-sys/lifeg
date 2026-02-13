// ============================================================================
// MOBILE UI MODULE
// ============================================================================
// Mobile drawer, bottom navigation, and navigation helper functions.
// Handles mobile sidebar overlay toggle, bottom nav bar rendering,
// and category/label/perspective/person navigation with filter state management.

import { state } from '../state.js';
import { saveViewState } from '../data/storage.js';
import { THINGS3_ICONS, getActiveIcons } from '../constants.js';

let drawerPreviouslyFocused = null;
let drawerKeydownHandlerBound = false;

function getDrawerFocusableElements() {
  const drawer = document.querySelector('#mobile-sidebar-overlay .mobile-sidebar-drawer');
  if (!drawer) return [];
  return Array.from(drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

function handleDrawerKeydown(e) {
  if (!state.mobileDrawerOpen) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeMobileDrawer();
    return;
  }
  if (e.key !== 'Tab') return;

  const focusable = getDrawerFocusableElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

// ---------------------------------------------------------------------------
// Mobile Drawer
// ---------------------------------------------------------------------------

// Swipe-to-close gesture state
let _swipeTouchStartX = 0;
let _swipeTouchCurrentX = 0;
let _swipeDragging = false;

function _handleSwipeStart(e) {
  const x = e.touches[0].clientX;
  // Skip if touch starts in OS gesture zones (iOS back gesture, Android edge)
  if (x < 20 || x > window.innerWidth - 20) {
    _swipeDragging = false;
    return;
  }
  _swipeTouchStartX = x;
  _swipeTouchCurrentX = _swipeTouchStartX;
  _swipeDragging = true;
}

function _handleSwipeMove(e) {
  if (!_swipeDragging) return;
  _swipeTouchCurrentX = e.touches[0].clientX;
  const delta = _swipeTouchCurrentX - _swipeTouchStartX;
  if (delta < 0) {
    const drawer = document.querySelector('.mobile-sidebar-drawer');
    if (drawer) {
      drawer.style.transform = `translate3d(${delta}px, 0, 0)`;
      drawer.style.transition = 'none';
    }
  }
}

function _handleSwipeEnd() {
  if (!_swipeDragging) return;
  _swipeDragging = false;
  const delta = _swipeTouchCurrentX - _swipeTouchStartX;
  const drawer = document.querySelector('.mobile-sidebar-drawer');
  if (drawer) {
    drawer.style.transition = '';
    drawer.style.transform = '';
  }
  if (delta < -60) {
    closeMobileDrawer();
  }
}

function attachDrawerSwipe() {
  const overlay = document.getElementById('mobile-sidebar-overlay');
  if (!overlay) return;
  overlay.addEventListener('touchstart', _handleSwipeStart, { passive: true });
  overlay.addEventListener('touchmove', _handleSwipeMove, { passive: true });
  overlay.addEventListener('touchend', _handleSwipeEnd, { passive: true });
}

function detachDrawerSwipe() {
  const overlay = document.getElementById('mobile-sidebar-overlay');
  if (!overlay) return;
  overlay.removeEventListener('touchstart', _handleSwipeStart);
  overlay.removeEventListener('touchmove', _handleSwipeMove);
  overlay.removeEventListener('touchend', _handleSwipeEnd);
}

/**
 * Open the mobile sidebar drawer.
 * Sets mobileDrawerOpen = true, prevents body scroll, and toggles the overlay.
 */
export function openMobileDrawer() {
  drawerPreviouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  state.mobileDrawerOpen = true;
  document.body.style.overflow = 'hidden';
  document.body.classList.add('drawer-open');
  document.body.classList.add('body-modal-open');
  renderMobileDrawer();
  if (!drawerKeydownHandlerBound) {
    document.addEventListener('keydown', handleDrawerKeydown);
    drawerKeydownHandlerBound = true;
  }
  setTimeout(() => {
    const closeBtn = document.getElementById('mobile-drawer-close');
    if (closeBtn) closeBtn.focus();
  }, 20);
  // Attach swipe-to-close gesture
  attachDrawerSwipe();
}

/**
 * Close the mobile sidebar drawer.
 * Sets mobileDrawerOpen = false, restores body scroll, and toggles the overlay.
 */
export function closeMobileDrawer() {
  detachDrawerSwipe();
  state.mobileDrawerOpen = false;
  document.body.style.overflow = '';
  document.body.classList.remove('drawer-open');
  if (!state.showTaskModal && !state.showPerspectiveModal && !state.showAreaModal && !state.showLabelModal && !state.showPersonModal && !state.showCategoryModal && !state.showBraindump && !state.calendarEventModalOpen) {
    document.body.classList.remove('body-modal-open');
  }
  if (drawerKeydownHandlerBound) {
    document.removeEventListener('keydown', handleDrawerKeydown);
    drawerKeydownHandlerBound = false;
  }
  renderMobileDrawer();
  if (drawerPreviouslyFocused && typeof drawerPreviouslyFocused.focus === 'function') {
    drawerPreviouslyFocused.focus();
  }
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
          ${getActiveIcons().home}
          <span class="mobile-nav-label">Home</span>
        </button>
        <button onclick="switchTab('tasks')" class="mobile-nav-item ${state.activeTab === 'tasks' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'tasks'}" aria-label="Workspace">
          ${getActiveIcons().workspace}
          <span class="mobile-nav-label">Workspace</span>
        </button>
        <button onclick="switchTab('life')" class="mobile-nav-item ${state.activeTab === 'life' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'life'}" aria-label="Life Score">
          ${getActiveIcons().lifeScore}
          <span class="mobile-nav-label">Life</span>
        </button>
        <button onclick="switchTab('calendar')" class="mobile-nav-item ${state.activeTab === 'calendar' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'calendar'}" aria-label="Calendar">
          ${getActiveIcons().calendar}
          <span class="mobile-nav-label">Calendar</span>
        </button>
        <button onclick="switchTab('settings')" class="mobile-nav-item ${state.activeTab === 'settings' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'settings'}" aria-label="Settings">
          ${getActiveIcons().settings}
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
export function showAreaTasks(categoryId) {
  state.reviewMode = false;
  state.activeFilterType = 'area';
  state.activeAreaFilter = categoryId;
  state.activeLabelFilter = null;
  state.activePersonFilter = null;
  state.collapsedSidebarAreas.delete(categoryId);
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
  state.reviewMode = false;
  state.activeFilterType = 'label';
  state.activeLabelFilter = labelId;
  state.activeAreaFilter = null;
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
  state.reviewMode = false;
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
  state.activeAreaFilter = null;
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
  state.reviewMode = false;
  state.activeFilterType = 'person';
  state.activePersonFilter = personId;
  state.activePerspective = null;
  state.activeAreaFilter = null;
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
 * Switch to category (sub-area) view.
 * Clears other filters, closes mobile drawer, switches to tasks tab if needed,
 * saves view state, re-renders, and scrolls to content.
 * @param {string} categoryId - The category/sub-area ID to filter by
 */
export function showCategoryTasks(categoryId) {
  state.reviewMode = false;
  state.activeFilterType = 'subcategory';
  state.activeCategoryFilter = categoryId;
  state.activePerspective = null;
  state.activeAreaFilter = null;
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
 * Navigate to the All Tags overview page.
 */
export function showAllLabelsPage() {
  state.reviewMode = false;
  state.activeFilterType = 'all-labels';
  state.activeLabelFilter = null;
  state.activeAreaFilter = null;
  state.activePersonFilter = null;
  state.activePerspective = null;
  closeMobileDrawer();
  if (state.activeTab !== 'tasks') {
    state.activeTab = 'tasks';
  }
  saveViewState();
  window.render();
  scrollToContent();
}

/**
 * Navigate to the All People overview page.
 */
export function showAllPeoplePage() {
  state.reviewMode = false;
  state.activeFilterType = 'all-people';
  state.activePersonFilter = null;
  state.activeAreaFilter = null;
  state.activeLabelFilter = null;
  state.activePerspective = null;
  closeMobileDrawer();
  if (state.activeTab !== 'tasks') {
    state.activeTab = 'tasks';
  }
  saveViewState();
  window.render();
  scrollToContent();
}

/**
 * Toggle collapse/expand of an area's categories in the sidebar.
 * @param {string} areaId - The area ID to toggle
 */
export function toggleSidebarAreaCollapse(areaId) {
  if (state.collapsedSidebarAreas.has(areaId)) {
    state.collapsedSidebarAreas.delete(areaId);
  } else {
    state.collapsedSidebarAreas.add(areaId);
  }
  window.render();
}

/**
 * Toggle full desktop workspace sidebar visibility.
 * This does not affect mobile drawer behavior.
 */
export function toggleWorkspaceSidebar() {
  state.workspaceSidebarCollapsed = !state.workspaceSidebarCollapsed;
  window.render();
}

/**
 * Auto-scroll to content on mobile after navigation.
 * Only triggers on touch devices or viewports <= 768px.
 * Scrolls to .main-content or <main>, or falls back to top of page.
 */
// ============================================================================
// Bottom Nav Auto-Hide on Scroll
// ============================================================================

let _lastScrollY = 0;
let _scrollHideAttached = false;

export function initBottomNavScrollHide() {
  if (_scrollHideAttached || window.innerWidth > 768) return;
  _scrollHideAttached = true;
  _lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) return;

    const currentY = window.scrollY;
    const delta = currentY - _lastScrollY;

    if (delta > 20 && currentY > 100) {
      nav.classList.add('nav-scroll-hidden');
    } else if (delta < -10 || currentY < 50) {
      nav.classList.remove('nav-scroll-hidden');
    }

    _lastScrollY = currentY;
  }, { passive: true });
}

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
