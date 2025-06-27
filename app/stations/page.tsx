"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { CreateStationModal } from "@/components/modals/CreateStationModal"
import { Rocket, Users, Calendar, Plus, Settings, Star } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getStations } from "@/lib/api/stations"
import { Station } from "@/types/station"
import Link from "next/link"

export const dynamic = 'force-dynamic'

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30"
    case "admin":
      return "bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30"
    case "leader":
      return "bg-cosmic-cyan/20 text-cosmic-cyan border-cosmic-cyan/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

const getStationColor = (index: number) => {
  const colors = ["cosmic-blue", "cosmic-purple", "cosmic-cyan", "orange"]
  return colors[index % colors.length]
}

export default function StationsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [stations, setStations] = useState<Station[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()
  const { toast } = useToast()

  const fetchStations = async () => {
    if (!token) {
      setError("Token de autenticação não encontrado")
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      const response = await getStations(token)
      setStations(response.stations)
    } catch (error: any) {
      console.error('Erro ao buscar stations:', error)
      setError(error.message || "Erro ao carregar stations")
      
      toast({
        title: "Erro ao carregar stations",
        description: error.message || "Não foi possível carregar suas stations.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStations()
  }, [token])

  const handleStationCreated = () => {
    // Recarregar a lista de stations
    fetchStations()
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-space-900">
          <Sidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin" />
              <span>Carregando stations...</span>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
   <ProtectedRoute>
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Space Stations</h1>
              <p className="text-gray-400">
                {error ? "Erro ao carregar stations" : `Manage your mission control centers (${stations.length} stations)`}
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
              <Plus className="w-4 h-4 mr-2" />
              New Station
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={fetchStations} variant="outline" className="border-red-500/50 text-red-400">
                    Tentar Novamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station, index) => {
              const stationColor = getStationColor(index)
              return (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link href={`/stations/${station.id}`}>
                    <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 cursor-pointer group h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 bg-${stationColor}/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                          >
                            <Rocket className={`w-6 h-6 text-${stationColor}`} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getRoleBadgeColor(station.user_role || 'member')}>
                              {station.user_role || 'member'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // TODO: Implementar menu de configurações
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-white text-lg">{station.name}</CardTitle>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {station.description || "No description provided"}
                        </p>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Users className="w-4 h-4" />
                              <span>{station.member_count || 0} members</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Star className="w-4 h-4" />
                              <span>0 boards</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Created {new Date(station.created_at).toLocaleDateString()}</span>
                          </div>

                          {station.owner && (
                            <div className="text-xs text-gray-500">
                              Owner: {station.owner.full_name}
                            </div>
                          )}

                          <div className="pt-2 border-t border-space-600">
                            <Button
                              variant="ghost"
                              className="w-full text-cosmic-blue hover:text-cosmic-blue/80 hover:bg-cosmic-blue/10"
                            >
                              Enter Station
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}

            {/* Create New Station Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: stations.length * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className="bg-space-800/30 border-2 border-dashed border-space-600 hover:border-cosmic-blue/50 transition-colors cursor-pointer group h-full"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-cosmic-blue/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-cosmic-blue" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Create New Station</h3>
                  <p className="text-gray-400 text-sm">Start a new mission control center</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Empty State */}
          {!error && stations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-12 h-12 text-cosmic-blue" />
              </div>
              <h3 className="text-white text-xl font-medium mb-2">No stations yet</h3>
              <p className="text-gray-400 mb-6">Create your first station to start managing your space missions</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Station
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      <OrbitAIWidget />
      <CreateStationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onStationCreated={handleStationCreated}
      />
    </div>
    </ProtectedRoute>
  )
}