// ============================================================================
// RENDER MODULE — Main render(), switchTab(), switchSubTab(), setToday()
// ============================================================================
// Orchestrates the full-DOM replacement render cycle. Routes to the active
// tab's renderer, draws the mobile header, desktop header, nav bars,
// footer, and bottom nav.

import { state } from '../state.js';
import { getLocalDateString, escapeHtml } from '../utils.js';
import { APP_VERSION, THINGS3_ICONS, BUILTIN_PERSPECTIVES, GITHUB_TOKEN_KEY } from '../constants.js';
import { saveViewState } from '../data/storage.js';
import { renderHomeTab } from './home.js';

// ---------------------------------------------------------------------------
// Tab renderers — these will be replaced with proper module imports as we
// continue modularising. For now we fall back to window.xxx globals.
// ---------------------------------------------------------------------------

function renderTrackingTab() {
  if (typeof window.renderTrackingTab === 'function') return window.renderTrackingTab();
  return '<div class="p-8 text-center text-[var(--text-muted)]">Loading tracking tab...</div>';
}

function renderBulkEntryTab() {
  if (typeof window.renderBulkEntryTab === 'function') return window.renderBulkEntryTab();
  return '<div class="p-8 text-center text-[var(--text-muted)]">Loading bulk entry tab...</div>';
}

function renderDashboardTab() {
  if (typeof window.renderDashboardTab === 'function') return window.renderDashboardTab();
  return '<div class="p-8 text-center text-[var(--text-muted)]">Loading dashboard tab...</div>';
}

function renderTasksTab() {
  if (typeof window.renderTasksTab === 'function') return window.renderTasksTab();
  return '<div class="p-8 text-center text-[var(--text-muted)]">Loading tasks tab...</div>';
}

function renderSettingsTab() {
  if (typeof window.renderSettingsTab === 'function') return window.renderSettingsTab();
  return '<div class="p-8 text-center text-[var(--text-muted)]">Loading settings tab...</div>';
}

function renderMobileDrawer() {
  if (typeof window.renderMobileDrawer === 'function') return window.renderMobileDrawer();
}

function renderTaskModalHtml() {
  if (typeof window.renderTaskModalHtml === 'function') return window.renderTaskModalHtml();
  return '';
}

function renderPerspectiveModalHtml() {
  if (typeof window.renderPerspectiveModalHtml === 'function') return window.renderPerspectiveModalHtml();
  return '';
}

function renderCategoryModalHtml() {
  if (typeof window.renderCategoryModalHtml === 'function') return window.renderCategoryModalHtml();
  return '';
}

function renderLabelModalHtml() {
  if (typeof window.renderLabelModalHtml === 'function') return window.renderLabelModalHtml();
  return '';
}

function renderPersonModalHtml() {
  if (typeof window.renderPersonModalHtml === 'function') return window.renderPersonModalHtml();
  return '';
}

function setupSidebarDragDrop() {
  if (typeof window.setupSidebarDragDrop === 'function') return window.setupSidebarDragDrop();
}

function initModalAutocomplete() {
  if (typeof window.initModalAutocomplete === 'function') return window.initModalAutocomplete();
}

function setupInlineAutocomplete(inputId) {
  if (typeof window.setupInlineAutocomplete === 'function') return window.setupInlineAutocomplete(inputId);
}

function getCurrentViewInfo() {
  if (typeof window.getCurrentViewInfo === 'function') return window.getCurrentViewInfo();
  return { name: 'Tasks' };
}

function scrollToContent() {
  if (typeof window.scrollToContent === 'function') return window.scrollToContent();
}

function getGithubToken() {
  return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
}

// ============================================================================
// render() — Main render function
// ============================================================================

/**
 * Full-DOM replacement render. Reads state.activeTab to decide which tab
 * renderer to call, then patches the #app element with the complete page
 * HTML including headers, nav, footer, and mobile bottom nav.
 */
