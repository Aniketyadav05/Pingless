import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyA06U3N3X8BrJ6AnoRiN1sloyNZJeovtiQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'onelink-4eaab.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'onelink-4eaab',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'onelink-4eaab.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '549919695179',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:549919695179:web:e7c3a6ebeed469010c48ce',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-1YS6PS764L',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
