import { 
  StationMember,
  AddMemberData,
  UpdateMemberRoleData,
  MemberResponse,
  MembersListResponse,
  StationError 
} from '@/types/station'

const API_BASE_URL = 'https://orbitask-backend.onrender.com/api/stations'

class StationMemberApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message)
    this.name = 'StationMemberApiError'
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

export async function addStationMember(stationId: string, data: AddMemberData, token: string): Promise<MemberResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationMemberApiError(response.status, result.error || 'ADD_MEMBER_ERROR', result.message || 'Erro ao adicionar membro')
    }

    return result
  } catch (error) {
    console.error('Erro ao adicionar membro:', error)
    
    if (error instanceof StationMemberApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao adicionar membro.')
  }
}

export async function getStationMembers(stationId: string, token: string): Promise<MembersListResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}/members`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationMemberApiError(response.status, result.error || 'GET_MEMBERS_ERROR', result.message || 'Erro ao buscar membros')
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar membros:', error)
    
    if (error instanceof StationMemberApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao buscar membros.')
  }
}

export async function updateMemberRole(stationId: string, userId: string, data: UpdateMemberRoleData, token: string): Promise<MemberResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}/members/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationMemberApiError(response.status, result.error || 'UPDATE_ROLE_ERROR', result.message || 'Erro ao atualizar role')
    }

    return result
  } catch (error) {
    console.error('Erro ao atualizar role:', error)
    
    if (error instanceof StationMemberApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao atualizar role.')
  }
}

export async function removeStationMember(stationId: string, userId: string, token: string): Promise<{ message: string }> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationMemberApiError(response.status, result.error || 'REMOVE_MEMBER_ERROR', result.message || 'Erro ao remover membro')
    }

    return result
  } catch (error) {
    console.error('Erro ao remover membro:', error)
    
    if (error instanceof StationMemberApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao remover membro.')
  }
}