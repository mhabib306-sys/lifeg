// ============================================================================
// FIREBASE AUTH MODULE — Google Sign-In for Homebase
// ============================================================================
// Initializes Firebase, provides Google sign-in/sign-out, and manages
// auth state via onAuthStateChanged listener.

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { state } from '../state.js';
import { GCAL_ACCESS_TOKEN_KEY, GCAL_TOKEN_TIMESTAMP_KEY } from '../constants.js';

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
  signInWithPopup(auth, provider).catch(err => {
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

export async function signInWithGoogleCalendar() {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar');
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      localStorage.setItem(GCAL_ACCESS_TOKEN_KEY, credential.accessToken);
      localStorage.setItem(GCAL_TOKEN_TIMESTAMP_KEY, String(Date.now()));
      return credential.accessToken;
    }
    return null;
  } catch (err) {
    console.error('Google Calendar sign-in failed:', err);
    return null;
  }
}

export function initAuth(onReady) {
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
