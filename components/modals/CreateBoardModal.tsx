"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Calendar, Palette } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { createBoard } from "@/lib/api/boards"
import { getBoardTemplates } from "@/lib/api/board-templates"
import { BoardTemplate } from "@/types/board"

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  stationId: string
  onBoardCreated?: () => void
}

const colorOptions = [
  { name: "Cosmic Blue", value: "#64b5f6", css: "cosmic-blue" },
  { name: "Cosmic Purple", value: "#ba68c8", css: "cosmic-purple" },
  { name: "Cosmic Cyan", value: "#4dd0e1", css: "cosmic-cyan" },
  { name: "Solar Orange", value: "#ff9800", css: "orange" },
  { name: "Nebula Pink", value: "#f48fb1", css: "pink" },
  { name: "Galaxy Green", value: "#81c784", css: "green" },
]

export function CreateBoardModal({ isOpen, onClose, stationId, onBoardCreated }: CreateBoardModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#64b5f6",
    template: "kanban",
    dueDate: "",
    isPrivate: false,
  })
  const [templates, setTemplates] = useState<BoardTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  // Buscar templates quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true)
    try {
      const response = await getBoardTemplates()
      setTemplates(response.templates)
    } catch (error: any) {
      console.error('Erro ao buscar templates:', error)
      // Se falhar, usar templates padrão
      setTemplates([
        { id: "kanban", name: "Kanban Básico", description: "Template padrão com fluxo básico de trabalho" },
        { id: "sprint", name: "Sprint Agile", description: "Template para metodologia ágil com sprint planning" },
        { id: "personal", name: "Personal", description: "Template para tarefas pessoais" },
        { id: "bugs", name: "Bug Tracking", description: "Template para rastreamento de bugs" },
      ])
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o board.",
        variant: "destructive",
      })
      return
    }

    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um board.",
        variant: "destructive",
      })
      return
    }

    if (!stationId) {
      toast({
        title: "Erro",
        description: "ID da station não fornecido.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await createBoard(stationId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        template: formData.template,
        color: formData.color,
      }, token)

      toast({
        title: "Board criado com sucesso! 🚀",
        description: `${response.board.name} foi criado e está pronto para suas tarefas.`,
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        color: "#64b5f6",
        template: "kanban",
        dueDate: "",
        isPrivate: false,
      })
      
      // Close modal
      onClose()

      // Notify parent component
      onBoardCreated?.()
    } catch (error: any) {
      console.error('Erro ao criar board:', error)
      
      let errorMessage = "Erro ao criar board"
      
      if (error.message.includes('conexão')) {
        errorMessage = "Erro de conexão. Verifique sua internet."
      } else if (error.status === 403) {
        errorMessage = "Você não tem permissão para criar boards nesta station."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro ao criar board",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        description: "",
        color: "#64b5f6",
        template: "kanban",
        dueDate: "",
        isPrivate: false,
      })
      onClose()
    }
  }

  const selectedTemplate = templates.find(t => t.id === formData.template)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              disabled={isLoading}
              maxLength={100}
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
              disabled={isLoading}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Template</Label>
              <Select 
                value={formData.template} 
                onValueChange={(value) => handleInputChange("template", value)}
                disabled={isLoading || isLoadingTemplates}
              >
                <SelectTrigger className="bg-space-700 border-space-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-space-700 border-space-600">
                  {isLoadingTemplates ? (
                    <SelectItem value="loading" className="text-gray-400" disabled>
                      Loading templates...
                    </SelectItem>
                  ) : (
                    templates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="text-white">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-gray-400">{template.description}</p>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <p className="text-xs text-gray-400">{selectedTemplate.description}</p>
              )}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300 flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Board Color</span>
            </Label>
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
                  disabled={isLoading}
                >
                  <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: color.value }} />
                  <span className="text-xs text-gray-300">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-space-600 text-gray-300 hover:bg-space-700"
              disabled={isLoading}
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