"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Calendar } from "lucide-react"

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  stationId: number
}

const colorOptions = [
  { name: "Cosmic Blue", value: "cosmic-blue", color: "#64b5f6" },
  { name: "Cosmic Purple", value: "cosmic-purple", color: "#ba68c8" },
  { name: "Cosmic Cyan", value: "cosmic-cyan", color: "#4dd0e1" },
  { name: "Solar Orange", value: "orange", color: "#ff9800" },
  { name: "Nebula Pink", value: "pink", color: "#f48fb1" },
  { name: "Galaxy Green", value: "green", color: "#81c784" },
]

const templateOptions = [
  { name: "Blank Board", value: "blank", description: "Start with an empty board" },
  { name: "Kanban", value: "kanban", description: "To Do, In Progress, Done" },
  { name: "Sprint Planning", value: "sprint", description: "Backlog, Sprint, Review, Done" },
  { name: "Project Management", value: "project", description: "Planning, Development, Testing, Launch" },
]

export function CreateBoardModal({ isOpen, onClose, stationId }: CreateBoardModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "cosmic-blue",
    template: "kanban",
    dueDate: "",
    isPrivate: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      setFormData({
        name: "",
        description: "",
        color: "cosmic-blue",
        template: "kanban",
        dueDate: "",
        isPrivate: false,
      })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-space-800 border-space-600 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span>Create New Board</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Board Name
            </Label>
            <Input
              id="name"
              placeholder="Mars Mission Planning"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
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
              placeholder="Describe your board's purpose..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Template</Label>
              <Select value={formData.template} onValueChange={(value) => handleInputChange("template", value)}>
                <SelectTrigger className="bg-space-700 border-space-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-space-700 border-space-600">
                  {templateOptions.map((template) => (
                    <SelectItem key={template.value} value={template.value} className="text-white">
                      <div>
                        <p>{template.name}</p>
                        <p className="text-xs text-gray-400">{template.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">Board Color</Label>
            <div className="grid grid-cols-3 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange("color", color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? "border-white bg-space-700"
                      : "border-space-600 hover:border-gray-400"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: color.color }} />
                  <span className="text-xs text-gray-300">{color.name}</span>
                </button>
              ))}
            </div>
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
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 bg-cosmic-blue hover:bg-cosmic-blue/80"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                "Create Board"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
