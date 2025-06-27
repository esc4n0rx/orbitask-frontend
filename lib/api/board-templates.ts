import { BoardTemplatesResponse } from '@/types/board'

const API_BASE_URL = 'https://orbitask-backend.onrender.com/api'

class BoardTemplateApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message)
    this.name = 'BoardTemplateApiError'
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

export async function getBoardTemplates(): Promise<BoardTemplatesResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/board-templates`, {
      method: 'GET',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new BoardTemplateApiError(response.status, result.error || 'GET_TEMPLATES_ERROR', result.message || 'Erro ao buscar templates')
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar templates:', error)
    
    if (error instanceof BoardTemplateApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao buscar templates.')
  }
}