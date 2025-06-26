"use client"

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { User, AuthState } from '@/types/auth'
import { 
  getStoredToken, 
  getStoredUser, 
  setStoredToken, 
  setStoredUser, 
  clearAuthData,
  isTokenValid 
} from '@/lib/auth'
import { getCurrentUser } from '@/lib/api/auth'

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_TOKEN'; payload: string }

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_TOKEN':
      return { ...state, token: action.payload }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken()
      const storedUser = getStoredUser()

      if (!storedToken || !isTokenValid(storedToken)) {
        clearAuthData()
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      if (storedUser) {
        dispatch({ 
          type: 'SET_USER', 
          payload: { user: storedUser, token: storedToken } 
        })
        
        // Verificar se o token ainda é válido no servidor
        try {
          const currentUser = await getCurrentUser(storedToken)
          dispatch({ 
            type: 'SET_USER', 
            payload: { user: currentUser, token: storedToken } 
          })
          setStoredUser(currentUser)
        } catch (error) {
          // Token inválido, limpar dados
          clearAuthData()
          dispatch({ type: 'CLEAR_USER' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  const login = (user: User, token: string) => {
    setStoredToken(token)
    setStoredUser(user)
    dispatch({ type: 'SET_USER', payload: { user, token } })
  }

  const logout = () => {
    clearAuthData()
    dispatch({ type: 'CLEAR_USER' })
  }

  const updateUser = (user: User) => {
    setStoredUser(user)
    dispatch({ type: 'SET_USER', payload: { user, token: state.token! } })
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}