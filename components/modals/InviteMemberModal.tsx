"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Mail, Shield } from "lucide-react"

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    role: "member",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      setFormData({ email: "", role: "member", message: "" })
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
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Role</span>
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger className="bg-space-700 border-space-600 text-white">
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
