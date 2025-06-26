"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, AlertCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { TaskDetailModal } from "@/components/modals/TaskDetailModal"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    priority: "low" | "medium" | "high"
    assignee: {
      name: string
      avatar: string
    }
    dueDate: string
    tags: string[]
  }
}

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

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return AlertCircle
    case "medium":
      return Clock
    case "low":
      return Calendar
    default:
      return Calendar
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const PriorityIcon = getPriorityIcon(task.priority)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.02 }}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        className="bg-space-700/50 border-space-600 hover:border-cosmic-blue/50 transition-colors"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Priority and Due Date */}
            <div className="flex items-center justify-between">
              <Badge className={getPriorityColor(task.priority)}>
                <PriorityIcon className="w-3 h-3 mr-1" />
                {task.priority}
              </Badge>
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>

            {/* Title and Description */}
            <div>
              <h3 className="text-white font-medium text-sm mb-1">{task.title}</h3>
              <p className="text-gray-400 text-xs line-clamp-2">{task.description}</p>
            </div>

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-cosmic-blue/20 text-cosmic-blue px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Assignee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs bg-cosmic-purple/20 text-cosmic-purple">
                    {task.assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-400">{task.assignee.name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <TaskDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} task={task} />
    </motion.div>
  )
}
