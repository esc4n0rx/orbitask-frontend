"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { InviteMemberModal } from "@/components/modals/InviteMemberModal"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Users, UserPlus, Search, MoreVertical, Mail, Calendar, Shield, Crown, Star, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getStations } from "@/lib/api/stations"
import { getStationMembers, updateMemberRole, removeStationMember } from "@/lib/api/station-members"
import { Station, StationMember } from "@/types/station"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = 'force-dynamic'

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return Crown
    case "admin":
      return Shield
    case "leader":
      return Star
    default:
      return User
  }
}

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

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStation, setSelectedStation] = useState("all")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  
  const [stations, setStations] = useState<Station[]>([])
  const [allMembers, setAllMembers] = useState<(StationMember & { stationName: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { token } = useAuth()
  const { toast } = useToast()

  const fetchData = async () => {
    if (!token) {
      setError("Token de autenticação não encontrado")
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      
      // Buscar stations do usuário
      const stationsResponse = await getStations(token)
      setStations(stationsResponse.stations)

      // Buscar membros de todas as stations
      const membersPromises = stationsResponse.stations.map(async (station) => {
        try {
          const membersResponse = await getStationMembers(station.id, token)
          return membersResponse.members.map(member => ({
            ...member,
            stationName: station.name
          }))
        } catch (error) {
          console.error(`Erro ao buscar membros da station ${station.name}:`, error)
          return []
        }
      })

      const membersArrays = await Promise.all(membersPromises)
      const allMembersFlat = membersArrays.flat()
      
      // Remover duplicatas baseado no user_id
      const uniqueMembers = allMembersFlat.reduce((acc, member) => {
        const existingMember = acc.find(m => m.user_id === member.user_id)
        if (!existingMember) {
          acc.push(member)
        } else {
          // Se já existe, manter o de role mais alta
          const roleHierarchy = { owner: 4, admin: 3, leader: 2, member: 1 }
          if ((roleHierarchy[member.role as keyof typeof roleHierarchy] || 0) > 
              (roleHierarchy[existingMember.role as keyof typeof roleHierarchy] || 0)) {
            const index = acc.findIndex(m => m.user_id === member.user_id)
            acc[index] = member
          }
        }
        return acc
      }, [] as typeof allMembersFlat)

      setAllMembers(uniqueMembers)
    } catch (error: any) {
      console.error('Erro ao buscar dados da equipe:', error)
      setError(error.message || "Erro ao carregar dados da equipe")
      
      toast({
        title: "Erro ao carregar equipe",
        description: error.message || "Não foi possível carregar os dados da equipe.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const handleMemberAdded = () => {
    // Recarregar dados após adicionar membro
    fetchData()
  }

  const handleUpdateRole = async (stationId: string, userId: string, newRole: "admin" | "leader" | "member") => {
    if (!token) return

    try {
      await updateMemberRole(stationId, userId, { role: newRole }, token)
      
      toast({
        title: "Role atualizado",
        description: `O role do membro foi atualizado para ${newRole}.`,
      })
      
      fetchData() // Recarregar dados
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar role",
        description: error.message || "Não foi possível atualizar o role do membro.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (stationId: string, userId: string, memberName: string) => {
    if (!token) return

    if (!confirm(`Tem certeza que deseja remover ${memberName} da equipe?`)) {
      return
    }

    try {
      await removeStationMember(stationId, userId, token)
      
      toast({
        title: "Membro removido",
        description: `${memberName} foi removido da equipe.`,
      })
      
      fetchData() // Recarregar dados
    } catch (error: any) {
      toast({
        title: "Erro ao remover membro",
        description: error.message || "Não foi possível remover o membro.",
        variant: "destructive",
      })
    }
  }

  const filteredMembers = allMembers.filter((member) => {
    const matchesSearch =
      member.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.stationName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || member.role === selectedRole
    const matchesStation = selectedStation === "all" || member.stationName === selectedStation
    return matchesSearch && matchesRole && matchesStation
  })

  const memberStats = {
    total: allMembers.length,
    online: Math.floor(allMembers.length * 0.6), // Mock data
    admins: allMembers.filter(m => m.role === 'admin').length,
    leaders: allMembers.filter(m => m.role === 'leader').length,
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-space-900">
          <Sidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin" />
              <span>Carregando equipe...</span>
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
              <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
              <p className="text-gray-400">
                {error ? "Erro ao carregar equipe" : `Manage your crew members and their permissions (${allMembers.length} members)`}
              </p>
            </div>
            <Button 
              onClick={() => setIsInviteModalOpen(true)} 
              className="bg-cosmic-blue hover:bg-cosmic-blue/80"
              disabled={stations.length === 0}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8">
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={fetchData} variant="outline" className="border-red-500/50 text-red-400">
                    Tentar Novamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Members</p>
                    <p className="text-2xl font-bold text-white">{memberStats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-cosmic-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Online Now</p>
                    <p className="text-2xl font-bold text-white">{memberStats.online}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Admins</p>
                    <p className="text-2xl font-bold text-white">{memberStats.admins}</p>
                  </div>
                  <Shield className="w-8 h-8 text-cosmic-purple" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Leaders</p>
                    <p className="text-2xl font-bold text-white">{memberStats.leaders}</p>
                  </div>
                  <Star className="w-8 h-8 text-cosmic-cyan" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-space-800 border-space-600 text-white placeholder:text-gray-400"
                />
              </div>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40 bg-space-800 border-space-600 text-white">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-space-700 border-space-600">
                  <SelectItem value="all" className="text-white">All Roles</SelectItem>
                  <SelectItem value="owner" className="text-white">Owner</SelectItem>
                  <SelectItem value="admin" className="text-white">Admin</SelectItem>
                  <SelectItem value="leader" className="text-white">Leader</SelectItem>
                  <SelectItem value="member" className="text-white">Member</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="w-48 bg-space-800 border-space-600 text-white">
                  <SelectValue placeholder="Filter by station" />
                </SelectTrigger>
                <SelectContent className="bg-space-700 border-space-600">
                  <SelectItem value="all" className="text-white">All Stations</SelectItem>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.name} className="text-white">
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => {
              const RoleIcon = getRoleIcon(member.role)
              return (
                <motion.div
                  key={`${member.station_id}-${member.user_id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={member.user.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple">
                                {member.user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-space-800" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{member.user.full_name}</h3>
                            <p className="text-gray-400 text-sm">{member.user.email}</p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-space-700 border-space-600">
                            <DropdownMenuItem className="text-white hover:bg-space-600">View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-space-600">Send Message</DropdownMenuItem>
                            {member.role !== 'owner' && (
                              <>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-space-600"
                                  onClick={() => handleUpdateRole(member.station_id, member.user_id, 'admin')}
                                >
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-space-600"
                                  onClick={() => handleUpdateRole(member.station_id, member.user_id, 'leader')}
                                >
                                  Make Leader
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-space-600"
                                  onClick={() => handleUpdateRole(member.station_id, member.user_id, 'member')}
                                >
                                  Make Member
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-400 hover:bg-red-500/10"
                                  onClick={() => handleRemoveMember(member.station_id, member.user_id, member.user.full_name)}
                                >
                                  Remove Member
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Role Badge */}
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge>
                          <span className="text-xs text-green-400 capitalize">online</span>
                        </div>

                        {/* Station */}
                        <div className="text-sm">
                          <p className="text-gray-400">Station</p>
                          <p className="text-white font-medium">{member.stationName}</p>
                        </div>

                        {/* Join Date */}
                        <div className="space-y-2 text-xs text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {new Date(member.joined_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3" />
                            <span>Active recently</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Empty State */}
          {!error && filteredMembers.length === 0 && allMembers.length > 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-cosmic-blue" />
              </div>
              <h3 className="text-white text-xl font-medium mb-2">No members found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => {
                setSearchTerm("")
                setSelectedRole("all")
                setSelectedStation("all")
              }} variant="outline" className="border-cosmic-blue text-cosmic-blue">
                Clear Filters
              </Button>
            </div>
          )}

          {/* No Stations State */}
          {!error && stations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-cosmic-blue" />
              </div>
              <h3 className="text-white text-xl font-medium mb-2">No stations found</h3>
              <p className="text-gray-400 mb-6">Create a station first to invite team members</p>
              <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                Create Station
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      <OrbitAIWidget />
      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        stationId={stations[0]?.id} // TODO: Permitir seleção de station
        onMemberAdded={handleMemberAdded}
      />
    </div>
  </ProtectedRoute>
  )
}