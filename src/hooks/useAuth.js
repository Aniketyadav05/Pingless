import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

function generateUsername(displayName) {
  const base = (displayName || 'user').toLowerCase().replace(/\s+/g, '');
  return base + Math.floor(Math.random() * 900 + 100);
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        let firestoreProfile = snap.exists() ? snap.data() : null;
        if (!snap.exists()) {
          const username = generateUsername(firebaseUser.displayName);
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            username,
            availability: 'available',
            today: [],
            thisWeek: [],
            shipped: [],
            blocked: [],
            role: '',
            company: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          const fresh = await getDoc(userRef);
          firestoreProfile = fresh.data();
        }
        setUser({ ...firebaseUser, ...firestoreProfile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return { user, loading, login, logout };
}
