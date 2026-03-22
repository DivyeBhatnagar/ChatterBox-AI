import type { User } from 'firebase/auth'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  isEmailVerified: boolean
  signInWithEmail: (email: string, password: string, rememberMe: boolean) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  sendReset: (email: string) => Promise<void>
  resendVerification: () => Promise<void>
  refreshUser: () => Promise<void>
}
