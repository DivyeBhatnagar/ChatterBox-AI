import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigError, googleProvider, isFirebaseConfigured } from '../firebase/config'
import type { AuthContextValue } from '../types/auth'

export const AuthContext = createContext<AuthContextValue | null>(null)

const upsertUserDoc = async (user: User, provider: 'google' | 'email') => {
  if (!db) {
    throw new Error(firebaseConfigError || 'Firestore is not configured.')
  }

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      lastLoginAt: serverTimestamp(),
      authProvider: provider,
      preferences: {
        theme: 'dark',
        language: 'en',
      },
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isEmailVerified: Boolean(user?.emailVerified),
      async signInWithEmail(email, password, rememberMe) {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
        const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
        await upsertUserDoc(credential.user, 'email')
      },
      async signUpWithEmail(email, password, displayName) {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        await setPersistence(auth, browserLocalPersistence)
        const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)

        if (displayName?.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() })
        }

        await sendEmailVerification(credential.user)
        await upsertUserDoc(credential.user, 'email')
      },
      async signInWithGoogle() {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        await setPersistence(auth, browserLocalPersistence)
        const credential = await signInWithPopup(auth, googleProvider)
        await upsertUserDoc(credential.user, 'google')
      },
      async signOutUser() {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        await signOut(auth)
      },
      async sendReset(email) {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        await sendPasswordResetEmail(auth, email.trim().toLowerCase())
      },
      async resendVerification() {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        if (auth.currentUser && !auth.currentUser.emailVerified) {
          await sendEmailVerification(auth.currentUser)
        }
      },
      async refreshUser() {
        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is not configured.')
        }
        if (auth.currentUser) {
          await auth.currentUser.reload()
          setUser(auth.currentUser)
        }
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
