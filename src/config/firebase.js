import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
);

let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.error('[Firebase Init Error]', err);
  }
}

/**
 * Trigger Google OAuth popup with Firebase
 */
export async function signInWithGooglePopup() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error(
      'Firebase is not configured yet. Please add your Firebase project keys (VITE_FIREBASE_API_KEY, etc.) to .env.'
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  return {
    idToken,
    email: result.user.email,
    name: result.user.displayName,
    photoUrl: result.user.photoURL,
    uid: result.user.uid
  };
}

export { auth, googleProvider };
