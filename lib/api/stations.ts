import { 
  Station, 
  CreateStationData, 
  UpdateStationData,
  StationResponse,
  StationsListResponse,
  StationDetailResponse,
  StationError 
} from '@/types/station'

const API_BASE_URL = 'https://orbitask-backend.onrender.com/api/stations'

class StationApiError extends Error {
  constructor(public status: number, public error: string, message: string) {
    super(message)
    this.name = 'StationApiError'
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

export async function createStation(data: CreateStationData, token: string): Promise<StationResponse> {
  try {
    const response = await makeRequest(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationApiError(response.status, result.error || 'CREATE_STATION_ERROR', result.message || 'Erro ao criar station')
    }

    return result
  } catch (error) {
    console.error('Erro ao criar station:', error)
    
    if (error instanceof StationApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao criar station.')
  }
}

export async function getStations(token: string): Promise<StationsListResponse> {
  try {
    const response = await makeRequest(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationApiError(response.status, result.error || 'GET_STATIONS_ERROR', result.message || 'Erro ao buscar stations')
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar stations:', error)
    
    if (error instanceof StationApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao buscar stations.')
  }
}

export async function getStationById(stationId: string, token: string): Promise<StationDetailResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationApiError(response.status, result.error || 'GET_STATION_ERROR', result.message || 'Erro ao buscar station')
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar station:', error)
    
    if (error instanceof StationApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao buscar station.')
  }
}

export async function updateStation(stationId: string, data: UpdateStationData, token: string): Promise<StationResponse> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationApiError(response.status, result.error || 'UPDATE_STATION_ERROR', result.message || 'Erro ao atualizar station')
    }

    return result
  } catch (error) {
    console.error('Erro ao atualizar station:', error)
    
    if (error instanceof StationApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao atualizar station.')
  }
}

export async function completeStation(stationId: string, token: string): Promise<{ message: string }> {
  try {
    const response = await makeRequest(`${API_BASE_URL}/${stationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new StationApiError(response.status, result.error || 'COMPLETE_STATION_ERROR', result.message || 'Erro ao completar station')
    }

    return result
  } catch (error) {
    console.error('Erro ao completar station:', error)
    
    if (error instanceof StationApiError) {
      throw error
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
    
    throw new Error('Erro inesperado ao completar station.')
  }
}