"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { TaskCard } from "@/components/kanban/TaskCard"
import { CreateTaskModal } from "@/components/modals/CreateTaskModal"
import { Plus, Settings, Users, Filter, ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getBoardById } from "@/lib/api/boards"
import { Board } from "@/types/board"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = 'force-dynamic'

// Mock data for tasks (mantendo temporariamente até implementar tasks API)
const mockTasks = [
  {
    id: "1",
    title: "Design Mars Rover",
    description: "Create detailed blueprints for the new Mars exploration rover",
    priority: "high",
    assignee: { name: "Neil Armstrong", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2024-02-15",
    listId: "todo",
    tags: ["engineering", "design"],
  },
  {
    id: "2",
    title: "Test Communication Systems",
    description: "Verify all communication protocols work correctly",
    priority: "medium",
    assignee: { name: "Buzz Aldrin", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2024-02-20",
    listId: "progress",
    tags: ["testing", "communication"],
  },
]

export default function KanbanBoardPage() {
  const params = useParams()
  const router = useRouter()
  const stationId = params.id as string
  const boardId = params.boardId as string
  
  const [board, setBoard] = useState<Board | null>(null)
  const [tasks, setTasks] = useState(mockTasks)
  const [activeTask, setActiveTask] = useState<any>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { token } = useAuth()
  const { toast } = useToast()

  const fetchBoardData = async () => {
    if (!token || !boardId) {
      setError("Token de autenticação ou ID do board não encontrado")
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      const response = await getBoardById(boardId, token)
      setBoard(response.board)
      
      // TODO: Implementar busca de tasks quando a API estiver disponível
      // Por enquanto usar mock data mapeado para as listas do board
      if (response.board.lists && response.board.lists.length > 0) {
        // Mapear tasks existentes para as listas do board
        const mappedTasks = mockTasks.map((task, index) => ({
          ...task,
          listId: response.board.lists[index % response.board.lists.length].id
        }))
        setTasks(mappedTasks)
      }
      
    } catch (error: any) {
      console.error('Erro ao buscar board:', error)
      setError(error.message || "Erro ao carregar board")
      
      if (error.status === 404) {
        toast({
          title: "Board não encontrado",
          description: "O board solicitado não foi encontrado.",
          variant: "destructive",
        })
        router.push(`/stations/${stationId}`)
        return
      }
      
      if (error.status === 403) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar este board.",
          variant: "destructive",
        })
        router.push(`/stations/${stationId}`)
        return
      }
      
      toast({
        title: "Erro ao carregar board",
        description: error.message || "Não foi possível carregar o board.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBoardData()
  }, [token, boardId])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newListId = over.id as string

    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, listId: newListId } : task)))

    setActiveTask(null)
  }

  const getTasksByListId = (listId: string) => {
    return tasks.filter((task) => task.listId === listId)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-space-900">
          <Sidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin" />
              <span>Carregando board...</span>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !board) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-space-900">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center mb-6">
              <Link href={`/stations/${stationId}`}>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Station
                </Button>
              </Link>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">{error || "Board não encontrado"}</p>
              <div className="space-x-3">
                <Button onClick={fetchBoardData} variant="outline" className="border-red-500/50 text-red-400">
                  Tentar Novamente
                </Button>
                <Link href={`/stations/${stationId}`}>
                  <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                    Voltar para Station
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Converter as listas do board para o formato esperado pelo KanbanColumn
  const kanbanLists = board.lists.map(list => ({
    id: list.id,
    title: list.name,
    color: "cosmic-blue" // TODO: Implementar cor por lista
  }))

  return (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Navigation */}
          <div className="flex items-center mb-6">
            <Link href={`/stations/${stationId}`}>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Station
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
           <div>
             <h1 className="text-2xl font-bold text-white mb-1">{board.name}</h1>
             <p className="text-gray-400">{board.description || "No description provided"}</p>
             <div className="flex items-center space-x-4 mt-2">
               <span className="text-sm text-gray-400">
                 Template: {board.template_type || 'Custom'}
               </span>
               <span className="text-sm text-gray-400">
                 Created: {new Date(board.created_at).toLocaleDateString()}
               </span>
               {board.created_by_user && (
                 <span className="text-sm text-gray-400">
                   by {board.created_by_user.full_name}
                 </span>
               )}
             </div>
           </div>
           <div className="flex items-center space-x-3">
             <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
               <Filter className="w-4 h-4 mr-2" />
               Filter
             </Button>
             <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
               <Users className="w-4 h-4 mr-2" />
               Members
             </Button>
             <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
               <Settings className="w-4 h-4" />
             </Button>
             <Button onClick={() => setIsCreateModalOpen(true)} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
               <Plus className="w-4 h-4 mr-2" />
               Add Task
             </Button>
           </div>
         </div>

         {/* Kanban Board */}
         <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
           <div className="flex space-x-6 overflow-x-auto pb-6">
             {kanbanLists.map((list) => (
               <KanbanColumn key={list.id} list={list} tasks={getTasksByListId(list.id)} />
             ))}
           </div>

           <DragOverlay>
             {activeTask ? (
               <div className="rotate-5">
                 <TaskCard task={activeTask} />
               </div>
             ) : null}
           </DragOverlay>
         </DndContext>

         {/* Empty State */}
         {kanbanLists.length === 0 && (
           <div className="text-center py-12">
             <div className="w-24 h-24 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Plus className="w-12 h-12 text-cosmic-blue" />
             </div>
             <h3 className="text-white text-xl font-medium mb-2">No lists in this board</h3>
             <p className="text-gray-400 mb-6">This board doesn't have any lists yet</p>
             <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
               Add First List
             </Button>
           </div>
         )}
       </motion.div>
     </main>

     <OrbitAIWidget />
     <CreateTaskModal 
       isOpen={isCreateModalOpen} 
       onClose={() => setIsCreateModalOpen(false)} 
       lists={kanbanLists} 
     />
   </div>
 </ProtectedRoute>
 )
}