export function render() {
  try {
    const app = document.getElementById('app');
    const dateDisplay = new Date(state.currentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    app.innerHTML = `
      <!-- Mobile Header - Things 3 style -->
      <header class="mobile-header-compact border-b border-[var(--border-light)] bg-[var(--bg-card)] sticky top-0 z-50" style="display: none;">
        <div class="w-10 flex items-center justify-start">
          ${state.activeTab === 'tasks' ? `
            <button onclick="openMobileDrawer()" class="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] active:bg-[var(--bg-secondary)] transition" aria-label="Open sidebar">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>
          ` : ''}
        </div>
        <div class="mobile-header-center">
          <h1 class="mobile-header-title text-[17px] font-bold text-[var(--text-primary)] truncate">${state.activeTab === 'home' ? 'Home' : state.activeTab === 'tasks' ? (function(){ const vi = getCurrentViewInfo(); return vi?.name || 'Tasks'; })() : state.activeTab === 'life' ? 'Life Score' : 'Settings'}</h1>
          <span class="mobile-version text-[10px] font-semibold text-[var(--text-muted)]">v${APP_VERSION}</span>
        </div>
        <div class="w-10 flex items-center justify-end">
          ${state.activeTab === 'tasks' ? `
            <button onclick="openNewTaskModal()" class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-sm active:opacity-80 transition" aria-label="New task">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
          ` : `
            <button onclick="setToday()" class="mobile-header-action text-[13px] font-semibold text-[var(--accent)] active:opacity-60">Today</button>
          `}
        </div>
      </header>

      <!-- Desktop Header - hidden on mobile -->
      <header class="border-b border-softborder desktop-header-content" style="background: var(--bg-primary);">
        <div class="max-w-6xl mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <svg class="w-12 h-12 app-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="homebaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F59E0B"/>
                    <stop offset="100%" stop-color="#D97706"/>
                  </linearGradient>
                </defs>
                <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#homebaseGrad)"/>
                <path d="M50 20 L78 42 V78 H22 V42 Z" fill="white" opacity="0.25"/>
                <path d="M50 32 C50 32 62 48 62 58 C62 65 56.5 70 50 70 C43.5 70 38 65 38 58 C38 48 50 32 50 32Z" fill="white"/>
                <path d="M50 45 C50 45 56 53 56 58 C56 62 53.3 64.5 50 64.5 C46.7 64.5 44 62 44 58 C44 53 50 45 50 45Z" fill="#F59E0B"/>
              </svg>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-2xl font-bold tracking-tight text-charcoal">Homebase</h1>
                  <span class="text-[11px] font-medium text-charcoal/40 bg-charcoal/5 px-1.5 py-0.5 rounded">v${APP_VERSION}</span>
                </div>
                <p class="text-sm text-charcoal/60 mt-0.5">Your life, all in one place <span class="text-coral">\u2022</span> habits, health, productivity</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-warmgray border border-softborder" title="Cloud sync status">
                <div id="sync-indicator" class="w-2 h-2 rounded-full ${getGithubToken() ? 'bg-green-500' : 'bg-charcoal/30'}"></div>
                <span class="text-xs text-charcoal/50">${getGithubToken() ? 'Synced' : 'Local'}</span>
              </div>
              <input type="date" id="dateInput" value="${state.currentDate}"
                onclick="this.showPicker()"
                class="px-3 py-2 rounded-lg text-sm border border-softborder bg-[var(--bg-input)] focus:border-coral focus:outline-none">
              <button onclick="setToday()" class="sb-btn px-4 py-2 rounded-lg text-sm font-medium">Today</button>
            </div>
          </div>
          <p class="text-charcoal/50 text-sm mt-2">${dateDisplay}</p>
        </div>
      </header>

      <!-- Main Navigation - Desktop only -->
      <nav class="desktop-nav border-b border-[var(--border-light)] bg-[var(--bg-card)]">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex gap-0">
            <button onclick="switchTab('home')" class="nav-tab py-3 px-5 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${state.activeTab === 'home' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-charcoal/50 hover:text-charcoal hover:bg-black/[0.04]'}">
              ${THINGS3_ICONS.home.replace('w-5 h-5', 'w-4 h-4')} Home
            </button>
            <button onclick="switchTab('tasks')" class="nav-tab py-3 px-5 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${state.activeTab === 'tasks' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-charcoal/50 hover:text-charcoal hover:bg-black/[0.04]'}">
              ${THINGS3_ICONS.workspace} Workspace
            </button>
            <button onclick="switchTab('life')" class="nav-tab py-3 px-5 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${state.activeTab === 'life' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-charcoal/50 hover:text-charcoal hover:bg-black/[0.04]'}">
              ${THINGS3_ICONS.lifeScore} Life Score
            </button>
            <button onclick="switchTab('settings')" class="nav-tab py-3 px-5 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${state.activeTab === 'settings' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-charcoal/50 hover:text-charcoal hover:bg-black/[0.04]'}">
              ${THINGS3_ICONS.settings} Settings
            </button>
          </div>
        </div>
      </nav>

      ${state.activeTab === 'life' ? `
      <!-- Sub Navigation for Life Score -->
      <div class="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-light)]">
        <div class="life-sub-nav max-w-6xl mx-auto px-6">
          <div class="flex gap-1 py-2">
            <button onclick="switchSubTab('daily')" class="px-4 py-1.5 text-sm rounded-lg transition ${state.activeSubTab === 'daily' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50'}">
              Daily Entry
            </button>
            <button onclick="switchSubTab('bulk')" class="px-4 py-1.5 text-sm rounded-lg transition ${state.activeSubTab === 'bulk' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50'}">
              Bulk Entry
            </button>
            <button onclick="switchSubTab('dashboard')" class="px-4 py-1.5 text-sm rounded-lg transition ${state.activeSubTab === 'dashboard' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50'}">
              Dashboard
            </button>
          </div>
        </div>
      </div>
      ` : ''}

      <main class="max-w-6xl mx-auto px-6 py-8">
        ${state.activeTab === 'home' ? renderHomeTab() :
          state.activeTab === 'life' ? (state.activeSubTab === 'daily' ? renderTrackingTab() : state.activeSubTab === 'bulk' ? renderBulkEntryTab() : renderDashboardTab()) :
          state.activeTab === 'tasks' ? renderTasksTab() :
          renderSettingsTab()}
      </main>

      <footer class="border-t border-softborder py-8 mt-12">
        <p class="text-center text-charcoal/40 text-sm">${getGithubToken() ? 'Data synced to GitHub' : 'Data saved locally'} <span class="text-coral">\u2022</span> Homebase</p>
      </footer>

      <!-- Mobile Bottom Navigation (all tabs) -->
      <nav class="mobile-bottom-nav" aria-label="Main navigation">
        <div class="mobile-bottom-nav-inner" role="tablist">
          <button onclick="switchTab('home')" class="mobile-nav-item ${state.activeTab === 'home' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'home'}">
            ${THINGS3_ICONS.home}
            <span class="mobile-nav-label">Home</span>
          </button>
          <button onclick="switchTab('tasks')" class="mobile-nav-item ${state.activeTab === 'tasks' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'tasks'}">
            ${THINGS3_ICONS.workspace}
            <span class="mobile-nav-label">Tasks</span>
          </button>
          <button onclick="switchTab('life')" class="mobile-nav-item ${state.activeTab === 'life' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'life'}">
            ${THINGS3_ICONS.lifeScore}
            <span class="mobile-nav-label">Life</span>
          </button>
          <button onclick="switchTab('settings')" class="mobile-nav-item ${state.activeTab === 'settings' ? 'active' : ''}" role="tab" aria-selected="${state.activeTab === 'settings'}">
            ${THINGS3_ICONS.settings}
            <span class="mobile-nav-label">Settings</span>
          </button>
        </div>
      </nav>

      ${renderTaskModalHtml()}
      ${renderPerspectiveModalHtml()}
      ${renderCategoryModalHtml()}
      ${renderLabelModalHtml()}
      ${renderPersonModalHtml()}
    `;

    // Setup date input handler (with cleanup to prevent memory leak)
    const dateInput = document.getElementById('dateInput');
    if (dateInput && !dateInput._hasChangeHandler) {
      dateInput._hasChangeHandler = true;
      dateInput.addEventListener('change', (e) => { state.currentDate = e.target.value; render(); });
    }

    // Setup sidebar drag and drop after DOM is updated
    if (state.activeTab === 'tasks') {
      setupSidebarDragDrop();
    }

    // Initialize autocomplete for task modal if it's open
    if (state.showTaskModal) {
      initModalAutocomplete();
    }

    // Initialize inline autocomplete for quick-add inputs
    setTimeout(() => {
      if (document.getElementById('quick-add-input')) {
        setupInlineAutocomplete('quick-add-input');
      }
      if (document.getElementById('home-quick-add-input')) {
        setupInlineAutocomplete('home-quick-add-input');
      }
    }, 60);
  } catch (err) {
    console.error('Render error:', err);
    document.getElementById('app').innerHTML = '<div style="padding:20px;color:red;font-family:monospace;">Render error: ' + escapeHtml(err.message) + '<br><br>Stack: ' + escapeHtml(err.stack || '') + '</div>';
  }
}

// ============================================================================
// switchTab — change active top-level tab
// ============================================================================

/**
 * Switch the active top-level tab, persist view state, and re-render
 * @param {string} tab - Tab id: 'home' | 'tasks' | 'life' | 'settings'
 */
export function switchTab(tab) {
  // Cleanup any open inline autocomplete popups
  document.querySelectorAll('.inline-autocomplete-popup').forEach(p => p.remove());
  if (state.mobileDrawerOpen) {
    state.mobileDrawerOpen = false;
    document.body.style.overflow = '';
    document.body.classList.remove('drawer-open');
  }
  state.activeTab = tab;
  saveViewState();
  render();
  scrollToContent();
}

// ============================================================================
// switchSubTab — change active Life Score sub-tab
// ============================================================================

/**
 * Switch the active sub-tab under Life Score, persist, and re-render
 * @param {string} subTab - Sub-tab id: 'daily' | 'bulk' | 'dashboard'
 */
export function switchSubTab(subTab) {
  state.activeSubTab = subTab;
  saveViewState();
  render();
}

// ============================================================================
// setToday — jump date picker to today
// ============================================================================

/**
 * Reset currentDate to today and re-render
 */
export function setToday() {
  state.currentDate = getLocalDateString();
  render();
}
