// ============================================================================
// FIREBASE AUTH MODULE — Google Sign-In for Homebase
// ============================================================================
// Initializes Firebase, provides Google sign-in/sign-out, and manages
// auth state via onAuthStateChanged listener.

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { state } from '../state.js';
import { GCAL_ACCESS_TOKEN_KEY, GCAL_TOKEN_TIMESTAMP_KEY } from '../constants.js';

const isTauri = !!window.__TAURI_INTERNALS__;
const isSmallTouchDevice = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent || '');

function shouldUseRedirectAuth() {
  return isTauri || isIOS || isSmallTouchDevice;
}

function shouldUsePopupFirst() {
  // Desktop Tauri webviews can ignore redirect navigation in-place.
  // Prefer popup first, then fallback to redirect if needed.
  return isTauri;
}

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

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  state.authError = null;
  window.render();

  if (shouldUsePopupFirst()) {
    signInWithPopup(auth, provider).catch(err => {
      const code = err?.code || '';
      const popupBlocked = code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request';
      const unsupported = code === 'auth/operation-not-supported-in-this-environment';
      if (popupBlocked || unsupported) {
        signInWithRedirect(auth, provider).catch(redirectErr => {
          console.error('Google redirect sign-in failed:', redirectErr);
          state.authError = redirectErr.message;
          window.render();
        });
        return;
      }
      console.error('Google sign-in failed:', err);
      state.authError = err.message;
      window.render();
    });
    return;
  }

  if (shouldUseRedirectAuth()) {
    signInWithRedirect(auth, provider).catch(err => {
      console.error('Google sign-in failed:', err);
      state.authError = err.message;
      window.render();
    });
    return;
  }

  signInWithPopup(auth, provider).catch(err => {
    const code = err?.code || '';
    const popupBlocked = code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request';
    const unsupported = code === 'auth/operation-not-supported-in-this-environment';
    if (popupBlocked || unsupported) {
      signInWithRedirect(auth, provider).catch(redirectErr => {
        console.error('Google redirect sign-in failed:', redirectErr);
        state.authError = redirectErr.message;
        window.render();
      });
      return;
    }
    console.error('Google sign-in failed:', err);
    state.authError = err.message;
    window.render();
  });
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
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar');
  const customParams = { include_granted_scopes: 'true' };
  if (mode === 'silent') {
    customParams.prompt = 'none';
    if (auth.currentUser?.email) customParams.login_hint = auth.currentUser.email;
  } else {
    customParams.prompt = 'consent';
  }
  provider.setCustomParameters(customParams);
  try {
    if (shouldUsePopupFirst()) {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || result?._tokenResponse?.oauthAccessToken || null;
      if (accessToken) {
        localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
        return accessToken;
      }
      return null;
    }
    if (shouldUseRedirectAuth()) {
      await signInWithRedirect(auth, provider);
      // After redirect returns, getRedirectResult is handled in initAuth
      return null;
    }
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || result?._tokenResponse?.oauthAccessToken || null;
    if (accessToken) {
      localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
      return accessToken;
    }
    return null;
  } catch (err) {
    if (mode !== 'silent') {
      console.error('Google Calendar sign-in failed:', err);
    } else {
      console.warn('Silent Google Calendar refresh failed:', err?.code || err?.message || err);
    }
    return null;
  }
}

export function initAuth(onReady) {
  // Handle redirect result for both Tauri and mobile web fallback flows
  getRedirectResult(auth).then(result => {
    if (result) {
      // Extract GCal access token if calendar scope was requested
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || result?._tokenResponse?.oauthAccessToken || null;
      if (accessToken) {
        localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
      }
    }
  }).catch(err => {
    console.error('Redirect sign-in failed:', err);
    state.authError = err.message;
    window.render();
  });

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
