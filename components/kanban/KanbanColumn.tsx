"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskCard } from "./TaskCard"
import { Plus } from "lucide-react"

interface KanbanColumnProps {
  list: {
    id: string
    title: string
    color: string
  }
  tasks: any[]
}

export function KanbanColumn({ list, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: list.id,
  })

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="bg-space-800/50 border-space-600 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 bg-${list.color} rounded-full`} />
              <CardTitle className="text-white text-sm font-medium">{list.title}</CardTitle>
              <span className="text-xs text-gray-400 bg-space-700 px-2 py-1 rounded-full">{tasks.length}</span>
            </div>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
