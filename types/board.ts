export interface BoardTemplate {
  id: string
  name: string
  description: string
}

export interface BoardList {
  id: string
  name: string
  position: number
  tasks?: BoardTask[]
}

export interface BoardTask {
  id: string
  title: string
  status: string
  priority: string
  assigned_user?: {
    id: string
    full_name: string
  }
}

export interface Board {
  id: string
  name: string
  description?: string
  station_id: string
  created_by?: string
  template_type?: string
  color?: string
  created_at: string
  updated_at?: string
  lists: BoardList[]
  created_by_user?: {
    id: string
    full_name: string
    email: string
  }
}

export interface CreateBoardData {
  name: string
  description?: string
  template?: string
  color?: string
}

export interface UpdateBoardData {
  name?: string
  description?: string
  color?: string
}

export interface BoardTemplatesResponse {
  message: string
  templates: BoardTemplate[]
}

export interface BoardResponse {
  message: string
  board: Board
}

export interface BoardsListResponse {
  message: string
  boards: Board[]
}

export interface BoardDetailResponse {
  board: Board
}

export interface BoardError {
  error: string
  message: string
}