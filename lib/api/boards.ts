import { 
  Board, 
  CreateBoardData, 
  UpdateBoardData,
  BoardResponse,
  BoardsListResponse,
  BoardDetailResponse,
  BoardError 
} from '@/types/board'

const API_BASE_URL = 'https://orbitask-backend.onrender.com/api'

class BoardApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message)
    this.name = 'BoardApiError'
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

export async function createBoard(stationId: string, data: CreateBoardData, token: string): Promise<BoardResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/stations/${stationId}/boards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new BoardApiError(response.status, result.error || 'CREATE_BOARD_ERROR', result.message || 'Erro ao criar board')
    }

    return result
  } catch (error) {
    console.error('Erro ao criar board:', error)
    
    if (error instanceof BoardApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao criar board.')
  }
}

export async function getBoardsByStation(stationId: string, token: string): Promise<BoardsListResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/stations/${stationId}/boards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new BoardApiError(response.status, result.error || 'GET_BOARDS_ERROR', result.message || 'Erro ao buscar boards')
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar boards:', error)
    
    if (error instanceof BoardApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao buscar boards.')
  }
}

export async function getBoardById(boardId: string, token: string): Promise<BoardDetailResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new BoardApiError(response.status, result.error || 'GET_BOARD_ERROR', result.message || 'Erro ao buscar board')
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar board:', error)
    
    if (error instanceof BoardApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao buscar board.')
  }
}

export async function updateBoard(boardId: string, data: UpdateBoardData, token: string): Promise<BoardResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new BoardApiError(response.status, result.error || 'UPDATE_BOARD_ERROR', result.message || 'Erro ao atualizar board')
    }

    return result
  } catch (error) {
    console.error('Erro ao atualizar board:', error)
    
    if (error instanceof BoardApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao atualizar board.')
  }
}

export async function deleteBoard(boardId: string, token: string): Promise<{ message: string }> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new BoardApiError(response.status, result.error || 'DELETE_BOARD_ERROR', result.message || 'Erro ao deletar board')
    }

    return result
  } catch (error) {
    console.error('Erro ao deletar board:', error)
    
    if (error instanceof BoardApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao deletar board.')
  }
}