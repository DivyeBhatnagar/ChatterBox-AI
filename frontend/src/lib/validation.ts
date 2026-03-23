export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string {
  if (!email.trim()) {
    return 'Email is required'
  }
  if (!emailRegex.test(email.trim())) {
    return 'Enter a valid email address'
  }
  return ''
}

export function validatePassword(password: string): string {
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include an uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include a lowercase letter'
  }
  if (!/\d/.test(password)) {
    return 'Password must include a number'
  }
  return ''
}

export function passwordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score += 25
  if (/[A-Z]/.test(password)) score += 25
  if (/[a-z]/.test(password)) score += 20
  if (/\d/.test(password)) score += 20
  if (/[^A-Za-z0-9]/.test(password)) score += 10
  return Math.min(score, 100)
}
