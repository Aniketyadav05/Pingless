// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create user profile in Firestore if it doesn't exist yet
        const userRef = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(userRef)
        if (!snap.exists()) {
          // Generate a default username from display name
          const rawName = firebaseUser.displayName || 'user'
          const username = rawName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 999)
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            username,
            availability: 'available',
            today: '',
            thisWeek: '',
            shipped: '',
            blocked: '',
            role: '',
            company: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
        setUser({ ...firebaseUser, ...(snap.exists() ? snap.data() : {}) })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  return { user, loading, login, logout }
}
