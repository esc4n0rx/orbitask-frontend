export interface Station {
  id: string
  name: string
  description: string
  owner_id: string
  created_at: string
  updated_at?: string
  member_count?: number
  user_role?: 'owner' | 'admin' | 'leader' | 'member'
  owner?: {
    full_name: string
    email: string
  }
}

export interface StationMember {
  id: string
  station_id: string
  user_id: string
  role: 'owner' | 'admin' | 'leader' | 'member'
  joined_at: string
  user: {
    id: string
    email: string
    full_name: string
    avatar_url?: string
  }
}

export interface CreateStationData {
  name: string
  description?: string
}

export interface UpdateStationData {
  name?: string
  description?: string
}

export interface AddMemberData {
  email: string
  role?: 'admin' | 'leader' | 'member'
}

export interface UpdateMemberRoleData {
  role: 'admin' | 'leader' | 'member'
}

export interface StationResponse {
  message: string
  station: Station
}

export interface StationsListResponse {
  message: string
  stations: Station[]
}

export interface StationDetailResponse {
  station: Station
}

export interface MemberResponse {
  message: string
  member: StationMember
}

export interface MembersListResponse {
  message: string
  members: StationMember[]
}

export interface StationError {
  error: string
  message: string
}