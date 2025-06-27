"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Mail, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { addStationMember } from "@/lib/api/station-members"

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  stationId?: string
  onMemberAdded?: () => void
}

export function InviteMemberModal({ isOpen, onClose, stationId, onMemberAdded }: InviteMemberModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    role: "member" as "admin" | "leader" | "member",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira o email do membro.",
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

    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para adicionar membros.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await addStationMember(stationId, {
        email: formData.email.trim(),
        role: formData.role,
      }, token)

      toast({
        title: "Membro adicionado com sucesso! 👨‍🚀",
        description: `${response.member.user.full_name} foi adicionado à station como ${response.member.role}.`,
      })

      // Reset form
      setFormData({ email: "", role: "member", message: "" })
      
      // Close modal
      onClose()

      // Notify parent component
      onMemberAdded?.()
    } catch (error: any) {
      console.error('Erro ao adicionar membro:', error)
      
      let errorMessage = "Erro ao adicionar membro"
      
      if (error.message.includes('não encontrado')) {
        errorMessage = "Usuário não encontrado com este email."
      } else if (error.message.includes('conexão')) {
        errorMessage = "Erro de conexão. Verifique sua internet."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro ao adicionar membro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ email: "", role: "member", message: "" })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-space-800 border-space-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <span>Invite Team Member</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="astronaut@orbitask.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Role</span>
            </Label>
            <Select value={formData.role} onValueChange={(value: "admin" | "leader" | "member") => handleInputChange("role", value)}>
              <SelectTrigger className="bg-space-700 border-space-600 text-white" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-space-700 border-space-600">
                <SelectItem value="member" className="text-white">
                  Member - Basic access
                </SelectItem>
                <SelectItem value="leader" className="text-cosmic-cyan">
                  Leader - Can manage projects
                </SelectItem>
                <SelectItem value="admin" className="text-cosmic-purple">
                  Admin - Full station access
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">
              Personal Message (Optional)
            </Label>
            <Input
              id="message"
              placeholder="Welcome to our space mission!"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
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
             disabled={isLoading || !formData.email.trim()}
             className="flex-1 bg-cosmic-blue hover:bg-cosmic-blue/80"
           >
             {isLoading ? (
               <div className="flex items-center">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                 Sending...
               </div>
             ) : (
               "Send Invitation"
             )}
           </Button>
         </div>
       </form>
     </DialogContent>
   </Dialog>
 )
}