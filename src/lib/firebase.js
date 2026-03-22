import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyA06U3N3X8BrJ6AnoRiN1sloyNZJeovtiQ",
  authDomain: "onelink-4eaab.firebaseapp.com",
  projectId: "onelink-4eaab",
  storageBucket: "onelink-4eaab.firebasestorage.app",
  messagingSenderId: "549919695179",
  appId: "1:549919695179:web:e7c3a6ebeed469010c48ce",
  measurementId: "G-1YS6PS764L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()