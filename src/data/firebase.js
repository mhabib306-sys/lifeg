// ============================================================================
// FIREBASE AUTH MODULE — Google Sign-In for Homebase
// ============================================================================
// Uses manual Google OAuth flow (direct navigation to Google, no Firebase
// auth handler) to work reliably in Tauri WKWebView where both popup and
// redirect flows fail due to ITP and isolated webview storage.

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { state } from '../state.js';
import { GCAL_ACCESS_TOKEN_KEY, GCAL_TOKEN_TIMESTAMP_KEY, GCAL_CONNECTED_KEY } from '../constants.js';

const GOOGLE_CLIENT_ID = '951877343924-01638ei3dfu0p2q7c8c8q3cdsv67mthh.apps.googleusercontent.com';
const DEFAULT_REDIRECT_URI = 'https://mhabib306-sys.github.io/lifeg/';
const GITHUB_PAGES_ORIGIN = 'https://mhabib306-sys.github.io';

// Firebase web app config (client-side — not secret)
const firebaseConfig = {
  apiKey: "AIzaSyD33w50neGgMOYgu3NbS8Dp6B4sfyEpJes",
  authDomain: "homebase-880f0.firebaseapp.com",
  projectId: "homebase-880f0",
  storageBucket: "homebase-880f0.firebasestorage.app",
  messagingSenderId: "951877343924",
  appId: "1:951877343924:web:8b2a96ac24f59a48a415e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let gisScriptLoadPromise = null;

function generateNonce() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

function getOAuthRedirectUri() {
  if (typeof window === 'undefined' || !window.location) return DEFAULT_REDIRECT_URI;
  try {
    const url = new URL(window.location.href);
    // Google OAuth requires exact string match. Keep GitHub Pages on one canonical URI.
    if (url.origin === GITHUB_PAGES_ORIGIN) return DEFAULT_REDIRECT_URI;
    // WebView/custom schemes are not valid Google OAuth redirect URIs.
    if (!/^https?:$/.test(url.protocol)) return DEFAULT_REDIRECT_URI;

    url.search = '';
    url.hash = '';

    // Normalize to avoid /path vs /path/ mismatch.
    if (!url.pathname.endsWith('/') && !url.pathname.split('/').pop()?.includes('.')) {
      url.pathname = `${url.pathname}/`;
    }
    return url.toString();
  } catch {
    return DEFAULT_REDIRECT_URI;
  }
}

export function signInWithGoogle() {
  const nonce = generateNonce();
  sessionStorage.setItem('oauth_nonce', nonce);
  const redirectUri = getOAuthRedirectUri();

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'id_token token',
    scope: 'openid email profile',
    nonce: nonce,
    include_granted_scopes: 'true',
    prompt: 'select_account'
  });

  // Navigate directly to Google — no Firebase auth handler middleman
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function signOutUser() {
  signOut(auth).catch(err => {
    console.error('Sign out failed:', err);
  });
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function signInWithGoogleCalendar(options = {}) {
  const { mode = 'interactive' } = options;
  // Prefer Google Identity Services token flow because it supports reliable
  // prompt-less refresh without cross-origin iframe hash parsing.
  const gisToken = await requestCalendarTokenWithGIS(mode);
  if (gisToken) {
    localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, gisToken);
    localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
    return gisToken;
  }

  if (mode === 'silent') return null;

  // Interactive fallback for environments where GIS token client is blocked.
  // Uses current URL as redirect URI to avoid /lifeg vs /lifeg/ mismatches.
  const nonce = generateNonce();
  const redirectUri = getOAuthRedirectUri();
  sessionStorage.setItem('oauth_nonce', nonce);
  sessionStorage.setItem('oauth_calendar', '1');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'id_token token',
    scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly',
    nonce: nonce,
    include_granted_scopes: 'true',
    prompt: 'consent'
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return null;
}

function loadGoogleIdentityServicesScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve(true);
  if (gisScriptLoadPromise) return gisScriptLoadPromise;

  gisScriptLoadPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-gis-client="1"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(!!window.google?.accounts?.oauth2), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.gisClient = '1';
    script.onload = () => resolve(!!window.google?.accounts?.oauth2);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return gisScriptLoadPromise;
}

async function requestCalendarTokenWithGIS(mode = 'interactive') {
  const gisReady = await loadGoogleIdentityServicesScript();
  if (!gisReady || !window.google?.accounts?.oauth2) return null;

  return new Promise((resolve) => {
    let settled = false;
    const finalize = (token = null) => {
      if (settled) return;
      settled = true;
      resolve(token);
    };

    // Some mismatch/popup failures never invoke callback; avoid hanging forever.
    // 60s allows enough time for multi-scope consent screens (Calendar + Contacts).
    const timeoutId = setTimeout(() => finalize(null), 60000);

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly',
        callback: (resp) => {
          clearTimeout(timeoutId);
          if (resp?.access_token) finalize(resp.access_token);
          else finalize(null);
        },
        error_callback: () => {
          clearTimeout(timeoutId);
          finalize(null);
        },
      });

      const request = mode === 'silent'
        ? {
            prompt: '',
            ...(auth.currentUser?.email ? { login_hint: auth.currentUser.email } : {}),
          }
        : {
            prompt: 'consent',
          };

      tokenClient.requestAccessToken(request);
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('GIS calendar token request failed:', err);
      finalize(null);
    }
  });
}

// Check URL hash for OAuth tokens on page load
function handleOAuthCallback() {
  const hash = window.location.hash;
  if (!hash || !hash.includes('id_token=')) return null;

  const params = new URLSearchParams(hash.substring(1));
  const idToken = params.get('id_token');
  const accessToken = params.get('access_token');

  // Clear the hash from the URL
  history.replaceState(null, '', window.location.pathname + window.location.search);

  if (!idToken) return null;

  // Check if this was a calendar auth request
  const wasCalendarAuth = sessionStorage.getItem('oauth_calendar') === '1';
  sessionStorage.removeItem('oauth_calendar');
  sessionStorage.removeItem('oauth_nonce');

  if (wasCalendarAuth && accessToken) {
    localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
    localStorage.setItem(GCAL_CONNECTED_KEY, 'true');
  }

  return { idToken, accessToken };
}

export function initAuth(onReady) {
  // Check for OAuth callback tokens in URL hash
  const oauthResult = handleOAuthCallback();

  if (oauthResult) {
    // We have tokens from Google — sign into Firebase
    const credential = GoogleAuthProvider.credential(oauthResult.idToken);
    signInWithCredential(auth, credential).catch(err => {
      console.error('Firebase credential sign-in failed:', err);
      state.authError = err.message;
      window.render();
    });
  }

  let firstCall = true;
  onAuthStateChanged(auth, (user) => {
    state.currentUser = user;
    state.authLoading = false;
    state.authError = null;
    if (firstCall) {
      firstCall = false;
      onReady(user);
    } else {
      window.render();
    }
  });
}
