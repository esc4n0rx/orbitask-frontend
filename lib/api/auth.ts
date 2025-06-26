import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth'

const API_BASE_URL = 'https://olympic-kirstyn-esc4n0rx-c979677c.koyeb.app/api/auth'

class AuthApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message)
    this.name = 'AuthApiError'
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AuthApiError(response.status, data.error, data.message)
    }

    return data
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error
    }
    throw new Error('Erro de conexão. Tente novamente.')
  }
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AuthApiError(response.status, data.error, data.message)
    }

    return data
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error
    }
    throw new Error('Erro de conexão. Tente novamente.')
  }
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AuthApiError(response.status, data.error, data.message)
    }

    return data.user
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error
    }
    throw new Error('Erro ao buscar dados do usuário.')
  }
}