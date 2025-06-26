"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <div className="w-8 h-8 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Redirecionando para login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}