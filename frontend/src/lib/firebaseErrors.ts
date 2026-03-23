export function mapFirebaseError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'Email already registered.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password is too weak.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    default:
      return 'Authentication failed. Please try again.'
  }
}
