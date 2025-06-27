import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth'

const API_BASE_URL = 'https://orbitask-backend.onrender.com/api/auth'

class AuthApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message)
    this.name = 'AuthApiError'
  }
}

// Função helper para fazer requisições com retry
async function makeRequest(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit',
      })
      
      return response
    } catch (error) {
      console.warn(`Tentativa ${i + 1} falhou:`, error)
      
      if (i === retries - 1) {
        throw error
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  
  throw new Error('Número máximo de tentativas excedido')
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AuthApiError(response.status, data.error || 'LOGIN_ERROR', data.message || 'Erro ao fazer login')
    }

    return data
  } catch (error) {
    console.error('Erro no login:', error)
    
    if (error instanceof AuthApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado. Tente novamente.')
  }
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AuthApiError(response.status, data.error || 'REGISTER_ERROR', data.message || 'Erro ao criar conta')
    }

    return data
  } catch (error) {
    console.error('Erro no registro:', error)
    
    if (error instanceof AuthApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado. Tente novamente.')
  }
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AuthApiError(response.status, data.error || 'USER_ERROR', data.message || 'Erro ao buscar usuário')
    }

    return data.user
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    
    if (error instanceof AuthApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro ao buscar dados do usuário.')
    }
    
    throw new Error('Erro inesperado ao buscar usuário.')
  }
}