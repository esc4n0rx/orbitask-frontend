const TOKEN_KEY = 'orbitask_token'
const USER_KEY = 'orbitask_user'

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

export function setStoredUser(user: any): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

export function clearAuthData(): void {
  removeStoredToken()
  removeStoredUser()
}

export function isTokenValid(token: string): boolean {
  if (!token) return false
  
  try {
    // Verificação básica do formato JWT
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // Decodifica o payload para verificar expiração
    const payload = JSON.parse(atob(parts[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    return payload.exp ? payload.exp > currentTime : true
  } catch {
    return false
  }
}