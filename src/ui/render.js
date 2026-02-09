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

    // ---- Auth gate: loading spinner ----
    if (state.authLoading) {
      app.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
          <svg class="w-16 h-16 mb-6 animate-pulse" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#D97706"/></linearGradient></defs>
            <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#authGrad)"/>
            <path d="M50 25 C50 25 66 46 66 58 C66 67 58.8 74 50 74 C41.2 74 34 67 34 58 C34 46 50 25 50 25Z" fill="white"/>
          </svg>
          <p class="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>`;
      return;
    }

    // ---- Auth gate: login screen ----
    if (!state.currentUser) {
      app.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6">
          <svg class="w-20 h-20 mb-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#D97706"/></linearGradient></defs>
            <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#loginGrad)"/>
            <path d="M50 25 C50 25 66 46 66 58 C66 67 58.8 74 50 74 C41.2 74 34 67 34 58 C34 46 50 25 50 25Z" fill="white"/>
          </svg>
          <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-1">Homebase</h1>
          <p class="text-sm text-[var(--text-muted)] mb-8">Your life, all in one place</p>
          ${state.authError ? `<p class="text-sm text-red-500 mb-4">${state.authError}</p>` : ''}
          <button onclick="signInWithGoogle()"
            class="flex items-center gap-3 px-6 py-3 bg-white border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition text-sm font-medium text-[var(--text-primary)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <p class="text-xs text-[var(--text-muted)] mt-12">v${APP_VERSION}</p>
        </div>`;
      return;
    }

    // ---- Authenticated: render full app ----
    app.innerHTML = `
      <!-- Mobile Header - Things 3 style -->
      <header class="mobile-header-compact border-b border-[var(--border-light)] bg-[var(--bg-card)] sticky top-0 z-50" style="display: none;">
        <div class="w-10 flex items-center justify-start">
          ${state.activeTab === 'tasks' ? `
            <button onclick="openMobileDrawer()" class="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] active:bg-[var(--bg-secondary)] transition" aria-label="Open sidebar">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>
          ` : `
            <svg class="w-8 h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="mobileGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#D97706"/></linearGradient></defs>
              <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#mobileGrad)"/>
              <path d="M50 25 C50 25 66 46 66 58 C66 67 58.8 74 50 74 C41.2 74 34 67 34 58 C34 46 50 25 50 25Z" fill="white"/>
            </svg>
          `}
        </div>
        <div class="mobile-header-center">
          <h1 class="mobile-header-title text-[17px] font-bold text-[var(--text-primary)] truncate">${state.activeTab === 'home' ? 'Homebase' : state.activeTab === 'tasks' ? (function(){ const vi = getCurrentViewInfo(); return vi?.name || 'Tasks'; })() : state.activeTab === 'life' ? 'Life Score' : 'Settings'}</h1>
          <span class="mobile-version text-[10px] font-semibold text-[var(--text-muted)]">v${APP_VERSION}</span>
        </div>
        <div class="w-10 flex items-center justify-end">
          ${state.activeTab === 'tasks' ? `
            <button onclick="openNewTaskModal()" class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-sm active:opacity-80 transition" aria-label="New task">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
          ` : state.activeTab === 'settings' ? `
            <span class="w-8 h-8"></span>
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
                <path d="M50 25 C50 25 66 46 66 58 C66 67 58.8 74 50 74 C41.2 74 34 67 34 58 C34 46 50 25 50 25Z" fill="white"/>
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
