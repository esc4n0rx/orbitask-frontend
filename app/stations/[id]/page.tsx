"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { CreateBoardModal } from "@/components/modals/CreateBoardModal"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import {
  Plus,
  Settings,
  Users,
  Calendar,
  Star,
  MoreVertical,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getStationById } from "@/lib/api/stations"
import { getStationMembers } from "@/lib/api/station-members"
import { getBoardsByStation } from "@/lib/api/boards"
import { Station, StationMember } from "@/types/station"
import { Board } from "@/types/board"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = 'force-dynamic'

const mockRecentActivity = [
  { user: "Neil Armstrong", action: "completed task", target: "Design Mars Rover", time: "2 hours ago" },
  { user: "Sally Ride", action: "commented on", target: "Launch Sequence Review", time: "4 hours ago" },
  { user: "Buzz Aldrin", action: "created board", target: "Mission Control Systems", time: "1 day ago" },
  { user: "Mae Jemison", action: "updated task", target: "Equipment Check", time: "2 days ago" },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

const getBoardColor = (color?: string, index?: number) => {
  if (color) {
    // Converter hex para classe CSS se possível
    const colorMap: { [key: string]: string } = {
      '#64b5f6': 'cosmic-blue',
      '#ba68c8': 'cosmic-purple',
      '#4dd0e1': 'cosmic-cyan',
      '#ff9800': 'orange',
      '#f48fb1': 'pink',
      '#81c784': 'green',
    }
    return colorMap[color] || 'cosmic-blue'
  }
  
  const colors = ["cosmic-blue", "cosmic-purple", "cosmic-cyan", "orange"]
  return colors[(index || 0) % colors.length]
}

export default function StationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stationId = params.id as string
  
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false)
  const [station, setStation] = useState<Station | null>(null)
  const [members, setMembers] = useState<StationMember[]>([])
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { token } = useAuth()
  const { toast } = useToast()

  const fetchStationData = async () => {
    if (!token || !stationId) {
      setError("Token de autenticação ou ID da station não encontrado")
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      
      // Buscar dados da station, membros e boards em paralelo
      const [stationResponse, membersResponse, boardsResponse] = await Promise.all([
        getStationById(stationId, token),
        getStationMembers(stationId, token).catch(err => {
          console.warn('Erro ao buscar membros:', err)
          return { members: [] }
        }),
        getBoardsByStation(stationId, token).catch(err => {
          console.warn('Erro ao buscar boards:', err)
          return { boards: [] }
        }),
      ])
      
      setStation(stationResponse.station)
      setMembers(membersResponse.members)
      setBoards(boardsResponse.boards)
    } catch (error: any) {
      console.error('Erro ao buscar dados da station:', error)
      setError(error.message || "Erro ao carregar dados da station")
      
      if (error.status === 404) {
        toast({
          title: "Station não encontrada",
          description: "A station solicitada não foi encontrada.",
          variant: "destructive",
        })
        router.push("/stations")
        return
      }
      
      if (error.status === 403) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta station.",
          variant: "destructive",
        })
        router.push("/stations")
        return
      }
      
      toast({
        title: "Erro ao carregar station",
        description: error.message || "Não foi possível carregar os dados da station.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStationData()
  }, [token, stationId])

  const handleBoardCreated = () => {
    // Recarregar dados após criar board
    fetchStationData()
  }

  const calculateBoardStats = () => {
    const totalTasks = boards.reduce((sum, board) => {
      return sum + (board.lists?.reduce((listSum, list) => {
        return listSum + (list.tasks?.length || 0)
      }, 0) || 0)
    }, 0)

    const completedTasks = boards.reduce((sum, board) => {
      return sum + (board.lists?.reduce((listSum, list) => {
        if (list.name.toLowerCase().includes('done') || list.name.toLowerCase().includes('completed')) {
         return listSum + (list.tasks?.length || 0)
       }
       return listSum
     }, 0) || 0)
   }, 0)

   return { totalTasks, completedTasks }
 }

 const { totalTasks, completedTasks } = calculateBoardStats()
 const avgProgress = boards.length > 0 ? Math.round((completedTasks / Math.max(totalTasks, 1)) * 100) : 0

 if (isLoading) {
   return (
     <ProtectedRoute>
       <div className="flex min-h-screen bg-space-900">
         <Sidebar />
         <main className="flex-1 p-6 flex items-center justify-center">
           <div className="flex items-center space-x-2 text-white">
             <div className="w-8 h-8 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin" />
             <span>Carregando station...</span>
           </div>
         </main>
       </div>
     </ProtectedRoute>
   )
 }

 if (error || !station) {
   return (
     <ProtectedRoute>
       <div className="flex min-h-screen bg-space-900">
         <Sidebar />
         <main className="flex-1 p-6">
           <div className="flex items-center mb-6">
             <Link href="/stations">
               <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Voltar para Stations
               </Button>
             </Link>
           </div>
           
           <Card className="bg-red-500/10 border-red-500/30">
             <CardContent className="p-6 text-center">
               <p className="text-red-400 mb-4">{error || "Station não encontrada"}</p>
               <div className="space-x-3">
                 <Button onClick={fetchStationData} variant="outline" className="border-red-500/50 text-red-400">
                   Tentar Novamente
                 </Button>
                 <Link href="/stations">
                   <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                     Voltar para Stations
                   </Button>
                 </Link>
               </div>
             </CardContent>
           </Card>
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
         {/* Navigation */}
         <div className="flex items-center mb-6">
           <Link href="/stations">
             <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
               <ArrowLeft className="w-4 h-4 mr-2" />
               Voltar para Stations
             </Button>
           </Link>
         </div>

         {/* Station Header */}
         <div className="flex items-center justify-between mb-8">
           <div className="flex items-center space-x-4">
             <div className="w-16 h-16 bg-cosmic-blue/20 rounded-xl flex items-center justify-center">
               <Star className="w-8 h-8 text-cosmic-blue" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-white mb-1">{station.name}</h1>
               <p className="text-gray-400">{station.description || "No description provided"}</p>
               <div className="flex items-center space-x-4 mt-2">
                 <div className="flex items-center space-x-2 text-sm text-gray-400">
                   <Users className="w-4 h-4" />
                   <span>{members.length} members</span>
                 </div>
                 <div className="flex items-center space-x-2 text-sm text-gray-400">
                   <Calendar className="w-4 h-4" />
                   <span>Created {new Date(station.created_at).toLocaleDateString()}</span>
                 </div>
                 <Badge className={`${station.user_role === 'owner' ? 'bg-cosmic-blue/20 text-cosmic-blue' : 'bg-gray-500/20 text-gray-400'}`}>
                   {station.user_role}
                 </Badge>
               </div>
             </div>
           </div>
           <div className="flex items-center space-x-3">
             <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
               <Users className="w-4 h-4 mr-2" />
               Members
             </Button>
             <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
               <Settings className="w-4 h-4" />
             </Button>
             <Button
               onClick={() => setIsCreateBoardModalOpen(true)}
               className="bg-cosmic-blue hover:bg-cosmic-blue/80"
               disabled={!station.user_role || !['owner', 'admin', 'leader'].includes(station.user_role)}
             >
               <Plus className="w-4 h-4 mr-2" />
               New Board
             </Button>
           </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <Card className="bg-space-800/50 border-space-600">
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Total Boards</p>
                   <p className="text-2xl font-bold text-white">{boards.length}</p>
                 </div>
                 <Star className="w-8 h-8 text-cosmic-blue" />
               </div>
             </CardContent>
           </Card>

           <Card className="bg-space-800/50 border-space-600">
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Total Tasks</p>
                   <p className="text-2xl font-bold text-white">{totalTasks}</p>
                 </div>
                 <CheckCircle className="w-8 h-8 text-cosmic-purple" />
               </div>
             </CardContent>
           </Card>

           <Card className="bg-space-800/50 border-space-600">
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Completed</p>
                   <p className="text-2xl font-bold text-white">{completedTasks}</p>
                 </div>
                 <TrendingUp className="w-8 h-8 text-cosmic-cyan" />
               </div>
             </CardContent>
           </Card>

           <Card className="bg-space-800/50 border-space-600">
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-400 text-sm">Team Members</p>
                   <p className="text-2xl font-bold text-white">{members.length}</p>
                 </div>
                 <Users className="w-8 h-8 text-orange-500" />
               </div>
             </CardContent>
           </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Boards Grid */}
           <div className="lg:col-span-2">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-white">Mission Boards</h2>
               <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
                 View All
               </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {boards.map((board, index) => {
                 const boardColor = getBoardColor(board.color, index)
                 const boardTotalTasks = board.lists?.reduce((sum, list) => sum + (list.tasks?.length || 0), 0) || 0
                 const boardCompletedTasks = board.lists?.reduce((sum, list) => {
                   if (list.name.toLowerCase().includes('done') || list.name.toLowerCase().includes('completed')) {
                     return sum + (list.tasks?.length || 0)
                   }
                   return sum
                 }, 0) || 0
                 const boardProgress = boardTotalTasks > 0 ? Math.round((boardCompletedTasks / boardTotalTasks) * 100) : 0

                 return (
                   <motion.div
                     key={board.id}
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.1 }}
                   >
                     <Link href={`/stations/${stationId}/boards/${board.id}`}>
                       <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 cursor-pointer group h-full">
                         <CardHeader className="pb-3">
                           <div className="flex items-start justify-between">
                             <div
                               className={`w-10 h-10 bg-${boardColor}/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                             >
                               <Star className={`w-5 h-5 text-${boardColor}`} />
                             </div>
                             <div className="flex items-center space-x-2">
                               <Badge className="bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30">
                                 {board.template_type || 'custom'}
                               </Badge>
                               <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                                     onClick={(e) => e.preventDefault()}
                                   >
                                     <MoreVertical className="w-4 h-4" />
                                   </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent className="bg-space-700 border-space-600">
                                   <DropdownMenuItem className="text-white hover:bg-space-600">
                                     Edit Board
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-white hover:bg-space-600">
                                     Duplicate
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-white hover:bg-space-600">Archive</DropdownMenuItem>
                                   <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                     Delete
                                   </DropdownMenuItem>
                                 </DropdownMenuContent>
                               </DropdownMenu>
                             </div>
                           </div>
                           <CardTitle className="text-white text-lg">{board.name}</CardTitle>
                           <p className="text-gray-400 text-sm line-clamp-2">{board.description || "No description"}</p>
                         </CardHeader>

                         <CardContent>
                           <div className="space-y-4">
                             {/* Progress */}
                             <div>
                               <div className="flex items-center justify-between text-sm mb-2">
                                 <span className="text-gray-400">Progress</span>
                                 <span className="text-white">{boardProgress}%</span>
                               </div>
                               <div className="w-full h-2 bg-space-600 rounded-full overflow-hidden">
                                 <div
                                   className={`h-full bg-${boardColor} transition-all duration-300`}
                                   style={{ width: `${boardProgress}%` }}
                                 />
                               </div>
                             </div>

                             {/* Tasks */}
                             <div className="flex items-center justify-between text-sm">
                               <div className="flex items-center space-x-2 text-gray-400">
                                 <CheckCircle className="w-4 h-4" />
                                 <span>{boardCompletedTasks}/{boardTotalTasks} tasks</span>
                               </div>
                               <div className="flex items-center space-x-2 text-gray-400">
                                 <Calendar className="w-4 h-4" />
                                 <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
                               </div>
                             </div>

                             {/* Creator */}
                             <div className="flex items-center justify-between">
                               <div className="flex items-center space-x-2">
                                 <Avatar className="w-6 h-6">
                                   <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                                     {board.created_by_user?.full_name
                                       ?.split(" ")
                                       .map((n) => n[0])
                                       .join("") || "U"}
                                   </AvatarFallback>
                                 </Avatar>
                                 <span className="text-xs text-gray-400">
                                   by {board.created_by_user?.full_name || "Unknown"}
                                 </span>
                               </div>
                               <div className="flex items-center space-x-1 text-xs text-gray-400">
                                 <Clock className="w-3 h-3" />
                                 <span>{board.lists?.length || 0} lists</span>
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     </Link>
                   </motion.div>
                 )
               })}

               {/* Create New Board Card */}
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3, delay: boards.length * 0.1 }}
               >
                 <Card
                   className="bg-space-800/30 border-2 border-dashed border-space-600 hover:border-cosmic-blue/50 transition-colors cursor-pointer group h-full"
                   onClick={() => setIsCreateBoardModalOpen(true)}
                 >
                   <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                     <div className="w-16 h-16 bg-cosmic-blue/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Plus className="w-8 h-8 text-cosmic-blue" />
                     </div>
                     <h3 className="text-white font-medium mb-2">Create New Board</h3>
                     <p className="text-gray-400 text-sm">Start a new mission board</p>
                   </CardContent>
                 </Card>
               </motion.div>
             </div>

             {/* Empty State for Boards */}
             {boards.length === 0 && (
               <div className="text-center py-12">
                 <div className="w-24 h-24 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Star className="w-12 h-12 text-cosmic-blue" />
                 </div>
                 <h3 className="text-white text-xl font-medium mb-2">No boards yet</h3>
                 <p className="text-gray-400 mb-6">Create your first board to start organizing tasks</p>
                 <Button 
                   onClick={() => setIsCreateBoardModalOpen(true)} 
                   className="bg-cosmic-blue hover:bg-cosmic-blue/80"
                   disabled={!station.user_role || !['owner', 'admin', 'leader'].includes(station.user_role)}
                 >
                   <Plus className="w-4 h-4 mr-2" />
                   Create Your First Board
                 </Button>
               </div>
             )}
           </div>

           {/* Recent Activity Sidebar */}
           <div className="space-y-6">
             {/* Team Members */}
             <Card className="bg-space-800/50 border-space-600">
               <CardHeader>
                 <CardTitle className="text-white flex items-center space-x-2">
                   <Users className="w-5 h-5 text-cosmic-purple" />
                   <span>Team Members ({members.length})</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   {members.slice(0, 5).map((member) => (
                     <div key={member.id} className="flex items-center space-x-3">
                       <Avatar className="w-8 h-8">
                         <AvatarImage src={member.user.avatar_url || "/placeholder.svg"} />
                         <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                           {member.user.full_name
                             .split(" ")
                             .map((n) => n[0])
                             .join("")}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white font-medium truncate">{member.user.full_name}</p>
                         <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                       </div>
                     </div>
                   ))}
                   
                   {members.length > 5 && (
                     <div className="text-center pt-2">
                       <Button variant="ghost" size="sm" className="text-cosmic-blue hover:text-cosmic-blue/80">
                         View All Members
                       </Button>
                     </div>
                   )}
                   
                   {members.length === 0 && (
                     <p className="text-gray-400 text-sm text-center py-4">No members found</p>
                   )}
                 </div>
               </CardContent>
             </Card>

             {/* Recent Activity */}
             <Card className="bg-space-800/50 border-space-600">
               <CardHeader>
                 <CardTitle className="text-white flex items-center space-x-2">
                   <Activity className="w-5 h-5 text-cosmic-blue" />
                   <span>Recent Activity</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {mockRecentActivity.map((activity, index) => (
                     <div key={index} className="flex items-start space-x-3">
                       <Avatar className="w-8 h-8">
                         <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                           {activity.user
                             .split(" ")
                             .map((n) => n[0])
                             .join("")}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm text-white">
                           <span className="font-medium">{activity.user}</span>{" "}
                           <span className="text-gray-400">{activity.action}</span>{" "}
                           <span className="text-cosmic-blue">{activity.target}</span>
                         </p>
                         <p className="text-xs text-gray-400">{activity.time}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

             {/* Quick Stats */}
             <Card className="bg-gradient-to-br from-cosmic-blue/20 to-cosmic-purple/20 border-cosmic-blue/30">
               <CardContent className="p-6">
                 <h3 className="text-white font-medium mb-4">Station Performance</h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-gray-300 text-sm">Active Boards</span>
                     <span className="text-white font-medium">{boards.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-300 text-sm">Completion Rate</span>
                     <span className="text-green-400 font-medium">{avgProgress}%</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-300 text-sm">Team Size</span>
                     <span className="text-cosmic-cyan font-medium">{members.length} members</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </motion.div>
     </main>

     <OrbitAIWidget />
     <CreateBoardModal
       isOpen={isCreateBoardModalOpen}
       onClose={() => setIsCreateBoardModalOpen(false)}
       stationId={stationId}
       onBoardCreated={handleBoardCreated}
     />
   </div>
   </ProtectedRoute>
 )
} 