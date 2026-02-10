// ============================================================================
// FIREBASE AUTH MODULE — Google Sign-In for Homebase
// ============================================================================
// Uses manual Google OAuth flow (direct navigation to Google, no Firebase
// auth handler) to work reliably in Tauri WKWebView where both popup and
// redirect flows fail due to ITP and isolated webview storage.

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { state } from '../state.js';
import { GCAL_ACCESS_TOKEN_KEY, GCAL_TOKEN_TIMESTAMP_KEY } from '../constants.js';

const GOOGLE_CLIENT_ID = '951877343924-01638ei3dfu0p2q7c8c8q3cdsv67mthh.apps.googleusercontent.com';
const REDIRECT_URI = 'https://mhabib306-sys.github.io/lifeg/';

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

function generateNonce() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function signInWithGoogle() {
  const nonce = generateNonce();
  sessionStorage.setItem('oauth_nonce', nonce);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
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
  const nonce = generateNonce();
  sessionStorage.setItem('oauth_nonce', nonce);
  sessionStorage.setItem('oauth_calendar', '1');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'id_token token',
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
    nonce: nonce,
    include_granted_scopes: 'true',
    prompt: mode === 'silent' ? 'none' : 'consent'
  });

  if (mode === 'silent' && auth.currentUser?.email) {
    params.set('login_hint', auth.currentUser.email);
  }

  if (mode === 'silent') {
    // For silent refresh, try in a hidden iframe
    try {
      const accessToken = await silentTokenRefresh(params.toString());
      if (accessToken) {
        localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
        return accessToken;
      }
    } catch (e) {
      console.warn('Silent calendar refresh failed:', e);
    }
    return null;
  }

  // Interactive — navigate to Google
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return null;
}

function silentTokenRefresh(queryString) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    const timeout = setTimeout(() => {
      iframe.remove();
      reject(new Error('Silent refresh timed out'));
    }, 5000);

    iframe.src = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
    iframe.onload = () => {
      try {
        const hash = iframe.contentWindow.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        clearTimeout(timeout);
        iframe.remove();
        resolve(accessToken);
      } catch (e) {
        clearTimeout(timeout);
        iframe.remove();
        reject(e);
      }
    };
    document.body.appendChild(iframe);
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
