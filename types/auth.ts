export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  updated_at?: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  full_name: string
}

export interface AuthError {
  error: string
  message: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}