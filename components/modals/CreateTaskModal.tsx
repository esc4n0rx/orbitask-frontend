"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Flag } from "lucide-react"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  lists: Array<{ id: string; title: string; color: string }>
}

export function CreateTaskModal({ isOpen, onClose, lists }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    listId: lists[0]?.id || "",
    dueDate: "",
    assignee: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        listId: lists[0]?.id || "",
        dueDate: "",
        assignee: "",
      })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-space-800 border-space-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <span>Create New Task</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Task Title
            </Label>
            <Input
              id="title"
              placeholder="Design Mars Rover"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the task details..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className="bg-space-700 border-space-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-space-700 border-space-600">
                  <SelectItem value="low" className="text-green-400">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-yellow-400">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-red-400">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">List</Label>
              <Select value={formData.listId} onValueChange={(value) => handleInputChange("listId", value)}>
                <SelectTrigger className="bg-space-700 border-space-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-space-700 border-space-600">
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id} className="text-white">
                      {list.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-gray-300 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Due Date</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className="bg-space-700 border-space-600 text-white"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-space-600 text-gray-300 hover:bg-space-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1 bg-cosmic-blue hover:bg-cosmic-blue/80"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
