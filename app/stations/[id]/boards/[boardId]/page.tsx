"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { TaskCard } from "@/components/kanban/TaskCard"
import { CreateTaskModal } from "@/components/modals/CreateTaskModal"
import { Plus, Settings, Users, Filter } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

// Mock data for the kanban board
const mockBoard = {
  id: 1,
  name: "Mars Mission Planning",
  station: "NASA Station",
}

const mockLists = [
  { id: "todo", title: "Mission Planning", color: "cosmic-blue" },
  { id: "progress", title: "In Progress", color: "cosmic-purple" },
  { id: "review", title: "Review", color: "cosmic-cyan" },
  { id: "done", title: "Completed", color: "green" },
]

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
  {
    id: "3",
    title: "Launch Sequence Review",
    description: "Final review of launch procedures and safety protocols",
    priority: "high",
    assignee: { name: "Sally Ride", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2024-02-10",
    listId: "review",
    tags: ["safety", "procedures"],
  },
  {
    id: "4",
    title: "Mission Documentation",
    description: "Complete all mission documentation and reports",
    priority: "low",
    assignee: { name: "John Glenn", avatar: "/placeholder.svg?height=32&width=32" },
    dueDate: "2024-01-30",
    listId: "done",
    tags: ["documentation"],
  },
]

export default function KanbanBoardPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [activeTask, setActiveTask] = useState<any>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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

  return (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{mockBoard.name}</h1>
              <p className="text-gray-400">{mockBoard.station}</p>
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
              {mockLists.map((list) => (
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
        </motion.div>
      </main>

      <OrbitAIWidget />
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} lists={mockLists} />
    </div>
  </ProtectedRoute>
  )
}
